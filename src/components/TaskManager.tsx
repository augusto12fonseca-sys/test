import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Calendar,
  Send,
  Clock,
  Tag,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { Task, Priority, TaskCategory } from '../types';
import { openWhatsApp, buildTaskWhatsAppMsg } from '../services/whatsappService';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Partial<Task>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSyncTaskToCalendar: (task: Task) => void;
  whatsappPhone: string;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onSyncTaskToCalendar,
  whatsappPhone,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState<TaskCategory>('trabalho');
  const [quickPriority, setQuickPriority] = useState<Priority>('alta');
  const [showFullModal, setShowFullModal] = useState(false);

  // Full modal state
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalDate, setModalDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [modalCategory, setModalCategory] = useState<TaskCategory>('trabalho');
  const [modalPriority, setModalPriority] = useState<Priority>('alta');
  const [modalWhatsAppReminder, setModalWhatsAppReminder] = useState(true);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    onAddTask({
      title: quickTitle,
      category: quickCategory,
      priority: quickPriority,
      dueDate: new Date().toISOString().split('T')[0],
      reminderWhatsApp: true,
    });

    setQuickTitle('');
  };

  const handleFullModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    onAddTask({
      title: modalTitle,
      description: modalDescription,
      dueDate: modalDate,
      category: modalCategory,
      priority: modalPriority,
      reminderWhatsApp: modalWhatsAppReminder,
    });

    setShowFullModal(false);
    setModalTitle('');
    setModalDescription('');
  };

  const handleCheck = (task: Task) => {
    onToggleTask(task.id);
    if (!task.completed) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleWhatsAppReminder = (task: Task) => {
    const msg = buildTaskWhatsAppMsg(task.title, task.priority, task.category);
    openWhatsApp(whatsappPhone, msg);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgente':
        return (
          <span className="flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-200 dark:border-red-900">
            <Flame className="w-3 h-3 text-red-500" />
            <span>Urgente</span>
          </span>
        );
      case 'alta':
        return (
          <span className="flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span>Alta</span>
          </span>
        );
      case 'media':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
            Média
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Baixa
          </span>
        );
    }
  };

  const getCategoryColor = (cat: TaskCategory) => {
    switch (cat) {
      case 'trabalho':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50';
      case 'treino':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50';
      case 'saude':
        return 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50';
      case 'estudos':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Overview Progress Card */}
      <div className="p-4 sm:p-6 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-emerald-500" />
            <span>Gerenciamento Diário de Tarefas</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize afazeres, sincronize blocos na agenda Google e receba lembretes no WhatsApp.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Conclusão</div>
            <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              {completionPercentage}%
            </div>
          </div>
          <div className="w-28 sm:w-36 bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Add Form */}
      <form
        onSubmit={handleQuickAdd}
        className="p-3 sm:p-4 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
      >
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Adicionar nova tarefa rápida (ex: Finalizar relatório de vendas)..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <div className="flex items-center space-x-2">
          <select
            value={quickCategory}
            onChange={(e) => setQuickCategory(e.target.value as TaskCategory)}
            className="px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="trabalho">Trabalho</option>
            <option value="treino">Treino</option>
            <option value="saude">Saúde</option>
            <option value="pessoal">Pessoal</option>
            <option value="estudos">Estudos</option>
          </select>

          <select
            value={quickPriority}
            onChange={(e) => setQuickPriority(e.target.value as Priority)}
            className="px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="urgente">Urgente</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFullModal(true)}
            className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Formulário completo de tarefa com descrição e data"
          >
            Opções
          </button>
        </div>
      </form>

      {/* Filter Chips */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 dark:text-slate-500 mr-1 flex items-center">
            <Filter className="w-3 h-3 mr-1" /> Filtros:
          </span>
          {['all', 'trabalho', 'treino', 'saude', 'pessoal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Todas' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {completedCount} de {totalCount} concluídas
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
            <CheckSquare className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
              Nenhuma tarefa encontrada com os filtros atuais
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Adicione uma tarefa no campo acima ou peça para a IA no Chat criar para você.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                task.completed
                  ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-75'
                  : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => handleCheck(task)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span
                      className={`text-xs sm:text-sm font-semibold ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                    {getPriorityBadge(task.priority)}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getCategoryColor(
                        task.category
                      )}`}
                    >
                      {task.category}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Prazo: {task.dueDate}</span>
                    </span>
                    {task.calendarEventId && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Sincronizada no Calendar</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2 self-end sm:self-center pl-8 sm:pl-0">
                <button
                  onClick={() => onSyncTaskToCalendar(task)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                  title="Bloquear horário desta tarefa no Google Calendar"
                >
                  <Calendar className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleWhatsAppReminder(task)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                  title="Enviar lembrete desta tarefa via WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Excluir tarefa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nova Tarefa Completa */}
      {showFullModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Nova Tarefa Detalhada
              </h3>
              <button
                onClick={() => setShowFullModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFullModalSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Entregar relatório trimestral"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição ou Checklist
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalhes, links de referência ou passos..."
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={modalCategory}
                    onChange={(e) => setModalCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="trabalho">Trabalho</option>
                    <option value="treino">Treino</option>
                    <option value="saude">Saúde</option>
                    <option value="pessoal">Pessoal</option>
                    <option value="estudos">Estudos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={modalPriority}
                    onChange={(e) => setModalPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="urgente">Urgente</option>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Data Limite (Prazo)
                </label>
                <input
                  type="date"
                  value={modalDate}
                  onChange={(e) => setModalDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="modal-wa"
                  checked={modalWhatsAppReminder}
                  onChange={(e) => setModalWhatsAppReminder(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                />
                <label htmlFor="modal-wa" className="text-xs text-slate-700 dark:text-slate-300">
                  Agendar lembrete via WhatsApp para esta tarefa
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowFullModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Criar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
