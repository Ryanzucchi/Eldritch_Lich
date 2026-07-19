### Caso de Uso: Compartilhar textos

**ID:** UC-082  
**Requisito relacionado:** RF-82 (compartilhar textos)  
**Ator(es):** Usuário (Escritor/Dono do texto), Sistema  
**Pré-condições:** O texto específico existe e está aberto.  
**Gatilho:** O usuário abre o menu de contexto do texto e seleciona "Compartilhar Documento".  

**Fluxo principal:**
1. O usuário abre o menu de compartilhamento do documento.
2. O usuário escolhe se deseja compartilhar de forma privada ou gerar um link de leitura exclusivo para aquele arquivo específico.
3. O usuário seleciona "Gerar Link de Leitura".
4. O sistema gera um hash criptográfico seguro e anexa à URL do texto.
5. O usuário copia a URL para enviar.

**Fluxos alternativos:**
- *Revogar compartilhamento:* O usuário clica em "Desativar Link de Leitura", invalidando o hash anterior e tornando o texto privado novamente.

**Fluxos de exceção:**
- *Tentativa de edição por link de leitura:* Se um visitante tentar alterar o texto por meio do link de leitura público, o sistema bloqueia qualquer entrada de teclado e exibe "Modo de visualização. Edição bloqueada".

**Pós-condições:** O texto fica acessível de forma isolada por terceiros autorizados através de link específico.

**Critérios de aceite:**
- [ ] A geração de link de texto não deve expor metadados confidenciais do projeto.
- [ ] O sistema deve carregar a página de visualização do texto compartilhado em menos de 1,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média
