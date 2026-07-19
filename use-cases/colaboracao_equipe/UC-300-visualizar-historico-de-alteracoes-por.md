### Caso de Uso: Visualizar histórico de alterações por coautor

**ID:** UC-300  
**Requisito relacionado:** RF-300 (visualizar histórico de alterações por coautor)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui modificações salvas por mais de um autor na tabela de histórico de versões.  
**Gatilho:** O usuário acessa o Histórico de Versões do capítulo de texto.  

**Fluxo principal:**
1. O usuário abre o capítulo de texto desejado e acessa a aba "Versões e Alterações".
2. O sistema busca no banco as alterações do arquivo e monta a lista de revisões.
3. A interface renderiza uma barra lateral contendo cartões de commits indicando: nome/foto do coautor que realizou a alteração, data/hora e volume de caracteres modificados.
4. O usuário clica sobre a revisão correspondente.
5. O sistema exibe um painel de comparação de diferenças (Diff visual), colorindo em verde os trechos inseridos e em vermelho riscado os trechos removidos pelo coautor selecionado.
6. O usuário audita as modificações específicas executadas.

**Fluxos alternativos:**
- *Reverter modificações:* O usuário clica em "Reverter para esta versão", aplicando a revisão antiga e gerando um rollback que remove as alterações subsequentes do coautor.

**Fluxos de exceção:**
- *Sem autor associado:* Se houver alterações antigas de importação de dados sem autoria mapeada, o sistema as exibe sob o rótulo "Sistema / Importação".

**Pós-condições:** O diff de alterações estruturado por autor é exibido de forma visual na tela.

**Critérios de aceite:**
- [ ] O diff visual deve ter precisão de caracteres e palavras de forma rápida e responsiva.
- [ ] O tempo total de carregamento e cálculo das diferenças da versão comparada deve ser de no máximo 2 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
