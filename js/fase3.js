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

  const el = (tag, cls, texto) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texto != null) n.textContent = texto;
    return n;
  };

  /* ===========================================================================
     FICHA DO PARQUE — renderizada dentro da tela do dia
     ======================================================================== */
  function pintarFicha(dia) {
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
    return (s && s.status) || (r.precisaReserva ? 'a-reservar' : null);
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
        inp.value = (E.reserva(r.id) || {}).confirmacao || '';
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
     PENDÊNCIAS
     ======================================================================== */
  const GRUPOS = {
    'prazo-curto':  'Prazo curto — setembro',
    'prazo-medio':  'Prazo médio — outubro',
    'ja-em-orlando':'Já em Orlando',
  };
  let pendSoFalta = false;

  function ordenar(a, b) {
    if (a.dataAlvo && b.dataAlvo) return a.dataAlvo.localeCompare(b.dataAlvo);
    if (a.dataAlvo) return -1;
    if (b.dataAlvo) return 1;
    return 0;
  }

  function pintarPendencias() {
    const hoje = hojeISO();
    const total = R.checklist.length;
    const feitos = R.checklist.filter((c) => E.checkFeito(c.id)).length;
    const atrasadas = R.checklist.filter(
      (c) => !E.checkFeito(c.id) && c.dataAlvo && c.dataAlvo < hoje).length;

    $('#pend-fill').style.width = (total ? (feitos / total) * 100 : 0) + '%';
    $('#pend-texto').textContent = feitos + ' de ' + total + ' feitas';
    $('#pend-sub').textContent = atrasadas
      ? atrasadas + ' em atraso · ' + (total - feitos) + ' abertas no total'
      : (total - feitos) + ' abertas';

    const badge = $('#badge-pend');
    if (atrasadas > 0) { badge.textContent = atrasadas; badge.classList.remove('oculto'); }
    else badge.classList.add('oculto');

    const alvo = $('#lista-pendencias');
    alvo.innerHTML = '';

    Object.keys(GRUPOS).forEach(function (g) {
      let itens = R.checklist.filter((c) => c.grupo === g).sort(ordenar);
      if (pendSoFalta) itens = itens.filter((c) => !E.checkFeito(c.id));
      if (!itens.length) return;
      alvo.appendChild(el('div', 'pend-grupo', GRUPOS[g]));
      itens.forEach((c) => alvo.appendChild(cartaoPendencia(c, hoje)));
    });

    if (!alvo.children.length)
      alvo.appendChild(el('div', 'vazio-lista', 'Nada pendente. 🎉'));
  }

  function cartaoPendencia(c, hoje) {
    const feito = E.checkFeito(c.id);
    const faltam = c.dataAlvo ? diasEntre(hoje, c.dataAlvo) : null;
    const atrasada = !feito && faltam !== null && faltam < 0;

    const cx = el('div', 'pend' +
      (feito ? ' feita' : '') + (atrasada ? ' atrasada' : '') +
      (!feito && faltam === 0 ? ' hoje' : ''));

    const chk = el('button', 'bl-check');
    chk.setAttribute('aria-pressed', feito ? 'true' : 'false');
    chk.setAttribute('aria-label', 'Concluir: ' + c.texto);
    chk.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 12l6 6L20 6"/></svg>';
    chk.addEventListener('click', function () {
      E.marcarChecklist(c.id, !E.checkFeito(c.id));
      pintarPendencias();
    });
    cx.appendChild(chk);

    const corpo = el('div', 'pend-corpo');
    if (c.dataAlvo) {
      corpo.appendChild(el('div', 'pend-quando',
        ddmm(c.dataAlvo) + (c.hora ? ' · ' + c.hora + ' ' + (c.fuso || '') : '') +
        (feito ? '' :
          faltam > 0 ? '  ·  em ' + faltam + ' dia' + (faltam > 1 ? 's' : '')
          : faltam === 0 ? '  ·  HOJE'
          : '  ·  ATRASADA ' + (-faltam) + ' dia' + (faltam < -1 ? 's' : ''))));
    } else {
      corpo.appendChild(el('div', 'pend-quando', 'sem data definida'));
    }
    corpo.appendChild(el('div', 'pend-texto', c.texto));
    if (c.nota) corpo.appendChild(el('div', 'pend-nota', c.nota));

    const selos = el('div', 'pend-selos');
    if (c.janelaReserva) {
      const s = el('span', 'selo selo-reserva', 'janela de reserva'); selos.appendChild(s);
    }
    if (c.critico) {
      const s = el('span', 'selo selo-critico', 'crítico'); selos.appendChild(s);
    }
    (c.restauranteIds || []).forEach(function (rid) {
      const r = R.restaurantes.find((x) => x.id === rid);
      if (r) selos.appendChild(el('span', 'selo selo-tipo', r.nome));
    });
    if (selos.children.length) corpo.appendChild(selos);

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
    pintarFicha: pintarFicha,
    pintarRestaurantes: pintarRestaurantes,
    pintarPendencias: pintarPendencias,
  };
})();
