export interface ProjectRisk {
  id: string;
  projectId: string;
  description: string; // UC-358
  category: 'TECHNICAL' | 'FINANCIAL' | 'OPERATIONAL' | 'EXTERNAL';
  probability: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'IDENTIFIED' | 'MITIGATED' | 'CONTINGENCY_ACTIVE'; // UC-359
  mitigationPlan?: string; // Plano de Mitigação (UC-359)
  contingencyPlan?: string; // Plano de Contingência
  ownerEmail?: string; // Colaborador responsável
  createdAt: string;
}

export interface HistoricalTask {
  id: string;
  projectId: string;
  executorEmail: string;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  leadTimeDays: number; // Lead time real gasto para concluir
  createdAt: string;
  completedAt: string;
}

export interface LeadTimeEstimationResult {
  estimatedDays: number; // Dias previstos (UC-357)
  confidencePercent: number; // Porcentagem de confiança
  marginOfErrorDays: number; // Margem de erro (+/-)
}

/**
 * Calcula a criticidade do risco na matriz de calor (1 a 9).
 */
export function calculateRiskScore(risk: ProjectRisk): number {
  const probVal = risk.probability === 'LOW' ? 1 : risk.probability === 'MEDIUM' ? 2 : 3;
  const impVal = risk.impact === 'LOW' ? 1 : risk.impact === 'MEDIUM' ? 2 : 3;
  return probVal * impVal;
}

/**
 * Estima o prazo de entrega baseando-se em Monte Carlo sobre lead time histórico (UC-357).
 */
export function estimateLeadTimeMonteCarlo(
  historicalTasks: HistoricalTask[],
  complexity: 'LOW' | 'MEDIUM' | 'HIGH',
  numTasksToEstimate: number = 5,
  simulations: number = 1000
): LeadTimeEstimationResult {
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
  const simulationResults: number[] = [];

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
