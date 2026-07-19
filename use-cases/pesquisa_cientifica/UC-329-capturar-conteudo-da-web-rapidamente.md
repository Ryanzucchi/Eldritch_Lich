### Caso de Uso: Capturar conteúdo da web rapidamente (web clipper)

**ID:** UC-329  
**Requisito relacionado:** RF-328 (capturar conteúdo da web rapidamente)  
**Ator(es):** Usuário (Pesquisador/Escritor), Extensão do Navegador (Web Clipper), Sistema  
**Pré-condições:** O usuário instalou a extensão oficial da plataforma e está autenticado nela.  
**Gatilho:** O usuário clica no ícone da extensão ao ler uma página externa na internet.  

**Fluxo principal:**
1. O usuário lê um artigo de internet e clica no ícone da extensão "Web Clipper".
2. A extensão abre solicitando o tipo de captura (ex: Página Completa, Texto Selecionado, Apenas Link).
3. O usuário seleciona "Texto Selecionado" (após marcar um trecho do artigo).
4. O usuário seleciona o projeto de destino e as tags correspondentes na extensão.
5. O usuário clica em "Salvar".
6. A extensão envia os dados limpos via API rest para o servidor da plataforma.
7. O sistema cria uma nota temporária no Inbox contendo o texto, a URL da fonte e os metadados.

**Fluxos alternativos:**
- *Capturar Imagem:* O usuário clica com o botão direito sobre uma imagem na web, seleciona a opção da extensão de enviar para o projeto, e a imagem é gravada diretamente na galeria de mídias correspondente.

**Fluxos de exceção:**
- *Sessão expirada na extensão:* Se a extensão não se comunicar com o servidor por falta de login válido, o popover exibe o botão de autenticação direcionando o usuário para fazer login.

**Pós-condições:** A nota contendo o recorte de conteúdo web capturado é criada no inbox do projeto.

**Critérios de aceite:**
- [ ] O parser do Web Clipper deve limpar menus e scripts externos, capturando apenas o conteúdo legível de forma estruturada.
- [ ] A requisição de envio de dados do clipper para o servidor deve demorar menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média
