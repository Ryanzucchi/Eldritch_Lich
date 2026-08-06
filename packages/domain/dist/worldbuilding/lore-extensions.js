"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFamilyRelationsFromText = extractFamilyRelationsFromText;
exports.suggestLoreConnections = suggestLoreConnections;
exports.generateLoreQuestions = generateLoreQuestions;
exports.translateTextToFictionalLanguage = translateTextToFictionalLanguage;
exports.generateFictionalName = generateFictionalName;
/** Extrai somente padrões factuais explícitos entre personagens previamente cadastrados. */
function extractFamilyRelationsFromText(text, characters) {
    const normalized = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const output = [];
    for (const subject of characters)
        for (const target of characters) {
            if (subject.id === target.id)
                continue;
            const esc = (name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const patterns = [
                [new RegExp(`${esc(subject.name)}\\s+(?:é|era|foi)\\s+(?:filho|filha)\\s+d[eo]\\s+${esc(target.name)}`, 'i'), 'FILHO'],
                [new RegExp(`${esc(subject.name)}\\s+(?:é|era|foi)\\s+(?:pai|mãe)\\s+d[eo]\\s+${esc(target.name)}`, 'i'), 'PAI'],
                [new RegExp(`${esc(subject.name)}\\s+(?:casou-se|casou)\\s+com\\s+${esc(target.name)}`, 'i'), 'CONJUGE']
            ];
            for (const [pattern, relationType] of patterns) {
                const match = normalized.match(pattern);
                if (match)
                    output.push({ personId: subject.id, relatedPersonId: target.id, relationType, excerpt: match[0] });
            }
        }
    return output;
}
const loreTerms = (value) => value.toLocaleLowerCase('pt-BR').match(/[\p{L}\p{N}]{3,}/gu) || [];
/** Similaridade cosseno TF-IDF local para sugerir vínculos sem transmitir fichas do universo. */
function suggestLoreConnections(entities, existingConnections, threshold = 0.8) {
    const docs = entities.map(entity => ({ ...entity, terms: loreTerms(entity.content) }));
    const df = new Map();
    docs.forEach(doc => new Set(doc.terms).forEach(term => df.set(term, (df.get(term) || 0) + 1)));
    const vectors = docs.map(doc => new Map(doc.terms.map(term => [term, Math.log((docs.length + 1) / ((df.get(term) || 0) + 1) + 1)])));
    const linked = new Set(existingConnections.flatMap(link => [`${link.sourceEntityId}:${link.targetEntityId}`, `${link.targetEntityId}:${link.sourceEntityId}`]));
    const output = [];
    for (let left = 0; left < docs.length; left++)
        for (let right = left + 1; right < docs.length; right++) {
            if (linked.has(`${docs[left].id}:${docs[right].id}`))
                continue;
            const sharedTerms = [...vectors[left].keys()].filter(term => vectors[right].has(term));
            const dot = sharedTerms.reduce((sum, term) => sum + (vectors[left].get(term) || 0) * (vectors[right].get(term) || 0), 0);
            const norm = (vector) => Math.sqrt([...vector.values()].reduce((sum, value) => sum + value * value, 0));
            const score = dot / Math.max(0.0001, norm(vectors[left]) * norm(vectors[right]));
            if (score >= threshold)
                output.push({ sourceId: docs[left].id, targetId: docs[right].id, score, sharedTerms: sharedTerms.slice(0, 5) });
        }
    return output.sort((left, right) => right.score - left.score);
}
/** Cria perguntas de continuidade a partir de lacunas explícitas em fichas locais. */
function generateLoreQuestions(entities) {
    return entities.flatMap(entity => {
        const questions = [];
        if (!entity.description?.trim())
            questions.push({ entityId: entity.id, question: `Que detalhe essencial define ${entity.name}?`, rationale: 'A ficha ainda não possui descrição.' });
        if (!entity.linked)
            questions.push({ entityId: entity.id, question: `Como ${entity.name} se conecta aos demais elementos do universo?`, rationale: 'Nenhuma relação explícita foi cadastrada.' });
        if (entity.kind === 'personagem')
            questions.push({ entityId: entity.id, question: `Qual decisão de ${entity.name} pode alterar o rumo da trama?`, rationale: 'Pergunta dramática para aprofundar agência.' });
        if (entity.kind === 'local')
            questions.push({ entityId: entity.id, question: `Que acontecimento transformou ${entity.name} no cenário atual?`, rationale: 'Pergunta de história e causalidade do local.' });
        return questions;
    }).slice(0, 20);
}
function translateTextToFictionalLanguage(text, language) {
    if (!text || !language.dictionary)
        return text;
    let translated = text;
    for (const [orig, trans] of Object.entries(language.dictionary)) {
        const regex = new RegExp(`\\b${orig}\\b`, 'gi');
        translated = translated.replace(regex, trans);
    }
    return translated;
}
function generateFictionalName(language) {
    const prefixes = language.namePrefixes && language.namePrefixes.length > 0
        ? language.namePrefixes
        : ['El', 'Val', 'Kor', 'Aet', 'Sil', 'Dra'];
    const suffixes = language.nameSuffixes && language.nameSuffixes.length > 0
        ? language.nameSuffixes
        : ['th', 'dor', 'mir', 'is', 'a', 'on'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    return p + s;
}
