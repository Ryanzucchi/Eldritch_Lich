export interface DetectedLanguage {
    langCode: 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it';
    confidence: number;
}
export interface DetectedEntity {
    id: string;
    name: string;
    type: 'PERSONAGEM' | 'LOCAL' | 'OBJETO' | 'ORGANIZACAO';
    startIndex: number;
    endIndex: number;
    confidence: number;
}
export interface SubfolderSuggestion {
    folderName: string;
    fileIds: string[];
    reason: string;
}
/**
 * Detecta o idioma baseado em frequências de n-gramas e stopwords básicas (UC-015).
 */
export declare function detectTextLanguage(text: string): DetectedLanguage;
/**
 * Tokenizador e validador de palavras com base no dicionário (UC-016).
 */
export declare function tokenizeAndValidateWords(text: string, dictionary: string[]): {
    word: string;
    isRecognized: boolean;
    startIndex: number;
    endIndex: number;
}[];
/**
 * Delimitador de limites de frases (UC-017).
 */
export declare function segmentSentences(text: string): {
    sentence: string;
    startIndex: number;
    endIndex: number;
}[];
/**
 * Reconhecimento de Entidades Nomeadas Baseado em Regras e Contexto (NER) (UC-018).
 */
export declare function extractNamedEntities(text: string, knownEntities?: {
    name: string;
    type: DetectedEntity['type'];
}[]): DetectedEntity[];
/**
 * IA clustering para organizar arquivos tematicamente (UC-019).
 */
export declare function suggestSubfolderGrouping(files: {
    id: string;
    title: string;
    content: string;
}[]): SubfolderSuggestion[];
