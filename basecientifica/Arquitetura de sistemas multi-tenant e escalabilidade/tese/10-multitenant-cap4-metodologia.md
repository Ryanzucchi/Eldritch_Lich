# 4 METODOLOGIA

## 4.1 Método de Pesquisa

A metodologia desta tese está estruturada segundo a abordagem da **Design Science Research (DSR)**, que visa à criação, ao desenvolvimento e à validação de artefatos tecnológicos originais para a resolução de problemas práticos complexos. No escopo deste trabalho, o artefato é o framework de arquitetura **CreativeCloud-MT**. A validação desse artefato compreende duas dimensões: a análise de segurança formal do isolamento de dados e a avaliação empírica quantitativa de desempenho e custos em ambiente simulado de alta carga.

## 4.2 Protocolo de Revisão Sistemática (PRISMA)

A fim de mapear o estado da arte e embasar as decisões de projeto da arquitetura, executou-se uma revisão sistemática de literatura orientada pelo protocolo PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses).

1.  **Bases de Dados Consultadas:** IEEE Xplore, ACM Digital Library, Google Scholar e arXiv.
2.  **Palavras-chave Utilizadas:** `multi-tenant`, `SaaS isolation`, `row-level security`, `PostgreSQL RLS`, `LLM privacy`, `LoRA multi-tenant`, `LGPD compliance SaaS`.
3.  **Filtros de Inclusão:** Artigos revisados por pares e preprints publicados entre 2023 e 2026 contendo modelagem técnica de arquitetura SaaS ou proteção à privacidade em IA.
4.  **Processo de Seleção:** Identificaram-se inicialmente 245 estudos. Após a remoção de duplicadas e análise de títulos e resumos, restaram 78 trabalhos. Destes, 20 foram selecionados após leitura detalhada do texto completo, sendo catalogados no Capítulo 3.

## 4.3 Arquitetura de Testes e Protocolo de Avaliação de Desempenho

A validação de desempenho do framework CreativeCloud-MT é realizada em um ambiente computacional padronizado na nuvem (AWS), cujos detalhes são especificados abaixo:

### 4.3.1 Configuração da Infraestrutura
*   **Servidor de Aplicação:** Instância EC2 `c6i.xlarge` (4 vCPUs, 8 GB RAM) rodando Kubernetes (EKS).
*   **Servidor de Banco de Dados:** Instância RDS PostgreSQL 16 `db.m6g.xlarge` (4 vCPUs, 16 GB RAM, armazenamento SSD gp3).
*   **Servidor de Inferência de IA:** Instância EC2 `g5.xlarge` equipada com GPU NVIDIA A10G (24 GB VRAM) rodando o servidor Triton Inference Server.

### 4.3.2 Carga de Trabalho Simulada
Utilizou-se a ferramenta de testes de carga **k6** para simular as seguintes interações simultâneas no editor de escrita criativa colaborativo:
*   **Perfil de Leitura e Escrita:** Sessões de escrita ativa simulando 100 usuários concorrentes por nó, efetuando requisições de persistência de texto a cada 5 segundos (latência de digitação típica).
*   **Perfil de Inferência de IA:** Requisições simultâneas de geração textual de suporte criativo enviadas à API de IA a uma taxa de 10 requisições por segundo.

### 4.3.3 Métricas Coletadas
1.  **Latência de Persistência (Escrita):** O tempo total transcorrido desde o envio da requisição HTTP POST contendo o bloco de texto editado até a resposta de sucesso com confirmação de persistência no PostgreSQL (métricas de média, mediana, p95 e p99).
2.  **Latência de Inferência (Geração):** O tempo total de inferência da IA sob carregamento dinâmico de adaptadores LoRA (tempo decorrido desde o prompt de entrada até a recepção do primeiro token gerado).
3.  **Overhead de Isolamento:** A variação percentual de latência de banco de dados sob o uso de RLS e esquemas separados em comparação a um banco genérico sem nenhuma política ativa.
4.  **Custo de Execução:** O cálculo dos custos de computação e armazenamento de banco de dados por tenant para cada nível de isolamento.
