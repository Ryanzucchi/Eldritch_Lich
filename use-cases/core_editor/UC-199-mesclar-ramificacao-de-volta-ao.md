### Caso de Uso: Mesclar ramificação de volta ao texto principal (merge)

**ID:** UC-199  
**Requisito relacionado:** RF-199 (mesclar ramificação de volta ao texto principal (merge))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um branch de testes criado contendo edições prontas que deseja aplicar na versão principal.  
**Gatilho:** O usuário clica em "Mesclar Branch" nas opções do branch aberto.  

**Fluxo principal:**
1. O usuário abre o branch de testes correspondente.
2. O usuário clica no botão "Mesclar no Texto Principal".
3. O sistema compara as modificações efetuadas no branch com o estado atual do texto principal.
4. Se não houver modificações concorrentes no texto principal desde a criação do branch, o sistema substitui o conteúdo do texto principal pelo conteúdo do branch no banco de dados.
5. O sistema marca o branch de testes como "Mesclado".
6. O texto principal é atualizado e o branch é ocultado.

**Fluxos alternativos:**
- *Mesclar mantendo o branch:* O usuário opta por manter o branch aberto na árvore mesmo após a mesclagem para continuar testes adicionais.

**Fluxos de exceção:**
- *Conflito de mesclagem:* Se o texto principal tiver sido modificado concorrentemente por outro colaborador desde a criação do branch, o sistema interrompe a mesclagem e aciona a tela de Gerenciamento de Conflitos.

**Pós-condições:** As alterações da ramificação são integradas na versão principal do arquivo.

**Critérios de aceite:**
- [ ] A mesclagem deve criar um ponto de restauração automática no histórico de versões do documento principal.
- [ ] O merge sem conflitos deve ser concluído em até 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Alta
