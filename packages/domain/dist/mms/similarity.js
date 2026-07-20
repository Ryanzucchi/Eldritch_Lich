"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosineSimilarity = cosineSimilarity;
exports.matchLocalEntities = matchLocalEntities;
/**
 * Computes cosine similarity between two numerical vectors.
 */
function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length)
        return 0;
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0)
        return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
/**
 * Basic local entity matcher for literary text.
 * Finds occurrences of entity keywords in text.
 */
function matchLocalEntities(text, entities) {
    const matchedIds = [];
    const lowerText = text.toLowerCase();
    for (const ent of entities) {
        const isMatched = ent.keywords.some(kw => lowerText.includes(kw.toLowerCase()));
        if (isMatched) {
            matchedIds.push(ent.id);
        }
    }
    return matchedIds;
}
