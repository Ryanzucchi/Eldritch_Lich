### Caso de Uso: Registrar ata de reunião

**ID:** UC-341  
**Requisito relacionado:** RF-340 (registrar ata de reunião)  
**Ator(es):** Secretário/Organizador, Sistema  
**Pré-condições:** Reunião agendada e pauta ativa cadastrada.  
**Gatilho:** O organizador clica em "Iniciar Gravação da Ata" durante ou após a reunião.  

**Fluxo principal:**
1. O organizador acessa a reunião correspondente na aba de reuniões de equipe.
2. O organizador clica em "Registrar Ata".
3. O sistema abre o editor de ata contendo a pauta original na lateral para referência rápida.
4. O organizador redige as decisões tomadas, tópicos discutidos e notas gerais da reunião.
5. O organizador clica em "Salvar Ata".
6. O sistema grava a ata na tabela correspondente do banco de dados, enviando e-mail de fechamento da ata para todos os convidados.

**Fluxos alternativos:**
- *Transcrição automática de áudio:* O organizador carrega um arquivo de áudio da reunião em formato MP3. O sistema roda transcrição por IA (Speech-to-text), gerando um rascunho de texto completo para revisão rápida do organizador.

**Fluxos de exceção:**
- *Edição concorrente:* Se dois organizadores tentarem digitar na ata simultaneamente, o sistema ativa o modo de edição colaborativa em tempo real com cursores ativos para evitar sobrescritas.

**Pós-condições:** O documento de ata de reunião é gravado de forma definitiva e associado à pauta correspondente.

**Critérios de aceite:**
- [ ] A ata de reunião deve suportar vinculação de referências de documentos e códigos de tarefas citadas.
- [ ] O envio do e-mail de fechamento deve ocorrer de forma automática em menos de 1 minuto após o salvamento.

**Prioridade:** Alta  
**Complexidade estimada:** Média
