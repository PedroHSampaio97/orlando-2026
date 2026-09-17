/* =============================================================================
   ROTEIRO ORLANDO — 10 a 26 de novembro de 2026
   Fonte de verdade: roteiro-orlando-v3.md + roteiro-orlando-dias-livres.md
   -----------------------------------------------------------------------------
   COMO EDITAR ESTE ARQUIVO

   1. `hora` é a única fonte de verdade de horário. É o valor literal do
      documento. O deslocamento é calculado no load:

          horaEfetiva = referênciaReal + (hora − referencia.padrao)

      ...para blocos com ancora:'referencia'. Blocos com ancora:'fixo' nunca
      deslocam — fogos, desfiles, reservas de restaurante e shows com horário
      próprio.

   2. Cada dia tem `referencia`: normalmente a abertura do parque, mas pode ser
      outro evento âncora. No dia 14/11 a referência é o Grinchmas.

   3. `verificado:false` = estimativa minha, não do documento. Confira.

   4. `pesquisa:'2026-09-08'` = veio de pesquisa web, não do documento.

   5. O sufixo numérico do `id` de um bloco é só IDENTIFICADOR, não horário.
      Ele guarda a hora de quando o bloco nasceu e NÃO é atualizado quando a
      hora muda — de propósito: o id é a chave do estado no localStorage, e
      renomear apagaria o que já foi marcado. Se `b-1011-1745` tem
      `hora: '17:15'`, está certo. A hora que vale é sempre o campo `hora`.
   ========================================================================== */

window.ROTEIRO = {

  meta: {
    versaoDados: 1,
    fontes: ['roteiro-orlando-v3.md', 'roteiro-orlando-dias-livres.md'],
    geradoEm: '2026-09-08',
    avisoHorarios:
      'OS QUATRO DIAS DE DISNEY TÊM HORÁRIO PUBLICADO: Magic Kingdom das 9h às 22h no dia ' +
      '11, Epcot das 9h às 21h no dia 13, Hollywood Studios das 9h às 21h no dia 15 e ' +
      'Animal Kingdom das 8h às 18h no dia 16. O Early Entry, que vocês não têm, abre meia ' +
      'hora antes — e 7h30 no Animal Kingdom.\n\n' +
      'O HORÁRIO DOS DIAS 13 E 16 VEM DO CALENDÁRIO PUBLICADO, conferido em 16/09, e não da ' +
      'confirmação oficial de 12/09: confirmem os dois no app da Disney. Está nas ' +
      'pendências.\n\n' +
      'AINDA É SUPOSIÇÃO: Universal (17/11), Epic (19/11), SeaWorld (22/11) e Islands ' +
      '(23/11) em 9h, e Busch Gardens (24/11) em 10h. As pendências dizem quando conferir ' +
      'cada um; ajustem a referência do dia e os blocos ancorados deslocam junto.\n\n' +
      'A PARTIR DO COMPROMISSO DE HORA MARCADA — desfile, show, reserva, pôr do sol —, os ' +
      'blocos são fixos e não se mexem com a abertura.\n\n' +
      'Oito dias têm outra referência: a saída do Terminal C no dia 10, a saída do hotel ' +
      'nos dias 12, 20 e 25, a sessão do Grinchmas no dia 14, o início do jogo nos dias 18 ' +
      'e 21 e a decolagem de Orlando no dia 26.',

    // Vocabulários fechados. A interface valida contra isto no load.
    tiposBloco: ['atracao', 'refeicao', 'deslocamento', 'show', 'compras',
                 'espera', 'tarefa', 'livre', 'vazio', 'pausa'],
    tiposAcesso: ['rope-drop', 'multi-pass', 'single-pass', 'standby', 'reserva',
                  'single-rider'],
    tiposAncora: ['referencia', 'fixo'],
    tiposNota: ['atencao', 'alerta', 'info', 'bom'],
    // Quando a pessoa lê a dica. É o que organiza a aba Guia em seções.
    momentos: ['antes-de-viajar', 'todo-dia', 'dia-especifico', 'emergencia'],
    // Seções do Walmart, na ordem da rota dentro da loja.
    secoesLoja: ['Bebidas', 'Farmácia', 'Alimentos', 'Eletrônicos', 'Casa'],
  },

  viagem: {
    titulo: 'Orlando 2026',
    subtitulo: '10 a 26 de novembro',
    inicio: '2026-11-10',
    fim: '2026-11-26',
    viajantes: ['Pedro', 'Bianca'],
    perfil: 'Casal, sem crianças. Prioridade: clássicos + montanhas-russas fortes.',
    baseLocalId: 'hotel-travelodge',
    decisoesFechadas: [
      'Dias 19 Epic Universe, 21 Winter Garden, 22 SeaWorld e 23 Islands of Adventure',
      'O Epic Universe é um dia só, 19/11',
      'Sem Mickey’s Very Merry Christmas Party',
      'Sem Express Pass na Universal',
      'Carro alugado de 20 a 25/11 — devolvido no dia 25, para o dia 26 ser só ' +
      'café da manhã e aeroporto',
      'PID (Permissão Internacional para Dirigir) já emitida',
      'A última noite é no Disney Springs, 25/11',
    ],
  },

  /* ---------------------------------------------------------------------------
     REGRAS DE OURO — Parte 3 do documento
     ------------------------------------------------------------------------ */
  regrasDeOuro: [
    { n: 1, momento: 'todo-dia', titulo: 'Rope drop vale mais que qualquer passe.',
      texto: 'A primeira hora de parque rende o que as três da tarde rendem. Chegar 45 ' +
             'minutos antes da abertura é a decisão mais barata e mais eficaz da viagem. ' +
             'Quando o dia marca outra hora de portão, vale a do dia: vai de 75 minutos antes ' +
             'no Magic Kingdom, por causa do monotrilho, a 30 no Universal Studios. Na Disney e ' +
             'na Universal a catraca abre antes para todo mundo, e essa espera é do lado de dentro.' },
    { n: 2, momento: 'todo-dia',
      titulo: 'Não reserve Multi Pass para o que você vai fazer no rope drop.',
      texto: 'Erro clássico: reservar a atração que já estaria vazia às 9h e depois ' +
             'enfrentar fila de 80 minutos no resto.' },
    { n: 3, momento: 'todo-dia', titulo: 'Use a primeira reserva do Multi Pass cedo.',
      texto: 'O sistema só libera a próxima depois que você usa a atual. Quem usa às 11h ' +
             'faz o dobro de quem usa às 15h. Nos dias 11 e 13 a primeira é usada às 11h e às ' +
             '9h45. No dia 15 ela fica para as 13h55, porque a manhã já sai no rope drop, no ' +
             'standby e no Single Pass do Rise.' },
    { n: 4, momento: 'todo-dia', titulo: 'Mobile order em tudo que for balcão.',
      texto: 'Disney e Universal permitem pedir pelo app e só buscar. Economiza 20 a 30 ' +
             'minutos por refeição.' },
    { n: 5, momento: 'todo-dia', titulo: 'Almoço às 11h30 ou às 14h.',
      texto: 'Meio-dia é o pico. E as filas das atrações caem exatamente quando todo mundo ' +
             'está comendo — use isso. Nos dias de parque, cada almoço está na hora que ' +
             'encaixa entre as filas daquele dia, de 11h40 a 14h20: sigam a do bloco.' },
    { n: 6, momento: 'todo-dia', titulo: 'Single rider quando a fila passar de 45 minutos.',
      texto: 'Vocês entram separados e se encontram na saída: custa o andar junto e devolve ' +
             'tempo de fila. Os blocos com o selo "ou single rider" têm essa fila. Três ' +
             'exceções, escritas no próprio bloco: Forbidden Journey e Gringotts, onde a fila ' +
             'é metade da atração, e o Millennium Falcon, onde single rider quase nunca pilota. ' +
             'A fila de single rider abre e fecha ao longo do dia — a placa da entrada manda.',
      pesquisa: '2026-09-10' },
    { n: 7, momento: 'todo-dia', titulo: 'Peçam água gelada de graça em todo balcão.',
      texto: 'Todo balcão de comida rápida da Disney e da Universal dá um copo de água gelada ' +
             'sem cobrar — é só pedir "a cup of ice water". A garrafa lá dentro custa US$ 4 a ' +
             '6. Com os dois soft flasks de 500 ml da mochila, vira reabastecimento o dia ' +
             'inteiro.',
      pesquisa: '2026-09-10' },
  ],
  /* ---------------------------------------------------------------------------
     ESTRATÉGIA DE PASSES — Parte 1 do documento + pesquisa
     ------------------------------------------------------------------------ */
  estrategiaPasses: {

    disney: {
      resumo: [
        { data: '2026-11-11', parque: 'Magic Kingdom',     multiPass: 'Sim',
          singlePass: 'Nenhum — os dois ficam como plano B pago', custo: { min: 40, max: 70 } },
        { data: '2026-11-13', parque: 'Epcot',             multiPass: 'Sim',
          singlePass: 'Cosmic Rewind',                           custo: { min: 60, max: 110 } },
        { data: '2026-11-15', parque: 'Hollywood Studios', multiPass: 'Sim',
          singlePass: 'Rise of the Resistance',                  custo: { min: 70, max: 130 } },
        { data: '2026-11-16', parque: 'Animal Kingdom',    multiPass: 'Não',
          singlePass: 'Flight of Passage — só se o fim de dia não resolver', custo: { min: 0, max: 40 } },
      ],
      correcao:
        'Seven Dwarfs Mine Train e Flight of Passage NÃO estão no Multi Pass. São Single ' +
        'Pass, compra separada, no máximo duas por dia.',
      comoFuncionam:
        'No Magic Kingdom, Epcot e Hollywood Studios vocês escolhem 1 do nível 1 (a lista ' +
        'alta) e 2 do nível 2 (a lista baixa). O Animal Kingdom não tem listas. As listas ' +
        'deste roteiro seguem os níveis de maio de 2026; se o app mostrar outra divisão no ' +
        'dia da compra, vale a do app.',
      regraDeOuro:
        'Cada reserva usada libera a próxima, uma de cada vez. Usem cedo para girar mais ' +
        'vezes.',
      compra: {
        documento: { data: '2026-11-08', hora: '07:00', fuso: 'ET' },
        nota: 'Vocês têm cerca de 5 minutos para concluir antes de o sistema soltar as seleções.',
        alerta: {
          gravidade: 'alta',
          titulo: 'Uma compra só: 7h ET de 08/11 — é a ação mais crítica da viagem',
          texto:
            'A REGRA DO INGRESSO ESTÁ CONFIRMADA. A agência confirmou em 17/09/2026: são 4 ' +
            'dias de parque, válidos por 7 DIAS CORRIDOS a partir da data de início. É ingresso ' +
            'de datas fixas (date-based).\n\n' +
            'COM ISSO, A COMPRA É UMA SÓ. Fora dos hotéis Disney a janela é de 3 dias, e num ' +
            'ingresso de datas fixas ela abre 3 dias antes do PRIMEIRO dia e cobre todos os ' +
            'dias de uma vez, Multi Pass e Single Pass. Começando em 11/11, isso é 08/11 às ' +
            '7h ET, e resolve os quatro dias.\n\n' +
            'A JANELA DE 7 DIAS AMARRA O ROTEIRO: começando em 11/11, o ingresso vale até ' +
            '17/11. Os quatro dias de Disney — 11, 13, 15 e 16 — cabem com um dia de folga. ' +
            'Qualquer remanejamento que jogue um dia de Disney para depois de 17/11 quebra o ' +
            'ingresso.\n\n' +
                        'MULTI PASS, dia a dia: 11/11 Peter Pan / Mansão / Buzz. 13/11 Frozen / ' +
            'Mission: SPACE / Soarin’, com o Remy rolando. 15/11 Rock ’n’ Roller Coaster / ' +
            'Torre do Terror / Star Tours, com o Runaway Railway rolando. 16/11 nenhum, o ' +
            'Animal Kingdom não usa.\n\n' +
            'SINGLE PASS: quatro compras, todas em 08/11.\n' +
            '  · TRON (11/11) → COMPRAR, ~US$ 20–23 por pessoa. Sem Early Entry o TRON não ' +
            'é opção de rope drop e o standby fica em 50–90 minutos.\n' +
            '  · Cosmic Rewind (13/11) → janela entre 10h15 e 10h45\n' +
            '  · Rise of the Resistance (15/11) → janela entre 10h30 e 11h\n' +
            '  · Flight of Passage (16/11) → COMPRAR, ~US$ 18–20 por pessoa. Ele esgota ' +
            'antes da data: não dá para deixar para decidir dentro do parque.\n' +
            '  · Seven Dwarfs (11/11) → NÃO COMPRAR. Segue como plano B pago, resolvido por ' +
            'janela de horário dentro do parque.\n\n' +
            'PREÇO: dinâmico. Em setembro de 2026 o Multi Pass custava US$ 15–37 no Epcot e ' +
            'US$ 20–39 no Hollywood Studios, por pessoa; o Single Pass, US$ 14–17 no Cosmic ' +
            'Rewind e US$ 15–25 no Rise. Novembro tende a ser mais caro.',
          pesquisa: '2026-09-11',
          verificado: true,
        },
      },
      // Nível 1 de cada parque: só um deles entra na compra antecipada do Multi Pass.
      niveis: {
        'magic-kingdom': ['Big Thunder Mountain', 'Jungle Cruise', 'Peter Pan’s Flight',
                          'Space Mountain', 'Tiana’s Bayou Adventure'],
        'hollywood-studios': ['Mickey & Minnie’s Runaway Railway',
                              'Millennium Falcon: Smugglers Run', 'Rock ’n’ Roller Coaster',
                              'Slinky Dog Dash'],
        'epcot': ['Frozen Ever After', 'Remy’s Ratatouille Adventure', 'Test Track'],
        fonte: 'Mousehacking (Hollywood Studios, 26/05/2026), Wandering in Disney (Epcot, ' +
               '25/05/2026) e Deep Arrival (Magic Kingdom, com a volta do Big Thunder em 03/05/2026)',
        pesquisa: '2026-09-11',
      },
    },

    universal: {
      expressPass: {
        usar: false,
        motivo:
          'No Islands, o Hagrid’s saiu do Express em julho de 2026 — vocês pagariam e ainda ' +
          'enfrentariam a fila que incomoda. No Epic, o Express tem preço dinâmico, de ' +
          'US$ 150 a mais de 360 por pessoa, por dia, e o dia de vocês não precisa dele para ' +
          'caber.\n\n' +
          'Se o dia 19 der muito errado, a manhã livre do dia 20 é o lugar de voltar ao Epic, ' +
          'e isso não custa dia de ingresso: o de vocês é de 14 dias com entradas ilimitadas. ' +
          'Confirmem o produto e a data de início na pendência dos ingressos da Universal.',
        alternativa:
          'Nas filas longas, single rider a partir de 45 minutos, onde houver. Para uma fila ' +
          'específica, o Universal Express Now: comprado no app, dentro do parque, US$ 20 a 25 ' +
          'por pessoa e por atração, com a lista de atrações mudando ao longo do dia.',
      },
      singleRider: {
        titulo: 'Single rider — quando a fila passar de 45 minutos',
        prioridade: 'usar',
        texto:
          'Fila para quem aceita ir separado: vocês embarcam em carrinhos diferentes e se ' +
          'encontram na saída. Os blocos com o selo "ou single rider" são as atrações do ' +
          'roteiro que têm essa fila — a maior parte das montanhas-russas e dark rides da ' +
          'Universal e, na Disney, Test Track, Rock ’n’ Roller e Millennium Falcon.\n\n' +
          'A regra é a número 6: acima de 45 minutos de standby, single rider. Três exceções, ' +
          'escritas no próprio bloco: Forbidden Journey e Gringotts, onde a fila é metade da ' +
          'atração, e o Millennium Falcon, onde single rider quase sempre vira engenheiro.\n\n' +
          'Hagrid’s e Expedition Everest ficam sem selo: a fila de single rider dos dois está ' +
          'saindo ou tem informação conflitante. Perguntem na entrada. A VelociCoaster também ' +
          'fica sem selo: a Universal fechou a fila de single rider dela.\n\n' +
          'A fila de single rider abre e fecha ao longo do dia. A placa na entrada manda.',
        pesquisa: '2026-09-15',
      },
      lockers: {
        titulo: 'O imposto de tempo dos lockers',
        texto:
          'Várias atrações exigem guardar tudo em locker antes de embarcar — inclusive o ' +
          'celular —, e três delas têm detector de metal na entrada. Isso custa 10 a 15 ' +
          'minutos por atração, que a duração dos blocos não conta. O locker padrão é ' +
          'gratuito pelo tempo da fila mais a duração da atração; o grande é pago, de US$ 3 a ' +
          '6 conforme a fonte.\n\n' +
          'Detector de metal, nada nos bolsos: Hulk, VelociCoaster e Stardust Racers.\n\n' +
          'Locker obrigatório, sem detector: Revenge of the Mummy, Hagrid’s, Forbidden ' +
          'Journey, Gringotts, Men in Black, Monsters Unchained e Hiccup’s Wing Gliders.\n\n' +
          'Pochete de três pontos presa na cintura costuma ser liberada no Hagrid’s, a ' +
          'critério do funcionário. Nos três do detector de metal, não adianta tentar.',
        pesquisa: '2026-09-08',
        fonte: 'orlandoinformer.com/universal/rental-ride-lockers',
      },
    },
  },

  /* ---------------------------------------------------------------------------
     OS DIAS
     `duracaoMin` = tempo DENTRO do bloco: fila mais experiência. NÃO inclui a
                    caminhada até o próximo — essa o app calcula pela topografia
                    do parque e soma por fora. Bloco de `deslocamento` é a
                    exceção: ele já É a travessia.
     `descricao` = o que fazer, em uma linha. É o que o app mostra em destaque.
     `contexto`  = pesquisa minha, para quem nunca foi. Pode apagar à vontade.
     ------------------------------------------------------------------------ */
  dias: [

  /* ===== 10/11 · TERÇA · CHEGADA ========================================== */
  /* DIA FECHADO — revisado em 08/09/2026 com os voos reais.                  */
  {
    id: 'd-2026-11-10',
    data: '2026-11-10',
    diaSemana: 'terça',
    emoji: '🛬',
    titulo: 'Chegada',
    subtitulo: 'GIG → Bogotá → MCO · Walmart · Disney Springs',
    tipo: 'logistica',
    operadora: null,
    parqueId: null,
    historiaLocalId: 'disney-springs',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-09',

    // A âncora é a SAÍDA DO TERMINAL C, não o pouso. O que decide o dia não é a
    // hora em que o avião toca o chão: é a hora em que eles saem com as malas na
    // mão, depois de uma fila de imigração que vai de 40 min a 2h. Ancorar no
    // pouso obrigava a digitar uma hora de pouso falsa para empurrar a tarde.
    referencia: { rotulo: 'Saída do Terminal C', padrao: '14:15', confirmado: false },
    rotaOrigemLocalId: 'mco',

    resumo:
      'O dia mais fácil de salvar da viagem inteira: não tem ingresso, não tem hora de ' +
      'parque, e o único compromisso de relógio é o jantar às 19h. Tudo o mais é ' +
      'sacrificável sem perda real — inclusive o Disney Springs, porque vocês voltam lá ' +
      'numa noite mais adiante, quando estiver decorado de Natal.',

    avisos: [
      'O dia começa na véspera: com decolagem 01h40, vocês precisam estar no GIG por volta ' +
      'das 22h30 de 09/11.',
      'Roaming: com o Passaporte Américas o celular deve conectar sozinho ao pousar. Se ' +
      'não conectar em 10 minutos, liguem e desliguem o modo avião e confiram se o ' +
      'roaming de dados está ligado nos ajustes.',
      'SE NÃO HOUVER INTERNET DE JEITO NENHUM: o wifi do aeroporto (MCO Public WiFi, ' +
      'aberto) resolve para chamar o Uber ainda dentro do terminal. E se nem isso, o ' +
      'balcão de Ground Transportation fica no mesmo nível da bagagem e põe vocês num ' +
      'táxi oficial — mais caro (uns US$ 65 a 75 até a 192), mas não depende de rede. ' +
      'Levem o endereço do hotel escrito: 5367 W Irlo Bronson Memorial Hwy, Kissimmee.',
    ],

    notas: [
      { tipo: 'bom', texto:
        'CONEXÃO EM BOGOTÁ — 2h20, SEM IMIGRAÇÃO. A Avianca confirmou em 11/09: na conexão ' +
        'internacional vocês não entram na Colômbia. Sigam as placas de conexão até o ' +
        'controle de segurança de trânsito e dali para o portão. O mínimo oficial para ' +
        'internacional-internacional em El Dorado é 1h30, então sobra folga. Sem imigração, ' +
        'o Check-MIG não se aplica.',
        pesquisa: '2026-09-11' },
      { tipo: 'bom', texto:
        'CONFIRMADO em 08/09: é bilhete único. A bagagem vai despachada de ponta a ponta ' +
        'até Orlando e em Bogotá vocês passam pelo controle de segurança de trânsito e seguem ' +
        'para o portão — sem retirar e sem redespachar mala. Isso tira o único cenário em que ' +
        'as 2h20 de conexão ficariam apertadas.' },
      { tipo: 'bom', texto:
        'Voos internacionais chegam no Terminal C do MCO, que é novo e rápido. O ponto de ' +
        'Uber fica no NÍVEL 6 do Terminal C, sinalizado como "Rideshare Pickup". Só peçam a ' +
        'corrida depois de pegar as malas — o motorista tem poucos minutos de espera.',
        pesquisa: '2026-09-08' },
      { tipo: 'atencao', texto:
        'Check-in do hotel costuma ser só a partir das 15h. Se chegarem antes, deixem as ' +
        'malas na recepção e sigam para o Walmart — não fiquem esperando no saguão.' },
    ],

    /* ---------------------------------------------------------------------
       PLANOS A / B / C — o dia decide-se na fila da imigração do MCO
       ------------------------------------------------------------------ */
    planos: [
      {
        letra: 'A',
        titulo: 'Tudo no horário',
        gatilho: 'Vocês saem do Terminal C até as 14h15.',
        passos: [
          'Uber para o hotel, deixar malas, check-in se já liberou.',
          'Walmart com calma — a lista completa, 45 min. Fica a 4 min do hotel.',
          'Comer alguma coisa ao voltar — vocês não comem desde o avião.',
          'Disney Springs às 17h20, com 1h40 antes do jantar.',
          'The Boathouse 19h. Voltar 21h.',
        ],
      },
      {
        letra: 'B',
        titulo: 'Imigração demorou',
        gatilho: 'Vocês saem do Terminal C entre 14h15 e 16h00.',
        passos: [
          'Corta o Walmart para os sete essenciais do bloco: água, protetor solar, capa de ' +
          'chuva, curativo de bolha, power bank, ibuprofeno e barrinhas. 20 minutos, sem ' +
          'passear pelos corredores. A volta ao hotel continua obrigatória, senão vocês ' +
          'carregam o fardo a noite inteira — e são só 8 minutos de carro no total, então ' +
          'cabe mesmo com o dia atrasado.',
          'O resto da lista fica para o dia 12: o Walmart está a 4 minutos do hotel, na ' +
          'volta do outlet.',
          'Disney Springs direto, mesmo que chegue só 18h. Uma hora lá dentro já dá o ' +
          'World of Disney e a beira da água.',
          'O jantar das 19h não se mexe. É a única hora marcada do dia.',
        ],
      },
      {
        letra: 'B2',
        titulo: 'A bagagem não chegou',
        gatilho: 'A mala não sai na esteira do Terminal C.',
        passos: [
          'Abram o processo ali mesmo, no balcão da companhia dentro da área de ' +
          'bagagem. Saindo sem protocolo, resolver depois vira telefonema internacional.',
          'Guardem o número do protocolo. O endereço e o telefone do hotel estão no ' +
          'Guia: 5367 W Irlo Bronson Memorial Hwy, +1 407-449-2357. Eles entregam no ' +
          'hotel quando a mala aparece, normalmente no voo seguinte.',
          'O Walmart deixa de ser conveniência e vira necessidade: somem escova de ' +
          'dentes, desodorante, uma muda de roupa e o que for de uso diário. Fica a ' +
          '4 minutos do hotel, então dá para voltar amanhã se faltar alguma coisa.',
          'O resto do dia segue igual. Isso atrasa vocês, não cancela nada.',
        ],
      },
      {
        letra: 'C',
        titulo: 'Saíram do terminal depois das 16h',
        gatilho: 'Vocês saem do Terminal C depois das 16h, perderam a conexão em Bogotá, ' +
                 'ou foram remarcados.',
        passos: [
          'PRIMEIRA COISA: cancelem o The Boathouse assim que souberem — +1 407-939-3463, ' +
          'ou pelo My Disney Experience. Com menos de 2 horas de antecedência a Disney ' +
          'cobra a taxa de não comparecimento no cartão. Os telefones estão no Guia.',
          'Esqueçam o Disney Springs hoje. Vocês voltam na noite de 25/11, e a volta é ' +
          'melhor: tem o Christmas Tree Stroll e a decoração de Natal, que hoje ainda não ' +
          'existe.',
          'Uber para o hotel. Jantem na 192 mesmo — Black Angus ou Miller’s Ale House, os ' +
          'dois de mesa.',
          'Os sete essenciais do Walmart não esperam: o dia 11 sai às 6h45 contando com ' +
          'água, protetor, capa, power bank e barrinhas. O Walmart fica a 4 minutos do hotel ' +
          'e o Publix ao lado abre até as 23h. O resto da lista fica para o dia 12.',
          'Depois, durmam. O dia 11 é Magic Kingdom com saída às 6h45 e é ele que vocês não ' +
          'podem estragar.',
        ],
      },
    ],

    /* ---------------------------------------------------------------------
       LISTA DO WALMART — montada a partir do que os 16 dias exigem
       ------------------------------------------------------------------ */
    listas: [
      {
        id: 'lista-walmart',
        titulo: 'Walmart Supercenter — a compra que abastece a viagem inteira',
        intro:
          'É a parada que mais economiza dinheiro na viagem. A lista está na ORDEM DA LOJA — ' +
          'Bebidas, Farmácia, Alimentos, Eletrônicos, Casa — para vocês não cruzarem o ' +
          'Supercenter duas vezes. Garrafa de água dentro do parque custa US$ 4 a 6; capa de ' +
          'chuva, uns US$ 10 lá dentro e US$ 1 aqui.\n\n' +
          'REFEIÇÕES NO QUARTO: o quarto tem cafeteira, micro-ondas e frigobar. Em Alimentos ' +
          'estão o café da manhã dos dias de saída cedo e o jantar das noites que terminam ' +
          'tarde — nada congelado e nada de fast food.\n\n' +
          'A marca própria do Walmart — Great Value para comida, Equate para farmácia — ' +
          'resolve quase tudo mais barato. Onde a marca de verdade importa, está dito. ' +
          'Essenciais são os que, se faltarem, vocês vão comprar caro depois.',
        itens: [
          { id: 'agua', secao: 'Bebidas', essencial: true,
            texto: 'Água — caixa de 24 garrafas',
            marca: 'Great Value Purified Water', alternativaBarata: null,
            motivo: 'Para o quarto e para encher os dois soft flasks antes de sair; no parque, a ' +
                    'água gelada grátis dos balcões completa. Não paguem por Dasani nem Aquafina: é a ' +
                    'mesma água purificada. 24 bastam.' },
          { id: 'isotonico', secao: 'Bebidas', essencial: true,
            texto: 'Isotônico',
            marca: 'Gatorade Zero', alternativaBarata: 'em pó: Propel Powder Packets',
            motivo: 'Doze horas em pé desidratam mais do que parece. O Zero não tem açúcar e ' +
                    'não empapuça. O pó ocupa menos espaço: um sachê num dos soft flasks.' },
          { id: 'cafe', secao: 'Bebidas', essencial: false,
            texto: 'Café — para a cafeteira do quarto',
            marca: 'Dunkin’ Original Blend moído, ou Dunkin’ K-Cups', alternativaBarata: 'Folgers',
            motivo: 'É o café dos dias de saída cedo, antes de o café da manhã do hotel abrir. ' +
                    'Confiram o tipo da cafeteira: a de filtro pede o moído, a Keurig pede cápsula.' },

          { id: 'ibuprofeno', secao: 'Farmácia', essencial: true,
            texto: 'Ibuprofeno',
            marca: 'Equate Ibuprofen 200mg', alternativaBarata: null,
            motivo: 'É o Advil com a marca do Walmart, bem mais barato. Para dor muscular e de ' +
                    'pé no fim do dia de parque.' },
          { id: 'paracetamol', secao: 'Farmácia', essencial: true,
            texto: 'Paracetamol',
            marca: 'Equate Extra Strength Acetaminophen 500mg', alternativaBarata: null,
            motivo: 'É o Tylenol. Nos EUA o nome no rótulo é acetaminophen, não paracetamol — ' +
                    'procurem por esse. É de outra classe que o ibuprofeno.' },
          { id: 'protetor-solar', secao: 'Farmácia', essencial: true,
            texto: 'Protetor solar + bastão para o rosto',
            marca: 'Neutrogena Ultra Sheer Dry-Touch SPF 70 · bastão Neutrogena Ultra Sheer Face Stick',
            alternativaBarata: 'Equate Sport SPF 50',
            motivo: 'O bastão é para reaplicar na fila sem sujar a mão. Evitem spray como ' +
                    'protetor principal: quase ninguém aplica a quantidade suficiente.' },
          { id: 'protetor-labial', secao: 'Farmácia', essencial: false,
            texto: 'Protetor labial com FPS',
            marca: 'Sun Bum SPF 30', alternativaBarata: null,
            motivo: 'O item pequeno que ninguém lembra, e que resolve o lábio rachado depois ' +
                    'de três dias de sol e vento.' },
          { id: 'bolha', secao: 'Farmácia', essencial: true,
            texto: 'Curativo de bolha e protetor preventivo',
            marca: 'Band-Aid Hydro Seal Blister Cushions · Dr. Scholl’s Moleskin Plus',
            alternativaBarata: null,
            motivo: 'São 16 dias andando 15 a 25 mil passos. O Hydro Seal é hidrocoloide: sela a ' +
                    'bolha e deixa continuar andando. O Moleskin se recorta e cola ANTES de a ' +
                    'bolha aparecer, onde o tênis costuma incomodar.' },
          { id: 'anti-atrito', secao: 'Farmácia', essencial: false,
            texto: 'Anti-atrito',
            marca: 'Body Glide Original', alternativaBarata: 'vaselina',
            motivo: 'Assadura de coxa em dia de 25 mil passos é real. Vem em bastão, como ' +
                    'desodorante.' },
          { id: 'antiacido', secao: 'Farmácia', essencial: false,
            texto: 'Antiácido',
            marca: 'Tums · Pepto-Bismol mastigável', alternativaBarata: 'Equate',
            motivo: 'A porção americana e o horário de refeição fora do normal.' },
          { id: 'lenco', secao: 'Farmácia', essencial: false,
            texto: 'Lenço umedecido antibacteriano',
            marca: 'Wet Ones Antibacterial', alternativaBarata: null,
            motivo: 'Mão suja de fila antes de comer num banco de praça.' },

          { id: 'comer-agora', secao: 'Alimentos', essencial: true,
            texto: 'Algo para comer agora',
            marca: null, alternativaBarata: null,
            motivo: 'São seis horas entre o pouso e o jantar. Peguem algo para comer na volta ' +
                    'ao hotel, não só para os dias de parque.' },
          { id: 'aveia', secao: 'Alimentos', essencial: false,
            texto: 'Aveia instantânea — café da manhã no quarto',
            marca: 'Quaker Instant Oatmeal, Original ou Lower Sugar', alternativaBarata: 'Great Value',
            motivo: 'Água quente da cafeteira ou um minuto no micro-ondas, e vocês saem para o ' +
                    'rope drop com comida de verdade no estômago — sem depender de o café da ' +
                    'manhã do hotel já estar aberto.' },
          { id: 'pao-pasta', secao: 'Alimentos', essencial: false,
            texto: 'Pão integral e pasta de amendoim',
            marca: 'Dave’s Killer Bread · Jif Natural', alternativaBarata: 'Great Value',
            motivo: 'O café mais rápido que existe, sem geladeira: pão, pasta de amendoim e uma ' +
                    'fruta. Serve também de lanche na volta de uma noite longa.' },
          { id: 'iogurte', secao: 'Alimentos', essencial: false,
            texto: 'Iogurte grego — para o frigobar do quarto',
            marca: 'Chobani', alternativaBarata: 'Great Value',
            motivo: 'Proteína no café da manhã dos dias de saída cedo, em um minuto. O frigobar ' +
                    'do quarto é pequeno: comprem pouco de cada vez.' },
          { id: 'barebells', secao: 'Alimentos', essencial: true,
            texto: 'Barrinha de proteína',
            marca: 'Barebells — Cookies & Cream ou Caramel Cashew', alternativaBarata: 'Pure Protein',
            motivo: 'Segura mais que barrinha de cereal e não derrete na mochila.' },
          { id: 'barrinha-fruta', secao: 'Alimentos', essencial: true,
            texto: 'Barrinha de cereal e fruta',
            marca: 'KIND Nuts & Spices', alternativaBarata: 'Nature Valley Protein',
            motivo: 'Para comer no caminho ou na fila do rope drop. Maçã aguenta o dia inteiro na ' +
                    'mochila; banana não.' },
          { id: 'castanha', secao: 'Alimentos', essencial: false,
            texto: 'Castanha',
            marca: 'Blue Diamond Almonds', alternativaBarata: 'Planters',
            motivo: 'Lanche que não amassa nem derrete.' },
          { id: 'jerky', secao: 'Alimentos', essencial: false,
            texto: 'Beef jerky',
            marca: 'Jack Link’s Original', alternativaBarata: null,
            motivo: 'Proteína que não estraga na mochila e segura a fome entre refeições ' +
                    'espaçadas. O Chomps vem em bastão individual, mais fácil de levar no bolso.' },
          { id: 'arroz-micro', secao: 'Alimentos', essencial: false,
            texto: 'Arroz pronto de micro-ondas — jantar no quarto',
            marca: 'Ben’s Original Ready Rice, integral', alternativaBarata: 'Great Value',
            motivo: 'Noventa segundos no micro-ondas do quarto. Com o atum ou o frango em sachê ' +
                    'por cima, é um jantar de verdade nas noites que terminam tarde.' },
          { id: 'proteina-sache', secao: 'Alimentos', essencial: false,
            texto: 'Atum ou frango em sachê',
            marca: 'StarKist', alternativaBarata: 'Great Value',
            motivo: 'Proteína pronta que não precisa de geladeira nem de abridor. Vai por cima do ' +
                    'arroz ou dentro do pão.' },
          { id: 'sopa', secao: 'Alimentos', essencial: false,
            texto: 'Sopa pronta',
            marca: 'Progresso', alternativaBarata: 'Great Value',
            motivo: 'Para a noite fria depois do Epcot ou da volta de Tampa. Esquenta no ' +
                    'micro-ondas — numa tigela, que está na seção Casa.' },

          { id: 'power-bank', secao: 'Eletrônicos', essencial: true,
            texto: 'Power bank — um por pessoa',
            marca: 'Anker Nano Power Bank, com cabo USB-C embutido', alternativaBarata: 'onn. 10000mAh',
            motivo: 'Este app, o da Disney, o da Universal, mapa e foto o dia todo. O modelo com ' +
                    'cabo embutido elimina o cabo esquecido no hotel. Um por pessoa: dividir ' +
                    'power bank em dia de parque não funciona.' },
          { id: 'adaptador', secao: 'Eletrônicos', essencial: true,
            texto: 'Adaptador de tomada — 2 unidades',
            marca: null, alternativaBarata: null,
            motivo: 'O plugue brasileiro não entra na tomada americana. A voltagem não é problema ' +
                    '(carregador moderno é bivolt), o formato é. Se trouxeram do Brasil, ignorem.' },
          { id: 'filtro-linha', secao: 'Eletrônicos', essencial: false,
            texto: 'Filtro de linha com portas USB',
            marca: 'onn. ou Belkin — com USB', alternativaBarata: null,
            motivo: 'Quarto de hotel tem tomada de menos, e são dois celulares e duas power banks ' +
                    'toda noite. O filtro americano entra direto na tomada, sem adaptador. O ' +
                    'ganho está nas portas USB: o cabo liga direto nelas, sem o carregador ' +
                    'brasileiro — e para isso nem precisa de adaptador.' },
          { id: 'cabo', secao: 'Eletrônicos', essencial: false,
            texto: 'Cabo extra',
            marca: 'Anker', alternativaBarata: 'onn.',
            motivo: 'Um cabo a mais resolve o dia em que um resolver morrer.' },

          { id: 'utensilios', secao: 'Casa', essencial: false,
            texto: 'Tigela de micro-ondas, talheres e guardanapos',
            marca: null, alternativaBarata: 'versão descartável',
            motivo: 'Micro-ondas de quarto de hotel pode vir sem louça. Sem tigela, a aveia, o ' +
                    'arroz e a sopa não servem de nada.' },
          { id: 'sabao', secao: 'Casa', essencial: false,
            texto: 'Sabão de lavanderia + moedas de 25 centavos, se forem lavar roupa',
            marca: 'Tide Pods, embalagem pequena', alternativaBarata: null,
            motivo: 'O Travelodge tem lavanderia de moeda, e são 16 dias de viagem. A moeda ' +
                    'de 25 centavos (quarter) é a que a máquina usa. O roteiro não marca dia: ' +
                    'vocês decidem quando lavar, e as manhãs livres dos dias 18 e 24 são as ' +
                    'candidatas naturais.' },
          { id: 'ziploc', secao: 'Casa', essencial: false,
            texto: 'Sacos Ziploc grandes',
            marca: 'Ziploc, tamanho gallon', alternativaBarata: 'Great Value',
            motivo: 'Celular nas atrações que molham, roupa molhada, troco — e o que sobrar da ' +
                    'comida do quarto.' },
          { id: 'capa-chuva', secao: 'Casa', essencial: true,
            texto: 'Capas de chuva descartáveis — 8 unidades',
            marca: null, alternativaBarata: null,
            motivo: 'São TRÊS atrações que molham de verdade, e vocês são dois: Kali River ' +
                    'Rapids no dia 16, Journey to Atlantis no 22 e Jurassic Park River ' +
                    'Adventure no 23. Seis usos e duas de reserva para chuva. Procurem ' +
                    '"disposable rain poncho" na seção de camping.' },
          { id: 'meias', secao: 'Casa', essencial: true,
            texto: 'Meias de secagem rápida — 3 pares',
            marca: 'Balega Hidden Comfort, se tiver na loja', alternativaBarata: 'Hanes X-Temp ou Athletic Works',
            motivo: 'Meia molhada depois do Jurassic Park significa pé macerado até a noite. A ' +
                    'Balega é vendida no site do Walmart, mas o estoque na loja não está ' +
                    'confirmado — se não tiver, a Hanes resolve.' },
        ],
      },    ],

    /* ---------------------------------------------------------------------
       DISNEY SPRINGS — o que cabe em 1h30 e o que fica para a volta
       ------------------------------------------------------------------ */
    naoPerca: [
      { nome: 'World of Disney', quando: 'hoje', custo: 'grátis entrar',
        motivo: 'A maior loja Disney do mundo. Os fundos da loja têm o que quase nenhum ' +
                'turista acha — vale atravessar até o final em vez de parar na primeira sala.' },
      { nome: 'A beira da água ao pôr do sol', quando: 'hoje', custo: 'grátis',
        motivo: 'O sol se põe às 17h35 em novembro. Vocês chegam exatamente na hora certa: ' +
                'pegam a luz do fim de tarde e depois a iluminação acendendo.' },
      { nome: 'Gideon’s Bakehouse', quando: 'hoje', condicao: 'se a fila deixar',
        custo: '~US$ 6 o cookie',
        motivo: 'Cookie de meia libra, uns 225 g, e a fama é justificada. A fila é longa e costuma ter espera ' +
                'virtual pelo app — entrem na lista assim que chegarem e passeiem enquanto isso.',
        pesquisa: '2026-09-08' },
      { nome: 'Amphicar Tour', quando: 'descartado', custo: 'US$ 125 por carro',
        motivo: 'Fica de fora pelo preço. Um carro dos anos 60 que entra no lago com vocês ' +
                'dentro, 20 minutos: US$ 62 por cabeça por 20 minutos não passa no teste.',
        pesquisa: '2026-09-08' },
      { nome: 'Aerophile — balão cativo', quando: 'na volta', custo: '~US$ 25',
        motivo: 'Sobe 120 m preso por cabo, 8 minutos, vista de até 16 km. Não voa com vento ' +
                'forte, então nunca dá para contar com ele.',
        pesquisa: '2026-09-08' },
      { nome: 'Christmas Tree Stroll', quando: 'na volta', condicao: 'só existe a partir de 13/11',
        custo: 'grátis',
        motivo: 'A decoração de Natal do Disney Springs começa em 13/11. Hoje não existe — ' +
                'e é por isso que vocês voltam ao Disney Springs na noite de 25/11, a última ' +
                'da viagem.' },
    ],

    /* ---------------------------------------------------------------------
       O QUE DEIXAR PRONTO HOJE PARA AMANHÃ
       O dia 11 sai às 6h45 e é o mais denso da viagem. Tudo o que dá para
       resolver hoje à noite, resolvam hoje — às 5h45 ninguém procura nada.
       ------------------------------------------------------------------ */
    prepararAmanha: {
      paraODia: '2026-11-11',
      titulo: 'Magic Kingdom · alarme 5h45, saída 6h45',
      aviso:
        'Vocês vão dormir depois de quase 24 horas acordados e acordar em menos de ' +
        'sete. Cada item resolvido hoje é um problema que não existe às 5h45.',
      itens: [
        { texto: 'Alarme para 5h45 nos DOIS celulares', critico: true,
          motivo: 'Saída às 6h45. Um alarme só falha — modo silencioso, bateria, ' +
                  'cochilo. Dois alarmes em aparelhos diferentes, não dois no mesmo.' },

        { texto: 'Celular e power bank carregando a noite inteira', critico: true,
          motivo: 'O dia 11 vai das 6h45 às 22h. Celular morto às 16h é o roteiro, ' +
                  'o Lightning Lane e o mobile order perdidos de uma vez.' },

        { texto: 'My Disney Experience: login feito, ingressos vinculados e os dois no mesmo grupo',
          critico: true,
          motivo: 'Sem isso vocês não entram no parque nem usam Lightning Lane. ' +
                  'Resolver na fila da catraca às 7h45 é o pior lugar possível — e se o ' +
                  'ingresso não vincular, é caso de ligar para a agência, o que não dá ' +
                  'para fazer amanhã de manhã.' },

        { texto: 'Conferir se as reservas de Lightning Lane do dia 11 aparecem no app',
          critico: true,
          motivo: 'Compradas em 08/11, e são só três: Peter Pan na lista alta, Mansão e ' +
                  'Buzz na baixa. Single Pass nenhum — os dois ficam como plano B pago. ' +
                  'Big Thunder, Jungle Cruise e Space Mountain não estão aí de propósito: ' +
                  'os dois primeiros vocês fazem no standby antes das 11h, e o Space entra ' +
                  'rolando depois que usarem a Mansão. As reservas dos dias 13 e 15 também ' +
                  'aparecem, porque tudo saiu na mesma compra. Se alguma faltar, hoje ainda ' +
                  'dá tempo de rever o plano. Amanhã às 9h, não.' },

        { texto: 'Conferir que a referência do dia 11 continua em 9h — o oficial é 9h às 22h',
          critico: true,
          motivo: 'O horário saiu em 12/09: 9h às 22h, com Early Entry às 8h30. A ' +
                  'referência do dia já está certa — isto aqui é só para ninguém embarcar ' +
                  'com ela deslocada por engano. O desfile e os fogos ficam parados de ' +
                  'qualquer jeito.' },

        { texto: 'Cartão cadastrado no My Disney Experience para mobile order',
          motivo: 'Almoço no Columbia Harbour House e jantar no Casey’s são os dois de ' +
                  'balcão. Com mobile order vocês pulam a fila; sem cartão salvo, não pulam.' },

        { texto: 'Mochila montada e deixada na porta', critico: true,
          motivo: 'Os dois soft flasks cheios com a água do fardo, barrinhas, protetor solar, ' +
                  'power bank e cabo. Montar hoje evita abrir mala às 6h.\n\n' +
                  'E UMA CAMADA LEVE PARA CADA UM. Amanhã vocês saem às 6h45 com uns 15°C, ' +
                  'ao meio-dia faz 27 e às 20h, parados na Main Street esperando os fogos, ' +
                  'volta para 16. A camada sai vestida, passa a tarde na mochila e volta ' +
                  'antes dos fogos.' },

        { texto: 'Roupa e tênis separados fora da mala',
          motivo: 'Puramente para não procurar nada no escuro às 5h45.' },

        { texto: 'Uber de amanhã: o destino é o TTC, não “Magic Kingdom”',
          motivo: 'O Magic Kingdom é o único parque sem acesso direto de carro. O Uber ' +
                  'para no Ticket & Transportation Center e de lá ainda são 15 a 20 min de ' +
                  'monotrilho ou barco. Quem digita “Magic Kingdom” no app é levado ' +
                  'para o lugar errado e perde o rope drop.' },

        { texto: 'Dormir', critico: true,
          motivo: 'É o item mais importante da lista. A mala desfeita pode esperar; o ' +
                  'rope drop do dia 11, não.' },
      ],
    },

    blocos: [
      { id: 'b-1011-0140', hora: '01:40', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voo GIG → Bogotá',
        descricao: 'Decolagem 01h40 · pouso 06h00 em Bogotá',
        fuso: 'Rio',
        contexto:
          'Cerca de 6h20 de voo, à noite. Durmam o que der: vocês só vão deitar de novo ' +
          'em Orlando, quase 24 horas depois de sair de casa. Máscara de olho e água.',
        localId: null, acesso: [], duracaoMin: 380 },

      { id: 'b-1011-0600', hora: '06:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Conexão em Bogotá — El Dorado',
        descricao: '2h20 de conexão. Sem imigração: controle de segurança e portão',
        fuso: 'Bogotá',
        contexto:
          'A conexão internacional não entra na Colômbia — confirmado com a Avianca em ' +
          '11/09. Sigam as placas de conexão até o controle de segurança de trânsito, que ' +
          'costuma andar em 5 a 10 minutos, e dali para o portão. Sobra tempo para um café. ' +
          'A conexão internacional da Avianca costuma sair do Terminal 1.',
        acesso: [], critico: true, duracaoMin: 140, pesquisa: '2026-09-11' },

      { id: 'b-1011-0820', hora: '08:20', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voo Bogotá → Orlando',
        descricao: 'Decolagem 08h20 · pouso 12h35 no MCO',
        fuso: 'Bogotá',
        contexto:
          'Cerca de 4h15. Preencham a declaração de alfândega em papel se distribuírem a ' +
          'bordo — resolve tempo na chegada. Bogotá não tem pré-inspeção americana, então ' +
          'a imigração dos EUA é toda em Orlando.',
        acesso: [], duracaoMin: 255 },

      { id: 'b-1011-1235', hora: '12:35', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Pouso no MCO — Terminal C',
        descricao: 'Internacionais chegam no Terminal C',
        fuso: 'Orlando',
        contexto:
          'A hora do pouso não move o dia sozinha — o que move é a hora de SAIR do ' +
          'terminal, que é a referência lá em cima. Se o voo atrasar, somem o atraso à ' +
          'saída prevista e ajustem a referência: a tarde inteira desloca junto, menos o ' +
          'jantar, que tem hora marcada.',
        localId: 'mco', acesso: [], pesquisa: '2026-09-08', duracaoMin: 15 },

      { id: 'b-1011-1250', hora: '12:50', ancora: 'fixo', tipo: 'espera',
        titulo: 'Imigração, bagagem e alfândega',
        descricao: 'De 40 min a 2h. É esta fila que decide se o dia é plano A, B ou C',
        contexto:
          'A caminhada do portão até a esteira já leva de 15 a 25 minutos no Terminal C. ' +
          'Enquanto esperam, olhem o relógio: saindo até 14h15 é plano A; até 16h é plano ' +
          'B; depois das 16h, plano C.\n\n' +
          'QUANDO SOUBEREM A HORA REAL DE SAIR, ponham ela na referência lá em cima. A ' +
          'tarde inteira desloca junto e o app avisa em vermelho o que deixou de caber ' +
          'antes do jantar.',
        localId: 'mco', acesso: [], critico: true, duracaoMin: 85 },

      { id: 'b-1011-1415', hora: '14:15', ancora: 'referencia', tipo: 'tarefa',
        titulo: 'Confirmar a internet e chamar o Uber',
        descricao: 'Rideshare Pickup no NÍVEL 6 do Terminal C',
        contexto:
          'Os dois planos têm o uso internacional incluído e os celulares devem conectar ' +
          'sozinhos ao pousar. Confiram os DOIS aparelhos ANTES de descer para o nível 6 — ' +
          'se algum não conectar, o wifi do MCO resolve enquanto vocês ligam o roaming de ' +
          'dados nos ajustes.\n\n' +
          'E só chamem a corrida depois de estarem com as malas na mão: o motorista tem ' +
          'poucos minutos de tolerância e cancela.',
        localId: 'mco', acesso: [], critico: true, pesquisa: '2026-09-08', duracaoMin: 30 },

      { id: 'b-1011-1445', hora: '14:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Uber para o hotel',
        descricao: '~30 min, US$ 35–45',
        contexto:
          'Saindo 14h45 com ~30 min de corrida, vocês chegam por volta das 15h15 — com o ' +
          'check-in já aberto, sem espera. Subam, larguem as malas e desçam: o Walmart é ' +
          'a quatro minutos daqui.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 30 },

      { id: 'b-1011-1500', hora: '15:15', ancora: 'referencia', tipo: 'tarefa',
        titulo: 'Check-in e largar as malas',
        descricao: 'O check-in abre às 15h. Vocês chegam 15h15',
        contexto:
          'Subam, larguem tudo e desçam. Não desfaçam mala agora — isso é para depois do ' +
          'jantar, ou para amanhã.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 20 },

      { id: 'b-1011-1530', hora: '15:35', ancora: 'referencia', tipo: 'compras',
        titulo: 'Walmart Supercenter — Vineland Rd',
        descricao: '4 min do hotel. 45 min de compras. Lista completa na ficha do dia',
        contexto:
          'A compra que abastece os 16 dias. Fica a 1,5 km do hotel — a corrida sai por ' +
          'US$ 7 a 10 e leva 4 minutos.\n\n' +
          'A LISTA ESTÁ NA ORDEM DA LOJA, seção por seção, para vocês não cruzarem o ' +
          'Supercenter duas vezes.\n\n' +
          'SE O DIA ESTIVER ATRASADO, comprem só estes, nesta ordem, e parem quando quiserem: ' +
          'água, protetor solar, capa de chuva, curativo de bolha, power bank, ibuprofeno e ' +
          'barrinhas. Esses sete resolvem os quatro dias seguintes.\n\n' +
          'O QUARTO TEM CAFETEIRA, MICRO-ONDAS E FRIGOBAR, e a lista traz o café da manhã e o ' +
          'jantar de emergência para eles.\n\n' +
          'A 600 METROS, NA MESMA VINELAND RD: o Publix de 3221 Vineland Rd, das 7h às 23h, com ' +
          'deli que faz sanduíche na hora.',
        endereco: '3250 Vineland Rd', localId: 'walmart-vineland', acesso: [], duracaoMin: 45 },

      { id: 'b-1011-1645', hora: '16:25', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel e guardar as compras',
        descricao: '4 min, US$ 7–10. Fardo de água não vai para o Disney Springs',
        contexto:
          'Esta volta existe por um motivo só: ninguém anda pelo Disney Springs com uma ' +
          'caixa de 24 garrafas. Guardem tudo, separem só o que vai para o dia 11 — os soft ' +
          'flasks cheios, protetor solar e barrinhas na mochila — e saiam de novo.\n\n' +
          'Essa ida e volta custa ~US$ 16 no total e come 8 minutos de carro.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 5 },

      { id: 'b-1011-1625', hora: '16:30', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Comer alguma coisa',
        descricao: 'Do que acabou de ser comprado. 6h desde o pouso',
        contexto:
          'Vocês pousam 12h35 e só sentam para jantar às 19h. Descontando a refeição do ' +
          'avião, são seis a oito horas sem comer, num dia em que já estão sem dormir.\n\n' +
          'Não é refeição — é não chegar no Disney Springs irritado às 17h20 com o jantar ' +
          'ainda a duas horas de distância. Barrinha, fruta, o que for, do que acabou de ' +
          'sair da sacola. Comam enquanto guardam as compras.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 20 },

      { id: 'b-1011-1710', hora: '16:55', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair para o Disney Springs',
        descricao: 'Uber, ~20 min, US$ 15–25. Pôr do sol às 17h35',
        contexto:
          'Entrada livre, sem ingresso e sem catraca. Vocês chegam junto com o pôr do sol, ' +
          'que é a melhor hora do lugar.',
        localId: 'disney-springs', acesso: [], duracaoMin: 25 },

      { id: 'b-1011-1745', hora: '17:20', ancora: 'referencia', tipo: 'compras',
        titulo: 'The Landing → Marketplace → Town Center',
        descricao: 'World of Disney é a maior loja Disney do mundo',
        contexto:
          'São 1h25 de loja e 15 minutos de folga antes da mesa — o Boathouse pede que ' +
          'vocês cheguem 15 minutos antes, e esse tempo está aqui dentro. Dá para o World ' +
          'of Disney sem correr e ainda pegar o pôr do sol às 17h35 na beira da água.',
        localId: 'disney-springs', acesso: [], duracaoMin: 85,
        curiosidades: [
          { texto: 'O barco a vapor da The Landing é um prédio com fundação de concreto. Foi o ' +
                   'Empress Lilly, batizado em 1977 pela Lillian Disney, viúva do Walt, e hoje ' +
                   'abriga o restaurante Paddlefish.',
            fonte: 'D23; MousePlanet', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1011-1900', hora: '19:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — The Boathouse',
        descricao: 'Frutos do mar e carnes na beira da água, no The Landing',
        contexto:
          'Frutos do mar e carnes na beira da água, no The Landing. Cheguem 15 minutos ' +
          'antes. HORÁRIO FIXO: não desloca nem se o voo atrasar — se o dia virar plano C, ' +
          'cancelem em vez de perder a reserva por não comparecimento.',
        restauranteId: 'r-boathouse', localId: 'disney-springs', acesso: ['reserva'],
        critico: true, duracaoMin: 90,
        curiosidades: [
          { texto: 'Os carros que entram na água são Amphicars, fabricados na Alemanha entre ' +
                   '1961 e 1968. Foram menos de 4 mil, e hoje sobram menos de 400 no mundo.',
            fonte: 'AllEars', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1011-2100', hora: '21:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Uber, ~20 min, US$ 15–25. Amanhã sai às 6h45',
        contexto:
          'Não estiquem. O dia 11 começa às 6h45 e é o dia mais denso da primeira semana. ' +
          'Nada aqui justifica atrasar a volta — vocês revisitam o Disney Springs na noite ' +
          'de 25/11, decorado de Natal.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 45 },
    ],
    renuncias: null,
    ficha: null,
  },

  /* ===== 11/11 · QUARTA · MAGIC KINGDOM =================================== */
  /* DIA FECHADO — revisado em 09/09/2026. Tiana's fechada, TRON no rope drop,
     Big Thunder na lista alta e fogos às 20h: tudo verificado e anotado.      */
  {
    id: 'd-2026-11-11',
    data: '2026-11-11',
    diaSemana: 'quarta',
    emoji: '🏰',
    titulo: 'Magic Kingdom',
    subtitulo: 'O dia clássico · rope drop na Frontierland',
    tipo: 'parque',
    operadora: 'disney',
    parqueId: 'magic-kingdom',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-10',
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: true },

    resumo:
      'O parque mais visitado do mundo, e o dia com mais decisão por minuto da viagem. ' +
      'O dia inteiro se apoia em duas escolhas contraintuitivas: começar pela Frontierland ' +
      'em vez de correr para o TRON, e assistir ao desfile na Liberty Square para pegar o ' +
      'TRON enquanto a Main Street está travada. As duas existem porque vocês não têm ' +
      'Early Entry — e é isso que muda tudo.',

    avisos: [
      'O Uber deixa no TTC, não na entrada. Quem digita "Magic Kingdom" no app é levado ' +
      'para o lugar errado e perde o rope drop.',
      'NÃO CORRAM PARA O TRON NA ABERTURA. Sem Early Entry vocês chegam atrás da multidão ' +
      'que já está dentro do parque, e a fila passa de 90 minutos. O TRON é às 15h30, na ' +
      'janela do desfile, com a última hora como segunda chance.',
      'Não reservem Multi Pass para o que vocês vão fazer de graça na abertura. Big Thunder ' +
      'e Jungle Cruise são lista alta e saem no standby antes das 11h.',
    ],

    notas: [
      { tipo: 'atencao', texto:
        'HÁ UM DESFILE NOTURNO, o Disney Starlight: Dream the Night Away, que o mapa oficial ' +
        'destaca e este roteiro não usa. Nas noites de festa de Natal ele não roda, e 11/11 ' +
        'não é uma delas. Ele faz a mesma rota do desfile das 15h — ' +
        'Frontierland, Liberty Square, hub e Main Street — e corta o parque do mesmo jeito. ' +
        'Às 20h30 vocês estão na Fantasyland e às 21h25 na Tomorrowland, e a saída das 22h ' +
        'desce a Main Street. A hora dele em 11/11 está na pendência do desfile: se rodar ' +
        'perto das 21h, a Main Street estará tomada na hora de sair — e as filas do Seven ' +
        'Dwarfs e do TRON ficam ainda mais curtas enquanto ele passa.',
        pesquisa: '2026-09-15' },
      { tipo: 'atencao', texto:
        'A TIANA’S BAYOU ADVENTURE ESTARÁ FECHADA. Entra em reforma em 02/11, com volta ' +
        'prevista para dezembro, sem dia marcado. A Tiana’s Bayou General fecha junto; a ' +
        'Critter Co-Op fica aberta. Com ela fora, o alvo da Frontierland na abertura é o ' +
        'Big Thunder Mountain.',
        pesquisa: '2026-09-11' },

      { tipo: 'bom', texto:
        'VOCÊS FAZEM TRÊS LISTA ALTA GASTANDO UMA. Big Thunder e Jungle Cruise saem no ' +
        'standby antes das 11h, porque a Frontierland e a Adventureland ficam vazias na ' +
        'abertura. O Peter Pan é o único que não tem essa saída — ele é ruim de fila o dia ' +
        'inteiro — e é nele que vocês gastam a reserva de lista alta. O Space Mountain, que ' +
        'também é alta, entra na reserva rolante depois que vocês usam a Mansão às 11h.',
        pesquisa: '2026-09-10' },

      { tipo: 'atencao', texto:
        'OS FOGOS SÃO ÀS 20H, NÃO ÀS 21H. O horário de verão acaba em 01/11 e o Happily ' +
        'Ever After passa para 20h — mas o parque segue aberto até as 22h. Isso resolve de ' +
        'graça o problema da saída em massa: as vinte mil pessoas vão embora às 20h25 e ' +
        'sobram DUAS HORAS de parque com fila curta. É nelas que entram o Seven Dwarfs e a ' +
        'segunda chance do TRON. Hoje vocês ficam até as 22h — dá, porque amanhã não tem ' +
        'alarme.',
        pesquisa: '2026-09-09' },

      { tipo: 'atencao', texto:
        'O TRON TEM DUAS JANELAS BOAS, E NENHUMA DELAS É A ABERTURA. Ele perdeu a fila ' +
        'virtual e hoje é standby puro, mas não entra no Early Entry — o que significa que ' +
        'os hóspedes Disney já estão dentro do parque e disparam para cá às 9h. Quem vem de ' +
        'fora chega atrás e pega 90 minutos ou mais.\n\n' +
        'As duas janelas são: 15h30, durante o desfile, e a última hora antes de fechar. O ' +
        'roteiro usa a primeira e guarda a segunda como plano B.',
        pesquisa: '2026-09-10' },

      { tipo: 'bom', texto:
        'VERIFICADO: 11/11 não é noite de Mickey’s Very Merry Christmas Party. As noites de ' +
        'festa em novembro são 8, 9, 12, 13, 15, 17, 19, 20, 24, 25, 27 e 29 — nelas o parque ' +
        'fecha às 18h para quem não tem ingresso da festa. O dia de vocês vai até as 22h.',
        pesquisa: '2026-09-08' },
    ],

    /* --------------------------------------------------------------------- */
    planos: [
      {
        letra: 'A',
        titulo: 'O dia como está escrito',
        gatilho: 'Vocês estão no portão às 7h45 e o parque abre às 9h.',
        passos: [
          'FRONTIERLAND na abertura, não Tomorrowland. Big Thunder no standby, sem gastar passe.',
          'Piratas e Jungle Cruise em seguida, enquanto a Adventureland ainda está vazia.',
          'Mansão às 11h com o Multi Pass. Ao passar a catraca, reservem o Space Mountain — ' +
          'é o uso dessa primeira reserva que destrava a próxima e derruba a restrição de lista.',
          'Peter Pan às 13h20, que é a única lista alta que vale gastar passe.',
          'Desfile na LIBERTY SQUARE às 15h, e atravessar para a Tomorrowland assim que ele ' +
          'passar. O TRON às 15h30 é o ponto alto tático do dia.',
          'Seven Dwarfs às 20h30, depois dos fogos, quando a fila despenca.',
          'Sair pelo ferry às 22h.',
        ],
      },
      {
        letra: 'B',
        titulo: 'A fila do TRON estourou às 15h30',
        gatilho: 'Vocês chegam na Tomorrowland e o painel marca mais de 60 minutos.',
        passos: [
          'NÃO ENTREM. A janela do desfile é boa, mas não é mágica: se ela falhou, insistir ' +
          'custa a tarde inteira e vocês ainda têm a última hora.',
          'Puxem o Space Mountain e o Buzz para agora — os dois são ali do lado e vocês já ' +
          'têm reserva neles.',
          'O TRON passa para as 21h25, na última hora, que é a outra janela boa do dia. ' +
          'Depois dos fogos ele costuma cair bastante.',
          'SÓ SE AS DUAS FALHAREM: aí sim vale o Single Pass, US$ 20 a 23 por pessoa, ' +
          'comprado na hora pelo app. É esse o plano B pago — não é para ser comprado de ' +
          'antemão.',
        ],
      },
      {
        letra: 'B2',
        titulo: 'O parque não abre às 9h',
        gatilho: 'O oficial é 9h às 22h, mas a Disney ainda mexe no calendário perto da data.',
        passos: [
          'Mudem a referência do dia aqui no app. A MANHÃ INTEIRA desloca junto, inclusive a ' +
          'hora de sair do hotel.',
          'A TARDE NÃO DESLOCA. Do desfile em diante tudo é fixo, porque o que ancora a tarde ' +
          'é a hora do desfile, não a da abertura. É de propósito: se o TRON deslocasse junto, ' +
          'ele cairia antes do desfile e o truque do dia se desfaz.',
          'Regra que não muda: estar no portão 75 minutos antes do que a referência disser.',
          'Se abrir MAIS CEDO, a manhã acaba antes e sobra uma folga antes do desfile. Não ' +
          'fiquem parados esperando: repitam o Big Thunder ou o Piratas, que a essa altura ' +
          'ainda estão baratos, e voltem para a Liberty Square às 14h25.',
        ],
      },
      {
        letra: 'C',
        titulo: 'Chuva forte ou o dia desandou',
        gatilho: 'Chuva que não passa, cansaço, ou o dia atrasou demais.',
        passos: [
          'O parque tem bastante coberto: PhilharMagic, Piratas, it’s a small world e a ' +
          'Mansão funcionam com chuva e são todos de fila rápida.',
          'Chuva forte costuma esvaziar as filas das montanhas-russas. Se pararem por ' +
          'raio, voltam rápido — vale esperar sob cobertura em vez de ir embora.',
          'Se os fogos forem cancelados, não fiquem esperando: saiam mais cedo e durmam. ' +
          'O dia 13 é Epcot e abre às 9h.',
          'O que não se sacrifica: a manhã na Frontierland. Ela é o que faz o dia caber sem ' +
          'comprar passe nenhum.',
        ],
      },
    ],

    /* --------------------------------------------------------------------- */
    naoPerca: [
      { nome: 'Happily Ever After', quando: 'hoje', custo: 'grátis',
        motivo: 'Fogos com projeção mapeada no castelo, cerca de 18 minutos. É o melhor ' +
                'espetáculo noturno da Disney, e a hora já saiu confirmada: 20h.' },

      { nome: 'As duas horas depois dos fogos', quando: 'hoje', custo: 'grátis',
        motivo: 'A maior parte das 20 mil pessoas vai embora às 20h25 e as filas despencam. ' +
                'O parque fica aberto até as 22h e é nessas duas horas que cabem o Seven ' +
                'Dwarfs e a segunda chance do TRON — as duas coisas que de dia custariam ' +
                'oitenta minutos de fila ou dinheiro. Vale mais que qualquer atração isolada.',
        pesquisa: '2026-09-10' },

      { nome: 'O desfile visto da Liberty Square', quando: 'hoje', custo: 'grátis',
        motivo: 'O Festival of Fantasy começa na Frontierland, desce a Liberty Square e só ' +
                'depois vai para a Main Street. Assistir no começo da rota é o mesmo desfile ' +
                'e liberta vocês quinze minutos antes — que é exatamente o tempo de atravessar ' +
                'para o TRON enquanto a Main Street continua travada.',
        pesquisa: '2026-09-10' },

      { nome: 'O pianista do Casey’s Corner', quando: 'hoje', custo: 'incluso no jantar',
        motivo: 'Toca ao ar livre, na porta. Foi por isso que vocês escolheram o Casey’s — ' +
                'comer dentro perde o motivo da escolha.' },

      { nome: 'Mickey’s PhilharMagic', quando: 'hoje', custo: 'grátis',
        motivo: 'Doze minutos sentados, com ar-condicionado. É o melhor bloco de descanso do ' +
                'parque na pior hora de calor, e ainda é bom de verdade.' },

      { nome: 'Single Pass do TRON', quando: 'comprado', custo: 'US$ 20–23 por pessoa',
        motivo: 'COMPRADO EM 08/11, junto do resto. Sem Early Entry o TRON não é opção de ' +
                'rope drop — ele abre com o parque, já com todo mundo dentro — e o standby ' +
                'fica em 50 a 90 minutos. Com o passe, a janela das 15h30 vira 10 a 15 ' +
                'minutos e a repescagem das 21h25 deixa de ser necessária.',
        pesquisa: '2026-09-17' },

      { nome: 'Single Pass do Seven Dwarfs', quando: 'decidir', custo: 'US$ 15–20 por pessoa',
        motivo: 'PLANO B PAGO, mesma lógica. A fila dele é a mais persistente do parque, ' +
                'média de 80 minutos, e cede em dois momentos do dia: o rope drop e depois ' +
                'dos fogos. Vocês gastaram o rope drop na Frontierland de propósito, então a ' +
                'aposta é depois dos fogos, às 20h30. Se por algum motivo vocês não puderem ' +
                'ficar até tarde, aí o passe se justifica.',
        pesquisa: '2026-09-10' },

      { nome: 'Tiana’s Bayou Adventure', quando: 'fechada', custo: '—',
        motivo: 'Em reforma a partir de 02/11, com volta prevista para dezembro. Não é ' +
                'escolha de vocês — está fechada.' },
    ],

    /* --------------------------------------------------------------------- */
    prepararAmanha: {
      paraODia: '2026-11-12',
      titulo: 'Outlet e tarde livre · café no hotel às 8h30',
      aviso:
        'O dia 11 sai às 6h45, o parque fecha às 22h e, com o ferry e o Uber, vocês ' +
        'chegam ao hotel perto das 23h. São dezessete horas de pé. O dia 12 é de ' +
        'propósito o mais leve da primeira semana, e a lista é curta porque tem que ser.',
      itens: [
        { texto: 'Conferir se o Lightning Lane do dia 15 já está no app', critico: true,
          motivo: 'O Multi Pass do dia 15 e o Single Pass do Rise saíram em 08/11, na ' +
                  'compra única — confiram que as reservas estão lá, nos dois perfis. Se ' +
                  'faltar alguma, comprem hoje mesmo: a janela do dia 15 segue aberta, e ' +
                  'não existe alarme de 7h amanhã.' },
        { texto: 'Se não houver compra, dormir até acordar', critico: true,
          motivo: 'O café do hotel vai até tarde e o outlet abre às 10h. Fora a compra ' +
                  'das 7h, nada no dia 12 depende de vocês acordarem cedo.' },
        { texto: 'Guardar as compras do parque e esvaziar a mochila',
          motivo: 'Amanhã é dia de comprar. Sair com a mochila cheia do dia anterior é ' +
                  'começar errado.' },
        { texto: 'Conferir o que faltou da lista do Walmart',
          motivo: 'O dia 12 passa pelo outlet e pela I-Drive, e ainda tem o Walmart a 4 ' +
                  'minutos do hotel. É a última chance fácil antes da sequência pesada ' +
                  'que começa no dia 13.' },
        { texto: 'Celular e power bank na tomada',
          motivo: 'Vira rotina de toda noite a partir de agora.' },
      ],
    },

    /* --------------------------------------------------------------------- */
    blocos: [
      { id: 'b-1111-0645', hora: '06:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel',
        descricao: 'Uber para o TTC, ~30 min, US$ 22–32. Não para a entrada',
        contexto:
          'O Magic Kingdom é o único parque da Disney sem acesso direto de carro. O Uber ' +
          'para no Ticket & Transportation Center e de lá ainda são 15 a 20 minutos de ' +
          'monotrilho ou barco. É por isso que a saída é tão cedo.\n\n' +
          'NA IDA, MONOTRILHO. É mais rápido de manhã, quando a fila ainda não existe. ' +
          'Na volta vocês fazem o contrário, e o motivo está no bloco da saída.',
        localId: 'mk-ttc', acesso: [], critico: true, duracaoMin: 60 },

      { id: 'b-1111-0745', hora: '07:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão · posicionar para a FRONTIERLAND',
        descricao: 'Catraca ~8h: Main Street e foto do castelo. Depois, à esquerda, não à direita',
        contexto:
          'ESTA É A DECISÃO MAIS IMPORTANTE DA MANHÃ, e ela é contraintuitiva.\n\n' +
          'A CATRACA ABRE PARA TODO MUNDO POR VOLTA DAS 8H, uma hora antes do parque. Com o ' +
          'ingresso comum vocês já entram na Main Street e na praça do castelo, com as lojas ' +
          'abertas. O que fica fechado até as 9h são as áreas e as atrações.\n\n' +
          'Vocês não têm Early Entry, porque não estão em hotel Disney. Às 8h30 os hóspedes ' +
          'Disney passam para a Tomorrowland e a Fantasyland, que são as áreas do Early Entry, ' +
          'e às 9h já estão nas filas de lá. Correr para o TRON às 9h é entrar na fila atrás ' +
          'dessa gente toda: dá 90 minutos ou mais.\n\n' +
          'A recomendação para quem vem de fora é ir para a FRONTIERLAND ou a ADVENTURELAND, ' +
          'que ficam quase vazias na abertura justamente porque o Early Entry não as inclui. ' +
          'Esperem na corda da praça do castelo, do lado delas: às 9h a equipe solta o grupo ' +
          'e vocês seguem direto para o Big Thunder.\n\n' +
          'ESTES 75 MINUTOS SÃO O CAFÉ DA MANHÃ E A FOTO DO CASTELO. Saindo às 6h45 vocês não ' +
          'comem nada até o almoço: comam as barrinhas da mochila já do lado de dentro, na ' +
          'Main Street, e façam a foto do castelo antes de a praça encher. Depois, para a ' +
          'corda.\n\n' +
          'Água: qualquer balcão de comida do parque dá copo de água gelada de graça, é ' +
          'só pedir. Não comprem garrafa a US$ 4 lá dentro — recarreguem os soft flasks de vocês.\n\n' +
          'PONTO DE ENCONTRO DE HOJE: o coreto da Town Square, logo depois da catraca. Se ' +
          'vocês se perderem, vão para lá e ESPEREM — não saiam procurando. Combinem isso ' +
          'antes de a corda soltar.',
        localId: 'magic-kingdom', acesso: [], duracaoMin: 75, pesquisa: '2026-09-12',
        curiosidades: [
          { texto: 'As janelas do segundo andar da Main Street são os créditos do parque, como ' +
                   'no fim de um filme: quem construiu o Walt Disney World aparece como dono ' +
                   'de um negócio fictício. A do Walt fica em cima do Plaza Restaurant, no fim ' +
                   'da rua, virada para o castelo — "Walter E. Disney – Graduate School of ' +
                   'Design & Master Planning". A do pai dele fica na Center Street, em cima da ' +
                   'Uptown Jewelers: "Elias Disney – Contractor – Est. 1895".',
            fonte: 'Wikipedia — List of Disney Main Street window honors', pesquisa: '2026-09-15' },
          { texto: 'O castelo tem 58 metros contando o fosso e não tem um tijolo: por dentro é ' +
                   'estrutura de aço, por fora é reboco. De baixo para cima, pedras, janelas e ' +
                   'portas vão diminuindo — perspectiva forçada, para ele parecer mais alto do ' +
                   'que é.',
            fonte: 'Wikipedia — Cinderella Castle', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-1330', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Big Thunder Mountain',
        descricao: 'Rope drop, standby. Sem gastar passe',
        contexto:
          'Montanha-russa temática de trem de mineração. Sem inversões e sem quedas grandes ' +
          '— é velocidade e curva, não terror. Uma das mais divertidas para quem não quer ' +
          'intensidade.\n\n' +
          'ELA É LISTA ALTA E VOCÊS VÃO FAZER DE GRAÇA. É esse o ganho de começar pela ' +
          'Frontierland: o Big Thunder custaria a reserva mais cara do Multi Pass e, na ' +
          'abertura, custa uns 20 minutos de fila. O passe fica livre para o Peter Pan.\n\n' +
          'A Tiana’s Bayou Adventure, que seria a outra da área, está fechada.',
        areaParque: 'Frontierland', acesso: ['rope-drop', 'standby'],
        critico: true, duracaoMin: 37, pesquisa: '2026-09-10',
        fila: { min: 20, quando: 'na abertura', pico: 60, estimado: true, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'A versão da Flórida abriu em 1980, e as rochas imitam o Monument Valley, ' +
                   'no Arizona: montanhas pontudas e de cor viva. A da Disneyland, na ' +
                   'Califórnia, imita as formações arredondadas e de cor apagada do Bryce ' +
                   'Canyon.',
            fonte: 'Wikipedia — Big Thunder Mountain Railroad', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-1410', hora: '09:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Piratas do Caribe',
        descricao: 'Standby. Adventureland fica ao lado',
        contexto:
          'Passeio de barco, o clássico que originou os filmes. Cenários com ' +
          'animatrônicos, uma queda pequena no escuro, quase não molha. A capacidade é ' +
          'altíssima, então a fila anda mesmo quando parece grande — não vale gastar passe.',
        areaParque: 'Adventureland', acesso: ['standby'], duracaoMin: 35,
        fila: { min: 15, quando: 'de manhã', pico: 45, estimado: true, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'Ele não existia na abertura, em 1971: a Disney achou que, na Flórida, tão ' +
                   'perto do Caribe, um passeio de piratas caribenhos não teria o mesmo ' +
                   'encanto que na Califórnia. Acabou abrindo em 15/12/1973. O forte da fila é ' +
                   'inspirado no Castillo San Felipe del Morro, em San Juan de Porto Rico.',
            fonte: 'Wikipedia — Pirates of the Caribbean (attraction)', pesquisa: '2026-09-15' },
          { texto: 'Uma das vozes dos piratas que cantam é do Thurl Ravenscroft. Guardem o ' +
                   'nome: ele aparece de novo às 11h, na Mansão.',
            fonte: 'Wikipedia — Thurl Ravenscroft', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-1545', hora: '10:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Jungle Cruise',
        descricao: 'Standby, enquanto ainda está cedo',
        contexto:
          'Passeio de barco com um piloto que narra piadas ruins de propósito — é o charme ' +
          'da atração.\n\n' +
          'É lista alta e vocês também fazem sem passe, porque a Adventureland ainda está ' +
          'vazia a esta hora. Depois das 11h ela passa de uma hora.',
        areaParque: 'Adventureland', acesso: ['standby'], duracaoMin: 39,
        fila: { min: 25, quando: 'antes das 11h', pico: 60, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'Atração do dia da abertura, em 1971. Em 2021 a Disney reescreveu o passeio ' +
                   'e trocou a cena final, para tirar representações ofensivas de povos ' +
                   'nativos; entraram personagens novos da Jungle Navigation Co.',
            fonte: 'Wikipedia — Jungle Cruise', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-1150', hora: '11:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mansão Mal-Assombrada',
        descricao: 'Multi Pass · lista baixa. Ao sair, reservem o Space Mountain',
        contexto:
          'A Haunted Mansion. Passeio em cápsulas por cenários com 999 fantasmas, ' +
          'feito com truques de ilusão óptica do século XIX que continuam funcionando. É ' +
          'assombrado de brincadeira, não de susto. Um dos melhores da Disney.\n\n' +
          'ESTA É A PRIMEIRA RESERVA DO DIA E É POR ISSO QUE ELA VEM CEDO. No segundo em ' +
          'que vocês passarem a catraca, abre espaço para reservar a próxima — e a restrição ' +
          'de lista cai junto. Reservem o SPACE MOUNTAIN ali mesmo, de pé na saída.',
        areaParque: 'Liberty Square', acesso: ['multi-pass'], critico: true, duracaoMin: 35,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 40, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'Atração do dia da abertura, em 1971. Na Disneyland, a sala que “estica” no ' +
                   'começo é um elevador que desce; aqui é o teto que sobe.',
            fonte: 'Wikipedia — The Haunted Mansion', pesquisa: '2026-09-15' },
          { texto: 'O busto que puxa o canto no cemitério, perto do fim, é o Thurl Ravenscroft ' +
                   '— por mais de 50 anos a voz do Tony the Tiger, o tigre do Sucrilhos, no ' +
                   '“They’re gr-r-reat!”.',
            fonte: 'Wikipedia — Thurl Ravenscroft', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-1115p', hora: '11:35', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Quinze minutos. Banheiro ao lado do Columbia Harbour House, onde é o almoço',
        contexto:
          'Vocês estão de pé desde as 5h45 e vieram emendando desde as 9h. Banheiro, ' +
          'encher os flasks num balcão de comida (a água gelada é de graça, é só ' +
          'pedir) e sentar num banco.\n\n' +
          'Toda land tem banheiro, normalmente ao lado do maior balcão de comida — ' +
          'vocês nunca estão a mais de dois minutos de um. Não vale a pena procurar ' +
          'no mapa; vale parar quando o corpo pedir.',
        areaParque: 'Liberty Square', acesso: [], duracaoMin: 15 },

      { id: 'b-1111-1230', hora: '11:50', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Columbia Harbour House',
        descricao: 'Balcão, sem reserva. Mobile order. Segundo andar',
        contexto:
          'Fica na Liberty Square, a poucos passos da Mansão — por isso o almoço vem logo ' +
          'depois dela. Peixe e sanduíches.\n\n' +
          'Almoçar às 11h50 é de propósito: meio-dia é o pico, e as filas das atrações caem ' +
          'exatamente quando todo mundo está comendo.\n\n' +
          'Duas coisas: peçam pelo mobile order, que economiza 20 a 30 minutos de fila; e ' +
          'subam para o segundo andar, que quase ninguém acha e é o lugar mais silencioso ' +
          'do Magic Kingdom.',
        restauranteId: 'r-columbia-harbour', areaParque: 'Liberty Square', acesso: [],
        duracaoMin: 52 },

      { id: 'b-1111-1115', hora: '12:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'it’s a small world',
        descricao: 'Standby. Capacidade alta, a fila anda',
        contexto:
          'Passeio de barco com centenas de bonecos animatrônicos e a música que ' +
          'gruda na cabeça por três dias. Lento e climatizado — serve de descanso depois do ' +
          'almoço, e a fila engana: some rápido.',
        areaParque: 'Fantasyland', acesso: ['standby'], duracaoMin: 35,
        fila: { min: 25, quando: 'depois do almoço', pico: 35, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'Nasceu na Feira Mundial de Nova York de 1964, no pavilhão da UNICEF ' +
                   'patrocinado pela Pepsi, com o visual da Mary Blair, e veio para cá na ' +
                   'abertura de 1971.',
            fonte: 'Wikipedia — It’s a Small World', pesquisa: '2026-09-15' },
          { texto: 'Walt pediu aos irmãos Sherman uma música fácil de traduzir e de cantar em ' +
                   'cânone. A revista Time a chamou de a música mais tocada em público de ' +
                   'todos os tempos.',
            fonte: 'Wikipedia — It’s a Small World', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-1015', hora: '13:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Peter Pan’s Flight',
        descricao: 'Multi Pass · lista alta. A única que vale o passe caro',
        contexto:
          'Barquinhos suspensos sobrevoando cenários em miniatura. Dura 3 minutos e tem ' +
          'capacidade baixíssima — por isso a fila é sempre absurda para o que entrega, e ' +
          'por isso ele é lista alta.\n\n' +
          'É a ÚNICA reserva de lista alta que vocês gastam no dia. O Big Thunder e o Jungle ' +
          'Cruise, que também são lista alta, vocês fizeram de graça na abertura. O Peter Pan ' +
          'não tem essa saída: ele é ruim de fila o dia inteiro, de manhã à noite.',
        areaParque: 'Fantasyland', acesso: ['multi-pass'], critico: true, duracaoMin: 30,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 120, fonte: '2026-09-17' } },

      { id: 'b-1111-1630', hora: '13:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mickey’s PhilharMagic',
        descricao: 'Standby. 12 min, ar-condicionado',
        contexto:
          'Filme 3D com efeitos no teatro — cheiro, água, ar. É o melhor bloco de descanso ' +
          'do parque, e cai na pior hora de calor de propósito.',
        areaParque: 'Fantasyland', acesso: ['standby'], duracaoMin: 20,
        fila: { min: 10, quando: 'quase sempre', pico: 20, fonte: '2026-09-10' } },

      { id: 'b-1111-1645p', hora: '14:10', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Antes do desfile. Banheiro atrás da torre da Rapunzel, a caminho da Liberty Square',
        contexto:
          'Os próximos noventa minutos são o miolo tático do dia: desfile, travessia do ' +
          'parque e a fila do TRON. Vão para eles com os flasks cheios e sem fila de ' +
          'banheiro pendurada.\n\n' +
          'COMAM ALGUMA COISA DA MOCHILA AGORA. O almoço foi 11h50 e o jantar é 17h55 — ' +
          'são seis horas, com o desfile e a fila do TRON no meio. Barrinha, fruta, o ' +
          'que tiver.\n\n' +
          'É também a hora de ligar o power bank, se o celular estiver abaixo de 40%.',
        areaParque: 'Fantasyland', acesso: [], duracaoMin: 12 },

      { id: 'b-1111-1425', hora: '14:25', ancora: 'fixo', tipo: 'espera',
        titulo: 'Posicionar na LIBERTY SQUARE para o desfile',
        descricao: 'Não na Main Street. O motivo é o próximo bloco',
        contexto:
          'O desfile começa na Frontierland, desce a Liberty Square, contorna o hub e SÓ ' +
          'ENTÃO vai para a Main Street. Quem assiste no começo da rota vê exatamente o ' +
          'mesmo desfile e fica livre uns quinze minutos antes de a Main Street ver o ' +
          'primeiro carro alegórico.\n\n' +
          'Na Main Street enche uma hora antes. Aqui dá para chegar trinta minutos antes e ' +
          'ficar na primeira fila.\n\n' +
          'HORÁRIO FIXO, colado no desfile. Se o parque abrir mais cedo, a manhã inteira ' +
          'termina antes e sobra tempo livre aqui — não venham para cá antes da hora, ' +
          'aproveitem para repetir o que mais gostaram.',
        areaParque: 'Liberty Square', acesso: [], duracaoMin: 35,
        curiosidades: [
          { texto: 'O carvalho no centro da praça, a Liberty Tree, foi achado dentro do ' +
                   'terreno da Disney e transplantado para cá. As 13 lanternas penduradas nele ' +
                   'representam as 13 colônias.',
            fonte: 'Wikipedia — Liberty Square; Military Disney Tips', pesquisa: '2026-09-15' },
          { texto: 'Numa janela do andar de cima da praça há duas lanternas acesas: é o sinal ' +
                   'da Revolução Americana, do “one if by land, two if by sea” — uma se os ' +
                   'ingleses viessem por terra, duas se viessem pelo mar.',
            fonte: 'Wikipedia — Liberty Square', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-1500', hora: '15:00', ancora: 'fixo', tipo: 'show',
        titulo: 'Festival of Fantasy Parade',
        descricao: 'Da Liberty Square. Doze minutos',
        contexto:
          'Desfile de carros alegóricos, 12 minutos.\n\n' +
          'HORÁRIO FIXO — não desloca se o parque abrir mais cedo, e é ele que ancora toda a ' +
          'tarde a partir daqui.\n\n' +
          'É A ÚLTIMA HORA DO DIA QUE FALTA: o parque e os fogos já saíram, o desfile não. O ' +
          'roteiro assume 15h, que é o padrão. Se sair outra, mexam aqui — a travessia das ' +
          '15h12 e a janela do TRON andam com o desfile, não com a abertura.',
        areaParque: 'Liberty Square', acesso: [], duracaoMin: 12, confirmarHorario: true,
        curiosidades: [
          { texto: 'Estreou em 09/03/2014. O dragão da Malévola tem uns 8 metros, cospe fogo e ' +
                   'anda sobre um chassi articulado, que dobra nas curvas.',
            fonte: 'Disney Wiki (Fandom) — Festival of Fantasy Parade', pesquisa: '2026-09-15' },
          { texto: 'Em 11/05/2018 o dragão pegou fogo de verdade no meio do desfile. Um ' +
                   'funcionário apagou, ninguém se feriu e o parque seguiu normal.',
            fonte: 'CBS News', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-1512', hora: '15:12', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Atravessar para a Tomorrowland — AGORA',
        descricao: 'Liberty Square → Fantasyland → Tomorrowland. Não pelo hub',
        contexto:
          'ESTE É O TRUQUE DO DIA. O desfile acabou de passar por vocês e agora está indo ' +
          'para a Main Street, onde vinte mil pessoas ainda estão paradas esperando ele ' +
          'chegar — e vão ficar lá mais uns vinte minutos.\n\n' +
          'Vocês saem por trás da rota, pela Fantasyland, sem cruzar o desfile em nenhum ' +
          'momento. Não tentem pelo hub: é por onde o desfile passa e está bloqueado.\n\n' +
          'Enquanto isso, a fila do TRON está no menor patamar da tarde inteira, porque metade ' +
          'do parque está assistindo ao desfile.',
        areaParque: 'Fantasyland', acesso: [], duracaoMin: 18, critico: true,
        pesquisa: '2026-09-10' },

      { id: 'b-1111-0900', hora: '15:30', ancora: 'fixo', tipo: 'atracao',
        titulo: 'TRON Lightcycle / Run',
        descricao: 'A janela do desfile. Standby',
        contexto:
          'A montanha-russa mais rápida do Magic Kingdom, ~97 km/h. Vocês montam em motos, ' +
          'inclinados para frente, e o lançamento é forte. É curta — cerca de 1 minuto.\n\n' +
          'POR QUE AQUI E NÃO NA ABERTURA: o TRON não entra no Early Entry, mas os hóspedes ' +
          'Disney já estão dentro do parque quando ele abre e disparam para cá. Quem vem de ' +
          'fora chega atrás dessa fila e pega 90 minutos ou mais. Às 15h30, com o desfile ' +
          'segurando o parque, ele fica no melhor patamar da tarde.\n\n' +
          'Se mesmo assim estiver acima de 60 minutos, saiam da fila: vocês voltam aqui às ' +
          '21h25, na última hora, que é a outra janela boa do dia.\n\n' +
          'Guardem tudo no locker antes — o TRON não permite nada solto.',
        areaParque: 'Tomorrowland', acesso: ['standby'], locker: true,
        critico: true, duracaoMin: 55, pesquisa: '2026-09-10',
        fila: { min: 50, quando: 'na janela do desfile', pico: 90, estimado: true, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'É cópia da montanha-russa que a Shanghai Disneyland abriu em 2016 — na ' +
                   'época, a mais rápida de qualquer parque da Disney. A de Orlando abriu em ' +
                   '04/04/2023 e passa por baixo de uma cobertura que muda de cor.',
            fonte: 'Wikipedia — Tron Lightcycle Power Run', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-1515p', hora: '16:25', ancora: 'fixo', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Saindo do TRON. Banheiro ao lado do Cosmic Ray’s, no caminho do Space Mountain',
        contexto:
          'Daqui até a saída, às 22h, são mais cinco horas e meia. Banheiro, flasks ' +
          'cheios e protetor solar antes de encarar a Main Street lotada.',
        areaParque: 'Tomorrowland', acesso: [], duracaoMin: 15 },

      { id: 'b-1111-0940', hora: '16:40', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Space Mountain',
        descricao: 'Multi Pass rolando — o que vocês reservaram às 11h',
        contexto:
          'Montanha-russa de 1975 no escuro total, sem inversões. Não é rápida pelos padrões ' +
          'de hoje (~45 km/h), mas o escuro completo faz parecer muito mais. Sacode bastante ' +
          '— é uma das mais desconfortáveis para coluna do complexo.\n\n' +
          'É lista alta e vocês pegam com a reserva rolante, sem ter gasto nada da compra ' +
          'inicial nela.',
        areaParque: 'Tomorrowland', acesso: ['multi-pass'], duracaoMin: 35,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 60, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'É o primeiro Space Mountain do mundo: abriu em 15/01/1975, dois anos antes ' +
                   'do da Disneyland. Walt levou a ideia ao designer John Hench em 1964, mas a ' +
                   'tecnologia da época e o espaço da Califórnia não davam. São dois trilhos ' +
                   'espelhados, o Alpha e o Omega.',
            fonte: 'Wikipedia — Space Mountain (Magic Kingdom)', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-1700', hora: '17:15', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Buzz Lightyear',
        descricao: 'Multi Pass · lista baixa. Repaginado em 2026',
        contexto:
          'Dark ride onde vocês atiram em alvos e disputam pontuação. Desde a reforma de ' +
          'abril de 2026 a pistola é de mão, com laser sempre ligado, e o placar aparece numa ' +
          'tela na frente de vocês.\n\n' +
          'AS DICAS OFICIAIS DA DISNEY: mirem no centro de cada alvo — quando o tiro é bom, o ' +
          'alvo acende com a cor da pistola, vermelha ou verde. Alvo mais distante ou mais ' +
          'difícil vale mais. Anel branco vale o dobro, e o anel multicolorido, o mais raro, ' +
          'liga um bônus curto em que todos os alvos da cena valem muito mais para todo mundo ' +
          'por perto.',
        areaParque: 'Tomorrowland', acesso: ['multi-pass'], duracaoMin: 33,
        pesquisa: '2026-09-15',
        fila: { min: 10, quando: 'com o Multi Pass', pico: 35, fonte: '2026-09-10' } },

      { id: 'b-1111-1745', hora: '17:55', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Casey’s Corner',
        descricao: 'Balcão na Main Street. Sentem fora, de frente para o pianista',
        contexto:
          'Cachorro-quente de balcão, com pianista tocando ao vivo na porta. Foi por isso ' +
          'que vocês escolheram — comer dentro perde o motivo da escolha.\n\n' +
          'Mobile order aqui também.',
        restauranteId: 'r-caseys', areaParque: 'Main Street', acesso: [], duracaoMin: 65,
        curiosidades: [
          { texto: 'O nome vem de “Casey at the Bat”, poema de 1888 de Ernest Thayer sobre o ' +
                   'rebatedor de Mudville que é eliminado e perde o jogo. A Disney transformou ' +
                   'a história em desenho nos anos 1940.',
            fonte: 'KennythePirate; Disney Wiki (Fandom)', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-1900', hora: '19:00', ancora: 'fixo', tipo: 'compras',
        titulo: 'Main Street',
        descricao: 'Compras e o castelo iluminado',
        contexto:
          'As lojas da Main Street ficam abertas até depois dos fogos e esvaziam justamente ' +
          'quando todo mundo está se posicionando. Como hoje vocês ficam até as 22h, dá para ' +
          'deixar a compra para o fim se preferirem.',
        areaParque: 'Main Street', acesso: [], duracaoMin: 20,
        curiosidades: [
          { texto: 'Atravessem o túnel do castelo: os cinco mosaicos contam a Cinderela em ' +
                   'mais de 500 cores de vidro, com ouro e prata. Numa das cenas uma irmã está ' +
                   'com o rosto verde de inveja e a outra vermelho de raiva, e dois ' +
                   'Imagineers, Herb Ryman e John Hench, emprestaram o rosto a personagens.',
            fonte: 'Jim Korkis; Celebrations Magazine; Wikipedia — Cinderella Castle', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-1920', hora: '19:20', ancora: 'fixo', tipo: 'espera',
        titulo: 'Posição para os fogos',
        descricao: 'Main Street, lado direito olhando o castelo',
        contexto:
          '40 minutos antes parece exagero e não é. O show usa projeção no castelo além dos ' +
          'fogos, então o ângulo importa: de frente, e não muito perto, senão vocês perdem a ' +
          'projeção.\n\n' +
          'HORÁRIO FIXO, colado no show.',
        areaParque: 'Main Street', acesso: [], duracaoMin: 40 },

      { id: 'b-1111-2000', hora: '20:00', ancora: 'fixo', tipo: 'show',
        titulo: 'Happily Ever After',
        descricao: 'Confirmado para as 20h. Projeção no castelo, 18 minutos',
        contexto:
          'Fogos com projeção mapeada no castelo, cerca de 18 minutos. É o melhor espetáculo ' +
          'noturno da Disney.\n\n' +
          'HORÁRIO CONFIRMADO PARA AS 20H, junto com o calendário do parque. É âncora fixa: ' +
          'não desloca se a abertura mudar, e é ele que segura a noite inteira — o lugar na ' +
          'Main Street às 19h20 e o Seven Dwarfs às 20h30 dependem dele.',
        areaParque: 'Main Street', acesso: [], duracaoMin: 18,
        confirmarHorario: false, pesquisa: '2026-09-12',
        curiosidades: [
          { texto: 'Estreou em 12/05/2017, saiu de cena para o show dos 50 anos do Walt Disney ' +
                   'World e voltou em 03/04/2023 — já com projeções nas fachadas da Main ' +
                   'Street, e não só no castelo.',
            fonte: 'Wikipedia — Happily Ever After (Magic Kingdom)', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-1045', hora: '20:30', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Seven Dwarfs Mine Train',
        descricao: 'Depois dos fogos. É quando ele fica barato',
        contexto:
          'Montanha-russa familiar cujos carrinhos balançam lateralmente nas curvas. Suave, ' +
          'curta, com uma cena final de animatrônicos muito boa.\n\n' +
          'É a fila mais persistente do parque: média de 80 minutos o dia inteiro. As duas ' +
          'únicas janelas em que ela cede são o rope drop e DEPOIS DOS FOGOS, quando o parque ' +
          'esvazia — e vocês gastaram o rope drop na Frontierland, de propósito. É agora.\n\n' +
          'A maior parte das vinte mil pessoas vai embora logo depois dos fogos, às 20h25, e ' +
          'as filas despencam. É por isso que hoje vocês ficam até o fim.',
        areaParque: 'Fantasyland', acesso: ['standby'], critico: true, duracaoMin: 51,
        pesquisa: '2026-09-10',
        fila: { min: 40, quando: 'na última hora', pico: 90, estimado: true, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'Abriu em 28/05/2014 e fechou a expansão da Fantasyland, que durou de 2010 ' +
                   'a 2014. Ocupa o lugar do 20,000 Leagues Under the Sea, que funcionou de ' +
                   '1971 a 1994.',
            fonte: 'Wikipedia — Seven Dwarfs Mine Train', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1111-2125', hora: '21:25', ancora: 'fixo', tipo: 'atracao',
        titulo: 'TRON de novo, se ainda tiverem pique',
        descricao: 'Opcional. A outra janela boa do dia',
        contexto:
          'A última hora é a segunda janela do TRON, e é o plano B declarado caso a fila das ' +
          '15h30 tenha estourado. Se vocês já andaram nele à tarde, esta é a repetição — e ' +
          'de noite, iluminado, ele é outro passeio.\n\n' +
          'Se o corpo não pedir, cortem sem culpa. Vocês estão no segundo dia de viagem e ' +
          'amanhã não tem alarme.',
        areaParque: 'Tomorrowland', acesso: ['standby'], locker: true, opcional: true,
        duracaoMin: 35,
        fila: { min: 35, quando: 'na última hora', pico: 90, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1111-2100', hora: '22:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair — pelo FERRY, não pelo monotrilho',
        descricao: 'A fila do monotrilho no fechamento é a pior do dia',
        contexto:
          'AQUI VOCÊS FAZEM O CONTRÁRIO DA IDA. Depois dos fogos e no fechamento, a fila do ' +
          'monotrilho passa de vinte a trinta minutos e pode chegar a muito mais, porque ' +
          'todo mundo vai por padrão para ela.\n\n' +
          'O ferry parece pior e não é: no fechamento a Disney opera os três barcos, cada um ' +
          'leva centenas de pessoas de uma vez, e a fila some em bloco. É a recomendação ' +
          'padrão de quem conhece — monotrilho na ida, barco na volta.\n\n' +
          'Do TTC até o hotel, contem 45 a 60 minutos e US$ 22–32 de Uber. Com o ferry, ' +
          'vocês chegam perto das 23h.',
        localId: 'mk-ttc', acesso: [], duracaoMin: 60, pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'Os três barcos têm nomes de executivos da construção: General Joe Potter ' +
                   '(faixa azul), Richard F. Irvine (vermelha) e Admiral Joe Fowler (verde). ' +
                   'Potter, general que tinha governado a Zona do Canal do Panamá, cuidou da ' +
                   'drenagem, dos esgotos e das usinas que tornaram o pântano habitável — e ' +
                   'tem janela na Main Street.',
            fonte: 'Wikipedia — Magic Kingdom; D23', pesquisa: '2026-09-15' },
        ] },
    ],

    ficha: {
      multiPass: {
        usar: true, opcional: false,
        listaAlta: ['Peter Pan’s Flight'],
        listaBaixa: ['Mansão Mal-Assombrada', 'Buzz Lightyear'],
        rolando: ['Space Mountain'],
        planoB:
          'Nenhum. Esta é a compra e ela é simples: uma da alta, duas da baixa. Se o Peter ' +
          'Pan não estiver disponível na hora, troquem pelo Space Mountain e reservem o ' +
          'Peter Pan rolando.',
        nota:
          'ROLANDO: Space Mountain, reservado às 11h de pé na saída da Mansão. É o uso da ' +
          'primeira reserva que abre a próxima e derruba a restrição de lista.\n\n' +
          'Lista alta hoje: Jungle Cruise, Peter Pan, Space Mountain e Big Thunder. Vocês ' +
          'fazem TRÊS delas gastando UMA — Big Thunder e Jungle saem no standby antes das ' +
          '11h, porque a Frontierland e a Adventureland ficam vazias na abertura. A Tiana’s, ' +
          'também da lista alta, está fechada.',
      },
      singlePass: {
        itens: [],
        opcionais: ['TRON Lightcycle / Run', 'Seven Dwarfs Mine Train'],
        nota:
          'NÃO COMPREM NADA EM 08/11. Os dois Single Pass do Magic Kingdom ficam como plano ' +
          'B pago, e o roteiro foi desenhado para não precisar deles.\n\n' +
          'O TRON tem duas janelas de graça: 15h30, na hora do desfile, e 21h25, na última ' +
          'hora. O Seven Dwarfs tem uma: 20h30, depois dos fogos. Se alguma falhar, o passe ' +
          'se compra na hora pelo app, de pé na frente da atração — que é mais barato que ' +
          'comprar antes e não precisar.',
      },
      expressPass: null,
      custoEstimadoCasal: { min: 40, max: 70, moeda: 'USD' },
      extras: [
        { nome: 'Locker no TRON',
          texto: 'O TRON não permite nada solto. Locker gratuito pelo tempo da atração, ' +
                 'mas some 5 a 10 minutos ao bloco — contem isso nas duas janelas.' },
        { nome: 'Se os dois Single Pass virarem necessários',
          texto: 'O teto do dia sobe para uns US$ 145 no casal. É o pior caso, não o plano: ' +
                 'só acontece se as três janelas de graça falharem no mesmo dia.' },
      ],
    },

    renuncias: {
      gerais: [
        { nome: 'Dumbo' }, { nome: 'Barnstormer' }, { nome: 'Tomorrowland Speedway' },
        { nome: 'Astro Orbiter' }, { nome: 'Mad Tea Party' },
        { nome: 'Ariel’s Undersea Adventure' }, { nome: 'Enchanted Tales with Belle' },
        { nome: 'Tapete Mágico' }, { nome: 'Tom Sawyer Island' }, { nome: 'Liberty Belle' },
        { nome: 'PeopleMover — 10 min sentado e quase sempre walk-on, mas o dia já tem ' +
                 'três paradas e a Tomorrowland está cheia de bloco entre 15h30 e 17h55' },
        { nome: 'Walt Disney World Railroad — dá a volta no parque em ~20 min, e o dia não ' +
                 'tem 20 minutos livres em lugar nenhum' },
        { nome: 'Many Adventures of Winnie the Pooh' },
        { nome: 'Swiss Family Treehouse — escadaria longa, e o dia já tem 25 mil passos' },
        { nome: 'Prince Charming Regal Carrousel — mesma família do Dumbo e do Mad Tea ' +
                 'Party, que também ficaram de fora' },
        { nome: 'Hall of Presidents — 22 minutos de história cívica americana com os ' +
                 'presidentes em animatrônico' },
        { nome: 'Country Bear Jamboree — musical de 12 minutos com ursos animatrônicos ' +
                 'cantando músicas Disney em versão country, voltado a família' },
        { nome: 'Monsters Inc. Laugh Floor — comédia de improviso com humor pensado para ' +
                 'criança' },
        { nome: 'Enchanted Tiki Room — clássico de 10 minutos, de pássaros cantando, mas a ' +
                 'Adventureland das 9h40 às 10h50 não tem brecha' },
      ],
      fechado: [
        'Carousel of Progress — fechou em 06/07/2026 para uma reforma que troca as quatro ' +
        'cenas e põe um animatrônico do Walt abrindo o show. Volta só no fim da primavera ' +
        'de 2027, sem data anunciada',
        'Tiana’s Bayou Adventure — em reforma a partir de 02/11, volta prevista para dezembro',
        'Tiana’s Bayou General — fecha junto com a atração; a Critter Co-Op fica aberta',
      ],
    },
  },

  /* ===== 12/11 · QUINTA · OUTLET E BOARDWALK ============================== */
  /* DIA FECHADO — revisado em 16/09/2026. É o dia mais leve da primeira semana:
     outlet de manhã, tarde no hotel e jantar perto, porque o 13 sai às 6h30.  */
  {
    id: 'd-2026-11-12',
    data: '2026-11-12',
    diaSemana: 'quinta',
    emoji: '🛍️',
    titulo: 'Outlet e BoardWalk',
    subtitulo: 'O dia mais leve da primeira semana',
    tipo: 'compras',
    operadora: null,
    parqueId: null,
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-16',
    referencia: { rotulo: 'Saída do hotel', padrao: '09:30', confirmado: false },

    resumo:
      'Café de diner, outlet de manhã, tarde inteira no hotel e o BoardWalk à noite. Ele é ' +
      'leve de propósito: vocês vêm do Magic Kingdom até as 22h e entram numa sequência ' +
      'pesada a partir de amanhã. O bloco vazio da tarde não é folga, é manutenção.',

    avisos: [
      'NÃO HÁ COMPRA HOJE. O Multi Pass do dia 15 e o Single Pass do Rise saíram em 08/11, ' +
      'na compra única — é só conferir no app. Não existe alarme de 7h neste dia.',
      'Fora isso, nada hoje depende de acordar cedo — como no dia 14.',
    ],

    notas: [
      { tipo: 'atencao', texto:
        'O CUPOM DO OUTLET SÓ É GRÁTIS SE VOCÊS SE CADASTRAREM ANTES. O livro físico do ' +
        'balcão custa US$ 10. O gratuito vem do Simon VIP Club, em premiumoutlets.com/vip, ' +
        'e o Savings Passport fica no celular. Está no checklist para 05/11.',
        pesquisa: '2026-09-10' },
    ],

    /* --------------------------------------------------------------------- */
    planos: [
      {
        letra: 'A',
        titulo: 'Dia normal',
        gatilho: 'Vocês acordaram bem e o dia 11 não cobrou caro demais.',
        passos: [
          'Outlet de manhã com calma, começando pelo Character Warehouse, que abre 10h.',
          'Almoço no Ford’s Garage, dentro do próprio outlet, sem Uber.',
          'Tarde inteira no hotel. Não preencham esse bloco.',
          'BoardWalk às 18h, com jantar de balcão no calçadão e volta às 20h10.',
        ],
      },
      {
        letra: 'B',
        titulo: 'Vocês acordaram destruídos',
        gatilho: 'O dia 11 terminou perto das 22h e o corpo não colaborou.',
        passos: [
          'Cortem até o outlet sem culpa: ele é compra, não passeio, e o dia 25 tem outro.',
          'Este é o ÚNICO dia da viagem em que nada é insubstituível. Não há ingresso, não ' +
          'há reserva, não há hora marcada.',
          'O que vocês estão protegendo é o dia 13, que sai às 6h30 e abre a sequência mais ' +
          'pesada da viagem: Animal Kingdom, Hollywood Studios, Epcot e Universal Studios, ' +
          'de 13 a 17.',
        ],
      },
    ],

    /* --------------------------------------------------------------------- */
    naoPerca: [
      { nome: 'Disney’s Character Warehouse', quando: 'hoje', custo: 'entrada grátis',
        motivo: 'O outlet oficial da Disney: sobra de estoque e item descontinuado das lojas ' +
                'dos parques por uma fração do preço de dentro. Está no mesmo endereço onde ' +
                'vocês já vão estar, então custa só a caminhada. Abre 10h de segunda a ' +
                'sábado — a mesma hora em que vocês chegam.' },

      { nome: 'A volta do lago no BoardWalk', quando: 'hoje', custo: 'grátis',
        motivo: 'Calçadão de madeira em volta do Crescent Lake, com os hotéis acesos do outro ' +
                'lado e barcos passando. A volta inteira dá uns 25 minutos, não tem catraca e ' +
                'não custa nada. É o oposto de um dia de parque, que é exatamente o que este ' +
                'dia precisa ser.',
        pesquisa: '2026-09-16' },

      { nome: 'Mesa com garçom no BoardWalk', quando: 'decidir', custo: 'a partir de US$ 30 por pessoa',
        motivo: 'A reserva vale duas vezes: garante o jantar e libera a guarita para o Uber ' +
                'entrar direto, em vez de descer no Swan e caminhar. Reserva pelo My Disney ' +
                'Experience, janela de 60 dias. Sem ela, os balcões do calçadão resolvem.',
        pesquisa: '2026-09-16' },
    ],

    /* --------------------------------------------------------------------- */
    prepararAmanha: {
      paraODia: '2026-11-13',
      titulo: 'Epcot · alarme 6h15, saída 7h15',
      aviso:
        'Hoje a noite acaba cedo, no BoardWalk, e amanhã sai às 7h15. O Epcot é o dia mais leve dos ' +
        'quatro da Disney — a tarde é comida, não fila — mas a manhã ainda tem hora.',
      itens: [
        { texto: 'Alarme para 6h15 nos dois celulares', critico: true,
          motivo: 'Saída às 7h15, para estar na corda do Epcot às 8h15. Depois de um dia que ' +
                  'termina às 21h35, um alarme só falha.' },
        { texto: 'Conferir se as reservas de Lightning Lane do dia 13 aparecem no app',
          critico: true,
          motivo: 'O Multi Pass do dia 13 (Mission: SPACE, Soarin’ e Frozen) e o Single Pass ' +
                  'do Cosmic Rewind saíram em 08/11, na compra única. Se algo falhou, hoje ' +
                  'ainda dá para comprar ou para replanejar a manhã do Epcot.' },
        { texto: 'Conferir o horário de abertura do Epcot e ajustar a referência',
          critico: true,
          motivo: 'O dia 13 assume 9h. Se for outro, mudem a referência e a manhã desloca ' +
                  'junto, inclusive a saída das 7h15.' },
        { texto: 'Mochila remontada e celular carregando', critico: true,
          motivo: 'Os dois soft flasks, barrinhas, protetor solar, power bank, cabo e uma camada ' +
                  'leve para cada um — o Epcot é o parque com mais área aberta, e a World ' +
                  'Showcase à noite esfria.' },
        { texto: 'Guardar as compras do outlet',
          motivo: 'Vocês voltam com sacola hoje. Amanhã a mochila precisa sair leve.' },
      ],
    },

    blocos: [
      { id: 'b-1211-0830', hora: '08:30', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Café da manhã — IHOP',
        descricao: 'A 750 m do hotel, aberto desde as 6h. Sem alarme',
        contexto:
          'O IHOP da 5184 W Irlo Bronson é o mais perto dos três da 192: uns 750 metros a ' +
          'leste do hotel, três minutos de Uber. Panqueca, ovos e bacon — o café americano ' +
          'de diner, e é o mesmo do dia 20.\n\n' +
          'Sem despertador: nada hoje depende de acordar cedo, e o outlet só abre às 10h.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta sobre o valor sem imposto. Se preferirem ' +
          'ficar, o café do hotel é incluso e vai até as 10h.',
        endereco: '5184 W Irlo Bronson Memorial Hwy', acesso: [], duracaoMin: 60,
        pesquisa: '2026-09-16' },

      { id: 'b-1211-0930', hora: '09:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair para o outlet',
        descricao: 'Uber, ~25 min, US$ 20–30',
        contexto:
          'O Character Warehouse abre às 10h e o estoque bom sai cedo. Saindo 9h30 vocês ' +
          'chegam na abertura, que é o único momento em que a loja está inteira.',
        localId: 'premium-outlets', acesso: [], duracaoMin: 30 },

      { id: 'b-1211-1000', hora: '10:00', ancora: 'referencia', tipo: 'compras',
        titulo: 'Orlando International Premium Outlets',
        descricao: '~25 min do hotel. Quinta, 10h às 21h',
        contexto:
          'Outlet a céu aberto com cerca de 180 lojas.\n\n' +
          'SOBRE O CUPOM: o livro do balcão custa US$ 10. O gratuito é o Savings Passport ' +
          'do Simon VIP Club, que vocês cadastram antes de viajar e fica no celular.',
        endereco: '4951 International Dr', localId: 'premium-outlets', acesso: [],
        pesquisa: '2026-09-10', duracaoMin: 5 },

      { id: 'b-1211-1005', hora: '10:05', ancora: 'referencia', tipo: 'compras',
        titulo: 'Disney’s Character Warehouse',
        descricao: 'Dentro do mesmo outlet. Abre 10h de segunda a sábado',
        contexto:
          'O outlet oficial da Disney. Vende sobra de estoque e item descontinuado das ' +
          'lojas dos parques — o que não vendeu na temporada passada chega aqui por uma ' +
          'fração do preço de dentro do parque.\n\n' +
          'Está no mesmo endereço onde vocês já vão estar, então custa só a caminhada. ' +
          'O estoque é imprevisível por definição: gira conforme o que sobrou, e duas ' +
          'visitas nunca acham a mesma coisa. Não dá para contar com item específico.\n\n' +
          '12/11 é quinta, então abre 10h — a mesma hora em que vocês chegam ao outlet.',
        endereco: '4951 International Dr', localId: 'premium-outlets', acesso: [],
        pesquisa: '2026-09-09', duracaoMin: 170 },

      { id: 'b-1211-1300', hora: '13:00', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Ford’s Garage',
        descricao: 'Mesa com garçom, dentro do próprio outlet',
        contexto:
          'Salão de oficina dos anos 1920, com Fords antigos, hambúrgueres, comida americana ' +
          'e cerveja artesanal na torneira. Fica dentro do outlet: sair da I-Drive para ' +
          'almoçar custaria dois Ubers e uma hora, num dia cujo objetivo é descansar.\n\n' +
          'A CONTA JÁ VEM COM 20% DE TAXA DE SERVIÇO, no lugar da gorjeta — não somem outra ' +
          'por cima. O preço da etiqueta não inclui o imposto. Dá para reservar ou entrar na ' +
          'fila de espera pelo site do restaurante.',
        restauranteId: 'r-fords-garage', localId: 'premium-outlets', acesso: [],
        pesquisa: '2026-09-11', duracaoMin: 90 },

      { id: 'b-1211-1430', hora: '14:30', ancora: 'fixo', tipo: 'vazio',
        titulo: 'VAZIO PROPOSITAL',
        descricao: 'Voltar ao hotel, piscina, dormir',
        contexto:
          'Não preencham. Vocês vêm de um Magic Kingdom que terminou perto das 22h e amanhã ' +
          'começa ' +
          'a sequência mais pesada da viagem: Animal Kingdom, Hollywood Studios, Epcot e ' +
          'Universal Studios, de 13 a 17.\n\n' +
          'Este bloco não é folga. É o que faz o resto funcionar.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 180 },

      { id: 'b-1211-1730', hora: '17:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair para o BoardWalk',
        descricao: 'Uber até o Swan, ~30 min, US$ 25–35. A pé de lá',
        contexto:
          'O DESTINO NO APLICATIVO É O WALT DISNEY WORLD SWAN, não o BoardWalk. Desde junho ' +
          'de 2026 a guarita dos hotéis Disney só deixa o carro de aplicativo entrar com ' +
          'reserva de hotel ou de restaurante, e o Swan não tem guarita.\n\n' +
          'Do Swan até o BoardWalk é uma caminhada de uns dez minutos pela beira do lago, ' +
          'que já é parte do passeio. Se vocês reservarem mesa num restaurante do BoardWalk, ' +
          'aí o Uber entra direto — é só mostrar a confirmação na guarita.',
        localId: 'swan', acesso: [], duracaoMin: 30, pesquisa: '2026-09-16' },

      { id: 'b-1211-1800', hora: '18:00', ancora: 'fixo', tipo: 'livre',
        titulo: 'BoardWalk — a volta do lago',
        descricao: 'Calçadão à beira d’água, de graça. Sem catraca e sem fila',
        contexto:
          'É o passeio mais barato e mais bonito da primeira semana: um calçadão de madeira ' +
          'em volta do Crescent Lake, com os hotéis iluminados do outro lado, barcos passando ' +
          'e o Epcot logo ali.\n\n' +
          'A volta inteira do lago — BoardWalk, Beach Club, Yacht Club, Swan e Dolphin — dá ' +
          'uns 25 minutos de caminhada sem pressa. O pôr do sol é às 17h33, então vocês pegam ' +
          'a luz do fim da tarde e a virada para a noite.\n\n' +
          'O portão do Epcot pelo International Gateway fica a cinco minutos a pé daqui, mas ' +
          'hoje ele não serve: o dia de Epcot é amanhã, e o ingresso é por data.',
        localId: 'boardwalk', acesso: [], duracaoMin: 60, pesquisa: '2026-09-16' },

      { id: 'b-1211-1900', hora: '19:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar no BoardWalk',
        descricao: 'Balcão do próprio calçadão. Mesa com garçom só com reserva',
        contexto:
          'Os balcões do calçadão resolvem sem reserva e sem espera: sanduíche, pizza em ' +
          'fatia e sobremesa, comidos numa mesa ao ar livre com o lago na frente.\n\n' +
          'SE QUISEREM MESA COM GARÇOM, ela precisa ser reservada no My Disney Experience, e ' +
          'a reserva vale duas vezes: garante o jantar e libera a guarita para o Uber entrar ' +
          'direto no BoardWalk. A janela abre 60 dias antes.\n\n' +
          'Hoje é o único jantar da viagem sem nada marcado, de propósito: amanhã o Animal ' +
          'Kingdom sai às 6h30.',
        localId: 'boardwalk', acesso: [], duracaoMin: 60, pesquisa: '2026-09-16' },

      { id: 'b-1211-2010', hora: '20:10', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Uber do Swan, ~30 min, US$ 25–35. Amanhã sai às 6h30',
        contexto:
          'Voltem a pé até o Swan para chamar o carro, pelo mesmo motivo da ida.\n\n' +
          'Não estiquem. O dia 13 é Epcot com saída às 7h15, e ele abre a sequência pesada: ' +
          'Epcot, Celebration com Islands à noite, Hollywood Studios, Animal Kingdom e ' +
          'Universal Studios, de 13 a 17.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 40 },
    ],
    renuncias: null,
    ficha: null,
  },

  /* ===== 13/11 · SEXTA · EPCOT =========================================== */
  {
    id: 'd-2026-11-13',
    data: '2026-11-13',
    diaSemana: 'sexta',
    emoji: '🌍',
    titulo: 'Epcot',
    subtitulo: 'Food & Wine · a tarde é comida, não fila',
    tipo: 'parque',
    operadora: 'disney',
    parqueId: 'epcot',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-10',
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: true },

    resumo:
      'Meio dia de parque e meio de festival. A manhã resolve as três filas grandes no ' +
      'World Discovery e no World Nature; a partir das 13h o dia vira comida e caminhada ' +
      'em volta de um lago, sem nenhum compromisso de relógio até o Luminous.',

    avisos: [
      'NÃO CORRAM PARA O COSMIC REWIND NA ABERTURA. É para lá que vai o Early Entry, e ' +
      'gastar o Single Pass às 9h é gastá-lo no único horário em que ele não precisaria ser ' +
      'gasto. Vocês vão para o Test Track, na mesma área.',
      'O FOOD & WINE É O ALMOÇO E O JANTAR de hoje. Não há bloco de refeição além das ' +
      'barracas — de propósito. Peguem o passaporte na entrada.',
    ],

    notas: [
      { tipo: 'bom', texto:
        'VERIFICADO: o Food & Wine de 2026 vai de 27/08 a 21/11, então 13/11 está dentro com ' +
        'folga. O Festival of the Holidays só começa em 27/11, depois que vocês vão embora — ' +
        'vocês pegam o festival certo.', pesquisa: '2026-09-10' },

      { tipo: 'atencao', texto:
        'O TEST TRACK QUEBRA MUITO. Em 2026, um ano depois de reabrir: parada de quase 24 ' +
        'horas em 1º de agosto, outra de cinco horas no dia 23 que comeu a tarde inteira, e ' +
        'falhas mecânicas em fevereiro — sem comunicado da Disney em nenhuma delas. É por isso ' +
        'que ele é o rope drop: se vai cair, cai no meio do dia.',
        pesquisa: '2026-09-10' },

      { tipo: 'bom', texto:
        'O COSMIC REWIND NÃO TEM MAIS FILA VIRTUAL desde fevereiro de 2025. Acabou o sorteio ' +
        'às 7h da manhã: hoje é standby puro ou Single Pass. Mas ele faz 101 minutos de média ' +
        'e passa de uma hora até às 8h — não existe janela barata, e é por isso que o passe ' +
        'fica, como no dia 15.', pesquisa: '2026-09-10' },

      { tipo: 'bom', texto:
        'O WORLD SHOWCASE ABRE ÀS 9H, junto com o resto do parque. As lojas e barracas dos ' +
        'pavilhões é que só ativam por volta das 11h — o que não muda nada no roteiro de ' +
        'vocês, que só chega lá às 13h.',
        pesquisa: '2026-09-10' },

      { tipo: 'atencao', texto:
        'SÓ UM DO NÍVEL 1 NA COMPRA. No Epcot, Frozen, Remy e Test Track são do nível 1, e a ' +
        'compra antecipada leva só um: vai o Frozen. O Remy é reservado rolando, e o Multi ' +
        'Pass dele costuma esgotar antes das 11h — nos dados de agosto e setembro de 2026, ' +
        'por volta das 10h50. Por isso o Mission: SPACE é o primeiro uso, às 9h45: na saída ' +
        'dele, reservem o Remy para o fim da tarde.',
        pesquisa: '2026-09-11' },
    ],

    /* --------------------------------------------------------------------- */
    planos: [
      {
        letra: 'A',
        titulo: 'O dia como está escrito',
        gatilho: 'Vocês estão na corda às 8h15 e o Test Track está operando.',
        passos: [
          'Test Track no rope drop, sem desviar para o Cosmic Rewind.',
          'Mission: SPACE às 9h45 com o Multi Pass — e, na saída, reservem o Remy.',
          'Cosmic Rewind às 10h20 com o Single Pass e Soarin’ às 11h15 com o Multi Pass.',
          'A partir das 13h, World Showcase no sentido horário e quatro voltas de barracas.',
          'Frozen com o Multi Pass e o Remy com a reserva rolando — as duas únicas filas da tarde.',
          'Última volta às 20h e posição para o Luminous às 20h30.',
        ],
      },
      {
        letra: 'B',
        titulo: 'O Test Track está fora do ar',
        gatilho: 'Vocês chegam nele às 9h e está fechado, ou fecha durante a fila.',
        passos: [
          'ISSO ACONTECE COM FREQUÊNCIA REAL AQUI. Não esperem em frente: as paradas dele em ' +
          '2026 duraram horas, não minutos.',
          'Pivô imediato para o pavilhão do The Land — The Seas e Living with the Land, ' +
          'praticamente vazios na abertura. O Mission: SPACE continua às 9h45, com o passe.',
          'O Cosmic Rewind e o Soarin’ não mudam — os dois têm hora marcada.',
          'Se o Test Track voltar durante o dia, reservem-no rolando assim que usarem o ' +
          'Soarin’, às 11h15 — o Remy já foi reservado depois do Mission: SPACE. Se não ' +
          'voltar, não voltou: não vale reorganizar a tarde por causa dele.',
        ],
      },
      {
        letra: 'B2',
        titulo: 'O parque não abre às 9h',
        gatilho: 'O parque é 9h às 21h, oficial. O que ainda não saiu é a hora do Luminous.',
        passos: [
          'Mudem a referência do dia. A manhã inteira desloca junto, inclusive a saída das ' +
          '7h15.',
          'O LUMINOUS E A POSIÇÃO NÃO DESLOCAM: eles seguem o fechamento do parque, não a ' +
          'abertura. Se o app avisar colisão em vermelho no fim da tarde, é a última volta de ' +
          'barracas batendo na posição — e a solução é encurtar a volta, não atrasar o lugar.',
          'As quatro voltas do Food & Wine são elásticas de propósito. Elas são a folga do dia.',
        ],
      },
      {
        letra: 'C',
        titulo: 'Chuva, cansaço ou o dia desandou',
        gatilho: 'Chuva que não passa, ou vocês acordaram destruídos.',
        passos: [
          'O World Showcase é todo ao ar livre e é o coração do dia — chuva forte aqui dói ' +
          'mais que nos outros parques.',
          'O que funciona coberto: Spaceship Earth, The Seas, Living with the Land, Frozen, ' +
          'Remy e o Gran Fiesta. Todos de fila curta, e os pavilhões do Japão, Marrocos e ' +
          'Reino Unido têm área interna generosa.',
          'O QUE NÃO SE SACRIFICA: o Luminous, e as quatro voltas de barracas — que são o dia.',
          'Se o Luminous for cancelado por vento, saiam mais cedo. Amanhã não tem alarme.',
        ],
      },
    ],

    /* --------------------------------------------------------------------- */
    naoPerca: [
      { nome: 'O passaporte do Food & Wine', quando: 'hoje', custo: 'grátis',
        motivo: 'Peguem na entrada do parque. É onde vocês marcam as barracas que já fizeram ' +
                'e é o que transforma quatro voltas soltas numa coisa só. Sem ele, às 20h ' +
                'ninguém lembra o que faltou.' },

      { nome: 'Dividir cada prato entre os dois', quando: 'hoje', custo: 'economiza',
        motivo: 'É assim que o festival funciona. Dividindo, dá para provar oito a dez ' +
                'barracas ao longo da tarde; sem dividir, dá para quatro e vocês saem cheios ' +
                'na terceira. Os pratos são pequenos de propósito.' },

      { nome: 'A sopa de cheddar com bacon do Canadá', quando: 'hoje', custo: '~US$ 9',
        motivo: 'Aparece em toda lista de melhores do festival, todo ano, há mais de uma ' +
                'década. Fica no fim do anel, na volta 3 — que é justamente a hora em que ' +
                'esfria o suficiente para uma sopa fazer sentido.' },

      { nome: 'Mission: SPACE — a versão VERDE', quando: 'decidir', custo: 'incluso',
        motivo: 'A laranja gira numa centrífuga de verdade e causa enjoo em muita gente — tem ' +
                'saco no assento por um motivo. A verde é a mesma cabine sem girar, mesma ' +
                'fila, mesma história. Se qualquer um dos dois tem tendência a enjoo, a verde ' +
                'salva as duas horas seguintes, e a decisão é tomada na hora de entrar.' },
    ],

    /* --------------------------------------------------------------------- */
    prepararAmanha: {
      paraODia: '2026-11-14',
      titulo: 'Celebration e Islands à noite · sem alarme',
      aviso:
        'Depois de um dia que termina perto das 22h20 no Epcot, o dia 14 começa com bloco vazio às ' +
        '9h de propósito. Não coloquem despertador.',
      itens: [
        { texto: 'Dormir sem alarme', critico: true,
          motivo: 'O dia 14 só sai do hotel às 11h e o bloco das 9h é vazio de propósito. ' +
                  'Hoje foram catorze horas de parque; amanhã é a primeira noite da temporada de ' +
                  'Natal da Universal e vocês vão querer estar inteiros.' },
        { texto: 'Conferir o horário do Grinchmas no app da Universal', critico: true,
          motivo: 'É o Grinchmas que ancora a noite de amanhã no Islands. Quando souberem a ' +
                  'hora, editem a referência do dia 14 e a noite inteira desloca junto.' },
        { texto: 'Guardar as compras e esvaziar a mochila',
          motivo: 'Amanhã tem Celebration de dia e parque à noite — a mochila precisa sair ' +
                  'leve.' },
        { texto: 'Celular e power bank na tomada',
          motivo: 'Rotina de toda véspera.' },
        { texto: 'Se fizeram o Kali, pendurar a roupa molhada para secar',
          motivo: 'Não deixem no chão da mala: roupa e capa guardadas molhadas continuam ' +
                  'úmidas por dias.' },
      ],
    },

    /* --------------------------------------------------------------------- */
    blocos: [
      { id: 'b-1311-0715', hora: '07:15', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel',
        descricao: 'Uber, ~25 min, US$ 20–30',
        contexto:
          'O Epcot tem entrada direta e a segurança aqui é mais rápida que no Hollywood ' +
          'Studios. Saindo 7h15 vocês estão na corda às 8h15, 45 minutos antes da abertura: ' +
          'a catraca já abriu, e a espera é do lado de dentro.',
        localId: 'epcot', acesso: [], duracaoMin: 60 },

      { id: 'b-1311-0815', hora: '08:15', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão · posicionar para o WORLD DISCOVERY',
        descricao: 'Test Track, não Cosmic Rewind',
        contexto:
          'PELA QUARTA VEZ O PONTO CERTO É O CONTRAINTUITIVO, e aqui o erro seria duplo.\n\n' +
          'A CATRACA ABRE POR VOLTA DAS 7H30, uma hora antes do Early Entry, para todo mundo. ' +
          'Na Spaceship Earth o caminho se divide: quem tem Early Entry segue por um lado, e ' +
          'quem não tem é segurado do outro até as 9h. Chegando às 8h15 vocês estão nessa ' +
          'corda com mais folga que os 30 minutos que os guias pedem para quem é de fora.\n\n' +
          'Quem entra pela frente com Early Entry vai para o COSMIC REWIND — é a recomendação ' +
          'padrão para hóspedes. Correr para lá às 9h é entrar atrás de meia hora de fila já ' +
          'formada, e gastar o Single Pass no único horário em que ele não precisaria ser ' +
          'gasto.\n\n' +
          'Vocês vão para o Test Track, que fica na mesma área. Ele é a segunda pior fila do ' +
          'parque e o rope drop é a ÚNICA janela barata dele: 53 minutos agora contra 99 de ' +
          'média no resto do dia.\n\n' +
          'PONTO DE ENCONTRO DE HOJE: a Spaceship Earth — a esfera. É o símbolo do parque, ' +
          'fica na entrada e é visível de quase todo lugar. Se vocês se perderem, vão para a ' +
          'base dela e ESPEREM.\n\n' +
          'Café da manhã aqui, das barrinhas da mochila, e a foto da esfera antes de a praça ' +
          'encher.',
        localId: 'epcot', acesso: [], duracaoMin: 45, pesquisa: '2026-09-12',
        curiosidades: [
          { texto: 'A Spaceship Earth tem 55 metros e 11.324 facetas prateadas. A chuva não ' +
                   'escorre pela esfera: entra por frestas entre as facetas e desce por calhas ' +
                   'até o lago do World Showcase.',
            fonte: 'Wikipedia — Spaceship Earth', pesquisa: '2026-09-15' },
          { texto: 'O escritor Ray Bradbury ajudou a projetar a esfera e a escrever a história ' +
                   'original da atração.',
            fonte: 'Wikipedia — Spaceship Earth', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-0950', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Test Track — rope drop',
        descricao: 'A única janela barata dele. E ele quebra muito',
        contexto:
          'Vocês desenham um carro num painel e depois andam num veículo que faz testes de ' +
          'curva, freio e um trecho externo a 104 km/h. É a atração mais rápida que a Disney ' +
          'já construiu.\n\n' +
          'POR QUE AGORA E NÃO DEPOIS: 53 minutos no rope drop contra 99 de média no dia. É a ' +
          'segunda pior fila do Epcot e não existe outra janela.\n\n' +
          'E TEM UM SEGUNDO MOTIVO: em 2026, um ano depois de reabrir, o Test Track quebrou ' +
          'muito — parada de quase 24 horas em 1º de agosto, outra de cinco horas no dia 23 ' +
          'que comeu a tarde inteira, e falhas mecânicas em fevereiro. Se ele vai cair, cai no ' +
          'meio do dia. Andar agora é a única forma de não depender disso.',
        areaParque: 'World Discovery', acesso: ['rope-drop', 'standby'], acessoAlt: 'single-rider',
        critico: true,
        duracaoMin: 45,
        fila: { min: 53, quando: 'no rope drop', pico: 99, fonte: '2026-09-10' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'A primeira versão atrasou quase dois anos por problemas nas rodas e no ' +
                   'software e só abriu em 1999, no lugar do World of Motion. A atual, a ' +
                   'terceira, reabriu em 22/07/2025, de novo com a General Motors.',
            fonte: 'Wikipedia — Test Track', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-1035', hora: '09:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mission: SPACE — Orange',
        descricao: 'Multi Pass · lista baixa. Na saída, reservem o Remy',
        contexto:
          'Simulador de lançamento espacial dentro de uma centrífuga que gera força G real. A ' +
          'versão LARANJA causa enjoo em muita gente — tem saco no assento por um motivo.\n\n' +
          'A VERDE é a mesma cabine sem girar, e a fila é a mesma até o ponto em que vocês ' +
          'escolhem. Se qualquer um dos dois tem tendência a enjoo, peguem a verde: não é ' +
          'vergonha nenhuma e salva as duas horas seguintes.\n\n' +
          'É O PRIMEIRO USO DO MULTI PASS, e cada reserva usada libera a próxima. NA SAÍDA, ' +
          'RESERVEM O REMY no app, para o fim da tarde: o Multi Pass dele costuma esgotar ' +
          'antes das 11h.',
        areaParque: 'World Discovery', acesso: ['multi-pass'], duracaoMin: 33,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 40, estimado: true, fonte: '2026-09-10' },
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Ocupa o terreno do Horizons, que fechou em 1999. A inauguração, em 2003, ' +
                   'teve o administrador da NASA e astronautas, e até 2017 quem falava com os ' +
                   'tripulantes pelo rádio era o Gary Sinise, de Apollo 13. Hoje é a Gina ' +
                   'Torres.',
            fonte: 'Wikipedia — Mission: Space', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-0900', hora: '10:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Guardians of the Galaxy: Cosmic Rewind',
        descricao: 'Single Pass, janela entre 10h15 e 10h45',
        contexto:
          'Montanha-russa fechada e no escuro, com lançamento e cabines que giram 360° para ' +
          'onde a cena está acontecendo. Sem inversões, mas rápida. Cada volta sorteia uma ' +
          'música diferente dos anos 70 e 80. É a melhor atração do Epcot.\n\n' +
          'POR QUE O PASSE FICA: ele faz 101 minutos de média e as fontes são diretas — mesmo ' +
          'às 8h da manhã ele passa de uma hora. Não existe janela barata em nenhum momento ' +
          'do dia, e é a mesma situação do Rise of the Resistance no dia 15.\n\n' +
          'A fila virtual acabou em fevereiro de 2025: hoje é standby ou Single Pass, sem ' +
          'sorteio às 7h da manhã.',
        areaParque: 'World Discovery', acesso: ['single-pass'], critico: true, duracaoMin: 45,
        fila: { min: 10, quando: 'com o Single Pass', pico: 101, fonte: '2026-09-10' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'Foi a primeira montanha-russa da Disney lançada de ré e é uma das mais ' +
                   'longas do mundo em ambiente fechado, com 1,7 km. Custou cerca de US$ 500 ' +
                   'milhões e ocupa o lugar do Universe of Energy, fechado em 2017.',
            fonte: 'Wikipedia — Guardians of the Galaxy: Cosmic Rewind', pesquisa: '2026-09-15' },
          { texto: 'As seis músicas que podem ser sorteadas: September, One Way or Another, ' +
                   'Everybody Wants to Rule the World, Conga, I Ran e Disco Inferno.',
            fonte: 'Wikipedia — Guardians of the Galaxy: Cosmic Rewind', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-1115', hora: '11:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Soarin’ Across America',
        descricao: 'Multi Pass · lista baixa. Filme novo desde maio de 2026',
        contexto:
          'Vocês sentam num banco que sobe e balança na frente de uma tela IMAX côncava, com ' +
          'sensação de estar voando de pernas soltas. Tem cheiro sincronizado com as cenas. ' +
          'Suave, sem emoção forte — agrada praticamente todo mundo.\n\n' +
          'O filme é o Across America desde 26/05/2026, com trilha nova e uma fila temática ' +
          'da National Geographic.\n\n' +
          'A fila dele sai de praticamente zero na abertura para 74 minutos às 16h. Com o ' +
          'Multi Pass às 11h15 ela deixa de importar, e ele fecha a manhã antes do World ' +
          'Showcase.',
        areaParque: 'World Nature', acesso: ['multi-pass'], duracaoMin: 45,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 74, fonte: '2026-09-10' },
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'O mecanismo nasceu de um protótipo que o engenheiro Mark Sumner montou com ' +
                   'Meccano e barbante. O filme Across America, de 26/05/2026, foi feito para ' +
                   'os 250 anos dos Estados Unidos.',
            fonte: 'Wikipedia — Soarin’', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-1200', hora: '12:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'The Seas e Living with the Land',
        descricao: 'Os dois no mesmo pavilhão. Fila curta, ar-condicionado',
        contexto:
          'The Seas é um aquário enorme, com peixes-boi, e dá para ficar o tempo ' +
          'que quiserem. Living with the Land é um passeio de barco por estufas hidropônicas ' +
          'REAIS, onde a Disney cultiva parte do que serve nos restaurantes do parque — ' +
          'inclusive o que vocês podem comer hoje.\n\n' +
          'Os dois são calmos, quase sem fila, e caem na pior hora de calor de propósito.',
        areaParque: 'World Nature', acesso: ['standby'], duracaoMin: 40,
        fila: { min: 10, quando: 'quase sempre', pico: 25, estimado: true, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'O aquário do The Seas tem 21,6 milhões de litros, o segundo maior dos ' +
                   'Estados Unidos. Os dois peixes-boi são animais resgatados.',
            fonte: 'Wikipedia — The Seas with Nemo & Friends', pesquisa: '2026-09-15' },
          { texto: 'As estufas do Living with the Land colhem mais de 30 toneladas por ano, ' +
                   'servidas no Garden Grill e no Sunshine Seasons, e um pé de tomate delas ' +
                   'entrou no Guinness: mais de 32 mil tomates em 16 meses.',
            fonte: 'Wikipedia — Living with the Land', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-1240p', hora: '12:40', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — antes de virar o dia',
        descricao: 'A partir daqui o Epcot é outro parque. Banheiro dentro do The Land, junto do Sunshine Seasons',
        contexto:
          'Banheiro, flasks cheios e sentar.\n\n' +
          'DAQUI PARA A FRENTE O DIA MUDA DE NATUREZA: acabaram as filas e começa o World ' +
          'Showcase, que é comida e caminhada. Não há mais nenhum compromisso de relógio até ' +
          'o Luminous, às 21h.\n\n' +
          'Não comam agora: em vinte minutos vocês estarão na primeira barraca.',
        areaParque: 'World Nature', acesso: [], duracaoMin: 14 },

      { id: 'b-1311-1245', hora: '13:00', ancora: 'referencia', tipo: 'livre',
        titulo: 'World Showcase — México',
        descricao: 'Comecem aqui, sentido horário',
        contexto:
          'O World Showcase são onze pavilhões de países ao redor de um lago, cada um com ' +
          'arquitetura, lojas e comida do país, e funcionários nativos daquele país — ' +
          'estudantes num programa de intercâmbio da Disney. Dá para conversar em espanhol no ' +
          'México e em português no… não, não tem Brasil. Mas o México resolve.\n\n' +
          'A volta completa a pé é de cerca de 2 km. Sentido horário a partir do México deixa ' +
          'França, Reino Unido e Canadá para o fim da tarde, que é quando eles ficam bonitos.',
        areaParque: 'World Showcase', acesso: [], duracaoMin: 20 },

      { id: 'b-1311-1300', hora: '13:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Gran Fiesta Tour',
        descricao: 'Barquinho dentro da pirâmide. Fila mínima',
        contexto:
          'Passeio de barco lento dentro do pavilhão do México, que por dentro é um mercado ' +
          'noturno cenográfico permanente, com vulcão ao fundo. Fresco, escuro e quase sempre ' +
          'sem fila. É o clássico mais subestimado do parque.',
        areaParque: 'World Showcase', acesso: ['standby'], duracaoMin: 20,
        fila: { min: 5, quando: 'quase sempre', pico: 15, estimado: true, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'Até 2007 o passeio se chamava El Río del Tiempo. A versão atual ganhou o ' +
                   'Pato Donald e os Três Cavaleiros.',
            fonte: 'Wikipedia — Mexico Pavilion at Epcot', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-1330', hora: '13:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Frozen Ever After',
        descricao: 'Noruega. Multi Pass · lista alta',
        contexto:
          'Passeio de barco pelo mundo de Frozen, com animatrônicos muito bons e um trecho ' +
          'curto de ré. A fila é sempre desproporcional ao tamanho da atração — 45 a 75 ' +
          'minutos —, e é por isso que ela leva a lista alta do Multi Pass.\n\n' +
          'É AQUI QUE O MULTI PASS SE PAGA. Esta e o Remy são as duas únicas filas do World ' +
          'Showcase, e elas competem diretamente com as barracas do Food & Wine, que é o que ' +
          'vocês vieram fazer. Nos outros dias a fila compete com outra fila; aqui compete com ' +
          'o dia.',
        areaParque: 'World Showcase', acesso: ['multi-pass'], duracaoMin: 40,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 75, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'Usa os barcos e o percurso do Maelstrom, a atração viking que funcionou ' +
                   'aqui até 2014. O pavilhão da Noruega, de 1988, é o país mais novo do World ' +
                   'Showcase.',
            fonte: 'Wikipedia — Frozen Ever After; Wikipedia — World Showcase', pesquisa: '2026-09-15' },
          { texto: 'Foram os primeiros animatrônicos totalmente elétricos da Disney, e em ' +
                   '12/02/2026 os três personagens principais ganharam a tecnologia do World ' +
                   'of Frozen de Hong Kong.',
            fonte: 'Wikipedia — Frozen Ever After', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-1415', hora: '14:20', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Food & Wine — volta 1',
        descricao: 'China, Alemanha, Itália. E é isto o almoço',
        contexto:
          'Barracas espalhadas pelo World Showcase, cada uma com dois a quatro pratos pequenos ' +
          'e bebidas. PEGUEM O PASSAPORTE na entrada do parque.\n\n' +
          'A ESTRATÉGIA: dividam cada prato entre os dois e provem oito a dez barracas ao ' +
          'longo da tarde, em vez de fazer três refeições. É assim que o festival funciona, e ' +
          'é por isso que hoje não existe bloco de almoço nem de jantar — o Food & Wine É as ' +
          'duas refeições, servidas em quatro voltas.\n\n' +
          'Destaques que se repetem todo ano: Canadá (sopa de cheddar com bacon), Alemanha, ' +
          'Grécia e o waffle da Bélgica. O cardápio de 2026 sai no app da Disney.\n\n' +
          'A caminhada entre os pavilhões está dentro da duração deste bloco — ele não é uma ' +
          'parada, é a volta.',
        areaParque: 'World Showcase', acesso: [], duracaoMin: 70,
        curiosidades: [
          { texto: 'A Alemanha foi projetada com um passeio de barco pelos rios Reno, Tauber, ' +
                   'Ruhr e Isar que nunca foi construído. O saguão de entrada dele virou salão ' +
                   'de restaurante.',
            fonte: 'Wikipedia — Germany Pavilion at Epcot', pesquisa: '2026-09-15' },
          { texto: 'O templo da China copia o Templo do Céu, de Pequim. O campanário e o ' +
                   'palácio da Itália copiam a Praça de São Marcos, de Veneza.',
            fonte: 'Wikipedia — China Pavilion at Epcot; Wikipedia — Italy Pavilion at Epcot', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-1600', hora: '15:30', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Food & Wine — volta 2',
        descricao: 'Japão, Marrocos. O trecho mais bonito do anel',
        contexto:
          'O pavilhão do Japão tem uma loja de departamentos de verdade, a Mitsukoshi, que é ' +
          'a melhor loja do World Showcase. O do Marrocos é o mais elaborado ' +
          'arquitetonicamente e quase sempre o mais vazio.\n\n' +
          'Caminhada inclusa na duração.',
        areaParque: 'World Showcase', acesso: [], duracaoMin: 75,
        curiosidades: [
          { texto: 'O pagode do Japão copia o do templo Horyuji, e o portão na água, o do ' +
                   'santuário de Itsukushima. A Mitsukoshi daqui é a única filial da rede que ' +
                   'sobrou na América do Norte.',
            fonte: 'Wikipedia — Japan Pavilion at Epcot', pesquisa: '2026-09-15' },
          { texto: 'O Marrocos, de 1984, foi patrocinado diretamente pelo governo marroquino ' +
                   'até 2020.',
            fonte: 'Wikipedia — World Showcase', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-1700', hora: '16:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Remy’s Ratatouille Adventure',
        descricao: 'França. Multi Pass rolando, reservado às 9h45',
        contexto:
          'Vocês encolhem ao tamanho de um rato e andam por uma cozinha em escala gigante, em ' +
          'veículos sem trilhos com telas e cheiro sincronizado. Sem emoção forte, e a ' +
          'escala do cenário é o ponto alto.\n\n' +
          'Segunda das duas filas do World Showcase, e a segunda razão do Multi Pass: 40 a 60 ' +
          'minutos no standby, dez com o passe.\n\n' +
          'É A RESERVA ROLANDO, feita na saída do Mission: SPACE. SE NÃO HOUVER HORÁRIO, a ' +
          'fila de standby do Remy à tarde fica perto de uma hora: decidam na hora entre ' +
          'trocar a volta 2 pela fila ou deixar o Remy de fora.',
        areaParque: 'World Showcase', acesso: ['multi-pass'], duracaoMin: 45,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 60, fonte: '2026-09-10' },
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Estreou em 01/10/2021, nos 50 anos do Walt Disney World, copiando a ' +
                   'atração que a Disneyland Paris abriu em 2014. Os diálogos alternam inglês ' +
                   'e francês.',
            fonte: 'Wikipedia — Remy’s Ratatouille Adventure', pesquisa: '2026-09-15' },
          { texto: 'Desde novembro de 2025 roda sem óculos 3D, e em 2026 ganhou objetos de ' +
                   'cenário gigantes.',
            fonte: 'Guide2WDW; WDWNT', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-1745', hora: '17:30', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Food & Wine — volta 3',
        descricao: 'França, Reino Unido, Canadá. O jantar de vocês',
        contexto:
          'A volta mais longa e a melhor: os três pavilhões finais são os mais gostosos ao ' +
          'entardecer, e o Canadá tem a sopa de cheddar com bacon que aparece em toda lista ' +
          'de melhores do festival.\n\n' +
          'O pub do Reino Unido serve cerveja de verdade e costuma ter música ao vivo no ' +
          'pátio. É o melhor lugar do parque para sentar sem pressa.\n\n' +
          'ESTE É O JANTAR. Não há outro bloco de refeição hoje — de propósito.',
        areaParque: 'World Showcase', acesso: [], duracaoMin: 85,
        curiosidades: [
          { texto: 'O Les Chefs de France foi aberto em 1982 por Paul Bocuse, Roger Vergé e ' +
                   'Gaston Lenôtre. Desde 1996 é tocado pelo filho de Bocuse, Jérôme.',
            fonte: 'Wikipedia — France Pavilion at Epcot', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-1900', hora: '19:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Spaceship Earth',
        descricao: 'A fila some à noite. A esfera por dentro',
        contexto:
          'O passeio dentro da esfera geodésica que é o símbolo do Epcot. Conta a história da ' +
          'comunicação humana em cenários com animatrônicos, subindo em espiral até o topo. ' +
          'Lento e climatizado.\n\n' +
          'À noite a fila praticamente some, e vocês passam por ela de qualquer jeito na ' +
          'volta para o lago.',
        areaParque: 'World Celebration', acesso: ['standby'], duracaoMin: 50,
        fila: { min: 10, quando: 'à noite', pico: 40, estimado: true, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'A narradora é a Judi Dench, desde 2007. Antes dela vieram Vic Perrin, ' +
                   'Walter Cronkite e Jeremy Irons.',
            fonte: 'Wikipedia — Spaceship Earth', pesquisa: '2026-09-15' },
          { texto: 'Na D23 de agosto de 2026 a Disney anunciou uma versão nova da atração, ' +
                   'sobre conexão humana e a era da internet. Ainda não há data de fechamento.',
            fonte: 'Wikipedia — Spaceship Earth; Inside the Magic', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-2000', hora: '20:00', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Food & Wine — última volta',
        descricao: 'O que ficou faltando, a caminho do lago',
        contexto:
          'Última passada nas barracas que vocês marcaram no passaporte e não fizeram. As ' +
          'filas das barracas caem depois das 20h, quando a maioria já está pegando lugar ' +
          'para o show.\n\n' +
          'Comprem a bebida AGORA e levem para o lugar do Luminous — de lá não dá para sair ' +
          'sem perder a vaga.',
        areaParque: 'World Showcase', acesso: [], duracaoMin: 30 },

      { id: 'b-1311-2030p', hora: '20:30', ancora: 'fixo', tipo: 'espera',
        titulo: 'Posição para o Luminous',
        descricao: 'Margem entre México e Noruega. Trinta minutos antes',
        contexto:
          'A margem entre o México e a Noruega tem visão frontal do lago e esvazia mais rápido ' +
          'na saída — as duas coisas importam.\n\n' +
          'Trinta minutos antes não é exagero em noite de festival. Levem a bebida da barraca ' +
          'anterior: de lá não dá para sair e voltar.\n\n' +
          'HORÁRIO FIXO, colado no show.',
        areaParque: 'World Showcase', acesso: [], duracaoMin: 30,
        curiosidades: [
          { texto: 'A volta completa do lago do World Showcase tem 1,9 km.',
            fonte: 'Wikipedia — Epcot', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1311-2100', hora: '21:00', ancora: 'fixo', tipo: 'show',
        titulo: 'Luminous: The Symphony of Us',
        descricao: '~17 min. Fogos, fontes e projeção nas telas dos barcos',
        contexto:
          'Espetáculo noturno sobre o lago do World Showcase, com fogos, fontes dançantes e ' +
          'projeção em telas montadas em barcos. Cerca de 17 minutos.\n\n' +
          'HORÁRIO FIXO, e ele SEGUE O FECHAMENTO DO PARQUE, não a abertura. Com fechamento às ' +
          '21h ele é às 21h. Confiram no app da Disney e ajustem aqui se mudar — este bloco e ' +
          'a posição andam juntos.',
        areaParque: 'World Showcase', acesso: [], duracaoMin: 20,
        confirmarHorario: true, pesquisa: '2026-09-10' },

      { id: 'b-1311-2120', hora: '21:20', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Uber, ~25 min, US$ 20–30. Amanhã é Celebration, sem alarme',
        contexto:
          'Saindo pela entrada principal, a caminhada do World Showcase até o ponto de ' +
          'rideshare é longa — uns quinze minutos, contra o fluxo de todo mundo saindo ao ' +
          'mesmo tempo.\n\n' +
          'ATALHO: se a fila do Uber estiver impossível, o International Gateway fica do ' +
          'outro lado do lago, perto do Reino Unido, e costuma escoar mais rápido. Confiram no ' +
          'app qual dos dois pontos está mais perto de vocês quando o show acabar.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 60 },
    ],

    ficha: {
      multiPass: {
        usar: true, opcional: false,
        listaAlta: ['Frozen Ever After'],
        listaBaixa: ['Mission: SPACE', 'Soarin’ Across America'],
        rolando: ['Remy’s Ratatouille Adventure'],
        planoB:
          'Se o Test Track estiver fechado de manhã e voltar, reservem-no rolando assim que ' +
          'usarem o Soarin’, às 11h15.',
        nota:
          'DECIDIDO: comprar. O Epcot é o único parque em que a fila compete com o que ' +
          'vocês vieram fazer — o Frozen e o Remy são as duas únicas filas do World ' +
          'Showcase, e são 45–75 e 40–60 minutos parados no meio das barracas do Food & ' +
          'Wine.\n\n' +
          'Nível 1 no Epcot: Frozen, Remy e Test Track — só um entra na compra antecipada. ' +
          'Vai o Frozen, a fila maior; o Test Track é o rope drop; o Remy é reservado rolando ' +
          'na saída do Mission: SPACE, às 9h45, porque o Multi Pass dele costuma esgotar ' +
          'antes das 11h. Sem horário, ele vai de standby.',
      },
      singlePass: {
        itens: ['Guardians of the Galaxy: Cosmic Rewind'], opcionais: [],
        nota:
          'Segundo dia seguido em que o passe se justifica. O Cosmic Rewind faz 101 minutos ' +
          'de média e passa de uma hora mesmo às 8h — não existe janela barata em nenhum ' +
          'momento do dia, diferente do TRON e do Flight of Passage.\n\n' +
          'Peçam janela entre 10h15 e 10h45: logo depois do Mission: SPACE, que é o primeiro ' +
          'uso do Multi Pass.',
      },
      expressPass: null,
      custoEstimadoCasal: { min: 60, max: 110, moeda: 'USD' },
      extras: [
        { nome: 'Estratégia do Food & Wine',
          texto:
            'Peguem o passaporte na entrada. Dividam cada prato entre os dois e provem 8 a 10 ' +
            'barracas, em vez de fazer três refeições. Destaques recorrentes: Canadá (sopa de ' +
            'cheddar com bacon), Alemanha, Grécia, Bélgica (waffle).' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'The American Adventure — 30 minutos de história americana contada por ' +
                 'animatrônicos, numa tarde que é das barracas do Food & Wine e do Remy' },
        { nome: 'Journey Into Imagination' }, { nome: 'Awesome Planet' },
        { nome: 'Turtle Talk with Crush' }, { nome: 'Disney & Pixar Short Film Festival' },
        { nome: 'Os filmes 360° da China e do Canadá' },
      ],
      fechado: [],
    },
  },

  /* ===== 14/11 · SÁBADO · CELEBRATION + ISLANDS À NOITE ================== */
  {
    id: 'd-2026-11-14',
    data: '2026-11-14',
    diaSemana: 'sábado',
    emoji: '🎄',
    titulo: 'Celebration e Islands à noite',
    subtitulo: 'Entrada extra no Islands, sem custo de ingresso',
    tipo: 'livre',
    operadora: 'universal',
    parqueId: 'islands-of-adventure',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-10',
    notaCusto:
      'A ENTRADA no Islands hoje é extra e não custa nada — o ingresso Universal de vocês ' +
      'já cobre. Mas o DIA custa: almoço de mesa no Columbia com gorjeta, sorvete, quatro ' +
      'corridas de Uber, duas cervejas amanteigadas e o jantar. Contem US$ 200 a 260 no ' +
      'casal. O que é de graça é a noite de Natal, não o sábado.',

    // A âncora do dia NÃO é abertura de parque. É a sessão do Grinchmas, que é o
    // único compromisso de relógio da noite e a única coisa que o dia 23 não cobre.
    referencia: { rotulo: 'Sessão do Grinchmas', padrao: '17:30', confirmado: false },

    resumo:
      'Sábado, e sábado é o pior dia para parque. A manhã é Celebration a pé e a tarde é ' +
      'hotel. À noite vocês entram no Islands pela primeira noite da temporada de Natal — ' +
      'mas com um alvo só: o Grinchmas. O resto da Hogsmeade decorada vocês reveem no dia 23, ' +
      'numa segunda-feira.',

    avisos: [
      'O GRINCHMAS É O ÚNICO COMPROMISSO DE RELÓGIO DA NOITE. Plateia por ordem de chegada, ' +
      'sem Express Pass, e a grade típica termina às 18h30. O roteiro mira a sessão das ' +
      '17h30 para ter a das 18h30 como plano B.',
      'Não tentem atração grande hoje. Hagrid’s, VelociCoaster e Forbidden Journey são do ' +
      'dia 23, e hoje é o sábado de estreia da temporada de Natal.',
    ],

    notas: [
      { tipo: 'bom', texto:
        'VERIFICADO: a temporada de Natal da Universal em 2026 vai de 14/11 a 03/01. Vocês ' +
        'pegam literalmente a PRIMEIRA noite, com o Grinchmas e a projeção no castelo já ' +
        'rodando.', pesquisa: '2026-09-10' },

      { tipo: 'atencao', texto:
        'A PRIMEIRA NOITE DA TEMPORADA CAI NUM SÁBADO, e isso é o pior dos dois mundos em ' +
        'lotação. É por isso que o dia tem UM alvo e não uma lista: o Grinchmas, que é ' +
        'plateia sentada e não fila de atração. Tudo o mais hoje é bônus.',
        pesquisa: '2026-09-10' },

      { tipo: 'atencao', texto:
        'O GRINCHMAS TERMINA CEDO. A grade típica é 10h15, 11h15, 12h15, 13h15, 15h30, ' +
        '16h30, 17h30 e 18h30 — seis a oito sessões, e a última por volta das 18h30. Entrar ' +
        'no parque às 18h30 seria cruzar o portão com o último show começando do outro lado.',
        pesquisa: '2026-09-10' },

      { tipo: 'bom', texto:
        'A PROJEÇÃO NO CASTELO REPETE A CADA VINTE MINUTOS até o parque fechar, e as sessões ' +
        'mais tarde têm visão melhor porque a plateia vai rareando. Não é coisa de pegar na ' +
        'hora exata — por isso ela é o bloco mais relaxado da noite.',
        pesquisa: '2026-09-10' },

      { tipo: 'atencao', texto:
        'A NEVE DE CELEBRATION NÃO ACONTECE NAS DATAS DE VOCÊS. O Now Snowing, com neve de ' +
        'sabão na Market Street às 18h, 19h, 20h e 21h, roda de 28/11 a 31/12. Vocês voltam ' +
        'ao Brasil em 26/11. Não adianta voltar de carro depois — fica registrado para não ' +
        'ser reproposto.', pesquisa: '2026-09-10' },
    ],

    /* --------------------------------------------------------------------- */
    planos: [
      {
        letra: 'A',
        titulo: 'A sessão das 17h30 existe',
        gatilho: 'Vocês conferem a grade no app da Universal e há sessão às 17h30.',
        passos: [
          'Saem do hotel 16h, entram no parque 16h45 e vão direto para o Seuss Landing.',
          'Fila do Grinchmas às 17h, trinta minutos antes. É o único bloco que não admite atraso.',
          'Depois do show, Hogsmeade a pé — são oito minutos pelo Lost Continent.',
          'Projeção no castelo quando escurecer, e ela repete a cada vinte minutos.',
          'Jantar no Three Broomsticks, dentro da decoração.',
        ],
      },
      {
        letra: 'B',
        titulo: 'A grade é outra',
        gatilho: 'Não há sessão às 17h30, ou a última é mais cedo do que o esperado.',
        passos: [
          'MUDEM A REFERÊNCIA DO DIA para a sessão que vocês vão pegar. Tudo até a cerveja ' +
          'amanteigada desloca junto, inclusive a hora de sair do hotel.',
          'A PROJEÇÃO NO CASTELO NÃO DESLOCA: ela segue o pôr do sol, não o Grinchmas. Se o ' +
          'app avisar colisão em vermelho ali, é isso — e a solução é só esperar a próxima ' +
          'sessão, que vem em vinte minutos.',
          'Se a única sessão possível for a das 18h30, saiam do hotel às 17h e aceitem que a ' +
          'Hogsmeade fica para depois do show. Não é perda: vocês voltam no dia 23.',
        ],
      },
      {
        letra: 'C',
        titulo: 'Chuva, cansaço, ou a fila do Grinchmas já fechou',
        gatilho: 'Chegaram e o teatro está cheio, ou o corpo não colaborou.',
        passos: [
          'NÃO INSISTAM. Este dia inteiro é de graça e nada aqui é insubstituível — a ' +
          'Hogsmeade decorada e a projeção no castelo vocês veem no dia 23 de qualquer jeito.',
          'Se o teatro fechou, peguem a sessão seguinte se houver, ou vão direto para ' +
          'Hogsmeade e transformem a noite em jantar com decoração.',
          'Se estiverem destruídos, cortem a Universal inteira e jantem na 192. Amanhã é ' +
          'Hollywood Studios com saída às 7h e é ele que vocês estão protegendo.',
          'O único custo de cancelar hoje é o Uber que não foi gasto.',
        ],
      },
    ],

    /* --------------------------------------------------------------------- */
    naoPerca: [
      { nome: 'Grinchmas Who-liday Spectacular', quando: 'hoje', custo: 'incluso no ingresso',
        motivo: 'É o motivo de vocês virem hoje. Musical de 30 minutos com o Grinch ' +
                'improvisando com a plateia. No dia 23 ele custaria 45 minutos que vocês vão ' +
                'querer no Hagrid’s — hoje custa uma noite que já é de graça.',
        pesquisa: '2026-09-10' },

      { nome: 'The Magic of Christmas at Hogwarts Castle', quando: 'hoje',
        custo: 'incluso no ingresso',
        motivo: 'Projeção mapeada no castelo, 7 minutos, repetindo a cada vinte até o ' +
                'fechamento. As sessões mais tarde são melhores porque o pátio vai esvaziando. ' +
                'Vocês veem hoje e podem rever no dia 23.',
        pesquisa: '2026-09-10' },

      { nome: 'A cerveja amanteigada no carrinho externo', quando: 'hoje', custo: '~US$ 8',
        motivo: 'É exatamente a mesma bebida que a de dentro do Three Broomsticks, e a fila ' +
                'do carrinho é sempre menor. A versão frozen é a mais pedida.' },

      { nome: 'Now Snowing em Celebration', quando: 'fechada', custo: 'grátis',
        motivo: 'Neve de sabão na Market Street toda noite às 18h, 19h, 20h e 21h — mas de ' +
                '28/11 a 31/12. Vocês voltam em 26/11 e não pegam de jeito nenhum. Registrado ' +
                'para ninguém propor voltar de carro por causa disso.',
        pesquisa: '2026-09-10' },

      { nome: 'Toothsome Chocolate Emporium', quando: 'descartado', custo: '~US$ 60 no casal',
        motivo: 'Fica de fora pela espera. Restaurante steampunk no CityWalk, famoso ' +
                'pelos milkshakes exagerados. Não aceita reserva e a espera passa de uma hora ' +
                'em fim de semana — num sábado de abertura de temporada, depois de um dia ' +
                'inteiro, é esperar em pé. O Three Broomsticks entrega jantar dentro da ' +
                'decoração que vocês vieram ver.',
        pesquisa: '2026-09-10' },

      { nome: 'As atrações grandes do Islands', quando: 'dia 23', custo: 'incluso',
        motivo: 'Hagrid’s, VelociCoaster e Forbidden Journey são o dia 23, numa segunda-feira ' +
                'de semana de Thanksgiving. ' +
                'Hoje é sábado e primeira noite da temporada: o pior momento possível para ' +
                'encarar fila.' },
    ],

    /* --------------------------------------------------------------------- */
    prepararAmanha: {
      paraODia: '2026-11-15',
      titulo: 'Hollywood Studios · alarme 6h, saída 7h',
      aviso:
        'Amanhã é o dia mais caro em passes da viagem e o que menos perdoa atraso. Hoje ' +
        'vocês voltam por volta das 22h — deixem tudo pronto antes de sair para a Universal, ' +
        'não depois.',
      itens: [
        { texto: 'Conferir se as reservas de Lightning Lane do dia 15 aparecem no app',
          critico: true,
          motivo: 'Multi Pass: Rock ’n’ Roller Coaster na lista alta, Torre do Terror e ' +
                  'Star Tours na baixa — o Runaway Railway se reserva lá dentro. Single ' +
                  'Pass do Rise of the Resistance. Tudo saiu em 08/11, na compra única. Se ' +
                  'faltar alguma, hoje ainda dá para comprar ou para replanejar.' },
        { texto: 'Conferir o horário de abertura do Hollywood Studios', critico: true,
          motivo: 'O dia 15 assume 9h. Se for outro, mudem a referência e a manhã inteira ' +
                  'desloca junto, inclusive a saída das 7h.' },
        { texto: 'Alarme para 6h nos dois celulares', critico: true,
          motivo: 'Saída às 7h. Depois de uma noite que termina às 22h, um alarme só falha.' },
        { texto: 'Mochila montada ANTES de sair para a Universal', critico: true,
          motivo: 'Voltando perto das 22h, ninguém monta mochila. Deixem pronta agora, na ' +
                  'hora do descanso da tarde: os soft flasks, barrinhas, protetor solar, power ' +
                  'bank, cabo e uma camada leve para cada um.' },
        { texto: 'Reserva do Oga’s Cantina à mão: 356259476987',
          motivo: 'Os dois são de horário fixo amanhã. Deixem os números acessíveis no ' +
                  'celular hoje.' },
      ],
    },

    /* --------------------------------------------------------------------- */
    blocos: [
      { id: 'b-1411-0900', hora: '09:00', ancora: 'fixo', tipo: 'vazio',
        titulo: 'VAZIO PROPOSITAL',
        descricao: 'Dormir até acordar, café no hotel, piscina',
        contexto:
          'Não preencham. Sábado é o pior dia para parque e o melhor para recuperar — e ' +
          'vocês vêm de três dias seguidos que terminaram tarde.\n\n' +
          'Hoje não tem alarme e não tem hora até as 11h.',
        acesso: [], duracaoMin: 120 },

      { id: 'b-1411-1100', hora: '11:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Uber para Celebration',
        descricao: '10 min, US$ 10–15',
        contexto:
          'Cidade planejada e construída pela Disney nos anos 90 como projeto de urbanismo — ' +
          'não é atração, é uma cidade de verdade onde mora gente. Arquitetura de vila ' +
          'americana idealizada, tudo a pé.',
        localId: 'celebration', acesso: [], duracaoMin: 15 },

      { id: 'b-1411-1115', hora: '11:15', ancora: 'fixo', tipo: 'livre',
        titulo: 'Market Street, o lago, o coreto, a Water Tower Place',
        descricao: 'A pé, sem pressa. É o oposto de um dia de parque',
        contexto:
          'O centrinho cabe numa caminhada de uma hora. O lago com o coreto é o cartão ' +
          'postal, e as varandas de madeira das casas são a coisa mais fotografada da ' +
          'cidade.\n\n' +
          'NÃO PROCUREM A NEVE. A Market Street tem neve de sabão todas as noites no Natal — ' +
          'mas o Now Snowing roda de 28/11 a 31/12, e vocês voltam ao Brasil em 26/11. Não ' +
          'dá para pegar nem voltando de carro depois.\n\n' +
          'A feira de produtores é aos domingos e hoje é sábado. Também não é perda grande.',
        localId: 'celebration', acesso: [], duracaoMin: 75, pesquisa: '2026-09-10' },

      { id: 'b-1411-1230', hora: '12:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Almoço — Columbia Restaurant',
        descricao: 'Reserva. Peçam o "1905 Salad", preparado na mesa, e o sanduíche cubano',
        contexto:
          'Filial do restaurante espanhol-cubano mais antigo da Flórida, fundado em Tampa em ' +
          '1905. O 1905 Salad é montado e temperado na frente de vocês.\n\n' +
          'HORÁRIO FIXO de reserva.',
        restauranteId: 'r-columbia', localId: 'celebration', acesso: ['reserva'],
        duracaoMin: 90 },

      { id: 'b-1411-1400', hora: '14:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Kilwins — sorvete',
        descricao: 'Na Market Street. Fudge feito na loja',
        localId: 'celebration', acesso: [], duracaoMin: 30 },

      { id: 'b-1411-1445', hora: '14:30', ancora: 'fixo', tipo: 'vazio',
        titulo: 'Voltar ao hotel e descansar',
        descricao: 'Hora e meia. A noite vai até as 21h30',
        contexto:
          'Não é folga sobrando: a noite de hoje termina tarde e amanhã é Hollywood Studios ' +
          'com saída às 7h. Deitem.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 90 },

      { id: 'b-1411-1800', hora: '16:00', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair para a Universal',
        descricao: 'Uber, ~30 min, US$ 28–40. Passem pelo CityWalk',
        contexto:
          'O CityWalk é a área de restaurantes e lojas entre os dois parques da Universal. ' +
          'Entrada livre, sem ingresso — é por onde vocês passam para chegar ao Islands.\n\n' +
          'Não parem para comer agora. O jantar é dentro do parque, na Hogsmeade decorada.',
        localId: 'citywalk', acesso: [], duracaoMin: 45 },

      { id: 'b-1411-1830', hora: '16:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Entrada no Islands of Adventure',
        descricao: 'Entrada extra, custo zero. Sigam direto para o Seuss Landing',
        contexto:
          'O ingresso Universal de vocês já cobre hoje — esta noite não custa nada a mais.\n\n' +
          'Do portão, o Seuss Landing fica logo à direita, a uns quatro minutos. Vão direto: ' +
          'a fila do Grinchmas é o único compromisso de relógio da noite.\n\n' +
          'PONTO DE ENCONTRO DE HOJE: o farol do Port of Entry, o Pharos Lighthouse, na beira ' +
          'da lagoa. O parque é um anel, e o Port of Entry é o único ponto por onde todo mundo ' +
          'passa.',
        localId: 'islands-of-adventure', acesso: [], duracaoMin: 15,
        curiosidades: [
          { texto: 'O farol do Port of Entry, o Pharos Lighthouse, funciona de verdade: toda ' +
                   'noite manda um facho de luz para guiar quem entra e sai do parque.',
            fonte: 'Wikipedia — Universal Islands of Adventure', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1411-1700', hora: '17:00', ancora: 'referencia', tipo: 'espera',
        titulo: 'Fila do Grinchmas — trinta minutos antes',
        descricao: 'Plateia por ordem de chegada. Não existe Express Pass aqui',
        contexto:
          'ESTE É O ÚNICO BLOCO DA NOITE QUE NÃO ADMITE ATRASO.\n\n' +
          'O Grinchmas não tem lugar marcado nem fila expressa: é ordem de chegada e o teatro ' +
          'enche. A recomendação é entrar na fila de 15 a 40 minutos antes, e hoje é o teto ' +
          'dessa faixa — sábado E primeira noite da temporada.\n\n' +
          'Trinta minutos parados aqui é o preço de ver o show sentado e de frente. Comam ' +
          'alguma coisa da mochila enquanto esperam: o jantar é só às 20h.',
        areaParque: 'Seuss Landing', acesso: [], critico: true, duracaoMin: 30,
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'A Seuss Landing quase não tem linhas retas, de propósito. Até as palmeiras ' +
                   'tortas foram plantadas assim, depois de entortadas pelo furacão Andrew.',
            fonte: 'Wikipedia — Universal Islands of Adventure', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1411-1845', hora: '17:30', ancora: 'referencia', tipo: 'show',
        titulo: 'Grinchmas Who-liday Spectacular',
        descricao: 'O motivo de vocês estarem aqui hoje',
        contexto:
          'Musical ao vivo de cerca de 30 minutos com o Grinch e os Whos, em teatro coberto. ' +
          'O ator do Grinch improvisa com a plateia e é o ponto alto.\n\n' +
          'POR QUE A SESSÃO DAS 17H30 E NÃO A DAS 18H30: a grade típica termina às 18h30. ' +
          'Mirando a penúltima, vocês ganham a última como plano B em vez de não ter nenhuma. ' +
          'E saem do teatro já no escuro, que é quando Hogsmeade fica boa.\n\n' +
          'HORÁRIO A CONFIRMAR no app da Universal. É ele que ancora a noite: mudou a sessão, ' +
          'mudem a referência e tudo até a cerveja amanteigada desloca junto.',
        areaParque: 'Seuss Landing', acesso: [], duracaoMin: 30,
        confirmarHorario: true, critico: true, pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'O Grinchmas começou em dezembro de 2000, um ano depois de o parque abrir e ' +
                   'no ano do filme da Universal com o Jim Carrey. A trilha do show é do Chip ' +
                   'Davis, do Mannheim Steamroller.',
            fonte: 'Wikipedia — Universal Islands of Adventure; Orlando Informer', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1411-1930', hora: '18:10', ancora: 'referencia', tipo: 'livre',
        titulo: 'Hogsmeade decorada · cerveja amanteigada frozen',
        descricao: 'Carrinho externo, fila menor. São oito minutos a pé do Seuss Landing',
        contexto:
          'A cerveja amanteigada não tem álcool e é doce — a frozen é a mais pedida. PEÇAM NO ' +
          'CARRINHO EXTERNO: dentro do Three Broomsticks a fila é sempre maior e é exatamente ' +
          'a mesma bebida.\n\n' +
          'Hogsmeade no Natal ganha guirlandas, luz quente e coral. É a primeira noite da ' +
          'temporada e vocês voltam aqui no dia 23 — hoje é para andar devagar e olhar, não ' +
          'para pegar atração.\n\n' +
          'É TAMBÉM O MELHOR MOMENTO DE COMPRA DA SEMANA, e é de propósito: no dia 23 ' +
          'vocês vão estar atrás do Hagrid’s e do VelociCoaster, e ninguém para numa ' +
          'loja nesse dia. A Honeydukes e a Dervish and Banges ficam na rua principal, e a ' +
          'Ollivanders de Hogsmeade tem a varinha escolhendo o bruxo — a do Beco Diagonal, ' +
          'que vocês fazem no dia 17, é a versão maior.',
        areaParque: 'Hogsmeade', acesso: [], duracaoMin: 30 },

      { id: 'b-1411-2015', hora: '18:40', ancora: 'fixo', tipo: 'show',
        titulo: 'The Magic of Christmas at Hogwarts Castle',
        descricao: 'Projeção no castelo, 7 min. Repete a cada 20 minutos',
        contexto:
          'Projeção mapeada na fachada do castelo com música e efeitos. O melhor lugar é o ' +
          'pátio em frente, e ele lota.\n\n' +
          'REPETE A CADA VINTE MINUTOS até o parque fechar, e as sessões mais tarde têm ' +
          'melhor visão porque a plateia vai rareando. Ou seja: não é para correr. Se ' +
          'perderem uma, a próxima vem.\n\n' +
          'HORÁRIO FIXO — as sessões começam quando escurece, não quando o Grinchmas acaba. ' +
          'Com o pôr do sol às 17h32, a primeira deve cair entre 18h e 19h15. Confiram no app.',
        areaParque: 'Hogsmeade', acesso: [], duracaoMin: 35,
        confirmarHorario: true, pesquisa: '2026-09-10' },

      { id: 'b-1411-1950', hora: '19:15', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Flight of the Hippogriff — ou mais Hogsmeade',
        descricao: 'Opcional. Ele não volta em outro dia',
        contexto:
          'Montanha-russa infantil de 1 minuto. Vale pela vista do castelo de Hogwarts e da ' +
          'cabana do Hagrid, iluminados.\n\n' +
          'ELE NÃO VOLTA EM OUTRO DIA: se quiserem andar, é hoje. Mas é bônus, não meta.\n\n' +
          'O texto da noite diz para andar devagar e olhar, e este bloco existe para ser ' +
          'gasto do jeito que vocês quiserem: se a fila estiver abaixo de 20 minutos, ' +
          'andem; se não, fiquem no pátio vendo a projeção outra vez — ela repete a cada ' +
          'vinte minutos e as sessões mais tarde são melhores.',
        areaParque: 'Hogsmeade', acesso: ['standby'], opcional: true, duracaoMin: 45,
        condicao: 'Só se a fila estiver abaixo de 20 min',
        fila: { min: 15, quando: 'à noite', pico: 45, estimado: true, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'Antes de Hogsmeade, ela era a Flying Unicorn, de 2000 a 2008, e ganhou o ' +
                   'tema de Harry Potter com a abertura da área, em 2010.',
            fonte: 'Wikipedia — Flight of the Hippogriff', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1411-2100', hora: '20:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Three Broomsticks',
        descricao: 'Dentro da Hogsmeade decorada. Sem sair do cenário',
        contexto:
          'Balcão temático dentro de Hogsmeade, com vigas de madeira e elfos domésticos e ' +
          'fantasmas escondidos nelas. Frango assado, costela, fish and chips e o Great Feast para ' +
          'dividir.\n\n' +
          'A ESCOLHA FOI DELIBERADA. O Toothsome, no CityWalk, não aceita reserva e a espera ' +
          'passa de uma hora em fim de semana — num sábado de abertura de temporada, depois ' +
          'de um dia inteiro, é esperar em pé no CityWalk. Aqui vocês comem ' +
          'dentro da decoração que vieram ver.\n\n' +
          'É balcão: não leva gorjeta.',
        restauranteId: 'r-broomsticks-14', areaParque: 'Hogsmeade', acesso: [],
        duracaoMin: 90,
        curiosidades: [
          { texto: 'Olhem para as vigas: há referências escondidas aos livros e aos filmes, ' +
                   'como elfos domésticos e fantasmas.',
            fonte: 'Wikipedia — The Wizarding World of Harry Potter (Universal Orlando Resort)', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1411-2130', hora: '21:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Uber, ~30 min, US$ 28–40. Amanhã sai às 7h',
        contexto:
          'A saída do Islands passa pelo CityWalk inteiro antes de chegar ao ponto de ' +
          'rideshare — contem uns dez minutos a pé só para sair.\n\n' +
          'Amanhã é Hollywood Studios com saída às 7h e é o dia mais caro em passes da ' +
          'viagem. Não estiquem.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 30 },
    ],

    ficha: {
      multiPass: null, singlePass: null,
      expressPass: { usar: false, motivo: 'Noite curta e só decoração — não faz sentido nenhum hoje.' },
      custoEstimadoCasal: { min: 0, max: 0, moeda: 'USD' },
      extras: [],
    },
    renuncias: null,
  },

  /* ===== 15/11 · DOMINGO · HOLLYWOOD STUDIOS ============================= */
  {
    id: 'd-2026-11-15',
    data: '2026-11-15',
    diaSemana: 'domingo',
    emoji: '🎬',
    titulo: 'Hollywood Studios',
    subtitulo: 'Rope drop na Sunset, o Slinky comprado e a noite inteira no Fantasmic',
    tipo: 'parque',
    operadora: 'disney',
    parqueId: 'hollywood-studios',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-10',
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: true },

    resumo:
      'O parque mais difícil da Disney, e o único dos três em que o Single Pass se ' +
      'justifica. A manhã é no Toy Story Land, onde a multidão do Early Entry não vai; a ' +
      'noite tem duas reservas e o Fantasmic, e por isso não sobra janela de graça para o ' +
      'Rise of the Resistance.',

    avisos: [
      'NÃO VÃO PARA O GALAXY’S EDGE NA ABERTURA. O Early Entry inclui o Rise, o Slinky e a ' +
      'Torre, e a maioria dos hóspedes vai para o Rise. Vocês vão para o Toy Story Land.',
      'O OGA’S ESTÁ RESERVADO PARA AS 17h05. O Sci-Fi ficou de fora: na abertura da janela ' +
      'horários aqui são proposta — 17h e 18h fazem a tarde caber. Se conseguirem outros, ' +
      'ajustem os blocos da noite.',
    ],

    notas: [
      { tipo: 'bom', texto:
        'VERIFICADO: 15/11 não é noite de Disney Jollywood Nights. As datas de novembro são ' +
        '7, 14, 16, 21, 23 e 28 — sábados e segundas. Nessas o parque fecha às 19h30 para ' +
        'quem não tem ingresso do evento, o que mataria o Fantasmic. O domingo de vocês está ' +
        'limpo.', pesquisa: '2026-09-08' },

      { tipo: 'atencao', texto:
        'O SLINKY DOG NÃO TEM HORA BARATA. Ele faz 97 minutos na abertura, 79 de média e 64 ' +
        'à noite — nunca cede. O rope drop nele não é o momento em que ele fica de graça, é ' +
        'o momento em que ele custa menos, porque a noite de vocês está ocupada. E fazê-lo ' +
        'às 9h libera a lista alta do Multi Pass para o Rock ’n’ Roller Coaster.',
        pesquisa: '2026-09-10' },

      { tipo: 'bom', texto:
        'O ROCK ’N’ ROLLER COASTER REABRIU. Fechou como Aerosmith em 02/03/2026 e voltou em ' +
        '26/05/2026 com temática dos Muppets, com o Dr. Teeth and the Electric Mayhem. Em ' +
        'novembro ainda é atração nova.', pesquisa: '2026-09-10' },

      { tipo: 'atencao', texto:
        'O FANTASMIC SEGUE O FECHAMENTO DO PARQUE, não a abertura. Com fechamento às 21h ele ' +
        'costuma ser às 20h; com 22h, às 21h. O roteiro assume 20h, com fechamento às 21h — é ' +
        'previsão. Os horários oficiais de 15/11 saem por volta de 16/09, junto com a janela ' +
        'das reservas.', pesquisa: '2026-09-10' },
    ],

    /* --------------------------------------------------------------------- */
    planos: [
      {
        letra: 'A',
        titulo: 'O dia como está escrito',
        gatilho: 'Vocês estão no portão às 8h e o parque abre às 9h.',
        passos: [
          'Do portão, direto para o TOY STORY LAND — não para o Galaxy’s Edge.',
          'Slinky Dog no rope drop, Toy Story Mania em seguida, Alien só se estiver vazio.',
          'Rise às 10h45 com o Single Pass, e o Millennium Falcon no standby logo depois.',
          'Almoço em Batuu e a travessia até a Sunset Blvd, com o Indiana Jones das 13h15 no ' +
          'meio do caminho.',
          'Rock ’n’ Roller com o Multi Pass às 13h55; ao usar, reservem o Runaway Railway. ' +
          'Torre e Star Tours já estão reservados.',
          'Noite sentada: Oga’s, jantar de balcão na Sunset Blvd e o Fantasmic.',
        ],
      },
      {
        letra: 'B',
        titulo: 'O Slinky Dog já está com mais de 60 min na abertura',
        gatilho: 'Vocês chegam nele às 9h e o painel marca 60 minutos ou mais.',
        passos: [
          'Sinal de que o Early Entry veio para o Toy Story Land em vez de ir ao Rise. ' +
          'Acontece, e não é motivo para insistir.',
          'Pivô imediato: Toy Story Mania e Alien agora, que estão do lado e vazios.',
          'Troquem no app a reserva do Rock ’n’ Roller pelo Slinky — os dois são do nível 1, e ' +
          'a troca vale se houver horário. O Rock ’n’ Roller vai para a fila de single rider.',
          'O resto do dia não muda.',
        ],
      },
      {
        letra: 'B2',
        titulo: 'O parque não abre às 9h, ou o Fantasmic é em outra hora',
        gatilho: 'O parque é 9h às 21h, oficial. O que ainda não saiu é a hora do Fantasmic.',
        passos: [
          'ABERTURA DIFERENTE: mudem a referência do dia. A manhã inteira desloca junto, ' +
          'inclusive a saída das 7h.',
          'A NOITE NÃO DESLOCA COM A ABERTURA. As duas reservas têm hora própria e o ' +
          'Fantasmic segue o fechamento. Se o app avisar colisão em vermelho no fim da ' +
          'tarde, é o Star Tours ou a parada batendo no Oga’s — cortem esses, não a noite.',
          'FANTASMIC EM OUTRA HORA: ajustem o selo de horário no bloco dele e mudem à mão a ' +
          'posição e a Sunset Blvd — o app não move esses dois sozinho.',
        ],
      },
      {
        letra: 'C',
        titulo: 'Chuva ou o dia desandou',
        gatilho: 'Chuva que não passa, cansaço, ou o dia atrasou demais.',
        passos: [
          'Este é o parque MAIS coberto da Disney. Rise, Runaway Railway, Toy Story Mania, ' +
          'Star Tours e a Torre do Terror são todos internos, e o Oga’s também. O jantar da ' +
          'Sunset Blvd é em pátio aberto, com mesas cobertas.',
          'O Slinky e o Rock ’n’ Roller param com raio. Se pararem de manhã, troquem a ordem: ' +
          'Rise e Millennium Falcon primeiro, e voltem ao Toy Story Land depois.',
          'O QUE NÃO SE SACRIFICA: o Fantasmic. Se for para cortar, cortem nesta ordem — ' +
          'Alien, Star Tours e o Millennium Falcon.',
          'O Fantasmic é cancelado com chuva forte. Se cancelarem, usem a hora para o Rise ' +
          'de novo ou para a Torre, e saiam mais cedo: amanhã é Animal Kingdom com saída às 6h30.',
        ],
      },
    ],

    /* --------------------------------------------------------------------- */
    naoPerca: [
      { nome: 'Fantasmic!', quando: 'hoje', custo: 'incluso no ingresso',
        motivo: 'Fogo, água, barcos, projeção em cortina de água e um dragão de uns doze ' +
                'metros. É o show mais antigo e mais querido do parque, e é o fecho do dia. ' +
                'Sentem no meio e um pouco atrás: de perto a projeção se perde e as ' +
                'primeiras fileiras molham.' },

      { nome: 'Ser piloto no Millennium Falcon', quando: 'hoje', custo: 'incluso',
        motivo: 'São seis pessoas por nave, com funções diferentes, e só os dois pilotos ' +
                'controlam de verdade. Peçam ao funcionário que distribui as funções. É a ' +
                'diferença entre jogar e assistir, e não custa nada pedir.' },

      { nome: 'A Sunset Blvd no Natal, antes do Fantasmic', quando: 'hoje', custo: 'grátis',
        motivo: 'A rua mais bonita do parque à noite, com luz quente e música ao vivo, e o ' +
                'teatro do Fantasmic fica no fim dela. É também o momento de compra do dia — ' +
                'as lojas fecham com o parque e depois do show vocês vão direto para a saída.' },

      { nome: 'Single Pass do Rise of the Resistance', quando: 'decidir',
        custo: 'US$ 20–25 por pessoa',
        motivo: 'DIFERENTE DOS DIAS 11 E 13, aqui o passe se justifica. Nos outros dois o ' +
                'horário resolvia; aqui não existe janela livre — o Rise faz 100 min na ' +
                'abertura e 63 depois das 19h, e as 19h de vocês já têm Oga’s, jantar e ' +
                'Fantasmic.\n\n' +
                'O plano B de graça existe e está no bloco: entrar na fila depois do ' +
                'Fantasmic, por volta das 20h35, com a regra de que quem está na fila no ' +
                'fechamento anda. Saem por volta das 21h40, e amanhã sai às 6h30 para o Animal Kingdom.',
        pesquisa: '2026-09-10' },

      { nome: 'Muppet*Vision 3D', quando: 'fechada', custo: '—',
        motivo: 'Fechou em 08/06/2025, junto com o PizzeRizzo e o Muppets Courtyard, para dar ' +
                'lugar à Monstropolis — a land de Monsters, Inc. prevista para 2027. Não é ' +
                'escolha de vocês; fica registrado para ninguém procurar.',
        pesquisa: '2026-09-10' },
    ],

    /* --------------------------------------------------------------------- */
    prepararAmanha: {
      paraODia: '2026-11-16',
      titulo: 'Animal Kingdom · alarme 5h30, saída 6h30',
      aviso:
        'Hoje termina perto das 21h35 e amanhã sai às 6h30, a saída mais cedo da viagem. O ' +
        'dia 16 é o mais curto dos quatro da Disney e o mais coreografado: o parque fecha ' +
        'às 18h e a reta final depende disso.',
      itens: [
        { texto: 'Conferir ABERTURA E FECHAMENTO do Animal Kingdom e ajustar a referência',
          critico: true,
          motivo: 'OS DOIS IMPORTAM, e é o item mais importante da lista.\n\n' +
                  'A ABERTURA: o dia assume 8h, que é o típico de novembro. Se for outra, ' +
                  'mudem a referência na tela do dia e a manhã inteira desloca junto, ' +
                  'inclusive a saída das 6h30.\n\n' +
                  'O FECHAMENTO: é ele que sustenta a reta final. Com 18h, o plano está no ' +
                  'limite e o safári do entardecer, o Na’vi e a fila do Flight of Passage ' +
                  'estão coreografados minuto a minuto. Com 19h ou 20h o dia respira. A ' +
                  'reta final é fixa e NÃO desloca com a abertura — ela segue o sol.' },

        { texto: 'Conferir que o Single Pass do Flight of Passage está no app', critico: true,
          motivo: 'Ele foi comprado em 08/11 com o resto. Confiram nos DOIS perfis que a ' +
                  'janela de retorno está lá e anotem a hora — a reta final do dia 16 é ' +
                  'montada em cima dela.' },

        { texto: 'Reserva do Sanaa: número de confirmação à mão', critico: false,
          motivo: 'Jantar às 19h50, confirmação 356258407484, na Kidani Village do Animal ' +
                  'Kingdom Lodge — OUTRO endereço, não é dentro do parque. Deixem o número acessível no celular hoje, não procurando ' +
                  'e-mail amanhã com o Uber esperando. O telefone da Disney está no Guia, ' +
                  'se precisarem remarcar: +1 407-939-3463, com 2h de antecedência.' },

        { texto: 'Alarme para 5h30 nos dois celulares', critico: true,
          motivo: 'Saída às 6h30 — uma hora mais cedo do que nos outros dias de parque, ' +
                  'porque o Animal Kingdom abre às 8h e não às 9h. Depois de um dia sem ' +
                  'alarme, o corpo não ajuda.' },


        { texto: 'Decidir sobre o Kali River Rapids olhando a previsão', critico: false,
          motivo: 'Ele está às 9h15 e molha de verdade. Em novembro Orlando amanhece por ' +
                  'volta dos 15°C. Se a mínima de amanhã estiver baixa, decidam HOJE que ' +
                  'vão pular — ganham 35 minutos e não passam o dia com roupa molhada.' },

        { texto: 'Mochila remontada e celular carregando', critico: true,
          motivo: 'O de sempre: os dois soft flasks cheios, barrinhas, protetor solar, power ' +
                  'bank e cabo.\n\n' +
                  'E TRÊS COISAS SÓ DE AMANHÃ, se vocês forem fazer o Kali River Rapids às ' +
                  '9h15: duas capas de chuva, um saco Ziploc para o celular e um par de ' +
                  'meias secas. O Kali não é respingo, é balde — e depois dele ainda são ' +
                  'nove horas de parque.\n\n' +
                  'Uma camada leve também: amanhã amanhece por volta dos 15°C e vocês saem ' +
                  'às 6h30. Ao meio-dia ela vai para a mochila.' },

        { texto: 'Guardar as compras da Sunset Blvd',
          motivo: 'Vocês voltam com sacola hoje. Amanhã a mochila precisa estar vazia para ' +
                  'o que interessa.' },
      ],
    },

    /* --------------------------------------------------------------------- */
    blocos: [
      { id: 'b-1511-0700', hora: '07:00', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel',
        descricao: 'Uber, ~30 min, US$ 22–32',
        contexto:
          'O Hollywood Studios tem entrada direta, sem monotrilho. Mas a fila da segurança ' +
          'aqui é das mais lentas da Disney, e é por isso que a saída é às 7h para uma ' +
          'abertura às 9h.',
        localId: 'hollywood-studios', acesso: [], critico: true, duracaoMin: 60 },

      { id: 'b-1511-0800', hora: '08:00', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão · posicionar para a SUNSET BLVD',
        descricao: 'Perto da entrada, não no fundo do parque',
        contexto:
          'PELA TERCEIRA VEZ, O PONTO CERTO É O CONTRAINTUITIVO — e aqui o motivo está ' +
          'documentado com nome e sobrenome.\n\n' +
          'A CATRACA ABRE PARA TODO MUNDO POR VOLTA DAS 8H, uma hora antes do parque. Com o ' +
          'ingresso comum vocês andam pela Hollywood Blvd inteira. Os checkpoints do Early ' +
          'Entry ficam lá dentro, um deles no corredor que leva ao Toy Story Land, e quem é de ' +
          'fora espera perto dele até as 9h.\n\n' +
          'O Early Entry do Hollywood Studios inclui o Rise of the Resistance, o Slinky Dog ' +
          'Dash e a Torre do Terror. E a grande maioria dos hóspedes vai para o RISE, que ' +
          'fica no Galaxy’s Edge. Quem sai da corda às 9h e caminha para lá está andando para ' +
          'dentro da multidão que já está na fila há meia hora.\n\n' +
          'A recomendação para quem está fora dos hotéis é ir ao Toy Story Land. É para lá ' +
          'que vocês vão, direto, assim que passarem a catraca: esperem na frente do ' +
          'checkpoint do corredor dele.\n\n' +
          'PONTO DE ENCONTRO DE HOJE: o Chinese Theater, no fim da Hollywood Blvd. É o ' +
          'prédio que se vê da entrada e por onde todo caminho passa. Se vocês se perderem, ' +
          'vão para lá e ESPEREM — não saiam procurando.\n\n' +
          'Café da manhã aqui, das barrinhas da mochila, e a foto da Hollywood Blvd com o ' +
          'Chinese Theater no fundo, no caminho, antes de a rua encher. O almoço é 12h20.',
        localId: 'hollywood-studios', acesso: [], duracaoMin: 60, pesquisa: '2026-09-12',
        curiosidades: [
          { texto: 'O Chinese Theatre no fim da avenida é uma réplica em tamanho real do ' +
                   'Grauman’s Chinese Theatre, de Hollywood. Por dentro, desde 2020, funciona ' +
                   'o Runaway Railway.',
            fonte: 'Wikipedia — Disney’s Hollywood Studios; Wikipedia — Mickey & Minnie’s Runaway Railway', pesquisa: '2026-09-15' },
          { texto: 'A torre da entrada recria a Crossroads of the World, marco de Los Angeles.',
            fonte: 'Wikipedia — Disney’s Hollywood Studios', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1511-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Rock ’n’ Roller Coaster (Muppets)',
        descricao: 'Multi Pass · lista alta. Ao usar, reservem o Runaway Railway',
        contexto:
          'Montanha-russa fechada, no escuro, com lançamento de 0 a 90 km/h em menos de três ' +
          'segundos e três inversões. É a mais intensa da Disney em Orlando.\n\n' +
          'Tem temática dos Muppets, com o Dr. Teeth and the Electric Mayhem, desde ' +
          '26/05/2026 — em novembro ainda é atração nova. Ela leva a lista alta do Multi Pass ' +
          'porque o Slinky vai no rope drop.\n\n' +
          'AO USAR, RESERVEM O RUNAWAY RAILWAY no app, ainda na saída. Cada reserva usada ' +
          'libera a próxima.',
        areaParque: 'Sunset Blvd', acesso: ['rope-drop', 'standby'], acessoAlt: 'single-rider', duracaoMin: 40,
        fila: { min: 20, quando: 'no rope drop', pico: 75, estimado: true, fonte: '2026-09-17' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'Abriu em 29/07/1999 com o Aerosmith, que ficou até 02/03/2026. Cada ' +
                   'assento tem cinco alto-falantes, com um subwoofer embaixo, e o carrinho ' +
                   'agora se chama L.I.M.O.',
            fonte: 'Wikipedia — Rock ’n’ Roller Coaster', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1511-0945', hora: '09:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Torre do Terror',
        descricao: 'Multi Pass · lista baixa',
        contexto:
          'Queda livre dentro de um hotel abandonado cenográfico, com sequência aleatória de ' +
          'subidas e quedas que muda a cada volta. A ambientação é a melhor da Disney.\n\n' +
          'Sensação de estômago forte — se algum dos dois tem medo de queda, é esta e não as ' +
          'montanhas-russas.',
        areaParque: 'Sunset Blvd', acesso: ['standby'], duracaoMin: 40,
        fila: { min: 20, quando: 'logo depois da abertura', pico: 35, fonte: '2026-09-17' },
        curiosidades: [
          { texto: 'Abriu em 22/07/1994, junto com a Sunset Blvd. Tem 199 pés, só meio pé a ' +
                   'menos que o Everest. Na história, o raio atinge o hotel em 31/10/1939.',
            fonte: 'Wikipedia — The Twilight Zone Tower of Terror', pesquisa: '2026-09-15' },
          { texto: 'O Rod Serling da abertura é imagem real, tirada do episódio “It’s a Good ' +
                   'Life”, de Além da Imaginação. Desde 2003 as quedas são sorteadas por ' +
                   'computador, e no meio do passeio o elevador sai do poço e anda na ' +
                   'horizontal.',
            fonte: 'Wikipedia — The Twilight Zone Tower of Terror', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1511-1040', hora: '10:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Rise of the Resistance',
        descricao: 'Single Pass. E aqui ele se justifica',
        contexto:
          'Não é uma atração, são quatro: pré-show, simulador de nave, um hangar em escala ' +
          'real com dezenas de stormtroopers e o passeio em veículo sem trilhos. É consenso ' +
          'como a coisa mais ambiciosa que a Disney já construiu.\n\n' +
          'POR QUE AQUI O PASSE FICA, e nos dias 11 e 16 é plano B: nos outros dois o ' +
          'horário resolve — o TRON tem a janela do desfile, o Flight of Passage tem a ' +
          'última hora. Aqui não existe janela livre. O Rise faz 100 minutos na abertura e ' +
          '63 depois das 19h, e as 19h de vocês já estão com Oga’s, jantar e Fantasmic.\n\n' +
          'PLANO B DE GRAÇA, se vocês não comprarem: entrar na fila DEPOIS do Fantasmic, por ' +
          'volta das 20h35. Vale a mesma regra do dia 16 — quem está na fila no fechamento ' +
          'anda. Vocês sairiam por volta das 21h40, e o dia 16 sai às 6h30 para o Animal Kingdom.',
        areaParque: 'Galaxy’s Edge', acesso: ['single-pass'], critico: true, duracaoMin: 50,
        fila: { min: 10, quando: 'com o Single Pass', pico: 100, fonte: '2026-09-10' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'Abriu em 05/12/2019, dura 18 minutos e tem 65 animatrônicos.',
            fonte: 'Wikipedia — Star Wars: Rise of the Resistance', pesquisa: '2026-09-15' },
          { texto: 'No hangar há dois AT-ATs de verdade, e um espelho faz parecer que são ' +
                   'quatro. Os veículos não têm trilho: se guiam por sensores no chão.',
            fonte: 'Wikipedia — Star Wars: Rise of the Resistance', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1511-1130', hora: '11:30', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Millennium Falcon: Smugglers Run',
        descricao: 'Standby. Peçam para ser PILOTOS',
        contexto:
          'Simulador em que vocês pilotam a Millennium Falcon em grupos de seis, cada um com ' +
          'uma função. Se sentarem como pilotos, vocês controlam de verdade — e a nave bate ' +
          'muito.\n\n' +
          'PEÇAM PARA SER PILOTOS ao funcionário que distribui as funções. Artilheiro e ' +
          'engenheiro são bem menos interessantes, e é a diferença entre jogar e assistir.',
        areaParque: 'Galaxy’s Edge', acesso: ['standby'], acessoAlt: 'single-rider', duracaoMin: 45,
        acessoAltNota: 'Aqui não: single rider quase sempre vira engenheiro, e este bloco é para pilotar.',
        fila: { min: 35, quando: 'antes do meio-dia', pico: 65, estimado: true, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'O Galaxy’s Edge abriu em 29/08/2019, com 14 acres. Batuu é um planeta ' +
                   'criado para a land, e o Millennium Falcon lá fora é em tamanho real.',
            fonte: 'Wikipedia — Star Wars: Galaxy’s Edge', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1511-1215', hora: '12:15', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Docking Bay 7',
        descricao: 'Balcão, dentro de Galaxy’s Edge. Mobile order',
        contexto:
          'Balcão temático de Batuu, com pratos de nomes alienígenas que são versões de ' +
          'comida reconhecível. Usem mobile order — a fila do balcão é longa e a retirada é ' +
          'imediata. Peçam ainda dentro da fila do Millennium Falcon.\n\n' +
          'É a última comida de verdade até as 18h: o Oga’s às 17h serve bebida e petisco, ' +
          'não refeição.\n\n' +
          'QUARENTA MINUTOS, NÃO UMA HORA: o pedido já sai da fila do Falcon, e às 13h vocês ' +
          'andam para o Indiana Jones. Banheiro e flasks aqui mesmo, antes de sair de Batuu.',
        restauranteId: 'r-docking-bay', areaParque: 'Galaxy’s Edge', acesso: [], duracaoMin: 40,
        curiosidades: [
          { texto: 'As placas da land são em aurebesh, o alfabeto de Star Wars, e até a ' +
                   'Coca-Cola ganhou versão temática.',
            fonte: 'Wikipedia — Star Wars: Galaxy’s Edge', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1511-1315', hora: '13:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Slinky Dog Dash',
        descricao: 'A fila mais teimosa do parque. Não existe hora barata para ela',
        contexto:
          'Montanha-russa familiar ao ar livre, com dois lançamentos suaves. Não é intensa — ' +
          'o que ela é, é sempre cheia.\n\n' +
          'SEJAM HONESTOS COM O NÚMERO: o Slinky faz 97 minutos na abertura, 79 de média no ' +
          'dia e 64 à noite. Não existe janela barata para ele, e é exatamente por isso que ' +
          'ele leva o nível 1 do Multi Pass em vez de ir para o rope drop.' +
          '\n\nENCARÁ-LO NO STANDBY seria o gesto mais caro do dia: sem Early Entry, às 9h o ' +
          'parque já rodou meia hora com hóspedes de hotel, e o Slinky é justamente uma das ' +
          'atrações que o Early Entry abre. O rope drop dele custaria os 97 minutos cheios.' +
          '\n\nE ele é o único dos quatro do nível 1 que NÃO tem fila de single rider: o Rock ' +
          '’n’ Roller tem, o Falcon tem. Gastar o passe nele é comprar a única porta que não ' +
          'abre de outro jeito.',        areaParque: 'Toy Story Land', acesso: ['multi-pass'], critico: true,
        duracaoMin: 40,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 97, estimado: true, fonte: '2026-09-17' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'O Toy Story Land de Orlando é o maior da Disney. A ideia é que vocês ' +
                   'encolheram ao tamanho de um brinquedo no quintal do Andy — por isso as ' +
                   'cercas de Lincoln Logs, os Tinkertoys e as pegadas gigantes do Andy no ' +
                   'chão.',
            fonte: 'Wikipedia — Toy Story Land', pesquisa: '2026-09-15' },
          { texto: 'No fim do percurso, um Wheezy animatrônico canta para quem passa.',
            fonte: 'Wikipedia — Toy Story Land', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1511-1355', hora: '13:55', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Toy Story Mania',
        descricao: 'Standby, ainda cedo. Mesma land',
        contexto:
          'Jogo de tiro em 3D com óculos, em cabines giratórias — vocês competem por ' +
          'pontuação. Puxem o gatilho o mais rápido possível: a pontuação premia volume de ' +
          'tiros, não pontaria.',
        areaParque: 'Toy Story Land', acesso: ['multi-pass'], duracaoMin: 35,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 55, estimado: true, fonte: '2026-09-17' },
        curiosidades: [
          { texto: 'Abriu em 31/05/2008, em outra área do parque, e ganhou esta entrada nova ' +
                   'quando o Toy Story Land abriu, em 2018.',
            fonte: 'Wikipedia — Toy Story Midway Mania!; Wikipedia — Toy Story Land', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1511-1440', hora: '14:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mickey & Minnie’s Runaway Railway',
        descricao: 'Multi Pass rolando — reservado às 13h55',
        contexto:
          'Dark ride sem trilhos visíveis onde vocês entram literalmente dentro de um ' +
          'desenho. Colorido, rápido, sem emoção forte.\n\n' +
          'É A RESERVA ROLANDO, feita às 13h55, assim que o Rock ’n’ Roller é usado. Se não ' +
          'houver horário perto das 15h20, façam no standby — a fila chega a uns 50 minutos ' +
          'no pico.',
        areaParque: 'Hollywood Blvd', acesso: ['multi-pass'], duracaoMin: 40,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 50, estimado: true, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'Ocupa o prédio onde funcionava a Great Movie Ride e abriu em 04/03/2020 — ' +
                   'a primeira atração de passeio da Disney estrelada pelo Mickey.',
            fonte: 'Wikipedia — Mickey & Minnie’s Runaway Railway', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1511-1525s', hora: '15:25', ancora: 'fixo', tipo: 'show',
        titulo: 'Indiana Jones Epic Stunt Spectacular',
        descricao: 'Show de dublês de 30 min, sentados, no caminho para a Sunset Blvd',
        contexto:
          'O show de dublês do parque desde 1989: cenas do Caçadores da Arca Perdida ' +
          'refeitas ao vivo, com lutas, quedas, fogo e explosões, e a equipe mostrando entre ' +
          'uma cena e outra como cada efeito é feito. É o mesmo tipo de espetáculo do Bourne ' +
          'Stuntacular do dia 17.\n\n' +
          'POR QUE AGORA: do Galaxy’s Edge até a Sunset Blvd são treze minutos atravessando o ' +
          'parque, e o teatro fica na Echo Lake, no meio desse caminho. A sessão das 13h15 ' +
          'transforma a travessia em meia hora sentados: seis minutos de Batuu até aqui, sete ' +
          'daqui até o Rock ’n’ Roller.\n\n' +
          'HORÁRIO A CONFIRMAR: em setembro de 2026 as sessões eram 10h45, 12h, 13h15, 15h15 ' +
          'e 16h30, e o show é cancelado com alguma frequência — chuva, vento ou problema ' +
          'técnico. Se não houver sessão entre 13h e 13h20, ou se ela for cancelada, sentem ' +
          'dez minutos na Echo Lake, que é o canto mais tranquilo do parque, e sigam.',
        areaParque: 'Echo Lake', acesso: [], duracaoMin: 30, confirmarHorario: true,
        pesquisa: '2026-09-15',
        curiosidades: [
          { texto: 'Estreou em 25/08/1989, com produção executiva de George Lucas.',
            fonte: 'Wikipedia — Indiana Jones Epic Stunt Spectacular!', pesquisa: '2026-09-15' },
          { texto: 'No fim de dezembro de 2025, a pedra de 180 kg da primeira cena saiu do ' +
                   'trilho. Um funcionário se pôs na frente dela para proteger a plateia e se ' +
                   'feriu; em maio de 2026 ele já tinha voltado ao show, e a cena voltou ' +
                   'modificada.',
            fonte: 'Wikipedia — Indiana Jones Epic Stunt Spectacular!; WDWNT; BlogMickey', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1511-1630p', hora: '16:30', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — antes da noite',
        descricao: 'Dez minutos. Banheiro ao lado do Docking Bay 7; a partir daqui o dia é sentado',
        contexto:
          'Banheiro, flasks e power bank. Daqui até a saída são quatro horas, e três delas ' +
          'são sentadas: Oga’s, o jantar na Sunset Blvd e o Fantasmic.\n\n' +
          'COMAM ALGUMA COISA DA MOCHILA se estiverem com fome: o almoço foi 12h20 e o ' +
          'Oga’s serve bebida, não jantar. A comida de verdade só chega às 18h10.',
        areaParque: 'Galaxy’s Edge', acesso: [], duracaoMin: 10 },

      { id: 'b-1511-1705', hora: '17:05', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Oga’s Cantina',
        descricao: 'Reservado, 17h05. Limite de 45 min por grupo',
        contexto:
          'Bar temático de Batuu com DJ droide, drinks autorais bem estranhos e limite de ' +
          'tempo de 45 minutos por grupo. É quase impossível entrar sem reserva.\n\n' +
          'RESERVADO PARA AS 17h05, confirmação 356259476987. São 45 minutos de mesa, e ' +
          'daqui vocês atravessam para a Sunset Blvd: treze minutos de caminhada, a mais ' +
          'longa dos parques da Disney. O jantar é no pátio de balcões de lá, já colado no ' +
          'teatro do Fantasmic.',
        restauranteId: 'r-ogas', areaParque: 'Galaxy’s Edge', acesso: ['reserva'],
        duracaoMin: 45,
        curiosidades: [
          { texto: 'O DJ, R-3X, é o antigo “Capitão Rex”, que pilotava a primeira versão do ' +
                   'Star Tours.',
            fonte: 'Wikipedia — Star Wars: Galaxy’s Edge', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1511-1810', hora: '18:10', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar de balcão — Sunset Ranch Market, no Natal da Sunset',
        descricao: 'Rosie’s All-American Café e vizinhos, sem reserva. Mobile order',
        contexto:
          'O Sunset Ranch Market é o pátio de balcões da Sunset Blvd, a poucos passos do ' +
          'teatro do Fantasmic: Rosie’s All-American Café para hambúrguer e frango, Catalina ' +
          'Eddie’s para pizza e Fairfax Fare para churrasco.\n\n' +
          'PEÇAM PELO MOBILE ORDER no My Disney Experience assim que saírem do Oga’s: o ' +
          'pátio enche antes do show.\n\n' +
          'POR QUE AQUI: o jantar fica colado no Fantasmic, sem travessia no escuro e sem ' +
          'voltar ao Galaxy’s Edge. Confiram os horários no app do dia — os balcões abrem e ' +
          'fecham conforme a operação.',
        restauranteId: 'r-sunset-market', areaParque: 'Sunset Blvd', acesso: [],
        duracaoMin: 60, pesquisa: '2026-09-16' },

      { id: 'b-1511-1920p', hora: '19:20', ancora: 'fixo', tipo: 'espera',
        titulo: 'Posição para o Fantasmic!',
        descricao: 'Quinze minutos antes. O teatro abre às 18h30 e enche',
        contexto:
          'O Hollywood Hills Amphitheater tem quase sete mil lugares e ainda assim enche nas ' +
          'noites de temporada.\n\n' +
          'O TEATRO ABRE 90 MINUTOS ANTES, às 18h30, pelo mapa oficial. Quinze minutos antes ' +
          'ainda dá lugar no meio, mas não escolha: se quiserem lugar bom num domingo cheio, ' +
          'é trocar a Sunset Blvd das 19h25 por fila.\n\n' +
          'Sentem no MEIO e um pouco atrás, não na frente: o show usa projeção em cortina de ' +
          'água, e de perto demais a imagem se perde. As primeiras fileiras também molham.',
        areaParque: 'Sunset Blvd', acesso: [], duracaoMin: 15,
        curiosidades: [
          { texto: 'O teatro foi construído só para o show e recebe quase 10 mil pessoas, ' +
                   'contando as que ficam de pé.',
            fonte: 'Wikipedia — Fantasmic!; Disney Tourist Blog', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1511-2000', hora: '20:00', ancora: 'fixo', tipo: 'show',
        titulo: 'Fantasmic!',
        descricao: '~26 min. O fecho do dia',
        contexto:
          'Espetáculo noturno com fogo, água, barcos, projeção em cortina de água e um ' +
          'dragão de uns doze metros. É o show mais antigo e mais querido do parque.\n\n' +
          'HORÁRIO A CONFIRMAR: ele acompanha o fechamento do parque. Com fechamento às 21h ' +
          'costuma ser às 20h; com 22h, às 21h. O roteiro assume 20h. Confiram no app da ' +
          'Disney e ajustem aqui; a posição e a Sunset Blvd, antes dele, se ajustam à mão.',
        areaParque: 'Sunset Blvd', acesso: [], duracaoMin: 35,
        confirmarHorario: true, pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'Estreou aqui em 15/10/1998 e ficou fora do ar de março de 2020 a ' +
                   '03/11/2022.',
            fonte: 'Wikipedia — Fantasmic!', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1511-2035', hora: '20:35', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Uber, ~30 min, US$ 22–32. Amanhã sai às 6h30',
        contexto:
          'Saindo com o fluxo do Fantasmic, a caminhada até o ponto de rideshare leva uns ' +
          'quinze minutos — o parque inteiro sai ao mesmo tempo.\n\n' +
          'Se a tarifa estiver em alta, andem um pouco para longe da entrada antes de chamar. ' +
          'Amanhã é Animal Kingdom com saída às 6h30, então não estiquem.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 60 },
    ],

    ficha: {
      multiPass: {
        usar: true, opcional: false,
        listaAlta: ['Slinky Dog Dash'],
        listaBaixa: ['Toy Story Mania'],
        rolando: ['Mickey & Minnie’s Runaway Railway'],
        planoB:
          'Se o Slinky não sair na compra de 08/11, o nível 1 vai para o Rock ’n’ Roller ' +
          'Coaster e o rope drop passa a ser a Torre do Terror, que é a mais barata das ' +
          'três da Sunset. O Slinky então fica de fora do dia: com 97 minutos na abertura ' +
          'e 79 de média, ele não cabe em standby nenhum.',
        nota:
          'Nível 1 no Hollywood Studios: Slinky Dog Dash, Runaway Railway, Rock ’n’ Roller ' +
          'Coaster e Millennium Falcon — só um entra na compra antecipada, e vai o SLINKY.' +
          '\n\nPOR QUE ELE E NÃO O ROCK ’N’ ROLLER: sem Early Entry o rope drop daqui não ' +
          'é barato em lugar nenhum — às 9h o parque já rodou meia hora com hóspedes de ' +
          'hotel. O Slinky faz 97 minutos na abertura e 79 de média: é a fila mais cara do ' +
          'parque em qualquer hora. E o Rock ’n’ Roller tem fila de single rider, o Slinky ' +
          'não — gastar o nível 1 nele era comprar justamente o que já tinha saída.' +
          '\n\nA SUNSET BLVD É O ROPE DROP, e ela fica na entrada, não no fundo. Rock ’n’ ' +
          'Roller às 9h e Torre do Terror em seguida — a ordem entre os dois se decide no ' +
          'portão, pela fila postada. A Torre é barata de qualquer jeito, pico de 35.' +
          '\n\nO terceiro slot da lista baixa fica LIVRE de propósito: o que sobra se ' +
          'reserva rolando dentro do parque, assim que o primeiro for usado. O alvo é o ' +
          'Runaway Railway, às 14h40.',
      },
      singlePass: {
        itens: ['Rise of the Resistance'], opcionais: [],
        nota:
          'ESTE É O ÚNICO DOS TRÊS DIAS DE PASSE EM QUE ELE SE JUSTIFICA. No dia 11 o TRON ' +
          'tinha a janela do desfile; no dia 16 o Flight of Passage tem a última hora. ' +
          'Aqui não existe janela livre: o Rise faz 100 min na abertura e 63 depois das ' +
          '19h, e a noite de vocês já tem Oga’s, jantar e Fantasmic.\n\n' +
          'Peçam janela entre 10h30 e 11h. Se não comprarem, o plano B está no bloco: fila ' +
          'depois do Fantasmic, por volta das 20h35.',
      },
      expressPass: null,
      custoEstimadoCasal: { min: 70, max: 130, moeda: 'USD' },
      extras: [
        { nome: 'A travessia mais longa dos parques mapeados',
          texto: 'Do Galaxy’s Edge até a Sunset Blvd são treze minutos atravessando o ' +
                 'parque inteiro, e mais num dia cheio. Ela está contada no relógio, com o ' +
                 'Indiana Jones da Echo Lake no meio — não é atraso, é o mapa.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Alien Swirling Saucers',
          motivo: 'CORTADO EM 17/09. É o mesmo sistema das xícaras e o guia de adultos do ' +
                  'mousehacking o chama de dispensável para adulto. Custava 30 minutos na ' +
                  'melhor hora da manhã.' },
        { nome: 'Star Tours',
          motivo: 'CORTADO EM 17/09. Ele só estava no dia porque ocupava um slot de Multi ' +
                  'Pass, e o guia diz que é das atrações mais fáceis de pegar do resort — ' +
                  'gastar um passe nele bloqueava uma reposição que vale muito mais. Sem o ' +
                  'passe, ele perde para o Indiana Jones na mesma janela.' },
        { nome: 'Disney Junior' }, { nome: 'Frozen Sing-Along' }, { nome: 'Vacation Fun' },
        { nome: 'Walt Disney Presents' }, { nome: 'Beauty and the Beast Live on Stage' },
        { nome: 'Disney Villains: Unfairly Ever After',
          motivo: 'Show de 18 minutos na Sunset Blvd. Cairia na janela da tarde em que o ' +
                  'Multi Pass está girando — Rock ’n’ Roller, Torre e Runaway Railway.' },
        { nome: 'The Little Mermaid — A Musical Adventure',
          motivo: 'Musical de 18 minutos com bonecos, voltado a família. O show do dia é o ' +
                  'Indiana Jones.' },
        { nome: 'The Magic of Disney Animation — abre em 14/09/2026, mas não é atração ' +
                 'de fila: é aula de desenho com um animatrônico do Olaf, encontros com ' +
                 'personagens e um teatro. Sem nenhum interesse para vocês, e ocuparia a ' +
                 'janela do Star Tours' },
      ],
      fechado: [
        'Muppet*Vision 3D — fechou em 08/06/2025 para dar lugar à Monstropolis, a land de ' +
        'Monsters, Inc. prevista para 2027',
        'PizzeRizzo e o Muppets Courtyard inteiro — fecharam junto, em junho de 2025',
      ],
    },
  },

  /* ===== 16/11 · SEGUNDA · ANIMAL KINGDOM ================================ */
  {
    id: 'd-2026-11-16',
    data: '2026-11-16',
    diaSemana: 'segunda',
    emoji: '🦁',
    titulo: 'Animal Kingdom',
    subtitulo: 'Rope drop na África · Pandora no fim',
    tipo: 'parque',
    operadora: 'disney',
    parqueId: 'animal-kingdom',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-10',
    referencia: { rotulo: 'Abertura do parque', padrao: '08:00', confirmado: true },

    resumo:
      'O dia inteiro é uma inversão: todo mundo corre para Pandora na abertura, e vocês vão ' +
      'para o lado oposto. A recompensa vem no fim — o safári ao entardecer, quando os leões ' +
      'acordam, e a fila do Flight of Passage no último minuto, que devolve Pandora escura, ' +
      'acesa e vazia na saída.',

    avisos: [
      'O PARQUE ABRE ÀS 8H E FECHA ÀS 18H, pelo calendário publicado — uma hora antes dos outros ' +
      'parques Disney, e é por isso que a saída do hotel é 6h30. O Early Entry, que vocês ' +
      'não têm, começa às 7h30.',
      'NÃO VÃO PARA PANDORA DE MANHÃ. O Early Entry do Animal Kingdom inclui Pandora, e mais ' +
      'de 90% dos visitantes correm para lá. O parque inteiro fica vazio do outro lado.',
    ],

    notas: [
      { tipo: 'atencao', texto:
        'O FECHAMENTO ÀS 18H É O QUE COREOGRAFA A RETA FINAL: o safári ao entardecer, o Na’vi ' +
        'e a fila do Flight of Passage no último minuto estão encaixados nele — e o ' +
        'horário oficial de 12/09 confirmou os 18h. O plano A vale como está, e o Sanaa ' +
        'das 19h50 deixa de ter risco de colisão.',
        pesquisa: '2026-09-12' },

      { tipo: 'bom', texto:
        'MAIS DE 90% DOS VISITANTES CORREM PARA PANDORA NO ROPE DROP. Nos primeiros 60 a 90 ' +
        'minutos o resto do parque fica praticamente vazio: Kilimanjaro Safaris, Expedition ' +
        'Everest e Kali River Rapids costumam ser walk-on ou menos de 15 minutos. É essa ' +
        'janela que o dia usa.',
        pesquisa: '2026-09-10' },

      { tipo: 'bom', texto:
        'O SAFÁRI VALE DUAS VEZES E É A ÚNICA ATRAÇÃO DO PARQUE ASSIM. De manhã os animais ' +
        'estão ativos com o frio e não há fila. No fim da tarde os LEÕES ACORDAM — são ' +
        'noturnos e dormem o dia todo — e a Disney instalou iluminação no percurso para o ' +
        'safári rodar mesmo depois do pôr do sol. ATENÇÃO: ele fecha 30 a 60 minutos ANTES ' +
        'do parque, então confirmem o horário dele no dia.',
        pesquisa: '2026-09-10' },

      { tipo: 'bom', texto:
        'DÁ PARA ENTRAR NA FILA ATÉ O MINUTO DO FECHAMENTO e completar a atração depois. É ' +
        'política da Disney e é o que sustenta o bloco das 17h45: a fila do Flight of Passage ' +
        'cai de 100–180 minutos no pico para 40–65 depois das 17h, e vocês saem andando por ' +
        'uma Pandora escura e vazia.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'O pôr do sol em Orlando em meados de novembro é por volta das 17h30. Toda a reta ' +
        'final do dia segue o sol, não a abertura do parque — por isso aqueles blocos são ' +
        'fixos e não deslocam com a referência.',
        pesquisa: '2026-09-08' },
    ],

    /* --------------------------------------------------------------------- */
    planos: [
      {
        letra: 'A',
        titulo: 'O dia como está escrito',
        gatilho: 'Parque das 8h às 18h e o safári rodando até pelo menos 17h.',
        passos: [
          'Pré-fila no checkpoint da ÁFRICA, não na ponte de Pandora.',
          'Safári, Everest e as trilhas de manhã, com o parque vazio do lado de cá.',
          'Meio do dia nos shows e no Nomad Lounge, que é o descanso do dia.',
          'Safári de novo às 16h30, agora atrás dos leões.',
          'Na’vi às 17h15 e a fila do Flight of Passage às 17h45 — até o último minuto vale.',
          'Sair devagar pela Pandora escura, com o Awakenings na Árvore da Vida.',
        ],
      },
      {
        letra: 'B',
        titulo: 'O safári fecha cedo demais',
        gatilho: 'Na parada das 15h25 vocês descobrem que o último caminhão sai antes das 16h30.',
        passos: [
          'VÃO AGORA. Larguem o resto e peguem o safári enquanto ele ainda roda — é o bloco ' +
          'mais insubstituível da tarde.',
          'Isso adianta a reta final. O Na’vi sobe para o horário que sobrar e vocês chegam ' +
          'na fila do Flight of Passage mais cedo, o que é bom: mais margem antes do ' +
          'fechamento.',
          'Se sobrar tempo depois do Na’vi, o Everest de novo é o melhor uso — a fila dele ' +
          'também cede no fim do dia.',
        ],
      },
      {
        letra: 'B2',
        titulo: 'A Disney mexe no horário depois de publicado',
        gatilho: 'O oficial é 8h às 18h, mas a semana do Thanksgiving costuma esticar o dia.',
        passos: [
          'ABRIU MAIS TARDE: mudem a referência aqui no app. A manhã inteira desloca junto, ' +
          'inclusive a saída do hotel. Os shows têm sessão própria — confiram a grade e ' +
          'ajustem no selo de horário de cada um.',
          'FECHOU MAIS TARDE (19h ou 20h): o dia respira, MAS CUIDADO COM O SANAA. A mesa é ' +
          'às 19h50 e a Disney cobra taxa de não comparecimento, com cancelamento exigido ' +
          'com 2 horas de antecedência (+1 407-939-3463).\n\n' +
          'Com fechamento às 19h ou às 20h, NÃO dá para fazer as duas coisas: a fila do ' +
          'Flight of Passage no último minuto termina depois das 19h30, e ainda são 25 ' +
          'minutos saindo de Pandora e 25 de Uber até a mesa das 19h50. Ou vocês remarcam o ' +
          'Sanaa para as 21h logo de manhã, pelo My Disney Experience, ou mantêm a fila do ' +
          'Flight of Passage às 17h45 como está no plano A e usam a folga que sobrou para ' +
          'o Everest. A segunda opção é a segura.',
          'A RETA FINAL NÃO DESLOCA COM A ABERTURA. Ela segue o sol e o fechamento, por isso ' +
          'aqueles blocos são fixos. Se o app avisar colisão em vermelho no meio do dia, é o ' +
          'almoço ou os shows batendo — ajustem esses, não o fim.',
        ],
      },
      {
        letra: 'C',
        titulo: 'Chuva forte ou o dia desandou',
        gatilho: 'Chuva que não passa, cansaço, ou o dia atrasou demais.',
        passos: [
          'O Animal Kingdom é o parque com menos cobertura da Disney. Com chuva forte, o ' +
          'Festival of the Lion King é teatro fechado, e o Nomad Lounge tem varanda ' +
          'coberta com ventilador.',
          'O safári RODA na chuva e os animais costumam ficar mais ativos. O caminhão tem ' +
          'teto. Não é motivo para desistir dele.',
          'O QUE NÃO SE SACRIFICA: a fila do Flight of Passage no fim, e o safári do ' +
          'entardecer. Se for para cortar, cortem nesta ordem: o Everest de novo (15h45), ' +
          'o Kali (9h15) e as trilhas. Os três são opcionais de propósito e existem ' +
          'justamente para serem a margem.',
          'Se vocês estiverem destruídos, o Sanaa às 19h50 tem tolerância curta e taxa por ' +
          'não comparecimento: cancelem com 2 horas de antecedência pelo My Disney Experience ' +
          'ou pelo +1 407-939-3463.',
        ],
      },
    ],

    /* --------------------------------------------------------------------- */
    naoPerca: [
      { nome: 'Pandora escura, na saída', quando: 'hoje', custo: 'grátis',
        motivo: 'A vegetação inteira é pintada com tinta reativa e acende em azul e roxo. ' +
                'Saindo do Flight of Passage por volta das 18h30, vocês atravessam a land ' +
                'no escuro e praticamente sem ninguém, porque o parque já fechou. É a ' +
                'recompensa do dia e é de graça.',
        pesquisa: '2026-09-10' },

      { nome: 'Tree of Life Awakenings', quando: 'hoje', custo: 'grátis',
        condicao: 'só em noites de outono e inverno',
        motivo: 'Projeção de animais no tronco da Árvore da Vida, a cada dez minutos depois ' +
                'que escurece, até o fechamento — e costuma continuar um pouco depois. ' +
                'Novembro está na temporada. Vocês passam por baixo dela na saída, exatamente ' +
                'nessa janela.',
        pesquisa: '2026-09-10' },

      { nome: 'O safári ao entardecer', quando: 'hoje', custo: 'grátis',
        motivo: 'Leões são noturnos. A chance real de ver um acordado é no fim da tarde, e a ' +
                'Disney iluminou o percurso para o safári rodar depois do pôr do sol. É a ' +
                'única atração do parque em que repetir dá conteúdo diferente.',
        pesquisa: '2026-09-10' },

      { nome: 'Kali River Rapids', quando: 'decidir', custo: 'grátis',
        condicao: 'molha de verdade, e às 9h15 ainda está fresco',
        motivo: 'Em novembro Orlando amanhece por volta dos 15°C. Se o dia estiver frio, ' +
                'pular ganha 35 minutos e evita passar o resto do dia com roupa molhada. Se ' +
                'estiver quente, é diversão barata e sem fila naquela hora.' },

      { nome: 'Single Pass do Flight of Passage', quando: 'comprado',
        custo: 'US$ 18–20 por pessoa',
        motivo: 'COMPRADO EM 08/11, junto do resto. Ele é o Single Pass que mais esgota antes ' +
                'da data, e a única janela de compra de vocês é 08/11: deixar para decidir ' +
                'dentro do parque é apostar que ainda vai existir. Sem ele, o fim do dia só ' +
                'fechava se as quatro filas da reta final dessem todas o mínimo.',
        pesquisa: '2026-09-17' },

      { nome: 'Starlight Safari', quando: 'descartado',
        custo: 'US$ 75 a 89 por pessoa · US$ 150 a 178 no casal',
        motivo:
          'Safári noturno na savana do Animal Kingdom Lodge, 1h30, com óculos de visão ' +
          'noturna, saindo às 20h30 e às 22h. Não exige hospedagem, e vocês já estarão no ' +
          'Lodge para o Sanaa.\n\n' +
          'Fica de fora por dois motivos. O preço — US$ 150 a 178 no casal, a mesma régua ' +
          'que deixa o Amphicar de fora a US$ 62 por cabeça. E SERIA O TERCEIRO SAFÁRI DO ' +
          'MESMO DIA: o roteiro já faz o Kilimanjaro de manhã e de novo ao entardecer, ' +
          'quando os leões acordam.',
        pesquisa: '2026-09-09' },
    ],

    /* --------------------------------------------------------------------- */
    prepararAmanha: {
      paraODia: '2026-11-17',
      titulo: 'Universal Studios · primeiro dia de Universal',
      aviso:
        'Amanhã muda de operadora. O ingresso é outro, o app é outro, e as regras de fila ' +
        'são outras — não existe Multi Pass nem Single Pass lá.',
      itens: [
        { texto: 'Ingressos Universal aparecendo no app da Universal, nos DOIS perfis',
          critico: true,
          motivo: 'É outro aplicativo, outra conta. Confiram HOJE que os dois estão lá. O ' +
                  'PARK-TO-PARK não é para amanhã — o Hogwarts Express é no dia 23 — ' +
                  'mas é o mesmo ingresso, e se estiver errado é melhor descobrir agora do ' +
                  'que na catraca.' },
        { texto: 'Conferir o horário de abertura do Universal Studios', critico: true,
          motivo: 'Amanhã assume 9h. Se for outro, mudem a referência e a manhã desloca junto.' },
        { texto: 'Alarme para 6h45 nos dois celulares', critico: true,
          motivo: 'Saída às 7h45, e hoje termina perto das 21h30. Um alarme só falha.' },
        { texto: 'Mochila remontada e celular carregando', critico: true,
          motivo: 'Os dois soft flasks, barrinhas, protetor solar, power bank, cabo e uma camada ' +
                  'leve para cada um.\n\n' +
                  'E ATENÇÃO ÀS ATRAÇÕES COM LOCKER OBRIGATÓRIO: a Universal tem dez delas, ' +
                  'com detector de metal em três — Hulk, VelociCoaster e Stardust Racers, ' +
                  'nenhuma delas amanhã. Levem o mínimo possível nos bolsos ' +
                  'amanhã — cada locker custa 10 a 15 minutos que o roteiro não conta.' },
        { texto: 'Guardar as compras da Windtraders',
          motivo: 'A loja de Pandora fica na saída do Flight of Passage e é a única do tema. ' +
                  'Amanhã a mochila precisa sair leve.' },
      ],
    },

    blocos: [
      { id: 'b-1611-0730', hora: '06:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel',
        descricao: 'Uber, ~35 min, US$ 20–30. O AK tem entrada direta',
        contexto:
          'Diferente do Magic Kingdom, aqui o Uber deixa vocês na entrada — não há ' +
          'monotrilho nem barco no meio. Ainda assim a saída é cedo, porque a estimativa é ' +
          'que o parque abra às 8h e não às 9h: em novembro o Animal Kingdom costuma operar ' +
          'das 8h às 18h.',
        localId: 'animal-kingdom', acesso: [], critico: true, duracaoMin: 45 },

      { id: 'b-1611-0815', hora: '07:15', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão · pré-fila no checkpoint da ÁFRICA',
        descricao: 'Não na ponte de Pandora',
        contexto:
          'A MESMA DECISÃO CONTRAINTUITIVA DO DIA 11, e aqui ela é ainda mais forte.\n\n' +
          'A CATRACA ABRE PARA TODO MUNDO 30 A 45 MINUTOS ANTES DAS 8H. Quem não é hóspede ' +
          'passa pelo Oasis e espera na Discovery Island, em volta da Árvore da Vida. Os ' +
          'checkpoints do Early Entry ficam ali, um na passagem para cada área, e vocês ' +
          'esperam no da ÁFRICA.\n\n' +
          'Mais de 90% dos visitantes correm para Pandora no rope drop — e o Early Entry do ' +
          'Animal Kingdom INCLUI Pandora. São só quatro atrações no Early Entry e duas delas ' +
          'são o Flight of Passage e o Na’vi. Ou seja: os hóspedes Disney já andaram nas duas ' +
          'antes de vocês, e ainda estão na fila quando a corda solta para vocês, às 8h.\n\n' +
          'O resto do parque fica praticamente vazio nos primeiros 60 a 90 minutos. Kilimanjaro ' +
          'Safaris, Expedition Everest e Kali River Rapids costumam ser walk-on nessa janela. ' +
          'É para lá que vocês vão.\n\n' +
          'Café da manhã aqui, das barrinhas da mochila, e a foto de vocês com a Árvore da ' +
          'Vida no fundo: ela fica no caminho do checkpoint, e antes das 8h a praça ainda não ' +
          'encheu. O almoço é só às 12h30.\n\n' +
          'PONTO DE ENCONTRO DE HOJE: a base da Árvore da Vida, na Discovery Island. É ' +
          'visível de quase todo o parque e todo caminho passa por ela. Se vocês se ' +
          'perderem, vão para lá e ESPEREM.',
        localId: 'animal-kingdom', acesso: [], duracaoMin: 45, pesquisa: '2026-09-12',
        curiosidades: [
          { texto: 'Vocês esperam embaixo de uma árvore de concreto de 44 metros, com cerca de ' +
                   '102 mil folhas artificiais. A estrutura foi fabricada em Houston, no pátio ' +
                   'da Brown & Root — a empreiteira que construiu uma das primeiras ' +
                   'plataformas de petróleo no mar do mundo.',
            fonte: 'Wikipedia — Tree of Life (Disney); Wikipedia — Brown & Root', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-0935', hora: '08:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Kilimanjaro Safaris — rope drop',
        descricao: 'Walk-on, e os animais estão ativos com o frio da manhã',
        contexto:
          'Safári de caminhão por 45 hectares com animais soltos de verdade — girafas, leões, ' +
          'elefantes, rinocerontes. Dura cerca de 22 minutos e cada passeio é diferente.\n\n' +
          'DE MANHÃ É QUANDO ELES ESTÃO ATIVOS: no calor da tarde se escondem na sombra. E ' +
          'às 8h a fila não existe, porque o parque inteiro está em Pandora.\n\n' +
          'Vocês voltam aqui às 16h30. É a única atração do parque em que repetir dá conteúdo ' +
          'diferente, e o motivo está naquele bloco.',
        areaParque: 'Africa', acesso: ['rope-drop', 'standby'], critico: true, duracaoMin: 34,
        fila: { min: 10, quando: 'na abertura', pico: 55, fonte: '2026-09-10' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'A savana tem uns 45 hectares e 32 espécies. Os caminhões são GMC e Ford de ' +
                   'verdade, movidos a propano, e a “lama” seca na lataria é cimento pintado.',
            fonte: 'Wikipedia — Kilimanjaro Safaris', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-1040', hora: '08:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Expedition Everest',
        descricao: 'Walk-on pelo mesmo motivo',
        contexto:
          'Montanha-russa dentro de uma montanha cenográfica de 60 metros, com um trecho longo ' +
          'andando para trás no escuro. É a mais intensa do parque, mas ainda assim familiar — ' +
          'sem inversões. A fila tem um museu de ioga e ietis que vale olhar.\n\n' +
          'Ela está no Early Entry, mas continua vazia na abertura oficial porque todo mundo ' +
          'que entrou cedo foi para Pandora.\n\n' +
          'SINGLE RIDER: a Disney retirou a placa da fila de single rider em julho de 2026, e ' +
          'ela deve acabar. Se precisarem, perguntem ao funcionário da entrada.',
        areaParque: 'Asia', acesso: ['standby'], duracaoMin: 35,
        fila: { min: 15, quando: 'na abertura', pico: 40, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'A montanha tem 199,5 pés, 60,8 metros: a partir de 200 pés a lei americana ' +
                   'exigiria uma luz de aviso para aviões no topo. É a montanha artificial ' +
                   'mais alta do mundo e custou uns US$ 100 milhões.',
            fonte: 'Wikipedia — Expedition Everest', pesquisa: '2026-09-15' },
          { texto: 'A fila tem um museu do Yeti com cerca de 8 mil objetos do Nepal, onde a ' +
                   'Disney fez expedições de pesquisa em 2005.',
            fonte: 'Wikipedia — Expedition Everest', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-0915', hora: '09:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Kali River Rapids',
        descricao: 'MOLHA DE VERDADE. Opcional, e a decisão é o clima',
        contexto:
          'Bote circular por corredeiras. Não é radical — o valor está no cenário e em se ' +
          'molhar junto. E vocês vão se molhar: não é respingo, é balde.\n\n' +
          'A DECISÃO É A TEMPERATURA. Em novembro Orlando amanhece por volta dos 15°C e às ' +
          '9h15 ainda não esquentou. Se o dia estiver fresco, pulem sem culpa e ganhem 35 ' +
          'minutos — vocês têm capa de chuva na mochila, mas roupa molhada às 9h estraga o ' +
          'resto do dia.\n\n' +
          'Se fizerem: capa de chuva vestida, celular no Ziploc, e há lockers na entrada.',
        areaParque: 'Asia', acesso: ['standby'], molha: true, opcional: true, duracaoMin: 35,
        fila: { min: 15, quando: 'na abertura', pico: 45, estimado: true, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'Antes de abrir, em 1999, ela se chamaria Tiger Rapids Run. O percurso é ' +
                   'uma denúncia: a floresta verde vira toco queimado, e um caminhão de ' +
                   'madeira ilegal aparece atolado no rio.',
            fonte: 'Wikipedia — Kali River Rapids', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-1415', hora: '09:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Maharajah Jungle Trek',
        descricao: 'Trilha a pé. Tigres. Sem fila, no ritmo de vocês',
        contexto:
          'Trilha a pé por ruínas cenográficas com tigres, dragões-de-komodo e morcegos ' +
          'gigantes. Sem fila, no seu ritmo, com muita sombra.\n\n' +
          'Vem aqui de propósito: se vocês fizeram o Kali, é a hora de secar andando.',
        areaParque: 'Asia', acesso: [], duracaoMin: 39,
        curiosidades: [
          { texto: 'A trilha conta a história de um marajá que cercou a floresta para caçar e ' +
                   'morreu num acidente de caça. Gerações depois, a área virou santuário.',
            fonte: 'Wikipedia — Maharajah Jungle Trek', pesquisa: '2026-09-15' },
          { texto: 'Os tigres de hoje são de Sumatra, e dois filhotes nasceram no parque em ' +
                   '2017. Os búfalos-d’água, que chegaram em 2015, têm nomes das personagens ' +
                   'de The Golden Girls.',
            fonte: 'Wikipedia — Maharajah Jungle Trek', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-1030p', hora: '10:35', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Quinze minutos. Banheiro na Harambe, ao lado do Tusker House',
        contexto:
          'Banheiro, encher os flasks num balcão de comida (água gelada de graça, é só ' +
          'pedir) e sentar.\n\n' +
          'Toda land tem banheiro, normalmente ao lado do maior balcão de comida. Não vale ' +
          'procurar no mapa; vale parar quando o corpo pedir.',
        areaParque: 'Africa', acesso: [], duracaoMin: 15 },

      { id: 'b-1611-1545', hora: '10:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Gorilla Falls Exploration Trail',
        descricao: 'Trilha. Ritmo lento de propósito',
        contexto:
          'Trilha a pé com gorilas, hipopótamos vistos por baixo d’água e um aviário. ' +
          'Diferente do safári, aqui vocês param quanto quiserem.',
        areaParque: 'Africa', acesso: [], duracaoMin: 40,
        curiosidades: [
          { texto: 'A trilha abriu com este nome em 1998, virou Pangani Forest Exploration ' +
                   'Trail poucos meses depois e só recuperou o nome original em 2016.',
            fonte: 'Wikipedia — Gorilla Falls Exploration Trail', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-1315', hora: '11:30', ancora: 'fixo', tipo: 'show',
        titulo: 'Festival of the Lion King — chegar 11h30, show 11h50',
        descricao: 'Os 20 min de chegar antes estão dentro deste bloco',
        contexto:
          'Espetáculo em teatro circular com acrobatas, cantores e carros alegóricos. É quase ' +
          'todo música e acrobacia.\n\n' +
          'CHEGUEM 11H30 PARA O SHOW DE 11H50. Os vinte minutos de antecedência não são ' +
          'exagero: a plateia é por ordem de chegada e a primeira fila é ruim. Este bloco ' +
          'já tem esse tempo dentro dele — não é folga.\n\n' +
          'Vem logo depois do Gorilla Falls de propósito: os dois ficam na África, e assim ' +
          'vocês atravessam para Pandora uma vez só, já indo almoçar.\n\n' +
          'HORÁRIO FIXO de sessão — confiram a grade no app da Disney no dia e ajustem aqui ' +
          'se a sessão for outra. Se a mais próxima for muito diferente das 11h30, o almoço ' +
          'acompanha.',
        areaParque: 'Africa', acesso: [], duracaoMin: 50, confirmarHorario: true,
        curiosidades: [
          { texto: 'Estreou com o parque, na Camp Minnie-Mickey. Com a obra de Pandora, ganhou ' +
                   'este teatro em Harambe em 01/06/2014. A plateia se divide em quatro ' +
                   'setores com nomes de bichos: girafa, elefante, javali e leão.',
            fonte: 'Wikipedia — Festival of the Lion King', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-1215', hora: '12:30', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Satu’li Canteen',
        descricao: 'Balcão, em Pandora. Um dos melhores da Disney',
        contexto:
          'Serviço de balcão com tigelas montáveis — escolhem proteína e base. É ' +
          'consistentemente eleito o melhor quick service do Walt Disney World.\n\n' +
          'Usem mobile order pelo app: a fila do balcão aqui é longa e a do mobile order não ' +
          'existe. Peçam durante o Festival of the Lion King, sentados.\n\n' +
          'São dez minutos de caminhada da África até Pandora, e o app soma essa caminhada ' +
          'aos 65 minutos deste bloco — não é tempo de mesa, é tempo de chegar.\n\n' +
          'É a primeira vez que vocês pisam em Pandora hoje, e é de dia. Olhem as montanhas ' +
          'flutuantes agora, porque à noite o lugar é outro — e vocês voltam.',
        restauranteId: 'r-satuli', areaParque: 'Pandora', acesso: [], duracaoMin: 65,
        curiosidades: [
          { texto: 'As montanhas flutuantes têm 47 metros, com a sustentação de aço escondida ' +
                   'por perspectiva forçada, e se inspiram nos picos de Zhangjiajie, na China. ' +
                   'A land se passa gerações depois do filme.',
            fonte: 'Wikipedia — Pandora – The World of Avatar', pesquisa: '2026-09-15' },
          { texto: 'James Cameron conta que achava que a Disney queria uma atração de Avatar. ' +
                   'A Disney queria a land inteira.',
            fonte: 'Wikipedia — Pandora – The World of Avatar', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-1345', hora: '13:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Discovery Island Trails e a Árvore da Vida',
        descricao: 'Trilhas curtas em volta da árvore. Quase ninguém faz',
        contexto:
          'Trilhas laterais que contornam a base da Árvore da Vida, com lêmures, lontras e ' +
          'cangurus. Quase ninguém entra — a maioria fotografa a árvore de longe e segue.\n\n' +
          'Olhem a árvore de perto: são 337 animais esculpidos no tronco e nas raízes. À ' +
          'noite ela vira outra coisa, e vocês vão ver isso na saída.',
        areaParque: 'Discovery Island', acesso: [], duracaoMin: 45,
        curiosidades: [
          { texto: 'A árvore levou 18 meses para ficar pronta, com três Imagineers e dez ' +
                   'artistas liderados pelo escultor Zsolt Hormay.',
            fonte: 'Wikipedia — Tree of Life (Disney)', pesquisa: '2026-09-15' },
          { texto: 'Dentro do tronco há um teatro de 428 lugares. Foi o It’s Tough to Be a Bug ' +
                   'de 1998 a 2025, e hoje passa o Zootopia.',
            fonte: 'Wikipedia — Tree of Life (Disney)', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-1630', hora: '14:25', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Nomad Lounge — a varanda',
        descricao: 'O lugar mais gostoso do parque. Drink e petisco',
        contexto:
          'Bar ao lado do Tiffins, com varanda sobre a água e ventiladores. Drinks autorais e ' +
          'petiscos.\n\n' +
          'Costuma ter espera de 15 a 30 minutos e não aceita reserva: entrem na lista de ' +
          'espera pelo app da Disney, ou no balcão, e passeiem enquanto esperam.\n\n' +
          'Esta hora é o VAZIO PROPOSITAL do dia, só que com sombra e bebida. Vocês vão ' +
          'precisar dela: a partir das 16h30 o dia não para mais até o jantar.',
        restauranteId: 'r-nomad', areaParque: 'Discovery Island', acesso: [], duracaoMin: 60,
        curiosidades: [
          { texto: 'O Tiffins, ao lado, abriu em 27/05/2016, no dia em que o parque começou a ' +
                   'abrir à noite. A arte das salas dele nasceu das fotos e desenhos das ' +
                   'viagens de pesquisa dos Imagineers pela África, Ásia e América do Sul.',
            fonte: 'WDWNT; Wikipedia — Disney’s Animal Kingdom', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-1545p', hora: '15:25', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — antes da reta final',
        descricao: 'Flasks, power bank, o horário do safári. Banheiro junto do Flame Tree Barbecue',
        contexto:
          'A reta final começa agora e é coreografada minuto a minuto.\n\n' +
          'COMAM ALGUMA COISA DA MOCHILA. Os petiscos do Nomad foram às 14h25 e o Sanaa é ' +
          'às 19h50 — cinco horas, com o safári, o Na’vi e 55 minutos de fila do ' +
          'Flight of Passage no meio. Entrar naquela fila com fome é o erro mais fácil de ' +
          'evitar do dia.\n\n' +
          'E duas conferências antes de tudo:\n\n' +
          'CONFIRAM NO APP DA DISNEY A QUE HORAS O KILIMANJARO SAFARIS FECHA. Ele fecha 30 a ' +
          '60 minutos ANTES do parque, e o bloco das 16h30 depende disso. Se o último caminhão ' +
          'sair às 17h, está tudo bem. Se sair às 16h30, vão agora.\n\n' +
          'E confiram a hora do fechamento do parque, que é o que sustenta o bloco do Flight ' +
          'of Passage às 17h45.',
        areaParque: 'Discovery Island', acesso: [], duracaoMin: 15, critico: true },

      { id: 'b-1611-1041', hora: '15:45', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Expedition Everest de novo',
        descricao: 'Opcional — e é também a margem da reta final',
        contexto:
          'O Animal Kingdom tem UMA montanha-russa e vocês a fizeram às 8h40. Este bloco ' +
          'existe para ela não ser feita uma vez só num dia de dez horas.\n\n' +
          'É DUPLO PROPÓSITO, e é por isso que ele é opcional: se o dia estiver no horário, ' +
          'andem de novo — a fila do fim de tarde é curta. Se estiver atrasado, PULEM SEM ' +
          'PENSAR. Estes 45 minutos são a margem que protege o safári do entardecer e a ' +
          'fila do Flight of Passage, que são os dois blocos insubstituíveis do dia.',
        areaParque: 'Asia', acesso: ['standby'], opcional: true, duracaoMin: 39,
        fila: { min: 20, quando: 'no fim da tarde', pico: 40, estimado: true, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'O Yeti tem 7,6 metros e era o maior animatrônico da Disney quando a ' +
                   'atração abriu, em 2006. Meses depois a estrutura rachou, e desde então ele ' +
                   'fica parado sob luz estroboscópica — o “Disco Yeti”. Em 15/08/2026 a ' +
                   'Disney anunciou na D23 que vai consertá-lo, ainda sem data.',
            fonte: 'Wikipedia — Expedition Everest; BlogMickey; Wandering In Disney', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-1631', hora: '16:30', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Kilimanjaro Safaris DE NOVO — agora ao entardecer',
        descricao: 'Os leões acordam. É outro safári',
        contexto:
          'É A ÚNICA ATRAÇÃO DO PARQUE EM QUE REPETIR DÁ CONTEÚDO DIFERENTE, e é o melhor ' +
          'truque do dia.\n\n' +
          'Leões são noturnos e dormem o dia inteiro. A chance real de ver leão acordado é no ' +
          'fim da tarde, perto do fechamento — e a Disney instalou iluminação em todo o ' +
          'percurso justamente para o safári continuar rodando depois que o sol se põe.\n\n' +
          'De quebra, a última hora do safári é quando praticamente não há fila: quem queria ' +
          'já foi de manhã.\n\n' +
          'HORÁRIO FIXO, colado no fim do dia e não na abertura. E confirmem o horário de ' +
          'fechamento do safári na parada anterior — ele fecha antes do parque.',
        areaParque: 'Africa', acesso: ['standby'], critico: true, duracaoMin: 35,
        fila: { min: 15, quando: 'na última hora', pico: 55, fonte: '2026-09-10' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'O safári noturno voltou em 2016, com um “pôr do sol” artificial e sons de ' +
                   'animais no percurso.',
            fonte: 'Wikipedia — Kilimanjaro Safaris', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-0900', hora: '17:15', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Na’vi River Journey',
        descricao: 'A fila também cede no fim do dia',
        contexto:
          'Passeio de barco de 5 minutos por uma floresta bioluminescente de Pandora. Não tem ' +
          'emoção nenhuma — é puramente visual, e o animatrônico da Xamã no fim é considerado ' +
          'o melhor que a Disney já construiu.\n\n' +
          'Capacidade baixa e fila cruel o dia inteiro; no fim do fim ela cede junto com o ' +
          'resto do parque. E é a entrada certa para o que vem depois: vocês já ficam em ' +
          'Pandora, com o sol se pondo.',
        areaParque: 'Pandora', acesso: ['standby'], duracaoMin: 30,
        fila: { min: 30, quando: 'no fim do dia', pico: 65, fonte: '2026-09-10' },
        curiosidades: [
          { texto: 'A música é de James Horner, o compositor de Avatar, com Simon Franglen.',
            fonte: 'Wikipedia — Na’vi River Journey', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-1120', hora: '17:45', ancora: 'fixo', tipo: 'atracao',
        titulo: 'ENTRAR NA FILA do Flight of Passage',
        descricao: 'A melhor atração do Walt Disney World, pelo menor preço do dia',
        contexto:
          'Simulador em que vocês montam num banco de moto e “voam” num banshee sobre ' +
          'Pandora, com tela 3D gigante, vento, cheiro e o banco respirando embaixo de vocês. ' +
          'É consenso como a melhor atração da Disney no mundo.\n\n' +
          'ESTE BLOCO É O MOTIVO DE O DIA INTEIRO ESTAR NESTA ORDEM. A fila dele fica entre ' +
          '100 e 180 minutos das 11h às 15h, e cai para 40 a 65 depois das 17h. Entrando ' +
          'agora, vocês pagam a menor fila do dia pela maior atração do complexo — e não ' +
          'gastam o Single Pass.\n\n' +
          'A REGRA QUE FAZ ISSO FUNCIONAR: quem está na fila no horário de fechamento anda. ' +
          'Dá para entrar até o último minuto e completar a atração depois do parque fechado. ' +
          'Se a fila estiver em 50 minutos e faltarem 15 para fechar, entrem mesmo assim.\n\n' +
          'Há locker na entrada e nada solto é permitido.',
        areaParque: 'Pandora', acesso: ['standby'], locker: true, critico: true, duracaoMin: 55,
        fila: { min: 50, quando: 'na última hora', pico: 180, fonte: '2026-09-10' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'A imagem é em 10K a 60 quadros por segundo, e a atração ganhou em 2018 o ' +
                   'prêmio da Visual Effects Society. Na história, vocês são “ligados” a um ' +
                   'avatar para voar num banshee — o rito de passagem dos jovens Na’vi.',
            fonte: 'Wikipedia — Avatar Flight of Passage', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-1730', hora: '18:40', ancora: 'fixo', tipo: 'livre',
        titulo: 'Sair caminhando pela Pandora escura',
        descricao: 'Acesa, vazia, e com a Árvore da Vida acordando no caminho',
        contexto:
          'ESTA É A RECOMPENSA DO DIA E ELA É DE GRAÇA.\n\n' +
          'Toda a vegetação de Pandora é pintada com tinta reativa e acende em azul e roxo ' +
          'quando escurece. Saindo do Flight of Passage por volta das 18h30, vocês atravessam ' +
          'a land inteira no escuro, iluminada, e praticamente sem ninguém — porque o parque ' +
          'já fechou e todo mundo foi embora.\n\n' +
          'No caminho para a saída, parem embaixo da ÁRVORE DA VIDA: o Tree of Life Awakenings ' +
          'roda a cada dez minutos depois que escurece, projetando animais no tronco. Ele só ' +
          'acontece em noites de outono e inverno — novembro está dentro — e costuma continuar ' +
          'um pouco depois do fechamento.\n\n' +
          'Não corram. Este bloco não tem fila, não tem ingresso e é o que vocês vão lembrar.\n\n' +
          'A WINDTRADERS FICA NA SAÍDA DO FLIGHT OF PASSAGE, e é a única loja de Pandora. ' +
          'Se vocês querem trazer alguma coisa deste dia, é aqui e é agora — amanhã não ' +
          'passa por aqui, e a loja fecha junto com o parque. Vale entrar mesmo que seja ' +
          'só para olhar.',
        areaParque: 'Pandora', acesso: [], duracaoMin: 25, pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'O Tree of Life Awakenings estreou em 27/05/2016.',
            fonte: 'Wikipedia — Tree of Life (Disney)', pesquisa: '2026-09-15' },
          { texto: 'Pandora tem 20 espécies de plantas inventadas para a land, e algumas ' +
                   'reagem ao toque com sensores da Disney Research.',
            fonte: 'Wikipedia — Pandora – The World of Avatar', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-1830', hora: '19:05', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Uber para o Animal Kingdom Lodge',
        descricao: 'Uber, ~10 min, US$ 10–15. Destino: Kidani Village, não o parque',
        contexto:
          'O Sanaa NÃO é dentro do parque: fica na Kidani Village, a ala de villas do Animal ' +
          'Kingdom Lodge, em 3701 Osceola Pkwy. No Uber, o destino é "Disney’s Animal ' +
          'Kingdom Villas – Kidani Village", e não o parque nem o prédio principal do Lodge, ' +
          'que tem outra entrada.\n\n' +
          'Levem o número da reserva à mão: 356258407484. Chegando 19h30, vocês têm vinte ' +
          'minutos de folga antes da mesa.',
        localId: 'ak-lodge', acesso: [], duracaoMin: 25, pesquisa: '2026-09-15' },

      { id: 'b-1611-1950', hora: '19:50', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Sanaa',
        descricao: 'Vão pela comida, não pela janela',
        contexto:
          'Cozinha indiana com influência africana; o nome quer dizer “obra de arte” em ' +
          'suaíli.\n\n' +
          'NÃO PEÇAM MESA NA JANELA. O pôr do sol em 16/11 é por volta das 17h30 e vocês ' +
          'chegam às 19h50 — está escuro há mais de duas horas. A savana tem iluminação ' +
          'fraca e, de dentro, o vidro vira espelho. A promessa de girafas e zebras na ' +
          'janela é real, mas só de dia. E hoje vocês já viram os bichos duas vezes, no ' +
          'safári.\n\n' +
          'O que sustenta a escolha é a comida. Peçam o BREAD SERVICE: cinco pães ' +
          'indianos com nove acompanhamentos, ~US$ 23, enorme e feito para dividir. É o ' +
          'prato mais elogiado do Walt Disney World inteiro e não existe igual em ' +
          'nenhum outro restaurante daqui.\n\n' +
          'Nos pratos principais: curry de frutos do mar goês, butter chicken, carne ' +
          'braseada ou vindaloo de porco, entre US$ 15 e 35. Reserva pelo My Disney ' +
          'Experience, janela abre 14/09. HORÁRIO FIXO de reserva.',
        restauranteId: 'r-sanaa', localId: 'ak-lodge', acesso: ['reserva'], duracaoMin: 90,
        curiosidades: [
          { texto: 'Kidani quer dizer “colar” em suaíli. A Kidani Village, onde fica o Sanaa, ' +
                   'abriu em 2009.',
            fonte: 'D23; Wikipedia — Disney’s Animal Kingdom Lodge', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1611-2125', hora: '21:25', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Uber, ~25 min, US$ 20–30',
        contexto:
          'Chamem do saguão do Animal Kingdom Lodge, não da porta do restaurante — a ' +
          'entrada de carro do hotel é onde o motorista consegue parar.\n\n' +
          'São dezesseis horas de pé desde as 5h30. Amanhã é Universal Studios, com saída às 7h45.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 25 },
    ],

    ficha: {
      multiPass: {
        usar: false, opcional: false, listaAlta: [], listaBaixa: [], planoB: null,
        nota:
          'Sem Multi Pass. O parque ficou menor sem a DinoLand, e chegando na abertura pelo ' +
          'lado certo — África e Ásia, longe de Pandora, para onde vai quase todo o Early ' +
          'Entry — vocês resolvem a manhã inteira no standby, quase sem fila.',
      },
      singlePass: {
        itens: [],
        opcionais: ['Avatar Flight of Passage'],
        nota:
          'COMPRADO EM 08/11. O Flight of Passage é o Single Pass que mais esgota antes da ' +
          'data, e a janela de compra de vocês é uma só. Sem ele, a reta final do dia ' +
          'dependia de as quatro filas — Everest, safári, Na’vi e Flight of Passage — darem ' +
          'todas o mínimo, e qualquer uma acima disso derrubava o Uber das 19h05 e o Sanaa.\n\n' +
          'COM A JANELA MARCADA, a reta final passa a ser construída em volta dela. Anotem a ' +
          'hora de retorno na véspera e confiram o encaixe com o safári do fim da tarde e o ' +
          'Na’vi.\n\n' +
          'O locker continua obrigatório: nada solto entra na atração.',
      },
      expressPass: null,
      custoEstimadoCasal: { min: 0, max: 40, moeda: 'USD' },
      extras: [
        { nome: 'Locker no Flight of Passage',
          texto: 'Nada solto é permitido. O locker é gratuito pelo tempo da atração, mas ' +
                 'some 5 a 10 minutos — contem isso no bloco das 17h45, que é justamente ' +
                 'o mais apertado do dia.' },
        { nome: 'O safári fecha antes do parque',
          texto: 'De 30 a 60 minutos antes. É a única informação do dia que vocês PRECISAM ' +
                 'conferir no app da Disney na hora — o bloco das 16h30 depende dela.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Feathered Friends in Flight' }, { nome: 'Bluey’s Wild World' },
        { nome: 'Wildlife Express Train' }, { nome: 'Rafiki’s Planet Watch' },
        { nome: 'The Animation Experience' },
        { nome: 'Zootopia: Better Zoogether! — 30 minutos num show que a própria ' +
                 'crítica chama de frenético e esquecível, num dia em que a única ' +
                 'montanha-russa do parque estava sendo feita uma vez só' },
      ],
      fechado: ['DINOSAUR e toda a DinoLand (demolidos para a futura Tropical Americas)'],
    },
  },

  /* ===== 17/11 · TERÇA · UNIVERSAL STUDIOS FLORIDA ====================== */
  {
    id: 'd-2026-11-17',
    data: '2026-11-17',
    diaSemana: 'terça',
    emoji: '🎥',
    titulo: 'Universal Studios Florida',
    subtitulo: 'O primeiro dia fora da Disney · rope drop no Gringotts',
    tipo: 'parque',
    operadora: 'universal',
    parqueId: 'universal-studios',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-10',
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },
    resumo:
      'O parque de rua, não de castelo: quarteirões de Nova York e São Francisco montados ' +
      'como cenário de cinema, com o Beco Diagonal escondido no fundo. O rope drop no ' +
      'Gringotts resolve a maior fila do parque antes das 10h.',
    avisos: [
      'A HORA DO DESFILE É PROPOSTA, NÃO CONFIRMAÇÃO. O roteiro assume 17h30, mas em anos ' +
      'anteriores ele rodou tanto às 17h30 quanto às 19h30. São duas horas de diferença no ' +
      'bloco que ancora a noite inteira — confiram no app da Universal e mexam nos blocos a ' +
      'partir do Bourne.',
      'Não existe Multi Pass nem Single Pass aqui. É outra operadora, outro app e outra ' +
      'conta — e a decisão de não comprar Express Pass já está fechada para todos os dias ' +
      'da Universal.',
    ],
    notas: [
      { tipo: 'info', texto:
        'O ROPE DROP NO GRINGOTTS FUNCIONA.\n\n' +
        'Nos quatro dias de Disney o Early Entry enche as atrações da abertura antes de ' +
        'vocês entrarem. Aqui não: o Early Park Admission da Universal é só para hóspede de hotel ' +
        'e alterna entre o Beco Diagonal e Hogsmeade — e a maioria usa em Hogsmeade, no ' +
        'Islands, o que deixa a primeira hora daqui mole.\n\n' +
        'Os números: o Gringotts faz ~15 minutos na primeira hora depois da abertura, 29 às ' +
        '10h e 83 às 15h, com pico de 190 e média de 57. É a maior vantagem de horário do ' +
        'dia inteiro, e ela é de graça.',
        pesquisa: '2026-09-10' },

      { tipo: 'alerta', texto:
        'TRÊS ATRAÇÕES DO PARQUE NÃO EXISTEM MAIS. Nenhuma delas é escolha de vocês — ' +
        'todas fecharam, e ficam em "fechado" com data:\n\n' +
        'HOLLYWOOD RIP RIDE ROCKIT — fechou em 2025 para dar lugar ao Fast & Furious: ' +
        'Hollywood Drift. CUIDADO COM A NOTÍCIA: o Hollywood Drift abre em 16/09/2026, mas ' +
        'em Universal Studios Hollywood, na Califórnia. A versão da Flórida só chega em ' +
        '2027. Nada ocupa o lugar dele na viagem de vocês.\n\n' +
        'FAST & FURIOUS: SUPERCHARGED — fechou em 17/08/2026, último dia de operação em 16/08.\n\n' +
        'WOODY WOODPECKER — fechou em 16/01/2023 junto com o resto da KidZone, que virou a ' +
        'DreamWorks Land.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'O E.T. VIROU MEIO-PERÍODO em maio de 2026. Ele pode simplesmente não estar operando ' +
        'no dia — é a única atração do roteiro nessa condição. O plano C trata disso, e é ' +
        'barato: os 35 minutos voltam para o Beco Diagonal.\n\n' +
        'Ele é o último passeio de 1990 ainda de pé no mundo, e é o motivo de estar aqui.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'A SAN FRANCISCO FICOU VAZIA. Com o Fast & Furious fechado, ela não tem mais nenhuma ' +
        'atração — virou área de passagem e de restaurante. Vocês atravessam por ela indo do ' +
        'New York para o Beco Diagonal, e é só isso que ela é hoje.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'A TEMPORADA DE NATAL DA UNIVERSAL COMEÇOU EM 14/11 e vai até 03/01. Vocês pegaram a ' +
        'primeira noite dela no Islands, no dia 14, e hoje pegam o desfile — o mesmo dos ' +
        'balões da Macy’s de Nova York, que a Universal traz para cá todo ano.',
        pesquisa: '2026-09-10' },
    ],
    planos: [
      { letra: 'A', titulo: 'O dia como está escrito',
        gatilho: 'Vocês estão no portão às 8h30 e o parque abre às 9h.',
        passos: [
          'Direto ao Beco Diagonal, sem parar na Minion Land — ela é a zona de esmagamento ' +
          'do rope drop justamente por ser a primeira que aparece, à esquerda da catraca.',
          'Gringotts primeiro, enquanto ele custa 15 minutos em vez de 83.',
          'Transformers na segunda hora, que é a última janela barata dele antes da noite.',
          'Mummy, Minion Land e o Beco com calma até o almoço.',
          'A tarde é a metade de baixo do anel: Men in Black, Simpsons, E.T. e o Bourne.',
          'Desfile, jantar, e o Beco à noite para fechar.',
        ] },
      { letra: 'B', titulo: 'O desfile é às 17h30 ou às 19h30',
        gatilho: 'Vocês conferem no app a hora do desfile.',
        passos: [
          'Às 17h30 é o cenário que o roteiro assume. Não muda nada.',
          'O Bourne termina 17h20 e vocês vão direto para o lugar do desfile, na própria ' +
          'Hollywood.',
          'Se a sessão for 19h30, remarquem o Lombard’s para 17h45 pelo app da Universal, e ' +
          'o Beco à noite vem antes do desfile, não depois — e o dia termina no desfile.',
        ] },
      { letra: 'B2', titulo: 'O parque fecha às 19h',
        gatilho: 'O horário oficial sai e o fechamento é 19h, não 21h ou 22h.',
        passos: [
          'Cai o Beco à noite, que é o último bloco.',
          'O jantar vira CityWalk, que fica fora da catraca e não fecha com o parque.',
          'Nada mais muda: a manhã e a tarde não dependem do fechamento.',
        ] },
      { letra: 'C', titulo: 'O E.T. está fechado',
        gatilho: 'Vocês chegam às 15h50 e ele não está operando — meio-período desde maio.',
        passos: [
          'Não insistam nem esperem: ele não reabre no meio do dia.',
          'Os 35 minutos vão para o Beco Diagonal, que é onde vocês vão querer estar.',
          'O Bourne não desloca: ele tem sessão marcada.',
        ] },
    ],
    blocos: [
      { id: 'b-1711-0745', hora: '07:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel',
        descricao: '30–35 min de Kissimmee. Uber US$ 25–35',
        contexto:
          'O estacionamento da Universal é pago e fica longe da catraca — são uns dez minutos ' +
          'de esteira rolante do prédio até o CityWalk, e mais cinco do CityWalk até o portão. ' +
          'De Uber vocês descem bem mais perto.',
        localId: 'universal-studios', acesso: [], duracaoMin: 45 },

      { id: 'b-1711-0830', hora: '08:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão',
        descricao: 'Meia hora antes da abertura. Mochila leve — hoje tem locker',
        contexto:
          'PONTO DE ENCONTRO DE HOJE: a fonte do globo giratório da Universal, logo depois da ' +
          'catraca. É o ponto mais óbvio do parque e todo mundo sabe onde fica. Se vocês se ' +
          'perderem, vão para lá e ESPEREM.\n\n' +
          'A PRIMEIRA COISA AO PASSAR: não parem na Minion Land, à esquerda da catraca. Ela é a ' +
          'primeira área que aparece e é exatamente por isso que ela entope no rope drop. ' +
          'Sigam reto.\n\n' +
          'A CATRACA PODE ABRIR BEM ANTES DAS 9H. Quando o Universal Studios é o parque da ' +
          'entrada antecipada de hotel do dia, ela abre uma hora antes para todo mundo, e quem ' +
          'é de fora espera na frente do parque até a abertura. Se estiver aberta, passem logo ' +
          'e fiquem o mais perto do caminho do Beco Diagonal que a equipe deixar.',
        localId: 'universal-studios', acesso: [], duracaoMin: 30, pesquisa: '2026-09-12' },

      { id: 'b-1711-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Harry Potter and the Escape from Gringotts',
        descricao: 'Rope drop. É o bloco que decide o dia',
        contexto:
          'Montanha-russa suave combinada com dark ride: vocês descem ao subterrâneo do banco ' +
          'dos duendes num carrinho que gira, com projeção, queda curta e Voldemort no meio. ' +
          'Não é radical — é cenário.\n\n' +
          'A FILA É METADE DA ATRAÇÃO. Ela passa pelo saguão do banco, com os duendes ' +
          'animatrônicos atrás das mesas, e por dois pré-shows. Entrar cedo é justamente o que ' +
          'deixa vocês percorrerem isso sem aperto.\n\n' +
          'POR QUE AGORA E NÃO DEPOIS: 15 minutos na primeira hora contra 83 às 15h, com pico ' +
          'de 190. Não existe segunda chance barata neste dia — a outra janela é depois das ' +
          '21h, e às 21h vocês já estão saindo do parque.\n\n' +
          'LOCKER OBRIGATÓRIO. Deixem os bolsos vazios antes de entrar na fila.',
        areaParque: 'Diagon Alley', acesso: ['rope-drop', 'standby'], acessoAlt: 'single-rider',
        acessoAltNota: 'Não na primeira vez: single rider pula o saguão dos duendes e os dois pré-shows.',
        critico: true, locker: true, duracaoMin: 40,
        fila: { min: 60, quando: 'às 9h, já carregado', pico: 190, media: 60, fonte: '2026-09-17' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'O dragão em cima do banco é um Ironbelly ucraniano de 18 metros.',
            fonte: 'Wikipedia — Harry Potter and the Escape from Gringotts', pesquisa: '2026-09-15' },
          { texto: 'Helena Bonham Carter e Ralph Fiennes gravaram cenas novas para a atração. ' +
                   'Daniel Radcliffe e Emma Watson não: os rostos deles aparecem com voz ' +
                   'dublada.',
            fonte: 'Wikipedia — Harry Potter and the Escape from Gringotts', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1711-0950', hora: '09:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Transformers: The Ride 3D',
        descricao: 'A segunda janela barata do dia, e ela fecha às 11h',
        contexto:
          'Simulador em veículo sem trilhos com telas 3D gigantes: vocês são jogados no meio ' +
          'de uma briga entre Autobots e Decepticons, com o veículo se movendo de verdade ' +
          'entre as telas. É barulhento e desorienta — e é bem melhor do que parece na foto.\n\n' +
          'ELE É WALK-ON POR EXATAMENTE UMA HORA DEPOIS DA ABERTURA, 30 minutos na segunda ' +
          'hora, e chega a 120 no pico. Fazer ele agora custa meia hora; fazer ao meio-dia ' +
          'custa o dobro.',
        areaParque: 'New York', acesso: ['standby'], acessoAlt: 'single-rider', duracaoMin: 35,
        fila: { min: 30, quando: 'na segunda hora', pico: 120, media: 33, fonte: '2026-09-10' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'Abriu em 20/06/2013 e custou cerca de US$ 100 milhões. As telas 3D têm até ' +
                   '18 metros de altura, o Optimus Prime tem a voz original do Peter Cullen, e ' +
                   'o diretor dos filmes, Michael Bay, participou do projeto.',
            fonte: 'Wikipedia — Transformers: The Ride', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1711-1030', hora: '10:30', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Revenge of the Mummy',
        descricao: 'Coaster no escuro com lançamento. Locker obrigatório',
        contexto:
          'Montanha-russa fechada com lançamento, efeitos de fogo e uma parada no escuro total ' +
          'no meio. Curta e muito bem feita — é consenso como a melhor montanha-russa deste ' +
          'parque.\n\n' +
          'A FILA DELE DISTRIBUI IGUAL O DIA INTEIRO, com média de 44 minutos: não existe hora ' +
          'boa nem hora ruim, e por isso ele fica aqui, entre duas atrações que têm hora certa.\n\n' +
          'LOCKER OBRIGATÓRIO: nada solto no carrinho, nem chave nem celular. Não tem detector ' +
          'de metal — ele só existe no Hulk, no VelociCoaster e no Stardust Racers.',
        areaParque: 'New York', acesso: ['standby'], acessoAlt: 'single-rider', locker: true,
        duracaoMin: 35,
        fila: { min: 30, quando: 'de manhã', pico: 120, media: 44, fonte: '2026-09-10' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'Abriu em 21/05/2004, no lugar do Kongfrontation. O Brendan Fraser aparece ' +
                   'no vídeo da fila e na cena final.',
            fonte: 'Wikipedia — Revenge of the Mummy', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1711-1105', hora: '11:05', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Dez minutos. Banheiro na New York, perto do Mummy',
        contexto:
          'Quatro atrações com fila e armário desde as 9h, e o Beco Diagonal só senta no almoço, às 13h15. Encham os flasks — qualquer balcão dá água gelada de graça — e sentem dez ' +
          'minutos antes de descer para a Minion Land.',
        areaParque: 'New York', acesso: [], duracaoMin: 10, pesquisa: '2026-09-12' },

      { id: 'b-1711-1125', hora: '11:25', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Despicable Me Minion Mayhem',
        descricao: 'A terceira maior fila do parque',
        contexto:
          'Simulador com telas, em que vocês viram Minions. É bobo de propósito e funciona ' +
          'muito bem — é dos poucos que arranca risada de todo mundo.\n\n' +
          'Ele faz 35 minutos de média, atrás só do Gringotts e do Mummy. Fica aqui porque a ' +
          'Minion Land é parada do dia por causa do Villain-Con, no bloco seguinte: são duas ' +
          'atrações na mesma área, sem caminhada ' +
          'entre elas.',
        areaParque: 'Minion Land', acesso: [], duracaoMin: 35,
        fila: { min: 25, quando: 'antes do almoço', pico: 75, media: 35, fonte: '2026-09-10' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'Abriu em 02/07/2012, num prédio que já teve o Funtastic World of ' +
                   'Hanna-Barbera (1990–2002) e o Jimmy Neutron (2003–2011). Em 2023 virou o ' +
                   'centro da Minion Land.',
            fonte: 'Wikipedia — Despicable Me Minion Mayhem', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1711-1200', hora: '12:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Villain-Con Minion Blast',
        descricao: 'Você atira, andando numa esteira. Sem fila de verdade',
        contexto:
          'Metade jogo de tiro, metade passeio: vocês ficam numa esteira rolante com uma arma ' +
          'de raio e vão pontuando pelos cenários. É o mais novo do parque nesta área e engole ' +
          'gente rápido, então a fila quase nunca acumula.',
        areaParque: 'Minion Land', acesso: [], duracaoMin: 30,
        pesquisa: '2026-09-10' },

      { id: 'b-1711-1240', hora: '12:40', ancora: 'referencia', tipo: 'livre',
        titulo: 'Beco Diagonal',
        descricao: 'Ollivanders, o dragão do Gringotts, decoração de Natal',
        contexto:
          'A land mais bem construída dos dois parques da Universal, e ela não parece com ' +
          'Hogsmeade: aqui é a Londres bruxa, entrando por uma parede de tijolos atrás da ' +
          'fachada da estação. O dragão em cima do Gringotts cospe fogo de tempos em tempos — ' +
          'dá para ouvir ele carregando antes.\n\n' +
          'OLLIVANDERS: a cerimônia da varinha, em que a varinha escolhe o bruxo. A daqui é a ' +
          'versão maior, com mais salas que a de Hogsmeade, sugerida no dia 14. É de ' +
          'graça assistir; a varinha custa à parte.\n\n' +
          'É AGORA E NÃO À NOITE que dá para ver as vitrines com calma — o Beco à noite, no ' +
          'fim do dia, é para a luz, não para as lojas.',
        areaParque: 'Diagon Alley', acesso: [], duracaoMin: 30,
        pesquisa: '2026-09-10' },

      { id: 'b-1711-1315', hora: '13:15', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Leaky Cauldron',
        descricao: 'Balcão. Mobile order pelo app da Universal',
        contexto:
          'Comida de pub inglês dentro do Beco: bangers and mash, fish and chips, shepherd’s ' +
          'pie. É consenso como o melhor quick service da Universal, e o salão é escuro e ' +
          'temático, com vigas e lareira.\n\n' +
          'MOBILE ORDER pelo app da Universal — a fila do balcão aqui é longa e a da retirada ' +
          'não existe. Peçam ainda andando pelo Beco, no bloco anterior.\n\n' +
          'É balcão: não leva gorjeta.',
        restauranteId: 'r-leaky', areaParque: 'Diagon Alley', acesso: [], duracaoMin: 55 },

      { id: 'b-1711-1415', hora: '14:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Men in Black: Alien Attack',
        descricao: 'Vocês atiram e disputam pontuação um com o outro',
        contexto:
          'Carrinho giratório por cenários de Nova York cheios de alienígenas, com uma arma ' +
          'por pessoa e placar no fim. Vale competir: o placar é individual e é metade da ' +
          'graça.\n\n' +
          'A tarde é a hora dele — 22 minutos de média — e ele fica no World Expo, que é o ' +
          'canto do parque que vocês só passam uma vez.\n\n' +
          'LOCKER OBRIGATÓRIO.',
        areaParque: 'World Expo', acesso: ['standby'], acessoAlt: 'single-rider', locker: true,
        duracaoMin: 40,
        fila: { min: 20, quando: 'à tarde', pico: 60, media: 22, fonte: '2026-09-10' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'Abriu em 14/04/2000, custou US$ 70 milhões e tem 35 finais diferentes, ' +
                   'conforme a pontuação. Will Smith e Rip Torn gravaram para a atração.',
            fonte: 'Wikipedia — Men in Black: Alien Attack', pesquisa: '2026-09-15' },
          { texto: 'O botão vermelho do confronto final vale 100 mil pontos para quem apertar ' +
                   'primeiro.',
            fonte: 'Wikipedia — Men in Black: Alien Attack', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1711-1500', hora: '15:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'The Simpsons Ride',
        descricao: 'Simulador, com a Springfield inteira em volta',
        contexto:
          'Simulador em tela gigante côncava, com a família Simpson num parque de diversões ' +
          'que dá errado. É rápido e sacode.\n\n' +
          'A área em volta é a Springfield inteira reconstruída — a estátua do Jebediah, o ' +
          'Kwik-E-Mart, a Duff. Vale andar cinco minutos por ela mesmo sem entrar em nada, e ' +
          'esses minutos estão dentro deste bloco.',
        areaParque: 'Springfield', acesso: [], duracaoMin: 40,
        fila: { min: 20, quando: 'à tarde', pico: 55, media: 22, fonte: '2026-09-10' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'Abriu em 15/05/2008, no prédio do Back to the Future: The Ride ' +
                   '(1991–2007). Matt Groening e James L. Brooks participaram, e o elenco ' +
                   'original gravou as vozes — só o Harry Shearer ficou de fora.',
            fonte: 'Wikipedia — The Simpsons Ride', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1711-1550', hora: '15:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'E.T. Adventure',
        descricao: 'Só existe aqui no mundo. Confiram se está operando',
        contexto:
          'Vocês voam de bicicleta sobre a cidade e depois pelo planeta do E.T., em cenários ' +
          'físicos construídos em 1990 — sem tela nenhuma. É o último passeio daquela geração ' +
          'ainda de pé em qualquer parque Universal do mundo, e no fim o E.T. fala o nome de ' +
          'cada um.\n\n' +
          'ELE VIROU MEIO-PERÍODO EM MAIO DE 2026 e pode não estar operando. Se estiver ' +
          'fechado, não esperem: os 35 minutos vão para o Beco Diagonal.\n\n' +
          'ELE FICA NA HOLLYWOOD, não na DreamWorks Land. Quando a KidZone virou DreamWorks em ' +
          '2024 puseram um arco separando os dois, e a entrada do E.T. ficou do lado de fora.',
        areaParque: 'Hollywood', acesso: [], duracaoMin: 35, opcional: true,
        fila: { min: 25, quando: 'no fim da tarde', pico: 70, media: 28, fonte: '2026-09-10' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'É o último E.T. Adventure do mundo: o de Hollywood fechou em 2003, e o do ' +
                   'Japão em 2009.',
            fonte: 'Wikipedia — E.T. Adventure', pesquisa: '2026-09-15' },
          { texto: 'Spielberg quis um passeio pessoal. O planeta verde e o Botanicus saem do ' +
                   'livro E.T.: The Book of the Green Planet.',
            fonte: 'Wikipedia — E.T. Adventure', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1711-1630', hora: '16:30', ancora: 'fixo', tipo: 'show',
        titulo: 'The Bourne Stuntacular',
        descricao: 'O melhor show de Orlando. Puramente visual',
        contexto:
          'Espetáculo de dublês ao vivo misturado com projeção numa tela de 40 metros, em que ' +
          'o ator sai de dentro da tela e continua a cena no palco sem corte visível. É ' +
          'perseguição, luta e queda de prédio, e é consenso como o melhor show de qualquer ' +
          'parque de Orlando.\n\n' +
          'É ação de ponta a ponta, e é por isso que ele é o show do dia: os outros shows do ' +
          'parque são infantis ou estão fechados.\n\n' +
          'Cheguem 15 minutos antes. Ele tem sessão marcada e não desloca com o resto do dia.',
        areaParque: 'Hollywood', acesso: [], duracaoMin: 50, confirmarHorario: true,
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'Estreou em 30/06/2020. A Julia Stiles, a Nicky Parsons dos filmes, gravou ' +
                   'as partes filmadas.',
            fonte: 'Wikipedia — The Bourne Stuntacular', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1711-1730', hora: '17:30', ancora: 'fixo', tipo: 'show',
        titulo: 'Universal’s Holiday Parade featuring Macy’s',
        descricao: 'HORA A CONFIRMAR — pode ser 17h30 ou 19h30',
        contexto:
          'Os balões gigantes do desfile de Ação de Graças da Macy’s de Nova York, os mesmos ' +
          'da TV, descendo a rua do parque — mais Minions, Madagascar e o Papai Noel no ' +
          'carro final. A temporada começou em 14/11 e vai até 03/01.\n\n' +
          'ESTE É O BLOCO MAIS INCERTO DO DIA. A hora aqui é proposta: em anos anteriores o ' +
          'desfile rodou tanto às 17h30 quanto às 19h30, e são duas horas de diferença. ' +
          'CONFIRAM NO APP DA UNIVERSAL e mexam daqui para a frente — este bloco, o jantar e o ' +
          'Beco à noite andam juntos.\n\n' +
          'Peguem lugar assim que o Bourne acabar, por volta das 17h20, na Hollywood, perto ' +
          'do Mel’s. É onde o desfile ' +
          'passa mais devagar e onde dá para sair rápido no fim.',
        areaParque: 'Hollywood', acesso: [], duracaoMin: 60, confirmarHorario: true, critico: true,
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'Desde 2002 a Universal traz balões e carros alegóricos do desfile da ' +
                   'Macy’s de Nova York. O carro do Papai Noel é o mesmo que desfila lá.',
            fonte: 'Wikipedia — Macy’s Thanksgiving Day Parade', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1711-1845', hora: '18:45', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Lombard’s Seafood Grille',
        descricao: 'Reservado. Frutos do mar na San Francisco',
        contexto:
          'O restaurante de mesa do parque, na San Francisco, a dois minutos do Beco ' +
          'Diagonal. Frutos do mar e carnes, com um aquário grande no meio do salão. Pratos ' +
          'principais de US$ 35 a 49, nos preços de 2025.\n\n' +
          'RESERVADO: 18h45, duas pessoas, confirmação 639247504692187392. Remarcar ou ' +
          'cancelar é pelo app da Universal ou pelo telefone de reservas nos Contatos.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta, e o preço da etiqueta não inclui o imposto.\n\n' +
          'ALTERNATIVA: o CityWalk fica fora da catraca e não fecha com o parque. Se o parque ' +
          'fechar às 19h, o jantar vai para lá — e aí o dia acaba no desfile.',
        restauranteId: 'r-lombards', areaParque: 'San Francisco', acesso: ['reserva'],
        duracaoMin: 70, pesquisa: '2026-09-11' },

      { id: 'b-1711-2000', hora: '20:00', ancora: 'fixo', tipo: 'livre',
        titulo: 'Beco Diagonal à noite',
        descricao: 'A land decorada no escuro. O dragão cospe fogo',
        contexto:
          'O fecho do dia, e ele é de graça. À noite o Beco muda completamente: as vitrines ' +
          'acendem, a Londres do lado de fora fica azul, e o dragão em cima do Gringotts cospe ' +
          'fogo de tempos em tempos — de perto o calor chega até a calçada.\n\n' +
          'Não é repetir atração: de manhã vocês vêm pelas lojas e pela varinha, e agora é só ' +
          'pela luz. Andem devagar, é a última coisa do dia.\n\n' +
          'Se o parque fechar às 19h, este bloco não existe — é o primeiro a cair.',
        areaParque: 'Diagon Alley', acesso: [], duracaoMin: 55,
        pesquisa: '2026-09-10' },

      { id: 'b-1711-2055', hora: '20:55', ancora: 'fixo', tipo: 'livre',
        titulo: 'CityWalk na saída',
        descricao: 'Fora da catraca, não fecha com o parque. Vinte e cinco minutos',
        contexto:
          'O CityWalk fica entre a catraca e o ponto de aplicativo, então ele não custa ' +
          'deslocamento nenhum: vocês passam por dentro dele de qualquer jeito.\n\n' +
          'Ele não fecha junto com o parque, e a essa hora as lojas e as fachadas estão ' +
          'acesas. É volta de reconhecimento, não programa: amanhã não tem parque, mas hoje ' +
          'já foram treze horas de pé.',
        localId: 'citywalk', acesso: [], duracaoMin: 25, pesquisa: '2026-09-16' },

      { id: 'b-1711-2120', hora: '21:20', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Uber do próprio CityWalk',
        contexto:
          'A tarifa dinâmica na porta do parque logo depois do fechamento é brutal, e por ' +
          'isso a volta sai do CityWalk: o transporte por app tem ponto próprio na área de ' +
          'estacionamento e ônibus, no extremo sul dele.\n\n' +
          'SE O CINESATIONAL RODAR HOJE — o show da lagoa, no fechamento —, a decisão já foi ' +
          'tomada na pendência de 01/11. Ficar para ele é sair com todo mundo.\n\n' +
          'Amanhã não tem parque e não tem alarme: o dia 18 começa às 9h.',
        acesso: [], duracaoMin: 45 },
    ],
    naoPerca: [
      { nome: 'A cerimônia da varinha no Ollivanders', quando: 'hoje', custo: 'grátis assistir',
        motivo: 'A varinha escolhe uma pessoa da plateia. A daqui é a versão maior, com mais ' +
                'salas que a de Hogsmeade — se for para ver uma, é esta.' },
      { nome: 'O dragão do Gringotts cuspindo fogo', quando: 'hoje', custo: 'grátis',
        motivo: 'A cada dez ou quinze minutos, e dá para ouvir ele carregando antes. De noite ' +
                'é bem melhor: o calor chega na calçada.' },
      { nome: 'Cerveja amanteigada no Beco', quando: 'hoje', custo: '~US$ 8',
        motivo: 'A mesma de Hogsmeade, mas aqui tem também a versão em sorvete no Florean ' +
                'Fortescue, que não existe do outro lado.' },
      { nome: 'Knockturn Alley', quando: 'hoje', custo: 'grátis',
        motivo: 'A viela escura que sai do Beco, sempre em penumbra e com trovão. Muita gente ' +
                'passa direto sem ver que ela existe — a entrada é discreta, à esquerda.' },
      { nome: 'Hogwarts Express', quando: 'dia 23', custo: 'incluso, precisa park-to-park',
        motivo: 'Ele liga este parque ao Islands e a viagem é diferente na ida e na volta. ' +
                'Fica para o dia 23, quando dá para fazer os dois sentidos no mesmo dia.' },
    ],
    prepararAmanha: {
      paraODia: '2026-11-18',
      titulo: 'Compras, Lake Eola e NBA · dia sem parque',
      aviso: 'Amanhã é o dia mais leve da segunda semana: começa às 9h, sem alarme de parque, ' +
             'e o único compromisso de relógio é o jogo às 19h.',
      itens: [
        { texto: 'Separar os quatro documentos da retirada do carro', critico: true,
          motivo: 'Carteira de motorista, PID, passaporte e cartão de CRÉDITO internacional, ' +
                  'todos em nome do condutor. A retirada é às 10h de amanhã, na Avis do Old ' +
                  'Town, e sem um deles não sai carro.' },
        { texto: 'Ingresso do jogo do Orlando Magic à mão nos dois celulares', critico: true,
          motivo: 'Jogo às 19h no Kia Center. Confiram o horário: a NBA remarca por TV, e ' +
                  'isso muda perto da data.' },
        { texto: 'Para a arena amanhã, só o bolso', critico: true,
          motivo: 'O Kia Center NÃO aceita bolsa: celular, cartão e documento no bolso. A mochila ' +
                  'e as sacolas do shopping ficam no hotel ' +
                  'na volta das 14h40 — ou vão para um armário Binbox na Church St.' },
        { texto: 'Pedido do Oakley pronto para retirada no app do Best Buy', critico: false,
          motivo: 'Amanhã às 14h15, depois do almoço no Millenia, vocês passam no Best Buy só ' +
                  'para retirar. Se o app não mostrar o pedido pronto, liguem para a loja, +1 ' +
                  '407-248-2439, antes de sair do mall.' },
        { texto: 'Guardar as compras de hoje e esvaziar a mochila', critico: false,
          motivo: 'Sair com a mochila cheia do dia anterior é começar errado.' },
        { texto: 'Conferir a abertura e o fechamento do Epic no dia 19, no app da Universal',
          critico: true,
          motivo: 'O dia 19 é o Epic Universe, com saída às 7h15. Amanhã à noite vocês voltam ' +
                  'do jogo às 22h15, e não é hora de descobrir horário de parque. O ' +
                  'fechamento importa tanto quanto a abertura: as duas maiores filas estão ' +
                  'coladas nele. Confiram HOJE.' },
      ],
    },
    ficha: {
      multiPass: null, singlePass: null,
      expressPass: {
        usar: false,
        motivo: 'Decisão fechada: sem Express Pass em nenhum dia da Universal. Aqui ele seria ' +
                'ainda menos justificável — o rope drop resolve a única fila que importa.',
        alternativa: 'Universal Express Now, comprado no app dentro do parque: US$ 20 a 25 por ' +
                     'pessoa e por atração, com a lista mudando ao longo do dia.',
      },
      custoEstimadoCasal: { min: 0, max: 0, moeda: 'USD' },
      extras: [
        { nome: 'Lockers obrigatórios',
          custo: { min: 0, max: 18, moeda: 'USD' },
          texto:
            'Três atrações de hoje exigem guardar tudo antes de embarcar: Gringotts, Revenge ' +
            'of the Mummy e Men in Black. Nenhuma tem detector de metal — ele só existe no ' +
            'Hulk, no VelociCoaster e no Stardust Racers.\n\n' +
            'O locker padrão é gratuito pelo tempo da fila mais a duração da atração; o grande ' +
            'é pago, de US$ 3 a 6 conforme a fonte. Cada uso come 10 a 15 minutos que a ' +
            'duração dos blocos não ' +
            'conta — e são três hoje. Levem o mínimo possível nos bolsos.' },
        { nome: 'Varinha do Ollivanders',
          custo: { min: 60, max: 75, moeda: 'USD' },
          texto:
            'Só se quiserem. A interativa aciona vitrines pelo Beco e por Hogsmeade; a comum ' +
            'é mais barata e não faz nada. Decisão de vocês na hora — não está no orçamento.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Race Through New York Starring Jimmy Fallon',
          motivo: 'Simulador em tela, 18 minutos de fila média. É o mais dispensável do que ' +
                  'sobrou no parque, e a piada depende de conhecer o programa.' },
        { nome: 'Kang & Kodos’ Twirl ’n’ Hurl',
          motivo: 'Carrossel de braços na Springfield. É brinquedo de parquinho.' },
        { nome: 'DreamWorks Land',
          motivo: 'Trolls Trollercoaster, Caterbus e as áreas de brincar são infantis. Vocês ' +
                  'passam por ela indo da Springfield para a Hollywood e é só isso.' },
        { nome: 'Animal Actors on Location',
          motivo: 'Show de truques com animais treinados, voltado a criança.' },
        { nome: 'DreamWorks Imagination Celebration',
          motivo: 'Show infantil com os personagens da DreamWorks Land.' },
      ],
      fechado: [
        'Universal Orlando’s Horror Make-Up Show — fechou em 12/05/2026 para ganhar uma ' +
        'versão nova, e a volta prevista passou para o inverno de 2027.',
        'Hollywood Rip Ride Rockit — fechou em 2025 para dar lugar ao Fast & Furious: ' +
        'Hollywood Drift. ATENÇÃO: o Hollywood Drift abre em 16/09/2026 na CALIFÓRNIA; a ' +
        'versão da Flórida só chega em 2027. Nada ocupa o lugar dele durante a viagem.',
        'Fast & Furious: Supercharged — fechou em 17/08/2026, último dia de operação em 16/08. ' +
        'Com ele foi embora a única atração da San Francisco, que virou área de passagem.',
        'Woody Woodpecker’s Nuthouse Coaster — fechou em 16/01/2023 junto com a Curious ' +
        'George e a Fievel’s Playland, quando a KidZone virou DreamWorks Land.',
        'Shrek 4-D — fechou em 2022. O prédio hoje é o Villain-Con Minion Blast.',
      ],
    },
  },

  /* ===== 18/11 · QUARTA · MILLENIA, LAKE EOLA E NBA ====================== */
  {
    id: 'd-2026-11-18',
    data: '2026-11-18',
    diaSemana: 'quarta',
    emoji: '🏀',
    titulo: 'Compras, Lake Eola e NBA',
    subtitulo: 'Orlando Magic × Philadelphia 76ers · e a véspera do Epic',
    tipo: 'livre',
    operadora: null,
    parqueId: null,
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-10',
    referencia: { rotulo: 'Início do jogo', padrao: '19:00', confirmado: false },
    resumo:
      'Dia de cidade, não de parque: shopping de manhã, o cartão-postal de Orlando no fim ' +
      'da tarde e basquete à noite. É também a véspera do Epic Universe — por isso a ' +
      'manhã é lenta de propósito.',
    avisos: [
      'O KIA CENTER NÃO ACEITA BOLSA: celular, cartão e documento no bolso. A única exceção ' +
      'da regra é uma clutch de 4,5" × 6,5" × 1", menor que a maioria das carteiras — não é ' +
      '"bolsa pequena", é quase nada. Quem chegar com sacola usa os armários Binbox, na Church St. ' +
      'com a Division Ave., por uma taxa.',
      'Amanhã é o Epic Universe e a saída é 7h15. Vocês voltam do jogo por volta das ' +
      '22h15. Deixem a mochila de amanhã pronta ANTES de sair hoje.',
    ],
    notas: [
      { tipo: 'info', texto:
        'JOGO CONFIRMADO: quarta-feira, 18/11/2026, 19h, Kia Center. Orlando Magic contra o ' +
        'Philadelphia 76ers, temporada regular, cerca de 2h30 com os intervalos.\n\n' +
        'A NBA remarca jogo por causa de transmissão, então isto continua na conferência da ' +
        'véspera — mas hoje está de pé, e é por isso que o início do jogo é a referência do ' +
        'dia: se ele mudar, a noite inteira desloca junto e o app avisa.',
        pesquisa: '2026-09-10' },

      { tipo: 'alerta', texto:
        'A REGRA DA BOLSA É O DETALHE QUE ESTRAGA A NOITE SE FOR IGNORADO. Bolsa nenhuma ' +
        'passa. A exceção é uma clutch de 11 × 16 × 2,5 cm, e bolsas médicas ou de bebê até ' +
        '35 × 35 × 15 cm, essas passando por raio-X.\n\n' +
        'É por isso que a volta ao hotel às 14h40 existe. Ela não é descanso: é a única ' +
        'janela do dia para largar as compras do Millenia. Sem ela vocês chegam na catraca ' +
        'com sacola e têm de pagar armário.\n\n' +
        'PLANO B: os armários Binbox ficam do lado de fora, perto do Tavern on Church, na ' +
        'esquina da Church St. com a Division Ave. Reserva-se um por uma taxa pequena. Se ' +
        'vocês comprarem pouco, o Binbox sai mais barato que a corrida de ida e volta ao ' +
        'hotel.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'A MACY’S DÁ 11% PARA VISITANTE ESTRANGEIRO. Apresentem o passaporte no balcão de ' +
        'atendimento ao cliente e peçam o Visitor Savings Pass — é a primeira parada do ' +
        'shopping, antes de comprar qualquer coisa, porque o desconto não se aplica depois ' +
        'da compra feita.\n\n' +
        'Não confundam com o cupom do outlet do dia 12: aquele é o Simon VIP Club, outro ' +
        'programa e outro lugar.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'O MILLENIA FICA A UNS 13 MINUTOS DO LAKE EOLA SEM TRÂNSITO — 11 km. O hotel é a 25 ' +
        'ou 30 minutos dos dois. Ou seja: a ida ao hotel no meio da tarde custa quase uma ' +
        'hora de carro e duas corridas, para terminar a treze minutos de onde vocês já estavam.\n\n' +
        'Ela continua no roteiro pelo motivo da bolsa, não por geografia. Se as compras ' +
        'couberem numa sacola, o plano B é melhor.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'O JANTAR TEM 65 MINUTOS NUMA STEAKHOUSE. É apertado e não adianta fingir que ' +
        'não é. O Kres fica na 17 W Church St, cinco minutos a pé da arena, e restaurante ' +
        'colado em ginásio sabe o que é noite de jogo: avisem na chegada que vocês têm hora.\n\n' +
        'Se atrasar, comam leve e completem lá dentro — a arena vende comida, cara, e o ' +
        'show de intervalo faz parte da noite de qualquer jeito.',
        pesquisa: '2026-09-10' },
    ],
    planos: [
      { letra: 'A', titulo: 'O dia como está escrito',
        gatilho: 'Vocês compraram o suficiente para valer a volta ao hotel.',
        passos: [
          'Macy’s primeiro, com passaporte, antes de qualquer compra.',
          'Millenia até as 13h, almoço lá mesmo e o Oakley no Best Buy às 14h15.',
          'Volta ao hotel só para largar sacola — e sair de novo às 16h.',
          'Barco-cisne às 16h30, enquanto ainda há sol.',
          'Pôr do sol na margem, jantar no Kres e cinco minutos a pé até a arena.',
        ] },
      { letra: 'B', titulo: 'Vocês compraram pouco',
        gatilho: 'Cabe tudo numa sacola só, ou vocês não compraram nada.',
        passos: [
          'O Best Buy continua às 14h15, e de lá PULEM A VOLTA AO HOTEL: do Millenia ao ' +
          'centro são uns 13 minutos sem trânsito.',
          'Ganham duas horas no Lake Eola: dá para andar a volta inteira de 1,4 km em torno ' +
          'do lago, e ainda tomar alguma coisa no Relax Grill.',
          'A sacola vai para um armário Binbox na Church St. antes de entrar na arena.',
          'O jantar deixa de ser apertado: dá para sentar às 17h30.',
        ] },
      { letra: 'B2', titulo: 'A NBA mudou o horário do jogo',
        gatilho: 'Vocês conferem e o jogo não é mais 19h.',
        passos: [
          'Mudem a referência do dia lá em cima. A noite inteira desloca junto.',
          'A manhã NÃO desloca: o shopping abre 11h e isso não muda.',
          'O pôr do sol também não desloca — ele é por volta das 17h30 e segue o sol.',
        ] },
      { letra: 'C', titulo: 'Chuva',
        gatilho: 'Chove à tarde, ou está ventando forte.',
        passos: [
          'Os barcos-cisne não saem com tempo ruim. Não insistam.',
          'O Orange County Regional History Center fica a dois quarteirões do Kres e cobra ' +
          'pouco. É a troca natural.',
          'O jantar sobe para as 17h e a noite fica mais folgada, não mais apertada.',
        ] },
    ],
    blocos: [
      { id: 'b-1811-0900', hora: '09:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Café no hotel',
        descricao: 'Sem alarme. Hoje é o dia mais leve da segunda semana',
        contexto:
          'A manhã é lenta de propósito. Ontem foi Universal Studios das 7h45 às 21h20, e ' +
          'amanhã é o Islands of Adventure com saída às 7h25. Este é o único respiro entre ' +
          'os dois, e é por isso que o carro é retirado hoje.',
        acesso: [], duracaoMin: 60 },

      { id: 'b-1811-1000', hora: '10:00', ancora: 'fixo', tipo: 'tarefa',
        titulo: 'Retirar o carro — Avis do Old Town',
        descricao: 'Suíte 434, nos fundos do Old Town. Três minutos do hotel',
        contexto:
          'A LOCADORA FICA DENTRO DO OLD TOWN, nos fundos, em frente à montanha-russa, na ' +
          'suíte 434. Abre das 7h às 19h todos os dias e fica a três minutos do hotel.\n\n' +
          'É A TAREFA CRÍTICA DE HOJE. A partir de amanhã o carro é o transporte de tudo: ' +
          'Islands, Epic, Winter Garden, SeaWorld e a estrada de Tampa.\n\n' +
          'NO BALCÃO, RECUSEM O E-TOLL UNLIMITED. O pacote cobra de US$ 11 a 26 por dia de ' +
          'aluguel, em todos os dias, com ou sem pedágio. Sem ele, a Avis cobra cada pedágio ' +
          'pela placa, mais uma taxa de US$ 6,95 só nos dias em que houve pedágio.\n\n' +
          'O aluguel é contado em períodos de 24 horas: retirado às 10h de hoje e devolvido ' +
          'às 15h do dia 25, são sete diárias. A tolerância na devolução é de 29 minutos.\n\n' +
          'HOJE À NOITE O CARRO FICA NO HOTEL: o jogo é no centro, e estacionar lá em noite ' +
          'de NBA custa caro e complica a saída. O centro é de Uber.',
        endereco: '5770 W Irlo Bronson Memorial Hwy, suíte 434', localId: 'old-town',
        acesso: [], critico: true, duracaoMin: 30, pesquisa: '2026-09-16' },

      { id: 'b-1811-1030', hora: '10:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair para o Mall at Millenia',
        descricao: '~25 min de carro. O estacionamento do shopping é grátis',
        localId: 'millenia', acesso: [], duracaoMin: 30 },

      { id: 'b-1811-1100', hora: '11:00', ancora: 'fixo', tipo: 'compras',
        titulo: 'The Mall at Millenia',
        descricao: 'Abre agora, às 11h. PRIMEIRA PARADA: balcão da Macy’s, com passaporte',
        contexto:
          'É o shopping de luxo de Orlando, coberto e climatizado — o oposto do outlet do dia ' +
          '12, que é a céu aberto e de preço baixo. Aqui é preço cheio, com marcas que não ' +
          'existem no Brasil ou custam muito mais: Apple, Macy’s, Bloomingdale’s, Zara, ' +
          'Michael Kors.\n\n' +
          'ANTES DE COMPRAR QUALQUER COISA: vão ao balcão de atendimento ao cliente da ' +
          'Macy’s com o passaporte e peçam o desconto de visitante estrangeiro. São 11%, e ' +
          'não dá para aplicar depois da compra feita.\n\n' +
          'HORÁRIO: segunda a sexta das 11h às 21h. Lojas de departamento e restaurantes ' +
          'podem abrir e fechar em horário próprio.\n\n' +
          'É a semana anterior à Black Friday, que este ano cai em 27/11 — várias lojas já ' +
          'começam as promoções agora.',
        endereco: '4200 Conroy Rd', localId: 'millenia', acesso: [], duracaoMin: 120,
        pesquisa: '2026-09-10' },

      { id: 'b-1811-1300', hora: '13:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Almoço no mall',
        descricao: 'The Cheesecake Factory fica na entrada principal. Sem reserva',
        contexto:
          'Porções absurdamente grandes — uma entrada dividida entre dois costuma bastar, e ' +
          'quase todo mundo sai com caixinha. Se quiserem o cheesecake, peçam para viagem: ' +
          'a fatia é enorme e não desce depois do prato.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta, e o preço da etiqueta não inclui o imposto.',
        localId: 'millenia', acesso: [], duracaoMin: 75 },

      { id: 'b-1811-1415', hora: '14:15', ancora: 'fixo', tipo: 'tarefa',
        titulo: 'Best Buy do Millenia — retirar o Oakley',
        descricao: 'Só a retirada do pedido feito no app. Menos de 1 km do mall',
        contexto:
          'O Oakley Meta Vanguard já foi comprado no app do Best Buy, com retirada nesta ' +
          'loja — está nas pendências. Aqui é só mostrar o pedido no balcão de retirada.\n\n' +
          'FICA A MENOS DE 1 KM DO MALL: uns 10 minutos a pé, ou 3 minutos de Uber se as ' +
          'sacolas pesarem. Na quarta abre das 10h às 21h. Telefone +1 407-248-2439.\n\n' +
          'O BEST BUY SEGURA O PEDIDO POR 5 DIAS e depois cancela. Se não houver óculos para ' +
          'retirar, o plano B do dia 25 assume.',
        endereco: '4155 Millenia Blvd', localId: 'best-buy', acesso: [], duracaoMin: 25,
        pesquisa: '2026-09-11' },

      { id: 'b-1811-1440', hora: '14:40', ancora: 'fixo', tipo: 'tarefa',
        titulo: 'Voltar ao hotel — deixar as compras',
        descricao: 'NÃO é descanso. É a única janela de largar sacola antes da arena',
        contexto:
          'Este bloco existe por causa da regra de bolsa do Kia Center, não por cansaço. A ' +
          'arena não aceita bolsa — sacola de shopping não entra ' +
          'de jeito nenhum.\n\n' +
          'Aproveitem para trocar de roupa e carregar o celular: a noite vai até 22h15 e a ' +
          'saída de amanhã é 7h15.\n\n' +
          'DEIXEM A MOCHILA DO EPIC PRONTA AGORA. Amanhã de manhã vocês não vão ter tempo, e ' +
          'hoje à noite vocês vão chegar mortos.\n\n' +
          'SE VOCÊS COMPRARAM POUCO, este bloco não precisa existir: vejam o plano B.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 80 },

      { id: 'b-1811-1600', hora: '16:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair para o centro',
        descricao: '~30 min do hotel. Uber US$ 32–45',
        localId: 'lake-eola', acesso: [], duracaoMin: 30 },

      { id: 'b-1811-1630', hora: '16:30', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Lake Eola — barco-cisne',
        descricao: 'US$ 15 por 30 min, para dois. Sem reserva, primeiro a chegar',
        contexto:
          'Pedalinho em forma de cisne no lago do centro de Orlando, com a fonte no meio e a ' +
          'silhueta dos prédios atrás. O cais fica no lado NORTE do lago, ao lado do Relax ' +
          'Grill.\n\n' +
          'Funcionam de terça a domingo, das 10h às 19h — hoje é quarta. Não aceitam reserva: ' +
          'é chegar e pegar. Com vento forte ou chuva eles não saem.\n\n' +
          'A HORA É ESTA E NÃO OUTRA. O pôr do sol é por volta das 17h30, então às 16h30 ' +
          'vocês pegam a luz baixa e ainda voltam a pé pela margem enquanto o sol cai.\n\n' +
          'Os cisnes de verdade também estão lá, e são de onde vem o nome do lago. Eles ' +
          'não são simpáticos — não cheguem perto.',
        localId: 'lake-eola', acesso: [], duracaoMin: 45,
        pesquisa: '2026-09-10' },

      { id: 'b-1811-1715', hora: '17:15', ancora: 'fixo', tipo: 'livre',
        titulo: 'Pôr do sol na margem',
        descricao: 'A volta do lago tem 1,4 km. O sol cai por volta das 17h30',
        contexto:
          'A calçada dá a volta completa no lago e leva uns vinte minutos andando devagar. É ' +
          'o cartão-postal do centro de Orlando e é de graça.\n\n' +
          'ESTE BLOCO NÃO DESLOCA COM O JOGO. Ele segue o sol: se a NBA mudar o horário, o ' +
          'pôr do sol continua às 17h30.\n\n' +
          'O show de luz e música da fonte é às 20h e às 21h30 — vocês vão estar no jogo nas ' +
          'duas. Fica registrado como coisa que não dá para fazer hoje, não como esquecimento.',
        localId: 'lake-eola', acesso: [], duracaoMin: 30,
        pesquisa: '2026-09-10' },

      { id: 'b-1811-1745', hora: '17:45', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Jantar — Kres Chophouse',
        descricao: '17 W Church St. Cinco minutos a pé da arena. Avisem que têm hora',
        contexto:
          'Steakhouse no centro histórico, na Church Street: carnes, frutos do ' +
          'mar e opções vegetarianas com toque mediterrâneo. Segunda a sexta serve das 11h30 ' +
          'às 23h30.\n\n' +
          'A LOCALIZAÇÃO É O QUE FAZ ELE GANHAR: do prato à catraca do Kia Center são cinco ' +
          'minutos a pé, e os armários Binbox ficam no caminho.\n\n' +
          'SÃO 65 MINUTOS E É POUCO PARA UMA STEAKHOUSE. Avisem na chegada que vocês têm ' +
          'jogo às 19h — restaurante colado em arena lida com isso toda semana. Se atrasar, ' +
          'comam leve e completem lá dentro.\n\n' +
          'RESERVA RECOMENDADA: é noite de jogo da NBA no centro, e o restaurante enche por ' +
          'causa disso. Está no checklist.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta sobre o valor sem imposto.',
        restauranteId: 'r-kres', endereco: '17 W Church St', localId: 'kia-center',
        acesso: ['reserva'], duracaoMin: 65, pesquisa: '2026-09-10' },

      { id: 'b-1811-1850', hora: '18:50', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Kia Center — portões',
        descricao: 'Cinco minutos a pé do Kres. Nada de bolsa: tudo no bolso',
        contexto:
          'Os portões abrem às 18h, uma hora antes do jogo, mas não há motivo para entrar ' +
          'cedo: o que existe lá dentro é loja e balcão de comida.\n\n' +
          'ÚLTIMA CONFERÊNCIA ANTES DA CATRACA: nada de bolsa. Celular, cartão e documento no ' +
          'bolso. Ingresso no celular dos dois, cada um ' +
          'com o seu.',
        localId: 'kia-center', acesso: [], duracaoMin: 10 },

      { id: 'b-1811-1900', hora: '19:00', ancora: 'referencia', tipo: 'show',
        titulo: 'Orlando Magic × Philadelphia 76ers',
        descricao: 'Temporada regular da NBA. ~2h30 com os intervalos',
        contexto:
          'Jogo de temporada regular no ginásio do Magic. Cerca de duas horas e meia com os ' +
          'dois intervalos, e o show de intervalo é parte da experiência — sorteio, câmera na ' +
          'plateia, arremesso do meio da quadra.\n\n' +
          'A comida e a bebida lá dentro são caras, e é normal que sejam. Se vocês jantaram ' +
          'leve no Kres, é aqui que completa.\n\n' +
          'CONFIRMEM O HORÁRIO PERTO DA DATA: a NBA remarca jogo por transmissão de TV, e é ' +
          'isso que faz este bloco ser a referência do dia.',
        localId: 'kia-center', acesso: [], confirmarHorario: true, critico: true,
        duracaoMin: 150, pesquisa: '2026-09-10' },

      { id: 'b-1811-2130', hora: '21:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Saída',
        descricao: 'Andem dois quarteirões antes de chamar o Uber',
        contexto:
          'A tarifa dinâmica em volta da arena logo depois do apito final pode triplicar. ' +
          'Dois quarteirões a pé costumam resolver, e a Church Street tem calçada larga e ' +
          'movimento — não é caminhada desconfortável.\n\n' +
          'AMANHÃ É EPIC UNIVERSE: saída às 7h15. Vocês chegam por volta das 22h15, e o ' +
          'alarme é 6h15. Durmam assim que chegarem.',
        acesso: [], duracaoMin: 45 },
    ],
    naoPerca: [
      { nome: 'Barco-cisne ao pôr do sol', quando: 'hoje', custo: 'US$ 15 por 30 min, para dois',
        motivo: 'Pedalinho de cisne no lago do centro, com a fonte no meio e os prédios ' +
                'atrás. Cais no lado norte, ao lado do Relax Grill. Terça a domingo, 10h às ' +
                '19h, sem reserva.',
        pesquisa: '2026-09-10' },
      { nome: 'Desconto de visitante estrangeiro da Macy’s', quando: 'hoje', custo: 'grátis',
        motivo: '11% mediante passaporte, no balcão de atendimento ao cliente. Tem de ser ' +
                'ANTES de comprar — não se aplica depois.',
        pesquisa: '2026-09-10' },
      { nome: 'Os cisnes de verdade', quando: 'hoje', custo: 'grátis',
        motivo: 'O lago tem cisnes vivos e é de onde vem o nome dos pedalinhos. São grandes ' +
                'e territoriais: olhem de longe.' },
      { nome: 'Show de luz e música da fonte', quando: 'descartado', custo: 'grátis',
        motivo: 'É às 20h e às 21h30, e vocês estarão dentro do Kia Center nas duas. Não é ' +
                'esquecimento: é incompatível com o jogo, e o jogo já está pago.' },
    ],
    prepararAmanha: {
      paraODia: '2026-11-19',
      titulo: 'Islands of Adventure · saída 7h25',
      aviso: 'Vocês chegam do jogo por volta das 22h15, e amanhã é o dia com mais detector ' +
             'de metal da viagem. A mochila sai mínima — e o carro já é de vocês desde hoje.',
      itens: [
        { texto: 'Alarme para 6h25 nos dois celulares', critico: true,
          motivo: 'Saída 7h25 para estar na frente da corda do Hagrid’s às 8h15. Depois de uma noite que termina às ' +
                  '22h15, um alarme só falha.' },
        { texto: 'Mochila mínima para o Islands', critico: true,
          motivo: 'Hulk e VelociCoaster têm detector de metal e não passa nem celular, e quatro ' +
                  'atrações exigem locker. Quanto menos bagagem, mais atração cabe no dia.' },
        { texto: 'Conferir o horário de abertura do Islands', critico: true,
          motivo: 'Amanhã assume abertura às 9h. Se for outro horário, a manhã inteira desloca.' },
        { texto: 'Capa de chuva e Ziploc para o celular', critico: false,
          motivo: 'O Jurassic Park River Adventure molha bastante.' },
      ],
    },
    ficha: {
      multiPass: null, singlePass: null, expressPass: null,
      custoEstimadoCasal: { min: 15, max: 15, moeda: 'USD' },
      extras: [
        { nome: 'Barco-cisne no Lake Eola',
          custo: { min: 15, max: 15, moeda: 'USD' },
          texto: 'US$ 15 por 30 minutos, e o barco leva os dois. Terça a domingo, 10h às 19h. ' +
                 'Sem reserva: é chegar no cais do lado norte e pegar.' },
        { nome: 'Armário Binbox, se precisarem',
          custo: { min: 5, max: 15, moeda: 'USD' },
          texto: 'Do lado de fora da arena, perto do Tavern on Church, na esquina da Church ' +
                 'St. com a Division Ave. Só faz sentido no plano B, quando vocês pulam a ' +
                 'volta ao hotel e chegam com sacola.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Show de luz e música da fonte do Lake Eola',
          motivo: 'É às 20h e 21h30, e vocês estarão no jogo. Incompatível, não esquecido.' },
        { nome: 'Orange County Regional History Center',
          motivo: 'Fica a dois quarteirões do Kres e é o plano C de chuva. Em dia de sol o ' +
                  'lago ganha.' },
      ],
      fechado: [
        'Ace Cafe Orlando — fechou em maio de 2023, depois de seis anos, e o terreno foi ' +
        'vendido para virar um prédio alto.',
      ],
    },
  },

  /* ===== 19/11 · QUINTA · ISLANDS OF ADVENTURE ========================= */
  {
    id: 'd-2026-11-19',
    data: '2026-11-19',
    diaSemana: 'quinta',
    emoji: '⚡',
    titulo: 'Islands of Adventure',
    subtitulo: 'O dia mais forte em montanha-russa da viagem',
    tipo: 'parque',
    operadora: 'universal',
    parqueId: 'islands-of-adventure',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-11',
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },
    resumo:
      'Hagrid’s na abertura, que é a única janela abaixo de uma hora, e depois uma volta ' +
      'inteira no anel do parque sem voltar atrás: Marvel, Kong, Jurassic Park e a ' +
      'VelociCoaster na fila normal. À noite, Hogwarts Express, o castelo iluminado e o ' +
      'jantar no Mythos, provavelmente no último Natal dele.',
    avisos: [
      'O HAGRID’S NÃO ACEITA EXPRESS DESDE 1º DE JULHO DE 2026, e a janela barata dele é a ' +
      'abertura. Na corda às 8h15 e direto para Hogsmeade quando ela soltar.',
      'Hoje é o dia com mais detector de metal da viagem: Hulk e VelociCoaster, onde não ' +
      'passa nem celular. E quatro atrações exigem locker. Levem o mínimo.',
    ],
    notas: [
      { tipo: 'atencao', texto:
        'O HORÁRIO DE 19/11 AINDA NÃO SAIU. A referência está em 9h, que é a abertura padrão ' +
        'do Islands; o fechamento na semana de Thanksgiving tende a ficar entre 20h e 21h. A ' +
        'projeção no castelo e o Mythos estão fixos de propósito. Se o parque fechar às 20h, ' +
        'vale o plano B2.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'POR QUE O HAGRID’S VEM PRIMEIRO, mesmo sem a entrada antecipada de hotel: nos dados ' +
        'de março e abril de 2026, a fila média na abertura foi de 30 a 65 minutos. Às 10h já ' +
        'passava de 65, ao meio-dia chegava a 120, às 13h a 154, e não voltou para baixo de ' +
        '100 nem na última hora.\n\n' +
        'A VELOCICOASTER NÃO TEM HORA BOA, e não tem mais single rider: de 67 a 102 minutos ' +
        'da abertura até a noite, e a Universal fechou a fila de single rider dela. Por isso ' +
        'ela fica à tarde, com um bloco de uma hora e meia, e o Doctor Doom saiu do dia para ' +
        'caber.',
        pesquisa: '2026-09-15' },

      { tipo: 'info', texto:
        'O QUE MUDOU NO PARQUE EM 2026:\n\n' +
        'O Jurassic Park River Adventure passou dez meses em reforma e reabre em 19 ou 20/11. ' +
        'Se atrasar, vale o plano B.\n\n' +
        'A Lost Continent está sendo demolida em fases. O prédio do Poseidon’s Fury já foi ao ' +
        'chão. O Mythos continua aberto e, pela Universal, fecha em 2027, ainda sem data.\n\n' +
        'O Thunder Falls Terrace, no Jurassic Park, fechou em julho e vira o novo restaurante ' +
        'com mesa do parque em 2027.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'DE CARRO: estacionamento US$ 35 na hora ou US$ 32 pago antes pelo site. Do carro até ' +
        'o portão são uns 20 minutos a pé, pelo CityWalk — está dentro do bloco de saída. De ' +
        'Uber seriam US$ 56 a 80 ida e volta.',
        pesquisa: '2026-09-11' },
    ],
    planos: [
      { letra: 'A', titulo: 'O dia como está escrito',
        gatilho: 'O parque abre às 9h e o Jurassic Park River Adventure já reabriu.',
        passos: [
          'Na corda às 8h15, Hagrid’s na abertura e Forbidden Journey logo depois.',
          'Almoço no Confisco Grille às 11h40, na entrada do parque.',
          'Marvel, Kong, Jurassic Park River Adventure e VelociCoaster na fila normal.',
          'Hogwarts Express ida e volta, projeção no castelo e jantar no Mythos às 19h15.',
        ] },
      { letra: 'B', titulo: 'O Jurassic Park River Adventure não reabriu',
        gatilho: 'A reforma atrasou e ele continua fechado em 19/11.',
        passos: [
          'Os 40 minutos dele devolvem o Doctor Doom: ele entra às 14h15, logo depois do ' +
          'Spider-Man, a parada vai para 14h35 e o Kong para 14h55.',
          'A VelociCoaster vai às 15h40, e os 25 minutos que sobram antes do Hogwarts Express ' +
          'são folga. A capa de chuva fica na mochila.',
        ] },
      { letra: 'B2', titulo: 'O parque fecha às 20h',
        gatilho: 'O horário oficial sai com fechamento às 20h.',
        passos: [
          'Remarquem o Mythos, reservado para 19h15, para 18h35 — pelo app da Universal ou ' +
          'pelo +1 407-224-3663.',
          'O Kong sai, e a tarde sobe 40 minutos: River Adventure às 14h35, VelociCoaster às ' +
          '15h20 e Hogwarts Express às 16h55.',
          'A projeção no castelo vai para 18h05, se já tiver escurecido. Senão, fica para ' +
          'depois do jantar: ela repete a cada 20 minutos até o parque fechar.',
        ] },
      { letra: 'C', titulo: 'Cansaço ou atraso',
        gatilho: 'O Hagrid’s demorou mais que o previsto ou o corpo pediu pausa.',
        passos: [
          'O Kong cai primeiro.',
          'O Hogwarts Express e o Mythos ficam: são a noite do dia.',
        ] },
    ],
    blocos: [
      { id: 'b-1911-0725', hora: '07:25', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel de carro',
        descricao: '33 min de estrada e uns 20 a pé. Estacionamento US$ 32 pago antes',
        contexto:
          'O estacionamento da Universal fica longe da catraca: do carro até o CityWalk, e do ' +
          'CityWalk até o portão do Islands, são uns 20 minutos a pé. Pago antes pelo site ' +
          'custa US$ 32; na hora, US$ 35.',
        localId: 'islands-of-adventure', acesso: [], duracaoMin: 50, pesquisa: '2026-09-11' },

      { id: 'b-1911-0815', hora: '08:15', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão',
        descricao: 'Pela esquerda, sentido Hogsmeade. Sem parar em nada',
        contexto:
          'A CATRACA ABRE ANTES DAS 9H PARA TODO MUNDO: uma hora antes quando o Islands é o ' +
          'parque da entrada antecipada de hotel do dia, e 15 a 30 minutos antes nos outros. ' +
          'Quem é de fora anda pelo Port of Entry e é segurado na entrada da Seuss Landing até ' +
          'poucos minutos antes da abertura. Chegando às 8h15 vocês esperam na frente dessa ' +
          'corda, e quem sai na frente dela chega primeiro ao Hagrid’s. Se a catraca ainda ' +
          'estiver fechada, a espera é na fila dela.\n\n' +
          'Quando a corda soltar, sigam pela esquerda: Seuss Landing, Lost Continent e ' +
          'Hogsmeade, uns 12 minutos a pé. Pela direita, pela Marvel, é mais longe.\n\n' +
          'Quem está hospedado na Universal entra uma hora antes, e o Hagrid’s costuma estar ' +
          'nessa lista. Mesmo assim, a abertura é a hora mais barata dele para vocês.\n\n' +
          'PONTO DE ENCONTRO DE HOJE: o mesmo do dia 14, o farol do Port of Entry, na beira da ' +
          'lagoa. É também a foto da manhã, no caminho da corda. Se vocês se perderem, vão ' +
          'para lá e ESPEREM.',
        localId: 'islands-of-adventure', acesso: [], duracaoMin: 45, pesquisa: '2026-09-12' },

      { id: 'b-1911-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Hagrid’s Magical Creatures Motorbike Adventure',
        descricao: 'Rope drop, sem exceção. Na abertura, 30 a 65 min; depois, mais de 2h',
        contexto:
          'Montanha-russa de lançamento em motos com sidecar, com sete lançamentos, uma queda ' +
          'vertical e um trecho de ré. Sem inversões. É considerada a melhor montanha-russa de ' +
          'Orlando.\n\n' +
          'POR QUE AGORA: nos dados de 2026, 30 a 65 minutos na abertura, 120 ao meio-dia, 154 ' +
          'às 13h e acima de 100 até fechar. E ela saiu do Express em 1º de julho: não existe ' +
          'atalho pago.\n\n' +
          'SINGLE RIDER: as fontes divergem sobre a fila de single rider daqui continuar ' +
          'existindo. Não contem com ela; se aparecer a placa, é bônus.',
        areaParque: 'Hogsmeade', acesso: ['rope-drop', 'standby'],
        locker: 'obrigatorio',
        lockerNota: 'Pochete de 3 pontos na cintura costuma ser liberada, a critério do funcionário.',
        duracaoMin: 90, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu em 13/06/2019, no lugar do Dragon Challenge, e custou cerca de US$ ' +
                   '300 milhões. Os sete lançamentos eram recorde mundial na inauguração, e na ' +
                   'queda livre o trilho se solta e desce 5 metros junto com o trem.',
            fonte: 'Wikipedia — Hagrid’s Magical Creatures Motorbike Adventure', pesquisa: '2026-09-15' },
          { texto: 'Foi a última vez que o Robbie Coltrane interpretou o Hagrid. Por causa da ' +
                   'saúde, ele gravou só o rosto e a cabeça, e morreu em 2022.',
            fonte: 'Wikipedia — Hagrid’s Magical Creatures Motorbike Adventure', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1911-1030', hora: '10:30', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Harry Potter and the Forbidden Journey',
        descricao: 'Dentro do castelo de Hogwarts, colado no Hagrid’s',
        contexto:
          'Braço robótico que carrega vocês por cenários físicos e telas, com voo sobre ' +
          'Hogwarts. Balança bastante e causa enjoo em parte das pessoas. A fila atravessa o ' +
          'castelo por dentro — retratos falantes, sala do Dumbledore — e vale a caminhada.\n\n' +
          'Fila média de 32 minutos. A próxima reforma dele é só em fevereiro de 2027.',
        areaParque: 'Hogsmeade', acesso: ['standby'],
        acessoAlt: 'single-rider', locker: 'obrigatorio',
        acessoAltNota: 'Na primeira visita, não: single rider pula o castelo, e a fila é metade da atração.',
        duracaoMin: 55, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu com Hogsmeade, em 2010. Daniel Radcliffe, Rupert Grint, Emma Watson ' +
                   'e Michael Gambon gravaram cenas para a atração, e o braço robótico é da ' +
                   'KUKA — o mesmo tipo usado depois no Monsters Unchained, do Epic.',
            fonte: 'Wikipedia — Harry Potter and the Forbidden Journey; Wikipedia — Monsters Unchained', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1911-1140', hora: '11:40', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Confisco Grille',
        descricao: 'Mesa com garçom na entrada do parque. Pratos de US$ 21 a 35',
        contexto:
          'O restaurante com mesa da Port of Entry: cozinha internacional, de pad thai e ' +
          'salmão com missô a churrasco de Angus e massas. Pratos de US$ 21 a 35.\n\n' +
          'POR QUE AQUI: fica exatamente no caminho de Hogsmeade para a Marvel, e é mesa, não ' +
          'balcão. No Three Broomsticks vocês já jantam no dia 14.\n\n' +
          'São 12 minutos a pé do Forbidden Journey, passando pela Lost Continent e pela Seuss ' +
          'Landing. É mesa com garçom: 18 a 20% de gorjeta sobre o valor sem imposto.',
        restauranteId: 'r-confisco', areaParque: 'Port of Entry', acesso: [], duracaoMin: 60,
        pesquisa: '2026-09-11' },

      { id: 'b-1911-1245', hora: '12:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'The Incredible Hulk Coaster',
        descricao: 'Lançamento de 0 a 64 km/h em 2 segundos, sete inversões',
        contexto:
          'Lançamento dentro de um túnel, sete inversões e muito barulho. Clássica de 1999, ' +
          'reconstruída em 2016.\n\n' +
          'DETECTOR DE METAL: nada nos bolsos, nem celular. Fila média de 32 minutos.',
        areaParque: 'Marvel Super Hero Island', acesso: ['standby'],
        acessoAlt: 'single-rider', locker: 'detector', duracaoMin: 45, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu com o parque, em 1999, e foi reconstruída em 2016, com trilho e ' +
                   'trens novos e som a bordo. Chega a 108 km/h, com sete inversões.',
            fonte: 'Wikipedia — The Incredible Hulk Coaster', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1911-1335', hora: '13:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'The Amazing Adventures of Spider-Man',
        descricao: 'Clássico. Ainda é referência técnica',
        contexto:
          'Veículo em movimento que combina cenário físico, telas 3D e uma simulação de queda ' +
          'livre de 120 metros que parece real. É de 1999 e continua sendo estudada como ' +
          'referência de dark ride.\n\n' +
          'Fila média de 29 minutos.',
        areaParque: 'Marvel Super Hero Island', acesso: ['standby'],
        acessoAlt: 'single-rider',
        acessoAltNota: 'Entrada do single rider pela esquerda, no corredor que liga a saída à loja.',
        duracaoMin: 35, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Ganhou o Golden Ticket de melhor dark ride por 12 anos seguidos, de 1999 a ' +
                   '2010. O Stan Lee aparece no clímax e é a voz dos avisos.',
            fonte: 'Wikipedia — The Amazing Adventures of Spider-Man', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1911-1435', hora: '14:15', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Dez minutos. Banheiro ao lado do Captain America Diner',
        contexto:
          'Do almoço até o Mythos são sete horas, e só o Hogwarts Express senta. Esta é a parada do meio: água, banheiro e dez minutos sentados antes do Kong.',
        areaParque: 'Marvel Super Hero Island', acesso: [], duracaoMin: 10, pesquisa: '2026-09-12' },

      { id: 'b-1911-1455', hora: '14:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Skull Island: Reign of Kong',
        descricao: 'Caminhão expedicionário, telas 3D e o Kong animatrônico',
        contexto:
          'Caminhão expedicionário com telas 3D e um animatrônico enorme do Kong no fim. Tem ' +
          'atores na fila. Escuro e barulhento, mas sem emoção física forte.\n\n' +
          'Fila média de 35 minutos.',
        areaParque: 'Skull Island', acesso: ['standby'],
        acessoAlt: 'single-rider', duracaoMin: 40, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu em 13/07/2016, com consultoria do Peter Jackson, o diretor do King ' +
                   'Kong de 2005. O templo da entrada tem 24 metros.',
            fonte: 'Wikipedia — Skull Island: Reign of Kong', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1911-1540', hora: '15:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Jurassic Park River Adventure',
        descricao: 'Molha. Reaberto depois de dez meses de reforma',
        contexto:
          'Passeio de barco que vira ataque de dinossauros e termina numa queda de 26 metros ' +
          'no escuro. Molha de verdade, principalmente nas primeiras fileiras.\n\n' +
          'REFORMA: ficou fechado de janeiro a 19 ou 20/11 de 2026, com dinossauros e cenário ' +
          'sendo refeitos. Se ainda estiver fechado, vale o plano B.\n\n' +
          'Está às 15h20 porque é a hora mais quente. Capa de chuva e o celular no Ziploc — ou ' +
          'no armário de aluguel da entrada, que aqui é opcional, pelo mapa oficial. Fila média ' +
          'de 22 minutos.',
        areaParque: 'Jurassic Park', acesso: ['standby'],
        acessoAlt: 'single-rider', molha: true, duracaoMin: 40, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu com o parque, em 1999. A queda final tem 26 metros, a 55 graus.',
            fonte: 'Wikipedia — Jurassic Park: The Ride', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1911-1625', hora: '16:05', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Jurassic World VelociCoaster',
        descricao: 'A mais intensa do parque. Fila normal: uma hora e meia de bloco',
        contexto:
          'Dois lançamentos, 47 metros de altura, 110 km/h, quatro inversões e um trecho ' +
          'rasante sobre a água. É consenso como uma das melhores montanhas-russas do mundo.\n\n' +
          'SEM SINGLE RIDER: a Universal fechou a fila de single rider daqui e passou a ' +
          'embarcar os grupos em duas filas, de número par e ímpar de pessoas, para não sobrar ' +
          'lugar vazio. Vocês vão pela fila normal, juntos.\n\n' +
          'POR QUE ÀS 16H05: ela não tem hora barata. Nos dados de 2026, 85 minutos às 10h, 102 ' +
          'às 11h, 76 às 14h, 83 às 16h e 72 às 18h. Entre a melhor e a pior hora da tarde são ' +
          'dez minutos, e as horas da noite já são do Hogwarts Express e do Mythos. O bloco tem ' +
          'uma hora e meia: fila, locker e detector.\n\n' +
          'DETECTOR DE METAL: absolutamente nada nos bolsos.',
        areaParque: 'Jurassic Park', acesso: ['standby'],
        locker: 'detector', duracaoMin: 90, pesquisa: '2026-09-15',
        curiosidades: [
          { texto: 'Abriu em 10/06/2021, no terreno do antigo Triceratops Encounter, e ganhou ' +
                   'o Golden Ticket de melhor montanha-russa nova. O segundo lançamento vai de ' +
                   '64 a 113 km/h em 2,4 segundos.',
            fonte: 'Wikipedia — Jurassic World VelociCoaster', pesquisa: '2026-09-15' },
          { texto: 'O Chris Pratt e a Bryce Dallas Howard gravaram os vídeos da fila, e o giro ' +
                   'de cabeça para baixo sobre a lagoa se chama Mosasaurus Roll.',
            fonte: 'Wikipedia — Jurassic World VelociCoaster', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1911-1720', hora: '17:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Hogwarts Express — ida e volta',
        descricao: 'Quatro minutos em cada sentido, com filmes diferentes. Precisa park-to-park',
        contexto:
          'Trem de verdade entre os dois parques, com as janelas virando tela e sombras no ' +
          'corredor da cabine. A ida e a volta mostram filmes diferentes — por isso os dois ' +
          'sentidos.\n\n' +
          'Na chegada a King’s Cross, no Universal Studios, sigam direto para a entrada da ' +
          'estação e peguem o trem de volta. O Beco Diagonal vocês já fizeram inteiro no dia 17.\n\n' +
          'Só funciona com ingresso park-to-park, que está na conferência dos ingressos. Fila ' +
          'média de 22 minutos na estação de Hogsmeade.',
        areaParque: 'Hogsmeade', acesso: ['standby'], duracaoMin: 70, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Na estação de King’s Cross, do lado do Universal Studios, dá para ' +
                   '“atravessar” a parede entre as plataformas 9 e 10, como no primeiro filme.',
            fonte: 'Wikipedia — The Wizarding World of Harry Potter (Universal Orlando Resort)', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1911-1835', hora: '18:50', ancora: 'fixo', tipo: 'show',
        titulo: 'Hogsmeade à noite · projeção no castelo',
        descricao: 'The Magic of Christmas at Hogwarts Castle. Repete a cada 20 min',
        contexto:
          'Projeções e efeitos no castelo de Hogwarts com cenas de Natal dos filmes, depois ' +
          'que escurece. Repete a cada vinte minutos até o parque fechar — não precisa pegar ' +
          'na hora exata.\n\n' +
          'É a segunda vez da projeção: a primeira foi no dia 14, na noite de estreia da ' +
          'temporada, num sábado. Hoje o bloco é de quinze minutos, colado no Hogwarts ' +
          'Express, que termina aqui mesmo: vejam a sessão que estiver rodando e sigam para o ' +
          'Mythos, que fica ao lado, na Lost Continent.',
        areaParque: 'Hogsmeade', acesso: [], duracaoMin: 15, pesquisa: '2026-09-15' },

      { id: 'b-1911-1915', hora: '19:15', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Mythos',
        descricao: 'O melhor restaurante de parque temático, provavelmente no último Natal dele',
        contexto:
          'Mesa com garçom dentro de uma caverna cenográfica, com vista para a lagoa. Ganhou ' +
          'dez vezes o prêmio de melhor restaurante de parque temático do Theme Park Insider. ' +
          'Pratos de US$ 26 a 42.\n\n' +
          'PROVAVELMENTE É O ÚLTIMO NATAL DELE: a Lost Continent está sendo demolida em fases, ' +
          'e a Universal diz que o Mythos fecha em 2027, ainda sem data.\n\n' +
          'RESERVADO: 19h15, duas pessoas, confirmação 639251823318530048. Cheguem às 19h10 — ' +
          'a mesa é segurada por 15 minutos depois do horário. É mesa com garçom: 18 a 20% de ' +
          'gorjeta sobre o valor sem imposto.',
        restauranteId: 'r-mythos', areaParque: 'Lost Continent', acesso: ['reserva'],
        duracaoMin: 75, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'O Mythos venceu o prêmio do Theme Park Insider de 2003 a 2008 e de novo de ' +
                   '2019 a 2022, e com a décima vitória foi o primeiro a entrar no Hall da ' +
                   'Fama do prêmio.',
            fonte: 'Theme Park Insider', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-1911-2030', hora: '20:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Saída',
        descricao: 'Uns 20 min a pé até o carro. Hotel por volta das 21h30',
        contexto:
          'A volta até o estacionamento é o mesmo caminho da manhã, pelo CityWalk.\n\n' +
          'AMANHÃ É BUSCH GARDENS, EM TAMPA: estrada às 7h30, alarme às 6h30. Deixem a mochila ' +
          'pronta antes de dormir.',
        acesso: [], duracaoMin: 60 },
    ],
    naoPerca: [
      { nome: 'A projeção no castelo de Hogwarts', quando: 'hoje', custo: 'incluso',
        motivo: 'The Magic of Christmas at Hogwarts Castle, depois que escurece, repetindo a ' +
                'cada 20 minutos.',
        pesquisa: '2026-09-11' },
      { nome: 'Raptor Encounter', quando: 'hoje', custo: 'incluso',
        motivo: 'Um velociraptor animatrônico com tratador, no Jurassic Park, em sessões curtas ' +
                'ao longo do dia. Cabe entre o Kong e o River Adventure, sem bloco — está no ' +
                'mapa oficial.',
        pesquisa: '2026-09-12' },
      { nome: 'Frog Choir e Triwizard Spirit Rally', quando: 'hoje', custo: 'incluso',
        motivo: 'Shows de rua na Hogsmeade, de uns dez minutos, várias vezes ao dia. Se um ' +
                'estiver começando quando vocês passarem, parem.',
        pesquisa: '2026-09-12' },
      { nome: 'Hogwarts Express nos dois sentidos', quando: 'hoje',
        custo: 'incluso, precisa park-to-park',
        motivo: 'A ida e a volta têm filmes diferentes.',
        pesquisa: '2026-09-11' },
      { nome: 'Mythos', quando: 'hoje', custo: 'US$ 26 a 42 o prato',
        motivo: 'Dez vezes eleito o melhor restaurante de parque temático. A Universal diz que ' +
                'ele fecha em 2027.',
        pesquisa: '2026-09-11' },
    ],
    prepararAmanha: {
      paraODia: '2026-11-20',
      titulo: 'Epic Universe · saída 7h15, rope drop na Dark Universe',
      aviso: 'Saída às 7h15 e hoje o Islands termina por volta das 21h30. O Epic é o dia ' +
             'mais longo da segunda semana: portão às 7h50 e saída às 21h.',
      itens: [
        { texto: 'Mochila do Epic montada hoje', critico: true,
          motivo: 'Vocês voltam do Islands perto das 21h30 e saem às 7h15. Deixem pronta antes ' +
                  'de dormir: os dois soft flasks, barrinhas, protetor solar, power bank, cabo ' +
                  'e capa de chuva.' },
        { texto: 'Alarme para 6h15 nos dois celulares', critico: true,
          motivo: 'Saída 7h15. Depois de um dia que termina 21h30, um alarme só falha.' },
        { texto: 'Conferir o horário de abertura do Epic Universe e ajustar a referência',
          critico: true,
          motivo: 'Amanhã assume abertura às 9h e entrada às 7h50, quando o Celestial Park ' +
                  'abre para todos. Se for outro horário, mudem ' +
                  'a referência e a manhã inteira desloca junto.' },
        { texto: 'Conferir a lista do Early Park Admission de amanhã no app da Universal',
          critico: true,
          motivo: 'O dia assume que a Dark Universe NÃO está no EPA, e por isso começa nela. ' +
                  'Se ela estiver na lista e o Ministry não, vale o plano B: os dois blocos ' +
                  'trocam de lugar. É a pendência ck-epa-epic.' },
        { texto: 'Guardar o que veio do Islands', critico: false,
          motivo: 'Amanhã a mochila precisa sair leve — o Epic tem locker obrigatório em ' +
                  'três atrações, e detector de metal no Stardust Racers.' },
        { texto: 'Confirmação do Atlantic à mão: 639251824607987840', critico: false,
          motivo: 'Jantar às 17h de amanhã. A mesa é segurada só por 15 minutos, então o número ' +
                  'fica no celular, não perdido no e-mail.' },
      ],
    },
    ficha: {
      multiPass: null, singlePass: null,
      expressPass: {
        usar: false,
        motivo:
          'O Hagrid’s saiu do Express em 1º de julho de 2026, e a fila que mais pesa no dia é ' +
          'justamente a dele. A segunda, a VelociCoaster, cabe na fila normal à tarde, e nas ' +
          'outras o single rider resolve sem pagar nada.',
      },
      custoEstimadoCasal: { min: 32, max: 35, moeda: 'USD' },
      extras: [
        { nome: 'Estacionamento da Universal',
          custo: { min: 32, max: 35, moeda: 'USD' },
          texto: 'US$ 32 pago antes pelo site, US$ 35 na hora.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Grinchmas Who-liday Spectacular', motivo: 'Visto no dia 14, que existe para ele.' },
        { nome: 'Flight of the Hippogriff',
          motivo: 'Montanha-russa de família de um minuto, com 34 minutos de fila média.' },
        { nome: 'Beco Diagonal', motivo: 'Feito inteiro no dia 17, inclusive à noite.' },
        { nome: 'Pteranodon Flyers', motivo: 'Só com criança.' },
        { nome: 'Seuss Landing', motivo: 'Brinquedos infantis. Vocês atravessam a pé.' },
        { nome: 'Popeye e Dudley Do-Right',
          motivo: 'Molham muito, e o Jurassic Park River Adventure já cumpre esse papel.' },
        { nome: 'Doctor Doom’s Fearfall',
          motivo: 'Torre de menos de um minuto. O tempo dele foi para a fila da VelociCoaster, ' +
                  'que não tem single rider. Volta no plano B.' },
      ],
      fechado: [],
    },
  },

  /* ===== 20/11 · SEXTA · EPIC UNIVERSE ================================= */
  {
    id: 'd-2026-11-20',
    data: '2026-11-20',
    diaSemana: 'sexta',
    emoji: '🌌',
    titulo: 'Epic Universe',
    subtitulo: 'Dia único · três terras de verdade, não cinco pela metade',
    tipo: 'parque',
    operadora: 'universal',
    parqueId: 'epic-universe',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-10',
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },
    resumo:
      'O parque mais concorrido de Orlando, no dia mais vazio da segunda metade da viagem, ' +
      'e o único dia de Epic. AS ONZE ATRAÇÕES NÃO CABEM: sem Early Park Admission e sem ' +
      'Express, as quatro filas grandes do parque somam mais tempo do que o dia inteiro ' +
      'tem. O que cabe são três terras feitas de verdade — Dark Universe de manhã, porque ' +
      'é a única que abre limpa às 9h; Isle of Berk à tarde, com o show; e o Ministry na ' +
      'noite inteira, que é quando a fila dele despenca. A Super Nintendo World fica só ' +
      'com o almoço.',
    avisos: [
      'O ROPE DROP É NA DARK UNIVERSE, NÃO NO MINISTRY. Às 9h os hóspedes de hotel já estão ' +
      'há uma hora no Battle at the Ministry, na Super Nintendo World e em Berk. O portal ' +
      'que abre vazio para vocês é o da Dark Universe. Confiram a lista do Early Park ' +
      'Admission na véspera: ela já mudou três vezes em dezoito meses.',
      'HOJE É DE CARRO, e o Epic tem estacionamento próprio: US$ 32 pagos antes pelo site ' +
      'ou US$ 35 na hora, na entrada da 1222 Epic Blvd.',
      'É o único dia de Epic da viagem. Se hoje der muito errado, a manhã livre do dia 24 é o ' +
      'lugar mais barato para voltar — se o ingresso tiver um dia sobrando com Epic, o que ' +
      'ainda precisa ser confirmado com a agência.',
    ],
    notas: [
      { tipo: 'alerta', texto:
        'O ROPE DROP É NA DARK UNIVERSE, longe da multidão do Early Park Admission.\n\n' +
        'O MECANISMO, confirmado em fevereiro de 2026: durante o Early Park Admission o ' +
        'Celestial Park fica aberto para TODO MUNDO, e a checagem de hóspede de hotel é feita ' +
        'na porta de cada land. Vocês entram no parque cedo, mas não passam dos portais que ' +
        'participam do EPA.\n\n' +
        'QUEM PARTICIPA: desde fevereiro de 2026, conferido de novo em 16/06/2026, são a ' +
        'Ministry of Magic, a Super Nintendo World e a Isle of Berk. O Stardust Racers e o ' +
        'Carrossel saíram, e a Dark Universe também.\n\n' +
        'Por isso o dia começa no Monsters Unchained: às 9h, o Battle at the Ministry já tem ' +
        'a fila de quem entrou uma hora antes.\n\n' +
        'A LISTA JÁ MUDOU PELO MENOS TRÊS VEZES EM DEZOITO MESES. Se em novembro a Dark ' +
        'Universe voltar para o EPA, vale o plano B: os dois blocos trocam de lugar.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'AS DUAS MAIORES FILAS DO PARQUE QUEREM A MESMA HORA, e o dia é desenhado em volta ' +
        'disso.\n\n' +
        'MINE-CART MADNESS: 113 a 114 minutos de média, pico de 205. Fora do EPA, a única ' +
        'janela barata é a última hora antes de fechar, quando cai para 20 a 30.\n\n' +
        'BATTLE AT THE MINISTRY: 76 a 109 minutos de média. Nas últimas duas ou três horas ' +
        'cai para 45 a 75, e na última hora a mediana cai 74%.\n\n' +
        'As duas cabem no fim, uma depois da outra — e é isso que obriga o jantar às 17h.\n\n' +
        'AS TRÊS MAIORES FILAS são Mine-Cart, Ministry e Mario Kart. O Monsters Unchained é ' +
        'uma das MENORES, 13 a 15 minutos.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'O GUIA OFICIAL DE SEGURANÇA DA UNIVERSAL, vigente desde 04/10/2025:\n\n' +
        'LOCKER OBRIGATÓRIO em só três: Stardust Racers, Monsters Unchained e Hiccup’s Wing ' +
        'Gliders. DETECTOR DE METAL só no Stardust.\n\n' +
        'Mine-Cart e Curse of the Werewolf pedem para prender tudo que estiver solto. No ' +
        'Dragon Racer’s Rally há compartimento no próprio brinquedo.\n\n' +
        'Curse, Hiccup’s e Mine-Cart são montanhas-russas de alta velocidade; no Dragon ' +
        'Racer’s Rally é você quem controla a inclinação e as inversões.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'DE CARRO HOJE. O Epic tem estacionamento próprio, na 1222 Epic Blvd, por US$ 32 ' +
        'pagos antes pelo site ou US$ 35 na hora.\n\n' +
        'O Epic não usa o estacionamento da Universal: o ponto de Uber é próprio, na 1222 Epic ' +
        'Blvd, a uns cinco minutos a pé da entrada. É por isso que dá para sair às 7h15 e não ' +
        'às 6h45 — a caminhada longa do estacionamento não existe para quem chega de Uber.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'NATAL NO EPIC, de 14/11 a 03/01. A Super Nintendo World ganha decoração pela primeira ' +
        'vez, a Isle of Berk faz o Snoggletog, a Place Cachée do Ministry entra no Natal do ' +
        'mundo bruxo, e o Celestial Park vira paisagem de inverno com show natalino nas ' +
        'fontes.\n\n' +
        'Os horários dos shows ainda não saíram — a Universal anuncia perto da temporada. Está ' +
        'no checklist.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'POR QUE 20/11. A sexta é o dia que sobra para o Epic depois de o Islands ficar com a ' +
        'quinta, e vale dizer o preço: a quinta 19/11 é apontada como um dos dois dias mais ' +
        'vazios da segunda metade de novembro, fora da semana de Thanksgiving, e a sexta não ' +
        'é. O parque mais concorrido de Orlando cai num dia mais cheio.\n\n' +
        'O QUE COMPENSA: hoje vocês não acordam no dia seguinte ao jogo da NBA, e o dia ' +
        'anterior termina às 21h30 no Islands, não às 22h15 na arena.',
        pesquisa: '2026-09-10' },
    ],
    planos: [
      { letra: 'A', titulo: 'O dia como está escrito',
        gatilho: 'Vocês conferem na véspera e a Dark Universe não está no Early Park Admission.',
        passos: [
          'Entrar às 7h50 e ir direto para a porta da Dark Universe — o Celestial Park já está ' +
          'aberto.',
          'Monsters Unchained às 9h e Curse of the Werewolf em seguida.',
          'Stardust Racers no meio da manhã, e Super Nintendo World às 11h, quando a turma do ' +
          'EPA sai de lá.',
          'Tarde em Berk, com o The Untrainable Dragon às 16h30, antes do jantar.',
          'Jantar às 17h, Battle at the Ministry às 18h20, Mine-Cart Madness às 20h.',
        ] },
      { letra: 'B', titulo: 'A Dark Universe voltou para o Early Park Admission',
        gatilho: 'A lista de novembro inclui a Dark Universe, e o Ministry saiu dela.',
        passos: [
          'Era assim até janeiro de 2026. Aí o portal vazio às 9h é o do Ministry.',
          'TROQUEM OS DOIS BLOCOS: Battle at the Ministry às 9h, e Monsters mais Curse às 18h20.',
          'O Curse é justamente o que despenca no fim do dia, então a troca não custa nada.',
          'O Mine-Cart continua na última hora — ele não tem outra janela.',
        ] },
      { letra: 'B2', titulo: 'O parque fecha às 20h ou às 22h',
        gatilho: 'O horário oficial sai e o fechamento não é 21h.',
        passos: [
          'O Ministry, o Mine-Cart e a saída acompanham o fechamento: o Mine-Cart é sempre a ' +
          'última hora e o Ministry começa 1h40 antes dela.',
          'FECHAMENTO ÀS 22H: o jantar das 17h fica; o Ministry vai para 19h20, o Mine-Cart ' +
          'para 21h e a saída para 22h.',
          'FECHAMENTO ÀS 20H: o Ministry sobe para 17h20 e o Mine-Cart para 19h, e o jantar das ' +
          '17h bate no Ministry. Remarquem o Atlantic para perto das 15h45, pelo app da ' +
          'Universal; sem mesa, o Mead Hall, em Berk, não pede reserva. O The Untrainable ' +
          'Dragon sai: o jantar ocupa a janela dele.',
        ] },
      { letra: 'C', titulo: 'O Mine-Cart parou às 20h',
        gatilho: 'Vocês chegam na Super Nintendo World e ele está fora do ar.',
        passos: [
          'Ele quebra com frequência. Fiquem por perto e acompanhem pelo app.',
          'Se voltar antes das 21h, entrem na fila antes de fechar — quem está na fila anda.',
          'Se não voltar, é a única atração do parque em risco hoje. Não há outra janela ' +
          'barata para ele fora do Early Park Admission.',
        ] },
      { letra: 'C2', titulo: 'Chuva ou frio',
        gatilho: 'Chove, ou a tarde está fria.',
        passos: [
          'Monsters Unchained, Battle at the Ministry, o teatro do Untrainable Dragon, Toadstool ' +
          'e Atlantic são cobertos.',
          'As montanhas-russas param com raio. Se pararem, adiantem o que é coberto e voltem.',
        ] },
    ],
    blocos: [
      { id: 'b-2011-0715', hora: '07:15', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel — Uber',
        descricao: '~30 min de carro. Estacionamento US$ 32 pago antes pelo site',
        contexto:
          'De carro, pela 1222 Epic Blvd. Paguem o estacionamento antes pelo site: US$ 32 ' +
          'contra US$ 35 na hora.\n\n' +
          'O DESTINO NO APP É O PONTO DE EMBARQUE DO EPIC, 1222 Epic Blvd — não é o ' +
          'estacionamento da Universal, que fica em outro lugar. De lá são uns cinco minutos a ' +
          'pé até a entrada.',
        localId: 'epic-universe', acesso: [], duracaoMin: 35, pesquisa: '2026-09-10' },

      { id: 'b-2011-0750', hora: '07:50', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Entrar no parque — portal da Dark Universe',
        descricao: 'O Celestial Park abre para todos no Early Park Admission. Esperem na porta',
        contexto:
          'Durante a hora do Early Park Admission, o Celestial Park fica aberto para todo mundo. ' +
          'A checagem de hóspede de hotel é na porta de cada land — e a Dark Universe não ' +
          'participa. Às 9h ela abre para todos ao mesmo tempo, e quem está na porta entra ' +
          'primeiro.\n\n' +
          'NÃO VÃO PARA A NINTENDO, O MINISTRY OU BERK: os três estão no EPA, e às 9h já têm ' +
          'uma hora de fila acumulada.\n\n' +
          'PONTO DE ENCONTRO DE HOJE: a base do Chronos, a torre da entrada. Todo caminho do ' +
          'parque passa pelo Celestial Park, e ela aparece de qualquer ponto dele. Se vocês se ' +
          'perderem, vão para lá e ESPEREM.\n\n' +
          'É também o café da manhã: comam as barrinhas aqui, parados na porta.',
        localId: 'epic-universe', acesso: [], duracaoMin: 70, pesquisa: '2026-09-10' },

      { id: 'b-2011-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Monsters Unchained: The Frankenstein Experiment',
        descricao: 'Rope drop. O portal que abre vazio para quem é de fora',
        contexto:
          'Dark ride em braço robótico: a tataraneta do Dr. Frankenstein faz experimentos com monstros ' +
          'capturados e eles escapam. O veículo acelera, para, gira, sobe e cai, com ' +
          'animatrônicos no nível dos melhores de Orlando. Tem susto, mas nenhuma queda grande.\n\n' +
          'POR QUE AGORA: é a primeira fila que abre vazia para quem não está em hotel da ' +
          'Universal. Ela enche logo depois da abertura, e ao longo do dia é uma das menores do ' +
          'parque — então pegar vazia agora é o jeito de o resto do dia render.\n\n' +
          'LOCKER OBRIGATÓRIO. Bolsos vazios antes de entrar na fila.',
        areaParque: 'Dark Universe', acesso: ['rope-drop', 'standby'], acessoAlt: 'single-rider',
        locker: 'obrigatorio', critico: true, duracaoMin: 35,
        fila: { min: 10, quando: 'na abertura', pico: 45, media: 30, fonte: '2026-09-17' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'A Dra. Victoria Frankenstein da história é tataraneta do Henry ' +
                   'Frankenstein. Aparecem Drácula, o Lobisomem, a Criatura da Lagoa Negra, as ' +
                   'Noivas de Drácula e o Fantasma da Ópera.',
            fonte: 'Wikipedia — Monsters Unchained: The Frankenstein Experiment', pesquisa: '2026-09-15' },
          { texto: 'O veículo é um braço robótico KUKA, parecido com o do Forbidden Journey, e ' +
                   'o primeiro Frankenstein que vocês encontram é um animatrônico de 2,7 ' +
                   'metros e 360 kg.',
            fonte: 'Wikipedia — Monsters Unchained: The Frankenstein Experiment', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2011-0950', hora: '09:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Curse of the Werewolf',
        descricao: 'Montanha-russa giratória, com trechos de ré. Não é "familiar"',
        contexto:
          'Montanha-russa de alta velocidade em carrinhos que giram livremente conforme o peso, ' +
          'com aceleração forte, trechos de ré e muita rotação — cada volta é diferente. Quem ' +
          'enjoa com giro sente.\n\n' +
          'A fila dela tem pico por volta das 13h e despenca no fim do dia. De manhã, logo ' +
          'depois da abertura, ela ainda não montou.\n\n' +
          'Sem locker obrigatório, mas prendam tudo que estiver solto.',
        areaParque: 'Dark Universe', acesso: ['standby'], acessoAlt: 'single-rider', duracaoMin: 35,
        fila: { min: 20, quando: 'logo depois da abertura', pico: 100, media: 46, fonte: '2026-09-17' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'É uma montanha-russa giratória da Mack, inspirada no filme O Lobisomem, de ' +
                   '1941. Quanto cada carrinho gira depende de como o peso está distribuído, e ' +
                   'no lançamento o trem para numa subida, volta de ré pelo motor e é lançado ' +
                   'de novo.',
            fonte: 'Coasterpedia; RCDB', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2011-1050', hora: '10:50', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Dez minutos, na saída da Dark Universe. O mapa não marca banheiros: perguntem',
        contexto:
          'Duas montanhas-russas com armário e o Stardust logo em seguida, e o almoço só às 13h05. Sentem no Celestial Park, encham os flasks, e só então o Stardust.',
        areaParque: 'Celestial Park', acesso: [], duracaoMin: 10, pesquisa: '2026-09-12' },

      { id: 'b-2011-1110', hora: '11:10', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Stardust Racers',
        descricao: 'Celestial Park. Dois trens correndo lado a lado. Detector de metal',
        contexto:
          'Montanha-russa dupla de lançamento: dois trens correm lado a lado em trilhos ' +
          'separados, se cruzam no ar e passam por uma inversão. Sobe uns 40 metros (133 pés) ' +
          'e chega perto de 100 km/h. É a montanha-russa mais forte do parque.\n\n' +
          'DETECTOR DE METAL NA ENTRADA DA FILA: nada nos bolsos — nem celular, nem chave, nem ' +
          'óculos solto. Tudo no locker gratuito.\n\n' +
          'Ela saiu do Early Park Admission em fevereiro de 2026, então a fila dela começa do ' +
          'zero às 9h, e no meio da manhã costuma estar baixa.',
        areaParque: 'Celestial Park', acesso: ['standby'], acessoAlt: 'single-rider', locker: 'detector',
        duracaoMin: 40,
        fila: { min: 20, quando: 'no meio da manhã', pico: 105, media: 25, fonte: '2026-09-10' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'É da Mack Rides e ganhou o Golden Ticket de melhor montanha-russa nova de ' +
                   '2025. O ponto alto é o Celestial Spin, a inversão de 40 metros em que um ' +
                   'trem faz um giro de gravidade zero e o outro, um parafuso para baixo.',
            fonte: 'Wikipedia — Stardust Racers', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2011-1155', hora: '11:55', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Toadstool Cafe',
        descricao: 'Não aceita reserva. Confiram a lista no app às 11h',
        contexto:
          'O restaurante do Mario, dentro da Super Nintendo World, com pratos que imitam os ' +
          'itens do jogo. A comida é secundária: vocês vão pelo cenário. Pratos principais de ' +
          'US$ 18 a 26.\n\n' +
          'NÃO ACEITA RESERVA, e as fontes não concordam sobre como se entra: a maioria dos ' +
          'guias fala de lista de espera pelo app da Universal, e um diz que é por ordem de ' +
          'chegada. Por isso o bloco das 11h manda conferir no app — se houver lista, entrem ' +
          'nela ali.\n\n' +
          'O pico do almoço no parque é das 11h30 às 13h30. Às 13h05 vocês pegam o fim dele.\n\n' +
          'É serviço rápido, com pedido pela mesa: não leva gorjeta de garçom.',
        restauranteId: 'r-toadstool', areaParque: 'Super Nintendo World', acesso: [],
        duracaoMin: 55, pesquisa: '2026-09-10' },

      { id: 'b-2011-1300', hora: '13:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Hiccup’s Wing Gliders',
        descricao: 'Isle of Berk. Lançamento de alta velocidade, com trecho de ré. Locker',
        contexto:
          'Montanha-russa de lançamento no mundo de Como Treinar o Seu Dragão, com aceleração ' +
          'forte, subidas, quedas e um trecho de ré. Não é suave. A vila viking em volta é das ' +
          'mais bonitas do parque, e hoje está no Snoggletog, ' +
          'o Natal de Berk.\n\n' +
          'A fila dela piora no fim da tarde, por volta das 17h. No começo da tarde ainda está ' +
          'no meio do caminho.\n\n' +
          'LOCKER OBRIGATÓRIO.',
        areaParque: 'Isle of Berk', acesso: ['standby'], acessoAlt: 'single-rider', locker: 'obrigatorio',
        duracaoMin: 45,
        fila: { min: 30, quando: 'no começo da tarde', pico: 120, media: 90, fonte: '2026-09-17' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'É da Intamin, a mesma fabricante da VelociCoaster: dois lançamentos até 72 ' +
                   'km/h, o segundo depois de o trem voltar de ré.',
            fonte: 'Coasterpedia', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2011-1445', hora: '14:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Dragon Racer’s Rally',
        descricao: 'Você controla a inclinação — e as inversões',
        contexto:
          'Braços que erguem o carrinho no alto e giram, e é você quem controla quanto ele ' +
          'inclina — dá para virar de cabeça para baixo ou não. A intensidade é escolha de quem ' +
          'está sentado.\n\n' +
          'Há compartimento no próprio brinquedo para guardar o que estiver solto.',
        areaParque: 'Isle of Berk', acesso: ['standby'], duracaoMin: 40,
        fila: { min: 25, quando: 'à tarde', pico: 100, media: 37, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-2011-1545', hora: '15:45', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada em Berk — água, banheiro e sentar',
        descricao: 'Vinte e cinco minutos. Às 16h10, fila do teatro',
        contexto:
          'A parada antes da reta final, e a reta final é longa: show, jantar, Ministry e ' +
          'Mine-Cart emendados até as 21h. Encham os flasks num balcão de comida — a água ' +
          'gelada é de graça — e sentem, ainda em Berk, com a vila decorada para o Snoggletog.\n\n' +
          'Às 16h10 sigam para a fila do The Untrainable Dragon, que fica aqui mesmo.',
        areaParque: 'Isle of Berk', acesso: [], duracaoMin: 25, pesquisa: '2026-09-15',
        curiosidades: [
          { texto: 'Como Treinar o Seu Dragão está num parque da Universal porque a ' +
                   'NBCUniversal comprou a DreamWorks Animation em 2016, por US$ 3,8 bilhões.',
            fonte: 'Wikipedia — DreamWorks Animation', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2011-1610e', hora: '16:10', ancora: 'fixo', tipo: 'espera',
        titulo: 'Fila do The Untrainable Dragon',
        descricao: 'Vinte minutos antes da sessão. Meio do teatro',
        contexto:
          'Plateia por ordem de chegada. Sentem no meio, de fileira e de lado: muito perto, ' +
          'as telas laterais e as projeções saem do campo de visão.',
        areaParque: 'Isle of Berk', acesso: [], duracaoMin: 20, pesquisa: '2026-09-15' },

      { id: 'b-2011-1630s', hora: '16:30', ancora: 'fixo', tipo: 'show',
        titulo: 'The Untrainable Dragon',
        descricao: 'O maior show do Epic, 20 min. Termina a três minutos do Atlantic',
        contexto:
          'Musical de palco com atores, bonecos enormes e efeitos em cima da plateia, contando ' +
          'a chegada de um dragão novo à vila de Berk. O Banguela mecânico pesa mais de meia ' +
          'tonelada, tem oito metros de envergadura e voa por cima do público. Muitas resenhas ' +
          'o apontam como o melhor show do parque.\n\n' +
          'POR QUE ÀS 16H30: é a última sessão antes do jantar das 17h, e a Isle of Berk fica a ' +
          'três minutos do Atlantic. Ele termina por volta das 16h50, e vocês chegam à mesa às ' +
          '16h55, que é a antecedência que a Universal pede.\n\n' +
          'HORÁRIO A CONFIRMAR: em setembro de 2026 as sessões iam das 11h10 às 19h, a cada 50 ' +
          'minutos — 15h40, 16h30, 17h20. Se em novembro não houver sessão entre 16h15 e 16h35, ' +
          'a parada das 15h45 vira a pausa inteira até as 16h50 e o show fica de fora.',
        areaParque: 'Isle of Berk', acesso: [], duracaoMin: 20, confirmarHorario: true,
        pesquisa: '2026-09-15' },

      { id: 'b-2011-1700', hora: '17:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Atlantic',
        descricao: 'Reservado para as 17h. Cheguem 5 min antes: a mesa espera só 15 min',
        contexto:
          'Restaurante de frutos do mar e carnes no Celestial Park, o mais formal do parque. ' +
          'Pratos principais de US$ 35 a 48.\n\n' +
          'POR QUE ÀS 17H: é o jantar cedo que paga o dia. As duas maiores filas do parque só ' +
          'ficam razoáveis no fim — o Ministry nas últimas duas ou três horas, o Mine-Cart na ' +
          'última — e as duas precisam de todo o tempo depois daqui.\n\n' +
          'RESERVADO: confirmação 639251824607987840, duas pessoas, 17h. A Universal pede ' +
          'chegada 5 minutos antes e segura a mesa só por 15 minutos — às 17h15 a reserva é ' +
          'liberada. O The Untrainable Dragon termina por volta das 16h50, em Berk, a três ' +
          'minutos daqui: é exatamente a folga pedida.\n\n' +
          'Para remarcar ou cancelar: pela conta da Universal no app, ou +1 407-224-3663.\n\n' +
          'SE PERDEREM A MESA: o Mead Hall, salão viking da Isle of Berk, não aceita reserva — ' +
          'é mais barato e mais temático. Berk fica do outro lado do Ministry: contem a ' +
          'caminhada de volta para as 18h20.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta, e o preço da etiqueta não inclui o imposto.',
        restauranteId: 'r-atlantic', areaParque: 'Celestial Park', acesso: ['reserva'],
        duracaoMin: 75, pesquisa: '2026-09-10' },

      { id: 'b-2011-1830', hora: '18:30', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Harry Potter and the Battle at the Ministry',
        descricao: 'Nas últimas horas a fila cai para 45–75 min. De manhã, era a fila do EPA',
        contexto:
          'Dark ride pelo Ministério da Magia, misturando cenário físico, animatrônicos e telas ' +
          'de forma quase invisível. O veículo acelera, para, gira, sobe e cai com força. É ' +
          'consenso como a melhor atração do parque.\n\n' +
          'POR QUE AGORA E NÃO ÀS 9H: o Ministry está no Early Park Admission. Às 9h, quem é de ' +
          'hotel já está nele há uma hora. Ele faz 76 a 109 minutos de média, e só nas últimas ' +
          'duas ou três horas cai para 45 a 75 — na última, a mediana cai 74%.\n\n' +
          'Na saída vocês estão na Place Cachée à noite, decorada para o Natal do mundo bruxo. ' +
          'Vale andar cinco minutos por ela antes de seguir para a Nintendo.\n\n' +
          'HORA A CONFIRMAR: este bloco segue o fechamento do parque. O roteiro assume 21h.',
        areaParque: 'Ministry of Magic', acesso: ['standby'], acessoAlt: 'single-rider', critico: true,
        confirmarHorario: true, duracaoMin: 90,
        fila: { min: 45, quando: 'nas últimas 2–3 horas', pico: 185, media: 135, fonte: '2026-09-17' },
        pesquisa: '2026-09-10',
        curiosidades: [
          { texto: 'Vocês entram pela Paris bruxa dos anos 1920 e chegam à Londres dos anos ' +
                   '1990 pelas lareiras da rede de Flu. A história se passa logo depois da ' +
                   'derrota de Voldemort: a Dolores Umbridge vai a julgamento e tenta fugir, ' +
                   'com a Imelda Staunton de volta ao papel.',
            fonte: 'Wikipedia — Harry Potter and the Battle at the Ministry', pesquisa: '2026-09-15' },
          { texto: 'Os veículos são elevadores que andam em todas as direções, fabricados pela ' +
                   'Simtec.',
            fonte: 'Wikipedia — Harry Potter and the Battle at the Ministry', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2011-2100', hora: '21:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair — Uber',
        descricao: 'Pelo Celestial Park iluminado. Embarque na 1222 Epic Blvd',
        contexto:
          'A saída atravessa o Celestial Park de noite, com a decoração de Natal acesa — é o ' +
          'parque no seu melhor, e vocês passam por ele de qualquer jeito. Se o show natalino ' +
          'das fontes estiver na grade perto das 21h, é aqui que ele entra.\n\n' +
          'A tarifa dinâmica sobe no fechamento. Se estiver absurda, esperem dez minutos no ' +
          'Celestial Park antes de chamar.\n\n' +
          'Amanhã a manhã é livre, sem alarme.',
        localId: 'epic-universe', acesso: [], duracaoMin: 45 },
    ],
    naoPerca: [
      { nome: 'Place Cachée à noite, no Natal do mundo bruxo', quando: 'hoje', custo: 'grátis',
        motivo: 'Vocês saem do Battle at the Ministry direto nela, já escuro e decorada. ' +
                'Cinco minutos andando antes de seguir para a Nintendo.',
        pesquisa: '2026-09-10' },
      { nome: 'O primeiro Natal da Super Nintendo World', quando: 'hoje', custo: 'grátis',
        motivo: 'É a primeira temporada em que a área ganha decoração. Vocês entram nela ' +
                'para o almoço no Toadstool: vale atravessar a área devagar na ida e na ' +
                'volta, porque é a única passagem do dia por ali.',
        pesquisa: '2026-09-10' },
      { nome: 'Show natalino das fontes do Celestial Park', quando: 'hoje',
        condicao: 'grade sai no app no próprio dia', custo: 'grátis',
        motivo: 'As fontes do Celestial Park ganham show de Natal na temporada. A grade sai ' +
                'no app da Universal no próprio dia — está na pendência da manhã de hoje.',
        pesquisa: '2026-09-10' },
      { nome: 'Snoggletog na Isle of Berk', quando: 'hoje', custo: 'grátis',
        motivo: 'O Natal de Como Treinar o Seu Dragão, na vila viking. Vocês passam a tarde ' +
                'inteira em Berk.',
        pesquisa: '2026-09-10' },
      { nome: 'Power-Up Band', quando: 'decidir', custo: '~US$ 40',
        motivo: 'Pulseira que ativa os jogos espalhados pela Super Nintendo World. Sem ela, ' +
                'metade da área vira só cenário. A decisão está no checklist de outubro.' },
    ],
    prepararAmanha: {
      paraODia: '2026-11-21',
      titulo: 'Winter Garden e Solar Bears · saída 8h',
      aviso: 'Amanhã é o primeiro dia de carro de verdade, mas só até Winter Garden: à noite o ' +
             'carro fica no hotel e o jogo é de Uber, numa arena que não aceita bolsa.',
      itens: [
        { texto: 'Alarme para 6h45 nos dois celulares', critico: true,
          motivo: 'Café da manhã do hotel às 7h15 e saída às 8h. O Farmers Market de Winter ' +
                  'Garden vai das 8h às 13h e só funciona aos sábados.' },
        { texto: 'A mochila fica no quarto antes do jogo', critico: true,
          motivo: 'O Kia Center não aceita bolsa, e vocês vão só com o bolso. A volta de ' +
                  'Winter Garden passa pelo hotel à tarde: a mochila fica lá, junto com o carro.' },
        { texto: 'Ingresso do Solar Bears nos dois celulares', critico: true,
          motivo: 'Jogo às 19h no Kia Center.' },
        { texto: 'Se o GPS escolher a SR-429, deixem', critico: false,
          motivo: 'É pedágio pela placa, porque o e-Toll foi recusado: poucos dólares mais a taxa ' +
                  'de US$ 6,95 do dia.' },
      ],
    },
    ficha: {
      multiPass: null, singlePass: null,
      expressPass: {
        usar: false,
        motivo: 'O Express tem preço dinâmico, de US$ 150 a mais de 360 por pessoa por dia. ' +
                'Continua sendo não — com o rope drop na Dark Universe e as duas maiores filas ' +
                'no fim, o dia não precisa dele para caber.',
        alternativa: 'Duas saídas, nesta ordem. O Universal Express Now, comprado no app ' +
                     'dentro do parque, US$ 20 a 25 por pessoa e por atração — a lista muda ' +
                     'ao longo do dia e pode não ter o Mine-Cart nem o Ministry. E, se o ' +
                     'ingresso tiver um dia sobrando com Epic, a manhã livre do dia 20, que ' +
                     'não tira nada do roteiro.',
      },
      custoEstimadoCasal: { min: 0, max: 0, moeda: 'USD' },
      extras: [
        { nome: 'Lockers — só três atrações hoje',
          custo: { min: 0, max: 18, moeda: 'USD' },
          texto: 'Locker obrigatório só no Stardust Racers, no Monsters Unchained e no ' +
                 'Hiccup’s Wing Gliders, e detector de metal só no Stardust — pelo guia ' +
                 'oficial da Universal. O locker comum é grátis pelo tempo da fila mais a ' +
                 'atração; o grande é pago, de US$ 3 a 6 conforme a fonte.' },
        { nome: 'Power-Up Band',
          custo: { min: 40, max: 40, moeda: 'USD' },
          texto: 'Comprem se quiserem jogar os desafios interativos da Super Nintendo World. ' +
                 'Sem ela, metade da área vira só cenário. Decisão pendente — está no checklist ' +
                 'de outubro.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Astronomica',
          motivo: 'Área de brincar com água no Celestial Park. Vocês passam por ela várias ' +
                  'vezes no dia — se der vontade, é parar cinco minutos, não é bloco.' },
        { nome: 'Viking Training Camp',
          motivo: 'Área de brincar infantil da Isle of Berk, com torres e escorregadores.' },
        { nome: 'Mario Kart: Bowser’s Challenge',
          motivo: 'CORTADO EM 17/09 pela conta de tempo. Faz 85 minutos de média já às 9h40 e ' +
                  '125 às 18h, e a Super Nintendo World está no Early Park Admission: não ' +
                  'existe hora barata nela. Manter Mario Kart custava a Isle of Berk inteira.' },
        { nome: 'Mine-Cart Madness',
          motivo: 'CORTADO EM 17/09, e dói: os dois guias o chamam de melhor atração do ' +
                  'parque. Mas ele mede 165 minutos de média e 205 de pico. Só caberia ' +
                  'ocupando a noite toda, no lugar do Battle at the Ministry, que é a melhor ' +
                  'atração pelo consenso e cuja fila despenca justamente nas últimas horas.' },
        { nome: 'Yoshi’s Adventure',
          motivo: 'CORTADO EM 17/09. Passeio lento de 34 minutos de fila média, sem inversão ' +
                  'e sem velocidade — o mais fraco do dia para um casal adulto.' },
        { nome: 'Bowser Jr. Shadow Showdown',
          motivo: 'Desafio interativo da Super Nintendo World que depende da Power-Up Band. ' +
                  'Menor fila do parque, e é voltado a criança.' },
        { nome: 'Fyre Drill',
          motivo: 'Barcos com canhões de água: o guia oficial diz que os passageiros podem ' +
                  'encharcar. Depois dele viriam um show sentado e um jantar de mesa.' },
        { nome: 'Constellation Carousel',
          motivo: 'Carrossel com criaturas que giram sozinhas, 21 minutos de fila média. A ' +
                  'pausa da tarde agora é em Berk, antes do show.' },
        { nome: 'Le Cirque Arcanus',
          motivo: 'Circo de criaturas de Animais Fantásticos, com 23 minutos de show e 10 de ' +
                  'pré-show. As resenhas se dividem, e a noite no Ministry of Magic é da fila ' +
                  'do Battle at the Ministry. O show do dia é o The Untrainable Dragon.' },
      ],
      fechado: [],
    },
  },

  /* ===== 21/11 · SÁBADO · WINTER GARDEN E SOLAR BEARS ================== */
  {
    id: 'd-2026-11-21',
    data: '2026-11-21',
    diaSemana: 'sábado',
    emoji: '🌻',
    titulo: 'Winter Garden e Solar Bears',
    subtitulo: 'Manhã no interior, noite no gelo',
    tipo: 'livre',
    operadora: null,
    parqueId: null,
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-11',
    referencia: { rotulo: 'Início do jogo', padrao: '19:00', confirmado: true },
    resumo:
      'Feira de sábado numa cidadezinha histórica pela manhã e hóquei no centro de Orlando ' +
      'à noite, com uma tarde inteira de descanso no meio. O carro leva a Winter Garden; à ' +
      'noite ele fica no hotel e o jogo é de Uber.',
    avisos: [
      'O KIA CENTER NÃO ACEITA BOLSA. A mochila de Winter ' +
      'Garden fica no quarto, e para o jogo vocês saem só com o bolso.',
      'Amanhã é SeaWorld e vocês voltam do jogo por volta das 22h15. A mochila de amanhã fica ' +
      'pronta na tarde de descanso, ANTES de sair para o centro.',
    ],
    notas: [
      { tipo: 'info', texto:
        'JOGO CONFIRMADO: sábado, 21/11/2026, 19h, Kia Center. Orlando Solar Bears contra o ' +
        'Jacksonville Icemen, pela ECHL. É noite de Food Drive, de arrecadação de alimentos — ' +
        'o time ainda não publicou como funciona.\n\n' +
        'O início do jogo é a referência da noite: se ele mudar, o Uber, o jantar e a ' +
        'caminhada deslocam junto, e o app avisa.',
        pesquisa: '2026-09-11' },

      { tipo: 'alerta', texto:
        'A REGRA DA BOLSA É A MESMA DO DIA 18: bolsa nenhuma passa, e vocês vão só com o ' +
        'bolso. Hoje é mais fácil: não há compras, e a volta de Winter Garden passa ' +
        'pelo hotel. Celular, cartão e documento no bolso, ingresso no celular dos dois.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'WINTER GARDEN DE CARRO: uns 40 minutos pela SR-429, pedágio sem cabine cobrado pela ' +
        'placa — poucos dólares, mais a taxa de US$ 6,95 da Avis no dia.\n\n' +
        'ESTACIONAR É GRÁTIS em todo o centro. A garagem de três andares da 160 S Boyd St fica ' +
        'ao lado da feira, e há vagas grátis na West Plant Street e em outros estacionamentos ' +
        'da prefeitura. No sábado a vaga é disputada por causa da feira.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'NA SAÍDA DO JOGO, A ZONA OFICIAL DE UBER E LYFT é a esquina da Hughey Ave com a Pine ' +
        'St, a uma caminhada curta da arena. Marquem o ponto ali antes de chamar.',
        pesquisa: '2026-09-11' },
    ],
    planos: [
      { letra: 'A', titulo: 'O dia como está escrito',
        gatilho: 'Manhã sem imprevisto e o café do hotel aberto às 7h15.',
        passos: [
          'Café do hotel às 7h15 e saída às 8h.',
          'Feira às 8h45, museu ferroviário às 10h15 e Plant Street a pé até o almoço.',
          'Almoço no Plant Street Market às 11h45 e volta ao hotel às 13h.',
          'Descanso até 17h05, Chick-fil-A às 17h35 e Uber para a arena às 18h10.',
          'Jogo às 19h e Uber na esquina da Hughey com a Pine, na saída.',
        ] },
      { letra: 'B', titulo: 'Chuva de manhã',
        gatilho: 'Chove em Winter Garden.',
        passos: [
          'A feira acontece faça chuva ou sol, e o pavilhão é coberto. Capa de chuva na mochila.',
          'Os dois museus e o Plant Street Market são cobertos: só a caminhada pela Plant ' +
          'Street cai.',
          'O resto do dia não muda.',
        ] },
      { letra: 'B2', titulo: 'O café do hotel não está aberto',
        gatilho: 'Às 7h15 o café da manhã do hotel ainda não começou.',
        passos: [
          'Saiam às 7h45, sem esperar.',
          'Café da manhã no Axum Coffee, 146 W Plant St: café, panini e doces. Se ele ainda ' +
          'estiver fechado, a feira tem barracas de padaria.',
          'A feira às 8h45 continua de pé.',
        ] },
      { letra: 'C', titulo: 'Cansaço ou atraso',
        gatilho: 'A manhã atrasou ou o corpo pediu descanso.',
        passos: [
          'Os museus caem primeiro. A feira e o almoço ficam.',
          'Almocem às 11h e voltem mais cedo: a tarde de descanso é o que segura o SeaWorld ' +
          'de amanhã.',
        ] },
      { letra: 'C2', titulo: 'Uber caro na saída do jogo',
        gatilho: 'A tarifa dinâmica disparou quando o jogo acabou.',
        passos: [
          'Andem até a esquina da Hughey Ave com a Pine St, a zona oficial de rideshare.',
          'Se ainda estiver caro, esperem 15 a 20 minutos num bar da Church St e chamem de novo.',
          'Não esperem mais que isso: amanhã o alarme é às 6h45.',
        ] },
    ],
    blocos: [
      { id: 'b-2111-0715', hora: '07:15', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Café da manhã do hotel',
        descricao: 'Incluso e rápido: a saída é às 8h',
        contexto:
          'O café da manhã do hotel é continental e incluso, e abre às 7h segundo os sites de ' +
          'reserva. Hoje é ele porque não há tempo para um café fora antes da estrada.\n\n' +
          'SE AINDA NÃO ESTIVER ABERTO: plano B2 — saiam às 7h45 e comam no Axum Coffee, em ' +
          'Winter Garden.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 35 },

      { id: 'b-2111-0745', hora: '08:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'De carro para Winter Garden',
        descricao: '~40 min pela SR-429, pedágio pela placa. Garagem grátis na 160 S Boyd St',
        contexto:
          'A primeira estrada de verdade com o carro. A SR-429 é pedágio sem cabine: a Avis ' +
          'cobra cada pórtico pela placa e soma a taxa de US$ 6,95 do dia. Poucos dólares.\n\n' +
          'ONDE PARAR: a garagem de três andares da 160 S Boyd St, ao lado da feira. É grátis, ' +
          'como todo estacionamento no centro de Winter Garden. No sábado a vaga é disputada; ' +
          'se a garagem estiver cheia, há vagas grátis na West Plant Street.',
        endereco: '160 S Boyd St', localId: 'winter-garden', acesso: [], duracaoMin: 40,
        pesquisa: '2026-09-11' },

      { id: 'b-2111-0830', hora: '08:45', ancora: 'fixo', tipo: 'livre',
        titulo: 'Winter Garden Farmers Market',
        descricao: 'Mais de 100 barracas, das 8h às 13h. Faça chuva ou sol, sob o pavilhão',
        contexto:
          'A feira de sábado de uma cidadezinha histórica a 40 minutos de Orlando, sem nada de ' +
          'parque: produtores locais, padaria, empórios, arte, bijuteria, decoração e ' +
          'artesanato. Mais de cem barracas e uns 3.500 visitantes por sábado.\n\n' +
          'É o contraponto mais forte da viagem aos parques.\n\n' +
          'Funciona o ano todo, faça chuva ou sol, e o Downtown Pavilion é coberto.',
        endereco: '104 S. Lakeview Ave', localId: 'winter-garden', acesso: [], duracaoMin: 90,
        pesquisa: '2026-09-11' },

      { id: 'b-2111-1015', hora: '10:15', ancora: 'fixo', tipo: 'livre',
        titulo: 'Central Florida Railroad Museum',
        descricao: 'Grátis. Do outro lado da rua da feira. Abre às 10h no sábado',
        contexto:
          'O museu das ferrovias da Flórida Central: mais de 40 padrões de louça de 25 ' +
          'ferrovias da era de ouro dos trens de passageiros, lanternas, lampiões, sinos de ' +
          'locomotiva, um vagonete a motor e placas de estação.\n\n' +
          'Meia hora resolve. No sábado abre das 10h às 15h, e a entrada é gratuita.',
        endereco: '101 S Boyd St', localId: 'winter-garden', acesso: [], duracaoMin: 30,
        pesquisa: '2026-09-11' },

      { id: 'b-2111-1030', hora: '10:45', ancora: 'fixo', tipo: 'livre',
        titulo: 'Plant Street a pé · Axum Coffee',
        descricao: 'A rua de tijolos, a ciclovia no canteiro central e um café',
        contexto:
          'A Plant Street é a rua principal do centro histórico, e a West Orange Trail passa ' +
          'pelo canteiro do meio dela: vocês veem a ciclovia sem alugar bicicleta.\n\n' +
          'AXUM COFFEE, no 146 W Plant St: café, espresso, chá, panini e doces. É a pausa ' +
          'antes do almoço.\n\n' +
          'WINTER GARDEN HERITAGE MUSEUM, opcional: fica no 1 N Main St, na antiga estação da ' +
          'Atlantic Coast Line, e abre às 11h no sábado. Conta a história da cidade, dos ' +
          'laranjais e das ferrovias.',
        endereco: '146 W Plant St', localId: 'winter-garden', acesso: [], duracaoMin: 60,
        pesquisa: '2026-09-11' },

      { id: 'b-2111-1230', hora: '11:45', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Almoço — Plant Street Market',
        descricao: 'Mercado gastronômico com 17 balcões e a cervejaria Crooked Can dentro',
        contexto:
          'Um salão de balcões independentes: churrasco americano no This Little Piggy, ostras ' +
          'no Bruno’s, empanadas, ceviche, pizza no forno a carvão, frango apimentado no JAM Hot ' +
          'Chicken, queijaria, sorvete mexicano e donuts. Cada um pede onde quiser.\n\n' +
          'A CROOKED CAN é a cervejaria do mesmo salão. Quem dirige na volta não bebe: a ' +
          'estrada para o hotel é às 13h.\n\n' +
          'É balcão: não leva gorjeta.',
        endereco: '426 W Plant St', restauranteId: 'r-plant-street-market',
        localId: 'winter-garden', acesso: [], duracaoMin: 75, pesquisa: '2026-09-11' },

      { id: 'b-2111-1300', hora: '13:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: '~40 min de carro. O carro fica no hotel até amanhã',
        contexto: 'A noite é de Uber: o carro só sai de novo para o SeaWorld.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 45 },

      { id: 'b-2111-1500', hora: '13:45', ancora: 'fixo', tipo: 'vazio',
        titulo: 'VAZIO PROPOSITAL',
        descricao: 'Quase três horas de descanso no hotel',
        contexto:
          'Não preencham. A noite termina perto das 23h, com o jantar depois do jogo, e amanhã ' +
          'começam três dias de parque seguidos: SeaWorld, Islands of Adventure e Busch ' +
          'Gardens.\n\n' +
          'É também a hora de deixar a mochila de Winter Garden no quarto e montar a do ' +
          'SeaWorld. Para o jogo, vocês saem só com o bolso.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 195 },

      { id: 'b-2111-1730', hora: '17:05', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Uber para o Chick-fil-A da S Orange Ave',
        descricao: '30 km, ~29 min, US$ 32–45. O carro fica no hotel',
        contexto:
          'O carro fica no hotel e a noite é de Uber, ida e volta.\n\n' +
          'ANTES DE SAIR: nada de bolsa. Celular, cartão e documento no bolso. Ingresso do jogo ' +
          'no celular dos dois.',
        endereco: '2885 S Orange Ave', localId: 'kia-center', acesso: [], duracaoMin: 30 },

      { id: 'b-2111-1735', hora: '17:35', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Jantar — Chick-fil-A',
        descricao: 'Balcão, na 2885 S Orange Ave. A 8 minutos de carro da arena',
        contexto:
          'Nenhuma rede americana clássica ficou a pé do Kia Center — o Five Guys que existia ' +
          'na 55 W Church St fechou. Este Chick-fil-A é o mais perto que sobrou: 7 km da ' +
          'arena, oito minutos de carro, e fica no caminho de quem vem de Kissimmee.\n\n' +
          'Combo de sanduíche com waffle fries e bebida sai por uns US$ 11 por pessoa. No ' +
          'sábado ele abre das 6h às 22h — e fecha aos domingos, o que não afeta hoje.\n\n' +
          'É balcão: não leva gorjeta. Comam com calma, que às 18h10 vocês pedem o Uber ' +
          'para a arena e ainda chegam antes dos portões, que abrem às 18h.',
        restauranteId: 'r-chickfila', endereco: '2885 S Orange Ave', localId: 'kia-center',
        acesso: [], duracaoMin: 35, pesquisa: '2026-09-11' },

      { id: 'b-2111-1810', hora: '18:10', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Uber até o Kia Center',
        descricao: '7 km, 8 minutos. Portões abertos desde as 18h',
        contexto:
          'Do Chick-fil-A até a arena são 7 quilômetros pela Orange Ave, uns oito minutos. ' +
          'Peçam o carro ainda sentados: em noite de jogo o entorno da arena congestiona, e o ' +
          'ponto de desembarque fica a um quarteirão da catraca.\n\n' +
          'ÚLTIMA CONFERÊNCIA ANTES DA CATRACA: nada de bolsa, ingresso no celular dos dois, ' +
          'cada um com o seu.',
        localId: 'kia-center', acesso: [], duracaoMin: 20, pesquisa: '2026-09-11' },

      { id: 'b-2111-1900', hora: '19:00', ancora: 'referencia', tipo: 'show',
        titulo: 'Orlando Solar Bears × Jacksonville Icemen',
        descricao: 'Hóquei da ECHL. Ingresso já comprado. Cowbell liberado',
        contexto:
          'Hóquei de liga de acesso, no mesmo ginásio do jogo da NBA do dia 18 — e mesmo ' +
          'assim é uma noite bem diferente: gelo no lugar da quadra e a torcida muito mais ' +
          'perto do jogo.\n\n' +
          'É NOITE DE FOOD DRIVE, de arrecadação de alimentos. O time ainda não publicou como ' +
          'funciona.\n\n' +
          'COWBELL: a arena proíbe qualquer objeto que faça barulho, com uma exceção — o ' +
          'cowbell, e só nos jogos do Solar Bears.\n\n' +
          'Cerca de 2h30 com os dois intervalos. Comida e bebida lá dentro são caras; o jantar ' +
          'já foi.',
        localId: 'kia-center', acesso: [], critico: true, duracaoMin: 150,
        pesquisa: '2026-09-11' },

      { id: 'b-2111-2130', hora: '21:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Uber para o Red Lobster',
        descricao: 'Da esquina da Hughey com a Pine, ~31 min. Chegam por volta das 22h05',
        contexto:
          'A zona de Uber e Lyft do Kia Center é a esquina da Hughey Ave com a Pine St, a uma ' +
          'caminhada curta da arena. Marquem o ponto ali antes de chamar.\n\n' +
          'O DESTINO NÃO É O HOTEL, é o Red Lobster da 5690 W Irlo Bronson — ele fica 1,9 km ' +
          'antes, na mesma 192, e fecha às 23h. Indo direto, vocês ganham os dez minutos que ' +
          'passar no hotel custaria.\n\n' +
          'A tarifa dinâmica logo depois do apito final pode triplicar. Se estiver alta, vale ' +
          'o plano C2.',
        endereco: '5690 W Irlo Bronson Memorial Hwy', localId: 'red-lobster',
        acesso: [], duracaoMin: 35 },

      { id: 'b-2111-2205', hora: '22:05', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Jantar — Red Lobster',
        descricao: 'O jantar de verdade da noite. No sábado, até as 23h',
        contexto:
          'O Chick-fil-A das 17h35 foi para aguentar o jogo; o jantar é este. No sábado a casa ' +
          'vai até as 23h, então vocês têm quase uma hora — peçam logo, sem estudar o cardápio ' +
          'na mesa.\n\n' +
          'Ultimate Feast US$ 32,99, pratos simples a partir de uns US$ 20, e os Cheddar Bay ' +
          'Biscuits vêm de cortesia. É mesa com garçom: 18 a 20% de gorjeta.\n\n' +
          'SE O JOGO ESTICAR e vocês saírem depois das 22h20, não vale a corrida: o Miller’s ' +
          'Ale House, na 8123 W Irlo Bronson, tem mesa com garçom até as 2h.\n\n' +
          'DO RESTAURANTE AO HOTEL são 1,9 km — três minutos de Uber, US$ 7 a 10. O carro de ' +
          'vocês passou o dia no estacionamento do hotel.\n\n' +
          'AMANHÃ É SEAWORLD: alarme às 6h45, e a mochila já está pronta.',
        restauranteId: 'r-red-lobster', endereco: '5690 W Irlo Bronson Memorial Hwy',
        localId: 'red-lobster', acesso: [], duracaoMin: 55, pesquisa: '2026-09-11' },
    ],
    naoPerca: [
      { nome: 'Central Florida Railroad Museum', quando: 'hoje', custo: 'grátis',
        motivo: 'Louça de 25 ferrovias da era de ouro dos trens de passageiros, lanternas e ' +
                'sinos de locomotiva, do outro lado da rua da feira. Abre às 10h.',
        pesquisa: '2026-09-11' },
      { nome: 'Cowbell no hóquei', quando: 'hoje',
        motivo: 'A Kia Center proíbe qualquer objeto que faça barulho, com uma exceção: o ' +
                'cowbell, e só nos jogos do Solar Bears.',
        pesquisa: '2026-09-11' },
      { nome: 'Crooked Can Brewing', quando: 'hoje',
        motivo: 'A cervejaria dentro do Plant Street Market. Para quem não estiver dirigindo.',
        pesquisa: '2026-09-11' },
    ],
    prepararAmanha: {
      paraODia: '2026-11-22',
      titulo: 'SeaWorld · portão 8h15',
      aviso: 'Vocês chegam do jogo por volta das 22h15. A mochila do SeaWorld fica pronta na ' +
             'tarde de descanso, antes de sair para o centro — não depois.',
      itens: [
        { texto: 'Mochila do SeaWorld montada ANTES de sair para o jogo', critico: true,
          motivo: 'Hoje vocês saem só com o bolso e voltam depois das 22h. Os dois soft flasks, ' +
                  'barrinhas, protetor solar, power bank, cabo e capa de chuva.' },
        { texto: 'Alarme para 6h45 nos dois celulares', critico: true,
          motivo: 'Saída 7h45 e portão às 8h15, 45 minutos antes da abertura. Depois de uma ' +
                  'noite que termina às 22h15, um alarme só falha.' },
        { texto: 'Conferir o horário de abertura do SeaWorld', critico: true,
          motivo: 'Amanhã assume abertura às 9h, pela previsão do Queue-Times. Se o oficial ' +
                  'sair diferente, a manhã inteira desloca.' },
        { texto: 'Ingresso do SeaWorld e o plano de refeição abertos nos dois celulares',
          critico: true,
          motivo: 'O portão pede o ingresso, e o almoço, o lanche e o jantar saem do plano de ' +
                  'refeição. Abram no hotel, com o Wi-Fi, e não na fila da catraca.' },
        { texto: 'Estacionamento do SeaWorld pago antes, pelo site', critico: false,
          motivo: 'US$ 37 por carro. Pago antes, a entrada do estacionamento anda mais rápido.' },
        { texto: 'Roupa que pode molhar e Ziploc para o celular', critico: false,
          motivo: 'O Journey to Atlantis molha de verdade.' },
      ],
    },
    ficha: {
      multiPass: null, singlePass: null, expressPass: null,
      custoEstimadoCasal: { min: 9, max: 15, moeda: 'USD' },
      extras: [
        { nome: 'Pedágio da SR-429, pela placa',
          custo: { min: 9, max: 15, moeda: 'USD' },
          texto: 'Ida e volta a Winter Garden. A Avis repassa cada pedágio pela placa e soma a ' +
                 'taxa de US$ 6,95 do dia. Com transponder, cada pórtico da região custa de ' +
                 'US$ 0,63 a 1,56; pela placa sai mais.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'West Orange Trail de bicicleta',
          motivo: 'Uma hora de ciclovia com bicicleta alugada. Não é objetivo da viagem, e ' +
                  'custaria a tarde de descanso de uma noite que termina às 22h15, véspera do ' +
                  'SeaWorld. A ciclovia passa pelo meio da Plant Street: vocês a veem a pé.' },
        { nome: 'Natal de Winter Garden',
          motivo: 'A decoração e o acendimento da árvore, no Light Up Winter Garden, são na ' +
                  'primeira sexta de dezembro — depois da viagem.' },
      ],
      fechado: [],
    },
  },

  /* ===== 22/11 · DOMINGO · SEAWORLD ===================================== */
  {
    id: 'd-2026-11-22',
    data: '2026-11-22',
    diaSemana: 'domingo',
    emoji: '🐋',
    titulo: 'SeaWorld',
    subtitulo: 'Montanhas-russas de manhã, orcas à tarde, Natal à noite',
    tipo: 'parque',
    operadora: 'seaworld',
    parqueId: 'seaworld',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-11',
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },
    resumo:
      'As montanhas-russas grandes e o simulador novo até as 15h30, os animais e o Orca ' +
      'Encounter à tarde, e o Natal à noite: árvores dançantes na lagoa, show no gelo e fogos ' +
      'no fechamento. O plano de refeição do ingresso cobre almoço, lanche e jantar.',
    avisos: [
      'OBJETO SOLTO É PROIBIDO NAS MONTANHAS-RUSSAS. Cada uma tem armário de US$ 2 na entrada ' +
      'da fila, e a entrada do parque tem detector de metal. Levem o mínimo.',
      'Amanhã é o Islands, com saída às 7h25. Vocês chegam dos fogos por volta das 22h: a ' +
      'mochila de amanhã fica pronta antes de dormir.',
    ],
    notas: [
      { tipo: 'atencao', texto:
        'O HORÁRIO É PREVISÃO, NÃO É OFICIAL. O calendário do Queue-Times dá 9h às 21h para ' +
        '22/11, e o site do SeaWorld ainda não publicou novembro. A referência do dia está em ' +
        '9h: se o oficial sair diferente, mudem a referência e a manhã inteira desloca junto. ' +
        'O Orca e a noite são fixos de propósito.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'CHRISTMAS CELEBRATION: roda em datas selecionadas, do começo de novembro ao começo de ' +
        'janeiro. O calendário do Queue-Times marca 22/11 como dia de evento; a confirmação ' +
        'oficial está no checklist. Os fogos do Holiday Reflections são no fechamento, em toda ' +
        'noite do evento.\n\n' +
        'Os horários dos shows só saem no app, no dia. O Orca, o show no gelo e os fogos estão ' +
        'marcados para conferir.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'O PLANO DE REFEIÇÃO É O ALL-DAY DINING DEAL: uma refeição a cada 90 minutos, do abrir ' +
        'ao fechar — um prato, um acompanhamento ou sobremesa e um refrigerante ou chá gelado. ' +
        'Vale em oito restaurantes: Voyager’s Smokehouse, Expedition Café, Captain Pete’s ' +
        'Island Hot Dogs, Seafire Grill, Lakeside Grill, Altitude Burgers, Panini Shore Café e ' +
        'Waterway Grill. Não vale para água em garrafa, bebida alcoólica nem para o Sharks ' +
        'Underwater Grill.\n\n' +
        'O dia usa três: almoço às 12h55, lanche às 16h20 e jantar às 18h05.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'DE CARRO: uns 20 minutos do hotel, e o estacionamento geral custa US$ 37. De Uber ' +
        'seriam US$ 44 a 64 ida e volta, fora a tarifa dinâmica na saída dos fogos — o carro ' +
        'sai mais barato.\n\n' +
        'O SEAWORLD NÃO TEM FILA DE SINGLE RIDER em nenhuma atração.',
        pesquisa: '2026-09-11' },
    ],
    planos: [
      { letra: 'A', titulo: 'O dia como está escrito',
        gatilho: 'O parque abre às 9h e o dia 22 tem Christmas Celebration.',
        passos: [
          'Portão às 8h15. Pipeline, Ice Breaker e Expedition Odyssey antes das 11h.',
          'Mako, Shark Encounter e Penguin Trek; almoço no Voyager’s Smokehouse às 12h55.',
          'Kraken, Journey to Atlantis e Manta à tarde, depois os animais de água rasa.',
          'Orca Encounter às 17h30, jantar no Waterway Grill e o show no gelo.',
          'Sea of Trees, fogos às 21h e saída.',
        ] },
      { letra: 'B', titulo: 'O SEAQuest abriu',
        gatilho: 'O dark ride novo, ainda sem data anunciada, já está funcionando em 22/11.',
        passos: [
          'Ele vira a maior fila do parque. Pipeline no rope drop e o SEAQuest logo depois: ele ' +
          'fica atrás do Expedition Odyssey, na mesma direção.',
          'O Ice Breaker passa para depois do Expedition Odyssey.',
          'O atraso sai da tarde: os animais de água rasa caem primeiro.',
        ] },
      { letra: 'B2', titulo: 'O parque abre às 10h',
        gatilho: 'O horário oficial sai com abertura às 10h.',
        passos: [
          'Mudem a referência para 10h: a manhã inteira desloca uma hora.',
          'A tarde perde os animais de água rasa e a pausa. O app vai avisar o aperto.',
          'O Orca, o jantar e a noite não mudam.',
        ] },
      { letra: 'C', titulo: 'Tempestade com raio',
        gatilho: 'As montanhas-russas param por causa de raio.',
        passos: [
          'Enquanto estiverem paradas, o circuito coberto é Expedition Odyssey, Shark ' +
          'Encounter, o hábitat dos pinguins e o Turtle Trek.',
          'Se esfriar, o Journey to Atlantis sai do dia.',
        ] },
      { letra: 'C2', titulo: 'Cansaço à noite',
        gatilho: 'Depois do show no gelo, o corpo pediu cama.',
        passos: [
          'Vejam o Sea of Trees e saiam por volta das 20h40, antes da multidão dos fogos.',
          'Amanhã a saída é 7h25: o que se ganha é uma hora de sono.',
        ] },
    ],
    blocos: [
      { id: 'b-2211-0745', hora: '07:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel de carro',
        descricao: '~20 min. Estacionamento geral US$ 37',
        contexto:
          'São 13 km até o SeaWorld. O estacionamento geral custa US$ 37, e pagar antes pelo ' +
          'site agiliza a entrada.',
        localId: 'seaworld', acesso: [], duracaoMin: 30, pesquisa: '2026-09-11' },

      { id: 'b-2211-0815', hora: '08:15', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão',
        descricao: 'A Pipeline fica colada na entrada. É a primeira',
        contexto:
          'Quarenta e cinco minutos antes da abertura, como manda a regra de ouro nº 1. A ' +
          'entrada tem detector de metal.\n\n' +
          'PONTO DE ENCONTRO DE HOJE: o farol do Port of Entry, logo depois da entrada. Se ' +
          'vocês se perderem, vão para lá e ESPEREM.\n\n' +
          'A Pipeline carrega devagar, e é por isso que ela vem primeiro: no rope drop a fila ' +
          'fica em 10 a 15 minutos.',
        localId: 'seaworld', acesso: [], duracaoMin: 45, pesquisa: '2026-09-11' },

      { id: 'b-2211-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Pipeline: The Surf Coaster',
        descricao: 'Rope drop. Vocês vão de pé, e o piso sobe e desce como onda',
        contexto:
          'A primeira surf coaster do mundo: vocês vão de pé numa prancha, lançados a 96 km/h, ' +
          'e o piso se mexe sob os pés simulando a onda. Quase dois minutos.\n\n' +
          'POR QUE PRIMEIRO: carrega devagar e a fila cresce rápido. No rope drop são 10 a 15 ' +
          'minutos; no resto do dia, 27 de média.\n\n' +
          'Altura máxima de 1,98 m. Nada solto: armário de US$ 2 na entrada da fila.',
        areaParque: 'Entrada e Pipeline', acesso: ['rope-drop', 'standby'], locker: true,
        duracaoMin: 30,
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu em 27/05/2023, anunciada como a primeira surf coaster do mundo, e é ' +
                   'a primeira montanha-russa de pé construída desde 1999. Diferente das ' +
                   'antigas, o apoio sobe e desce durante o percurso.',
            fonte: 'Wikipedia — Pipeline: The Surf Coaster', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2211-0935', hora: '09:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Ice Breaker',
        descricao: 'Lançamentos para frente e para trás. Colada na Pipeline',
        contexto:
          'Montanha-russa de lançamento: acelera para frente, volta de ré e repete até vencer ' +
          'a rampa.\n\n' +
          'A fila média do dia é de 22 minutos, e à tarde fica em 30 a 45. De manhã, a cinco ' +
          'minutos da Pipeline, sai barata.\n\n' +
          'Nada solto: armário de US$ 2 na entrada da fila.',
        areaParque: 'Ice Breaker e Bayside Stadium', acesso: ['standby'], locker: true, duracaoMin: 30,
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu em 18/02/2022 e tem a queda mais inclinada da Flórida: o pico de 28 ' +
                   'metros passa da vertical, com 100 graus.',
            fonte: 'Wikipedia — Ice Breaker (roller coaster)', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2211-1005', hora: '10:05', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Expedition Odyssey: Fire & Ice',
        descricao: 'A maior fila do parque. Simulador, com belugas e morsas na saída',
        contexto:
          'Simulador de voo numa expedição ao Ártico, com pré-show e filme novo: a versão Fire ' +
          '& Ice abriu em 25/05/2026. O circuito termina com animais de verdade, belugas e ' +
          'morsas — não passem direto.\n\n' +
          'POR QUE DE MANHÃ: é a maior fila do parque, 46 minutos de média e 81 de pico médio. ' +
          'Como fica ao lado do Ice Breaker, entra no começo do dia sem custar caminhada.\n\n' +
          'Intensidade de família. Altura mínima de 99 cm.',
        areaParque: 'Ice Breaker e Bayside Stadium', acesso: ['standby'], duracaoMin: 45, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'O simulador abriu em 09/05/2025, no lugar do Wild Arctic, e menos de um ' +
                   'ano depois ganhou a versão Fire & Ice, que termina nas belugas e morsas de ' +
                   'verdade.',
            fonte: 'Spectrum News 13; FOX 35 Orlando', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2211-1105', hora: '11:05', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mako',
        descricao: 'A mais alta e rápida de Orlando. Hipercoaster, feita para flutuar',
        contexto:
          'Hipercoaster: sem inversões, feita para dar airtime — a sensação de sair do banco ' +
          'nas descidas. 61 metros e 118 km/h.\n\n' +
          'Não precisa de manhã: a fila média do dia é de 13 minutos.\n\n' +
          'São onze minutos a pé do Expedition Odyssey, passando pelo estádio do Orca. Nada ' +
          'solto: armário de US$ 2 na entrada da fila.',
        areaParque: 'Mako e Shark Encounter', acesso: ['standby'], locker: true, duracaoMin: 30,
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'É a mais alta, a mais rápida e a mais longa de Orlando, com 1,45 km de ' +
                   'trilho e nove momentos em que o corpo sai do banco. O nome vem do ' +
                   'tubarão-mako, o mais rápido dos tubarões.',
            fonte: 'Wikipedia — Mako (roller coaster)', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2211-1135', hora: '11:35', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Dez minutos. Banheiro ao lado do Sharks Underwater Grill',
        contexto:
          'Três montanhas-russas e o Expedition Odyssey desde as 9h, e o almoço só às 12h55. Sentem dez minutos antes do túnel dos tubarões, que é caminhada.',
        areaParque: 'Mako e Shark Encounter', acesso: [], duracaoMin: 10, pesquisa: '2026-09-12' },

      { id: 'b-2211-1145', hora: '11:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Shark Encounter',
        descricao: 'Túnel de acrílico dentro do tanque de tubarões',
        contexto:
          'Um túnel que passa por dentro do tanque, com os tubarões em volta. É a mesma vista ' +
          'do Sharks Underwater Grill, sem a conta.\n\n' +
          'É caminhar e parar onde quiserem.',
        areaParque: 'Mako e Shark Encounter', acesso: [], duracaoMin: 20, pesquisa: '2026-09-11' },

      { id: 'b-2211-1210', hora: '12:10', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Penguin Trek',
        descricao: 'Montanha-russa de lançamento que termina no hábitat dos pinguins',
        contexto:
          'Montanha-russa de família em carrinhos de snowmobile, com lançamento, que termina ' +
          'dentro do hábitat gelado dos pinguins de verdade. A graça é a mistura de ' +
          'montanha-russa com aquário.\n\n' +
          'É a segunda maior fila do parque, 35 minutos de média. Levem algo de manga longa: o ' +
          'hábitat é mantido a poucos graus.',
        areaParque: 'Penguin Trek', acesso: ['standby'], duracaoMin: 40, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu em 07/07/2024, no lugar do Antarctica: Empire of the Penguin ' +
                   '(2013–2020). É da B&M, a mesma fabricante da Mako, do Kraken e da Manta.',
            fonte: 'Wikipedia — Penguin Trek', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2211-1255', hora: '12:55', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Voyager’s Smokehouse',
        descricao: 'Churrasco defumado. Plano de refeição',
        contexto:
          'Churrasco americano no Waterfront: brisket texano, costela St. Louis, frango ' +
          'defumado e sanduíches de peru e de porco desfiado.\n\n' +
          'PLANO DE REFEIÇÃO: um prato, um acompanhamento ou sobremesa e um refrigerante. A ' +
          'próxima refeição do plano só libera 90 minutos depois, a partir das 14h25.',
        restauranteId: 'r-voyagers', areaParque: 'Waterfront e Sky Tower', acesso: [], duracaoMin: 50,
        pesquisa: '2026-09-11' },

      { id: 'b-2211-1350', hora: '13:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Kraken',
        descricao: 'Sem piso, sete inversões. A fila mais curta das grandes',
        contexto:
          'A única montanha-russa sem piso de Orlando: os pés ficam soltos no ar. 47 metros, ' +
          '105 km/h e sete inversões em dois minutos.\n\n' +
          'A fila média do dia é de 10 minutos, a menor entre as montanhas-russas grandes — por ' +
          'isso ela fica para depois do almoço.\n\n' +
          'Nada solto: armário de US$ 2 na entrada da fila.',
        areaParque: 'Kraken e Atlantis', acesso: ['standby'], locker: true, duracaoMin: 25,
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Quando abriu, em 2000, era a segunda montanha-russa sem piso mais longa do ' +
                   'mundo. Tem três mergulhos em túneis subterrâneos, a “toca” do monstro.',
            fonte: 'Wikipedia — Kraken (roller coaster)', pesquisa: '2026-09-15' },
          { texto: 'Em 2017 ganhou óculos de realidade virtual, que saíram em 2018 porque ' +
                   'travavam a fila.',
            fonte: 'Wikipedia — Kraken (roller coaster)', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2211-1420', hora: '14:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Journey to Atlantis',
        descricao: 'Molha bastante. Na hora mais quente do dia, de propósito',
        contexto:
          'Barco que vira montanha-russa: uma queda grande molhada e um trecho seco no escuro.\n\n' +
          'MOLHA DE VERDADE. Está às 14h20 porque é a hora mais quente do dia, e sobra a tarde ' +
          'inteira para secar antes de escurecer. Capa de chuva, e o celular no Ziploc ou no ' +
          'armário de US$ 2.\n\n' +
          'Fila média de 21 minutos.',
        areaParque: 'Kraken e Atlantis', acesso: ['standby'], molha: true, locker: true,
        duracaoMin: 35,
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu em 17/04/1998, com uma queda de 18 metros. Os efeitos da sereia ' +
                   'Allura e do cavalo-marinho Hermes foram desligados em 2017.',
            fonte: 'Wikipedia — Journey to Atlantis', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2211-1500', hora: '15:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Manta',
        descricao: 'Montanha-russa voadora: vocês vão de bruços, rasando a água',
        contexto:
          'A única montanha-russa voadora da Flórida: o banco gira e vocês ficam de barriga ' +
          'para baixo, braços soltos, passando rente à água. 43 metros, 90 km/h e quatro ' +
          'inversões.\n\n' +
          'Fila média de 19 minutos. Nada solto: armário de US$ 2 na entrada da fila.',
        areaParque: 'Manta e Dolphin Stadium', acesso: ['standby'], locker: true, duracaoMin: 30,
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu em 22/05/2009. No giro sobre o lago, jatos de água sobem perto do ' +
                   'trem para parecer que ele tocou a água, e a fila passa por dez aquários ' +
                   'com mais de 300 arraias.',
            fonte: 'Wikipedia — Manta (SeaWorld Orlando)', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2211-1535', hora: '15:35', ancora: 'referencia', tipo: 'livre',
        titulo: 'Tartarugas, golfinhos e arraias',
        descricao: 'Turtle Trek, golfinhos e o tanque de arraias. Sem fila',
        contexto:
          'Em volta do Manta e do Dolphin Stadium ficam os animais de água rasa: o Turtle Trek, com o domo de ' +
          'filme e as tartarugas e peixes-boi resgatados, o tanque de arraias e os golfinhos.\n\n' +
          'DOLPHIN ADVENTURES: o show dos golfinhos é no Dolphin Stadium, aqui ao lado. Em 2025 ' +
          'era às 11h e às 15h; se no dia houver sessão perto das 15h30, é aqui que ela cabe.',
        areaParque: 'Manta e Dolphin Stadium', acesso: [], duracaoMin: 40, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'O SeaWorld Orlando tem a maior operação de resgate de peixes-boi dos ' +
                   'Estados Unidos, e a rede já passou de 43 mil animais resgatados em mais de ' +
                   '60 anos.',
            fonte: 'SeaWorld; PR Newswire', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2211-1620', hora: '16:20', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Pausa e lanche no Waterfront',
        descricao: 'Segunda refeição do plano. Banheiro junto do Sky Tower',
        contexto:
          'O lanche entra no plano de refeição: os 90 minutos desde o almoço já passaram. O ' +
          'Seafire Grill e o Lakeside Grill ficam por aqui.\n\n' +
          'HÁ UM CHICK-FIL-A DENTRO DO PARQUE, perto do Orca Stadium e do Sesame Street — ' +
          'está no mapa oficial. Pelo que o mapa mostra, ele fica fora do plano de refeição; ' +
          'confiram no app do SeaWorld. Se quiserem, é o lanche desta pausa, pago à parte.\n\n' +
          'É a última parada antes de uma noite longa, que só termina depois dos fogos das ' +
          '21h.\n\n' +
          'O SHOW DOS LEÕES-MARINHOS é no estádio ao lado. Em 2025 era às 14h e às 16h; se ' +
          'houver sessão nesta hora, cabe.',
        areaParque: 'Waterfront e Sky Tower', acesso: [], duracaoMin: 35, pesquisa: '2026-09-11' },

      { id: 'b-2211-1710', hora: '17:10', ancora: 'fixo', tipo: 'show',
        titulo: 'Orca Encounter',
        descricao: 'O show das orcas. Cheguem 20 min antes; as primeiras fileiras molham',
        contexto:
          'Apresentação de 30 minutos com as orcas, no estádio do fundo do parque. É o clássico ' +
          'do SeaWorld.\n\n' +
          'HORÁRIO A CONFIRMAR: em 2025 as sessões eram às 12h e às 17h30. O bloco assume ' +
          '17h30 — a grade do dia sai no app, confiram de manhã.\n\n' +
          'Cheguem 20 minutos antes: os bons lugares acabam rápido. As primeiras fileiras são a ' +
          'zona molhada, e ela é real.',
        areaParque: 'Orca Stadium', acesso: [], confirmarHorario: true, critico: true,
        duracaoMin: 50, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'O Orca Encounter substituiu o show teatral One Ocean em 01/01/2020, depois ' +
                   'que o SeaWorld encerrou a reprodução de orcas, em 2016. Não nascem mais ' +
                   'orcas na rede: as do parque são a última geração.',
            fonte: 'NPR; National Geographic; NBC News', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2211-1805', hora: '18:05', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Waterway Grill',
        descricao: 'Churrasco, frango com sofrito ou pernil. Plano de refeição',
        contexto:
          'A terceira refeição do plano: churrasco grelhado, frango com sofrito, porco assado ' +
          'devagar ou tiras de frango.\n\n' +
          'Fica a quatro minutos do estádio do Orca, e é onde o Papai Noel recebe visitas no ' +
          'Natal.',
        restauranteId: 'r-waterway', areaParque: 'Sesame Street e Waterway Grill', acesso: [], duracaoMin: 55,
        pesquisa: '2026-09-11' },

      { id: 'b-2211-1910', hora: '19:10', ancora: 'fixo', tipo: 'show',
        titulo: 'Winter Wonderland on Ice',
        descricao: 'Show de patinação no Bayside Stadium, de frente para a lagoa',
        contexto:
          'Patinação no gelo em estilo Broadway, com clássicos de Natal, no estádio que dá para ' +
          'a lagoa. Antes dos patinadores, um violinista toca um repertório natalino.\n\n' +
          'HORÁRIO A CONFIRMAR: as sessões do dia só aparecem no app. O bloco assume uma sessão ' +
          'por volta das 19h10; se for outra, troquem de lugar com o Sea of Trees, que roda a ' +
          'noite toda.',
        areaParque: 'Ice Breaker e Bayside Stadium', acesso: [], confirmarHorario: true, duracaoMin: 40,
        pesquisa: '2026-09-11' },

      { id: 'b-2211-2000', hora: '20:00', ancora: 'fixo', tipo: 'show',
        titulo: 'Sea of Trees e o Waterfront aceso',
        descricao: 'Árvores que dançam com música sobre a lagoa',
        contexto:
          'Árvores de Natal iluminadas que dançam com músicas natalinas sobre a lagoa, com uma ' +
          'central de 21 metros. Roda a noite toda. Os pontos indicados para ver são o ' +
          'Waterfront, o Bayside Stadium e o caminho do Orca.\n\n' +
          'NO CAMINHO, perto da entrada: a Rudolph’s Christmas Town, no caminho da Pipeline, com ' +
          'o Rudolph e o Bumble para foto.',
        areaParque: 'Waterfront e Sky Tower', acesso: [], duracaoMin: 40, pesquisa: '2026-09-11' },

      { id: 'b-2211-2040', hora: '20:40', ancora: 'fixo', tipo: 'espera',
        titulo: 'Lugar para os fogos',
        descricao: 'Beira da lagoa, no Waterfront',
        contexto:
          'Os fogos são sobre a lagoa. Escolham o ponto na beira do Waterfront com calma, ' +
          'enquanto ainda há espaço.',
        areaParque: 'Waterfront e Sky Tower', acesso: [], duracaoMin: 20 },

      { id: 'b-2211-2100', hora: '21:00', ancora: 'fixo', tipo: 'show',
        titulo: 'Holiday Reflections',
        descricao: 'Fogos de Natal no fechamento, sobre a lagoa',
        contexto:
          'O final da noite: fogos sobre a lagoa no fechamento do parque, em toda noite da ' +
          'Christmas Celebration.\n\n' +
          'HORA A CONFIRMAR: o bloco segue o fechamento previsto, às 21h.',
        areaParque: 'Waterfront e Sky Tower', acesso: [], confirmarHorario: true, critico: true,
        duracaoMin: 15, pesquisa: '2026-09-11' },

      { id: 'b-2211-2115', hora: '21:15', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Saída',
        descricao: 'Carro no estacionamento. Hotel por volta das 22h',
        contexto:
          'O parque inteiro sai junto depois dos fogos, e a fila de carros do estacionamento ' +
          'entra na conta: por isso a volta tem 45 minutos para uma estrada de 20.\n\n' +
          'AMANHÃ É ISLANDS: saída às 7h25, alarme às 6h25.',
        acesso: [], duracaoMin: 45 },
    ],
    naoPerca: [
      { nome: 'Sea of Trees', quando: 'hoje', custo: 'incluso',
        motivo: 'Árvores que dançam com música sobre a lagoa, com uma de 21 metros no centro. ' +
                'Roda a noite toda.',
        pesquisa: '2026-09-11' },
      { nome: 'Holiday Reflections', quando: 'hoje', custo: 'incluso',
        motivo: 'Os fogos de Natal no fechamento, sobre a lagoa.',
        pesquisa: '2026-09-11' },
      { nome: 'Belugas e morsas', quando: 'hoje', custo: 'incluso',
        motivo: 'Ficam no fim do circuito do Expedition Odyssey — não passem direto.',
        pesquisa: '2026-09-11' },
      { nome: 'Papai Noel no Waterway Grill', quando: 'hoje', custo: 'incluso',
        motivo: 'É onde ele recebe visitas no Natal, e é o restaurante do jantar.',
        pesquisa: '2026-09-11' },
      { nome: 'Sharks Underwater Grill', quando: 'descartado', custo: 'fora do plano de refeição',
        motivo: 'Fica de fora. Mesa colada no tanque de tubarões, mas paga à parte — o ' +
                'filé custa uns US$ 49 — enquanto o plano de refeição já cobre o jantar. A mesma ' +
                'vista está no Shark Encounter.',
        pesquisa: '2026-09-11' },
    ],
    prepararAmanha: {
      paraODia: '2026-11-23',
      titulo: 'Busch Gardens Tampa · saída 7h30',
      aviso: 'Amanhã é o dia mais pesado fisicamente da viagem, com 1h25 de estrada para cada ' +
             'lado. Vocês chegam do Islands por volta das 21h30: durmam cedo.',
      itens: [
        { texto: 'Alarme para 6h30 nos dois celulares', critico: true,
          motivo: 'Café do hotel às 7h e estrada às 7h30, para chegar ao portão 45 minutos ' +
                  'antes da abertura.' },
        { texto: 'Conferir o horário de abertura do Busch Gardens', critico: true,
          motivo: 'Amanhã assume abertura às 10h, ainda sem confirmação. Se for outro horário, ' +
                  'a saída muda junto.' },
        { texto: 'Ingresso do Busch Gardens e o plano de refeição no celular', critico: true,
          motivo: 'É o mesmo ingresso do SeaWorld, com o plano de refeição incluso.' },
        { texto: 'Combustível para 218 km: abaixo da metade do tanque, abasteçam na volta',
          critico: false,
          motivo: 'Amanhã são 109 km até Tampa e 109 de volta, com a estrada às 7h30 e sem ' +
                  'tempo para posto. No posto, paguem dentro da loja: a bomba pede o ZIP code ' +
                  'do cartão.' },
      ],
    },
    ficha: {
      multiPass: null, singlePass: null, expressPass: null,
      custoEstimadoCasal: { min: 37, max: 47, moeda: 'USD' },
      extras: [
        { nome: 'Estacionamento geral',
          custo: { min: 37, max: 37, moeda: 'USD' },
          texto: 'US$ 37 por carro. Pagar antes pelo site agiliza a entrada.' },
        { nome: 'Armários das montanhas-russas',
          custo: { min: 0, max: 10, moeda: 'USD' },
          texto: 'US$ 2 pelas primeiras duas horas, na entrada da Pipeline, Ice Breaker, Mako, ' +
                 'Kraken, Manta e Journey to Atlantis. O de uso múltiplo, que muda de atração o ' +
                 'dia inteiro, custa US$ 10. Um armário serve para os dois.' },
        { nome: 'Plano de refeição',
          texto: 'Incluso no ingresso: uma refeição a cada 90 minutos em oito restaurantes. O ' +
                 'dia usa três.' },
        { nome: 'Quick Queue — não',
          custo: { min: 0, max: 0, moeda: 'USD' },
          texto: 'Domingo de lotação média, e as três filas longas do parque caem na manhã. E o ' +
                 'Quick Queue ilimitado só dá uma passagem na Pipeline, no Penguin Trek e no ' +
                 'Expedition Odyssey.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Infinity Falls', motivo: 'Molha demais, e a noite de novembro esfria.' },
        { nome: 'Sesame Street Land', motivo: 'Área infantil.' },
        { nome: 'Sky Tower', motivo: 'Pago à parte.' },
        { nome: 'O Wondrous Night',
          motivo: 'Show de corais no Nautilus Theater, na mesma faixa da noite que o show no ' +
                  'gelo.' },
      ],
      fechado: [],
    },
  },

  /* ===== 23/11 · SEGUNDA · BUSCH GARDENS TAMPA ============================ */
  {
    id: 'd-2026-11-23',
    data: '2026-11-23',
    diaSemana: 'segunda',
    emoji: '🎢',
    titulo: 'Busch Gardens Tampa',
    subtitulo: 'O melhor conjunto de montanhas-russas da Flórida',
    tipo: 'parque',
    operadora: 'busch',
    parqueId: 'busch-gardens',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-11',
    referencia: { rotulo: 'Abertura do parque', padrao: '10:00', confirmado: false },
    resumo:
      'Só de carro, 1h25 de cada lado. Cinco montanhas-russas e a torre de queda até o meio ' +
      'da tarde, o trem pela planície dos animais e o Natal à noite, com mais duas voltas no ' +
      'escuro antes da estrada. O dia mais pesado fisicamente da viagem.',
    avisos: [
      'OBJETO SOLTO É PROIBIDO EM NOVE ATRAÇÕES, entre elas todas as montanhas-russas do dia, ' +
      'e a Iron Gwazi tem detector de metal. O armário custa US$ 4 por duas horas, ou US$ 12 ' +
      'o dia inteiro trocando de atração. Levem o mínimo: o resto fica no carro.',
      'Vocês chegam ao hotel por volta das 22h15, e amanhã é o único dia sem hora marcada ' +
      'da segunda semana.',
    ],
    notas: [
      { tipo: 'atencao', texto:
        'O HORÁRIO DE 24/11 AINDA NÃO SAIU. A referência está em 10h, a abertura de novembro. ' +
        'No Natal de 2025 o parque ficou aberto das 10h às 22h na maioria dos dias, com alguns ' +
        'dias de semana fechando às 20h — e 24/11 é uma terça. Se fechar às 20h, vale o plano ' +
        'B2.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'CHRISTMAS TOWN: datas selecionadas de 13/11/2026 a 04/01/2027, incluso no ingresso. ' +
        'Em 2025 teve Christmas on Ice no Moroccan Palace, show de luzes no Serengeti e um show ' +
        'de drones, o Holiday Skies Spectacular. Os horários do dia só saem perto da data, e a ' +
        'confirmação de que 24/11 está na lista está no checklist.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'AS FILAS DO BUSCH SÃO CURTAS. A média de 2026 vai de 33 minutos no Cheetah Hunt a 7 ' +
        'na Falcon’s Fury — por isso não há Quick Queue. A previsão de lotação para 24/11 é ' +
        'de 66%, ' +
        'alta para uma terça, por ser semana de Thanksgiving.\n\n' +
        'O QUE FECHOU: o Kumba parou em 02/08/2026, e o Kumba’s Revenge, que vai no lugar, não ' +
        'tem data. A Stanley Falls fechou em setembro de 2025 e a Scorpion em 2024.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'O PLANO DE REFEIÇÃO é o mesmo do SeaWorld: uma refeição a cada 90 minutos — prato, ' +
        'acompanhamento ou sobremesa e refrigerante. Vale no Zagora Café, Zambia Smokehouse, ' +
        'Dragon Fire Grill & Pub, Oasis Pizza, BG Cuban Café, SheiKra Eats, Tot Topia e ' +
        'Twisted Tails Pretzels.\n\n' +
        'ESTACIONAMENTO: US$ 32 mais imposto, do outro lado da McKinley Drive. Até o portão são ' +
        'uns 800 metros, 10 a 15 minutos a pé pelo túnel; o bondinho grátis pode não rodar em ' +
        'dia de semana.',
        pesquisa: '2026-09-11' },
    ],
    planos: [
      { letra: 'A', titulo: 'O dia como está escrito',
        gatilho: 'O parque abre às 10h, fecha depois das 20h30 e 23/11 tem Christmas Town.',
        passos: [
          'Café do hotel às 7h, estrada às 7h30 e portão às 9h15.',
          'Iron Gwazi, Cheetah Hunt e Montu de manhã; Falcon’s Fury e SheiKra antes do almoço.',
          'Almoço no Zambia Smokehouse, Tigris, o trem pelo Serengeti e um lanche.',
          'Christmas on Ice, jantar no Dragon Fire e o show de luzes no Serengeti.',
          'Cheetah Hunt e Iron Gwazi à noite, e estrada às 20h30.',
        ] },
      { letra: 'B', titulo: '24/11 não tem Christmas Town',
        gatilho: 'O calendário oficial não inclui 24/11.',
        passos: [
          'O show no gelo e as luzes saem. O jantar no Dragon Fire fica.',
          'Façam o Cheetah Hunt e a Iron Gwazi logo depois do jantar e peguem a estrada por ' +
          'volta das 19h30.',
        ] },
      { letra: 'B2', titulo: 'O parque fecha às 20h',
        gatilho: 'O horário oficial sai com fechamento às 20h.',
        passos: [
          'A Iron Gwazi noturna sai.',
          'O Cheetah Hunt às 19h10 continua: entrem na fila antes do fechamento.',
        ] },
      { letra: 'C', titulo: 'Tempestade com raio',
        gatilho: 'As montanhas-russas param por causa de raio.',
        passos: [
          'Enquanto estiverem paradas, fiquem no coberto: o Moroccan Palace, do show no gelo, e ' +
          'os restaurantes.',
        ] },
      { letra: 'C2', titulo: 'Cansaço',
        gatilho: 'O corpo pediu para ir embora mais cedo.',
        passos: [
          'As duas voltas noturnas caem primeiro. Estrada logo depois do jantar.',
          'São 1h25 de volta: quem dirige precisa estar inteiro.',
        ] },
    ],
    blocos: [
      { id: 'b-2311-0700', hora: '07:00', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Café da manhã do hotel',
        descricao: 'Rápido: a estrada é às 7h30',
        contexto:
          'O café do hotel abre às 7h, segundo os sites de reserva, e dá tempo de comer antes ' +
          'de uma estrada de 1h25. Se ainda estiver fechado, as barrinhas da lista do Walmart ' +
          'seguram até o parque.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 25 },

      { id: 'b-2311-0730', hora: '07:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Estrada para Tampa',
        descricao: '1h25, 109 km pela I-4. Estacionamento US$ 32 + imposto',
        contexto:
          'São 109 km até o Busch Gardens, 1h25 sem trânsito. O bloco tem 1h45 porque inclui ' +
          'estacionar e chegar ao portão.\n\n' +
          'O ESTACIONAMENTO fica do outro lado da McKinley Drive, a uns 800 metros do portão: ' +
          '10 a 15 minutos a pé, pelo túnel. O bondinho grátis pode não rodar em dia de semana. ' +
          'Custa US$ 32 mais imposto.',
        localId: 'busch-gardens', acesso: [], duracaoMin: 105, pesquisa: '2026-09-11' },

      { id: 'b-2311-0915', hora: '09:15', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão',
        descricao: '45 min antes. A Iron Gwazi fica logo depois da entrada',
        contexto:
          'A entrada é pelo Morocco, e a Iron Gwazi fica a poucos passos. Detector de metal na ' +
          'entrada.\n\n' +
          'PONTO DE ENCONTRO DE HOJE: o Guest Relations, logo depois da entrada, no Morocco. Se ' +
          'vocês se perderem, vão para lá e ESPEREM.\n\n' +
          'MOCHILA MÍNIMA: objeto solto é proibido nas montanhas-russas, e cada armário avulso ' +
          'custa US$ 4 pelas primeiras duas horas.',
        localId: 'busch-gardens', acesso: [], duracaoMin: 45, pesquisa: '2026-09-11' },

      { id: 'b-2311-1000', hora: '10:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Iron Gwazi',
        descricao: 'Rope drop. Híbrida de 63 m, queda de 91°, 122 km/h',
        contexto:
          'Montanha-russa híbrida — estrutura de madeira com trilho de aço — com 63 metros, ' +
          'queda de 91°, mais que vertical, 122 km/h e duas inversões. É a híbrida mais alta da ' +
          'América do Norte.\n\n' +
          'POR QUE PRIMEIRO: fica na entrada e é a que mais disputa o rope drop. A fila média de ' +
          '2026 é de 23 minutos, com pico de 46.\n\n' +
          'DETECTOR DE METAL: nada nos bolsos, nem celular nem chave do carro. O armário é ' +
          'pago e obrigatório — US$ 4 por duas horas, ou o do dia inteiro, que muda de ' +
          'atração.',
        areaParque: 'Morocco', acesso: ['rope-drop', 'standby'], locker: 'detector',
        duracaoMin: 40,
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Aproveitou a estrutura do Gwazi, montanha-russa de madeira de 1999 fechada ' +
                   'em 2015, que ganhou trilho de aço da Rocky Mountain Construction. A ' +
                   'pandemia adiou a inauguração até 11/03/2022.',
            fonte: 'Wikipedia — Iron Gwazi', pesquisa: '2026-09-15' },
          { texto: 'Além de a mais alta da América do Norte, é a híbrida mais rápida e mais ' +
                   'inclinada do mundo, e ganhou o Golden Ticket de melhor montanha-russa ' +
                   'nova.',
            fonte: 'Wikipedia — Iron Gwazi', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2311-1045', hora: '10:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Cheetah Hunt',
        descricao: 'Três lançamentos e 1,3 km de percurso. A maior fila média do parque',
        contexto:
          'Três lançamentos seguidos, até 97 km/h, num percurso de 1,3 km com uma inversão.\n\n' +
          'É a maior fila média do Busch em 2026: 33 minutos, com pico de 56. Por isso vem logo ' +
          'depois da Iron Gwazi, a dois minutos a pé.\n\n' +
          'Nada solto: armário obrigatório.',
        areaParque: 'Edge of Africa', acesso: ['standby'], locker: true, duracaoMin: 45,
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu em 27/05/2011, junto com o Cheetah Run, a área ao lado em que ' +
                   'guepardos correm numa pista de 67 metros, com vidros para ver de perto.',
            fonte: 'Wikipedia — Cheetah Hunt', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2311-1135', hora: '11:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Montu',
        descricao: 'Invertida, pés soltos, sete inversões. Clássica de 1996',
        contexto:
          'Montanha-russa invertida: vocês vão pendurados, com os pés soltos. 46 metros, 97 km/h ' +
          'e sete inversões em uns três minutos. Quando abriu, em 1996, era a invertida mais alta ' +
          'e rápida do mundo.\n\n' +
          'Fila média de 12 minutos. Nada solto: armário obrigatório.',
        areaParque: 'Egypt', acesso: ['standby'], locker: true, duracaoMin: 30,
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'O nome é do deus egípcio da guerra, representado com cabeça de falcão. A ' +
                   'pista mergulha duas vezes em trincheiras abaixo do chão, e ela foi a ' +
                   'primeira invertida com sete inversões.',
            fonte: 'Wikipedia — Montu (roller coaster)', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2311-1220', hora: '12:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Falcon’s Fury',
        descricao: 'Torre de 102 m. No topo, o assento inclina e vocês caem olhando o chão',
        contexto:
          'Torre de queda de 102 metros. No topo, os assentos inclinam 90° para a frente e vocês ' +
          'caem de cara para o chão — cerca de cinco segundos de queda livre, a 97 km/h.\n\n' +
          'São onze minutos a pé do Montu, passando pela Nairobi. Fila média de 7 minutos. Nada ' +
          'solto: armário obrigatório.',
        areaParque: 'Pantopia', acesso: ['standby'], locker: true, duracaoMin: 20,
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu em 02/09/2014, com quatro meses de atraso por problemas nos cabos, e ' +
                   'foi a primeira torre de queda do mundo com assentos que inclinam de cara ' +
                   'para o chão.',
            fonte: 'Wikipedia — Falcon’s Fury', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2311-1240', hora: '12:40', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Dez minutos. Banheiro ao lado do Dragon Fire Grill',
        contexto:
          'Cinco montanhas-russas seguidas desde as 10h, cada uma com armário. Dez minutos sentados em Pantopia antes do SheiKra e do almoço.',
        areaParque: 'Pantopia', acesso: [], duracaoMin: 10, pesquisa: '2026-09-12' },

      { id: 'b-2311-1255', hora: '12:55', ancora: 'referencia', tipo: 'atracao',
        titulo: 'SheiKra',
        descricao: 'Para quatro segundos na beirada e cai a 90°',
        contexto:
          'Dive coaster: o trem para na beirada, pendurado a 61 metros, por uns quatro segundos, ' +
          'e cai na vertical. Depois vêm um loop, uma segunda queda a 90° para dentro de um túnel ' +
          'e uma passagem rente à água que levanta um paredão de spray.\n\n' +
          'Fila média de 10 minutos. Nada solto: armário obrigatório.',
        areaParque: 'Stanleyville', acesso: ['standby'], locker: true, duracaoMin: 30,
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu em 21/05/2005 como a primeira dive coaster da América do Norte e ' +
                   'ganhou trens sem piso em 2007. O nome vem do shikra, um gavião da Ásia e ' +
                   'da África que mergulha na vertical atrás da presa.',
            fonte: 'Wikipedia — SheiKra', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2311-1325', hora: '13:25', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Zambia Smokehouse',
        descricao: 'Churrasco, ao lado do SheiKra. Plano de refeição',
        contexto:
          'Churrasco com a grelha à vista: costela, brisket e frango defumado. Fica em ' +
          'Stanleyville, ao lado do SheiKra.\n\n' +
          'PLANO DE REFEIÇÃO: um prato, um acompanhamento ou sobremesa e um refrigerante. A ' +
          'próxima refeição do plano só libera 90 minutos depois.',
        restauranteId: 'r-zambia', areaParque: 'Stanleyville', acesso: [], duracaoMin: 55,
        pesquisa: '2026-09-11' },

      { id: 'b-2311-1420', hora: '14:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Tigris',
        descricao: 'Três lançamentos, para frente e para trás, até 100 km/h',
        contexto:
          'Montanha-russa de lançamento que vai e volta: três lançamentos, 46 metros e 100 km/h, ' +
          'com um giro de cabeça para baixo. Curta e intensa.\n\n' +
          'Fila média de 18 minutos. Nada solto: armário obrigatório.',
        areaParque: 'Stanleyville', acesso: ['standby'], locker: true, duracaoMin: 30,
        pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'Abriu em 19/04/2019 como a montanha-russa de lançamento mais alta da ' +
                   'Flórida, no lugar do Tanganyika Tidal Wave, e reaproveitou até o ' +
                   'paisagismo do caminho da fila.',
            fonte: 'Wikipedia — Tigris (roller coaster)', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2311-1455', hora: '14:55', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Serengeti Express',
        descricao: 'O trem dá a volta de 3,5 km pela planície dos animais',
        contexto:
          'Trem que dá a volta pelo parque e atravessa a planície do Serengeti, com girafas, ' +
          'zebras, antílopes e avestruzes soltos. Estações em Stanleyville, Congo e Nairobi.\n\n' +
          'É a parte dos animais do dia, sentados — e a pausa das pernas antes da noite. A ' +
          'duração da volta não é publicada: o bloco assume uns 40 minutos com a espera.',
        areaParque: 'Stanleyville', acesso: ['standby'], duracaoMin: 40, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'A planície do Serengeti tem 26 hectares, com manadas soltas de girafas, ' +
                   'zebras, antílopes e avestruzes.',
            fonte: 'Busch Gardens; Orlando Informer', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2311-1540', hora: '15:40', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Pausa e lanche',
        descricao: 'Segunda refeição do plano, em Stanleyville. Banheiro ao lado da estação do trem',
        contexto:
          'Os 90 minutos do almoço já passaram: o lanche entra no plano. O SheiKra Eats e o ' +
          'Zambia ficam aqui.\n\n' +
          'É a última parada antes da noite, que termina com a estrada de volta.',
        areaParque: 'Stanleyville', acesso: [], duracaoMin: 20, pesquisa: '2026-09-11' },

      { id: 'b-2311-1605', hora: '16:05', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Skyride — de Stanleyville ao Edge of Africa',
        descricao: 'Teleférico por cima do parque. Desce ao lado do Cheetah Hunt',
        contexto:
          'O Skyride liga Stanleyville ao Edge of Africa por cima do parque, e desce a dois ' +
          'minutos do Morocco, onde é o show. É o atalho que evita a volta a pé pela Sesame ' +
          'Street e pela Bird Gardens — está no mapa oficial.\n\n' +
          'SE ESTIVER PARADO — vento fecha teleférico —, a pé são uns 14 minutos pelo caminho ' +
          'de sempre, e o show das 16h20 fica apertado: cheguem como der.',
        areaParque: 'Edge of Africa', acesso: [], duracaoMin: 10, pesquisa: '2026-09-12' },

      { id: 'b-2311-1620', hora: '16:20', ancora: 'fixo', tipo: 'show',
        titulo: 'Christmas on Ice',
        descricao: 'Show de patinação de 30 min no Moroccan Palace. Cheguem cedo',
        contexto:
          'Patinação no gelo com músicas de Natal, no teatro do Morocco, perto da entrada. ' +
          'Cerca de 30 minutos.\n\n' +
          'HORÁRIO A CONFIRMAR: em 2025 havia várias sessões por dia, a primeira por volta das ' +
          '14h. O teatro enche, e a recomendação é chegar bem antes — o bloco reserva 45 minutos ' +
          'por isso.\n\n' +
          'De Stanleyville, o Skyride deixa vocês a dois minutos daqui. A pé seriam 14, pela ' +
          'Sesame Street e pela Bird Gardens.',
        areaParque: 'Morocco', acesso: [], confirmarHorario: true, duracaoMin: 45,
        pesquisa: '2026-09-11' },

      { id: 'b-2311-1720', hora: '17:20', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Dragon Fire Grill & Pub',
        descricao: 'Salão coberto, de balcão. Dentro do plano de refeição',
        contexto:
          'Salão grande em estilo market: cada um pega o prato nos balcões — frango, ' +
          'hambúrguer e cozinha asiática — e senta onde quiser. É a terceira refeição do ' +
          'plano no dia. O pub do mesmo salão tem cerveja artesanal e drinques, pagos à ' +
          'parte.\n\n' +
          'Fica em Pantopia, a nove minutos do Moroccan Palace e ao lado da planície do ' +
          'Serengeti, onde são as luzes depois.\n\n' +
          'É balcão: não leva gorjeta.',
        restauranteId: 'r-dragonfire', areaParque: 'Pantopia', acesso: [], duracaoMin: 60,
        pesquisa: '2026-09-11' },

      { id: 'b-2311-1825', hora: '18:25', ancora: 'fixo', tipo: 'show',
        titulo: 'Show de luzes no Serengeti e o parque aceso',
        descricao: 'Luzes coreografadas na planície, com "Carol of the Bells"',
        contexto:
          'Dezenas de milhares de luzes de Natal coreografadas sobre a planície do Serengeti, ' +
          'com uma versão de "Carol of the Bells". Estreou no Natal de 2025.\n\n' +
          'HORÁRIO A CONFIRMAR, e o do show de drones também — o Holiday Skies Spectacular, de ' +
          '2025, com centenas de drones. Os dois são depois que escurece, e o pôr do sol é por ' +
          'volta das 17h30.',
        areaParque: 'Pantopia', acesso: [], confirmarHorario: true, duracaoMin: 35,
        pesquisa: '2026-09-11' },

      { id: 'b-2311-1910', hora: '19:10', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Cheetah Hunt à noite',
        descricao: 'A segunda volta, no escuro',
        contexto:
          'A mesma montanha-russa da manhã, agora no escuro — é a volta noturna mais elogiada do ' +
          'parque. Fica perto da saída.\n\n' +
          'Nada solto: armário obrigatório.',
        areaParque: 'Edge of Africa', acesso: ['standby'], locker: true, duracaoMin: 40,
        pesquisa: '2026-09-11' },

      { id: 'b-2311-1955', hora: '19:55', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Iron Gwazi à noite',
        descricao: 'Opcional. Ao lado da saída',
        contexto:
          'A última volta do dia, a dois minutos do Cheetah Hunt e colada na saída. Se o parque ' +
          'fechar às 20h, ela sai — é o plano B2.\n\n' +
          'DETECTOR DE METAL de novo: celular e chave no armário.',
        areaParque: 'Morocco', acesso: ['standby'], opcional: true, locker: 'detector',
        duracaoMin: 30,
        pesquisa: '2026-09-11' },

      { id: 'b-2311-2030', hora: '20:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Estrada de volta',
        descricao: '1h25 até o hotel. Chegada por volta das 22h15',
        contexto:
          'Uns 15 minutos até o carro e 1h25 de estrada. Quem dirige precisa estar inteiro: se o ' +
          'cansaço bater, parem.\n\n' +
          'Chegando tarde e com fome, vale a dica "Onde comer quando a noite acaba tarde".\n\n' +
          'AMANHÃ É O ÚLTIMO DIA INTEIRO: compras, o carro volta à Avis às 15h e a noite é no ' +
          'Disney Springs.',
        acesso: [], duracaoMin: 105 },
    ],
    naoPerca: [
      { nome: 'Show de luzes no Serengeti', quando: 'hoje', custo: 'incluso',
        motivo: 'Luzes de Natal coreografadas sobre a planície dos animais, depois que escurece.',
        pesquisa: '2026-09-11' },
      { nome: 'Holiday Skies Spectacular', quando: 'hoje', condicao: 'se houver no dia',
        custo: 'incluso',
        motivo: 'Show de drones com músicas de Natal, que estreou no Natal de 2025.',
        pesquisa: '2026-09-11' },
      { nome: 'As duas voltas noturnas', quando: 'hoje', custo: 'incluso',
        motivo: 'Cheetah Hunt e Iron Gwazi no escuro, as duas perto da saída.',
        pesquisa: '2026-09-11' },
    ],
    prepararAmanha: {
      paraODia: '2026-11-24',
      titulo: 'Old Town · manhã livre',
      aviso: 'Amanhã não tem alarme, nem parque, nem hora marcada. É o respiro entre a ' +
             'estrada de Tampa e o último dia inteiro.',
      itens: [
        { texto: 'Guardar as compras e esvaziar a mochila do parque', critico: false,
          motivo: 'Amanhã é dia de Old Town e de carro. A mochila de parque fica.' },
        { texto: 'Celular e power bank carregando', critico: false,
          motivo: 'Hoje foram catorze horas de parque com o app aberto o tempo todo.' },
      ],
    },
    ficha: {
      multiPass: null, singlePass: null, expressPass: null,
      custoEstimadoCasal: { min: 40, max: 47, moeda: 'USD' },
      extras: [
        { nome: 'Estacionamento geral',
          custo: { min: 32, max: 35, moeda: 'USD' },
          texto: 'US$ 32 mais imposto, do outro lado da rua do parque.' },
        { nome: 'Armários das montanhas-russas',
          custo: { min: 8, max: 12, moeda: 'USD' },
          texto: 'A Iron Gwazi tem detector de metal: celular e chave vão para o armário pago, de ' +
                 'manhã e à noite — US$ 8 em dois avulsos de US$ 4. O armário do dia, US$ 12, ' +
                 'muda de atração e cobre as outras montanhas-russas.' },
        { nome: 'Plano de refeição',
          texto: 'Incluso no ingresso: uma refeição a cada 90 minutos. O dia usa três.' },
        { nome: 'Quick Queue — não',
          custo: { min: 0, max: 0, moeda: 'USD' },
          texto: 'A maior fila média do parque em 2026 é de 33 minutos, no Cheetah Hunt.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Cobra’s Curse',
          motivo: 'Montanha-russa giratória de família, com 30 minutos de fila média.' },
        { nome: 'Phoenix Rising', motivo: 'Montanha-russa de família.' },
        { nome: 'Serengeti Flyer', motivo: 'Balanço gigante. O dia já tem a Falcon’s Fury.' },
        { nome: 'Congo River Rapids', motivo: 'Molha, e a volta é de 1h25 de carro.' },
        { nome: 'Serengeti Safari',
          motivo: 'Passeio pago à parte, de 30 minutos, com girafas. O trem atravessa a mesma ' +
                  'planície.' },
        { nome: 'Sesame Street Safari of Fun e Wild Oasis', motivo: 'Áreas infantis.' },
      ],
      fechado: [
        'Kumba — fechou em 02/08/2026. O Kumba’s Revenge, que vai no lugar, ainda não tem data.',
        'Stanley Falls — fechou em 07/09/2025 e foi demolida.',
        'Scorpion — fechou em 08/09/2024.',
        'Sand Serpent — fechou em 2023 e deu lugar à Phoenix Rising.',
      ],
    },
  },

  /* ===== 24/11 · TERÇA · OLD TOWN ================================ */
  {
    id: 'd-2026-11-24',
    data: '2026-11-24',
    diaSemana: 'terça',
    emoji: '🚗',
    titulo: 'Old Town',
    subtitulo: 'Manhã livre · a última noite de Kissimmee',
    tipo: 'livre',
    operadora: null,
    parqueId: null,
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-11',
    referencia: { rotulo: 'Saída do hotel', padrao: '08:30', confirmado: false },
    resumo:
      'O respiro depois de cinco dias seguidos fora do hotel. Café sem pressa no IHOP, ' +
      'manhã livre, almoço porto-riquenho no Old Town e, à noite, a rua de tijolinho e os ' +
      'food trucks, a três minutos do hotel.',
    avisos: [
      'NÃO EXISTE HORÁRIO CRÍTICO HOJE. É o último dia sem hora marcada da viagem, e ele ' +
      'está aqui para vocês chegarem inteiros no dia 25.',
      'O DESFILE DE MUSCLE CARS É ÀS SEXTAS, e hoje é terça: o Old Town de hoje é a rua, as ' +
      'lojas, o Fun Spot e os food trucks.',
    ],
    notas: [
      { tipo: 'info', texto:
        'A AVIS FICA DENTRO DO OLD TOWN, nos fundos, em frente à montanha-russa — suíte 434. ' +
        'Abre das 7h às 19h todos os dias, inclusive sábado, e fica a três minutos do hotel.\n\n' +
        'O ALUGUEL É CONTADO EM PERÍODOS DE 24 HORAS. Retirando às 15h de hoje e devolvendo às ' +
        '15h do dia 25, são sete diárias certas. A tolerância na devolução é de 29 minutos; ' +
        'passou disso, a Avis cobra fração de diária, e com 90 minutos de atraso cobra a ' +
        'diária inteira.',
        pesquisa: '2026-09-11' },

      { tipo: 'atencao', texto:
        'PEDÁGIO: RECUSEM O E-TOLL UNLIMITED. O pacote cobra de US$ 11 a 26 por dia de ' +
        'aluguel, em todos os dias, com ou sem pedágio. Sem ele, a Avis cobra cada pedágio ' +
        'pela placa, mais uma taxa de US$ 6,95 só nos dias em que houve pedágio.\n\n' +
        'A estrada pedagiada que o roteiro provavelmente usa é a SR-429, para Winter Garden, ' +
        'amanhã — poucos dólares. SeaWorld, Islands e Tampa ficam pela I-4, que é grátis ' +
        'fora das faixas expressas.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'OS DESFILES DE CARRO DO OLD TOWN SÃO DE SEXTA E DE SÁBADO: muscle cars de 1964 em ' +
        'diante na sexta e clássicos anteriores a 1985 no sábado, os dois às 20h30 e de ' +
        'graça. Hoje é terça, então a Trophy Row está vazia e a rua é só das lojas, dos ' +
        'bares e do Fun Spot.',
        pesquisa: '2026-09-16' },

      { tipo: 'info', texto:
        'A MANHÃ LIVRE É A REDE DE SEGURANÇA DA UNIVERSAL. Se ficou faltando alguma coisa no ' +
        'Islands ou no Epic, esta manhã é o lugar mais barato para voltar: não tira nada do ' +
        'roteiro e não gasta dia de ingresso, porque o de vocês é de 14 dias com entradas ' +
        'ilimitadas nos três parques. O que a pendência dos ingressos confirma é o produto e ' +
        'a data de início da validade.',
        pesquisa: '2026-09-11' },
    ],
    planos: [
      { letra: 'A', titulo: 'O dia como está escrito',
        gatilho: 'Vocês chegaram inteiros da estrada de Tampa e não falta nada da Universal.',
        passos: [
          'Dormir sem alarme. Café da manhã no IHOP da 5184 W Irlo Bronson.',
          'Manhã livre no hotel. Não preencham.',
          'Almoço no El Cilantrillo, dentro do Old Town, e uma volta por lá de dia.',
          'Descanso no hotel à tarde.',
          'Às 17h20, de volta ao Old Town. Jantar no World Food Trucks e noite curta.',
        ] },
      { letra: 'B', titulo: 'Ficou faltando alguma coisa da Universal',
        gatilho: 'Uma atração grande ficou de fora no Islands ou no Epic.',
        passos: [
          'O ingresso é de 14 dias com entrada ilimitada: a manhã de hoje cabe um retorno.',
          'Café da manhã do hotel e saída de carro às 8h15, direto para o parque que ficou ' +
          'devendo.',
          'Só o que ficou de fora. Voltem até as 13h30, sem esticar.',
          'A noite no Old Town não muda.',
        ] },
      { letra: 'C', titulo: 'Chuva à noite',
        gatilho: 'A previsão do meio-dia dá chuva para o fim da tarde ou a noite.',
        passos: [
          'Invertam as refeições: World Food Trucks no almoço, El Cilantrillo no jantar. Os ' +
          'trucks são ao ar livre, e o site não diz se há área coberta; o El Cilantrillo é ' +
          'salão fechado.',
          'Se a chuva não passar, a noite termina no jantar e vocês dormem cedo: amanhã é o ' +
          'último dia inteiro, com as malas às 15h15.',
        ] },
    ],
    blocos: [
      { id: 'b-2411-0800', hora: '08:30', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Café da manhã — IHOP',
        descricao: 'Sem alarme. A 750 m do hotel, aberto desde as 6h. Ou o do hotel, incluso',
        contexto:
          'O único respiro entre o Epic de ontem e cinco dias seguidos pesados: Winter Garden ' +
          'com hóquei, SeaWorld, Islands, Busch Gardens e o último dia de compras. Não é para ' +
          'encher — é o dia de tomar café fora, sem pressa.\n\n' +
          'O IHOP da 5184 W Irlo Bronson é o mais perto dos três da 192: uns 750 metros a ' +
          'leste do hotel, três minutos de Uber. Na sexta abre das 6h à meia-noite. Panqueca, ' +
          'ovos e bacon — o café americano de diner.\n\n' +
          'SE NÃO DER VONTADE DE SAIR: o café da manhã do hotel é incluso e continental, e vai ' +
          'até as 10h segundo os sites de reserva — a Wyndham não publica o horário.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta sobre o valor sem imposto.',
        endereco: '5184 W Irlo Bronson Memorial Hwy', acesso: [], duracaoMin: 75,
        pesquisa: '2026-09-11' },

      { id: 'b-2411-0945', hora: '09:45', ancora: 'referencia', tipo: 'vazio',
        titulo: 'VAZIO PROPOSITAL',
        descricao: 'Manhã sem nada marcado, a última da viagem',
        contexto:
          'Não preencham. Vocês vêm de cinco dias seguidos fora do hotel, com a estrada de ' +
          'Tampa ontem, e amanhã é o último dia inteiro: compras de manhã, malas às 15h15 e ' +
          'Disney Springs à noite.\n\n' +
          'É TAMBÉM A REDE DE SEGURANÇA DA UNIVERSAL. Se faltou alguma coisa no Islands ou no ' +
          'Epic, o ingresso de 14 dias tem entrada ilimitada e o carro está com vocês: dá ' +
          'para voltar numa manhã sem tirar nada do roteiro.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 180 },

      { id: 'b-2411-1230', hora: '12:45', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — El Cilantrillo',
        descricao: 'Porto-riquenho de mesa, dentro do Old Town. Três minutos de Uber',
        contexto:
          'Comida caseira porto-riquenha: mofongo — purê de banana-da-terra com alho — com ' +
          'churrasco, carne de porco ou frutos do mar por cima; pernil assado devagar; e o ' +
          'pargo inteiro frito, no estilo boricua.\n\n' +
          'Pratos da rede perto de US$ 20. Na sexta abre das 11h à meia-noite. Aceita reserva ' +
          'pelo Yelp ou pelo telefone +1 407-204-9685.\n\n' +
          'Fica na suíte 130 do Old Town, o mesmo complexo da Avis: daqui, a tarde segue a pé ' +
          'pela rua de tijolinho.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta sobre o valor sem imposto.',
        endereco: '5770 W Irlo Bronson Memorial Hwy, Suite 130', restauranteId: 'r-cilantrillo',
        localId: 'old-town', acesso: [], duracaoMin: 75, pesquisa: '2026-09-11' },

      { id: 'b-2411-1401', hora: '14:00', ancora: 'referencia', tipo: 'livre',
        titulo: 'Old Town de dia · Mine Blower opcional',
        descricao: 'Uma volta pela rua de tijolinho. A montanha-russa do Fun Spot, se a comida deixar',
        contexto:
          'Uma hora sem roteiro depois do almoço, no mesmo complexo. De dia dá para ver as ' +
          'lojas com calma e sem multidão.\n\n' +
          'MINE BLOWER, no Fun Spot, ao lado do Old Town: montanha-russa de madeira com ' +
          'inversão. A entrada no Fun Spot é grátis e cada brinquedo é pago à parte, de US$ 3 ' +
          'a 40. Logo depois de um mofongo, julguem vocês.',
        localId: 'old-town', acesso: [], duracaoMin: 60, pesquisa: '2026-09-11' },

      { id: 'b-2411-1400', hora: '15:30', ancora: 'fixo', tipo: 'vazio',
        titulo: 'VAZIO PROPOSITAL',
        descricao: 'Descanso no hotel antes da última noite de Kissimmee',
        contexto:
          'Não preencham. Vocês vêm de cinco dias seguidos fora do hotel e amanhã é o último ' +
          'dia inteiro: compras de manhã, malas às 15h15 e Disney Springs à noite, que ' +
          'termina tarde.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 105 },

      { id: 'b-2411-1630', hora: '17:20', ancora: 'fixo', tipo: 'livre',
        titulo: 'Old Town Kissimmee',
        descricao: 'Entrada e estacionamento grátis. A três minutos do hotel',
        contexto:
          'Rua de tijolinho com lojas, bares e brinquedos, a três minutos do hotel. Os desfiles ' +
          'de carro são de sexta e de sábado: numa terça a Trophy Row está vazia e a rua é ' +
          'das lojas e do Fun Spot.\n\n' +
          'O pôr do sol é por volta das 17h30: vocês chegam na luz baixa e veem as luzes ' +
          'acendendo.\n\n' +
          'DECORAÇÃO DE NATAL: o Old Town monta árvore e luzes a partir de meados de novembro. ' +
          'A data exata do acendimento não saiu.',
        endereco: '5770 W Irlo Bronson Memorial Hwy', localId: 'old-town',
        acesso: [], duracaoMin: 70, pesquisa: '2026-09-11' },

      { id: 'b-2411-1830', hora: '18:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — World Food Trucks',
        descricao: 'Mais de 100 food trucks, a 300 m do Old Town. Estacionamento grátis',
        contexto:
          'Um estacionamento com mais de cem food trucks: mexicano, venezuelano, colombiano, ' +
          'cubano, porto-riquenho, brasileiro, coreano, japonês, italiano, caribenho. Cada um ' +
          'escolhe o seu — e é à noite, com tudo aceso, que o lugar faz sentido.\n\n' +
          'FICA NA PRÓPRIA 192, a uns 300 metros do Old Town. Vão de carro: são poucos ' +
          'minutos, o estacionamento é grátis, e às 20h10 vocês voltam para pegar lugar na ' +
          'calçada.\n\n' +
          'Aberto das 11h às 2h, todos os dias. O site não diz se há área coberta: com chuva ' +
          'prevista, vale o plano C.\n\n' +
          'Food truck é balcão: não leva gorjeta.',
        endereco: '5811 W Irlo Bronson Memorial Hwy', restauranteId: 'r-world-food-trucks',
        localId: 'world-food-trucks', acesso: [], duracaoMin: 90, pesquisa: '2026-09-11' },

      { id: 'b-2411-2000', hora: '20:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar',
        descricao: 'Três minutos de carro. Amanhã a saída é 10h',
        contexto:
          'Noite curta de propósito. O dia 25 é o último inteiro: compras de manhã, malas às ' +
          '15h15 e a última noite no Disney Springs, que termina perto das 22h.',
        acesso: [], duracaoMin: 15 },
    ],
    naoPerca: [
      { nome: 'Muscle Car Cruise', quando: 'descartado', custo: 'grátis',
        motivo: 'O desfile do Old Town é de sexta, com os muscle cars, e de sábado, com os ' +
                'clássicos até 1985. A noite de vocês lá é numa terça, e nenhum dos dois roda.',
        pesquisa: '2026-09-16' },
      { nome: 'A decoração de Natal do Old Town', quando: 'hoje',
        condicao: 'montada a partir de meados de novembro', custo: 'grátis',
        motivo: 'Árvore e luzes na rua de tijolinho. A data do acendimento ainda não saiu.',
        pesquisa: '2026-09-11' },
      { nome: 'Mine Blower, no Fun Spot', quando: 'depois do almoço', custo: 'pago por brinquedo',
        motivo: 'Montanha-russa de madeira com inversão, ao lado do Old Town. A entrada no Fun ' +
                'Spot é grátis; cada brinquedo é pago à parte.',
        pesquisa: '2026-09-11' },
      { nome: 'Boggy Creek Airboat Adventures', quando: 'descartado', custo: 'US$ 108 a 122 no casal',
        motivo: 'Passeio de aerobarco de uma hora, a 38 minutos do hotel. Fica de fora: não é ' +
                'objetivo da viagem, novembro é a pior época para ver bicho de manhã, e ele ' +
                'obrigaria a pegar o carro cedo, com uma diária a mais. A manhã livre rende mais.',
        pesquisa: '2026-09-11' },
    ],
    prepararAmanha: {
      paraODia: '2026-11-25',
      titulo: 'Compras, devolução do carro e Disney Springs',
      aviso: 'O último dia inteiro. O único horário que não pode falhar é a devolução do carro, ' +
             'às 15h, na mesma Avis do Old Town.',
      itens: [
        { texto: 'Tanque cheio antes das 15h', critico: true,
          motivo: 'O carro volta à Avis com o tanque cheio. A tolerância na devolução é de 29 ' +
                  'minutos; passou disso, a Avis cobra fração de diária.' },
        { texto: 'Malas amanhã às 15h15, depois da devolução do carro', critico: false,
          motivo: 'Com todas as compras do dia dentro. Só o World of Disney, à noite, vai por cima.' },
      ],
    },
    ficha: {
      multiPass: null, singlePass: null, expressPass: null,
      custoEstimadoCasal: { min: 0, max: 40, moeda: 'USD' },
      extras: [
        { nome: 'e-Toll Unlimited da Avis — recusar',
          custo: { min: 0, max: 0, moeda: 'USD' },
          texto: 'O pacote cobra de US$ 11 a 26 por dia de aluguel, todos os dias, e vai até US$ 55 ' +
                 'a 130 por semana. Sem ele, cada pedágio sai pela placa, mais US$ 6,95 só nos ' +
                 'dias em que houve pedágio.' },
        { nome: 'Mine Blower, no Fun Spot',
          custo: { min: 0, max: 40, moeda: 'USD' },
          texto: 'Opcional. Cada brinquedo do Fun Spot custa de US$ 3 a 40; o passe do dia é ' +
                 'US$ 59,95. A entrada é grátis.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Kissimmee Lakefront Park',
          motivo: 'Sem carro de manhã, são 16 minutos de Uber em cada sentido para ver um lago.' },
      ],
      fechado: [],
    },
  },
  /* ===== 25/11 · QUARTA · COMPRAS E DISNEY SPRINGS NO NATAL ============= */
  {
    id: 'd-2026-11-25',
    data: '2026-11-25',
    diaSemana: 'quarta',
    emoji: '🛒',
    titulo: 'Compras e Disney Springs no Natal',
    subtitulo: 'A última noite, com a decoração que não existia no dia 10',
    tipo: 'livre',
    operadora: null,
    parqueId: null,
    historiaLocalId: 'disney-springs',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-11',
    referencia: { rotulo: 'Saída do hotel', padrao: '10:00', confirmado: false },
    resumo:
      'De manhã, o outlet do Vineland, Marshalls, Ross e Walgreens. O carro volta à Avis às ' +
      '15h e as malas fecham no hotel. À noite, o Disney Springs de Natal: árvores, neve na ' +
      'praça, jantar no Homecomin’ e o World of Disney com calma.',
    avisos: [
      'O ÚNICO HORÁRIO QUE NÃO PODE FALHAR É A DEVOLUÇÃO DO CARRO, ÀS 15H, com o tanque cheio. ' +
      'A Avis tolera 29 minutos; depois disso cobra fração de diária.',
      'A RESERVA DO HOMECOMIN’ ABRE EM 26/09, às 6h de Orlando — 7h em Brasília. É o jantar de ' +
      'despedida, na véspera de Thanksgiving, e está no checklist.',
    ],
    notas: [
      { tipo: 'info', texto:
        'O NATAL DO DISNEY SPRINGS vai de 13/11/2026 a 06/01/2027, sem ingresso: Christmas Tree ' +
        'Stroll, neve artificial toda noite, música ao vivo e Papai Noel.\n\n' +
        'Em 2025, a neve caía na árvore do Town Center a cada meia hora depois do pôr do sol, e ' +
        'o Papai Noel recebia visitas no Santa’s Marketplace das 11h às 23h, com fila virtual no ' +
        'app da Disney. Os detalhes de 2026 saem perto da data.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'AS COMPRAS DO DIA SÃO AS DA LISTA: vitaminas e cosméticos na Walgreens, e o garimpo do ' +
        'Ross e do Marshalls. O outlet do Vineland fica ao lado do Marshalls, com horário ' +
        'estendido na semana da Black Friday.\n\n' +
        'A BLACK FRIDAY cai em 27/11, o dia em que vocês pousam no Rio — mas as promoções da ' +
        'semana começam antes.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'DEPOIS DAS 15H A NOITE É DE UBER: 3 minutos da Avis ao hotel e uns 20 do hotel ao ' +
        'Disney Springs, de US$ 15 a 25 cada corrida. O embarque e o desembarque são no West ' +
        'Side, perto do Cirque du Soleil, ou no Marketplace.',
        pesquisa: '2026-09-11' },
    ],
    planos: [
      { letra: 'A', titulo: 'O dia como está escrito',
        gatilho: 'O Oakley foi retirado no dia 18 e a reserva do Homecomin’ saiu.',
        passos: [
          'Café do hotel às 9h, outlet do Vineland às 10h15 e o Marshalls ao lado.',
          'Almoço no Sofrito, Ross na Vineland Rd, e Walgreens e posto antes da Avis.',
          'Carro devolvido às 15h, malas no hotel e descanso.',
          'Uber às 17h45: Christmas Tree Stroll, Homecomin’ às 19h30 e World of Disney.',
        ] },
      { letra: 'B', titulo: 'O Oakley não foi retirado no dia 18',
        gatilho: 'O pedido não estava pronto, ou a loja não tinha os óculos.',
        passos: [
          'Reservem a retirada no app do Best Buy antes de sair do hotel.',
          'Best Buy do Millenia no lugar do outlet: saída às 9h45, uns 30 minutos de carro, ' +
          'e a loja abre às 10h.',
          'Do Millenia, sigam para o Marshalls do Vineland. O resto do dia não muda.',
        ] },
      { letra: 'B2', titulo: 'Sem mesa no Homecomin’',
        gatilho: 'A reserva não saiu, ou a espera passa de uma hora.',
        passos: [
          'O Polite Pig é churrasco de balcão, no próprio Disney Springs, sem reserva.',
          'O resto da noite não muda.',
        ] },
      { letra: 'C', titulo: 'Atraso na devolução do carro',
        gatilho: 'As compras atrasaram e 15h não vai dar.',
        passos: [
          'A Avis tolera 29 minutos. Depois disso cobra fração de diária, e com 90 minutos a ' +
          'diária inteira.',
          'A loja fica aberta até as 19h. Liguem para +1 321-219-7041 se for passar das 15h30.',
          'O Ross é o primeiro a cair.',
        ] },
      { letra: 'C2', titulo: 'Chuva à noite',
        gatilho: 'Chove no Disney Springs.',
        passos: [
          'Lojas e restaurantes são cobertos; as árvores e a neve na praça, não.',
          'Invertam: World of Disney antes do jantar, e as árvores depois, se a chuva parar.',
        ] },
    ],
    blocos: [
      { id: 'b-2511-0900', hora: '09:00', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Café da manhã do hotel',
        descricao: 'Sem pressa: a volta de Tampa foi às 22h15',
        contexto:
          'O outlet só abre às 10h. O café do hotel vai até as 10h, segundo os sites de ' +
          'reserva.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 45 },

      { id: 'b-2511-1000', hora: '10:00', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'De carro para o Vineland',
        descricao: 'Uns 15 minutos até o outlet',
        contexto:
          'O Orlando Vineland Premium Outlets fica na 8200 Vineland Ave, uns 6 km ao norte do ' +
          'hotel em linha reta. O tempo de estrada é estimativa.',
        localId: 'vineland-outlets', acesso: [], duracaoMin: 15 },

      { id: 'b-2511-1015', hora: '10:15', ancora: 'referencia', tipo: 'compras',
        titulo: 'Orlando Vineland Premium Outlets',
        descricao: 'Abre às 10h. Horário estendido na semana da Black Friday',
        contexto:
          'O outlet do lado da Disney — o do dia 12 foi o da International Drive. Horário ' +
          'estendido na semana da Black Friday, e as promoções da semana começam antes dela.',
        endereco: '8200 Vineland Ave', localId: 'vineland-outlets', acesso: [], duracaoMin: 90,
        pesquisa: '2026-09-11' },

      { id: 'b-2511-1150', hora: '11:50', ancora: 'referencia', tipo: 'compras',
        titulo: 'Marshalls — Vineland Pointe',
        descricao: 'Ao lado do outlet. Garimpo',
        contexto:
          'Loja de ponta de estoque: marca com desconto e nenhuma organização — é garimpo. Fica ' +
          'no Vineland Pointe, na 7655 Lake St, colado no outlet.',
        endereco: '7655 Lake St', localId: 'vineland-outlets', acesso: [], duracaoMin: 40,
        pesquisa: '2026-09-11' },

      { id: 'b-2511-1235', hora: '12:35', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Sofrito Latin Cafe',
        descricao: 'Cozinha latina de balcão, na Palm Pkwy. Leve: o jantar é o Homecomin’',
        contexto:
          'Frango assado ao estilo peruano, pernil cubano, empanadas venezuelanas, colombianas e ' +
          'argentinas, sanduíche cubano. Faixa de preço de US$ 3 a 15.\n\n' +
          'É balcão: pede no caixa e senta. Não leva gorjeta.',
        endereco: '8607 Palm Pkwy', restauranteId: 'r-sofrito', localId: 'vineland-outlets',
        acesso: [], duracaoMin: 45, pesquisa: '2026-09-11' },

      { id: 'b-2511-1335', hora: '13:35', ancora: 'referencia', tipo: 'compras',
        titulo: 'Ross — Vineland Rd',
        descricao: 'Ao lado do Publix, a 600 m do Walmart do dia 10',
        contexto:
          'Ponta de estoque de roupa, casa e beleza, na 3231 Vineland Rd — o mesmo centro do ' +
          'Publix, a 600 metros do Walmart do dia 10.',
        endereco: '3231 Vineland Rd', localId: 'publix-vineland', acesso: [], duracaoMin: 35,
        pesquisa: '2026-09-11' },

      { id: 'b-2511-1415', hora: '14:15', ancora: 'referencia', tipo: 'tarefa',
        titulo: 'Walgreens e posto, antes da Avis',
        descricao: 'Vitaminas e cosméticos. No posto, paguem dentro da loja',
        contexto:
          'A WALGREENS da 5935 W Irlo Bronson abre 24 horas: vitaminas, cosméticos e ' +
          'suplementos, que é o que mais compensa.\n\n' +
          'O POSTO: o 7-Eleven da 5880 W Irlo Bronson fica a uns 450 metros da Avis. A bomba ' +
          'pede o ZIP code do cartão, e cartão brasileiro não tem — paguem no caixa, dizendo o ' +
          'número da bomba, e peçam para encher. O carro volta com o tanque cheio.',
        endereco: '5935 W Irlo Bronson Memorial Hwy', localId: 'old-town', acesso: [],
        critico: true, duracaoMin: 40, pesquisa: '2026-09-11' },

      { id: 'b-2511-1500', hora: '15:00', ancora: 'fixo', tipo: 'tarefa',
        titulo: 'Devolver o carro — Avis do Old Town',
        descricao: 'Tanque cheio. Tolerância de 29 minutos',
        contexto:
          'A TAREFA CRÍTICA DO DIA. A mesma Avis da retirada, na suíte 434, nos fundos do Old ' +
          'Town, aberta das 7h às 19h. Retirado às 10h do dia 18, o carro fecha sete diárias ' +
          'certas às 15h de hoje; a tolerância é de 29 minutos.\n\n' +
          'Fotografem o carro por fora e o painel com o combustível, e guardem o comprovante do ' +
          'posto.\n\n' +
          'O PEDÁGIO da SR-429, do dia 21, é cobrado pela placa e chega depois, no cartão.',
        endereco: '5770 W Irlo Bronson Memorial Hwy, Suite 434', localId: 'old-town',
        acesso: [], critico: true, duracaoMin: 15, pesquisa: '2026-09-11' },

      { id: 'b-2511-1515', hora: '15:15', ancora: 'fixo', tipo: 'tarefa',
        titulo: 'Uber até o hotel · malas',
        descricao: 'Três minutos de Uber. Pesem tudo: 23 kg por mala',
        contexto:
          'Com todas as compras do dia dentro, as malas fecham agora. Excesso de bagagem no ' +
          'balcão do aeroporto custa caro, e amanhã cedo não é hora de descobrir.\n\n' +
          'O que entrar no World of Disney à noite vai por cima — deixem espaço.',
        localId: 'hotel-travelodge', acesso: [], critico: true, duracaoMin: 60 },

      { id: 'b-2511-1615', hora: '16:15', ancora: 'fixo', tipo: 'vazio',
        titulo: 'VAZIO PROPOSITAL',
        descricao: 'Descanso antes da última noite',
        contexto: 'Não preencham. A noite vai até as 22h30, e amanhã é o dia da volta.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 90 },

      { id: 'b-2511-1745', hora: '17:45', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Uber para o Disney Springs',
        descricao: '~20 min, US$ 15–25. Desembarque no West Side ou no Marketplace',
        contexto:
          'O carro já foi devolvido: a noite é de Uber. Os pontos de embarque e desembarque ' +
          'ficam no West Side, perto do Cirque du Soleil, e no Marketplace.',
        localId: 'disney-springs', acesso: [], duracaoMin: 25, pesquisa: '2026-09-11' },

      { id: 'b-2511-1810', hora: '18:10', ancora: 'fixo', tipo: 'livre',
        titulo: 'Christmas Tree Stroll',
        descricao: 'Árvores de Natal temáticas pelo Disney Springs. Peguem o mapa',
        contexto:
          'Árvores de Natal decoradas com temas da Disney, da Pixar e de Star Wars, espalhadas ' +
          'pelo Disney Springs. De graça, sem ingresso.\n\n' +
          'Em 2025 dava para pegar um mapa e uma cartela de adesivos, que viravam um botton no ' +
          'fim do circuito.\n\n' +
          'A NEVE: em 2025, caía na árvore do Town Center a cada meia hora depois do pôr do sol, ' +
          'que é por volta das 17h30. Passem pela praça numa dessas meias horas.',
        localId: 'disney-springs', acesso: [], duracaoMin: 75, pesquisa: '2026-09-11' },

      { id: 'b-2511-1930', hora: '19:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Homecomin’',
        descricao: 'O jantar de despedida. O frango frito famoso custa US$ 34',
        contexto:
          'Cozinha do sul dos Estados Unidos, do chef Art Smith: o frango frito que deu fama à ' +
          'casa, biscuits e tomate verde frito. Pratos de US$ 16 a 42.\n\n' +
          'RESERVA: abre 60 dias antes, em 26/09, às 6h de Orlando — 7h em Brasília. Pelo My ' +
          'Disney Experience ou pelo +1 407-560-0100. Está no checklist.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta sobre o valor sem imposto.',
        restauranteId: 'r-homecomin', localId: 'disney-springs', acesso: ['reserva'],
        duracaoMin: 75, pesquisa: '2026-09-11',
        curiosidades: [
          { texto: 'O chef Art Smith é floridiano de sexta geração, foi chef particular da ' +
                   'Oprah Winfrey por dez anos e ganhou o prêmio James Beard. O restaurante ' +
                   'abriu em julho de 2016.',
            fonte: 'Central Florida Public Media; Visit Orlando', pesquisa: '2026-09-15' },
        ] },

      { id: 'b-2511-2050', hora: '20:50', ancora: 'fixo', tipo: 'compras',
        titulo: 'World of Disney · Papai Noel, se der',
        descricao: 'A última compra da viagem. As lojas fecham às 23h',
        contexto:
          'A maior loja Disney da viagem, com calma. As lojas do Disney Springs fecham às 23h de ' +
          'domingo a quinta.\n\n' +
          'PAPAI NOEL: em 2025 ficava no Santa’s Marketplace, das 11h às 23h, com fila virtual no ' +
          'app da Disney. Se a fila abrir, dá para encaixar.\n\n' +
          'AS MALAS JÁ FECHARAM: o que entrar aqui vai por cima.',
        localId: 'disney-springs', acesso: [], duracaoMin: 60, pesquisa: '2026-09-11' },

      { id: 'b-2511-2200', hora: '22:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Uber de volta',
        descricao: 'Hotel por volta das 22h30',
        contexto: 'AMANHÃ É A VOLTA: café do hotel às 8h30, Uber às 10h25 e voo às 14h10.',
        acesso: [], duracaoMin: 30 },
    ],
    naoPerca: [
      { nome: 'A neve na árvore do Town Center', quando: 'hoje', custo: 'grátis',
        motivo: 'Em 2025, caía a cada meia hora depois do pôr do sol.',
        pesquisa: '2026-09-11' },
      { nome: 'Christmas Tree Stroll', quando: 'hoje', custo: 'grátis',
        motivo: 'Árvores temáticas pelo Disney Springs, com mapa e botton no fim.',
        pesquisa: '2026-09-11' },
    ],
    prepararAmanha: {
      paraODia: '2026-11-26',
      titulo: 'Volta · voo às 14h10',
      aviso: 'É Thanksgiving: restaurantes fechados no feriado. O dia é café do hotel e aeroporto.',
      itens: [
        { texto: 'Check-in online e cartão de embarque nos dois celulares', critico: true,
          motivo: 'Voo internacional, com três horas de antecedência. Com o check-in feito, no ' +
                  'aeroporto é só despachar as malas.' },
        { texto: 'Passaportes na mochila de mão', critico: true,
          motivo: 'É o único item que, se faltar, não tem solução no dia.' },
        { texto: 'Malas fechadas e pesadas', critico: true,
          motivo: '23 kg por mala. O que entrou no World of Disney foi por cima.' },
        { texto: 'Alarme para 8h nos dois celulares', critico: true,
          motivo: 'Café do hotel às 8h30, check-out e Uber às 10h25. O voo sai às 14h10.' },
      ],
    },
    ficha: {
      multiPass: null, singlePass: null, expressPass: null,
      custoEstimadoCasal: { min: 37, max: 60, moeda: 'USD' },
      extras: [
        { nome: 'Uber da noite',
          custo: { min: 37, max: 60, moeda: 'USD' },
          texto: 'Três minutos da Avis ao hotel, e ida e volta ao Disney Springs, de US$ 15 a 25 ' +
                 'cada perna.' },
        { nome: 'Gasolina para devolver com o tanque cheio',
          texto: 'No 7-Eleven da 5880 W Irlo Bronson, pagando dentro da loja.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Best Buy',
          motivo: 'A retirada do Oakley é no dia 18. Aqui o Best Buy só entra no plano B.' },
        { nome: 'Black Friday', motivo: 'Cai em 27/11, o dia seguinte ao voo de volta.' },
      ],
      fechado: [],
    },
  },

  /* ===== 26/11 · QUINTA · VOLTA ========================================= */
  {
    id: 'd-2026-11-26',
    data: '2026-11-26',
    diaSemana: 'quinta',
    emoji: '✈️',
    titulo: 'Volta',
    subtitulo: 'Thanksgiving · MCO → Bogotá → Rio',
    tipo: 'logistica',
    operadora: null,
    parqueId: null,
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-11',
    referencia: { rotulo: 'Decolagem de Orlando', padrao: '14:10', confirmado: true },
    resumo:
      'Manhã sem pressa, aeroporto três horas antes e a volta pela mesma rota da ida: ' +
      'Orlando às 14h10, conexão de 3h10 em Bogotá e chegada ao Rio às 5h55 de 27/11.',
    avisos: [
      'POWER BANK E BATERIA DE LÍTIO SÓ NA BAGAGEM DE MÃO — na despachada é proibido. Se a ' +
      'mala de mão for despachada no portão, tirem as baterias antes.',
      'É Thanksgiving: o aeroporto funciona, mas o feriado mexe no horário dos restaurantes. ' +
      'Confiram no Terminal C o que está aberto antes de contar com o almoço.',
    ],
    notas: [
      { tipo: 'info', texto:
        'OS VOOS: Orlando 14h10 → Bogotá 18h15, conexão de 3h10, e Bogotá 21h25 → Rio 5h55 ' +
        'de 27/11. Em novembro, Bogotá e Orlando estão no mesmo fuso; o Rio está duas horas ' +
        'à frente, e o pouso das 5h55 já é no horário de Brasília.\n\n' +
        'A referência do dia é a decolagem de Orlando: se o voo mudar de horário, a manhã ' +
        'inteira desloca junto.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'NÃO HÁ IMIGRAÇÃO NA SAÍDA DOS ESTADOS UNIDOS. É a companhia aérea que confere o ' +
        'passaporte no check-in e manda os dados do voo para o governo americano. O embarque ' +
        'pode ter reconhecimento facial no portão. O que existe no aeroporto é o raio-x da TSA.',
        pesquisa: '2026-09-11' },

      { tipo: 'atencao', texto:
        'RECEITA FEDERAL NA CHEGADA AO RIO: a cota é de US$ 1.000 por pessoa, individual e ' +
        'intransferível — a dos dois não se soma. O free shop do desembarque no Brasil tem ' +
        'mais US$ 1.000 por pessoa. O que passar da cota é declarado pela e-DBV e tributado.\n\n' +
        'Não entram na conta os bens de uso pessoal já usados: roupa usada, celular e relógio ' +
        'de uso próprio. E o duty-free de Orlando conta na cota do exterior — a cota extra é ' +
        'só a do free shop na chegada.',
        pesquisa: '2026-09-11' },
    ],
    planos: [
      { letra: 'A', titulo: 'O dia como está escrito',
        gatilho: 'O voo de Orlando sai às 14h10.',
        passos: [
          'Café do hotel às 8h30, malas conferidas e check-out.',
          'Uber às 10h25, check-in da Avianca às 11h10 e raio-x pelo MCO Reserve.',
          'Almoço no Terminal C e portão às 13h25.',
          'Conexão de 3h10 em Bogotá e pouso no Rio às 5h55.',
        ] },
      { letra: 'B', titulo: 'Atraso no voo de Orlando',
        gatilho: 'O app da Avianca mostra o voo de Orlando atrasado.',
        passos: [
          'A conexão em Bogotá tem 3h10, sem imigração, e o mínimo oficial em El Dorado é ' +
          '1h30: até 1h40 de atraso a conexão continua dentro do mínimo.',
          'Se a conexão cair, a remarcação é no balcão da Avianca em Bogotá. O bilhete em PDF, ' +
          'salvo offline, tem o localizador.',
        ] },
      { letra: 'C', titulo: 'Uber demorando no feriado',
        gatilho: 'Às 10h15, quando vocês pedem a corrida, o app não acha motorista.',
        passos: [
          'Peçam a corrida às 10h15, dez minutos antes da saída: é Thanksgiving.',
          'Se em 10 minutos não aparecer motorista, tentem o Lyft. A recepção do hotel também ' +
          'chama táxi.',
          'O balcão da Avianca fecha de 45 a 60 minutos antes do voo: saindo do hotel até ' +
          'as 11h30, ainda dá.',
        ] },
    ],
    blocos: [
      { id: 'b-2611-0830', hora: '08:30', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Café da manhã do hotel',
        descricao: 'Sem pressa: o voo é às 14h10',
        contexto:
          'O café do hotel vai das 7h às 10h, segundo os sites de reserva. É o último café ' +
          'da viagem, e sem alarme cedo.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 45 },

      { id: 'b-2611-0920', hora: '09:20', ancora: 'referencia', tipo: 'tarefa',
        titulo: 'Últimas conferências e check-out',
        descricao: 'Passaportes e baterias na mão. Check-out até as 11h',
        contexto:
          'ANTES DE FECHAR O QUARTO: passaportes na mochila de mão; power banks e baterias de ' +
          'lítio na mão, nunca na mala despachada; malas pesadas, 23 kg cada; cabos e ' +
          'carregadores tirados das tomadas; cofre do quarto aberto e vazio.\n\n' +
          'O check-out do Travelodge é até as 11h.',
        localId: 'hotel-travelodge', acesso: [], critico: true, duracaoMin: 60,
        pesquisa: '2026-09-11' },

      { id: 'b-2611-1025', hora: '10:25', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Uber para o MCO',
        descricao: '~30 min, US$ 35–45. Destino: Terminal C',
        contexto:
          'Uns 30 minutos até o aeroporto; o bloco tem 45 porque é feriado e o motorista pode ' +
          'demorar. No app, o destino é o Terminal C, das partidas internacionais da Avianca.',
        localId: 'mco', acesso: [], duracaoMin: 45, pesquisa: '2026-09-11' },

      { id: 'b-2611-1110', hora: '11:10', ancora: 'referencia', tipo: 'tarefa',
        titulo: 'Check-in e despacho — Avianca, Terminal C',
        descricao: 'Três horas antes, como a Avianca recomenda',
        contexto:
          'A Avianca pede chegada três horas antes em voo internacional, e o balcão fecha de 45 ' +
          'a 60 minutos antes da decolagem. Com o check-in online feito na véspera, aqui é só ' +
          'despachar as malas e conferir os passaportes.',
        localId: 'mco', acesso: [], critico: true, duracaoMin: 45, pesquisa: '2026-09-11' },

      { id: 'b-2611-1155', hora: '11:55', ancora: 'referencia', tipo: 'espera',
        titulo: 'Raio-x da TSA pelo MCO Reserve',
        descricao: 'A faixa reservada no checklist, logo depois do check-in',
        contexto:
          'Na fila do MCO Reserve, escaneiem o QR code da reserva e sigam para o raio-x normal ' +
          'da TSA, com o cartão de embarque e o passaporte na mão.\n\n' +
          'Não há imigração na saída dos Estados Unidos: depois do raio-x, é o portão.',
        localId: 'mco', acesso: [], duracaoMin: 30, pesquisa: '2026-09-11' },

      { id: 'b-2611-1225', hora: '12:25', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço no Terminal C',
        descricao: 'Tudo fica depois do raio-x. O Summer House tem mesa',
        contexto:
          'No Terminal C, restaurantes e lojas ficam todos depois do raio-x. O Summer House é ' +
          'o de mesa com garçom, e o segundo andar é o mais tranquilo.\n\n' +
          'É Thanksgiving: confiram o que está aberto. Se o Summer House estiver fechado, ' +
          'qualquer balcão do Palm Court resolve antes de um voo de quatro horas.',
        localId: 'mco', acesso: [], duracaoMin: 55, pesquisa: '2026-09-11' },

      { id: 'b-2611-1325', hora: '13:25', ancora: 'referencia', tipo: 'espera',
        titulo: 'Portão',
        descricao: 'As lojas da Disney, Universal e SeaWorld ficam no Palm Court',
        contexto:
          'Se sobrar tempo, as lojas oficiais dos parques ficam no Palm Court, depois do ' +
          'raio-x. Lembrem que o que for comprado aqui entra na cota de US$ 1.000.\n\n' +
          'O embarque pode ter reconhecimento facial no portão.',
        localId: 'mco', acesso: [], duracaoMin: 40, pesquisa: '2026-09-11' },

      { id: 'b-2611-1410', hora: '14:10', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Voo Orlando → Bogotá',
        descricao: 'Decolagem 14h10 · pouso 18h15 em Bogotá',
        fuso: 'Orlando',
        contexto:
          'Cerca de 4 horas de voo. Em novembro Bogotá está no mesmo fuso de Orlando: o ' +
          'relógio não muda na chegada.',
        localId: 'mco', acesso: [], critico: true, duracaoMin: 245 },

      { id: 'b-2611-1815', hora: '18:15', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Conexão em Bogotá — El Dorado',
        descricao: '3h10 de conexão. Sem imigração',
        fuso: 'Bogotá',
        contexto:
          'A conexão internacional não entra na Colômbia, como na ida — confirmado com a ' +
          'Avianca em 11/09. Sigam as placas de conexão até o controle de segurança de ' +
          'trânsito e dali para o portão. Sobram mais de duas horas e meia para jantar com ' +
          'calma antes de uma noite inteira de voo.',
        acesso: [], critico: true, duracaoMin: 190, pesquisa: '2026-09-11' },

      { id: 'b-2611-2125', hora: '21:25', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voo Bogotá → Rio',
        descricao: 'Decolagem 21h25 · pouso 5h55 de 27/11 no Rio, horário de Brasília',
        fuso: 'Bogotá',
        contexto:
          'Cerca de 6h30 de voo, à noite. Durmam o que der.\n\n' +
          'NA CHEGADA AO RIO: o free shop do desembarque tem uma cota extra de US$ 1.000 por ' +
          'pessoa. Se as compras da viagem passaram da cota de US$ 1.000 de cada um, a e-DBV é ' +
          'o caminho para declarar.',
        acesso: [], duracaoMin: 390, pesquisa: '2026-09-11' },
    ],
    naoPerca: [
      { nome: 'Free shop na chegada ao Rio', quando: 'na chegada', custo: 'cota extra de US$ 1.000 por pessoa',
        motivo: 'É uma cota à parte da de US$ 1.000 das compras no exterior, e só vale no ' +
                'free shop do desembarque no Brasil.',
        pesquisa: '2026-09-11' },
    ],
    ficha: {
      multiPass: null, singlePass: null, expressPass: null,
      custoEstimadoCasal: { min: 35, max: 45, moeda: 'USD' },
      extras: [
        { nome: 'Uber até o MCO',
          custo: { min: 35, max: 45, moeda: 'USD' },
          texto: 'Uns 30 minutos do hotel ao Terminal C.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Duty-free do MCO',
          motivo: 'Entra na cota de US$ 1.000 das compras no exterior. A cota extra é a do ' +
                  'free shop na chegada ao Brasil.' },
      ],
      fechado: [],
    },
  },

  ],

  /* ---------------------------------------------------------------------------
     RESTAURANTES — consolidado a partir dos blocos + Parte 4 do documento
     O status (a reservar / reservado / confirmado / cancelado) e o número de
     confirmação são estado do usuário, não vivem aqui.
     ------------------------------------------------------------------------ */
  restaurantes: [
    { id: 'r-boathouse', nome: 'The Boathouse', data: '2026-11-10', hora: '19:00',
      refeicao: 'jantar', local: 'Disney Springs · The Landing', alternativas: ['Black Angus ou Miller’s Ale House, na 192, se o dia virar plano C'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'Disney Springs / OpenTable', blocoId: 'b-1011-1900',
      statusPadrao: 'confirmado', confirmacaoPadrao: '2111918775',
      nota: 'RESERVADO em 08/09 — confirmação 2111918775. Frutos do mar e carnes na ' +
            'beira da água. Cheguem 15 min antes; a fila de check-in do restaurante ' +
            'anda devagar quando o Springs está cheio.' },

    { id: 'r-columbia-harbour', nome: 'Columbia Harbour House', data: '2026-11-11',
      hora: '11:50', refeicao: 'almoco', local: 'Magic Kingdom · Liberty Square',
      alternativas: ['Liberty Tree Tavern, na mesma Liberty Square', 'Skipper Canteen, na Adventureland'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo My Disney Experience', blocoId: 'b-1111-1230',
      nota: 'Parque corrido, almoço de balcão sem reserva: peixe e sanduíches. Subam para o ' +
            'segundo andar — quase ninguém acha, e é o lugar mais silencioso do Magic Kingdom.' },

    { id: 'r-caseys', nome: 'Casey’s Corner', data: '2026-11-11', hora: '17:55',
      refeicao: 'jantar', local: 'Magic Kingdom · Main Street', alternativas: ['Pecos Bill, na Frontierland', 'Cosmic Ray’s, na Tomorrowland'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo My Disney Experience', blocoId: 'b-1111-1745',
      nota: 'Escolhido pela experiência do pianista, que toca na porta ' +
            'ao ar livre. Usem mobile order e comam nas mesas de fora, de frente para o ' +
            'piano — comer dentro perde o motivo da escolha.' },

    { id: 'r-fords-garage', nome: 'Ford’s Garage', data: '2026-11-12', hora: '13:00',
      refeicao: 'almoco', local: 'Orlando International Premium Outlets · 4971 International Dr',
      alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Site do restaurante: reserva ou fila de espera', blocoId: 'b-1211-1300',
      nota: 'Mesa com garçom dentro do outlet, num salão de oficina dos anos 1920 com Fords ' +
            'antigos. Hambúrgueres, comida americana e cerveja artesanal. Segunda a sábado, ' +
            'das 11h às 22h. A conta já vem com 20% de taxa de serviço, no lugar da gorjeta.' },

    { id: 'r-satuli', nome: 'Satu’li Canteen', data: '2026-11-16', hora: '12:30',
      refeicao: 'almoco', local: 'Animal Kingdom · Pandora', alternativas: ['Flame Tree Barbecue, na Discovery Island', 'Harambe Market, na África'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo My Disney Experience', blocoId: 'b-1611-1215',
      nota: 'Balcão. Eleito o melhor quick service do Walt Disney World.' },

    { id: 'r-nomad', nome: 'Nomad Lounge', data: '2026-11-16', hora: '14:25',
      refeicao: 'drink', local: 'Animal Kingdom · Discovery Island', alternativas: ['Tiffins, ao lado — mesma cozinha, mesa e reserva'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Lista de espera pelo My Disney Experience ou no balcão', blocoId: 'b-1611-1630',
      nota: 'Não aceita reserva. Entrem na lista de espera pelo app da Disney, ou no balcão, ' +
            'e passeiem enquanto esperam. Mesa com garçom: leva gorjeta.' },

    { id: 'r-sanaa', nome: 'Sanaa', data: '2026-11-16', hora: '19:50',
      refeicao: 'jantar', local: 'Animal Kingdom Villas · Kidani Village', alternativas: ['The Mara, balcão no Animal Kingdom Lodge', 'Boma, bufe no Animal Kingdom Lodge'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'My Disney Experience', blocoId: 'b-1611-1950',
      statusPadrao: 'confirmado', confirmacaoPadrao: '356258407484',
      nota: 'RESERVADO — confirmação 356258407484, duas pessoas, 19h50. O número é o mesmo ' +
            'desde a primeira reserva: o My Disney Experience mantém a confirmação quando a ' +
            'data é alterada. Fica na Kidani ' +
            'Village, a ala de villas do Animal Kingdom Lodge, e não dentro do parque. Vão ' +
            'pela comida, não pela janela: às 19h50 de novembro está escuro há mais de duas ' +
            'horas e não se vê a savana. Peçam o Bread Service, cinco pães com nove ' +
            'acompanhamentos (~US$ 23), que é o motivo real de vir aqui.' },

    { id: 'r-columbia', nome: 'Columbia Restaurant', data: '2026-11-14', hora: '12:30',
      refeicao: 'almoco', local: 'Celebration · Market Street', alternativas: ['Qualquer coisa da Market Street, a pé', 'Ou voltar ao hotel e almoçar na 192'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'Site do restaurante / OpenTable', blocoId: 'b-1411-1230',
      statusPadrao: 'confirmado', confirmacaoPadrao: '2110915279',
      nota: 'RESERVADO — confirmação 2110915279, duas pessoas, 12h30. Peçam o 1905 Salad, ' +
            'preparado na mesa, e o sanduíche cubano.' },

    { id: 'r-broomsticks-14', nome: 'Three Broomsticks', data: '2026-11-14', hora: '20:00',
      refeicao: 'jantar', local: 'Islands of Adventure · Hogsmeade',
      alternativas: ['O Three Broomsticks fecha com o parque. Se pegarem fechado, o ' +
                     'CityWalk fica no caminho da saída — mas a espera lá em sábado ' +
                     'passa de uma hora'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Balcão, sem reserva', blocoId: 'b-1411-2100',
      nota: 'Balcão dentro da Hogsmeade decorada — não leva gorjeta. Faixa $ no mapa oficial: ' +
            'até US$ 15 por pessoa.' },

    { id: 'r-docking-bay', nome: 'Docking Bay 7', data: '2026-11-15', hora: '12:15',
      refeicao: 'almoco', local: 'Hollywood Studios · Galaxy’s Edge',
      alternativas: ['Ronto Roasters, na mesma land, sem mesa', 'Woody’s Lunch Box, no Toy Story Land'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo My Disney Experience', blocoId: 'b-1511-1215',
      nota: 'Balcão temático de Batuu.' },

    { id: 'r-ogas', nome: 'Oga’s Cantina', data: '2026-11-15', hora: '17:05',
      refeicao: 'drink', local: 'Hollywood Studios · Galaxy’s Edge',
      alternativas: ['Sem reserva não entra. Se não conseguirem, a Milk Stand da mesma ' +
                     'land serve o leite azul e o verde sem fila de reserva'],
      precisaReserva: true, janelaAbre: '2026-09-16', janelaHora: '06:00 ET',
      canal: 'My Disney Experience', blocoId: 'b-1511-1705',
      statusPadrao: 'confirmado', confirmacaoPadrao: '356259476987',
      nota: 'RESERVADO — confirmação 356259476987, duas pessoas, 17h05. Limite de 45 min ' +
            'por grupo. Plano de refeição não é aceito.' },

    { id: 'r-sunset-market', nome: 'Sunset Ranch Market', data: '2026-11-15', hora: '18:10',
      refeicao: 'jantar', local: 'Hollywood Studios · Sunset Blvd',
      alternativas: ['Ronto Roasters, no Galaxy’s Edge, antes de atravessar'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order no My Disney Experience', blocoId: 'b-1511-1810',
      nota: 'Pátio de balcões ao ar livre na Sunset Blvd, a poucos passos do teatro do ' +
            'Fantasmic: Rosie’s All-American Café, Catalina Eddie’s e Fairfax Fare. Sem ' +
            'reserva, com mobile order. Balcão não leva gorjeta.' },

    { id: 'r-epcot-mesa', nome: 'Epcot — mesa (opcional)', data: '2026-11-13', hora: null,
      refeicao: 'jantar', local: 'Epcot · World Showcase', alternativas: [],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'My Disney Experience', blocoId: null,
      statusPadrao: 'cancelado',
      nota: 'FICA DE FORA por decisão de vocês: o almoço e o jantar do dia 13 são as barracas ' +
            'do Food & Wine, em quatro voltas ao longo da tarde e da noite.' },

    { id: 'r-leaky', nome: 'Leaky Cauldron', data: '2026-11-17', hora: '13:15',
      refeicao: 'almoco', local: 'Universal Studios · Diagon Alley', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo app da Universal', blocoId: 'b-1711-1315',
      nota: 'Bangers and mash, fish and chips. O melhor quick service da Universal. Faixa $ ' +
            'no mapa oficial: até US$ 15 por pessoa.' },

    { id: 'r-lombards', nome: 'Lombard’s Seafood Grille', data: '2026-11-17', hora: '18:45',
      refeicao: 'jantar', local: 'Universal Studios · San Francisco',
      alternativas: ['CityWalk, fora da catraca, se o parque fechar cedo'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'App / site da Universal Orlando', blocoId: 'b-1711-1845',
      statusPadrao: 'confirmado', confirmacaoPadrao: '639247504692187392',
      nota: 'RESERVADO em 11/09 — confirmação 639247504692187392, duas pessoas, 18h45. ' +
            'Frutos do mar e carnes, com aquário no meio do salão. Pratos principais de ' +
            'US$ 35 a 49, nos preços de 2025.' },

    { id: 'r-confisco', nome: 'Confisco Grille', data: '2026-11-19', hora: '11:40',
      refeicao: 'almoco', local: 'Islands of Adventure · Port of Entry', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Chegar direto', blocoId: 'b-1911-1140',
      nota: 'Mesa com garçom na entrada do parque, cozinha internacional. Pratos de US$ 21 a 35.' },

    { id: 'r-kres', nome: 'Kres Chophouse', data: '2026-11-18', hora: '17:45',
      refeicao: 'jantar', local: 'Centro de Orlando · 17 W Church St',
      alternativas: ['The Boheme (Grand Bohemian)'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'OpenTable / site do restaurante', blocoId: 'b-1811-1745',
      statusPadrao: 'confirmado', confirmacaoPadrao: '2110248556',
      nota: 'RESERVADO — confirmação 2110248556, duas pessoas, 17h45. Steakhouse no centro de ' +
            'Orlando: do prato à catraca do Kia Center são cinco minutos a pé. Avisem na ' +
            'chegada que vocês têm hora.' },

    { id: 'r-mythos', nome: 'Mythos', data: '2026-11-19', hora: '19:15',
      refeicao: 'jantar', local: 'Islands of Adventure · Lost Continent',
      alternativas: ['Three Broomsticks, em Hogsmeade, sem reserva'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'App / site da Universal Orlando, ou +1 407-224-3663', blocoId: 'b-1911-1915',
      statusPadrao: 'confirmado', confirmacaoPadrao: '639251823318530048',
      nota: 'RESERVADO — confirmação 639251823318530048, duas pessoas, 19h15. ' +
            'Cheguem 5 minutos antes: a mesa é segurada por 15 minutos. Dez vezes eleito o ' +
            'melhor restaurante de parque temático. Pratos de US$ 26 a 42. A Universal diz que ' +
            'ele fecha em 2027, com a demolição da Lost Continent, ainda sem data.' },

    { id: 'r-sofrito', nome: 'Sofrito Latin Cafe', data: '2026-11-25', hora: '12:35',
      refeicao: 'almoco', local: 'Lake Buena Vista · 8607 Palm Pkwy', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Balcão, sem reserva', blocoId: 'b-2511-1235',
      nota: 'Cozinha latina: frango assado, pernil, empanadas, sanduíche cubano. Faixa de US$ ' +
            '3 a 15. Balcão: não leva gorjeta.' },

    { id: 'r-homecomin', nome: 'Homecomin’', data: '2026-11-25', hora: '19:30',
      refeicao: 'jantar', local: 'Disney Springs · Town Center',
      alternativas: ['Polite Pig — churrasco de balcão, sem reserva'],
      precisaReserva: true, janelaAbre: '2026-09-26', janelaHora: '06:00 ET',
      canal: 'My Disney Experience, ou +1 407-560-0100', blocoId: 'b-2511-1930',
      nota: 'Cozinha do sul, do chef Art Smith: frango frito a US$ 34, pratos de US$ 16 a 42. ' +
            'A reserva abre 60 dias antes, em 26/09, às 6h ET. É o jantar de despedida.' },

    { id: 'r-voyagers', nome: 'Voyager’s Smokehouse', data: '2026-11-22', hora: '12:55',
      refeicao: 'almoco', local: 'SeaWorld · Waterfront', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Plano de refeição (All-Day Dining Deal)', blocoId: 'b-2211-1255',
      nota: 'Churrasco defumado: brisket texano, costela e frango. Coberto pelo plano de ' +
            'refeição do ingresso.' },

    { id: 'r-waterway', nome: 'Waterway Grill', data: '2026-11-22', hora: '18:05',
      refeicao: 'jantar', local: 'SeaWorld · ao lado do Sesame Street', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Plano de refeição (All-Day Dining Deal)', blocoId: 'b-2211-1805',
      nota: 'Churrasco grelhado, frango com sofrito e pernil. Coberto pelo plano de refeição. ' +
            'É onde o Papai Noel recebe visitas no Natal.' },

    { id: 'r-toadstool', nome: 'Toadstool Cafe', data: '2026-11-20', hora: '11:55',
      refeicao: 'almoco', local: 'Epic Universe · Super Nintendo World', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Sem reserva — conferir lista de espera no app da Universal', blocoId: 'b-2011-1155',
      nota: 'Não aceita reserva. As fontes divergem entre lista de espera pelo app e ordem de ' +
            'chegada: confiram no app ao entrar na Super Nintendo World, às 11h. Pico do ' +
            'almoço das 11h30 às 13h30. Faixa $ no mapa oficial: até US$ 15 por pessoa.' },

    { id: 'r-atlantic', nome: 'Atlantic', data: '2026-11-20', hora: '17:00',
      refeicao: 'jantar', local: 'Epic Universe · Celestial Park',
      alternativas: ['Mead Hall (Isle of Berk, sem reserva)'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'App / site da Universal Orlando', blocoId: 'b-2011-1700',
      statusPadrao: 'confirmado', confirmacaoPadrao: '639251824607987840',
      nota: 'RESERVADO — confirmação 639251824607987840, duas pessoas, 17h. Cheguem ' +
            '5 minutos antes: a mesa é segurada só por 15 minutos. Às 17h de propósito — o ' +
            'jantar cedo libera as três últimas horas para o Ministry e o Mine-Cart. Pratos de ' +
            'US$ 35 a 48.' },

    { id: 'r-cilantrillo', nome: 'El Cilantrillo', data: '2026-11-24', hora: '12:45',
      refeicao: 'almoco', local: 'Old Town Kissimmee',
      alternativas: ['World Food Trucks, trocando com o jantar se houver chuva prevista à noite'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Chegar direto — aceita reserva pelo Yelp ou +1 407-204-9685', blocoId: 'b-2411-1230',
      nota: 'Porto-riquenho de mesa, dentro do Old Town: mofongo, pernil, pargo frito. Pratos ' +
            'da rede perto de US$ 20. Na sexta, das 11h à meia-noite.' },

    { id: 'r-world-food-trucks', nome: 'World Food Trucks', data: '2026-11-24', hora: '18:30',
      refeicao: 'jantar', local: 'W Irlo Bronson, a 300 m do Old Town',
      alternativas: ['El Cilantrillo, trocando com o almoço se houver chuva prevista à noite'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Chegar direto', blocoId: 'b-2411-1830',
      nota: 'Mais de 100 food trucks, das 11h às 2h todos os dias. Estacionamento grátis. ' +
            'Balcão: não leva gorjeta.' },

    { id: 'r-plant-street-market', nome: 'Plant Street Market', data: '2026-11-21', hora: '11:45',
      refeicao: 'almoco', local: 'Winter Garden · 426 W Plant St',
      alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Balcão, sem reserva', blocoId: 'b-2111-1230',
      nota: 'Mercado gastronômico com 17 balcões — churrasco, ostras, empanadas, pizza a ' +
            'carvão, ceviche — e a cervejaria Crooked Can. Balcão: não leva gorjeta.' },

    { id: 'r-chickfila', nome: 'Chick-fil-A', data: '2026-11-21', hora: '17:35',
      refeicao: 'jantar', local: 'Orlando · 2885 S Orange Ave',
      alternativas: ['Comer dentro da arena: o Kia Center tem o Orlando Table, com balcões de restaurantes locais'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Balcão ou drive-thru, sem reserva', blocoId: 'b-2111-1735',
      nota: 'A rede clássica mais perto do Kia Center: 7 km, oito minutos de carro. Combo de ' +
            'sanduíche com waffle fries e bebida por uns US$ 11 por pessoa. Sábado das 6h às ' +
            '22h; fecha aos domingos. Balcão: não leva gorjeta.' },

    { id: 'r-red-lobster', nome: 'Red Lobster', data: '2026-11-21', hora: '22:05',
      refeicao: 'jantar', local: 'US-192 · 5690 W Irlo Bronson, ao lado do Old Town',
      alternativas: ['Miller’s Ale House, 8123 W Irlo Bronson, mesa com garçom até as 2h'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Chegar direto, ou Priority Seating pelo OpenTable', blocoId: 'b-2111-2205',
      nota: 'O jantar de verdade da noite, depois do jogo. No sábado ele vai até as 23h: ' +
            'saindo da arena às 21h30, vocês chegam por volta das 22h05 e têm quase uma hora. ' +
            'Se o jogo esticar, o Miller’s Ale House fica aberto até as 2h.' },

    { id: 'r-zambia', nome: 'Zambia Smokehouse', data: '2026-11-23', hora: '13:25',
      refeicao: 'almoco', local: 'Busch Gardens Tampa · Stanleyville', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Plano de refeição (All-Day Dining Deal)', blocoId: 'b-2311-1325',
      nota: 'Churrasco: costela, brisket e frango defumado. Coberto pelo plano de refeição.' },

    { id: 'r-dragonfire', nome: 'Dragon Fire Grill & Pub', data: '2026-11-23', hora: '17:20',
      refeicao: 'jantar', local: 'Busch Gardens Tampa · Pantopia', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Plano de refeição (All-Day Dining Deal)', blocoId: 'b-2311-1720',
      nota: 'Salão em estilo market, de balcão: frango, hambúrguer e cozinha asiática. O pub ' +
            'tem cerveja artesanal e drinques, pagos à parte. Coberto pelo plano de refeição.' },
  ],

  /* ---------------------------------------------------------------------------
     CHECKLIST PRÉ-VIAGEM — Parte 4 do documento + itens novos
     ------------------------------------------------------------------------ */
  checklist: [

    /* --- prazo curto (setembro) --- */
    { id: 'ck-0911', dataAlvo: '2026-09-11', hora: '06:00', fuso: 'ET',
      janelaReserva: true, critico: false, feitoPadrao: true,
      texto: 'The Boathouse (10/11) — RESERVADO, confirmação 2111918775',
      restauranteIds: ['r-boathouse'] },

    { id: 'ck-1209', dataAlvo: '2026-09-12', hora: null, fuso: null,
      janelaReserva: false, critico: false, feitoPadrao: true,
      texto: 'Magic Kingdom — sem reserva: almoço e jantar do dia 11 são de balcão ' +
             '(Columbia Harbour House e Casey’s)',
      restauranteIds: ['r-columbia-harbour'] },

    { id: 'ck-1409', dataAlvo: '2026-09-17', hora: null, fuso: null,
      janelaReserva: false, critico: false, feitoPadrao: true,
      texto: 'Sanaa (16/11, 19h50) — RESERVADO, confirmação 356258407484',
      nota:
        'A mesa fica na Kidani Village, a ala de villas do Animal Kingdom Lodge, e não dentro ' +
        'do parque. NÃO peçam mesa na janela: às 19h50 está escuro e não se vê a savana.\n\n' +
        'A Disney cobra taxa de não comparecimento e exige cancelamento com 2 horas de ' +
        'antecedência, pelo My Disney Experience ou pelo +1 407-939-3463.',
      restauranteIds: ['r-sanaa'] },

    { id: 'ck-1609', dataAlvo: '2026-09-16', dataEstimada: false, hora: null, fuso: null,
      janelaReserva: false, critico: false, feitoPadrao: true,
      texto: 'Oga’s Cantina (15/11, 17h05) — RESERVADO, confirmação 356259476987',
      nota:
        'Limite de 45 minutos por grupo, e o plano de refeição não é aceito.\n\n' +
        'O SCI-FI DINE-IN FICOU DE FORA. Na abertura da janela o restaurante só oferecia ' +
        '16h45 e 19h40 para 15/11: o primeiro colide com o Oga’s das 17h05 e o segundo com o ' +
        'Fantasmic das 20h. O jantar do dia passou a ser de balcão no Sunset Ranch Market, ' +
        'que fica ao lado do teatro.\n\n' +
        'Se aparecer horário entre 18h e 18h30 numa conferência futura, ele volta a caber: ' +
        'são doze minutos de caminhada do Oga’s até a Commissary Lane, e mais sete de lá ' +
        'até a Sunset Blvd.',
      restauranteIds: ['r-ogas'] },

    { id: 'ck-1709', dataAlvo: '2026-09-17', hora: null, fuso: null,
      janelaReserva: false, critico: false, feitoPadrao: true,
      texto: 'Epcot (13/11): sem mesa — a tarde e a noite são as barracas do Food & Wine',
      nota:
        'O JANTAR DO DIA 13 É O FOOD & WINE — quatro voltas de barracas ao longo da tarde e ' +
        'da noite, a última às 20h, antes de pegar lugar para o Luminous.\n\n' +
        'A janela de mesa do dia 13 fica registrada aqui como decisão tomada: o dia segue ' +
        'sem reserva, com as barracas.',
      restauranteIds: ['r-epcot-mesa'] },

    { id: 'ck-ingresso', dataAlvo: '2026-09-17', validaAte: '2026-11-11',
      hora: null, fuso: null, janelaReserva: false, critico: false, feitoPadrao: true,
      texto: 'Ingresso Disney de 4 dias — válido por 7 dias corridos a partir da data de início',
      nota:
        'CONFIRMADO COM A AGÊNCIA em 17/09/2026: são 4 dias de parque, válidos por 7 DIAS ' +
        'CORRIDOS contados da data de início. Ou seja, é ingresso de DATAS FIXAS.\n\n' +
        'CONSEQUÊNCIA 1 — A COMPRA DE LIGHTNING LANE É UMA SÓ, em 08/11 às 7h ET, e cobre os ' +
        'quatro dias, Multi Pass e Single Pass. Some o cenário de três compras separadas, ' +
        'que incluía uma às 7h ET de 10/11, com vocês no ar entre o Rio e Bogotá.\n\n' +
        'CONSEQUÊNCIA 2 — A JANELA AMARRA O ROTEIRO. Começando em 11/11, o ingresso vale até ' +
        '17/11. Os quatro dias de Disney são 11, 13, 15 e 16: cabem, com um dia de folga. Se ' +
        'algum dia de Disney for remanejado para depois de 17/11, o ingresso não cobre.\n\n' +
        'CONFIRAM A DATA DE INÍCIO NO VOUCHER. Ela é o que dispara a contagem, e é ela que ' +
        'tem de ser 11/11.',
      pesquisa: '2026-09-17',
      restauranteIds: [] },

    { id: 'ck-shuttle', dataAlvo: '2026-10-06', validaAte: '2026-11-15', dataEstimada: true,
      motivoData: 'Junto com a reserva do carro, para decidir transporte de uma vez',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Confirmar o transfer gratuito do hotel para Magic Kingdom e Hollywood Studios',
      nota:
        'O Travelodge anuncia shuttle cortesia para os dois parques. Se o horário servir, ' +
        'economiza Uber nos dias 11 e 15. ATENÇÃO: shuttle de hotel quase sempre chega ' +
        'depois da abertura e tem volta em horário fixo — provavelmente NÃO serve para o ' +
        'rope drop das 9h, que é a estratégia dos dois dias. Vale confirmar o horário real ' +
        'antes de contar com ele. O roteiro sai às 6h45 no dia 11 e às 7h no dia 15: se o ' +
        'primeiro shuttle sair depois disso, ignorem.',
      restauranteIds: [] },

    { id: 'ck-carro', dataAlvo: '2026-10-06', validaAte: '2026-11-20', dataEstimada: true, motivoData: 'Preço de locadora sobe perto da data', hora: null, fuso: null,
      janelaReserva: false, critico: true,
      texto: 'Reservar o carro na Avis do Old Town: retirada 20/11 às 15h, devolução 25/11 às 15h',
      nota:
        'A Avis fica dentro do Old Town (5770 W Irlo Bronson, suíte 434), a três minutos do ' +
        'hotel, aberta das 7h às 19h todos os dias. Reservem das 15h às 15h: o aluguel é ' +
        'contado em períodos de 24 horas, e assim são sete diárias certas.\n\n' +
        'Na reserva e no balcão, RECUSEM o e-Toll Unlimited: ele cobra de US$ 11 a 26 por dia ' +
        'de aluguel, com ou sem pedágio.',
      pesquisa: '2026-09-11',
      restauranteIds: [] },

    { id: 'ck-columbia', dataAlvo: '2026-09-11', dataEstimada: false, hora: null, fuso: null,
      janelaReserva: false, critico: false, feitoPadrao: true,
      texto: 'Columbia Restaurant (14/11, 12h30) — RESERVADO, confirmação 2110915279',
      restauranteIds: ['r-columbia'] },

    /* --- prazo médio (outubro) --- */
    { id: 'ck-ing-disney', dataAlvo: '2026-10-01', validaAte: '2026-11-08', dataEstimada: true,
      motivoData: 'Muito antes de 08/11, porque ingresso não vinculado bloqueia o Lightning Lane',
      hora: null, fuso: null, janelaReserva: false, critico: true,
      texto: 'Ingressos Disney aparecendo no My Disney Experience — nos DOIS perfis',
      nota:
        'A compra já está feita; isto é conferência de que apareceu. Riscar só quando ' +
        'os 4 dias estiverem visíveis no app da Bianca também, não só no seu.\n\n' +
        'É o item que mais bloqueia coisa: sem ingresso vinculado não há Lightning ' +
        'Lane em 08/11, e sem Lightning Lane o dia 11 inteiro muda. Se algo estiver ' +
        'errado, resolver com a agência leva dias — por isso a data é 01/10 e não ' +
        'véspera.',
      restauranteIds: [] },

    { id: 'ck-mde-cartao', dataAlvo: '2026-10-01', validaAte: '2026-11-11', dataEstimada: true,
      motivoData: 'Na mesma sessão em que vocês conferem os ingressos no My Disney Experience',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Cartão de crédito salvo no My Disney Experience, nos DOIS perfis',
      nota:
        'É o que destrava o mobile order, e o mobile order aparece quatro vezes nos dias ' +
        'fechados: Columbia Harbour House e Casey’s no dia 11, Satu’li Canteen no dia 16 e ' +
        'Docking Bay 7 no dia 15. Cada um desses pula de 20 a 30 minutos de fila de balcão ' +
        'que o roteiro já não conta.\n\n' +
        'Sem cartão salvo, não pula — e descobrir isso na noite de 10/11, depois de doze ' +
        'horas de viagem, é tarde.',
      restauranteIds: [] },

    { id: 'ck-horarios-epic', dataAlvo: '2026-11-01', validaAte: '2026-11-19', dataEstimada: true,
      motivoData: 'Horários de show de Natal só saem perto da temporada, que começa em 14/11',
      hora: null, fuso: null, janelaReserva: false, critico: true,
      texto: 'Horário do Epic Universe em 20/11 — abertura e FECHAMENTO',
      nota:
        'A ABERTURA move a manhã inteira: é a referência do dia. O roteiro assume 9h.\n\n' +
        'O FECHAMENTO é o que importa mais. O Battle at the Ministry e o Mine-Cart Madness ' +
        'estão colados nele, porque as duas maiores filas do parque só ficam razoáveis nas ' +
        'últimas horas. O roteiro assume 21h, o típico de quinta em meados de novembro. Se ' +
        'for outro, vale o plano B2 do dia 19.\n\n' +
        'A GRADE DE SHOW NÃO CABE AQUI: o Untrainable Dragon, as fontes do Celestial ' +
        'Park e as celebrações de Berk e da Place Cachée só aparecem no app no próprio ' +
        'dia, e viraram tarefa da manhã de 20/11.',
      restauranteIds: [] },

    { id: 'ck-epa-epic', dataAlvo: '2026-11-12', validaAte: '2026-11-19', dataEstimada: true,
      motivoData: 'A lista muda por temporada: uma semana antes, e de novo na véspera',
      hora: null, fuso: null, janelaReserva: false, critico: true,
      texto: 'Conferir quais lands do Epic estão no Early Park Admission em 20/11',
      nota:
        'O MECANISMO JÁ ESTÁ RESOLVIDO: durante o Early Park Admission o Celestial Park fica ' +
        'aberto para todo mundo, e a checagem de hóspede de hotel é feita na porta de cada ' +
        'land. Vocês entram cedo, mas não passam dos portais que participam.\n\n' +
        'O QUE FALTA CONFERIR é quais lands participam em novembro. Desde fevereiro de 2026, ' +
        'conferido de novo em 16/06/2026, são Ministry of Magic, Super Nintendo World e Isle ' +
        'of Berk — e o dia 19 começa na Dark Universe justamente por ela estar fora.\n\n' +
        'A LISTA MUDOU PELO MENOS TRÊS VEZES EM DEZOITO MESES. Se a Dark Universe voltar e o ' +
        'Ministry sair, vale o plano B do dia 19: os dois blocos trocam de lugar.\n\n' +
        'E CONFIRAM O LOCKER DO DRAGON RACER’S RALLY: o mapa oficial marca "sem objetos ' +
        'soltos" nele também, e o guia de segurança fala em três atrações. Se forem quatro, o ' +
        'bloco das 15h ganha os 10 a 15 minutos de armário.',
      pesquisa: '2026-09-12',
      restauranteIds: [] },

    { id: 'ck-ing-universal', dataAlvo: '2026-10-25', validaAte: '2026-11-14', dataEstimada: true,
      motivoData: 'Duas semanas antes da viagem, com folga para acionar a agência',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Ingressos Universal aparecendo no app — nos DOIS perfis',
      nota:
        'Cobre os dias 14, 17, 19 e 20. Confiram especificamente que é PARK-TO-PARK e que o ' +
        'Epic Universe está incluído: o Hogwarts Express do dia 23 só funciona com ' +
        'park-to-park, e o Epic é ingresso à parte em muitas combinações.\n\n' +
        'O QUE A BIANCA APUROU: 14 dias de validade, com entradas ilimitadas no período. É a ' +
        'família de ingresso que a Universal vende para quem vem de fora — com o Volcano Bay ' +
        'fechado de 20/10/2026 a 31/03/2027, a versão da viagem é a de três parques. ' +
        'Confirmem com a agência QUAL PRODUTO e QUAL A DATA DE INÍCIO: se a validade termina ' +
        'em 24/11, ela começa em 11/11, e o dia 23 é o penúltimo dia útil dela.\n\n' +
        'COM ENTRADAS ILIMITADAS, repetir parque não gasta dia: dá para voltar ao Epic na ' +
        'manhã do dia 20 ou ao Islands em qualquer dia até o fim da validade.\n\n' +
        'Riscar só quando aparecer no app da Bianca também.',
      restauranteIds: [] },

    { id: 'ck-ing-united', dataAlvo: '2026-10-25', validaAte: '2026-11-22', dataEstimada: true,
      motivoData: 'Junto com os da Universal, para resolver tudo numa conferência só',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Ingressos SeaWorld e Busch Gardens (Promo Park) — com o plano de refeição',
      nota:
        'Os dois parques são da mesma empresa e vieram na mesma compra. Confiram que o ' +
        'PLANO DE REFEIÇÃO — o All-Day Dining Deal, uma refeição a cada 90 minutos — está ' +
        'incluído nos dois: os dias 22 e 24 usam três refeições dele cada um — almoço, ' +
        'lanche e jantar. Sem plano, o custo desses dias muda.\n\n' +
        'Riscar só quando aparecer no app da Bianca também.',
      restauranteIds: [] },


    { id: 'ck-kres', dataAlvo: '2026-09-11', dataEstimada: false,
      hora: null, fuso: null, janelaReserva: false, critico: false, feitoPadrao: true,
      texto: 'Kres Chophouse (18/11, 17h45) — RESERVADO, confirmação 2110248556',
      nota:
        'O jantar tem 65 minutos antes da catraca, e a arena fica a cinco minutos a pé. ' +
        'Avisem na chegada que vocês têm hora.\n\n' +
        'Alternativa no mesmo bairro, se algo cair: The Boheme, no Grand Bohemian.',
      restauranteIds: ['r-kres'] },

    { id: 'ck-mythos', dataAlvo: '2026-09-11', dataEstimada: false, hora: null, fuso: null,
      janelaReserva: false, critico: true, feitoPadrao: true,
      texto: 'Mythos (19/11, 19h15) — RESERVADO, confirmação 639251823318530048',
      restauranteIds: ['r-mythos'] },

    { id: 'ck-lombards', dataAlvo: '2026-09-11', dataEstimada: false, hora: null, fuso: null,
      janelaReserva: false, critico: true, feitoPadrao: true,
      texto: 'Lombard’s Seafood Grille (17/11, 18h45) — RESERVADO, confirmação 639247504692187392',
      restauranteIds: ['r-lombards'] },

    { id: 'ck-homecomin', dataAlvo: '2026-09-26', validaAte: '2026-11-25', dataEstimada: false,
      hora: '06:00', fuso: 'ET', janelaReserva: true, critico: true,
      texto: 'Reservar o Homecomin’ para as 19h30 de 25/11 — a janela de 60 dias abre às 6h ET',
      nota:
        'Restaurante do Disney Springs reserva com 60 dias de antecedência, às 6h de Orlando — ' +
        '7h em Brasília. Para 25/11, a janela abre em 26/09.\n\n' +
        'É o restaurante mais concorrido do Disney Springs, na véspera de Thanksgiving, e o ' +
        'jantar de despedida da viagem. Pelo My Disney Experience ou pelo +1 407-560-0100.\n\n' +
        'Sem mesa, o Polite Pig é churrasco de balcão, no mesmo Disney Springs.',
      restauranteIds: ['r-homecomin'] },

    { id: 'ck-atlantic', dataAlvo: '2026-09-11', dataEstimada: false,
      hora: null, fuso: null, janelaReserva: false, critico: true, feitoPadrao: true,
      texto: 'Atlantic (20/11, 17h) — RESERVADO, confirmação 639251824607987840',
      restauranteIds: ['r-atlantic'] },

    { id: 'ck-powerband', dataAlvo: '2026-10-15', validaAte: '2026-11-19', dataEstimada: true, motivoData: 'Prazo de outubro, com folga para o site do parque', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Decidir sobre a Power-Up Band do Epic Universe (~US$ 40)',
      restauranteIds: [] },

    { id: 'ck-esim', dataAlvo: '2026-10-25', validaAte: '2026-11-10', dataEstimada: true,
      motivoData: 'Duas semanas antes, com folga para resolver a ativação com as operadoras',
      hora: null, fuso: null, janelaReserva: false, critico: true,
      texto: 'Ativar o roaming nas duas linhas e confirmar a cobertura na Colômbia',
      nota:
        'São duas operadoras diferentes, com regras diferentes. Isso é bom — dá ' +
        'redundância, e dentro de parque lotado uma pode pegar sinal onde a outra não ' +
        'pega. Mas o custo funciona de jeito oposto nas duas.\n\n' +
        'PEDRO · CLARO PASSAPORTE AMÉRICAS\n' +
        'Vem incluso em todo plano pós-pago, sem custo extra, e usa a MESMA franquia do ' +
        'plano brasileiro. Só passa a cobrar R$ 39,90 por dia SE a franquia acabar. ' +
        'Ativação pelo *468, gratuito, ou pelo Minha Claro.\n\n' +
        'BIANCA · VIVO TRAVEL\n' +
        'O plano dela também inclui o uso internacional, com os EUA cobertos. A conferir é ' +
        'só a ativação: alguns planos pedem que o serviço seja ligado no app da operadora ' +
        'antes da viagem, e ninguém quer descobrir isso no desembarque.\n\n' +
        'NOS DOIS CASOS: ligar o roaming de dados nos ajustes do aparelho, além de ativar ' +
        'no app da operadora. E confirmar que a Colômbia está coberta: as duas conexões da ' +
        'viagem são em Bogotá, na ida e na volta.',
      restauranteIds: [] },

    { id: 'ck-vip-outlet', dataAlvo: '2026-11-05', validaAte: '2026-11-12', dataEstimada: true,
      motivoData: 'Cadastro leva minutos; basta estar feito antes de embarcar',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Cadastrar no Simon VIP Club para o cupom do outlet sair de graça',
      nota:
        'O cupom book físico do balcão custa US$ 10 — grátis só para residentes da ' +
        'Flórida.\n\n' +
        'O caminho gratuito é outro: cadastro no Simon VIP Club em ' +
        'premiumoutlets.com/vip, e o Savings Passport fica no celular. Precisa ser ' +
        'feito ANTES de viajar, porque no balcão só oferecem o pago.\n\n' +
        'Vale para o dia 12, no Orlando International Premium Outlets.',
      restauranteIds: [] },

    { id: 'ck-natal-datas', dataAlvo: '2026-10-15', validaAte: '2026-11-24', dataEstimada: true, motivoData: 'As datas dos eventos saem com antecedência', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Confirmar que 22/11 tem Christmas Celebration (SeaWorld) e 24/11 tem ' +
             'Christmas Town (Busch Gardens) — ambos rodam em datas selecionadas',
      nota:
        'O calendário do Queue-Times já marca 22/11 com a Christmas Celebration e horário ' +
        'das 9h às 21h. É previsão de terceiro: a confirmação é o calendário oficial do ' +
        'SeaWorld, e com ela a referência do dia 22.\n\n' +
        'E CONFIRAM SE O SEAQUEST: LEGENDS OF THE DEEP JÁ ABRIU. O mapa de julho o marca como ' +
        '"all-new, coming 2026", a leste, perto do Sea Harbor. O plano B do dia 22 depende ' +
        'disso.',
      restauranteIds: [] },

    { id: 'ck-hotel', dataAlvo: '2026-11-05', validaAte: '2026-11-10', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reserva do Travelodge salva OFFLINE nos dois celulares',
      nota:
        'Mesma lógica da apólice: e-mail sem internet não abre, e vocês chegam depois de ' +
        'uma noite inteira de voo, num país onde ninguém fala português. O endereço também ' +
        'vai escrito ' +
        'no papel — 5367 W Irlo Bronson Memorial Hwy, Kissimmee — porque é o que resolve ' +
        'se o celular não conectar no aeroporto.',
      restauranteIds: [] },

    { id: 'ck-seguro', dataAlvo: '2026-11-05', hora: null, fuso: null,
      janelaReserva: false, critico: true,
      texto: 'Apólice do seguro salva OFFLINE nos dois celulares, e banco avisado',
      nota:
        'DUAS COISAS, e as duas são de antes de embarcar.\n\n' +
        'A APÓLICE: salvem o PDF offline no celular dos DOIS, não só no e-mail. O que um ' +
        'hospital americano pede é o número da apólice e o telefone da central, e os dois ' +
        'estão nela. E-mail sem internet não abre.\n\n' +
        'O BANCO: avisem da viagem. Compra internacional inesperada é motivo comum de ' +
        'bloqueio, e desbloquear de fora dá trabalho. Levem um cartão de reserva guardado ' +
        'em outro lugar que não a mesma carteira, e uns US$ 100 em espécie.\n\n' +
        'Detalhes na dica “Quando dá errado”, no Guia.',
      restauranteIds: [] },

    { id: 'ck-horarios-ak', dataAlvo: '2026-10-11', validaAte: '2026-11-16', dataEstimada: true,
      motivoData: 'Um mês antes, com folga para ajustar a reta final se o fechamento mudar',
      hora: null, fuso: null, janelaReserva: false, critico: true,
      texto: 'Animal Kingdom 16/11 — confirmar 8h às 18h no app da Disney (Early Entry 7h30)',
      nota:
        'O CALENDÁRIO PUBLICADO DÁ 8h ÀS 18h PARA 16/11, com Early Entry às 7h30, conferido ' +
        'em 16/09. É o que o dia assume — a referência está em 8h, a saída é 6h30 e a reta ' +
        'final do fim da tarde está encaixada nesse fechamento. Confirmem no app da Disney.\n\n' +
        'O Sanaa das 19h50 deixa de ter risco: com o parque fechando às 18h, a fila do ' +
        'Flight of Passage no último minuto termina a tempo da mesa.\n\n' +
        'Confiram também o horário de fechamento do KILIMANJARO SAFARIS, que fecha 30 a 60 ' +
        'minutos antes do parque e sustenta o bloco das 16h30.',
      pesquisa: '2026-09-10',
      restauranteIds: [] },

    { id: 'ck-mco-reserve', dataAlvo: '2026-11-19', validaAte: '2026-11-26', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar o MCO Reserve para a volta de 26/11',
      nota:
        'É GRÁTIS, em flymco.com, e a reserva abre 7 dias antes do voo: para 26/11, em ' +
        '19/11. Garante uma faixa de ' +
        'horário numa fila dedicada do raio-x da TSA, sem precisar de TSA PreCheck nem ' +
        'CLEAR. Uma reserva cobre até 10 pessoas, então é uma só para os dois.\n\n' +
        'O Terminal C opera das 5h às 19h, para voos que decolam entre 6h30 e 22h30 — a ' +
        'decolagem de vocês é às 14h10, então cabe. Reservem a faixa mais perto das 11h55, ' +
        'logo depois do check-in.\n\n' +
        'ATENÇÃO AO QUE ISSO NÃO É: o MCO Reserve é para a SAÍDA, no raio-x da TSA. Não ' +
        'tem nada a ver com a fila da imigração na chegada, em 10/11 — para aquela não ' +
        'existe atalho disponível a vocês. O Mobile Passport Control, que seria o ' +
        'equivalente, só aceita americanos, residentes permanentes, canadenses com B1/B2 ' +
        'e quem entra pelo Visa Waiver. O Brasil não está no Visa Waiver.',
      pesquisa: '2026-09-10',
      restauranteIds: [] },

    { id: 'ck-ll-0811', dataAlvo: '2026-11-08', validaAte: '2026-11-15', hora: '07:00', fuso: 'ET',
      janelaReserva: false, critico: true,
      texto: 'Lightning Lane — A COMPRA: os quatro dias de Disney de uma vez',
      nota:
        'É A AÇÃO MAIS CRÍTICA DA VIAGEM e acontece uma vez só. O ingresso é de datas fixas, ' +
        'confirmado com a agência em 17/09: a janela abre 3 dias antes do primeiro dia e cobre ' +
        'todos os dias do ingresso, Multi Pass e Single Pass. Vocês têm cerca de 5 minutos ' +
        'antes de o sistema soltar as seleções. Cheguem decididos:\n\n' +
        'DIA 11, MAGIC KINGDOM — Multi Pass: lista alta Peter Pan; lista baixa Mansão e Buzz. ' +
        'SINGLE PASS DO TRON, ~US$ 20–23 por pessoa: sem Early Entry ele não é opção de rope ' +
        'drop e o standby fica em 50 a 90 minutos. O do Seven Dwarfs NÃO entra.\n\n' +
        'DIA 13, EPCOT — Multi Pass: lista alta Frozen Ever After; lista baixa Mission: SPACE ' +
        'e Soarin’. Single Pass do Cosmic Rewind, janela entre 10h15 e 10h45.\n\n' +
        'DIA 15, HOLLYWOOD STUDIOS — Multi Pass: lista alta Rock ’n’ Roller Coaster; lista ' +
        'baixa Torre do Terror e Star Tours. Single Pass do Rise of the Resistance, janela ' +
        'entre 10h30 e 11h.\n\n' +
        'DIA 16, ANIMAL KINGDOM — Multi Pass nenhum, o dia não usa. Mas SINGLE PASS DO ' +
        'FLIGHT OF PASSAGE, ~US$ 18–20 por pessoa: é o que mais esgota antes da data, e ' +
        'esta é a única janela de compra de vocês. Anotem a hora de retorno.\n\n' +
        'NÃO peçam o Big Thunder nem o Jungle Cruise: os dois são lista alta e vocês vão ' +
        'fazer os dois de graça, no standby, antes das 11h. O Space Mountain entra rolando ' +
        'dentro do parque, assim que vocês usarem a Mansão. O Remy entra rolando no dia 13, na ' +
        'saída do Mission: SPACE, e o Runaway Railway no dia 15, depois do Rock ’n’ Roller.\n\n' +
        'SE ALGUMA SELEÇÃO NÃO SAIR HOJE, ela não está perdida: a janela do dia continua ' +
        'aberta depois. A pendência de 10/11 é justamente para conferir isso ao pousar.',
      pesquisa: '2026-09-17',
      restauranteIds: [] },

    { id: 'ck-ll-1011', dataAlvo: '2026-11-10', validaAte: '2026-11-13',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Ao pousar: conferir no app que as seleções de 08/11 estão todas lá',
      nota:
        'NÃO É COMPRA E NÃO TEM HORA. Com o ingresso de datas fixas, tudo saiu numa vez só em ' +
        '08/11 — isto aqui é a rede de segurança.\n\n' +
        'Abram o My Disney Experience depois do pouso, às 12h35, e confiram que estão lá, nos ' +
        'DOIS perfis: o Multi Pass dos dias 11, 13 e 15, o Single Pass do Cosmic Rewind (13) e ' +
        'o do Rise of the Resistance (15).\n\n' +
        'Se faltar alguma, comprem na hora: a janela de cada dia segue aberta depois de 08/11, ' +
        'só com pior disponibilidade. Quanto mais cedo resolverem, melhor — e é muito melhor ' +
        'descobrir hoje do que na véspera de cada parque.\n\n' +
        'E SE EM 08/11 SÓ O DIA 11 TIVER APARECIDO — ou seja, se o sistema tratar vocês pela ' +
        'regra de 3 dias por visita e não pela do ingresso datado — então a janela do dia 13 ' +
        'é HOJE às 7h ET e a do dia 15 é 12/11 às 7h ET. Nesse caso ponham alarme para as ' +
        'duas. É o único cenário em que a compra volta a ser fracionada.',
      pesquisa: '2026-09-17',
      restauranteIds: [] },

    { id: 'ck-oakley', dataAlvo: '2026-11-14', validaAte: '2026-11-25', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Comprar o Oakley Meta Vanguard no app do Best Buy, com retirada no Best Buy do ' +
             'Millenia (4155 Millenia Blvd)',
      nota:
        'A retirada é no dia 18, às 14h15, logo depois do almoço no Millenia.\n\n' +
        'POR QUE HOJE: o Best Buy segura o pedido por 5 dias e depois cancela e devolve o ' +
        'dinheiro. Comprado no dia 14, ele espera a retirada do dia 18 — e sobra tempo se a ' +
        'loja não tiver estoque e o app oferecer retirada em data mais adiante.\n\n' +
        'ANTES DE PAGAR, confiram no app que a loja do Millenia tem a cor e a lente ' +
        'escolhidas. Se a retirada do dia 18 falhar, o plano B do dia 25 assume.',
      pesquisa: '2026-09-11',
      restauranteIds: [] },

    { id: 'ck-horarios-mk', dataAlvo: '2026-09-12', validaAte: '2026-11-11',
      hora: null, fuso: null, janelaReserva: false, critico: false, feitoPadrao: true,
      texto: 'Magic Kingdom 11/11 — 9h às 22h, Early Entry 8h30 e os fogos às 20h',
      nota:
        'O PARQUE SAIU EM 12/09: 9h às 22h, com Early Entry às 8h30. É exatamente o que o ' +
        'dia assumia, então a referência já está certa e nenhum bloco mudou.\n\n' +
        'OS FOGOS TAMBÉM SAÍRAM: Happily Ever After às 20h, exatamente o que o dia assumia.\n\n' +
        'A HORA DOS DESFILES NÃO CABE AQUI. O app da Disney só mostra a grade de show e ' +
        'desfile do dia em que você está: data futura mostra apenas o horário de ' +
        'funcionamento do parque. Por isso o Festival of Fantasy e o Disney Starlight viraram ' +
        'tarefa da manhã do dia 11.',
      pesquisa: '2026-09-15',
      restauranteIds: [] },

    { id: 'ck-horarios-dhs-epcot', dataAlvo: '2026-09-16', validaAte: '2026-11-16',
      hora: null, fuso: null, janelaReserva: false, critico: false, feitoPadrao: true,
      texto: 'Epcot 13/11 e Hollywood Studios 15/11 — 9h às 21h nos dois, Early Entry 8h30',
      nota:
        'HOLLYWOOD STUDIOS, 15/11: 9h às 21h, oficial desde 12/09, com Early Entry às 8h30.\n\n' +
        'EPCOT, 13/11: 9h às 21h com Early Entry às 8h30, pelo calendário publicado, ' +
        'conferido em 16/09.\n\n' +
        'As duas manhãs estão certas. A HORA DO LUMINOUS E DO FANTASMIC segue o FECHAMENTO ' +
        'do parque, não a abertura, e só aparece no app no próprio dia — por isso virou ' +
        'tarefa da manhã de 13/11 e de 15/11. O roteiro assume o padrão: Luminous às 21h e ' +
        'Fantasmic às 20h.',
      pesquisa: '2026-09-16',
      restauranteIds: [] },

    { id: 'ck-horarios', dataAlvo: '2026-10-10', validaAte: '2026-11-24', dataEstimada: true,
      motivoData: 'Universal, SeaWorld e Busch Gardens publicam novembro sem data fixa: confiram em outubro e de novo na semana da viagem',
      hora: null, fuso: null, janelaReserva: false, critico: true,
      texto: 'Conferir os horários oficiais de 17, 19, 20, 22 e 23/11 e ajustar a referência de cada dia',
      nota:
        'É só editar o horário de abertura no dia — os blocos ancorados deslocam sozinhos.\n\n' +
        'AQUI É SÓ ABERTURA E FECHAMENTO. A grade de show e desfile desses parques é tarefa ' +
        'da manhã de cada dia: 14, 17, 22 e 23/11 têm pendência própria.',
      restauranteIds: [] },

    { id: 'ck-show-1111', dataAlvo: '2026-11-11', validaAte: '2026-11-11', hora: '07:45',
      fuso: null, janelaReserva: false, critico: true,
      texto: 'HOJE, no portão: a hora do Festival of Fantasy e do desfile noturno',
      nota:
        'O app da Disney só mostra a grade de desfile do dia em que vocês estão. Abram o My ' +
        'Disney Experience ainda na fila do portão e leiam a grade de hoje.\n\n' +
        'O FESTIVAL OF FANTASY ANCORA A TARDE INTEIRA. O roteiro assume 15h, que é o padrão. ' +
        'A travessia para a Tomorrowland às 15h12 e a janela do TRON andam com ele: se sair ' +
        'outra hora, mexam no bloco do desfile — nada disso desloca com a abertura.\n\n' +
        'O DESFILE NOTURNO, Disney Starlight: Dream the Night Away, não roda em noite de festa ' +
        'de Natal, e 11/11 não é noite de festa. Mesma rota do diurno, mesmo corte do parque. ' +
        'Se rodar perto das 21h, a Main Street estará tomada na saída das 22h — e o Seven ' +
        'Dwarfs e o TRON ficam ainda mais vazios enquanto ele passa.\n\n' +
        'O parque e os fogos já estão confirmados: 9h às 22h, Early Entry 8h30 e Happily Ever ' +
        'After às 20h. Na mesma tela, vejam se a Tiana’s voltou da reforma.',
      restauranteIds: [] },

    { id: 'ck-show-1311', dataAlvo: '2026-11-13', validaAte: '2026-11-13', hora: '08:15',
      fuso: null, janelaReserva: false, critico: false,
      texto: 'HOJE, no portão: a hora do Luminous',
      nota:
        'O Luminous roda junto do fechamento e o roteiro assume 21h. O parque é 9h às 21h com ' +
        'Early Entry às 8h30, já confirmado — o que falta é só a hora do show, que o app ' +
        'publica no próprio dia.\n\n' +
        'Se o show for em outra hora, ajustem o bloco dele. A posição das 20h30, a última ' +
        'volta do Food & Wine às 20h e a volta ao hotel NÃO andam junto: ajustem à mão.',
      restauranteIds: [] },

    { id: 'ck-show-1411', dataAlvo: '2026-11-14', validaAte: '2026-11-14', hora: '09:00',
      fuso: null, janelaReserva: false, critico: true,
      texto: 'HOJE, antes de sair: a hora do Grinchmas e da projeção no castelo',
      nota:
        'É no app da Universal, não no da Disney. Confiram de manhã, com folga, porque o ' +
        'Grinchmas é a REFERÊNCIA do dia: ajustando ele, deslocam a saída das 16h, a entrada ' +
        'no parque e a fila das 17h.\n\n' +
        'A projeção no castelo, o Hippogriff, o jantar no Three Broomsticks e a volta são ' +
        'fixos e se ajustam à mão.\n\n' +
        '14/11/2026 É O DIA DE ESTREIA da temporada de Natal da Universal: o Grinchmas e o ' +
        'Christmas in The Wizarding World começam exatamente hoje e vão até 03/01. Contem com ' +
        'casa cheia de estreia, e confiram a grade com atenção — primeiro dia é o menos ' +
        'previsível de todos.',
      pesquisa: '2026-09-17',
      restauranteIds: [] },

    { id: 'ck-show-1511', dataAlvo: '2026-11-15', validaAte: '2026-11-15', hora: '08:00',
      fuso: null, janelaReserva: false, critico: false,
      texto: 'HOJE, no portão: a hora do Fantasmic!',
      nota:
        'Com o parque fechando às 21h, o padrão é 20h, que é o que o roteiro assume. O parque ' +
        'está oficial desde 12/09: 9h às 21h, Early Entry 8h30.\n\n' +
        'Se o Fantasmic for em outra hora, ajustem o bloco do show. A posição das 19h45, as ' +
        'compras da Sunset às 19h25 e o jantar de balcão das 18h10 NÃO andam junto: ajustem à ' +
        'mão, nessa ordem, de trás para frente.\n\n' +
        'Confiram na mesma tela a grade do INDIANA JONES EPIC STUNT SPECTACULAR, que o dia ' +
        'assume às 15h25. Ele tem poucas sessões por dia e é a última coisa antes da parada ' +
        'e do Oga’s — se a sessão for outra, é ele que anda, não o Oga’s, que tem reserva.',
      restauranteIds: [] },

    { id: 'ck-show-1611', dataAlvo: '2026-11-16', validaAte: '2026-11-16', hora: '07:15',
      fuso: null, janelaReserva: false, critico: false,
      texto: 'HOJE, no portão: a grade do Festival of the Lion King',
      nota:
        'O Festival of the Lion King tem poucas sessões por dia e a grade sai no app da Disney ' +
        'no próprio dia. O roteiro assume chegar às 11h30 para o show das 11h50.\n\n' +
        'Ele cai entre o Gorilla Falls e o almoço no Satu’li das 12h30, que tem mobile order: ' +
        'se a sessão for outra, é a janela de retirada do almoço que se ajusta, não o show.\n\n' +
        'O parque está no calendário como 8h às 18h, com Early Entry às 7h30 — isso é outra ' +
        'pendência e já foi conferido.',
      restauranteIds: [] },

    { id: 'ck-show-1711', dataAlvo: '2026-11-17', validaAte: '2026-11-17', hora: '08:30',
      fuso: null, janelaReserva: false, critico: true,
      texto: 'HOJE, no portão: o desfile da Macy’s, o CineSational e o fechamento do parque',
      nota:
        'O DESFILE DA MACY’S É O MAIS INCERTO DA VIAGEM. O dia assume 17h30, mas em anos ' +
        'anteriores ele rodou tanto às 17h30 quanto às 19h30 — duas horas de diferença. Três ' +
        'blocos dependem dele e se ajustam à mão: o desfile, o jantar no Lombard’s, que tem ' +
        'reserva e se remarca pelo app da Universal, e o Beco Diagonal à noite.\n\n' +
        'CONFIRAM TAMBÉM O FECHAMENTO DE HOJE. O parque fecha entre 19h e 22h conforme a ' +
        'época, e a temporada de Natal estica. Se fechar às 19h, o Beco à noite não existe e ' +
        'o jantar vira CityWalk, que fica fora da catraca.\n\n' +
        'E O CINESATIONAL: o show noturno da lagoa, que o mapa oficial lista e o roteiro não ' +
        'usa, costuma rodar no fechamento — a hora em que vocês saem. Se estiver na grade de ' +
        'hoje, decidam de manhã: ficar para ele custa a saída no pico.\n\n' +
        'Confiram também a grade do BOURNE STUNTACULAR, que o dia assume às 16h30, logo antes do desfile. São poucas sessões por dia e as duas coisas são seguidas.',
      restauranteIds: [] },

    { id: 'ck-show-1911', dataAlvo: '2026-11-19', validaAte: '2026-11-19', hora: '08:15',
      fuso: null, janelaReserva: false, critico: false,
      texto: 'HOJE, no portão: a hora da projeção no castelo de Hogwarts',
      nota:
        'A projeção de Hogsmeade à noite é o único bloco de show do dia e o roteiro assume ' +
        '18h50. Na temporada de Natal ela roda em sessões curtas e repetidas, com a grade ' +
        'publicada no app da Universal no próprio dia.\n\n' +
        'ATENÇÃO À COLISÃO COM O MYTHOS: o jantar é às 19h15, com reserva e tolerância curta. ' +
        'Se a sessão da projeção for depois das 19h, vejam uma sessão mais cedo ou deixem a ' +
        'projeção para depois do jantar — a saída é só às 20h30.',
      restauranteIds: [] },

    { id: 'ck-show-2011', dataAlvo: '2026-11-20', validaAte: '2026-11-20', hora: '07:50',
      fuso: null, janelaReserva: false, critico: true,
      texto: 'HOJE, no portão: a grade do The Untrainable Dragon e das festas de Natal',
      nota:
        'O UNTRAINABLE DRAGON É O ÚNICO SHOW DE TEATRO DO DIA e o roteiro assume 16h30, com a ' +
        'fila às 16h10. Ele está colado no jantar do Atlantic às 17h, que tem reserva: se a ' +
        'sessão for mais tarde, ou vocês pegam uma sessão anterior, ou o show sai do dia. ' +
        'Decidam de manhã, não às 16h.\n\n' +
        'CONFIRAM TAMBÉM as fontes coreografadas do Celestial Park e as celebrações de Natal ' +
        'de Berk e da Place Cachée, que estreiam com a temporada em 14/11. A Universal publica ' +
        'a grade delas no app no próprio dia.\n\n' +
        'A abertura e o fechamento do parque são outra pendência, conferida em outubro.',
      restauranteIds: [] },

    { id: 'ck-show-2211', dataAlvo: '2026-11-22', validaAte: '2026-11-22', hora: '08:15',
      fuso: null, janelaReserva: false, critico: false,
      texto: 'HOJE, no portão: a grade dos quatro shows do SeaWorld',
      nota:
        'Quatro blocos da noite são show e só a grade do dia confirma a hora: o Orca Encounter ' +
        'às 17h10, o Winter Wonderland on Ice às 19h10, o Sea of Trees às 20h e o Holiday ' +
        'Reflections às 21h.\n\n' +
        'O Orca Encounter é o que mais arrasta: ele fica entre a pausa do Waterfront e o ' +
        'jantar no Waterway Grill das 18h05. Se mudar, os dois andam junto — ajustem à mão.\n\n' +
        'A temporada de Natal do SeaWorld roda de 16/11 a 05/01, então os três shows de Natal ' +
        'estarão na grade. Peguem o mapa de papel na entrada: ele traz a grade impressa do dia.',
      pesquisa: '2026-09-17',
      restauranteIds: [] },

    { id: 'ck-show-2311', dataAlvo: '2026-11-23', validaAte: '2026-11-23', hora: '09:15',
      fuso: null, janelaReserva: false, critico: false,
      texto: 'HOJE, no portão: o Christmas on Ice e o show de luzes do Serengeti',
      nota:
        'O Christmas on Ice às 16h20 e o show de luzes das 18h25 são as duas horas do dia que ' +
        'dependem da grade. O Christmas on Ice fica entre o Skyride das 16h05 e o jantar no ' +
        'Dragon Fire das 17h20: se mudar, esses dois andam à mão.\n\n' +
        'CONFIRAM NA MESMA TELA O HORÁRIO DAS CABANAS DO CHRISTMAS TOWN. Elas abrem às 16h e ' +
        'o All-Day Dining encerra trinta minutos antes de os restaurantes fecharem: a ordem ' +
        'do dia depende disso.',
      pesquisa: '2026-09-17',
      restauranteIds: [] },
  ],

  /* ---------------------------------------------------------------------------
     LOCAIS
     Coordenadas conferidas no OpenStreetMap ou na Wikipedia (fonteCoord).
     Tempos com tempoFonte:'documento' vieram do roteiro, 'confirmado' foi
     medido na rota, e 'estimado' é estimativa.
     ------------------------------------------------------------------------ */
  locais: [
    { id: 'hotel-travelodge', nome: 'Travelodge by Wyndham Orlando Lake Buena Vista South',
      tipo: 'hotel', lat: 28.3337183, lng: -81.4986073, verificado: true, fonteCoord: 'osm',
      endereco: '5367 W Irlo Bronson Memorial Hwy, Kissimmee FL 34746',
      doHotel: null,
      nota: 'A base. Todos os tempos de deslocamento partem daqui. Coordenada e endereço ' +
            'confirmados em 09/09 — a estimativa anterior estava 630 m fora.' },

    { id: 'mco', nome: 'Orlando International Airport (MCO)', tipo: 'transporte',
      lat: 28.42944444, lng: -81.30888889, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 30, tempoFonte: 'documento',
                 uberUSD: { min: 35, max: 45 }, uberFonte: 'documento' } },

    { id: 'walmart-vineland', nome: 'Walmart Supercenter — Vineland Rd', tipo: 'compras',
      lat: 28.3413787, lng: -81.4863111, verificado: true, fonteCoord: 'osm',
      endereco: '3250 Vineland Rd, Kissimmee FL 34746',
      doHotel: { tempoMin: 4, tempoFonte: 'confirmado',
                 uberUSD: { min: 7, max: 10 }, uberFonte: 'estimado' },
      nota: 'Fica a 1,5 km do hotel, 4 minutos de carro. É a unidade mais próxima — há ' +
            'outra na E Osceola Pkwy, a 11,1 km, que não compensa.' },

    { id: 'magic-kingdom', nome: 'Magic Kingdom', tipo: 'parque',
      lat: 28.41861111, lng: -81.58111111, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 30, tempoFonte: 'estimado',
                 uberUSD: { min: 22, max: 32 }, uberFonte: 'estimado' },
      nota: 'O Uber não deixa aqui. Deixa no TTC.',
      historia: {
        linhas: [
          'A partir de 1964, a Disney comprou 27.443 acres na Flórida por meio de empresas ' +
          'de fachada. Emily Bavar, editora do Orlando Sentinel, descobriu a história em ' +
          'outubro de 1965, e o anúncio oficial saiu em 15/11/1965.',
          'Walt morreu em 15/12/1966, antes de a obra começar. O irmão, Roy O. Disney, ' +
          'adiou a aposentadoria para tocar a construção.',
          'O Magic Kingdom abriu em 01/10/1971. Na dedicação, Roy batizou o complexo de ' +
          '“Walt Disney World”, em homenagem ao irmão.',
          'O parque fica no “segundo andar”: no nível do chão estão os túneis de serviço, e ' +
          'por cima deles foi posta a terra tirada da escavação do Seven Seas Lagoon.',
          'Em 2024 recebeu 17,83 milhões de visitantes — o parque temático mais visitado do ' +
          'mundo pelo 18º ano seguido.',
        ],
        fontes: 'Wikipedia — Walt Disney World; Wikipedia — Magic Kingdom', pesquisa: '2026-09-15',
      } },

    { id: 'mk-ttc', nome: 'Ticket & Transportation Center (TTC)', tipo: 'transporte',
      lat: 28.4060892, lng: -81.5804985, verificado: true, fonteCoord: 'osm', endereco: null,
      doHotel: { tempoMin: 30, tempoFonte: 'estimado',
                 uberUSD: { min: 22, max: 32 }, uberFonte: 'estimado' },
      nota: 'É aqui que o Uber deixa. Do TTC ainda são 15–20 min de monotrilho ou barco.' },

    { id: 'animal-kingdom', nome: 'Disney’s Animal Kingdom', tipo: 'parque',
      lat: 28.358, lng: -81.59, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 35, tempoFonte: 'documento',
                 uberUSD: { min: 20, max: 30 }, uberFonte: 'estimado' },
      nota: 'Carona por app: o ponto de encontro é à esquerda, assim que saírem do parque — ' +
            'está no mapa oficial.',
      historia: {
        linhas: [
          'Abriu em 22/04/1998, Dia da Terra, com 580 acres — o maior parque temático do ' +
          'mundo na inauguração.',
          'Para defender animais de verdade no parque, o Imagineer Joe Rohde levou um ' +
          'tigre-de-bengala vivo a uma reunião com o presidente da Disney, Michael Eisner. ' +
          'O próprio Rohde diz que a história foi crescendo com o tempo, mas o tigre ' +
          'existiu.',
          'O projeto original tinha o Beastly Kingdom, uma área de criaturas mitológicas ' +
          'que nunca foi construída. No terreno dela ficou a Camp Minnie-Mickey, e depois, ' +
          'em 2017, Pandora.',
          'Por causa dos animais, o parque não tem fogos de artifício e não usa canudos, ' +
          'tampas de plástico nem balões.',
          'Em 2024 recebeu 8,8 milhões de visitantes. A próxima grande mudança é a Tropical ' +
          'Americas, prevista para 2027 no lugar da DinoLand.',
        ],
        fontes: 'Wikipedia — Disney’s Animal Kingdom; Joe Rohde (X)', pesquisa: '2026-09-15',
      } },

    { id: 'ak-lodge', nome: 'Animal Kingdom Villas · Kidani Village (Sanaa)', tipo: 'restaurante',
      lat: 28.3543353, lng: -81.6056084, verificado: true, fonteCoord: 'osm', endereco: '3701 Osceola Pkwy',
      doHotel: { tempoMin: 25, tempoFonte: 'estimado',
                 uberUSD: { min: 20, max: 30 }, uberFonte: 'estimado' },
      nota: 'Não é dentro do parque. O Sanaa fica na Kidani Village, e não no prédio principal ' +
            'do Animal Kingdom Lodge, que tem outra entrada.' },

    { id: 'hollywood-studios', nome: 'Disney’s Hollywood Studios', tipo: 'parque',
      lat: 28.3575, lng: -81.56, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 30, tempoFonte: 'documento',
                 uberUSD: { min: 22, max: 32 }, uberFonte: 'estimado' },
      nota: 'Carona por app: o ponto de encontro fica no ponto dos ônibus fretados, na saída ' +
            '— está no mapa oficial.',
      historia: {
        linhas: [
          'Abriu em 01/05/1989 como Disney-MGM Studios. A obra foi acelerada quando a ' +
          'Universal começou a construir, a poucos quilômetros, o Universal Studios ' +
          'Florida, com o mesmo tema.',
          'Foi estúdio de verdade: tinha estúdios de gravação e um estúdio de animação da ' +
          'Disney, onde foram feitos Mulan e Lilo & Stitch. A animação fechou em 2004.',
          'Em 07/01/2008 passou a se chamar Disney’s Hollywood Studios.',
          'O símbolo do parque já foi a Earffel Tower, uma caixa-d’água com orelhas de ' +
          'Mickey, e depois um chapéu de feiticeiro do Mickey, de 2001 a 2015.',
          'O Toy Story Land (2018) e o Galaxy’s Edge (2019) refizeram o parque. Em 2024 ele ' +
          'recebeu 10,3 milhões de visitantes.',
        ],
        fontes: 'Wikipedia — Disney’s Hollywood Studios', pesquisa: '2026-09-15',
      } },

    { id: 'epcot', nome: 'Epcot', tipo: 'parque',
      lat: 28.371, lng: -81.55, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 25, tempoFonte: 'estimado',
                 uberUSD: { min: 20, max: 30 }, uberFonte: 'estimado' },
      historia: {
        linhas: [
          'EPCOT era a sigla de Experimental Prototype Community of Tomorrow. O plano do ' +
          'Walt, nos anos 1960, era uma cidade de verdade para 20 mil moradores, sempre ' +
          'testando tecnologia nova.',
          'Depois da morte dele, o plano virou parque: o EPCOT Center abriu em 01/10/1982, ' +
          'o segundo do Walt Disney World.',
          'Nos anos 1990 o nome passou a Epcot, em minúsculas, para se distinguir do plano ' +
          'do Walt. Em 2020 voltou às maiúsculas, como homenagem.',
          'A partir de 2019, a antiga Future World foi dividida em World Celebration, World ' +
          'Discovery e World Nature.',
          'A maioria dos funcionários do World Showcase vem dos próprios países, por um ' +
          'programa de intercâmbio cultural da Disney. Em 2024 o parque recebeu 12,1 ' +
          'milhões de visitantes.',
        ],
        fontes: 'Wikipedia — Epcot', pesquisa: '2026-09-15',
      } },

    { id: 'disney-springs', nome: 'Disney Springs', tipo: 'compras',
      lat: 28.3702539, lng: -81.5209851, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 20, tempoFonte: 'documento',
                 uberUSD: { min: 15, max: 25 }, uberFonte: 'estimado' },
      nota: 'Estacionamento gratuito, mas na segunda ida, em 25/11, o carro já foi devolvido: ' +
            'é de Uber. Embarque e desembarque no West Side ou no Marketplace.',
      historia: {
        linhas: [
          'Abriu em 22/03/1975 como Lake Buena Vista Shopping Village.',
          'Mudou de nome quatro vezes: Walt Disney World Village (1977), Disney Village ' +
          'Marketplace (1989), Downtown Disney (1997) e Disney Springs (29/09/2015).',
          'Em 1989 ganhou o Pleasure Island, uma área de casas noturnas cujas boates ' +
          'fecharam em 27/09/2008.',
          'A reforma anunciada em 2013 criou o Town Center, aberto em 15/05/2016 onde era ' +
          'estacionamento a céu aberto, e as garagens gratuitas com nome de fruta: Orange, ' +
          'Lime e Grapefruit.',
          'A história de fachada é a de uma cidade da Flórida: um criador de gado do século ' +
          'XIX encontrou as nascentes, e cada área representa uma época do lugar.',
        ],
        fontes: 'Wikipedia — Disney Springs', pesquisa: '2026-09-15',
      } },

    { id: 'universal-studios', nome: 'Universal Studios Florida', tipo: 'parque',
      lat: 28.4752, lng: -81.467, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 33, tempoFonte: 'documento',
                 uberUSD: { min: 25, max: 35 }, uberFonte: 'estimado' },
      nota: 'Documento: 30–35 min de Kissimmee. Do estacionamento à catraca são +15–20 min a pé.',
      historia: {
        linhas: [
          'Abriu em 07/06/1990. Steven Spielberg deu palpite em atrações como E.T., Back to ' +
          'the Future e Jaws.',
          'A inauguração foi um desastre técnico: Kongfrontation, Earthquake e Jaws ' +
          'quebraram tanto que a Universal distribuiu vales para os visitantes voltarem ' +
          'outro dia.',
          'Foi estúdio de verdade: a Nickelodeon gravou programas aqui de 1990 a 2005.',
          'Em 08/07/2014 o Beco Diagonal abriu no lugar da área do Jaws, fechada em 2012.',
          'Em 2023 o parque recebeu 9,75 milhões de visitantes.',
        ],
        fontes: 'Wikipedia — Universal Studios Florida', pesquisa: '2026-09-15',
      } },

    { id: 'islands-of-adventure', nome: 'Islands of Adventure', tipo: 'parque',
      lat: 28.47166667, lng: -81.47138889, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 33, tempoFonte: 'documento',
                 uberUSD: { min: 28, max: 40 }, uberFonte: 'estimado' },
      historia: {
        linhas: [
          'Abriu em 28/05/1999, o segundo parque da Universal em Orlando.',
          'Por contrato, a Universal tem os direitos de parque de parte da Marvel a leste ' +
          'do rio Mississippi: Homem-Aranha, Vingadores, Quarteto Fantástico e X-Men. Por ' +
          'isso a Disney não pode usar esses personagens no Walt Disney World, mas pode ' +
          'usar os Guardiões da Galáxia no Epcot.',
          'Hogsmeade abriu em 18/06/2010 e fez o público do parque subir. Em 2014, o ' +
          'Hogwarts Express ligou o Islands ao Beco Diagonal.',
          'A Lost Continent começou a ser demolida em fases no verão de 2026, e o Mythos ' +
          'fecha em 2027, ainda sem data.',
          'Em 2024 o parque recebeu 9,4 milhões de visitantes.',
        ],
        fontes: 'Wikipedia — Universal Islands of Adventure; Inside Universal', pesquisa: '2026-09-15',
      } },

    { id: 'citywalk', nome: 'Universal CityWalk', tipo: 'compras',
      lat: 28.4733226, lng: -81.466124, verificado: true, fonteCoord: 'osm', endereco: null,
      doHotel: { tempoMin: 30, tempoFonte: 'documento',
                 uberUSD: { min: 28, max: 40 }, uberFonte: 'estimado' },
      nota: 'O transporte por app sai da área de estacionamento e ônibus, no extremo sul do ' +
            'CityWalk — não junto da entrada dos parques. É até lá que vocês andam antes de ' +
            'chamar, nos dias 14, 17 e 23.' },

    { id: 'epic-universe', nome: 'Universal Epic Universe', tipo: 'parque',
      lat: 28.4422, lng: -81.449, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 30, tempoFonte: 'documento',
                 uberUSD: { min: 25, max: 38 }, uberFonte: 'estimado' },
      nota: 'Dia 19, de Uber: o ponto de embarque do Epic é próprio, na 1222 Epic Blvd, a ' +
            'cinco minutos a pé da entrada. Não é o estacionamento da Universal.',
      historia: {
        linhas: [
          'Abriu em 22/05/2025, quase seis anos depois do anúncio, feito em 01/08/2019. É o ' +
          'quarto parque do complexo da Universal em Orlando.',
          'A obra parou de julho de 2020 a março de 2021 por causa da pandemia, e a ' +
          'inauguração, prevista para 2023, foi para 2025.',
          'O parque tem 45 hectares, dentro de um terreno total de 300 hectares.',
          'O desenho é de portais: o Celestial Park, com a torre Chronos no centro, leva a ' +
          'quatro mundos — Dark Universe, Ministry of Magic, Super Nintendo World e Isle of ' +
          'Berk.',
          'A parceria da Nintendo com a Universal foi anunciada em 2015. A Super Nintendo ' +
          'World abriu primeiro no Japão, em 2021, e depois em Hollywood, em 2023.',
        ],
        fontes: 'Wikipedia — Universal Epic Universe; Wikipedia — Super Nintendo World', pesquisa: '2026-09-15',
      } },

    { id: 'seaworld', nome: 'SeaWorld Orlando', tipo: 'parque',
      lat: 28.41083333, lng: -81.4625, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 20, tempoFonte: 'estimado',
                 uberUSD: { min: 22, max: 32 }, uberFonte: 'estimado' },
      nota: 'Estacionamento geral US$ 37. Detector de metal na entrada. O ponto de ônibus, táxi ' +
            'e carona por app fica à esquerda da entrada.',
      historia: {
        linhas: [
          'Abriu em 15/12/1973, o terceiro parque da rede SeaWorld, dois anos depois do ' +
          'Magic Kingdom.',
          'Em 1989 a cervejaria Anheuser-Busch comprou a rede. Por isso o SeaWorld e o ' +
          'Busch Gardens, do dia 24, são da mesma empresa até hoje, desde 2024 chamada ' +
          'United Parks & Resorts.',
          'Em 2010 a treinadora Dawn Brancheau morreu num acidente com a orca Tilikum, e o ' +
          'documentário Blackfish, de 2013, derrubou o público e a receita da empresa.',
          'Em 17/03/2016 o SeaWorld anunciou o fim da reprodução de orcas em cativeiro. Em ' +
          'Orlando, o show teatral One Ocean deu lugar ao Orca Encounter, mais educativo, ' +
          'em 01/01/2020.',
          'As montanhas-russas começaram com a Journey to Atlantis (1998) e o Kraken (2000) ' +
          'e ganharam força com a Mako (2016), a Ice Breaker (2022), a Pipeline (2023) e a ' +
          'Penguin Trek (2024).',
        ],
        fontes: 'Wikipedia — SeaWorld Orlando; NPR; NBC News', pesquisa: '2026-09-15',
      } },

    { id: 'busch-gardens', nome: 'Busch Gardens Tampa Bay', tipo: 'parque',
      lat: 28.0375, lng: -82.4225, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 85, tempoFonte: 'estimado',
                 uberUSD: null, uberFonte: null },
      nota: 'Só de carro: 109 km, 1h25 sem trânsito. Estacionamento US$ 32 mais imposto.',
      historia: {
        linhas: [
          'Abriu em 01/06/1959, de graça, como jardim da cervejaria Anheuser-Busch em ' +
          'Tampa, com 36 mil plantas, 300 árvores e cerveja grátis para os visitantes.',
          'Os animais africanos vieram depois, e a partir de 1976 o parque se chamou The ' +
          'Dark Continent.',
          'Em 2009 a cervejaria, já parte da AB InBev, vendeu os parques para o fundo ' +
          'Blackstone. Hoje o Busch e o SeaWorld são da United Parks & Resorts.',
          'A cerveja grátis acabou em 2009 e voltou só em temporadas de verão. Em 2026 foi ' +
          'de 22/05 a 09/08 — em novembro não tem.',
        ],
        fontes: 'Wikipedia — Busch Gardens Tampa Bay; Busch Gardens', pesquisa: '2026-09-15',
      } },

    { id: 'premium-outlets', nome: 'Orlando International Premium Outlets', tipo: 'compras',
      lat: 28.4750673, lng: -81.4514825, verificado: true, fonteCoord: 'osm', endereco: '4951 International Dr',
      doHotel: { tempoMin: 25, tempoFonte: 'documento',
                 uberUSD: { min: 20, max: 30 }, uberFonte: 'estimado' },
      nota: 'O cupom do balcão custa US$ 10. O grátis é o Savings Passport do Simon ' +
            'VIP Club, cadastrado antes de viajar.' },

    { id: 'vineland-outlets', nome: 'Orlando Vineland Premium Outlets', tipo: 'compras',
      lat: 28.386771, lng: -81.4926951, verificado: true, fonteCoord: 'osm',
      endereco: '8200 Vineland Ave, Orlando FL 32821',
      doHotel: { tempoMin: 15, tempoFonte: 'estimado',
                 uberUSD: null, uberFonte: null },
      nota: 'Abre às 10h, com horário estendido na semana da Black Friday. O Marshalls do ' +
            'Vineland Pointe fica ao lado.' },

    { id: 'boardwalk', nome: 'Disney’s BoardWalk', tipo: 'livre',
      lat: 28.3672046, lng: -81.5556295, verificado: true, fonteCoord: 'osm', endereco: 'Epcot Resorts Blvd',
      doHotel: { tempoMin: 30, tempoFonte: 'estimado',
                 uberUSD: { min: 25, max: 35 }, uberFonte: 'estimado' },
      nota: 'A guarita só deixa o carro de aplicativo entrar com reserva de hotel ou de ' +
            'restaurante. Sem reserva, desçam no Swan e façam os dez minutos a pé.' },

    { id: 'swan', nome: 'Walt Disney World Swan', tipo: 'transporte',
      lat: 28.365308, lng: -81.5598369, verificado: true, fonteCoord: 'osm', endereco: 'Epcot Resorts Blvd',
      doHotel: { tempoMin: 30, tempoFonte: 'estimado',
                 uberUSD: { min: 25, max: 35 }, uberFonte: 'estimado' },
      nota: 'Não tem guarita: é por aqui que se chega ao BoardWalk de aplicativo sem reserva. ' +
            'Dez minutos a pé pela beira do lago.' },

    { id: 'millenia', nome: 'The Mall at Millenia', tipo: 'compras',
      lat: 28.48538, lng: -81.431312, verificado: true, fonteCoord: 'wikipedia', endereco: '4200 Conroy Rd',
      doHotel: { tempoMin: 25, tempoFonte: 'documento',
                 uberUSD: { min: 28, max: 40 }, uberFonte: 'estimado' } },

    { id: 'best-buy', nome: 'Best Buy — Millenia', tipo: 'compras',
      lat: 28.4914395, lng: -81.431323, verificado: true, fonteCoord: 'osm', endereco: '4155 Millenia Blvd',
      doHotel: { tempoMin: 30, tempoFonte: 'estimado',
                 uberUSD: { min: 28, max: 40 }, uberFonte: 'estimado' },
      nota: 'Retirada do Oakley no dia 18, às 14h15, a menos de 1 km do Millenia. Na quarta ' +
            'abre das 10h às 21h. Se a retirada falhar, é também o plano B do dia 25.' },

    { id: 'lake-eola', nome: 'Lake Eola Park', tipo: 'livre',
      lat: 28.54361111, lng: -81.37277778, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 35, tempoFonte: 'estimado',
                 uberUSD: { min: 32, max: 45 }, uberFonte: 'estimado' },
      nota: 'Grátis. 10 min do Kia Center. Melhor pôr do sol da cidade.' },

    { id: 'kia-center', nome: 'Kia Center', tipo: 'evento',
      lat: 28.53916667, lng: -81.38361111, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 35, tempoFonte: 'estimado',
                 uberUSD: { min: 32, max: 45 }, uberFonte: 'estimado' },
      nota: 'NÃO ACEITA BOLSA: tudo no bolso. A única exceção da regra é uma clutch de ' +
            '4,5" × 6,5" × 1", menor que uma carteira. ' +
            'Armários Binbox do lado de fora, na Church St. com Division Ave. Na saída, a ' +
            'zona oficial de Uber e Lyft é a esquina da Hughey Ave com a Pine St — andem até ' +
            'lá antes de chamar: a tarifa dinâmica na porta é brutal.' },

    { id: 'celebration', nome: 'Celebration', tipo: 'livre',
      lat: 28.31027778, lng: -81.55083333, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 10, tempoFonte: 'documento',
                 uberUSD: { min: 10, max: 15 }, uberFonte: 'documento' } },

    { id: 'old-town', nome: 'Old Town Kissimmee', tipo: 'livre',
      lat: 28.33161, lng: -81.515838, verificado: true, fonteCoord: 'wikipedia',
      endereco: '5770 W Irlo Bronson Memorial Hwy',
      doHotel: { tempoMin: 3, tempoFonte: 'estimado',
                 uberUSD: { min: 7, max: 10 }, uberFonte: 'estimado' },
      nota: 'Entrada e estacionamento gratuitos. A Avis do dia 18 fica aqui dentro, na suíte ' +
            '434, das 7h às 19h.' },

    { id: 'winter-garden', nome: 'Winter Garden — Downtown Pavilion', tipo: 'livre',
      lat: 28.5647018, lng: -81.5877242, verificado: true, fonteCoord: 'osm', endereco: '104 S. Lakeview Ave',
      doHotel: { tempoMin: 40, tempoFonte: 'documento',
                 uberUSD: null, uberFonte: null },
      nota: 'De carro, ~40 min pela SR-429. Farmers Market das 8h às 13h, só aos sábados, faça ' +
            'chuva ou sol. Estacionamento grátis em todo o centro; a garagem da 160 S Boyd St ' +
            'fica ao lado da feira.' },

    { id: 'world-food-trucks', nome: 'World Food Trucks', tipo: 'restaurante',
      lat: 28.3341309, lng: -81.5168648, verificado: true, fonteCoord: 'osm',
      endereco: '5811 W Irlo Bronson Memorial Hwy, Kissimmee FL 34746',
      doHotel: { tempoMin: 5, tempoFonte: 'estimado',
                 uberUSD: { min: 7, max: 12 }, uberFonte: 'estimado' },
      nota: 'Mais de 100 food trucks, das 11h às 2h todos os dias, com estacionamento grátis. A ' +
            'resposta para as noites que terminam tarde.' },

    { id: 'red-lobster', nome: 'Red Lobster', tipo: 'restaurante',
      lat: 28.3320798, lng: -81.5131347, verificado: true, fonteCoord: 'osm',
      endereco: '5690 W Irlo Bronson Memorial Hwy, Kissimmee FL 34746',
      doHotel: { tempoMin: 3, tempoFonte: 'estimado',
                 uberUSD: { min: 7, max: 10 }, uberFonte: 'estimado' },
      nota: 'Mesa com garçom a 1,9 km do hotel, ao lado do Old Town. É o jantar da volta do ' +
            'hóquei, no dia 21, e a última mesa aberta perto do hotel: sexta e sábado até as ' +
            '23h, nos outros dias até as 22h.' },

    { id: 'publix-vineland', nome: 'Publix — Sunrise City Plaza', tipo: 'compras',
      lat: 28.3462381, lng: -81.4832862, verificado: true, fonteCoord: 'osm',
      endereco: '3221 Vineland Rd, Kissimmee FL 34746',
      doHotel: { tempoMin: 5, tempoFonte: 'estimado',
                 uberUSD: { min: 7, max: 10 }, uberFonte: 'estimado' },
      nota: 'Supermercado a 600 m do Walmart do dia 10. Das 7h às 23h, com deli que faz ' +
            'sanduíche na hora.' },
  ],

  /* ---------------------------------------------------------------------------
     TOPOGRAFIA DOS PARQUES
     Nao e mapa e nao quer ser. Sao as arestas de que temos certeza — quais areas
     encostam em quais e quanto custa atravessar — e o app calcula o resto por
     caminho mais curto.

     Por que nao tempo atracao a atracao: quem tem esse dado medido e base
     proprietaria, e o que circula publicado e vago ("a few minutes if you
     hustle"). Numero com casa decimal aqui seria chute com cara de precisao, e
     a variacao real por multidao e carrinho engole qualquer precisao fingida.
     Por isso: area a area, com a margem dita na cara.
     ------------------------------------------------------------------------ */
  topografia: {
    epcot: {
      forma: 'Um bulbo e um anel: a entrada abre no World Celebration, com o World ' +
             'Discovery de um lado e o World Nature do outro, e o World Showcase é o anel ' +
             'de onze pavilhões em volta do lago, ao sul.',
      margem:
        'Somem 50% em dia cheio. E ATENÇÃO A UMA LIMITAÇÃO DESTE MAPA: o World Showcase é ' +
        'um anel de 2 km modelado como uma área só, então para o app andar do México até o ' +
        'Canadá custa zero — e na vida real são uns vinte minutos. Isso é deliberado: as ' +
        'travessias de lá não são deslocamentos entre blocos, são o próprio passeio, e por ' +
        'isso a caminhada está dentro da duração dos blocos de Food & Wine.',
      arestas: [
        ['World Celebration', 'World Discovery', 4],
        ['World Celebration', 'World Nature', 4],
        ['World Celebration', 'World Showcase', 5],
        ['World Discovery', 'World Showcase', 6],
        ['World Nature', 'World Showcase', 6],
        ['World Discovery', 'World Nature', 7],
      ],
    },

    'epic-universe': {
      forma: 'Um hub e quatro raios: a entrada abre no Celestial Park, e os quatro mundos ' +
             'saem dele por portais, em sentido horário a partir da entrada — Super Nintendo ' +
             'World, Dark Universe, Ministry of Magic e Isle of Berk. Os mundos são isolados ' +
             'entre si: todo deslocamento passa pelo Celestial Park.',
      margem: 'Somem 50% em dia cheio. Os números batem com os publicados: de um mundo a ' +
              'outro são 3 a 7 minutos pelo hub, e aqui dão 6. E ATENÇÃO A UMA LIMITAÇÃO: o ' +
              'Celestial Park é um nó só, e a caminhada da entrada até o mundo mais distante, ' +
              '10 a 15 minutos, não entra no grafo — ela está dentro do bloco de entrada, que ' +
              'não tem área.',
      arestas: [
        ['Celestial Park', 'Super Nintendo World', 3],
        ['Celestial Park', 'Dark Universe', 3],
        ['Celestial Park', 'Ministry of Magic', 3],
        ['Celestial Park', 'Isle of Berk', 3],
      ],
    },

    'universal-studios': {
      forma: 'Um anel em volta da lagoa, com o Beco Diagonal pendurado como beco sem ' +
             'saída: entra e sai pela mesma boca, na London. A Minion Land é a primeira ' +
             'depois da catraca, à esquerda, com a Hollywood à direita — e é por isso que ' +
             'ela entope no rope drop. Transformers e Jimmy Fallon ficam em New York, logo ' +
             'depois dela.',
      margem: 'Somem 50% em dia cheio. Os números batem com os dois publicados: da catraca ' +
              'até o Beco Diagonal dá 10 minutos, e a volta completa do anel dá 23. O World ' +
              'Expo e a Springfield ficam levemente fora do caminho da lagoa — quem passa ' +
              'por lá tem de resolver os dois de uma vez ou volta atrás.',
      arestas: [
        ['Minion Land', 'Hollywood', 3],
        ['Minion Land', 'New York', 3],
        ['New York', 'San Francisco', 3],
        ['San Francisco', 'Diagon Alley', 2],
        ['Diagon Alley', 'World Expo', 3],
        ['World Expo', 'Springfield', 2],
        ['Springfield', 'DreamWorks Land', 3],
        ['DreamWorks Land', 'Hollywood', 2],
      ],
    },

    'hollywood-studios': {
      forma: 'Uma espinha: a Hollywood Blvd entra até o Chinese Theater e de lá tudo se ' +
             'abre. O Galaxy’s Edge fica no fundo, atrás do Echo Lake, e é o ponto mais ' +
             'longe de tudo.',
      margem: 'Somem 50% em dia cheio. E a travessia Galaxy’s Edge ↔ Sunset Blvd é a mais ' +
              'longa dos parques da Disney: treze minutos de ponta a ponta.',
      arestas: [
        ['Hollywood Blvd', 'Echo Lake', 3],
        ['Hollywood Blvd', 'Sunset Blvd', 4],
        ['Hollywood Blvd', 'Commissary Lane', 3],
        ['Hollywood Blvd', 'Animation Courtyard', 4],
        ['Echo Lake', 'Grand Avenue', 3],
        ['Grand Avenue', 'Galaxy’s Edge', 3],
        ['Commissary Lane', 'Toy Story Land', 5],
        ['Animation Courtyard', 'Toy Story Land', 4],
        ['Galaxy’s Edge', 'Toy Story Land', 6],
      ],
    },

    'islands-of-adventure': {
      forma: 'Um anel em volta da lagoa. Do portão dá para ir pelos dois lados, e o ' +
             'caminho mais curto entre duas áreas quase nunca passa pelo meio.',
      margem: 'Somem 50% em dia cheio. Hogsmeade trava o fluxo quando tem projeção no ' +
              'castelo — a multidão para no pátio e o resto do anel não anda. A Skull Island ' +
              'fica no meio do caminho entre a Toon Lagoon e o Jurassic Park: os 4 minutos ' +
              'entre as duas foram divididos ao meio, sem medição própria.',
      arestas: [
        ['Port of Entry', 'Marvel Super Hero Island', 4],
        ['Marvel Super Hero Island', 'Toon Lagoon', 4],
        ['Toon Lagoon', 'Skull Island', 2],
        ['Skull Island', 'Jurassic Park', 2],
        ['Jurassic Park', 'Hogsmeade', 5],
        ['Hogsmeade', 'Lost Continent', 4],
        ['Lost Continent', 'Seuss Landing', 4],
        ['Seuss Landing', 'Port of Entry', 4],
      ],
    },

    'animal-kingdom': {
      forma: 'Roda em torno da Discovery Island, onde fica a Árvore da Vida. Tudo passa ' +
             'por ela — Pandora de um lado, África e Ásia do outro.',
      margem: 'O Animal Kingdom tem as caminhadas mais longas da Disney. Somem 50% em dia ' +
              'cheio, e mais se pararem para olhar bicho, que é o que vocês vão fazer.',
      arestas: [
        ['Oasis', 'Discovery Island', 5],
        ['Discovery Island', 'Pandora', 5],
        ['Discovery Island', 'Africa', 5],
        ['Discovery Island', 'Asia', 5],
        ['Africa', 'Asia', 6],
      ],
    },

    'magic-kingdom': {
      forma: 'Cubo e seis raios. Do hub, em frente ao castelo, sai tudo.',
      margem: 'Somem 50% em dia cheio, e mais ainda com desfile na rua.',
      arestas: [
        ['Main Street', 'Hub', 4],
        ['Hub', 'Adventureland', 3],
        ['Hub', 'Tomorrowland', 3],
        ['Hub', 'Fantasyland', 3],
        ['Adventureland', 'Frontierland', 3],
        ['Frontierland', 'Liberty Square', 3],
        ['Liberty Square', 'Fantasyland', 3],
        ['Fantasyland', 'Tomorrowland', 4],
      ],
      // O desfile corta o parque em dois enquanto passa. Verificado em 09/09.
      corte: {
        blocoId: 'b-1111-1500',
        minutos: 25,
        texto:
          'ENQUANTO O DESFILE PASSA, O PARQUE FICA CORTADO AO MEIO. A rota vai da ' +
          'Frontierland pela Liberty Square, contorna o hub e desce a Main Street — ' +
          'e ninguém atravessa essa linha até acabar. Vocês assistem da Liberty Square ' +
          'e saem por trás da rota, pela Fantasyland, para a Tomorrowland — nunca ' +
          'pelo hub. É assim que o TRON das 15h30 fica de pé.',
        pesquisa: '2026-09-09',
      },
    },

    seaworld: {
      forma: 'Um anel em volta da lagoa, com a entrada ao sul e a Pipeline colada nela. A ' +
             'leste ficam Ice Breaker, Expedition Odyssey, o Bayside Stadium e o Orca Stadium; ' +
             'ao norte, Mako e Shark Encounter; a oeste, Penguin Trek, Kraken, Atlantis e Manta. ' +
             'O Waterfront e o Sky Tower são o centro, na margem da lagoa. As áreas têm aqui os ' +
             'nomes dos marcos, porque o mapa oficial não imprime nome de área nenhum.',
      margem: 'Somem 50% em dia cheio. E ATENÇÃO: não há tempos publicados para conferir. ' +
              'Estes saem das coordenadas do OpenStreetMap, com 30% de desvio sobre a linha ' +
              'reta e passo de 75 metros por minuto. A volta inteira dá uns 32 minutos e da ' +
              'entrada ao Mako são 9 — o que bate com o "5 a 10 minutos entre atrações" dos ' +
              'guias.',
      arestas: [
        ['Entrada e Pipeline', 'Manta e Dolphin Stadium', 5],
        ['Entrada e Pipeline', 'Waterfront e Sky Tower', 5],
        ['Entrada e Pipeline', 'Ice Breaker e Bayside Stadium', 5],
        ['Manta e Dolphin Stadium', 'Waterfront e Sky Tower', 3],
        ['Manta e Dolphin Stadium', 'Kraken e Atlantis', 4],
        ['Kraken e Atlantis', 'Penguin Trek', 2],
        ['Penguin Trek', 'Waterfront e Sky Tower', 3],
        ['Penguin Trek', 'Mako e Shark Encounter', 5],
        ['Waterfront e Sky Tower', 'Mako e Shark Encounter', 4],
        ['Mako e Shark Encounter', 'Sesame Street e Waterway Grill', 3],
        ['Sesame Street e Waterway Grill', 'Orca Stadium', 4],
        ['Orca Stadium', 'Ice Breaker e Bayside Stadium', 4],
      ],
    },

    'busch-gardens': {
      forma: 'Um anel pelo parque, com a entrada no Morocco, ao sul, e a Iron Gwazi logo ali. ' +
             'A leste ficam Edge of Africa e Egypt, com Cheetah Hunt e Montu; no meio, Nairobi e ' +
             'Pantopia; a oeste, Congo, Jungala e Stanleyville. A planície do Serengeti fica a ' +
             'leste do anel, e o trem dá a volta nela.',
      margem: 'Somem 50% em dia cheio. E ATENÇÃO: não há tempos publicados para conferir. ' +
              'Estes saem das coordenadas do OpenStreetMap, com 30% de desvio sobre a linha ' +
              'reta e passo de 75 metros por minuto. A volta inteira dá uns 32 minutos. O trem ' +
              'não entra no grafo. O Skyride entra, como a aresta Stanleyville–Edge of Africa ' +
              'de 5 minutos, que o dia 24 usa às 16h05: se o teleférico estiver parado por ' +
              'vento, a pé são 14.',
      arestas: [
        ['Morocco', 'Edge of Africa', 2],
        ['Edge of Africa', 'Egypt', 3],
        ['Edge of Africa', 'Nairobi', 3],
        ['Morocco', 'Nairobi', 4],
        ['Nairobi', 'Pantopia', 5],
        ['Pantopia', 'Congo', 3],
        ['Congo', 'Jungala', 2],
        ['Jungala', 'Stanleyville', 3],
        ['Pantopia', 'Stanleyville', 4],
        ['Stanleyville', 'Edge of Africa', 5],
        ['Stanleyville', 'Sesame Street', 5],
        ['Sesame Street', 'Bird Gardens', 3],
        ['Bird Gardens', 'Morocco', 6],
      ],
    },
  },

  /* ---------------------------------------------------------------------------
     TELEFONES
     So entra numero conferido na fonte oficial. O da companhia aerea nao esta
     aqui de proposito: o certo para o bilhete de voces esta no proprio bilhete,
     e numero de companhia aerea achado em busca costuma ser de revenda.
     ------------------------------------------------------------------------ */
  contatos: [
    { id: 'tel-emergencia', nome: 'Emergência — polícia, bombeiro, ambulância',
      numero: '911', critico: true,
      quando:
        'De qualquer celular nos EUA, inclusive sem chip americano, sem crédito e ' +
        'com a tela bloqueada. É o número único para tudo.' },

    { id: 'tel-hotel', nome: 'Travelodge by Wyndham Orlando Lake Buena Vista South',
      numero: '+1 407-449-2357', critico: true,
      quando:
        'Recepção. Confirmar a reserva e o check-in das 15h, perguntar pela lavanderia e ' +
        'pelo café da manhã — e é o endereço que vocês dão à companhia aérea se a mala ' +
        'extraviar.',
      verificado: '2026-09-09', fonte: 'wyndhamhotels.com' },

    { id: 'tel-disney-dining', nome: 'Disney — reservas de restaurante',
      numero: '+1 407-939-3463', critico: true,
      quando:
        'Cancelar ou remarcar o The Boathouse (10/11), o Oga’s (15/11), o Sanaa (16/11) ' +
        'e o Homecomin’ (25/11). CANCELEM COM PELO MENOS 2 HORAS de antecedência: ' +
        'abaixo disso a Disney cobra a taxa de não comparecimento no cartão. Dá para ' +
        'cancelar pelo My Disney Experience também. O Homecomin’ tem linha direta: ' +
        '+1 407-560-0100.',
      verificado: '2026-09-11', fonte: 'disneyworld.disney.go.com e mickeyvisit.com' },

    { id: 'tel-universal-dining', nome: 'Universal — reservas de restaurante',
      numero: '+1 407-224-3663',
      quando:
        'Remarcar ou cancelar o Lombard’s (17/11, 18h45), o Atlantic (19/11, 17h) e o Mythos ' +
        '(23/11, 19h15). Dá para fazer pela conta da Universal no app também. No Atlantic e ' +
        'no Mythos, a mesa é segurada só por 15 minutos depois do horário.',
      verificado: '2026-09-11', fonte: 'confirmações das reservas do Atlantic e do Mythos' },

    { id: 'tel-boathouse', nome: 'The Boathouse — direto',
      numero: '+1 407-939-2628',
      quando:
        'O restaurante em si, para atraso de meia hora ou mudança de tamanho da mesa. ' +
        'Para cancelar de vez, a linha da Disney acima resolve igual.',
      verificado: '2026-09-09', fonte: 'theboathouseorlando.com' },

    { id: 'tel-urgentcare-celebration', nome: 'Urgent Care — AdventHealth Centra Care Celebration',
      numero: '+1 407-845-8376', critico: true,
      quando:
        'O degrau entre o First Aid do parque e o 911: febre, torção, corte, dor de ouvido, ' +
        'virose. Pronto-socorro por coisa pequena sai muito mais caro. Fica na 5850 W Irlo ' +
        'Bronson, a uns 2 km do hotel. Seg a sex das 8h às 20h, sáb e dom das 8h às 17h. ' +
        'Não precisa marcar; dá para adiantar o cadastro online ("On My Way"). Levem a apólice ' +
        'do seguro. Risco de vida: 911 primeiro.',
      verificado: '2026-09-10', fonte: 'centracare.adventhealth.com' },

    { id: 'tel-urgentcare-lbv', nome: 'Urgent Care à noite — Centra Care Lake Buena Vista',
      numero: '+1 407-934-2273',
      quando:
        'Para depois das 20h, quando a de Celebration já fechou: aberta todos os dias das 7h à ' +
        'meia-noite. Fica na 12500 S Apopka Vineland Rd, a uns 5 km de Disney Springs. Eles ' +
        'levam de volta para hotéis da Disney — o Travelodge não é um deles, então a volta é ' +
        'de Uber.',
      verificado: '2026-09-10', fonte: 'centracare.adventhealth.com' },

    { id: 'tel-avis', nome: 'Avis — Old Town Kissimmee',
      numero: '+1 321-219-7041',
      quando:
        'A loja da retirada e da devolução do carro, de 20 a 25/11, das 7h às 19h, na suíte ' +
        '434 do Old Town. Atraso na devolução do dia 25 ou problema com a reserva.',
      verificado: '2026-09-11', fonte: 'avis.com' },

    { id: 'tel-avis-estrada', nome: 'Avis — assistência na estrada, 24 horas',
      numero: '+1 800-354-2847',
      quando:
        'Pane, pneu furado, bateria, chave trancada dentro do carro ou acidente, de 20 a ' +
        '25/11. Em acidente com ferido, 911 primeiro.',
      verificado: '2026-09-11', fonte: 'avis.com' },

    { id: 'tel-seguro', nome: 'Seguro viagem — central de atendimento',
      numero: null, critico: true,
      quando:
        'ESTÁ NA APÓLICE DE VOCÊS, e é por isso que não está aqui: o número muda por ' +
        'seguradora e por plano, e um telefone errado numa emergência é pior que nenhum.\n\n' +
        'Antes de embarcar, salvem o PDF da apólice OFFLINE no celular dos dois. O que o ' +
        'hospital pede é o número da apólice e o telefone da central — os dois estão lá.\n\n' +
        'Para emergência com risco de vida, 911 primeiro; o seguro depois.' },

    { id: 'tel-aereo', nome: 'Companhia aérea', numero: null, precisaColar: true,
      quando:
        'NÃO ESTÁ AQUI DE PROPÓSITO. O número certo para o bilhete de vocês está no ' +
        'próprio bilhete eletrônico, e o que aparece em busca costuma ser de revendedor. ' +
        'Antes de embarcar, salvem o PDF do bilhete offline no celular: ele traz o ' +
        'telefone, o localizador e os números dos voos, que é tudo o que se pede quando ' +
        'a mala não chega ou o voo é remarcado.' },
  ],

  /* ---------------------------------------------------------------------------
     DICAS E RECOMENDAÇÕES — conteúdo de leitura, sem interação
     ------------------------------------------------------------------------ */
  dicas: [
    {
      id: 'dica-lockers',
      categoria: 'geral',
      momento: 'dia-especifico',
      dias: ['d-2026-11-11', 'd-2026-11-16', 'd-2026-11-17', 'd-2026-11-19', 'd-2026-11-20', 'd-2026-11-22',
             'd-2026-11-23', 'd-2026-11-24'],
      titulo: 'Lockers obrigatórios: reserve 10 a 15 min a mais',
      corpo:
        'Guardar e buscar o locker come tempo que a duração dos blocos não conta. Em dias como ' +
        '19/11 e 23/11, com várias dessas seguidas, isso pode passar de uma hora somada.\n\n' +
        'UNIVERSAL — detector de metal, absolutamente nada nos bolsos, nem celular:\n' +
        'Hulk · VelociCoaster · Stardust Racers\n\n' +
        'UNIVERSAL — locker obrigatório, sem detector:\n' +
        'Revenge of the Mummy · Hagrid’s · Forbidden Journey · Escape from Gringotts · ' +
        'Men in Black · Monsters Unchained · Hiccup’s Wing Gliders\n\n' +
        'O locker padrão da Universal é grátis pelo tempo da fila mais a atração; o grande é ' +
        'pago, de US$ 3 a 6 conforme a fonte.\n\n' +
        'DISNEY: o TRON (11/11) e o Flight of Passage (16/11) não deixam nada solto e têm ' +
        'locker grátis na entrada.\n\n' +
        'SEAWORLD (22/11): armário na entrada da Pipeline, Ice Breaker, Mako, Kraken, Manta e ' +
        'Journey to Atlantis — US$ 2 pelas primeiras duas horas, ou US$ 10 o de uso múltiplo, ' +
        'que muda de atração o dia inteiro. A entrada do parque tem detector de metal.\n\n' +
        'BUSCH GARDENS (24/11): nove atrações proíbem objeto solto. O armário custa US$ 4 por ' +
        'duas horas, ou US$ 12 o do dia inteiro. A Iron Gwazi tem detector de metal e ' +
        'armário pago obrigatório desde o fim de 2025.\n\n' +
        'Estratégia: levem o mínimo possível nesses dias. Quanto menos bagagem, menos locker.',
      pesquisa: '2026-09-11',
    },
    {
      id: 'dica-molha',
      categoria: 'geral',
      momento: 'dia-especifico',
      dias: ['d-2026-11-16', 'd-2026-11-19', 'd-2026-11-22'],
      titulo: 'O que molha de verdade',
      corpo:
        'Novembro em Orlando é ameno, e roupa molhada às 17h fica desconfortável rápido quando ' +
        'escurece. As atrações marcadas com o selo "molha" neste app são:\n\n' +
        'Kali River Rapids (16/11) — não é respingo, é balde. E é às 9h15, com nove ' +
        'horas de parque pela frente\n' +
        'Jurassic Park River Adventure (23/11) — molha bastante, levem capa\n' +
        'Journey to Atlantis (22/11) — molha bastante\n' +
        '\n' +
        'Ficam de fora por molharem demais: Fyre Drill (Epic), Infinity Falls (SeaWorld), ' +
        'Popeye e Dudley Do-Right (Islands) e Congo River Rapids (Busch).\n\n' +
        'Capa de chuva descartável custa ~US$ 1 no Walmart do dia 10 e ~US$ 10 dentro do parque.',
    },
    {
      id: 'dica-gorjeta',
      categoria: 'geral',
      momento: 'todo-dia',
      titulo: 'Moeda, imposto e gorjeta: o preço na etiqueta não é o preço final',
      corpo:
        'Três coisas que confundem brasileiro e aparecem em toda conta da viagem.\n\n' +
        'MOEDA. Quando a maquininha perguntar se vocês querem pagar em reais ou em dólares, ' +
        'escolham sempre DÓLARES. A conversão oferecida na hora embute uma taxa que costuma ' +
        'ficar entre 3% e 7% acima da do banco, às vezes mais. Vale para maquininha de ' +
        'restaurante, caixa eletrônico e site americano — e se repete em toda compra.\n\n' +
        'IMPOSTO. O preço exposto nunca inclui o sales tax. Em Orlando (Orange County) fica em ' +
        'torno de 6,5%, e em Kissimmee (Osceola) por volta de 7,5%. Só aparece no caixa.\n\n' +
        'GORJETA. Em restaurante com garçom, 18 a 20% é o esperado e faz parte do salário da ' +
        'pessoa, não é opcional na prática. Muita casa já traz sugestões impressas na conta, e ' +
        'grupos grandes às vezes têm gratuity incluída — confira antes de somar duas vezes.\n\n' +
        'Onde NÃO se dá gorjeta: balcão e mobile order. Ou seja, Columbia Harbour House, ' +
        'Casey’s, Satu’li Canteen, Three Broomsticks, Docking Bay 7, as barracas do Food & ' +
        'Wine, Leaky Cauldron, Toadstool Cafe, Chick-fil-A, World Food Trucks, ' +
        'Plant Street Market, Sofrito e os restaurantes do plano de refeição do SeaWorld e do ' +
        'Busch Gardens, inclusive o Dragon Fire.\n\n' +
        'Onde se dá: The Boathouse, Nomad Lounge, Sanaa, Columbia, Oga’s, ' +
        'Lombard’s, Cheesecake Factory, Kres, Atlantic, IHOP, El Cilantrillo, Red Lobster, ' +
        'Confisco Grille, Mythos e Homecomin’ — e o Uber (opcional, mas comum).\n\n' +
        'O FORD’S GARAGE, NO DIA 12, JÁ COBRA 20% DE TAXA DE SERVIÇO NA CONTA, no lugar da ' +
        'gorjeta: não somem outra por cima.',
      pesquisa: '2026-09-11',
    },
    {
      id: 'dica-rope-drop',
      categoria: 'geral',
      momento: 'todo-dia',
      titulo: 'Como o rope drop funciona na prática',
      corpo:
        'A regra de ouro número 1 é a mais importante da viagem e a que mais gente executa ' +
        'errado.\n\n' +
        'Chegar "na abertura" não é chegar na hora em que o parque abre. É estar do lado de ' +
        'dentro quando soltarem — o que significa passar segurança e catraca antes, e estar ' +
        'de pé no ponto certo do parque.\n\n' +
        'SIGAM A HORA DO PORTÃO DE CADA DIA, e não uma conta fixa. Ela vai de 75 minutos ' +
        'antes da abertura no MAGIC KINGDOM, onde o Uber deixa no TTC e ainda falta ' +
        'monotrilho ou barco, a 30 minutos no Universal Studios.\n\n' +
        'A CATRACA ABRE ANTES DO PARQUE, E ISSO VEM NO INGRESSO. Na Disney ela abre para ' +
        'todo mundo de 30 minutos a uma hora e meia antes da abertura, conforme o parque; ' +
        'na Universal, até uma hora antes no parque que tem a entrada antecipada de hotel ' +
        'do dia. Quem é de fora entra, espera numa área liberada, e só as atrações ficam ' +
        'fechadas: é a hora das barrinhas e da foto antes de o parque encher. No SeaWorld e ' +
        'no Busch Gardens não há fonte de que isso aconteça, e a espera é na frente da ' +
        'catraca.\n\n' +
        'Onde ficar de pé enquanto espera define o que vocês fazem primeiro. Cada dia diz o ' +
        'ponto: FRONTIERLAND no Magic Kingdom, checkpoint da ÁFRICA no Animal Kingdom, TOY ' +
        'STORY LAND no Hollywood Studios, WORLD DISCOVERY no Epcot, Beco Diagonal no Universal ' +
        'Studios, o portal da Dark Universe no Epic e à esquerda, sentido Hogsmeade, no ' +
        'Islands.\n\n' +
        'NOS QUATRO PARQUES DA DISNEY O PONTO É CONTRAINTUITIVO, e é de propósito. Vocês não ' +
        'têm Early Entry em lugar nenhum — não estão em hotel Disney nem Universal. Isso ' +
        'significa que os hóspedes passam dos checkpoints meia hora antes de vocês, e ' +
        'já estão de pé onde o Early Entry deixa entrar. Correr para lá é chegar atrás ' +
        'deles.\n\n' +
        'A saída é ir para onde essa multidão não está: Frontierland no Magic Kingdom, África ' +
        'e Ásia no Animal Kingdom, Toy Story Land no Hollywood Studios — os hóspedes correm ' +
        'para o Rise — e o Test Track no Epcot, enquanto eles correm para o Cosmic Rewind.',
    },
    {
      id: 'dica-natal',
      categoria: 'geral',
      momento: 'antes-de-viajar',
      titulo: 'A decoração de Natal e por que a ordem dos dias importa',
      corpo:
        'A viagem atravessa a virada da temporada de Natal, e isso foi usado de propósito no ' +
        'roteiro.\n\n' +
        'DISNEY: decoração já montada quando vocês chegam. Mickey’s Very Merry Christmas ' +
        'Party rola em noites selecionadas a partir de 08/11, e vocês decidiram não ir.\n\n' +
        'UNIVERSAL: a temporada começa exatamente em 14/11 — o dia em que vocês entram no ' +
        'Islands à noite. Vocês pegam a primeira noite da temporada.\n\n' +
        'DISNEY SPRINGS: no dia 10 ainda não tem decoração. Por isso existe uma segunda ida, ' +
        'para o Christmas Tree Stroll — de graça, e literalmente outro lugar. É a última ' +
        'noite da viagem, 25/11.\n\n' +
        'SEAWORLD e BUSCH: Christmas Celebration e Christmas Town rodam em datas selecionadas ' +
        'a partir de 06/11 e 13/11. Confirmem que 22/11 e 23/11 estão na lista.',
      pesquisa: '2026-09-08',
    },
    {
      id: 'dica-emergencia',
      categoria: 'geral',
      momento: 'emergencia',
      titulo: 'Quando dá errado: saúde, bateria, seguro, dinheiro e se vocês se perderem',
      corpo:
        'Esta dica existe para ser lida uma vez agora e nunca mais — até o dia em que ' +
        'precisar.\n\n' +
        'SE VOCÊS SE PERDEREM DENTRO DE UM PARQUE. Combinem AGORA, não na hora: cada dia ' +
        'de parque tem o ponto de encontro escrito no bloco de entrada. A regra é ir para ' +
        'lá e esperar, não procurar — duas pessoas procurando uma à outra num parque de ' +
        'vinte mil pessoas não se acham. E vale mesmo com os dois celulares funcionando: ' +
        'ligação dentro de parque cheio cai ou não se ouve.\n\n' +
        'SE ALGUÉM PASSAR MAL. Todo parque da Disney e da Universal tem posto de primeiros ' +
        'socorros, com enfermeiro, ar-condicionado e remédio básico de graça. Peçam ' +
        '“First Aid” a qualquer funcionário — eles levam vocês. Para emergência ' +
        'de verdade, 911 de qualquer celular, inclusive sem chip americano.\n\n' +
        'ONDE FICA O POSTO, pelos mapas oficiais: Magic Kingdom, na Main Street, ao lado do ' +
        'Crystal Palace · Animal Kingdom, na Discovery Island, junto da ponte do Oasis · ' +
        'Hollywood Studios, na entrada, à direita · Epcot, no Odyssey, entre o Test Track e o ' +
        'México · Universal Studios, na entrada e em New York · Islands, no Port of Entry e na ' +
        'Lost Continent, ao lado do Mythos · Epic, na entrada, à direita · SeaWorld, atrás da ' +
        'Stingray Lagoon, perto da entrada · Busch Gardens, na entrada, no Morocco.\n\n' +
        'FORA DO PARQUE, PARA O QUE NÃO É EMERGÊNCIA — febre, torção, corte, dor de ouvido, ' +
        'virose — o caminho é Urgent Care, não pronto-socorro. A mais perto é a Centra Care ' +
        'de Celebration, a uns 2 km do hotel, até as 20h (17h no fim de semana). Depois ' +
        'disso, a de Lake Buena Vista fica aberta até a meia-noite. Endereço e telefone das ' +
        'duas estão em Telefones, neste Guia.\n\n' +
        'O SEGURO VIAGEM. Deixem a apólice salva OFFLINE no celular dos dois, não só no ' +
        'e-mail. O que o hospital pede é o número da apólice e o telefone da central — ' +
        'os dois estão nela. Nos EUA, atendimento sem seguro é caro de um jeito que não ' +
        'tem paralelo no Brasil.\n\n' +
        'DINHEIRO. Cartão resolve quase tudo, mas avisem o banco antes de viajar — compra ' +
        'internacional inesperada é motivo comum de bloqueio, e desbloquear de fora dá ' +
        'trabalho. Levem um cartão de reserva guardado em outro lugar, não na mesma ' +
        'carteira. E uns US$ 100 em espécie: gorjeta de arrumadeira, motorista sem app e ' +
        'a máquina que não lê o chip.\n\n' +
        'SE A BATERIA ACABAR E A POWER BANK TAMBÉM. Os parques da Disney e da Universal têm ' +
        'máquinas de Fuel Rod: vocês compram uma bateria carregada por US$ 40 e depois trocam ' +
        'a vazia por outra carregada. Na Disney a troca é de graça; na Universal cada troca ' +
        'custa US$ 3. Enquanto isso, modo de economia de bateria e apps de mapa fechados.\n\n' +
        'SE UM CELULAR SUMIR. Os telefones do hotel, da Disney e do restaurante estão na ' +
        'aba Telefones deste Guia, e este app funciona nos dois aparelhos — mas só se ' +
        'vocês tiverem exportado o estado. A Home avisa quando faz tempo demais.',
      pesquisa: '2026-09-10',
    },
    {
      id: 'dica-vazio-proposital',
      categoria: 'geral',
      momento: 'antes-de-viajar',
      titulo: 'Os blocos VAZIO PROPOSITAL não são falha de planejamento',
      corpo:
        'Existem sete blocos assim no roteiro: 12/11 às 14h30, 14/11 às 9h, 14/11 às 14h30, ' +
        '21/11 às 13h45, 24/11 às 9h45, 24/11 às 15h30 e 25/11 às 16h15.\n\n' +
        'Eles estão ali porque a segunda metade da viagem é mais pesada que a primeira: ' +
        '19/11 Epic, 21/11 Winter Garden e hóquei, 22/11 SeaWorld, 23/11 Islands e 24/11 ' +
        'Busch Gardens com 3h de carro. Chegar destruído no dia 19 transforma o melhor ' +
        'parque de Orlando em arrastar-se — e ele é dia único.\n\n' +
        'Resistam à tentação de encaixar coisa neles.',
    },
    {
      id: 'dica-bomba-zip',
      categoria: 'geral',
      momento: 'dia-especifico',
      dias: ['d-2026-11-20', 'd-2026-11-23', 'd-2026-11-25'],
      titulo: 'Abastecer com cartão brasileiro: paguem dentro da loja',
      corpo:
        'A bomba automática pede o ZIP code do cartão antes de liberar o combustível. Cartão ' +
        'brasileiro não tem ZIP, e a bomba recusa. Não é bloqueio do banco e não adianta ' +
        'tentar outro cartão.\n\n' +
        'A SOLUÇÃO: anotem o número da bomba, entrem na loja e paguem no caixa, dizendo o ' +
        'número e um valor — ou peçam para encher. O caixa libera a bomba. Se sobrar, voltem ' +
        'para pegar a diferença.\n\n' +
        'Peçam Regular, a gasolina comum (87). E vale o mesmo para máquina de estacionamento: ' +
        'se pedir ZIP, procurem uma pessoa.\n\n' +
        'QUANDO: na véspera de Tampa, 23/11, se o tanque estiver abaixo da metade, e antes de ' +
        'devolver o carro em 25/11, com o tanque cheio, na Avis do Old Town. O 7-Eleven da ' +
        '5880 W Irlo Bronson fica a uns 450 metros dela.',
      pesquisa: '2026-09-10',
    },
    {
      id: 'dica-comida-tarde',
      categoria: 'geral',
      momento: 'dia-especifico',
      dias: ['d-2026-11-11', 'd-2026-11-18', 'd-2026-11-19', 'd-2026-11-21', 'd-2026-11-24'],
      titulo: 'Onde comer quando a noite acaba tarde',
      corpo:
        'Cinco noites terminam com fome e quase tudo fechado: 11/11, com o Magic Kingdom até ' +
        'as 22h; 18/11 e 21/11, com o jantar antes do jogo e o hotel perto das 22h15; 19/11, ' +
        'porque o jantar do Epic é às 17h; e 24/11, com a volta de Tampa.\n\n' +
        'SE O CANSAÇO MANDAR, O QUARTO RESOLVE. Ele tem micro-ondas, e a lista do Walmart do ' +
        'dia 10 traz o jantar para ele: arroz pronto com atum ou frango em sachê, ou sopa. ' +
        'Três minutos, sem sair do hotel.\n\n' +
        'SE FOR PARA SAIR, na própria 192:\n' +
        'Red Lobster, 5690 W Irlo Bronson — mesa com garçom a 1,9 km do hotel, três minutos ' +
        'de carro. Até as 22h de domingo a quinta e até as 23h na sexta e no sábado\n' +
        'Chick-fil-A, 6050 W Irlo Bronson — 1,4 km, uns 19 minutos a pé, até as 23h. Fecha ' +
        'aos domingos\n' +
        'Raising Cane’s, 8170 W Irlo Bronson — frango frito até as 4h da manhã, todos os ' +
        'dias. São 11 km: só nos dias com carro, 20 a 25/11\n' +
        'World Food Trucks, 5811 W Irlo Bronson — mais de 100 food trucks, das 11h às 2h ' +
        'todos os dias\n' +
        'Miller’s Ale House, 8123 W Irlo Bronson — mesa com garçom, das 11h às 2h\n' +
        'Perkins, 5170 W Irlo Bronson — mesa com garçom, até a meia-noite\n' +
        'Walgreens, 5935 W Irlo Bronson — farmácia 24 horas, para o básico\n\n' +
        'NAS NOITES SEM CARRO — 11, 18 e 19 — valem o quarto, o Chick-fil-A a pé e o Walgreens; ' +
        'o resto pede Uber. O Red Lobster e o World Food Trucks estão nos Locais deste Guia, ' +
        'com a rota do hotel.',
      pesquisa: '2026-09-11',
    },
  ],

  /* ---------------------------------------------------------------------------
     GASTRONOMIA — o que não se volta sem comer
     Itens ligados aos dias em que estão ao alcance, não à linha do tempo: não
     têm hora e não disputam espaço com atração. A tela do dia mostra os do dia;
     a aba Comer mostra todos, agrupados.
     tipo: doce | salgado | lanche | bebida        prioridade: imperdivel | se-der
     ------------------------------------------------------------------------ */
  gastronomia: [
    /* ---- 10 e 25/11 · Disney Springs ---- */
    { id: 'g-gideons', nome: 'Cookie de meia libra da Gideon’s Bakehouse', tipo: 'doce',
      onde: 'Disney Springs · The Landing', localId: 'disney-springs',
      dias: ['d-2026-11-10', 'd-2026-11-25'],
      quando: 'na volta pelo Disney Springs, para comer no hotel',
      preco: 'US$ 7–8 por cookie', prioridade: 'imperdivel',
      porque: 'Quase meia libra de cookie, com 24 horas de preparo, e a fila mais ' +
              'comentada do Disney Springs. O sabor fixo é o chocolate chip; há um ' +
              'sabor do mês que muda.',
      dica: 'Em fim de semana e feriado a casa usa fila virtual: você se cadastra na ' +
            'porta e recebe mensagem para voltar. Vale entrar na fila ao chegar e ' +
            'passear enquanto espera.',
      pesquisa: '2026-09-17' },

    /* ---- 11/11 · Magic Kingdom ---- */
    { id: 'g-dole-whip', nome: 'Dole Whip float de abacaxi', tipo: 'doce',
      onde: 'Magic Kingdom · Adventureland, na Aloha Isle', localId: 'magic-kingdom',
      dias: ['d-2026-11-11'],
      quando: 'na manhã da Adventureland, entre os Piratas e o Jungle Cruise',
      preco: 'US$ 6–8 — copo US$ 5,99, float com suco US$ 7,29', prioridade: 'imperdivel',
      porque: 'O sorvete de abacaxi que virou símbolo da Disney nasceu aqui, ao lado do ' +
              'Tiki Room. Gelado, sem lactose e servido em minutos.',
      dica: 'Peçam o Swirl, que mistura abacaxi e baunilha, no float. Usem o mobile order ' +
            'do My Disney Experience: a fila de balcão da Aloha Isle é das piores do parque. ' +
            'A trinta segundos dali, o Sunshine Tree Terrace faz a versão de laranja.',
      pesquisa: '2026-09-17' },

    { id: 'g-egg-roll', nome: 'Cheeseburger Spring Roll', tipo: 'lanche',
      onde: 'Magic Kingdom · carrinho Egg Roll Wagon, na entrada da Adventureland',
      localId: 'magic-kingdom', dias: ['d-2026-11-11'],
      quando: 'na passagem pelo arco da Adventureland, antes do almoço',
      preco: 'US$ 9–11 pelos dois rolinhos', prioridade: 'imperdivel',
      porque: 'Rolinho primavera frito recheado de carne, queijo, picles e molho de ' +
              'hambúrguer. A piada culinária virou culto e é o único salgado de verdade ' +
              'da Adventureland.',
      dica: 'Vem dois por porção, do tamanho exato de dividir. É carrinho sem mobile order ' +
            'e com horário instável, que costuma abrir no fim da manhã e fechar cedo em dia ' +
            'fraco: se estiver aberto na passagem, comprem ali — não voltem depois.',
      pesquisa: '2026-09-17' },

    { id: 'g-lobster-roll', nome: 'Lobster Roll do Columbia Harbour House', tipo: 'salgado',
      onde: 'Magic Kingdom · Liberty Square, no Columbia Harbour House',
      localId: 'magic-kingdom', restauranteId: 'r-columbia-harbour',
      dias: ['d-2026-11-11'],
      quando: 'no almoço das 11h50, que já está no roteiro',
      preco: 'US$ 18–20, com fritas', prioridade: 'imperdivel',
      porque: 'Lagosta gelada em pão de New England. É o prato que tirou o Columbia Harbour ' +
              'House da categoria de praça de alimentação e o único lugar do parque onde se ' +
              'come lagosta por menos de US$ 20.',
      dica: 'Façam mobile order e subam para o segundo andar, que quase ninguém acha: salão ' +
            'silencioso com janelas para a Fantasyland e para a Mansão. A clam chowder ' +
            '(US$ 6–7) e as fritas de alho negro e trufa (US$ 7) são melhores que as comuns.',
      pesquisa: '2026-09-17' },

    { id: 'g-waffle-mickey', nome: 'Waffle do Mickey com Nutella e frutas', tipo: 'doce',
      onde: 'Magic Kingdom · Liberty Square, no Sleepy Hollow Refreshments',
      localId: 'magic-kingdom', dias: ['d-2026-11-11'],
      quando: 'no fim da tarde, entre as voltas da Tomorrowland e o jantar',
      preco: 'US$ 9–10', prioridade: 'imperdivel',
      porque: 'Waffle em formato do Mickey feito na hora, dobrado sobre creme de avelã, ' +
              'banana e frutas vermelhas. A varanda do Sleepy Hollow tem a vista frontal do ' +
              'castelo: é sobremesa e foto no mesmo movimento.',
      dica: 'Mobile order e comam na varanda lateral, virada para o castelo. Cedo demais ' +
            'estraga o almoço; depois das 19h a varanda vira arquibancada de fogos. O funnel ' +
            'cake da mesma casa é o melhor do parque, mas o waffle se come andando.',
      pesquisa: '2026-09-17' },

    { id: 'g-corn-dogs', nome: 'Mini corn dogs do Casey’s Corner', tipo: 'lanche',
      onde: 'Magic Kingdom · Main Street, no Casey’s Corner', localId: 'magic-kingdom',
      restauranteId: 'r-caseys', dias: ['d-2026-11-11'],
      quando: 'no jantar das 17h55, que já está no roteiro',
      preco: 'US$ 10–12', prioridade: 'imperdivel',
      porque: 'Bolinhos de salsicha empanados em fubá, servidos aos punhados. São o pedido ' +
              'mais comum da casa e a coisa mais de beisebol americano que existe no parque, ' +
              'que é justamente o tema do Casey’s.',
      dica: 'Mobile order com antecedência: entre 18h30 e 20h o Casey’s engarrafa por causa ' +
            'dos fogos. Peçam os mini corn dogs e um foot-long com chili e queijo para ' +
            'dividir, e comam no meio-fio da Main Street — comer ali já garante lugar.',
      pesquisa: '2026-09-17' },

    { id: 'g-turkey-leg', nome: 'Coxa de peru defumada', tipo: 'salgado',
      onde: 'Magic Kingdom · Liberty Square Market, o carrinho depois do Hall of Presidents',
      localId: 'magic-kingdom', dias: ['d-2026-11-11'],
      quando: 'só se pularem o almoço sentado — é refeição, não petisco',
      preco: 'US$ 14–16', prioridade: 'se-der',
      porque: 'Coxa gigante, curada e defumada, com gosto mais de presunto do que de peru. ' +
              'É o lanche mais reconhecível da Disney desde os anos 1980 e o único que vocês ' +
              'vão ver todo mundo carregando.',
      dica: 'Só sai depois das 11h e é enorme: uma para os dois, comida em pé. Não faz sentido ' +
            'depois do almoço no Columbia Harbour House, que fica a cinquenta metros — ou uma ' +
            'coisa ou outra.',
      pesquisa: '2026-09-17' },

    /* ---- 13/11 · Epcot, no Food & Wine (27/08 a 21/11 de 2026) ---- */
    { id: 'g-cheddar-soup', nome: 'Sopa de cheddar com bacon e pão pretzel', tipo: 'salgado',
      onde: 'Epcot · barraca do Canadá, no Food & Wine', localId: 'epcot',
      dias: ['d-2026-11-13'],
      quando: 'na primeira volta do Food & Wine, às 14h20',
      preco: 'US$ 6–7', prioridade: 'imperdivel',
      porque: 'A sopa de cheddar do Canadá é o prato mais tradicional do festival e a barraca ' +
              'mais movimentada todo ano. Em 2026 ela volta na versão com bacon.',
      dica: 'É a fila mais longa do World Showcase depois das 16h. O Canadá é o primeiro ' +
            'pavilhão saindo pela esquerda: comecem por ele e pulem a fila da noite. Peçam ' +
            'junto o filé mignon com purê de Boursin (US$ 10–11) e resolvem a barraca de uma vez.',
      pesquisa: '2026-09-17' },

    { id: 'g-poutine', nome: 'Poutine de porco bo ssam com kimchi', tipo: 'salgado',
      onde: 'Epcot · Canadá, na La Poutinerie', localId: 'epcot',
      dias: ['d-2026-11-13'],
      quando: 'na mesma parada do Canadá, na primeira volta',
      preco: 'US$ 11–13', prioridade: 'imperdivel',
      porque: 'É a novidade de 2026 do Epcot e o prato mais elogiado do festival este ano: ' +
              'batata, queijo coalho, porco bo ssam, gravy de gochujang e kimchi. O balcão ' +
              'abriu em julho de 2026, no lugar do Refreshment Port.',
      dica: 'A versão com kimchi só existe durante o festival; as poutines de Québec e ' +
            'Montréal ficam o ano todo. É o item mais pesado da lista — dividam, senão a volta ' +
            'seguinte não desce.',
      pesquisa: '2026-09-17' },

    { id: 'g-school-bread', nome: 'School Bread da Noruega', tipo: 'doce',
      onde: 'Epcot · pavilhão da Noruega, na Kringla Bakeri Og Kafe', localId: 'epcot',
      dias: ['d-2026-11-13'],
      quando: 'na volta da tarde, logo depois do Frozen Ever After',
      preco: 'US$ 5–6', prioridade: 'imperdivel',
      porque: 'Pão doce macio recheado de creme de baunilha e coberto de coco. É o lanche ' +
              'mais citado do World Showcase há décadas e o único item obrigatório da Noruega — ' +
              'e é da padaria fixa, não some quando o festival acaba.',
      dica: 'A fila da Kringla estoura entre 12h e 15h; o Frozen Ever After deixa vocês na ' +
            'porta às 14h. Divide bem entre dois.',
      pesquisa: '2026-09-17' },

    { id: 'g-temaki', nome: 'Temaki picante de atum', tipo: 'salgado',
      onde: 'Epcot · barraca do Japão, no Food & Wine', localId: 'epcot',
      dias: ['d-2026-11-13'],
      quando: 'na segunda volta, às 15h30',
      preco: 'US$ 9–10 — a versão wagyu sai por US$ 10–11', prioridade: 'imperdivel',
      porque: 'Eleito um dos três melhores itens novos de 2026, com arroz crocante e pimenta ' +
              'de verdade. É raro num festival em que quase tudo é adocicado.',
      dica: 'O Japão fica na volta da lagoa oposta ao Canadá, então encaixa na segunda volta. ' +
            'Peçam o Sapporo Reserve no copo de 6 oz (US$ 5) junto.',
      pesquisa: '2026-09-17' },

    { id: 'g-cookie-pistache', nome: 'Cookie de chocolate com pistache', tipo: 'doce',
      onde: 'Epcot · Marrocos, na barraca Tangierine Café', localId: 'epcot',
      dias: ['d-2026-11-13'],
      quando: 'na volta de beliscar, às 17h30',
      preco: 'US$ 4–5', prioridade: 'imperdivel',
      porque: 'Eleito o melhor item novo de 2026 pela Attractions Magazine: massa recheada ' +
              'com centro cremoso de pistache. É também o mais barato entre os premiados.',
      dica: 'É o item mais fácil de carregar comendo enquanto anda — bom justamente para a ' +
            'volta em que vocês só querem beliscar.',
      pesquisa: '2026-09-17' },

    { id: 'g-vinho-grecia', nome: 'Flight de vinhos gregos', tipo: 'bebida',
      onde: 'Epcot · barraca da Grécia, no Food & Wine', localId: 'epcot',
      dias: ['d-2026-11-13'],
      quando: 'em qualquer volta — é a melhor conta do festival',
      preco: 'US$ 7–8 pelas três taças', prioridade: 'imperdivel',
      porque: 'Três taças — branco, rosé e tinto — pelo preço de meia taça avulsa da Itália, ' +
              'que sai por US$ 12. É o melhor custo-benefício alcoólico do festival inteiro.',
      dica: 'Se quiserem variar nas quatro voltas: caipirinha frozen no Brasil (US$ 12–13), ' +
            'Amaretto Bellini na Itália (US$ 16) e flight de três cervejas na Alemanha ou na ' +
            'Bélgica (US$ 12–13). Cerveja avulsa fica entre US$ 6 e US$ 10.',
      pesquisa: '2026-09-17' },

    { id: 'g-waffle-belga', nome: 'Waffle belga com cookie butter', tipo: 'doce',
      onde: 'Epcot · barraca da Bélgica, entre a China e a Alemanha', localId: 'epcot',
      dias: ['d-2026-11-13'],
      quando: 'na última volta, às 20h, antes de pegar lugar para o Luminous',
      preco: 'US$ 5–6', prioridade: 'se-der',
      porque: 'É um dos trinta pratos-legado trazidos de volta pelos trinta anos do festival ' +
              'e o doce com melhor conta de todo o World Showcase.',
      dica: 'A mesma barraca tem o flight de três cervejas belgas por US$ 12–13: é a melhor ' +
            'parada única de doce com bebida na volta da noite.',
      pesquisa: '2026-09-17' },

    /* ---- 14, 17 e 19/11 · o Mundo Mágico, nos dois parques ---- */
    { id: 'g-butterbeer', nome: 'Cerveja amanteigada frozen', tipo: 'bebida',
      onde: 'Hogsmeade e Beco Diagonal · Universal', localId: null,
      dias: ['d-2026-11-14', 'd-2026-11-17', 'd-2026-11-19'],
      quando: 'na primeira passagem por qualquer das duas áreas',
      preco: 'US$ 9–10 no copo comum', prioridade: 'imperdivel',
      porque: 'É a bebida que define o Wizarding World, e a versão frozen é a que ' +
              'os dois parques vendem mais. Sem álcool, doce, com espuma de creme ' +
              'de manteiga por cima.',
      dica: 'O preço é o mesmo nos dois parques. O copo de souvenir custa mais que o ' +
            'dobro e a bebida é a mesma — peçam no copo comum. Frozen é a versão de ' +
            'calor; a quente só compensa em manhã fria.',
      pesquisa: '2026-09-17' },

    { id: 'g-butterbeer-sorvete', nome: 'Sorvete de cerveja amanteigada', tipo: 'doce',
      onde: 'Balcão do Three Broomsticks, em Hogsmeade, e The Hopping Pot, no Beco',
      localId: null, dias: ['d-2026-11-14', 'd-2026-11-19'],
      quando: 'de sobremesa no jantar do Three Broomsticks, em 14/11',
      preco: 'US$ 7–8 — no Hopping Pot sai um pouco mais barato', prioridade: 'imperdivel',
      porque: 'É a variação que mais gente diz superar a frozen: mesma nota de butterscotch, ' +
              'em textura de sorvete macio com chantilly. Existe o ano inteiro, não é sazonal.',
      dica: 'Pedir no balcão do próprio Three Broomsticks no jantar de 14/11 não custa fila ' +
            'nenhuma. A terceira variação da casa é o potted cream, a versão de colher, que ' +
            'divide bem junto. O waffle de cerveja amanteigada NÃO existe em novembro: ele ' +
            'é da Butterbeer Season, que roda de março a maio.',
      pesquisa: '2026-09-17' },

    { id: 'g-hogs-head', nome: 'Hog’s Head Brew', tipo: 'bebida',
      onde: 'Islands of Adventure · Hogsmeade, no Hog’s Head Pub',
      localId: 'islands-of-adventure', dias: ['d-2026-11-14', 'd-2026-11-19'],
      quando: 'no mesmo prédio do jantar de 14/11 — entrem pelo pub antes de sentar',
      preco: 'US$ 13–17 o chope', prioridade: 'se-der',
      porque: 'Cerveja feita só para a Universal e vendida só ali, e o javali empalhado atrás ' +
              'do balcão rosna quando alguém deixa gorjeta. É pub dentro de parque, que é o ' +
              'formato que vocês aceitam.',
      dica: 'O pub é o fundo do próprio Three Broomsticks: não é desvio nenhum no jantar das ' +
            '20h. Dragon Scale e Dark Forest Ale são as outras duas exclusivas, e dá para ' +
            'pedir uma prova dos rótulos da casa.',
      pesquisa: '2026-09-17' },

    { id: 'g-cauldron-cake', nome: 'Cauldron Cake', tipo: 'doce',
      onde: 'Sugarplum’s Sweet Shop, no Beco · e Honeydukes, em Hogsmeade',
      localId: null, dias: ['d-2026-11-17', 'd-2026-11-19'],
      quando: 'numa das duas passagens — é o mesmo bolo, comprem uma vez só',
      preco: 'US$ 11–13', prioridade: 'se-der',
      porque: 'Bolo de chocolate com buttercream imitando chamas, servido dentro de um ' +
              'caldeirãozinho de silicone que vai embora com vocês. É doce e souvenir pelo ' +
              'mesmo preço.',
      dica: 'O caldeirão é o motivo de comprar: um só, para dividir. O produto do Beco e o do ' +
            'Honeydukes são idênticos — não comprem nos dois.',
      pesquisa: '2026-09-17' },

    { id: 'g-butterbeer-fudge', nome: 'Butterbeer Fudge', tipo: 'doce',
      onde: 'Islands of Adventure · Hogsmeade, no Honeydukes',
      localId: 'islands-of-adventure', dias: ['d-2026-11-19'],
      quando: 'na manhã de Hogsmeade, para levar na mala',
      preco: 'US$ 5–7 a fatia', prioridade: 'se-der',
      porque: 'É a terceira variação permanente da cerveja amanteigada, com o sabor ' +
              'concentrado em doce de leite — e a única que viaja: aguenta a mala e vira ' +
              'lembrança comestível.',
      dica: 'Comprem em 19/11, o último dia no Islands, e não em 14/11, para não carregar nem ' +
            'derreter. A fatia inteira é enorme; peçam meia se o atendente deixar.',
      pesquisa: '2026-09-17' },

    /* ---- 15/11 · Hollywood Studios ---- */
    { id: 'g-wookiee', nome: 'Wookiee Cookie', tipo: 'doce',
      onde: 'Hollywood Studios · Echo Lake, no Backlot Express', localId: 'hollywood-studios',
      dias: ['d-2026-11-15'],
      quando: 'na passagem do Toy Story Land para o Galaxy’s Edge, de manhã',
      preco: 'US$ 7–8', prioridade: 'imperdivel',
      porque: 'Dois cookies de aveia recheados com creme branco de baunilha e marshmallow, ' +
              'com uma bandoleira de chocolate ao leite atravessada por cima. Estreou em 2019 ' +
              'e é o cookie mais fotografado do parque — é o biscoito recheado que vocês lembravam.',
      dica: 'Fica no balcão de sobremesas do Backlot Express e dá para comprar só a sobremesa, ' +
            'sem pedir refeição. O Backlot fica ao lado do Star Tours, no caminho.',
      pesquisa: '2026-09-17' },

    { id: 'g-leite-azul', nome: 'Leite azul e leite verde', tipo: 'bebida',
      onde: 'Hollywood Studios · Galaxy’s Edge, no Milk Stand', localId: 'hollywood-studios',
      dias: ['d-2026-11-15'],
      quando: 'ao entrar no Galaxy’s Edge, antes do Rise',
      preco: 'US$ 9–10 cada · US$ 18 a versão com destilado', prioridade: 'imperdivel',
      porque: 'É o ícone gastronômico do Galaxy’s Edge: bebida gelada tipo smoothie à base de ' +
              'arroz e coco, vegana. O azul é pitaya, abacaxi, limão e melancia; o verde é ' +
              'tangerina, maracujá, toranja e flor de laranjeira.',
      dica: 'Um de cada e troquem: o azul é doce e frutado, o verde é ácido e cítrico. As ' +
            'versões com álcool levam rum no azul e tequila no verde. Derrete rápido no calor ' +
            'da Flórida — bebam na sombra ali mesmo.',
      pesquisa: '2026-09-17' },

    { id: 'g-kaadu-ribs', nome: 'Smoked Kaadu Pork Ribs', tipo: 'salgado',
      onde: 'Hollywood Studios · Galaxy’s Edge, no Docking Bay 7', localId: 'hollywood-studios',
      restauranteId: 'r-docking-bay', dias: ['d-2026-11-15'],
      quando: 'no almoço das 12h20, que já está no roteiro',
      preco: 'US$ 16–18', prioridade: 'imperdivel',
      porque: 'Costela que desmancha, com muffin de milho e blueberry e salada de repolho ' +
              'roxo. É o prato mais citado do Docking Bay 7 e um dos melhores balcões da ' +
              'Disney World.',
      dica: 'O Docking Bay 7 só tem fila de mobile order: abram o app por volta das 11h para ' +
            'garantir a janela de retirada. A segunda opção é o frango frito Tip Yip, e a ' +
            'sobremesa da casa é o Black Spire Mousse.',
      pesquisa: '2026-09-17' },

    { id: 'g-ronto-wrap', nome: 'Ronto Wrap', tipo: 'salgado',
      onde: 'Hollywood Studios · Galaxy’s Edge, no Ronto Roasters', localId: 'hollywood-studios',
      dias: ['d-2026-11-15'],
      quando: 'como lanche ao entrar no Galaxy’s Edge, junto do leite',
      preco: 'US$ 13–15', prioridade: 'imperdivel',
      porque: 'Porco assado, linguiça grelhada, molho de pimenta-do-reino e slaw na pita. É o ' +
              'prato mais vendido e mais bem avaliado do Hollywood Studios inteiro.',
      dica: 'Peçam no Ronto Roasters, não no Docking Bay 7: sai dois dólares mais barato e em ' +
            'minutos. Como o almoço já é no Docking Bay, este é o extra da manhã, para dividir.',
      pesquisa: '2026-09-17' },

    { id: 'g-fuzzy-tauntaun', nome: 'Fuzzy Tauntaun', tipo: 'bebida',
      onde: 'Hollywood Studios · Galaxy’s Edge, no Oga’s Cantina', localId: 'hollywood-studios',
      restauranteId: 'r-ogas', dias: ['d-2026-11-15'],
      quando: 'na primeira rodada do Oga’s, às 17h05',
      preco: 'US$ 19–21', prioridade: 'imperdivel',
      porque: 'É o drink do Oga’s: vodca de pêssego e laranja, schnapps e suco, coroado por ' +
              'uma espuma de buzz button que formiga e adormece os lábios por alguns ' +
              'segundos. Não existe igual em nenhum outro bar.',
      dica: 'Bebam os primeiros goles direto pela espuma, sem canudo, senão o efeito se perde. ' +
            'É o que todo mundo pede — peçam logo na primeira rodada.',
      pesquisa: '2026-09-17' },

    { id: 'g-jedi-mind', nome: 'Jedi Mind Trick', tipo: 'bebida',
      onde: 'Hollywood Studios · Galaxy’s Edge, no Oga’s Cantina', localId: 'hollywood-studios',
      restauranteId: 'r-ogas', dias: ['d-2026-11-15'],
      quando: 'logo depois do Fuzzy Tauntaun, como contraponto',
      preco: 'US$ 18–20', prioridade: 'se-der',
      porque: 'O mais forte do cardápio — vodca de toranja e rosa, falernum e curaçau azul — ' +
              'e o contraponto seco e cítrico do Fuzzy Tauntaun, que é doce.',
      dica: 'Dois drinks por pessoa é o limite prático em quarenta e cinco minutos de reserva. ' +
            'Fujam do Yub Nub: os US$ 49 são pela caneca de souvenir, não pela bebida.',
      pesquisa: '2026-09-17' },

    { id: 'g-cheese-roll', nome: 'Umbaran Cheese Roll', tipo: 'lanche',
      onde: 'Hollywood Studios · Galaxy’s Edge, no Oga’s Cantina', localId: 'hollywood-studios',
      restauranteId: 'r-ogas', dias: ['d-2026-11-15'],
      quando: 'junto dos drinks das 17h05, um só para dividir',
      preco: 'US$ 12–14', prioridade: 'imperdivel',
      porque: 'Pão de pretzel com especiarias recheado de queijo com ervas. É o único petisco ' +
              'do Oga’s que vale o preço e entrou na lista dos dez melhores lanches do parque ' +
              'em 2026.',
      dica: 'Como o jantar é logo depois, às 18h10, peçam UM para dividir — não o Happabore ' +
            'Sampler nem o flatbread. Os Batuu Bits são só salgadinho crocante; pulem.',
      pesquisa: '2026-09-17' },

    /* ---- 16/11 · Animal Kingdom ---- */
    { id: 'g-satuli-bowl', nome: 'Bowl de carne com chimichurri', tipo: 'salgado',
      onde: 'Animal Kingdom · Pandora, no Satu’li Canteen', localId: 'animal-kingdom',
      restauranteId: 'r-satuli', dias: ['d-2026-11-16'],
      quando: 'no almoço das 12h30, que já está no roteiro',
      preco: 'US$ 13–19 conforme a proteína', prioridade: 'imperdivel',
      porque: 'Bowl montado por vocês: proteína grelhada sobre quinoa, arroz integral, salada ' +
              'ou batata-doce, com molhos de ervas, chimichurri ou feijão preto. É reconhecido ' +
              'há anos como o melhor balcão da Disney World.',
      dica: 'Mobile order é obrigatório — escolham a janela de retirada logo ao entrar no ' +
            'parque, porque entre 12h e 13h30 o Satu’li lota. A combinação que ganha é carne ' +
            'com chimichurri sobre quinoa e legumes. A base de batata-doce é adocicada.',
      pesquisa: '2026-09-17' },

    { id: 'g-cheeseburger-pods', nome: 'Cheeseburger Steamed Pods', tipo: 'lanche',
      onde: 'Animal Kingdom · Pandora, no Satu’li Canteen', localId: 'animal-kingdom',
      restauranteId: 'r-satuli', dias: ['d-2026-11-16'],
      quando: 'no mesmo pedido do almoço, de entrada para dividir',
      preco: 'US$ 13–15', prioridade: 'se-der',
      porque: 'Dois pães bao no vapor recheados de cheeseburger, com salada de couve ' +
              'crocante. É o melhor lanche de mão do parque: come-se na fila do Flight of ' +
              'Passage sem talher.',
      dica: 'É lanche, não almoço: se vocês vão de bowl, uma porção só para dividir. Também ' +
            'serve de reserva para a volta à Pandora no fim do dia, se a fome bater antes do ' +
            'Sanaa das 19h50.',
      pesquisa: '2026-09-17' },

    { id: 'g-nomad-ribs', nome: 'Sticky Pork Ribs do Nomad Lounge', tipo: 'salgado',
      onde: 'Animal Kingdom · Discovery Island, no Nomad Lounge', localId: 'animal-kingdom',
      restauranteId: 'r-nomad', dias: ['d-2026-11-16'],
      quando: 'na varanda das 14h25, que já está no roteiro',
      preco: 'US$ 16–18 — os outros pratinhos ficam entre US$ 16 e US$ 23',
      prioridade: 'imperdivel',
      porque: 'O Nomad serve pratinhos com o padrão da cozinha do Tiffins, o restaurante de ' +
              'assinatura do parque, pela metade do preço, numa varanda de ventilador de teto ' +
              'sobre o rio.',
      dica: 'O Nomad não aceita reserva, é só walk-up: entrem na lista de espera pelo My ' +
            'Disney Experience assim que passarem pela Discovery Island de manhã. Em dia cheio ' +
            'a lista fecha no meio da tarde; aí tentem banco no bar. Dois pratinhos bastam.',
      pesquisa: '2026-09-17' },

    { id: 'g-lamu', nome: 'Lamu Libation', tipo: 'bebida',
      onde: 'Animal Kingdom · Discovery Island, no Nomad Lounge', localId: 'animal-kingdom',
      restauranteId: 'r-nomad', dias: ['d-2026-11-16'],
      quando: 'com os pratinhos das 14h25',
      preco: 'US$ 15–19 os coquetéis · US$ 11–13 a Kungaloosh Ale', prioridade: 'se-der',
      porque: 'É o coquetel-assinatura do bar mais querido do parque — rum, curaçau de ' +
              'laranja, limão e gengibre. Cada drink do Nomad tem nome e história de uma ' +
              'expedição, e o teto é coberto de lenços de viajante assinados por hóspedes.',
      dica: 'Um Lamu Libation e uma Kungaloosh Ale, a cerveja artesanal exclusiva do parque: ' +
            'provam o doce e o amargo por metade do preço de dois coquetéis. Não vale beber ' +
            'dois de US$ 17 antes de um jantar como o do Sanaa.',
      pesquisa: '2026-09-17' },

    { id: 'g-night-blossom', nome: 'Night Blossom', tipo: 'bebida',
      onde: 'Animal Kingdom · Pandora, no Pongu Pongu', localId: 'animal-kingdom',
      dias: ['d-2026-11-16'],
      quando: 'no fim do dia, com a Pandora já acendendo, por volta das 17h',
      preco: 'US$ 7–8', prioridade: 'imperdivel',
      porque: 'Limonada em camadas de maçã verde e pera-do-deserto, com bolinhas de boba de ' +
              'maçã no fundo, montada num degradê rosa e verde. É a bebida-símbolo da Pandora ' +
              'e o item mais fotografado do parque.',
      dica: 'Ela é feita para ser vista contra a bioluminescência: peçam depois de escurecer, ' +
            'não de manhã. Não mexam antes de fotografar, que as camadas somem. O boba no ' +
            'canudo grosso pega desprevenido quem não espera mastigar.',
      pesquisa: '2026-09-17' },

    { id: 'g-pongu-lumpia', nome: 'Pongu Lumpia', tipo: 'doce',
      onde: 'Animal Kingdom · Pandora, no Pongu Pongu', localId: 'animal-kingdom',
      dias: ['d-2026-11-16'],
      quando: 'no mesmo balcão e na mesma parada do Night Blossom',
      preco: 'US$ 3–5', prioridade: 'imperdivel',
      porque: 'Rolinho quente recheado de abacaxi com cream cheese, açucarado por fora. É o ' +
              'lanche com a melhor relação de prazer por dólar do parque inteiro, por menos de ' +
              'US$ 4.',
      dica: 'O contraste com o Night Blossom gelado é o ponto: peçam os dois juntos. Sai ' +
            'quentíssimo por dentro, esperem um minuto. Um por pessoa — é pequeno, e dividir ' +
            'um só frustra.',
      pesquisa: '2026-09-17' },

    { id: 'g-dole-rum', nome: 'Dole Whip com rum de coco', tipo: 'bebida',
      onde: 'Animal Kingdom · África, no Tamu Tamu Refreshments', localId: 'animal-kingdom',
      dias: ['d-2026-11-16'],
      quando: 'na volta para a Discovery Island, por volta das 14h — não de manhã',
      preco: 'US$ 14–16 com rum · US$ 5–7 sem', prioridade: 'se-der',
      porque: 'É o único lugar da Disney World onde o Dole Whip vem com rum de coco. O lanche ' +
              'mais famoso da Disney na versão adulta que só existe aqui.',
      dica: 'Vocês passam pela África às 8h, cedo demais para rum: o Tamu Tamu fica no caminho ' +
            'entre a África e a Discovery Island, então encaixa perto do Nomad. Se o álcool ' +
            'ficar todo no Nomad, a versão sem rum sai por um terço do preço.',
      pesquisa: '2026-09-17' },

    /* ---- 17/11 · Universal Studios e CityWalk ---- */
    { id: 'g-fishy-green-ale', nome: 'Fishy Green Ale', tipo: 'bebida',
      onde: 'Universal Studios · Beco Diagonal, no The Hopping Pot, em Carkitt Market',
      localId: 'universal-studios', dias: ['d-2026-11-17'],
      quando: 'na volta ao Beco às 12h40, antes do almoço no Leaky Cauldron',
      preco: 'US$ 7–8', prioridade: 'imperdivel',
      porque: 'Creme gelado de menta e canela com ovas de blueberry que estouram no canudo ' +
              'grosso. É a bebida mais estranha e mais fotografada do Beco, e não existe em ' +
              'nenhum outro lugar de Orlando.',
      dica: 'É doce e cremosa: tomem antes do almoço, não depois, senão estraga o apetite. O ' +
            'canudo largo vem junto e é parte do brinquedo.',
      pesquisa: '2026-09-17' },

    { id: 'g-big-pink', nome: 'The Big Pink, a rosquinha do Homer', tipo: 'doce',
      onde: 'Universal Studios · Springfield, no Lard Lad Donuts', localId: 'universal-studios',
      dias: ['d-2026-11-17'],
      quando: 'na passagem por Springfield, entre o Simpsons Ride e o desfile',
      preco: 'US$ 11–13', prioridade: 'imperdivel',
      porque: 'Vinte centímetros de diâmetro e quatrocentos gramas: a rosquinha rosa do Homer ' +
              'feita de verdade. É o item mais icônico do parque fora do mundo do Harry Potter ' +
              'e a foto de Springfield.',
      dica: 'Uma para o casal, jamais duas. Não comam perto do jantar no Lombard’s às 18h45 — ' +
            'ela mata a fome dos dois. A licença dos Simpsons vence por volta de 2027: vale ' +
            'reconferir perto da viagem se Springfield ainda está de pé.',
      pesquisa: '2026-09-17' },

    { id: 'g-flaming-moe', nome: 'Flaming Moe', tipo: 'bebida',
      onde: 'Universal Studios · Springfield, no Moe’s Tavern', localId: 'universal-studios',
      dias: ['d-2026-11-17'],
      quando: 'na mesma parada de Springfield, no balcão do Moe’s',
      preco: 'US$ 8–10', prioridade: 'imperdivel',
      porque: 'Refrigerante de laranja servido num copo de fundo duplo com gelo seco: sai ' +
              'fumaça de verdade da borda por alguns minutos. É o drink-espetáculo do parque ' +
              'e não tem álcool, então serve para os dois.',
      dica: 'A fumaça dura pouco — a foto é nos primeiros sessenta segundos. O copo é ' +
            'reutilizável e pode ser levado. Peçam junto com a Duff, no mesmo balcão.',
      pesquisa: '2026-09-17' },

    { id: 'g-duff', nome: 'Duff Beer no Moe’s Tavern', tipo: 'bebida',
      onde: 'Universal Studios · Springfield, no Moe’s Tavern e no Duff Brewery',
      localId: 'universal-studios', dias: ['d-2026-11-17'],
      quando: 'junto do Flaming Moe',
      preco: 'US$ 11–14 o chope · US$ 9–12 a garrafa', prioridade: 'se-der',
      porque: 'É a cerveja do desenho existindo de verdade, servida dentro da réplica exata do ' +
              'bar do Moe, com o telefone do Bart e o Barney no banco. Existem Duff, Duff Lite ' +
              'e Duff Dry.',
      dica: 'O valor ali é o cenário, não o líquido — a cerveja é fraca. O Moe’s é balcão em ' +
            'pé e entra rápido; o Duff Brewery tem mesas ao ar livre e é melhor para o casal.',
      pesquisa: '2026-09-17' },

    { id: 'g-florean', nome: 'Sorvete do Florean Fortescue’s', tipo: 'doce',
      onde: 'Universal Studios · Beco Diagonal, no Florean Fortescue’s Ice-Cream Parlour',
      localId: 'universal-studios', dias: ['d-2026-11-17'],
      quando: 'na volta ao Beco à noite, às 20h, antes do CityWalk',
      preco: 'US$ 7–8 na casquinha · US$ 10–11 o sundae na taça', prioridade: 'imperdivel',
      porque: 'Sabores que só existem ali: Earl Grey com lavanda, sticky toffee pudding, ' +
              'chocolate com pimenta, salted caramel blondie e maçã verde. É sorveteria de ' +
              'verdade, com mesas, não quiosque.',
      dica: 'De dia a fila toma a rua: por isso está na volta das 20h. Earl Grey com lavanda e ' +
            'sticky toffee são os dois que ninguém acha fora dali — peçam uma casquinha de ' +
            'dois sabores em vez de duas.',
      pesquisa: '2026-09-17' },

    { id: 'g-voodoo', nome: 'Voodoo Doll doughnut', tipo: 'doce',
      onde: 'CityWalk · Voodoo Doughnut, ao lado do NBC Sports Grill & Brew',
      localId: 'citywalk', dias: ['d-2026-11-17'],
      quando: 'na saída pelo CityWalk, às 20h55',
      preco: 'US$ 5–7 a unidade · US$ 26–35 a caixa de doze', prioridade: 'imperdivel',
      porque: 'A marca de Portland que virou culto. O boneco de vodu recheado de geleia de ' +
              'framboesa com a estaca de pretzel é o doce mais reconhecível do CityWalk.',
      dica: 'Encaixa exatamente na saída das 20h55. Façam o pedido pelo app da Universal de ' +
            'dentro do parque e retirem na janela expressa: a fila do balcão à noite é longa. ' +
            'O Bacon Maple Bar é o sabor que mais divide opinião e vale provar junto.',
      pesquisa: '2026-09-17' },

    /* ---- 20/11 · Epic Universe ---- */
    { id: 'g-crepe-bierraubeurre', nome: 'Crepe de cerveja amanteigada', tipo: 'doce',
      onde: 'Epic Universe · Ministry of Magic, no Café L’air de la Sirène',
      localId: 'epic-universe', dias: ['d-2026-11-20'],
      quando: 'na passagem pelo Ministry, às 18h20',
      preco: 'US$ 19–22', prioridade: 'imperdivel',
      porque: 'É o item-assinatura do Wizarding World francês e o único lugar do mundo onde a ' +
              'cerveja amanteigada vira crepe. A porção é grande, feita para dividir.',
      dica: 'Peçam pelo app da Universal: o balcão do Café é o pior gargalo da área. Um crepe ' +
            'para os dois — o jantar no Atlantic é às 17h e não sobra espaço para mais.',
      pesquisa: '2026-09-17' },

    { id: 'g-giggle-water', nome: 'Giggle Water', tipo: 'bebida',
      onde: 'Epic Universe · Ministry of Magic, no Café L’air de la Sirène e no Le Gobelet Noir',
      localId: 'epic-universe', dias: ['d-2026-11-20'],
      quando: 'na mesma passagem pelo Ministry',
      preco: 'US$ 13–15', prioridade: 'imperdivel',
      porque: 'Spritz de prosecco com flor de sabugueiro e brilho âmbar: é a champanhe bruxa ' +
              'do cânone, criada para o Epic e sem equivalente nos outros parques.',
      dica: 'Sai mais rápido no Le Gobelet Noir, o bar escondido no Quartier de Nicolas ' +
            'Flamel, que quase sempre tem menos gente que o Café. Lá o Breuvage Sombre, de ' +
            'fruta escura com pérolas de iogurte, sai pela metade do preço e é sem álcool.',
      pesquisa: '2026-09-17' },

    { id: 'g-hidromel-berk', nome: 'Hidromel do Gobber e Stoik’s Ale', tipo: 'bebida',
      onde: 'Epic Universe · Isle of Berk, no Mead Hall', localId: 'epic-universe',
      dias: ['d-2026-11-20'],
      quando: 'na parada de Berk das 15h45, antes do show',
      preco: 'US$ 13–15 cada · Yaknog US$ 7–8', prioridade: 'imperdivel',
      porque: 'A hidromel servida no salão viking é a única do resort, e o Stoik’s Ale é o ' +
              'chope de casa criado para Berk. O Mead Hall é coberto e com ar-condicionado.',
      dica: 'No mesmo balcão peçam o Yaknog, a bebida de chocolate maltado com canela do ' +
            'cânone de Como Treinar Seu Dragão: é barata, gelada e a melhor foto da área. O ' +
            'salão é o refúgio do meio do dia.',
      pesquisa: '2026-09-17' },

    { id: 'g-dk-float', nome: 'DK Crush Float', tipo: 'doce',
      onde: 'Epic Universe · Super Nintendo World, no The Bubbly Barrel',
      localId: 'epic-universe', dias: ['d-2026-11-20'],
      quando: 'depois do Mine-Cart Madness, às 20h — não antes do almoço',
      preco: 'US$ 12–14 · US$ 18–20 com a caneca-barril', prioridade: 'se-der',
      porque: 'Sorvete de banana com soda de abacaxi, casquinha, toffee e pipoca caramelizada. ' +
              'É o que vale parar em Super Nintendo World fora do Toadstool, e é diferente da ' +
              'versão do Japão.',
      dica: 'Mesmo sem a caneca vem uma colher do Donkey Kong. Como o almoço já é no Toadstool, ' +
            'deixem o float para depois da atração da noite.',
      pesquisa: '2026-09-17' },

    { id: 'g-bar-zenith', nome: 'Coquetel do Bar Zenith', tipo: 'bebida',
      onde: 'Epic Universe · Celestial Park, no Bar Zenith, de frente para as fontes',
      localId: 'epic-universe', dias: ['d-2026-11-20'],
      quando: 'no fim da tarde, a dois minutos do jantar no Atlantic',
      preco: 'US$ 15–17 os coquetéis · US$ 7–8 o mocktail', prioridade: 'se-der',
      porque: 'É o bar mais bonito do parque, e o Meteor Strike vem com brilho de ouro ' +
              'comestível e um cubo de açúcar flamejante. O brinde do casal, com as fontes ' +
              'coreografadas ao fundo.',
      dica: 'Fica a dois minutos a pé do Atlantic: sentem ali antes de entrar para o jantar. O ' +
            'Eccentric Orbit é a alternativa barata e foi eleito o melhor sem álcool do parque.',
      pesquisa: '2026-09-17' },

    /* ---- 22/11 · SeaWorld, com o All-Day Dining do ingresso ---- */
    { id: 'g-brisket-voyagers', nome: 'Brisket defumado do Voyager’s Smokehouse',
      tipo: 'salgado', onde: 'SeaWorld · em frente ao Seaport Theater, no Voyager’s Smokehouse',
      localId: 'seaworld', restauranteId: 'r-voyagers', dias: ['d-2026-11-22'],
      quando: 'no almoço das 12h55, que já está no roteiro',
      preco: 'incluído no All-Day Dining do ingresso', prioridade: 'imperdivel',
      porque: 'É a marca da casa do SeaWorld e o consenso de que é a melhor comida do parque. ' +
              'Fora do plano, é o prato que mais paga o All-Day Dining.',
      dica: 'O All-Day Dining libera uma rodada a cada noventa minutos e para trinta minutos ' +
            'antes de o restaurante fechar. Façam a primeira rodada cedo no Voyager’s e ' +
            'cronometrem as seguintes.',
      pesquisa: '2026-09-17' },

    { id: 'g-cheesecake-natal', nome: 'Cheesecake de peppermint da temporada', tipo: 'doce',
      onde: 'SeaWorld · quiosque Sweet Sailings e nos restaurantes do plano',
      localId: 'seaworld', dias: ['d-2026-11-22'],
      quando: 'de sobremesa na rodada do Voyager’s',
      preco: 'incluído na rodada do All-Day Dining quando pedido dentro do restaurante',
      prioridade: 'imperdivel',
      porque: 'É o doce oficial da temporada de Natal do SeaWorld, de 16/11 a 05/01, e o único ' +
              'item natalino que sai sem pagar nada além do ingresso — os restaurantes que o ' +
              'vendem são justamente os do plano.',
      dica: 'Peçam como a sobremesa da rodada, não na cabana. O peppermint é o sabor que só ' +
            'existe no Natal; há também cookies and cream, caramelo, butter pecan e cenoura. ' +
            'Confirmem no balcão: o cheesecake fica fora do Festive Food and Sip Sampler.',
      pesquisa: '2026-09-17' },

    { id: 'g-cocoa-claus', nome: 'Chocolate quente e cookie do Claus Cookie Co.',
      tipo: 'bebida', onde: 'SeaWorld · cabanas do Christmas Celebration, no Claus Cookie Co.',
      localId: 'seaworld', dias: ['d-2026-11-22'],
      quando: 'na pausa do Waterfront das 16h20, com o parque já aceso',
      preco: 'US$ 9–10 o chocolate especial · US$ 8–16 os itens de cabana · pago à parte',
      prioridade: 'imperdivel',
      porque: 'É o par de chocolate quente com biscoito que só existe na temporada de Natal, e ' +
              'a versão frozen s’mores é a mais fotografada do evento. O cookie deep-dish é ' +
              'grande o bastante para dividir.',
      dica: 'ATENÇÃO: as cabanas de evento estão explicitamente fora do All-Day Dining — isto ' +
            'é pago à parte. Se forem querer só duas ou três coisas de Natal, NÃO comprem o ' +
            'lanyard de amostras: sai mais caro que pagar avulso.',
      pesquisa: '2026-09-17' },

    /* ---- 23/11 · Busch Gardens, com o All-Day Dining e o Christmas Town ---- */
    { id: 'g-zambia', nome: 'Costela do Zambia Smokehouse', tipo: 'salgado',
      onde: 'Busch Gardens · Stanleyville, no Zambia Smokehouse', localId: 'busch-gardens', restauranteId: 'r-zambia',
      dias: ['d-2026-11-23'],
      quando: 'no almoço das 13h25, que já está no roteiro',
      preco: 'incluído no All-Day Dining do ingresso', prioridade: 'imperdivel',
      porque: 'É a casa de churrasco do parque, com grelha de lenha de carvalho à vista, e o ' +
              'melhor uso do plano de refeição: porções grandes de costela, frango e brisket ' +
              'defumados na hora.',
      dica: 'Peçam costela ou frango, não o brisket — é ele o alvo das reclamações de ' +
            'ressecamento. O plano cobre Zagora, Zambia, Dragon Fire, Oasis Pizza, BG Cuban, ' +
            'SheiKra Eats, Tot Topia e Twisted Tails, e NÃO cobre álcool.',
      pesquisa: '2026-09-17' },

    { id: 'g-cocoa-christmastown', nome: 'Chocolate quente e biscoitos do Christmas Town',
      tipo: 'doce', onde: 'Busch Gardens · Christmas Town Village, nas cabanas do mercado',
      localId: 'busch-gardens', dias: ['d-2026-11-23'],
      quando: 'depois das 16h, quando as cabanas abrem — na volta do Christmas on Ice',
      preco: 'pago à parte · lanyard de amostras US$ 45 por cinco itens ou US$ 65 por dez',
      prioridade: 'imperdivel',
      porque: 'É o coração do Christmas Town: um mercado de Natal europeu de cabanas de ' +
              'madeira. O chocolate em caneca de souvenir, nas versões chocolate, peppermint e ' +
              'gingerbread, com os biscoitos de snickerdoodle e árvore de Natal, define a noite.',
      dica: 'As cabanas SÓ ABREM ÀS 16h, e o All-Day Dining encerra trinta minutos antes de os ' +
            'restaurantes fecharem. O plano é: almoço e lanche no plano até as 16h, e daí em ' +
            'diante só as cabanas. Cabana de evento não entra no plano de refeição.',
      pesquisa: '2026-09-17' },

    { id: 'g-mistletoe', nome: 'Mistletoe Margarita', tipo: 'bebida',
      onde: 'Busch Gardens · Christmas Town Village, na cabana Caroler’s Table',
      localId: 'busch-gardens', dias: ['d-2026-11-23'],
      quando: 'caminhando pelo mercado de luzes, depois das 16h',
      preco: 'sem valor por item divulgado · lanyard de amostras US$ 45 por cinco ' +
             'itens ou US$ 65 por dez', prioridade: 'se-der',
      porque: 'É a linha de coquetéis criada só para a temporada, e caminhar pelo mercado ' +
              'aceso com um drink na mão é o programa de casal sem criança do Busch.',
      dica: 'Se forem beber mais de dois drinks cada, o lanyard de dez itens compensa, porque ' +
            'bebida e comida entram no mesmo cartão. A cerveja grátis do Serengeti Overlook é ' +
            'promoção de verão e não estará rodando em novembro.',
      pesquisa: '2026-09-17' },
    /* ---- 19/11 · Islands of Adventure, fora de Hogsmeade ---- */
    { id: 'g-chicken-stingers', nome: 'Chicken Stingers do Fire-Eater’s Grill', tipo: 'salgado',
      onde: 'Islands of Adventure · Lost Continent, no Fire-Eater’s Grill',
      localId: 'islands-of-adventure', dias: ['d-2026-11-19'],
      quando: 'por volta das 17h30, antes do Mythos — o balcão fecha às 20h',
      preco: 'US$ 13–15 o platter', prioridade: 'imperdivel',
      porque: 'Frango empanado envolto em molho apimentado, servido com hummus no lugar das ' +
              'fritas. É o petisco cult do Islands há mais de vinte anos e não existe em ' +
              'nenhum outro parque de Orlando.',
      dica: 'Um platter para dividir, com a troca para hummus, que não custa nada. Fica a três ' +
            'minutos do Mythos, ao lado da Mystic Fountain — mas depois das 18h vira jantar em ' +
            'cima do jantar das 19h15.',
      pesquisa: '2026-09-17' },

    /* ---- 14/11 · Seuss Landing, na noite do Grinchmas ---- */
    { id: 'g-who-hash', nome: 'Who Hash na lata', tipo: 'salgado',
      onde: 'Islands of Adventure · Seuss Landing, no Green Eggs and Ham Cafe',
      localId: 'islands-of-adventure', dias: ['d-2026-11-14'],
      quando: 'antes do Grinchmas das 17h30 — é a única passagem de vocês pelo Seuss Landing',
      preco: 'US$ 16–18 · os tots saem por US$ 11–14', prioridade: 'se-der',
      porque: 'A casa serve tudo sobre uma cama de tater tots, e o Who Hash vem dentro de uma ' +
              'lata colecionável — a piada é exatamente o que o Grinch rouba dos Whos. É o ' +
              'item mais natalino que o Islands tem o ano inteiro.',
      dica: 'O café só abre em dia de movimento: confiram no app da Universal no próprio dia ' +
            'antes de contar com ele. Um pedido serve os dois, e a lata vai embora com vocês.',
      pesquisa: '2026-09-17' },
    /* ---- 10 e 25/11 · o resto do Disney Springs ---- */
    { id: 'g-everglazed', nome: 'Donut da Everglazed', tipo: 'doce',
      onde: 'Disney Springs · West Side, entre o AMC e o Splitsville',
      localId: 'disney-springs', dias: ['d-2026-11-10', 'd-2026-11-25'],
      quando: 'na volta pelo Disney Springs, nas duas noites',
      preco: 'US$ 5–7 a unidade', prioridade: 'imperdivel',
      porque: 'É o contraponto exato do Gideon’s: donut brioche quente, coberto na hora. A ' +
              'linha de sabores gira, e em novembro sempre entra uma leva de fim de ano.',
      dica: 'Peçam da linha Super Funky — Cinnamon Toast Crunch, Brooklyn Blackout ou Dulce ' +
            'de Leche. A fila é pequena perto da do Gideon’s e aceita mobile order. Evitem a ' +
            'noite de 25/11 entre 19h e 21h, que é véspera de Thanksgiving.',
      pesquisa: '2026-09-17' },

    { id: 'g-vivoli', nome: 'Bombolonis da Vivoli il Gelato', tipo: 'doce',
      onde: 'Disney Springs · The Landing, ao lado do Morimoto', localId: 'disney-springs',
      dias: ['d-2026-11-10', 'd-2026-11-25'],
      quando: 'em qualquer das duas noites — a casa fica aberta até 23h',
      preco: 'US$ 6 os quatro bombolonis · US$ 8–10 a bola de gelato', prioridade: 'imperdivel',
      porque: 'Quatro bombas fritas na hora — creme, Nutella, goiaba e natural — por US$ 6. É ' +
              'a melhor conta doce do Disney Springs inteiro, e a Vivoli é a gelateria ' +
              'florentina de 1930, não uma marca licenciada.',
      dica: 'O bomboloni sai quente e não viaja: comam ali, não levem para o hotel. Se ' +
            'quiserem o exagero, o Bombolato é a bomba quente recheada de gelato.',
      pesquisa: '2026-09-17' },

    { id: 'g-dockside', nome: 'Margarita do Dockside Margaritas', tipo: 'bebida',
      onde: 'Disney Springs · Marketplace, na beira da Buena Vista Cove',
      localId: 'disney-springs', dias: ['d-2026-11-10', 'd-2026-11-25'],
      quando: 'antes do jantar, com o lago na frente',
      preco: 'US$ 17–20', prioridade: 'imperdivel',
      porque: 'Bar aberto à beira d’água, num quiosque com cara de banca de frutas dos anos ' +
              '60. É o lugar de sentar com o lago na frente sem entrar em restaurante, e as ' +
              'margaritas são feitas na hora, não de máquina.',
      dica: 'Abre ao meio-dia e FECHA ÀS 22h: se a chegada de 10/11 atrasar, ele já fechou e ' +
            'sobram a Everglazed e a Vivoli. Mesas por ordem de chegada — em 25/11, véspera de ' +
            'Thanksgiving, cheguem antes das 18h.',
      pesquisa: '2026-09-17' },

    /* ---- 12/11 · BoardWalk ---- */
    { id: 'g-pizza-window', nome: 'Super Slice da janela de pizza', tipo: 'salgado',
      onde: 'Disney’s BoardWalk · a janela no calçadão, ao lado do BoardWalk Deli',
      localId: 'boardwalk', dias: ['d-2026-11-12'],
      quando: 'no jantar das 19h, que já está no roteiro sem reserva',
      preco: 'US$ 10–11 a fatia · US$ 12–13 a cerveja de 20 oz', prioridade: 'imperdivel',
      porque: 'É o jeito certo de fazer a noite de 12/11 sem reserva: uma fatia gigante na ' +
              'janela com uma Cigar City Jai Alai, a IPA de Tampa, andando à beira do lago. É ' +
              'o único balcão do BoardWalk aberto até tarde.',
      dica: 'Funciona do meio-dia à meia-noite. Não tem mesa própria: paguem na janela e ' +
            'sentem nos bancos do calçadão. A fatia é uma refeição inteira para uma pessoa.',
      pesquisa: '2026-09-17' },

    { id: 'g-boardwalk-sorvete', nome: 'Sundae do BoardWalk Ice Cream', tipo: 'doce',
      onde: 'Disney’s BoardWalk · a sorveteria do calçadão', localId: 'boardwalk',
      dias: ['d-2026-11-12'],
      quando: 'de sobremesa, na volta do lago',
      preco: 'US$ 5–7 a casquinha · US$ 7–9 o sundae', prioridade: 'imperdivel',
      porque: 'É a sobremesa natural do passeio à beira do lago, no formato de sorveteria de ' +
              'calçadão americano, e fica aberta quando o resto do BoardWalk já fechou.',
      dica: 'A Ample Hills não existe mais — este é o balcão que ficou no lugar dela. O ' +
            'carrinho de funnel cake do BoardWalk está fora de operação em 2026: não contem ' +
            'com ele. O BoardWalk Deli ao lado vende o Mickey Cinnamon Roll até tarde.',
      pesquisa: '2026-09-17' },

    /* ---- 14/11 · Celebration ---- */
    { id: 'g-kilwins', nome: 'Fudge da Kilwins', tipo: 'doce',
      onde: 'Celebration · Front Street, na esquina do Market Street, de frente para o lago',
      localId: 'celebration', dias: ['d-2026-11-14'],
      quando: 'na parada das 14h, que já está no roteiro',
      preco: 'venda por peso, sem tabela publicada — confiram no balcão',
      prioridade: 'imperdivel',
      porque: 'Fudge feito na pedra de mármore dentro da loja e casquinha de waffle assada na ' +
              'hora. É o doce de centrinho americano que Celebration existe para vender.',
      dica: 'Dá para provar o fudge antes de comprar, e a venda é por peso. As especialidades ' +
            'da casa são o de caramelo com flor de sal e a maçã do amor com chocolate. Sábado ' +
            'abre às 11h e fecha às 22h.',
      pesquisa: '2026-09-17' },

    /* ---- 21/11 · Winter Garden ---- */
    { id: 'g-feira-winter-garden', nome: 'Café da Axum e os assados da feira', tipo: 'lanche',
      onde: 'Winter Garden · Axum Coffee, na Plant Street, e a feira no Downtown Pavilion',
      localId: 'winter-garden', dias: ['d-2026-11-21'],
      quando: 'na manhã da feira, das 8h45 às 10h15 — ela fecha às 13h',
      preco: 'US$ 4–5 o café · a feira não tem tabela e a entrada é gratuita',
      prioridade: 'imperdivel',
      porque: 'A feira de sábado de Winter Garden é eleita repetidamente a melhor da Flórida, ' +
              'com mais de cem barracas de produtor, assados e delicatessen, e música ao vivo. ' +
              'A Axum é a torrefação local e abre cedo o bastante para começar por ela.',
      dica: 'A matriz da Axum abre sábado às 7h30; a filial de dentro do Plant Street Market só ' +
            'às 10h — comecem pela matriz. Levem dinheiro: parte dos barraqueiros não passa cartão.',
      pesquisa: '2026-09-17' },

    { id: 'g-crooked-can', nome: 'Flight da Crooked Can Brewing', tipo: 'bebida',
      onde: 'Winter Garden · dentro do Plant Street Market, no taproom da cervejaria',
      localId: 'winter-garden', dias: ['d-2026-11-21'],
      quando: 'no almoço do Plant Street Market, às 11h45',
      preco: 'sem tabela publicada para pint nem para flight', prioridade: 'se-der',
      porque: 'É a cervejaria artesanal local servida no próprio tanque, dentro do mercado — e ' +
              'a mesma casa tem torneira no Club Level do Kia Center, onde vocês vão ver o ' +
              'Solar Bears à noite.',
      dica: 'O taproom abre às 10h, antes das barracas de comida do mercado, que só abrem entre ' +
            '11h e 11h30. Peçam o flight para provar quatro sem se comprometer: High Stepper é ' +
            'a IPA, Cloud Chaser a de trigo e Florida Sunshine a lager.',
      pesquisa: '2026-09-17' },

    /* ---- 24/11 · Old Town ---- */
    { id: 'g-root-beer', nome: 'Root beer float do A&W', tipo: 'bebida',
      onde: 'Old Town · no meio do calçadão, na loja do A&W', localId: 'old-town',
      dias: ['d-2026-11-24'],
      quando: 'na volta ao Old Town às 17h20, antes do jantar',
      preco: 'US$ 4–5', prioridade: 'imperdivel',
      porque: 'Root beer tirada na torneira com bola de sorvete em caneca gelada, receita de ' +
              '1919. É o clássico americano que não se encontra no Brasil e combina exatamente ' +
              'com o cenário retrô do Old Town.',
      dica: 'Terça o Old Town fecha às 21h e não tem desfile de carros — o cruise é sexta e ' +
            'sábado. Cheguem antes das 19h30. A casa também é conhecida pelo hambúrguer e pelos ' +
            'chicken tenders empanados à mão. O Fat Boy’s não está mais no diretório do Old Town.',
      pesquisa: '2026-09-17' },
  ],

};

/* =============================================================================
   VALIDAÇÃO NO LOAD
   Roda automaticamente e reclama no console se algo estiver inconsistente.
   Barato, e pega erro de digitação quando você editar à mão.
   ========================================================================== */
(function validarRoteiro(R) {
  'use strict';
  const erros = [];
  const TIPOS_GASTRO = ['doce', 'salgado', 'lanche', 'bebida'];
  const PRIORIDADES_GASTRO = ['imperdivel', 'se-der'];
  const M = R.meta;

  const paraMin = (h) => {
    if (!/^\d{2}:\d{2}$/.test(h || '')) return null;
    const [a, b] = h.split(':').map(Number);
    return a * 60 + b;
  };

  const idsGastro = new Set();
  const idsDia = new Set();
  const idsBloco = new Set();
  const idsLocal = new Set(R.locais.map((l) => l.id));
  const idsRest = new Set(R.restaurantes.map((r) => r.id));

  // Dias contíguos entre viagem.inicio e viagem.fim
  const d0 = new Date(R.viagem.inicio + 'T00:00:00');
  const d1 = new Date(R.viagem.fim + 'T00:00:00');
  const totalEsperado = Math.round((d1 - d0) / 86400000) + 1;
  if (R.dias.length !== totalEsperado) {
    erros.push(`dias: ${R.dias.length} encontrados, ${totalEsperado} esperados`);
  }

  R.dias.forEach((dia, i) => {
    if (idsDia.has(dia.id)) erros.push(`dia id duplicado: ${dia.id}`);
    idsDia.add(dia.id);

    const esperado = new Date(d0.getTime() + i * 86400000)
      .toISOString().slice(0, 10);
    if (dia.data !== esperado) {
      erros.push(`dia[${i}] data ${dia.data}, esperado ${esperado}`);
    }

    const semana = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const real = semana[new Date(dia.data + 'T12:00:00').getDay()];
    if (dia.diaSemana !== real) {
      erros.push(`${dia.data}: diaSemana "${dia.diaSemana}", real "${real}"`);
    }

    const refMin = dia.referencia ? paraMin(dia.referencia.padrao) : null;
    if (dia.referencia && refMin === null) {
      erros.push(`${dia.data}: referencia.padrao inválida "${dia.referencia.padrao}"`);
    }

    dia.blocos.forEach((b) => {
      if (idsBloco.has(b.id)) erros.push(`bloco id duplicado: ${b.id}`);
      idsBloco.add(b.id);

      if (paraMin(b.hora) === null) erros.push(`${b.id}: hora inválida "${b.hora}"`);
      if (!M.tiposBloco.includes(b.tipo)) erros.push(`${b.id}: tipo "${b.tipo}"`);
      if (!M.tiposAncora.includes(b.ancora)) erros.push(`${b.id}: ancora "${b.ancora}"`);
      if (b.ancora === 'referencia' && !dia.referencia) {
        erros.push(`${b.id}: ancorado em referência, mas o dia não tem referência`);
      }
      (b.acesso || []).forEach((a) => {
        if (!M.tiposAcesso.includes(a)) erros.push(`${b.id}: acesso "${a}"`);
      });
      if (b.localId && !idsLocal.has(b.localId)) {
        erros.push(`${b.id}: localId "${b.localId}" não existe`);
      }
      if (b.restauranteId && !idsRest.has(b.restauranteId)) {
        erros.push(`${b.id}: restauranteId "${b.restauranteId}" não existe`);
      }
    });
  });

  R.restaurantes.forEach((r) => {
    if (r.blocoId && !idsBloco.has(r.blocoId)) {
      erros.push(`restaurante ${r.id}: blocoId "${r.blocoId}" não existe`);
    }
  });

  R.dias.filter((d) => d.fechado).forEach((d) => {
    if (!d.revisadoEm) erros.push(`dia ${d.data}: fechado sem revisadoEm`);
    (d.planos || []).forEach((p) => {
      if (!p.letra || !p.gatilho || !(p.passos || []).length) {
        erros.push(`dia ${d.data}: plano ${p.letra || "?"} incompleto`);
      }
    });
    if (d.prepararAmanha) {
      const p = d.prepararAmanha;
      if (!R.dias.some((x) => x.data === p.paraODia)) {
        erros.push(`dia ${d.data}: prepararAmanha aponta para ${p.paraODia}, que não existe`);
      }
      if (!(p.itens || []).length) {
        erros.push(`dia ${d.data}: prepararAmanha sem itens`);
      }
    }
    (d.listas || []).forEach((l) => {
      if (!(l.itens || []).length) erros.push(`dia ${d.data}: lista ${l.id} vazia`);
    });
    const mp = d.ficha && d.ficha.multiPass;
    if (mp && mp.rolando !== undefined && !Array.isArray(mp.rolando)) {
      erros.push(`dia ${d.data}: ficha.multiPass.rolando precisa ser uma lista`);
    }
  });

  R.locais.forEach((l) => {
    if (l.verificado && !l.fonteCoord) {
      erros.push(`local ${l.id}: verificado:true sem fonteCoord`);
    }
    if (l.lat == null || l.lng == null) {
      erros.push(`local ${l.id}: sem coordenada`);
    }
  });

  R.checklist.forEach((c) => {
    if (!c.dataAlvo) erros.push(`checklist ${c.id}: sem dataAlvo`);
    // validaAte: último dia em que a pendência ainda serve. Depois dele ela sai da
    // Home e do selo, e vai para "perderam a validade".
    if (c.validaAte !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(c.validaAte || '')) {
        erros.push(`checklist ${c.id}: validaAte inválida "${c.validaAte}"`);
      } else if (c.dataAlvo && c.validaAte < c.dataAlvo) {
        erros.push(`checklist ${c.id}: validaAte ${c.validaAte} antes da dataAlvo ${c.dataAlvo}`);
      }
    }
    (c.restauranteIds || []).forEach((rid) => {
      if (!idsRest.has(rid)) erros.push(`checklist ${c.id}: restaurante "${rid}" não existe`);
    });
  });

  // Vocabulários que a interface usa para decidir cor, seção e ordem.
  R.dias.forEach((d) => {
    (d.notas || []).forEach((n, i) => {
      if (!M.tiposNota.includes(n.tipo)) erros.push(`${d.data}: nota[${i}] tipo "${n.tipo}"`);
    });
    d.blocos.forEach((b) => {
      if (b.acessoAlt && !M.tiposAcesso.includes(b.acessoAlt)) {
        erros.push(`${b.id}: acessoAlt "${b.acessoAlt}"`);
      }
    });
    (d.listas || []).forEach((l) => {
      const vistos = new Set();
      l.itens.forEach((it) => {
        if (!it.id) erros.push(`lista ${l.id}: item "${it.texto}" sem id`);
        else if (vistos.has(it.id)) erros.push(`lista ${l.id}: id repetido "${it.id}"`);
        vistos.add(it.id);
        if (it.secao && !M.secoesLoja.includes(it.secao)) {
          erros.push(`lista ${l.id}: seção "${it.secao}"`);
        }
      });
    });
  });
  [...R.dicas, ...R.regrasDeOuro].forEach((x) => {
    const nome = x.id || ('regra ' + x.n);
    if (!M.momentos.includes(x.momento)) erros.push(`${nome}: momento "${x.momento}"`);
    if (x.momento === 'dia-especifico' && !(x.dias || []).length) {
      erros.push(`${nome}: dia-especifico sem dias`);
    }
    (x.dias || []).forEach((id) => {
      if (!idsDia.has(id)) erros.push(`${nome}: dia "${id}" não existe`);
    });
  });

  (R.gastronomia || []).forEach((g) => {
    if (!g.id || !g.nome) { erros.push(`gastronomia: item sem id ou nome`); return; }
    if (idsGastro.has(g.id)) erros.push(`gastronomia ${g.id}: id repetido`);
    idsGastro.add(g.id);
    if (!TIPOS_GASTRO.includes(g.tipo)) erros.push(`gastronomia ${g.id}: tipo "${g.tipo}"`);
    if (!PRIORIDADES_GASTRO.includes(g.prioridade)) {
      erros.push(`gastronomia ${g.id}: prioridade "${g.prioridade}"`);
    }
    if (!(g.dias || []).length) erros.push(`gastronomia ${g.id}: sem dias`);
    (g.dias || []).forEach((id) => {
      if (!idsDia.has(id)) erros.push(`gastronomia ${g.id}: dia "${id}" nao existe`);
    });
    if (g.localId && !idsLocal.has(g.localId)) {
      erros.push(`gastronomia ${g.id}: local "${g.localId}" nao existe`);
    }
    if (g.restauranteId && !idsRest.has(g.restauranteId)) {
      erros.push(`gastronomia ${g.id}: restaurante "${g.restauranteId}" nao existe`);
    }
    ['onde', 'quando', 'preco', 'porque', 'pesquisa'].forEach((campo) => {
      if (!g[campo]) erros.push(`gastronomia ${g.id}: falta ${campo}`);
    });
  });

  R.meta.validacao = { erros, ok: erros.length === 0, em: new Date().toISOString() };

  if (erros.length) {
    console.error(`[roteiro.js] ${erros.length} problema(s):`);
    erros.forEach((e) => console.error('  · ' + e));
  } else {
    console.log(
      `[roteiro.js] OK — ${R.dias.length} dias, ` +
      `${R.dias.reduce((n, d) => n + d.blocos.length, 0)} blocos, ` +
      `${R.restaurantes.length} restaurantes, ${R.checklist.length} pendências, ` +
      `${R.locais.length} locais.`
    );
  }
})(window.ROTEIRO);
