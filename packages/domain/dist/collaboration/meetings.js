"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMeetingSummary = generateMeetingSummary;
/**
 * Gera um resumo automático sintético dos tópicos e deliberações da reunião (UC-345).
 */
function generateMeetingSummary(meeting) {
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
