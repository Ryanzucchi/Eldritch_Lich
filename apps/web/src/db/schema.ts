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
  timelines!: Table<import('@eldritch/domain').Timeline, string>;
  timelineEvents!: Table<import('@eldritch/domain').TimelineEvent, string>;
  geoMaps!: Table<import('@eldritch/domain').GeoMap, string>;
  geoMapMarkers!: Table<import('@eldritch/domain').GeoMapMarker, string>;
  mindMaps!: Table<import('@eldritch/domain').MindMap, string>;
  mindMapNodes!: Table<import('@eldritch/domain').MindMapNode, string>;
  mediaAssets!: Table<import('@eldritch/domain').MediaAsset, string>;
  storyActs!: Table<import('@eldritch/domain').StoryAct, string>;
  heroJourneyStages!: Table<import('@eldritch/domain').HeroJourneyStage, string>;
  characterArcPoints!: Table<import('@eldritch/domain').CharacterArcPoint, string>;
  sandboxes!: Table<import('@eldritch/domain').SandboxEnvironment, string>;
  sandboxChanges!: Table<import('@eldritch/domain').SandboxChange, string>;
  projectMembers!: Table<import('@eldritch/domain').ProjectMember, string>;
  sharedDocLinks!: Table<import('@eldritch/domain').SharedDocumentLink, string>;
  projectInviteLinks!: Table<import('@eldritch/domain').ProjectInviteLink, string>;
  collaborationAuditLogs!: Table<import('@eldritch/domain').CollaborationAuditLog, string>;
  chatChannels!: Table<import('@eldritch/domain').ChatChannel, string>;
  chatMessages!: Table<import('@eldritch/domain').ChatMessage, string>;
  notificationSettings!: Table<import('@eldritch/domain').NotificationSettings, string>;
  teamMeetings!: Table<import('@eldritch/domain').TeamMeeting, string>;
  voiceMessages!: Table<import('@eldritch/domain').VoiceMessage, string>;
  callSessions!: Table<import('@eldritch/domain').CallSession, string>;

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
    this.version(12).stores({
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
      wikiEntities: 'id, projectId, name, type, isConfidential',
      timelines: 'id, projectId, name',
      timelineEvents: 'id, timelineId, sortOrder'
    });
    this.version(13).stores({
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
      wikiEntities: 'id, projectId, name, type, isConfidential',
      timelines: 'id, projectId, name',
      timelineEvents: 'id, timelineId, sortOrder',
      geoMaps: 'id, projectId, name',
      geoMapMarkers: 'id, mapId, type'
    });
    this.version(14).stores({
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
      wikiEntities: 'id, projectId, name, type, isConfidential',
      timelines: 'id, projectId, name',
      timelineEvents: 'id, timelineId, sortOrder',
      geoMaps: 'id, projectId, name',
      geoMapMarkers: 'id, mapId, type',
      mindMaps: 'id, projectId, title',
      mindMapNodes: 'id, mindMapId, parentId'
    });
    this.version(15).stores({
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
      wikiEntities: 'id, projectId, name, type, isConfidential',
      timelines: 'id, projectId, name',
      timelineEvents: 'id, timelineId, sortOrder',
      geoMaps: 'id, projectId, name',
      geoMapMarkers: 'id, mapId, type',
      mindMaps: 'id, projectId, title',
      mindMapNodes: 'id, mindMapId, parentId',
      mediaAssets: 'id, projectId, category, entityName'
    });
    this.version(16).stores({
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
      wikiEntities: 'id, projectId, name, type, isConfidential',
      timelines: 'id, projectId, name',
      timelineEvents: 'id, timelineId, sortOrder',
      geoMaps: 'id, projectId, name',
      geoMapMarkers: 'id, mapId, type',
      mindMaps: 'id, projectId, title',
      mindMapNodes: 'id, mindMapId, parentId',
      mediaAssets: 'id, projectId, category, entityName',
      storyActs: 'id, projectId, sortOrder',
      heroJourneyStages: 'id, projectId, characterName, stepNumber'
    });
    this.version(17).stores({
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
      wikiEntities: 'id, projectId, name, type, isConfidential',
      timelines: 'id, projectId, name',
      timelineEvents: 'id, timelineId, sortOrder',
      geoMaps: 'id, projectId, name',
      geoMapMarkers: 'id, mapId, type',
      mindMaps: 'id, projectId, title',
      mindMapNodes: 'id, mindMapId, parentId',
      mediaAssets: 'id, projectId, category, entityName',
      storyActs: 'id, projectId, sortOrder',
      heroJourneyStages: 'id, projectId, characterName, stepNumber',
      characterArcPoints: 'id, projectId, characterName, sortOrder'
    });
    this.version(18).stores({
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
      wikiEntities: 'id, projectId, name, type, isConfidential',
      timelines: 'id, projectId, name',
      timelineEvents: 'id, timelineId, sortOrder',
      geoMaps: 'id, projectId, name',
      geoMapMarkers: 'id, mapId, type',
      mindMaps: 'id, projectId, title',
      mindMapNodes: 'id, mindMapId, parentId',
      mediaAssets: 'id, projectId, category, entityName',
      storyActs: 'id, projectId, sortOrder',
      heroJourneyStages: 'id, projectId, characterName, stepNumber',
      characterArcPoints: 'id, projectId, characterName, sortOrder',
      sandboxes: 'id, projectId, name, isPromoted',
      sandboxChanges: 'id, sandboxId, entityType'
    });
    this.version(19).stores({
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
      wikiEntities: 'id, projectId, name, type, isConfidential',
      timelines: 'id, projectId, name',
      timelineEvents: 'id, timelineId, sortOrder',
      geoMaps: 'id, projectId, name',
      geoMapMarkers: 'id, mapId, type',
      mindMaps: 'id, projectId, title',
      mindMapNodes: 'id, mindMapId, parentId',
      mediaAssets: 'id, projectId, category, entityName',
      storyActs: 'id, projectId, sortOrder',
      heroJourneyStages: 'id, projectId, characterName, stepNumber',
      characterArcPoints: 'id, projectId, characterName, sortOrder',
      sandboxes: 'id, projectId, name, isPromoted',
      sandboxChanges: 'id, sandboxId, entityType',
      projectMembers: 'id, projectId, userEmail, role',
      sharedDocLinks: 'id, manuscriptId, token',
      projectInviteLinks: 'id, projectId, token, isRevoked',
      collaborationAuditLogs: 'id, projectId, userId, timestamp'
    });
    this.version(20).stores({
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
      wikiEntities: 'id, projectId, name, type, isConfidential',
      timelines: 'id, projectId, name',
      timelineEvents: 'id, timelineId, sortOrder',
      geoMaps: 'id, projectId, name',
      geoMapMarkers: 'id, mapId, type',
      mindMaps: 'id, projectId, title',
      mindMapNodes: 'id, mindMapId, parentId',
      mediaAssets: 'id, projectId, category, entityName',
      storyActs: 'id, projectId, sortOrder',
      heroJourneyStages: 'id, projectId, characterName, stepNumber',
      characterArcPoints: 'id, projectId, characterName, sortOrder',
      sandboxes: 'id, projectId, name, isPromoted',
      sandboxChanges: 'id, sandboxId, entityType',
      projectMembers: 'id, projectId, userEmail, role',
      sharedDocLinks: 'id, manuscriptId, token',
      projectInviteLinks: 'id, projectId, token, isRevoked',
      collaborationAuditLogs: 'id, projectId, userId, timestamp',
      chatChannels: 'id, projectId, isArchived',
      chatMessages: 'id, channelId, createdAt'
    });
    this.version(21).stores({
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
      wikiEntities: 'id, projectId, name, type, isConfidential',
      timelines: 'id, projectId, name',
      timelineEvents: 'id, timelineId, sortOrder',
      geoMaps: 'id, projectId, name',
      geoMapMarkers: 'id, mapId, type',
      mindMaps: 'id, projectId, title',
      mindMapNodes: 'id, mindMapId, parentId',
      mediaAssets: 'id, projectId, category, entityName',
      storyActs: 'id, projectId, sortOrder',
      heroJourneyStages: 'id, projectId, characterName, stepNumber',
      characterArcPoints: 'id, projectId, characterName, sortOrder',
      sandboxes: 'id, projectId, name, isPromoted',
      sandboxChanges: 'id, sandboxId, entityType',
      projectMembers: 'id, projectId, userEmail, role',
      sharedDocLinks: 'id, manuscriptId, token',
      projectInviteLinks: 'id, projectId, token, isRevoked',
      collaborationAuditLogs: 'id, projectId, userId, timestamp',
      chatChannels: 'id, projectId, isArchived',
      chatMessages: 'id, channelId, createdAt',
      notificationSettings: 'id, userId, emailFrequency'
    });
    this.version(22).stores({
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
      wikiEntities: 'id, projectId, name, type, isConfidential',
      timelines: 'id, projectId, name',
      timelineEvents: 'id, timelineId, sortOrder',
      geoMaps: 'id, projectId, name',
      geoMapMarkers: 'id, mapId, type',
      mindMaps: 'id, projectId, title',
      mindMapNodes: 'id, mindMapId, parentId',
      mediaAssets: 'id, projectId, category, entityName',
      storyActs: 'id, projectId, sortOrder',
      heroJourneyStages: 'id, projectId, characterName, stepNumber',
      characterArcPoints: 'id, projectId, characterName, sortOrder',
      sandboxes: 'id, projectId, name, isPromoted',
      sandboxChanges: 'id, sandboxId, entityType',
      projectMembers: 'id, projectId, userEmail, role',
      sharedDocLinks: 'id, manuscriptId, token',
      projectInviteLinks: 'id, projectId, token, isRevoked',
      collaborationAuditLogs: 'id, projectId, userId, timestamp',
      chatChannels: 'id, projectId, isArchived',
      chatMessages: 'id, channelId, createdAt',
      notificationSettings: 'id, userId, emailFrequency',
      teamMeetings: 'id, projectId, date'
    });
    this.version(23).stores({
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
      wikiEntities: 'id, projectId, name, type, isConfidential',
      timelines: 'id, projectId, name',
      timelineEvents: 'id, timelineId, sortOrder',
      geoMaps: 'id, projectId, name',
      geoMapMarkers: 'id, mapId, type',
      mindMaps: 'id, projectId, title',
      mindMapNodes: 'id, mindMapId, parentId',
      mediaAssets: 'id, projectId, category, entityName',
      storyActs: 'id, projectId, sortOrder',
      heroJourneyStages: 'id, projectId, characterName, stepNumber',
      characterArcPoints: 'id, projectId, characterName, sortOrder',
      sandboxes: 'id, projectId, name, isPromoted',
      sandboxChanges: 'id, sandboxId, entityType',
      projectMembers: 'id, projectId, userEmail, role',
      sharedDocLinks: 'id, manuscriptId, token',
      projectInviteLinks: 'id, projectId, token, isRevoked',
      collaborationAuditLogs: 'id, projectId, userId, timestamp',
      chatChannels: 'id, projectId, isArchived',
      chatMessages: 'id, channelId, createdAt',
      notificationSettings: 'id, userId, emailFrequency',
      teamMeetings: 'id, projectId, date',
      voiceMessages: 'id, channelId, createdAt',
      callSessions: 'id, projectId, roomName, status'
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
