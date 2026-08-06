import { TimelineEvent } from '@eldritch/domain';
import type { WikiEntity } from '../db/schema';

export type ExtractedSuggestion =
  | { kind: 'chapter'; title: string; content: string }
  | { kind: 'entity'; name: string; type: WikiEntity['type']; excerpt: string }
  | { kind: 'event'; title: string; dateStr: string; excerpt: string }
  | { kind: 'relation'; subject: string; target: string; relation: 'FILHO' | 'PAI' | 'CONJUGE'; excerpt: string };

const plain = (value: string) => value.replace(/<[^>]*>/g, '\n').replace(/&nbsp;/g, ' ').replace(/[ \t]+/g, ' ').trim();

/** Local, deterministic extraction. It only proposes explicit patterns and never edits the manuscript. */
export function extractManuscriptSuggestions(html: string): ExtractedSuggestion[] {
  const text = plain(html);
  const output: ExtractedSuggestion[] = [];
  const chapterPattern = /(?:^|\n|\s)(?:cap[ií]tulo|chapter)\s+(\d+|[ivxlcdm]+)\s*[:—-]\s*([^\n]{3,80})/gim;
  const chapterMatches = [...text.matchAll(chapterPattern)];
  chapterMatches.forEach((match, index) => {
    const startsAt = (match.index ?? 0) + match[0].length;
    const endsAt = chapterMatches[index + 1]?.index ?? text.length;
    const content = text.slice(startsAt, endsAt).trim();
    output.push({ kind: 'chapter', title: `Capítulo ${match[1]} — ${match[2].trim()}`, content });
  });
  const names = new Set<string>();
  for (const match of text.matchAll(/\b([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\p{L}'-]{2,}(?:\s+(?:de|da|do|dos|das)\s+)?(?:[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\p{L}'-]{2,})?)\b/gu)) {
    const name = match[1].trim(); if (!/^(Capítulo|Quando|Onde|Depois|Antes|Durante)$/i.test(name)) names.add(name);
  }
  [...names].slice(0, 20).forEach(name => output.push({ kind: 'entity', name, type: 'Personagem', excerpt: name }));
  for (const match of text.matchAll(/(?:em\s+)?((?:ano\s+)?\d{3,4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})[,—:;\s]+([^.!?]{6,120})/gi)) output.push({ kind: 'event', dateStr: match[1], title: match[2].trim(), excerpt: match[0] });
  for (const match of text.matchAll(/([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\p{L}'-]{2,})\s+(?:é|era|foi)\s+(filho|filha|pai|mãe|marido|esposa|cônjuge)\s+d[eo]\s+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\p{L}'-]{2,})/giu)) {
    const relation = /filho|filha/i.test(match[2]) ? 'FILHO' : /pai|mãe/i.test(match[2]) ? 'PAI' : 'CONJUGE'; output.push({ kind: 'relation', subject: match[1], target: match[3], relation, excerpt: match[0] });
  }
  return output;
}

export function toTimelineEvent(suggestion: Extract<ExtractedSuggestion, { kind: 'event' }>, timelineId: string, sortOrder: number): TimelineEvent {
  return { id: crypto.randomUUID(), timelineId, title: suggestion.title, dateStr: suggestion.dateStr, description: suggestion.excerpt, sortOrder, precursorEventIds: [], createdAt: new Date().toISOString() };
}
