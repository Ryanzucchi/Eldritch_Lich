### Caso de Uso: Carregar a interface principal em menos de 3 segundos (RNF)

**ID:** UC-426  
**Requisito relacionado:** RNF-High-2 (carregar a interface principal em menos de 3 segundos)  
**Ator(es):** Sistema (Frontend / CDN)  
**Pré-condições:** Arquivos estáticos da aplicação (HTML, JS, CSS) minimizados, compactados e distribuídos em CDN.  
**Gatilho:** O usuário acessa a URL da plataforma pelo navegador.  

**Fluxo principal:**
1. O usuário acessa a plataforma digitando a URL em seu navegador.
2. O navegador busca e baixa os arquivos estáticos de código no servidor de CDN mais próximo geograficamente.
3. O navegador renderiza o esqueleto básico da tela (skeleton loader) em menos de 1 segundo.
4. A aplicação inicializa os scripts essenciais e realiza as chamadas de API paralelas de dados mínimos do painel.
5. A interface completa é renderizada e torna-se totalmente interativa em menos de 3 segundos.

**Fluxos alternativos:**
- *Carregamento tardio (Lazy loading):* Se a página possuir mídias ou imagens pesadas, o sistema renderiza o layout e os textos primeiro e carrega as mídias em background à medida que o usuário rola a página.

**Fluxos de exceção:**
- *Conexão instável móvel:* Se o usuário estiver acessando via rede celular lenta, o sistema desabilita fontes externas pesadas e animações complexas para garantir o carregamento em até 3 segundos.

**Pós-condições:** A aplicação é carregada e torna-se interativa para uso.

**Critérios de aceite:**
- [ ] O tamanho do pacote (bundle) inicial de JS baixado na primeira carga não deve ultrapassar 500KB compactado.
- [ ] A nota de performance do LightHouse da aplicação em mobile e desktop deve ser superior a 90 pontos.

**Prioridade:** Alta  
**Complexidade estimada:** Média
