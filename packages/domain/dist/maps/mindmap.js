"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertGraphToMindMap = convertGraphToMindMap;
exports.convertMindMapToGraph = convertMindMapToGraph;
/**
 * Converte um grafo de entidades em um mapa mental radial a partir de um nó raiz (UC-103).
 */
function convertGraphToMindMap(rootNode, allNodes, allEdges, mindMapId) {
    const rootMindNodeId = `node_${Date.now()}_root`;
    const mindMap = {
        id: mindMapId,
        projectId: 'active',
        title: `Mapa Mental — ${rootNode.title}`,
        rootNodeId: rootMindNodeId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    const mindNodes = [
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
    const visited = new Set([rootNode.id]);
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
function convertMindMapToGraph(mindMap, nodes) {
    const graphNodes = [];
    const graphEdges = [];
    const nodeMap = new Map(); // mindMapNodeId -> graphNodeId
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
