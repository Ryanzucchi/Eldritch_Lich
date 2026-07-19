### Caso de Uso: Mostrar inconsistências antes de salvar

**ID:** UC-073  
**Requisito relacionado:** RF-73 (mostrar inconsistências antes de salvar)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** O usuário está editando um texto e modificou partes dele que afetam a consistência geral.  
**Gatilho:** O usuário clica no botão "Salvar" ou aciona o salvamento manual.  

**Fluxo principal:**
1. O usuário clica em "Salvar".
2. O sistema intercepta o salvamento e dispara uma análise lógica rápida via IA (checagem de contradições físicas, de cronologia e de entidades).
3. O sistema detecta uma inconsistência crítica (ex: personagem que morreu no Capítulo 2 reaparece agindo no Capítulo 3).
4. O sistema interrompe o salvamento imediato e exibe um painel de alerta: "Detectamos inconsistências antes de salvar. Deseja revisar ou salvar assim mesmo?".
5. A tela exibe a lista das inconsistências com as descrições.
6. O usuário clica em "Salvar assim mesmo" ou em "Revisar".

**Fluxos alternativos:**
- *Salvamento silencioso:* Se o usuário ativar a configuração "Salvar sem validação de consistência", o salvamento ocorre de imediato sem interceptação ou aviso.

**Fluxos de exceção:**
- *Erro no validador:* Se o validador de consistência falhar ou estourar o timeout (ex: 2 segundos), o sistema realiza o salvamento dos dados de forma limpa para garantir que o usuário não perca seu trabalho.

**Pós-condições:** O usuário tem a oportunidade de remediar furos de roteiro e inconsistências antes de consolidar a versão do documento.

**Critérios de aceite:**
- [ ] A interceptação e a checagem rápida no backend devem ser processadas em no máximo 1,5 segundos.
- [ ] O painel de inconsistências deve fornecer a opção "Não perguntar novamente para este documento nesta sessão".

**Prioridade:** Alta  
**Complexidade estimada:** Alta
