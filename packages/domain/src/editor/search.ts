export interface SearchOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
  isRegex?: boolean;
}

export interface SearchMatch {
  index: number;
  length: number;
  text: string;
  contextSnippet: string;
}

export interface BacklinkMatch { manuscriptId: string; title: string; snippet: string; }

export function findManuscriptBacklinks(manuscripts: Array<{ id: string; title: string; content: string }>, targetTitle: string, excludedId?: string): BacklinkMatch[] {
  const marker = `[[${targetTitle}]]`;
  return manuscripts.filter(item => item.id !== excludedId && item.content.includes(marker)).map(item => {
    const index = item.content.indexOf(marker);
    return { manuscriptId: item.id, title: item.title, snippet: item.content.replace(/<[^>]+>/g, ' ').slice(Math.max(0, index - 60), index + marker.length + 80) };
  });
}

/**
 * Searches for matches in text (plain text or html text) with support for exact word, phrase, or regex/contextual queries.
 */
export function searchInText(content: string, query: string, options: SearchOptions = {}): SearchMatch[] {
  if (!content || !query) return [];

  const { caseSensitive = false, wholeWord = false, isRegex = false } = options;

  let patternStr = query;
  if (!isRegex) {
    // Escape regex special characters
    patternStr = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  if (wholeWord) {
    patternStr = `\\b${patternStr}\\b`;
  }

  const flags = caseSensitive ? 'g' : 'gi';
  let regex: RegExp;

  try {
    regex = new RegExp(patternStr, flags);
  } catch (err) {
    // Invalid regex fallback
    return [];
  }

  const matches: SearchMatch[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const index = match.index;
    const matchedText = match[0];
    const snippetStart = Math.max(0, index - 25);
    const snippetEnd = Math.min(content.length, index + matchedText.length + 25);
    const contextSnippet = (snippetStart > 0 ? '...' : '') + 
      content.substring(snippetStart, snippetEnd) + 
      (snippetEnd < content.length ? '...' : '');

    matches.push({
      index,
      length: matchedText.length,
      text: matchedText,
      contextSnippet
    });

    // Prevent infinite loop on empty matches
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
  }

  return matches;
}

/**
 * Replaces a single match by index and length
 */
export function replaceMatchInText(content: string, match: SearchMatch, replacement: string): string {
  if (!content || !match) return content;
  return content.substring(0, match.index) + replacement + content.substring(match.index + match.length);
}

/**
 * Replaces all matches in content returning updated text and total replacements count
 */
export function replaceAllInText(
  content: string, 
  query: string, 
  replacement: string, 
  options: SearchOptions = {}
): { updatedText: string; replacementCount: number } {
  const matches = searchInText(content, query, options);
  if (matches.length === 0) {
    return { updatedText: content, replacementCount: 0 };
  }

  // Replace backwards so indices remain valid
  let result = content;
  for (let i = matches.length - 1; i >= 0; i--) {
    result = replaceMatchInText(result, matches[i], replacement);
  }

  return {
    updatedText: result,
    replacementCount: matches.length
  };
}
