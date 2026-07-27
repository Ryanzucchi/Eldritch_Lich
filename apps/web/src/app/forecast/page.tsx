'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { ProjectRisk, HistoricalTask, LeadTimeEstimationResult, estimateLeadTimeMonteCarlo, calculateRiskScore } from '@eldritch/domain';

export default function ForecastRisksPage() {
  const { activeProject } = useApp();
  const [risks, setRisks] = useState<ProjectRisk[]>([]);
  const [history, setHistory] = useState<HistoricalTask[]>([]);
  
  const [activeTab, setActiveTab] = useState<'FORECAST' | 'RISKS'>('FORECAST');

  // Forecast Form State (UC-357)
  const [forecastComplexity, setForecastComplexity] = useState<HistoricalTask['complexity']>('MEDIUM');
  const [forecastNumTasks, setForecastNumTasks] = useState(5);
  const [forecastResult, setForecastResult] = useState<LeadTimeEstimationResult | null>(null);

  // Risk Form State (UC-358, UC-359)
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [riskDesc, setRiskDesc] = useState('');
  const [riskCat, setRiskCat] = useState<ProjectRisk['category']>('TECHNICAL');
  const [riskProb, setRiskProb] = useState<ProjectRisk['probability']>('MEDIUM');
  const [riskImp, setRiskImp] = useState<ProjectRisk['impact']>('MEDIUM');

  // Mitigation Form State (UC-359)
  const [showMitModal, setShowMitModal] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<ProjectRisk | null>(null);
  const [mitAction, setMitAction] = useState('');
  const [mitContingency, setMitContingency] = useState('');
  const [mitOwner, setMitOwner] = useState('');

  const loadData = async () => {
    if (!activeProject) return;
    const rsk = await db.projectRisks.where('projectId').equals(activeProject.id).toArray();
    setRisks(rsk);

    const hist = await db.historicalTasks.where('projectId').equals(activeProject.id).toArray();
    setHistory(hist);
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  // Run Monte Carlo Forecast (UC-357)
  const handleRunForecast = () => {
    const res = estimateLeadTimeMonteCarlo(history, forecastComplexity, forecastNumTasks, 1000);
    setForecastResult(res);
  };

  // Add dummy historical data to facilitate testing (UC-357)
  const handleInjectDummyHistory = async () => {
    if (!activeProject) return;
    const dummyTasks: HistoricalTask[] = [];
    const complexities: HistoricalTask['complexity'][] = ['LOW', 'MEDIUM', 'HIGH'];
    
    // Injeta 15 tarefas de cada complexidade para permitir previsão estatística real
    for (let c of complexities) {
      const baseDays = c === 'LOW' ? 2 : c === 'MEDIUM' ? 6 : 12;
      for (let i = 0; i < 15; i++) {
        // adiciona variação aleatória de lead time
        const realDays = Math.max(1, baseDays + Math.floor(Math.random() * 5) - 2);
        dummyTasks.push({
          id: `hist_${c}_${i}_${Date.now()}`,
          projectId: activeProject.id,
          executorEmail: 'dev@eldritch.com',
          complexity: c,
          leadTimeDays: realDays,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        });
      }
    }

    await db.historicalTasks.bulkPut(dummyTasks);
    await loadData();
    alert('Injetados 45 registros de tarefas históricas no banco local para simulação Monte Carlo!');
  };

  // Create Risk (UC-358)
  const handleSaveRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riskDesc.trim() || !activeProject) return;

    const newRisk: ProjectRisk = {
      id: `risk_${Date.now()}`,
      projectId: activeProject.id,
      description: riskDesc.trim(),
      category: riskCat,
      probability: riskProb,
      impact: riskImp,
      status: 'IDENTIFIED',
      createdAt: new Date().toISOString()
    };

    await db.projectRisks.put(newRisk);
    setShowRiskModal(false);
    setRiskDesc('');
    await loadData();
  };

  // Save Mitigation Plan (UC-359)
  const handleSaveMitigation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRisk) return;

    const updatedRisk: ProjectRisk = {
      ...selectedRisk,
      mitigationPlan: mitAction.trim(),
      contingencyPlan: mitContingency.trim(),
      ownerEmail: mitOwner.trim(),
      status: 'MITIGATED'
    };

    await db.projectRisks.put(updatedRisk);
    setShowMitModal(false);
    setSelectedRisk(null);
    setMitAction('');
    setMitContingency('');
    setMitOwner('');
    await loadData();
  };

  return (
    <div className="forecast-risks-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔮 Previsão IA Monte Carlo & Matriz de Riscos (UC-357, UC-358, UC-359)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Projeção estocástica de cronograma de entrega baseado em lead time histórico e classificação térmica de riscos.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => setActiveTab('FORECAST')}
            style={{ background: activeTab === 'FORECAST' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            🔮 Previsão Monte Carlo (UC-357)
          </button>
          <button 
            onClick={() => setActiveTab('RISKS')}
            style={{ background: activeTab === 'RISKS' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ⚠️ Matriz de Riscos (UC-358)
          </button>
        </div>
      </header>

      {/* Tab FORECAST (UC-357) */}
      {activeTab === 'FORECAST' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Simulação de Entrega Monte Carlo</h3>
                <p style={{ margin: '0.2rem 0 0 0', opacity: 0.6, fontSize: '0.88rem' }}>
                  Total de tarefas históricas catalogadas: {history.length}
                </p>
              </div>
              <button 
                onClick={handleInjectDummyHistory}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                🧪 Injetar Histórico p/ Testar PREVISÃO (45 tarefas)
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1.2rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Complexidade das Tarefas:</label>
                <select 
                  value={forecastComplexity}
                  onChange={e => setForecastComplexity(e.target.value as any)}
                  style={{ width: '100%', padding: '0.58rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="LOW">Baixa Complexidade</option>
                  <option value="MEDIUM">Média Complexidade</option>
                  <option value="HIGH">Alta Complexidade</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Quantidade de Tarefas Restantes:</label>
                <input 
                  type="number"
                  value={forecastNumTasks}
                  onChange={e => setForecastNumTasks(parseInt(e.target.value) || 1)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <button 
                onClick={handleRunForecast}
                style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
              >
                ⚡ Projetar Prazo (Monte Carlo)
              </button>
            </div>
          </div>

          {/* Forecast Output Card */}
          {forecastResult && (
            <div style={{ background: '#0f172a', border: '1px solid #3b82f6', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#60a5fa' }}>
                📊 Relatório de Estimativa de Lead Time (IA Monte Carlo - UC-357)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Dias Totais Estimados:</span>
                  <h4 style={{ margin: '0.3rem 0 0 0', fontSize: '1.5rem', color: '#10b981' }}>{forecastResult.estimatedDays} dias</h4>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Margem de Erro Provedor:</span>
                  <h4 style={{ margin: '0.3rem 0 0 0', fontSize: '1.5rem', color: '#f59e0b' }}>+/- {forecastResult.marginOfErrorDays} dias</h4>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Nível de Confiança Probabilística:</span>
                  <h4 style={{ margin: '0.3rem 0 0 0', fontSize: '1.5rem', color: '#10b981' }}>{forecastResult.confidencePercent}%</h4>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab RISKS (UC-358, UC-359) */}
      {activeTab === 'RISKS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Matriz de Riscos & Plano de Mitigação (UC-358, UC-359)</h2>
            <button 
              onClick={() => setShowRiskModal(true)}
              style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              ➕ Identificar Risco
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
            {risks.map(r => {
              const score = calculateRiskScore(r);
              const isHighRisk = score >= 6;
              return (
                <div key={r.id} style={{ background: '#0f172a', border: isHighRisk ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                        {r.category}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: isHighRisk ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                        Impacto: {score} / 9
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem' }}>{r.description}</h3>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.8rem' }}>
                      Probabilidade: {r.probability} | Impacto: {r.impact}
                    </div>

                    {r.mitigationPlan && (
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '0.8rem' }}>
                        <strong>🛡️ Plano de Mitigação:</strong> {r.mitigationPlan}
                        {r.contingencyPlan && <div style={{ marginTop: '0.3rem' }}><strong>🚨 Contingência:</strong> {r.contingencyPlan}</div>}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedRisk(r);
                      setMitAction(r.mitigationPlan || '');
                      setMitContingency(r.contingencyPlan || '');
                      setMitOwner(r.ownerEmail || '');
                      setShowMitModal(true);
                    }}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', width: '100%' }}
                  >
                    🛡️ Configurar Plano de Mitigação
                  </button>
                </div>
              );
            })}

            {risks.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5, padding: '4rem 0' }}>
                Nenhum risco de projeto identificado.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Add Risk (UC-358) */}
      {showRiskModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>⚠️ Identificar Novo Risco de Projeto (UC-358)</h3>
            <form onSubmit={handleSaveRisk} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Descrição do Risco:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Falha de conectividade com a API externa"
                  value={riskDesc}
                  onChange={e => setRiskDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Probabilidade:</label>
                  <select 
                    value={riskProb}
                    onChange={e => setRiskProb(e.target.value as any)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Impacto:</label>
                  <select 
                    value={riskImp}
                    onChange={e => setRiskImp(e.target.value as any)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    <option value="LOW">Baixo</option>
                    <option value="MEDIUM">Médio</option>
                    <option value="HIGH">Alto</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Categoria:</label>
                <select 
                  value={riskCat}
                  onChange={e => setRiskCat(e.target.value as any)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="TECHNICAL">Técnico</option>
                  <option value="FINANCIAL">Financeiro</option>
                  <option value="OPERATIONAL">Operacional</option>
                  <option value="EXTERNAL">Externo</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowRiskModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar Risco</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Configure Mitigation Plan (UC-359) */}
      {showMitModal && selectedRisk && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🛡️ Plano de Mitigação: {selectedRisk.description}</h3>
            <form onSubmit={handleSaveMitigation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Ação Preventiva (Reduzir Probabilidade):</label>
                <textarea 
                  rows={2}
                  required
                  placeholder="Ex: Realizar testes automatizados diários"
                  value={mitAction}
                  onChange={e => setMitAction(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Ação de Contingência (Se o Risco Ocorrer):</label>
                <textarea 
                  rows={2}
                  required
                  placeholder="Ex: Utilizar base de dados offline em cache"
                  value={mitContingency}
                  onChange={e => setMitContingency(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Colaborador Responsável (Email):</label>
                <input 
                  type="email"
                  required
                  placeholder="Ex: dev@eldritch.com"
                  value={mitOwner}
                  onChange={e => setMitOwner(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => { setShowMitModal(false); setSelectedRisk(null); }} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar Plano</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
