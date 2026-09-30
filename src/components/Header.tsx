import React from 'react';
import { User } from 'firebase/auth';
import {
  Calendar,
  MessageSquare,
  CheckSquare,
  Dumbbell,
  Send,
  BarChart3,
  Moon,
  Sun,
  BrainCircuit,
  LogOut,
  Sparkles,
  GraduationCap,
  Shield,
} from 'lucide-react';
import { UserPreferences } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  user: User | null;
  googleToken: string | null;
  onGoogleLogin: () => void;
  onGoogleLogout: () => void;
  preferences: UserPreferences;
  onOpenPreferences: () => void;
  taskStats: { completed: number; total: number };
  eventsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  isDarkMode,
  setIsDarkMode,
  user,
  googleToken,
  onGoogleLogin,
  onGoogleLogout,
  preferences,
  onOpenPreferences,
  taskStats,
  eventsCount,
}) => {
  const tabs = [
    { id: 'chat', label: 'Sistem', icon: Sparkles },
    { id: 'calendar', label: 'Google Calendar', icon: Calendar, badge: eventsCount },
    { id: 'tasks', label: 'Tarefas Diárias', icon: CheckSquare, badge: `${taskStats.completed}/${taskStats.total}` },
    { id: 'esportes', label: 'Esportes', icon: Dumbbell },
    { id: 'professor', label: 'Professor & Disciplinas', icon: GraduationCap },
    { id: 'whatsapp', label: 'WhatsApp & Lembretes', icon: Send },
    { id: 'progress', label: 'Progresso & Relatório PDF', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-200 bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-bold text-xl">
              N
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Nexus<span className="text-emerald-500">Pulse</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  IA Sincera
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Agenda Google, WhatsApp & Treinador Esportivo
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-3">
            {/* Preferences & AI Memory Trigger */}
            <button
              onClick={onOpenPreferences}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700"
              title="Ver e gerenciar preferências e memórias aprendidas pela IA"
            >
              <BrainCircuit className="w-4 h-4 text-emerald-500" />
              <span className="hidden md:inline">Memória da IA</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            {/* Google Calendar Auth Button */}
            {user && googleToken ? (
              <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium hidden sm:inline max-w-[120px] truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={onGoogleLogout}
                  title="Desconectar do Google Calendar"
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onGoogleLogin}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all bg-white hover:bg-slate-50 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
                title="Conectar com sua conta Google Calendar"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Conectar Calendar</span>
              </button>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive
                        ? 'bg-emerald-700 text-emerald-100'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
