"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockEmbedding = getMockEmbedding;
exports.verifyZeroShotAction = verifyZeroShotAction;
/**
 * Generates a deterministic mock embedding vector of 128 dimensions for E5 small simulation.
 * This is fast, local, and works perfectly for browser/simulation contexts.
 */
function getMockEmbedding(text) {
    const dims = 128;
    const vec = new Array(dims).fill(0);
    const words = text.toLowerCase().split(/\W+/);
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word.length < 3)
            continue;
        // Simple hash function to map word to index
        let hash = 0;
        for (let c = 0; c < word.length; c++) {
            hash = (hash << 5) - hash + word.charCodeAt(c);
            hash |= 0;
        }
        const idx = Math.abs(hash) % dims;
        vec[idx] += 1;
    }
    // Normalize vector
    let norm = 0;
    for (let i = 0; i < dims; i++)
        norm += vec[i] * vec[i];
    if (norm > 0) {
        const sqrtNorm = Math.sqrt(norm);
        for (let i = 0; i < dims; i++)
            vec[i] /= sqrtNorm;
    }
    return vec;
}
/**
 * Simulates zero-shot LLM check for narrative events.
 * Returns success and explanation of why the action was classified as active or planning.
 */
function verifyZeroShotAction(text, goalTitle) {
    const lowerText = text.toLowerCase();
    // Indicators of planning/passive discussion
    const planningIndicators = [
        'vou', 'vamos', 'iremos', 'planejar', 'planejo', 'planeja', 'planejam',
        'quer', 'queria', 'querem', 'pensou em', 'pensar em', 'precisamos', 'preciso',
        'devemos', 'deveria', 'amanhã', 'mais tarde', 'discutiram sobre', 'falou em',
        'discutindo', 'pensando em'
    ];
    const isPlanning = planningIndicators.some(indicator => {
        const regex = new RegExp(`\\b${indicator}\\b`);
        return regex.test(lowerText);
    });
    if (isPlanning) {
        return {
            success: false,
            explanation: `Discussão passiva/planejamento detectada: O personagem expressa intenção ou plano de realizar a ação, mas não a executa ativamente no parágrafo.`
        };
    }
    return {
        success: true,
        explanation: `Ação ativa confirmada: O texto descreve o acontecimento em tempo narrativo real/passado.`
    };
}
