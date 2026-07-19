### Caso de Uso: Criar relatórios de inconsistências de timeline (violação lógica)

**ID:** UC-296  
**Requisito relacionado:** RF-296 (criar relatórios de inconsistências de timeline)  
**Ator(es):** Sistema, Usuário (Escritor)  
**Pré-condições:** A timeline possui eventos de personagens e locais cadastrados.  
**Gatilho:** O usuário clica em "Verificar Inconsistências de Enredo" ou o sistema executa a análise em background de forma programada.  

**Fluxo principal:**
1. O usuário acessa o painel de integridade do enredo e clica em "Gerar Relatório de Inconsistências".
2. O backend aciona o motor de validação lógica que analisa regras de física temporal:
   - Personagem participando de evento antes de sua data de nascimento ou após sua data de falecimento.
   - Personagem localizado em dois eventos concomitantes em locais físicos distantes ao mesmo tempo.
   - Eventos com data de término anterior à de início.
3. O sistema monta a lista de inconsistências encontradas.
4. A interface exibe o relatório detalhado de erros lógicos na tela estruturado em tópicos.

**Fluxos alternativos:**
- *Envio periódico:* O sistema envia um resumo do relatório de integridade de enredo periodicamente para a caixa de entrada dos coautores do projeto.

**Fluxos de exceção:**
- *Falta de datas nas fichas:* Se os personagens não possuírem dados de nascimento e morte cadastrados, o sistema avisa que a verificação de idades foi ignorada por ausência de parâmetros.

**Pós-condições:** O relatório consolidado de violações de lógica temporal é renderizado na tela.

**Critérios de aceite:**
- [ ] O processamento da varredura e geração do relatório para uma timeline de 200 eventos deve durar menos de 3 segundos.
- [ ] Cada inconsistência no relatório deve conter links clicáveis para as fichas de personagens e eventos envolvidos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
