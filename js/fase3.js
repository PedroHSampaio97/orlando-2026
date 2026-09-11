/* =============================================================================
   Orlando 2026 — Fase 3
   Ficha do parque (dentro do dia) · Restaurantes · Pendências
   Exposto em window.Fase3 e chamado pelo app.js.
   ========================================================================== */

window.Fase3 = (function () {
  'use strict';

  const R = window.ROTEIRO;
  const E = window.Estado;
  const $ = (s) => document.querySelector(s);

  const MES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const hojeISO = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' +
           String(d.getDate()).padStart(2,'0');
  };
  const diasEntre = (a, b) =>
    Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
  const ddmm = (iso) => { const p = iso.split('-'); return (+p[2]) + '/' + p[1]; };
  const dataExtenso = (iso) => { const p = iso.split('-'); return (+p[2]) + ' ' + MES[+p[1]-1]; };

  /* ---------------------------------------------------------------------------
     RELÓGIO DE ORLANDO
     A pendência das 7h ET é às 9h no Brasil em novembro. O celular diz a hora do
     lugar onde está; o roteiro diz a de Orlando. Estas contas convertem.
     ------------------------------------------------------------------------ */
  const FUSOS = { ET: 'America/New_York', Orlando: 'America/New_York',
                  'Bogotá': 'America/Bogota', Rio: 'America/Sao_Paulo' };
  // Minutos que o fuso está à frente do UTC no instante t (Orlando em novembro: -300).
  function deslocamentoFuso(tz, t) {
    const p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric',
      month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      .formatToParts(new Date(t)).forEach(function (x) { p[x.type] = x.value; });
    return (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - t) / 60000;
  }
  function instanteNoFuso(dataISO, hora, tz) {
    const d = dataISO.split('-').map(Number), h = hora.split(':').map(Number);
    const palpite = Date.UTC(d[0], d[1] - 1, d[2], h[0], h[1]);
    const primeiro = palpite - deslocamentoFuso(tz, palpite) * 60000;
    return palpite - deslocamentoFuso(tz, primeiro) * 60000;
  }
  // O instante da pendência: com fuso, no relógio dele; sem fuso, no do aparelho.
  function instante(dataISO, hora, fuso) {
    return FUSOS[fuso] ? instanteNoFuso(dataISO, hora, FUSOS[fuso])
      : new Date(dataISO + 'T' + hora + ':00').getTime();
  }
  const minutosAte = (dataISO, hora, fuso) =>
    Math.round((instante(dataISO, hora, fuso) - Date.now()) / 60000);
  // "07:00 ET · 09:00 aqui" quando o aparelho está noutro fuso; só "07:00 ET" em Orlando.
  function rotuloHora(dataISO, hora, fuso) {
    if (!fuso) return hora;
    if (!FUSOS[fuso]) return hora + ' ' + fuso;
    const aqui = new Date(instante(dataISO, hora, fuso));
    const local = String(aqui.getHours()).padStart(2, '0') + ':' +
                  String(aqui.getMinutes()).padStart(2, '0');
    return local === hora ? hora + ' ' + fuso : hora + ' ' + fuso + ' · ' + local + ' aqui';
  }
  // O bloco está no fuso em que o aparelho está agora? No voo, não — e o agora não se aplica.
  function fusoDoAparelho(fuso) {
    if (!fuso || !FUSOS[fuso]) return true;
    const t = Date.now();
    return deslocamentoFuso(FUSOS[fuso], t) === -new Date(t).getTimezoneOffset();
  }
  const intervalo = (m) => m < 60 ? m + ' min'
    : Math.floor(m / 60) + 'h' + (m % 60 ? String(m % 60).padStart(2, '0') : '');

  const ddmmP = (iso) => { const p = iso.split('-'); return (+p[2]) + '/' + p[1]; };
  function svgP(d) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    String(d).split('|').forEach(function (p) {
      const n = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      n.setAttribute('d', p); s.appendChild(n);
    });
    return s;
  }

  const el = (tag, cls, texto) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texto != null) n.textContent = texto;
    return n;
  };

  /* ===========================================================================
     FICHA DO PARQUE — renderizada dentro da tela do dia
     ======================================================================== */
  let diaEmFoco = null;

  function pintarFicha(dia) {
    diaEmFoco = dia;
    const alvo = $('#ficha-dia');
    alvo.innerHTML = '';
    const f = dia.ficha;

    const temPasses = f && (f.multiPass || f.singlePass || f.expressPass);
    const temRenuncias = dia.renuncias && (
      (dia.renuncias.gerais || []).length ||
      dia.renuncias.idioma ||
      (dia.renuncias.fechado || []).length);

    if (temPasses) alvo.appendChild(blocoPasses(dia, f));
    if (temRenuncias) alvo.appendChild(blocoRenuncias(dia.renuncias));
    if (dia.tipo === 'parque') alvo.appendChild(blocoRegras());
    if (dia.alternativa) alvo.appendChild(blocoAlternativa(dia.alternativa));
  }

  function blocoPasses(dia, f) {
    const d = el('details', 'acordeao');
    d.appendChild(el('summary', null, '🎟️  Ficha do parque — o que comprar'));
    const c = el('div', 'acordeao-corpo');

    let primeiro = true;
    const secao = () => {
      const s = el('div', 'passe' + (primeiro ? ' primeiro' : ''));
      primeiro = false;
      return s;
    };

    /* Multi Pass */
    if (f.multiPass) {
      const s = secao();
      const mp = f.multiPass;
      const usar = mp.usar === true ? 'MULTI PASS · SIM'
                 : mp.usar === false ? 'MULTI PASS · NÃO'
                 : 'MULTI PASS · OPCIONAL';
      s.appendChild(el('span', 'passe-nome ' + (mp.usar === false ? 'nao' : 'multi'), usar));

      if (mp.usar !== false) {
        const ul = el('ul', 'lista-atracoes');
        if ((mp.listaAlta || []).length) {
          ul.appendChild(el('li', 'rotulo-lista', 'lista alta — escolham 1'));
          mp.listaAlta.forEach((a) => ul.appendChild(el('li', null, a)));
        }
        if ((mp.listaBaixa || []).length) {
          ul.appendChild(el('li', 'rotulo-lista', 'lista baixa — escolham 2'));
          mp.listaBaixa.forEach((a) => ul.appendChild(el('li', null, a)));
        }
        if ((mp.rolando || []).length) {
          ul.appendChild(el('li', 'rotulo-lista', 'rolando — reservem dentro do parque'));
          mp.rolando.forEach((a) => ul.appendChild(el('li', null, a)));
        }
        if (ul.children.length) s.appendChild(ul);
        if (mp.planoB) s.appendChild(el('div', 'plano-b', '⚠ Plano B: ' + mp.planoB));
      }
      if (mp.nota) s.appendChild(el('p', 'passe-nota', mp.nota));
      c.appendChild(s);
    }

    /* Single Pass */
    if (f.singlePass && (f.singlePass.itens || []).length) {
      const s = secao();
      s.appendChild(el('span', 'passe-nome single', 'SINGLE PASS · COMPRA SEPARADA'));
      const ul = el('ul', 'lista-atracoes');
      f.singlePass.itens.forEach((a) => ul.appendChild(el('li', null, a)));
      (f.singlePass.opcionais || []).forEach((a) =>
        ul.appendChild(el('li', null, a + '  (opcional)')));
      s.appendChild(ul);
      if (f.singlePass.nota) s.appendChild(el('p', 'passe-nota', '⚠ ' + f.singlePass.nota));
      c.appendChild(s);
    }

    /* Express Pass (Universal) */
    if (f.expressPass) {
      const s = secao();
      s.appendChild(el('span', 'passe-nome ' + (f.expressPass.usar ? 'express' : 'nao'),
        f.expressPass.usar ? 'EXPRESS PASS · SIM' : 'EXPRESS PASS · NÃO'));
      if (f.expressPass.motivo) s.appendChild(el('p', 'passe-nota', f.expressPass.motivo));
      if (f.expressPass.alternativa)
        s.appendChild(el('p', 'passe-nota', '→ ' + f.expressPass.alternativa));
      c.appendChild(s);
    }

    /* Custo */
    if (f.custoEstimadoCasal && f.custoEstimadoCasal.max > 0) {
      const cu = el('div', 'custo-passe');
      cu.appendChild(document.createTextNode('Gasto estimado no casal: '));
      cu.appendChild(el('b', null, 'US$ ' + f.custoEstimadoCasal.min +
        (f.custoEstimadoCasal.max !== f.custoEstimadoCasal.min
          ? '–' + f.custoEstimadoCasal.max : '')));
      c.appendChild(cu);
    }

    /* Extras */
    (f.extras || []).forEach(function (x) {
      const s = secao();
      s.appendChild(el('div', 'regra-t', x.nome +
        (x.custo ? '  ·  ~US$ ' + x.custo.max : '')));
      s.appendChild(el('div', 'regra-x', x.texto));
      c.appendChild(s);
    });

    /* Alerta global da compra de Lightning Lane, só nos dias Disney */
    if (dia.operadora === 'disney') {
      const al = R.estrategiaPasses.disney.compra.alerta;
      if (al) {
        const a = el('div', 'aviso perigo');
        a.appendChild(el('strong', null, '⚠ ' + al.titulo));
        a.appendChild(document.createTextNode(al.texto));
        a.style.whiteSpace = 'pre-line';
        c.appendChild(a);
      }
    }

    d.appendChild(c);
    return d;
  }

  function blocoRenuncias(ren) {
    const total = (ren.gerais || []).length +
      (ren.idioma ? ren.idioma.itens.length : 0) + (ren.fechado || []).length;
    const d = el('details', 'acordeao');
    d.appendChild(el('summary', null, '🚫  Renúncias — ' + total + ' coisas que vocês não vão fazer'));
    const c = el('div', 'acordeao-corpo');

    if ((ren.gerais || []).length) {
      const g = el('div', 'renuncia-grupo primeiro');
      g.appendChild(el('h4', null, 'Não vão render para vocês'));
      const lista = el('div', 'renuncia-lista');
      ren.gerais.forEach(function (item) {
        if (item.motivo) {
          const i = el('div', 'renuncia-item com-motivo');
          i.appendChild(el('b', null, item.nome));
          i.appendChild(el('div', 'renuncia-motivo', item.motivo));
          lista.appendChild(i);
        } else {
          lista.appendChild(el('span', 'renuncia-item', item.nome));
        }
      });
      g.appendChild(lista);
      c.appendChild(g);
    }

    if (ren.idioma) {
      const g = el('div', 'renuncia-grupo');
      g.appendChild(el('h4', null, 'Renúncia por barreira de idioma'));
      const lista = el('div', 'renuncia-lista');
      ren.idioma.itens.forEach((n) => lista.appendChild(el('span', 'renuncia-item', n)));
      g.appendChild(lista);
      g.appendChild(el('p', 'renuncia-nota', ren.idioma.motivo));
      c.appendChild(g);
    }

    if ((ren.fechado || []).length) {
      const g = el('div', 'renuncia-grupo');
      g.appendChild(el('h4', null, 'Fechado'));
      const lista = el('div', 'renuncia-lista');
      ren.fechado.forEach((n) => lista.appendChild(el('span', 'renuncia-item', n)));
      g.appendChild(lista);
      c.appendChild(g);
    }

    d.appendChild(c);
    return d;
  }

  function blocoRegras() {
    const d = el('details', 'acordeao');
    const EXTENSO = ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito',
                     'nove', 'dez'];
    const qtd = R.regrasDeOuro.length;
    d.appendChild(el('summary', null, '⭐  As ' + (EXTENSO[qtd] || qtd) + ' regras de ouro'));
    const c = el('div', 'acordeao-corpo');
    R.regrasDeOuro.forEach(function (r) {
      const linha = el('div', 'regra');
      linha.appendChild(el('div', 'regra-n', r.n));
      const t = el('div');
      t.appendChild(el('div', 'regra-t', r.titulo));
      t.appendChild(el('div', 'regra-x', r.texto));
      linha.appendChild(t);
      c.appendChild(linha);
    });
    d.appendChild(c);
    return d;
  }

  function blocoAlternativa(alt) {
    const d = el('details', 'acordeao');
    d.appendChild(el('summary', null, '🔀  Alternativa — ' + alt.titulo));
    const c = el('div', 'acordeao-corpo');
    c.appendChild(el('p', 'regra-x', alt.texto));
    d.appendChild(c);
    return d;
  }

  /* ===========================================================================
     DIA FECHADO — planos A/B/C, listas de compra, o que não perder
     ======================================================================== */
  function pintarFechamento(dia) {
    const alvo = $('#fechamento-dia');
    alvo.innerHTML = '';
    if (!dia.fechado) return;

    if ((dia.planos || []).length) alvo.appendChild(blocoPlanos(dia.planos));
    (dia.listas || []).forEach((l) => alvo.appendChild(blocoLista(l)));
    if ((dia.naoPerca || []).length) alvo.appendChild(blocoNaoPerca(dia.naoPerca));
    if (dia.prepararAmanha) alvo.appendChild(blocoPrepararAmanha(dia));
  }

  // B2 é variante do B: mesma cor, mesmo estágio de gravidade.
  const LETRA_COR = { A: 'pl-a', B: 'pl-b', B2: 'pl-b', C: 'pl-c' };

  function blocoPlanos(planos) {
    const d = el('details', 'acordeao');
    d.dataset.chave = 'planos';
    d.appendChild(el('summary', null, '🧭  Plano A, B e C — o que fazer se o dia virar'));
    const c = el('div', 'acordeao-corpo');

    planos.forEach(function (p) {
      const bloco = el('div', 'plano ' + (LETRA_COR[p.letra] || ''));
      bloco.dataset.item = 'plano:' + p.letra;
      const topo = el('div', 'plano-topo');
      topo.appendChild(el('span', 'plano-letra', p.letra));
      const t = el('div');
      t.appendChild(el('div', 'plano-titulo', p.titulo));
      t.appendChild(el('div', 'plano-gatilho', p.gatilho));
      topo.appendChild(t);
      bloco.appendChild(topo);

      const ol = el('ol', 'plano-passos');
      p.passos.forEach((x) => ol.appendChild(el('li', null, x)));
      bloco.appendChild(ol);
      c.appendChild(bloco);
    });
    d.appendChild(c);
    return d;
  }

  // O check e gravado pelo id do item, nao pelo texto: o texto muda quando a marca
  // entra, e a chave por texto apagaria o que ja foi marcado. A chave antiga ainda
  // e lida, para quem marcou antes de o id existir.
  const chaveItem = (lista, item) => 'lista:' + lista.id + ':' + (item.id || item.texto);
  const chaveAntiga = (lista, item) => 'lista:' + lista.id + ':' + item.texto;
  const itemFeito = (lista, item) =>
    E.feito(chaveItem(lista, item)) || (item.id ? E.feito(chaveAntiga(lista, item)) : false);

  function blocoLista(lista) {
    const rotulo = () => '🛒  ' + lista.titulo + '  ·  ' +
      lista.itens.filter((i) => itemFeito(lista, i)).length + '/' + lista.itens.length;
    const d = el('details', 'acordeao');
    d.dataset.chave = 'lista:' + lista.id;
    const sum = el('summary', null, rotulo());
    d.appendChild(sum);
    const c = el('div', 'acordeao-corpo');
    if (lista.intro) c.appendChild(el('p', 'lista-intro', lista.intro));

    // Na ordem das secoes da loja: a ordem da lista e a rota dentro do Walmart.
    const secoes = (R.meta.secoesLoja || []).slice();
    lista.itens.forEach((i) => { if (i.secao && secoes.indexOf(i.secao) < 0) secoes.push(i.secao); });
    const grupos = secoes
      .map((s) => ({ secao: s, itens: lista.itens.filter((i) => i.secao === s) }))
      .filter((g) => g.itens.length);
    const semSecao = lista.itens.filter((i) => !i.secao);
    if (semSecao.length) grupos.push({ secao: null, itens: semSecao });

    grupos.forEach(function (g) {
      if (g.secao) c.appendChild(el('div', 'lista-secao', g.secao));
      g.itens.forEach(function (item) {
        const marcado = itemFeito(lista, item);
        const li = el('div', 'item-lista' + (marcado ? ' marcado' : ''));
        li.dataset.item = 'item:' + (item.id || item.texto);

        const chk = el('button', 'bl-check');
        chk.setAttribute('aria-pressed', marcado ? 'true' : 'false');
        chk.setAttribute('aria-label', 'Marcar: ' + item.texto);
        chk.appendChild(svgP('M4 12l6 6L20 6'));
        chk.addEventListener('click', function () {
          const agora = !itemFeito(lista, item);
          E.marcarFeito(chaveItem(lista, item), agora);
          if (!agora && item.id) E.marcarFeito(chaveAntiga(lista, item), false);
          // Só o item e o contador mudam. Repintar fechava a lista aberta no meio
          // do Walmart, a cada toque.
          li.classList.toggle('marcado', agora);
          chk.setAttribute('aria-pressed', agora ? 'true' : 'false');
          sum.textContent = rotulo();
        });
        li.appendChild(chk);

        const t = el('div', 'item-corpo');
        const linha = el('div', 'item-texto');
        linha.appendChild(document.createTextNode(item.texto));
        if (item.essencial) linha.appendChild(el('span', 'selo selo-critico', 'essencial'));
        t.appendChild(linha);
        if (item.marca) t.appendChild(el('div', 'item-marca', item.marca));
        if (item.alternativaBarata) {
          t.appendChild(el('div', 'item-barato', 'mais barato: ' + item.alternativaBarata));
        }
        if (item.motivo) t.appendChild(el('div', 'item-motivo', item.motivo));
        li.appendChild(t);
        c.appendChild(li);
      });
    });
    d.appendChild(c);
    return d;
  }
  function blocoNaoPerca(itens) {
    const d = el('details', 'acordeao');
    d.dataset.chave = 'naoperca';
    // A estrela é das regras de ouro; o que não perder ganha outro sinal.
    d.appendChild(el('summary', null, '📌  O que não perder — e o que fica para depois'));
    const c = el('div', 'acordeao-corpo');
    itens.forEach(function (x) {
      const b = el('div', 'nao-perca' +
        ((x.quando === 'descartado' || x.quando === 'fechada') ? ' np-fora' : ''));
      b.dataset.item = 'np:' + x.nome;
      const topo = el('div', 'np-topo');
      topo.appendChild(el('span', 'np-nome', x.nome));
      if (x.quando) {
        // etiqueta fechada: hoje | dia NN | decidir | descartado
        const q = String(x.quando);
        const classe = q === 'hoje' ? 'np-hoje'
                     : q === 'decidir' ? 'np-decidir'
                     : (q === 'descartado' || q === 'fechada') ? 'np-fora'
                     : 'np-depois';
        topo.appendChild(el('span', 'np-quando ' + classe, q));
      }
      if (x.condicao) topo.appendChild(el('span', 'np-condicao', x.condicao));
      b.appendChild(topo);
      if (x.custo) b.appendChild(el('div', 'np-custo', x.custo));
      if (x.motivo) b.appendChild(el('div', 'np-motivo', x.motivo));
      if (x.pesquisa) {
        b.appendChild(el('div', 'np-pesquisa',
          'verificado na web em ' + x.pesquisa.split('-').reverse().join('/')));
      }
      c.appendChild(b);
    });
    d.appendChild(c);
    return d;
  }

  /* Fecha o dia olhando para o seguinte. O que dá para resolver na véspera
     resolve-se na véspera — às 5h45 ninguém procura nada. */
  function blocoPrepararAmanha(dia) {
    const p = dia.prepararAmanha;
    const chave = (i) => 'prep:' + dia.id + ':' + i.texto;
    const rotulo = () => '🌙  Deixar pronto para amanhã  ·  ' +
      p.itens.filter((i) => E.feito(chave(i))).length + '/' + p.itens.length;

    const d = el('details', 'acordeao');
    d.dataset.chave = 'preparar';
    const sum = el('summary', null, rotulo());
    d.appendChild(sum);
    const c = el('div', 'acordeao-corpo');

    const cab = el('div', 'prep-alvo');
    cab.appendChild(el('span', 'prep-seta', '→'));
    const t = el('div');
    t.appendChild(el('div', 'prep-titulo', p.titulo));
    const alvo = R.dias.find((x) => x.data === p.paraODia);
    if (alvo) {
      t.appendChild(el('div', 'prep-dia',
        alvo.emoji + '  ' + alvo.diaSemana + ', ' + ddmmP(alvo.data)));
    }
    cab.appendChild(t);
    c.appendChild(cab);

    if (p.aviso) c.appendChild(el('p', 'lista-intro', p.aviso));

    p.itens.forEach(function (item) {
      const k = chave(item);
      const marcado = E.feito(k);
      const li = el('div', 'item-lista' + (marcado ? ' marcado' : ''));
      li.dataset.item = 'prep:' + item.texto;

      const chk = el('button', 'bl-check');
      chk.setAttribute('aria-pressed', marcado ? 'true' : 'false');
      chk.setAttribute('aria-label', 'Marcar: ' + item.texto);
      chk.appendChild(svgP('M4 12l6 6L20 6'));
      chk.addEventListener('click', function () {
        const agora = !E.feito(k);
        E.marcarFeito(k, agora);
        li.classList.toggle('marcado', agora);
        chk.setAttribute('aria-pressed', agora ? 'true' : 'false');
        sum.textContent = rotulo();
      });
      li.appendChild(chk);

      const corpo = el('div', 'item-corpo');
      const linha = el('div', 'item-texto');
      linha.appendChild(document.createTextNode(item.texto));
      if (item.critico) linha.appendChild(el('span', 'selo selo-critico', 'crítico'));
      corpo.appendChild(linha);
      if (item.motivo) corpo.appendChild(el('div', 'item-motivo', item.motivo));
      li.appendChild(corpo);
      c.appendChild(li);
    });

    d.appendChild(c);
    return d;
  }
  /* ===========================================================================
     RESTAURANTES
     ======================================================================== */
  const STATUS = [
    { id: 'a-reservar', rotulo: 'A reservar' },
    { id: 'reservado',  rotulo: 'Reservado' },
    { id: 'confirmado', rotulo: 'Confirmado' },
    { id: 'cancelado',  rotulo: 'Cancelado' },
  ];
  const statusDe = (r) => {
    const s = E.reserva(r.id);
    if (s && s.status) return s.status;
    if (r.statusPadrao) return r.statusPadrao;
    return r.precisaReserva ? 'a-reservar' : null;
  };
  const confirmacaoDe = (r) => {
    const s = E.reserva(r.id);
    if (s && s.confirmacao) return s.confirmacao;
    return r.confirmacaoPadrao || '';
  };

  function pintarRestaurantes(opcoes) {
    const comReserva = R.restaurantes.filter((r) => r.precisaReserva);
    const pendentes = comReserva.filter((r) => statusDe(r) === 'a-reservar').length;
    $('#comer-sub').textContent =
      R.restaurantes.length + ' refeições no roteiro · ' + comReserva.length +
      ' precisam de reserva · ' + pendentes + ' ainda a reservar';

    pintarJanelas();

    const alvo = $('#lista-restaurantes');
    alvo.innerHTML = '';

    // Agrupado por dia, na ordem da viagem
    const porDia = {};
    R.restaurantes.forEach(function (r) {
      (porDia[r.data] = porDia[r.data] || []).push(r);
    });

    Object.keys(porDia).sort().forEach(function (data) {
      const dia = R.dias.find((d) => d.data === data);
      const cab = el('div', 'rest-dia',
        ddmm(data) + '  ·  ' + (dia ? dia.diaSemana + '  ·  ' + dia.titulo : ''));
      cab.dataset.data = data;
      alvo.appendChild(cab);
      porDia[data]
        .sort((a, b) => String(a.hora || '').localeCompare(String(b.hora || '')))
        .forEach((r) => alvo.appendChild(cartaoRestaurante(r)));
    });
    // Durante a viagem a aba abre nas refeições de hoje, e não no dia 10.
    if (opcoes && opcoes.rolarParaHoje) {
      const cab = alvo.querySelector('.rest-dia[data-data="' + hojeISO() + '"]');
      if (cab) {
        requestAnimationFrame(function () {
          window.scrollTo(0, Math.max(0, cab.getBoundingClientRect().top + window.scrollY - 72));
        });
      }
    }
  }

  function cartaoRestaurante(r) {
    const cx = el('div', 'rest' + (r.precisaReserva ? '' : ' sem-reserva'));
    cx.dataset.item = r.id;

    const topo = el('div', 'rest-topo');
    topo.appendChild(el('span', 'rest-hora', r.hora || '—'));
    const nome = el('div');
    nome.appendChild(el('div', 'rest-nome', r.nome));
    if (r.local) nome.appendChild(el('div', 'rest-local', r.local));
    topo.appendChild(nome);
    if (r.precisaReserva === false) topo.appendChild(el('span', 'tag-balcao', 'sem reserva'));
    cx.appendChild(topo);

    if ((r.alternativas || []).length)
      cx.appendChild(el('div', 'rest-alt', 'Alternativas: ' + r.alternativas.join(' · ')));
    if (r.canal) cx.appendChild(el('div', 'rest-alt', 'Onde reservar: ' + r.canal));
    if (r.janelaAbre) {
      const faltam = diasEntre(hojeISO(), r.janelaAbre);
      cx.appendChild(el('div', 'rest-alt',
        '🗓️ Janela abre ' + ddmm(r.janelaAbre) +
        (r.janelaHora ? ' às ' + r.janelaHora : '') +
        (faltam > 0 ? '  (em ' + faltam + ' dia' + (faltam > 1 ? 's' : '') + ')'
                    : faltam === 0 ? '  (HOJE)' : '  (já abriu)')));
    }
    if (r.nota) cx.appendChild(el('div', 'rest-nota', r.nota));

    if (r.precisaReserva) {
      const atual = statusDe(r);
      const linha = el('div', 'rest-status');
      STATUS.forEach(function (s) {
        const b = el('button', 'pill-status', s.rotulo);
        b.dataset.s = s.id;
        b.setAttribute('aria-pressed', atual === s.id ? 'true' : 'false');
        b.addEventListener('click', function () {
          E.definirReserva(r.id, { status: s.id });
          pintarRestaurantes();
        });
        linha.appendChild(b);
      });
      cx.appendChild(linha);

      if (atual === 'reservado' || atual === 'confirmado') {
        const conf = el('div', 'rest-conf');
        const lab = el('label', null, 'Número de confirmação');
        lab.setAttribute('for', 'conf-' + r.id);
        conf.appendChild(lab);
        const inp = el('input');
        inp.id = 'conf-' + r.id;
        inp.type = 'text';
        inp.placeholder = 'ex.: 1234567890';
        inp.value = confirmacaoDe(r);
        // Grava enquanto digita, com 400 ms de folga: fechar o app sem sair do campo
        // perdia o número.
        let espera = null;
        const gravar = function () {
          clearTimeout(espera);
          E.definirReserva(r.id, { confirmacao: inp.value.trim() });
        };
        inp.addEventListener('input', function () {
          clearTimeout(espera);
          espera = setTimeout(gravar, 400);
        });
        inp.addEventListener('change', gravar);
        conf.appendChild(inp);
        cx.appendChild(conf);
      }
    }
    return cx;
  }

  function pintarJanelas() {
    const alvo = $('#janelas-reserva');
    alvo.innerHTML = '';
    const hoje = hojeISO();
    const resolvido = (id) => {
      const r = R.restaurantes.find((x) => x.id === id);
      const s = r && statusDe(r);
      return !r || s === 'reservado' || s === 'confirmado' || s === 'cancelado';
    };

    // As janelas saem das pendências de reserva ainda abertas, na data delas — a
    // mesma da aba Pendências, inclusive quando ela foi ajustada à mão. Pela ficha
    // do restaurante, o Boathouse aparecia como janela futura já reservado.
    const abertas = R.checklist.filter((c) => (c.restauranteIds || []).length &&
      !E.checkFeito(c.id) && !(c.validaAte && c.validaAte < hoje) &&
      !c.restauranteIds.every(resolvido));
    if (!abertas.length) return;
    abertas.sort((a, b) => dataDe(a).localeCompare(dataDe(b)) ||
      String(a.hora || '').localeCompare(String(b.hora || '')));

    alvo.appendChild(el('div', 'rest-dia', 'Janelas de reserva'));
    abertas.forEach(function (c) {
      const data = dataDe(c);
      const faltam = diasEntre(hoje, data);
      const nomes = c.restauranteIds
        .map((id) => (R.restaurantes.find((r) => r.id === id) || {}).nome).filter(Boolean);
      const cx = el('div', 'janela-cartao' + (faltam === 0 ? ' hoje' : ''));
      cx.appendChild(el('div', 'janela-data',
        dataExtenso(data) + (c.hora ? ' · ' + c.hora + ' ' + (c.fuso || '') : '')));
      cx.appendChild(el('div', 'janela-quais', nomes.join(' · ')));
      cx.appendChild(el('div', 'janela-falta',
        faltam > 0 ? 'em ' + faltam + ' dia' + (faltam > 1 ? 's' : '')
        : faltam === 0 ? 'ABRE HOJE'
        : 'aberta há ' + (-faltam) + ' dia' + (faltam < -1 ? 's' : '') + ' e ainda sem reserva'));
      alvo.appendChild(cx);
    });
  }

  /* ===========================================================================
     PENDÊNCIAS — toda uma com data, agrupadas por mês, ordenadas por prazo
     ======================================================================== */
  const MESES_EXT = ['janeiro','fevereiro','março','abril','maio','junho','julho',
                     'agosto','setembro','outubro','novembro','dezembro'];
  // O filtro fica guardado: o iOS mata a página em segundo plano.
  const CHAVE_PEND_FALTA = 'orlando2026:pend-so-falta';
  let pendSoFalta = false;
  try { pendSoFalta = localStorage.getItem(CHAVE_PEND_FALTA) === '1'; } catch (e) { pendSoFalta = false; }

  const dataDe = (c) => E.dataChecklist(c.id) || c.dataAlvo;

  function pintarPendencias() {
    const hoje = hojeISO();
    const total = R.checklist.length;
    const feitos = R.checklist.filter((c) => E.checkFeito(c.id)).length;
    // `< hoje` deixava invisivel exatamente o que mais importa: a tarefa que
    // vence HOJE, com hora marcada. Ela so acendia amanha, quando ja nao serve.
    const valida = (c) => !(c.validaAte && c.validaAte < hoje);
    const atrasadas = R.checklist.filter(
      (c) => !E.checkFeito(c.id) && valida(c) && dataDe(c) <= hoje).length;
    const vencemHoje = R.checklist.filter(
      (c) => !E.checkFeito(c.id) && valida(c) && dataDe(c) === hoje).length;

    $('#pend-fill').style.width = (total ? (feitos / total) * 100 : 0) + '%';
    $('#pend-texto').textContent = feitos + ' de ' + total + ' feitas';
    const vencidas = atrasadas - vencemHoje;
    const partes = [];
    if (vencemHoje) partes.push(vencemHoje + ' para hoje');
    if (vencidas) partes.push(vencidas + ' em atraso');
    $('#pend-sub').textContent = partes.length
      ? partes.join(' · ') + ' · ' + (total - feitos) + ' abertas no total'
      : (total - feitos) + ' abertas, nenhuma vencida';

    const badge = $('#badge-pend');
    if (atrasadas > 0) { badge.textContent = atrasadas; badge.classList.remove('oculto'); }
    else badge.classList.add('oculto');

    const alvo = $('#lista-pendencias');
    alvo.innerHTML = '';

    let itens = R.checklist.slice();
    if (pendSoFalta) itens = itens.filter((c) => !E.checkFeito(c.id));
    // Abertas por prazo, depois as que perderam a validade, e as feitas no fim.
    const peso = (c) => E.checkFeito(c.id) ? 2 : valida(c) ? 0 : 1;
    itens.sort(function (a, b) {
      if (peso(a) !== peso(b)) return peso(a) - peso(b);
      return dataDe(a).localeCompare(dataDe(b));
    });

    if (!itens.length) {
      const v = el('div', 'vazio-lista');
      v.appendChild(svgP('M9 11l2.5 2.5L16 9|M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z'));
      v.appendChild(el('p', null, 'Nada pendente.'));
      alvo.appendChild(v);
      return;
    }

    let mesAtual = null;
    itens.forEach(function (c) {
      const d = dataDe(c);
      const mes = E.checkFeito(c.id) ? 'feitas' : !valida(c) ? 'vencidas' : d.slice(0, 7);
      if (mes !== mesAtual) {
        mesAtual = mes;
        alvo.appendChild(el('div', 'pend-mes', mes === 'feitas' ? 'Concluídas'
          : mes === 'vencidas' ? 'Perderam a validade'
          : MESES_EXT[(+d.split('-')[1]) - 1] + ' de ' + d.split('-')[0]));
      }
      alvo.appendChild(cartaoPendencia(c, hoje));
    });
  }

  function cartaoPendencia(c, hoje) {
    const feito = E.checkFeito(c.id);
    const data = dataDe(c);
    const faltam = diasEntre(hoje, data);
    const vencida = !feito && !!c.validaAte && c.validaAte < hoje;
    const atrasada = !feito && !vencida && faltam < 0;
    const editada = !!E.dataChecklist(c.id);

    const cx = el('div', 'pend' + (feito ? ' feita' : '') + (vencida ? ' vencida' : '') +
      (atrasada ? ' atrasada' : '') + (!feito && !vencida && faltam === 0 ? ' hoje' : ''));
    cx.dataset.item = c.id;

    const chk = el('button', 'bl-check');
    chk.setAttribute('aria-pressed', feito ? 'true' : 'false');
    chk.setAttribute('aria-label', 'Concluir: ' + c.texto);
    chk.appendChild(svgP('M4 12l6 6L20 6'));
    chk.addEventListener('click', function () {
      E.marcarChecklist(c.id, !E.checkFeito(c.id));
      pintarPendencias();
    });
    cx.appendChild(chk);

    const corpo = el('div', 'pend-corpo');
    // A data fica neutra quando falta mais de uma semana: coral só para o que está perto.
    const quando = el('div', 'pend-quando' +
      (!feito && !vencida && faltam >= 0 && faltam <= 7 ? ' pq-perto' : ''));
    quando.appendChild(document.createTextNode(
      ddmmP(data) + (c.hora ? ' · ' + rotuloHora(data, c.hora, c.fuso) : '')));
    if (vencida) {
      quando.appendChild(document.createTextNode(' · perdeu a validade em ' + ddmmP(c.validaAte)));
    } else if (!feito) {
      // No dia, com hora marcada, a conta é em minutos — e "venceu" quando a hora passa.
      const min = c.hora && faltam === 0 ? minutosAte(data, c.hora, c.fuso) : null;
      quando.appendChild(document.createTextNode(
        faltam > 0 ? ' · em ' + faltam + (faltam === 1 ? ' dia' : ' dias')
        : faltam === 0 ? (min === null ? ' · HOJE'
          : min >= 0 ? ' · em ' + intervalo(min)
          : ' · venceu às ' + c.hora + (c.fuso ? ' ' + c.fuso : ''))
        : ' · ATRASADA ' + (-faltam) + (faltam === -1 ? ' dia' : ' dias')));
    }
    corpo.appendChild(quando);
    corpo.appendChild(el('div', 'pend-texto', c.texto));

    if (c.dataEstimada && c.motivoData && !editada) {
      corpo.appendChild(el('div', 'pend-motivo', 'Data estimada: ' + c.motivoData));
    }
    if (c.nota) corpo.appendChild(el('div', 'pend-nota', c.nota));

    const selos = el('div', 'pend-selos');
    // Onde vocês estarão nessa data. Calculado, nunca guardado — o campo
    // `grupo` fazia isso à mão e passou a mentir em 7 dos 22 itens.
    const ondeEstarao = (function () {
      const ini = R.viagem.inicio, fim = R.viagem.fim;
      if (data < ini) return { txt: 'no Brasil', cls: 'onde-brasil' };
      if (data === ini) return { txt: 'em viagem', cls: 'onde-viagem' };
      if (data <= fim) return { txt: 'em Orlando', cls: 'onde-orlando' };
      return null;
    })();
    if (ondeEstarao) {
      selos.appendChild(el('span', 'selo ' + ondeEstarao.cls, ondeEstarao.txt));
    }
    if (c.janelaReserva) selos.appendChild(el('span', 'selo selo-reserva', 'janela de reserva'));
    if (c.critico) selos.appendChild(el('span', 'selo selo-critico', 'crítico'));
    if (c.dataEstimada && !editada) selos.appendChild(el('span', 'selo-estimativa', 'data estimada'));
    if (editada) selos.appendChild(el('span', 'selo selo-tipo', 'data ajustada'));
    (c.restauranteIds || []).forEach(function (rid) {
      const r = R.restaurantes.find((x) => x.id === rid);
      if (r) selos.appendChild(el('span', 'selo selo-tipo', r.nome));
    });
    if (selos.children.length) corpo.appendChild(selos);

    // a data é editável — estimativa minha não vira lei —, mas o campo fica atrás de
    // um toque, e não aberto em todos os cartões
    const ajustar = el('button', 'pend-ajustar', editada ? 'Mudar a data ajustada' : 'Ajustar data');
    ajustar.type = 'button';
    ajustar.addEventListener('click', function () {
      const inp = el('input', 'pend-data-edit');
      inp.type = 'date';
      inp.value = data;
      inp.setAttribute('aria-label', 'Ajustar a data de: ' + c.texto);
      inp.addEventListener('change', function () {
        E.definirDataChecklist(c.id, inp.value === c.dataAlvo ? null : inp.value);
        pintarPendencias();
      });
      ajustar.replaceWith(inp);
      inp.focus();
    });
    corpo.appendChild(ajustar);

    cx.appendChild(corpo);
    return cx;
  }

  /* ===== ligação dos controles próprios ===== */
  document.addEventListener('DOMContentLoaded', function () {
    const chk = $('#chk-pend-falta');
    if (!chk) return;
    chk.checked = pendSoFalta;
    chk.addEventListener('change', function (e) {
      pendSoFalta = e.target.checked;
      try { localStorage.setItem(CHAVE_PEND_FALTA, pendSoFalta ? '1' : '0'); } catch (err) {}
      pintarPendencias();
    });
  });

  return {
    minutosAte: minutosAte, rotuloHora: rotuloHora, fusoDoAparelho: fusoDoAparelho,
    pintarFicha: pintarFicha, pintarFechamento: pintarFechamento,
    pintarRestaurantes: pintarRestaurantes,
    pintarPendencias: pintarPendencias,
    statusDe: statusDe, confirmacaoDe: confirmacaoDe,
    acharRestaurante: (id) => R.restaurantes.find((r) => r.id === id) || null,
  };
})();
