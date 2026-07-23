import Dexie, { Table } from 'dexie';
import { MetaNode, MetaEdge, WritingGoal, WritingLog, WritingStreak, Manuscript, Folder, InlineComment, SystemActivity } from '@eldritch/domain';

export interface Reminder {
  id: string;
  text: string;
  projectId: string;
  manuscriptId?: string;
  alertTime: string;
  importance: 'LOW' | 'MEDIUM' | 'HIGH';
  isRead: boolean;
  createdAt: string;
}

export interface WikiEntity {
  id: string;
  projectId: string;
  name: string;
  type: 'Personagem' | 'Local' | 'Item' | 'Organizacao';
  description: string;
  content: string;
  isConfidential: boolean;
  createdAt: string;
  updatedAt: string;
}

export class EldritchDatabase extends Dexie {
  metaNodes!: Table<MetaNode, string>;
  metaEdges!: Table<MetaEdge, string>;
  writingGoals!: Table<WritingGoal, string>;
  writingLogs!: Table<WritingLog, string>;
  writingStreak!: Table<WritingStreak, string>;
  keyboardShortcuts!: Table<{ command: string; keyCombo: string }, string>;
  manuscripts!: Table<Manuscript, string>;
  manuscriptVersions!: Table<{ id: string; manuscriptId: string; versionNumber: number; title: string; content: string; createdAt: string }, string>;
  pendingSaves!: Table<{ id: string; manuscriptId: string; content: string; timestamp: number }, string>;
  folders!: Table<Folder, string>;
  comments!: Table<InlineComment, string>;
  auditLogs!: Table<SystemActivity, string>;
  reminders!: Table<Reminder, string>;
  wikiEntities!: Table<WikiEntity, string>;

  constructor() {
    const isBrowser = typeof window !== 'undefined';
    const activeProjectId = isBrowser ? localStorage.getItem('activeProjectId') || 'default' : 'default';
    super(`EldritchDatabase_${activeProjectId}`);
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
    this.version(5).stores({
      metaNodes: 'id, type, status, title',
      metaEdges: 'id, fromId, toId',
      writingGoals: 'id, type, targetWords, deadline',
      writingLogs: 'id, date',
      writingStreak: 'id',
      keyboardShortcuts: 'command',
      manuscripts: 'id, status, title',
      manuscriptVersions: 'id, manuscriptId, versionNumber, createdAt',
      pendingSaves: 'id, manuscriptId, timestamp'
    });
    this.version(6).stores({
      metaNodes: 'id, type, status, title',
      metaEdges: 'id, fromId, toId',
      writingGoals: 'id, type, targetWords, deadline',
      writingLogs: 'id, date',
      writingStreak: 'id',
      keyboardShortcuts: 'command',
      manuscripts: 'id, status, title, folderId',
      manuscriptVersions: 'id, manuscriptId, versionNumber, createdAt',
      pendingSaves: 'id, manuscriptId, timestamp',
      folders: 'id, projectId, parentFolderId'
    });
    this.version(7).stores({
      metaNodes: 'id, type, status, title',
      metaEdges: 'id, fromId, toId',
      writingGoals: 'id, type, targetWords, deadline',
      writingLogs: 'id, date',
      writingStreak: 'id',
      keyboardShortcuts: 'command',
      manuscripts: 'id, status, title, folderId',
      manuscriptVersions: 'id, manuscriptId, versionNumber, createdAt',
      pendingSaves: 'id, manuscriptId, timestamp',
      folders: 'id, projectId, parentFolderId',
      comments: 'id, manuscriptId, isResolved, createdAt'
    });
    this.version(8).stores({
      metaNodes: 'id, type, status, title',
      metaEdges: 'id, fromId, toId',
      writingGoals: 'id, type, targetWords, deadline',
      writingLogs: 'id, date',
      writingStreak: 'id',
      keyboardShortcuts: 'command',
      manuscripts: 'id, status, title, folderId',
      manuscriptVersions: 'id, manuscriptId, versionNumber, createdAt',
      pendingSaves: 'id, manuscriptId, timestamp',
      folders: 'id, projectId, parentFolderId',
      comments: 'id, manuscriptId, isResolved, createdAt',
      auditLogs: 'id, type, timestamp'
    });
    this.version(9).stores({
      metaNodes: 'id, type, status, title',
      metaEdges: 'id, fromId, toId',
      writingGoals: 'id, type, targetWords, deadline',
      writingLogs: 'id, date',
      writingStreak: 'id',
      keyboardShortcuts: 'command',
      manuscripts: 'id, status, title, folderId, category, isArchived',
      manuscriptVersions: 'id, manuscriptId, versionNumber, createdAt',
      pendingSaves: 'id, manuscriptId, timestamp',
      folders: 'id, projectId, parentFolderId',
      comments: 'id, manuscriptId, isResolved, createdAt',
      auditLogs: 'id, type, timestamp'
    });
    this.version(10).stores({
      metaNodes: 'id, type, status, title',
      metaEdges: 'id, fromId, toId',
      writingGoals: 'id, type, targetWords, deadline',
      writingLogs: 'id, date',
      writingStreak: 'id',
      keyboardShortcuts: 'command',
      manuscripts: 'id, status, title, folderId, category, isArchived',
      manuscriptVersions: 'id, manuscriptId, versionNumber, createdAt',
      pendingSaves: 'id, manuscriptId, timestamp',
      folders: 'id, projectId, parentFolderId',
      comments: 'id, manuscriptId, isResolved, createdAt',
      auditLogs: 'id, type, timestamp',
      reminders: 'id, projectId, alertTime, isRead'
    });
    this.version(11).stores({
      metaNodes: 'id, type, status, title',
      metaEdges: 'id, fromId, toId',
      writingGoals: 'id, type, targetWords, deadline',
      writingLogs: 'id, date',
      writingStreak: 'id',
      keyboardShortcuts: 'command',
      manuscripts: 'id, status, title, folderId, category, isArchived',
      manuscriptVersions: 'id, manuscriptId, versionNumber, createdAt',
      pendingSaves: 'id, manuscriptId, timestamp',
      folders: 'id, projectId, parentFolderId',
      comments: 'id, manuscriptId, isResolved, createdAt',
      auditLogs: 'id, type, timestamp',
      reminders: 'id, projectId, alertTime, isRead',
      wikiEntities: 'id, projectId, name, type, isConfidential'
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
