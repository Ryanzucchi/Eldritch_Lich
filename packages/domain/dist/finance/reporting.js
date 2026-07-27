"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIncomeStatement = generateIncomeStatement;
exports.generateBalanceSheet = generateBalanceSheet;
exports.predictFutureCashFlowCurves = predictFutureCashFlowCurves;
/**
 * Gera DRE contábil simplificado e detecta transações pendentes de classificação (UC-389).
 */
function generateIncomeStatement(transactions) {
    const settled = transactions.filter(t => !!t.paymentDate);
    const grossRevenue = settled
        .filter(t => t.type === 'REVENUE')
        .reduce((acc, t) => acc + t.amount, 0);
    // Considera 5% de deduções padrão sobre receitas
    const deductions = grossRevenue * 0.05;
    const netRevenue = grossRevenue - deductions;
    const operatingExpenses = settled
        .filter(t => t.type === 'EXPENSE')
        .reduce((acc, t) => acc + t.amount, 0);
    const netIncome = netRevenue - operatingExpenses;
    // Transações não categorizadas
    const unclassifiedCount = settled.filter(t => !t.category).length;
    return {
        grossRevenue: Math.round(grossRevenue * 100) / 100,
        deductions: Math.round(deductions * 100) / 100,
        netRevenue: Math.round(netRevenue * 100) / 100,
        operatingExpenses: Math.round(operatingExpenses * 100) / 100,
        netIncome: Math.round(netIncome * 100) / 100,
        unclassifiedTransactionsCount: unclassifiedCount
    };
}
/**
 * Estrutura Balanço Patrimonial (UC-389)
 */
function generateBalanceSheet(transactions, bankBalance = 120000) {
    const settled = transactions.filter(t => !!t.paymentDate);
    const revenueSum = settled.filter(t => t.type === 'REVENUE').reduce((acc, t) => acc + t.amount, 0);
    const expenseSum = settled.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    const currentEquity = bankBalance + revenueSum - expenseSum;
    const assets = [
        { name: 'Disponibilidades (Caixa e Bancos)', amount: bankBalance },
        { name: 'Contas a Receber Clientes', amount: transactions.filter(t => t.type === 'REVENUE' && t.status === 'PENDING').reduce((acc, t) => acc + t.amount, 0) }
    ];
    const liabilities = [
        { name: 'Fornecedores a Pagar', amount: transactions.filter(t => t.type === 'EXPENSE' && t.status === 'PENDING').reduce((acc, t) => acc + t.amount, 0) }
    ];
    const equity = [
        { name: 'Capital Social Registrado', amount: bankBalance },
        { name: 'Lucros/Prejuízos Acumulados', amount: revenueSum - expenseSum }
    ];
    const totalAssets = assets.reduce((acc, a) => acc + a.amount, 0);
    const totalLiabilitiesAndEquity = liabilities.reduce((acc, l) => acc + l.amount, 0) + equity.reduce((acc, e) => acc + e.amount, 0);
    return {
        assets,
        liabilities,
        equity,
        totalAssets,
        totalLiabilitiesAndEquity
    };
}
/**
 * Gera Previsão de Saldo de Caixa Futuro em 3 Cenários (UC-392)
 */
function predictFutureCashFlowCurves(transactions, initialBalance = 100000, monthsRange = 6) {
    const curves = [];
    let currentRealistic = initialBalance;
    let currentOptimistic = initialBalance;
    let currentPessimistic = initialBalance;
    // Coleta dados mensais de receitas e despesas
    const pendingRevenues = transactions.filter(t => t.type === 'REVENUE' && t.status === 'PENDING');
    const pendingExpenses = transactions.filter(t => t.type === 'EXPENSE' && t.status === 'PENDING');
    const monthlyRevenue = pendingRevenues.reduce((acc, t) => acc + t.amount, 0) / (monthsRange || 1);
    const monthlyExpense = pendingExpenses.reduce((acc, t) => acc + t.amount, 0) / (monthsRange || 1);
    for (let m = 1; m <= monthsRange; m++) {
        const date = `Mês +${m}`;
        // Projeções
        currentRealistic += monthlyRevenue - monthlyExpense;
        currentOptimistic += (monthlyRevenue * 1.25) - (monthlyExpense * 0.9);
        currentPessimistic += (monthlyRevenue * 0.75) - (monthlyExpense * 1.15);
        curves.push({
            date,
            realisticAmount: Math.round(currentRealistic * 100) / 100,
            optimisticAmount: Math.round(currentOptimistic * 100) / 100,
            pessimisticAmount: Math.round(currentPessimistic * 100) / 100
        });
    }
    return curves;
}
