/* =============================================================================
   Orlando 2026 — Fase 4
   Guia: dicas de campo + locais com deep link para o Google Maps.
   Nenhum mapa embutido: mapa embutido exige rede e morreria dentro do parque.
   ========================================================================== */

window.Fase4 = (function () {
  'use strict';

  const R = window.ROTEIRO;
  const $ = (s) => document.querySelector(s);
  // Mesma normalizacao da lupa global: "farmacia" acha "Farmácia".
  const normal = (s) => window.Busca.normal(s);

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
    fone:   'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
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
  const E = window.Estado;
  // coordenada colada pelo usuário vence a do arquivo
  function coordDe(l) {
    const c = E.coordLocal(l.id);
    return c ? { lat: c.lat, lng: c.lng, colada: true }
             : { lat: l.lat, lng: l.lng, colada: false };
  }
  function urlMaps(local) {
    const c = coordDe(local);
    if (c.lat != null && c.lng != null) {
      return 'https://maps.google.com/?q=' + c.lat + ',' + c.lng;
    }
    return 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(local.nome + ', Orlando FL');
  }
  // Rota a partir do hotel, que é a pergunta real de todo dia.
  function urlRota(local, base) {
    const b = coordDe(base), l = coordDe(local);
    if (b.lat == null || l.lat == null) return urlMaps(local);
    return 'https://www.google.com/maps/dir/?api=1&travelmode=driving' +
      '&origin=' + b.lat + ',' + b.lng +
      '&destination=' + l.lat + ',' + l.lng;
  }

  const tempoTexto = (min) => min == null ? '—'
    : min < 60 ? min + ' min'
    : Math.floor(min / 60) + 'h' + (min % 60 ? String(min % 60).padStart(2, '0') : '');

  /* ===========================================================================
     GUIA COMO ÍNDICE
     Quatro seções pelo momento em que se lê, não pelo assunto. A dica de dia
     específico aparece aqui E na tela do dia dela — é o mesmo objeto de R.dicas.
     ======================================================================== */
  const diaCurto = (id) => { const p = id.replace('d-', '').split('-'); return (+p[2]) + '/' + p[1]; };

  function cartaoDica(d) {
    const det = el('details', 'acordeao dica guia-item');
    det.dataset.item = d.id;
    det.appendChild(el('summary', null, d.titulo));
    const c = el('div', 'acordeao-corpo');
    if ((d.dias || []).length) {
      c.appendChild(el('div', 'dica-dias',
        'Aparece também na tela dos dias ' + d.dias.map(diaCurto).join(', ')));
    }
    c.appendChild(el('div', 'dica-corpo', d.corpo));
    if (d.pesquisa) {
      c.appendChild(el('div', 'dica-fonte',
        'Verificado na web em ' + d.pesquisa.split('-').reverse().join('/') + '.'));
    }
    det.appendChild(c);
    det.dataset.busca = normal([d.titulo, d.corpo].join(' '));
    return det;
  }

  function cartaoRegras() {
    const det = el('details', 'acordeao guia-item');
    det.dataset.item = 'regras';
    det.appendChild(el('summary', null, '⭐  Regras de ouro · ' + R.regrasDeOuro.length));
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
    det.appendChild(c);
    det.dataset.busca = normal(R.regrasDeOuro.map((r) => r.titulo + ' ' + r.texto).join(' '));
    return det;
  }

  function pintarDicas() {
    const antes = $('#guia-antes'), diaAdia = $('#guia-dia'), errado = $('#guia-errado');
    antes.innerHTML = ''; diaAdia.innerHTML = ''; errado.innerHTML = '';
    diaAdia.appendChild(cartaoRegras());

    const destino = {
      'antes-de-viajar': antes, 'todo-dia': diaAdia,
      'dia-especifico': diaAdia, 'emergencia': errado,
    };
    // as de todo dia antes das de dia marcado: é a ordem em que elas servem
    const ordem = { 'antes-de-viajar': 0, 'todo-dia': 1, 'dia-especifico': 2, 'emergencia': 3 };
    R.dicas.slice()
      .sort((a, b) => (ordem[a.momento] || 0) - (ordem[b.momento] || 0))
      .forEach((d) => (destino[d.momento] || diaAdia).appendChild(cartaoDica(d)));

    const pend = el('p', 'guia-nota guia-item',
      'O que ainda precisa ser resolvido no Brasil — reservas, ingressos, documentos — ' +
      'está na aba Pendências, com data.');
    pend.dataset.busca = normal('pendencias reservas ingressos documentos brasil');
    antes.appendChild(pend);
  }

  // Filtro no lugar: esconde o que não bate e a seção que ficar vazia.
  function filtrarGuia(q) {
    const termos = normal(q).split(/\s+/).filter(Boolean);
    const itens = document.querySelectorAll('#tela-guia .guia-item');
    itens.forEach(function (n) {
      const alvo = n.dataset.busca || '';
      n.hidden = termos.length > 0 && !termos.every((t) => alvo.indexOf(t) >= 0);
    });
    document.querySelectorAll('#tela-guia .guia-secao').forEach(function (s) {
      const algum = [].some.call(s.querySelectorAll('.guia-item'), (n) => !n.hidden);
      s.hidden = termos.length > 0 && !algum;
    });
    const algum = [].some.call(itens, (n) => !n.hidden);
    $('#guia-vazio').hidden = !(termos.length && !algum);
  }
  /* ===========================================================================
     LIGAR AGORA
     911, hotel, Urgent Care e seguro, no topo do Guia e em "Quando der errado".
     Os telefones ficavam depois de dez acordeões.
     ======================================================================== */
  function pintarLigar() {
    const E = window.Estado;
    const h = new Date().getHours(), sem = new Date().getDay();
    // A de Celebration fecha às 20h (17h no fim de semana); depois disso vale a de
    // Lake Buena Vista, aberta até a meia-noite.
    const celebration = h >= 8 && h < (sem === 0 || sem === 6 ? 17 : 20);
    const urgent = R.contatos.find((c) => c.id ===
      (celebration ? 'tel-urgentcare-celebration' : 'tel-urgentcare-lbv'));
    const hotel = R.contatos.find((c) => c.id === 'tel-hotel');
    const seguro = E.pessoal('seguro-telefone');
    const botoes = [
      { rotulo: '911', sub: 'emergência', numero: '911', urgente: true },
      hotel && { rotulo: 'Hotel', sub: 'Travelodge', numero: hotel.numero },
      urgent && { rotulo: 'Urgent Care', sub: celebration ? 'Celebration' : 'Lake Buena Vista',
                  numero: urgent.numero },
      { rotulo: 'Seguro', sub: seguro ? 'central' : 'cadastrar', numero: seguro },
    ].filter(Boolean);
    ['#guia-ligar', '#guia-ligar-errado'].forEach(function (sel) {
      const alvo = document.querySelector(sel);
      if (!alvo) return;
      alvo.innerHTML = '';
      botoes.forEach(function (x) {
        let a;
        if (x.numero) {
          a = el('a', 'ligar-btn' + (x.urgente ? ' ligar-911' : ''));
          a.href = 'tel:' + String(x.numero).replace(/[^+0-9]/g, '');
        } else {
          // Sem o telefone da central, o botão leva ao campo onde ele se cadastra.
          a = el('button', 'ligar-btn');
          a.type = 'button';
          a.addEventListener('click', function () {
            const campo = document.getElementById('seguro-telefone');
            if (!campo) return;
            campo.scrollIntoView({ block: 'center' });
            campo.focus({ preventScroll: true });
          });
        }
        a.appendChild(svg(P.fone));
        const t = el('span', 'ligar-txt');
        t.appendChild(el('b', null, x.rotulo));
        t.appendChild(el('small', null, x.sub));
        a.appendChild(t);
        alvo.appendChild(a);
      });
    });
  }

  // O número da apólice e o telefone da central ficam só neste aparelho — e no
  // export para o outro celular. O site é público: nada disto vai para o roteiro.
  function camposSeguro() {
    const E = window.Estado;
    const cx = el('div', 'seguro-campos');
    [['seguro-telefone', 'Telefone da central', 'tel'],
     ['seguro-apolice', 'Número da apólice', 'text']].forEach(function (x) {
      const lab = el('label', 'seguro-rot', x[1]);
      lab.setAttribute('for', x[0]);
      const inp = el('input', 'seguro-campo');
      inp.id = x[0];
      inp.type = x[2];
      inp.autocomplete = 'off';
      inp.placeholder = 'como está no PDF da apólice';
      inp.value = E.pessoal(x[0]) || '';
      let espera = null;
      inp.addEventListener('input', function () {
        clearTimeout(espera);
        espera = setTimeout(function () {
          E.definirPessoal(x[0], inp.value.trim());
          pintarLigar();
        }, 400);
      });
      cx.appendChild(lab);
      cx.appendChild(inp);
    });
    return cx;
  }

  /* ===========================================================================
     TELEFONES
     Link tel: abre o discador do proprio aparelho. Nao e requisicao de rede:
     funciona offline, que e exatamente quando esta tela importa.
     ======================================================================== */
  function pintarContatos() {
    const alvo = $('#lista-contatos');
    alvo.innerHTML = '';
    (R.contatos || []).forEach(function (c) {
      const cartao = el('div', 'contato guia-item' + (c.critico ? ' contato-critico' : ''));
      cartao.dataset.item = c.id;
      cartao.dataset.busca = normal([c.nome, c.numero, c.quando].join(' '));
      const topo = el('div', 'contato-topo');
      topo.appendChild(el('div', 'contato-nome', c.nome));
      if (c.numero) {
        const a = el('a', 'contato-num');
        a.href = 'tel:' + c.numero.replace(/[^+0-9]/g, '');
        a.appendChild(svg(P.fone));
        a.appendChild(document.createTextNode(c.numero));
        topo.appendChild(a);
      } else {
        topo.appendChild(el('span', 'contato-sem', 'no seu bilhete'));
      }
      cartao.appendChild(topo);
      cartao.appendChild(el('div', 'contato-quando', c.quando));
      if (c.id === 'tel-seguro') cartao.appendChild(camposSeguro());
      if (c.verificado) {
        cartao.appendChild(el('div', 'contato-fonte',
          'Conferido em ' + c.verificado.split('-').reverse().join('/') +
          (c.fonte ? ' · ' + c.fonte : '')));
      }
      alvo.appendChild(cartao);
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
    av.className = naoVerif ? 'aviso' : 'aviso bom';
    av.innerHTML = '';
    const verif = R.locais.length - naoVerif;
    av.appendChild(document.createElement('strong')).textContent =
      verif + ' de ' + R.locais.length + ' locais com coordenada conferida';
    av.appendChild(document.createTextNode(
      naoVerif
        ? 'As conferidas vieram da Wikipedia e do OpenStreetMap. Faltam ' + naoVerif +
          ': abra o local e cole a coordenada do Google Maps (segure o dedo no ponto ' +
          'e copie os números).'
        : 'Todas checadas contra Wikipedia e OpenStreetMap.'));

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
    // o chip de tipo repinta os locais; o termo digitado continua valendo
    filtrarGuia($('#guia-filtro').value);
  }

  function cartaoLocal(l, base) {
    const ehBase = l.id === R.viagem.baseLocalId;
    const cx = el('div', 'local guia-item t-' + l.tipo);
    cx.dataset.item = l.id;
    cx.dataset.busca = normal([l.nome, l.endereco, l.tipo, l.nota].join(' '));

    const topo = el('div', 'local-topo');
    const ico = el('div', 'local-icone');
    ico.appendChild(svg(ICONE_TIPO[l.tipo] || P.pin));
    topo.appendChild(ico);

    const nome = el('div');
    nome.appendChild(el('div', 'local-nome', l.nome));
    if (l.endereco) nome.appendChild(el('div', 'local-end', l.endereco));
    if (ehBase) nome.appendChild(el('div', 'local-end', 'A base da viagem'));
    topo.appendChild(nome);

    const co = coordDe(l);
    if (co.colada) topo.appendChild(el('span', 'selo-fonte', 'você conferiu'));
    else if (l.verificado) topo.appendChild(el('span', 'selo-fonte', l.fonteCoord));
    else topo.appendChild(el('span', 'selo-verificar', 'colar coordenada'));
    cx.appendChild(topo);

    if (!l.verificado && !co.colada && l.precisaColar) {
      cx.appendChild(el('div', 'local-nota', l.precisaColar));
    }

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

    if (!l.verificado) {
      const linha = el('div', 'colar-coord');
      const inp = el('input');
      inp.type = 'text';
      inp.placeholder = '28.3390, -81.5010';
      inp.value = co.colada ? co.lat + ', ' + co.lng : '';
      inp.setAttribute('aria-label', 'Colar coordenada de ' + l.nome);
      const btn = el('button', 'btn-secundario', 'Salvar');
      btn.addEventListener('click', function () {
        const m = inp.value.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
        if (!m) { inp.value = ''; inp.placeholder = 'formato: 28.3390, -81.5010'; return; }
        E.definirCoordLocal(l.id, parseFloat(m[1]), parseFloat(m[2]));
        pintarLocais();
      });
      linha.appendChild(inp); linha.appendChild(btn);
      cx.appendChild(linha);
    }

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

  let filtroLigado = false;
  function pintarGuia() {
    pintarDicas(); pintarContatos(); pintarLocais(); pintarLigar();
    if (!filtroLigado) {
      $('#guia-filtro').addEventListener('input', function (e) { filtrarGuia(e.target.value); });
      filtroLigado = true;
    }
    filtrarGuia($('#guia-filtro').value);
  }

  return { pintarGuia: pintarGuia };
})();
