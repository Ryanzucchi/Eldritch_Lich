import { Manuscript } from './types.js';
export type ExportFormat = 'txt' | 'md' | 'html' | 'docx' | 'epub' | 'pdf' | 'fountain';
export interface ExportResult {
    filename: string;
    mimeType: string;
    content: string | Blob;
}
/**
 * Converts HTML content to clean Markdown string
 */
export declare function htmlToMarkdown(html: string): string;
/**
 * Converts Markdown string to clean HTML
 */
export declare function markdownToHtml(md: string): string;
/**
 * Strips HTML and converts to plain text
 */
export declare function htmlToPlainText(html: string): string;
/** Conversão determinística de HTML literário para o formato de roteiro Fountain. */
export declare function htmlToFountain(html: string): string;
/**
 * Compiles single or multiple manuscripts into specified format file
 */
export declare function exportManuscripts(manuscripts: Manuscript[], format: ExportFormat, projectTitle?: string): ExportResult;
