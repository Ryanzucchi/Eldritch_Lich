export interface MindMapNode {
    id: string;
    mindMapId: string;
    parentId?: string;
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
export declare function convertGraphToMindMap(rootNode: GraphNode, allNodes: GraphNode[], allEdges: GraphEdge[], mindMapId: string): {
    mindMap: MindMap;
    nodes: MindMapNode[];
};
/**
 * Converte um mapa mental radial em nós e arestas de um grafo de conhecimento (UC-104).
 */
export declare function convertMindMapToGraph(mindMap: MindMap, nodes: MindMapNode[]): {
    graphNodes: GraphNode[];
    graphEdges: GraphEdge[];
};
