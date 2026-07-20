'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '../../db/schema';
import { MetaNode, MetaEdge, MetaStatus, propagateStatus } from '@eldritch/domain';

// Map of columns
const COLUMNS = [
  { id: 'BACKLOG', title: 'Backlog', description: 'Ideias soltas e rascunhos' },
  { id: 'PENDENTE', title: 'A Escrever', description: 'Metas prontas para redação' },
  { id: 'EM_ANDAMENTO', title: 'Escrevendo', description: 'Cenas em progresso ativo' },
  { id: 'CONCLUIDO', title: 'Escrito', description: 'Metas concluídas e validadas' }
];

export default function KanbanPage() {
  const [nodes, setNodes] = useState<MetaNode[]>([]);
  const [edges, setEdges] = useState<MetaEdge[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);
  const [activeResolutionNode, setActiveResolutionNode] = useState<MetaNode | null>(null);

  // Load from Dexie
  const loadData = async () => {
    const savedNodes = await db.metaNodes.toArray();
    const savedEdges = await db.metaEdges.toArray();
    setNodes(savedNodes);
    setEdges(savedEdges);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update node status and propagate inconsistencies
  const handleMoveNode = async (nodeId: string, targetStatus: MetaStatus, isManualConfirm = false) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    // UC-457 Accept Criterion: Manual move to "Escrito" (CONCLUIDO) requires author confirmation
    if (targetStatus === 'CONCLUIDO' && node.status !== 'CONCLUIDO' && !isManualConfirm) {
      setShowConfirmModal(nodeId);
      return;
    }

    const updatedNodes = nodes.map(n => 
      n.id === nodeId ? { ...n, status: targetStatus, updatedAt: new Date().toISOString() } : n
    );

    // Propagate
    const { updatedNodes: finalNodes } = propagateStatus(updatedNodes, edges);
    
    // Save to Database
    await Promise.all(finalNodes.map(n => db.metaNodes.put(n)));
    
    setNodes(finalNodes);
    setShowConfirmModal(null);
  };

  // Keyboard accessibility helper for moves
  const handleKeyPress = (e: React.KeyboardEvent, nodeId: string, currentStatus: MetaStatus) => {
    if (e.key === 'ArrowRight') {
      const idx = COLUMNS.findIndex(c => c.id === currentStatus);
      if (idx < COLUMNS.length - 1) {
        handleMoveNode(nodeId, COLUMNS[idx + 1].id as MetaStatus);
      }
    } else if (e.key === 'ArrowLeft') {
      const idx = COLUMNS.findIndex(c => c.id === currentStatus);
      if (idx > 0) {
        handleMoveNode(nodeId, COLUMNS[idx - 1].id as MetaStatus);
      }
    }
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
    e.dataTransfer.setData('text/plain', nodeId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData('text/plain');
    if (nodeId) {
      handleMoveNode(nodeId, columnId as MetaStatus);
    }
  };

  // Resolution of Inconsistency: Option (b) Break causal dependency in GMN
  const handleBreakDependency = async (nodeId: string) => {
    if (!activeResolutionNode) return;
    
    // Remove all incoming edges pointing to this node to resolve dependency conflict
    const edgesToRemove = edges.filter(e => e.toId === nodeId);
    const remainingEdges = edges.filter(e => e.toId !== nodeId);

    await Promise.all(edgesToRemove.map(e => db.metaEdges.delete(e.id)));
    
    // Recalculate status propagation
    // Re-evaluating the current nodes with the remaining edges
    const { updatedNodes: finalNodes } = propagateStatus(nodes, remainingEdges);
    
    await Promise.all(finalNodes.map(n => db.metaNodes.put(n)));

    setNodes(finalNodes);
    setEdges(remainingEdges);
    setActiveResolutionNode(null);
  };

  return (
    <div className="layout-container">
      {/* Top Navbar */}
      <header className="navbar glass">
        <h1 className="logo">Eldritch<span>Lich</span></h1>
        <nav className="nav-links">
          <Link href="/gmn" className="nav-item">Grafo de Metas</Link>
          <Link href="/kanban" className="nav-item active">Quadro Kanban</Link>
        </nav>
      </header>

      <main className="kanban-area">
        <div className="kanban-header">
          <h2>Quadro Kanban de Escrita</h2>
          <p className="subtitle">Mova os cartões para atualizar o status do outline e do manuscrito. Teclas ← e → movem cartões selecionados.</p>
        </div>

        <div className="kanban-board">
          {COLUMNS.map(col => {
            // Group nodes by status
            // For BACKLOG, we show nodes that have status PENDENTE but no incoming dependencies (or just any custom mapping, let's treat BACKLOG as a stage for nodes with status PENDENTE and no parents, or we can use custom status, let's check).
            // Let's map:
            // BACKLOG: nodes that are PENDENTE and have no dependencies
            // PENDENTE: nodes that are PENDENTE and have dependencies
            // EM_ANDAMENTO: nodes that are EM_ANDAMENTO
            // CONCLUIDO: nodes that are CONCLUIDO
            // Inconsistent nodes are shown in their current status column, marked with red style.
            let colNodes = nodes.filter(node => {
              if (col.id === 'BACKLOG') {
                const hasIncoming = edges.some(e => e.toId === node.id);
                return node.status === 'PENDENTE' && !hasIncoming;
              }
              if (col.id === 'PENDENTE') {
                const hasIncoming = edges.some(e => e.toId === node.id);
                return node.status === 'PENDENTE' && hasIncoming;
              }
              return node.status === col.id;
            });

            // Fallback for empty list setup: if there are no edges, PENDENTE nodes go to Backlog
            if (col.id === 'BACKLOG' && edges.length === 0) {
              colNodes = nodes.filter(n => n.status === 'PENDENTE');
            } else if (col.id === 'PENDENTE' && edges.length === 0) {
              colNodes = [];
            }

            return (
              <div 
                key={col.id} 
                className="kanban-column glass"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className="column-header">
                  <h3 className="column-title">{col.title}</h3>
                  <span className="column-count">{colNodes.length}</span>
                </div>
                <p className="column-desc">{col.description}</p>
                
                <div className="column-cards">
                  {colNodes.map(node => (
                    <div
                      key={node.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, node.id)}
                      onKeyDown={(e) => handleKeyPress(e, node.id, node.status)}
                      tabIndex={0}
                      className={`kanban-card ${node.type.toLowerCase()} ${node.status === 'INCONSISTENTE' ? 'inconsistent' : ''}`}
                    >
                      <div className="card-header">
                        <span className={`card-badge ${node.type.toLowerCase()}`}>
                          {node.type === 'Exposicao' ? 'Espacial' : node.type === 'Personagem' ? 'Ator' : 'Confronto'}
                        </span>
                        
                        {node.status === 'INCONSISTENTE' && (
                          <span className="inconsistent-badge">Inconsistente</span>
                        )}
                      </div>

                      <h4 className="card-title">{node.title}</h4>
                      <p className="card-desc">{node.description}</p>

                      <div className="card-actions">
                        {/* Keyboard access helpers for moving left/right */}
                        <div className="move-buttons">
                          <button 
                            onClick={() => {
                              const idx = COLUMNS.findIndex(c => c.id === col.id);
                              if (idx > 0) handleMoveNode(node.id, COLUMNS[idx - 1].id as MetaStatus);
                            }}
                            disabled={col.id === 'BACKLOG'}
                            className="btn-arrow"
                            title="Mover para esquerda"
                          >
                            ←
                          </button>
                          <button 
                            onClick={() => {
                              const idx = COLUMNS.findIndex(c => c.id === col.id);
                              if (idx < COLUMNS.length - 1) handleMoveNode(node.id, COLUMNS[idx + 1].id as MetaStatus);
                            }}
                            disabled={col.id === 'CONCLUIDO'}
                            className="btn-arrow"
                            title="Mover para direita"
                          >
                            →
                          </button>
                        </div>

                        {node.status === 'INCONSISTENTE' && (
                          <button 
                            onClick={() => setActiveResolutionNode(node)} 
                            className="btn-resolve"
                          >
                            Resolver
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Confirmation Modal for Manual completion */}
      {showConfirmModal && (
        <div className="modal-backdrop">
          <div className="modal-content glass animate-fade-in">
            <h3>Confirmar Conclusão Manual</h3>
            <p>Você está marcando esta meta como concluída sem a verificação automática de escrita do MMS.</p>
            <p className="highlight">Registrar conclusão manual?</p>
            <div className="modal-actions">
              <button 
                onClick={() => handleMoveNode(showConfirmModal, 'CONCLUIDO', true)} 
                className="btn-confirm"
              >
                Sim, Confirmar
              </button>
              <button onClick={() => setShowConfirmModal(null)} className="btn-cancel-modal">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Resolution of Inconsistency Modal */}
      {activeResolutionNode && (
        <div className="modal-backdrop">
          <div className="modal-content glass animate-fade-in">
            <h3>Resolver Inconsistência Causal</h3>
            <p>A meta <strong>{activeResolutionNode.title}</strong> está inconsistente devido a dependências quebradas.</p>
            <div className="resolution-options">
              <div className="resolution-option">
                <h4>Opção A: Ajustar Manuscrito</h4>
                <p>Abra o trecho do texto e reescreva para atender aos critérios ancestrais utilizando o StyleGuard-PT.</p>
                <button onClick={() => alert('Abrindo editor de texto no trecho correspondente... (Simulado)')} className="btn-option-a">
                  Abrir Editor
                </button>
              </div>
              <div className="resolution-option">
                <h4>Opção B: Quebrar Causalidade</h4>
                <p>Remova as arestas de dependência no Grafo de Metas Narrativas (GMN) que causam esta restrição.</p>
                <button onClick={() => handleBreakDependency(activeResolutionNode.id)} className="btn-option-b">
                  Remover Dependências
                </button>
              </div>
            </div>
            <button onClick={() => setActiveResolutionNode(null)} className="btn-cancel-modal" style={{ marginTop: '1.5rem' }}>
              Fechar
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .kanban-area {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          background: radial-gradient(circle at 50% 50%, rgba(15, 15, 23, 0.3) 0%, rgba(7, 7, 10, 0.95) 100%);
        }

        .kanban-header {
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1rem;
        }

        .kanban-header h2 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
        }

        .kanban-board {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          height: calc(100vh - 220px);
        }

        .kanban-column {
          flex: 1;
          border-radius: 12px;
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          max-height: 100%;
          min-width: 250px;
        }

        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .column-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .column-count {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 0.15rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .column-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: -0.3rem;
          margin-bottom: 0.4rem;
        }

        .column-cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow-y: auto;
          flex: 1;
          padding-right: 0.2rem;
        }

        .kanban-card {
          background: rgba(15, 15, 23, 0.9);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          padding: 1rem;
          cursor: grab;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          outline: none;
          transition: all 0.2s;
        }

        .kanban-card:hover, .kanban-card:focus {
          transform: translateY(-2px);
          border-color: var(--border-glow);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }

        .kanban-card:focus {
          border-color: var(--border-active);
        }

        .kanban-card.exposicao { border-left: 3px solid var(--color-exposicao); }
        .kanban-card.personagem { border-left: 3px solid var(--color-personagem); }
        .kanban-card.conflito { border-left: 3px solid var(--color-conflito); }

        .kanban-card.inconsistent {
          border: 1px dashed var(--color-inconsistente);
          border-left: 3px solid var(--color-inconsistente);
          background: rgba(239, 68, 68, 0.02);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-badge {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-badge.exposicao { color: var(--color-exposicao); }
        .card-badge.personagem { color: var(--color-personagem); }
        .card-badge.conflito { color: var(--color-conflito); }

        .inconsistent-badge {
          background: rgba(239, 68, 68, 0.15);
          color: var(--color-inconsistente);
          border-radius: 4px;
          padding: 0.1rem 0.3rem;
          font-size: 0.65rem;
          font-weight: 600;
        }

        .card-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .card-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-light);
          padding-top: 0.5rem;
          margin-top: 0.2rem;
        }

        .move-buttons {
          display: flex;
          gap: 0.3rem;
        }

        .btn-arrow {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          border-radius: 4px;
          padding: 0.1rem 0.4rem;
          font-size: 0.7rem;
          cursor: pointer;
        }

        .btn-arrow:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn-arrow:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .btn-resolve {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          border-radius: 4px;
          padding: 0.15rem 0.4rem;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-resolve:hover {
          background: var(--color-inconsistente);
          color: var(--text-primary);
        }

        /* Modal styling */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          width: 90%;
          max-width: 500px;
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .modal-content h3 {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 700;
        }

        .modal-content p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .modal-content .highlight {
          font-weight: 600;
          color: var(--text-primary);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }

        .btn-confirm {
          background: var(--color-concluido);
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .btn-cancel-modal {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .resolution-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .resolution-option {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .resolution-option h4 {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .btn-option-a, .btn-option-b {
          border: none;
          border-radius: 6px;
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          align-self: flex-start;
          transition: all 0.2s;
        }

        .btn-option-a {
          background: var(--color-andamento);
        }
        
        .btn-option-b {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }

        .btn-option-b:hover {
          background: var(--color-inconsistente);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
