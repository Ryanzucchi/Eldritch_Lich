'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { Employee, PayrollRecord, validateCPF, calculatePayroll } from '@eldritch/domain';

export default function HRPage() {
  const { activeProject } = useApp();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'EMPLOYEES' | 'PAYROLL'>('EMPLOYEES');

  // Employee Form State (UC-301, UC-302)
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [department, setDepartment] = useState('Editorial');
  const [baseSalary, setBaseSalary] = useState<number>(5000);

  // Payroll Calculation State (UC-303)
  const [monthYear, setMonthYear] = useState('2026-07');

  const [success, setSuccess] = useState<string | null>(null);

  // Load Data
  const loadData = async () => {
    if (!activeProject) return;
    const empList = await db.employees.where('projectId').equals(activeProject.id).toArray();
    setEmployees(empList);

    const payList = await db.payrollRecords.where('projectId').equals(activeProject.id).toArray();
    setPayrolls(payList);
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  // Add Employee (UC-301, UC-302)
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cpf.trim() || !activeProject) return;

    if (!validateCPF(cpf)) {
      alert('CPF inválido! Por favor verifique os dígitos inseridos (UC-301).');
      return;
    }

    // Check duplicate CPF (UC-301)
    const existing = employees.find(emp => emp.cpf.replace(/\D/g, '') === cpf.replace(/\D/g, ''));
    if (existing) {
      alert('Erro: Já existe um funcionário cadastrado com este CPF (UC-301).');
      return;
    }

    const newEmp: Employee = {
      id: `emp_${Date.now()}`,
      projectId: activeProject.id,
      name: name.trim(),
      cpf: cpf.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@eldritch.com`,
      roleTitle: roleTitle.trim() || 'Colaborador',
      department,
      admissionDate: new Date().toISOString().split('T')[0],
      baseSalary,
      createdAt: new Date().toISOString()
    };

    await db.employees.put(newEmp);
    setShowAddModal(false);
    setName('');
    setCpf('');
    setEmail('');
    setRoleTitle('');
    await loadData();
    setSuccess(`Funcionário "${newEmp.name}" cadastrado com sucesso (UC-301)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Calculate Payroll (UC-303)
  const handleCalculatePayroll = async () => {
    if (!activeProject || employees.length === 0) return;

    for (const emp of employees) {
      const calc = calculatePayroll(emp.baseSalary);
      const record: PayrollRecord = {
        id: `pr_${emp.id}_${monthYear}`,
        projectId: activeProject.id,
        monthYear,
        employeeId: emp.id,
        employeeName: emp.name,
        baseSalary: emp.baseSalary,
        inssDeduction: calc.inss,
        irrfDeduction: calc.irrf,
        netSalary: calc.net,
        status: 'CALCULATED',
        createdAt: new Date().toISOString()
      };
      await db.payrollRecords.put(record);
    }

    await loadData();
    setSuccess(`Folha de pagamento de ${monthYear} calculada para ${employees.length} funcionários (UC-303)!`);
    setTimeout(() => setSuccess(null), 3500);
  };

  const activePayrolls = payrolls.filter(p => p.monthYear === monthYear);
  const totalGross = activePayrolls.reduce((acc, curr) => acc + curr.baseSalary, 0);
  const totalNet = activePayrolls.reduce((acc, curr) => acc + curr.netSalary, 0);

  return (
    <div className="hr-page-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            👥 Recursos Humanos & Folha de Pagamento (UC-301, UC-302, UC-303)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Gestão de funcionários, cargos salariais, cargos e cálculo automático de encargos e salário líquido.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => setActiveTab('EMPLOYEES')}
            style={{ background: activeTab === 'EMPLOYEES' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            👥 Funcionários
          </button>
          <button 
            onClick={() => setActiveTab('PAYROLL')}
            style={{ background: activeTab === 'PAYROLL' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            💵 Folha de Pagamento
          </button>
        </div>
      </header>

      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1rem' }}>
          {success}
        </div>
      )}

      {/* Tab Employees (UC-301, UC-302) */}
      {activeTab === 'EMPLOYEES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Quadro de Pessoal Ativo</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              ➕ Cadastrar Novo Funcionário (UC-301)
            </button>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '0.8rem 1rem' }}>Nome</th>
                  <th style={{ padding: '0.8rem 1rem' }}>CPF (Validação UC-301)</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Cargo (UC-302)</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Departamento</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Salário Base</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>{emp.name}</td>
                    <td style={{ padding: '0.8rem 1rem', opacity: 0.7 }}>{emp.cpf}</td>
                    <td style={{ padding: '0.8rem 1rem', color: '#60a5fa', fontWeight: 600 }}>{emp.roleTitle}</td>
                    <td style={{ padding: '0.8rem 1rem', opacity: 0.8 }}>{emp.department}</td>
                    <td style={{ padding: '0.8rem 1rem', color: '#10b981', fontWeight: 700 }}>R$ {emp.baseSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}

                {employees.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', opacity: 0.5, padding: '3rem 0' }}>
                      Nenhum funcionário cadastrado no sistema.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Payroll (UC-303) */}
      {activeTab === 'PAYROLL' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>💵 Fechamento de Folha de Pagamento (UC-303)</h2>
              <p style={{ margin: '0.3rem 0 0 0', opacity: 0.6, fontSize: '0.88rem' }}>Selecione o mês/ano para calcular os encargos trabalhistas de todos os colaboradores.</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="month"
                value={monthYear}
                onChange={e => setMonthYear(e.target.value)}
                style={{ padding: '0.5rem 0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              />
              <button 
                onClick={handleCalculatePayroll}
                style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
              >
                ⚡ Calcular Folha (UC-303)
              </button>
            </div>
          </div>

          {/* Payroll Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.2rem' }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Total Bruto da Empresa:</span>
              <h3 style={{ margin: '0.4rem 0 0 0', fontSize: '1.8rem', color: '#60a5fa' }}>R$ {totalGross.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.2rem' }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Total Líquido a Pagar aos Funcionários:</span>
              <h3 style={{ margin: '0.4rem 0 0 0', fontSize: '1.8rem', color: '#10b981' }}>R$ {totalNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>

          {/* Payroll Records Table */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '0.8rem 1rem' }}>Funcionário</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Salário Bruto</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Desconto INSS (8%)</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Desconto IRRF (5%)</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Salário Líquido</th>
                </tr>
              </thead>
              <tbody>
                {activePayrolls.map(pr => (
                  <tr key={pr.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>{pr.employeeName}</td>
                    <td style={{ padding: '0.8rem 1rem', opacity: 0.8 }}>R$ {pr.baseSalary.toFixed(2)}</td>
                    <td style={{ padding: '0.8rem 1rem', color: '#ef4444' }}>- R$ {pr.inssDeduction.toFixed(2)}</td>
                    <td style={{ padding: '0.8rem 1rem', color: '#ef4444' }}>- R$ {pr.irrfDeduction.toFixed(2)}</td>
                    <td style={{ padding: '0.8rem 1rem', color: '#10b981', fontWeight: 700 }}>R$ {pr.netSalary.toFixed(2)}</td>
                  </tr>
                ))}

                {activePayrolls.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', opacity: 0.5, padding: '3rem 0' }}>
                      Nenhuma folha calculada para a competência selecionada. Clique em "Calcular Folha".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Modal (UC-301) */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>👤 Cadastrar Novo Funcionário (UC-301)</h3>
            <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome Completo:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Carlos Silva"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>CPF (Com Validação):</label>
                  <input 
                    type="text"
                    required
                    placeholder="123.456.789-00"
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Salário Base (R$):</label>
                  <input 
                    type="number"
                    required
                    value={baseSalary}
                    onChange={e => setBaseSalary(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Cargo (UC-302):</label>
                <input 
                  type="text"
                  placeholder="Ex: Editor Sênior"
                  value={roleTitle}
                  onChange={e => setRoleTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Departamento:</label>
                <select 
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="Editorial">Editorial</option>
                  <option value="Arte & Design">Arte & Design</option>
                  <option value="Tradução">Tradução</option>
                  <option value="Administrativo">Administrativo</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Cadastrar Funcionário</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
