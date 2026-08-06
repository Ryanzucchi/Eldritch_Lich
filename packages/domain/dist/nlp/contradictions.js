"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLocalContradictions = detectLocalContradictions;
exports.detectCrossDocumentContradictions = detectCrossDocumentContradictions;
exports.detectLocationContradictions = detectLocationContradictions;
const negative = /\b(não|nunca|jamais|nenhum|sem)\b/i;
const terms = (value) => new Set(value.toLowerCase().match(/[\p{L}\p{N}]{4,}/gu) || []);
/** Fast local fallback: detects negated repetitions in a bounded sentence window. */
function detectLocalContradictions(text, maxSentences = 24) {
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(item => item.trim()).filter(Boolean).slice(-maxSentences) || [];
    const alerts = [];
    for (let index = 1; index < sentences.length; index++) {
        const hypothesis = sentences[index];
        const hypothesisTerms = terms(hypothesis);
        const hypothesisNegative = negative.test(hypothesis);
        for (let previous = Math.max(0, index - 8); previous < index; previous++) {
            const premise = sentences[previous];
            const premiseNegative = negative.test(premise);
            if (premiseNegative === hypothesisNegative)
                continue;
            const shared = [...terms(premise)].filter(term => hypothesisTerms.has(term));
            if (shared.length >= 2)
                alerts.push({ premise, hypothesis, confidence: Math.min(0.95, 0.65 + shared.length * 0.1), explanation: `Negação incompatível para: ${shared.slice(0, 3).join(', ')}.` });
        }
    }
    return alerts;
}
function detectCrossDocumentContradictions(documents) {
    const alerts = [];
    for (let source = 0; source < documents.length; source++)
        for (let target = source + 1; target < documents.length; target++) {
            const pairs = detectLocalContradictions(`${documents[source].content}\n${documents[target].content}`);
            for (const alert of pairs)
                alerts.push({ ...alert, sourceTitle: documents[source].title, targetTitle: documents[target].title });
        }
    return alerts;
}
function detectLocationContradictions(text) {
    const seen = new Map();
    const alerts = [];
    for (const sentence of text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []) {
        const match = sentence.match(/\b([\p{Lu}][\p{L}'-]*(?:\s+[\p{Lu}][\p{L}'-]*){0,3})\s+(?:fica|está|permanece|mora)\s+(?:em|no|na)\s+([\p{Lu}][\p{L}'-]*(?:\s+[\p{Lu}][\p{L}'-]*){0,3})/u);
        if (!match)
            continue;
        const entity = match[1];
        const location = match[2];
        const prior = seen.get(entity.toLowerCase());
        if (prior && prior.location.toLowerCase() !== location.toLowerCase())
            alerts.push({ entity, locations: [prior.location, location], premise: prior.sentence, hypothesis: sentence.trim(), confidence: 0.86, explanation: `${entity} é associado a locais distintos: ${prior.location} e ${location}.` });
        else
            seen.set(entity.toLowerCase(), { location, sentence: sentence.trim() });
    }
    return alerts;
}
