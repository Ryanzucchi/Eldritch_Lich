"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateProjectTotalCosts = calculateProjectTotalCosts;
exports.calculateProjectProfitability = calculateProjectProfitability;
/**
 * Calcula a soma dos custos agregados do projeto (UC-355).
 * Cruza despesas fixas manuais e custos de mão de obra proporcionais calculados a partir das alocações.
 */
function calculateProjectTotalCosts(projectId, allocations, costLogs, monthsRange = 1) {
    const manualCosts = costLogs
        .filter(log => log.projectId === projectId)
        .reduce((acc, log) => acc + log.amount, 0);
    const laborCosts = allocations
        .filter(alloc => alloc.projectId === projectId)
        .reduce((acc, alloc) => acc + (alloc.costPerMonth * (alloc.allocationPercent / 100)) * monthsRange, 0);
    return Math.round((manualCosts + laborCosts) * 100) / 100;
}
/**
 * Calcula DRE simplificado, Lucro Bruto, Margem e ROI (UC-356).
 */
function calculateProjectProfitability(financials) {
    const profit = financials.totalRevenue - financials.totalActualCost;
    const marginPercent = financials.totalRevenue > 0
        ? Math.round((profit / financials.totalRevenue) * 100)
        : 0;
    const roiPercent = financials.totalActualCost > 0
        ? Math.round((profit / financials.totalActualCost) * 100)
        : 0;
    return {
        profit,
        marginPercent,
        roiPercent,
        status: profit >= 0 ? 'LUCRO' : 'PREJUIZO'
    };
}
