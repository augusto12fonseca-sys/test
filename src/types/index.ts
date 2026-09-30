export type AgentType = 'sistem' | 'orchestrator' | 'personal_assistant' | 'personal_trainer' | 'professor';

export interface WhatsAppChatMessage {
  id: string;
  sender: 'user' | 'sistem';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface StudyTopic {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
  summary?: string;
}

export interface StudySubject {
  id: string;
  name: string; // ex: 'Programação TypeScript', 'Cálculo & Matemática', 'Filosofia', 'Fisiologia do Exercício', 'Inglês'
  category: string;
  description: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  topics: StudyTopic[];
  createdAt: string;
  lastStudiedAt?: string;
}

export interface SportsItem {
  id: string;
  name: string;
  category: 'artes_marciais' | 'estilos_esportivos' | 'musculacao_calistenia' | 'esportes_gerais';
  subCategory: string;
  targetMuscles: string[];
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  description: string;
  technicalTips: string[];
  painPreventionAndStrengthening: {
    commonPainArea: string;
    strengtheningExercise: string;
    preventionTip: string;
  };
}

export type Priority = 'baixa' | 'media' | 'alta' | 'urgente';
export type TaskCategory = 'trabalho' | 'treino' | 'saude' | 'pessoal' | 'estudos';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD or ISO
  dueTime?: string; // HH:mm
  priority: Priority;
  category: TaskCategory;
  completed: boolean;
  calendarEventId?: string;
  reminderWhatsApp?: boolean;
  reminderTime?: string;
  createdAt: string;
}

export interface CalendarEventItem {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  htmlLink?: string;
  attendees?: Array<{ email: string; displayName?: string }>;
  isLocalOnly?: boolean;
  colorId?: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  targetMuscle: string;
  completed?: boolean;
  notes?: string;
  instructions?: string[];
  formTips?: string[];
  commonMistakes?: string[];
  muscleWikiUrl?: string;
  equipment?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  focus: string; // ex: 'Membros Superiores & Core', 'Pernas & Mobilidade', 'Cardio & Resistência'
  dayOfWeek: string; // 'Segunda', 'Terça', etc.
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  durationMinutes: number;
  exercises: ExerciseItem[];
  completed: boolean;
  feedback?: {
    rpe: number; // 1-10
    completionPercentage: number;
    feltPain: boolean;
    painArea?: string;
    painSeverity?: number; // 1-10
    userNotes?: string;
    coachFeedback?: string;
    date: string;
  };
}

export interface PainGuidance {
  id: string;
  area: string;
  title: string;
  shortDescription: string;
  commonCauses: string[];
  immediateSteps: string[];
  exercisesAndStretches: Array<{
    name: string;
    howTo: string;
    durationOrReps: string;
  }>;
  contraindications: string[];
  whenToSeeDoctor: string;
}

export interface WhatsAppReminder {
  id: string;
  targetPhone: string;
  title: string;
  message: string;
  scheduledFor: string; // ISO string
  type: 'meeting' | 'task' | 'workout' | 'hydration_check' | 'custom';
  status: 'pending' | 'sent' | 'cancelled';
  autoTrigger: boolean;
  lastSentAt?: string;
}

export interface UserPreferences {
  userName: string;
  whatsappPhone: string;
  wakeUpTime: string;
  sleepTime: string;
  workHours: {
    start: string;
    end: string;
  };
  fitnessGoal: 'hipertrofia' | 'emagrecimento' | 'resistencia' | 'saude_geral' | 'condicionamento';
  fitnessLevel: 'iniciante' | 'intermediario' | 'avancado';
  preferredWorkoutDays: string[];
  preferredWorkoutTime: string;
  knownPains: Array<{
    area: string;
    severity: number;
    notes: string;
  }>;
  communicationTone: 'direto_sincero' | 'muito_direto' | 'acolhedor_firme';
  learnedMemories: string[];
  practicedSports?: string[];
}

export interface ChatSuggestedAction {
  type: 'CREATE_TASK' | 'SCHEDULE_MEETING' | 'SEND_WHATSAPP' | 'ADJUST_WORKOUT' | 'VIEW_PAIN_GUIDE' | 'EXPORT_REPORT' | 'EXPLAIN_TOPIC' | 'CREATE_STUDY_SUBJECT';
  label: string;
  payload?: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentType?: AgentType;
  agentName?: string;
  delegationNote?: string;
  suggestedActions?: ChatSuggestedAction[];
  learnedMemorySuggestion?: string;
  appliedAction?: string;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  tasksCompleted: number;
  tasksTotal: number;
  workoutDone: boolean;
  workoutRpe?: number;
  meetingsTotal: number;
  meetingsCompleted: number;
  waterGlasses: number; // 250ml cada
  waterGoalGlasses: number;
  dailyScore: number; // 0-100%
  honestFeedback?: string;
}
