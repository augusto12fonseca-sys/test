import { UserPreferences } from '../types';

const PREFERENCES_STORAGE_KEY = 'nexuspulse_user_preferences_v1';

export const DEFAULT_PREFERENCES: UserPreferences = {
  userName: 'Augusto',
  whatsappPhone: '+55 11 99999-9999',
  wakeUpTime: '06:30',
  sleepTime: '23:00',
  workHours: {
    start: '09:00',
    end: '18:00',
  },
  fitnessGoal: 'hipertrofia',
  fitnessLevel: 'intermediario',
  preferredWorkoutDays: ['Segunda', 'Terça', 'Quinta', 'Sexta'],
  preferredWorkoutTime: '07:30',
  knownPains: [
    {
      area: 'Lombar',
      severity: 3,
      notes: 'Desconforto após muitas horas sentado em frente ao computador e em agachamentos pesados',
    },
    {
      area: 'Trapézio & Cervical',
      severity: 4,
      notes: 'Tensão frequente ao final do expediente de trabalho',
    },
  ],
  communicationTone: 'direto_sincero',
  learnedMemories: [
    'Prefere reuniões de no máximo 45 minutos para manter o foco alto.',
    'Gosta de treinar de manhã cedo antes das reuniões de trabalho.',
    'Costuma procrastinar tarefas burocráticas se não tiver um lembrete no WhatsApp.',
    'Precisa de 5 minutos de mobilidade de quadril antes de treinar pernas para evitar incômodo na lombar.',
    'Aprecia feedbacks francos e realistas: sem enrolação sobre o que foi bom e o que precisa ser corrigido.',
  ],
  practicedSports: ['Jiu-Jitsu (BJJ)', 'Musculação', 'Taekwondo'],
};

export const getStoredPreferences = (): UserPreferences => {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
      return DEFAULT_PREFERENCES;
    }
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error loading preferences', err);
    return DEFAULT_PREFERENCES;
  }
};

export const savePreferences = (prefs: UserPreferences) => {
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error('Error saving preferences', err);
  }
};

export const addLearnedMemory = (memory: string): UserPreferences => {
  const current = getStoredPreferences();
  if (!current.learnedMemories.includes(memory.trim())) {
    current.learnedMemories = [memory.trim(), ...current.learnedMemories];
    savePreferences(current);
  }
  return current;
};

export const removeLearnedMemory = (index: number): UserPreferences => {
  const current = getStoredPreferences();
  current.learnedMemories = current.learnedMemories.filter((_, i) => i !== index);
  savePreferences(current);
  return current;
};
