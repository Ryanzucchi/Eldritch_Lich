'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { db } from '../../db/schema';
import { 
  MetaNode, 
  MetaEdge, 
  WritingGoal, 
  WritingLog, 
  WritingStreak, 
  Manuscript,
  Folder,
  calculateStreak, 
  calculateDailyQuota,
  verifyZeroShotAction, 
  cosineSimilarity, 
  propagateStatus 
} from '@eldritch/domain';
import { computeE5Embedding, extractEntitiesWithNER, ProgressPayload } from '../../services/mms-ai';

// Mock wiki entities dictionary
const ENTITIES = [
  { id: 'kael', name: 'Kael (Protagonista)', keywords: ['Kael'] },
  { id: 'elara', name: 'Elara (Mentor)', keywords: ['Elara'] },
  { id: 'castelo_sombrio', name: 'Castelo Sombrio', keywords: ['Castelo', 'Castelo Sombrio'] },
  { id: 'floresta_sussurros', name: 'Floresta dos Sussurros', keywords: ['Floresta', 'Floresta dos Sussurros'] },
  { id: 'medalhao_antigo', name: 'Medalhão Antigo', keywords: ['Medalhão', 'Medalhão Antigo'] },
  { id: 'espada_eclipse', name: 'Espada do Eclipse', keywords: ['Espada', 'Espada do Eclipse'] }
];

interface MMSLog {
  timestamp: string;
  paragraphText: string;
  goalTitle: string;
  similarity: number;
  evidenceScore: number;
  entitiesMatched: string[];
  graphEntitiesMatched: string[];
  nerTokens: { entity: string; word: string }[];
  llmVerification: { success: boolean; explanation: string };
  status: 'SUCCESS' | 'PLANNING' | 'LOW_SIMILARITY';
}

interface KeyboardShortcut {
  command: string;
  keyCombo: string;
  label: string;
}

const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  { command: 'toggle_focus', keyCombo: 'Ctrl+Shift+F', label: 'Alternar Modo Foco' },
  { command: 'toggle_line_focus', keyCombo: 'Ctrl+Shift+L', label: 'Alternar Foco em Linha' },
  { command: 'toggle_sidebar_left', keyCombo: 'Ctrl+Shift+B', label: 'Alternar Barra Esquerda' },
  { command: 'toggle_sidebar_right', keyCombo: 'Ctrl+Shift+E', label: 'Alternar Barra Direita' }
];

const SCIENTIFIC_METHODS = [
  {
    id: 'guf',
    label: 'GUF primeiro',
    description: 'Prioriza metas e entidades do universo ficcional antes de qualquer sugestao generica.'
  },
  {
    id: 'passive',
    label: 'Sugestao passiva',
    description: 'Mantem recomendacoes em painel lateral para preservar fluxo e autoria do escritor.'
  },
  {
    id: 'evidence',
    label: 'Evidencia hibrida',
    description: 'Combina embeddings, entidades detectadas e verificacao zero-shot antes de concluir uma meta.'
  }
];

const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};

export default function EditorComponent() {
  const [nodes, setNodes] = useState<MetaNode[]>([]);
  const [edges, setEdges] = useState<MetaEdge[]>([]);
  const [mmsLogs, setMmsLogs] = useState<MMSLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSnapshotTimeRef = useRef<number>(Date.now());
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // IA Local State (Carregado globalmente no AppContext)
  const { 
    isAILoaded, 
    isAILoading, 
    aiLoadProgress, 
    aiLoadStatus, 
    loadAI: handleLoadAI,
    setHideSidebar,
    activeProject
  } = useApp();

  // Metas de Produtividade State
  const [wordsToday, setWordsToday] = useState(0);
  const [wordsSession, setWordsSession] = useState(0);
  const [initialWordCount, setInitialWordCount] = useState<number | null>(null);
  const [activeGoal, setActiveGoal] = useState<WritingGoal | null>(null);
  const [streak, setStreak] = useState<WritingStreak>({
    currentStreak: 0,
    longestStreak: 0,
    lastWrittenDate: '',
    offDays: []
  });
  
  // Manuscripts / Explorer State
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [activeManuscript, setActiveManuscript] = useState<Manuscript | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingChapterTitle, setEditingChapterTitle] = useState('');
  const [showTrashPanel, setShowTrashPanel] = useState(false);

  // Folders & Hierarchy State (UC-010 / UC-011)
  const [folders, setFolders] = useState<Folder[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<{ [id: string]: boolean }>({});
  const [showAddFolderInput, setShowAddFolderInput] = useState<{ [parentIdOrRoot: string]: boolean }>({});

  // Layout & Settings states
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isLineFocus, setIsLineFocus] = useState(false);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'goals' | 'shortcuts'>('goals');
  const [newGoalWords, setNewGoalWords] = useState(500);
  const [newGoalType, setNewGoalType] = useState<'DIARIA' | 'PRAZO'>('DIARIA');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [selectedOffDays, setSelectedOffDays] = useState<string[]>(['0', '6']);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasCelebratedToday, setHasCelebratedToday] = useState(false);

  // Autosave, Sync and Versioning states
  const [rightTab, setRightTab] = useState<'mms' | 'versions'>('mms');
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'local'>('synced');
  const [versions, setVersions] = useState<{ id: string; manuscriptId: string; versionNumber: number; title: string; content: string; createdAt: string }[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<{ id: string; manuscriptId: string; versionNumber: number; title: string; content: string; createdAt: string } | null>(null);
  const [showVersionPreview, setShowVersionPreview] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Keyboard Shortcuts states
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>(DEFAULT_SHORTCUTS);
  const [capturingCommand, setCapturingCommand] = useState<string | null>(null);
  const [shortcutConflict, setShortcutConflict] = useState<string | null>(null);

  const loadVersions = async (manuscriptId: string) => {
    if (!manuscriptId) return;
    const list = await db.manuscriptVersions
      .filter(v => v.manuscriptId === manuscriptId)
      .toArray();
    list.sort((a, b) => b.versionNumber - a.versionNumber);
    setVersions(list);
  };

  const createVersionSnapshot = async (manuscript: Manuscript, currentContent: string) => {
    const list = await db.manuscriptVersions
      .filter(v => v.manuscriptId === manuscript.id)
      .toArray();
    const nextVerNumber = list.length > 0 ? Math.max(...list.map(v => v.versionNumber)) + 1 : 1;

    const newVersion = {
      id: crypto.randomUUID(),
      manuscriptId: manuscript.id,
      versionNumber: nextVerNumber,
      title: manuscript.title,
      content: currentContent,
      createdAt: new Date().toISOString()
    };

    await db.manuscriptVersions.put(newVersion);
    await loadVersions(manuscript.id);
  };

  const handleRestoreVersion = async (version: typeof versions[0]) => {
    if (!activeManuscript) return;

    const currentHtml = editor?.getHTML() || '';
    await createVersionSnapshot(activeManuscript, currentHtml);

    const updated = {
      ...activeManuscript,
      content: version.content,
      updatedAt: new Date().toISOString()
    };

    await db.manuscripts.put(updated);
    setActiveManuscript(updated);
    editor?.commands.setContent(version.content);
    
    setSuccess('Versão anterior restaurada. Um ponto de restauração do estado atual foi criado.');
    setShowVersionPreview(false);
    setSelectedVersion(null);

    syncToServer(updated);

    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSelectChapter = async (chapter: Manuscript) => {
    if (activeManuscript) {
      const currentHtml = editor?.getHTML() || '';
      await createVersionSnapshot(activeManuscript, currentHtml);
    }
    setActiveManuscript(chapter);
  };

  const syncToServer = async (manuscript: Manuscript) => {
    const isBrowser = typeof window !== 'undefined';
    const activeProjectId = isBrowser ? localStorage.getItem('activeProjectId') || 'default' : 'default';

    const payload = {
      manuscript: {
        id: manuscript.id,
        title: manuscript.title,
        content: manuscript.content,
        status: manuscript.status,
        isLocked: manuscript.isLocked,
        projectId: activeProjectId,
        createdAt: manuscript.createdAt
      }
    };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      await db.pendingSaves.put({
        id: crypto.randomUUID(),
        manuscriptId: manuscript.id,
        content: manuscript.content,
        timestamp: Date.now()
      });
      setSyncStatus('local');
      return;
    }

    try {
      const res = await fetch('/api/manuscripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Sync failed');
      }

      setSyncStatus('synced');
    } catch (err) {
      console.warn('Sync failed, buffering local save:', err);
      await db.pendingSaves.put({
        id: crypto.randomUUID(),
        manuscriptId: manuscript.id,
        content: manuscript.content,
        timestamp: Date.now()
      });
      setSyncStatus('local');
    }
  };

  useEffect(() => {
    const handleOnline = async () => {
      const pending = await db.pendingSaves.toArray();
      if (pending.length === 0) {
        setSyncStatus('synced');
        return;
      }

      setSyncStatus('syncing');
      pending.sort((a, b) => a.timestamp - b.timestamp);

      const activeProjectId = typeof window !== 'undefined' ? localStorage.getItem('activeProjectId') || 'default' : 'default';

      try {
        for (const item of pending) {
          const manuscript = await db.manuscripts.get(item.manuscriptId);
          if (!manuscript) continue;

          const res = await fetch('/api/manuscripts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              manuscript: {
                ...manuscript,
                content: item.content,
                projectId: activeProjectId
              }
            })
          });

          if (res.ok) {
            await db.pendingSaves.delete(item.id);
          }
        }
        setSyncStatus('synced');
      } catch (err) {
        console.error('Failed to clear pending saves queue:', err);
        setSyncStatus('local');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
      }
    };
  }, []);

  // Load from Dexie
  const loadData = async () => {
    const savedNodes = await db.metaNodes.toArray();
    const savedEdges = await db.metaEdges.toArray();
    setNodes(savedNodes);
    setEdges(savedEdges);

    // Load active goal
    const savedGoals = await db.writingGoals.toArray();
    if (savedGoals.length > 0) {
      setActiveGoal(savedGoals[0]);
      setNewGoalWords(savedGoals[0].targetWords);
      setNewGoalType(savedGoals[0].type);
      setNewGoalDeadline(savedGoals[0].deadline || '');
    } else {
      const defaultGoal: WritingGoal = {
        id: 'main_goal',
        type: 'DIARIA',
        targetWords: 500,
        documentIds: [],
        createdAt: new Date().toISOString()
      };
      await db.writingGoals.put(defaultGoal);
      setActiveGoal(defaultGoal);
    }

    // Load streak
    const savedStreak = await db.writingStreak.get('main_streak');
    if (savedStreak) {
      setStreak(savedStreak);
      setSelectedOffDays(savedStreak.offDays || []);
    } else {
      const defaultStreak: WritingStreak = {
        currentStreak: 0,
        longestStreak: 0,
        lastWrittenDate: '',
        offDays: ['0', '6']
      };
      await db.writingStreak.put({ ...defaultStreak, id: 'main_streak' as any });
      setStreak(defaultStreak);
    }

    // Load today's log
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = await db.writingLogs.get(todayStr);
    if (todayLog) {
      setWordsToday(todayLog.wordsWritten);
    }

    // Load custom shortcuts
    const savedShortcuts = await db.keyboardShortcuts.toArray();
    if (savedShortcuts.length > 0) {
      const merged = DEFAULT_SHORTCUTS.map(def => {
        const custom = savedShortcuts.find(s => s.command === def.command);
        return custom ? { ...def, keyCombo: custom.keyCombo } : def;
      });
      setShortcuts(merged);
    }

    await loadManuscripts();
    await loadFolders();
  };

  const loadFolders = async () => {
    const savedFolders = await db.folders.toArray();
    setFolders(savedFolders);
  };

  const loadManuscripts = async () => {
    const savedManuscripts = await db.manuscripts.toArray();
    
    // Auto purge trash older than 30 days (UC-157 Exception Flow)
    const now = Date.now();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const expiredTrash = savedManuscripts.filter(m => 
      m.inTrash && m.deletedAt && (now - new Date(m.deletedAt).getTime() > thirtyDaysInMs)
    );
    if (expiredTrash.length > 0) {
      await Promise.all(expiredTrash.map(async item => {
        await db.manuscripts.delete(item.id);
        try {
          await fetch(`/api/manuscripts/${item.id}`, { method: 'DELETE' });
        } catch (err) {
          console.error('Purge error:', err);
        }
      }));
      const reloaded = await db.manuscripts.toArray();
      savedManuscripts.length = 0;
      savedManuscripts.push(...reloaded);
    }

    const activeList = savedManuscripts.filter(m => !m.inTrash);

    if (activeList.length > 0) {
      setManuscripts(savedManuscripts);
      
      // Select the first active chapter by default if not set or in trash
      if (!activeManuscript || activeManuscript.inTrash) {
        setActiveManuscript(activeList[0]);
      } else {
        const updatedActive = savedManuscripts.find(m => m.id === activeManuscript.id);
        if (updatedActive && !updatedActive.inTrash) {
          setActiveManuscript(updatedActive);
        } else {
          setActiveManuscript(activeList[0]);
        }
      }
    } else {
      // Create initial chapter
      const defaultManuscript: Manuscript = {
        id: crypto.randomUUID(),
        title: 'Capítulo 1 - A Travessia',
        content: `
          <p>Kael respirou fundo e deu os primeiros passos na Floresta dos Sussurros. As árvores retorcidas pareciam murmurar segredos ao vento frio da noite.</p>
          <p>Ele caminhou por horas, guiado apenas pelo sussurro das folhas. Sob as raíces massivas de um salgueiro ancião, algo brilhava debilmente sob a terra úmida. Kael cavou freneticamente até que suas mãos tocaram a superfície gélida do Medalhão Antigo. Ele finalmente o segurou contra o peito, sentindo sua pulsação mística.</p>
          <p>Ele pensou: "Vou levar o medalhão até a estalagem e amanhã pretendo encontrar a Espada do Eclipse."</p>
        `,
        status: 'RASCUNHO',
        isLocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db.manuscripts.put(defaultManuscript);
      setManuscripts([defaultManuscript]);
      setActiveManuscript(defaultManuscript);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Format key combo string helper
  const formatShortcut = (e: React.KeyboardEvent | KeyboardEvent): string => {
    const parts: string[] = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    if (e.metaKey) parts.push('Cmd');
    
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
      return parts.join('+');
    }
    
    let keyName = e.key;
    if (keyName === ' ') keyName = 'Espaço';
    else if (keyName.length === 1) keyName = keyName.toUpperCase();
    
    parts.push(keyName);
    return parts.join('+');
  };

  // Execute shortcut actions
  const triggerCommand = (command: string) => {
    switch (command) {
      case 'toggle_focus':
        setIsFocusMode(prev => {
          const next = !prev;
          if (next) {
            document.documentElement.requestFullscreen?.().catch(() => {});
          } else {
            if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
          }
          return next;
        });
        break;
      case 'toggle_line_focus':
        setIsLineFocus(prev => !prev);
        break;
      case 'toggle_sidebar_left':
        setIsLeftSidebarOpen(prev => !prev);
        break;
      case 'toggle_sidebar_right':
        setIsRightSidebarOpen(prev => !prev);
        break;
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (capturingCommand) {
        e.preventDefault();
        const combo = formatShortcut(e);
        if (['Ctrl', 'Alt', 'Shift', 'Cmd'].includes(combo)) return;
        
        const conflict = shortcuts.find(s => s.keyCombo === combo && s.command !== capturingCommand);
        if (conflict) {
          setShortcutConflict(`Conflito! Atalho já está associado a "${conflict.label}"`);
          return;
        }

        setShortcutConflict(null);
        handleSaveShortcut(capturingCommand, combo);
        return;
      }

      if (e.key === 'Escape' && isFocusMode) {
        e.preventDefault();
        triggerCommand('toggle_focus');
        return;
      }

      const pressedCombo = formatShortcut(e);
      const matched = shortcuts.find(s => s.keyCombo === pressedCombo);
      if (matched) {
        e.preventDefault();
        triggerCommand(matched.command);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, capturingCommand, isFocusMode, isLineFocus, isLeftSidebarOpen, isRightSidebarOpen]);

  const handleSaveShortcut = async (command: string, keyCombo: string) => {
    await db.keyboardShortcuts.put({ command, keyCombo });
    setShortcuts(prev => prev.map(s => s.command === command ? { ...s, keyCombo } : s));
    setCapturingCommand(null);
  };

  const handleRestoreDefaultShortcuts = async () => {
    await db.keyboardShortcuts.clear();
    setShortcuts(DEFAULT_SHORTCUTS);
    setCapturingCommand(null);
    setShortcutConflict(null);
  };

  // Initialize TipTap Editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      if (!activeManuscript || activeManuscript.isLocked) return;

      const currentText = editor.getText();
      const currentWords = countWords(currentText);

      if (initialWordCount === null) {
        setInitialWordCount(currentWords);
        return;
      }

      const diff = Math.max(0, currentWords - initialWordCount);
      setWordsSession(diff);

      // Autosave content to Dexie DB (instant < 5ms)
      const html = editor.getHTML();
      db.manuscripts.update(activeManuscript.id, {
        content: html,
        updatedAt: new Date().toISOString()
      }).then(() => {
        // Reload list locally without refetching all
        setManuscripts(prev => prev.map(m => m.id === activeManuscript.id ? { ...m, content: html } : m));
      });

      // Debounced Sync to Server (2000ms)
      setSyncStatus('syncing');
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        const updatedDoc = {
          ...activeManuscript,
          content: html
        };
        syncToServer(updatedDoc);
      }, 2000);

      // Snapshot every 10 minutes of active typing
      const nowSnapshot = Date.now();
      if (nowSnapshot - lastSnapshotTimeRef.current > 10 * 60 * 1000) {
        lastSnapshotTimeRef.current = nowSnapshot;
        createVersionSnapshot(activeManuscript, html);
      }

      // Update words written today
      const todayStr = new Date().toISOString().split('T')[0];
      db.writingLogs.get(todayStr).then(async (todayLog) => {
        const baseWords = todayLog ? todayLog.wordsWritten : 0;
        const newTodayWords = baseWords + diff;
        setWordsToday(newTodayWords);

        await db.writingLogs.put({
          id: todayStr,
          wordsWritten: newTodayWords,
          date: new Date().toISOString()
        });

        const updatedStreak = calculateStreak(streak, todayStr, newTodayWords, 200);
        await db.writingStreak.put({ ...updatedStreak, id: 'main_streak' as any });
        setStreak(updatedStreak);

        const targetGoal = activeGoal ? activeGoal.targetWords : 500;
        if (newTodayWords >= targetGoal && !hasCelebratedToday) {
          setShowCelebration(true);
          setHasCelebratedToday(true);
          setTimeout(() => setShowCelebration(false), 5000);
        }
      });

      // MMS Pipeline trigger
      if (!isAILoaded) return;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        runMMSAnalysis(currentText);
      }, 3000);
    }
  });

  // Switch Active Manuscript and set editable state
  useEffect(() => {
    if (editor && activeManuscript) {
      editor.setEditable(!activeManuscript.isLocked);
      editor.commands.setContent(activeManuscript.content);
      
      // Reset counting base on switch
      const initialWords = countWords(editor.getText());
      setInitialWordCount(initialWords);
      setWordsSession(0);

      loadVersions(activeManuscript.id);
    }
  }, [activeManuscript?.id, editor]);

  useEffect(() => {
    if (isAILoaded && editor) {
      runMMSAnalysis(editor.getText());
    }
  }, [isAILoaded, editor]);

  useEffect(() => {
    setHideSidebar(isFocusMode);
    return () => setHideSidebar(false);
  }, [isFocusMode, setHideSidebar]);

  // Handle active status toggle
  const handleUpdateStatus = async (status: 'RASCUNHO' | 'REVISAO' | 'FINALIZADO') => {
    if (!activeManuscript) return;
    const isLocked = status === 'FINALIZADO'; // auto lock on finalize as required

    const updated = {
      ...activeManuscript,
      status,
      isLocked,
      updatedAt: new Date().toISOString()
    };

    await db.manuscripts.put(updated);
    setActiveManuscript(updated);
    setManuscripts(prev => prev.map(m => m.id === updated.id ? updated : m));
    
    if (editor) {
      editor.setEditable(!isLocked);
    }
  };

  // Toggle edit lock state
  const handleToggleLock = async () => {
    if (!activeManuscript) return;
    const isLocked = !activeManuscript.isLocked;

    const updated = {
      ...activeManuscript,
      isLocked,
      updatedAt: new Date().toISOString()
    };

    await db.manuscripts.put(updated);
    setActiveManuscript(updated);
    setManuscripts(prev => prev.map(m => m.id === updated.id ? updated : m));
    
    if (editor) {
      editor.setEditable(!isLocked);
    }
  };

  // Add new chapter
  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;

    const newChapter: Manuscript = {
      id: 'chapter_' + Date.now(),
      title: newChapterTitle.trim(),
      content: '<p>Comece a escrever...</p>',
      status: 'RASCUNHO',
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.manuscripts.put(newChapter);
    setNewChapterTitle('');
    await loadManuscripts();
    setActiveManuscript(newChapter);
  };

  // Delete chapter (Move to trash - logical delete)
  const handleDeleteChapter = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const activeList = manuscripts.filter(m => !m.inTrash);
    if (activeList.length <= 1) {
      alert('Você precisa manter pelo menos um capítulo ativo.');
      return;
    }

    if (confirm('Deseja mover este capítulo para a lixeira? Ele poderá ser restaurado nos próximos 30 dias.')) {
      const nowString = new Date().toISOString();
      await db.manuscripts.update(id, {
        inTrash: true,
        deletedAt: nowString
      });
      
      // Sincronizar com o servidor se conectado
      const target = manuscripts.find(m => m.id === id);
      if (target) {
        try {
          await fetch('/api/manuscripts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              manuscript: {
                ...target,
                inTrash: true,
                deletedAt: nowString
              }
            })
          });
        } catch (err) {
          console.error('Falha ao sincronizar lixeira lógica com servidor:', err);
        }
      }

      // If we deleted the active one, select another active one
      if (activeManuscript?.id === id) {
        const remaining = activeList.filter(m => m.id !== id);
        setActiveManuscript(remaining[0]);
      }
      
      await loadManuscripts();
    }
  };

  // Restore chapter from trash (UC-157)
  const handleRestoreChapter = async (id: string) => {
    await db.manuscripts.update(id, {
      inTrash: false,
      deletedAt: undefined
    });

    const target = manuscripts.find(m => m.id === id);
    if (target) {
      try {
        await fetch('/api/manuscripts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            manuscript: {
              ...target,
              inTrash: false,
              deletedAt: undefined
            }
          })
        });
      } catch (err) {
        console.error('Falha ao sincronizar restauração com servidor:', err);
      }
    }

    await loadManuscripts();
  };

  // Permanent Delete chapter (Physical delete)
  const handlePermanentDeleteChapter = async (id: string) => {
    if (confirm('Deseja excluir permanentemente este capítulo? Esta ação não pode ser desfeita.')) {
      await db.manuscripts.delete(id);
      
      try {
        const res = await fetch(`/api/manuscripts/${id}`, {
          method: 'DELETE'
        });
        if (!res.ok) {
          const data = await res.json();
          console.warn('Servidor retornou erro na deleção física:', data.message);
        }
      } catch (err) {
        console.error('Falha ao sincronizar deleção física com servidor:', err);
      }

      await loadManuscripts();
    }
  };

  // Empty all items in trash (Physical delete all)
  const handleEmptyTrashAll = async () => {
    const trashItems = manuscripts.filter(m => m.inTrash);
    if (trashItems.length === 0) return;

    if (confirm('Deseja excluir permanentemente todos os itens da lixeira? Esta ação não pode ser desfeita.')) {
      await Promise.all(trashItems.map(async item => {
        await db.manuscripts.delete(item.id);
        
        try {
          await fetch(`/api/manuscripts/${item.id}`, {
            method: 'DELETE'
          });
        } catch (err) {
          console.error('Falha ao deletar fisicamente do servidor:', err);
        }
      }));

      await loadManuscripts();
    }
  };

  // Start renaming chapter
  const startRenameChapter = (chapter: Manuscript, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChapterId(chapter.id);
    setEditingChapterTitle(chapter.title);
  };

  // Create subfolder or root folder (UC-010 / UC-011)
  const handleCreateFolder = async (name: string, parentId?: string) => {
    if (!name.trim()) return;
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name: name.trim(),
      projectId: activeProject?.id || 'default',
      parentFolderId: parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.folders.put(newFolder);
    
    // Sincronizar com o servidor
    try {
      await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: newFolder })
      });
    } catch (err) {
      console.error('Erro ao sincronizar pasta com o servidor:', err);
    }

    await loadFolders();
  };

  // Move manuscript into a folder (UC-010 / UC-012)
  const handleMoveManuscriptToFolder = async (manuscriptId: string, folderId?: string) => {
    await db.manuscripts.update(manuscriptId, {
      folderId: folderId || undefined,
      updatedAt: new Date().toISOString()
    });

    const target = manuscripts.find(m => m.id === manuscriptId);
    if (target) {
      try {
        await fetch('/api/manuscripts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            manuscript: {
              ...target,
              folderId: folderId || undefined,
              updatedAt: new Date().toISOString()
            }
          })
        });
      } catch (err) {
        console.error('Erro ao sincronizar movimento com servidor:', err);
      }
    }

    await loadManuscripts();
  };

  // Move folder inside another folder (UC-011 / UC-012 subfolders)
  const handleMoveFolderToFolder = async (folderId: string, parentFolderId?: string) => {
    if (parentFolderId) {
      if (folderId === parentFolderId) return;
      let current = parentFolderId;
      let hasCycle = false;
      // Loop check
      while (current) {
        const f = folders.find(item => item.id === current);
        if (!f) break;
        if (f.id === folderId || f.parentFolderId === folderId) {
          hasCycle = true;
          break;
        }
        current = f.parentFolderId || '';
      }
      if (hasCycle) {
        alert('Ação inválida: pasta pai não pode ser filha de si mesma.');
        return;
      }
    }

    await db.folders.update(folderId, {
      parentFolderId: parentFolderId || undefined,
      updatedAt: new Date().toISOString()
    });

    const target = folders.find(f => f.id === folderId);
    if (target) {
      try {
        await fetch('/api/folders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            folder: {
              ...target,
              parentFolderId: parentFolderId || undefined,
              updatedAt: new Date().toISOString()
            }
          })
        });
      } catch (err) {
        console.error('Erro ao sincronizar movimento de pasta:', err);
      }
    }

    await loadFolders();
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Drag and Drop tree rendering logic (UC-010 / UC-011)
  const renderFolderNode = (folder: Folder, depth = 0) => {
    const isExpanded = !!expandedFolders[folder.id];
    const subfolders = folders.filter(f => f.parentFolderId === folder.id);
    const folderChapters = manuscripts.filter(m => m.folderId === folder.id && !m.inTrash);
    
    let hoverTimer: NodeJS.Timeout;

    const onDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const onDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Auto expand folder after 1.5s if hover
      if (!isExpanded) {
        hoverTimer = setTimeout(() => {
          setExpandedFolders(prev => ({ ...prev, [folder.id]: true }));
        }, 1500);
      }
    };

    const onDragLeave = () => {
      if (hoverTimer) clearTimeout(hoverTimer);
    };

    const onDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (hoverTimer) clearTimeout(hoverTimer);

      const type = e.dataTransfer.getData('drag-type');
      const dragId = e.dataTransfer.getData('drag-id');

      if (type === 'manuscript') {
        await handleMoveManuscriptToFolder(dragId, folder.id);
      } else if (type === 'folder') {
        await handleMoveFolderToFolder(dragId, folder.id);
      }
    };

    const onDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData('drag-type', 'folder');
      e.dataTransfer.setData('drag-id', folder.id);
    };

    return (
      <div 
        key={folder.id} 
        className="folder-node"
        style={{ paddingLeft: `${depth * 0.25}rem` }}
      >
        <div 
          className="folder-header glass"
          draggable="true"
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => toggleFolder(folder.id)}
        >
          <div className="folder-title">
            <span className="folder-icon">
              {isExpanded ? '📂' : '📁'}
            </span>
            <span className="folder-name-text">{folder.name}</span>
          </div>
          <div className="folder-actions" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowAddFolderInput(prev => ({ ...prev, [folder.id]: !prev[folder.id] }))}
              title="Nova subpasta"
              className="action-btn"
            >
              +📁
            </button>
            <button 
              onClick={async () => {
                if (confirm(`Deseja excluir a pasta "${folder.name}"? Os capítulos dentro dela serão movidos para a raiz.`)) {
                  await db.folders.delete(folder.id);
                  try {
                    await fetch(`/api/folders/${folder.id}`, { method: 'DELETE' });
                  } catch (err) {}
                  
                  // Desalojar capítulos locais
                  const childChapters = manuscripts.filter(m => m.folderId === folder.id);
                  await Promise.all(childChapters.map(async ch => {
                    await db.manuscripts.update(ch.id, { folderId: undefined });
                  }));
                  
                  // Desalojar subpastas locais
                  const childFolders = folders.filter(f => f.parentFolderId === folder.id);
                  await Promise.all(childFolders.map(async f => {
                    await db.folders.update(f.id, { parentFolderId: undefined });
                  }));
                  
                  await loadFolders();
                  await loadManuscripts();
                }
              }}
              title="Excluir Pasta"
              className="action-btn delete"
            >
              ×
            </button>
          </div>
        </div>

        {/* Input for new subfolder inside this folder */}
        {showAddFolderInput[folder.id] && (
          <div className="add-subfolder-row" style={{ marginLeft: '1.2rem' }}>
            <input 
              type="text" 
              placeholder="Nome da subpasta..."
              onKeyDown={async e => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.trim()) {
                    await handleCreateFolder(val, folder.id);
                    setShowAddFolderInput(prev => ({ ...prev, [folder.id]: false }));
                  }
                }
              }}
              onBlur={() => setShowAddFolderInput(prev => ({ ...prev, [folder.id]: false }))}
              autoFocus
              className="rename-input"
            />
          </div>
        )}

        {isExpanded && (
          <div className="folder-children">
            {/* Subfolders */}
            {subfolders.map(sub => renderFolderNode(sub, depth + 1))}
            
            {/* Chapters */}
            {folderChapters.map(chapter => renderManuscriptNode(chapter, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderManuscriptNode = (chapter: Manuscript, depth = 0) => {
    const onDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData('drag-type', 'manuscript');
      e.dataTransfer.setData('drag-id', chapter.id);
    };

    return (
      <div 
        key={chapter.id} 
        draggable="true"
        onDragStart={onDragStart}
        onClick={() => handleSelectChapter(chapter)}
        className={`chapter-list-item ${activeManuscript?.id === chapter.id ? 'active' : ''}`}
        style={{ marginLeft: `${depth * 0.25}rem` }}
      >
        {editingChapterId === chapter.id ? (
          <input 
            type="text"
            value={editingChapterTitle}
            onChange={(e) => setEditingChapterTitle(e.target.value)}
            onBlur={() => handleSaveRename(chapter.id)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveRename(chapter.id); }}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            className="rename-input"
          />
        ) : (
          <div className="chapter-item-details">
            <span className="chapter-title-text">📄 {chapter.title}</span>
            <div className="chapter-badges">
              <span className={`status-badge-tag ${chapter.status.toLowerCase()}`}>
                {chapter.status === 'RASCUNHO' ? 'R' : chapter.status === 'REVISAO' ? 'Rev' : '✓'}
              </span>
            </div>
          </div>
        )}

        <div className="chapter-actions">
          <button 
            onClick={(e) => startRenameChapter(chapter, e)} 
            title="Renomear"
            className="action-btn"
          >
            ✎
          </button>
          <button 
            onClick={(e) => handleDeleteChapter(chapter.id, e)} 
            title="Excluir"
            disabled={manuscripts.filter(m => !m.inTrash).length <= 1}
            className="action-btn delete"
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  // Save renamed title
  const handleSaveRename = async (id: string) => {
    if (!editingChapterTitle.trim()) return;
    await db.manuscripts.update(id, {
      title: editingChapterTitle.trim(),
      updatedAt: new Date().toISOString()
    });
    setEditingChapterId(null);
    await loadManuscripts();
  };

  // Handle settings goals update
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedGoal: WritingGoal = {
      id: 'main_goal',
      type: newGoalType,
      targetWords: newGoalWords,
      deadline: newGoalType === 'PRAZO' ? newGoalDeadline : undefined,
      documentIds: [],
      createdAt: new Date().toISOString()
    };

    await db.writingGoals.put(updatedGoal);
    setActiveGoal(updatedGoal);

    const updatedStreak = {
      ...streak,
      offDays: selectedOffDays
    };
    await db.writingStreak.put({ ...updatedStreak, id: 'main_streak' as any });
    setStreak(updatedStreak);

    setIsSettingsOpen(false);
  };

  const toggleOffDay = (day: string) => {
    setSelectedOffDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Load local AI models - Handled globally in AppContext

  const handleImmediateCheck = () => {
    if (!isAILoaded) {
      handleLoadAI();
      return;
    }
    if (editor) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      runMMSAnalysis(editor.getText());
    }
  };

  // The MMS evaluation pipeline
  const runMMSAnalysis = async (fullText: string) => {
    if (!isAILoaded) return;
    setIsProcessing(true);
    
    const paragraphs = fullText
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 20);

    const currentNodes = await db.metaNodes.toArray();
    const currentEdges = await db.metaEdges.toArray();
    const pendingNodes = currentNodes.filter(n => n.status === 'PENDENTE' || n.status === 'EM_ANDAMENTO');
    
    const newLogs: MMSLog[] = [];
    let stateChanged = false;
    let updatedNodes = [...currentNodes];
    const goalEmbeddingCache = new Map<string, number[]>();

    for (const paragraph of paragraphs) {
      const matchedDictEntities = ENTITIES.filter(ent => 
        ent.keywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(paragraph))
      ).map(ent => ent.id);

      const nerTokens = await extractEntitiesWithNER(paragraph);
      const paraEmbedding = await computeE5Embedding(paragraph);

      for (const node of pendingNodes) {
        let goalEmbedding = goalEmbeddingCache.get(node.id);
        if (!goalEmbedding) {
          goalEmbedding = await computeE5Embedding(node.title + " " + node.description);
          goalEmbeddingCache.set(node.id, goalEmbedding);
        }
        const similarity = cosineSimilarity(paraEmbedding, goalEmbedding);
        const graphEntitiesMatched = node.relatedEntities.filter(entityId => matchedDictEntities.includes(entityId));
        const graphContextBoost = graphEntitiesMatched.length > 0 ? 0.08 : 0;
        const evidenceScore = Math.min(1, similarity + graphContextBoost);

        if (evidenceScore >= node.similarityThreshold) {
          const llmCheck = verifyZeroShotAction(paragraph, node.title);

          if (llmCheck.success) {
            newLogs.push({
              timestamp: new Date().toLocaleTimeString(),
              paragraphText: paragraph.substring(0, 80) + '...',
              goalTitle: node.title,
              similarity,
              evidenceScore,
              entitiesMatched: matchedDictEntities.map(id => ENTITIES.find(e => e.id === id)?.name || id),
              graphEntitiesMatched: graphEntitiesMatched.map(id => ENTITIES.find(e => e.id === id)?.name || id),
              nerTokens,
              llmVerification: llmCheck,
              status: 'SUCCESS'
            });

            updatedNodes = updatedNodes.map(n => 
              n.id === node.id ? { ...n, status: 'CONCLUIDO', updatedAt: new Date().toISOString() } : n
            );
            stateChanged = true;
          } else {
            newLogs.push({
              timestamp: new Date().toLocaleTimeString(),
              paragraphText: paragraph.substring(0, 80) + '...',
              goalTitle: node.title,
              similarity,
              evidenceScore,
              entitiesMatched: matchedDictEntities.map(id => ENTITIES.find(e => e.id === id)?.name || id),
              graphEntitiesMatched: graphEntitiesMatched.map(id => ENTITIES.find(e => e.id === id)?.name || id),
              nerTokens,
              llmVerification: llmCheck,
              status: 'PLANNING'
            });
          }
        } else if (similarity > 0.4) {
          newLogs.push({
            timestamp: new Date().toLocaleTimeString(),
            paragraphText: paragraph.substring(0, 80) + '...',
            goalTitle: node.title,
            similarity,
            evidenceScore,
            entitiesMatched: matchedDictEntities.map(id => ENTITIES.find(e => e.id === id)?.name || id),
            graphEntitiesMatched: graphEntitiesMatched.map(id => ENTITIES.find(e => e.id === id)?.name || id),
            nerTokens,
            llmVerification: { success: false, explanation: graphEntitiesMatched.length > 0 ? 'Contexto do grafo reconhecido, mas a acao narrativa ainda nao atingiu o limiar.' : 'Similaridade semantica abaixo do limiar.' },
            status: 'LOW_SIMILARITY'
          });
        }
      }
    }

    if (stateChanged) {
      const { updatedNodes: finalNodes } = propagateStatus(updatedNodes, currentEdges);
      await Promise.all(finalNodes.map(n => db.metaNodes.put(n)));
      setNodes(finalNodes);
    }

    setMmsLogs(prev => [...newLogs, ...prev].slice(0, 20));
    setIsProcessing(false);
  };

  // Compute stats for quota
  const calculatedQuota = activeGoal?.type === 'PRAZO' && activeGoal.deadline
    ? calculateDailyQuota(activeGoal.targetWords, wordsToday, activeGoal.deadline, new Date().toISOString().split('T')[0])
    : activeGoal?.targetWords || 500;

  const progressPercentage = Math.min(100, Math.round((wordsToday / calculatedQuota) * 100));
  const streakColor = streak.currentStreak >= 30 ? '🔥 deep-red' : streak.currentStreak >= 7 ? '🔥 golden' : '🔥 normal';
  const pendingGoals = nodes.filter(node => node.status === 'PENDENTE' || node.status === 'EM_ANDAMENTO');
  const completedGoals = nodes.filter(node => node.status === 'CONCLUIDO');
  const lastStrongEvidence = mmsLogs.find(log => log.status === 'SUCCESS' || log.status === 'PLANNING');
  const priorityGoal = pendingGoals
    .slice()
    .sort((a, b) => {
      const aDeps = edges.filter(edge => edge.toId === a.id).length;
      const bDeps = edges.filter(edge => edge.toId === b.id).length;
      return bDeps - aDeps || b.updatedAt.localeCompare(a.updatedAt);
    })[0];
  const graphCoverage = nodes.length > 0 ? Math.round((completedGoals.length / nodes.length) * 100) : 0;

  return (
    <div className={`main-content animate-fade-in ${isFocusMode ? 'focus-mode-active' : ''} ${isLineFocus ? 'line-focus-mode' : ''}`}>
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-card glass">
            <span className="celebration-emoji">🎉</span>
            <h3>Meta Diária Alcançada!</h3>
            <p>Você escreveu {wordsToday} palavras hoje. Continue com essa constância!</p>
          </div>
        </div>
      )}

      {/* Success toast notification */}
      {success && (
        <div className="success-toast glass animate-fade-in">
          <span className="toast-icon">✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* Floating Close Button for Focus Mode */}
      {isFocusMode && (
        <button onClick={() => triggerCommand('toggle_focus')} className="floating-btn-exit-focus glass">
          Sair do Modo Foco (ESC)
        </button>
      )}

      {/* Top Navbar Removida por conta do DashboardLayout */}
        {/* Left Panel - Active Goals & Writing Metrics */}
        {!isFocusMode && isLeftSidebarOpen && (
          <aside className="editor-side-panel left-panel glass">
            {/* Streak & Configure Card */}
            <div className="streak-stats-card glass">
              <div className="streak-stats-header">
                <span className={`streak-icon ${streakColor.split(' ')[1]}`}>🔥</span>
                <div>
                  <h3 className="streak-count">{streak.currentStreak} dias seguidos</h3>
                  <p className="streak-record">Recorde: {streak.longestStreak} dias</p>
                </div>
              </div>
              
              <button onClick={() => setIsSettingsOpen(true)} className="btn-configure-goals">
                Configurar Metas & Atalhos
              </button>
            </div>

            {/* Document Tree / Explorer */}
            <div className="manuscript-explorer-section">
              <h3 className="explorer-title">Capítulos</h3>
              
              <div className="explorer-actions-row">
                {/* Add Chapter Form */}
                <form onSubmit={handleAddChapter} className="add-chapter-form">
                  <input 
                    type="text" 
                    placeholder="Novo Capítulo..." 
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    required
                  />
                  <button type="submit" title="Criar Capítulo">+</button>
                </form>
                
                {/* Add Folder Button */}
                <button 
                  type="button" 
                  className="btn-create-folder-root"
                  onClick={() => setShowAddFolderInput(prev => ({ ...prev, root: !prev.root }))}
                  title="Criar Pasta na Raiz"
                >
                  +📁
                </button>
              </div>

              {showAddFolderInput.root && (
                <div className="add-subfolder-row root-folder-input">
                  <input 
                    type="text" 
                    placeholder="Nome da pasta na raiz..."
                    onKeyDown={async e => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (val.trim()) {
                          await handleCreateFolder(val, undefined);
                          setShowAddFolderInput(prev => ({ ...prev, root: false }));
                        }
                      }
                    }}
                    onBlur={() => setShowAddFolderInput(prev => ({ ...prev, root: false }))}
                    autoFocus
                    className="rename-input"
                  />
                </div>
              )}

              {/* Explorer List */}
              <div 
                className="manuscripts-list"
                onDragOver={e => e.preventDefault()}
                onDrop={async e => {
                  const type = e.dataTransfer.getData('drag-type');
                  const dragId = e.dataTransfer.getData('drag-id');
                  if (type === 'manuscript') {
                    await handleMoveManuscriptToFolder(dragId, undefined);
                  } else if (type === 'folder') {
                    await handleMoveFolderToFolder(dragId, undefined);
                  }
                }}
              >
                {/* Render folders at root */}
                {folders.filter(f => !f.parentFolderId).map(f => renderFolderNode(f, 0))}
                
                {/* Render chapters at root */}
                {manuscripts.filter(m => !m.folderId && !m.inTrash).map(m => renderManuscriptNode(m, 0))}
              </div>

              {/* Trash Area Trigger & List (UC-157) */}
              <div className="trash-section-sidebar">
                <button 
                  type="button" 
                  className={`btn-trash-trigger ${showTrashPanel ? 'active' : ''}`}
                  onClick={() => setShowTrashPanel(!showTrashPanel)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  <span>Lixeira ({manuscripts.filter(m => m.inTrash).length})</span>
                </button>

                {showTrashPanel && (
                  <div className="trash-items-list animate-fade-in">
                    {manuscripts.filter(m => m.inTrash).length === 0 ? (
                      <p className="empty-trash-msg">Lixeira vazia</p>
                    ) : (
                      <>
                        <button 
                          type="button" 
                          className="btn-empty-trash-all" 
                          onClick={handleEmptyTrashAll}
                        >
                          Esvaziar Lixeira
                        </button>
                        <div className="trash-scroller">
                          {manuscripts.filter(m => m.inTrash).map(item => {
                            const now = Date.now();
                            const deletedTime = new Date(item.deletedAt || '').getTime();
                            const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
                            const msRemaining = thirtyDaysInMs - (now - deletedTime);
                            const daysRemaining = Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));

                            return (
                              <div key={item.id} className="trash-item-card">
                                <div className="trash-item-info">
                                  <span className="trash-item-title" title={item.title}>{item.title}</span>
                                  <span className="trash-item-remaining">Restam {daysRemaining} dias</span>
                                </div>
                                <div className="trash-item-actions">
                                  <button 
                                    onClick={() => handleRestoreChapter(item.id)} 
                                    className="btn-trash-restore"
                                    title="Restaurar capítulo"
                                  >
                                    Restaurar
                                  </button>
                                  <button 
                                    onClick={() => handlePermanentDeleteChapter(item.id)} 
                                    className="btn-trash-delete"
                                    title="Excluir permanentemente"
                                  >
                                    Excluir
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <h2 className="panel-title" style={{ marginTop: '1.5rem' }}>Metas Ativas</h2>
            <p className="panel-subtitle">O MMS analisa sua digitação para completar estas metas em tempo real.</p>

            <div className="scientific-basis-card">
              <div className="basis-card-header">
                <span className="basis-kicker">Base cientifica aplicada</span>
                <strong>{graphCoverage}% do grafo validado</strong>
              </div>
              <div className="basis-method-list">
                {SCIENTIFIC_METHODS.map(method => (
                  <div key={method.id} className="basis-method-row">
                    <span>{method.label}</span>
                    <p>{method.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {priorityGoal && (
              <div className="next-step-card">
                <span className="basis-kicker">Proximo melhor passo</span>
                <strong>{priorityGoal.title}</strong>
                <p>Escreva uma acao concreta envolvendo {priorityGoal.relatedEntities.length || 'as'} entidades ligadas a esta meta para aumentar a confianca do MMS.</p>
              </div>
            )}
            
            <div className="goals-vertical-list">
              {nodes.map(node => (
                <div key={node.id} className={`goal-item-card ${node.status.toLowerCase()} ${node.type.toLowerCase()}`}>
                  <div className="goal-item-header">
                    <span className="goal-item-status-icon">
                      {node.status === 'CONCLUIDO' ? '✓' : node.status === 'INCONSISTENTE' ? '⚠' : '○'}
                    </span>
                    <span className="goal-item-type">{node.type}</span>
                  </div>
                  <h4 className="goal-item-title">{node.title}</h4>
                  <p className="goal-item-desc">{node.description}</p>
                  <div className="goal-item-meta">
                    <span>Limiar: {node.similarityThreshold}</span>
                    <span className={`status-badge ${node.status.toLowerCase()}`}>{node.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Center Panel - Editor Canvas */}
        <main className="editor-workspace">
          {/* Locked Notification Banner */}
          {activeManuscript?.isLocked && (
            <div className="locked-banner glass">
              <span>🔒 Este documento está finalizado e bloqueado para edições. Desbloqueie para editar.</span>
              <button onClick={handleToggleLock} className="btn-banner-unlock">Desbloquear</button>
            </div>
          )}

          {/* Document header controls */}
          {!isFocusMode && activeManuscript && (
            <div className="editor-document-header-controls glass">
              <div className="document-info">
                <h3>{activeManuscript.title}</h3>
                <span className="last-saved">Salvo automaticamente</span>
              </div>

              <div className="document-actions-controls">
                {/* Status Selector */}
                <div className="status-selector-group">
                  <label>Status:</label>
                  <select 
                    value={activeManuscript.status} 
                    onChange={(e) => handleUpdateStatus(e.target.value as any)}
                  >
                    <option value="RASCUNHO">Rascunho</option>
                    <option value="REVISAO">Em Revisão</option>
                    <option value="FINALIZADO">Finalizado</option>
                  </select>
                </div>

                {/* Edit Lock Button */}
                <button 
                  onClick={handleToggleLock}
                  className={`btn-lock-toggle ${activeManuscript.isLocked ? 'locked' : ''}`}
                >
                  {activeManuscript.isLocked ? 'Desbloquear Capítulo' : 'Bloquear Capítulo'}
                </button>
              </div>
            </div>
          )}

          {!isFocusMode && !activeManuscript && (
            <div className="editor-workspace-header">
              <div>
                <h2>Manuscrito Principal</h2>
                <p className="subtitle">Selecione um capítulo no explorer lateral esquerdo para começar.</p>
              </div>
            </div>
          )}

          {/* TipTap editor canvas */}
          <div className="tiptap-editor-container glass">
            {editor && <EditorContent editor={editor} className="tiptap-editor-content" />}
          </div>

          {/* Floating Footer Progress Bar */}
          <div className="editor-progress-footer glass">
            <div className="progress-info">
              <span className="progress-title">
                {activeGoal?.type === 'PRAZO' ? 'Meta de Prazo' : 'Meta Diária'}: {wordsToday} / {calculatedQuota} palavras hoje
              </span>
              <span className="progress-percentage">{progressPercentage}%</span>
            </div>
            <div className="progress-track">
              <div className={`progress-fill ${progressPercentage >= 100 ? 'completed' : ''}`} style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="session-stats">
              <span>Sessão: {wordsSession} palavras</span>
              <span className="sync-status-badge">
                <span className={`status-dot ${syncStatus}`}></span>
                {syncStatus === 'syncing' ? 'Sincronizando...' : 
                 syncStatus === 'synced' ? 'Sincronizado com a nuvem' : 
                 'Salvo localmente (offline)'}
              </span>
              <span>
                Atalhos: Foco {shortcuts.find(s=>s.command==='toggle_focus')?.keyCombo} | Linha {shortcuts.find(s=>s.command==='toggle_line_focus')?.keyCombo}
              </span>
            </div>
          </div>
        </main>

        {/* Right Panel - MMS Logs & Version History */}
        {!isFocusMode && isRightSidebarOpen && (
          <aside className="editor-side-panel mms-logs-panel glass">
            <div className="panel-tabs">
              <button 
                type="button" 
                className={`panel-tab-btn ${rightTab === 'mms' ? 'active' : ''}`}
                onClick={() => setRightTab('mms')}
              >
                Evidências MMS
              </button>
              <button 
                type="button" 
                className={`panel-tab-btn ${rightTab === 'versions' ? 'active' : ''}`}
                onClick={() => setRightTab('versions')}
              >
                Histórico de Versões
              </button>
            </div>

            {rightTab === 'mms' ? (
              <>
                <p className="panel-subtitle">Leitura passiva baseada em grafo, entidades e similaridade semantica. O texto continua sendo o centro da tela.</p>

                <div className="evidence-summary-grid">
                  <div className="evidence-summary-item">
                    <span>Metas abertas</span>
                    <strong>{pendingGoals.length}</strong>
                  </div>
                  <div className="evidence-summary-item">
                    <span>Confianca recente</span>
                    <strong>{lastStrongEvidence ? `${Math.round(lastStrongEvidence.evidenceScore * 100)}%` : '--'}</strong>
                  </div>
                </div>

                {!isAILoaded && (
                  <button onClick={handleLoadAI} disabled={isAILoading} className="btn-ai-load">
                    {isAILoading ? aiLoadStatus : 'Ativar analise local'}
                  </button>
                )}

                {isAILoaded && (
                  <button onClick={handleImmediateCheck} disabled={isProcessing} className="btn-ai-load secondary">
                    {isProcessing ? 'Analisando...' : 'Reavaliar capitulo'}
                  </button>
                )}

                <div className="logs-container">
                  {!isAILoaded ? (
                    <p className="no-logs">Ative os modelos locais quando quiser validar metas. A analise fica lateral para nao interromper a escrita.</p>
                  ) : mmsLogs.length === 0 ? (
                    <p className="no-logs">Nenhuma atividade de digitação avaliada ainda. Escreva no editor para iniciar o monitor.</p>
                  ) : (
                    mmsLogs.map((log, idx) => (
                      <div key={idx} className={`log-card ${log.status.toLowerCase()}`}>
                        <div className="log-header">
                          <span className="log-time">{log.timestamp}</span>
                          <span className={`log-status-badge ${log.status.toLowerCase()}`}>
                            {log.status === 'SUCCESS' ? 'Meta Atendida' : log.status === 'PLANNING' ? 'Planejamento' : 'Similaridade Baixa'}
                          </span>
                        </div>
                        
                        <div className="log-body">
                          <p className="log-goal"><strong>Meta:</strong> {log.goalTitle}</p>
                          <div className="evidence-bars">
                            <div>
                              <span>Semantica E5</span>
                              <strong>{Math.round(log.similarity * 100)}%</strong>
                            </div>
                            <div>
                              <span>Evidencia final</span>
                              <strong>{Math.round(log.evidenceScore * 100)}%</strong>
                            </div>
                          </div>
                          {log.graphEntitiesMatched.length > 0 ? (
                            <p className="log-entities"><strong>Entidades do grafo:</strong> {log.graphEntitiesMatched.join(', ')}</p>
                          ) : log.entitiesMatched.length > 0 && (
                            <p className="log-entities"><strong>Entidades detectadas:</strong> {log.entitiesMatched.join(', ')}</p>
                          )}
                          {log.nerTokens.length > 0 && (
                            <div className="log-ner-tokens">
                              <strong>NER local:</strong>
                              <div className="ner-tokens-list">
                                {log.nerTokens.slice(0, 8).map((tok, tIdx) => (
                                  <span key={tIdx} className={`ner-token ${tok.entity.toLowerCase()}`}>
                                    {tok.word}: {tok.entity}
                                  </span>
                                ))}
                                {log.nerTokens.length > 8 && <span>...</span>}
                              </div>
                            </div>
                          )}
                          <div className="log-paragraph">
                            <span className="label">Trecho:</span>
                            <span className="text">"{log.paragraphText}"</span>
                          </div>
                          <p className="log-explanation"><strong>Decisao:</strong> {log.llmVerification.explanation}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="panel-subtitle">Pontos de restauração salvos localmente. A restauração criará automaticamente um backup do estado atual.</p>
                
                <button 
                  type="button" 
                  className="btn-create-snapshot"
                  onClick={() => {
                    if (activeManuscript) {
                      createVersionSnapshot(activeManuscript, editor?.getHTML() || '');
                    }
                  }}
                  disabled={!activeManuscript}
                >
                  + Criar Ponto de Restauração
                </button>

                <div className="versions-container">
                  {versions.length === 0 ? (
                    <p className="no-logs">Nenhum ponto de restauração registrado para este capítulo. Digite por 10 minutos ou clique no botão acima para registrar.</p>
                  ) : (
                    versions.map((ver) => {
                      // Strip html tag excerpt
                      const rawText = ver.content.replace(/<[^>]*>/g, '');
                      const excerpt = rawText.length > 80 ? rawText.substring(0, 80) + '...' : rawText || '(Capítulo Vazio)';

                      return (
                        <div key={ver.id} className="version-card glass">
                          <div className="version-card-header">
                            <span className="version-number">Versão #{ver.versionNumber}</span>
                            <span className="version-time">{new Date(ver.createdAt).toLocaleTimeString()} - {new Date(ver.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="version-excerpt">"{excerpt}"</p>
                          <button 
                            type="button" 
                            className="btn-view-version"
                            onClick={() => {
                              setSelectedVersion(ver);
                              setShowVersionPreview(true);
                            }}
                          >
                            Visualizar & Restaurar
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </aside>
        )}
      {/* Version Preview Modal */}
      {showVersionPreview && selectedVersion && (
        <div className="version-modal-overlay animate-fade-in">
          <div className="version-modal-card glass">
            <div className="version-modal-header">
              <h3>Visualizar Versão #{selectedVersion.versionNumber}</h3>
              <span className="version-modal-time">Salvo em {new Date(selectedVersion.createdAt).toLocaleString()}</span>
            </div>
            
            <div className="version-modal-body">
              <div className="version-content-preview" dangerouslySetInnerHTML={{ __html: selectedVersion.content || '<p>(Sem conteúdo)</p>' }} />
            </div>

            <div className="version-modal-actions">
              <button 
                type="button" 
                className="btn-modal-restore"
                onClick={() => handleRestoreVersion(selectedVersion)}
              >
                Restaurar Esta Versão
              </button>
              <button 
                type="button" 
                className="btn-modal-close"
                onClick={() => {
                  setShowVersionPreview(false);
                  setSelectedVersion(null);
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal (Goals & Keyboard Shortcuts) */}
      {isSettingsOpen && (
        <div className="settings-modal-overlay">
          <div className="settings-modal-content glass">
            {/* Modal Tabs */}
            <div className="settings-modal-tabs">
              <button 
                type="button"
                className={`settings-tab-btn ${settingsTab === 'goals' ? 'active' : ''}`}
                onClick={() => setSettingsTab('goals')}
              >
                Metas de Escrita
              </button>
              <button 
                type="button"
                className={`settings-tab-btn ${settingsTab === 'shortcuts' ? 'active' : ''}`}
                onClick={() => setSettingsTab('shortcuts')}
              >
                Atalhos de Teclado
              </button>
            </div>

            {settingsTab === 'goals' ? (
              <form onSubmit={handleSaveSettings} className="settings-form">
                <div className="form-group">
                  <label>Tipo de Meta</label>
                  <select value={newGoalType} onChange={(e) => setNewGoalType(e.target.value as any)}>
                    <option value="DIARIA">Meta Diária Fixa</option>
                    <option value="PRAZO">Meta com Prazo Final</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{newGoalType === 'PRAZO' ? 'Total de Palavras Alvo' : 'Palavras por Dia Alvo'}</label>
                  <input 
                    type="number" 
                    value={newGoalWords} 
                    onChange={(e) => setNewGoalWords(Math.max(1, parseInt(e.target.value)))} 
                    required 
                  />
                </div>

                {newGoalType === 'PRAZO' && (
                  <div className="form-group">
                    <label>Data Limite</label>
                    <input 
                      type="date" 
                      value={newGoalDeadline} 
                      onChange={(e) => setNewGoalDeadline(e.target.value)} 
                      required 
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Dias de Folga (Protege a Sequência/Streak)</label>
                  <div className="off-days-checkboxes">
                    {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((dayName, idx) => (
                      <label key={idx} className="off-day-label">
                        <input 
                          type="checkbox" 
                          checked={selectedOffDays.includes(idx.toString())} 
                          onChange={() => toggleOffDay(idx.toString())}
                        />
                        <span>{dayName}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setIsSettingsOpen(false)} className="btn-cancel">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save">
                    Salvar Configurações
                  </button>
                </div>
              </form>
            ) : (
              <div className="shortcuts-settings-panel">
                <p className="shortcuts-info">Clique no atalho para editar e pressione a nova combinação de teclas desejada.</p>
                <div className="shortcuts-list">
                  {shortcuts.map(sh => (
                    <div key={sh.command} className="shortcut-setting-row">
                      <span className="shortcut-label">{sh.label}</span>
                      <button 
                        onClick={() => {
                          setCapturingCommand(sh.command);
                          setShortcutConflict(null);
                        }} 
                        className={`btn-capture-shortcut ${capturingCommand === sh.command ? 'capturing' : ''}`}
                      >
                        {capturingCommand === sh.command ? 'Pressione teclas...' : sh.keyCombo}
                      </button>
                    </div>
                  ))}
                </div>

                {shortcutConflict && <div className="shortcut-error">{shortcutConflict}</div>}

                <div className="form-actions">
                  <button onClick={handleRestoreDefaultShortcuts} className="btn-cancel">
                    Restaurar Padrões
                  </button>
                  <button onClick={() => setIsSettingsOpen(false)} className="btn-save">
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .editor-side-panel {
          width: 300px;
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          padding: 1.2rem;
          overflow-y: auto;
          transition: all 0.2s;
        }

        .mms-logs-panel {
          width: 320px;
          border-right: none;
          border-left: 1px solid var(--border-light);
        }

        .panel-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .panel-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
          margin-bottom: 1.2rem;
          line-height: 1.4;
        }

        .evidence-summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
          margin-bottom: 0.8rem;
        }

        .evidence-summary-item {
          border: 1px solid var(--border-light);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 0.65rem;
        }

        .evidence-summary-item span {
          display: block;
          color: var(--text-muted);
          font-size: 0.66rem;
          line-height: 1.2;
        }

        .evidence-summary-item strong {
          display: block;
          color: var(--text-primary);
          font-size: 1.1rem;
          margin-top: 0.25rem;
        }

        .btn-ai-load {
          width: 100%;
          border: 1px solid rgba(20, 184, 166, 0.32);
          background: rgba(20, 184, 166, 0.12);
          color: var(--text-primary);
          border-radius: 8px;
          padding: 0.7rem 0.85rem;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 0.9rem;
        }

        .btn-ai-load.secondary {
          background: rgba(37, 99, 235, 0.11);
          border-color: rgba(37, 99, 235, 0.28);
        }

        .btn-ai-load:disabled {
          opacity: 0.72;
          cursor: progress;
        }

        .logs-container {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .no-logs {
          color: var(--text-muted);
          border: 1px dashed var(--border-light);
          border-radius: 8px;
          padding: 0.9rem;
          font-size: 0.78rem;
          line-height: 1.45;
        }

        .log-card {
          border: 1px solid var(--border-light);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 0.85rem;
        }

        .log-card.success {
          border-color: rgba(16, 185, 129, 0.34);
          background: rgba(16, 185, 129, 0.07);
        }

        .log-card.planning {
          border-color: rgba(234, 179, 8, 0.28);
          background: rgba(234, 179, 8, 0.06);
        }

        .log-header {
          display: flex;
          justify-content: space-between;
          gap: 0.6rem;
          align-items: center;
          margin-bottom: 0.7rem;
        }

        .log-time {
          color: var(--text-muted);
          font-size: 0.68rem;
        }

        .log-status-badge {
          border: 1px solid var(--border-light);
          border-radius: 999px;
          padding: 0.14rem 0.45rem;
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .log-status-badge.success {
          border-color: rgba(16, 185, 129, 0.35);
          color: var(--color-concluido);
        }

        .log-status-badge.planning {
          border-color: rgba(234, 179, 8, 0.35);
          color: var(--color-exposicao);
        }

        .log-body {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          font-size: 0.74rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .log-goal {
          color: var(--text-primary);
        }

        .evidence-bars {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .evidence-bars div {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          padding: 0.45rem;
        }

        .evidence-bars span {
          display: block;
          color: var(--text-muted);
          font-size: 0.64rem;
        }

        .evidence-bars strong {
          display: block;
          color: var(--text-primary);
          font-size: 0.9rem;
          margin-top: 0.14rem;
        }

        .ner-tokens-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          margin-top: 0.35rem;
        }

        .ner-token {
          border: 1px solid var(--border-light);
          border-radius: 999px;
          color: var(--text-muted);
          padding: 0.12rem 0.35rem;
          font-size: 0.62rem;
        }

        .log-paragraph {
          border-left: 2px solid rgba(20, 184, 166, 0.4);
          padding-left: 0.55rem;
        }

        .log-paragraph .label {
          display: block;
          color: var(--text-muted);
          font-size: 0.64rem;
          margin-bottom: 0.15rem;
        }

        .log-paragraph .text {
          color: var(--text-secondary);
        }

        /* Manuscript Explorer Section */
        .manuscript-explorer-section {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1.2rem;
          margin-bottom: 1.2rem;
        }

        .explorer-title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .add-chapter-form {
          display: flex;
          gap: 0.4rem;
        }

        .add-chapter-form input {
          flex: 1;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          padding: 0.4rem 0.6rem;
          color: var(--text-primary);
          font-size: 0.75rem;
          outline: none;
        }

        .add-chapter-form button {
          background: linear-gradient(135deg, #14b8a6 0%, #2563eb 100%);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }

        .manuscripts-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          max-height: 180px;
          overflow-y: auto;
        }

        .explorer-actions-row {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .explorer-actions-row .add-chapter-form {
          flex: 1;
          margin-bottom: 0;
        }

        .btn-create-folder-root {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          color: #9ca3af;
          font-size: 0.9rem;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-create-folder-root:hover {
          background: rgba(20, 184, 166, 0.15);
          border-color: rgba(20, 184, 166, 0.3);
          color: #2dd4bf;
        }

        .folder-node {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.25rem;
        }

        .folder-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          user-select: none;
        }

        .folder-header:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .folder-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .folder-icon {
          font-size: 1rem;
        }

        .folder-name-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #e5e7eb;
        }

        .folder-actions {
          display: flex;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .folder-header:hover .folder-actions {
          opacity: 1;
        }

        .folder-children {
          border-left: 1px dashed rgba(255, 255, 255, 0.08);
          margin-left: 0.5rem;
          padding-left: 0.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-top: 0.25rem;
        }

        .add-subfolder-row {
          padding: 0.2rem 0;
        }

        .add-subfolder-row input {
          width: 100%;
          font-size: 0.8rem;
          padding: 0.25rem;
        }

        .root-folder-input {
          margin-bottom: 0.5rem;
        }

        .trash-section-sidebar {
          margin-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 0.75rem;
        }

        .btn-trash-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.4rem;
          border-radius: 6px;
          transition: all 0.2s;
          text-align: left;
        }

        .btn-trash-trigger:hover, .btn-trash-trigger.active {
          color: #f87171;
          background: rgba(239, 68, 68, 0.06);
        }

        .trash-items-list {
          margin-top: 0.5rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .empty-trash-msg {
          font-size: 0.75rem;
          color: #6b7280;
          text-align: center;
          margin: 0.25rem 0;
        }

        .btn-empty-trash-all {
          width: 100%;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          padding: 0.3rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 0.25rem;
        }

        .btn-empty-trash-all:hover {
          background: #ef4444;
          color: white;
        }

        .trash-scroller {
          max-height: 120px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .trash-item-card {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 4px;
          padding: 0.4rem;
        }

        .trash-item-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.25rem;
        }

        .trash-item-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #d1d5db;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90px;
        }

        .trash-item-remaining {
          font-size: 0.65rem;
          color: #9ca3af;
        }

        .trash-item-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.4rem;
        }

        .btn-trash-restore, .btn-trash-delete {
          background: none;
          border: none;
          font-size: 0.65rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .btn-trash-restore {
          color: #14b8a6;
        }

        .btn-trash-restore:hover {
          text-decoration: underline;
        }

        .btn-trash-delete {
          color: #f87171;
        }

        .btn-trash-delete:hover {
          text-decoration: underline;
        }

        .chapter-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid transparent;
          border-radius: 6px;
          padding: 0.5rem 0.7rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chapter-list-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .chapter-list-item.active {
          background: rgba(20, 184, 166, 0.08);
          border-color: rgba(20, 184, 166, 0.24);
        }

        .chapter-item-details {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          overflow: hidden;
          flex: 1;
        }

        .chapter-title-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chapter-list-item.active .chapter-title-text {
          color: var(--text-primary);
          font-weight: 600;
        }

        .rename-input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--color-andamento);
          border-radius: 4px;
          color: var(--text-primary);
          font-size: 0.8rem;
          padding: 0.2rem 0.4rem;
          outline: none;
          width: 150px;
        }

        .chapter-badges {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .status-badge-tag {
          font-size: 0.55rem;
          font-weight: bold;
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          text-transform: uppercase;
        }

        .status-badge-tag.rascunho {
          background: rgba(249, 115, 22, 0.15);
          color: rgb(249, 115, 22);
        }

        .status-badge-tag.revisao {
          background: rgba(59, 130, 246, 0.15);
          color: rgb(59, 130, 246);
        }

        .status-badge-tag.finalizado {
          background: rgba(16, 185, 129, 0.15);
          color: rgb(16, 185, 129);
        }

        .lock-badge-icon {
          font-size: 0.65rem;
        }

        .chapter-actions {
          display: flex;
          gap: 0.3rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .chapter-list-item:hover .chapter-actions {
          opacity: 1;
        }

        .action-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0.1rem;
        }

        .action-btn:hover {
          color: var(--text-primary);
        }

        .action-btn.delete:hover {
          color: var(--color-inconsistente);
        }

        /* Document Header Controls */
        .editor-document-header-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 1.2rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          margin-bottom: 1.2rem;
        }

        .document-info h3 {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .last-saved {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .document-actions-controls {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .status-selector-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .status-selector-group select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          color: var(--text-primary);
          padding: 0.3rem 0.5rem;
          outline: none;
          cursor: pointer;
        }

        .btn-lock-toggle {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          border-radius: 6px;
          padding: 0.3rem 0.6rem;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-lock-toggle.locked {
          border-color: rgba(16, 185, 129, 0.3);
          color: var(--color-concluido);
          background: rgba(16, 185, 129, 0.04);
        }

        .btn-lock-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Locked Banner */
        .locked-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(220, 38, 38, 0.08);
          border: 1px solid rgba(220, 38, 38, 0.3);
          color: rgb(248, 113, 113);
          padding: 0.6rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          margin-bottom: 1.2rem;
          animation: slideDown 0.3s;
        }

        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .btn-banner-unlock {
          background: rgb(220, 38, 38);
          border: none;
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        /* Streak stats styling */
        .streak-stats-card {
          padding: 1rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .streak-stats-header {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .streak-icon {
          font-size: 2.2rem;
          filter: drop-shadow(0 2px 8px rgba(239, 68, 68, 0.4));
          animation: flamePulse 1.2s infinite ease-in-out alternate;
        }

        .streak-icon.golden {
          filter: drop-shadow(0 2px 10px rgba(245, 158, 11, 0.6));
        }

        .streak-icon.deep-red {
          filter: drop-shadow(0 2px 12px rgba(220, 38, 38, 0.8));
        }

        @keyframes flamePulse {
          0% { transform: scale(0.95) rotate(-3deg); }
          100% { transform: scale(1.05) rotate(3deg); }
        }

        .streak-count {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .streak-record {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .btn-configure-goals {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          padding: 0.4rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .btn-configure-goals:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .scientific-basis-card,
        .next-step-card {
          border: 1px solid rgba(20, 184, 166, 0.18);
          background: rgba(10, 40, 38, 0.22);
          border-radius: 8px;
          padding: 0.85rem;
          margin-bottom: 0.9rem;
        }

        .basis-card-header {
          display: flex;
          justify-content: space-between;
          gap: 0.8rem;
          align-items: center;
          margin-bottom: 0.7rem;
        }

        .basis-card-header strong,
        .next-step-card strong {
          color: var(--text-primary);
          font-size: 0.86rem;
          line-height: 1.25;
        }

        .basis-kicker {
          color: var(--color-andamento);
          font-size: 0.66rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .basis-method-list {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .basis-method-row {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 0.55rem;
        }

        .basis-method-row span {
          color: var(--text-primary);
          font-size: 0.76rem;
          font-weight: 700;
        }

        .basis-method-row p,
        .next-step-card p {
          color: var(--text-muted);
          font-size: 0.72rem;
          line-height: 1.45;
          margin-top: 0.2rem;
        }

        .next-step-card {
          border-color: rgba(234, 179, 8, 0.24);
          background: rgba(72, 54, 10, 0.2);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        /* Footer Progress bar styling */
        .editor-progress-footer {
          margin-top: 1.5rem;
          padding: 1rem;
          border-radius: 8px;
          background: rgba(18, 22, 27, 0.78);
          border: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .progress-title {
          color: var(--text-secondary);
        }

        .progress-percentage {
          color: var(--color-andamento);
        }

        .progress-track {
          background: rgba(255, 255, 255, 0.08);
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-andamento) 0%, #3b82f6 100%);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-fill.completed {
          background: linear-gradient(90deg, var(--color-concluido) 0%, #059669 100%);
        }

        .session-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        /* Celebration popup styling */
        .celebration-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s;
        }

        .celebration-card {
          padding: 2.5rem;
          border-radius: 16px;
          border: 1px solid rgba(16, 185, 129, 0.4);
          background: rgba(10, 20, 15, 0.95);
          text-align: center;
          max-width: 400px;
          animation: popUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.25);
        }

        .celebration-emoji {
          font-size: 3.5rem;
          display: inline-block;
          animation: wobble 1s infinite alternate;
        }

        @keyframes wobble {
          0% { transform: rotate(-8deg); }
          100% { transform: rotate(8deg); }
        }

        .celebration-card h3 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--color-concluido);
          margin-top: 1rem;
        }

        .celebration-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 0.5rem;
        }

        /* Settings modal styling */
        .settings-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
        }

        .settings-modal-content {
          width: 460px;
          background: rgba(15, 15, 23, 0.95);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }

        .settings-modal-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 1.5rem;
          gap: 1rem;
        }

        .settings-tab-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 600;
          padding-bottom: 0.6rem;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .settings-tab-btn.active {
          color: var(--color-andamento);
          border-bottom-color: var(--color-andamento);
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .form-group select, .form-group input[type="number"], .form-group input[type="date"] {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          padding: 0.6rem;
          color: var(--text-primary);
          outline: none;
        }

        .off-days-checkboxes {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.6rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          padding: 0.8rem;
          border-radius: 6px;
        }

        .off-day-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .off-day-label input {
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .btn-cancel {
          background: transparent;
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
        }

        .btn-save {
          background: linear-gradient(135deg, #14b8a6 0%, #2563eb 100%);
          border: none;
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Shortcuts Panel CSS */
        .shortcuts-settings-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .shortcuts-info {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .shortcuts-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin: 0.5rem 0;
        }

        .shortcut-setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          padding: 0.6rem 1rem;
          border-radius: 8px;
        }

        .shortcut-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .btn-capture-shortcut {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-light);
          color: var(--color-andamento);
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-capture-shortcut.capturing {
          background: rgba(20, 184, 166, 0.1);
          border-color: var(--color-andamento);
          color: var(--color-andamento);
          animation: capturingPulse 1s infinite alternate;
        }

        @keyframes capturingPulse {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }

        .shortcut-error {
          font-size: 0.75rem;
          color: var(--color-inconsistente);
          margin-top: 0.2rem;
        }

        /* Focus mode and line focus CSS overrides */
        .focus-mode-active .navbar, 
        .focus-mode-active .editor-side-panel {
          display: none !important;
        }

        .focus-mode-active .editor-workspace {
          max-width: 800px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
          height: 100vh;
          overflow: hidden;
          background: #07070a;
        }

        .focus-mode-active .tiptap-editor-container {
          background: transparent;
          border: none;
          padding: 0;
        }

        .focus-mode-active .editor-progress-footer {
          margin-top: 2rem;
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.05);
        }

        .floating-btn-exit-focus {
          position: fixed;
          top: 1.5rem;
          right: 2rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          z-index: 100;
          transition: all 0.2s;
        }

        .floating-btn-exit-focus:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        /* Line focus mode implementation */
        .line-focus-mode .tiptap-editor-content p {
          opacity: 0.18;
          transition: opacity 0.25s ease-in-out;
        }

        .line-focus-mode .tiptap-editor-content p:focus-within {
          opacity: 1;
        }

        @keyframes popUp {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Panel tabs in right sidebar */
        .panel-tabs {
          display: flex;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .panel-tab-btn {
          flex: 1;
          padding: 0.5rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .panel-tab-btn:hover {
          color: var(--text-primary);
        }

        .panel-tab-btn.active {
          color: var(--color-andamento);
          border-bottom-color: var(--color-andamento);
        }

        /* Success Toast */
        .success-toast {
          position: fixed;
          bottom: 80px;
          right: 20px;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 1000;
          border: 1px solid rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.12) !important;
          color: #34d399;
          font-size: 0.875rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .toast-icon {
          font-weight: bold;
          font-size: 1rem;
          margin-right: 0.25rem;
        }

        /* Sync status badge in stats footer */
        .sync-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.775rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.02);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        .status-dot.synced {
          background-color: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        .status-dot.syncing {
          background-color: #3b82f6;
          box-shadow: 0 0 8px #3b82f6;
          animation: pulse 1s infinite alternate;
        }

        .status-dot.local {
          background-color: #f59e0b;
          box-shadow: 0 0 8px #f59e0b;
        }

        /* Snapshot and Versions styles */
        .btn-create-snapshot {
          width: 100%;
          padding: 0.6rem;
          background: rgba(20, 184, 166, 0.06);
          border: 1px dashed var(--border-active);
          border-radius: 8px;
          color: var(--color-andamento);
          font-weight: 600;
          font-size: 0.825rem;
          cursor: pointer;
          margin-bottom: 1rem;
          transition: all 0.2s;
        }

        .btn-create-snapshot:hover:not(:disabled) {
          background: rgba(20, 184, 166, 0.12);
          color: var(--text-primary);
        }

        .versions-container {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 0.2rem;
        }

        .version-card {
          padding: 0.8rem;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .version-card:hover {
          border-color: rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
        }

        .version-card-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.725rem;
        }

        .version-number {
          font-weight: 700;
          color: var(--color-andamento);
        }

        .version-time {
          color: var(--text-muted);
        }

        .version-excerpt {
          font-size: 0.775rem;
          color: var(--text-secondary);
          line-height: 1.4;
          font-style: italic;
        }

        .btn-view-version {
          padding: 0.4rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-view-version:hover {
          background: rgba(20, 184, 166, 0.08);
          border-color: var(--border-active);
          color: var(--color-andamento);
        }

        /* Version Preview Modal */
        .version-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
        }

        .version-modal-card {
          width: 100%;
          max-width: 680px;
          height: 80vh;
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .version-modal-header {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 0.8rem;
        }

        .version-modal-header h3 {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .version-modal-time {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .version-modal-body {
          flex: 1;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          padding: 1.2rem;
        }

        .version-content-preview {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .version-content-preview p {
          margin-bottom: 1rem;
        }

        .version-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          border-top: 1px solid var(--border-light);
          padding-top: 1rem;
        }

        .btn-modal-restore {
          padding: 0.65rem 1.25rem;
          background: linear-gradient(135deg, var(--color-andamento) 0%, #0d9488 100%);
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.25);
        }

        .btn-modal-restore:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(20, 184, 166, 0.35);
        }

        .btn-modal-close {
          padding: 0.65rem 1.25rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-modal-close:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </div>
  );
}
