### Caso de Uso: Verificar consistência de idade/data de nascimento de personagens

**ID:** UC-151  
**Requisito relacionado:** RF-151 (verificar consistência de idade/data de nascimento de personagens)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O personagem possui a data de nascimento preenchida na ficha de entidade e os textos relatam a idade do personagem ou o ano da cena.  
**Gatilho:** Análise lógica em background após o salvamento automático do texto.  

**Fluxo principal:**
1. A IA mapeia no texto menções à idade do personagem (ex: "Arthur tinha dezoito anos") ou a data da cena ativa (ex: "No ano de 1020").
2. O sistema lê na ficha de Arthur a data de nascimento (ex: nascido em 1005).
3. O sistema calcula a idade esperada do personagem na cena (1020 - 1005 = 15 anos).
4. O sistema confronta as informações e detecta a inconsistência (15 anos esperados vs 18 anos relatados).
5. O sistema destaca a informação no editor de texto com um sublinhado ondulado laranja.
6. O usuário clica sobre o trecho para ver a explicação.

**Fluxos alternativos:**
- *Data de nascimento vazia:* Se a data de nascimento estiver em branco, mas a IA identificar menções conflitantes de idade no texto em diferentes capítulos, ela aponta a inconsistência relativa.

**Fluxos de exceção:**
- *Viagem no tempo:* Se a obra envolver viagens temporais intencionais no enredo, o usuário pode marcar "Ignorar inconsistência temporal para este capítulo".

**Pós-condições:** Alertas de inconsistência de idades e datas são apresentados no editor de texto.

**Critérios de aceite:**
- [ ] A IA de consistência deve calcular idades e anos fictícios baseados em calendários customizados salvos no projeto.
- [ ] O processamento deve ter acurácia superior a 90% em casos explícitos de cálculo numérico direto.

**Prioridade:** Média  
**Complexidade estimada:** Alta
