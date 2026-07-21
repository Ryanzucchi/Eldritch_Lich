'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Project } from '@eldritch/domain';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectGenre, setProjectGenre] = useState('Fantasia');
  const [projectVisibility, setProjectVisibility] = useState<'PRIVADO' | 'COMPARTILHADO'>('PRIVADO');
  const [modalError, setModalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch session & projects on mount
  useEffect(() => {
    async function initNavbar() {
      try {
        // 1. Session check
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        if (sessionData.authenticated && sessionData.user) {
          setUser(sessionData.user);
          
          // 2. Fetch projects
          const projRes = await fetch('/api/projects');
          const projData = await projRes.json();
          if (projData.projects) {
            setProjects(projData.projects);
            
            // 3. Resolve active project
            const savedActiveId = localStorage.getItem('activeProjectId');
            let current = projData.projects.find((p: Project) => p.id === savedActiveId);
            
            if (!current && projData.projects.length > 0) {
              // Fallback to first project if none saved or saved is missing
              current = projData.projects[0];
              localStorage.setItem('activeProjectId', current.id);
            }
            
            if (current) {
              setActiveProject(current);
            }
          }
        }
      } catch (err) {
        console.error('Navbar initialization failed:', err);
      }
    }
    initNavbar();
  }, []);

  const handleSelectProject = (project: Project) => {
    localStorage.setItem('activeProjectId', project.id);
    setActiveProject(project);
    setShowDropdown(false);
    window.location.reload(); // Reload to re-initialize Dexie with the correct namespace
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          genre: projectGenre,
          visibility: projectVisibility
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao criar projeto.');
      }

      const newProj = data.project;
      setProjects([...projects, newProj]);
      localStorage.setItem('activeProjectId', newProj.id);
      
      setProjectName('');
      setProjectGenre('Fantasia');
      setProjectVisibility('PRIVADO');
      setShowModal(false);
      
      window.location.reload(); // Reload to open the database namespace for the new project
    } catch (err: any) {
      setModalError(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth');
    router.refresh();
  };

  return (
    <>
      <header className="navbar glass">
        <div className="navbar-left">
          <Link href="/gmn" className="logo">Eldritch<span>Lich</span></Link>
          
          {user && (
            <div className="project-selector-container">
              <button 
                type="button" 
                className="project-selector-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="project-badge">PROJETO</span>
                <span className="project-name">{activeProject ? activeProject.name : 'Selecione...'}</span>
                <svg className={`chevron-icon ${showDropdown ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {showDropdown && (
                <div className="project-dropdown glass animate-fade-in">
                  <div className="dropdown-header">Meus Projetos</div>
                  <div className="dropdown-list">
                    {projects.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        className={`dropdown-item ${activeProject?.id === p.id ? 'active' : ''}`}
                        onClick={() => handleSelectProject(p)}
                      >
                        <span className="item-name">{p.name}</span>
                        <span className="item-genre">{p.genre}</span>
                      </button>
                    ))}
                    {projects.length === 0 && (
                      <div className="empty-projects">Nenhum projeto cadastrado.</div>
                    )}
                  </div>
                  <div className="dropdown-footer">
                    <button 
                      type="button" 
                      className="btn-new-project"
                      onClick={() => { setShowDropdown(false); setShowModal(true); }}
                    >
                      + Novo Projeto
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <nav className="nav-links">
          <Link href="/editor" className={`nav-item ${pathname === '/editor' ? 'active' : ''}`}>Editor</Link>
          <Link href="/gmn" className={`nav-item ${pathname === '/gmn' ? 'active' : ''}`}>Grafo de Metas</Link>
          <Link href="/kanban" className={`nav-item ${pathname === '/kanban' ? 'active' : ''}`}>Quadro Kanban</Link>
        </nav>

        <div className="user-menu">
          {user && (
            <Link href="/profile" className="user-profile-link">
              <span className="user-name">Olá, {user.name}</span>
            </Link>
          )}
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

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
                <label htmlFor="m-proj-name">Nome do Projeto</label>
                <input
                  id="m-proj-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Ex: Eldritch Lich - Livro 1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="m-proj-genre">Gênero Literário</label>
                <select
                  id="m-proj-genre"
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
                      name="visibility"
                      value="PRIVADO"
                      checked={projectVisibility === 'PRIVADO'}
                      onChange={() => setProjectVisibility('PRIVADO')}
                    />
                    Privado (Apenas local-first)
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="visibility"
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
                <button type="submit" className="btn-modal-save" disabled={loading}>
                  {loading ? 'Criando...' : 'Criar Projeto'}
                </button>
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => { setShowModal(false); setModalError(null); }}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem 2rem;
          height: 60px;
          z-index: 10;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .logo {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 0;
        }

        .logo span {
          color: var(--color-andamento);
        }

        .project-selector-container {
          position: relative;
        }

        .project-selector-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .project-selector-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--border-glow);
        }

        .project-badge {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-andamento);
          background: rgba(20, 184, 166, 0.1);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
        }

        .project-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chevron-icon {
          color: var(--text-secondary);
          transition: transform 0.2s;
        }

        .chevron-icon.open {
          transform: rotate(180deg);
        }

        .project-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 240px;
          border-radius: 12px;
          z-index: 100;
          padding: 0.5rem 0;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }

        .dropdown-header {
          padding: 0.4rem 1rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 0.4rem;
        }

        .dropdown-list {
          max-height: 200px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .dropdown-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          padding: 0.6rem 1rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .dropdown-item.active {
          background: rgba(20, 184, 166, 0.08);
          border-left: 3px solid var(--color-andamento);
        }

        .item-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .item-genre {
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-top: 0.15rem;
        }

        .empty-projects {
          padding: 0.8rem 1rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          text-align: center;
        }

        .dropdown-footer {
          border-top: 1px solid var(--border-light);
          padding: 0.4rem 0.5rem 0 0.5rem;
          margin-top: 0.4rem;
        }

        .btn-new-project {
          width: 100%;
          padding: 0.45rem;
          background: rgba(20, 184, 166, 0.1);
          border: 1px dashed var(--border-active);
          border-radius: 6px;
          color: var(--color-andamento);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-new-project:hover {
          background: rgba(20, 184, 166, 0.18);
          color: var(--text-primary);
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
        }

        .nav-item {
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          transition: all 0.2s;
          color: var(--text-secondary);
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }

        .nav-item.active {
          color: var(--color-andamento);
          background: rgba(20, 184, 166, 0.08);
          font-weight: 600;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-profile-link {
          display: inline-block;
        }

        .user-name {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
          transition: color 0.2s;
        }

        .user-profile-link:hover .user-name {
          color: var(--color-andamento);
        }

        .btn-logout {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.35);
          color: #f87171;
        }

        /* Modal styling */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-card {
          width: 100%;
          max-width: 460px;
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
          color: var(--text-primary);
        }

        .close-modal {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: color 0.2s;
        }

        .close-modal:hover {
          color: var(--text-primary);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
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
          font-size: 0.875rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .radio-label input {
          accent-color: var(--color-andamento);
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .btn-modal-save {
          flex: 1;
          padding: 0.75rem;
          background: linear-gradient(135deg, var(--color-andamento) 0%, #0d9488 100%);
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.25);
        }

        .btn-modal-save:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(20, 184, 166, 0.35);
        }

        .btn-modal-cancel {
          padding: 0.75rem 1.2rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-modal-cancel:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </>
  );
}
