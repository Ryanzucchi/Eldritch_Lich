'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { MindMap, MindMapNode, convertMindMapToGraph } from '@eldritch/domain';

export default function MindMapsPage() {
  const { activeProject } = useApp();
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [activeMindMap, setActiveMindMap] = useState<MindMap | null>(null);
  const [nodes, setNodes] = useState<MindMapNode[]>([]);

  // Modal State (UC-102)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [rootText, setRootText] = useState('');

  // Editing Node State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNodeText, setEditingNodeText] = useState('');

  const [success, setSuccess] = useState<string | null>(null);

  // Load Mind Maps
  const loadMindMaps = async () => {
    if (!activeProject) return;
    const list = await db.mindMaps.where('projectId').equals(activeProject.id).toArray();
    setMindMaps(list);
    if (list.length > 0 && !activeMindMap) {
      setActiveMindMap(list[0]);
    }
  };

  // Load Nodes for Active Mind Map
  const loadNodes = async () => {
    if (!activeMindMap) {
      setNodes([]);
      return;
    }
    const list = await db.mindMapNodes.where('mindMapId').equals(activeMindMap.id).toArray();
    setNodes(list);
  };

  useEffect(() => {
    loadMindMaps();
  }, [activeProject]);

  useEffect(() => {
    loadNodes();
  }, [activeMindMap]);

  // Create Mind Map (UC-102)
  const handleCreateMindMap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !rootText.trim() || !activeProject) return;

    const mapId = `mm_${Date.now()}`;
    const rootId = `mmn_root_${Date.now()}`;

    const newMap: MindMap = {
      id: mapId,
      projectId: activeProject.id,
      title: newTitle.trim(),
      rootNodeId: rootId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const rootNode: MindMapNode = {
      id: rootId,
      mindMapId: mapId,
      text: rootText.trim(),
      color: '#3b82f6',
      shape: 'oval',
      createdAt: new Date().toISOString()
    };

    await db.mindMaps.put(newMap);
    await db.mindMapNodes.put(rootNode);

    setNewTitle('');
    setRootText('');
    setShowCreateModal(false);
    setActiveMindMap(newMap);
    await loadMindMaps();
    setSuccess(`Mapa Mental "${newMap.title}" criado!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Add Child Node (UC-102)
  const handleAddChildNode = async (parentNodeId: string) => {
    if (!activeMindMap) return;
    const childText = prompt('Digite o texto da nova ramificação:');
    if (!childText || !childText.trim()) return;

    const newNode: MindMapNode = {
      id: `mmn_node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      mindMapId: activeMindMap.id,
      parentId: parentNodeId,
      text: childText.trim(),
      color: '#a855f7',
      shape: 'rectangle',
      createdAt: new Date().toISOString()
    };

    await db.mindMapNodes.put(newNode);
    await loadNodes();
  };

  // Convert Mind Map to Graph (UC-104)
  const handleConvertToGraph = async () => {
    if (!activeMindMap || nodes.length === 0) return;

    const { graphNodes, graphEdges } = convertMindMapToGraph(activeMindMap, nodes);

    // Save to Dexie metaNodes and metaEdges
    await db.transaction('rw', db.metaNodes, db.metaEdges, async () => {
      for (const gn of graphNodes) {
        await db.metaNodes.put({
          id: gn.id,
          title: gn.title,
          type: 'Personagem',
          description: `Importado de Mapa Mental ${activeMindMap.title}`,
          relatedEntities: [],
          similarityThreshold: 0.72,
          status: 'PENDENTE',
          updatedAt: new Date().toISOString()
        });
      }
      for (const ge of graphEdges) {
        await db.metaEdges.put({
          id: ge.id,
          fromId: ge.fromId,
          toId: ge.toId
        });
      }
    });

    setSuccess(`Mapa Mental convertido com sucesso em ${graphNodes.length} nós no Grafo de Entidades (UC-104)!`);
    setTimeout(() => setSuccess(null), 4000);
  };

  return (
    <div className="mindmaps-page-container" style={{ padding: '2rem', color: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🧠 Mapas Mentais & Brainstorming (UC-102, UC-103, UC-104)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Organize ideias radiais e converta bi-direcionalmente entre mapas mentais e o grafo do projeto.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button 
            onClick={handleConvertToGraph}
            disabled={!activeMindMap || nodes.length === 0}
            style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ⚡ Converter em Grafo de Entidades (UC-104)
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ➕ Criar Mapa Mental
          </button>
        </div>
      </header>

      {/* Messages */}
      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {success}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.5rem' }}>
        {mindMaps.map(mm => (
          <button
            key={mm.id}
            onClick={() => setActiveMindMap(mm)}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '6px 6px 0 0',
              background: activeMindMap?.id === mm.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              border: '1px solid transparent',
              borderBottom: activeMindMap?.id === mm.id ? '2px solid #3b82f6' : 'transparent',
              color: activeMindMap?.id === mm.id ? '#3b82f6' : '#9ca3af',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            🧠 {mm.title}
          </button>
        ))}
        {mindMaps.length === 0 && <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>Nenhum mapa mental cadastrado.</span>}
      </div>

      {/* Mind Map Interactive View (UC-102) */}
      {activeMindMap ? (
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '2rem' }}>
          <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.4rem' }}>{activeMindMap.title}</h2>

          {/* Radial Node Tree Layout */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            {nodes.filter(n => !n.parentId).map(rootNode => (
              <div key={rootNode.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {/* Root Node */}
                <div style={{ background: rootNode.color || '#3b82f6', color: 'white', padding: '0.8rem 1.6rem', borderRadius: '30px', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span>{rootNode.text}</span>
                  <button onClick={() => handleAddChildNode(rootNode.id)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontWeight: 700 }}>+</button>
                </div>

                {/* Children Branches */}
                <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {nodes.filter(n => n.parentId === rootNode.id).map(childNode => (
                    <div key={childNode.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.8rem 1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600 }}>{childNode.text}</span>
                        <button onClick={() => handleAddChildNode(childNode.id)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#9ca3af', borderRadius: '4px', padding: '0.1rem 0.4rem', cursor: 'pointer', fontSize: '0.8rem' }}>+</button>
                      </div>

                      {/* Sub-children */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.6rem', width: '100%' }}>
                        {nodes.filter(n => n.parentId === childNode.id).map(subNode => (
                          <div key={subNode.id} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.04)', padding: '0.3rem 0.6rem', borderRadius: '4px', borderLeft: '2px solid #a855f7' }}>
                            {subNode.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
          Selecione ou crie um mapa mental para começar.
        </div>
      )}

      {/* Modal Criar Mapa Mental (UC-102) */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🧠 Criar Novo Mapa Mental (UC-102)</h3>
            <form onSubmit={handleCreateMindMap}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Título do Mapa Mental:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Trama Principal, Origem dos Deuses..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Conceito do Nó Central (Raiz):</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Guerra de Eldoria..."
                  value={rootText}
                  onChange={e => setRootText(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Criar Mapa Mental</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
