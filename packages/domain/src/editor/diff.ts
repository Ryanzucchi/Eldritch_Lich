export interface DiffChunk {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

export interface DiffResult {
  chunks: DiffChunk[];
  addedWords: number;
  removedWords: number;
  unchangedWords: number;
}

/**
 * Computes word-level diff between oldText and newText (handling HTML tags cleanly by stripping or tokenizing)
 */
export function computeWordDiff(oldText: string, newText: string): DiffResult {
  // Strip HTML tags for clean text comparison if HTML is provided
  const cleanOld = stripHtmlTags(oldText);
  const cleanNew = stripHtmlTags(newText);

  const oldWords = tokenizeWords(cleanOld);
  const newWords = tokenizeWords(cleanNew);

  const lcsMatrix = computeLCSMatrix(oldWords, newWords);

  const chunks: DiffChunk[] = [];
  let i = oldWords.length;
  let j = newWords.length;

  const rawChunks: DiffChunk[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      rawChunks.push({ type: 'unchanged', text: oldWords[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])) {
      rawChunks.push({ type: 'added', text: newWords[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || lcsMatrix[i][j - 1] < lcsMatrix[i - 1][j])) {
      rawChunks.push({ type: 'removed', text: oldWords[i - 1] });
      i--;
    }
  }

  rawChunks.reverse();

  // Consolidate consecutive chunks of same type
  let addedWords = 0;
  let removedWords = 0;
  let unchangedWords = 0;

  for (const chunk of rawChunks) {
    const wordCount = chunk.text.trim().split(/\s+/).filter(Boolean).length;
    if (chunk.type === 'added') addedWords += wordCount;
    else if (chunk.type === 'removed') removedWords += wordCount;
    else unchangedWords += wordCount;

    if (chunks.length > 0 && chunks[chunks.length - 1].type === chunk.type) {
      chunks[chunks.length - 1].text += chunk.text;
    } else {
      chunks.push({ ...chunk });
    }
  }

  return {
    chunks,
    addedWords,
    removedWords,
    unchangedWords
  };
}

function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ');
}

function tokenizeWords(text: string): string[] {
  if (!text) return [];
  // Tokenize by word boundary keeping whitespace attached
  return text.match(/\S+|\s+/g) || [];
}

function computeLCSMatrix(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
}
