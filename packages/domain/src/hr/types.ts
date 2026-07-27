export interface Employee {
  id: string;
  projectId: string;
  name: string;
  cpf: string; // UC-301 (com validação de dígitos)
  email: string;
  roleTitle: string; // e.g. "Editor Chefe", "Ilustrador" (UC-302)
  department: string;
  admissionDate: string;
  baseSalary: number; // Salário base bruto
  vacationDaysBalance?: number; // UC-305: Saldo de dias de férias acumulados
  benefitsAllowance?: number; // UC-304: Vale Alimentação / Refeição / Saúde
  createdAt: string;
}

export interface PayrollRecord {
  id: string;
  projectId: string;
  monthYear: string; // YYYY-MM
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  benefitsAllowance: number; // UC-304
  inssDeduction: number; // UC-303, UC-312
  irrfDeduction: number; // UC-303, UC-312
  fgtsEmployerTax: number; // UC-312: FGTS (8% pago pela empresa)
  netSalary: number; // Salário Líquido (UC-303)
  status: 'DRAFT' | 'CALCULATED' | 'APPROVED';
  createdAt: string;
}

export interface VacationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
  type: 'VACATION' | 'MEDICAL_ABSENCE'; // UC-305
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface TimeClockPunch {
  id: string;
  employeeId: string;
  employeeName: string;
  punchTime: string; // ISO String oficial do servidor (UC-306)
  type: 'ENTRY' | 'EXIT';
  location?: string;
  createdAt: string;
}

/**
 * Valida o número de CPF (Algoritmo padrão de dígitos verificadores) (UC-301).
 */
export function validateCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11 || /^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(10))) return false;

  return true;
}

/**
 * Calcula os impostos trabalhistas, FGTS patronal e salário líquido de um funcionário (UC-303, UC-304, UC-312).
 */
export function calculatePayroll(baseSalary: number, benefits: number = 0): { inss: number; irrf: number; fgts: number; net: number } {
  const inss = Math.round(baseSalary * 0.08 * 100) / 100;
  const irrf = Math.round((baseSalary - inss) * 0.05 * 100) / 100;
  const fgts = Math.round(baseSalary * 0.08 * 100) / 100; // 8% FGTS Patronal (UC-312)
  const net = Math.round((baseSalary + benefits - inss - irrf) * 100) / 100;

  return { inss, irrf, fgts, net };
}

/**
 * Gera o documento estruturado de Holerite / Contracheque individual (UC-310).
 */
export function generatePayslip(employee: Employee, payroll: PayrollRecord): string {
  return `================================================
HOLERITE / CONTRACHEQUE DEMONSTRATIVO (UC-310)
Competência: ${payroll.monthYear}
================================================
Colaborador: ${employee.name} | CPF: ${employee.cpf}
Cargo: ${employee.roleTitle} | Depto: ${employee.department}

VENCIMENTOS (PROVENTOS):
- Salário Base: R$ ${payroll.baseSalary.toFixed(2)}
- Benefícios (VR/VA/VT): R$ ${payroll.benefitsAllowance.toFixed(2)}

DESCONTOS TRABALHISTAS (UC-312):
- INSS Retido (8%): R$ ${payroll.inssDeduction.toFixed(2)}
- IRRF Retido (5%): R$ ${payroll.irrfDeduction.toFixed(2)}

ENCARGOS PATRONAIS (INFORMATIVO):
- FGTS Depositado (8%): R$ ${payroll.fgtsEmployerTax.toFixed(2)}

------------------------------------------------
VALOR LÍQUIDO A RECEBER: R$ ${payroll.netSalary.toFixed(2)}
================================================`;
}
