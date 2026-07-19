### Caso de Uso: Cadastrar idiomas fictícios

**ID:** UC-183  
**Requisito relacionado:** RF-183 (cadastrar idiomas fictícios)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está no painel de worldbuilding do projeto.  
**Gatilho:** O usuário clica em "Novo Idioma Fictício / Conlang" no menu de ferramentas.  

**Fluxo principal:**
1. O usuário clica em "Cadastrar Idioma".
2. O sistema abre uma ficha de cadastro solicitando: Nome do Idioma, Código, Família Linguística, Descrição Geral e Regras de Pronúncia.
3. O usuário insere os dados e clica em "Criar".
4. O sistema cria o namespace linguístico e inicializa uma tabela de dicionário vazia vinculada a esse idioma.
5. O idioma passa a constar na barra lateral sob o diretório "Linguística".

**Fluxos alternativos:**
- *Importar dicionário:* O usuário importa uma planilha Excel/CSV contendo uma lista de termos e traduções para popular o dicionário de imediato.

**Fluxos de exceção:**
- *Nome duplicado:* O sistema barra a gravação de dois idiomas com a mesma nomenclatura no mesmo projeto.

**Pós-condições:** O idioma fictício é cadastrado e preparado para receber termos de dicionário.

**Critérios de aceite:**
- [ ] A criação de um idioma fictício deve gerar chaves seguras e isoladas no banco de dados.
- [ ] O cadastro deve carregar em menos de 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
