"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRiskScore = calculateRiskScore;
exports.estimateLeadTimeMonteCarlo = estimateLeadTimeMonteCarlo;
/**
 * Calcula a criticidade do risco na matriz de calor (1 a 9).
 */
function calculateRiskScore(risk) {
    const probVal = risk.probability === 'LOW' ? 1 : risk.probability === 'MEDIUM' ? 2 : 3;
    const impVal = risk.impact === 'LOW' ? 1 : risk.impact === 'MEDIUM' ? 2 : 3;
    return probVal * impVal;
}
/**
 * Estima o prazo de entrega baseando-se em Monte Carlo sobre lead time histórico (UC-357).
 */
function estimateLeadTimeMonteCarlo(historicalTasks, complexity, numTasksToEstimate = 5, simulations = 1000) {
    const filtered = historicalTasks.filter(t => t.complexity === complexity);
    // Se histórico for insuficiente (< 10), utiliza estimativas padrão
    if (filtered.length < 10) {
        const defaultLeadTime = complexity === 'LOW' ? 3 : complexity === 'MEDIUM' ? 7 : 14;
        return {
            estimatedDays: defaultLeadTime * numTasksToEstimate,
            confidencePercent: 70, // Confiança inferior por histórico insuficiente
            marginOfErrorDays: Math.round(defaultLeadTime * 0.4 * numTasksToEstimate)
        };
    }
    // Coleta os lead times reais
    const leadTimes = filtered.map(t => t.leadTimeDays);
    const simulationResults = [];
    // Executa simulação estocástica
    for (let s = 0; s < simulations; s++) {
        let sum = 0;
        for (let i = 0; i < numTasksToEstimate; i++) {
            const randomIndex = Math.floor(Math.random() * leadTimes.length);
            sum += leadTimes[randomIndex];
        }
        simulationResults.push(sum);
    }
    // Ordena os resultados para obter os percentis
    simulationResults.sort((a, b) => a - b);
    // 85% de confiança (percentil 85)
    const p85Index = Math.floor(simulations * 0.85);
    const estimatedDays = simulationResults[p85Index];
    // Margem de erro com base na variabilidade (percentil 95 - percentil 50)
    const p50Index = Math.floor(simulations * 0.50);
    const marginOfError = Math.max(1, simulationResults[p85Index] - simulationResults[p50Index]);
    return {
        estimatedDays,
        confidencePercent: 85,
        marginOfErrorDays: marginOfError
    };
}
