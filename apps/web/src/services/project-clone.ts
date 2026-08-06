import { EldritchDatabase } from '../db/schema';

type RecordLike = Record<string, unknown>;

const createId = () => typeof crypto !== 'undefined' && crypto.randomUUID
  ? crypto.randomUUID()
  : `clone_${Date.now()}_${Math.random().toString(36).slice(2)}`;

/**
 * Clona a base local de um projeto para outra base particionada por projectId.
 * O mapeamento é calculado antes da escrita para preservar referências entre tabelas.
 */
export async function cloneProjectDatabase(sourceProjectId: string, targetProjectId: string): Promise<number> {
  const source = new EldritchDatabase(sourceProjectId);
  const target = new EldritchDatabase(targetProjectId);
  await Promise.all([source.open(), target.open()]);

  try {
    const tables = source.tables.filter(table => table.name !== 'keyboardShortcuts');
    const sourceRows = new Map<string, RecordLike[]>();
    const idMap = new Map<string, string>();
    for (const table of tables) {
      const rows = await table.toArray() as RecordLike[];
      sourceRows.set(table.name, rows);
      for (const row of rows) {
        if (typeof row.id === 'string') idMap.set(row.id, createId());
      }
    }

    const remap = (value: unknown, field?: string): unknown => {
      if (typeof value === 'string') {
        if (field === 'projectId') return targetProjectId;
        return idMap.get(value) || value;
      }
      if (Array.isArray(value)) return value.map(item => remap(item));
      if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value as RecordLike).map(([key, item]) => [key, remap(item, key)]));
      }
      return value;
    };

    let copied = 0;
    await target.transaction('rw', target.tables.filter(table => table.name !== 'keyboardShortcuts'), async () => {
      for (const table of tables) {
        const destination = target.table(table.name);
        const rows = sourceRows.get(table.name) || [];
        const clones = rows.map(row => remap(row) as RecordLike);
        if (clones.length > 0) {
          await destination.bulkPut(clones);
          copied += clones.length;
        }
      }
    });
    return copied;
  } finally {
    source.close();
    target.close();
  }
}
