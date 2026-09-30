import { jsPDF } from 'jspdf';
import { Task, CalendarEventItem, WorkoutRoutine, UserPreferences } from '../types';

interface ReportData {
  userPreferences: UserPreferences;
  tasks: Task[];
  calendarEvents: CalendarEventItem[];
  workouts: WorkoutRoutine[];
  honestFeedback: string;
  waterGlasses: number;
}

export const generateWeeklyPdfReport = (data: ReportData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = 18;

  // Header background banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.text('NexusPulse | Relatório Semanal Integrado', margin, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Produtividade, Google Calendar, Gestão de Tarefas & Treinador Esportivo', margin, y);

  y += 6;
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Usuário: ${data.userPreferences.userName}  |  Gerado em: ${dateStr}`, margin, y);

  y = 50;

  // Calculate statistics
  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter((t) => t.completed).length;
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalWorkouts = data.workouts.length;
  const completedWorkouts = data.workouts.filter((w) => w.completed).length;
  const workoutRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;

  const totalMeetings = data.calendarEvents.length;

  // KPI Cards Grid (4 boxes)
  const boxWidth = (pageWidth - margin * 2 - 9) / 4;
  const boxHeight = 22;

  const kpis = [
    { label: 'Tarefas Concluídas', value: `${completedTasks}/${totalTasks} (${taskRate}%)`, color: [16, 185, 129] }, // emerald
    { label: 'Treinos Realizados', value: `${completedWorkouts}/${totalWorkouts} (${workoutRate}%)`, color: [59, 130, 246] }, // blue
    { label: 'Reuniões Calendar', value: `${totalMeetings} eventos`, color: [139, 92, 246] }, // purple
    { label: 'Hidratação Média', value: `${data.waterGlasses * 250} ml/dia`, color: [14, 165, 233] }, // sky
  ];

  kpis.forEach((kpi, idx) => {
    const x = margin + idx * (boxWidth + 3);
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(x, y, boxWidth, boxHeight, 2, 2, 'FD');

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 3, y + 6);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.text(kpi.value, x + 3, y + 15);
  });

  y += boxHeight + 10;

  // Section 1: Feedback Sincero do Treinador & Assistente
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, y, pageWidth - margin * 2, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. AVALIAÇÃO SINCERA & CONSTRUTIVA DA IA', margin + 3, y + 5.5);

  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const cleanFeedback = data.honestFeedback.replace(/[*_#]/g, '');
  const splitFeedback = doc.splitTextToSize(cleanFeedback, pageWidth - margin * 2);
  doc.text(splitFeedback, margin, y);

  y += splitFeedback.length * 4.8 + 6;

  // Check page overflow
  if (y > pageHeight - 60) {
    doc.addPage();
    y = 20;
  }

  // Section 2: Desempenho Físico, Adaptações e Dores Musculares
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, pageWidth - margin * 2, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. TREINAMENTO FÍSICO, ADAPTAÇÕES & RECUPERAÇÃO DE DORES', margin + 3, y + 5.5);

  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  data.workouts.forEach((w) => {
    if (y > pageHeight - 25) {
      doc.addPage();
      y = 20;
    }
    const statusIcon = w.completed ? '[CONCLUIDO]' : '[PENDENTE]';
    doc.setFont('helvetica', 'bold');
    doc.text(`• ${w.dayOfWeek} - ${w.title} (${w.durationMinutes} min) ${statusIcon}`, margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`   Foco: ${w.focus} | Nivel: ${w.difficulty} | Exercicios: ${w.exercises.length}`, margin, y);
    y += 4.5;

    if (w.feedback) {
      doc.setTextColor(225, 29, 72); // rose-600
      doc.text(
        `   Feedback: RPE ${w.feedback.rpe}/10 | Dor relatada: ${
          w.feedback.feltPain ? `${w.feedback.painArea || 'Sim'} (Gravidade ${w.feedback.painSeverity || 3}/10)` : 'Nenhuma dor'
        }`,
        margin,
        y
      );
      y += 4.5;
    }
    doc.setTextColor(51, 65, 85);
    y += 2;
  });

  // Known pains registered
  if (data.userPreferences.knownPains.length > 0) {
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9); // amber-700
    doc.text('Regioes Monitoradas para Prevencao de Lesoes:', margin, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    data.userPreferences.knownPains.forEach((p) => {
      doc.text(`- ${p.area} (Sensibilidade: ${p.severity}/10): ${p.notes}`, margin + 4, y);
      y += 4.5;
    });
  }

  y += 6;

  // Check page overflow
  if (y > pageHeight - 50) {
    doc.addPage();
    y = 20;
  }

  // Section 3: Tarefas & Reuniões Sincronizadas
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, pageWidth - margin * 2, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. GESTÃO DE TAREFAS & REUNIÕES NO GOOGLE CALENDAR', margin + 3, y + 5.5);

  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const pendingTasks = data.tasks.filter((t) => !t.completed).slice(0, 5);
  if (pendingTasks.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Tarefas Pendentes Criticas para a Proxima Semana:', margin, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    pendingTasks.forEach((t) => {
      doc.text(`[ ] ${t.title} (Prioridade: ${t.priority.toUpperCase()} | Prazo: ${t.dueDate})`, margin + 4, y);
      y += 4.5;
    });
  }

  y += 6;

  // Section 4: Aprendizado e Memória da IA
  doc.setFont('helvetica', 'bold');
  doc.text('Preferencias & Habitos Aprendidos pela IA ao longo do tempo:', margin, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  data.userPreferences.learnedMemories.slice(0, 4).forEach((mem) => {
    doc.text(`* ${mem}`, margin + 4, y);
    y += 4.2;
  });

  // Footer on all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `NexusPulse AI Assistant & Coach  |  Pagina ${i} de ${totalPages}  |  Relatorio Confidencial`,
      margin,
      pageHeight - 8
    );
  }

  doc.save(`NexusPulse_Relatorio_Semanal_${data.userPreferences.userName}_${now.toISOString().split('T')[0]}.pdf`);
};
