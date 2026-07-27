"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCPF = validateCPF;
exports.calculatePayroll = calculatePayroll;
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
 * Calcula os impostos trabalhistas e salário líquido de um funcionário (UC-303).
 */
function calculatePayroll(baseSalary) {
    // Cálculo simplificado de alíquota INSS (8%) e IRRF (5%)
    const inss = Math.round(baseSalary * 0.08 * 100) / 100;
    const irrf = Math.round((baseSalary - inss) * 0.05 * 100) / 100;
    const net = Math.round((baseSalary - inss - irrf) * 100) / 100;
    return { inss, irrf, net };
}
