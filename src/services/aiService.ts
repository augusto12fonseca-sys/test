import {
  ChatMessage,
  UserPreferences,
  Task,
  CalendarEventItem,
  WorkoutRoutine,
  AgentType,
  StudySubject,
} from '../types';
import { SPORTS_DATABASE } from '../data/sportsDatabase';
import { searchMuscleWiki, MUSCLEWIKI_DATABASE } from '../data/muscleWikiDatabase';

interface SendChatParams {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  userPreferences: UserPreferences;
  requestedAgent?: AgentType;
  context: {
    tasks: Task[];
    calendarEvents: CalendarEventItem[];
    currentWorkout?: WorkoutRoutine;
    studySubjects?: StudySubject[];
    todayStats: any;
  };
}

export const sendMessageToAI = async (params: SendChatParams): Promise<{
  reply: string;
  suggestedActions?: any[];
  learnedMemorySuggestion?: string;
  activeAgent?: AgentType;
  agentName?: string;
  delegationNote?: string;
}> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        requestedAgent: 'sistem',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        reply: data.reply,
        suggestedActions: data.suggestedActions || [],
        learnedMemorySuggestion: data.learnedMemorySuggestion,
        activeAgent: 'sistem',
        agentName: 'Sistem',
        delegationNote: data.delegationNote || 'Sistem',
      };
    }
  } catch (error) {
    console.warn('API /api/chat error, using fallback intelligent Sistem logic:', error);
  }

  // Fallback intelligent handler if server is restarting or in isolated dev
  return generateIntelligentFallbackReply(params);
};

// Direct WhatsApp chat service communicating with Sistem
export const sendWhatsAppMessageToSistem = async (
  message: string,
  userPreferences: UserPreferences,
  context?: any
): Promise<{ reply: string; timestamp: string; sender: 'sistem' }> => {
  try {
    const res = await fetch('/api/whatsapp/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        phone: userPreferences.whatsappPhone,
        userName: userPreferences.userName,
        context,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        reply: data.reply,
        timestamp: data.timestamp || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        sender: 'sistem',
      };
    }
  } catch (err) {
    console.warn('WhatsApp API offline, using fallback Sistem response', err);
  }

  // Fallback response for WhatsApp
  const matchedMw = searchMuscleWiki(message)[0];
  const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (message.toLowerCase().includes('/treino') || message.toLowerCase().includes('treino')) {
    return {
      reply: `*Sistem (WhatsApp)* 🏋️‍♂️\n\nSeu treino programado está ativo! Lembre-se de consultar os exercícios na base *MuscleWiki (musclewiki.com)* para postura perfeita.\n\n_Beba água e mantenha a cadência controlada!_ 💪`,
      timestamp: time,
      sender: 'sistem',
    };
  }

  if (message.toLowerCase().includes('/agenda') || message.toLowerCase().includes('reuni')) {
    return {
      reply: `*Sistem (WhatsApp)* 📅\n\nSua agenda do Google Calendar está sincronizada. Posso criar ou verificar seus compromissos a qualquer momento.`,
      timestamp: time,
      sender: 'sistem',
    };
  }

  if (matchedMw) {
    return {
      reply: `*Sistem (WhatsApp)* 🏋️‍♂️\n\nEncontrei na base *MuscleWiki*:\n📌 *${matchedMw.name}*\n🎯 Músculo: ${matchedMw.primaryMuscle}\n⚙️ Equipamento: ${matchedMw.equipment}\n💡 Dica de Postura: ${matchedMw.formTips[0]}\n🔗 _musclewiki.com_`,
      timestamp: time,
      sender: 'sistem',
    };
  }

  return {
    reply: `*Sistem (WhatsApp)* ✅\n\nMensagem recebida: "${message}". Estou monitorando sua rotina, tarefas, treinos do MuscleWiki e agenda do Google Calendar. Como posso agir agora?`,
    timestamp: time,
    sender: 'sistem',
  };
};

export const generateDailyFeedback = async (
  userPreferences: UserPreferences,
  tasks: Task[],
  workout?: WorkoutRoutine,
  meetingsCount: number = 0,
  waterGlasses: number = 4
): Promise<string> => {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userPreferences,
        tasks,
        workout,
        meetingsCount,
        waterGlasses,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.feedback) return data.feedback;
    }
  } catch (err) {
    console.warn('Feedback API error, using smart fallback', err);
  }

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const taskPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const workoutDone = workout?.completed;

  let review = `Fala, ${userPreferences.userName}! Aqui é o **Sistem** com o raio-X sincero do seu dia:\n\n`;

  if (workoutDone) {
    review += `🏋️‍♂️ **Treino e Biomecânica:** Você concluiu o treino de "${workout?.title}". Ponto muito positivo para a sua disciplina! ${
      workout?.feedback?.feltPain
        ? `Atenção: você relatou desconforto em ${workout?.feedback.painArea}. Não ignore! Dedique 10 minutos hoje para descompressão e consulte os alongamentos da base MuscleWiki.`
        : 'Execução firme sem queixas articulares. Continue com essa progressão de cargas controlada.'
    }\n\n`;
  } else {
    review += `🏋️‍♂️ **Treino:** Hoje você não completou o treino planejado. Sinceridade: imprevistos acontecem, mas se isso virar hábito, sua meta de ${userPreferences.fitnessGoal} vai ficar estagnada. Se faltar tempo amanhã, faça ao menos 20 minutos com exercícios do MuscleWiki!\n\n`;
  }

  review += `📋 **Tarefas & Produtividade:** Concluiu ${completedTasks} de ${totalTasks} tarefas (${taskPct}% de taxa de entrega). ${
    taskPct >= 80
      ? 'Excelente ritmo de trabalho e foco.'
      : taskPct >= 50
      ? 'Produziu bem, mas deixou tarefas pendentes. Avalie se você não colocou compromissos demais ou se perdeu tempo com distrações.'
      : 'Atenção ao acúmulo de pendências. Escolha as 2 principais para amanhã de manhã e execute logo ao acordar.'
  }\n\n`;

  review += `💧 **Hidratação:** ${waterGlasses * 250}ml de água registrados. ${
    waterGlasses >= 8 ? 'Hidratação exemplar.' : 'Precisa beber mais água para otimizar a recuperação muscular e a energia mental.'
  }\n\n`;

  review += `🎯 **Diretriz do Sistem para Amanhã:** Sem enrolação: ataque a tarefa prioritária no início do dia e garanta a mobilidade preventiva!`;

  return review;
};

// Fallback intelligent agent in client (Sistem)
function generateIntelligentFallbackReply(params: SendChatParams) {
  const lastUserMsg = params.messages[params.messages.length - 1]?.content.toLowerCase() || '';
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowIso = tomorrow.toISOString().split('T')[0];

  // Search MuscleWiki first
  const matchedMw = searchMuscleWiki(lastUserMsg)[0];
  if (matchedMw) {
    return {
      reply: `Olá! Sou o **Sistem**.\n\nLocalizei na nossa base de dados oficial **MuscleWiki (musclewiki.com)** as informações completas para **${matchedMw.name} (${matchedMw.nameEn})**:\n\n• **Músculo Alvo:** ${matchedMw.primaryMuscle}\n• **Músculos Secundários:** ${matchedMw.secondaryMuscles.join(', ')}\n• **Equipamento:** ${matchedMw.equipment} | **Dificuldade:** ${matchedMw.difficulty}\n• **Foco:** ${matchedMw.targetFocus}\n\n📋 **Passo a Passo de Execução (Padrão MuscleWiki):**\n${matchedMw.instructions.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}\n\n💡 **Dica de Postura e Biomecânica:** ${matchedMw.formTips.join(' • ')}\n⚠️ **Erro Comum a Evitar:** ${matchedMw.commonMistakes[0]}\n🔗 **Fonte Oficial:** [MuscleWiki - ${matchedMw.nameEn}](${matchedMw.muscleWikiUrl})`,
      activeAgent: 'sistem' as AgentType,
      agentName: 'Sistem',
      delegationNote: `Sistem consultou a Base de Dados MuscleWiki (${matchedMw.name}).`,
      suggestedActions: [
        {
          type: 'ADJUST_WORKOUT',
          label: `🏋️‍♂️ Adicionar ${matchedMw.name} ao Treino de Hoje`,
          payload: { exerciseName: matchedMw.name },
        },
        {
          type: 'VIEW_PAIN_GUIDE',
          label: '💆‍♂️ Ver Guia Postural & Alongamentos',
        },
      ],
    };
  }

  // Check if martial arts or sports are asked
  const matchedSport = SPORTS_DATABASE.find(
    (s) =>
      lastUserMsg.includes(s.name.toLowerCase()) ||
      lastUserMsg.includes(s.subCategory.toLowerCase()) ||
      lastUserMsg.includes('jiu-jitsu') ||
      lastUserMsg.includes('bjj') ||
      lastUserMsg.includes('muay thai') ||
      lastUserMsg.includes('boxe') ||
      lastUserMsg.includes('judô') ||
      lastUserMsg.includes('taekwondo') ||
      lastUserMsg.includes('hapkido')
  );

  if (matchedSport) {
    return {
      reply: `Sou o **Sistem**.\n\nConsultando nossa base de esportes e artes marciais sobre **${matchedSport.name} (${matchedSport.subCategory})**:\n\n• **Mecânica Principal:** ${matchedSport.description}\n• **Dica Técnica:** ${matchedSport.technicalTips[0]}\n• **Reforço Físico para Dores (${matchedSport.painPreventionAndStrengthening.commonPainArea}):** Execute *${matchedSport.painPreventionAndStrengthening.strengtheningExercise}*. Dica preventiva: ${matchedSport.painPreventionAndStrengthening.preventionTip}`,
      activeAgent: 'sistem' as AgentType,
      agentName: 'Sistem',
      delegationNote: `Sistem processou consulta esportiva (${matchedSport.subCategory}).`,
      suggestedActions: [
        {
          type: 'ADJUST_WORKOUT',
          label: `🥋 Adicionar ${matchedSport.name} ao Treino`,
          payload: { exerciseName: matchedSport.name },
        },
      ],
    };
  }

  // Scheduling meeting
  if (
    lastUserMsg.includes('reuni') ||
    lastUserMsg.includes('agendar') ||
    lastUserMsg.includes('marcar') ||
    lastUserMsg.includes('google calendar') ||
    lastUserMsg.includes('agenda')
  ) {
    return {
      reply: `Com certeza! Sou o **Sistem**. Posso agendar essa reunião diretamente no seu Google Calendar e sincronizar um lembrete automático no seu WhatsApp.`,
      activeAgent: 'sistem' as AgentType,
      agentName: 'Sistem',
      delegationNote: 'Sistem orquestrou agendamento no Google Calendar.',
      suggestedActions: [
        {
          type: 'SCHEDULE_MEETING',
          label: '📅 Confirmar e Agendar no Google Calendar',
          payload: {
            summary: 'Reunião de Alinhamento e Estratégia',
            description: 'Agendado automaticamente pelo Sistem.',
            startDateTime: `${tomorrowIso}T14:00:00`,
            endDateTime: `${tomorrowIso}T14:45:00`,
            location: 'Google Meet',
            attendeesEmails: [params.userPreferences.whatsappPhone],
          },
        },
      ],
    };
  }

  // Adding task
  if (
    lastUserMsg.includes('tarefa') ||
    lastUserMsg.includes('fazer') ||
    lastUserMsg.includes('lembrete') ||
    lastUserMsg.includes('prioridade')
  ) {
    return {
      reply: `Perfeito! Como **Sistem**, organizei essa tarefa prioritária com opção de envio automático de lembrete no seu WhatsApp para garantir que nada passe despercebido.`,
      activeAgent: 'sistem' as AgentType,
      agentName: 'Sistem',
      delegationNote: 'Sistem registrou nova tarefa.',
      suggestedActions: [
        {
          type: 'CREATE_TASK',
          label: '✅ Salvar Nova Tarefa',
          payload: {
            title: 'Executar prioridade definida com o Sistem',
            category: 'trabalho',
            priority: 'alta',
            dueDate: tomorrowIso,
            reminderWhatsApp: true,
          },
        },
      ],
    };
  }

  // General Sistem response
  return {
    reply: `Olá, ${params.userPreferences.userName}! Eu sou o **Sistem**, seu agente inteligente pessoal.\n\nEstou conectado com:\n• 🏋️‍♂️ **Base de Dados MuscleWiki (musclewiki.com):** Anatomia muscular, instruções passo a passo, biomecânica e exercícios com barra, halteres, peso corporal e máquinas.\n• 🥋 **Base de Esportes & Artes Marciais:** Taekwondo, Hapkido, Jiu-Jitsu, Muay Thai, Boxe e prevenção de lesões.\n• 📅 **Google Calendar & Tarefas:** Sincronização em tempo real de reuniões e metas diárias.\n• 💬 **WhatsApp:** Conversas diretas e disparos automáticos de lembretes.\n• 🎓 **Tutor Multidisciplinar:** Aulas e resumos de qualquer matéria que você quiser aprender.\n\nComo posso te orientar agora?`,
    activeAgent: 'sistem' as AgentType,
    agentName: 'Sistem',
    delegationNote: 'Sistem pronto para atuar em todas as frentes.',
    suggestedActions: [
      {
        type: 'ADJUST_WORKOUT',
        label: '🏋️‍♂️ Explorar Base de Exercícios MuscleWiki',
      },
      {
        type: 'SCHEDULE_MEETING',
        label: '📅 Agendar Reunião no Calendar',
      },
      {
        type: 'SEND_WHATSAPP',
        label: '💬 Conversar pelo WhatsApp',
      },
    ],
  };
}
