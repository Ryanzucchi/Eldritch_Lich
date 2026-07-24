export interface TimelineEvent {
    id: string;
    timelineId: string;
    title: string;
    description?: string;
    dateStr: string;
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
    createdAt: string;
    updatedAt: string;
}
/**
 * Valida conexões causais de eventos em uma timeline.
 * Retorna alertas de inconsistência cronológica se um evento consequência tiver sortOrder menor que um precursor.
 */
export declare function validateTimelineConsistency(events: TimelineEvent[]): {
    isValid: boolean;
    warnings: string[];
};
