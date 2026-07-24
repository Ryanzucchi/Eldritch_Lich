"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterChatMessages = filterChatMessages;
/**
 * Filtra mensagens do chat por termo de busca ou tags (UC-214).
 */
function filterChatMessages(messages, query) {
    const q = query.trim().toLowerCase();
    if (!q)
        return messages;
    return messages.filter(m => m.content.toLowerCase().includes(q) ||
        m.senderName.toLowerCase().includes(q) ||
        m.senderEmail.toLowerCase().includes(q));
}
