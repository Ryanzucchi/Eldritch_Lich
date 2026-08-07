export interface TimelineEvent {
    id: string;
    timelineId: string;
    title: string;
    description?: string;
    dateStr: string;
    chronologicalSortKey?: number;
    datePrecision?: 'YEAR' | 'MONTH' | 'DAY' | 'ERA_YEAR' | 'UNRESOLVED';
    temporalSource?: 'MANUAL' | 'MANUSCRIPT' | 'LOCAL_NLP';
    calendarSystem?: 'GREGORIAN' | 'NARRATIVE' | 'UNKNOWN';
    era?: string;
    year?: number;
    month?: number;
    day?: number;
    sourceKind?: 'NARRATIVE' | 'EDITORIAL' | 'MANUAL';
    sortOrder: number;
    characterIds?: string[];
    locationId?: string;
    factionId?: string;
    precursorEventIds?: string[];
    createdAt: string;
}
export interface Timeline {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    calendarType: 'gregorian' | 'custom';
    parentTimelineId?: string;
    bifurcationEventId?: string;
    createdAt: string;
    updatedAt: string;
}
export interface TimelineComparisonResult {
    timelineA: Timeline;
    timelineB: Timeline;
    divergentEvents: {
        eventA?: TimelineEvent;
        eventB?: TimelineEvent;
        type: 'ONLY_IN_A' | 'ONLY_IN_B' | 'COMMON' | 'DATE_MISMATCH';
    }[];
}
/**
 * Valida conexões causais de eventos em uma timeline.
 * Retorna alertas de inconsistência cronológica se um evento consequência tiver sortOrder menor que um precursor.
 */
export declare function validateTimelineConsistency(events: TimelineEvent[]): {
    isValid: boolean;
    warnings: string[];
};
/**
 * Compara duas linhas do tempo e identifica eventos divergentes e equivalentes (UC-079).
 */
export declare function compareTimelines(timelineA: Timeline, eventsA: TimelineEvent[], timelineB: Timeline, eventsB: TimelineEvent[]): TimelineComparisonResult;
