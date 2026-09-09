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
      // Sem isenção por localId: o Boathouse fica DENTRO do Disney Springs e
      // mesmo assim é hora marcada. Quem separa etapa de compromisso é a
      // duração declarada, não o endereço.
      // Fusos diferentes: 01h40 no Rio ate 06h00 em Bogota sao 6h20 de voo, nao
      // 4h20. O `hora` de cada bloco esta no relogio local dele, entao comparar
      // os dois na mao daria alerta falso todo dia. Sem conversao, nao opinamos.
      if (a.dados.fuso && b.dados.fuso && a.dados.fuso !== b.dados.fuso) continue;
      const sobra = b.min - a.min;
      if (sobra >= dur) continue;
      a.colisao = a.colisao ||
        'NÃO CABE: sobram ' + intervaloTexto(Math.max(sobra, 0)) + ' e o plano ' +
        'previa ' + intervaloTexto(dur) + '. Faltam ' + intervaloTexto(dur - sobra) +
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
    if (m) m.setAttribute('content', dia ? corOp(dia) : '#0E4C5E');
  }

  function mostrarTela(nome) {
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
                    acharDia: (id) => R.dias.find((d) => d.id === id) };

  /* =========================================================================
     HOME — ordenada por urgência
     ====================================================================== */
  function pendenciasAbertas() {
    const hoje = hojeISO();
    return R.checklist
      .filter((c) => !E.checkFeito(c.id))
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
      const prox = blocosDoDia(dHoje)
        .find((b) => b.min >= agoraMin() && !E.feito(b.dados.id));

      const rot = el('div', 'acao-rot');
      rot.appendChild(document.createTextNode('hoje · ' + dHoje.emoji + ' ' + dHoje.titulo));
      card.appendChild(rot);

      if (prox) {
        const falta = prox.min - agoraMin();
        card.appendChild(el('div', 'acao-prazo', prox.hora));
        card.appendChild(el('div', 'acao-titulo', prox.dados.titulo));
        card.appendChild(el('div', 'acao-meta',
          falta <= 0 ? 'agora' :
          falta < 60 ? 'em ' + falta + ' min' :
          'em ' + Math.floor(falta / 60) + 'h' +
            (falta % 60 ? String(falta % 60).padStart(2, '0') : '')));
      } else {
        card.appendChild(el('div', 'acao-prazo', feitos + '/' + total));
        card.appendChild(el('div', 'acao-titulo', 'Nada mais marcado para hoje'));
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
    const lista = pendenciasAbertas().slice(0, 4);
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
        setTimeout(function () {
          b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
        }, 0);
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
    else selos.appendChild(el('span', 'selo-dia op',
      dia.tipo === 'logistica' ? 'logística' : 'dia livre'));
    if (dia.custoZero) selos.appendChild(el('span', 'selo-dia custo-zero',
      'entrada extra · custo zero'));
    if (dia.fechado) selos.appendChild(el('span', 'selo-dia fechado',
      '✓ dia revisado em ' + dia.revisadoEm.split('-').reverse().join('/')));

    pintarRotaDia(dia);
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
    $('#lbl-referencia').textContent = dia.referencia.rotulo;
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
      ajuda.textContent = 'Premissa do documento. Ajuste quando saírem os horários oficiais — ' +
        'os blocos ancorados deslocam junto, os de horário fixo não.';
      ajuda.classList.remove('ativa');
    }
  }

  /* As pendencias com hora marcada viviam so na aba Pendencias, e o badge de
     la so contava atraso. Resultado: a compra do Lightning Lane das 7h ET
     vencia sem ninguem ver, e so ficava vermelha no dia seguinte. Agora ela
     aparece na tela do proprio dia em que vence. */
  function pintarVenceHoje(dia) {
    const alvo = $('#vence-hoje');
    alvo.innerHTML = '';
    if (dia.data !== hojeISO()) return;
    const hoje = (R.checklist || []).filter(function (c) {
      const data = E.dataChecklist(c.id) || c.dataAlvo;
      return data === dia.data && !E.checkFeito(c.id);
    });
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

  function pintarAvisos(dia) {
    const alvo = $('#avisos-dia');
    alvo.innerHTML = '';
    (dia.avisos || []).forEach(function (t) {
      alvo.appendChild(el('div', 'aviso', t));
    });
    (dia.notas || []).forEach(function (n) {
      const d = el('div', 'aviso ' + (n.tipo === 'atencao' ? '' : 'bom'));
      d.textContent = n.texto;
      if (n.pesquisa) {
        d.appendChild(el('span', 'marca-pesquisa',
          'verificado na web em ' + n.pesquisa.split('-').reverse().join('/')));
      }
      alvo.appendChild(d);
    });
    if (dia.notaCusto) alvo.appendChild(el('div', 'aviso bom', dia.notaCusto));
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
  };
  const I_PIN = 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z|M12 8a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z';
  const I_LUPA = 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14z|M20 20l-4-4';

  const ROTULO_ACESSO = {
    'rope-drop': 'rope drop', 'multi-pass': 'multi pass',
    'single-pass': 'single pass', 'standby': 'standby', 'reserva': 'reserva',
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
    ol.innerHTML = '';
    let lista = blocosDoDia(dia);
    if (soFalta) lista = lista.filter((b) => !E.feito(b.dados.id));

    if (!lista.length) {
      const v = el('li', 'vazio-lista');
      v.appendChild(svg('M9 11l2.5 2.5L16 9|M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z'));
      v.appendChild(el('p', null, 'Tudo feito neste dia.'));
      ol.appendChild(v);
      return;
    }

    const ehHoje = dia.data === hojeISO();
    const agora = agoraMin();
    let agoraPosto = false;

    lista.forEach(function (item, i) {
      // linha do agora antes do primeiro bloco que ainda não passou
      if (ehHoje && !agoraPosto && item.min > agora) {
        ol.appendChild(linhaAgora(agora));
        agoraPosto = true;
      }
      ol.appendChild(paradaEl(item, dia));

      const prox = lista[i + 1];
      if (!prox) return;
      const gap = prox.min - item.min;
      const conector = el('li', 'conector');
      if (gap > 0) conector.appendChild(el('span', 'conector-tempo', intervaloTexto(gap)));

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

    if (ehHoje && !agoraPosto) ol.appendChild(linhaAgora(agora));
  }

  /* Editor de hora de um bloco. Vale para os blocos com hora oficial que so sai
     perto da data — desfile, fogos, shows. Nao mexe na referencia do dia. */
  function abrirEditorHora(b, dia) {
    const antigo = document.querySelector('.editor-hora');
    if (antigo) antigo.remove();
    const cx = el('div', 'editor-hora');
    cx.appendChild(el('div', 'editor-rot',
      'Qual é o horário oficial de "' + b.titulo + '"?'));
    const inp = document.createElement('input');
    inp.type = 'time';
    inp.className = 'editor-campo';
    inp.value = E.horaBloco(b.id) || b.hora;
    cx.appendChild(inp);
    const linha = el('div', 'editor-botoes');
    const salvar = el('button', 'editor-ok', 'Salvar');
    salvar.addEventListener('click', function () {
      if (inp.value) E.definirHoraBloco(b.id, inp.value);
      cx.remove(); pintarLinhaTempo(dia);
    });
    const limpar = el('button', 'editor-limpar', 'Voltar ao previsto');
    limpar.addEventListener('click', function () {
      E.definirHoraBloco(b.id, null);
      cx.remove(); pintarLinhaTempo(dia);
    });
    linha.appendChild(salvar); linha.appendChild(limpar);
    cx.appendChild(linha);
    document.body.appendChild(cx);
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

  function linhaAgora(min) {
    const li = el('li', 'agora');
    li.appendChild(el('span', 'agora-rot', paraHora(min)));
    li.appendChild(el('div', 'agora-linha'));
    return li;
  }

  function paradaEl(item, dia) {
    const b = item.dados;
    const li = el('li', 'parada t-' + b.tipo +
      (E.feito(b.id) ? ' feita' : '') + (item.colisao ? ' colide' : ''));

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
        E.marcarFeito(b.id, !E.feito(b.id));
        pintarLinhaTempo(dia); pintarProgresso(dia);
      });
      cab.appendChild(chk);
    }
    card.appendChild(cab);
    card.appendChild(el('div', 'ct-titulo', b.titulo));
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
    if (selos.children.length) card.appendChild(selos);

    if (b.condicao) card.appendChild(el('div', 'ct-nota', '→ ' + b.condicao));
    if (b.nota) card.appendChild(el('div', 'ct-nota', b.nota));
    if (item.colisao) card.appendChild(el('div', 'ct-colisao', '⚠ ' + item.colisao));

    // atração ganha busca no Maps por nome — sem coordenada inventada
    if (b.tipo === 'atracao' && !b.localId) {
      const a = el('a', 'ct-maps');
      a.href = linkAtracao(b, dia); a.target = '_blank'; a.rel = 'noopener';
      a.appendChild(svg(I_LUPA));
      a.appendChild(document.createTextNode('achar no Maps'));
      card.appendChild(a);
    }
    if (b.contexto) card.appendChild(el('div', 'ct-contexto', b.contexto));

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
    if (!$('#tela-dia').classList.contains('oculto')) pintarNavDias();
  });

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
  }, 60000);

  console.log('[app] pronto —', diaAtual.data, diaAtual.titulo);
})();
