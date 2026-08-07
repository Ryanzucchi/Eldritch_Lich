'use client';

import './extraction.css';
import './organization.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Manuscript } from '@eldritch/domain';
import { db, ExtractionCandidate } from '../../db/schema';
import { useApp } from '../../context/AppContext';
import { EXTRACTION_HEURISTIC_VERSION, ExtractedSuggestion, extractManuscriptSuggestions, normalizeImportedManuscript, prepareManuscriptForExtraction, toTimelineEvent } from '../../services/manuscript-extraction';

const emptyDocument = '<p></p>';
const textAsDocument = (text: string) => text.split(/\n{2,}/).map(paragraph => paragraph.trim()).filter(Boolean).map(paragraph => `<p>${paragraph.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('') || emptyDocument;
const suggestionLabel = (suggestion: ExtractedSuggestion) => {
  if (suggestion.kind === 'entity') return suggestion.name;
  if (suggestion.kind === 'relation') return `${suggestion.subject} — ${suggestion.relation.toLowerCase()} de — ${suggestion.target}`;
  return suggestion.title;
};
const suggestionTypeLabel = (suggestion: ExtractedSuggestion) => suggestion.kind === 'entity' ? suggestion.type : suggestion.kind === 'event' ? 'Evento' : suggestion.kind === 'relation' ? 'Relação' : 'Capítulo';

type DocumentStatusFilter = 'TODOS' | 'RASCUNHO' | 'REVISAO' | 'FINALIZADO';
type DocumentSort = 'ESTRUTURA' | 'RECENTES' | 'TITULO';
type ReviewedSuggestion = ExtractedSuggestion & { sourceManuscriptId?: string; sourceManuscriptTitle?: string };

const romanToNumber = (value: string) => {
  const symbols: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  return value.toUpperCase().split('').reduce((total, symbol, index, values) => {
    const current = symbols[symbol] ?? 0;
    const next = symbols[values[index + 1]] ?? 0;
    return total + (current < next ? -current : current);
  }, 0);
};

const manuscriptStructure = (document: Manuscript) => {
  const title = document.title.trim();
  const bookMatch = title.match(/^(.*?)(?:\s+—\s+|\s+-\s+)cap[ií]tulo\s+([ivxlcdm]+|\d+)/i);
  const bookNumberMatch = title.match(/livro\s+([ivxlcdm]+|\d+)/i);
  const chapterNumber = bookMatch?.[2] ? (/^\d+$/.test(bookMatch[2]) ? Number(bookMatch[2]) : romanToNumber(bookMatch[2])) : Number.MAX_SAFE_INTEGER;
  const bookNumber = bookNumberMatch?.[1] ? (/^\d+$/.test(bookNumberMatch[1]) ? Number(bookNumberMatch[1]) : romanToNumber(bookNumberMatch[1])) : Number.MAX_SAFE_INTEGER;
  const normalized = title.toLocaleLowerCase('pt-BR');
  const openingOrder = normalized.startsWith('prefácio') || normalized.startsWith('prefacio') ? -2 : normalized.startsWith('prólogo') || normalized.startsWith('prologo') ? -1 : bookNumber;
  return { group: bookMatch?.[1]?.trim() || (openingOrder < 0 ? 'Material inicial' : 'Outros manuscritos'), bookNumber: openingOrder, chapterNumber };
};

export default function EditorWorkspace() {
  const { activeProject } = useApp();
  const [documents, setDocuments] = useState<Manuscript[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'RASCUNHO' | 'REVISAO' | 'FINALIZADO'>('RASCUNHO');
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'offline'>('saved');
  const [ready, setReady] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [suggestions, setSuggestions] = useState<ReviewedSuggestion[]>([]);
  const [selectedSuggestionFingerprints, setSelectedSuggestionFingerprints] = useState<Set<string>>(new Set());
  const [analysisNotices, setAnalysisNotices] = useState<string[]>([]);
  const [isApplyingSuggestions, setIsApplyingSuggestions] = useState(false);
  const [isAnalyzingManuscripts, setIsAnalyzingManuscripts] = useState(false);
  const [documentQuery, setDocumentQuery] = useState('');
  const [documentStatusFilter, setDocumentStatusFilter] = useState<DocumentStatusFilter>('TODOS');
  const [documentSort, setDocumentSort] = useState<DocumentSort>('ESTRUTURA');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const saveTimer = useRef<number | null>(null);

  const activeDocument = useMemo(() => documents.find(document => document.id === activeId) ?? null, [activeId, documents]);
  const editor = useEditor({
    extensions: [StarterKit], content: emptyDocument, immediatelyRender: false,
    editorProps: {
      attributes: { class: 'document-prose', 'aria-label': 'Conteúdo do manuscrito' },
      handlePaste: (_view, event) => {
        const pastedText = event.clipboardData?.getData('text/plain') ?? '';
        if (/(?:^|\n)\s*(?:cap[ií]tulo|chapter)\s+(?:\d+|[ivxlcdm]+)/im.test(pastedText)) {
          window.setTimeout(() => {
            const next = extractManuscriptSuggestions(pastedText);
            setSuggestions(next);
            setSelectedSuggestionFingerprints(new Set(next.map(item => item.fingerprint)));
          }, 0);
        }
        return false;
      }
    }
  });

  const loadDocuments = async () => {
    if (!activeProject) return;
    const local = await db.manuscripts.toArray();
    try {
      const response = await fetch(`/api/manuscripts?projectId=${encodeURIComponent(activeProject.id)}`);
      if (response.ok) {
        const data = await response.json();
        await Promise.all((data.manuscripts ?? []).map((remote: Manuscript) => db.manuscripts.put(remote)));
      }
    } catch { setSaveState('offline'); }
    const records = (await db.manuscripts.toArray()).filter(document => document.projectId === activeProject.id && !document.inTrash).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const localProjectDocuments = local.filter(document => document.projectId === activeProject.id && !document.inTrash);
    setDocuments(records.length ? records : localProjectDocuments);
    const first = records[0] ?? localProjectDocuments[0] ?? null;
    if (first) selectDocument(first);
    setReady(true);
  };

  const selectDocument = (document: Manuscript) => {
    setActiveId(document.id); setTitle(document.title); setStatus(document.status);
    editor?.commands.setContent(document.content || emptyDocument, false);
    setWordCount(document.content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length);
  };

  useEffect(() => { if (editor && activeProject) loadDocuments(); }, [activeProject?.id, editor]);

  const organizedDocuments = useMemo(() => {
    const query = documentQuery.trim().toLocaleLowerCase('pt-BR');
    const filtered = documents.filter(document => {
      const matchesText = !query || document.title.toLocaleLowerCase('pt-BR').includes(query);
      const matchesStatus = documentStatusFilter === 'TODOS' || document.status === documentStatusFilter;
      return matchesText && matchesStatus;
    });
    return [...filtered].sort((left, right) => {
      if (documentSort === 'RECENTES') return right.updatedAt.localeCompare(left.updatedAt);
      if (documentSort === 'TITULO') return left.title.localeCompare(right.title, 'pt-BR', { numeric: true });
      const leftStructure = manuscriptStructure(left);
      const rightStructure = manuscriptStructure(right);
      return leftStructure.bookNumber - rightStructure.bookNumber || leftStructure.group.localeCompare(rightStructure.group, 'pt-BR') || leftStructure.chapterNumber - rightStructure.chapterNumber || left.title.localeCompare(right.title, 'pt-BR', { numeric: true });
    });
  }, [documents, documentQuery, documentSort, documentStatusFilter]);

  const documentGroups = useMemo(() => {
    const groups = new Map<string, Manuscript[]>();
    for (const document of organizedDocuments) {
      const group = documentSort === 'ESTRUTURA' ? manuscriptStructure(document).group : 'Resultados';
      groups.set(group, [...(groups.get(group) ?? []), document]);
    }
    return [...groups.entries()];
  }, [documentSort, organizedDocuments]);

  const toggleGroup = (group: string) => setCollapsedGroups(current => {
    const next = new Set(current);
    if (next.has(group)) next.delete(group); else next.add(group);
    return next;
  });

  const persist = async (next: Manuscript) => {
    await db.manuscripts.put(next);
    setDocuments(current => [next, ...current.filter(document => document.id !== next.id)]);
    setSaveState('saving');
    try {
      const response = await fetch('/api/manuscripts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ manuscript: next }) });
      if (!response.ok) throw new Error('save failed');
      setSaveState('saved');
    } catch { setSaveState('offline'); }
  };

  const saveCurrent = async (changes: Partial<Manuscript> = {}) => {
    if (!activeDocument || !editor) return;
    const next = { ...activeDocument, ...changes, title: changes.title ?? title, status: changes.status ?? status, content: editor.getHTML(), updatedAt: new Date().toISOString() };
    await persist(next);
  };

  useEffect(() => {
    if (!editor || !activeDocument) return;
    const onUpdate = () => {
      setWordCount(editor.getText().trim().split(/\s+/).filter(Boolean).length);
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => { void saveCurrent(); }, 650);
    };
    editor.on('update', onUpdate);
    return () => { editor.off('update', onUpdate); if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [editor, activeDocument?.id, title, status]);

  const createDocument = async () => {
    if (!activeProject) return;
    const now = new Date().toISOString();
    const document: Manuscript = { id: crypto.randomUUID(), projectId: activeProject.id, title: `Capítulo ${documents.length + 1}`, content: '<p>Comece a escrever.</p>', status: 'RASCUNHO', isLocked: false, createdAt: now, updatedAt: now };
    await persist(document); selectDocument(document); editor?.commands.setContent(document.content, false);
  };

  const deleteCurrentDocument = async () => {
    if (!activeDocument) return;
    const confirmed = window.confirm(`Excluir “${activeDocument.title}”? O capítulo será movido para a lixeira.`);
    if (!confirmed) return;
    const now = new Date().toISOString();
    const trashed = { ...activeDocument, inTrash: true, deletedAt: now, updatedAt: now };
    const remaining = documents.filter(document => document.id !== activeDocument.id);
    await db.manuscripts.put(trashed);
    setDocuments(remaining);
    const nextDocument = remaining[0] ?? null;
    if (nextDocument) selectDocument(nextDocument);
    else {
      setActiveId(null);
      setTitle('');
      editor?.commands.setContent(emptyDocument, false);
      setWordCount(0);
    }
    setSaveState('saving');
    try {
      const response = await fetch('/api/manuscripts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ manuscript: trashed }) });
      if (!response.ok) throw new Error('delete failed');
      setSaveState('saved');
    } catch { setSaveState('offline'); }
  };

  const analyzeProjectManuscripts = async () => {
    if (!activeProject) return;
    setIsAnalyzingManuscripts(true);
    try {
      const notices: string[] = [];
      const extracted = documents.flatMap(document => {
        const content = document.id === activeDocument?.id && editor ? editor.getHTML() : document.content;
        const readiness = prepareManuscriptForExtraction(content);
        if (!readiness.ready) {
          notices.push(`${document.title}: ${readiness.reason}`);
          return [];
        }
        const isFrontMatter = /^(pref[aá]cio|pr[oó]logo)$/i.test(document.title.trim());
        return extractManuscriptSuggestions(content, { manuscriptId: document.id, isNarrativeSource: !isFrontMatter }).map(suggestion => ({ ...suggestion, sourceManuscriptId: document.id, sourceManuscriptTitle: document.title }));
      });
      const next: ReviewedSuggestion[] = [];
      const now = new Date().toISOString();
      const candidates: ExtractionCandidate[] = [];
      for (const suggestion of extracted) {
        const existing = await db.extractionCandidates.where('fingerprint').equals(suggestion.fingerprint).first();
        if (existing) continue;
        candidates.push({ id: crypto.randomUUID(), projectId: activeProject.id, manuscriptId: suggestion.sourceManuscriptId, fingerprint: suggestion.fingerprint, kind: suggestion.kind, confidence: suggestion.confidence, heuristicVersion: EXTRACTION_HEURISTIC_VERSION, payload: JSON.stringify(suggestion), status: 'PENDING', createdAt: now });
        next.push(suggestion);
      }
      if (candidates.length) {
        await db.extractionCandidates.bulkPut(candidates);
        await db.automationHistories.bulkPut(next.map(suggestion => ({ id: crypto.randomUUID(), projectId: activeProject.id, source: 'MANUSCRIPT_EXTRACTION' as const, kind: suggestion.kind, summary: `${suggestionTypeLabel(suggestion)} candidato (${Math.round(suggestion.confidence * 100)}%): ${suggestionLabel(suggestion)}`, payload: JSON.stringify(suggestion), manuscriptId: suggestion.sourceManuscriptId, status: 'DETECTED' as const, createdAt: now })));
      }
      setSuggestions(next);
      setSelectedSuggestionFingerprints(new Set(next.map(item => item.fingerprint)));
      setAnalysisNotices(notices);
    } finally { setIsAnalyzingManuscripts(false); }
  };

  const normalizeCurrentImport = async () => {
    if (!activeDocument || !editor) return;
    const raw = editor.getHTML();
    const normalized = normalizeImportedManuscript(raw);
    if (normalized === raw) {
      setAnalysisNotices(['O capítulo atual não possui uma normalização de importação pendente.']);
      return;
    }
    editor.commands.setContent(normalized, false);
    await persist({ ...activeDocument, content: normalized, updatedAt: new Date().toISOString() });
    setAnalysisNotices(['Importação normalizada e salva. Revise o capítulo antes de executar a análise.']);
  };

  const toggleSuggestion = (fingerprint: string) => setSelectedSuggestionFingerprints(current => {
    const next = new Set(current);
    if (next.has(fingerprint)) next.delete(fingerprint); else next.add(fingerprint);
    return next;
  });

  const applySuggestions = async () => {
    const approved = suggestions.filter(suggestion => selectedSuggestionFingerprints.has(suggestion.fingerprint));
    if (!activeProject || approved.length === 0) return;
    setIsApplyingSuggestions(true);
    const now = new Date().toISOString();
    try {
      const existingDocuments = (await db.manuscripts.toArray()).filter(document => document.projectId === activeProject.id);
      const documentTitles = new Set(existingDocuments.filter(document => !document.inTrash).map(document => document.title.trim().toLocaleLowerCase('pt-BR')));
      for (const suggestion of approved.filter((item): item is Extract<ReviewedSuggestion, { kind: 'chapter' }> => item.kind === 'chapter')) {
        const normalized = suggestion.title.toLocaleLowerCase('pt-BR');
        if (documentTitles.has(normalized)) continue;
        await db.manuscripts.put({ id: crypto.randomUUID(), projectId: activeProject.id, title: suggestion.title, content: textAsDocument(suggestion.content), status: 'RASCUNHO', isLocked: false, createdAt: now, updatedAt: now });
        documentTitles.add(normalized);
      }
      const existingEntities = await db.wikiEntities.where('projectId').equals(activeProject.id).toArray();
      const existingCharacters = await db.characterSheets.where('projectId').equals(activeProject.id).toArray();
      const existingLocations = await db.locationSheets.where('projectId').equals(activeProject.id).toArray();
      const existingItems = await db.itemSheets.where('projectId').equals(activeProject.id).toArray();
      const existingFactions = await db.factionSheets.where('projectId').equals(activeProject.id).toArray();
      const existingCreatures = await db.creatureSheets.where('projectId').equals(activeProject.id).toArray();
      const characters = new Map(existingCharacters.map(character => [character.name.trim().toLocaleLowerCase('pt-BR'), character]));
      const entityNames = new Set(existingEntities.map(entity => entity.name.trim().toLocaleLowerCase('pt-BR')));
      const locationNames = new Set(existingLocations.map(item => item.name.trim().toLocaleLowerCase('pt-BR')));
      const itemNames = new Set(existingItems.map(item => item.name.trim().toLocaleLowerCase('pt-BR')));
      const factionNames = new Set(existingFactions.map(item => item.name.trim().toLocaleLowerCase('pt-BR')));
      const creatureNames = new Set(existingCreatures.map(item => item.name.trim().toLocaleLowerCase('pt-BR')));

      const ensureEntity = async (suggestion: Extract<ReviewedSuggestion, { kind: 'entity' }>) => {
        const { name, type, excerpt, sourceManuscriptId: manuscriptId } = suggestion;
        const normalized = name.trim().toLocaleLowerCase('pt-BR');
        if (!entityNames.has(normalized)) {
          await db.wikiEntities.put({ id: crypto.randomUUID(), projectId: activeProject.id, name, type, description: `Candidato aprovado com evidência: ${excerpt}`, content: '', isConfidential: false, createdAt: now, updatedAt: now });
          entityNames.add(normalized);
        }
        if (type === 'Personagem') {
          const existing = characters.get(normalized);
          if (existing) {
            if (manuscriptId && !existing.mentionedInManuscriptIds?.includes(manuscriptId)) {
              const updated = { ...existing, mentionedInManuscriptIds: [...(existing.mentionedInManuscriptIds ?? []), manuscriptId], updatedAt: now };
              await db.characterSheets.put(updated);
              characters.set(normalized, updated);
              return updated;
            }
            return existing;
          }
          const character = { id: crypto.randomUUID(), projectId: activeProject.id, name, role: 'SECUNDARIO' as const, biography: `Candidato aprovado: ${excerpt}`, mentionedInManuscriptIds: manuscriptId ? [manuscriptId] : [], createdAt: now, updatedAt: now };
          await db.characterSheets.put(character);
          characters.set(normalized, character);
          return character;
        }
        if (type === 'Local' && !locationNames.has(normalized)) { await db.locationSheets.put({ id: crypto.randomUUID(), projectId: activeProject.id, name, type: 'Local', description: `Candidato aprovado: ${excerpt}`, createdAt: now, updatedAt: now }); locationNames.add(normalized); }
        if (type === 'Item' && !itemNames.has(normalized)) { await db.itemSheets.put({ id: crypto.randomUUID(), projectId: activeProject.id, name, properties: [], description: `Candidato aprovado: ${excerpt}`, createdAt: now, updatedAt: now }); itemNames.add(normalized); }
        if (type === 'Organizacao' && !factionNames.has(normalized)) { await db.factionSheets.put({ id: crypto.randomUUID(), projectId: activeProject.id, name, description: `Candidato aprovado: ${excerpt}`, createdAt: now, updatedAt: now }); factionNames.add(normalized); }
        if (type === 'Criatura' && !creatureNames.has(normalized)) { await db.creatureSheets.put({ id: crypto.randomUUID(), projectId: activeProject.id, name, abilities: [], description: `Candidato aprovado: ${excerpt}`, createdAt: now, updatedAt: now }); creatureNames.add(normalized); }
        return undefined;
      };

      const ensureTreePerson = async (name: string, excerpt: string, manuscriptId?: string) => ensureEntity({ kind: 'entity', name, type: 'Personagem', excerpt, confidence: 0.9, charStart: 0, charEnd: 0, fingerprint: `relation|${manuscriptId ?? ''}|${name}`, sourceManuscriptId: manuscriptId });

      for (const suggestion of approved.filter((item): item is Extract<ReviewedSuggestion, { kind: 'entity' }> => item.kind === 'entity')) {
        await ensureEntity(suggestion);
      }

      const existingTimelines = await db.timelines.where('projectId').equals(activeProject.id).toArray();
      const timeline = existingTimelines[0] ?? { id: crypto.randomUUID(), projectId: activeProject.id, name: 'Cronologia do manuscrito', description: 'Gerada a partir de fatos explícitos do texto.', calendarType: 'custom' as const, createdAt: now, updatedAt: now };
      if (!existingTimelines.length && approved.some(item => item.kind === 'event')) await db.timelines.put(timeline);
      const existingEvents = await db.timelineEvents.where('timelineId').equals(timeline.id).toArray();
      let sortOrder = existingEvents.length;
      for (const suggestion of approved.filter((item): item is Extract<ReviewedSuggestion, { kind: 'event' }> => item.kind === 'event')) {
        if (!existingEvents.some(event => event.title.toLocaleLowerCase('pt-BR') === suggestion.title.toLocaleLowerCase('pt-BR') && event.dateStr === suggestion.dateStr)) {
          await db.timelineEvents.put(toTimelineEvent(suggestion, timeline.id, sortOrder++));
        }
      }

      const existingRelations = await db.familyRelations.where('projectId').equals(activeProject.id).toArray();
      for (const suggestion of approved.filter((item): item is Extract<ReviewedSuggestion, { kind: 'relation' }> => item.kind === 'relation')) {
        const subject = await ensureTreePerson(suggestion.subject, suggestion.excerpt, suggestion.sourceManuscriptId);
        const target = await ensureTreePerson(suggestion.target, suggestion.excerpt, suggestion.sourceManuscriptId);
        if (!subject || !target || existingRelations.some(relation => relation.personId === subject.id && relation.relatedPersonId === target.id && relation.relationType === suggestion.relation)) continue;
        await db.familyRelations.put({ id: crypto.randomUUID(), projectId: activeProject.id, personId: subject.id, relatedPersonId: target.id, relationType: suggestion.relation });
      }
      setSuggestions([]);
      setSelectedSuggestionFingerprints(new Set());
      const candidates = await db.extractionCandidates.where('fingerprint').anyOf(approved.map(item => item.fingerprint)).toArray();
      await db.extractionCandidates.bulkPut(candidates.map(candidate => ({ ...candidate, status: 'APPROVED' as const, decidedAt: now })));
      await db.automationHistories.put({ id: crypto.randomUUID(), projectId: activeProject.id, source: 'MANUSCRIPT_EXTRACTION', kind: 'batch', summary: `${approved.length} sugestões revisadas e aplicadas ao projeto`, payload: JSON.stringify(approved), status: 'APPLIED', createdAt: now });
      const refreshedDocuments = (await db.manuscripts.toArray()).filter(document => document.projectId === activeProject.id && !document.inTrash).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      setDocuments(refreshedDocuments);
    } finally { setIsApplyingSuggestions(false); }
  };

  if (!ready) return <main className="page"><p className="empty-state">Abrindo os manuscritos…</p></main>;

  return <main className={`editor-screen ${focusMode ? 'is-focus-mode' : ''}`}>
    <aside className="document-list"><div className="document-list-header"><div><strong>Manuscritos</strong><small>{documents.length} capítulos</small></div><button type="button" className="primary-button" onClick={createDocument}>Novo</button></div><div className="document-organizer"><input className="document-search" type="search" value={documentQuery} onChange={event => setDocumentQuery(event.target.value)} placeholder="Buscar manuscrito" aria-label="Buscar manuscrito" /><div className="document-controls"><select value={documentStatusFilter} onChange={event => setDocumentStatusFilter(event.target.value as DocumentStatusFilter)} aria-label="Filtrar por estado"><option value="TODOS">Todos os estados</option><option value="RASCUNHO">Rascunhos</option><option value="REVISAO">Em revisão</option><option value="FINALIZADO">Finalizados</option></select><select value={documentSort} onChange={event => setDocumentSort(event.target.value as DocumentSort)} aria-label="Ordenar manuscritos"><option value="ESTRUTURA">Por estrutura</option><option value="RECENTES">Mais recentes</option><option value="TITULO">Por título</option></select></div><small>{organizedDocuments.length === documents.length ? 'Biblioteca organizada' : `${organizedDocuments.length} de ${documents.length} manuscritos`}</small></div><div className="document-list-items document-groups">{documentGroups.length ? documentGroups.map(([group, groupDocuments]) => <section className="document-group" key={group}><button type="button" className="document-group-title" onClick={() => toggleGroup(group)} aria-expanded={!collapsedGroups.has(group)}><span>{collapsedGroups.has(group) ? '›' : '⌄'}</span><strong>{group}</strong><small>{groupDocuments.length}</small></button>{!collapsedGroups.has(group) && <div className="document-group-items">{groupDocuments.map(document => <button type="button" key={document.id} className={document.id === activeId ? 'is-active' : ''} onClick={() => selectDocument(document)}><strong>{document.title.replace(/^.*?(?:\s+—\s+|\s+-\s+)(cap[ií]tulo\s+)/i, '$1')}</strong><small>{document.status.toLowerCase()} · {new Date(document.updatedAt).toLocaleDateString('pt-BR')}</small></button>)}</div>}</section>) : <p className="document-no-results">Nenhum manuscrito encontrado.</p>}</div></aside>
    <section className="editor-document">
      {!activeDocument ? <div className="editor-empty"><h1>Seu primeiro capítulo começa aqui.</h1><p>Crie um manuscrito para organizar a sua história.</p><button type="button" className="primary-button" onClick={createDocument}>Criar capítulo</button></div> : <>
        <header className="document-header"><div className="document-title-group"><input aria-label="Título do capítulo" value={title} onChange={event => setTitle(event.target.value)} onBlur={() => void saveCurrent({ title })} /><span>{wordCount.toLocaleString('pt-BR')} palavras</span></div><div><select aria-label="Estado do capítulo" value={status} onChange={event => { const next = event.target.value as typeof status; setStatus(next); void saveCurrent({ status: next, isLocked: next === 'FINALIZADO' }); }}><option value="RASCUNHO">Rascunho</option><option value="REVISAO">Em revisão</option><option value="FINALIZADO">Finalizado</option></select><button type="button" className="delete-document-button" onClick={() => void deleteCurrentDocument()}>Excluir</button><span className={`save-indicator ${saveState}`}>{saveState === 'saved' ? 'Salvo localmente' : saveState === 'saving' ? 'Salvando…' : 'Fila local'}</span></div></header>
        <div className="editor-toolbar" aria-label="Formatação"><div className="toolbar-group"><button type="button" title="Desfazer" onClick={() => editor?.chain().focus().undo().run()}>↶</button><button type="button" title="Refazer" onClick={() => editor?.chain().focus().redo().run()}>↷</button></div><div className="toolbar-group"><button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'is-active' : ''}><b>B</b></button><button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'is-active' : ''}><i>I</i></button><button type="button" onClick={() => editor?.chain().focus().toggleStrike().run()} className={editor?.isActive('strike') ? 'is-active' : ''}><s>S</s></button></div><div className="toolbar-group"><button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}>Título</button><button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'is-active' : ''}>Lista</button><button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'is-active' : ''}>1.</button><button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={editor?.isActive('blockquote') ? 'is-active' : ''}>“</button></div><button type="button" className="secondary-button" onClick={() => void normalizeCurrentImport()}>Normalizar importação</button><button type="button" className="secondary-button" disabled={isAnalyzingManuscripts || documents.length === 0} onClick={() => void analyzeProjectManuscripts()}>{isAnalyzingManuscripts ? 'Analisando biblioteca…' : `Analisar ${documents.length} manuscritos`}</button><button type="button" className="focus-button" onClick={() => setFocusMode(value => !value)}>{focusMode ? 'Sair do foco' : 'Modo foco'}</button></div>
        {analysisNotices.length > 0 && <aside className="extraction-review" aria-live="polite"><strong>Itens que não foram analisados</strong><ul>{analysisNotices.map(notice => <li key={notice}>{notice}</li>)}</ul></aside>}
        {suggestions.length > 0 && <aside className="extraction-review" aria-live="polite"><div><strong>{suggestions.length} candidatos novos em {documents.length} manuscritos</strong><p>O sistema não grava no universo até você selecionar e aprovar os candidatos com evidência e confiança exibidas.</p></div><div className="extraction-actions"><button type="button" className="secondary-button" onClick={() => { setSuggestions([]); setSelectedSuggestionFingerprints(new Set()); }}>Fechar revisão</button><button type="button" className="primary-button" disabled={isApplyingSuggestions || selectedSuggestionFingerprints.size === 0} onClick={() => void applySuggestions()}>{isApplyingSuggestions ? 'Aplicando…' : `Aplicar ${selectedSuggestionFingerprints.size} selecionada(s)`}</button></div><ul>{suggestions.map((suggestion, index) => <li key={`${suggestion.fingerprint}-${index}`}><input type="checkbox" checked={selectedSuggestionFingerprints.has(suggestion.fingerprint)} onChange={() => toggleSuggestion(suggestion.fingerprint)} aria-label={`Selecionar ${suggestionLabel(suggestion)}`} /><span>{suggestionTypeLabel(suggestion)} · {Math.round(suggestion.confidence * 100)}%</span><div><strong>{suggestionLabel(suggestion)}</strong><small>{suggestion.kind === 'chapter' ? suggestion.content.slice(0, 180) : suggestion.excerpt}{suggestion.sourceManuscriptTitle && ` · ${suggestion.sourceManuscriptTitle}`}</small></div></li>)}</ul></aside>}
        <div className="paper"><EditorContent editor={editor} /></div>
      </>}
    </section>
  </main>;
}
