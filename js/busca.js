/* =============================================================================
   Orlando 2026 — busca global
   Índice montado uma vez no load. Num roteiro de 220 blocos, responde
   "em que dia mesmo é o Hagrid's?" em dois toques.
   ========================================================================== */

window.Busca = (function () {
  'use strict';

  const R = window.ROTEIRO;
  const $ = (s) => document.querySelector(s);
  const el = (t, c, x) => {
    const n = document.createElement(t);
    if (c) n.className = c;
    if (x != null) n.textContent = x;
    return n;
  };
  function svg(d) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    String(d).split('|').forEach(function (p) {
      const n = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      n.setAttribute('d', p); s.appendChild(n);
    });
    return s;
  }

  // sem acento e sem caixa: "sanaa" acha "Sanaa", "hagrid" acha "Hagrid's"
  const normal = (s) => String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  const ICO = {
    bloco: 'M4 6h16M4 12h16M4 18h10',
    restaurante: 'M4 3v7a2.5 2.5 0 0 0 5 0V3|M6.5 11v10|M17 3c-1.4 0-2.5 2-2.5 4.5S15.6 12 17 12v9',
    local: 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z|M12 8a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z',
    dica: 'M12 3a6 6 0 0 1 4 10.5V17H8v-3.5A6 6 0 0 1 12 3z|M9.5 20h5',
    pendencia: 'M9 11l2.5 2.5L16 9|M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z',
    lista: 'M8 6h13M8 12h13M8 18h13|M3 6h.01M3 12h.01M3 18h.01',
    naoperca: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9z',
    preparar: 'M12 3a9 9 0 1 0 9 9|M12 7v5l3 2',
    plano: 'M9 3v15l-6 3V6zM9 18l6 3M15 21V6l6-3v15z',
    contato: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  };
  const GRUPO = {
    bloco: 'No roteiro', restaurante: 'Restaurantes',
    local: 'Locais', dica: 'Dicas', pendencia: 'Pendências',
    lista: 'Listas de compras', naoperca: 'O que não perder',
    preparar: 'Deixar pronto na véspera', plano: 'Planos B e C',
    contato: 'Telefones',
  };

  /* ---- índice ---------------------------------------------------------- */
  let indice = [];

  function montarIndice() {
    indice = [];
    const MESD = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    const ddmm = (iso) => { const p = iso.split('-'); return (+p[2]) + '/' + p[1]; };

    R.dias.forEach(function (dia) {
      dia.blocos.forEach(function (b) {
        indice.push({
          tipo: 'bloco', nome: b.titulo,
          onde: ddmm(dia.data) + ' · ' + dia.titulo +
                (b.areaParque ? ' · ' + b.areaParque : '') + ' · ' + b.hora,
          busca: normal([b.titulo, b.descricao, b.contexto, b.areaParque,
                         dia.titulo, b.nota].join(' ')),
          diaId: dia.id,
        });
      });
    });
    // Dentro do Walmart, com o carrinho na mao, a busca e o gesto natural — e
    // "adaptador" nao devolvia nada, porque so blocos eram indexados.
    R.dias.forEach(function (dia) {
      (dia.listas || []).forEach(function (l) {
        (l.itens || []).forEach(function (it) {
          indice.push({
            tipo: 'lista', nome: it.texto,
            onde: ddmm(dia.data) + ' · ' + l.titulo.split('—')[0].trim(),
            busca: normal([it.texto, it.marca, it.alternativaBarata, it.secao, it.motivo,
                           l.titulo].join(' ')),
            diaId: dia.id,
          });
        });
      });
      (dia.naoPerca || []).forEach(function (p) {
        indice.push({
          tipo: 'naoperca', nome: p.nome,
          onde: ddmm(dia.data) + ' · ' + dia.titulo + ' · o que não perder',
          busca: normal([p.nome, p.motivo, p.custo, p.condicao].join(' ')),
          diaId: dia.id,
        });
      });
      const pa = dia.prepararAmanha;
      if (pa) {
        (pa.itens || []).forEach(function (it) {
          indice.push({
            tipo: 'preparar', nome: it.texto,
            onde: ddmm(dia.data) + ' · deixar pronto para amanhã',
            busca: normal([it.texto, it.motivo, pa.titulo].join(' ')),
            diaId: dia.id,
          });
        });
      }
      (dia.planos || []).forEach(function (p) {
        indice.push({
          tipo: 'plano', nome: 'Plano ' + p.letra + ' — ' + p.titulo,
          onde: ddmm(dia.data) + ' · ' + dia.titulo,
          busca: normal([p.titulo, p.gatilho, (p.passos || []).join(' ')].join(' ')),
          diaId: dia.id,
        });
      });
    });

    R.restaurantes.forEach(function (r) {
      indice.push({
        tipo: 'restaurante', nome: r.nome,
        onde: ddmm(r.data) + (r.hora ? ' · ' + r.hora : '') +
              (r.local ? ' · ' + r.local : ''),
        busca: normal([r.nome, r.local, r.nota, (r.alternativas || []).join(' ')].join(' ')),
        tela: 'comer',
      });
    });
    R.locais.forEach(function (l) {
      indice.push({
        tipo: 'local', nome: l.nome,
        onde: (l.endereco || l.tipo) +
              (l.doHotel && l.doHotel.tempoMin != null
                ? ' · ' + l.doHotel.tempoMin + ' min do hotel' : ''),
        busca: normal([l.nome, l.endereco, l.tipo, l.nota].join(' ')),
        tela: 'guia',
      });
    });
    R.dicas.forEach(function (d) {
      indice.push({
        tipo: 'dica', nome: d.titulo, onde: 'Guia · dicas',
        busca: normal([d.titulo, d.corpo].join(' ')), tela: 'guia',
      });
    });
    // "gelada" e "urgent care" nao achavam nada: regras de ouro e telefones ficavam fora.
    R.regrasDeOuro.forEach(function (r) {
      indice.push({
        tipo: 'dica', nome: 'Regra ' + r.n + ' — ' + r.titulo, onde: 'Guia · regras de ouro',
        busca: normal([r.titulo, r.texto].join(' ')), tela: 'guia',
      });
    });
    (R.contatos || []).forEach(function (c) {
      indice.push({
        tipo: 'contato', nome: c.nome,
        onde: 'Guia · telefones' + (c.numero ? ' · ' + c.numero : ''),
        busca: normal([c.nome, c.numero, c.quando].join(' ')), tela: 'guia',
      });
    });
    R.checklist.forEach(function (c) {
      indice.push({
        tipo: 'pendencia', nome: c.texto,
        onde: c.dataAlvo ? ddmm(c.dataAlvo) + (c.dataEstimada ? ' · estimada' : '') : 'sem data',
        busca: normal([c.texto, c.nota, c.motivoData].join(' ')),
        tela: 'pendencias',
      });
    });
  }

  /* ---- consulta -------------------------------------------------------- */
  function consultar(q) {
    const termos = normal(q).split(/\s+/).filter(Boolean);
    if (!termos.length) return [];
    return indice
      .map(function (it) {
        if (!termos.every((t) => it.busca.indexOf(t) >= 0)) return null;
        // título batendo vale mais que corpo batendo
        const nomeN = normal(it.nome);
        let peso = 0;
        termos.forEach(function (t) {
          if (nomeN.indexOf(t) === 0) peso += 3;
          else if (nomeN.indexOf(t) >= 0) peso += 2;
          else peso += 1;
        });
        return { it: it, peso: peso };
      })
      .filter(Boolean)
      .sort((a, b) => b.peso - a.peso)
      .slice(0, 40)
      .map((x) => x.it);
  }

  function realce(texto, q) {
    const frag = document.createDocumentFragment();
    const termos = normal(q).split(/\s+/).filter(Boolean);
    const alvo = normal(texto);
    let corte = -1, tam = 0;
    termos.forEach(function (t) {
      const i = alvo.indexOf(t);
      if (i >= 0 && (corte === -1 || i < corte)) { corte = i; tam = t.length; }
    });
    if (corte < 0) { frag.appendChild(document.createTextNode(texto)); return frag; }
    frag.appendChild(document.createTextNode(texto.slice(0, corte)));
    frag.appendChild(el('mark', null, texto.slice(corte, corte + tam)));
    frag.appendChild(document.createTextNode(texto.slice(corte + tam)));
    return frag;
  }

  /* ---- interface ------------------------------------------------------- */
  function pintar(q) {
    const alvo = $('#busca-corpo');
    alvo.innerHTML = '';
    if (!q.trim()) {
      const v = el('div', 'vazio-lista');
      v.appendChild(svg(ICO.local));
      v.appendChild(el('p', null,
        'Busca em ' + indice.length + ' itens: atrações, listas de compras, o que ' +
        'deixar pronto, restaurantes, locais, dicas, regras de ouro, telefones e pendências.'));
      alvo.appendChild(v);
      return;
    }

    const achados = consultar(q);
    if (!achados.length) {
      const v = el('div', 'vazio-lista');
      v.appendChild(svg('M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14z|M20 20l-4-4'));
      v.appendChild(el('p', null, 'Nada encontrado para "' + q + '".'));
      alvo.appendChild(v);
      return;
    }

    const porTipo = {};
    achados.forEach(function (a) { (porTipo[a.tipo] = porTipo[a.tipo] || []).push(a); });

    ['bloco', 'lista', 'preparar', 'naoperca', 'plano',
     'restaurante', 'local', 'dica', 'contato', 'pendencia'].forEach(function (tipo) {
      const lista = porTipo[tipo];
      if (!lista) return;
      alvo.appendChild(el('div', 'busca-grupo', GRUPO[tipo] + ' · ' + lista.length));
      lista.forEach(function (it) {
        const b = el('button', 'busca-item');
        b.appendChild(svg(ICO[tipo]));
        const t = el('div', 'busca-txt');
        const n = el('div', 'busca-nome');
        n.appendChild(realce(it.nome, q));
        t.appendChild(n);
        t.appendChild(el('div', 'busca-onde', it.onde));
        b.appendChild(t);
        b.addEventListener('click', function () {
          fechar();
          if (it.diaId) window.AppNav.irParaDia(window.AppNav.acharDia(it.diaId));
          else if (it.tela) window.AppNav.mostrarTela(it.tela);
        });
        alvo.appendChild(b);
      });
    });
  }

  function abrir() {
    $('#tela-busca').classList.remove('oculto');
    const c = $('#busca-campo');
    c.value = ''; pintar('');
    setTimeout(function () { c.focus(); }, 50);
  }
  function fechar() { $('#tela-busca').classList.add('oculto'); }

  function ligar() {
    montarIndice();
    let t = null;
    $('#busca-campo').addEventListener('input', function (e) {
      clearTimeout(t);
      const v = e.target.value;
      t = setTimeout(function () { pintar(v); }, 120);
    });
    $('#btn-busca-fechar').addEventListener('click', fechar);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('#tela-busca').classList.contains('oculto')) fechar();
    });
  }

  return { ligar: ligar, abrir: abrir, fechar: fechar, normal: normal,
           consultar: consultar, tamanhoIndice: () => indice.length };
})();
