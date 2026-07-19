# Casos de Uso - Lote 8 (UC-071 a UC-080)

Este documento contém a especificação dos casos de uso de 71 a 80 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Mostrar quais textos serão afetados por uma alteração

**ID:** UC-071  
**Requisito relacionado:** RF-71 (mostrar quais textos serão afetados por uma alteração)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O sistema possui o grafo de dependências indexado e o usuário iniciou uma alteração em uma entidade ou evento.  
**Gatilho:** O usuário edita uma ficha de entidade ou um texto que serve de origem causal.  

**Fluxo principal:**
1. O usuário clica em "Salvar Alteração" em uma entidade/evento ou texto.
2. O sistema analisa em tempo real o escopo de impacto no grafo de causalidade.
3. O sistema exibe um modal contendo a lista de textos do projeto que contêm referências à entidade alterada em trechos posteriores à data da alteração.
4. Ao lado de cada título de texto afetado, o sistema mostra um sinalizador de gravidade (ex: "Alto Impacto: Personagem morto é citado como vivo").
5. O usuário confirma a alteração após ler a lista de impactos.

**Fluxos alternativos:**
- *Filtrar afetados:* O usuário pode clicar diretamente em qualquer item da lista de afetados para abrir o arquivo e iniciar a edição corretiva.

**Fluxos de exceção:**
- *Nenhum texto afetado:* Se a alteração não possuir dependências lógicas subsequentes nos textos cadastrados, o sistema prossegue com o salvamento direto sem exibir o aviso.

**Pós-condições:** O usuário é alertado preventivamente sobre quais arquivos e cenas necessitarão de revisão após a modificação realizada.

**Critérios de aceite:**
- [ ] A varredura de dependências deve varrer arquivos em todas as pastas do projeto.
- [ ] A lista de impacto deve ser exibida em menos de 1 segundo após o salvamento.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Mostrar cadeia de dependências entre entidades

**ID:** UC-072  
**Requisito relacionado:** RF-72 (mostrar cadeia de dependências entre entidades)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui múltiplas entidades cadastradas e interconectadas.  
**Gatilho:** O usuário seleciona "Exibir Cadeia de Dependências" a partir de uma entidade no grafo ou ficha técnica.  

**Fluxo principal:**
1. O usuário abre a ficha da entidade "Facção Rebelde".
2. O usuário clica na aba "Cadeia de Dependências".
3. O sistema calcula o fluxo de relacionamentos direcionados que saem ou chegam à entidade na base de dados.
4. O sistema exibe um fluxograma/diagrama de dependências hierárquico (ex: "Facção Rebelde" depende de -> "Financiamento Secreto" -> "Lorde Varis" -> "Castelo do Leste").
5. O usuário interage com o fluxograma para expandir ou colapsar níveis da cadeia.

**Fluxos alternativos:**
- *Destaque no Grafo Geral:* O usuário opta por visualizar a cadeia destacando as arestas e nós envolvidos diretamente no canvas do grafo global do projeto.

**Fluxos de exceção:**
- *Entidade isolada:* Se a entidade não tiver nenhuma conexão cadastrada, a interface exibe "Esta entidade não possui dependências registradas".

**Pós-condições:** A cadeia lógica e hierárquica de dependências da entidade é apresentada de forma visual.

**Critérios de aceite:**
- [ ] A visualização deve suportar até 5 níveis de encadeamento sem perdas de performance de tela.
- [ ] O usuário deve conseguir exportar o diagrama de dependências como arquivo SVG ou texto em formato Mermaid.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Mostrar inconsistências antes de salvar

**ID:** UC-073  
**Requisito relacionado:** RF-73 (mostrar inconsistências antes de salvar)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** O usuário está editando um texto e modificou partes dele que afetam a consistência geral.  
**Gatilho:** O usuário clica no botão "Salvar" ou aciona o salvamento manual.  

**Fluxo principal:**
1. O usuário clica em "Salvar".
2. O sistema intercepta o salvamento e dispara uma análise lógica rápida via IA (checagem de contradições físicas, de cronologia e de entidades).
3. O sistema detecta uma inconsistência crítica (ex: personagem que morreu no Capítulo 2 reaparece agindo no Capítulo 3).
4. O sistema interrompe o salvamento imediato e exibe um painel de alerta: "Detectamos inconsistências antes de salvar. Deseja revisar ou salvar assim mesmo?".
5. A tela exibe a lista das inconsistências com as descrições.
6. O usuário clica em "Salvar assim mesmo" ou em "Revisar".

**Fluxos alternativos:**
- *Salvamento silencioso:* Se o usuário ativar a configuração "Salvar sem validação de consistência", o salvamento ocorre de imediato sem interceptação ou aviso.

**Fluxos de exceção:**
- *Erro no validador:* Se o validador de consistência falhar ou estourar o timeout (ex: 2 segundos), o sistema realiza o salvamento dos dados de forma limpa para garantir que o usuário não perca seu trabalho.

**Pós-condições:** O usuário tem a oportunidade de remediar furos de roteiro e inconsistências antes de consolidar a versão do documento.

**Critérios de aceite:**
- [ ] A interceptação e a checagem rápida no backend devem ser processadas em no máximo 1,5 segundos.
- [ ] O painel de inconsistências deve fornecer a opção "Não perguntar novamente para este documento nesta sessão".

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Explicar por que duas entidades foram conectadas

**ID:** UC-074  
**Requisito relacionado:** RF-74 (explicar por que duas entidades foram conectadas)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** Existem conexões cadastradas de forma automática pela IA ou manual pelo usuário.  
**Gatilho:** O usuário clica em uma linha de conexão (aresta) no grafo de entidades e seleciona "Explicar Conexão".  

**Fluxo principal:**
1. O usuário abre o Grafo de Entidades.
2. O usuário clica sobre a linha que conecta o personagem "Arthur" ao local "Floresta de Whispering".
3. O usuário clica no botão "Explicar Conexão".
4. O sistema varre os textos do projeto buscando as frases e parágrafos indexados onde ambas as entidades aparecem juntas.
5. O sistema abre um balão lateral listando as justificativas textuais (ex: "Conectados porque: 1. No Capítulo 1 (linha 45), Arthur se perde na Floresta...").
6. O usuário lê as referências com links diretos para os arquivos correspondentes.

**Fluxos alternativos:**
- *Explicação de relações de IA:* Se o vínculo foi criado de forma automática pela IA, o sistema exibe o raciocínio detalhado gerado pelo modelo de linguagem no momento da criação.

**Fluxos de exceção:**
- *Conexão manual sem notas:* Se a conexão foi criada manualmente e o usuário não deixou descrições, o sistema exibe "Conexão criada manualmente pelo usuário. Nenhuma evidência textual adicional encontrada".

**Pós-condições:** As referências textuais e causais que justificam o vínculo entre as duas entidades são apresentadas na tela.

**Critérios de aceite:**
- [ ] O sistema deve exibir os trechos exatos de texto onde as entidades são correlacionadas.
- [ ] A busca por co-ocorrências e correlações deve levar menos de 1 segundo.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Explicar por que existe uma contradição

**ID:** UC-075  
**Requisito relacionado:** RF-75 (explicar por que existe uma contradição)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** Uma contradição lógica foi sinalizada no editor ou no relatório geral.  
**Gatilho:** O usuário clica no alerta de contradição ativa e clica no botão "Explicar Contradição".  

**Fluxo principal:**
1. O usuário clica sobre o trecho sublinhado em amarelo (contradição ativa) no editor de texto.
2. O usuário clica em "Explicar".
3. O sistema abre um painel lateral onde a IA detalha o raciocínio silogístico da inconsistência (ex: "Fato A: O personagem John morreu no ano 1020... Fato B: O texto do Capítulo 4 afirma que John está almoçando em 1025... Conclusão: Um personagem morto não pode realizar ações físicas").
4. O sistema exibe botões com ações corretivas sugeridas (ex: "Mudar data", "Editar trecho", "Ignorar").

**Fluxos alternativos:**
- *Explicar contradição de local:* A IA explica a incompatibilidade física/geográfica (ex: "Eles viajaram 500km a cavalo em 2 horas. Tempo de viagem estimado impossível").

**Fluxos de exceção:**
- *Erro de processamento da explicação:* Se o serviço de detalhamento falhar, o sistema exibe a mensagem curta original da detecção.

**Pós-condições:** A explicação lógica detalhada da inconsistência é apresentada ao usuário.

**Critérios de aceite:**
- [ ] A explicação deve citar de forma clara os documentos e trechos em conflito.
- [ ] A justificativa lógica deve ser expressa em linguagem natural clara e objetiva.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Permitir múltiplas linhas do tempo paralelas

**ID:** UC-076  
**Requisito relacionado:** RF-76 (permitir múltiplas linhas do tempo paralelas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui a funcionalidade de linhas do tempo ativa.  
**Gatilho:** O usuário acessa a aba Linha do Tempo e clica em "Nova Linha do Tempo Paralela".  

**Fluxo principal:**
1. O usuário acessa o módulo de Timeline.
2. O usuário clica em "Gerenciar Linhas do Tempo".
3. O usuário seleciona a opção "Criar Linha Paralela".
4. O sistema solicita que o usuário selecione uma timeline existente para servir de base ("Linha Origem") e um ponto de bifurcação (evento de ramificação).
5. O usuário seleciona as informações e confirma.
6. O sistema clona os eventos da timeline base anteriores ao ponto de bifurcação e cria uma nova timeline isolada para os eventos posteriores à data selecionada.
7. A interface exibe um seletor no topo da tela permitindo que o usuário alterne visualmente entre as linhas.

**Fluxos alternativos:**
- *Timeline paralela independente:* O usuário cria uma timeline totalmente em branco, sem clonar nenhuma outra existente, para representar acontecimentos isolados.

**Fluxos de exceção:**
- *Ponto de bifurcação inexistente:* Se o usuário não selecionar um evento de bifurcação válido, o sistema cria a linha como uma cópia idêntica completa da original.

**Pós-condições:** O banco de dados registra a nova timeline com os relacionamentos de parentesco e os respectivos eventos isolados.

**Critérios de aceite:**
- [ ] Alterações de eventos na linha paralela não devem alterar os eventos da linha base de origem pós-bifurcação.
- [ ] A tela de visualização cronológica deve permitir a exibição de duas linhas paralelas lado a lado para comparação.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Permitir universos alternativos

**ID:** UC-077  
**Requisito relacionado:** RF-77 (permitir universos alternativos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui dados de personagens, locais, cronologia no "Universo Cânone".  
**Gatilho:** O usuário seleciona "Criar Universo Alternativo" no painel de controle do projeto.  

**Fluxo principal:**
1. O usuário abre o menu de configurações do projeto e clica em "Universos e Versões".
2. O usuário clica em "Criar Universo Alternativo".
3. O sistema solicita um nome (ex: "Universo B - O Império Venceu") e uma descrição.
4. O sistema cria um clone lógico de todo o banco de dados do projeto (entidades, cronologia, conexões) em um namespace separado, mantendo os arquivos de texto em modo sandbox.
5. A interface exibe no cabeçalho geral do sistema o dropdown de seleção do universo ativo.
6. O usuário seleciona "Universo B".
7. O sistema recarrega as fichas de entidades e o grafo refletindo os dados do Universo B.

**Fluxos alternativos:**
- *Universo alternativo vazio:* O usuário cria um universo alternativo do zero, compartilhando apenas o nome das entidades, sem clonar relacionamentos originais.

**Fluxos de exceção:**
- *Estouro de cota:* Se a clonagem do universo exceder os limites de armazenamento da conta, o sistema impede a criação e solicita que o usuário libere espaço.

**Pós-condições:** O novo namespace de universo alternativo é criado e disponibilizado para modificação sem alterar o universo cânone.

**Critérios de aceite:**
- [ ] Modificar qualquer dado sob o contexto do Universo Alternativo não deve produzir qualquer efeito colateral nos dados do Universo Cânone.
- [ ] A transição entre universos na interface do usuário deve ser concluída em menos de 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Comparar duas versões do universo

**ID:** UC-078  
**Requisito relacionado:** RF-78 (comparar duas versões do universo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui pelo menos dois universos cadastrados (ex: "Universo Cânone" e "Universo Alternativo B").  
**Gatilho:** O usuário clica em "Comparar Universos" na barra de ferramentas.  

**Fluxo principal:**
1. O usuário acessa a tela de comparação de universos.
2. O usuário escolhe Universo Origem (ex: "Cânone") e Universo Alvo (ex: "Universo B").
3. O sistema varre os bancos de dados de ambos os namespaces comparando fichas, conexões e eventos cronológicos.
4. A interface exibe uma visualização em duas colunas (*Side-by-Side Diff*) destacando as diferenças com cores: adições (verde), remoções (vermelho) e modificações (amarelo).
5. O usuário navega pela lista de diferenças categorizada (Personagens, Locais, Cronologia).

**Fluxos alternativos:**
- *Mesclar modificação:* O usuário clica em "Mesclar para o Cânone" em uma alteração específica visualizada na coluna do Universo B, trazendo a mudança para a base principal.

**Fluxos de exceção:**
- *Erro de sincronização:* Se um dos universos estiver em processo de atualização pendente, o sistema impede a comparação até que a sincronização termine.

**Pós-condições:** O relatório comparativo das diferenças estruturais entre as duas versões do universo é apresentado na tela.

**Critérios de aceite:**
- [ ] A visualização comparativa deve usar cores e marcações visuais claras de adição, remoção e edição.
- [ ] O relatório deve permitir a busca rápida de termos dentro da tela de comparação.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Comparar duas linhas do tempo

**ID:** UC-079  
**Requisito relacionado:** RF-79 (comparar duas linhas do tempo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui pelo menos duas linhas do tempo.  
**Gatilho:** O usuário acessa o módulo de cronologia e clica em "Comparar Linhas do Tempo".  

**Fluxo principal:**
1. O usuário abre o painel da Timeline.
2. O usuário seleciona o botão "Comparar Timelines".
3. O usuário seleciona as duas linhas do tempo que deseja contrastar.
4. O sistema renderiza na tela duas linhas do tempo horizontais empilhadas verticalmente, compartilhando a mesma escala de datas.
5. O sistema desenha conectores visuais verticais pontilhados entre os eventos equivalentes presentes em ambas as linhas, evidenciando desvios ou datas conflitantes.
6. O usuário rola a escala temporal e visualiza a divergência dos acontecimentos em tempo real.

**Fluxos alternativos:**
- *Lista de divergências:* O usuário alterna para o modo lista, exibindo uma tabela com as diferenças exatas de datas e desfechos de eventos entre as duas timelines.

**Fluxos de exceção:**
- *Calendários incompatíveis:* Se as duas linhas do tempo usarem escalas incompatíveis, o sistema exige que o usuário defina um "ponto de ancoragem" (evento comum de data equivalente manual) para alinhar os eixos.

**Pós-condições:** As duas linhas do tempo são dispostas de forma alinhada na tela para análise de divergências cronológicas.

**Critérios de aceite:**
- [ ] A escala de zoom e rolagem horizontal deve ser sincronizada entre as duas timelines renderizadas.
- [ ] O sistema deve indicar visualmente os eventos que são exclusivos de uma das timelines.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Fazer ramificacoes temporárias

**ID:** UC-080  
**Requisito relacionado:** RF-80 (fazer ramificacoes temporárias)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está editando um projeto e deseja testar alterações sem criar um Universo Alternativo permanente.  
**Gatilho:** O usuário clica no botão "Ramificação Temporária" na barra de status do projeto.  

**Fluxo principal:**
1. O usuário clica em "Criar Ramificação Temporária".
2. O sistema cria um snapshot das tabelas do projeto correspondentes à sessão atual no cache local (IndexedDB).
3. A barra de status muda para a cor roxa com a etiqueta "Ramificação Ativa: [Temporária]".
4. O usuário faz edições no texto, exclui personagens ou move pastas.
5. Ao concluir os testes, o usuário clica em "Mesclar Alterações" ou em "Descartar Ramificação".

**Fluxos alternativos:**
- *Salvar como Universo Alternativo:* O usuário decide que a ramificação temporária ficou excelente e clica em "Salvar como Universo Alternativo" para convertê-la em um namespace definitivo.

**Fluxos de exceção:**
- *Fechamento do navegador:* Se a sessão do navegador expirar ou o usuário fechar a página com a ramificação ativa, ao reabrir o sistema pergunta se deseja restaurar ou descartar os dados pendentes.

**Pós-condições:** As alterações da ramificação temporária são aplicadas em definitivo ou limpas do cache.

**Critérios de aceite:**
- [ ] A ramificação temporária deve ser salva localmente na máquina do usuário para evitar tráfego desnecessário no servidor.
- [ ] O descarte da ramificação deve ser concluído de forma instantânea (< 100ms) restaurando o estado anterior limpo do projeto.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---

## Tabela Resumo: Lote 8 (UC-071 a UC-080)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-071** | RF-71 (mostrar quais textos serão afetados...) | Alta | Alta |
| **UC-072** | RF-72 (mostrar cadeia de dependências...) | Média | Média |
| **UC-073** | RF-73 (mostrar inconsistências antes de salvar) | Alta | Alta |
| **UC-074** | RF-74 (explicar por que entidades foram conectadas) | Alta | Média |
| **UC-075** | RF-75 (explicar por que existe contradição) | Alta | Alta |
| **UC-076** | RF-76 (permitir múltiplas timelines paralelas) | Média | Alta |
| **UC-077** | RF-77 (permitir universos alternativos) | Média | Alta |
| **UC-078** | RF-78 (comparar duas versões do universo) | Baixa | Alta |
| **UC-079** | RF-79 (comparar duas linhas do tempo) | Média | Alta |
| **UC-080** | RF-80 (fazer ramificacoes temporárias) | Alta | Alta |
