# Casos de Uso - Lote 20 (UC-191 a UC-200)

Este documento contém a especificação dos casos de uso de 191 a 200 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Importar textos em formato HTML

**ID:** UC-191  
**Requisito relacionado:** RF-191 (importar textos em formato HTML)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um arquivo `.html` válido contendo texto estruturado.  
**Gatilho:** O usuário seleciona "Importar Arquivo (.html)" no menu do diretório de textos do projeto.  

**Fluxo principal:**
1. O usuário clica com o botão direito em uma pasta do projeto e seleciona "Importar" -> "Arquivo HTML".
2. O sistema abre o seletor de arquivos local.
3. O usuário seleciona o arquivo e confirma.
4. O backend lê o arquivo HTML, executa a sanitização do código (removendo scripts e tags inválidas) e mapeia os elementos semânticos para o formato estruturado do editor.
5. O sistema cria um novo arquivo de texto na pasta correspondente com o nome baseado no título do arquivo importado.
6. O editor carrega o texto formatado (negritos, itálicos, cabeçalhos, listas e tabelas convertidos).

**Fluxos alternativos:**
- *Importação por arrasto:* O usuário arrasta o arquivo `.html` de seu computador diretamente para a árvore de diretórios na interface lateral para iniciar a importação.

**Fluxos de exceção:**
- *Arquivo sem conteúdo legível:* Se o arquivo HTML não contiver elementos de texto úteis, o sistema aborta o carregamento e notifica: "Falha na importação. O arquivo não contém texto legível".

**Pós-condições:** O arquivo HTML externo é importado como um documento de texto ativo no projeto.

**Critérios de aceite:**
- [ ] O parser deve remover tags de estilo inline estranhas e scripts para garantir a integridade do editor.
- [ ] O tempo total de parser e criação do documento de tamanho padrão deve ser menor que 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Importar textos em formato Markdown

**ID:** UC-192  
**Requisito relacionado:** RF-192 (importar textos em formato Markdown)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um arquivo com extensão `.md` ou `.markdown`.  
**Gatilho:** O usuário clica em "Importar Markdown" no menu da pasta do projeto.  

**Fluxo principal:**
1. O usuário clica em "Importar Markdown" na pasta selecionada.
2. O sistema abre a janela de upload do sistema operacional.
3. O usuário escolhe o arquivo `.md` correspondente e confirma.
4. O backend lê o texto em Markdown e o converte em representação estruturada rich-text (convertendo `#` em cabeçalhos, `**` em negritos, `[[link]]` em hyperlinks internos).
5. O sistema cria o arquivo de texto no diretório correspondente.
6. O texto formatado é aberto no editor para exibição.

**Fluxos alternativos:**
- *Importação múltipla:* O usuário seleciona múltiplos arquivos `.md` simultaneamente no gerenciador. O sistema os importa em lote mantendo seus respectivos nomes originais.

**Fluxos de exceção:**
- *Codificação incompatível:* Se o arquivo utilizar codificação antiga que altere a acentuação brasileira, o sistema tenta converter para UTF-8 de forma automática ou alerta o usuário.

**Pós-condições:** O documento Markdown é integrado e disponibilizado para edição no projeto.

**Critérios de aceite:**
- [ ] O conversor deve traduzir tabelas Markdown e citações (`>`) de forma visualmente correta no editor.
- [ ] O tempo de processamento deve ser de no máximo 500ms por arquivo.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Importar textos em formato TXT

**ID:** UC-193  
**Requisito relacionado:** RF-193 (importar textos em formato TXT)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um arquivo `.txt` contendo texto puro.  
**Gatilho:** O usuário clica em "Importar TXT" no gerenciador lateral do projeto.  

**Fluxo principal:**
1. O usuário clica em "Importar Texto (.txt)" na pasta correspondente.
2. O sistema abre a caixa de diálogo do SO para seleção do arquivo.
3. O usuário seleciona o arquivo e confirma.
4. O backend lê o arquivo TXT utilizando codificação UTF-8, cria um novo documento de texto, injeta o texto bruto e substitui quebras de linha sequenciais por novos parágrafos padrão.
5. O arquivo de texto é aberto no editor para escrita.

**Fluxos alternativos:**
- *Colagem rápida:* O usuário copia o conteúdo do bloco de notas e o cola diretamente no corpo de um editor vazio criado na hora.

**Fluxos de exceção:**
- *Arquivo binário renomeado:* Se o usuário tentar enviar um arquivo binário renomeado para `.txt`, o parser detecta caracteres de controle inválidos e cancela o upload: "O arquivo selecionado não é um arquivo de texto válido".

**Pós-condições:** O conteúdo do arquivo TXT é importado como texto ativo no projeto.

**Critérios de aceite:**
- [ ] O sistema deve limpar caracteres invisíveis ou de controle inconsistentes.
- [ ] A criação do arquivo importado deve durar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Importar textos em formato DOCX

**ID:** UC-194  
**Requisito relacionado:** RF-194 (importar textos em formato DOCX)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um arquivo no formato do Microsoft Word (`.docx`).  
**Gatilho:** O usuário clica em "Importar DOCX" no gerenciador de arquivos do projeto.  

**Fluxo principal:**
1. O usuário clica na pasta e seleciona "Importar" -> "Arquivo Word (.docx)".
2. O sistema solicita a seleção do arquivo local.
3. O usuário seleciona o arquivo `.docx` desejado e confirma.
4. O backend faz o upload do arquivo e aciona o conversor OpenXML.
5. O conversor extrai os elementos do Word: parágrafos, cabeçalhos, listas, negritos, itálicos, cores e tabelas estruturadas, ignorando estilos proprietários complexos de página.
6. O sistema cria e abre o novo documento contendo o texto e suas formatações originais convertidas.

**Fluxos alternativos:**
- *Importação com imagens embutidas:* Se o arquivo DOCX contiver imagens embutidas, o conversor as extrai, faz o upload como mídias do projeto e reinsere os links correspondentes no corpo do texto final.

**Fluxos de exceção:**
- *Formato DOC antigo:* Se o usuário tentar importar um arquivo no formato antigo `.doc` (Word 97-2003), o sistema impede a conversão e solicita salvar o arquivo como `.docx` antes de importar.

**Pós-condições:** O conteúdo e formatação do arquivo DOCX são convertidos e criados no editor do projeto.

**Critérios de aceite:**
- [ ] O parser deve manter a hierarquia de parágrafos e recuos simples intactos.
- [ ] O processo de conversão para documentos de até 10.000 palavras deve demorar menos de 4 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Visualizar histórico de alterações por colaborador

**ID:** UC-195  
**Requisito relacionado:** RF-195 (visualizar histórico de alterações por colaborador)  
**Ator(es):** Usuário (Escritor/Admin), Sistema  
**Pré-condições:** O projeto é colaborativo e possui logs de alterações registrados.  
**Gatilho:** O usuário abre o histórico de versões e ativa a visualização por colaborador.  

**Fluxo principal:**
1. O usuário abre o painel do "Histórico de Versões" do documento.
2. O usuário clica em "Filtrar por Colaborador".
3. O sistema exibe os avatares dos membros que trabalharam no documento.
4. O usuário seleciona um colaborador específico.
5. O sistema destaca na lista de histórico apenas os salvamentos efetuados por aquele colaborador.
6. No editor, o sistema colore com um tom específico as palavras inseridas ou modificadas por esse usuário na versão ativa.

**Fluxos alternativos:**
- *Relatório de contribuição:* O usuário visualiza estatísticas percentuais de contribuição no dashboard.

**Fluxos de exceção:**
- *Sem permissão:* Usuários sem acesso de escrita ou leitores simples não visualizam a identificação individual de autoria caso o projeto seja configurado como anônimo.

**Pós-condições:** O histórico segmentado de alterações e o realce de autoria por colaborador são apresentados na tela.

**Critérios de aceite:**
- [ ] O realce de cores por autor no texto deve possuir contraste suficiente para leitura confortável (WCAG AA).
- [ ] O processamento do diff por colaborador deve levar menos de 1 segundo.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Comparar versões de textos (diff side-by-side)

**ID:** UC-196  
**Requisito relacionado:** RF-196 (comparar versões de textos (diff side-by-side))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto possui pelo menos duas versões registradas no histórico.  
**Gatilho:** O usuário seleciona duas versões e clica em "Comparar Side-by-Side".  

**Fluxo principal:**
1. O usuário acessa a aba "Histórico de Versões" de um texto.
2. O usuário seleciona a "Versão A" e a "Versão B (Atual)".
3. O usuário clica em "Comparar Lado a Lado".
4. O sistema divide a tela verticalmente em dois painéis do editor:
   - Painel Esquerdo: Exibe o texto da Versão A, destacando em vermelho as palavras apagadas.
   - Painel Direito: Exibe o texto da Versão B, destacando em verde as palavras inseridas.
5. As barras de rolagem de ambos os painéis são vinculadas (sincronizadas) durante a navegação.

**Fluxos alternativos:**
- *Diff inline:* O usuário altera para a visualização inline, onde exclusões e inclusões são mostradas no mesmo editor de forma corrida.

**Fluxos de exceção:**
- *Versões idênticas:* Se as versões selecionadas forem iguais, o sistema informa: "Nenhuma diferença encontrada entre as versões".

**Pós-condições:** A comparação de diferenças lado a lado é exibida de forma sincronizada na tela.

**Critérios de aceite:**
- [ ] A rolagem sincronizada deve ter precisão de pixel para manter os parágrafos correspondentes alinhados na tela.
- [ ] A geração do diff lado a lado para um capítulo de 5.000 palavras deve demorar menos de 1,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Restaurar versão específica

**ID:** UC-197  
**Requisito relacionado:** RF-197 (restaurar versão específica)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está na tela de comparação de versões.  
**Gatilho:** O usuário clica no botão "Restaurar esta Versão" correspondente a um dos painéis.  

**Fluxo principal:**
1. O usuário clica em "Restaurar esta Versão" na coluna que exibe a "Versão A".
2. O sistema exibe um modal de confirmação explicando que a versão ativa atual será substituída pela Versão A, mas que a versão ativa atual será salva no histórico.
3. O usuário clica em "Confirmar Restauração".
4. O sistema atualiza o conteúdo do documento ativo no banco de dados com a cópia exata dos dados da Versão A.
5. O editor de texto principal recarrega o conteúdo restaurado.

**Fluxos alternativos:**
- *Restaurar trecho específico:* O usuário seleciona apenas um parágrafo da coluna antiga e o reverte no editor ativo.

**Fluxos de exceção:**
- *Conflito de edição concorrente:* Se outro colaborador salvar uma edição no mesmo texto enquanto o usuário confirmava a restauração, o sistema impede a ação direta e alerta o usuário para revisar as alterações.

**Pós-condições:** A versão histórica selecionada substitui o conteúdo do documento ativo de forma segura.

**Critérios de aceite:**
- [ ] A ação de restauração deve gerar um log de auditoria associado ao usuário que a executou.
- [ ] A restauração de dados deve ser transacional.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar ramificação do texto (branch) para testes

**ID:** UC-198  
**Requisito relacionado:** RF-198 (criar ramificação do texto (branch) para testes)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O arquivo de texto de origem está salvo no projeto.  
**Gatilho:** O usuário clica na opção "Criar Ramificação (Branch)" no menu do documento.  

**Fluxo principal:**
1. O usuário abre o capítulo de texto desejado.
2. O usuário clica com o botão direito sobre o arquivo na árvore lateral e seleciona "Criar Branch de Testes".
3. O sistema abre um modal solicitando um nome para o branch (ex: "Final Alternativo").
4. O usuário confirma.
5. O sistema clona logicamente o documento em uma tabela de branches, criando uma cópia isolada vinculada ao arquivo principal.
6. A árvore lateral passa a exibir uma ramificação aninhada abaixo do capítulo principal.
7. O usuário edita o branch livremente, sem afetar o texto principal.

**Fluxos alternativos:**
- *Múltiplos branches:* O usuário cria vários branches a partir do mesmo capítulo para testar diferentes rumos para a história.

**Fluxos de exceção:**
- *Ramificações aninhadas:* O sistema restringe o nível de branches para no máximo 1 nível de profundidade e desabilita a opção dentro de um branch ativo.

**Pós-condições:** O branch de texto isolado é criado na base de dados e disponibilizado para edição de testes.

**Critérios de aceite:**
- [ ] O branch de testes deve possuir status visual claramente diferenciado na árvore de diretórios (ex: ícone de bifurcação).
- [ ] O tempo de criação lógica do branch deve ser menor que 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Mesclar ramificação de volta ao texto principal (merge)

**ID:** UC-199  
**Requisito relacionado:** RF-199 (mesclar ramificação de volta ao texto principal (merge))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um branch de testes criado contendo edições prontas que deseja aplicar na versão principal.  
**Gatilho:** O usuário clica em "Mesclar Branch" nas opções do branch aberto.  

**Fluxo principal:**
1. O usuário abre o branch de testes correspondente.
2. O usuário clica no botão "Mesclar no Texto Principal".
3. O sistema compara as modificações efetuadas no branch com o estado atual do texto principal.
4. Se não houver modificações concorrentes no texto principal desde a criação do branch, o sistema substitui o conteúdo do texto principal pelo conteúdo do branch no banco de dados.
5. O sistema marca o branch de testes como "Mesclado".
6. O texto principal é atualizado e o branch é ocultado.

**Fluxos alternativos:**
- *Mesclar mantendo o branch:* O usuário opta por manter o branch aberto na árvore mesmo após a mesclagem para continuar testes adicionais.

**Fluxos de exceção:**
- *Conflito de mesclagem:* Se o texto principal tiver sido modificado concorrentemente por outro colaborador desde a criação do branch, o sistema interrompe a mesclagem e aciona a tela de Gerenciamento de Conflitos.

**Pós-condições:** As alterações da ramificação são integradas na versão principal do arquivo.

**Critérios de aceite:**
- [ ] A mesclagem deve criar um ponto de restauração automática no histórico de versões do documento principal.
- [ ] O merge sem conflitos deve ser concluído em até 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Gerenciar conflitos na mesclagem

**ID:** UC-200  
**Requisito relacionado:** RF-200 (gerenciar conflitos na mesclagem)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O sistema tentou executar um merge de branch mas detectou alterações conflitantes nas mesmas linhas do texto principal.  
**Gatilho:** Ação de merge falhar devido a alterações concorrentes.  

**Fluxo principal:**
1. O sistema barra a mesclagem automática e abre a tela "Resolver Conflitos de Mesclagem".
2. A interface exibe os trechos de texto conflitantes em três blocos:
   - Bloco Esquerdo: Texto da versão Principal (Main) atual.
   - Bloco Direito: Texto da versão da Ramificação (Branch) proposta.
   - Bloco Central: Visualização do resultado final mesclado.
3. O sistema realça os conflitos com marcas coloridas e botões "Manter Principal" e "Manter Ramificação".
4. O usuário seleciona a opção desejada para cada bloco conflitante.
5. O painel central exibe a união das escolhas em tempo real.
6. O usuário revisa o texto mesclado final e clica em "Confirmar Resolução e Mesclar".
7. O sistema grava o texto resolvido no documento principal e encerra a ramificação.

**Fluxos alternativos:**
- *Edição manual:* O usuário digita uma redação inédita mesclando partes de ambos os lados diretamente na caixa de resultado central.

**Fluxos de exceção:**
- *Abortar mesclagem:* O usuário clica em "Cancelar Mesclagem". O sistema descarta a resolução de conflitos temporária, mantém o branch e o texto principal intocados e retorna à tela anterior.

**Pós-condições:** Os conflitos textuais são resolvidos e o merge é concluído.

**Critérios de aceite:**
- [ ] O painel de conflitos deve permitir navegar sequencialmente por todos os conflitos ("Próximo / Anterior").
- [ ] A finalização da mesclagem após a resolução deve ser transacional.

---

## Tabela Resumo: Lote 20 (UC-191 a UC-200)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-191** | RF-191 (importar textos em formato HTML) | Média | Média |
| **UC-192** | RF-192 (importar textos em formato Markdown) | Alta | Baixa |
| **UC-193** | RF-193 (importar textos em formato TXT) | Média | Baixa |
| **UC-194** | RF-194 (importar textos em formato DOCX) | Alta | Média |
| **UC-195** | RF-195 (histórico de alterações por autor) | Alta | Alta |
| **UC-196** | RF-196 (comparar versões side-by-side) | Alta | Alta |
| **UC-197** | RF-197 (restaurar versão específica) | Alta | Média |
| **UC-198** | RF-198 (criar ramificação de texto) | Média | Média |
| **UC-199** | RF-199 (mesclar ramificação de texto) | Média | Alta |
| **UC-200** | RF-200 (gerenciar conflitos na mesclagem) | Média | Alta |
