# Módulo MMS (Mapeamento Semântico Local)

O **MMS** é o pipeline de NLP local responsável por indexar o manuscrito do autor em tempo real e atualizar as metas do GMN sem vazamento de propriedade intelectual.

## Palavras-chave locais (UC-032)

`nlp/keywords.ts` calcula TF-IDF sem rede nem modelo externo. No editor, o capítulo atual é comparado ao corpus de manuscritos do projeto, o que evita que frequência pura trate palavras comuns do livro como termos distintivos.

## Resumo de capítulo (UC-052, fallback)

`nlp/summary.ts` divide o HTML em cenas e seleciona frases informativas por bloco, preenchendo uma nota de rodapé no editor. É um fallback extractivo local; a camada abstrativa com SLM continua pendente de instalação do modelo quantizado.

## Responsabilidades
1.  **Geração de Embeddings**: Vetorização local usando o modelo `multilingual-e5-small` (carregado via Transformers.js no navegador).
2.  **Cálculo de Similaridade**: Computa a similaridade de cosseno ($S_{cos}$) entre o parágrafo digitado e as descrições de metas ativas.
3.  **Mapeamento de Entidades (NER)**: Pipeline híbrido combinando dicionário de wiki local e o modelo `bert-base-multilingual-cased-ner-xxl` para reconhecer locais e personagens.
4.  **Classificação de Intenção**: Classificador local que valida se o evento narrativo de fato aconteceu (ação ativa) ou se é apenas uma menção passiva/planejamento de personagem.

## Componentes Importantes
*   [similarity.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/mms/similarity.ts) - Funções matemáticas de similaridade e NER primitivo.
*   [classifier.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/mms/classifier.ts) - Gerador de embeddings locais e verificação zero-shot.
*   [mms-ai.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/services/mms-ai.ts) - Serviço wrapper do Transformers.js com inicialização assíncrona, download progressivo e cache local.
