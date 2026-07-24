'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { SandboxEnvironment, SandboxChange, compareSandboxWithCanonical } from '@eldritch/domain';

export default function SandboxPage() {
  const { activeProject } = useApp();
  const [sandboxes, setSandboxes] = useState<SandboxEnvironment[]>([]);
  const [activeSandbox, setActiveSandbox] = useState<SandboxEnvironment | null>(null);
  const [changes, setChanges] = useState<SandboxChange[]>([]);

  // Create Modal (UC-403)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSandboxName, setNewSandboxName] = useState('');

  // Add Change State (UC-404)
  const [changeEntity, setChangeEntity] = useState('');
  const [changeOriginal, setChangeOriginal] = useState('');
  const [changeHypothetical, setChangeHypothetical] = useState('');

  const [success, setSuccess] = useState<string | null>(null);

  // Load Sandboxes
  const loadSandboxes = async () => {
    if (!activeProject) return;
    const list = await db.sandboxes.where('projectId').equals(activeProject.id).toArray();
    setSandboxes(list);
    if (list.length > 0 && !activeSandbox) {
      setActiveSandbox(list[0]);
    }
  };

  // Load Changes
  const loadChanges = async () => {
    if (!activeSandbox) {
      setChanges([]);
      return;
    }
    const list = await db.sandboxChanges.where('sandboxId').equals(activeSandbox.id).toArray();
    setChanges(list);
  };

  useEffect(() => {
    loadSandboxes();
  }, [activeProject]);

  useEffect(() => {
    loadChanges();
  }, [activeSandbox]);

  // Create Sandbox (UC-403)
  const handleCreateSandbox = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSandboxName.trim() || !activeProject) return;

    const sb: SandboxEnvironment = {
      id: `sb_${Date.now()}`,
      projectId: activeProject.id,
      name: newSandboxName.trim(),
      isPromoted: false,
      createdAt: new Date().toISOString()
    };

    await db.sandboxes.put(sb);
    setNewSandboxName('');
    setShowCreateModal(false);
    setActiveSandbox(sb);
    await loadSandboxes();
    setSuccess(`Sandbox "${sb.name}" inicializado com sucesso (UC-403)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Add Hypothetical Change (UC-404)
  const handleAddChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSandbox || !changeEntity.trim() || !changeHypothetical.trim()) return;

    const sc: SandboxChange = {
      id: `sbc_${Date.now()}`,
      sandboxId: activeSandbox.id,
      entityType: 'character',
      entityId: changeEntity.trim(),
      originalValue: changeOriginal.trim() || 'Estado Canônico Atual',
      hypotheticalValue: changeHypothetical.trim(),
      isMerged: false
    };

    await db.sandboxChanges.put(sc);
    setChangeEntity('');
    setChangeOriginal('');
    setChangeHypothetical('');
    await loadChanges();
    setSuccess(`Alteração hipotética "E se?" salva no sandbox (UC-404)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Promote Sandbox to Canonical Universe (UC-406)
  const handlePromoteSandbox = async () => {
    if (!activeSandbox || changes.length === 0) return;

    if (!confirm(`ATENÇÃO: Deseja promover permanentemente as ${changes.length} alterações do Sandbox "${activeSandbox.name}" para o Universo Canônico (UC-406)?`)) {
      return;
    }

    // Mark changes as merged and sandbox as promoted
    await db.transaction('rw', db.sandboxes, db.sandboxChanges, async () => {
      await db.sandboxes.update(activeSandbox.id, { isPromoted: true });
      for (const c of changes) {
        await db.sandboxChanges.update(c.id, { isMerged: true });
      }
    });

    await loadSandboxes();
    await loadChanges();
    setSuccess(`Resultado do Sandbox "${activeSandbox.name}" PROMOVIDO com sucesso para o Universo Canônico (UC-406)!`);
    setTimeout(() => setSuccess(null), 4000);
  };

  const comparison = compareSandboxWithCanonical(changes);

  return (
    <div className="sandbox-page-container" style={{ padding: '2rem', color: '#f3f4f6' }}>
      {/* Prominent Sandbox Badge Header (UC-403) */}
      <div style={{ background: 'linear-gradient(90deg, #f59e0b, #d97706)', padding: '0.6rem 1.2rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#000' }}>
        <span>⚠️ MODO SANDBOX "E SE?" ATIVO — AMBIENTE DE TESTE ISOLADO DO UNIVERSO CANÔNICO (UC-403)</span>
        <span style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: '#fff' }}>
          {activeSandbox ? activeSandbox.name : 'Nenhum Sandbox Selecionado'}
        </span>
      </div>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🧪 Sandbox Experimental "E Se?" (UC-403, UC-404, UC-405, UC-406)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Simule alterações hipotéticas em personagens e eventos sem afetar o universo principal.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button 
            onClick={handlePromoteSandbox}
            disabled={!activeSandbox || activeSandbox.isPromoted || changes.length === 0}
            style={{ background: activeSandbox?.isPromoted ? '#10b981' : '#f59e0b', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            {activeSandbox?.isPromoted ? '✅ Promovido ao Canônico' : '🚀 Promover para Universo Canônico (UC-406)'}
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ➕ Novo Sandbox de Teste
          </button>
        </div>
      </header>

      {/* Messages */}
      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {success}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.5rem' }}>
        {sandboxes.map(sb => (
          <button
            key={sb.id}
            onClick={() => setActiveSandbox(sb)}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '6px 6px 0 0',
              background: activeSandbox?.id === sb.id ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              border: '1px solid transparent',
              borderBottom: activeSandbox?.id === sb.id ? '2px solid #f59e0b' : 'transparent',
              color: activeSandbox?.id === sb.id ? '#f59e0b' : '#9ca3af',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            🧪 {sb.name} {sb.isPromoted && ' (Canônico)'}
          </button>
        ))}
      </div>

      {activeSandbox ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Comparison Summary Card (UC-405) */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.2rem' }}>📊 Comparativo Canônico vs Sandbox (UC-405)</h3>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>{comparison.summary}</p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
              <div>Alterações Totais: <strong style={{ color: '#f59e0b', fontSize: '1.2rem' }}>{comparison.modifiedCount}</strong></div>
              <div>Pendentes de Merge: <strong style={{ color: '#ef4444', fontSize: '1.2rem' }}>{comparison.unmergedCount}</strong></div>
            </div>
          </div>

          {/* Form to Test Hypothetical Change (UC-404) */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>💡 Testar Alteração Hipotética "E Se?" (UC-404)</h3>
            <form onSubmit={handleAddChange} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr auto', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Entidade / Personagem:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Kael, Winterfell"
                  value={changeEntity}
                  onChange={e => setChangeEntity(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Estado Canônico Original:</label>
                <input 
                  type="text"
                  placeholder="Ex: Kael é um guerreiro leal do Rei"
                  value={changeOriginal}
                  onChange={e => setChangeOriginal(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Alteração Hipotética ("E se?"):</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: E se Kael tivesse traído a ordem no Ato I?"
                  value={changeHypothetical}
                  onChange={e => setChangeHypothetical(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <button type="submit" style={{ background: '#f59e0b', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                Simular "E Se?"
              </button>
            </form>
          </div>

          {/* Comparison Table Side-by-Side (UC-405) */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '0.8rem 1rem' }}>Entidade</th>
                  <th style={{ padding: '0.8rem 1rem' }}>📜 Estado Canônico Original</th>
                  <th style={{ padding: '0.8rem 1rem' }}>🧪 Alteração Hipotética (Sandbox)</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {changes.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 700, color: '#60a5fa' }}>{c.entityId}</td>
                    <td style={{ padding: '0.8rem 1rem', opacity: 0.7 }}>{c.originalValue}</td>
                    <td style={{ padding: '0.8rem 1rem', color: '#f59e0b', fontWeight: 600 }}>{c.hypotheticalValue}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      {c.isMerged ? (
                        <span style={{ color: '#10b981', fontWeight: 700 }}>✅ Mesclado no Canônico</span>
                      ) : (
                        <span style={{ color: '#ef4444', fontWeight: 700 }}>⚠️ Hipotético</span>
                      )}
                    </td>
                  </tr>
                ))}
                {changes.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                      Nenhuma alteração simulada neste sandbox.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
          Crie um sandbox de teste para iniciar simulações "E se?".
        </div>
      )}

      {/* Modal Create Sandbox (UC-403) */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🧪 Criar Sandbox "E Se?" (UC-403)</h3>
            <form onSubmit={handleCreateSandbox}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome do Ambiente de Teste:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Sandbox: Protagonista Vilão..."
                  value={newSandboxName}
                  onChange={e => setNewSandboxName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#f59e0b', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Criar Sandbox</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
