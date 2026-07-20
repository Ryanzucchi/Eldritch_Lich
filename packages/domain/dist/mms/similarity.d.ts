/**
 * Computes cosine similarity between two numerical vectors.
 */
export declare function cosineSimilarity(vecA: number[], vecB: number[]): number;
/**
 * Basic local entity matcher for literary text.
 * Finds occurrences of entity keywords in text.
 */
export declare function matchLocalEntities(text: string, entities: {
    id: string;
    name: string;
    keywords: string[];
}[]): string[];
