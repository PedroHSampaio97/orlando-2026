/* =============================================================================
   Orlando 2026 — Fase 5
   Service worker, status do cache offline, exportar/importar estado.
   ========================================================================== */

window.Fase5 = (function () {
  'use strict';

  const E = window.Estado;
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, texto) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texto != null) n.textContent = texto;
    return n;
  };

  let estadoSW = { suportado: 'serviceWorker' in navigator, registrado: false,
                   completo: false, emCache: 0, esperado: 0, versao: null,
                   motivo: null };

  /* ---------------------------------------------------------------------------
     Registro do service worker.
     Não funciona em file:// — só HTTPS ou localhost. Abrir o arquivo direto do
     disco continua funcionando (por isso roteiro.js é JS e não fetch de JSON),
     mas o offline garantido vem da versão instalada do GitHub Pages.
     ------------------------------------------------------------------------ */
  function registrar() {
    if (!estadoSW.suportado) {
      estadoSW.motivo = 'Este navegador não suporta service worker.';
      return pintarStatus();
    }
    if (location.protocol === 'file:') {
      estadoSW.motivo = 'Aberto direto do disco (file://). O app funciona, mas o ' +
        'service worker só registra em HTTPS. Para o offline garantido, use a ' +
        'versão publicada e instale na tela inicial.';
      return pintarStatus();
    }

    navigator.serviceWorker.register('./sw.js')
      .then(function (reg) {
        estadoSW.registrado = true;
        pintarStatus();
        perguntarCache();
        reg.addEventListener('updatefound', function () {
          const novo = reg.installing;
          if (!novo) return;
          novo.addEventListener('statechange', function () {
            if (novo.state === 'activated') perguntarCache();
          });
        });
      })
      .catch(function (e) {
        estadoSW.motivo = 'Falha ao registrar: ' + e.message;
        pintarStatus();
      });

    navigator.serviceWorker.addEventListener('message', function (ev) {
      if (!ev.data || ev.data.tipo !== 'status-cache') return;
      Object.assign(estadoSW, ev.data);
      pintarStatus();
    });
  }

  function perguntarCache() {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ tipo: 'status-cache' });
    } else {
      // Primeira visita: o SW ainda não controla esta página. Ele assume no
      // próximo carregamento.
      navigator.serviceWorker.ready.then(function (reg) {
        if (reg.active) reg.active.postMessage({ tipo: 'status-cache' });
      });
    }
  }

  function pintarStatus() {
    const alvo = $('#status-offline');
    if (!alvo) return;
    alvo.innerHTML = '';

    let classe, titulo, texto;
    if (estadoSW.motivo) {
      classe = 'aviso'; titulo = '○  Offline não garantido'; texto = estadoSW.motivo;
    } else if (estadoSW.completo) {
      classe = 'aviso bom';
      titulo = '●  Pronto para usar sem internet';
      texto = estadoSW.emCache + ' arquivos guardados no aparelho (' +
        estadoSW.versao + '). Vocês podem abrir o app dentro do parque com o ' +
        'celular sem sinal nenhum.';
    } else if (estadoSW.registrado) {
      classe = 'aviso';
      titulo = '◐  Guardando arquivos…';
      texto = estadoSW.emCache + ' de ' + (estadoSW.esperado || '?') +
        ' arquivos. Deixe o app aberto alguns segundos com internet e recarregue.';
    } else {
      classe = 'aviso'; titulo = '○  Verificando…'; texto = 'Consultando o cache.';
    }

    const d = el('div', classe);
    d.appendChild(el('strong', null, titulo));
    d.appendChild(document.createTextNode(texto));
    alvo.appendChild(d);
  }

  /* ---------------------------------------------------------------------------
     Exportar — três saídas, porque nenhuma funciona em todo lugar.
     ------------------------------------------------------------------------ */
  const nomeArquivo = () =>
    'orlando2026-' + new Date().toISOString().slice(0, 16).replace(/[:T]/g, '') + '.json';

  function exportarCopiar(botao) {
    const txt = E.exportar();
    const ok = () => { botao.textContent = '✓ Copiado'; setTimeout(function () {
      botao.textContent = 'Copiar'; }, 2000); };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(txt).then(ok).catch(function () { velhaCopia(txt, ok); });
    } else velhaCopia(txt, ok);
  }
  function velhaCopia(txt, ok) {
    const ta = document.createElement('textarea');
    ta.value = txt;
    ta.style.cssText = 'position:fixed;top:-1000px;left:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); ok(); } catch (e) { alert('Não consegui copiar.'); }
    document.body.removeChild(ta);
  }

  function exportarArquivo() {
    const blob = new Blob([E.exportar()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = nomeArquivo();
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function exportarCompartilhar(botao) {
    const txt = E.exportar();
    if (navigator.share) {
      const dados = { title: 'Orlando 2026 — estado', text: txt };
      // Compartilhar arquivo é melhor onde houver suporte.
      try {
        const arq = new File([txt], nomeArquivo(), { type: 'application/json' });
        if (navigator.canShare && navigator.canShare({ files: [arq] })) {
          return navigator.share({ files: [arq], title: 'Orlando 2026 — estado' })
            .catch(function () {});
        }
      } catch (e) {}
      navigator.share(dados).catch(function () {});
    } else {
      botao.textContent = 'Sem suporte';
      setTimeout(function () { botao.textContent = 'Enviar'; }, 2000);
    }
  }

  /* ---------------------------------------------------------------------------
     Importar
     ------------------------------------------------------------------------ */
  function abrirImportar() {
    $('#modal-importar').classList.remove('oculto');
    $('#imp-texto').value = '';
    $('#imp-resultado').textContent = '';
  }
  function fecharImportar() { $('#modal-importar').classList.add('oculto'); }

  function aplicarImportacao(modo) {
    const txt = $('#imp-texto').value.trim();
    const saida = $('#imp-resultado');
    if (!txt) { saida.textContent = 'Cole o conteúdo do outro aparelho primeiro.'; return; }

    let r;
    try { r = E.importar(txt, modo); }
    catch (e) { saida.textContent = '✗ Não consegui ler: ' + e.message; return; }

    saida.textContent = modo === 'substituir'
      ? '✓ Estado substituído por completo.'
      : '✓ Mesclado: ' + r.aplicados + ' registros mais novos aplicados, ' +
        r.ignorados + ' ignorados por serem mais antigos que os seus.';

    setTimeout(function () { location.reload(); }, 1400);
  }

  function lerArquivo(ev) {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    const leitor = new FileReader();
    leitor.onload = function () { $('#imp-texto').value = leitor.result; };
    leitor.readAsText(f);
  }

  /* ---------------------------------------------------------------------------
     Ligação
     ------------------------------------------------------------------------ */
  function ligar() {
    $('#btn-exp-copiar').addEventListener('click', function () { exportarCopiar(this); });
    $('#btn-exp-arquivo').addEventListener('click', exportarArquivo);
    $('#btn-exp-enviar').addEventListener('click', function () { exportarCompartilhar(this); });
    $('#btn-importar').addEventListener('click', abrirImportar);
    $('#btn-imp-fechar').addEventListener('click', fecharImportar);
    $('#btn-imp-mesclar').addEventListener('click', function () { aplicarImportacao('mesclar'); });
    $('#btn-imp-substituir').addEventListener('click', function () {
      if (confirm('Isso apaga tudo que está neste aparelho e coloca o conteúdo colado ' +
                  'no lugar. Na dúvida, use Mesclar. Continuar?')) {
        aplicarImportacao('substituir');
      }
    });
    $('#imp-arquivo').addEventListener('change', lerArquivo);
    $('#modal-importar').addEventListener('click', function (e) {
      if (e.target === this) fecharImportar();
    });
    registrar();
  }

  return { ligar: ligar, pintarStatus: pintarStatus };
})();
