import { db } from '../db/schema';

type DataRecord = Record<string, unknown>;
export type AuditSeverity = 'erro' | 'atenção' | 'informação';
export type AuditFinding = { area: string; severity: AuditSeverity; location: string; message: string; suggestion: string };
export type ProjectDump = { format: 'eldritch-lich.indexeddb-export.v1'; exportedAt: string; projectId: string; tables: Record<string, DataRecord[]> };

const ids = (rows: DataRecord[]) => new Set(rows.map(row => String(row.id ?? '')).filter(Boolean));

/** Exports every Dexie table relevant to a project without relying on server-side JSON mirrors. */
export async function exportProjectIndexedDb(projectId: string): Promise<ProjectDump> {
  // The database name itself contains the active project ID.  Therefore every
  // record in this Dexie instance belongs to the selected project, including
  // older tables that predate an explicit `projectId` column.
  const tables = Object.fromEntries(await Promise.all(db.tables.map(async table => [table.name, await table.toArray() as DataRecord[]]))) as Record<string, DataRecord[]>;
  return { format: 'eldritch-lich.indexeddb-export.v1', exportedAt: new Date().toISOString(), projectId, tables };
}

const referenceChecks: Array<[string, string, string]> = [
  ['familyRelations', 'personId', 'characterSheets'], ['familyRelations', 'relatedPersonId', 'characterSheets'], ['itemSheets', 'ownerCharacterId', 'characterSheets'], ['itemSheets', 'locationId', 'locationSheets'], ['locationSheets', 'factionId', 'factionSheets'], ['creatureSheets', 'habitatLocationId', 'locationSheets'], ['historicalEventSheets', 'locationId', 'locationSheets'], ['timelineEvents', 'timelineId', 'timelines'], ['comments', 'manuscriptId', 'manuscripts'], ['manuscriptVersions', 'manuscriptId', 'manuscripts'], ['pendingSaves', 'manuscriptId', 'manuscripts'], ['automationHistories', 'manuscriptId', 'manuscripts'],
];

export function auditProjectDump(dump: ProjectDump): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const tables = dump.tables;
  for (const [table, field, target] of referenceChecks) {
    const targetIds = ids(tables[target] ?? []);
    for (const row of tables[table] ?? []) {
      const reference = row[field];
      if (reference && !targetIds.has(String(reference))) findings.push({ area: 'Referências órfãs', severity: 'erro', location: `${table} id=${row.id}`, message: `${field}=${reference} não existe em ${target}.`, suggestion: 'Restaurar o registro referido ou remover/corrigir a referência.' });
    }
  }
  for (const table of ['wikiEntities', 'characterSheets', 'factionSheets', 'locationSheets', 'creatureSheets', 'itemSheets']) {
    const seen = new Map<string, DataRecord>();
    for (const row of tables[table] ?? []) {
      const name = typeof row.name === 'string' ? row.name.trim().toLocaleLowerCase('pt-BR') : '';
      if (!name) continue;
      const prior = seen.get(name);
      if (prior) findings.push({ area: 'Categorização de entidades', severity: 'atenção', location: `${table} ids=${prior.id},${row.id}`, message: `Nome duplicado: “${row.name}”.`, suggestion: 'Comparar as fichas com o manuscrito e fundir somente se representarem a mesma entidade.' });
      else seen.set(name, row);
    }
  }
  const relations = tables.familyRelations ?? [];
  const relationKeys = new Set<string>();
  for (const relation of relations) {
    const key = [relation.personId, relation.relatedPersonId, relation.relationType].join('|');
    if (relationKeys.has(key)) findings.push({ area: 'Genealogia', severity: 'erro', location: `familyRelations id=${relation.id}`, message: 'Relação familiar duplicada.', suggestion: 'Manter somente uma aresta para a mesma relação.' });
    relationKeys.add(key);
    if (relation.personId === relation.relatedPersonId) findings.push({ area: 'Genealogia', severity: 'erro', location: `familyRelations id=${relation.id}`, message: 'Uma pessoa está relacionada consigo mesma.', suggestion: 'Corrigir ou remover a relação.' });
  }
  const events = tables.timelineEvents ?? [];
  const timelineOrders = new Set<string>();
  for (const event of events) {
    const key = `${event.timelineId}|${event.sortOrder}`;
    if (timelineOrders.has(key)) findings.push({ area: 'Cronologia', severity: 'atenção', location: `timelineEvents id=${event.id}`, message: `sortOrder duplicado (${event.sortOrder}) na mesma linha do tempo.`, suggestion: 'Reordenar os eventos conforme a sequência narrativa.' });
    timelineOrders.add(key);
  }
  for (const manuscript of tables.manuscripts ?? []) {
    const content = typeof manuscript.content === 'string' ? manuscript.content : '';
    if (/^\s*&lt;(?:p|h[1-6]|div)/i.test(content)) findings.push({ area: 'Importação/exportação', severity: 'erro', location: `manuscripts id=${manuscript.id}`, message: 'Conteúdo HTML está codificado como texto (`&lt;...&gt;`).', suggestion: 'Decodificar uma vez para HTML real antes de abrir no editor ou analisar o texto.' });
  }
  for (const history of tables.automationHistories ?? []) {
    if (!history.source || !history.status || !history.createdAt) findings.push({ area: 'Histórico de automações', severity: 'atenção', location: `automationHistories id=${history.id}`, message: 'Registro automático incompleto.', suggestion: 'Salvar fonte, estado e data em cada coleta.' });
  }
  return findings;
}
