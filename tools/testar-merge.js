/* =============================================================================
   Teste da sincronizacao entre os dois celulares — Orlando 2026
   -----------------------------------------------------------------------------
   Existe por causa de um bug real: a Bianca digitava o numero da confirmacao do
   Sanaa, o Pedro marcava o status no aparelho dele, sincronizavam, e o numero
   sumia. O merge substituia o registro inteiro em vez de mesclar campo a campo —
   contra o que a tela de Ajustes promete por escrito.

       node tools/testar-merge.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');

function Aparelho(nome) {
  const loja = {};
  global.localStorage = {
    getItem: (k) => (k in loja ? loja[k] : null),
    setItem: (k, v) => { loja[k] = String(v); },
    removeItem: (k) => { delete loja[k]; },
  };
  global.window = {};
  eval(fs.readFileSync(path.join(raiz, 'js/estado.js'), 'utf8'));
  const E = global.window.Estado;
  E.__nome = nome;
  return E;
}

let falhas = 0;
const ok = (cond, rot, extra) => {
  console.log((cond ? '  ✓ ' : '  ✗ ') + rot + (cond || !extra ? '' : '  ' + extra));
  if (!cond) falhas++;
};

/* --- 1. o caso que deu origem ao teste --- */
console.log('\n=== o numero da reserva sobrevive ao status do outro aparelho ===');
{
  const bianca = Aparelho('bianca'), pedro = Aparelho('pedro');
  bianca.definirReserva('r-sanaa', { confirmacao: '4412233' });
  pedro.definirReserva('r-sanaa', { status: 'confirmado' });

  bianca.importar(pedro.exportar(), 'mesclar');
  const b = bianca.reserva('r-sanaa') || {};
  ok(b.confirmacao === '4412233', 'o numero digitado pela Bianca continua la', JSON.stringify(b));
  ok(b.status === 'confirmado', 'e o status do Pedro chegou', JSON.stringify(b));

  // e na direcao contraria
  pedro.importar(bianca.exportar(), 'mesclar');
  const p = pedro.reserva('r-sanaa') || {};
  ok(p.confirmacao === '4412233' && p.status === 'confirmado',
     'os dois aparelhos convergem para o mesmo registro', JSON.stringify(p));
}

/* --- 2. o campo mais novo ganha, campo a campo --- */
console.log('\n=== o mais recente ganha, sem levar o resto junto ===');
{
  const a = Aparelho('a'), b = Aparelho('b');
  a.definirReserva('r-x', { status: 'a-reservar', confirmacao: 'ANTIGO' });
  b.importar(a.exportar(), 'substituir');
  // agora cada um edita um campo diferente
  a.definirReserva('r-x', { confirmacao: 'NOVO' });
  b.definirReserva('r-x', { status: 'confirmado' });
  a.importar(b.exportar(), 'mesclar');
  b.importar(a.exportar(), 'mesclar');
  const ra = a.reserva('r-x'), rb = b.reserva('r-x');
  ok(ra.confirmacao === 'NOVO' && ra.status === 'confirmado', 'aparelho A tem os dois campos');
  ok(rb.confirmacao === 'NOVO' && rb.status === 'confirmado', 'aparelho B tem os dois campos');
  ok(JSON.stringify(ra) === JSON.stringify(rb), 'e os dois sao identicos');
}

/* --- 3. idempotencia e ordem --- */
console.log('\n=== idempotente e independente de ordem ===');
{
  const p = Aparelho('p'), q = Aparelho('q');
  p.marcarFeito('b-1111-0900', true);
  p.definirHoraBloco('b-1111-1500', '15:30');
  q.marcarChecklist('ck-ll-0811', true);
  q.definirReferencia('d-2026-11-13', '08:00');
  const dp = p.exportar(), dq = q.exportar();
  p.importar(dq, 'mesclar'); q.importar(dp, 'mesclar');
  const foto = (E) => JSON.stringify({
    f: E.feito('b-1111-0900'), h: E.horaBloco('b-1111-1500'),
    c: E.checkFeito('ck-ll-0811'), r: E.referencia('d-2026-11-13'),
  });
  const antes = foto(p);
  ok(antes === foto(q), 'convergem');
  p.importar(dq, 'mesclar');
  ok(foto(p) === antes, 'importar de novo nao muda nada');
}

/* --- 4. apagar atravessa --- */
console.log('\n=== apagar atravessa para o outro aparelho ===');
{
  const p = Aparelho('p'), q = Aparelho('q');
  p.definirReferencia('d-2026-11-11', '08:00');
  q.importar(p.exportar(), 'substituir');
  p.definirReferencia('d-2026-11-11', null);
  q.importar(p.exportar(), 'mesclar');
  ok(q.referencia('d-2026-11-11') === null, 'a exclusao chegou no outro aparelho');
}

/* --- 5. export antigo nao quebra nem ressuscita grupo removido --- */
console.log('\n=== export de versao antiga ===');
{
  const p = Aparelho('p');
  p.marcarFeito('b-1111-0900', true);
  const antigo = JSON.parse(p.exportar());
  antigo.notas = { 'd-2026-11-11': { texto: 'nota de uma versao antiga', em: '2099-01-01T00:00:00Z' } };
  antigo.reservas = { 'r-velho': { status: 'confirmado', confirmacao: '999', em: '2020-01-01T00:00:00Z' } };
  const q = Aparelho('q');
  q.importar(JSON.stringify(antigo), 'mesclar');
  const d = JSON.parse(q.exportar());
  ok(!('notas' in d), 'o grupo removido nao volta');
  const v = q.reserva('r-velho') || {};
  ok(v.confirmacao === '999' && v.status === 'confirmado',
     'reserva sem carimbo por campo ainda e aceita inteira', JSON.stringify(v));
}

console.log('\n' + (falhas ? '>>> ' + falhas + ' FALHA(S)' : '>>> TUDO OK') + '\n');
process.exit(falhas ? 1 : 0);
