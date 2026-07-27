'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { ReferenceItem, CitationStyle, formatReference, parseBibTeX } from '@eldritch/domain';

export default function ResearchPage() {
  const { activeProject } = useApp();
  const [references, setReferences] = useState<ReferenceItem[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<CitationStyle>('ABNT');
  const [showAddModal, setShowAddModal] = useState(false);
  const [bibtexInput, setBibtexInput] = useState('');

  // Form State (UC-313)
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [type, setType] = useState<ReferenceItem['type']>('JOURNAL_ARTICLE');

  const [copied, setCopied] = useState(false);

  const loadReferences = async () => {
    if (!activeProject) return;
    const items = await db.referenceItems.where('projectId').equals(activeProject.id).toArray();
    setReferences(items);
  };

  useEffect(() => {
    loadReferences();
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
    await loadReferences();
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
    await loadReferences();
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
            📚 Pesquisa Científica & Gerenciador Bibliográfico (UC-313, UC-316)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Catalogação de referências, importador BibTeX e gerador de normas acadêmicas (ABNT, APA, MLA, Vancouver).
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          ➕ Nova Referência (UC-313)
        </button>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left: References Library & BibTeX Import */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.2rem' }}>
            <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem' }}>📥 Importar Referências via BibTeX (UC-313)</h3>
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

        {/* Right: Formatted Bibliography Generator (UC-316) */}
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
