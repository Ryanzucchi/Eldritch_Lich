'use client';

import { useEffect, useMemo, useState } from 'react';
import { Manuscript } from '@eldritch/domain';
import { db } from '../../db/schema';
import { useApp } from '../../context/AppContext';
import './nlp.css';

const wordsOf = (content: string) => content.replace(/<[^>]*>/g, ' ').toLocaleLowerCase('pt-BR').match(/[\p{L}]{4,}/gu) ?? [];
const ignored = new Set(['para', 'como', 'mais', 'sobre', 'entre', 'quando', 'porque', 'ainda', 'muito', 'essa', 'esse', 'esta', 'este', 'pela', 'pelo', 'também']);

export default function AnalysisPage() {
  const { activeProject } = useApp();
  const [chapters, setChapters] = useState<Manuscript[]>([]);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => { const load = async () => { if (!activeProject) return; const records = (await db.manuscripts.toArray()).filter(manuscript => manuscript.projectId === activeProject.id && !manuscript.inTrash).sort((a, b) => a.createdAt.localeCompare(b.createdAt)); setChapters(records); setSelectedId(current => records.some(item => item.id === current) ? current : records[0]?.id ?? ''); }; void load(); }, [activeProject?.id]);
  const result = useMemo(() => { const chapter = chapters.find(item => item.id === selectedId); const text = chapter?.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() ?? ''; const words = wordsOf(text); const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? []; const frequency = new Map<string, number>(); words.forEach(word => { if (!ignored.has(word)) frequency.set(word, (frequency.get(word) ?? 0) + 1); }); const keywords = [...frequency].sort((a, b) => b[1] - a[1]).slice(0, 10); const longSentences = sentences.filter(sentence => wordsOf(sentence).length > 35).length; return { chapter, words: words.length, sentences: sentences.length, average: sentences.length ? words.length / sentences.length : 0, keywords, longSentences }; }, [chapters, selectedId]);
  return <main className="page analysis-page"><header className="page-heading"><div><p className="eyebrow">Pesquisa e análise</p><h1>Leitura do manuscrito</h1><p>Métricas locais de um capítulo real para apoiar revisão, sem inventar diagnósticos por IA.</p></div></header>
    <section className="surface-card analysis-picker"><label>Capítulo<select value={selectedId} onChange={event => setSelectedId(event.target.value)}>{chapters.map(chapter => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}</select></label>{result.chapter && <span>Última edição: {new Date(result.chapter.updatedAt).toLocaleDateString('pt-BR')}</span>}</section>
    {!result.chapter ? <div className="empty-state"><h2>Nenhum capítulo para analisar.</h2><p>Escreva ou importe um capítulo no editor.</p></div> : <><section className="analysis-metrics"><article className="surface-card"><strong>{result.words.toLocaleString('pt-BR')}</strong><span>palavras</span></article><article className="surface-card"><strong>{result.sentences}</strong><span>frases</span></article><article className="surface-card"><strong>{result.average.toFixed(1)}</strong><span>palavras por frase</span></article><article className="surface-card"><strong>{result.longSentences}</strong><span>frases com mais de 35 palavras</span></article></section><section className="analysis-grid"><article className="surface-card"><h2>Vocabulário recorrente</h2><p>Termos de quatro ou mais letras, excluindo palavras comuns.</p><div className="keyword-list">{result.keywords.map(([word, count]) => <span key={word}>{word}<strong>{count}</strong></span>)}</div></article><article className="surface-card"><h2>Leitura editorial</h2><p>{result.longSentences === 0 ? 'O capítulo não tem frases muito extensas pelo critério atual.' : `${result.longSentences} frase(s) extensa(s) merecem uma revisão de ritmo.`}</p><p>A métrica não é uma regra de estilo: ela apenas mostra trechos que podem pedir atenção durante sua própria revisão.</p></article></section></>}
  </main>;
}
