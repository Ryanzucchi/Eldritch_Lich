'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../db/schema';
import { useApp } from '../../context/AppContext';
import { Manuscript, MetaNode } from '@eldritch/domain';

type PeriodType = 'week' | 'month' | 'year';

interface CategoryShare {
  name: string;
  count: number;
  color: string;
  percentage: number;
}

interface GoalTypeShare {
  name: string;
  count: number;
  color: string;
  percentage: number;
}

interface ChartPoint {
  label: string;
  value: number;
}

interface CollaboratorOption {
  id: string;
  name: string;
}

interface CollaboratorStats {
  totalWords: number;
  wordsByPeriod: ChartPoint[];
  topHours: { hour: number; words: number }[];
  topChapters: { title: string; words: number }[];
  privacyHidden: boolean;
}

interface TeamGoalConfig {
  id: string;
  name: string;
  targetPerMember: number;
  deadline: string;
  rankingEnabled: boolean;
  createdAt: string;
}

type ManuscriptVersionRow = {
  id: string;
  manuscriptId: string;
  versionNumber: number;
  title: string;
  content: string;
  createdAt: string;
  author?: string;
};

export default function StatisticsPage() {
  const { activeProject, user } = useApp();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodType>('week');

  // Aggregates
  const [totalWords, setTotalWords] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [folderCount, setFolderCount] = useState(0);
  const [chapterCount, setChapterCount] = useState(0);
  const [avgWords, setAvgWords] = useState(0);
  const [readingTime, setReadingTime] = useState('');

  // Charts data
  const [writingProgressData, setWritingProgressData] = useState<ChartPoint[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryShare[]>([]);
  const [goalDistribution, setGoalDistribution] = useState<GoalTypeShare[]>([]);

  // Selected hover state for progress chart
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; value: number; x: number; y: number } | null>(null);
  const [collaboratorOptions, setCollaboratorOptions] = useState<CollaboratorOption[]>([]);
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string>('');
  const [collaboratorStats, setCollaboratorStats] = useState<CollaboratorStats>({
    totalWords: 0,
    wordsByPeriod: [],
    topHours: [],
    topChapters: [],
    privacyHidden: false
  });
  const [teamContributions, setTeamContributions] = useState<{ id: string; name: string; words: number }[]>([]);
  const [teamGoal, setTeamGoal] = useState<TeamGoalConfig | null>(null);
  const [showTeamGoalForm, setShowTeamGoalForm] = useState(false);
  const [teamGoalName, setTeamGoalName] = useState('');
  const [teamGoalTargetPerMember, setTeamGoalTargetPerMember] = useState(3000);
  const [teamGoalDeadline, setTeamGoalDeadline] = useState('');
  const [teamGoalRanking, setTeamGoalRanking] = useState(true);
  const [teamGoalError, setTeamGoalError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeProject) return;
    loadStats();
  }, [activeProject, period, selectedCollaboratorId]);

  useEffect(() => {
    if (!activeProject) return;
    const raw = localStorage.getItem(`project_team_goal_${activeProject.id}`);
    if (!raw) {
      setTeamGoal(null);
      return;
    }
    try {
      setTeamGoal(JSON.parse(raw));
    } catch (err) {
      console.error('Falha ao carregar meta coletiva do projeto:', err);
      setTeamGoal(null);
    }
  }, [activeProject]);

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const countWords = (text: string) => (text ? text.split(/\s+/).filter(w => w.length > 0).length : 0);

  const formatCollaboratorName = (idOrEmail: string) => {
    if (idOrEmail === 'voce' || idOrEmail === 'você') return 'Você';
    const left = idOrEmail.includes('@') ? idOrEmail.split('@')[0] : idOrEmail;
    return left
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const normalizeAuthorId = (author?: string) => {
    if (!author) return 'voce';
    const raw = author.toLowerCase().trim();
    if (raw === 'você' || raw === 'voce') return 'voce';
    return raw;
  };

  const buildPeriodSeriesFromDailyMap = (wordsByDay: Map<string, number>): ChartPoint[] => {
    const points: ChartPoint[] = [];
    const today = new Date();

    if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        points.push({
          label: d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' }),
          value: wordsByDay.get(dateStr) || 0
        });
      }
    } else if (period === 'month') {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        points.push({
          label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          value: wordsByDay.get(dateStr) || 0
        });
      }
    } else {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const y = d.getFullYear();
        const m = d.getMonth();
        let monthSum = 0;
        wordsByDay.forEach((value, dateKey) => {
          const date = new Date(`${dateKey}T00:00:00`);
          if (date.getFullYear() === y && date.getMonth() === m) {
            monthSum += value;
          }
        });
        points.push({
          label: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
          value: monthSum
        });
      }
    }
    return points;
  };

  const handleCreateTeamGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;
    if (activeProject.visibility === 'PRIVADO' || collaboratorOptions.length <= 1) {
      setTeamGoalError('Sem colaboradores ativos: crie uma meta individual no editor.');
      return;
    }
    if (!teamGoalName.trim() || teamGoalTargetPerMember <= 0 || !teamGoalDeadline) {
      setTeamGoalError('Preencha nome, contribuição por membro e data limite.');
      return;
    }

    const newGoal: TeamGoalConfig = {
      id: crypto.randomUUID(),
      name: teamGoalName.trim(),
      targetPerMember: Math.round(teamGoalTargetPerMember),
      deadline: teamGoalDeadline,
      rankingEnabled: teamGoalRanking,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(`project_team_goal_${activeProject.id}`, JSON.stringify(newGoal));
    setTeamGoal(newGoal);
    setTeamGoalError(null);
    setShowTeamGoalForm(false);
    setTeamGoalName('');
  };

  const loadStats = async () => {
    const project = activeProject;
    if (!project) return;
    setLoading(true);
    try {
      // 1. Fetch data from DB
      const manuscripts = await db.manuscripts.toArray();
      const folders = await db.folders.toArray();
      const metaNodes = await db.metaNodes.toArray();
      const writingLogs = await db.writingLogs.toArray();
      const manuscriptVersions = await db.manuscriptVersions.toArray() as unknown as ManuscriptVersionRow[];

      // Filter by active project just in case (IndexedDB is already sandboxed by activeProjectId, but good practice)
      const activeManuscripts = manuscripts.filter(m => !m.inTrash);
      
      // Calculate aggregates
      let wordSum = 0;
      let charSum = 0;
      activeManuscripts.forEach(m => {
        const text = m.content ? m.content.replace(/<[^>]*>/g, '').trim() : '';
        const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
        wordSum += words;
        charSum += text.length;
      });

      setTotalWords(wordSum);
      setTotalChars(charSum);
      setFolderCount(folders.length);
      setChapterCount(activeManuscripts.length);
      setAvgWords(activeManuscripts.length > 0 ? Math.round(wordSum / activeManuscripts.length) : 0);

      // Estimate Reading Time (avg 200 words per minute)
      const minutes = Math.ceil(wordSum / 200);
      if (minutes < 60) {
        setReadingTime(`${minutes} min`);
      } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        setReadingTime(`${hours}h ${remainingMinutes}m`);
      }

      // 2. Generate Writing Progress (Line Chart)
      const progressPoints: ChartPoint[] = [];
      const today = new Date();

      if (period === 'week') {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const log = writingLogs.find(l => l.id === dateStr);
          
          const label = d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' });
          progressPoints.push({
            label,
            value: log ? log.wordsWritten : 0
          });
        }
      } else if (period === 'month') {
        // Last 30 days
        for (let i = 29; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const log = writingLogs.find(l => l.id === dateStr);
          
          const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
          progressPoints.push({
            label,
            value: log ? log.wordsWritten : 0
          });
        }
      } else if (period === 'year') {
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const year = d.getFullYear();
          const month = d.getMonth(); // 0-indexed
          
          // Sum up all logs in this month
          const monthLogs = writingLogs.filter(l => {
            const logDate = new Date(l.date);
            return logDate.getFullYear() === year && logDate.getMonth() === month;
          });
          const monthSum = monthLogs.reduce((sum, l) => sum + l.wordsWritten, 0);
          
          const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
          progressPoints.push({
            label,
            value: monthSum
          });
        }
      }
      setWritingProgressData(progressPoints);

      // 3. Generate Category Distribution (Donut Chart 1)
      const categoriesMap: Record<string, number> = {};
      activeManuscripts.forEach(m => {
        const cat = m.category || 'Sem Categoria';
        categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
      });

      // Get colors from seeder
      const activeProjId = project.id;
      const storedCategories = localStorage.getItem(`project_categories_${activeProjId}`);
      const categoryColorMapping: Record<string, string> = {};
      if (storedCategories) {
        JSON.parse(storedCategories).forEach((c: { name: string; color: string }) => {
          categoryColorMapping[c.name] = c.color;
        });
      }

      const totalChapters = activeManuscripts.length;
      const catDistribution: CategoryShare[] = Object.entries(categoriesMap).map(([name, count]) => ({
        name,
        count,
        color: categoryColorMapping[name] || '#64748b',
        percentage: totalChapters > 0 ? Math.round((count / totalChapters) * 100) : 0
      })).sort((a, b) => b.count - a.count);

      setCategoryDistribution(catDistribution);

      // 4. Generate GMN Goals Distribution (Donut Chart 2)
      const goalsMap: Record<string, number> = {
        'Exposição': 0,
        'Personagem': 0,
        'Conflito': 0
      };
      metaNodes.forEach(n => {
        // Map types correctly to legend names
        const typeName = n.type === 'Exposicao' ? 'Exposição' : n.type;
        goalsMap[typeName] = (goalsMap[typeName] || 0) + 1;
      });

      const goalColors: Record<string, string> = {
        'Exposição': '#10b981', // green
        'Personagem': '#3b82f6', // blue
        'Conflito': '#ef4444' // red
      };

      const totalGoals = metaNodes.length;
      const goalTypeDistribution: GoalTypeShare[] = Object.entries(goalsMap).map(([name, count]) => ({
        name,
        count,
        color: goalColors[name] || '#64748b',
        percentage: totalGoals > 0 ? Math.round((count / totalGoals) * 100) : 0
      }));

      setGoalDistribution(goalTypeDistribution);

      // 5. UC-201 - Estatísticas de produtividade por colaborador
      const optionsMap = new Map<string, CollaboratorOption>();
      optionsMap.set('voce', { id: 'voce', name: 'Você' });

      if (project.visibility === 'COMPARTILHADO') {
        try {
          const res = await fetch(`/api/projects/share?projectId=${project.id}`);
          if (res.ok) {
            const data = await res.json();
            const collaborators = Array.isArray(data.collaborators) ? data.collaborators : [];
            collaborators.forEach((c: { userEmail: string; status: string }) => {
              if (c.status === 'ACEITO' && c.userEmail) {
                const id = c.userEmail.toLowerCase();
                optionsMap.set(id, { id, name: formatCollaboratorName(id) });
              }
            });
          }
        } catch (err) {
          console.error('Falha ao buscar colaboradores para métricas:', err);
        }
      }

      manuscriptVersions.forEach(v => {
        const authorId = normalizeAuthorId(v.author);
        if (!optionsMap.has(authorId)) {
          optionsMap.set(authorId, { id: authorId, name: formatCollaboratorName(authorId) });
        }
      });

      const options = project.visibility === 'PRIVADO'
        ? [{ id: 'voce', name: 'Você' }]
        : Array.from(optionsMap.values());
      setCollaboratorOptions(options);

      const effectiveSelected =
        options.find(o => o.id === selectedCollaboratorId)?.id ||
        options[0]?.id ||
        'voce';
      if (effectiveSelected !== selectedCollaboratorId) {
        setSelectedCollaboratorId(effectiveSelected);
      }

      const wordsByDay = new Map<string, number>();
      const wordsByHour = new Map<number, number>();
      const chapterWords = new Map<string, number>();
      let totalWordsByCollaborator = 0;
      const wordsByCollaborator = new Map<string, number>();

      const versionsByManuscript = new Map<string, ManuscriptVersionRow[]>();
      manuscriptVersions.forEach(v => {
        if (!versionsByManuscript.has(v.manuscriptId)) versionsByManuscript.set(v.manuscriptId, []);
        versionsByManuscript.get(v.manuscriptId)!.push(v);
      });

      versionsByManuscript.forEach((versions, manuscriptId) => {
        versions.sort((a, b) => a.versionNumber - b.versionNumber);
        let prevWords = 0;
        versions.forEach(ver => {
          const currentWords = countWords(stripHtml(ver.content || ''));
          const delta = Math.max(0, currentWords - prevWords);
          prevWords = currentWords;

          const authorId = normalizeAuthorId(ver.author);
          wordsByCollaborator.set(authorId, (wordsByCollaborator.get(authorId) || 0) + delta);
          if (authorId !== effectiveSelected || delta === 0) return;

          totalWordsByCollaborator += delta;

          const dayKey = (ver.createdAt || '').slice(0, 10);
          wordsByDay.set(dayKey, (wordsByDay.get(dayKey) || 0) + delta);

          const hour = new Date(ver.createdAt).getHours();
          wordsByHour.set(hour, (wordsByHour.get(hour) || 0) + delta);

          const chapterTitle =
            activeManuscripts.find(m => m.id === manuscriptId)?.title ||
            ver.title ||
            'Capítulo sem título';
          chapterWords.set(chapterTitle, (chapterWords.get(chapterTitle) || 0) + delta);
        });
      });

      const privacyMapRaw = localStorage.getItem(`project_productivity_privacy_${project.id}`);
      let privacyMap: Record<string, boolean> = {};
      if (privacyMapRaw) {
        try {
          privacyMap = JSON.parse(privacyMapRaw);
        } catch (err) {
          console.error('Falha ao ler preferências de privacidade de produtividade:', err);
        }
      }
      const privacyHidden = !!privacyMap[effectiveSelected];

      const topHours = Array.from(wordsByHour.entries())
        .map(([hour, words]) => ({ hour, words }))
        .sort((a, b) => b.words - a.words)
        .slice(0, 3);

      const topChapters = Array.from(chapterWords.entries())
        .map(([title, words]) => ({ title, words }))
        .sort((a, b) => b.words - a.words)
        .slice(0, 5);

      setCollaboratorStats({
        totalWords: totalWordsByCollaborator,
        wordsByPeriod: privacyHidden ? [] : buildPeriodSeriesFromDailyMap(wordsByDay),
        topHours: privacyHidden ? [] : topHours,
        topChapters: privacyHidden ? [] : topChapters,
        privacyHidden
      });

      const contributions = Array.from(wordsByCollaborator.entries())
        .map(([id, words]) => ({
          id,
          name: options.find(c => c.id === id)?.name || formatCollaboratorName(id),
          words
        }))
        .sort((a, b) => b.words - a.words);
      setTeamContributions(contributions);

    } catch (err) {
      console.error('Error generating statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!activeProject) {
    return (
      <div className="stats-container-empty glass">
        <h2>Selecione um projeto para visualizar as estatísticas.</h2>
      </div>
    );
  }

  // Draw Line Chart helpers
  const svgWidth = 680;
  const svgHeight = 280;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const maxVal = writingProgressData.length > 0 ? Math.max(...writingProgressData.map(p => p.value)) : 0;
  const chartMax = maxVal > 0 ? Math.ceil(maxVal * 1.1) : 100; // 10% breathing room at the top

  const progressPointsCoords = writingProgressData.map((pt, idx) => {
    const x = paddingX + (idx / (writingProgressData.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - (pt.value / chartMax) * chartHeight;
    return { x, y, label: pt.label, value: pt.value };
  });

  const linePath = progressPointsCoords.length > 0
    ? `M ${progressPointsCoords[0].x} ${progressPointsCoords[0].y} ` +
      progressPointsCoords.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaPath = progressPointsCoords.length > 0
    ? `${linePath} L ${progressPointsCoords[progressPointsCoords.length - 1].x} ${paddingY + chartHeight} L ${progressPointsCoords[0].x} ${paddingY + chartHeight} Z`
    : '';

  const exportStatisticsAsCsv = () => {
    if (!activeProject || chapterCount === 0) return;
    const selectedCollabName = collaboratorOptions.find(c => c.id === (selectedCollaboratorId || 'voce'))?.name || 'Você';

    const rows: string[][] = [
      ['Métrica', 'Valor'],
      ['Projeto', activeProject.name],
      ['Período', period],
      ['Palavras Totais', String(totalWords)],
      ['Caracteres Totais', String(totalChars)],
      ['Pastas', String(folderCount)],
      ['Capítulos', String(chapterCount)],
      ['Média por Capítulo', String(avgWords)],
      ['Tempo de Leitura Estimado', readingTime],
      [],
      ['Produtividade do Colaborador', selectedCollabName],
      ['Palavras adicionadas', String(collaboratorStats.totalWords)],
      [],
      ['Série temporal', 'Palavras']
    ];

    collaboratorStats.wordsByPeriod.forEach(point => {
      rows.push([point.label, String(point.value)]);
    });

    rows.push([], ['Capítulos com maior contribuição', 'Palavras']);
    collaboratorStats.topChapters.forEach(item => {
      rows.push([item.title, String(item.words)]);
    });

    const csvContent = rows.map(row => row.map(col => `"${String(col || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estatisticas_${activeProject.name.replace(/\s+/g, '_').toLowerCase()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportStatisticsAsPdf = () => {
    if (!activeProject || chapterCount === 0) return;
    const selectedCollabName = collaboratorOptions.find(c => c.id === (selectedCollaboratorId || 'voce'))?.name || 'Você';
    const progressRows = collaboratorStats.wordsByPeriod
      .map(p => `<tr><td>${p.label}</td><td>${p.value.toLocaleString('pt-BR')}</td></tr>`)
      .join('');
    const chapterRows = collaboratorStats.topChapters
      .map(c => `<tr><td>${c.title}</td><td>${c.words.toLocaleString('pt-BR')}</td></tr>`)
      .join('');

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Relatório Estatístico - ${activeProject.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 28px; color: #0f172a; }
            h1 { margin: 0 0 8px; font-size: 22px; }
            h2 { margin: 24px 0 10px; font-size: 16px; }
            p { margin: 2px 0; font-size: 12px; color: #334155; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 12px; text-align: left; }
            th { background: #f1f5f9; }
          </style>
        </head>
        <body>
          <h1>Relatório Estatístico do Projeto</h1>
          <p><strong>Projeto:</strong> ${activeProject.name}</p>
          <p><strong>Período:</strong> ${period}</p>
          <p><strong>Gerado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>

          <h2>Resumo Consolidado</h2>
          <table>
            <tr><th>Métrica</th><th>Valor</th></tr>
            <tr><td>Palavras Totais</td><td>${totalWords.toLocaleString('pt-BR')}</td></tr>
            <tr><td>Caracteres Totais</td><td>${totalChars.toLocaleString('pt-BR')}</td></tr>
            <tr><td>Pastas</td><td>${folderCount}</td></tr>
            <tr><td>Capítulos</td><td>${chapterCount}</td></tr>
            <tr><td>Média por Capítulo</td><td>${avgWords.toLocaleString('pt-BR')}</td></tr>
            <tr><td>Tempo de Leitura</td><td>${readingTime}</td></tr>
          </table>

          <h2>Produtividade do Colaborador (${selectedCollabName})</h2>
          <table>
            <tr><th>Indicador</th><th>Valor</th></tr>
            <tr><td>Palavras adicionadas</td><td>${collaboratorStats.totalWords.toLocaleString('pt-BR')}</td></tr>
          </table>

          <h2>Palavras por período</h2>
          <table>
            <tr><th>Data</th><th>Palavras</th></tr>
            ${progressRows || '<tr><td colspan="2">Sem dados para o período selecionado.</td></tr>'}
          </table>

          <h2>Capítulos com maior contribuição</h2>
          <table>
            <tr><th>Capítulo</th><th>Palavras</th></tr>
            ${chapterRows || '<tr><td colspan="2">Sem contribuições registradas.</td></tr>'}
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 400);
  };

  // Draw Donut Chart helper
  const drawDonut = (shares: (CategoryShare | GoalTypeShare)[]) => {
    const radius = 50;
    const strokeWidth = 14;
    const circ = 2 * Math.PI * radius;
    const center = 60;
    
    let accumulatedAngle = 0;
    
    if (shares.length === 0 || shares.every(s => s.count === 0)) {
      return (
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
      );
    }

    return shares.map((slice, idx) => {
      const percentage = slice.percentage;
      if (percentage <= 0) return null;
      
      const strokeLength = (percentage / 100) * circ;
      const strokeOffset = circ - strokeLength;
      const rotation = (accumulatedAngle / 100) * 360;
      
      accumulatedAngle += percentage;
      
      return (
        <circle
          key={idx}
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={slice.color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={strokeOffset}
          transform={`rotate(${rotation - 90} ${center} ${center})`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      );
    });
  };

  return (
    <div className="stats-dashboard-page animate-fade-in">
      {/* Period Selection Controls */}
      <div className="stats-controls-row">
        <h3>Estatísticas de Redação</h3>
        <div className="stats-controls-actions">
          <div className="period-tabs glass">
            <button 
              className={`period-btn ${period === 'week' ? 'active' : ''}`}
              onClick={() => setPeriod('week')}
            >
              Semana
            </button>
            <button 
              className={`period-btn ${period === 'month' ? 'active' : ''}`}
              onClick={() => setPeriod('month')}
            >
              Mês
            </button>
            <button 
              className={`period-btn ${period === 'year' ? 'active' : ''}`}
              onClick={() => setPeriod('year')}
            >
              Ano
            </button>
          </div>

          <div className="export-actions">
            <button className="export-btn" onClick={exportStatisticsAsCsv} disabled={chapterCount === 0}>
              Exportar CSV
            </button>
            <button className="export-btn export-btn-pdf" onClick={exportStatisticsAsPdf} disabled={chapterCount === 0}>
              Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="stats-loading glass">
          <div className="loading-spinner"></div>
          <p>Calculando métricas do projeto...</p>
        </div>
      ) : chapterCount === 0 ? (
        <div className="stats-empty-state glass">
          <span className="empty-icon">📈</span>
          <h3>Nenhuma estatística disponível ainda</h3>
          <p>Seu projeto está sem capítulos. Comece a criar e escrever no editor de manuscrito para popular os gráficos de progresso.</p>
        </div>
      ) : (
        <div className="stats-grid">
          {/* Column 1: Stat Cards Grid */}
          <div className="stats-cards-wrapper">
            <div className="stat-card glass">
              <span className="card-icon">🖋️</span>
              <div className="card-content">
                <span className="card-label">Palavras Escritas</span>
                <span className="card-value">{totalWords.toLocaleString()}</span>
              </div>
            </div>

            <div className="stat-card glass">
              <span className="card-icon">🔤</span>
              <div className="card-content">
                <span className="card-label">Caracteres Totais</span>
                <span className="card-value">{totalChars.toLocaleString()}</span>
              </div>
            </div>

            <div className="stat-card glass">
              <span className="card-icon">📁</span>
              <div className="card-content">
                <span className="card-label">Estrutura de Pastas</span>
                <span className="card-value">{folderCount} pastas</span>
              </div>
            </div>

            <div className="stat-card glass">
              <span className="card-icon">📄</span>
              <div className="card-content">
                <span className="card-label">Capítulos / Textos</span>
                <span className="card-value">{chapterCount} arquivos</span>
              </div>
            </div>

            <div className="stat-card glass">
              <span className="card-icon">📊</span>
              <div className="card-content">
                <span className="card-label">Média por Capítulo</span>
                <span className="card-value">{avgWords.toLocaleString()} pal.</span>
              </div>
            </div>

            <div className="stat-card glass">
              <span className="card-icon">⏱️</span>
              <div className="card-content">
                <span className="card-label">Tempo de Leitura</span>
                <span className="card-value">{readingTime}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Progress Line Chart */}
          <div className="chart-card glass progress-chart-card">
            <div className="chart-header">
              <h4>Atividade de Escrita (Palavras por período)</h4>
              <span className="chart-meta">Meta Diária ativa</span>
            </div>

            <div className="chart-svg-container">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="progress-svg">
                <defs>
                  <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y Axis Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const yVal = paddingY + chartHeight * ratio;
                  const labelValue = Math.round(chartMax * (1 - ratio));
                  return (
                    <g key={i} className="chart-grid-line">
                      <line x1={paddingX} y1={yVal} x2={svgWidth - paddingX} y2={yVal} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                      <text x={paddingX - 10} y={yVal + 4} textAnchor="end" className="chart-axis-label">{labelValue}</text>
                    </g>
                  );
                })}

                {/* Gradient area under the line */}
                {areaPath && <path d={areaPath} fill="url(#chart-area-grad)" />}

                {/* Neon progress line */}
                {linePath && (
                  <path 
                    d={linePath} 
                    fill="none" 
                    stroke="#14b8a6" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="chart-stroke-line"
                  />
                )}

                {/* Interactive circular points */}
                {progressPointsCoords.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.label === p.label ? "6.5" : "4.5"}
                    fill="#14b8a6"
                    stroke={hoveredPoint?.label === p.label ? "#ffffff" : "rgba(15,23,42,0.9)"}
                    strokeWidth="2"
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onMouseEnter={() => setHoveredPoint({ label: p.label, value: p.value, x: p.x, y: p.y })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* X Axis Labels */}
                {progressPointsCoords.filter((_, i) => {
                  if (period === 'month') return i % 5 === 0; // Show every 5 labels for month
                  return true;
                }).map((p, idx) => (
                  <text
                    key={idx}
                    x={p.x}
                    y={svgHeight - 8}
                    textAnchor="middle"
                    className="chart-axis-label"
                  >
                    {p.label}
                  </text>
                ))}
              </svg>

              {/* Tooltip Overlay */}
              {hoveredPoint && (
                <div 
                  className="chart-tooltip glass animate-fade-in"
                  style={{
                    position: 'absolute',
                    left: `${hoveredPoint.x}px`,
                    top: `${hoveredPoint.y - 45}px`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <span className="tooltip-value">{hoveredPoint.value.toLocaleString()} palavras</span>
                  <span className="tooltip-date">{hoveredPoint.label}</span>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Two Donut distribution charts */}
          <div className="donut-charts-row">
            {/* Category distribution */}
            <div className="donut-chart-card glass">
              <h4>Distribuição por Categoria</h4>
              <p className="donut-subtitle">Organização temática dos capítulos</p>
              
              <div className="donut-wrapper">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {drawDonut(categoryDistribution)}
                </svg>
                
                <div className="donut-legend">
                  {categoryDistribution.map((item, idx) => (
                    <div key={idx} className="legend-item">
                      <span className="legend-dot" style={{ backgroundColor: item.color }} />
                      <span className="legend-name">{item.name}</span>
                      <span className="legend-percent">{item.percentage}% ({item.count})</span>
                    </div>
                  ))}
                  {categoryDistribution.length === 0 && (
                    <div className="legend-empty">Defina categorias nos capítulos do manuscrito.</div>
                  )}
                </div>
              </div>
            </div>

            {/* GMN Goals distribution */}
            <div className="donut-chart-card glass">
              <h4>Metas Narrativas (GMN)</h4>
              <p className="donut-subtitle">Tipos de pontos dramáticos cadastrados</p>
              
              <div className="donut-wrapper">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {drawDonut(goalDistribution)}
                </svg>
                
                <div className="donut-legend">
                  {goalDistribution.map((item, idx) => (
                    <div key={idx} className="legend-item">
                      <span className="legend-dot" style={{ backgroundColor: item.color }} />
                      <span className="legend-name">{item.name}</span>
                      <span className="legend-percent">{item.percentage}% ({item.count})</span>
                    </div>
                  ))}
                  {goalDistribution.every(g => g.count === 0) && (
                    <div className="legend-empty">Cadastre metas causais no painel do Grafo de Metas.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* UC-201: produtividade por colaborador */}
          <div className="collaborator-card glass">
            <div className="collaborator-card-header">
              <div>
                <h4>Métricas dos Colaboradores</h4>
                <p>Produtividade individual com base no histórico de versões do manuscrito.</p>
              </div>

              <div className="collaborator-picker">
                <label htmlFor="collab-picker">Colaborador</label>
                <select
                  id="collab-picker"
                  value={selectedCollaboratorId}
                  onChange={(e) => setSelectedCollaboratorId(e.target.value)}
                  disabled={activeProject.visibility === 'PRIVADO'}
                >
                  {collaboratorOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="collaborator-summary-row">
              <div className="mini-stat">
                <span>Palavras adicionadas</span>
                <strong>{collaboratorStats.totalWords.toLocaleString('pt-BR')}</strong>
              </div>
              <div className="mini-stat">
                <span>Pico de atividade</span>
                <strong>{collaboratorStats.topHours[0] ? `${collaboratorStats.topHours[0].hour.toString().padStart(2, '0')}h` : '—'}</strong>
              </div>
              <div className="mini-stat">
                <span>Capítulo líder</span>
                <strong>{collaboratorStats.topChapters[0]?.title || '—'}</strong>
              </div>
            </div>

            {collaboratorStats.privacyHidden ? (
              <div className="privacy-note">
                Este colaborador ocultou dados comportamentais detalhados. Apenas contagens gerais ficam disponíveis.
              </div>
            ) : (
              <div className="collaborator-details-grid">
                <div className="collaborator-subcard">
                  <h5>Palavras por período</h5>
                  <ul>
                    {collaboratorStats.wordsByPeriod.slice(-7).map((point, idx) => (
                      <li key={`${point.label}-${idx}`}>
                        <span>{point.label}</span>
                        <strong>{point.value.toLocaleString('pt-BR')}</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="collaborator-subcard">
                  <h5>Horários de maior atividade</h5>
                  <ul>
                    {collaboratorStats.topHours.map((item) => (
                      <li key={item.hour}>
                        <span>{item.hour.toString().padStart(2, '0')}:00</span>
                        <strong>{item.words.toLocaleString('pt-BR')} palavras</strong>
                      </li>
                    ))}
                    {collaboratorStats.topHours.length === 0 && <li><span>Sem atividade registrada</span></li>}
                  </ul>
                </div>

                <div className="collaborator-subcard">
                  <h5>Capítulos com maior contribuição</h5>
                  <ul>
                    {collaboratorStats.topChapters.map((item, idx) => (
                      <li key={`${item.title}-${idx}`}>
                        <span>{item.title}</span>
                        <strong>{item.words.toLocaleString('pt-BR')} palavras</strong>
                      </li>
                    ))}
                    {collaboratorStats.topChapters.length === 0 && <li><span>Sem contribuição registrada</span></li>}
                  </ul>
                </div>

                {/* UC-203 / UC-204: metas coletivas */}
                <div className="team-goal-card glass">
                  <div className="team-goal-header">
                    <div>
                      <h4>Meta Coletiva da Equipe</h4>
                      <p>Defina contribuição alvo por membro e acompanhe progresso consolidado.</p>
                    </div>
                    <button
                      className="team-goal-toggle-btn"
                      onClick={() => {
                        setShowTeamGoalForm(!showTeamGoalForm);
                        setTeamGoalError(null);
                      }}
                    >
                      {teamGoal ? 'Editar Meta Coletiva' : 'Nova Meta de Equipe'}
                    </button>
                  </div>

                  {showTeamGoalForm && (
                    <form className="team-goal-form" onSubmit={handleCreateTeamGoal}>
                      <div className="team-goal-fields">
                        <label>
                          Nome da Meta
                          <input
                            type="text"
                            value={teamGoalName}
                            onChange={(e) => setTeamGoalName(e.target.value)}
                            placeholder="Ex: Sprint Capítulos do Ato II"
                          />
                        </label>
                        <label>
                          Contribuição alvo por membro (palavras)
                          <input
                            type="number"
                            min={1}
                            value={teamGoalTargetPerMember}
                            onChange={(e) => setTeamGoalTargetPerMember(Number(e.target.value))}
                          />
                        </label>
                        <label>
                          Data limite
                          <input
                            type="date"
                            value={teamGoalDeadline}
                            onChange={(e) => setTeamGoalDeadline(e.target.value)}
                          />
                        </label>
                        <label className="team-goal-checkbox">
                          <input
                            type="checkbox"
                            checked={teamGoalRanking}
                            onChange={(e) => setTeamGoalRanking(e.target.checked)}
                          />
                          Exibir ranking (leaderboard)
                        </label>
                      </div>
                      {teamGoalError && <div className="team-goal-error">{teamGoalError}</div>}
                      <div className="team-goal-actions">
                        <button type="submit" className="team-goal-save-btn">Salvar Meta Coletiva</button>
                      </div>
                    </form>
                  )}

                  {teamGoal && (
                    <div className="team-goal-progress">
                      {(() => {
                        const eligibleMembers = collaboratorOptions.length > 1
                          ? collaboratorOptions.filter(c => c.id !== 'voce')
                          : collaboratorOptions;
                        const participantIds = new Set(eligibleMembers.map(m => m.id));
                        const teamTotal = teamContributions
                          .filter(c => participantIds.has(c.id))
                          .reduce((sum, c) => sum + c.words, 0);
                        const targetTotal = Math.max(1, teamGoal.targetPerMember * Math.max(1, eligibleMembers.length));
                        const percent = Math.min(100, Math.round((teamTotal / targetTotal) * 100));
                        const nearing = percent >= 90;

                        return (
                          <>
                            <div className="team-goal-summary">
                              <h5>{teamGoal.name}</h5>
                              <p>
                                Prazo: <strong>{new Date(teamGoal.deadline).toLocaleDateString('pt-BR')}</strong> •
                                Alvo total: <strong>{targetTotal.toLocaleString('pt-BR')}</strong> palavras
                              </p>
                            </div>
                            <div className="team-goal-bar-wrap">
                              <div className="team-goal-bar">
                                <div className="team-goal-fill" style={{ width: `${percent}%` }} />
                              </div>
                              <span>{teamTotal.toLocaleString('pt-BR')} / {targetTotal.toLocaleString('pt-BR')} ({percent}%)</span>
                            </div>
                            {nearing && <div className="team-goal-alert">Meta coletiva acima de 90%: reta final da equipe 🎯</div>}
                            {teamGoal.rankingEnabled && (
                              <div className="team-goal-ranking">
                                <h6>Ranking de contribuição</h6>
                                <ol>
                                  {teamContributions
                                    .filter(c => participantIds.has(c.id))
                                    .sort((a, b) => b.words - a.words)
                                    .map(c => (
                                      <li key={c.id}>
                                        <span>{c.name}</span>
                                        <strong>{c.words.toLocaleString('pt-BR')} palavras</strong>
                                      </li>
                                    ))}
                                </ol>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global CSS Styling for Dashboard */}
      <style jsx>{`
        .stats-dashboard-page {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
          font-family: 'Outfit', sans-serif;
          height: 100%;
          overflow-y: auto;
        }

        .stats-container-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 300px;
          margin: 2rem;
          text-align: center;
          color: var(--text-secondary);
        }

        .stats-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1rem;
        }

        .stats-controls-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .stats-controls-row h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .period-tabs {
          display: flex;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 0.2rem;
          gap: 0.15rem;
        }

        .period-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 0.4rem 0.9rem;
          font-size: 0.82rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .period-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }

        .period-btn.active {
          color: #ffffff;
          background: #14b8a6;
          box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3);
        }

        .export-actions {
          display: flex;
          gap: 0.5rem;
        }

        .export-btn {
          border: 1px solid var(--border-light);
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
          border-radius: 8px;
          padding: 0.45rem 0.8rem;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .export-btn:hover:not(:disabled) {
          border-color: rgba(20, 184, 166, 0.35);
          background: rgba(20, 184, 166, 0.1);
        }

        .export-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .export-btn-pdf {
          background: rgba(20, 184, 166, 0.13);
          border-color: rgba(20, 184, 166, 0.35);
        }

        .stats-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 5rem 2rem;
          color: var(--text-secondary);
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(20, 184, 166, 0.2);
          border-top-color: #14b8a6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .stats-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 6rem 2rem;
          text-align: center;
        }

        .empty-icon {
          font-size: 3rem;
        }

        .stats-empty-state h3 {
          font-size: 1.15rem;
          color: var(--text-primary);
          margin: 0;
        }

        .stats-empty-state p {
          font-size: 0.88rem;
          color: var(--text-muted);
          max-width: 420px;
          line-height: 1.5;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.5rem;
        }

        .stats-cards-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          align-content: start;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid var(--border-light);
          transition: transform 0.2s, border-color 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(20, 184, 166, 0.3);
        }

        .card-icon {
          font-size: 1.5rem;
          background: rgba(20, 184, 166, 0.1);
          color: #14b8a6;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .card-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-value {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .chart-card {
          border-radius: 16px;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid var(--border-light);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 320px;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chart-header h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .chart-meta {
          font-size: 0.75rem;
          font-weight: 600;
          color: #14b8a6;
          background: rgba(20, 184, 166, 0.15);
          padding: 0.18rem 0.5rem;
          border-radius: 6px;
        }

        .chart-svg-container {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .progress-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .chart-axis-label {
          font-size: 10px;
          font-weight: 600;
          fill: var(--text-muted);
        }

        .chart-tooltip {
          padding: 0.45rem 0.75rem;
          border-radius: 8px;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(20, 184, 166, 0.4);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
          pointer-events: none;
          z-index: 10;
          white-space: nowrap;
        }

        .tooltip-value {
          font-size: 0.8rem;
          font-weight: 800;
          color: #ffffff;
        }

        .tooltip-date {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .donut-charts-row {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .collaborator-card {
          grid-column: 1 / -1;
          border-radius: 16px;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid var(--border-light);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .collaborator-card-header {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
        }

        .collaborator-card-header h4 {
          margin: 0;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .collaborator-card-header p {
          margin: 0.25rem 0 0;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .collaborator-picker {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 190px;
        }

        .collaborator-picker label {
          font-size: 0.72rem;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.4px;
        }

        .collaborator-picker select {
          border: 1px solid var(--border-light);
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
          border-radius: 8px;
          padding: 0.45rem 0.6rem;
          font-size: 0.85rem;
        }

        .collaborator-summary-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .mini-stat {
          border: 1px solid var(--border-light);
          border-radius: 10px;
          padding: 0.75rem 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          background: rgba(15, 23, 42, 0.2);
        }

        .mini-stat span {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.4px;
          font-weight: 700;
        }

        .mini-stat strong {
          font-size: 1rem;
          color: var(--text-primary);
        }

        .privacy-note {
          border: 1px solid rgba(245, 158, 11, 0.3);
          background: rgba(245, 158, 11, 0.08);
          color: #fbbf24;
          border-radius: 10px;
          padding: 0.75rem 0.9rem;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .collaborator-details-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .collaborator-subcard {
          border: 1px solid var(--border-light);
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.2);
          padding: 0.85rem;
        }

        .collaborator-subcard h5 {
          margin: 0 0 0.5rem 0;
          font-size: 0.84rem;
          color: var(--text-primary);
        }

        .collaborator-subcard ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .collaborator-subcard li {
          display: flex;
          justify-content: space-between;
          gap: 0.6rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .collaborator-subcard li strong {
          color: var(--text-primary);
        }

        .team-goal-card {
          grid-column: 1 / -1;
          border-radius: 16px;
          border: 1px solid var(--border-light);
          background: rgba(15, 23, 42, 0.3);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .team-goal-header {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
        }

        .team-goal-header h4 {
          margin: 0;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .team-goal-header p {
          margin: 0.25rem 0 0;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .team-goal-toggle-btn,
        .team-goal-save-btn {
          border: 1px solid rgba(20, 184, 166, 0.35);
          background: rgba(20, 184, 166, 0.12);
          color: #e6fffb;
          border-radius: 8px;
          padding: 0.45rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }

        .team-goal-form {
          border: 1px dashed var(--border-light);
          border-radius: 10px;
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .team-goal-fields {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.6rem;
        }

        .team-goal-fields label {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        .team-goal-fields input {
          border: 1px solid var(--border-light);
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
          border-radius: 8px;
          padding: 0.45rem 0.55rem;
          font-size: 0.84rem;
        }

        .team-goal-checkbox {
          justify-content: flex-end;
        }

        .team-goal-checkbox input {
          width: auto;
        }

        .team-goal-error {
          border: 1px solid rgba(239, 68, 68, 0.25);
          background: rgba(239, 68, 68, 0.12);
          color: #fca5a5;
          border-radius: 8px;
          padding: 0.45rem 0.55rem;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .team-goal-actions {
          display: flex;
          justify-content: flex-end;
        }

        .team-goal-progress {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          border-top: 1px solid var(--border-light);
          padding-top: 0.8rem;
        }

        .team-goal-summary h5 {
          margin: 0;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .team-goal-summary p {
          margin: 0.25rem 0 0;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .team-goal-bar-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 700;
        }

        .team-goal-bar {
          height: 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .team-goal-fill {
          height: 100%;
          background: linear-gradient(90deg, #14b8a6 0%, #22d3ee 100%);
          transition: width 0.3s ease;
        }

        .team-goal-alert {
          border: 1px solid rgba(250, 204, 21, 0.35);
          background: rgba(250, 204, 21, 0.1);
          color: #fde68a;
          border-radius: 8px;
          padding: 0.45rem 0.55rem;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .team-goal-ranking h6 {
          margin: 0 0 0.45rem;
          font-size: 0.84rem;
          color: var(--text-primary);
        }

        .team-goal-ranking ol {
          margin: 0;
          padding-left: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .team-goal-ranking li {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .team-goal-ranking li strong {
          color: var(--text-primary);
        }

        .donut-chart-card {
          border-radius: 16px;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid var(--border-light);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .donut-chart-card h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .donut-subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin: 0 0 1rem 0;
        }

        .donut-wrapper {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          flex: 1;
        }

        .donut-legend {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem 1.5rem;
          flex: 1;
        }

        .legend-item {
          display: flex;
          flex-direction: column;
          position: relative;
          padding-left: 1rem;
        }

        .legend-dot {
          position: absolute;
          left: 0;
          top: 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .legend-percent {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .legend-empty {
          font-size: 0.8rem;
          color: var(--text-muted);
          grid-column: 1 / -1;
        }

        /* Light Theme Overrides */
        .workspace-main-wrapper:has(.main-content.theme-light) .stats-controls-row h3,
        .workspace-main-wrapper:has(.main-content.theme-light) .stat-card .card-value,
        .workspace-main-wrapper:has(.main-content.theme-light) .chart-card .chart-header h4,
        .workspace-main-wrapper:has(.main-content.theme-light) .donut-chart-card h4,
        .workspace-main-wrapper:has(.main-content.theme-light) .legend-name {
          color: #0f172a !important;
        }

        .workspace-main-wrapper:has(.main-content.theme-light) .period-tabs {
          background: rgba(15, 23, 42, 0.03) !important;
        }

        .workspace-main-wrapper:has(.main-content.theme-light) .stat-card,
        .workspace-main-wrapper:has(.main-content.theme-light) .chart-card,
        .workspace-main-wrapper:has(.main-content.theme-light) .donut-chart-card {
          background: #ffffff !important;
          border-color: rgba(15, 23, 42, 0.08) !important;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.03) !important;
        }

        .workspace-main-wrapper:has(.main-content.theme-light) .chart-tooltip {
          background: #ffffff !important;
          border-color: rgba(20, 184, 166, 0.3) !important;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08) !important;
        }

        .workspace-main-wrapper:has(.main-content.theme-light) .tooltip-value {
          color: #0f172a !important;
        }

        .workspace-main-wrapper:has(.main-content.theme-light) .chart-grid-line line {
          stroke: rgba(15, 23, 42, 0.05) !important;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-cards-wrapper {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .donut-charts-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .stats-controls-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.8rem;
          }

          .stats-controls-actions {
            justify-content: space-between;
            flex-wrap: wrap;
          }

          .stats-cards-wrapper {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .donut-wrapper {
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-start;
          }

          .collaborator-card-header,
          .collaborator-summary-row,
          .collaborator-details-grid {
            grid-template-columns: 1fr;
            display: grid;
          }

          .team-goal-fields {
            grid-template-columns: 1fr;
          }

          .team-goal-header {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
