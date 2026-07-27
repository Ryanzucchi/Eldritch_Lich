'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { InvoiceLog, BankIntegration, BankStatementLine, BudgetAlert, simulateInvoiceGeneration, reconcileStatementWithTransactions, checkBudgetDeviations } from '@eldritch/domain';

export default function FinanceAutomationPage() {
  const { activeProject } = useApp();

  const [invoices, setInvoices] = useState<InvoiceLog[]>([]);
  const [bankConnections, setBankConnections] = useState<BankIntegration[]>([]);
  const [statementLines, setStatementLines] = useState<BankStatementLine[]>([]);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  
  const [activeTab, setActiveTab] = useState<'INVOICES' | 'BANK' | 'ALERTS'>('INVOICES');

  // Bank Integration inputs (UC-387)
  const [bankName, setBankName] = useState('Banco do Brasil S/A');

  const loadData = async () => {
    if (!activeProject) return;

    const invs = await db.invoiceLogs.toArray();
    setInvoices(invs);

    const conns = await db.bankIntegrations.toArray();
    setBankConnections(conns);

    const stmts = await db.bankStatementLines.toArray();
    setStatementLines(stmts);

    // Recalcula alertas de desvio orçamentário (UC-390)
    const budgets = await db.projectBudgets.where('projectId').equals(activeProject.id).toArray();
    const txs = await db.financialTransactions.where('projectId').equals(activeProject.id).toArray();
    if (budgets.length > 0) {
      const activeAlerts = checkBudgetDeviations(activeProject.id, budgets[0], txs, 80);
      setAlerts(activeAlerts);
      
      // Persiste alertas no db local
      await db.budgetAlerts.clear();
      if (activeAlerts.length > 0) {
        await db.budgetAlerts.bulkPut(activeAlerts);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  // Connect Bank API Open Finance (UC-387)
  const handleConnectBank = async () => {
    const newConn: BankIntegration = {
      id: `bank_${Date.now()}`,
      bankName,
      connectedAt: new Date().toISOString(),
      status: 'ACTIVE'
    };
    await db.bankIntegrations.put(newConn);
    
    // Injeta algumas transações no extrato para reconciliação
    const dummyStatements: BankStatementLine[] = [
      { id: `stmt_1`, integrationId: newConn.id, date: new Date().toISOString(), description: 'RECEBIMENTO MILESTONE CLIENTE', amount: 15000, type: 'CREDIT' },
      { id: `stmt_2`, integrationId: newConn.id, date: new Date().toISOString(), description: 'DEBITO PAGAMENTO AWS HOSTING', amount: 1200, type: 'DEBIT' }
    ];
    await db.bankStatementLines.bulkPut(dummyStatements);

    await loadData();
    alert(`Conta do ${bankName} conectada com sucesso via Open Finance API!`);
  };

  // Reconcile transactions (UC-388)
  const handleTriggerReconcile = async () => {
    if (!activeProject) return;
    const txs = await db.financialTransactions.where('projectId').equals(activeProject.id).toArray();
    
    const result = reconcileStatementWithTransactions(statementLines, txs);
    
    if (result.reconciledCount > 0) {
      await db.bankStatementLines.bulkPut(result.updatedStatements);
      await db.financialTransactions.bulkPut(result.updatedTransactions);
      
      // UC-386 Emitir Nota Fiscal Automaticamente ao reconciliar / pagar receita
      const newlyPaidRevenues = result.updatedTransactions.filter(
        t => t.type === 'REVENUE' && t.status === 'PAID'
      );
      
      const newInvoices: InvoiceLog[] = [];
      for (let rev of newlyPaidRevenues) {
        // Verifica se já não foi emitida
        const alreadyHasNf = invoices.some(i => i.transactionId === rev.id);
        if (!alreadyHasNf) {
          const nf = simulateInvoiceGeneration(rev.id, rev.amount, rev.clientName || 'Cliente Externo');
          newInvoices.push(nf);
        }
      }

      if (newInvoices.length > 0) {
        await db.invoiceLogs.bulkPut(newInvoices);
      }

      await loadData();
      alert(`Reconciliação finalizada! ${result.reconciledCount} lançamentos reconciliados automaticamente. ${newInvoices.length} Notas Fiscais emitidas.`);
    } else {
      alert('Nenhuma correspondência de transação encontrada para reconciliação.');
    }
  };

  return (
    <div className="finance-automation-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚡ Automação Financeira (UC-386, UC-387, UC-388, UC-390)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Faturamento automatizado de notas fiscais, conexões Open Finance bancárias e alertas de desvio orçamentário.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => setActiveTab('INVOICES')}
            style={{ background: activeTab === 'INVOICES' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📄 Notas Fiscais (UC-386)
          </button>
          <button 
            onClick={() => setActiveTab('BANK')}
            style={{ background: activeTab === 'BANK' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            🏦 Reconciliação Open Finance (UC-387/388)
          </button>
          <button 
            onClick={() => setActiveTab('ALERTS')}
            style={{ background: activeTab === 'ALERTS' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ⚠️ Alertas de Consumo (UC-390)
          </button>
        </div>
      </header>

      {/* Tab INVOICES (UC-386) */}
      {activeTab === 'INVOICES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Notas Fiscais de Serviços Eletrônicas (NFS-e)</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
            {invoices.map(inv => (
              <div key={inv.id} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>{inv.invoiceNumber}</span>
                  <span style={{ fontSize: '0.72rem', background: '#10b981', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                    {inv.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                  Transação ID: <span style={{ fontFamily: 'monospace' }}>{inv.transactionId}</span>
                </div>
                <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'block' }}>
                  📅 Emitida em: {new Date(inv.issuedAt).toLocaleString()}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <a href={inv.pdfUrl} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.78rem', textAlign: 'center', width: '100%' }}>
                    📄 Download PDF
                  </a>
                </div>
              </div>
            ))}

            {invoices.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5, padding: '4rem 0' }}>
                Nenhuma nota fiscal eletrônica emitida no histórico.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab BANK (UC-387, UC-388) */}
      {activeTab === 'BANK' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          {/* Conexão Open Finance */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🏦 Conexão Open Finance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Banco Corporativo:</label>
                <select 
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="Banco do Brasil S/A">Banco do Brasil S/A</option>
                  <option value="Itaú Unibanco S/A">Itaú Unibanco S/A</option>
                  <option value="Banco Bradesco S/A">Banco Bradesco S/A</option>
                </select>
              </div>

              <button 
                onClick={handleConnectBank}
                style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
              >
                🔗 Conectar via API
              </button>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '0.5rem' }}>Conexões Ativas:</span>
                {bankConnections.map(conn => (
                  <div key={conn.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.4rem' }}>
                    <span>{conn.bankName}</span>
                    <strong style={{ color: '#10b981' }}>{conn.status}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reconciliação de Extrato */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>📊 Extrato Importado (API Bancária)</h3>
              <button 
                onClick={handleTriggerReconcile}
                style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
              >
                ⚡ Reconciliar Automaticamente
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {statementLines.map(line => (
                <div key={line.id} style={{ borderLeft: line.type === 'CREDIT' ? '3px solid #10b981' : '3px solid #ef4444', paddingLeft: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '0 6px 6px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>{line.description}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>📅 {new Date(line.date).toLocaleDateString()}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: 700, color: line.type === 'CREDIT' ? '#10b981' : '#ef4444' }}>
                      R$ {line.amount.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.75rem', background: line.reconciledTransactionId ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: line.reconciledTransactionId ? '#10b981' : '#f59e0b', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                      {line.reconciledTransactionId ? 'RECONCILIADO' : 'PENDENTE'}
                    </span>
                  </div>
                </div>
              ))}

              {statementLines.length === 0 && (
                <div style={{ opacity: 0.5, textAlign: 'center', padding: '3rem 0' }}>
                  Conecte uma conta via API Open Finance para carregar o extrato bancário.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab ALERTS (UC-390) */}
      {activeTab === 'ALERTS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Alertas Ativos de Consumo e Desvios de Budget (UC-390)</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {alerts.map(alt => (
              <div key={alt.id} style={{ background: '#ef444422', border: '1px solid #ef4444', borderRadius: '10px', padding: '1.2rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#f87171' }}>{alt.message}</h4>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                  Centro de Custo: <strong>{alt.category}</strong> | Consumo Realizado: <strong>R$ {alt.actualAmount.toLocaleString()}</strong> de <strong>R$ {alt.limitAmount.toLocaleString()}</strong>
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <div style={{ background: '#10b98111', border: '1px solid #10b981', color: '#34d399', borderRadius: '10px', padding: '1.5rem', textAlign: 'center' }}>
                ✅ Excelente! Todos os centros de custo do projeto estão saudáveis e dentro do limite orçamentário.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
