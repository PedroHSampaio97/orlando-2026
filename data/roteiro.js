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
      'roteiro assumem abertura às 9h, com duas exceções anotadas: o ANIMAL KINGDOM ' +
      'às 8h (13/11) e o Busch Gardens às 10h (24/11). O SeaWorld (22/11) também está em ' +
      '9h, pela previsão do Queue-Times. Confiram em novembro e ajustem a referência do ' +
      'dia — os blocos ancorados deslocam junto, mas as retas finais dos dias 11, 13 e 22 ' +
      'são fixas de propósito e não se mexem.',

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
      'Troca dos dias confirmada — 19 Epic Universe, 21 Winter Garden, 22 SeaWorld, 23 Islands of Adventure',
      'Sem Mickey’s Very Merry Christmas Party',
      'Sem Express Pass na Universal',
      'Carro alugado de 20 a 25/11 — devolvido no dia 25, para o dia 26 ser só ' +
      'café da manhã e aeroporto',
      'PID (Permissão Internacional para Dirigir) já emitida',
    ],
  },

  /* ---------------------------------------------------------------------------
     REGRAS DE OURO — Parte 3 do documento
     ------------------------------------------------------------------------ */
  regrasDeOuro: [
    { n: 1, momento: 'todo-dia', titulo: 'Rope drop vale mais que qualquer passe.',
      texto: 'A primeira hora de parque rende o que as três da tarde rendem. Chegar 45 ' +
             'minutos antes da abertura é a decisão mais barata e mais eficaz da viagem.' },
    { n: 2, momento: 'todo-dia',
      titulo: 'Não reserve Multi Pass para o que você vai fazer no rope drop.',
      texto: 'Erro clássico: reservar a atração que já estaria vazia às 9h e depois ' +
             'enfrentar fila de 80 minutos no resto.' },
    { n: 3, momento: 'todo-dia', titulo: 'Use a primeira reserva do Multi Pass cedo.',
      texto: 'O sistema só libera a próxima depois que você usa a atual. Quem usa às 11h ' +
             'faz o dobro de quem usa às 15h.' },
    { n: 4, momento: 'todo-dia', titulo: 'Mobile order em tudo que for balcão.',
      texto: 'Disney e Universal permitem pedir pelo app e só buscar. Economiza 20 a 30 ' +
             'minutos por refeição.' },
    { n: 5, momento: 'todo-dia', titulo: 'Almoço às 11h30 ou às 14h.',
      texto: 'Meio-dia é o pico. E as filas das atrações caem exatamente quando todo mundo ' +
             'está comendo — use isso.' },
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
             '6. Com a garrafa reutilizável da lista do Walmart, vira reabastecimento o dia ' +
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
          singlePass: 'Nenhum — os dois viraram plano B pago', custo: { min: 40, max: 70 } },
        { data: '2026-11-13', parque: 'Animal Kingdom',    multiPass: 'Não',
          singlePass: 'Flight of Passage — só se o fim de dia não resolver', custo: { min: 0, max: 40 } },
        { data: '2026-11-15', parque: 'Hollywood Studios', multiPass: 'Sim',
          singlePass: 'Rise of the Resistance',                  custo: { min: 115, max: 130 } },
        { data: '2026-11-16', parque: 'Epcot',             multiPass: 'Sim',
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
            'MULTI PASS, dia a dia: 11/11 Peter Pan / Mansão / Buzz. 13/11 nenhum, o ' +
            'Animal Kingdom não usa. 15/11 Slinky Dog / Torre do Terror / Toy Story Mania. ' +
            '16/11 Frozen / Remy / Test Track.\n\n' +
            'SINGLE PASS: a regra é 3 dias antes de CADA visita — mas a lista encolheu. ' +
            'Com os quatro dias já refeitos, sobraram DOIS momentos, não quatro:\n' +
            '  · Seven Dwarfs e TRON (11/11) → NÃO COMPRAR. Viraram plano B pago, ' +
            'resolvidos por janela de horário dentro do parque.\n' +
            '  · Flight of Passage (13/11) → NÃO COMPRAR antes. Se for preciso, compra-se ' +
            'dentro do parque às 17h30.\n' +
            '  · Rise of the Resistance (15/11) → comprar 12/11\n' +
            '  · Cosmic Rewind (16/11) → comprar 13/11\n\n' +
            'O custo do Epcot aqui em cima foi calculado quando o Multi Pass daquele dia ' +
            'ainda era opcional. Ele virou decisão de comprar, então o piso é mais alto ' +
            'que os US$ 36 da tabela.\n\n' +
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
          'enfrentariam a fila que incomoda. No Epic, o ingresso cobre dois dias e custa ' +
          'zero a mais; o Express custa US$ 600 no casal por um.\n\n' +
          'ATENÇÃO: o segundo dia de Epic saiu do roteiro em 10/09, quando a noite de 25/11 ' +
          'virou a despedida no Disney Springs. O ingresso continua com os dois dias — o que ' +
          'a viagem não tem mais é a segunda visita agendada.',
        alternativa:
          'Se algum dia específico ficar insuportável, existe o Express Pass Now dentro do ' +
          'parque — US$ 20 a 30, uma atração.',
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
          'saindo ou tem informação conflitante. Perguntem na entrada.\n\n' +
          'A fila de single rider abre e fecha ao longo do dia. A placa na entrada manda.',
        pesquisa: '2026-09-10',
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
          'Esqueçam o Disney Springs hoje. Vocês voltam mais adiante na viagem e, ' +
          'honestamente, a volta é melhor: tem o Christmas Tree Stroll e a decoração de ' +
          'Natal, que hoje ainda não existe.',
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
            motivo: 'Duas garrafas por pessoa nos dias de parque, completadas com a água gelada ' +
                    'grátis dos balcões. Não paguem por Dasani nem Aquafina: é a mesma água ' +
                    'purificada. Com a garrafa reutilizável da seção Casa, 24 bastam.' },
          { id: 'isotonico', secao: 'Bebidas', essencial: true,
            texto: 'Isotônico',
            marca: 'Gatorade Zero', alternativaBarata: 'em pó: Propel Powder Packets',
            motivo: 'Doze horas em pé desidratam mais do que parece. O Zero não tem açúcar e ' +
                    'não empapuça. O pó ocupa menos espaço: um sachê na garrafa reutilizável.' },
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

          { id: 'garrafa', secao: 'Casa', essencial: true,
            texto: 'Garrafa reutilizável — uma por pessoa',
            marca: 'Owala FreeSip 24oz', alternativaBarata: 'Contigo Autoseal',
            motivo: 'É o que transforma a regra de ouro 7 em economia de verdade: sem garrafa, a ' +
                    'água gelada grátis vira um copinho bebido na hora; com garrafa, vira ' +
                    'reabastecimento o dia inteiro.' },
          { id: 'utensilios', secao: 'Casa', essencial: false,
            texto: 'Tigela de micro-ondas, talheres e guardanapos',
            marca: null, alternativaBarata: 'versão descartável',
            motivo: 'Micro-ondas de quarto de hotel pode vir sem louça. Sem tigela, a aveia, o ' +
                    'arroz e a sopa não servem de nada.' },
          { id: 'sabao', secao: 'Casa', essencial: false,
            texto: 'Sabão de lavanderia + moedas de 25 centavos',
            marca: 'Tide Pods, embalagem pequena', alternativaBarata: null,
            motivo: 'O Travelodge tem lavanderia de moeda, e são 16 dias. A moeda de 25 ' +
                    'centavos (quarter) é a que a máquina usa. A segunda rodada tem bloco na ' +
                    'manhã livre do dia 20.' },
          { id: 'ziploc', secao: 'Casa', essencial: false,
            texto: 'Sacos Ziploc grandes',
            marca: 'Ziploc, tamanho gallon', alternativaBarata: 'Great Value',
            motivo: 'Celular nas atrações que molham, roupa molhada, troco — e o que sobrar da ' +
                    'comida do quarto.' },
          { id: 'capa-chuva', secao: 'Casa', essencial: true,
            texto: 'Capas de chuva descartáveis — 8 unidades',
            marca: null, alternativaBarata: null,
            motivo: 'São QUATRO atrações que molham de verdade, e vocês são dois: Kali River ' +
                    'Rapids no dia 13, Fyre Drill no 19 (opcional), Journey to Atlantis no 22 ' +
                    'e Jurassic Park River Adventure no 23. Oito usos. Procurem "disposable ' +
                    'rain poncho" na seção de camping.' },
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
        motivo: 'Cookie de meio quilo, fama justificada. A fila é longa e costuma ter espera ' +
                'virtual pelo app — entrem na lista assim que chegarem e passeiem enquanto isso.',
        pesquisa: '2026-09-08' },
      { nome: 'Amphicar Tour', quando: 'descartado', custo: 'US$ 125 por carro',
        motivo: 'DESCARTADO em 08/09 por preço. Um carro dos anos 60 que entra no lago com ' +
                'vocês dentro, 20 minutos. Fica registrado aqui só para não ser reproposto: ' +
                'US$ 62 por cabeça por 20 minutos não passa no teste.',
        pesquisa: '2026-09-08' },
      { nome: 'Aerophile — balão cativo', quando: 'na volta', custo: '~US$ 25',
        motivo: 'Sobe 120 m preso por cabo, 8 minutos, vista de até 16 km. Não voa com vento ' +
                'forte, então nunca dá para contar com ele.',
        pesquisa: '2026-09-08' },
      { nome: 'Christmas Tree Stroll', quando: 'na volta', condicao: 'só existe a partir de 13/11',
        custo: 'grátis',
        motivo: 'A decoração de Natal do Disney Springs começa em 13/11. Hoje não existe. ' +
                'É exatamente por isso que existe uma segunda ida ao Disney Springs — a ' +
                'noite dela ainda está para ser escolhida.' },
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
                  'tudo comprado hoje no Walmart. Montar hoje evita abrir mala às 6h.\n\n' +
                  'E UMA CAMADA LEVE PARA CADA UM. Amanhã vocês saem às 6h45 com uns 15°C, ' +
                  'ao meio-dia faz 27 e às 20h, parados na Main Street esperando os fogos, ' +
                  'volta para 16. A camada sai vestida, passa a tarde na mochila e volta ' +
                  'antes dos fogos.' },

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
        localId: 'disney-springs', acesso: [], duracaoMin: 85 },

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
        descricao: 'Uber, ~20 min, US$ 15–25. Amanhã sai às 6h45',
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
        'O dia 11 sai às 6h45, o parque fecha às 22h e, com o ferry e o Uber, vocês ' +
        'chegam ao hotel perto das 23h. São dezessete horas de pé. O dia 12 é de ' +
        'propósito o mais leve da primeira semana, e a lista é curta porque tem que ser.',
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
          'só pedir. Não comprem garrafa a US$ 4 lá dentro — recarreguem as de vocês.\n\n' +
          'PONTO DE ENCONTRO DE HOJE: o coreto da Town Square, logo depois da catraca. Se ' +
          'vocês se perderem, vão para lá e ESPEREM — não saiam procurando. Combinem isso ' +
          'agora, na fila, e não depois.',
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
        critico: true, duracaoMin: 37, pesquisa: '2026-09-10',
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
        areaParque: 'Adventureland', acesso: ['standby'], duracaoMin: 39,
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
        duracaoMin: 52 },

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
          'COMAM ALGUMA COISA DA MOCHILA AGORA. O almoço foi 12h45 e o jantar é 17h55 — ' +
          'são cinco horas, com o desfile e a fila do TRON no meio. Barrinha, fruta, o ' +
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
        areaParque: 'Tomorrowland', acesso: ['multi-pass'], duracaoMin: 33,
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
        areaParque: 'Fantasyland', acesso: ['standby'], critico: true, duracaoMin: 51,
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
          'Do TTC até o hotel, contem 45 a 60 minutos e US$ 22–32 de Uber. Com o ferry, ' +
          'vocês chegam perto das 23h.',
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
        { nome: 'PeopleMover — 10 min sentado e quase sempre walk-on, mas o dia já tem ' +
                 'três paradas e a Tomorrowland está cheia de bloco entre 15h30 e 17h55' },
        { nome: 'Walt Disney World Railroad — dá a volta no parque em ~20 min, e o dia não ' +
                 'tem 20 minutos livres em lugar nenhum' },
        { nome: 'Many Adventures of Winnie the Pooh' },
        { nome: 'Swiss Family Treehouse — escadaria longa, e o dia já tem 25 mil passos' },
        { nome: 'Prince Charming Regal Carrousel — mesma família do Dumbo e do Mad Tea ' +
                 'Party, que também ficaram de fora' },
      ],
      idioma: {
        itens: ['Hall of Presidents', 'Country Bear Jamboree',
                'Monsters Inc. Laugh Floor', 'Enchanted Tiki Room'],
        motivo:
          'São atrações longas, faladas e com humor que depende de referência americana. São ' +
          '20 a 25 minutos cada que rendem muito mais em outro lugar.',
      },
      fechado: [
        'Carousel of Progress — fechou em 06/07/2026 para uma reforma que troca as quatro ' +
        'cenas e põe um animatrônico do Walt abrindo o show. Volta só no fim da primavera ' +
        'de 2027, sem data anunciada',
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

        { texto: 'Decidir HOJE o Lightning Lane do dia 16, que se compra às 7h de amanhã',
          critico: true,
          motivo: 'Às 7h de amanhã vocês já saíram: a saída é 6h30. A compra vai ser no ' +
                  'celular, dentro do Uber ou na fila da catraca do Animal Kingdom, e não ' +
                  'é hora de escolher atração. Deixem decidido: Multi Pass com Frozen na ' +
                  'lista alta, Remy e Test Track na baixa, e Single Pass do Cosmic Rewind ' +
                  'com janela entre 9h30 e 10h.' },

        { texto: 'Decidir sobre o Kali River Rapids olhando a previsão', critico: false,
          motivo: 'Ele está às 9h15 e molha de verdade. Em novembro Orlando amanhece por ' +
                  'volta dos 15°C. Se a mínima de amanhã estiver baixa, decidam HOJE que ' +
                  'vão pular — ganham 35 minutos e não passam o dia com roupa molhada.' },

        { texto: 'Mochila remontada e celular carregando', critico: true,
          motivo: 'O de sempre: duas garrafas de água, barrinhas, protetor solar, power ' +
                  'bank e cabo.\n\n' +
                  'E TRÊS COISAS SÓ DE AMANHÃ, se vocês forem fazer o Kali River Rapids às ' +
                  '9h15: duas capas de chuva, um saco Ziploc para o celular e um par de ' +
                  'meias secas. O Kali não é respingo, é balde — e depois dele ainda são ' +
                  'nove horas de parque.\n\n' +
                  'Uma camada leve também: amanhã amanhece por volta dos 15°C e vocês saem ' +
                  'às 6h30. Ao meio-dia ela vai para a mochila.' },

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
        descricao: 'Uber, ~25 min, US$ 20–30. Amanhã sai às 6h30',
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
          'FECHOU MAIS TARDE (19h ou 20h): o dia respira, MAS CUIDADO COM O SANAA. A mesa é ' +
          'às 19h45 e a Disney cobra taxa de não comparecimento, com cancelamento exigido ' +
          'com 2 horas de antecedência (+1 407-939-3463).\n\n' +
          'Com fechamento às 19h: empurrem o safári para as 17h30 e entrem na fila do ' +
          'Flight of Passage às 18h45. Vocês saem por volta das 19h30 e o jantar continua ' +
          'de pé, apertado.\n\n' +
          'Com fechamento às 20h: NÃO dá para fazer as duas coisas. Ou vocês remarcam o ' +
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

      { nome: 'Starlight Safari', quando: 'descartado',
        custo: 'US$ 75 a 89 por pessoa · US$ 150 a 178 no casal',
        motivo:
          'DESCARTADO em 10/09, e a decisão é fácil de defender. Safári noturno na ' +
          'savana do Animal Kingdom Lodge, 1h30, com óculos de visão noturna, saindo ' +
          'às 20h30 e às 22h. Não exige estar hospedado lá, e o encaixe era bom: ' +
          'vocês já estarão no Lodge para o Sanaa.\n\n' +
          'Dois motivos derrubaram. O preço — US$ 150 a 178 no casal, e vocês já ' +
          'descartaram o Amphicar a US$ 62 por cabeça, então a régua é a mesma. E o ' +
          'fato de que SERIA O TERCEIRO SAFÁRI DO MESMO DIA: o roteiro já faz o ' +
          'Kilimanjaro de manhã e de novo ao entardecer, quando os leões acordam.\n\n' +
          'Fica registrado para não ser reproposto.',
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
          motivo: 'O dia 14 só sai do hotel às 11h e o bloco das 9h é vazio de propósito. ' +
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
        descricao: 'Uber, ~35 min, US$ 20–30. O AK tem entrada direta',
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
          'Café da manhã aqui, das barrinhas da mochila. O almoço é só às 12h30.\n\n' +
          'PONTO DE ENCONTRO DE HOJE: a base da Árvore da Vida, na Discovery Island. É ' +
          'visível de quase todo o parque e todo caminho passa por ela. Se vocês se ' +
          'perderem, vão para lá e ESPEREM.',
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
        areaParque: 'Africa', acesso: ['rope-drop', 'standby'], critico: true, duracaoMin: 34,
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
          'que entrou cedo foi para Pandora.\n\n' +
          'SINGLE RIDER: a Disney retirou a placa da fila de single rider em julho de 2026, e ' +
          'ela deve acabar. Se precisarem, perguntem ao funcionário da entrada.',
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
        areaParque: 'Asia', acesso: [], duracaoMin: 39 },

      { id: 'b-1311-1030p', hora: '10:35', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — água, banheiro e sentar',
        descricao: 'Quinze minutos. Vocês estão de pé desde as 5h30',
        contexto:
          'Banheiro, encher as garrafas num balcão de comida (água gelada de graça, é só ' +
          'pedir) e sentar.\n\n' +
          'Toda land tem banheiro, normalmente ao lado do maior balcão de comida. Não vale ' +
          'procurar no mapa; vale parar quando o corpo pedir.',
        areaParque: 'Africa', acesso: [], duracaoMin: 15 },

      { id: 'b-1311-1545', hora: '10:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Gorilla Falls Exploration Trail',
        descricao: 'Trilha. Ritmo lento de propósito',
        contexto:
          'Trilha a pé com gorilas, hipopótamos vistos por baixo d’água e um aviário. ' +
          'Diferente do safári, aqui vocês param quanto quiserem.',
        areaParque: 'Africa', acesso: [], duracaoMin: 40 },

      { id: 'b-1311-1315', hora: '11:30', ancora: 'fixo', tipo: 'show',
        titulo: 'Festival of the Lion King — chegar 11h30, show 11h50',
        descricao: 'Os 20 min de chegar antes estão dentro deste bloco',
        contexto:
          'Espetáculo em teatro circular com acrobatas, cantores e carros alegóricos. É quase ' +
          'todo música e acrobacia, então o inglês não atrapalha.\n\n' +
          'CHEGUEM 11H30 PARA O SHOW DE 11H50. Os vinte minutos de antecedência não são ' +
          'exagero: a plateia é por ordem de chegada e a primeira fila é ruim. Este bloco ' +
          'já tem esse tempo dentro dele — não é folga.\n\n' +
          'Vem logo depois do Gorilla Falls de propósito: os dois ficam na África, e assim ' +
          'vocês atravessam para Pandora uma vez só, já indo almoçar.\n\n' +
          'HORÁRIO FIXO de sessão — confiram a grade no app da Disney no dia e ajustem aqui ' +
          'se a sessão for outra. Se a mais próxima for muito diferente das 11h30, o almoço ' +
          'acompanha.',
        areaParque: 'Africa', acesso: [], duracaoMin: 50, confirmarHorario: true },

      { id: 'b-1311-1215', hora: '12:30', ancora: 'referencia', tipo: 'refeicao',
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
        restauranteId: 'r-satuli', areaParque: 'Pandora', acesso: [], duracaoMin: 65 },

      { id: 'b-1311-1345', hora: '13:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Discovery Island Trails e a Árvore da Vida',
        descricao: 'Trilhas curtas em volta da árvore. Quase ninguém faz',
        contexto:
          'Trilhas laterais que contornam a base da Árvore da Vida, com lêmures, lontras e ' +
          'cangurus. Quase ninguém entra — a maioria fotografa a árvore de longe e segue.\n\n' +
          'Olhem a árvore de perto: são mais de 300 animais esculpidos no tronco, e a ' +
          'estrutura é uma plataforma de petróleo reaproveitada. À noite ela vira outra coisa, ' +
          'e vocês vão ver isso na saída.',
        areaParque: 'Discovery Island', acesso: [], duracaoMin: 45 },

      { id: 'b-1311-1630', hora: '14:25', ancora: 'referencia', tipo: 'refeicao',
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

      { id: 'b-1311-1545p', hora: '15:25', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — antes da reta final',
        descricao: 'Garrafas cheias, power bank, e conferir o horário do safári',
        contexto:
          'A reta final começa agora e é coreografada minuto a minuto.\n\n' +
          'COMAM ALGUMA COISA DA MOCHILA. Os petiscos do Nomad foram às 14h25 e o Sanaa é ' +
          'às 19h45 — cinco horas, com o safári, o Na\u2019vi e 55 minutos de fila do ' +
          'Flight of Passage no meio. Entrar naquela fila com fome é o erro mais fácil de ' +
          'evitar do dia.\n\n' +
          'E duas conferências antes de tudo:\n\n' +
          'CONFIRAM NO APP DA DISNEY A QUE HORAS O KILIMANJARO SAFARIS FECHA. Ele fecha 30 a ' +
          '60 minutos ANTES do parque, e o bloco das 16h30 depende disso. Se o último caminhão ' +
          'sair às 17h, está tudo bem. Se sair às 16h30, vão agora.\n\n' +
          'E confiram a hora do fechamento do parque, que é o que sustenta o bloco do Flight ' +
          'of Passage às 17h45.',
        areaParque: 'Discovery Island', acesso: [], duracaoMin: 15, critico: true },

      { id: 'b-1311-1041', hora: '15:45', ancora: 'fixo', tipo: 'atracao',
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
        fila: { min: 20, quando: 'no fim da tarde', pico: 40, estimado: true, fonte: '2026-09-10' } },

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
        areaParque: 'Africa', acesso: ['standby'], critico: true, duracaoMin: 35,
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
          'Não corram. Este bloco não tem fila, não tem ingresso e é o que vocês vão lembrar.\n\n' +
          'A WINDTRADERS FICA NA SAÍDA DO FLIGHT OF PASSAGE, e é a única loja de Pandora. ' +
          'Se vocês querem trazer alguma coisa deste dia, é aqui e é agora — amanhã não ' +
          'passa por aqui, e a loja fecha junto com o parque. Vale entrar mesmo que seja ' +
          'só para olhar.',
        areaParque: 'Pandora', acesso: [], duracaoMin: 25, pesquisa: '2026-09-10' },

      { id: 'b-1311-1830', hora: '19:05', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Uber para o Animal Kingdom Lodge',
        descricao: 'Uber, ~10 min, US$ 10–15. O Sanaa é em outro endereço',
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

      { id: 'b-1311-2115', hora: '21:15', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Uber, ~25 min, US$ 20–30',
        contexto:
          'Chamem do saguão do Animal Kingdom Lodge, não da porta do restaurante — a ' +
          'entrada de carro do hotel é onde o motorista consegue parar.\n\n' +
          'São dezesseis horas de pé desde as 5h30. Amanhã não tem alarme.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 25 },
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
          'horas.\n\n' +
          'E NÃO PRECISA DECIDIR EM BOGOTÁ. Como o TRON no dia 11, o Single Pass do Flight ' +
          'of Passage se compra NA HORA, pelo app, de pé dentro do parque. É por isso que ' +
          'ele é plano B e não compra antecipada: vocês decidem às 17h30, olhando a fila, ' +
          'e não às 7h da manhã de 10/11 no meio de uma conexão.',
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
      'numa segunda-feira, com menos gente.',

    avisos: [
      'O GRINCHMAS É O ÚNICO COMPROMISSO DE RELÓGIO DA NOITE. Plateia por ordem de chegada, ' +
      'sem Express Pass, e a grade típica termina às 18h30. O roteiro mira a sessão das ' +
      '17h30 para ter a das 18h30 como plano B.',
      'Não tentem atração grande hoje. Hagrid’s, VelociCoaster e Forbidden Journey são do ' +
      'dia 23, e hoje o parque está no pico do ano.',
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
        motivo: 'DESCARTADO em 10/09 pela espera. Restaurante steampunk no CityWalk, famoso ' +
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
          motivo: 'Multi Pass: Slinky Dog Dash na lista alta, Torre do Terror e Toy Story ' +
                  'Mania na baixa. Single Pass do Rise of the Resistance, se vocês ' +
                  'compraram em 12/11. Se faltar alguma, hoje ainda dá para replanejar.' },
        { texto: 'Conferir o horário de abertura do Hollywood Studios', critico: true,
          motivo: 'O dia 15 assume 9h. Se for outro, mudem a referência e a manhã inteira ' +
                  'desloca junto, inclusive a saída das 7h.' },
        { texto: 'Alarme para 6h nos dois celulares', critico: true,
          motivo: 'Saída às 7h. Depois de uma noite que termina às 22h, um alarme só falha.' },
        { texto: 'Mochila montada ANTES de sair para a Universal', critico: true,
          motivo: 'Voltando perto das 22h, ninguém monta mochila. Deixem pronta agora, na ' +
                  'hora do descanso da tarde: garrafas, barrinhas, protetor solar, power ' +
                  'bank, cabo e uma camada leve para cada um.' },
        { texto: 'Reservas do Oga’s Cantina e do Sci-Fi Dine-In à mão',
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
          'PONTO DE ENCONTRO DE HOJE: a fonte do Port of Entry, logo depois da catraca. O ' +
          'parque é um anel e ela é o único ponto por onde todo mundo passa.',
        localId: 'islands-of-adventure', acesso: [], duracaoMin: 15 },

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
        pesquisa: '2026-09-10' },

      { id: 'b-1411-1845', hora: '17:30', ancora: 'referencia', tipo: 'show',
        titulo: 'Grinchmas Who-liday Spectacular',
        descricao: 'O motivo de vocês estarem aqui hoje',
        contexto:
          'Musical ao vivo de cerca de 30 minutos com o Grinch e os Whos, em teatro coberto. ' +
          'O ator do Grinch improvisa com a plateia e é o ponto alto. É falado em inglês, mas ' +
          'a história é conhecida e a produção é muito visual.\n\n' +
          'POR QUE A SESSÃO DAS 17H30 E NÃO A DAS 18H30: a grade típica termina às 18h30. ' +
          'Mirando a penúltima, vocês ganham a última como plano B em vez de não ter nenhuma. ' +
          'E saem do teatro já no escuro, que é quando Hogsmeade fica boa.\n\n' +
          'HORÁRIO A CONFIRMAR no app da Universal. É ele que ancora a noite: mudou a sessão, ' +
          'mudem a referência e tudo até a cerveja amanteigada desloca junto.',
        areaParque: 'Seuss Landing', acesso: [], duracaoMin: 30,
        confirmarHorario: true, critico: true, pesquisa: '2026-09-10' },

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
          'vocês vão estar atrás do Hagrid\u2019s e do VelociCoaster, e ninguém para numa ' +
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
          'Com o pôr do sol às 17h28, a primeira deve cair entre 18h e 19h15. Confiram no app.',
        areaParque: 'Hogsmeade', acesso: [], duracaoMin: 35,
        confirmarHorario: true, pesquisa: '2026-09-10' },

      { id: 'b-1411-1950', hora: '19:15', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Flight of the Hippogriff — ou mais Hogsmeade',
        descricao: 'Opcional. Vocês repetem esta atração no dia 23',
        contexto:
          'Montanha-russa infantil de 1 minuto. Vale pela vista do castelo de Hogwarts e da ' +
          'cabana do Hagrid, iluminados.\n\n' +
          'VOCÊS ANDAM NELA DE NOVO NO DIA 19, às 17h50. Hoje é bônus, não meta.\n\n' +
          'O texto da noite diz para andar devagar e olhar, e este bloco existe para ser ' +
          'gasto do jeito que vocês quiserem: se a fila estiver abaixo de 20 minutos, ' +
          'andem; se não, fiquem no pátio vendo a projeção outra vez — ela repete a cada ' +
          'vinte minutos e as sessões mais tarde são melhores.',
        areaParque: 'Hogsmeade', acesso: ['standby'], opcional: true, duracaoMin: 45,
        condicao: 'Só se a fila estiver abaixo de 20 min',
        fila: { min: 15, quando: 'à noite', pico: 45, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1411-2100', hora: '20:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Three Broomsticks',
        descricao: 'Dentro da Hogsmeade decorada. Sem sair do cenário',
        contexto:
          'Balcão temático dentro de Hogsmeade, com vigas de madeira e sombras de professores ' +
          'projetadas no teto. Frango assado, costela, fish and chips e o Great Feast para ' +
          'dividir.\n\n' +
          'A ESCOLHA FOI DELIBERADA. O Toothsome, no CityWalk, não aceita reserva e a espera ' +
          'passa de uma hora em fim de semana — num sábado de abertura de temporada, depois ' +
          'de um dia inteiro, é esperar em pé no estacionamento social. Aqui vocês comem ' +
          'dentro da decoração que vieram ver.\n\n' +
          'É balcão: não leva gorjeta.',
        restauranteId: 'r-broomsticks-14', areaParque: 'Hogsmeade', acesso: [],
        duracaoMin: 90 },

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
    subtitulo: 'O dia mais caro em passes · e o mais justificado',
    tipo: 'parque',
    operadora: 'disney',
    parqueId: 'hollywood-studios',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-10',
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },

    resumo:
      'O parque mais difícil da Disney, e o único dos três em que o Single Pass se ' +
      'justifica. A manhã é no Toy Story Land, onde a multidão do Early Entry não vai; a ' +
      'noite tem duas reservas e o Fantasmic, e por isso não sobra janela de graça para o ' +
      'Rise of the Resistance.',

    avisos: [
      'NÃO VÃO PARA O GALAXY’S EDGE NA ABERTURA. O Early Entry inclui o Rise, o Slinky e a ' +
      'Torre, e a maioria dos hóspedes vai para o Rise. Vocês vão para o Toy Story Land.',
      'AS DUAS RESERVAS AINDA NÃO EXISTEM. A janela do Oga’s e do Sci-Fi abre em 16/09 e os ' +
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
        'costuma ser às 20h; com 22h, às 21h. Os horários oficiais de 15/11 saem por volta de ' +
        '16/09, junto com a janela das reservas.', pesquisa: '2026-09-10' },
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
          'Almoço em Batuu, parada, e a travessia longa até a Sunset Blvd.',
          'Rock ’n’ Roller na lista alta do Multi Pass; ao usar, reservem a Torre.',
          'Noite sentada: Oga’s, Sci-Fi, Sunset Blvd e o Fantasmic.',
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
          'O Slinky passa para o Multi Pass, na lista alta — e aí o Rock ’n’ Roller vai para ' +
          'a lista baixa ou fica no standby do fim da tarde.',
          'O resto do dia não muda.',
        ],
      },
      {
        letra: 'B2',
        titulo: 'O parque não abre às 9h, ou o Fantasmic é em outra hora',
        gatilho: 'Os horários oficiais saem por volta de 16/09.',
        passos: [
          'ABERTURA DIFERENTE: mudem a referência do dia. A manhã inteira desloca junto, ' +
          'inclusive a saída das 7h.',
          'A NOITE NÃO DESLOCA COM A ABERTURA. As duas reservas têm hora própria e o ' +
          'Fantasmic segue o fechamento. Se o app avisar colisão em vermelho no fim da ' +
          'tarde, é o Star Tours ou a parada batendo no Oga’s — cortem esses, não a noite.',
          'FANTASMIC EM OUTRA HORA: ajustem o selo de horário no bloco dele, e os dois ' +
          'blocos anteriores andam junto.',
        ],
      },
      {
        letra: 'C',
        titulo: 'Chuva ou o dia desandou',
        gatilho: 'Chuva que não passa, cansaço, ou o dia atrasou demais.',
        passos: [
          'Este é o parque MAIS coberto da Disney. Rise, Runaway Railway, Toy Story Mania, ' +
          'Star Tours e a Torre do Terror são todos internos, e o Oga’s e o Sci-Fi também.',
          'O Slinky e o Rock ’n’ Roller param com raio. Se pararem de manhã, troquem a ordem: ' +
          'Rise e Millennium Falcon primeiro, e voltem ao Toy Story Land depois.',
          'O QUE NÃO SE SACRIFICA: o Fantasmic. Se for para cortar, cortem nesta ordem — ' +
          'Alien, Star Tours e o Millennium Falcon.',
          'O Fantasmic é cancelado com chuva forte. Se cancelarem, usem a hora para o Rise ' +
          'de novo ou para a Torre, e saiam mais cedo: amanhã é Epcot com saída às 8h.',
        ],
      },
    ],

    /* --------------------------------------------------------------------- */
    naoPerca: [
      { nome: 'Fantasmic!', quando: 'hoje', custo: 'incluso no ingresso',
        motivo: 'Fogo, água, barcos, projeção em cortina de água e um dragão de vinte ' +
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
                'abertura e 63 depois das 19h, e as 19h de vocês já têm Oga’s, Sci-Fi e ' +
                'Fantasmic.\n\n' +
                'O plano B de graça existe e está no bloco: entrar na fila depois do ' +
                'Fantasmic, por volta das 20h50, com a regra de que quem está na fila no ' +
                'fechamento anda. Saem por volta das 21h50, e amanhã é Epcot com saída às 8h.',
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
      titulo: 'Epcot · alarme 7h, saída 8h',
      aviso:
        'Hoje termina perto das 22h e amanhã sai às 8h. O Epcot é o dia mais leve dos ' +
        'quatro da Disney — a tarde é comida, não fila — mas a manhã ainda tem hora.',
      itens: [
        { texto: 'Alarme para 7h nos dois celulares', critico: true,
          motivo: 'Saída às 8h. Depois de um dia que acabou 22h, um alarme só falha.' },
        { texto: 'Conferir se as reservas de Lightning Lane do dia 16 aparecem no app',
          critico: true,
          motivo: 'O Single Pass do Cosmic Rewind foi comprado em 13/11. Se falhou, hoje ' +
                  'ainda dá para replanejar a manhã do Epcot.' },
        { texto: 'Conferir o horário de abertura do Epcot e ajustar a referência',
          critico: true,
          motivo: 'O dia 16 assume 9h. Se for outro, mudem a referência e a manhã desloca ' +
                  'junto, inclusive a saída das 8h.' },
        { texto: 'Mochila remontada e celular carregando', critico: true,
          motivo: 'Duas garrafas, barrinhas, protetor solar, power bank, cabo e uma camada ' +
                  'leve para cada um — o Epcot é o parque com mais área aberta, e a World ' +
                  'Showcase à noite esfria.' },
        { texto: 'Guardar as compras da Sunset Blvd',
          motivo: 'Vocês voltam com sacola hoje. Amanhã a mochila precisa sair leve.' },
      ],
    },

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
        titulo: 'Portão · posicionar para o TOY STORY LAND',
        descricao: 'Não para o Galaxy’s Edge',
        contexto:
          'PELA TERCEIRA VEZ, O PONTO CERTO É O CONTRAINTUITIVO — e aqui o motivo está ' +
          'documentado com nome e sobrenome.\n\n' +
          'O Early Entry do Hollywood Studios inclui o Rise of the Resistance, o Slinky Dog ' +
          'Dash e a Torre do Terror. E a grande maioria dos hóspedes vai para o RISE, que ' +
          'fica no Galaxy’s Edge. Quem entra às 9h e caminha para lá está andando para ' +
          'dentro da multidão que já está na fila há meia hora.\n\n' +
          'A recomendação para quem está fora dos hotéis é ir ao Toy Story Land. É para lá ' +
          'que vocês vão, direto, assim que passarem a catraca.\n\n' +
          'PONTO DE ENCONTRO DE HOJE: o Chinese Theater, no fim da Hollywood Blvd. É o ' +
          'prédio que se vê da entrada e por onde todo caminho passa. Se vocês se perderem, ' +
          'vão para lá e ESPEREM — não saiam procurando.\n\n' +
          'Café da manhã aqui na fila, das barrinhas da mochila: o almoço é 12h20.',
        localId: 'hollywood-studios', acesso: [], duracaoMin: 60, pesquisa: '2026-09-10' },

      { id: 'b-1511-1115', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Slinky Dog Dash — rope drop',
        descricao: 'A fila mais teimosa do parque. Não existe hora barata para ela',
        contexto:
          'Montanha-russa familiar ao ar livre, com dois lançamentos suaves. Não é intensa — ' +
          'o que ela é, é sempre cheia.\n\n' +
          'SEJAM HONESTOS COM O NÚMERO: o Slinky faz 97 minutos na abertura, 79 de média no ' +
          'dia e 64 à noite. Não existe janela barata para ele. O rope drop não é o momento ' +
          'em que ele fica de graça, é o momento em que ele custa menos — e a noite de vocês ' +
          'já está ocupada com Oga’s, Sci-Fi e Fantasmic.\n\n' +
          'Fazê-lo agora também libera a lista alta do Multi Pass, que de outra forma ele ' +
          'consumiria — e ela vai para o Rock ’n’ Roller Coaster.',
        areaParque: 'Toy Story Land', acesso: ['rope-drop', 'standby'], critico: true,
        duracaoMin: 40,
        fila: { min: 40, quando: 'no rope drop', pico: 97, estimado: true, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1511-1545', hora: '09:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Toy Story Mania',
        descricao: 'Standby, ainda cedo. Mesma land',
        contexto:
          'Jogo de tiro em 3D com óculos, em cabines giratórias — vocês competem por ' +
          'pontuação. Puxem o gatilho o mais rápido possível: a pontuação premia volume de ' +
          'tiros, não pontaria.',
        areaParque: 'Toy Story Land', acesso: ['standby'], duracaoMin: 35,
        fila: { min: 25, quando: 'de manhã', pico: 55, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1511-1145', hora: '10:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Alien Swirling Saucers',
        descricao: 'Opcional. Só se a fila estiver abaixo de 15 min',
        contexto:
          'Xícaras giratórias temáticas, 90 segundos. Leve, e o valor está em já estarem na ' +
          'land. Se a fila passar de 15 minutos, sigam direto para o Rise — vocês têm hora ' +
          'marcada com o Single Pass.',
        areaParque: 'Toy Story Land', acesso: ['standby'], opcional: true, duracaoMin: 24,
        condicao: 'Só se a fila estiver abaixo de 15 min',
        fila: { min: 15, quando: 'de manhã', pico: 35, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1511-1030', hora: '10:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Rise of the Resistance',
        descricao: 'Single Pass. E aqui ele se justifica',
        contexto:
          'Não é uma atração, são quatro: pré-show, simulador de nave, um hangar em escala ' +
          'real com dezenas de stormtroopers e o passeio em veículo sem trilhos. É consenso ' +
          'como a coisa mais ambiciosa que a Disney já construiu.\n\n' +
          'POR QUE AQUI O PASSE FICA, e nos dias 11 e 13 virou plano B: nos outros dois o ' +
          'horário resolvia — o TRON tinha a janela do desfile, o Flight of Passage tinha a ' +
          'última hora. Aqui não existe janela livre. O Rise faz 100 minutos na abertura e ' +
          '63 depois das 19h, e as 19h de vocês já estão com Oga’s, Sci-Fi e Fantasmic.\n\n' +
          'PLANO B DE GRAÇA, se vocês não comprarem: entrar na fila DEPOIS do Fantasmic, por ' +
          'volta das 20h50. Vale a mesma regra do dia 13 — quem está na fila no fechamento ' +
          'anda. Vocês sairiam por volta das 21h50, e o dia 16 é Epcot com saída às 8h.',
        areaParque: 'Galaxy’s Edge', acesso: ['single-pass'], critico: true, duracaoMin: 50,
        fila: { min: 10, quando: 'com o Single Pass', pico: 100, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1511-0900', hora: '11:35', ancora: 'referencia', tipo: 'atracao',
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
        fila: { min: 35, quando: 'antes do meio-dia', pico: 65, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1511-1215', hora: '12:20', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Docking Bay 7',
        descricao: 'Balcão, dentro de Galaxy’s Edge. Mobile order',
        contexto:
          'Balcão temático de Batuu, com pratos de nomes alienígenas que são versões de ' +
          'comida reconhecível. Usem mobile order — a fila do balcão é longa e a retirada é ' +
          'imediata. Peçam ainda dentro da fila do Millennium Falcon.\n\n' +
          'É a última comida de verdade até as 18h: o Oga’s às 17h serve bebida e petisco, ' +
          'não refeição.',
        restauranteId: 'r-docking-bay', areaParque: 'Galaxy’s Edge', acesso: [], duracaoMin: 60 },

      { id: 'b-1511-1320p', hora: '13:20', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — e a travessia mais longa do dia',
        descricao: 'Quinze minutos aqui, e treze de caminhada até a Sunset Blvd',
        contexto:
          'Banheiro, garrafas cheias e sentar, ainda em Batuu.\n\n' +
          'DEPOIS DAQUI VEM A CAMINHADA MAIS LONGA DO PARQUE: do Galaxy’s Edge até a Sunset ' +
          'Blvd são treze minutos atravessando o parque inteiro, e num dia cheio mais. Ela ' +
          'está contada no relógio — não é atraso, é o mapa.',
        areaParque: 'Galaxy’s Edge', acesso: [], duracaoMin: 15 },

      { id: 'b-1511-0945', hora: '13:50', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Rock ’n’ Roller Coaster (Muppets)',
        descricao: 'Multi Pass · lista alta. Reabriu em maio de 2026',
        contexto:
          'Montanha-russa fechada, no escuro, com lançamento de 0 a 90 km/h em menos de três ' +
          'segundos e três inversões. É a mais intensa da Disney em Orlando.\n\n' +
          'A temática saiu do Aerosmith e virou os Muppets, com o Dr. Teeth and the Electric ' +
          'Mayhem. Reabriu em 26/05/2026, então em novembro ainda é atração nova — e é por ' +
          'isso que ela leva a lista alta do Multi Pass agora que o Slinky foi no rope drop.',
        areaParque: 'Sunset Blvd', acesso: ['multi-pass'], acessoAlt: 'single-rider', duracaoMin: 40,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 75, estimado: true, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1511-1315', hora: '14:30', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Torre do Terror',
        descricao: 'Multi Pass · lista baixa. Ao usar, reservem o Runaway Railway',
        contexto:
          'Queda livre dentro de um hotel abandonado cenográfico, com sequência aleatória de ' +
          'subidas e quedas que muda a cada volta. A ambientação é a melhor da Disney.\n\n' +
          'Sensação de estômago forte — se algum dos dois tem medo de queda, é esta e não as ' +
          'montanhas-russas.',
        areaParque: 'Sunset Blvd', acesso: ['multi-pass'], duracaoMin: 41,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 35, fonte: '2026-09-10' } },

      { id: 'b-1511-1400', hora: '15:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mickey & Minnie’s Runaway Railway',
        descricao: 'Multi Pass rolando',
        contexto:
          'Dark ride sem trilhos visíveis onde vocês entram literalmente dentro de um ' +
          'desenho. Colorido, rápido, sem emoção forte. Tem diálogo, mas a graça é visual.',
        areaParque: 'Hollywood Blvd', acesso: ['multi-pass'], duracaoMin: 40,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 50, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1511-1630', hora: '16:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Star Tours',
        descricao: 'Standby. O roteiro muda a cada visita',
        contexto:
          'Simulador de cabine com tela e movimento. O sistema sorteia destinos e ' +
          'personagens a cada sessão, então duas voltas quase nunca são iguais. Legendas ' +
          'disponíveis, e a trama é simples.',
        areaParque: 'Echo Lake', acesso: ['standby'], duracaoMin: 39,
        fila: { min: 25, quando: 'no fim da tarde', pico: 45, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1511-1645p', hora: '16:45', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — antes da noite',
        descricao: 'Quinze minutos. A partir daqui o dia é sentado',
        contexto:
          'Banheiro, garrafas e power bank. Daqui até a saída são quatro horas, e três delas ' +
          'são sentadas: Oga’s, Sci-Fi e Fantasmic.\n\n' +
          'COMAM ALGUMA COISA DA MOCHILA se estiverem com fome: o almoço foi 12h20 e o ' +
          'Oga’s serve bebida, não jantar. A comida de verdade só chega às 18h.',
        areaParque: 'Galaxy’s Edge', acesso: [], duracaoMin: 15 },

      { id: 'b-1511-1715', hora: '17:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Oga’s Cantina',
        descricao: 'Reserva. Limite de 45 min por grupo',
        contexto:
          'Bar temático de Batuu com DJ droide, drinks autorais bem estranhos e limite de ' +
          'tempo de 45 minutos por grupo. É quase impossível entrar sem reserva.\n\n' +
          'HORÁRIO FIXO de reserva, e ele é PROPOSTA: a janela abre em 16/09 e nada foi ' +
          'reservado ainda. Pedir 17h faz a tarde caber sem correria e deixa doze minutos ' +
          'de caminhada até o Sci-Fi. Se só conseguirem outro horário, ajustem os blocos ' +
          'daqui até o Fantasmic.',
        restauranteId: 'r-ogas', areaParque: 'Galaxy’s Edge', acesso: ['reserva'],
        duracaoMin: 45 },

      { id: 'b-1511-1815', hora: '18:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Sci-Fi Dine-In',
        descricao: 'Reserva. Vocês sentam dentro de um carro dos anos 50',
        contexto:
          'Vocês sentam dentro de conversíveis num cinema drive-in cenográfico, assistindo a ' +
          'trailers de ficção científica ruim em loop, sob um céu estrelado falso. A comida é ' +
          'americana comum — vocês vão pelo cenário, que não existe em nenhum outro lugar.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta, e o preço da etiqueta não inclui o ' +
          'imposto.\n\n' +
          'HORÁRIO FIXO de reserva, também proposta. Janela abre 16/09.',
        restauranteId: 'r-scifi', areaParque: 'Commissary Lane', acesso: ['reserva'],
        duracaoMin: 78 },

      { id: 'b-1511-1945', hora: '19:25', ancora: 'fixo', tipo: 'compras',
        titulo: 'Sunset Blvd · decoração de Natal e compras',
        descricao: 'A caminho do Fantasmic, sem voltar depois',
        contexto:
          'A Sunset Blvd é a rua mais bonita do parque à noite e no Natal ganha luz quente e ' +
          'música ao vivo. O teatro do Fantasmic fica no fim dela — vocês passam por aqui de ' +
          'qualquer jeito.\n\n' +
          'É O MOMENTO DE COMPRA DO DIA, e é agora e não depois: as lojas fecham com o ' +
          'parque, e depois do Fantasmic vocês vão direto para a saída no meio de dez mil ' +
          'pessoas. A Tower of Terror Gift Shop e a Legends of Hollywood ficam nesta rua.',
        areaParque: 'Sunset Blvd', acesso: [], duracaoMin: 35 },

      { id: 'b-1511-2000p', hora: '20:00', ancora: 'fixo', tipo: 'espera',
        titulo: 'Posição para o Fantasmic!',
        descricao: 'Quinze minutos antes. O teatro tem 6.900 lugares e enche',
        contexto:
          'O Hollywood Hills Amphitheater tem quase sete mil lugares e ainda assim enche nas ' +
          'noites de temporada.\n\n' +
          'Sentem no MEIO e um pouco atrás, não na frente: o show usa projeção em cortina de ' +
          'água, e de perto demais a imagem se perde. As primeiras fileiras também molham.',
        areaParque: 'Sunset Blvd', acesso: [], duracaoMin: 15 },

      { id: 'b-1511-2015', hora: '20:15', ancora: 'fixo', tipo: 'show',
        titulo: 'Fantasmic!',
        descricao: '~26 min. O fecho do dia',
        contexto:
          'Espetáculo noturno com fogo, água, barcos, projeção em cortina de água e um ' +
          'dragão de vinte metros. É o show mais antigo e mais querido do parque.\n\n' +
          'HORÁRIO A CONFIRMAR: ele acompanha o fechamento do parque. Com fechamento às 21h ' +
          'costuma ser às 20h; com 22h, às 21h. Confiram no app da Disney e ajustem aqui — ' +
          'este bloco e os dois anteriores andam juntos.',
        areaParque: 'Sunset Blvd', acesso: [], duracaoMin: 35,
        confirmarHorario: true, pesquisa: '2026-09-10' },

      { id: 'b-1511-2050', hora: '20:50', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Uber, ~30 min, US$ 22–32. Amanhã sai às 8h',
        contexto:
          'Saindo com o fluxo do Fantasmic, a caminhada até o ponto de rideshare leva uns ' +
          'quinze minutos — o parque inteiro sai ao mesmo tempo.\n\n' +
          'Se a tarifa estiver em alta, andem um pouco para longe da entrada antes de chamar. ' +
          'Amanhã é Epcot com saída às 8h, então não estiquem.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 60 },
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
        nota:
          'ESTE É O ÚNICO DOS TRÊS DIAS DE PASSE EM QUE ELE SE JUSTIFICA. No dia 11 o TRON ' +
          'tinha a janela do desfile; no dia 13 o Flight of Passage tinha a última hora. ' +
          'Aqui não existe janela livre: o Rise faz 100 min na abertura e 63 depois das ' +
          '19h, e a noite de vocês já tem Oga’s, Sci-Fi e Fantasmic.\n\n' +
          'Peçam janela entre 10h30 e 11h. Se não comprarem, o plano B está no bloco: fila ' +
          'depois do Fantasmic, por volta das 20h50.',
      },
      expressPass: null,
      custoEstimadoCasal: { min: 55, max: 130, moeda: 'USD' },
      extras: [
        { nome: 'A travessia mais longa dos parques mapeados',
          texto: 'Do Galaxy’s Edge até a Sunset Blvd são treze minutos atravessando o ' +
                 'parque inteiro, e mais num dia cheio. Ela está contada no relógio, com ' +
                 'uma parada antes — não é atraso, é o mapa.' },
      ],
    },
    renuncias: {
      gerais: [
        { nome: 'Disney Junior' }, { nome: 'Frozen Sing-Along' }, { nome: 'Vacation Fun' },
        { nome: 'Lightning McQueen’s Racing Academy' }, { nome: 'Walt Disney Presents' },
        { nome: 'Beauty and the Beast Live on Stage' },
        { nome: 'The Magic of Disney Animation — abriu em 14/09/2026, mas não é atração ' +
                 'de fila: é aula de desenho com um animatrônico do Olaf, encontros com ' +
                 'personagens e um teatro. Sem nenhum interesse para vocês, e ocuparia a ' +
                 'janela do Star Tours' },
      ],
      idioma: {
        itens: ['Indiana Jones Epic Stunt Spectacular'],
        motivo:
          'É visual, mas tem muito texto falado entre as cenas. Se o dia atrasar, é o primeiro ' +
          'a cair.',
      },
      fechado: [
        'Muppet*Vision 3D — fechou em 08/06/2025 para dar lugar à Monstropolis, a land de ' +
        'Monsters, Inc. prevista para 2027',
        'PizzeRizzo e o Muppets Courtyard inteiro — fecharam junto, em junho de 2025',
      ],
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
    fechado: true,
    revisadoEm: '2026-09-10',
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },

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
        'VERIFICADO: o Food & Wine de 2026 vai de 27/08 a 21/11, então 16/11 está dentro com ' +
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
        'O WORLD SHOWCASE ABRE ÀS 9H AGORA. A abertura das 11h foi aposentada quando o Frozen ' +
        'e o Remy viraram atrações grandes. As lojas e barracas dos pavilhões é que só ativam ' +
        'por volta das 11h — o que não muda nada no roteiro de vocês, que só chega lá às 13h.',
        pesquisa: '2026-09-10' },
    ],

    /* --------------------------------------------------------------------- */
    planos: [
      {
        letra: 'A',
        titulo: 'O dia como está escrito',
        gatilho: 'Vocês estão no portão às 8h45 e o Test Track está operando.',
        passos: [
          'Test Track no rope drop, sem desviar para o Cosmic Rewind.',
          'Cosmic Rewind às 9h45 com o Single Pass, e o resto do World Discovery no standby.',
          'Soarin’ e o pavilhão do The Land antes do meio-dia, enquanto ainda estão baratos.',
          'A partir das 13h, World Showcase no sentido horário e três voltas de barracas.',
          'Frozen e Remy com o Multi Pass — são as duas únicas filas da tarde.',
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
          'Pivô imediato para o Soarin’ e o pavilhão do The Land, que ficam do outro lado e ' +
          'estão praticamente vazios na abertura.',
          'O Cosmic Rewind não muda — vocês têm hora marcada com o Single Pass.',
          'Se o Test Track voltar durante o dia, ele entra no Multi Pass rolando, depois de ' +
          'vocês usarem o Frozen. Se não voltar, não voltou: é o único bloco do dia que não ' +
          'tem substituto, e não vale reorganizar a tarde por causa dele.',
        ],
      },
      {
        letra: 'B2',
        titulo: 'O parque não abre às 9h',
        gatilho: 'Os horários oficiais saem por volta de 17/09.',
        passos: [
          'Mudem a referência do dia. A manhã inteira desloca junto, inclusive a saída das ' +
          '7h45.',
          'O LUMINOUS E A POSIÇÃO NÃO DESLOCAM: eles seguem o fechamento do parque, não a ' +
          'abertura. Se o app avisar colisão em vermelho no fim da tarde, é a última volta de ' +
          'barracas batendo na posição — e a solução é encurtar a volta, não atrasar o lugar.',
          'As três voltas do Food & Wine são elásticas de propósito. Elas são a folga do dia.',
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
          'O QUE NÃO SE SACRIFICA: o Luminous, e as três voltas de barracas — que são o dia.',
          'Se o Luminous for cancelado por vento, saiam mais cedo. Amanhã é Universal Studios.',
        ],
      },
    ],

    /* --------------------------------------------------------------------- */
    naoPerca: [
      { nome: 'O passaporte do Food & Wine', quando: 'hoje', custo: 'grátis',
        motivo: 'Peguem na entrada do parque. É onde vocês marcam as barracas que já fizeram ' +
                'e é o que transforma três voltas soltas numa coisa só. Sem ele, às 20h ' +
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

      { nome: 'The American Adventure', quando: 'descartado', custo: 'incluso',
        motivo: 'DESCARTADO em 10/09. Show de animatrônicos sobre a história dos Estados ' +
                'Unidos, tecnicamente impressionante e completamente dependente de inglês — ' +
                'trinta minutos sentados ouvindo texto. Ocuparia a janela do Remy, que é uma ' +
                'das duas filas que o Multi Pass existe para resolver.' },
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
                  'PARK-TO-PARK não é para amanhã — o Hogwarts Express ficou para o dia 23 — ' +
                  'mas é o mesmo ingresso, e se estiver errado é melhor descobrir agora do ' +
                  'que na catraca.' },
        { texto: 'Conferir o horário de abertura do Universal Studios', critico: true,
          motivo: 'Amanhã assume 9h. Se for outro, mudem a referência e a manhã desloca junto.' },
        { texto: 'Alarme nos dois celulares', critico: true,
          motivo: 'Hoje termina perto das 22h30. Um alarme só falha.' },
        { texto: 'Mochila remontada e celular carregando', critico: true,
          motivo: 'Duas garrafas, barrinhas, protetor solar, power bank, cabo e uma camada ' +
                  'leve para cada um.\n\n' +
                  'E ATENÇÃO ÀS ATRAÇÕES COM LOCKER OBRIGATÓRIO: a Universal tem dez delas, ' +
                  'com detector de metal em quatro. Levem o mínimo possível nos bolsos ' +
                  'amanhã — cada locker custa 10 a 15 minutos que o roteiro não conta.' },
        { texto: 'Guardar as compras do World Showcase',
          motivo: 'A Mitsukoshi do Japão e as lojas do Reino Unido são as melhores do parque. ' +
                  'Amanhã a mochila precisa sair leve.' },
      ],
    },

    blocos: [
      { id: 'b-1611-0800', hora: '07:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel',
        descricao: 'Uber, ~25 min, US$ 20–30',
        contexto:
          'O Epcot tem entrada direta e a segurança aqui é mais rápida que no Hollywood ' +
          'Studios. Saindo 7h45 vocês chegam com uma folga confortável para a abertura.',
        localId: 'epcot', acesso: [], duracaoMin: 60 },

      { id: 'b-1611-0845', hora: '08:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão · posicionar para o WORLD DISCOVERY',
        descricao: 'Test Track, não Cosmic Rewind',
        contexto:
          'PELA QUARTA VEZ O PONTO CERTO É O CONTRAINTUITIVO, e aqui o erro seria duplo.\n\n' +
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
          'Café da manhã aqui na fila, das barrinhas da mochila.',
        localId: 'epcot', acesso: [], duracaoMin: 15, pesquisa: '2026-09-10' },

      { id: 'b-1611-0950', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Test Track — rope drop',
        descricao: 'A única janela barata dele. E ele quebra muito',
        contexto:
          'Vocês desenham um carro num painel e depois andam num veículo que faz testes de ' +
          'curva, freio e um trecho externo a 105 km/h. É a parte mais rápida da Disney em ' +
          'linha reta.\n\n' +
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
        pesquisa: '2026-09-10' },

      { id: 'b-1611-0900', hora: '09:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Guardians of the Galaxy: Cosmic Rewind',
        descricao: 'Single Pass. Aqui ele se justifica, como no dia 15',
        contexto:
          'Montanha-russa fechada e no escuro, com lançamento e cabines que giram 360° para ' +
          'onde a cena está acontecendo. Sem inversões, mas rápida. Cada volta sorteia uma ' +
          'música diferente dos anos 70 e 80. É a melhor atração do Epcot.\n\n' +
          'POR QUE O PASSE FICA: ele faz 101 minutos de média e as fontes são diretas — mesmo ' +
          'às 8h da manhã ele passa de uma hora. Não existe janela barata em nenhum momento ' +
          'do dia, e é a mesma situação do Rise of the Resistance no dia 15.\n\n' +
          'A fila virtual acabou em fevereiro de 2025: hoje é standby ou Single Pass, sem ' +
          'sorteio às 7h da manhã.',
        areaParque: 'World Discovery', acesso: ['single-pass'], critico: true, duracaoMin: 50,
        fila: { min: 10, quando: 'com o Single Pass', pico: 101, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1611-1035', hora: '10:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mission: SPACE — Orange',
        descricao: 'A laranja é a intensa, com centrífuga de verdade',
        contexto:
          'Simulador de lançamento espacial dentro de uma centrífuga que gera força G real. A ' +
          'versão LARANJA causa enjoo em muita gente — tem saco no assento por um motivo.\n\n' +
          'A VERDE é a mesma cabine sem girar, e a fila é a mesma até o ponto em que vocês ' +
          'escolhem. Se qualquer um dos dois tem tendência a enjoo, peguem a verde: não é ' +
          'vergonha nenhuma e salva as duas horas seguintes.',
        areaParque: 'World Discovery', acesso: ['standby'], duracaoMin: 33,
        fila: { min: 20, quando: 'de manhã', pico: 40, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1611-1115', hora: '11:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Soarin’ Across America',
        descricao: 'Filme novo desde maio de 2026',
        contexto:
          'Vocês sentam num banco que sobe e balança na frente de uma tela IMAX côncava, com ' +
          'sensação de estar voando de pernas soltas. Tem cheiro sincronizado com as cenas. ' +
          'Suave, sem emoção forte — agrada praticamente todo mundo.\n\n' +
          'O filme trocou em 26/05/2026: saiu o Around the World e entrou o Across America, ' +
          'com trilha nova e uma fila temática da National Geographic.\n\n' +
          'A fila dele sai de praticamente zero na abertura para 74 minutos às 16h. Às 11h15 ' +
          'ainda está barato, e é por isso que ele vem antes do World Showcase.',
        areaParque: 'World Nature', acesso: ['standby'], duracaoMin: 45,
        fila: { min: 25, quando: 'antes do meio-dia', pico: 74, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1611-1200', hora: '12:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'The Seas e Living with the Land',
        descricao: 'Os dois no mesmo pavilhão. Fila curta, ar-condicionado',
        contexto:
          'The Seas é um aquário enorme com golfinhos e peixes-boi, e dá para ficar o tempo ' +
          'que quiserem. Living with the Land é um passeio de barco por estufas hidropônicas ' +
          'REAIS, onde a Disney cultiva parte do que serve nos restaurantes do parque — ' +
          'inclusive o que vocês podem comer hoje.\n\n' +
          'Os dois são calmos, quase sem fila, e caem na pior hora de calor de propósito.',
        areaParque: 'World Nature', acesso: ['standby'], duracaoMin: 40,
        fila: { min: 10, quando: 'quase sempre', pico: 25, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1611-1240p', hora: '12:40', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Parada — antes de virar o dia',
        descricao: 'A partir daqui o Epcot é outro parque',
        contexto:
          'Banheiro, garrafas cheias e sentar.\n\n' +
          'DAQUI PARA A FRENTE O DIA MUDA DE NATUREZA: acabaram as filas e começa o World ' +
          'Showcase, que é comida e caminhada. Não há mais nenhum compromisso de relógio até ' +
          'o Luminous, às 21h.\n\n' +
          'Não comam agora: em vinte minutos vocês estarão na primeira barraca.',
        areaParque: 'World Nature', acesso: [], duracaoMin: 14 },

      { id: 'b-1611-1245', hora: '13:00', ancora: 'referencia', tipo: 'livre',
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

      { id: 'b-1611-1300', hora: '13:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Gran Fiesta Tour',
        descricao: 'Barquinho dentro da pirâmide. Fila mínima',
        contexto:
          'Passeio de barco lento dentro do pavilhão do México, que por dentro é um mercado ' +
          'noturno cenográfico permanente, com vulcão ao fundo. Fresco, escuro e quase sempre ' +
          'sem fila. É o clássico mais subestimado do parque.',
        areaParque: 'World Showcase', acesso: ['standby'], duracaoMin: 20,
        fila: { min: 5, quando: 'quase sempre', pico: 15, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1611-1330', hora: '13:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Frozen Ever After',
        descricao: 'Noruega. Multi Pass',
        contexto:
          'Passeio de barco pelo mundo de Frozen, com animatrônicos muito bons e um trecho ' +
          'curto de ré. A fila é sempre desproporcional ao tamanho da atração — 45 a 75 ' +
          'minutos —, e é por isso que ela leva a lista alta do Multi Pass.\n\n' +
          'É AQUI QUE O MULTI PASS SE PAGA. Esta e o Remy são as duas únicas filas do World ' +
          'Showcase, e elas competem diretamente com as barracas do Food & Wine, que é o que ' +
          'vocês vieram fazer. Nos outros dias a fila compete com outra fila; aqui compete com ' +
          'o dia.',
        areaParque: 'World Showcase', acesso: ['multi-pass'], duracaoMin: 40,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 75, fonte: '2026-09-10' } },

      { id: 'b-1611-1415', hora: '14:20', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Food & Wine — volta 1',
        descricao: 'China, Alemanha, Itália. E é isto o almoço',
        contexto:
          'Barracas espalhadas pelo World Showcase, cada uma com dois a quatro pratos pequenos ' +
          'e bebidas. PEGUEM O PASSAPORTE na entrada do parque.\n\n' +
          'A ESTRATÉGIA: dividam cada prato entre os dois e provem oito a dez barracas ao ' +
          'longo da tarde, em vez de fazer três refeições. É assim que o festival funciona, e ' +
          'é por isso que hoje não existe bloco de almoço nem de jantar — o Food & Wine É as ' +
          'duas refeições, servidas em três voltas.\n\n' +
          'Destaques que se repetem todo ano: Canadá (sopa de cheddar com bacon), Alemanha, ' +
          'Grécia e o waffle da Bélgica. O cardápio de 2026 sai no app da Disney.\n\n' +
          'A caminhada entre os pavilhões está dentro da duração deste bloco — ele não é uma ' +
          'parada, é a volta.',
        areaParque: 'World Showcase', acesso: [], duracaoMin: 70 },

      { id: 'b-1611-1600', hora: '15:30', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Food & Wine — volta 2',
        descricao: 'Japão, Marrocos. O trecho mais bonito do anel',
        contexto:
          'O pavilhão do Japão tem uma loja de departamentos de verdade, a Mitsukoshi, que é ' +
          'a melhor loja do World Showcase. O do Marrocos é o mais elaborado ' +
          'arquitetonicamente e quase sempre o mais vazio.\n\n' +
          'Caminhada inclusa na duração.',
        areaParque: 'World Showcase', acesso: [], duracaoMin: 75 },

      { id: 'b-1611-1700', hora: '16:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Remy’s Ratatouille Adventure',
        descricao: 'França. Multi Pass',
        contexto:
          'Vocês encolhem ao tamanho de um rato e andam por uma cozinha em escala gigante, em ' +
          'veículos sem trilhos com telas 3D e cheiro sincronizado. Sem emoção forte, e a ' +
          'escala do cenário é o ponto alto.\n\n' +
          'Segunda das duas filas do World Showcase, e a segunda razão do Multi Pass: 40 a 60 ' +
          'minutos no standby, dez com o passe.',
        areaParque: 'World Showcase', acesso: ['multi-pass'], duracaoMin: 45,
        fila: { min: 10, quando: 'com o Multi Pass', pico: 60, fonte: '2026-09-10' } },

      { id: 'b-1611-1745', hora: '17:30', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Food & Wine — volta 3',
        descricao: 'França, Reino Unido, Canadá. O jantar de vocês',
        contexto:
          'A volta mais longa e a melhor: os três pavilhões finais são os mais gostosos ao ' +
          'entardecer, e o Canadá tem a sopa de cheddar com bacon que aparece em toda lista ' +
          'de melhores do festival.\n\n' +
          'O pub do Reino Unido serve cerveja de verdade e costuma ter música ao vivo no ' +
          'pátio. É o melhor lugar do parque para sentar sem pressa.\n\n' +
          'ESTE É O JANTAR. Não há outro bloco de refeição hoje — de propósito.',
        areaParque: 'World Showcase', acesso: [], duracaoMin: 85 },

      { id: 'b-1611-1900', hora: '19:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Spaceship Earth',
        descricao: 'A fila some à noite. A esfera por dentro',
        contexto:
          'O passeio dentro da esfera geodésica que é o símbolo do Epcot. Conta a história da ' +
          'comunicação humana em cenários com animatrônicos, subindo em espiral até o topo. ' +
          'Lento, climatizado, com narração em inglês mas totalmente compreensível pelo ' +
          'visual.\n\n' +
          'À noite a fila praticamente some, e vocês passam por ela de qualquer jeito na ' +
          'volta para o lago.',
        areaParque: 'World Celebration', acesso: ['standby'], duracaoMin: 50,
        fila: { min: 10, quando: 'à noite', pico: 40, estimado: true, fonte: '2026-09-10' } },

      { id: 'b-1611-2000', hora: '20:00', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Food & Wine — última volta',
        descricao: 'O que ficou faltando, a caminho do lago',
        contexto:
          'Última passada nas barracas que vocês marcaram no passaporte e não fizeram. As ' +
          'filas das barracas caem depois das 20h, quando a maioria já está pegando lugar ' +
          'para o show.\n\n' +
          'Comprem a bebida AGORA e levem para o lugar do Luminous — de lá não dá para sair ' +
          'sem perder a vaga.',
        areaParque: 'World Showcase', acesso: [], duracaoMin: 30 },

      { id: 'b-1611-2030p', hora: '20:30', ancora: 'fixo', tipo: 'espera',
        titulo: 'Posição para o Luminous',
        descricao: 'Margem entre México e Noruega. Trinta minutos antes',
        contexto:
          'A margem entre o México e a Noruega tem visão frontal do lago e esvazia mais rápido ' +
          'na saída — as duas coisas importam.\n\n' +
          'Trinta minutos antes não é exagero em noite de festival. Levem a bebida da barraca ' +
          'anterior: de lá não dá para sair e voltar.\n\n' +
          'HORÁRIO FIXO, colado no show.',
        areaParque: 'World Showcase', acesso: [], duracaoMin: 30 },

      { id: 'b-1611-2100', hora: '21:00', ancora: 'fixo', tipo: 'show',
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

      { id: 'b-1611-2120', hora: '21:20', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Uber, ~25 min, US$ 20–30. Amanhã é Universal',
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
        listaBaixa: ['Remy’s Ratatouille Adventure', 'Test Track'],
        planoB:
          'O Test Track está na lista baixa como rede de segurança: se ele quebrar de ' +
          'manhã e voltar à tarde, vocês o pegam rolando, depois de usar o Frozen.',
        nota:
          'DECIDIDO: comprar. O Epcot é o único parque em que a fila compete com o que ' +
          'vocês vieram fazer — o Frozen e o Remy são as duas únicas filas do World ' +
          'Showcase, e são 45–75 e 40–60 minutos parados no meio das barracas do Food & ' +
          'Wine. Nos outros dias a fila compete com outra fila; aqui compete com o dia.',
      },
      singlePass: {
        itens: ['Guardians of the Galaxy: Cosmic Rewind'], opcionais: [],
        nota:
          'Segundo dia seguido em que o passe se justifica. O Cosmic Rewind faz 101 minutos ' +
          'de média e passa de uma hora mesmo às 8h — não existe janela barata em nenhum ' +
          'momento do dia, diferente do TRON e do Flight of Passage.\n\n' +
          'Peçam janela entre 9h30 e 10h: é logo depois do Test Track e antes de a manhã ' +
          'esquentar.',
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
        { nome: 'The American Adventure — 30 min de show todo falado em inglês, e ocuparia ' +
                 'a janela do Remy' },
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
    subtitulo: 'O primeiro dia fora da Disney · e o rope drop que estava certo',
    tipo: 'parque',
    operadora: 'universal',
    parqueId: 'universal-studios',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-10',
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },
    resumo:
      'O parque de rua, não de castelo: quarteirões de Nova York e São Francisco montados ' +
      'como cenário de cinema, com o Beco Diagonal escondido no fundo. Este é o único dia ' +
      'da viagem em que o rope drop do roteiro já estava certo — e ele resolve a maior fila ' +
      'do parque antes das 10h.',
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
        'O ROPE DROP NO GRINGOTTS ESTÁ CERTO, e é a primeira vez na viagem que eu confiro ' +
        'isso e não acho erro.\n\n' +
        'Nos cinco parques da Disney o rope drop caía sempre dentro da multidão do Early ' +
        'Entry. Aqui não cai: o Early Park Admission da Universal é só para hóspede de hotel ' +
        'e alterna entre o Beco Diagonal e Hogsmeade — e a maioria usa em Hogsmeade, no ' +
        'Islands, o que deixa a primeira hora daqui mole.\n\n' +
        'Os números: o Gringotts faz ~15 minutos na primeira hora depois da abertura, 29 às ' +
        '10h e 83 às 15h, com pico de 190 e média de 57. É a maior vantagem de horário do ' +
        'dia inteiro, e ela é de graça.',
        pesquisa: '2026-09-10' },

      { tipo: 'alerta', texto:
        'TRÊS ATRAÇÕES QUE O ROTEIRO CITAVA NÃO EXISTEM MAIS. Nenhuma delas é escolha de ' +
        'vocês — todas fecharam, e ficam registradas em "fechado" com data:\n\n' +
        'HOLLYWOOD RIP RIDE ROCKIT — fechou em 2025 para dar lugar ao Fast & Furious: ' +
        'Hollywood Drift. CUIDADO COM A NOTÍCIA: o Hollywood Drift abriu em 16/09/2026, mas ' +
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
          'Direto ao Beco Diagonal, sem parar na Production Central — ela é a zona de ' +
          'esmagamento do rope drop justamente por ser a primeira que aparece.',
          'Gringotts primeiro, enquanto ele custa 15 minutos em vez de 83.',
          'Transformers na segunda hora, que é a última janela barata dele antes da noite.',
          'Mummy, Minion Land e o Beco com calma até o almoço.',
          'A tarde é a metade de baixo do anel: Men in Black, Simpsons, E.T. e o Bourne.',
          'Desfile, jantar, e o Beco à noite para fechar.',
        ] },
      { letra: 'B', titulo: 'O desfile é às 17h30 — e provavelmente é',
        gatilho: 'Vocês conferem no app e a sessão é 17h30, não 19h30.',
        passos: [
          'É o cenário que o roteiro já assume. Não muda nada.',
          'O Bourne termina 17h20 e vocês pegam lugar direto, sem intervalo.',
          'Se a sessão for 19h30, o jantar sobe para 17h45 e o Beco à noite vem antes do ' +
          'desfile, não depois — e o dia termina no desfile.',
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
          'A PRIMEIRA COISA AO PASSAR: não parem na Production Central. Ela é a primeira área ' +
          'que aparece e é exatamente por isso que ela entope no rope drop. Sigam reto.',
        localId: 'universal-studios', acesso: [], duracaoMin: 30 },

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
          '21h, e vocês vão estar jantando.\n\n' +
          'LOCKER OBRIGATÓRIO. Deixem os bolsos vazios antes de entrar na fila.',
        areaParque: 'Diagon Alley', acesso: ['rope-drop', 'standby'], acessoAlt: 'single-rider',
        acessoAltNota: 'Não na primeira vez: single rider pula o saguão dos duendes e os dois pré-shows.',
        critico: true, duracaoMin: 40,
        fila: { min: 15, quando: 'na primeira hora', pico: 190, estimado: 57, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

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
        areaParque: 'Production Central', acesso: ['standby'], acessoAlt: 'single-rider', duracaoMin: 35,
        fila: { min: 30, quando: 'na segunda hora', pico: 120, estimado: 33, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1711-1030', hora: '10:30', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Revenge of the Mummy',
        descricao: 'Coaster no escuro com lançamento. Detector de metal na entrada',
        contexto:
          'Montanha-russa fechada com lançamento, fogo de verdade e uma parada no escuro total ' +
          'no meio. Curta e muito bem feita — é consenso como a melhor montanha-russa deste ' +
          'parque.\n\n' +
          'A FILA DELE DISTRIBUI IGUAL O DIA INTEIRO, com média de 44 minutos: não existe hora ' +
          'boa nem hora ruim, e por isso ele fica aqui, entre duas atrações que têm hora certa.\n\n' +
          'DETECTOR DE METAL: nada nos bolsos, nem chave nem celular. Locker obrigatório.',
        areaParque: 'New York', acesso: ['standby'], acessoAlt: 'single-rider', duracaoMin: 35,
        fila: { min: 30, quando: 'de manhã', pico: 120, estimado: 44, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1711-1110', hora: '11:10', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Despicable Me Minion Mayhem',
        descricao: 'A terceira maior fila do parque, e ela estava fora do roteiro',
        contexto:
          'Simulador com telas, em que vocês viram Minions. É bobo de propósito e funciona ' +
          'muito bem — não depende de inglês e é dos poucos que arranca risada de todo mundo.\n\n' +
          'Ele faz 35 minutos de média, atrás só do Gringotts e do Mummy, e estava faltando no ' +
          'roteiro. Está aqui porque a Minion Land já era parada do dia por causa do ' +
          'Villain-Con, no bloco seguinte: são duas atrações na mesma área, sem caminhada ' +
          'entre elas.',
        areaParque: 'Minion Land', acesso: [], duracaoMin: 35,
        fila: { min: 25, quando: 'antes do almoço', pico: 75, estimado: 35, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1711-1145', hora: '11:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Villain-Con Minion Blast',
        descricao: 'Você atira, andando numa esteira. Sem fila de verdade',
        contexto:
          'Metade jogo de tiro, metade passeio: vocês ficam numa esteira rolante com uma arma ' +
          'de raio e vão pontuando pelos cenários. É o mais novo do parque nesta área e engole ' +
          'gente rápido, então a fila quase nunca acumula.',
        areaParque: 'Minion Land', acesso: [], duracaoMin: 30,
        pesquisa: '2026-09-10' },

      { id: 'b-1711-1225', hora: '12:25', ancora: 'referencia', tipo: 'livre',
        titulo: 'Beco Diagonal',
        descricao: 'Ollivanders, o dragão do Gringotts, decoração de Natal',
        contexto:
          'A land mais bem construída dos dois parques da Universal, e ela não parece com ' +
          'Hogsmeade: aqui é a Londres bruxa, entrando por uma parede de tijolos atrás da ' +
          'fachada da estação. O dragão em cima do Gringotts cospe fogo de tempos em tempos — ' +
          'dá para ouvir ele carregando antes.\n\n' +
          'OLLIVANDERS: a cerimônia da varinha, em que a varinha escolhe o bruxo. A daqui é a ' +
          'versão maior, com mais salas que a de Hogsmeade que vocês fazem no dia 23. É de ' +
          'graça assistir; a varinha custa à parte.\n\n' +
          'É AGORA E NÃO À NOITE que dá para ver as vitrines com calma — o Beco à noite, no ' +
          'fim do dia, é para a luz, não para as lojas.',
        areaParque: 'Diagon Alley', acesso: [], duracaoMin: 45,
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
          'LOCKER OBRIGATÓRIO, mas com mais tolerância que o Mummy.',
        areaParque: 'World Expo', acesso: ['standby'], acessoAlt: 'single-rider', duracaoMin: 40,
        fila: { min: 20, quando: 'à tarde', pico: 60, estimado: 22, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1711-1500', hora: '15:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'The Simpsons Ride',
        descricao: 'Simulador. O humor sobrevive à tradução',
        contexto:
          'Simulador em tela gigante côncava, com a família Simpson num parque de diversões ' +
          'que dá errado. É rápido, sacode e o humor é visual o bastante para funcionar sem ' +
          'pegar todas as piadas.\n\n' +
          'A área em volta é a Springfield inteira reconstruída — a estátua do Jebediah, o ' +
          'Kwik-E-Mart, a Duff. Vale andar cinco minutos por ela mesmo sem entrar em nada, e ' +
          'esses minutos estão dentro deste bloco.',
        areaParque: 'Springfield', acesso: [], duracaoMin: 40,
        fila: { min: 20, quando: 'à tarde', pico: 55, estimado: 22, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

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
        fila: { min: 25, quando: 'no fim da tarde', pico: 70, estimado: 28, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1711-1630', hora: '16:30', ancora: 'referencia', tipo: 'show',
        titulo: 'The Bourne Stuntacular',
        descricao: 'O melhor show de Orlando. Puramente visual',
        contexto:
          'Espetáculo de dublês ao vivo misturado com projeção numa tela de 40 metros, em que ' +
          'o ator sai de dentro da tela e continua a cena no palco sem corte visível. É ' +
          'perseguição, luta e queda de prédio, e é consenso como o melhor show de qualquer ' +
          'parque de Orlando.\n\n' +
          'É FALADO EM INGLÊS MAS NÃO DEPENDE DISSO: é ação de ponta a ponta e a trama cabe ' +
          'numa frase. Foi por isso que ele ficou e os outros shows do parque não.\n\n' +
          'Cheguem 15 minutos antes. Ele tem sessão marcada e não desloca com o resto do dia.',
        areaParque: 'Hollywood', acesso: [], duracaoMin: 50, confirmarHorario: true,
        pesquisa: '2026-09-10' },

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
          'Peguem lugar 20 minutos antes, na Hollywood, perto do Mel’s. É onde o desfile ' +
          'passa mais devagar e onde dá para sair rápido no fim.',
        areaParque: 'Hollywood', acesso: [], duracaoMin: 60, confirmarHorario: true, critico: true,
        pesquisa: '2026-09-10' },

      { id: 'b-1711-1845', hora: '18:45', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Finnegan’s Bar & Grill',
        descricao: 'Pub irlandês na New York. Sem reserva',
        contexto:
          'Pub irlandês dentro do cenário de Nova York, com música ao vivo à noite e cerveja ' +
          'tirada na hora. É comida de pub — fish and chips, shepherd’s pie, hambúrguer — e ' +
          'o valor está em sentar num salão que parece de rua de verdade.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta, e o preço da etiqueta não inclui o imposto.\n\n' +
          'ALTERNATIVA: o CityWalk fica fora da catraca e não fecha com o parque. Se o parque ' +
          'fechar às 19h, o jantar vai para lá — e aí o dia acaba no desfile.',
        restauranteId: 'r-finnegans', areaParque: 'New York', acesso: [], duracaoMin: 70 },

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

      { id: 'b-1711-2100', hora: '21:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar ao hotel',
        descricao: 'Uber. Andem até o CityWalk antes de chamar',
        contexto:
          'Mesma regra do Kia Center: a tarifa dinâmica na porta do parque logo depois do ' +
          'fechamento é brutal. O CityWalk fica no caminho e tem ponto próprio.\n\n' +
          'Amanhã não tem parque e não tem alarme: o dia 18 começa às 9h.',
        acesso: [], duracaoMin: 45 },
    ],
    naoPerca: [
      { nome: 'A cerimônia da varinha no Ollivanders', quando: 'hoje', custo: 'grátis assistir',
        motivo: 'A varinha escolhe uma pessoa da plateia. A daqui é a versão maior, com mais ' +
                'salas que a de Hogsmeade do dia 23 — se for para ver uma, é esta.' },
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
        { texto: 'Ingresso do jogo do Orlando Magic à mão nos dois celulares', critico: true,
          motivo: 'Jogo às 19h no Kia Center. Confiram o horário: a NBA remarca por TV, e ' +
                  'isso muda perto da data.' },
        { texto: 'Mochila PEQUENA para amanhã — o Kia Center não aceita mochila', critico: true,
          motivo: 'A arena NÃO aceita bolsa: só uma clutch de 11 × 16 × 2,5 cm, menor que a ' +
                  'maioria das carteiras. Se saírem de casa com a mochila do parque, vão ter ' +
                  'que pagar armário Binbox na Church St.' },
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
        alternativa: 'Express Pass Now dentro do parque (US$ 20–30, uma atração) se um dia virar.',
      },
      custoEstimadoCasal: { min: 0, max: 0, moeda: 'USD' },
      extras: [
        { nome: 'Lockers obrigatórios',
          custo: { min: 0, max: 6, moeda: 'USD' },
          texto:
            'Três atrações de hoje exigem guardar tudo antes de embarcar: Gringotts, Revenge ' +
            'of the Mummy e Men in Black. O Mummy tem DETECTOR DE METAL — nada nos bolsos, ' +
            'nem chave nem celular.\n\n' +
            'O locker padrão é gratuito pelo tempo da fila mais a duração da atração; o grande ' +
            'custa US$ 2 a 3. Cada uso come 10 a 15 minutos que a duração dos blocos não ' +
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
      ],
      idioma: {
        itens: ['Animal Actors on Location', 'DreamWorks Imagination Celebration'],
        motivo:
          'Shows de palco falados em inglês, 20 a 25 minutos cada. Mesmo teste que reprovou o ' +
          'American Adventure no Epcot e os dois shows do Epic. O Bourne Stuntacular passou no ' +
          'teste porque é ação de ponta a ponta e não depende de texto.',
      },
      fechado: [
        'Hollywood Rip Ride Rockit — fechou em 2025 para dar lugar ao Fast & Furious: ' +
        'Hollywood Drift. ATENÇÃO: o Hollywood Drift abriu em 16/09/2026 na CALIFÓRNIA; a ' +
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
      'O KIA CENTER NÃO ACEITA BOLSA. A única exceção é uma clutch de 4,5" × 6,5" × 1" — ' +
      'onze por dezesseis centímetros, menor que a maioria das carteiras. Não é "bolsa ' +
      'pequena": é quase nada. Quem chegar com sacola usa os armários Binbox, na Church St. ' +
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
        'É por isso que a volta ao hotel às 14h15 existe. Ela não é descanso: é a única ' +
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
        'O MILLENIA É A 8 MINUTOS DO LAKE EOLA — 6,3 milhas. O hotel é a 25 ou 30 minutos ' +
        'dos dois. Ou seja: a ida ao hotel no meio da tarde custa quase uma hora de carro e ' +
        'duas corridas, para terminar a oito minutos de onde vocês já estavam.\n\n' +
        'Ela continua no roteiro pelo motivo da bolsa, não por geografia. Se as compras ' +
        'couberem numa sacola, o plano B é melhor.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'O JANTAR TEM 65 MINUTOS E É UMA CHURRASCARIA. É apertado e não adianta fingir que ' +
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
          'Millenia até as 13h, almoço lá mesmo.',
          'Volta ao hotel só para largar sacola — e sair de novo às 16h.',
          'Barco-cisne às 16h30, enquanto ainda há sol.',
          'Pôr do sol na margem, jantar no Kres e cinco minutos a pé até a arena.',
        ] },
      { letra: 'B', titulo: 'Vocês compraram pouco',
        gatilho: 'Cabe tudo numa sacola só, ou vocês não compraram nada.',
        passos: [
          'PULEM A VOLTA AO HOTEL. Millenia → centro são 8 minutos.',
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
          'A manhã é lenta de propósito. Ontem foi Universal Studios das 7h45 às 21h, e ' +
          'amanhã é o Epic Universe com saída às 7h15. Este é o único respiro entre os dois.',
        acesso: [], duracaoMin: 90 },

      { id: 'b-1811-1030', hora: '10:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair para o Mall at Millenia',
        descricao: '~25 min. Uber US$ 28–40',
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
        titulo: 'Voltar ao hotel — deixar as compras',
        descricao: 'NÃO é descanso. É a única janela de largar sacola antes da arena',
        contexto:
          'Este bloco existe por causa da regra de bolsa do Kia Center, não por cansaço. A ' +
          'arena aceita uma clutch de 11 × 16 cm e mais nada — sacola de shopping não entra ' +
          'de jeito nenhum.\n\n' +
          'Aproveitem para trocar de roupa e carregar o celular: a noite vai até 22h15 e a ' +
          'saída de amanhã é 7h15.\n\n' +
          'DEIXEM A MOCHILA DO EPIC PRONTA AGORA. Amanhã de manhã vocês não vão ter tempo, e ' +
          'hoje à noite vocês vão chegar mortos.\n\n' +
          'SE VOCÊS COMPRARAM POUCO, este bloco não precisa existir: vejam o plano B.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 105 },

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
          'Churrascaria americana no centro histórico, na Church Street: carnes, frutos do ' +
          'mar e opções vegetarianas com toque mediterrâneo. Segunda a sexta serve das 11h30 ' +
          'às 23h30.\n\n' +
          'A LOCALIZAÇÃO É O QUE FAZ ELE GANHAR: fica no mesmo quarteirão do Kia Center e dos ' +
          'armários Binbox. Do prato à catraca são cinco minutos a pé.\n\n' +
          'SÃO 65 MINUTOS E É POUCO PARA UMA CHURRASCARIA. Avisem na chegada que vocês têm ' +
          'jogo às 19h — restaurante colado em arena lida com isso toda semana. Se atrasar, ' +
          'comam leve e completem lá dentro.\n\n' +
          'RESERVA RECOMENDADA: é noite de jogo da NBA no centro, e o restaurante enche por ' +
          'causa disso. Está no checklist.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta sobre o valor sem imposto.',
        restauranteId: 'r-kres', endereco: '17 W Church St', localId: 'kia-center',
        acesso: ['reserva'], duracaoMin: 65, pesquisa: '2026-09-10' },

      { id: 'b-1811-1850', hora: '18:50', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Kia Center — portões',
        descricao: 'Cinco minutos a pé do Kres. Clutch de 11 cm, ou nada',
        contexto:
          'Os portões abrem às 18h, uma hora antes do jogo, mas não há motivo para entrar ' +
          'cedo: o que existe lá dentro é loja e balcão de comida.\n\n' +
          'ÚLTIMA CONFERÊNCIA ANTES DA CATRACA: nada de bolsa. Celular, cartão e documento no ' +
          'bolso, ou numa clutch de 11 × 16 × 2,5 cm. Ingresso no celular dos dois, cada um ' +
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
      titulo: 'Epic Universe · saída 7h15, rope drop na Dark Universe',
      aviso: 'Saída às 7h15 e vocês chegam do jogo por volta das 22h15. São nove horas entre ' +
             'a volta e a saída — resolvam tudo ANTES de sair para o jogo, não depois.',
      itens: [
        { texto: 'Mochila do Epic montada ANTES de sair para o jogo', critico: true,
          motivo: 'Hoje vocês saem com uma clutch de 11 cm e voltam depois das 22h. A mochila ' +
                  'de amanhã tem de estar pronta em cima da cama quando vocês chegarem: duas ' +
                  'garrafas, barrinhas, protetor solar, power bank, cabo e capa de chuva.' },
        { texto: 'Alarme para 6h15 nos dois celulares', critico: true,
          motivo: 'Saída 7h15. Depois de uma noite que termina 22h15, um alarme só falha.' },
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
        { texto: 'Guardar as compras do Millenia', critico: false,
          motivo: 'Amanhã a mochila precisa sair leve — o Epic tem locker obrigatório em ' +
                  'três atrações, e detector de metal no Stardust Racers.' },
        { texto: 'Confirmação do Atlantic à mão: 639247233607631616', critico: false,
          motivo: 'Jantar às 17h de amanhã. A mesa é segurada só por 15 minutos, então o número ' +
                  'fica no celular, não perdido no e-mail.' },
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
      idioma: null,
      fechado: [
        'Ace Cafe Orlando — fechou em maio de 2023, depois de seis anos, e o terreno foi ' +
        'vendido para virar um prédio alto. Estava no roteiro como opção de jantar.',
      ],
    },
  },

  /* ===== 19/11 · QUINTA · EPIC UNIVERSE ================================= */
  {
    id: 'd-2026-11-19',
    data: '2026-11-19',
    diaSemana: 'quinta',
    emoji: '🌌',
    titulo: 'Epic Universe',
    subtitulo: 'Dia único · rope drop na Dark Universe e as duas maiores filas no fim',
    tipo: 'parque',
    operadora: 'universal',
    parqueId: 'epic-universe',
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-10',
    referencia: { rotulo: 'Abertura do parque', padrao: '09:00', confirmado: false },
    resumo:
      'O parque mais concorrido de Orlando, no dia mais vazio da segunda metade da viagem, ' +
      'e o único dia de Epic. As onze atrações de brinquedo cabem — mas só em uma ordem: ' +
      'começar pelo portal que o Early Park Admission deixa vazio e guardar as duas maiores ' +
      'filas do parque para as horas em que elas despencam.',
    avisos: [
      'O ROPE DROP É NA DARK UNIVERSE, NÃO NO MINISTRY. Às 9h os hóspedes de hotel já estão ' +
      'há uma hora no Battle at the Ministry, na Super Nintendo World e em Berk. O portal ' +
      'que abre vazio para vocês é o da Dark Universe. Confiram a lista do Early Park ' +
      'Admission na véspera: ela já mudou três vezes em dezoito meses.',
      'Hoje não tem carro — ele só é retirado amanhã. É Uber na ida e na volta, e o ponto ' +
      'de embarque do Epic é próprio, a cinco minutos a pé da entrada.',
      'É o único dia de Epic da viagem. Se hoje der muito errado, a manhã livre de amanhã é o ' +
      'lugar mais barato para usar o segundo dia do ingresso — se ele permitir.',
    ],
    notas: [
      { tipo: 'alerta', texto:
        'O ROPE DROP MUDOU DE LUGAR, e é a quinta vez na viagem que ele estava dentro da ' +
        'multidão do Early Entry.\n\n' +
        'O MECANISMO, confirmado em fevereiro de 2026: durante o Early Park Admission o ' +
        'Celestial Park fica aberto para TODO MUNDO, e a checagem de hóspede de hotel é feita ' +
        'na porta de cada land. Vocês entram no parque cedo, mas não passam dos portais que ' +
        'participam do EPA.\n\n' +
        'QUEM PARTICIPA: desde fevereiro de 2026, conferido de novo em 16/06/2026, são a ' +
        'Ministry of Magic, a Super Nintendo World e a Isle of Berk. O Stardust Racers e o ' +
        'Carrossel saíram, e a Dark Universe também.\n\n' +
        'Por isso o dia começa no Monsters Unchained. O bloco das 9h antigo, no Battle at the ' +
        'Ministry, era exatamente a fila de quem entrou uma hora antes.\n\n' +
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
        'E UMA CORREÇÃO: o roteiro antigo dizia que as três de maior demanda eram Ministry, ' +
        'Monsters Unchained e Stardust. O Monsters é uma das MENORES filas do parque, 13 a 15 ' +
        'minutos. As três maiores são Mine-Cart, Ministry e Mario Kart.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'O GUIA OFICIAL DE SEGURANÇA DA UNIVERSAL, vigente desde 04/10/2025, corrige o que o ' +
        'roteiro dizia das atrações.\n\n' +
        'LOCKER OBRIGATÓRIO em só três: Stardust Racers, Monsters Unchained e Hiccup’s Wing ' +
        'Gliders. DETECTOR DE METAL só no Stardust.\n\n' +
        'Mine-Cart e Curse of the Werewolf pedem para prender tudo que estiver solto. No ' +
        'Dragon Racer’s Rally há compartimento no próprio brinquedo.\n\n' +
        'E três descrições estavam amenas demais: Curse, Hiccup’s e Mine-Cart são montanhas-' +
        'russas de alta velocidade, não "familiares"; e no Dragon Racer’s Rally é você quem ' +
        'controla a inclinação e as inversões.',
        pesquisa: '2026-09-10' },

      { tipo: 'info', texto:
        'SEM CARRO HOJE. O carro alugado só é retirado amanhã, dia 20, às 15h, na Avis do Old ' +
        'Town.\n\n' +
        'O Epic não usa o estacionamento da Universal: o ponto de Uber é próprio, na 1222 Epic ' +
        'Blvd, a uns cinco minutos a pé da entrada. É por isso que dá para sair às 7h15 e não ' +
        'às 6h45 — a caminhada longa do estacionamento, que o roteiro antigo contava, não ' +
        'existe para quem chega de Uber.',
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
        'POR QUE ESTE DIA É 19/11 E NÃO 23/11. O parque estava marcado para a segunda-feira da ' +
        'semana de Thanksgiving, dentro do bloqueio de 23 a 27/11. A quinta 19/11 é apontada ' +
        'como um dos dois dias mais vazios de toda a segunda metade de novembro, e o Islands ' +
        'foi para 23/11 no lugar.\n\n' +
        'O CUSTO DA TROCA: hoje vocês acordam no dia seguinte ao jogo da NBA.',
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
          'Tarde em Berk, com o Fyre Drill só se estiver quente.',
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
          'O jantar NÃO muda: a reserva tem hora.',
          'Com fechamento às 20h, o Ministry sobe para 16h20 e o jantar vai para depois dele — ' +
          'remarquem a reserva para as 18h.',
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
          'O Fyre Drill cai sem discussão: ele encharca.',
          'Monsters Unchained, Battle at the Ministry, Toadstool e Atlantic são cobertos.',
          'As montanhas-russas param com raio. Se pararem, adiantem o que é coberto e voltem.',
        ] },
    ],
    blocos: [
      { id: 'b-1911-0715', hora: '07:15', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel — Uber',
        descricao: '~30 min, US$ 25–38. O carro só chega amanhã',
        contexto:
          'Hoje é Uber: o carro alugado só é retirado amanhã às 15h, na Avis do Old Town.\n\n' +
          'O DESTINO NO APP É O PONTO DE EMBARQUE DO EPIC, 1222 Epic Blvd — não é o ' +
          'estacionamento da Universal, que fica em outro lugar. De lá são uns cinco minutos a ' +
          'pé até a entrada.',
        localId: 'epic-universe', acesso: [], duracaoMin: 35, pesquisa: '2026-09-10' },

      { id: 'b-1911-0750', hora: '07:50', ancora: 'referencia', tipo: 'deslocamento',
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

      { id: 'b-1911-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Monsters Unchained: The Frankenstein Experiment',
        descricao: 'Rope drop. O portal que abre vazio para quem é de fora',
        contexto:
          'Dark ride em braço robótico: a neta do Dr. Frankenstein faz experimentos com monstros ' +
          'capturados e eles escapam. O veículo acelera, para, gira, sobe e cai, com ' +
          'animatrônicos no nível dos melhores de Orlando. Tem susto, mas nenhuma queda grande.\n\n' +
          'POR QUE AGORA: é a primeira fila que abre vazia para quem não está em hotel da ' +
          'Universal. Ela enche logo depois da abertura, e ao longo do dia é uma das menores do ' +
          'parque — então pegar vazia agora é o jeito de o resto do dia render.\n\n' +
          'LOCKER OBRIGATÓRIO. Bolsos vazios antes de entrar na fila.',
        areaParque: 'Dark Universe', acesso: ['rope-drop', 'standby'], acessoAlt: 'single-rider',
        locker: 'obrigatorio', critico: true, duracaoMin: 35,
        fila: { min: 10, quando: 'na abertura', pico: 45, estimado: 14, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1911-0940', hora: '09:40', ancora: 'referencia', tipo: 'atracao',
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
        fila: { min: 20, quando: 'logo depois da abertura', pico: 75, estimado: 46, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1911-1020', hora: '10:20', ancora: 'referencia', tipo: 'atracao',
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
        fila: { min: 20, quando: 'no meio da manhã', pico: 105, estimado: 25, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1911-1105', hora: '11:05', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mario Kart: Bowser’s Challenge',
        descricao: 'A janela dele é 11h–12h, quando a turma do EPA sai da Nintendo',
        contexto:
          'Corrida de kart em realidade aumentada: vocês usam um visor acoplado ao boné e ' +
          'coletam moedas e atiram cascos girando o volante. É um jogo, não emoção física — e ' +
          'o placar é por pessoa.\n\n' +
          'POR QUE AGORA: ele é a terceira maior fila do parque, 67 a 78 minutos de média, e a ' +
          'janela menos ruim dele é entre 11h e 12h, quando quem entrou no Early Park Admission ' +
          'já andou nele e seguiu adiante.\n\n' +
          'AO ENTRAR NA SUPER NINTENDO WORLD, ABRAM O APP DA UNIVERSAL e vejam se o Toadstool ' +
          'Cafe está com lista de espera. Se estiver, entrem nela agora, para o almoço das 13h.\n\n' +
          'E reparem na decoração: é o primeiro Natal da Super Nintendo World.',
        areaParque: 'Super Nintendo World', acesso: ['standby'], acessoAlt: 'single-rider',
        critico: true, duracaoMin: 70,
        fila: { min: 60, quando: 'entre 11h e 12h', pico: 170, estimado: 72, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1911-1215', hora: '12:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Yoshi’s Adventure',
        descricao: 'Lento e elevado. É a única vista da Nintendo de cima',
        contexto:
          'Passeio lento em cima de um Yoshi, pelos trilhos elevados da área. É brinquedo de ' +
          'criança, mas é a única forma de ver a Super Nintendo World inteira de cima — e ela ' +
          'está decorada.\n\n' +
          'O meio do dia é a hora mais baixa das filas médias: quando as grandes estão no pico, ' +
          'as pequenas esvaziam.',
        areaParque: 'Super Nintendo World', acesso: ['standby'], duracaoMin: 40,
        fila: { min: 20, quando: 'no meio do dia', pico: 95, estimado: 34, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1911-1300', hora: '13:00', ancora: 'referencia', tipo: 'refeicao',
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
          'O pico do almoço no parque é das 11h30 às 13h30. Às 13h vocês pegam o fim dele.\n\n' +
          'É serviço rápido, com pedido pela mesa: não leva gorjeta de garçom.',
        restauranteId: 'r-toadstool', areaParque: 'Super Nintendo World', acesso: [],
        duracaoMin: 60, pesquisa: '2026-09-10' },

      { id: 'b-1911-1410', hora: '14:10', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Hiccup’s Wing Gliders',
        descricao: 'Isle of Berk. Lançamento de alta velocidade, com trecho de ré. Locker',
        contexto:
          'Montanha-russa de lançamento no mundo de Como Treinar o Seu Dragão, com aceleração ' +
          'forte, subidas, quedas e um trecho de ré. Não é suave — o roteiro antigo dizia que ' +
          'era. A vila viking em volta é das mais bonitas do parque, e hoje está no Snoggletog, ' +
          'o Natal de Berk.\n\n' +
          'A fila dela piora no fim da tarde, por volta das 17h. No começo da tarde ainda está ' +
          'no meio do caminho.\n\n' +
          'LOCKER OBRIGATÓRIO.',
        areaParque: 'Isle of Berk', acesso: ['standby'], acessoAlt: 'single-rider', locker: 'obrigatorio',
        duracaoMin: 45,
        fila: { min: 30, quando: 'no começo da tarde', pico: 120, estimado: 38, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1911-1500', hora: '15:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Dragon Racer’s Rally',
        descricao: 'Você controla a inclinação — e as inversões',
        contexto:
          'Braços que erguem o carrinho no alto e giram, e é você quem controla quanto ele ' +
          'inclina — dá para virar de cabeça para baixo ou não. Não é "leve", como o roteiro ' +
          'antigo dizia: a intensidade é escolha de quem está sentado.\n\n' +
          'Há compartimento no próprio brinquedo para guardar o que estiver solto.',
        areaParque: 'Isle of Berk', acesso: ['standby'], duracaoMin: 40,
        fila: { min: 25, quando: 'à tarde', pico: 100, estimado: 37, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1911-1545', hora: '15:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Fyre Drill',
        descricao: 'Opcional. O guia oficial diz: "possivelmente encharca"',
        contexto:
          'Barcos giratórios em que vocês operam canhões de água contra os outros barcos — e ' +
          'levam água de volta, inclusive de jatos que disparam sem aviso. O guia oficial da ' +
          'Universal é direto: os passageiros vão se molhar, possivelmente encharcar.\n\n' +
          'MESMO CRITÉRIO DO KALI RIVER RAPIDS NO DIA 13: se a tarde estiver fria, pulem sem ' +
          'culpa. Ele saiu das 17h40, já escurecendo e antes do jantar, para cá, com o sol ' +
          'ainda alto.\n\n' +
          'Se fizerem: capa de chuva vestida e celular no Ziploc.',
        areaParque: 'Isle of Berk', acesso: ['standby'], molha: true, opcional: true,
        duracaoMin: 25,
        fila: { min: 10, quando: 'qualquer hora', pico: 65, estimado: 13, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1911-1615', hora: '16:15', ancora: 'referencia', tipo: 'livre',
        titulo: 'Pausa · Constellation Carousel · Celestial Park de Natal',
        descricao: 'Água, banheiro, alguma coisa da mochila. O carrossel é se der vontade',
        contexto:
          'A parada antes da reta final, e a reta final é longa: jantar, Ministry e Mine-Cart ' +
          'emendados até as 21h. Encham as garrafas num balcão de comida — a água gelada é de ' +
          'graça — e sentem.\n\n' +
          'O Celestial Park no Natal vira paisagem de inverno, com show natalino nas fontes. O ' +
          'horário do show ainda não saiu.\n\n' +
          'O Constellation Carousel fica aqui, com criaturas que giram sozinhas além do giro ' +
          'do carrossel. Fila média de 21 minutos. Não é bloco próprio: se estiver curta, vão.',
        areaParque: 'Celestial Park', acesso: [], duracaoMin: 40, pesquisa: '2026-09-10' },

      { id: 'b-1911-1700', hora: '17:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Atlantic',
        descricao: 'Reservado para as 17h. Cheguem 5 min antes: a mesa espera só 15 min',
        contexto:
          'Restaurante de frutos do mar e carnes no Celestial Park, o mais formal do parque. ' +
          'Pratos principais de US$ 35 a 48.\n\n' +
          'POR QUE ÀS 17H: é o jantar cedo que paga o dia. As duas maiores filas do parque só ' +
          'ficam razoáveis no fim — o Ministry nas últimas duas ou três horas, o Mine-Cart na ' +
          'última — e as duas precisam de todo o tempo depois daqui.\n\n' +
          'RESERVADO: confirmação 639247233607631616, duas pessoas, 17h. A Universal pede ' +
          'chegada 5 minutos antes e segura a mesa só por 15 minutos — às 17h15 a reserva é ' +
          'liberada. A pausa das 16h15 termina às 16h55 no próprio Celestial Park: é ' +
          'exatamente a folga pedida.\n\n' +
          'Para remarcar ou cancelar: pela conta da Universal no app, ou +1 407-224-3663.\n\n' +
          'SE PERDEREM A MESA: o Mead Hall, salão viking da Isle of Berk, não aceita reserva — ' +
          'é mais barato e mais temático. Berk fica do outro lado do Ministry: contem a ' +
          'caminhada de volta para as 18h20.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta, e o preço da etiqueta não inclui o imposto.',
        restauranteId: 'r-atlantic', areaParque: 'Celestial Park', acesso: ['reserva'],
        duracaoMin: 75, pesquisa: '2026-09-10' },

      { id: 'b-1911-1820', hora: '18:20', ancora: 'fixo', tipo: 'atracao',
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
        fila: { min: 45, quando: 'nas últimas 2–3 horas', pico: 185, estimado: 76, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1911-2000', hora: '20:00', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Mine-Cart Madness',
        descricao: 'A maior fila do parque. Na última hora ela cai para 20–30 min',
        contexto:
          'Montanha-russa em carrinho de mina do Donkey Kong, com uma ilusão muito boa: o ' +
          'carrinho parece saltar trechos de trilho que faltam. Alta velocidade, sem inversão.\n\n' +
          'POR QUE NO FIM: é a maior fila do parque, 113 a 114 minutos de média e pico de 205. ' +
          'Fora do Early Park Admission, a única janela barata é a última hora antes de fechar, ' +
          'quando cai para 20 a 30 minutos. É a mesma manobra do Flight of Passage no dia 13.\n\n' +
          'QUEM ESTÁ NA FILA NO FECHAMENTO ANDA. Entrem antes das 21h e não saiam dela.\n\n' +
          'ELE QUEBRA COM FREQUÊNCIA. Se estiver parado, acompanhem pelo app e fiquem por ' +
          'perto — o plano C trata disso.\n\n' +
          'Sem locker obrigatório, mas prendam tudo que estiver solto.',
        areaParque: 'Super Nintendo World', acesso: ['standby'], acessoAlt: 'single-rider',
        critico: true, confirmarHorario: true, duracaoMin: 50,
        fila: { min: 20, quando: 'na última hora', pico: 205, estimado: 113, fonte: '2026-09-10' },
        pesquisa: '2026-09-10' },

      { id: 'b-1911-2100', hora: '21:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Sair — Uber',
        descricao: 'Pelo Celestial Park iluminado. Embarque na 1222 Epic Blvd',
        contexto:
          'A saída atravessa o Celestial Park de noite, com a decoração de Natal acesa — é o ' +
          'parque no seu melhor, e vocês passam por ele de qualquer jeito.\n\n' +
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
        motivo: 'É a primeira temporada em que a área ganha decoração. A vista de cima, no ' +
                'Yoshi’s Adventure, é a melhor forma de ver.',
        pesquisa: '2026-09-10' },
      { nome: 'Show natalino das fontes do Celestial Park', quando: 'hoje',
        condicao: 'horário ainda não anunciado', custo: 'grátis',
        motivo: 'As fontes do Celestial Park ganham show de Natal na temporada. A Universal ' +
                'anuncia os horários perto do início dela.',
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
      paraODia: '2026-11-20',
      titulo: 'Carro e Old Town · manhã livre',
      aviso: 'Amanhã não tem alarme nem parque. O único horário marcado é a retirada do carro, ' +
             'às 15h, e ela é a tarefa crítica do dia.',
      itens: [
        { texto: 'Separar os quatro documentos da retirada do carro', critico: true,
          motivo: 'Carteira de motorista, PID, passaporte e cartão de CRÉDITO internacional, ' +
                  'todos em nome do condutor. A retirada é às 15h, na Avis do Old Town, e sem ' +
                  'um deles não sai carro.' },
        { texto: 'Separar a roupa suja da semana', critico: false,
          motivo: 'Amanhã às 10h é a segunda rodada de lavanderia, com a roupa dos dias 15 a 20.' },
        { texto: 'Guardar as compras e esvaziar a mochila do parque', critico: false,
          motivo: 'Amanhã é dia de cidade pequena e de rua. A mochila de parque fica.' },
        { texto: 'Celular e power bank carregando', critico: false,
          motivo: 'Hoje foram catorze horas de parque com o app aberto o tempo todo.' },
      ],
    },
    ficha: {
      multiPass: null, singlePass: null,
      expressPass: {
        usar: false,
        motivo: 'US$ 600 no casal por um dia. Continua sendo não — e com o rope drop na Dark ' +
                'Universe e as duas maiores filas no fim, o dia não precisa dele para caber.',
        alternativa: 'Duas saídas, nesta ordem. Express Pass Now dentro do parque, US$ 20 a 30 ' +
                     'por atração, para resolver uma fila específica. E o segundo dia do ' +
                     'ingresso, se ele permitir: a manhã livre do dia 20 não tira nada do ' +
                     'roteiro.',
      },
      custoEstimadoCasal: { min: 0, max: 0, moeda: 'USD' },
      extras: [
        { nome: 'Lockers — só três atrações hoje',
          custo: { min: 0, max: 3, moeda: 'USD' },
          texto: 'Locker obrigatório só no Stardust Racers, no Monsters Unchained e no ' +
                 'Hiccup’s Wing Gliders, e detector de metal só no Stardust — pelo guia ' +
                 'oficial da Universal. O locker comum é grátis pelo tempo da fila mais a ' +
                 'atração; o grande custa US$ 3, e passar do tempo custa US$ 3 a cada meia hora.' },
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
        { nome: 'Bowser Jr. Shadow Showdown',
          motivo: 'Desafio interativo da Super Nintendo World que depende da Power-Up Band. ' +
                  'Menor fila do parque, e é voltado a criança.' },
      ],
      idioma: {
        itens: ['Le Cirque Arcanus', 'The Untrainable Dragon'],
        motivo:
          'Os dois shows de teatro do parque, falados em inglês. Mesmo teste que reprovou o ' +
          'American Adventure no Epcot: são 25 a 30 minutos sentados que rendem muito mais ' +
          'andando.\n\n' +
          'ESTES DOIS, mais as áreas de brincar acima, SÃO A DIFERENÇA INTEIRA entre um dia e ' +
          'dois no Epic Universe. O parque tem 11 atrações de brinquedo, 2 shows e 2 áreas de ' +
          'brincar — e as 11 de brinquedo estão todas neste dia. Foi por isso que o segundo ' +
          'turno pôde virar a despedida no Disney Springs.',
      },
      fechado: [],
    },
  },

  /* ===== 20/11 · SEXTA · CARRO E OLD TOWN ================================ */
  {
    id: 'd-2026-11-20',
    data: '2026-11-20',
    diaSemana: 'sexta',
    emoji: '🚗',
    titulo: 'Carro e Old Town',
    subtitulo: 'Manhã livre · muscle cars à noite',
    tipo: 'livre',
    operadora: null,
    parqueId: null,
    custoZero: false,
    fechado: true,
    revisadoEm: '2026-09-11',
    referencia: null,
    resumo:
      'O único respiro entre o Epic e cinco dias pesados seguidos. Café sem pressa no IHOP, ' +
      'almoço porto-riquenho no Old Town, o carro às 15h — a tarefa crítica do dia — e, à ' +
      'noite, food trucks e o desfile de muscle cars, a três minutos do hotel.',
    avisos: [
      'O ÚNICO HORÁRIO QUE NÃO PODE FALHAR É A RETIRADA DO CARRO, ÀS 15H. Sem carro, o dia 21 ' +
      'em Winter Garden cai: o Farmers Market abre às 8h e só funciona aos sábados.',
      'No balcão da Avis, recusem o pacote de pedágio e-Toll Unlimited. Ele cobra de US$ 11 a ' +
      '26 por dia de aluguel, mesmo nos dias sem pedágio nenhum.',
    ],
    notas: [
      { tipo: 'info', texto:
        'A AVIS FICA DENTRO DO OLD TOWN, nos fundos, em frente à montanha-russa — suíte 434. ' +
        'Abre das 7h às 19h todos os dias, inclusive sábado, e fica a três minutos do hotel.\n\n' +
        'O ALUGUEL É CONTADO EM PERÍODOS DE 24 HORAS. Retirando às 15h de hoje e devolvendo às ' +
        '15h do dia 25, são cinco diárias certas. A tolerância na devolução é de 29 minutos; ' +
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
        'O DESFILE DE SEXTA É O DOS MUSCLE CARS: carros de 1964 em diante e hot rods, expostos ' +
        'desde as 15h e desfilando às 20h30. No sábado existe outro, dos clássicos anteriores ' +
        'a 1985, também às 20h30 — mas amanhã vocês estão no hóquei. Os dois são grátis.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'A MANHÃ LIVRE TAMBÉM É A REDE DE SEGURANÇA DO EPIC. Se ontem der muito errado — o ' +
        'Mine-Cart parado a noite inteira, chuva —, esta manhã é o lugar mais barato para usar ' +
        'o segundo dia do ingresso, porque não tira nada do roteiro. Só vale se o ingresso ' +
        'permitir: alguns ingressos de dois dias da Universal têm um único dia de Epic. É ' +
        'pergunta para a agência, na conferência dos ingressos da Universal.',
        pesquisa: '2026-09-11' },
    ],
    planos: [
      { letra: 'A', titulo: 'O dia como está escrito',
        gatilho: 'O Epic de ontem correu bem e o carro está reservado para as 15h.',
        passos: [
          'Dormir sem alarme. Café da manhã no IHOP da 5184 W Irlo Bronson.',
          'Lavanderia às 10h: a roupa dos dias 15 a 20.',
          'Almoço no El Cilantrillo, dentro do Old Town, e uma volta por lá até o carro.',
          'Carro às 15h na Avis do Old Town e descanso no hotel.',
          'Às 17h20, de volta ao Old Town, já de carro. Jantar no World Food Trucks, lugar na ' +
          'calçada às 20h10 e desfile às 20h30.',
        ] },
      { letra: 'B', titulo: 'O Epic de ontem deu errado',
        gatilho: 'Uma atração grande ficou de fora ontem — o Mine-Cart parado, chuva — e a ' +
                 'agência confirmou que o segundo dia do ingresso vale hoje.',
        passos: [
          'Café da manhã do hotel e Uber às 8h15 para o ponto de embarque do Epic, na 1222 ' +
          'Epic Blvd.',
          'Só o que ficou de fora. Saída às 13h30, sem esticar.',
          'Uber direto para a Avis do Old Town: a retirada das 15h não muda.',
          'A lavanderia passa para as 15h30, no lugar do descanso.',
        ] },
      { letra: 'B2', titulo: 'A Avis não tem o carro',
        gatilho: 'Fila no balcão ou problema com a reserva às 15h.',
        passos: [
          'A filial fica aberta até as 19h: há quatro horas de margem, e a noite é ali mesmo.',
          'Liguem para a filial, +1 321-219-7041, e resolvam antes do jantar.',
          'Se às 16h ainda não houver solução, a Hertz de 7471 W Irlo Bronson é a próxima — ' +
          'e ela fecha às 17h.',
          'O que não pode acontecer é terminar o dia sem carro: amanhã a saída é 8h.',
        ] },
      { letra: 'C', titulo: 'Chuva à noite',
        gatilho: 'A previsão do meio-dia dá chuva para o fim da tarde ou a noite.',
        passos: [
          'Invertam as refeições: World Food Trucks no almoço, El Cilantrillo no jantar. Os ' +
          'trucks são ao ar livre, e o site não diz se há área coberta; o El Cilantrillo é ' +
          'salão fechado, aberto até a meia-noite na sexta.',
          'O desfile é ao ar livre, com carro de coleção. Confiram a página de eventos do Old ' +
          'Town antes de sair do hotel.',
          'Se o desfile não sair, a noite termina no jantar. Amanhã a saída é 8h.',
        ] },
    ],
    blocos: [
      { id: 'b-2011-0800', hora: '08:30', ancora: 'fixo', tipo: 'refeicao',
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

      { id: 'b-2011-1000', hora: '10:00', ancora: 'fixo', tipo: 'tarefa',
        titulo: 'Lavanderia — segunda rodada',
        descricao: 'Roupa dos dias 15 a 20. Sabão e moedas de 25 centavos vêm da lista do Walmart',
        contexto:
          'O Travelodge tem lavanderia de moeda, segundo os sites de reserva. Lavar e secar ' +
          'leva perto de duas horas — é estimativa, não medida.\n\n' +
          'É a última rodada antes da volta: o que sair limpo daqui cobre os dias 21 a 26.\n\n' +
          'Se a máquina do hotel não funcionar, procurem uma lavanderia self-service na 192.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 150 },

      { id: 'b-2011-1230', hora: '12:45', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Almoço — El Cilantrillo',
        descricao: 'Porto-riquenho de mesa, dentro do Old Town. Três minutos de Uber',
        contexto:
          'Comida caseira porto-riquenha: mofongo — purê de banana-da-terra com alho — com ' +
          'churrasco, carne de porco ou frutos do mar por cima; pernil assado devagar; e o ' +
          'pargo inteiro frito, no estilo boricua.\n\n' +
          'Pratos da rede perto de US$ 20. Na sexta abre das 11h à meia-noite. Aceita reserva ' +
          'pelo Yelp ou pelo telefone +1 407-204-9685.\n\n' +
          'Fica na suíte 130 do Old Town, o mesmo complexo da Avis: daqui, a tarde segue a pé ' +
          'até a retirada do carro.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta sobre o valor sem imposto.',
        endereco: '5770 W Irlo Bronson Memorial Hwy, Suite 130', restauranteId: 'r-cilantrillo',
        localId: 'old-town', acesso: [], duracaoMin: 75, pesquisa: '2026-09-11' },

      { id: 'b-2011-1401', hora: '14:00', ancora: 'fixo', tipo: 'livre',
        titulo: 'Old Town de dia · Mine Blower opcional',
        descricao: 'Uma volta pela rua de tijolinho. A montanha-russa do Fun Spot, se a comida deixar',
        contexto:
          'Uma hora sem roteiro entre o almoço e o carro, no mesmo complexo. De dia dá para ver ' +
          'as lojas com calma; à noite a rua é do desfile.\n\n' +
          'MINE BLOWER, no Fun Spot, ao lado do Old Town: montanha-russa de madeira com ' +
          'inversão. A entrada no Fun Spot é grátis e cada brinquedo é pago à parte, de US$ 3 ' +
          'a 40. Logo depois de um mofongo, julguem vocês.',
        localId: 'old-town', acesso: [], duracaoMin: 60, pesquisa: '2026-09-11' },

      { id: 'b-2011-1530', hora: '15:00', ancora: 'fixo', tipo: 'tarefa',
        titulo: 'Retirar o carro — Avis do Old Town',
        descricao: 'Suíte 434, nos fundos do Old Town. Recusem o e-Toll Unlimited',
        contexto:
          'A TAREFA CRÍTICA DO DIA. Sem carro, o dia 21 em Winter Garden cai — o Farmers Market ' +
          'abre às 8h e não dá para ir de Uber a esse preço.\n\n' +
          'ONDE: dentro do Old Town, nos fundos, em frente à montanha-russa — a pé desde o ' +
          'almoço. Aberta das 7h às 19h, telefone +1 321-219-7041.\n\n' +
          'QUATRO DOCUMENTOS, todos em nome do condutor: carteira de motorista, PID ' +
          '(Permissão Internacional para Dirigir, já emitida), passaporte e cartão de CRÉDITO ' +
          'internacional. Débito costuma não ser aceito para a caução.\n\n' +
          'NO BALCÃO: recusem o e-Toll Unlimited e fotografem o carro por fora antes de sair.\n\n' +
          'A DEVOLUÇÃO é no dia 25, às 15h, nesta mesma filial e dentro do horário dela.',
        endereco: '5770 W Irlo Bronson Memorial Hwy, Suite 434', localId: 'old-town',
        acesso: [], critico: true, duracaoMin: 30, pesquisa: '2026-09-11' },

      { id: 'b-2011-1400', hora: '15:30', ancora: 'fixo', tipo: 'vazio',
        titulo: 'VAZIO PROPOSITAL',
        descricao: 'Descanso no hotel, já com o carro',
        contexto:
          'Não preencham. A partir de amanhã são cinco dias seguidos pesados: Winter Garden com ' +
          'hóquei à noite, SeaWorld, Islands of Adventure, Busch Gardens com 3h de carro e o ' +
          'último dia de compras, que termina tarde no Disney Springs.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 105 },

      { id: 'b-2011-1630', hora: '17:20', ancora: 'fixo', tipo: 'livre',
        titulo: 'Old Town Kissimmee',
        descricao: 'Entrada e estacionamento grátis. Muscle cars expostos desde as 15h',
        contexto:
          'Rua de tijolinho com lojas, bares e brinquedos, a três minutos do hotel. Toda sexta ' +
          'a Trophy Row vira exposição de muscle cars de 1964 em diante e hot rods, e às 20h30 ' +
          'eles desfilam pela rua principal.\n\n' +
          'O pôr do sol é por volta das 17h30: vocês chegam na luz baixa e veem as luzes ' +
          'acendendo.\n\n' +
          'DECORAÇÃO DE NATAL: o Old Town monta árvore e luzes a partir de meados de novembro. ' +
          'A data exata do acendimento não saiu.',
        endereco: '5770 W Irlo Bronson Memorial Hwy', localId: 'old-town',
        acesso: [], duracaoMin: 70, pesquisa: '2026-09-11' },

      { id: 'b-2011-1830', hora: '18:30', ancora: 'fixo', tipo: 'refeicao',
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

      { id: 'b-2011-2010', hora: '20:10', ancora: 'fixo', tipo: 'espera',
        titulo: 'Lugar na calçada',
        descricao: 'Vinte minutos antes do desfile',
        contexto:
          'A calçada da rua principal enche perto das 20h30. Escolham o ponto com calma ' +
          'enquanto ainda há espaço.',
        localId: 'old-town', acesso: [], duracaoMin: 20 },

      { id: 'b-2011-2030', hora: '20:30', ancora: 'fixo', tipo: 'show',
        titulo: 'Muscle Car Cruise',
        descricao: 'Desfile dos muscle cars pela rua principal. Grátis',
        contexto:
          'Toda sexta, os muscle cars expostos na Trophy Row desde a tarde desfilam pela rua ' +
          'principal do Old Town — carros de 1964 em diante e hot rods. É gratuito, é semanal e ' +
          'é a coisa mais americana da viagem.\n\n' +
          'No sábado existe o desfile dos clássicos anteriores a 1985, na mesma hora, mas amanhã ' +
          'é o hóquei.',
        localId: 'old-town', acesso: [], duracaoMin: 45, pesquisa: '2026-09-11' },

      { id: 'b-2011-2200', hora: '21:15', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar',
        descricao: 'Três minutos de carro. Amanhã a saída é 8h',
        contexto:
          'O dia 21 começa cedo: Farmers Market de Winter Garden às 8h e hóquei à noite. Durmam.',
        acesso: [], duracaoMin: 15 },
    ],
    naoPerca: [
      { nome: 'Muscle Car Cruise', quando: 'hoje', custo: 'grátis',
        motivo: 'Desfile semanal de muscle cars pela rua principal do Old Town, às 20h30.',
        pesquisa: '2026-09-11' },
      { nome: 'A decoração de Natal do Old Town', quando: 'hoje',
        condicao: 'montada a partir de meados de novembro', custo: 'grátis',
        motivo: 'Árvore e luzes na rua de tijolinho. A data do acendimento ainda não saiu.',
        pesquisa: '2026-09-11' },
      { nome: 'Mine Blower, no Fun Spot', quando: 'depois do almoço', custo: 'pago por brinquedo',
        motivo: 'Montanha-russa de madeira com inversão, ao lado do Old Town. A entrada no Fun ' +
                'Spot é grátis; cada brinquedo é pago à parte.',
        pesquisa: '2026-09-11' },
      { nome: 'Boggy Creek Airboat Adventures', quando: 'descartado', custo: 'US$ 108 a 122 no casal',
        motivo: 'DESCARTADO em 11/09. Passeio de aerobarco de uma hora, a 38 minutos do hotel. ' +
                'Não é objetivo da viagem, novembro é a pior época para ver bicho de manhã, e ' +
                'ele obrigaria a pegar o carro cedo, com uma diária a mais. A manhã livre rende ' +
                'mais.',
        pesquisa: '2026-09-11' },
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
          motivo: 'O Kia Center não aceita bolsa — só uma clutch de 11 × 16 cm. A volta de ' +
                  'Winter Garden passa pelo hotel à tarde: a mochila fica lá, junto com o carro.' },
        { texto: 'Ingresso do Solar Bears nos dois celulares', critico: true,
          motivo: 'Jogo às 19h no Kia Center.' },
        { texto: 'Se o GPS escolher a SR-429, deixem', critico: false,
          motivo: 'É pedágio pela placa, porque o e-Toll foi recusado: poucos dólares mais a taxa ' +
                  'de US$ 6,95 do dia.' },
      ],
    },
    ficha: {
      multiPass: null, singlePass: null, expressPass: null,
      custoEstimadoCasal: { min: 0, max: 0, moeda: 'USD' },
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
          motivo: 'Estava no dia por causa do aerobarco. Sem carro de manhã, seriam 16 minutos ' +
                  'de Uber em cada sentido para ver um lago.' },
      ],
      idioma: null,
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
      'O KIA CENTER NÃO ACEITA BOLSA. Só uma clutch de 11 × 16 × 2,5 cm. A mochila de Winter ' +
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
        'A REGRA DA BOLSA É A MESMA DO DIA 18. Bolsa nenhuma passa; a exceção é uma clutch de ' +
        '11 × 16 × 2,5 cm. Hoje é mais fácil: não há compras, e a volta de Winter Garden passa ' +
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
          'Descanso até 16h40, Uber para o centro e jantar no Harp & Celt às 17h20.',
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
          'Não preencham. A noite termina às 22h15, e amanhã começam três dias de parque ' +
          'seguidos: SeaWorld, Islands of Adventure e Busch Gardens.\n\n' +
          'É também a hora de deixar a mochila de Winter Garden no quarto e montar a do ' +
          'SeaWorld. Para o jogo, vocês saem só com o bolso.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 165 },

      { id: 'b-2111-1730', hora: '16:40', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Uber para o centro de Orlando',
        descricao: '~35 min, US$ 32–45. Direto para o Harp & Celt',
        contexto:
          'O carro fica no hotel e a noite é de Uber, ida e volta.\n\n' +
          'ANTES DE SAIR: nada de bolsa. Celular, cartão e documento no bolso, ou numa clutch ' +
          'de 11 × 16 × 2,5 cm. Ingresso do jogo no celular dos dois.',
        endereco: '25 S Magnolia Ave', localId: 'kia-center', acesso: [], duracaoMin: 40 },

      { id: 'b-2111-1720', hora: '17:20', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Jantar — Harp & Celt',
        descricao: 'Pub irlandês com mesa e garçom, a 11 minutos a pé da arena. Reservem',
        contexto:
          'Pub e restaurante irlandês no centro: fish and chips, shepherd’s pie, cottage pie, ' +
          'Irish stew e sanduíches. Outro estilo do jantar do dia 18, que foi churrascaria.\n\n' +
          'RESERVA POR TELEFONE: ele não está no OpenTable. +1 407-481-2928. Está no ' +
          'checklist. Avisem na chegada que vocês têm jogo às 19h.\n\n' +
          'SEM MESA: o Underground Public House, gastropub britânico no 19 S Orange Ave, a um ' +
          'quarteirão, abre às 11h30 no sábado.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta sobre o valor sem imposto.',
        restauranteId: 'r-harp', endereco: '25 S Magnolia Ave', localId: 'kia-center',
        acesso: ['reserva'], duracaoMin: 70, pesquisa: '2026-09-11' },

      { id: 'b-2111-1830', hora: '18:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'A pé até o Kia Center',
        descricao: '840 m, 11 minutos. Portões abertos desde as 18h',
        contexto:
          'Do pub até a arena são 840 metros pelo centro. Os portões abrem uma hora antes do ' +
          'jogo, às 18h.\n\n' +
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
        titulo: 'Uber na esquina da Hughey com a Pine',
        descricao: 'Zona oficial de rideshare da arena. Hotel por volta das 22h15',
        contexto:
          'A zona de Uber e Lyft do Kia Center é a esquina da Hughey Ave com a Pine St, a uma ' +
          'caminhada curta da arena. Marquem o ponto ali antes de chamar.\n\n' +
          'A tarifa dinâmica logo depois do apito final pode triplicar. Se estiver alta, vale ' +
          'o plano C2.\n\n' +
          'AMANHÃ É SEAWORLD: alarme às 6h45, e a mochila já está pronta. Durmam assim que ' +
          'chegarem.',
        acesso: [], duracaoMin: 45 },
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
          motivo: 'Hoje vocês saem só com o bolso e voltam depois das 22h. Duas garrafas, ' +
                  'barrinhas, protetor solar, power bank, cabo e capa de chuva.' },
        { texto: 'Alarme para 6h45 nos dois celulares', critico: true,
          motivo: 'Saída 7h45 e portão às 8h15, 45 minutos antes da abertura. Depois de uma ' +
                  'noite que termina às 22h15, um alarme só falha.' },
        { texto: 'Conferir o horário de abertura do SeaWorld', critico: true,
          motivo: 'Amanhã assume abertura às 9h, pela previsão do Queue-Times. Se o oficial ' +
                  'sair diferente, a manhã inteira desloca.' },
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
      idioma: null,
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
      'Amanhã é o Islands, com saída às 7h45. Vocês chegam dos fogos por volta das 22h: a ' +
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
          'Kraken, Journey to Atlantis e Manta à tarde, depois os animais da Sea of Shallows.',
          'Orca Encounter às 17h30, jantar no Waterway Grill e o show no gelo.',
          'Sea of Trees, fogos às 21h e saída.',
        ] },
      { letra: 'B', titulo: 'O SEAQuest abriu',
        gatilho: 'O dark ride novo, ainda sem data anunciada, já está funcionando em 22/11.',
        passos: [
          'Ele vira a maior fila do parque. Pipeline no rope drop e o SEAQuest logo depois: ele ' +
          'fica atrás do Expedition Odyssey, na mesma direção.',
          'O Ice Breaker passa para depois do Expedition Odyssey.',
          'O atraso sai da tarde: os animais da Sea of Shallows caem primeiro.',
        ] },
      { letra: 'B2', titulo: 'O parque abre às 10h',
        gatilho: 'O horário oficial sai com abertura às 10h.',
        passos: [
          'Mudem a referência para 10h: a manhã inteira desloca uma hora.',
          'A tarde perde os animais da Sea of Shallows e a pausa. O app vai avisar o aperto.',
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
          'Amanhã a saída é 7h45: o que se ganha é uma hora de sono.',
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
        areaParque: 'Port of Entry', acesso: ['rope-drop', 'standby'], duracaoMin: 30,
        pesquisa: '2026-09-11' },

      { id: 'b-2211-0935', hora: '09:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Ice Breaker',
        descricao: 'Lançamentos para frente e para trás. Colada na Pipeline',
        contexto:
          'Montanha-russa de lançamento: acelera para frente, volta de ré e repete até vencer ' +
          'a rampa.\n\n' +
          'A fila média do dia é de 22 minutos, e à tarde fica em 30 a 45. De manhã, a cinco ' +
          'minutos da Pipeline, sai barata.\n\n' +
          'Nada solto: armário de US$ 2 na entrada da fila.',
        areaParque: 'Sea of Power', acesso: ['standby'], duracaoMin: 30, pesquisa: '2026-09-11' },

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
        areaParque: 'Sea of Power', acesso: ['standby'], duracaoMin: 45, pesquisa: '2026-09-11' },

      { id: 'b-2211-1105', hora: '11:05', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Mako',
        descricao: 'A mais alta e rápida de Orlando. Hipercoaster, feita para flutuar',
        contexto:
          'Hipercoaster: sem inversões, feita para dar airtime — a sensação de sair do banco ' +
          'nas descidas. 61 metros e 118 km/h.\n\n' +
          'Não precisa de manhã: a fila média do dia é de 13 minutos.\n\n' +
          'São onze minutos a pé do Expedition Odyssey, passando pelo estádio do Orca. Nada ' +
          'solto: armário de US$ 2 na entrada da fila.',
        areaParque: 'Sea of Mystery', acesso: ['standby'], duracaoMin: 30, pesquisa: '2026-09-11' },

      { id: 'b-2211-1140', hora: '11:40', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Shark Encounter',
        descricao: 'Túnel de acrílico dentro do tanque de tubarões',
        contexto:
          'Um túnel que passa por dentro do tanque, com os tubarões em volta. É a mesma vista ' +
          'do Sharks Underwater Grill, sem a conta.\n\n' +
          'É caminhar e parar onde quiserem.',
        areaParque: 'Sea of Mystery', acesso: [], duracaoMin: 20, pesquisa: '2026-09-11' },

      { id: 'b-2211-1205', hora: '12:05', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Penguin Trek',
        descricao: 'Montanha-russa de lançamento que termina no hábitat dos pinguins',
        contexto:
          'Montanha-russa de família em carrinhos de snowmobile, com lançamento, que termina ' +
          'dentro do hábitat gelado dos pinguins de verdade. A graça é a mistura de ' +
          'montanha-russa com aquário.\n\n' +
          'É a segunda maior fila do parque, 35 minutos de média. Levem algo de manga longa: o ' +
          'hábitat é mantido a poucos graus.',
        areaParque: 'Sea of Ice', acesso: ['standby'], duracaoMin: 45, pesquisa: '2026-09-11' },

      { id: 'b-2211-1255', hora: '12:55', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Voyager’s Smokehouse',
        descricao: 'Churrasco defumado. Plano de refeição',
        contexto:
          'Churrasco americano no Waterfront: brisket texano, costela St. Louis, frango ' +
          'defumado e sanduíches de peru e de porco desfiado.\n\n' +
          'PLANO DE REFEIÇÃO: um prato, um acompanhamento ou sobremesa e um refrigerante. A ' +
          'próxima refeição do plano só libera 90 minutos depois, a partir das 14h25.',
        restauranteId: 'r-voyagers', areaParque: 'Sea of Delight', acesso: [], duracaoMin: 50,
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
        areaParque: 'Sea of Legends', acesso: ['standby'], duracaoMin: 25, pesquisa: '2026-09-11' },

      { id: 'b-2211-1420', hora: '14:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Journey to Atlantis',
        descricao: 'Molha bastante. Na hora mais quente do dia, de propósito',
        contexto:
          'Barco que vira montanha-russa: uma queda grande molhada e um trecho seco no escuro.\n\n' +
          'MOLHA DE VERDADE. Está às 14h20 porque é a hora mais quente do dia, e sobra a tarde ' +
          'inteira para secar antes de escurecer. Capa de chuva, e o celular no Ziploc ou no ' +
          'armário de US$ 2.\n\n' +
          'Fila média de 21 minutos.',
        areaParque: 'Sea of Legends', acesso: ['standby'], molha: true, duracaoMin: 35,
        pesquisa: '2026-09-11' },

      { id: 'b-2211-1500', hora: '15:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Manta',
        descricao: 'Montanha-russa voadora: vocês vão de bruços, rasando a água',
        contexto:
          'A única montanha-russa voadora da Flórida: o banco gira e vocês ficam de barriga ' +
          'para baixo, braços soltos, passando rente à água. 43 metros, 90 km/h e quatro ' +
          'inversões.\n\n' +
          'Fila média de 19 minutos. Nada solto: armário de US$ 2 na entrada da fila.',
        areaParque: 'Sea of Shallows', acesso: ['standby'], duracaoMin: 30, pesquisa: '2026-09-11' },

      { id: 'b-2211-1535', hora: '15:35', ancora: 'referencia', tipo: 'livre',
        titulo: 'Tartarugas, golfinhos e arraias',
        descricao: 'Turtle Trek, golfinhos e o tanque de arraias. Sem fila',
        contexto:
          'A Sea of Shallows é a área dos animais de água rasa: o Turtle Trek, com o domo de ' +
          'filme e as tartarugas e peixes-boi resgatados, o tanque de arraias e os golfinhos.\n\n' +
          'DOLPHIN ADVENTURES: o show dos golfinhos é no Dolphin Stadium, aqui ao lado. Em 2025 ' +
          'era às 11h e às 15h; se no dia houver sessão perto das 15h30, é aqui que ela cabe.',
        areaParque: 'Sea of Shallows', acesso: [], duracaoMin: 40, pesquisa: '2026-09-11' },

      { id: 'b-2211-1620', hora: '16:20', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Pausa e lanche no Waterfront',
        descricao: 'Segunda refeição do plano. Sentem',
        contexto:
          'O lanche entra no plano de refeição: os 90 minutos desde o almoço já passaram. O ' +
          'Seafire Grill e o Lakeside Grill ficam por aqui.\n\n' +
          'É a última parada antes de uma noite longa, que só termina depois dos fogos das ' +
          '21h.\n\n' +
          'O SHOW DOS LEÕES-MARINHOS é no estádio ao lado. Em 2025 era às 14h e às 16h; se ' +
          'houver sessão nesta hora, cabe.',
        areaParque: 'Sea of Delight', acesso: [], duracaoMin: 35, pesquisa: '2026-09-11' },

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
        areaParque: 'Orca Encounter', acesso: [], confirmarHorario: true, critico: true,
        duracaoMin: 50, pesquisa: '2026-09-11' },

      { id: 'b-2211-1805', hora: '18:05', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Waterway Grill',
        descricao: 'Churrasco, frango com sofrito ou pernil. Plano de refeição',
        contexto:
          'A terceira refeição do plano: churrasco grelhado, frango com sofrito, porco assado ' +
          'devagar ou tiras de frango.\n\n' +
          'Fica a quatro minutos do estádio do Orca, e é onde o Papai Noel recebe visitas no ' +
          'Natal.',
        restauranteId: 'r-waterway', areaParque: 'Sea of Fun', acesso: [], duracaoMin: 55,
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
        areaParque: 'Sea of Power', acesso: [], confirmarHorario: true, duracaoMin: 40,
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
        areaParque: 'Sea of Delight', acesso: [], duracaoMin: 40, pesquisa: '2026-09-11' },

      { id: 'b-2211-2040', hora: '20:40', ancora: 'fixo', tipo: 'espera',
        titulo: 'Lugar para os fogos',
        descricao: 'Beira da lagoa, no Waterfront',
        contexto:
          'Os fogos são sobre a lagoa. Escolham o ponto na beira do Waterfront com calma, ' +
          'enquanto ainda há espaço.',
        areaParque: 'Sea of Delight', acesso: [], duracaoMin: 20 },

      { id: 'b-2211-2100', hora: '21:00', ancora: 'fixo', tipo: 'show',
        titulo: 'Holiday Reflections',
        descricao: 'Fogos de Natal no fechamento, sobre a lagoa',
        contexto:
          'O final da noite: fogos sobre a lagoa no fechamento do parque, em toda noite da ' +
          'Christmas Celebration.\n\n' +
          'HORA A CONFIRMAR: o bloco segue o fechamento previsto, às 21h.',
        areaParque: 'Sea of Delight', acesso: [], confirmarHorario: true, critico: true,
        duracaoMin: 15, pesquisa: '2026-09-11' },

      { id: 'b-2211-2115', hora: '21:15', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Saída',
        descricao: 'Carro no estacionamento. Hotel por volta das 22h',
        contexto:
          'O parque inteiro sai junto depois dos fogos, e a fila de carros do estacionamento ' +
          'entra na conta: por isso a volta tem 45 minutos para uma estrada de 20.\n\n' +
          'AMANHÃ É ISLANDS: saída às 7h45, alarme às 6h45.',
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
        motivo: 'DESCARTADO em 11/09. Mesa colada no tanque de tubarões, mas paga à parte — o ' +
                'filé custa uns US$ 49 — enquanto o plano de refeição já cobre o jantar. A mesma ' +
                'vista está no Shark Encounter.',
        pesquisa: '2026-09-11' },
    ],
    prepararAmanha: {
      paraODia: '2026-11-23',
      titulo: 'Islands of Adventure · saída 7h45',
      aviso: 'Vocês chegam do SeaWorld por volta das 22h, e amanhã é o dia com mais locker ' +
             'obrigatório da viagem. A mochila sai mínima.',
      itens: [
        { texto: 'Alarme para 6h45 nos dois celulares', critico: true,
          motivo: 'Saída 7h45 para o rope drop do Hagrid’s. Depois de uma noite que termina às ' +
                  '22h, um alarme só falha.' },
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
      custoEstimadoCasal: { min: 37, max: 49, moeda: 'USD' },
      extras: [
        { nome: 'Estacionamento geral',
          custo: { min: 37, max: 37, moeda: 'USD' },
          texto: 'US$ 37 por carro. Pagar antes pelo site agiliza a entrada.' },
        { nome: 'Armários das montanhas-russas',
          custo: { min: 0, max: 12, moeda: 'USD' },
          texto: 'US$ 2 por uso, na entrada da Pipeline, Ice Breaker, Mako, Kraken, Manta e ' +
                 'Journey to Atlantis. Um armário serve para os dois.' },
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
      idioma: null,
      fechado: [],
    },
  },

  /* ===== 23/11 · SEGUNDA · ISLANDS OF ADVENTURE ========================= */
  {
    id: 'd-2026-11-23',
    data: '2026-11-23',
    diaSemana: 'segunda',
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
      'VelociCoaster por single rider. À noite, Hogwarts Express, o castelo iluminado e o ' +
      'jantar no Mythos, no último Natal dele.',
    avisos: [
      'O HAGRID’S NÃO ACEITA EXPRESS DESDE 1º DE JULHO DE 2026, e a janela barata dele é a ' +
      'abertura. Portão às 8h35 e direto para Hogsmeade, sem parar em nada.',
      'Hoje é o dia com mais locker obrigatório da viagem, e Hulk e VelociCoaster têm ' +
      'detector de metal. Levem o mínimo.',
    ],
    notas: [
      { tipo: 'atencao', texto:
        'O HORÁRIO DE 23/11 AINDA NÃO SAIU. A referência está em 9h, que é a abertura padrão ' +
        'do Islands; o fechamento na semana de Thanksgiving tende a ficar entre 20h e 21h. A ' +
        'projeção no castelo e o Mythos estão fixos de propósito. Se o parque fechar às 20h, ' +
        'vale o plano B2.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'POR QUE O HAGRID’S VEM PRIMEIRO, mesmo sem a entrada antecipada de hotel: nos dados ' +
        'de março e abril de 2026, a fila média na abertura foi de 30 a 65 minutos. Às 10h já ' +
        'passava de 65, ao meio-dia chegava a 120, às 13h a 154, e não voltou para baixo de ' +
        '100 nem na última hora.\n\n' +
        'A VELOCICOASTER NÃO TEM HORA BOA: de 67 a 102 minutos das 9h às 22h. Por isso ela ' +
        'sai da manhã e vai para a tarde, por single rider.',
        pesquisa: '2026-09-11' },

      { tipo: 'info', texto:
        'O QUE MUDOU NO PARQUE EM 2026:\n\n' +
        'O Jurassic Park River Adventure passou dez meses em reforma e reabre em 19 ou 20/11. ' +
        'Se atrasar, vale o plano B.\n\n' +
        'A Lost Continent está sendo demolida em fases. O prédio do Poseidon’s Fury já foi ao ' +
        'chão, e o Mythos continua aberto até 2027.\n\n' +
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
          'Portão às 8h35, Hagrid’s na abertura e Forbidden Journey logo depois.',
          'Almoço no Confisco Grille às 11h40, na entrada do parque.',
          'Marvel, Kong, Jurassic Park River Adventure e VelociCoaster por single rider.',
          'Hogwarts Express ida e volta, projeção no castelo e jantar no Mythos às 19h10.',
        ] },
      { letra: 'B', titulo: 'O Jurassic Park River Adventure não reabriu',
        gatilho: 'A reforma atrasou e ele continua fechado em 23/11.',
        passos: [
          'Os 40 minutos dele viram folga: a VelociCoaster pode ir às 15h35.',
          'Nada mais muda. A capa de chuva fica na mochila.',
        ] },
      { letra: 'B2', titulo: 'O parque fecha às 20h',
        gatilho: 'O horário oficial sai com fechamento às 20h.',
        passos: [
          'Mudem a reserva do Mythos para 18h35, logo depois do Hogwarts Express.',
          'A projeção no castelo fica para depois do jantar: ela repete a cada 20 minutos até ' +
          'o parque fechar.',
        ] },
      { letra: 'C', titulo: 'Cansaço ou atraso',
        gatilho: 'O Hagrid’s demorou mais que o previsto ou o corpo pediu pausa.',
        passos: [
          'Doctor Doom e Kong caem primeiro.',
          'O Hogwarts Express e o Mythos ficam: são a noite do dia.',
        ] },
    ],
    blocos: [
      { id: 'b-2311-0745', hora: '07:45', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Sair do hotel de carro',
        descricao: '33 min de estrada e uns 20 a pé. Estacionamento US$ 32 pago antes',
        contexto:
          'O estacionamento da Universal fica longe da catraca: do carro até o CityWalk, e do ' +
          'CityWalk até o portão do Islands, são uns 20 minutos a pé. Pago antes pelo site ' +
          'custa US$ 32; na hora, US$ 35.',
        localId: 'islands-of-adventure', acesso: [], duracaoMin: 50, pesquisa: '2026-09-11' },

      { id: 'b-2311-0835', hora: '08:35', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão',
        descricao: 'Pela esquerda, sentido Hogsmeade. Sem parar em nada',
        contexto:
          'Passando a catraca, sigam pela esquerda: Seuss Landing, Lost Continent e Hogsmeade, ' +
          'uns 12 minutos a pé. Pela direita, pela Marvel, é mais longe.\n\n' +
          'Quem está hospedado na Universal entra uma hora antes, e o Hagrid’s costuma estar ' +
          'nessa lista. Mesmo assim, a abertura é a hora mais barata dele para vocês.',
        localId: 'islands-of-adventure', acesso: [], duracaoMin: 25, pesquisa: '2026-09-11' },

      { id: 'b-2311-0900', hora: '09:00', ancora: 'referencia', tipo: 'atracao',
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
        duracaoMin: 90, pesquisa: '2026-09-11' },

      { id: 'b-2311-1030', hora: '10:30', ancora: 'referencia', tipo: 'atracao',
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
        duracaoMin: 55, pesquisa: '2026-09-11' },

      { id: 'b-2311-1140', hora: '11:40', ancora: 'referencia', tipo: 'refeicao',
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

      { id: 'b-2311-1245', hora: '12:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'The Incredible Hulk Coaster',
        descricao: 'Lançamento de 0 a 64 km/h em 2 segundos, sete inversões',
        contexto:
          'Lançamento dentro de um túnel, sete inversões e muito barulho. Clássica de 1999, ' +
          'reconstruída em 2016.\n\n' +
          'DETECTOR DE METAL: nada nos bolsos, nem celular. Fila média de 32 minutos.',
        areaParque: 'Marvel Super Hero Island', acesso: ['standby'],
        acessoAlt: 'single-rider', locker: 'detector', duracaoMin: 45, pesquisa: '2026-09-11' },

      { id: 'b-2311-1335', hora: '13:35', ancora: 'referencia', tipo: 'atracao',
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
        duracaoMin: 35, pesquisa: '2026-09-11' },

      { id: 'b-2311-1415', hora: '14:15', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Doctor Doom’s Fearfall',
        descricao: 'Torre que atira para cima. Rápido',
        contexto:
          'Torre que atira vocês para cima em vez de soltar de cima. Dura menos de um minuto, ' +
          'e a sensação de estômago é forte.\n\n' +
          'Fila média de 15 minutos. Se o dia atrasou, é o primeiro bloco a cair.',
        areaParque: 'Marvel Super Hero Island', acesso: ['standby'],
        acessoAlt: 'single-rider', duracaoMin: 20, pesquisa: '2026-09-11' },

      { id: 'b-2311-1445', hora: '14:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Skull Island: Reign of Kong',
        descricao: 'Caminhão expedicionário, telas 3D e o Kong animatrônico',
        contexto:
          'Caminhão expedicionário com telas 3D e um animatrônico enorme do Kong no fim. Tem ' +
          'atores na fila. Escuro e barulhento, mas sem emoção física forte.\n\n' +
          'Fila média de 35 minutos.',
        areaParque: 'Skull Island', acesso: ['standby'],
        acessoAlt: 'single-rider', duracaoMin: 45, pesquisa: '2026-09-11' },

      { id: 'b-2311-1535', hora: '15:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Jurassic Park River Adventure',
        descricao: 'Molha. Reaberto depois de dez meses de reforma',
        contexto:
          'Passeio de barco que vira ataque de dinossauros e termina numa queda de 26 metros ' +
          'no escuro. Molha de verdade, principalmente nas primeiras fileiras.\n\n' +
          'REFORMA: ficou fechado de janeiro a 19 ou 20/11 de 2026, com dinossauros e cenário ' +
          'sendo refeitos. Se ainda estiver fechado, vale o plano B.\n\n' +
          'Está às 15h35 porque é a hora mais quente. Capa de chuva e o celular no Ziploc. Fila ' +
          'média de 22 minutos.',
        areaParque: 'Jurassic Park', acesso: ['standby'],
        acessoAlt: 'single-rider', molha: true, duracaoMin: 40, pesquisa: '2026-09-11' },

      { id: 'b-2311-1620', hora: '16:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Jurassic World VelociCoaster',
        descricao: 'A mais intensa do parque. Por single rider',
        contexto:
          'Dois lançamentos, 47 metros de altura, 110 km/h, quatro inversões e um trecho ' +
          'rasante sobre a água. É consenso como uma das melhores montanhas-russas do mundo.\n\n' +
          'POR QUE À TARDE E POR SINGLE RIDER: das 9h às 22h ela fica entre 67 e 102 minutos — ' +
          'não tem hora boa. Nesta hora a fila normal passa de 80; pela regra de ouro, acima de ' +
          '45 é single rider, e vocês andam em carrinhos separados.\n\n' +
          'DETECTOR DE METAL: absolutamente nada nos bolsos.',
        areaParque: 'Jurassic Park', acesso: ['standby'],
        acessoAlt: 'single-rider', locker: 'detector', duracaoMin: 55, pesquisa: '2026-09-11' },

      { id: 'b-2311-1720', hora: '17:20', ancora: 'referencia', tipo: 'atracao',
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
        areaParque: 'Hogsmeade', acesso: ['standby'], duracaoMin: 70, pesquisa: '2026-09-11' },

      { id: 'b-2311-1835', hora: '18:35', ancora: 'fixo', tipo: 'show',
        titulo: 'Hogsmeade à noite · projeção no castelo',
        descricao: 'The Magic of Christmas at Hogwarts Castle. Repete a cada 20 min',
        contexto:
          'Projeções e efeitos no castelo de Hogwarts com cenas de Natal dos filmes, depois ' +
          'que escurece. Repete a cada vinte minutos até o parque fechar — não precisa pegar ' +
          'na hora exata.\n\n' +
          'É a Hogsmeade decorada à noite, a parte do Natal que o dia 14 deixou para hoje — ' +
          'numa segunda-feira, não num sábado.',
        areaParque: 'Hogsmeade', acesso: [], duracaoMin: 30, pesquisa: '2026-09-11' },

      { id: 'b-2311-1910', hora: '19:10', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Mythos',
        descricao: 'O melhor restaurante de parque temático, no último Natal dele',
        contexto:
          'Mesa com garçom dentro de uma caverna cenográfica, com vista para a lagoa. Ganhou ' +
          'dez vezes o prêmio de melhor restaurante de parque temático do Theme Park Insider. ' +
          'Pratos de US$ 26 a 42.\n\n' +
          'É O ÚLTIMO NATAL DELE: a Lost Continent está sendo demolida em fases, e o Mythos ' +
          'fecha em 2027.\n\n' +
          'RESERVA: está no checklist, pelo app da Universal ou pelo telefone de reservas nos ' +
          'Contatos. É mesa com garçom: 18 a 20% de gorjeta sobre o valor sem imposto.',
        restauranteId: 'r-mythos', areaParque: 'Lost Continent', acesso: ['reserva'],
        duracaoMin: 75, pesquisa: '2026-09-11' },

      { id: 'b-2311-2030', hora: '20:30', ancora: 'fixo', tipo: 'deslocamento',
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
      { nome: 'Hogwarts Express nos dois sentidos', quando: 'hoje',
        custo: 'incluso, precisa park-to-park',
        motivo: 'A ida e a volta têm filmes diferentes.',
        pesquisa: '2026-09-11' },
      { nome: 'Mythos', quando: 'hoje', custo: 'US$ 26 a 42 o prato',
        motivo: 'Dez vezes eleito o melhor restaurante de parque temático, e fecha em 2027.',
        pesquisa: '2026-09-11' },
    ],
    prepararAmanha: {
      paraODia: '2026-11-24',
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
      ],
    },
    ficha: {
      multiPass: null, singlePass: null,
      expressPass: {
        usar: false,
        motivo:
          'O Hagrid’s saiu do Express em 1º de julho de 2026, e a fila que mais pesa no dia é ' +
          'justamente a dele. Nas outras, o single rider resolve sem pagar nada.',
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
      ],
      idioma: null,
      fechado: [],
    },
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
    fechado: true,
    revisadoEm: '2026-09-11',
    referencia: { rotulo: 'Abertura do parque', padrao: '10:00', confirmado: false },
    resumo:
      'Só de carro, 1h25 de cada lado. Cinco montanhas-russas e a torre de queda até o meio ' +
      'da tarde, o trem pela planície dos animais e o Natal à noite, com mais duas voltas no ' +
      'escuro antes da estrada. O dia mais pesado fisicamente da viagem.',
    avisos: [
      'OBJETO SOLTO É PROIBIDO EM NOVE ATRAÇÕES, entre elas todas as montanhas-russas do dia. ' +
      'O armário avulso custa US$ 4 pelas primeiras duas horas. Levem o mínimo: o resto fica ' +
      'no carro.',
      'Vocês chegam ao hotel por volta das 22h15, e amanhã o carro volta à Avis às 15h.',
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
        'AS FILAS DO BUSCH SÃO CURTAS. A média de 2026 vai de 33 minutos no Cheetah Hunt a 10 ' +
        'na SheiKra — por isso não há Quick Queue. A previsão de lotação para 24/11 é de 66%, ' +
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
        gatilho: 'O parque abre às 10h, fecha depois das 20h30 e 24/11 tem Christmas Town.',
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
      { id: 'b-2411-0700', hora: '07:00', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Café da manhã do hotel',
        descricao: 'Rápido: a estrada é às 7h30',
        contexto:
          'O café do hotel abre às 7h, segundo os sites de reserva, e dá tempo de comer antes ' +
          'de uma estrada de 1h25. Se ainda estiver fechado, as barrinhas da lista do Walmart ' +
          'seguram até o parque.',
        localId: 'hotel-travelodge', acesso: [], duracaoMin: 25 },

      { id: 'b-2411-0730', hora: '07:30', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Estrada para Tampa',
        descricao: '1h25, 109 km pela I-4. Estacionamento US$ 32 + imposto',
        contexto:
          'São 109 km até o Busch Gardens, 1h25 sem trânsito. O bloco tem 1h45 porque inclui ' +
          'estacionar e chegar ao portão.\n\n' +
          'O ESTACIONAMENTO fica do outro lado da McKinley Drive, a uns 800 metros do portão: ' +
          '10 a 15 minutos a pé, pelo túnel. O bondinho grátis pode não rodar em dia de semana. ' +
          'Custa US$ 32 mais imposto.',
        localId: 'busch-gardens', acesso: [], duracaoMin: 105, pesquisa: '2026-09-11' },

      { id: 'b-2411-0915', hora: '09:15', ancora: 'referencia', tipo: 'deslocamento',
        titulo: 'Portão',
        descricao: '45 min antes. A Iron Gwazi fica logo depois da entrada',
        contexto:
          'A entrada é pelo Morocco, e a Iron Gwazi fica a poucos passos. Detector de metal na ' +
          'entrada.\n\n' +
          'MOCHILA MÍNIMA: objeto solto é proibido nas montanhas-russas, e cada armário avulso ' +
          'custa US$ 4 pelas primeiras duas horas.',
        localId: 'busch-gardens', acesso: [], duracaoMin: 45, pesquisa: '2026-09-11' },

      { id: 'b-2411-1000', hora: '10:00', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Iron Gwazi',
        descricao: 'Rope drop. Híbrida de 63 m, queda de 91°, 122 km/h',
        contexto:
          'Montanha-russa híbrida — estrutura de madeira com trilho de aço — com 63 metros, ' +
          'queda de 91°, mais que vertical, 122 km/h e duas inversões. É a híbrida mais alta da ' +
          'América do Norte.\n\n' +
          'POR QUE PRIMEIRO: fica na entrada e é a que mais disputa o rope drop. A fila média de ' +
          '2026 é de 23 minutos, com pico de 46.\n\n' +
          'Nada solto: armário obrigatório.',
        areaParque: 'Morocco', acesso: ['rope-drop', 'standby'], duracaoMin: 40,
        pesquisa: '2026-09-11' },

      { id: 'b-2411-1045', hora: '10:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Cheetah Hunt',
        descricao: 'Três lançamentos e 1,3 km de percurso. A maior fila média do parque',
        contexto:
          'Três lançamentos seguidos, até 97 km/h, num percurso de 1,3 km com uma inversão.\n\n' +
          'É a maior fila média do Busch em 2026: 33 minutos, com pico de 56. Por isso vem logo ' +
          'depois da Iron Gwazi, a dois minutos a pé.\n\n' +
          'Nada solto: armário obrigatório.',
        areaParque: 'Edge of Africa', acesso: ['standby'], duracaoMin: 45, pesquisa: '2026-09-11' },

      { id: 'b-2411-1135', hora: '11:35', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Montu',
        descricao: 'Invertida, pés soltos, sete inversões. Clássica de 1996',
        contexto:
          'Montanha-russa invertida: vocês vão pendurados, com os pés soltos. 46 metros, 97 km/h ' +
          'e sete inversões em uns três minutos. Quando abriu, em 1996, era a invertida mais alta ' +
          'e rápida do mundo.\n\n' +
          'Fila média de 12 minutos. Nada solto: armário obrigatório.',
        areaParque: 'Egypt', acesso: ['standby'], duracaoMin: 30, pesquisa: '2026-09-11' },

      { id: 'b-2411-1220', hora: '12:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Falcon’s Fury',
        descricao: 'Torre de 102 m. No topo, o assento inclina e vocês caem olhando o chão',
        contexto:
          'Torre de queda de 102 metros. No topo, os assentos inclinam 90° para a frente e vocês ' +
          'caem de cara para o chão — cerca de cinco segundos de queda livre, a 97 km/h.\n\n' +
          'São onze minutos a pé do Montu, passando pela Nairobi. Fila média de 7 minutos. Nada ' +
          'solto: armário obrigatório.',
        areaParque: 'Pantopia', acesso: ['standby'], duracaoMin: 20, pesquisa: '2026-09-11' },

      { id: 'b-2411-1245', hora: '12:45', ancora: 'referencia', tipo: 'atracao',
        titulo: 'SheiKra',
        descricao: 'Para quatro segundos na beirada e cai a 90°',
        contexto:
          'Dive coaster: o trem para na beirada, pendurado a 61 metros, por uns quatro segundos, ' +
          'e cai na vertical. Depois vêm um loop, uma segunda queda a 90° para dentro de um túnel ' +
          'e uma passagem rente à água que levanta um paredão de spray.\n\n' +
          'Fila média de 10 minutos. Nada solto: armário obrigatório.',
        areaParque: 'Stanleyville', acesso: ['standby'], duracaoMin: 30, pesquisa: '2026-09-11' },

      { id: 'b-2411-1320', hora: '13:20', ancora: 'referencia', tipo: 'refeicao',
        titulo: 'Almoço — Zambia Smokehouse',
        descricao: 'Churrasco, ao lado do SheiKra. Plano de refeição',
        contexto:
          'Churrasco com a grelha à vista: costela, brisket e frango defumado. Fica em ' +
          'Stanleyville, ao lado do SheiKra.\n\n' +
          'PLANO DE REFEIÇÃO: um prato, um acompanhamento ou sobremesa e um refrigerante. A ' +
          'próxima refeição do plano só libera 90 minutos depois.',
        restauranteId: 'r-zambia', areaParque: 'Stanleyville', acesso: [], duracaoMin: 55,
        pesquisa: '2026-09-11' },

      { id: 'b-2411-1420', hora: '14:20', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Tigris',
        descricao: 'Três lançamentos, para frente e para trás, até 100 km/h',
        contexto:
          'Montanha-russa de lançamento que vai e volta: três lançamentos, 46 metros e 100 km/h, ' +
          'com um giro de cabeça para baixo. Curta e intensa.\n\n' +
          'Fila média de 18 minutos. Nada solto: armário obrigatório.',
        areaParque: 'Stanleyville', acesso: ['standby'], duracaoMin: 30, pesquisa: '2026-09-11' },

      { id: 'b-2411-1455', hora: '14:55', ancora: 'referencia', tipo: 'atracao',
        titulo: 'Serengeti Express',
        descricao: 'O trem dá a volta de 3,5 km pela planície dos animais',
        contexto:
          'Trem que dá a volta pelo parque e atravessa a planície do Serengeti, com girafas, ' +
          'zebras, antílopes e avestruzes soltos. Estações em Stanleyville, Congo e Nairobi.\n\n' +
          'É a parte dos animais do dia, sentados — e a pausa das pernas antes da noite. A ' +
          'duração da volta não é publicada: o bloco assume uns 40 minutos com a espera.',
        areaParque: 'Stanleyville', acesso: ['standby'], duracaoMin: 40, pesquisa: '2026-09-11' },

      { id: 'b-2411-1540', hora: '15:40', ancora: 'referencia', tipo: 'pausa',
        titulo: 'Pausa e lanche',
        descricao: 'Segunda refeição do plano, em Stanleyville',
        contexto:
          'Os 90 minutos do almoço já passaram: o lanche entra no plano. O SheiKra Eats e o ' +
          'Zambia ficam aqui.\n\n' +
          'É a última parada antes da noite, que termina com a estrada de volta.',
        areaParque: 'Stanleyville', acesso: [], duracaoMin: 25, pesquisa: '2026-09-11' },

      { id: 'b-2411-1620', hora: '16:20', ancora: 'fixo', tipo: 'show',
        titulo: 'Christmas on Ice',
        descricao: 'Show de patinação de 30 min no Moroccan Palace. Cheguem cedo',
        contexto:
          'Patinação no gelo com músicas de Natal, no teatro do Morocco, perto da entrada. ' +
          'Cerca de 30 minutos.\n\n' +
          'HORÁRIO A CONFIRMAR: em 2025 havia várias sessões por dia, a primeira por volta das ' +
          '14h. O teatro enche, e a recomendação é chegar bem antes — o bloco reserva 45 minutos ' +
          'por isso.\n\n' +
          'De Stanleyville até aqui são 14 minutos a pé, passando pela Sesame Street e pela Bird ' +
          'Gardens.',
        areaParque: 'Morocco', acesso: [], confirmarHorario: true, duracaoMin: 45,
        pesquisa: '2026-09-11' },

      { id: 'b-2411-1720', hora: '17:20', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Dragon Fire Grill & Pub',
        descricao: 'Mesa com garçom, e dentro do plano de refeição',
        contexto:
          'Restaurante com mesa e bar, com comida de pub e cardápio variado. É o único com mesa ' +
          'entre os do plano de refeição — a terceira refeição do dia.\n\n' +
          'Fica em Pantopia, a nove minutos do Moroccan Palace e ao lado da planície do ' +
          'Serengeti, onde são as luzes depois.\n\n' +
          'É mesa com garçom: 18 a 20% de gorjeta sobre o valor sem imposto.',
        restauranteId: 'r-dragonfire', areaParque: 'Pantopia', acesso: [], duracaoMin: 60,
        pesquisa: '2026-09-11' },

      { id: 'b-2411-1825', hora: '18:25', ancora: 'fixo', tipo: 'show',
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

      { id: 'b-2411-1910', hora: '19:10', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Cheetah Hunt à noite',
        descricao: 'A segunda volta, no escuro',
        contexto:
          'A mesma montanha-russa da manhã, agora no escuro — é a volta noturna mais elogiada do ' +
          'parque. Fica perto da saída.\n\n' +
          'Nada solto: armário obrigatório.',
        areaParque: 'Edge of Africa', acesso: ['standby'], duracaoMin: 40, pesquisa: '2026-09-11' },

      { id: 'b-2411-1955', hora: '19:55', ancora: 'fixo', tipo: 'atracao',
        titulo: 'Iron Gwazi à noite',
        descricao: 'Opcional. Ao lado da saída',
        contexto:
          'A última volta do dia, a dois minutos do Cheetah Hunt e colada na saída. Se o parque ' +
          'fechar às 20h, ela sai — é o plano B2.',
        areaParque: 'Morocco', acesso: ['standby'], opcional: true, duracaoMin: 30,
        pesquisa: '2026-09-11' },

      { id: 'b-2411-2030', hora: '20:30', ancora: 'fixo', tipo: 'deslocamento',
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
      paraODia: '2026-11-25',
      titulo: 'Compras, devolução do carro e Disney Springs',
      aviso: 'O último dia inteiro. O único horário que não pode falhar é a devolução do carro, ' +
             'às 15h, na mesma Avis do Old Town.',
      itens: [
        { texto: 'Tanque cheio antes das 15h', critico: true,
          motivo: 'O carro volta à Avis com o tanque cheio. A tolerância na devolução é de 29 ' +
                  'minutos; passou disso, a Avis cobra fração de diária.' },
        { texto: 'Malas amanhã às 14h, antes da devolução', critico: false,
          motivo: 'O que não couber ainda dá para resolver enquanto o carro está com vocês.' },
      ],
    },
    ficha: {
      multiPass: null, singlePass: null, expressPass: null,
      custoEstimadoCasal: { min: 32, max: 59, moeda: 'USD' },
      extras: [
        { nome: 'Estacionamento geral',
          custo: { min: 32, max: 35, moeda: 'USD' },
          texto: 'US$ 32 mais imposto, do outro lado da rua do parque.' },
        { nome: 'Armários das montanhas-russas',
          custo: { min: 0, max: 24, moeda: 'USD' },
          texto: 'US$ 4 pelas primeiras duas horas, em cada atração que proíbe objeto solto. Sem ' +
                 'bolsa, custa zero: o que não couber no bolso fica no carro.' },
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
      idioma: null,
      fechado: [
        'Kumba — fechou em 02/08/2026. O Kumba’s Revenge, que vai no lugar, ainda não tem data.',
        'Stanley Falls — fechou em 07/09/2025 e foi demolida.',
        'Scorpion — fechou em 08/09/2024.',
        'Sand Serpent — fechou em 2023 e deu lugar à Phoenix Rising.',
      ],
    },
  },

  /* ===== 25/11 · QUARTA · COMPRAS E DISNEY SPRINGS NO NATAL ============= */
  {
    id: 'd-2026-11-25',
    data: '2026-11-25',
    diaSemana: 'quarta',
    emoji: '🛒',
    titulo: 'Compras e Disney Springs no Natal',
    subtitulo: 'A última noite, e a decoração que não existia no dia 10',
    tipo: 'livre',
    operadora: null,
    parqueId: null,
    custoZero: false,
    referencia: null,
    resumo:
      'De manhã, compras de Black Friday. À noite, a volta ao Disney Springs que estava ' +
      'prometida desde o dia 10 — quando vocês estiveram lá antes de 13/11 e a decoração de ' +
      'Natal ainda não existia. É de graça e é literalmente outro lugar.',
    avisos: [
      'O segundo turno no Epic Universe saiu daqui para abrir esta noite. O ingresso ' +
      'continua cobrindo dois dias — o que não acontece é a viagem ter um segundo dia lá.',
    ],
    alternativa: {
      titulo: 'Se quiserem jantar sentados de verdade',
      texto:
        'O jantar da despedida pode sair do Disney Springs: Christner’s Prime Steak, ' +
        'Capital Grille (Millenia) ou Bull & Bear (Waldorf Astoria). Mas aí é Uber a mais, ' +
        'e as árvores de Natal ficam para trás.',
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
          'Façam isso hoje, não amanhã de manhã. Excesso de bagagem no balcão custa caro, e ' +
          'amanhã cedo vocês não vão querer descobrir isso.\n\n' +
          'E façam AGORA, antes de devolver o carro: o que não couber ainda dá para levar ' +
          'de carro a uma loja da 192 e trocar.',
        acesso: [], critico: true },

      { id: 'b-2511-1500', hora: '15:00', ancora: 'fixo', tipo: 'tarefa',
        titulo: 'Devolver o carro com o tanque cheio',
        descricao: 'Mesma filial da 192 onde vocês pegaram. A locadora cobra caro por litro',
        contexto:
          'DEVOLUÇÃO HOJE, NÃO AMANHÃ — decisão tomada para o dia da volta ser só café da ' +
          'manhã e aeroporto. Filial de bairro fecha cedo, então não dá para deixar para ' +
          'depois do parque.\n\n' +
          'Abasteçam num posto da 192 antes de chegar, e guardem o comprovante.\n\n' +
          'A PARTIR DAQUI A NOITE É DE UBER. O trecho até o Epic e a volta saem do bolso ' +
          'que o estacionamento gratuito vinha cobrindo — contem com isso.',
        acesso: [], critico: true },

      { id: 'b-2511-1800', hora: '18:00', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Disney Springs',
        descricao: 'De Uber, ~20 min, US$ 15–25. O carro já foi devolvido às 15h',
        contexto:
          'O estacionamento do Disney Springs é gratuito e vocês não vão usá-lo: o carro voltou para a locadora hoje à tarde, para o dia da volta ser só café e aeroporto. São duas corridas de Uber que essa decisão custa.',
        localId: 'disney-springs', acesso: [] },

      { id: 'b-2511-1830', hora: '18:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'Christmas Tree Stroll',
        descricao:
          'Gratuito. Árvores gigantes temáticas — Mansão Mal-Assombrada, Piratas, ' +
          'A Princesa e o Sapo, O Estranho Mundo de Jack. Peguem o mapa do circuito',
        contexto:
          'Circuito de árvores de Natal gigantes espalhadas por Disney Springs, cada uma ' +
          'decorada com o tema de um filme ou atração. O mapa é distribuído nos quiosques e ' +
          'transforma o passeio numa caça ao tesouro.',
        localId: 'disney-springs', acesso: [] },

      { id: 'b-2511-1930', hora: '19:30', ancora: 'fixo', tipo: 'livre',
        titulo: 'Decoração de Natal, música ao vivo, encontro com o Papai Noel',
        descricao: '', localId: 'disney-springs', acesso: [] },

      { id: 'b-2511-2000', hora: '20:00', ancora: 'fixo', tipo: 'refeicao',
        titulo: 'Jantar — Homecomin’ ou Polite Pig',
        descricao: 'O jantar de despedida. É o que vocês não comeram no dia 10',
        contexto:
          'Homecomin’ é comida caseira da Flórida, famoso pelo frango frito — é o mais ' +
          'concorrido de Disney Springs e costuma ter 1h de espera sem reserva. Polite Pig é ' +
          'barbecue de balcão, sem espera.',
        restauranteId: 'r-homecomin', localId: 'disney-springs', acesso: [] },

      { id: 'b-2511-2130', hora: '21:30', ancora: 'fixo', tipo: 'compras',
        titulo: 'World of Disney, com calma',
        descricao: 'A última compra da viagem. Fecha às 23h',
        contexto:
          'No dia 10 vocês tiveram 1h30 no Disney Springs inteiro. É a maior loja Disney do mundo e os fundos dela têm o que quase nenhum turista acha.\n\n' +
          'AS MALAS JÁ FORAM PESADAS ÀS 14H. O que entrar aqui entra por cima — comprem sabendo disso, ou deixem espaço de manhã.',
        localId: 'disney-springs', acesso: [] },

      { id: 'b-2511-2230', hora: '22:30', ancora: 'fixo', tipo: 'deslocamento',
        titulo: 'Voltar', descricao: 'De Uber', acesso: [] },
    ],
    ficha: {
      multiPass: null, singlePass: null,
      expressPass: null,
      custoEstimadoCasal: { min: 60, max: 130, moeda: 'USD' },
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
      refeicao: 'jantar', local: 'Disney Springs · The Landing', alternativas: ['Black Angus ou Miller\u2019s Ale House, na 192, se o dia virar plano C'],
      precisaReserva: true, janelaAbre: '2026-09-11', janelaHora: '06:00 ET',
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
      nota: 'DECIDIDO em 08/09: parque corrido, almoço de balcão sem reserva. Peixe e ' +
            'sanduíches. Subam para o segundo andar — quase ninguém acha, e é o lugar ' +
            'mais silencioso do Magic Kingdom. Liberty Tree Tavern e Skipper Canteen ' +
            'ficaram de fora.' },

    { id: 'r-caseys', nome: 'Casey’s Corner', data: '2026-11-11', hora: '17:55',
      refeicao: 'jantar', local: 'Magic Kingdom · Main Street', alternativas: ['Pecos Bill, na Frontierland', 'Cosmic Ray\u2019s, na Tomorrowland'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo My Disney Experience', blocoId: 'b-1111-1745',
      nota: 'DECIDIDO em 08/09: escolhido pela experiência do pianista, que toca na porta ' +
            'ao ar livre. Usem mobile order e comam nas mesas de fora, de frente para o ' +
            'piano — comer dentro perde o motivo da escolha.' },

    { id: 'r-satuli', nome: 'Satu’li Canteen', data: '2026-11-13', hora: '12:30',
      refeicao: 'almoco', local: 'Animal Kingdom · Pandora', alternativas: ['Flame Tree Barbecue, na Discovery Island', 'Harambe Market, na \u00c1frica'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo My Disney Experience', blocoId: 'b-1311-1215',
      nota: 'Balcão. Eleito o melhor quick service do Walt Disney World.' },

    { id: 'r-nomad', nome: 'Nomad Lounge', data: '2026-11-13', hora: '14:25',
      refeicao: 'drink', local: 'Animal Kingdom · Discovery Island', alternativas: ['Tiffins, ao lado \u2014 mesma cozinha, mesa e reserva'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Lista de espera no local', blocoId: 'b-1311-1630',
      nota: 'Não aceita reserva. Coloquem o nome na lista e passeiem enquanto esperam.' },

    { id: 'r-sanaa', nome: 'Sanaa', data: '2026-11-13', hora: '19:45',
      refeicao: 'jantar', local: 'Animal Kingdom Lodge', alternativas: ['The Mara, balc\u00e3o no mesmo hotel', 'Boma, bufe no mesmo hotel'],
      precisaReserva: true, janelaAbre: '2026-09-14', janelaHora: '06:00 ET',
      canal: 'My Disney Experience', blocoId: 'b-1311-1945',
      nota: 'Vão pela comida, não pela janela: às 19h45 de novembro está escuro há mais ' +
            'de duas horas e não se vê a savana. Peçam o Bread Service, cinco pães com ' +
            'nove acompanhamentos (~US$ 23), que é o motivo real de vir aqui. Fica no ' +
            'Animal Kingdom Lodge, não dentro do parque.' },

    { id: 'r-columbia', nome: 'Columbia Restaurant', data: '2026-11-14', hora: '12:30',
      refeicao: 'almoco', local: 'Celebration · Market Street', alternativas: ['Qualquer coisa da Market Street, a p\u00e9', 'Ou voltar ao hotel e almo\u00e7ar na 192'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'Site do restaurante / OpenTable', blocoId: 'b-1411-1230',
      nota: 'Peçam o 1905 Salad, preparado na mesa, e o sanduíche cubano.' },

    { id: 'r-broomsticks-14', nome: 'Three Broomsticks', data: '2026-11-14', hora: '20:00',
      refeicao: 'jantar', local: 'Islands of Adventure · Hogsmeade',
      alternativas: ['O Three Broomsticks fecha com o parque. Se pegarem fechado, o ' +
                     'CityWalk fica no caminho da saída — mas a espera lá em sábado ' +
                     'passa de uma hora'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Balcão, sem reserva', blocoId: 'b-1411-2100',
      nota: 'Balcão dentro da Hogsmeade decorada — não leva gorjeta. Vocês voltam a comer ' +
            'aqui no almoço do dia 23; se quiserem variar, é o dia 23 que muda.' },

    { id: 'r-docking-bay', nome: 'Docking Bay 7', data: '2026-11-15', hora: '12:20',
      refeicao: 'almoco', local: 'Hollywood Studios · Galaxy’s Edge',
      alternativas: ['Ronto Roasters, na mesma land, sem mesa', 'Woody’s Lunch Box, no Toy Story Land'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo My Disney Experience', blocoId: 'b-1511-1215',
      nota: 'Balcão temático de Batuu.' },

    { id: 'r-ogas', nome: 'Oga’s Cantina', data: '2026-11-15', hora: '17:00',
      refeicao: 'drink', local: 'Hollywood Studios · Galaxy’s Edge',
      alternativas: ['Sem reserva não entra. Se não conseguirem, a Milk Stand da mesma ' +
                     'land serve o leite azul e o verde sem fila de reserva'],
      precisaReserva: true, janelaAbre: '2026-09-16', janelaHora: '06:00 ET',
      canal: 'My Disney Experience', blocoId: 'b-1511-1715',
      nota: 'Limite de 45 min por grupo. Quase impossível entrar sem reserva.' },

    { id: 'r-scifi', nome: 'Sci-Fi Dine-In Theater', data: '2026-11-15', hora: '18:00',
      refeicao: 'jantar', local: 'Hollywood Studios · Commissary Lane',
      alternativas: ['ABC Commissary, ao lado, balcão e sem reserva', 'Mama Melrose, na Grand Avenue'],
      precisaReserva: true, janelaAbre: '2026-09-16', janelaHora: '06:00 ET',
      canal: 'My Disney Experience', blocoId: 'b-1511-1815',
      nota: 'Mesas em formato de carro num drive-in cenográfico.' },

    { id: 'r-epcot-mesa', nome: 'Epcot — mesa (opcional)', data: '2026-11-16', hora: null,
      refeicao: 'jantar', local: 'Epcot · World Showcase', alternativas: [],
      precisaReserva: true, janelaAbre: '2026-09-17', janelaHora: '06:00 ET',
      canal: 'My Disney Experience', blocoId: null,
      nota: 'Só se quiserem mesa em vez das barracas do Food & Wine. O plano do dia é barraca.' },

    { id: 'r-leaky', nome: 'Leaky Cauldron', data: '2026-11-17', hora: '13:15',
      refeicao: 'almoco', local: 'Universal Studios · Diagon Alley', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Mobile order pelo app da Universal', blocoId: 'b-1711-1315',
      nota: 'Bangers and mash, fish and chips. O melhor quick service da Universal.' },

    { id: 'r-finnegans', nome: 'Finnegan’s Bar & Grill', data: '2026-11-17', hora: '18:45',
      refeicao: 'jantar', local: 'Universal Studios · New York',
      alternativas: ['CityWalk'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: null, blocoId: 'b-1711-1845', nota: null },

    { id: 'r-confisco', nome: 'Confisco Grille', data: '2026-11-23', hora: '11:40',
      refeicao: 'almoco', local: 'Islands of Adventure · Port of Entry', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Chegar direto', blocoId: 'b-2311-1140',
      nota: 'Mesa com garçom na entrada do parque, cozinha internacional. Pratos de US$ 21 a 35.' },

    { id: 'r-kres', nome: 'Kres Chophouse', data: '2026-11-18', hora: '17:45',
      refeicao: 'jantar', local: 'Centro de Orlando · 17 W Church St',
      alternativas: ['The Boheme (Grand Bohemian)'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'OpenTable / site do restaurante', blocoId: 'b-1811-1745',
      nota: 'Churrascaria no mesmo quarteirão do Kia Center — do prato à catraca são cinco ' +
            'minutos a pé. Noite de jogo da NBA enche o centro: reservem. Avisem na chegada ' +
            'que vocês têm hora.' },

    { id: 'r-mythos', nome: 'Mythos', data: '2026-11-23', hora: '19:10',
      refeicao: 'jantar', local: 'Islands of Adventure · Lost Continent',
      alternativas: [],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'App / site da Universal Orlando, ou +1 407-224-3663', blocoId: 'b-2311-1910',
      nota: 'Dez vezes eleito o melhor restaurante de parque temático. Pratos de US$ 26 a 42. ' +
            'Fecha em 2027, com a demolição da Lost Continent.' },

    { id: 'r-homecomin', nome: 'Homecomin’', data: '2026-11-25', hora: '20:00',
      refeicao: 'jantar', local: 'Disney Springs · Town Center',
      alternativas: ['Polite Pig'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'Site do restaurante / OpenTable', blocoId: 'b-2511-2000',
      nota: 'Frango frito. O mais concorrido de Disney Springs — 1h de espera sem reserva. ' +
            'Polite Pig é a alternativa de balcão, sem espera. É o jantar de despedida.' },

    { id: 'r-voyagers', nome: 'Voyager’s Smokehouse', data: '2026-11-22', hora: '12:55',
      refeicao: 'almoco', local: 'SeaWorld · Waterfront', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Plano de refeição (All-Day Dining Deal)', blocoId: 'b-2211-1255',
      nota: 'Churrasco defumado: brisket texano, costela e frango. Coberto pelo plano de ' +
            'refeição do ingresso.' },

    { id: 'r-waterway', nome: 'Waterway Grill', data: '2026-11-22', hora: '18:05',
      refeicao: 'jantar', local: 'SeaWorld · Sea of Fun', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Plano de refeição (All-Day Dining Deal)', blocoId: 'b-2211-1805',
      nota: 'Churrasco grelhado, frango com sofrito e pernil. Coberto pelo plano de refeição. ' +
            'É onde o Papai Noel recebe visitas no Natal.' },

    { id: 'r-toadstool', nome: 'Toadstool Cafe', data: '2026-11-19', hora: '13:00',
      refeicao: 'almoco', local: 'Epic Universe · Super Nintendo World', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Sem reserva — conferir lista de espera no app da Universal', blocoId: 'b-1911-1300',
      nota: 'Não aceita reserva. As fontes divergem entre lista de espera pelo app e ordem de ' +
            'chegada: confiram no app ao entrar na Super Nintendo World, às 11h. Pico do ' +
            'almoço das 11h30 às 13h30.' },

    { id: 'r-atlantic', nome: 'Atlantic', data: '2026-11-19', hora: '17:00',
      refeicao: 'jantar', local: 'Epic Universe · Celestial Park',
      alternativas: ['Mead Hall (Isle of Berk, sem reserva)'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'App / site da Universal Orlando', blocoId: 'b-1911-1700',
      statusPadrao: 'confirmado', confirmacaoPadrao: '639247233607631616',
      nota: 'RESERVADO em 11/09 — confirmação 639247233607631616, duas pessoas, 17h. Cheguem ' +
            '5 minutos antes: a mesa é segurada só por 15 minutos. Às 17h de propósito — o ' +
            'jantar cedo libera as três últimas horas para o Ministry e o Mine-Cart. Pratos de ' +
            'US$ 35 a 48.' },

    { id: 'r-cilantrillo', nome: 'El Cilantrillo', data: '2026-11-20', hora: '12:45',
      refeicao: 'almoco', local: 'Old Town Kissimmee',
      alternativas: ['World Food Trucks, trocando com o jantar se houver chuva prevista à noite'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Chegar direto — aceita reserva pelo Yelp ou +1 407-204-9685', blocoId: 'b-2011-1230',
      nota: 'Porto-riquenho de mesa, dentro do Old Town: mofongo, pernil, pargo frito. Pratos ' +
            'da rede perto de US$ 20. Na sexta, das 11h à meia-noite.' },

    { id: 'r-world-food-trucks', nome: 'World Food Trucks', data: '2026-11-20', hora: '18:30',
      refeicao: 'jantar', local: 'W Irlo Bronson, a 300 m do Old Town',
      alternativas: ['El Cilantrillo, trocando com o almoço se houver chuva prevista à noite'],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Chegar direto', blocoId: 'b-2011-1830',
      nota: 'Mais de 100 food trucks, das 11h às 2h todos os dias. Estacionamento grátis. ' +
            'Balcão: não leva gorjeta.' },

    { id: 'r-plant-street-market', nome: 'Plant Street Market', data: '2026-11-21', hora: '11:45',
      refeicao: 'almoco', local: 'Winter Garden · 426 W Plant St',
      alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Balcão, sem reserva', blocoId: 'b-2111-1230',
      nota: 'Mercado gastronômico com 17 balcões — churrasco, ostras, empanadas, pizza a ' +
            'carvão, ceviche — e a cervejaria Crooked Can. Balcão: não leva gorjeta.' },

    { id: 'r-harp', nome: 'Harp & Celt', data: '2026-11-21', hora: '17:20',
      refeicao: 'jantar', local: 'Centro de Orlando · 25 S Magnolia Ave',
      alternativas: ['Underground Public House, 19 S Orange Ave — gastropub britânico'],
      precisaReserva: true, janelaAbre: null, janelaHora: null,
      canal: 'Telefone +1 407-481-2928 (não está no OpenTable)', blocoId: 'b-2111-1720',
      nota: 'Pub irlandês com mesa e garçom, a 11 minutos a pé do Kia Center. Noite de jogo ' +
            'no centro num sábado: reservem, e avisem na chegada que vocês têm hora.' },

    { id: 'r-zambia', nome: 'Zambia Smokehouse', data: '2026-11-24', hora: '13:20',
      refeicao: 'almoco', local: 'Busch Gardens Tampa · Stanleyville', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Plano de refeição (All-Day Dining Deal)', blocoId: 'b-2411-1320',
      nota: 'Churrasco: costela, brisket e frango defumado. Coberto pelo plano de refeição.' },

    { id: 'r-dragonfire', nome: 'Dragon Fire Grill & Pub', data: '2026-11-24', hora: '17:20',
      refeicao: 'jantar', local: 'Busch Gardens Tampa · Pantopia', alternativas: [],
      precisaReserva: false, janelaAbre: null, janelaHora: null,
      canal: 'Plano de refeição (All-Day Dining Deal)', blocoId: 'b-2411-1720',
      nota: 'Mesa com garçom e bar, dentro do plano de refeição.' },
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
      texto: 'Hollywood Studios: Oga’s Cantina e Sci-Fi Dine-In — e ajustar os blocos',
      nota:
        'As 17h do Oga’s e as 18h do Sci-Fi que estão no dia 15 são PROPOSTA, não reserva: ' +
        'elas fazem a tarde caber e deixam doze minutos de caminhada entre os dois.\n\n' +
        'Se só conseguirem outros horários, a pendência não acaba na reserva — voltem no ' +
        'dia 15 e ajustem os dois blocos e o que vem depois deles, até o Fantasmic. Sem ' +
        'isso o app vai seguir mostrando 17h e 18h o resto da viagem.',
      restauranteIds: ['r-ogas', 'r-scifi'] },

    { id: 'ck-1709', dataAlvo: '2026-09-17', hora: '06:00', fuso: 'ET',
      janelaReserva: true, critico: false,
      texto: 'Epcot: abrir a janela de mesa só se mudarem de ideia sobre o Food & Wine',
      nota:
        'JÁ DECIDIDO: o jantar do dia 16 É o Food & Wine — três voltas de barracas ao ' +
        'longo da tarde, e a última às 20h antes de pegar lugar para o Luminous.\n\n' +
        'Esta janela fica registrada porque hoje é o único dia em que ela abre. Se em ' +
        'algum momento vocês decidirem que querem uma mesa de verdade no Epcot, é hoje ' +
        'ou nunca. Não decidindo nada, não façam nada — e risquem.',
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
      texto: 'Reservar o carro na Avis do Old Town: retirada 20/11 às 15h, devolução 25/11 às 15h',
      nota:
        'A Avis fica dentro do Old Town (5770 W Irlo Bronson, suíte 434), a três minutos do ' +
        'hotel, aberta das 7h às 19h todos os dias. Reservem das 15h às 15h: o aluguel é ' +
        'contado em períodos de 24 horas, e assim são cinco diárias certas.\n\n' +
        'Na reserva e no balcão, RECUSEM o e-Toll Unlimited: ele cobra de US$ 11 a 26 por dia ' +
        'de aluguel, com ou sem pedágio.',
      pesquisa: '2026-09-11',
      restauranteIds: [] },

    { id: 'ck-columbia', dataAlvo: '2026-10-15', dataEstimada: true, motivoData: '30 dias antes do almoço de 14/11', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar o Columbia Restaurant para o almoço de 14/11 (Celebration)',
      restauranteIds: ['r-columbia'] },

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

    { id: 'ck-mde-cartao', dataAlvo: '2026-10-01', dataEstimada: true,
      motivoData: 'Na mesma sessão em que vocês conferem os ingressos no My Disney Experience',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Cartão de crédito salvo no My Disney Experience, nos DOIS perfis',
      nota:
        'É o que destrava o mobile order, e o mobile order aparece quatro vezes nos dias ' +
        'fechados: Columbia Harbour House e Casey’s no dia 11, Satu’li Canteen no dia 13 e ' +
        'Docking Bay 7 no dia 15. Cada um desses pula de 20 a 30 minutos de fila de balcão ' +
        'que o roteiro já não conta.\n\n' +
        'Sem cartão salvo, não pula. E a alternativa era descobrir isso na noite de 10/11, ' +
        'depois de doze horas de viagem — que é exatamente quando ninguém faz.',
      restauranteIds: [] },

    { id: 'ck-horarios-epic', dataAlvo: '2026-11-01', dataEstimada: true,
      motivoData: 'Horários de show de Natal só saem perto da temporada, que começa em 14/11',
      hora: null, fuso: null, janelaReserva: false, critico: true,
      texto: 'Horário do Epic Universe em 19/11 — abertura, FECHAMENTO e shows de Natal',
      nota:
        'A ABERTURA move a manhã inteira: é a referência do dia. O roteiro assume 9h.\n\n' +
        'O FECHAMENTO é o que importa mais. O Battle at the Ministry e o Mine-Cart Madness ' +
        'estão colados nele, porque as duas maiores filas do parque só ficam razoáveis nas ' +
        'últimas horas. O roteiro assume 21h, o típico de quinta em meados de novembro. Se ' +
        'for outro, vale o plano B2 do dia 19.\n\n' +
        'OS SHOWS DE NATAL: fontes do Celestial Park e as celebrações de Berk e da Place ' +
        'Cachée. A Universal anuncia os horários perto do início da temporada.',
      restauranteIds: [] },

    { id: 'ck-epa-epic', dataAlvo: '2026-11-12', dataEstimada: true,
      motivoData: 'A lista muda por temporada: uma semana antes, e de novo na véspera',
      hora: null, fuso: null, janelaReserva: false, critico: true,
      texto: 'Conferir quais lands do Epic estão no Early Park Admission em 19/11',
      nota:
        'O MECANISMO JÁ ESTÁ RESOLVIDO: durante o Early Park Admission o Celestial Park fica ' +
        'aberto para todo mundo, e a checagem de hóspede de hotel é feita na porta de cada ' +
        'land. Vocês entram cedo, mas não passam dos portais que participam.\n\n' +
        'O QUE FALTA CONFERIR é quais lands participam em novembro. Desde fevereiro de 2026, ' +
        'conferido de novo em 16/06/2026, são Ministry of Magic, Super Nintendo World e Isle ' +
        'of Berk — e o dia 19 começa na Dark Universe justamente por ela estar fora.\n\n' +
        'A LISTA MUDOU PELO MENOS TRÊS VEZES EM DEZOITO MESES. Se a Dark Universe voltar e o ' +
        'Ministry sair, vale o plano B do dia 19: os dois blocos trocam de lugar.',
      pesquisa: '2026-09-10',
      restauranteIds: [] },

    { id: 'ck-ing-universal', dataAlvo: '2026-10-25', dataEstimada: true,
      motivoData: 'Duas semanas antes da viagem, com folga para acionar a agência',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Ingressos Universal aparecendo no app — nos DOIS perfis',
      nota:
        'Cobre os dias 14, 17, 19 e 23 — o dia 25 saiu quando o segundo turno no Epic virou ' +
        'a despedida no Disney Springs. Confiram especificamente que é PARK-TO-PARK e que o ' +
        'Epic Universe está incluído: o Hogwarts Express do dia 23 só funciona com ' +
        'park-to-park, e o Epic é ingresso à parte em muitas combinações.\n\n' +
        'E confiram se a troca de datas do Epic (era 23/11, virou 19/11) precisa de algum ' +
        'ajuste: alguns ingressos da Universal são date-based.\n\n' +
        'Riscar só quando aparecer no app da Bianca também.',
      restauranteIds: [] },

    { id: 'ck-ing-united', dataAlvo: '2026-10-25', dataEstimada: true,
      motivoData: 'Junto com os da Universal, para resolver tudo numa conferência só',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Ingressos SeaWorld e Busch Gardens (Promo Park) — com o plano de refeição',
      nota:
        'Os dois parques são da mesma empresa e vieram na mesma compra. Confiram que o ' +
        'PLANO DE REFEIÇÃO — o All-Day Dining Deal, uma refeição a cada 90 minutos — está ' +
        'incluído nos dois: o dia 22 usa três refeições dele, e o dia 24 conta com ele para o ' +
        'almoço. Sem plano, o custo desses dias muda.\n\n' +
        'Riscar só quando aparecer no app da Bianca também.',
      restauranteIds: [] },


    { id: 'ck-kres', dataAlvo: '2026-10-19', dataEstimada: true,
      motivoData: '30 dias antes do jantar de 18/11',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Reservar o Kres Chophouse para o jantar de 18/11 (centro de Orlando)',
      nota:
        'É noite de jogo da NBA no centro e o restaurante fica a cinco minutos da arena — ' +
        'ele enche por causa disso. E o jantar de vocês tem só 65 minutos: chegar sem ' +
        'reserva e pegar espera acaba com o bloco.\n\n' +
        'Alternativa no mesmo bairro: The Boheme, no Grand Bohemian. O Ace Cafe, que estava ' +
        'no roteiro antigo, fechou em 2023.',
      restauranteIds: ['r-kres'] },

    { id: 'ck-harp', dataAlvo: '2026-10-22', dataEstimada: true,
      motivoData: '30 dias antes do jantar de 21/11',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Reservar o Harp & Celt para as 17h20 de 21/11 (centro de Orlando), por telefone',
      nota:
        'Noite de jogo do Solar Bears no centro, num sábado. O jantar tem 70 minutos antes da ' +
        'caminhada até a arena: chegar sem reserva e pegar espera acaba com ele.\n\n' +
        'Não está no OpenTable. É pelo telefone +1 407-481-2928, ou pelo e-mail do site, ' +
        'harpandcelt1@gmail.com.\n\n' +
        'Alternativa sem reserva: o Underground Public House, a um quarteirão.',
      restauranteIds: ['r-harp'] },

    { id: 'ck-mythos', dataAlvo: '2026-10-24', dataEstimada: true, motivoData: '30 dias antes do jantar de 23/11', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reservar o Mythos para as 19h10 de 23/11 (Islands of Adventure)',
      restauranteIds: ['r-mythos'] },

    { id: 'ck-homecomin', dataAlvo: '2026-10-26', dataEstimada: true,
      motivoData: '30 dias antes do jantar de 25/11',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Reservar o Homecomin\u2019 para o jantar de 25/11 (Disney Springs)',
      nota:
        'É o restaurante mais concorrido de Disney Springs e passa de uma hora de ' +
        'espera sem reserva. É o jantar de despedida da viagem, na última noite — não ' +
        'é o dia de arriscar uma hora em pé.\n\n' +
        'Se não conseguirem, o Polite Pig é a alternativa de balcão, sem espera, no ' +
        'mesmo lugar.',
      restauranteIds: ['r-homecomin'] },

    { id: 'ck-atlantic', dataAlvo: '2026-09-11', dataEstimada: false,
      hora: null, fuso: null, janelaReserva: false, critico: true, feitoPadrao: true,
      texto: 'Atlantic (19/11, 17h) — RESERVADO, confirmação 639247233607631616',
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
        'O plano dela também inclui o uso internacional, com os EUA cobertos. A conferir é ' +
        'só a ativação: alguns planos pedem que o serviço seja ligado no app da operadora ' +
        'antes da viagem, e ninguém quer descobrir isso no desembarque.\n\n' +
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
      nota:
        'O calendário do Queue-Times já marca 22/11 com a Christmas Celebration e horário ' +
        'das 9h às 21h. É previsão de terceiro: a confirmação é o calendário oficial do ' +
        'SeaWorld, e com ela a referência do dia 22.',
      restauranteIds: [] },

    { id: 'ck-roda-icon', dataAlvo: '2026-10-15', dataEstimada: true,
      motivoData: 'O dia 12 manda conferir em outubro, e o plano B depende da resposta',
      hora: null, fuso: null, janelaReserva: false, critico: false,
      texto: 'Conferir se The Wheel do ICON Park voltou a operar (para 12/11)',
      nota:
        'Ela está fechada para manutenção anual desde o fim de junho, sem data de ' +
        'reabertura anunciada até 09/09. Se voltar, vira a atração das 18h do dia 12 e ' +
        'desloca o resto da noite — o plano B daquele dia tem essa conferência como ' +
        'gatilho declarado. Confiram o preço junto: não há valor confirmado.',
      restauranteIds: [] },

    /* --- já em Orlando --- */
    { id: 'ck-hotel', dataAlvo: '2026-11-05', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Reserva do Travelodge salva OFFLINE nos dois celulares',
      nota:
        'Mesma lógica da apólice: e-mail sem internet não abre, e vocês chegam de ' +
        'madrugada num país onde ninguém fala português. O endereço também vai escrito ' +
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
        'Detalhes na dica \u201cQuando dá errado\u201d, no Guia.',
      restauranteIds: [] },

    { id: 'ck-horarios-ak', dataAlvo: '2026-09-14', hora: null, fuso: null,
      janelaReserva: false, critico: true,
      texto: 'Conferir ABERTURA E FECHAMENTO do Animal Kingdom em 13/11',
      nota:
        'Os horários saem por volta de hoje, 60 dias antes. É a pendência que sustenta o ' +
        'dia 13 inteiro, e OS DOIS NÚMEROS IMPORTAM.\n\n' +
        'A ABERTURA: o dia assume 8h, que é o típico de novembro. Se for outra, mudem a ' +
        'referência na tela do dia 13 e a manhã inteira desloca junto, inclusive a saída ' +
        'das 6h30.\n\n' +
        'O FECHAMENTO: é ele que decide a reta final. Com 18h o plano está no limite. Com ' +
        '19h ou 20h o dia respira, MAS colide com a mesa do Sanaa às 19h45 — o plano B2 do ' +
        'dia 13 explica o que fazer em cada caso.\n\n' +
        'Confiram também o horário de fechamento do KILIMANJARO SAFARIS, que fecha 30 a 60 ' +
        'minutos antes do parque e sustenta o bloco das 16h30.',
      pesquisa: '2026-09-10',
      restauranteIds: [] },

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
      texto: 'Lightning Lane — Multi Pass do Magic Kingdom (11/11), e talvez dos 4 dias',
      nota:
        'Cinco minutos antes de o sistema soltar as seleções. Cheguem decididos:\n\n' +
        'MULTI PASS — lista alta: Peter Pan. Lista baixa: Mansão e Buzz.\n' +
        'SINGLE PASS — NENHUM. Não comprem nada aqui.\n\n' +
        'SE O INGRESSO FOR DATE-BASED, HOJE COBRE OS QUATRO DIAS. Nesse caso escolham ' +
        'agora também:\n' +
        '  · 15/11 Hollywood Studios — alta: Slinky Dog Dash. Baixa: Torre do Terror e ' +
        'Toy Story Mania.\n' +
        '  · 16/11 Epcot — alta: Frozen Ever After. Baixa: Remy e Test Track.\n' +
        '  · 13/11 Animal Kingdom — nenhuma. O dia não usa Multi Pass.\n\n' +
        'Se NÃO for date-based, o app só vai deixar escolher o dia 11 hoje — e aí os dias ' +
        '15 e 16 têm data própria, 12/11 e 13/11, já no checklist.\n\n' +
        'NÃO peçam o Big Thunder nem o Jungle Cruise: os dois são lista alta e vocês vão ' +
        'fazer os dois de graça, no standby, antes das 11h. O Space Mountain entra rolando ' +
        'dentro do parque, assim que vocês usarem a Mansão às 11h.',
      restauranteIds: [] },

    { id: 'ck-ll-1011', dataAlvo: '2026-11-10', hora: '07:00', fuso: 'ET',
      janelaReserva: false, critico: false,
      texto: 'NÃO é compra: o Single Pass do Flight of Passage se decide dentro do parque',
      nota:
        'ESTA PENDÊNCIA EXISTE PARA VOCÊS NÃO FAZEREM NADA HOJE. Ela está em 10/11 porque ' +
        'é a data em que a compra antecipada seria possível — às 7h ET, no meio da conexão ' +
        'em Bogotá, que é o pior momento da viagem para depender de internet.\n\n' +
        'E não precisa. O Single Pass do Flight of Passage se compra NA HORA, pelo app, de ' +
        'pé dentro do Animal Kingdom. A decisão é das 17h30 do dia 13, olhando a fila — ' +
        'não das 7h de hoje, olhando um portão de embarque.\n\n' +
        'O plano do dia 13 é fazer a atração no fim do dia, quando a fila cai para 40 a 55 ' +
        'minutos contra 90 a 120 o resto do tempo. Comprem só se o parque fechar cedo ' +
        'demais para esse plano caber, ou se 40 minutos de fila no fim de dez horas de ' +
        'parque for demais no dia.',
      restauranteIds: [] },

    { id: 'ck-ll-1211', dataAlvo: '2026-11-12', hora: '07:00', fuso: 'ET',
      janelaReserva: false, critico: true,
      texto: 'Lightning Lane para 15/11 — Multi Pass do dia e Single Pass do Rise',
      nota:
        'SÃO DUAS COISAS, e a segunda é a que some quando ninguém escreve.\n\n' +
        'MULTI PASS do dia 15 — lista alta: Slinky Dog Dash. Lista baixa: Torre do Terror ' +
        'e Toy Story Mania. Se o ingresso for date-based, isto já foi feito em 08/11 e ' +
        'hoje não tem nada a escolher.\n\n' +
        'SINGLE PASS do Rise of the Resistance — peçam janela entre 10h30 e 11h. Este é o ' +
        'único dos três dias de passe em que o Single se justifica: o Rise faz 100 min na ' +
        'abertura e 63 depois das 19h, e a noite de vocês já tem Oga\u2019s, Sci-Fi e ' +
        'Fantasmic.',
      restauranteIds: [] },

    { id: 'ck-ll-1311', dataAlvo: '2026-11-13', hora: '07:00', fuso: 'ET',
      janelaReserva: false, critico: true,
      texto: 'Lightning Lane para 16/11 — Multi Pass do dia e Single Pass do Cosmic Rewind',
      nota:
        'ATENÇÃO À HORA: às 7h de hoje vocês já saíram do hotel — a saída para o Animal ' +
        'Kingdom é 6h30. Isto se resolve no celular, dentro do Uber ou na fila da catraca. ' +
        'Cheguem decididos, porque não vai dar para pensar.\n\n' +
        'MULTI PASS do dia 16 — lista alta: Frozen Ever After. Lista baixa: Remy e Test ' +
        'Track. O Test Track está na baixa de propósito, como rede de segurança: se ele ' +
        'quebrar de manhã e voltar à tarde, vocês o pegam rolando. Se o ingresso for ' +
        'date-based, isto já foi feito em 08/11.\n\n' +
        'SINGLE PASS do Cosmic Rewind — peçam janela entre 9h30 e 10h. Ele faz 101 min de ' +
        'média e passa de uma hora mesmo às 8h: não existe janela barata em hora nenhuma ' +
        'do dia.',
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

    { id: 'ck-horarios-dhs-epcot', dataAlvo: '2026-09-17', hora: null, fuso: null,
      janelaReserva: false, critico: true,
      texto: 'Horários oficiais de 15/11 e 16/11 — e a hora do Fantasmic e do Luminous',
      nota:
        'Os dois shows SEGUEM O FECHAMENTO DO PARQUE, não a abertura, e cada um fecha o ' +
        'seu dia.\n\n' +
        'FANTASMIC (15/11): com fechamento às 21h ele costuma ser às 20h; com 22h, às ' +
        '21h. O roteiro assume 20h15.\n\n' +
        'LUMINOUS (16/11): roda junto do fechamento. O roteiro assume 21h.\n\n' +
        'Se algum mudar, ajustem o selo de horário no bloco do show — os blocos de ' +
        'posição andam junto. E confiram a abertura dos dois dias, que move a manhã.',
      restauranteIds: [] },

    { id: 'ck-horarios', dataAlvo: '2026-10-10', dataEstimada: true, motivoData: 'A Disney publica os horários ~60 dias antes', hora: null, fuso: null,
      janelaReserva: false, critico: true,
      texto: 'Conferir horários oficiais dos demais parques e ajustar a referência de cada dia',
      nota: 'É só editar o horário de abertura no dia — os blocos ancorados deslocam sozinhos.',
      restauranteIds: [] },

    { id: 'ck-shows', dataAlvo: '2026-11-01', dataEstimada: true, motivoData: 'Horários de show só saem perto da data', hora: null, fuso: null,
      janelaReserva: false, critico: false,
      texto: 'Confirmar horário do Grinchmas (14/11), do desfile da Macy’s (17/11) e do ' +
             'Fantasmic! (15/11) — e o fechamento do parque em 17/11',
      nota:
        'O Grinchmas é a referência do dia 14 — ajustando ele, a noite inteira desloca.\n\n' +
        'O DESFILE DA MACY’S É O MAIS INCERTO DOS TRÊS. O dia 17 assume 17h30, mas em anos ' +
        'anteriores ele rodou tanto às 17h30 quanto às 19h30 — duas horas de diferença. ' +
        'Três blocos andam com ele: o desfile, o jantar no Finnegan’s e o Beco Diagonal à ' +
        'noite.\n\n' +
        'CONFIRAM TAMBÉM O FECHAMENTO DE 17/11. O parque fecha entre 19h e 22h conforme a ' +
        'época, e a temporada de Natal estica. Se fechar às 19h, o Beco à noite não existe ' +
        'e o jantar vira CityWalk, que fica fora da catraca.',
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
      nota: 'Estacionamento gratuito. Na segunda ida vocês já estarão de carro.' },

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
      nota: 'Dia 19, de Uber: o ponto de embarque do Epic é próprio, na 1222 Epic Blvd, a ' +
            'cinco minutos a pé da entrada. Não é o estacionamento da Universal.' },

    { id: 'seaworld', nome: 'SeaWorld Orlando', tipo: 'parque',
      lat: 28.41083333, lng: -81.4625, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 20, tempoFonte: 'estimado',
                 uberUSD: { min: 22, max: 32 }, uberFonte: 'estimado' },
      nota: 'Estacionamento geral US$ 37. Detector de metal na entrada.' },

    { id: 'busch-gardens', nome: 'Busch Gardens Tampa Bay', tipo: 'parque',
      lat: 28.0375, lng: -82.4225, verificado: true, fonteCoord: 'wikipedia', endereco: null,
      doHotel: { tempoMin: 85, tempoFonte: 'estimado',
                 uberUSD: null, uberFonte: null },
      nota: 'Só de carro: 109 km, 1h25 sem trânsito. Estacionamento US$ 32 mais imposto.' },

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
      nota: 'NÃO ACEITA BOLSA. Só uma clutch de 4,5" × 6,5" × 1" (11 × 16 × 2,5 cm). ' +
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
      nota: 'Entrada e estacionamento gratuitos. A Avis do dia 20 fica aqui dentro, na suíte ' +
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

    { id: 'publix-vineland', nome: 'Publix — Sunrise City Plaza', tipo: 'compras',
      lat: 28.3462381, lng: -81.4832862, verificado: true, fonteCoord: 'osm',
      endereco: '3221 Vineland Rd, Kissimmee FL 34746',
      doHotel: { tempoMin: 5, tempoFonte: 'estimado',
                 uberUSD: { min: 7, max: 10 }, uberFonte: 'estimado' },
      nota: 'Supermercado a 600 m do Walmart do dia 10. Das 7h às 23h, com deli que faz ' +
            'sanduíche na hora.' },
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
             'saída: entra e sai pela mesma boca, na London. A Production Central e a ' +
             'Minion Land são as primeiras depois da catraca — e é por isso que elas ' +
             'entopem no rope drop.',
      margem: 'Somem 50% em dia cheio. Os números batem com os dois publicados: da catraca ' +
              'até o Beco Diagonal dá 10 minutos, e a volta completa do anel dá 23. O World ' +
              'Expo e a Springfield ficam levemente fora do caminho da lagoa — quem passa ' +
              'por lá tem de resolver os dois de uma vez ou volta atrás.',
      arestas: [
        ['Production Central', 'Hollywood', 3],
        ['Production Central', 'Minion Land', 2],
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
              'longa de todos os parques mapeados: treze minutos de ponta a ponta.',
      arestas: [
        ['Hollywood Blvd', 'Echo Lake', 3],
        ['Hollywood Blvd', 'Sunset Blvd', 4],
        ['Hollywood Blvd', 'Commissary Lane', 3],
        ['Hollywood Blvd', 'The Walt Disney Studios', 4],
        ['Echo Lake', 'Grand Avenue', 3],
        ['Grand Avenue', 'Galaxy’s Edge', 3],
        ['Commissary Lane', 'Toy Story Land', 5],
        ['The Walt Disney Studios', 'Toy Story Land', 4],
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
          'e ninguém atravessa essa linha até acabar. Se vocês estiverem do lado ' +
          'oeste (Frontierland, Liberty Square, Adventureland), fiquem lá: a próxima ' +
          'atração do roteiro é a Jungle Cruise, que é do mesmo lado, de propósito.',
        pesquisa: '2026-09-09',
      },
    },

    seaworld: {
      forma: 'Um anel em volta da lagoa, com a entrada no lado oeste e a Pipeline colada ' +
             'nela. Ao sul ficam a Sea of Power — Ice Breaker, Expedition Odyssey e o Bayside ' +
             'Stadium — e o estádio do Orca; do outro lado do anel, Mako, Penguin Trek, Kraken ' +
             'e Manta. O Waterfront é o centro, na margem da lagoa.',
      margem: 'Somem 50% em dia cheio. E ATENÇÃO: não há tempos publicados para conferir. ' +
              'Estes saem das coordenadas do OpenStreetMap, com 30% de desvio sobre a linha ' +
              'reta e passo de 75 metros por minuto. A volta inteira dá uns 32 minutos e da ' +
              'entrada ao Mako são 9 — o que bate com o "5 a 10 minutos entre atrações" dos ' +
              'guias.',
      arestas: [
        ['Port of Entry', 'Sea of Shallows', 5],
        ['Port of Entry', 'Sea of Delight', 5],
        ['Port of Entry', 'Sea of Power', 5],
        ['Sea of Shallows', 'Sea of Delight', 3],
        ['Sea of Shallows', 'Sea of Legends', 4],
        ['Sea of Legends', 'Sea of Ice', 2],
        ['Sea of Ice', 'Sea of Delight', 3],
        ['Sea of Ice', 'Sea of Mystery', 5],
        ['Sea of Delight', 'Sea of Mystery', 4],
        ['Sea of Mystery', 'Sea of Fun', 3],
        ['Sea of Fun', 'Orca Encounter', 4],
        ['Orca Encounter', 'Sea of Power', 4],
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
              'e o teleférico cortam caminho, mas não entram no grafo.',
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
        ['Stanleyville', 'Sesame Street', 5],
        ['Sesame Street', 'Bird Gardens', 3],
        ['Bird Gardens', 'Morocco', 6],
      ],
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

    { id: 'tel-universal-dining', nome: 'Universal — reservas de restaurante',
      numero: '+1 407-224-3663',
      quando:
        'Remarcar ou cancelar o Atlantic (19/11, 17h) — e o Mythos (23/11), quando for ' +
        'reservado. Dá para fazer pela conta da Universal no app também. No Atlantic, a mesa ' +
        'é segurada só por 15 minutos depois do horário.',
      verificado: '2026-09-11', fonte: 'confirmação da reserva do Atlantic' },

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
        'Bronson, a menos de 1 km do hotel. Seg a sex das 8h às 20h, sáb e dom das 8h às 17h. ' +
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

  dicas: [
    {
      id: 'dica-lockers',
      categoria: 'universal',
      momento: 'dia-especifico',
      dias: ['d-2026-11-17', 'd-2026-11-19', 'd-2026-11-23'],
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
      momento: 'dia-especifico',
      dias: ['d-2026-11-13', 'd-2026-11-19', 'd-2026-11-22', 'd-2026-11-23'],
      titulo: 'O que molha de verdade',
      corpo:
        'Novembro em Orlando é ameno, e roupa molhada às 17h fica desconfortável rápido quando ' +
        'escurece. As atrações marcadas com o selo "molha" neste app são:\n\n' +
        'Kali River Rapids (13/11) — não é respingo, é balde. E é às 9h15, com nove ' +
        'horas de parque pela frente\n' +
        'Jurassic Park River Adventure (23/11) — molha bastante, levem capa\n' +
        'Journey to Atlantis (22/11) — molha bastante\n' +
        'Fyre Drill (19/11) — o guia oficial diz "possivelmente encharca". Opcional, às 15h45\n' +
        '\n' +
        'Já foram cortadas do roteiro por molharem demais: Infinity Falls (SeaWorld), ' +
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
        'Onde NÃO se dá gorjeta: balcão de fast food e mobile order. Ou seja, Satu’li Canteen, ' +
        'Docking Bay 7, Three Broomsticks, Toadstool Cafe e os restaurantes do plano de ' +
        'refeição do SeaWorld e do Busch Gardens não levam gorjeta.\n\n' +
        'Onde se dá: The Boathouse, Columbia, Sanaa, Sci-Fi Dine-In, Oga’s, Kres, Atlantic, ' +
        'IHOP, El Cilantrillo, Harp & Celt, Mythos, Homecomin’ — e o Uber (opcional, mas ' +
        'comum).',
      pesquisa: '2026-09-10',
    },
    {
      id: 'dica-rope-drop',
      categoria: 'geral',
      momento: 'todo-dia',
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
      momento: 'antes-de-viajar',
      titulo: 'A decoração de Natal e por que a ordem dos dias importa',
      corpo:
        'A viagem atravessa a virada da temporada de Natal, e isso foi usado de propósito no ' +
        'roteiro.\n\n' +
        'DISNEY: decoração já montada quando vocês chegam. Mickey\u2019s Very Merry Christmas ' +
        'Party rola em noites selecionadas a partir de 08/11, e vocês decidiram não ir.\n\n' +
        'UNIVERSAL: a temporada começa exatamente em 14/11 — o dia em que vocês entram no ' +
        'Islands à noite. Vocês pegam a primeira noite da temporada.\n\n' +
        'DISNEY SPRINGS: no dia 10 ainda não tem decoração. Por isso existe uma segunda ida, ' +
        'para o Christmas Tree Stroll — de graça, e literalmente outro lugar. É a última ' +
        'noite da viagem, 25/11.\n\n' +
        'SEAWORLD e BUSCH: Christmas Celebration e Christmas Town rodam em datas selecionadas ' +
        'a partir de 06/11 e 13/11. Confirmem que 22/11 e 24/11 estão na lista.',
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
        'vinte mil pessoas não se acham.\n\n' +
        'Combinar antes vale mesmo com os dois celulares funcionando: duas pessoas ' +
        'procurando uma à outra num parque de vinte mil não se acham, e ligação dentro ' +
        'de parque cheio cai ou não se ouve.\n\n' +
        'SE ALGUÉM PASSAR MAL. Todo parque da Disney e da Universal tem posto de primeiros ' +
        'socorros, com enfermeiro, ar-condicionado e remédio básico de graça. Peçam ' +
        '\u201cFirst Aid\u201d a qualquer funcionário — eles levam vocês. Para emergência ' +
        'de verdade, 911 de qualquer celular, inclusive sem chip americano.\n\n' +
        'FORA DO PARQUE, PARA O QUE NÃO É EMERGÊNCIA — febre, torção, corte, dor de ouvido, ' +
        'virose — o caminho é Urgent Care, não pronto-socorro. A mais perto é a Centra Care ' +
        'de Celebration, a menos de 1 km do hotel, até as 20h (17h no fim de semana). Depois ' +
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
        'Existem quatro blocos assim no roteiro: 12/11 às 14h30, 14/11 às 9h, 20/11 às 15h30 e ' +
        '21/11 às 15h.\n\n' +
        'Eles estão ali porque a segunda metade da viagem é mais pesada que a primeira: ' +
        '19/11 Epic, 21/11 Winter Garden e hóquei, 22/11 SeaWorld, 23/11 Islands e 24/11 ' +
        'Busch Gardens com 3h de carro. Chegar destruído no dia 19 transforma o melhor ' +
        'parque de Orlando em arrastar-se — e ele virou dia único.\n\n' +
        'Resistam à tentação de encaixar coisa neles.',
    },
    {
      id: 'dica-bomba-zip',
      categoria: 'geral',
      momento: 'dia-especifico',
      dias: ['d-2026-11-20', 'd-2026-11-25'],
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
        'QUANDO: o carro é retirado em 20/11 e devolvido com o tanque cheio em 25/11, na ' +
        'filial da 192. Abasteçam num posto da 192 antes de chegar.',
      pesquisa: '2026-09-10',
    },
    {
      id: 'dica-comida-tarde',
      categoria: 'geral',
      momento: 'dia-especifico',
      dias: ['d-2026-11-11', 'd-2026-11-19', 'd-2026-11-24'],
      titulo: 'Onde comer quando a noite acaba tarde',
      corpo:
        'Três noites terminam com fome e quase tudo fechado: 11/11, com o Magic Kingdom até ' +
        'as 22h; 19/11, porque o jantar do Epic é às 17h; e 24/11, com a volta de Tampa.\n\n' +
        'A PRIMEIRA SAÍDA É O PRÓPRIO QUARTO. Ele tem micro-ondas, e a lista do Walmart do ' +
        'dia 10 traz o jantar para ele: arroz pronto com atum ou frango em sachê, ou sopa. ' +
        'Três minutos, sem sair do hotel.\n\n' +
        'SE FOR PARA SAIR, na própria 192, a poucos minutos do hotel:\n' +
        'World Food Trucks, 5811 W Irlo Bronson — mais de 100 food trucks, das 11h às 2h ' +
        'todos os dias\n' +
        'Perkins, 5170 W Irlo Bronson — restaurante de mesa, até a meia-noite\n' +
        'Denny’s, 5855 W Irlo Bronson — 24 horas\n' +
        'Waffle House, 5391 W Irlo Bronson — praticamente vizinho, 24 horas\n' +
        'Walgreens, 5935 W Irlo Bronson — farmácia 24 horas, para o básico\n\n' +
        'O World Food Trucks está nos Locais deste Guia, com a rota do hotel.',
      pesquisa: '2026-09-10',
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
