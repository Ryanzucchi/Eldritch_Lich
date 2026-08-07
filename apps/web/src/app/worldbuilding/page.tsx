'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CharacterSheet, FamilyKinship, FamilyRelation } from '@eldritch/domain';
import { db, WikiEntity } from '../../db/schema';
import { useApp } from '../../context/AppContext';
import './worldbuilding.css';

const TYPES: WikiEntity['type'][] = ['Personagem', 'Local', 'Item', 'Organizacao', 'Criatura'];
const KINSHIPS: FamilyKinship[] = ['PAI', 'MAE', 'FILHO', 'CONJUGE', 'IRMAO'];
const relationLabel: Record<FamilyKinship, string> = { PAI: 'pai de', MAE: 'mãe de', FILHO: 'filho de', CONJUGE: 'cônjuge de', IRMAO: 'irmão(ã) de' };

function FamilyGraph({ characters, relations, rootId, onSelect }: { characters: CharacterSheet[]; relations: FamilyRelation[]; rootId: string; onSelect: (id: string) => void }) {
  const root = characters.find(character => character.id === rootId) ?? characters[0];
  if (!root) return null;
  const connectedIds = new Set([root.id]);
  relations.forEach(relation => { if (relation.personId === root.id) connectedIds.add(relation.relatedPersonId); if (relation.relatedPersonId === root.id) connectedIds.add(relation.personId); });
  const nodes = characters.filter(character => connectedIds.has(character.id)).slice(0, 9);
  const position = (id: string, index: number) => id === root.id ? { x: 300, y: 135 } : { x: 80 + (index * 137) % 440, y: index % 2 ? 235 : 42 };
  const nodePosition = new Map(nodes.map((node, index) => [node.id, position(node.id, index)]));
  const visibleRelations = relations.filter(relation => nodePosition.has(relation.personId) && nodePosition.has(relation.relatedPersonId));
  return <svg className="family-graph" viewBox="0 0 600 280" role="img" aria-label={`Relações familiares de ${root.name}`}>
    {visibleRelations.map(relation => { const source = nodePosition.get(relation.personId)!; const target = nodePosition.get(relation.relatedPersonId)!; return <g key={relation.id}><line x1={source.x} y1={source.y} x2={target.x} y2={target.y} /><text x={(source.x + target.x) / 2} y={(source.y + target.y) / 2 - 6}>{relationLabel[relation.relationType]}</text></g>; })}
    {nodes.map((node, index) => { const point = nodePosition.get(node.id) ?? position(node.id, index); return <g className={node.id === root.id ? 'is-root' : ''} key={node.id} onClick={() => onSelect(node.id)} tabIndex={0} role="button"><circle cx={point.x} cy={point.y} r="34" /><text x={point.x} y={point.y + 4}>{node.name.slice(0, 12)}</text></g>; })}
  </svg>;
}

export default function WorldbuildingPage() {
  const { activeProject } = useApp();
  const [entities, setEntities] = useState<WikiEntity[]>([]);
  const [characters, setCharacters] = useState<CharacterSheet[]>([]);
  const [relations, setRelations] = useState<FamilyRelation[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<WikiEntity['type'] | 'Todos'>('Todos');
  const [tab, setTab] = useState<'fichas' | 'genealogia'>('fichas');
  const [name, setName] = useState(''); const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false); const [selected, setSelected] = useState<WikiEntity | null>(null);
  const [rootId, setRootId] = useState(''); const [subjectId, setSubjectId] = useState(''); const [targetId, setTargetId] = useState(''); const [kinship, setKinship] = useState<FamilyKinship>('FILHO');

  const load = async () => { if (!activeProject) return; const [nextEntities, nextCharacters, nextRelations] = await Promise.all([db.wikiEntities.where('projectId').equals(activeProject.id).toArray(), db.characterSheets.where('projectId').equals(activeProject.id).toArray(), db.familyRelations.where('projectId').equals(activeProject.id).toArray()]); setEntities(nextEntities); setCharacters(nextCharacters); setRelations(nextRelations); setRootId(current => nextCharacters.some(character => character.id === current) ? current : nextCharacters[0]?.id ?? ''); };
  useEffect(() => { void load(); }, [activeProject?.id]);
  const filtered = useMemo(() => entities.filter(entity => (type === 'Todos' || entity.type === type) && `${entity.name} ${entity.description}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [entities, query, type]);
  const create = async (event: FormEvent) => { event.preventDefault(); if (!activeProject || !name.trim()) return; const now = new Date().toISOString(); const entity: WikiEntity = { id: crypto.randomUUID(), projectId: activeProject.id, name: name.trim(), type: type === 'Todos' ? 'Personagem' : type, description: description.trim(), content: description.trim(), isConfidential: false, createdAt: now, updatedAt: now }; await db.wikiEntities.put(entity); if (entity.type === 'Personagem' && !characters.some(character => character.name.toLocaleLowerCase() === entity.name.toLocaleLowerCase())) await db.characterSheets.put({ id: crypto.randomUUID(), projectId: activeProject.id, name: entity.name, role: 'SECUNDARIO', biography: entity.description, createdAt: now, updatedAt: now }); setName(''); setDescription(''); setCreating(false); setSelected(entity); await load(); };
  const remove = async (entity: WikiEntity) => { if (!confirm(`Excluir “${entity.name}”?`)) return; await db.wikiEntities.delete(entity.id); const matching = characters.filter(character => character.name.toLocaleLowerCase() === entity.name.toLocaleLowerCase()); await Promise.all(matching.flatMap(character => [db.characterSheets.delete(character.id), ...relations.filter(relation => relation.personId === character.id || relation.relatedPersonId === character.id).map(relation => db.familyRelations.delete(relation.id))])); if (selected?.id === entity.id) setSelected(null); await load(); };
  const addRelation = async (event: FormEvent) => { event.preventDefault(); if (!activeProject || !subjectId || !targetId || subjectId === targetId || relations.some(relation => relation.personId === subjectId && relation.relatedPersonId === targetId && relation.relationType === kinship)) return; await db.familyRelations.put({ id: crypto.randomUUID(), projectId: activeProject.id, personId: subjectId, relatedPersonId: targetId, relationType: kinship }); setTargetId(''); await load(); };
  const characterName = (id: string) => characters.find(character => character.id === id)?.name ?? 'Personagem removido';

  return <main className="page universe-page">
    <header className="page-heading"><div><p className="eyebrow">Universo</p><h1>Referências da história</h1><p>Fichas e relações que crescem a partir do manuscrito.</p></div>{tab === 'fichas' && <button className="primary-button" onClick={() => setCreating(true)}>Nova ficha</button>}</header>
    <nav className="universe-tabs" aria-label="Visões do universo"><button className={tab === 'fichas' ? 'is-active' : ''} onClick={() => setTab('fichas')}>Fichas</button><button className={tab === 'genealogia' ? 'is-active' : ''} onClick={() => setTab('genealogia')}>Árvore genealógica <span>{relations.length}</span></button></nav>
    {tab === 'fichas' ? <>
      <section className="lore-toolbar surface-card"><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar no universo" aria-label="Buscar fichas" /><div>{['Todos', ...TYPES].map(option => <button key={option} className={type === option ? 'is-active' : ''} onClick={() => setType(option as typeof type)}>{option}</button>)}</div></section>
      {creating && <form className="surface-card lore-form" onSubmit={create}><label>Nome<input value={name} onChange={event => setName(event.target.value)} autoFocus required /></label><label>Tipo<select value={type === 'Todos' ? 'Personagem' : type} onChange={event => setType(event.target.value as WikiEntity['type'])}>{TYPES.map(option => <option key={option}>{option}</option>)}</select></label><label>O que é importante saber?<textarea value={description} onChange={event => setDescription(event.target.value)} placeholder="Traços, relações, regras ou fatos que não podem mudar." /></label><div><button className="secondary-button" type="button" onClick={() => setCreating(false)}>Cancelar</button><button className="primary-button">Salvar ficha</button></div></form>}
      <section className="lore-layout"><div className="lore-grid">{filtered.map(entity => <button className={`lore-card ${selected?.id === entity.id ? 'is-active' : ''}`} key={entity.id} onClick={() => setSelected(entity)}><small>{entity.type}</small><strong>{entity.name}</strong><span>{entity.description || 'Sem resumo ainda.'}</span></button>)}{!filtered.length && <p className="empty-state">Nenhuma ficha encontrada. Analise um capítulo ou crie uma referência.</p>}</div><aside className="lore-detail surface-card">{selected ? <><small>{selected.type}</small><h2>{selected.name}</h2><p>{selected.description || 'Sem descrição.'}</p><button className="secondary-button destructive-button" onClick={() => void remove(selected)}>Excluir ficha</button></> : <p>Selecione uma ficha para consultar seus detalhes.</p>}</aside></section>
    </> : <section className="genealogy-layout"><section className="surface-card family-canvas"><div className="family-heading"><div><h2>Família e vínculos</h2><p>Relações detectadas no manuscrito aparecem aqui depois da sua aprovação.</p></div><select value={rootId} onChange={event => setRootId(event.target.value)} aria-label="Pessoa central">{characters.map(character => <option key={character.id} value={character.id}>{character.name}</option>)}</select></div>{characters.length ? <FamilyGraph characters={characters} relations={relations} rootId={rootId} onSelect={setRootId} /> : <div className="empty-state"><h2>Nenhum personagem ainda.</h2><p>Use “Analisar manuscrito” no editor ou crie uma ficha de personagem.</p></div>}</section><aside className="surface-card family-list"><h2>Adicionar vínculo</h2><form onSubmit={addRelation}><label>Pessoa<select value={subjectId} onChange={event => setSubjectId(event.target.value)} required><option value="">Selecionar</option>{characters.map(character => <option key={character.id} value={character.id}>{character.name}</option>)}</select></label><label>Relação<select value={kinship} onChange={event => setKinship(event.target.value as FamilyKinship)}>{KINSHIPS.map(item => <option key={item} value={item}>{relationLabel[item]}</option>)}</select></label><label>Com<select value={targetId} onChange={event => setTargetId(event.target.value)} required><option value="">Selecionar</option>{characters.filter(character => character.id !== subjectId).map(character => <option key={character.id} value={character.id}>{character.name}</option>)}</select></label><button className="primary-button">Adicionar</button></form><div className="family-relations">{relations.map(relation => <p key={relation.id}><strong>{characterName(relation.personId)}</strong> {relationLabel[relation.relationType]} <strong>{characterName(relation.relatedPersonId)}</strong></p>)}{!relations.length && <p className="muted">Ainda não há vínculos confirmados.</p>}</div></aside></section>}
  </main>;
}
