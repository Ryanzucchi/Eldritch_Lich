'use client';

export const dynamic = 'force-dynamic';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Manuscript, StoryAct } from '@eldritch/domain';
import { db } from '../../db/schema';
import { useApp } from '../../context/AppContext';
import './story.css';

export default function StoryArchitecturePage() {
  const { activeProject } = useApp();
  const [acts, setActs] = useState<StoryAct[]>([]);
  const [chapters, setChapters] = useState<Manuscript[]>([]);
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => { if (!activeProject) return; const [storedActs, manuscripts] = await Promise.all([db.storyActs.where('projectId').equals(activeProject.id).toArray(), db.manuscripts.toArray()]); setActs(storedActs.sort((a, b) => a.sortOrder - b.sortOrder)); setChapters(manuscripts.filter(manuscript => manuscript.projectId === activeProject.id && !manuscript.inTrash).sort((a, b) => a.createdAt.localeCompare(b.createdAt))); };
  useEffect(() => { void load(); }, [activeProject?.id]);
  const assignedIds = useMemo(() => new Set(acts.flatMap(act => act.sceneIds)), [acts]);
  const createAct = async (event: FormEvent) => { event.preventDefault(); if (!activeProject || !title.trim()) return; await db.storyActs.put({ id: crypto.randomUUID(), projectId: activeProject.id, name: title.trim(), sceneIds: [], sortOrder: acts.length + 1 }); setTitle(''); setCreating(false); await load(); };
  const toggleChapter = async (act: StoryAct, chapterId: string) => { const belongs = act.sceneIds.includes(chapterId); await db.storyActs.put({ ...act, sceneIds: belongs ? act.sceneIds.filter(id => id !== chapterId) : [...act.sceneIds, chapterId] }); await load(); };
  const removeAct = async (id: string) => { if (!confirm('Remover este ato? Os capítulos não serão apagados.')) return; await db.storyActs.delete(id); await load(); };

  return <main className="page story-page"><header className="page-heading"><div><p className="eyebrow">Construção da história</p><h1>Arquitetura narrativa</h1><p>Organize os capítulos que você já escreveu. Nenhum ato é criado até você decidir que ele existe.</p></div><button className="primary-button" onClick={() => setCreating(true)}>Novo ato</button></header>
    {creating && <form className="surface-card story-form" onSubmit={createAct}><label>Nome do ato ou arco<input value={title} onChange={event => setTitle(event.target.value)} autoFocus placeholder="Ex.: A travessia do estreito" /></label><div><button type="button" className="secondary-button" onClick={() => setCreating(false)}>Cancelar</button><button className="primary-button">Criar ato</button></div></form>}
    <section className="story-layout"><div className="story-acts">{acts.map((act, index) => { const actChapters = chapters.filter(chapter => act.sceneIds.includes(chapter.id)); return <article className="surface-card story-act" key={act.id}><header><div><span>Ato {index + 1}</span><h2>{act.name}</h2></div><button type="button" onClick={() => void removeAct(act.id)}>Remover</button></header><p>{actChapters.length ? `${actChapters.length} capítulo(s) associado(s)` : 'Escolha capítulos da margem para construir este ato.'}</p><div>{actChapters.map(chapter => <button type="button" key={chapter.id} className="chapter-chip" onClick={() => void toggleChapter(act, chapter.id)}>{chapter.title} <span>×</span></button>)}</div></article>; })}{!acts.length && <div className="empty-state"><h2>A história ainda não tem atos definidos.</h2><p>Crie um ato quando sua estrutura estiver clara; seus capítulos continuam disponíveis ao lado.</p></div>}</div>
      <aside className="surface-card chapter-pool"><h2>Capítulos do manuscrito</h2><p>Associe cada capítulo ao ato que melhor representa sua função atual.</p>{chapters.map(chapter => <details key={chapter.id}><summary className={assignedIds.has(chapter.id) ? 'is-assigned' : ''}>{chapter.title}</summary><div>{acts.map(act => <label key={act.id}><input type="checkbox" checked={act.sceneIds.includes(chapter.id)} onChange={() => void toggleChapter(act, chapter.id)} />{act.name}</label>)}</div></details>)}{!chapters.length && <p className="muted">Crie capítulos no editor para começar.</p>}</aside>
    </section></main>;
}
