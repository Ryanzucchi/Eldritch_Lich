import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  propagateStatus,
  computeWordDiff,
  searchInText,
  replaceAllInText,
  replaceMatchInText,
  exportManuscripts,
  htmlToMarkdown,
  markdownToHtml,
  htmlToPlainText,
  SearchMatch,
  DiffResult,
  ExportFormat,
  MANUSCRIPT_TEMPLATES,
  autoGenerateTitle,
  InlineComment,
  categorizeText,
  createAuditLog,
  SystemActivity
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
  const searchParams = useSearchParams();
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
    activeProject,
    selectProject
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

  // Search & Replace state (UC-022, UC-023, UC-024)
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [searchCaseSensitive, setSearchCaseSensitive] = useState(false);
  const [searchWholeWord, setSearchWholeWord] = useState(false);
  const [searchIsRegex, setSearchIsRegex] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Version Diff & Labeling state (UC-124, UC-125, UC-195, UC-196, UC-197)
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [diffVersion, setDiffVersion] = useState<{ id: string; manuscriptId: string; versionNumber: number; title: string; content: string; createdAt: string } | null>(null);
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [customVersionTag, setCustomVersionTag] = useState('');
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);

  // Import & Export state (UC-007, UC-008, UC-163, UC-194)
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportScope, setExportScope] = useState<'current' | 'all'>('current');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('docx');

  const [showImportModal, setShowImportModal] = useState(false);
  const [importMode, setImportMode] = useState<'new_chapter' | 'overwrite'>('new_chapter');

  // Google Docs / MS Word Styling & Formatting States (UC-063, UC-186, UC-187, UC-243, UC-244)
  const [fontFamily, setFontFamily] = useState<'georgia' | 'inter' | 'courier' | 'times' | 'arial'>('georgia');
  const [fontSize, setFontSize] = useState<number>(16);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [lineHeight, setLineHeight] = useState<'1.2' | '1.5' | '1.8' | '2.0'>('1.5');
  const [isReadOnly, setIsReadOnly] = useState(false); // UC-187

  // Hyperlink Modal States (UC-110, UC-111)
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Footnote / Note Modal States (UC-115, UC-393)
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  // Menu bar dropdown active state
  const [activeMenuDropdown, setActiveMenuDropdown] = useState<'file' | 'edit' | 'view' | 'insert' | 'format' | null>(null);

  // Link insertion handler (UC-110, UC-111)
  const handleExecuteInsertLink = () => {
    if (!editor || !linkUrl.trim()) return;
    const href = linkUrl.startsWith('http') || linkUrl.startsWith('#') ? linkUrl : `https://${linkUrl}`;
    const text = linkText.trim() || href;
    const linkHtml = `<a href="${href}" target="_blank" rel="noopener noreferrer" class="manuscript-link">${text}</a>`;
    editor.commands.insertContent(linkHtml);
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
    setSuccess('Link inserido com sucesso!');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Footnote insertion handler (UC-115, UC-393)
  const handleExecuteInsertNote = () => {
    if (!editor || !noteText.trim()) return;
    const noteHtml = `<span className="footnote-box" title="${noteText.replace(/"/g, '&quot;')}">📝 [Nota: ${noteText}]</span> `;
    editor.commands.insertContent(noteHtml);
    setShowNoteModal(false);
    setNoteText('');
    setSuccess('Nota de rodapé inserida com sucesso!');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Theme state (Google Docs Light / Dark mode - UC-159)
  const [docsTheme, setDocsTheme] = useState<'light' | 'dark'>('dark');

  // Audit Logs State (UC-061)
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState<SystemActivity[]>([]);

  // Drawing Canvas State (UC-062)
  const [showDrawingModal, setShowDrawingModal] = useState(false);

  // Pinned Manuscripts State (UC-128)
  const [pinnedManuscriptIds, setPinnedManuscriptIds] = useState<string[]>([]);

  // Load audit logs (UC-061)
  const loadAuditLogs = async () => {
    const logs = await db.auditLogs.toArray();
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setAuditLogs(logs);
  };

  const addAuditLog = async (type: SystemActivity['type'], description: string) => {
    const newLog = createAuditLog(type, description);
    await db.auditLogs.put(newLog);
    await loadAuditLogs();
  };

  // Custom UI Density & Accent Colors (UC-084, UC-085)
  const [uiDensity, setUiDensity] = useState<'compact' | 'standard' | 'comfortable'>('standard');
  const [accentColor, setAccentColor] = useState<'purple' | 'blue' | 'emerald' | 'amber' | 'rose'>('purple');

  // Archive Panel State (UC-127)
  const [showArchivedPanel, setShowArchivedPanel] = useState(false);

  // Resizable Editor Sidebars State
  const [leftPanelWidth, setLeftPanelWidth] = useState(300);
  const isResizingLeft = useRef(false);

  const handleLeftMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingLeft.current = true;
    document.addEventListener('mousemove', handleLeftMouseMove);
    document.addEventListener('mouseup', handleLeftMouseUp);
  };

  const handleLeftMouseMove = (e: MouseEvent) => {
    if (!isResizingLeft.current) return;
    const newWidth = Math.max(180, Math.min(480, e.clientX));
    setLeftPanelWidth(newWidth);
  };

  const handleLeftMouseUp = () => {
    isResizingLeft.current = false;
    document.removeEventListener('mousemove', handleLeftMouseMove);
    document.removeEventListener('mouseup', handleLeftMouseUp);
  };

  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const isResizingRight = useRef(false);

  const handleRightMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRight.current = true;
    document.addEventListener('mousemove', handleRightMouseMove);
    document.addEventListener('mouseup', handleRightMouseUp);
  };

  const handleRightMouseMove = (e: MouseEvent) => {
    if (!isResizingRight.current) return;
    const newWidth = Math.max(220, Math.min(520, window.innerWidth - e.clientX));
    setRightPanelWidth(newWidth);
  };

  const handleRightMouseUp = () => {
    isResizingRight.current = false;
    document.removeEventListener('mousemove', handleRightMouseMove);
    document.removeEventListener('mouseup', handleRightMouseUp);
  };

  useEffect(() => {
    loadAuditLogs();
    const storedPins = localStorage.getItem('pinnedManuscripts');
    if (storedPins) {
      try { setPinnedManuscriptIds(JSON.parse(storedPins)); } catch (e) {}
    }
    const storedDensity = localStorage.getItem('uiDensity') as any;
    if (storedDensity) setUiDensity(storedDensity);
    const storedAccent = localStorage.getItem('accentColor') as any;
    if (storedAccent) setAccentColor(storedAccent);
  }, []);

  // Archive Manuscript Handler (UC-127)
  const handleArchiveManuscript = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const manuscript = await db.manuscripts.get(id);
    if (!manuscript) return;
    const isArchiving = !manuscript.isArchived;
    await db.manuscripts.update(id, { isArchived: isArchiving, updatedAt: new Date().toISOString() });
    await loadManuscripts();
    addAuditLog('autosave', `Capítulo "${manuscript.title}" ${isArchiving ? 'arquivado' : 'desarquivado'}`);
    setSuccess(`Capítulo ${isArchiving ? 'arquivado' : 'desarquivado'} com sucesso (UC-127)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Auto Categorize Active Manuscript Handler (UC-042)
  const handleAutoCategorizeActiveManuscript = async () => {
    if (!activeManuscript || !editor) return;
    const result = categorizeText(editor.getHTML());
    await db.manuscripts.update(activeManuscript.id, {
      category: result.primaryCategory,
      tags: result.tags,
      updatedAt: new Date().toISOString()
    });
    await loadManuscripts();
    setActiveManuscript(prev => prev ? { ...prev, category: result.primaryCategory, tags: result.tags } : null);
    addAuditLog('autotitle', `Categorização automática aplicada: ${result.primaryCategory}`);
    setSuccess(`Categorizado como "${result.primaryCategory}" com tags [${result.tags.join(', ')}] (UC-042)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Toggle Pin Manuscript (UC-128)
  const handleTogglePinManuscript = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (pinnedManuscriptIds.includes(id)) {
      updated = pinnedManuscriptIds.filter(item => item !== id);
      addAuditLog('pin_toggle', `Capítulo desafixado do topo`);
    } else {
      updated = [...pinnedManuscriptIds, id];
      addAuditLog('pin_toggle', `Capítulo fixado no topo do explorer`);
    }
    setPinnedManuscriptIds(updated);
    localStorage.setItem('pinnedManuscripts', JSON.stringify(updated));
  };

  // Insert Drawing Canvas Image (UC-062)
  const handleInsertDrawingToEditor = (dataUrl: string) => {
    if (!editor || !dataUrl) return;
    const imgHtml = `<img src="${dataUrl}" alt="Desenho/Rascunho" class="manuscript-drawing-img" style="max-width: 100%; border-radius: 8px; margin: 1rem 0;" />`;
    editor.commands.insertContent(imgHtml);
    setShowDrawingModal(false);
    setSuccess('Desenho/Rascunho inserido no manuscrito (UC-062)!');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Inline Comments State (UC-114)
  const [comments, setComments] = useState<InlineComment[]>([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedTextForComment, setSelectedTextForComment] = useState('');

  // Chapter Templates State (UC-137, UC-138)
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Load comments for active manuscript (UC-114)
  const loadComments = async (manuscriptId: string) => {
    if (!manuscriptId) return;
    const list = await db.comments.filter(c => c.manuscriptId === manuscriptId).toArray();
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setComments(list);
  };

  useEffect(() => {
    if (activeManuscript) {
      loadComments(activeManuscript.id);
    }
  }, [activeManuscript?.id]);

  // Add Comment (UC-114)
  const handleOpenAddComment = () => {
    if (!editor) return;
    const selection = editor.state.selection;
    const selected = editor.state.doc.textBetween(selection.from, selection.to, ' ');
    setSelectedTextForComment(selected || 'Trecho Selecionado');
    setShowCommentModal(true);
  };

  const handleSaveComment = async () => {
    if (!activeManuscript || !newCommentText.trim()) return;

    const userEmail = localStorage.getItem('userEmail') || 'Autor';
    const newComment: InlineComment = {
      id: crypto.randomUUID(),
      manuscriptId: activeManuscript.id,
      authorName: userEmail.split('@')[0],
      createdAt: new Date().toISOString(),
      selectedText: selectedTextForComment,
      commentText: newCommentText.trim(),
      isResolved: false,
      replies: []
    };

    await db.comments.put(newComment);
    await loadComments(activeManuscript.id);
    setShowCommentModal(false);
    setNewCommentText('');
    setSuccess('Comentário adicionado na margem do documento!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleResolveComment = async (commentId: string) => {
    await db.comments.update(commentId, { isResolved: true });
    if (activeManuscript) loadComments(activeManuscript.id);
  };

  // Duplicate Chapter (UC-006)
  const handleDuplicateManuscript = async (target: Manuscript) => {
    const isBrowser = typeof window !== 'undefined';
    const activeProjectId = isBrowser ? localStorage.getItem('activeProjectId') || 'default' : 'default';

    const duplicateDoc: Manuscript = {
      id: 'chapter_' + Date.now(),
      title: `${target.title} (Cópia)`,
      content: target.content,
      status: 'RASCUNHO',
      isLocked: false,
      projectId: activeProjectId,
      folderId: target.folderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.manuscripts.put(duplicateDoc);
    await loadManuscripts();
    setActiveManuscript(duplicateDoc);
    editor?.commands.setContent(duplicateDoc.content);
    setSuccess(`Capítulo "${target.title}" duplicado com sucesso!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Smart Split Chapter at Cursor (UC-009)
  const handleSplitManuscriptAtCursor = async () => {
    if (!editor || !activeManuscript) return;

    const html = editor.getHTML();
    const paragraphs = html.split('</p>');
    if (paragraphs.length <= 1) {
      alert('O manuscrito precisa ter pelo menos dois parágrafos para ser dividido.');
      return;
    }

    const midIndex = Math.floor(paragraphs.length / 2);
    const firstHalf = paragraphs.slice(0, midIndex).join('</p>') + '</p>';
    const secondHalf = paragraphs.slice(midIndex).join('</p>');

    // Update active manuscript with first half
    const updatedActive = { ...activeManuscript, content: firstHalf, updatedAt: new Date().toISOString() };
    await db.manuscripts.put(updatedActive);
    setActiveManuscript(updatedActive);
    editor.commands.setContent(firstHalf);

    // Create second half manuscript
    const isBrowser = typeof window !== 'undefined';
    const activeProjectId = isBrowser ? localStorage.getItem('activeProjectId') || 'default' : 'default';
    const secondManuscript: Manuscript = {
      id: 'chapter_' + Date.now(),
      title: `${activeManuscript.title} - Parte 2`,
      content: secondHalf,
      status: 'RASCUNHO',
      isLocked: false,
      projectId: activeProjectId,
      folderId: activeManuscript.folderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.manuscripts.put(secondManuscript);
    await loadManuscripts();
    setSuccess(`Capítulo dividido em duas partes com sucesso (UC-009)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Auto-generate Chapter Title (UC-041)
  const handleAutoTitleManuscript = async () => {
    if (!editor || !activeManuscript) return;
    const contentHtml = editor.getHTML();
    const suggestedTitle = autoGenerateTitle(contentHtml);

    const updated = { ...activeManuscript, title: suggestedTitle, updatedAt: new Date().toISOString() };
    await db.manuscripts.put(updated);
    setActiveManuscript(updated);
    await loadManuscripts();
    setSuccess(`Título "${suggestedTitle}" gerado automaticamente (UC-041)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Apply Manuscript Template (UC-137, UC-138)
  const handleApplyTemplate = async (templateHtml: string, titlePlaceholder: string) => {
    const isBrowser = typeof window !== 'undefined';
    const activeProjectId = isBrowser ? localStorage.getItem('activeProjectId') || 'default' : 'default';

    const newTemplateDoc: Manuscript = {
      id: 'chapter_' + Date.now(),
      title: titlePlaceholder,
      content: templateHtml,
      status: 'RASCUNHO',
      isLocked: false,
      projectId: activeProjectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.manuscripts.put(newTemplateDoc);
    await loadManuscripts();
    setActiveManuscript(newTemplateDoc);
    editor?.commands.setContent(templateHtml);
    setShowTemplateModal(false);
    setSuccess(`Novo capítulo criado com o modelo selecionado (UC-137/138)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Search execution handler
  const handleExecuteSearch = (queryStr: string = searchQuery) => {
    if (!editor || !queryStr.trim()) {
      setSearchResults([]);
      setCurrentMatchIndex(0);
      return;
    }
    const htmlContent = editor.getHTML();
    const matches = searchInText(htmlContent, queryStr, {
      caseSensitive: searchCaseSensitive,
      wholeWord: searchWholeWord,
      isRegex: searchIsRegex
    });
    setSearchResults(matches);
    setCurrentMatchIndex(0);
  };

  const handleNextMatch = () => {
    if (searchResults.length === 0) return;
    setCurrentMatchIndex((prev) => (prev + 1) % searchResults.length);
  };

  const handlePrevMatch = () => {
    if (searchResults.length === 0) return;
    setCurrentMatchIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
  };

  const handleReplaceSingleMatch = () => {
    if (!editor || searchResults.length === 0) return;
    const targetMatch = searchResults[currentMatchIndex];
    const htmlContent = editor.getHTML();
    const updatedHtml = replaceMatchInText(htmlContent, targetMatch, replaceQuery);
    editor.commands.setContent(updatedHtml);
    if (activeManuscript) {
      const updated = { ...activeManuscript, content: updatedHtml, updatedAt: new Date().toISOString() };
      setActiveManuscript(updated);
      db.manuscripts.put(updated);
    }
    handleExecuteSearch();
  };

  const handleReplaceAllMatches = () => {
    if (!editor || !searchQuery) return;
    const htmlContent = editor.getHTML();
    const { updatedText, replacementCount } = replaceAllInText(htmlContent, searchQuery, replaceQuery, {
      caseSensitive: searchCaseSensitive,
      wholeWord: searchWholeWord,
      isRegex: searchIsRegex
    });
    if (replacementCount > 0) {
      editor.commands.setContent(updatedText);
      if (activeManuscript) {
        const updated = { ...activeManuscript, content: updatedText, updatedAt: new Date().toISOString() };
        setActiveManuscript(updated);
        db.manuscripts.put(updated);
      }
      setSuccess(`${replacementCount} ocorrências substituídas com sucesso.`);
      setTimeout(() => setSuccess(null), 3000);
      handleExecuteSearch();
    }
  };

  // Open Version Diff Modal
  const handleCompareVersionDiff = (ver: typeof versions[0]) => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    const result = computeWordDiff(ver.content, currentHtml);
    setDiffVersion(ver);
    setDiffResult(result);
    setShowDiffModal(true);
  };

  // Create Custom Labeled Snapshot
  const handleCreateLabeledSnapshot = async () => {
    if (!activeManuscript) return;
    const currentHtml = editor?.getHTML() || '';
    const label = customVersionTag.trim() || activeManuscript.title;
    
    const list = await db.manuscriptVersions
      .filter(v => v.manuscriptId === activeManuscript.id)
      .toArray();
    const nextVerNumber = list.length > 0 ? Math.max(...list.map(v => v.versionNumber)) + 1 : 1;

    const newVersion = {
      id: crypto.randomUUID(),
      manuscriptId: activeManuscript.id,
      versionNumber: nextVerNumber,
      title: label,
      content: currentHtml,
      createdAt: new Date().toISOString()
    };

    await db.manuscriptVersions.put(newVersion);
    await loadVersions(activeManuscript.id);
    setSuccess(`Ponto de restauração "${label}" criado com sucesso!`);
    setTimeout(() => setSuccess(null), 3000);
    setCustomVersionTag('');
    setShowCustomTagInput(false);
  };

  // Export manuscript handler
  const handleExecuteExport = () => {
    const targets = exportScope === 'all' 
      ? manuscripts.filter(m => !m.inTrash) 
      : activeManuscript ? [activeManuscript] : [];
    if (targets.length === 0) return;

    const projName = activeProject?.name || 'Livro';
    const result = exportManuscripts(targets, exportFormat, projName);

    if (exportFormat === 'pdf') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(result.content as string);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
      }
    } else {
      const blob = new Blob([result.content], { type: result.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    setShowExportModal(false);
    setSuccess(`Manuscrito exportado como ${exportFormat.toUpperCase()} com sucesso!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Import file handler
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.replace(/\.[^/.]+$/, '');
    const extension = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target?.result as string;
      let html = '';

      if (extension === 'md' || extension === 'markdown') {
        html = markdownToHtml(text);
      } else if (extension === 'html' || extension === 'htm' || extension === 'docx') {
        html = text.includes('<p>') ? text : `<p>${text.replace(/\n/g, '<br>')}</p>`;
      } else {
        html = `<p>${text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
      }

      if (importMode === 'overwrite' && activeManuscript) {
        const updated = { ...activeManuscript, content: html, updatedAt: new Date().toISOString() };
        setActiveManuscript(updated);
        await db.manuscripts.put(updated);
        editor?.commands.setContent(html);
        setSuccess(`Conteúdo de "${file.name}" importado para o capítulo atual.`);
      } else {
        const isBrowser = typeof window !== 'undefined';
        const activeProjectId = isBrowser ? localStorage.getItem('activeProjectId') || 'default' : 'default';
        const newDoc: Manuscript = {
          id: crypto.randomUUID(),
          title: fileName || 'Capítulo Importado',
          content: html,
          status: 'RASCUNHO',
          isLocked: false,
          projectId: activeProjectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await db.manuscripts.put(newDoc);
        await loadManuscripts();
        setActiveManuscript(newDoc);
        editor?.commands.setContent(html);
        setSuccess(`Novo capítulo "${fileName}" criado a partir do arquivo importado.`);
      }
      setTimeout(() => setSuccess(null), 3500);
      setShowImportModal(false);
    };

    reader.readAsText(file);
  };

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
      
      const targetId = searchParams?.get('chapterId');
      if (targetId) {
        const found = activeList.find(m => m.id === targetId);
        if (found) {
          setActiveManuscript(found);
          return;
        }
      }
      
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

  // Add new chapter directly (from Menu)
  const handleCreateNewChapterDirect = async (title?: string) => {
    const isBrowser = typeof window !== 'undefined';
    const activeProjectId = isBrowser ? localStorage.getItem('activeProjectId') || 'default' : 'default';
    const count = manuscripts.filter(m => !m.inTrash).length + 1;
    const newChapter: Manuscript = {
      id: 'chapter_' + Date.now(),
      title: title || `Capítulo ${count}`,
      content: '<p>Comece a escrever aqui...</p>',
      status: 'RASCUNHO',
      isLocked: false,
      projectId: activeProjectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await db.manuscripts.put(newChapter);
    await loadManuscripts();
    setActiveManuscript(newChapter);
    editor?.commands.setContent(newChapter.content);
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
  const handleDeleteChapter = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
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
            onClick={(e) => handleTogglePinManuscript(chapter.id, e)} 
            title={pinnedManuscriptIds.includes(chapter.id) ? "Desafixar do Topo" : "Fixar no Topo (UC-128)"}
            className={`action-btn ${pinnedManuscriptIds.includes(chapter.id) ? 'active-pin' : ''}`}
          >
            📌
          </button>
          <button 
            onClick={(e) => handleArchiveManuscript(chapter.id, e)} 
            title={chapter.isArchived ? "Desarquivar (UC-127)" : "Arquivar (UC-127)"}
            className="action-btn"
          >
            📦
          </button>
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

  // Save renamed chapter title
  const handleSaveRename = async (id: string) => {
    if (!editingChapterTitle.trim()) {
      setEditingChapterId(null);
      return;
    }
    const newTitle = editingChapterTitle.trim();
    await db.manuscripts.update(id, {
      title: newTitle,
      updatedAt: new Date().toISOString()
    });
    setEditingChapterId(null);
    if (activeManuscript?.id === id) {
      setActiveManuscript(prev => prev ? { ...prev, title: newTitle } : null);
    }
    await loadManuscripts();
    setSuccess('Título do capítulo atualizado!');
    setTimeout(() => setSuccess(null), 2000);
  };

  // Save renamed project name
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [editingProjectName, setEditingProjectName] = useState('');

  const handleSaveProjectName = async () => {
    if (!activeProject || !editingProjectName.trim()) {
      setIsEditingProjectName(false);
      return;
    }
    const newName = editingProjectName.trim();
    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: activeProject.id, name: newName })
      });
      if (res.ok) {
        selectProject({ ...activeProject, name: newName });
        setSuccess('Nome do projeto atualizado!');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (e) {
      console.error(e);
    }
    setIsEditingProjectName(false);
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
    <div className={`main-content animate-fade-in density-${uiDensity} accent-${accentColor} ${isFocusMode ? 'focus-mode-active' : ''} ${isLineFocus ? 'line-focus-mode' : ''}`}>
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
          <aside 
            className="editor-side-panel left-panel glass"
            style={{ width: leftPanelWidth, minWidth: leftPanelWidth, maxWidth: leftPanelWidth }}
          >
            <div 
              className="sidebar-resizer-handle right-border"
              onMouseDown={handleLeftMouseDown}
              title="Clique e arraste a borda para redimensionar o painel de capítulos"
            />
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
              <div className="explorer-title-row">
                <h3 className="explorer-title">Capítulos</h3>
                <button 
                  type="button" 
                  onClick={() => setIsLeftSidebarOpen(false)}
                  className="btn-collapse-panel-header"
                  title="Recolher Painel Explorer"
                >
                  ◀
                </button>
              </div>
              
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
                {/* Render Pinned Manuscripts (UC-128) */}
                {pinnedManuscriptIds.length > 0 && (
                  <div className="pinned-manuscripts-group">
                    <span className="pinned-group-label">📌 Fixados no Topo</span>
                    {manuscripts
                      .filter(m => pinnedManuscriptIds.includes(m.id) && !m.inTrash)
                      .map(m => renderManuscriptNode(m, 0))}
                    <div className="pinned-group-divider" />
                  </div>
                )}

                {/* Render folders at root */}
                {folders.filter(f => !f.parentFolderId).map(f => renderFolderNode(f, 0))}
                
                {/* Render chapters at root */}
                {manuscripts.filter(m => !m.folderId && !m.inTrash && !m.isArchived).map(m => renderManuscriptNode(m, 0))}
              </div>

              {/* Arquivados Area Trigger & List (UC-127) */}
              <div className="trash-section-sidebar" style={{ marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className={`btn-trash-trigger ${showArchivedPanel ? 'active' : ''}`}
                  onClick={() => setShowArchivedPanel(!showArchivedPanel)}
                >
                  <span>📦 Arquivados ({manuscripts.filter(m => m.isArchived && !m.inTrash).length})</span>
                </button>

                {showArchivedPanel && (
                  <div className="trash-items-list animate-fade-in">
                    {manuscripts.filter(m => m.isArchived && !m.inTrash).length === 0 ? (
                      <p className="empty-trash-msg">Nenhum texto arquivado</p>
                    ) : (
                      <div className="trash-scroller">
                        {manuscripts.filter(m => m.isArchived && !m.inTrash).map(item => (
                          <div key={item.id} className="trash-item-card">
                            <div className="trash-item-info">
                              <span className="trash-item-title" title={item.title}>{item.title}</span>
                            </div>
                            <button 
                              type="button" 
                              className="btn-restore-trash"
                              onClick={(e) => handleArchiveManuscript(item.id, e)}
                            >
                              Desarquivar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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

          {/* Google Docs & Word Style Menu & Ribbon Header */}
          {!isFocusMode && activeManuscript && (
            <div className="google-docs-header-ribbon glass">
              {/* Row 1: Document Title & Main Dropdown Menus */}
              <div className="docs-top-bar">
                <div className="docs-brand-doc">
                  <Link href="/projects" className="docs-home-icon-btn" title="Ir para a Tela Inicial de Projetos (Estilo Google Docs Hub)">
                    📄
                  </Link>
                  <div className="docs-doc-meta">
                    <div className="docs-doc-title-row">
                      {isEditingProjectName ? (
                        <input
                          type="text"
                          value={editingProjectName}
                          onChange={(e) => setEditingProjectName(e.target.value)}
                          onBlur={handleSaveProjectName}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveProjectName(); }}
                          className="docs-doc-title-input mini"
                          autoFocus
                        />
                      ) : (
                        <span 
                          className="docs-project-name-badge"
                          onClick={() => {
                            setIsEditingProjectName(true);
                            setEditingProjectName(activeProject?.name || 'Meu Projeto');
                          }}
                          title="Clique para renomear o projeto"
                        >
                          📁 {activeProject ? activeProject.name : 'Meu Projeto'} ✎
                        </span>
                      )}
                      <span className="docs-title-separator">/</span>

                      {editingChapterId === activeManuscript.id ? (
                        <input
                          type="text"
                          value={editingChapterTitle}
                          onChange={(e) => setEditingChapterTitle(e.target.value)}
                          onBlur={() => handleSaveRename(activeManuscript.id)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveRename(activeManuscript.id); }}
                          className="docs-doc-title-input"
                          autoFocus
                        />
                      ) : (
                        <h2 
                          className="docs-doc-title" 
                          onClick={(e) => startRenameChapter(activeManuscript, e)}
                          title="Clique para renomear este capítulo"
                        >
                          {activeManuscript.title} ✎
                        </h2>
                      )}
                      <span className={`status-badge-mini ${activeManuscript.status.toLowerCase()}`}>
                        {activeManuscript.status}
                      </span>
                    </div>

                    {/* Google Docs Style Menu Bar */}
                    <div className="docs-menu-bar">
                      <div className="menu-item-group">
                        <button onClick={() => setActiveMenuDropdown(activeMenuDropdown === 'file' ? null : 'file')} className="menu-btn">Arquivo</button>
                        {activeMenuDropdown === 'file' && (
                          <div className="dropdown-menu-list animate-fade-in">
                            <button onClick={() => { handleCreateNewChapterDirect(); setActiveMenuDropdown(null); }}>📄 Novo Capítulo em Branco</button>
                            <button onClick={() => { setShowTemplateModal(true); setActiveMenuDropdown(null); }}>📑 Novo a partir de Modelo/Template (UC-137)</button>
                            <button onClick={() => { handleDuplicateManuscript(activeManuscript); setActiveMenuDropdown(null); }}>📋 Duplicar Capítulo (UC-006)</button>
                            <button onClick={() => { handleSplitManuscriptAtCursor(); setActiveMenuDropdown(null); }}>✂️ Dividir Capítulo no Cursor (UC-009)</button>
                            <button onClick={() => { handleAutoTitleManuscript(); setActiveMenuDropdown(null); }}>✨ Gerar Título Automático com IA (UC-041)</button>
                            <hr />
                            <button onClick={() => { setShowImportModal(true); setActiveMenuDropdown(null); }}>📥 Importar Arquivo...</button>
                            <button onClick={() => { setShowExportModal(true); setActiveMenuDropdown(null); }}>📤 Exportar Manuscrito...</button>
                            <hr />
                            <button onClick={() => { setShowCustomTagInput(true); setRightTab('versions'); setActiveMenuDropdown(null); }}>🏷️ Criar Snapshot Rotulado</button>
                            <button onClick={() => { handleDeleteChapter(activeManuscript.id); setActiveMenuDropdown(null); }} className="danger">🗑️ Mover para Lixeira</button>
                          </div>
                        )}
                      </div>

                      <div className="menu-item-group">
                        <button onClick={() => setActiveMenuDropdown(activeMenuDropdown === 'edit' ? null : 'edit')} className="menu-btn">Editar</button>
                        {activeMenuDropdown === 'edit' && (
                          <div className="dropdown-menu-list animate-fade-in">
                            <button onClick={() => { editor?.commands.undo(); setActiveMenuDropdown(null); }}>↩️ Desfazer (Ctrl+Z)</button>
                            <button onClick={() => { editor?.commands.redo(); setActiveMenuDropdown(null); }}>↪️ Refazer (Ctrl+Y)</button>
                            <hr />
                            <button onClick={() => { handleOpenAddComment(); setActiveMenuDropdown(null); }}>💬 Adicionar Comentário (UC-114)</button>
                            <button onClick={() => { setShowSearchModal(true); setActiveMenuDropdown(null); }}>🔍 Buscar e Substituir (Ctrl+F)</button>
                          </div>
                        )}
                      </div>

                      <div className="menu-item-group">
                        <button onClick={() => setActiveMenuDropdown(activeMenuDropdown === 'view' ? null : 'view')} className="menu-btn">Exibir</button>
                        {activeMenuDropdown === 'view' && (
                          <div className="dropdown-menu-list animate-fade-in">
                            <button onClick={() => { setDocsTheme(docsTheme === 'dark' ? 'light' : 'dark'); setActiveMenuDropdown(null); }}>
                              {docsTheme === 'dark' ? '☀️ Alternar para Tema Claro (Google Docs)' : '🌙 Alternar para Tema Escuro (Google Docs)'} (UC-159)
                            </button>
                            <button onClick={() => { setIsReadOnly(!isReadOnly); setActiveMenuDropdown(null); }}>
                              {isReadOnly ? '✏️ Ativar Modo Edição' : '📖 Modo Leitura Apenas (UC-187)'}
                            </button>
                            <button onClick={() => { setShowAuditModal(true); setActiveMenuDropdown(null); }}>📋 Histórico de Atividades do Sistema (UC-061)</button>
                            <button onClick={() => { triggerCommand('toggle_focus'); setActiveMenuDropdown(null); }}>🧘 Modo Foco (Ctrl+Shift+F)</button>
                            <button onClick={() => { setIsLeftSidebarOpen(!isLeftSidebarOpen); setActiveMenuDropdown(null); }}>📁 Alternar Explorer</button>
                            <button onClick={() => { setIsRightSidebarOpen(!isRightSidebarOpen); setActiveMenuDropdown(null); }}>📊 Alternar IA / Versões</button>
                          </div>
                        )}
                      </div>

                      <div className="menu-item-group">
                        <button onClick={() => setActiveMenuDropdown(activeMenuDropdown === 'insert' ? null : 'insert')} className="menu-btn">Inserir</button>
                        {activeMenuDropdown === 'insert' && (
                          <div className="dropdown-menu-list animate-fade-in">
                            <button onClick={() => { handleOpenAddComment(); setActiveMenuDropdown(null); }}>💬 Comentário na Margem (UC-114)...</button>
                            <button onClick={() => { setShowDrawingModal(true); setActiveMenuDropdown(null); }}>🎨 Quadro de Desenho / Rascunho (UC-062)...</button>
                            <button onClick={() => { setShowLinkModal(true); setActiveMenuDropdown(null); }}>🔗 Hyperlink (UC-110, UC-111)...</button>
                            <button onClick={() => { setShowNoteModal(true); setActiveMenuDropdown(null); }}>📝 Nota de Rodapé (UC-115, UC-393)...</button>
                            <button onClick={() => { editor?.commands.setHorizontalRule(); setActiveMenuDropdown(null); }}>― Linha Divisória</button>
                          </div>
                        )}
                      </div>

                      <div className="menu-item-group">
                        <button onClick={() => setActiveMenuDropdown(activeMenuDropdown === 'format' ? null : 'format')} className="menu-btn">Formatar</button>
                        {activeMenuDropdown === 'format' && (
                          <div className="dropdown-menu-list animate-fade-in">
                            <button onClick={() => { editor?.chain().focus().toggleBold().run(); setActiveMenuDropdown(null); }}><b>B</b> Negrito</button>
                            <button onClick={() => { editor?.chain().focus().toggleItalic().run(); setActiveMenuDropdown(null); }}><i>I</i> Itálico</button>
                            <button onClick={() => { editor?.chain().focus().toggleStrike().run(); setActiveMenuDropdown(null); }}><s>S</s> Tachado</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="docs-top-actions">
                  {!isLeftSidebarOpen && (
                    <button 
                      type="button" 
                      onClick={() => setIsLeftSidebarOpen(true)} 
                      className="btn-toggle-sidebar-top"
                      title="Exibir Árvore de Capítulos / Explorer"
                    >
                      📁 Explorer
                    </button>
                  )}

                  {!isRightSidebarOpen && (
                    <button 
                      type="button" 
                      onClick={() => setIsRightSidebarOpen(true)} 
                      className="btn-toggle-sidebar-top"
                      title="Exibir Evidências MMS / Histórico de Versões"
                    >
                      📊 IA / Versões
                    </button>
                  )}

                  <span className="save-status-text">
                    {syncStatus === 'syncing' ? '🟡 Salvando...' : syncStatus === 'synced' ? '🟢 Salvo automaticamente' : '🟠 Salvo localmente'}
                  </span>
                  <div className="status-select-badge-wrapper">
                    <select 
                      value={activeManuscript.status} 
                      onChange={(e) => handleUpdateStatus(e.target.value as any)}
                      className="docs-status-select"
                    >
                      <option value="RASCUNHO">Rascunho</option>
                      <option value="REVISAO">Em Revisão</option>
                      <option value="FINALIZADO">Finalizado</option>
                    </select>
                  </div>

                  <button 
                    onClick={handleToggleLock}
                    className={`btn-lock-toggle ${activeManuscript.isLocked ? 'locked' : ''}`}
                  >
                    {activeManuscript.isLocked ? '🔒 Bloqueado' : '🔓 Desbloqueado'}
                  </button>
                </div>
              </div>

              {/* Row 2: Formatting Toolbar Ribbon (MS Word / Google Docs Toolbar) */}
              <div className="docs-formatting-ribbon">
                <button onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()} className="ribbon-btn" title="Desfazer">↩</button>
                <button onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()} className="ribbon-btn" title="Refazer">↪</button>
                <button onClick={() => window.print()} className="ribbon-btn" title="Imprimir / Exportar PDF">🖨️</button>
                <div className="ribbon-divider" />

                {/* Font Family Selector (UC-063, UC-244) */}
                <select 
                  value={fontFamily} 
                  onChange={(e) => setFontFamily(e.target.value as any)}
                  className="ribbon-select font-family-select"
                  title="Fonte do Editor (UC-063, UC-244)"
                >
                  <option value="georgia">Georgia (Serifada)</option>
                  <option value="inter">Inter (Sans-Serif)</option>
                  <option value="times">Times New Roman</option>
                  <option value="courier">Courier New (Mono)</option>
                  <option value="arial">Arial</option>
                </select>

                {/* Font Size Selector (UC-243) */}
                <div className="font-size-control-group">
                  <button onClick={() => setFontSize(prev => Math.max(10, prev - 1))} className="ribbon-btn font-step">-</button>
                  <span className="font-size-display">{fontSize}pt</span>
                  <button onClick={() => setFontSize(prev => Math.min(36, prev + 1))} className="ribbon-btn font-step">+</button>
                </div>

                <div className="ribbon-divider" />

                {/* Formatting Buttons */}
                <button 
                  onClick={() => editor?.chain().focus().toggleBold().run()} 
                  className={`ribbon-btn ${editor?.isActive('bold') ? 'active' : ''}`}
                  title="Negrito (Ctrl+B)"
                >
                  <b>B</b>
                </button>
                <button 
                  onClick={() => editor?.chain().focus().toggleItalic().run()} 
                  className={`ribbon-btn ${editor?.isActive('italic') ? 'active' : ''}`}
                  title="Itálico (Ctrl+I)"
                >
                  <i>I</i>
                </button>
                <button 
                  onClick={() => editor?.chain().focus().toggleStrike().run()} 
                  className={`ribbon-btn ${editor?.isActive('strike') ? 'active' : ''}`}
                  title="Tachado"
                >
                  <s>S</s>
                </button>
                <button 
                  onClick={() => editor?.chain().focus().toggleCode().run()} 
                  className={`ribbon-btn ${editor?.isActive('code') ? 'active' : ''}`}
                  title="Código inline"
                >
                  <code>&lt;&gt;</code>
                </button>

                <div className="ribbon-divider" />

                {/* Headings */}
                <button 
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} 
                  className={`ribbon-btn ${editor?.isActive('heading', { level: 1 }) ? 'active' : ''}`}
                  title="Título 1"
                >
                  H1
                </button>
                <button 
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} 
                  className={`ribbon-btn ${editor?.isActive('heading', { level: 2 }) ? 'active' : ''}`}
                  title="Título 2"
                >
                  H2
                </button>
                <button 
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} 
                  className={`ribbon-btn ${editor?.isActive('heading', { level: 3 }) ? 'active' : ''}`}
                  title="Título 3"
                >
                  H3
                </button>

                <div className="ribbon-divider" />

                {/* Alignment */}
                <button onClick={() => setTextAlign('left')} className={`ribbon-btn ${textAlign === 'left' ? 'active' : ''}`} title="Alinhar à Esquerda">≡</button>
                <button onClick={() => setTextAlign('center')} className={`ribbon-btn ${textAlign === 'center' ? 'active' : ''}`} title="Centralizar">equiv</button>
                <button onClick={() => setTextAlign('right')} className={`ribbon-btn ${textAlign === 'right' ? 'active' : ''}`} title="Alinhar à Direita">≡</button>
                <button onClick={() => setTextAlign('justify')} className={`ribbon-btn ${textAlign === 'justify' ? 'active' : ''}`} title="Justificar">≣</button>

                {/* Line Height Spacing */}
                <select 
                  value={lineHeight} 
                  onChange={(e) => setLineHeight(e.target.value as any)}
                  className="ribbon-select line-height-select"
                  title="Espaçamento de Linhas"
                >
                  <option value="1.2">1.2 (Simples)</option>
                  <option value="1.5">1.5 (Médio)</option>
                  <option value="1.8">1.8 (Largo)</option>
                  <option value="2.0">2.0 (Duplo)</option>
                </select>

                <div className="ribbon-divider" />

                {/* Lists */}
                <button 
                  onClick={() => editor?.chain().focus().toggleBulletList().run()} 
                  className={`ribbon-btn ${editor?.isActive('bulletList') ? 'active' : ''}`}
                  title="Lista com Marcadores"
                >
                  • Lista
                </button>
                <button 
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()} 
                  className={`ribbon-btn ${editor?.isActive('orderedList') ? 'active' : ''}`}
                  title="Lista Numerada"
                >
                  1. Lista
                </button>

                <div className="ribbon-divider" />

                {/* Quick Insert Tools */}
                <button onClick={handleOpenAddComment} className="ribbon-btn" title="Adicionar Comentário na Margem (UC-114)">💬</button>
                <button onClick={() => setShowLinkModal(true)} className="ribbon-btn" title="Inserir Link (UC-110, UC-111)">🔗</button>
                <button onClick={() => setShowNoteModal(true)} className="ribbon-btn" title="Inserir Nota de Rodapé (UC-115, UC-393)">📝</button>
                <button onClick={() => setShowSearchModal(true)} className="ribbon-btn" title="Buscar & Substituir (UC-022, UC-024)">🔍</button>
                <button onClick={() => setShowImportModal(true)} className="ribbon-btn" title="Importar Manuscrito (UC-007)">📥</button>
                <button onClick={() => setShowExportModal(true)} className="ribbon-btn primary" title="Exportar Manuscrito (UC-008)">📤</button>
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

          {/* Google Docs Style Paper View Area */}
          <div className={`google-docs-viewport theme-${docsTheme} ${isReadOnly ? 'read-only-mode' : ''}`}>
            <div className="google-docs-paper-layout-wrapper">
              {/* Google Docs Horizontal Ruler Bar */}
              <div className="google-docs-ruler">
                <div className="ruler-indent-left">▼</div>
                <div className="ruler-ticks">
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
                </div>
                <div className="ruler-indent-right">▼</div>
              </div>

              <div className="google-docs-paper-and-comments">
                {/* Paper Sheet Document Canvas */}
                <div 
                  className="google-docs-paper-sheet glass-paper"
                  style={{
                    fontFamily: fontFamily === 'georgia' ? 'Georgia, serif' :
                                fontFamily === 'inter' ? 'Inter, sans-serif' :
                                fontFamily === 'times' ? '"Times New Roman", serif' :
                                fontFamily === 'courier' ? '"Courier New", monospace' : 'Arial, sans-serif',
                    fontSize: `${fontSize}px`,
                    lineHeight: lineHeight,
                    textAlign: textAlign
                  }}
                >
                  {editor && <EditorContent editor={editor} className="tiptap-editor-content" />}
                </div>

                {/* Google Docs Right Margin Comments Column (UC-114) */}
                <div className="google-docs-comments-margin">
                  <div className="comments-column-header">
                    <h4>💬 Comentários ({comments.filter(c => !c.isResolved).length})</h4>
                    <button onClick={handleOpenAddComment} className="btn-add-comment-mini" title="Novo Comentário">+ Criar</button>
                  </div>

                  {comments.filter(c => !c.isResolved).length === 0 ? (
                    <div className="no-comments-hint">
                      <span>Nenhum comentário aberto. Selecione qualquer trecho no texto e clique em 💬 para comentar.</span>
                    </div>
                  ) : (
                    comments.filter(c => !c.isResolved).map(c => (
                      <div key={c.id} className="google-comment-card animate-fade-in">
                        <div className="comment-card-header">
                          <div className="author-info">
                            <span className="author-avatar">{c.authorName.charAt(0).toUpperCase()}</span>
                            <span className="author-name">{c.authorName}</span>
                          </div>
                          <span className="comment-time">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {c.selectedText && (
                          <div className="comment-quote">
                            "{c.selectedText}"
                          </div>
                        )}

                        <div className="comment-body-text">
                          {c.commentText}
                        </div>

                        <div className="comment-card-actions">
                          <button 
                            type="button" 
                            onClick={() => handleResolveComment(c.id)}
                            className="btn-resolve-comment"
                            title="Marcar comentário como resolvido (UC-114)"
                          >
                            ✓ Resolver
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Google Docs / Word Style Bottom Status Bar */}
          <div className="google-docs-status-bar glass">
            <div className="status-stats-group">
              <span className="status-stat-item" title="Contador de Palavras (UC-028)">
                <strong>{countWords(editor?.getText() || '')}</strong> palavras
              </span>
              <span className="status-stat-separator">•</span>
              <span className="status-stat-item" title="Contador de Caracteres (UC-029)">
                <strong>{(editor?.getText() || '').length}</strong> caracteres
              </span>
              <span className="status-stat-separator">•</span>
              <span className="status-stat-item" title="Tempo de leitura estimado (UC-186)">
                ⏱️ ~<strong>{Math.max(1, Math.ceil(countWords(editor?.getText() || '') / 200))}</strong> min de leitura
              </span>
            </div>

            <div className="status-progress-group">
              <span className="progress-mini-label">
                Meta: {wordsToday} / {calculatedQuota} p/dia ({progressPercentage}%)
              </span>
              <div className="progress-mini-bar">
                <div className="progress-mini-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>

            <div className="status-modes-group">
              {isReadOnly && <span className="mode-badge read-only">📖 Leitura Apenas</span>}
              {activeManuscript?.isLocked && <span className="mode-badge locked">🔒 Bloqueado</span>}
              <button 
                type="button" 
                onClick={() => setIsReadOnly(!isReadOnly)} 
                className="btn-mode-toggle"
                title="Alternar entre modo de Edição e Leitura (UC-187)"
              >
                {isReadOnly ? '✏️ Modo Edição' : '📖 Modo Leitura'}
              </button>
            </div>
          </div>
        </main>

        {/* Right Panel - MMS Logs & Version History */}
        {!isFocusMode && isRightSidebarOpen && (
          <aside 
            className="editor-side-panel mms-logs-panel glass"
            style={{ width: rightPanelWidth, minWidth: rightPanelWidth, maxWidth: rightPanelWidth }}
          >
            <div 
              className="sidebar-resizer-handle left-border"
              onMouseDown={handleRightMouseDown}
              title="Clique e arraste a borda para redimensionar o painel de evidências"
            />
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
              <button 
                type="button" 
                onClick={() => setIsRightSidebarOpen(false)}
                className="btn-collapse-panel-header"
                title="Recolher Painel IA / Evidências"
              >
                ▶
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
                
                <div className="snapshot-actions-bar">
                  {!showCustomTagInput ? (
                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                      <button 
                        type="button" 
                        className="btn-create-snapshot"
                        style={{ flex: 1 }}
                        onClick={() => {
                          if (activeManuscript) {
                            createVersionSnapshot(activeManuscript, editor?.getHTML() || '');
                          }
                        }}
                        disabled={!activeManuscript}
                      >
                        + Criar Snapshot Rápido
                      </button>
                      <button 
                        type="button" 
                        className="btn-create-snapshot secondary"
                        onClick={() => setShowCustomTagInput(true)}
                        disabled={!activeManuscript}
                        title="Criar snapshot com rótulo customizado"
                      >
                        🏷️ Rotular
                      </button>
                    </div>
                  ) : (
                    <div className="custom-snapshot-input-row">
                      <input 
                        type="text" 
                        placeholder="Ex: Draft Roteiro Final, Revisão..." 
                        value={customVersionTag} 
                        onChange={(e) => setCustomVersionTag(e.target.value)}
                        className="custom-tag-input"
                      />
                      <button 
                        type="button" 
                        onClick={handleCreateLabeledSnapshot}
                        className="btn-save-tag"
                      >
                        Salvar
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowCustomTagInput(false)}
                        className="btn-cancel-tag"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="versions-container">
                  {versions.length === 0 ? (
                    <p className="no-logs">Nenhum ponto de restauração registrado para este capítulo. Digite por 10 minutos ou clique nos botões acima para registrar.</p>
                  ) : (
                    versions.map((ver) => {
                      const rawText = ver.content.replace(/<[^>]*>/g, '');
                      const excerpt = rawText.length > 80 ? rawText.substring(0, 80) + '...' : rawText || '(Capítulo Vazio)';

                      return (
                        <div key={ver.id} className="version-card glass">
                          <div className="version-card-header">
                            <span className="version-number">#{ver.versionNumber} {ver.title !== activeManuscript?.title ? `(${ver.title})` : ''}</span>
                            <span className="version-time">{new Date(ver.createdAt).toLocaleTimeString()} - {new Date(ver.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="version-excerpt">"{excerpt}"</p>
                          <div className="version-card-actions">
                            <button 
                              type="button" 
                              className="btn-view-version"
                              onClick={() => {
                                setSelectedVersion(ver);
                                setShowVersionPreview(true);
                              }}
                            >
                              Visualizar
                            </button>
                            <button 
                              type="button" 
                              className="btn-diff-version"
                              onClick={() => handleCompareVersionDiff(ver)}
                              title="Comparar alterações em relação ao texto atual (UC-196)"
                            >
                              📊 Ver Diff
                            </button>
                          </div>
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

                <div className="form-group" style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <label>Densidade da Interface (UC-084)</label>
                  <div className="off-days-checkboxes">
                    {[
                      { id: 'compact', name: 'Compacta' },
                      { id: 'standard', name: 'Padrão' },
                      { id: 'comfortable', name: 'Confortável' }
                    ].map(d => (
                      <label key={d.id} className="off-day-label">
                        <input 
                          type="radio" 
                          name="uiDensity"
                          checked={uiDensity === d.id} 
                          onChange={() => {
                            setUiDensity(d.id as any);
                            localStorage.setItem('uiDensity', d.id);
                          }}
                        />
                        <span>{d.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Cor de Destaque / Tema (UC-085)</label>
                  <div className="off-days-checkboxes">
                    {[
                      { id: 'purple', name: '🟣 Roxo Eldritch' },
                      { id: 'blue', name: '🔵 Azul Mágico' },
                      { id: 'emerald', name: '🟢 Esmeralda' },
                      { id: 'amber', name: '🟡 Âmbar' },
                      { id: 'rose', name: '🔴 Rosa / Rubro' }
                    ].map(c => (
                      <label key={c.id} className="off-day-label">
                        <input 
                          type="radio" 
                          name="accentColor"
                          checked={accentColor === c.id} 
                          onChange={() => {
                            setAccentColor(c.id as any);
                            localStorage.setItem('accentColor', c.id);
                          }}
                        />
                        <span>{c.name}</span>
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

      {/* Search & Replace Floating Widget (UC-022, UC-023, UC-024) */}
      {showSearchModal && (
        <div className="search-replace-widget glass animate-fade-in">
          <div className="search-widget-header">
            <h4>🔍 Buscar & Substituir</h4>
            <button onClick={() => setShowSearchModal(false)} className="btn-close-widget">✕</button>
          </div>

          <div className="search-widget-inputs">
            <div className="search-input-group">
              <input 
                type="text" 
                placeholder="Buscar palavra, frase ou contexto..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleExecuteSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNextMatch();
                }}
                className="search-input"
                autoFocus
              />
              <span className="match-count-badge">
                {searchResults.length > 0 ? `${currentMatchIndex + 1}/${searchResults.length}` : '0 resultados'}
              </span>
            </div>

            <div className="search-input-group">
              <input 
                type="text" 
                placeholder="Substituir por..." 
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="search-widget-options">
            <label className="search-option-check">
              <input 
                type="checkbox" 
                checked={searchCaseSensitive} 
                onChange={(e) => {
                  setSearchCaseSensitive(e.target.checked);
                  handleExecuteSearch();
                }} 
              />
              <span>Maiúsculas/Minúsculas</span>
            </label>
            <label className="search-option-check">
              <input 
                type="checkbox" 
                checked={searchWholeWord} 
                onChange={(e) => {
                  setSearchWholeWord(e.target.checked);
                  handleExecuteSearch();
                }} 
              />
              <span>Palavra Inteira</span>
            </label>
            <label className="search-option-check">
              <input 
                type="checkbox" 
                checked={searchIsRegex} 
                onChange={(e) => {
                  setSearchIsRegex(e.target.checked);
                  handleExecuteSearch();
                }} 
              />
              <span>Regex / Contexto</span>
            </label>
          </div>

          <div className="search-widget-actions">
            <button onClick={handlePrevMatch} disabled={searchResults.length === 0} className="btn-search-nav">
              ▲ Anterior
            </button>
            <button onClick={handleNextMatch} disabled={searchResults.length === 0} className="btn-search-nav">
              ▼ Próximo
            </button>
            <button onClick={handleReplaceSingleMatch} disabled={searchResults.length === 0} className="btn-search-replace">
              Substituir
            </button>
            <button onClick={handleReplaceAllMatches} disabled={searchResults.length === 0} className="btn-search-replace primary">
              Substituir Tudo
            </button>
          </div>
        </div>
      )}

      {/* Version Diff Viewer Modal (UC-196) */}
      {showDiffModal && diffVersion && diffResult && (
        <div className="version-modal-overlay animate-fade-in">
          <div className="diff-modal-card glass">
            <div className="diff-modal-header">
              <div>
                <h3>📊 Comparação de Diferenças (Diff)</h3>
                <p className="diff-subtitle">
                  Comparando <strong>Versão #{diffVersion.versionNumber} ({diffVersion.title})</strong> com o <strong>Manuscrito Atual</strong>
                </p>
              </div>
              <button onClick={() => setShowDiffModal(false)} className="btn-modal-close">✕</button>
            </div>

            <div className="diff-summary-badges">
              <span className="diff-badge added">+{diffResult.addedWords} palavras adicionadas</span>
              <span className="diff-badge removed">-{diffResult.removedWords} palavras removidas</span>
              <span className="diff-badge unchanged">{diffResult.unchangedWords} palavras inalteradas</span>
            </div>

            <div className="diff-content-container">
              {diffResult.chunks.map((chunk, idx) => {
                if (chunk.type === 'added') {
                  return <mark key={idx} className="diff-added-chunk">{chunk.text}</mark>;
                }
                if (chunk.type === 'removed') {
                  return <del key={idx} className="diff-removed-chunk">{chunk.text}</del>;
                }
                return <span key={idx} className="diff-unchanged-chunk">{chunk.text}</span>;
              })}
            </div>

            <div className="diff-modal-actions">
              <button 
                type="button" 
                className="btn-modal-restore"
                onClick={() => {
                  handleRestoreVersion(diffVersion);
                  setShowDiffModal(false);
                }}
              >
                Restaurar Esta Versão
              </button>
              <button 
                type="button" 
                className="btn-modal-close"
                onClick={() => setShowDiffModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal (UC-008, UC-163) */}
      {showExportModal && (
        <div className="version-modal-overlay animate-fade-in">
          <div className="export-modal-card glass">
            <div className="export-modal-header">
              <h3>📤 Exportar Manuscrito</h3>
              <p className="export-subtitle">Selecione os parâmetros e o formato desejado para exportação.</p>
            </div>

            <div className="export-form-body">
              <div className="form-group">
                <label>Escopo de Exportação:</label>
                <select value={exportScope} onChange={(e) => setExportScope(e.target.value as any)}>
                  <option value="current">Apenas Capítulo Ativo ({activeManuscript?.title || 'Selecione um capítulo'})</option>
                  <option value="all">Livro Inteiro ({manuscripts.filter(m => !m.inTrash).length} capítulos)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Formato de Arquivo:</label>
                <div className="export-format-grid">
                  {[
                    { id: 'docx', label: 'Word (.docx)', desc: 'Documento editável com estilos literários' },
                    { id: 'pdf', label: 'PDF Impressão (.pdf)', desc: 'Folha A4 formatada pronta para publicação' },
                    { id: 'epub', label: 'E-book ePub (.epub)', desc: 'Formatado com estrutura de capítulos e navegação' },
                    { id: 'md', label: 'Markdown (.md)', desc: 'Texto limpo com marcações de formatação' },
                    { id: 'txt', label: 'Texto Puro (.txt)', desc: 'Sem formatação, compatível com qualquer leitor' },
                    { id: 'html', label: 'Página Web (.html)', desc: 'Documento completo HTML com CSS responsivo' },
                  ].map((fmt) => (
                    <div 
                      key={fmt.id} 
                      className={`format-card ${exportFormat === fmt.id ? 'active' : ''}`}
                      onClick={() => setExportFormat(fmt.id as ExportFormat)}
                    >
                      <strong>{fmt.label}</strong>
                      <span>{fmt.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="export-modal-actions">
              <button 
                type="button" 
                className="btn-modal-restore"
                onClick={handleExecuteExport}
              >
                Gerar Download
              </button>
              <button 
                type="button" 
                className="btn-modal-close"
                onClick={() => setShowExportModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal (UC-007, UC-194) */}
      {showImportModal && (
        <div className="version-modal-overlay animate-fade-in">
          <div className="import-modal-card glass">
            <div className="import-modal-header">
              <h3>📥 Importar Arquivo de Manuscrito</h3>
              <p className="import-subtitle">Suporta arquivos .txt, .md, .docx, .html e .json.</p>
            </div>

            <div className="import-form-body">
              <div className="form-group">
                <label>Modo de Importação:</label>
                <select value={importMode} onChange={(e) => setImportMode(e.target.value as any)}>
                  <option value="new_chapter">Criar como Novo Capítulo no Explorer</option>
                  <option value="overwrite" disabled={!activeManuscript}>Substituir conteúdo do Capítulo Ativo ({activeManuscript?.title || 'Nenhum ativo'})</option>
                </select>
              </div>

              <div className="file-dropzone">
                <input 
                  type="file" 
                  accept=".txt,.md,.markdown,.docx,.html,.htm,.json" 
                  onChange={handleImportFile}
                  className="file-input-hidden"
                  id="import-file-input"
                />
                <label htmlFor="import-file-input" className="file-dropzone-label">
                  <span className="dropzone-icon">📁</span>
                  <strong>Clique aqui para selecionar o arquivo</strong>
                  <span>.TXT, .MD, .DOCX, .HTML</span>
                </label>
              </div>
            </div>

            <div className="import-modal-actions">
              <button 
                type="button" 
                className="btn-modal-close"
                onClick={() => setShowImportModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hyperlink Insertion Modal (UC-110, UC-111) */}
      {showLinkModal && (
        <div className="version-modal-overlay animate-fade-in">
          <div className="import-modal-card glass">
            <div className="import-modal-header">
              <h3>🔗 Inserir Hyperlink</h3>
              <p className="import-subtitle">Insira um link da web ou referência interna no texto.</p>
            </div>
            <div className="import-form-body">
              <div className="form-group">
                <label>Texto do Link:</label>
                <input 
                  type="text" 
                  placeholder="Ex: Capítulo 2, Referência Wikipédia..." 
                  value={linkText} 
                  onChange={(e) => setLinkText(e.target.value)}
                  className="search-input"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>URL / Destino (ex: https://...):</label>
                <input 
                  type="text" 
                  placeholder="https://exemplo.com" 
                  value={linkUrl} 
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="import-modal-actions">
              <button type="button" className="btn-modal-restore" onClick={handleExecuteInsertLink}>
                Inserir Link
              </button>
              <button type="button" className="btn-modal-close" onClick={() => setShowLinkModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footnote / Note Insertion Modal (UC-115, UC-393) */}
      {showNoteModal && (
        <div className="version-modal-overlay animate-fade-in">
          <div className="import-modal-card glass">
            <div className="import-modal-header">
              <h3>📝 Inserir Nota de Rodapé</h3>
              <p className="import-subtitle">Adicione uma nota explicativa ou anotação ao manuscrito.</p>
            </div>
            <div className="import-form-body">
              <div className="form-group">
                <label>Conteúdo da Nota:</label>
                <textarea 
                  rows={4}
                  placeholder="Digite sua anotação ou nota de rodapé..." 
                  value={noteText} 
                  onChange={(e) => setNoteText(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', resize: 'vertical' }}
                  autoFocus
                />
              </div>
            </div>
            <div className="import-modal-actions">
              <button type="button" className="btn-modal-restore" onClick={handleExecuteInsertNote}>
                Inserir Nota
              </button>
              <button type="button" className="btn-modal-close" onClick={() => setShowNoteModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Inline Comment Modal (UC-114) */}
      {showCommentModal && (
        <div className="version-modal-overlay animate-fade-in">
          <div className="import-modal-card glass">
            <div className="import-modal-header">
              <h3>💬 Adicionar Comentário na Margem</h3>
              <p className="import-subtitle">O comentário ficará fixado na margem direita do Google Docs.</p>
            </div>
            <div className="import-form-body">
              {selectedTextForComment && (
                <div className="selected-quote-preview">
                  <strong>Trecho Selecionado:</strong> "{selectedTextForComment}"
                </div>
              )}
              <div className="form-group">
                <label>Seu Comentário / Observação:</label>
                <textarea 
                  rows={3}
                  placeholder="Escreva seu comentário para esta passagem..." 
                  value={newCommentText} 
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', resize: 'vertical' }}
                  autoFocus
                />
              </div>
            </div>
            <div className="import-modal-actions">
              <button type="button" className="btn-modal-restore" onClick={handleSaveComment}>
                Salvar Comentário
              </button>
              <button type="button" className="btn-modal-close" onClick={() => setShowCommentModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manuscript Templates Modal (UC-137, UC-138) */}
      {showTemplateModal && (
        <div className="version-modal-overlay animate-fade-in">
          <div className="import-modal-card glass template-modal-wide">
            <div className="import-modal-header">
              <h3>📑 Criar Capítulo a partir de Modelo/Template</h3>
              <p className="import-subtitle">Escolha uma estrutura pré-definida para acelerar sua escrita literária.</p>
            </div>
            <div className="templates-grid">
              {MANUSCRIPT_TEMPLATES.map(tmpl => (
                <div key={tmpl.id} className="template-card glass">
                  <div className="template-card-header">
                    <h4>{tmpl.name}</h4>
                    <span className="template-category-badge">{tmpl.category}</span>
                  </div>
                  <p className="template-desc">{tmpl.description}</p>
                  <button 
                    type="button" 
                    onClick={() => handleApplyTemplate(tmpl.contentHtml, tmpl.titlePlaceholder)}
                    className="btn-use-template"
                  >
                    Usar este Modelo
                  </button>
                </div>
              ))}
            </div>
            <div className="import-modal-actions">
              <button type="button" className="btn-modal-close" onClick={() => setShowTemplateModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawing Canvas Modal (UC-062) */}
      {showDrawingModal && (
        <div className="version-modal-overlay animate-fade-in">
          <div className="import-modal-card glass drawing-modal-card">
            <div className="import-modal-header">
              <h3>🎨 Quadro de Desenho & Rascunho Visual</h3>
              <p className="import-subtitle">Desenhe mapas, esquemas ou diagramas à mão livre para inserir no texto.</p>
            </div>
            
            <div className="drawing-canvas-container">
              <canvas 
                id="drawing-canvas" 
                width={600} 
                height={350} 
                className="drawing-canvas-element"
                onMouseDown={(e) => {
                  const canvas = e.currentTarget;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;
                  ctx.beginPath();
                  const rect = canvas.getBoundingClientRect();
                  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                  (canvas as any).isDrawing = true;
                }}
                onMouseMove={(e) => {
                  const canvas = e.currentTarget;
                  if (!(canvas as any).isDrawing) return;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;
                  const rect = canvas.getBoundingClientRect();
                  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                  ctx.strokeStyle = (canvas as any).drawColor || '#ffffff';
                  ctx.lineWidth = (canvas as any).drawWidth || 3;
                  ctx.lineCap = 'round';
                  ctx.stroke();
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as any).isDrawing = false;
                }}
              />
              
              <div className="drawing-toolbar">
                <button type="button" onClick={() => {
                  const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
                  if (canvas) (canvas as any).drawColor = '#ffffff';
                }} className="color-dot white" title="Branco" />
                <button type="button" onClick={() => {
                  const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
                  if (canvas) (canvas as any).drawColor = '#3b82f6';
                }} className="color-dot blue" title="Azul" />
                <button type="button" onClick={() => {
                  const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
                  if (canvas) (canvas as any).drawColor = '#ef4444';
                }} className="color-dot red" title="Vermelho" />
                <button type="button" onClick={() => {
                  const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
                  if (canvas) (canvas as any).drawColor = '#22c55e';
                }} className="color-dot green" title="Verde" />
                <button type="button" onClick={() => {
                  const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
                  if (canvas) (canvas as any).drawColor = '#c084fc';
                }} className="color-dot purple" title="Roxo" />
                <button type="button" onClick={() => {
                  const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
                  if (canvas) (canvas as any).drawColor = '#fde047';
                }} className="color-dot yellow" title="Amarelo" />
                
                <button type="button" onClick={() => {
                  const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
                  const ctx = canvas?.getContext('2d');
                  if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                }} className="btn-clear-canvas">Limpar Canvas</button>
              </div>
            </div>

            <div className="import-modal-actions">
              <button 
                type="button" 
                className="btn-modal-restore" 
                onClick={() => {
                  const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
                  if (canvas) handleInsertDrawingToEditor(canvas.toDataURL());
                }}
              >
                Inserir no Manuscrito
              </button>
              <button type="button" className="btn-modal-close" onClick={() => setShowDrawingModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Modal (UC-061) */}
      {showAuditModal && (
        <div className="version-modal-overlay animate-fade-in">
          <div className="import-modal-card glass audit-modal-card">
            <div className="import-modal-header">
              <h3>📋 Registros de Ações Automáticas do Sistema</h3>
              <p className="import-subtitle">Histórico de auto-salvamentos, backups, títulos e sincronizações executadas pelo sistema.</p>
            </div>
            
            <div className="audit-logs-list">
              {auditLogs.length === 0 ? (
                <p className="empty-audit-msg">Nenhuma ação automática registrada ainda.</p>
              ) : (
                auditLogs.map(log => (
                  <div key={log.id} className="audit-log-item">
                    <div className="audit-item-meta">
                      <span className={`audit-badge ${log.type}`}>{log.type}</span>
                      <span className="audit-time">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="audit-desc">{log.description}</p>
                  </div>
                ))
              )}
            </div>

            <div className="import-modal-actions">
              <button type="button" className="btn-modal-close" onClick={() => setShowAuditModal(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Main App Shell Layout (Fixes Left Panel Cutoff & Scrolling) */
        .main-content {
          display: flex !important;
          width: 100vw !important;
          max-width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
          background-color: var(--bg-space);
          position: relative;
          box-sizing: border-box !important;
        }

        .editor-workspace {
          flex: 1 1 0% !important;
          min-width: 0 !important;
          width: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          height: 100vh !important;
          overflow: hidden !important;
          position: relative;
        }

        .google-docs-viewport {
          flex: 1 1 0% !important;
          min-width: 0 !important;
          overflow-y: auto !important;
          overflow-x: auto !important;
          background: #0f172a;
          padding: 2rem 1rem;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          scroll-behavior: smooth;
          box-sizing: border-box !important;
        }

        /* Interface Density System (UC-084) */
        .main-content.density-compact .editor-side-panel {
          padding: 0.75rem 0.5rem !important;
        }

        .main-content.density-compact .docs-top-bar {
          padding: 0.35rem 0.8rem !important;
        }

        .main-content.density-comfortable .editor-side-panel {
          padding: 1.75rem 1.5rem !important;
        }

        .main-content.density-comfortable .google-docs-viewport {
          padding: 3rem 2rem !important;
        }

        /* Accent Color Themes System (UC-085) */
        .main-content.accent-blue {
          --brand-primary: #3b82f6;
          --brand-glow: rgba(59, 130, 246, 0.4);
        }

        .main-content.accent-emerald {
          --brand-primary: #10b981;
          --brand-glow: rgba(16, 185, 129, 0.4);
        }

        .main-content.accent-amber {
          --brand-primary: #f59e0b;
          --brand-glow: rgba(245, 158, 11, 0.4);
        }

        .main-content.accent-rose {
          --brand-primary: #f43f5e;
          --brand-glow: rgba(244, 63, 94, 0.4);
        }

        .editor-side-panel {
          position: relative;
          height: 100vh !important;
          overflow-y: auto !important;
          flex-shrink: 0 !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          z-index: 20;
          padding: 1.25rem 1rem;
        }

        .editor-side-panel.left-panel {
          border-right: 1px solid var(--border-light);
          border-left: none;
        }

        .editor-side-panel.mms-logs-panel {
          border-left: 1px solid var(--border-light);
          border-right: none;
          padding: 1.25rem 1rem !important;
          box-sizing: border-box !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
        }

        .sidebar-resizer-handle {
          position: absolute;
          top: 0;
          width: 6px;
          height: 100%;
          cursor: col-resize;
          z-index: 150;
          transition: background 0.15s ease;
        }

        .sidebar-resizer-handle.right-border {
          right: -3px;
        }

        .sidebar-resizer-handle.left-border {
          left: -3px;
        }

        .sidebar-resizer-handle:hover,
        .sidebar-resizer-handle:active {
          background: #14b8a6;
          box-shadow: 0 0 10px rgba(20, 184, 166, 0.7);
        }

        @media (max-width: 1536px) {
          .editor-side-panel.mms-logs-panel {
            position: fixed !important;
            right: 0 !important;
            top: 0 !important;
            height: 100vh !important;
            z-index: 100 !important;
            box-shadow: -4px 0 25px rgba(0, 0, 0, 0.5) !important;
            background: rgba(15, 23, 42, 0.96) !important;
            backdrop-filter: blur(20px) !important;
          }
        }

        .docs-home-icon-btn {
          font-size: 1.5rem;
          color: #3b82f6;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          transition: all 0.2s ease;
        }

        .docs-home-icon-btn:hover {
          background: rgba(59, 130, 246, 0.25);
          transform: scale(1.05);
        }

        .docs-project-name-badge {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .docs-project-name-badge:hover {
          color: #14b8a6;
          background: rgba(20, 184, 166, 0.12);
          border-color: rgba(20, 184, 166, 0.3);
        }

        .docs-title-separator {
          color: var(--text-muted);
          font-weight: 300;
          margin: 0 0.25rem;
        }

        .docs-doc-title-input.mini {
          font-size: 0.85rem;
          padding: 0.15rem 0.4rem;
          width: 140px;
        }

        .explorer-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 0.6rem;
        }

        .btn-collapse-panel-header {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          border-radius: 4px;
          padding: 0.2rem 0.45rem;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-collapse-panel-header:hover {
          background: rgba(20, 184, 166, 0.2);
          color: #14b8a6;
          border-color: rgba(20, 184, 166, 0.4);
        }

        .btn-toggle-sidebar-top {
          background: rgba(20, 184, 166, 0.12);
          border: 1px solid rgba(20, 184, 166, 0.3);
          color: #14b8a6;
          border-radius: 4px;
          padding: 0.25rem 0.55rem;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          margin-right: 0.35rem;
        }

        .btn-toggle-sidebar-top:hover {
          background: rgba(20, 184, 166, 0.25);
          box-shadow: 0 0 10px rgba(20, 184, 166, 0.2);
        }

        .top-nav-shortcuts {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-right: 0.5rem;
        }

        .btn-top-shortcut {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          font-size: 0.72rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .btn-top-shortcut:hover {
          background: rgba(20, 184, 166, 0.15);
          color: #14b8a6;
          border-color: rgba(20, 184, 166, 0.3);
        }

        .mms-logs-panel p,
        .mms-logs-panel span,
        .mms-logs-panel div,
        .mms-logs-panel button,
        .mms-logs-panel h4,
        .no-logs,
        .panel-subtitle {
          max-width: 100% !important;
          box-sizing: border-box !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          white-space: normal !important;
        }

        .google-docs-header-ribbon {
          flex-shrink: 0;
        }

        .google-docs-status-bar {
          flex-shrink: 0;
        }

        .google-docs-viewport.theme-light {
          background: #f8f9fa !important;
          color: #202124 !important;
        }

        .google-docs-paper-sheet {
          width: 100%;
          max-width: 816px;
          min-height: 1056px;
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 4px;
          padding: 3.5rem 4rem;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.35);
          color: #f8fafc;
          transition: all 0.2s ease;
        }

        .google-docs-viewport.theme-light .google-docs-paper-sheet {
          background: #ffffff !important;
          color: #202124 !important;
          box-shadow: 0 1px 3px 1px rgba(60, 64, 67, 0.15), 0 1px 2px 0 rgba(60, 64, 67, 0.3) !important;
          border: 1px solid #dadce0 !important;
        }

        .google-docs-paper-sheet .tiptap-editor-content .ProseMirror {
          min-height: 850px;
          outline: none;
          line-height: 1.6;
          word-wrap: break-word;
        }

        .google-docs-viewport.theme-light .tiptap-editor-content .ProseMirror {
          color: #202124 !important;
        }

        /* Google Docs & MS Word Header Ribbon */
        .google-docs-header-ribbon {
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid var(--border-light);
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
        }

        .docs-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 1.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .docs-brand-doc {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .docs-doc-icon {
          font-size: 1.5rem;
        }

        .docs-doc-meta {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .docs-doc-title-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .docs-doc-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          cursor: pointer;
          border-radius: 4px;
          padding: 0.1rem 0.3rem;
          transition: background 0.15s ease;
        }

        .docs-doc-title:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .docs-doc-title-input {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(147, 51, 234, 0.5);
          border-radius: 4px;
          padding: 0.1rem 0.4rem;
        }

        .status-badge-mini {
          font-size: 0.65rem;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .status-badge-mini.rascunho {
          background: rgba(234, 179, 8, 0.15);
          color: #fde047;
          border: 1px solid rgba(234, 179, 8, 0.3);
        }

        .status-badge-mini.revisao {
          background: rgba(59, 130, 246, 0.15);
          color: #93c5fd;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .status-badge-mini.finalizado {
          background: rgba(34, 197, 94, 0.15);
          color: #86efac;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        /* Menu Bar */
        .docs-menu-bar {
          display: flex;
          gap: 0.25rem;
        }

        .menu-item-group {
          position: relative;
        }

        .menu-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .dropdown-menu-list {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 100;
          min-width: 210px;
          background: rgba(15, 23, 42, 0.96);
          border: 1px solid rgba(147, 51, 234, 0.3);
          border-radius: 8px;
          padding: 0.4rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .dropdown-menu-list button {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.8rem;
          padding: 0.4rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .dropdown-menu-list button:hover {
          background: rgba(147, 51, 234, 0.25);
          color: #e9d5ff;
        }

        .dropdown-menu-list button.danger:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #fca5a5;
        }

        .dropdown-menu-list hr {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin: 0.2rem 0;
        }

        .docs-top-actions {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .save-status-text {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .docs-status-select {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          border-radius: 6px;
          padding: 0.3rem 0.6rem;
          font-size: 0.78rem;
        }

        /* Formatting Ribbon Toolbar */
        .docs-formatting-ribbon {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 1.2rem;
          background: rgba(0, 0, 0, 0.25);
          overflow-x: auto;
          flex-wrap: nowrap;
        }

        .ribbon-btn {
          min-width: 32px;
          height: 32px;
          padding: 0 0.5rem;
          border-radius: 6px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .ribbon-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .ribbon-btn.active {
          background: rgba(147, 51, 234, 0.25);
          border-color: rgba(147, 51, 234, 0.5);
          color: #c084fc;
        }

        .ribbon-btn.primary {
          background: rgba(147, 51, 234, 0.3);
          border-color: rgba(147, 51, 234, 0.5);
          color: #e9d5ff;
        }

        .ribbon-select {
          height: 32px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          border-radius: 6px;
          padding: 0 0.5rem;
          font-size: 0.78rem;
        }

        .font-family-select {
          min-width: 140px;
        }

        .line-height-select {
          min-width: 110px;
        }

        .font-size-control-group {
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          padding: 0 0.2rem;
          height: 32px;
        }

        .font-step {
          width: 24px;
          height: 24px;
          padding: 0;
          font-weight: 700;
        }

        .font-size-display {
          font-size: 0.78rem;
          color: var(--text-primary);
          padding: 0 0.4rem;
          font-weight: 600;
        }

        .ribbon-divider {
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.12);
          margin: 0 0.2rem;
        }

        /* Pinned Manuscripts Group (UC-128) */
        .pinned-manuscripts-group {
          margin-bottom: 0.75rem;
        }

        .pinned-group-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #fde047;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 0.35rem;
        }

        .pinned-group-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 0.5rem 0;
        }

        .action-btn.active-pin {
          color: #fde047;
          opacity: 1;
        }

        /* Drawing Canvas CSS (UC-062) */
        .drawing-modal-card {
          max-width: 660px !important;
        }

        .drawing-canvas-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin: 1rem 0;
        }

        .drawing-canvas-element {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          cursor: crosshair;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.5);
        }

        .drawing-toolbar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .color-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .color-dot:hover {
          transform: scale(1.2);
        }

        .color-dot.white { background: #ffffff; }
        .color-dot.blue { background: #3b82f6; }
        .color-dot.red { background: #ef4444; }
        .color-dot.green { background: #22c55e; }
        .color-dot.purple { background: #c084fc; }
        .color-dot.yellow { background: #fde047; }

        .btn-clear-canvas {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          border-radius: 4px;
          padding: 0.2rem 0.5rem;
          font-size: 0.72rem;
          cursor: pointer;
        }

        /* Audit Log Modal CSS (UC-061) */
        .audit-modal-card {
          max-width: 600px !important;
        }

        .audit-logs-list {
          max-height: 380px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .audit-log-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          padding: 0.6rem;
        }

        .audit-item-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.2rem;
        }

        .audit-badge {
          font-size: 0.65rem;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          font-weight: 700;
          text-transform: uppercase;
          background: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
        }

        .audit-time {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        .audit-desc {
          font-size: 0.78rem;
          color: var(--text-primary);
          margin: 0;
        }

        /* Google Docs Theme System (UC-159) */
        .google-docs-viewport.theme-light {
          background: #f8f9fa;
          color: #202124;
        }

        .google-docs-viewport.theme-light .google-docs-paper-sheet {
          background: #ffffff;
          color: #202124;
          box-shadow: 0 1px 3px 1px rgba(60, 64, 67, 0.15), 0 1px 2px 0 rgba(60, 64, 67, 0.3);
          border: 1px solid #dadce0;
        }

        .google-docs-viewport.theme-light .tiptap-editor-content {
          color: #202124;
        }

        /* Google Docs Layout Wrapper & Ruler */
        .google-docs-paper-layout-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 1180px;
        }

        .google-docs-ruler {
          width: 100%;
          max-width: 816px;
          height: 20px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          font-size: 0.65rem;
          color: var(--text-muted);
          user-select: none;
        }

        .ruler-ticks {
          display: flex;
          gap: 2.5rem;
          font-weight: 600;
        }

        .ruler-indent-left, .ruler-indent-right {
          color: #4285f4;
          font-size: 0.6rem;
          cursor: col-resize;
        }

        .google-docs-paper-and-comments {
          display: flex;
          gap: 1.5rem;
          width: 100%;
          justify-content: center;
          align-items: flex-start;
        }

        /* Google Docs Right Margin Comments Column (UC-114) */
        .google-docs-comments-margin {
          width: 280px;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: sticky;
          top: 1rem;
        }

        .comments-column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.4rem 0.6rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-light);
          border-radius: 6px;
        }

        .comments-column-header h4 {
          margin: 0;
          font-size: 0.82rem;
          color: var(--text-primary);
        }

        .btn-add-comment-mini {
          background: #1a73e8;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          padding: 0.2rem 0.5rem;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-add-comment-mini:hover {
          background: #1557b0;
        }

        .no-comments-hint {
          padding: 0.8rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px dashed var(--border-light);
          border-radius: 6px;
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .google-comment-card {
          background: rgba(30, 41, 59, 0.95);
          border: 1px solid rgba(147, 51, 234, 0.4);
          border-radius: 8px;
          padding: 0.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .comment-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .author-avatar {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4285f4, #9333ea);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .author-name {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .comment-time {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .comment-quote {
          font-size: 0.72rem;
          color: #fde047;
          background: rgba(234, 179, 8, 0.15);
          border-left: 2px solid #facc15;
          padding: 0.25rem 0.4rem;
          border-radius: 2px;
          font-style: italic;
        }

        .comment-body-text {
          font-size: 0.8rem;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .comment-card-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.2rem;
        }

        .btn-resolve-comment {
          background: rgba(34, 197, 94, 0.15);
          color: #86efac;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 4px;
          padding: 0.2rem 0.5rem;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-resolve-comment:hover {
          background: rgba(34, 197, 94, 0.3);
        }

        /* Chapter Templates Modal CSS (UC-137, UC-138) */
        .template-modal-wide {
          max-width: 780px !important;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .template-card {
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.04);
        }

        .template-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .template-card-header h4 {
          margin: 0;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .template-category-badge {
          font-size: 0.65rem;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          background: rgba(147, 51, 234, 0.2);
          color: #c084fc;
          text-transform: uppercase;
          font-weight: 700;
        }

        .template-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.4;
        }

        .btn-use-template {
          background: linear-gradient(135deg, #1a73e8, #9333ea);
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 0.4rem 0.75rem;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: transform 0.15s ease;
        }

        .btn-use-template:hover {
          transform: translateY(-1px);
        }

        .selected-quote-preview {
          background: rgba(234, 179, 8, 0.12);
          border: 1px solid rgba(234, 179, 8, 0.3);
          border-radius: 6px;
          padding: 0.5rem 0.75rem;
          font-size: 0.78rem;
          color: #fde047;
          margin-bottom: 0.75rem;
        }

        /* Google Docs Paper View Area */
        .google-docs-viewport {
          flex: 1;
          overflow-y: auto;
          background: #0f172a;
          padding: 2.5rem 1rem;
          display: flex;
          justify-content: center;
        }

        .google-docs-viewport.read-only-mode {
          background: #020617;
        }

        .google-docs-paper-sheet {
          width: 100%;
          max-width: 816px;
          min-height: 1056px;
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 3.5rem 4rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2);
          color: #f8fafc;
          transition: all 0.2s ease;
        }

        .google-docs-paper-sheet .tiptap-editor-content {
          min-height: 900px;
          outline: none;
        }

        /* Links & Footnotes inside paper */
        .manuscript-link {
          color: #60a5fa;
          text-decoration: underline;
        }

        .footnote-box {
          font-size: 0.8em;
          color: #c084fc;
          background: rgba(147, 51, 234, 0.15);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          border: 1px solid rgba(147, 51, 234, 0.3);
          cursor: help;
        }

        /* Google Docs Bottom Status Bar */
        .google-docs-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1.2rem;
          background: rgba(15, 23, 42, 0.9);
          border-top: 1px solid var(--border-light);
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .status-stats-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-stat-item strong {
          color: var(--text-primary);
        }

        .status-stat-separator {
          color: rgba(255, 255, 255, 0.2);
        }

        .status-progress-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .progress-mini-label {
          font-size: 0.72rem;
        }

        .progress-mini-bar {
          width: 120px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-mini-fill {
          height: 100%;
          background: linear-gradient(90deg, #9333ea, #3b82f6);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .status-modes-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .mode-badge {
          font-size: 0.7rem;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .mode-badge.read-only {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.4);
        }

        .mode-badge.locked {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }

        .btn-mode-toggle {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          border-radius: 4px;
          padding: 0.2rem 0.5rem;
          font-size: 0.72rem;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-mode-toggle:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        /* Action Toolbar Buttons */
        .btn-action-tool {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          border: 1px solid var(--border-light);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-action-tool:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .btn-action-tool.active {
          background: rgba(147, 51, 234, 0.2);
          border-color: rgba(147, 51, 234, 0.5);
          color: #c084fc;
        }

        .btn-action-tool.primary {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(79, 70, 229, 0.3));
          border-color: rgba(147, 51, 234, 0.4);
          color: #e9d5ff;
        }

        .btn-action-tool.primary:hover {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.45), rgba(79, 70, 229, 0.45));
          border-color: rgba(147, 51, 234, 0.6);
        }

        /* Search & Replace Widget */
        .search-replace-widget {
          position: fixed;
          top: 80px;
          right: 340px;
          z-index: 1000;
          width: 380px;
          padding: 1rem;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(147, 51, 234, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .search-widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .search-widget-header h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .btn-close-widget {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 1rem;
          padding: 0.2rem 0.4rem;
        }

        .search-widget-inputs {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .search-input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          padding-right: 4.5rem;
          border-radius: 6px;
          border: 1px solid var(--border-light);
          background: rgba(0, 0, 0, 0.3);
          color: var(--text-primary);
          font-size: 0.85rem;
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(147, 51, 234, 0.6);
        }

        .match-count-badge {
          position: absolute;
          right: 0.5rem;
          font-size: 0.7rem;
          color: #a855f7;
          background: rgba(168, 85, 247, 0.15);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }

        .search-widget-options {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .search-option-check {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          cursor: pointer;
        }

        .search-widget-actions {
          display: flex;
          gap: 0.4rem;
          margin-top: 0.2rem;
        }

        .btn-search-nav, .btn-search-replace {
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
          border: 1px solid var(--border-light);
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-primary);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-search-replace.primary {
          background: rgba(147, 51, 234, 0.25);
          border-color: rgba(147, 51, 234, 0.5);
          color: #e9d5ff;
        }

        /* Diff Comparison Modal */
        .diff-modal-card {
          width: 90%;
          max-width: 850px;
          max-height: 85vh;
          background: rgba(15, 23, 42, 0.96);
          border: 1px solid rgba(147, 51, 234, 0.3);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        }

        .diff-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 0.8rem;
        }

        .diff-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .diff-summary-badges {
          display: flex;
          gap: 0.6rem;
        }

        .diff-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-weight: 600;
        }

        .diff-badge.added {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .diff-badge.removed {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .diff-badge.unchanged {
          background: rgba(148, 163, 184, 0.15);
          color: #cbd5e1;
        }

        .diff-content-container {
          flex: 1;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 1.2rem;
          font-family: Georgia, serif;
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--text-primary);
          white-space: pre-wrap;
          max-height: 50vh;
        }

        .diff-added-chunk {
          background: rgba(34, 197, 94, 0.25);
          color: #86efac;
          padding: 0.1rem 0.2rem;
          border-radius: 3px;
          text-decoration: none;
        }

        .diff-removed-chunk {
          background: rgba(239, 68, 68, 0.25);
          color: #fca5a5;
          padding: 0.1rem 0.2rem;
          border-radius: 3px;
          text-decoration: line-through;
        }

        .diff-unchanged-chunk {
          color: #cbd5e1;
        }

        /* Export & Import Modals */
        .export-modal-card, .import-modal-card {
          width: 90%;
          max-width: 620px;
          background: rgba(15, 23, 42, 0.96);
          border: 1px solid rgba(147, 51, 234, 0.3);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .export-format-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .format-card {
          padding: 0.8rem;
          border-radius: 8px;
          border: 1px solid var(--border-light);
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          transition: all 0.15s ease;
        }

        .format-card:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .format-card.active {
          border-color: rgba(147, 51, 234, 0.6);
          background: rgba(147, 51, 234, 0.15);
        }

        .format-card strong {
          font-size: 0.85rem;
          color: var(--text-primary);
        }

        .format-card span {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .file-dropzone {
          margin-top: 0.5rem;
          border: 2px dashed rgba(147, 51, 234, 0.4);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          background: rgba(147, 51, 234, 0.05);
          transition: all 0.2s ease;
        }

        .file-dropzone:hover {
          background: rgba(147, 51, 234, 0.1);
          border-color: rgba(147, 51, 234, 0.7);
        }

        .file-input-hidden {
          display: none;
        }

        .file-dropzone-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
        }

        .dropzone-icon {
          font-size: 2.2rem;
        }

        /* Snapshot and Version Actions */
        .snapshot-actions-bar {
          margin-bottom: 0.8rem;
        }

        .custom-snapshot-input-row {
          display: flex;
          gap: 0.35rem;
          width: 100%;
        }

        .custom-tag-input {
          flex: 1;
          padding: 0.35rem 0.5rem;
          font-size: 0.78rem;
          border-radius: 6px;
          border: 1px solid var(--border-light);
          background: rgba(0, 0, 0, 0.3);
          color: var(--text-primary);
        }

        .btn-save-tag, .btn-cancel-tag {
          padding: 0.35rem 0.6rem;
          font-size: 0.75rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }

        .btn-save-tag {
          background: #9333ea;
          color: #fff;
        }

        .btn-cancel-tag {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
        }

        .version-card-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .btn-diff-version {
          padding: 0.3rem 0.6rem;
          font-size: 0.72rem;
          border-radius: 4px;
          border: 1px solid rgba(147, 51, 234, 0.3);
          background: rgba(147, 51, 234, 0.12);
          color: #c084fc;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-diff-version:hover {
          background: rgba(147, 51, 234, 0.25);
        }

        .editor-side-panel {
          width: 300px;
          border-right: 1px solid var(--border-light);
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
