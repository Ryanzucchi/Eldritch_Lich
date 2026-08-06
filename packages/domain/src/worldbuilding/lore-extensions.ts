import { CharacterSheet, FactionSheet, HistoricalEventSheet, FamilyKinship } from './types.js';

export interface FactionWarOrTreaty {
  id: string;
  projectId: string;
  type: 'GUERRA' | 'TRATADO_PAZ' | 'ALIANCA';
  title: string;
  factionIds: string[];
  eventId?: string;
  startDate?: string;
  endDate?: string;
  description: string;
}

export interface FictionalLanguage {
  id: string;
  projectId: string;
  name: string;
  family?: string;
  dictionary: Record<string, string>; // original word -> translated word
  phonemes?: string[];
  namePrefixes?: string[];
  nameSuffixes?: string[];
}

export interface TechOrMagicNode {
  id: string;
  projectId: string;
  name: string;
  category: 'MAGIA' | 'TECNOLOGIA';
  prerequisiteIds: string[]; // DAG structure
  /** Pessoas que dominam, usam ou são diretamente afetadas por este elemento. */
  masterCharacterIds?: string[];
  /** Facções que detêm, usam ou regulam este elemento. */
  factionIds?: string[];
  description: string;
}

export interface ReligionSheet {
  id: string;
  projectId: string;
  name: string;
  pantheonDeities: string[];
  sacredLocationIds: string[];
  believerCharacterIds: string[];
  dogmaDescription: string;
}

export interface LoreConnectionCandidate { sourceId: string; targetId: string; score: number; sharedTerms: string[]; }
export interface LoreQuestionCandidate { entityId: string; question: string; rationale: string; }
export interface FamilyRelationCandidate { personId: string; relatedPersonId: string; relationType: FamilyKinship; excerpt: string; }

/** Extrai somente padrões factuais explícitos entre personagens previamente cadastrados. */
export function extractFamilyRelationsFromText(text: string, characters: Array<{ id: string; name: string }>): FamilyRelationCandidate[] {
  const normalized = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' '); const output: FamilyRelationCandidate[] = [];
  for (const subject of characters) for (const target of characters) {
    if (subject.id === target.id) continue;
    const esc = (name: string) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const patterns: Array<[RegExp, FamilyKinship]> = [
      [new RegExp(`${esc(subject.name)}\\s+(?:é|era|foi)\\s+(?:filho|filha)\\s+d[eo]\\s+${esc(target.name)}`, 'i'), 'FILHO'],
      [new RegExp(`${esc(subject.name)}\\s+(?:é|era|foi)\\s+(?:pai|mãe)\\s+d[eo]\\s+${esc(target.name)}`, 'i'), 'PAI'],
      [new RegExp(`${esc(subject.name)}\\s+(?:casou-se|casou)\\s+com\\s+${esc(target.name)}`, 'i'), 'CONJUGE']
    ];
    for (const [pattern, relationType] of patterns) { const match = normalized.match(pattern); if (match) output.push({ personId: subject.id, relatedPersonId: target.id, relationType, excerpt: match[0] }); }
  }
  return output;
}
const loreTerms = (value: string) => value.toLocaleLowerCase('pt-BR').match(/[\p{L}\p{N}]{3,}/gu) || [];
/** Similaridade cosseno TF-IDF local para sugerir vínculos sem transmitir fichas do universo. */
export function suggestLoreConnections(entities: Array<{ id: string; content: string }>, existingConnections: Array<{ sourceEntityId: string; targetEntityId: string }>, threshold = 0.8): LoreConnectionCandidate[] {
  const docs = entities.map(entity => ({ ...entity, terms: loreTerms(entity.content) })); const df = new Map<string, number>();
  docs.forEach(doc => new Set(doc.terms).forEach(term => df.set(term, (df.get(term) || 0) + 1)));
  const vectors = docs.map(doc => new Map(doc.terms.map(term => [term, Math.log((docs.length + 1) / ((df.get(term) || 0) + 1) + 1)])));
  const linked = new Set(existingConnections.flatMap(link => [`${link.sourceEntityId}:${link.targetEntityId}`, `${link.targetEntityId}:${link.sourceEntityId}`])); const output: LoreConnectionCandidate[] = [];
  for (let left = 0; left < docs.length; left++) for (let right = left + 1; right < docs.length; right++) {
    if (linked.has(`${docs[left].id}:${docs[right].id}`)) continue;
    const sharedTerms = [...vectors[left].keys()].filter(term => vectors[right].has(term));
    const dot = sharedTerms.reduce((sum, term) => sum + (vectors[left].get(term) || 0) * (vectors[right].get(term) || 0), 0);
    const norm = (vector: Map<string, number>) => Math.sqrt([...vector.values()].reduce((sum, value) => sum + value * value, 0)); const score = dot / Math.max(0.0001, norm(vectors[left]) * norm(vectors[right]));
    if (score >= threshold) output.push({ sourceId: docs[left].id, targetId: docs[right].id, score, sharedTerms: sharedTerms.slice(0, 5) });
  }
  return output.sort((left, right) => right.score - left.score);
}

/** Cria perguntas de continuidade a partir de lacunas explícitas em fichas locais. */
export function generateLoreQuestions(entities: Array<{ id: string; name: string; kind: 'personagem' | 'facção' | 'local' | 'item'; description?: string; linked?: boolean }>): LoreQuestionCandidate[] {
  return entities.flatMap(entity => {
    const questions: LoreQuestionCandidate[] = [];
    if (!entity.description?.trim()) questions.push({ entityId: entity.id, question: `Que detalhe essencial define ${entity.name}?`, rationale: 'A ficha ainda não possui descrição.' });
    if (!entity.linked) questions.push({ entityId: entity.id, question: `Como ${entity.name} se conecta aos demais elementos do universo?`, rationale: 'Nenhuma relação explícita foi cadastrada.' });
    if (entity.kind === 'personagem') questions.push({ entityId: entity.id, question: `Qual decisão de ${entity.name} pode alterar o rumo da trama?`, rationale: 'Pergunta dramática para aprofundar agência.' });
    if (entity.kind === 'local') questions.push({ entityId: entity.id, question: `Que acontecimento transformou ${entity.name} no cenário atual?`, rationale: 'Pergunta de história e causalidade do local.' });
    return questions;
  }).slice(0, 20);
}

export function translateTextToFictionalLanguage(
  text: string,
  language: FictionalLanguage
): string {
  if (!text || !language.dictionary) return text;

  let translated = text;
  for (const [orig, trans] of Object.entries(language.dictionary)) {
    const regex = new RegExp(`\\b${orig}\\b`, 'gi');
    translated = translated.replace(regex, trans);
  }
  return translated;
}

export function generateFictionalName(language: FictionalLanguage): string {
  const prefixes = language.namePrefixes && language.namePrefixes.length > 0
    ? language.namePrefixes
    : ['El', 'Val', 'Kor', 'Aet', 'Sil', 'Dra'];
  const suffixes = language.nameSuffixes && language.nameSuffixes.length > 0
    ? language.nameSuffixes
    : ['th', 'dor', 'mir', 'is', 'a', 'on'];

  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const s = suffixes[Math.floor(Math.random() * suffixes.length)];
  return p + s;
}
