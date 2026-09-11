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

/* Caminho mais curto entre duas areas de um parque, pela topografia declarada.
   Mesma conta que js/app.js faz — se as duas divergirem, a ferramenta mente. */
function travessia(parqueId, de, para) {
  if (!de || !para || de === para) return 0;
  const topo = (R.topografia || {})[parqueId];
  if (!topo) return 0;
  const viz = {};
  topo.arestas.forEach(function (a) {
    (viz[a[0]] = viz[a[0]] || []).push([a[1], a[2]]);
    (viz[a[1]] = viz[a[1]] || []).push([a[0], a[2]]);
  });
  if (!viz[de] || !viz[para]) return 0;
  const dist = { [de]: 0 }, fila = [de];
  while (fila.length) {
    fila.sort((x, y) => dist[x] - dist[y]);
    const atual = fila.shift();
    (viz[atual] || []).forEach(function (p) {
      const novo = dist[atual] + p[1];
      if (dist[p[0]] == null || novo < dist[p[0]]) {
        dist[p[0]] = novo;
        if (fila.indexOf(p[0]) < 0) fila.push(p[0]);
      }
    });
  }
  return dist[para] || 0;
}

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
    // bloco de deslocamento JA E a travessia; nao somar outra por cima
    const anda = (a.d.tipo === 'deslocamento' || b.d.tipo === 'deslocamento')
      ? 0 : travessia(dia.parqueId, a.d.areaParque, b.d.areaParque);
    const precisa = a.d.duracaoMin + anda;
    const s = b.min - a.min;
    if (s >= precisa) continue;
    a.c = a.c || ('nao cabe: sobram ' + iv(Math.max(s, 0)) + ', o bloco leva ' +
      iv(a.d.duracaoMin) + (anda ? ' e sao ' + iv(anda) + ' de caminhada' : ''));
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
function ok(cond, msg, extra) {
  console.log((cond ? '  OK   ' : '  FALHA ') + msg);
  if (!cond && extra) console.log('         ' + extra);
  if (!cond) falhas++;
}

console.log('--- dias fechados sem alerta no plano padrao ---');
['d-2026-11-10', 'd-2026-11-11', 'd-2026-11-12', 'd-2026-11-13', 'd-2026-11-14', 'd-2026-11-15', 'd-2026-11-16', 'd-2026-11-17', 'd-2026-11-18', 'd-2026-11-19', 'd-2026-11-20', 'd-2026-11-21', 'd-2026-11-22', 'd-2026-11-23', 'd-2026-11-24', 'd-2026-11-25', 'd-2026-11-26'].forEach(function (id) {
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

console.log('\n--- ficha do restaurante x bloco ---');
const divergentes = [];
R.dias.forEach(function (dia) {
  dia.blocos.forEach(function (b) {
    if (!b.restauranteId) return;
    const r = R.restaurantes.find((x) => x.id === b.restauranteId);
    if (!r) return;
    if (r.hora !== b.hora) {
      divergentes.push(dia.data.slice(5) + ' ' + r.nome + ': ficha ' + r.hora + ', bloco ' + b.hora);
    }
    if (r.data !== dia.data) {
      divergentes.push(r.nome + ': ficha diz ' + r.data + ', bloco esta em ' + dia.data);
    }
  });
});
ok(divergentes.length === 0, 'a aba Comer mostra a mesma hora que a linha do tempo',
   divergentes.join(' | '));

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

console.log('\n--- single rider, lista do Walmart e Guia ---');
const todosBlocos = R.dias.flatMap(d => d.blocos);
ok(!todosBlocos.some(b => 'singleRider' in b || 'singleRiderNota' in b),
   'nenhum bloco com o campo antigo singleRider');
const comSR = todosBlocos.filter(b => b.acessoAlt === 'single-rider');
ok(comSR.length === 21, 'blocos com single rider: ' + comSR.length + ' (esperado 21)');
ok(!comSR.some(b => /Hagrid|Everest/.test(b.titulo)),
   'Hagrid’s e Everest sem selo de single rider (fila saindo ou incerta)');
const walmart = R.dias[0].listas.find(l => l.id === 'lista-walmart');
const idsItem = walmart.itens.map(i => i.id);
ok(idsItem.every(Boolean) && new Set(idsItem).size === idsItem.length,
   'todo item do Walmart com id unico (' + idsItem.length + ')');
ok(walmart.itens.every(i => R.meta.secoesLoja.includes(i.secao)),
   'todo item do Walmart numa secao da loja');
const textoLista = walmart.itens.map(i => [i.texto, i.marca, i.alternativaBarata].join(' ')).join(' ');
ok(!/naprox|aleve/i.test(textoLista), 'sem naproxeno na lista (decisao do Pedro)');
const guia = R.dicas.concat(R.regrasDeOuro);
ok(guia.every(x => R.meta.momentos.includes(x.momento)), 'toda dica e regra com momento');
const idsDias = new Set(R.dias.map(d => d.id));
ok(R.dicas.every(d => (d.dias || []).every(id => idsDias.has(id))),
   'toda dica de dia especifico aponta para dia que existe');
const doDia = (id) => R.dicas.filter(d => (d.dias || []).includes(id)).map(d => d.id);
ok(doDia('d-2026-11-20').includes('dica-bomba-zip') && doDia('d-2026-11-25').includes('dica-bomba-zip'),
   'a dica da bomba de gasolina aparece nos dias 20 e 25');
ok(R.dias.flatMap(d => d.notas || []).every(n => R.meta.tiposNota.includes(n.tipo)),
   'toda nota com tipo conhecido');
ok(R.contatos.some(c => c.id === 'tel-urgentcare-celebration' && c.numero),
   'Urgent Care com telefone conferido');

console.log('\n--- passes e reservas ---');
// Nivel 1 de cada parque: so um entra na compra antecipada do Multi Pass.
const niveis = R.estrategiaPasses.disney.niveis || {};
const comeca = (titulo, nomes) => nomes.some(n => titulo.startsWith(n));
R.dias.filter(d => d.ficha && d.ficha.multiPass && d.ficha.multiPass.usar).forEach(function (dia) {
  const mp = dia.ficha.multiPass;
  const n1 = niveis[dia.parqueId] || [];
  ok(n1.length > 0, dia.id + ': niveis do Multi Pass declarados para ' + dia.parqueId);
  ok((mp.listaAlta || []).length <= 1 && (mp.listaAlta || []).every(a => n1.includes(a)),
     dia.id + ': lista alta com no maximo 1 atracao, e do nivel 1', JSON.stringify(mp.listaAlta));
  ok((mp.listaBaixa || []).every(a => !n1.includes(a)),
     dia.id + ': lista baixa sem atracao do nivel 1', JSON.stringify(mp.listaBaixa));
  const todas = [].concat(mp.listaAlta || [], mp.listaBaixa || [], mp.rolando || []);
  const soltos = dia.blocos.filter(b => (b.acesso || []).includes('multi-pass') && !comeca(b.titulo, todas));
  ok(soltos.length === 0, dia.id + ': todo bloco de Multi Pass esta na compra ou rolando',
     soltos.map(b => b.titulo).join(', '));
});
const confirmados = R.restaurantes.filter(r => r.statusPadrao === 'confirmado');
const semNumero = confirmados.filter(r => !r.confirmacaoPadrao || !R.checklist.some(c =>
  c.feitoPadrao && (c.restauranteIds || []).includes(r.id) && c.texto.includes(r.confirmacaoPadrao)));
ok(semNumero.length === 0,
   'reserva confirmada tem numero e pendencia feita com esse numero (' + confirmados.length + ')',
   semNumero.map(r => r.id).join(', '));
const semPendencia = R.restaurantes.filter(r => r.precisaReserva &&
  !R.checklist.some(c => (c.restauranteIds || []).includes(r.id)));
ok(semPendencia.length === 0, 'restaurante com reserva e citado por alguma pendencia',
   semPendencia.map(r => r.id).join(', '));

// Privacidade: o site e publico. Nenhum celular brasileiro e nenhum e-mail pessoal nos
// dados e nos documentos. E-mail de estabelecimento entra na lista abaixo.
const textoPublico = ['/../data/roteiro.js', '/../roteiro-orlando-v3.md', '/../roteiro-orlando-dias-livres.md']
  .map(f => fs.readFileSync(__dirname + f, 'utf8')).join(' ');
const EMAILS_DE_ESTABELECIMENTO = ['harpandcelt1@gmail.com'];
const emails = (textoPublico.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || [])
  .map(e => e.replace(/\.+$/, ''))
  .filter(e => !EMAILS_DE_ESTABELECIMENTO.includes(e));
ok(emails.length === 0, 'nenhum e-mail pessoal nos dados e nos documentos', emails.join(', '));
const celularesBR = textoPublico.match(/(?<!\d)\+?55[\s-]?\(?\d{2}\)?[\s-]?9\d{4}[\s-]?\d{4}(?!\d)/g) || [];
ok(celularesBR.length === 0, 'nenhum celular brasileiro nos dados e nos documentos',
   celularesBR.join(', '));

console.log('\n--- guia e documentos ---');
// O roteiro fala no presente, nas tres camadas: nada narra a versao anterior.
const FRASES_DE_VERSAO = ['roteiro antigo', 'o roteiro dizia', 'versão anterior', 'Estava | Ficou',
  'DESCARTADO em', 'DECIDIDO em', 'DISPENSADA', 'virou dia único', 'viraram balcão',
  'não previa', 'não previu', 'foram cortadas', 'foi acrescentado', 'Custos novos',
  'Fica registrado para não', 'filial da 192', 'filial de bairro', 'Virou a pendência',
  'segunda rodada'];
const versaoAntiga = FRASES_DE_VERSAO.filter(f => textoPublico.includes(f));
ok(versaoAntiga.length === 0, 'nenhuma frase que narra versao antiga nos dados e nos documentos',
   versaoAntiga.join(' | '));

const dicaPorId = id => R.dicas.find(d => d.id === id) || { dias: [], corpo: '' };
[['molha', 'dica-molha'], ['locker', 'dica-lockers']].forEach(function ([campo, idDica]) {
  const faltam = R.dias.filter(d => d.blocos.some(b => b[campo])).map(d => d.id)
    .filter(id => !(dicaPorId(idDica).dias || []).includes(id));
  ok(faltam.length === 0, idDica + ' cobre todo dia com bloco ' + campo, faltam.join(', '));
});

const citadosVazio = [...dicaPorId('dica-vazio-proposital').corpo.matchAll(/(\d{2})\/11 às (\d{1,2})h(\d{2})?/g)]
  .map(m => m[1] + ' ' + m[2].padStart(2, '0') + ':' + (m[3] || '00'));
const vaziosReais = R.dias.flatMap(d => d.blocos.filter(b => b.tipo === 'vazio')
  .map(b => d.data.slice(8) + ' ' + b.hora));
ok(citadosVazio.length === vaziosReais.length && citadosVazio.every(c => vaziosReais.includes(c)),
   'a dica do vazio proposital lista cada bloco vazio com a hora certa',
   'dica: ' + citadosVazio.join(', ') + ' | roteiro: ' + vaziosReais.join(', '));

const saidasErradas = [];
R.dias.forEach(function (dia, i) {
  const p = dia.prepararAmanha, prox = R.dias[i + 1];
  const m = p && prox && p.titulo.match(/saída (\d{1,2})h(\d{2})?/);
  if (!m) return;
  const hora = m[1].padStart(2, '0') + ':' + (m[2] || '00');
  const saida = prox.blocos.find(b => b.tipo === 'deslocamento');
  if (!saida || saida.hora !== hora) {
    saidasErradas.push(dia.data.slice(5) + ' diz ' + hora + ', o dia seguinte sai ' + (saida ? saida.hora : '?'));
  }
});
ok(saidasErradas.length === 0, 'a saida da vespera bate com o primeiro deslocamento do dia seguinte',
   saidasErradas.join(' | '));

console.log(falhas ? '\n>>> ' + falhas + ' FALHA(S)' : '\n>>> TUDO OK');
process.exit(falhas ? 1 : 0);
