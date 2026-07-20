import { MetaNode, MetaEdge } from './types.js';
/**
 * Verifies if adding an edge from `fromId` to `toId` would introduce a cycle.
 * Returns true if the graph remains a DAG (no cycle), false if a cycle is introduced.
 */
export declare function hasNoCycle(nodes: MetaNode[], edges: MetaEdge[], newEdge?: MetaEdge): boolean;
