'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { ReferenceItem, ResearchNote, CitationStyle, formatReference, parseBibTeX, extractWikiLinks, exportToLaTeX } from '@eldritch/domain';

export default function ResearchPage() {
  const { activeProject } = useApp();
  const [references, setReferences] = useState<ReferenceItem[]>([]);
  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<CitationStyle>('ABNT');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [activeView, setActiveView] = useState<'BIBLIOGRAPHY' | 'ZETTELKASTEN' | 'KNOWLEDGE_MAP'>('BIBLIOGRAPHY');

  // Atomic Note Form State (UC-325)
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedRefId, setSelectedRefId] = useState('');

  const [bibtexInput, setBibtexInput] = useState('');

  // Form State (UC-313)
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [type, setType] = useState<ReferenceItem['type']>('JOURNAL_ARTICLE');

  const [copied, setCopied] = useState(false);

  const loadData = async () => {
    if (!activeProject) return;
    const items = await db.referenceItems.where('projectId').equals(activeProject.id).toArray();
    setReferences(items);

    const notes = await db.researchNotes.where('projectId').equals(activeProject.id).toArray();
    setResearchNotes(notes);
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  // Add Single Reference (UC-313)
  const handleAddReference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !activeProject) return;

    const newRef: ReferenceItem = {
      id: `ref_${Date.now()}`,
      projectId: activeProject.id,
      type,
      title: title.trim(),
      authors: authors.split(';').map(a => a.trim()).filter(Boolean),
      journalOrPublisher: publisher.trim(),
      year: year || new Date().getFullYear(),
      createdAt: new Date().toISOString()
    };

    await db.referenceItems.put(newRef);
    setShowAddModal(false);
    setTitle('');
    setAuthors('');
    setPublisher('');
    await loadData();
  };

  // Create Atomic Note (UC-325, UC-326, UC-317)
  const handleAddAtomicNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !activeProject) return;

    const newNote: ResearchNote = {
      id: `rn_${Date.now()}`,
      projectId: activeProject.id,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      tags: ['pesquisa', 'zettelkasten'],
      referenceId: selectedRefId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.researchNotes.put(newNote);
    setShowNoteModal(false);
    setNoteTitle('');
    setNoteContent('');
    setSelectedRefId('');
    await loadData();
  };

  // Export LaTeX (UC-321)
  const handleExportLaTeX = () => {
    if (!activeProject) return;
    const compiledContent = researchNotes.map(n => `% --- ${n.title} ---\n${n.content}`).join('\n\n');
    const { tex, bib } = exportToLaTeX(activeProject.name || 'Manuscrito Acadêmico', compiledContent, references);
    
    const blob = new Blob([`${tex}\n\n% === ARCHIVE REFERENCES.BIB ===\n\n${bib}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeProject.name.toLowerCase().replace(/\s+/g, '_')}_latex_export.tex`;
    link.click();
  };

  // Import BibTeX (UC-313)
  const handleImportBibTeX = async () => {
    if (!bibtexInput.trim() || !activeProject) return;
    const parsed = parseBibTeX(bibtexInput, activeProject.id);
    for (const item of parsed) {
      if (item.title) {
        await db.referenceItems.put({
          id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          projectId: activeProject.id,
          type: item.type || 'JOURNAL_ARTICLE',
          title: item.title,
          authors: item.authors || ['Anônimo'],
          year: item.year || new Date().getFullYear(),
          createdAt: new Date().toISOString()
        });
      }
    }
    setBibtexInput('');
    await loadData();
  };

  // Export Formatted Bibliography (UC-316)
  const formattedBibliography = references
    .map(ref => formatReference(ref, selectedStyle))
    .sort()
    .join('\n\n');

  const handleCopyBibliography = () => {
    navigator.clipboard.writeText(formattedBibliography);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="research-page-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📚 Pesquisa Científica & Zettelkasten (UC-313 a UC-327)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Catalogação de referências, notas atômicas, mapa de conhecimento bidirecional e exportação compilada para LaTeX.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <button 
            onClick={() => setActiveView('BIBLIOGRAPHY')}
            style={{ background: activeView === 'BIBLIOGRAPHY' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📚 Bibliografia (UC-313/316)
          </button>
          <button 
            onClick={() => setActiveView('ZETTELKASTEN')}
            style={{ background: activeView === 'ZETTELKASTEN' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📝 Notas Atômicas (UC-325/326)
          </button>
          <button 
            onClick={() => setActiveView('KNOWLEDGE_MAP')}
            style={{ background: activeView === 'KNOWLEDGE_MAP' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            🕸️ Mapa de Conhecimento (UC-327)
          </button>
          <button 
            onClick={handleExportLaTeX}
            style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
          >
            📦 Exportar LaTeX (.tex) (UC-321)
          </button>
        </div>
      </header>

      {/* View BIBLIOGRAPHY (UC-313, UC-316) */}
      {activeView === 'BIBLIOGRAPHY' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>📥 Importar Referências via BibTeX (UC-313)</h3>
                <button 
                  onClick={() => setShowAddModal(true)}
                  style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                >
                  ➕ Manual
                </button>
              </div>
              <textarea 
                rows={3}
                placeholder="Cole seu código @article{...} ou @book{...} em formato BibTeX aqui"
                value={bibtexInput}
                onChange={e => setBibtexInput(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontFamily: 'monospace', fontSize: '0.85rem' }}
              />
              <button 
                onClick={handleImportBibTeX}
                style={{ marginTop: '0.5rem', background: '#10b981', border: 'none', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
              >
                Processar BibTeX
              </button>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>📖 Acervo do Projeto ({references.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {references.map(ref => (
                  <div key={ref.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.8rem' }}>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                      {ref.type}
                    </span>
                    <h4 style={{ margin: '0.4rem 0 0.2rem 0', fontSize: '1rem' }}>{ref.title}</h4>
                    <p style={{ margin: 0, opacity: 0.7, fontSize: '0.85rem' }}>
                      {ref.authors.join('; ')} ({ref.year}) {ref.journalOrPublisher && `• ${ref.journalOrPublisher}`}
                    </p>
                  </div>
                ))}

                {references.length === 0 && (
                  <p style={{ textAlign: 'center', opacity: 0.5, padding: '2rem 0' }}>
                    Nenhuma referência cadastrada no acervo.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>✨ Bibliografia Formatada (UC-316)</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', opacity: 0.8 }}>Norma:</label>
                <select 
                  value={selectedStyle}
                  onChange={e => setSelectedStyle(e.target.value as CitationStyle)}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 600 }}
                >
                  <option value="ABNT">ABNT NBR 6023</option>
                  <option value="APA">APA 7th Edition</option>
                  <option value="MLA">MLA Style</option>
                  <option value="VANCOUVER">Vancouver</option>
                </select>
              </div>
            </div>

            <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1rem', whiteSpace: 'pre-wrap', fontFamily: 'serif', fontSize: '0.95rem', lineHeight: '1.6', overflowY: 'auto' }}>
              {formattedBibliography || <span style={{ opacity: 0.4, fontStyle: 'italic' }}>Cadastre referências para visualizar a bibliografia formatada sob as normas {selectedStyle}.</span>}
            </div>

            <button 
              onClick={handleCopyBibliography}
              disabled={!formattedBibliography}
              style={{ marginTop: '1rem', background: copied ? '#10b981' : '#3b82f6', border: 'none', color: 'white', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, opacity: formattedBibliography ? 1 : 0.5 }}
            >
              {copied ? '✅ Copiado para a Área de Transferência!' : '📋 Copiar Lista de Referências'}
            </button>
          </div>
        </div>
      )}

      {/* View ZETTELKASTEN (UC-325, UC-326) */}
      {activeView === 'ZETTELKASTEN' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>📝 Notas Atômicas Zettelkasten ({researchNotes.length})</h2>
            <button 
              onClick={() => setShowNoteModal(true)}
              style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              ➕ Nova Nota Atômica (UC-325)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
            {researchNotes.map(note => {
              const wikiLinks = extractWikiLinks(note.content);
              const ref = references.find(r => r.id === note.referenceId);
              return (
                <div key={note.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#60a5fa' }}>{note.title}</h3>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', opacity: 0.8, whiteSpace: 'pre-wrap' }}>{note.content}</p>

                    {ref && (
                      <div style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.3rem 0.6rem', borderRadius: '4px', marginBottom: '0.8rem' }}>
                        🔗 Fonte: {ref.title} ({ref.year})
                      </div>
                    )}
                  </div>

                  {wikiLinks.length > 0 && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.6rem', fontSize: '0.78rem' }}>
                      <span style={{ opacity: 0.6 }}>Wiki-Links Bidirecionais (UC-326):</span>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                        {wikiLinks.map((wl, idx) => (
                          <span key={idx} style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                            [[{wl}]]
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {researchNotes.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5, padding: '4rem 0' }}>
                Nenhuma nota atômica criada. Clique em "Nova Nota Atômica".
              </div>
            )}
          </div>
        </div>
      )}

      {/* View KNOWLEDGE MAP (UC-327) */}
      {activeView === 'KNOWLEDGE_MAP' && (
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '2rem', height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', position: 'absolute', top: '1.5rem', left: '1.5rem' }}>🕸️ Mapa de Conhecimento Pessoal (Zettelkasten Graph - UC-327)</h3>
          
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {researchNotes.map((note, idx) => (
              <div key={note.id} style={{ background: 'radial-gradient(circle, #3b82f6 0%, #1e3a8a 100%)', width: `${60 + (note.content.length % 40)}px`, height: `${60 + (note.content.length % 40)}px`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', textAlign: 'center', padding: '0.5rem', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)', cursor: 'pointer' }}>
                {note.title}
              </div>
            ))}

            {researchNotes.length === 0 && (
              <p style={{ opacity: 0.5 }}>Crie notas atômicas para visualizar a teia do grafo de conhecimento.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal Add Atomic Note (UC-325, UC-326) */}
      {showNoteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📝 Criar Nota Atômica (UC-325)</h3>
            <form onSubmit={handleAddAtomicNote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Título da Ideia Atômica:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Teoria da Relatividade Restrita"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Conteúdo (Use [[Título de Outra Nota]] para linkar - UC-326):</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Definição da ideia. Veja também [[Efeito Fotoelétrico]]..."
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Vincular a uma Fonte Bibliográfica (UC-317):</label>
                <select 
                  value={selectedRefId}
                  onChange={e => setSelectedRefId(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="">Sem fonte direta...</option>
                  {references.map(r => (
                    <option key={r.id} value={r.id}>{r.title} ({r.year})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowNoteModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar Nota</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Reference Modal (UC-313) */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📖 Cadastrar Nova Referência (UC-313)</h3>
            <form onSubmit={handleAddReference} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Título da Obra / Artigo:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Metodologia de Pesquisa Científica"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Autores (separados por ponto e vírgula):</label>
                <input 
                  type="text"
                  placeholder="Ex: SILVA, João; SANTOS, Maria"
                  value={authors}
                  onChange={e => setAuthors(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Ano:</label>
                  <input 
                    type="number"
                    value={year}
                    onChange={e => setYear(parseInt(e.target.value) || 2026)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Tipo:</label>
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    <option value="JOURNAL_ARTICLE">Artigo de Revista</option>
                    <option value="BOOK">Livro</option>
                    <option value="CONFERENCE_PAPER">Congresso</option>
                    <option value="WEBSITE">Website</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Editora / Revista / Journal:</label>
                <input 
                  type="text"
                  placeholder="Ex: Editora Acadêmica Brasil"
                  value={publisher}
                  onChange={e => setPublisher(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar Referência</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
