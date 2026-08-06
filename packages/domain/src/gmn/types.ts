export type MetaType = 'Exposicao' | 'Personagem' | 'Conflito';
export type MetaStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'INCONSISTENTE';

export interface MetaNode {
  id: string; // uuid
  type: MetaType;
  title: string;
  description: string;
  relatedEntities: string[]; // references to wiki entities (characters, settings, items)
  similarityThreshold: number; // default: 0.72 or similar
  status: MetaStatus;
  updatedAt: string;
}

export interface MetaEdge {
  id: string; // Composite or UUID
  fromId: string;
  toId: string;
  /** Relação legível definida pelo autor; a precedência causal continua sendo fromId → toId. */
  label?: string;
}

export interface GMNGraph {
  nodes: MetaNode[];
  edges: MetaEdge[];
}
