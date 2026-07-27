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

export interface GameRule {
  id: string;
  projectId: string;
  name: string; // UC-334
  category: 'COMBAT' | 'EXPLORATION' | 'ECONOMY' | 'GENERAL';
  formula: string; // Ex: "Ataque * 1.5 - Defesa"
  version: number; // UC-337 (Versionamento)
  reasonForChange?: string; // Motivo da alteração de versão (UC-337)
  createdAt: string;
}

export interface GameLevel {
  id: string;
  projectId: string;
  name: string; // UC-336
  objective: string;
  durationMinutes: number;
  enemies: string[];
  items: string[];
  mapLayoutUrl?: string; // Mapa visual/planta baixa (UC-336)
  createdAt: string;
}

export interface ShopItem {
  id: string;
  name: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  buyPrice: number; // Preço de Compra (UC-339)
  sellPrice: number; // Preço de Venda (UC-339)
  stockLimit: number;
}

export interface GameShop {
  id: string;
  projectId: string;
  shopName: string; // UC-339
  items: ShopItem[];
  createdAt: string;
}

/**
 * Valida a sintaxe matemática de uma fórmula de regra (UC-334).
 */
export function validateRuleFormula(formula: string): boolean {
  const cleaned = formula
    .replace(/[a-zA-ZáéíóúÁÉÍÓÚçÇ]+/g, '1')
    .replace(/\s+/g, '');
  
  if (/[^\d+\-*/()]/g.test(cleaned)) return false;
  
  try {
    const testEval = Function(`"use strict"; return (${cleaned})`);
    testEval();
    return true;
  } catch {
    return false;
  }
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

  for (let b = 0; b < rounds; b++) {
    let currentAttHp = attStats.hp;
    let currentDefHp = defStats.hp;
    let r = 0;

    while (currentAttHp > 0 && currentDefHp > 0 && r < 50) {
      r++;
      const isCrit = Math.random() * 100 < critChance;
      const dmg = isCrit ? rawDamage * 1.5 : rawDamage;
      currentDefHp -= dmg;

      if (currentDefHp <= 0) {
        attackerWins++;
        break;
      }

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

/**
 * Calcula estatísticas econômicas médias (UC-339).
 */
export function calculateEconomyStats(shops: GameShop[]) {
  const allItems = shops.flatMap(s => s.items);
  if (allItems.length === 0) return { averageBuyPrice: 0, averageSellPrice: 0, count: 0 };
  
  const totalBuy = allItems.reduce((acc, i) => acc + i.buyPrice, 0);
  const totalSell = allItems.reduce((acc, i) => acc + i.sellPrice, 0);
  
  return {
    averageBuyPrice: Math.round(totalBuy / allItems.length),
    averageSellPrice: Math.round(totalSell / allItems.length),
    count: allItems.length
  };
}
