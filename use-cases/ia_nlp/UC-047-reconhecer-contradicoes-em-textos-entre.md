### Caso de Uso: Reconhecer contradições em textos entre pastas

**ID:** UC-047  
**Requisito relacionado:** RF-47 (reconhecer contradições em textos entre pastas)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Múltiplos textos estão distribuídos em diferentes pastas no projeto (ex: Pasta de "Rascunhos" e Pasta de "Lore Oficial").  
**Gatilho:** O usuário solicita uma varredura geral de contradições cruzadas no painel do projeto.  

**Fluxo principal:**
1. O usuário clica em "Análise de Consistência do Projeto" no painel principal.
2. O sistema envia os textos de diferentes pastas para o pipeline de análise lógica de IA.
3. A IA confronta as informações dos textos presentes em uma pasta com os textos de outra pasta buscando discrepâncias de fatos ou regras.
4. O sistema gera um relatório de inconsistências cruzadas na tela.
5. O usuário clica sobre um item do relatório e visualiza os dois trechos de arquivos diferentes que estão em contradição lado a lado.

**Fluxos alternativos:**
- *Filtro de escopo:* O usuário seleciona apenas duas pastas específicas para comparar, limitando a varredura para economizar processamento.

**Fluxos de exceção:**
- *Estouro de contexto de token:* Se o volume total dos textos das pastas selecionadas exceder o limite de contexto da IA, o sistema realiza a verificação por blocos incrementais e avisa que o processamento pode demorar mais.

**Pós-condições:** As inconsistências factuais entre documentos de diferentes pastas são listadas em um relatório centralizado.

**Critérios de aceite:**
- [ ] O relatório deve conter links clicáveis direcionando para os arquivos exatos e linhas onde as contradições se originam.
- [ ] A execução da varredura geral do projeto não deve travar a navegação pela interface web.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
