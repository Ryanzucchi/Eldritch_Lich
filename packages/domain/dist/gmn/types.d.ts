export type MetaType = 'Exposicao' | 'Personagem' | 'Conflito';
export type MetaStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'INCONSISTENTE';
export interface MetaNode {
    id: string;
    type: MetaType;
    title: string;
    description: string;
    relatedEntities: string[];
    similarityThreshold: number;
    status: MetaStatus;
    updatedAt: string;
}
export interface MetaEdge {
    id: string;
    fromId: string;
    toId: string;
}
export interface GMNGraph {
    nodes: MetaNode[];
    edges: MetaEdge[];
}
