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
   ========================================================================== */

window.ROTEIRO = {

  meta: {
    versaoDados: 1,
    fontes: ['roteiro-orlando-v3.md', 'roteiro-orlando-dias-livres.md'],
    geradoEm: '2026-09-08',
    avisoHorarios:
      'Os horários oficiais dos parques só saem perto da data. Os relógios deste ' +
      'roteiro assumem abertura às 9h, com duas exceções anotadas (SeaWorld e Busch ' +
      'Gardens). Confiram em novembro e ajustem a referência do dia — os blocos ' +
      'ancorados deslocam junto.',

    // Vocabulários fechados. A interface valida contra isto no load.
    tiposBloco: ['atracao', 'refeicao', 'deslocamento', 'show', 'compras',
                 'espera', 'tarefa', 'livre', 'vazio'],
    tiposAcesso: ['rope-drop', 'multi-pass', 'single-pass', 'standby', 'reserva'],
    tiposAncora: ['referencia', 'fixo'],
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
      'Troca dos dias 21/22/23 confirmada — 21 Winter Garden, 22 SeaWorld, 23 Epic Universe',
      'Sem Mickey’s Very Merry Christmas Party',
      'Sem Express Pass na Universal',
      'Carro alugado de 20 a 25/11',
    ],
  },

  /* ---------------------------------------------------------------------------
     REGRAS DE OURO — Parte 3 do documento
     ------------------------------------------------------------------------ */
  regrasDeOuro: [
    { n: 1, titulo: 'Rope drop vale mais que qualquer passe.',
      texto: 'A primeira hora de parque rende o que as três da tarde rendem. Chegar 45 ' +
             'minutos antes da abertura é a decisão mais barata e mais eficaz da viagem.' },
    { n: 2, titulo: 'Não reserve Multi Pass para o que você vai fazer no rope drop.',
      texto: 'Erro clássico: reservar a atração que já estaria vazia às 9h e depois ' +
             'enfrentar fila de 80 minutos no resto.' },
    { n: 3, titulo: 'Use a primeira reserva do Multi Pass cedo.',
      texto: 'O sistema só libera a próxima depois que você usa a atual. Quem usa às 11h ' +
             'faz o dobro de quem usa às 15h.' },
    { n: 4, titulo: 'Mobile order em tudo que for balcão.',
      texto: 'Disney e Universal permitem pedir pelo app e só buscar. Economiza 20 a 30 ' +
             'minutos por refeição.' },
    { n: 5, titulo: 'Almoço às 11h30 ou às 14h.',
      texto: 'Meio-dia é o pico. E as filas das atrações caem exatamente quando todo mundo ' +
             'está comendo — use isso.' },
  ],

  /* ---------------------------------------------------------------------------
     ESTRATÉGIA DE PASSES — Parte 1 do documento + pesquisa
     ------------------------------------------------------------------------ */
  estrategiaPasses: {

    disney: {
      resumo: [
        { data: '2026-11-11', parque: 'Magic Kingdom',     multiPass: 'Sim',
          singlePass: 'Seven Dwarfs Mine Train (TRON opcional)', custo: { min: 95,  max: 140 } },
        { data: '2026-11-13', parque: 'Animal Kingdom',    multiPass: 'Não',
          singlePass: 'Avatar Flight of Passage',                custo: { min: 36,  max: 40  } },
        { data: '2026-11-15', parque: 'Hollywood Studios', multiPass: 'Sim',
          singlePass: 'Rise of the Resistance',                  custo: { min: 115, max: 130 } },
        { data: '2026-11-16', parque: 'Epcot',             multiPass: 'Opcional',
          singlePass: 'Cosmic Rewind',                           custo: { min: 36,  max: 95  } },
      ],
      correcao:
        'Seven Dwarfs Mine Train e Flight of Passage NÃO estão no Multi Pass. São Single ' +
        'Pass, compra separada, no máximo duas por dia.',
      comoFuncionam:
        'No Magic Kingdom, Epcot e Hollywood Studios vocês escolhem 1 da lista alta e 2 da ' +
        'lista baixa. O Animal Kingdom não tem listas. O app mostra a divisão no momento da ' +
        'compra — se alguma sugestão estiver na lista errada, troquem pela alternativa indicada.',
      regraDeOuro:
        'Depois de usar a primeira reserva, abre espaço para reservar outra. Usem cedo para ' +
        'girar mais vezes.',
      compra: {
        documento: { data: '2026-11-08', hora: '07:00', fuso: 'ET' },
        nota: 'Vocês têm cerca de 5 minutos para concluir antes de o sistema soltar as seleções.',
        alerta: {
          gravidade: 'alta',
          titulo: 'A compra provavelmente não é uma só',
          texto:
            'O documento trata 08/11 às 7h ET como uma única janela para tudo. A regra da ' +
            'Disney depende de onde você está hospedado, e vocês estão no Travelodge — ' +
            'off-site. Para quem não está em hotel Disney a antecedência é de 3 dias, não 7.\n\n' +
            'MULTI PASS: se o ingresso de 4 dias for date-based (datas fixas), dá para comprar ' +
            '3 dias antes do primeiro dia do ingresso e cobrir os 4 dias de uma vez — aí 08/11 ' +
            'funciona como o documento diz.\n\n' +
            'SINGLE PASS: a regra é 3 dias antes de CADA visita. Ou seja, quatro momentos ' +
            'separados:\n' +
            '  · Seven Dwarfs (11/11) → comprar 08/11\n' +
            '  · Flight of Passage (13/11) → comprar 10/11\n' +
            '  · Rise of the Resistance (15/11) → comprar 12/11\n' +
            '  · Cosmic Rewind (16/11) → comprar 13/11\n\n' +
            'É por isso que "confirmar com a agência a regra de validade do ingresso" deixou ' +
            'de ser burocracia e virou a pendência mais importante da lista. O checklist já ' +
            'está montado com as quatro datas separadas.',
          pesquisa: '2026-09-08',
          verificado: false,
        },
      },
    },

    universal: {
      expressPass: {
        usar: false,
        motivo:
          'No Islands, o Hagrid’s saiu do Express em julho de 2026 — vocês pagariam e ainda ' +
          'enfrentariam a fila que incomoda. No Epic, dois dias de ingresso já pago valem mais ' +
          'que um dia de Express a US$ 600 no casal.',
        alternativa:
          'Se algum dia específico ficar insuportável, existe o Express Pass Now dentro do ' +
          'parque — US$ 20 a 30, uma atração.',
      },
      singleRider: {
        titulo: 'Single rider — fora do plano desta viagem',
        prioridade: 'descartado',
        texto:
          'Existe em 21 atracoes do complexo e economiza fila, mas separa voces na hora de embarcar. ' +
          'DECISAO TOMADA: nao usar. Andar lado a lado na atracao e o motivo da viagem — a atracao ' +
          'e o que voces foram fazer, nao a fila. Os blocos guardam o campo singleRider apenas como ' +
          'informacao de fato; a interface nao destaca e o roteiro nao conta com isso em nenhum dia.',
        pesquisa: '2026-09-08',
      },
      lockers: {
        titulo: 'O imposto de tempo que o cronograma não previa',
        texto:
          'Várias atrações exigem guardar tudo em locker antes de embarcar — inclusive o ' +
          'celular — com detector de metal na entrada. Isso custa 10 a 15 minutos por atração ' +
          'que o roteiro de ~45 min por atração não contabilizou. O locker padrão é gratuito ' +
          'pelo tempo da fila mais a duração da atração; o grande custa US$ 2 a 3.\n\n' +
          'Detector de metal, nada nos bolsos: Hulk, VelociCoaster, Stardust Racers e ' +
          'Revenge of the Mummy.\n\n' +
          'Locker obrigatório com mais tolerância: Hagrid’s, Forbidden Journey, Gringotts, ' +
          'Men in Black, Monsters Unchained e Hiccup’s Wing Gliders.\n\n' +
          'Pochete de três pontos presa na cintura costuma ser liberada no Hagrid’s, a ' +
          'critério do funcionário. Nos quatro do detector de metal, não adianta tentar.',
        pesquisa: '2026-09-08',
        fonte: 'orlandoinformer.com/universal/rental-ride-lockers',
      },
    },
  },

  /* ---------------------------------------------------------------------------
     OS DIAS
     `descricao` = texto do documento (fonte de verdade, não editar sem motivo)
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
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-08',

    // A âncora do dia é o pouso. Atrasou o voo, a tarde inteira desloca junto —
    // menos o jantar, que tem hora marcada.
    referencia: { rotulo: 'Pouso no MCO', padrao: '12:35', confirmado: true },

    resumo:
      'O dia mais fácil de salvar da viagem inteira: não tem ingresso, não tem hora de ' +
      'parque, e o único compromisso de relógio é o jantar às 19h. Tudo o mais é ' +
      'sacrificável sem perda real — inclusive o Disney Springs, porque vocês voltam lá ' +
      'no dia 21, quando estiver decorado de Natal.',

    avisos: [
      'O dia começa na véspera: com decolagem 01h40, vocês precisam estar no GIG por volta ' +
      'das 22h30 de 09/11.',
      'Chip/eSIM: ativem no wifi do aeroporto ANTES de precisar do Uber. Sem internet não ' +
      'tem corrida.',
    ],

    notas: [
      { tipo: 'atencao', texto:
        'CONEXÃO EM BOGOTÁ — 2h20. O mínimo oficial para internacional-internacional em El ' +
        'Dorado é 1h30, então vocês têm folga. Mas a Colômbia faz vocês passarem pela ' +
        'imigração mesmo em trânsito, e essa fila leva de 20 a 45 minutos. Sobram 1h35 a 2h ' +
        'de margem real. Não é apertado, mas também não é para passear.',
        pesquisa: '2026-09-08' },
      { tipo: 'bom', texto:
        'CONFIRMADO em 08/09: é bilhete único. A bagagem vai despachada de ponta a ponta ' +
        'até Orlando e em Bogotá vocês só passam pela imigração e seguem para o portão — ' +
        'sem retirar e sem redespachar mala. Isso tira o único cenário em que as 2h20 de ' +
        'conexão ficariam apertadas.' },
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
        gatilho: 'Vocês saem do Terminal C até as 14h00.',
        passos: [
          'Uber para o hotel, deixar malas, check-in se já liberou.',
          'Walmart com calma — a lista completa, 45 a 60 min.',
          'Disney Springs às 17h30, com 1h30 antes do jantar.',
          'The Boathouse 19h. Voltar 21h.',
        ],
      },
      {
        letra: 'B',
        titulo: 'Imigração demorou',
        gatilho: 'Vocês saem do Terminal C entre 14h00 e 16h00.',
        passos: [
          'Corta o Walmart para o essencial: água, protetor solar, ibuprofeno e barrinhas. ' +
          '20 minutos, sem passear pelos corredores. A volta ao hotel continua ' +
          'obrigatória, senão vocês carregam o fardo a noite inteira — mas agora são só ' +
          '8 minutos de carro no total, então cabe mesmo com o dia atrasado.',
          'O resto da lista vai para o dia 12, que é dia de outlet na I-Drive e comporta ' +
          'uma parada de mercado sem custo nenhum de roteiro.',
          'Disney Springs direto, mesmo que chegue só 18h15. Uma hora lá dentro já dá o ' +
          'World of Disney e a beira da água.',
          'O jantar das 19h não se mexe. É a única hora marcada do dia.',
        ],
      },
      {
        letra: 'C',
        titulo: 'Perdeu a conexão ou chegou depois das 17h',
        gatilho: 'Atraso grande em Bogotá, remarcação, ou pouso no MCO depois das 17h.',
        passos: [
          'PRIMEIRA COISA: cancelem o The Boathouse assim que souberem, por telefone ou ' +
          'pelo app. Restaurante de Disney Springs cobra taxa por não comparecimento.',
          'Esqueçam o Disney Springs hoje. Vocês voltam no dia 21 e, honestamente, o dia 21 ' +
          'é melhor: tem o Christmas Tree Stroll e a decoração de Natal, que hoje ainda ' +
          'não existe.',
          'Uber direto para o hotel. Jantem na 192 mesmo — Black Angus, Miller’s Ale ' +
          'House, ou qualquer coisa aberta perto.',
          'Walmart passa para o dia 12. Durmam. O dia 11 é Magic Kingdom com saída às 6h45 ' +
          'e é ele que vocês não podem estragar.',
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
          'É a parada que mais economiza dinheiro na viagem. Água dentro do parque custa ' +
          'US$ 4; aqui sai a US$ 0,25. Capa de chuva custa US$ 10 lá dentro e US$ 1 aqui. ' +
          'Marcados como essenciais são os que, se faltarem, vocês vão comprar caro depois.',
        itens: [
          { texto: 'Água — caixa de 24 garrafas', essencial: true,
            motivo: 'No documento. Levem 2 garrafas por pessoa em todo dia de parque.' },
          { texto: 'Protetor solar FPS 50 + bastão para o rosto', essencial: true,
            motivo: 'No documento. O bastão é para reaplicar na fila sem sujar a mão.' },
          { texto: 'Ibuprofeno e analgésico', essencial: true,
            motivo: 'No documento. Nos EUA sai muito mais barato que no Brasil.' },
          { texto: 'Barrinhas de cereal e frutas', essencial: true,
            motivo: 'No documento. Café da manhã dos dias de rope drop, quando vocês saem ' +
                    'do hotel antes de 7h.' },
          { texto: 'Café', essencial: false,
            motivo: 'No documento. Confiram se o quarto tem cafeteira antes de comprar cápsula.' },
          { texto: 'Capas de chuva descartáveis — 4 unidades', essencial: true,
            motivo: 'ACRÉSCIMO. Jurassic Park River Adventure no dia 19, Journey to Atlantis ' +
                    'no 22 e Fyre Drill no 23 molham de verdade. US$ 1 aqui, US$ 10 no parque.' },
          { texto: 'Curativos e protetor de bolha (Band-Aid Blister / Moleskin)', essencial: true,
            motivo: 'ACRÉSCIMO. São 16 dias andando 15 a 25 mil passos. Bolha no dia 3 ' +
                    'estraga o resto da viagem, e é a lesão mais evitável que existe.' },
          { texto: 'Meias extras — 3 pares de secagem rápida', essencial: true,
            motivo: 'ACRÉSCIMO. Meia molhada depois do Jurassic Park às 12h significa pé ' +
                    'macerado até as 20h.' },
          { texto: 'Power bank e cabo', essencial: true,
            motivo: 'ACRÉSCIMO. Este app, o app da Disney, o da Universal, mapa e foto o dia ' +
                    'todo. Celular descarregado às 16h é o roteiro perdido.' },
          { texto: 'Sacos Ziploc grandes', essencial: false,
            motivo: 'ACRÉSCIMO. Para o celular nas atrações que molham e para o troco.' },
          { texto: 'Eletrólito em pó ou isotônico', essencial: false,
            motivo: 'ACRÉSCIMO. Novembro é ameno, mas 12 horas em pé desidratam.' },
          { texto: 'Pomada anti-atrito (Body Glide ou vaselina)', essencial: false,
            motivo: 'ACRÉSCIMO. Assadura de coxa em dia de 25 mil passos é real.' },
          { texto: 'Antiácido', essencial: false,
            motivo: 'ACRÉSCIMO. A porção americana e o horário de refeição fora do normal.' },
        ],
      },
    ],

    /* ---------------------------------------------------------------------
       DISNEY SPRINGS — o que cabe em 1h30 e o que fica para o dia 21
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
        motivo: 'Cookie de meio quilo, fama justificada. A fila é longa e costuma ter espera ' +
                'virtual pelo app — entrem na lista assim que chegarem e passeiem enquanto isso.',
        pesquisa: '2026-09-08' },
      { nome: 'Amphicar Tour', quando: 'descartado', custo: 'US$ 125 por carro',
        motivo: 'DESCARTADO em 08/09 por preço. Um carro dos anos 60 que entra no lago com ' +
                'vocês dentro, 20 minutos. Fica registrado aqui só para não ser reproposto: ' +
                'US$ 62 por cabeça por 20 minutos não passa no teste.',
        pesquisa: '2026-09-08' },
      { nome: 'Aerophile — balão cativo', quando: 'dia 21', custo: '~US$ 25',
        motivo: 'Sobe 120 m preso por cabo, 8 minutos, vista de até 16 km. Não voa com vento ' +
                'forte, então nunca dá para contar com ele.',
        pesquisa: '2026-09-08' },
      { nome: 'Christmas Tree Stroll', quando: 'dia 21', condicao: 'só existe a partir de 13/11',
        custo: 'grátis',
        motivo: 'A decoração de Natal do Disney Springs começa em 13/11. Hoje não existe. ' +
                'É exatamente por isso que vocês voltam no dia 21.' },
    ],

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
        descricao: '2h20 de conexão. Imigração colombiana leva de 20 a 45 min',
        fuso: 'Bogotá',
        contexto:
          'Mesmo em trânsito, a Colômbia faz passar pela imigração. Vá direto, sem parar ' +
          'em loja: a fila é o único risco real. Depois dela sobram 1h35 a 2h, aí sim dá ' +
          'para tomar um café. A conexão internacional da Avianca costuma sair do Terminal 1.',
        acesso: [], critico: true, duracaoMin: 140, pesquisa: '2026-09-08' },

      { id: 'b-1011-0820', hora: '08:20', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voo Bogotá → Orlando',
        descricao: 'Decolagem 08h20 · pouso 12h35 no MCO',
        fuso: 'Bogotá',
        contexto:
          'Cerca de 4h15. Preencham a declaração de alfândega em papel se distribuírem a ' +
          'bordo — resolve tempo na chegada. Bogotá não tem pré-inspeção americana, então ' +
          'a imigração dos EUA é toda em Orlando.',
        acesso: [], duracaoMin: 255 },

      { id: 'b-1011-1235', hora: '12:35', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Pouso no MCO — Terminal C',
        descricao: 'Internacionais chegam no Terminal C',
        fuso: 'Orlando',
        contexto:
          'Este é o horário que ancora o resto do dia. Se o voo atrasar, mude a referência ' +
          'aqui em cima e a tarde inteira desloca junto — menos o jantar, que tem hora marcada.',
        localId: 'mco', acesso: [], pesquisa: '2026-09-08' },

      { id: 'b-1011-1250', hora: '12:50', ancora: 'referencia', tipo: 'espera',
        titulo: 'Imigração, bagagem e alfândega',
        descricao: 'De 40 min a 2h. É esta fila que decide se o dia é plano A, B ou C',
        contexto:
          'A caminhada do portão até a esteira já leva de 15 a 25 minutos no Terminal C. ' +
          'Enquanto esperam, olhem o relógio: saindo até 14h é plano A; até 16h é plano B; ' +
          'depois disso, plano C.',
        localId: 'mco', acesso: [], critico: true },

      { id: 'b-1011-1415', hora: '14:15', ancora: 'referencia', tipo: 'tarefa',
        titulo: 'Ativar o eSIM e chamar o Uber',
        descricao: 'Rideshare Pickup no NÍVEL 6 do Terminal C',
        contexto:
          'Ativem o chip no wifi do aeroporto antes de tudo — sem internet não existe Uber. ' +
          'E só chamem a corrida depois de estarem com as malas na mão: o motorista tem ' +
          'poucos minutos de tolerância e cancela.',
        localId: 'mco', acesso: [], critico: true, pesquisa: '2026-09-08' },

      { id: 'b-1011-1445', hora: '14:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Uber para o hotel',
        descricao: '~30 min, US$ 35–45',
        contexto:
          'Check-in abre às 15h. Vocês chegam quinze minutos antes, o que dá certo: sobem, ' +
          'largam as malas no quarto e saem leves para o mercado.',
        localId: 'hotel-travelodge', acesso: [] },

      { id: 'b-1011-1500', hora: '15:00', ancora: 'referencia', tipo: 'tarefa',
        titulo: 'Check-in e largar as malas',
        descricao: 'Check-in abre às 15h em ponto',
        contexto:
          'Subam, larguem tudo e desçam. Não desfaçam mala agora — isso é para depois do ' +
          'jantar, ou para amanhã.',
        localId: 'hotel-travelodge', acesso: [] },

      { id: 'b-1011-1530', hora: '15:30', ancora: 'referencia', tipo: 'compras',
        titulo: 'Walmart Supercenter — Vineland Rd',
        descricao: '4 min do hotel. 45 min de compras. Lista completa na ficha do dia',
        contexto:
          'A compra que abastece os 16 dias. Fica a 1,5 km do hotel — a corrida sai por ' +
          'US$ 7 a 10 e leva 4 minutos. Se o dia estiver atrasado, façam só os oito itens ' +
          'essenciais e joguem o resto para o dia 12.',
        endereco: '3250 Vineland Rd', localId: 'walmart-vineland', acesso: [] },

      { id: 'b-1011-1645', hora: '16:20', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel e guardar as compras',
        descricao: '4 min. Fardo de água não vai para o Disney Springs',
        contexto:
          'Esta volta existe por um motivo só: ninguém anda pelo Disney Springs com uma ' +
          'caixa de 24 garrafas. Guardem tudo, separem só o que vai para o dia 11 — duas ' +
          'garrafas, protetor solar e barrinhas na mochila — e saiam de novo.\n\n' +
          'Com o Walmart certo, essa ida e volta custa ~US$ 16 no total e come 8 minutos ' +
          'de carro. Sobra meia hora a mais no Disney Springs.',
        localId: 'hotel-travelodge', acesso: [] },

      { id: 'b-1011-1710', hora: '16:50', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair para o Disney Springs',
        descricao: 'Uber, ~20 min. Pôr do sol às 17h35',
        contexto:
          'Entrada livre, sem ingresso e sem catraca. Vocês chegam junto com o pôr do sol, ' +
          'que é a melhor hora do lugar.',
        localId: 'disney-springs', acesso: [] },

      { id: 'b-1011-1745', hora: '17:15', ancora: 'referencia', tipo: 'compras',
        titulo: 'The Landing → Marketplace → Town Center',
        descricao: 'World of Disney é a maior loja Disney do mundo',
        contexto:
          'São 1h45 até o jantar, de mãos livres — meia hora a mais do que no plano ' +
          'antigo, porque o Walmart certo fica a 4 minutos do hotel. Dá para o World ' +
          'of Disney sem correr e ainda pegar o pôr do sol às 17h35 na beira da água.',
        localId: 'disney-springs', acesso: [] },

      { id: 'b-1011-1900', hora: '19:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — The Boathouse',
        descricao: 'Reserva confirmada · 2111918775',
        contexto:
          'Frutos do mar e carnes na beira da água, no The Landing. Cheguem 15 minutos ' +
          'antes. HORÁRIO FIXO: não desloca nem se o voo atrasar — se o dia virar plano C, ' +
          'cancelem em vez de perder a reserva por não comparecimento.',
        restauranteId: 'r-boathouse', localId: 'disney-springs', acesso: ['reserva'],
        critico: true },

      { id: 'b-1011-2100', hora: '21:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Amanhã é Magic Kingdom com saída às 6h45',
        contexto:
          'Não estiquem. O dia 11 começa às 6h45 e é o dia mais denso da primeira semana. ' +
          'A única coisa que justifica atrasar a volta é o Amphicar, que fica no píer do ' +
          'próprio Boathouse e leva 20 minutos — e só se vocês estiverem inteiros.',
        localId: 'hotel-travelodge', acesso: [] },
    ],
    renuncias: null,
    ficha: null,
  },

  /* ===== 11/11 · QUARTA · MAGIC KINGDOM =================================== */
  {
    id: 'd-2026-11-11',
    data: '2026-11-11',
    diaSemana: 'quarta',
    emoji: '🏰',
    titulo: 'Magic Kingdom',
    subtitulo: 'O dia clássico',
    tipo: 'parque',
    operadora: 'disney',
    parqueId: 'magic-kingdom',
    custoZero: false,
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },
    resumo:
      'O parque mais visitado do mundo. Com Peter Pan, Big Thunder e Mansão já garantidos no ' +
      'Multi Pass, o rope drop muda de lugar — vocês correm para o que NÃO tem hora marcada.',
    avisos: [
      'Com Peter Pan, Big Thunder e Mansão no Multi Pass, o rope drop muda. Não vá para onde ' +
      'você já tem hora marcada.',
    ],
    notas: [
      { tipo: 'bom', texto:
        'VERIFICADO EM 08/09: 11/11 não é noite de Mickey’s Very Merry Christmas Party. As ' +
        'noites de festa em novembro são 8, 9, 12, 13, 15, 17, 19, 20, 24, 25, 27 e 29 — e ' +
        'nessas o parque fecha cedo para quem não tem ingresso da festa, sem Happily Ever ' +
        'After. O dia de vocês está limpo: plano completo até os fogos das 21h vale.',
        pesquisa: '2026-09-08' },
    ],
    blocos: [
      { id: 'b-1111-0645', hora: '06:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel',
        descricao: 'Uber deixa no TTC, não na entrada',
        contexto:
          'O Magic Kingdom é o único parque da Disney sem acesso direto de carro. O Uber para ' +
          'no Ticket & Transportation Center e de lá ainda são 15 a 20 minutos de monotrilho ' +
          'ou barco até a catraca. É por isso que a saída é tão cedo.',
        localId: 'mk-ttc', acesso: [] },

      { id: 'b-1111-0745', hora: '07:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão',
        descricao: 'Monotrilho ou barco a partir do TTC',
        contexto:
          'O barco costuma ser mais gostoso e menos concorrido que o monotrilho de manhã. ' +
          'Os dois levam ao mesmo lugar em tempo parecido. Vocês não têm Early Entry, então ' +
          'a posição na fila do portão é literalmente tudo.',
        localId: 'magic-kingdom', acesso: [] },

      { id: 'b-1111-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Tiana’s Bayou Adventure',
        descricao: 'Standby. Rope drop, Frontierland',
        contexto:
          'Log flume que substituiu a Splash Mountain em 2024, com a história de A Princesa e ' +
          'o Sapo. Os animatrônicos são dos mais avançados que a Disney já fez. Tem uma queda ' +
          'de 15 metros no fim e molha — mas respingo, não banho. É polarizante entre fãs, e ' +
          'a fila explode depois das 10h, o que justifica o rope drop.',
        areaParque: 'Frontierland', acesso: ['rope-drop', 'standby'], molha: true,
        pesquisa: '2026-09-08' },

      { id: 'b-1111-0935', hora: '09:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Space Mountain',
        descricao: 'Standby. Atravesse para Tomorrowland',
        contexto:
          'Montanha-russa de 1975 no escuro total, sem inversões. Não é rápida pelos padrões ' +
          'de hoje (~45 km/h), mas o escuro completo faz parecer muito mais. Sacode bastante — ' +
          'é uma das mais desconfortáveis para coluna no complexo Disney.',
        areaParque: 'Tomorrowland', acesso: ['standby'] },

      { id: 'b-1111-1005', hora: '10:05', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Piratas do Caribe',
        descricao: 'Standby, ainda curto',
        contexto:
          'Passeio de barco de 1967, o clássico que originou os filmes. Cenários com ' +
          'animatrônicos, uma queda pequena no escuro, quase não molha. Capacidade altíssima, ' +
          'então a fila anda mesmo quando parece grande.',
        areaParque: 'Adventureland', acesso: ['standby'] },

      { id: 'b-1111-1040', hora: '10:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Big Thunder Mountain',
        descricao: 'Multi Pass',
        contexto:
          'Montanha-russa temática de trem de mineração. Sem inversões e sem quedas grandes — ' +
          'é velocidade e curva, não terror. Uma das mais divertidas para quem não quer ' +
          'intensidade. Ao entrar, lembrem da regra 3: usar essa reserva já libera a próxima.',
        areaParque: 'Frontierland', acesso: ['multi-pass'] },

      { id: 'b-1111-1110', hora: '11:10', ancora: 'referencia', tipo: 'atracao',
        titulo: 'it’s a small world',
        descricao: 'Standby. Capacidade alta, fila anda',
        contexto:
          'Passeio de barco de 1964 com centenas de bonecos animatrônicos e a música que gruda ' +
          'na cabeça por três dias. É lento e climatizado, e serve de descanso no meio da manhã.',
        areaParque: 'Fantasyland', acesso: ['standby'] },

      { id: 'b-1111-1135', hora: '11:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Peter Pan’s Flight',
        descricao: 'Multi Pass',
        contexto:
          'Barquinhos suspensos que sobrevoam cenários em miniatura. Dura 3 minutos e tem ' +
          'capacidade baixíssima — por isso a fila é sempre absurda para o que a atração ' +
          'entrega, e por isso está na lista alta do Multi Pass.',
        areaParque: 'Fantasyland', acesso: ['multi-pass'] },

      { id: 'b-1111-1200', hora: '12:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Seven Dwarfs Mine Train',
        descricao: 'Single Pass',
        contexto:
          'Montanha-russa familiar cujos carrinhos balançam lateralmente nas curvas. Suave, ' +
          'curta e com uma cena final de animatrônicos muito boa. Não está no Multi Pass — é ' +
          'compra separada, e é a fila mais persistente do parque.',
        areaParque: 'Fantasyland', acesso: ['single-pass'] },

      { id: 'b-1111-1230', hora: '12:30', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Columbia Harbour House',
        descricao: 'Balcão, sem reserva. Segundo andar',
        contexto:
          'Liberty Tree Tavern é serviço à mesa, estilo ceia colonial americana, e precisa de ' +
          'reserva. Columbia Harbour House é balcão, peixe e sanduíches, e tem um segundo ' +
          'andar que quase ninguém acha — o lugar mais silencioso do Magic Kingdom.',
        restauranteId: 'r-columbia-harbour', areaParque: 'Liberty Square', acesso: [] },

      { id: 'b-1111-1345', hora: '13:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mansão Mal-Assombrada',
        descricao: 'Multi Pass',
        contexto:
          'Haunted Mansion, de 1969. Passeio em cápsulas por cenários com 999 fantasmas, feito ' +
          'com truques de ilusão óptica do século XIX que continuam funcionando. É assombrado ' +
          'de brincadeira, não de susto. Um dos melhores da Disney e não depende de idioma.',
        areaParque: 'Liberty Square', acesso: ['multi-pass'] },

      { id: 'b-1111-1415', hora: '14:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Jungle Cruise',
        descricao: 'Multi Pass rolando (reserve às 10h40)',
        contexto:
          'Passeio de barco com um piloto que narra piadas ruins de propósito — é o charme da ' +
          'atração. ATENÇÃO: é a única do dia que depende inteiramente de inglês falado. Se o ' +
          'humor não pegar, é o primeiro bloco a sacrificar quando o dia atrasar.',
        areaParque: 'Adventureland', acesso: ['multi-pass'],
        nota: 'Rolando — reserve quando usar o Big Thunder, às 10h40' },

      { id: 'b-1111-1500', hora: '15:00', ancora: 'fixo', tipo: 'show',
        titulo: 'Festival of Fantasy Parade',
        descricao: 'Fique em Frontierland, não na Main Street',
        contexto:
          'Desfile de carros alegóricos com 12 minutos de duração. A dica do documento é boa: ' +
          'a Main Street lota uma hora antes, enquanto em Frontierland dá para chegar 15 ' +
          'minutos antes e ver igual. HORÁRIO FIXO — não desloca se o parque abrir mais cedo.',
        acesso: [], duracaoMin: 12 },

      { id: 'b-1111-1545', hora: '15:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Buzz Lightyear',
        descricao: 'Standby. Repaginado em 2026',
        contexto:
          'Dark ride onde vocês atiram em alvos e disputam pontuação. Girem a cabine com o ' +
          'joystick central para mirar melhor — os alvos com Z valem mais.',
        areaParque: 'Tomorrowland', acesso: ['standby'] },

      { id: 'b-1111-1615', hora: '16:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mickey’s PhilharMagic',
        descricao: 'Standby. 12 min, ar-condicionado, ótimo',
        contexto:
          'Filme 3D com efeitos no teatro — cheiro, água, ar. É praticamente sem diálogo ' +
          'relevante, então não sofre com a barreira de idioma. Ótimo bloco de descanso na ' +
          'pior hora de calor.',
        areaParque: 'Fantasyland', acesso: ['standby'], duracaoMin: 12 },

      { id: 'b-1111-1700', hora: '17:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'TRON Lightcycle Run',
        descricao: 'Single Pass, se compraram',
        contexto:
          'A montanha-russa mais rápida do Magic Kingdom (~100 km/h). Vocês montam em motos, ' +
          'inclinados para frente, e o lançamento é bem forte. É curta — cerca de 1 minuto — ' +
          'o que faz muita gente achar que não vale o Single Pass separado.',
        areaParque: 'Tomorrowland', acesso: ['single-pass'], condicional: true },

      { id: 'b-1111-1745', hora: '17:45', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Jantar — Casey’s Corner',
        descricao: 'Balcão na Main Street. Sentem fora, de frente para o pianista',
        contexto:
          'Casey’s Corner é balcão de cachorro-quente na Main Street, com pianista ao vivo na ' +
          'porta. Skipper Canteen é serviço à mesa, comida bem mais interessante e quase sempre ' +
          'com mesa disponível — é o restaurante mais subestimado do parque.',
        restauranteId: 'r-caseys', acesso: [] },

      { id: 'b-1111-1900', hora: '19:00', ancora: 'referencia', tipo: 'compras',
        titulo: 'Main Street',
        descricao: 'Compras, fotos com o castelo iluminado',
        contexto:
          'As lojas da Main Street ficam abertas até depois dos fogos, e esvaziam bem no ' +
          'momento em que todo mundo está se posicionando. Se sobrar compra, façam depois.',
        acesso: [] },

      { id: 'b-1111-2020', hora: '20:20', ancora: 'fixo', tipo: 'espera',
        titulo: 'Posição para os fogos',
        descricao: 'Main Street, lado direito olhando o castelo',
        contexto:
          '40 minutos antes parece exagero e não é. O show usa projeção no castelo além dos ' +
          'fogos, então o ângulo importa: de frente, e não muito perto, senão vocês perdem a ' +
          'projeção. HORÁRIO FIXO, colado no show.',
        acesso: [] },

      { id: 'b-1111-2100', hora: '21:00', ancora: 'fixo', tipo: 'show',
        titulo: 'Happily Ever After',
        descricao: '',
        contexto:
          'Fogos com projeção mapeada no castelo, cerca de 18 minutos. É o melhor espetáculo ' +
          'noturno da Disney e o fecho natural do dia. HORÁRIO FIXO — confirmem no app da ' +
          'Disney em novembro, porque em noites de evento especial ele não acontece.',
        acesso: [], duracaoMin: 18, confirmarHorario: false },
    ],
    ficha: {
      multiPass: {
        usar: true, opcional: false,
        listaAlta: ['Peter Pan’s Flight'],
        listaBaixa: ['Big Thunder Mountain', 'Mansão Mal-Assombrada'],
        planoB:
          'Se o Big Thunder estiver na lista alta, troque o Peter Pan por ele e coloque ' +
          'Piratas do Caribe na baixa.',
      },
      singlePass: {
        itens: ['Seven Dwarfs Mine Train'],
        opcionais: ['TRON Lightcycle Run'],
        nota: null,
      },
      expressPass: null,
      custoEstimadoCasal: { min: 95, max: 140, moeda: 'USD' },
      extras: [],
    },
    renuncias: {
      gerais: [
        { nome: 'Dumbo' }, { nome: 'Barnstormer' }, { nome: 'Tomorrowland Speedway' },
        { nome: 'Astro Orbiter' }, { nome: 'Mad Tea Party' },
        { nome: 'Ariel’s Undersea Adventure' }, { nome: 'Enchanted Tales with Belle' },
        { nome: 'Tapete Mágico' }, { nome: 'Tom Sawyer Island' }, { nome: 'Liberty Belle' },
      ],
      idioma: {
        itens: ['Hall of Presidents', 'Country Bear Jamboree',
                'Monsters Inc. Laugh Floor', 'Enchanted Tiki Room'],
        motivo:
          'São atrações longas, faladas e com humor que depende de referência americana. São ' +
          '20 a 25 minutos cada que rendem muito mais em outro lugar.',
      },
      fechado: ['Carousel of Progress'],
    },
  },

  /* ===== 12/11 · QUINTA · OUTLET E ICON PARK ============================== */
  {
    id: 'd-2026-11-12',
    data: '2026-11-12',
    diaSemana: 'quinta',
    emoji: '🛍️',
    titulo: 'Outlet e ICON Park',
    subtitulo: 'Dia leve no eixo da International Drive',
    tipo: 'compras',
    operadora: null,
    parqueId: null,
    custoZero: false,
    referencia: null,
    resumo:
      'Este dia perdeu a festa de Natal do Magic Kingdom. A geografia foi reorganizada para o ' +
      'dia inteiro rodar no eixo da International Drive, economizando Uber. Vocês vêm de ' +
      'Magic Kingdom até 21h no dia anterior — o bloco vazio da tarde é obrigatório.',
    avisos: [],
    alternativa: {
      titulo: 'Mais barato e mais Disney: resort hopping',
      texto:
        'Em vez do ICON Park, os hotéis Disney são abertos ao público e gratuitos. Grand ' +
        'Floridian (piano ao vivo no saguão), Polynesian (tiki bar) e Wilderness Lodge ' +
        '(lareira gigante) valem a noite. Uber entre eles, jantar em um deles. É mais ' +
        'tranquilo e combina mais com o espírito da viagem de vocês.',
    },
    blocos: [
      { id: 'b-1211-0830', hora: '08:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Café da manhã no hotel',
        descricao: 'Incluso. Aproveitem — nos dias de parque vocês não conseguem',
        acesso: [] },

      { id: 'b-1211-1000', hora: '10:00', ancora: 'fixo', tipo: 'compras',
        titulo: 'Orlando International Premium Outlets',
        descricao: '~25 min. Peguem o cupom book grátis no balcão de informações',
        contexto:
          'Outlet a céu aberto com cerca de 180 lojas. O cupom book é gratuito mas não é ' +
          'oferecido — tem que pedir no balcão de informações, e costuma ter descontos ' +
          'adicionais de 10 a 25% em marcas grandes. Turistas estrangeiros conseguem pedindo ' +
          'com o passaporte.',
        endereco: '4951 International Dr', localId: 'premium-outlets', acesso: [] },

      { id: 'b-1211-1300', hora: '13:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Almoço no outlet ou no Sweet Tomatoes da I-Drive',
        descricao: '', acesso: [] },

      { id: 'b-1211-1430', hora: '14:30', ancora: 'fixo', tipo: 'vazio',
        titulo: 'VAZIO PROPOSITAL',
        descricao: 'Voltar ao hotel, piscina, dormir',
        contexto:
          'Não preencham. Vocês vêm de um Magic Kingdom que terminou às 21h e ainda têm 14 ' +
          'dias pela frente, incluindo Busch Gardens com 3 horas de carro.',
        acesso: [] },

      { id: 'b-1211-1730', hora: '17:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'ICON Park',
        descricao: 'Entrada da área é livre; cada atração é paga',
        contexto:
          'Complexo aberto na I-Drive, sem ingresso de entrada. Vocês só pagam o que usarem. ' +
          'Tem restaurantes, bares e algumas atrações avulsas.',
        endereco: '8375 International Dr', localId: 'icon-park', acesso: [] },

      { id: 'b-1211-1800', hora: '18:00', ancora: 'fixo', tipo: 'atracao',
        titulo: 'The Wheel',
        descricao:
          'Roda-gigante de 122 m. Subam no fim de tarde: dá para ver os fogos dos parques ao ' +
          'longe. ~US$ 30',
        contexto:
          'Cabines fechadas e climatizadas, uma volta de ~18 minutos. O horário do documento é ' +
          'bem escolhido: pega o pôr do sol e, se der sorte com o timing, os fogos do Epcot e ' +
          'do Magic Kingdom ao longe.',
        acesso: [], duracaoMin: 18 },

      { id: 'b-1211-1900', hora: '19:00', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Museum of Illusions ou Madame Tussauds',
        descricao: 'Opcionais. Só se estiverem com pique',
        acesso: [], opcional: true },

      { id: 'b-1211-2000', hora: '20:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar na I-Drive',
        descricao: 'Yard House, Tin Roof (música ao vivo), Cooper’s Hawk',
        acesso: [] },
    ],
    renuncias: null,
    ficha: null,
  },

  /* ===== 13/11 · SEXTA · ANIMAL KINGDOM ================================== */
  {
    id: 'd-2026-11-13',
    data: '2026-11-13',
    diaSemana: 'sexta',
    emoji: '🦁',
    titulo: 'Animal Kingdom',
    subtitulo: 'Sem Multi Pass · fiquem até escurecer',
    tipo: 'parque',
    operadora: 'disney',
    parqueId: 'animal-kingdom',
    custoZero: false,
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },
    resumo:
      'O parque encolheu com o fim da DinoLand e, chegando na abertura, vocês resolvem tudo no ' +
      'standby. Mudança em relação à v2: fiquem até o anoitecer. Pandora com as plantas ' +
      'bioluminescentes acesas é o melhor visual do parque, e vocês estavam saindo às 15h.',
    avisos: [],
    notas: [
      { tipo: 'info', texto:
        'O pôr do sol em Orlando em meados de novembro é por volta das 17h30. Por isso o bloco ' +
        'de Pandora está às 17h30 com âncora fixa: ele não segue a abertura do parque, segue o ' +
        'sol.', pesquisa: '2026-09-08' },
    ],
    blocos: [
      { id: 'b-1311-0730', hora: '07:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel', descricao: '', localId: 'animal-kingdom', acesso: [] },

      { id: 'b-1311-0815', hora: '08:15', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão', descricao: '',
        contexto:
          'O Animal Kingdom tem estacionamento e entrada diretos, sem monotrilho — por isso a ' +
          'saída é 45 minutos mais tarde que no Magic Kingdom.',
        localId: 'animal-kingdom', acesso: [] },

      { id: 'b-1311-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Na’vi River Journey',
        descricao: 'Standby, rope drop. A fila explode depois das 10h',
        contexto:
          'Passeio de barco de 5 minutos por uma floresta bioluminescente de Pandora. Não tem ' +
          'emoção nenhuma — é puramente visual, e o animatrônico da Xamã no fim é considerado ' +
          'o melhor que a Disney já construiu. Capacidade baixa, fila cruel depois das 10h.',
        areaParque: 'Pandora', acesso: ['rope-drop', 'standby'] },

      { id: 'b-1311-0935', hora: '09:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Kilimanjaro Safaris',
        descricao: 'Standby. Animais mais ativos de manhã',
        contexto:
          'Safári de caminhão por 45 hectares com animais soltos de verdade — girafas, leões, ' +
          'elefantes, rinocerontes. Dura cerca de 22 minutos e cada passeio é diferente. A dica ' +
          'do documento é técnica: no calor da tarde os animais se escondem na sombra.',
        areaParque: 'Africa', acesso: ['standby'], duracaoMin: 22 },

      { id: 'b-1311-1040', hora: '10:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Expedition Everest',
        descricao: 'Standby. Se a fila estiver curta, façam duas vezes',
        contexto:
          'Montanha-russa dentro de uma montanha cenográfica de 60 metros, com um trecho longo ' +
          'andando para trás no escuro. É a mais intensa do parque, mas ainda assim familiar — ' +
          'sem inversões. A fila tem um museu de ioga e ietis que vale olhar.',
        areaParque: 'Asia', acesso: ['standby'] },

      { id: 'b-1311-1120', hora: '11:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Flight of Passage',
        descricao: 'Single Pass. A melhor atração do Walt Disney World',
        contexto:
          'Simulador em que vocês montam num banco de moto e "voam" num banshee sobre Pandora, ' +
          'com tela 3D gigante, vento, cheiro e o banco respirando embaixo de vocês. É consenso ' +
          'como a melhor atração da Disney no mundo. Não está no Multi Pass: compra separada.',
        areaParque: 'Pandora', acesso: ['single-pass'] },

      { id: 'b-1311-1215', hora: '12:15', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Satu’li Canteen',
        descricao: 'Balcão, em Pandora. Um dos melhores da Disney',
        contexto:
          'Serviço de balcão com tigelas montáveis — escolhem proteína e base. É consistentemente ' +
          'eleito o melhor quick service do Walt Disney World. Usem mobile order pelo app: a ' +
          'fila do balcão aqui é longa e a do mobile order não existe.',
        restauranteId: 'r-satuli', areaParque: 'Pandora', acesso: [] },

      { id: 'b-1311-1315', hora: '13:15', ancora: 'fixo', tipo: 'show',
        titulo: 'Festival of the Lion King',
        descricao: '30 min. Show visual, sem barreira de idioma',
        contexto:
          'Espetáculo em teatro circular com acrobatas, cantores e carros alegóricos. É quase ' +
          'todo música e acrobacia, então o inglês não atrapalha. Cheguem 20 minutos antes para ' +
          'não sentar na primeira fila, que é ruim. HORÁRIO FIXO de sessão.',
        areaParque: 'Africa', acesso: [], duracaoMin: 30 },

      { id: 'b-1311-1415', hora: '14:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Maharajah Jungle Trek',
        descricao: 'Trilha a pé. Tigres',
        contexto:
          'Trilha a pé por ruínas cenográficas com tigres, dragões-de-komodo e morcegos ' +
          'gigantes. Sem fila, no seu ritmo, com muita sombra. Bom bloco para a hora quente.',
        areaParque: 'Asia', acesso: [] },

      { id: 'b-1311-1500', hora: '15:00', ancora: 'fixo', tipo: 'show',
        titulo: 'Zootopia: Better Zoogether!',
        descricao: 'Teatro da Árvore da Vida',
        contexto:
          'Show em 3D com efeitos no teatro e um animatrônico novo, cerca de 10 minutos. ' +
          'Substituiu o It’s Tough to be a Bug. A recepção da crítica especializada foi ruim — ' +
          'acham frenético e esquecível. É ar-condicionado e é curto; se o dia atrasar, é ' +
          'descartável sem culpa. HORÁRIO FIXO de sessão.',
        areaParque: 'Discovery Island', acesso: [], duracaoMin: 10, pesquisa: '2026-09-08' },

      { id: 'b-1311-1545', hora: '15:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Gorilla Falls',
        descricao: 'Trilha. Ritmo lento de propósito',
        contexto:
          'Trilha a pé com gorilas, hipopótamos vistos por baixo d’água e um aviário. ' +
          'Diferente do safári, aqui vocês param quanto quiserem.',
        areaParque: 'Africa', acesso: [] },

      { id: 'b-1311-1630', hora: '16:30', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Nomad Lounge',
        descricao: 'Drink na varanda. O lugar mais gostoso do parque',
        contexto:
          'Bar ao lado do Tiffins, com varanda sobre a água e ventiladores. Drinks autorais e ' +
          'petiscos. Costuma ter espera de 15 a 30 minutos no fim da tarde e não aceita reserva ' +
          '— coloquem o nome na lista e passeiem enquanto esperam.',
        restauranteId: 'r-nomad', areaParque: 'Discovery Island', acesso: [] },

      { id: 'b-1311-1730', hora: '17:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'Pandora ao anoitecer',
        descricao: 'Fiquem. As plantas acendem quando escurece',
        contexto:
          'Toda a vegetação de Pandora é pintada com tinta reativa e acende em azul e roxo ' +
          'quando escurece. É o melhor visual do parque e a razão da mudança em relação à v2. ' +
          'HORÁRIO FIXO — depende do pôr do sol (~17h30 em novembro), não da abertura.',
        areaParque: 'Pandora', acesso: [] },

      { id: 'b-1311-1830', hora: '18:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair', descricao: '', acesso: [] },

      { id: 'b-1311-1945', hora: '19:45', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Sanaa',
        descricao: 'Animal Kingdom Lodge. Peçam mesa na janela: girafas e zebras',
        contexto:
          'Fica no Animal Kingdom Lodge, que é outro endereço — não é dentro do parque. Cozinha ' +
          'indiana com influência africana, e o prato mais pedido é o Bread Service. As janelas ' +
          'dão para a savana do hotel, com animais soltos. Reserva pelo My Disney Experience, ' +
          'janela abre 14/09. HORÁRIO FIXO de reserva.',
        restauranteId: 'r-sanaa', localId: 'ak-lodge', acesso: ['reserva'] },
    ],
    ficha: {
      multiPass: {
        usar: false, opcional: false, listaAlta: [], listaBaixa: [], planoB: null,
        nota:
          'Sem Multi Pass. O parque encolheu com o fim da DinoLand e chegando na abertura ' +
          'vocês resolvem tudo no standby.',
      },
      singlePass: { itens: ['Avatar Flight of Passage'], opcionais: [], nota: null },
      expressPass: null,
      custoEstimadoCasal: { min: 36, max: 40, moeda: 'USD' },
      extras: [],
    },
    renuncias: {
      gerais: [
        { nome: 'Feathered Friends in Flight' }, { nome: 'Bluey’s Wild World' },
        { nome: 'Wildlife Express Train' }, { nome: 'Rafiki’s Planet Watch' },
        { nome: 'Discovery Island Trails' }, { nome: 'The Animation Experience' },
      ],
      idioma: null,
      fechado: ['DINOSAUR e toda a DinoLand (demolidos para a futura Tropical Americas)'],
    },
  },

  /* ===== 14/11 · SÁBADO · CELEBRATION + ISLANDS À NOITE ================== */
  {
    id: 'd-2026-11-14',
    data: '2026-11-14',
    diaSemana: 'sábado',
    emoji: '🎄',
    titulo: 'Celebration e Islands à noite',
    subtitulo: 'Entrada extra no Islands · custo zero',
    tipo: 'livre',
    operadora: 'universal',
    parqueId: 'islands-of-adventure',
    custoZero: true,
    entradaExtra: true,
    notaCusto:
      'A entrada no Islands hoje é extra e não custa nada: o ingresso Universal de vocês já ' +
      'cobre. São duas horas só para o Natal — as atrações grandes são do dia 19.',
    // A âncora do dia NÃO é abertura de parque. É o show do Grinchmas.
    referencia: { rotulo: 'Grinchmas', padrao: '18:45', confirmado: false },
    resumo:
      'Sábado. O objetivo do dia é ficar longe de parque cheio e chegar inteiro na segunda ' +
      'metade da viagem. A noite no Islands é só decoração de Natal.',
    avisos: [
      'Não tentem atração grande hoje. Hagrid’s, VelociCoaster e Forbidden Journey são do dia 19.',
      'A feira de Celebration é aos domingos. Vocês vão no sábado e não pegam — não é perda ' +
      'relevante, mas não fiquem procurando.',
    ],
    notas: [
      { tipo: 'bom', texto:
        'VERIFICADO EM 08/09: a temporada de Natal da Universal em 2026 vai de 14/11 a 03/01. ' +
        'O documento está certo — vocês pegam literalmente a PRIMEIRA noite da temporada, com ' +
        'Grinchmas e a projeção no castelo já rodando.', pesquisa: '2026-09-08' },
      { tipo: 'atencao', texto:
        'O horário do Grinchmas é a âncora deste dia. Quando confirmarem no app da Universal, ' +
        'editem a referência e a noite inteira desloca junto. A projeção no castelo às 20h15 ' +
        'tem horário próprio e fica parada.' },
    ],
    blocos: [
      { id: 'b-1411-0900', hora: '09:00', ancora: 'fixo', tipo: 'vazio',
        titulo: 'VAZIO PROPOSITAL',
        descricao: 'Dormir até tarde, café no hotel, piscina',
        contexto: 'Não preencham. Sábado é o pior dia para parque e o melhor para recuperar.',
        acesso: [] },

      { id: 'b-1411-1100', hora: '11:00', ancora: 'fixo', tipo: 'livre',
        titulo: 'Celebration',
        descricao: '10 min de Uber, US$ 10–15',
        contexto:
          'Cidade planejada e construída pela Disney nos anos 90 como projeto de urbanismo — ' +
          'não é atração, é uma cidade de verdade onde mora gente. Arquitetura de vila ' +
          'americana idealizada, tudo a pé.',
        localId: 'celebration', acesso: [] },

      { id: 'b-1411-1115', hora: '11:15', ancora: 'fixo', tipo: 'livre',
        titulo: 'Market Street, o lago, o coreto, a Water Tower Place',
        descricao: 'Cidade planejada pela Disney nos anos 90',
        localId: 'celebration', acesso: [] },

      { id: 'b-1411-1230', hora: '12:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Almoço — Columbia Restaurant',
        descricao: 'Reserva. Peçam o "1905 Salad", preparado na mesa, e o sanduíche cubano',
        contexto:
          'Filial do restaurante espanhol-cubano mais antigo da Flórida, fundado em Tampa em ' +
          '1905. O 1905 Salad é montado e temperado na frente de vocês. HORÁRIO FIXO de reserva.',
        restauranteId: 'r-columbia', localId: 'celebration', acesso: ['reserva'] },

      { id: 'b-1411-1400', hora: '14:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Kilwins — sorvete',
        descricao: 'Na Market Street', localId: 'celebration', acesso: [] },

      { id: 'b-1411-1445', hora: '14:45', ancora: 'fixo', tipo: 'vazio',
        titulo: 'Voltar ao hotel, descansar', descricao: '', acesso: [] },

      { id: 'b-1411-1800', hora: '18:00', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Universal CityWalk',
        descricao: '~30 min',
        contexto:
          'CityWalk é a área de restaurantes e lojas entre os dois parques da Universal. ' +
          'Entrada livre, sem ingresso. É por onde vocês passam para chegar ao Islands.',
        localId: 'citywalk', acesso: [] },

      { id: 'b-1411-1830', hora: '18:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Entrada no Islands of Adventure',
        descricao: 'Entrada extra, custo zero. Primeira noite da temporada de Natal',
        localId: 'islands-of-adventure', acesso: [] },

      { id: 'b-1411-1845', hora: '18:45', ancora: 'referencia', tipo: 'show',
        titulo: 'Grinchmas Who-liday Spectacular',
        descricao: 'Seuss Landing. Confiram o horário no app',
        contexto:
          'Musical ao vivo de cerca de 30 minutos com o Grinch e os Whos, em teatro coberto no ' +
          'Seuss Landing. O ator do Grinch improvisa com a plateia e é o ponto alto. É falado ' +
          'em inglês, mas a história é conhecida e a produção é muito visual.',
        areaParque: 'Seuss Landing', acesso: [], duracaoMin: 30, confirmarHorario: true },

      { id: 'b-1411-1930', hora: '19:30', ancora: 'referencia', tipo: 'livre',
        titulo: 'Hogsmeade decorada · cerveja amanteigada frozen',
        descricao: 'Carrinho externo, fila menor',
        contexto:
          'A cerveja amanteigada não tem álcool e é doce — a versão frozen é a mais pedida no ' +
          'calor. A dica do carrinho externo é boa: dentro do Three Broomsticks a fila é sempre ' +
          'maior, e é exatamente a mesma bebida.',
        areaParque: 'Hogsmeade', acesso: [] },

      { id: 'b-1411-1950', hora: '19:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Flight of the Hippogriff',
        descricao: 'Se a fila estiver abaixo de 20 min',
        contexto:
          'Montanha-russa infantil de 1 minuto. Vale pela vista do castelo de Hogwarts e da ' +
          'cabana do Hagrid. Não vale fila.',
        areaParque: 'Hogsmeade', acesso: ['standby'], duracaoMin: 1,
        condicao: 'Só se a fila estiver abaixo de 20 min' },

      { id: 'b-1411-2015', hora: '20:15', ancora: 'fixo', tipo: 'show',
        titulo: 'The Magic of Christmas at Hogwarts Castle',
        descricao: 'Projeção no castelo. Cheguem 20 min antes',
        contexto:
          'Projeção mapeada na fachada do castelo de Hogwarts com música e efeitos, cerca de ' +
          '7 minutos. Repete várias vezes por noite. O melhor lugar é o pátio em frente, e ele ' +
          'lota. HORÁRIO FIXO — tem sessões próprias, não segue o Grinchmas.',
        areaParque: 'Hogsmeade', acesso: [], duracaoMin: 7, confirmarHorario: true },

      { id: 'b-1411-2100', hora: '21:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar no CityWalk — Toothsome Chocolate Emporium',
        descricao: 'Sair do parque',
        contexto:
          'Restaurante temático steampunk, famoso pelos milkshakes exagerados. Não aceita ' +
          'reserva e a espera costuma passar de uma hora nos fins de semana — coloquem o nome ' +
          'na lista assim que saírem do parque.',
        restauranteId: 'r-toothsome', localId: 'citywalk', acesso: [] },
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
    subtitulo: 'O dia mais caro em passes · e o mais justificado',
    tipo: 'parque',
    operadora: 'disney',
    parqueId: 'hollywood-studios',
    custoZero: false,
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },
    resumo:
      'O parque mais difícil da Disney e o dia mais caro em passes. Também o mais justificado. ' +
      'Sem Early Entry, o lugar na fila é o que vocês têm.',
    avisos: [],
    notas: [
      { tipo: 'bom', texto:
        'VERIFICADO EM 08/09: 15/11 não é noite de Disney Jollywood Nights. As datas de ' +
        'novembro são 7, 14, 16, 21, 23 e 28 — sábados e segundas. Nessas o parque fecha às ' +
        '19h30 para quem não tem ingresso do evento, o que mataria o Fantasmic! das 20h15. ' +
        'O domingo de vocês está limpo.', pesquisa: '2026-09-08' },
    ],
    blocos: [
      { id: 'b-1511-0700', hora: '07:00', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel', descricao: '', localId: 'hollywood-studios', acesso: [] },

      { id: 'b-1511-0800', hora: '08:00', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão',
        descricao: 'Sem Early Entry, o lugar na fila é o que vocês têm',
        localId: 'hollywood-studios', acesso: [] },

      { id: 'b-1511-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Millennium Falcon: Smugglers Run',
        descricao: 'Standby, rope drop. Galaxy’s Edge',
        contexto:
          'Simulador em que vocês pilotam a Millennium Falcon em grupos de seis, cada um com ' +
          'uma função. Se sentarem como pilotos, vocês controlam de verdade — e a nave bate ' +
          'muito. Peçam para ser pilotos: as outras funções são bem menos interessantes.',
        areaParque: 'Galaxy’s Edge', acesso: ['rope-drop', 'standby'] },

      { id: 'b-1511-0945', hora: '09:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Rock ’n’ Roller Coaster (Muppets)',
        descricao: 'Standby. Sunset Blvd, ainda cedo',
        contexto:
          'Montanha-russa fechada, no escuro, com lançamento de 0 a 90 km/h em menos de 3 ' +
          'segundos e três inversões. É a mais intensa da Disney em Orlando. A temática foi ' +
          'trocada de Aerosmith para os Muppets.',
        areaParque: 'Sunset Blvd', acesso: ['standby'] },

      { id: 'b-1511-1030', hora: '10:30', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Rise of the Resistance',
        descricao: 'Single Pass. 18 minutos, a mais elaborada da Disney',
        contexto:
          'Não é uma atração, são quatro: pré-show, simulador de nave, um hangar em escala real ' +
          'com dezenas de stormtroopers e o passeio em veículo sem trilhos. É consenso como a ' +
          'coisa mais ambiciosa que a Disney já construiu. Vale o Single Pass sozinho.',
        areaParque: 'Galaxy’s Edge', acesso: ['single-pass'], duracaoMin: 18 },

      { id: 'b-1511-1115', hora: '11:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Slinky Dog Dash',
        descricao: 'Multi Pass',
        contexto:
          'Montanha-russa familiar ao ar livre no Toy Story Land, com dois lançamentos suaves. ' +
          'Não é intensa, mas é das filas mais longas do parque o dia inteiro — por isso está ' +
          'na lista alta do Multi Pass.',
        areaParque: 'Toy Story Land', acesso: ['multi-pass'] },

      { id: 'b-1511-1145', hora: '11:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Alien Swirling Saucers',
        descricao: 'Só se a fila estiver abaixo de 15 min',
        contexto: 'Xícaras giratórias temáticas, 90 segundos. Leve. Só se estiver vazio mesmo.',
        areaParque: 'Toy Story Land', acesso: ['standby'],
        condicao: 'Só se a fila estiver abaixo de 15 min' },

      { id: 'b-1511-1215', hora: '12:15', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Docking Bay 7',
        descricao: 'Balcão, dentro de Galaxy’s Edge',
        contexto:
          'Balcão temático de Batuu, com pratos de nomes alienígenas que são versões de comida ' +
          'reconhecível. Usem mobile order — a fila do balcão é longa e a retirada é imediata.',
        restauranteId: 'r-docking-bay', areaParque: 'Galaxy’s Edge', acesso: [] },

      { id: 'b-1511-1315', hora: '13:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Torre do Terror',
        descricao: 'Multi Pass',
        contexto:
          'Queda livre dentro de um hotel abandonado cenográfico, com sequência aleatória de ' +
          'subidas e quedas que muda a cada volta. A ambientação é a melhor da Disney. Sensação ' +
          'de estômago forte — se alguém tiver medo de queda, é esta.',
        areaParque: 'Sunset Blvd', acesso: ['multi-pass'] },

      { id: 'b-1511-1400', hora: '14:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mickey & Minnie’s Runaway Railway',
        descricao: 'Standby',
        contexto:
          'Dark ride sem trilhos visíveis onde vocês entram literalmente dentro de um desenho. ' +
          'Colorido, rápido, sem emoção forte. Tem diálogo, mas a graça é visual.',
        areaParque: 'Hollywood Blvd', acesso: ['standby'] },

      { id: 'b-1511-1450', hora: '14:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'The Magic of Disney Animation',
        descricao: 'Standby. Abriu em setembro — se a fila passar de 45 min, use o Multi Pass rolando',
        contexto:
          'Atração nova, reabertura do antigo pavilhão de animação. Por ser recente, a fila é ' +
          'imprevisível e pode estourar. O documento já dá a saída certa: se passar de 45 ' +
          'minutos, gasta uma reserva rolando do Multi Pass.',
        areaParque: 'Animation Courtyard', acesso: ['standby'], acessoAlt: 'multi-pass',
        condicao: 'Se a fila passar de 45 min, use o Multi Pass rolando' },

      { id: 'b-1511-1545', hora: '15:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Toy Story Mania',
        descricao: 'Multi Pass',
        contexto:
          'Jogo de tiro em 3D com óculos, em cabines giratórias — vocês competem por pontuação. ' +
          'Puxem o gatilho o mais rápido possível: a pontuação premia volume de tiros.',
        areaParque: 'Toy Story Land', acesso: ['multi-pass'] },

      { id: 'b-1511-1630', hora: '16:30', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Star Tours',
        descricao: 'Standby. Clássico, e o roteiro muda a cada visita',
        contexto:
          'Simulador de cabine com tela e movimento. O sistema sorteia destinos e personagens ' +
          'a cada sessão, então duas voltas quase nunca são iguais. Legendas disponíveis, e a ' +
          'trama é simples.',
        areaParque: 'Echo Lake', acesso: ['standby'] },

      { id: 'b-1511-1715', hora: '17:15', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Oga’s Cantina',
        descricao: 'Reserva. 45 min',
        contexto:
          'Bar temático de Batuu com DJ droide, drinks autorais bem estranhos e limite de tempo ' +
          'de 45 minutos por grupo. É quase impossível entrar sem reserva. Janela abre 16/09. ' +
          'HORÁRIO FIXO de reserva.',
        restauranteId: 'r-ogas', areaParque: 'Galaxy’s Edge', acesso: ['reserva'], duracaoMin: 45 },

      { id: 'b-1511-1815', hora: '18:15', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Sci-Fi Dine-In',
        descricao: 'Reserva. Mesas em formato de carro',
        contexto:
          'Vocês sentam dentro de conversíveis dos anos 50 num cinema drive-in cenográfico, ' +
          'assistindo a trailers de ficção científica ruim em loop. A comida é americana comum ' +
          '— vocês vão pelo cenário, que é único. Janela abre 16/09. HORÁRIO FIXO de reserva.',
        restauranteId: 'r-scifi', areaParque: 'Commissary Lane', acesso: ['reserva'] },

      { id: 'b-1511-1945', hora: '19:45', ancora: 'fixo', tipo: 'livre',
        titulo: 'Sunset Blvd',
        descricao: 'Decoração de Natal, música ao vivo',
        areaParque: 'Sunset Blvd', acesso: [] },

      { id: 'b-1511-2015', hora: '20:15', ancora: 'fixo', tipo: 'show',
        titulo: 'Fantasmic!',
        descricao: 'Cheguem 40 min antes. Confiram se está programado no dia',
        contexto:
          'Espetáculo noturno em anfiteatro a céu aberto de 6900 lugares, com projeção em telas ' +
          'de água, fogo, barcos e um dragão. Cerca de 30 minutos. Não roda todas as noites — ' +
          'por isso o documento manda confirmar. HORÁRIO FIXO.',
        areaParque: 'Sunset Blvd', acesso: [], duracaoMin: 30, confirmarHorario: true },
    ],
    ficha: {
      multiPass: {
        usar: true, opcional: false,
        listaAlta: ['Slinky Dog Dash'],
        listaBaixa: ['Torre do Terror', 'Toy Story Mania'],
        planoB: null,
      },
      singlePass: {
        itens: ['Rise of the Resistance'], opcionais: [],
        nota: 'Peçam janela até as 11h.',
      },
      expressPass: null,
      custoEstimadoCasal: { min: 115, max: 130, moeda: 'USD' },
      extras: [],
    },
    renuncias: {
      gerais: [
        { nome: 'Disney Junior' }, { nome: 'Frozen Sing-Along' }, { nome: 'Vacation Fun' },
        { nome: 'Lightning McQueen’s Racing Academy' }, { nome: 'Walt Disney Presents' },
      ],
      idioma: {
        itens: ['Indiana Jones Epic Stunt Spectacular'],
        motivo:
          'É visual, mas tem muito texto falado entre as cenas. Se o dia atrasar, é o primeiro ' +
          'a cair.',
      },
      fechado: ['Muppet Vision 3D'],
    },
  },

  /* ===== 16/11 · SEGUNDA · EPCOT ======================================== */
  {
    id: 'd-2026-11-16',
    data: '2026-11-16',
    diaSemana: 'segunda',
    emoji: '🌍',
    titulo: 'Epcot',
    subtitulo: 'Food & Wine · a tarde é comida, não fila',
    tipo: 'parque',
    operadora: 'disney',
    parqueId: 'epcot',
    custoZero: false,
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },
    resumo:
      'Dia de Food & Wine. A tarde é comida, não fila. A manhã resolve as atrações e o ' +
      'World Showcase começa ao meio-dia, no sentido horário a partir do México.',
    avisos: [],
    notas: [
      { tipo: 'bom', texto:
        'VERIFICADO EM 08/09: o Food & Wine de 2026 vai até 21/11, então 16/11 está dentro. O ' +
        'Festival of the Holidays só começa em 27/11, depois que vocês vão embora — vocês pegam ' +
        'o festival certo.', pesquisa: '2026-09-08' },
    ],
    blocos: [
      { id: 'b-1611-0800', hora: '08:00', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel', descricao: '', localId: 'epcot', acesso: [] },

      { id: 'b-1611-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Cosmic Rewind',
        descricao: 'Single Pass. Coaster com cabines giratórias e trilha sonora',
        contexto:
          'Montanha-russa fechada e no escuro, com lançamento e cabines que giram 360° para ' +
          'onde a cena está acontecendo. Sem inversões, mas rápida. Cada volta sorteia uma ' +
          'música diferente dos anos 70/80. É a melhor atração do Epcot.',
        areaParque: 'World Discovery', acesso: ['single-pass'] },

      { id: 'b-1611-0950', hora: '09:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Test Track',
        descricao: 'Standby cedo, ou Multi Pass',
        contexto:
          'Vocês desenham um carro num painel e depois andam num veículo que faz testes de ' +
          'curva, freio e um trecho externo a 105 km/h. É a parte mais rápida da Disney em ' +
          'linha reta.',
        areaParque: 'World Discovery', acesso: ['standby'], acessoAlt: 'multi-pass' },

      { id: 'b-1611-1035', hora: '10:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mission: SPACE — Orange',
        descricao: 'Standby. A versão laranja é a intensa, com centrífuga',
        contexto:
          'Simulador de lançamento espacial dentro de uma centrífuga que gera força G real. A ' +
          'versão laranja causa enjoo em muita gente — tem saco no assento por um motivo. A ' +
          'verde é a mesma cabine sem girar. Se tiverem qualquer tendência a enjoo, peguem a verde.',
        areaParque: 'World Discovery', acesso: ['standby'] },

      { id: 'b-1611-1115', hora: '11:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Soarin’ Across America',
        descricao: 'Standby. Filme novo desde maio de 2026',
        contexto:
          'Vocês sentam num banco que sobe e balança na frente de uma tela IMAX côncava, com ' +
          'sensação de estar voando de pernas soltas. Tem cheiro sincronizado com as cenas. ' +
          'Suave, sem emoção forte — agrada praticamente todo mundo.',
        areaParque: 'World Nature', acesso: ['standby'] },

      { id: 'b-1611-1200', hora: '12:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'The Seas / Living with the Land',
        descricao: 'Fila curta, ar-condicionado, ritmo lento',
        contexto:
          'The Seas é um aquário enorme com golfinhos e peixes-boi. Living with the Land é um ' +
          'passeio de barco por estufas hidropônicas reais, onde a Disney cultiva parte do que ' +
          'serve nos restaurantes. Os dois são calmos e quase sem fila.',
        areaParque: 'World Nature', acesso: ['standby'] },

      { id: 'b-1611-1245', hora: '12:45', ancora: 'referencia', tipo: 'livre',
        titulo: 'World Showcase — México',
        descricao: 'Comecem aqui, sentido horário',
        contexto:
          'O World Showcase são 11 pavilhões de países ao redor de um lago, cada um com ' +
          'arquitetura, lojas e comida do país, com funcionários nativos. A volta completa a pé ' +
          'é de cerca de 2 km.',
        areaParque: 'World Showcase', acesso: [] },

      { id: 'b-1611-1300', hora: '13:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Gran Fiesta Tour',
        descricao: 'Barquinho dentro da pirâmide. Clássico, fila mínima',
        contexto:
          'Passeio de barco lento dentro do pavilhão do México, que por dentro é um mercado ' +
          'noturno cenográfico permanente. Fresco, escuro e quase sempre sem fila.',
        areaParque: 'World Showcase', acesso: ['standby'] },

      { id: 'b-1611-1330', hora: '13:30', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Frozen Ever After',
        descricao: 'Noruega. Multi Pass ou standby',
        contexto:
          'Passeio de barco pelo mundo de Frozen, com animatrônicos muito bons e um trecho ' +
          'curto de ré. A fila é sempre desproporcional ao tamanho da atração — por isso está ' +
          'na lista alta se vocês comprarem o Multi Pass.',
        areaParque: 'World Showcase', acesso: ['multi-pass'], acessoAlt: 'standby' },

      { id: 'b-1611-1415', hora: '14:15', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Food & Wine — volta 1',
        descricao: 'China, Alemanha, Itália',
        contexto:
          'Barracas espalhadas pelo World Showcase, cada uma com 2 a 4 pratos pequenos e ' +
          'bebidas. Peguem o passaporte na entrada do parque.',
        areaParque: 'World Showcase', acesso: [] },

      { id: 'b-1611-1530', hora: '15:30', ancora: 'referencia', tipo: 'show',
        titulo: 'The American Adventure',
        descricao: 'Ou pulem — 30 min, todo falado em inglês',
        contexto:
          'Show de animatrônicos sobre a história dos Estados Unidos. Tecnicamente impressionante ' +
          'e completamente dependente de inglês. O próprio documento marca como descartável.',
        areaParque: 'World Showcase', acesso: ['standby'], duracaoMin: 30, opcional: true },

      { id: 'b-1611-1600', hora: '16:00', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Food & Wine — volta 2',
        descricao: 'Japão, Marrocos',
        areaParque: 'World Showcase', acesso: [] },

      { id: 'b-1611-1700', hora: '17:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Remy’s Ratatouille Adventure',
        descricao: 'França. Multi Pass',
        contexto:
          'Vocês encolhem ao tamanho de um rato e andam por uma cozinha em escala gigante, em ' +
          'veículos sem trilhos com telas 3D. Cheiro sincronizado. Sem emoção forte.',
        areaParque: 'World Showcase', acesso: ['multi-pass'] },

      { id: 'b-1611-1745', hora: '17:45', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Food & Wine — volta 3',
        descricao: 'França, Reino Unido, Canadá',
        areaParque: 'World Showcase', acesso: [] },

      { id: 'b-1611-1900', hora: '19:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Spaceship Earth',
        descricao: 'A fila some à noite. A esfera por dentro',
        contexto:
          'O passeio dentro da esfera geodésica que é o símbolo do Epcot. Conta a história da ' +
          'comunicação humana em cenários com animatrônicos, subindo em espiral. Lento, ' +
          'climatizado e com narração em inglês, mas totalmente compreensível pelo visual.',
        areaParque: 'World Celebration', acesso: ['standby'] },

      { id: 'b-1611-2000', hora: '20:00', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Jantar leve ou mais barracas', descricao: '', acesso: [] },

      { id: 'b-1611-2100', hora: '21:00', ancora: 'fixo', tipo: 'show',
        titulo: 'Luminous: The Symphony of Us',
        descricao: 'Fiquem na margem entre México e Noruega',
        contexto:
          'Espetáculo noturno sobre o lago do World Showcase, com fogos, fontes e projeção nas ' +
          'telas dos barcos. Cerca de 17 minutos. A dica de posição do documento é boa: aquela ' +
          'margem tem visão frontal e esvazia mais rápido na saída. HORÁRIO FIXO.',
        areaParque: 'World Showcase', acesso: [], duracaoMin: 17 },
    ],
    ficha: {
      multiPass: {
        usar: null, opcional: true,
        listaAlta: ['Frozen Ever After'],
        listaBaixa: ['Remy’s Ratatouille Adventure', 'Test Track'],
        planoB: null,
        nota: 'Opcional. Se comprarem, é nessas três.',
      },
      singlePass: {
        itens: ['Guardians of the Galaxy: Cosmic Rewind'], opcionais: [], nota: null,
      },
      expressPass: null,
      custoEstimadoCasal: { min: 36, max: 95, moeda: 'USD' },
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
        { nome: 'Journey Into Imagination' }, { nome: 'Awesome Planet' },
        { nome: 'Turtle Talk with Crush' }, { nome: 'Disney & Pixar Short Film Festival' },
        { nome: 'Os filmes 360° da China e do Canadá' },
      ],
      idioma: null,
      fechado: [],
    },
  },

  /* ===== 17/11 · TERÇA · UNIVERSAL STUDIOS FLORIDA ====================== */
  {
    id: 'd-2026-11-17',
    data: '2026-11-17',
    diaSemana: 'terça',
    emoji: '🎥',
    titulo: 'Universal Studios Florida',
    subtitulo: 'Sem Express · chegar cedo é a estratégia inteira',
    tipo: 'parque',
    operadora: 'universal',
    parqueId: 'universal-studios',
    custoZero: false,
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },
    resumo:
      'Sem Express Pass. Sem Early Park Admission. Chegar cedo é a estratégia inteira — ' +
      'o rope drop no Gringotts resolve a maior fila do dia antes das 10h.',
    avisos: [],
    notas: [
      { tipo: 'info', texto:
        'O rope drop no Gringotts é o que decide o dia: é a maior fila daqui e a única que ' +
        'não tem conserto depois das 10h. A fila dele passa pelo saguão do banco e por dois ' +
        'pré-shows — vale a pena entrar cedo justamente para percorrer isso sem aperto.',
        pesquisa: '2026-09-08' },
    ],
    blocos: [
      { id: 'b-1711-0745', hora: '07:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel', descricao: '30–35 min de Kissimmee',
        localId: 'universal-studios', acesso: [] },

      { id: 'b-1711-0830', hora: '08:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão', descricao: '',
        contexto:
          'O estacionamento da Universal é um garagem gigante e a caminhada até a catraca, ' +
          'passando pelo CityWalk, leva de 15 a 20 minutos. Contem esse tempo.',
        localId: 'universal-studios', acesso: [] },

      { id: 'b-1711-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Escape from Gringotts',
        descricao: 'Rope drop. Vá direto ao Beco Diagonal',
        contexto:
          'Híbrido de montanha-russa e dark ride 3D dentro do banco dos duendes. Emoção moderada ' +
          '— tem quedas curtas, sem inversão. A fila passa pelo saguão do banco com duendes ' +
          'animatrônicos e dois pré-shows; é das melhores filas já construídas.',
        areaParque: 'Diagon Alley', acesso: ['rope-drop', 'standby'],
        singleRider: true, singleRiderNota: 'Pula os dois pré-shows. Não use na primeira vez.',
        locker: 'obrigatorio', pesquisa: '2026-09-08' },

      { id: 'b-1711-0950', hora: '09:50', ancora: 'referencia', tipo: 'livre',
        titulo: 'Beco Diagonal',
        descricao: 'Ollivanders (cerimônia da varinha), Gringotts, decoração de Natal',
        contexto:
          'A área inteira é fechada por muros, com o dragão em cima do banco que solta fogo de ' +
          'verdade a cada 10 minutos. Ollivanders é uma cerimônia curta em grupo pequeno onde ' +
          'a varinha "escolhe" alguém — é preciso entrar na fila, dura ~10 min.',
        areaParque: 'Diagon Alley', acesso: [] },

      { id: 'b-1711-1045', hora: '10:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Revenge of the Mummy',
        descricao: 'Coaster no escuro com lançamento',
        contexto:
          'Montanha-russa fechada com lançamento, fogo de verdade no teto e um trecho de ré. ' +
          'Curta e muito divertida. Exige locker com detector de metal — nada nos bolsos, nem ' +
          'celular.',
        areaParque: 'New York', acesso: ['standby'],
        singleRider: true, locker: 'detector', pesquisa: '2026-09-08' },

      { id: 'b-1711-1120', hora: '11:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Hollywood Rip Ride Rockit',
        descricao: 'Você escolhe a trilha sonora na hora',
        contexto:
          'Montanha-russa alta com subida vertical de 90° e uma volta não invertida. Sacode ' +
          'bastante. Vocês escolhem a música num painel no assento antes de sair. Guardem tudo ' +
          'no locker — não permite nada solto.',
        areaParque: 'Production Central', acesso: ['standby'],
        locker: 'obrigatorio', verificado: false },

      { id: 'b-1711-1200', hora: '12:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Transformers: The Ride 3D',
        descricao: '',
        contexto:
          'Veículo em movimento com telas 3D gigantes e muito movimento. É intenso visualmente ' +
          'mas não tem queda nem inversão. Barulhento e sem pausa do começo ao fim.',
        areaParque: 'Production Central', acesso: ['standby'],
        singleRider: true, pesquisa: '2026-09-08' },

      { id: 'b-1711-1245', hora: '12:45', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Leaky Cauldron',
        descricao: 'Bangers and mash, fish and chips',
        contexto:
          'Balcão temático de pub inglês dentro do Beco Diagonal, com teto baixo e luz de vela. ' +
          'Comida britânica de verdade. É o melhor quick service da Universal.',
        restauranteId: 'r-leaky', areaParque: 'Diagon Alley', acesso: [] },

      { id: 'b-1711-1400', hora: '14:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Men in Black: Alien Attack',
        descricao: 'Clássico, você atira',
        contexto:
          'Dark ride de tiro em cabines que giram, com pontuação no fim. Truque: mirem nos ' +
          'olhos laranja dos aliens e continuem atirando mesmo depois de acertar.',
        areaParque: 'World Expo', acesso: ['standby'],
        singleRider: true, locker: 'obrigatorio', pesquisa: '2026-09-08' },

      { id: 'b-1711-1445', hora: '14:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Villain-Con Minion Blast',
        descricao: 'Minion Land',
        contexto: 'Atração de tiro em que vocês andam numa esteira. Leve, curta, sem emoção.',
        areaParque: 'Minion Land', acesso: ['standby'] },

      { id: 'b-1711-1530', hora: '15:30', ancora: 'referencia', tipo: 'atracao',
        titulo: 'The Simpsons Ride',
        descricao: 'Simulador, humor que sobrevive à tradução',
        contexto:
          'Simulador de cabine em cúpula, tipo montanha-russa virtual. Causa enjoo em algumas ' +
          'pessoas. A área externa reproduz Springfield inteira, com Moe’s e Krusty Burger.',
        areaParque: 'Springfield', acesso: ['standby'] },

      { id: 'b-1711-1615', hora: '16:15', ancora: 'fixo', tipo: 'show',
        titulo: 'The Bourne Stuntacular',
        descricao: 'O melhor show de Orlando. Puramente visual',
        contexto:
          'Show de dublês ao vivo integrado com tela LED gigante — os atores entram e saem da ' +
          'projeção sem emenda. Cerca de 25 minutos, praticamente sem diálogo relevante. ' +
          'HORÁRIO FIXO de sessão.',
        areaParque: 'Hollywood', acesso: [], duracaoMin: 25 },

      { id: 'b-1711-1715', hora: '17:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'E.T. Adventure',
        descricao: 'Clássico de 1990. Só existe aqui no mundo',
        contexto:
          'Passeio de bicicleta suspensa sobre cenários, o último remanescente da Universal dos ' +
          'anos 90. No fim, o E.T. fala o nome de cada visitante — vocês dão o nome na entrada.',
        areaParque: 'Woody Woodpecker’s KidZone', acesso: ['standby'] },

      { id: 'b-1711-1800', hora: '18:00', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Jantar',
        descricao: 'Finnegan’s dentro do parque, ou CityWalk',
        restauranteId: 'r-finnegans', acesso: [] },

      { id: 'b-1711-1930', hora: '19:30', ancora: 'fixo', tipo: 'show',
        titulo: 'Universal’s Holiday Parade featuring Macy’s',
        descricao: 'Balões da parada de Nova York. Confiram o horário',
        contexto:
          'Desfile com balões gigantes originais da parada de Ação de Graças da Macy’s em Nova ' +
          'York, mais carros do Despicable Me, Shrek e Madagascar. Termina com o Papai Noel ' +
          'acendendo a árvore do parque. HORÁRIO FIXO — confirmem no app.',
        acesso: [], confirmarHorario: true, pesquisa: '2026-09-08' },
    ],
    ficha: {
      multiPass: null, singlePass: null,
      expressPass: {
        usar: false,
        motivo: 'Decisão fechada: sem Express Pass em nenhum dia da Universal.',
        alternativa: 'Express Pass Now dentro do parque (US$ 20–30, uma atração) se um dia virar.',
      },
      custoEstimadoCasal: { min: 0, max: 0, moeda: 'USD' },
      extras: [],
    },
    renuncias: {
      gerais: [
        { nome: 'Fast & Furious: Supercharged',
          motivo: 'Consenso de que é a pior atração do complexo' },
        { nome: 'Kang & Kodos' }, { nome: 'Woody Woodpecker' }, { nome: 'Animal Actors' },
        { nome: 'Hogwarts Express',
          motivo: 'Deixem para o dia 19, quando dá para fazer ida e volta' },
      ],
      idioma: null, fechado: [],
    },
  },

  /* ===== 18/11 · QUARTA · MILLENIA, LAKE EOLA E NBA ====================== */
  {
    id: 'd-2026-11-18',
    data: '2026-11-18',
    diaSemana: 'quarta',
    emoji: '🏀',
    titulo: 'Compras, Lake Eola e NBA',
    subtitulo: 'Orlando Magic x Philadelphia 76ers',
    tipo: 'livre',
    operadora: null,
    parqueId: null,
    custoZero: false,
    referencia: null,
    resumo: 'Dia de cidade, não de parque. Termina no Kia Center, no centro de Orlando.',
    avisos: [
      'O Kia Center não permite mochila. Bolsa pequena, tamanho carteira de mão.',
    ],
    blocos: [
      { id: 'b-1811-0900', hora: '09:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Café no hotel', descricao: '', acesso: [] },

      { id: 'b-1811-1030', hora: '10:30', ancora: 'fixo', tipo: 'compras',
        titulo: 'The Mall at Millenia',
        descricao: '~30 min. Apple, Macy’s, Bloomingdale’s, marcas de luxo',
        contexto:
          'É o shopping de luxo de Orlando, coberto e climatizado — diferente do outlet do dia ' +
          '12, que é a céu aberto e de preço baixo. Aqui é preço cheio com marcas que não têm ' +
          'no Brasil ou custam muito mais.',
        endereco: '4200 Conroy Rd', localId: 'millenia', acesso: [] },

      { id: 'b-1811-1300', hora: '13:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Almoço no mall',
        descricao: 'The Cheesecake Factory fica na entrada principal',
        contexto:
          'Porções muito grandes — uma entrada dividida entre dois costuma bastar. Guardem ' +
          'espaço ou peçam a fatia de cheesecake para viagem.',
        localId: 'millenia', acesso: [] },

      { id: 'b-1811-1430', hora: '14:30', ancora: 'fixo', tipo: 'vazio',
        titulo: 'Voltar ao hotel, descansar',
        descricao: 'Ou continuar nas compras, se render', acesso: [] },

      { id: 'b-1811-1630', hora: '16:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'Lake Eola Park',
        descricao:
          '10 min do Kia Center. Parque urbano com o lago, os cisnes e a fonte. Grátis. ' +
          'O melhor lugar da cidade para o pôr do sol',
        contexto:
          'É o cartão-postal do centro de Orlando: lago com a fonte iluminada, cisnes e a ' +
          'silhueta dos prédios atrás. O pôr do sol em novembro é por volta das 17h30, então ' +
          'o horário do documento acerta em cheio.',
        localId: 'lake-eola', acesso: [] },

      { id: 'b-1811-1745', hora: '17:45', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar no centro',
        descricao: 'Kres Chophouse, The Boheme, Ace Cafe Orlando',
        localId: 'lake-eola', acesso: [] },

      { id: 'b-1811-1830', hora: '18:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Kia Center — portões abrem', descricao: '',
        localId: 'kia-center', acesso: [] },

      { id: 'b-1811-1900', hora: '19:00', ancora: 'fixo', tipo: 'show',
        titulo: 'Orlando Magic x Philadelphia 76ers',
        descricao: '',
        contexto:
          'Jogo da temporada regular da NBA, cerca de 2h30 com intervalos. A arena vende comida ' +
          'e bebida caras — e o show de intervalo faz parte da experiência americana. Confiram ' +
          'o horário do jogo perto da data: a NBA remarca por TV.',
        localId: 'kia-center', acesso: [], confirmarHorario: true },

      { id: 'b-1811-2130', hora: '21:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Saída',
        descricao:
          'Andem dois quarteirões antes de chamar o Uber. A tarifa dinâmica em volta da arena ' +
          'logo após o apito é brutal',
        contexto:
          'Vale mais que parece: a tarifa pode triplicar nos 20 minutos após o jogo, dentro do ' +
          'raio da arena. Dois quarteirões a pé costumam resolver.',
        acesso: [], horaAprox: true },
    ],
    renuncias: null, ficha: null,
  },

  /* ===== 19/11 · QUINTA · ISLANDS OF ADVENTURE ========================== */
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
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },
    resumo:
      'Hagrid’s não aceita Express desde julho de 2026 — a única arma é chegar primeiro. ' +
      'Hoje é o dia com mais locker obrigatório da viagem: contem 10 a 15 minutos extras em ' +
      'Hulk, VelociCoaster, Hagrid’s e Forbidden Journey.',
    avisos: [
      'Standby em tudo, os dois juntos. O que compra tempo hoje é a hora de chegada e o peso ' +
      'da mochila: quatro atrações exigem locker obrigatório e isso custa 40 a 60 minutos ' +
      'somados. Quanto menos vocês carregarem, mais atração cabe no dia.',
    ],
    notas: [
      { tipo: 'atencao', texto:
        'Somando os lockers obrigatórios do dia, são 40 a 60 minutos que o cronograma de ' +
        '45 min por atração não previu. Levem o mínimo possível: quanto menos bagagem, menos ' +
        'tempo perdido. Hulk e VelociCoaster têm detector de metal e não passa nem celular.',
        pesquisa: '2026-09-08' },
    ],
    blocos: [
      { id: 'b-1911-0745', hora: '07:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel', descricao: '', localId: 'islands-of-adventure', acesso: [] },

      { id: 'b-1911-0830', hora: '08:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão', descricao: 'Fiquem à esquerda, sentido Hogsmeade',
        localId: 'islands-of-adventure', acesso: [] },

      { id: 'b-1911-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Hagrid’s Magical Creatures Motorbike Adventure',
        descricao: 'Rope drop, sem exceção. A melhor de Orlando',
        contexto:
          'Montanha-russa de lançamento em motos com sidecar, com sete lançamentos, uma queda ' +
          'vertical e um trecho de ré. Sem inversões. É considerada a melhor montanha-russa de ' +
          'Orlando e a fila passa de 2 horas o dia todo. Saiu do Express em julho de 2026: ' +
          'chegar primeiro é literalmente a única saída.',
        areaParque: 'Hogsmeade', acesso: ['rope-drop', 'standby'],
        singleRider: true, locker: 'obrigatorio',
        lockerNota: 'Pochete de 3 pontos na cintura costuma ser liberada, a critério do funcionário.',
        pesquisa: '2026-09-08' },

      { id: 'b-1911-0955', hora: '09:55', ancora: 'referencia', tipo: 'atracao',
        titulo: 'VelociCoaster',
        descricao: 'A mais intensa do parque. Inversões sobre o lago',
        contexto:
          'Dois lançamentos, 70 metros de altura, quatro inversões e um trecho rasante sobre a ' +
          'água. É consenso como a melhor montanha-russa da Flórida e uma das melhores do mundo. ' +
          'Detector de metal: absolutamente nada nos bolsos.',
        areaParque: 'Jurassic Park', acesso: ['standby'],
        singleRider: true, locker: 'detector', pesquisa: '2026-09-08' },

      { id: 'b-1911-1040', hora: '10:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Forbidden Journey',
        descricao: 'Dentro do castelo de Hogwarts',
        contexto:
          'Braço robótico que carrega vocês por cenários físicos e telas, com voo sobre ' +
          'Hogwarts. Balança bastante e causa enjoo em parte das pessoas. A fila atravessa o ' +
          'castelo por dentro — retratos falantes, sala do Dumbledore — e vale a caminhada.',
        areaParque: 'Hogsmeade', acesso: ['standby'],
        singleRider: true, locker: 'obrigatorio', pesquisa: '2026-09-08' },

      { id: 'b-1911-1125', hora: '11:25', ancora: 'referencia', tipo: 'atracao',
        titulo: 'The Incredible Hulk Coaster',
        descricao: 'Lançamento de 0 a 64 km/h em 2 segundos',
        contexto:
          'Lançamento dentro de um túnel, sete inversões e muito barulho. Clássica de 1999, ' +
          'reconstruída em 2016. Detector de metal — nada nos bolsos.',
        areaParque: 'Marvel Super Hero Island', acesso: ['standby'],
        singleRider: true, locker: 'detector', pesquisa: '2026-09-08' },

      { id: 'b-1911-1200', hora: '12:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Jurassic Park River Adventure',
        descricao: 'Molha. Novembro é ameno, mas leve capa',
        contexto:
          'Passeio de barco que vira ataque de dinossauros e termina numa queda de 25 metros ' +
          'no escuro. Molha de verdade, principalmente nas primeiras fileiras. A capa de ' +
          'chuva do Walmart do dia 10 serve aqui.',
        areaParque: 'Jurassic Park', acesso: ['standby'],
        singleRider: true, molha: true, pesquisa: '2026-09-08' },

      { id: 'b-1911-1240', hora: '12:40', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Three Broomsticks',
        descricao: 'Costelinha e frango assado',
        contexto:
          'Balcão temático dentro de Hogsmeade, com telhado alto e vigas tortas. Porções ' +
          'grandes; o combo de costelinha e frango serve dois com folga.',
        restauranteId: 'r-broomsticks', areaParque: 'Hogsmeade', acesso: [] },

      { id: 'b-1911-1350', hora: '13:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'The Amazing Adventures of Spider-Man',
        descricao: 'Clássico. Ainda é referência técnica',
        contexto:
          'Veículo em movimento que combina cenário físico, telas 3D e uma simulação de queda ' +
          'livre de 120 metros que parece real. É de 1999 e continua sendo estudada como ' +
          'referência de dark ride.',
        areaParque: 'Marvel Super Hero Island', acesso: ['standby'],
        singleRider: true, singleRiderNota: 'Entrada pela esquerda, no corredor que liga a saída à loja.',
        pesquisa: '2026-09-08' },

      { id: 'b-1911-1435', hora: '14:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Skull Island: Reign of Kong',
        descricao: '',
        contexto:
          'Caminhão expedicionário com telas 3D e um animatrônico enorme do Kong no fim. Tem ' +
          'atores na fila. Escuro e barulhento, mas sem emoção física forte.',
        areaParque: 'Skull Island', acesso: ['standby'],
        singleRider: true, pesquisa: '2026-09-08' },

      { id: 'b-1911-1520', hora: '15:20', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Hogwarts Express — ida',
        descricao: 'Para o Beco Diagonal. Precisa do Park-to-Park, que vocês têm',
        contexto:
          'Trem real entre os dois parques, com janelas que são telas mostrando a paisagem e ' +
          'sombras no corredor da cabine. Leva ~7 minutos e é uma atração, não só transporte.',
        areaParque: 'Hogsmeade Station', acesso: ['standby'], duracaoMin: 7 },

      { id: 'b-1911-1550', hora: '15:50', ancora: 'referencia', tipo: 'livre',
        titulo: 'Beco Diagonal',
        descricao: 'Cerveja amanteigada, o que ficou faltando no dia 17',
        areaParque: 'Diagon Alley', acesso: [] },

      { id: 'b-1911-1640', hora: '16:40', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Hogwarts Express — volta',
        descricao: 'O trajeto é diferente na volta. Façam os dois',
        contexto:
          'A ida e a volta têm filmes e cenas completamente diferentes — não é o mesmo passeio ' +
          'invertido. É por isso que o documento manda fazer os dois.',
        areaParque: 'King’s Cross', acesso: ['standby'], duracaoMin: 7 },

      { id: 'b-1911-1720', hora: '17:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Doctor Doom’s Fearfall',
        descricao: 'Torre de lançamento, rápido',
        contexto:
          'Torre que atira vocês para cima em vez de soltar de cima. Dura menos de 1 minuto. ' +
          'A sensação de estômago é forte, mas acaba rápido.',
        areaParque: 'Marvel Super Hero Island', acesso: ['standby'],
        singleRider: true, duracaoMin: 1, pesquisa: '2026-09-08' },

      { id: 'b-1911-1750', hora: '17:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Flight of the Hippogriff',
        descricao: 'Coaster leve, 1 min, boa vista do castelo',
        areaParque: 'Hogsmeade', acesso: ['standby'], duracaoMin: 1 },

      { id: 'b-1911-1830', hora: '18:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Mythos',
        descricao: 'Já eleito o melhor restaurante de parque temático do mundo',
        contexto:
          'Serviço à mesa dentro de uma caverna cenográfica com vista para a lagoa central. ' +
          'Ganhou várias vezes o prêmio de melhor restaurante de parque temático. ' +
          'RESERVA CONFIRMADA COMO NECESSÁRIA — está no checklist.',
        restauranteId: 'r-mythos', areaParque: 'The Lost Continent', acesso: ['reserva'] },

      { id: 'b-1911-2000', hora: '20:00', ancora: 'fixo', tipo: 'livre',
        titulo: 'Hogsmeade à noite',
        descricao: 'Projeção no castelo, se quiserem rever',
        areaParque: 'Hogsmeade', acesso: [] },
    ],
    ficha: {
      multiPass: null, singlePass: null,
      expressPass: {
        usar: false,
        motivo:
          'O Hagrid’s saiu do Express em julho de 2026 — vocês pagariam e ainda enfrentariam ' +
          'a fila que incomoda.',
        alternativa: 'Express Pass Now dentro do parque (US$ 20–30, uma atração).',
      },
      custoEstimadoCasal: { min: 0, max: 0, moeda: 'USD' },
      extras: [],
    },
    renuncias: {
      gerais: [
        { nome: 'Pteranodon Flyers', motivo: 'Só com criança' },
        { nome: 'Storm Force Accelatron' }, { nome: 'Caro-Seuss-el' },
        { nome: 'One Fish Two Fish' }, { nome: 'Cat in the Hat' },
        { nome: 'Popeye e Dudley Do-Right',
          motivo: 'Molham muito e vocês já vão molhar no Jurassic Park' },
      ],
      idioma: null, fechado: [],
    },
  },

  /* ===== 20/11 · SEXTA · AIRBOAT, CARRO E OLD TOWN ====================== */
  {
    id: 'd-2026-11-20',
    data: '2026-11-20',
    diaSemana: 'sexta',
    emoji: '🚗',
    titulo: 'Airboat, carro e Old Town',
    subtitulo: 'Dia inteiro dentro de Kissimmee',
    tipo: 'livre',
    operadora: null,
    parqueId: null,
    custoZero: false,
    referencia: null,
    resumo: 'O dia mais barato da viagem em deslocamento. Tudo acontece dentro de Kissimmee.',
    avisos: [],
    alternativa: {
      titulo: 'Se o aerobarco não empolgar',
      texto:
        'Fun Spot America fica a 10 min, tem duas montanhas-russas de madeira e kart de vários ' +
        'andares. Cobra por atração, sem ingresso obrigatório.',
    },
    blocos: [
      { id: 'b-2011-0830', hora: '08:30', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Boggy Creek Airboat Adventures',
        descricao:
          '~20 min do hotel. Passeio de aerobarco pelas nascentes dos Everglades, com jacarés ' +
          'selvagens, águias e aves. Reservem online. Levem boné e óculos de sol — o vento é forte',
        contexto:
          'Aerobarco é o barco de hélice aérea que anda em água rasa e capim. É barulhento — ' +
          'eles dão protetor auricular. Os jacarés são selvagens, não é cativeiro, então a ' +
          'quantidade varia com o clima: dia frio, menos jacaré na superfície.',
        endereco: '2001 E Southport Rd', localId: 'boggy-creek', acesso: ['reserva'] },

      { id: 'b-2011-0900', hora: '09:00', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Passeio de 30 min ou de 1 hora',
        descricao: 'No local: jardim de borboletas, exposição de jacarés, exposição indígena',
        localId: 'boggy-creek', acesso: [] },

      { id: 'b-2011-1100', hora: '11:00', ancora: 'fixo', tipo: 'livre',
        titulo: 'Kissimmee Lakefront Park',
        descricao: 'Lake Tohopekaliga. Grátis. Deck sobre o lago, ciclovia, ótimo para fotos',
        localId: 'lakefront-park', acesso: [] },

      { id: 'b-2011-1230', hora: '12:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Almoço na 192',
        descricao: 'Black Angus Steakhouse, Miller’s Ale House, ou um dos brasileiros da região',
        acesso: [] },

      { id: 'b-2011-1400', hora: '14:00', ancora: 'fixo', tipo: 'vazio',
        titulo: 'VAZIO PROPOSITAL',
        descricao: 'Descanso no hotel',
        contexto:
          'Não preencham. A partir de amanhã são cinco dias seguidos pesados: Winter Garden, ' +
          'SeaWorld, Epic, Busch Gardens com 3h de carro, e Epic de novo.',
        acesso: [] },

      { id: 'b-2011-1530', hora: '15:30', ancora: 'fixo', tipo: 'tarefa',
        titulo: 'Retirar o carro alugado',
        descricao:
          'Filial de bairro na 192. Peguem hoje, não amanhã — filiais de bairro fecham cedo ' +
          'no sábado',
        contexto:
          'Essa é a tarefa mais crítica do dia. Se a filial fechar antes de vocês chegarem, o ' +
          'dia 21 em Winter Garden cai — o Farmers Market abre às 8h e não dá para ir de Uber ' +
          'a esse preço. Levem carteira de motorista, passaporte e o cartão de crédito ' +
          'internacional em nome do condutor.',
        acesso: [], critico: true },

      { id: 'b-2011-1630', hora: '16:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'Old Town Kissimmee',
        descricao:
          'Entrada e estacionamento gratuitos. Muscle Car Show na Trophy Row desde as 15h — ' +
          'carros de 1964 em diante',
        endereco: '5770 W Irlo Bronson Memorial Hwy', localId: 'old-town', acesso: [] },

      { id: 'b-2011-1830', hora: '18:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar no Old Town',
        descricao: 'Flippers Pizzeria, Hamburger Mary’s, A&W (root beer float)',
        localId: 'old-town', acesso: [] },

      { id: 'b-2011-2030', hora: '20:30', ancora: 'fixo', tipo: 'show',
        titulo: 'Friday Night Cruise',
        descricao: 'Peguem lugar na calçada 20 min antes',
        contexto:
          'Desfile semanal de centenas de carros clássicos americanos pela rua principal do ' +
          'Old Town, toda sexta. É gratuito e é a coisa mais americana da viagem inteira. ' +
          'Só acontece às sextas — por isso está neste dia e não em outro.',
        localId: 'old-town', acesso: [] },

      { id: 'b-2011-2200', hora: '22:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar', descricao: '', acesso: [] },
    ],
    renuncias: null, ficha: null,
  },

  /* ===== 21/11 · SÁBADO · WINTER GARDEN E DISNEY SPRINGS ================ */
  {
    id: 'd-2026-11-21',
    data: '2026-11-21',
    diaSemana: 'sábado',
    emoji: '🌻',
    titulo: 'Winter Garden e Disney Springs no Natal',
    subtitulo: 'Primeiro dia com carro',
    tipo: 'livre',
    operadora: null,
    parqueId: null,
    custoZero: false,
    referencia: null,
    resumo:
      'Primeiro dia com carro. E o dia em que vocês voltam ao Disney Springs para ver o que ' +
      'não existia no dia 10: a decoração de Natal, que começou em 13/11. É de graça e é ' +
      'literalmente outro lugar.',
    avisos: [
      'O Farmers Market funciona das 8h às 13h e é o motivo de vir a Winter Garden. Chegar ' +
      'depois das 11h esvazia o sentido do dia.',
    ],
    blocos: [
      { id: 'b-2111-0745', hora: '07:45', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair de carro', descricao: '~40 min',
        localId: 'winter-garden', acesso: [] },

      { id: 'b-2111-0830', hora: '08:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'Winter Garden Farmers Market',
        descricao:
          'Downtown Pavilion, 104 S. Lakeview Ave. Mais de 100 barracas, 8h às 13h. ' +
          'É o motivo de vir a Winter Garden',
        contexto:
          'Feira de sábado numa cidadezinha histórica a 40 minutos de Orlando, sem nada de ' +
          'turístico de parque. Produtores locais, comida pronta, artesanato. É o contraponto ' +
          'mais forte da viagem em relação aos parques.',
        endereco: '104 S. Lakeview Ave', localId: 'winter-garden', acesso: [] },

      { id: 'b-2111-1030', hora: '10:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'Plant Street',
        descricao:
          'Rua histórica de tijolos. Dois museus gratuitos: Central Florida Railroad Museum e ' +
          'Winter Garden Heritage Museum',
        localId: 'winter-garden', acesso: [] },

      { id: 'b-2111-1130', hora: '11:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Axum Coffee',
        descricao: 'A cafeteria da cidade. Café de verdade',
        localId: 'winter-garden', acesso: [] },

      { id: 'b-2111-1230', hora: '12:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Almoço — Plant Street Market',
        descricao: 'Mercado gastronômico com a Crooked Can Brewing dentro',
        localId: 'winter-garden', acesso: [] },

      { id: 'b-2111-1400', hora: '14:00', ancora: 'fixo', tipo: 'atracao',
        titulo: 'West Orange Trail',
        descricao: 'Opcional. Ciclovia de 35 km. Aluguel de bicicleta no centro. Uma hora resolve',
        localId: 'winter-garden', acesso: [], opcional: true },

      { id: 'b-2111-1500', hora: '15:00', ancora: 'fixo', tipo: 'vazio',
        titulo: 'VAZIO PROPOSITAL',
        descricao: 'Voltar ao hotel, descanso',
        contexto: 'Não preencham. Amanhã é SeaWorld o dia inteiro e depois Epic Universe.',
        acesso: [] },

      { id: 'b-2111-1800', hora: '18:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Disney Springs',
        descricao: 'De carro, estacionamento gratuito',
        localId: 'disney-springs', acesso: [] },

      { id: 'b-2111-1830', hora: '18:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'Christmas Tree Stroll',
        descricao:
          'Gratuito. Árvores gigantes temáticas — Mansão Mal-Assombrada, Piratas, ' +
          'A Princesa e o Sapo, O Estranho Mundo de Jack. Peguem o mapa do circuito',
        contexto:
          'Circuito de árvores de Natal gigantes espalhadas por Disney Springs, cada uma ' +
          'decorada com o tema de um filme ou atração. O mapa é distribuído nos quiosques e ' +
          'transforma o passeio numa caça ao tesouro.',
        localId: 'disney-springs', acesso: [] },

      { id: 'b-2111-1930', hora: '19:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'Decoração de Natal, música ao vivo, encontro com o Papai Noel',
        descricao: '', localId: 'disney-springs', acesso: [] },

      { id: 'b-2111-2000', hora: '20:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Homecomin’ ou Polite Pig',
        descricao: 'O que vocês não comeram no dia 10',
        contexto:
          'Homecomin’ é comida caseira da Flórida, famoso pelo frango frito — é o mais ' +
          'concorrido de Disney Springs e costuma ter 1h de espera sem reserva. Polite Pig é ' +
          'barbecue de balcão, sem espera.',
        restauranteId: 'r-homecomin', localId: 'disney-springs', acesso: [] },

      { id: 'b-2111-2200', hora: '22:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar', descricao: '', acesso: [] },
    ],
    renuncias: null, ficha: null,
  },

  /* ===== 22/11 · DOMINGO · SEAWORLD ===================================== */
  {
    id: 'd-2026-11-22',
    data: '2026-11-22',
    diaSemana: 'domingo',
    emoji: '🐋',
    titulo: 'SeaWorld',
    subtitulo: 'Plano de refeição incluso no Promo Park',
    tipo: 'parque',
    operadora: 'seaworld',
    parqueId: 'seaworld',
    custoZero: false,
    // ATENÇÃO: referência 10h, não 9h. Ver nota abaixo.
    referencia: { rotulo: 'Abertura do parque', padrao: '10:00', confirmado: false },
    resumo:
      'Cinco montanhas-russas fortes na primeira metade do dia, animais na segunda, Natal à ' +
      'noite. O plano de refeição do Promo Park cobre duas refeições e lanches ao longo do dia.',
    avisos: [],
    notas: [
      { tipo: 'atencao', texto:
        'CORREÇÃO DE PREMISSA: o aviso geral do documento diz que todos os relógios assumem 9h, ' +
        'mas os blocos deste dia (chegada 9h15, Mako às 10h) só fazem sentido com abertura às ' +
        '10h — que é o horário típico do SeaWorld. Coloquei a referência em 10h, o que deixa a ' +
        'chegada 45 min antes da abertura, exatamente como manda a regra de ouro nº 1. ' +
        'Se confirmarem 9h, mudem a referência e o dia inteiro desloca junto.',
        pesquisa: '2026-09-08', verificado: false },
      { tipo: 'atencao', texto:
        'A Christmas Celebration roda em DATAS SELECIONADAS a partir de 06/11. 22/11 é domingo ' +
        'e muito provavelmente está incluído, mas confirmem — os blocos das 17h15 e 19h45 ' +
        'dependem disso.', pesquisa: '2026-09-08' },
    ],
    blocos: [
      { id: 'b-2211-0915', hora: '09:15', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Chegada', descricao: '', localId: 'seaworld', acesso: [] },

      { id: 'b-2211-1000', hora: '10:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mako',
        descricao: 'A mais alta e rápida da Flórida. Hipercoaster, sensação de flutuar',
        contexto:
          'Hipercoaster: sem inversões, feita para dar "airtime" — a sensação de sair do banco ' +
          'nas descidas. 60 metros e 118 km/h. É suave e longa, das mais agradáveis do complexo.',
        acesso: ['rope-drop', 'standby'] },

      { id: 'b-2211-1035', hora: '10:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Manta',
        descricao: 'Você voa deitado de bruços',
        contexto:
          'Coaster voadora: o banco gira e vocês ficam de barriga para baixo, com os braços ' +
          'soltos, rasando a água. Sensação totalmente diferente de qualquer outra do dia.',
        acesso: ['standby'] },

      { id: 'b-2211-1110', hora: '11:10', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Kraken',
        descricao: 'Coaster invertido, 7 inversões',
        contexto:
          'Pés soltos no ar, sete inversões, 65 metros. É a mais intensa do parque em ' +
          'inversão pura.',
        acesso: ['standby'] },

      { id: 'b-2211-1145', hora: '11:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Ice Breaker',
        descricao: 'Lançamentos para frente e para trás',
        contexto:
          'Coaster de lançamento múltiplo: acelera para frente, volta de ré, e repete até ' +
          'vencer a rampa. Curta e divertida, não é assustadora.',
        acesso: ['standby'] },

      { id: 'b-2211-1215', hora: '12:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Pipeline',
        descricao: 'Você anda em pé. Único no mundo nesse formato',
        contexto:
          'A primeira "surf coaster" do mundo: vocês vão de pé numa prancha, e o piso sobe e ' +
          'desce sob os pés simulando a onda. Formato que não existe em nenhum outro parque.',
        acesso: ['standby'] },

      { id: 'b-2211-1250', hora: '12:50', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço',
        descricao: 'Plano de refeição incluso no Promo Park', acesso: [] },

      { id: 'b-2211-1350', hora: '13:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Penguin Trek',
        descricao: 'Coaster com passagem pelo hábitat dos pinguins',
        contexto:
          'Coaster familiar em carrinhos de snowmobile que termina dentro do hábitat gelado ' +
          'dos pinguins de verdade. Leve — a graça é a mistura de coaster com zoológico.',
        acesso: ['standby'] },

      { id: 'b-2211-1430', hora: '14:30', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Journey to Atlantis',
        descricao: 'Molha bastante',
        contexto:
          'Híbrido de log flume com coaster: uma queda grande molhada e depois um trecho seco ' +
          'de montanha-russa no escuro. Molha de verdade.',
        acesso: ['standby'], molha: true },

      { id: 'b-2211-1515', hora: '15:15', ancora: 'fixo', tipo: 'show',
        titulo: 'Orca Encounter',
        descricao: 'O show principal',
        contexto:
          'Apresentação com orcas num formato de documentário ao vivo, com foco em ' +
          'comportamento natural. Cerca de 25 minutos. As primeiras fileiras são a "zona ' +
          'molhada" e ela é real. HORÁRIO FIXO de sessão.',
        acesso: [], duracaoMin: 25 },

      { id: 'b-2211-1615', hora: '16:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Shark Encounter e Antarctica',
        descricao: '',
        contexto:
          'Shark Encounter é um túnel de acrílico dentro do tanque de tubarões. Antarctica ' +
          'combina um passeio curto com o hábitat de pinguins, mantido a poucos graus — leve ' +
          'algo de manga longa.',
        acesso: [] },

      { id: 'b-2211-1715', hora: '17:15', ancora: 'fixo', tipo: 'show',
        titulo: 'Christmas Celebration',
        descricao: 'Neve artificial no Waterfront, corais',
        acesso: [], confirmarHorario: true },

      { id: 'b-2211-1830', hora: '18:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Sharks Underwater Grill',
        descricao: 'Mesas coladas no tanque de tubarões. Reservem',
        contexto:
          'Serviço à mesa com uma parede inteira de vidro para o tanque de tubarões. É o único ' +
          'restaurante do SeaWorld que precisa de reserva, feita direto no site do parque. ' +
          'Provavelmente NÃO está coberto pelo plano de refeição — confirmem.',
        restauranteId: 'r-sharks', acesso: ['reserva'] },

      { id: 'b-2211-1945', hora: '19:45', ancora: 'fixo', tipo: 'show',
        titulo: 'Sea of Trees',
        descricao: 'Árvores luminosas sincronizadas sobre o lago',
        contexto:
          'Centenas de árvores de Natal flutuando no lago central, com luzes coreografadas em ' +
          'sincronia com música. É o ponto alto do Natal do SeaWorld.',
        acesso: [], confirmarHorario: true },
    ],
    ficha: {
      multiPass: null, singlePass: null, expressPass: null,
      custoEstimadoCasal: { min: 0, max: 0, moeda: 'USD' },
      extras: [
        { nome: 'Plano de refeição',
          texto: 'Incluso no Promo Park. Usem: duas refeições e lanches ao longo do dia.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Infinity Falls', motivo: 'Molha muito e anoitece frio' },
        { nome: 'Sesame Street Land' }, { nome: 'Wild Arctic' }, { nome: 'Sea Lion High' },
      ],
      idioma: null, fechado: [],
    },
  },

  /* ===== 23/11 · SEGUNDA · EPIC UNIVERSE (dia 1) ======================== */
  {
    id: 'd-2026-11-23',
    data: '2026-11-23',
    diaSemana: 'segunda',
    emoji: '🌌',
    titulo: 'Epic Universe — dia 1',
    subtitulo: 'Hoje é para o que tem fila grande',
    tipo: 'parque',
    operadora: 'universal',
    parqueId: 'epic-universe',
    custoZero: false,
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },
    resumo:
      'O melhor dia da semana para o parque mais concorrido de Orlando. Sem Early Park ' +
      'Admission, o portão é a estratégia. Vocês voltam dia 25 — então hoje não é para fazer ' +
      'tudo, é para fazer o que tem fila grande. O que sobrar, sobra de propósito.',
    avisos: [
      'Standby em tudo, os dois juntos. Hoje é a primeira vez em cada atração — e vocês voltam ' +
      'dia 25, então o que não couber hoje não se perde.',
    ],
    notas: [
      { tipo: 'info', texto:
        'As três de maior demanda são Battle at the Ministry, Monsters Unchained e Stardust ' +
        'Racers — exatamente as três que o documento colocou cedo. A ordem está certa.',
        pesquisa: '2026-09-08' },
      { tipo: 'info', texto:
        'Early Park Admission no Epic existe, mas só para hóspedes de hotel Universal. Vocês ' +
        'estão no Travelodge, então não têm — o documento está correto. Isso significa que o ' +
        'parque já terá gente dentro quando vocês entrarem às 9h.', pesquisa: '2026-09-08' },
    ],
    blocos: [
      { id: 'b-2311-0645', hora: '06:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair de carro', descricao: '~30 min',
        localId: 'epic-universe', acesso: [] },

      { id: 'b-2311-0730', hora: '07:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão',
        descricao: 'A caminhada do estacionamento até a entrada é longa',
        contexto:
          'O Epic tem estacionamento próprio, mas a caminhada até a catraca passa por uma ' +
          'esplanada grande e leva de 15 a 20 minutos. Chegar 90 minutos antes não é exagero ' +
          'aqui.',
        localId: 'epic-universe', acesso: [] },

      { id: 'b-2311-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Harry Potter and the Battle at the Ministry',
        descricao: 'Rope drop. Maior fila do parque, disparado',
        contexto:
          'Dark ride pelo Ministério da Magia, misturando cenário físico, animatrônicos e telas ' +
          'de forma quase invisível. É consenso como a melhor atração do parque e a de maior ' +
          'demanda. Emoção baixa — é história, não adrenalina.',
        areaParque: 'Ministry of Magic', acesso: ['rope-drop', 'standby'],
        singleRider: true, pesquisa: '2026-09-08' },

      { id: 'b-2311-1005', hora: '10:05', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Stardust Racers',
        descricao: 'Celestial Park. Coaster duplo, dois trens correndo',
        contexto:
          'Dois trens que correm lado a lado em trilhos separados, com 1500 m de percurso, ' +
          '133 metros e 100 km/h. Tem a "Celestial Spin", em que os dois carros se cruzam ' +
          'invertidos. Detector de metal — nada nos bolsos, nem celular.',
        areaParque: 'Celestial Park', acesso: ['standby'],
        singleRider: true, locker: 'detector', pesquisa: '2026-09-08' },

      { id: 'b-2311-1050', hora: '10:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mario Kart: Bowser’s Challenge',
        descricao: 'Super Nintendo World. Realidade aumentada',
        contexto:
          'Vocês usam um visor de realidade aumentada acoplado ao boné e coletam moedas ' +
          'girando o volante e apertando gatilhos. É a atração mais tecnicamente ambiciosa da ' +
          'área. Sem emoção física — é um jogo.',
        areaParque: 'Super Nintendo World', acesso: ['standby'],
        singleRider: true, pesquisa: '2026-09-08' },

      { id: 'b-2311-1145', hora: '11:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mine-Cart Madness',
        descricao: 'Donkey Kong. Trilhos que parecem quebrados',
        contexto:
          'Montanha-russa em carrinhos de mina com uma ilusão muito boa: o carrinho parece ' +
          'saltar trechos de trilho faltando. Familiar, sem inversão.',
        areaParque: 'Super Nintendo World', acesso: ['standby'],
        singleRider: true, pesquisa: '2026-09-08' },

      { id: 'b-2311-1220', hora: '12:20', ancora: 'referencia', tipo: 'tarefa',
        titulo: 'Entrar na lista do Toadstool Cafe',
        descricao: 'Pelo app. A lista fecha cedo — façam isso às 10h se lembrarem',
        contexto:
          'O Toadstool não aceita reserva: funciona por lista virtual pelo app da Universal, e ' +
          'a lista do almoço costuma fechar antes do meio-dia. Se vocês lembrarem de entrar às ' +
          '10h, entram; se deixarem para 12h20, pode não ter mais.',
        acesso: [], critico: true },

      { id: 'b-2311-1245', hora: '12:45', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Toadstool Cafe',
        descricao: '',
        contexto:
          'Restaurante temático do Mario, com pratos que imitam os itens do jogo. A comida é ' +
          'secundária: vocês vão pelo cenário e pela apresentação.',
        restauranteId: 'r-toadstool', areaParque: 'Super Nintendo World', acesso: [] },

      { id: 'b-2311-1400', hora: '14:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Yoshi’s Adventure',
        descricao: 'Leve, mas a vista de cima da área é a melhor foto',
        contexto:
          'Passeio lento em cima de um Yoshi, elevado sobre a área. É para criança, mas é a ' +
          'única forma de ver a Super Nintendo World de cima.',
        areaParque: 'Super Nintendo World', acesso: ['standby'] },

      { id: 'b-2311-1440', hora: '14:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Monsters Unchained',
        descricao: 'Dark Universe. Animatrônicos, a mais elaborada do parque',
        contexto:
          'A neta do Dr. Frankenstein faz experimentos com um Drácula capturado, e ele escapa. ' +
          'É o dark ride mais imersivo do parque, com animatrônicos excepcionais. Tem sustos e ' +
          'movimento, mas nada de queda grande. Locker obrigatório.',
        areaParque: 'Dark Universe', acesso: ['standby'],
        singleRider: true, locker: 'obrigatorio', pesquisa: '2026-09-08' },

      { id: 'b-2311-1535', hora: '15:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Curse of the Werewolf',
        descricao: 'Coaster familiar giratório',
        contexto:
          'Montanha-russa de carrinhos que giram livremente conforme o peso — cada volta é ' +
          'diferente. Leve, mas embrulha o estômago de quem é sensível a rotação.',
        areaParque: 'Dark Universe', acesso: ['standby'],
        singleRider: true, pesquisa: '2026-09-08' },

      { id: 'b-2311-1615', hora: '16:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Hiccup’s Wing Gliders',
        descricao: 'Isle of Berk. Lançamento suave, temática linda',
        contexto:
          'Coaster familiar de lançamento no mundo de Como Treinar o Seu Dragão. Suave, e a ' +
          'ambientação da vila viking é das mais bonitas do parque. Locker obrigatório.',
        areaParque: 'Isle of Berk', acesso: ['standby'],
        singleRider: true, locker: 'obrigatorio', pesquisa: '2026-09-08' },

      { id: 'b-2311-1700', hora: '17:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Dragon Racer’s Rally',
        descricao: '',
        contexto: 'Braços giratórios que vocês controlam para inclinar. Leve e rápido de fazer.',
        areaParque: 'Isle of Berk', acesso: ['standby'] },

      { id: 'b-2311-1740', hora: '17:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Fyre Drill',
        descricao: 'Interativo, molha',
        contexto:
          'Barcos giratórios em que vocês operam canhões de água — e levam água de volta dos ' +
          'outros barcos e da plateia. Molha de verdade. Deixem para o fim do dia por isso.',
        areaParque: 'Isle of Berk', acesso: ['standby'], molha: true },

      { id: 'b-2311-1820', hora: '18:20', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Atlantic ou Mead Hall',
        descricao: '',
        contexto:
          'Atlantic fica no Celestial Park, com peixes e frutos do mar em ambiente mais ' +
          'formal. Mead Hall é o salão viking do Isle of Berk, mais casual e mais temático.',
        restauranteId: 'r-atlantic', acesso: [] },

      { id: 'b-2311-1945', hora: '19:45', ancora: 'fixo', tipo: 'livre',
        titulo: 'Constellation Carousel e Celestial Park iluminado',
        descricao: 'O parque à noite é outro lugar',
        contexto:
          'O Celestial Park é a área central, com fontes coreografadas e iluminação que muda ' +
          'completamente depois do anoitecer. O carrossel é temático de constelações e as ' +
          'criaturas se movem de formas diferentes das de um carrossel comum.',
        areaParque: 'Celestial Park', acesso: [] },
    ],
    ficha: {
      multiPass: null, singlePass: null,
      expressPass: {
        usar: false,
        motivo:
          'Dois dias de ingresso já pago valem mais que um dia de Express a US$ 600 no casal.',
        alternativa: 'Express Pass Now dentro do parque (US$ 20–30, uma atração).',
      },
      custoEstimadoCasal: { min: 0, max: 0, moeda: 'USD' },
      extras: [
        { nome: 'Power-Up Band',
          custo: { min: 40, max: 40, moeda: 'USD' },
          texto:
            'Comprem se quiserem jogar os desafios interativos da Super Nintendo World. Sem ' +
            'ela, metade da área vira só cenário. Custa ~US$ 40. Decisão pendente — está no ' +
            'checklist de outubro.' },
      ],
    },
    renuncias: null,
  },

  /* ===== 24/11 · TERÇA · BUSCH GARDENS TAMPA ============================ */
  {
    id: 'd-2026-11-24',
    data: '2026-11-24',
    diaSemana: 'terça',
    emoji: '🎢',
    titulo: 'Busch Gardens Tampa',
    subtitulo: 'O melhor conjunto de montanhas-russas da Flórida',
    tipo: 'parque',
    operadora: 'busch',
    parqueId: 'busch-gardens',
    custoZero: false,
    // ATENÇÃO: referência 10h, não 9h. Ver nota abaixo.
    referencia: { rotulo: 'Abertura do parque', padrao: '10:00', confirmado: false },
    resumo:
      'Só de carro, 1h30 de cada lado. Oito montanhas-russas na sequência, safári de verdade ' +
      'à tarde e o parque iluminado à noite. O dia mais pesado fisicamente da viagem.',
    avisos: [
      'Plano de refeição incluso — o mesmo do SeaWorld, do Promo Park.',
    ],
    notas: [
      { tipo: 'atencao', texto:
        'CORREÇÃO DE PREMISSA: era a inconsistência que eu tinha apontado. O aviso geral do ' +
        'documento diz 9h, mas os blocos deste dia (chegada 9h30, Iron Gwazi às 10h) só fecham ' +
        'com abertura às 10h — que é o horário típico do Busch Gardens em novembro. Coloquei a ' +
        'referência em 10h, o que deixa a chegada 30 min antes. Se vocês querem entrar SEMPRE ' +
        'na abertura, considerem antecipar a chegada para 9h15 e a saída do hotel para 6h45.',
        pesquisa: '2026-09-08', verificado: false },
      { tipo: 'atencao', texto:
        'O Christmas Town roda em DATAS SELECIONADAS entre 13/11 e 04/01. 24/11 é terça, na ' +
        'semana de Ação de Graças — provável que esteja aberto, mas confirmem: o bloco das ' +
        '17h15 e a saída às 20h30 dependem disso.', pesquisa: '2026-09-08' },
    ],
    blocos: [
      { id: 'b-2411-0700', hora: '07:00', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair',
        descricao: 'I-4 sentido oeste antes das 8h',
        contexto:
          'A dica de sair antes das 8h é sobre o rush de Orlando na I-4, que é notoriamente ' +
          'congestionada. Depois das 8h, 1h30 vira facilmente 2h15.',
        localId: 'busch-gardens', acesso: [] },

      { id: 'b-2411-0930', hora: '09:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Chegada', descricao: '', localId: 'busch-gardens', acesso: [] },

      { id: 'b-2411-1000', hora: '10:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Iron Gwazi',
        descricao: 'Híbrida, queda de 91°. Uma das melhores do mundo',
        contexto:
          'Estrutura de madeira com trilho de aço, queda de 91° — mais que vertical — e três ' +
          'inversões. Aparece consistentemente no topo das listas mundiais. É a mais intensa ' +
          'do dia e por isso está primeiro.',
        acesso: ['rope-drop', 'standby'] },

      { id: 'b-2411-1045', hora: '10:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'SheiKra',
        descricao: 'Queda vertical de 60 m, com pausa na beirada',
        contexto:
          'Dive coaster: o trem para na beirada por três segundos, pendurado a 60 metros, e ' +
          'depois cai na vertical. A pausa é a parte que assusta.',
        acesso: ['standby'] },

      { id: 'b-2411-1125', hora: '11:25', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Montu',
        descricao: 'Invertida, clássica dos anos 90',
        contexto:
          'Invertida com pés soltos, sete inversões. De 1996 e ainda considerada uma das ' +
          'melhores invertidas já construídas.',
        acesso: ['standby'] },

      { id: 'b-2411-1205', hora: '12:05', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Kumba',
        descricao: '7 inversões, a mais barulhenta',
        contexto:
          'Clássica de 1993, com um loop que passa em volta do próprio trilho. O barulho é ' +
          'marca registrada — dá para ouvir do outro lado do parque.',
        acesso: ['standby'] },

      { id: 'b-2411-1245', hora: '12:45', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Zambia Smokehouse',
        descricao: 'Plano de refeição incluso',
        contexto:
          'Barbecue de balcão com vista para o Sheikra. Costelinha e frango defumado. É o ' +
          'melhor do parque e está coberto pelo plano.',
        restauranteId: 'r-zambia', acesso: [] },

      { id: 'b-2411-1345', hora: '13:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Cheetah Hunt',
        descricao: 'Três lançamentos, percurso longo',
        contexto:
          'Percurso muito longo que sai do parque e volta, rente ao chão, com três lançamentos. ' +
          'Não é assustadora — é a mais "passeio" das grandes daqui.',
        acesso: ['standby'] },

      { id: 'b-2411-1425', hora: '14:25', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Tigris',
        descricao: 'Lançamento para frente e para trás',
        contexto: 'Coaster de lançamento triplo, curta e intensa, com uma queda invertida.',
        acesso: ['standby'] },

      { id: 'b-2411-1505', hora: '15:05', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Phoenix Rising',
        descricao: 'A mais nova do parque',
        contexto:
          'Coaster familiar suspensa, aberta recentemente. Menos intensa que as clássicas, boa ' +
          'para descansar entre as pesadas.',
        acesso: ['standby'] },

      { id: 'b-2411-1540', hora: '15:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Falcon’s Fury',
        descricao: 'Queda livre de 100 m, virado de cara para baixo',
        contexto:
          'Torre de queda que, no topo, inclina os assentos 90° para frente — vocês caem ' +
          'olhando direto para o chão. É a queda mais assustadora da Flórida.',
        acesso: ['standby'] },

      { id: 'b-2411-1615', hora: '16:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Serengeti Plain',
        descricao: 'Girafas, rinocerontes, zebras. Safári de verdade',
        contexto:
          'Planície de 26 hectares com animais soltos, atravessada por trem ou teleférico. ' +
          'Diferente do Kilimanjaro da Disney, aqui o cenário é mais simples e os animais mais ' +
          'próximos.',
        acesso: [] },

      { id: 'b-2411-1715', hora: '17:15', ancora: 'fixo', tipo: 'show',
        titulo: 'Christmas Town',
        descricao: 'Parque iluminado, shows natalinos',
        contexto:
          'O parque inteiro se transforma com milhões de luzes, shows e vilarejo do Papai Noel. ' +
          'Roda em datas selecionadas — confirmem que 24/11 está incluído.',
        acesso: [], confirmarHorario: true },

      { id: 'b-2411-2030', hora: '20:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair',
        descricao: '1h30 de volta',
        contexto:
          'Saindo às 20h30, vocês chegam ao hotel por volta das 22h. Amanhã é dia de compras ' +
          'de manhã e Epic à tarde — dá para dormir.',
        acesso: [] },
    ],
    ficha: {
      multiPass: null, singlePass: null, expressPass: null,
      custoEstimadoCasal: { min: 0, max: 0, moeda: 'USD' },
      extras: [
        { nome: 'Plano de refeição', texto: 'Incluso no Promo Park.' },
        { nome: 'Serengeti Safari (opcional pago)',
          texto:
            'Tour de caminhão que permite alimentar girafas. Vale se sobrar orçamento.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Scorpion' }, { nome: 'Sand Serpent' },
        { nome: 'Congo River Rapids' },
        { nome: 'Stanley Falls',
          motivo: 'Molham, e vocês têm 1h30 de carro na volta' },
      ],
      idioma: null, fechado: [],
    },
  },

  /* ===== 25/11 · QUARTA · COMPRAS E EPIC UNIVERSE (dia 2) =============== */
  {
    id: 'd-2026-11-25',
    data: '2026-11-25',
    diaSemana: 'quarta',
    emoji: '🛒',
    titulo: 'Compras e Epic Universe — dia 2',
    subtitulo: 'Segundo turno · custo zero',
    tipo: 'parque',
    operadora: 'universal',
    parqueId: 'epic-universe',
    custoZero: true,
    entradaExtra: true,
    notaCusto:
      'A segunda entrada no Epic Universe não custa nada: o ingresso de vocês já cobre. É por ' +
      'isso que o dia 23 pôde deixar coisas de fora de propósito.',
    referencia: null,
    resumo:
      'De manhã, compras de Black Friday. À tarde, o parque de novo — de graça, com o ingresso ' +
      'que vocês já têm. Sem pressa de cobrir o mapa: hoje é repetir favorito e ver o que ' +
      'ficou faltando.',
    avisos: [],
    alternativa: {
      titulo: 'Se estiverem exaustos',
      texto:
        'Troquem o parque por um jantar de despedida: Christner’s Prime Steak, Capital Grille ' +
        '(Millenia) ou Bull & Bear (Waldorf Astoria).',
    },
    blocos: [
      { id: 'b-2511-0900', hora: '09:00', ancora: 'fixo', tipo: 'compras',
        titulo: 'Best Buy (Millenia ou I-Drive)',
        descricao: 'Promoções de Black Friday já começam nesta semana',
        contexto:
          'A Black Friday de 2026 cai em 27/11, dois dias depois de vocês irem embora — mas as ' +
          'promoções começam na semana anterior. Eletrônico é onde a diferença de preço para o ' +
          'Brasil é maior.',
        localId: 'best-buy', acesso: [] },

      { id: 'b-2511-1100', hora: '11:00', ancora: 'fixo', tipo: 'compras',
        titulo: 'Outlet, Ross, Marshalls, Walgreens',
        descricao: 'Vitaminas e cosméticos compensam muito',
        contexto:
          'Ross e Marshalls são lojas de ponta de estoque com preços bem abaixo do outlet, mas ' +
          'sem organização — é garimpo. Walgreens é farmácia: vitaminas, cosméticos e ' +
          'suplementos com preço muito abaixo do Brasil.',
        acesso: [] },

      { id: 'b-2511-1300', hora: '13:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Almoço', descricao: '', acesso: [] },

      { id: 'b-2511-1400', hora: '14:00', ancora: 'fixo', tipo: 'tarefa',
        titulo: 'Arrumar as malas',
        descricao: 'Pesem tudo, 23 kg por mala',
        contexto:
          'Façam isso hoje, não amanhã de manhã. Excesso de bagagem no balcão custa caro e ' +
          'amanhã vocês ainda têm que devolver o carro antes do voo.',
        acesso: [], critico: true },

      { id: 'b-2511-1530', hora: '15:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair para o Epic Universe',
        descricao: '', localId: 'epic-universe', acesso: [] },

      { id: 'b-2511-1630', hora: '16:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'O que ficou faltando do dia 23',
        descricao: '',
        contexto:
          'Use a timeline do dia 23 neste app como lista: o que não estiver marcado como feito ' +
          'é exatamente o que sobrou.',
        acesso: [] },

      { id: 'b-2511-1730', hora: '17:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'Repetir os favoritos',
        descricao: 'Agora sem pressa de cobrir o mapa',
        contexto:
          'Sem meta de cobrir mapa: escolham as duas ou três que valeram mais no dia 23 e ' +
          'façam de novo, com calma, sabendo o que vem.',
        acesso: [] },

      { id: 'b-2511-1830', hora: '18:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'Ministry of Magic à noite',
        descricao: 'A área muda completamente no escuro',
        areaParque: 'Ministry of Magic', acesso: [] },

      { id: 'b-2511-1930', hora: '19:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'Super Nintendo World iluminada',
        descricao: 'E as fotos que vocês não pararam para tirar no dia 23',
        areaParque: 'Super Nintendo World', acesso: [] },

      { id: 'b-2511-2100', hora: '21:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair', descricao: 'Voltar ao hotel', acesso: [] },
    ],
    ficha: {
      multiPass: null, singlePass: null,
      expressPass: { usar: false, motivo: 'Segundo dia, sem pressa. Não faz sentido.' },
      custoEstimadoCasal: { min: 0, max: 0, moeda: 'USD' },
      extras: [],
    },
    renuncias: null,
  },

  /* ===== 26/11 · QUINTA · VOLTA ========================================= */
  {
    id: 'd-2026-11-26',
    data: '2026-11-26',
    diaSemana: 'quinta',
    emoji: '✈️',
    titulo: 'Volta',
    subtitulo: 'Thanksgiving',
    tipo: 'logistica',
    operadora: null,
    parqueId: null,
    custoZero: false,
    referencia: null,
    resumo:
      'Thanksgiving. Um dos dias mais tranquilos do ano para voar — o caos é na terça e quarta ' +
      'anteriores e no domingo seguinte.',
    avisos: [
      'Restaurantes fechados no feriado. Comam no aeroporto ou levem algo do hotel.',
    ],
    blocos: [
      { id: 'b-2611-0730', hora: '07:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Café no hotel, últimas conferências', descricao: '', acesso: [] },

      { id: 'b-2611-0830', hora: '08:30', ancora: 'fixo', tipo: 'tarefa',
        titulo: 'Devolver o carro com o tanque cheio',
        descricao: 'A locadora cobra um valor absurdo por litro',
        contexto:
          'Abasteçam num posto fora do aeroporto — os mais próximos das locadoras cobram bem ' +
          'mais caro. Guardem o comprovante.',
        acesso: [], critico: true },

      { id: 'b-2611-0900', hora: '09:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Uber para o MCO', descricao: '~30 min, US$ 35–45',
        localId: 'mco', acesso: [] },

      { id: 'b-2611-0930', hora: '09:30', ancora: 'fixo', tipo: 'tarefa',
        titulo: 'Check-in e imigração',
        descricao: 'Três horas de antecedência para voo internacional',
        localId: 'mco', acesso: [] },

      { id: 'b-2611-1030', hora: '10:30', ancora: 'fixo', tipo: 'compras',
        titulo: 'Duty-free no Terminal C',
        descricao: 'Se sobrar espaço na mala', localId: 'mco', acesso: [] },

      { id: 'b-2611-1200', hora: '12:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Decolagem', descricao: '', localId: 'mco', acesso: [], horaAprox: true },
    ],
    renuncias: null, ficha: null,
  },

  ],

  /* ---------------------------------------------------------------------------
     RESTAURANTES — consolidado a partir dos blocos + Parte 4 do documento
     O status (a reservar / reservado / confirmado / cancelado) e o número de
     confirmação são estado do usuário, não vivem aqui.
     ------------------------------------------------------------------------ */
  restaurantes: [
    { id: 'r-boathouse', nome: 'The Boathouse', data: '2026-11-10', hora: '19:00',
      refeicao: 'jantar', local: 'Disney Springs · The Landing', alternativas: [],
      precisaReserva: true, janelaAbre: '2026-09-11', janelaHora: '06:00 ET',
      canal: 'Disney Springs / OpenTable', blocoId: 'b-1011-1900',
      statusPadrao: 'confirmado', confirmacaoPadrao: '2111918775',
      nota: 'RESERVADO em 08/09 — confirmação 2111918775. Frutos do mar e carnes na ' +
            'beira da água. Cheguem 15 min antes; a fila de check-in do restaurante ' +
            'anda devagar quando o Springs está cheio.' },

    { id: 'r-columbia-harbour', nome: 'Columbia Harbour House', data: '2026-11-11',
      hora: '12:30', refeicao: 'almoco', local: 'Magic Kingdom · Liberty Square',
      alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo My Disney Experience', blocoId: 'b-1111-1230',
      nota: 'DECIDIDO em 08/09: parque corrido, almoço de balcão sem reserva. Peixe e ' +
            'sanduíches. Subam para o segundo andar — quase ninguém acha, e é o lugar ' +
            'mais silencioso do Magic Kingdom. Liberty Tree Tavern e Skipper Canteen ' +
            'ficaram de fora.' },

    { id: 'r-caseys', nome: 'Casey’s Corner', data: '2026-11-11', hora: '17:45',
      refeicao: 'jantar', local: 'Magic Kingdom · Main Street', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo My Disney Experience', blocoId: 'b-1111-1745',
      nota: 'DECIDIDO em 08/09: escolhido pela experiência do pianista, que toca na porta ' +
            'ao ar livre. Usem mobile order e comam nas mesas de fora, de frente para o ' +
            'piano — comer dentro perde o motivo da escolha.' },

    { id: 'r-satuli', nome: 'Satu’li Canteen', data: '2026-11-13', hora: '12:15',
      refeicao: 'almoco', local: 'Animal Kingdom · Pandora', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo My Disney Experience', blocoId: 'b-1311-1215',
      nota: 'Balcão. Eleito o melhor quick service do Walt Disney World.' },

    { id: 'r-nomad', nome: 'Nomad Lounge', data: '2026-11-13', hora: '16:30',
      refeicao: 'drink', local: 'Animal Kingdom · Discovery Island', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Lista de espera no local', blocoId: 'b-1311-1630',
      nota: 'Não aceita reserva. Espera de 15 a 30 min no fim da tarde.' },

    { id: 'r-sanaa', nome: 'Sanaa', data: '2026-11-13', hora: '19:45',
      refeicao: 'jantar', local: 'Animal Kingdom Lodge', alternativas: [],
      precisaReserva: true, janelaAbre: '2026-09-14', janelaHora: '06:00 ET',
      canal: 'My Disney Experience', blocoId: 'b-1311-1945',
      nota: 'Peçam mesa na janela: girafas e zebras. Não é dentro do parque.' },

    { id: 'r-columbia', nome: 'Columbia Restaurant', data: '2026-11-14', hora: '12:30',
      refeicao: 'almoco', local: 'Celebration · Market Street', alternativas: [],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'Site do restaurante / OpenTable', blocoId: 'b-1411-1230',
      nota: 'Peçam o 1905 Salad, preparado na mesa, e o sanduíche cubano.' },

    { id: 'r-toothsome', nome: 'Toothsome Chocolate Emporium', data: '2026-11-14', hora: '21:00',
      refeicao: 'jantar', local: 'Universal CityWalk', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Lista de espera no local', blocoId: 'b-1411-2100',
      nota: 'Não aceita reserva. Espera passa de 1h no fim de semana — entrem na lista cedo.' },

    { id: 'r-docking-bay', nome: 'Docking Bay 7', data: '2026-11-15', hora: '12:15',
      refeicao: 'almoco', local: 'Hollywood Studios · Galaxy’s Edge', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo My Disney Experience', blocoId: 'b-1511-1215',
      nota: 'Balcão temático de Batuu.' },

    { id: 'r-ogas', nome: 'Oga’s Cantina', data: '2026-11-15', hora: '17:15',
      refeicao: 'drink', local: 'Hollywood Studios · Galaxy’s Edge', alternativas: [],
      precisaReserva: true, janelaAbre: '2026-09-16', janelaHora: '06:00 ET',
      canal: 'My Disney Experience', blocoId: 'b-1511-1715',
      nota: 'Limite de 45 min por grupo. Quase impossível entrar sem reserva.' },

    { id: 'r-scifi', nome: 'Sci-Fi Dine-In Theater', data: '2026-11-15', hora: '18:15',
      refeicao: 'jantar', local: 'Hollywood Studios · Commissary Lane', alternativas: [],
      precisaReserva: true, janelaAbre: '2026-09-16', janelaHora: '06:00 ET',
      canal: 'My Disney Experience', blocoId: 'b-1511-1815',
      nota: 'Mesas em formato de carro num drive-in cenográfico.' },

    { id: 'r-epcot-mesa', nome: 'Epcot — mesa (opcional)', data: '2026-11-16', hora: null,
      refeicao: 'jantar', local: 'Epcot · World Showcase', alternativas: [],
      precisaReserva: true, janelaAbre: '2026-09-17', janelaHora: '06:00 ET',
      canal: 'My Disney Experience', blocoId: null,
      nota: 'Só se quiserem mesa em vez das barracas do Food & Wine. O plano do dia é barraca.' },

    { id: 'r-leaky', nome: 'Leaky Cauldron', data: '2026-11-17', hora: '12:45',
      refeicao: 'almoco', local: 'Universal Studios · Diagon Alley', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo app da Universal', blocoId: 'b-1711-1245',
      nota: 'Bangers and mash, fish and chips. O melhor quick service da Universal.' },

    { id: 'r-finnegans', nome: 'Finnegan’s Bar & Grill', data: '2026-11-17', hora: '18:00',
      refeicao: 'jantar', local: 'Universal Studios · New York',
      alternativas: ['CityWalk'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: null, blocoId: 'b-1711-1800', nota: null },

    { id: 'r-broomsticks', nome: 'Three Broomsticks', data: '2026-11-19', hora: '12:40',
      refeicao: 'almoco', local: 'Islands of Adventure · Hogsmeade', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo app da Universal', blocoId: 'b-1911-1240',
      nota: 'Costelinha e frango assado. Combo serve dois com folga.' },

    { id: 'r-mythos', nome: 'Mythos', data: '2026-11-19', hora: '18:30',
      refeicao: 'jantar', local: 'Islands of Adventure · The Lost Continent',
      alternativas: [],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'App / site da Universal Orlando', blocoId: 'b-1911-1830',
      nota: 'Reserva recomendada — confirmado em 08/09. Já eleito o melhor restaurante de ' +
            'parque temático do mundo.' },

    { id: 'r-homecomin', nome: 'Homecomin’', data: '2026-11-21', hora: '20:00',
      refeicao: 'jantar', local: 'Disney Springs · Town Center',
      alternativas: ['Polite Pig'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'Site do restaurante / OpenTable', blocoId: 'b-2111-2000',
      nota: 'Frango frito. O mais concorrido de Disney Springs — 1h de espera sem reserva. ' +
            'Polite Pig é a alternativa de balcão, sem espera.' },

    { id: 'r-sharks', nome: 'Sharks Underwater Grill', data: '2026-11-22', hora: '18:30',
      refeicao: 'jantar', local: 'SeaWorld', alternativas: [],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'Direto no site do parque', blocoId: 'b-2211-1830',
      nota: 'Mesas coladas no tanque de tubarões. Prazo médio (outubro). ' +
            'Provavelmente NÃO está coberto pelo plano de refeição — confirmem.' },

    { id: 'r-toadstool', nome: 'Toadstool Cafe', data: '2026-11-23', hora: '12:45',
      refeicao: 'almoco', local: 'Epic Universe · Super Nintendo World', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Lista virtual pelo app da Universal', blocoId: 'b-2311-1245',
      nota: 'Não aceita reserva: lista virtual pelo app, e ela fecha antes do meio-dia. ' +
            'Entrem na lista às 10h.' },

    { id: 'r-atlantic', nome: 'Atlantic', data: '2026-11-23', hora: '18:20',
      refeicao: 'jantar', local: 'Epic Universe · Celestial Park',
      alternativas: ['Mead Hall (Isle of Berk)'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'App / site da Universal Orlando', blocoId: 'b-2311-1820',
      nota: 'Reserva marcada como necessária por decisão de vocês — obriga a revisitar e ' +
            'confirmar, mesmo que na prática aceite walk-in.' },

    { id: 'r-zambia', nome: 'Zambia Smokehouse', data: '2026-11-24', hora: '12:45',
      refeicao: 'almoco', local: 'Busch Gardens Tampa', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: null, blocoId: 'b-2411-1245',
      nota: 'Coberto pelo plano de refeição do Promo Park.' },
  ],

  /* ---------------------------------------------------------------------------
     CHECKLIST PRÉ-VIAGEM — Parte 4 do documento + itens novos
     ------------------------------------------------------------------------ */
  checklist: [

    /* --- prazo curto (setembro) --- */
    { id: 'ck-0911', grupo: 'prazo-curto', dataAlvo: '2026-09-11', hora: '06:00', fuso: 'ET',
      janelaReserva: true, critico: false, feitoPadrao: true,
      texto: 'The Boathouse (10/11) — RESERVADO, confirmação 2111918775',
      restauranteIds: ['r-boathouse'] },

    { id: 'ck-1209', grupo: 'prazo-curto', dataAlvo: '2026-09-12', hora: '06:00', fuso: 'ET',
      janelaReserva: false, critico: false, feitoPadrao: true,
      texto: 'Magic Kingdom — DISPENSADA. Almoço e jantar do dia 11 viraram balcão ' +
             '(Columbia Harbour House e Casey’s), sem reserva. A janela de 12/09 caiu.',
      restauranteIds: ['r-columbia-harbour'] },

    { id: 'ck-1409', grupo: 'prazo-curto', dataAlvo: '2026-09-14', hora: '06:00', fuso: 'ET',
      janelaReserva: true, critico: false,
      texto: 'Reservar Sanaa para o jantar de 13/11 (janela de 60 dias)',
      restauranteIds: ['r-sanaa'] },

    { id: 'ck-1609', grupo: 'prazo-curto', dataAlvo: '2026-09-16', hora: '06:00', fuso: 'ET',
      janelaReserva: true, critico: false,
      texto: 'Hollywood Studios: Oga’s Cantina e Sci-Fi Dine-In',
      restauranteIds: ['r-ogas', 'r-scifi'] },

    { id: 'ck-1709', grupo: 'prazo-curto', dataAlvo: '2026-09-17', hora: '06:00', fuso: 'ET',
      janelaReserva: true, critico: false,
      texto: 'Epcot, se quiserem mesa em vez das barracas',
      restauranteIds: ['r-epcot-mesa'] },

    { id: 'ck-ingresso', grupo: 'prazo-curto', dataAlvo: '2026-09-15', dataEstimada: true, motivoData: 'Bloqueia o plano de Lightning Lane inteiro', hora: null, fuso: null,
      janelaReserva: false, critico: true,
      texto: 'Confirmar com a agência a regra exata de validade do ingresso Disney de 4 dias',
      nota:
        'Virou a pendência mais importante da lista. Se o ingresso for date-based, o Multi ' +
        'Pass dos 4 dias sai numa compra só em 08/11. Se não for, são quatro compras separadas. ' +
        'Isso muda as quatro tarefas de Lightning Lane deste checklist.',
      restauranteIds: [] },

    { id: 'ck-shuttle', grupo: 'prazo-curto', dataAlvo: '2026-10-06', dataEstimada: true,
      motivoData: 'Junto com a reserva do carro, para decidir transporte de uma vez',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Confirmar o transfer gratuito do hotel para Magic Kingdom e Hollywood Studios',
      nota:
        'O Travelodge anuncia shuttle cortesia para os dois parques. Se o horário servir, ' +
        'economiza Uber nos dias 11 e 15. ATENÇÃO: shuttle de hotel quase sempre chega ' +
        'depois da abertura e tem volta em horário fixo — provavelmente NÃO serve para o ' +
        'rope drop das 9h, que é a estratégia dos dois dias. Vale confirmar o horário real ' +
        'antes de contar com ele. Se a primeira saída for depois das 7h30, ignorem.',
      restauranteIds: [] },

    { id: 'ck-carro', grupo: 'prazo-curto', dataAlvo: '2026-10-06', dataEstimada: true, motivoData: 'Preço de locadora sobe perto da data', hora: null, fuso: null,
      janelaReserva: false, critico: true,
      texto: 'Reservar o carro para 20 a 25/11, em filial de bairro na 192',
      restauranteIds: [] },

    { id: 'ck-columbia', grupo: 'prazo-curto', dataAlvo: '2026-10-15', dataEstimada: true, motivoData: '30 dias antes do almoço de 14/11', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar o Columbia Restaurant para o almoço de 14/11 (Celebration)',
      restauranteIds: ['r-columbia'] },

    { id: 'ck-boggy', grupo: 'prazo-curto', dataAlvo: '2026-10-21', dataEstimada: true, motivoData: '30 dias antes do passeio de 20/11', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar o Boggy Creek Airboat online para 20/11',
      restauranteIds: [] },

    /* --- prazo médio (outubro) --- */
    { id: 'ck-sharks', grupo: 'prazo-medio', dataAlvo: '2026-10-01', dataEstimada: true, motivoData: 'O documento situa em outubro', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar Sharks Underwater Grill (SeaWorld, direto no site do parque)',
      restauranteIds: ['r-sharks'] },

    { id: 'ck-mythos', grupo: 'prazo-medio', dataAlvo: '2026-10-20', dataEstimada: true, motivoData: '30 dias antes do jantar de 19/11', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar o Mythos para o jantar de 19/11 (Islands of Adventure)',
      restauranteIds: ['r-mythos'] },

    { id: 'ck-atlantic', grupo: 'prazo-medio', dataAlvo: '2026-10-24', dataEstimada: true, motivoData: '30 dias antes do jantar de 23/11', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar o Atlantic para o jantar de 23/11 (Epic Universe)',
      nota: 'Marcado como reserva necessária por decisão de vocês, para forçar a revisitar ' +
            'e confirmar — mesmo que na prática aceite walk-in.',
      restauranteIds: ['r-atlantic'] },

    { id: 'ck-powerband', grupo: 'prazo-medio', dataAlvo: '2026-10-15', dataEstimada: true, motivoData: 'O documento situa em outubro', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Decidir sobre a Power-Up Band do Epic Universe (~US$ 40)',
      restauranteIds: [] },

    { id: 'ck-natal-datas', grupo: 'prazo-medio', dataAlvo: '2026-10-15', dataEstimada: true, motivoData: 'As datas dos eventos saem com antecedência', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Confirmar que 22/11 tem Christmas Celebration (SeaWorld) e 24/11 tem ' +
             'Christmas Town (Busch Gardens) — ambos rodam em datas selecionadas',
      restauranteIds: [] },

    /* --- já em Orlando --- */
    { id: 'ck-ll-0811', grupo: 'ja-em-orlando', dataAlvo: '2026-11-08', hora: '07:00', fuso: 'ET',
      janelaReserva: false, critico: true,
      texto: 'Lightning Lane — Magic Kingdom (11/11): Multi Pass + Single Pass do Seven Dwarfs',
      nota: 'Com a lista deste app aberta. Vocês têm ~5 min antes de o sistema soltar as seleções.',
      restauranteIds: [] },

    { id: 'ck-ll-1011', grupo: 'ja-em-orlando', dataAlvo: '2026-11-10', hora: '07:00', fuso: 'ET',
      janelaReserva: false, critico: true,
      texto: 'Lightning Lane — Single Pass do Flight of Passage (para 13/11)',
      nota: 'Só necessário se o ingresso NÃO for date-based. Confirmem com a agência antes.',
      restauranteIds: [] },

    { id: 'ck-ll-1211', grupo: 'ja-em-orlando', dataAlvo: '2026-11-12', hora: '07:00', fuso: 'ET',
      janelaReserva: false, critico: true,
      texto: 'Lightning Lane — Single Pass do Rise of the Resistance (para 15/11)',
      nota: 'Peçam janela até as 11h. Só necessário se o ingresso NÃO for date-based.',
      restauranteIds: [] },

    { id: 'ck-ll-1311', grupo: 'ja-em-orlando', dataAlvo: '2026-11-13', hora: '07:00', fuso: 'ET',
      janelaReserva: false, critico: true,
      texto: 'Lightning Lane — Single Pass do Cosmic Rewind (para 16/11)',
      nota: 'Só necessário se o ingresso NÃO for date-based.',
      restauranteIds: [] },

    { id: 'ck-horarios', grupo: 'ja-em-orlando', dataAlvo: '2026-10-10', dataEstimada: true, motivoData: 'A Disney publica os horários ~60 dias antes', hora: null, fuso: null,
      janelaReserva: false, critico: true,
      texto: 'Conferir horários oficiais dos parques e ajustar a referência de cada dia',
      nota: 'É só editar o horário de abertura no dia — os blocos ancorados deslocam sozinhos.',
      restauranteIds: [] },

    { id: 'ck-shows', grupo: 'ja-em-orlando', dataAlvo: '2026-11-01', dataEstimada: true, motivoData: 'Horários de show só saem perto da data', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Confirmar horário do Grinchmas (14/11), do desfile da Macy’s (17/11) e do ' +
             'Fantasmic! (15/11)',
      nota: 'O Grinchmas é a referência do dia 14 — ajustando ele, a noite inteira desloca.',
      restauranteIds: [] },
  ],

  /* ---------------------------------------------------------------------------
     LOCAIS
     ATENÇÃO: todas as coordenadas têm verificado:false. São aproximações de
     conhecimento público, não do documento. Confira antes de confiar no pin.
     Tempos com fonte:'documento' vieram do roteiro; 'estimado' são meus.
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
      nota: 'CORRIGIDO em 09/09. O documento indicava a loja da 1471 E Osceola Pkwy, que ' +
            'fica a 11,1 km do hotel. Esta fica a 1,5 km — 4 minutos de carro. Mesma ' +
            'bandeira, mesmo sortimento, sete vezes mais perto.' },

    { id: 'magic-kingdom', nome: 'Magic Kingdom', tipo: 'parque',
      lat: 28.41861111, lng: -81.58111111, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 30, tempoFonte: 'estimado',
                 uberUSD: { min: 22, max: 32 }, uberFonte: 'estimado' },
      nota: 'O Uber não deixa aqui. Deixa no TTC.' },

    { id: 'mk-ttc', nome: 'Ticket & Transportation Center (TTC)', tipo: 'transporte',
      lat: 28.4060892, lng: -81.5804985, verificado: true, fonteCoord: 'osm', endereco: null,
      doHotel: { tempoMin: 30, tempoFonte: 'estimado',
                 uberUSD: { min: 22, max: 32 }, uberFonte: 'estimado' },
      nota: 'É aqui que o Uber deixa. Do TTC ainda são 15–20 min de monotrilho ou barco.' },

    { id: 'animal-kingdom', nome: 'Disney’s Animal Kingdom', tipo: 'parque',
      lat: 28.358, lng: -81.59, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 25, tempoFonte: 'estimado',
                 uberUSD: { min: 20, max: 30 }, uberFonte: 'estimado' } },

    { id: 'ak-lodge', nome: 'Animal Kingdom Lodge (Sanaa)', tipo: 'restaurante',
      lat: 28.353637, lng: -81.602756, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 25, tempoFonte: 'estimado',
                 uberUSD: { min: 20, max: 30 }, uberFonte: 'estimado' },
      nota: 'Não é dentro do parque. É outro endereço.' },

    { id: 'hollywood-studios', nome: 'Disney’s Hollywood Studios', tipo: 'parque',
      lat: 28.3575, lng: -81.56, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 25, tempoFonte: 'estimado',
                 uberUSD: { min: 20, max: 30 }, uberFonte: 'estimado' } },

    { id: 'epcot', nome: 'Epcot', tipo: 'parque',
      lat: 28.371, lng: -81.55, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 25, tempoFonte: 'estimado',
                 uberUSD: { min: 20, max: 30 }, uberFonte: 'estimado' } },

    { id: 'disney-springs', nome: 'Disney Springs', tipo: 'compras',
      lat: 28.3702539, lng: -81.5209851, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 20, tempoFonte: 'documento',
                 uberUSD: { min: 15, max: 25 }, uberFonte: 'estimado' },
      nota: 'Estacionamento gratuito — no dia 21 vocês vão de carro.' },

    { id: 'universal-studios', nome: 'Universal Studios Florida', tipo: 'parque',
      lat: 28.4752, lng: -81.467, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 33, tempoFonte: 'documento',
                 uberUSD: { min: 28, max: 40 }, uberFonte: 'estimado' },
      nota: 'Documento: 30–35 min de Kissimmee. Do estacionamento à catraca são +15–20 min a pé.' },

    { id: 'islands-of-adventure', nome: 'Islands of Adventure', tipo: 'parque',
      lat: 28.47166667, lng: -81.47138889, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 33, tempoFonte: 'documento',
                 uberUSD: { min: 28, max: 40 }, uberFonte: 'estimado' } },

    { id: 'citywalk', nome: 'Universal CityWalk', tipo: 'compras',
      lat: 28.4733226, lng: -81.466124, verificado: true, fonteCoord: 'osm', endereco: null,
      doHotel: { tempoMin: 30, tempoFonte: 'documento',
                 uberUSD: { min: 28, max: 40 }, uberFonte: 'estimado' } },

    { id: 'epic-universe', nome: 'Universal Epic Universe', tipo: 'parque',
      lat: 28.4422, lng: -81.449, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 30, tempoFonte: 'documento',
                 uberUSD: { min: 25, max: 38 }, uberFonte: 'estimado' },
      nota: 'Dia 23 e 25 vocês vão de carro. A caminhada do estacionamento é longa.' },

    { id: 'seaworld', nome: 'SeaWorld Orlando', tipo: 'parque',
      lat: 28.41083333, lng: -81.4625, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 25, tempoFonte: 'estimado',
                 uberUSD: { min: 22, max: 32 }, uberFonte: 'estimado' } },

    { id: 'busch-gardens', nome: 'Busch Gardens Tampa Bay', tipo: 'parque',
      lat: 28.0375, lng: -82.4225, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 90, tempoFonte: 'documento',
                 uberUSD: null, uberFonte: null },
      nota: 'Só de carro. 1h30 de cada lado. Uber não é opção viável aqui.' },

    { id: 'premium-outlets', nome: 'Orlando International Premium Outlets', tipo: 'compras',
      lat: 28.4750673, lng: -81.4514825, verificado: true, fonteCoord: 'osm', endereco: '4951 International Dr',
      doHotel: { tempoMin: 25, tempoFonte: 'documento',
                 uberUSD: { min: 20, max: 30 }, uberFonte: 'estimado' },
      nota: 'Peçam o cupom book grátis no balcão de informações.' },

    { id: 'icon-park', nome: 'ICON Park', tipo: 'compras',
      lat: 28.4432, lng: -81.4693, verificado: true, fonteCoord: 'wikipedia', endereco: '8375 International Dr',
      doHotel: { tempoMin: 25, tempoFonte: 'estimado',
                 uberUSD: { min: 20, max: 30 }, uberFonte: 'estimado' } },

    { id: 'millenia', nome: 'The Mall at Millenia', tipo: 'compras',
      lat: 28.48538, lng: -81.431312, verificado: true, fonteCoord: 'wikipedia', endereco: '4200 Conroy Rd',
      doHotel: { tempoMin: 30, tempoFonte: 'documento',
                 uberUSD: { min: 28, max: 40 }, uberFonte: 'estimado' } },

    { id: 'best-buy', nome: 'Best Buy (Millenia ou I-Drive)', tipo: 'compras',
      lat: 28.4830, lng: -81.4290, verificado: false, fonteCoord: null, precisaColar: 'O documento diz "Millenia ou I-Drive" — são duas lojas. Escolha uma e cole a coordenada.', endereco: null,
      doHotel: { tempoMin: 30, tempoFonte: 'estimado',
                 uberUSD: { min: 28, max: 40 }, uberFonte: 'estimado' } },

    { id: 'lake-eola', nome: 'Lake Eola Park', tipo: 'livre',
      lat: 28.54361111, lng: -81.37277778, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 35, tempoFonte: 'estimado',
                 uberUSD: { min: 32, max: 45 }, uberFonte: 'estimado' },
      nota: 'Grátis. 10 min do Kia Center. Melhor pôr do sol da cidade.' },

    { id: 'kia-center', nome: 'Kia Center', tipo: 'evento',
      lat: 28.53916667, lng: -81.38361111, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 35, tempoFonte: 'estimado',
                 uberUSD: { min: 32, max: 45 }, uberFonte: 'estimado' },
      nota: 'Não permite mochila. Bolsa pequena. Andem 2 quarteirões antes de chamar o Uber ' +
            'na saída — a tarifa dinâmica é brutal.' },

    { id: 'celebration', nome: 'Celebration', tipo: 'livre',
      lat: 28.31027778, lng: -81.55083333, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 10, tempoFonte: 'documento',
                 uberUSD: { min: 10, max: 15 }, uberFonte: 'documento' } },

    { id: 'boggy-creek', nome: 'Boggy Creek Airboat Adventures', tipo: 'atracao',
      lat: 28.1394935, lng: -81.3622451, verificado: true, fonteCoord: 'osm', endereco: '2001 E Southport Rd',
      doHotel: { tempoMin: 20, tempoFonte: 'documento',
                 uberUSD: { min: 18, max: 28 }, uberFonte: 'estimado' } },

    { id: 'lakefront-park', nome: 'Kissimmee Lakefront Park', tipo: 'livre',
      lat: 28.2891459, lng: -81.4068058, verificado: true, fonteCoord: 'osm', endereco: 'Lake Tohopekaliga',
      doHotel: { tempoMin: 15, tempoFonte: 'estimado',
                 uberUSD: { min: 12, max: 20 }, uberFonte: 'estimado' },
      nota: 'Grátis.' },

    { id: 'old-town', nome: 'Old Town Kissimmee', tipo: 'livre',
      lat: 28.33161, lng: -81.515838, verificado: true, fonteCoord: 'wikipedia',
      endereco: '5770 W Irlo Bronson Memorial Hwy',
      doHotel: { tempoMin: 10, tempoFonte: 'estimado',
                 uberUSD: { min: 10, max: 15 }, uberFonte: 'estimado' },
      nota: 'Entrada e estacionamento gratuitos.' },

    { id: 'winter-garden', nome: 'Winter Garden — Downtown Pavilion', tipo: 'livre',
      lat: 28.5647018, lng: -81.5877242, verificado: true, fonteCoord: 'osm', endereco: '104 S. Lakeview Ave',
      doHotel: { tempoMin: 40, tempoFonte: 'documento',
                 uberUSD: null, uberFonte: null },
      nota: 'De carro. Farmers Market das 8h às 13h, só aos sábados.' },
  ],

  /* ---------------------------------------------------------------------------
     DICAS E RECOMENDAÇÕES — conteúdo de leitura, sem interação
     ------------------------------------------------------------------------ */
  dicas: [
    {
      id: 'dica-lockers',
      categoria: 'universal',
      titulo: 'Lockers obrigatórios: reserve 10 a 15 min a mais',
      corpo:
        'Guardar e buscar o locker come tempo real que o roteiro não previu. Em dias como 19/11 ' +
        'e 23/11, com várias dessas seguidas, isso pode custar mais de uma hora somada.\n\n' +
        'Detector de metal — absolutamente nada nos bolsos, nem celular:\n' +
        'Hulk · VelociCoaster · Stardust Racers · Revenge of the Mummy\n\n' +
        'Locker obrigatório, com mais tolerância:\n' +
        'Hagrid\u2019s · Forbidden Journey · Escape from Gringotts · Men in Black · ' +
        'Monsters Unchained · Hiccup\u2019s Wing Gliders\n\n' +
        'Padrão é grátis pelo tempo da fila + atração. O grande custa US$ 2 a 3. ' +
        'Estratégia: levem o mínimo possível nesses dias. Quanto menos bagagem, menos locker.',
      pesquisa: '2026-09-08',
    },
    {
      id: 'dica-molha',
      categoria: 'geral',
      titulo: 'O que molha de verdade',
      corpo:
        'Novembro em Orlando é ameno, e roupa molhada às 17h fica desconfortável rápido quando ' +
        'escurece. As atrações marcadas com o selo "molha" neste app são:\n\n' +
        'Jurassic Park River Adventure (19/11) — molha bastante, o documento recomenda capa\n' +
        'Journey to Atlantis (22/11) — molha bastante\n' +
        'Fyre Drill (23/11) — interativo, molha\n' +
        'Tiana\u2019s Bayou Adventure (11/11) — queda com respingo\n\n' +
        'O documento já eliminou por esse motivo: Infinity Falls (SeaWorld), Popeye e ' +
        'Dudley Do-Right (Islands), Congo River Rapids e Stanley Falls (Busch).\n\n' +
        'Capa de chuva descartável custa ~US$ 1 no Walmart do dia 10 e ~US$ 10 dentro do parque.',
    },
    {
      id: 'dica-gorjeta',
      categoria: 'geral',
      titulo: 'Gorjeta e imposto: o preço na etiqueta não é o preço final',
      corpo:
        'Duas coisas que confundem brasileiro e aparecem em toda conta da viagem.\n\n' +
        'IMPOSTO. O preço exposto nunca inclui o sales tax. Em Orlando (Orange County) fica em ' +
        'torno de 6,5%, e em Kissimmee (Osceola) por volta de 7,5%. Só aparece no caixa.\n\n' +
        'GORJETA. Em restaurante com garçom, 18 a 20% é o esperado e faz parte do salário da ' +
        'pessoa, não é opcional na prática. Muita casa já traz sugestões impressas na conta, e ' +
        'grupos grandes às vezes têm gratuity incluída — confira antes de somar duas vezes.\n\n' +
        'Onde NÃO se dá gorjeta: balcão de fast food e mobile order. Ou seja, Satu\u2019li Canteen, ' +
        'Docking Bay 7, Three Broomsticks e Toadstool Cafe não levam gorjeta.\n\n' +
        'Onde se dá: The Boathouse, Columbia, Sanaa, Sci-Fi Dine-In, Oga\u2019s, Mythos, ' +
        'Sharks Underwater Grill, Homecomin\u2019, e o Uber (opcional, mas comum).',
    },
    {
      id: 'dica-rope-drop',
      categoria: 'geral',
      titulo: 'Como o rope drop funciona na prática',
      corpo:
        'A regra número 1 do documento é a mais importante e a que mais gente executa errado.\n\n' +
        'Chegar "na abertura" não é chegar às 9h. É estar dentro do portão às 9h — o que ' +
        'significa chegar 45 minutos antes, passar segurança, passar catraca, e estar de pé no ' +
        'ponto certo do parque quando soltarem.\n\n' +
        'No Magic Kingdom há um agravante: o Uber deixa vocês no TTC, e ainda falta monotrilho ' +
        'ou barco. Por isso o documento manda sair do hotel às 6h45 para uma abertura às 9h.\n\n' +
        'Onde ficar de pé enquanto espera define o que vocês fazem primeiro. O documento já diz ' +
        'em cada dia: Frontierland no MK, à esquerda sentido Hogsmeade no Islands, ' +
        'Galaxy\u2019s Edge no Hollywood Studios, Beco Diagonal no Universal Studios.\n\n' +
        'Vocês não têm Early Entry em lugar nenhum: não estão em hotel Disney nem Universal. ' +
        'Então o lugar na fila é literalmente tudo que vocês têm.',
    },
    {
      id: 'dica-natal',
      categoria: 'geral',
      titulo: 'A decoração de Natal e por que a ordem dos dias importa',
      corpo:
        'A viagem atravessa a virada da temporada de Natal, e isso foi usado de propósito no ' +
        'roteiro.\n\n' +
        'DISNEY: decoração já montada quando vocês chegam. Mickey\u2019s Very Merry Christmas ' +
        'Party rola em noites selecionadas a partir de 08/11, e vocês decidiram não ir.\n\n' +
        'UNIVERSAL: a temporada começa exatamente em 14/11 — o dia em que vocês entram no ' +
        'Islands à noite. Vocês pegam a primeira noite da temporada.\n\n' +
        'DISNEY SPRINGS: no dia 10 ainda não tem decoração. Por isso vocês voltam no dia 21, ' +
        'para o Christmas Tree Stroll. É de graça e é literalmente outro lugar.\n\n' +
        'SEAWORLD e BUSCH: Christmas Celebration e Christmas Town rodam em datas selecionadas ' +
        'a partir de 06/11 e 13/11. Confirmem que 22/11 e 24/11 estão na lista.',
      pesquisa: '2026-09-08',
    },
    {
      id: 'dica-vazio-proposital',
      categoria: 'geral',
      titulo: 'Os blocos VAZIO PROPOSITAL não são falha de planejamento',
      corpo:
        'Existem quatro blocos assim no roteiro: 12/11 às 14h30, 14/11 às 9h, 20/11 às 14h e ' +
        '21/11 às 15h.\n\n' +
        'Eles estão ali porque a segunda metade da viagem é mais pesada que a primeira: ' +
        '19/11 Islands, 22/11 SeaWorld, 23/11 Epic, 24/11 Busch Gardens com 3h de carro e ' +
        '25/11 Epic de novo. Chegar destruído no dia 23 transforma o melhor parque de Orlando ' +
        'em arrastar-se.\n\n' +
        'Resistam à tentação de encaixar coisa neles.',
    },
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
  const M = R.meta;

  const paraMin = (h) => {
    if (!/^\d{2}:\d{2}$/.test(h || '')) return null;
    const [a, b] = h.split(':').map(Number);
    return a * 60 + b;
  };

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
    (d.listas || []).forEach((l) => {
      if (!(l.itens || []).length) erros.push(`dia ${d.data}: lista ${l.id} vazia`);
    });
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
    (c.restauranteIds || []).forEach((rid) => {
      if (!idsRest.has(rid)) erros.push(`checklist ${c.id}: restaurante "${rid}" não existe`);
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
