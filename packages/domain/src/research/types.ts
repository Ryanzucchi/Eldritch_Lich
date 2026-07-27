export type CitationStyle = 'ABNT' | 'APA' | 'MLA' | 'VANCOUVER';

export interface ReferenceItem {
  id: string;
  projectId: string;
  type: 'JOURNAL_ARTICLE' | 'BOOK' | 'CONFERENCE_PAPER' | 'WEBSITE';
  title: string;
  authors: string[]; // e.g. ["Silva, João", "Santos, Maria"]
  journalOrPublisher?: string;
  year: number;
  volume?: string;
  pages?: string;
  doi?: string;
  url?: string;
  createdAt: string;
}

/**
 * Formata uma referência bibliográfica de acordo com o estilo selecionado (UC-316).
 */
export function formatReference(ref: ReferenceItem, style: CitationStyle): string {
  const authorText = ref.authors.length > 0 ? ref.authors.join('; ') : 'AUTOR DESCONHECIDO';

  switch (style) {
    case 'ABNT': {
      // Padrão ABNT NBR 6023 (UC-316)
      const pub = ref.journalOrPublisher ? ` *${ref.journalOrPublisher}*` : '';
      const vol = ref.volume ? `, v. ${ref.volume}` : '';
      const pg = ref.pages ? `, p. ${ref.pages}` : '';
      return `${authorText.toUpperCase()}. **${ref.title}**.${pub}${vol}${pg}, ${ref.year}.`;
    }
    case 'APA': {
      // Padrão APA 7th (UC-316)
      const pub = ref.journalOrPublisher ? ` *${ref.journalOrPublisher}*` : '';
      const pg = ref.pages ? `, ${ref.pages}` : '';
      return `${authorText} (${ref.year}). ${ref.title}.${pub}${pg}.`;
    }
    case 'MLA': {
      // Padrão MLA (UC-316)
      const pub = ref.journalOrPublisher ? ` *${ref.journalOrPublisher}*` : '';
      return `${authorText}. "${ref.title}."${pub}, ${ref.year}.`;
    }
    case 'VANCOUVER': {
      // Padrão Vancouver (UC-316)
      const pub = ref.journalOrPublisher ? ` ${ref.journalOrPublisher}.` : '';
      return `${authorText}. ${ref.title}.${pub} ${ref.year};${ref.volume || ''}:${ref.pages || ''}.`;
    }
    default:
      return `${authorText}. ${ref.title}, ${ref.year}.`;
  }
}

/**
 * Converte referências BibTeX/RIS simplificadas para instâncias do sistema (UC-313).
 */
export function parseBibTeX(bibtexString: string, projectId: string): Partial<ReferenceItem>[] {
  const items: Partial<ReferenceItem>[] = [];
  const entries = bibtexString.split('@').filter(Boolean);

  for (const entry of entries) {
    const titleMatch = entry.match(/title\s*=\s*[{"]([^}"]+)[}"]/i);
    const authorMatch = entry.match(/author\s*=\s*[{"]([^}"]+)[}"]/i);
    const yearMatch = entry.match(/year\s*=\s*[{"]?(\d{4})[}"]?/i);

    if (titleMatch) {
      items.push({
        projectId,
        type: 'JOURNAL_ARTICLE',
        title: titleMatch[1],
        authors: authorMatch ? authorMatch[1].split(/\s+and\s+/i) : ['Anônimo'],
        year: yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear(),
        createdAt: new Date().toISOString()
      });
    }
  }

  return items;
}
