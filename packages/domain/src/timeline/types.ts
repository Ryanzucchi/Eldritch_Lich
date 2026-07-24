export interface TimelineEvent {
  id: string;
  timelineId: string;
  title: string;
  description?: string;
  dateStr: string; // e.g. "Ano 1042", "2026-07-24"
  sortOrder: number;
  characterIds?: string[];
  locationId?: string;
  factionId?: string;
  precursorEventIds?: string[]; // Connections UC-056
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
export function validateTimelineConsistency(events: TimelineEvent[]): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  const eventMap = new Map<string, TimelineEvent>();
  events.forEach(e => eventMap.set(e.id, e));

  events.forEach(event => {
    if (event.precursorEventIds && event.precursorEventIds.length > 0) {
      event.precursorEventIds.forEach(precursorId => {
        const precursor = eventMap.get(precursorId);
        if (precursor) {
          if (event.sortOrder < precursor.sortOrder) {
            warnings.push(
              `Alerta de inconsistência cronológica: O evento "${event.title}" está ordenado antes do seu evento precursor "${precursor.title}".`
            );
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
