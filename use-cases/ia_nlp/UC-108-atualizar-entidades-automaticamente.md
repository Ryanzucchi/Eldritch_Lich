### Caso de Uso: Atualizar entidades automaticamente

**ID:** UC-108  
**Requisito relacionado:** RF-108 (atualizar entidades automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto do editor relata novas informações físicas ou eventos ocorridos com entidades existentes.  
**Gatilho:** Conclusão de escrita de um texto ou salvamento manual.  

**Fluxo principal:**
1. O sistema executa uma análise semântica em background nos textos atualizados.
2. A IA identifica mudanças relatadas sobre entidades catalogadas (ex: o texto diz "Arthur perdeu sua mão esquerda").
3. A IA confronta com os dados da ficha cadastrada (onde a mão esquerda de Arthur está intacta).
4. A IA propõe a atualização automática do status da entidade (ex: adicionar "Amputação da mão esquerda" na ficha).
5. A interface exibe a sugestão de atualização na aba lateral da ficha técnica correspondente.
6. O usuário clica em "Aplicar Alteração".

**Fluxos alternativos:**
- *Auto-update silencioso:* O sistema atualiza os atributos e status diretamente na base de dados caso a permissão de atualização automática sem validação manual esteja ativa nas configurações.

**Fluxos de exceção:**
- *Rejeição manual:* O usuário rejeita a sugestão de alteração clicando em "Descartar sugestão da IA", mantendo a ficha original intacta.

**Pós-condições:** As fichas de personagens, locais e objetos são atualizadas de acordo com os eventos transcorridos no texto.

**Critérios de aceite:**
- [ ] O sistema de IA deve apresentar o trecho exato do capítulo que motivou a sugestão de atualização de metadados da entidade.
- [ ] O processamento deve rodar de forma assíncrona em background.

**Prioridade:** Média  
**Complexidade estimada:** Alta
