import { PainGuidance } from '../types';

export const PAIN_LIBRARY: PainGuidance[] = [
  {
    id: 'lombar',
    area: 'Lombar (Coluna Baixa)',
    title: 'Desconforto ou Fadiga na Região Lombar',
    shortDescription: 'Geralmente causado por encurtamento de flexores de quadril, fraqueza no glúteo ou sobrecarga postural sentado.',
    commonCauses: [
      'Muitas horas sentado sem pausas para descompressão pélvica',
      'Falta de ativação do abdômen profundo (transverso abdominal)',
      'Execução incorreta de agachamento ou levantamento terra (arredondamento da coluna)',
      'Isquiotibiais e psoas encurtados puxando a pelve',
    ],
    immediateSteps: [
      'Compressa morna por 15 a 20 minutos para relaxar a musculatura espástica se não for inflamação aguda recente.',
      'Posição de descompressão (Decúbito dorsal com pernas a 90° sobre um sofá ou cadeira) por 10 minutos.',
      'Evite repouso absoluto prolongado na cama: movimentação suave e controlada acelera a recuperação.',
    ],
    exercisesAndStretches: [
      {
        name: 'Gato e Vaca (Cat-Cow)',
        howTo: 'Em 4 apoios, alterne arqueando a coluna para cima expirando e descendo suavemente inspirando.',
        durationOrReps: '2 séries de 10 a 12 respirações lentas',
      },
      {
        name: 'Alongamento do Psoas em Afundo',
        howTo: 'Um joelho no chão, projete a bacia levemente para frente mantendo o tronco ereto e o glúteo contraído.',
        durationOrReps: '30 a 45 segundos por lado',
      },
      {
        name: 'Ponte de Glúteos com Isometria',
        howTo: 'Deitado de barriga para cima, eleve a bacia ativando glúteos e abdômen sem hiperextender a lombar.',
        durationOrReps: '3 séries de 12 repetições com 2s no topo',
      },
      {
        name: 'Postura da Criança (Child’s Pose)',
        howTo: 'Ajoelhe-se, sente sobre os calcanhares e estenda os braços à frente no chão relaxando as costas.',
        durationOrReps: '1 minuto de respiração profunda',
      },
    ],
    contraindications: [
      'Evite abdominais tradicionais com flexão brusca de tronco (crunch rápido)',
      'Não faça levantamento terra pesado ou agachamento livre até que o desconforto reduza a nível abaixo de 3/10',
    ],
    whenToSeeDoctor: 'Dor que irradia para as pernas com formigamento, dormência ou perda de força nos pés exige avaliação médica imediata.',
  },
  {
    id: 'joelho',
    area: 'Joelho (Patela / Tendão)',
    title: 'Dor Anterior ou Lateral no Joelho',
    shortDescription: 'Frequentemente ligada a atrito da banda iliotibial, sobrecarga no tendão patelar ou desbalanceamento de quadríceps/glúteo médio.',
    commonCauses: [
      'Valgo dinâmico (joelho colapsando para dentro durante agachamentos ou corridas)',
      'Glúteo médio fraco não estabilizando o fêmur',
      'Aumento repentino no volume de corrida ou saltos sem adaptação prévia',
      'Tênis desgastado ou pisada pronada excessiva',
    ],
    immediateSteps: [
      'Gelo envolto em toalha por 15 minutos logo após treinos intensos com dor.',
      'Liberação com rolinho (foam roller) ou bola no tensor da fáscia lata e quadríceps lateral (NÃO passe o rolo diretamente sobre o osso do joelho).',
      'Reduza a amplitude de flexão do joelho em exercícios de carga para 60°-70° temporariamente.',
    ],
    exercisesAndStretches: [
      {
        name: 'Clamshell (Ostra com elástico)',
        howTo: 'Deite de lado com joelhos dobrados, pés juntos, eleve o joelho de cima sem girar o quadril para trás.',
        durationOrReps: '3 séries de 15 repetições com foco no glúteo médio',
      },
      {
        name: 'Isometria de Agachamento na Parede (Wall Sit)',
        howTo: 'Apoie as costas na parede com joelhos a 80 graus, segurando firme.',
        durationOrReps: '3 a 4 séries de 30 a 45 segundos',
      },
      {
        name: 'Alongamento de Quadríceps em Pé',
        howTo: 'Puxe o calcanhar até o glúteo mantendo os dois joelhos alinhados e o abdômen contraído.',
        durationOrReps: '30 segundos por perna',
      },
    ],
    contraindications: [
      'Evite extensora pesada nos últimos 30 graus de extensão se houver dor patelofemoral aguda',
      'Evite agachamento profundo com carga alta enquanto houver dor aguda',
    ],
    whenToSeeDoctor: 'Inchaço visível evidente, estalo audível seguido de incapacidade de apoiar peso, ou sensação de joelho "falseando".',
  },
  {
    id: 'ombro',
    area: 'Ombros & Manguito Rotador',
    title: 'Pinçamento ou Desconforto no Ombro',
    shortDescription: 'Muito comum em quem passa muito tempo no teclado com ombros protusos ou com excesso de empurrar (supinos) e pouco puxar.',
    commonCauses: [
      'Postura cifótica com escápulas instáveis e ombros caídos para frente',
      'Sobrecarga em desenvolvimentos militares ou elevações laterais sem aquecimento do manguito',
      'Falta de mobilidade na coluna torácica',
    ],
    immediateSteps: [
      'Repouso ativo: pare exercícios que causam dor no arco doloroso (entre 60° e 120° de elevação).',
      'Massagem suave com bola de tênis na região do peitoral menor e trapézio superior.',
      'Foco em aquecimento dinâmico com elástico antes de qualquer treino de membros superiores.',
    ],
    exercisesAndStretches: [
      {
        name: 'Rotação Externa de Ombro com Elástico',
        howTo: 'Cotovelo colado ao corpo a 90°, puxe o elástico girando a mão para fora mantendo o ombro baixo.',
        durationOrReps: '3 séries de 12 a 15 repetições leves',
      },
      {
        name: 'Alongamento de Peitoral na Parede ou Batente',
        howTo: 'Apoie o antebraço no batente da porta e incline o corpo suavemente para frente.',
        durationOrReps: '30 segundos cada lado',
      },
      {
        name: 'Face Pulls com Foco nas Escápulas',
        howTo: 'Puxe o elástico ou cabo na direção do nariz, rotacionando os punhos para cima e espremendo as escápulas.',
        durationOrReps: '3 séries de 15 repetições',
      },
    ],
    contraindications: [
      'Evite puxadas ou desenvolvimentos atrás da nuca (movimento biomecanicamente agressivo)',
      'Evite mergulho em barras paralelas (dips) com descida excessiva se o ombro estiver irritado',
    ],
    whenToSeeDoctor: 'Incapacidade de erguer o braço acima da cabeça, dor noturna contínua que impede o sono ou fraqueza súbita.',
  },
  {
    id: 'cervical',
    area: 'Cervical & Trapézio',
    title: 'Tensão no Pescoço e Trapézio ("Tech Neck")',
    shortDescription: 'Causada por projeção anterior da cabeça ao olhar telas de computador e celular, gerando hipertonia nos trapézios.',
    commonCauses: [
      'Monitor abaixo da linha dos olhos forçando a flexão contínua do pescoço',
      'Tensão acumulada e estresse diário descarregado na musculatura dos ombros',
      'Falta de apoio para os antebraços na mesa de trabalho',
    ],
    immediateSteps: [
      'Ajuste ergonômico imediato: suba a tela do notebook para a linha horizontal dos seus olhos.',
      'Faça pausas ativas a cada 50 minutos de trabalho para soltar o pescoço e respirar.',
      'Aplique toalha morna e faça movimentos lentos de circundução e inclinação.',
    ],
    exercisesAndStretches: [
      {
        name: 'Retração Cervical ("Queixo Duplo")',
        howTo: 'Puxe o queixo para trás sem inclinar a cabeça para baixo, como se fizesse queixo duplo, alinhando a cabeça.',
        durationOrReps: '2 séries de 10 repetições segurando 3 segundos',
      },
      {
        name: 'Alongamento de Trapézio Superior',
        howTo: 'Com a mão direita sobre a cabeça, incline a orelha direita em direção ao ombro direito sem levantar o ombro esquerdo.',
        durationOrReps: '30 segundos por lado',
      },
      {
        name: 'Mobilidade Torácica no Encosto da Cadeira',
        howTo: 'Com as mãos na nuca, apoie as costas no encosto da cadeira e estenda a parte alta do tronco para trás inspirando.',
        durationOrReps: '8 a 10 extensões controladas',
      },
    ],
    contraindications: [
      'Evite estalar bruscamente o pescoço com as mãos',
      'Não durma com travesseiro excessivamente alto que force o pescoço para frente',
    ],
    whenToSeeDoctor: 'Dor acompanhada de tontura, dor de cabeça aguda súbita, perda de sensibilidade ou choque nos braços e mãos.',
  },
  {
    id: 'punho',
    area: 'Punhos & Antebraços',
    title: 'Sensibilidade nos Punhos ou Tendinite LER',
    shortDescription: 'Geralmente fruto de digitação prolongada sem apoio, flexão excessiva em flexões de braço ou pegadas incorretas em barras.',
    commonCauses: [
      'Punhos dobrados em ângulo agudo durante uso do teclado ou mouse',
      'Carga excessiva em roscas bíceps com barra reta que forçam rotação do punho',
      'Apoio direto com palma no chão sem aquecimento ou mobilidade prévia',
    ],
    immediateSteps: [
      'Troque apoios normais por apoios em punho fechado (posição neutra) ou use manoplas de flexão.',
      'Faça massagem deslizante no antebraço do cotovelo em direção ao punho.',
      'Alongue suavemente os flexores e extensores do carpo.',
    ],
    exercisesAndStretches: [
      {
        name: 'Alongamento dos Flexores do Punho',
        howTo: 'Estenda o braço com a palma para frente e dedos para cima; com a outra mão puxe os dedos suavemente para trás.',
        durationOrReps: '30 segundos por braço',
      },
      {
        name: 'Alongamento dos Extensores do Punho',
        howTo: 'Estenda o braço com dorso da mão para frente e dedos para baixo; puxe suavemente o dorso da mão.',
        durationOrReps: '30 segundos por braço',
      },
      {
        name: 'Caminhada dos Dedos e Rotação Articular',
        howTo: 'Gire suavemente os punhos em círculos nos dois sentidos e abra/feche as mãos com vigor.',
        durationOrReps: '15 círculos cada lado + 20 aberturas de dedos',
      },
    ],
    contraindications: [
      'Evite forçar cargas com hiperextensão do punho no supino reto (mantenha o punho reto alinhado com o antebraço)',
    ],
    whenToSeeDoctor: 'Dormência persistente nos dedos polegar, indicador e médio (suspeita de síndrome do túnel do carpo grave) ou perda de força para segurar copos.',
  },
];
