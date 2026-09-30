import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  Users,
  Plus,
  Trash2,
  ExternalLink,
  Send,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { CalendarEventItem } from '../types';
import { openWhatsApp, buildMeetingWhatsAppMsg } from '../services/whatsappService';

interface CalendarManagerProps {
  events: CalendarEventItem[];
  isLoading: boolean;
  onRefreshEvents: () => void;
  onCreateEvent: (eventData: {
    summary: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
    location?: string;
    attendeesEmails?: string[];
  }) => Promise<any>;
  onDeleteEvent: (eventId: string) => Promise<any>;
  isGoogleConnected: boolean;
  onGoogleLogin: () => void;
  whatsappPhone: string;
}

export const CalendarManager: React.FC<CalendarManagerProps> = ({
  events,
  isLoading,
  onRefreshEvents,
  onCreateEvent,
  onDeleteEvent,
  isGoogleConnected,
  onGoogleLogin,
  whatsappPhone,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('14:45');
  const [location, setLocation] = useState('Google Meet');
  const [attendees, setAttendees] = useState('');
  const [scheduleWhatsAppReminder, setScheduleWhatsAppReminder] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    setIsSubmitting(true);
    try {
      const startDateTime = `${date}T${startTime}:00`;
      const endDateTime = `${date}T${endTime}:00`;
      const attendeesList = attendees
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      await onCreateEvent({
        summary,
        description,
        startDateTime,
        endDateTime,
        location,
        attendeesEmails: attendeesList,
      });

      if (scheduleWhatsAppReminder) {
        setToastMsg(`Reunião agendada e lembrete configurado para ${whatsappPhone}!`);
      } else {
        setToastMsg('Reunião criada com sucesso!');
      }

      setShowModal(false);
      setSummary('');
      setDescription('');
      setAttendees('');
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      alert(`Erro ao criar reunião: ${err.message || 'Tente novamente'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMeetingWhatsApp = (ev: CalendarEventItem) => {
    const startStr = ev.start?.dateTime
      ? new Date(ev.start.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : 'Horário a definir';
    const msg = buildMeetingWhatsAppMsg(ev.summary, startStr, ev.location);
    openWhatsApp(whatsappPhone, msg);
  };

  const formatEventDate = (ev: CalendarEventItem) => {
    const dateVal = ev.start?.dateTime || ev.start?.date;
    if (!dateVal) return 'Sem data definida';
    const d = new Date(dateVal);
    return d.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatEventTime = (ev: CalendarEventItem) => {
    if (!ev.start?.dateTime) return 'Dia inteiro';
    const s = new Date(ev.start.dateTime);
    const e = ev.end?.dateTime ? new Date(ev.end.dateTime) : null;
    const startFmt = s.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const endFmt = e ? e.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
    return endFmt ? `${startFmt} - ${endFmt}` : startFmt;
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-500 text-white font-medium text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-emerald-500/20">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-white/80 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Top Banner: Connection status & actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-sm gap-4">
        <div className="flex items-start sm:items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isGoogleConnected
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                Google Calendar Integrado
              </h2>
              {isGoogleConnected ? (
                <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Sincronizado</span>
                </span>
              ) : (
                <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Modo Local / Desconectado
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isGoogleConnected
                ? 'Seus agendamentos e reuniões estão sincronizados em tempo real com a sua conta Google.'
                : 'Conecte sua conta Google para sincronizar suas reuniões diretamente no seu aplicativo do Calendar.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-center">
          {!isGoogleConnected && (
            <button
              onClick={onGoogleLogin}
              className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <span>Conectar Google Calendar</span>
            </button>
          )}

          <button
            onClick={onRefreshEvents}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Atualizar eventos da agenda"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar Reunião</span>
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Próximas Reuniões e Compromissos</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {events.length}
            </span>
          </h3>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
            <CalendarIcon className="w-12 h-12 mx-auto text-slate-400 mb-3" />
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              Nenhuma reunião agendada no momento
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Clique no botão "Agendar Reunião" ou peça para a IA no Chat agendar com linguagem natural.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Criar Primeiro Agendamento
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-2xl border transition-all bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                        {ev.summary}
                      </h4>
                      <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatEventDate(ev)} • {formatEventTime(ev)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteEvent(ev.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Excluir reunião"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {ev.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                      {ev.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {ev.location && (
                      <span className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-md">
                        {ev.location.toLowerCase().includes('meet') ? (
                          <Video className="w-3 h-3 text-blue-500" />
                        ) : (
                          <MapPin className="w-3 h-3 text-red-500" />
                        )}
                        <span>{ev.location}</span>
                      </span>
                    )}

                    {ev.attendees && ev.attendees.length > 0 && (
                      <span className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-md">
                        <Users className="w-3 h-3 text-purple-500" />
                        <span>{ev.attendees.length} participante(s)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Event Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <button
                    onClick={() => handleSendMeetingWhatsApp(ev)}
                    className="flex items-center space-x-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    title="Enviar lembrete desta reunião via WhatsApp"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Lembrete no WhatsApp</span>
                  </button>

                  {ev.htmlLink && (
                    <a
                      href={ev.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <span>Abrir no Calendar</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Nova Reunião */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-emerald-500" />
                <span>Agendar Nova Reunião</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título da Reunião *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alinhamento de Metas ou Consulta Fisiológica"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Início
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Término
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Local ou Plataforma
                </label>
                <input
                  type="text"
                  placeholder="Google Meet, Zoom ou Escritório"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Participantes (e-mails separados por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="exemplo@gmail.com, colega@empresa.com"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição / Pauta
                </label>
                <textarea
                  rows={2}
                  placeholder="Objetivos da reunião e pontos a debater..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="wa-check"
                  checked={scheduleWhatsAppReminder}
                  onChange={(e) => setScheduleWhatsAppReminder(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="wa-check" className="text-xs text-slate-700 dark:text-slate-300">
                  Criar lembrete automático no WhatsApp ({whatsappPhone})
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center space-x-1"
                >
                  {isSubmitting ? (
                    <span>Sincronizando...</span>
                  ) : (
                    <span>Salvar e Agendar</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
