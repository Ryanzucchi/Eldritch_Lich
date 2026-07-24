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
    agendaMarkdown: string;
    minutesMarkdown?: string;
    participants: string[];
    actionItems: MeetingActionItem[];
    aiSummary?: string;
    createdAt: string;
}
/**
 * Gera um resumo automático sintético dos tópicos e deliberações da reunião (UC-345).
 */
export declare function generateMeetingSummary(meeting: TeamMeeting): string;
