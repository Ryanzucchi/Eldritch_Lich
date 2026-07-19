### Caso de Uso: Acompanhar sequência de dias escrevendo (streak)

**ID:** UC-140  
**Requisito relacionado:** RF-140 (acompanhar sequência de dias escrevendo (streak))  
**Ator(es):** Sistema, Usuário (Escritor)  
**Pré-condições:** O usuário possui metas de escrita diárias ativas no projeto.  
**Gatilho:** Conclusão de uma sessão de escrita onde a cota mínima de palavras foi atingida.  

**Fluxo principal:**
1. O usuário digita no editor até que o contador atinja o limite mínimo diário configurado para streak (ex: mínimo de 200 palavras digitadas em um dia).
2. O sistema detecta a meta diária alcançada, atualiza a data da última atividade e incrementa o contador de "Streak" em 1 dia no banco de dados de progresso do usuário.
3. O cabeçalho exibe um ícone de fogo com o número de dias seguidos (ex: "🔥 5 dias").
4. Se o usuário passar um dia inteiro sem escrever o mínimo exigido, o sistema zera a sequência no próximo acesso.

**Fluxos alternativos:**
- *Protetor de streak:* O usuário configura um "dia de folga" nas opções para evitar que a sequência seja zerada em um dia específico de ausência.

**Fluxos de exceção:**
- *Alteração manual de data:* O sistema valida a timestamp no servidor utilizando a hora do servidor de banco de dados para evitar trapaças de data local.

**Pós-condições:** A sequência de dias de escrita do usuário é incrementada ou redefinida de acordo com a constância monitorada.

**Critérios de aceite:**
- [ ] O ícone visual de streak deve mudar de cor ao atingir marcos relevantes (7 dias, 30 dias, 100 dias).
- [ ] O sistema deve emitir um relatório semanal consolidado de constância por e-mail.

**Prioridade:** Média  
**Complexidade estimada:** Média
