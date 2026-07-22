export interface ManuscriptTemplate {
  id: string;
  name: string;
  category: 'narrativa' | 'worldbuilding' | 'personagem' | 'estrutura';
  description: string;
  titlePlaceholder: string;
  contentHtml: string;
}

export const MANUSCRIPT_TEMPLATES: ManuscriptTemplate[] = [
  {
    id: 'jornada_heroi',
    name: 'Jornada do Herói - Cena de Conflito',
    category: 'narrativa',
    description: 'Estrutura clássica com Ponto de Partida, Incitamento, Obstáculo Escalonado e Clímax.',
    titlePlaceholder: 'Capítulo: O Teste de Coragem',
    contentHtml: `<h1>Cena de Conflito Principal</h1>
<p><strong>[Status Inicial]</strong> Descreva o estado de equilíbrio antes do incitamento...</p>
<h2>1. O Incitamento</h2>
<p>Um evento inesperado quebra a rotina do protagonista...</p>
<h2>2. O Conflito Escalonado</h2>
<p>O protagonista tenta resolver o problema, mas a complicação aumenta...</p>
<h2>3. O Clímax da Cena</h2>
<p>O momento de maior tensão dramática onde uma escolha crítica deve ser feita...</p>
<h2>4. Consequência & Gancho</h2>
<p>As repercussões imediatas e o gancho para o próximo capítulo...</p>`
  },
  {
    id: 'ficha_personagem',
    name: 'Ficha Completa de Personagem',
    category: 'personagem',
    description: 'Perfil psicológico, motivações profundas, aparência e arco dramático.',
    titlePlaceholder: 'Ficha: Nome do Personagem',
    contentHtml: `<h1>Ficha de Personagem</h1>
<p><strong>Nome Completo:</strong> [Nome]</p>
<p><strong>Papel na História:</strong> Protagonista / Antagonista / Mentor / Aliado</p>
<hr />
<h2>1. Aparência Física & Marcas Registro</h2>
<ul>
  <li><strong>Idade / Altura:</strong> </li>
  <li><strong>Olhos / Cabelo:</strong> </li>
  <li><strong>Vestuário Típico:</strong> </li>
  <li><strong>Marca Distintiva:</strong> </li>
</ul>
<h2>2. Psicologia & Motivação</h2>
<p><strong>Desejo Consciente (Goal):</strong> O que o personagem diz que quer...</p>
<p><strong>Necessidade Inconsciente (Need):</strong> O aprendizado emocional que ele precisa ter...</p>
<p><strong>O Maior Medo:</strong> O trauma ou fantasma do passado...</p>
<h2>3. Arco Dramático</h2>
<p>Como o personagem muda do início ao fim da história...</p>`
  },
  {
    id: 'worldbuilding_local',
    name: 'Ficha de Worldbuilding & Local',
    category: 'worldbuilding',
    description: 'Estruturação de reino, cidade, monumento ou bioma ficcional.',
    titlePlaceholder: 'Local: Nome do Reino/Cidade',
    contentHtml: `<h1>Descrição do Local</h1>
<p><strong>Tipo de Local:</strong> Cidade-Estado / Ruínas / Bioma / Fortaleza</p>
<p><strong>Localização no Mapa:</strong> [Região]</p>
<hr />
<h2>1. Atmosfera & Sensações</h2>
<p>Descreva os sons, cheiros, iluminação e clima ao pisar neste local...</p>
<h2>2. Facções & Habitantes</h2>
<p>Quem domina a região e quais são os conflitos políticos ativos...</p>
<h2>3. Segredos & Perigos</h2>
<p>O que permanece oculto sob a superfície ou nas sombras...</p>`
  },
  {
    id: 'estrutura_3_atos',
    name: 'Capítulo Estruturado em 3 Atos',
    category: 'estrutura',
    description: 'Modelo de ritmo ágil para manutenção de tensão em romances.',
    titlePlaceholder: 'Capítulo: Nome do Capítulo',
    contentHtml: `<h1>Capítulo [Número]</h1>
<h2>Ato I — Abertura e Ancoragem</h2>
<p>Estabeleça onde os personagens estão e qual é a meta imediata do capítulo...</p>
<h2>Ato II — A Virada / Revelação</h2>
<p>Insira uma revelação surpreendente, diálogo tenso ou reviravolta...</p>
<h2>Ato III — Resolução Temporária</h2>
<p>Feche a tensão principal abrindo uma nova pergunta dramática...</p>`
  }
];

/**
 * Generates an automatic chapter title based on first paragraph or text content
 */
export function autoGenerateTitle(htmlContent: string): string {
  if (!htmlContent) return 'Capítulo Sem Título';
  
  // Strip HTML
  const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return 'Capítulo Sem Título';

  // Take first 5-8 meaningful words
  const words = text.split(' ').filter(w => w.length > 2);
  if (words.length === 0) return 'Capítulo Sem Título';

  const titleWords = words.slice(0, 5).join(' ');
  // Capitalize first letter
  const formattedTitle = titleWords.charAt(0).toUpperCase() + titleWords.slice(1);
  return formattedTitle.length > 40 ? formattedTitle.substring(0, 40) + '...' : formattedTitle;
}
