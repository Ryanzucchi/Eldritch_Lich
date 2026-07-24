"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFootnotes = processFootnotes;
exports.validateCrossReferences = validateCrossReferences;
/**
 * Normaliza e renumera automaticamente as notas de rodapé de um HTML/texto.
 * Substitui os marcadores de nota (ex: <span class="footnote-box"> ou <sup class="footnote-ref">)
 * garantindo a numeração sequencial 1, 2, 3... e extraindo a lista ordenada de notas de rodapé.
 */
function processFootnotes(html) {
    if (!html) {
        return { processedHtml: '', footnotes: [] };
    }
    const footnotes = [];
    let count = 0;
    // Regex para identificar spans/sups de notas de rodapé com texto/conteúdo
    const processedHtml = html.replace(/<span[^>]*class="[^"]*footnote-box[^"]*"[^>]*data-footnote-text="([^"]+)"[^>]*>([\s\S]*?)<\/span>|<span[^>]*class="[^"]*footnote-box[^"]*"[^>]*title="([^"]+)"[^>]*>([\s\S]*?)<\/span>/gi, (match, textAttr1, content1, textAttr2, content2) => {
        count++;
        const noteText = textAttr1 || textAttr2 || '';
        const id = `fn-${count}`;
        footnotes.push({
            id,
            number: count,
            text: noteText
        });
        return `<sup class="footnote-ref" data-footnote-id="${id}" data-footnote-number="${count}" title="${noteText.replace(/"/g, '&quot;')}">[${count}]</sup>`;
    });
    return { processedHtml, footnotes };
}
/**
 * Valida referências cruzadas entre capítulos no documento HTML.
 * Se o capítulo/manuscrito de destino não existir mais na lista de manuscritos disponíveis,
 * a referência é marcada como quebrada (isBroken: true).
 */
function validateCrossReferences(html, availableManuscriptIds) {
    if (!html) {
        return { validatedHtml: '', references: [] };
    }
    const references = [];
    const manuscriptSet = new Set(availableManuscriptIds);
    const validatedHtml = html.replace(/<a[^>]*class="[^"]*cross-ref-link[^"]*"[^>]*data-target-id="([^"]+)"[^>]*data-target-title="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (match, targetId, targetTitle, innerText) => {
        const isBroken = !manuscriptSet.has(targetId);
        const id = `xref-${targetId}`;
        references.push({
            id,
            targetManuscriptId: targetId,
            targetTitle,
            displayText: innerText,
            isBroken
        });
        if (isBroken) {
            return `<a class="cross-ref-link is-broken" data-target-id="${targetId}" data-target-title="${targetTitle}" title="Referência quebrada: o capítulo de destino foi excluído">⚠️ ${innerText} (Link quebrado)</a>`;
        }
        return `<a class="cross-ref-link" data-target-id="${targetId}" data-target-title="${targetTitle}" href="#${targetId}">${innerText}</a>`;
    });
    return { validatedHtml, references };
}
