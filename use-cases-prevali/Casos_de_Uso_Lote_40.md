# Casos de Uso - Lote 40 (UC-391 a UC-400)

Este documento contém a especificação dos casos de uso de 391 a 400 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Gerenciar contas a pagar e a receber

**ID:** UC-391  
**Requisito relacionado:** RF-390 (gerenciar contas a pagar e a receber)  
**Ator(es):** Operador Financeiro, Sistema  
**Pré-condições:** Lançamentos financeiros de receitas a receber e despesas a pagar efetuados.  
**Gatilho:** O operador abre a agenda de vencimentos financeiros do projeto.  

**Fluxo principal:**
1. O operador acessa "Finanças" -> "Contas a Pagar / Receber".
2. O sistema exibe um calendário e uma tabela com todas as obrigações a vencer organizadas por data de vencimento.
3. O operador seleciona a conta correspondente (ex: conta a pagar com vencimento no dia atual).
4. O operador clica em "Realizar Pagamento" e anexa o arquivo do comprovante bancário correspondente.
5. O sistema atualiza o status do título para "Pago/Liquidado", registra a data e debita o valor correspondente do saldo da conta bancária ativa conectada.
6. O operador acessa a aba "Contas a Receber" e confere as faturas de clientes ativas.

**Fluxos alternativos:**
- *Prorrogação de vencimento:* O operador seleciona "Prorrogar Vencimento", insere a nova data de vencimento e grava a alteração justificando o adiamento.

**Fluxos de exceção:**
- *Títulos atrasados:* Se a data de vencimento expirar sem a liquidação do lançamento correspondente, o sistema marca o título com a tag vermelha "Atrasada" e dispara alertas diários por e-mail.

**Pós-condições:** O status de liquidação e a data de pagamento do título de conta a pagar/receber são salvos.

**Critérios de aceite:**
- [ ] A tela de contas a pagar e a receber deve exibir a soma consolidada de valores a vencer na semana e no mês atual em destaque.
- [ ] A alteração de status e anexo de comprovantes devem durar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Prever fluxo de caixa futuro

**ID:** UC-392  
**Requisito relacionado:** RF-391 (prever fluxo de caixa futuro)  
**Ator(es):** Controller Financeiro, Sistema, IA  
**Pré-condições:** Histórico de lançamentos financeiros de fluxo de caixa e previsões de mercado ativas.  
**Gatilho:** O controller solicita a estimativa preditiva do saldo de caixa para os próximos períodos.  

**Fluxo principal:**
1. O controller acessa "Finanças" -> "Previsão de Fluxo de Caixa (Forecast)".
2. O controller seleciona a abrangência temporal da projeção (ex: "Próximos 6 meses").
3. O backend aciona o modelo preditivo que analisa o histórico de entradas e saídas, inadimplência e vencimentos futuros agendados.
4. A IA projeta três curvas de saldo futuro correspondentes a cenários distintos: Cenário Otimista, Realista e Pessimista.
5. A interface plota o gráfico de linhas multicores com as faixas de confiança da projeção.

**Fluxos alternativos:**
- *Simular contratação:* O controller insere uma simulação de despesa futura (ex: contratação de funcionários). O sistema recalcula as projeções em tempo real e exibe o impacto na curva de saldo de caixa futuro.

**Fluxos de exceção:**
- *Histórico curto:* Se o projeto possuir menos de 3 meses de lançamentos reais, o sistema limita as previsões estatísticas puramente aos lançamentos futuros agendados de contas a pagar e receber, emitindo alerta sobre precisão reduzida.

**Pós-condições:** A simulação preditiva das curvas de saldo de caixa futuro é exibida na tela.

**Critérios de aceite:**
- [ ] A simulação preditiva de 6 meses deve ser processada em menos de 2 segundos.
- [ ] O gráfico deve permitir habilitar ou desabilitar os cenários clicando nas legendas.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Gerenciar notas de rodapé de textos

**ID:** UC-393  
**Requisito relacionado:** RF-392 (gerenciar notas de rodapé de textos)  
**Ator(es):** Usuário (Escritor/Pesquisador), Sistema  
**Pré-condições:** O editor de texto rico está ativo com o documento correspondente aberto.  
**Gatilho:** O usuário clica em "Inserir Nota de Rodapé" ao posicionar o cursor no texto.  

**Fluxo principal:**
1. O usuário digita no editor e posiciona o cursor ao final de uma palavra.
2. O usuário clica no botão "Inserir Nota de Rodapé" ou utiliza o atalho de teclado correspondente.
3. O sistema insere um número sobrescrito no texto corrido (ex: `¹`) e abre a respectiva caixa de texto no rodapé da página.
4. O usuário digita a observação da nota de rodapé correspondente.
5. O usuário confirma.
6. O sistema grava a relação de nota no banco de dados vinculada à coordenada de caracteres do texto.

**Fluxos alternativos:**
- *Renumeração automática:* O usuário decide inserir uma nova nota antes da nota criada. O sistema insere o novo indicador e atualiza de forma automática a sequência das notas subsequentes no documento.

**Fluxos de exceção:**
- *Marcador excluído:* Se o usuário deletar o indicador sobrescrito correspondente no texto corrido, o sistema remove automaticamente a nota de rodapé associada para evitar notas órfãs.

**Pós-condições:** A nota de rodapé vinculada ao caractere é salva e renderizada no documento.

**Critérios de aceite:**
- [ ] As notas de rodapé devem ser convertidas de forma nativa e correta ao exportar o texto para formatos DOCX ou PDF.
- [ ] A renumeração automática de referências de rodapé em documentos longos deve ocorrer em menos de 100ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar referências cruzadas entre capítulos

**ID:** UC-394  
**Requisito relacionado:** RF-393 (criar referências cruzadas entre capítulos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto literário ou acadêmico possui múltiplos capítulos e seções cadastrados.  
**Gatilho:** O usuário insere um link de referência cruzada no texto de um capítulo.  

**Fluxo principal:**
1. O usuário edita um capítulo do livro.
2. O usuário clica no ícone "Inserir Referência Cruzada" na barra de ferramentas.
3. O sistema abre a modal listando as entidades disponíveis (outros capítulos, seções, imagens ou tabelas).
4. O usuário seleciona o capítulo e a seção de destino correspondente.
5. O sistema insere um link dinâmico no texto (ex: "ver Capítulo 1, página 12").
6. O sistema mapeia o link na tabela de referências cruzadas.

**Fluxos alternativos:**
- *Páginas dinâmicas:* Se o capítulo de destino crescer e a seção referenciada mudar de página, o sistema recalcula de forma dinâmica o valor da tag de visualização atualizando a paginação.

**Fluxos de exceção:**
- *Destino excluído:* Se a seção ou capítulo referenciado for excluído do projeto, o sistema altera a cor da tag de referência cruzada para cinza exibindo a marcação "Referência quebrada".

**Pós-condições:** O link dinâmico de referência cruzada é inserido no texto e monitorado.

**Critérios de aceite:**
- [ ] O recálculo de links e páginas das referências cruzadas na visualização final do manuscrito deve ocorrer de forma automática antes da exportação em PDF.
- [ ] A inserção da referência cruzada no banco de dados deve levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Estruturar enredo em atos (estrutura de 3 atos, etc.)

**ID:** UC-395  
**Requisito relacionado:** RF-394 (estruturar enredo em atos)  
**Ator(es):** Usuário (Escritor/Roteirista), Sistema  
**Pré-condições:** Projeto literário ou de roteiro ativo.  
**Gatilho:** O usuário acessa a aba de arquitetura da história.  

**Fluxo principal:**
1. O usuário abre o painel "Estrutura do Enredo".
2. O usuário seleciona o modelo de estrutura desejado (ex: "Estrutura clássica de 3 Atos").
3. O sistema cria visualmente na tela três seções verticais correspondentes (Ato I: Apresentação, Ato II: Confrontação, Ato III: Resolução).
4. O usuário arrasta os cards de cenas do projeto e solta nas respectivas caixas dos Atos correspondentes.
5. O usuário clica em "Salvar Estrutura".
6. O sistema grava a estrutura lógica e a ordem das cenas no banco de dados.

**Fluxos alternativos:**
- *Linha do tempo:* O usuário prefere preencher a ordem linear da história em uma linha do tempo horizontal gráfica, e o sistema distribui as cenas nos blocos de atos de forma paralela em background.

**Fluxos de exceção:**
- *Cenas desalocadas:* Cenas criadas que não foram associadas a nenhum ato são listadas em uma coluna lateral específica no painel para que o escritor as organize posteriormente.

**Pós-condições:** A divisão e alocação de cenas ao longo da estrutura de atos são salvas e persistidas.

**Critérios de aceite:**
- [ ] A interface de arrastar e soltar cenas entre os atos deve apresentar animação fluida (acima de 60fps) e visualização de resumos curtos dos cards.
- [ ] A gravação e o recálculo da ordem das cenas devem durar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Definir jornada do herói (etapas)

**ID:** UC-396  
**Requisito relacionado:** RF-395 (definir jornada do herói)  
**Ator(es):** Usuário (Escritor/Roteirista), Sistema  
**Pré-condições:** Personagem principal e cenas cadastrados.  
**Gatilho:** O usuário clica em "Mapear Jornada do Herói" na ficha do protagonista.  

**Fluxo principal:**
1. O usuário acessa "Arquitetura da História" -> "Jornada do Personagem".
2. O usuário seleciona o protagonista e escolhe o modelo "Jornada do Herói (12 etapas)".
3. O sistema cria a linha visual de desenvolvimento listando as etapas (Mundo Comum, Chamado à Aventura, Recusa do Chamado, etc.).
4. O usuário clica em cada etapa correspondente e associa a respectiva cena do livro.
5. O usuário digita uma nota explicativa sobre a transformação psicológica do protagonista naquela etapa e confirma.
6. O sistema grava a jornada e os relacionamentos correspondentes no banco de dados.

**Fluxos alternativos:**
- *Modelos alternativos:* O usuário opta pelo modelo simplificado de 8 etapas (Story Circle de Dan Harmon), adaptando o painel de preenchimento para os novos campos estruturais.

**Fluxos de exceção:**
- *Personagem excluído:* Se o protagonista associado à jornada for deletado, o sistema desassocia os dados da jornada correspondente, emitindo um aviso explicativo na tela de arquitetura.

**Pós-condições:** O mapa estruturado contendo a jornada do protagonista é salvo no banco de dados do projeto.

**Critérios de aceite:**
- [ ] A tela de jornada do herói deve permitir visualizar graficamente o arco da jornada em formato circular clássico.
- [ ] A gravação no banco de dados deve levar menos de 250ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Gerenciar arcos dramáticos por personagem

**ID:** UC-397  
**Requisito relacionado:** RF-396 (gerenciar arcos dramáticos por personagem)  
**Ator(es):** Usuário (Escritor/Roteirista), Sistema  
**Pré-condições:** Personagens e capítulos cadastrados no projeto.  
**Gatilho:** O usuário cria um arco dramático de desenvolvimento para um personagem.  

**Fluxo principal:**
1. O usuário acessa "Módulo de Personagens" -> "Arcos Dramáticos".
2. O usuário clica em "Criar Novo Arco".
3. O sistema abre o formulário solicitando: Nome do Arco, Personagem Associado, Tipo de Mudança (Arco Crescente, Decrescente, Estático) e descrição dos conflitos.
4. O usuário insere as informações e mapeia a evolução do estado mental e comportamental do personagem ao longo dos capítulos.
5. O usuário clica em "Salvar Arco".
6. O sistema grava o arco na tabela correspondente e atualiza a ficha técnica do personagem selecionado.

**Fluxos alternativos:**
- *Múltiplos arcos:* O escritor pode criar sub-arcos ou arcos secundários de relacionamento amoroso ou profissional para o mesmo personagem principal de forma separada.

**Fluxos de exceção:**
- *Capítulos sem cronologia:* O sistema ordena automaticamente a evolução dos estados mentais do personagem com base na ordem cronológica de escrita dos capítulos, alertando caso haja capítulos desordenados na linha temporal.

**Pós-condições:** O arco de evolução dramática do personagem é gravado no banco de dados do projeto.

**Critérios de aceite:**
- [ ] O painel do personagem deve exibir o sumário textual simplificado de seu arco dramático para consulta rápida durante a escrita no editor.
- [ ] A gravação no banco de dados deve demorar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Visualizar tensão/ritmo dramático da história (gráfico)

**ID:** UC-398  
**Requisito relacionado:** RF-397 (visualizar tensão/ritmo dramático da história)  
**Ator(es):** Usuário (Escritor/Roteirista), Sistema  
**Pré-condições:** Cenas cadastradas e alocadas na ordem cronológica de leitura da história.  
**Gatilho:** O usuário acessa o painel de visualização de "Ritmo Dramático" do projeto.  

**Fluxo principal:**
1. O usuário abre o painel "Ritmo e Tensão".
2. O sistema busca todas as cenas ordenadas da história.
3. Para cada cena, o sistema lê o nível de tensão (escala de 1 a 10) que o usuário preencheu nas propriedades.
4. O sistema renderiza na tela um gráfico de linha interativo contendo a sequência de cenas no eixo X e o nível de tensão dramática no eixo Y (1=Calmaria, 10=Clímax).
5. O usuário visualiza as cristas de onda de tensão (confrontos) e vales (diálogos e calmaria).
6. O usuário clica em qualquer nó do gráfico de linha para abrir a cena correspondente no editor lateral.

**Fluxos alternativos:**
- *Cálculo por IA:* O usuário clica em "Análise de Sentimento por IA". A IA calcula automaticamente o score de tensão e plota uma curva computacional na tela para comparação analítica com a curva manual.

**Fluxos de exceção:**
- *Cenas sem valor:* O sistema assume valor padrão de tensão de nível 5 para as cenas em branco, exibindo uma linha tracejada e sinalizando para o preenchimento.

**Pós-condições:** A curva gráfica de andamento do ritmo e tensão da narrativa é exibida na tela.

**Critérios de aceite:**
- [ ] O gráfico de ritmo dramático deve se adaptar de imediato a alterações de ordem de cenas efetuadas pelo usuário na linha do tempo.
- [ ] O cálculo semântico de tensão por IA para até 30 cenas deve demorar menos de 5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Associar trilha sonora/música a cenas

**ID:** UC-399  
**Requisito relacionado:** RF-398 (associar trilha sonora/música a cenas)  
**Ator(es):** Usuário (Escritor/Roteirista), Sistema  
**Pré-condições:** Arquivos de áudio carregados na galeria ou links de streaming inseridos.  
**Gatilho:** O usuário edita a ficha de propriedades de uma cena específica.  

**Fluxo principal:**
1. O usuário abre a cena correspondente no editor de textos do sistema.
2. O usuário abre a aba de propriedades e clica em "Trilha Sonora Vinculada".
3. O usuário seleciona o arquivo de áudio carregado ou cola o link de compartilhamento de streaming externo (Spotify/YouTube).
4. O usuário clica em "Vincular Trilha".
5. O sistema grava o vínculo correspondente no banco.
6. Ao abrir o modo de leitura para aquela cena, o sistema ativa o reprodutor de áudio interno integrado tocando a música correspondente em volume baixo em background.

**Fluxos alternativos:**
- *Playlist por capítulo:* O usuário associa uma playlist inteira de músicas a um capítulo longo, permitindo reprodução sonora de forma contínua durante todo o processo de escrita.

**Fluxos de exceção:**
- *Mídia indisponível:* Se a música de streaming externa associada for deletada da plataforma externa, o player exibe uma marcação de indisponibilidade e convida o autor a atualizar o link.

**Pós-condições:** O arquivo ou link de áudio é associado à cena, habilitando a reprodução sonora de fundo na leitura.

**Critérios de aceite:**
- [ ] O reprodutor interno de áudio deve conter barra de progresso, botão play/pause e controle de volume independente.
- [ ] O salvamento do vínculo de áudio deve levar menos de 200ms.

**Prioridade:** Baixa  
**Complexidade estimada:** Média  

---
### Caso de Uso: Exportar roteiro no formato padrão (Courier, etc.)

**ID:** UC-400  
**Requisito relacionado:** RF-399 (exportar roteiro no formato padrão)  
**Ator(es):** Usuário (Roteirista/Escritor), Sistema  
**Pré-condições:** Roteiro escrito contendo a formatação padrão da indústria (Cabeçalhos de Cena, Ações, Diálogos, Personagens).  
**Gatilho:** O roteirista clica em "Exportar Roteiro" no painel de exportação.  

**Fluxo principal:**
1. O roteirista abre o manuscrito do roteiro e clica em "Exportar Roteiro".
2. O roteirista seleciona as opções de formato (ex: PDF sob o padrão internacional de roteiros cinematográficos).
3. O roteirista confirma a exportação.
4. O backend renderiza o layout do roteiro forçando: fonte Courier 12 pontos, espaçamento simples, margem esquerda de 1.5 polegadas, direita de 1.0 polegada, diálogos recuados e nomes de personagens centralizados.
5. O sistema gera o arquivo PDF estruturado e inicia o download de forma automática.

**Fluxos alternativos:**
- *Exportar em Fountain:* O roteirista opta por baixar em formato Fountain (.fountain), um formato padrão de texto simples que preserva marcações de formatação de roteiro universais.

**Fluxos de exceção:**
- *Quebras de página incorretas:* O renderizador de PDF aplica a quebra de página automática respeitando as regras de transição de diálogos, evitando que falas de personagens sejam quebradas ou cortadas no meio de uma frase na transição de folhas.

**Pós-condições:** O arquivo PDF do roteiro sob formatação Courier padrão cinematográfica é baixado pelo usuário.

**Critérios de aceite:**
- [ ] O arquivo PDF resultante deve passar na verificação exata de recuos e margens exigidos pela indústria de cinema.
- [ ] A renderização e geração do PDF de um roteiro longo de 120 páginas devem demorar menos de 6 segundos.

---

## Tabela Resumo: Lote 40 (UC-391 a UC-400)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-391** | RF-390 (gerenciar contas a pagar e a receber) | Alta | Média |
| **UC-392** | RF-391 (prever fluxo de caixa futuro) | Média | Alta |
| **UC-393** | RF-392 (gerenciar notas de rodapé) | Alta | Média |
| **UC-394** | RF-393 (criar referências cruzadas entre capítulos) | Alta | Média |
| **UC-395** | RF-394 (estruturar enredo em atos) | Alta | Média |
| **UC-396** | RF-395 (definir jornada do herói) | Média | Média |
| **UC-397** | RF-396 (arcos dramáticos por personagem) | Alta | Média |
| **UC-398** | RF-397 (visualizar ritmo dramático da história) | Média | Alta |
| **UC-399** | RF-398 (associar trilha sonora a cenas) | Baixa | Média |
| **UC-400** | RF-399 (exportar roteiro em formato padrão) | Alta | Alta |
