# 3 REFERENCIAL TEÓRICO E REVISÃO SISTEMÁTICA

A aplicação de PLN em textos literários requer a compreensão profunda dos limites das abordagens tradicionais e o domínio das soluções recém-propostas na academia. Este capítulo provê a base teórica e compila sistematicamente 20 dos trabalhos mais representativos e recentes do estado da arte sobre NER, Entity Linking e extração de narrativas.

## 3.1 Fundamentos Conceituais

### 3.1.1 NER no Domínio Literário
O Reconhecimento de Entidades Nomeadas (NER) visa classificar tokens no texto em categorias predefinidas (PESSOA, LOCAL, ORGANIZAÇÃO). Na literatura, van Dalen-Oskam et al. (2014) pontuam que o NER literário diverge devido à criatividade autoral e inconsistência nas nomeações. Personagens mudam de nome, adotam disfarces ou são referenciados de maneira oblíqua. Dekker, Kuhn e van Erp (2019) evidenciaram a drástica queda de performance ao avaliar ferramentas NER genéricas em romances para a extração de redes sociais.

### 3.1.2 Identificação de Personagens e Correferência
Vala et al. (2015) definem que a detecção do elenco de um livro deve ir além de encontrar nomes próprios. É preciso associar "Mr. Bennet" e "o cocheiro" às suas identidades canônicas. Jahan e Finlayson (2019) refinaram essa identificação mapeando dependências sintáticas, enquanto Jahan et al. (2020) ancoraram a tarefa narratologicamente, usando o conhecimento da estrutura da história para desambiguar entidades complexas. O desafio da correferência, catalogado substancialmente por Bamman, Lewke e Mansoor (2020), é fulcral: pronomes podem referenciar entidades introduzidas páginas antes.

### 3.1.3 Entity Linking
O *Entity Linking* (EL) conecta menções de texto a bases de conhecimento estruturadas. Em literatura, Sarkar et al. (2025) propuseram o sistema Mahānāma para descoberta e ligação de entidades literárias. Scharpf et al. (2022, 2026) oferecem as mais completas revisões sobre a conexão de entidades em inglês com o Wikidata. Para garantir leveza estrutural, Delasalles et al. (2020) introduziram o OpenTapioca, um sistema que, apesar de genérico, demonstra que é possível realizar EL em dispositivos com capacidade restrita.

## 3.2 O Estado da Arte

Diversas iniciativas têm pavimentado o caminho para o NER literário. Bamman, Underwood e Smith (2014) exploraram a inferência de papéis de personagens literários com modelos Bayesianos mistos. Posteriormente, Brooke, Hammond e Baldwin (2016) lançaram o LitNER, introduzindo uma estratégia *bootstrapped* de nível de texto completo (ao invés de janela de sentença) para capturar o contexto amplo do romance. A construção do LitBank (BAMMAN; POPAT; SHEN, 2019) forneceu um corpus padrão-ouro fundamental para avanços com modelos de Deep Learning em língua inglesa.

A migração dessa sofisticação para outras línguas ocorreu aos poucos. Łajewska et al. (2021) construíram *taggers* de protagonistas focados especificamente no domínio literário, avançando no isolamento das personas centrais das tramas. Em português, o cenário foi drasticamente transformado recentemente. Silva e Moro (2024) apresentaram o PPORTAL_ner, corpus de 25 obras literárias, o primeiro focado profundamente no idioma, bem como realizaram avaliações sobre estratégias de pré-treinamento (SILVA; MORO, 2024). Canário et al. (2025) desenvolveram o Taggus, desenhado para extrair redes sociais na ficção portuguesa. Paralelamente, Sarcinelli et al. (2025) e Sarcinelli e Silva (2025) avançaram tanto com o MariNER para português histórico brasileiro, quanto através da consolidação de Ensembles locais baseados em LLM para cenários de Zero-Shot, essencial para a extração não supervisionada mantendo a privacidade. Santana et al. (2023) oferecem uma visão panorâmica sobre como tudo isso culmina na extração geral de estruturas narrativas.

## 3.3 Tabela Comparativa (Visão Geral da Literatura)

| Autor(es), Ano | Foco/Método Principal | Dataset / Contexto | Resultados Chave | Limitações |
|---|---|---|---|---|
| Silva & Moro (2024) | Criação de corpus NER (PPORTAL_ner) | 25 obras pt-BR/pt-PT | F1 de ~85% em PERSON; Baseline sólido | Limitado à variação do séc XIX e início do XX |
| Bamman, Underwood, Smith (2014)| Modelo Bayesiano de Efeitos Mistos | Corpora literários (EN) | Descoberta de papéis latentes | Complexidade de inferência |
| Vala et al. (2015) | Identificação de aliases e títulos | Romances (EN) | Supera coref tradicional | Escopo linguístico limitado |
| Dekker, Kuhn, van Erp (2019)| Avaliação de NER em Redes Sociais | Romances (EN/DE/NL)| Ferramentas padrão falham no domínio | Dependência de recursos externos |
| Bamman, Popat, Shen (2019)| Criação do LitBank (Anotação) | 100 textos domínio púb (EN)| Corpus referência | Não cobre idiomas latinos |
| van Dalen-Oskam et al. (2014)| NER na perspectiva dos Estudos Lit | Diversos textos (NL/EN)| Impacto da variação onomástica | Avaliação qualitativa predominante |
| Brooke, Hammond, Baldwin (2016)| Bootstrapped NER (LitNER) | Literatura inglesa | F1 de ~80% usando contexto global | Falta generalização cross-domain |
| Jahan & Finlayson (2019) | Identificação de Personagens | Romances (EN) | Aprimoramento de aliases | Falso positivos com lugares |
| Jahan et al. (2020) | NER e Estrutura Narratológica | Literatura (EN) | Aumenta F1 de perso. secundários | Pipeline custoso |
| Bamman, Lewke, Mansoor (2020)| Corpus de Correferência Literária | LitBank expandido | Padrão ouro para coref | Anotação restrita e cara |
| Sarkar et al. (2025) | Mahānāma (Entity Linking Lit) | Textos literários | Mapeamento fino na DBpedia | Resolução de falsos cognatos |
| Łajewska et al. (2021) | Protagonist Tagger | Ficção (Multi) | Isola personagens chave com precisão | Dificuldade com narradores não-confiáveis |
| Scharpf et al. (2026) | Revisão Sistemática (EL Wikidata) | Geral / Wikidata | Mapeamento do ecossistema EL | Foco pouco específico em ficção |
| Scharpf et al. (2022) | Revisão EL Inglês e Wikidata | Geral | Identificação de métodos leves | Barreira de entrada linguística (PT) |
| Delasalles et al. (2020) | OpenTapioca (Leveza estrutural) | Geral (Notícias/Web) | Alta velocidade, baixo footprint | Não treinado em ficção |
| Canário et al. (2025) | Taggus (Redes sociais ficcionais) | Ficção Portuguesa | F1 82% em redes sociais | Desafios com correferências longas |
| Sarcinelli & Silva (2025) | Local LLM Ensembles (Zero-shot) | Português (Geral/Lit) | Dispensa treinamento, privacidade mantida | Custo de inferência em GPU |
| Sarcinelli et al. (2025) | MariNER (Português Histórico) | Textos pt-BR históricos | Adaptação de domínio excelente | Corpus limitado a épocas antigas |
| Silva & Moro (2024) | Pre-training Strategies for Lit NER | Obras PT-BR | Melhores práticas de fine-tuning | Requer LLMs como BERTimbau |
| Santana et al. (2023) | Survey (Narrative Extraction) | Geral narrativo | Framework conceitual macro | Sem foco estrito em performance NER |

## 3.4 Análise Crítica e Lacunas

A literatura revela uma trajetória de adaptação onde abordagens supervisionadas baseadas em Fine-Tuning são a norma (SILVA; MORO, 2024). Entretanto, a dependência de datasets exaustivos como o PPORTAL_ner ou o LitBank (BAMMAN; POPAT; SHEN, 2019) cria um gargalo. A maior lacuna está na correferência de longa distância e identificação de aliases em língua portuguesa, algo que Vala et al. (2015) e Jahan e Finlayson (2019) solucionaram parcialmente no inglês. As soluções locais e baseadas em ensembles de LLMs (SARCINELLI; SILVA, 2025) fornecem um caminho promissor para manter os dados de autores de forma privada sem recorrer a grandes provedores.

## 3.5 Taxonomia dos Métodos

1. **Supervisionados Clássicos**: Fine-tuning de BERT com base no PPORTAL_ner (SILVA; MORO, 2024).
2. **Bootstrapped/Não-Supervisionados**: Propagação de labels usando contexto global, como o LitNER (BROOKE; HAMMOND; BALDWIN, 2016).
3. **Zero-Shot Local LLM**: Modelos que executam inferência através de prompts estruturados localmente (SARCINELLI; SILVA, 2025).
4. **Entity Linking**: Sistemas como OpenTapioca e Mahānāma (DELASALLES et al., 2020; SARKAR et al., 2025).

A compreensão destas taxonomias baseia o modelo híbrido desenhado para a tese, que combina a segurança da abordagem (3) com a robustez dos conhecimentos da abordagem (1).
