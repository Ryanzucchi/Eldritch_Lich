import type { EntityCategory } from './manuscript-extraction';

export type LocalLinguisticEntity = {
  text: string;
  label: 'PER' | 'LOC' | 'ORG' | 'MISC';
  start: number;
  end: number;
  confidence?: number;
};

export type LocalLinguisticAnalysis = {
  entities: LocalLinguisticEntity[];
  engine: 'stanza-local';
};

const typeForLabel: Record<LocalLinguisticEntity['label'], EntityCategory | undefined> = {
  PER: 'Personagem', LOC: 'Local', ORG: 'Organizacao', MISC: undefined
};

export const entityCategoryFromLocalLabel = (label: LocalLinguisticEntity['label']) => typeForLabel[label];

/**
 * Calls a service on the same machine only when explicitly configured. A missing
 * local companion must never block writing or make the app call a cloud service.
 */
export async function analyzeWithLocalLinguistics(text: string): Promise<LocalLinguisticAnalysis | null> {
  const baseUrl = process.env.NEXT_PUBLIC_LOCAL_LINGUISTICS_URL?.replace(/\/$/, '');
  if (!baseUrl || typeof window === 'undefined') return null;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(`${baseUrl}/analyze`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, language: 'pt' }), signal: controller.signal
    });
    if (!response.ok) return null;
    const payload = await response.json() as Partial<LocalLinguisticAnalysis>;
    if (!Array.isArray(payload.entities)) return null;
    return { engine: 'stanza-local', entities: payload.entities.filter(entity => entity && typeof entity.text === 'string' && typeof entity.start === 'number' && typeof entity.end === 'number' && ['PER', 'LOC', 'ORG', 'MISC'].includes(entity.label ?? '')) as LocalLinguisticEntity[] };
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}
