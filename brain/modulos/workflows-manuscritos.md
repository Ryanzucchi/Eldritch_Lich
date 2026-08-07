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
    *   **Permissão de Escrita (UC-205)**: O proprietário escolhe `todos`, `editores` ou `só proprietário` em cada pasta. A política `owner` bloqueia o TipTap local e a API de manuscritos para colaboradores; a política não é meramente visual.
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
    *   **Resolução de Conflitos (UC-200)**: Se houver modificações concorrentes no texto principal desde a ramificação, o merge é interrompido e abre-se a tela de resolução de conflitos. A comparação usa blocos HTML do documento (em vez de split textual simples), preservando melhor formatação ao confirmar "Manter Principal" ou "Manter Ramificação". O usuário pré-visualiza o resultado antes da conclusão transacional.
    *   **Filtro por Colaborador & Realce de Edição (UC-195)**: Permite filtrar o histórico de salvamento e snapshots por colaborador (Você, Morgana, Lucas, Clarice) com identificadores de avatar. Ao clicar em "Realçar", o editor entra em modo leitura e colore em destaque as palavras inseridas ou modificadas por aquele autor em tons adequados conforme contraste WCAG AA.
    *   **Comparação Lado a Lado (UC-196)**: Modal de diff com visualização em dois painéis paralelos (Painel Esquerdo exibe exclusões da versão antiga em vermelho; Painel Direito exibe adições no texto atual em verde) com sincronização automática de rolagem vertical, além de suporte a visualização corrida inline e validação de versões idênticas.
    *   **Restauração de Versão (UC-197)**: Recupera o texto de qualquer snapshot histórico e salva o estado imediatamente anterior como um novo snapshot de segurança.
10. **Backlinks (UC-112)**: A aba Backlinks do painel direito busca referências no formato `[[Título]]` nos outros manuscritos e abre o capítulo de origem ao clicar.
11. **Sumário interativo (UC-246 a UC-250, parcial)**: A aba Sumário lê headings H1–H3 do TipTap, permite filtrar e rolar até cada seção.
12. **Exportação Fountain (UC-400)**: O exportador de domínio converte HTML literário para roteiro Fountain de forma determinística; H1 vira cena, subtítulos viram seções e texto/itálico são emitidos como ação.
13. **Sincronização da cópia de trabalho**: Ao abrir um projeto em um navegador novo, o editor reidrata os capítulos do armazenamento local do servidor uma vez. A cópia IndexedDB continua prioritária: um registro remoto só substitui o local se for mais novo. Autosave, status, travas, pastas, lixeira, categorias e tags usam o mesmo contrato de manuscrito para não perder metadados entre recargas.
14. **Superfície de produto**: A barra lateral mantém os fluxos principais de escrita à vista e agrupa os demais módulos por finalidade (construção da história, pesquisa e análise, colaboração e administração). Nenhuma funcionalidade existente depende de URL digitada manualmente para ser alcançada.
15. **Editor document-first**: `EditorWorkspace` substitui o editor monolítico por uma folha de escrita TipTap com capítulos locais, autosave com fila offline, contagem de palavras, desfazer/refazer, formatação de texto e modo foco. O modo foco remove a lista de capítulos e reduz a superfície visual.
16. **Extração local com evidência obrigatória**: antes de analisar, `manuscript-extraction.ts` decodifica a marcação de importação, trata ligaturas e normaliza apenas divisões inequívocas de PDF. Conteúdo com HTML escapado continua bloqueado até o autor salvar a normalização. A heurística local `local-evidence-gated-pt-v6` avalia contextos por ocorrência, exige duas confirmações para nomes de um token e bloqueia palavras funcionais, direções, títulos e adjetivos recorrentes da auditoria. Quando o acompanhante Stanza local está configurado, ele substitui os palpites heurísticos de entidades por NER (`PER`, `LOC`, `ORG`) com offsets no texto; `MISC` jamais é promovido. Eventos exigem âncora temporal, predicado narrativo e rejeitam medidas, texto editorial, fragmentação e títulos longos; anais com ano inicial usam uma gramática separada e restrita.
17. **Execuções escolhidas e separação entre sugestão e cânone**: clicar em analisar abre duas opções. **Adicionar novidades** ignora candidatos equivalentes já registrados para a mesma fonte/versão; **Refazer tudo** reprocessa todos os manuscritos e marca candidatos pendentes anteriores como `SUPERSEDED`, sem apagar dados canônicos já aplicados. A execução recebe `runId`, `sourceHash`, `baseFingerprint` e `fingerprint` versionado. A análise grava apenas `PENDING`; a revisão começa sem itens selecionados e exige confirmação. Só os itens marcados pelo autor passam para as tabelas corretas (`characterSheets`, `locationSheets`, `itemSheets`, `factionSheets`, `creatureSheets`, `timelineEvents` ou `familyRelations`) e recebem estado `APPLIED`.
    * A seleção em lote atua somente sobre NER local, eventos e relações de alta evidência. Candidatos do fallback são exibidos como revisão manual. Antes de entrar na fila e novamente na promoção, um nome que conflita com tipo canônico existente — inclusive uma grafia com mais de um tipo legado — é bloqueado; isso impede criar uma ficha de personagem para um local/item homônimo.
18. **Consulta de manuscritos:** `manuscripts` não possui índice Dexie por `projectId`; os consumidores leem a lista local e filtram pelo projeto ativo. Consultas indexadas por esse campo lançam `SchemaError` e não devem ser introduzidas sem uma migração de schema.
19. **Biblioteca organizada:** o explorer filtra obrigatoriamente pelo projeto ativo, oferece busca por título, filtro por estado e ordenação por estrutura, atualização ou título. A ordenação estrutural reconhece títulos no formato `Livro — Capítulo` (inclusive algarismos romanos), agrupando-os por livro; prefácio e prólogo ficam em “Material inicial”. Cada grupo pode ser recolhido sem alterar os dados do manuscrito.
20. **Exclusão segura de capítulo:** o cabeçalho do documento aberto contém “Excluir”. Após confirmação explícita, o registro recebe `inTrash` e `deletedAt`, desaparece imediatamente da biblioteca e é sincronizado como lixeira; assim a exclusão não destrói o texto de forma irrecuperável.
21. **Árvore genealógica automática:** ao aplicar uma relação familiar explícita extraída da biblioteca, o editor garante fichas para as duas pessoas envolvidas, registra a aresta em `familyRelations` e atualiza as menções de origem. A tela de Universo usa essa tabela diretamente para desenhar a árvore, sem exigir cadastro manual dos membros.


## Componentes Importantes
*   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) - Explorer de capítulos lateral, seletor de status no cabeçalho do documento, banner de bloqueio de edição e controle de permissões.
*   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/editor/types.ts) - Interfaces `Manuscript` e `Folder`, incluindo `writePermission`.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) - Criação da tabela `manuscripts` e suporte a campos adicionais (`isFavorite`, `icon`).
*   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/manuscripts/route.ts) - Contrato de sincronização autorizado que preserva os metadados do capítulo.
*   [EditorWorkspace.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorWorkspace.tsx) - Interface TipTap compacta e orientada à escrita.
