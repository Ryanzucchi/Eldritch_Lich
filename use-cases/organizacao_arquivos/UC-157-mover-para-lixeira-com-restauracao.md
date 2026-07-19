### Caso de Uso: Mover para lixeira com restauração posterior

**ID:** UC-157  
**Requisito relacionado:** RF-157 (mover para lixeira com restauração posterior)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O item (texto ou pasta) que o usuário deseja excluir existe e está ativo.  
**Gatilho:** O usuário seleciona a opção "Excluir/Mover para Lixeira" nas opções do arquivo ou pasta.  

**Fluxo principal:**
1. O usuário clica em "Excluir" no documento "Capítulo 3".
2. O usuário confirma a exclusão rápida no prompt.
3. O sistema altera o status do item para `lixeira = true` na base de dados (exclusão lógica).
4. O item é movido visualmente para a pasta virtual "Lixeira" exibida no rodapé.
5. Para restaurar, o usuário clica sobre a Lixeira na interface.
6. O sistema abre a listagem de arquivos da Lixeira.
7. O usuário clica em "Restaurar" ao lado do arquivo "Capítulo 3".
8. O sistema atualiza o atributo `lixeira = false` no banco de dados.
9. O arquivo é restaurado em sua pasta de origem original.

**Fluxos alternativos:**
- *Esvaziar lixeira:* O usuário clica em "Esvaziar Lixeira". O sistema realiza a exclusão física definitiva de todos os itens da lixeira no banco de dados.

**Fluxos de exceção:**
- *Limpeza automática:* O sistema apaga fisicamente os registros da lixeira que completaram 30 dias de exclusão de forma automática em background.

**Pós-condições:** O item é movido para a Lixeira e pode ser restaurado para sua posição anterior com sucesso.

**Critérios de aceite:**
- [ ] O processo de exclusão e restauração lógica deve manter a consistência de metadados e IDs originais do arquivo.
- [ ] A pasta Lixeira deve exibir a data de exclusão e o prazo restante para a exclusão definitiva.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
