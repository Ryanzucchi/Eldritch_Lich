"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCPF = validateCPF;
exports.calculatePayroll = calculatePayroll;
exports.generatePayslip = generatePayslip;
/**
 * Valida o número de CPF (Algoritmo padrão de dígitos verificadores) (UC-301).
 */
function validateCPF(cpf) {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11 || /^(\d)\1{10}$/.test(clean))
        return false;
    let sum = 0;
    for (let i = 0; i < 9; i++)
        sum += parseInt(clean.charAt(i)) * (10 - i);
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11)
        rev = 0;
    if (rev !== parseInt(clean.charAt(9)))
        return false;
    sum = 0;
    for (let i = 0; i < 10; i++)
        sum += parseInt(clean.charAt(i)) * (11 - i);
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11)
        rev = 0;
    if (rev !== parseInt(clean.charAt(10)))
        return false;
    return true;
}
/**
 * Calcula os impostos trabalhistas, FGTS patronal e salário líquido de um funcionário (UC-303, UC-304, UC-312).
 */
function calculatePayroll(baseSalary, benefits = 0) {
    const inss = Math.round(baseSalary * 0.08 * 100) / 100;
    const irrf = Math.round((baseSalary - inss) * 0.05 * 100) / 100;
    const fgts = Math.round(baseSalary * 0.08 * 100) / 100; // 8% FGTS Patronal (UC-312)
    const net = Math.round((baseSalary + benefits - inss - irrf) * 100) / 100;
    return { inss, irrf, fgts, net };
}
/**
 * Gera o documento estruturado de Holerite / Contracheque individual (UC-310).
 */
function generatePayslip(employee, payroll) {
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
