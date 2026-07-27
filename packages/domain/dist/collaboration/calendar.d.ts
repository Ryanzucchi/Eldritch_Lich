export interface CalendarEvent {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    time?: string;
    timezone: string;
    category: 'MEETING' | 'DEADLINE' | 'SPRINT' | 'VACATION';
    colorTag: string;
    assigneeEmails: string[];
    externalSyncUrl?: string;
    createdAt: string;
}
export interface MemberAvailability {
    email: string;
    name: string;
    timezone: string;
    status: 'AVAILABLE' | 'BUSY' | 'OUT_OF_OFFICE';
    workingHours: {
        start: string;
        end: string;
    };
}
/**
 * Converte horários de eventos considerando fusos horários de membros da equipe (UC-380).
 */
export declare function formatEventWithTimezone(event: CalendarEvent, targetTimezone: string): string;
/**
 * Exporta eventos do calendário de equipe para o padrão universal iCalendar (.ics) (UC-378).
 */
export declare function exportToICalendar(events: CalendarEvent[]): string;
