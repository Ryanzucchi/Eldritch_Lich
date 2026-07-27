export type CitationStyle = 'ABNT' | 'APA' | 'MLA' | 'VANCOUVER';
export interface ReferenceItem {
    id: string;
    projectId: string;
    type: 'JOURNAL_ARTICLE' | 'BOOK' | 'CONFERENCE_PAPER' | 'WEBSITE';
    title: string;
    authors: string[];
    journalOrPublisher?: string;
    year: number;
    volume?: string;
    pages?: string;
    doi?: string;
    url?: string;
    createdAt: string;
}
export interface ResearchNote {
    id: string;
    projectId: string;
    title: string;
    content: string;
    tags: string[];
    referenceId?: string;
    createdAt: string;
    updatedAt: string;
}
export interface NoteLink {
    sourceNoteId: string;
    targetNoteId: string;
    sourceTitle: string;
    targetTitle: string;
}
/**
 * Formata uma referência bibliográfica de acordo com o estilo selecionado (UC-316).
 */
export declare function formatReference(ref: ReferenceItem, style: CitationStyle): string;
/**
 * Converte referências BibTeX/RIS simplificadas para instâncias do sistema (UC-313).
 */
export declare function parseBibTeX(bibtexString: string, projectId: string): Partial<ReferenceItem>[];
/**
 * Extrai conexões bidirecionais [[Título da Nota]] do texto da nota (UC-326).
 */
export declare function extractWikiLinks(content: string): string[];
/**
 * Converte o manuscrito/notas do projeto para o código-fonte LaTeX compilável e arquivo de bibliografia .bib (UC-321).
 */
export declare function exportToLaTeX(title: string, content: string, references: ReferenceItem[]): {
    tex: string;
    bib: string;
};
