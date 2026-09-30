import React, { useState } from 'react';
import {
  Dumbbell,
  HeartPulse,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  Flame,
  ShieldAlert,
  Send,
  Calendar,
} from 'lucide-react';
import { WorkoutRoutine, ExerciseItem, PainGuidance } from '../types';
import { PAIN_LIBRARY } from '../data/painLibrary';
import { openWhatsApp, buildWorkoutWhatsAppMsg } from '../services/whatsappService';

interface FitnessTrainerProps {
  workoutRoutines: WorkoutRoutine[];
  activeWorkoutIndex: number;
  setActiveWorkoutIndex: (idx: number) => void;
  onCompleteWorkout: (workoutId: string, feedback: any) => void;
  onToggleExercise: (workoutId: string, exerciseId: string) => void;
  onAdjustWorkout: (painArea?: string) => void;
  whatsappPhone: string;
  initialPainArea?: string;
}

export const FitnessTrainer: React.FC<FitnessTrainerProps> = ({
  workoutRoutines,
  activeWorkoutIndex,
  setActiveWorkoutIndex,
  onCompleteWorkout,
  onToggleExercise,
  onAdjustWorkout,
  whatsappPhone,
  initialPainArea,
}) => {
  const [activeTab, setActiveTab] = useState<'routine' | 'pain_relief' | 'weekly_plan'>('routine');
  const [selectedPainId, setSelectedPainId] = useState<string>(initialPainArea || 'lombar');

  // Feedback logging state
  const [showLogModal, setShowLogModal] = useState(false);
  const [rpe, setRpe] = useState<number>(7);
  const [feltPain, setFeltPain] = useState<boolean>(false);
  const [painArea, setPainArea] = useState<string>('Lombar');
  const [painSeverity, setPainSeverity] = useState<number>(3);
  const [userNotes, setUserNotes] = useState('');
  const [adjustmentNotice, setAdjustmentNotice] = useState<string | null>(null);

  const currentRoutine = workoutRoutines[activeWorkoutIndex] || workoutRoutines[0];
  const selectedPain = PAIN_LIBRARY.find((p) => p.id === selectedPainId) || PAIN_LIBRARY[0];

  const completedExercises = currentRoutine?.exercises.filter((e) => e.completed).length || 0;
  const totalExercises = currentRoutine?.exercises.length || 0;
  const workoutProgress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  const handleFinishSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoutine) return;

    let coachAdvice = '';
    if (feltPain) {
      coachAdvice = `Atenção: dor em ${painArea} registrada. O treinador adaptou sua rotina da semana para poupar a articulação e adicionou exercícios compensatórios.`;
      onAdjustWorkout(painArea);
    } else if (rpe >= 9) {
      coachAdvice = 'Esforço máximo alcançado! Excelente dedicação, priorize hoje hidratação e sono profundo para supercompensação muscular.';
    } else {
      coachAdvice = 'Treino concluído com ótima cadência e sem dores limitantes. Consistência mantida!';
    }

    onCompleteWorkout(currentRoutine.id, {
      rpe,
      completionPercentage: workoutProgress,
      feltPain,
      painArea: feltPain ? painArea : undefined,
      painSeverity: feltPain ? painSeverity : undefined,
      userNotes,
      coachFeedback: coachAdvice,
      date: new Date().toISOString(),
    });

    setShowLogModal(false);
    setAdjustmentNotice(coachAdvice);
    setTimeout(() => setAdjustmentNotice(null), 6000);
  };

  const handleSendWorkoutWhatsApp = () => {
    if (!currentRoutine) return;
    const msg = buildWorkoutWhatsAppMsg(
      currentRoutine.title,
      currentRoutine.focus,
      currentRoutine.durationMinutes
    );
    openWhatsApp(whatsappPhone, msg);
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Toast Notice */}
      {adjustmentNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500 text-white font-medium text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-emerald-500/20">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{adjustmentNotice}</span>
          </div>
          <button onClick={() => setAdjustmentNotice(null)} className="text-white/80 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Sub-navigation tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('routine')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'routine'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Treino de Hoje</span>
        </button>

        <button
          onClick={() => setActiveTab('pain_relief')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'pain_relief'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Alívio de Dores & Fisiologia</span>
        </button>

        <button
          onClick={() => setActiveTab('weekly_plan')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'weekly_plan'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Planejamento Semanal</span>
        </button>
      </div>

      {/* TAB 1: WORKOUT OF THE DAY */}
      {activeTab === 'routine' && currentRoutine && (
        <div className="space-y-6">
          {/* Workout Header Card */}
          <div className="p-4 sm:p-6 rounded-2xl border bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-800/90 dark:to-emerald-950/20 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {currentRoutine.dayOfWeek} • {currentRoutine.difficulty}
                </span>
                {currentRoutine.completed && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    ✓ Finalizado
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {currentRoutine.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Foco: <span className="font-semibold">{currentRoutine.focus}</span> • Duração estimada: {currentRoutine.durationMinutes} min
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <button
                onClick={handleSendWorkoutWhatsApp}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                title="Receber no WhatsApp"
              >
                <Send className="w-3.5 h-3.5 text-emerald-500" />
                <span>Enviar no WhatsApp</span>
              </button>

              <button
                onClick={() => onAdjustWorkout()}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                title="Pedir adaptação de treino ao Treinador IA"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
                <span>Adaptar Carga</span>
              </button>

              <button
                onClick={() => setShowLogModal(true)}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{currentRoutine.completed ? 'Revisar Feedback' : 'Finalizar Treino'}</span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Progresso dos Exercícios</span>
                <span>{completedExercises} de {totalExercises} feitos ({workoutProgress}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${workoutProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Exercícios da Sessão</span>
            </h3>

            {currentRoutine.exercises.map((ex, index) => (
              <div
                key={ex.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  ex.completed
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80'
                    : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <button
                    onClick={() => onToggleExercise(currentRoutine.id, ex.id)}
                    className="mt-1 text-slate-400 hover:text-emerald-500 transition-colors flex-shrink-0"
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        ex.completed ? 'text-emerald-500 fill-emerald-500/20' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        #{index + 1}
                      </span>
                      <h4
                        className={`text-xs sm:text-sm font-bold ${
                          ex.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {ex.name}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-md font-semibold">
                        {ex.sets} séries × {ex.reps}
                      </span>
                      {ex.weight && <span>Carga: {ex.weight}</span>}
                      <span className="text-slate-400">• Alvo: {ex.targetMuscle}</span>
                    </div>

                    {ex.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 pt-0.5 flex items-center space-x-1">
                        <Info className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        <span>{ex.notes}</span>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onToggleExercise(currentRoutine.id, ex.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold self-end sm:self-center transition-colors ${
                    ex.completed
                      ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {ex.completed ? 'Concluído' : 'Marcar Feito'}
                </button>
              </div>
            ))}
          </div>

          {/* Coach Sincere Advice Box */}
          <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/70 dark:bg-blue-950/30 dark:border-blue-900/60 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <span className="font-bold">Diretriz do Treinador NexusPulse:</span>
              <p className="leading-relaxed">
                "Não corra para terminar. Cadência controlada (2 a 3 segundos na fase excêntrica) gera 40% mais estímulo muscular que movimentos rápidos e descontrolados, além de poupar tendões de impactos desnecessários. Se sentir qualquer dor aguda, pare e abra nossa aba de Alívio de Dores."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAIN RELIEF & PHYSIOLOGY GUIDE */}
      {activeTab === 'pain_relief' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pain Selector Menu */}
          <div className="space-y-2 lg:col-span-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              Selecione a Região de Desconforto:
            </h3>

            {PAIN_LIBRARY.map((pain) => {
              const isSelected = selectedPainId === pain.id;
              return (
                <button
                  key={pain.id}
                  onClick={() => setSelectedPainId(pain.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm">{pain.area}</h4>
                    <p
                      className={`text-[11px] truncate max-w-[220px] ${
                        isSelected ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {pain.shortDescription}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                </button>
              );
            })}

            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 mt-4 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Atenção Médica:</strong> Orientações esportivas e posturais não substituem consulta com médico ortopedista ou fisioterapeuta.
              </span>
            </div>
          </div>

          {/* Selected Pain Detail Card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Protocolo Fisiológico & Biomecânico
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedPain.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {selectedPain.shortDescription}
                </p>
              </div>

              {/* Immediate Steps */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>Conduta Imediata de Alívio:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {selectedPain.immediateSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Exercises & Stretches */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Movimentos Corretivos & Alongamentos Recomendados:
                </h4>

                <div className="space-y-2">
                  {selectedPain.exercisesAndStretches.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {idx + 1}. {item.name}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                          {item.durationOrReps}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.howTo}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contraindications & Red flags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 space-y-1">
                  <span className="font-bold flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <span>O que EVITAR agora:</span>
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    {selectedPain.contraindications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  <span className="font-bold">Quando procurar médico imediatamente:</span>
                  <p className="text-[11px] leading-relaxed">{selectedPain.whenToSeeDoctor}</p>
                </div>
              </div>

              {/* Action Button: Apply adjustment */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onAdjustWorkout(selectedPain.id);
                    setAdjustmentNotice(`Rotina de treino adaptada para poupar a região: ${selectedPain.area}!`);
                    setTimeout(() => setAdjustmentNotice(null), 4000);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ajustar Meus Treinos da Semana para Proteger Esta Região</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEEKLY PLAN */}
      {activeTab === 'weekly_plan' && (
        <div className="space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Grade Semanal de Rotinas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workoutRoutines.map((routine, idx) => (
              <div
                key={routine.id}
                onClick={() => {
                  setActiveWorkoutIndex(idx);
                  setActiveTab('routine');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeWorkoutIndex === idx
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {routine.dayOfWeek}
                  </span>
                  {routine.completed && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Feito
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{routine.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{routine.focus}</p>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>{routine.exercises.length} exercícios</span>
                  <span>{routine.durationMinutes} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Finish & Log Performance / Pain */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                <span>Feedback Sincero da Sessão</span>
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFinishSession} className="space-y-4">
              {/* RPE Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Esforço Percebido (RPE):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                    {rpe}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rpe}
                  onChange={(e) => setRpe(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 (Muito Leve)</span>
                  <span>5 (Moderado)</span>
                  <span>7 (Ótimo)</span>
                  <span>10 (Falha Total)</span>
                </div>
              </div>

              {/* Pain check */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="pain-switch" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Sentiu dor ou desconforto articular?
                  </label>
                  <input
                    type="checkbox"
                    id="pain-switch"
                    checked={feltPain}
                    onChange={(e) => setFeltPain(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-slate-300"
                  />
                </div>

                {feltPain && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                          Onde sentiu dor?
                        </label>
                        <select
                          value={painArea}
                          onChange={(e) => setPainArea(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="Lombar">Lombar</option>
                          <option value="Joelho">Joelho</option>
                          <option value="Ombros">Ombros</option>
                          <option value="Trapézio / Pescoço">Trapézio / Pescoço</option>
                          <option value="Punho / Antebraço">Punho / Antebraço</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                          Intensidade: {painSeverity}/10
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={painSeverity}
                          onChange={(e) => setPainSeverity(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500 mt-2"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas sobre a sessão (opcional):
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Carga do supino foi fácil, mas o agachamento pesou um pouco."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Registrar e Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
