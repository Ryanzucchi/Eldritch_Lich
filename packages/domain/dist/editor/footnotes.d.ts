export interface FootnoteItem {
    id: string;
    number: number;
    text: string;
}
export interface CrossReferenceItem {
    id: string;
    targetManuscriptId: string;
    targetTitle: string;
    displayText: string;
    isBroken?: boolean;
}
/**
 * Normaliza e renumera automaticamente as notas de rodapé de um HTML/texto.
 * Substitui os marcadores de nota (ex: <span class="footnote-box"> ou <sup class="footnote-ref">)
 * garantindo a numeração sequencial 1, 2, 3... e extraindo a lista ordenada de notas de rodapé.
 */
export declare function processFootnotes(html: string): {
    processedHtml: string;
    footnotes: FootnoteItem[];
};
/**
 * Valida referências cruzadas entre capítulos no documento HTML.
 * Se o capítulo/manuscrito de destino não existir mais na lista de manuscritos disponíveis,
 * a referência é marcada como quebrada (isBroken: true).
 */
export declare function validateCrossReferences(html: string, availableManuscriptIds: string[]): {
    validatedHtml: string;
    references: CrossReferenceItem[];
};
