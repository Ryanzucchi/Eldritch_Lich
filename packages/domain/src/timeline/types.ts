export interface TimelineEvent {
  id: string;
  timelineId: string;
  title: string;
  description?: string;
  dateStr: string; // e.g. "Ano 1042", "2026-07-24"
  /**
   * Chave cronológica calculada somente quando a data tem evidência suficiente.
   * Eventos sem uma data inequívoca continuam na posição editorial escolhida pelo autor.
   */
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
  precursorEventIds?: string[]; // Connections UC-056
  createdAt: string;
}

export interface Timeline {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  calendarType: 'gregorian' | 'custom';
  parentTimelineId?: string; // UC-076
  bifurcationEventId?: string; // UC-076
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

/**
 * Compara duas linhas do tempo e identifica eventos divergentes e equivalentes (UC-079).
 */
export function compareTimelines(
  timelineA: Timeline,
  eventsA: TimelineEvent[],
  timelineB: Timeline,
  eventsB: TimelineEvent[]
): TimelineComparisonResult {
  const divergentEvents: TimelineComparisonResult['divergentEvents'] = [];

  const mapB = new Map<string, TimelineEvent>();
  eventsB.forEach(e => mapB.set(e.title.toLowerCase(), e));

  const matchedBIds = new Set<string>();

  eventsA.forEach(evA => {
    const evB = mapB.get(evA.title.toLowerCase());
    if (evB) {
      matchedBIds.add(evB.id);
      if (evA.dateStr !== evB.dateStr) {
        divergentEvents.push({ eventA: evA, eventB: evB, type: 'DATE_MISMATCH' });
      } else {
        divergentEvents.push({ eventA: evA, eventB: evB, type: 'COMMON' });
      }
    } else {
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
