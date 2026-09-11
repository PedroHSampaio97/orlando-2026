/* =============================================================================
   Orlando 2026 — interface
   Home por urgência · timeline com trilho na cor da operadora · linha do agora
   ========================================================================== */

(function () {
  'use strict';

  const R = window.ROTEIRO;
  const E = window.Estado;
  const $ = (s) => document.querySelector(s);

  const el = (tag, cls, texto) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texto != null) n.textContent = texto;
    return n;
  };
  function svg(d, extra) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    if (extra) s.setAttribute('class', extra);
    String(d).split('|').forEach(function (p) {
      const n = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      n.setAttribute('d', p);
      s.appendChild(n);
    });
    return s;
  }

  /* ---------------------------------------------------------------------------
     Tempo — minutos desde a meia-noite, datas civis puras
     ------------------------------------------------------------------------ */
  const paraMin = (h) => { const p = String(h).split(':'); return (+p[0]) * 60 + (+p[1]); };
  const paraHora = (m) => {
    m = ((Math.round(m) % 1440) + 1440) % 1440;
    return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  };
  const hojeISO = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
           String(d.getDate()).padStart(2, '0');
  };
  const agoraMin = () => new Date().getHours() * 60 + new Date().getMinutes();
  const diasEntre = (a, b) =>
    Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
  const MES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const ddmm = (iso) => { const p = iso.split('-'); return (+p[2]) + '/' + p[1]; };
  const dataExtenso = (iso) => {
    const p = iso.split('-');
    return (+p[2]) + ' de ' + ['janeiro','fevereiro','março','abril','maio','junho','julho',
      'agosto','setembro','outubro','novembro','dezembro'][(+p[1]) - 1];
  };
  const plural = (n, s, p) => n + ' ' + (Math.abs(n) === 1 ? s : p);

  /* ---------------------------------------------------------------------------
     Cor da operadora — é o que faz os 17 dias parecerem 17 dias
     ------------------------------------------------------------------------ */
  function chaveOp(dia) {
    if (dia.operadora) return dia.operadora;
    if (dia.tipo === 'logistica') return 'logistica';
    return 'livre';
  }
  const corOp = (dia) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue('--op-' + chaveOp(dia)).trim() || '#0E4C5E';

  /* ---------------------------------------------------------------------------
     Horário efetivo dos blocos
     ------------------------------------------------------------------------ */
  function refDoDia(dia) {
    if (!dia.referencia) return null;
    return E.referencia(dia.id) || dia.referencia.padrao;
  }
  function refEditada(dia) {
    return !!(dia.referencia && E.referencia(dia.id) &&
              E.referencia(dia.id) !== dia.referencia.padrao);
  }
  const ancoraDe = (b) => E.ancora(b.id) || b.ancora;
  // Hora oficial confirmada perto da data. O desfile e os fogos carregam o selo
  // "confirmar horario" e ate agora nao havia onde escrever a resposta.
  const horaDe = (b) => E.horaBloco(b.id) || b.hora;

  function blocosDoDia(dia) {
    const padrao = dia.referencia ? paraMin(dia.referencia.padrao) : null;
    const real   = dia.referencia ? paraMin(refDoDia(dia)) : null;
    const delta  = padrao === null ? 0 : real - padrao;

    const lista = dia.blocos.map(function (b) {
      const anc = ancoraDe(b);
      const base = paraMin(horaDe(b));
      const efet = (anc === 'referencia' && padrao !== null) ? base + delta : base;
      return { dados: b, ancora: anc, minOriginal: base, min: efet,
               hora: paraHora(efet), deslocado: efet !== base, colisao: null };
    });
    lista.sort((a, b) => a.min - b.min || a.minOriginal - b.minOriginal);

    // (1) não cabe: o bloco ainda estaria acontecendo quando o próximo começa.
    // É ESTE o aviso que faltava. A versão antiga comparava só início contra
    // início, com limiar de 15 min — então um atraso de 1h30 no dia 10 não
    // gerava alerta nenhum, e o cartão do Disney Springs seguia prometendo
    // 1h40 de passeio com quinze minutos até o jantar. Com `duracaoMin`, o
    // aperto aparece na hora em que o tempo deixa de caber, não depois que a
    // ordem já inverteu.
    for (let i = 1; i < lista.length; i++) {
      const a = lista[i - 1], b = lista[i];
      const dur = a.dados.duracaoMin;
      if (!dur) continue;
      // `duracaoMin` e so o tempo DENTRO do bloco. A travessia entre areas do
      // parque entra aqui, por fora — e um bloco de deslocamento JA E a
      // travessia, entao nao se soma outra por cima dele.
      const anda = (a.dados.tipo === 'deslocamento' || b.dados.tipo === 'deslocamento')
        ? 0
        : (travessia(dia, a.dados.areaParque, b.dados.areaParque) || {}).min || 0;
      const precisa = dur + anda;
      // Sem isenção por localId: o Boathouse fica DENTRO do Disney Springs e
      // mesmo assim é hora marcada. Quem separa etapa de compromisso é a
      // duração declarada, não o endereço.
      // Fusos diferentes: 01h40 no Rio ate 06h00 em Bogota sao 6h20 de voo, nao
      // 4h20. O `hora` de cada bloco esta no relogio local dele, entao comparar
      // os dois na mao daria alerta falso todo dia. Sem conversao, nao opinamos.
      if (a.dados.fuso && b.dados.fuso && a.dados.fuso !== b.dados.fuso) continue;
      const sobra = b.min - a.min;
      if (sobra >= precisa) continue;
      a.colisao = a.colisao ||
        'NÃO CABE: sobram ' + intervaloTexto(Math.max(sobra, 0)) + ', o bloco leva ' +
        intervaloTexto(dur) +
        (anda ? ' e são ' + intervaloTexto(anda) + ' de caminhada' : '') +
        '. Faltam ' + intervaloTexto(precisa - sobra) +
        ' para "' + b.dados.titulo + '"' +
        (b.ancora === 'fixo' ? ', que tem hora marcada e não desloca.' : '.');
    }

    // (2) inversão: o deslocamento jogou um bloco para depois de outro que ele
    // deveria preceder. É o caso do voo atrasado que empurra o passeio para
    // depois do jantar — aperto nenhum, ordem completamente errada.
    for (let i = 0; i < lista.length; i++) {
      for (let j = i + 1; j < lista.length; j++) {
        const a = lista[i], b = lista[j];
        if (a.minOriginal <= b.minOriginal) continue;
        // A culpa é de quem se moveu, não de quem ficou parado.
        const moveu = b.deslocado ? b : (a.deslocado ? a : b);
        const outro = moveu === b ? a : b;
        // A frase precisa seguir a direção do movimento. Escrita só para o
        // caso do atraso, ela dizia o oposto quando o parque abria mais cedo.
        const caiu = (moveu === b);
        moveu.colisao = moveu.colisao || (caiu
          ? 'Caiu para depois de "' + outro.dados.titulo +
            '", que no plano vinha só depois deste bloco.'
          : 'Subiu para antes de "' + outro.dados.titulo +
            '", que no plano vinha antes deste bloco.');
      }
    }
    return lista;
  }

  const contarFeitos = (dia) => dia.blocos.filter((b) => E.feito(b.id)).length;
  const contaveis = (dia) => dia.blocos.filter((b) => b.tipo !== 'vazio');

  /* ---------------------------------------------------------------------------
     Navegação
     ------------------------------------------------------------------------ */
  const diaDeHoje = () => R.dias.find((d) => d.data === hojeISO()) || null;
  let diaAtual = diaDeHoje() || R.dias[0];
  // O iOS mata a pagina em segundo plano num dia de 14 horas. Sem persistir,
  // o filtro voltava desmarcado toda vez que eles reabriam o app.
  const CHAVE_FILTRO = 'orlando2026:so-falta';
  let soFalta = false;
  try { soFalta = localStorage.getItem(CHAVE_FILTRO) === '1'; } catch (e) { soFalta = false; }

  const TELAS = ['home', 'dia', 'comer', 'guia', 'pendencias', 'ajustes'];

  function aplicarCorTopo(dia) {
    const raiz = $('#topo');
    raiz.setAttribute('data-op', dia ? chaveOp(dia) : 'logistica');
    const m = document.querySelector('meta[name="theme-color"]');
    // A barra do sistema acompanha o topo, e o topo muda de cor com o tema.
    if (m) m.setAttribute('content', corOp(dia || { tipo: 'logistica' }));
  }

  function mostrarTela(nome) {
    if (fecharEditor) fecharEditor();
    TELAS.forEach(function (t) {
      const alvo = $('#tela-' + t);
      if (alvo) alvo.classList.toggle('oculto', t !== nome);
    });
    document.querySelectorAll('.aba').forEach(function (a) {
      a.classList.toggle('ativa', a.dataset.tela === nome);
    });
    window.scrollTo(0, 0);

    if (nome === 'dia') {
      aplicarCorTopo(diaAtual);
      pintarDia();
      // Toda abertura caia no topo da tela, e num dia de parque sao 21 cartoes
      // ate o agora. Se o dia e hoje, a tela abre onde eles estao.
      if (diaAtual.data === hojeISO()) rolarAteAgora();
    }
    else {
      aplicarCorTopo(null);
      if (nome === 'home') pintarHome();
      else if (nome === 'comer') Fase3.pintarRestaurantes();
      else if (nome === 'guia') Fase4.pintarGuia();
      else if (nome === 'pendencias') Fase3.pintarPendencias();
      else if (nome === 'ajustes') Fase5.pintarAjustes();
    }
  }
  function irParaDia(dia) { diaAtual = dia; mostrarTela('dia'); }
  window.AppNav = { irParaDia: irParaDia, mostrarTela: mostrarTela,
                    repintarHome: function () {
                      // Chamado quando o service worker responde: o cartao de
                      // saude da Home foi pintado antes da resposta chegar.
                      if (!$('#tela-home').classList.contains('oculto')) pintarHome();
                    },
                    acharDia: (id) => R.dias.find((d) => d.id === id) };

  /* =========================================================================
     HOME — ordenada por urgência
     ====================================================================== */
  function pendenciasAbertas() {
    const hoje = hojeISO();
    return R.checklist
      // Passada a validade, a pendência não cobra mais: vai para o grupo próprio
      // na aba Pendências e sai da Home e do selo.
      .filter((c) => !E.checkFeito(c.id) && !(c.validaAte && c.validaAte < hoje))
      .map(function (c) {
        const data = E.dataChecklist(c.id) || c.dataAlvo;
        return { c: c, data: data, faltam: diasEntre(hoje, data) };
      })
      .sort((a, b) => a.faltam - b.faltam);
  }

  function pintarHome() {
    const hoje = hojeISO();
    const dHoje = diaDeHoje();
    const faltamViagem = diasEntre(hoje, R.viagem.inicio);

    /* faixa fina */
    const f = $('#faixa-viagem');
    f.innerHTML = '';
    if (dHoje) {
      const n = diasEntre(R.viagem.inicio, hoje) + 1;
      f.appendChild(el('b', null, 'Dia ' + n + ' de ' + R.dias.length));
      f.appendChild(document.createTextNode('· ' + dHoje.titulo));
    } else if (faltamViagem > 0) {
      f.appendChild(el('b', null, 'faltam ' + faltamViagem));
      f.appendChild(document.createTextNode(faltamViagem === 1 ? 'dia' : 'dias'));
    } else {
      f.appendChild(el('b', null, 'viagem concluída'));
    }
    f.appendChild(el('span', null, '10 a 26 nov 2026'));

    pintarCartaoAcao(dHoje);
    pintarSaude();
    pintarHomePendencias();
    pintarListaDias();
    pintarResumo();
  }

  /* O herói da Home: o que exige ação agora */
  function pintarCartaoAcao(dHoje) {
    const alvo = $('#cartao-acao');
    alvo.innerHTML = '';
    const card = el('div', 'acao');

    if (dHoje) {
      /* durante a viagem: o dia de hoje */
      card.setAttribute('data-op', chaveOp(dHoje));
      const total = contaveis(dHoje).length, feitos = contarFeitos(dHoje);
      const m = momentosDoDia(dHoje);

      const rot = el('div', 'acao-rot');
      rot.appendChild(document.createTextNode('hoje · ' + dHoje.emoji + ' ' + dHoje.titulo));
      card.appendChild(rot);

      // Durante a viagem o cartão responde três perguntas: o que é agora, o que
      // vem depois e qual é a próxima mesa com hora marcada.
      if (m.emCurso) {
        card.appendChild(el('div', 'acao-agora', 'Agora · ' + m.emCurso.dados.titulo + ' · até ' +
          paraHora(m.emCurso.min + (m.emCurso.dados.duracaoMin || 0))));
      }
      if (m.aSeguir) {
        const falta = m.aSeguir.min - agoraMin();
        card.appendChild(el('div', 'acao-prazo', m.aSeguir.hora));
        card.appendChild(el('div', 'acao-titulo', 'A seguir · ' + m.aSeguir.dados.titulo));
        card.appendChild(el('div', 'acao-meta', falta <= 0 ? 'agora' : 'em ' + intervaloTexto(falta)));
      } else if (!m.emCurso) {
        card.appendChild(el('div', 'acao-prazo', feitos + '/' + total));
        card.appendChild(el('div', 'acao-titulo', 'Nada mais marcado para hoje'));
      }
      const res = proximaReserva();
      if (res) {
        card.appendChild(el('div', 'acao-reserva', 'Próxima reserva · ' +
          (res.r.data === hojeISO() ? 'hoje' : ddmm(res.r.data)) + ' às ' + res.r.hora + ' · ' +
          res.r.nome + (res.conf ? ' · confirmação ' + res.conf : '')));
      }
      const prog = el('div', 'acao-prog');
      prog.appendChild(el('i')).style.width = (total ? (feitos / total) * 100 : 0) + '%';
      card.appendChild(prog);

      const b = el('button', 'acao-botao', 'Abrir o roteiro de hoje');
      b.addEventListener('click', function () { irParaDia(dHoje); });
      card.appendChild(b);

    } else {
      /* antes da viagem: a pendência mais próxima */
      const abertas = pendenciasAbertas();
      const atrasadas = abertas.filter((p) => p.faltam < 0).length;
      const prox = abertas[0];

      if (!prox) {
        card.appendChild(el('div', 'acao-rot', 'tudo em ordem'));
        card.appendChild(el('div', 'acao-prazo', '✓'));
        card.appendChild(el('div', 'acao-titulo', 'Nenhuma pendência aberta'));
      } else {
        card.setAttribute('data-op', prox.faltam < 0 ? 'universal' : 'logistica');
        card.appendChild(el('div', 'acao-rot',
          prox.faltam < 0 ? 'atrasada' : 'próxima pendência'));
        card.appendChild(el('div', 'acao-prazo',
          prox.faltam < 0 ? plural(-prox.faltam, 'dia', 'dias') :
          prox.faltam === 0 ? 'hoje' : plural(prox.faltam, 'dia', 'dias')));
        card.appendChild(el('div', 'acao-titulo', prox.c.texto));
        card.appendChild(el('div', 'acao-meta',
          dataExtenso(prox.data) + (prox.c.hora ? ' às ' + prox.c.hora + ' ' +
            (prox.c.fuso || '') : '') +
          (atrasadas ? '  ·  ' + plural(atrasadas, 'atrasada', 'atrasadas') : '')));
        const b = el('button', 'acao-botao', 'Ver todas as pendências');
        b.addEventListener('click', function () { mostrarTela('pendencias'); });
        card.appendChild(b);
      }
    }
    alvo.appendChild(card);
  }

  /* As duas promessas do app — funcionar sem sinal e sincronizar entre os dois
     celulares — dependiam de alguem lembrar de abrir a engrenagem. Quem nunca
     abriu embarcava achando que estava tudo certo. Agora a Home cobra. */
  function pintarSaude() {
    const alvo = $('#home-saude');
    alvo.innerHTML = '';
    const avisos = [];

    const ultimo = E.ultimoExport ? E.ultimoExport() : null;
    if (!ultimo) {
      avisos.push('Vocês nunca exportaram. Tudo o que foi marcado existe só neste ' +
                  'aparelho: se ele sumir, some junto.');
    } else {
      const dias = diasEntre(ultimo.slice(0, 10), hojeISO());
      if (dias >= 3) {
        avisos.push('Última exportação há ' + dias + ' dias. Exportem e mandem para o ' +
                    'outro celular — é assim que os dois roteiros voltam a bater.');
      }
    }

    if (window.Fase5 && Fase5.cacheIncompleto && Fase5.cacheIncompleto()) {
      avisos.push('O app ainda não está guardado por inteiro no aparelho. Enquanto ' +
                  'isso, ele não funciona sem internet.');
    }
    if (!avisos.length) return;

    const cx = el('div', 'saude');
    avisos.forEach(function (a) { cx.appendChild(el('div', 'saude-item', a)); });
    const b = el('button', 'saude-btn', 'Abrir ajustes');
    b.addEventListener('click', function () { mostrarTela('ajustes'); });
    cx.appendChild(b);
    alvo.appendChild(cx);
  }

  function pintarHomePendencias() {
    const alvo = $('#home-pendencias');
    alvo.innerHTML = '';
    const hoje = hojeISO();
    // Antes da viagem a primeira já está no cartão de cima: a lista começa na seguinte.
    const lista = diaDeHoje() ? pendenciasAbertas().slice(0, 4) : pendenciasAbertas().slice(1, 5);
    $('#rot-pendencias').classList.toggle('oculto', !lista.length);
    if (!lista.length) return;

    lista.forEach(function (p) {
      const b = el('button', 'mini-pend' +
        (p.faltam < 0 ? ' atrasada' : p.faltam <= 7 ? ' urgente' : ''));
      const d = el('div', 'mini-pend-dias');
      d.appendChild(el('b', null, p.faltam < 0 ? -p.faltam : p.faltam));
      d.appendChild(el('span', null,
        p.faltam < 0 ? (p.faltam === -1 ? 'dia atrás' : 'dias atrás')
                     : p.faltam === 0 ? 'hoje' : (p.faltam === 1 ? 'dia' : 'dias')));
      b.appendChild(d);
      const t = el('div', 'mini-pend-txt');
      t.appendChild(document.createTextNode(p.c.texto));
      t.appendChild(el('div', 'mini-pend-data',
        ddmm(p.data) + (p.c.dataEstimada ? ' · estimada' : '')));
      b.appendChild(t);
      b.addEventListener('click', function () { mostrarTela('pendencias'); });
      alvo.appendChild(b);
    });
  }

  function pintarListaDias() {
    const alvo = $('#lista-dias');
    alvo.innerHTML = '';
    const hoje = hojeISO();

    R.dias.forEach(function (dia) {
      const total = contaveis(dia).length;
      const feitos = contarFeitos(dia);
      const pct = total ? Math.round((feitos / total) * 100) : 0;

      const b = el('button', 'linha-dia' + (dia.data === hoje ? ' e-hoje' : ''));
      b.setAttribute('data-op', chaveOp(dia));
      b.appendChild(el('div', 'ld-faixa'));

      const d = el('div', 'ld-data');
      d.appendChild(el('b', null, +dia.data.split('-')[2]));
      d.appendChild(el('span', null, dia.diaSemana.slice(0, 3)));
      b.appendChild(d);

      const c = el('div', 'ld-corpo');
      const topo = el('div', 'ld-topo');
      topo.appendChild(el('span', 'ld-emoji', dia.emoji));
      topo.appendChild(el('span', 'ld-nome', dia.titulo));
      if (dia.data === hoje) topo.appendChild(el('span', 'ld-hoje', 'hoje'));
      else if (dia.custoZero) topo.appendChild(el('span', 'ld-zero', 'custo zero'));
      c.appendChild(topo);
      if (dia.subtitulo) c.appendChild(el('div', 'ld-sub', dia.subtitulo));
      if (feitos) {
        const p = el('div', 'ld-prog');
        p.appendChild(el('i')).style.width = pct + '%';
        c.appendChild(p);
      }
      b.appendChild(c);
      b.addEventListener('click', function () { irParaDia(dia); });
      alvo.appendChild(b);
    });
  }

  function pintarResumo() {
    const alvo = $('#resumo-viagem');
    alvo.innerHTML = '';
    const abertas = R.checklist.filter((c) => !E.checkFeito(c.id)).length;
    const aReservar = R.restaurantes.filter(function (r) {
      if (!r.precisaReserva) return false;
      const s = E.reserva(r.id);
      return !s || !s.status || s.status === 'a-reservar';
    }).length;
    [
      [R.dias.filter((d) => d.tipo === 'parque').length, 'dias de parque'],
      [R.dias.reduce((n, d) => n + contaveis(d).length, 0), 'blocos'],
      [aReservar, 'a reservar'],
      [abertas, 'pendências'],
    ].forEach(function ([n, r]) {
      const i = el('div', 'resumo-item');
      i.appendChild(el('b', null, n));
      i.appendChild(el('span', null, r));
      alvo.appendChild(i);
    });
  }

  /* =========================================================================
     DIA
     ====================================================================== */
  function pintarNavDias() {
    const nav = $('#nav-dias');
    nav.innerHTML = '';
    R.dias.forEach(function (dia) {
      const b = el('button', 'pilula' + (dia.id === diaAtual.id ? ' ativa' : ''));
      b.style.setProperty('--op-p', corOp(dia));
      b.appendChild(el('b', null, +dia.data.split('-')[2]));
      b.appendChild(el('span', null, dia.diaSemana.slice(0, 3)));
      b.addEventListener('click', function () { irParaDia(dia); });
      nav.appendChild(b);
      if (dia.id === diaAtual.id) {
        b.setAttribute('aria-current', 'date');
        // Só a régua rola, e só na horizontal. O scrollIntoView puxava a página
        // de volta ao topo um instante depois de o app rolar até o agora.
        requestAnimationFrame(function () {
          const nr = nav.getBoundingClientRect(), br = b.getBoundingClientRect();
          nav.scrollLeft += (br.left - nr.left) - (nr.width - br.width) / 2;
        });
      }
    });
  }

  function pintarDia() {
    const dia = diaAtual;
    $('#tela-dia').setAttribute('data-op', chaveOp(dia));

    $('#dia-emoji').textContent = dia.emoji;
    $('#dia-titulo').textContent = dia.titulo;
    $('#dia-data').textContent = dia.diaSemana + ', ' + dataExtenso(dia.data) +
      (dia.subtitulo ? ' · ' + dia.subtitulo : '');
    $('#dia-resumo').textContent = dia.resumo || '';
    $('#dia-resumo').hidden = !dia.resumo;

    const selos = $('#dia-selos');
    selos.innerHTML = '';
    if (dia.operadora) selos.appendChild(el('span', 'selo-dia op', dia.operadora));
    else {
      const ROT = { logistica: 'logística', compras: 'compras', livre: 'dia livre' };
      selos.appendChild(el('span', 'selo-dia op', ROT[dia.tipo] || 'dia livre'));
    }
    if (dia.custoZero) selos.appendChild(el('span', 'selo-dia custo-zero',
      'entrada extra · custo zero'));
    if (dia.fechado) selos.appendChild(el('span', 'selo-dia fechado',
      '✓ dia revisado em ' + dia.revisadoEm.split('-').reverse().join('/')));

    pintarRotaDia(dia);
    // O valor persiste desde a sessão passada; sem isto a caixa aparecia
    // desmarcada com a lista já filtrada, que é a pior combinação possível.
    $('#chk-falta').checked = soFalta;
    pintarReferencia(dia);
    pintarVenceHoje(dia);
    pintarAvisos(dia);
    pintarLinhaTempo(dia);
    pintarProgresso(dia);
    Fase3.pintarFicha(dia);
    Fase3.pintarFechamento(dia);
    pintarNavDias();
  }

  /* Rota do dia inteiro no Maps — conceito do Wanderlog */
  const LIMITE_WAYPOINTS = 8;
  function pintarRotaDia(dia) {
    const alvo = $('#dia-rota');
    alvo.innerHTML = '';
    // No dia da chegada eles nao acordam no hotel: a rota partindo dele desenhava
    // hotel -> MCO -> Walmart, que e o caminho ao contrario. `rotaOrigemLocalId`
    // deixa o dia dizer de onde parte, e o padrao continua sendo a base.
    const origemId = dia.rotaOrigemLocalId || R.viagem.baseLocalId;
    const base = R.locais.find((l) => l.id === origemId);
    if (!base || base.lat == null) return;

    // locais distintos do dia, na ordem em que aparecem
    const vistos = new Set();
    const paradas = [];
    blocosDoDia(dia).forEach(function (b) {
      const id = b.dados.localId;
      if (!id || id === origemId || vistos.has(id)) return;
      const l = R.locais.find((x) => x.id === id);
      if (!l || l.lat == null) return;
      vistos.add(id); paradas.push(l);
    });
    if (!paradas.length) return;

    const usadas = paradas.slice(0, LIMITE_WAYPOINTS + 1);
    const destino = usadas[usadas.length - 1];
    const meio = usadas.slice(0, -1);

    let url = 'https://www.google.com/maps/dir/?api=1' +
      '&origin=' + base.lat + ',' + base.lng +
      '&destination=' + destino.lat + ',' + destino.lng + '&travelmode=driving';
    if (meio.length) {
      url += '&waypoints=' + meio.map((l) => l.lat + ',' + l.lng).join('|');
    }

    const a = el('a', 'btn-rota-dia');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    a.appendChild(svg('M9 20l-5.5 2V6L9 4M9 20l6-2M9 20V4M15 18l5.5 2V4L15 6M15 18V6M9 4l6 2'));
    a.appendChild(document.createTextNode(
      'Rota do dia no Maps · ' + plural(usadas.length, 'parada', 'paradas')));
    alvo.appendChild(a);

    if (paradas.length > usadas.length) {
      alvo.appendChild(el('p', 'rota-nota',
        'O Google aceita ' + (LIMITE_WAYPOINTS + 1) + ' paradas por rota. ' +
        (paradas.length - usadas.length) + ' ficaram de fora.'));
    }
  }

  function pintarReferencia(dia) {
    const cx = $('#referencia');
    if (!dia.referencia) { cx.classList.add('oculto'); return; }
    cx.classList.remove('oculto');

    const inp = $('#inp-referencia');
    const editada = refEditada(dia);
    const tipoRef = tipoReferencia(dia.referencia.rotulo);
    // Parque, voo, jogo e sessão têm horário oficial; saída e chegada são a hora real de vocês.
    $('#lbl-referencia').textContent = (tipoRef === 'saida' || tipoRef === 'chegada'
      ? 'Hora real — ' : 'Horário oficial — ') + dia.referencia.rotulo;
    inp.value = refDoDia(dia);
    inp.classList.toggle('editado', editada);
    $('#btn-ref-reset').disabled = !editada;

    const ajuda = $('#referencia-ajuda');
    if (editada) {
      const d = paraMin(refDoDia(dia)) - paraMin(dia.referencia.padrao);
      const abs = Math.abs(d);
      ajuda.textContent = 'O documento assumia ' + dia.referencia.padrao + '. Os blocos ' +
        'ancorados deslocaram ' + (d > 0 ? '+' : '−') +
        (abs >= 60 ? Math.floor(abs / 60) + 'h' +
          (abs % 60 ? String(abs % 60).padStart(2, '0') : '') : abs + ' min') + '.';
      ajuda.classList.add('ativa');
    } else {
      ajuda.textContent = AJUDA_REFERENCIA[tipoRef];
      ajuda.classList.remove('ativa');
    }
  }

  // A ajuda muda com o que a referência é: abertura de parque se confere no site,
  // voo no app da companhia, jogo na liga.
  function tipoReferencia(rotulo) {
    if (/Terminal/i.test(rotulo)) return 'chegada';
    if (/Decolagem|voo/i.test(rotulo)) return 'voo';
    if (/Abertura/i.test(rotulo)) return 'parque';
    if (/jogo/i.test(rotulo)) return 'jogo';
    if (/Sessão/i.test(rotulo)) return 'sessao';
    if (/Saída/i.test(rotulo)) return 'saida';
    return 'outro';
  }
  const AJUDA_REFERENCIA = {
    chegada: 'Mudem na hora em que saírem do Terminal C, com as malas. A tarde desloca ' +
             'junto; o jantar reservado fica.',
    voo: 'Mudem se a companhia aérea remarcar o voo. A manhã inteira desloca junto.',
    parque: 'Mudem quando o parque publicar o horário oficial. Os blocos ancorados deslocam ' +
            'junto; desfile, show, reserva e pôr do sol ficam.',
    jogo: 'Mudem se a liga remarcar o jogo. O Uber, o jantar e a caminhada deslocam junto.',
    sessao: 'Mudem se a sessão confirmada no app for outra. A noite desloca até a Hogsmeade ' +
            'decorada; o castelo, o jantar e a volta ficam.',
    saida: 'Saíram mais tarde? Mudem aqui. Os blocos até o primeiro compromisso de hora ' +
           'marcada deslocam junto.',
    outro: 'Os blocos ancorados deslocam junto; os de horário fixo, não.',
  };

  /* As pendencias com hora marcada viviam so na aba Pendencias, e o badge de
     la so contava atraso. Resultado: a compra do Lightning Lane das 7h ET
     vencia sem ninguem ver, e so ficava vermelha no dia seguinte. Agora ela
     aparece na tela do proprio dia em que vence. */
  function pintarVenceHoje(dia) {
    const alvo = $('#vence-hoje');
    alvo.innerHTML = '';
    if (dia.data !== hojeISO()) return;
    // As de hora marcada vão para a faixa junto do agora, com contagem.
    const hoje = pendenciasDoDia(dia).filter((c) => !c.hora);
    if (!hoje.length) return;
    const cx = el('div', 'vence');
    cx.appendChild(el('div', 'vence-rot',
      hoje.length === 1 ? 'Vence hoje' : 'Vencem hoje · ' + hoje.length));
    hoje.forEach(function (c) {
      const li = el('div', 'vence-item' + (c.critico ? ' vence-critico' : ''));
      if (c.hora) li.appendChild(el('span', 'vence-hora', c.hora + ' ' + (c.fuso || '')));
      li.appendChild(el('span', 'vence-texto', c.texto));
      cx.appendChild(li);
    });
    const b = el('button', 'vence-btn', 'Abrir pendências');
    b.addEventListener('click', function () { mostrarTela('pendencias'); });
    cx.appendChild(b);
    alvo.appendChild(cx);
  }

  function pendenciasDoDia(dia) {
    return (R.checklist || []).filter(function (c) {
      const data = E.dataChecklist(c.id) || c.dataAlvo;
      return data === dia.data && !E.checkFeito(c.id);
    });
  }

  // Instante absoluto de uma hora de Orlando. Na véspera o celular ainda está no
  // fuso do Brasil; na viagem, no de Orlando. A pendência das 7h ET não muda.
  function instanteET(dataISO, hora) {
    const d = dataISO.split('-').map(Number), h = hora.split(':').map(Number);
    const palpite = Date.UTC(d[0], d[1] - 1, d[2], h[0], h[1]);
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York',
      hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit' });
    const deslocamento = function (t) {
      const p = {};
      fmt.formatToParts(new Date(t)).forEach(function (x) { p[x.type] = x.value; });
      return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - t;
    };
    return palpite - deslocamento(palpite - deslocamento(palpite));
  }
  function minutosAte(dataISO, hora, fuso) {
    const alvo = fuso === 'ET' ? instanteET(dataISO, hora)
      : new Date(dataISO + 'T' + hora + ':00').getTime();
    return Math.round((alvo - Date.now()) / 60000);
  }

  /* A pendência de hora marcada fica junto do agora, com contagem e o check. No
     alto da tela, acima de sete avisos, a compra das 7h ET passava sem ninguém ver. */
  function faixaVence(dia) {
    const comHora = pendenciasDoDia(dia).filter((c) => c.hora);
    if (!comHora.length) return null;
    const li = el('li', 'vence-faixa');
    comHora.forEach(function (c) {
      const item = el('div', 'vf-item' + (c.critico ? ' vf-critico' : ''));
      const topo = el('div', 'vf-topo');
      const quando = c.hora + (c.fuso ? ' ' + c.fuso : '');
      const falta = minutosAte(dia.data, c.hora, c.fuso);
      topo.appendChild(el('span', 'vf-hora', quando));
      topo.appendChild(el('span', 'vf-conta' + (falta < 0 ? ' vf-venceu' : ''),
        falta < 0 ? 'venceu às ' + quando : falta === 0 ? 'agora' : 'em ' + intervaloTexto(falta)));
      const chk = el('button', 'bl-check');
      chk.setAttribute('aria-pressed', 'false');
      chk.setAttribute('aria-label', 'Concluir: ' + c.texto);
      chk.appendChild(svg('M4 12l6 6L20 6'));
      chk.addEventListener('click', function () {
        E.marcarChecklist(c.id, true);
        if (window.Fase3) Fase3.pintarPendencias();
        item.remove();
        if (!li.querySelector('.vf-item')) li.remove();
      });
      topo.appendChild(chk);
      item.appendChild(topo);
      item.appendChild(el('div', 'vf-texto', c.texto));
      if (c.nota) {
        const det = el('details', 'vf-nota');
        det.dataset.chave = 'vence:' + c.id;
        det.appendChild(el('summary', null, 'Ver o que fazer'));
        det.appendChild(el('div', 'vf-nota-corpo', c.nota));
        item.appendChild(det);
      }
      li.appendChild(item);
    });
    return li;
  }

  // Primeira frase de um aviso: o que se lê de passagem. O resto fica no acordeão.
  function primeiraFrase(t) {
    const par = String(t).split('\n')[0];
    const m = par.match(/^.*?[.!?](?=\s|$)/);
    let f = (m ? m[0] : par).trim();
    if (f.length > 180) f = f.slice(0, 177).replace(/\s+\S*$/, '') + '…';
    return f;
  }

  function pintarAvisos(dia) {
    const alvo = $('#avisos-dia');
    alvo.innerHTML = '';
    const itens = [];
    (dia.avisos || []).forEach((t) => itens.push({ texto: t, resolver: true }));
    (dia.notas || []).forEach(function (n) {
      // alerta e atencao pedem a mesma cor: as duas sao coisa a resolver, nao boa noticia
      itens.push({ texto: n.texto, resolver: n.tipo === 'atencao' || n.tipo === 'alerta',
                   pesquisa: n.pesquisa });
    });
    if (dia.notaCusto) itens.push({ texto: dia.notaCusto, resolver: false });

    if (itens.length) {
      // À vista, só a primeira frase do que é para resolver. Os oito avisos do dia
      // 11 abertos empurravam a linha do tempo para fora da primeira tela.
      const urgentes = itens.filter((i) => i.resolver);
      if (urgentes.length) {
        const res = el('ul', 'avisos-resumo');
        urgentes.forEach((i) => res.appendChild(el('li', null, primeiraFrase(i.texto))));
        alvo.appendChild(res);
      }
      const det = el('details', 'acordeao avisos-todos');
      det.appendChild(el('summary', null, 'Avisos e notas do dia · ' + itens.length));
      const corpo = el('div', 'acordeao-corpo');
      itens.forEach(function (i) {
        const d = el('div', 'aviso ' + (i.resolver ? '' : 'bom'));
        d.textContent = i.texto;
        if (i.pesquisa) {
          d.appendChild(el('span', 'marca-pesquisa',
            'verificado na web em ' + i.pesquisa.split('-').reverse().join('/')));
        }
        corpo.appendChild(d);
      });
      det.appendChild(corpo);
      alvo.appendChild(det);
    }

    // A dica mora uma vez so, em R.dicas. Quando e de dia especifico, aparece aqui
    // e tambem no indice da aba Guia — mesmo objeto, dois lugares.
    (R.dicas || []).filter(function (x) { return (x.dias || []).indexOf(dia.id) >= 0; })
      .forEach(function (x) {
        const det = el('details', 'acordeao dica dica-hoje');
        det.appendChild(el('summary', null, '💡  ' + x.titulo));
        const c = el('div', 'acordeao-corpo');
        c.appendChild(el('div', 'dica-corpo', x.corpo));
        det.appendChild(c);
        alvo.appendChild(det);
      });
  }

  /* ---------------------------------------------------------------------------
     Ícones: formas específicas onde importa, não estrela genérica
     ------------------------------------------------------------------------ */
  const ICONES = {
    // montanha-russa: trilho com looping
    atracao: 'M3 20V9a3 3 0 0 1 6 0v6a3 3 0 0 0 6 0V8|M21 20V8|M3 20h4|M17 20h4|M6 12h.01',
    refeicao: 'M4 3v7a2.5 2.5 0 0 0 5 0V3|M6.5 11v10|M17 3c-1.4 0-2.5 2-2.5 4.5S15.6 12 17 12v9',
    deslocamento: 'M5 12h13|M13 6l6 6-6 6',
    show: 'M4 5h16v11H4z|M9 20h6|M12 16v4|M10 8.5l4 2.2-4 2.3z',
    compras: 'M6 8h12l-1 12H7z|M9 8V6a3 3 0 0 1 6 0v2',
    espera: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z|M12 7.5V12l3 1.8',
    tarefa: 'M9 11l2.5 2.5L16 9|M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z',
    // roda-gigante para dia livre
    livre: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z|M12 3v18|M3 12h18|M5.6 5.6l12.8 12.8|M18.4 5.6L5.6 18.4',
    vazio: 'M20 14a8 8 0 1 1-9.9-9.9A7 7 0 0 0 20 14z',
    // banco de praca: parar, sentar, beber agua
    pausa: 'M4 10h16|M4 14h16|M6 14v6|M18 14v6|M6 10V6|M18 10V6',
  };
  const I_RELOGIO = 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z|M12 7.5V12l3 1.8';
  const I_PASSOS = 'M8 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z|M7 9h2l1 5-1 6H8l-1-6z|M16 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4z|M15 13h2l1 4-1 5h-2l-1-5z';
  const I_PIN = 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z|M12 8a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z';
  const I_LUPA = 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14z|M20 20l-4-4';

  const ROTULO_ACESSO = {
    'rope-drop': 'rope drop', 'multi-pass': 'multi pass',
    'single-pass': 'single pass', 'standby': 'standby', 'reserva': 'reserva',
    'single-rider': 'single rider',
  };

  const acharLocal = (id) => R.locais.find((l) => l.id === id) || null;
  function linkLocal(l) {
    const c = E.coordLocal(l.id);
    const lat = c ? c.lat : l.lat, lng = c ? c.lng : l.lng;
    if (lat != null && lng != null) return 'https://maps.google.com/?q=' + lat + ',' + lng;
    return 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(l.nome + ', Orlando FL');
  }
  // Atração não tem coordenada: busca por nome + parque resolve bem no Google.
  function linkAtracao(bloco, dia) {
    const parque = dia.parqueId ? (acharLocal(dia.parqueId) || {}).nome : null;
    return 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(bloco.titulo + (parque ? ', ' + parque : ', Orlando FL'));
  }

  const intervaloTexto = (m) => m < 60 ? m + ' min'
    : Math.floor(m / 60) + 'h' + (m % 60 ? String(m % 60).padStart(2, '0') : '');

  function pintarLinhaTempo(dia) {
    const ol = $('#linha-tempo');
    // Repintar não pode fechar o "Detalhes" aberto nem a nota da faixa do que vence.
    const abertos = new Set([].map.call(ol.querySelectorAll('details[open][data-chave]'),
      (d) => d.dataset.chave));
    ol.innerHTML = '';
    const ehHoje = dia.data === hojeISO();
    const agora = agoraMin();
    let lista = blocosDoDia(dia);
    if (soFalta) lista = lista.filter((b) => !E.feito(b.dados.id));

    // O ponto do agora: o que vence com hora marcada, a linha e o ajuste de atraso.
    const pontoAgora = function () {
      const f = faixaVence(dia);
      if (f) ol.appendChild(f);
      ol.appendChild(linhaAgora(agora));
      const a = linhaAtraso(dia);
      if (a) ol.appendChild(a);
    };

    if (!lista.length) {
      if (ehHoje) pontoAgora();
      const v = el('li', 'vazio-lista');
      v.appendChild(svg('M9 11l2.5 2.5L16 9|M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z'));
      v.appendChild(el('p', null, 'Tudo feito neste dia.'));
      ol.appendChild(v);
      reabrir(ol, abertos);
      return;
    }

    let agoraPosto = false;

    lista.forEach(function (item, i) {
      // linha do agora antes do primeiro bloco que ainda não passou
      if (ehHoje && !agoraPosto && item.min > agora) {
        pontoAgora();
        agoraPosto = true;
      }
      ol.appendChild(paradaEl(item, dia));

      const prox = lista[i + 1];
      if (!prox) return;
      const gap = prox.min - item.min;
      const conector = el('li', 'conector');
      if (gap > 0) conector.appendChild(el('span', 'conector-tempo', intervaloTexto(gap)));

      // TRAVESSIA entre areas do parque. O "35 min" do conector e folga de
      // cronograma, nao caminhada — e a pergunta que se faz em voz alta a cada
      // vinte minutos e quanto custa atravessar. Vem do grafo de topografia,
      // que declara so as arestas de que temos certeza.
      const tv = travessia(dia, item.dados.areaParque, prox.dados.areaParque);
      if (tv) {
        const w = el('span', 'conector-travessia');
        w.appendChild(svg(I_PASSOS));
        w.appendChild(document.createTextNode(
          '~' + tv.min + ' min até ' + prox.dados.areaParque));
        conector.appendChild(w);
      }

      const lp = prox.dados.localId ? acharLocal(prox.dados.localId) : null;
      if (lp && prox.dados.localId !== item.dados.localId) {
        const a = el('a', 'btn-maps');
        a.href = linkLocal(lp); a.target = '_blank'; a.rel = 'noopener';
        a.appendChild(svg(I_PIN));
        a.appendChild(document.createTextNode(lp.nome.split('—')[0].trim()));
        conector.appendChild(a);
      }
      if (conector.children.length) ol.appendChild(conector);
    });

    if (ehHoje && !agoraPosto) pontoAgora();
    reabrir(ol, abertos);
    marcarMomentos(dia);
  }

  function reabrir(raiz, abertos) {
    raiz.querySelectorAll('details[data-chave]').forEach(function (d) {
      if (abertos.has(d.dataset.chave)) d.open = true;
    });
  }

  /* Editor de hora de um bloco. Vale para os blocos com hora oficial que so sai
     perto da data — desfile, fogos, shows. Nao mexe na referencia do dia. */
  let fecharEditor = null;
  function abrirEditorHora(b, dia) {
    if (fecharEditor) fecharEditor();
    const cx = el('div', 'editor-hora');
    cx.setAttribute('role', 'dialog');
    cx.setAttribute('aria-label', 'Horário oficial de ' + b.titulo);
    cx.appendChild(el('div', 'editor-rot',
      'Qual é o horário oficial de "' + b.titulo + '"?'));
    const confirmado = E.horaBloco(b.id);
    cx.appendChild(el('div', 'editor-previsto', 'Previsto no roteiro: ' + b.hora +
      (confirmado ? ' · confirmado: ' + confirmado : '')));
    // Campo vazio, com a previsão só de exemplo: vir preenchido com 20:00 fazia
    // "Salvar" confirmar a previsão como se fosse o horário oficial.
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.inputMode = 'numeric';
    inp.autocomplete = 'off';
    inp.maxLength = 5;
    inp.className = 'editor-campo';
    inp.placeholder = b.hora;
    inp.setAttribute('aria-label', 'Horário oficial, no formato HH:MM');
    cx.appendChild(inp);
    const linha = el('div', 'editor-botoes');
    const salvar = el('button', 'editor-ok', 'Confirmar horário');
    salvar.disabled = true;
    const valido = (v) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
    inp.addEventListener('input', function () {
      let v = inp.value.replace(/[^\d]/g, '').slice(0, 4);
      if (v.length >= 3) v = v.slice(0, 2) + ':' + v.slice(2);
      inp.value = v;
      salvar.disabled = !valido(v);
      salvar.textContent = valido(v) ? 'Confirmar ' + v + ' como oficial' : 'Confirmar horário';
    });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') salvar.click(); });
    salvar.addEventListener('click', function () {
      if (!valido(inp.value)) return;
      E.definirHoraBloco(b.id, inp.value);
      fechar(); pintarLinhaTempo(dia);
    });
    const cancelar = el('button', 'editor-limpar', 'Cancelar');
    cancelar.addEventListener('click', function () { fechar(); });
    linha.appendChild(salvar); linha.appendChild(cancelar);
    cx.appendChild(linha);
    if (confirmado) {
      const voltar = el('button', 'editor-voltar', 'Voltar ao previsto (' + b.hora + ')');
      voltar.addEventListener('click', function () {
        E.definirHoraBloco(b.id, null);
        fechar(); pintarLinhaTempo(dia);
      });
      cx.appendChild(voltar);
    }
    document.body.appendChild(cx);

    const fora = function (e) { if (!cx.contains(e.target)) fechar(); };
    const tecla = function (e) { if (e.key === 'Escape') fechar(); };
    function fechar() {
      cx.remove();
      document.removeEventListener('pointerdown', fora, true);
      document.removeEventListener('keydown', tecla);
      fecharEditor = null;
    }
    fecharEditor = fechar;
    // No tick seguinte: o toque que abriu o editor não pode ser o que fecha.
    setTimeout(function () {
      document.addEventListener('pointerdown', fora, true);
      document.addEventListener('keydown', tecla);
    }, 0);
    inp.focus();
  }

  function rolarAteAgora() {
    // Depois do paint, senao o elemento ainda nao tem posicao na pagina.
    requestAnimationFrame(function () {
      const marca = document.querySelector('#linha-tempo .agora');
      if (!marca) return;
      marca.scrollIntoView({ block: 'center' });
    });
  }

  /* Caminho mais curto entre duas areas do parque. Sao sete nos: qualquer coisa
     serve, entao vai o mais simples que da para ler. */
  const memoTravessia = {};
  function travessia(dia, de, para) {
    if (!de || !para || de === para) return null;
    const topo = (R.topografia || {})[dia.parqueId];
    if (!topo) return null;
    const chave = dia.parqueId + '|' + de + '|' + para;
    if (chave in memoTravessia) return memoTravessia[chave];

    const viz = {};
    topo.arestas.forEach(function (a) {
      (viz[a[0]] = viz[a[0]] || []).push([a[1], a[2]]);
      (viz[a[1]] = viz[a[1]] || []).push([a[0], a[2]]);
    });
    if (!viz[de] || !viz[para]) { memoTravessia[chave] = null; return null; }

    const dist = {}; dist[de] = 0;
    const fila = [de];
    while (fila.length) {
      fila.sort(function (x, y) { return dist[x] - dist[y]; });
      const atual = fila.shift();
      (viz[atual] || []).forEach(function (p) {
        const novo = dist[atual] + p[1];
        if (dist[p[0]] == null || novo < dist[p[0]]) {
          dist[p[0]] = novo;
          if (fila.indexOf(p[0]) < 0) fila.push(p[0]);
        }
      });
    }
    const r = dist[para] == null ? null : { min: dist[para], margem: topo.margem };
    memoTravessia[chave] = r;
    return r;
  }

  function linhaAgora(min) {
    const li = el('li', 'agora');
    li.appendChild(el('span', 'agora-rot', paraHora(min)));
    li.appendChild(el('div', 'agora-linha'));
    return li;
  }

  // O bloco em andamento e o próximo que ainda não foi feito.
  function momentosDoDia(dia) {
    const agora = agoraMin();
    const lista = blocosDoDia(dia).filter((it) => !E.feito(it.dados.id));
    return {
      emCurso: lista.find((it) => it.min <= agora && agora < it.min + (it.dados.duracaoMin || 0)) || null,
      aSeguir: lista.find((it) => it.min > agora) || null,
    };
  }

  // Marca "agora" e "a seguir" nos cartões já pintados, sem repintar a lista.
  function marcarMomentos(dia) {
    const ol = $('#linha-tempo');
    ol.querySelectorAll('.parada').forEach(function (li) {
      li.classList.remove('pa-em-curso', 'pa-a-seguir');
      const r = li.querySelector('.ct-momento');
      if (r) r.remove();
    });
    if (dia.data !== hojeISO()) return;
    const m = momentosDoDia(dia);
    [[m.emCurso, 'pa-em-curso', 'agora'], [m.aSeguir, 'pa-a-seguir', 'a seguir']].forEach(function (x) {
      if (!x[0]) return;
      const li = ol.querySelector('.parada[data-bloco="' + x[0].dados.id + '"]');
      if (!li) return;
      li.classList.add(x[1]);
      const cab = li.querySelector('.cartao-cabeca');
      cab.insertBefore(el('span', 'ct-momento', x[2]), cab.querySelector('.ct-check'));
    });
  }

  /* Atrasados? A referência anda de quinze em quinze minutos, ali mesmo junto do
     agora — antes, era preciso subir até o topo do dia e digitar a hora. */
  function linhaAtraso(dia) {
    if (!dia.referencia) return null;
    const li = el('li', 'atraso');
    li.appendChild(el('span', 'atraso-rot', 'Atrasados?'));
    const botoes = el('div', 'atraso-botoes');
    [[-15, '−15'], [15, '+15'], [30, '+30'], [45, '+45']].forEach(function (x) {
      const b = el('button', 'atraso-btn', x[1]);
      b.setAttribute('aria-label', (x[0] > 0 ? 'Atrasar' : 'Adiantar') + ' o dia em ' +
        Math.abs(x[0]) + ' minutos');
      b.addEventListener('click', function () { deslocarReferencia(dia, x[0]); });
      botoes.appendChild(b);
    });
    if (refEditada(dia)) {
      const z = el('button', 'atraso-btn atraso-zerar', 'Zerar');
      z.addEventListener('click', function () {
        E.definirReferencia(dia.id, null);
        pintarDia(); rolarAteAgora();
      });
      botoes.appendChild(z);
    }
    li.appendChild(botoes);
    const quebrados = blocosDoDia(dia).filter((it) => it.colisao && !E.feito(it.dados.id));
    if (quebrados.length) {
      li.appendChild(el('div', 'atraso-resumo',
        plural(quebrados.length, 'bloco deixou', 'blocos deixaram') + ' de caber: ' +
        quebrados.map((it) => it.dados.titulo).join(' · ')));
    }
    return li;
  }
  function deslocarReferencia(dia, delta) {
    const nova = paraHora(paraMin(refDoDia(dia)) + delta);
    E.definirReferencia(dia.id, nova === dia.referencia.padrao ? null : nova);
    pintarDia();
    rolarAteAgora();
  }

  // A próxima mesa com hora marcada, de agora em diante — é o compromisso que não
  // espera, e o número dela precisa estar à mão.
  function proximaReserva() {
    if (!window.Fase3) return null;
    const hoje = hojeISO(), agora = agoraMin();
    const lista = R.restaurantes.filter(function (r) {
      if (!r.precisaReserva || !r.hora) return false;
      const s = Fase3.statusDe(r);
      if (s !== 'reservado' && s !== 'confirmado') return false;
      return r.data > hoje || (r.data === hoje && paraMin(r.hora) >= agora);
    }).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
    return lista.length ? { r: lista[0], conf: Fase3.confirmacaoDe(lista[0]) } : null;
  }

  function paradaEl(item, dia) {
    const b = item.dados;
    const li = el('li', 'parada t-' + b.tipo +
      (E.feito(b.id) ? ' feita' : '') + (item.colisao ? ' colide' : ''));
    li.dataset.bloco = b.id;

    const marca = el('div', 'marcador');
    marca.appendChild(svg(ICONES[b.tipo] || ICONES.livre));
    li.appendChild(marca);

    const card = el('div', 'cartao');
    const cab = el('div', 'cartao-cabeca');
    cab.appendChild(el('span', 'ct-hora', item.hora));
    if (item.deslocado) {
      cab.appendChild(el('span', 'ct-pin'));
      cab.appendChild(el('span', 'ct-hora-antiga', horaDe(b)));
    }
    if (b.fuso) cab.appendChild(el('span', 'ct-fuso', b.fuso));
    if (b.duracaoMin) {
      const h = Math.floor(b.duracaoMin / 60), m = b.duracaoMin % 60;
      cab.appendChild(el('span', 'ct-dur', '· ' +
        (h ? h + 'h' + (m ? String(m).padStart(2, '0') : '') : m + ' min')));
    }

    if (b.tipo !== 'vazio') {
      const chk = el('button', 'ct-check');
      chk.setAttribute('aria-pressed', E.feito(b.id) ? 'true' : 'false');
      chk.setAttribute('aria-label', 'Marcar como feito: ' + b.titulo);
      chk.appendChild(svg('M4 12l6 6L20 6'));
      chk.addEventListener('click', function () {
        const agora = !E.feito(b.id);
        E.marcarFeito(b.id, agora);
        // Com o filtro ligado o bloco sai da lista; sem ele, só o cartão muda e
        // nada que estava aberto fecha.
        if (soFalta) pintarLinhaTempo(dia);
        else {
          li.classList.toggle('feita', agora);
          chk.setAttribute('aria-pressed', agora ? 'true' : 'false');
          marcarMomentos(dia);
        }
        pintarProgresso(dia);
      });
      cab.appendChild(chk);
    }
    card.appendChild(cab);
    card.appendChild(el('div', 'ct-titulo', b.titulo));
    // O "não cabe" logo abaixo do título: no pé do cartão ele vinha depois do texto longo.
    if (item.colisao) card.appendChild(el('div', 'ct-colisao', '⚠ ' + item.colisao));
    if (b.descricao) card.appendChild(el('div', 'ct-desc', b.descricao));

    if (b.areaParque || b.endereco) {
      const a = el('div', 'ct-area');
      a.appendChild(svg(I_PIN));
      a.appendChild(document.createTextNode(b.areaParque || b.endereco));
      card.appendChild(a);
    }

    const selos = el('div', 'ct-selos');
    (b.acesso || []).forEach(function (ac) {
      selos.appendChild(el('span', 'selo selo-' + ac, ROTULO_ACESSO[ac] || ac));
    });
    if (b.acessoAlt) selos.appendChild(el('span', 'selo selo-' + b.acessoAlt,
      'ou ' + (ROTULO_ACESSO[b.acessoAlt] || b.acessoAlt)));
    if (b.confirmarHorario) {
      const conf = E.horaBloco(b.id);
      const bt = el('button', 'selo selo-confirmar',
        conf ? '✓ horário confirmado ' + conf : '⚠ confirmar horário');
      bt.addEventListener('click', function () { abrirEditorHora(b, dia); });
      selos.appendChild(bt);
    }
    if (b.molha) selos.appendChild(el('span', 'selo selo-molha', '💧 molha'));
    if (b.locker) selos.appendChild(el('span', 'selo selo-locker',
      b.locker === 'detector' ? '🔒 locker + detector' : '🔒 locker'));
    if (b.critico) selos.appendChild(el('span', 'selo selo-critico', 'crítico'));
    if (b.opcional) selos.appendChild(el('span', 'selo selo-opcional', 'opcional'));
    if (selos.children.length) card.appendChild(selos);
    // O que se perde ao trocar de fila: no Forbidden Journey o single rider pula o
    // castelo, e isso muda a decisao de pe, na frente da atracao.
    if (b.acessoAltNota) card.appendChild(el('div', 'ct-alt-nota', b.acessoAltNota));

    // FILA TÍPICA. O número que importa não é a média do dia, é quanto custa a
    // fila NESTE horário — e quanto custaria no pico. É isso que mostra por que o
    // bloco está onde está, em vez de o roteiro só afirmar que está certo.
    if (b.fila) {
      const f = el('div', 'ct-fila');
      f.appendChild(svg(I_RELOGIO));
      const forte = el('b', null, b.fila.min + ' min');
      f.appendChild(forte);
      if (b.fila.quando) f.appendChild(document.createTextNode(' ' + b.fila.quando));
      if (b.fila.pico && b.fila.pico > b.fila.min) {
        f.appendChild(el('span', 'ct-fila-pico', 'no pico, ' + b.fila.pico));
      }
      if (b.fila.media) f.appendChild(el('span', 'ct-fila-pico', 'média ' + b.fila.media));
      if (b.fila.estimado) f.appendChild(el('span', 'ct-fila-est', 'estimado'));
      card.appendChild(f);
    }

    // JANELA DE RETORNO. O Lightning Lane vale por uma hora a partir do horario
    // reservado, e o app nao tinha esse conceito: o bloco das 10h15 aparecia
    // igualzinho ao das 15h. Perder a janela custa a atracao e o dinheiro.
    const ehLL = (b.acesso || []).some(function (a) {
      return a === 'multi-pass' || a === 'single-pass';
    });
    if (ehLL) {
      const fim = item.min + 60;
      const j = el('div', 'ct-janela');
      j.appendChild(el('span', 'ct-janela-rot', 'Janela'));
      j.appendChild(el('span', 'ct-janela-hora', item.hora + ' às ' + paraHora(fim)));
      if (dia.data === hojeISO() && !E.feito(b.id)) {
        const agora = agoraMin();
        if (agora >= item.min && agora < fim) {
          const resta = fim - agora;
          j.appendChild(el('span',
            'ct-janela-conta' + (resta <= 15 ? ' ct-janela-fim' : ''),
            resta <= 15 ? 'fecha em ' + resta + ' min!' : 'restam ' + resta + ' min'));
        } else if (agora >= fim) {
          j.appendChild(el('span', 'ct-janela-conta ct-janela-fim', 'janela fechada'));
        }
      }
      card.appendChild(j);
    }

    // Estado da reserva vindo do estado, nao do texto: se cancelarem na aba
    // Comer, a linha do tempo para de dizer que esta confirmada.
    if (b.restauranteId && window.Fase3 && Fase3.acharRestaurante) {
      const r = Fase3.acharRestaurante(b.restauranteId);
      if (r) {
        const st = Fase3.statusDe(r);
        const conf = Fase3.confirmacaoDe(r);
        const bt = el('button', 'ct-reserva ct-reserva-' + (st || 'sem'));
        const rot = st === 'confirmado' ? 'Reserva confirmada'
                  : st === 'cancelado' ? 'RESERVA CANCELADA'
                  : st === 'a-reservar' ? 'Ainda sem reserva'
                  : 'Reserva';
        bt.appendChild(el('span', 'ct-reserva-rot', rot));
        if (conf && st === 'confirmado') {
          bt.appendChild(el('span', 'ct-reserva-num', conf));
        }
        bt.addEventListener('click', function () { mostrarTela('comer'); });
        card.appendChild(bt);
      }
    }

    // O desfile corta o parque em dois enquanto passa. Nao e opiniao: e a rota.
    const topoDia = (R.topografia || {})[dia.parqueId];
    if (topoDia && topoDia.corte && topoDia.corte.blocoId === b.id) {
      card.appendChild(el('div', 'ct-corte', topoDia.corte.texto));
    }

    if (b.condicao) card.appendChild(el('div', 'ct-nota', '→ ' + b.condicao));
    if (b.nota) card.appendChild(el('div', 'ct-nota', b.nota));

    // atração ganha busca no Maps por nome — sem coordenada inventada
    if (b.tipo === 'atracao' && !b.localId) {
      const a = el('a', 'ct-maps');
      a.href = linkAtracao(b, dia); a.target = '_blank'; a.rel = 'noopener';
      a.appendChild(svg(I_LUPA));
      a.appendChild(document.createTextNode('achar no Maps'));
      card.appendChild(a);
    }
    // O texto longo e a procedência ficam recolhidos. Abertos, empurravam o agora
    // dois mil pixels para baixo; hora, título, selos, fila e colisão seguem à vista.
    if (b.contexto || b.pesquisa || b.verificado === false) {
      const mais = el('details', 'ct-mais');
      mais.dataset.chave = 'bloco:' + b.id;
      mais.appendChild(el('summary', 'ct-mais-rot', 'Detalhes'));
      if (b.contexto) mais.appendChild(el('div', 'ct-contexto', b.contexto));
      // Procedencia: de onde veio o que esta escrito aqui.
      if (b.pesquisa || b.verificado === false) {
        const p = el('div', 'ct-pesquisa');
        if (b.pesquisa) {
          p.appendChild(el('span', null,
            'verificado na web em ' + b.pesquisa.split('-').reverse().join('/')));
        }
        if (b.verificado === false) {
          p.appendChild(el('span', 'ct-pesquisa-est', 'estimativa, confiram'));
        }
        mais.appendChild(p);
      }
      card.appendChild(mais);
    }

    li.appendChild(card);
    return li;
  }

  function pintarProgresso(dia) {
    const total = contaveis(dia).length, feitos = contarFeitos(dia);
    $('#progresso-fill').style.width = (total ? (feitos / total) * 100 : 0) + '%';
    $('#progresso-texto').textContent = feitos + ' de ' + total + ' feitos';
  }

  /* =========================================================================
     Eventos
     ====================================================================== */
  document.querySelectorAll('.aba').forEach(function (a) {
    a.addEventListener('click', function () { mostrarTela(a.dataset.tela); });
  });
  $('#btn-hoje').addEventListener('click', function () {
    const d = diaDeHoje();
    if (d) irParaDia(d); else { diaAtual = R.dias[0]; mostrarTela('dia'); }
  });
  $('#btn-ajustes').addEventListener('click', function () { mostrarTela('ajustes'); });
  $('#btn-busca').addEventListener('click', function () { Busca.abrir(); });

  $('#inp-referencia').addEventListener('change', function (e) {
    if (!e.target.value) return;
    E.definirReferencia(diaAtual.id, e.target.value);
    pintarDia();
  });
  $('#btn-ref-reset').addEventListener('click', function () {
    E.definirReferencia(diaAtual.id, null);
    pintarDia();
  });
  $('#chk-falta').addEventListener('change', function (e) {
    soFalta = e.target.checked;
    try { localStorage.setItem(CHAVE_FILTRO, soFalta ? '1' : '0'); } catch (err) {}
    pintarLinhaTempo(diaAtual);
  });

  /* tema */
  const TEMA = 'orlando2026:tema';
  function aplicarTema(t) {
    if (t) document.documentElement.setAttribute('data-tema', t);
    else document.documentElement.removeAttribute('data-tema');
    try { t ? localStorage.setItem(TEMA, t) : localStorage.removeItem(TEMA); } catch (e) {}
  }
  try { aplicarTema(localStorage.getItem(TEMA)); } catch (e) {}
  $('#btn-tema').addEventListener('click', function () {
    const atual = document.documentElement.getAttribute('data-tema');
    const escuroSistema = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!atual) aplicarTema(escuroSistema ? 'claro' : 'escuro');
    else aplicarTema(atual === 'escuro' ? 'claro' : 'escuro');
    aoMudarTema();
  });
  // O tema do sistema também muda sozinho ao anoitecer: o topo e a régua acompanham.
  function aoMudarTema() {
    const noDia = !$('#tela-dia').classList.contains('oculto');
    aplicarCorTopo(noDia ? diaAtual : null);
    if (noDia) pintarNavDias();
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', aoMudarTema);

  /* =========================================================================
     Arranque
     ====================================================================== */
  $('#topo-nome').textContent = R.viagem.titulo;
  $('#topo-sub').textContent = R.viagem.subtitulo;

  Fase3.pintarPendencias();
  Fase5.ligar();
  Busca.ligar();

  const pedida = new URLSearchParams(location.search).get('tela');
  if (pedida && TELAS.indexOf(pedida) >= 0) mostrarTela(pedida);
  else if (diaDeHoje()) mostrarTela('dia');
  else mostrarTela('home');

  // a linha do agora precisa andar sozinha
  setInterval(function () {
    if (!$('#tela-dia').classList.contains('oculto') && diaAtual.data === hojeISO()) {
      pintarLinhaTempo(diaAtual);
    }
    // Durante a viagem o cartão da Home também anda: agora, a seguir e a reserva.
    if (!$('#tela-home').classList.contains('oculto') && diaDeHoje()) {
      pintarCartaoAcao(diaDeHoje());
    }
  }, 60000);

  console.log('[app] pronto —', diaAtual.data, diaAtual.titulo);
})();
