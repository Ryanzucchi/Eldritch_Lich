# Módulo de Pesquisa Científica

Gerencia referências, notas atômicas e suas exportações locais por projeto.

## Responsabilidades

* Mantém `ReferenceItem` e `ResearchNote` no IndexedDB particionado por `projectId`.
* Exibe notas Zettelkasten com wiki-links e referência de origem.
* **Exportação DOCX de notas (UC-325):** adapta cada nota ao contrato `Manuscript` e usa `exportManuscripts(..., 'docx')`. O texto é escapado antes de compor o HTML compatível com Word.
* **Repetição espaçada (UC-328):** o algoritmo SM-2 atualiza `repetition`, `intervalDays`, `easinessFactor` e `nextReviewDate`; a fila diária permite registrar difícil, bom ou fácil.
* **Revisão de referências (UC-320):** cada `ReferenceItem` mantém comentários atribuídos ao usuário local e datados, criados diretamente no cartão da bibliografia.
* **Coautores (UC-323):** `ResearchProject` separa a autoria científica do workspace e guarda e-mail e percentual de contribuição; a tabela local possui índice por `projectId`.

## Dependências

* `apps/web/src/db/schema.ts` para persistência local.
* `packages/domain/src/research/types.ts` para referências e notas.
* `packages/domain/src/editor/exporter.ts` para gerar o arquivo DOCX.
* `packages/domain/src/research/spaced-repetition.ts` para o agendamento SM-2.

## Decisão

Reutilizar o exportador central evita uma segunda implementação de HTML para Word e mantém o comportamento de download compatível com as exportações do editor.
