### Caso de Uso: Gerenciar arcos dramáticos por personagem

**ID:** UC-397  
**Requisito relacionado:** RF-396 (gerenciar arcos dramáticos por personagem)  
**Ator(es):** Usuário (Escritor/Roteirista), Sistema  
**Pré-condições:** Personagens e capítulos cadastrados no projeto.  
**Gatilho:** O usuário cria um arco dramático de desenvolvimento para um personagem.  

**Fluxo principal:**
1. O usuário acessa "Módulo de Personagens" -> "Arcos Dramáticos".
2. O usuário clica em "Criar Novo Arco".
3. O sistema abre o formulário solicitando: Nome do Arco, Personagem Associado, Tipo de Mudança (Arco Crescente, Decrescente, Estático) e descrição dos conflitos.
4. O usuário insere as informações e mapeia a evolução do estado mental e comportamental do personagem ao longo dos capítulos.
5. O usuário clica em "Salvar Arco".
6. O sistema grava o arco na tabela correspondente e atualiza a ficha técnica do personagem selecionado.

**Fluxos alternativos:**
- *Múltiplos arcos:* O escritor pode criar sub-arcos ou arcos secundários de relacionamento amoroso ou profissional para o mesmo personagem principal de forma separada.

**Fluxos de exceção:**
- *Capítulos sem cronologia:* O sistema ordena automaticamente a evolução dos estados mentais do personagem com base na ordem cronológica de escrita dos capítulos, alertando caso haja capítulos desordenados na linha temporal.

**Pós-condições:** O arco de evolução dramática do personagem é gravado no banco de dados do projeto.

**Critérios de aceite:**
- [ ] O painel do personagem deve exibir o sumário textual simplificado de seu arco dramático para consulta rápida durante a escrita no editor.
- [ ] A gravação no banco de dados deve demorar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
