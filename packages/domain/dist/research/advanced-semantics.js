"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextThemes = extractTextThemes;
exports.recommendDocumentLinks = recommendDocumentLinks;
exports.recommendFolderLinks = recommendFolderLinks;
/**
 * Reconhece temas dominantes com proporção de relevância (UC-031).
 */
function extractTextThemes(text) {
    const textLower = text.toLowerCase();
    if (text.trim().split(/\s+/).length < 40) {
        // Retorna vazio indicando necessidade de mais texto para fins de teste
        return [];
    }
    const themesDef = [
        { name: 'Vingança e Traição', keywords: ['vingança', 'traição', 'trair', 'matar', 'vingar', 'guerra', 'inimigo'] },
        { name: 'Redenção e Superação', keywords: ['redenção', 'superação', 'redimir', 'perdão', 'salvação', 'ajudar', 'recomeço'] },
        { name: 'Amor e Relações Pessoais', keywords: ['amor', 'família', 'casamento', 'paixão', 'amigo', 'lealdade', 'cuidado'] },
        { name: 'Magia e Conhecimento Arcano', keywords: ['magia', 'feitiço', 'arcano', 'livro', 'espada', 'misterioso', 'encantamento'] }
    ];
    const scores = {};
    let totalScore = 0;
    for (let t of themesDef) {
        let score = 0;
        for (let word of t.keywords) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = textLower.match(regex);
            if (matches)
                score += matches.length;
        }
        if (score > 0) {
            scores[t.name] = score;
            totalScore += score;
        }
    }
    if (totalScore === 0) {
        return [{ theme: 'Narrativa Neutra', percentage: 100 }];
    }
    return Object.keys(scores)
        .map(name => ({
        theme: name,
        percentage: Math.round((scores[name] / totalScore) * 100)
    }))
        .sort((a, b) => b.percentage - a.percentage);
}
/**
 * Calcula similaridade contextual entre múltiplos documentos do projeto (UC-034).
 */
function recommendDocumentLinks(currentDoc, otherDocs) {
    if (otherDocs.length === 0)
        return [];
    const links = [];
    const currentTokens = new Set(currentDoc.content.toLowerCase().split(/\W+/));
    for (let doc of otherDocs) {
        const docTokens = doc.content.toLowerCase().split(/\W+/);
        let intersection = 0;
        for (let token of docTokens) {
            if (currentTokens.has(token) && token.length > 3) {
                intersection++;
            }
        }
        const similarity = Math.round((intersection / Math.max(1, currentTokens.size)) * 100) / 100;
        if (similarity > 0.15) {
            links.push({
                id: `doc_link_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                sourceDocId: currentDoc.id,
                targetDocId: doc.id,
                similarityScore: similarity,
                reason: `Alta correlação semântica (${Math.round(similarity * 100)}%) detectada em vocabulário comum.`
            });
        }
    }
    return links.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, 5);
}
/**
 * Calcula correlação contextual acumulada entre pastas baseado em seus textos (UC-035).
 */
function recommendFolderLinks(folders, documents) {
    const links = [];
    const folderTokens = {};
    // Consolda tokens de todas as pastas que possuem arquivos
    for (let folder of folders) {
        if (folder.fileIds.length === 0)
            continue;
        const tokens = new Set();
        for (let fid of folder.fileIds) {
            const doc = documents.find(d => d.id === fid);
            if (doc) {
                doc.content.toLowerCase().split(/\W+/).forEach(t => {
                    if (t.length > 3)
                        tokens.add(t);
                });
            }
        }
        folderTokens[folder.id] = tokens;
    }
    const folderIds = Object.keys(folderTokens);
    for (let i = 0; i < folderIds.length; i++) {
        for (let j = i + 1; j < folderIds.length; j++) {
            const f1 = folderIds[i];
            const f2 = folderIds[j];
            const t1 = folderTokens[f1];
            const t2 = folderTokens[f2];
            let intersection = 0;
            t2.forEach(token => {
                if (t1.has(token))
                    intersection++;
            });
            const score = Math.round((intersection / Math.max(1, t1.size)) * 100) / 100;
            if (score > 0.2) {
                links.push({
                    id: `folder_link_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                    sourceFolderId: f1,
                    targetFolderId: f2,
                    similarityScore: score,
                    reason: `Correlação temática de pastas estabelecida em ${Math.round(score * 100)}%.`
                });
            }
        }
    }
    return links;
}
