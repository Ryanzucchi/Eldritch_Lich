### Caso de Uso: Seguir padrões de conformidade legal (LGPD/GDPR) para dados pessoais (RNF)

**ID:** UC-447  
**Requisito relacionado:** RNF-Medium-11 (conformidade legal LGPD/GDPR)  
**Ator(es):** Usuário, Sistema  
**Pré-condições:** Políticas de privacidade estruturadas e mecanismos de exclusão de dados ativos no banco de dados.  
**Gatilho:** O usuário solicita a exclusão definitiva de sua conta e informações pessoais.  

**Fluxo principal:**
1. O usuário acessa a seção de privacidade de seu perfil e clica em "Excluir conta e dados (LGPD)".
2. O sistema exibe um aviso informando que a ação é definitiva e solicita a confirmação inserindo a senha de login.
3. O usuário confirma.
4. O backend executa rotina de exclusão física: deleta os dados de identificação (nome, e-mail, telefone, CPF) de usuários/funcionários e apaga os arquivos e documentos de mídia do bucket.
5. O sistema anonimiza o histórico de logs de auditoria e participação de chats substituindo o nome por marcadores neutros (ex: "Usuário Deletado").
6. O sistema retorna a mensagem de exclusão concluída.

**Fluxos alternativos:**
- *Portabilidade:* O usuário seleciona "Exportar meus dados". O sistema compila as informações em formato JSON estruturado e realiza o download, cumprindo a portabilidade de dados da LGPD.

**Fluxos de exceção:**
- *Retenção obrigatória fiscal:* Se o funcionário deletado possuir histórico de transações financeiras fiscais ou folhas de pagamentos recebidas, o sistema impede a exclusão física absoluta desses registros, mantendo as informações restritas para fins de conformidade fiscal governamental obrigatória por 5 anos, anonimizando apenas o cadastro de login de usuário.

**Pós-condições:** Os dados pessoais do usuário são expurgados em definitivo do banco de dados em conformidade legal.

**Critérios de aceite:**
- [ ] Os dados expurgados devem ser impossíveis de restaurar ou reconstituir de forma reversa a partir da base principal.
- [ ] O processo de portabilidade deve gerar arquivos em formatos de dados interoperáveis (JSON ou XML).

**Prioridade:** Alta  
**Complexidade estimada:** Alta
