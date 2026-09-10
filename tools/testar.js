/* =============================================================================
   Testes de comportamento — Orlando 2026
   -----------------------------------------------------------------------------
   O checar.js olha a forma do projeto: sintaxe, CSS, fiacao, precache.
   Este aqui olha o COMPORTAMENTO: se o dia fechado nao acende alerta falso, e
   se o atraso que quebra o plano acende de verdade.

   Existe porque um atraso de 1h30 no dia 10 passava em silencio, com o cartao
   ainda prometendo "1h40 ate o jantar" quando faltavam quinze minutos.

       node tools/testar.js

   Rode junto do checar.js sempre que fechar um dia novo.
   ========================================================================== */

const fs = require('fs');
global.window = {};
eval(fs.readFileSync(__dirname + '/../data/roteiro.js', 'utf8'));
const R = global.window.ROTEIRO;
const min = h => +h.slice(0, 2) * 60 + +h.slice(3, 5);
const hhmm = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
const iv = m => m < 60 ? m + ' min' : Math.floor(m / 60) + 'h' + (m % 60 ? String(m % 60).padStart(2, '0') : '');

function alertas(diaId, desloc) {
  const dia = R.dias.find(d => d.id === diaId);
  let l = dia.blocos.map(b => {
    const o = min(b.hora);
    return { d: b, min: b.ancora === 'referencia' ? o + desloc : o, mo: o,
             desl: b.ancora === 'referencia' && desloc !== 0, c: null };
  });
  l.sort((x, y) => x.min - y.min);
  for (let i = 1; i < l.length; i++) {
    const a = l[i - 1], b = l[i];
    if (!a.d.duracaoMin) continue;
    if (a.d.fuso && b.d.fuso && a.d.fuso !== b.d.fuso) continue;
    const s = b.min - a.min;
    if (s >= a.d.duracaoMin) continue;
    a.c = a.c || ('nao cabe: sobram ' + iv(Math.max(s, 0)) + ' de ' + iv(a.d.duracaoMin));
  }
  for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) {
    const a = l[i], b = l[j];
    if (a.mo <= b.mo) continue;
    const mv = b.desl ? b : (a.desl ? a : b);
    mv.c = mv.c || (mv === b ? 'caiu para depois' : 'subiu para antes');
  }
  return l.filter(x => x.c);
}

let falhas = 0;
function ok(cond, msg) { console.log((cond ? '  OK   ' : '  FALHA ') + msg); if (!cond) falhas++; }

console.log('--- dias fechados sem alerta no plano padrao ---');
['d-2026-11-10', 'd-2026-11-11', 'd-2026-11-12', 'd-2026-11-13'].forEach(function (id) {
  const a = alertas(id, 0);
  ok(a.length === 0, id + ' sem atraso: ' + a.length + ' alerta(s)' +
     (a.length ? ' -> ' + a.map(x => x.d.titulo + ' (' + x.c + ')').join('; ') : ''));
});

console.log('\n--- o atraso que antes passava em silencio ---');
[60, 90].forEach(function (d) {
  const a = alertas('d-2026-11-10', d);
  ok(a.length > 0, '+' + d + 'min agora acende: ' + a.map(x => x.d.titulo).join(', '));
});

console.log('\n--- ordem dos blocos no arquivo ---');
// A tela ordena por horario, entao um bloco fora de ordem no arquivo nao quebra
// nada — mas esconde erro de quem edita a mao e torna o diff ilegivel.
R.dias.filter(d => d.fechado).forEach(function (dia) {
  const fora = [];
  for (let i = 1; i < dia.blocos.length; i++) {
    if (min(dia.blocos[i].hora) < min(dia.blocos[i - 1].hora)) {
      fora.push(dia.blocos[i - 1].id + ' (' + dia.blocos[i - 1].hora + ') vem antes de ' +
               dia.blocos[i].id + ' (' + dia.blocos[i].hora + ')');
    }
  }
  ok(fora.length === 0, dia.id + ': blocos em ordem de relogio no arquivo', fora.join('; '));
});

console.log('\n--- integridade ---');
const ids = R.dias.flatMap(d => d.blocos.map(b => b.id));
ok(new Set(ids).size === ids.length, 'nenhum id de bloco duplicado (' + ids.length + ')');
ok((R.contatos || []).length > 0, 'telefones no arquivo: ' + (R.contatos || []).length);
ok(R.contatos.filter(c => c.numero).every(c => /^\+?[0-9 ()-]+$/.test(c.numero)),
   'todo telefone tem formato de telefone');
const d13 = R.dias.find(d => d.id === 'd-2026-11-13');
ok((d13.naoPerca || []).some(p => /Starlight/.test(p.nome)), 'Starlight Safari no dia 13');
const semDur = R.dias.filter(d => d.fechado).flatMap(d => d.blocos).filter(b => !b.duracaoMin);
ok(semDur.length === 0, 'todo bloco de dia fechado tem duracao' +
   (semDur.length ? ' -> faltam ' + semDur.map(b => b.id).join(', ') : ''));
const todosLL = R.dias.flatMap(d => d.blocos).filter(b =>
  (b.acesso || []).some(a => a === 'multi-pass' || a === 'single-pass'));
ok(todosLL.length > 0, 'blocos com janela de Lightning Lane: ' + todosLL.length);

console.log(falhas ? '\n>>> ' + falhas + ' FALHA(S)' : '\n>>> TUDO OK');
process.exit(falhas ? 1 : 0);
