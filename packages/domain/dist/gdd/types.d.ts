export interface GameMechanic {
    id: string;
    projectId: string;
    name: string;
    type: 'COMBAT' | 'EXPLORATION' | 'PUZZLE' | 'PROGRESSION';
    coreLoopDescription: string;
    trigger: string;
    action: string;
    returnState: string;
    createdAt: string;
}
export interface PlayableCharacterBalance {
    id: string;
    projectId: string;
    characterName: string;
    baseHp: number;
    hpGrowthPerLevel: number;
    baseMana: number;
    manaGrowthPerLevel: number;
    baseAttack: number;
    attackGrowthPerLevel: number;
    baseDefense: number;
    defenseGrowthPerLevel: number;
    createdAt: string;
}
export interface CombatSimulationResult {
    attackerName: string;
    defenderName: string;
    level: number;
    damagePerHit: number;
    critChancePercent: number;
    winProbabilityPercent: number;
    averageRoundsToKill: number;
}
/**
 * Calcula os atributos de um personagem para um determinado nível (UC-335).
 */
export declare function calculateCharacterStatsAtLevel(char: PlayableCharacterBalance, level: number): {
    hp: number;
    mana: number;
    attack: number;
    defense: number;
};
/**
 * Executa simulação estocástica/matemática de combate entre dois personagens (UC-337).
 */
export declare function simulateCombat(attacker: PlayableCharacterBalance, defender: PlayableCharacterBalance, level?: number, rounds?: number): CombatSimulationResult;
