### Caso de Uso: Baixar todos os dados do usuário (portabilidade)

**ID:** UC-238  
**Requisito relacionado:** RF-238 (baixar todos os dados do usuário)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado e possui projetos cadastrados em sua conta.  
**Gatilho:** O usuário clica em "Baixar Meus Dados (Portabilidade)" nas opções de privacidade da conta.  

**Fluxo principal:**
1. O usuário acessa a página de privacidade do perfil.
2. O usuário clica no botão "Solicitar Cópia dos Meus Dados (Portabilidade de Dados)".
3. O sistema abre uma caixa de diálogo informando que preparará um pacote contendo todos os dados cadastrais, logs de segurança, e a totalidade dos projetos cadastrados.
4. O usuário clica em "Iniciar Preparação".
5. O backend dispara em background uma tarefa assíncrona que extrai todas as tabelas do usuário e formata em coleções de arquivos estruturados JSON, agrupados com as pastas e mídias físicas em um arquivo compactado `.zip`.
6. O sistema salva o arquivo compactado no servidor e envia um e-mail para o usuário contendo o link de download seguro.
7. O usuário abre o e-mail, clica no link e realiza o download do arquivo ZIP.

**Fluxos alternativos:**
- *Download direto:* Se o volume de dados da conta for pequeno (< 20MB), o sistema gera o ZIP em tempo real e inicia o download direto no navegador em poucos segundos.

**Fluxos de exceção:**
- *Link de download expirado:* Por segurança, o link enviado por e-mail expira após 48 horas. Se o usuário clicar após o prazo, o sistema o orienta a fazer uma nova solicitação.

**Pós-condições:** O arquivo estruturado contendo todos os dados da conta do usuário é exportado e baixado.

**Critérios de aceite:**
- [ ] Os dados devem ser exportados em formatos padrão abertos (como JSON e Markdown) para garantir portabilidade efetiva de acordo com a LGPD.
- [ ] O token de download seguro deve possuir expiração e ser de uso único.

**Prioridade:** Alta  
**Complexidade estimada:** Média
