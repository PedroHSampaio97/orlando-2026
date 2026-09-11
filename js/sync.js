/* =============================================================================
   SINCRONIZAÇÃO COM A NUVEM — Fase 6, etapa 2
   -----------------------------------------------------------------------------
   O app continua local-first: tudo é escrito primeiro no aparelho, em estado.js,
   sem depender de rede. Isto aqui é ESPELHO, nunca fonte. Sem sinal, o app
   funciona igual — é a promessa que o service worker cumpre e que este arquivo
   não pode quebrar.

   Sem SDK, de propósito: o precache do service worker é atômico e só do próprio
   domínio, então um script de CDN ficaria fora do cache e derrubaria o offline no
   primeiro carregamento frio. São quatro chamadas: login, refresh, upsert, select.

   O CONFLITO É RESOLVIDO NO CLIENTE, pelo merge campo a campo que já existe
   (Estado.importar). O servidor guarda uma linha por aparelho e não decide nada.

   A chave abaixo é publicável e o repositório é público: quem protege os dados é
   o RLS do Postgres, que só devolve as linhas da conta logada. A service_role
   nunca chega aqui.
   ========================================================================== */

window.Sync = (function () {
  'use strict';

  const URL_BASE = 'https://ahpuqxztdbfzfdrqsomy.supabase.co';
  const CHAVE_PUB = 'sb_publishable_zHIOL4s2V2cUJlZ-Tuwpeg_5H5O6LjI';
  const CHAVE_SESSAO = 'orlando2026:sessao';
  const CHAVE_ULTIMO = 'orlando2026:ultimo-sync';
  // Sobrevive a fechar o app: marcação feita no parque, sem sinal, continua
  // cobrando envio quando a rede voltar.
  const CHAVE_PENDENTE = 'orlando2026:sync-pendente';
  const ESPERA_ENVIO = 4000;

  // O que NUNCA sobe. Decisão de 11/09: telefone e apólice do seguro ficam no
  // aparelho, cruzando só pelo exportar/importar.
  const GRUPOS_LOCAIS = ['pessoais'];

  const E = window.Estado;
  const $ = (s) => document.querySelector(s);

  let sessao = null;     // { access_token, refresh_token, expira_em, email }
  let ocupado = false;
  let ultimoErro = null;
  let aplicandoRemoto = false;    // merge vindo do servidor não conta como edição local
  let timerEnvio = null;
  let chegouCoisaNova = false;    // mudou algo debaixo de uma tela já pintada

  /* ---------------------------------------------------------------------------
     Sessão — guardada só neste aparelho.
     ------------------------------------------------------------------------ */
  function lerSessao() {
    try {
      const bruto = localStorage.getItem(CHAVE_SESSAO);
      sessao = bruto ? JSON.parse(bruto) : null;
    } catch (e) { sessao = null; }
    return sessao;
  }
  function gravarSessao(s) {
    sessao = s;
    try {
      if (s) localStorage.setItem(CHAVE_SESSAO, JSON.stringify(s));
      else localStorage.removeItem(CHAVE_SESSAO);
    } catch (e) {}
  }
  const conectado = () => !!(sessao && sessao.access_token);
  function ultimoSync() {
    try { return localStorage.getItem(CHAVE_ULTIMO); } catch (e) { return null; }
  }
  function haPendente() {
    try { return localStorage.getItem(CHAVE_PENDENTE) === '1'; } catch (e) { return false; }
  }
  function marcarPendente(v) {
    try {
      if (v) localStorage.setItem(CHAVE_PENDENTE, '1');
      else localStorage.removeItem(CHAVE_PENDENTE);
    } catch (e) {}
  }
  const temRede = () => navigator.onLine !== false;

  /* ---------------------------------------------------------------------------
     Chamadas
     ------------------------------------------------------------------------ */
  function chamar(caminho, opcoes) {
    const o = opcoes || {};
    const cab = Object.assign({
      'apikey': CHAVE_PUB,
      'Content-Type': 'application/json',
    }, o.headers || {});
    if (o.comToken && sessao) cab['Authorization'] = 'Bearer ' + sessao.access_token;

    return fetch(URL_BASE + caminho, {
      method: o.method || 'GET',
      headers: cab,
      body: o.body ? JSON.stringify(o.body) : undefined,
    }).then(function (r) {
      return r.text().then(function (txt) {
        let corpo = null;
        try { corpo = txt ? JSON.parse(txt) : null; } catch (e) { corpo = { bruto: txt }; }
        if (!r.ok) {
          const erro = new Error(mensagemDeErro(r.status, corpo));
          erro.status = r.status;
          erro.corpo = corpo;
          throw erro;
        }
        return corpo;
      });
    });
  }

  // Mensagem em português e específica. Erro genérico é o que faz o usuário
  // achar que perdeu dado quando não perdeu nada.
  function mensagemDeErro(status, corpo) {
    const msg = (corpo && (corpo.error_description || corpo.msg || corpo.message)) || '';
    if (status === 400 && /invalid login|credentials/i.test(msg)) {
      return 'E-mail ou senha não conferem.';
    }
    if (status === 400 && /email not confirmed/i.test(msg)) {
      return 'A conta existe, mas o e-mail ainda não foi confirmado.';
    }
    if (status === 401 || status === 403) {
      return 'A sessão expirou ou não tem permissão. Entre de novo.';
    }
    if (status === 429) return 'Muitas tentativas seguidas. Esperem um minuto.';
    if (status >= 500) return 'O servidor não respondeu agora. Seus dados estão no aparelho.';
    return msg || ('Falha de rede (' + status + ').');
  }

  function entrar(email, senha) {
    return chamar('/auth/v1/token?grant_type=password', {
      method: 'POST', body: { email: email, password: senha },
    }).then(function (r) {
      gravarSessao({
        access_token: r.access_token,
        refresh_token: r.refresh_token,
        expira_em: Date.now() + (r.expires_in || 3600) * 1000,
        email: email,
        usuario: r.user && r.user.id,
      });
      return sessao;
    });
  }

  function renovar() {
    if (!sessao || !sessao.refresh_token) return Promise.reject(new Error('Sem sessão.'));
    return chamar('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST', body: { refresh_token: sessao.refresh_token },
    }).then(function (r) {
      gravarSessao({
        access_token: r.access_token,
        refresh_token: r.refresh_token,
        expira_em: Date.now() + (r.expires_in || 3600) * 1000,
        email: sessao.email,
        usuario: (r.user && r.user.id) || sessao.usuario,
      });
      return sessao;
    });
  }

  // Renova antes de usar, com um minuto de folga: token que vence no meio da
  // chamada vira erro 401 que assusta à toa.
  function comSessaoValida() {
    if (!conectado()) return Promise.reject(new Error('Entre na conta da viagem primeiro.'));
    if (sessao.expira_em && sessao.expira_em - Date.now() > 60000) return Promise.resolve(sessao);
    return renovar();
  }

  function sair() {
    const tinha = conectado();
    const fim = tinha
      ? chamar('/auth/v1/logout', { method: 'POST', comToken: true }).catch(function () {})
      : Promise.resolve();
    return fim.then(function () { gravarSessao(null); pintar(); });
  }

  /* ---------------------------------------------------------------------------
     Corpo do sync
     ------------------------------------------------------------------------ */
  // Cópia sem os grupos que não saem do aparelho. Cópia mesmo: mexer no objeto
  // vivo do Estado apagaria a apólice da tela.
  function cargaLocal() {
    const copia = JSON.parse(JSON.stringify(E.bruto()));
    GRUPOS_LOCAIS.forEach(function (g) { delete copia[g]; });
    return copia;
  }

  function enviar() {
    return comSessaoValida().then(function (s) {
      return chamar('/rest/v1/snapshots', {
        method: 'POST', comToken: true,
        headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
        body: {
          user_id: s.usuario,
          dispositivo: E.bruto().dispositivo,
          estado: cargaLocal(),
        },
      });
    });
  }

  function buscar() {
    const meu = E.bruto().dispositivo;
    return comSessaoValida().then(function () {
      return chamar('/rest/v1/snapshots?select=dispositivo,estado,atualizado_em', {
        comToken: true,
      });
    }).then(function (linhas) {
      let aplicados = 0, deOutros = 0;
      // O merge grava, e gravar avisa os ouvintes. Sem esta trava, o que chega
      // do outro celular seria tratado como edição nossa e voltaria para o
      // servidor num vaivém sem fim.
      aplicandoRemoto = true;
      try {
        (linhas || []).forEach(function (l) {
          if (!l || l.dispositivo === meu || !l.estado) return;
          deOutros++;
          const r = E.importar(JSON.stringify(l.estado), 'mesclar');
          aplicados += (r && r.aplicados > 0) ? r.aplicados : 0;
        });
      } finally {
        setTimeout(function () { aplicandoRemoto = false; }, 0);
      }
      return { aparelhos: deOutros, aplicados: aplicados };
    });
  }

  function sincronizar(silencioso) {
    if (ocupado) return Promise.resolve(null);
    if (!temRede()) {
      ultimoErro = silencioso ? null : 'Sem internet agora. O que está marcado continua aqui e sobe sozinho quando a rede voltar.';
      pintar();
      return silencioso ? Promise.resolve(null) : Promise.reject(new Error(ultimoErro));
    }
    ocupado = true; ultimoErro = null; pintar();
    return enviar()
      .then(buscar)
      .then(function (r) {
        try { localStorage.setItem(CHAVE_ULTIMO, new Date().toISOString()); } catch (e) {}
        marcarPendente(false);
        ocupado = false;
        if (r && r.aplicados > 0) {
          chegouCoisaNova = true;
          if (window.AppNav && AppNav.repintarHome) AppNav.repintarHome();
        }
        pintar();
        return r;
      })
      .catch(function (e) {
        ocupado = false; ultimoErro = e.message; pintar();
        if (silencioso) return null;
        throw e;
      });
  }

  // Toda escrita local agenda um envio. O debounce existe porque marcar cinco
  // blocos seguidos são cinco gravações e tem de ser um envio só.
  function agendarEnvio() {
    marcarPendente(true);
    if (!conectado()) { pintar(); return; }
    if (timerEnvio) clearTimeout(timerEnvio);
    timerEnvio = setTimeout(function () {
      timerEnvio = null;
      sincronizar(true);
    }, ESPERA_ENVIO);
    pintar();
  }

  function resumo() {
    return {
      conectado: conectado(), pendente: haPendente(), ultimo: ultimoSync(),
      erro: ultimoErro, online: temRede(), novidade: chegouCoisaNova,
    };
  }

  /* ---------------------------------------------------------------------------
     Painel em Ajustes
     ------------------------------------------------------------------------ */
  const doisDig = (n) => (n < 10 ? '0' : '') + n;
  function horaCurta(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d)) return null;
    const hoje = new Date();
    const mesmoDia = d.toDateString() === hoje.toDateString();
    const hora = doisDig(d.getHours()) + ':' + doisDig(d.getMinutes());
    return mesmoDia ? ('hoje às ' + hora)
                    : (doisDig(d.getDate()) + '/' + doisDig(d.getMonth() + 1) + ' às ' + hora);
  }

  function pintar() {
    const alvo = $('#painel-nuvem');
    if (!alvo) return;
    alvo.innerHTML = '';

    const ajuda = document.createElement('p');
    ajuda.className = 'sync-ajuda';
    ajuda.innerHTML = conectado()
      ? 'Os dois celulares entram na <strong>mesma conta</strong> e cada um guarda a sua ' +
        'própria cópia. O que volta do outro aparelho passa pelo mesmo Mesclar de sempre: ' +
        'ninguém apaga o trabalho do outro. O telefone e a apólice do seguro <strong>não ' +
        'sobem</strong> — esses só cruzam pelo arquivo, aqui embaixo.'
      : 'Entrem com a conta da viagem para os dois celulares se acertarem sozinhos. ' +
        'Enquanto não entrarem, o app funciona igual: tudo continua guardado neste aparelho.';
    alvo.appendChild(ajuda);

    const estado = document.createElement('div');
    if (ultimoErro) {
      estado.className = 'aviso perigo';
      estado.innerHTML = '<strong>Não consegui sincronizar</strong>';
      estado.appendChild(document.createTextNode(ultimoErro +
        ' Nada se perdeu: o que está neste aparelho continua aqui.'));
    } else if (ocupado) {
      estado.className = 'aviso info';
      estado.innerHTML = '<strong>Sincronizando…</strong>';
      estado.appendChild(document.createTextNode('Enviando este aparelho e buscando o outro.'));
    } else if (conectado() && !temRede()) {
      estado.className = 'aviso';
      estado.innerHTML = '<strong>Sem internet</strong>';
      estado.appendChild(document.createTextNode(
        'O app está guardando tudo aqui e sobe sozinho quando a rede voltar.'));
    } else if (conectado()) {
      const q = horaCurta(ultimoSync());
      estado.className = 'aviso bom';
      estado.innerHTML = '<strong>' + (haPendente() ? 'Conectado · falta enviar' : 'Conectado') + '</strong>';
      estado.appendChild(document.createTextNode(
        (sessao.email ? sessao.email + '. ' : '') +
        (haPendente()
          ? 'Há mudanças deste aparelho ainda não enviadas; elas sobem em instantes.'
          : (q ? 'Última sincronização ' + q + '.' : 'Ainda não sincronizou neste aparelho.'))));
      if (chegouCoisaNova) {
        estado.appendChild(document.createTextNode(
          ' Chegou coisa nova do outro celular: recarregue para ver na tela do dia.'));
      }
    } else {
      estado.className = 'aviso';
      estado.innerHTML = '<strong>Fora da conta</strong>';
      estado.appendChild(document.createTextNode(
        'Este aparelho está guardando tudo só localmente.'));
    }
    alvo.appendChild(estado);

    if (conectado()) {
      const linha = document.createElement('div');
      linha.className = 'sync-linha';
      linha.innerHTML = '<span class="sync-rot">Conta</span>';
      const botoes = document.createElement('div');
      botoes.className = 'sync-botoes';

      const bSync = document.createElement('button');
      bSync.className = 'btn-secundario destaque';
      bSync.id = 'btn-nuvem-sync';
      bSync.textContent = ocupado ? 'Sincronizando…' : 'Sincronizar agora';
      bSync.disabled = ocupado;
      bSync.addEventListener('click', function () {
        sincronizar().then(function (r) {
          if (r && r.aplicados > 0) location.reload();
        }).catch(function () {});
      });

      const bSair = document.createElement('button');
      bSair.className = 'btn-secundario';
      bSair.id = 'btn-nuvem-sair';
      bSair.textContent = 'Sair';
      bSair.addEventListener('click', function () { sair(); });

      botoes.appendChild(bSync);
      botoes.appendChild(bSair);
      linha.appendChild(botoes);
      alvo.appendChild(linha);
      return;
    }

    const form = document.createElement('form');
    form.className = 'nuvem-form';
    form.id = 'form-nuvem';
    form.autocomplete = 'on';

    const email = document.createElement('input');
    email.type = 'email'; email.id = 'nuvem-email'; email.className = 'sync-campo';
    email.placeholder = 'E-mail da conta da viagem';
    email.autocomplete = 'username'; email.required = true;
    email.setAttribute('aria-label', 'E-mail da conta da viagem');

    const senha = document.createElement('input');
    senha.type = 'password'; senha.id = 'nuvem-senha'; senha.className = 'sync-campo';
    senha.placeholder = 'Senha';
    senha.autocomplete = 'current-password'; senha.required = true;
    senha.setAttribute('aria-label', 'Senha');

    const bEntrar = document.createElement('button');
    bEntrar.type = 'submit'; bEntrar.className = 'btn-secundario destaque';
    bEntrar.id = 'btn-nuvem-entrar'; bEntrar.textContent = 'Entrar';

    form.appendChild(email);
    form.appendChild(senha);
    form.appendChild(bEntrar);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      bEntrar.disabled = true; bEntrar.textContent = 'Entrando…';
      entrar(email.value.trim(), senha.value)
        .then(function () {
          ultimoErro = null;
          return sincronizar();
        })
        .then(function (r) {
          if (r && r.aplicados > 0) location.reload(); else pintar();
        })
        .catch(function (e) {
          ultimoErro = e.message;
          pintar();
        });
    });
    alvo.appendChild(form);
  }

  function ligar() {
    lerSessao();
    pintar();

    if (E.aoSalvar) {
      E.aoSalvar(function () { if (!aplicandoRemoto) agendarEnvio(); });
    }

    // Rede voltou: sobe o que ficou para trás. Rede caiu: só muda o aviso.
    window.addEventListener('online', function () {
      if (conectado()) sincronizar(true); else pintar();
    });
    window.addEventListener('offline', pintar);

    // Voltar para o app conta como abrir: é quando o outro celular pode ter
    // marcado coisa enquanto este estava no bolso.
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && conectado() && temRede()) {
        sincronizar(true);
      }
    });

    // No arranque, sem competir com a primeira pintura.
    if (conectado() && temRede()) {
      setTimeout(function () { sincronizar(true); }, 1200);
    }
  }

  return {
    ligar: ligar, pintar: pintar,
    entrar: entrar, sair: sair, renovar: renovar,
    sincronizar: sincronizar, enviar: enviar, buscar: buscar,
    conectado: conectado, ultimoSync: ultimoSync, resumo: resumo,
    cargaLocal: cargaLocal,   // o teste confere que `pessoais` não está aqui
  };
})();
