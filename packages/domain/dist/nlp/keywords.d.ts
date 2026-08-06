export interface KeywordScore {
    term: string;
    score: number;
    occurrences: number;
}
/** Extrai termos relevantes com TF-IDF local; a coleção inteira compõe o corpus. */
export declare function extractTfIdfKeywords(documents: Array<{
    id: string;
    content: string;
}>, documentId?: string, limit?: number): KeywordScore[];
