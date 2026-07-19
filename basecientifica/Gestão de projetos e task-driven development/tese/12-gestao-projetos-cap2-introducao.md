# 2 INTRODUÇÃO

## 2.1 Contextualização do Problema

O processo de criação literária de longa extensão (como romances de fantasia épica, ficção científica ou romances policiais com múltiplas tramas paralelas) representa um esforço de engenharia de conteúdo de alto nível. Um autor de romances deve planejar e executar o encadeamento lógico e cronológico de centenas de eventos, rastrear os arcos evolutivos de dezenas de personagens, descrever locações complexas de forma consistente e garantir que revelações de enredo ocorram precisamente nos momentos estruturais adequados.

Tradicionalmente, a gestão desses projetos literários baseia-se em abordagens puramente intuitivas ou em ferramentas de planejamento isoladas da interface de redação (como quadros físicos, planilhas de cronograma ou notas textuais desorganizadas). A desconexão entre a fase de planejamento ("outline") e a fase de redação ativa da prosa gera dois problemas principais:

1.  **Bloqueio Criativo por Desorientação:** O escritor frequentemente perde a noção de "qual é o próximo passo a ser escrito" na cena atual para satisfazer as metas de longo prazo da obra. Isso causa pausas cognitivas desnecessárias e atrasos crônicos na entrega do rascunho inicial.
2.  **Inconsistência entre Planejamento e Execução:** À medida que escreve, o autor tende a desviar-se do planejamento original. Sem um sistema que alerte sobre as consequências estruturais desses desvios, metas críticas de enredo (ex: introduzir um objeto que será decisivo no clímax) podem ser simplesmente esquecidas, exigindo grandes e penosos retrabalhos de revisão posterior.

Na engenharia de software, o paradigma de *Task-Driven Development* (desenvolvimento orientado a tarefas) resolve desafios análogos de complexidade organizacional ao decompor sistemas complexos em tarefas com dependências claras, rastreando de forma contínua a conclusão do trabalho com base no código efetivamente escrito. A transposição desse paradigma para o fluxo de trabalho de coautoria e criação literária constitui uma oportunidade original e promissora.

## 2.2 Justificativa e Relevância

A relevância científica desta tese reside na formalização dos processos de criação literária sob a ótica da ciência da computação e da engenharia de processos. A maioria dos estudos de escrita assistida por computador foca em tarefas localizadas de geração linguística (sugestão de frases ou correções sintáticas). Há uma carência de pesquisas que tratem o livro como um projeto sistêmico e forneçam ferramentas de apoio à gestão cognitiva do processo de redação de longa duração.

Do ponto de vista prático, o framework proposto nesta tese capacita os autores a manterem um ritmo de redação regular e a gerenciarem a complexidade do enredo com ferramentas que integram a visualização do plano do livro (grafo de metas) diretamente com a análise semântica do texto sendo digitado.

## 2.3 Objetivos da Pesquisa

### Objetivo Geral
Propor, implementar e avaliar o framework **TaskWriter-PT**, uma metodologia de gestão de projetos literários baseada em tarefas que utiliza um Grafo de Metas Narrativas integrado a um assistente inteligente para mapeamento semântico de progresso e suporte à produtividade de escritores.

### Objetivos Específicos
1. Mapear e categorizar as principais metodologias e ferramentas de apoio à produtividade de escrita literária disponíveis na literatura científica contemporânea.
2. Desenvolver a estrutura matemática do Grafo de Metas Narrativas (GMN), especificando os tipos de nós, arestas de dependência causal e propagação de restrições em caso de alterações no enredo.
3. Desenvolver o pipeline do assistente inteligente (NLP) que mapeia o texto escrito pelo autor em tarefas e metas concluídas no GMN de forma automática e local.
4. Conduzir uma avaliação empírica com 45 escritores de diferentes níveis de experiência para medir os impactos do TaskWriter-PT em termos de velocidade de escrita, redução de bloqueios criativos e percepção de usabilidade.

## 2.4 Pergunta de Pesquisa

De que forma a aplicação dos conceitos de *Task-Driven Development* e a estruturação do plano literário como um Grafo de Metas Narrativas interconectado a um sistema de mapeamento semântico textual conseguem reduzir os episódios de bloqueio criativo e elevar a velocidade de redação de manuscritos, preservando a percepção de agência e liberdade artística do escritor?

## 2.5 Hipóteses

*   **H1:** O uso do Grafo de Metas Narrativas reduz a incidência de pausas longas de bloqueio criativo em mais de 30% em comparação a métodos tradicionais de redação sem monitoramento de tarefas.
*   **H2:** A automação do mapeamento de progresso do texto em tarefas do GMN reduz o overhead cognitivo de gerenciamento do projeto pelo escritor, resultando em um aumento na velocidade de redação de rascunhos superior a 20%.
*   **H3:** O sistema de rastreamento causal de alterações no GMN reduz a taxa de retrabalho na revisão final ao alertar imediatamente o escritor sobre inconsistências estruturais criadas por desvios do plano original.

## 2.6 Estrutura do Documento

A tese está organizada em oito capítulos. O Capítulo 3 aborda o referencial teórico e a revisão sistemática de literatura em task-driven development e escrita. O Capítulo 4 estabelece a metodologia científica e os protocolos de testes com humanos. O Capítulo 5 apresenta a arquitetura e detalhes técnicos do TaskWriter-PT. Os Capítulos 6 e 7 analisam os resultados experimentais e expõem as conclusões gerais. O Capítulo 8 reúne as referências no padrão ABNT.
