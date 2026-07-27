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

export interface ResearchNote {
  id: string;
  projectId: string;
  title: string; // UC-325: Notas atômicas (uma ideia por nota)
  content: string; // Conteúdo com suporte a wiki-links [[Título da Nota]] (UC-326)
  tags: string[];
  referenceId?: string; // Vínculo com fonte/referência (UC-317)
  createdAt: string;
  updatedAt: string;
}

export interface NoteLink {
  sourceNoteId: string;
  targetNoteId: string;
  sourceTitle: string;
  targetTitle: string;
}

/**
 * Formata uma referência bibliográfica de acordo com o estilo selecionado (UC-316).
 */
export function formatReference(ref: ReferenceItem, style: CitationStyle): string {
  const authorText = ref.authors.length > 0 ? ref.authors.join('; ') : 'AUTOR DESCONHECIDO';

  switch (style) {
    case 'ABNT': {
      const pub = ref.journalOrPublisher ? ` *${ref.journalOrPublisher}*` : '';
      const vol = ref.volume ? `, v. ${ref.volume}` : '';
      const pg = ref.pages ? `, p. ${ref.pages}` : '';
      return `${authorText.toUpperCase()}. **${ref.title}**.${pub}${vol}${pg}, ${ref.year}.`;
    }
    case 'APA': {
      const pub = ref.journalOrPublisher ? ` *${ref.journalOrPublisher}*` : '';
      const pg = ref.pages ? `, ${ref.pages}` : '';
      return `${authorText} (${ref.year}). ${ref.title}.${pub}${pg}.`;
    }
    case 'MLA': {
      const pub = ref.journalOrPublisher ? ` *${ref.journalOrPublisher}*` : '';
      return `${authorText}. "${ref.title}."${pub}, ${ref.year}.`;
    }
    case 'VANCOUVER': {
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

/**
 * Extrai conexões bidirecionais [[Título da Nota]] do texto da nota (UC-326).
 */
export function extractWikiLinks(content: string): string[] {
  const matches = content.match(/\[\[(.*?)\]\]/g) || [];
  return matches.map(m => m.replace(/^\[\[|\]\]$/g, '').trim());
}

/**
 * Converte o manuscrito/notas do projeto para o código-fonte LaTeX compilável e arquivo de bibliografia .bib (UC-321).
 */
export function exportToLaTeX(title: string, content: string, references: ReferenceItem[]): { tex: string; bib: string } {
  // Escapa caracteres especiais do LaTeX (UC-321)
  const escapedContent = content
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/&/g, '\\&')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_');

  const tex = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[brazil]{babel}
\\usepackage{cite}

\\title{${title}}
\\author{Eldritch Lich Research Engine}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introdução}
${escapedContent}

\\bibliographystyle{plain}
\\bibliography{references}

\\end{document}`;

  const bib = references
    .map(
      r => `@article{ref_${r.id},
  title = {${r.title}},
  author = {${r.authors.join(' and ')}},
  year = {${r.year}},
  journal = {${r.journalOrPublisher || 'N/A'}}
}`
    )
    .join('\n\n');

  return { tex, bib };
}
