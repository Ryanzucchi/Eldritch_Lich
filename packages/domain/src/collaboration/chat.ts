export interface ChatChannel {
  id: string;
  projectId: string;
  name: string; // e.g. "Geral", "Worldbuilding", "Capítulo 1"
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
export function filterChatMessages(messages: ChatMessage[], query: string): ChatMessage[] {
  const q = query.trim().toLowerCase();
  if (!q) return messages;

  return messages.filter(m => 
    m.content.toLowerCase().includes(q) ||
    m.senderName.toLowerCase().includes(q) ||
    m.senderEmail.toLowerCase().includes(q)
  );
}
