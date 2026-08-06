import { FamilyKinship } from './types.js';
export interface FactionWarOrTreaty {
    id: string;
    projectId: string;
    type: 'GUERRA' | 'TRATADO_PAZ' | 'ALIANCA';
    title: string;
    factionIds: string[];
    eventId?: string;
    startDate?: string;
    endDate?: string;
    description: string;
}
export interface FictionalLanguage {
    id: string;
    projectId: string;
    name: string;
    family?: string;
    dictionary: Record<string, string>;
    phonemes?: string[];
    namePrefixes?: string[];
    nameSuffixes?: string[];
}
export interface TechOrMagicNode {
    id: string;
    projectId: string;
    name: string;
    category: 'MAGIA' | 'TECNOLOGIA';
    prerequisiteIds: string[];
    /** Pessoas que dominam, usam ou são diretamente afetadas por este elemento. */
    masterCharacterIds?: string[];
    /** Facções que detêm, usam ou regulam este elemento. */
    factionIds?: string[];
    description: string;
}
export interface ReligionSheet {
    id: string;
    projectId: string;
    name: string;
    pantheonDeities: string[];
    sacredLocationIds: string[];
    believerCharacterIds: string[];
    dogmaDescription: string;
}
export interface LoreConnectionCandidate {
    sourceId: string;
    targetId: string;
    score: number;
    sharedTerms: string[];
}
export interface LoreQuestionCandidate {
    entityId: string;
    question: string;
    rationale: string;
}
export interface FamilyRelationCandidate {
    personId: string;
    relatedPersonId: string;
    relationType: FamilyKinship;
    excerpt: string;
}
/** Extrai somente padrões factuais explícitos entre personagens previamente cadastrados. */
export declare function extractFamilyRelationsFromText(text: string, characters: Array<{
    id: string;
    name: string;
}>): FamilyRelationCandidate[];
/** Similaridade cosseno TF-IDF local para sugerir vínculos sem transmitir fichas do universo. */
export declare function suggestLoreConnections(entities: Array<{
    id: string;
    content: string;
}>, existingConnections: Array<{
    sourceEntityId: string;
    targetEntityId: string;
}>, threshold?: number): LoreConnectionCandidate[];
/** Cria perguntas de continuidade a partir de lacunas explícitas em fichas locais. */
export declare function generateLoreQuestions(entities: Array<{
    id: string;
    name: string;
    kind: 'personagem' | 'facção' | 'local' | 'item';
    description?: string;
    linked?: boolean;
}>): LoreQuestionCandidate[];
export declare function translateTextToFictionalLanguage(text: string, language: FictionalLanguage): string;
export declare function generateFictionalName(language: FictionalLanguage): string;
