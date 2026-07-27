export interface SemanticTextGroup {
    groupId: string;
    themeTitle: string;
    fileIds: string[];
    confidence: number;
}
export interface LexicalFrequency {
    term: string;
    count: number;
    variations: string[];
}
export interface WordContextDefinition {
    word: string;
    contextDefinition: string;
    synonyms: string[];
}
export interface ContextualWordLink {
    id: string;
    sourceWord: string;
    targetWord: string;
    contextReason: string;
}
/**
 * Remove stopwords brasileiras/portuguesas e calcula frequências lematizadas de palavras (UC-020).
 */
export declare function groupAndAnalyzeLexicon(text: string, excludeTerms?: string[]): LexicalFrequency[];
/**
 * Agrupa textos por similaridade semântica simulando cosine similarity com embeddings (UC-021).
 */
export declare function groupSimilarDocumentsSemantic(documents: {
    id: string;
    title: string;
    content: string;
}[], sensitivity?: number): SemanticTextGroup[];
/**
 * Desambigua contexto de palavras polissêmicas comuns (UC-030).
 */
export declare function desambiguateWordContext(word: string, surroundingText: string): WordContextDefinition;
/**
 * Cria conexões automáticas de palavras baseadas em contexto e grafos semânticos (UC-033).
 */
export declare function generateContextualWordLinks(currentText: string, projectLexicon: {
    word: string;
    documentTitle: string;
    docId: string;
}[]): ContextualWordLink[];
