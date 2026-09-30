import { StudySubject } from '../types';

const STUDY_SUBJECTS_KEY = 'nexuspulse_study_subjects_v1';

export const INITIAL_SUBJECTS: StudySubject[] = [
  {
    id: 'sub-prog',
    name: 'Programação Full-Stack & Inteligência Artificial',
    category: 'Tecnologia',
    description: 'Conceitos práticos de TypeScript, APIs REST, Node.js, orquestração de multi-agentes e engenharia de prompts.',
    level: 'Intermediário',
    createdAt: new Date().toISOString(),
    topics: [
      { id: 't-1', title: 'Fundamentos de TypeScript e Generics', completed: true, notes: 'Dominar tipagem estrita e inferência.' },
      { id: 't-2', title: 'Arquitetura Multi-Agente e Orquestração', completed: true, notes: 'Delegação de tarefas entre agentes especializados.' },
      { id: 't-3', title: 'Integração de APIs de LLM (Gemini 3.8 Flash)', completed: true, notes: 'Chamadas estruturadas e extração de ações JSON.' },
      { id: 't-4', title: 'Otimização de Performance e Memoização no React', completed: false, notes: 'useCallback, useMemo e virtualização.' },
    ],
  },
  {
    id: 'sub-fisiol',
    name: 'Fisiologia do Exercício & Biomecânica Esportiva',
    category: 'Saúde & Esportes',
    description: 'Estudo do sistema neuromuscular, vias energéticas em lutas e musculação, e mecanismos de recuperação e lesão.',
    level: 'Intermediário',
    createdAt: new Date().toISOString(),
    topics: [
      { id: 't-5', title: 'Vias Energéticas: ATP-CP, Glicolítica e Oxidativa', completed: true, notes: 'Demanda fisiológica em rounds de luta vs séries de musculação.' },
      { id: 't-6', title: 'Cinemática do Agachamento e Forças de Cisalhamento', completed: true, notes: 'Prevenção de sobrecarga na patela e na coluna lombar.' },
      { id: 't-7', title: 'Mecanismos de Dor Muscular Tardia (DOMS) e Fáscia', completed: false, notes: 'Diferença entre inflamação saudável e lesão ligamentar.' },
      { id: 't-8', title: 'Periodização Linear e Ondulatória para Atletas', completed: false, notes: 'Ajuste de volume e intensidade para evitar overtraining.' },
    ],
  },
  {
    id: 'sub-ingles',
    name: 'Inglês Prático para Negócios & Conversação',
    category: 'Idiomas',
    description: 'Desenvolvimento de fluência natural, vocabulário para reuniões técnicas e comunicação clara sem medo de errar.',
    level: 'Iniciante',
    createdAt: new Date().toISOString(),
    topics: [
      { id: 't-9', title: 'Estruturação de Reuniões: Opening, Agenda & Wrap-up', completed: false, notes: 'Expressões-chave para conduzir alinhamentos.' },
      { id: 't-10', title: 'Negociação e Pitching de Ideias em Inglês', completed: false, notes: 'Argumentação polida e firme em apresentações.' },
      { id: 't-11', title: 'Small Talk & Networking Internacional', completed: false, notes: 'Construção de rapport genuíno com colegas globais.' },
    ],
  },
];

export const getStoredSubjects = (): StudySubject[] => {
  try {
    const raw = localStorage.getItem(STUDY_SUBJECTS_KEY);
    if (!raw) {
      localStorage.setItem(STUDY_SUBJECTS_KEY, JSON.stringify(INITIAL_SUBJECTS));
      return INITIAL_SUBJECTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading study subjects', err);
    return INITIAL_SUBJECTS;
  }
};

export const saveSubjects = (subjects: StudySubject[]) => {
  try {
    localStorage.setItem(STUDY_SUBJECTS_KEY, JSON.stringify(subjects));
  } catch (err) {
    console.error('Error saving study subjects', err);
  }
};

export const addSubject = (subject: Omit<StudySubject, 'id' | 'createdAt'>): StudySubject => {
  const newSubject: StudySubject = {
    ...subject,
    id: `sub-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const list = getStoredSubjects();
  const updated = [newSubject, ...list];
  saveSubjects(updated);
  return newSubject;
};

export const deleteSubject = (id: string) => {
  const list = getStoredSubjects();
  const updated = list.filter((s) => s.id !== id);
  saveSubjects(updated);
};

export const toggleTopicStatus = (subjectId: string, topicId: string) => {
  const list = getStoredSubjects();
  const updated = list.map((s) => {
    if (s.id !== subjectId) return s;
    return {
      ...s,
      lastStudiedAt: new Date().toISOString(),
      topics: s.topics.map((t) => (t.id === topicId ? { ...t, completed: !t.completed } : t)),
    };
  });
  saveSubjects(updated);
};

export const addTopicToSubject = (subjectId: string, title: string, notes?: string) => {
  const list = getStoredSubjects();
  const updated = list.map((s) => {
    if (s.id !== subjectId) return s;
    const newTopic = {
      id: `top-${Date.now()}`,
      title,
      completed: false,
      notes,
    };
    return {
      ...s,
      topics: [...s.topics, newTopic],
    };
  });
  saveSubjects(updated);
};
