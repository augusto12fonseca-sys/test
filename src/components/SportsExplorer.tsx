import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  CheckCircle,
  Plus,
  Flame,
  HeartPulse,
  Info,
  ChevronRight,
  ChevronDown,
  Sparkles,
  MessageSquare,
  Check,
  Dumbbell,
  Settings2,
  Calendar,
  RotateCcw,
  Clock,
  Send,
  AlertTriangle,
  History,
  Activity,
  Bot,
  User,
  Database,
  ExternalLink,
  BookOpen,
  Timer,
  Play,
  Pause,
} from 'lucide-react';
import { SportsItem, WorkoutRoutine, UserPreferences, ExerciseItem } from '../types';
import {
  SPORTS_DATABASE,
  MARTIAL_ARTS_LIST,
  SPORT_STYLES_LIST,
} from '../data/sportsDatabase';
import {
  searchMuscleWiki,
  MuscleWikiExercise,
} from '../data/muscleWikiDatabase';
import { sendMessageToAI } from '../services/aiService';
import { playNotificationChime } from '../services/whatsappService';

interface SportsExplorerProps {
  onAddToTodayWorkout: (item: SportsItem) => void;
  onAskCoachAboutItem: (item: SportsItem) => void;
  workoutRoutines: WorkoutRoutine[];
  activeWorkoutIndex: number;
  setActiveWorkoutIndex: (idx: number) => void;
  onToggleExercise?: (workoutId: string, exerciseId: string) => void;
  onCompleteWorkout?: (workoutId: string, feedback: any) => void;
  onAdjustWorkout?: (painArea?: string) => void;
  practicedSports: string[];
  onUpdatePracticedSports: (sports: string[]) => void;
  userPreferences: UserPreferences;
}

export const SportsExplorer: React.FC<SportsExplorerProps> = ({
  onAddToTodayWorkout,
  onAskCoachAboutItem,
  workoutRoutines = [],
  activeWorkoutIndex = 0,
  setActiveWorkoutIndex,
  onToggleExercise,
  onCompleteWorkout,
  onAdjustWorkout,
  practicedSports = [],
  onUpdatePracticedSports,
  userPreferences,
}) => {
  // Navigation: "esportes", "treino", "avaliação" (MuscleWiki tab is hidden as requested)
  const [activeSubTopic, setActiveSubTopic] = useState<'esportes' | 'treino' | 'avaliação'>('esportes');

  // Sub-topic 1 ("esportes") state
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('all');
  const [onlyPracticed, setOnlyPracticed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Sub-topic 2 ("treino") state: view mode (semana, hoje, registrados)
  const [treinoViewMode, setTreinoViewMode] = useState<'semana' | 'hoje' | 'registrados'>('hoje');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  // Rest Timer State
  const [restSeconds, setRestSeconds] = useState<number | null>(null);
  const [initialRestSeconds, setInitialRestSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Sub-topic 3 ("avaliação") state: interactive chat with Sistem
  const [evalMessages, setEvalMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>>([
    {
      role: 'assistant',
      content: `Olá, ${userPreferences.userName}! Aqui é o **Sistem** para a sua **Avaliação de Treino**.\n\nMe conte: **como você se sentiu nos treinos recentes?**\n• Sentiu alguma dor articular ou muscular excessiva (ex: lombar, joelho, ombro)?\n• A intensidade (RPE) estava adequada ou precisa ajustar a cadência e a carga?\n• Quer focar mais em artes marciais (Taekwondo, Hapkido, BJJ, Muay Thai) ou musculação?\n\nCom base no seu relato sincero, adapto imediatamente a sua programação de treinos!`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [evalInput, setEvalInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Finish session modal
  const [showLogModal, setShowLogModal] = useState(false);
  const [rpe, setRpe] = useState<number>(7);
  const [feltPain, setFeltPain] = useState<boolean>(false);
  const [painArea, setPainArea] = useState<string>('Lombar');
  const [painSeverity, setPainSeverity] = useState<number>(3);
  const [userNotes, setUserNotes] = useState('');

  const currentRoutine = workoutRoutines[activeWorkoutIndex] || workoutRoutines[0];
  const allAvailableSports = [...MARTIAL_ARTS_LIST, ...SPORT_STYLES_LIST];

  // Rest Interval Countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && restSeconds !== null && restSeconds > 0) {
      interval = setInterval(() => {
        setRestSeconds((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (isTimerRunning && restSeconds === 0) {
      setIsTimerRunning(false);
      playNotificationChime();
      setToastNotice('Tempo de descanso finalizado! Hora da próxima série.');
      setTimeout(() => setToastNotice(null), 4000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, restSeconds]);

  const startRestTimer = (seconds: number) => {
    setInitialRestSeconds(seconds);
    setRestSeconds(seconds);
    setIsTimerRunning(true);
  };

  const toggleRestTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const resetRestTimer = () => {
    setIsTimerRunning(false);
    setRestSeconds(null);
  };

  // Helper to fetch MuscleWiki step-by-step data for any exercise
  const getExerciseStepByStepData = (ex: ExerciseItem) => {
    if (ex.instructions && ex.instructions.length > 0) {
      return {
        instructions: ex.instructions,
        formTips: ex.formTips || [],
        commonMistakes: ex.commonMistakes || [],
        equipment: ex.equipment || 'Equipamento padrão',
        muscleWikiUrl: ex.muscleWikiUrl || 'https://musclewiki.com',
      };
    }
    // Search in MuscleWiki database as fallback
    const matched = searchMuscleWiki(ex.name)[0];
    if (matched) {
      return {
        instructions: matched.instructions,
        formTips: matched.formTips,
        commonMistakes: matched.commonMistakes,
        equipment: matched.equipment,
        muscleWikiUrl: matched.muscleWikiUrl,
      };
    }
    return null;
  };

  // Filter items in "esportes"
  const filteredSportsItems = SPORTS_DATABASE.filter((item) => {
    if (selectedSportFilter !== 'all' && item.subCategory !== selectedSportFilter) return false;
    if (onlyPracticed && !practicedSports.includes(item.subCategory)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.subCategory.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.targetMuscles.some((m) => m.toLowerCase().includes(q)) ||
        item.painPreventionAndStrengthening.commonPainArea.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleTogglePracticedSport = (sportName: string) => {
    const updated = practicedSports.includes(sportName)
      ? practicedSports.filter((s) => s !== sportName)
      : [...practicedSports, sportName];
    onUpdatePracticedSports(updated);
  };

  const handleAddExercise = (item: SportsItem) => {
    onAddToTodayWorkout(item);
    setToastNotice(`"${item.name}" foi adicionado ao seu treino de hoje!`);
    setTimeout(() => setToastNotice(null), 4000);
  };

  const handleFinishWorkoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoutine || !onCompleteWorkout) return;

    let coachAdvice = '';
    if (feltPain) {
      coachAdvice = `Dor em ${painArea} registrada (intensidade ${painSeverity}/10). O Sistem adaptou os treinos da semana e adicionou mobilidade corretiva.`;
      if (onAdjustWorkout) onAdjustWorkout(painArea);
    } else {
      coachAdvice = 'Treino concluído com consistência e técnica estrita! Excelente execução.';
    }

    onCompleteWorkout(currentRoutine.id, {
      rpe,
      completionPercentage: 100,
      feltPain,
      painArea: feltPain ? painArea : undefined,
      painSeverity: feltPain ? painSeverity : undefined,
      userNotes,
      coachFeedback: coachAdvice,
      date: new Date().toISOString(),
    });

    setShowLogModal(false);
    setToastNotice(coachAdvice);
    setTimeout(() => setToastNotice(null), 5000);
  };

  // Evaluation chat with Sistem
  const handleSendEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalInput.trim() || isEvaluating) return;

    const userMsg = {
      role: 'user' as const,
      content: evalInput.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setEvalMessages((prev) => [...prev, userMsg]);
    setEvalInput('');
    setIsEvaluating(true);

    try {
      const response = await sendMessageToAI({
        messages: [
          ...evalMessages.map((m) => ({ role: m.role, content: m.content })),
          userMsg,
        ],
        userPreferences,
        requestedAgent: 'sistem',
        context: {
          tasks: [],
          calendarEvents: [],
          currentWorkout: currentRoutine,
          todayStats: {},
        },
      });

      const asstMsg = {
        role: 'assistant' as const,
        content: response.reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setEvalMessages((prev) => [...prev, asstMsg]);

      const lowerInput = userMsg.content.toLowerCase();
      if (
        lowerInput.includes('dor') ||
        lowerInput.includes('lombar') ||
        lowerInput.includes('joelho') ||
        lowerInput.includes('ombro') ||
        lowerInput.includes('cansad') ||
        lowerInput.includes('pesad')
      ) {
        const area = lowerInput.includes('lombar')
          ? 'Lombar'
          : lowerInput.includes('joelho')
          ? 'Joelho'
          : lowerInput.includes('ombro')
          ? 'Ombros'
          : undefined;
        if (onAdjustWorkout) onAdjustWorkout(area);
        setToastNotice('O Sistem recalculou e adaptou os treinos da semana com base na sua avaliação!');
        setTimeout(() => setToastNotice(null), 5000);
      }
    } catch (err) {
      console.error(err);
      setEvalMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Entendido. Registrei sua avaliação sobre o treino e apliquei os ajustes necessários na carga e no volume.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsEvaluating(false);
    }
  };

  const completedExCount = currentRoutine?.exercises.filter((e) => e.completed).length || 0;
  const totalExCount = currentRoutine?.exercises.length || 0;
  const workoutPct = totalExCount > 0 ? Math.round((completedExCount / totalExCount) * 100) : 0;
  const registeredWorkouts = workoutRoutines.filter((w) => w.completed || w.feedback);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-5">
      {/* Toast Alert */}
      {toastNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500 text-white font-medium text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{toastNotice}</span>
          </div>
          <button onClick={() => setToastNotice(null)} className="text-white/80 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Esportes & Treinamento Físico
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Sistem & Biomecânica
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Treinos com passo a passo biomecânico integrado em cada exercício, artes marciais e avaliação de esforço.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConfigModal(true)}
          className="flex items-center space-x-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-900 text-white dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 shadow-sm transition-all self-start md:self-center"
        >
          <Settings2 className="w-4 h-4" />
          <span>Esportes Praticados ({practicedSports.length})</span>
        </button>
      </div>

      {/* Clean Sub-Topics Navigation: "esportes", "treino", "avaliação" */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTopic('esportes')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTopic === 'esportes'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>esportes</span>
        </button>

        <button
          onClick={() => setActiveSubTopic('treino')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTopic === 'treino'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>treino</span>
          {currentRoutine?.completed && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-700 text-white">✓</span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTopic('avaliação')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTopic === 'avaliação'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>avaliação</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TÓPICO 1: "esportes"                                                 */}
      {/* ========================================================================= */}
      {activeSubTopic === 'esportes' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar técnica, arte marcial, esporte ou reforço para dores..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <button
                onClick={() => setOnlyPracticed(!onlyPracticed)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  onlyPracticed
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                }`}
              >
                <span>⭐ Meus Esportes Selecionados</span>
                {onlyPracticed && <span>✓</span>}
              </button>
            </div>

            {/* Sub-tópicos de cada esporte cadastrado */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedSportFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSportFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Todos ({SPORTS_DATABASE.length})
              </button>

              {allAvailableSports.map((sport) => {
                const isSelected = selectedSportFilter === sport;
                const isPracticed = practicedSports.includes(sport);

                return (
                  <button
                    key={sport}
                    onClick={() => setSelectedSportFilter(sport)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <span>{sport}</span>
                    {isPracticed && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards of Techniques & Sports */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSportsItems.map((item) => {
              const isPracticed = practicedSports.includes(item.subCategory);

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border transition-all bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {item.subCategory}
                        </span>
                        {isPracticed && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                            ⭐ Praticado
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{item.difficulty}</span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                      {item.name}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-2.5 p-2 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/40 text-[11px] space-y-1">
                      <div className="font-semibold text-orange-900 dark:text-orange-300 flex items-center space-x-1">
                        <HeartPulse className="w-3.5 h-3.5 text-orange-600" />
                        <span>Prevenção & Reforço: {item.painPreventionAndStrengthening.commonPainArea}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[10px]">
                        Exercício: {item.painPreventionAndStrengthening.strengtheningExercise}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <button
                      onClick={() => onAskCoachAboutItem(item)}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 flex items-center space-x-1"
                    >
                      <Bot className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Dúvidas ao Sistem</span>
                    </button>

                    <button
                      onClick={() => handleAddExercise(item)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar ao Treino</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TÓPICO 2: "treino" COM PASSO A PASSO BIOMECÂNICO & REST TIMER        */}
      {/* ========================================================================= */}
      {activeSubTopic === 'treino' && (
        <div className="space-y-4">
          {/* Sub-modes: hoje, semana, registrados */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl max-w-md mx-auto">
            <button
              onClick={() => setTreinoViewMode('hoje')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                treinoViewMode === 'hoje'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Treino de Hoje
            </button>

            <button
              onClick={() => setTreinoViewMode('semana')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                treinoViewMode === 'semana'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Treinos da Semana
            </button>

            <button
              onClick={() => setTreinoViewMode('registrados')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                treinoViewMode === 'registrados'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Registrados ({registeredWorkouts.length})
            </button>
          </div>

          {/* VIEW 1: HOJE */}
          {treinoViewMode === 'hoje' && currentRoutine && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl border bg-gradient-to-br from-white to-blue-50/40 dark:from-slate-800/90 dark:to-blue-950/20 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {currentRoutine.dayOfWeek} • {currentRoutine.difficulty}
                    </span>
                    {currentRoutine.completed && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ✓ Concluído
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {currentRoutine.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Foco: {currentRoutine.focus} • {currentRoutine.durationMinutes} minutos estimados
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onAdjustWorkout && onAdjustWorkout()}
                    className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5 inline mr-1 text-blue-500" />
                    <span>Adaptar Carga</span>
                  </button>

                  <button
                    onClick={() => setShowLogModal(true)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    <span>{currentRoutine.completed ? 'Revisar Feedback' : 'Finalizar Sessão'}</span>
                  </button>
                </div>
              </div>

              {/* Rest Timer Widget */}
              <div className="p-3.5 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                      Cronômetro de Descanso entre Séries
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {restSeconds !== null
                        ? `Tempo restante: ${restSeconds} segundos`
                        : 'Selecione um intervalo de recuperação:'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                  {[30, 60, 90, 120].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => startRestTimer(sec)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        restSeconds === sec && isTimerRunning
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}

                  {restSeconds !== null && (
                    <div className="flex items-center space-x-1 pl-1">
                      <button
                        onClick={toggleRestTimer}
                        className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                        title={isTimerRunning ? 'Pausar' : 'Continuar'}
                      >
                        {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={resetRestTimer}
                        className="text-xs text-slate-400 hover:text-red-500 px-1"
                        title="Zerar cronômetro"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="p-3.5 rounded-xl border bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Progresso do Treino</span>
                  <span>{completedExCount}/{totalExCount} exercícios concluídos ({workoutPct}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${workoutPct}%` }}></div>
                </div>
              </div>

              {/* Exercises List with Step-by-Step Instructions */}
              <div className="space-y-3">
                {currentRoutine.exercises.map((ex) => {
                  const isExpanded = expandedExerciseId === ex.id;
                  const stepData = getExerciseStepByStepData(ex);

                  return (
                    <div
                      key={ex.id}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        ex.completed
                          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                          : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm'
                      }`}
                    >
                      {/* Exercise Header Row */}
                      <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => onToggleExercise && onToggleExercise(currentRoutine.id, ex.id)}
                            className="mt-0.5 text-slate-400 hover:text-blue-500 transition-colors"
                            title={ex.completed ? 'Desmarcar' : 'Marcar como concluído'}
                          >
                            <CheckCircle
                              className={`w-5 h-5 ${
                                ex.completed ? 'text-blue-600 fill-blue-600/20' : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          </button>

                          <div>
                            <div className="flex items-center space-x-2 flex-wrap">
                              <h4
                                className={`text-xs sm:text-sm font-bold ${
                                  ex.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {ex.name}
                              </h4>
                              {stepData && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                  Passo a Passo
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap gap-y-0.5">
                              <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {ex.sets} séries × {ex.reps}
                              </span>
                              {ex.weight && <span>• Carga: {ex.weight}</span>}
                              <span>• Alvo: {ex.targetMuscle}</span>
                            </div>

                            {ex.notes && (
                              <p className="text-[11px] text-slate-400 mt-0.5 italic">{ex.notes}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Step-by-Step Toggle Button */}
                          {stepData && (
                            <button
                              onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                isExpanded
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                                  : 'bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                              }`}
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">
                                {isExpanded ? 'Ocultar Passo a Passo' : 'Passo a Passo'}
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => onToggleExercise && onToggleExercise(currentRoutine.id, ex.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              ex.completed
                                ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                            }`}
                          >
                            {ex.completed ? 'Feito' : 'Concluir'}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Step-by-Step Details Drawer */}
                      {isExpanded && stepData && (
                        <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-700/80 bg-rose-50/20 dark:bg-rose-950/10 space-y-3 animate-fade-in">
                          <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 font-bold border-b pb-1 border-rose-100 dark:border-rose-900/40">
                            <span className="flex items-center space-x-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-rose-600" />
                              <span>Execução e Biomecânica Passo a Passo</span>
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Equipamento: {stepData.equipment}
                            </span>
                          </div>

                          {/* Numbered Steps */}
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                              Passos de Execução:
                            </span>
                            <ol className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-decimal list-inside leading-relaxed bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                              {stepData.instructions.map((step, idx) => (
                                <li key={idx} className="leading-normal">
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Form Cues & Common Mistakes */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            {stepData.formTips.length > 0 && (
                              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                                <span className="font-bold block mb-0.5">Dica de Postura / Form Cue:</span>
                                <span>{stepData.formTips.join(' • ')}</span>
                              </div>
                            )}

                            {stepData.commonMistakes.length > 0 && (
                              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300">
                                <span className="font-bold block mb-0.5">Erro Comum a Evitar:</span>
                                <span>{stepData.commonMistakes.join(' • ')}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-1">
                            <a
                              href={stepData.muscleWikiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1"
                            >
                              <span>Ver referência no musclewiki.com</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              onClick={() => {
                                const sportsItemFormat: SportsItem = {
                                  id: ex.id,
                                  name: ex.name,
                                  category: 'musculacao_calistenia',
                                  subCategory: 'Treino de Hoje',
                                  targetMuscles: [ex.targetMuscle],
                                  difficulty: 'Intermediário',
                                  description: ex.notes || 'Exercício da rotina',
                                  technicalTips: stepData.instructions,
                                  painPreventionAndStrengthening: {
                                    commonPainArea: ex.targetMuscle,
                                    strengtheningExercise: ex.name,
                                    preventionTip: stepData.formTips[0] || 'Execução estrita',
                                  },
                                };
                                onAskCoachAboutItem(sportsItemFormat);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              Tirar Dúvida com Sistem
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 2: SEMANA (Planejamento) */}
          {treinoViewMode === 'semana' && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Grade de Treinos Programados para a Semana:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {workoutRoutines.map((routine, idx) => (
                  <div
                    key={routine.id}
                    onClick={() => {
                      setActiveWorkoutIndex(idx);
                      setTreinoViewMode('hoje');
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      activeWorkoutIndex === idx
                        ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {routine.dayOfWeek}
                      </span>
                      {routine.completed && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Concluído
                        </span>
                      )}
                    </div>

                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{routine.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{routine.focus}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between text-xs text-slate-400">
                      <span>{routine.exercises.length} exercícios com passo a passo</span>
                      <span>{routine.durationMinutes} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: REGISTRADOS (Histórico e feedbacks) */}
          {treinoViewMode === 'registrados' && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Histórico de Sessões Concluídas:
              </h4>

              {registeredWorkouts.length === 0 ? (
                <div className="text-center py-10 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                  <Activity className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                    Nenhum treino concluído ainda
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Execute o treino do dia e clique em "Finalizar Sessão" para registrar o esforço percebido.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {registeredWorkouts.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 rounded-2xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{w.title}</span>
                        <span className="text-xs font-bold text-emerald-600">RPE: {w.feedback?.rpe || 7}/10</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {w.feedback?.coachFeedback || 'Sessão concluída com consistência.'}
                      </p>
                      {w.feedback?.feltPain && (
                        <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold block">
                          Dor relatada em: {w.feedback.painArea} ({w.feedback.painSeverity}/10)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TÓPICO 3: "avaliação" INTERATIVA COM O SISTEM                        */}
      {/* ========================================================================= */}
      {activeSubTopic === 'avaliação' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <span>Avaliação Dinâmica de Cargas com o Sistem</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Relate honestamente seu nível de fadiga, dores musculares ou articulares para que o Sistem recalibre os treinos da semana.
            </p>
          </div>

          <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-3 max-h-[460px] overflow-y-auto">
            {evalMessages.map((m, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] whitespace-pre-line ${
                  m.role === 'user'
                    ? 'ml-auto bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div>{m.content}</div>
                <div className="text-[10px] text-right text-slate-400 mt-1">{m.timestamp}</div>
              </div>
            ))}
            {isEvaluating && (
              <div className="text-xs text-slate-400 animate-pulse pl-2">Sistem analisando avaliação...</div>
            )}
          </div>

          <form onSubmit={handleSendEvaluation} className="flex space-x-2">
            <input
              type="text"
              value={evalInput}
              onChange={(e) => setEvalInput(e.target.value)}
              placeholder="Ex: Treinei pernas ontem, mas senti desconforto na lombar no RDL..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
            <button
              type="submit"
              disabled={!evalInput.trim() || isEvaluating}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold disabled:opacity-40"
            >
              Enviar
            </button>
          </form>
        </div>
      )}

      {/* Modal: Configurar Esportes Praticados */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Seus Esportes e Artes Marciais Praticados
              </h3>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {allAvailableSports.map((sport) => {
                const isSelected = practicedSports.includes(sport);
                return (
                  <button
                    key={sport}
                    onClick={() => handleTogglePracticedSport(sport)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>{sport}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-emerald-600"
              >
                Concluir Seleção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Finalizar Sessão e Registrar RPE */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Feedback da Sessão de Treino
              </h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleFinishWorkoutSubmit} className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Esforço Percebido (RPE):</span>
                  <span className="text-emerald-600 font-bold">{rpe}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rpe}
                  onChange={(e) => setRpe(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="felt-pain-cb" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Sentiu dor ou desconforto excessivo?
                  </label>
                  <input
                    type="checkbox"
                    id="felt-pain-cb"
                    checked={feltPain}
                    onChange={(e) => setFeltPain(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-slate-300"
                  />
                </div>

                {feltPain && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Onde sentiu?</label>
                      <select
                        value={painArea}
                        onChange={(e) => setPainArea(e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="Lombar">Lombar</option>
                        <option value="Joelho">Joelho</option>
                        <option value="Ombros">Ombros</option>
                        <option value="Cervical">Cervical</option>
                        <option value="Punhos">Punhos</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Gravidade: {painSeverity}/10</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={painSeverity}
                        onChange={(e) => setPainSeverity(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded appearance-none accent-red-500 mt-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas sobre a sessão (opcional):
                </label>
                <textarea
                  rows={2}
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Ex: Treino executado com foco na cadência."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Salvar Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
