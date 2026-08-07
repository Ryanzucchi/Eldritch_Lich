import { TimelineEvent } from '@eldritch/domain';
import type { WikiEntity } from '../db/schema';

export const EXTRACTION_HEURISTIC_VERSION = 'conservative-pt-v2';
export type EntityCategory = WikiEntity['type'];

export type ExtractedSuggestion =
  | { kind: 'chapter'; title: string; content: string; confidence: number; fingerprint: string }
  | { kind: 'entity'; name: string; type: EntityCategory; excerpt: string; confidence: number; charStart: number; charEnd: number; fingerprint: string }
  | { kind: 'event'; title: string; dateStr: string; excerpt: string; confidence: number; charStart: number; charEnd: number; fingerprint: string }
  | { kind: 'relation'; subject: string; target: string; relation: 'FILHO' | 'PAI' | 'CONJUGE'; excerpt: string; confidence: number; fingerprint: string };

export type ExtractionReadiness = { ready: true; text: string } | { ready: false; reason: string };
export type ExtractionOptions = { manuscriptId?: string; isNarrativeSource?: boolean };

const STOPWORDS = new Set(['a', 'ainda', 'agora', 'aquela', 'aquele', 'aqueles', 'aqui', 'aos', 'assim', 'atrás', 'bem', 'como', 'comitiva', 'depois', 'deve', 'dias', 'ela', 'eles', 'então', 'era', 'esta', 'estava', 'estão', 'fale', 'falaram', 'faria', 'ficaram', 'fogo', 'fugimos', 'grande', 'grandes', 'havia', 'hoje', 'houve', 'irei', 'livro', 'mais', 'mas', 'nada', 'não', 'olhem', 'olharam', 'onde', 'outros', 'para', 'parece', 'pelo', 'pois', 'por', 'puxa', 'quer', 'queremos', 'rei', 'sabia', 'saiu', 'seguiram', 'seu', 'sempre', 'seria', 'sob', 'sobre', 'subiram', 'tanto', 'temo', 'teve', 'todos', 'uma', 'vamos', 'vejo', 'viemos']);
const LOCATION_HINT = /\b(cidade|vila|aldeia|reino|terra|condado|floresta|rio|monte|montanha|vale|ilha|torre|fortaleza|portão|porto|região|planície|pântano)\b/i;
const ITEM_HINT = /\b(anel|espada|coroa|livro|palantír|palantir|arma|cajado|joia|jóia|mapa|chave)\b/i;
const ORGANIZATION_HINT = /\b(exército|exercito|companhia|irmandade|casa|povo|clã|cla|ordem|conselho|guarda)\b/i;
const CREATURE_HINT = /\b(aranha|cavalo|lobo|dragão|dragao|águia|aguia|criatura|orcs?|troll|balrog)\b/i;

const decodeHtml = (value: string) => value
  .replace(/&nbsp;/gi, ' ')
  .replace(/&quot;/gi, '"')
  .replace(/&#(?:x27|39);/gi, "'")
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>');

/** Normalizes only unambiguous PDF letter splits (for example, `M erry` -> `Merry`). */
export function normalizeImportedManuscript(value: string): string {
  return decodeHtml(value).replace(/\b([BCDFGHIJKLMNPQRSTUVXYZÁÉÍÓÚÇ])\s+([a-záàâãéêíóôõúç]{2,})\b/gu, '$1$2');
}

/** Refuses malformed imported text instead of inventing entities from PDF/HTML artifacts. */
export function prepareManuscriptForExtraction(value: string): ExtractionReadiness {
  const hasEscapedMarkup = /&lt;\/?(?:p|h[1-6]|div|section|article)\b/i.test(value);
  const normalizedHtml = normalizeImportedManuscript(value);
  const text = normalizedHtml.replace(/<[^>]*>/g, '\n').replace(/[\t\r]+/g, ' ').replace(/\n{3,}/g, '\n\n').replace(/[ ]{2,}/g, ' ').trim();
  const hasPdfLetterSpacing = /\b[BCDFGHIJKLMNPQRSTUVXYZÁÉÍÓÚÇ]\s+[a-záàâãéêíóôõúç]{2,}\b/u.test(text);
  if (hasEscapedMarkup) return { ready: false, reason: 'O manuscrito contém HTML codificado como texto. Salve a normalização da importação antes de analisar.' };
  if (hasPdfLetterSpacing) return { ready: false, reason: 'O manuscrito contém espaçamento típico de extração de PDF. Revise ou normalize o texto antes de analisar.' };
  if (text.length < 24) return { ready: false, reason: 'O manuscrito não tem texto suficiente para uma análise segura.' };
  return { ready: true, text };
}

const fingerprint = (parts: Array<string | number | undefined>) => parts.map(part => String(part ?? '').trim().toLocaleLowerCase('pt-BR')).join('|');
const normalized = (value: string) => value.trim().replace(/\s+/g, ' ');
const validName = (value: string) => {
  const name = normalized(value);
  const words = name.split(' ');
  return name.length >= 3 && !STOPWORDS.has(name.toLocaleLowerCase('pt-BR')) && !/\b(?:de|da|do|dos|das)$/i.test(name) && words.every(word => word.length > 1 || /^(de|da|do|dos|das)$/i.test(word));
};

type Occurrence = { name: string; start: number; end: number; context: string };
const classifyEntity = (occurrences: Occurrence[]): { type: EntityCategory; confidence: number } => {
  const context = occurrences.map(item => item.context).join(' ');
  const name = occurrences[0].name;
  if (ITEM_HINT.test(`${name} ${context}`)) return { type: 'Item', confidence: 0.84 };
  if (LOCATION_HINT.test(`${name} ${context}`) || /\b(?:em|para|até|desde)\s+$/i.test(context)) return { type: 'Local', confidence: 0.78 };
  if (ORGANIZATION_HINT.test(`${name} ${context}`)) return { type: 'Organizacao', confidence: 0.76 };
  if (CREATURE_HINT.test(`${name} ${context}`)) return { type: 'Criatura', confidence: 0.76 };
  return { type: 'Personagem', confidence: occurrences.length >= 3 || /\s/.test(name) ? 0.74 : 0.7 };
};

/** Conservative local fallback. It emits reviewable candidates and never writes universe records. */
export function extractManuscriptSuggestions(html: string, options: ExtractionOptions = {}): ExtractedSuggestion[] {
  const prepared = prepareManuscriptForExtraction(html);
  if (!prepared.ready) return [];
  const text = prepared.text;
  const output: ExtractedSuggestion[] = [];
  const source = options.manuscriptId;
  const chapterPattern = /(?:^|\n|\s)(?:cap[ií]tulo|chapter)\s+(\d+|[ivxlcdm]+)\s*[:—-]\s*([^\n]{3,80})/gim;
  const chapterMatches = [...text.matchAll(chapterPattern)];
  chapterMatches.forEach((match, index) => {
    const startsAt = (match.index ?? 0) + match[0].length;
    const endsAt = chapterMatches[index + 1]?.index ?? text.length;
    const content = text.slice(startsAt, endsAt).trim();
    const title = `Capítulo ${match[1]} — ${match[2].trim()}`;
    output.push({ kind: 'chapter', title, content, confidence: 0.98, fingerprint: fingerprint(['chapter', source, title]) });
  });

  const byName = new Map<string, Occurrence[]>();
  const entityPattern = /\b([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\p{L}'-]{2,}(?:\s+(?:de|da|do|dos|das)\s+)?(?:[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\p{L}'-]{2,})?)\b/gu;
  for (const match of text.matchAll(entityPattern)) {
    const name = normalized(match[1]);
    if (!validName(name)) continue;
    const start = match.index ?? 0;
    const key = name.toLocaleLowerCase('pt-BR');
    const occurrence = { name, start, end: start + name.length, context: text.slice(Math.max(0, start - 36), Math.min(text.length, start + name.length + 36)) };
    byName.set(key, [...(byName.get(key) ?? []), occurrence]);
  }
  for (const occurrences of byName.values()) {
    const first = occurrences[0];
    const hasStrongShape = /\s/.test(first.name) || /\b(?:senhor|senhora|dona|rei|rainha)\b/i.test(first.context);
    if (occurrences.length < 2 && !hasStrongShape) continue;
    const classified = classifyEntity(occurrences);
    if (classified.confidence < 0.7) continue;
    output.push({ kind: 'entity', name: first.name, type: classified.type, excerpt: first.context.trim(), confidence: classified.confidence, charStart: first.start, charEnd: first.end, fingerprint: fingerprint(['entity', source, classified.type, first.name, first.start, EXTRACTION_HEURISTIC_VERSION]) });
  }

  if (options.isNarrativeSource !== false) {
    const metric = /\b(milhas?|metros?|páginas?|paginas?|capítulos?|capitulos?|horas?|dias?)\b/i;
    const eventPattern = /\b((?:ano\s+)?\d{3,4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b[^.!?\n]{8,180}[.!?]?/gi;
    for (const match of text.matchAll(eventPattern)) {
      const excerpt = match[0].trim();
      const dateStr = match[1];
      const start = match.index ?? 0;
      const before = text.slice(Math.max(0, start - 16), start);
      const hasTemporalContext = /\b(?:ano|era|em)\s*$/i.test(before) || /^ano\s+/i.test(dateStr) || /\b(?:era|ano)\b/i.test(excerpt);
      if (!hasTemporalContext || metric.test(excerpt)) continue;
      const title = excerpt.replace(/^\s*(?:ano\s+)?\d{1,4}\s*[,—:;-]?\s*/i, '').trim();
      if (title.length < 10) continue;
      output.push({ kind: 'event', title, dateStr, excerpt, confidence: 0.78, charStart: start, charEnd: start + excerpt.length, fingerprint: fingerprint(['event', source, dateStr, title, EXTRACTION_HEURISTIC_VERSION]) });
    }
  }

  for (const match of text.matchAll(/([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\p{L}'-]{2,})\s+(?:é|era|foi)\s+(filho|filha|pai|mãe|marido|esposa|cônjuge)\s+d[eo]\s+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\p{L}'-]{2,})/giu)) {
    const relation = /filho|filha/i.test(match[2]) ? 'FILHO' : /pai|mãe/i.test(match[2]) ? 'PAI' : 'CONJUGE';
    const excerpt = match[0];
    output.push({ kind: 'relation', subject: match[1], target: match[3], relation, excerpt, confidence: 0.9, fingerprint: fingerprint(['relation', source, match[1], relation, match[3], EXTRACTION_HEURISTIC_VERSION]) });
  }
  return output;
}

export function toTimelineEvent(suggestion: Extract<ExtractedSuggestion, { kind: 'event' }>, timelineId: string, sortOrder: number): TimelineEvent {
  return { id: crypto.randomUUID(), timelineId, title: suggestion.title, dateStr: suggestion.dateStr, description: suggestion.excerpt, sortOrder, precursorEventIds: [], createdAt: new Date().toISOString() };
}
