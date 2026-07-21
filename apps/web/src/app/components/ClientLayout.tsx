'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { 
    user, 
    projects, 
    activeProject, 
    loadingSession, 
    selectProject, 
    createProject, 
    logout,
    hideSidebar
  } = useApp();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectGenre, setProjectGenre] = useState('Fantasia');
  const [projectVisibility, setProjectVisibility] = useState<'PRIVADO' | 'COMPARTILHADO'>('PRIVADO');
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // If we are on the auth pages, do not render the dashboard wrapper
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Loader if session is loading
  if (loadingSession) {
    return (
      <div className="app-loader">
        <div className="loader-box">
          <div className="spinner"></div>
          <h2>Eldritch<span>Lich</span></h2>
          <p>Restaurando universo causal...</p>
        </div>
        <style jsx>{`
          .app-loader {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #050608;
            color: #f3f4f6;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .loader-box {
            text-align: center;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(20, 184, 166, 0.1);
            border-top-color: #14b8a6;
            border-radius: 50%;
            animation: spin 1s infinite linear;
            margin: 0 auto 1.5rem auto;
          }
          h2 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.8rem;
            letter-spacing: -0.02em;
            margin-bottom: 0.25rem;
          }
          h2 span {
            color: #14b8a6;
          }
          p {
            color: #9ca3af;
            font-size: 0.85rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Handle modal submit
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalLoading(true);

    try {
      await createProject(projectName, projectGenre, projectVisibility);
      setProjectName('');
      setProjectGenre('Fantasia');
      setProjectVisibility('PRIVADO');
      setShowModal(false);
    } catch (err: any) {
      setModalError(err.message || 'Erro ao criar projeto.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar navigation */}
      {!hideSidebar && (
        <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <Link href="/gmn" className="brand-logo">
            Eldritch<span>Lich</span>
          </Link>
        </div>

        {/* Project Selector */}
        {user && (
          <div className="project-selector-wrapper">
            <button 
              type="button" 
              className={`project-trigger ${showDropdown ? 'active' : ''}`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="project-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="project-details">
                <span className="project-label">PROJETO ATIVO</span>
                <span className="project-name">{activeProject ? activeProject.name : 'Nenhum Projeto'}</span>
              </div>
              <svg className={`chevron ${showDropdown ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {showDropdown && (
              <div className="project-dropdown animate-fade-in">
                <div className="dropdown-title">Seus Manuscritos</div>
                <div className="dropdown-scroller">
                  {projects.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      className={`dropdown-project-item ${activeProject?.id === p.id ? 'current' : ''}`}
                      onClick={() => {
                        selectProject(p);
                        setShowDropdown(false);
                      }}
                    >
                      <span className="item-title">{p.name}</span>
                      <span className="item-meta">{p.genre} • {p.visibility.toLowerCase()}</span>
                    </button>
                  ))}
                  {projects.length === 0 && (
                    <div className="dropdown-empty">Nenhum projeto encontrado.</div>
                  )}
                </div>
                <div className="dropdown-divider"></div>
                <button 
                  type="button" 
                  className="btn-new-project-trigger"
                  onClick={() => {
                    setShowDropdown(false);
                    setShowModal(true);
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Novo Projeto
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation links */}
        <nav className="sidebar-nav">
          <Link href="/editor" className={`nav-link-item ${pathname === '/editor' ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span>Editor Rica</span>
          </Link>
          
          <Link href="/gmn" className={`nav-link-item ${pathname === '/gmn' ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            <span>Grafo de Metas</span>
          </Link>

          <Link href="/kanban" className={`nav-link-item ${pathname === '/kanban' ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="15" y1="3" x2="15" y2="21"></line>
            </svg>
            <span>Quadro Kanban</span>
          </Link>

          <Link href="/profile" className={`nav-link-item ${pathname === '/profile' ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Meu Perfil</span>
          </Link>
        </nav>

        {/* User profile footer */}
        {user && (
          <div className="sidebar-footer">
            <div className="user-profile-badge">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="user-avatar" />
              ) : (
                <div className="user-avatar-placeholder">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
            </div>
            <button type="button" onClick={logout} className="btn-sidebar-logout" title="Sair da plataforma">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        )}
      </aside>
      )}

      {/* Main workspace container */}
      <main className="dashboard-viewport">
        {children}
      </main>

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-card glass">
            <div className="modal-header">
              <h3>Criar Novo Projeto</h3>
              <button type="button" className="close-modal" onClick={() => { setShowModal(false); setModalError(null); }}>&times;</button>
            </div>
            <form onSubmit={handleCreateProject} className="modal-form">
              <div className="form-group">
                <label htmlFor="modal-p-name">Nome do Projeto</label>
                <input
                  id="modal-p-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Ex: Eldritch Lich - Livro 1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-p-genre">Gênero Literário</label>
                <select
                  id="modal-p-genre"
                  value={projectGenre}
                  onChange={(e) => setProjectGenre(e.target.value)}
                >
                  <option value="Fantasia">Fantasia</option>
                  <option value="Ficção Científica">Ficção Científica</option>
                  <option value="Terror / Horror">Terror / Horror</option>
                  <option value="Suspense / Thriller">Suspense / Thriller</option>
                  <option value="Drama">Drama</option>
                  <option value="Romance Histórico">Romance Histórico</option>
                </select>
              </div>

              <div className="form-group">
                <label>Visibilidade</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="m-visibility"
                      value="PRIVADO"
                      checked={projectVisibility === 'PRIVADO'}
                      onChange={() => setProjectVisibility('PRIVADO')}
                    />
                    Privado (Apenas local-first)
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="m-visibility"
                      value="COMPARTILHADO"
                      checked={projectVisibility === 'COMPARTILHADO'}
                      onChange={() => setProjectVisibility('COMPARTILHADO')}
                    />
                    Compartilhado (Sincronizado)
                  </label>
                </div>
              </div>

              {modalError && <div className="alert alert-error animate-fade-in">{modalError}</div>}

              <div className="modal-actions">
                <button type="submit" className="btn-modal-save" disabled={modalLoading}>
                  {modalLoading ? 'Criando...' : 'Criar Projeto'}
                </button>
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => { setShowModal(false); setModalError(null); }}
                  disabled={modalLoading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Core Dashboard Layout Variables & Base Structure */
        .dashboard-layout {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background-color: #07080b;
        }

        .dashboard-sidebar {
          width: 280px;
          height: 100vh;
          background: rgba(11, 14, 18, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          flex-shrink: 0;
          z-index: 100;
        }

        .dashboard-viewport {
          flex: 1;
          height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .sidebar-brand {
          margin-bottom: 2rem;
        }

        .brand-logo {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 800;
          color: #f3f4f6;
          letter-spacing: -0.02em;
          display: inline-block;
        }

        .brand-logo span {
          color: #14b8a6;
        }

        /* Project Selector in Sidebar */
        .project-selector-wrapper {
          position: relative;
          margin-bottom: 2rem;
        }

        .project-trigger {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.65rem 0.85rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          color: #f3f4f6;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .project-trigger:hover, .project-trigger.active {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(20, 184, 166, 0.35);
          box-shadow: 0 0 12px rgba(20, 184, 166, 0.08);
        }

        .project-icon {
          color: #14b8a6;
          margin-right: 0.75rem;
          display: flex;
          align-items: center;
        }

        .project-details {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .project-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #6b7280;
          letter-spacing: 0.05em;
        }

        .project-name {
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #e5e7eb;
          margin-top: 0.1rem;
        }

        .chevron {
          color: #9ca3af;
          transition: transform 0.25s ease;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        /* Dropdown project list */
        .project-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 100%;
          background: rgba(16, 20, 26, 0.95);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 0.6rem;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
          z-index: 200;
        }

        .dropdown-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.35rem 0.5rem 0.5rem 0.5rem;
        }

        .dropdown-scroller {
          max-height: 180px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .dropdown-project-item {
          display: flex;
          flex-direction: column;
          text-align: left;
          padding: 0.55rem 0.75rem;
          border: none;
          background: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dropdown-project-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .dropdown-project-item.current {
          background: rgba(20, 184, 166, 0.08);
          border-left: 2px solid #14b8a6;
          padding-left: 0.65rem;
        }

        .dropdown-project-item.current .item-title {
          color: #14b8a6;
        }

        .item-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #e5e7eb;
        }

        .item-meta {
          font-size: 0.7rem;
          color: #9ca3af;
          margin-top: 0.15rem;
        }

        .dropdown-empty {
          font-size: 0.8rem;
          color: #6b7280;
          padding: 1rem;
          text-align: center;
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin: 0.5rem 0;
        }

        .btn-new-project-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          width: 100%;
          padding: 0.5rem;
          background: rgba(20, 184, 166, 0.1);
          border: 1px dashed rgba(20, 184, 166, 0.4);
          border-radius: 8px;
          color: #14b8a6;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-new-project-trigger:hover {
          background: rgba(20, 184, 166, 0.18);
          color: #f3f4f6;
        }

        /* Sidebar Nav Links */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }

        .nav-link-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1rem;
          color: #9ca3af;
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: 12px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link-item:hover {
          color: #f3f4f6;
          background: rgba(255, 255, 255, 0.03);
        }

        .nav-link-item.active {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(13, 148, 136, 0.05) 100%);
          border: 1px solid rgba(20, 184, 166, 0.2);
          font-weight: 600;
          box-shadow: inset 0 0 12px rgba(20, 184, 166, 0.03);
        }

        .nav-link-item.active svg {
          color: #14b8a6;
        }

        /* Sidebar Footer (User card) */
        .sidebar-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 0;
          flex: 1;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
        }

        .user-avatar-placeholder {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #14b8a6;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .user-name {
          font-size: 0.825rem;
          font-weight: 600;
          color: #e5e7eb;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 0.72rem;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 0.05rem;
        }

        .btn-sidebar-logout {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #9ca3af;
          padding: 0.45rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }

        .btn-sidebar-logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.2);
        }

        /* Modal Overlay & Styling for Global Scope */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-card {
          width: 100%;
          max-width: 440px;
          border-radius: 20px;
          padding: 2rem;
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h3 {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: #f3f4f6;
        }

        .close-modal {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.2s;
        }

        .close-modal:hover {
          color: #f3f4f6;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          color: #9ca3af;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-group input, .form-group select {
          width: 100%;
          padding: 0.75rem 1.0rem;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          color: #f3f4f6;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #14b8a6;
          box-shadow: 0 0 0 1px #14b8a6;
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-top: 0.2rem;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #9ca3af;
          cursor: pointer;
        }

        .radio-label input {
          accent-color: #14b8a6;
          width: auto !important;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .btn-modal-save {
          flex: 1;
          padding: 0.75rem;
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.25);
        }

        .btn-modal-save:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(20, 184, 166, 0.35);
        }

        .btn-modal-cancel {
          padding: 0.75rem 1.2rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          color: #9ca3af;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-modal-cancel:hover {
          color: #f3f4f6;
          background: rgba(255, 255, 255, 0.08);
        }

        .alert-error {
          padding: 0.8rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
        }
      `}</style>
    </div>
  );
}
