/* =============================================================================
   Teste da sincronizacao com a nuvem — Orlando 2026, Fase 6
   -----------------------------------------------------------------------------
   Sobe um servidor falso em memoria, no formato do PostgREST e do GoTrue, e roda
   o js/sync.js de verdade contra ele, com dois aparelhos. O que este teste
   protege, em ordem de importancia:

     1. O grupo `pessoais` NAO sobe. Foi decisao de 11/09 e e a unica garantia
        que nao da para conferir olhando a tela.
     2. O merge continua sendo o do estado.js, campo a campo, agora atravessando
        o servidor: ninguem apaga o trabalho do outro.
     3. O que chega do servidor nao vira "edicao local" — senao os dois celulares
        ficariam devolvendo a mesma coisa um para o outro, para sempre.
     4. Sem rede nada se perde, e a pendencia continua marcada.

       node tools/testar-sync.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');

let falhas = 0;
const ok = (cond, rot, extra) => {
  console.log((cond ? '  ✓ ' : '  ✗ ') + rot + (cond || !extra ? '' : '  ' + extra));
  if (!cond) falhas++;
};

/* --------------------------------------------------------------------------
   O servidor falso: uma tabela `snapshots` em memoria, chave (usuario, aparelho)
   -------------------------------------------------------------------------- */
function Servidor() {
  const linhas = new Map();   // dispositivo -> { dispositivo, estado, atualizado_em }
  let chamadas = 0;
  return {
    linhas: linhas,
    get chamadas() { return chamadas; },
    responder: function (url, opcoes) {
      chamadas++;
      const o = opcoes || {};
      const corpo = o.body ? JSON.parse(o.body) : null;
      const resposta = (status, dados) => Promise.resolve({
        ok: status >= 200 && status < 300,
        status: status,
        text: () => Promise.resolve(dados === undefined ? '' : JSON.stringify(dados)),
      });

      if (url.indexOf('/auth/v1/token') >= 0) {
        if (url.indexOf('grant_type=password') >= 0) {
          if (corpo.password !== 'senha-certa') {
            return resposta(400, { error_description: 'Invalid login credentials' });
          }
          return resposta(200, {
            access_token: 'tok-1', refresh_token: 'ref-1', expires_in: 3600,
            user: { id: 'usuario-unico' },
          });
        }
        return resposta(200, {
          access_token: 'tok-2', refresh_token: 'ref-2', expires_in: 3600,
          user: { id: 'usuario-unico' },
        });
      }
      if (url.indexOf('/auth/v1/logout') >= 0) return resposta(204);

      if (url.indexOf('/rest/v1/snapshots') >= 0) {
        if ((o.method || 'GET') === 'GET') {
          return resposta(200, Array.from(linhas.values()));
        }
        if (!o.headers || !o.headers['Authorization']) return resposta(401, { message: 'sem token' });
        linhas.set(corpo.dispositivo, {
          dispositivo: corpo.dispositivo,
          estado: corpo.estado,
          atualizado_em: new Date().toISOString(),
        });
        return resposta(201);
      }
      return resposta(404, { message: 'rota falsa nao prevista: ' + url });
    },
  };
}

/* --------------------------------------------------------------------------
   Um "aparelho": localStorage proprio, estado.js e sync.js de verdade
   -------------------------------------------------------------------------- */
// CADA APARELHO NUM CONTEXTO PROPRIO, de verdade. Trocar as globais do Node
// entre um aparelho e outro nao isola nada: o debounce do estado.js e o do sync
// disparam depois, e o timer do aparelho A acordava com o localStorage do B —
// foi assim que a primeira versao deste teste acusou pendencia no aparelho
// errado. `vm` resolve na raiz: os modulos enxergam so o seu contexto.
const vm = require('vm');

function Aparelho(nome, servidor) {
  const loja = {};
  const ctx = {
    localStorage: {
      getItem: (k) => (k in loja ? loja[k] : null),
      setItem: (k, v) => { loja[k] = String(v); },
      removeItem: (k) => { delete loja[k]; },
    },
    navigator: { onLine: true },
    document: {
      querySelector: () => null,          // sem DOM: o painel nao pinta
      addEventListener: function () {},
      visibilityState: 'visible',
      createElement: () => ({ style: {}, classList: { add() {}, remove() {} },
                              appendChild() {}, addEventListener() {} }),
    },
    fetch: (url, opcoes) => servidor.responder(url, opcoes),
    addEventListener: function () {},
    setTimeout: setTimeout, clearTimeout: clearTimeout, setInterval: setInterval,
    console: console,
  };
  ctx.window = ctx;            // window.Estado e window.Sync ficam no proprio contexto
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(raiz, 'js/estado.js'), 'utf8'), ctx,
                  { filename: 'estado.js' });
  vm.runInContext(fs.readFileSync(path.join(raiz, 'js/sync.js'), 'utf8'), ctx,
                  { filename: 'sync.js' });

  const ap = { nome: nome, E: ctx.Estado, S: ctx.Sync, ctx: ctx, loja: loja };
  // Sem ligar(), o gancho de mudanca nao existe e as assercoes sobre pendencia
  // passariam por vacuidade — foi exatamente o que aconteceu na primeira versao
  // deste teste.
  ap.S.ligar();
  ap.usar = function () { return ap; };   // nao ha mais global para trocar
  return ap;
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  /* --- 1. a carga que sobe --- */
  console.log('\n=== o que sobe, e o que nao sobe ===');
  {
    const srv = Servidor();
    const a = Aparelho('a', srv).usar();
    a.E.definirPessoal('seguro-apolice', 'APOLICE-SECRETA');
    a.E.definirPessoal('seguro-telefone', '0800-000-0000');
    a.E.marcarFeito('b-1111-0900', true);
    const carga = a.S.cargaLocal();
    ok(!('pessoais' in carga), 'a carga NAO leva o grupo pessoais');
    ok(JSON.stringify(carga).indexOf('APOLICE-SECRETA') < 0,
       'e o numero da apolice nao aparece em lugar nenhum da carga');
    ok('feitos' in carga && 'checklist' in carga && 'reservas' in carga,
       'mas leva os grupos que devem cruzar');
    ok(a.E.pessoal('seguro-apolice') === 'APOLICE-SECRETA',
       'a apolice continua no aparelho, intacta');
  }

  /* --- 2. dois aparelhos, atraves do servidor --- */
  console.log('\n=== o que um marca chega no outro ===');
  {
    const srv = Servidor();
    const a = Aparelho('a', srv), b = Aparelho('b', srv);

    a.usar();
    await a.S.entrar('conta@viagem', 'senha-certa');
    a.E.marcarChecklist('ck-ll-0811', true);
    a.E.definirHoraBloco('b-1511-0900', '09:15');
    a.E.definirPessoal('seguro-apolice', 'SO-NO-APARELHO-A');
    await a.S.sincronizar();

    b.usar();
    await b.S.entrar('conta@viagem', 'senha-certa');
    const r = await b.S.sincronizar();

    ok(b.E.checkFeito('ck-ll-0811') === true, 'a pendencia marcada em A chegou em B');
    ok(b.E.horaBloco('b-1511-0900') === '09:15', 'e a hora confirmada tambem');
    ok(b.E.pessoal('seguro-apolice') === null,
       'a apolice de A NAO chegou em B pelo servidor', String(b.E.pessoal('seguro-apolice')));
    ok(r && r.aparelhos === 1, 'B viu exatamente um outro aparelho', JSON.stringify(r));
  }

  /* --- 3. campo a campo, atravessando o servidor --- */
  console.log('\n=== o numero e o status sobrevivem, cada um do seu lado ===');
  {
    const srv = Servidor();
    const a = Aparelho('a', srv), b = Aparelho('b', srv);
    a.usar(); await a.S.entrar('conta@viagem', 'senha-certa');
    b.usar(); await b.S.entrar('conta@viagem', 'senha-certa');

    a.usar(); a.E.definirReserva('r-sanaa', { confirmacao: '4412233' }); await a.S.sincronizar();
    b.usar(); b.E.definirReserva('r-sanaa', { status: 'confirmado' });  await b.S.sincronizar();
    a.usar(); await a.S.sincronizar();
    b.usar(); await b.S.sincronizar();

    const ra = a.E.reserva('r-sanaa') || {}, rb = b.E.reserva('r-sanaa') || {};
    ok(ra.confirmacao === '4412233' && ra.status === 'confirmado',
       'A tem os dois campos', JSON.stringify(ra));
    ok(rb.confirmacao === '4412233' && rb.status === 'confirmado',
       'B tem os dois campos', JSON.stringify(rb));
  }

  /* --- 4. o que chega nao vira edicao nossa --- */
  console.log('\n=== sem vaivem: o merge remoto nao marca pendencia ===');
  {
    const srv = Servidor();
    const a = Aparelho('a', srv), b = Aparelho('b', srv);
    a.usar(); await a.S.entrar('conta@viagem', 'senha-certa');
    a.E.marcarFeito('b-1311-0800', true); await a.S.sincronizar();

    b.usar(); await b.S.entrar('conta@viagem', 'senha-certa');
    await b.S.sincronizar();
    b.loja['orlando2026:sync-pendente'] = undefined;
    delete b.loja['orlando2026:sync-pendente'];
    await b.S.sincronizar();          // segunda volta: nada novo deve entrar
    await espera(20);

    ok(b.E.feito('b-1311-0800') === true, 'B continua com o que veio de A');
    ok(!b.S.resumo().pendente,
       'e o merge que veio do servidor nao deixou pendencia de envio em B',
       JSON.stringify(b.S.resumo()));
  }

  /* --- 5. sem rede --- */
  console.log('\n=== sem rede, nada se perde ===');
  {
    const srv = Servidor();
    const a = Aparelho('a', srv).usar();
    await a.S.entrar('conta@viagem', 'senha-certa');
    a.ctx.navigator.onLine = false;
    a.E.marcarFeito('b-2211-0900', true);
    await espera(20);
    let msg = null;
    try { await a.S.sincronizar(false); } catch (e) { msg = e.message; }
    ok(/sem internet/i.test(msg || ''), 'a mensagem diz que falta internet', String(msg));
    ok(a.E.feito('b-2211-0900') === true, 'a marcacao continua no aparelho');
    ok(a.S.resumo().pendente === true, 'e a pendencia de envio continua marcada');

    a.ctx.navigator.onLine = true;
    await a.S.sincronizar();
    ok(a.S.resumo().pendente === false, 'com a rede de volta, a pendencia se resolve');
    ok(srv.linhas.has(a.E.bruto().dispositivo), 'e a linha do aparelho chegou ao servidor');
  }

  /* --- 6. credencial errada --- */
  console.log('\n=== credencial errada ===');
  {
    const srv = Servidor();
    const a = Aparelho('a', srv).usar();
    let msg = null;
    try { await a.S.entrar('conta@viagem', 'senha-torta'); } catch (e) { msg = e.message; }
    ok(/nao conferem|não conferem/i.test(msg || ''), 'mensagem especifica', String(msg));
    ok(!a.S.conectado(), 'e o aparelho continua fora da conta');
  }

  console.log('\n' + (falhas ? '>>> ' + falhas + ' FALHA(S)' : '>>> TUDO OK') + '\n');
  process.exit(falhas ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
