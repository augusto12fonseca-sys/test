import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  setAccessTokenManually,
} from './services/googleAuth';
import {
  fetchGoogleCalendarEvents,
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  getLocalEvents,
  saveLocalEvents,
} from './services/calendarService';
import {
  getStoredReminders,
  saveReminders,
  createReminder,
  markReminderSent,
  deleteReminder,
  openWhatsApp,
  sendLocalDesktopNotification,
} from './services/whatsappService';
import {
  getStoredPreferences,
  savePreferences,
} from './services/userPreferences';
import {
  getStoredSubjects,
  saveSubjects,
  addSubject,
  deleteSubject,
  toggleTopicStatus,
  addTopicToSubject,
} from './services/studyService';
import { INITIAL_WORKOUTS } from './data/defaultWorkouts';
import {
  Task,
  CalendarEventItem,
  WorkoutRoutine,
  UserPreferences,
  WhatsAppReminder,
  StudySubject,
  SportsItem,
  ExerciseItem,
} from './types';

// Components
import { Header } from './components/Header';
import { ChatAssistant } from './components/ChatAssistant';
import { CalendarManager } from './components/CalendarManager';
import { TaskManager } from './components/TaskManager';
import { SportsExplorer } from './components/SportsExplorer';
import { StudyProfessor } from './components/StudyProfessor';
import { WhatsAppAutomation } from './components/WhatsAppAutomation';
import { ProgressReport } from './components/ProgressReport';
import { PreferencesModal } from './components/PreferencesModal';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nexuspulse_dark_mode');
    if (saved !== null) return saved === 'true';
    return true; // Default to modern sleek dark mode
  });

  // Active Tab
  const [currentTab, setCurrentTab] = useState<string>('chat');
  const [extraTabProps, setExtraTabProps] = useState<any>({});

  // Auth & Calendar
  const [user, setUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>(() => getLocalEvents());
  const [isLoadingCalendar, setIsLoadingCalendar] = useState<boolean>(false);

  // Preferences & Memory
  const [preferences, setPreferences] = useState<UserPreferences>(() => getStoredPreferences());
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem('nexuspulse_tasks_v1');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 't-1',
        title: 'Revisar métricas semanais e alinhar com a equipe',
        description: 'Preparar pontos principais para a reunião no Google Calendar',
        dueDate: today,
        priority: 'alta',
        category: 'trabalho',
        completed: false,
        reminderWhatsApp: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 't-2',
        title: 'Executar treino de Superiores e 10 min de mobilidade torácica',
        description: 'Foco na cadência e postura para proteger a coluna',
        dueDate: today,
        priority: 'alta',
        category: 'treino',
        completed: false,
        reminderWhatsApp: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 't-3',
        title: 'Beber 2.5 litros de água ao longo do dia',
        dueDate: today,
        priority: 'media',
        category: 'saude',
        completed: true,
        reminderWhatsApp: false,
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // Workouts
  const [workoutRoutines, setWorkoutRoutines] = useState<WorkoutRoutine[]>(() => {
    try {
      const raw = localStorage.getItem('nexuspulse_workouts_v1');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return INITIAL_WORKOUTS;
  });
  const [activeWorkoutIndex, setActiveWorkoutIndex] = useState<number>(0);

  // Study Disciplines (Mini-Agent Professor)
  const [studySubjects, setStudySubjects] = useState<StudySubject[]>(() => getStoredSubjects());

  // WhatsApp Reminders
  const [reminders, setReminders] = useState<WhatsAppReminder[]>(() => getStoredReminders());

  // Water intake
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    const raw = localStorage.getItem('nexuspulse_water_today');
    return raw ? parseInt(raw, 10) : 5;
  });

  // Triggered WhatsApp Reminder Popup
  const [triggeredReminder, setTriggeredReminder] = useState<WhatsAppReminder | null>(null);

  // Sync Dark Mode class with HTML element
  useEffect(() => {
    localStorage.setItem('nexuspulse_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save tasks on change
  useEffect(() => {
    localStorage.setItem('nexuspulse_tasks_v1', JSON.stringify(tasks));
  }, [tasks]);

  // Save workouts on change
  useEffect(() => {
    localStorage.setItem('nexuspulse_workouts_v1', JSON.stringify(workoutRoutines));
  }, [workoutRoutines]);

  // Save water on change
  useEffect(() => {
    localStorage.setItem('nexuspulse_water_today', String(waterGlasses));
  }, [waterGlasses]);

  // Save study subjects on change
  useEffect(() => {
    saveSubjects(studySubjects);
  }, [studySubjects]);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setGoogleToken(token);
        refreshCalendar(token);
      },
      () => {
        // user not authenticated or token missing
      }
    );
    return () => unsubscribe();
  }, []);

  // WhatsApp Automated Reminder Checker daemon (every 20s)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const currentList = getStoredReminders();
      const dueReminder = currentList.find(
        (r) => r.status === 'pending' && new Date(r.scheduledFor).getTime() <= now
      );

      if (dueReminder) {
        setTriggeredReminder(dueReminder);
        sendLocalDesktopNotification(dueReminder.title, dueReminder.message);
        markReminderSent(dueReminder.id);
        setReminders(getStoredReminders());
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Calendar sync helper
  const refreshCalendar = async (token?: string | null) => {
    const activeToken = token !== undefined ? token : googleToken;
    if (activeToken) {
      setIsLoadingCalendar(true);
      try {
        const events = await fetchGoogleCalendarEvents(activeToken);
        setCalendarEvents(events);
        saveLocalEvents(events);
      } catch (err) {
        console.warn('Could not fetch from Google Calendar, using local events', err);
        setCalendarEvents(getLocalEvents());
      } finally {
        setIsLoadingCalendar(false);
      }
    } else {
      setCalendarEvents(getLocalEvents());
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setGoogleToken(result.accessToken);
        await refreshCalendar(result.accessToken);
      }
    } catch (err: any) {
      alert(`Falha no login com Google: ${err.message || 'Verifique as permissões'}`);
    }
  };

  const handleGoogleLogout = async () => {
    await logoutGoogle();
    setUser(null);
    setGoogleToken(null);
    setCalendarEvents(getLocalEvents());
  };

  // Calendar events mutations
  const handleCreateCalendarEvent = async (eventData: any) => {
    const newEv = await createGoogleCalendarEvent(googleToken, eventData);
    setCalendarEvents((prev) => [newEv, ...prev]);

    // Automatically create WhatsApp reminder 15 minutes before the meeting
    const startTime = new Date(eventData.startDateTime).getTime();
    const reminderTime = new Date(startTime - 15 * 60 * 1000).toISOString();

    createReminder({
      title: `Lembrete: ${eventData.summary}`,
      message: `🔔 *NexusPulse | Lembrete de Reunião*\n\nSua reunião *"${eventData.summary}"* começa em 15 minutos!\n📍 Local: ${eventData.location || 'Google Meet'}\n\n_Conecte-se e prepare suas anotações._`,
      targetPhone: preferences.whatsappPhone,
      scheduledFor: reminderTime,
      type: 'meeting',
      autoTrigger: true,
    });
    setReminders(getStoredReminders());

    return newEv;
  };

  const handleDeleteCalendarEvent = async (eventId: string) => {
    await deleteGoogleCalendarEvent(googleToken, eventId);
    setCalendarEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  // Task mutations
  const handleAddTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title || 'Nova Tarefa',
      description: taskData.description,
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      priority: taskData.priority || 'alta',
      category: taskData.category || 'trabalho',
      completed: false,
      reminderWhatsApp: taskData.reminderWhatsApp ?? true,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    if (newTask.reminderWhatsApp) {
      createReminder({
        title: `Lembrete de Tarefa: ${newTask.title}`,
        message: `🎯 *NexusPulse | Foco Total*\n\nVocê tem a seguinte tarefa prioritária para hoje:\n📌 *${newTask.title}*\n🏷️ Prioridade: ${newTask.priority.toUpperCase()}\n\n_Disciplina diária transforma resultados!_`,
        targetPhone: preferences.whatsappPhone,
        scheduledFor: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        type: 'task',
        autoTrigger: true,
      });
      setReminders(getStoredReminders());
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSyncTaskToCalendar = async (task: Task) => {
    const today = task.dueDate || new Date().toISOString().split('T')[0];
    const startDateTime = `${today}T11:00:00`;
    const endDateTime = `${today}T11:45:00`;

    const ev = await handleCreateCalendarEvent({
      summary: `[Foco] ${task.title}`,
      description: `Bloco de foco agendado pelo NexusPulse para a tarefa: ${task.title}`,
      startDateTime,
      endDateTime,
      location: 'Local / Trabalho Focado',
    });

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, calendarEventId: ev.id } : t))
    );
    alert(`Bloco de tempo criado no Google Calendar para "${task.title}"!`);
  };

  // Workout mutations
  const handleToggleExercise = (workoutId: string, exerciseId: string) => {
    setWorkoutRoutines((prev) =>
      prev.map((w) => {
        if (w.id !== workoutId) return w;
        const updatedExercises = w.exercises.map((e) =>
          e.id === exerciseId ? { ...e, completed: !e.completed } : e
        );
        const allDone = updatedExercises.every((e) => e.completed);
        return {
          ...w,
          exercises: updatedExercises,
          completed: allDone,
        };
      })
    );
  };

  const handleCompleteWorkout = (workoutId: string, feedback: any) => {
    setWorkoutRoutines((prev) =>
      prev.map((w) =>
        w.id === workoutId
          ? {
              ...w,
              completed: true,
              feedback,
            }
          : w
      )
    );
  };

  const handleAdjustWorkout = (painArea?: string) => {
    setWorkoutRoutines((prev) =>
      prev.map((w, idx) => {
        if (idx !== activeWorkoutIndex) return w;

        const adaptedExercises = w.exercises.map((ex) => {
          let notes = ex.notes || '';
          let sets = ex.sets;

          if (painArea) {
            sets = Math.max(2, sets - 1);
            notes = `[Adaptado pelo Treinador]: Redução de volume para alívio em ${painArea}. Foque na cadência lenta.`;
          } else {
            notes = '[Ajuste]: Foco em técnica estrita e amplitude controlada.';
          }

          return { ...ex, sets, notes };
        });

        adaptedExercises.push({
          id: `ex-mob-${Date.now()}`,
          name: `Mobilidade e Descompressão Fisiológica (${painArea || 'Postural'})`,
          sets: 2,
          reps: '10 respirações profundas',
          targetMuscle: 'Fáscia & Articulações',
          notes: 'Alivia tensão muscular e protege a integridade das articulações.',
          completed: false,
        });

        return {
          ...w,
          focus: `${w.focus} (Rotina Adaptada)`,
          durationMinutes: Math.max(30, w.durationMinutes - 10),
          exercises: adaptedExercises,
        };
      })
    );
  };

  // Sports Database Integration: Add technique/exercise to today's workout
  const handleAddToTodayWorkout = (sportsItem: SportsItem) => {
    const newEx: ExerciseItem = {
      id: `ex-sport-${Date.now()}`,
      name: `${sportsItem.name} (${sportsItem.subCategory})`,
      sets: 3,
      reps: sportsItem.category === 'artes_marciais' ? '15 repetições técnicas' : '10 a 12 reps',
      targetMuscle: sportsItem.targetMuscles.join(', '),
      notes: `Técnica: ${sportsItem.technicalTips[0]} | Reforço para dor: ${sportsItem.painPreventionAndStrengthening.strengtheningExercise}`,
      completed: false,
    };

    setWorkoutRoutines((prev) =>
      prev.map((w, idx) => {
        if (idx !== activeWorkoutIndex) return w;
        return {
          ...w,
          exercises: [...w.exercises, newEx],
        };
      })
    );
  };

  // Study Disciplines mutations
  const handleAddStudySubject = (subject: Omit<StudySubject, 'id' | 'createdAt'>) => {
    const created = addSubject(subject);
    setStudySubjects(getStoredSubjects());
  };

  const handleDeleteStudySubject = (id: string) => {
    deleteSubject(id);
    setStudySubjects(getStoredSubjects());
  };

  const handleToggleStudyTopic = (subjectId: string, topicId: string) => {
    toggleTopicStatus(subjectId, topicId);
    setStudySubjects(getStoredSubjects());
  };

  const handleAddTopicToStudy = (subjectId: string, title: string, notes?: string) => {
    addTopicToSubject(subjectId, title, notes);
    setStudySubjects(getStoredSubjects());
  };

  // WhatsApp reminder actions
  const handleAddReminder = (reminder: Omit<WhatsAppReminder, 'id' | 'status'>) => {
    createReminder(reminder);
    setReminders(getStoredReminders());
  };

  const handleDeleteReminder = (id: string) => {
    deleteReminder(id);
    setReminders(getStoredReminders());
  };

  const handleMarkSent = (id: string) => {
    markReminderSent(id);
    setReminders(getStoredReminders());
  };

  const handleUpdatePhone = (phone: string) => {
    const updated = { ...preferences, whatsappPhone: phone };
    setPreferences(updated);
    savePreferences(updated);
  };

  const handleNavigateTab = (tab: string, extraData?: any) => {
    setCurrentTab(tab);
    if (extraData) {
      setExtraTabProps(extraData);
    }
  };

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        user={user}
        googleToken={googleToken}
        onGoogleLogin={handleGoogleLogin}
        onGoogleLogout={handleGoogleLogout}
        preferences={preferences}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        taskStats={{ completed: completedTasksCount, total: tasks.length }}
        eventsCount={calendarEvents.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {currentTab === 'chat' && (
          <ChatAssistant
            preferences={preferences}
            onUpdatePreferences={(updated) => {
              setPreferences(updated);
              savePreferences(updated);
            }}
            tasks={tasks}
            onAddTask={handleAddTask}
            calendarEvents={calendarEvents}
            onAddCalendarEvent={handleCreateCalendarEvent}
            currentWorkout={workoutRoutines[activeWorkoutIndex]}
            studySubjects={studySubjects}
            onNavigateTab={handleNavigateTab}
            onAdjustWorkout={handleAdjustWorkout}
            isGoogleConnected={!!googleToken}
            initialPrompt={extraTabProps?.initialPrompt}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarManager
            events={calendarEvents}
            isLoading={isLoadingCalendar}
            onRefreshEvents={() => refreshCalendar(googleToken)}
            onCreateEvent={handleCreateCalendarEvent}
            onDeleteEvent={handleDeleteCalendarEvent}
            isGoogleConnected={!!googleToken}
            onGoogleLogin={handleGoogleLogin}
            whatsappPhone={preferences.whatsappPhone}
          />
        )}

        {currentTab === 'tasks' && (
          <TaskManager
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onSyncTaskToCalendar={handleSyncTaskToCalendar}
            whatsappPhone={preferences.whatsappPhone}
          />
        )}

        {currentTab === 'esportes' && (
          <SportsExplorer
            onAddToTodayWorkout={handleAddToTodayWorkout}
            onAskCoachAboutItem={(item) => {
              handleNavigateTab('chat', {
                initialPrompt: `Sistem, me explique os detalhes biomecânicos e como aplicar ${item.name} (${item.subCategory}) no meu treino, além de como prevenir dor em ${item.painPreventionAndStrengthening.commonPainArea}.`,
              });
            }}
            workoutRoutines={workoutRoutines}
            activeWorkoutIndex={activeWorkoutIndex}
            setActiveWorkoutIndex={setActiveWorkoutIndex}
            onToggleExercise={handleToggleExercise}
            onCompleteWorkout={handleCompleteWorkout}
            onAdjustWorkout={handleAdjustWorkout}
            practicedSports={preferences.practicedSports || []}
            onUpdatePracticedSports={(sports) => {
              const updated = { ...preferences, practicedSports: sports };
              setPreferences(updated);
              savePreferences(updated);
            }}
            userPreferences={preferences}
          />
        )}

        {currentTab === 'professor' && (
          <StudyProfessor
            subjects={studySubjects}
            onAddSubject={handleAddStudySubject}
            onDeleteSubject={handleDeleteStudySubject}
            onToggleTopic={handleToggleStudyTopic}
            onAddTopic={handleAddTopicToStudy}
            onAskProfessorInChat={(q) => {
              handleNavigateTab('chat', { initialPrompt: q });
            }}
            userPreferences={preferences}
          />
        )}

        {currentTab === 'whatsapp' && (
          <WhatsAppAutomation
            reminders={reminders}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
            onMarkSent={handleMarkSent}
            whatsappPhone={preferences.whatsappPhone}
            onUpdatePhone={handleUpdatePhone}
            userPreferences={preferences}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressReport
            userPreferences={preferences}
            tasks={tasks}
            calendarEvents={calendarEvents}
            workouts={workoutRoutines}
            waterGlasses={waterGlasses}
            onUpdateWater={setWaterGlasses}
          />
        )}
      </main>

      {/* Preferences & AI Memory Modal */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onSavePreferences={(updated) => {
          setPreferences(updated);
          savePreferences(updated);
        }}
      />

      {/* Automated WhatsApp Trigger Pop-up Modal */}
      {triggeredReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-emerald-500 space-y-4 animate-scale-up">
            <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                ⏰
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider">
                  Lembrete Automático Sistem
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {triggeredReminder.title}
                </h3>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line font-medium leading-relaxed">
              {triggeredReminder.message}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Destino: {triggeredReminder.targetPhone}</span>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setTriggeredReminder(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Dispensar
              </button>
              <button
                onClick={() => {
                  openWhatsApp(triggeredReminder.targetPhone, triggeredReminder.message);
                  setTriggeredReminder(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center space-x-1.5"
              >
                <span>Abrir no WhatsApp Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
