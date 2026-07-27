'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { ProjectBudget, FinancialTransaction, validateBudgetLimits, calculateCashFlow, calculateProjectedCashFlow, autoCategorizeTransaction } from '@eldritch/domain';

export default function FinanceDashboardPage() {
  const { activeProject } = useApp();
  
  const [budget, setBudget] = useState<ProjectBudget | null>(null);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'BUDGET' | 'TRANSACTIONS' | 'CASHFLOW'>('BUDGET');

  // Budget states (UC-381)
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [totalLimit, setTotalLimit] = useState(200000);
  const [limitLabor, setLimitLabor] = useState(80000);
  const [limitInfra, setLimitInfra] = useState(40000);
  const [limitMarketing, setLimitMarketing] = useState(30000);
  const [limitReserve, setLimitReserve] = useState(50000);

  // Transaction states (UC-382, UC-383, UC-384)
  const [showTxModal, setShowTxModal] = useState(false);
  const [txType, setTxType] = useState<FinancialTransaction['type']>('REVENUE');
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState(15000);
  const [txClient, setTxClient] = useState('');
  const [txCategory, setTxCategory] = useState<FinancialTransaction['category']>('REVENUE_OPERATIONAL');
  const [txAutoCat, setTxAutoCat] = useState(true);

  const loadData = async () => {
    if (!activeProject) return;
    
    const budgets = await db.projectBudgets.where('projectId').equals(activeProject.id).toArray();
    if (budgets.length > 0) {
      setBudget(budgets.sort((a, b) => b.version - a.version)[0]);
    }

    const txs = await db.financialTransactions.where('projectId').equals(activeProject.id).toArray();
    setTransactions(txs);
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  // Create or Revision Budget (UC-381)
  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    const newBudget: ProjectBudget = {
      id: `budget_${Date.now()}`,
      projectId: activeProject.id,
      totalLimit,
      period: 'Q3 2026',
      categories: [
        { category: 'LABOR', limitAmount: limitLabor },
        { category: 'INFRASTRUCTURE', limitAmount: limitInfra },
        { category: 'MARKETING', limitAmount: limitMarketing },
        { category: 'RESERVE', limitAmount: limitReserve }
      ],
      version: budget ? budget.version + 1 : 1,
      createdAt: new Date().toISOString()
    };

    if (!validateBudgetLimits(newBudget)) {
      alert('Erro: A soma dos limites das categorias não pode exceder o orçamento total (UC-381).');
      return;
    }

    await db.projectBudgets.put(newBudget);
    setShowBudgetModal(false);
    await loadData();
  };

  // Add Transaction (UC-382, UC-383, UC-384)
  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDesc.trim() || !activeProject) return;

    // Alerta preco de venda maior que compra / loop infinito ou regra (UC-384 autocategorizar)
    const category = txAutoCat ? autoCategorizeTransaction(txDesc) : txCategory;

    const newTx: FinancialTransaction = {
      id: `tx_${Date.now()}`,
      projectId: activeProject.id,
      type: txType,
      description: txDesc.trim(),
      amount: txAmount,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      category: txType === 'REVENUE' ? 'REVENUE_OPERATIONAL' : category,
      clientName: txType === 'REVENUE' ? (txClient.trim() || 'Cliente Externo') : undefined,
      createdAt: new Date().toISOString()
    };

    await db.financialTransactions.put(newTx);
    setShowTxModal(false);
    setTxDesc('');
    setTxClient('');
    await loadData();
  };

  // Liquidate Transaction (UC-385)
  const handleLiquidateTx = async (tx: FinancialTransaction) => {
    const updated: FinancialTransaction = {
      ...tx,
      status: 'PAID',
      paymentDate: new Date().toISOString()
    };
    await db.financialTransactions.put(updated);
    await loadData();
  };

  // Cashflow calculations (UC-385)
  const realCashFlow = calculateCashFlow(transactions, 100000);
  const projectedCashFlow = calculateProjectedCashFlow(transactions, 100000);

  return (
    <div className="finance-dashboard-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            💰 Financeiro, Orçamento & Fluxo de Caixa (UC-381 to UC-385)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Planejamento de orçamento estratégico (Budget), faturamento de receitas, reembolso de despesas e fluxo de caixa.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => setActiveTab('BUDGET')}
            style={{ background: activeTab === 'BUDGET' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📋 Planejamento Budget (UC-381)
          </button>
          <button 
            onClick={() => setActiveTab('TRANSACTIONS')}
            style={{ background: activeTab === 'TRANSACTIONS' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📥 Transações (UC-382/383)
          </button>
          <button 
            onClick={() => setActiveTab('CASHFLOW')}
            style={{ background: activeTab === 'CASHFLOW' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📈 Fluxo de Caixa (UC-385)
          </button>
        </div>
      </header>

      {/* Tab BUDGET (UC-381) */}
      {activeTab === 'BUDGET' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>
              Limite de Linha de Base (Budget) {budget ? `v${budget.version}` : '(Não Configurado)'}
            </h2>
            <button 
              onClick={() => setShowBudgetModal(true)}
              style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              {budget ? '🔄 Revisar Orçamento' : '➕ Definir Orçamento'}
            </button>
          </div>

          {budget ? (
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Orçamento Total Teto:</span>
                  <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '2rem', color: '#10b981' }}>
                    R$ {budget.totalLimit.toLocaleString()}
                  </h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Período de Referência:</span>
                  <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1.2rem' }}>{budget.period}</h4>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem' }}>
                {budget.categories.map((cat, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{cat.category}</span>
                    <h4 style={{ margin: '0.3rem 0 0 0', fontSize: '1.3rem', color: '#60a5fa' }}>
                      R$ {cat.limitAmount.toLocaleString()}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', opacity: 0.5, padding: '5rem 0' }}>
              Defina o orçamento inicial de referência do projeto.
            </div>
          )}
        </div>
      )}

      {/* Tab TRANSACTIONS (UC-382, UC-383, UC-384) */}
      {activeTab === 'TRANSACTIONS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Lançamentos e Transações Financeiras ({transactions.length})</h2>
            <button 
              onClick={() => setShowTxModal(true)}
              style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              ➕ Registrar Transação
            </button>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '0.8rem 1rem' }}>Descrição / Lançamento</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Tipo</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Categoria</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Valor</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Vencimento</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Liquidação</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: t.status === 'PAID' ? 0.7 : 1 }}>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{ fontWeight: 700, display: 'block' }}>{t.description}</span>
                      {t.clientName && <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Cliente: {t.clientName}</span>}
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: t.type === 'REVENUE' ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                      {t.type === 'REVENUE' ? 'ENTRADA' : 'SAÍDA'}
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                        {t.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 700 }}>R$ {t.amount.toLocaleString()}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>{new Date(t.dueDate).toLocaleDateString()}</td>
                    <td style={{ padding: '0.8rem 1rem', color: '#10b981' }}>
                      {t.paymentDate ? new Date(t.paymentDate).toLocaleDateString() : 'Pendente'}
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      {t.status === 'PENDING' && (
                        <button 
                          onClick={() => handleLiquidateTx(t)}
                          style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          ⚡ Liquidar / Pagar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', opacity: 0.5, padding: '3rem 0' }}>
                      Nenhuma transação financeira lançada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab CASHFLOW (UC-385) */}
      {activeTab === 'CASHFLOW' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Regime de Caixa do Projeto (Liquidez Realizada vs Projetada - UC-385)</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Realized Cashflow */}
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.8rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#10b981' }}>📈 Caixa Realizado (Apenas Transações Liquidadas)</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <span>Saldo Inicial de Caixa:</span>
                  <strong>R$ {realCashFlow.initialBalance.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: '#10b981' }}>
                  <span>Entradas Efetuadas:</span>
                  <strong>R$ {realCashFlow.totalInputs.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: '#ef4444' }}>
                  <span>Saídas Efetuadas:</span>
                  <strong>R$ {realCashFlow.totalOutputs.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', fontWeight: 700 }}>
                  <span>Fluxo Líquido:</span>
                  <span>R$ {realCashFlow.netCashFlow.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#10b981', fontSize: '1.2rem', paddingTop: '0.5rem' }}>
                  <span>Saldo Final Disponível:</span>
                  <span>R$ {realCashFlow.finalBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Projected Cashflow */}
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.8rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#60a5fa' }}>🔮 Caixa Projetado (Próximos 3 Meses / Inclui Pendentes)</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <span>Saldo Inicial de Caixa:</span>
                  <strong>R$ {projectedCashFlow.initialBalance.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: '#10b981' }}>
                  <span>Entradas Esperadas:</span>
                  <strong>R$ {projectedCashFlow.totalInputs.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: '#ef4444' }}>
                  <span>Saídas Previstas:</span>
                  <strong>R$ {projectedCashFlow.totalOutputs.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', fontWeight: 700 }}>
                  <span>Fluxo Líquido Projetado:</span>
                  <span>R$ {projectedCashFlow.netCashFlow.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#60a5fa', fontSize: '1.2rem', paddingTop: '0.5rem' }}>
                  <span>Saldo Final Previsto:</span>
                  <span>R$ {projectedCashFlow.finalBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Budget (UC-381) */}
      {showBudgetModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📋 Definir Orçamento de Referência (UC-381)</h3>
            <form onSubmit={handleSaveBudget} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Orçamento Total Teto (R$):</label>
                <input 
                  type="number"
                  required
                  value={totalLimit}
                  onChange={e => setTotalLimit(parseInt(e.target.value) || 0)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>DP / Mão de Obra:</label>
                  <input 
                    type="number"
                    value={limitLabor}
                    onChange={e => setLimitLabor(parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Infraestrutura:</label>
                  <input 
                    type="number"
                    value={limitInfra}
                    onChange={e => setLimitInfra(parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Marketing:</label>
                  <input 
                    type="number"
                    value={limitMarketing}
                    onChange={e => setLimitMarketing(parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Reserva Contingência:</label>
                  <input 
                    type="number"
                    value={limitReserve}
                    onChange={e => setLimitReserve(parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowBudgetModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Definir Orçamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Transaction (UC-382, UC-383, UC-384) */}
      {showTxModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📥 Registrar Movimentação Financeira</h3>
            <form onSubmit={handleSaveTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Tipo de Lançamento:</label>
                  <select 
                    value={txType}
                    onChange={e => setTxType(e.target.value as any)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    <option value="REVENUE">Entrada / Receita (Faturamento)</option>
                    <option value="EXPENSE">Saída / Despesa (Custo)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Valor (R$):</label>
                  <input 
                    type="number"
                    required
                    value={txAmount}
                    onChange={e => setTxAmount(parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Descrição / Histórico:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Nota Fiscal 1032 - AWS Cloud Hosting"
                  value={txDesc}
                  onChange={e => setTxDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              {txType === 'REVENUE' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Cliente (UC-382):</label>
                  <input 
                    type="text"
                    placeholder="Ex: Distribuidora de Jogos S/A"
                    value={txClient}
                    onChange={e => setTxClient(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="checkbox"
                      id="autocat"
                      checked={txAutoCat}
                      onChange={e => setTxAutoCat(e.target.checked)}
                    />
                    <label htmlFor="autocat" style={{ fontSize: '0.85rem' }}>Auto-categorizar transações baseadas em regras (UC-384)</label>
                  </div>

                  {!txAutoCat && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Categoria Plano de Contas DRE:</label>
                      <select 
                        value={txCategory}
                        onChange={e => setTxCategory(e.target.value as any)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                      >
                        <option value="LABOR">Despesas de Pessoal (Mão de Obra)</option>
                        <option value="INFRASTRUCTURE">Custos de Infraestrutura</option>
                        <option value="MARKETING">Despesas de Marketing</option>
                        <option value="OTHER">Outros Custos Operacionais</option>
                      </select>
                    </div>
                  )}
                </>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowTxModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar Transação</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
