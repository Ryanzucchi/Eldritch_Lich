export interface CategoryResult {
    primaryCategory: string;
    tags: string[];
    dialoguePercentage: number;
}
/**
 * Analyzes manuscript content to automatically detect category and tags (UC-042)
 */
export declare function categorizeText(htmlContent: string): CategoryResult;
