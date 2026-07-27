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
/**
 * Formata uma referência bibliográfica de acordo com o estilo selecionado (UC-316).
 */
export declare function formatReference(ref: ReferenceItem, style: CitationStyle): string;
/**
 * Converte referências BibTeX/RIS simplificadas para instâncias do sistema (UC-313).
 */
export declare function parseBibTeX(bibtexString: string, projectId: string): Partial<ReferenceItem>[];
