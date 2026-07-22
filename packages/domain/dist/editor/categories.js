"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorizeText = categorizeText;
/**
 * Analyzes manuscript content to automatically detect category and tags (UC-042)
 */
function categorizeText(htmlContent) {
    if (!htmlContent) {
        return { primaryCategory: 'Geral', tags: ['Rascunho'], dialoguePercentage: 0 };
    }
    const plainText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const totalWords = plainText.split(' ').length;
    // Count dialogue quotes
    const quotesMatch = plainText.match(/["“«—–-][^"”»—–-]+["”»—–-]/g) || [];
    const dialogueWords = quotesMatch.reduce((acc, q) => acc + q.split(' ').length, 0);
    const dialoguePercentage = totalWords > 0 ? Math.round((dialogueWords / totalWords) * 100) : 0;
    const tags = [];
    let primaryCategory = 'Narrativa Geral';
    if (dialoguePercentage > 40) {
        tags.push('Rico em Diálogo');
        primaryCategory = 'Cena de Diálogo';
    }
    const textLower = plainText.toLowerCase();
    if (textLower.includes('olhou') || textLower.includes('correu') || textLower.includes('gritou') || textLower.includes('espada') || textLower.includes('tiro')) {
        tags.push('Ação & Tensão');
        if (primaryCategory === 'Narrativa Geral')
            primaryCategory = 'Cena de Ação';
    }
    if (textLower.includes('senti') || textLower.includes('corado') || textLower.includes('amor') || textLower.includes('abraço') || textLower.includes('beijo')) {
        tags.push('Romance & Emoção');
        if (primaryCategory === 'Narrativa Geral')
            primaryCategory = 'Cena Romântica';
    }
    if (textLower.includes('sombra') || textLower.includes('sangue') || textLower.includes('segredo') || textLower.includes('misterio') || textLower.includes('escuro')) {
        tags.push('Mistério & Suspense');
        if (primaryCategory === 'Narrativa Geral')
            primaryCategory = 'Suspense & Mistério';
    }
    if (tags.length === 0) {
        tags.push('Descrição & Prosa');
    }
    return { primaryCategory, tags, dialoguePercentage };
}
