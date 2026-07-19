### Caso de Uso: Reconhecer temas

**ID:** UC-031  
**Requisito relacionado:** RF-31 (reconhecer temas)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto do documento possui conteúdo suficiente (mínimo de 200 palavras) e a análise de IA está habilitada.  
**Gatilho:** O usuário clica em "Análise de Temas" ou o sistema executa a análise em background após o salvamento automático.  

**Fluxo principal:**
1. O sistema envia o texto do documento para o pipeline de análise temática por IA.
2. A IA processa o texto para extrair conceitos semânticos abstratos e recorrências de motivos narrativos (ex: "vingança", "redenção").
3. O sistema calcula a relevância e proporção de cada tema no texto.
4. O sistema exibe um relatório com os temas dominantes do documento no painel de análise lateral (ex: "Vingança (45%)", "Superação (30%)").
5. O usuário confirma ou ajusta manualmente a relevância dos temas atribuídos.

**Fluxos alternativos:**
- *Filtro de busca temática:* O usuário clica em um tema na lista do painel lateral e o sistema filtra outros textos do projeto que possuem temas semelhantes.

**Fluxos de exceção:**
- *Texto muito curto:* Se o documento possuir menos de 200 palavras, a análise temática é omitida e a interface exibe "Insira mais texto para realizar a análise de temas".

**Pós-condições:** Os temas reconhecidos são associados aos metadados do texto no banco de dados.

**Critérios de aceite:**
- [ ] A análise temática deve usar modelos de processamento semântico capazes de extrair conceitos que não aparecem literalmente no texto.
- [ ] O processamento e retorno da lista de temas de um capítulo de até 5.000 palavras devem demorar menos de 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
