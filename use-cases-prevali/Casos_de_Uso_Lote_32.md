# Casos de Uso - Lote 32 (UC-311 a UC-320)

Este documento contém a especificação dos casos de uso de 311 a 320 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Gerenciar contratos de trabalho

**ID:** UC-311  
**Requisito relacionado:** RF-310 (gerenciar contratos de trabalho)  
**Ator(es):** Administrador/RH, Sistema  
**Pré-condições:** O funcionário correspondente está admitido no sistema.  
**Gatilho:** O gestor clica em "Gerenciar Contratos" no perfil do funcionário.  

**Fluxo principal:**
1. O gestor de RH acessa a aba "Contratos de Trabalho" na ficha do funcionário.
2. O gestor visualiza os contratos existentes (ativos e passados).
3. O gestor clica em "Novo Contrato de Trabalho" ou "Aditivo Contratual".
4. O gestor preenche a modalidade (Dropdown: CLT, PJ, Estágio), vigência, carga horária e anexa o arquivo assinado do contrato (PDF).
5. O gestor clica em "Salvar".
6. O sistema atualiza o status do contrato na base de dados e o vincula ao histórico do colaborador.

**Fluxos alternativos:**
- *Geração automática de contrato:* O sistema gera o arquivo do contrato preenchendo um modelo padrão (template) com os dados cadastrados na admissão e envia para assinatura eletrônica do colaborador.

**Fluxos de exceção:**
- *Conflito de vigência:* Se o gestor tentar cadastrar um contrato cuja data de início conflite com um contrato ativo preexistente do mesmo funcionário, o sistema alerta e solicita o encerramento do contrato antigo.

**Pós-condições:** O contrato de trabalho é cadastrado e associado ao funcionário no banco de dados.

**Critérios de aceite:**
- [ ] O arquivo PDF do contrato deve ser armazenado com criptografia em repouso por razões de conformidade legal.
- [ ] A inserção no banco e atualização do perfil devem demorar menos de 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Calcular impostos e encargos trabalhistas

**ID:** UC-312  
**Requisito relacionado:** RF-311 (calcular impostos e encargos trabalhistas)  
**Ator(es):** Sistema, Administrador/RH  
**Pré-condições:** A folha de pagamento do período está calculada ou em processamento.  
**Gatilho:** O sistema realiza o fechamento da folha ou o gestor solicita a apuração fiscal.  

**Fluxo principal:**
1. O gestor acessa o painel fiscal e clica em "Apuração de Encargos".
2. O sistema faz a leitura dos proventos da folha ativa e calcula os tributos devidos pela empresa: FGTS, INSS Patronal e RAT/FAP, além das provisões de 13º salário e férias.
3. O sistema calcula também as retenções na fonte efetuadas (INSS e IRRF retidos dos colaboradores).
4. O sistema gera a guia ou relatório com os valores consolidados das obrigações da folha.
5. O gestor exporta os dados ou envia para a contabilidade.

**Fluxos alternativos:**
- *Integração com eSocial:* O sistema gera a guia de declaração de encargos no formato XML compatível com as obrigações acessórias federais.

**Fluxos de exceção:**
- *Tabela desatualizada:* Se a tabela de alíquotas do INSS/IRRF do ano corrente não estiver cadastrada no sistema, o cálculo é suspenso com um alerta solicitando atualização cadastral de parâmetros pelo administrador.

**Pós-condições:** As provisões e encargos trabalhistas são consolidados e registrados na tabela fiscal do banco.

**Critérios de aceite:**
- [ ] Os cálculos devem seguir estritamente as regras de dedução progressiva e limites de teto de contribuição vigentes.
- [ ] A apuração de encargos de folha padrão deve rodar em menos de 2 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Gerenciar referências bibliográficas

**ID:** UC-313  
**Requisito relacionado:** RF-312 (gerenciar referências bibliográficas)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** O usuário está no módulo de pesquisa científica/acadêmica do projeto.  
**Gatilho:** O usuário clica em "Adicionar Referência Bibliográfica" no painel da biblioteca.  

**Fluxo principal:**
1. O usuário acessa o módulo de "Referências e Citações".
2. O usuário clica em "Nova Referência".
3. O sistema abre o formulário solicitando: Tipo de Obra (livro, artigo, etc.), Título, Autores, Editora/Revista, Ano de Publicação, Volume, Páginas e URL/DOI.
4. O usuário preenche as informações e clica em "Salvar".
5. O sistema valida os campos obrigatórios e insere o registro na tabela de referências.
6. A referência passa a constar na lista da biblioteca de pesquisa do projeto.

**Fluxos alternativos:**
- *Importar via DOI/ISBN:* O usuário insere apenas o código DOI no campo de busca rápida. O sistema realiza busca em bancos de metadados acadêmicos externos e preenche todos os campos do formulário automaticamente.

**Fluxos de exceção:**
- *Falha de conexão:* Se a busca automática pelo DOI falhar por instabilidade de rede externa, o sistema exibe o alerta "Não foi possível carregar os dados. Preencha os campos manualmente" e reabre o formulário.

**Pós-condições:** A referência bibliográfica é registrada e catalogada na base de dados do projeto.

**Critérios de aceite:**
- [ ] O parser deve aceitar a importação em lote de arquivos de exportação bibliográfica comuns (formatos BibTeX, RIS).
- [ ] A gravação da nova referência no banco deve durar menos de 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Anotar PDFs de artigos científicos

**ID:** UC-314  
**Requisito relacionado:** RF-313 (anotar PDFs de artigos científicos)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** O artigo científico em PDF está anexado a uma referência bibliográfica.  
**Gatilho:** O usuário abre o leitor de PDF interno e clica no modo "Anotações".  

**Fluxo principal:**
1. O usuário abre a referência do artigo e clica em "Visualizar Documento (PDF)".
2. O sistema renderiza o PDF na tela do navegador por meio de um visualizador interno seguro.
3. O usuário seleciona um trecho do texto do PDF com o mouse.
4. O sistema abre uma barra de ferramentas rápida contendo opções de destacar com cor, adicionar nota adesiva ou copiar citação.
5. O usuário seleciona "Adicionar Nota Adesiva" e digita o comentário.
6. O sistema insere o marcador visual de nota sobre a coordenada do PDF e grava o texto e a posição da anotação na base de dados.

**Fluxos alternativos:**
- *Listagem de Anotações:* O usuário abre a aba "Lista de Anotações" no painel lateral do leitor, visualizando todos os destaques organizados por número de página e ordem de inserção.

**Fluxos de exceção:**
- *PDF sem OCR:* Se o arquivo PDF for uma imagem digitalizada sem camada de texto pesquisável, o sistema desabilita a seleção direta de texto, permitindo apenas anotações em coordenadas livres na página.

**Pós-condições:** As anotações e realces do PDF são armazenados e indexados de forma coordenada ao arquivo.

**Critérios de aceite:**
- [ ] A renderização e as anotações do PDF devem se adaptar à escala de zoom (responsivo).
- [ ] A gravação de cada anotação deve durar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Extrair citações automaticamente de PDFs

**ID:** UC-315  
**Requisito relacionado:** RF-314 (extrair citações automaticamente de PDFs)  
**Ator(es):** Usuário (Pesquisador), Sistema, IA  
**Pré-condições:** O arquivo PDF possui camada de texto ativa e está carregado no sistema.  
**Gatilho:** O usuário clica em "Extrair Citações por IA" no leitor de PDF.  

**Fluxo principal:**
1. O usuário abre a página da referência bibliográfica correspondente.
2. O usuário clica no botão "Extrair Citações Relevantes".
3. O backend analisa o texto do PDF buscando sentenças marcadas entre aspas ou blocos de recuo de citação importantes.
4. A IA gera uma listagem contendo os trechos textuais exatos localizados e a respectiva página.
5. O usuário revisa as citações sugeridas e marca as caixas de seleção correspondentes.
6. O usuário clica em "Adicionar ao Caderno de Notas".
7. O sistema grava as citações selecionadas na tabela de notas acadêmicas, vinculando-as diretamente à referência de origem.

**Fluxos alternativos:**
- *Extração manual rápida:* O usuário seleciona o texto no PDF, clica em "Copiar como Citação" e o sistema insere o trecho no painel lateral de anotações automaticamente.

**Fluxos de exceção:**
- *PDF protegido:* Se o arquivo PDF possuir criptografia de segurança que impeça a leitura de caracteres (copy-protection), o sistema cancela o processo e avisa: "Não é possível extrair textos deste PDF devido às restrições de segurança".

**Pós-condições:** As citações de texto extraídas são salvas e catalogadas vinculadas à respectiva fonte acadêmica.

**Critérios de aceite:**
- [ ] Cada citação extraída deve conter a informação exata da página em que foi encontrada.
- [ ] O tempo total de processamento e extração de citações de um PDF padrão de 15 páginas deve ser inferior a 6 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Gerar bibliografia em formatos (ABNT, APA, etc.)

**ID:** UC-316  
**Requisito relacionado:** RF-315 (gerar bibliografia em formatos (ABNT, APA, etc.))  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** Existem referências bibliográficas cadastradas na biblioteca do projeto.  
**Gatilho:** O usuário clica em "Gerar Lista de Referências / Bibliografia" no painel de exportação.  

**Fluxo principal:**
1. O usuário acessa a biblioteca do projeto e seleciona as referências que utilizou no seu texto.
2. O usuário clica no botão "Gerar Bibliografia".
3. O sistema abre o seletor de estilos acadêmicos (ABNT, APA, MLA, Vancouver).
4. O usuário seleciona o estilo desejado (ex: "ABNT NBR 6023").
5. O sistema busca as informações cadastrais das referências no banco e executa o processador de estilo de citação.
6. A interface renderiza a lista de referências formatada na tela em ordem alfabética de acordo com o padrão selecionado.
7. O usuário copia o bloco de texto formatado ou exporta em arquivo RTF/TXT.

**Fluxos alternativos:**
- *Citação rápida inline:* Ao escrever no editor de textos, o usuário digita `/citar` e seleciona uma referência. O sistema insere a citação rápida correspondente no formato correto inline (ex: `(SILVA, 2026, p. 12)`).

**Fluxos de exceção:**
- *Dados incompletos:* Se campos obrigatórios exigidos pelo padrão estiverem vazios, o sistema destaca a linha do item com um alerta sutil sobre a pendência cadastral.

**Pós-condições:** A lista de bibliografia formatada sob o padrão selecionado é disponibilizada para visualização e cópia.

**Critérios de aceite:**
- [ ] O gerador deve seguir com precisão as normas de pontuação, itálicos, negritos e ordenação exigidos por cada padrão selecionado.
- [ ] A geração da bibliografia de 50 itens deve demorar menos de 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Vincular notas de pesquisa a fontes

**ID:** UC-317  
**Requisito relacionado:** RF-316 (vincular notas de pesquisa a fontes)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** Notas de pesquisa (anotações livres/rascunhos) e referências bibliográficas cadastradas.  
**Gatilho:** O usuário edita uma nota de pesquisa acadêmica.  

**Fluxo principal:**
1. O usuário abre uma nota contendo anotações ou insights livres.
2. O usuário clica no botão "Vincular a Referência Científica".
3. O sistema abre um autocomplete listando as referências da biblioteca do projeto.
4. O usuário seleciona a referência correspondente e confirma.
5. O sistema grava o relacionamento na base de dados.
6. A nota passa a exibir no cabeçalho o card clicável da referência científica selecionada como sua base teórica.

**Fluxos alternativos:**
- *Nota a partir da fonte:* O usuário abre a página da referência do artigo e clica em "Criar Nota de Estudo Vinculada", inicializando um documento em branco já indexado àquela fonte de dados.

**Fluxos de exceção:**
- *Fonte excluída:* Se a referência de origem for excluída do projeto, a nota de estudo correspondente permanece intacta no caderno do usuário, mas a indicação de fonte vinculada é desfeita.

**Pós-condições:** O link lógico entre a nota de rascunho de pesquisa e a referência acadêmica correspondente é salvo.

**Critérios de aceite:**
- [ ] A interface da nota de pesquisa deve exibir o status clicável e metadados rápidos da fonte ao passar o mouse.
- [ ] A gravação do vínculo deve durar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Rastrear hipóteses e experimentos

**ID:** UC-318  
**Requisito relacionado:** RF-317 (rastrear hipóteses e experimentos)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** Módulo de pesquisa ativa estruturado no projeto.  
**Gatilho:** O usuário clica em "Nova Hipótese" ou "Novo Experimento".  

**Fluxo principal:**
1. O usuário abre o painel do laboratório do projeto acadêmico e clica em "Adicionar Hipótese".
2. O sistema abre um formulário solicitando: Enunciado da Hipótese, Variáveis Analisadas e Metodologia.
3. O usuário preenche e salva a hipótese.
4. O usuário acessa a aba "Experimentos Realizados" e clica em "Registrar Experimento" para aquela hipótese.
5. O usuário insere os dados de execução, data, parâmetros medidos e define o resultado (Confirmado, Refutado, Inconclusivo).
6. O sistema grava a relação na base de dados.
7. O painel passa a exibir um gráfico de progresso mostrando a taxa de confirmação das hipóteses do projeto.

**Fluxos alternativos:**
- *Vincular a notas de estudo:* O usuário associa notas de campo contendo diários de laboratório como evidências físicas daquele experimento.

**Fluxos de exceção:**
- *Tentativa de exclusão:* Se o usuário tentar apagar uma hipótese que já possui experimentos registrados, o sistema bloqueia e orienta a arquivar a hipótese em vez de excluí-la para manter o histórico de integridade científica.

**Pós-condições:** O histórico estruturado de hipóteses científicas e seus respectivos testes empíricos é gravado na base de dados.

**Critérios de aceite:**
- [ ] A interface do laboratório deve apresentar um status visível diferenciando hipóteses ativas, confirmadas e refutadas.
- [ ] O processamento estatístico dos experimentos de pesquisa deve rodar em menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Versionar datasets de pesquisa

**ID:** UC-319  
**Requisito relacionado:** RF-318 (versionar datasets de pesquisa)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** O usuário possui arquivos estruturados de dados (CSV, JSON, XLSX) associados ao projeto.  
**Gatilho:** O usuário faz upload de uma nova versão de um arquivo de dados tabulares.  

**Fluxo principal:**
1. O usuário acessa a aba "Datasets / Dados do Projeto".
2. O usuário localiza o arquivo correspondente e clica em "Atualizar Dataset".
3. O sistema abre o campo de upload e solicita um resumo descritivo das alterações feitas.
4. O usuário seleciona o novo arquivo local, escreve o comentário de alteração e confirma.
5. O backend recebe o arquivo, gera o identificador de versão correspondente, calcula um hash de integridade (SHA-256) e salva o arquivo de forma paralela no diretório de versionamento.
6. A interface passa a listar a nova versão na lista disponível, mantendo opções de comparação e download.

**Fluxos alternativos:**
- *Reverter versão:* O usuário clica em "Restaurar Versão Anterior" e o sistema promove aquela versão para ser o conjunto de dados ativo utilizado pelo motor de estatísticas do projeto.

**Fluxos de exceção:**
- *Estouro de armazenamento:* Se o arquivo for excessivamente grande e exceder o espaço disponível da conta, o sistema bloqueia a importação e exibe: "Erro: Limite de armazenamento de datasets atingido".

**Pós-condições:** A nova versão do conjunto de dados é armazenada de forma segura na nuvem, mantendo o histórico de versões anteriores acessível.

**Critérios de aceite:**
- [ ] O sistema deve validar a estrutura de colunas do novo arquivo em relação à versão anterior (alertando caso haja colunas deletadas).
- [ ] O tempo de hashing de integridade de arquivos de até 50MB deve ser inferior a 1,5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Colaborar em revisão de literatura

**ID:** UC-320  
**Requisito relacionado:** RF-319 (colaborar em revisão de literatura)  
**Ator(es):** Usuário A (Pesquisador), Usuário B (Coautor), Sistema  
**Pré-condições:** O projeto de pesquisa é compartilhado e ambos possuem permissão de coautoria ativa.  
**Gatilho:** O Usuário A insere um comentário em uma referência bibliográfica ou nota de revisão.  

**Fluxo principal:**
1. O Usuário A acessa o painel de "Revisão da Literatura" do projeto compartilhado.
2. O Usuário A seleciona a referência acadêmica desejada e clica em "Discussão / Revisão".
3. O Usuário A digita sua observação/análise e confirma.
4. O sistema insere a nota no mural da referência e envia uma notificação instantânea para o Usuário B.
5. O Usuário B abre a mesma referência, visualiza o comentário de A e responde na thread correspondente.
6. O sistema atualiza o feed de debate da revisão bibliográfica em tempo real para os coautores.

**Fluxos alternativos:**
- *Classificar relevância das obras:* Os coautores votam em uma escala de relevância para organizar a bibliografia de forma coletiva.

**Fluxos de exceção:**
- *Votos conflitantes:* Se os coautores marcarem classificações opostas sobre a relevância da mesma obra, o sistema exibe a marca de divergência de classificação na biblioteca até que haja resolução manual.

**Pós-condições:** O feed colaborativo de revisão de literatura é atualizado e persistido na base de dados do projeto.

**Critérios de aceite:**
- [ ] O feed de discussão deve suportar ordenação por data ou por relevância de comentários.
- [ ] O tempo total de entrega da mensagem no feed dos colaboradores deve ser de no máximo 300ms.

---

## Tabela Resumo: Lote 32 (UC-311 a UC-320)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-311** | RF-310 (gerenciar contratos de trabalho) | Alta | Média |
| **UC-312** | RF-311 (calcular impostos e encargos) | Alta | Alta |
| **UC-313** | RF-312 (gerenciar referências bibliográficas) | Alta | Média |
| **UC-314** | RF-313 (anotar PDFs de artigos científicos) | Média | Alta |
| **UC-315** | RF-314 (extrair citações automaticamente de PDFs) | Média | Alta |
| **UC-316** | RF-315 (gerar bibliografia nos formatos...) | Alta | Média |
| **UC-317** | RF-316 (vincular notas de pesquisa a fontes) | Média | Baixa |
| **UC-318** | RF-317 (rastrear hipóteses e experimentos) | Média | Média |
| **UC-319** | RF-318 (versionar datasets de pesquisa) | Média | Alta |
| **UC-320** | RF-319 (colaborar em revisão de literatura) | Média | Média |
