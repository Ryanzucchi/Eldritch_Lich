import { CharacterSheet, FamilyRelation } from './types.js';

export interface AgeConsistencyIssue {
  characterId: string;
  characterName: string;
  issueType: 'INVALID_AGE' | 'PARENT_YOUNGER_THAN_CHILD' | 'FUTURE_BIRTH_DATE';
  description: string;
}

export interface DuplicateNameCandidate { primaryId: string; duplicateId: string; distance: number; }

export function findNearDuplicateNames(entities: Array<{ id: string; name: string }>, maximumDistance = 1): DuplicateNameCandidate[] {
  const distance = (left: string, right: string) => {
    const a = left.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); const b = right.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const row = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i++) { let previous = row[0]; row[0] = i; for (let j = 1; j <= b.length; j++) { const old = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1)); previous = old; } }
    return row[b.length];
  };
  const output: DuplicateNameCandidate[] = [];
  for (let left = 0; left < entities.length; left++) for (let right = left + 1; right < entities.length; right++) { const value = distance(entities[left].name, entities[right].name); if (value <= maximumDistance) output.push({ primaryId: entities[left].id, duplicateId: entities[right].id, distance: value }); }
  return output;
}

export function verifyCharacterAgeConsistency(
  characters: CharacterSheet[],
  familyRelations: FamilyRelation[],
  currentStoryYear: number = new Date().getFullYear()
): AgeConsistencyIssue[] {
  const issues: AgeConsistencyIssue[] = [];
  const charMap = new Map<string, CharacterSheet>(characters.map(c => [c.id, c]));

  for (const char of characters) {
    if (char.age !== undefined && char.age < 0) {
      issues.push({
        characterId: char.id,
        characterName: char.name,
        issueType: 'INVALID_AGE',
        description: `Personagem ${char.name} possui idade negativa (${char.age}).`
      });
    }

    if (char.birthDate) {
      const birthYear = parseInt(char.birthDate.substring(0, 4), 10);
      if (!isNaN(birthYear) && birthYear > currentStoryYear) {
        issues.push({
          characterId: char.id,
          characterName: char.name,
          issueType: 'FUTURE_BIRTH_DATE',
          description: `Personagem ${char.name} possui data de nascimento no futuro (${char.birthDate}).`
        });
      }
    }
  }

  for (const rel of familyRelations) {
    if (rel.relationType === 'PAI' || rel.relationType === 'MAE') {
      const parent = charMap.get(rel.personId);
      const child = charMap.get(rel.relatedPersonId);

      if (parent && child && parent.age !== undefined && child.age !== undefined) {
        if (parent.age <= child.age) {
          issues.push({
            characterId: parent.id,
            characterName: parent.name,
            issueType: 'PARENT_YOUNGER_THAN_CHILD',
            description: `Inconsistência parental: ${parent.name} (idade: ${parent.age}) é registrado como ${rel.relationType.toLowerCase()} de ${child.name} (idade: ${child.age}).`
          });
        }
      }
    }
  }

  return issues;
}
