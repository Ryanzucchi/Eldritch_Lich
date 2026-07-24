"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeCallAudio = transcribeCallAudio;
/**
 * Simula a transcrição por IA de uma chamada gravada com marcas de tempo e diarização (UC-367).
 */
function transcribeCallAudio(callTitle, durationMinutes) {
    return `[TRANSCRIÇÃO AUTOMÁTICA POR IA - ${callTitle}]
Duração: ${durationMinutes} min | Acurácia estimada: 96% (WER < 12%)

[00:00:05] Autor Principal: "Pessoal, vamos iniciar o alinhamento da história do capítulo 3."
[00:00:45] Coautor / Editor: "Perfeito, analisei os arcos dramáticos e sugiro elevar a tensão no climax."
[00:02:10] Autor Principal: "Concordo totalmente! Vou ajustar a cena da taverna."
[00:05:00] [Fim da Transcrição Automática]`;
}
