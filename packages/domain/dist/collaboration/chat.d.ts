export interface ChatChannel {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    isArchived: boolean;
    createdAt: string;
}
export interface ChatMessage {
    id: string;
    channelId: string;
    senderEmail: string;
    senderName: string;
    content: string;
    attachmentUrl?: string;
    createdAt: string;
}
/**
 * Filtra mensagens do chat por termo de busca ou tags (UC-214).
 */
export declare function filterChatMessages(messages: ChatMessage[], query: string): ChatMessage[];
