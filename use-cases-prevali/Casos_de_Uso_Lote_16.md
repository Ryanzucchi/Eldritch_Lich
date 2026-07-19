# Casos de Uso - Lote 16 (UC-151 a UC-160)

Este documento contém a especificação dos casos de uso de 151 a 160 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Verificar consistência de idade/data de nascimento de personagens

**ID:** UC-151  
**Requisito relacionado:** RF-151 (verificar consistência de idade/data de nascimento de personagens)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O personagem possui a data de nascimento preenchida na ficha de entidade e os textos relatam a idade do personagem ou o ano da cena.  
**Gatilho:** Análise lógica em background após o salvamento automático do texto.  

**Fluxo principal:**
1. A IA mapeia no texto menções à idade do personagem (ex: "Arthur tinha dezoito anos") ou a data da cena ativa (ex: "No ano de 1020").
2. O sistema lê na ficha de Arthur a data de nascimento (ex: nascido em 1005).
3. O sistema calcula a idade esperada do personagem na cena (1020 - 1005 = 15 anos).
4. O sistema confronta as informações e detecta a inconsistência (15 anos esperados vs 18 anos relatados).
5. O sistema destaca a informação no editor de texto com um sublinhado ondulado laranja.
6. O usuário clica sobre o trecho para ver a explicação.

**Fluxos alternativos:**
- *Data de nascimento vazia:* Se a data de nascimento estiver em branco, mas a IA identificar menções conflitantes de idade no texto em diferentes capítulos, ela aponta a inconsistência relativa.

**Fluxos de exceção:**
- *Viagem no tempo:* Se a obra envolver viagens temporais intencionais no enredo, o usuário pode marcar "Ignorar inconsistência temporal para este capítulo".

**Pós-condições:** Alertas de inconsistência de idades e datas são apresentados no editor de texto.

**Critérios de aceite:**
- [ ] A IA de consistência deve calcular idades e anos fictícios baseados em calendários customizados salvos no projeto.
- [ ] O processamento deve ter acurácia superior a 90% em casos explícitos de cálculo numérico direto.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Marcar status do texto (rascunho, revisão, finalizado)

**ID:** UC-152  
**Requisito relacionado:** RF-152 (marcar status do texto)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto existe no projeto.  
**Gatilho:** O usuário altera o status de fluxo de trabalho do documento.  

**Fluxo principal:**
1. O usuário abre o documento no editor de texto.
2. No painel de metadados, o usuário clica no seletor de status ativo.
3. O usuário seleciona o novo status: "Revisão".
4. O sistema grava a alteração do status no banco de dados e adiciona uma tag visual colorida no cabeçalho do arquivo e na árvore lateral.
5. Se o projeto for colaborativo, o sistema gera uma notificação informando aos revisores.

**Fluxos alternativos:**
- *Alteração em lote:* O usuário seleciona múltiplos textos na barra lateral, clica com o botão direito e seleciona "Alterar Status para..." -> "Finalizado".

**Fluxos de exceção:**
- *Sem permissão:* Se o usuário for apenas "Leitor", o seletor de status fica bloqueado.

**Pós-condições:** O status de progresso do texto é atualizado na base de dados e na interface lateral.

**Critérios de aceite:**
- [ ] A alteração do status na barra de navegação lateral deve ser instantânea (< 100ms).
- [ ] Ao marcar como "Finalizado", o sistema deve ter a opção de bloquear temporariamente edições no documento.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Criar fluxo de aprovação/revisão entre colaboradores

**ID:** UC-153  
**Requisito relacionado:** RF-153 (criar fluxo de aprovação/revisão entre colaboradores)  
**Ator(es):** Usuários (Escritores, Revisores, Administrador)  
**Pré-condições:** O projeto possui colaboradores com diferentes papéis e o texto está ativo.  
**Gatilho:** O escritor clica em "Solicitar Revisão" no painel do editor de texto.  

**Fluxo principal:**
1. O escritor abre o documento e clica no botão "Solicitar Revisão".
2. O sistema abre um modal solicitando que ele selecione qual colaborador será o revisor e digite instruções.
3. O escritor clica em "Enviar para Revisão".
4. O sistema altera o status do texto para "Em Revisão", bloqueia a edição direta por parte do escritor, e envia uma notificação para o Revisor B.
5. O Revisor B acessa o texto, faz anotações e comentários, e no cabeçalho clica em "Aprovar Texto" ou "Rejeitar".
6. O sistema atualiza o status correspondente (ex: se aprovado, muda para "Finalizado"; se rejeitado, retorna para "Rascunho" e libera a escrita para o autor).

**Fluxos alternativos:**
- *Fluxo em múltiplos níveis:* O administrador configura uma regra em que o texto precisa de 2 aprovações distintas para ser finalizado.

**Fluxos de exceção:**
- *Revisor removido:* Se o revisor atribuído for removido da equipe com a tarefa em andamento, o sistema notifica o administrador e o autor para reatribuir a revisão.

**Pós-condições:** O status e as restrições de escrita do documento são controlados ao longo do pipeline de aprovação.

**Critérios de aceite:**
- [ ] O sistema deve reter o histórico completo de solicitações, aprovações, rejeições e datas no log do projeto.
- [ ] O bloqueio e liberação de permissão de escrita de acordo com o status de revisão devem ser controlados no backend.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Favoritar pastas

**ID:** UC-154  
**Requisito relacionado:** RF-154 (favoritar pastas)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** A pasta existe na árvore lateral do projeto.  
**Gatilho:** O usuário clica com o botão direito na pasta e seleciona "Favoritar Pasta" ou clica na estrela do painel.  

**Fluxo principal:**
1. O usuário acessa a barra lateral e clica no menu de contexto de uma pasta.
2. O usuário seleciona a opção "Adicionar aos Favoritos".
3. O sistema atualiza o atributo `favoritada = true` para a pasta correspondente no banco de dados.
4. O sistema insere um atalho de acesso rápido para a pasta na seção de "Favoritos" no topo do painel de navegação lateral.
5. A pasta passa a exibir um ícone visual de estrela.

**Fluxos alternativos:**
- *Remover de favoritos:* O usuário clica em "Remover dos Favoritos" nas propriedades da pasta, desfazendo o atalho.

**Fluxos de exceção:**
- *Exclusão de pasta:* Se o usuário excluir a pasta favoritada, o sistema remove automaticamente a pasta e seu atalho de favoritos.

**Pós-condições:** O atalho para a pasta favorita é adicionado no painel lateral de acessos rápidos.

**Critérios de aceite:**
- [ ] A pasta exibida nos Favoritos deve manter sua funcionalidade de árvore de arquivos interna (permitindo expandir seus textos).
- [ ] A alteração deve ser gravada no banco de dados local/remoto e renderizada instantaneamente.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Fixar pastas

**ID:** UC-155  
**Requisito relacionado:** RF-155 (fixar pastas)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** A pasta de destino existe na árvore do projeto.  
**Gatilho:** O usuário clica em "Fixar Pasta no Topo" no menu de opções da pasta.  

**Fluxo principal:**
1. O usuário clica com o botão direito na pasta selecionada na barra lateral.
2. O usuário escolhe a opção "Fixar no Topo".
3. O sistema altera o status do atributo `fixada` para `true` no banco de dados.
4. O sistema reposiciona a pasta para o topo de seu nível hierárquico, ignorando regras de ordenação padrão.
5. A interface exibe um ícone de pino sobre a pasta fixada.

**Fluxos alternativos:**
- *Desafixar pasta:* O usuário clica em "Desafixar" e o sistema retorna a pasta à sua posição de ordenação natural.

**Fluxos de exceção:**
- *Múltiplos itens fixados:* Se houver múltiplas pastas e textos fixados no mesmo nível, o sistema coloca as pastas fixadas no topo seguidas pelos textos fixados.

**Pós-condições:** A pasta fica ancorada no topo do seu nível de diretório na interface lateral.

**Critérios de aceite:**
- [ ] O pino indicador de fixação deve ser renderizado de forma clara na interface lateral.
- [ ] A fixação da pasta deve atualizar a interface em menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Arquivar pastas

**ID:** UC-156  
**Requisito relacionado:** RF-156 (arquivar pastas)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** A pasta que o usuário deseja arquivar existe no projeto.  
**Gatilho:** O usuário seleciona "Arquivar Pasta" no menu de contexto.  

**Fluxo principal:**
1. O usuário clica com o botão direito na pasta e seleciona a opção "Arquivar".
2. O sistema abre um modal de confirmação explicando que a pasta e seus subdocumentos ficarão ocultos na árvore principal e em modo leitura.
3. O usuário clica em "Confirmar".
4. O sistema atualiza o atributo `arquivada = true` da pasta no banco de dados.
5. O sistema propaga a flag de arquivamento para todos os subdocumentos e subpastas.
6. A pasta e seus arquivos internos são realocados na pasta virtual de arquivados.

**Fluxos alternativos:**
- *Desarquivar pasta:* O usuário abre a pasta de arquivados, clica com o botão direito e seleciona "Desarquivar", restaurando a pasta e seus subdocumentos na estrutura ativa.

**Fluxos de exceção:**
- *Mover item para pasta arquivada:* O sistema impede o arrasto de arquivos ativos para dentro de uma pasta arquivada, exibindo "Não é possível mover arquivos ativos para diretórios arquivados".

**Pós-condições:** A pasta e todo o seu conteúdo são arquivados logicamente e mantidos em modo de leitura.

**Critérios de aceite:**
- [ ] A propagação de herança de arquivamento para subpastas no banco de dados deve ocorrer de forma rápida (menos de 1 segundo para até 100 arquivos).
- [ ] O editor de texto deve bloquear a escrita de qualquer arquivo pertencente à pasta arquivada.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Mover para lixeira com restauração posterior

**ID:** UC-157  
**Requisito relacionado:** RF-157 (mover para lixeira com restauração posterior)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O item (texto ou pasta) que o usuário deseja excluir existe e está ativo.  
**Gatilho:** O usuário seleciona a opção "Excluir/Mover para Lixeira" nas opções do arquivo ou pasta.  

**Fluxo principal:**
1. O usuário clica em "Excluir" no documento "Capítulo 3".
2. O usuário confirma a exclusão rápida no prompt.
3. O sistema altera o status do item para `lixeira = true` na base de dados (exclusão lógica).
4. O item é movido visualmente para a pasta virtual "Lixeira" exibida no rodapé.
5. Para restaurar, o usuário clica sobre a Lixeira na interface.
6. O sistema abre a listagem de arquivos da Lixeira.
7. O usuário clica em "Restaurar" ao lado do arquivo "Capítulo 3".
8. O sistema atualiza o atributo `lixeira = false` no banco de dados.
9. O arquivo é restaurado em sua pasta de origem original.

**Fluxos alternativos:**
- *Esvaziar lixeira:* O usuário clica em "Esvaziar Lixeira". O sistema realiza a exclusão física definitiva de todos os itens da lixeira no banco de dados.

**Fluxos de exceção:**
- *Limpeza automática:* O sistema apaga fisicamente os registros da lixeira que completaram 30 dias de exclusão de forma automática em background.

**Pós-condições:** O item é movido para a Lixeira e pode ser restaurado para sua posição anterior com sucesso.

**Critérios de aceite:**
- [ ] O processo de exclusão e restauração lógica deve manter a consistência de metadados e IDs originais do arquivo.
- [ ] A pasta Lixeira deve exibir a data de exclusão e o prazo restante para a exclusão definitiva.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Responder perguntas citando a fonte (texto/trecho)

**ID:** UC-158  
**Requisito relacionado:** RF-158 (responder perguntas citando a fonte)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** O usuário efetuou uma pergunta ao assistente de IA sobre o universo do projeto.  
**Gatilho:** A IA conclui a geração da resposta à pergunta do usuário.  

**Fluxo principal:**
1. O usuário digita a pergunta no chat de lore (ex: "Quantos anos Arthur tinha quando seu pai morreu?").
2. A IA pesquisa nos textos e constrói a resposta factual.
3. O sistema identifica os trechos exatos de texto de onde extraiu os dados.
4. O sistema renderiza a resposta no chat acompanhada por links clicáveis e numerados (notas de referência, ex: `[1]`).
5. O usuário clica no link `[1]` e o sistema abre o arquivo na linha correspondente no editor ao lado.

**Fluxos alternativos:**
- *Citar múltiplas fontes:* Se o fato for mencionado em vários trechos, a IA agrupa todas as fontes com links separados no rodapé da resposta.

**Fluxos de exceção:**
- *Fonte em metadados:* Se a informação vier de fichas e não de capítulos de texto, a IA exibe o link direcionando para a ficha do personagem correspondente.

**Pós-condições:** A resposta da IA é apresentada contendo a fundamentação textual detalhada e os hyperlinks correspondentes.

**Critérios de aceite:**
- [ ] Cada citação fornecida deve expor o nome do arquivo de origem, o capítulo e o número aproximado da linha do trecho.
- [ ] Clicar no link de citação deve focar e destacar temporariamente o trecho de origem no editor de texto.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Alternar tema claro/escuro

**ID:** UC-159  
**Requisito relacionado:** RF-159 (alternar tema claro/escuro)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está com a interface ativa na tela.  
**Gatilho:** O usuário clica no botão "Alternar Tema" no cabeçalho global do sistema.  

**Fluxo principal:**
1. O usuário clica no botão do ícone de Sol/Lua no topo direito da barra global.
2. O sistema detecta o tema atual ativo da interface (ex: "Tema Claro").
3. O sistema altera o tema da aplicação para "Tema Escuro", alterando as variáveis CSS de cores (planos de fundo escuros, textos em cores claras).
4. O sistema grava o tema ativo como preferência do usuário no localStorage.
5. A interface re-renderiza com cores escuras de alto contraste.

**Fluxos alternativos:**
- *Sincronizar com o SO:* O usuário escolhe a opção "Tema: Automático", fazendo o sistema obter o esquema de cores ativo do sistema operacional e aplicar.

**Fluxos de exceção:**
- *Atraso na renderização:* O sistema usa transições CSS suaves para suavizar a troca de cores das bordas e planos de fundo em menos de 150ms.

**Pós-condições:** A interface da aplicação passa a exibir o tema de cores escolhido pelo usuário.

**Critérios de aceite:**
- [ ] O tema escuro deve reduzir o brilho geral da tela sem comprometer o contraste de leitura dos caracteres (atender WCAG AA).
- [ ] O estado selecionado (claro/escuro) deve persistir entre logins e recarregamentos de página.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Suporte a leitor de tela (acessibilidade)

**ID:** UC-160  
**Requisito relacionado:** RF-160 (suporte a leitor de tela)  
**Ator(es):** Usuário (Escritor com deficiência visual), Sistema  
**Pré-condições:** O usuário possui um software leitor de tela ativo em sua máquina.  
**Gatilho:** O usuário navega pela aplicação utilizando as teclas Tab, setas direcionais ou atalhos de leitura.  

**Fluxo principal:**
1. O usuário acessa a página web do sistema.
2. O leitor de tela lê de forma estruturada as seções principais da interface graças ao uso de marcações HTML5 semânticas (como `<header>`, `<nav>`, `<main>`).
3. Ao focar em elementos interativos, o sistema fornece rótulos descritivos precisos via atributos ARIA (ex: `aria-label="Pasta de Personagens, expandida"`, `role="button"`).
4. Ao navegar pelo editor de texto, os atributos ARIA expõem o conteúdo da linha ativa e informam sobre desvios gramaticais.

**Fluxos alternativos:**
- *Atalhos de acessibilidade:* O usuário pressiona uma combinação de teclas padrão de acessibilidade para saltar diretamente para a caixa de digitação principal do editor.

**Fluxos de exceção:**
- *Imagens sem descrição:* Se o usuário focar em uma imagem que não possui `alt` definido, o sistema avisa o escritor sobre a importância de preencher a descrição textual na aba de propriedades.

**Pós-condições:** O usuário com deficiência visual consegue ler, navegar e editar dados de forma independente na aplicação.

**Critérios de aceite:**
- [ ] Todos os elementos e botões interativos devem possuir rótulos acessíveis descritivos (ARIA labels).
- [ ] A aplicação deve ser navegável de ponta a ponta utilizando apenas o teclado.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---

## Tabela Resumo: Lote 16 (UC-151 a UC-160)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-151** | RF-151 (consistência de idade de personagens) | Média | Alta |
| **UC-152** | RF-152 (marcar status do texto) | Alta | Baixa |
| **UC-153** | RF-153 (criar fluxo de aprovação...) | Alta | Média |
| **UC-154** | RF-154 (favoritar pastas) | Média | Baixa |
| **UC-155** | RF-155 (fixar pastas) | Média | Baixa |
| **UC-156** | RF-156 (arquivar pastas) | Média | Baixa |
| **UC-157** | RF-157 (mover para lixeira com rest.) | Crítica | Média |
| **UC-158** | RF-158 (responder perguntas citando fonte) | Alta | Alta |
| **UC-159** | RF-159 (alternar tema claro/escuro) | Média | Baixa |
| **UC-160** | RF-160 (suporte a leitor de tela) | Alta | Média |
