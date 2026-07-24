'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { Timeline, TimelineEvent, validateTimelineConsistency } from '@eldritch/domain';

export default function TimelinePage() {
  const { activeProject } = useApp();
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [activeTimeline, setActiveTimeline] = useState<Timeline | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  
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
      sortOrder: events.length + 1,
      precursorEventIds: selectedPrecursorId ? [selectedPrecursorId] : [],
      createdAt: new Date().toISOString()
    };

    await db.timelineEvents.put(newEv);
    setEventTitle('');
    setEventDateStr('');
    setEventDesc('');
    setSelectedPrecursorId('');
    setShowEventModal(false);
    await loadEvents();
    setSuccess(`Evento "${newEv.title}" adicionado à cronologia!`);
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

        <button 
          onClick={() => setShowCreateTimelineModal(true)}
          className="btn-portal-logout"
          style={{ background: '#3b82f6', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          ➕ Criar Nova Linha do Tempo
        </button>
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

          {/* Interactive Horizontal Timeline View (UC-058) */}
          <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', padding: '1rem 0 2rem 0', position: 'relative' }}>
            {/* Timeline Axis Line */}
            <div style={{ position: 'absolute', top: '50px', left: 0, right: 0, height: '4px', background: '#3b82f6', zIndex: 0 }} />

            {events.map((ev, index) => (
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
    </div>
  );
}
