import Dexie, { Table } from 'dexie';
import { MetaNode, MetaEdge, WritingGoal, WritingLog, WritingStreak, Manuscript } from '@eldritch/domain';

export class EldritchDatabase extends Dexie {
  metaNodes!: Table<MetaNode, string>;
  metaEdges!: Table<MetaEdge, string>;
  writingGoals!: Table<WritingGoal, string>;
  writingLogs!: Table<WritingLog, string>;
  writingStreak!: Table<WritingStreak, string>;
  keyboardShortcuts!: Table<{ command: string; keyCombo: string }, string>;
  manuscripts!: Table<Manuscript, string>;

  constructor() {
    super('EldritchDatabase');
    this.version(1).stores({
      metaNodes: 'id, type, status, title',
      metaEdges: 'id, fromId, toId'
    });
    this.version(2).stores({
      metaNodes: 'id, type, status, title',
      metaEdges: 'id, fromId, toId',
      writingGoals: 'id, type, targetWords, deadline',
      writingLogs: 'id, date',
      writingStreak: 'id'
    });
    this.version(3).stores({
      metaNodes: 'id, type, status, title',
      metaEdges: 'id, fromId, toId',
      writingGoals: 'id, type, targetWords, deadline',
      writingLogs: 'id, date',
      writingStreak: 'id',
      keyboardShortcuts: 'command'
    });
    this.version(4).stores({
      metaNodes: 'id, type, status, title',
      metaEdges: 'id, fromId, toId',
      writingGoals: 'id, type, targetWords, deadline',
      writingLogs: 'id, date',
      writingStreak: 'id',
      keyboardShortcuts: 'command',
      manuscripts: 'id, status, title'
    });
  }
}

export const db = new EldritchDatabase();

export async function deleteNodeTransaction(nodeId: string) {
  await db.transaction('rw', db.metaNodes, db.metaEdges, async () => {
    // Delete the node
    await db.metaNodes.delete(nodeId);
    
    // Find all edges where fromId === nodeId or toId === nodeId
    const edgesToDelete = await db.metaEdges
      .filter(edge => edge.fromId === nodeId || edge.toId === nodeId)
      .toArray();
      
    // Delete those edges
    await Promise.all(edgesToDelete.map(edge => db.metaEdges.delete(edge.id)));
  });
}
