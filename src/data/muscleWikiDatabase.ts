export interface MuscleWikiExercise {
  id: string;
  name: string;
  nameEn: string;
  category: 'Peito' | 'Costas' | 'Ombros' | 'Braços' | 'Pernas' | 'Core' | 'Trapézio' | 'Antebraços';
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: 'Barra' | 'Halteres' | 'Peso Corporal' | 'Cabos' | 'Máquina' | 'Kettlebell';
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  instructions: string[];
  formTips: string[];
  commonMistakes: string[];
  muscleWikiUrl: string;
  targetFocus: string;
}

export const MUSCLEWIKI_CATEGORIES = [
  'Todos',
  'Peito',
  'Costas',
  'Ombros',
  'Braços',
  'Pernas',
  'Core',
  'Trapézio',
  'Antebraços',
] as const;

export const MUSCLEWIKI_EQUIPMENT = [
  'Todos',
  'Barra',
  'Halteres',
  'Peso Corporal',
  'Cabos',
  'Máquina',
  'Kettlebell',
] as const;

export const MUSCLEWIKI_DATABASE: MuscleWikiExercise[] = [
  // ==================== PEITO (CHEST) ====================
  {
    id: 'mw-barbell-bench-press',
    name: 'Supino Reto com Barra',
    nameEn: 'Barbell Bench Press',
    category: 'Peito',
    primaryMuscle: 'Peitoral Maior (Fibras Esternais e Claviculares)',
    secondaryMuscles: ['Tríceps Braquial', 'Deltoide Anterior', 'Serrátil Anterior'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    targetFocus: 'Força e hipertrofia geral do peitoral',
    muscleWikiUrl: 'https://musclewiki.com/barbell/chest/barbell-bench-press',
    instructions: [
      'Deite-se no banco plano com os olhos diretamente alinhados abaixo da barra.',
      'Plante os pés firmemente no chão, retraia e deprima as escápulas (aperte as costas no banco) e mantenha um arco natural na coluna lombar.',
      'Segure a barra com uma pegada ligeiramente mais larga que a largura dos ombros.',
      'Retire a barra do suporte e posicione-a sobre o centro do peito com os braços estendidos.',
      'Inspire e desça a barra de forma controlada até tocar a linha inferior do peitoral (próximo aos mamilos), mantendo os cotovelos em um ângulo de ~45° a 75° do tronco.',
      'Empurre a barra para cima expirando com força até a extensão dos cotovelos, sem desencaixar as escápulas.'
    ],
    formTips: [
      'Mantenha os pulsos retos alinhados com o antebraço, evitando que a barra tombe para trás.',
      'Aperte a barra com força para ativar a cadeia estabilizadora dos braços e ombros.',
      'Use o leg drive (empurrão dos pés no chão) para estabilidade do tronco.'
    ],
    commonMistakes: [
      'Deixar os cotovelos abertos em 90 graus (risco alto de impacto no manguito rotador).',
      'Bater a barra no peito usando efeito mola.',
      'Tirar o quadril ou os calcanhares do banco/chão.'
    ]
  },
  {
    id: 'mw-incline-dumbbell-bench-press',
    name: 'Supino Inclinado com Halteres',
    nameEn: 'Incline Dumbbell Bench Press',
    category: 'Peito',
    primaryMuscle: 'Peitoral Superior (Porção Clavicular)',
    secondaryMuscles: ['Deltoide Anterior', 'Tríceps Braquial'],
    equipment: 'Halteres',
    difficulty: 'Intermediário',
    targetFocus: 'Desenvolvimento do feixe clavicular superior e simetria muscular',
    muscleWikiUrl: 'https://musclewiki.com/dumbbells/chest/incline-dumbbell-bench-press',
    instructions: [
      'Ajuste o banco em uma inclinação de 30° a 45° (inclinações muito altas transferem o esforço para os ombros).',
      'Sente-se com um haltere em cada coxa e use o impulso dos joelhos para posicioná-los na altura dos ombros.',
      'Retraia as escápulas, apoie a cabeça e desça os halteres em um movimento fluido e amplo até sentir alongar o peitoral superior.',
      'Empurre os halteres para cima e ligeiramente para dentro em arco, sem bater os pesos no topo.',
      'Pause 1 segundo na contração máxima e desça em 2 a 3 segundos.'
    ],
    formTips: [
      'O ângulo dos cotovelos deve permanecer apontado levemente para frente (plano escapular).',
      'A amplitude com halteres permite maior alongamento que a barra; aproveite essa descida profunda controlada.'
    ],
    commonMistakes: [
      'Ajustar o banco acima de 45° virando quase um desenvolvimento de ombro.',
      'Bater os halteres violentamente no topo perdendo a tensão mecânica.'
    ]
  },
  {
    id: 'mw-cable-crossover',
    name: 'Crossover na Polia Média / Alta',
    nameEn: 'Cable Crossover',
    category: 'Peito',
    primaryMuscle: 'Peitoral Maior (Fibras Esternais e Adunção Horizontal)',
    secondaryMuscles: ['Deltoide Anterior', 'Bíceps (cabeça curta como estabilizador)'],
    equipment: 'Cabos',
    difficulty: 'Iniciante',
    targetFocus: 'Tensão contínua em toda a amplitude e pico de contração',
    muscleWikiUrl: 'https://musclewiki.com/cables/chest/cable-crossover',
    instructions: [
      'Posicione as roldanas da polia na altura do peito ou ligeiramente acima dos ombros.',
      'Dê um passo à frente com uma perna de base para equilíbrio, mantendo o tronco levemente inclinado.',
      'Com os cotovelos sutilmente flexionados e fixos, feche os braços à frente do peito como se estivesse abraçando um barril largo.',
      'Aperte fortemente o peitoral no ponto de encontro por 1 a 2 segundos.',
      'Retorne lentamente até sentir o alongamento peitoral na altura dos ombros sem mover a articulação do cotovelo.'
    ],
    formTips: [
      'Mantenha a flexão do cotovelo constante; o movimento é exclusivamente na articulação glenoumeral.',
      'Foque em aproximar os bíceps um do outro para atingir a contração máxima do miolo do peito.'
    ],
    commonMistakes: [
      'Transformar o crossover em um supino estendendo e dobrando os cotovelos.',
      'Projetar o tronco para frente e para trás para ganhar embalo.'
    ]
  },
  {
    id: 'mw-push-up',
    name: 'Flexão de Braço no Solo',
    nameEn: 'Push-up',
    category: 'Peito',
    primaryMuscle: 'Peitoral Maior',
    secondaryMuscles: ['Tríceps Braquial', 'Deltoide Anterior', 'Core / Reto Abdominal'],
    equipment: 'Peso Corporal',
    difficulty: 'Iniciante',
    targetFocus: 'Força funcional, estabilização de core e controle corporal',
    muscleWikiUrl: 'https://musclewiki.com/bodyweight/chest/push-up',
    instructions: [
      'Apoie as mãos no chão com afastamento ligeiramente superior à largura dos ombros.',
      'Estenda as pernas para trás com as pontas dos pés no solo, mantendo o corpo em uma linha reta da cabeça aos calcanhares.',
      'Ative o abdômen e contraia os glúteos para não permitir que o quadril caia.',
      'Desça o corpo dobrando os cotovelos para trás (ângulo de 45°) até que o peito fique a poucos centímetros do chão.',
      'Empurre o chão de volta à posição inicial travando o peitoral no topo.'
    ],
    formTips: [
      'Olhe para o chão cerca de 30 cm à frente das mãos para manter a cervical neutra.',
      'Empurre o chão ativamente no topo (pronação escapular leve) para ativar o serrátil anterior.'
    ],
    commonMistakes: [
      'Deixar o quadril ceder criando hiperlordose lombar.',
      'Abrir os cotovelos em formato de "T" (ângulo de 90° com os ombros).'
    ]
  },

  // ==================== COSTAS (BACK & LATS) ====================
  {
    id: 'mw-pull-up',
    name: 'Barra Fixa Pronada',
    nameEn: 'Pull-up',
    category: 'Costas',
    primaryMuscle: 'Grande Dorsal (Latissimus Dorsi)',
    secondaryMuscles: ['Redondo Maior', 'Bíceps Braquial', 'Braquiorradial', 'Romboides', 'Trapézio Inferior'],
    equipment: 'Peso Corporal',
    difficulty: 'Avançado',
    targetFocus: 'Largura de costas e força de puxada vertical',
    muscleWikiUrl: 'https://musclewiki.com/bodyweight/back/pull-ups',
    instructions: [
      'Segure a barra fixa com pegada pronada (palmas para frente), um pouco mais aberta que a largura dos ombros.',
      'Fique pendurado em extensão completa, iniciando o movimento pela depressão escapular (puxando os ombros para baixo).',
      'Puxe o peito em direção à barra imaginando levar os cotovelos para os bolsos de trás da bermuda.',
      'Suba até que o queixo ultrapasse a linha da barra.',
      'Desça de forma controlada até o retorno completo da extensão dos braços e escápulas.'
    ],
    formTips: [
      'Não balance as pernas (evite o kipping quando o objetivo for hipertrofia estrita).',
      'Mantenha as pernas juntas e o abdômen firme durante todo o trajeto.'
    ],
    commonMistakes: [
      'Meia amplitude (não descer totalmente ou não subir até o queixo).',
      'Projetar a cabeça para frente em excesso para alcançar a barra.'
    ]
  },
  {
    id: 'mw-barbell-bent-over-row',
    name: 'Remada Curvada com Barra',
    nameEn: 'Barbell Bent Over Row',
    category: 'Costas',
    primaryMuscle: 'Grande Dorsal, Romboides e Trapézio Médio',
    secondaryMuscles: ['Bíceps Braquial', 'Deltoide Posterior', 'Eretores da Espinha'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    targetFocus: 'Espessura e densidade completa da cadeia posterior',
    muscleWikiUrl: 'https://musclewiki.com/barbell/back/bent-over-row',
    instructions: [
      'Fique em pé com os pés na largura dos ombros segurando a barra com pegada pronada ou supinada.',
      'Flexione levemente os joelhos e empurre o quadril para trás inclinando o tronco a cerca de 45° a 70° (costas retas).',
      'Deixe a barra pendurada abaixo dos ombros com os braços estendidos.',
      'Puxe a barra em direção ao umbigo, mantendo os cotovelos próximos às costelas e apertando as escápulas no topo.',
      'Abaixe a barra lentamente até estender os braços mantendo a coluna lombar perfeitamente travada.'
    ],
    formTips: [
      'Pense em puxar com os cotovelos e não apenas com as mãos/bíceps.',
      'Mantenha a cabeça em posição neutra alinhada à coluna torácica.'
    ],
    commonMistakes: [
      'Arredondar a região lombar (risco sério de lesão discal).',
      'Jogar o tronco para cima com impulso excessivo das pernas a cada repetição.'
    ]
  },
  {
    id: 'mw-lat-pulldown',
    name: 'Puxada Frontal na Polia',
    nameEn: 'Lat Pulldown',
    category: 'Costas',
    primaryMuscle: 'Grande Dorsal',
    secondaryMuscles: ['Bíceps', 'Braquial', 'Redondo Maior', 'Peitoral Menor'],
    equipment: 'Cabos',
    difficulty: 'Iniciante',
    targetFocus: 'Desenvolvimento das dorsais e controle de puxada vertical',
    muscleWikiUrl: 'https://musclewiki.com/cables/back/lat-pulldown',
    instructions: [
      'Sente-se no aparelho e ajuste o apoio de coxas para travar as pernas com firmeza.',
      'Segure a barra larga com as palmas para frente, a uma distância superior aos ombros.',
      'Incline o tronco levemente para trás (10° a 15°) e abra o peito.',
      'Inicie a puxada descendo as escápulas e levando os cotovelos para baixo e para os lados até a barra aproximar-se da parte superior do peito.',
      'Pause brevemente e retorne controlando a subida até o alongamento total das dorsais.'
    ],
    formTips: [
      'Não puxe a barra atrás do pescoço; a puxada frontal é mais segura para a coluna cervical e manguito.',
      'Foque na sensação de "esmagar" as dorsais na parte inferior.'
    ],
    commonMistakes: [
      'Inclinar o tronco em 45 graus para usar o peso corporal como alavanca.',
      'Deixar a barra subir solta sem resistência excêntrica.'
    ]
  },
  {
    id: 'mw-dumbbell-single-arm-row',
    name: 'Remada Unilateral com Halter (Serrote)',
    nameEn: 'Single Arm Dumbbell Row',
    category: 'Costas',
    primaryMuscle: 'Grande Dorsal Unilateral e Romboides',
    secondaryMuscles: ['Deltoide Posterior', 'Bíceps', 'Braquial', 'Trapézio'],
    equipment: 'Halteres',
    difficulty: 'Iniciante',
    targetFocus: 'Correção de assimetrias e maior arco de contração do dorsal',
    muscleWikiUrl: 'https://musclewiki.com/dumbbells/back/single-arm-row',
    instructions: [
      'Apoie um joelho e a mão do mesmo lado em um banco plano.',
      'Mantenha a coluna horizontal e alinhada, apoiando o outro pé firme no solo.',
      'Segure o halter com o braço oposto pendurado em extensão total.',
      'Puxe o halter em direção ao quadril, puxando o cotovelo para trás e para cima rente ao tronco.',
      'Sinta a contração no dorsal e desça o peso de forma controlada até o alongamento completo.'
    ],
    formTips: [
      'Traga o halter em direção à cintura e não em linha reta para o ombro (ativação máxima do dorsal inferior).',
      'Evite torcer o tronco durante a subida; o peito deve permanecer paralelo ao chão.'
    ],
    commonMistakes: [
      'Girar os ombros e a lombar para subir o peso por rotação da coluna.',
      'Movimento muito curto sem estender o braço embaixo.'
    ]
  },
  {
    id: 'mw-deadlift',
    name: 'Levantamento Terra Convencional',
    nameEn: 'Barbell Deadlift',
    category: 'Costas',
    primaryMuscle: 'Eretores da Espinha, Glúteos e Isquiotibiais',
    secondaryMuscles: ['Grande Dorsal', 'Trapézio', 'Quadríceps', 'Antebraços / Pegada', 'Core'],
    equipment: 'Barra',
    difficulty: 'Avançado',
    targetFocus: 'Construção de força bruta total e espessura lombar/costas',
    muscleWikiUrl: 'https://musclewiki.com/barbell/back/deadlift',
    instructions: [
      'Fique em pé com os pés na largura do quadril, com a barra posicionada sobre a metade dos pés (cadarço do tênis).',
      'Flexione o quadril e os joelhos até conseguir segurar a barra com as mãos imediatamente do lado de fora das pernas.',
      'Pressione o peito para cima, abaixe os quadris até a canela tocar a barra e trave a coluna em neutro.',
      'Respire fundo no abdômen (manobra de Valsalva), empurre o chão com os calcanhares e suba erguendo a barra rente às pernas.',
      'Fique totalmente ereto estendendo quadris e joelhos, sem hiperestender a lombar para trás.',
      'Retorne o peso ao chão controlando o movimento pelo quadril.'
    ],
    formTips: [
      'Pense no movimento como "empurrar o chão para longe" e não como "puxar a barra com as costas".',
      'A barra deve deslizar o tempo todo colada à canela e coxas.'
    ],
    commonMistakes: [
      'Arredondar a coluna lombar na saída do solo.',
      'Deixar a barra afastar-se do corpo criando uma alavanca lesiva para a coluna.'
    ]
  },

  // ==================== OMBROS (SHOULDERS / DELTOIDS) ====================
  {
    id: 'mw-overhead-press',
    name: 'Desenvolvimento Militar com Barra em Pé',
    nameEn: 'Overhead Press / Military Press',
    category: 'Ombros',
    primaryMuscle: 'Deltoide Anterior e Lateral',
    secondaryMuscles: ['Tríceps Braquial', 'Trapézio Superior', 'Serrátil Anterior', 'Core'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    targetFocus: 'Força vertical pura e estabilidade escapular',
    muscleWikiUrl: 'https://musclewiki.com/barbell/shoulders/overhead-press',
    instructions: [
      'Segure a barra na altura dos ombros/clavícula com pegada pronada um pouco além da largura dos ombros.',
      'Mantenha os cotovelos levemente apontados para a frente da barra, glúteos contraídos e abdômen rígido.',
      'Pressione a barra em linha reta para cima, inclinando a cabeça sutilmente para trás para a passagem da barra.',
      'Assim que a barra passar o topo da cabeça, projete a cabeça de volta à posição neutra e trave os braços no topo.',
      'Desça controlando até a altura do peito superior.'
    ],
    formTips: [
      'Aperte os glúteos para evitar arquear a lombar para trás.',
      'Ative a rotação externa dos ombros empurrando os cotovelos ligeiramente para frente.'
    ],
    commonMistakes: [
      'Usar impulso das pernas (transformando em Push Press quando a proposta for militar estrito).',
      'Hiperestender a coluna lombar para compensar falta de mobilidade nos ombros.'
    ]
  },
  {
    id: 'mw-dumbbell-lateral-raise',
    name: 'Elevação Lateral com Halteres',
    nameEn: 'Dumbbell Lateral Raise',
    category: 'Ombros',
    primaryMuscle: 'Deltoide Lateral (Porção Acromial)',
    secondaryMuscles: ['Deltoide Anterior', 'Trapézio Superior', 'Supraespinhal'],
    equipment: 'Halteres',
    difficulty: 'Iniciante',
    targetFocus: 'Largura dos ombros (aparência em V) e isolamento da cabeça lateral',
    muscleWikiUrl: 'https://musclewiki.com/dumbbells/shoulders/lateral-raise',
    instructions: [
      'Fique em pé com os pés na largura do quadril, segurando os halteres ao lado do corpo.',
      'Incline o tronco 5° a 10° para a frente com os cotovelos ligeiramente flexionados.',
      'Eleve os braços para os lados no plano escapular (cerca de 20° a 30° à frente da linha do corpo) até a altura dos ombros.',
      'Concentre-se em erguer pelos cotovelos e não pelas mãos, mantendo as palmas voltadas para o chão.',
      'Pause brevemente no topo e desça controlando a descida em 2 segundos.'
    ],
    formTips: [
      'Imagine que você está despejando água de uma jarra no topo para manter a ativação no deltoide lateral.',
      'Não eleve acima da linha dos ombros se sentir pinçamento articular no manguito rotador.'
    ],
    commonMistakes: [
      'Dar tranco com as costas e pernas para erguer cargas pesadas demais.',
      'Encolher os ombros no início do movimento ativando o trapézio em vez do deltoide.'
    ]
  },
  {
    id: 'mw-face-pull',
    name: 'Face Pull na Polia com Corda',
    nameEn: 'Cable Face Pull',
    category: 'Ombros',
    primaryMuscle: 'Deltoide Posterior e Manguito Rotador (Infraspinhal, Redondo Menor)',
    secondaryMuscles: ['Romboides', 'Trapézio Médio e Inferior'],
    equipment: 'Cabos',
    difficulty: 'Iniciante',
    targetFocus: 'Saúde postural dos ombros, rotação externa e proteção do manguito',
    muscleWikiUrl: 'https://musclewiki.com/cables/shoulders/face-pull',
    instructions: [
      'Ajuste a roldana da polia na altura dos olhos e acople a corda dupla.',
      'Segure as pontas da corda com as palmas voltadas uma para a outra ou para baixo (pegada neutra/pronada).',
      'Dê dois passos para trás para criar tensão inicial no cabo com os braços esticados.',
      'Puxe a corda em direção ao rosto, abrindo as pontas e puxando os cotovelos para trás e para cima.',
      'No final do movimento, faça a rotação externa completa: mãos para trás ao lado das orelhas, formando um "duplo bíceps".',
      'Segure 1 segundo apertando a musculatura posterior e retorne suavemente.'
    ],
    formTips: [
      'Excelente exercício para neutralizar a postura corcunda do trabalho no computador e do excesso de supino.',
      'Use cargas moderadas priorizando a qualidade da rotação externa.'
    ],
    commonMistakes: [
      'Puxar para a barriga ou peito em vez de puxar para a linha dos olhos/testa.',
      'Projetar o pescoço para frente para alcançar a corda.'
    ]
  },

  // ==================== BRAÇOS: BÍCEPS ====================
  {
    id: 'mw-barbell-bicep-curl',
    name: 'Rosca Direta com Barra',
    nameEn: 'Barbell Bicep Curl',
    category: 'Braços',
    primaryMuscle: 'Bíceps Braquial (Cabeça Curta e Longa)',
    secondaryMuscles: ['Braquial', 'Braquiorradial', 'Flexores do Antebraço'],
    equipment: 'Barra',
    difficulty: 'Iniciante',
    targetFocus: 'Volume e força bruta nos flexores do cotovelo',
    muscleWikiUrl: 'https://musclewiki.com/barbell/biceps/barbell-curl',
    instructions: [
      'Fique ereto segurando a barra com pegada supinada (palmas para frente) na largura dos ombros.',
      'Mantenha os cotovelos colados às laterais do tronco durante todo o trajeto.',
      'Flexione os cotovelos erguendo a barra em direção aos ombros, contraindo o bíceps no topo.',
      'Abaixe a barra lentamente até a extensão quase total dos braços, sem deixar o peso cair.'
    ],
    formTips: [
      'Use a barra W (EZ) se sentir dor ou desconforto nos punhos com a barra reta.',
      'Mantenha os cotovelos estáveis sem projetá-los para a frente para não roubar com o deltoide anterior.'
    ],
    commonMistakes: [
      'Balançar o tronco para trás na fase inicial.',
      'Soltar a barra na descida perdendo a fase excêntrica.'
    ]
  },
  {
    id: 'mw-dumbbell-hammer-curl',
    name: 'Rosca Martelo com Halteres',
    nameEn: 'Dumbbell Hammer Curl',
    category: 'Braços',
    primaryMuscle: 'Braquial e Braquiorradial',
    secondaryMuscles: ['Bíceps Braquial (Cabeça Longa)', 'Extensores/Flexores do Punho'],
    equipment: 'Halteres',
    difficulty: 'Iniciante',
    targetFocus: 'Espessura do braço e força de pegada funcional',
    muscleWikiUrl: 'https://musclewiki.com/dumbbells/biceps/hammer-curl',
    instructions: [
      'Segure um halter em cada mão ao lado do corpo com pegada neutra (palmas viradas uma para a outra).',
      'Mantenha os cotovelos fixos ao lado do corpo e o tronco imóvel.',
      'Erga os halteres mantendo as palmas voltadas para dentro até contrair o antebraço contra o bíceps.',
      'Aperte no topo e desça de forma controlada até estender os cotovelos.'
    ],
    formTips: [
      'A pegada neutra coloca o músculo braquial em linha direta de tração, o que "empurra" o bíceps para cima dando volume ao braço.',
      'Pode ser feito simultaneamente ou de forma alternada.'
    ],
    commonMistakes: [
      'Girar o punho durante o movimento (descaracterizando a pegada martelo).',
      'Jogar o cotovelo para trás reduzindo a amplitude.'
    ]
  },

  // ==================== BRAÇOS: TRÍCEPS ====================
  {
    id: 'mw-cable-tricep-pushdown',
    name: 'Tríceps na Polia com Corda',
    nameEn: 'Cable Tricep Pushdown',
    category: 'Braços',
    primaryMuscle: 'Tríceps Braquial (Cabeça Lateral e Medial)',
    secondaryMuscles: ['Tríceps Cabeça Longa', 'Ancôneo'],
    equipment: 'Cabos',
    difficulty: 'Iniciante',
    targetFocus: 'Definição e isolamento da porção lateral do tríceps',
    muscleWikiUrl: 'https://musclewiki.com/cables/triceps/tricep-pushdown',
    instructions: [
      'Fixe a corda na roldana alta da polia.',
      'Segure a corda pelas pontas, incline ligeiramente o tronco para a frente e trave os cotovelos colados às costelas.',
      'Empurre a corda para baixo estendendo os cotovelos até o bloqueio articular seguro.',
      'No final da extensão, afaste as duas pontas da corda para os lados para contração máxima da cabeça lateral.',
      'Retorne os antebraços até formarem um ângulo de ~90° com os braços, sem permitir que os cotovelos se movam para a frente.'
    ],
    formTips: [
      'Apenas o antebraço se move; a articulação do ombro e o cotovelo permanecem imóveis.',
      'Mantenha os pulsos firmes sem dobrá-los para baixo.'
    ],
    commonMistakes: [
      'Abrir os cotovelos para os lados durante o movimento.',
      'Usar o peso do corpo para empurrar o cabo para baixo.'
    ]
  },
  {
    id: 'mw-skull-crusher',
    name: 'Tríceps Testa com Barra W',
    nameEn: 'Lying Triceps Extension (Skull Crusher)',
    category: 'Braços',
    primaryMuscle: 'Tríceps Braquial (Cabeça Longa e Medial)',
    secondaryMuscles: ['Ancôneo'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    targetFocus: 'Massa e alongamento da cabeça longa do tríceps',
    muscleWikiUrl: 'https://musclewiki.com/barbell/triceps/skull-crusher',
    instructions: [
      'Deite-se no banco plano segurando a barra W com pegada pronada na largura média.',
      'Estenda os braços para cima e incline-os ligeiramente para trás da vertical (em direção à cabeça).',
      'Dobrando apenas os cotovelos, desça a barra controladamente em direção à testa ou ligeiramente atrás da cabeça.',
      'Estenda os cotovelos de volta à posição inicial contraindo fortemente o tríceps.',
      'Mantenha os cotovelos apontados para o teto sem deixá-los abrir para fora.'
    ],
    formTips: [
      'Levar a barra um pouco atrás da cabeça em vez de direto na testa mantém a tensão contínua na cabeça longa e alivia a pressão nos tendões do cotovelo.',
      'Se sentir estalo ou dor no cotovelo, reduza a carga e aumente o aquecimento.'
    ],
    commonMistakes: [
      'Deixar os cotovelos abrirem excessivamente para os lados.',
      'Mover os ombros durante o movimento transformando em pullover.'
    ]
  },
  {
    id: 'mw-parallel-dips',
    name: 'Mergulho nas Paralelas',
    nameEn: 'Parallel Bar Dips',
    category: 'Braços',
    primaryMuscle: 'Tríceps Braquial e Peitoral Inferior',
    secondaryMuscles: ['Deltoide Anterior', 'Romboides'],
    equipment: 'Peso Corporal',
    difficulty: 'Intermediário',
    targetFocus: 'Força de empurrar corporal e espessura do tríceps',
    muscleWikiUrl: 'https://musclewiki.com/bodyweight/triceps/dips',
    instructions: [
      'Apoie-se nas barras paralelas com os braços totalmente estendidos e o tronco reto (para foco em tríceps).',
      'Desça o corpo flexionando os cotovelos até que os braços formem um ângulo de 90 graus.',
      'Mantenha os cotovelos apontados para trás e próximos ao corpo.',
      'Empurre as barras para baixo com força retornando à extensão dos braços.'
    ],
    formTips: [
      'Tronco reto = maior ênfase no tríceps. Tronco inclinado para a frente = maior ênfase no peitoral inferior.',
      'Não desça além de 90° se tiver histórico de instabilidade ou dor nos ombros.'
    ],
    commonMistakes: [
      'Descer de forma descontrolada arriscando os ligamentos do ombro.',
      'Encolher os ombros na subida.'
    ]
  },

  // ==================== PERNAS: QUADRÍCEPS ====================
  {
    id: 'mw-barbell-squat',
    name: 'Agachamento Livre com Barra',
    nameEn: 'Barbell Back Squat',
    category: 'Pernas',
    primaryMuscle: 'Quadríceps (Vasto Lateral, Medial, Intermédio e Reto Femoral)',
    secondaryMuscles: ['Glúteo Máximo', 'Adutores', 'Isquiotibiais', 'Core / Eretores da Espinha'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    targetFocus: 'Desenvolvimento geral de força, volume e densidade dos membros inferiores',
    muscleWikiUrl: 'https://musclewiki.com/barbell/quads/barbell-squat',
    instructions: [
      'Posicione a barra sobre o trapézio superior (High Bar) ou ligeiramente abaixo sobre as espinhas das escápulas (Low Bar).',
      'Posicione os pés ligeiramente mais largos que o quadril, com as pontas viradas cerca de 15° a 30° para fora.',
      'Inspire profundamente no abdômen, inflando a caixa torácica e travando o core.',
      'Inicie a descida projetando o quadril para trás e dobrando os joelhos para fora na mesma direção dos dedos dos pés.',
      'Desça até que o vinco do quadril fique abaixo do topo do joelho (pelo menos 90°).',
      'Empurre o chão com o meio do pé e calcanhares para retornar à posição ereta, expirando na subida.'
    ],
    formTips: [
      'Mantenha o peito aberto e a coluna alinhada durante todo o percurso.',
      'Os joelhos devem acompanhar a linha dos pés, nunca desabando para dentro (valgo dinâmico).'
    ],
    commonMistakes: [
      'Deixar os calcanhares saírem do chão.',
      'Curvar a lombar no fundo do agachamento (butt wink excessivo).',
      'Agachar apenas um quarto do movimento reduzindo o recrutamento muscular.'
    ]
  },
  {
    id: 'mw-leg-press-45',
    name: 'Leg Press 45°',
    nameEn: 'Leg Press',
    category: 'Pernas',
    primaryMuscle: 'Quadríceps e Glúteos',
    secondaryMuscles: ['Adutores', 'Isquiotibiais'],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    targetFocus: 'Sobrecarga de quadríceps com suporte lombar e estabilidade guiada',
    muscleWikiUrl: 'https://musclewiki.com/machine/quads/leg-press',
    instructions: [
      'Sente-se no aparelho mantendo as costas e o quadril firmemente apoiados no encosto.',
      'Coloque os pés na plataforma na largura dos ombros, pontas ligeiramente para fora.',
      'Destrave a segurança e desça o carrinho flexionando os joelhos até formar um ângulo de 90° ou pouco mais, sem tirar o quadril do banco.',
      'Empurre a plataforma de volta estendendo as pernas, mantendo uma leve flexão nos joelhos no final (não trave a articulação).'
    ],
    formTips: [
      'Segure firme nas alças laterais para manter a pelve pressionada contra o assento.',
      'Pés mais baixos na plataforma aumentam o foco nos quadríceps; pés mais altos focam mais em glúteos e posteriores.'
    ],
    commonMistakes: [
      'Deixar a lombar descolar do encosto no final da descida (perigo extremo para os discos L4-L5-S1).',
      'Hiperestender e travar bruscamente os joelhos no topo sob carga pesada.'
    ]
  },
  {
    id: 'mw-bulgarian-split-squat',
    name: 'Agachamento Búlgaro com Halteres',
    nameEn: 'Bulgarian Split Squat',
    category: 'Pernas',
    primaryMuscle: 'Quadríceps e Glúteo Máximo Unilateral',
    secondaryMuscles: ['Isquiotibiais', 'Adutores', 'Estabilizadores do Tornozelo e Core'],
    equipment: 'Halteres',
    difficulty: 'Intermediário',
    targetFocus: 'Correção de desequilíbrios de força e hipertrofia unilateral intensa',
    muscleWikiUrl: 'https://musclewiki.com/dumbbells/quads/bulgarian-split-squat',
    instructions: [
      'Fique em pé segurando um halter em cada mão, de costas para um banco plano.',
      'Apoie o peito do pé de trás no banco e dê um passo à frente com a perna de trabalho.',
      'Desça o tronco flexionando o joelho dianteiro até que a coxa fique paralela ao chão e o joelho de trás quase toque o solo.',
      'Empurre o chão com o calcanhar da perna da frente para retornar à posição ereta.',
      'Complete as repetições de um lado antes de trocar.'
    ],
    formTips: [
      'Tronco ereto foca mais no quadríceps; leve inclinação do tronco para frente foca mais no glúteo da perna dianteira.',
      'Mantenha o joelho da frente estável alinhado com o segundo dedo do pé.'
    ],
    commonMistakes: [
      'Colocar o pé dianteiro muito perto do banco sobrecarregando o tendão patelar.',
      'Colocar muito peso na perna de trás em vez de focar na perna dianteira.'
    ]
  },

  // ==================== PERNAS: ISQUIOTIBIAIS (HAMSTRINGS) ====================
  {
    id: 'mw-romanian-deadlift',
    name: 'Levantamento Terra Romeno (RDL) / Stiff',
    nameEn: 'Romanian Deadlift (RDL)',
    category: 'Pernas',
    primaryMuscle: 'Isquiotibiais (Bíceps Femoral, Semitendíneo, Semimembranáceo)',
    secondaryMuscles: ['Glúteo Máximo', 'Eretores da Espinha', 'Adutor Magno'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    targetFocus: 'Alongamento sob carga e hipertrofia da cadeia posterior da coxa',
    muscleWikiUrl: 'https://musclewiki.com/barbell/hamstrings/romanian-deadlift',
    instructions: [
      'Fique em pé com os pés na largura do quadril segurando a barra com pegada pronada na frente das coxas.',
      'Mantenha uma leve flexão nos joelhos (cerca de 15°) e trave esse ângulo durante todo o movimento.',
      'Inicie empurrando o quadril para trás como se quisesse fechar uma porta com o glúteo.',
      'Desça a barra rente às pernas até sentir um alongamento potente na parte de trás das coxas (geralmente abaixo do joelho).',
      'Mantenha as costas perfeitamente retas e o peito estufado.',
      'Contraia os glúteos e posteriores para empurrar o quadril para frente e retornar à posição inicial.'
    ],
    formTips: [
      'O movimento é de dobradiça de quadril (hip hinge), não de agachamento.',
      'A barra nunca deve se afastar das pernas.'
    ],
    commonMistakes: [
      'Arredondar a coluna torácica e lombar ao tentar descer a barra até o chão.',
      'Dobrar demais os joelhos transformando o exercício em agachamento.'
    ]
  },
  {
    id: 'mw-leg-curl-machine',
    name: 'Mesa ou Cadeira Flexora',
    nameEn: 'Lying / Seated Leg Curl',
    category: 'Pernas',
    primaryMuscle: 'Isquiotibiais (Flexão de Joelho)',
    secondaryMuscles: ['Gastrocnêmio (Panturrilha)'],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    targetFocus: 'Isolamento da flexão de joelho dos posteriores de coxa',
    muscleWikiUrl: 'https://musclewiki.com/machine/hamstrings/lying-leg-curl',
    instructions: [
      'Ajuste o rolo acolchoado para ficar logo abaixo das panturrilhas, um pouco acima dos calcanhares.',
      'Alinhe a articulação do joelho com o eixo de rotação do aparelho.',
      'Deite-se ou sente-se firmemente, segurando as manoplas de apoio.',
      'Flexione os joelhos puxando os calcanhares em direção aos glúteos com força controlada.',
      'Aperte por 1 segundo no topo e retorne devagar estendendo as pernas sem permitir que os pesos batam.'
    ],
    formTips: [
      'Mantenha a ponta dos pés apontada para a frente (dorsiflexão) para maior recrutamento dos isquiotibiais.',
      'Não deixe o quadril levantar do banco na mesa flexora.'
    ],
    commonMistakes: [
      'Dar tranco com a lombar para iniciar a subida do rolo.',
      'Amplitude incompleta na volta.'
    ]
  },

  // ==================== GLÚTEOS ====================
  {
    id: 'mw-barbell-hip-thrust',
    name: 'Elevação Pélvica com Barra (Hip Thrust)',
    nameEn: 'Barbell Hip Thrust',
    category: 'Pernas',
    primaryMuscle: 'Glúteo Máximo',
    secondaryMuscles: ['Isquiotibiais', 'Quadríceps', 'Adutores', 'Core'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    targetFocus: 'Pico de contração e máxima hipertrofia dos glúteos',
    muscleWikiUrl: 'https://musclewiki.com/barbell/glutes/barbell-hip-thrust',
    instructions: [
      'Sente-se no chão com a parte inferior das escápulas apoiada na borda de um banco estável.',
      'Role a barra com proteção acolchoada sobre os quadris até a linha do vinco pélvico.',
      'Plante os pés no chão na largura dos ombros, a uma distância onde as canelas fiquem verticais a 90° no topo.',
      'Empurre pelos calcanhares elevando o quadril até que o tronco e as coxas fiquem paralelos ao chão.',
      'Contraia os glúteos no topo por 1 a 2 segundos mantendo o queixo voltado para o peito (olhando para a frente).',
      'Desça o quadril controladamente sem perder a tensão.'
    ],
    formTips: [
      'Olhe para a frente e não para o teto; isso evita a hiperextensão da coluna lombar.',
      'As canelas devem ficar verticais no ponto mais alto.'
    ],
    commonMistakes: [
      'Arquear a lombar no topo em vez de fazer retroversão pélvica com os glúteos.',
      'Posicionar os pés muito perto ou muito longe dos glúteos.'
    ]
  },

  // ==================== PANTURRILHAS (CALVES) ====================
  {
    id: 'mw-standing-calf-raise',
    name: 'Elevação de Panturrilha em Pé',
    nameEn: 'Standing Calf Raise',
    category: 'Pernas',
    primaryMuscle: 'Gastrocnêmio (Cabeça Medial e Lateral)',
    secondaryMuscles: ['Sóleo', 'Tibial Posterior'],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    targetFocus: 'Espessura e pico superior da panturrilha',
    muscleWikiUrl: 'https://musclewiki.com/machine/calves/standing-calf-raise',
    instructions: [
      'Posicione os ombros sob os apoios acolchoados e apoie a ponta dos pés na borda da plataforma.',
      'Mantenha as pernas estendidas com os joelhos destravados.',
      'Abaixe os calcanhares o máximo possível para um alongamento profundo da fáscia e do tendão de Aquiles.',
      'Pause 1 segundo no ponto mais baixo para dissipar o reflexo elástico.',
      'Empurre a plataforma com o dedão do pé e a bola do pé, subindo na ponta dos pés até a contração máxima.',
      'Segure 1 segundo no topo antes de descer lentamente.'
    ],
    formTips: [
      'A pausa de 1 segundo embaixo é o segredo para forçar o músculo a trabalhar sem depender do reflexo do tendão.',
      'Distribua o peso uniformemente na bola do pé e no dedão.'
    ],
    commonMistakes: [
      'Quicar freneticamente sem pausa nem controle excêntrico.',
      'Dobrar os joelhos para usar impulso das coxas.'
    ]
  },

  // ==================== CORE & ABDÔMEN ====================
  {
    id: 'mw-hanging-leg-raise',
    name: 'Elevação de Pernas na Barra Fixa',
    nameEn: 'Hanging Leg Raise',
    category: 'Core',
    primaryMuscle: 'Reto Abdominal (Ênfase Infraumbilical) e Flexores do Quadril',
    secondaryMuscles: ['Oblíquos', 'Antebraços / Pegada', 'Serrátil'],
    equipment: 'Peso Corporal',
    difficulty: 'Intermediário',
    targetFocus: 'Controle de core sob suspensão e força da porção inferior do abdômen',
    muscleWikiUrl: 'https://musclewiki.com/bodyweight/abs/hanging-leg-raise',
    instructions: [
      'Pendure-se em uma barra fixa com pegada pronada na largura dos ombros.',
      'Mantenha as pernas unidas e o tronco firme, sem balançar.',
      'Contraia o abdômen e erga as pernas retas (ou com joelhos levemente dobrados) até formarem um ângulo de 90° com o tronco.',
      'No final da subida, flexione levemente o quadril e a pelve para cima (retroversão) para enrolar a coluna e acionar o reto abdominal.',
      'Desça as pernas devagar resistindo à gravidade sem dar tranco.'
    ],
    formTips: [
      'Não balance o corpo para ganhar embalo. Se necessário, comece flexionando os joelhos (Hanging Knee Raise).',
      'Pense em aproximar o púbis do umbigo para máxima ativação muscular.'
    ],
    commonMistakes: [
      'Usar apenas os flexores do quadril (psoas) sem enrolar a pelve.',
      'Balançar o corpo como um pêndulo.'
    ]
  },
  {
    id: 'mw-plank',
    name: 'Prancha Isométrica no Solo',
    nameEn: 'Plank',
    category: 'Core',
    primaryMuscle: 'Transverso do Abdômen e Reto Abdominal',
    secondaryMuscles: ['Oblíquos', 'Glúteos', 'Eretores da Espinha', 'Ombros / Peitoral'],
    equipment: 'Peso Corporal',
    difficulty: 'Iniciante',
    targetFocus: 'Estabilidade lombo-pélvica profunda e proteção da coluna vertebral',
    muscleWikiUrl: 'https://musclewiki.com/bodyweight/abs/plank',
    instructions: [
      'Apoie os antebraços no chão, com os cotovelos alinhados diretamente sob os ombros.',
      'Estenda as pernas para trás apoiando-se na ponta dos pés, formando uma linha reta dos calcanhares à cabeça.',
      'Aperte fortemente os glúteos e puxe o umbigo em direção à coluna para criar uma cinta abdominal de pressão.',
      'Mantenha a cabeça em posição neutra olhando para as mãos.',
      'Sustente a posição estática respirando de forma controlada pelo tempo estipulado.'
    ],
    formTips: [
      'Empurre o chão com os antebraços para separar as escápulas levemente (protração escapular).',
      'Se a lombar começar a doer ou desabar para o chão, interrompa a série imediatamente.'
    ],
    commonMistakes: [
      'Deixar o quadril ceder criando arco excessivo na lombar.',
      'Elevar demais o bumbum formando uma pirâmide reduzindo a tensão no abdômen.'
    ]
  },

  // ==================== TRAPÉZIO & ANTEBRAÇOS ====================
  {
    id: 'mw-dumbbell-shrug',
    name: 'Encolhimento com Halteres',
    nameEn: 'Dumbbell Shrug',
    category: 'Trapézio',
    primaryMuscle: 'Trapézio Superior',
    secondaryMuscles: ['Levantador da Escápula', 'Antebraços'],
    equipment: 'Halteres',
    difficulty: 'Iniciante',
    targetFocus: 'Volume da porção superior das costas e suporte cervical',
    muscleWikiUrl: 'https://musclewiki.com/dumbbells/traps/dumbbell-shrug',
    instructions: [
      'Fique ereto segurando um halter pesado em cada mão ao lado do corpo.',
      'Mantenha os braços totalmente esticados e a coluna neutra.',
      'Erga os ombros em linha reta para cima em direção às orelhas o mais alto que conseguir.',
      'Segure a contração máxima por 1 a 2 segundos no topo.',
      'Abaixe os ombros lentamente até o alongamento completo do trapézio.'
    ],
    formTips: [
      'Movimento estritamente vertical: NUNCA rode os ombros para trás ou para frente (risco desnecessário para a articulação acromioclavicular).',
      'Foque em elevar com a força dos trapézios e não dobrando os cotovelos.'
    ],
    commonMistakes: [
      'Fazer rotação dos ombros.',
      'Usar impulso dos joelhos para lançar os pesos.'
    ]
  },
  {
    id: 'mw-farmers-walk',
    name: 'Caminhada do Fazendeiro (Farmer’s Walk)',
    nameEn: 'Farmer’s Walk',
    category: 'Antebraços',
    primaryMuscle: 'Flexores dos Dedos e Antebraços (Força de Pegada)',
    secondaryMuscles: ['Trapézio', 'Core / Oblíquos', 'Glúteos', 'Pernas'],
    equipment: 'Halteres',
    difficulty: 'Iniciante',
    targetFocus: 'Força de pegada esmagadora, estabilidade do core e densidade corporal',
    muscleWikiUrl: 'https://musclewiki.com/dumbbells/forearms/farmers-walk',
    instructions: [
      'Fique em pé ereto segurando um par de halteres ou kettlebells pesados ao lado do corpo.',
      'Mantenha os ombros para trás, peito aberto e abdômen bem contraído.',
      'Caminhe para a frente com passos curtos, firmes e controlados.',
      'Evite balançar os pesos ou oscilar o tronco de um lado para o outro.',
      'Caminhe pela distância ou tempo determinado mantendo a pegada firme.'
    ],
    formTips: [
      'Excelente para quem pratica artes marciais (Jiu-Jitsu, Judô) que dependem de pegada forte no quimono.',
      'Respire ritmadamente sem perder o aperto nas mãos.'
    ],
    commonMistakes: [
      'Deixar os ombros caírem para a frente em postura corcunda.',
      'Andar muito rápido perdendo o controle dos pesos.'
    ]
  }
];

export function searchMuscleWiki(
  query?: string,
  filter?: {
    category?: string;
    equipment?: string;
    difficulty?: string;
  }
): MuscleWikiExercise[] {
  let list = [...MUSCLEWIKI_DATABASE];

  if (filter?.category && filter.category !== 'Todos') {
    list = list.filter((item) => item.category === filter.category);
  }

  if (filter?.equipment && filter.equipment !== 'Todos') {
    list = list.filter((item) => item.equipment === filter.equipment);
  }

  if (filter?.difficulty && filter.difficulty !== 'Todos') {
    list = list.filter((item) => item.difficulty === filter.difficulty);
  }

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.primaryMuscle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.equipment.toLowerCase().includes(q) ||
        item.targetFocus.toLowerCase().includes(q) ||
        item.secondaryMuscles.some((m) => m.toLowerCase().includes(q))
      );
    });
  }

  return list;
}
