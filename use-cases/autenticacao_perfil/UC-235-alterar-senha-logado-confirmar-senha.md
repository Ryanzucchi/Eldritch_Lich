### Caso de Uso: Alterar senha logado (confirmar senha atual)

**ID:** UC-235  
**Requisito relacionado:** RF-235 (alterar senha logado)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado na plataforma.  
**Gatilho:** O usuário acessa "Alterar Senha" nas configurações de segurança.  

**Fluxo principal:**
1. O usuário abre o formulário de alteração de senha.
2. O sistema exibe os campos: Senha Atual, Nova Senha e Confirmar Nova Senha.
3. O usuário preenche as informações e clica em "Atualizar Senha".
4. O backend realiza a validação, comparando o hash da Senha Atual fornecida com o hash registrado no banco de dados.
5. Se válidos, o sistema gera o hash da nova senha (bcrypt), grava no banco de dados e exibe mensagem de sucesso.

**Fluxos alternativos:**
- *Sem senha cadastrada (Login social):* Se o usuário se cadastrou apenas via Google e não possui senha, o sistema solicita definir uma senha primária enviando um código de ativação para o e-mail.

**Fluxos de exceção:**
- *Senha atual incorreta:* Se a senha atual fornecida não coincidir com o hash guardado, o sistema impede a gravação e informa: "Senha atual incorreta".

**Pós-condições:** A senha é redefinida e atualizada de forma criptografada na base de dados.

**Critérios de aceite:**
- [ ] O sistema deve exigir que a nova senha seja diferente da senha atual e atenda às regras mínimas de complexidade.
- [ ] O processamento e retorno da verificação de senha devem demorar menos de 1 segundo.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa
