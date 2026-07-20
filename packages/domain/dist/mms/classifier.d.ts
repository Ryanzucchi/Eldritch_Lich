/**
 * Generates a deterministic mock embedding vector of 128 dimensions for E5 small simulation.
 * This is fast, local, and works perfectly for browser/simulation contexts.
 */
export declare function getMockEmbedding(text: string): number[];
/**
 * Simulates zero-shot LLM check for narrative events.
 * Returns success and explanation of why the action was classified as active or planning.
 */
export declare function verifyZeroShotAction(text: string, goalTitle: string): {
    success: boolean;
    explanation: string;
};
