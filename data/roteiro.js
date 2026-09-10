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
      'Os horários oficiais dos parques só saem perto da data. Os relógios deste ' +
      'roteiro assumem abertura às 9h, com três exceções anotadas: o ANIMAL KINGDOM ' +
      'às 8h (13/11), e o SeaWorld e o Busch Gardens às 10h. Confiram em novembro e ' +
      'ajustem a referência do dia — os blocos ancorados deslocam junto, mas as retas ' +
      'finais dos dias 11 e 13 são fixas de propósito e não se mexem.',

    // Vocabulários fechados. A interface valida contra isto no load.
    tiposBloco: ['atracao', 'refeicao', 'deslocamento', 'show', 'compras',
                 'espera', 'tarefa', 'livre', 'vazio', 'pausa'],
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
          singlePass: 'Nenhum — os dois viraram plano B pago', custo: { min: 40, max: 70 } },
        { data: '2026-11-13', parque: 'Animal Kingdom',    multiPass: 'Não',
          singlePass: 'Flight of Passage — só se o fim de dia não resolver', custo: { min: 0, max: 40 } },
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
            'A antecedência depende de onde vocês estão hospedados. No Travelodge, que é ' +
            'fora dos hotéis Disney, a janela é de 3 dias, não 7.\n\n' +
            'MULTI PASS: se o ingresso de 4 dias for date-based (datas fixas), dá para comprar ' +
            '3 dias antes do primeiro dia do ingresso e cobrir os 4 dias de uma vez — aí 08/11 ' +
            'compra de 08/11 resolve os quatro dias de uma vez.\n\n' +
            'SINGLE PASS: a regra é 3 dias antes de CADA visita — mas a lista encolheu. ' +
            'Depois de refazer os dias 11 e 13, sobraram DOIS momentos, não quatro:\n' +
            '  · Seven Dwarfs e TRON (11/11) → NÃO COMPRAR. Viraram plano B pago, ' +
            'resolvidos por janela de horário dentro do parque.\n' +
            '  · Flight of Passage (13/11) → só se o fim de dia não resolver. Decisão, ' +
            'não alarme.\n' +
            '  · Rise of the Resistance (15/11) → comprar 12/11\n' +
            '  · Cosmic Rewind (16/11) → comprar 13/11\n\n' +
            'Os dias 15 e 16 ainda não foram refeitos com essa mesma lente. Quando forem, ' +
            'a lista pode encolher de novo.\n\n' +
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
      'no dia 21, quando estiver decorado de Natal.',

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
        gatilho: 'Vocês saem do Terminal C até as 14h15.',
        passos: [
          'Uber para o hotel, deixar malas, check-in se já liberou.',
          'Walmart com calma — a lista completa, 45 min. Fica a 4 min do hotel.',
          'Comer alguma coisa ao voltar — vocês não comem desde o avião.',
          'Disney Springs às 17h15, com 1h45 antes do jantar.',
          'The Boathouse 19h. Voltar 21h.',
        ],
      },
      {
        letra: 'B',
        titulo: 'Imigração demorou',
        gatilho: 'Vocês saem do Terminal C entre 14h15 e 16h00.',
        passos: [
          'Corta o Walmart para o essencial: água, protetor solar, ibuprofeno e barrinhas. ' +
          '20 minutos, sem passear pelos corredores. A volta ao hotel continua ' +
          'obrigatória, senão vocês carregam o fardo a noite inteira — mas agora são só ' +
          '8 minutos de carro no total, então cabe mesmo com o dia atrasado.',
          'O resto da lista vai para o dia 12, que é dia de outlet na I-Drive e comporta ' +
          'uma parada de mercado sem custo nenhum de roteiro.',
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
          { texto: 'Adaptador de tomada — 2 unidades', essencial: true,
            motivo: 'ACRÉSCIMO. O plugue brasileiro não entra na tomada americana. A ' +
                    'voltagem não é problema (carregador moderno é bivolt), o formato ' +
                    'é. Sem isso o item \u201ccarregar celular e power bank a noite ' +
                    'inteira\u201d da lista de amanhã não acontece, e o dia 11 começa ' +
                    'com bateria pela metade. Se trouxeram do Brasil, ignorem.' },
          { texto: 'Algo para comer agora', essencial: true,
            motivo: 'ACRÉSCIMO. São seis horas entre o pouso e o jantar. Peguem algo ' +
                    'para comer na volta ao hotel, não só para os dias de parque.' },
          { texto: 'Água — caixa de 24 garrafas', essencial: true,
            motivo: 'Levem 2 garrafas por pessoa em todo dia de parque. Dentro do parque a ' +
                    'garrafa custa US$ 4; aqui sai a US$ 0,25.' },
          { texto: 'Protetor solar FPS 50 + bastão para o rosto', essencial: true,
            motivo: 'O bastão é para reaplicar na fila sem sujar a mão.' },
          { texto: 'Ibuprofeno e analgésico', essencial: true,
            motivo: 'Nos EUA sai muito mais barato que no Brasil.' },
          { texto: 'Barrinhas de cereal e frutas', essencial: true,
            motivo: 'É o café da manhã dos dias de rope drop, quando vocês saem do hotel ' +
                    'antes de 7h e o do hotel ainda não abriu.' },
          { texto: 'Barrinha de proteína Barebells', essencial: true,
            motivo: 'Segura mais que barrinha de cereal e não derrete na mochila. Nos EUA ' +
                    'custa uma fração do preço do Brasil.' },
          { texto: 'Gatorade', essencial: true,
            motivo: 'Doze horas em pé desidratam mais do que parece, e dentro do parque ' +
                    'custa quatro vezes mais. Levem um por pessoa nos dias longos.' },
          { texto: 'Beef jerky', essencial: false,
            motivo: 'Proteína que não estraga na mochila no calor e segura a fome entre ' +
                    'refeições espaçadas. É bem melhor e mais barato nos EUA.' },
          { texto: 'Café', essencial: false,
            motivo: 'Confiram se o quarto tem cafeteira antes de comprar cápsula.' },
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
                  'Buzz na baixa. Single Pass NENHUM — os dois viraram plano B pago. ' +
                  'Big Thunder, Jungle Cruise e Space Mountain não estão aí de propósito: ' +
                  'os dois primeiros vocês fazem no standby antes das 11h, e o Space entra ' +
                  'rolando depois que usarem a Mansão. Se alguma das três não aparecer, ' +
                  'hoje ainda dá tempo de rever o plano. Amanhã às 9h, não.' },

        { texto: 'Conferir o horário real de abertura do Magic Kingdom e ajustar aqui no app',
          critico: true,
          motivo: 'Os horários do dia 11 assumem abertura às 9h. Se for outro, mudem a ' +
                  'referência na tela do dia 11 e os blocos ancorados deslocam sozinhos, ' +
                  'inclusive a hora de sair do hotel. O desfile e os fogos ficam parados.' },

        { texto: 'Cartão cadastrado no My Disney Experience para mobile order',
          motivo: 'Almoço no Columbia Harbour House e jantar no Casey\u2019s são os dois de ' +
                  'balcão. Com mobile order vocês pulam a fila; sem cartão salvo, não pulam.' },

        { texto: 'Mochila montada e deixada na porta', critico: true,
          motivo: 'Duas garrafas de água, barrinhas, protetor solar, power bank e cabo — ' +
                  'tudo comprado hoje no Walmart. Montar hoje evita abrir mala às 6h.' },

        { texto: 'Roupa e tênis separados fora da mala',
          motivo: 'Puramente para não procurar nada no escuro às 5h45.' },

        { texto: 'Uber de amanhã: o destino é o TTC, não \u201cMagic Kingdom\u201d',
          motivo: 'O Magic Kingdom é o único parque sem acesso direto de carro. O Uber ' +
                  'para no Ticket & Transportation Center e de lá ainda são 15 a 20 min de ' +
                  'monotrilho ou barco. Quem digita \u201cMagic Kingdom\u201d no app é levado ' +
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
          'Com o Passaporte Américas o celular conecta sozinho ao pousar. Confiram que ' +
          'está com internet ANTES de descer para o nível 6 — se não conectar, o wifi ' +
          'do MCO resolve enquanto vocês ligam o roaming nos ajustes.\n\n' +
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
          'US$ 7 a 10 e leva 4 minutos. Se o dia estiver atrasado, façam só os oito itens ' +
          'essenciais e joguem o resto para o dia 12.',
        endereco: '3250 Vineland Rd', localId: 'walmart-vineland', acesso: [], duracaoMin: 45 },

      { id: 'b-1011-1645', hora: '16:25', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel e guardar as compras',
        descricao: '4 min. Fardo de água não vai para o Disney Springs',
        contexto:
          'Esta volta existe por um motivo só: ninguém anda pelo Disney Springs com uma ' +
          'caixa de 24 garrafas. Guardem tudo, separem só o que vai para o dia 11 — duas ' +
          'garrafas, protetor solar e barrinhas na mochila — e saiam de novo.\n\n' +
          'Com o Walmart certo, essa ida e volta custa ~US$ 16 no total e come 8 minutos ' +
          'de carro. Sobra meia hora a mais no Disney Springs.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 5 },

      { id: 'b-1011-1625', hora: '16:30', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Comer alguma coisa',
        descricao: 'Do que acabou de ser comprado. 6h desde o pouso',
        contexto:
          'Vocês pousam 12h35 e só sentam para jantar às 19h. Descontando a refeição do ' +
          'avião, são seis a oito horas sem comer, num dia em que já estão sem dormir.\n\n' +
          'Não é refeição — é não chegar no Disney Springs irritado às 17h15 com o jantar ' +
          'ainda a duas horas de distância. Barrinha, fruta, o que for, do que acabou de ' +
          'sair da sacola. Comam enquanto guardam as compras.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 20 },

      { id: 'b-1011-1710', hora: '16:55', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair para o Disney Springs',
        descricao: 'Uber, ~20 min. Pôr do sol às 17h35',
        contexto:
          'Entrada livre, sem ingresso e sem catraca. Vocês chegam junto com o pôr do sol, ' +
          'que é a melhor hora do lugar.',
        localId: 'disney-springs', acesso: [], duracaoMin: 25 },

      { id: 'b-1011-1745', hora: '17:20', ancora: 'referencia', tipo: 'compras',
        titulo: 'The Landing → Marketplace → Town Center',
        descricao: 'World of Disney é a maior loja Disney do mundo',
        contexto:
          'São 1h40 até o jantar, de mãos livres. Dá para o World of Disney sem correr e ' +
          'ainda pegar o pôr do sol às 17h35 na beira da água.',
        localId: 'disney-springs', acesso: [], duracaoMin: 100 },

      { id: 'b-1011-1900', hora: '19:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — The Boathouse',
        descricao: 'Frutos do mar e carnes na beira da água, no The Landing',
        contexto:
          'Frutos do mar e carnes na beira da água, no The Landing. Cheguem 15 minutos ' +
          'antes. HORÁRIO FIXO: não desloca nem se o voo atrasar — se o dia virar plano C, ' +
          'cancelem em vez de perder a reserva por não comparecimento.',
        restauranteId: 'r-boathouse', localId: 'disney-springs', acesso: ['reserva'],
        critico: true, duracaoMin: 90 },

      { id: 'b-1011-2100', hora: '21:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Amanhã é Magic Kingdom com saída às 6h45',
        contexto:
          'Não estiquem. O dia 11 começa às 6h45 e é o dia mais denso da primeira semana. ' +
          'Nada aqui justifica atrasar a volta — vocês revisitam o Disney Springs no dia ' +
          '21, decorado de Natal e sem parque no dia seguinte.',
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
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },

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
        'A TIANA’S BAYOU ADVENTURE ESTARÁ FECHADA. Entrou em reforma em 02/11 e a Disney ' +
        'não anunciou data de volta — o site indica dezembro. Critter Co-Op e Tiana’s ' +
        'Bayou General fecham junto. Com ela fora, o alvo da Frontierland na abertura é o ' +
        'Big Thunder Mountain.',
        pesquisa: '2026-09-09' },

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
        'segunda chance do TRON. Hoje vocês ficam até as 22h — dá, porque amanhã é o único ' +
        'dia da primeira semana sem alarme.',
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
        gatilho: 'Os horários oficiais saem por volta de 12/09 e podem não ser 9h.',
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
          'O dia 13 é Animal Kingdom e pode abrir às 8h.',
          'O que não se sacrifica: a manhã na Frontierland. Ela é o que faz o dia caber sem ' +
          'comprar passe nenhum.',
        ],
      },
    ],

    /* --------------------------------------------------------------------- */
    naoPerca: [
      { nome: 'Happily Ever After', quando: 'hoje', custo: 'grátis',
        motivo: 'Fogos com projeção mapeada no castelo, cerca de 18 minutos. É o melhor ' +
                'espetáculo noturno da Disney. Às 20h em novembro — confiram no app, porque ' +
                'em noite de evento especial ele não acontece.' },

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
        motivo: 'Doze minutos, ar-condicionado, e praticamente sem diálogo — não sofre com a ' +
                'barreira de idioma. É o melhor bloco de descanso do parque na pior hora de ' +
                'calor, e ainda é bom de verdade.' },

      { nome: 'Single Pass do TRON', quando: 'decidir', custo: 'US$ 20–23 por pessoa',
        motivo: 'PLANO B PAGO, não compra antecipada. O roteiro tem duas janelas de graça — ' +
                '15h30 no desfile e 21h25 na última hora. Só se as duas falharem é que vale ' +
                'sacar o cartão, e aí dá para comprar na hora pelo app, de pé na frente da ' +
                'atração. Não comprem em 08/11.',
        pesquisa: '2026-09-10' },

      { nome: 'Single Pass do Seven Dwarfs', quando: 'decidir', custo: 'US$ 15–20 por pessoa',
        motivo: 'PLANO B PAGO, mesma lógica. A fila dele é a mais persistente do parque, ' +
                'média de 80 minutos, e cede em duas horas do dia: o rope drop e a última ' +
                'hora. Vocês gastaram o rope drop na Frontierland de propósito, então a ' +
                'aposta é a última hora, às 20h30. Se por algum motivo vocês não puderem ' +
                'ficar até tarde, aí o passe se justifica.',
        pesquisa: '2026-09-10' },

      { nome: 'Tiana’s Bayou Adventure', quando: 'fechada', custo: '—',
        motivo: 'Em reforma desde 02/11, sem data de volta. Não é escolha de vocês — está ' +
                'fechada. Fica registrado para ninguém procurar.' },
    ],

    /* --------------------------------------------------------------------- */
    prepararAmanha: {
      paraODia: '2026-11-12',
      titulo: 'Outlet e ICON Park · café no hotel às 8h30',
      aviso:
        'Depois de um dia de 6h45 às 22h30, o dia 12 é de propósito o mais leve da ' +
        'primeira semana. A lista é curta porque tem que ser.',
      itens: [
        { texto: 'Conferir se o Single Pass do dia 15 precisa ser comprado às 7h de amanhã',
          critico: true,
          motivo: 'Se o ingresso NÃO for date-based, o Rise of the Resistance se compra ' +
                  'amanhã às 7h ET e aí PRECISA de alarme. Se for date-based, já está ' +
                  'coberto e amanhã não tem hora. Decidam isso hoje, não às 6h59.' },
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
        descricao: 'Uber para o TTC, não para a entrada do parque',
        contexto:
          'O Magic Kingdom é o único parque da Disney sem acesso direto de carro. O Uber ' +
          'para no Ticket & Transportation Center e de lá ainda são 15 a 20 minutos de ' +
          'monotrilho ou barco. É por isso que a saída é tão cedo.\n\n' +
          'NA IDA, MONOTRILHO. É mais rápido de manhã, quando a fila ainda não existe. ' +
          'Na volta vocês fazem o contrário, e o motivo está no bloco da saída.',
        localId: 'mk-ttc', acesso: [], critico: true, duracaoMin: 60 },

      { id: 'b-1111-0745', hora: '07:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão · posicionar para a FRONTIERLAND',
        descricao: 'À esquerda depois da Main Street, não à direita',
        contexto:
          'ESTA É A DECISÃO MAIS IMPORTANTE DA MANHÃ, e ela é contraintuitiva.\n\n' +
          'Vocês não têm Early Entry, porque não estão em hotel Disney. Isso significa que, ' +
          'quando o portão abre às 9h, os hóspedes Disney já estão dentro há meia hora — e ' +
          'já estão em pé na Tomorrowland e na Fantasyland, que são as áreas do Early Entry. ' +
          'Correr para o TRON às 9h é entrar na fila atrás dessa gente toda: dá 90 minutos ou ' +
          'mais.\n\n' +
          'A recomendação para quem vem de fora é ir para a FRONTIERLAND ou a ADVENTURELAND, ' +
          'que ficam quase vazias na abertura justamente porque o Early Entry não as inclui. ' +
          'É lá que vocês começam.\n\n' +
          'ESTES 75 MINUTOS SÃO O CAFÉ DA MANHÃ DE VOCÊS. Saindo às 6h45 vocês não comem ' +
          'nada até o almoço — comam as barrinhas da mochila aqui, parados na fila, que é o ' +
          'único momento do dia em que sobra tempo.\n\n' +
          'Água: qualquer balcão de comida do parque dá copo de água gelada de graça, é ' +
          'só pedir. Não comprem garrafa a US$ 4 lá dentro — recarreguem as de vocês.',
        localId: 'magic-kingdom', acesso: [], duracaoMin: 75, pesquisa: '2026-09-10' },

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
        critico: true, duracaoMin: 40, pesquisa: '2026-09-10',
        fila: { min: 20, quando: 'na abertura', pico: 60, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1111-1410', hora: '09:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Piratas do Caribe',
        descricao: 'Standby. Adventureland fica ao lado',
        contexto:
          'Passeio de barco de 1967, o clássico que originou os filmes. Cenários com ' +
          'animatrônicos, uma queda pequena no escuro, quase não molha. A capacidade é ' +
          'altíssima, então a fila anda mesmo quando parece grande — não vale gastar passe.',
        areaParque: 'Adventureland', acesso: ['standby'], duracaoMin: 35,
        fila: { min: 15, quando: 'de manhã', pico: 45, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1111-1545', hora: '10:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Jungle Cruise',
        descricao: 'Standby, enquanto ainda está cedo',
        contexto:
          'Passeio de barco com um piloto que narra piadas ruins de propósito — é o charme ' +
          'da atração.\n\n' +
          'É lista alta e vocês também fazem sem passe, porque a Adventureland ainda está ' +
          'vazia a esta hora. Depois das 11h ela passa de uma hora.\n\n' +
          'ATENÇÃO: é a única do dia que depende inteiramente de inglês falado. Se o humor ' +
          'não pegar, é o primeiro bloco a sacrificar quando o dia atrasar.',
        areaParque: 'Adventureland', acesso: ['standby'], duracaoMin: 45,
        fila: { min: 25, quando: 'antes das 11h', pico: 60, fonte: '2026-09-10' } },

      { id: 'b-1111-1150', hora: '11:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mansão Mal-Assombrada',
        descricao: 'Multi Pass · lista baixa. Ao sair, reservem o Space Mountain',
        contexto:
          'A Haunted Mansion, de 1969. Passeio em cápsulas por cenários com 999 fantasmas, ' +
          'feito com truques de ilusão óptica do século XIX que continuam funcionando. É ' +
          'assombrado de brincadeira, não de susto. Um dos melhores da Disney e não depende ' +
          'de idioma.\n\n' +
          'ESTA É A PRIMEIRA RESERVA DO DIA E É POR ISSO QUE ELA VEM CEDO. No segundo em ' +
          'que vocês passarem a catraca, abre espaço para reservar a próxima — e a restrição ' +
          'de lista cai junto. Reservem o SPACE MOUNTAIN ali mesmo, de pé na saída.',
        areaParque: 'Liberty Square', acesso: ['multi-pass'], critico: true, duracaoMin: 35,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 40, fonte: '2026-09-10' } },

      { id: 'b-1111-1115p', hora: '11:35', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Quinze minutos. Não é folga, é o que faz o resto funcionar',
        contexto:
          'Vocês estão de pé desde as 5h45 e vieram emendando desde as 9h. Banheiro, ' +
          'encher as garrafas num balcão de comida (a água gelada é de graça, é só ' +
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
        duracaoMin: 55 },

      { id: 'b-1111-1115', hora: '12:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'it’s a small world',
        descricao: 'Standby. Capacidade alta, a fila anda',
        contexto:
          'Passeio de barco de 1964 com centenas de bonecos animatrônicos e a música que ' +
          'gruda na cabeça por três dias. Lento e climatizado — serve de descanso depois do ' +
          'almoço, e a fila engana: some rápido.',
        areaParque: 'Fantasyland', acesso: ['standby'], duracaoMin: 35,
        fila: { min: 25, quando: 'depois do almoço', pico: 35, fonte: '2026-09-10' } },

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
        fila: { min: 10, quando: 'com o Multi Pass', pico: 70, fonte: '2026-09-10' } },

      { id: 'b-1111-1630', hora: '13:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mickey’s PhilharMagic',
        descricao: 'Standby. 12 min, ar-condicionado',
        contexto:
          'Filme 3D com efeitos no teatro — cheiro, água, ar. Praticamente sem diálogo ' +
          'relevante, então não sofre com a barreira de idioma. É o melhor bloco de descanso ' +
          'do parque, e cai na pior hora de calor de propósito.',
        areaParque: 'Fantasyland', acesso: ['standby'], duracaoMin: 20,
        fila: { min: 10, quando: 'quase sempre', pico: 20, fonte: '2026-09-10' } },

      { id: 'b-1111-1645p', hora: '14:10', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Antes do desfile e da corrida que vem depois dele',
        contexto:
          'Os próximos noventa minutos são o miolo tático do dia: desfile, travessia do ' +
          'parque e a fila do TRON. Vão para eles com a garrafa cheia e sem fila de ' +
          'banheiro pendurada.\n\n' +
          'É também a hora de ligar o power bank, se o celular estiver abaixo de 40%.',
        areaParque: 'Fantasyland', acesso: [], duracaoMin: 15 },

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
        areaParque: 'Liberty Square', acesso: [], duracaoMin: 35 },

      { id: 'b-1111-1500', hora: '15:00', ancora: 'fixo', tipo: 'show',
        titulo: 'Festival of Fantasy Parade',
        descricao: 'Da Liberty Square. Doze minutos',
        contexto:
          'Desfile de carros alegóricos, 12 minutos.\n\n' +
          'HORÁRIO FIXO — não desloca se o parque abrir mais cedo, e é ele que ancora toda a ' +
          'tarde a partir daqui. Confiram a hora no app da Disney: ela varia conforme o ' +
          'horário do parque.',
        areaParque: 'Liberty Square', acesso: [], duracaoMin: 12, confirmarHorario: true },

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
          'A montanha-russa mais rápida do Magic Kingdom, ~100 km/h. Vocês montam em motos, ' +
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
        fila: { min: 50, quando: 'na janela do desfile', pico: 90, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1111-1515p', hora: '16:25', ancora: 'fixo', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Saindo do TRON, antes da reta final',
        contexto:
          'Daqui até a saída, às 22h, são mais cinco horas e meia. Banheiro, garrafas ' +
          'cheias e protetor solar antes de encarar a Main Street lotada.',
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
        fila: { min: 10, quando: 'com o Multi Pass', pico: 60, fonte: '2026-09-10' } },

      { id: 'b-1111-1700', hora: '17:15', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Buzz Lightyear',
        descricao: 'Multi Pass · lista baixa. Repaginado em 2026',
        contexto:
          'Dark ride onde vocês atiram em alvos e disputam pontuação. Girem a cabine com o ' +
          'joystick central para mirar melhor, e os alvos com Z valem mais.',
        areaParque: 'Tomorrowland', acesso: ['multi-pass'], duracaoMin: 40,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 35, fonte: '2026-09-10' } },

      { id: 'b-1111-1745', hora: '17:55', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Casey’s Corner',
        descricao: 'Balcão na Main Street. Sentem fora, de frente para o pianista',
        contexto:
          'Cachorro-quente de balcão, com pianista tocando ao vivo na porta. Foi por isso ' +
          'que vocês escolheram — comer dentro perde o motivo da escolha.\n\n' +
          'Mobile order aqui também.',
        restauranteId: 'r-caseys', areaParque: 'Main Street', acesso: [], duracaoMin: 65 },

      { id: 'b-1111-1900', hora: '19:00', ancora: 'fixo', tipo: 'compras',
        titulo: 'Main Street',
        descricao: 'Compras e o castelo iluminado',
        contexto:
          'As lojas da Main Street ficam abertas até depois dos fogos e esvaziam justamente ' +
          'quando todo mundo está se posicionando. Como hoje vocês ficam até as 22h, dá para ' +
          'deixar a compra para o fim se preferirem.',
        areaParque: 'Main Street', acesso: [], duracaoMin: 20 },

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
        descricao: '20h em novembro, não 21h — o horário de verão acaba em 01/11',
        contexto:
          'Fogos com projeção mapeada no castelo, cerca de 18 minutos. É o melhor espetáculo ' +
          'noturno da Disney.\n\n' +
          'HORÁRIO FIXO. Confiram no app da Disney em novembro: em noites de evento especial ' +
          'ele não acontece, e a hora pode mudar com o horário do parque.',
        areaParque: 'Main Street', acesso: [], duracaoMin: 18,
        confirmarHorario: true, pesquisa: '2026-09-09' },

      { id: 'b-1111-1045', hora: '20:30', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Seven Dwarfs Mine Train',
        descricao: 'A última hora. É quando ele fica barato',
        contexto:
          'Montanha-russa familiar cujos carrinhos balançam lateralmente nas curvas. Suave, ' +
          'curta, com uma cena final de animatrônicos muito boa.\n\n' +
          'É a fila mais persistente do parque: média de 80 minutos o dia inteiro. As duas ' +
          'únicas horas em que ela cede são o rope drop e a ÚLTIMA HORA antes de fechar — e ' +
          'vocês gastaram o rope drop na Frontierland, de propósito. É agora.\n\n' +
          'A maior parte das vinte mil pessoas vai embora logo depois dos fogos, às 20h25, e ' +
          'as filas despencam. É por isso que hoje vocês ficam até o fim.',
        areaParque: 'Fantasyland', acesso: ['standby'], critico: true, duracaoMin: 55,
        pesquisa: '2026-09-10',
        fila: { min: 40, quando: 'na última hora', pico: 90, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1111-2125', hora: '21:25', ancora: 'fixo', tipo: 'atracao',
        titulo: 'TRON de novo, se ainda tiverem pique',
        descricao: 'Opcional. A outra janela boa do dia',
        contexto:
          'A última hora é a segunda janela do TRON, e é o plano B declarado caso a fila das ' +
          '15h30 tenha estourado. Se vocês já andaram nele à tarde, esta é a repetição — e ' +
          'de noite, iluminado, ele é outro passeio.\n\n' +
          'Se o corpo não pedir, cortem sem culpa. Vocês estão no segundo dia de viagem e ' +
          'amanhã é o único dia sem alarme da primeira semana.',
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
          'Do TTC até o hotel, contem 45 a 60 minutos de Uber.',
        localId: 'mk-ttc', acesso: [], duracaoMin: 60, pesquisa: '2026-09-10' },
    ],

    ficha: {
      multiPass: {
        usar: true, opcional: false,
        listaAlta: ['Peter Pan’s Flight'],
        listaBaixa: ['Mansão Mal-Assombrada', 'Buzz Lightyear'],
        planoB:
          'Nenhum. Esta é a compra e ela é simples: uma da alta, duas da baixa. Se o Peter ' +
          'Pan não estiver disponível na hora, troquem pelo Space Mountain e reservem o ' +
          'Peter Pan rolando.',
        nota:
          'ROLANDO: Space Mountain, reservado às 11h de pé na saída da Mansão. É o uso da ' +
          'primeira reserva que abre a próxima e derruba a restrição de lista.\n\n' +
          'Lista alta hoje: Jungle Cruise, Peter Pan, Space Mountain e Big Thunder. Vocês ' +
          'fazem TRÊS delas gastando UMA — Big Thunder e Jungle saem no standby antes das ' +
          '11h, porque a Frontierland e a Adventureland ficam vazias na abertura. A Tiana’s ' +
          'saiu da lista porque está fechada.',
      },
      singlePass: {
        itens: [],
        opcionais: ['TRON Lightcycle / Run', 'Seven Dwarfs Mine Train'],
        nota:
          'NÃO COMPREM NADA EM 08/11. Os dois Single Pass do Magic Kingdom viraram plano B ' +
          'pago, e o roteiro foi desenhado para não precisar deles.\n\n' +
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
      ],
      idioma: {
        itens: ['Hall of Presidents', 'Country Bear Jamboree',
                'Monsters Inc. Laugh Floor', 'Enchanted Tiki Room'],
        motivo:
          'São atrações longas, faladas e com humor que depende de referência americana. São ' +
          '20 a 25 minutos cada que rendem muito mais em outro lugar.',
      },
      fechado: [
        'Carousel of Progress',
        'Tiana’s Bayou Adventure — em reforma desde 02/11, volta prevista para dezembro',
        'Critter Co-Op e Tiana’s Bayou General — fecham junto com a atração',
      ],
    },
  },

  /* ===== 12/11 · QUINTA · OUTLET E ICON PARK ============================== */
  /* DIA FECHADO — revisado em 10/09/2026. Noite montada sobre o que está
     comprovadamente aberto no ICON Park; a roda-gigante entra só se voltar.  */
  {
    id: 'd-2026-11-12',
    data: '2026-11-12',
    diaSemana: 'quinta',
    emoji: '🛍️',
    titulo: 'Outlet e ICON Park',
    subtitulo: 'O dia mais leve da primeira semana',
    tipo: 'compras',
    operadora: null,
    parqueId: null,
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-10',
    referencia: null,

    resumo:
      'Este dia perdeu a festa de Natal do Magic Kingdom, e a geografia foi reorganizada ' +
      'para tudo rodar no eixo da International Drive. Ele é leve de propósito: vocês vêm ' +
      'do Magic Kingdom até as 22h e entram numa sequência pesada a partir de amanhã. O ' +
      'bloco vazio da tarde não é folga, é manutenção.',

    avisos: [
      'ANTES DE DORMIR, CONFIRAM UMA COISA: se o ingresso da Disney NÃO for date-based, ' +
      'tem uma compra às 7h ET hoje — o Single Pass do Rise of the Resistance, para o ' +
      'dia 15. Está nas pendências. Se for date-based, não tem nada: durmam.',
      'Fora isso, nada hoje depende de acordar cedo. É o único dia assim da primeira semana.',
    ],

    notas: [
      { tipo: 'atencao', texto:
        'A RODA-GIGANTE PODE NÃO ESTAR FUNCIONANDO. O site oficial dizia, em 09/09, que ' +
        'The Orlando Eye está fechada para manutenção anual, sem data de reabertura, e ela ' +
        'já aparecia fechada desde o fim de junho. A noite foi montada sobre o que está ' +
        'comprovadamente aberto — se ela voltar, entra como bônus. É o plano B.',
        pesquisa: '2026-09-10' },

      { tipo: 'atencao', texto:
        'O CUPOM DO OUTLET SÓ É GRÁTIS SE VOCÊS SE CADASTRAREM ANTES. O livro físico do ' +
        'balcão custa US$ 10. O gratuito vem do Simon VIP Club, em premiumoutlets.com/vip, ' +
        'e o Savings Passport fica no celular. Está no checklist para 05/11.',
        pesquisa: '2026-09-10' },

      { tipo: 'atencao', texto:
        'NÃO CONTEM COM FOGOS DAQUI. Em novembro os fogos do Magic Kingdom são às 20h, e ' +
        '12/11 é noite de Christmas Party, quando os da festa são ainda mais tarde. Às 18h ' +
        'não há fogo nenhum em lugar nenhum do complexo.', pesquisa: '2026-09-10' },
    ],

    /* --------------------------------------------------------------------- */
    planos: [
      {
        letra: 'A',
        titulo: 'Dia normal',
        gatilho: 'Vocês acordaram bem e a roda continua fechada.',
        passos: [
          'Outlet de manhã com calma, começando pelo Character Warehouse, que abre 10h.',
          'Almoço no próprio outlet, sem sair do lugar.',
          'Tarde inteira no hotel. Não preencham esse bloco.',
          'ICON Park a partir das 17h30, pegando o pôr do sol na promenade.',
          'Museum of Illusions, e o Madame Tussauds só se estiverem com pique — é ele que ' +
          'fecha o combo de duas atrações.',
          'Jantar no Yard House ou no Tin Roof, os dois dentro do próprio ICON Park.',
        ],
      },
      {
        letra: 'B',
        titulo: 'A roda reabriu',
        gatilho: 'Vocês conferem em outubro e ela voltou a operar.',
        passos: [
          'A roda passa a ser a atração das 18h e vale mais que qualquer outra do ICON Park.',
          'O Museum of Illusions desloca para as 19h e o Madame Tussauds cai.',
          'Subam no fim de tarde, mas sem esperar fogos: em novembro eles só começam às 20h.',
          'Confiram o preço na hora: a roda estava fora do ar quando este dia foi montado, ' +
          'então não há valor confirmado.',
        ],
      },
      {
        letra: 'C',
        titulo: 'Vocês acordaram destruídos',
        gatilho: 'O dia 11 terminou perto das 22h e o corpo não colaborou.',
        passos: [
          'Cortem o ICON Park inteiro sem culpa. Outlet de manhã, hotel à tarde e à noite, ' +
          'jantar em qualquer coisa na 192.',
          'Este é o ÚNICO dia da viagem em que nada é insubstituível. Não há ingresso, não ' +
          'há reserva, não há hora marcada.',
          'O que vocês estão protegendo é o dia 13, que sai às 6h30 e abre a sequência mais ' +
          'pesada da viagem: Animal Kingdom, Islands, SeaWorld, Epic e Busch Gardens.',
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

      { nome: 'Pôr do sol na promenade do ICON Park', quando: 'hoje', custo: 'grátis',
        motivo: 'O sol se põe às 17h31 e vocês chegam 17h30. A área do ICON Park é aberta, ' +
                'sem ingresso e sem catraca — só as atrações são pagas. É o melhor momento ' +
                'do lugar e não custa nada.' },

      { nome: 'Museum of Illusions', quando: 'hoje', custo: 'US$ 26,99 por pessoa',
        motivo: 'Salas de ilusão de óptica, quarto invertido, sala de Ames. É participativo ' +
                'e rende foto, que é exatamente o que serve num dia de descanso. Cerca de ' +
                'uma hora.', pesquisa: '2026-09-10' },

      { nome: 'Madame Tussauds', quando: 'decidir', custo: 'US$ 33,99 por pessoa',
        motivo: 'Museu de cera com mais de 90 figuras. É o que fecha o COMBO DE DUAS ' +
                'ATRAÇÕES, a partir de US$ 39 por pessoa — contra US$ 61 comprando as duas ' +
                'separadas, ou seja ~US$ 44 de economia no casal. Se vocês já sabem que vão ' +
                'fazer duas, comprem o combo de saída.', pesquisa: '2026-09-10' },

      { nome: 'SEA LIFE Orlando Aquarium', quando: 'decidir', custo: 'US$ 33,99 por pessoa',
        motivo: 'Terceira opção, se quiserem o combo de três atrações a partir de US$ 49 por ' +
                'pessoa. Túnel de acrílico de 360°. Vocês já veem tanque de tubarão no ' +
                'SeaWorld no dia 22 — decidam se vale repetir o tema.', pesquisa: '2026-09-10' },

      { nome: 'The Wheel / Orlando Eye', quando: 'fechada', custo: 'a confirmar',
        motivo: 'Fechada para manutenção anual desde o fim de junho, sem data de reabertura ' +
                'anunciada até 09/09. Se voltar, vira a atração das 18h e desloca o resto ' +
                'da noite — é o plano B. Conferir em outubro.', pesquisa: '2026-09-10' },

      { nome: 'Resort hopping nos hotéis Disney', quando: 'descartado', custo: '—',
        motivo: 'DESCARTADO em 10/09. Desde junho de 2026 os resorts exigem reserva de ' +
                'hotel ou de restaurante para o carro do rideshare passar pela guarita, e o ' +
                'transporte saindo do Disney Springs também checa. Seria possível com um ' +
                'jantar reservado num resort do monotrilho, mas isso exigiria reserva com ' +
                '60 dias — 13/09.', pesquisa: '2026-09-10' },
    ],

    /* --------------------------------------------------------------------- */
    prepararAmanha: {
      paraODia: '2026-11-13',
      titulo: 'Animal Kingdom · alarme 5h30, saída 6h30',
      aviso:
        'Acabou a parte leve. O dia 13 abre a sequência mais pesada da viagem, e é o dia ' +
        'mais dependente de um horário que só sai perto da data — confiram tudo hoje.',
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

        { texto: 'Decidir sobre o Single Pass do Flight of Passage', critico: false,
          motivo: 'NÃO é compra pendente, é decisão. O dia foi montado para pegar a fila ' +
                  'de 40 a 65 minutos do fim da tarde em vez dos 100 a 180 do pico. Só ' +
                  'vale comprar se o fechamento não deixar o plano caber, ou se vocês ' +
                  'decidirem que não querem 50 minutos de fila no fim de dez horas de ' +
                  'parque. Se decidirem comprar, a janela já passou em 10/11 — dá para ' +
                  'comprar na hora pelo app, dentro do parque.' },

        { texto: 'Reserva do Sanaa: número de confirmação à mão', critico: false,
          motivo: 'Jantar às 19h45, e o Animal Kingdom Lodge é OUTRO endereço, não é dentro ' +
                  'do parque. Deixem o número acessível no celular hoje, não procurando ' +
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
          motivo: 'Duas garrafas de água, barrinhas, protetor solar, power bank e cabo. ' +
                  'Mesma rotina de toda véspera de parque a partir de agora.' },

        { texto: 'Guardar as compras do outlet',
          motivo: 'Vocês voltam com sacola hoje. Amanhã a mochila precisa estar vazia para ' +
                  'o que interessa.' },
      ],
    },

    /* --------------------------------------------------------------------- */
    blocos: [
      { id: 'b-1211-0830', hora: '08:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Café da manhã no hotel',
        descricao: 'Incluso. Sem alarme',
        contexto:
          'É o único dia da primeira semana em que dá tempo de tomar o café do hotel com ' +
          'calma — nos dias de parque vocês saem antes de ele abrir. Aproveitem, e sem ' +
          'despertador: nada hoje depende de acordar cedo.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 60 },

      { id: 'b-1211-0930', hora: '09:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair para o outlet',
        descricao: 'Uber, ~25 min, US$ 20–30',
        contexto:
          'O Character Warehouse abre às 10h e o estoque bom sai cedo. Saindo 9h30 vocês ' +
          'chegam na abertura, que é o único momento em que a loja está inteira.',
        localId: 'premium-outlets', acesso: [], duracaoMin: 30 },

      { id: 'b-1211-1000', hora: '10:00', ancora: 'fixo', tipo: 'compras',
        titulo: 'Orlando International Premium Outlets',
        descricao: '~25 min do hotel. Quinta, 10h às 21h',
        contexto:
          'Outlet a céu aberto com cerca de 180 lojas.\n\n' +
          'SOBRE O CUPOM: o livro do balcão custa US$ 10. O gratuito é o Savings Passport ' +
          'do Simon VIP Club, que vocês cadastram antes de viajar e fica no celular.',
        endereco: '4951 International Dr', localId: 'premium-outlets', acesso: [],
        pesquisa: '2026-09-10', duracaoMin: 5 },

      { id: 'b-1211-1005', hora: '10:05', ancora: 'fixo', tipo: 'compras',
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

      { id: 'b-1211-1300', hora: '13:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Almoço no outlet',
        descricao: 'Sem sair do lugar',
        contexto:
          'Comam no próprio outlet. Sair da I-Drive para almoçar custa dois Ubers e uma ' +
          'hora, num dia cujo objetivo é descansar.',
        localId: 'premium-outlets', acesso: [], pesquisa: '2026-09-10', duracaoMin: 90 },

      { id: 'b-1211-1430', hora: '14:30', ancora: 'fixo', tipo: 'vazio',
        titulo: 'VAZIO PROPOSITAL',
        descricao: 'Voltar ao hotel, piscina, dormir',
        contexto:
          'Não preencham. Vocês vêm de um Magic Kingdom que terminou perto das 22h e amanhã ' +
          'começa ' +
          'a sequência mais pesada da viagem: Animal Kingdom, Islands of Adventure, ' +
          'SeaWorld, Epic Universe e Busch Gardens com três horas de carro.\n\n' +
          'Este bloco não é folga. É o que faz o resto funcionar.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 155 },

      { id: 'b-1211-1705', hora: '17:05', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair para o ICON Park',
        descricao: 'Uber, ~25 min, US$ 20–30',
        contexto:
          'O pôr do sol é às 17h31 e é o melhor momento do lugar. Para chegar nele, a ' +
          'saída é 17h05 — não 17h30.',
        localId: 'icon-park', acesso: [], duracaoMin: 25 },

      { id: 'b-1211-1730', hora: '17:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'ICON Park — promenade ao pôr do sol',
        descricao: 'Área aberta, sem ingresso. Pôr do sol às 17h31',
        contexto:
          'Complexo aberto na I-Drive: entrar não custa nada, só as atrações são pagas. ' +
          'Vocês chegam exatamente na hora do pôr do sol, que é o melhor momento do lugar.\n\n' +
          'Se estiverem cansados, este bloco sozinho já justifica a saída — dá para andar, ' +
          'jantar e voltar sem pagar atração nenhuma.',
        endereco: '8375 International Dr', localId: 'icon-park', acesso: [], duracaoMin: 30 },

      { id: 'b-1211-1800', hora: '18:00', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Museum of Illusions',
        descricao: 'US$ 26,99 por pessoa. Cerca de 1h',
        contexto:
          'Salas de ilusão de óptica, quarto invertido, sala de Ames. É participativo e ' +
          'rende foto — exatamente o que serve num dia de descanso, sem fila e sem correr.\n\n' +
          'Se forem fazer também o Madame Tussauds, comprem o COMBO DE DUAS ATRAÇÕES na ' +
          'entrada: a partir de US$ 39 por pessoa, contra US$ 61 separadas.',
        localId: 'icon-park', acesso: [], duracaoMin: 60, pesquisa: '2026-09-10' },

      { id: 'b-1211-1915', hora: '19:15', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Madame Tussauds',
        descricao: 'US$ 33,99 avulso. Opcional — é o que fecha o combo',
        contexto:
          'Museu de cera com mais de 90 figuras. Só façam se estiverem com pique: o valor ' +
          'do dia está no descanso, não em encaixar mais uma atração.\n\n' +
          'Mas se fizerem as duas, o combo derruba o preço de US$ 61 para ~US$ 39 por ' +
          'pessoa — cerca de US$ 44 de economia no casal.',
        localId: 'icon-park', acesso: [], opcional: true, duracaoMin: 60,
        pesquisa: '2026-09-10' },

      { id: 'b-1211-2000', hora: '20:30', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Yard House ou Tin Roof',
        descricao: 'Os dois ficam DENTRO do ICON Park',
        contexto:
          'Yard House tem 140 torneiras de chope e cardápio grande. Tin Roof tem música ao ' +
          'vivo todas as noites.\n\n' +
          'A vantagem dos dois é a mesma: ficam dentro do próprio ICON Park, então vocês ' +
          'saem da atração e sentam. O Cooper’s Hawk fica em outro ponto da I-Drive e ' +
          'obrigaria mais um Uber no fim da noite.\n\n' +
          'São 20h30 porque o Madame Tussauds leva uma hora e termina 20h15. Se pularem ' +
          'o Tussauds, jantem 19h30 — nenhum dos dois pede reserva.',
        localId: 'icon-park', acesso: [], pesquisa: '2026-09-10', duracaoMin: 60 },

      { id: 'b-1211-2130', hora: '21:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Amanhã sai às 6h30',
        contexto:
          'Não estiquem. O dia 13 é Animal Kingdom com saída às 6h30 — uma hora mais cedo ' +
          'do que estava, porque o parque deve abrir às 8h — e abre a sequência ' +
          'pesada da viagem.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 30 },
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
    subtitulo: 'Rope drop na África · Pandora no fim',
    tipo: 'parque',
    operadora: 'disney',
    parqueId: 'animal-kingdom',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-10',
    referencia: { rotulo: 'Abertura do parque', padrao: '08:00', confirmado: false },

    resumo:
      'O dia inteiro é uma inversão: todo mundo corre para Pandora na abertura, e vocês vão ' +
      'para o lado oposto. A recompensa vem no fim — o safári ao entardecer, quando os leões ' +
      'acordam, e a fila do Flight of Passage no último minuto, que devolve Pandora escura, ' +
      'acesa e vazia na saída.',

    avisos: [
      'A ESTIMATIVA É QUE O PARQUE ABRA ÀS 8H, não às 9h. Em novembro o Animal Kingdom ' +
      'costuma operar das 8h às 18h. Por isso a saída do hotel é 6h30. Confiram o horário ' +
      'oficial e ajustem a referência assim que ele sair.',
      'NÃO VÃO PARA PANDORA DE MANHÃ. O Early Entry do Animal Kingdom inclui Pandora, e mais ' +
      'de 90% dos visitantes correm para lá. O parque inteiro fica vazio do outro lado.',
    ],

    notas: [
      { tipo: 'atencao', texto:
        'ESTE É O DIA MAIS DEPENDENTE DE UM HORÁRIO QUE AINDA NÃO SAIU. O fechamento do ' +
        'parque decide a reta final inteira: safári ao entardecer, Na’vi e a fila do Flight ' +
        'of Passage estão coreografados para um fechamento às 18h. Se for 19h ou 20h, o dia ' +
        'respira e cabe repetir o Everest. Se for antes das 18h, o plano B assume.',
        pesquisa: '2026-09-10' },

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
        gatilho: 'Na parada das 15h45 vocês descobrem que o último caminhão sai antes das 16h30.',
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
        titulo: 'O parque não abre às 8h, ou fecha mais tarde',
        gatilho: 'O horário oficial sai por volta de 14/09 e pode não ser 8h–18h.',
        passos: [
          'ABRIU MAIS TARDE: mudem a referência aqui no app. A manhã inteira desloca junto, ' +
          'inclusive a saída do hotel. Os shows têm sessão própria — confiram a grade e ' +
          'ajustem no selo de horário de cada um.',
          'FECHOU MAIS TARDE (19h ou 20h): o dia respira. Empurrem o safári do entardecer ' +
          'para uma hora antes do fechamento dele, encaixem o Expedition Everest de novo, e ' +
          'entrem na fila do Flight of Passage a 15 minutos do fechamento em vez de 17h45.',
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
          'Festival of the Lion King e o Zootopia são teatro fechado, e o Nomad Lounge tem ' +
          'varanda coberta com ventilador.',
          'O safári RODA na chuva e os animais costumam ficar mais ativos. O caminhão tem ' +
          'teto. Não é motivo para desistir dele.',
          'O QUE NÃO SE SACRIFICA: a fila do Flight of Passage no fim. Se for para cortar ' +
          'alguma coisa, cortem o Zootopia, o Kali e as trilhas — nessa ordem.',
          'Se vocês estiverem destruídos, o Sanaa às 19h45 tem tolerância curta e taxa por ' +
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

      { nome: 'Single Pass do Flight of Passage', quando: 'decidir',
        custo: 'US$ 18–20 por pessoa',
        motivo: 'PLANO B PAGO, não compra antecipada. O dia foi montado para pegar a fila de ' +
                '40–65 minutos do fim da tarde em vez dos 100–180 do pico. Só vale comprar ' +
                'se o parque fechar cedo demais para o plano caber, ou se vocês decidirem ' +
                'que não querem encarar 50 minutos de fila no fim de um dia de dez horas. ' +
                'A compra seria às 7h ET de 10/11, durante a conexão em Bogotá.',
        pesquisa: '2026-09-10' },

      { nome: 'Starlight Safari', quando: 'decidir', custo: 'US$ 75 a 89 por pessoa',
        condicao: 'reserva abre 60 dias antes, 6h ET — ou seja 14/09',
        motivo:
          'Safári noturno na savana do Animal Kingdom Lodge, em veículo aberto e com ' +
          'óculos de visão noturna. Cerca de 1h30, sai às 20h30 e às 22h, e NÃO exige ' +
          'estar hospedado no Lodge — é aberto a qualquer visitante.\n\n' +
          'O encaixe é bom demais para não registrar: vocês já vão estar no Lodge para o ' +
          'Sanaa às 19h45. O jantar termina por volta das 21h15 e a saída das 22h começa ' +
          'no mesmo lugar — zero deslocamento a mais. E é a única noite da viagem em que ' +
          'dormir tarde não custa nada: o dia 14 abre com bloco vazio às 9h.\n\n' +
          'O que pesa contra é o preço. US$ 150 a 178 no casal, e vocês descartaram o ' +
          'Amphicar a US$ 62 por cabeça. Se a régua for a mesma, este também cai — mas ' +
          'aqui são 90 minutos, não 20, e é a savana à noite, que não tem substituto no ' +
          'resto do roteiro. E hoje vocês já terão feito o safári diurno duas vezes: ' +
          'pesem se um terceiro, no escuro, ainda acrescenta.\n\n' +
          'Decidam até 14/09, que é quando a reserva abre.',
        pesquisa: '2026-09-09' },
    ],

    /* --------------------------------------------------------------------- */
    prepararAmanha: {
      paraODia: '2026-11-14',
      titulo: 'Celebration e Islands à noite · sem alarme',
      aviso:
        'Depois de um dia que termina 21h15 no Sanaa, o dia 14 começa com bloco vazio às ' +
        '9h de propósito. Não coloquem despertador.',
      itens: [
        { texto: 'Dormir sem alarme', critico: true,
          motivo: 'O dia 14 só sai do hotel às 10h30 e o bloco das 9h é vazio de propósito. ' +
                  'Hoje foram dez horas de parque; amanhã é a primeira noite da temporada de ' +
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
          motivo: 'Não deixem no chão da mala. Amanhã à noite chove com frequência em ' +
                  'novembro e vocês vão querer a capa seca.' },
      ],
    },

    /* --------------------------------------------------------------------- */
    blocos: [
      { id: 'b-1311-0730', hora: '06:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel',
        descricao: 'Uber, ~35 min. O Animal Kingdom tem entrada direta',
        contexto:
          'Diferente do Magic Kingdom, aqui o Uber deixa vocês na entrada — não há ' +
          'monotrilho nem barco no meio. Ainda assim a saída é cedo, porque a estimativa é ' +
          'que o parque abra às 8h e não às 9h: em novembro o Animal Kingdom costuma operar ' +
          'das 8h às 18h.',
        localId: 'animal-kingdom', acesso: [], critico: true, duracaoMin: 45 },

      { id: 'b-1311-0815', hora: '07:15', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão · pré-fila no checkpoint da ÁFRICA',
        descricao: 'Não na ponte de Pandora',
        contexto:
          'A MESMA DECISÃO CONTRAINTUITIVA DO DIA 11, e aqui ela é ainda mais forte.\n\n' +
          'Mais de 90% dos visitantes correm para Pandora no rope drop — e o Early Entry do ' +
          'Animal Kingdom INCLUI Pandora. São só quatro atrações no Early Entry e duas delas ' +
          'são o Flight of Passage e o Na’vi. Ou seja: os hóspedes Disney já andaram nas duas ' +
          'antes de vocês entrarem, e ainda estão na fila quando o portão abre para vocês.\n\n' +
          'O resto do parque fica praticamente vazio nos primeiros 60 a 90 minutos. Kilimanjaro ' +
          'Safaris, Expedition Everest e Kali River Rapids costumam ser walk-on nessa janela. ' +
          'É para lá que vocês vão.\n\n' +
          'Desde meados de 2026 quem não é hóspede pode fazer pré-fila direto no checkpoint da ' +
          'land, e não mais só na entrada — peçam o da África.\n\n' +
          'Café da manhã aqui, das barrinhas da mochila. O almoço é só às 11h30.',
        localId: 'animal-kingdom', acesso: [], duracaoMin: 45, pesquisa: '2026-09-10' },

      { id: 'b-1311-0935', hora: '08:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Kilimanjaro Safaris — rope drop',
        descricao: 'Walk-on, e os animais estão ativos com o frio da manhã',
        contexto:
          'Safári de caminhão por 45 hectares com animais soltos de verdade — girafas, leões, ' +
          'elefantes, rinocerontes. Dura cerca de 22 minutos e cada passeio é diferente.\n\n' +
          'DE MANHÃ É QUANDO ELES ESTÃO ATIVOS: no calor da tarde se escondem na sombra. E ' +
          'às 8h a fila não existe, porque o parque inteiro está em Pandora.\n\n' +
          'Vocês voltam aqui às 16h30. É a única atração do parque em que repetir dá conteúdo ' +
          'diferente, e o motivo está naquele bloco.',
        areaParque: 'Africa', acesso: ['rope-drop', 'standby'], critico: true, duracaoMin: 40,
        fila: { min: 10, quando: 'na abertura', pico: 55, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1311-1040', hora: '08:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Expedition Everest',
        descricao: 'Walk-on pelo mesmo motivo',
        contexto:
          'Montanha-russa dentro de uma montanha cenográfica de 60 metros, com um trecho longo ' +
          'andando para trás no escuro. É a mais intensa do parque, mas ainda assim familiar — ' +
          'sem inversões. A fila tem um museu de ioga e ietis que vale olhar.\n\n' +
          'Ela está no Early Entry, mas continua vazia na abertura oficial porque todo mundo ' +
          'que entrou cedo foi para Pandora.',
        areaParque: 'Asia', acesso: ['standby'], duracaoMin: 35,
        fila: { min: 15, quando: 'na abertura', pico: 40, fonte: '2026-09-10' } },

      { id: 'b-1311-0915', hora: '09:15', ancora: 'referencia', tipo: 'atracao',
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
        fila: { min: 15, quando: 'na abertura', pico: 45, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1311-1415', hora: '09:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Maharajah Jungle Trek',
        descricao: 'Trilha a pé. Tigres. Sem fila, no ritmo de vocês',
        contexto:
          'Trilha a pé por ruínas cenográficas com tigres, dragões-de-komodo e morcegos ' +
          'gigantes. Sem fila, no seu ritmo, com muita sombra.\n\n' +
          'Vem aqui de propósito: se vocês fizeram o Kali, é a hora de secar andando.',
        areaParque: 'Asia', acesso: [], duracaoMin: 40 },

      { id: 'b-1311-1030p', hora: '10:30', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Quinze minutos. Vocês estão de pé desde as 5h30',
        contexto:
          'Banheiro, encher as garrafas num balcão de comida (água gelada de graça, é só ' +
          'pedir) e sentar.\n\n' +
          'Toda land tem banheiro, normalmente ao lado do maior balcão de comida. Não vale ' +
          'procurar no mapa; vale parar quando o corpo pedir.',
        areaParque: 'Asia', acesso: [], duracaoMin: 15 },

      { id: 'b-1311-1545', hora: '10:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Gorilla Falls Exploration Trail',
        descricao: 'Trilha. Ritmo lento de propósito',
        contexto:
          'Trilha a pé com gorilas, hipopótamos vistos por baixo d’água e um aviário. ' +
          'Diferente do safári, aqui vocês param quanto quiserem.',
        areaParque: 'Africa', acesso: [], duracaoMin: 45 },

      { id: 'b-1311-1315', hora: '11:30', ancora: 'fixo', tipo: 'show',
        titulo: 'Festival of the Lion King',
        descricao: '30 min. Show visual, sem barreira de idioma',
        contexto:
          'Espetáculo em teatro circular com acrobatas, cantores e carros alegóricos. É quase ' +
          'todo música e acrobacia, então o inglês não atrapalha. Cheguem 20 minutos antes ' +
          'para não sentar na primeira fila, que é ruim.\n\n' +
          'Vem logo depois do Gorilla Falls de propósito: os dois ficam na África, e assim ' +
          'vocês atravessam para Pandora uma vez só, já indo almoçar.\n\n' +
          'HORÁRIO FIXO de sessão — confiram a grade no app da Disney no dia e ajustem aqui ' +
          'se a sessão for outra. Se a mais próxima for muito diferente das 11h30, o almoço ' +
          'e o Zootopia acompanham.',
        areaParque: 'Africa', acesso: [], duracaoMin: 45, confirmarHorario: true },

      { id: 'b-1311-1215', hora: '12:15', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Satu’li Canteen',
        descricao: 'Balcão, em Pandora. Um dos melhores da Disney',
        contexto:
          'Serviço de balcão com tigelas montáveis — escolhem proteína e base. É ' +
          'consistentemente eleito o melhor quick service do Walt Disney World.\n\n' +
          'Usem mobile order pelo app: a fila do balcão aqui é longa e a do mobile order não ' +
          'existe. Peçam durante o Festival of the Lion King, sentados.\n\n' +
          'São dez minutos de caminhada da África até Pandora, e eles estão dentro da hora ' +
          'e quinze deste bloco — não é tempo de mesa, é tempo de chegar.\n\n' +
          'É a primeira vez que vocês pisam em Pandora hoje, e é de dia. Olhem as montanhas ' +
          'flutuantes agora, porque à noite o lugar é outro — e vocês voltam.',
        restauranteId: 'r-satuli', areaParque: 'Pandora', acesso: [], duracaoMin: 75 },

      { id: 'b-1311-1500', hora: '13:30', ancora: 'fixo', tipo: 'show',
        titulo: 'Zootopia: Better Zoogether!',
        descricao: 'Teatro da Árvore da Vida. 10 min',
        contexto:
          'Show em 3D com efeitos no teatro e um animatrônico novo. Substituiu o It’s Tough ' +
          'to be a Bug. A recepção da crítica foi ruim — acham frenético e esquecível.\n\n' +
          'É ar-condicionado e é curto. Se o dia atrasar, é o primeiro bloco a cair sem culpa.',
        areaParque: 'Discovery Island', acesso: [], duracaoMin: 30, opcional: true,
        confirmarHorario: true, pesquisa: '2026-09-08' },

      { id: 'b-1311-1345', hora: '14:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Discovery Island Trails e a Árvore da Vida',
        descricao: 'Trilhas curtas em volta da árvore. Quase ninguém faz',
        contexto:
          'Trilhas laterais que contornam a base da Árvore da Vida, com lêmures, lontras e ' +
          'cangurus. Quase ninguém entra — a maioria fotografa a árvore de longe e segue.\n\n' +
          'Olhem a árvore de perto: são mais de 300 animais esculpidos no tronco, e a ' +
          'estrutura é uma plataforma de petróleo reaproveitada. À noite ela vira outra coisa, ' +
          'e vocês vão ver isso na saída.',
        areaParque: 'Discovery Island', acesso: [], duracaoMin: 45 },

      { id: 'b-1311-1630', hora: '14:45', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Nomad Lounge — a varanda',
        descricao: 'O lugar mais gostoso do parque. Drink e petisco',
        contexto:
          'Bar ao lado do Tiffins, com varanda sobre a água e ventiladores. Drinks autorais e ' +
          'petiscos.\n\n' +
          'Costuma ter espera de 15 a 30 minutos e não aceita reserva — coloquem o nome na ' +
          'lista e passeiem enquanto esperam.\n\n' +
          'Esta hora é o VAZIO PROPOSITAL do dia, só que com sombra e bebida. Vocês vão ' +
          'precisar dela: a partir das 16h30 o dia não para mais até o jantar.',
        restauranteId: 'r-nomad', areaParque: 'Discovery Island', acesso: [], duracaoMin: 60 },

      { id: 'b-1311-1545p', hora: '15:45', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — antes da reta final',
        descricao: 'Garrafas cheias, power bank, e conferir o horário do safári',
        contexto:
          'A reta final começa agora e é coreografada minuto a minuto. Duas coisas antes:\n\n' +
          'CONFIRAM NO APP DA DISNEY A QUE HORAS O KILIMANJARO SAFARIS FECHA. Ele fecha 30 a ' +
          '60 minutos ANTES do parque, e o bloco das 16h30 depende disso. Se o último caminhão ' +
          'sair às 17h, está tudo bem. Se sair às 16h30, vão agora.\n\n' +
          'E confiram a hora do fechamento do parque, que é o que sustenta o bloco do Flight ' +
          'of Passage às 17h45.',
        areaParque: 'Discovery Island', acesso: [], duracaoMin: 45, critico: true },

      { id: 'b-1311-1631', hora: '16:30', ancora: 'fixo', tipo: 'atracao',
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
        areaParque: 'Africa', acesso: ['standby'], critico: true, duracaoMin: 45,
        fila: { min: 15, quando: 'na última hora', pico: 55, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1311-0900', hora: '17:15', ancora: 'fixo', tipo: 'atracao',
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
        fila: { min: 30, quando: 'no fim do dia', pico: 65, fonte: '2026-09-10' } },

      { id: 'b-1311-1120', hora: '17:45', ancora: 'fixo', tipo: 'atracao',
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
        pesquisa: '2026-09-10' },

      { id: 'b-1311-1730', hora: '18:40', ancora: 'fixo', tipo: 'livre',
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
          'Não corram. Este bloco não tem fila, não tem ingresso e é o que vocês vão lembrar.',
        areaParque: 'Pandora', acesso: [], duracaoMin: 25, pesquisa: '2026-09-10' },

      { id: 'b-1311-1830', hora: '19:05', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Uber para o Animal Kingdom Lodge',
        descricao: '~10 min. O Sanaa é em outro endereço',
        contexto:
          'O Animal Kingdom Lodge NÃO é dentro do parque — é um hotel a poucos minutos de ' +
          'carro. Deixem isso claro para o motorista: o destino é o hotel, não o parque.\n\n' +
          'Levem o número da reserva à mão. Chegando 19h30, vocês têm quinze minutos de ' +
          'folga antes da mesa.',
        localId: 'ak-lodge', acesso: [], duracaoMin: 25 },

      { id: 'b-1311-1945', hora: '19:45', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Sanaa',
        descricao: 'Vão pela comida, não pela janela',
        contexto:
          'Cozinha indiana com influência africana; o nome quer dizer “obra de arte” em ' +
          'suaíli.\n\n' +
          'NÃO PEÇAM MESA NA JANELA. O pôr do sol em 13/11 é por volta das 17h30 e vocês ' +
          'chegam às 19h45 — está escuro há mais de duas horas. A savana tem iluminação ' +
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
        restauranteId: 'r-sanaa', localId: 'ak-lodge', acesso: ['reserva'], duracaoMin: 90 },
    ],

    ficha: {
      multiPass: {
        usar: false, opcional: false, listaAlta: [], listaBaixa: [], planoB: null,
        nota:
          'Sem Multi Pass, e agora com mais razão que antes. O parque encolheu com o fim ' +
          'da DinoLand, e chegando na abertura pelo lado certo — África e Ásia, onde o ' +
          'Early Entry não vai — vocês resolvem a manhã inteira no standby, quase sem fila.',
      },
      singlePass: {
        itens: [],
        opcionais: ['Avatar Flight of Passage'],
        nota:
          'NÃO COMPREM EM 10/11. O Flight of Passage virou plano B pago: o dia foi montado ' +
          'para pegar a fila de 40 a 65 minutos do fim da tarde em vez dos 100 a 180 do ' +
          'pico, e para sair de Pandora no escuro em vez de na fila.\n\n' +
          'A compra só se justifica se o parque fechar cedo demais para o plano caber, ou ' +
          'se vocês decidirem que não querem 50 minutos de fila no fim de um dia de dez ' +
          'horas. E ela seria às 7h ET de 10/11, durante a conexão em Bogotá — o pior ' +
          'momento da viagem para depender de internet.',
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
        'Vocês pegam literalmente a PRIMEIRA noite da temporada, com Grinchmas e a ' +
        'projeção no castelo já rodando.', pesquisa: '2026-09-08' },
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
          'imprevisível e pode estourar. Se passar de 45 minutos, gastem uma reserva ' +
          'rolando do Multi Pass em vez de esperar.',
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
          'de água, fogo, barcos e um dragão. Cerca de 30 minutos. Não roda todas as ' +
          'noites, então confirmem no app antes de contar com ele. HORÁRIO FIXO.',
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
          'e completamente dependente de inglês. É descartável sem culpa.',
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
          'telas dos barcos. Cerca de 17 minutos. Aquela margem tem visão frontal e esvazia ' +
          'mais rápido na saída. HORÁRIO FIXO.',
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
          'silhueta dos prédios atrás. O pôr do sol em novembro é por volta das 17h30, ' +
          'então vocês chegam na hora exata.',
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
          'invertido. É por isso que vale fazer os dois sentidos.',
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
        'O SEAWORLD ABRE ÀS 10H, não às 9h como os parques da Disney. A referência do dia ' +
        'já está em 10h, o que deixa a chegada das 9h15 exatamente 45 minutos antes da ' +
        'abertura — como manda a regra de ouro nº 1. Se confirmarem outro horário, mudem a ' +
        'referência e o dia inteiro desloca junto.',
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
        'Racers — e são exatamente as três primeiras do dia. A ordem está certa.',
        pesquisa: '2026-09-08' },
      { tipo: 'info', texto:
        'Early Park Admission no Epic existe, mas só para hóspedes de hotel Universal. Vocês ' +
        'estão no Travelodge, então não têm. Isso significa que o parque já terá gente ' +
        'dentro quando vocês entrarem às 9h.', pesquisa: '2026-09-08' },
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
        'O BUSCH GARDENS ABRE ÀS 10H em novembro, não às 9h. A referência do dia já está em ' +
        '10h, o que deixa a chegada das 9h30 apenas 30 minutos antes. Como vocês querem ' +
        'entrar sempre na abertura, considerem antecipar a chegada para 9h15 e a saída do ' +
        'hotel para 6h45.',
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

    { id: 'r-nomad', nome: 'Nomad Lounge', data: '2026-11-13', hora: '14:45',
      refeicao: 'drink', local: 'Animal Kingdom · Discovery Island', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Lista de espera no local', blocoId: 'b-1311-1630',
      nota: 'Não aceita reserva. Coloquem o nome na lista e passeiem enquanto esperam.' },

    { id: 'r-sanaa', nome: 'Sanaa', data: '2026-11-13', hora: '19:45',
      refeicao: 'jantar', local: 'Animal Kingdom Lodge', alternativas: [],
      precisaReserva: true, janelaAbre: '2026-09-14', janelaHora: '06:00 ET',
      canal: 'My Disney Experience', blocoId: 'b-1311-1945',
      nota: 'Vão pela comida, não pela janela: às 19h45 de novembro está escuro há mais ' +
            'de duas horas e não se vê a savana. Peçam o Bread Service, cinco pães com ' +
            'nove acompanhamentos (~US$ 23), que é o motivo real de vir aqui. Fica no ' +
            'Animal Kingdom Lodge, não dentro do parque.' },

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
    { id: 'ck-0911', dataAlvo: '2026-09-11', hora: '06:00', fuso: 'ET',
      janelaReserva: true, critico: false, feitoPadrao: true,
      texto: 'The Boathouse (10/11) — RESERVADO, confirmação 2111918775',
      restauranteIds: ['r-boathouse'] },

    { id: 'ck-1209', dataAlvo: '2026-09-12', hora: '06:00', fuso: 'ET',
      janelaReserva: false, critico: false, feitoPadrao: true,
      texto: 'Magic Kingdom — DISPENSADA. Almoço e jantar do dia 11 viraram balcão ' +
             '(Columbia Harbour House e Casey’s), sem reserva. A janela de 12/09 caiu.',
      restauranteIds: ['r-columbia-harbour'] },

    { id: 'ck-1409', dataAlvo: '2026-09-14', hora: '06:00', fuso: 'ET',
      janelaReserva: true, critico: false,
      texto: 'Reservar Sanaa para o jantar de 13/11 (janela de 60 dias)',
      nota:
        'O sistema abre entre 5h45 e 6h ET — entrem 5h45, não 6h em ponto. O Sanaa é ' +
        'considerado fácil a moderado de conseguir, então não é caso de pânico. Se o ' +
        'app da Disney não mostrar mesa, tentem o OpenTable, que às vezes tem o que o ' +
        'app não mostra.\n\n' +
        'Reservem 19h45 e NÃO peçam mesa na janela: a essa hora está escuro e não se vê ' +
        'a savana. A escolha é pela comida.',
      restauranteIds: ['r-sanaa'] },

    { id: 'ck-1609', dataAlvo: '2026-09-16', hora: '06:00', fuso: 'ET',
      janelaReserva: true, critico: false,
      texto: 'Hollywood Studios: Oga’s Cantina e Sci-Fi Dine-In',
      restauranteIds: ['r-ogas', 'r-scifi'] },

    { id: 'ck-1709', dataAlvo: '2026-09-17', hora: '06:00', fuso: 'ET',
      janelaReserva: true, critico: false,
      texto: 'Epcot, se quiserem mesa em vez das barracas',
      restauranteIds: ['r-epcot-mesa'] },

    { id: 'ck-ingresso', dataAlvo: '2026-09-15', dataEstimada: true, motivoData: 'Bloqueia o plano de Lightning Lane inteiro', hora: null, fuso: null,
      janelaReserva: false, critico: true,
      texto: 'Confirmar com a agência a regra exata de validade do ingresso Disney de 4 dias',
      nota:
        'Virou a pendência mais importante da lista. Se o ingresso for date-based, o Multi ' +
        'Pass dos 4 dias sai numa compra só em 08/11. Se não for, são quatro compras separadas. ' +
        'Isso muda as quatro tarefas de Lightning Lane deste checklist.',
      restauranteIds: [] },

    { id: 'ck-shuttle', dataAlvo: '2026-10-06', dataEstimada: true,
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

    { id: 'ck-carro', dataAlvo: '2026-10-06', dataEstimada: true, motivoData: 'Preço de locadora sobe perto da data', hora: null, fuso: null,
      janelaReserva: false, critico: true,
      texto: 'Reservar o carro para 20 a 25/11, em filial de bairro na 192',
      restauranteIds: [] },

    { id: 'ck-columbia', dataAlvo: '2026-10-15', dataEstimada: true, motivoData: '30 dias antes do almoço de 14/11', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar o Columbia Restaurant para o almoço de 14/11 (Celebration)',
      restauranteIds: ['r-columbia'] },

    { id: 'ck-boggy', dataAlvo: '2026-10-21', dataEstimada: true, motivoData: '30 dias antes do passeio de 20/11', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar o Boggy Creek Airboat online para 20/11',
      restauranteIds: [] },

    /* --- prazo médio (outubro) --- */
    { id: 'ck-ing-disney', dataAlvo: '2026-10-01', dataEstimada: true,
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

    { id: 'ck-ing-universal', dataAlvo: '2026-10-25', dataEstimada: true,
      motivoData: 'Duas semanas antes da viagem, com folga para acionar a agência',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Ingressos Universal aparecendo no app — nos DOIS perfis',
      nota:
        'Cobre os dias 14, 17, 19, 23 e 25. Confiram especificamente que é PARK-TO-PARK ' +
        'e que o Epic Universe está incluído: o Hogwarts Express do dia 19 só funciona ' +
        'com park-to-park, e o Epic é ingresso à parte em muitas combinações.\n\n' +
        'Riscar só quando aparecer no app da Bianca também.',
      restauranteIds: [] },

    { id: 'ck-ing-united', dataAlvo: '2026-10-25', dataEstimada: true,
      motivoData: 'Junto com os da Universal, para resolver tudo numa conferência só',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Ingressos SeaWorld e Busch Gardens (Promo Park) — com o plano de refeição',
      nota:
        'Os dois parques são da mesma empresa e vieram na mesma compra. Confiram que o ' +
        'PLANO DE REFEIÇÃO está incluído nos dois: o roteiro do dia 22 e do dia 24 ' +
        'conta com ele para o almoço, e sem plano o custo desses dias muda.\n\n' +
        'Riscar só quando aparecer no app da Bianca também.',
      restauranteIds: [] },

    { id: 'ck-sharks', dataAlvo: '2026-10-01', dataEstimada: true, motivoData: 'Prazo de outubro, com folga para o site do parque', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar Sharks Underwater Grill (SeaWorld, direto no site do parque)',
      restauranteIds: ['r-sharks'] },

    { id: 'ck-mythos', dataAlvo: '2026-10-20', dataEstimada: true, motivoData: '30 dias antes do jantar de 19/11', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar o Mythos para o jantar de 19/11 (Islands of Adventure)',
      restauranteIds: ['r-mythos'] },

    { id: 'ck-homecomin', dataAlvo: '2026-10-22', dataEstimada: true,
      motivoData: '30 dias antes do jantar de 21/11',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Reservar o Homecomin\u2019 para o jantar de 21/11 (Disney Springs)',
      nota:
        'É o restaurante mais concorrido de Disney Springs e passa de uma hora de ' +
        'espera sem reserva — num dia que já termina tarde, vindo de Winter Garden. ' +
        'Se não conseguirem, o Polite Pig é a alternativa de balcão, sem espera, no ' +
        'mesmo lugar.',
      restauranteIds: ['r-homecomin'] },

    { id: 'ck-atlantic', dataAlvo: '2026-10-24', dataEstimada: true, motivoData: '30 dias antes do jantar de 23/11', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar o Atlantic para o jantar de 23/11 (Epic Universe)',
      nota: 'Marcado como reserva necessária por decisão de vocês, para forçar a revisitar ' +
            'e confirmar — mesmo que na prática aceite walk-in.',
      restauranteIds: ['r-atlantic'] },

    { id: 'ck-powerband', dataAlvo: '2026-10-15', dataEstimada: true, motivoData: 'Prazo de outubro, com folga para o site do parque', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Decidir sobre a Power-Up Band do Epic Universe (~US$ 40)',
      restauranteIds: [] },

    { id: 'ck-esim', dataAlvo: '2026-10-25', dataEstimada: true,
      motivoData: 'Duas semanas antes, com folga para contratar pacote se a linha da Bianca for cobrada por dia',
      hora: null, fuso: null, janelaReserva: false, critico: true,
      texto: 'Ativar o roaming nas duas linhas e confirmar se a da Bianca é cobrada por dia',
      nota:
        'São duas operadoras diferentes, com regras diferentes. Isso é bom — dá ' +
        'redundância, e dentro de parque lotado uma pode pegar sinal onde a outra não ' +
        'pega. Mas o custo funciona de jeito oposto nas duas.\n\n' +
        'PEDRO · CLARO PASSAPORTE AMÉRICAS\n' +
        'Vem incluso em todo plano pós-pago, sem custo extra, e usa a MESMA franquia do ' +
        'plano brasileiro. Só passa a cobrar R$ 39,90 por dia SE a franquia acabar. ' +
        'Ativação pelo *468, gratuito, ou pelo Minha Claro.\n\n' +
        'BIANCA · VIVO TRAVEL\n' +
        'Aqui está a pergunta que vale dinheiro. O Vivo Travel padrão custa R$ 39,99 POR ' +
        'DIA nas Américas, cobrado sempre que o serviço é usado pela primeira vez no dia ' +
        '— a menos que o plano dela já inclua. Em 17 dias, cobrado, dá cerca de R$ 680.\n\n' +
        'CONFIRMAR: o plano dela INCLUI o roaming ou ATIVA o pacote pago? \u201cTer o ' +
        'serviço\u201d pode significar as duas coisas.\n\n' +
        'SE FOR COBRADO POR DIA, existe saída: ela usa o roteador do celular do Pedro na ' +
        'maior parte do tempo e só liga o dela nos dias em que vocês se separam, ou se a ' +
        'franquia dele estourar. A cobrança é por dia de uso, então dia sem usar não ' +
        'custa nada.\n\n' +
        'NOS DOIS CASOS: ligar o roaming de dados nos ajustes do aparelho, além de ativar ' +
        'no app da operadora. E confirmar que a Colômbia está coberta — se estiver, a ' +
        'compra do Single Pass às 7h ET do dia 10 deixa de depender do wifi de Bogotá.',
      restauranteIds: [] },

    { id: 'ck-vip-outlet', dataAlvo: '2026-11-05', dataEstimada: true,
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

    { id: 'ck-natal-datas', dataAlvo: '2026-10-15', dataEstimada: true, motivoData: 'As datas dos eventos saem com antecedência', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Confirmar que 22/11 tem Christmas Celebration (SeaWorld) e 24/11 tem ' +
             'Christmas Town (Busch Gardens) — ambos rodam em datas selecionadas',
      restauranteIds: [] },

    /* --- já em Orlando --- */
    { id: 'ck-mco-reserve', dataAlvo: '2026-11-19', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar o MCO Reserve para a volta de 26/11',
      nota:
        'É GRÁTIS e reserva-se até 7 dias antes, em flymco.com. Garante uma faixa de ' +
        'horário numa fila dedicada do raio-x da TSA, sem precisar de TSA PreCheck nem ' +
        'CLEAR. Uma reserva cobre até 10 pessoas, então é uma só para os dois.\n\n' +
        'O Terminal C opera das 5h às 19h, para voos que decolam entre 6h30 e 22h30 — a ' +
        'decolagem de vocês é ~12h, então cabe. Reservem a faixa de 9h30 às 10h.\n\n' +
        'ATENÇÃO AO QUE ISSO NÃO É: o MCO Reserve é para a SAÍDA, no raio-x da TSA. Não ' +
        'tem nada a ver com a fila da imigração na chegada, em 10/11 — para aquela não ' +
        'existe atalho disponível a vocês. O Mobile Passport Control, que seria o ' +
        'equivalente, só aceita americanos, residentes permanentes, canadenses com B1/B2 ' +
        'e quem entra pelo Visa Waiver. O Brasil não está no Visa Waiver.',
      pesquisa: '2026-09-10',
      restauranteIds: [] },

    { id: 'ck-ll-0811', dataAlvo: '2026-11-08', hora: '07:00', fuso: 'ET',
      janelaReserva: false, critico: true,
      texto: 'Lightning Lane — Magic Kingdom (11/11): SÓ o Multi Pass',
      nota:
        'Cinco minutos antes de o sistema soltar as seleções. Cheguem decididos:\n\n' +
        'MULTI PASS — lista alta: Peter Pan. Lista baixa: Mansão e Buzz.\n' +
        'SINGLE PASS — NENHUM. Não comprem nada aqui.\n\n' +
        'NÃO peçam o Big Thunder nem o Jungle Cruise: os dois são lista alta e vocês vão ' +
        'fazer os dois de graça, no standby, antes das 11h. O Space Mountain entra rolando ' +
        'dentro do parque, assim que vocês usarem a Mansão às 11h.',
      restauranteIds: [] },

    { id: 'ck-ll-1011', dataAlvo: '2026-11-10', hora: '07:00', fuso: 'ET',
      janelaReserva: false, critico: false,
      texto: 'DECIDIR: comprar ou não o Single Pass do Flight of Passage (13/11)',
      nota:
        'VIROU DECISÃO, NÃO ALARME. O plano do dia 13 é fazer o Flight of Passage no fim ' +
        'do dia, quando a fila cai para 40 a 55 minutos contra 90 a 120 o resto do tempo. ' +
        'Se esse plano estiver de pé, não compra.\n\n' +
        'Comprem só se: o Animal Kingdom fechar cedo demais para o plano caber, ou vocês ' +
        'decidirem que 40 minutos de fila no fim de um dia de parque é demais. Nesse caso ' +
        'a compra é às 7h ET de hoje, durante a conexão em Bogotá — que é o pior momento ' +
        'da viagem para depender de internet. Mais um motivo para não precisar dela.',
      restauranteIds: [] },

    { id: 'ck-ll-1211', dataAlvo: '2026-11-12', hora: '07:00', fuso: 'ET',
      janelaReserva: false, critico: true,
      texto: 'Lightning Lane — Single Pass do Rise of the Resistance (para 15/11)',
      nota: 'Peçam janela até as 11h. Só necessário se o ingresso NÃO for date-based.',
      restauranteIds: [] },

    { id: 'ck-ll-1311', dataAlvo: '2026-11-13', hora: '07:00', fuso: 'ET',
      janelaReserva: false, critico: true,
      texto: 'Lightning Lane — Single Pass do Cosmic Rewind (para 16/11)',
      nota: 'Só necessário se o ingresso NÃO for date-based.',
      restauranteIds: [] },

    { id: 'ck-horarios-mk', dataAlvo: '2026-09-13', dataEstimada: true,
      motivoData: 'A Disney publica com 60 dias de antecedência, e 60 dias antes de 11/11 é 12/09',
      hora: null, fuso: null, janelaReserva: false, critico: true,
      texto: 'Conferir o horário oficial do Magic Kingdom em 11/11 e ajustar a referência do dia',
      nota:
        'O dia 11 inteiro assume abertura às 9h e fechamento às 22h. Se for diferente, ' +
        'mudem a referência na tela do dia 11 e tudo o que é ancorado desloca junto, ' +
        'inclusive a saída do hotel. O desfile e os fogos não deslocam.\n\n' +
        'Confiram na mesma visita: a hora do Festival of Fantasy (15h é o padrão), a ' +
        'hora do Happily Ever After (20h a partir de 01/11) e se a Tiana\u2019s voltou ' +
        'da reforma antes do previsto.',
      restauranteIds: [] },

    { id: 'ck-horarios', dataAlvo: '2026-10-10', dataEstimada: true, motivoData: 'A Disney publica os horários ~60 dias antes', hora: null, fuso: null,
      janelaReserva: false, critico: true,
      texto: 'Conferir horários oficiais dos demais parques e ajustar a referência de cada dia',
      nota: 'É só editar o horário de abertura no dia — os blocos ancorados deslocam sozinhos.',
      restauranteIds: [] },

    { id: 'ck-shows', dataAlvo: '2026-11-01', dataEstimada: true, motivoData: 'Horários de show só saem perto da data', hora: null, fuso: null,
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
      nota: 'Fica a 1,5 km do hotel, 4 minutos de carro. É a unidade mais próxima — há ' +
            'outra na E Osceola Pkwy, a 11,1 km, que não compensa.' },

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
      nota: 'O cupom do balcão custa US$ 10. O grátis é o Savings Passport do Simon ' +
            'VIP Club, cadastrado antes de viajar.' },

    { id: 'icon-park', nome: 'ICON Park', tipo: 'compras',
      lat: 28.4432, lng: -81.4693, verificado: true, fonteCoord: 'wikipedia', endereco: '8375 International Dr',
      doHotel: { tempoMin: 25, tempoFonte: 'estimado',
                 uberUSD: { min: 20, max: 30 }, uberFonte: 'estimado' } },

    { id: 'millenia', nome: 'The Mall at Millenia', tipo: 'compras',
      lat: 28.48538, lng: -81.431312, verificado: true, fonteCoord: 'wikipedia', endereco: '4200 Conroy Rd',
      doHotel: { tempoMin: 30, tempoFonte: 'documento',
                 uberUSD: { min: 28, max: 40 }, uberFonte: 'estimado' } },

    { id: 'best-buy', nome: 'Best Buy (Millenia ou I-Drive)', tipo: 'compras',
      lat: 28.4830, lng: -81.4290, verificado: false, fonteCoord: null, precisaColar: 'São duas lojas possíveis, Millenia e I-Drive. Escolham uma e colem a coordenada.', endereco: null,
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
  /* ---------------------------------------------------------------------------
     TELEFONES
     So entra numero conferido na fonte oficial. O da companhia aerea nao esta
     aqui de proposito: o certo para o bilhete de voces esta no proprio bilhete,
     e numero de companhia aerea achado em busca costuma ser de revenda.
     ------------------------------------------------------------------------ */
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
          'e ninguém atravessa essa linha até acabar. Se vocês estiverem do lado ' +
          'oeste (Frontierland, Liberty Square, Adventureland), fiquem lá: a próxima ' +
          'atração do roteiro é a Jungle Cruise, que é do mesmo lado, de propósito.',
        pesquisa: '2026-09-09',
      },
    },
  },

  contatos: [
    { id: 'tel-emergencia', nome: 'Emergência — polícia, bombeiro, ambulância',
      numero: '911', critico: true,
      quando:
        'De qualquer celular nos EUA, inclusive sem chip americano, sem crédito e ' +
        'com a tela bloqueada. É o número único para tudo.' },

    { id: 'tel-hotel', nome: 'Travelodge by Wyndham Orlando Lake Buena Vista South',
      numero: '+1 407-449-2357', critico: true,
      quando:
        'Recepção. Guardar mala antes do check-in, avisar que vocês chegam tarde, e o ' +
        'endereço para onde a companhia aérea entrega a mala extraviada.',
      verificado: '2026-09-09', fonte: 'wyndhamhotels.com' },

    { id: 'tel-disney-dining', nome: 'Disney — reservas de restaurante',
      numero: '+1 407-939-3463', critico: true,
      quando:
        'Cancelar ou remarcar o The Boathouse (10/11) e o Sanaa (13/11). CANCELEM COM ' +
        'PELO MENOS 2 HORAS de antecedência: abaixo disso a Disney cobra a taxa de não ' +
        'comparecimento no cartão. Dá para cancelar pelo My Disney Experience também.',
      verificado: '2026-09-09', fonte: 'disneyworld.disney.go.com' },

    { id: 'tel-boathouse', nome: 'The Boathouse — direto',
      numero: '+1 407-939-2628',
      quando:
        'O restaurante em si, para atraso de meia hora ou mudança de tamanho da mesa. ' +
        'Para cancelar de vez, a linha da Disney acima resolve igual.',
      verificado: '2026-09-09', fonte: 'theboathouseorlando.com' },

    { id: 'tel-aereo', nome: 'Companhia aérea', numero: null, precisaColar: true,
      quando:
        'NÃO ESTÁ AQUI DE PROPÓSITO. O número certo para o bilhete de vocês está no ' +
        'próprio bilhete eletrônico, e o que aparece em busca costuma ser de revendedor. ' +
        'Antes de embarcar, salvem o PDF do bilhete offline no celular: ele traz o ' +
        'telefone, o localizador e os números dos voos, que é tudo o que se pede quando ' +
        'a mala não chega ou o voo é remarcado.' },
  ],

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
        'Jurassic Park River Adventure (19/11) — molha bastante, levem capa\n' +
        'Journey to Atlantis (22/11) — molha bastante\n' +
        'Fyre Drill (23/11) — interativo, molha\n' +
        '\n' +
        'Já foram cortadas do roteiro por molharem demais: Infinity Falls (SeaWorld), ' +
        'Popeye e Dudley Do-Right (Islands), Congo River Rapids e Stanley Falls (Busch).\n\n' +
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
        'A regra de ouro número 1 é a mais importante da viagem e a que mais gente executa ' +
        'errado.\n\n' +
        'Chegar "na abertura" não é chegar às 9h. É estar dentro do portão às 9h — o que ' +
        'significa chegar 45 minutos antes, passar segurança, passar catraca, e estar de pé no ' +
        'ponto certo do parque quando soltarem.\n\n' +
        'São 45 minutos em todo parque com estacionamento na porta. No MAGIC KINGDOM são 75, ' +
        'e cada dia diz o número dele — sigam o do dia, não este.\n\n' +
        'No Magic Kingdom há um agravante: o Uber deixa vocês no TTC, e ainda falta monotrilho ' +
        'ou barco. Por isso a saída do hotel é às 6h45 para uma abertura às 9h.\n\n' +
        'Onde ficar de pé enquanto espera define o que vocês fazem primeiro. Cada dia diz o ' +
        'ponto: FRONTIERLAND no Magic Kingdom, checkpoint da ÁFRICA no Animal Kingdom, ' +
        'à esquerda sentido Hogsmeade no Islands, Galaxy\u2019s Edge no Hollywood Studios, ' +
        'Beco Diagonal no Universal Studios.\n\n' +
        'NOS DOIS PARQUES DA DISNEY O PONTO É CONTRAINTUITIVO, e é de propósito. Vocês não ' +
        'têm Early Entry em lugar nenhum — não estão em hotel Disney nem Universal. Isso ' +
        'significa que os hóspedes já estão DENTRO do parque meia hora antes de vocês, e ' +
        'já estão de pé onde o Early Entry deixa entrar. Correr para lá é chegar atrás ' +
        'deles.\n\n' +
        'A saída é ir onde o Early Entry NÃO vai: Frontierland no Magic Kingdom, África e ' +
        'Ásia no Animal Kingdom. São as áreas que ficam vazias exatamente na hora em que ' +
        'todo mundo está aglomerado do outro lado.',
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
