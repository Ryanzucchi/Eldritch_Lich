'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { Timeline, TimelineEvent, validateTimelineConsistency, compareTimelines, TimelineComparisonResult, exportTimeline } from '@eldritch/domain';

export default function TimelinePage() {
  const { activeProject } = useApp();
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [activeTimeline, setActiveTimeline] = useState<Timeline | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  
  // Export State (UC-171, UC-264)
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'html' | 'markdown' | 'json'>('html');
  
  // Parallel Branch States (UC-076)
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [branchTimelineName, setBranchTimelineName] = useState('');
  const [bifurcationEventId, setBifurcationEventId] = useState('');

  // Comparison States (UC-079)
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareTimelineIdB, setCompareTimelineIdB] = useState('');
  const [comparisonResult, setComparisonResult] = useState<TimelineComparisonResult | null>(null);
  
  // Modal states
  const [showCreateTimelineModal, setShowCreateTimelineModal] = useState(false);
  const [newTimelineName, setNewTimelineName] = useState('');
  const [newTimelineDesc, setNewTimelineDesc] = useState('');
  const [calendarType, setCalendarType] = useState<'gregorian' | 'custom'>('gregorian');
  
  // Event Form states
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDateStr, setEventDateStr] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [selectedPrecursorId, setSelectedPrecursorId] = useState<string>('');
  const [eventLocationName, setEventLocationName] = useState<string>(''); // UC-167
  const [eventCharacterName, setEventCharacterName] = useState<string>(''); // UC-167

  // Filtering States (UC-169, UC-170)
  const [filterCharacter, setFilterCharacter] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');

  const [warnings, setWarnings] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  // Load Timelines
  const loadTimelines = async () => {
    if (!activeProject) return;
    const list = await db.timelines.where('projectId').equals(activeProject.id).toArray();
    setTimelines(list);
    if (list.length > 0 && !activeTimeline) {
      setActiveTimeline(list[0]);
    }
  };

  // Load Events for Active Timeline
  const loadEvents = async () => {
    if (!activeTimeline) {
      setEvents([]);
      return;
    }
    const evList = await db.timelineEvents.where('timelineId').equals(activeTimeline.id).toArray();
    evList.sort((a, b) => a.sortOrder - b.sortOrder);
    setEvents(evList);

    // Validate consistency (UC-056)
    const valResult = validateTimelineConsistency(evList);
    setWarnings(valResult.warnings);
  };

  useEffect(() => {
    loadTimelines();
  }, [activeProject]);

  useEffect(() => {
    loadEvents();
  }, [activeTimeline]);

  // Create Timeline (UC-055)
  const handleCreateTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimelineName.trim() || !activeProject) return;

    const newTl: Timeline = {
      id: `tl_${Date.now()}`,
      projectId: activeProject.id,
      name: newTimelineName.trim(),
      description: newTimelineDesc.trim(),
      calendarType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.timelines.put(newTl);
    setNewTimelineName('');
    setNewTimelineDesc('');
    setShowCreateTimelineModal(false);
    setActiveTimeline(newTl);
    await loadTimelines();
    setSuccess(`Linha do tempo "${newTl.name}" criada com sucesso!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Add Event to Timeline (UC-056, UC-058)
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTimeline || !eventTitle.trim()) return;

    const newEv: TimelineEvent = {
      id: `ev_${Date.now()}`,
      timelineId: activeTimeline.id,
      title: eventTitle.trim(),
      dateStr: eventDateStr.trim() || 'Sem Data',
      description: eventDesc.trim(),
      locationId: eventLocationName.trim() || undefined,
      characterIds: eventCharacterName.trim() ? [eventCharacterName.trim()] : undefined,
      sortOrder: events.length + 1,
      precursorEventIds: selectedPrecursorId ? [selectedPrecursorId] : [],
      createdAt: new Date().toISOString()
    };

    await db.timelineEvents.put(newEv);
    setEventTitle('');
    setEventDateStr('');
    setEventDesc('');
    setEventLocationName('');
    setEventCharacterName('');
    setSelectedPrecursorId('');
    setShowEventModal(false);
    await loadEvents();
    setSuccess(`Evento "${newEv.title}" adicionado à cronologia!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Create Parallel Timeline Branch (UC-076)
  const handleCreateParallelBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTimeline || !branchTimelineName.trim() || !activeProject) return;

    const newBranchTl: Timeline = {
      id: `tl_branch_${Date.now()}`,
      projectId: activeProject.id,
      name: branchTimelineName.trim(),
      description: `Linha paralela bifurcada de "${activeTimeline.name}"`,
      calendarType: activeTimeline.calendarType,
      parentTimelineId: activeTimeline.id,
      bifurcationEventId: bifurcationEventId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.timelines.put(newBranchTl);

    // Clone events up to bifurcation event or all if not specified
    let eventsToClone = [...events];
    if (bifurcationEventId) {
      const bifEvent = events.find(e => e.id === bifurcationEventId);
      if (bifEvent) {
        eventsToClone = events.filter(e => e.sortOrder <= bifEvent.sortOrder);
      }
    }

    const clonedEvents: TimelineEvent[] = eventsToClone.map(ev => ({
      ...ev,
      id: `ev_cloned_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timelineId: newBranchTl.id
    }));

    await db.timelineEvents.bulkPut(clonedEvents);
    setBranchTimelineName('');
    setBifurcationEventId('');
    setShowBranchModal(false);
    setActiveTimeline(newBranchTl);
    await loadTimelines();
    setSuccess(`Linha paralela "${newBranchTl.name}" criada com ${clonedEvents.length} eventos clonados!`);
    setTimeout(() => setSuccess(null), 3500);
  };

  // Compare Two Timelines (UC-079)
  const handleCompareTimelines = async () => {
    if (!activeTimeline || !compareTimelineIdB) return;
    const targetTlB = timelines.find(t => t.id === compareTimelineIdB);
    if (!targetTlB) return;

    const eventsBList = await db.timelineEvents.where('timelineId').equals(targetTlB.id).toArray();
    eventsBList.sort((a, b) => a.sortOrder - b.sortOrder);

    const res = compareTimelines(activeTimeline, events, targetTlB, eventsBList);
    setComparisonResult(res);
  };

  // Download Export File (UC-171, UC-264)
  const handleDownloadExport = () => {
    if (!activeTimeline) return;
    const content = exportTimeline(activeTimeline, events, { format: exportFormat });

    let mimeType = 'text/plain';
    let ext = 'txt';
    if (exportFormat === 'json') { mimeType = 'application/json'; ext = 'json'; }
    if (exportFormat === 'html') { mimeType = 'text/html'; ext = 'html'; }
    if (exportFormat === 'markdown') { mimeType = 'text/markdown'; ext = 'md'; }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cronologia_${activeTimeline.name.toLowerCase().replace(/\s+/g, '_')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
    setSuccess(`Cronologia exportada com sucesso em .${ext}!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="timeline-page-container" style={{ padding: '2rem', color: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⏳ Cronologia & Linhas do Tempo (UC-055, UC-056, UC-058)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Organize eventos narrativos, relacione causas e consequências e visualize cronologias.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button 
            onClick={() => setShowExportModal(true)}
            disabled={!activeTimeline}
            style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📥 Exportar (UC-171, UC-264)
          </button>
          <button 
            onClick={() => setShowBranchModal(true)}
            disabled={!activeTimeline}
            style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            🌿 Bifurcar Linha Paralela (UC-076)
          </button>
          <button 
            onClick={() => { setShowCompareModal(true); setComparisonResult(null); }}
            disabled={timelines.length < 2}
            style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ⚖️ Comparar Timelines (UC-079)
          </button>
          <button 
            onClick={() => setShowCreateTimelineModal(true)}
            style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ➕ Criar Linha do Tempo
          </button>
        </div>
      </header>

      {/* Messages */}
      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {success}
        </div>
      )}

      {warnings.length > 0 && (
        <div style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#f59e0b', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          <strong>⚠️ Alertas de Inconsistência Cronológica:</strong>
          <ul style={{ margin: '0.4rem 0 0 1.2rem', padding: 0 }}>
            {warnings.map((w, idx) => <li key={idx}>{w}</li>)}
          </ul>
        </div>
      )}

      {/* Timeline Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.5rem' }}>
        {timelines.map(tl => (
          <button
            key={tl.id}
            onClick={() => setActiveTimeline(tl)}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '6px 6px 0 0',
              background: activeTimeline?.id === tl.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              border: '1px solid transparent',
              borderBottom: activeTimeline?.id === tl.id ? '2px solid #3b82f6' : 'transparent',
              color: activeTimeline?.id === tl.id ? '#3b82f6' : '#9ca3af',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            🗓️ {tl.name}
          </button>
        ))}
        {timelines.length === 0 && (
          <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>Nenhuma linha do tempo cadastrada no projeto.</span>
        )}
      </div>

      {/* Active Timeline Canvas */}
      {activeTimeline ? (
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{activeTimeline.name}</h2>
              {activeTimeline.description && <p style={{ margin: '0.2rem 0 0 0', opacity: 0.6, fontSize: '0.9rem' }}>{activeTimeline.description}</p>}
            </div>

            <button 
              onClick={() => setShowEventModal(true)}
              style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
            >
              ➕ Adicionar Evento à Timeline
            </button>
          </div>

          {/* Filtering Controls Bar (UC-169, UC-170) */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.8rem 1rem', borderRadius: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af' }}>🔎 Filtrar Cronologia:</span>
            <input 
              type="text" 
              placeholder="Filtrar por Personagem (UC-169)..." 
              value={filterCharacter}
              onChange={e => setFilterCharacter(e.target.value)}
              style={{ flex: 1, padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem' }}
            />
            <input 
              type="text" 
              placeholder="Filtrar por Local (UC-170)..." 
              value={filterLocation}
              onChange={e => setFilterLocation(e.target.value)}
              style={{ flex: 1, padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem' }}
            />
            {(filterCharacter || filterLocation) && (
              <button 
                type="button" 
                onClick={() => { setFilterCharacter(''); setFilterLocation(''); }}
                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
              >
                ✖️ Limpar Filtros
              </button>
            )}
          </div>

          {/* Interactive Horizontal Timeline View (UC-058) */}
          <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', padding: '1rem 0 2rem 0', position: 'relative' }}>
            {/* Timeline Axis Line */}
            <div style={{ position: 'absolute', top: '50px', left: 0, right: 0, height: '4px', background: '#3b82f6', zIndex: 0 }} />

            {events
              .filter(ev => {
                if (filterCharacter.trim()) {
                  const query = filterCharacter.toLowerCase();
                  const matchesChar = ev.characterIds?.some(c => c.toLowerCase().includes(query)) || ev.title.toLowerCase().includes(query);
                  if (!matchesChar) return false;
                }
                if (filterLocation.trim()) {
                  const query = filterLocation.toLowerCase();
                  const matchesLoc = ev.locationId?.toLowerCase().includes(query);
                  if (!matchesLoc) return false;
                }
                return true;
              })
              .map((ev, index) => (
              <div 
                key={ev.id}
                style={{
                  minWidth: '240px',
                  maxWidth: '280px',
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '1rem',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}
              >
                {/* Node Marker */}
                <div style={{ position: 'absolute', top: '-18px', left: '20px', width: '16px', height: '16px', borderRadius: '50%', background: '#3b82f6', border: '3px solid #07070a' }} />

                <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 700, marginBottom: '0.3rem' }}>
                  {ev.dateStr}
                </div>

                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>{ev.title}</h4>
                {ev.description && <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.4 }}>{ev.description}</p>}

                {/* Location Badge (UC-167) */}
                {ev.locationId && (
                  <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', display: 'inline-block', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', color: '#93c5fd', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    📍 {ev.locationId}
                  </div>
                )}

                {/* Character Badges (UC-169) */}
                {ev.characterIds && ev.characterIds.length > 0 && (
                  <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {ev.characterIds.map((char, cIdx) => (
                      <span key={cIdx} style={{ fontSize: '0.72rem', background: 'rgba(168, 85, 247, 0.2)', border: '1px solid #a855f7', color: '#e9d5ff', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        👤 {char}
                      </span>
                    ))}
                  </div>
                )}

                {/* Precursor Connections (UC-056) */}
                {ev.precursorEventIds && ev.precursorEventIds.length > 0 && (
                  <div style={{ marginTop: '0.8rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255, 255, 255, 0.1)', fontSize: '0.75rem', color: '#a7f3d0' }}>
                    🔗 Precursor: {events.find(p => p.id === ev.precursorEventIds![0])?.title || 'Evento anterior'}
                  </div>
                )}
              </div>
            ))}

            {events.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', width: '100%', opacity: 0.5 }}>
                Esta linha do tempo ainda não possui eventos. Clique em "Adicionar Evento" para começar.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
          Selecione ou crie uma linha do tempo para visualizar seus eventos.
        </div>
      )}

      {/* Modal Criar Linha do Tempo (UC-055) */}
      {showCreateTimelineModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🗓️ Criar Nova Linha do Tempo (UC-055)</h3>
            <form onSubmit={handleCreateTimeline}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome da Timeline:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Era dos Deuses, Guerra Civil..."
                  value={newTimelineName}
                  onChange={e => setNewTimelineName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Descrição:</label>
                <textarea 
                  rows={3}
                  placeholder="Descrição ou escopo da linha do tempo..."
                  value={newTimelineDesc}
                  onChange={e => setNewTimelineDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCreateTimelineModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Criar Timeline</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adicionar Evento (UC-056, UC-058) */}
      {showEventModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📍 Adicionar Evento Cronológico</h3>
            <form onSubmit={handleAddEvent}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Título do Evento:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: A Queda da Cidadela..."
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Data Fictícia / Marca de Tempo:</label>
                <input 
                  type="text"
                  placeholder="Ex: Ano 1042, Dia 14 da Lua Cheia..."
                  value={eventDateStr}
                  onChange={e => setEventDateStr(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Local do Evento (UC-167):</label>
                <input 
                  type="text"
                  placeholder="Ex: Castelo Sombrio, Floresta dos Sussurros..."
                  value={eventLocationName}
                  onChange={e => setEventLocationName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Personagem Participante (UC-167):</label>
                <input 
                  type="text"
                  placeholder="Ex: Kael, Elara..."
                  value={eventCharacterName}
                  onChange={e => setEventCharacterName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Evento Precursor / Causa (UC-056):</label>
                <select 
                  value={selectedPrecursorId}
                  onChange={e => setSelectedPrecursorId(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="">-- Sem vínculo precursor --</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title} ({ev.dateStr})</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Descrição:</label>
                <textarea 
                  rows={3}
                  placeholder="Detalhes do que acontece neste evento..."
                  value={eventDesc}
                  onChange={e => setEventDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowEventModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar Evento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Bifurcar Linha Paralela (UC-076) */}
      {showBranchModal && activeTimeline && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>🌿 Criar Linha Paralela / Universo Alternativo (UC-076)</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '0 0 1.2rem 0' }}>
              Bifurca a linha <strong>"{activeTimeline.name}"</strong> clonando todos os eventos até o ponto de ramificação.
            </p>
            <form onSubmit={handleCreateParallelBranch}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome da Nova Linha Paralela:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Realidade B, O que aconteceria se..."
                  value={branchTimelineName}
                  onChange={e => setBranchTimelineName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Ponto de Bifurcação (Clonar eventos até):</label>
                <select 
                  value={bifurcationEventId}
                  onChange={e => setBifurcationEventId(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="">-- Clonar todos os eventos da linha base --</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title} ({ev.dateStr})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowBranchModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Criar Linha Paralela</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Comparar Duas Linhas do Tempo (UC-079) */}
      {showCompareModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>⚖️ Comparar Duas Linhas do Tempo (UC-079)</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '0 0 1.2rem 0' }}>
              Compare eventos equivalentes e identifique pontos de divergência entre duas cronologias.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Linha A (Base):</label>
                <input 
                  type="text" 
                  disabled 
                  value={activeTimeline?.name || ''} 
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Linha B (Para Comparação):</label>
                <select 
                  value={compareTimelineIdB}
                  onChange={e => setCompareTimelineIdB(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="">-- Selecione a segunda linha --</option>
                  {timelines.filter(t => t.id !== activeTimeline?.id).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleCompareTimelines} 
              disabled={!compareTimelineIdB}
              style={{ width: '100%', background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem' }}
            >
              Executar Comparação Cronológica
            </button>

            {/* Comparison Results */}
            {comparisonResult && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1rem' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1rem' }}>Resultado da Análise de Divergências:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {comparisonResult.divergentEvents.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '0.6rem 0.8rem',
                        borderRadius: '6px',
                        background: item.type === 'COMMON' ? 'rgba(16, 185, 129, 0.1)' : item.type === 'DATE_MISMATCH' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        {item.type === 'COMMON' && <span>🟢 <strong>{item.eventA?.title}</strong> — Ocorre em ambas as linhas ({item.eventA?.dateStr})</span>}
                        {item.type === 'DATE_MISMATCH' && <span>⚠️ <strong>{item.eventA?.title}</strong> — Conflito de Data: Em A ({item.eventA?.dateStr}) vs Em B ({item.eventB?.dateStr})</span>}
                        {item.type === 'ONLY_IN_A' && <span>🔹 <strong>{item.eventA?.title}</strong> ({item.eventA?.dateStr}) — Exclusivo da Linha A</span>}
                        {item.type === 'ONLY_IN_B' && <span>🔸 <strong>{item.eventB?.title}</strong> ({item.eventB?.dateStr}) — Exclusivo da Linha B</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowCompareModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Exportar Cronologia (UC-171, UC-264) */}
      {showExportModal && activeTimeline && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>📥 Exportar Cronologia (UC-171, UC-264)</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '0 0 1.2rem 0' }}>
              Exporte a linha do tempo <strong>"{activeTimeline.name}"</strong> para relatórios ou visualização interativa.
            </p>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Formato de Saída:</label>
              <select 
                value={exportFormat}
                onChange={e => setExportFormat(e.target.value as any)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              >
                <option value="html">🌐 HTML Interativo (UC-264)</option>
                <option value="markdown">📝 Documento Markdown (UC-171)</option>
                <option value="json">📦 Dados Estruturados JSON (UC-171)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowExportModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
              <button type="button" onClick={handleDownloadExport} style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Baixar Arquivo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
