"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasNoCycle = hasNoCycle;
/**
 * Verifies if adding an edge from `fromId` to `toId` would introduce a cycle.
 * Returns true if the graph remains a DAG (no cycle), false if a cycle is introduced.
 */
function hasNoCycle(nodes, edges, newEdge) {
    const adj = new Map();
    const inDegree = new Map();
    for (const node of nodes) {
        adj.set(node.id, []);
        inDegree.set(node.id, 0);
    }
    const allEdges = newEdge ? [...edges, newEdge] : edges;
    for (const edge of allEdges) {
        if (!adj.has(edge.fromId) || !adj.has(edge.toId)) {
            continue;
        }
        adj.get(edge.fromId).push(edge.toId);
        inDegree.set(edge.toId, (inDegree.get(edge.toId) || 0) + 1);
    }
    const queue = [];
    for (const [nodeId, degree] of inDegree.entries()) {
        if (degree === 0) {
            queue.push(nodeId);
        }
    }
    let visitedCount = 0;
    while (queue.length > 0) {
        const u = queue.shift();
        visitedCount++;
        const neighbors = adj.get(u) || [];
        for (const v of neighbors) {
            const newDegree = inDegree.get(v) - 1;
            inDegree.set(v, newDegree);
            if (newDegree === 0) {
                queue.push(v);
            }
        }
    }
    return visitedCount === nodes.length;
}
