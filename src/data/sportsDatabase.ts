import { SportsItem } from '../types';
export type { SportsItem };

export const MARTIAL_ARTS_LIST = [
  'Jiu-Jitsu (BJJ)',
  'Muay Thai',
  'Boxe',
  'Judô',
  'Taekwondo',
  'Hapkido',
];

export const SPORT_STYLES_LIST = [
  'Musculação',
  'Calistenia',
  'Corrida & Atletismo',
  'Natação',
  'Ciclismo',
];

export const SPORTS_DATABASE: SportsItem[] = [
  // ==================== ARTES MARCIAIS: TAEKWONDO ====================
  {
    id: 'tkd-bandal-chagi',
    name: 'Bandal Chagi (Chute Semicircular Rápido / 45°)',
    category: 'artes_marciais',
    subCategory: 'Taekwondo',
    targetMuscles: ['Quadríceps', 'Flexores do Quadril (Psoas)', 'Glúteo Médio', 'Oblíquos'],
    difficulty: 'Iniciante',
    description: 'Chute característico e ultra-veloz do Taekwondo olímpico, desferido em ângulo de 45 graus visando a pontuação no colete (Hogu) do adversário.',
    technicalTips: [
      'Erga o joelho dobrado apontando entre o tronco e a lateral antes de disparar o chicote da perna.',
      'Gire o pé de apoio em cerca de 90 a 120 graus para liberar a articulação do quadril.',
      'Bata com o peito do pé (dorso) esticado, recolhendo a perna instantaneamente para não permitir a pegada.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Virilha (adutores) e tendão patelar',
      strengtheningExercise: 'Alongamento em borboleta com isometria e elevação de perna lateral com caneleira',
      preventionTip: 'Nunca dispare chutes rápidos sem aquecimento prévio da cápsula articular do quadril e flexores pélvicos.',
    },
  },
  {
    id: 'tkd-dwi-chagi',
    name: 'Dwi Chagi (Chute Giratório para Trás / Back Kick)',
    category: 'artes_marciais',
    subCategory: 'Taekwondo',
    targetMuscles: ['Glúteo Máximo', 'Isquiotibiais', 'Eretores da Espinha', 'Core'],
    difficulty: 'Intermediário',
    description: 'Golpe de contra-ataque de imensa potência linear: o atleta gira as costas e projeta o calcanhar diretamente no plexo ou abdômen do adversário.',
    technicalTips: [
      'Gire a cabeça por cima do ombro para localizar visualmente o alvo antes de soltar a perna.',
      'O joelho sobe colado ao corpo e o pé sai em linha reta para trás como um coice de cavalo, não em arco.',
      'O impacto deve ser desferido estritamente com a sola dura do calcanhar.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Lombar e joelho de apoio por rotação excessiva',
      strengtheningExercise: 'Stiff unilateral com halteres e prancha lateral com elevação de perna',
      preventionTip: 'Não torça o joelho de apoio travado no chão; permita que o pé de base gire suavemente durante o giro das costas.',
    },
  },
  {
    id: 'tkd-dollyo-chagi',
    name: 'Dollyo Chagi (Chute Circular Alto na Cabeça)',
    category: 'artes_marciais',
    subCategory: 'Taekwondo',
    targetMuscles: ['Isquiotibiais', 'Adutores', 'Glúteos', 'Lombar', 'Core'],
    difficulty: 'Avançado',
    description: 'Chute circular alto mirando o capacete. Requer alta flexibilidade dinâmica e estabilidade unilateral em uma perna.',
    technicalTips: [
      'Gire o pé de base 180 graus, com o calcanhar apontando para o oponente.',
      'Incline o tronco na direção oposta para abrir espaço para o quadril subir na altura do rosto.',
      'Estenda a perna como um chicote estalando com o peito do pé no alvo.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Impacto femoroacetabular e estiramento de isquiotibiais',
      strengtheningExercise: 'Mobilidade articular 90/90 de quadril e RDL com elástico',
      preventionTip: 'Trabalhe a flexibilidade ativa (força na amplitude máxima) e não apenas o alongamento passivo relaxado.',
    },
  },

  // ==================== ARTES MARCIAIS: HAPKIDO ====================
  {
    id: 'hapkido-sonmok-bbeogi',
    name: 'Sonmok Bbeogi (Liberação & Torção de Punho / Chave Articular)',
    category: 'artes_marciais',
    subCategory: 'Hapkido',
    targetMuscles: ['Pronadores e Supinadores do Antebraço', 'Flexores do Carpo', 'Bíceps'],
    difficulty: 'Iniciante',
    description: 'Técnica essencial de autodefesa coreana para quebrar a pegada do agressor no pulso, aplicando alavanca contra o polegar e torcendo a articulação carpal.',
    technicalTips: [
      'Gire o próprio punho em direção ao polegar do agressor (o elo mais fraco da pegada).',
      'Use o movimento do corpo inteiro (centro de gravidade Danjeon), não apenas a força isolada do braço.',
      'Dobre o punho do oponente em direção ao antebraço dele em ângulo de 90 graus para forçar a submissão.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Punhos (tendinite dos extensores/flexores do carpo)',
      strengtheningExercise: 'Flexão e extensão de punho com halteres leves e massagem miofascial no antebraço',
      preventionTip: 'No treino em dupla, avise seu parceiro para bater suavemente com o pé no chão logo no primeiro sinal de tensão articular.',
    },
  },
  {
    id: 'hapkido-palgup-kkeokgi',
    name: 'Palgup Kkeokgi (Chave e Alavanca Hiperextensora de Cotovelo)',
    category: 'artes_marciais',
    subCategory: 'Hapkido',
    targetMuscles: ['Peitoral', 'Deltóides', 'Grande Dorsal', 'Tríceps'],
    difficulty: 'Intermediário',
    description: 'Imobilização rápida utilizando a axila ou ombro como fulcro para travar e hiperextender o cotovelo do adversário em pé.',
    technicalTips: [
      'Domine o punho do adversário com as palmas voltadas para cima para orientar o cotovelo na direção vulnerável.',
      'Apoie a articulação do cotovelo do adversário sobre seu ombro ou antebraço criando uma alavanca de primeira classe.',
      'Aplique pressão descendente e lenta, controlando o centro de equilíbrio do oponente.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Cotovelos (epicondilite medial e hiperextensão acidental)',
      strengtheningExercise: 'Rosca martelo lenta e rosca inversa para reforço dos ligamentos colaterais do cotovelo',
      preventionTip: 'Em treinos de defesa pessoal, nunca aplique trancos bruscos nas articulações dos colegas de treino.',
    },
  },
  {
    id: 'hapkido-nakbeop',
    name: 'Nakbeop (Queda Amortecida e Rolamento Protetor)',
    category: 'artes_marciais',
    subCategory: 'Hapkido',
    targetMuscles: ['Core', 'Trapézio', 'Dorsais', 'Pernas'],
    difficulty: 'Iniciante',
    description: 'Fundamento de preservação física do Hapkido: técnicas para cair no solo dissipando o impacto através de rolamentos diagonais sem machucar ossos.',
    technicalTips: [
      'Queixo colado no peito durante toda a queda para impedir que a cabeça toque o solo.',
      'Bata com a palma da mão e o antebraço a 45 graus no tatame exatamente no momento do contato para dissipar energia cinética.',
      'Arredonde a coluna formando uma curva contínua, sem quinas ósseas batendo no tatame.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Cervical, cóccix e escápulas',
      strengtheningExercise: 'Ponte de glúteos e flexão de pescoço no chão (queixo duplo)',
      preventionTip: 'Pratique primeiro de joelhos ou sentado antes de treinar quedas a partir da posição em pé.',
    },
  },

  // ==================== ARTES MARCIAIS: JIU-JITSU (BJJ) ====================
  {
    id: 'bjj-passagem-guarda',
    name: 'Passagem de Guarda Toureador (Toreando)',
    category: 'artes_marciais',
    subCategory: 'Jiu-Jitsu (BJJ)',
    targetMuscles: ['Core', 'Quadríceps', 'Glúteos', 'Antebraços e Pegada'],
    difficulty: 'Intermediário',
    description: 'Movimento fundamental de pressão e velocidade para transpor as pernas do adversário e estabilizar os 100kg.',
    technicalTips: [
      'Segure firmemente as barras da calça do adversário na altura dos joelhos mantendo cotovelos fechados.',
      'Mantenha a base rebaixada com o quadril firme para não perder o centro de gravidade.',
      'Gire as pernas do oponente para um lado enquanto projeta o quadril para o lado oposto em velocidade explosiva.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Dedos das mãos, punhos e lombar',
      strengtheningExercise: 'Rosca inversa com halteres e prancha anti-rotação (Pallof press)',
      preventionTip: 'Alterne pegadas sem forçar as articulações dos dedos se sentir artrite nas falanges; use fitas adesivas (taping) de sustentação.',
    },
  },
  {
    id: 'bjj-triangulo',
    name: 'Ataque de Triângulo da Guarda Fechada',
    category: 'artes_marciais',
    subCategory: 'Jiu-Jitsu (BJJ)',
    targetMuscles: ['Adutores', 'Flexores de Quadril', 'Posteriores de Coxa', 'Core'],
    difficulty: 'Intermediário',
    description: 'Finalização por estrangulamento vascular prendendo um braço e a cabeça do adversário entre as pernas.',
    technicalTips: [
      'Controle o punho do oponente empurrando-o para dentro enquanto abre a guarda e ergue o quadril com explosão.',
      'Cruze o tornozelo atrás do joelho em ângulo de 90 graus (ajuste o ângulo cortando para a lateral do oponente).',
      'Puxe a cabeça suavemente com as duas mãos e projete o quadril para cima com contração pélvica.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Joelhos (menisco/ligamento colateral) e adutores',
      strengtheningExercise: 'Ponte de glúteos com bola suíça entre os joelhos e mobilidade 90/90 de quadril',
      preventionTip: 'Nunca puxe o próprio pé para fechar o triângulo; sempre puxe pela canela para não torcer o tornozelo e o joelho.',
    },
  },
  {
    id: 'bjj-raspagem-tesoura',
    name: 'Raspagem Tesoura (Scissor Sweep)',
    category: 'artes_marciais',
    subCategory: 'Jiu-Jitsu (BJJ)',
    targetMuscles: ['Oblíquos', 'Dorsais', 'Quadril', 'Glúteo Médio'],
    difficulty: 'Iniciante',
    description: 'Inversão clássica da guarda fechada utilizando alavanca de canela no peito e tesoura com as pernas.',
    technicalTips: [
      'Abra a guarda escorregando o quadril para o lado (fuga de quadril precisa).',
      'Posicione a canela transversalmente no peito do adversário e corte a perna de apoio rente ao tatame.',
      'Puxe o adversário para cima de você antes de executar o movimento com as pernas.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Costelas e cervical',
      strengtheningExercise: 'Dead bug e isometria de ponte de pescoço no chão (com cautela)',
      preventionTip: 'Evite aceitar o peso morto do oponente diretamente nas costelas flutuantes sem estar esgrimando ou mantendo distância.',
    },
  },

  // ==================== ARTES MARCIAIS: MUAY THAI ====================
  {
    id: 'muaythai-lowkick',
    name: 'Chute Baixo Circular (Low Kick)',
    category: 'artes_marciais',
    subCategory: 'Muay Thai',
    targetMuscles: ['Quadríceps', 'Canelas (Tibial)', 'Glúteos', 'Oblíquos e Core'],
    difficulty: 'Iniciante',
    description: 'Golpe devastador desferido com a tíbia na coxa do adversário (nervo ciático e vasto lateral), desestabilizando a base.',
    technicalTips: [
      'Dê um passo em 45 graus com o pé de base, girando o calcanhar na direção do alvo.',
      'Gire o quadril completamente projetando o ombro do mesmo lado do chute para frente.',
      'O impacto deve ser feito com o terço médio da tíbia (canela), nunca com o peito do pé.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Canelas (microfraturas da tíbia) e quadril',
      strengtheningExercise: 'Elevação de calcanhares e flexão dorsal de tornozelo com elástico (reforço do tibial anterior)',
      preventionTip: 'Caleje a canela com chutes progressivos no saco de pancadas pesado; nunca com rolos de madeira ou garrafas, para evitar periostite.',
    },
  },
  {
    id: 'muaythai-teep',
    name: 'Chute Frontal de Parada (Teep / Push Kick)',
    category: 'artes_marciais',
    subCategory: 'Muay Thai',
    targetMuscles: ['Flexores do Quadril', 'Reto Abdominal', 'Glúteo de Apoio', 'Gastrocnêmio'],
    difficulty: 'Iniciante',
    description: 'Arma defensiva e de controle de distância para empurrar o tronco ou quadril do oponente.',
    technicalTips: [
      'Suba o joelho alto no centro do corpo antes de estender a perna para a frente como um golpe de pistão.',
      'Apoie o impacto com a bola do pé (metatarso), puxando os dedos para trás.',
      'Projete a bacia levemente para a frente para conferir peso corporal ao golpe.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Tendão de Aquiles e fáscia plantar do pé de apoio',
      strengtheningExercise: 'Alongamento de panturrilha em degrau e massagem plantar com bola de lacrosse',
      preventionTip: 'Mantenha o calcanhar do pé de base ligeiramente no chão ou subindo levemente sem hiperextender o joelho de apoio.',
    },
  },
  {
    id: 'muaythai-clinch',
    name: 'Clinch Tailandês e Joelhadas (Plum & Knee Strike)',
    category: 'artes_marciais',
    subCategory: 'Muay Thai',
    targetMuscles: ['Trapézio', 'Dorsais', 'Dorsolombar', 'Quadríceps e Glúteos'],
    difficulty: 'Avançado',
    description: 'Domínio do pescoço com pegada bimanual quebrando a postura do adversário para desferir joelhadas curvas ou retas.',
    technicalTips: [
      'Encaixe as palmas das mãos na nuca do adversário (uma mão sobre a outra, sem entrelaçar dedos).',
      'Junte os cotovelos contra as clavículas do adversário para travar sua cabeça para baixo.',
      'Projete o quadril para frente ao desferir a joelhada, pontuando com a ponta do joelho.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Cervical e trapézio superior',
      strengtheningExercise: 'Retração escapular no cabo e isometria de pescoço em 4 direções',
      preventionTip: 'Nunca puxe o clinch com a força exclusiva dos braços; use o peso do corpo e o encurtamento do tronco.',
    },
  },

  // ==================== ARTES MARCIAIS: BOXE ====================
  {
    id: 'boxe-jab-direto',
    name: 'Combinação 1-2 (Jab & Direto de Direita)',
    category: 'artes_marciais',
    subCategory: 'Boxe',
    targetMuscles: ['Deltoides', 'Peitoral', 'Tríceps', 'Core Rotacional', 'Panturrilha'],
    difficulty: 'Iniciante',
    description: 'A combinação mais eficaz do boxe. O jab mede distância e cega a guarda; o direto entra com a rotação do quadril e peso corporal.',
    technicalTips: [
      'No Jab: estenda o braço da frente mantendo o queixo colado no ombro e a mão de trás colada no queixo.',
      'No Direto: gire o pé de trás como se apagasse uma bituca de cigarro, transferindo o torque do quadril para a mão.',
      'Recolha os golpes rapidamente para a guarda sem abaixar os cotovelos.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Punhos (torção do carpo) e manguito rotador',
      strengtheningExercise: 'Extensão e flexão de punho com halteres leves e Face Pulls para escápulas',
      preventionTip: 'Sempre faça bandagem profissional de no mínimo 4,5 metros antes de bater em sacos de pancadas para imobilizar os ossos do carpo.',
    },
  },
  {
    id: 'boxe-esquiva-pendulo',
    name: 'Pêndulo e Esquiva em U (Bob & Weave)',
    category: 'artes_marciais',
    subCategory: 'Boxe',
    targetMuscles: ['Quadríceps', 'Glúteos', 'Eretores da Espinha', 'Oblíquos'],
    difficulty: 'Intermediário',
    description: 'Esquiva evasiva para passar por baixo de cruzados adversários e contra-golpear de ângulo favorável.',
    technicalTips: [
      'Dobre os joelhos para descer o centro de gravidade, nunca dobre a cintura jogando a cabeça para o chão.',
      'Desenhe a letra U com o tronco, saindo da linha de fogo do golpe adversário com a guarda alta.',
      'Suba já carregando o golpe de contra-ataque no pé que recebe o peso.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Lombar por inclinação excessiva',
      strengtheningExercise: 'Agachamento Globet com foco em tronco vertical e ponte de glúteos',
      preventionTip: 'A esquiva é executada pelas pernas e joelhos, e não curvando a coluna lombar para a frente.',
    },
  },

  // ==================== ARTES MARCIAIS: JUDÔ ====================
  {
    id: 'judo-seoi-nage',
    name: 'Ippon Seoi Nage (Projeção por Cima do Ombro)',
    category: 'artes_marciais',
    subCategory: 'Judô',
    targetMuscles: ['Quadríceps', 'Glúteos', 'Dorsais', 'Manguito Rotador'],
    difficulty: 'Avançado',
    description: 'Uma das quedas mais consagradas do Judô: entrada explosiva girando as costas para o adversário e projetando-o sobre o ombro.',
    technicalTips: [
      'Desequilibre o adversário para a frente (Kuzushi) puxando a manga para cima como quem olha o relógio.',
      'Entre com os joelhos bem flexionados abaixo do centro de gravidade do oponente.',
      'Encaixe o cotovelo debaixo da axila do oponente e estenda as pernas para lançá-lo.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Ombro (acromioclavicular) e joelhos',
      strengtheningExercise: 'Rotações externas com elástico e agachamento búlgaro',
      preventionTip: 'Pratique exaustivamente o amortecimento de quedas (Ukemi) para dissipar a força nos tatames sem impacto direto nas clavículas.',
    },
  },

  // ==================== ESTILOS ESPORTIVOS: MUSCULAÇÃO & FORÇA ====================
  {
    id: 'musc-agachamento-livre',
    name: 'Agachamento Livre com Barra (Back Squat)',
    category: 'estilos_esportivos',
    subCategory: 'Musculação',
    targetMuscles: ['Quadríceps', 'Glúteo Máximo', 'Adutores', 'Core', 'Eretores da Espinha'],
    difficulty: 'Intermediário',
    description: 'O rei dos exercícios de membros inferiores para ganho de massa, força bruta e densidade óssea.',
    technicalTips: [
      'Pés na largura dos ombros, pontas ligeiramente voltadas para fora (15 a 30 graus).',
      'Inspire fundo na descida (Manobra de Valsalva controlada), empurrando o chão através do meio do pé e calcanhares.',
      'Desça até que a dobra do quadril passe ligeiramente a linha do joelho mantendo o peito aberto.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Lombar e tendão patelar',
      strengtheningExercise: 'Agachamento Globet com pausa embaixo e mobilidade de tornozelo contra a parede',
      preventionTip: 'Não deixe os joelhos colapsarem para dentro (valgo dinâmico); empurre ativamente os joelhos na direção dos dedos dos pés.',
    },
  },
  {
    id: 'musc-levantamento-terra',
    name: 'Levantamento Terra Convencional (Deadlift)',
    category: 'estilos_esportivos',
    subCategory: 'Musculação',
    targetMuscles: ['Isquiotibiais', 'Glúteos', 'Lombar', 'Trapézio', 'Antebraços'],
    difficulty: 'Avançado',
    description: 'Exercício primordial de puxada do solo que trabalha toda a cadeia posterior do corpo humano.',
    technicalTips: [
      'A barra deve ficar no meio do pé (cerca de 2 a 3 cm da canela na posição inicial).',
      'Trave as escápulas nos bolsos de trás ("esprema as axilas") para engajar os dorsais e proteger a coluna.',
      'O movimento é um empurrão do chão com as pernas combinado com a extensão do quadril, nunca um puxão com as costas.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Hérnia de disco ou pinçamento lombar',
      strengtheningExercise: 'Hiperextensão de lombar em 45 graus e Bird-Dog (perdigueiro)',
      preventionTip: 'Nunca inicie o movimento com a coluna arredondada; mantenha a coluna em posição neutra do cóccix à nuca.',
    },
  },
  {
    id: 'musc-supino-reto',
    name: 'Supino Reto com Barra ou Halteres',
    category: 'estilos_esportivos',
    subCategory: 'Musculação',
    targetMuscles: ['Peitoral Maior', 'Deltoide Anterior', 'Tríceps Braquial'],
    difficulty: 'Iniciante',
    description: 'Pilar dos exercícios de empurrar para desenvolvimento de força e hipertrofia torácica.',
    technicalTips: [
      'Retraia e deprima as escápulas contra o banco antes de tirar a barra do suporte.',
      'Desça a barra no terço inferior do peitoral (linha dos mamilos), com cotovelos em ângulo de 45 a 60 graus em relação ao tronco.',
      'Mantenha os pés cravados no chão criando leg drive firme.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Ombro anterior (impacto acromial) e punhos',
      strengtheningExercise: 'Rotação externa com elástico (manguito) e remada sentada com foco escapular',
      preventionTip: 'Não abra os cotovelos a 90 graus (em formato de T); isso comprime o tendão do supraespinhoso sob a clavícula.',
    },
  },

  // ==================== ESTILOS ESPORTIVOS: CALISTENIA ====================
  {
    id: 'calist-barra-fixa',
    name: 'Barra Fixa Pronada / Supinada (Pull-ups / Chin-ups)',
    category: 'estilos_esportivos',
    subCategory: 'Calistenia',
    targetMuscles: ['Grande Dorsal', 'Bíceps Braquial', 'Braquiorradial', 'Core'],
    difficulty: 'Intermediário',
    description: 'Exercício calistênico mestre para desenvolvimento de largura dorsal e força funcional de puxada.',
    technicalTips: [
      'Inicie o movimento ativando as escápulas para baixo antes de dobrar os cotovelos.',
      'Puxe a barra em direção ao topo do peitoral, sem jogar o queixo para frente para alcançar a barra.',
      'Desça controlando até a extensão quase total dos braços sem soltar completamente os ombros.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Cotovelos (epicondilite medial ou lateral)',
      strengtheningExercise: 'Pronação e supinação controlada de antebraço com halter e massagem miofascial no braquial',
      preventionTip: 'Se sentir dor nos cotovelos com a barra reta fixa, utilize argolas olímpicas que giram naturalmente com a anatomia do punho.',
    },
  },
  {
    id: 'calist-flexao-solo',
    name: 'Flexão de Braços Estrita (Push-up com Escápulas Livres)',
    category: 'estilos_esportivos',
    subCategory: 'Calistenia',
    targetMuscles: ['Peitoral', 'Tríceps', 'Serrátil Anterior', 'Core'],
    difficulty: 'Iniciante',
    description: 'Exercício de empurrar no solo que ativa o serrátil anterior, fundamental para estabilização das escápulas e proteção dos ombros.',
    technicalTips: [
      'Mantenha o corpo em uma linha reta perfeita (prancha), ativando glúteos e abdômen.',
      'Desça o peito até 2 cm do chão mantendo os cotovelos a 45 graus do corpo.',
      'No topo do movimento, empurre o chão ativamente arredondando levemente as escápulas (protração escapular).',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Punhos por hiperextensão no solo',
      strengtheningExercise: 'Alongamento de flexores do carpo e uso de apoios de flexão (manoplas) em posição neutra',
      preventionTip: 'Se os punhos doerem, faça as flexões apoiado sobre os nós dos dedos fechados (punho cerrado alinhado).',
    },
  },

  // ==================== ESTILOS ESPORTIVOS: CORRIDA & ATLETISMO ====================
  {
    id: 'corrida-tecnica-passada',
    name: 'Biomecânica de Corrida & Cadência (175-180 ppm)',
    category: 'estilos_esportivos',
    subCategory: 'Corrida & Atletismo',
    targetMuscles: ['Gastrocnêmio & Sóleo', 'Quadríceps', 'Glúteos', 'Tibial Anterior', 'Cardiovascular'],
    difficulty: 'Iniciante',
    description: 'Otimização biomecânica da passada para reduzir o impacto nas articulações dos joelhos e da coluna.',
    technicalTips: [
      'Aterrisse com o mediopé logo abaixo do seu centro de massa, evitando o "overstriding" (calcanhar muito à frente).',
      'Mantenha cadência curta e rápida em torno de 175 a 180 passos por minuto.',
      'Tronco levemente inclinado a partir dos tornozelos (não da cintura), braços a 90 graus balançando sem cruzar o tórax.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Canelite (periostite) e tendinite patelar',
      strengtheningExercise: 'Elevação de panturrilha excêntrica e fortalecimento de glúteo médio (Clamshell)',
      preventionTip: 'Não aumente volume semanal de corrida mais que 10% por semana; utilize tênis com drop adequado à sua mecânica.',
    },
  },

  // ==================== ESTILOS ESPORTIVOS: NATAÇÃO ====================
  {
    id: 'natacao-crawl-rotacao',
    name: 'Nado Crawl com Rotação Longitudinal de Tronco',
    category: 'estilos_esportivos',
    subCategory: 'Natação',
    targetMuscles: ['Grande Dorsal', 'Peitoral', 'Tríceps', 'Core', 'Deltóides'],
    difficulty: 'Intermediário',
    description: 'Estilo livre focado no deslize hidrodinâmico através do giro suave do quadril e tórax em cada braçada.',
    technicalTips: [
      'Entre com as pontas dos dedos na água alinhados com o ombro, estendendo o braço antes da puxada.',
      'Gire o tronco em 45 graus a cada puxada para recrutar a dorsal em vez de sobrecarregar o ombro.',
      'Respire lateralmente mantendo um olho na água sem levantar o pescoço para a frente.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Ombro do nadador (impacto subacromial)',
      strengtheningExercise: 'YTWL no chão para trapézio inferior e fortalecimento do serrátil anterior',
      preventionTip: 'Evite cruzar a linha média com a mão na entrada da braçada para proteger a articulação gleno-umeral.',
    },
  },

  // ==================== ESTILOS ESPORTIVOS: CICLISMO ====================
  {
    id: 'ciclismo-cadencia-postura',
    name: 'Pedalada Redonda & Ergonomia no Ciclismo (85-95 RPM)',
    category: 'estilos_esportivos',
    subCategory: 'Ciclismo',
    targetMuscles: ['Quadríceps', 'Glúteo Máximo', 'Isquiotibiais', 'Panturrilhas', 'Core'],
    difficulty: 'Iniciante',
    description: 'Técnica de tração e empuxo dos pedais (pedalada circular) reduzindo a fadiga prematura dos quadríceps.',
    technicalTips: [
      'Empurre o pedal para baixo das 12h às 5h e "raspe a lama" para trás das 5h às 7h.',
      'Mantenha os cotovelos levemente flexionados para absorver as vibrações do asfalto.',
      'Mantenha a coluna neutra e apoie a bacia nos ísquios no selim, sem arredondar a lombar.',
    ],
    painPreventionAndStrengthening: {
      commonPainArea: 'Lombar e cervical por hiperextensão do pescoço',
      strengtheningExercise: 'Alongamento de psoas, prancha ventral e descompressão de peitoral no foam roller',
      preventionTip: 'Faça um Bike Fit profissional para ajustar altura do selim, recuo e avanço do guidão.',
    },
  },
];
