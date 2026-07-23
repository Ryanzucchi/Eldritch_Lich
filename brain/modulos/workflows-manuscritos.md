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
7.  **Importação & Exportação DOCX Customizada (UC-163, UC-194)**:
    *   **Exportação DOCX (UC-163)**: Oferece modal de formatação de layout do documento com opções de fonte (Calibri, Times New Roman, Arial), espaçamento (1.0, 1.15, 1.5, 2.0), recuo de parágrafo (Nenhum, 1.25cm, 1.5cm) e mapeamento nativo de comentários inline como notas de revisão do Word.
    *   **Importação DOCX (UC-194)**: Suporta importação local-first (sem backend intermediário). Realiza a leitura binária do arquivo ZIP, extraindo o arquivo `word/document.xml` decompresso por meio da API nativa `DecompressionStream('deflate-raw')`. O conversor XML traduz parágrafos, cabeçalhos, negritos, itálicos e sublinhados em elementos HTML válidos do TipTap. Bloqueia formatos `.doc` legados com alerta explicativo.
8.  **Modo Leitura, Tela Cheia e Acessibilidade (UC-187, UC-164, UC-160, UC-186)**:
    *   **Modo Leitura (UC-187)**: Formata a folha de texto com margens amplas de 6rem, esconde a régua do editor, desativa cursor/edição no TipTap e define tipografia Georgia (serifada) para visualização limpa. Suporta esquemas de cores Sépia e Cinza para redução de fadiga ocular.
    *   **Tela Cheia (UC-164)**: Integração com a API Fullscreen do navegador para maximizar o editor, ocultando abas e barras de tarefas de forma limpa.
    *   **Estimativa de Tempo (UC-186)**: Exibe no rodapé da página o tempo de leitura dinâmico baseado em WPM (palavras por minuto), ajustável pelo autor na aba de configurações.
    *   **Acessibilidade / Leitores de Tela (UC-160)**: Inclui anotações semânticas HTML5 de acessibilidade e atributos ARIA (`aria-label`, `aria-expanded`, `role`) em todos os botões e pastas reativas. Adiciona atalho global de teclado `Alt + Shift + E` para forçar o foco direto no canvas de digitação.
9.  **Ramificação, Mesclagem e Histórico Colaborativo (UC-198, UC-199, UC-200, UC-195, UC-196, UC-197)**:
    *   **Criar Branch (UC-198)**: Clona logicamente o capítulo de texto selecionado em uma ramificação isolada de testes (marcada com `⌥`). Exibida de forma aninhada abaixo do manuscrito pai na árvore de diretórios lateral.
    *   **Mesclar Branch (UC-199)**: Mescla as alterações do branch de volta ao texto principal. Se não houver modificações concorrentes, o conteúdo do manuscrito pai é atualizado diretamente e o branch é deletado. Cria um ponto de restauração automática no histórico de versões do capítulo principal.
    *   **Resolução de Conflitos (UC-200)**: Se houver modificações concorrentes no texto principal desde a ramificação, o merge é interrompido e abre-se a tela de resolução de conflitos, exibindo as diferenças parágrafo por parágrafo, onde o usuário pode optar por manter o trecho do principal ("Manter Principal"), do branch ("Manter Ramificação"), e pré-visualizar o resultado resolvido antes da conclusão transacional.
    *   **Filtro por Colaborador & Realce de Edição (UC-195)**: Permite filtrar o histórico de salvamento e snapshots por colaborador (Você, Morgana, Lucas, Clarice) com identificadores de avatar. Ao clicar em "Realçar", o editor entra em modo leitura e colore em destaque as palavras inseridas ou modificadas por aquele autor em tons adequados conforme contraste WCAG AA.
    *   **Comparação Lado a Lado (UC-196)**: Modal de diff com visualização em dois painéis paralelos (Painel Esquerdo exibe exclusões da versão antiga em vermelho; Painel Direito exibe adições no texto atual em verde) com sincronização automática de rolagem vertical, além de suporte a visualização corrida inline e validação de versões idênticas.
    *   **Restauração de Versão (UC-197)**: Recupera o texto de qualquer snapshot histórico e salva o estado imediatamente anterior como um novo snapshot de segurança.


## Componentes Importantes
*   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) - Explorer de capítulos lateral, seletor de status no cabeçalho do documento, banner de bloqueio de edição e controle de permissões.
*   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/editor/types.ts) - Interface `Manuscript` com campos `status` e `isLocked`.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) - Criação da tabela `manuscripts` e suporte a campos adicionais (`isFavorite`, `icon`).

