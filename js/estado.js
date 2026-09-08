/* =============================================================================
   ESTADO DO USUÁRIO
   -----------------------------------------------------------------------------
   Local-first: tudo é escrito primeiro aqui, síncrono, sem depender de rede.
   Cada folha carrega `em` (timestamp ISO) — é isso que vai permitir o merge por
   campo quando o sync com o Supabase entrar na Fase 5. Nada aqui muda depois.
   ========================================================================== */

window.Estado = (function () {
  'use strict';

  const CHAVE = 'orlando2026:estado';
  const VERSAO = 1;

  const vazio = () => ({
    versao: VERSAO,
    dispositivo: null,
    atualizadoEm: null,
    referencias: {},  // diaId  -> { hora, em }
    ancoras:     {},  // blocoId-> { ancora, em }
    feitos:      {},  // blocoId-> { feito, em }
    reservas:    {},  // restId -> { status, confirmacao, em }
    checklist:   {},  // ckId   -> { feito, em }
    notas:       {},  // diaId  -> { texto, em }
    datasCheck:  {},  // ckId   -> { data, em }
    coordsLocal: {},  // localId-> { lat, lng, em }
  });

  let dados = vazio();

  function carregar() {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) {
        const lido = JSON.parse(bruto);
        dados = Object.assign(vazio(), lido);
      }
    } catch (e) {
      console.warn('[estado] não consegui ler o localStorage:', e.message);
      dados = vazio();
    }
    if (!dados.dispositivo) {
      dados.dispositivo = 'disp-' + Math.random().toString(36).slice(2, 8);
    }
    return dados;
  }

  let pendente = null;
  function salvar() {
    dados.atualizadoEm = new Date().toISOString();
    // Agrupa gravações num mesmo tick — marcar 5 blocos seguidos não escreve 5 vezes.
    if (pendente) return;
    pendente = setTimeout(function () {
      pendente = null;
      try {
        localStorage.setItem(CHAVE, JSON.stringify(dados));
      } catch (e) {
        console.warn('[estado] não consegui gravar:', e.message);
      }
    }, 0);
  }

  const agora = () => new Date().toISOString();

  /* ---- leitura ---- */
  const feito       = (id) => !!(dados.feitos[id] && dados.feitos[id].feito);
  const referencia  = (id) => (dados.referencias[id] ? dados.referencias[id].hora : null);
  const ancora      = (id) => (dados.ancoras[id] ? dados.ancoras[id].ancora : null);
  const nota        = (id) => (dados.notas[id] ? dados.notas[id].texto : '');
  const reserva     = (id) => dados.reservas[id] || null;
  const checkFeito  = (id) => !!(dados.checklist[id] && dados.checklist[id].feito);
  const dataChecklist = (id) => (dados.datasCheck[id] ? dados.datasCheck[id].data : null);
  const coordLocal  = (id) => dados.coordsLocal[id] || null;

  /* ---- escrita ---- */
  function marcarFeito(id, valor) {
    dados.feitos[id] = { feito: !!valor, em: agora() };
    salvar();
  }
  function definirReferencia(diaId, hora) {
    if (hora) dados.referencias[diaId] = { hora: hora, em: agora() };
    else delete dados.referencias[diaId];
    salvar();
  }
  function definirAncora(blocoId, valor) {
    if (valor) dados.ancoras[blocoId] = { ancora: valor, em: agora() };
    else delete dados.ancoras[blocoId];
    salvar();
  }
  function definirNota(diaId, texto) {
    if (texto && texto.trim()) dados.notas[diaId] = { texto: texto, em: agora() };
    else delete dados.notas[diaId];
    salvar();
  }
  function definirReserva(restId, campos) {
    dados.reservas[restId] = Object.assign({}, dados.reservas[restId], campos, { em: agora() });
    salvar();
  }
  function marcarChecklist(id, valor) {
    dados.checklist[id] = { feito: !!valor, em: agora() };
    salvar();
  }

  function definirDataChecklist(id, data) {
    if (data) dados.datasCheck[id] = { data: data, em: agora() };
    else delete dados.datasCheck[id];
    salvar();
  }
  function definirCoordLocal(id, lat, lng) {
    if (lat != null && lng != null) {
      dados.coordsLocal[id] = { lat: lat, lng: lng, em: agora() };
    } else { delete dados.coordsLocal[id]; }
    salvar();
  }

  /* ---- exportar / importar (a base do sync manual e do automático depois) ---- */
  function exportar() {
    return JSON.stringify(dados, null, 2);
  }

  // Merge por campo, vencendo o timestamp mais recente. É isto que evita que o
  // import de um celular apague o trabalho feito no outro.
  function importar(texto, modo) {
    const entrando = JSON.parse(texto);
    if (modo === 'substituir') {
      dados = Object.assign(vazio(), entrando);
      salvar();
      return { modo: 'substituir', aplicados: -1 };
    }
    let aplicados = 0, ignorados = 0;
    ['referencias', 'ancoras', 'feitos', 'reservas', 'checklist', 'notas',
     'datasCheck', 'coordsLocal'].forEach(function (grupo) {
      const origem = entrando[grupo] || {};
      Object.keys(origem).forEach(function (id) {
        const novo = origem[id], atual = dados[grupo][id];
        if (!atual || !atual.em || (novo.em && novo.em > atual.em)) {
          dados[grupo][id] = novo; aplicados++;
        } else { ignorados++; }
      });
    });
    salvar();
    return { modo: 'mesclar', aplicados: aplicados, ignorados: ignorados };
  }

  function limpar() { dados = vazio(); salvar(); }

  carregar();

  return {
    feito: feito, marcarFeito: marcarFeito,
    referencia: referencia, definirReferencia: definirReferencia,
    ancora: ancora, definirAncora: definirAncora,
    nota: nota, definirNota: definirNota,
    reserva: reserva, definirReserva: definirReserva,
    checkFeito: checkFeito, marcarChecklist: marcarChecklist,
    dataChecklist: dataChecklist, definirDataChecklist: definirDataChecklist,
    coordLocal: coordLocal, definirCoordLocal: definirCoordLocal,
    exportar: exportar, importar: importar, limpar: limpar,
    bruto: function () { return dados; },
  };
})();
