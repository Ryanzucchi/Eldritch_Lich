'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { GameMechanic, PlayableCharacterBalance, CombatSimulationResult, calculateCharacterStatsAtLevel, simulateCombat } from '@eldritch/domain';

export default function GameDesignPage() {
  const { activeProject } = useApp();
  const [mechanics, setMechanics] = useState<GameMechanic[]>([]);
  const [balances, setBalances] = useState<PlayableCharacterBalance[]>([]);
  const [activeTab, setActiveTab] = useState<'MECHANICS' | 'BALANCE' | 'SIMULATOR'>('MECHANICS');

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
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

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
            onClick={() => setActiveTab('BALANCE')}
            style={{ background: activeTab === 'BALANCE' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📊 Balanceamento (UC-335)
          </button>
          <button 
            onClick={() => setActiveTab('SIMULATOR')}
            style={{ background: activeTab === 'SIMULATOR' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ⚔️ Simulador de Combate (UC-337)
          </button>
        </div>
      </header>

      {/* Tab MECHANICS (UC-333) */}
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

      {/* Modal Add Balance (UC-335) */}
      {showBalanceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📊 Nova Classe / Personagem (UC-335)</h3>
            <form onSubmit={handleAddBalance} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome da Classe:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Guerreiro, Mago, Arqueiro"
                  value={charName}
                  onChange={e => setCharName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>HP Base:</label>
                  <input 
                    type="number"
                    value={baseHp}
                    onChange={e => setBaseHp(parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Crescimento HP/Nível:</label>
                  <input 
                    type="number"
                    value={hpGrowth}
                    onChange={e => setHpGrowth(parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Ataque Base:</label>
                  <input 
                    type="number"
                    value={baseAttack}
                    onChange={e => setBaseAttack(parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Crescimento Atq/Nível:</label>
                  <input 
                    type="number"
                    value={attackGrowth}
                    onChange={e => setAttackGrowth(parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowBalanceModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar Classe</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
