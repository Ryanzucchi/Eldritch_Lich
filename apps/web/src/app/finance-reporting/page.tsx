'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { FinancialTransaction, generateIncomeStatement, generateBalanceSheet, predictFutureCashFlowCurves } from '@eldritch/domain';

export default function FinanceReportingPage() {
  const { activeProject } = useApp();
  
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'DRE' | 'BALANCO' | 'FORECAST_CAIXA' | 'AGENDA'>('DRE');

  // Relatório Apuração
  const [reportPeriod, setReportPeriod] = useState('2026');

  // Projeção temporal (UC-392)
  const [forecastMonths, setForecastMonths] = useState(6);
  const [scenarioFilter, setScenarioFilter] = useState<'ALL' | 'REALISTIC' | 'OPTIMISTIC' | 'PESSIMISTIC'>('ALL');

  // Agenda Contas A pagar/Receber (UC-391)
  const [comprovanteFile, setComprovanteFile] = useState<string>('');

  const loadData = async () => {
    if (!activeProject) return;
    const txs = await db.financialTransactions.where('projectId').equals(activeProject.id).toArray();
    setTransactions(txs);
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  // Modificar Vencimento (UC-391 Alternativo)
  const handleProrrogarVencimento = async (tx: FinancialTransaction) => {
    const novaData = prompt('Digite a nova data de vencimento (AAAA-MM-DD):', tx.dueDate.split('T')[0]);
    if (!novaData) return;

    const updated: FinancialTransaction = {
      ...tx,
      dueDate: new Date(novaData).toISOString()
    };
    await db.financialTransactions.put(updated);
    await loadData();
  };

  // Liquidar Conta e Salvar Comprovante (UC-391)
  const handleLiquidateAndAttach = async (tx: FinancialTransaction) => {
    const updated: FinancialTransaction = {
      ...tx,
      status: 'PAID',
      paymentDate: new Date().toISOString(),
      attachmentUrl: comprovanteFile || '/comprovantes/recibo_bancario.pdf'
    };
    await db.financialTransactions.put(updated);
    setComprovanteFile('');
    await loadData();
    alert('Título liquidado e comprovante anexado com sucesso!');
  };

  // Consolidação Contábil (UC-389)
  const dre = generateIncomeStatement(transactions);
  const balanco = generateBalanceSheet(transactions, 150000);
  const projections = predictFutureCashFlowCurves(transactions, 150000, forecastMonths);

  // Filtros rápidos da Agenda (UC-391)
  const pendingTxs = transactions.filter(t => t.status !== 'PAID');
  const totalReceivables = pendingTxs.filter(t => t.type === 'REVENUE').reduce((sum, t) => sum + t.amount, 0);
  const totalPayables = pendingTxs.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="finance-reporting-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📊 Inteligência Financeira & Agenda de Contas (UC-389, UC-391, UC-392)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Relatórios contábeis DRE, Balanço Patrimonial, agenda de contas a pagar/receber e simulações de fluxo de caixa futuro.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => setActiveTab('DRE')}
            style={{ background: activeTab === 'DRE' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📊 Apuração DRE (UC-389)
          </button>
          <button 
            onClick={() => setActiveTab('BALANCO')}
            style={{ background: activeTab === 'BALANCO' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ⚖️ Balanço Patrimonial (UC-389)
          </button>
          <button 
            onClick={() => setActiveTab('FORECAST_CAIXA')}
            style={{ background: activeTab === 'FORECAST_CAIXA' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            🔮 Curvas de Projeção (UC-392)
          </button>
          <button 
            onClick={() => setActiveTab('AGENDA')}
            style={{ background: activeTab === 'AGENDA' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📅 Agenda Contas (UC-391)
          </button>
        </div>
      </header>

      {/* Tab DRE (UC-389) */}
      {activeTab === 'DRE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Demonstrativo do Resultado do Exercício (DRE) - Ref: {reportPeriod}</h2>
            <select 
              value={reportPeriod} 
              onChange={e => setReportPeriod(e.target.value)}
              style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            >
              <option value="2026">Exercício 2026</option>
              <option value="2027">Exercício 2027</option>
            </select>
          </div>

          {dre.unclassifiedTransactionsCount > 0 && (
            <div style={{ background: '#ef444422', border: '1px solid #ef4444', color: '#f87171', padding: '1rem', borderRadius: '8px' }}>
              ⚠️ Atenção: Existem {dre.unclassifiedTransactionsCount} lançamentos liquidados sem categoria estruturada. O relatório DRE está incompleto.
            </div>
          )}

          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', fontSize: '1.1rem' }}>
                <span>(+) RECEITA BRUTA:</span>
                <strong style={{ color: '#10b981' }}>R$ {dre.grossRevenue.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', opacity: 0.7 }}>
                <span>(-) Deduções de Impostos (5%):</span>
                <span>R$ {dre.deductions.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
                <span>(=) RECEITA LÍQUIDA:</span>
                <span>R$ {dre.netRevenue.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: '#ef4444' }}>
                <span>(-) CUSTOS E DESPESAS OPERACIONAIS:</span>
                <strong>R$ {dre.operatingExpenses.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 700, color: dre.netIncome >= 0 ? '#10b981' : '#ef4444', paddingTop: '1rem' }}>
                <span>(=) LUCRO LÍQUIDO DO EXERCÍCIO (LLE):</span>
                <span>R$ {dre.netIncome.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Balanço (UC-389) */}
      {activeTab === 'BALANCO' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Balanço Patrimonial Estruturado</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
            {/* Ativo */}
            <div>
              <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '0.5rem', color: '#60a5fa' }}>ATIVO (Aplicações)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                {balanco.assets.map((asset, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>{asset.name}</span>
                    <strong>R$ {asset.amount.toLocaleString()}</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.8rem', fontWeight: 700 }}>
                  <span>TOTAL DO ATIVO:</span>
                  <span>R$ {balanco.totalAssets.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Passivo e PL */}
            <div>
              <h3 style={{ borderBottom: '2px solid #ef4444', paddingBottom: '0.5rem', color: '#f87171' }}>PASSIVO & PATRIMÔNIO LÍQUIDO (Origens)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>Passivo Circulante</span>
                {balanco.liabilities.map((liab, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>{liab.name}</span>
                    <strong>R$ {liab.amount.toLocaleString()}</strong>
                  </div>
                ))}

                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginTop: '1rem' }}>Patrimônio Líquido</span>
                {balanco.equity.map((eq, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>{eq.name}</span>
                    <strong>R$ {eq.amount.toLocaleString()}</strong>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.8rem', fontWeight: 700 }}>
                  <span>TOTAL DO PASSIVO E PL:</span>
                  <span>R$ {balanco.totalLiabilitiesAndEquity.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Projeção Curvas (UC-392) */}
      {activeTab === 'FORECAST_CAIXA' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Previsão de Fluxo de Caixa Futuro (IA Forecast)</h2>
            
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <select 
                value={forecastMonths} 
                onChange={e => setForecastMonths(parseInt(e.target.value) || 6)}
                style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              >
                <option value={3}>Próximos 3 meses</option>
                <option value={6}>Próximos 6 meses</option>
                <option value={12}>Próximos 12 meses</option>
              </select>

              <select 
                value={scenarioFilter} 
                onChange={e => setScenarioFilter(e.target.value as any)}
                style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              >
                <option value="ALL">Visualizar Todos os Cenários</option>
                <option value="REALISTIC">Cenário Realista</option>
                <option value="OPTIMISTIC">Cenário Otimista</option>
                <option value="PESSIMISTIC">Cenário Pessimista</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {projections.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '6px' }}>
                  <span style={{ fontWeight: 700 }}>{p.date}</span>
                  
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    {(scenarioFilter === 'ALL' || scenarioFilter === 'OPTIMISTIC') && (
                      <span style={{ color: '#10b981' }}>Otimista: R$ {p.optimisticAmount.toLocaleString()}</span>
                    )}
                    {(scenarioFilter === 'ALL' || scenarioFilter === 'REALISTIC') && (
                      <span style={{ color: '#3b82f6' }}>Realista: R$ {p.realisticAmount.toLocaleString()}</span>
                    )}
                    {(scenarioFilter === 'ALL' || scenarioFilter === 'PESSIMISTIC') && (
                      <span style={{ color: '#ef4444' }}>Pessimista: R$ {p.pessimisticAmount.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Agenda Contas (UC-391) */}
      {activeTab === 'AGENDA' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', padding: '1.2rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Soma Consolidada Contas A RECEBER:</span>
              <h3 style={{ margin: '0.3rem 0 0 0', color: '#10b981', fontSize: '1.8rem' }}>R$ {totalReceivables.toLocaleString()}</h3>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', padding: '1.2rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Soma Consolidada Contas A PAGAR:</span>
              <h3 style={{ margin: '0.3rem 0 0 0', color: '#ef4444', fontSize: '1.8rem' }}>R$ {totalPayables.toLocaleString()}</h3>
            </div>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Calendário de Obrigações a Vencer</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {pendingTxs.map(t => {
                const isOverdue = new Date(t.dueDate) < new Date();
                return (
                  <div key={t.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem', display: 'block' }}>{t.description}</strong>
                      <span style={{ fontSize: '0.78rem', color: isOverdue ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>
                        {isOverdue ? '⚠️ Vencido em: ' : '📅 Vence em: '} {new Date(t.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 700, color: t.type === 'REVENUE' ? '#10b981' : '#ef4444' }}>
                        R$ {t.amount.toLocaleString()}
                      </span>
                      
                      <button 
                        onClick={() => handleProrrogarVencimento(t)}
                        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem' }}
                      >
                        📅 Prorrogar
                      </button>

                      <button 
                        onClick={() => handleLiquidateAndAttach(t)}
                        style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem' }}
                      >
                        ⚡ Liquidar
                      </button>
                    </div>
                  </div>
                );
              })}

              {pendingTxs.length === 0 && (
                <div style={{ textAlign: 'center', opacity: 0.5, padding: '3rem 0' }}>
                  Nenhuma obrigação financeira a vencer.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
