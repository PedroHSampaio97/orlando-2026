/* =============================================================================
   Orlando 2026 — interface
   Fase 2: Home (contagem, dia de hoje, próximo compromisso) + Timeline do dia.
   ========================================================================== */

(function () {
  'use strict';

  const R = window.ROTEIRO;
  const E = window.Estado;
  const $ = (s) => document.querySelector(s);

  /* ---------------------------------------------------------------------------
     Tempo — sempre em minutos desde a meia-noite, sempre data civil pura.
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
  const diasEntre = (a, b) =>
    Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);

  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun',
                 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const dataCurta = (iso) => {
    const p = iso.split('-');
    return (+p[2]) + ' de ' + { '01':'janeiro','02':'fevereiro','03':'março','04':'abril',
      '05':'maio','06':'junho','07':'julho','08':'agosto','09':'setembro','10':'outubro',
      '11':'novembro','12':'dezembro' }[p[1]];
  };

  /* ---------------------------------------------------------------------------
     Núcleo: horário efetivo de um bloco.
     ------------------------------------------------------------------------ */
  function refDoDia(dia) {
    if (!dia.referencia) return null;
    return E.referencia(dia.id) || dia.referencia.padrao;
  }
  function refEditada(dia) {
    return !!(dia.referencia && E.referencia(dia.id) &&
              E.referencia(dia.id) !== dia.referencia.padrao);
  }
  function ancoraDe(bloco) { return E.ancora(bloco.id) || bloco.ancora; }

  // Devolve os blocos do dia com hora efetiva, ordenados, com colisões marcadas.
  function blocosDoDia(dia) {
    const padrao = dia.referencia ? paraMin(dia.referencia.padrao) : null;
    const real   = dia.referencia ? paraMin(refDoDia(dia)) : null;
    const delta  = padrao === null ? 0 : real - padrao;

    const lista = dia.blocos.map(function (b) {
      const anc = ancoraDe(b);
      const base = paraMin(b.hora);
      const efet = (anc === 'referencia' && padrao !== null) ? base + delta : base;
      return {
        dados: b, ancora: anc, minOriginal: base, min: efet,
        hora: paraHora(efet), deslocado: efet !== base, colisao: null,
      };
    });

    lista.sort((a, b) => a.min - b.min || a.minOriginal - b.minOriginal);

    // Colisão: dois blocos que ficaram a menos de 15 min um do outro, mas que no
    // documento estavam separados por 15 min ou mais. Ou seja, o deslocamento criou
    // o conflito — não é um aperto que já existia.
    for (let i = 1; i < lista.length; i++) {
      const a = lista[i - 1], b = lista[i];
      const agora = b.min - a.min;
      const antes = Math.abs(b.minOriginal - a.minOriginal);
      if (agora < 15 && antes >= 15) {
        // Cada lado nomeia o OUTRO bloco, nunca a si mesmo.
        const frase = (outro) => 'Choca com "' + outro.dados.titulo + '"' +
          (outro.ancora === 'fixo' ? ', que tem horário fixo e não desloca.' : '.');
        a.colisao = a.colisao || frase(b);
        b.colisao = frase(a);
      }
    }
    return lista;
  }

  const contarFeitos = (dia) => dia.blocos.filter((b) => E.feito(b.id)).length;
  // Blocos "vazio proposital" não contam como tarefa a cumprir.
  const contaveis = (dia) => dia.blocos.filter((b) => b.tipo !== 'vazio');

  /* ---------------------------------------------------------------------------
     Estado da navegação
     ------------------------------------------------------------------------ */
  const diaDeHoje = () => R.dias.find((d) => d.data === hojeISO()) || null;
  let diaAtual = diaDeHoje() || R.dias[0];
  let soFalta = false;

  /* ---------------------------------------------------------------------------
     HOME
     ------------------------------------------------------------------------ */
  function pintarHome() {
    const hoje = hojeISO();
    const faltam = diasEntre(hoje, R.viagem.inicio);
    const dHoje = diaDeHoje();

    const cx = $('#contagem');
    if (dHoje) {
      const n = diasEntre(R.viagem.inicio, hoje) + 1;
      $('#contagem-num').textContent = n;
      $('#contagem-unid').textContent = 'de ' + R.dias.length;
      $('#contagem-alvo').textContent = dHoje.emoji + ' ' + dHoje.titulo;
      $('#contagem .contagem-rotulo').textContent = 'dia da viagem';
    } else if (faltam > 0) {
      $('#contagem-num').textContent = faltam;
      $('#contagem-unid').textContent = faltam === 1 ? 'dia' : 'dias';
      $('#contagem-alvo').textContent = 'para 10 de novembro de 2026';
      $('#contagem .contagem-rotulo').textContent = 'faltam';
    } else {
      $('#contagem-num').textContent = '✓';
      $('#contagem-unid').textContent = 'viagem concluída';
      $('#contagem-alvo').textContent = '10 a 26 de novembro de 2026';
      $('#contagem .contagem-rotulo').textContent = '';
    }
    cx.hidden = false;

    pintarProximo(dHoje);
    pintarGradeDias();
    pintarAlertaHome();
  }

  function pintarProximo(dHoje) {
    const alvo = $('#cartao-proximo');
    alvo.innerHTML = '';
    if (!dHoje) return;

    const agoraMin = new Date().getHours() * 60 + new Date().getMinutes();
    const prox = blocosDoDia(dHoje).find((b) => b.min >= agoraMin && !E.feito(b.dados.id));
    if (!prox) return;

    const falta = prox.min - agoraMin;
    const h = Math.floor(falta / 60), m = falta % 60;
    const txt = falta <= 0 ? 'agora' :
      (h > 0 ? 'em ' + h + 'h' + (m ? String(m).padStart(2, '0') : '') : 'em ' + m + ' min');

    const el = document.createElement('div');
    el.className = 'proximo';
    el.innerHTML =
      '<div class="proximo-rotulo">próximo compromisso</div>' +
      '<div class="proximo-hora">' + prox.hora + '</div>' +
      '<div class="proximo-titulo"></div>' +
      '<div class="proximo-falta">' + txt + '</div>';
    el.querySelector('.proximo-titulo').textContent = prox.dados.titulo;
    el.addEventListener('click', function () { irParaDia(dHoje); });
    alvo.appendChild(el);
  }

  function pintarGradeDias() {
    const grade = $('#grade-dias');
    grade.innerHTML = '';
    const hoje = hojeISO();

    R.dias.forEach(function (dia) {
      const total = contaveis(dia).length;
      const feitos = contarFeitos(dia);
      const pct = total ? Math.round((feitos / total) * 100) : 0;

      const b = document.createElement('button');
      b.className = 'cartao-dia' + (dia.data === hoje ? ' e-hoje' : '');
      b.innerHTML =
        '<span class="cd-data"></span>' +
        '<span class="cd-emoji"></span>' +
        '<span class="cd-nome"></span>' +
        '<span class="cd-prog"><i style="width:' + pct + '%"></i></span>';
      b.querySelector('.cd-data').textContent = (+dia.data.split('-')[2]) + '/11';
      b.querySelector('.cd-emoji').textContent = dia.emoji;
      b.querySelector('.cd-nome').textContent = dia.titulo;
      b.addEventListener('click', function () { irParaDia(dia); });
      grade.appendChild(b);
    });
  }

  function pintarAlertaHome() {
    const alvo = $('#secao-alerta');
    alvo.innerHTML = '';
    const al = R.estrategiaPasses.disney.compra.alerta;
    if (!al) return;
    alvo.innerHTML = '<h2>Atenção</h2>';
    const d = document.createElement('div');
    d.className = 'aviso perigo';
    d.innerHTML = '<strong></strong>';
    d.querySelector('strong').textContent = al.titulo;
    d.appendChild(document.createTextNode(
      al.texto.split('\n')[0] + ' Veja a ficha do parque para o detalhe.'));
    alvo.appendChild(d);
  }

  /* ---------------------------------------------------------------------------
     DIA
     ------------------------------------------------------------------------ */
  function pintarNavDias() {
    const nav = $('#nav-dias');
    nav.innerHTML = '';
    R.dias.forEach(function (dia) {
      const b = document.createElement('button');
      b.className = 'pilula' + (dia.id === diaAtual.id ? ' ativa' : '');
      b.innerHTML = '<b></b><span></span>';
      b.querySelector('b').textContent = +dia.data.split('-')[2];
      b.querySelector('span').textContent = dia.diaSemana.slice(0, 3);
      b.addEventListener('click', function () { irParaDia(dia); });
      nav.appendChild(b);
      if (dia.id === diaAtual.id) {
        setTimeout(function () {
          b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
        }, 0);
      }
    });
  }

  function pintarDia() {
    const dia = diaAtual;

    $('#dia-emoji').textContent = dia.emoji;
    $('#dia-titulo').textContent = dia.titulo;
    $('#dia-data').textContent =
      dia.diaSemana + ', ' + dataCurta(dia.data) +
      (dia.subtitulo ? ' · ' + dia.subtitulo : '');
    $('#dia-resumo').textContent = dia.resumo || '';
    $('#dia-resumo').hidden = !dia.resumo;

    // selos do dia
    const selos = $('#dia-selos');
    selos.innerHTML = '';
    if (dia.custoZero) {
      const s = document.createElement('span');
      s.className = 'selo-dia custo-zero';
      s.textContent = 'entrada extra · custo zero';
      selos.appendChild(s);
    }
    if (dia.operadora) {
      const s = document.createElement('span');
      s.className = 'selo-dia';
      s.textContent = dia.operadora;
      selos.appendChild(s);
    }

    pintarReferencia(dia);
    pintarAvisos(dia);
    pintarLinhaTempo(dia);
    pintarProgresso(dia);
    Fase3.pintarFicha(dia);
    pintarNotas(dia);
    pintarNavDias();
  }

  function pintarReferencia(dia) {
    const cx = $('#referencia');
    if (!dia.referencia) { cx.classList.add('oculto'); return; }
    cx.classList.remove('oculto');

    const inp = $('#inp-referencia');
    const editada = refEditada(dia);
    $('#lbl-referencia').textContent = dia.referencia.rotulo;
    inp.value = refDoDia(dia);
    inp.classList.toggle('editado', editada);
    $('#btn-ref-reset').disabled = !editada;

    const ajuda = $('#referencia-ajuda');
    if (editada) {
      const d = paraMin(refDoDia(dia)) - paraMin(dia.referencia.padrao);
      const sinal = d > 0 ? '+' : '−';
      const abs = Math.abs(d);
      ajuda.textContent = 'Documento assumia ' + dia.referencia.padrao + '. ' +
        'Os blocos ancorados deslocaram ' + sinal +
        (abs >= 60 ? Math.floor(abs / 60) + 'h' + (abs % 60 ? String(abs % 60).padStart(2,'0') : '')
                   : abs + ' min') + '.';
      ajuda.classList.add('ativa');
    } else {
      ajuda.textContent = 'Premissa do documento. Ajuste quando saírem os horários oficiais — ' +
        'os blocos ancorados deslocam junto, os de horário fixo não.';
      ajuda.classList.remove('ativa');
    }
  }

  function pintarAvisos(dia) {
    const alvo = $('#avisos-dia');
    alvo.innerHTML = '';
    (dia.avisos || []).forEach(function (t) {
      const d = document.createElement('div');
      d.className = 'aviso';
      d.textContent = t;
      alvo.appendChild(d);
    });
    (dia.notas || []).forEach(function (n) {
      const d = document.createElement('div');
      d.className = 'aviso ' + (n.tipo === 'bom' ? 'bom' : n.tipo === 'atencao' ? '' : 'bom');
      d.textContent = n.texto;
      if (n.pesquisa) {
        const s = document.createElement('span');
        s.className = 'marca-pesquisa';
        s.textContent = 'verificado na web em ' + n.pesquisa.split('-').reverse().join('/');
        d.appendChild(s);
      }
      alvo.appendChild(d);
    });
    if (dia.notaCusto) {
      const d = document.createElement('div');
      d.className = 'aviso bom';
      d.textContent = dia.notaCusto;
      alvo.appendChild(d);
    }
  }

  const ROTULO_ACESSO = {
    'rope-drop': 'rope drop', 'multi-pass': 'multi pass',
    'single-pass': 'single pass', 'standby': 'standby', 'reserva': 'reserva',
  };

  /* ---------------------------------------------------------------------------
     Ícones por categoria — SVG inline, nada externo.
     ------------------------------------------------------------------------ */
  const ICONES = {
    atracao:      'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9z',
    refeicao:     'M4 3v7a2.5 2.5 0 0 0 5 0V3M6.5 12v9M17 3c-1.4 0-2.5 2-2.5 4.5S15.6 12 17 12v9',
    deslocamento: 'M5 12h14M13 6l6 6-6 6',
    show:         'M4 5h16v11H4zM9 20h6M12 16v4M9 8l5 2.5L9 13z',
    compras:      'M6 8h12l-1 12H7zM9 8V6a3 3 0 0 1 6 0v2',
    espera:       'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 7v5l3.5 2',
    tarefa:       'M9 11l2.5 2.5L16 9M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z',
    livre:        'M13 4a2 2 0 1 0 0-.1zM11 21l1.5-6L9 12l1-5 4 2 3 1M9 21l2-5',
    vazio:        'M20 14a8 8 0 1 1-9.9-9.9A7 7 0 0 0 20 14z',
  };
  const ICONE_LOCAL = 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11zM12 8a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z';
  const ICONE_SETA  = 'M12 5v14M6 13l6 6 6-6';

  function svg(d, cls) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    if (cls) s.setAttribute('class', cls);
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    s.appendChild(p);
    return s;
  }

  // Deep link do Google Maps. Sem mapa embutido — abre o app nativo.
  function linkMaps(local) {
    if (local && local.lat != null && local.lng != null) {
      return 'https://maps.google.com/?q=' + local.lat + ',' + local.lng;
    }
    return 'https://maps.google.com/?q=' + encodeURIComponent(
      (local && local.nome) || '');
  }
  const acharLocal = (id) => R.locais.find((l) => l.id === id) || null;

  function intervaloTexto(min) {
    if (min < 60) return min + ' min';
    const h = Math.floor(min / 60), m = min % 60;
    return h + 'h' + (m ? String(m).padStart(2, '0') : '');
  }

  function pintarLinhaTempo(dia) {
    const ol = $('#linha-tempo');
    ol.innerHTML = '';
    let lista = blocosDoDia(dia);
    if (soFalta) lista = lista.filter((b) => !E.feito(b.dados.id));

    if (!lista.length) {
      ol.innerHTML = '<li class="vazio-lista">Tudo feito neste dia. 🎉</li>';
      return;
    }

    lista.forEach(function (item, i) {
      ol.appendChild(paradaEl(item, dia));

      // conector até a próxima parada
      const prox = lista[i + 1];
      if (!prox) return;
      const gap = prox.min - item.min;
      const conector = document.createElement('li');
      conector.className = 'conector';

      if (gap > 0) {
        const t = document.createElement('span');
        t.className = 'conector-tempo';
        t.textContent = intervaloTexto(gap);
        conector.appendChild(t);
      }

      // Se a próxima parada muda de lugar, oferece a rota — conceito do Wanderlog:
      // o intervalo entre paradas é clicável e abre a navegação.
      const localProx = prox.dados.localId ? acharLocal(prox.dados.localId) : null;
      if (localProx && prox.dados.localId !== item.dados.localId) {
        const a = document.createElement('a');
        a.className = 'btn-maps';
        a.href = linkMaps(localProx);
        a.target = '_blank';
        a.rel = 'noopener';
        a.appendChild(svg(ICONE_LOCAL));
        a.appendChild(document.createTextNode(localProx.nome.split('—')[0].trim()));
        conector.appendChild(a);
      }

      if (conector.children.length) ol.appendChild(conector);
    });
  }

  function paradaEl(item, dia) {
    const b = item.dados;
    const li = document.createElement('li');
    li.className = 'parada t-' + b.tipo +
      (E.feito(b.id) ? ' feita' : '') + (item.colisao ? ' colide' : '');

    /* marcador no trilho */
    const marca = document.createElement('div');
    marca.className = 'marcador';
    marca.appendChild(svg(ICONES[b.tipo] || ICONES.livre));
    li.appendChild(marca);

    /* card */
    const card = document.createElement('div');
    card.className = 'cartao';

    const cab = document.createElement('div');
    cab.className = 'cartao-cabeca';
    const h = document.createElement('span');
    h.className = 'ct-hora';
    h.textContent = item.hora;
    cab.appendChild(h);

    if (item.deslocado) {
      const pin = document.createElement('span');
      pin.className = 'ct-pin';
      pin.title = 'deslocado pelo horário de referência';
      cab.appendChild(pin);
      const antiga = document.createElement('span');
      antiga.className = 'ct-hora-antiga';
      antiga.textContent = b.hora;
      cab.appendChild(antiga);
    }
    if (b.duracaoMin) {
      const d = document.createElement('span');
      d.className = 'ct-dur';
      d.textContent = '· ' + b.duracaoMin + ' min';
      cab.appendChild(d);
    }

    if (b.tipo !== 'vazio') {
      const chk = document.createElement('button');
      chk.className = 'ct-check';
      chk.setAttribute('aria-pressed', E.feito(b.id) ? 'true' : 'false');
      chk.setAttribute('aria-label', 'Marcar como feito: ' + b.titulo);
      chk.appendChild(svg('M4 12l6 6L20 6'));
      chk.addEventListener('click', function () {
        E.marcarFeito(b.id, !E.feito(b.id));
        pintarLinhaTempo(dia); pintarProgresso(dia);
      });
      cab.appendChild(chk);
    }
    card.appendChild(cab);

    const tit = document.createElement('div');
    tit.className = 'ct-titulo';
    tit.textContent = b.titulo;
    card.appendChild(tit);

    if (b.descricao) {
      const d = document.createElement('div');
      d.className = 'ct-desc'; d.textContent = b.descricao;
      card.appendChild(d);
    }
    if (b.areaParque || b.endereco) {
      const a = document.createElement('div');
      a.className = 'ct-area';
      a.appendChild(svg(ICONE_LOCAL));
      a.appendChild(document.createTextNode(b.areaParque || b.endereco));
      card.appendChild(a);
    }

    /* selos */
    const selos = document.createElement('div');
    selos.className = 'ct-selos';
    (b.acesso || []).forEach(function (ac) {
      const s = document.createElement('span');
      s.className = 'selo selo-' + ac;
      s.textContent = ROTULO_ACESSO[ac] || ac;
      selos.appendChild(s);
    });
    if (b.acessoAlt) {
      const s = document.createElement('span');
      s.className = 'selo selo-' + b.acessoAlt;
      s.textContent = 'ou ' + (ROTULO_ACESSO[b.acessoAlt] || b.acessoAlt);
      selos.appendChild(s);
    }
    if (b.confirmarHorario) {
      const s = document.createElement('span');
      s.className = 'selo selo-confirmar'; s.textContent = '⚠ confirmar horário';
      selos.appendChild(s);
    }
    if (b.molha) {
      const s = document.createElement('span');
      s.className = 'selo selo-molha'; s.textContent = '💧 molha';
      selos.appendChild(s);
    }
    if (b.locker) {
      const s = document.createElement('span');
      s.className = 'selo selo-locker';
      s.textContent = b.locker === 'detector' ? '🔒 locker + detector' : '🔒 locker';
      selos.appendChild(s);
    }
    if (b.critico) {
      const s = document.createElement('span');
      s.className = 'selo selo-critico'; s.textContent = 'crítico';
      selos.appendChild(s);
    }
    if (selos.children.length) card.appendChild(selos);

    if (b.condicao) {
      const d = document.createElement('div');
      d.className = 'ct-nota'; d.textContent = '→ ' + b.condicao;
      card.appendChild(d);
    }
    if (b.nota) {
      const d = document.createElement('div');
      d.className = 'ct-nota'; d.textContent = b.nota;
      card.appendChild(d);
    }
    if (item.colisao) {
      const d = document.createElement('div');
      d.className = 'ct-colisao'; d.textContent = '⚠ ' + item.colisao;
      card.appendChild(d);
    }
    if (b.contexto) {
      const d = document.createElement('div');
      d.className = 'ct-contexto'; d.textContent = b.contexto;
      card.appendChild(d);
    }

    li.appendChild(card);
    return li;
  }

  function pintarProgresso(dia) {
    const total = contaveis(dia).length;
    const feitos = contarFeitos(dia);
    const pct = total ? (feitos / total) * 100 : 0;
    $('#progresso-fill').style.width = pct + '%';
    $('#progresso-texto').textContent = feitos + ' de ' + total + ' feitos';
    pintarGradeDias();
  }

  let timerNota = null;
  function pintarNotas(dia) {
    const ta = $('#notas-texto');
    ta.value = E.nota(dia.id);
    $('#notas-status').textContent = '';
  }

  /* ---------------------------------------------------------------------------
     Navegação
     ------------------------------------------------------------------------ */
  const TELAS = ['home', 'dia', 'comer', 'guia', 'pendencias'];

  function mostrarTela(nome) {
    TELAS.forEach(function (t) {
      const alvo = $('#tela-' + t);
      if (alvo) alvo.classList.toggle('oculto', t !== nome);
    });
    document.querySelectorAll('.aba').forEach(function (a) {
      a.classList.toggle('ativa', a.dataset.tela === nome);
    });
    window.scrollTo(0, 0);
    if (nome === 'home') pintarHome();
    else if (nome === 'dia') pintarDia();
    else if (nome === 'comer') Fase3.pintarRestaurantes();
    else if (nome === 'guia') Fase4.pintarGuia();
    else if (nome === 'pendencias') Fase3.pintarPendencias();
  }

  function irParaDia(dia) { diaAtual = dia; mostrarTela('dia'); }

  /* ---------------------------------------------------------------------------
     Eventos
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.aba').forEach(function (a) {
    a.addEventListener('click', function () { mostrarTela(a.dataset.tela); });
  });

  $('#btn-hoje').addEventListener('click', function () {
    const d = diaDeHoje();
    if (d) irParaDia(d);
    else { diaAtual = R.dias[0]; mostrarTela('dia'); }
  });

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
    pintarLinhaTempo(diaAtual);
  });

  $('#notas-texto').addEventListener('input', function (e) {
    clearTimeout(timerNota);
    $('#notas-status').textContent = 'digitando…';
    timerNota = setTimeout(function () {
      E.definirNota(diaAtual.id, e.target.value);
      $('#notas-status').textContent = 'salvo no aparelho';
    }, 500);
  });

  /* tema */
  const TEMA_CHAVE = 'orlando2026:tema';
  function aplicarTema(t) {
    if (t) document.documentElement.setAttribute('data-tema', t);
    else document.documentElement.removeAttribute('data-tema');
    try { t ? localStorage.setItem(TEMA_CHAVE, t) : localStorage.removeItem(TEMA_CHAVE); }
    catch (e) {}
  }
  try { aplicarTema(localStorage.getItem(TEMA_CHAVE)); } catch (e) {}
  $('#btn-tema').addEventListener('click', function () {
    const atual = document.documentElement.getAttribute('data-tema');
    const escuroDoSistema = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!atual) aplicarTema(escuroDoSistema ? 'claro' : 'escuro');
    else if (atual === 'escuro') aplicarTema('claro');
    else aplicarTema('escuro');
  });

  /* ---------------------------------------------------------------------------
     Arranque — se estivermos dentro da viagem, abre direto no dia de hoje.
     ------------------------------------------------------------------------ */
  $('#topo-nome').textContent = R.viagem.titulo;
  $('#topo-sub').textContent = R.viagem.subtitulo;

  // Pinta as pendências uma vez no arranque para o contador de atrasadas
  // aparecer na barra inferior sem precisar abrir a aba.
  Fase3.pintarPendencias();

  // Service worker, status do cache e exportar/importar.
  Fase5.ligar();

  // Atalhos do manifest: ?tela=dia abre direto no roteiro.
  const pedida = new URLSearchParams(location.search).get('tela');
  if (pedida && TELAS.indexOf(pedida) >= 0) mostrarTela(pedida);
  else if (diaDeHoje()) mostrarTela('dia');
  else mostrarTela('home');

  console.log('[app] pronto. Dia atual:', diaAtual.data, diaAtual.titulo);
})();
