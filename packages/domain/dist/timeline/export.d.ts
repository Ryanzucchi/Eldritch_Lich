import { Timeline, TimelineEvent } from './types.js';
export interface TimelineExportOptions {
    format: 'markdown' | 'json' | 'html';
    title?: string;
    eventsOnly?: boolean;
}
/**
 * Exporta a linha do tempo e seus eventos para formatos estruturados (JSON, Markdown ou HTML) (UC-171, UC-264).
 */
export declare function exportTimeline(timeline: Timeline, events: TimelineEvent[], options: TimelineExportOptions): string;
