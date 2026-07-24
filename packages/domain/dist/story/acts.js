"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAN_HARMON_STORY_CIRCLE = exports.CLASSIC_HERO_JOURNEY_STAGES = void 0;
exports.calculateDramaticPacing = calculateDramaticPacing;
exports.CLASSIC_HERO_JOURNEY_STAGES = [
    '1. Mundo Comum',
    '2. Chamado à Aventura',
    '3. Recusa do Chamado',
    '4. Encontro com o Mentor',
    '5. Travessia do Primeiro Limiar',
    '6. Testes, Aliados e Inimigos',
    '7. Aproximação da Caverna Oculta',
    '8. Provação Suprema',
    '9. Recompensa (A Espada)',
    '10. O Caminho de Volta',
    '11. Ressurreição',
    '12. Retorno com o Elixir'
];
exports.DAN_HARMON_STORY_CIRCLE = [
    '1. Um personagem na sua zona de conforto (YOU)',
    '2. Mas ele deseja algo (NEED)',
    '3. Ele entra em uma situação não familiar (GO)',
    '4. Adapta-se a ela (SEARCH)',
    '5. Consegue o que queria (FIND)',
    '6. Paga um preço alto por isso (TAKE)',
    '7. Retorna à situação familiar (RETURN)',
    '8. Mudou/transformou-se (CHANGE)'
];
/**
 * Calcula o ritmo e tensão média do enredo a partir dos pontos de arco dramático (UC-398).
 */
function calculateDramaticPacing(points) {
    if (points.length === 0) {
        return { averageTension: 0, pacingTrend: 'ESTAVEL' };
    }
    const sum = points.reduce((acc, p) => acc + p.tensionLevel, 0);
    const avg = sum / points.length;
    let peak = points[0];
    points.forEach(p => {
        if (p.tensionLevel > peak.tensionLevel)
            peak = p;
    });
    const firstHalf = points.slice(0, Math.ceil(points.length / 2));
    const secondHalf = points.slice(Math.ceil(points.length / 2));
    const avgFirst = firstHalf.reduce((acc, p) => acc + p.tensionLevel, 0) / (firstHalf.length || 1);
    const avgSecond = secondHalf.reduce((acc, p) => acc + p.tensionLevel, 0) / (secondHalf.length || 1);
    let trend = 'ESTAVEL';
    if (avgSecond - avgFirst > 10)
        trend = 'CRESCENTE';
    else if (avgFirst - avgSecond > 10)
        trend = 'DECRESCENTE';
    return {
        averageTension: Math.round(avg),
        peakPoint: peak,
        pacingTrend: trend
    };
}
