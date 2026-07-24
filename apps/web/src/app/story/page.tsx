'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { StoryAct, HeroJourneyStage, CLASSIC_HERO_JOURNEY_STAGES } from '@eldritch/domain';

export default function StoryArchitecturePage() {
  const { activeProject } = useApp();
  const [activeTab, setActiveTab] = useState<'acts' | 'journey'>('acts');

  // 3-Acts State (UC-395)
  const [acts, setActs] = useState<StoryAct[]>([]);
  const [manuscriptTitles, setManuscriptTitles] = useState<{ id: string; title: string }[]>([]);

  // Hero's Journey State (UC-396)
  const [characterName, setCharacterName] = useState('Protagonista');
  const [journeyStages, setJourneyStages] = useState<HeroJourneyStage[]>([]);

  const [success, setSuccess] = useState<string | null>(null);

  // Load Data
  const loadData = async () => {
    if (!activeProject) return;

    // Load Manuscripts (Cenas/Capítulos)
    const mList = await db.manuscripts.toArray();
    setManuscriptTitles(mList.map(m => ({ id: m.id, title: m.title })));

    // Load Acts (UC-395)
    let actsList = await db.storyActs.where('projectId').equals(activeProject.id).toArray();
    if (actsList.length === 0) {
      // Seed classic 3-acts structure
      actsList = [
        { id: `act_1_${Date.now()}`, projectId: activeProject.id, name: 'Ato I: Apresentação (Mundo Comum & Incidente)', sceneIds: [], sortOrder: 1 },
        { id: `act_2_${Date.now()}`, projectId: activeProject.id, name: 'Ato II: Confrontação (Obstáculos & Clímax Médio)', sceneIds: [], sortOrder: 2 },
        { id: `act_3_${Date.now()}`, projectId: activeProject.id, name: 'Ato III: Resolução (Clímax Final & Desfecho)', sceneIds: [], sortOrder: 3 }
      ];
      await db.storyActs.bulkPut(actsList);
    }
    actsList.sort((a, b) => a.sortOrder - b.sortOrder);
    setActs(actsList);

    // Load Hero Journey (UC-396)
    let stagesList = await db.heroJourneyStages.where('projectId').equals(activeProject.id).toArray();
    if (stagesList.length === 0) {
      stagesList = CLASSIC_HERO_JOURNEY_STAGES.map((st, idx) => ({
        id: `hjs_${idx}_${Date.now()}`,
        projectId: activeProject.id,
        characterName: 'Protagonista',
        stageName: st,
        stepNumber: idx + 1
      }));
      await db.heroJourneyStages.bulkPut(stagesList);
    }
    stagesList.sort((a, b) => a.stepNumber - b.stepNumber);
    setJourneyStages(stagesList);
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  // Associate Scene to Act (UC-395)
  const handleAddSceneToAct = async (actId: string, sceneId: string) => {
    if (!sceneId) return;
    const targetAct = acts.find(a => a.id === actId);
    if (!targetAct) return;

    if (targetAct.sceneIds.includes(sceneId)) return;

    const updatedAct = {
      ...targetAct,
      sceneIds: [...targetAct.sceneIds, sceneId]
    };

    await db.storyActs.put(updatedAct);
    await loadData();
    setSuccess(`Cena adicionada ao ${targetAct.name}!`);
    setTimeout(() => setSuccess(null), 2500);
  };

  // Update Hero Journey Stage Notes (UC-396)
  const handleUpdateStageNotes = async (stageId: string, notes: string, sceneId?: string) => {
    const targetStage = journeyStages.find(s => s.id === stageId);
    if (!targetStage) return;

    const updatedStage: HeroJourneyStage = {
      ...targetStage,
      notes,
      sceneId: sceneId || targetStage.sceneId
    };

    await db.heroJourneyStages.put(updatedStage);
    await loadData();
  };

  return (
    <div className="story-architecture-page" style={{ padding: '2rem', color: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🏛️ Arquitetura da História & Atos (UC-395, UC-396)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Estruture seu enredo em 3 atos e mapeie a transformação do protagonista na Jornada do Herói.
          </p>
        </div>

        {/* View Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem', borderRadius: '8px' }}>
          <button 
            onClick={() => setActiveTab('acts')}
            style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', background: activeTab === 'acts' ? '#3b82f6' : 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer' }}
          >
            🎭 Estrutura em Atos (UC-395)
          </button>
          <button 
            onClick={() => setActiveTab('journey')}
            style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', background: activeTab === 'journey' ? '#3b82f6' : 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer' }}
          >
            🦸 Jornada do Herói (UC-396)
          </button>
        </div>
      </header>

      {/* Messages */}
      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {success}
        </div>
      )}

      {/* Tab 1: 3-Acts Structure View (UC-395) */}
      {activeTab === 'acts' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {acts.map(act => (
            <div 
              key={act.id}
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '480px'
              }}
            >
              <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.15rem', color: '#60a5fa', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.6rem' }}>
                {act.name}
              </h3>

              {/* Associated Scenes */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem', margin: '0.8rem 0' }}>
                {act.sceneIds.map(sId => {
                  const sc = manuscriptTitles.find(m => m.id === sId);
                  return (
                    <div key={sId} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}>
                      📄 {sc?.title || 'Capítulo / Cena'}
                    </div>
                  );
                })}
                {act.sceneIds.length === 0 && (
                  <div style={{ opacity: 0.4, fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>
                    Nenhuma cena alocada neste ato.
                  </div>
                )}
              </div>

              {/* Add Scene Dropdown */}
              <select 
                onChange={e => handleAddSceneToAct(act.id, e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem' }}
              >
                <option value="">➕ Alocar cena neste ato...</option>
                {manuscriptTitles.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Hero's Journey View (UC-396) */}
      {activeTab === 'journey' && (
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Nome do Protagonista:</label>
            <input 
              type="text"
              value={characterName}
              onChange={e => setCharacterName(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>

          {/* 12 Steps List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {journeyStages.map(stage => (
              <div 
                key={stage.id}
                style={{
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '1rem'
                }}
              >
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#a855f7', fontSize: '1rem' }}>{stage.stageName}</h4>
                <textarea 
                  rows={2}
                  placeholder="Anotações de transformação psicológica..."
                  value={stage.notes || ''}
                  onChange={e => handleUpdateStageNotes(stage.id, e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
