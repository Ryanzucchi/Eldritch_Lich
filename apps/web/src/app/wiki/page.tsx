'use client';

import React, { useState, useEffect } from 'react';
import { db, WikiEntity } from '../../db/schema';
import { useApp } from '../../context/AppContext';

const SEED_ENTITIES = [
  {
    name: 'Kael',
    type: 'Personagem' as const,
    description: 'Protagonista da história, um jovem caçador atormentado por pesadelos que descobre ser o último herdeiro da linhagem do eclipse.',
    content: 'Kael é um caçador habilidoso que vive na periferia do vilarejo de Oakhaven. Sua jornada começa quando ele encontra o Medalhão Antigo nas raízes da Árvore Anciã na Floresta dos Sussurros. Kael precisa escapar do Castelo Sombrio, onde Lorde Varis governa com mão de ferro, e encontrar a lendária Espada do Eclipse para deter as trevas ascendentes.',
    isConfidential: false
  },
  {
    name: 'Elara',
    type: 'Personagem' as const,
    description: 'Mentora de Kael, uma antiga guardiã que conhece os segredos da magia proibida do eclipse.',
    content: 'Elara vive como uma eremita na Floresta dos Sussurros. Ela reconhece o potencial de Kael e o ensina a canalizar o poder contido no Medalhão Antigo. Elara avisa Kael sobre a ameaça constante de Lorde Varis e o orienta na busca pela Espada do Eclipse.',
    isConfidential: false
  },
  {
    name: 'Lorde Varis',
    type: 'Personagem' as const,
    description: 'Antagonista principal, usurpador do trono do eclipse e governante tirânico das Terras Sombrias.',
    content: 'Lorde Varis comanda seus exércitos a partir do Castelo Sombrio. Ele busca obsessivamente o Medalhão Antigo para consolidar seu controle absoluto sobre o reino. Varis teme a profecia de Kael e fará de tudo para impedir que ele empunhe a Espada do Eclipse.',
    isConfidential: false
  },
  {
    name: 'Castelo Sombrio',
    type: 'Local' as const,
    description: 'Fortaleza colossal de pedra negra erguida sobre um abismo vulcânico, sede do poder de Lorde Varis.',
    content: 'O Castelo Sombrio é cercado por névoas perpétuas e guardado por criaturas sombrias sob o comando direto de Lorde Varis. Kael deve infiltrar-se em suas masmorras para resgatar aliados e recuperar mapas estelares cruciais.',
    isConfidential: false
  },
  {
    name: 'Floresta dos Sussurros',
    type: 'Local' as const,
    description: 'Bosque antigo e misterioso onde as árvores parecem falar e as leis do tempo são distorcidas.',
    content: 'A Floresta dos Sussurros abriga a Árvore Anciã, sob a qual o Medalhão Antigo permaneceu soterrado por séculos até Kael encontrá-lo. É o refúgio seguro de Elara e o local onde segredos causais do universo são sussurrados pelo vento.',
    isConfidential: false
  },
  {
    name: 'Medalhão Antigo',
    type: 'Item' as const,
    description: 'Artefato de ouro e obsidiana com inscrições rúnicas que reagem à linhagem de Kael.',
    content: 'O Medalhão Antigo serve como chave para destravar templos ancestrais e é o único objeto capaz de dissipar a barreira mágica que protege a Espada do Eclipse. Lorde Varis deseja o medalhão para drenar seu poder de cronomancia.',
    isConfidential: false
  },
  {
    name: 'Espada do Eclipse',
    type: 'Item' as const,
    description: 'Lendária arma de metal estelar forjada durante o Grande Alinhamento, capaz de ferir seres de pura sombra.',
    content: 'A Espada do Eclipse está selada no coração do Castelo Sombrio. Somente Kael, ativando o Medalhão Antigo sob a tutela de Elara, possui o direito de empunhá-la para derrotar o tirano Lorde Varis.',
    isConfidential: false
  },
  {
    name: 'Notas Secretas de Varis',
    type: 'Item' as const,
    description: 'Diário confidencial de Lorde Varis detalhando o ritual para drenar a alma de Kael.',
    content: 'Notas secretas mantidas nos aposentos privados do Castelo Sombrio. Revelam o plano secreto de Varis para usar o Medalhão Antigo e aniquilar a linhagem de Kael de todas as linhas temporais possíveis.',
    isConfidential: true
  }
];

export default function WikiPage() {
  const { activeProject } = useApp();

  const [entities, setEntities] = useState<WikiEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<WikiEntity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'Personagem' | 'Local' | 'Item' | 'Organizacao'>('ALL');
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<'Personagem' | 'Local' | 'Item' | 'Organizacao'>('Personagem');
  const [editDescription, setEditDescription] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editIsConfidential, setEditIsConfidential] = useState(false);

  // Modal compiler states (UC-090, UC-091)
  const [showWikiModal, setShowWikiModal] = useState(false);
  const [isPublicWiki, setIsPublicWiki] = useState(false);
  const [compilingStatus, setCompilingStatus] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadEntities = async () => {
    if (!activeProject) return;
    try {
      const list = await db.wikiEntities.where('projectId').equals(activeProject.id).toArray();
      
      // Auto seed if empty
      if (list.length === 0) {
        const toAdd = SEED_ENTITIES.map(ent => ({
          ...ent,
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
          projectId: activeProject.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        await Promise.all(toAdd.map(ent => db.wikiEntities.add(ent)));
        const seeded = await db.wikiEntities.where('projectId').equals(activeProject.id).toArray();
        setEntities(seeded.sort((a, b) => a.name.localeCompare(b.name)));
        if (seeded.length > 0) setSelectedEntity(seeded[0]);
      } else {
        const sorted = list.sort((a, b) => a.name.localeCompare(b.name));
        setEntities(sorted);
        if (sorted.length > 0 && !selectedEntity) {
          setSelectedEntity(sorted[0]);
        }
      }
    } catch (e) {
      console.error('Falha ao carregar wiki:', e);
    }
  };

  useEffect(() => {
    if (activeProject) {
      loadEntities();
    }
  }, [activeProject]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleStartCreate = () => {
    setSelectedEntity(null);
    setIsEditing(true);
    setEditName('');
    setEditType('Personagem');
    setEditDescription('');
    setEditContent('');
    setEditIsConfidential(false);
  };

  const handleStartEdit = (ent: WikiEntity) => {
    setIsEditing(true);
    setEditName(ent.name);
    setEditType(ent.type);
    setEditDescription(ent.description);
    setEditContent(ent.content);
    setEditIsConfidential(ent.isConfidential);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !activeProject) return;

    const data = {
      name: editName,
      type: editType,
      description: editDescription,
      content: editContent,
      isConfidential: editIsConfidential,
      updatedAt: new Date().toISOString()
    };

    try {
      if (selectedEntity) {
        // Update
        await db.wikiEntities.update(selectedEntity.id, data);
        setSuccess('Artigo atualizado com sucesso!');
      } else {
        // Create
        const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
        const newEntity: WikiEntity = {
          ...data,
          id: newId,
          projectId: activeProject.id,
          createdAt: new Date().toISOString()
        };
        await db.wikiEntities.add(newEntity);
        setSuccess('Novo artigo criado no universo!');
        setSelectedEntity(newEntity);
      }
      setIsEditing(false);
      await loadEntities();
    } catch (e) {
      console.error(e);
      setError('Erro ao salvar artigo da wiki.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza de que deseja deletar este artigo da wiki permanentemente?')) {
      try {
        await db.wikiEntities.delete(id);
        setSuccess('Artigo removido.');
        setSelectedEntity(null);
        setIsEditing(false);
        await loadEntities();
      } catch (e) {
        console.error(e);
        setError('Erro ao deletar artigo.');
      }
    }
  };

  // Cross-linking engine: search for other entities inside the rich content (UC-090 step 3)
  const renderFormattedContent = (content: string) => {
    if (!content) return { __html: '<em>Sem conteúdo detalhado registrado.</em>' };
    let html = content.replace(/\n/g, '<br/>');
    
    // Sort by name length descending to avoid substring hijacking
    const sorted = [...entities].sort((a, b) => b.name.length - a.name.length);
    sorted.forEach(ent => {
      if (selectedEntity?.id === ent.id) return;
      // Match word boundaries safely
      const regex = new RegExp(`\\b${ent.name}\\b`, 'gi');
      html = html.replace(regex, `<span class="wiki-inline-link" data-entity-id="${ent.id}">${ent.name}</span>`);
    });

    return { __html: html };
  };

  const handleWikiLinkClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('wiki-inline-link')) {
      const id = target.getAttribute('data-entity-id');
      if (id) {
        const found = entities.find(ent => ent.id === id);
        if (found) {
          setSelectedEntity(found);
          setIsEditing(false);
        }
      }
    }
  };

  // UC-090: Standalone single-page app HTML compiler
  const handleCompileWikiHtml = () => {
    if (!activeProject) return;
    setCompilingStatus('Compilando artigos...');
    
    setTimeout(() => {
      const publicEntities = entities.filter(e => isPublicWiki ? true : !e.isConfidential);
      
      if (publicEntities.length === 0) {
        setCompilingStatus(null);
        setError('Não há entidades públicas para exportar!');
        return;
      }

      // Generate embedded SPA HTML code
      const jsonEntities = JSON.stringify(publicEntities);
      const compiledHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wiki do Universo - ${activeProject.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #07080b;
      --panel: #0f172a;
      --border: rgba(255,255,255,0.06);
      --primary: #14b8a6;
      --text: #e5e7eb;
      --text-muted: #9ca3af;
    }
    body {
      margin: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    aside {
      width: 320px;
      border-right: 1px solid var(--border);
      background: var(--panel);
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    h1 { font-size: 1.25rem; font-weight: 800; margin: 0; color: #fff; }
    h2 { font-size: 1.5rem; color: #fff; margin-top: 0; }
    .search-box {
      padding: 1rem;
      border-bottom: 1px solid var(--border);
    }
    input {
      width: 100%;
      box-sizing: border-box;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: 6px;
      color: #fff;
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;
      outline: none;
    }
    .list {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }
    .item-btn {
      width: 100%;
      text-align: left;
      background: none;
      border: none;
      color: var(--text);
      padding: 0.6rem 0.8rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.88rem;
      margin-bottom: 0.35rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .item-btn:hover { background: rgba(255,255,255,0.03); }
    .item-btn.active { background: var(--primary); color: #fff; }
    .badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      text-transform: uppercase;
      background: rgba(255,255,255,0.08);
      color: var(--text-muted);
    }
    .badge.personagem { background: rgba(20, 184, 166, 0.15); color: #14b8a6; }
    .badge.local { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
    .badge.item { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .badge.organizacao { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
    main {
      flex: 1;
      padding: 3rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .card {
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2.5rem;
      max-width: 800px;
    }
    .wiki-link {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
    }
    .wiki-link:hover { text-decoration: underline; }
    @media (max-width: 768px) {
      body { flex-direction: column; }
      aside { width: 100%; height: 350px; border-right: none; border-bottom: 1px solid var(--border); }
      main { padding: 1.5rem; }
    }
  </style>
</head>
<body>
  <aside>
    <div class="header">
      <h1>📚 Wiki - ${activeProject.name}</h1>
    </div>
    <div class="search-box">
      <input type="text" id="search" placeholder="Buscar no universo..." oninput="onSearch()">
    </div>
    <div class="list" id="list"></div>
  </aside>
  <main>
    <div class="card" id="card">
      <p style="color: var(--text-muted);">Selecione um tópico na barra lateral para explorar.</p>
    </div>
  </main>

  <script>
    const entities = ${jsonEntities};
    let activeId = null;

    function renderList(filtered = entities) {
      const container = document.getElementById('list');
      container.innerHTML = '';
      filtered.forEach(e => {
        const btn = document.createElement('button');
        btn.className = 'item-btn' + (e.id === activeId ? ' active' : '');
        btn.onclick = () => selectEntity(e.id);
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = e.name;
        
        const typeBadge = document.createElement('span');
        typeBadge.className = 'badge ' + e.type.toLowerCase();
        typeBadge.textContent = e.type.substring(0, 4);

        btn.appendChild(nameSpan);
        btn.appendChild(typeBadge);
        container.appendChild(btn);
      });
    }

    function selectEntity(id) {
      activeId = id;
      renderList();
      const ent = entities.find(e => e.id === id);
      if (!ent) return;

      const card = document.getElementById('card');
      let bodyText = ent.content || 'Sem descrição detalhada.';
      
      // Auto crosslink
      const sorted = [...entities].sort((a,b) => b.name.length - a.name.length);
      sorted.forEach(other => {
        if (other.id === id) return;
        const regex = new RegExp('\\\\b' + other.name + '\\\\b', 'gi');
        bodyText = bodyText.replace(regex, '<a href="#" class="wiki-link" onclick="event.preventDefault(); selectEntity(\\''+other.id+'\\')">' + other.name + '</a>');
      });

      card.innerHTML = \`
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.5rem;">
          <span class="badge \${ent.type.toLowerCase()}" style="font-size:0.75rem; padding:0.25rem 0.6rem;">\${ent.type}</span>
          <h2 style="margin:0;">\${ent.name}</h2>
        </div>
        <p style="font-size:1.05rem; font-style:italic; color:var(--text-muted); margin-bottom:2rem; line-height:1.6; border-left:3px solid var(--primary); padding-left:1rem;">\${ent.description}</p>
        <div style="line-height:1.8; font-size:1.05rem; color:var(--text);">\${bodyText}</div>
      \`;
    }

    function onSearch() {
      const q = document.getElementById('search').value.toLowerCase();
      const filtered = entities.filter(e => 
        e.name.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q)
      );
      renderList(filtered);
    }

    renderList();
    if (entities.length > 0) {
      selectEntity(entities[0].id);
    }
  </script>
</body>
</html>`;

      const blob = new Blob([compiledHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wiki_${activeProject.name.toLowerCase().replace(/\s+/g, '_')}.html`;
      a.click();
      URL.revokeObjectURL(url);
      
      setCompilingStatus(null);
      setShowWikiModal(false);
      setSuccess('Portal Wiki compilado e baixado com sucesso!');
    }, 1000);
  };

  // UC-091: Markdown document compiler
  const handleCompileDocMarkdown = () => {
    if (!activeProject) return;
    setCompilingStatus('Gerando manual...');

    setTimeout(() => {
      // Grouping by type and sort alphabetically (UC-091 Accept Criteria)
      const categories: { [key: string]: WikiEntity[] } = {
        'Personagens': [],
        'Locais': [],
        'Itens': [],
        'Organizações': []
      };

      entities.filter(e => !e.isConfidential).forEach(e => {
        const catName = e.type === 'Personagem' ? 'Personagens' :
                        e.type === 'Local' ? 'Locais' :
                        e.type === 'Item' ? 'Itens' : 'Organizações';
        categories[catName].push(e);
      });

      // Sort alphabetically inside categories
      Object.keys(categories).forEach(k => {
        categories[k].sort((a, b) => a.name.localeCompare(b.name));
      });

      let mdText = `# Manual do Universo - ${activeProject.name}\n`;
      mdText += `*Documentação gerada de forma automatizada em: ${new Date().toLocaleDateString('pt-BR')}*\n\n`;

      let isEmpty = true;
      Object.keys(categories).forEach(k => {
        if (categories[k].length > 0) {
          isEmpty = false;
          mdText += `## ${k}\n\n`;
          categories[k].forEach(e => {
            mdText += `### ${e.name}\n`;
            mdText += `*Descrição:* ${e.description}\n\n`;
            mdText += `${e.content}\n\n`;
            mdText += `---\n\n`;
          });
        }
      });

      if (isEmpty) {
        setCompilingStatus(null);
        setError('Documentação vazia. Insira entidades para gerar a documentação automática (UC-091).');
        return;
      }

      const blob = new Blob([mdText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `manual_${activeProject.name.toLowerCase().replace(/\s+/g, '_')}.md`;
      a.click();
      URL.revokeObjectURL(url);

      setCompilingStatus(null);
      setSuccess('Documentação técnica baixada (.md)!');
    }, 800);
  };

  const filteredEntities = entities.filter(e => {
    const matchesCategory = selectedCategory === 'ALL' || e.type === selectedCategory;
    const matchesSearch = !searchQuery || 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="wiki-container animate-fade-in">
      {/* Sidebar navigation list */}
      <aside className="wiki-sidebar glass">
        <div className="sidebar-top">
          <button onClick={handleStartCreate} className="btn-create-entity">
            + Novo Artigo do Universo
          </button>
          <input 
            type="text"
            placeholder="Buscar no universo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="wiki-search-box"
          />
        </div>

        <div className="category-tabs">
          {['ALL', 'Personagem', 'Local', 'Item', 'Organizacao'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`cat-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat === 'ALL' ? 'Todos' : cat === 'Organizacao' ? 'Org' : cat}
            </button>
          ))}
        </div>

        <div className="entities-scroll-list">
          {filteredEntities.length === 0 ? (
            <div className="empty-search-state">Nenhuma entidade correspondente.</div>
          ) : (
            filteredEntities.map(ent => (
              <div 
                key={ent.id}
                onClick={() => { setSelectedEntity(ent); setIsEditing(false); }}
                className={`entity-sidebar-card ${selectedEntity?.id === ent.id ? 'active' : ''}`}
              >
                <div className="sidebar-card-header">
                  <strong>{ent.name}</strong>
                  <span className={`type-badge-mini ${ent.type.toLowerCase()}`}>
                    {ent.type.substring(0, 4)}
                  </span>
                </div>
                <p className="sidebar-card-desc">{ent.description}</p>
                {ent.isConfidential && <span className="confidential-indicator">🔒 Oculto</span>}
              </div>
            ))
          )}
        </div>

        <div className="sidebar-compilers-bar">
          <button 
            onClick={() => setShowWikiModal(true)} 
            className="btn-compiler wiki"
            title="Exportar wiki estática SPA interativa autolinkada"
          >
            🌐 Compilar Wiki HTML
          </button>
          <button 
            onClick={handleCompileDocMarkdown} 
            className="btn-compiler doc"
            title="Exportar manual técnico organizado alfabeticamente em Markdown"
          >
            📄 Manual em Markdown
          </button>
        </div>
      </aside>

      {/* Main Preview/Editor Panel */}
      <main className="wiki-main-content glass" onClick={handleWikiLinkClick}>
        {isEditing ? (
          <form onSubmit={handleSave} className="wiki-form-editor">
            <h3>{selectedEntity ? '✏️ Editar Artigo' : '➕ Novo Artigo de Worldbuilding'}</h3>

            <div className="form-group-row">
              <div className="form-field">
                <label>Nome da Entidade:</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Ex: Espada do Eclipse, Lorde Varis..."
                  required
                  className="editor-input"
                />
              </div>

              <div className="form-field">
                <label>Tipo de Elemento:</label>
                <select 
                  value={editType} 
                  onChange={(e) => setEditType(e.target.value as any)}
                  className="editor-select"
                >
                  <option value="Personagem">Personagem</option>
                  <option value="Local">Local</option>
                  <option value="Item">Item</option>
                  <option value="Organizacao">Organização</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Resumo / Descrição Curta:</label>
              <input 
                type="text" 
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Uma frase resumindo esta entidade..."
                maxLength={150}
                className="editor-input"
              />
            </div>

            <div className="form-field flex-grow">
              <label>Conteúdo Detalhado (Lore da Wiki):</label>
              <textarea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Escreva a biografia, história, relacionamentos, ou propriedades físicas..."
                className="editor-textarea"
                rows={12}
              />
            </div>

            <div className="form-field checkbox-row">
              <input 
                type="checkbox" 
                id="confidential-checkbox"
                checked={editIsConfidential}
                onChange={(e) => setEditIsConfidential(e.target.checked)}
              />
              <label htmlFor="confidential-checkbox">
                <strong>Ocultar da Compilação Pública (Confidencial/Rascunho)</strong>
                <span className="checkbox-tip">Se ativado, esta entidade será excluída da exportação pública da Wiki.</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save-entity">Salvar Artigo</button>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  if (!selectedEntity && entities.length > 0) {
                    setSelectedEntity(entities[0]);
                  }
                }} 
                className="btn-cancel-edit"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : selectedEntity ? (
          <div className="wiki-article-view">
            <div className="article-header">
              <div className="title-row">
                <span className={`type-badge ${selectedEntity.type.toLowerCase()}`}>
                  {selectedEntity.type}
                </span>
                <h2>{selectedEntity.name}</h2>
                {selectedEntity.isConfidential && (
                  <span className="badge-confidential">🔒 Oculto/Privado</span>
                )}
              </div>
              <div className="article-actions">
                <button onClick={() => handleStartEdit(selectedEntity)} className="btn-act edit">✏️ Editar</button>
                <button onClick={() => handleDelete(selectedEntity.id)} className="btn-act delete">🗑️ Excluir</button>
              </div>
            </div>

            <p className="article-subtitle">{selectedEntity.description}</p>
            <div 
              className="article-body-content"
              dangerouslySetInnerHTML={renderFormattedContent(selectedEntity.content)}
            />
          </div>
        ) : (
          <div className="no-entity-selected">
            <h3>📚 Portal de Worldbuilding & Lore</h3>
            <p>Não há nenhum artigo cadastrado ou correspondente à busca. Adicione entidades para estruturar seu universo ficcional.</p>
            <button onClick={handleStartCreate} className="btn-create-entity">
              Criar Primeira Entidade
            </button>
          </div>
        )}
      </main>

      {/* Wiki SPA compiler modal */}
      {showWikiModal && (
        <div className="wiki-compiler-overlay animate-fade-in">
          <div className="compiler-modal glass-card animate-scale-up">
            <div className="modal-header">
              <h3>🌐 Compilação do Portal Web Wiki</h3>
              <button onClick={() => setShowWikiModal(false)} className="btn-close-modal">×</button>
            </div>

            <div className="modal-body">
              <p className="compiler-desc">
                Este processo exporta todo o conhecimento público estruturado de seu universo ficcional em uma aplicação estática (index.html) single-page com buscas instantâneas e navegação autolinkada.
              </p>

              <div className="compiler-stats">
                <div className="stat-row">
                  <span>Total de artigos:</span>
                  <strong>{entities.length}</strong>
                </div>
                <div className="stat-row">
                  <span>Artigos confidenciais ocultos:</span>
                  <strong className="orange-text">{entities.filter(e => e.isConfidential).length}</strong>
                </div>
                <div className="stat-row border-top">
                  <span>Artigos no compilador final:</span>
                  <strong className="cyan-text">
                    {entities.filter(e => isPublicWiki ? true : !e.isConfidential).length}
                  </strong>
                </div>
              </div>

              <div className="form-group checkbox-row">
                <input 
                  type="checkbox"
                  id="include-confidential-compilation"
                  checked={isPublicWiki}
                  onChange={(e) => setIsPublicWiki(e.target.checked)}
                />
                <label htmlFor="include-confidential-compilation">
                  <strong>Ignorar sigilo e incluir ocultos na compilação</strong>
                  <span className="checkbox-tip">Útil para exportar um backup privado contendo todo o lore.</span>
                </label>
              </div>

              {compilingStatus && (
                <div className="compiler-status animate-fade-in">
                  <span className="loading-spinner">⚙️</span>
                  <span>{compilingStatus}</span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                onClick={handleCompileWikiHtml}
                disabled={!!compilingStatus}
                className="btn-compile-run"
              >
                Gerar e Baixar Wiki (.html)
              </button>
              <button 
                onClick={() => setShowWikiModal(false)}
                disabled={!!compilingStatus}
                className="btn-compile-close"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error toasts */}
      {success && (
        <div className="success-toast glass animate-fade-in">
          <span className="toast-icon">✓</span>
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="error-toast glass animate-fade-in">
          <span className="toast-icon">×</span>
          <span>{error}</span>
        </div>
      )}

      <style jsx global>{`
        .wiki-container {
          display: flex;
          height: 100%;
          width: 100%;
          gap: 1rem;
          padding: 1rem;
          box-sizing: border-box;
          font-family: var(--font-sans);
        }

        .wiki-sidebar {
          width: 320px;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border-light);
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.45);
          overflow: hidden;
        }

        .sidebar-top {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border-light);
        }

        .btn-create-entity {
          background: #14b8a6;
          border: none;
          color: #fff;
          padding: 0.6rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
          width: 100%;
          text-align: center;
        }

        .btn-create-entity:hover {
          background: #0d9488;
        }

        .wiki-search-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          color: #fff;
          padding: 0.5rem 0.75rem;
          font-size: 0.82rem;
          outline: none;
        }

        .wiki-search-box:focus {
          border-color: #14b8a6;
        }

        .category-tabs {
          display: flex;
          padding: 0.5rem 1rem;
          gap: 0.25rem;
          border-bottom: 1px solid var(--border-light);
          background: rgba(0,0,0,0.1);
        }

        .cat-tab-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0.3rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .cat-tab-btn:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.02);
        }

        .cat-tab-btn.active {
          background: rgba(20, 184, 166, 0.12);
          color: #14b8a6;
        }

        .entities-scroll-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .entity-sidebar-card {
          padding: 0.75rem;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.01);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .entity-sidebar-card:hover {
          background: rgba(255,255,255,0.03);
          border-color: var(--border-light);
        }

        .entity-sidebar-card.active {
          background: rgba(20, 184, 166, 0.08);
          border-color: rgba(20, 184, 166, 0.25);
        }

        .sidebar-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #fff;
        }

        .type-badge-mini {
          font-size: 0.62rem;
          font-weight: 800;
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          text-transform: uppercase;
          background: rgba(255,255,255,0.05);
          color: var(--text-muted);
        }

        .type-badge-mini.personagem { background: rgba(20, 184, 166, 0.12); color: #14b8a6; }
        .type-badge-mini.local { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
        .type-badge-mini.item { background: rgba(245, 158, 11, 0.12); color: #f59e0b; }
        .type-badge-mini.organizacao { background: rgba(139, 92, 246, 0.12); color: #8b5cf6; }

        .sidebar-card-desc {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .confidential-indicator {
          font-size: 0.65rem;
          font-weight: 700;
          color: #f59e0b;
          align-self: flex-start;
          margin-top: 0.15rem;
        }

        .sidebar-compilers-bar {
          padding: 0.75rem;
          border-top: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          background: rgba(0,0,0,0.15);
        }

        .btn-compiler {
          width: 100%;
          border: none;
          color: #fff;
          padding: 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
        }

        .btn-compiler.wiki {
          background: rgba(20, 184, 166, 0.12);
          border: 1px solid rgba(20, 184, 166, 0.25);
          color: #14b8a6;
        }

        .btn-compiler.wiki:hover {
          background: #14b8a6;
          color: #fff;
        }

        .btn-compiler.doc {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-light);
          color: var(--text-primary);
        }

        .btn-compiler.doc:hover {
          background: rgba(255,255,255,0.08);
        }

        .wiki-main-content {
          flex: 1;
          border: 1px solid var(--border-light);
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.35);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .wiki-article-view {
          display: flex;
          flex-direction: column;
        }

        .article-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1rem;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .title-row h2 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
        }

        .type-badge {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .type-badge.personagem { background: rgba(20, 184, 166, 0.15); color: #14b8a6; }
        .type-badge.local { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .type-badge.item { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .type-badge.organizacao { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }

        .badge-confidential {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }

        .article-actions {
          display: flex;
          gap: 0.4rem;
        }

        .btn-act {
          background: none;
          border: none;
          padding: 0.4rem 0.75rem;
          font-size: 0.78rem;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .btn-act.edit {
          background: rgba(255,255,255,0.05);
          color: var(--text-primary);
        }

        .btn-act.edit:hover {
          background: rgba(255,255,255,0.1);
        }

        .btn-act.delete {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .btn-act.delete:hover {
          background: #ef4444;
          color: #fff;
        }

        .article-subtitle {
          font-size: 1.1rem;
          font-style: italic;
          color: var(--text-muted);
          line-height: 1.5;
          margin: 0 0 2rem 0;
          border-left: 3px solid #14b8a6;
          padding-left: 1rem;
        }

        .article-body-content {
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--text-primary);
        }

        /* Wiki Inline Cross-links styling */
        .wiki-inline-link {
          color: #14b8a6;
          font-weight: 700;
          cursor: pointer;
          border-bottom: 1px dashed rgba(20, 184, 166, 0.4);
          transition: all 0.15s;
        }

        .wiki-inline-link:hover {
          color: #0d9488;
          border-bottom-style: solid;
          background: rgba(20, 184, 166, 0.05);
        }

        .no-entity-selected {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: var(--text-muted);
          gap: 1rem;
          max-width: 420px;
          margin: 0 auto;
        }

        .no-entity-selected h3 {
          font-size: 1.25rem;
          color: #fff;
          margin: 0;
        }

        .no-entity-selected p {
          font-size: 0.88rem;
          line-height: 1.6;
          margin: 0;
        }

        /* Wiki Form Editor styling */
        .wiki-form-editor {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          height: 100%;
        }

        .wiki-form-editor h3 {
          font-size: 1.2rem;
          font-weight: 750;
          color: #fff;
          margin: 0 0 0.5rem 0;
        }

        .form-group-row {
          display: flex;
          gap: 1rem;
        }

        .form-group-row .form-field {
          flex: 1;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-field label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .editor-input, .editor-select, .editor-textarea {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          color: #fff;
          padding: 0.55rem 0.75rem;
          font-size: 0.88rem;
          outline: none;
          font-family: inherit;
        }

        .editor-input:focus, .editor-select:focus, .editor-textarea:focus {
          border-color: #14b8a6;
        }

        .checkbox-row {
          flex-direction: row;
          align-items: flex-start;
          gap: 0.75rem;
          background: rgba(255,255,255,0.01);
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--border-light);
        }

        .checkbox-row input {
          margin-top: 0.25rem;
          cursor: pointer;
        }

        .checkbox-row label {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          text-transform: none;
          color: #fff;
        }

        .checkbox-tip {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 400;
          margin-top: 0.15rem;
        }

        /* Compiler Modal */
        .wiki-compiler-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(7, 8, 11, 0.7);
          backdrop-filter: blur(5px);
          z-index: 250;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .compiler-modal {
          width: 440px;
          padding: 0;
          border-radius: 12px;
          border: 1px solid var(--border-light);
          overflow: hidden;
          background: #0f172a;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }

        .compiler-modal .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-light);
        }

        .compiler-modal .modal-header h3 {
          font-size: 1.05rem;
          font-weight: 750;
          color: #fff;
          margin: 0;
        }

        .btn-close-modal {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.25rem;
          cursor: pointer;
        }

        .compiler-modal .modal-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .compiler-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin: 0;
        }

        .compiler-stats {
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: var(--text-primary);
        }

        .stat-row.border-top {
          border-top: 1px solid var(--border-light);
          padding-top: 0.5rem;
          margin-top: 0.25rem;
        }

        .orange-text { color: #f59e0b; }
        .cyan-text { color: #14b8a6; }

        .compiler-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: #14b8a6;
          font-weight: 600;
          justify-content: center;
          background: rgba(20, 184, 166, 0.08);
          padding: 0.5rem;
          border-radius: 6px;
        }

        .loading-spinner {
          animation: spin 1.5s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .btn-compile-run {
          background: #14b8a6;
          border: none;
          color: #fff;
          padding: 0.6rem;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-compile-run:hover {
          background: #0d9488;
        }

        .btn-compile-close {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          padding: 0.6rem;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-compile-close:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }

        /* Error Toast */
        .error-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
          z-index: 200;
        }

        .error-toast .toast-icon {
          background: rgba(239, 68, 68, 0.15);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.78rem;
        }
      `}</style>
    </div>
  );
}
