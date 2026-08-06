# Auditoria de categorização — Senhor dos Anéis

**Data:** 2026-08-06  
**Projeto:** `senhor dos aneis` (`08579d2f-26d5-4d2f-95d1-e3884eba5dae`)  
**Fonte:** `li-2-o-senhor-dos-aneis-j-r-r-tolkien.pdf` (1.514 páginas)  
**Escopo:** importação, entidades, cronologia, genealogia, integridade e automações.

## Limite de evidência

O armazenamento principal da aplicação é IndexedDB/Dexie no navegador. Não existe dump completo dele no repositório; os únicos dados persistidos que puderam ser auditados são `apps/web/src/db/projects.json` e `apps/web/src/db/manuscripts.json`.

Assim, a seção de importação é uma auditoria efetiva. Entidades, cronologia, genealogia, referências órfãs e automações estão **bloqueadas por ausência de dados exportados**, e não foram classificadas como corretas ou incorretas sem evidência.

## Resumo executivo

| Verificação | Resultado |
|---|---|
| Estrutura de capítulos do PDF | 62 cabeçalhos reconhecidos |
| Capítulos ativos correspondentes | 62 de 62, sem título faltante |
| Manuscritos ativos adicionais | `prefacio` e `prologo` |
| Manuscrito residual vazio | `Capítulo II — A S`, corretamente na lixeira |
| Conteúdo divergente da rotina determinística de importação | 1 capítulo confirmado |
| Dump de universo/cronologia/genealogia | indisponível |

## Importação e exportação

### Estrutura aprovada

- Os 62 capítulos extraídos do PDF existem como manuscritos ativos, organizados nos seis livros da obra.
- Não há título de capítulo do PDF faltando nem duplicado entre os manuscritos ativos.
- O registro residual `Capítulo II — A S` (`e600c7cf-e5f8-42b1-9e2d-1a6eec637727`) contém apenas um parágrafo vazio e está com `inTrash: true`; portanto, não polui a biblioteca ativa.

### Falha encontrada: HTML armazenado escapado

- **Localização:** `manuscripts`, título `A Sociedade do Anel — Livro II — Capítulo III: O ANEL VAI PARA O SUL`.
- **Evidência:** o conteúdo começa por `&lt;p&gt;` e termina por `&lt;&#x2F;p&gt;`, enquanto a rotina de importação `scripts/import-lotr-pdf.mjs` produz HTML real, começando por `<p>` e terminando por `</p>`.
- **Impacto:** o editor pode mostrar marcação HTML literal e a extração automática recebe texto contaminado por entidades HTML. O conteúdo deste capítulo diverge da saída determinística do PDF em comprimento e serialização.
- **Sugestão:** corrigir a serialização desse registro para HTML real e validar os campos de conteúdo antes de persistir; usar o mesmo normalizador da rotina de importação.

### Risco adicional: prefácio e prólogo

- **Localização:** `manuscripts`, títulos `prefacio` e `prologo`.
- **Evidência:** ambos contêm sequências HTML escapadas (`&lt;...&gt;`) em vez de nós HTML armazenados diretamente.
- **Impacto:** mesmo problema de apresentação e de análise textual; além disso, esses dois registros não seguem a convenção de título adotada pelos 62 capítulos.
- **Sugestão:** normalizar o conteúdo para HTML real e renomear para `Prefácio` e `Prólogo` sem alterar o texto literário.

## Categorização de entidades

**Não auditável nesta execução.** Não há export de `wikiEntities`, `characterSheets`, `factionSheets`, `locationSheets`, `creatureSheets`, `itemSheets` ou `historicalEventSheets` para o projeto.

Para concluir, exportar essas tabelas filtradas pelo `projectId` e comparar cada item com os capítulos correspondentes do PDF, verificando especialmente itens nomeados promovidos a personagens e confusão entre locais e facções.

## Cronologia

**Não auditável nesta execução.** Não há export de `timelines` nem de `timelineEvents`.

Para concluir, verificar datas, duplicidade e `sortOrder` contra a sequência da obra depois de disponibilizar essas tabelas no dump.

## Genealogia

**Não auditável nesta execução.** Não há export de `familyRelations` nem de `characterSheets`.

Para concluir, conferir cada relação contra o texto e validar os dois extremos da relação, incluindo pares coerentes `PAI`/`FILHO` quando o modelo os armazenar separadamente.

## Referências órfãs

**Não auditável nesta execução.** As tabelas que armazenam referências (`comments`, `manuscriptVersions`, `pendingSaves`, fichas do universo e relações) não estão presentes no dump disponível.

## Histórico de automações

**Não auditável nesta execução.** A tabela `automationHistories` não é sincronizada para os arquivos JSON locais. Sem ela não é possível atribuir achados de entidades, semântica ou laboratório a uma execução de extração específica.

## Próximo passo necessário

Criar um exportador JSON completo do IndexedDB por projeto. O arquivo deve incluir, no mínimo, `manuscripts`, `wikiEntities`, `characterSheets`, `familyRelations`, `factionSheets`, `locationSheets`, `creatureSheets`, `itemSheets`, `historicalEventSheets`, `timelines`, `timelineEvents` e `automationHistories`. Somente então a auditoria de todas as áreas poderá ser concluída com evidência.
