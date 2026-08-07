import { TimelineEvent } from '@eldritch/domain';
import type { WikiEntity } from '../db/schema';
import { analyzeWithLocalLinguistics, entityCategoryFromLocalLabel } from './local-linguistic-analysis';

export const EXTRACTION_HEURISTIC_VERSION = 'local-evidence-gated-pt-v6';
export type EntityCategory = WikiEntity['type'];

export type ExtractedSuggestion =
  | { kind: 'chapter'; title: string; content: string; confidence: number; fingerprint: string }
  | { kind: 'entity'; name: string; type: EntityCategory; excerpt: string; confidence: number; charStart: number; charEnd: number; fingerprint: string; analysisSource?: 'RULES' | 'STANZA_LOCAL' }
  | { kind: 'event'; title: string; dateStr: string; excerpt: string; confidence: number; charStart: number; charEnd: number; fingerprint: string }
  | { kind: 'relation'; subject: string; target: string; relation: 'FILHO' | 'PAI' | 'CONJUGE'; excerpt: string; confidence: number; fingerprint: string };

export type ExtractionReadiness = { ready: true; text: string } | { ready: false; reason: string };
export type ExtractionOptions = { manuscriptId?: string; isNarrativeSource?: boolean; sourceKind?: 'NARRATIVE' | 'EDITORIAL' | 'CHRONICLE' };

const STOPWORDS = new Set(['a', 'abençoado', 'ainda', 'adeus', 'agora', 'alguém', 'ali', 'alguma', 'algumas', 'alguns', 'aquela', 'aquele', 'aqueles', 'antes', 'aqui', 'assim', 'atrás', 'bem', 'branca', 'brancas', 'cada', 'cair', 'certamente', 'cinzenta', 'cinzento', 'como', 'comitiva', 'comprido', 'continua', 'corrente', 'depois', 'desapareceu', 'dessa', 'deve', 'dias', 'diretor', 'dourada', 'ela', 'elas', 'ele', 'eles', 'então', 'era', 'escura', 'essa', 'esse', 'esta', 'estava', 'estão', 'finalmente', 'ficou', 'fogo', 'frequentemente', 'fruta', 'fugimos', 'grande', 'grandes', 'havia', 'hoje', 'hobbit', 'homem', 'houve', 'imortal', 'inominada', 'irei', 'isso', 'leste', 'linhagem', 'livre', 'livro', 'logo', 'mais', 'mas', 'máximo', 'meu', 'muitas', 'muitos', 'muito', 'nada', 'negro', 'nem', 'nenhum', 'norte', 'não', 'nós', 'nossa', 'nosso', 'nunca', 'novo', 'oeste', 'oculta', 'olhem', 'olharam', 'onde', 'ouro', 'ouvi', 'outros', 'para', 'parece', 'pedra', 'pequeno', 'pelo', 'poderoso', 'pois', 'portão', 'povo', 'puxa', 'quando', 'que', 'quem', 'quer', 'queremos', 'queria', 'realmente', 'rei', 'sabia', 'saco', 'saiu', 'seguiram', 'senhor', 'senhora', 'sempre', 'seria', 'seu', 'seus', 'sob', 'solitária', 'sombra', 'sombras', 'sobre', 'subiram', 'sua', 'supremo', 'tanto', 'temo', 'tenho', 'teve', 'todos', 'tudo', 'uma', 'vamos', 'vejo', 'velho', 'verde', 'viemos', 'vila', 'villa']);
const ITEM_HINT = /\b(anel|espada|coroa|livro|palantír|palantir|arma|cajado|joia|jóia|mapa|chave)\b/i;

const decodeHtml = (value: string) => value
  .replace(/&nbsp;/gi, ' ')
  .replace(/&quot;/gi, '"')
  .replace(/&#(?:x27|39);/gi, "'")
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>');

/** Normalizes only unambiguous PDF letter splits (for example, `M erry` -> `Merry`). */
export function normalizeImportedManuscript(value: string): string {
  let normalizedValue = value;
  for (let pass = 0; pass < 3; pass += 1) {
    const decoded = decodeHtml(normalizedValue);
    if (decoded === normalizedValue) break;
    normalizedValue = decoded;
  }
  return normalizedValue
    .replace(/[ﬁﬂ]/g, character => character === 'ﬁ' ? 'fi' : 'fl')
    .replace(/\b([BCDFGHIJKLMNPQRSTUVXYZÁÉÍÓÚÇ])\s+([a-záàâãéêíóôõúç]{2,})\b/gu, '$1$2')
    .replace(/\b([dD])\s+(e|o|a)\b/gu, '$1$2');
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

/** Browser-safe, deterministic source identity. It is for idempotency, never security. */
export function extractionSourceHash(value: string): string {
  const prepared = prepareManuscriptForExtraction(value);
  const text = prepared.ready ? prepared.text : value;
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${text.length.toString(36)}-${(hash >>> 0).toString(36)}`;
}

const fingerprint = (parts: Array<string | number | undefined>) => parts.map(part => String(part ?? '').trim().toLocaleLowerCase('pt-BR')).join('|');
const normalized = (value: string) => value.trim().replace(/\s+/g, ' ');
const validName = (value: string) => {
  const name = normalized(value);
  const words = name.split(' ');
  return name.length >= 3 && !STOPWORDS.has(name.toLocaleLowerCase('pt-BR')) && !/\b(?:de|da|do|dos|das)$/i.test(name) && words.every(word => word.length > 1 || /^(de|da|do|dos|das)$/i.test(word));
};

type Occurrence = { name: string; start: number; end: number; context: string };
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasPattern = (context: string, pattern: RegExp) => pattern.test(context);
const classifyEntityInContext = (name: string, context: string): { type: EntityCategory; confidence: number } | null => {
  const escapedName = escapeRegExp(name);
  const localPattern = new RegExp(`\\b(?:cidade|vila|aldeia|reino|terra|condado|floresta|rio|monte|montanha|vale|ilha|torre|fortaleza|portão|porto|região|planície|pântano)\\s+(?:de\\s+)?${escapedName}\\b`, 'i');
  const organizationPattern = new RegExp(`\\b(?:exército|exercito|companhia|irmandade|clã|cla|ordem|conselho|guarda)\\s+(?:de\\s+)?${escapedName}\\b`, 'i');
  const creaturePattern = new RegExp(`\\b(?:aranha|cavalo|lobo|dragão|dragao|águia|aguia|criatura|orc|orcs|troll|balrog)\\s+(?:${escapedName})\\b`, 'i');
  const speechPattern = new RegExp(`(?:\\b(?:disse|perguntou|respondeu|gritou|murmurou|exclamou|observou|continuou)\\s+${escapedName}\\b|\\b${escapedName}\\s+(?:disse|perguntou|respondeu|gritou|murmurou|exclamou|observou|continuou)\\b)`, 'i');
  const personalTitlePattern = new RegExp(`\\b(?:senhor|senhora|mestre|rei|rainha|dona|sr\\.?|sra\\.?)\\s+${escapedName}\\b`, 'i');
  const kinshipPattern = new RegExp(`\\b${escapedName}\\s*,?\\s*(?:filho|filha|pai|mãe|marido|esposa|cônjuge)\\b|\\b(?:filho|filha|pai|mãe|marido|esposa|cônjuge)\\s+d[eo]\\s+${escapedName}\\b`, 'i');
  // A nearby noun (for example, "o anel de Frodo") must not change Frodo into an item.
  if (hasPattern(context, localPattern)) return { type: 'Local', confidence: 0.9 };
  if (hasPattern(context, organizationPattern)) return { type: 'Organizacao', confidence: 0.9 };
  if (hasPattern(context, creaturePattern)) return { type: 'Criatura', confidence: 0.9 };
  if (ITEM_HINT.test(name) && !/\b(?:de|do|da|dos|das)\b/i.test(name)) return { type: 'Item', confidence: 0.88 };
  if (hasPattern(context, speechPattern) || hasPattern(context, personalTitlePattern) || hasPattern(context, kinshipPattern)) return { type: 'Personagem', confidence: 0.9 };
  // A capitalized word is not evidence that it denotes an entity. Keep recall conservative.
  return null;
};

const classifyEntity = (occurrences: Occurrence[]): { type: EntityCategory; confidence: number } | null => {
  const name = occurrences[0].name;
  const votes = new Map<EntityCategory, number>();
  for (const occurrence of occurrences) {
    const classification = classifyEntityInContext(name, occurrence.context);
    if (classification) votes.set(classification.type, (votes.get(classification.type) ?? 0) + 1);
  }
  const ranked = [...votes.entries()].sort((left, right) => right[1] - left[1]);
  const winner = ranked[0];
  // Never let one accidental context redefine every occurrence of a name. A
  // rule-only single-token candidate requires two independent confirmations.
  if (!winner || (name.split(' ').length === 1 && winner[1] < 2) || (ranked[1] && ranked[1][1] === winner[1])) return null;
  return { type: winner[0], confidence: 0.9 };
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
    const occurrence = { name, start, end: start + name.length, context: text.slice(Math.max(0, start - 110), Math.min(text.length, start + name.length + 110)) };
    byName.set(key, [...(byName.get(key) ?? []), occurrence]);
  }
  for (const occurrences of byName.values()) {
    const first = occurrences[0];
    const hasStrongShape = /\s/.test(first.name);
    if (occurrences.length < 2 && !hasStrongShape) continue;
    const classified = classifyEntity(occurrences);
    if (!classified) continue;
    output.push({ kind: 'entity', name: first.name, type: classified.type, excerpt: first.context.trim(), confidence: classified.confidence, charStart: first.start, charEnd: first.end, analysisSource: 'RULES', fingerprint: fingerprint(['entity', source, classified.type, first.name, first.start, EXTRACTION_HEURISTIC_VERSION]) });
  }

  if (options.isNarrativeSource !== false) {
    const metric = /\b(milhas?|metros?|páginas?|paginas?|capítulos?|capitulos?|horas?|dias?)\b/i;
    const eventPattern = /\b((?:ano\s+)?\d{3,4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b[^.!?\n]{8,180}[.!?]?/gi;
    for (const match of text.matchAll(eventPattern)) {
      const excerpt = match[0].trim();
      const dateStr = match[1];
      const start = match.index ?? 0;
      const before = text.slice(Math.max(0, start - 16), start);
      const hasTemporalContext = /\b(?:ano|era)\s*$/i.test(before) || /^ano\s+/i.test(dateStr) || /\b(?:era|ano)\b/i.test(excerpt);
      const hasNarrativePredicate = /\b(?:nasceu|morreu|começou|terminou|partiu|chegou|caiu|venceu|derrotou|casou|foi coroado|foi destruído|fundou)\b/i.test(excerpt);
      const looksEditorial = /\b(?:prefácio|prefacio|edição|edicao|publica(?:ção|cao)|escrev(?:i|eu|eram)|autor|estudante|professor)\b/i.test(excerpt);
      if (!hasTemporalContext || !hasNarrativePredicate || metric.test(excerpt) || looksEditorial || /\b[A-Z]\s+[a-z]{2,}\b/.test(excerpt)) continue;
      const title = excerpt.replace(/^\s*(?:ano\s+)?\d{1,4}\s*[,—:;-]?\s*/i, '').trim();
      if (title.length < 10 || title.length > 110) continue;
      output.push({ kind: 'event', title, dateStr, excerpt, confidence: 0.9, charStart: start, charEnd: start + excerpt.length, fingerprint: fingerprint(['event', source, dateStr, title, EXTRACTION_HEURISTIC_VERSION]) });
    }
    // Chronological appendices commonly use a bare year at the beginning of a
    // line. This narrow grammar accepts that format without turning distances,
    // page numbers or editorial dates into events.
    const chronicleLine = /^\s*(\d{3,4})\s+([^\n]{10,160})$/gim;
    for (const match of text.matchAll(chronicleLine)) {
      const year = match[1];
      const title = match[2].trim();
      if (!/\b(?:começa|começou|termina|terminou|batalha|guerra|morre|morreu|nasce|nasceu|coroa|coroado|fundou|fundada|caiu|destruiu|destruída|invadida)\b/i.test(title) || /\b(?:milhas?|metros?|páginas?|paginas?|dias?|horas?|minutos?|edição|edicao|autor|escrev(?:i|eu|eram))\b/i.test(title)) continue;
      const start = match.index ?? 0;
      output.push({ kind: 'event', title, dateStr: `Ano ${year}`, excerpt: match[0].trim(), confidence: 0.94, charStart: start, charEnd: start + match[0].length, fingerprint: fingerprint(['chronicle-event', source, year, title, EXTRACTION_HEURISTIC_VERSION]) });
    }
  }

  for (const match of text.matchAll(/([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\p{L}'-]{2,})\s+(?:é|era|foi)\s+(filho|filha|pai|mãe|marido|esposa|cônjuge)\s+d[eo]\s+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\p{L}'-]{2,})/giu)) {
    if (!validName(match[1]) || !validName(match[3])) continue;
    const relation = /filho|filha/i.test(match[2]) ? 'FILHO' : /pai|mãe/i.test(match[2]) ? 'PAI' : 'CONJUGE';
    const excerpt = match[0];
    output.push({ kind: 'relation', subject: match[1], target: match[3], relation, excerpt, confidence: 0.95, fingerprint: fingerprint(['relation', source, match[1], relation, match[3], EXTRACTION_HEURISTIC_VERSION]) });
  }
  return output;
}

/**
 * Uses the optional Stanza companion as the authority for named entities. The
 * deterministic extractor still handles chapters, explicit temporal events and
 * kinship statements, so the application remains fully usable without a model.
 */
export async function extractManuscriptSuggestionsWithLocalTools(html: string, options: ExtractionOptions = {}): Promise<ExtractedSuggestion[]> {
  const fallback = extractManuscriptSuggestions(html, options);
  const prepared = prepareManuscriptForExtraction(html);
  if (!prepared.ready) return fallback;
  const local = await analyzeWithLocalLinguistics(prepared.text);
  if (!local) return fallback;

  const source = options.manuscriptId;
  const localEntities: ExtractedSuggestion[] = [];
  const seen = new Set<string>();
  for (const entity of local.entities) {
    const name = normalized(entity.text);
    const type = entityCategoryFromLocalLabel(entity.label);
    if (!type || !validName(name)) continue;
    const key = `${type}|${name.toLocaleLowerCase('pt-BR')}|${entity.start}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const start = Math.max(0, entity.start);
    const end = Math.min(prepared.text.length, Math.max(entity.end, start + name.length));
    const excerpt = prepared.text.slice(Math.max(0, start - 120), Math.min(prepared.text.length, end + 120)).trim();
    localEntities.push({ kind: 'entity', name, type, excerpt, confidence: 0.96, charStart: start, charEnd: end, analysisSource: 'STANZA_LOCAL', fingerprint: fingerprint(['entity', source, type, name, start, EXTRACTION_HEURISTIC_VERSION, local.engine]) });
  }
  // A running local recognizer intentionally replaces heuristic entity guesses;
  // this is what prevents adjectives and sentence-initial words from becoming people.
  return [...fallback.filter(suggestion => suggestion.kind !== 'entity'), ...localEntities];
}

export function toTimelineEvent(suggestion: Extract<ExtractedSuggestion, { kind: 'event' }>, timelineId: string, sortOrder: number): TimelineEvent {
  const temporal = normalizeTemporalExpression(suggestion.dateStr);
  return { id: crypto.randomUUID(), timelineId, title: suggestion.title, dateStr: suggestion.dateStr, description: suggestion.excerpt, sortOrder, chronologicalSortKey: temporal.sortKey, datePrecision: temporal.precision, temporalSource: 'MANUSCRIPT', calendarSystem: temporal.calendarSystem, era: temporal.era, year: temporal.year, month: temporal.month, day: temporal.day, sourceKind: 'NARRATIVE', precursorEventIds: [], createdAt: new Date().toISOString() };
}

export type NormalizedTemporalExpression = {
  sortKey?: number;
  precision: 'YEAR' | 'MONTH' | 'DAY' | 'ERA_YEAR' | 'UNRESOLVED';
  calendarSystem?: 'GREGORIAN' | 'NARRATIVE';
  era?: string;
  year?: number;
  month?: number;
  day?: number;
};

/**
 * Converts only explicit calendar expressions into a sortable number. Bare numbers
 * ("300 metros", "1936 páginas") deliberately remain unresolved.
 */
export function normalizeTemporalExpression(value: string): NormalizedTemporalExpression {
  const text = value.trim().toLocaleLowerCase('pt-BR');
  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) return { sortKey: Number(iso[1]) * 10_000 + Number(iso[2]) * 100 + Number(iso[3]), precision: 'DAY', calendarSystem: 'GREGORIAN', year: Number(iso[1]), month: Number(iso[2]), day: Number(iso[3]) };
  const slash = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash) return { sortKey: Number(slash[3]) * 10_000 + Number(slash[2]) * 100 + Number(slash[1]), precision: 'DAY', calendarSystem: 'GREGORIAN', year: Number(slash[3]), month: Number(slash[2]), day: Number(slash[1]) };
  const year = text.match(/^(?:ano|year)\s+(\d{1,5})$/);
  if (year) return { sortKey: Number(year[1]) * 10_000, precision: 'YEAR', calendarSystem: 'NARRATIVE', year: Number(year[1]) };
  const eraYear = text.match(/^(?:ano\s+)?(\d{1,5})\s+(?:da|de)\s+(primeira|segunda|terceira|quarta)\s+era$/);
  if (eraYear) {
    const era = ['primeira', 'segunda', 'terceira', 'quarta'].indexOf(eraYear[2]);
    return { sortKey: era * 1_000_000_000 + Number(eraYear[1]) * 10_000, precision: 'ERA_YEAR', calendarSystem: 'NARRATIVE', era: eraYear[2], year: Number(eraYear[1]) };
  }
  return { precision: 'UNRESOLVED' };
}
