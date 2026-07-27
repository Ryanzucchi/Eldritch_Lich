'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { CalendarEvent, MemberAvailability, exportToICalendar } from '@eldritch/domain';

export default function CalendarPage() {
  const { activeProject } = useApp();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [availabilities, setAvailabilities] = useState<MemberAvailability[]>([]);
  
  // Selected Timezone State (UC-380)
  const [selectedTimezone, setSelectedTimezone] = useState<string>('UTC-3 (Brasília)');

  // Modal Create Event (UC-376, UC-377)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [category, setCategory] = useState<'MEETING' | 'DEADLINE' | 'SPRINT' | 'VACATION'>('DEADLINE');
  const [colorTag, setColorTag] = useState('#3b82f6');
  const [assigneeEmail, setAssigneeEmail] = useState('');

  const [success, setSuccess] = useState<string | null>(null);

  // Load Events & Availabilities
  const loadData = async () => {
    if (!activeProject) return;
    const eventList = await db.calendarEvents.where('projectId').equals(activeProject.id).toArray();
    setEvents(eventList);

    let availList = await db.memberAvailabilities.toArray();
    if (availList.length === 0) {
      availList = [
        { email: 'autor@eldritch.com', name: 'Autor Principal', timezone: 'UTC-3 (Brasília)', status: 'AVAILABLE', workingHours: { start: '09:00', end: '18:00' } },
        { email: 'editor@eldritch.com', name: 'Editor sênior', timezone: 'UTC+1 (Londres)', status: 'BUSY', workingHours: { start: '10:00', end: '19:00' } }
      ];
      for (const a of availList) {
        await db.memberAvailabilities.put(a);
      }
    }
    setAvailabilities(availList);
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  // Create Event (UC-376, UC-377)
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !activeProject) return;

    const newEvent: CalendarEvent = {
      id: `ce_${Date.now()}`,
      projectId: activeProject.id,
      title: title.trim(),
      startDate: startDate || new Date().toISOString().split('T')[0],
      timezone: selectedTimezone,
      category,
      colorTag,
      assigneeEmails: assigneeEmail.trim() ? [assigneeEmail.trim()] : [],
      createdAt: new Date().toISOString()
    };

    await db.calendarEvents.put(newEvent);
    setShowCreateModal(false);
    setTitle('');
    setStartDate('');
    setAssigneeEmail('');
    await loadData();
    setSuccess(`Evento "${newEvent.title}" agendado no calendário da equipe (UC-377)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Export iCal (UC-378)
  const handleExportICal = () => {
    const icsData = exportToICalendar(events);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendario_equipe_${activeProject?.name || 'projeto'}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccess('Calendário exportado no padrão iCal/Google Calendar (UC-378)!');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="calendar-page-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📆 Calendário de Equipe, Disponibilidade & Fusos Horários (UC-376 a UC-380)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Acompanhe prazos de entrega, sprints, horários de trabalho e disponibilidade de coautores em múltiplos fusos.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={handleExportICal}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📥 Exportar iCal / Google Calendar (UC-378)
          </button>

          <button 
            onClick={() => setShowCreateModal(true)}
            style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ➕ Agendar Evento (UC-377)
          </button>
        </div>
      </header>

      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1rem' }}>
          {success}
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        {/* Calendar Viewport (UC-376) */}
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>📅 Visão Geral de Prazos & Eventos</h2>

            {/* Timezone Selector (UC-380) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>🌐 Fuso Horário (UC-380):</span>
              <select 
                value={selectedTimezone}
                onChange={e => setSelectedTimezone(e.target.value)}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem' }}
              >
                <option value="UTC-3 (Brasília)">UTC-3 (Brasília)</option>
                <option value="UTC+0 (Lisboa)">UTC+0 (Lisboa)</option>
                <option value="UTC+1 (Londres)">UTC+1 (Londres)</option>
                <option value="UTC-5 (Nova York)">UTC-5 (Nova York)</option>
              </select>
            </div>
          </div>

          {/* Events List Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {events.map(ev => (
              <div 
                key={ev.id} 
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  borderLeft: `4px solid ${ev.colorTag || '#3b82f6'}`, 
                  borderRadius: '8px', 
                  padding: '1rem' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#f3f4f6' }}>{ev.title}</h4>
                  <span style={{ background: 'rgba(255,255,255,0.1)', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {ev.category}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', opacity: 0.6, marginTop: '0.5rem' }}>
                  📅 {ev.startDate} ({ev.timezone})
                </div>
                {ev.assigneeEmails.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: '#93c5fd', marginTop: '0.4rem' }}>
                    👤 {ev.assigneeEmails.join(', ')}
                  </div>
                )}
              </div>
            ))}

            {events.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5, padding: '3rem 0' }}>
                Nenhum evento agendado neste projeto. Clique em "Agendar Evento".
              </div>
            )}
          </div>
        </div>

        {/* Member Availabilities Sidebar (UC-379, UC-380) */}
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#94a3b8' }}>👥 Disponibilidade da Equipe (UC-379)</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {availabilities.map(a => (
              <div key={a.email} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '8px', borderLeft: a.status === 'AVAILABLE' ? '3px solid #10b981' : '3px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.92rem' }}>{a.name}</strong>
                  <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: a.status === 'AVAILABLE' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: a.status === 'AVAILABLE' ? '#10b981' : '#f59e0b' }}>
                    {a.status === 'AVAILABLE' ? '🟢 Disponível' : '🟡 Ocupado'}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', opacity: 0.6, marginTop: '0.3rem' }}>
                  🌐 Fuso: {a.timezone}
                </div>
                <div style={{ fontSize: '0.78rem', opacity: 0.5, marginTop: '0.1rem' }}>
                  ⏰ Expediente: {a.workingHours.start} - {a.workingHours.end}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Event Modal (UC-377) */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📆 Agendar Evento de Equipe (UC-377)</h3>
            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Título do Evento:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Entrega da Primeira Revisão"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Data:</label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Categoria:</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    <option value="DEADLINE">📌 Prazo Final</option>
                    <option value="SPRINT">⚡ Sprint de Escrita</option>
                    <option value="MEETING">🤝 Reunião</option>
                    <option value="VACATION">🌴 Folga / Férias</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Responsável (E-mail):</label>
                <input 
                  type="email"
                  placeholder="editor@eldritch.com"
                  value={assigneeEmail}
                  onChange={e => setAssigneeEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar Evento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
