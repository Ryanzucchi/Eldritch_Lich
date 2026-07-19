### Caso de Uso: Gerar resumo automático de reunião

**ID:** UC-345  
**Requisito relacionado:** RF-344 (gerar resumo automático de reunião)  
**Ator(es):** Sistema, IA, Usuário (Organizador)  
**Pré-condições:** A ata de reunião possui texto cadastrado ou áudio transcrito.  
**Gatilho:** O organizador clica em "Gerar Resumo por IA" na tela de fechamento de ata.  

**Fluxo principal:**
1. O organizador acessa a ata de reunião concluída.
2. O organizador clica em "Gerar Resumo por IA".
3. O backend envia o texto da ata e da pauta para a inteligência artificial da plataforma.
4. A IA processa o texto estruturando-o em tópicos: Resumo Executivo, Decisões Tomadas e Próximos Passos.
5. O sistema apresenta a proposta de resumo na tela para validação do organizador.
6. O organizador clica em "Aprovar e Publicar".
7. O sistema salva o resumo e envia o informativo por e-mail para todos os membros convidados e gestores de departamento.

**Fluxos alternativos:**
- *Disparo automático:* O sistema gera e envia o resumo por IA automaticamente 1 hora após o encerramento da chamada online, dispensando intervenção humana do organizador.

**Fluxos de exceção:**
- *Dados insuficientes:* Se a ata possuir menos de 10 palavras digitadas, o sistema suspende a análise por IA e exibe o alerta: "Dados insuficientes para gerar resumo automático. Digite detalhes da reunião na ata".

**Pós-condições:** O resumo gerado pela IA é anexado à ata de reunião e enviado por e-mail.

**Critérios de aceite:**
- [ ] O resumo de IA deve conter no máximo 300 palavras para garantir legibilidade executiva rápida.
- [ ] O processamento e retorno da IA de resumo devem demorar menos de 4 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média
