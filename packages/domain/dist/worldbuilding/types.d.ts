export type NarrativeRole = 'PROTAGONISTA' | 'ANTAGONISTA' | 'SECUNDARIO' | 'FIGURANTE';
export type FamilyKinship = 'PAI' | 'MAE' | 'FILHO' | 'CONJUGE' | 'IRMAO';
export type ReligiousDevotionIntensity = 'DEVOTO' | 'SEGUIDOR' | 'ATEU';
export interface ReligiousDevotion {
    religionId: string;
    intensity: ReligiousDevotionIntensity;
}
export interface CharacterSheet {
    id: string;
    projectId: string;
    name: string;
    role: NarrativeRole;
    birthDate?: string;
    age?: number;
    factionId?: string;
    religiousDevotions?: ReligiousDevotion[];
    biography?: string;
    avatarUrl?: string;
    /** Capítulos que contêm uma menção literal confirmada pelo autosave local. */
    mentionedInManuscriptIds?: string[];
    createdAt: string;
    updatedAt: string;
}
export interface FamilyRelation {
    id: string;
    projectId: string;
    personId: string;
    relatedPersonId: string;
    relationType: FamilyKinship;
}
export interface FactionSheet {
    id: string;
    projectId: string;
    name: string;
    coatOfArmsUrl?: string;
    /** SVG autocontido criado pelo compositor local de heráldica. */
    coatOfArmsSvg?: string;
    description: string;
    leaderId?: string;
    createdAt: string;
    updatedAt: string;
}
export interface LocationSheet {
    id: string;
    projectId: string;
    name: string;
    type: string;
    factionId?: string;
    ambientSoundUrl?: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreatureSheet {
    id: string;
    projectId: string;
    name: string;
    habitatLocationId?: string;
    abilities: string[];
    illustrationUrl?: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}
export interface ItemSheet {
    id: string;
    projectId: string;
    name: string;
    ownerCharacterId?: string;
    locationId?: string;
    properties: string[];
    illustrationUrl?: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}
export interface HistoricalEventSheet {
    id: string;
    projectId: string;
    name: string;
    date?: string;
    locationId?: string;
    participatingCharacterIds: string[];
    participatingFactionIds: string[];
    soundtrackUrl?: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}
export interface EntityRelationLink {
    id: string;
    projectId: string;
    sourceEntityId: string;
    targetEntityId: string;
    relationLabel: string;
}
