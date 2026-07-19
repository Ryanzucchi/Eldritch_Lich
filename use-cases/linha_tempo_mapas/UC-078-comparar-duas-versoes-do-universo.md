### Caso de Uso: Comparar duas versões do universo

**ID:** UC-078  
**Requisito relacionado:** RF-78 (comparar duas versões do universo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui pelo menos dois universos cadastrados (ex: "Universo Cânone" e "Universo Alternativo B").  
**Gatilho:** O usuário clica em "Comparar Universos" na barra de ferramentas.  

**Fluxo principal:**
1. O usuário acessa a tela de comparação de universos.
2. O usuário escolhe Universo Origem (ex: "Cânone") e Universo Alvo (ex: "Universo B").
3. O sistema varre os bancos de dados de ambos os namespaces comparando fichas, conexões e eventos cronológicos.
4. A interface exibe uma visualização em duas colunas (*Side-by-Side Diff*) destacando as diferenças com cores: adições (verde), remoções (vermelho) e modificações (amarelo).
5. O usuário navega pela lista de diferenças categorizada (Personagens, Locais, Cronologia).

**Fluxos alternativos:**
- *Mesclar modificação:* O usuário clica em "Mesclar para o Cânone" em uma alteração específica visualizada na coluna do Universo B, trazendo a mudança para a base principal.

**Fluxos de exceção:**
- *Erro de sincronização:* Se um dos universos estiver em processo de atualização pendente, o sistema impede a comparação até que a sincronização termine.

**Pós-condições:** O relatório comparativo das diferenças estruturais entre as duas versões do universo é apresentado na tela.

**Critérios de aceite:**
- [ ] A visualização comparativa deve usar cores e marcações visuais claras de adição, remoção e edição.
- [ ] O relatório deve permitir a busca rápida de termos dentro da tela de comparação.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta
