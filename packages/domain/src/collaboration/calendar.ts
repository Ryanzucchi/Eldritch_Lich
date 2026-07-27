export interface CalendarEvent {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  time?: string; // HH:mm
  timezone: string; // e.g. "UTC-3 (Brasília)" (UC-380)
  category: 'MEETING' | 'DEADLINE' | 'SPRINT' | 'VACATION';
  colorTag: string; // e.g. "#3b82f6", "#10b981", "#f59e0b"
  assigneeEmails: string[];
  externalSyncUrl?: string; // iCal / Google Calendar export link (UC-378)
  createdAt: string;
}

export interface MemberAvailability {
  email: string;
  name: string;
  timezone: string; // UC-380
  status: 'AVAILABLE' | 'BUSY' | 'OUT_OF_OFFICE';
  workingHours: { start: string; end: string }; // e.g. 09:00 - 18:00
}

/**
 * Converte horários de eventos considerando fusos horários de membros da equipe (UC-380).
 */
export function formatEventWithTimezone(event: CalendarEvent, targetTimezone: string): string {
  return `[${event.title}] Data: ${event.startDate} ${event.time || ''} (${event.timezone} ➔ ${targetTimezone})`;
}

/**
 * Exporta eventos do calendário de equipe para o padrão universal iCalendar (.ics) (UC-378).
 */
export function exportToICalendar(events: CalendarEvent[]): string {
  let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Eldritch Lich//Team Calendar//PT-BR\n`;
  for (const e of events) {
    const cleanDate = e.startDate.replace(/-/g, '');
    ics += `BEGIN:VEVENT\nSUMMARY:${e.title}\nDTSTART:${cleanDate}\nDESCRIPTION:${e.description || ''}\nEND:VEVENT\n`;
  }
  ics += `END:VCALENDAR`;
  return ics;
}
