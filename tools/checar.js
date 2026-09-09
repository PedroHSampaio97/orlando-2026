#!/usr/bin/env node
/* =============================================================================
   Conferência do projeto — roda antes de cada publicação.
       node tools/checar.js

   Existe porque dois bugs escaparam do olho e só apareceram na tela do celular:
   um badge herdando estilo de outro componente por colisão de nome de classe,
   e um badge esmagado por flex-shrink. Nenhum dos dois quebra sintaxe, então
   `node --check` passava limpo.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');
const ler = (p) => fs.readFileSync(path.join(raiz, p), 'utf8');

let falhas = 0;
const ok = (cond, rotulo, extra) => {
  if (!cond) falhas++;
  console.log('  ' + (cond ? '✓' : '✗') + ' ' + rotulo + (extra ? '  ' + extra : ''));
};

/* ---------- 1. dados ---------- */
console.log('\n=== DADOS ===');
global.window = {};
require(path.join(raiz, 'data/roteiro.js'));
const R = global.window.ROTEIRO;
const v = R.meta.validacao;
ok(v.ok, 'validador do roteiro', '(' + v.erros.length + ' erro(s))');
v.erros.slice(0, 8).forEach((e) => console.log('      · ' + e));
ok(R.locais.every((l) => l.lat != null), 'todo local tem coordenada');
ok(R.checklist.every((c) => c.dataAlvo), 'toda pendência tem data');

/* ---------- 2. sintaxe ---------- */
console.log('\n=== SINTAXE ===');
const jsFiles = ['data/roteiro.js', 'sw.js']
  .concat(fs.readdirSync(path.join(raiz, 'js')).map((f) => 'js/' + f));
let erroSintaxe = 0;
jsFiles.forEach(function (f) {
  try { new (require('vm').Script)(ler(f), { filename: f }); }
  catch (e) { erroSintaxe++; console.log('      · ' + f + ': ' + e.message); }
});
ok(erroSintaxe === 0, 'todos os .js compilam', '(' + jsFiles.length + ' arquivos)');

const css = ler('css/app.css');
const abre = (css.match(/\{/g) || []).length, fecha = (css.match(/\}/g) || []).length;
ok(abre === fecha, 'chaves do CSS balanceadas', abre + '/' + fecha);

/* ---------- 3. variáveis CSS ---------- */
console.log('\n=== CSS ===');
const defs = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const usos = new Set([...css.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]));
const semDef = [...usos].filter((x) => !defs.has(x));
ok(semDef.length === 0, 'toda var() tem definição', semDef.join(', '));

/* colisão: modificador .x.y onde .y também é bloco próprio.
   Foi assim que o badge "hoje" virou a linha do agora. */
const blocos = {};
css.replace(/^\s*([.][a-z0-9_.\-]+(?:\s*,\s*[.][a-z0-9_.\-]+)*)\s*(?:::?[a-z-]+)?\s*\{/gmi,
  function (m, sel) {
    sel.split(',').forEach(function (s) {
      s = s.trim();
      if (/^\.[a-z0-9_-]+$/i.test(s)) blocos[s] = (blocos[s] || 0) + 1;
    });
    return m;
  });
const mods = new Set();
css.replace(/\.[a-z0-9_-]+\.([a-z0-9_-]+)/gi, function (m, g) { mods.add('.' + g); return m; });
const colisoes = [...mods].filter((m) => blocos[m]);
ok(colisoes.length === 0, 'nenhum modificador colide com classe própria',
   colisoes.join(', '));

/* badge dentro de flex precisa resistir a encolhimento */
const emFlex = ['.np-quando', '.ct-fuso', '.ct-dur', '.ct-hora', '.selo', '.selo-dia',
                '.ld-hoje', '.tag-balcao'];
const semTrava = emFlex.filter(function (cl) {
  const re = new RegExp('\\' + cl + '\\s*\\{([^}]*)\\}');
  const m = css.match(re);
  return m && !/white-space:\s*nowrap/.test(m[1]);
});
ok(semTrava.length === 0, 'badges em flex com white-space:nowrap', semTrava.join(', '));

/* ---------- 4. HTML x JS ---------- */
console.log('\n=== FIAÇÃO ===');
const html = ler('index.html');
const idsJS = new Set();
jsFiles.filter((f) => f.startsWith('js/')).forEach(function (f) {
  const j = ler(f);
  [...j.matchAll(/\$\('#([a-zA-Z0-9_-]+)'\)/g)].forEach((m) => idsJS.add(m[1]));
  [...j.matchAll(/querySelector\('#([a-zA-Z0-9_-]+)'\)/g)].forEach((m) => idsJS.add(m[1]));
});
/* Campo escrito nos dados e lido por ninguem.
   Foi a classe de bug que mais apareceu na auditoria: `opcional` marcava um
   bloco como dispensavel e a tela mostrava igual ao obrigatorio; `restauranteId`
   estava em 51 blocos e o numero da reserva vivia escrito a mao na descricao;
   `locker` faltava justamente no TRON. Dado que ninguem le e promessa que
   ninguem cumpre. */
const CAMPOS_BLOCO = [
  'hora', 'ancora', 'tipo', 'titulo', 'descricao', 'contexto', 'fuso', 'acesso',
  'acessoAlt', 'condicao', 'confirmarHorario', 'molha', 'locker', 'critico',
  'duracaoMin', 'areaParque', 'endereco', 'localId', 'restauranteId', 'pesquisa',
  'nota', 'opcional',
];
/* Campos que existem de proposito sem uso na tela. Cada um precisa de motivo. */
const MORTOS_DE_PROPOSITO = {
  singleRider: 'decisao do Pedro: nao usar. Fica como fato, a interface nao destaca.',
  horaAprox:   'so em dias ainda nao fechados; entra quando o dia for fechado.',
  lockerNota:  'idem.',
  singleRiderNota: 'idem singleRider.',
};
const jsTelas = jsFiles.filter((f) => f.startsWith('js/')).map(ler).join('\n');
const usadosNosDados = new Set();
R.dias.forEach((d) => d.blocos.forEach(function (b) {
  Object.keys(b).forEach((k) => { if (b[k] != null) usadosNosDados.add(k); });
}));
const naoLidos = [...usadosNosDados].filter(function (campo) {
  if (campo === 'id') return false;
  if (MORTOS_DE_PROPOSITO[campo]) return false;
  return jsTelas.indexOf('.' + campo) < 0 && jsTelas.indexOf("'" + campo + "'") < 0;
});
ok(naoLidos.length === 0, 'todo campo dos blocos e lido por alguma tela',
   naoLidos.length ? naoLidos.join(', ') + ' — ou renderize, ou registre em MORTOS_DE_PROPOSITO' : '');

const semUso = CAMPOS_BLOCO.filter((c) => !usadosNosDados.has(c));
ok(true, 'campos do esquema ainda sem nenhum uso nos dados: ' +
   (semUso.length ? semUso.join(', ') : 'nenhum'));

const idsFaltando = [...idsJS].filter((id) => html.indexOf('id="' + id + '"') < 0);
ok(idsFaltando.length === 0, 'todo id usado no JS existe no HTML', idsFaltando.join(', '));

const classesJS = new Set();
jsFiles.filter((f) => f.startsWith('js/')).forEach(function (f) {
  [...ler(f).matchAll(/el\('[a-z]+',\s*'([a-z0-9 _-]+)'/g)].forEach(function (m) {
    m[1].split(/\s+/).forEach((c) => { if (c) classesJS.add(c); });
  });
});
const semRegra = [...classesJS].filter((c) => css.indexOf('.' + c) < 0);
ok(semRegra.length === 0, 'toda classe criada no JS tem regra CSS', semRegra.join(', '));

/* ---------- 5. service worker ---------- */
console.log('\n=== SERVICE WORKER ===');
const sw = ler('sw.js');
const versao = (sw.match(/const VERSAO = '([^']+)'/) || [])[1];
const lista = (sw.match(/const ARQUIVOS = \[([\s\S]*?)\];/) || ['', ''])[1]
  .split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter((s) => s && s !== './');
const ausentes = lista.filter((p) => !fs.existsSync(path.join(raiz, p.replace('./', ''))));
ok(ausentes.length === 0, 'precache aponta só para arquivos existentes', ausentes.join(', '));

const naCache = new Set(lista.map((p) => p.replace('./', '')));
const reais = [];
(function anda(d) {
  fs.readdirSync(path.join(raiz, d), { withFileTypes: true }).forEach(function (e) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'tools') return;
    // na raiz, só o index.html pertence ao app; o resto é avulso
    if (!d && /\.html$/.test(e.name) && e.name !== 'index.html') return;
    const p = d ? d + '/' + e.name : e.name;
    if (e.isDirectory()) anda(p);
    else if (/\.(js|css|html|json|png)$/.test(p) && p !== 'sw.js') reais.push(p);
  });
})('');
const foraDaCache = reais.filter((p) => !naCache.has(p));
ok(foraDaCache.length === 0, 'todo arquivo servido está no precache', foraDaCache.join(', '));
console.log('  versão: ' + versao);

/* ---------- 6. versão do SW x conteúdo ---------- */
/* O cache é cache-first e versionado pelo nome. Se o conteúdo muda e a VERSAO
   não, todo aparelho que já instalou continua servindo o arquivo velho para
   sempre. Por isso a VERSAO deriva do hash do conteúdo precacheado. */
const crypto = require('crypto');
function hashConteudo() {
  const h = crypto.createHash('sha256');
  lista.map((p) => p.replace('./', ''))
    .filter((p) => p && p !== 'sw.js')
    .sort()
    .forEach(function (p) {
      const abs = path.join(raiz, p);
      if (fs.existsSync(abs)) { h.update(p); h.update(fs.readFileSync(abs)); }
    });
  return h.digest('hex').slice(0, 8);
}
const esperado = 'orlando2026-' + hashConteudo();
const selar = process.argv.includes('--selar');
if (versao !== esperado && selar) {
  fs.writeFileSync(path.join(raiz, 'sw.js'),
    sw.replace(/const VERSAO = '[^']+'/, "const VERSAO = '" + esperado + "'"), 'utf8');
  console.log('  ✓ VERSAO selada em ' + esperado);
} else {
  ok(versao === esperado, 'VERSAO do SW corresponde ao conteúdo',
     versao === esperado ? '' : 'rode: node tools/checar.js --selar');
}

console.log('\n' + (falhas ? '>>> ' + falhas + ' FALHA(S)' : '>>> TUDO OK') + '\n');
process.exit(falhas ? 1 : 0);
