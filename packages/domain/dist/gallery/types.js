"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterMediaAssets = filterMediaAssets;
/**
 * Filtra imagens da galeria por busca de texto em título, tags ou entidades (UC-271).
 */
function filterMediaAssets(assets, query, categoryFilter = 'ALL') {
    const q = query.trim().toLowerCase();
    return assets.filter(asset => {
        if (categoryFilter !== 'ALL' && asset.category !== categoryFilter) {
            return false;
        }
        if (!q)
            return true;
        const matchTitle = asset.title.toLowerCase().includes(q);
        const matchEntity = asset.entityName?.toLowerCase().includes(q);
        const matchTag = asset.tags.some(t => t.toLowerCase().includes(q));
        return matchTitle || matchEntity || matchTag;
    });
}
