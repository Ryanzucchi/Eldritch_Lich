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
  createdAt: string;
}

export interface PayrollRecord {
  id: string;
  projectId: string;
  monthYear: string; // YYYY-MM
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  inssDeduction: number; // UC-303
  irrfDeduction: number; // UC-303
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
 * Calcula os impostos trabalhistas e salário líquido de um funcionário (UC-303).
 */
export function calculatePayroll(baseSalary: number): { inss: number; irrf: number; net: number } {
  const inss = Math.round(baseSalary * 0.08 * 100) / 100;
  const irrf = Math.round((baseSalary - inss) * 0.05 * 100) / 100;
  const net = Math.round((baseSalary - inss - irrf) * 100) / 100;

  return { inss, irrf, net };
}
