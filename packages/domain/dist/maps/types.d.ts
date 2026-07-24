export interface GeoMapMarker {
    id: string;
    mapId: string;
    entityId?: string;
    name: string;
    type: 'location' | 'character' | 'faction' | 'item' | 'custom';
    icon?: string;
    xPercent: number;
    yPercent: number;
    dateStr?: string;
    description?: string;
}
export interface GeoMap {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    imageUrl?: string;
    scaleKmPerPixel?: number;
    createdAt: string;
    updatedAt: string;
}
/**
 * Calcula a distância em quilômetros fictícios entre dois pontos no mapa usando a escala definida (UC-099).
 */
export declare function calculateMapDistanceKm(x1Px: number, y1Px: number, x2Px: number, y2Px: number, scaleKmPerPixel?: number): number;
