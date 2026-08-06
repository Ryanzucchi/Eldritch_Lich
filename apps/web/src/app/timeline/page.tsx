'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Timeline, TimelineEvent, validateTimelineConsistency } from '@eldritch/domain';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import './timeline.css';

const dateLabel = (date: string) => date || 'Sem data';

export default function TimelinePage() {
  const { activeProject } = useApp();
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [activeId, setActiveId] = useState('');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [newTimelineName, setNewTimelineName] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);

  const activeTimeline = useMemo(() => timelines.find(timeline => timeline.id === activeId) ?? null, [activeId, timelines]);
  const warnings = useMemo(() => validateTimelineConsistency(events).warnings, [events]);

  const loadTimelines = async () => {
    if (!activeProject) return;
    const records = (await db.timelines.where('projectId').equals(activeProject.id).toArray()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    setTimelines(records);
    setActiveId(current => records.some(timeline => timeline.id === current) ? current : records[0]?.id ?? '');
  };
  const loadEvents = async () => {
    if (!activeId) { setEvents([]); return; }
    setEvents((await db.timelineEvents.where('timelineId').equals(activeId).toArray()).sort((a, b) => a.sortOrder - b.sortOrder));
  };

  useEffect(() => { void loadTimelines(); }, [activeProject?.id]);
  useEffect(() => { void loadEvents(); }, [activeId]);

  const createTimeline = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeProject || !newTimelineName.trim()) return;
    const now = new Date().toISOString();
    const timeline: Timeline = { id: crypto.randomUUID(), projectId: activeProject.id, name: newTimelineName.trim(), calendarType: 'custom', createdAt: now, updatedAt: now };
    await db.timelines.put(timeline);
    setNewTimelineName('');
    await loadTimelines();
    setActiveId(timeline.id);
  };
  const createEvent = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeTimeline || !eventTitle.trim()) return;
    await db.timelineEvents.put({ id: crypto.randomUUID(), timelineId: activeTimeline.id, title: eventTitle.trim(), dateStr: eventDate.trim() || 'Sem data', description: eventDescription.trim() || undefined, sortOrder: events.length, precursorEventIds: [], createdAt: new Date().toISOString() });
    setEventTitle(''); setEventDate(''); setEventDescription(''); setShowEventForm(false);
    await loadEvents();
  };
  const removeEvent = async (id: string) => { await db.timelineEvents.delete(id); await loadEvents(); };

  return <main className="page timeline-page">
    <header className="page-heading"><div><p className="eyebrow">Universo</p><h1>Linha do tempo</h1><p>Uma cronologia legível, conectada aos fatos extraídos do manuscrito.</p></div></header>
    <section className="timeline-toolbar surface-card">
      <div className="timeline-selector"><label htmlFor="timeline-select">Cronologia</label><select id="timeline-select" value={activeId} onChange={event => setActiveId(event.target.value)}><option value="">Selecione</option>{timelines.map(timeline => <option key={timeline.id} value={timeline.id}>{timeline.name}</option>)}</select></div>
      <form className="timeline-create" onSubmit={createTimeline}><input aria-label="Nome da nova cronologia" value={newTimelineName} onChange={event => setNewTimelineName(event.target.value)} placeholder="Nova cronologia" /><button type="submit" className="secondary-button">Criar</button></form>
      {activeTimeline && <button type="button" className="primary-button" onClick={() => setShowEventForm(value => !value)}>{showEventForm ? 'Cancelar' : 'Adicionar evento'}</button>}
    </section>
    {showEventForm && <form className="timeline-event-form surface-card" onSubmit={createEvent}><label>Título<input value={eventTitle} onChange={event => setEventTitle(event.target.value)} placeholder="A coroação de…" autoFocus /></label><label>Data ou época<input value={eventDate} onChange={event => setEventDate(event.target.value)} placeholder="Ano 1042" /></label><label>Contexto<textarea value={eventDescription} onChange={event => setEventDescription(event.target.value)} placeholder="O que aconteceu e por que isso importa?" rows={3} /></label><div><button type="submit" className="primary-button">Salvar evento</button></div></form>}
    {!activeTimeline ? <section className="empty-state timeline-empty"><h2>Comece por uma cronologia.</h2><p>Ela também será criada automaticamente quando o editor encontrar datas explícitas no seu manuscrito.</p></section> : <>
      {warnings.length > 0 && <section className="timeline-warnings" role="status"><strong>Verifique a ordem dos eventos</strong>{warnings.map(warning => <p key={warning}>{warning}</p>)}</section>}
      <section className="timeline-track" aria-label={`Eventos de ${activeTimeline.name}`}>
        {events.length === 0 ? <div className="empty-state"><h2>Ainda não há eventos.</h2><p>Adicione um evento ou use “Analisar manuscrito” no editor para criar eventos a partir das datas do texto.</p></div> : events.map((item, index) => <article className="timeline-event" key={item.id}><div className="timeline-marker"><span>{index + 1}</span></div><div className="timeline-event-card"><time>{dateLabel(item.dateStr)}</time><h2>{item.title}</h2>{item.description && <p>{item.description}</p>}<button type="button" onClick={() => void removeEvent(item.id)}>Remover</button></div></article>)}
      </section>
    </>}
  </main>;
}
