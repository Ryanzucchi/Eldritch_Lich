'use client';

import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { auditProjectDump, exportProjectIndexedDb, AuditFinding } from '../../services/project-audit';

export default function AuditPage() {
  const { activeProject } = useApp();
  const [findings, setFindings] = useState<AuditFinding[] | null>(null);
  const [exportedAt, setExportedAt] = useState('');
  const [busy, setBusy] = useState(false);
  const runAudit = async (download = false) => {
    if (!activeProject) return;
    setBusy(true);
    try {
      const dump = await exportProjectIndexedDb(activeProject.id);
      setFindings(auditProjectDump(dump));
      setExportedAt(new Date(dump.exportedAt).toLocaleString('pt-BR'));
      if (download) {
        const href = URL.createObjectURL(new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' }));
        const link = document.createElement('a');
        link.href = href; link.download = `${activeProject.name.toLowerCase().replace(/[^a-z0-9]+/gi, '_')}_indexeddb.json`; link.click();
        URL.revokeObjectURL(href);
      }
    } finally { setBusy(false); }
  };
  return <main className="page"><header className="page-heading"><div><p className="eyebrow">Pesquisa e análise</p><h1>Auditoria de dados</h1><p>Verifica dados reais do IndexedDB do projeto e permite exportar o dump completo para revisão externa.</p></div><div className="page-actions"><button className="secondary-button" disabled={busy || !activeProject} onClick={() => void runAudit(true)}>Exportar JSON</button><button className="primary-button" disabled={busy || !activeProject} onClick={() => void runAudit()}>{busy ? 'Auditando…' : 'Auditar projeto'}</button></div></header>{exportedAt && <p className="notification-success">Dados lidos em {exportedAt}.</p>}{findings === null ? <section className="empty-state"><h2>Pronto para auditar.</h2><p>A análise identifica referências órfãs, duplicidades, erros de genealogia, conflitos de ordem cronológica e HTML importado de forma incorreta.</p></section> : <section className="lore-grid">{findings.map((finding, index) => <article className="surface-card" key={`${finding.location}-${index}`}><small>{finding.area} · {finding.severity}</small><h2>{finding.location}</h2><p>{finding.message}</p><p className="muted">{finding.suggestion}</p></article>)}{!findings.length && <div className="empty-state"><h2>Nenhum problema estrutural encontrado.</h2><p>Para validar fidelidade literária, compare o dump exportado com o PDF-fonte.</p></div>}</section>}</main>;
}
