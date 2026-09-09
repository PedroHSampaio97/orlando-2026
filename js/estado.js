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
    horas:       {},  // blocoId-> { hora, em }   hora oficial confirmada na hora
    feitos:      {},  // blocoId-> { feito, em }
    reservas:    {},  // restId -> { status, confirmacao, em }
    checklist:   {},  // ckId   -> { feito, em }
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
  const reserva     = (id) => dados.reservas[id] || null;
  // Um item pode já vir concluído do arquivo de dados (decisão registrada fora do
  // app). O toque do usuário sempre vence esse padrão.
  function padraoChecklist(id) {
    const R = window.ROTEIRO;
    if (!R) return false;
    const c = R.checklist.find((x) => x.id === id);
    return !!(c && c.feitoPadrao);
  }
  const checkFeito = (id) => dados.checklist[id]
    ? !!dados.checklist[id].feito
    : padraoChecklist(id);
  const dataChecklist = (id) => (dados.datasCheck[id] ? dados.datasCheck[id].data : null);
  const coordLocal  = (id) => {
    const c = dados.coordsLocal[id];
    return (c && c.lat != null) ? c : null;   // lápide devolve ausência
  };

  /* ---- escrita ---- */
  function marcarFeito(id, valor) {
    dados.feitos[id] = { feito: !!valor, em: agora() };
    salvar();
  }
  function definirReferencia(diaId, hora) {
    if (hora) dados.referencias[diaId] = { hora: hora, em: agora() };
    else dados.referencias[diaId] = { hora: null, em: agora() };
    salvar();
  }
  const horaBloco = (id) => (dados.horas[id] ? dados.horas[id].hora : null);
  function definirHoraBloco(blocoId, hora) {
    if (hora) dados.horas[blocoId] = { hora: hora, em: agora() };
    else dados.horas[blocoId] = { hora: null, em: agora() };
    salvar();
  }
  function definirAncora(blocoId, valor) {
    if (valor) dados.ancoras[blocoId] = { ancora: valor, em: agora() };
    else dados.ancoras[blocoId] = { ancora: null, em: agora() };
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
    else dados.datasCheck[id] = { data: null, em: agora() };
    salvar();
  }
  function definirCoordLocal(id, lat, lng) {
    if (lat != null && lng != null) {
      dados.coordsLocal[id] = { lat: lat, lng: lng, em: agora() };
    } else { dados.coordsLocal[id] = { lat: null, lng: null, em: agora() }; }
    salvar();
  }

  /* ---- exportar / importar (a base do sync manual e do automático depois) ---- */
  const CHAVE_EXPORT = 'orlando2026:ultimo-export';
  function exportar() {
    // Marca a hora para a Home poder cobrar. E preferencia local do aparelho,
    // nao estado sincronizado: nao entra no JSON.
    try { localStorage.setItem(CHAVE_EXPORT, agora()); } catch (e) {}
    return JSON.stringify(dados, null, 2);
  }
  function ultimoExport() {
    try { return localStorage.getItem(CHAVE_EXPORT); } catch (e) { return null; }
  }

  // Merge por campo, vencendo o timestamp mais recente. É isto que evita que o
  // import de um celular apague o trabalho feito no outro.
  const GRUPOS = ['referencias', 'ancoras', 'horas', 'feitos', 'reservas',
                  'checklist', 'datasCheck', 'coordsLocal'];

  function importar(texto, modo) {
    const entrando = JSON.parse(texto);
    if (modo === 'substituir') {
      // So os grupos conhecidos. Export antigo trazia "notas", que nao existe mais.
      const limpo = vazio();
      GRUPOS.forEach(function (g) { if (entrando[g]) limpo[g] = entrando[g]; });
      dados = limpo;
      salvar();
      return { modo: 'substituir', aplicados: -1 };
    }
    let aplicados = 0, ignorados = 0;
    GRUPOS.forEach(function (grupo) {
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
    horaBloco: horaBloco, definirHoraBloco: definirHoraBloco,
    reserva: reserva, definirReserva: definirReserva,
    checkFeito: checkFeito, marcarChecklist: marcarChecklist,
    dataChecklist: dataChecklist, definirDataChecklist: definirDataChecklist,
    coordLocal: coordLocal, definirCoordLocal: definirCoordLocal,
    exportar: exportar, ultimoExport: ultimoExport,
    importar: importar, limpar: limpar,
    bruto: function () { return dados; },
  };
})();
