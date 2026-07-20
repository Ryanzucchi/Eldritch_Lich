import { MetaNode, MetaEdge } from './types.js';
/**
 * Propagates status changes in the GMN graph.
 * When a node status is changed:
 * 1. If any parent of a node is PENDENTE or INCONSISTENTE, that node cannot be CONCLUIDO.
 * 2. If a node becomes PENDENTE or INCONSISTENTE, its descendants must be evaluated.
 *    Any descendant node that was CONCLUIDO might become INCONSISTENTE if its prerequisites are no longer met.
 * 3. If prerequisites are re-established (all parents become CONCLUIDO), we can restore the node status.
 */
export declare function propagateStatus(nodes: MetaNode[], edges: MetaEdge[]): {
    updatedNodes: MetaNode[];
    alerts: string[];
};
