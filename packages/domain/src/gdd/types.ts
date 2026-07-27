export interface GameMechanic {
  id: string;
  projectId: string;
  name: string; // UC-333
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
  characterName: string; // e.g. "Guerreiro", "Mago" (UC-335)
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
  winProbabilityPercent: number; // UC-337 (Auto-battle Monte Carlo)
  averageRoundsToKill: number;
}

/**
 * Calcula os atributos de um personagem para um determinado nível (UC-335).
 */
export function calculateCharacterStatsAtLevel(char: PlayableCharacterBalance, level: number) {
  const lvlOffset = Math.max(1, level) - 1;
  return {
    hp: Math.round(char.baseHp + char.hpGrowthPerLevel * lvlOffset),
    mana: Math.round(char.baseMana + char.manaGrowthPerLevel * lvlOffset),
    attack: Math.round(char.baseAttack + char.attackGrowthPerLevel * lvlOffset),
    defense: Math.round(char.baseDefense + char.defenseGrowthPerLevel * lvlOffset),
  };
}

/**
 * Executa simulação estocástica/matemática de combate entre dois personagens (UC-337).
 */
export function simulateCombat(
  attacker: PlayableCharacterBalance,
  defender: PlayableCharacterBalance,
  level: number = 10,
  rounds: number = 100
): CombatSimulationResult {
  const attStats = calculateCharacterStatsAtLevel(attacker, level);
  const defStats = calculateCharacterStatsAtLevel(defender, level);

  const rawDamage = Math.max(1, attStats.attack - defStats.defense * 0.5);
  const critChance = Math.min(50, Math.round(attStats.attack * 0.2));

  let attackerWins = 0;
  let totalRoundsSum = 0;

  // Simulação Monte Carlo de 100 batalhas
  for (let b = 0; b < rounds; b++) {
    let currentAttHp = attStats.hp;
    let currentDefHp = defStats.hp;
    let r = 0;

    while (currentAttHp > 0 && currentDefHp > 0 && r < 50) {
      r++;
      // Atacante bate
      const isCrit = Math.random() * 100 < critChance;
      const dmg = isCrit ? rawDamage * 1.5 : rawDamage;
      currentDefHp -= dmg;

      if (currentDefHp <= 0) {
        attackerWins++;
        break;
      }

      // Defensor contra-ataca
      const defRawDmg = Math.max(1, defStats.attack - attStats.defense * 0.5);
      currentAttHp -= defRawDmg;
    }
    totalRoundsSum += r;
  }

  return {
    attackerName: attacker.characterName,
    defenderName: defender.characterName,
    level,
    damagePerHit: Math.round(rawDamage),
    critChancePercent: critChance,
    winProbabilityPercent: Math.round((attackerWins / rounds) * 100),
    averageRoundsToKill: Math.round((totalRoundsSum / rounds) * 10) / 10
  };
}
