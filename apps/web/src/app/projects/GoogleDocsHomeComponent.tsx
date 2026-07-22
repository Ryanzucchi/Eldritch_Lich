'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { Manuscript } from '@eldritch/domain';

export default function GoogleDocsHomeComponent() {
  const router = useRouter();
  const { user, projects, activeProject, selectProject, logout } = useApp();

  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'PINNED' | 'ARCHIVED'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  // New Project / Rename Modal
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectGenre, setNewProjectGenre] = useState('Fantasia');
  const [creating, setCreating] = useState(false);

  // Rename Manuscript Modal
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState('');

  useEffect(() => {
    loadManuscripts();
  }, [activeProject]);

  const loadManuscripts = async () => {
    try {
      setLoading(true);
      const all = await db.manuscripts.filter(m => !m.inTrash).toArray();
      setManuscripts(all);
    } catch (err) {
      console.error('Erro ao carregar documentos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create document with optional template
  const handleCreateDocument = async (templateType: 'BLANK' | 'HERO' | 'CHARACTER' | 'WORLDBUILDING' | 'THREE_ACT') => {
    try {
      setCreating(true);
      let title = 'Novo Capítulo sem Título';
      let content = '<p>Comece a escrever seu capítulo aqui...</p>';

      if (templateType === 'HERO') {
        title = 'Jornada do Herói - Capítulo 1';
        content = `
          <h2>A Jornada do Herói: Chamado à Aventura</h2>
          <p><strong>Mundo Comum:</strong> Apresente o protagonista em seu ambiente cotidiano antes do incidente incitante.</p>
          <hr />
          <p><strong>O Chamado:</strong> Qual evento inesperado rompe a rotina do protagonista?</p>
          <hr />
          <p><strong>Recusa do Chamado:</strong> Quais medos ou hesitações o impedem de agir?</p>
        `;
      } else if (templateType === 'CHARACTER') {
        title = 'Ficha de Personagem - Protagonista';
        content = `
          <h2>Ficha de Personagem</h2>
          <p><strong>Nome Completo:</strong> </p>
          <p><strong>Papel Narrativo:</strong> Protagonista / Antagonista / Mentor</p>
          <p><strong>Desejo Consciente:</strong> O que ele quer?</p>
          <p><strong>Necessidade Inconsciente:</strong> Do que ele realmente precisa?</p>
          <p><strong>Fraqueza / Falha Fatal:</strong> </p>
        `;
      } else if (templateType === 'WORLDBUILDING') {
        title = 'Worldbuilding - Bíblia do Universo';
        content = `
          <h2>Bíblia de Worldbuilding</h2>
          <p><strong>Regras de Magia / Tecnologia:</strong> Limites e custos do sistema.</p>
          <p><strong>Facções & Conflitos Politicos:</strong> Quem governa e quem resiste?</p>
          <p><strong>Geografia & Locais Chave:</strong> </p>
        `;
      } else if (templateType === 'THREE_ACT') {
        title = 'Estrutura de 3 Atos - Capítulo 1';
        content = `
          <h2>Ato I: Apresentação & Incidente Incitante</h2>
          <p>Estabeleça o objetivo central e o ponto de virada do Ato I.</p>
        `;
      }

      const newDoc: Manuscript = {
        id: `ms_${Date.now()}`,
        projectId: activeProject?.id || 'proj_default',
        title,
        content,
        status: 'RASCUNHO',
        isLocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        inTrash: false
      };

      await db.manuscripts.put(newDoc);
      router.push(`/editor?chapterId=${newDoc.id}`);
    } catch (err) {
      console.error('Erro ao criar documento:', err);
    } finally {
      setCreating(false);
    }
  };

  // Create New Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      setCreating(true);
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName.trim(), genre: newProjectGenre })
      });

      if (res.ok) {
        const proj = await res.json();
        selectProject(proj);
        setShowNewProjectModal(false);
        setNewProjectName('');
        await handleCreateDocument('BLANK');
      }
    } catch (err) {
      console.error('Erro ao criar projeto:', err);
    } finally {
      setCreating(false);
    }
  };

  // Save renamed manuscript
  const handleSaveRename = async (id: string) => {
    if (!renamingTitle.trim()) {
      setRenamingId(null);
      return;
    }
    await db.manuscripts.update(id, {
      title: renamingTitle.trim(),
      updatedAt: new Date().toISOString()
    });
    setRenamingId(null);
    await loadManuscripts();
  };

  // Filter & Search Manuscripts
  const filteredManuscripts = manuscripts.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (m.content && m.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterCategory === 'ARCHIVED') return matchesSearch && m.isArchived;
    if (filterCategory === 'PINNED') return matchesSearch && m.tags?.includes('PINNED');
    return matchesSearch && !m.isArchived;
  });

  return (
    <div className="google-docs-home-container">
      {/* Header Bar (Google Docs Style) */}
      <header className="docs-hub-header glass">
        <div className="docs-hub-brand">
          <span className="hub-logo-icon">📄</span>
          <h1 className="hub-logo-title">Eldritch<span>Docs</span></h1>
        </div>

        {/* Search Bar */}
        <div className="docs-hub-search-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Pesquisar documentos, capítulos ou templates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="docs-hub-search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="btn-clear-search">✕</button>
          )}
        </div>

        {/* Top User Actions & Profile / Logout */}
        <div className="docs-hub-actions">
          {activeProject && (
            <div className="hub-active-project-tag" title="Projeto Ativo">
              📁 {activeProject.name}
            </div>
          )}
          <button onClick={() => setShowNewProjectModal(true)} className="btn-create-proj-hub">
            ➕ Novo Projeto
          </button>

          {user ? (
            <div className="user-profile-menu">
              <span className="user-email-badge" title={user.email}>
                👤 {user.name}
              </span>
              <button 
                onClick={logout} 
                className="btn-hub-logout" 
                title="Sair da Plataforma (Logout)"
              >
                🚪 Sair
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="btn-hub-login">
              Entrar
            </Link>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="docs-hub-main-viewport">
        {/* Template Gallery Section */}
        <section className="template-gallery-section">
          <div className="section-header">
            <h2 className="section-title">Iniciar um novo documento</h2>
            <span className="section-subtitle">Escolha um modelo narrativo ou comece em branco</span>
          </div>

          <div className="template-cards-grid">
            <button type="button" className="template-card blank" onClick={() => handleCreateDocument('BLANK')}>
              <div className="template-thumbnail">
                <span className="plus-icon">➕</span>
              </div>
              <span className="template-name">Documento em Branco</span>
            </button>

            <button type="button" className="template-card" onClick={() => handleCreateDocument('HERO')}>
              <div className="template-thumbnail hero">
                <span>📑</span>
              </div>
              <span className="template-name">Jornada do Herói</span>
            </button>

            <button type="button" className="template-card" onClick={() => handleCreateDocument('CHARACTER')}>
              <div className="template-thumbnail char">
                <span>👤</span>
              </div>
              <span className="template-name">Ficha de Personagem</span>
            </button>

            <button type="button" className="template-card" onClick={() => handleCreateDocument('WORLDBUILDING')}>
              <div className="template-thumbnail world">
                <span>🏛️</span>
              </div>
              <span className="template-name">Worldbuilding Local</span>
            </button>

            <button type="button" className="template-card" onClick={() => handleCreateDocument('THREE_ACT')}>
              <div className="template-thumbnail act">
                <span>🎬</span>
              </div>
              <span className="template-name">Estrutura de 3 Atos</span>
            </button>
          </div>
        </section>

        {/* Recent Documents & Projects List */}
        <section className="recent-docs-section">
          <div className="recent-docs-header">
            <h2 className="recent-title">Documentos Recentes</h2>
            
            <div className="recent-controls">
              {/* Category Filter */}
              <div className="filter-pill-group">
                <button 
                  className={`filter-pill ${filterCategory === 'ALL' ? 'active' : ''}`}
                  onClick={() => setFilterCategory('ALL')}
                >
                  Todos os Documentos
                </button>
                <button 
                  className={`filter-pill ${filterCategory === 'PINNED' ? 'active' : ''}`}
                  onClick={() => setFilterCategory('PINNED')}
                >
                  📌 Fixados
                </button>
                <button 
                  className={`filter-pill ${filterCategory === 'ARCHIVED' ? 'active' : ''}`}
                  onClick={() => setFilterCategory('ARCHIVED')}
                >
                  📦 Arquivados
                </button>
              </div>

              {/* View Toggle */}
              <div className="view-toggle-btns">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Visualização em Grade"
                >
                  ▦
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Visualização em Lista"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Documents Grid / List */}
          {loading ? (
            <div className="docs-loading-state">
              <div className="spinner"></div>
              <p>Carregando seus manuscritos...</p>
            </div>
          ) : filteredManuscripts.length === 0 ? (
            <div className="docs-empty-state glass">
              <span className="empty-icon">📄</span>
              <h3>Nenhum documento encontrado</h3>
              <p>Crie um novo documento acima ou altere os filtros de pesquisa.</p>
              <button onClick={() => handleCreateDocument('BLANK')} className="btn-empty-create">
                Criar Documento em Branco
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="docs-cards-grid">
              {filteredManuscripts.map(doc => (
                <div 
                  key={doc.id} 
                  className="doc-card glass"
                  onClick={() => router.push(`/editor?chapterId=${doc.id}`)}
                >
                  <div className="doc-card-preview">
                    <span className="doc-badge-status">{doc.status}</span>
                    <p className="preview-text">
                      {doc.content ? doc.content.replace(/<[^>]*>?/gm, '').slice(0, 140) + '...' : 'Documento em branco'}
                    </p>
                  </div>
                  
                  <div className="doc-card-footer">
                    <div className="doc-info">
                      {renamingId === doc.id ? (
                        <input
                          type="text"
                          value={renamingTitle}
                          onChange={(e) => setRenamingTitle(e.target.value)}
                          onBlur={() => handleSaveRename(doc.id)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveRename(doc.id); }}
                          onClick={(e) => e.stopPropagation()}
                          className="doc-rename-input"
                          autoFocus
                        />
                      ) : (
                        <h3 className="doc-title" title={doc.title}>{doc.title}</h3>
                      )}
                      <span className="doc-date">
                        Modificado {new Date(doc.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenamingId(doc.id);
                        setRenamingTitle(doc.title);
                      }}
                      className="btn-card-action"
                      title="Renomear"
                    >
                      ✎
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="docs-list-view glass">
              {filteredManuscripts.map(doc => (
                <div 
                  key={doc.id} 
                  className="doc-list-row"
                  onClick={() => router.push(`/editor?chapterId=${doc.id}`)}
                >
                  <span className="doc-row-icon">📄</span>
                  <div className="doc-row-title-area">
                    <h3 className="doc-row-title">{doc.title}</h3>
                    <span className="doc-row-status">{doc.status}</span>
                  </div>
                  <span className="doc-row-words">{doc.content ? doc.content.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).filter(Boolean).length : 0} palavras</span>
                  <span className="doc-row-date">{new Date(doc.updatedAt).toLocaleDateString()}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingId(doc.id);
                      setRenamingTitle(doc.title);
                    }}
                    className="btn-card-action"
                    title="Renomear"
                  >
                    ✎
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="modal-backdrop glass">
          <div className="modal-card glass animate-fade-in">
            <h2>Criar Novo Projeto</h2>
            <p>Um projeto agrupa manuscritos, capítulos e grafos de metas.</p>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Nome do Projeto</label>
                <input 
                  type="text" 
                  placeholder="Ex: O Império da Mente, Crônicas de Eldritch..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Gênero Literário</label>
                <select value={newProjectGenre} onChange={(e) => setNewProjectGenre(e.target.value)}>
                  <option value="Fantasia">Fantasia</option>
                  <option value="Ficção Científica">Ficção Científica</option>
                  <option value="Mistério / Thriller">Mistério / Thriller</option>
                  <option value="Romance">Romance</option>
                  <option value="Horror / Terror">Horror / Terror</option>
                  <option value="Não-Ficção">Não-Ficção</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowNewProjectModal(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={creating} className="btn-primary">
                  {creating ? 'Criando...' : 'Criar & Abrir Editor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx global>{`
        .google-docs-home-container {
          min-height: 100vh;
          background-color: #0b0f17;
          color: #f1f5f9;
          display: flex;
          flex-direction: column;
        }

        .docs-hub-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem 2rem;
          background: rgba(15, 23, 42, 0.9);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .docs-hub-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .hub-logo-icon {
          font-size: 1.8rem;
          color: #3b82f6;
        }

        .hub-logo-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .hub-logo-title span {
          color: #3b82f6;
        }

        .docs-hub-search-wrapper {
          position: relative;
          width: 40%;
          max-width: 600px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .docs-hub-search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 0.6rem 2.8rem;
          color: #fff;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .docs-hub-search-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.08);
          border-color: #3b82f6;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        }

        .btn-clear-search {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
        }

        .docs-hub-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .hub-active-project-tag {
          font-size: 0.85rem;
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
        }

        .btn-create-proj-hub {
          background: #3b82f6;
          color: #fff;
          border: none;
          padding: 0.45rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-create-proj-hub:hover {
          background: #2563eb;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
        }

        .docs-hub-main-viewport {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .template-gallery-section {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .section-header {
          margin-bottom: 1.2rem;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .section-subtitle {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .template-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 1.25rem;
        }

        .template-card {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          transition: all 0.2s ease;
        }

        .template-card:hover {
          transform: translateY(-4px);
        }

        .template-thumbnail {
          width: 100%;
          height: 130px;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          transition: all 0.2s ease;
        }

        .template-card.blank .template-thumbnail {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
          color: #3b82f6;
        }

        .template-card:hover .template-thumbnail {
          border-color: #3b82f6;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.25);
        }

        .template-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: #cbd5e1;
          text-align: center;
        }

        .recent-docs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .recent-title {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .recent-controls {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .filter-pill-group {
          display: flex;
          gap: 0.5rem;
        }

        .filter-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          padding: 0.35rem 0.8rem;
          border-radius: 16px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-pill.active {
          background: rgba(59, 130, 246, 0.2);
          border-color: #3b82f6;
          color: #60a5fa;
        }

        .view-toggle-btns {
          display: flex;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
        }

        .view-btn {
          background: none;
          border: none;
          color: #94a3b8;
          padding: 0.35rem 0.6rem;
          cursor: pointer;
        }

        .view-btn.active {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .docs-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .doc-card {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
        }

        .doc-card:hover {
          border-color: #3b82f6;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }

        .doc-card-preview {
          padding: 1.25rem;
          background: rgba(30, 41, 59, 0.4);
          height: 120px;
          position: relative;
          overflow: hidden;
        }

        .doc-badge-status {
          position: absolute;
          top: 0.6rem;
          right: 0.6rem;
          font-size: 0.65rem;
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .preview-text {
          font-size: 0.75rem;
          color: #94a3b8;
          line-height: 1.4;
        }

        .doc-card-footer {
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .doc-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #f8fafc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 170px;
        }

        .doc-date {
          font-size: 0.7rem;
          color: #64748b;
          display: block;
        }

        .btn-card-action {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }

        .btn-card-action:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .docs-list-view {
          display: flex;
          flex-direction: column;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .doc-list-row {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .doc-list-row:hover {
          background: rgba(59, 130, 246, 0.1);
        }

        .doc-row-icon {
          font-size: 1.2rem;
          margin-right: 1rem;
        }

        .doc-row-title-area {
          flex: 1;
        }

        .doc-row-title {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .doc-row-status {
          font-size: 0.7rem;
          color: #3b82f6;
        }

        .doc-row-words, .doc-row-date {
          font-size: 0.8rem;
          color: #94a3b8;
          width: 140px;
        }

        .docs-empty-state {
          padding: 3rem;
          text-align: center;
          border-radius: 12px;
          border: 1px dashed rgba(255, 255, 255, 0.15);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .btn-empty-create {
          margin-top: 1.25rem;
          background: #3b82f6;
          color: #fff;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
