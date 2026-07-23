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
4.  **Favoritar Capítulos (UC-126)**:
    *   Possibilita marcar documentos como favoritos clicando no ícone de Estrela (★) no cabeçalho ou na barra lateral.
    *   Insere dinamicamente o capítulo em uma seção especial "⭐ Favoritos" no topo do explorer do projeto para acesso rápido.
5.  **Personalização de Ícones (UC-086)**:
    *   Permite mudar o ícone de pastas e manuscritos a partir de um catálogo de 110 itens divididos por categorias e buscável por palavras-chave (como "espada", "mago", etc.).
    *   Suporta upload de SVGs customizados, protegidos por um analisador de segurança regex que rejeita tags `<script>` e inline handlers (XSS).
6.  **Organização e Gestão de Pastas (UC-154, UC-155, UC-156, UC-157)**:
    *   **Favoritar Pastas (UC-154)**: Permite marcar pastas com estrela (★), adicionando-as à seção "⭐ Favoritos" no topo da barra lateral, onde mantêm sua estrutura interna expansível de árvore de arquivos.
    *   **Fixar Pastas (UC-155)**: Permite fixar pastas no topo de seu nível de diretório (indicado com 📌), priorizando-as na listagem da árvore em relação à ordenação alfabética padrão.
    *   **Arquivar Pastas (UC-156)**: Permite arquivar pastas logicamente sob confirmação de modal. A flag de arquivamento é propagada recursivamente para todos os subcapítulos e subpastas, movendo-os para a seção "📦 Arquivados" e bloqueando edições/escritas no editor (modo leitura obrigatório).
    *   **Lixeira e Restauração Posterior (UC-157)**: Exclusão lógica recursiva de pastas e capítulos com prazo de 30 dias. Apresenta contadores regressivos na gaveta "Lixeira" lateral e permite restaurar itens à sua localização original. Ocorre expurgo físico automático em segundo plano para registros que completaram 30 dias na lixeira.

## Componentes Importantes
*   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) - Explorer de capítulos lateral, seletor de status no cabeçalho do documento, banner de bloqueio de edição e controle de permissões.
*   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/editor/types.ts) - Interface `Manuscript` com campos `status` e `isLocked`.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) - Criação da tabela `manuscripts` e suporte a campos adicionais (`isFavorite`, `icon`).

