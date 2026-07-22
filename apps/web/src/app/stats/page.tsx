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

export default function StatisticsPage() {
  const { activeProject } = useApp();
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

  useEffect(() => {
    if (!activeProject) return;
    loadStats();
  }, [activeProject, period]);

  const loadStats = async () => {
    setLoading(true);
    try {
      // 1. Fetch data from DB
      const manuscripts = await db.manuscripts.toArray();
      const folders = await db.folders.toArray();
      const metaNodes = await db.metaNodes.toArray();
      const writingLogs = await db.writingLogs.toArray();

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
      const activeProjId = activeProject?.id || 'default';
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
          .stats-cards-wrapper {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .donut-wrapper {
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
