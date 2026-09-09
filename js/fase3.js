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
    d.appendChild(el('summary', null, '⭐  As cinco regras de ouro'));
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
    d.setAttribute('open', '');
    d.appendChild(el('summary', null, '🧭  Plano A, B e C — o que fazer se o dia virar'));
    const c = el('div', 'acordeao-corpo');

    planos.forEach(function (p) {
      const bloco = el('div', 'plano ' + (LETRA_COR[p.letra] || ''));
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

  function blocoLista(lista) {
    const feitos = lista.itens.filter((i) => E.feito('lista:' + lista.id + ':' + i.texto)).length;
    const d = el('details', 'acordeao');
    d.appendChild(el('summary', null,
      '🛒  ' + lista.titulo + '  ·  ' + feitos + '/' + lista.itens.length));
    const c = el('div', 'acordeao-corpo');
    if (lista.intro) c.appendChild(el('p', 'lista-intro', lista.intro));

    lista.itens.forEach(function (item) {
      const chave = 'lista:' + lista.id + ':' + item.texto;
      const marcado = E.feito(chave);
      const li = el('div', 'item-lista' + (marcado ? ' marcado' : ''));

      const chk = el('button', 'bl-check');
      chk.setAttribute('aria-pressed', marcado ? 'true' : 'false');
      chk.setAttribute('aria-label', 'Marcar: ' + item.texto);
      chk.appendChild(svgP('M4 12l6 6L20 6'));
      chk.addEventListener('click', function () {
        E.marcarFeito(chave, !E.feito(chave));
        pintarFechamento(diaEmFoco);
      });
      li.appendChild(chk);

      const t = el('div', 'item-corpo');
      const linha = el('div', 'item-texto');
      linha.appendChild(document.createTextNode(item.texto));
      if (item.essencial) linha.appendChild(el('span', 'selo selo-critico', 'essencial'));
      t.appendChild(linha);
      if (item.motivo) t.appendChild(el('div', 'item-motivo', item.motivo));
      li.appendChild(t);
      c.appendChild(li);
    });
    d.appendChild(c);
    return d;
  }

  function blocoNaoPerca(itens) {
    const d = el('details', 'acordeao');
    d.appendChild(el('summary', null, '⭐  O que não perder — e o que fica para depois'));
    const c = el('div', 'acordeao-corpo');
    itens.forEach(function (x) {
      const b = el('div', 'nao-perca' +
        ((x.quando === 'descartado' || x.quando === 'fechada') ? ' np-fora' : ''));
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
    const feitos = p.itens.filter((i) => E.feito(chave(i))).length;

    const d = el('details', 'acordeao');
    d.appendChild(el('summary', null,
      '🌙  Deixar pronto para amanhã  ·  ' + feitos + '/' + p.itens.length));
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

      const chk = el('button', 'bl-check');
      chk.setAttribute('aria-pressed', marcado ? 'true' : 'false');
      chk.setAttribute('aria-label', 'Marcar: ' + item.texto);
      chk.appendChild(svgP('M4 12l6 6L20 6'));
      chk.addEventListener('click', function () {
        E.marcarFeito(k, !E.feito(k));
        pintarFechamento(diaEmFoco);
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

  function pintarRestaurantes() {
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
      alvo.appendChild(el('div', 'rest-dia',
        ddmm(data) + '  ·  ' + (dia ? dia.diaSemana + '  ·  ' + dia.titulo : '')));
      porDia[data]
        .sort((a, b) => String(a.hora || '').localeCompare(String(b.hora || '')))
        .forEach((r) => alvo.appendChild(cartaoRestaurante(r)));
    });
  }

  function cartaoRestaurante(r) {
    const cx = el('div', 'rest' + (r.precisaReserva ? '' : ' sem-reserva'));

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
        inp.addEventListener('change', function () {
          E.definirReserva(r.id, { confirmacao: inp.value.trim() });
        });
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

    const porJanela = {};
    R.restaurantes.filter((r) => r.janelaAbre).forEach(function (r) {
      (porJanela[r.janelaAbre] = porJanela[r.janelaAbre] || []).push(r);
    });
    const datas = Object.keys(porJanela).sort();
    if (!datas.length) return;

    alvo.appendChild(el('div', 'rest-dia', 'Janelas de reserva'));
    datas.forEach(function (data) {
      const faltam = diasEntre(hoje, data);
      const restos = porJanela[data];
      const todosFeitos = restos.every((r) => {
        const s = statusDe(r);
        return s === 'reservado' || s === 'confirmado' || s === 'cancelado';
      });
      const cx = el('div', 'janela-cartao' +
        (faltam === 0 ? ' hoje' : '') + ((faltam < 0 || todosFeitos) ? ' passou' : ''));
      cx.appendChild(el('div', 'janela-data',
        dataExtenso(data) + (restos[0].janelaHora ? ' · ' + restos[0].janelaHora : '')));
      cx.appendChild(el('div', 'janela-quais', restos.map((r) => r.nome).join(' · ')));
      cx.appendChild(el('div', 'janela-falta',
        todosFeitos ? '✓ resolvido'
        : faltam > 0 ? 'em ' + faltam + ' dia' + (faltam > 1 ? 's' : '')
        : faltam === 0 ? 'ABRE HOJE' : 'passou há ' + (-faltam) + ' dias'));
      alvo.appendChild(cx);
    });
  }

  /* ===========================================================================
     PENDÊNCIAS — toda uma com data, agrupadas por mês, ordenadas por prazo
     ======================================================================== */
  const MESES_EXT = ['janeiro','fevereiro','março','abril','maio','junho','julho',
                     'agosto','setembro','outubro','novembro','dezembro'];
  let pendSoFalta = false;

  const dataDe = (c) => E.dataChecklist(c.id) || c.dataAlvo;

  function pintarPendencias() {
    const hoje = hojeISO();
    const total = R.checklist.length;
    const feitos = R.checklist.filter((c) => E.checkFeito(c.id)).length;
    // `< hoje` deixava invisivel exatamente o que mais importa: a tarefa que
    // vence HOJE, com hora marcada. Ela so acendia amanha, quando ja nao serve.
    const atrasadas = R.checklist.filter(
      (c) => !E.checkFeito(c.id) && dataDe(c) <= hoje).length;
    const vencemHoje = R.checklist.filter(
      (c) => !E.checkFeito(c.id) && dataDe(c) === hoje).length;

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
    itens.sort(function (a, b) {
      const fa = E.checkFeito(a.id) ? 1 : 0, fb = E.checkFeito(b.id) ? 1 : 0;
      if (fa !== fb) return fa - fb;               // feitas por último
      return dataDe(a).localeCompare(dataDe(b));   // resto por prazo
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
      const mes = E.checkFeito(c.id) ? 'feitas' : d.slice(0, 7);
      if (mes !== mesAtual) {
        mesAtual = mes;
        alvo.appendChild(el('div', 'pend-mes', mes === 'feitas'
          ? 'Concluídas'
          : MESES_EXT[(+d.split('-')[1]) - 1] + ' de ' + d.split('-')[0]));
      }
      alvo.appendChild(cartaoPendencia(c, hoje));
    });
  }

  function cartaoPendencia(c, hoje) {
    const feito = E.checkFeito(c.id);
    const data = dataDe(c);
    const faltam = diasEntre(hoje, data);
    const atrasada = !feito && faltam < 0;
    const editada = !!E.dataChecklist(c.id);

    const cx = el('div', 'pend' + (feito ? ' feita' : '') +
      (atrasada ? ' atrasada' : '') + (!feito && faltam === 0 ? ' hoje' : ''));

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
    const quando = el('div', 'pend-quando');
    quando.appendChild(document.createTextNode(
      ddmmP(data) + (c.hora ? ' · ' + c.hora + ' ' + (c.fuso || '') : '')));
    if (!feito) {
      quando.appendChild(document.createTextNode(
        faltam > 0 ? ' · em ' + faltam + (faltam === 1 ? ' dia' : ' dias')
        : faltam === 0 ? ' · HOJE'
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
    if (c.dataEstimada && !editada) selos.appendChild(el('span', 'selo selo-estimada', 'data estimada'));
    if (editada) selos.appendChild(el('span', 'selo selo-tipo', 'data ajustada'));
    (c.restauranteIds || []).forEach(function (rid) {
      const r = R.restaurantes.find((x) => x.id === rid);
      if (r) selos.appendChild(el('span', 'selo selo-tipo', r.nome));
    });
    if (selos.children.length) corpo.appendChild(selos);

    // a data é editável: estimativa minha não vira lei
    const inp = el('input', 'pend-data-edit');
    inp.type = 'date';
    inp.value = data;
    inp.setAttribute('aria-label', 'Ajustar a data de: ' + c.texto);
    inp.addEventListener('change', function () {
      E.definirDataChecklist(c.id, inp.value === c.dataAlvo ? null : inp.value);
      pintarPendencias();
    });
    corpo.appendChild(inp);

    cx.appendChild(corpo);
    return cx;
  }

  /* ===== ligação dos controles próprios ===== */
  document.addEventListener('DOMContentLoaded', function () {
    const chk = $('#chk-pend-falta');
    if (chk) chk.addEventListener('change', function (e) {
      pendSoFalta = e.target.checked;
      pintarPendencias();
    });
  });

  return {
    pintarFicha: pintarFicha, pintarFechamento: pintarFechamento,
    pintarRestaurantes: pintarRestaurantes,
    pintarPendencias: pintarPendencias,
  };
})();
