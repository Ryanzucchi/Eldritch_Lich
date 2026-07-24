export interface MindMapNode {
  id: string;
  mindMapId: string;
  parentId?: string; // null for root node
  text: string;
  color?: string;
  shape?: 'rectangle' | 'oval';
  createdAt: string;
}

export interface MindMap {
  id: string;
  projectId: string;
  title: string;
  rootNodeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GraphNode {
  id: string;
  title: string;
  type: string;
}

export interface GraphEdge {
  id: string;
  fromId: string;
  toId: string;
  relationship?: string;
}

/**
 * Converte um grafo de entidades em um mapa mental radial a partir de um nó raiz (UC-103).
 */
export function convertGraphToMindMap(
  rootNode: GraphNode,
  allNodes: GraphNode[],
  allEdges: GraphEdge[],
  mindMapId: string
): { mindMap: MindMap; nodes: MindMapNode[] } {
  const rootMindNodeId = `node_${Date.now()}_root`;
  
  const mindMap: MindMap = {
    id: mindMapId,
    projectId: 'active',
    title: `Mapa Mental — ${rootNode.title}`,
    rootNodeId: rootMindNodeId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const mindNodes: MindMapNode[] = [
    {
      id: rootMindNodeId,
      mindMapId,
      text: rootNode.title,
      color: '#3b82f6',
      shape: 'oval',
      createdAt: new Date().toISOString()
    }
  ];

  // Find connected neighbor nodes
  const connectedEdges = allEdges.filter(e => e.fromId === rootNode.id || e.toId === rootNode.id);
  const visited = new Set<string>([rootNode.id]);

  connectedEdges.forEach((edge, idx) => {
    const targetId = edge.fromId === rootNode.id ? edge.toId : edge.fromId;
    if (!visited.has(targetId)) {
      visited.add(targetId);
      const targetNode = allNodes.find(n => n.id === targetId);
      if (targetNode) {
        mindNodes.push({
          id: `node_${Date.now()}_${idx}`,
          mindMapId,
          parentId: rootMindNodeId,
          text: targetNode.title,
          color: '#a855f7',
          shape: 'rectangle',
          createdAt: new Date().toISOString()
        });
      }
    }
  });

  return { mindMap, nodes: mindNodes };
}

/**
 * Converte um mapa mental radial em nós e arestas de um grafo de conhecimento (UC-104).
 */
export function convertMindMapToGraph(
  mindMap: MindMap,
  nodes: MindMapNode[]
): { graphNodes: GraphNode[]; graphEdges: GraphEdge[] } {
  const graphNodes: GraphNode[] = [];
  const graphEdges: GraphEdge[] = [];

  const nodeMap = new Map<string, string>(); // mindMapNodeId -> graphNodeId

  nodes.forEach(n => {
    const gId = `gn_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    nodeMap.set(n.id, gId);
    graphNodes.push({
      id: gId,
      title: n.text,
      type: n.parentId ? 'Conceito' : 'Entidade Principal'
    });
  });

  nodes.forEach(n => {
    if (n.parentId) {
      const fromGId = nodeMap.get(n.parentId);
      const toGId = nodeMap.get(n.id);
      if (fromGId && toGId) {
        graphEdges.push({
          id: `ge_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          fromId: fromGId,
          toId: toGId,
          relationship: 'ramificação'
        });
      }
    }
  });

  return { graphNodes, graphEdges };
}
