'use client';

import { FormEvent, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import styles from './ClientLayout.module.css';
import { ProjectContextStrip } from './ProjectContextStrip';

const WORKSPACE_LINKS = [
  { href: '/editor', label: 'Manuscritos', description: 'Escrever e organizar capítulos' },
  { href: '/kanban', label: 'Planejamento', description: 'Cenas e metas narrativas' },
  { href: '/worldbuilding', label: 'Universo', description: 'Personagens, lugares e itens' },
  { href: '/timeline', label: 'Linha do tempo', description: 'Eventos e causalidade' },
  { href: '/stats', label: 'Progresso', description: 'Ritmo e estatísticas de escrita' },
];

const MODULE_GROUPS = [
  { label: 'Construção da história', links: [{ href: '/story', label: 'Arquitetura da história' }, { href: '/gdd', label: 'Documento de design' }, { href: '/gmn', label: 'Grafo de metas' }, { href: '/mindmaps', label: 'Mapas mentais' }, { href: '/maps', label: 'Mapas do mundo' }] },
  { label: 'Pesquisa e análise', links: [{ href: '/wiki', label: 'Wiki e relações' }, { href: '/research', label: 'Pesquisa' }, { href: '/nlp', label: 'Análise textual' }, { href: '/semantics', label: 'Semântica' }, { href: '/gallery', label: 'Galeria' }] },
  { label: 'Colaboração', links: [{ href: '/calendar', label: 'Calendário' }, { href: '/chat', label: 'Conversas' }, { href: '/calls', label: 'Chamadas' }, { href: '/meetings', label: 'Reuniões' }, { href: '/team', label: 'Equipe' }, { href: '/settings/notifications', label: 'Notificações' }] },
  { label: 'Administração', links: [{ href: '/finance', label: 'Finanças' }, { href: '/finance-automation', label: 'Automação financeira' }, { href: '/finance-reporting', label: 'Relatórios financeiros' }, { href: '/forecast', label: 'Previsões' }, { href: '/hr', label: 'Pessoas' }, { href: '/okrs', label: 'Objetivos' }, { href: '/portfolio', label: 'Portfólio' }, { href: '/sandbox', label: 'Laboratório' }] },
];

const PROJECT_ROUTES = [...WORKSPACE_LINKS.flatMap(link => [link.href]), ...MODULE_GROUPS.flatMap(group => group.links.map(link => link.href))];

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeProject, createProject, loadingSession, projects, selectProject, user } = useApp();
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('Fantasia');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPublicPage = pathname === '/' || pathname === '/projects' || pathname === '/dashboard' || pathname.startsWith('/auth');
  const needsProject = PROJECT_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));

  useEffect(() => {
    if (!loadingSession && !user && !pathname.startsWith('/auth')) router.replace('/auth');
  }, [loadingSession, pathname, router, user]);

  useEffect(() => {
    if (!loadingSession && user && !activeProject && needsProject) router.replace('/');
  }, [activeProject, loadingSession, needsProject, router, user]);

  const handleCreateProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createProject(name.trim(), genre, 'PRIVADO');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível criar o projeto.');
      setSubmitting(false);
    }
  };

  if (isPublicPage) return <>{children}</>;

  if (loadingSession) {
    return <main className="workspace-loading" aria-live="polite">Abrindo seu espaço de escrita…</main>;
  }

  return (
    <div className="workspace-shell">
      <aside className={`workspace-sidebar ${styles.sidebar}`} aria-label="Navegação do projeto">
        <Link href="/" className="workspace-brand">Eldritch <strong>Lich</strong></Link>

        <div className="project-switcher">
          <button className="project-switcher-button" type="button" onClick={() => setShowProjectMenu(value => !value)} aria-expanded={showProjectMenu}>
            <span>Projeto atual</span>
            <strong>{activeProject?.name ?? 'Selecione um projeto'}</strong>
          </button>
          {showProjectMenu && (
            <div className="project-switcher-menu">
              {projects.map(project => (
                <button key={project.id} type="button" className={project.id === activeProject?.id ? 'is-active' : ''} onClick={() => selectProject(project)}>
                  <strong>{project.name}</strong><small>{project.genre}</small>
                </button>
              ))}
              <button type="button" className="new-project-button" onClick={() => { setShowProjectMenu(false); setShowCreateProject(true); }}>+ Novo projeto</button>
            </div>
          )}
        </div>

        <nav className="workspace-nav">
          <p>Espaço de escrita</p>
          {WORKSPACE_LINKS.map(link => (
            <Link key={link.href} href={link.href} className={pathname === link.href ? 'is-active' : ''}>
              <strong>{link.label}</strong><small>{link.description}</small>
            </Link>
          ))}
          <div className={styles.moduleGroups}>
            {MODULE_GROUPS.map(group => {
              const active = group.links.some(link => pathname === link.href);
              return <details key={group.label} open={active} className={styles.moduleGroup}><summary>{group.label}</summary><div>{group.links.map(link => <Link key={link.href} href={link.href} className={pathname === link.href ? 'is-active' : ''}>{link.label}</Link>)}</div></details>;
            })}
          </div>
        </nav>

        <Link href="/profile" className="workspace-profile">
          <span>{user?.name?.slice(0, 1).toUpperCase() ?? 'U'}</span>
          <div><strong>{user?.name ?? 'Conta local'}</strong><small>Preferências e segurança</small></div>
        </Link>
      </aside>

      <section className="workspace-page">
        <header className="workspace-header">
          <div><span>Projeto</span><strong>{activeProject?.name}</strong></div>
          <Link href="/" className="text-button">Todos os projetos</Link>
        </header>
        {needsProject && activeProject && <ProjectContextStrip />}
        {children}
      </section>

      {showCreateProject && (
        <div className="dialog-backdrop" role="presentation">
          <form className="dialog-card" onSubmit={handleCreateProject}>
            <h2>Novo projeto</h2>
            <p>O projeto separa localmente seus capítulos, referências e planejamento.</p>
            <label>Nome<input value={name} onChange={event => setName(event.target.value)} autoFocus required /></label>
            <label>Gênero<select value={genre} onChange={event => setGenre(event.target.value)}><option>Fantasia</option><option>Ficção científica</option><option>Romance</option><option>Suspense</option><option>Não-ficção</option></select></label>
            {error && <p className="form-error">{error}</p>}
            <div className="dialog-actions"><button type="button" className="secondary-button" onClick={() => setShowCreateProject(false)}>Cancelar</button><button type="submit" className="primary-button" disabled={submitting}>{submitting ? 'Criando…' : 'Criar projeto'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
