'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Project } from '@eldritch/domain';

export default function GoogleDocsHomeComponent() {
  const { createProject, loadingSession, logout, projects, selectProject, user } = useApp();
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('Fantasia');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openProject = (project: Project) => selectProject(project);
  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true); setError(null);
    try { await createProject(name.trim(), genre, 'PRIVADO'); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível criar o projeto.'); setBusy(false); }
  };

  if (loadingSession) return <main className="workspace-loading">Carregando projetos…</main>;

  return <div className="hub">
    <header className="hub-header"><Link className="hub-brand" href="/">Eldritch <strong>Lich</strong></Link><div><Link className="text-button" href="/profile">{user?.name ?? 'Perfil'}</Link><button type="button" className="secondary-button" onClick={logout} style={{ marginLeft: 12 }}>Sair</button></div></header>
    <main className="hub-main">
      <section className="hub-intro"><h1>Seus mundos, em um só lugar.</h1><p>Escolha um projeto para continuar escrevendo ou crie um espaço novo. Tudo começa pelo manuscrito e evolui para o planejamento e o universo da história.</p></section>
      <section className="hub-grid" aria-label="Projetos">
        {projects.map(project => <article className="project-card" key={project.id}><small>{project.genre} · {project.visibility === 'PRIVADO' ? 'local' : 'compartilhado'}</small><h2>{project.name}</h2><p>Capítulos, referências e planejamento separados neste espaço.</p><button className="primary-button" type="button" onClick={() => openProject(project)}>Abrir manuscrito</button></article>)}
        <article className="new-project-card"><h2>Novo projeto</h2><form onSubmit={create}><input aria-label="Nome do projeto" placeholder="Ex.: O mapa das marés" value={name} onChange={event => setName(event.target.value)} required /><select aria-label="Gênero" value={genre} onChange={event => setGenre(event.target.value)}><option>Fantasia</option><option>Ficção científica</option><option>Romance</option><option>Suspense</option><option>Não-ficção</option></select>{error && <span className="form-error">{error}</span>}<button className="primary-button" disabled={busy}>{busy ? 'Criando…' : 'Criar projeto'}</button></form></article>
      </section>
      {!projects.length && <p className="empty-state">Ainda não há nenhum projeto. Crie o primeiro para começar seu manuscrito.</p>}
    </main>
  </div>;
}
