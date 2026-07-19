### Caso de Uso: Identificar entidades automaticamente

**ID:** UC-107  
**Requisito relacionado:** RF-107 (identificar entidades automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Um texto novo foi salvo ou colado no editor.  
**Gatilho:** Salvamento automático de um texto que possui novos parágrafos escritos.  

**Fluxo principal:**
1. O sistema dispara em background uma tarefa assíncrona de processamento de linguagem natural (NLP).
2. O pipeline de IA analisa o texto comparando substantivos próprios e padrões sintáticos com o banco de dados de entidades já existentes.
3. Se a IA identificar novos termos recorrentes com estrutura de nome de personagem, local ou organização que não estejam catalogados, ela insere as entidades na lista de "Identificadas".
4. O sistema exibe um aviso visual sutil no editor: "Detectamos novas entidades em potencial. Clique aqui para adicioná-las".

**Fluxos alternativos:**
- *Mapeamento silencioso:* O sistema cadastra as novas entidades identificadas diretamente como rascunhos no banco de dados de entidades, sob a categoria "Rascunhos de IA".

**Fluxos de exceção:**
- *Falso positivo:* O usuário clica em "Ocultar / Isso não é uma entidade" em um nome incorreto, impedindo que o termo seja identificado em análises futuras.

**Pós-condições:** Novas entidades potenciais mencionadas no texto são identificadas e preparadas para catalogação.

**Critérios de aceite:**
- [ ] O classificador de entidades (NER) deve ter precisão de pelo menos 90% para nomes próprios.
- [ ] O processamento em background deve rodar sem degradar o desempenho de digitação na thread principal da interface.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
