export interface Employee {
    id: string;
    projectId: string;
    name: string;
    cpf: string;
    email: string;
    roleTitle: string;
    department: string;
    admissionDate: string;
    baseSalary: number;
    vacationDaysBalance?: number;
    benefitsAllowance?: number;
    createdAt: string;
}
export interface PayrollRecord {
    id: string;
    projectId: string;
    monthYear: string;
    employeeId: string;
    employeeName: string;
    baseSalary: number;
    benefitsAllowance: number;
    inssDeduction: number;
    irrfDeduction: number;
    fgtsEmployerTax: number;
    netSalary: number;
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
    type: 'VACATION' | 'MEDICAL_ABSENCE';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
}
export interface TimeClockPunch {
    id: string;
    employeeId: string;
    employeeName: string;
    punchTime: string;
    type: 'ENTRY' | 'EXIT';
    location?: string;
    createdAt: string;
}
/**
 * Valida o número de CPF (Algoritmo padrão de dígitos verificadores) (UC-301).
 */
export declare function validateCPF(cpf: string): boolean;
/**
 * Calcula os impostos trabalhistas, FGTS patronal e salário líquido de um funcionário (UC-303, UC-304, UC-312).
 */
export declare function calculatePayroll(baseSalary: number, benefits?: number): {
    inss: number;
    irrf: number;
    fgts: number;
    net: number;
};
/**
 * Gera o documento estruturado de Holerite / Contracheque individual (UC-310).
 */
export declare function generatePayslip(employee: Employee, payroll: PayrollRecord): string;
