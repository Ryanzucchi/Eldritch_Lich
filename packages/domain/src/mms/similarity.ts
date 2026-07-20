/**
 * Computes cosine similarity between two numerical vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Basic local entity matcher for literary text.
 * Finds occurrences of entity keywords in text.
 */
export function matchLocalEntities(text: string, entities: { id: string; name: string; keywords: string[] }[]): string[] {
  const matchedIds: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const ent of entities) {
    const isMatched = ent.keywords.some(kw => lowerText.includes(kw.toLowerCase()));
    if (isMatched) {
      matchedIds.push(ent.id);
    }
  }
  
  return matchedIds;
}
