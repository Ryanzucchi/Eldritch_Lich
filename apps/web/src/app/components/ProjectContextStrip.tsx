'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '../../db/schema';
import { useApp } from '../../context/AppContext';
import styles from './ProjectContextStrip.module.css';

type ContextSnapshot = { chapters: number; words: number; entities: number; events: number; latestTitle: string | null };
const emptySnapshot: ContextSnapshot = { chapters: 0, words: 0, entities: 0, events: 0, latestTitle: null };

export function ProjectContextStrip() {
  const { activeProject } = useApp();
  const [snapshot, setSnapshot] = useState<ContextSnapshot>(emptySnapshot);

  useEffect(() => {
    if (!activeProject) { setSnapshot(emptySnapshot); return; }
    const load = async () => {
      const [manuscripts, entities, timelines] = await Promise.all([db.manuscripts.toArray(), db.wikiEntities.where('projectId').equals(activeProject.id).toArray(), db.timelines.where('projectId').equals(activeProject.id).toArray()]);
      const projectManuscripts = manuscripts.filter(manuscript => manuscript.projectId === activeProject.id && !manuscript.inTrash);
      const eventLists = await Promise.all(timelines.map(timeline => db.timelineEvents.where('timelineId').equals(timeline.id).toArray()));
      const words = projectManuscripts.reduce((total, manuscript) => total + manuscript.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length, 0);
      const latestTitle = [...projectManuscripts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]?.title ?? null;
      setSnapshot({ chapters: projectManuscripts.length, words, entities: entities.length, events: eventLists.flat().length, latestTitle });
    };
    void load();
  }, [activeProject?.id]);

  return <section className={styles.strip} aria-label="Contexto do manuscrito"><div className={styles.current}><span>Contexto do manuscrito</span><strong>{snapshot.latestTitle ?? 'Nenhum capítulo criado'}</strong></div><div className={styles.metrics}><span><strong>{snapshot.chapters}</strong> capítulos</span><span><strong>{snapshot.words.toLocaleString('pt-BR')}</strong> palavras</span><span><strong>{snapshot.entities}</strong> referências</span><span><strong>{snapshot.events}</strong> eventos</span></div><Link href="/editor">Abrir manuscrito</Link></section>;
}
