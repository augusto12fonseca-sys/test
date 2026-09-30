import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Phone,
  Clock,
  CheckCircle2,
  Trash2,
  Plus,
  Play,
  Pause,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Copy,
  ExternalLink,
  Bot,
  User,
  Check,
  CheckCheck,
  Info,
  QrCode,
  ShieldCheck,
  Terminal,
  Volume2,
  Bell,
  BellRing,
  Download,
  Search,
  Mic,
  Share2,
  RefreshCw,
} from 'lucide-react';
import { WhatsAppReminder, WhatsAppChatMessage, UserPreferences } from '../types';
import {
  getWhatsAppUrl,
  getNativeWhatsAppUrl,
  openWhatsApp,
  buildMeetingWhatsAppMsg,
  buildWorkoutWhatsAppMsg,
  buildTaskWhatsAppMsg,
  buildPainReliefWhatsAppMsg,
  getStoredWhatsAppChat,
  saveStoredWhatsAppChat,
  exportWhatsAppChatToTxt,
  playNotificationChime,
  requestDesktopNotificationPermission,
  sendLocalDesktopNotification,
} from '../services/whatsappService';
import { sendWhatsAppMessageToSistem } from '../services/aiService';

interface WhatsAppAutomationProps {
  reminders: WhatsAppReminder[];
  onAddReminder: (reminder: Omit<WhatsAppReminder, 'id' | 'status'>) => void;
  onDeleteReminder: (id: string) => void;
  onMarkSent: (id: string) => void;
  whatsappPhone: string;
  onUpdatePhone: (phone: string) => void;
  userPreferences?: UserPreferences;
}

export const WhatsAppAutomation: React.FC<WhatsAppAutomationProps> = ({
  reminders,
  onAddReminder,
  onDeleteReminder,
  onMarkSent,
  whatsappPhone,
  onUpdatePhone,
  userPreferences,
}) => {
  // Main view tab: 'chat' | 'reminders' | 'status_local'
  const [activeTab, setActiveTab] = useState<'chat' | 'reminders' | 'status_local'>('chat');

  // Phone editing
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState(whatsappPhone);

  // Local notifications permission state
  const [hasDesktopNotification, setHasDesktopNotification] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  // WhatsApp Interactive Chat with Sistem state
  const [chatMessages, setChatMessages] = useState<WhatsAppChatMessage[]>(() => getStoredWhatsAppChat());
  const [chatInput, setChatInput] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Reminders state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<WhatsAppReminder['type']>('meeting');
  const [timeOffsetMinutes, setTimeOffsetMinutes] = useState(15);
  const [autoTrigger, setAutoTrigger] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Save chat to localStorage
  useEffect(() => {
    saveStoredWhatsAppChat(chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSendingChat]);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 4000);
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePhone(phoneInput.trim());
    setEditingPhone(false);
    showToast('Número de WhatsApp atualizado com sucesso!');
  };

  const handleRequestNotification = async () => {
    const granted = await requestDesktopNotificationPermission();
    setHasDesktopNotification(granted);
    if (granted) {
      sendLocalDesktopNotification('Sistem • WhatsApp Local', 'Notificações locais ativadas com sucesso!');
      showToast('Notificações no navegador ativadas!');
    } else {
      showToast('Permissão de notificação não concedida.');
    }
  };

  // Send message in WhatsApp Chat with Sistem
  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim() || isSendingChat) return;

    const userMsg: WhatsAppChatMessage = {
      id: `wa-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const response = await sendWhatsAppMessageToSistem(
        textToSend,
        userPreferences || {
          userName: 'Usuário',
          whatsappPhone,
          fitnessGoal: 'geral' as any,
          wakeUpTime: '07:00',
          sleepTime: '23:00',
          workHours: { start: '09:00', end: '18:00' },
          fitnessLevel: 'intermediario' as any,
          preferredWorkoutDays: [],
          preferredWorkoutTime: '18:00',
          knownPains: [],
          communicationTone: 'direto_sincero' as any,
          learnedMemories: [],
        }
      );

      // Play pleasant synthesized chime locally
      playNotificationChime();

      const sistemMsg: WhatsAppChatMessage = {
        id: `wa-resp-${Date.now()}`,
        sender: 'sistem',
        text: response.reply,
        timestamp: response.timestamp,
        status: 'read',
      };

      setChatMessages((prev) => [...prev, sistemMsg]);

      // If user enabled browser notifications, trigger native popup
      if (hasDesktopNotification && document.hidden) {
        sendLocalDesktopNotification('Sistem • WhatsApp Local', response.reply.slice(0, 100) + '...');
      }
    } catch (err) {
      console.error('Error sending WhatsApp chat', err);
      const errorMsg: WhatsAppChatMessage = {
        id: `wa-err-${Date.now()}`,
        sender: 'sistem',
        text: `*Sistem (WhatsApp Local):* Estou com uma oscilação na rede, mas estou conectado. Você pode abrir o WhatsApp Web diretamente com o botão acima!`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleOpenInRealWhatsApp = (customText?: string, useNativeApp = false) => {
    const text = customText || chatInput || 'Olá Sistem, preciso de orientações para a minha rotina e treino!';
    openWhatsApp(whatsappPhone, text, useNativeApp);
  };

  const handleTestLocalAlert = () => {
    playNotificationChime();
    sendLocalDesktopNotification(
      'Sistem • Teste Local',
      'Disparo de teste local executado com sucesso! Sem dependências externas.'
    );
    showToast('Alerta sonoro e notificação local disparados!');
  };

  const handleClearChat = () => {
    if (window.confirm('Deseja limpar todo o histórico local da conversa com o Sistem?')) {
      const reset = getStoredWhatsAppChat().slice(0, 1);
      setChatMessages(reset);
      saveStoredWhatsAppChat(reset);
      showToast('Histórico da conversa reiniciado.');
    }
  };

  const handleExportChat = () => {
    exportWhatsAppChatToTxt(chatMessages);
    showToast('Histórico exportado com sucesso (.txt)!');
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const scheduledDate = new Date(Date.now() + timeOffsetMinutes * 60 * 1000).toISOString();

    onAddReminder({
      title,
      message,
      targetPhone: whatsappPhone,
      scheduledFor: scheduledDate,
      type,
      autoTrigger,
    });

    setShowModal(false);
    setTitle('');
    setMessage('');
    showToast(`Lembrete "${title}" adicionado à fila local!`);
  };

  const handleTriggerNow = (reminder: WhatsAppReminder) => {
    playNotificationChime();
    openWhatsApp(reminder.targetPhone, reminder.message);
    onMarkSent(reminder.id);
    showToast('Janela do WhatsApp disparada!');
  };

  const handleCopyLink = (reminder: WhatsAppReminder) => {
    const url = getWhatsAppUrl(reminder.targetPhone, reminder.message);
    navigator.clipboard.writeText(url);
    setCopiedId(reminder.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const loadTemplate = (templateType: 'meeting' | 'workout' | 'task' | 'hydration_check') => {
    setType(templateType);
    if (templateType === 'meeting') {
      setTitle('Lembrete de Reunião: Alinhamento Estratégico');
      setMessage(buildMeetingWhatsAppMsg('Alinhamento Estratégico', 'em 15 minutos', 'Google Meet'));
    } else if (templateType === 'workout') {
      setTitle('Hora do Treino Sistem (MuscleWiki)');
      setMessage(buildWorkoutWhatsAppMsg('Superiores & Core', 'Postura estrita e cadência controlada', 45));
    } else if (templateType === 'task') {
      setTitle('Foco em Tarefa Prioritária');
      setMessage(buildTaskWhatsAppMsg('Finalizar relatório de metas', 'alta', 'trabalho'));
    } else if (templateType === 'hydration_check') {
      setTitle('Pausa Postural & Hidratação');
      setMessage(buildPainReliefWhatsAppMsg('Lombar e Ombros', 'Beba 1 copo de água, levante-se da cadeira e faça 1 minuto de alongamento para o peitoral e trapézio.'));
    }
  };

  // Filter messages by search if typed
  const displayedMessages = chatSearch.trim()
    ? chatMessages.filter((m) => m.text.toLowerCase().includes(chatSearch.toLowerCase()))
    : chatMessages;

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-5">
      {/* Toast Notice */}
      {toastNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500 text-white font-medium text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{toastNotice}</span>
          </div>
          <button onClick={() => setToastNotice(null)} className="text-white/80 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Top Banner: Local Engine Status & Phone Configuration */}
      <div className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Integração WhatsApp Local com o Sistem
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>100% Local</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Converse em tempo real com o Sistem, execute disparos rápidos via wa.me e gerencie alertas sonoros nativos.
            </p>
          </div>
        </div>

        {/* Action Controls & Phone */}
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {/* Notification Permission Toggle */}
          <button
            onClick={handleRequestNotification}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              hasDesktopNotification
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'
            }`}
            title="Ativar/desativar notificações nativas do sistema no navegador"
          >
            {hasDesktopNotification ? <BellRing className="w-3.5 h-3.5 text-emerald-600" /> : <Bell className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {hasDesktopNotification ? 'Notificações Ativas' : 'Ativar Notificações'}
            </span>
          </button>

          {/* Test Chime */}
          <button
            onClick={handleTestLocalAlert}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            title="Testar som de notificação local (Web Audio API)"
          >
            <Volume2 className="w-4 h-4 text-emerald-500" />
          </button>

          {/* WhatsApp Phone */}
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <Phone className="w-4 h-4 text-emerald-500" />
            {editingPhone ? (
              <form onSubmit={handleSavePhone} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+55 11 99999-9999"
                  className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-2 py-1 text-xs font-semibold bg-emerald-600 text-white rounded"
                >
                  Salvar
                </button>
              </form>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {whatsappPhone}
                </span>
                <button
                  onClick={() => {
                    setPhoneInput(whatsappPhone);
                    setEditingPhone(true);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 underline font-medium"
                >
                  Alterar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs: Chat Local vs Lembretes vs Status */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'chat'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Conversa Local com o Sistem</span>
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'reminders'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Fila de Lembretes ({reminders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('status_local')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'status_local'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Segurança & Protocolo Local</span>
        </button>
      </div>

      {/* VIEW 1: WhatsApp Interactive Chat with Sistem (100% Local & Real App Bridge) */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main WhatsApp Window Simulator */}
          <div className="lg:col-span-2 flex flex-col h-[580px] rounded-3xl border border-slate-300 dark:border-slate-700 bg-[#efeae2] dark:bg-slate-900 shadow-xl overflow-hidden">
            {/* WhatsApp Green Top Bar */}
            <div className="bg-[#075e54] dark:bg-slate-800 text-white px-4 py-3 flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white shadow-sm ring-2 ring-white/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-sm">Sistem</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <p className="text-[11px] text-emerald-100/80">
                    online • Motor Local Ativo
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handleExportChat}
                  className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
                  title="Exportar conversa para arquivo .txt"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={handleClearChat}
                  className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
                  title="Limpar mensagens"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleOpenInRealWhatsApp()}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow transition-all active:scale-95"
                  title="Abrir no WhatsApp Web ou aplicativo oficial com seu número"
                >
                  <span>Abrir no WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* In-Chat Search Bar */}
            <div className="px-3 py-1.5 bg-[#f0f2f5] dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                placeholder="Pesquisar mensagens na conversa..."
                className="w-full text-[11px] bg-transparent outline-none text-slate-700 dark:text-slate-200"
              />
              {chatSearch && (
                <button onClick={() => setChatSearch('')} className="text-xs text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {displayedMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs sm:text-sm relative leading-relaxed ${
                        isUser
                          ? 'bg-[#d9fdd3] dark:bg-emerald-950 dark:text-emerald-100 text-slate-900 rounded-tr-none'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="whitespace-pre-line font-sans">{msg.text}</div>

                      <div className="flex items-center justify-end space-x-1 text-[10px] text-slate-400 mt-1">
                        <span>{msg.timestamp}</span>
                        {isUser && (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isSendingChat && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none px-3 py-2 shadow-sm text-xs text-slate-500 flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200"></div>
                    <span>Sistem digitando...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Command Chips */}
            <div className="px-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex space-x-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => handleSendChatMessage('/treino')}
                className="text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-colors font-medium"
              >
                🏋️‍♂️ /treino
              </button>
              <button
                onClick={() => handleSendChatMessage('/agenda')}
                className="text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-colors font-medium"
              >
                📅 /agenda
              </button>
              <button
                onClick={() => handleSendChatMessage('/tarefas')}
                className="text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-colors font-medium"
              >
                🎯 /tarefas
              </button>
              <button
                onClick={() => handleSendChatMessage('Como executar Supino Reto com técnica estrita no MuscleWiki?')}
                className="text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-colors font-medium"
              >
                💪 Passo a Passo Supino
              </button>
              <button
                onClick={() => handleSendChatMessage('Exercícios para aliviar dor na lombar')}
                className="text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-colors font-medium"
              >
                💆‍♂️ Alívio Lombar
              </button>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="p-2.5 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex items-center space-x-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Converse com o Sistem ou envie comandos (/treino, /agenda)..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isSendingChat}
                className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-all shadow-md flex-shrink-0"
                title="Enviar mensagem local para o Sistem"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Local Quick Dispatches & Direct Real Links */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                  <Send className="w-4 h-4 text-emerald-500" />
                  <span>Disparo Direto para o Celular</span>
                </h3>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dispare as mensagens diretamente para o aplicativo oficial do WhatsApp no seu smartphone ou computador via link local:
              </p>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() =>
                    handleOpenInRealWhatsApp(
                      'Olá Sistem! Gostaria de consultar o passo a passo dos exercícios do meu treino de hoje.'
                    )
                  }
                  className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-900/50 transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      🏋️‍♂️ Consultar Treino & Passos
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Abre wa.me formatado com um clique
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                </button>

                <button
                  onClick={() =>
                    handleOpenInRealWhatsApp(
                      'Sistem, quais reuniões tenho marcadas hoje no Google Calendar?'
                    )
                  }
                  className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-900/50 transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      📅 Checar Agenda do Calendar
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Sincronização com o Google Calendar
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0" />
                </button>

                <button
                  onClick={() =>
                    handleOpenInRealWhatsApp(
                      'Sistem, me dê um resumo das minhas tarefas de trabalho e saúde de hoje.'
                    )
                  }
                  className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-900/50 transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      🎯 Resumo de Tarefas e Metas
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Disparo imediato para seu WhatsApp
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                </button>
              </div>

              {/* App Scheme Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => handleOpenInRealWhatsApp(undefined, true)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <span>Abrir via App WhatsApp Nativo (whatsapp://)</span>
                </button>
              </div>
            </div>

            {/* Local Security Badge */}
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Integração 100% Local & Sem Custos</span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300/90 leading-relaxed">
                Essa integração opera localmente pelo navegador e servidor próprio. Suas mensagens, dados de treino e agenda não passam por gateways pagos de terceiros.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Reminders Queue */}
      {activeTab === 'reminders' && (
        <div className="space-y-5">
          {/* Quick Template Triggers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => {
                loadTemplate('meeting');
                setShowModal(true);
              }}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-500 text-left transition-all shadow-sm"
            >
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                📅 Lembrete de Reunião
              </span>
              <span className="text-[11px] text-slate-400">Notificar 15 min antes</span>
            </button>

            <button
              onClick={() => {
                loadTemplate('workout');
                setShowModal(true);
              }}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-500 text-left transition-all shadow-sm"
            >
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                🏋️‍♂️ Treino do Dia
              </span>
              <span className="text-[11px] text-slate-400">Passo a passo estrito</span>
            </button>

            <button
              onClick={() => {
                loadTemplate('task');
                setShowModal(true);
              }}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-500 text-left transition-all shadow-sm"
            >
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                🎯 Tarefa Urgente
              </span>
              <span className="text-[11px] text-slate-400">Foco em entrega</span>
            </button>

            <button
              onClick={() => {
                loadTemplate('hydration_check');
                setShowModal(true);
              }}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-500 text-left transition-all shadow-sm"
            >
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                💧 Água & Mobilidade
              </span>
              <span className="text-[11px] text-slate-400">Prevenção postural</span>
            </button>
          </div>

          {/* Reminders Queue Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Fila de Lembretes Agendados</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {reminders.length}
                </span>
              </h3>

              <button
                onClick={() => {
                  loadTemplate('meeting');
                  setShowModal(true);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Criar Lembrete</span>
              </button>
            </div>

            {reminders.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                <Send className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                  Nenhum lembrete na fila
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Use os modelos acima ou agende compromissos no Google Calendar para gerar lembretes automáticos.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.map((rem) => {
                  const isSent = rem.status === 'sent';
                  const dateObj = new Date(rem.scheduledFor);
                  const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const formattedDate = dateObj.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                  });

                  return (
                    <div
                      key={rem.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isSent
                          ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                          : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {rem.title}
                          </span>
                          {isSent ? (
                            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              Enviado
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              Agendado
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line line-clamp-2">
                          {rem.message}
                        </p>

                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Para: {formattedDate} às {formattedTime}</span>
                          </span>
                          <span>Destino: {rem.targetPhone}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 self-end md:self-center">
                        <button
                          onClick={() => handleTriggerNow(rem)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                          title="Abrir WhatsApp e disparar mensagem imediatamente"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Disparar no WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleCopyLink(rem)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs"
                          title="Copiar link direto wa.me"
                        >
                          {copiedId === rem.id ? (
                            <span className="text-emerald-500 font-bold text-[10px]">Copiado!</span>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => onDeleteReminder(rem.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Remover lembrete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: Local Protocol & Security Details */}
      {activeTab === 'status_local' && (
        <div className="p-5 sm:p-6 rounded-2xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Como Funciona a Integração 100% Local do WhatsApp
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Arquitetura sem intermediários pagos, operando diretamente na sua máquina e no navegador.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-1.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                1. Web Audio Chime Nativo
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Utiliza a Web Audio API nativa para reproduzir avisos sonoros de mensagem e alertas de treino sem necessidade de baixar arquivos de áudio pesados.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-1.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                2. Protocolo Direct Link (wa.me)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Dispara comandos para o WhatsApp Web ou para o aplicativo móvel usando os protocolos oficiais e gratuitos da Meta, sem custo de mensagens.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-1.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                3. Desktop Notifications (HTML5)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Alertas em pop-up na área de trabalho quando o Sistem responde ou quando uma reunião do Google Calendar está próxima.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Lembrete */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Send className="w-4 h-4 text-emerald-500" />
                <span>Configurar Lembrete WhatsApp Local</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título do Lembrete *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Reunião com Diretoria em 15 min"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mensagem Formatada do WhatsApp *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400">
                  Dica: use *negrito* e _itálico_ para formatação nativa do WhatsApp.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Disparar em:
                  </label>
                  <select
                    value={timeOffsetMinutes}
                    onChange={(e) => setTimeOffsetMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value={1}>Em 1 minuto (Teste imediato)</option>
                    <option value={5}>Em 5 minutos</option>
                    <option value={15}>Em 15 minutos</option>
                    <option value={30}>Em 30 minutos</option>
                    <option value={60}>Em 1 hora</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Lembrete:
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="meeting">Reunião Calendar</option>
                    <option value="workout">Treino do Dia</option>
                    <option value="task">Tarefa Prioritária</option>
                    <option value="hydration_check">Hidratação & Postura</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>
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
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Salvar na Fila
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
