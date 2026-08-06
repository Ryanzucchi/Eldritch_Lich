"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeChapterLocally = summarizeChapterLocally;
const exporter_js_1 = require("../editor/exporter.js");
/** Fallback extractivo local: agrupa cenas e preserva as frases mais informativas de cada bloco. */
function summarizeChapterLocally(html, maxSentences = 5) {
    const scenes = html.split(/(?:\*\*\*|<hr\s*\/?>|<p>\s*<\/p>)/i).map(part => (0, exporter_js_1.htmlToPlainText)(part)).filter(Boolean);
    const selected = [];
    for (const scene of scenes.length ? scenes : [(0, exporter_js_1.htmlToPlainText)(html)]) {
        const sentences = scene.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(sentence => sentence.trim()).filter(Boolean) || [];
        const frequencies = new Map();
        sentences.forEach(sentence => (sentence.toLocaleLowerCase('pt-BR').match(/[\p{L}\p{N}]{4,}/gu) || []).forEach(term => frequencies.set(term, (frequencies.get(term) || 0) + 1)));
        const best = sentences.map((sentence, index) => ({ sentence, index, score: (sentence.toLocaleLowerCase('pt-BR').match(/[\p{L}\p{N}]{4,}/gu) || []).reduce((score, term) => score + (frequencies.get(term) || 0), 0) / Math.max(1, sentence.length) })).sort((left, right) => right.score - left.score || left.index - right.index)[0];
        if (best)
            selected.push(best.sentence);
    }
    return selected.slice(0, maxSentences).join(' ');
}
