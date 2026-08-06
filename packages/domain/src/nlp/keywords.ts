export interface KeywordScore { term: string; score: number; occurrences: number; }

const stopwords = new Set(['a','ao','aos','as','à','às','aquela','aquele','com','como','da','das','de','do','dos','e','é','ela','ele','em','entre','era','essa','esse','esta','este','foi','há','isso','já','mais','mas','na','não','nas','no','nos','o','os','ou','para','pela','pelas','pelo','pelos','por','que','se','sem','ser','sua','seu','são','tem','um','uma','uns','umas']);
const terms = (text: string) => (text.toLocaleLowerCase('pt-BR').match(/[\p{L}\p{N}]{3,}/gu) || []).filter(term => !stopwords.has(term));

/** Extrai termos relevantes com TF-IDF local; a coleção inteira compõe o corpus. */
export function extractTfIdfKeywords(documents: Array<{ id: string; content: string }>, documentId?: string, limit = 10): KeywordScore[] {
  const tokenized = documents.map(document => ({ id: document.id, terms: terms(document.content) }));
  const target = tokenized.find(document => document.id === documentId) || tokenized[0];
  if (!target?.terms.length) return [];
  const frequency = new Map<string, number>(); const documentFrequency = new Map<string, number>();
  target.terms.forEach(term => frequency.set(term, (frequency.get(term) || 0) + 1));
  tokenized.forEach(document => new Set(document.terms).forEach(term => documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1)));
  return [...frequency.entries()].map(([term, occurrences]) => ({ term, occurrences, score: (occurrences / target.terms.length) * Math.log((tokenized.length + 1) / ((documentFrequency.get(term) || 0) + 1) + 1) })).sort((a, b) => b.score - a.score || b.occurrences - a.occurrences || a.term.localeCompare(b.term)).slice(0, limit);
}
