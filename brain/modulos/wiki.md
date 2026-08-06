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
7.  **Magia e Tecnologia vinculadas ao lore (UC-255/256)**:
    *   Cada nó de magia ou tecnologia pode declarar personagens (`masterCharacterIds`) e facções (`factionIds`) relacionadas.
    *   A árvore permite filtrar pelos dois vínculos simultaneamente, preservando os nós existentes que ainda não possuem metadados de relacionamento.
8.  **Participação de eventos históricos (UC-289/291)**:
    *   Eventos aceitam listas múltiplas de personagens e facções do projeto, persistidas em `participatingCharacterIds` e `participatingFactionIds`.
    *   Os cartões de cronologia tornam esses participantes visíveis sem exigir a abertura da ficha.
9.  **Ilustrações locais de criaturas e itens (UC-280/287)**:
    *   Os formulários aceitam somente imagens de até 5 MB e as convertem em data URL antes de gravar no IndexedDB.
    *   A prévia de envio e o cartão final mostram a ilustração; não há dependência de serviço externo de arquivos.
10. **Devoções de personagens (UC-258)**:
    *   `CharacterSheet.religiousDevotions` guarda a religião e a intensidade individual (devoto, seguidor ou ateu), permitindo leituras sem depender de texto livre.
    *   Ao salvar um devoto ou seguidor, a religião recebe o personagem em `believerCharacterIds`; a opção ateu mantém o registro sem incluí-lo como crente.
11. **Locais sagrados no mapa (UC-259)**:
    *   A ficha de religião persiste `sacredLocationIds`; o módulo cartográfico reconhece os marcadores ligados a esses IDs e troca seu ícone por um templo.
    *   O vínculo explícito `GeoMapMarker.entityId` evita inferir sacralidade a partir do texto do nome do marcador.
12. **Sugestões de conexões (UC-054, fallback):** a aba de relações calcula similaridade cosseno TF-IDF entre fichas locais ainda não conectadas e exibe termos em comum. Embeddings densos continuam pendentes.
13. **Fusão de duplicatas (UC-109):** nomes com Levenshtein ≤ 1 são apresentados para confirmação. A fusão é transacional, mescla campos ausentes na ficha principal e redireciona referências locais antes de excluir a secundária.
14. **Árvore genealógica navegável (UC-172):** a aba de genealogia converte os registros PAI, MÃE e FILHO em ramos de ascendente para descendente. Cada nó abre a ficha do personagem e a travessia marca ciclos inválidos, em vez de entrar em recursão infinita.
15. **Rede e heráldica de facções (UC-178/179):** guerras, tratados e alianças passam a registrar as facções participantes e alimentam um grafo SVG clicável. O compositor local cria brasões SVG autocontidos (forma, símbolo e cores), guardados em `FactionSheet.coatOfArmsSvg`; URL externa é apenas alternativa.
16. **DAG de magia e tecnologia (UC-251):** `TechOrMagicNode.prerequisiteIds` é preenchido pelo formulário e renderizado como fluxograma SVG por níveis. Arestas apontam para o nó dependente e referências ausentes tornam o nó cinza, preservando a leitura do grafo mesmo com dados incompletos.
17. **Menções em comentários (UC-133, parcial):** o modal de comentário reconhece a palavra em curso iniciada por `@` e oferece colaboradores para inserção textual. A representação Tiptap própria e o envio em tempo real continuam condicionados ao canal de colaboração.
18. **Avatares de personagem (UC-295):** o formulário converte uma imagem local de até 5 MB para data URL e a persiste em `CharacterSheet.avatarUrl`, com prévia antes do salvamento e exibição no cartão.
19. **Perguntas de continuidade (UC-105, parcial):** a central de conexões transforma lacunas explícitas de descrição e relacionamento das fichas em perguntas rastreáveis, sem inventar fatos. O modelo abstrativo baseado nos capítulos não é substituído por esse fallback.
20. **Genealogia extraída sob revisão (UC-060):** padrões explícitos de parentesco nos capítulos geram sugestões que o autor aceita manualmente antes de persistir a relação. A aba “Árvore genealógica” lê os personagens e vínculos confirmados do IndexedDB, permite escolher uma pessoa central e apresenta somente seus relacionamentos diretos para não saturar a leitura.
21. **Impacto de entidade (UC-070/071):** a central de conexões busca a menção exata da entidade nos capítulos locais e lista os manuscritos potencialmente afetados antes de uma alteração.
22. **Evidência automática de personagens (UC-108, parcial):** o autosave registra em fichas existentes os capítulos que as mencionam literalmente; não cria entidades nem altera fatos sem revisão semântica.

## Componentes Importantes
*   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/wiki/page.tsx) - Tela principal do portal wiki, formulários de edição, cross-linking local e os scripts de geração estática de HTML/Markdown.
*   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) - Menu suspenso de "Ferramentas", motor de busca Levenshtein, filtro de substituição de nós de texto seguros e modal de revisão em lote.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) - Definição da tabela `wikiEntities` na migração de versão 11 do Dexie.
*   [worldbuilding/page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/worldbuilding/page.tsx) - Fichas de mundo, árvores e grafos locais navegáveis, heráldica SVG e filtros por personagem e facção.
