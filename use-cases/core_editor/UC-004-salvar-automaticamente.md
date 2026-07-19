### Caso de Uso: Salvar automaticamente

**ID:** UC-004  
**Requisito relacionado:** RF-4 (salvar automaticamente)  
**Ator(es):** Sistema  
**Pré-condições:** O usuário está editando um texto e o salvamento automático está ativo.  
**Gatilho:** Inatividade detectada no teclado (debounce de 2 segundos) ou intervalo fixo de 30 segundos após modificações.  

**Fluxo principal:**
1. O usuário edita o texto no editor e para de digitar.
2. O sistema detecta a inatividade de 2 segundos (debounce timer expira) e inicia o processo de auto-salvamento.
3. O sistema envia os dados alterados assincronamente à API do servidor.
4. O servidor valida, persiste as alterações e retorna a resposta de sucesso.
5. A interface atualiza discretamente a legenda no rodapé: "Salvo automaticamente às HH:MM".

**Fluxos alternativos:**
- *Conexão instável durante auto-save:* O sistema tenta enviar ao servidor. Se falhar ou demorar mais de 3segundos, redireciona o salvamento para o cache persistente (IndexedDB) e atualiza o rodapé para "Salvo localmente".

**Fluxos de exceção:**
- *Conflito de versão no servidor:* Se o servidor rejeitar a atualização porque a versão do servidor é mais nova (edição concorrente por outro usuário), o sistema suspende o auto-save automático e inicia o fluxo de resolução de conflito colaborativo.

**Pós-condições:** As alterações mais recentes no texto são persistidas de forma transparente no backend ou no armazenamento local temporário.

**Critérios de aceite:**
- [ ] O salvamento automático deve rodar de forma assíncrona, não interferindo na digitação ou na fluidez da interface.
- [ ] O debounce de digitação deve reiniciar a cada nova tecla pressionada para evitar chamadas excessivas ao servidor.
- [ ] Deve exibir um status sutil de salvamento no rodapé do editor (ex: "Salvando...", "Salvo automaticamente às Xh").

**Prioridade:** Crítica  
**Complexidade estimada:** Média
