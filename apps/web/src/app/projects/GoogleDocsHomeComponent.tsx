'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Project } from '@eldritch/domain';

const GENRE_OPTIONS = [
  'Fantasia',
  'Ficção Científica',
  'Mistério / Thriller',
  'Romance',
  'Horror / Terror',
  'Não-Ficção'
] as const;

type ProjectVisibility = 'PRIVADO' | 'COMPARTILHADO';

const VISIBILITY_META: Record<ProjectVisibility, { label: string; className: string }> = {
  PRIVADO: { label: 'Privado', className: 'is-private' },
  COMPARTILHADO: { label: 'Compartilhado', className: 'is-shared' }
};

export default function GoogleDocsHomeComponent() {
  const router = useRouter();
  const { user, projects, activeProject, selectProject, createProject, logout } = useApp();

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectGenre, setNewProjectGenre] = useState('Fantasia');
  const [newProjectVisibility, setNewProjectVisibility] = useState<ProjectVisibility>('PRIVADO');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-redirect if they select a project to /editor
  const handleOpenProject = (proj: Project) => {
    selectProject(proj);
    router.push('/editor');
  };

  const handleCreateNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setError(null);
    setCreating(true);

    try {
      // Create project using AppContext's createProject
      await createProject(newProjectName.trim(), newProjectGenre, newProjectVisibility);
      setNewProjectName('');
      router.push('/editor');
    } catch (err: any) {
      console.error('Erro ao criar projeto:', err);
      setError(err.message || 'Erro ao criar o projeto.');
    } finally {
      setCreating(false);
    }
  };

  const handleVisibilityChange = (value: string) => {
    if (value === 'PRIVADO' || value === 'COMPARTILHADO') {
      setNewProjectVisibility(value);
    }
  };

  return (
    <div className="projects-portal-container">
      {/* Header Bar */}
      <header className="portal-header glass">
        <div className="portal-brand">
          <span className="portal-logo-icon">⚡</span>
          <h1 className="portal-logo-title">Eldritch<span>Lich</span></h1>
        </div>

        <div className="portal-header-actions">
          {user && (
            <span className="user-welcome-badge">
              Olá, <strong>{user.name}</strong>
            </span>
          )}
          <button onClick={logout} className="btn-portal-logout">
            🚪 Sair
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="portal-main-layout">
        
        {/* Left Column: Profile Card */}
        <section className="portal-profile-column">
          <div className="profile-glass-card glass animate-fade-in">
            <div className="profile-header">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="profile-avatar" />
              ) : (
                <div className="profile-avatar-placeholder">
                  {user?.name?.substring(0, 2).toUpperCase() || 'US'}
                </div>
              )}
              <h2 className="profile-name">{user?.name || 'Escritor'}</h2>
              <span className="profile-email">{user?.email}</span>
            </div>

            <div className="profile-details-divider" />

            <div className="profile-info-section">
              <div className="profile-info-item">
                <span className="info-label">Biografia</span>
                <p className="info-value">{user?.bio || 'Nenhuma biografia informada.'}</p>
              </div>
              <div className="profile-info-item">
                <span className="info-label">Fuso Horário</span>
                <p className="info-value">🕒 {user?.timezone || 'America/Sao_Paulo'}</p>
              </div>
            </div>

            <div className="profile-actions">
              <Link href="/profile" className="btn-profile-link">
                👤 Meu Perfil / Configurações
              </Link>
            </div>
          </div>
        </section>

        {/* Right Column: Projects Management */}
        <section className="portal-projects-column animate-fade-in">
          
          {/* Active Project Quick Access */}
          {activeProject && (
            <div className="active-project-card glass">
              <div className="active-details">
                <span className="active-badge">PROJETO ATIVO ATUAL</span>
                <h3>📁 {activeProject.name}</h3>
                <p>{activeProject.genre} • {VISIBILITY_META[activeProject.visibility].label}</p>
              </div>
              <button 
                onClick={() => handleOpenProject(activeProject)}
                className="btn-active-open"
              >
                Abrir Editor Principal ➔
              </button>
            </div>
          )}

          {/* Projects List */}
          <div className="projects-section-header">
            <h2 className="portal-section-title">Seus Projetos</h2>
            <span className="portal-section-subtitle">Selecione um projeto para continuar escrevendo</span>
          </div>

          <div className="projects-grid">
            {projects.map((proj) => (
              <div key={proj.id} className="project-portal-card glass">
                <div className="project-card-header">
                  <span className="project-card-icon">📁</span>
                  <div className="project-card-meta">
                    <span className={`project-card-visibility ${VISIBILITY_META[proj.visibility].className}`}>
                      {VISIBILITY_META[proj.visibility].label}
                    </span>
                  </div>
                </div>
                <h3 className="project-card-name" title={proj.name}>{proj.name}</h3>
                <p className="project-card-genre">{proj.genre}</p>
                <div className="project-card-divider" />
                <button 
                  onClick={() => handleOpenProject(proj)}
                  className="btn-project-open"
                >
                  Entrar no Manuscrito
                </button>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="projects-empty-state glass">
                <span className="empty-icon">📂</span>
                <h3>Nenhum projeto encontrado</h3>
                <p>Crie um novo projeto ao lado para começar sua jornada.</p>
              </div>
            )}
          </div>

          {/* Create Project Form Card */}
          <div className="create-project-portal-card glass">
            <h3>➕ Criar Novo Projeto</h3>
            <p className="create-desc">Um projeto isola seus capítulos, metas de progresso, cronograma e grafo de lore.</p>
            
            {error && <div className="portal-error-msg">{error}</div>}

            <form onSubmit={handleCreateNewProject} className="portal-create-form">
              <div className="portal-form-group">
                <label>Nome do Projeto</label>
                <input 
                  type="text" 
                  placeholder="Ex: As Crônicas de Eldritch..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                />
              </div>

              <div className="portal-form-row">
                <div className="portal-form-group flex-1">
                  <label>Gênero Literário</label>
                  <select value={newProjectGenre} onChange={(e) => setNewProjectGenre(e.target.value)}>
                    {GENRE_OPTIONS.map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div className="portal-form-group flex-1">
                  <label>Visibilidade</label>
                  <select 
                    value={newProjectVisibility} 
                    onChange={(e) => handleVisibilityChange(e.target.value)}
                  >
                    <option value="PRIVADO">Privado (Local-First)</option>
                    <option value="COMPARTILHADO">Compartilhado (Colaborativo)</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={creating} className="btn-portal-create">
                {creating ? 'Criando Projeto...' : 'Criar & Abrir Manuscrito'}
              </button>
            </form>
          </div>

        </section>

      </main>

      <style jsx global>{`
        .projects-portal-container {
          min-height: 100vh;
          background-color: #0b0d10;
          color: #f3f4f6;
          display: flex;
          flex-direction: column;
          font-family: var(--font-sans);
        }

        .portal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2.5rem;
          background: rgba(15, 23, 42, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
        }

        .portal-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .portal-logo-icon {
          font-size: 1.6rem;
          color: #14b8a6;
        }

        .portal-logo-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #f8fafc;
          font-family: var(--font-display);
        }

        .portal-logo-title span {
          color: #14b8a6;
        }

        .portal-header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-welcome-badge {
          font-size: 0.9rem;
          color: #cbd5e1;
        }

        .btn-portal-logout {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 0.45rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-portal-logout:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #ef4444;
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.2);
        }

        .portal-main-layout {
          max-width: 1300px;
          width: 100%;
          margin: 0 auto;
          padding: 2.5rem 2rem;
          display: flex;
          gap: 2.5rem;
          flex-direction: row;
          align-items: flex-start;
        }

        @media (max-width: 968px) {
          .portal-main-layout {
            flex-direction: column;
            align-items: stretch;
          }
        }

        .portal-profile-column {
          flex: 1;
          max-width: 380px;
          width: 100%;
        }

        @media (max-width: 968px) {
          .portal-profile-column {
            max-width: 100%;
          }
        }

        .profile-glass-card {
          padding: 2rem;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.5rem;
        }

        .profile-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 3px solid rgba(20, 184, 166, 0.3);
          object-fit: cover;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          margin-bottom: 0.5rem;
        }

        .profile-avatar-placeholder {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
          color: #fff;
          font-size: 2.2rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(20, 184, 166, 0.25);
          margin-bottom: 0.5rem;
        }

        .profile-name {
          font-size: 1.35rem;
          font-weight: 700;
          color: #f8fafc;
          font-family: var(--font-display);
        }

        .profile-email {
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .profile-details-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          width: 100%;
        }

        .profile-info-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .profile-info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 0.9rem;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .profile-actions {
          margin-top: 0.5rem;
        }

        .btn-profile-link {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-profile-link:hover {
          background: rgba(20, 184, 166, 0.1);
          border-color: rgba(20, 184, 166, 0.3);
          color: #14b8a6;
        }

        .portal-projects-column {
          flex: 2.2;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .active-project-card {
          padding: 1.5rem 2rem;
          border-radius: 12px;
          border-left: 4px solid #14b8a6;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
        }

        @media (max-width: 600px) {
          .active-project-card {
            flex-direction: column;
            align-items: stretch;
          }
        }

        .active-badge {
          font-size: 0.7rem;
          font-weight: 700;
          color: #14b8a6;
          background: rgba(20, 184, 166, 0.12);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          letter-spacing: 0.5px;
          display: inline-block;
          margin-bottom: 0.4rem;
        }

        .active-details h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 0.2rem;
        }

        .active-details p {
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .btn-active-open {
          background: #14b8a6;
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.2);
          white-space: nowrap;
        }

        .btn-active-open:hover {
          background: #0d9488;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(20, 184, 166, 0.35);
        }

        .projects-section-header {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .portal-section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f8fafc;
          font-family: var(--font-display);
        }

        .portal-section-subtitle {
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.5rem;
        }

        .project-portal-card {
          padding: 1.5rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: all 0.25s ease;
        }

        .project-portal-card:hover {
          border-color: rgba(20, 184, 166, 0.3);
          box-shadow: 0 8px 30px rgba(20, 184, 166, 0.08);
          transform: translateY(-4px);
        }

        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .project-card-icon {
          font-size: 1.6rem;
        }

        .project-card-visibility {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .project-card-visibility.is-private {
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .project-card-visibility.is-shared {
          color: #60a5fa;
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .project-card-name {
          font-size: 1.05rem;
          font-weight: 600;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .project-card-genre {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .project-card-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
          margin-top: auto;
          margin-bottom: 0.25rem;
        }

        .btn-project-open {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          padding: 0.55rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .project-portal-card:hover .btn-project-open {
          background: #14b8a6;
          border-color: #14b8a6;
          color: #fff;
          box-shadow: 0 4px 10px rgba(20, 184, 166, 0.25);
        }

        .projects-empty-state {
          grid-column: 1 / -1;
          padding: 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          border-style: dashed;
        }

        .projects-empty-state .empty-icon {
          font-size: 2.5rem;
          color: #6b7280;
        }

        .projects-empty-state h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #cbd5e1;
        }

        .projects-empty-state p {
          font-size: 0.85rem;
          color: #6b7280;
        }

        .create-project-portal-card {
          padding: 2rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-top: 1rem;
        }

        .create-project-portal-card h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .create-desc {
          font-size: 0.85rem;
          color: #94a3b8;
          line-height: 1.4;
        }

        .portal-create-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .portal-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .portal-form-row {
          display: flex;
          gap: 1.25rem;
        }

        @media (max-width: 600px) {
          .portal-form-row {
            flex-direction: column;
          }
        }

        .portal-form-group label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #94a3b8;
        }

        .portal-form-group input,
        .portal-form-group select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.7rem 0.9rem;
          color: #fff;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .portal-form-group input:focus,
        .portal-form-group select:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.08);
          border-color: #14b8a6;
          box-shadow: 0 0 10px rgba(20, 184, 166, 0.15);
        }

        .btn-portal-create {
          background: #14b8a6;
          color: #fff;
          border: none;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.15);
        }

        .btn-portal-create:hover {
          background: #0d9488;
          box-shadow: 0 4px 16px rgba(20, 184, 166, 0.3);
          transform: translateY(-1px);
        }

        .btn-portal-create:disabled {
          background: #4b5563;
          color: #9ca3af;
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-portal-logout:focus-visible,
        .btn-active-open:focus-visible,
        .btn-profile-link:focus-visible,
        .btn-project-open:focus-visible,
        .btn-portal-create:focus-visible,
        .portal-form-group input:focus-visible,
        .portal-form-group select:focus-visible {
          outline: 2px solid #14b8a6;
          outline-offset: 2px;
        }

        .portal-error-msg {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
