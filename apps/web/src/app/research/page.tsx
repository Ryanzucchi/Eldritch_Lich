'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Manuscript, ResearchNote } from '@eldritch/domain';
import { db } from '../../db/schema';
import { useApp } from '../../context/AppContext';
import './research.css';

export default function ResearchPage() {
  const { activeProject } = useApp();
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [chapters, setChapters] = useState<Manuscript[]>([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<ResearchNote | null>(null);
  const [title, setTitle] = useState(''); const [content, setContent] = useState(''); const [tags, setTags] = useState('');

  const load = async () => { if (!activeProject) return; const [storedNotes, manuscripts] = await Promise.all([db.researchNotes.where('projectId').equals(activeProject.id).toArray(), db.manuscripts.toArray()]); setNotes(storedNotes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))); setChapters(manuscripts.filter(manuscript => manuscript.projectId === activeProject.id && !manuscript.inTrash)); };
  useEffect(() => { void load(); }, [activeProject?.id]);
  const filtered = useMemo(() => notes.filter(note => `${note.title} ${note.content} ${note.tags.join(' ')}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [notes, query]);
  const begin = (note?: ResearchNote) => { setEditing(note ?? { id: '', projectId: activeProject?.id ?? '', title: '', content: '', tags: [], createdAt: '', updatedAt: '' }); setTitle(note?.title ?? ''); setContent(note?.content ?? ''); setTags(note?.tags.join(', ') ?? ''); };
  const save = async (event: FormEvent) => { event.preventDefault(); if (!activeProject || !editing || !title.trim()) return; const now = new Date().toISOString(); await db.researchNotes.put({ ...editing, id: editing.id || crypto.randomUUID(), projectId: activeProject.id, title: title.trim(), content: content.trim(), tags: tags.split(',').map(tag => tag.trim()).filter(Boolean), createdAt: editing.createdAt || now, updatedAt: now }); setEditing(null); await load(); };
  const remove = async (note: ResearchNote) => { if (!confirm(`Excluir a nota “${note.title}”?`)) return; await db.researchNotes.delete(note.id); await load(); };

  return <main className="page research-page"><header className="page-heading"><div><p className="eyebrow">Pesquisa e análise</p><h1>Notas de pesquisa</h1><p>Ideias, fontes e decisões ligadas ao manuscrito — sem sair do seu projeto.</p></div><button className="primary-button" onClick={() => begin()}>Nova nota</button></header>
    <section className="surface-card research-context"><div><strong>{chapters.length} capítulos disponíveis</strong><p>{chapters.length ? `Use [[${chapters[0].title}]] para registrar uma ligação textual.` : 'Crie um capítulo no editor para começar a conectar pesquisa e história.'}</p></div><div>{chapters.slice(0, 3).map(chapter => <span key={chapter.id}>{chapter.title}</span>)}</div></section>
    {editing && <form className="surface-card research-form" onSubmit={save}><label>Título<input autoFocus value={title} onChange={event => setTitle(event.target.value)} placeholder="Uma ideia por nota" /></label><label>Nota<textarea value={content} onChange={event => setContent(event.target.value)} rows={7} placeholder="Fatos de mundo, fontes, hipóteses ou decisões narrativas." /></label><label>Etiquetas<input value={tags} onChange={event => setTags(event.target.value)} placeholder="ex.: navegação, cultura, capítulo 3" /></label><div><button type="button" className="secondary-button" onClick={() => setEditing(null)}>Cancelar</button><button className="primary-button">Salvar nota</button></div></form>}
    <section className="research-list"><div className="research-list-heading"><h2>Seu acervo</h2><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar notas" aria-label="Buscar notas" /></div>{filtered.map(note => <article className="surface-card research-note" key={note.id}><div><h3>{note.title}</h3><p>{note.content || 'Sem conteúdo.'}</p><footer>{note.tags.map(tag => <span key={tag}>{tag}</span>)}</footer></div><aside><button type="button" onClick={() => begin(note)}>Editar</button><button type="button" onClick={() => void remove(note)}>Excluir</button></aside></article>)}{!filtered.length && <div className="empty-state"><h2>Nenhuma nota encontrada.</h2><p>Guarde uma pesquisa ou uma decisão que possa ser útil enquanto escreve.</p></div>}</section>
  </main>;
}
