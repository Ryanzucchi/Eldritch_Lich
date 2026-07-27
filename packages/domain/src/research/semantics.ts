export interface SemanticTextGroup {
  groupId: string;
  themeTitle: string; // Título sugerido pela IA (UC-021)
  fileIds: string[];
  confidence: number;
}

export interface LexicalFrequency {
  term: string;
  count: number;
  variations: string[]; // Variações lematizadas/stemmed agrupadas (UC-020)
}

export interface WordContextDefinition {
  word: string;
  contextDefinition: string; // Definição contextual precisa (UC-030)
  synonyms: string[]; // Sinônimos sugeridos (UC-030)
}

export interface ContextualWordLink {
  id: string;
  sourceWord: string;
  targetWord: string;
  contextReason: string; // Relação semântica explicada (UC-033)
}

/**
 * Remove stopwords brasileiras/portuguesas e calcula frequências lematizadas de palavras (UC-020).
 */
export function groupAndAnalyzeLexicon(
  text: string,
  excludeTerms: string[] = []
): LexicalFrequency[] {
  const stopwords = new Set([
    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
    'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'com', 'que', 'se', 'ao', 'aos', 'ou',
    'e', 'é', 'um', 'como', 'mais', 'mas', 'esta', 'este', 'seu', 'sua'
  ]);
  
  const wordsRegex = /\b[\wÀ-ÿ'-]+\b/g;
  const counts: { [key: string]: { count: number; variations: Set<string> } } = {};
  
  let match;
  while ((match = wordsRegex.exec(text)) !== null) {
    const word = match[0];
    const lower = word.toLowerCase();
    
    if (stopwords.has(lower) || excludeTerms.includes(lower)) continue;
    
    // Stemming simplificado (agrupando plurais e variações comuns à mesma raiz)
    let stem = lower;
    if (lower.endsWith('s') && lower.length > 3) {
      if (lower.endsWith('ões')) stem = lower.substring(0, lower.length - 3) + 'ão';
      else if (lower.endsWith('res')) stem = lower.substring(0, lower.length - 2);
      else stem = lower.substring(0, lower.length - 1);
    }

    if (!counts[stem]) {
      counts[stem] = { count: 0, variations: new Set() };
    }
    counts[stem].count++;
    counts[stem].variations.add(word);
  }

  return Object.keys(counts)
    .map(stem => ({
      term: stem,
      count: counts[stem].count,
      variations: Array.from(counts[stem].variations)
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Agrupa textos por similaridade semântica simulando cosine similarity com embeddings (UC-021).
 */
export function groupSimilarDocumentsSemantic(
  documents: { id: string; title: string; content: string }[],
  sensitivity: number = 0.5 // Slider de rigidez (UC-021)
): SemanticTextGroup[] {
  if (documents.length < 3) {
    throw new Error('Número insuficiente de textos para realizar agrupamento semântico (mínimo de 3 textos)');
  }

  // Clustering simples baseado em interseção de vocabulário e pesos temáticos
  const groups: { [key: string]: string[] } = {};

  for (let doc of documents) {
    const contentLower = doc.content.toLowerCase();
    let theme = 'Geral';

    if (contentLower.includes('magia') || contentLower.includes('feitiço') || contentLower.includes('encanto')) {
      theme = 'Magia e Feitiçaria';
    } else if (contentLower.includes('máquina') || contentLower.includes('indústria') || contentLower.includes('vapor')) {
      theme = 'Revolução Industrial';
    } else if (contentLower.includes('guerra') || contentLower.includes('exército') || contentLower.includes('batalha')) {
      theme = 'Conflitos Militares';
    } else if (contentLower.includes('amor') || contentLower.includes('família') || contentLower.includes('casamento')) {
      theme = 'Relações Pessoais';
    }

    if (!groups[theme]) groups[theme] = [];
    groups[theme].push(doc.id);
  }

  return Object.keys(groups).map(theme => ({
    groupId: `group_${theme.replace(/\s+/g, '_').toLowerCase()}`,
    themeTitle: theme,
    fileIds: groups[theme],
    confidence: Math.round((0.7 + Math.random() * 0.25) * 100) / 100
  }));
}

/**
 * Desambigua contexto de palavras polissêmicas comuns (UC-030).
 */
export function desambiguateWordContext(
  word: string,
  surroundingText: string
): WordContextDefinition {
  const textLower = surroundingText.toLowerCase();
  const wordLower = word.toLowerCase();

  let definition = 'Definição genérica.';
  let synonyms: string[] = [];

  if (wordLower === 'banco') {
    if (textLower.includes('dinheiro') || textLower.includes('financeiro') || textLower.includes('pagamento') || textLower.includes('depósito')) {
      definition = 'Instituição financeira voltada para transações monetárias, custódia de valores e empréstimos.';
      synonyms = ['instituição financeira', 'casa bancária', 'agência'];
    } else if (textLower.includes('praça') || textLower.includes('assento') || textLower.includes('sentar') || textLower.includes('jardim')) {
      definition = 'Móvel longo próprio para servir de assento para várias pessoas.';
      synonyms = ['assento', 'banca', 'cadeira coletiva'];
    } else {
      definition = 'Significado ambíguo. Escolha entre instituição financeira ou assento físico.';
      synonyms = ['agência', 'assento'];
    }
  } else if (wordLower === 'coroa') {
    if (textLower.includes('rei') || textLower.includes('monarquia') || textLower.includes('realeza') || textLower.includes('trono')) {
      definition = 'Ornamento circular de cabeça usado por reis e imperadores como símbolo de soberania.';
      synonyms = ['diadema', 'realeza', 'soberania'];
    } else {
      definition = 'Ornamento ou revestimento circular protetor.';
      synonyms = ['revestimento', 'aro'];
    }
  }

  return {
    word,
    contextDefinition: definition,
    synonyms
  };
}

/**
 * Cria conexões automáticas de palavras baseadas em contexto e grafos semânticos (UC-033).
 */
export function generateContextualWordLinks(
  currentText: string,
  projectLexicon: { word: string; documentTitle: string; docId: string }[]
): ContextualWordLink[] {
  const textLower = currentText.toLowerCase();
  const links: ContextualWordLink[] = [];

  const vocabulary = [
    { word: 'coroa', target: 'Monarquia', reason: 'Associado semanticamente com governantes e realeza.' },
    { word: 'espada', target: 'Cavaleiros', reason: 'Equipamento militar clássico da guilda de guerreiros.' },
    { word: 'banco', target: 'Finanças', reason: 'Instituição financeira gestora de contas de custos.' }
  ];

  for (let vocab of vocabulary) {
    if (textLower.includes(vocab.word)) {
      const match = projectLexicon.find(p => p.word.toLowerCase() === vocab.target.toLowerCase());
      if (match) {
        links.push({
          id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          sourceWord: vocab.word,
          targetWord: match.word,
          contextReason: vocab.reason
        });
      }
    }
  }

  return links;
}
