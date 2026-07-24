import { Timeline, TimelineEvent } from './types.js';

export interface TimelineExportOptions {
  format: 'markdown' | 'json' | 'html';
  title?: string;
  eventsOnly?: boolean;
}

/**
 * Exporta a linha do tempo e seus eventos para formatos estruturados (JSON, Markdown ou HTML) (UC-171, UC-264).
 */
export function exportTimeline(
  timeline: Timeline,
  events: TimelineEvent[],
  options: TimelineExportOptions
): string {
  if (options.format === 'json') {
    return JSON.stringify({ timeline, events }, null, 2);
  }

  if (options.format === 'markdown') {
    let md = `# Cronologia: ${timeline.name}\n\n`;
    if (timeline.description) md += `*${timeline.description}*\n\n`;
    md += `--- \n\n`;

    events.forEach(ev => {
      md += `### ${ev.dateStr} — ${ev.title}\n`;
      if (ev.description) md += `${ev.description}\n\n`;
      if (ev.locationId) md += `- **Local:** ${ev.locationId}\n`;
      if (ev.characterIds && ev.characterIds.length > 0) md += `- **Personagens:** ${ev.characterIds.join(', ')}\n`;
      md += `\n`;
    });

    return md;
  }

  if (options.format === 'html') {
    let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Cronologia — ${timeline.name}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
    h1 { color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; }
    .event-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
    .event-date { color: #60a5fa; font-weight: bold; font-size: 0.85rem; }
    .badge { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; margin-right: 0.4rem; }
    .badge-loc { background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid #3b82f6; }
    .badge-char { background: rgba(168, 85, 247, 0.2); color: #e9d5ff; border: 1px solid #a855f7; }
  </style>
</head>
<body>
  <h1>🗓️ ${timeline.name}</h1>
  ${timeline.description ? `<p><em>${timeline.description}</em></p>` : ''}
  <hr style="border-color: rgba(255,255,255,0.1); margin-bottom: 1.5rem;" />
  <div className="events">
`;
    events.forEach(ev => {
      html += `    <div class="event-card">
      <div class="event-date">${ev.dateStr}</div>
      <h3>${ev.title}</h3>
      ${ev.description ? `<p>${ev.description}</p>` : ''}
      ${ev.locationId ? `<span class="badge badge-loc">📍 ${ev.locationId}</span>` : ''}
      ${ev.characterIds ? ev.characterIds.map(c => `<span class="badge badge-char">👤 ${c}</span>`).join('') : ''}
    </div>\n`;
    });
    html += `  </div>
</body>
</html>`;
    return html;
  }

  return '';
}
