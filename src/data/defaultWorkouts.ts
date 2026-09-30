import { WorkoutRoutine } from '../types';

export const INITIAL_WORKOUTS: WorkoutRoutine[] = [
  {
    id: 'w-segunda',
    title: 'Superiores: Peito, Costas & Ombros',
    focus: 'Força Funcional & Postura',
    dayOfWeek: 'Segunda-feira',
    difficulty: 'Intermediário',
    durationMinutes: 45,
    completed: false,
    exercises: [
      {
        id: 'e1',
        name: 'Face Pulls na Polia ou com Elástico',
        sets: 3,
        reps: '15 reps',
        targetMuscle: 'Deltoide Posterior & Manguito Rotador',
        notes: 'Foque na rotação externa e ativação escapular',
        completed: false,
        equipment: 'Cabos / Elástico',
        instructions: [
          'Fixe o elástico ou polia na altura dos olhos e segure as pontas com pegada neutra.',
          'Dê dois passos para trás para criar tensão inicial com os braços estendidos.',
          'Puxe em direção à linha dos olhos, abrindo as mãos e elevando os cotovelos para trás.',
          'No final da puxada, faça a rotação externa levando os polegares para trás das orelhas.'
        ],
        formTips: [
          'Excelente para neutralizar a postura corcunda do computador.',
          'Pense em encostar as escápulas uma na outra no pico da contração.'
        ],
        commonMistakes: [
          'Puxar para a barriga ou peito em vez de puxar para a testa/olhos.',
          'Projetar o pescoço para a frente para encontrar a corda.'
        ],
        muscleWikiUrl: 'https://musclewiki.com/cables/shoulders/face-pull'
      },
      {
        id: 'e2',
        name: 'Supino Reto com Halteres',
        sets: 4,
        reps: '10 a 12 reps',
        weight: '16kg / mão',
        targetMuscle: 'Peitoral Maior & Tríceps',
        notes: 'Desça controlando em 3 segundos, mantendo punhos alinhados',
        completed: false,
        equipment: 'Halteres',
        instructions: [
          'Deite-se no banco plano com os pés firmes no chão e escápulas aduzidas contra o encosto.',
          'Posicione os halteres acima do peitoral com os braços estendidos e palmas voltadas para a frente.',
          'Inspire e desça os halteres em arco controlado até a linha média do peito, mantendo cotovelos a ~60° do tronco.',
          'Empurre os halteres para cima expirando com força até a extensão controlada dos cotovelos.'
        ],
        formTips: [
          'Mantenha os cotovelos em ângulo de flecha (45° a 75°), nunca abertos em 90° retos.',
          'Aproveite a amplitude maior dos halteres para alongar o peitoral na parte inferior.'
        ],
        commonMistakes: [
          'Bater os halteres com força no topo perdendo a tensão muscular.',
          'Deixar a coluna lombar arquear desordenadamente tirando o quadril do banco.'
        ],
        muscleWikiUrl: 'https://musclewiki.com/dumbbells/chest/dumbbell-bench-press'
      },
      {
        id: 'e3',
        name: 'Remada Curvada com Halteres (Pegada Neutra)',
        sets: 4,
        reps: '10 a 12 reps',
        weight: '16kg / mão',
        targetMuscle: 'Dorsais, Romboides & Trapézio Médio',
        notes: 'Coluna travada, aperte as costas no topo do movimento',
        completed: false,
        equipment: 'Halteres',
        instructions: [
          'Fique em pé com os pés na largura do quadril, segurando um halter em cada mão com pegada neutra.',
          'Flexione levemente os joelhos e empurre o quadril para trás inclinando o tronco a ~45° com as costas perfeitamente retas.',
          'Puxe os halteres em direção à cintura/bolsos de trás, puxando pelos cotovelos.',
          'Aperte as escápulas por 1 segundo no ponto mais alto e desça controladamente até estender os braços.'
        ],
        formTips: [
          'Puxe com os cotovelos e dorsais, não apenas dobrando os bíceps.',
          'Mantenha o pescoço neutro olhando para o chão 1 metro à frente.'
        ],
        commonMistakes: [
          'Curvar a coluna lombar criando tensão lesiva nos discos.',
          'Dar tranco com as pernas a cada repetição.'
        ],
        muscleWikiUrl: 'https://musclewiki.com/dumbbells/back/bent-over-row'
      },
      {
        id: 'e4',
        name: 'Desenvolvimento com Halteres Sentado',
        sets: 3,
        reps: '12 reps',
        weight: '12kg / mão',
        targetMuscle: 'Deltoides (Anterior e Lateral)',
        notes: 'Cotovelos levemente apontados à frente (plano escapular)',
        completed: false,
        equipment: 'Halteres',
        instructions: [
          'Sente-se no banco com o encosto a 80° ou 90°, apoiando firmemente as costas e pés no chão.',
          'Erga os halteres até a altura das orelhas, com os cotovelos apontando levemente para frente (plano escapular).',
          'Pressione os halteres para cima em linha vertical até estender os braços sobre a cabeça.',
          'Desça de forma controlada em 2 segundos até a altura do queixo/orelhas.'
        ],
        formTips: [
          'Não deixe os cotovelos abrirem totalmente para os lados para proteger o manguito rotador.',
          'Aperte o abdômen contra o banco para não sobrecarregar a lombar.'
        ],
        commonMistakes: [
          'Hiperestender o pescoço e a lombar para empurrar o peso.',
          'Bater os halteres no topo.'
        ],
        muscleWikiUrl: 'https://musclewiki.com/dumbbells/shoulders/seated-overhead-press'
      },
      {
        id: 'e5',
        name: 'Prancha Abdominal Isométrica',
        sets: 3,
        reps: '45 segundos',
        targetMuscle: 'Core, Transverso do Abdômen & Lombar',
        notes: 'Glúteo firme e abdômen puxado para dentro',
        completed: false,
        equipment: 'Peso Corporal',
        instructions: [
          'Apoie os antebraços no chão na largura dos ombros, cotovelos alinhados sob as articulações dos ombros.',
          'Estenda as pernas para trás apoiando-se na ponta dos pés, formando uma linha reta dos calcanhares ao pescoço.',
          'Contraia fortemente os glúteos e puxe o umbigo em direção à coluna para criar uma cinta abdominal rígida.',
          'Mantenha a postura imóvel respirando ritmadamente pelo nariz durante os 45 segundos.'
        ],
        formTips: [
          'Empurre o chão com os antebraços para afastar levemente as escápulas.',
          'Se a lombar começar a ceder ou doer, descanse 10 segundos antes de continuar.'
        ],
        commonMistakes: [
          'Deixar o quadril cair em direção ao chão.',
          'Elevar o quadril em formato de triângulo reduzindo a carga no abdômen.'
        ],
        muscleWikiUrl: 'https://musclewiki.com/bodyweight/abs/plank'
      },
    ],
  },
  {
    id: 'w-terca',
    title: 'Inferiores: Quadríceps, Glúteos & Panturrilhas',
    focus: 'Potência & Estabilidade Pélvica',
    dayOfWeek: 'Terça-feira',
    difficulty: 'Intermediário',
    durationMinutes: 50,
    completed: false,
    exercises: [
      {
        id: 'e6',
        name: 'Mobilidade de Tornozelo e Quadril em 90/90',
        sets: 2,
        reps: '10 transições',
        targetMuscle: 'Articulações do Quadril & Tornozelo',
        notes: 'Essencial para liberar a pelve e proteger joelhos e lombar',
        completed: false,
        equipment: 'Peso Corporal',
        instructions: [
          'Sente-se no solo com uma perna flexionada a 90° à frente e a outra a 90° para trás.',
          'Mantenha o tronco ereto e incline-se suavemente sobre a perna dianteira por 5 segundos.',
          'Transicione os joelhos para o lado oposto sem tirar os calcanhares do chão, abrindo a cápsula do quadril.'
        ],
        formTips: ['Mantenha a coluna ereta durante as transições.'],
        commonMistakes: ['Forçar a rotação se houver dor no menisco.'],
        muscleWikiUrl: 'https://musclewiki.com/stretches/hips/90-90-hip-mobility'
      },
      {
        id: 'e7',
        name: 'Agachamento Goblet com Halter no Peito',
        sets: 4,
        reps: '10 a 12 reps',
        weight: '18kg',
        targetMuscle: 'Quadríceps, Glúteos & Core',
        notes: 'Mantenha os calcanhares colados no chão e joelhos na direção dos dedos',
        completed: false,
        equipment: 'Halteres / Kettlebell',
        instructions: [
          'Segure um halter pesado na vertical junto ao peito, apoiando a parte superior nas palmas das mãos.',
          'Posicione os pés na largura dos ombros com os dedos apontando 15° a 25° para fora.',
          'Inspire inflando o abdômen e inicie a descida empurrando o quadril para trás e abrindo os joelhos para fora.',
          'Desça até que os cotovelos toquem a parte interna das coxas/joelhos (profundidade completa).',
          'Empurre o chão com o meio dos pés e calcanhares para retornar à posição ereta.'
        ],
        formTips: [
          'O peso no peito serve como contrapeso que ensina a coluna a ficar reta naturalmente.',
          'Nunca deixe os joelhos desabarem para dentro durante a subida.'
        ],
        commonMistakes: [
          'Tirar os calcanhares do chão.',
          'Inclinar o tronco excessivamente para frente soltando o halter do peito.'
        ],
        muscleWikiUrl: 'https://musclewiki.com/dumbbells/quads/goblet-squat'
      },
      {
        id: 'e8',
        name: 'RDL / Stiff com Halteres',
        sets: 4,
        reps: '10 reps',
        weight: '16kg / mão',
        targetMuscle: 'Isquiotibiais (Posterior de Coxa) & Glúteos',
        notes: 'Empurre o quadril para trás, coluna em neutro absoluto',
        completed: false,
        equipment: 'Halteres',
        instructions: [
          'Fique em pé com os pés na largura do quadril, segurando os halteres na frente das coxas.',
          'Mantenha uma leve flexão nos joelhos (cerca de 15°) e congele essa angulação.',
          'Inicie o movimento empurrando o quadril para trás como se fosse fechar uma porta com o glúteo.',
          'Desça os halteres rente às pernas até sentir um alongamento potente na parte de trás das coxas.',
          'Contraia os glúteos e posteriores para puxar o quadril de volta para frente.'
        ],
        formTips: [
          'O movimento é de dobradiça de quadril (hip hinge), não de agachamento.',
          'Mantenha os ombros para trás e peito estufado o tempo todo.'
        ],
        commonMistakes: [
          'Arredondar a coluna lombar tentando descer os halteres até o chão.',
          'Dobrar demais os joelhos perdendo a tensão nos isquiotibiais.'
        ],
        muscleWikiUrl: 'https://musclewiki.com/dumbbells/hamstrings/romanian-deadlift'
      },
      {
        id: 'e9',
        name: 'Elevação Pélvica Unilateral (Ponte de Glúteo)',
        sets: 3,
        reps: '12 reps por perna',
        targetMuscle: 'Glúteo Máximo & Estabilizadores Pélvicos',
        notes: 'Excelente para prevenir dores na lombar e ativar os glúteos',
        completed: false,
        equipment: 'Peso Corporal',
        instructions: [
          'Deite-se de costas com os joelhos dobrados e os pés apoiados no chão a 90°.',
          'Estenda uma das pernas no ar alinhada à coxa oposta.',
          'Empurre o calcanhar do pé apoiado contra o solo elevando o quadril até alinhar coxa e tronco.',
          'Aperte o glúteo no topo por 1 a 2 segundos e retorne suavemente sem tocar o chão.'
        ],
        formTips: ['Concentre a força estritamente no calcanhar para ativar o glúteo máximo.'],
        commonMistakes: ['Arquear a lombar em vez de contrair a musculatura glútea.'],
        muscleWikiUrl: 'https://musclewiki.com/bodyweight/glutes/single-leg-glute-bridge'
      },
      {
        id: 'e10',
        name: 'Elevação de Panturrilhas em Degrau',
        sets: 4,
        reps: '15 reps lentas',
        targetMuscle: 'Gastrocnêmio & Sóleo (Panturrilhas)',
        notes: 'Segure 2s no topo e 2s no alongamento embaixo',
        completed: false,
        equipment: 'Peso Corporal / Degrau',
        instructions: [
          'Apoie a bola dos pés na borda de um degrau com os calcanhares livres no ar.',
          'Abaixe os calcanhares ao máximo sentindo o alongamento da fáscia por 2 segundos.',
          'Suba na ponta dos pés com máxima amplitude empurrando pelo dedão.',
          'Segure a contração máxima no ponto mais alto por 2 segundos antes de descer.'
        ],
        formTips: ['A pausa no ponto inferior desativa o reflexo elástico do tendão de Aquiles, forçando o músculo.'],
        commonMistakes: ['Quicar rapidamente sem controle nem amplitude.'],
        muscleWikiUrl: 'https://musclewiki.com/bodyweight/calves/calf-raise'
      },
    ],
  },
  {
    id: 'w-quarta',
    title: 'Recuperação Ativa & Mobilidade Descompressiva',
    focus: 'Saúde Articular, Postura & Alívio de Tensão',
    dayOfWeek: 'Quarta-feira',
    difficulty: 'Iniciante',
    durationMinutes: 30,
    completed: false,
    exercises: [
      {
        id: 'e11',
        name: 'Caminhada Rápida ao Ar Livre ou Esteira',
        sets: 1,
        reps: '15 a 20 min',
        targetMuscle: 'Sistema Cardiorrespiratório & Oxigenação',
        notes: 'Ritmo conversacional (RPE 4-5/10), oxigenando os tecidos',
        completed: false,
        equipment: 'Peso Corporal',
        instructions: [
          'Mantenha passos firmes e postura ereta, balançando os braços com naturalidade.',
          'Respiração nasal profunda para promover relaxamento do sistema nervoso simpático.'
        ],
        formTips: ['Excelente para eliminar o lactato residual e acelerar a recuperação muscular.'],
        commonMistakes: ['Andar em postura curvada olhando para a tela do celular.'],
        muscleWikiUrl: 'https://musclewiki.com/cardio/walking'
      },
      {
        id: 'e12',
        name: 'Circuito Descompressivo: Cat-Cow + Child’s Pose',
        sets: 3,
        reps: '10 respirações cada',
        targetMuscle: 'Coluna Vertebral, Eretores & Fáscia Toracolombar',
        notes: 'Alivia instantaneamente o estresse das reuniões sentado',
        completed: false,
        equipment: 'Peso Corporal',
        instructions: [
          'Em posição de 4 apoios, inspire arqueando as costas para baixo e olhando para cima (Cow).',
          'Expire curvando a coluna para cima como um gato assustado (Cat), puxando o umbigo para dentro.',
          'Após 10 ciclos, empurre o quadril sobre os calcanhares estendendo os braços à frente (Child’s Pose).'
        ],
        formTips: ['Movimente vértebra por vértebra de forma fluida e consciente.'],
        commonMistakes: ['Movimentos bruscos sem acompanhar o ritmo da respiração.'],
        muscleWikiUrl: 'https://musclewiki.com/stretches/back/cat-cow-stretch'
      },
      {
        id: 'e13',
        name: 'Alongamento em Afundo de Flexores de Quadril',
        sets: 3,
        reps: '45 segundos cada perna',
        targetMuscle: 'Psoas, Ilíaco & Reto Femoral',
        notes: 'Puxe o ar fundo e solte relaxando a bacia para frente',
        completed: false,
        equipment: 'Peso Corporal',
        instructions: [
          'Dê um passo à frente apoiando o joelho de trás no solo (posição de cavaleiro).',
          'Contraia o glúteo da perna de trás e projete o quadril suavemente para frente.',
          'Eleve o braço do mesmo lado da perna traseira inclinando-se levemente para o lado oposto para intensificar o psoas.'
        ],
        formTips: ['Não compense arqueando a lombar; a inclinação deve vir estritamente da pelve.'],
        commonMistakes: ['Forçar o joelho dianteiro além dos dedos do pé sem suporte.'],
        muscleWikiUrl: 'https://musclewiki.com/stretches/hips/kneeling-hip-flexor-stretch'
      },
    ],
  },
  {
    id: 'w-quinta',
    title: 'Condicionamento Metabólico & Core Rotacional',
    focus: 'Queima Calórica & Resistência',
    dayOfWeek: 'Quinta-feira',
    difficulty: 'Intermediário',
    durationMinutes: 40,
    completed: false,
    exercises: [
      {
        id: 'e14',
        name: 'Kettlebell Swing ou Halter Swing',
        sets: 4,
        reps: '15 reps',
        weight: '14kg',
        targetMuscle: 'Glúteos, Isquiotibiais & Core',
        notes: 'Potência vem do quadril, não levante com os braços',
        completed: false,
        equipment: 'Kettlebell / Halteres',
        instructions: [
          'Fique em pé com os pés na largura dos ombros, segurando o peso com as duas mãos.',
          'Flexione levemente os joelhos e empurre o quadril para trás como uma mola carregada.',
          'Exploda o quadril para frente contraindo os glúteos, projetando o peso na altura do peito pelo impulso dos quadris.',
          'Deixe o peso voltar entre as pernas de forma suave repetindo o ciclo.'
        ],
        formTips: [
          'Os braços agem apenas como cordas; toda a força propulsora vem dos glúteos e quadris.',
          'Mantenha as costas retas e o core travado.'
        ],
        commonMistakes: [
          'Agachar em vez de fazer dobradiça de quadril.',
          'Puxar o peso para cima com os ombros.'
        ],
        muscleWikiUrl: 'https://musclewiki.com/kettlebells/hamstrings/kettlebell-swing'
      },
      {
        id: 'e15',
        name: 'Flexão de Braço no Solo (Push-ups)',
        sets: 4,
        reps: '10 a 15 reps',
        targetMuscle: 'Peitoral Maior, Tríceps & Serrátil',
        notes: 'Pode apoiar joelhos se fadigar na última série',
        completed: false,
        equipment: 'Peso Corporal',
        instructions: [
          'Apoie as mãos no solo ligeiramente mais abertas que os ombros, pés juntos atrás.',
          'Mantenha o corpo como uma prancha rígida e desça dobrando os cotovelos a 45° do corpo.',
          'Desça até o peito quase tocar o chão e empurre com potência de volta ao topo.'
        ],
        formTips: ['Aperte as nádegas e o abdômen para que o quadril não caia.'],
        commonMistakes: ['Abrir os cotovelos em ângulo de 90° forçando a cápsula articular anterior do ombro.'],
        muscleWikiUrl: 'https://musclewiki.com/bodyweight/chest/push-up'
      },
      {
        id: 'e16',
        name: 'Passada com Halteres (Walking Lunge)',
        sets: 3,
        reps: '20 passos no total',
        weight: '8kg / mão',
        targetMuscle: 'Quadríceps, Glúteos & Estabilidade',
        notes: 'Passos largos para manter o joelho alinhado',
        completed: false,
        equipment: 'Halteres',
        instructions: [
          'Segure os halteres ao lado do corpo e dê um passo largo à frente.',
          'Desça o joelho de trás até que quase toque o chão, mantendo a coxa dianteira paralela ao solo.',
          'Empurre com o calcanhar da perna da frente dando o próximo passo contínuo.'
        ],
        formTips: ['Mantenha o tronco firme e olhar reto à frente para equilíbrio.'],
        commonMistakes: ['Dar passos muito curtos sobrecarregando o tendão patelar.'],
        muscleWikiUrl: 'https://musclewiki.com/dumbbells/quads/walking-lunge'
      },
      {
        id: 'e17',
        name: 'Pallof Press com Elástico ou Cabo',
        sets: 3,
        reps: '12 reps cada lado',
        targetMuscle: 'Anti-rotação, Oblíquos & Core Profundo',
        notes: 'Resista ao giro do tronco mantendo a postura firme',
        completed: false,
        equipment: 'Cabos / Elástico',
        instructions: [
          'Fique de lado para a polia ou elástico, segurando a manopla contra o esterno com as duas mãos.',
          'Pés na largura dos ombros, joelhos destravados e abdômen contraído.',
          'Estenda os braços em linha reta para a frente, resistindo à força rotacional que tenta girar seu tronco.',
          'Segure 2 segundos no ponto mais distante e retorne devagar ao peito.'
        ],
        formTips: ['O objetivo do exercício é NÃO se mover: anti-rotação pura para blindagem da lombar.'],
        commonMistakes: ['Girar os ombros ou o quadril cedendo à tensão do elástico.'],
        muscleWikiUrl: 'https://musclewiki.com/cables/abs/pallof-press'
      },
    ],
  },
  {
    id: 'w-sexta',
    title: 'Full Body Integrado & Desafio Semanal',
    focus: 'Força Global & Resistência Muscular',
    dayOfWeek: 'Sexta-feira',
    difficulty: 'Intermediário',
    durationMinutes: 45,
    completed: false,
    exercises: [
      {
        id: 'e18',
        name: 'Agachamento com Salto Leve ou Box Squat',
        sets: 3,
        reps: '10 reps explosivas',
        targetMuscle: 'Pernas, Quadríceps & Potência',
        notes: 'Aterrisse suavemente na ponta dos pés absorvendo o impacto',
        completed: false,
        equipment: 'Peso Corporal / Caixa',
        instructions: [
          'Posicione os pés na largura dos ombros e desça em um agachamento controlado.',
          'Ao atingir 90°, empurre o chão com máxima explosão saltando suavemente para cima.',
          'Aterrisse absorvendo o impacto com a ponta dos pés e flexionando os joelhos em sequência.'
        ],
        formTips: ['Priorize uma aterrissagem silenciosa como um felino para proteger meniscos.'],
        commonMistakes: ['Aterrisse com os joelhos esticados e rígidos.'],
        muscleWikiUrl: 'https://musclewiki.com/bodyweight/quads/jump-squat'
      },
      {
        id: 'e19',
        name: 'Puxada Aberta na Polia (Lat Pulldown)',
        sets: 4,
        reps: '8 a 10 reps',
        targetMuscle: 'Grande Dorsal, Bíceps & Trapézio Inferior',
        notes: 'Traga a barra ao peito com o peito estufado',
        completed: false,
        equipment: 'Cabos / Máquina',
        instructions: [
          'Sente-se no aparelho e trave as coxas sob o apoio.',
          'Segure a barra larga com as palmas voltadas para a frente.',
          'Incline o tronco 15° para trás, estufe o peito e puxe a barra até a clavícula/peito superior.',
          'Aperte as dorsais no ponto inferior e retorne lentamente controlando a subida.'
        ],
        formTips: ['Puxe levando os cotovelos para baixo e para os lados, não para trás.'],
        commonMistakes: ['Jogar o tronco para trás em 45° usando impulso do corpo.'],
        muscleWikiUrl: 'https://musclewiki.com/cables/back/lat-pulldown'
      },
      {
        id: 'e20',
        name: 'Mergulho em Banco para Tríceps (Bench Dips)',
        sets: 3,
        reps: '12 a 15 reps',
        targetMuscle: 'Tríceps Braquial & Deltoide Anterior',
        notes: 'Mantenha as costas rente ao banco',
        completed: false,
        equipment: 'Peso Corporal / Banco',
        instructions: [
          'Apoie as mãos na borda de um banco plano ao lado dos quadris, dedos apontados para a frente.',
          'Estenda as pernas para frente mantendo os calcanhares no solo.',
          'Desça o quadril flexionando os cotovelos para trás até formar 90 graus.',
          'Empurre o banco para baixo com força estendendo os cotovelos de volta ao topo.'
        ],
        formTips: ['Mantenha as costas coladas ao banco para não sobrecarregar os ombros.'],
        commonMistakes: ['Afastar o quadril do banco projetando os ombros para frente em rotação interna excessiva.'],
        muscleWikiUrl: 'https://musclewiki.com/bodyweight/triceps/bench-dip'
      },
      {
        id: 'e21',
        name: 'Dead Bug (Bichinho Morto) no Solo',
        sets: 3,
        reps: '10 repetições alternadas lentas',
        targetMuscle: 'Coordenação, Reto Abdominal & Estabilidade Lombar',
        notes: 'Lombar sempre colada contra o chão durante todo o movimento',
        completed: false,
        equipment: 'Peso Corporal',
        instructions: [
          'Deite-se de costas com os braços apontados para o teto e joelhos flexionados a 90° no ar.',
          'Cole a região lombar firmemente no solo (retroversão pélvica).',
          'Estenda simultaneamente o braço direito para trás da cabeça e a perna esquerda para frente rente ao chão.',
          'Retorne ao centro e alterne o lado oposto sem descolar a lombar do chão.'
        ],
        formTips: ['A qualidade do exercício depende 100% da lombar não sair do solo nem um milímetro.'],
        commonMistakes: ['Arquear a lombar criando espaço entre as costas e o chão.'],
        muscleWikiUrl: 'https://musclewiki.com/bodyweight/abs/dead-bug'
      },
    ],
  },
];
