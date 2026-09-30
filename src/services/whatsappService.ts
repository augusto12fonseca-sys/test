import { WhatsAppReminder, WhatsAppChatMessage } from '../types';

const REMINDERS_KEY = 'nexuspulse_whatsapp_reminders_v1';
const WHATSAPP_PHONE_KEY = 'nexuspulse_default_whatsapp_phone_v1';
const WHATSAPP_CHAT_KEY = 'sistem_whatsapp_chat_v1';
const WHATSAPP_NOTIF_PREF_KEY = 'sistem_whatsapp_sound_notif_v1';

export const getDefaultPhone = (): string => {
  return localStorage.getItem(WHATSAPP_PHONE_KEY) || '+55 11 99999-9999';
};

export const setDefaultPhone = (phone: string) => {
  localStorage.setItem(WHATSAPP_PHONE_KEY, phone);
};

export const sanitizePhoneNumber = (raw: string): string => {
  let cleaned = raw.replace(/[^\d+]/g, '');
  if (!cleaned.startsWith('+')) {
    // If user provided a Brazilian number without +55, prefix standard
    if (cleaned.length === 10 || cleaned.length === 11) {
      cleaned = '+55' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }
  return cleaned.replace('+', '');
};

export const getWhatsAppUrl = (phone: string, message: string): string => {
  const cleanPhone = sanitizePhoneNumber(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
};

export const getNativeWhatsAppUrl = (phone: string, message: string): string => {
  const cleanPhone = sanitizePhoneNumber(phone);
  const encoded = encodeURIComponent(message);
  return `whatsapp://send?phone=${cleanPhone}&text=${encoded}`;
};

export const openWhatsApp = (phone: string, message: string, useNativeApp = false) => {
  const url = useNativeApp ? getNativeWhatsAppUrl(phone, message) : getWhatsAppUrl(phone, message);
  window.open(url, '_blank', 'noopener,noreferrer');
};

// Web Audio API synthesized notification sound (Zero external audio files needed)
export const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // WhatsApp-inspired pleasant notification chord (D5 -> A5)
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Audio context may be restricted before user interaction
  }
};

// Native Desktop Browser Notification
export const requestDesktopNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const sendLocalDesktopNotification = (title: string, body: string) => {
  playNotificationChime();
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    } catch (e) {}
  }
};

export const getStoredReminders = (): WhatsAppReminder[] => {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    if (!raw) {
      // Default initial templates to help user test immediately
      const now = new Date();
      const inFifteen = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
      const inOneHour = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

      const defaults: WhatsAppReminder[] = [
        {
          id: 'rem-1',
          targetPhone: getDefaultPhone(),
          title: 'Lembrete de Reunião: Alinhamento de Metas',
          message: `⏰ *Sistem | Lembrete de Reunião*\n\nSua reunião *"Alinhamento Semanal de Metas"* começará em breve!\n📍 Local: Google Meet\n\n_Organize seus tópicos e mantenha o foco na entrega._`,
          scheduledFor: inFifteen,
          type: 'meeting',
          status: 'pending',
          autoTrigger: true,
        },
        {
          id: 'rem-2',
          targetPhone: getDefaultPhone(),
          title: 'Treino & Mobilidade: Hora da Disciplina',
          message: `🏋️‍♂️ *Sistem | Alerta de Treino (MuscleWiki)*\n\nChegou a hora de honrar o compromisso com o seu corpo! Treino de hoje planejado.\n\nConsulte os passos biomecânicos na base MuscleWiki e mantenha a cadência estrita. Beba água e vamos pra cima! 🔥`,
          scheduledFor: inOneHour,
          type: 'workout',
          status: 'pending',
          autoTrigger: true,
        },
      ];
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading whatsapp reminders', err);
    return [];
  }
};

export const saveReminders = (reminders: WhatsAppReminder[]) => {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  } catch (err) {
    console.error('Error saving reminders', err);
  }
};

export const createReminder = (reminder: Omit<WhatsAppReminder, 'id' | 'status'>): WhatsAppReminder => {
  const newReminder: WhatsAppReminder = {
    ...reminder,
    id: `rem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: 'pending',
  };
  const list = getStoredReminders();
  const updated = [newReminder, ...list];
  saveReminders(updated);
  return newReminder;
};

export const markReminderSent = (id: string) => {
  const list = getStoredReminders();
  const updated = list.map((r) =>
    r.id === id ? { ...r, status: 'sent' as const, lastSentAt: new Date().toISOString() } : r
  );
  saveReminders(updated);
};

export const deleteReminder = (id: string) => {
  const list = getStoredReminders();
  const updated = list.filter((r) => r.id !== id);
  saveReminders(updated);
};

// WhatsApp Direct Chat with Sistem storage
export const getStoredWhatsAppChat = (): WhatsAppChatMessage[] => {
  try {
    const raw = localStorage.getItem(WHATSAPP_CHAT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const initial: WhatsAppChatMessage[] = [
    {
      id: 'wa-init-1',
      sender: 'sistem',
      text: `Olá! Eu sou o *Sistem* no seu WhatsApp local! 👋\n\nConexão local 100% ativa e privada. Você pode conversar comigo a qualquer momento:\n• 🏋️‍♂️ */treino* — Resumo do treino e passos dos exercícios\n• 📅 */agenda* — Seus compromissos do Google Calendar\n• 🎯 */tarefas* — Prioridades do dia\n• 💪 Tirar dúvidas técnicas sobre biomecânica e execução\n• 💆‍♂️ Pedir alívio para dores ou orientações posturais\n\nO que vamos realizar hoje?`,
      timestamp: nowStr,
      status: 'read',
    },
  ];
  return initial;
};

export const saveStoredWhatsAppChat = (chat: WhatsAppChatMessage[]) => {
  try {
    localStorage.setItem(WHATSAPP_CHAT_KEY, JSON.stringify(chat));
  } catch (e) {
    console.error('Error saving whatsapp chat', e);
  }
};

export const exportWhatsAppChatToTxt = (chat: WhatsAppChatMessage[]) => {
  const lines = chat.map(
    (m) => `[${m.timestamp}] ${m.sender === 'user' ? 'Você' : 'Sistem'}: ${m.text}`
  );
  const blob = new Blob([lines.join('\n\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `conversa_whatsapp_sistem_${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// Message templates
export const buildMeetingWhatsAppMsg = (
  meetingTitle: string,
  startTimeStr: string,
  location?: string
): string => {
  return `📅 *Sistem | Lembrete de Reunião*\n\nOlá! Passando para avisar que sua reunião está próxima:\n\n📌 *Assunto:* ${meetingTitle}\n⏰ *Horário:* ${startTimeStr}\n📍 *Local:* ${location || 'Google Meet / Presencial'}\n\n_Dica do Sistem: organize seus tópicos principais para uma reunião produtiva!_`;
};

export const buildTaskWhatsAppMsg = (
  taskTitle: string,
  priority: string,
  category: string
): string => {
  return `🎯 *Sistem | Foco em Tarefa Prioritária*\n\nNão deixe para depois! Você tem a seguinte tarefa pendente:\n\n⚡ *Tarefa:* ${taskTitle}\n🏷️ *Categoria:* ${category.toUpperCase()}\n🔥 *Prioridade:* ${priority.toUpperCase()}\n\n_Disciplina diária constrói grandes resultados._`;
};

export const buildWorkoutWhatsAppMsg = (
  workoutTitle: string,
  focus: string,
  durationMinutes: number
): string => {
  return `🏋️‍♂️ *Sistem | Alerta de Treino*\n\nChegou a hora de honrar o compromisso com o seu corpo:\n\n🔥 *Rotina de Hoje:* ${workoutTitle}\n🎯 *Foco:* ${focus}\n⏱️ *Duração Estimada:* ${durationMinutes} min\n\n_Consulte o passo a passo da biomecânica e execute com cadência controlada. Vista a roupa de treino agora!_ 💪`;
};

export const buildPainReliefWhatsAppMsg = (
  area: string,
  tip: string
): string => {
  return `💆‍♂️ *Sistem | Alívio e Descompressão*\n\nLembrete de autocuidado para a sua região *${area}*:\n\n✨ *Ação Imediata:* ${tip}\n\n_Preste atenção aos sinais do seu corpo e faça 5 minutos de mobilidade agora!_`;
};
