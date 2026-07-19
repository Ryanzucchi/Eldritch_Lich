### Caso de Uso: Padronizar nomes automaticamente

**ID:** UC-092  
**Requisito relacionado:** RF-92 (padronizar nomes automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Fichas de entidades com nomes oficiais cadastrados no projeto.  
**Gatilho:** O usuário clica em "Padronizar Nomes" no menu de ferramentas ou ativa a correção automática na escrita.  

**Fluxo principal:**
1. O sistema varre o texto aberto buscando menções a entidades com variações de grafia próximas ou apelidos não cadastrados (ex: no texto aparece "Jose" ou "Ze" e o nome oficial na ficha é "José").
2. A IA identifica as variações com base na similaridade fonética, semântica e contextual.
3. O sistema apresenta um painel contendo a lista de substituições sugeridas (ex: "Substituir 'Jose' por 'José' em 14 ocorrências", "Substituir 'Ze' por 'José' em 5 ocorrências").
4. O usuário seleciona quais substituições deseja realizar.
5. O usuário clica em "Aplicar Padronização".
6. O sistema executa um "Buscar e Substituir" global nos textos do projeto, atualizando as grafias para o padrão correto da ficha de entidade.

**Fluxos alternativos:**
- *Padronização automática na digitação:* O corretor ortográfico sugere e substitui a grafia incorreta do nome do personagem em tempo real assim que o usuário termina de digitar o termo.

**Fluxos de exceção:**
- *Ambiguidade de homônimos:* Se existirem dois personagens com grafias parecidas e a IA não puder determinar qual é o pretendido, ela exibe as opções e pede que o usuário selecione caso a caso.

**Pós-condições:** Os textos do projeto passam a usar a nomenclatura uniforme de acordo com o catálogo oficial de entidades.

**Critérios de aceite:**
- [ ] A padronização não deve alterar nomes contidos dentro de citações de hyperlinks externos ou marcas de código.
- [ ] O sistema de substituição em lote deve ser transacional.

**Prioridade:** Média  
**Complexidade estimada:** Média
