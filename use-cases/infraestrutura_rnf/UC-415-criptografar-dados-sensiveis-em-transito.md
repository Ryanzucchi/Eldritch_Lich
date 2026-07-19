### Caso de Uso: Criptografar dados sensíveis em trânsito (HTTPS/TLS) (RNF)

**ID:** UC-415  
**Requisito relacionado:** RNF-Critical-2 (criptografar dados sensíveis em trânsito)  
**Ator(es):** Sistema, Servidor Web (Infraestrutura)  
**Pré-condições:** Servidor da aplicação com certificado digital SSL/TLS válido instalado e ativo.  
**Gatilho:** Um usuário ou API tenta realizar uma requisição HTTP ou estabelecer conexão WebSocket.  

**Fluxo principal:**
1. O usuário tenta acessar a aplicação digitando o protocolo sem segurança (ex: `http://plataforma.com`).
2. O servidor de borda intercepta a requisição HTTP porta 80 e realiza redirecionamento automático permanente (HTTP 301) para a versão segura HTTPS na porta 443.
3. O navegador e o servidor realizam o aperto de mão (TLS handshake) negociando o protocolo TLS 1.3 de criptografia de dados.
4. Todo o tráfego subsequente de dados de requisições, logins, uploads e WebSockets (WSS) passa a circular criptografado de forma asimétrica na rede.

**Fluxos alternativos:**
- *Renovação automática:* O sistema executa um script automatizado a cada 60 dias para renovar as chaves e o certificado digital SSL antes do vencimento na nuvem de produção.

**Fluxos de exceção:**
- *Protocolo antigo:* Se o cliente tentar conexão usando navegadores legados com protocolos TLS vulneráveis (ex: TLS 1.0), o servidor recusa a conexão de forma imediata por motivos de segurança da informação.

**Pós-condições:** Toda a troca de dados entre clientes e servidores da plataforma ocorre de forma criptografada em trânsito.

**Critérios de aceite:**
- [ ] 100% das páginas e requisições de API devem retornar cabeçalho de segurança HSTS configurado.
- [ ] A nota de segurança de criptografia SSL da plataforma nos testes deve ser obrigatoriamente A+.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
