"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTimelineConsistency = validateTimelineConsistency;
/**
 * Valida conexões causais de eventos em uma timeline.
 * Retorna alertas de inconsistência cronológica se um evento consequência tiver sortOrder menor que um precursor.
 */
function validateTimelineConsistency(events) {
    const warnings = [];
    const eventMap = new Map();
    events.forEach(e => eventMap.set(e.id, e));
    events.forEach(event => {
        if (event.precursorEventIds && event.precursorEventIds.length > 0) {
            event.precursorEventIds.forEach(precursorId => {
                const precursor = eventMap.get(precursorId);
                if (precursor) {
                    if (event.sortOrder < precursor.sortOrder) {
                        warnings.push(`Alerta de inconsistência cronológica: O evento "${event.title}" está ordenado antes do seu evento precursor "${precursor.title}".`);
                    }
                }
            });
        }
    });
    return {
        isValid: warnings.length === 0,
        warnings
    };
}
