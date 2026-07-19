### Caso de Uso: Alternar idioma do sistema

**ID:** UC-240  
**Requisito relacionado:** RF-240 (alternar idioma do sistema)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Suporte a múltiplos idiomas ativo na aplicação.  
**Gatilho:** O usuário altera o seletor de idiomas no rodapé ou cabeçalho.  

**Fluxo principal:**
1. O usuário clica no seletor de idiomas (Dropdown) no cabeçalho ou rodapé da tela.
2. O sistema exibe os idiomas homologados: "Português (BR)", "English (US)", "Español (ES)".
3. O usuário seleciona o idioma desejado (ex: "English (US)").
4. O sistema descarrega o dicionário anterior, baixa de forma assíncrona o arquivo JSON contendo o dicionário correspondente ao novo idioma selecionado e re-renderiza todos os componentes da interface.
5. O sistema grava o idioma selecionado nas configurações de perfil de conta do usuário e localmente no localStorage.

**Fluxos alternativos:**
- *URL query parameter:* O usuário força o idioma adicionando parâmetro na URL da página (ex: `?lang=es`), fazendo com que o sistema carregue o dicionário correspondente automaticamente.

**Fluxos de exceção:**
- *Erro de rede:* Se o download do arquivo de idioma falhar, o sistema mantém o idioma atual ativo e exibe um alerta sutil: "Não foi possível carregar o idioma. Tente novamente".

**Pós-condições:** O idioma da interface é redefinido para a escolha ativa do usuário.

**Critérios de aceite:**
- [ ] A alteração de idioma deve ser instantânea e ocorrer sem a necessidade de forçar um reload completo da página no navegador (Single Page App).
- [ ] A preferência selecionada deve persistir de forma definitiva na conta do usuário em logins futuros.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
