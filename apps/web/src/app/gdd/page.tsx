'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { GameMechanic, PlayableCharacterBalance, CombatSimulationResult, GameRule, GameLevel, GameShop, calculateCharacterStatsAtLevel, simulateCombat, validateRuleFormula, calculateEconomyStats } from '@eldritch/domain';

export default function GameDesignPage() {
  const { activeProject } = useApp();
  const [mechanics, setMechanics] = useState<GameMechanic[]>([]);
  const [balances, setBalances] = useState<PlayableCharacterBalance[]>([]);
  const [rules, setRules] = useState<GameRule[]>([]);
  const [levels, setLevels] = useState<GameLevel[]>([]);
  const [shops, setShops] = useState<GameShop[]>([]);
  const [activeTab, setActiveTab] = useState<'MECHANICS' | 'BALANCE' | 'RULES' | 'LEVELS' | 'ECONOMY' | 'SIMULATOR'>('MECHANICS');

  // Economy Form State (UC-339)
  const [showShopModal, setShowShopModal] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopItemName, setShopItemName] = useState('');
  const [shopItemRarity, setShopItemRarity] = useState<'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'>('COMMON');
  const [shopItemBuy, setShopItemBuy] = useState(100);
  const [shopItemSell, setShopItemSell] = useState(50);
  const [shopItemStock, setShopItemStock] = useState(10);
  const [shopItemsList, setShopItemsList] = useState<GameShop['items']>([]);

  // Rules Form State (UC-334, UC-337-regras)
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [ruleCategory, setRuleCategory] = useState<GameRule['category']>('COMBAT');
  const [ruleFormula, setRuleFormula] = useState('');
  const [reasonForChange, setReasonForChange] = useState('');
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // Levels Form State (UC-336)
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [levelName, setLevelName] = useState('');
  const [levelObjective, setLevelObjective] = useState('');
  const [levelDuration, setLevelDuration] = useState(30);
  const [levelEnemies, setLevelEnemies] = useState('');
  const [levelItems, setLevelItems] = useState('');

  // Mechanic Form State (UC-333)
  const [showMechanicModal, setShowMechanicModal] = useState(false);
  const [mechName, setMechName] = useState('');
  const [mechType, setMechType] = useState<GameMechanic['type']>('COMBAT');
  const [coreLoop, setCoreLoop] = useState('');
  const [trigger, setTrigger] = useState('');
  const [action, setAction] = useState('');

  // Balance Form State (UC-335)
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [charName, setCharName] = useState('');
  const [baseHp, setBaseHp] = useState(100);
  const [hpGrowth, setHpGrowth] = useState(15);
  const [baseAttack, setBaseAttack] = useState(25);
  const [attackGrowth, setAttackGrowth] = useState(4);
  const [baseDefense, setBaseDefense] = useState(10);

  // Simulator State (UC-337)
  const [attCharId, setAttCharId] = useState('');
  const [defCharId, setDefCharId] = useState('');
  const [simLevel, setSimLevel] = useState(10);
  const [simResult, setSimResult] = useState<CombatSimulationResult | null>(null);

  const loadData = async () => {
    if (!activeProject) return;
    const mechs = await db.gameMechanics.where('projectId').equals(activeProject.id).toArray();
    setMechanics(mechs);

    const bals = await db.playableCharacterBalances.where('projectId').equals(activeProject.id).toArray();
    setBalances(bals);

    const rls = await db.gameRules.where('projectId').equals(activeProject.id).toArray();
    setRules(rls);

    const lvls = await db.gameLevels.where('projectId').equals(activeProject.id).toArray();
    setLevels(lvls);

    const shps = await db.gameShops.where('projectId').equals(activeProject.id).toArray();
    setShops(shps);
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  // Create Shop (UC-339)
  const handleAddShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim() || shopItemsList.length === 0 || !activeProject) return;

    // Alerta se preço de venda > compra (UC-339)
    const hasArbitrageLoop = shopItemsList.some(i => i.sellPrice > i.buyPrice);
    if (hasArbitrageLoop) {
      alert('⚠️ Alerta de Segurança: Um ou mais itens possuem preço de venda superior ao preço de compra. Isso criará um loop infinito de moedas!');
    }

    const newShop: GameShop = {
      id: `gs_${Date.now()}`,
      projectId: activeProject.id,
      shopName: shopName.trim(),
      items: shopItemsList,
      createdAt: new Date().toISOString()
    };

    await db.gameShops.put(newShop);
    setShowShopModal(false);
    setShopName('');
    setShopItemsList([]);
    await loadData();
  };

  const handleAddTempItem = () => {
    if (!shopItemName.trim()) return;
    
    // Alerta preco de venda maior que compra (UC-339)
    if (shopItemSell > shopItemBuy) {
      alert('⚠️ Alerta de Segurança Econômica: O preço de venda de um item não deve ser maior que o preço de compra para evitar exploração de ouro infinito.');
    }

    const newItem = {
      id: `item_${Date.now()}`,
      name: shopItemName.trim(),
      rarity: shopItemRarity,
      buyPrice: shopItemBuy,
      sellPrice: shopItemSell,
      stockLimit: shopItemStock
    };

    setShopItemsList([...shopItemsList, newItem]);
    setShopItemName('');
  };

  // Create/Update Rule (UC-334, UC-337-versionar)
  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim() || !ruleFormula.trim() || !activeProject) return;

    if (!validateRuleFormula(ruleFormula)) {
      alert('Erro: Sintaxe matemática de fórmula inválida (UC-334). Utilize apenas operadores aritméticos básicos e variáveis textuais.');
      return;
    }

    if (editingRuleId) {
      // Versionar regra (UC-337-versionar)
      const existing = rules.find(r => r.id === editingRuleId);
      if (existing) {
        const updatedRule: GameRule = {
          ...existing,
          name: ruleName.trim(),
          formula: ruleFormula.trim(),
          version: existing.version + 1,
          reasonForChange: reasonForChange.trim() || 'Ajuste de balanceamento',
          createdAt: new Date().toISOString()
        };
        await db.gameRules.put(updatedRule);
      }
    } else {
      const newRule: GameRule = {
        id: `gr_${Date.now()}`,
        projectId: activeProject.id,
        name: ruleName.trim(),
        category: ruleCategory,
        formula: ruleFormula.trim(),
        version: 1,
        createdAt: new Date().toISOString()
      };
      await db.gameRules.put(newRule);
    }

    setShowRuleModal(false);
    setRuleName('');
    setRuleFormula('');
    setReasonForChange('');
    setEditingRuleId(null);
    await loadData();
  };

  // Create Level (UC-336)
  const handleAddLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!levelName.trim() || !activeProject) return;

    const newLevel: GameLevel = {
      id: `gl_${Date.now()}`,
      projectId: activeProject.id,
      name: levelName.trim(),
      objective: levelObjective.trim(),
      durationMinutes: levelDuration,
      enemies: levelEnemies.split(',').map(item => item.trim()).filter(Boolean),
      items: levelItems.split(',').map(item => item.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    };

    await db.gameLevels.put(newLevel);
    setShowLevelModal(false);
    setLevelName('');
    setLevelObjective('');
    setLevelEnemies('');
    setLevelItems('');
    await loadData();
  };

  // Create Mechanic (UC-333)
  const handleAddMechanic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mechName.trim() || !activeProject) return;

    const newMech: GameMechanic = {
      id: `gm_${Date.now()}`,
      projectId: activeProject.id,
      name: mechName.trim(),
      type: mechType,
      coreLoopDescription: coreLoop.trim(),
      trigger: trigger.trim(),
      action: action.trim(),
      returnState: 'ESTADO_ATUALIZADO',
      createdAt: new Date().toISOString()
    };

    await db.gameMechanics.put(newMech);
    setShowMechanicModal(false);
    setMechName('');
    setCoreLoop('');
    setTrigger('');
    setAction('');
    await loadData();
  };

  // Create/Update Balance (UC-335)
  const handleAddBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!charName.trim() || !activeProject) return;

    const newBal: PlayableCharacterBalance = {
      id: `pcb_${Date.now()}`,
      projectId: activeProject.id,
      characterName: charName.trim(),
      baseHp,
      hpGrowthPerLevel: hpGrowth,
      baseMana: 50,
      manaGrowthPerLevel: 5,
      baseAttack,
      attackGrowthPerLevel: attackGrowth,
      baseDefense,
      defenseGrowthPerLevel: 2,
      createdAt: new Date().toISOString()
    };

    await db.playableCharacterBalances.put(newBal);
    setShowBalanceModal(false);
    setCharName('');
    await loadData();
  };

  // Run Combat Simulation (UC-337)
  const handleRunSimulation = () => {
    const att = balances.find(b => b.id === attCharId);
    const def = balances.find(b => b.id === defCharId);

    if (!att || !def) {
      alert('Selecione o Atacante e o Defensor para simular o combate.');
      return;
    }

    const res = simulateCombat(att, def, simLevel, 100);
    setSimResult(res);
  };

  return (
    <div className="game-design-page-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎮 Game Design Document (GDD) & Engine de Balanceamento (UC-333, UC-335, UC-337)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Documentação de mecânicas de jogo, tabelas de evolução de estatísticas e simulador de combates Monte Carlo.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => setActiveTab('MECHANICS')}
            style={{ background: activeTab === 'MECHANICS' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ⚙️ Mecânicas (UC-333)
          </button>
          <button 
            onClick={() => setActiveTab('RULES')}
            style={{ background: activeTab === 'RULES' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📜 Regras (UC-334)
          </button>
          <button 
            onClick={() => setActiveTab('LEVELS')}
            style={{ background: activeTab === 'LEVELS' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            🗺️ Níveis (UC-336)
          </button>
          <button 
            onClick={() => setActiveTab('ECONOMY')}
            style={{ background: activeTab === 'ECONOMY' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            🪙 Economia (UC-339)
          </button>
          <button 
            onClick={() => setActiveTab('BALANCE')}
            style={{ background: activeTab === 'BALANCE' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📊 Balanceamento (UC-335)
          </button>
          <button 
            onClick={() => setActiveTab('SIMULATOR')}
            style={{ background: activeTab === 'SIMULATOR' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ⚔️ Simulador (UC-337)
          </button>
        </div>
      </header>

      {/* Tab RULES (UC-334, UC-337-versionar) */}
      {activeTab === 'RULES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>📜 Sistema de Regras & Fórmulas (UC-334)</h2>
            <button 
              onClick={() => {
                setEditingRuleId(null);
                setRuleName('');
                setRuleFormula('');
                setShowRuleModal(true);
              }}
              style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              ➕ Nova Regra / Fórmula
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
            {rules.map(r => (
              <div key={r.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                      {r.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>v{r.version} (UC-337)</span>
                  </div>
                  <h3 style={{ margin: '0.5rem 0 0.5rem 0', fontSize: '1.15rem' }}>{r.name}</h3>
                  <code style={{ display: 'block', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem', color: '#10b981', fontFamily: 'monospace', marginBottom: '0.8rem' }}>
                    {r.formula}
                  </code>
                  {r.reasonForChange && (
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', opacity: 0.6, fontStyle: 'italic' }}>
                      💬 Motivo: {r.reasonForChange}
                    </p>
                  )}
                </div>

                <button 
                  onClick={() => {
                    setEditingRuleId(r.id);
                    setRuleName(r.name);
                    setRuleFormula(r.formula);
                    setShowRuleModal(true);
                  }}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', width: '100%' }}
                >
                  ⚙️ Versionar Fórmula (UC-337)
                </button>
              </div>
            ))}

            {rules.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5, padding: '4rem 0' }}>
                Nenhuma regra ou fórmula cadastrada no sistema.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab LEVELS (UC-336) */}
      {activeTab === 'LEVELS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>🗺️ Design de Níveis & Fases (UC-336)</h2>
            <button 
              onClick={() => setShowLevelModal(true)}
              style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              ➕ Criar Nova Fase
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
            {levels.map(lvl => (
              <div key={lvl.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '1.2rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#60a5fa' }}>{lvl.name}</h3>
                <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.88rem', opacity: 0.8 }}><strong>Objetivo:</strong> {lvl.objective}</p>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.6rem' }}>⏱️ Duração Estimada: {lvl.durationMinutes} min</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.6rem' }}>
                  <div style={{ fontSize: '0.8rem' }}>
                    <strong>👾 Inimigos:</strong> {lvl.enemies.join(', ') || 'Nenhum'}
                  </div>
                  <div style={{ fontSize: '0.8rem' }}>
                    <strong>💎 Recompensas:</strong> {lvl.items.join(', ') || 'Nenhum'}
                  </div>
                </div>
              </div>
            ))}

            {levels.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5, padding: '4rem 0' }}>
                Nenhuma fase de level design documentada.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab ECONOMY (UC-339) */}
      {activeTab === 'ECONOMY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>🪙 Economia, Lojas & Tabelas de Trocas (UC-339)</h2>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', opacity: 0.6 }}>
                Preços médios calculados de todos os itens:
                {(() => {
                  const stats = calculateEconomyStats(shops);
                  return ` Compra Média: ${stats.averageBuyPrice}g | Venda Média: ${stats.averageSellPrice}g | Total de Itens: ${stats.count}`;
                })()}
              </p>
            </div>
            <button 
              onClick={() => setShowShopModal(true)}
              style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              ➕ Nova Tabela de Loja
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
            {shops.map(s => (
              <div key={s.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '1.2rem' }}>
                <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.2rem', color: '#f59e0b' }}>🏪 {s.shopName}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {s.items.map((item, idx) => (
                    <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <div>
                        <strong>{item.name}</strong> 
                        <span style={{ fontSize: '0.7rem', marginLeft: '0.4rem', opacity: 0.5 }}>({item.rarity})</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                        <span>📥 {item.buyPrice}g</span>
                        <span>📤 {item.sellPrice}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {shops.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5, padding: '4rem 0' }}>
                Nenhuma loja ou tabela de trocas documentada.
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'MECHANICS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Mecânicas de Jogo Catalogadas ({mechanics.length})</h2>
            <button 
              onClick={() => setShowMechanicModal(true)}
              style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              ➕ Nova Mecânica (UC-333)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
            {mechanics.map(m => (
              <div key={m.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '1.2rem' }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                  {m.type}
                </span>
                <h3 style={{ margin: '0.4rem 0 0.5rem 0', fontSize: '1.2rem' }}>{m.name}</h3>
                <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.9rem', opacity: 0.8 }}>{m.coreLoopDescription}</p>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div><strong>⚡ Gatilho:</strong> {m.trigger}</div>
                  <div><strong>🎮 Ação:</strong> {m.action}</div>
                </div>
              </div>
            ))}

            {mechanics.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5, padding: '4rem 0' }}>
                Nenhuma mecânica cadastrada no GDD.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab BALANCE (UC-335) */}
      {activeTab === 'BALANCE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Curvas de Evolução de Atributos (UC-335)</h2>
            <button 
              onClick={() => setShowBalanceModal(true)}
              style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              ➕ Cadastrar Classe / Personagem
            </button>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '0.8rem 1rem' }}>Classe / Personagem</th>
                  <th style={{ padding: '0.8rem 1rem' }}>HP Base (+Crescimento/Nível)</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Ataque Base (+Crescimento)</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Defesa Base</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Stats no Nível 50</th>
                </tr>
              </thead>
              <tbody>
                {balances.map(b => {
                  const lvl50 = calculateCharacterStatsAtLevel(b, 50);
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 700, color: '#60a5fa' }}>{b.characterName}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>{b.baseHp} (+{b.hpGrowthPerLevel}/lvl)</td>
                      <td style={{ padding: '0.8rem 1rem' }}>{b.baseAttack} (+{b.attackGrowthPerLevel}/lvl)</td>
                      <td style={{ padding: '0.8rem 1rem' }}>{b.baseDefense}</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#10b981', fontWeight: 700 }}>
                        HP: {lvl50.hp} | ATK: {lvl50.attack} | DEF: {lvl50.defense}
                      </td>
                    </tr>
                  );
                })}

                {balances.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', opacity: 0.5, padding: '3rem 0' }}>
                      Nenhuma classe de personagem cadastrada para balanceamento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab SIMULATOR (UC-337) */}
      {activeTab === 'SIMULATOR' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.8rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>⚔️ Simulador de Combates Monte Carlo (100 Batalhas - UC-337)</h2>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Simule o duelo isolado entre classes para testar o equilíbrio e probabilidade de vitória.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1.2rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Atacante:</label>
                <select 
                  value={attCharId}
                  onChange={e => setAttCharId(e.target.value)}
                  style={{ width: '100%', padding: '0.58rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="">Selecione a classe...</option>
                  {balances.map(b => (
                    <option key={b.id} value={b.id}>{b.characterName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Defensor:</label>
                <select 
                  value={defCharId}
                  onChange={e => setDefCharId(e.target.value)}
                  style={{ width: '100%', padding: '0.58rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="">Selecione a classe...</option>
                  {balances.map(b => (
                    <option key={b.id} value={b.id}>{b.characterName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nível do Combate (1 a 50):</label>
                <input 
                  type="number"
                  value={simLevel}
                  onChange={e => setSimLevel(parseInt(e.target.value) || 1)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <button 
                onClick={handleRunSimulation}
                style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
              >
                ⚡ Executar Simulação
              </button>
            </div>
          </div>

          {/* Simulation Output Card */}
          {simResult && (
            <div style={{ background: '#0f172a', border: '1px solid #3b82f6', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#60a5fa' }}>
                📊 Relatório de Simulação de Combate: {simResult.attackerName} vs {simResult.defenderName} (Nível {simResult.level})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Dano Real por Golpe:</span>
                  <h4 style={{ margin: '0.3rem 0 0 0', fontSize: '1.5rem', color: '#ef4444' }}>{simResult.damagePerHit} HP</h4>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Chance de Acerto Crítico:</span>
                  <h4 style={{ margin: '0.3rem 0 0 0', fontSize: '1.5rem', color: '#f59e0b' }}>{simResult.critChancePercent}%</h4>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Taxa de Vitória do Atacante:</span>
                  <h4 style={{ margin: '0.3rem 0 0 0', fontSize: '1.5rem', color: '#10b981' }}>{simResult.winProbabilityPercent}%</h4>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Turnos Médios p/ Derrota:</span>
                  <h4 style={{ margin: '0.3rem 0 0 0', fontSize: '1.5rem', color: '#60a5fa' }}>{simResult.averageRoundsToKill} Rodadas</h4>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Add Mechanic (UC-333) */}
      {showMechanicModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>⚙️ Nova Mecânica de Jogo (UC-333)</h3>
            <form onSubmit={handleAddMechanic} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome da Mecânica:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Esquiva Perfeita (Parry)"
                  value={mechName}
                  onChange={e => setMechName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Core Loop / Descrição:</label>
                <textarea 
                  rows={3}
                  placeholder="Descrição do ciclo de ação do jogador..."
                  value={coreLoop}
                  onChange={e => setCoreLoop(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Gatilho de Entrada:</label>
                  <input 
                    type="text"
                    placeholder="Ex: Pressionar Espaço 100ms antes do golpe"
                    value={trigger}
                    onChange={e => setTrigger(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Tipo:</label>
                  <select 
                    value={mechType}
                    onChange={e => setMechType(e.target.value as any)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    <option value="COMBAT">Combate</option>
                    <option value="EXPLORATION">Exploração</option>
                    <option value="PUZZLE">Puzzle</option>
                    <option value="PROGRESSION">Progressão</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowMechanicModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar Mecânica</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Rule (UC-334, UC-337-regras) */}
      {showRuleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📜 {editingRuleId ? 'Ajustar & Versionar Regra (UC-337)' : 'Criar Nova Regra (UC-334)'}</h3>
            <form onSubmit={handleAddRule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome da Regra / Fórmula:</label>
                <input 
                  type="text"
                  required
                  disabled={!!editingRuleId}
                  placeholder="Ex: Dano de Fogo"
                  value={ruleName}
                  onChange={e => setRuleName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', opacity: editingRuleId ? 0.6 : 1 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Fórmula Matemática (Sintaxe UC-334):</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Ataque * 1.5 - Defesa"
                  value={ruleFormula}
                  onChange={e => setRuleFormula(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              {editingRuleId && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Motivo do Ajuste (Versionamento - UC-337):</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Reduzido multiplicador para evitar OP"
                    value={reasonForChange}
                    onChange={e => setReasonForChange(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
              )}

              {!editingRuleId && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Categoria:</label>
                  <select 
                    value={ruleCategory}
                    onChange={e => setRuleCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    <option value="COMBAT">Combate</option>
                    <option value="EXPLORATION">Exploração</option>
                    <option value="ECONOMY">Economia</option>
                    <option value="GENERAL">Geral</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowRuleModal(false);
                    setEditingRuleId(null);
                  }} 
                  style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  {editingRuleId ? 'Salvar Ajuste v' + (rules.find(r => r.id === editingRuleId)?.version || 1) : 'Salvar Regra'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Level (UC-336) */}
      {showLevelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🗺️ Documentar Nível / Fase (UC-336)</h3>
            <form onSubmit={handleAddLevel} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome da Fase:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Masmorra das Almas, Fase 1"
                  value={levelName}
                  onChange={e => setLevelName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Objetivo Principal:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Encontrar a chave de cristal e derrotar o boss"
                  value={levelObjective}
                  onChange={e => setLevelObjective(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Duração (minutos):</label>
                  <input 
                    type="number"
                    value={levelDuration}
                    onChange={e => setLevelDuration(parseInt(e.target.value) || 30)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Inimigos Presentes (separados por vírgula):</label>
                <input 
                  type="text"
                  placeholder="Ex: Esqueleto, Zumbi, Golem"
                  value={levelEnemies}
                  onChange={e => setLevelEnemies(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Itens / Recompensas (separados por vírgula):</label>
                <input 
                  type="text"
                  placeholder="Ex: Poção de HP, Espada Antiga"
                  value={levelItems}
                  onChange={e => setLevelItems(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowLevelModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar Nível</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Shop (UC-339) */}
      {showShopModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🏪 Nova Loja / Tabela de Trocas (UC-339)</h3>
            <form onSubmit={handleAddShop} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome do Estabelecimento:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Taverna do Javali Saltitante"
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              {/* Temp Item Add Section */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Adicionar Item à Loja</span>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <input 
                    type="text"
                    placeholder="Nome do Item"
                    value={shopItemName}
                    onChange={e => setShopItemName(e.target.value)}
                    style={{ padding: '0.4rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem' }}
                  />
                  <select
                    value={shopItemRarity}
                    onChange={e => setShopItemRarity(e.target.value as any)}
                    style={{ padding: '0.4rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem' }}
                  >
                    <option value="COMMON">Comum</option>
                    <option value="UNCOMMON">Incomum</option>
                    <option value="RARE">Raro</option>
                    <option value="EPIC">Épico</option>
                    <option value="LEGENDARY">Lendário</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', opacity: 0.6 }}>Preço Compra (g):</label>
                    <input 
                      type="number"
                      value={shopItemBuy}
                      onChange={e => setShopItemBuy(parseInt(e.target.value) || 0)}
                      style={{ width: '100%', padding: '0.3rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', opacity: 0.6 }}>Preço Venda (g):</label>
                    <input 
                      type="number"
                      value={shopItemSell}
                      onChange={e => setShopItemSell(parseInt(e.target.value) || 0)}
                      style={{ width: '100%', padding: '0.3rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', opacity: 0.6 }}>Estoque Máx:</label>
                    <input 
                      type="number"
                      value={shopItemStock}
                      onChange={e => setShopItemStock(parseInt(e.target.value) || 0)}
                      style={{ width: '100%', padding: '0.3rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleAddTempItem}
                  style={{ width: '100%', background: '#3b82f6', border: 'none', color: 'white', padding: '0.4rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Confirmar Item
                </button>
              </div>

              {/* Items List Preview */}
              {shopItemsList.length > 0 && (
                <div style={{ maxHeight: '100px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.72rem', opacity: 0.6, display: 'block', marginBottom: '0.3rem' }}>Itens adicionados ({shopItemsList.length}):</span>
                  {shopItemsList.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
                      <span>• {item.name}</span>
                      <span>Compra: {item.buyPrice}g | Venda: {item.sellPrice}g</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowShopModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar Estabelecimento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
