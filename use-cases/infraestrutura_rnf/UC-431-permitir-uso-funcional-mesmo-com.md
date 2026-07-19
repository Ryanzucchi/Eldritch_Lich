### Caso de Uso: Permitir uso funcional mesmo com internet instável (modo offline básico) (RNF)

**ID:** UC-431  
**Requisito relacionado:** RNF-High-7 (modo offline básico)  
**Ator(es):** Sistema, Cliente (Navegador)  
**Pré-condições:** Service Workers registrados e ativos no navegador do usuário (configuração PWA).  
**Gatilho:** A internet do usuário apresenta alta instabilidade ou cai por completo.  

**Fluxo principal:**
1. O usuário está utilizando a plataforma e a conexão com a internet é interrompida.
2. O Service Worker intercepta as requisições de assets e chamadas de API do cliente.
3. Para arquivos estáticos (HTML, JS, CSS), o Service Worker serve os recursos diretamente do cache local do navegador.
4. Para dados de leitura de fichas e capítulos do projeto, o sistema busca e apresenta as informações armazenadas no banco IndexedDB local.
5. A interface exibe as informações correspondentes ao usuário, permitindo visualizações e edições locais.

**Fluxos alternativos:**
- *Mensagem de indisponibilidade:* Se o usuário tentar acessar uma aba que não foi cacheada previamente, o sistema exibe de forma limpa a tela: "Esta página necessita de conexão com a internet para carregar".

**Fluxos de exceção:**
- *Cache excluído:* Se o sistema operacional do dispositivo do usuário deletar o cache local por falta de espaço em disco, a aplicação exibe a tela padrão de indisponibilidade offline de dados.

**Pós-condições:** A aplicação continua operando de forma básica e legível sem apresentar travamentos de tela por queda de rede.

**Critérios de aceite:**
- [ ] A aplicação deve carregar a estrutura básica do layout (App Shell) em menos de 1,5 segundos em modo 100% offline.
- [ ] A navegação offline de páginas em cache deve funcionar sem emitir erros de requisição não tratada no console do desenvolvedor.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
