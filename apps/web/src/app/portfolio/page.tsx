'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { CorporatePortfolio, ResourceAllocation, ProjectCostLog, ProjectFinancials, calculateProjectTotalCosts, calculateProjectProfitability } from '@eldritch/domain';

export default function PortfolioPage() {
  const { activeProject } = useApp();
  const [portfolios, setPortfolios] = useState<CorporatePortfolio[]>([]);
  const [allocations, setAllocations] = useState<ResourceAllocation[]>([]);
  const [costLogs, setCostLogs] = useState<ProjectCostLog[]>([]);
  const [financials, setFinancials] = useState<ProjectFinancials[]>([]);
  
  const [activeTab, setActiveTab] = useState<'PORTFOLIO' | 'RESOURCES' | 'COSTS' | 'DRE'>('PORTFOLIO');

  // Portfolio Form State (UC-352)
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portName, setPortName] = useState('');
  const [portDesc, setPortDesc] = useState('');
  const [portBudget, setPortBudget] = useState(100000);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  // Resource Allocation Form State (UC-354)
  const [showAllocModal, setShowAllocModal] = useState(false);
  const [allocEmployeeId, setAllocEmployeeId] = useState('');
  const [allocProjId, setAllocProjId] = useState('');
  const [allocPercent, setAllocPercent] = useState(40);
  const [allocType, setAllocType] = useState<ResourceAllocation['resourceType']>('PERSON');
  const [allocCost, setAllocCost] = useState(5000);

  // Manual Cost Form State (UC-355)
  const [showCostModal, setShowCostModal] = useState(false);
  const [costCategory, setCostCategory] = useState<ProjectCostLog['category']>('INFRASTRUCTURE');
  const [costAmount, setCostAmount] = useState(1200);
  const [costDesc, setCostDesc] = useState('');

  const loadData = async () => {
    const ports = await db.corporatePortfolios.toArray();
    setPortfolios(ports);

    const allocs = await db.resourceAllocations.toArray();
    setAllocations(allocs);

    const logs = await db.projectCostLogs.toArray();
    setCostLogs(logs);

    const financialRecords = await db.projectFinancials.toArray();
    setFinancials(financialRecords);
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  // Create Portfolio (UC-352)
  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portName.trim()) return;

    // Se orçamentos dos projetos individuais excedem o teto, avisa (UC-352)
    const newPort: CorporatePortfolio = {
      id: `port_${Date.now()}`,
      name: portName.trim(),
      description: portDesc.trim(),
      globalBudget: portBudget,
      projectIds: selectedProjectIds,
      createdAt: new Date().toISOString()
    };

    await db.corporatePortfolios.put(newPort);
    setShowPortfolioModal(false);
    setPortName('');
    setPortDesc('');
    setSelectedProjectIds([]);
    await loadData();
  };

  // Create Allocation (UC-354)
  const handleCreateAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocEmployeeId.trim() || !allocProjId.trim()) return;

    // Alerta se sobrecarga > 100% (UC-354)
    const currentAllocationSum = allocations
      .filter(a => a.employeeId === allocEmployeeId)
      .reduce((sum, a) => sum + a.allocationPercent, 0);

    if (currentAllocationSum + allocPercent > 100) {
      alert('⚠️ Alerta de Sobrejornada: A alocação total deste recurso excederá 100% de sua capacidade semanal de trabalho!');
    }

    const newAlloc: ResourceAllocation = {
      id: `alloc_${Date.now()}`,
      employeeId: allocEmployeeId.trim(),
      projectId: allocProjId.trim(),
      allocationPercent: allocPercent,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      resourceType: allocType,
      costPerMonth: allocCost,
      createdAt: new Date().toISOString()
    };

    await db.resourceAllocations.put(newAlloc);
    setShowAllocModal(false);
    await loadData();
  };

  // Create Cost Log (UC-355)
  const handleCreateCostLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    const newLog: ProjectCostLog = {
      id: `cost_${Date.now()}`,
      projectId: activeProject.id,
      category: costCategory,
      amount: costAmount,
      date: new Date().toISOString(),
      description: costDesc.trim() || 'Despesa operacional'
    };

    await db.projectCostLogs.put(newLog);
    
    // Atualizar no projectFinancials o custo total
    const total = calculateProjectTotalCosts(activeProject.id, allocations, [...costLogs, newLog]);
    const existingFin = financials.find(f => f.projectId === activeProject.id);
    await db.projectFinancials.put({
      projectId: activeProject.id,
      projectName: activeProject.name || 'Projeto Principal',
      budgetLimit: existingFin?.budgetLimit || 150000,
      totalActualCost: total,
      totalRevenue: existingFin?.totalRevenue || 200000,
      isInternal: existingFin?.isInternal || false
    });

    setShowCostModal(false);
    setCostDesc('');
    await loadData();
  };

  return (
    <div className="portfolio-management-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🏢 Portfólio Corporativo & Fluxo de Custos (UC-352 to UC-356)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Controle de portfólios globais, alocação de capacidade de recursos, rateio de custos e DRE de rentabilidade.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => setActiveTab('PORTFOLIO')}
            style={{ background: activeTab === 'PORTFOLIO' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📂 Portfólios (UC-352)
          </button>
          <button 
            onClick={() => setActiveTab('RESOURCES')}
            style={{ background: activeTab === 'RESOURCES' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            👥 Capacidade (UC-354)
          </button>
          <button 
            onClick={() => setActiveTab('COSTS')}
            style={{ background: activeTab === 'COSTS' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            💰 Custos (UC-355)
          </button>
          <button 
            onClick={() => setActiveTab('DRE')}
            style={{ background: activeTab === 'DRE' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📊 Rentabilidade DRE (UC-356)
          </button>
        </div>
      </header>

      {/* Tab Portfólio (UC-352) */}
      {activeTab === 'PORTFOLIO' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Agrupamentos de Portfólio ({portfolios.length})</h2>
            <button 
              onClick={() => setShowPortfolioModal(true)}
              style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              ➕ Criar Portfólio
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
            {portfolios.map(p => (
              <div key={p.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1.2rem' }}>
                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.2rem' }}>{p.name}</h3>
                <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.9rem', opacity: 0.8 }}>{p.description}</p>
                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                  Orçamento Global: R$ {p.globalBudget.toLocaleString()}
                </div>
              </div>
            ))}

            {portfolios.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5, padding: '4rem 0' }}>
                Nenhum portfólio cadastrado.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Recursos (UC-354) */}
      {activeTab === 'RESOURCES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Matriz de Alocação de Recursos (UC-354)</h2>
            <button 
              onClick={() => setShowAllocModal(true)}
              style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              ➕ Nova Alocação
            </button>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '0.8rem 1rem' }}>Colaborador / Recurso</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Tipo</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Projeto</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Alocação (%)</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Custo Rateado / Mês</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 700, color: '#60a5fa' }}>{a.employeeId}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>{a.resourceType}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>{a.projectId}</td>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 700, color: a.allocationPercent > 80 ? '#ef4444' : '#10b981' }}>
                      {a.allocationPercent}%
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>R$ {(a.costPerMonth * (a.allocationPercent / 100)).toLocaleString()}</td>
                  </tr>
                ))}

                {allocations.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', opacity: 0.5, padding: '3rem 0' }}>
                      Nenhuma alocação de recurso cadastrada na matriz.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Custos (UC-355) */}
      {activeTab === 'COSTS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Fluxo de Custos do Projeto Ativo (UC-355)</h2>
            <button 
              onClick={() => setShowCostModal(true)}
              style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              ➕ Nova Despesa Manual
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
            {costLogs.map(log => (
              <div key={log.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1.2rem' }}>
                <span style={{ fontSize: '0.72rem', background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                  {log.category}
                </span>
                <h3 style={{ margin: '0.4rem 0 0.2rem 0', fontSize: '1.2rem', color: '#ef4444' }}>
                  R$ {log.amount.toLocaleString()}
                </h3>
                <p style={{ margin: '0', fontSize: '0.88rem', opacity: 0.7 }}>{log.description}</p>
                <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'block', marginTop: '0.5rem' }}>
                  📅 {new Date(log.date).toLocaleDateString()}
                </span>
              </div>
            ))}

            {costLogs.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5, padding: '4rem 0' }}>
                Nenhuma despesa manual lançada.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Rentabilidade DRE (UC-356) */}
      {activeTab === 'DRE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Demonstrativo do Resultado do Exercício Simplificado (DRE - UC-356)</h2>
          
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
            {financials.map(f => {
              const dre = calculateProjectProfitability(f);
              return (
                <div key={f.projectId} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#60a5fa' }}>{f.projectName}</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Receita Total (Contratos):</span>
                      <h4 style={{ margin: '0.3rem 0 0 0', fontSize: '1.4rem', color: '#10b981' }}>R$ {f.totalRevenue.toLocaleString()}</h4>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Custo Realizado Real:</span>
                      <h4 style={{ margin: '0.3rem 0 0 0', fontSize: '1.4rem', color: '#ef4444' }}>R$ {f.totalActualCost.toLocaleString()}</h4>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Lucro / Margem:</span>
                      <h4 style={{ margin: '0.3rem 0 0 0', fontSize: '1.4rem', color: dre.profit >= 0 ? '#10b981' : '#ef4444' }}>
                        R$ {dre.profit.toLocaleString()} ({dre.marginPercent}%)
                      </h4>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Retorno ROI:</span>
                      <h4 style={{ margin: '0.3rem 0 0 0', fontSize: '1.4rem', color: dre.roiPercent >= 0 ? '#10b981' : '#ef4444' }}>
                        {dre.roiPercent}%
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}

            {financials.length === 0 && (
              <div style={{ textAlign: 'center', opacity: 0.5, padding: '3rem 0' }}>
                Nenhum dado financeiro consolidado de projetos encontrado.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Add Portfolio (UC-352) */}
      {showPortfolioModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📂 Criar Novo Portfólio (UC-352)</h3>
            <form onSubmit={handleCreatePortfolio} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome do Portfólio:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Jogos Mobile RPG"
                  value={portName}
                  onChange={e => setPortName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Orçamento Global (R$):</label>
                <input 
                  type="number"
                  required
                  value={portBudget}
                  onChange={e => setPortBudget(parseInt(e.target.value) || 0)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Descrição:</label>
                <textarea 
                  rows={3}
                  placeholder="Objetivos financeiros globais..."
                  value={portDesc}
                  onChange={e => setPortDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowPortfolioModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar Portfólio</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Allocation (UC-354) */}
      {showAllocModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>👥 Alocação de Recursos (UC-354)</h3>
            <form onSubmit={handleCreateAllocation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Colaborador / Equipamento:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: João da Silva / Servidor AWS"
                  value={allocEmployeeId}
                  onChange={e => setAllocEmployeeId(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>ID do Projeto:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: proj_main"
                  value={allocProjId}
                  onChange={e => setAllocProjId(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Alocação (%):</label>
                  <input 
                    type="number"
                    max={100}
                    value={allocPercent}
                    onChange={e => setAllocPercent(parseInt(e.target.value) || 40)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Custo Mensal (R$):</label>
                  <input 
                    type="number"
                    value={allocCost}
                    onChange={e => setAllocCost(parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Tipo de Recurso:</label>
                <select 
                  value={allocType}
                  onChange={e => setAllocType(e.target.value as any)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="PERSON">Colaborador (Pessoa)</option>
                  <option value="EQUIPMENT">Equipamento</option>
                  <option value="SOFTWARE">Licença de Software</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAllocModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Alocar Recurso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Cost Log (UC-355) */}
      {showCostModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>💰 Lançar Despesa Manual (UC-355)</h3>
            <form onSubmit={handleCreateCostLog} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Valor (R$):</label>
                <input 
                  type="number"
                  required
                  value={costAmount}
                  onChange={e => setCostAmount(parseInt(e.target.value) || 0)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Categoria:</label>
                <select 
                  value={costCategory}
                  onChange={e => setCostCategory(e.target.value as any)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="INFRASTRUCTURE">Infraestrutura</option>
                  <option value="TRAVEL">Viagens / Alimentação</option>
                  <option value="OTHER">Outros Rateios</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Descrição:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Compra de Licenças de Unity"
                  value={costDesc}
                  onChange={e => setCostDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCostModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Gravar Despesa</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
