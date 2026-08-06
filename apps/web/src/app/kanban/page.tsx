'use client';

import './kanban.css';

import { useEffect, useState } from 'react';
import { MetaEdge, MetaNode, MetaStatus, propagateStatus } from '@eldritch/domain';
import { db } from '../../db/schema';

const COLUMNS: Array<{ id: MetaStatus; label: string; hint: string }> = [
  { id: 'PENDENTE', label: 'A planejar', hint: 'Ideias e cenas ainda abertas' },
  { id: 'EM_ANDAMENTO', label: 'Em escrita', hint: 'O que está no foco agora' },
  { id: 'CONCLUIDO', label: 'Concluído', hint: 'Partes confirmadas do texto' },
];

export default function KanbanPage() {
  const [nodes, setNodes] = useState<MetaNode[]>([]);
  const [edges, setEdges] = useState<MetaEdge[]>([]);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const load = async () => { setNodes(await db.metaNodes.toArray()); setEdges(await db.metaEdges.toArray()); };
  useEffect(() => { void load(); }, []);

  const move = async (node: MetaNode, status: MetaStatus) => {
    const candidate = nodes.map(item => item.id === node.id ? { ...item, status, updatedAt: new Date().toISOString() } : item);
    const result = propagateStatus(candidate, edges);
    await Promise.all(result.updatedNodes.map(item => db.metaNodes.put(item)));
    setNodes(result.updatedNodes);
  };

  const remove = async (node: MetaNode) => {
    if (!confirm(`Apagar “${node.title}” e suas dependências?`)) return;
    const linkedEdges = edges.filter(edge => edge.fromId === node.id || edge.toId === node.id);
    await Promise.all([db.metaNodes.delete(node.id), ...linkedEdges.map(edge => db.metaEdges.delete(edge.id))]);
    setNodes(current => current.filter(item => item.id !== node.id));
    setEdges(current => current.filter(edge => edge.fromId !== node.id && edge.toId !== node.id));
  };

  const add = async () => {
    if (!title.trim()) return;
    const now = new Date().toISOString();
    const node: MetaNode = { id: crypto.randomUUID(), title: title.trim(), description: description.trim() || 'Sem descrição.', type: 'Conflito', relatedEntities: [], similarityThreshold: 0.72, status: 'PENDENTE', updatedAt: now };
    await db.metaNodes.put(node); setNodes(current => [...current, node]); setTitle(''); setDescription(''); setCreating(false);
  };

  return <main className="page">
    <header className="page-heading"><div><h1>Planejamento</h1><p>Organize o que precisa ser escrito sem separar o plano da história.</p></div><button className="primary-button" onClick={() => setCreating(true)}>Nova cena ou meta</button></header>
    {creating && <section className="panel planning-form"><label>Título<input value={title} onChange={event => setTitle(event.target.value)} autoFocus placeholder="Ex.: A descoberta do mapa" /></label><label>Contexto<textarea value={description} onChange={event => setDescription(event.target.value)} placeholder="O que precisa acontecer nesta cena?" /></label><div><button className="secondary-button" onClick={() => setCreating(false)}>Cancelar</button><button className="primary-button" onClick={add}>Adicionar</button></div></section>}
    <section className="planning-board">{COLUMNS.map((column, index) => { const cards = nodes.filter(node => node.status === column.id || (node.status === 'INCONSISTENTE' && index === 0)); return <div className="planning-column" key={column.id}><header><h2>{column.label}</h2><span>{cards.length}</span><p>{column.hint}</p></header><div>{cards.map(node => <article className={`planning-card ${node.status === 'INCONSISTENTE' ? 'has-warning' : ''}`} key={node.id}><small>{node.type}{node.status === 'INCONSISTENTE' ? ' · requer revisão' : ''}</small><h3>{node.title}</h3><p>{node.description}</p><footer>{index > 0 && <button onClick={() => void move(node, COLUMNS[index - 1].id)}>Voltar</button>}{index < COLUMNS.length - 1 && <button className="text-button" onClick={() => void move(node, COLUMNS[index + 1].id)}>Avançar</button>}<button className="delete-planning-card" onClick={() => void remove(node)}>Apagar</button></footer></article>)}{!cards.length && <p className="column-empty">Nada por aqui.</p>}</div></div>; })}</section>
  </main>;
}
