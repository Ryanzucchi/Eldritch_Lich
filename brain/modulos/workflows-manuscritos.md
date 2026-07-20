# Fluxos de Trabalho e Manuscritos

Este módulo implementa a gerência de múltiplos capítulos (manuscritos) e a marcação de status do fluxo de trabalho do texto.

## Responsabilidades

1.  **Explorador de Capítulos (Sidebar Explorer)**:
    *   Exibe e gerencia capítulos em IndexedDB (`manuscripts`).
    *   Suporta adição de capítulos, exclusão com confirmação e renomeação local instantânea.
2.  **Status do Fluxo de Trabalho (UC-152)**:
    *   Mapeamento de três estados fundamentais:
        *   `RASCUNHO` (R) - Tag visual laranja.
        *   `REVISAO` (Rev) - Tag visual azul.
        *   `FINALIZADO` (✓) - Tag visual verde e ativação de trava.
    *   Gravação instantânea (< 100ms) de status em IndexedDB.
3.  **Bloqueio de Edições (Lock-on-finalize)**:
    *   Ao marcar como `FINALIZADO`, o manuscrito é bloqueado para novas edições, tornando o editor de texto rico TipTap apenas para leitura (`setEditable(false)`).
    *   Exibe banner informativo no topo da tela com opção de desbloqueio manual e temporário pelo autor.

## Componentes Importantes
*   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) - Explorer de capítulos lateral, seletor de status no cabeçalho do documento, banner de bloqueio de edição e controle de permissões.
*   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/editor/types.ts) - Interface `Manuscript` com campos `status` e `isLocked`.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) - Criação da tabela `manuscripts` no Dexie DB sob a versão 4.
