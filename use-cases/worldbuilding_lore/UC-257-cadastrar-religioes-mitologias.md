### Caso de Uso: Cadastrar religiões/mitologias

**ID:** UC-257  
**Requisito relacionado:** RF-257 (cadastrar religiões/mitologias)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está na seção de worldbuilding do projeto.  
**Gatilho:** O usuário clica em "Nova Religião/Crença" ou "Nova Mitologia".  

**Fluxo principal:**
1. O usuário clica na opção "Criar Religião/Crença".
2. O sistema abre uma ficha técnica de cadastro solicitando: Nome da Religião, Deuses Principais, Livro Sagrado, Símbolo Sagrado e descrição de dogmas.
3. O usuário preenche as informações e faz o upload da imagem do símbolo.
4. O usuário clica em "Salvar".
5. O sistema grava o registro de crença na tabela de religiões do banco de dados.
6. A religião passa a ser exibida sob o diretório de "Religiosidade" na barra de navegação.

**Fluxos alternativos:**
- *Panteão de deuses:* O usuário vincula múltiplas entidades do tipo Personagem como deuses oficiais daquela mitologia a partir de relações na própria ficha de religião.

**Fluxos de exceção:**
- *Nome duplicado:* O sistema barra nomes iguais no mesmo projeto e solicita que o usuário altere para manter a integridade.

**Pós-condições:** A religião ou mitologia é registrada na base de dados do projeto.

**Critérios de aceite:**
- [ ] O cadastro de religiões deve suportar formatação Markdown no campo de dogmas e regras.
- [ ] A atualização do banco de dados deve ser de no máximo 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
