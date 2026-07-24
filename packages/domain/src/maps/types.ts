export interface GeoMapMarker {
  id: string;
  mapId: string;
  entityId?: string;
  name: string;
  type: 'location' | 'character' | 'faction' | 'item' | 'custom';
  icon?: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  dateStr?: string; // Presence timestamp (UC-101)
  description?: string;
}

export interface GeoMap {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  scaleKmPerPixel?: number; // Scale ratio for measurement tool (UC-099)
  createdAt: string;
  updatedAt: string;
}

/**
 * Calcula a distância em quilômetros fictícios entre dois pontos no mapa usando a escala definida (UC-099).
 */
export function calculateMapDistanceKm(
  x1Px: number,
  y1Px: number,
  x2Px: number,
  y2Px: number,
  scaleKmPerPixel: number = 1
): number {
  const dx = x2Px - x1Px;
  const dy = y2Px - y1Px;
  const pixelDistance = Math.sqrt(dx * dx + dy * dy);
  return pixelDistance * scaleKmPerPixel;
}
