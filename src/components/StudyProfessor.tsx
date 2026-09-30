import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  Brain,
  Layers,
  ArrowRight,
  MessageSquare,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { StudySubject, StudyTopic } from '../types';
import { sendMessageToAI } from '../services/aiService';

interface StudyProfessorProps {
  subjects: StudySubject[];
  onAddSubject: (subject: Omit<StudySubject, 'id' | 'createdAt'>) => void;
  onDeleteSubject: (id: string) => void;
  onToggleTopic: (subjectId: string, topicId: string) => void;
  onAddTopic: (subjectId: string, title: string, notes?: string) => void;
  onAskProfessorInChat: (question: string) => void;
  userPreferences: any;
}

export const StudyProfessor: React.FC<StudyProfessorProps> = ({
  subjects,
  onAddSubject,
  onDeleteSubject,
  onToggleTopic,
  onAddTopic,
  onAskProfessorInChat,
  userPreferences,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [lessonPrompt, setLessonPrompt] = useState('');
  const [generatedLesson, setGeneratedLesson] = useState<string | null>(null);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);

  // New subject form
  const [newSubName, setNewSubName] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('Tecnologia');
  const [newSubDescription, setNewSubDescription] = useState('');
  const [newSubLevel, setNewSubLevel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Intermediário');

  // New topic form
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicNotes, setNewTopicNotes] = useState('');

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    onAddSubject({
      name: newSubName.trim(),
      category: newSubCategory.trim(),
      description: newSubDescription.trim(),
      level: newSubLevel,
      topics: [
        { id: `t-${Date.now()}-1`, title: 'Fundamentos e Conceitos Iniciais', completed: false },
        { id: `t-${Date.now()}-2`, title: 'Aplicações Práticas e Exemplos', completed: false },
      ],
    });

    setShowAddSubjectModal(false);
    setNewSubName('');
    setNewSubDescription('');
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !currentSubject) return;

    onAddTopic(currentSubject.id, newTopicTitle.trim(), newTopicNotes.trim());
    setShowAddTopicModal(false);
    setNewTopicTitle('');
    setNewTopicNotes('');
  };

  const handleRequestLesson = async (topicTitle?: string) => {
    const question = topicTitle || lessonPrompt;
    if (!question.trim()) return;

    setIsGeneratingLesson(true);
    setGeneratedLesson(null);

    try {
      const response = await sendMessageToAI({
        messages: [
          {
            role: 'user',
            content: `Como Professor Universitário e Tutor Didático da matéria "${currentSubject?.name || 'Geral'}", ministre uma mini-aula completa, acessível e engajadora sobre: "${question}". Estruture com: 1. Conceito Didático Descomplicado, 2. Analogia do Cotidiano, 3. Exemplo Prático, 4. Pergunta Rápida de Fixação.`,
          },
        ],
        userPreferences,
        requestedAgent: 'professor',
        context: {
          tasks: [],
          calendarEvents: [],
          studySubjects: subjects,
          todayStats: {},
        },
      });

      setGeneratedLesson(response.reply);
    } catch (e) {
      console.error(e);
      setGeneratedLesson('Não foi possível gerar a aula neste instante. Tente novamente em instantes.');
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Nexus Professor | Tutor Multidisciplinar
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                Mini-Agente Educacional
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Capaz de ensinar qualquer matéria (Programação, Matemática, Idiomas, Filosofia, Física) organizado pelas disciplinas que você definir.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddSubjectModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 transition-all self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Disciplina</span>
        </button>
      </div>

      {/* Disciplines Selector & Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Subjects List */}
        <div className="space-y-3 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Suas Disciplinas ({subjects.length})
            </h3>
          </div>

          <div className="space-y-2">
            {subjects.map((sub) => {
              const isSelected = currentSubject?.id === sub.id;
              const completedCount = sub.topics.filter((t) => t.completed).length;
              const totalCount = sub.topics.length;
              const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/30 dark:bg-purple-950/20 ring-2 ring-purple-500/20'
                      : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {sub.category} • {sub.level}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSubject(sub.id);
                      }}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Excluir disciplina"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {sub.name}
                  </h4>

                  <div className="mt-2.5 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Progresso dos Tópicos</span>
                      <span>{completedCount}/{totalCount} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Subject Topics & Interactive Lesson Room */}
        <div className="space-y-4 lg:col-span-2">
          {currentSubject ? (
            <div className="p-5 sm:p-6 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    {currentSubject.category} • Nível {currentSubject.level}
                  </span>
                  <button
                    onClick={() => setShowAddTopicModal(true)}
                    className="flex items-center space-x-1 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Tópico</span>
                  </button>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {currentSubject.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {currentSubject.description}
                </p>
              </div>

              {/* Topics Checklist */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
                  Tópicos de Estudo da Disciplina:
                </h4>

                {currentSubject.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      topic.completed
                        ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onToggleTopic(currentSubject.id, topic.id)}
                        className="text-slate-400 hover:text-purple-600 transition-colors"
                      >
                        <CheckCircle
                          className={`w-5 h-5 ${
                            topic.completed ? 'text-purple-600 fill-purple-600/20' : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>

                      <div>
                        <h5
                          className={`text-xs font-bold ${
                            topic.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {topic.title}
                        </h5>
                        {topic.notes && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {topic.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRequestLesson(topic.title)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 flex items-center space-x-1"
                      title="Pedir aula explicativa sobre este tópico"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Pedir Aula</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Ask Custom Lesson Box */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 dark:bg-purple-950/20 dark:border-purple-900/50 space-y-2.5">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  Dúvida Específica ou Tópico Livre para o Professor IA Ensinar:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={lessonPrompt}
                    onChange={(e) => setLessonPrompt(e.target.value)}
                    placeholder={`Ex: Como entender melhor ${currentSubject.name} com um exemplo prático?`}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                  <button
                    onClick={() => handleRequestLesson()}
                    disabled={isGeneratingLesson || !lessonPrompt.trim()}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingLesson ? 'Ensinando...' : 'Explicar Agora'}</span>
                  </button>
                </div>
              </div>

              {/* Lesson Display Panel */}
              {isGeneratingLesson && (
                <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 flex items-center space-x-3 text-xs text-purple-600 dark:text-purple-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping"></div>
                  <span>Nexus Professor preparando a melhor metodologia e analogias para você...</span>
                </div>
              )}

              {generatedLesson && (
                <div className="p-4 sm:p-5 rounded-2xl border border-purple-300 dark:border-purple-800 bg-white dark:bg-slate-800/90 shadow-sm space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-extrabold text-purple-700 dark:text-purple-400 flex items-center space-x-1.5">
                      <GraduationCap className="w-4 h-4" />
                      <span>Aula Ministrada pelo Nexus Professor</span>
                    </span>
                    <button
                      onClick={() => onAskProfessorInChat(`Professor, sobre a aula de ${currentSubject.name}: quero tirar mais dúvidas.`)}
                      className="text-xs text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Continuar no Chat</span>
                    </button>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    {generatedLesson}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
              <BookOpen className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                Nenhuma disciplina cadastrada
              </p>
              <button
                onClick={() => setShowAddSubjectModal(true)}
                className="mt-3 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 text-white"
              >
                Cadastrar Primeira Disciplina
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nova Disciplina */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <span>Cadastrar Nova Disciplina</span>
              </h3>
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome da Disciplina / Matéria *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Filosofia Estóica, Estatística & Probabilidade, Francês"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Área do Conhecimento
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Exatas, Tecnologia, Humanas, Idiomas"
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nível Inicial
                  </label>
                  <select
                    value={newSubLevel}
                    onChange={(e) => setNewSubLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Objetivo / Descrição
                </label>
                <textarea
                  rows={2}
                  placeholder="O que você quer dominar nesta matéria..."
                  value={newSubDescription}
                  onChange={(e) => setNewSubDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Salvar Disciplina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Novo Tópico */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Adicionar Tópico à Disciplina
              </h3>
              <button
                onClick={() => setShowAddTopicModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título do Tópico *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Condicionais e Funções de Ordem Superior"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Anotações ou Metas de Aprendizado (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Pontos de foco ao estudar este tópico..."
                  value={newTopicNotes}
                  onChange={(e) => setNewTopicNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Adicionar Tópico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
