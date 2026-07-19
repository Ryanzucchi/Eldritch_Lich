### Caso de Uso: Reconhecer contradições cronológicas

**ID:** UC-048  
**Requisito relacionado:** RF-48 (reconhecer contradições cronológicas)  
**Ator(es):** Sistema, IA  
**Pré-condições:** A linha do tempo do projeto possui eventos datados e os textos relatam datas ou durações de eventos.  
**Gatilho:** O sistema analisa o texto do capítulo atual contra o banco de dados cronológico do projeto.  

**Fluxo principal:**
1. O sistema analisa o texto em busca de menções a datas, anos, idades de personagens ou durações (ex: "A guerra durou 5 anos", "Ele tinha 20 anos em 1050").
2. A IA confronta essas menções com os fatos registrados no banco de dados cronológico (ex: a "Guerra" dura de 1040 a 1042; a data de nascimento do personagem é 1035).
3. A IA identifica incoerências (ex: "Se ele nasceu em 1035, em 1050 ele teria 15 anos, não 20").
4. O sistema destaca a contradição no editor de texto com um sublinhado laranja e exibe os dados corretos no tooltip explicativo.

**Fluxos alternativos:**
- *Corrigir linha do tempo:* O usuário clica em "Atualizar Linha do Tempo com esta informação do texto", atualizando o banco de dados cronológico diretamente a partir do texto.

**Fluxos de exceção:**
- *Calendários não-padrão:* Se o universo do usuário utilizar um sistema de datação customizado não configurado, a IA de cronologia se limita a analisar intervalos relativos no texto puro.

**Pós-condições:** Inconsistências temporais e de idade são apontadas ao usuário.

**Critérios de aceite:**
- [ ] O parser cronológico deve reconhecer expressões temporais comuns em português (ex: "três dias depois", "no ano de 802").
- [ ] O sistema deve manter um mapa de idades de personagens dinâmico baseado na data de nascimento cadastrada na ficha de cada entidade.

**Prioridade:** Média  
**Complexidade estimada:** Alta
