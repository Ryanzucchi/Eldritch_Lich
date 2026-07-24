export interface MediaAsset {
  id: string;
  projectId: string;
  title: string;
  url: string; // Base64 or DataURL
  category: 'character' | 'location' | 'map' | 'cover' | 'general';
  tags: string[];
  entityName?: string;
  fileSizeBytes: number;
  createdAt: string;
}

/**
 * Filtra imagens da galeria por busca de texto em título, tags ou entidades (UC-271).
 */
export function filterMediaAssets(
  assets: MediaAsset[],
  query: string,
  categoryFilter: string = 'ALL'
): MediaAsset[] {
  const q = query.trim().toLowerCase();

  return assets.filter(asset => {
    if (categoryFilter !== 'ALL' && asset.category !== categoryFilter) {
      return false;
    }

    if (!q) return true;

    const matchTitle = asset.title.toLowerCase().includes(q);
    const matchEntity = asset.entityName?.toLowerCase().includes(q);
    const matchTag = asset.tags.some(t => t.toLowerCase().includes(q));

    return matchTitle || matchEntity || matchTag;
  });
}
