# 4 DESENVOLVIMENTO: SISTEMA HÍBRIDO E GRAFOS DE ESTADO

O fulcro desta tese reside na maturação intelectual e no desdobramento técnico da solução para o complexo desafio de assegurar consistência em romances de longa extensão. Neste capítulo, apresenta-se detalhadamente a arquitetura de duas camadas e os algoritmos subjacentes que alicerçam as operações no contexto do sistema de escrita interativo.

## 4.1 Arquitetura de 2 Camadas: Detector Local e Auditor Global

A fundação do problema de detecção em tempo real reside no clássico dilema computacional da precisão contra o uso de recursos. Um romance possui, tipicamente, entre 70.000 a 120.000 palavras. A análise atenta da janela de contexto integral a cada nova oração redigida incorreria em um custo logarítmico (para atenção tipo *FlashAttention*) ou quadrático assintótico insustentável financeiramente e em tempo de processamento. A tese consolida, pois, o modelo bipartido:

1. **Agente de Feedback Imediato (Camada Local):** Responsável apenas por coesão de curto alcance, como pronomes, estados físicos vigentes na mesma cena, e anomalias de negação imediatas. Trata-se de uma rede neural destilada de Inferência de Linguagem Natural (NLI) executável por modelos como o proposto por LiteReason (2025). O contexto de submissão do modelo está rigorosamente enclausurado às últimas 500 a 1000 palavras.
2. **Auditor e Gerente do Grafo (Camada Global):** Desacoplado da camada de escrita, este módulo roda como uma *background worker task*. Ele analisa passagens, extraindo instâncias semânticas complexas, preenchendo os bancos de dados estruturados similares ao projeto GraphStory (2026), e avaliando a integridade do espaço, tempo e inventários dos personagens (NarrativeTrack Consortium, 2026).

## 4.2 Representação de Estados: O Grafo Temporal de Entidades (GTE)

Na auditoria global, transcende-se o texto puro em favor do **Grafo Temporal de Entidades (GTE)**. Ao ser processada por Modelos de Linguagem Grandes focados em extração da informação, a narrativa escrita não estruturada é projetada num plano lógico formal.

A taxonomia técnica do GTE é modelada com as seguintes classes de Vértices $V$:
* **Personagem:** Mantém atributos de nome, descrição física (modificáveis) e estado mental (Brei et al., 2025).
* **Localização (Espaço):** Nódulos de geometria narrativa. Podem englobar hierarquicamente outros vértices, permitindo raciocínio de herança espacial (e.g., uma faca localizada numa casa está implicitamente localizada na cidade em que a casa habita).
* **Objeto/Inventário:** Itens transferíveis.

A classe de Arestas Orientadas $E$ expressa eventos, acompanhada de invariáveis Temporais $T$ que denotam o Capítulo/Cena e a carimbagem do *cronos* diegético:
* `Muda-sePara(Personagem, Localização, T)`
* `EntregaObjeto(PersonagemA, PersonagemB, Objeto, T)`
* `Assassinato(PersonagemA, PersonagemB, T)`

A extração estruturada de eventos, um pilar que reverbera as publicações de Zhang et al. (2024 - NoT) e o TRACE de Duan et al. (2026), possibilita a resolução matemática de inconsistências.

## 4.3 Classificação Autômata das Contradições

O processo de detecção atua ativamente observando a topologia e buscando por caminhos ilógicos, classificados nesta tese nas seguintes taxonomias analíticas:

### 4.3.1 Contradições Cronológicas e de Eventos Póstumos
Um desafio central pontuado no dataset *FlawedFictions* (Ahuja, Sclar & Tsvetkov, 2025) é a manipulação do tempo. O sistema detecta este viés quando ocorre a submissão de uma ação para um nó de Personagem cujo estado prévio no intervalo temporal ($T-1$) esteja rotulado com uma *tag* terminadora (e.g., `Estado: Morto`). É uma restrição de que nenhum evento novo $E$ possa emanar de um Vértice após o encerramento do seu ciclo de vida ativo, salvo regras místicas específicas do domínio da ficção, administráveis pelo sistema *LegalWiz* (Mantravadi et al., 2025).

### 4.3.2 Inconsistência de Inventário Material e Espacial
O rastreio espacial inspirado no TemporalStory (2023). Se uma cena $T_2$ afirma: *"João pegou a chave de fenda e destravou a porta em Paris"*, o Auditor percorre retroativamente o trajeto da entidade *João* e da entidade *chave de fenda*. Se em $T_1$ a *chave de fenda* foi dada a *Maria*, a aresta `Possui(João, chave_de_fenda)` é formalmente declarada incompatível e um Alerta Global de Contradição é disparado à UI do aplicativo Web de organização do autor.

### 4.3.3 Deslizes de Continuidade Subjetiva e Personagens
Em menor espectro semântico, atributos fenotípicos de personagens são verificados. Conforme a proposição taxinômica fundacional de de Marneffe, Rafferty e Manning (2008) aliada ao raciocínio em narrativas de Semnani et al. (2025 - CLAIRE), a base valida adjetivos físicos e os pareia com as declarações estruturais, eliminando a transição injustificada de estado.

## 4.4 Trade-offs: Precisão vs. Latência

A discussão fulcral deste arranjo repousa no custo de operação. Como indicado pelo pipeline de Anônimos (2025) e pelos sistemas de aumento de contexto (Gokul et al., 2025), o cômputo semântico maciço aumenta a ocorrência colateral de desvios informacionais e penaliza o limite de tolerância em interatividade humana (estimado pelo padrão de usabilidade de software em <300ms para resposta da interface). 

A segmentação propõe um "Trade-off Aceitável". A precisão no instante da digitação sobre as referências distantes é sacrificada. O escritor pode temporariamente perpetrar uma contradição cronológica referente a três capítulos atrás; o modelo NLI local registrará a oração como sintática e localmente válida. Contudo, em virtude da alta completude assíncrona, a discrepância é fatalmente detectada ao cabo da execução iterativa do *Auditor Global*, que marcará na barra de ferramentas lateral do editor o erro lógico, protegendo o fluxo criativo e operando em plena harmonia com a premissa de um assistente *non-blocking*.

## 4.5 Cenários de Uso e Integração Sistêmica

No panorama de desenvolvimento de um *Sistema Web de Organização e Brainstorming para Escritores*, o grafo servirá também propósitos estendidos para além de detecção de erros. O modelo propiciará, nativamente, ao autor visualizar um sumário gerado via *Reading Subtext* (Subbiah et al., 2024), observar a hierarquia relacional do romance em modo gráfico, garantir coerência de enredos investigativos (Wagner et al., 2025 - Fair Play) e até mitigar inconsistências estruturais oriundas de processos de co-criação colaborativa em massa.
