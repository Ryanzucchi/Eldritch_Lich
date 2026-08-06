import { CharacterSheet, FamilyRelation } from './types.js';
export interface AgeConsistencyIssue {
    characterId: string;
    characterName: string;
    issueType: 'INVALID_AGE' | 'PARENT_YOUNGER_THAN_CHILD' | 'FUTURE_BIRTH_DATE';
    description: string;
}
export interface DuplicateNameCandidate {
    primaryId: string;
    duplicateId: string;
    distance: number;
}
export declare function findNearDuplicateNames(entities: Array<{
    id: string;
    name: string;
}>, maximumDistance?: number): DuplicateNameCandidate[];
export declare function verifyCharacterAgeConsistency(characters: CharacterSheet[], familyRelations: FamilyRelation[], currentStoryYear?: number): AgeConsistencyIssue[];
