export interface MediaAsset {
    id: string;
    projectId: string;
    title: string;
    url: string;
    category: 'character' | 'location' | 'map' | 'cover' | 'general';
    tags: string[];
    entityName?: string;
    fileSizeBytes: number;
    createdAt: string;
}
/**
 * Filtra imagens da galeria por busca de texto em título, tags ou entidades (UC-271).
 */
export declare function filterMediaAssets(assets: MediaAsset[], query: string, categoryFilter?: string): MediaAsset[];
