export interface DocumentContextLink {
    id: string;
    sourceDocId: string;
    targetDocId: string;
    similarityScore: number;
    reason: string;
}
export interface FolderContextLink {
    id: string;
    sourceFolderId: string;
    targetFolderId: string;
    similarityScore: number;
    reason: string;
}
export interface TextThemeClassification {
    theme: string;
    percentage: number;
}
/**
 * Reconhece temas dominantes com proporção de relevância (UC-031).
 */
export declare function extractTextThemes(text: string): TextThemeClassification[];
/**
 * Calcula similaridade contextual entre múltiplos documentos do projeto (UC-034).
 */
export declare function recommendDocumentLinks(currentDoc: {
    id: string;
    title: string;
    content: string;
}, otherDocs: {
    id: string;
    title: string;
    content: string;
}[]): DocumentContextLink[];
/**
 * Calcula correlação contextual acumulada entre pastas baseado em seus textos (UC-035).
 */
export declare function recommendFolderLinks(folders: {
    id: string;
    name: string;
    fileIds: string[];
}[], documents: {
    id: string;
    content: string;
}[]): FolderContextLink[];
