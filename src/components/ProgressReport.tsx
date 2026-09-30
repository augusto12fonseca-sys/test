import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Sparkles,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  Dumbbell,
  Calendar,
  CheckSquare,
  RefreshCw,
  FileText,
  Flame,
} from 'lucide-react';
import { Task, CalendarEventItem, WorkoutRoutine, UserPreferences } from '../types';
import { generateDailyFeedback } from '../services/aiService';
import { generateWeeklyPdfReport } from '../services/pdfReportGenerator';

interface ProgressReportProps {
  userPreferences: UserPreferences;
  tasks: Task[];
  calendarEvents: CalendarEventItem[];
  workouts: WorkoutRoutine[];
  waterGlasses: number;
  onUpdateWater: (count: number) => void;
}

export const ProgressReport: React.FC<ProgressReportProps> = ({
  userPreferences,
  tasks,
  calendarEvents,
  workouts,
  waterGlasses,
  onUpdateWater,
}) => {
  const [honestFeedback, setHonestFeedback] = useState<string>(
    `Fala, ${userPreferences.userName}! Aqui está o seu raio-X sincero de hoje:\n\n` +
    `• **Produtividade:** Você avançou bem nas tarefas prioritárias, mas repare que duas tarefas menores foram empurradas para o final da tarde. Evite alternar de contexto a cada notificação.\n` +
    `• **Treinamento Físico:** Sua consistência está acima da média semanal. Se sentiu algum desconforto na lombar, não cometa o erro amador de tomar remédio e continuar socando carga: faça os 5 minutos de descompressão pélvica do guia.\n` +
    `• **Diretriz para Amanhã:** Execute a tarefa mais difícil logo no primeiro bloco de 90 minutos do dia e mantenha a garrafa de água cheia ao lado do teclado.`
  );
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculations
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const currentWorkout = workouts[0];
  const workoutDone = currentWorkout?.completed;

  // Consistency Score formula
  let score = 0;
  score += (taskRate * 0.45); // up to 45 pts
  score += workoutDone ? 35 : 10; // up to 35 pts
  score += Math.min(waterGlasses / 8, 1) * 20; // up to 20 pts
  const dailyScore = Math.min(Math.round(score), 100);

  const handleRefreshFeedback = async () => {
    setIsGeneratingFeedback(true);
    try {
      const feedback = await generateDailyFeedback(
        userPreferences,
        tasks,
        currentWorkout,
        calendarEvents.length,
        waterGlasses
      );
      setHonestFeedback(feedback);
      setToastMessage('Feedback diário sincero atualizado com sucesso!');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleExportPdf = () => {
    setIsExportingPdf(true);
    try {
      generateWeeklyPdfReport({
        userPreferences,
        tasks,
        calendarEvents,
        workouts,
        honestFeedback,
        waterGlasses,
      });
      setToastMessage('Relatório Semanal em PDF gerado e baixado com sucesso!');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (e: any) {
      alert(`Erro ao gerar PDF: ${e.message || 'Tente novamente'}`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500 text-white font-medium text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-emerald-500/20">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Header and Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Progresso Diário & Relatório Semanal
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Score: {dailyScore}%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Métricas de tarefas, reuniões, treinos, hidratação e relatório formatado para download.
          </p>
        </div>

        <button
          onClick={handleExportPdf}
          disabled={isExportingPdf}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-md transition-all self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>{isExportingPdf ? 'Gerando Relatório...' : 'Exportar Relatório Semanal (PDF)'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Score Consistência */}
        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Score do Dia</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {dailyScore}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${dailyScore}%` }}
            ></div>
          </div>
        </div>

        {/* Tarefas */}
        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Tarefas</span>
            <CheckSquare className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {completedTasks}/{totalTasks}
          </div>
          <p className="text-[11px] text-slate-400">{taskRate}% de conclusão</p>
        </div>

        {/* Treino */}
        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Treino de Hoje</span>
            <Dumbbell className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white truncate">
            {workoutDone ? 'Concluído' : 'Pendente'}
          </div>
          <p className="text-[11px] text-slate-400">
            {currentWorkout ? currentWorkout.focus : 'Sem rotina'}
          </p>
        </div>

        {/* Hidratação */}
        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Água Ingerida</span>
            <Droplets className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">
            {waterGlasses * 250} ml
          </div>
          <div className="flex items-center space-x-1 pt-1">
            <button
              onClick={() => onUpdateWater(Math.max(0, waterGlasses - 1))}
              className="px-2 py-0.5 text-xs font-bold rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
            >
              -
            </button>
            <span className="text-xs text-slate-500 font-medium px-1">{waterGlasses} copos</span>
            <button
              onClick={() => onUpdateWater(waterGlasses + 1)}
              className="px-2 py-0.5 text-xs font-bold rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-200"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Sincere AI Feedback Section */}
      <div className="p-5 sm:p-6 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Feedback Sincero & Construtivo do Treinador IA
            </h3>
          </div>

          <button
            onClick={handleRefreshFeedback}
            disabled={isGeneratingFeedback}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingFeedback ? 'animate-spin text-emerald-500' : ''}`} />
            <span>Atualizar Análise</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
          {honestFeedback}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>* Análise gerada pelo modelo de IA baseado no seu desempenho real de hoje.</span>
          <button
            onClick={handleExportPdf}
            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center space-x-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Incluir no PDF Semanal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
