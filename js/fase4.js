/* =============================================================================
   Orlando 2026 — Fase 4
   Guia: dicas de campo + locais com deep link para o Google Maps.
   Nenhum mapa embutido: mapa embutido exige rede e morreria dentro do parque.
   ========================================================================== */

window.Fase4 = (function () {
  'use strict';

  const R = window.ROTEIRO;
  const $ = (s) => document.querySelector(s);

  const el = (tag, cls, texto) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texto != null) n.textContent = texto;
    return n;
  };
  function svg(d) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    s.appendChild(p);
    return s;
  }

  const P = {
    pin:    'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11zM12 8a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z',
    parque: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9z',
    hotel:  'M3 21h18M5 21V8l7-5 7 5v13M10 21v-6h4v6',
    compras:'M6 8h12l-1 12H7zM9 8V6a3 3 0 0 1 6 0v2',
    comida: 'M4 3v8a3 3 0 0 0 6 0V3M7 11v10M17 3c-1.7 0-3 2.2-3 5s1.3 4 3 4v9',
    carro:  'M5 17h14M6 17v2M18 17v2M4 13l1.5-5h13L20 13v4H4zM7 13h.01M17 13h.01',
    livre:  'M12 3v18M5 8l7-5 7 5',
    evento: 'M4 5h16v14H4zM4 9h16M9 3v4M15 3v4',
  };
  const ICONE_TIPO = {
    hotel: P.hotel, parque: P.parque, compras: P.compras, restaurante: P.comida,
    transporte: P.carro, livre: P.livre, atracao: P.parque, evento: P.evento,
  };

  // Deep link. Sem mapa embutido.
  function urlMaps(local) {
    if (local.lat != null && local.lng != null) {
      return 'https://maps.google.com/?q=' + local.lat + ',' + local.lng;
    }
    return 'https://maps.google.com/?q=' + encodeURIComponent(local.nome + ', Orlando FL');
  }
  // Rota a partir do hotel, que é a pergunta real de todo dia.
  function urlRota(local, base) {
    if (!base || base.lat == null) return urlMaps(local);
    return 'https://www.google.com/maps/dir/?api=1' +
      '&origin=' + base.lat + ',' + base.lng +
      '&destination=' + local.lat + ',' + local.lng;
  }

  const tempoTexto = (min) => min == null ? '—'
    : min < 60 ? min + ' min'
    : Math.floor(min / 60) + 'h' + (min % 60 ? String(min % 60).padStart(2, '0') : '');

  /* ===========================================================================
     DICAS
     ======================================================================== */
  function pintarDicas() {
    const alvo = $('#lista-dicas');
    alvo.innerHTML = '';
    R.dicas.forEach(function (d) {
      const det = el('details', 'acordeao dica');
      det.appendChild(el('summary', null, d.titulo));
      const c = el('div', 'acordeao-corpo');
      c.appendChild(el('div', 'dica-corpo', d.corpo));
      if (d.pesquisa) {
        c.appendChild(el('div', 'dica-fonte',
          'Verificado na web em ' + d.pesquisa.split('-').reverse().join('/') +
          '. Não estava no documento original.'));
      }
      det.appendChild(c);
      alvo.appendChild(det);
    });
  }

  /* ===========================================================================
     LOCAIS
     ======================================================================== */
  const FILTROS = [
    { id: 'todos',      rotulo: 'Todos' },
    { id: 'parque',     rotulo: 'Parques' },
    { id: 'compras',    rotulo: 'Compras' },
    { id: 'livre',      rotulo: 'Passeios' },
    { id: 'restaurante',rotulo: 'Restaurantes' },
    { id: 'transporte', rotulo: 'Transporte' },
  ];
  let filtroAtivo = 'todos';

  function pintarLocais() {
    const base = R.locais.find((l) => l.id === R.viagem.baseLocalId) || null;
    const naoVerif = R.locais.filter((l) => !l.verificado).length;

    const av = $('#aviso-coords');
    av.textContent =
      naoVerif + ' dos ' + R.locais.length + ' locais têm coordenada aproximada, não ' +
      'confirmada. Vieram de conhecimento público, não do roteiro. Confiram os pinos ' +
      'antes de depender deles — principalmente o do hotel, de onde saem todos os tempos.';

    /* filtros */
    const fx = $('#filtros-local');
    fx.innerHTML = '';
    FILTROS.forEach(function (f) {
      const conta = f.id === 'todos' ? R.locais.length
        : R.locais.filter((l) => l.tipo === f.id).length;
      if (!conta) return;
      const b = el('button', 'filtro', f.rotulo + ' · ' + conta);
      b.setAttribute('aria-pressed', filtroAtivo === f.id ? 'true' : 'false');
      b.addEventListener('click', function () { filtroAtivo = f.id; pintarLocais(); });
      fx.appendChild(b);
    });

    /* lista, ordenada por tempo do hotel */
    const alvo = $('#lista-locais');
    alvo.innerHTML = '';
    R.locais
      .filter((l) => filtroAtivo === 'todos' || l.tipo === filtroAtivo)
      .slice()
      .sort(function (a, b) {
        if (a.id === R.viagem.baseLocalId) return -1;
        if (b.id === R.viagem.baseLocalId) return 1;
        const ta = a.doHotel && a.doHotel.tempoMin != null ? a.doHotel.tempoMin : 9999;
        const tb = b.doHotel && b.doHotel.tempoMin != null ? b.doHotel.tempoMin : 9999;
        return ta - tb;
      })
      .forEach((l) => alvo.appendChild(cartaoLocal(l, base)));
  }

  function cartaoLocal(l, base) {
    const ehBase = l.id === R.viagem.baseLocalId;
    const cx = el('div', 'local t-' + l.tipo);

    const topo = el('div', 'local-topo');
    const ico = el('div', 'local-icone');
    ico.appendChild(svg(ICONE_TIPO[l.tipo] || P.pin));
    topo.appendChild(ico);

    const nome = el('div');
    nome.appendChild(el('div', 'local-nome', l.nome));
    if (l.endereco) nome.appendChild(el('div', 'local-end', l.endereco));
    if (ehBase) nome.appendChild(el('div', 'local-end', 'A base da viagem'));
    topo.appendChild(nome);

    if (!l.verificado) topo.appendChild(el('span', 'selo-verificar', 'verificar'));
    cx.appendChild(topo);

    /* métricas do hotel */
    if (l.doHotel && !ehBase) {
      const m = el('div', 'local-metricas');

      const t = el('div', 'metrica');
      t.appendChild(el('div', 'metrica-rot', 'do hotel'));
      t.appendChild(el('div', 'metrica-val', tempoTexto(l.doHotel.tempoMin)));
      t.appendChild(el('div', 'metrica-fonte ' +
        (l.doHotel.tempoFonte === 'documento' ? 'doc' : 'est'),
        l.doHotel.tempoFonte === 'documento' ? 'do roteiro' : 'estimado'));
      m.appendChild(t);

      const u = el('div', 'metrica');
      u.appendChild(el('div', 'metrica-rot', 'uber'));
      if (l.doHotel.uberUSD) {
        u.appendChild(el('div', 'metrica-val',
          'US$ ' + l.doHotel.uberUSD.min + '–' + l.doHotel.uberUSD.max));
        u.appendChild(el('div', 'metrica-fonte ' +
          (l.doHotel.uberFonte === 'documento' ? 'doc' : 'est'),
          l.doHotel.uberFonte === 'documento' ? 'do roteiro' : 'estimado'));
      } else {
        u.appendChild(el('div', 'metrica-val', 'de carro'));
        u.appendChild(el('div', 'metrica-fonte est', 'Uber não compensa'));
      }
      m.appendChild(u);
      cx.appendChild(m);
    }

    if (l.nota) cx.appendChild(el('div', 'local-nota', l.nota));

    /* ações */
    const acoes = el('div', 'local-acoes');
    const abrir = el('a', 'btn-rota');
    abrir.href = urlMaps(l);
    abrir.target = '_blank'; abrir.rel = 'noopener';
    abrir.appendChild(svg(P.pin));
    abrir.appendChild(document.createTextNode('Abrir no Maps'));
    acoes.appendChild(abrir);

    if (!ehBase && base) {
      const rota = el('a', 'btn-rota secundario');
      rota.href = urlRota(l, base);
      rota.target = '_blank'; rota.rel = 'noopener';
      rota.appendChild(svg(P.carro));
      rota.appendChild(document.createTextNode('Rota do hotel'));
      acoes.appendChild(rota);
    }
    cx.appendChild(acoes);
    return cx;
  }

  function pintarGuia() { pintarDicas(); pintarLocais(); }

  return { pintarGuia: pintarGuia };
})();
