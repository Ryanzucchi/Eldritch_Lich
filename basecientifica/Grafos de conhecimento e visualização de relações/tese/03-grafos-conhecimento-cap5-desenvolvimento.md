# CAPÍTULO 5 - DESENVOLVIMENTO

O núcleo desta pesquisa reside no desenvolvimento do arcabouço FUKG (*Fictional Universe Knowledge Graph*). Este capítulo detalha a arquitetura lógica, os mecanismos de raciocínio, a ontologia proposta, bem como as decisões projetuais inerentes à interface de visualização.

## 5.1 Arquitetura do FUKG (Fictional Universe Knowledge Graph)

A arquitetura do FUKG foi desenhada como o motor semântico para um sistema web voltado a romancistas, roteiristas e *worldbuilders*. Baseada na sinergia entre extração autônoma (KNOBUILDER, 2025) e memória literária contextual (NARRATIVE WORLD MODEL CONSORTIUM, 2026), a arquitetura é subdividida em módulos orquestradores.

O sistema base opera com **Grafos Baseados em Eventos** (GRAPHSTORY, 2026). Em oposição a grafos transacionais onde cada aresta é um mero estado permanente, no FUKG a fundação de tudo é o *Evento*. Todo *Evento* é um nó especial (Event-Node) associado intrinsecamente a um marcador de tempo ou sequencialidade ($t$). As entidades de *lore* (cenários, heróis, artefatos) vinculam-se aos Event-Nodes. Isso facilita as atualizações incrementais do mundo sem sobrescrever a história passada.

## 5.2 A Ontologia de Universos Ficcionais

Para lidar com a miríade de características narrativas, utilizou-se como alicerce estrutural o conhecimento adaptado do URW-KG (2024) e WLKG (2023), mas instanciado para processos criativos não lineares. A Ontologia FUKG define três superclasses principais:

1. **Entidades Perenes (Perennial Entities):** Sujeitos e Objetos. 
   - *Personagem*: Atributos, Raça, Classe.
   - *Localidade*: Geometria relacional (O Local A está dentro do Local B).
   - *Organização/Facção*: Grupos que agem como atores coletivos.
2. **Propriedades Máveis (Mutable Properties):** Atributos que evoluem no tempo, como "Aliança", "Posse de Item", ou "Estado Civil", codificando o "Evolucionário" inspirado pelo EKG (EVOLUTIONARY KNOWLEDGE, 2020).
3. **Metadados de Trama (Plot Structures):** Como proposto em STORY-THEME-OBSTACLE (2025) e PLOTTER (2026), inclui estruturas de Obstáculos, Clímax e Objetivos, permitindo ligar um evento factual no mundo (uma batalha) à estrutura temática da narrativa (a superação do mentor).

## 5.3 Mecanismos de Raciocínio Temporal e Lógico

A mera acumulação de nós geraria um repositório inerte. A eficácia do sistema reside na sua inferência lógica. O FUKG integra regras de raciocínio baseadas no modelo TPAR (CHEN et al., 2024) e RLEE (LIU et al., 2025). 

A verificação de **Coerência Espaço-Temporal** atua validando trajetórias. Se o evento $E_1$ (Ocorrendo em $t_1$, em Roma) afeta o personagem $C$, e o evento $E_2$ (Ocorrendo em $t_2$, em Tóquio) também envolve $C$, o motor avalia, via regras predefinidas ou inferência semântica baseada em LLM (HAN & WANG, 2024), se o intervalo $\Delta t = t_2 - t_1$ suporta o trânsito físico neste universo (SCORE, 2025). Em caso de violação, o grafo sinaliza um *Plot Hole*.

Além disso, a extração de relações conjuntas (CTIKG, 2026; CHEN et al., 2025) a partir de anotações soltas do usuário é alimentada por LLMs orquestrados, preenchendo falhas de grafo automaticamente — por exemplo, inferindo que, se um personagem $X$ matou o líder de $Y$, a aliança de $X$ com a facção $Y$ altera-se imediatamente para Hostil (Know-Evolve, TRIVEDI et al., 2017). A coevolução KG-agente explorada no MAGE (2026) prova que agentes de linguagem podem simular reações secundárias, sugerindo desdobramentos de trama ao escritor.

## 5.4 Visualização Interativa, Layout e Usabilidade

O projeto da interface humano-computador utiliza regras estritas de GuidelineExplorer (2025). A densidade de nós é o calcanhar de aquiles dos grafos para usuários comuns. Para evitar a exaustão cognitiva reportada pelo Graph Usability Group (2026) e por Tiddi et al. (2024), a visualização interativa aplica a estratégia de **Time-slicing** (fatiamento temporal).

Na prática, o sistema web possuirá um controle deslizante (*slider*) representando a linha do tempo narrativa. Em cada estágio temporal selecionado, o layout *force-directed* exibirá apenas o grafo filtrado equivalente àquele instante. Adicionalmente, agrupamentos heurísticos condensarão facções e famílias (Nodes to Narratives), ocultando complexidades a menos que expandidas pelo autor. Cores semânticas distinguiriam a natureza das arestas (verde para alianças, vermelho para rivalidades), e o layout deve garantir o menor número de cruzamentos possíveis visando legibilidade.

## 5.5 Trade-offs: Expressividade vs. Performance

A robustez da ontologia cria tensões de performance computacional. Abordagens como o uso de LLMs-Agents para atualização em tempo real (KnoBuilder) aumentam o custo e latência de inserção no banco de dados em grafos. Por outro lado, priorizar a inserção relacional crua sacrifica o arcabouço lógico e a verificação (RLEE), desconfigurando o objetivo do sistema. Como solução, define-se que a inserção de entidades é síncrona, enquanto a inferência e verificação de *plot holes* ocorrem como rotinas em background, preservando a fluidez do processo criativo de escrita.
