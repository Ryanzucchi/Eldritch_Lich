export interface ManuscriptTemplate {
    id: string;
    name: string;
    category: 'narrativa' | 'worldbuilding' | 'personagem' | 'estrutura';
    description: string;
    titlePlaceholder: string;
    contentHtml: string;
}
export declare const MANUSCRIPT_TEMPLATES: ManuscriptTemplate[];
/**
 * Generates an automatic chapter title based on first paragraph or text content
 */
export declare function autoGenerateTitle(htmlContent: string): string;
