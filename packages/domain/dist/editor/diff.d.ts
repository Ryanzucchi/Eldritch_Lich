export interface DiffChunk {
    type: 'added' | 'removed' | 'unchanged';
    text: string;
}
export interface DiffResult {
    chunks: DiffChunk[];
    addedWords: number;
    removedWords: number;
    unchangedWords: number;
}
/**
 * Computes word-level diff between oldText and newText (handling HTML tags cleanly by stripping or tokenizing)
 */
export declare function computeWordDiff(oldText: string, newText: string): DiffResult;
