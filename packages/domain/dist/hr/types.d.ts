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
    createdAt: string;
}
export interface PayrollRecord {
    id: string;
    projectId: string;
    monthYear: string;
    employeeId: string;
    employeeName: string;
    baseSalary: number;
    inssDeduction: number;
    irrfDeduction: number;
    netSalary: number;
    status: 'DRAFT' | 'CALCULATED' | 'APPROVED';
    createdAt: string;
}
/**
 * Valida o número de CPF (Algoritmo padrão de dígitos verificadores) (UC-301).
 */
export declare function validateCPF(cpf: string): boolean;
/**
 * Calcula os impostos trabalhistas e salário líquido de um funcionário (UC-303).
 */
export declare function calculatePayroll(baseSalary: number): {
    inss: number;
    irrf: number;
    net: number;
};
