import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Dumbbell,
  ArrowRight,
  BrainCircuit,
  Plus,
  GraduationCap,
  Shield,
  Layers,
  Database,
  Activity,
} from 'lucide-react';
import {
  ChatMessage,
  UserPreferences,
  Task,
  CalendarEventItem,
  WorkoutRoutine,
  AgentType,
  StudySubject,
} from '../types';
import { sendMessageToAI } from '../services/aiService';
import { addLearnedMemory } from '../services/userPreferences';
import { openWhatsApp, buildMeetingWhatsAppMsg } from '../services/whatsappService';

interface ChatAssistantProps {
  preferences: UserPreferences;
  onUpdatePreferences: (newPrefs: UserPreferences) => void;
  tasks: Task[];
  onAddTask: (task: Partial<Task>) => void;
  calendarEvents: CalendarEventItem[];
  onAddCalendarEvent: (eventData: any) => Promise<any>;
  currentWorkout?: WorkoutRoutine;
  studySubjects?: StudySubject[];
  onNavigateTab: (tab: string, extraData?: any) => void;
  onAdjustWorkout: (painArea?: string) => void;
  isGoogleConnected: boolean;
  initialPrompt?: string;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  preferences,
  onUpdatePreferences,
  tasks,
  onAddTask,
  calendarEvents,
  onAddCalendarEvent,
  currentWorkout,
  studySubjects = [],
  onNavigateTab,
  onAdjustWorkout,
  isGoogleConnected,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      agentType: 'sistem',
      agentName: 'Sistem | Agente Principal',
      delegationNote: 'Conectado às bases MuscleWiki, Esportes, Google Calendar e WhatsApp.',
      content: `Olá, ${preferences.userName}! Eu sou o **Sistem**, seu agente inteligente principal.\n\nEstou operando com integração completa aos seus dados e bases de referência:\n\n• 🏋️‍♂️ **Base de Dados MuscleWiki (musclewiki.com):** Anatomia muscular, instruções passo a passo para cada exercício, biomecânica e correção de erros posturais.\n• 🥋 **Base de Esportes & Artes Marciais:** Taekwondo, Hapkido, Jiu-Jitsu, Muay Thai, Boxe e reforço articular para alívio de dores.\n• 📅 **Google Calendar:** Agendamento, conferência e sincronização de reuniões.\n• 🎯 **Gestão de Tarefas & Produtividade:** Acompanhamento de metas e prazos com disparo de alertas.\n• 💬 **WhatsApp:** Conversas em tempo real e automação de lembretes.\n• 🎓 **Tutor Acadêmico:** Ensino estruturado para qualquer disciplina ou assunto que você desejar aprender.\n\nComo posso te orientar agora?`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        {
          type: 'ADJUST_WORKOUT',
          label: '🏋️‍♂️ Consultar Exercícios no MuscleWiki',
        },
        {
          type: 'SCHEDULE_MEETING',
          label: '📅 Agendar Reunião no Calendar',
          payload: { summary: 'Alinhamento Estratégico', startDateTime: new Date(Date.now() + 86400000).toISOString() },
        },
        {
          type: 'SEND_WHATSAPP',
          label: '💬 Conversar pelo WhatsApp',
        },
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendMessageToAI({
        messages: history,
        userPreferences: preferences,
        requestedAgent: 'sistem',
        context: {
          tasks,
          calendarEvents,
          currentWorkout,
          studySubjects,
          todayStats: {
            tasksDone: tasks.filter((t) => t.completed).length,
            totalTasks: tasks.length,
          },
        },
      });

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        agentType: 'sistem',
        agentName: 'Sistem',
        delegationNote: res.delegationNote || 'Sistem',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: res.suggestedActions,
        learnedMemorySuggestion: res.learnedMemorySuggestion,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          role: 'assistant',
          agentType: 'sistem',
          agentName: 'Sistem',
          content: 'Estou com uma breve oscilação na conexão, mas estou aqui com você. Como posso te orientar agora?',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = async (msgId: string, action: any) => {
    try {
      if (action.type === 'SCHEDULE_MEETING') {
        const payload = action.payload || {};
        const summary = payload.summary || 'Nova Reunião';
        const start = payload.startDateTime || new Date(Date.now() + 3600000).toISOString();
        const end = payload.endDateTime || new Date(new Date(start).getTime() + 45 * 60000).toISOString();

        await onAddCalendarEvent({
          summary,
          description: payload.description || 'Agendado pelo Sistem',
          startDateTime: start,
          endDateTime: end,
          location: payload.location || 'Google Meet',
          attendeesEmails: payload.attendeesEmails || [preferences.whatsappPhone],
        });

        setActionNotice(`Reunião "${summary}" agendada com sucesso pelo Sistem!`);
      } else if (action.type === 'CREATE_TASK') {
        const payload = action.payload || {};
        onAddTask({
          title: payload.title || 'Nova tarefa prioritária',
          category: payload.category || 'trabalho',
          priority: payload.priority || 'alta',
          dueDate: payload.dueDate || new Date().toISOString().split('T')[0],
          reminderWhatsApp: !!payload.reminderWhatsApp,
        });

        setActionNotice(`Tarefa "${payload.title || 'Nova tarefa'}" criada com sucesso!`);
      } else if (action.type === 'SEND_WHATSAPP') {
        onNavigateTab('whatsapp');
      } else if (action.type === 'VIEW_PAIN_GUIDE') {
        onNavigateTab('esportes');
      } else if (action.type === 'ADJUST_WORKOUT') {
        onNavigateTab('esportes');
      } else if (action.type === 'EXPLAIN_TOPIC') {
        onNavigateTab('professor');
      } else if (action.type === 'EXPORT_REPORT') {
        onNavigateTab('progress');
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, appliedAction: action.label } : m))
      );

      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      console.error('Error executing action', err);
      setActionNotice(`Erro ao executar ação: ${err.message || 'Verifique sua conexão'}`);
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  const handleSaveMemory = (msgId: string, memoryText: string) => {
    const updated = addLearnedMemory(memoryText);
    onUpdatePreferences(updated);
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, learnedMemorySuggestion: undefined } : m))
    );
    setActionNotice('Nova preferência salva na memória do Sistem!');
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto p-2 sm:p-4">
      {/* Toast Alert */}
      {actionNotice && (
        <div className="mb-2 p-3 rounded-xl bg-emerald-500 text-white font-medium text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-white/80 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Principal Agent Header (Sub-agents hidden) */}
      <div className="mb-2.5 p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                Sistem
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Agente Principal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Operando com base MuscleWiki (musclewiki.com), Google Calendar, WhatsApp e Treinos.
            </p>
          </div>
        </div>

        {/* Database badges */}
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 font-medium">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>MuscleWiki</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 font-medium">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <span>Agenda & Tarefas</span>
          </span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 rounded-2xl p-3 sm:p-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-sm ${
                  isUser
                    ? 'bg-blue-600 shadow-blue-500/20'
                    : 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 shadow-emerald-500/20'
                }`}
              >
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Content */}
              <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                {/* Agent Header Tag */}
                {!isUser && (
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md font-bold border bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900">
                      Sistem
                    </span>
                    {msg.delegationNote && (
                      <span className="text-[10px] text-slate-400 italic hidden sm:inline truncate max-w-sm">
                        {msg.delegationNote}
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  <div
                    className={`mt-2 text-[10px] text-right ${
                      isUser ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {/* Suggested Action Buttons if present */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && !msg.appliedAction && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleExecuteAction(msg.id, action)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900 transition-all shadow-sm active:scale-95"
                      >
                        <span>{action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Applied confirmation badge */}
                {msg.appliedAction && (
                  <div className="text-[11px] inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Ação executada: {msg.appliedAction}</span>
                  </div>
                )}

                {/* Learned Memory Suggestion */}
                {msg.learnedMemorySuggestion && (
                  <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-900/60 flex items-start justify-between space-x-2 text-xs">
                    <div className="flex items-start space-x-2 text-amber-800 dark:text-amber-200">
                      <BrainCircuit className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <span className="font-bold">O Sistem identificou uma preferência:</span>
                        <p className="text-amber-700 dark:text-amber-300 text-[11px] mt-0.5">
                          "{msg.learnedMemorySuggestion}"
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSaveMemory(msg.id, msg.learnedMemorySuggestion!)}
                      className="px-2 py-1 text-[11px] font-bold rounded bg-amber-600 text-white hover:bg-amber-700 transition-colors flex-shrink-0 flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Salvar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs py-2 pl-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            <span>Sistem consultando bases MuscleWiki e processando resposta...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* MuscleWiki & Quick Prompts Bar */}
      <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-none">
        <button
          onClick={() => handleSend('Como executar o Supino Reto com postura perfeita segundo o MuscleWiki?')}
          className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors"
        >
          🏋️‍♂️ MuscleWiki: Supino Reto
        </button>
        <button
          onClick={() => handleSend('Me mostre o passo a passo e erros comuns do Agachamento Búlgaro no MuscleWiki')}
          className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors"
        >
          🦵 MuscleWiki: Agachamento Búlgaro
        </button>
        <button
          onClick={() => handleSend('Quais os melhores exercícios da base MuscleWiki para bíceps e costas?')}
          className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors"
        >
          💪 MuscleWiki: Bíceps & Costas
        </button>
        <button
          onClick={() => handleSend('Agende uma reunião de alinhamento com a equipe para amanhã às 15:00 no Google Calendar')}
          className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors"
        >
          📅 Agendar no Calendar
        </button>
        <button
          onClick={() => handleSend('Sistem, me ensine com uma analogia prática como funciona o conceito de Generics no TypeScript')}
          className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-500 transition-colors"
        >
          🎓 Aula: TypeScript & Generics
        </button>
        <button
          onClick={() => handleSend('Como executar o Low Kick no Muay Thai e prevenir lesão na canela?')}
          className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-500 transition-colors"
        >
          🥋 Muay Thai: Chute e Canela
        </button>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte ao Sistem sobre treinos do MuscleWiki, agenda, tarefas ou estudos..."
          className="w-full pl-4 pr-12 py-3 rounded-xl border text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-all shadow-sm shadow-emerald-600/30"
          title="Enviar mensagem para o Sistem"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
