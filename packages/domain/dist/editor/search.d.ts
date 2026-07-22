export interface SearchOptions {
    caseSensitive?: boolean;
    wholeWord?: boolean;
    isRegex?: boolean;
}
export interface SearchMatch {
    index: number;
    length: number;
    text: string;
    contextSnippet: string;
}
/**
 * Searches for matches in text (plain text or html text) with support for exact word, phrase, or regex/contextual queries.
 */
export declare function searchInText(content: string, query: string, options?: SearchOptions): SearchMatch[];
/**
 * Replaces a single match by index and length
 */
export declare function replaceMatchInText(content: string, match: SearchMatch, replacement: string): string;
/**
 * Replaces all matches in content returning updated text and total replacements count
 */
export declare function replaceAllInText(content: string, query: string, replacement: string, options?: SearchOptions): {
    updatedText: string;
    replacementCount: number;
};
