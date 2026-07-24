'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { TeamMeeting, MeetingActionItem, generateMeetingSummary } from '@eldritch/domain';

export default function MeetingsPage() {
  const { activeProject } = useApp();
  const [meetings, setMeetings] = useState<TeamMeeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<TeamMeeting | null>(null);

  // New Meeting Modal (UC-340)
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [agendaMarkdown, setAgendaMarkdown] = useState('');
  const [participantsText, setParticipantsText] = useState('');

  // Edit Minutes & Action Items State (UC-341, UC-342, UC-343, UC-344)
  const [minutesMarkdown, setMinutesMarkdown] = useState('');
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('');

  const [success, setSuccess] = useState<string | null>(null);

  // Load Meetings
  const loadMeetings = async () => {
    if (!activeProject) return;
    const list = await db.teamMeetings.where('projectId').equals(activeProject.id).toArray();
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setMeetings(list);

    if (list.length > 0 && (!selectedMeeting || !list.find(m => m.id === selectedMeeting.id))) {
      setSelectedMeeting(list[0]);
      setMinutesMarkdown(list[0].minutesMarkdown || '');
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [activeProject]);

  useEffect(() => {
    if (selectedMeeting) {
      setMinutesMarkdown(selectedMeeting.minutesMarkdown || '');
    }
  }, [selectedMeeting?.id]);

  // Schedule New Meeting (UC-340, UC-343)
  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !activeProject) return;

    const participants = participantsText.split(',').map(s => s.trim()).filter(Boolean);

    const newMeeting: TeamMeeting = {
      id: `tm_${Date.now()}`,
      projectId: activeProject.id,
      title: title.trim(),
      date: date || new Date().toISOString().split('T')[0],
      location: location.trim() || 'Online',
      agendaMarkdown: agendaMarkdown.trim(),
      participants,
      actionItems: [],
      createdAt: new Date().toISOString()
    };

    await db.teamMeetings.put(newMeeting);
    setShowScheduleModal(false);
    setTitle('');
    setDate('');
    setLocation('');
    setAgendaMarkdown('');
    setParticipantsText('');
    setSelectedMeeting(newMeeting);
    await loadMeetings();
    setSuccess(`Reunião "${newMeeting.title}" agendada com pauta salva (UC-340)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Save Minutes & Auto Summary (UC-341, UC-345)
  const handleSaveMinutes = async () => {
    if (!selectedMeeting) return;

    const updated: TeamMeeting = {
      ...selectedMeeting,
      minutesMarkdown
    };
    updated.aiSummary = generateMeetingSummary(updated);

    await db.teamMeetings.put(updated);
    setSelectedMeeting(updated);
    await loadMeetings();
    setSuccess('Ata da reunião registrada e resumo consolidado (UC-341, UC-345)!');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Add Action Item (UC-342, UC-343)
  const handleAddActionItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeeting || !newActionTitle.trim()) return;

    const newItem: MeetingActionItem = {
      id: `ai_${Date.now()}`,
      meetingId: selectedMeeting.id,
      title: newActionTitle.trim(),
      assigneeEmail: newActionAssignee.trim() || 'autor@eldritch.com',
      isCompleted: false,
      createdAt: new Date().toISOString()
    };

    const updated: TeamMeeting = {
      ...selectedMeeting,
      actionItems: [...selectedMeeting.actionItems, newItem]
    };
    updated.aiSummary = generateMeetingSummary(updated);

    await db.teamMeetings.put(updated);
    setSelectedMeeting(updated);
    setNewActionTitle('');
    setNewActionAssignee('');
    await loadMeetings();
    setSuccess('Nova pendência (action item) vinculada à reunião (UC-342)!');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Toggle Action Item Status (UC-344)
  const handleToggleActionItem = async (itemId: string) => {
    if (!selectedMeeting) return;

    const updatedItems = selectedMeeting.actionItems.map(item => 
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
    );

    const updated: TeamMeeting = {
      ...selectedMeeting,
      actionItems: updatedItems
    };
    updated.aiSummary = generateMeetingSummary(updated);

    await db.teamMeetings.put(updated);
    setSelectedMeeting(updated);
    await loadMeetings();
    setSuccess('Status da pendência atualizado (UC-344)!');
    setTimeout(() => setSuccess(null), 2500);
  };

  return (
    <div className="meetings-page-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📅 Reuniões de Equipe, Pautas, Atas & Action Items (UC-340 a UC-345)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Agende encontros, defina pautas, registre atas e acompanhe a conclusão de tarefas atribuídas.
          </p>
        </div>

        <button 
          onClick={() => setShowScheduleModal(true)}
          style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          ➕ Agendar Reunião (UC-340)
        </button>
      </header>

      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1rem' }}>
          {success}
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
        {/* Meetings List */}
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.05rem', color: '#94a3b8' }}>Reuniões Agendadas</h3>
          {meetings.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMeeting(m)}
              style={{
                textAlign: 'left',
                padding: '0.8rem',
                borderRadius: '8px',
                background: selectedMeeting?.id === m.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                border: '1px solid',
                borderColor: selectedMeeting?.id === m.id ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{m.title}</div>
              <div style={{ fontSize: '0.78rem', opacity: 0.6, marginTop: '0.2rem' }}>📅 {m.date} | 📍 {m.location}</div>
            </button>
          ))}

          {meetings.length === 0 && (
            <div style={{ textAlign: 'center', opacity: 0.5, padding: '2rem 0' }}>
              Nenhuma reunião cadastrada.
            </div>
          )}
        </div>

        {/* Selected Meeting Details */}
        {selectedMeeting ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Overview Card */}
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{selectedMeeting.title}</h2>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.88rem', opacity: 0.7 }}>
                <span>📅 Data: {selectedMeeting.date}</span>
                <span>📍 Local: {selectedMeeting.location || 'Online'}</span>
                <span>👥 Participantes: {selectedMeeting.participants.join(', ') || 'Nenhum'}</span>
              </div>
            </div>

            {/* Agenda & Minutes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Agenda (UC-340) */}
              <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.2rem' }}>
                <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#60a5fa' }}>📋 Pauta da Reunião (UC-340)</h3>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '6px', fontSize: '0.9rem', minHeight: '140px', whiteSpace: 'pre-wrap' }}>
                  {selectedMeeting.agendaMarkdown || 'Nenhuma pauta cadastrada.'}
                </div>
              </div>

              {/* Minutes (UC-341) */}
              <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.2rem' }}>
                <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#10b981' }}>📜 Ata da Reunião (UC-341)</h3>
                <textarea 
                  rows={5}
                  placeholder="Redija as deliberações e ata da reunião..."
                  value={minutesMarkdown}
                  onChange={e => setMinutesMarkdown(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem' }}
                />
                <button 
                  onClick={handleSaveMinutes}
                  style={{ marginTop: '0.8rem', background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                >
                  💾 Salvar Ata (UC-341)
                </button>
              </div>
            </div>

            {/* Action Items & Tracker (UC-342, UC-343, UC-344) */}
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem' }}>✅ Pendências & Action Items (UC-342, UC-343, UC-344)</h3>

              <form onSubmit={handleAddActionItem} style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem' }}>
                <input 
                  type="text"
                  required
                  placeholder="Nova tarefa gerada na reunião..."
                  value={newActionTitle}
                  onChange={e => setNewActionTitle(e.target.value)}
                  style={{ flex: 2, padding: '0.5rem 0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
                <input 
                  type="email"
                  placeholder="E-mail do responsável..."
                  value={newActionAssignee}
                  onChange={e => setNewActionAssignee(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem 0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
                <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                  Vincular Tarefa
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {selectedMeeting.actionItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 1rem', borderRadius: '6px', borderLeft: item.isCompleted ? '3px solid #10b981' : '3px solid #f59e0b' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', textDecoration: item.isCompleted ? 'line-through' : 'none', opacity: item.isCompleted ? 0.6 : 1 }}>
                      <input 
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => handleToggleActionItem(item.id)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span>{item.title}</span>
                    </label>

                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>👤 {item.assigneeEmail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Automatic Summary (UC-345) */}
            {selectedMeeting.aiSummary && (
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid #8b5cf6', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.8rem 0', color: '#c084fc', fontSize: '1.1rem' }}>🤖 Resumo Automático da Reunião (UC-345)</h3>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.85rem', fontFamily: 'monospace', color: '#e9d5ff' }}>
                  {selectedMeeting.aiSummary}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', opacity: 0.5, padding: '4rem' }}>
            Selecione ou agende uma reunião para visualizar pautas, atas e pendências.
          </div>
        )}
      </div>

      {/* Schedule Modal (UC-340) */}
      {showScheduleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📅 Agendar Reunião & Criar Pauta (UC-340)</h3>
            <form onSubmit={handleScheduleMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Título da Reunião:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Alinhamento de Capítulos & Lore"
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
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Local / Link:</label>
                  <input 
                    type="text"
                    placeholder="Ex: Google Meet, Sala 1"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Participantes (separados por vírgula):</label>
                <input 
                  type="text"
                  placeholder="autor@eldritch.com, editor@eldritch.com"
                  value={participantsText}
                  onChange={e => setParticipantsText(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Pauta da Reunião (Markdown):</label>
                <textarea 
                  rows={4}
                  placeholder="- Revisão do capítulo 3&#10;- Ajustes na personalidade do protagonista"
                  value={agendaMarkdown}
                  onChange={e => setAgendaMarkdown(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowScheduleModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Agendar e Notificar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
