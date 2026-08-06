import { htmlToPlainText } from '../editor/exporter.js';

/** Fallback extractivo local: agrupa cenas e preserva as frases mais informativas de cada bloco. */
export function summarizeChapterLocally(html: string, maxSentences = 5): string {
  const scenes = html.split(/(?:\*\*\*|<hr\s*\/?>|<p>\s*<\/p>)/i).map(part => htmlToPlainText(part)).filter(Boolean);
  const selected: string[] = [];
  for (const scene of scenes.length ? scenes : [htmlToPlainText(html)]) {
    const sentences = scene.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(sentence => sentence.trim()).filter(Boolean) || [];
    const frequencies = new Map<string, number>();
    sentences.forEach(sentence => (sentence.toLocaleLowerCase('pt-BR').match(/[\p{L}\p{N}]{4,}/gu) || []).forEach(term => frequencies.set(term, (frequencies.get(term) || 0) + 1)));
    const best = sentences.map((sentence, index) => ({ sentence, index, score: (sentence.toLocaleLowerCase('pt-BR').match(/[\p{L}\p{N}]{4,}/gu) || []).reduce((score, term) => score + (frequencies.get(term) || 0), 0) / Math.max(1, sentence.length) })).sort((left, right) => right.score - left.score || left.index - right.index)[0];
    if (best) selected.push(best.sentence);
  }
  return selected.slice(0, maxSentences).join(' ');
}
