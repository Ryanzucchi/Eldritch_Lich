'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { ObjectiveOkr, KeyResult, OkrCheckInLog, calculateKrProgress, calculateOkrObjectiveProgress, generateOkrPerformanceReport, calculateIntegratedPerformanceScore } from '@eldritch/domain';

export default function OkrDashboardPage() {
  const { activeProject } = useApp();
  const [okrs, setOkrs] = useState<ObjectiveOkr[]>([]);
  const [logs, setLogs] = useState<OkrCheckInLog[]>([]);
  const [activePeriod, setActivePeriod] = useState('Q3 2026');

  // OKR Creator States (UC-346)
  const [showOkrModal, setShowOkrModal] = useState(false);
  const [okrTitle, setOkrTitle] = useState('');
  const [okrTeam, setOkrTeam] = useState('');
  const [okrDesc, setOkrDesc] = useState('');
  const [okrKrs, setOkrKrs] = useState<KeyResult[]>([]);

  // KR Temp Fields
  const [krName, setKrName] = useState('');
  const [krInitial, setKrInitial] = useState(0);
  const [krTarget, setKrTarget] = useState(100);
  const [krUnit, setKrUnit] = useState<KeyResult['unit']>('PERCENT');
  const [krAssignee, setKrAssignee] = useState('');

  // Check-In Modal (UC-350)
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedOkr, setSelectedOkr] = useState<ObjectiveOkr | null>(null);
  const [selectedKr, setSelectedKr] = useState<KeyResult | null>(null);
  const [checkInValue, setCheckInValue] = useState(0);
  const [checkInNote, setCheckInNote] = useState('');

  // HR Evaluation Integration Modal (UC-351)
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalQualitative, setEvalQualitative] = useState(8);
  const [evalWeight, setEvalWeight] = useState(0.6);
  const [evalResult, setEvalResult] = useState<any>(null);

  const loadData = async () => {
    if (!activeProject) return;
    const items = await db.objectiveOkrs.where('projectId').equals(activeProject.id).toArray();
    setOkrs(items);

    const checkIns = await db.okrCheckInLogs.toArray();
    setLogs(checkIns.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  const handleAddKr = () => {
    if (!krName.trim()) return;
    if (krInitial === krTarget) {
      alert('Erro: O valor inicial e o valor alvo não podem ser iguais (UC-346).');
      return;
    }
    const newKr: KeyResult = {
      id: `kr_${Date.now()}`,
      name: krName.trim(),
      initialValue: krInitial,
      currentValue: krInitial,
      targetValue: krTarget,
      unit: krUnit,
      assigneeEmail: krAssignee.trim() || undefined
    };
    setOkrKrs([...okrKrs, newKr]);
    setKrName('');
    setKrInitial(0);
    setKrTarget(100);
    setKrAssignee('');
  };

  const handleSaveOkr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!okrTitle.trim() || okrKrs.length === 0 || !activeProject) return;

    const newOkr: ObjectiveOkr = {
      id: `okr_${Date.now()}`,
      projectId: activeProject.id,
      title: okrTitle.trim(),
      ownerTeamOrProject: okrTeam.trim() || 'Geral',
      validityPeriod: activePeriod,
      description: okrDesc.trim(),
      keyResults: okrKrs,
      status: 'NO_PRAZO',
      createdAt: new Date().toISOString()
    };

    await db.objectiveOkrs.put(newOkr);
    setShowOkrModal(false);
    setOkrTitle('');
    setOkrTeam('');
    setOkrDesc('');
    setOkrKrs([]);
    await loadData();
  };

  const handleOpenCheckIn = (okr: ObjectiveOkr, kr: KeyResult) => {
    setSelectedOkr(okr);
    setSelectedKr(kr);
    setCheckInValue(kr.currentValue);
    setCheckInNote('');
    setShowCheckInModal(true);
  };

  const handleSaveCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOkr || !selectedKr) return;

    const isRegression = selectedKr.initialValue < selectedKr.targetValue 
      ? checkInValue < selectedKr.currentValue
      : checkInValue > selectedKr.currentValue;

    if (isRegression) {
      const confirmText = 'O valor informado indica uma regressão no progresso desta meta. Deseja confirmar mesmo assim? (UC-350)';
      if (!window.confirm(confirmText)) return;
    }

    // Gravar Log
    const newLog: OkrCheckInLog = {
      id: `log_${Date.now()}`,
      objectiveId: selectedOkr.id,
      keyResultId: selectedKr.id,
      oldValue: selectedKr.currentValue,
      newValue: checkInValue,
      progressNote: checkInNote.trim() || 'Check-in de rotina',
      authorEmail: 'gestor@empresa.com',
      timestamp: new Date().toISOString()
    };
    await db.okrCheckInLogs.put(newLog);

    // Atualizar valor na OKR
    const updatedKrs = selectedOkr.keyResults.map(kr => {
      if (kr.id === selectedKr.id) {
        return { ...kr, currentValue: checkInValue };
      }
      return kr;
    });

    const updatedOkr: ObjectiveOkr = {
      ...selectedOkr,
      keyResults: updatedKrs
    };

    await db.objectiveOkrs.put(updatedOkr);
    setShowCheckInModal(false);
    setSelectedOkr(null);
    setSelectedKr(null);
    await loadData();
  };

  const handleCalculateIntegratedScore = () => {
    const allAssignedKrs = okrs.flatMap(o => o.keyResults);
    const res = calculateIntegratedPerformanceScore(evalQualitative, allAssignedKrs, evalWeight);
    setEvalResult(res);
  };

  const handleGeneratePDFReport = () => {
    // Simulação do processamento de relatório em PDF de atingimento de metas (UC-349)
    const report = generateOkrPerformanceReport(okrs.filter(o => o.validityPeriod === activePeriod));
    alert(`📄 Relatório Consolidado (${activePeriod}):\n\nObjetivos Analisados: ${report.objectivesAnalyzed}\nNota de Atingimento Médio Ponderado: ${report.finalScore} / 10.0\n\n[Relatório PDF Iniciado para Download]`);
  };

  return (
    <div className="okr-dashboard-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎯 OKRs & Planejamento Estratégico (UC-346 to UC-351)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Acompanhamento temporal de metas estratégicas, check-ins de Key Results e integração com performance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => setShowEvalModal(true)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ⚖️ Integração RH (UC-351)
          </button>
          <button 
            onClick={handleGeneratePDFReport}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📄 Relatório PDF (UC-349)
          </button>
          <button 
            onClick={() => setShowOkrModal(true)}
            style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ➕ Novo Objetivo
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: OKR list with progress (UC-348) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {okrs.map(okr => {
            const objProgress = calculateOkrObjectiveProgress(okr);
            return (
              <div key={okr.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.72rem', background: '#3b82f6', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                    {okr.ownerTeamOrProject}
                  </span>
                  <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>{okr.validityPeriod}</span>
                </div>

                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.3rem' }}>{okr.title}</h3>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', opacity: 0.7 }}>{okr.description}</p>

                {/* Progress bar */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                    <span>Progresso Consolidado (UC-348)</span>
                    <strong>{objProgress}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${objProgress}%`, height: '100%', background: '#10b981', transition: 'width 0.3s ease' }} />
                  </div>
                </div>

                {/* Key Results list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                  {okr.keyResults.map(kr => {
                    const krProgress = calculateKrProgress(kr);
                    return (
                      <div key={kr.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>{kr.name}</span>
                          <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Progresso: {kr.initialValue} ➔ {kr.currentValue} / {kr.targetValue}</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#60a5fa' }}>{krProgress}%</span>
                          <button 
                            onClick={() => handleOpenCheckIn(okr, kr)}
                            style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            ✏️ Check-in (UC-350)
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {okrs.length === 0 && (
            <div style={{ textAlign: 'center', opacity: 0.5, padding: '5rem 0' }}>
              Nenhum objetivo OKR cadastrado para este projeto.
            </div>
          )}
        </div>

        {/* Right Column: Check-in Logs Timeline (UC-350) */}
        <div>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1.2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem' }}>⏱️ Histórico de Check-ins (UC-350)</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '500px', overflowY: 'auto' }}>
              {logs.map(log => (
                <div key={log.id} style={{ borderLeft: '2px solid #3b82f6', paddingLeft: '0.8rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6, fontSize: '0.75rem' }}>
                    <span>{log.authorEmail}</span>
                    <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p style={{ margin: '0.2rem 0 0.1rem 0' }}>
                    Atualizou KR para <strong>{log.newValue}</strong> (era {log.oldValue})
                  </p>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, fontStyle: 'italic' }}>💬 {log.progressNote}</span>
                </div>
              ))}

              {logs.length === 0 && (
                <div style={{ opacity: 0.5, textAlign: 'center', padding: '2rem 0' }}>
                  Nenhum check-in registrado.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Add OKR (UC-346) */}
      {showOkrModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🎯 Novo Objetivo Estratégico (OKR)</h3>
            <form onSubmit={handleSaveOkr} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Título do Objetivo:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Expandir Presença no Mercado"
                  value={okrTitle}
                  onChange={e => setOkrTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Time Responsável:</label>
                  <input 
                    type="text"
                    placeholder="Ex: Marketing, Dev"
                    value={okrTeam}
                    onChange={e => setOkrTeam(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Período:</label>
                  <select 
                    value={activePeriod}
                    onChange={e => setActivePeriod(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    <option value="Q3 2026">Q3 2026</option>
                    <option value="Q4 2026">Q4 2026</option>
                    <option value="Q1 2027">Q1 2027</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Descrição:</label>
                <textarea 
                  rows={2}
                  placeholder="Impacto estratégico esperado..."
                  value={okrDesc}
                  onChange={e => setOkrDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              {/* KR Creator Section */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Adicionar Key Result (KR)</span>
                
                <input 
                  type="text"
                  placeholder="Nome do KR"
                  value={krName}
                  onChange={e => setKrName(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem', marginBottom: '0.4rem' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <input 
                    type="number"
                    placeholder="Valor Inic"
                    value={krInitial}
                    onChange={e => setKrInitial(parseInt(e.target.value) || 0)}
                    style={{ padding: '0.3rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem' }}
                  />
                  <input 
                    type="number"
                    placeholder="Valor Alvo"
                    value={krTarget}
                    onChange={e => setKrTarget(parseInt(e.target.value) || 100)}
                    style={{ padding: '0.3rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem' }}
                  />
                  <select
                    value={krUnit}
                    onChange={e => setKrUnit(e.target.value as any)}
                    style={{ padding: '0.3rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem' }}
                  >
                    <option value="PERCENT">%</option>
                    <option value="NUMBER">Qtd</option>
                    <option value="CURRENCY">R$</option>
                  </select>
                </div>

                <input 
                  type="email"
                  placeholder="Email do Responsável"
                  value={krAssignee}
                  onChange={e => setKrAssignee(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem', marginBottom: '0.4rem' }}
                />

                <button 
                  type="button"
                  onClick={handleAddKr}
                  style={{ width: '100%', background: '#3b82f6', border: 'none', color: 'white', padding: '0.4rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Adicionar KR
                </button>
              </div>

              {/* KRs List Preview */}
              {okrKrs.length > 0 && (
                <div style={{ maxHeight: '80px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px' }}>
                  {okrKrs.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
                      <span>• {item.name}</span>
                      <span>{item.initialValue} ➔ {item.targetValue}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowOkrModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar OKR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Check-In (UC-350) */}
      {showCheckInModal && selectedKr && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>✏️ Check-In: {selectedKr.name}</h3>
            <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1rem' }}>Informe o progresso atualizado da meta.</p>
            
            <form onSubmit={handleSaveCheckIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Valor Medido Atual:</label>
                <input 
                  type="number"
                  required
                  value={checkInValue}
                  onChange={e => setCheckInValue(parseInt(e.target.value) || 0)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nota de Progresso / Comentário:</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Descreva as atividades recentes que impulsionaram esta meta..."
                  value={checkInNote}
                  onChange={e => setCheckInNote(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCheckInModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Gravar Check-in</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal HR Evaluation Integration (UC-351) */}
      {showEvalModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>⚖️ Integração Metas & Desempenho (UC-351)</h3>
            <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1.2rem' }}>Pese o desempenho qualitativo de competências contra os Key Results estratégicos.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Avaliação Qualitativa (0 a 10):</label>
                <input 
                  type="number"
                  min={0}
                  max={10}
                  value={evalQualitative}
                  onChange={e => setEvalQualitative(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Peso Qualitativo (60% = 0.6):</label>
                <input 
                  type="number"
                  step={0.1}
                  min={0}
                  max={1}
                  value={evalWeight}
                  onChange={e => setEvalWeight(parseFloat(e.target.value) || 0.6)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <button 
                onClick={handleCalculateIntegratedScore}
                style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
              >
                📊 Calcular Nota Ponderada
              </button>

              {evalResult && (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span>Nota Quantitativa (Metas):</span>
                    <strong>{evalResult.quantitativeScore} / 10</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', opacity: 0.6 }}>
                    <span>Contribuição Metas:</span>
                    <span>{evalResult.quantitativeContribution}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', opacity: 0.6 }}>
                    <span>Contribuição Competências:</span>
                    <span>{evalResult.qualitativeContribution}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.4rem', fontWeight: 700, color: '#10b981' }}>
                    <span>Nota Consolidada Final:</span>
                    <span>{evalResult.finalScore} / 10</span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => { setShowEvalModal(false); setEvalResult(null); }} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
