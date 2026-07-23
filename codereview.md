# Code Review — Eldritch Lich

**Data:** 2026-07-23  
**Escopo auditado nesta rodada:** `apps/web/src/app/editor/EditorComponent.tsx`, `apps/web/src/app/projects/GoogleDocsHomeComponent.tsx`, `apps/web/src/context/AppContext.tsx`, `ROADMAP.md`, `use-cases/core_editor/*`.

## Resultado executivo

O projeto está funcional e avançado para os UCs recentes de `core_editor`, com uma base rica de recursos. Nesta revisão, foram aplicadas melhorias concretas de UX/UI e uma correção estrutural na resolução de conflitos de merge para preservar melhor a integridade do conteúdo.

## Melhorias aplicadas no código

### 1) Resolução de conflitos de merge mais robusta (UC-200)

**Arquivo:** `apps/web/src/app/editor/EditorComponent.tsx`

- A lógica de conflito deixou de fragmentar apenas por `</p>` e passou a operar por **blocos HTML**.
- Cada conflito agora armazena:
  - texto visível (`mainText`, `branchText`) para exibição;
  - HTML original (`mainBlockHtml`, `branchBlockHtml`) para mesclagem final.
- A etapa de confirmação de merge passou a reconstruir o documento com os **blocos originais escolhidos**, reduzindo perda de formatação durante a resolução.
- O preview de resultado final foi alinhado ao mesmo modelo de blocos para consistência entre visualização e saída final.

**Impacto:** melhora a confiabilidade da UC-200 em cenários com conteúdo rico, evitando simplificações agressivas na reconstrução do texto.

### 2) Refino visual e de acessibilidade na home de projetos

**Arquivo:** `apps/web/src/app/projects/GoogleDocsHomeComponent.tsx`

- Melhor distinção visual de visibilidade (`Privado` vs `Compartilhado`) com badges dedicadas.
- Adição de estados `:focus-visible` para botões, links, inputs e selects, melhorando navegação por teclado.
- Centralização de opções de gênero em constante (`GENRE_OPTIONS`) para reduzir duplicação.
- Remoção de cast amplo no seletor de visibilidade com validação explícita (`handleVisibilityChange`).

**Impacto:** interface mais clara e navegável, com melhor manutenção do código da tela de projetos.

## Validação dos casos de uso recentes (core_editor)

| UC | Status observado | Evidência no código | Observação |
| --- | --- | --- | --- |
| UC-163 (Exportar DOCX) | Implementado | `EditorComponent.tsx` (fluxo de exportação DOCX e modal de exportação) | Fluxo presente e integrado à UI. |
| UC-164 (Tela cheia) | Implementado | `handleToggleFullscreen` e botão de alternância no status bar | Cobertura funcional disponível no editor. |
| UC-187 (Modo leitura) | Implementado | estado `isReadOnly`, toggles e estilos de leitura | Recurso acessível por toolbar/status bar. |
| UC-194 (Importar DOCX) | Implementado | `extractDocumentXmlFromZip`, `parseDocxXmlToHtml` | Implementação local-first sem backend obrigatório. |
| UC-195 (Histórico por colaborador) | Parcial | filtro por colaborador + snapshots com autor | Hoje há uso de autores mock/simulados em parte do fluxo de versionamento. |
| UC-196 (Diff side-by-side) | Implementado | modal de diff com modo side-by-side/inline | Presença funcional e alternância de visualização. |
| UC-198 (Criar branch) | Implementado | `handleCreateBranch` | Fluxo completo de criação de branch local. |
| UC-199 (Merge branch) | Implementado | `handleMergeBranch` | Mesclagem direta quando não há conflito. |
| UC-200 (Resolver conflito de merge) | Implementado com melhoria nesta revisão | `handleMergeBranch`, `handleResolveConflictAndMerge` | Refinado para preservar blocos HTML ao mesclar. |

## Achados de arquitetura/manutenibilidade

1. `EditorComponent.tsx` está muito grande (≈10k linhas), concentrando múltiplas responsabilidades (edição, import/export, diffs, colaboração, UI modal, estilos).  
2. `ClientLayout.tsx` também está extenso (≈2.5k linhas), com vários domínios acoplados (layout, colaboração, lembretes, modais, regras de sessão).  
3. Ainda há pontos com tipagem fraca (`any`) em fluxos de dados e estados complexos.

## Priorização sugerida para próximas rodadas

1. Extrair módulos do editor por domínio (`merge`, `import-export`, `versioning`, `ui/modals`) mantendo contratos tipados.  
2. Extrair hooks específicos no layout (`useReminders`, `useCollaboration`, `useSidebarResize`).  
3. Endurecer tipagem de snapshots e colaboradores para eliminar `any` e reduzir regressões silenciosas.
