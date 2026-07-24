export interface MeetingActionItem {
  id: string;
  meetingId: string;
  title: string;
  assigneeEmail: string;
  isCompleted: boolean;
  dueDate?: string;
  createdAt: string;
}

export interface TeamMeeting {
  id: string;
  projectId: string;
  title: string;
  date: string;
  location?: string;
  agendaMarkdown: string; // UC-340: Pauta da Reunião
  minutesMarkdown?: string; // UC-341: Ata da Reunião
  participants: string[]; // UC-343: Lista de e-mails dos participantes
  actionItems: MeetingActionItem[]; // UC-342, UC-344: Action items / Tarefas
  aiSummary?: string; // UC-345: Resumo automático da reunião
  createdAt: string;
}

/**
 * Gera um resumo automático sintético dos tópicos e deliberações da reunião (UC-345).
 */
export function generateMeetingSummary(meeting: TeamMeeting): string {
  const participantList = meeting.participants.join(', ') || 'Nenhum participante registrado';
  const totalItems = meeting.actionItems.length;
  const completedItems = meeting.actionItems.filter(i => i.isCompleted).length;

  return `RESUMO AUTOMÁTICO DA REUNIÃO: ${meeting.title}
Data: ${meeting.date} | Local/Plataforma: ${meeting.location || 'Online'}
Participantes: ${participantList}

PAUTA DISCUTIDA:
${meeting.agendaMarkdown || 'Nenhuma pauta anexada.'}

DELIBERAÇÕES & ATA:
${meeting.minutesMarkdown || 'Ata pendente de preenchimento.'}

STATUS DE PENDÊNCIAS (ACTION ITEMS):
${completedItems} de ${totalItems} pendência(s) concluída(s).`;
}
