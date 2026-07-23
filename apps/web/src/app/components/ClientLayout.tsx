'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { db, Reminder } from '../../db/schema';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    user, 
    projects, 
    activeProject, 
    loadingSession, 
    selectProject, 
    createProject, 
    logout,
    hideSidebar,
    refreshSession,
    pendingInvites
  } = useApp();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectGenre, setProjectGenre] = useState('Fantasia');
  const [projectVisibility, setProjectVisibility] = useState<'PRIVADO' | 'COMPARTILHADO'>('PRIVADO');
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const isResizingSidebar = React.useRef(false);

  const handleSidebarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingSidebar.current = true;
    document.addEventListener('mousemove', handleSidebarMouseMove);
    document.addEventListener('mouseup', handleSidebarMouseUp);
  };

  const handleSidebarMouseMove = (e: MouseEvent) => {
    if (!isResizingSidebar.current) return;
    const newW = Math.max(180, Math.min(480, e.clientX));
    setSidebarWidth(newW);
  };

  const handleSidebarMouseUp = () => {
    isResizingSidebar.current = false;
    document.removeEventListener('mousemove', handleSidebarMouseMove);
    document.removeEventListener('mouseup', handleSidebarMouseUp);
  };

  // Collaboration States
  const [showShareModal, setShowShareModal] = useState(false);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('LEITOR');
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);

  // Reminders / Alerts States (UC-116)
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminderPanel, setShowReminderPanel] = useState(false);
  const [dueReminder, setDueReminder] = useState<Reminder | null>(null);
  
  // Creation States
  const [isCreatingReminder, setIsCreatingReminder] = useState(false);
  const [remText, setRemText] = useState('');
  const [remTime, setRemTime] = useState('');
  const [remImportance, setRemImportance] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [linkActiveChapter, setLinkActiveChapter] = useState(false);

  // Load reminders from DB
  const loadReminders = async () => {
    if (!activeProject) return;
    try {
      const all = await db.reminders.where('projectId').equals(activeProject.id).toArray();
      setReminders(all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeProject) {
      loadReminders();
    }
  }, [activeProject]);

  // Alert Checking Engine (checks unread alerts every 5 seconds)
  useEffect(() => {
    if (!activeProject || !user) return;
    
    const interval = setInterval(async () => {
      const nowStr = new Date().toISOString();
      try {
        const unread = await db.reminders
          .where('projectId')
          .equals(activeProject.id)
          .filter(r => !r.isRead && r.alertTime <= nowStr)
          .toArray();
        
        if (unread.length > 0) {
          setDueReminder(unread[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeProject, user]);

  const getActiveChapterId = () => {
    if (typeof window !== 'undefined' && pathname === '/editor') {
      return new URLSearchParams(window.location.search).get('chapterId') || undefined;
    }
    return undefined;
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remText.trim() || !remTime) return;
    if (!activeProject) return;

    const newReminder: Reminder = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      text: remText,
      projectId: activeProject.id,
      manuscriptId: linkActiveChapter ? getActiveChapterId() : undefined,
      alertTime: new Date(remTime).toISOString(),
      importance: remImportance,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    try {
      await db.reminders.add(newReminder);
      setRemText('');
      setRemTime('');
      setIsCreatingReminder(false);
      await loadReminders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await db.reminders.update(id, { isRead: true });
      if (dueReminder?.id === id) {
        setDueReminder(null);
      }
      await loadReminders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSnoozeReminder = async (id: string) => {
    try {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      const newAlertTime = now.toISOString();
      await db.reminders.update(id, { alertTime: newAlertTime });
      if (dueReminder?.id === id) {
        setDueReminder(null);
      }
      await loadReminders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await db.reminders.delete(id);
      await loadReminders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenShareModal = async () => {
    if (!activeProject) return;
    setShowShareModal(true);
    setShareError(null);
    setShareSuccess(null);
    loadCollaborators();
  };

  const loadCollaborators = async () => {
    if (!activeProject) return;
    try {
      const res = await fetch(`/api/projects/share?projectId=${activeProject.id}`);
      const data = await res.json();
      if (res.ok && data.collaborators) {
        setCollaborators(data.collaborators);
      }
    } catch (err) {
      console.error('Erro ao carregar colaboradores:', err);
    }
  };

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !shareEmail) return;
    setShareError(null);
    setShareSuccess(null);
    setShareLoading(true);

    try {
      const res = await fetch('/api/projects/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          email: shareEmail,
          permission: sharePermission
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setShareSuccess('Convite enviado com sucesso!');
      setShareEmail('');
      setSharePermission('LEITOR');
      loadCollaborators();
    } catch (err: any) {
      setShareError(err.message || 'Erro ao enviar convite.');
    } finally {
      setShareLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    if (!confirm('Deseja realmente remover este colaborador do projeto?')) return;
    try {
      const res = await fetch('/api/projects/share/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collaboratorId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      loadCollaborators();
    } catch (err: any) {
      alert(err.message || 'Erro ao remover colaborador.');
    }
  };

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      const res = await fetch('/api/projects/share/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      await refreshSession();
      alert('Convite aceito com sucesso! O projeto agora está na sua lista.');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Erro ao aceitar convite.');
    }
  };

  const handleRejectInvite = async (inviteId: string) => {
    try {
      const res = await fetch('/api/projects/share/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      await refreshSession();
      alert('Convite recusado.');
    } catch (err: any) {
      alert(err.message || 'Erro ao recusar convite.');
    }
  };

  useEffect(() => {
    // Client-side authentication guard: redirect to login if session loaded and no user
    if (!loadingSession && !user && !pathname.startsWith('/auth')) {
      router.push('/auth');
    }
  }, [user, loadingSession, pathname, router]);

  useEffect(() => {
    // Flow Validation: If user accesses /gmn, /kanban, /editor, /stats or /wiki without an active project, redirect to Google Docs Hub (/)
    if (!loadingSession && !activeProject && (pathname === '/gmn' || pathname === '/kanban' || pathname === '/editor' || pathname === '/stats' || pathname === '/wiki')) {
      router.push('/');
    }
  }, [activeProject, loadingSession, pathname, router]);

  // If we are on auth pages or home hub, do not render the outer dashboard wrapper
  const isAuthPage = pathname.startsWith('/auth');
  const isHomePage = pathname === '/' || pathname === '/projects' || pathname === '/dashboard';

  if (isAuthPage || isHomePage) {
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
    <div className={`dashboard-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar navigation */}
      {!hideSidebar && (
        <aside 
          className={`dashboard-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}
          style={{ width: isSidebarCollapsed ? 64 : sidebarWidth }}
        >
          {!isSidebarCollapsed && (
            <div 
              className="sidebar-resizer-handle"
              onMouseDown={handleSidebarMouseDown}
              title="Clique e arraste para redimensionar o menu lateral"
            />
          )}
        <div className="sidebar-brand">
          <Link href="/" className="brand-logo" title="Voltar para a Central de Projetos">
            {isSidebarCollapsed ? <span>⚡</span> : <>Eldritch<span>Lich</span></>}
          </Link>
          <button 
            type="button" 
            className="btn-collapse-sidebar-toggle"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? "Expandir Menu Lateral" : "Recolher Menu Lateral"}
          >
            {isSidebarCollapsed ? '▶' : '◀'}
          </button>
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
                <div className="dropdown-title">Trocar de Projeto</div>
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

        {/* Share Project Trigger (Only for Owner) */}
        {user && activeProject && activeProject.ownerId === user.id && (
          <button 
            type="button" 
            className="btn-share-project-sidebar glass"
            onClick={handleOpenShareModal}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            Compartilhar Manuscrito
          </button>
        )}

        {/* Pending Invites Section */}
        {pendingInvites && pendingInvites.length > 0 && (
          <div className="pending-invites-section">
            <div className="section-title">Convites de Equipe ({pendingInvites.length})</div>
            <div className="invites-list">
              {pendingInvites.map(invite => (
                <div key={invite.inviteId} className="invite-item glass">
                  <div className="invite-details">
                    <span className="invite-project">{invite.projectName}</span>
                    <span className="invite-meta">De: {invite.invitedBy} • {invite.permission.toLowerCase()}</span>
                  </div>
                  <div className="invite-actions">
                    <button 
                      onClick={() => handleAcceptInvite(invite.inviteId)} 
                      className="btn-invite-accept" 
                      title="Aceitar Convite"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => handleRejectInvite(invite.inviteId)} 
                      className="btn-invite-reject" 
                      title="Recusar Convite"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation links */}
        <nav className="sidebar-nav">
          <Link href="/" className="nav-link-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Voltar a Projetos</span>
          </Link>

          <Link href="/editor" className={`nav-link-item ${pathname === '/editor' ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span>Manuscrito</span>
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

          <Link href="/stats" className={`nav-link-item ${pathname === '/stats' ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <span>Estatísticas</span>
          </Link>

          <Link href="/wiki" className={`nav-link-item ${pathname === '/wiki' ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span>Wiki do Universo</span>
          </Link>
        </nav>

        {/* User profile footer (Clickable as a link to Profile) */}
        {user && (
          <div className="sidebar-footer">
            <Link href="/profile" className="user-profile-badge-link" title="Ir para as Configurações de Perfil">
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
            </Link>
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
      <div className="workspace-main-wrapper">
        {/* Universal Top Workspace Header */}
        <header className="global-workspace-topbar glass">
          <div className="topbar-left">
            <div className="topbar-page-title">
              {pathname === '/editor' && <strong>🖋️ Manuscrito Principal</strong>}
              {pathname === '/gmn' && <strong>⚡ Grafo de Metas Causal</strong>}
              {pathname === '/kanban' && <strong>📊 Quadro Kanban</strong>}
              {pathname === '/stats' && <strong>📈 Estatísticas & Métricas</strong>}
              {pathname === '/wiki' && <strong>📖 Wiki & Universo</strong>}
              {pathname === '/profile' && <strong>👤 Configurações do Perfil</strong>}
            </div>
          </div>

          <div className="topbar-right">
            {activeProject && (
              <span className="global-project-badge" title="Projeto Ativo">
                📁 {activeProject.name}
              </span>
            )}
            <span className="global-ai-status">🟢 IA Local Pronta</span>

            {/* Notification Bell (UC-116) */}
            {user && activeProject && (
              <button 
                onClick={() => setShowReminderPanel(!showReminderPanel)} 
                className={`global-bell-btn ${reminders.filter(r => !r.isRead).length > 0 ? 'has-unread' : ''}`}
                title="Lembretes & Notificações"
              >
                🔔
                {reminders.filter(r => !r.isRead).length > 0 && (
                  <span className="bell-badge">{reminders.filter(r => !r.isRead).length}</span>
                )}
              </button>
            )}
          </div>
        </header>

        <main className="dashboard-viewport">
          {children}
        </main>
      </div>

      {/* Reminders Slide-over Panel (UC-116) */}
      {showReminderPanel && (
        <div className="reminders-slide-over glass animate-fade-in">
          <div className="reminders-panel-header">
            <h4>🔔 Lembretes & Alertas</h4>
            <button onClick={() => { setShowReminderPanel(false); setIsCreatingReminder(false); }} className="btn-close-panel">×</button>
          </div>

          <div className="reminders-panel-body">
            {!isCreatingReminder ? (
              <>
                <button 
                  onClick={() => {
                    setIsCreatingReminder(true);
                    const defaultTime = new Date();
                    defaultTime.setHours(defaultTime.getHours() + 1);
                    defaultTime.setMinutes(defaultTime.getMinutes() - defaultTime.getTimezoneOffset());
                    setRemTime(defaultTime.toISOString().slice(0, 16));
                    setLinkActiveChapter(!!getActiveChapterId());
                  }} 
                  className="btn-add-reminder-trigger"
                >
                  + Criar Novo Lembrete
                </button>

                {reminders.length === 0 ? (
                  <div className="no-reminders-state">
                    <span>Nenhum lembrete configurado.</span>
                  </div>
                ) : (
                  <div className="reminders-list">
                    {reminders.map(rem => (
                      <div 
                        key={rem.id} 
                        className={`reminder-item-card glass-card importance-${rem.importance.toLowerCase()} ${rem.isRead ? 'read' : 'unread'}`}
                      >
                        <div className="reminder-item-header">
                          <span className="importance-dot" />
                          <span className="importance-label">
                            {rem.importance === 'LOW' ? 'Baixa' : rem.importance === 'MEDIUM' ? 'Média' : 'Alta'}
                          </span>
                          <span className="reminder-date">
                            {new Date(rem.alertTime).toLocaleDateString('pt-BR')} {new Date(rem.alertTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="reminder-text">{rem.text}</p>
                        
                        {rem.manuscriptId && (
                          <Link 
                            href={`/editor?chapterId=${rem.manuscriptId}`}
                            onClick={() => setShowReminderPanel(false)}
                            className="reminder-linked-doc"
                          >
                            📄 Abrir Capítulo Vinculado
                          </Link>
                        )}

                        <div className="reminder-card-actions">
                          {!rem.isRead && (
                            <>
                              <button 
                                onClick={() => handleMarkAsRead(rem.id)} 
                                className="btn-rem-action read"
                              >
                                ✓ Lido
                              </button>
                              <button 
                                onClick={() => handleSnoozeReminder(rem.id)} 
                                className="btn-rem-action snooze"
                              >
                                ⏰ Adiar 5m
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleDeleteReminder(rem.id)} 
                            className="btn-rem-action delete"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleAddReminder} className="reminder-creation-form animate-fade-in">
                <h5>Novo Lembrete Causal</h5>
                
                <div className="form-group">
                  <label>Texto do Lembrete:</label>
                  <textarea 
                    value={remText}
                    onChange={(e) => setRemText(e.target.value)}
                    placeholder="Escreva a anotação do lembrete..."
                    required
                    maxLength={200}
                  />
                </div>

                <div className="form-group">
                  <label>Data & Hora do Alerta:</label>
                  <input 
                    type="datetime-local"
                    value={remTime}
                    onChange={(e) => setRemTime(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Importância:</label>
                  <select 
                    value={remImportance}
                    onChange={(e) => setRemImportance(e.target.value as any)}
                  >
                    <option value="LOW">🔵 Baixa</option>
                    <option value="MEDIUM">🟡 Média</option>
                    <option value="HIGH">🔴 Alta</option>
                  </select>
                </div>

                {getActiveChapterId() && (
                  <div className="form-group checkbox-group">
                    <input 
                      type="checkbox"
                      id="link-chapter-checkbox"
                      checked={linkActiveChapter}
                      onChange={(e) => setLinkActiveChapter(e.target.checked)}
                    />
                    <label htmlFor="link-chapter-checkbox">Vincular ao capítulo ativo</label>
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn-save-reminder">Agendar Lembrete</button>
                  <button 
                    type="button" 
                    onClick={() => setIsCreatingReminder(false)} 
                    className="btn-cancel-reminder"
                  >
                    Voltar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Due Alert Floating Popup Modal */}
      {dueReminder && (
        <div className="due-reminder-overlay animate-fade-in">
          <div className="due-reminder-card glass-card animate-scale-up">
            <div className={`due-banner importance-${dueReminder.importance.toLowerCase()}`}>
              <span className="due-bell-animation">⏰</span>
              <strong>ALERTA DE LEMBRETE ({dueReminder.importance === 'LOW' ? 'BAIXA' : dueReminder.importance === 'MEDIUM' ? 'MÉDIA' : 'ALTA'})</strong>
            </div>
            <div className="due-body">
              <h3>{dueReminder.text}</h3>
              
              {dueReminder.manuscriptId && (
                <Link 
                  href={`/editor?chapterId=${dueReminder.manuscriptId}`} 
                  onClick={() => setDueReminder(null)}
                  className="due-reminder-link"
                >
                  📄 Acessar Capítulo Vinculado
                </Link>
              )}
            </div>

            <div className="due-card-actions">
              <button 
                onClick={() => handleMarkAsRead(dueReminder.id)} 
                className="btn-due-action read"
              >
                Marcar como Lido
              </button>
              <button 
                onClick={() => handleSnoozeReminder(dueReminder.id)} 
                className="btn-due-action snooze"
              >
                Adiar 5 minutos
              </button>
            </div>
          </div>
        </div>
      )}

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
      {/* Share Project Modal */}
      {showShareModal && activeProject && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-card glass share-modal">
            <div className="modal-header">
              <h3>Compartilhar Projeto: {activeProject.name}</h3>
              <button 
                type="button" 
                className="close-modal" 
                onClick={() => { setShowShareModal(false); setShareError(null); setShareSuccess(null); }}
              >&times;</button>
            </div>
            
            <div className="share-modal-body">
              {/* Form to add collaborator */}
              <form onSubmit={handleAddCollaborator} className="share-add-form">
                <div className="form-group">
                  <label htmlFor="share-email">E-mail do Colaborador</label>
                  <div className="share-input-row">
                    <input
                      id="share-email"
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      placeholder="colaborador@email.com"
                      required
                    />
                    <select
                      value={sharePermission}
                      onChange={(e) => setSharePermission(e.target.value)}
                      className="share-select-permission"
                    >
                      <option value="LEITOR">Leitor</option>
                      <option value="EDITOR">Editor</option>
                      <option value="ADMINISTRADOR">Administrador</option>
                    </select>
                    <button 
                      type="submit" 
                      className="btn-share-invite" 
                      disabled={shareLoading}
                    >
                      {shareLoading ? 'Enviando...' : 'Convidar'}
                    </button>
                  </div>
                </div>
              </form>

              {shareError && <div className="alert alert-error animate-fade-in">{shareError}</div>}
              {shareSuccess && <div className="alert alert-success animate-fade-in">{shareSuccess}</div>}

              {/* Collaborators List */}
              <div className="collaborators-list-section">
                <h4>Colaboradores do Projeto</h4>
                <div className="collaborators-table-wrapper">
                  {collaborators.length === 0 ? (
                    <p className="empty-collaborators">Este projeto ainda não foi compartilhado com ninguém.</p>
                  ) : (
                    <table className="collaborators-table">
                      <thead>
                        <tr>
                          <th>E-mail</th>
                          <th>Permissão</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collaborators.map(c => {
                          const now = Date.now();
                          const isExpired = c.status === 'PENDENTE' && new Date(c.expiresAt).getTime() < now;
                          
                          return (
                            <tr key={c.id}>
                              <td>{c.userEmail}</td>
                              <td>
                                <span className={`badge-permission ${c.permission}`}>
                                  {c.permission.toLowerCase()}
                                </span>
                              </td>
                              <td>
                                {isExpired ? (
                                  <span className="status-badge expired">Expirado</span>
                                ) : (
                                  <span className={`status-badge ${c.status.toLowerCase()}`}>
                                    {c.status.toLowerCase()}
                                  </span>
                                )}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCollaborator(c.id)}
                                  className="btn-remove-collab"
                                  title="Remover colaborador"
                                >
                                  Remover
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-modal-close" 
                onClick={() => { setShowShareModal(false); setShareError(null); setShareSuccess(null); }}
              >
                Fechar
              </button>
            </div>
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
          position: relative;
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
          transition: width 0.1s ease, padding 0.2s ease;
        }

        .sidebar-resizer-handle {
          position: absolute;
          top: 0;
          right: -3px;
          width: 6px;
          height: 100%;
          cursor: col-resize;
          z-index: 150;
          transition: background 0.15s ease;
        }

        .workspace-main-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .global-workspace-topbar {
          height: 48px;
          min-height: 48px;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.25rem;
          z-index: 90;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .global-brand-logo {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          text-decoration: none;
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .global-brand-logo .brand-icon {
          font-size: 1.2rem;
          color: #3b82f6;
        }

        .global-brand-logo .brand-title span {
          color: #3b82f6;
        }

        .topbar-page-title {
          font-size: 0.92rem;
          font-weight: 600;
          color: #f1f5f9;
          letter-spacing: 0.2px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .user-profile-badge-link {
          text-decoration: none;
          display: block;
          flex: 1;
          min-width: 0;
          transition: transform 0.2s ease;
        }

        .user-profile-badge-link:hover {
          transform: translateX(2px);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .global-project-badge {
          font-size: 0.78rem;
          font-weight: 600;
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.6rem;
          border-radius: 14px;
        }

        .global-ai-status {
          font-size: 0.75rem;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          padding: 0.2rem 0.6rem;
          border-radius: 14px;
        }

        /* Collapsible Sidebar Styles */
        .dashboard-layout.sidebar-collapsed .dashboard-sidebar {
          width: 64px !important;
          padding: 1.25rem 0.5rem !important;
          align-items: center;
        }

        .dashboard-layout.sidebar-collapsed .dashboard-viewport {
          flex: 1 !important;
          width: calc(100vw - 64px) !important;
        }

        .dashboard-layout.sidebar-collapsed .project-details,
        .dashboard-layout.sidebar-collapsed .project-label,
        .dashboard-layout.sidebar-collapsed .project-name,
        .dashboard-layout.sidebar-collapsed .chevron,
        .dashboard-layout.sidebar-collapsed .user-info,
        .dashboard-layout.sidebar-collapsed .nav-link-item span,
        .dashboard-layout.sidebar-collapsed .btn-share-project-sidebar span,
        .dashboard-layout.sidebar-collapsed .pending-invites-section {
          display: none !important;
        }

        .dashboard-layout.sidebar-collapsed .nav-link-item {
          justify-content: center !important;
          padding: 0.75rem !important;
        }

        .dashboard-layout.sidebar-collapsed .project-trigger {
          padding: 0.6rem !important;
          justify-content: center !important;
        }

        .dashboard-layout.sidebar-collapsed .project-icon {
          margin-right: 0 !important;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 1.5rem;
        }

        .btn-collapse-sidebar-toggle {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #9ca3af;
          border-radius: 6px;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-collapse-sidebar-toggle:hover {
          background: rgba(20, 184, 166, 0.2);
          color: #14b8a6;
          border-color: rgba(20, 184, 166, 0.4);
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

        .alert-success {
          padding: 0.8rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #34d399;
          margin-bottom: 1rem;
        }

        .btn-share-project-sidebar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          margin: 0.5rem 0 1rem 0;
          background: rgba(20, 184, 166, 0.08);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 8px;
          color: #2dd4bf;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-share-project-sidebar:hover {
          background: rgba(20, 184, 166, 0.15);
          border-color: rgba(20, 184, 166, 0.4);
          color: #2dd4bf;
          transform: translateY(-1px);
        }

        .pending-invites-section {
          padding: 0 0.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1rem;
        }

        .pending-invites-section .section-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: #9ca3af;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .invites-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .invite-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.8rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .invite-details {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .invite-project {
          font-weight: 600;
          font-size: 0.85rem;
          color: #f3f4f6;
        }

        .invite-meta {
          font-size: 0.7rem;
          color: #9ca3af;
        }

        .invite-actions {
          display: flex;
          gap: 0.25rem;
        }

        .btn-invite-accept, .btn-invite-reject {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          font-weight: bold;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-invite-accept {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .btn-invite-accept:hover {
          background: #10b981;
          color: #ffffff;
        }

        .btn-invite-reject {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .btn-invite-reject:hover {
          background: #ef4444;
          color: #ffffff;
        }

        .share-modal {
          max-width: 550px !important;
        }

        .share-modal-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .share-add-form {
          margin-bottom: 0.5rem;
        }

        .share-input-row {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .share-input-row input {
          flex: 1;
        }

        .share-select-permission {
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          color: #f3f4f6;
          font-weight: 500;
          outline: none;
        }

        .btn-share-invite {
          padding: 0.75rem 1.25rem;
          background: #14b8a6;
          color: #050608;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-share-invite:hover {
          background: #0d9488;
          transform: translateY(-1px);
        }

        .collaborators-list-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .collaborators-list-section h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #f3f4f6;
          margin: 0;
        }

        .collaborators-table-wrapper {
          background: rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          overflow: hidden;
        }

        .empty-collaborators {
          padding: 1.5rem;
          text-align: center;
          color: #9ca3af;
          font-size: 0.85rem;
          margin: 0;
        }

        .collaborators-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }

        .collaborators-table th, .collaborators-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .collaborators-table th {
          background: rgba(255, 255, 255, 0.02);
          color: #9ca3af;
          font-weight: 600;
        }

        .collaborators-table tr:last-child td {
          border-bottom: none;
        }

        .badge-permission {
          display: inline-block;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge-permission.LEITOR {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .badge-permission.EDITOR {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .badge-permission.ADMINISTRADOR {
          background: rgba(245, 158, 11, 0.1);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .status-badge {
          display: inline-block;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.pendente {
          background: rgba(245, 158, 11, 0.1);
          color: #fbbf24;
        }

        .status-badge.aceito {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
        }

        .status-badge.expired {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
        }

        .btn-remove-collab {
          background: none;
          border: none;
          color: #f87171;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }

        .btn-remove-collab:hover {
          color: #ef4444;
          text-decoration: underline;
        }

        .btn-modal-close {
          padding: 0.75rem 1.2rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          color: #e5e7eb;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-modal-close:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        /* Universal Notification Bell (UC-116) */
        .global-bell-btn {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.2s;
          margin-left: 0.5rem;
        }

        .global-bell-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }

        .global-bell-btn.has-unread {
          animation: wiggle 1s ease infinite;
          border-color: rgba(20, 184, 166, 0.4);
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0); }
          15% { transform: rotate(-15deg); }
          30% { transform: rotate(10deg); }
          45% { transform: rotate(-10deg); }
          60% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }

        .bell-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.05rem 0.25rem;
          border-radius: 10px;
          min-width: 16px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        /* Reminders Slide-over Panel */
        .reminders-slide-over {
          position: fixed;
          top: 0;
          right: 0;
          width: 380px;
          height: 100vh;
          background: rgba(15, 23, 42, 0.98);
          border-left: 1px solid var(--border-light);
          z-index: 150;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(0,0,0,0.5);
          font-family: var(--font-sans);
        }

        .workspace-main-wrapper:has(.main-content.theme-light) .reminders-slide-over {
          background: #ffffff !important;
          border-left-color: rgba(15, 23, 42, 0.1) !important;
          box-shadow: -10px 0 30px rgba(15, 23, 42, 0.05) !important;
        }

        .reminders-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-light);
        }

        .workspace-main-wrapper:has(.main-content.theme-light) .reminders-panel-header h4 {
          color: #0f172a !important;
        }

        .reminders-panel-header h4 {
          font-size: 1.05rem;
          font-weight: 750;
          color: #fff;
          margin: 0;
        }

        .btn-close-panel {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.5rem;
          cursor: pointer;
          line-height: 1;
        }

        .btn-close-panel:hover {
          color: var(--text-primary);
        }

        .reminders-panel-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .btn-add-reminder-trigger {
          background: rgba(20, 184, 166, 0.12);
          border: 1px solid rgba(20, 184, 166, 0.3);
          color: #14b8a6;
          padding: 0.6rem;
          font-size: 0.85rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          width: 100%;
        }

        .btn-add-reminder-trigger:hover {
          background: #14b8a6;
          color: #fff;
          box-shadow: 0 2px 10px rgba(20, 184, 166, 0.25);
        }

        .no-reminders-state {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          color: var(--text-muted);
          font-size: 0.88rem;
          text-align: center;
        }

        .reminders-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .reminder-item-card {
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid var(--border-light);
          background: rgba(255, 255, 255, 0.02);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: transform 0.2s;
        }

        .workspace-main-wrapper:has(.main-content.theme-light) .reminder-item-card {
          background: rgba(15, 23, 42, 0.02) !important;
          border-color: rgba(15, 23, 42, 0.08) !important;
        }

        .reminder-item-card:hover {
          transform: translateY(-2px);
        }

        .reminder-item-card.read {
          opacity: 0.6;
        }

        .reminder-item-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 600;
        }

        .importance-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }

        .importance-low .importance-dot { background: #3b82f6; }
        .importance-medium .importance-dot { background: #f59e0b; }
        .importance-high .importance-dot { background: #ef4444; }

        .importance-label {
          font-weight: 700;
          text-transform: uppercase;
        }

        .importance-low .importance-label { color: #3b82f6; }
        .importance-medium .importance-label { color: #f59e0b; }
        .importance-high .importance-label { color: #ef4444; }

        .reminder-date {
          margin-left: auto;
          color: var(--text-muted);
        }

        .reminder-text {
          font-size: 0.88rem;
          color: var(--text-primary);
          line-height: 1.4;
          margin: 0;
          word-break: break-word;
        }

        .workspace-main-wrapper:has(.main-content.theme-light) .reminder-text {
          color: #0f172a !important;
        }

        .reminder-linked-doc {
          font-size: 0.78rem;
          color: #14b8a6;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .reminder-linked-doc:hover {
          text-decoration: underline;
        }

        .reminder-card-actions {
          display: flex;
          gap: 0.4rem;
          margin-top: 0.35rem;
          border-top: 1px solid var(--border-light);
          padding-top: 0.5rem;
        }

        .btn-rem-action {
          padding: 0.25rem 0.5rem;
          font-size: 0.72rem;
          font-weight: 700;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: background 0.15s;
        }

        .btn-rem-action.read {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .btn-rem-action.read:hover {
          background: #10b981;
          color: #fff;
        }

        .btn-rem-action.snooze {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }

        .btn-rem-action.snooze:hover {
          background: #f59e0b;
          color: #fff;
        }

        .btn-rem-action.delete {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          margin-left: auto;
        }

        .btn-rem-action.delete:hover {
          background: #ef4444;
          color: #fff;
        }

        /* Reminder Form */
        .reminder-creation-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .reminder-creation-form h5 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.5rem 0;
        }

        .workspace-main-wrapper:has(.main-content.theme-light) .reminder-creation-form h5 {
          color: #0f172a !important;
        }

        .reminder-creation-form .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .reminder-creation-form label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .reminder-creation-form textarea {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          color: #fff;
          padding: 0.5rem;
          border-radius: 6px;
          font-size: 0.85rem;
          min-height: 80px;
          resize: none;
          outline: none;
          font-family: inherit;
        }

        .workspace-main-wrapper:has(.main-content.theme-light) .reminder-creation-form textarea {
          background: rgba(15, 23, 42, 0.03) !important;
          border-color: rgba(15, 23, 42, 0.15) !important;
          color: #0f172a !important;
        }

        .reminder-creation-form textarea:focus {
          border-color: #14b8a6;
        }

        .reminder-creation-form input[type="datetime-local"],
        .reminder-creation-form select {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          color: #fff;
          padding: 0.5rem;
          border-radius: 6px;
          font-size: 0.85rem;
          outline: none;
        }

        .workspace-main-wrapper:has(.main-content.theme-light) .reminder-creation-form input[type="datetime-local"],
        .workspace-main-wrapper:has(.main-content.theme-light) .reminder-creation-form select {
          background: rgba(15, 23, 42, 0.03) !important;
          border-color: rgba(15, 23, 42, 0.15) !important;
          color: #0f172a !important;
        }

        .reminder-creation-form input[type="datetime-local"]:focus,
        .reminder-creation-form select:focus {
          border-color: #14b8a6;
        }

        .checkbox-group {
          flex-direction: row !important;
          align-items: center;
          gap: 0.5rem !important;
          margin: 0.25rem 0;
        }

        .checkbox-group input {
          cursor: pointer;
        }

        .checkbox-group label {
          cursor: pointer;
          text-transform: none !important;
          font-size: 0.82rem !important;
          font-weight: 500 !important;
        }

        .form-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .btn-save-reminder {
          flex: 1;
          background: #14b8a6;
          border: none;
          color: #fff;
          padding: 0.55rem;
          font-size: 0.82rem;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .btn-save-reminder:hover {
          background: #0d9488;
        }

        .btn-cancel-reminder {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          padding: 0.55rem 1rem;
          font-size: 0.82rem;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel-reminder:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
        }

        /* Due Alert Overlay */
        .due-reminder-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(7, 8, 11, 0.8);
          backdrop-filter: blur(8px);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sans);
        }

        .due-reminder-card {
          width: 440px;
          padding: 0;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
          background: #0f172a;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
        }

        .due-banner {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 1rem 1.5rem;
          font-size: 0.8rem;
          color: #fff;
        }

        .due-banner.importance-low { background: #1e3a8a; }
        .due-banner.importance-medium { background: #78350f; }
        .due-banner.importance-high { background: #7f1d1d; }

        .due-bell-animation {
          display: inline-block;
          animation: ringBell 0.5s ease infinite alternate;
        }

        @keyframes ringBell {
          from { transform: rotate(-15deg); }
          to { transform: rotate(15deg); }
        }

        .due-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .due-body h3 {
          font-size: 1.2rem;
          font-weight: 750;
          color: #fff;
          margin: 0;
          line-height: 1.4;
        }

        .due-body p {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin: 0;
        }

        .due-reminder-link {
          font-size: 0.85rem;
          color: #14b8a6;
          text-decoration: none;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.25rem;
        }

        .due-reminder-link:hover {
          text-decoration: underline;
        }

        .due-card-actions {
          display: flex;
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(0, 0, 0, 0.2);
          gap: 0.75rem;
        }

        .btn-due-action {
          flex: 1;
          padding: 0.6rem;
          border-radius: 8px;
          border: none;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-due-action.read {
          background: #14b8a6;
          color: #fff;
        }

        .btn-due-action.read:hover {
          background: #0d9488;
        }

        .btn-due-action.snooze {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #e5e7eb;
        }

        .btn-due-action.snooze:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
}
