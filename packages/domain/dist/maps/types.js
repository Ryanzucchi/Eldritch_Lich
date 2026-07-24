"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMapDistanceKm = calculateMapDistanceKm;
/**
 * Calcula a distância em quilômetros fictícios entre dois pontos no mapa usando a escala definida (UC-099).
 */
function calculateMapDistanceKm(x1Px, y1Px, x2Px, y2Px, scaleKmPerPixel = 1) {
    const dx = x2Px - x1Px;
    const dy = y2Px - y1Px;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    return pixelDistance * scaleKmPerPixel;
}
