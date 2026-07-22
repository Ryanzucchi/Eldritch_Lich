'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { db, deleteNodeTransaction } from '../../db/schema';
import { MetaNode, MetaEdge, MetaType, MetaStatus, hasNoCycle, propagateStatus } from '@eldritch/domain';

// Mock wiki entities for selection (UC-098)
const WIKI_ENTITIES = [
  { id: 'kael', name: 'Kael (Protagonista)', type: 'Personagem' },
  { id: 'elara', name: 'Elara (Mentor)', type: 'Personagem' },
  { id: 'varis', name: 'Lorde Varis (Antagonista)', type: 'Personagem' },
  { id: 'castelo_sombrio', name: 'Castelo Sombrio', type: 'Local' },
  { id: 'floresta_sussurros', name: 'Floresta dos Sussurros', type: 'Local' },
  { id: 'medalhao_antigo', name: 'Medalhão Antigo', type: 'Item' },
  { id: 'espada_eclipse', name: 'Espada do Eclipse', type: 'Item' }
];

const SCIENTIFIC_GUIDELINES = [
  'Separar causalidade em niveis reduz sobrecarga visual.',
  'Entidades do universo devem guiar a validacao semantica.',
  'Alertas mostram consequencias narrativas, nao detalhes matematicos.'
];

export default function GMNPage() {
  const [nodes, setNodes] = useState<MetaNode[]>([]);
  const [edges, setEdges] = useState<MetaEdge[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter / Highlight States (UC-098)
  const [selectedFilterEntity, setSelectedFilterEntity] = useState<string | null>(null);
  const [filterDegree, setFilterDegree] = useState<number>(1);
  const [hiddenNodes, setHiddenNodes] = useState<string[]>([]);

  // Clear success notification
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metaType, setMetaType] = useState<MetaType>('Exposicao');
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [threshold, setThreshold] = useState<number>(0.72);

  // Connection State
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);

  // Canvas Refs for line drawing
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number }>>(new Map());

  // Load from Dexie
  useEffect(() => {
    async function loadData() {
      const savedNodes = await db.metaNodes.toArray();
      const savedEdges = await db.metaEdges.toArray();
      
      // If db is empty, initialize with some default narrative nodes for demonstration
      if (savedNodes.length === 0) {
        const initialNodes: MetaNode[] = [
          {
            id: 'n1',
            type: 'Exposicao',
            title: 'Kael entra na Floresta',
            description: 'Kael precisa atravessar a Floresta dos Sussurros em busca de respostas.',
            relatedEntities: ['kael', 'floresta_sussurros'],
            similarityThreshold: 0.75,
            status: 'CONCLUIDO',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'n2',
            type: 'Personagem',
            title: 'Encontro com o Medalhão',
            description: 'Kael encontra o Medalhão Antigo soterrado sob as raízes da árvore anciã.',
            relatedEntities: ['kael', 'medalhao_antigo'],
            similarityThreshold: 0.72,
            status: 'PENDENTE',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'n3',
            type: 'Conflito',
            title: 'O Ataque na Taverna',
            description: 'Um caçador tenta roubar o medalhão de Kael na estalagem do vilarejo.',
            relatedEntities: ['kael', 'medalhao_antigo'],
            similarityThreshold: 0.80,
            status: 'PENDENTE',
            updatedAt: new Date().toISOString()
          }
        ];
        
        const initialEdges: MetaEdge[] = [
          { id: 'e1', fromId: 'n1', toId: 'n2' },
          { id: 'e2', fromId: 'n2', toId: 'n3' }
        ];

        await db.metaNodes.bulkAdd(initialNodes);
        await db.metaEdges.bulkAdd(initialEdges);
        setNodes(initialNodes);
        setEdges(initialEdges);
        
        const { alerts: initialAlerts } = propagateStatus(initialNodes, initialEdges);
        setAlerts(initialAlerts);
      } else {
        setNodes(savedNodes);
        setEdges(savedEdges);
        const { alerts: loadedAlerts } = propagateStatus(savedNodes, savedEdges);
        setAlerts(loadedAlerts);
      }
    }
    loadData();
  }, []);

  // Update line coordinate positions when nodes render
  useEffect(() => {
    const updatePositions = () => {
      const positions = new Map<string, { x: number; y: number }>();
      nodes.forEach(node => {
        const el = document.getElementById(`node-card-${node.id}`);
        if (el && canvasRef.current) {
          const rect = el.getBoundingClientRect();
          const canvasRect = canvasRef.current.getBoundingClientRect();
          // Middle right point
          const xRight = rect.left - canvasRect.left + rect.width;
          const yRight = rect.top - canvasRect.top + rect.height / 2;
          // Middle left point
          const xLeft = rect.left - canvasRect.left;
          const yLeft = rect.top - canvasRect.top + rect.height / 2;
          
          positions.set(`${node.id}-right`, { x: xRight, y: yRight });
          positions.set(`${node.id}-left`, { x: xLeft, y: yLeft });
        }
      });
      setNodePositions(positions);
    };

    // Delay slightly to ensure browser has rendered DOM
    const timer = setTimeout(updatePositions, 100);
    window.addEventListener('resize', updatePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePositions);
    };
  }, [nodes, edges]);

  // Compute Topological Levels for Column layout
  const computeLevels = () => {
    const levels = new Map<string, number>();
    const inEdges = new Map<string, string[]>();
    
    nodes.forEach(n => {
      levels.set(n.id, 0);
      inEdges.set(n.id, []);
    });
    
    edges.forEach(e => {
      if (inEdges.has(e.toId)) {
        inEdges.get(e.toId)!.push(e.fromId);
      }
    });

    // Simple BFS topological calculation
    const visited = new Set<string>();
    const queue = nodes.filter(n => (inEdges.get(n.id) || []).length === 0).map(n => n.id);
    
    queue.forEach(id => {
      levels.set(id, 0);
    });

    while (queue.length > 0) {
      const u = queue.shift()!;
      visited.add(u);
      
      const outgoing = edges.filter(e => e.fromId === u);
      outgoing.forEach(edge => {
        const v = edge.toId;
        const currentVLevel = levels.get(v) || 0;
        const uLevel = levels.get(u) || 0;
        if (uLevel + 1 > currentVLevel) {
          levels.set(v, uLevel + 1);
        }
        if (!visited.has(v) && !queue.includes(v)) {
          queue.push(v);
        }
      });
    }

    return levels;
  };

  const nodeLevels = computeLevels();
  const maxLevel = nodes.length > 0 ? Math.max(...Array.from(nodeLevels.values())) : 0;
  const completedCount = nodes.filter(node => node.status === 'CONCLUIDO').length;
  const inconsistentCount = nodes.filter(node => node.status === 'INCONSISTENTE').length;
  const graphCoverage = nodes.length > 0 ? Math.round((completedCount / nodes.length) * 100) : 0;
  const nextNode = nodes.find(node => node.status === 'PENDENTE' || node.status === 'EM_ANDAMENTO');

  // BFS / Separation Degree Highlighter for character focus (UC-098)
  const getHighlightStates = () => {
    if (!selectedFilterEntity) {
      const visibleMap = new Map<string, boolean>();
      nodes.forEach(n => {
        visibleMap.set(n.id, !hiddenNodes.includes(n.id));
      });
      return visibleMap;
    }

    const seeds = new Set<string>();
    nodes.forEach(n => {
      if (n.relatedEntities.includes(selectedFilterEntity)) {
        seeds.add(n.id);
      }
    });

    const highlighted = new Set<string>(seeds);
    let currentFrontier = Array.from(seeds);

    for (let d = 0; d < filterDegree; d++) {
      const nextFrontier: string[] = [];
      currentFrontier.forEach(u => {
        edges.forEach(e => {
          if (e.fromId === u && !highlighted.has(e.toId)) {
            highlighted.add(e.toId);
            nextFrontier.push(e.toId);
          }
          if (e.toId === u && !highlighted.has(e.fromId)) {
            highlighted.add(e.fromId);
            nextFrontier.push(e.fromId);
          }
        });
      });
      currentFrontier = nextFrontier;
    }

    const highlightMap = new Map<string, boolean>();
    nodes.forEach(n => {
      if (hiddenNodes.includes(n.id)) {
        highlightMap.set(n.id, false);
      } else {
        highlightMap.set(n.id, highlighted.has(n.id));
      }
    });

    return highlightMap;
  };

  const highlightMap = getHighlightStates();
  
  // Group nodes by level columns
  const columns: MetaNode[][] = [];
  for (let i = 0; i <= maxLevel; i++) {
    columns.push(nodes.filter(n => nodeLevels.get(n.id) === i));
  }

  // GMN Actions
  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newNode: MetaNode = {
      id: 'n_' + Math.random().toString(36).substr(2, 9),
      type: metaType,
      title: title.trim(),
      description: description.trim(),
      relatedEntities: selectedEntities,
      similarityThreshold: threshold,
      status: 'PENDENTE',
      updatedAt: new Date().toISOString()
    };

    const newNodes = [...nodes, newNode];
    await db.metaNodes.add(newNode);
    setNodes(newNodes);

    // Reset Form
    setTitle('');
    setDescription('');
    setSelectedEntities([]);
    setThreshold(0.72);
  };

  const handleDeleteNode = async (id: string) => {
    await deleteNodeTransaction(id);
    const newNodes = nodes.filter(n => n.id !== id);
    const newEdges = edges.filter(e => e.fromId !== id && e.toId !== id);
    
    // Propagate status after deletion
    const { updatedNodes, alerts: newAlerts } = propagateStatus(newNodes, newEdges);
    
    // Save state updates
    await Promise.all(updatedNodes.map(node => db.metaNodes.put(node)));
    
    setNodes(updatedNodes);
    setEdges(newEdges);
    setAlerts(newAlerts);
  };

  const handleStartConnection = (id: string) => {
    setConnectingFromId(id);
  };

  const handleCompleteConnection = async (toId: string) => {
    if (!connectingFromId || connectingFromId === toId) {
      setConnectingFromId(null);
      return;
    }

    const newEdge: MetaEdge = {
      id: `e_${connectingFromId}_${toId}`,
      fromId: connectingFromId,
      toId: toId
    };

    // Kahn Cycle check
    const isDAG = hasNoCycle(nodes, edges, newEdge);
    if (!isDAG) {
      alert(`Erro: Esta conexão gera um paradoxo causal infinito (${nodes.find(n => n.id === connectingFromId)?.title} depende de ${nodes.find(n => n.id === toId)?.title})`);
      setConnectingFromId(null);
      return;
    }

    const newEdges = [...edges, newEdge];
    await db.metaEdges.add(newEdge);
    
    // Propagate status logic
    const { updatedNodes, alerts: newAlerts } = propagateStatus(nodes, newEdges);
    
    // Save updated node statuses to database
    await Promise.all(updatedNodes.map(node => db.metaNodes.put(node)));

    setNodes(updatedNodes);
    setEdges(newEdges);
    setAlerts(newAlerts);
    setConnectingFromId(null);
  };

  const toggleEntity = (entityId: string) => {
    if (selectedEntities.includes(entityId)) {
      setSelectedEntities(selectedEntities.filter(id => id !== entityId));
    } else {
      setSelectedEntities([...selectedEntities, entityId]);
    }
  };

  const updateNodeStatus = async (id: string, status: MetaStatus) => {
    const updated = nodes.map(n => n.id === id ? { ...n, status, updatedAt: new Date().toISOString() } : n);
    const { updatedNodes, alerts: newAlerts } = propagateStatus(updated, edges);
    
    await Promise.all(updatedNodes.map(node => db.metaNodes.put(node)));
    setNodes(updatedNodes);
    setAlerts(newAlerts);
  };

  return (
    <div className="main-content animate-fade-in">
      {/* Left Sidebar */}
      <aside className="sidebar glass">
          <div className="sidebar-section">
            <h2 className="section-title">Criar Nova Meta</h2>
            <div className="graph-intelligence-card">
              <span className="basis-kicker">Base cientifica aplicada</span>
              <div className="graph-stats-grid">
                <div>
                  <strong>{graphCoverage}%</strong>
                  <span>cobertura</span>
                </div>
                <div>
                  <strong>{alerts.length + inconsistentCount}</strong>
                  <span>alertas</span>
                </div>
              </div>
              {nextNode && (
                <p className="graph-next-step">Priorize: <strong>{nextNode.title}</strong></p>
              )}
              <ul className="guideline-list">
                {SCIENTIFIC_GUIDELINES.map(guideline => (
                  <li key={guideline}>{guideline}</li>
                ))}
              </ul>
            </div>
            <form onSubmit={handleAddNode} className="form-group">
              <label>Título da Meta</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Ex: Encontrar chave..." 
                className="input-field"
                required
              />

              <label>Descrição</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Detalhes sobre a cena narrada..." 
                className="input-field textarea-field"
              />

              <label>Tipo de Meta</label>
              <select 
                value={metaType} 
                onChange={e => setMetaType(e.target.value as MetaType)}
                className="input-field select-field"
              >
                <option value="Exposicao">Exposição (Setting)</option>
                <option value="Personagem">Personagem (Character)</option>
                <option value="Conflito">Conflito (Conflict)</option>
              </select>

              <label>Entidades Relacionadas</label>
              <div className="entity-pills">
                {WIKI_ENTITIES.map(entity => (
                  <button
                    key={entity.id}
                    type="button"
                    onClick={() => toggleEntity(entity.id)}
                    className={`entity-pill ${selectedEntities.includes(entity.id) ? 'active' : ''}`}
                  >
                    {entity.name}
                  </button>
                ))}
              </div>

              <label>Limiar de Conclusão Semântica (MMS): {threshold}</label>
              <input 
                type="range" 
                min="0.5" 
                max="0.95" 
                step="0.01" 
                value={threshold} 
                onChange={e => setThreshold(parseFloat(e.target.value))}
                className="slider-field"
              />

              <button type="submit" className="btn-primary">Adicionar ao Grafo</button>
            </form>
          </div>

          <div className="sidebar-section border-top">
            <h2 className="section-title">Alertas do Universo Causal</h2>
            {alerts.length === 0 ? (
              <p className="no-alerts">Nenhuma inconsistência lógica detectada. Causalidade intacta.</p>
            ) : (
              <div className="alerts-list">
                {alerts.map((alertText, idx) => (
                  <div key={idx} className="alert-card animate-fade-in pulse-error">
                    <svg className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p>{alertText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Graph Workspace Canvas */}
        <main className="canvas-area" ref={canvasRef}>
          <div className="canvas-header">
            <div className="header-text-section">
              <h2>Grafo de Metas Narrativas (GMN)</h2>
              <p className="subtitle">Ordene a causalidade da sua história. Conecte metas para declarar precedência lógica.</p>
            </div>

            {/* Filter controls toolbar (UC-098) */}
            <div className="graph-filter-toolbar glass animate-fade-in">
              <div className="filter-field">
                <label htmlFor="entity-filter-select">🔍 Foco no Personagem/Entidade:</label>
                <select
                  id="entity-filter-select"
                  value={selectedFilterEntity || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedFilterEntity(val ? val : null);
                  }}
                  className="filter-select"
                >
                  <option value="">-- Nenhum (Mostrar Tudo) --</option>
                  {WIKI_ENTITIES.map(ent => (
                    <option key={ent.id} value={ent.id}>
                      {ent.type}: {ent.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedFilterEntity && (
                <div className="filter-field animate-fade-in">
                  <label htmlFor="degree-select">Grau:</label>
                  <select
                    id="degree-select"
                    value={filterDegree}
                    onChange={(e) => setFilterDegree(Number(e.target.value))}
                    className="filter-select-mini"
                  >
                    <option value="1">1º Grau (Diretos)</option>
                    <option value="2">2º Grau (Indireto)</option>
                    <option value="3">3º Grau (Amplo)</option>
                  </select>
                </div>
              )}

              {(selectedFilterEntity || hiddenNodes.length > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilterEntity(null);
                    setFilterDegree(1);
                    setHiddenNodes([]);
                  }}
                  className="btn-clear-filters animate-fade-in"
                  title="Limpar Foco e reexibir todos os nós"
                >
                  Limpar Foco
                </button>
              )}
            </div>

            {connectingFromId && (
              <div className="connection-prompt animate-fade-in">
                <span>Conectando de <strong>{nodes.find(n => n.id === connectingFromId)?.title}</strong>. Selecione o nó de destino...</span>
                <button onClick={() => setConnectingFromId(null)} className="btn-cancel">Cancelar</button>
              </div>
            )}
          </div>

          <div className="graph-grid">
            {columns.map((columnNodes, colIdx) => (
              <div key={colIdx} className="graph-column">
                <div className="column-badge">Nível {colIdx + 1}</div>
                <div className="column-nodes">
                  {columnNodes.map(node => {
                    const isHighlighted = highlightMap.get(node.id);
                    const isHidden = hiddenNodes.includes(node.id);
                    if (isHidden) return null;

                    return (
                      <div 
                        key={node.id} 
                        id={`node-card-${node.id}`}
                        className={`node-card ${node.type.toLowerCase()} ${node.status.toLowerCase()} ${connectingFromId === node.id ? 'connecting' : ''}`}
                        style={{
                          opacity: isHighlighted ? 1 : 0.1,
                          pointerEvents: isHighlighted ? 'auto' : 'none',
                          transition: 'opacity 0.25s ease'
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setHiddenNodes(prev => [...prev, node.id]);
                          setSuccess('Nó ocultado do grafo. Use "Limpar Foco" para reexibir todos os nós.');
                        }}
                        title="Clique direito para Ocultar do Grafo"
                      >
                        <div className="node-header">
                          <span className={`node-type-badge ${node.type.toLowerCase()}`}>
                            {node.type === 'Exposicao' ? 'Espacial' : node.type === 'Personagem' ? 'Ator' : 'Confronto'}
                          </span>
                          <button onClick={() => handleDeleteNode(node.id)} className="delete-btn" title="Excluir Meta">×</button>
                        </div>
                        
                        <h3 className="node-title">{node.title}</h3>
                        <p className="node-description">{node.description}</p>
                        
                        <div className="node-entities">
                          {node.relatedEntities.map(entId => {
                            const ent = WIKI_ENTITIES.find(e => e.id === entId);
                            return ent ? <span key={entId} className="entity-tag">{ent.name.split(' ')[0]}</span> : null;
                          })}
                        </div>

                        <div className="node-footer">
                          <select
                            value={node.status}
                            onChange={(e) => updateNodeStatus(node.id, e.target.value as MetaStatus)}
                            className={`status-select ${node.status.toLowerCase()}`}
                          >
                            <option value="PENDENTE">Pendente</option>
                            <option value="EM_ANDAMENTO">Escrevendo</option>
                            <option value="CONCLUIDO">Escrito</option>
                            <option value="INCONSISTENTE">Inconsistente</option>
                          </select>

                          {connectingFromId ? (
                            connectingFromId !== node.id && (
                              <button onClick={() => handleCompleteConnection(node.id)} className="btn-connect-target">
                                Definir Alvo
                              </button>
                            )
                          ) : (
                            <button onClick={() => handleStartConnection(node.id)} className="btn-connect-start" title="Ligar dependência a outra meta">
                              Ligar meta →
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* SVG Connections rendering overlay */}
          <svg className="connections-svg">
            {edges.map(edge => {
              const start = nodePositions.get(`${edge.fromId}-right`);
              const end = nodePositions.get(`${edge.toId}-left`);
              if (!start || !end) return null;
              
              // Hide completely if either node is hidden
              if (hiddenNodes.includes(edge.fromId) || hiddenNodes.includes(edge.toId)) {
                return null;
              }

              // Highlight if filter is inactive, or if both nodes are highlighted
              const isEdgeHighlighted = !selectedFilterEntity || (highlightMap.get(edge.fromId) && highlightMap.get(edge.toId));

              // Compute smooth bezier curve
              const dx = end.x - start.x;
              const controlX1 = start.x + dx * 0.4;
              const controlX2 = start.x + dx * 0.6;
              const pathData = `M ${start.x} ${start.y} C ${controlX1} ${start.y}, ${controlX2} ${end.y}, ${end.x} ${end.y}`;

              return (
                <g key={edge.id} style={{ opacity: isEdgeHighlighted ? 1 : 0.1, transition: 'opacity 0.25s ease' }}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke="rgba(20, 184, 166, 0.45)"
                    strokeWidth="2"
                    className="connection-line"
                  />
                  {/* Arrow marker */}
                  <circle cx={end.x} cy={end.y} r="3.5" fill="rgba(20, 184, 166, 0.85)" />
                </g>
              );
            })}
          </svg>

          {/* Success toast notification */}
          {success && (
            <div className="success-toast glass animate-fade-in">
              <span className="toast-icon">✓</span>
              <span>{success}</span>
            </div>
          )}
        </main>

      <style jsx global>{`
        .main-content {
          display: flex;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .sidebar {
          width: var(--sidebar-width);
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          z-index: 5;
        }

        .sidebar-section {
          padding: 1.5rem;
        }

        .border-top {
          border-top: 1px solid var(--border-light);
          flex: 1;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1.2rem;
          color: var(--text-primary);
        }

        .graph-intelligence-card {
          border: 1px solid rgba(20, 184, 166, 0.2);
          background: rgba(10, 40, 38, 0.2);
          border-radius: 8px;
          padding: 0.85rem;
          margin-bottom: 1rem;
        }

        .basis-kicker {
          display: block;
          color: var(--color-andamento);
          font-size: 0.66rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.65rem;
        }

        .graph-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
          margin-bottom: 0.75rem;
        }

        .graph-stats-grid div {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          padding: 0.55rem;
        }

        .graph-stats-grid strong {
          display: block;
          font-size: 1.1rem;
        }

        .graph-stats-grid span {
          color: var(--text-muted);
          font-size: 0.66rem;
        }

        .graph-next-step {
          color: var(--text-secondary);
          font-size: 0.74rem;
          line-height: 1.35;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 0.65rem;
        }

        .guideline-list {
          color: var(--text-muted);
          font-size: 0.7rem;
          line-height: 1.45;
          margin-top: 0.6rem;
          padding-left: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .input-field {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 0.6rem 0.8rem;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s;
        }

        .input-field:focus {
          border-color: var(--border-active);
          background: rgba(0, 0, 0, 0.4);
        }

        .textarea-field {
          min-height: 80px;
          resize: vertical;
        }

        .select-field {
          cursor: pointer;
        }

        .entity-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.2rem;
        }

        .entity-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 0.3rem 0.6rem;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .entity-pill:hover, .entity-pill.active {
          background: rgba(20, 184, 166, 0.1);
          border-color: var(--color-andamento);
        }

        .slider-field {
          width: 100%;
          accent-color: var(--color-andamento);
          cursor: pointer;
        }

        .btn-primary {
          background: linear-gradient(135deg, #14b8a6 0%, #2563eb 100%);
          border: none;
          border-radius: 8px;
          padding: 0.7rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.25);
          transition: all 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(20, 184, 166, 0.36);
        }

        .no-alerts {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .alert-card {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          padding: 0.8rem;
          display: flex;
          gap: 0.6rem;
          font-size: 0.8rem;
          line-height: 1.4;
          color: #fca5a5;
        }

        .alert-icon {
          width: 16px;
          height: 16px;
          color: var(--color-inconsistente);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .canvas-area {
          flex: 1;
          background: radial-gradient(circle at 50% 50%, rgba(15, 15, 23, 0.3) 0%, rgba(7, 7, 10, 0.95) 100%);
          padding: 2rem;
          overflow: auto;
          position: relative;
        }

        .canvas-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1rem;
        }

        .canvas-header h2 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
        }

        .subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 0.2rem;
        }

        .connection-prompt {
          background: rgba(20, 184, 166, 0.14);
          border: 1px solid var(--color-andamento);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--border-light);
          border-radius: 4px;
          padding: 0.2rem 0.5rem;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .graph-grid {
          display: flex;
          gap: 3rem;
          min-height: 400px;
          align-items: flex-start;
          z-index: 1;
          position: relative;
        }

        .graph-column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 250px;
          flex: 1;
        }

        .column-badge {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          padding: 0.3rem 0.6rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          align-self: flex-start;
        }

        .column-nodes {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .node-card {
          border-radius: 12px;
          padding: 1.2rem;
          position: relative;
          background: rgba(15, 15, 23, 0.85);
          border: 1.5px solid var(--border-light);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .node-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
        }

        /* Node Type Styling */
        .node-card.exposicao {
          border-left: 4px solid var(--color-exposicao);
        }
        .node-card.exposicao:hover, .node-card.exposicao.connecting {
          border-color: var(--color-exposicao);
          box-shadow: 0 0 15px var(--color-exposicao-glow);
        }

        .node-card.personagem {
          border-left: 4px solid var(--color-personagem);
        }
        .node-card.personagem:hover, .node-card.personagem.connecting {
          border-color: var(--color-personagem);
          box-shadow: 0 0 15px var(--color-personagem-glow);
        }

        .node-card.conflito {
          border-left: 4px solid var(--color-conflito);
        }
        .node-card.conflito:hover, .node-card.conflito.connecting {
          border-color: var(--color-conflito);
          box-shadow: 0 0 15px var(--color-conflito-glow);
        }

        /* Status highlights */
        .node-card.inconsistente {
          border: 1.5px dashed var(--color-inconsistente);
          border-left: 4px solid var(--color-inconsistente);
        }

        .node-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .node-type-badge {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .node-type-badge.exposicao {
          background: var(--color-exposicao-glow);
          color: var(--color-exposicao);
        }

        .node-type-badge.personagem {
          background: var(--color-personagem-glow);
          color: var(--color-personagem);
        }

        .node-type-badge.conflito {
          background: var(--color-conflito-glow);
          color: var(--color-conflito);
        }

        .delete-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
          transition: color 0.2s;
          line-height: 1;
        }

        .delete-btn:hover {
          color: var(--color-inconsistente);
        }

        .node-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .node-description {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .node-entities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }

        .entity-tag {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          border-radius: 6px;
          padding: 0.15rem 0.4rem;
          font-size: 0.7rem;
        }

        .node-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-light);
          padding-top: 0.6rem;
          margin-top: 0.2rem;
        }

        .status-select {
          background: transparent;
          border: none;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        }

        .status-select.pendente { color: var(--color-pendente); }
        .status-select.em_andamento { color: var(--color-andamento); }
        .status-select.concluido { color: var(--color-concluido); }
        .status-select.inconsistente { color: var(--color-inconsistente); }

        .btn-connect-start, .btn-connect-target {
          background: transparent;
          border: none;
          color: var(--color-andamento);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-connect-start:hover {
          color: var(--text-primary);
          text-shadow: 0 0 5px rgba(20, 184, 166, 0.42);
        }

        .btn-connect-target {
          background: var(--color-andamento);
          color: var(--text-primary);
          border-radius: 4px;
          padding: 0.2rem 0.5rem;
          font-weight: 600;
        }

        .btn-connect-target:hover {
          background: #0f766e;
        }

        /* SVG overlay */
        .connections-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .connection-line {
          stroke-dasharray: 4;
          animation: flowDash 20s linear infinite;
        }

        @keyframes flowDash {
          to { stroke-dashoffset: -100; }
        }

        /* Graph Filter Toolbar (UC-098) */
        .graph-filter-toolbar {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          flex-wrap: wrap;
        }

        .main-content.theme-light .graph-filter-toolbar {
          background: rgba(255, 255, 255, 0.8) !important;
          border-color: rgba(15, 23, 42, 0.1) !important;
        }

        .filter-field {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-field label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          color: #fff;
          padding: 0.35rem 0.55rem;
          font-size: 0.8rem;
          outline: none;
          cursor: pointer;
        }

        .main-content.theme-light .filter-select {
          background: rgba(15, 23, 42, 0.03) !important;
          border-color: rgba(15, 23, 42, 0.12) !important;
          color: #0f172a !important;
        }

        .filter-select option {
          background: #111827;
          color: #fff;
        }

        .main-content.theme-light .filter-select option {
          background: #ffffff !important;
          color: #0f172a !important;
        }

        .filter-select-mini {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          color: #fff;
          padding: 0.35rem 0.55rem;
          font-size: 0.8rem;
          outline: none;
          cursor: pointer;
        }

        .main-content.theme-light .filter-select-mini {
          background: rgba(15, 23, 42, 0.03) !important;
          border-color: rgba(15, 23, 42, 0.12) !important;
          color: #0f172a !important;
        }

        .filter-select-mini option {
          background: #111827;
          color: #fff;
        }

        .main-content.theme-light .filter-select-mini option {
          background: #ffffff !important;
          color: #0f172a !important;
        }

        .btn-clear-filters {
          background: rgba(20, 184, 166, 0.12);
          border: 1px solid rgba(20, 184, 166, 0.3);
          color: #14b8a6;
          padding: 0.35rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-clear-filters:hover {
          background: #14b8a6;
          color: #fff;
          box-shadow: 0 0 10px rgba(20, 184, 166, 0.3);
        }

        /* Success Toast */
        .success-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(20, 184, 166, 0.3);
          color: #14b8a6;
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

        .main-content.theme-light .success-toast {
          background: #ffffff !important;
          border-color: rgba(20, 184, 166, 0.25) !important;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08) !important;
        }

        .toast-icon {
          background: rgba(20, 184, 166, 0.15);
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
