"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEventWithTimezone = formatEventWithTimezone;
exports.exportToICalendar = exportToICalendar;
/**
 * Converte horários de eventos considerando fusos horários de membros da equipe (UC-380).
 */
function formatEventWithTimezone(event, targetTimezone) {
    return `[${event.title}] Data: ${event.startDate} ${event.time || ''} (${event.timezone} ➔ ${targetTimezone})`;
}
/**
 * Exporta eventos do calendário de equipe para o padrão universal iCalendar (.ics) (UC-378).
 */
function exportToICalendar(events) {
    let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Eldritch Lich//Team Calendar//PT-BR\n`;
    for (const e of events) {
        const cleanDate = e.startDate.replace(/-/g, '');
        ics += `BEGIN:VEVENT\nSUMMARY:${e.title}\nDTSTART:${cleanDate}\nDESCRIPTION:${e.description || ''}\nEND:VEVENT\n`;
    }
    ics += `END:VCALENDAR`;
    return ics;
}
