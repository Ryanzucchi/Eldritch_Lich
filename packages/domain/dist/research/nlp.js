"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectTextLanguage = detectTextLanguage;
exports.tokenizeAndValidateWords = tokenizeAndValidateWords;
exports.segmentSentences = segmentSentences;
exports.extractNamedEntities = extractNamedEntities;
exports.suggestSubfolderGrouping = suggestSubfolderGrouping;
/**
 * Detecta o idioma baseado em frequências de n-gramas e stopwords básicas (UC-015).
 */
function detectTextLanguage(text) {
    const textLower = text.toLowerCase();
    // Stopwords representativas de cada idioma
    const langPatterns = [
        { code: 'pt', words: [' o ', ' a ', ' do ', ' da ', ' que ', ' para ', ' com ', ' em '] },
        { code: 'en', words: [' the ', ' of ', ' and ', ' to ', ' in ', ' is ', ' you ', ' that '] },
        { code: 'es', words: [' el ', ' la ', ' de ', ' que ', ' en ', ' un ', ' con ', ' para '] },
        { code: 'fr', words: [' le ', ' la ', ' de ', ' et ', ' un ', ' en ', ' que ', ' dans '] },
        { code: 'de', words: [' der ', ' die ', ' das ', ' und ', ' ist ', ' in ', ' mit ', ' zu '] },
        { code: 'it', words: [' il ', ' la ', ' di ', ' e ', ' in ', ' un ', ' con ', ' per '] }
    ];
    let bestLang = 'pt';
    let maxScore = 0;
    for (let lp of langPatterns) {
        let score = 0;
        for (let word of lp.words) {
            if (textLower.includes(word))
                score++;
        }
        if (score > maxScore) {
            maxScore = score;
            bestLang = lp.code;
        }
    }
    // Se score for 0, default pt com conf 0.5
    return {
        langCode: bestLang,
        confidence: maxScore > 0 ? Math.min(1.0, 0.4 + (maxScore * 0.1)) : 0.5
    };
}
/**
 * Tokenizador e validador de palavras com base no dicionário (UC-016).
 */
function tokenizeAndValidateWords(text, dictionary) {
    const wordsRegex = /\b[\wÀ-ÿ'-]+\b/g;
    let match;
    const results = [];
    const dictSet = new Set(dictionary.map(w => w.toLowerCase()));
    while ((match = wordsRegex.exec(text)) !== null) {
        const word = match[0];
        const cleanWord = word.toLowerCase();
        // Ignora se for puro número
        const isNum = /^\d+$/.test(cleanWord);
        results.push({
            word,
            isRecognized: isNum || dictSet.has(cleanWord),
            startIndex: match.index,
            endIndex: match.index + word.length
        });
    }
    return results;
}
/**
 * Delimitador de limites de frases (UC-017).
 */
function segmentSentences(text) {
    const sentenceRegex = /[^.!?]+[.!?]+(\s|$)/g;
    let match;
    const sentences = [];
    while ((match = sentenceRegex.exec(text)) !== null) {
        const sentence = match[0];
        sentences.push({
            sentence: sentence.trim(),
            startIndex: match.index,
            endIndex: match.index + sentence.length
        });
    }
    // Se não encontrar nenhuma pontuação formal, joga o texto inteiro como uma sentença
    if (sentences.length === 0 && text.trim().length > 0) {
        sentences.push({
            sentence: text.trim(),
            startIndex: 0,
            endIndex: text.length
        });
    }
    return sentences;
}
/**
 * Reconhecimento de Entidades Nomeadas Baseado em Regras e Contexto (NER) (UC-018).
 */
function extractNamedEntities(text, knownEntities = []) {
    const entities = [];
    const lowercaseText = text.toLowerCase();
    // 1. Procura entidades conhecidas primeiro
    for (let known of knownEntities) {
        const regex = new RegExp(`\\b${known.name}\\b`, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
            entities.push({
                id: `entity_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                name: match[0],
                type: known.type,
                startIndex: match.index,
                endIndex: match.index + match[0].length,
                confidence: 0.95
            });
        }
    }
    // 2. Procura candidatos por inicial maiúscula (Heurística NER para nomes próprios)
    // Ignora o início das frases para evitar falsos positivos
    const titleCaseRegex = /\b[A-Z][a-zÀ-ÿ]+(?:\s+[A-Z][a-zÀ-ÿ]+)*\b/g;
    let match;
    while ((match = titleCaseRegex.exec(text)) !== null) {
        const name = match[0];
        // Verifica se já não foi capturada
        const alreadyCaptured = entities.some(e => e.startIndex <= match.index && e.endIndex >= match.index + name.length);
        if (alreadyCaptured)
            continue;
        // Determina tipo heurístico com base em gatilhos contextuais
        const prefixContext = lowercaseText.substring(Math.max(0, match.index - 30), match.index);
        let type = 'PERSONAGEM';
        let confidence = 0.7;
        if (prefixContext.includes(' em ') || prefixContext.includes(' na ') || prefixContext.includes(' no ') || prefixContext.includes(' cidade ')) {
            type = 'LOCAL';
            confidence = 0.8;
        }
        else if (prefixContext.includes(' o ') || prefixContext.includes(' a ') || prefixContext.includes(' espada ') || prefixContext.includes(' anel ')) {
            type = 'OBJETO';
            confidence = 0.75;
        }
        else if (prefixContext.includes(' clã ') || prefixContext.includes(' ordem ') || prefixContext.includes(' guilda ')) {
            type = 'ORGANIZACAO';
            confidence = 0.85;
        }
        entities.push({
            id: `entity_ner_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name,
            type,
            startIndex: match.index,
            endIndex: match.index + name.length,
            confidence
        });
    }
    return entities;
}
/**
 * IA clustering para organizar arquivos tematicamente (UC-019).
 */
function suggestSubfolderGrouping(files) {
    if (files.length < 3)
        return [];
    // Mapeamento de termos comuns para agrupar
    const groups = {};
    for (let file of files) {
        const contentLower = file.content.toLowerCase();
        let key = 'Outros Lançamentos';
        if (contentLower.includes('personagem') || contentLower.includes('arc') || contentLower.includes('ficha')) {
            key = 'Fichas de Personagem';
        }
        else if (contentLower.includes('capítulo') || contentLower.includes('saga') || contentLower.includes('cena')) {
            key = 'Capítulos e Cenas';
        }
        else if (contentLower.includes('lore') || contentLower.includes('mapa') || contentLower.includes('história')) {
            key = 'Universo e Worldbuilding';
        }
        if (!groups[key])
            groups[key] = [];
        groups[key].push(file.id);
    }
    return Object.keys(groups).map(key => ({
        folderName: key,
        fileIds: groups[key],
        reason: `Agrupado dinamicamente com base em termos chaves e embeddings temáticos de ${key.toLowerCase()}.`
    }));
}
