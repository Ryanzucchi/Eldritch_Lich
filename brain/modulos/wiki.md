# Módulo de Wiki & Worldbuilding e Padronização de Nomes

Este módulo gerencia a criação, consolidação e exportação de elementos do universo ficcional (lore), fornecendo hyperlinks cruzados automáticos e ferramentas de uniformização de grafias de personagens nos manuscritos.

## Responsabilidades

1.  **Portal de Worldbuilding (Wiki)**:
    *   Mantém artigos sobre entidades do universo no IndexedDB local (`wikiEntities`) segregados por projeto (`projectId`).
    *   Tipos suportados: `Personagem`, `Local`, `Item` e `Organizacao`.
    *   Fornece filtros rápidos por tipo, buscas flexíveis no título/descrição e marcação de sigilo (`isConfidential`).
2.  **Cross-linking Reativo**:
    *   Um motor em Javascript varre o texto detalhado dos artigos buscando menções a outros tópicos cadastrados (ordenado por tamanho decrescente de nome para evitar conflitos de substrings).
    *   Transforma as ocorrências em hyperlinks clicáveis, garantindo navegação reativa de ponta a ponta sem recarregar a página.
3.  **Compilador de Portal Web Wiki (UC-090)**:
    *   Gera e empacota todos os artigos públicos em um arquivo estático e independente (.html) contendo o CSS do design premium, o banco em JSON e o script SPA de busca interativa.
    *   Filtra e remove anotações confidenciais do pacote de exportação automaticamente, a menos que o autor opte por ignorar o sigilo para fins de backup pessoal.
    *   O portal gerado é responsivo para dispositivos móveis.
4.  **Exportação de Manual do Universo (UC-091)**:
    *   Extrai dados de lore e formata em Markdown estruturado.
    *   Agrupa as entidades alfabeticamente sob seções de categorias em menos de 1 segundo para download imediato.
5.  **Padronização de Nomes (UC-092)**:
    *   Escaneia o manuscrito ativo no editor em busca de variações de nomes dos personagens (desvios de acentuação, diferença de caixa alta/baixa ou distância de edição Levenshtein <= 2).
    *   Permite ao autor revisar as substituições propostas em lote no editor.
    *   **Substituição Segura**: Caminha pela árvore DOM (DOM traversal) para substituir grafias somente em nós de texto, pulando tags de código (`<code>`, `<pre>`) e hiperlinks externos (`<a>`).
    *   A aplicação das substituições no banco IndexedDB ocorre dentro de uma transação Dexie atômica.
6.  **Lore Chat & Respostas citando Fontes (UC-158)**:
    *   Um assistente de conversação em tempo real integrado na aba "Lore Chat" do painel lateral direito do editor.
    *   **Pipeline de RAG Local**: Realiza busca semântica baseada em densidade de palavras-chave analisando todos os parágrafos de manuscritos ativos e artigos da Wiki de forma off-line.
    *   **Citações Numeradas**: Constrói respostas com links de notas de referência (ex: `[1]`) contendo metadados detalhados de origem (nome do capítulo, linha aproximada e snippet).
    *   **Destaque e Rolo de Tela (Foco do Autor)**: Clicar no link de citação abre o capítulo, busca e seleciona o nó de texto no TipTap e rola a tela suavemente para a posição destacada. Se a citação vier de uma entidade da wiki, exibe um modal flutuante com a ficha completa de worldbuilding sem tirar o autor de seu fluxo de escrita.

## Componentes Importantes
*   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/wiki/page.tsx) - Tela principal do portal wiki, formulários de edição, cross-linking local e os scripts de geração estática de HTML/Markdown.
*   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) - Menu suspenso de "Ferramentas", motor de busca Levenshtein, filtro de substituição de nós de texto seguros e modal de revisão em lote.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) - Definição da tabela `wikiEntities` na migração de versão 11 do Dexie.
