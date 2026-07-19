# 3 METODOLOGIA

O presente capítulo traça as diretrizes metodológicas aplicadas nesta pesquisa. Dada a natureza tecnológica da questão proposta, este trabalho enquadra-se no paradigma da *Design Science Research* (Pesquisa em Ciência de Design), cuja essência repousa na concepção e validação de artefatos teóricos e práticos destinados a sanar problemas práticos humanos (no caso, os desafios de escritores na estruturação de histórias de longo formato).

## 3.1 Design Science Research (DSR)

A pesquisa é conduzida sob as estritas balizas do DSR, visando o desenvolvimento de uma nova arquitetura híbrida de computação algorítmica para Processamento de Linguagem Natural. O fluxo da pesquisa estruturou-se nas seguintes fases:
1. **Identificação do Problema e Motivação:** Diagnóstico das limitações de tempo real em detectores baseados unicamente em *Large Language Models*.
2. **Definição de Objetivos para a Solução:** Determinação dos requisitos arquiteturais, exigindo latência na ordem de milissegundos para detecções locais, associada à manutenção de coerência temporal assíncrona.
3. **Design e Desenvolvimento:** A construção teórica da arquitetura de duas camadas e do modelo de atualização do grafo de entidades.
4. **Demonstração e Validação:** Projeção teórica do desempenho utilizando os paradigmas de avaliação dos datasets FlawedFictions e ConStory-Bench.
5. **Avaliação:** Comparativo estruturado das vantagens em termos de complexidade de tempo de máquina e acurácia face ao estado da arte.

## 3.2 Protocolo PRISMA e Levantamento Bibliográfico

Para garantir rigor na seleção dos 20 artefatos bibliográficos que compõem o corpus teórico da tese, a pesquisa espelhou o modelo PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses), focado especificamente nos anais de conferências ACL, EMNLP, COLM e publicações pré-print expressivas na plataforma arXiv referentes aos anos de 2022 a 2026. A ênfase na literacia mais recente (75% da bibliografia provém do biênio 2025-2026) assegura que a tese aborde de forma fidedigna as técnicas operantes na vanguarda do raciocínio neural e recuperação em bancos de dados baseados em narrativas (GraphStory, TRACE).

## 3.3 Estruturação do Framework de Análise de 2 Camadas

Para atestar a viabilidade e sanar a pergunta de pesquisa, este trabalho desenvolve e emprega metodologicamente um **Framework Híbrido de Duas Camadas**:

### 3.3.1 Primeira Camada: Avaliação Local (Heurística NLI de Baixa Latência)
Esta camada é formulada matematicamente como uma função de pertinência $f(S_{n}, C_{local})$ onde a sentença $S_n$ recém-escrita é validada pelo contexto circunvizinho $C_{local}$ da cena atual. Metodologicamente, propõe-se a instrumentação dessa camada baseada em arquiteturas de modelos destilados (como variantes leves de BERT/RoBERTa), calibradas estritamente para as categorias de "contradiction/entailment" e operantes em CPUs e inferência de borda no navegador, garantindo que o ciclo completo se feche em sub-200 milissegundos.

### 3.3.2 Segunda Camada: Auditoria Global (Travessia de Grafo Dirigido)
Na camada macroestrutural, adota-se um paradigma formal de Teoria dos Grafos. A narrativa literária é modelada como um Grafo Temporal e Espacial $G(V, E, T)$. Os Vértices ($V$) constituem entidades (Personagens, Locais, Itens Críticos), enquanto as Arestas ($E$) representam relacionamentos (Pertence-a, Localizado-em, Conhece) indexadas por fatias temporais ($T$).

A metodologia prescreve a execução de tarefas assíncronas periódicas, ativadas por processos em *background*. Ao encerrar de um capítulo (ou em checkpoints configuráveis), uma extração profunda é processada por modelos mais robustos (alinhados ao pipeline de Anônimos, 2025, e ao esquema TRACE de Duan et al., 2026), que inserem nós e reavaliam as asserções de toda a obra, levantando alertas globais de consistência cronológica sem causar travamentos na interface do usuário (UI Blocking).

## 3.4 Critérios de Avaliação

O sucesso da arquitetura proposta será analisado metodologicamente à luz de três vertentes operacionais:
1. **Latência de Processamento ($L_P$):** A eficiência no tempo computacional para o modelo NLI local providenciar a predição face à digitação contínua em contraste aos modelos densos integrados.
2. **Taxa de Acurácia Global e Coerência Epistemológica ($A_g$):** A precisão do sistema na extração e alerta de contradições utilizando a taxonomia combinada de De Marneffe et al. (2008) sobre o grafo global sem alucinação de falsos-positivos provocada pelos dados espúrios da recuperação tipo-RAG (Gokul et al., 2025).
3. **Escalabilidade Computacional (Big-O):** Avaliação assintótica do crescimento temporal do algoritmo de detecção em função do total de tokens gerados em obras literárias longas (+80.000 palavras).
