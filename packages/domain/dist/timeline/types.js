"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTimelineConsistency = validateTimelineConsistency;
exports.compareTimelines = compareTimelines;
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
/**
 * Compara duas linhas do tempo e identifica eventos divergentes e equivalentes (UC-079).
 */
function compareTimelines(timelineA, eventsA, timelineB, eventsB) {
    const divergentEvents = [];
    const mapB = new Map();
    eventsB.forEach(e => mapB.set(e.title.toLowerCase(), e));
    const matchedBIds = new Set();
    eventsA.forEach(evA => {
        const evB = mapB.get(evA.title.toLowerCase());
        if (evB) {
            matchedBIds.add(evB.id);
            if (evA.dateStr !== evB.dateStr) {
                divergentEvents.push({ eventA: evA, eventB: evB, type: 'DATE_MISMATCH' });
            }
            else {
                divergentEvents.push({ eventA: evA, eventB: evB, type: 'COMMON' });
            }
        }
        else {
            divergentEvents.push({ eventA: evA, type: 'ONLY_IN_A' });
        }
    });
    eventsB.forEach(evB => {
        if (!matchedBIds.has(evB.id)) {
            divergentEvents.push({ eventB: evB, type: 'ONLY_IN_B' });
        }
    });
    return {
        timelineA,
        timelineB,
        divergentEvents
    };
}
