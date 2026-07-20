import { MetaNode, MetaEdge } from './types.js';

/**
 * Propagates status changes in the GMN graph.
 * When a node status is changed:
 * 1. If any parent of a node is PENDENTE or INCONSISTENTE, that node cannot be CONCLUIDO.
 * 2. If a node becomes PENDENTE or INCONSISTENTE, its descendants must be evaluated.
 *    Any descendant node that was CONCLUIDO might become INCONSISTENTE if its prerequisites are no longer met.
 * 3. If prerequisites are re-established (all parents become CONCLUIDO), we can restore the node status.
 */
export function propagateStatus(
  nodes: MetaNode[],
  edges: MetaEdge[]
): { updatedNodes: MetaNode[]; alerts: string[] } {
  const children: Map<string, string[]> = new Map();
  const parents: Map<string, string[]> = new Map();

  for (const node of nodes) {
    children.set(node.id, []);
    parents.set(node.id, []);
  }

  for (const edge of edges) {
    if (children.has(edge.fromId)) children.get(edge.fromId)!.push(edge.toId);
    if (parents.has(edge.toId)) parents.get(edge.toId)!.push(edge.fromId);
  }

  const updatedNodes = nodes.map(n => ({ ...n }));
  const nodeMap = new Map(updatedNodes.map(n => [n.id, n]));

  // Topological sort of nodes to propagate status in causal order
  const topoOrder = getTopologicalOrder(updatedNodes, edges);
  const alerts: string[] = [];

  for (const nodeId of topoOrder) {
    const node = nodeMap.get(nodeId)!;
    const nodeParents = parents.get(nodeId) || [];

    // Check if any parent is PENDENTE or INCONSISTENTE
    const hasUnresolvedParent = nodeParents.some(pId => {
      const p = nodeMap.get(pId)!;
      return p.status === 'PENDENTE' || p.status === 'INCONSISTENTE';
    });

    if (hasUnresolvedParent) {
      if (node.status === 'CONCLUIDO') {
        node.status = 'INCONSISTENTE';
        // Get the parent title that caused this
        const conflictingParents = nodeParents
          .map(pId => nodeMap.get(pId)!)
          .filter(p => p.status === 'PENDENTE' || p.status === 'INCONSISTENTE')
          .map(p => p.title);
        alerts.push(
          `A alteração em [${conflictingParents.join(', ')}] impossibilitou a meta "${node.title}". Ajuste o texto ou atualize o grafo.`
        );
      }
    } else {
      // If all parents are CONCLUIDO and the node was INCONSISTENTE, it returns to CONCLUIDO
      if (node.status === 'INCONSISTENTE') {
        node.status = 'CONCLUIDO';
      }
    }
  }

  return { updatedNodes, alerts };
}

function getTopologicalOrder(nodes: MetaNode[], edges: MetaEdge[]): string[] {
  const adj: Map<string, string[]> = new Map();
  const inDegree: Map<string, number> = new Map();

  for (const node of nodes) {
    adj.set(node.id, []);
    inDegree.set(node.id, 0);
  }

  for (const edge of edges) {
    if (adj.has(edge.fromId) && adj.has(edge.toId)) {
      adj.get(edge.fromId)!.push(edge.toId);
      inDegree.set(edge.toId, inDegree.get(edge.toId)! + 1);
    }
  }

  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  const order: string[] = [];
  let iterations = 0;
  const maxIterations = 5000; // Limit recursion/loop traversal safely

  while (queue.length > 0 && iterations < maxIterations) {
    iterations++;
    const u = queue.shift()!;
    order.push(u);
    for (const v of adj.get(u) || []) {
      const deg = inDegree.get(v)! - 1;
      inDegree.set(v, deg);
      if (deg === 0) {
        queue.push(v);
      }
    }
  }

  return order;
}
