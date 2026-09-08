# Orlando 2026 — roteiro offline

App web de guia de viagem para Orlando, 10 a 26 de novembro de 2026.
Feito para ser usado **andando dentro dos parques, no celular, com uma mão só** —
com sinal ruim ou sem sinal nenhum.

## Princípios

- **HTML, CSS e JavaScript puros.** Sem framework, sem build, sem npm.
- **Zero requisição de rede em tempo de execução.** Nenhum CDN, nenhuma fonte
  externa, nenhuma biblioteca, nenhum mapa embutido. Fontes de sistema e SVG inline.
- **Funciona offline de verdade.** PWA com service worker que faz precache total.
- **Abre por `file://` também.** Por isso o conteúdo vive em `data/roteiro.js`
  como objeto JavaScript, e não em JSON via `fetch`.

## Estrutura

```
index.html              a casca e as 5 telas
manifest.json           PWA
sw.js                   service worker (precache total, cache-first)
css/app.css             estilos, tema claro e escuro
data/roteiro.js         TODO o conteúdo do roteiro — a fonte de verdade
js/estado.js            localStorage, com timestamp por campo
js/app.js               home + timeline do dia
js/fase3.js             ficha do parque, restaurantes, pendências
js/fase4.js             guia: dicas e locais
js/fase5.js             service worker, status offline, exportar/importar
icons/                  ícones do PWA (gerados, não baixados)
```

## Editando o roteiro

Tudo que é conteúdo está em [`data/roteiro.js`](data/roteiro.js). O arquivo tem
um validador embutido que roda no load e reclama no console se algo ficar
inconsistente — datas fora de ordem, IDs duplicados, tipo fora do vocabulário,
referência a local ou restaurante que não existe.

### O campo que mais importa: `referencia`

Os horários oficiais dos parques em novembro de 2026 ainda não saíram. Todos os
horários assumem uma premissa de abertura. Cada dia tem:

```js
referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false }
```

Cada bloco declara se acompanha essa referência ou não:

- `ancora: 'referencia'` — desloca junto quando a abertura muda
- `ancora: 'fixo'` — não desloca nunca (fogos, desfiles, reservas, shows com
  horário próprio)

O horário efetivo é calculado no load:
`horaEfetiva = referênciaReal + (hora − referencia.padrao)`.
O campo `hora` é a única fonte de verdade; o deslocamento é derivado.

Quando o deslocamento faz dois blocos colidirem, o app avisa na timeline.

### Procedência dos dados

- `descricao` — texto literal do documento de origem
- `contexto` — pesquisa acrescentada, pode ser apagada sem perder a fonte
- `verificado: false` — coordenada ou estimativa não confirmada
- `pesquisa: 'AAAA-MM-DD'` — veio de pesquisa web, não do documento

## Estado e sincronização

O estado do usuário (blocos feitos, status de reservas, pendências, notas,
horários de abertura editados) fica em `localStorage`, com um timestamp em cada
registro.

São dois aparelhos sem servidor: exportar de um e importar no outro faz um
**merge campo a campo**, mantendo sempre o registro mais recente. A operação é
idempotente e convergente — a ordem em que cada um importa não altera o
resultado final.

## Rodando

Abra o `index.html`. Não precisa de servidor.

Para o service worker registrar (e o offline ficar garantido), é preciso HTTPS
ou localhost:

```sh
python -m http.server 8000
# http://localhost:8000
```

## Instalação no celular

**Android (Chrome):** menu → *Instalar app*.
**iOS (Safari, e só Safari):** compartilhar → *Adicionar à Tela de Início*.

Duas coisas importantes:

1. **Abra o app uma vez com internet antes de viajar.** É isso que enche o cache.
   A tela inicial mostra o status: enquanto não disser "Pronto para usar sem
   internet", o offline não está garantido.
2. **No iOS, o app instalado tem armazenamento separado do Safari.** Instale
   primeiro e use sempre pelo ícone, senão o estado não acompanha.
