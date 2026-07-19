### Caso de Uso: Catalogar tropos usados por obra/universo

**ID:** UC-402  
**Requisito relacionado:** RF-397 (catalogar tropos usados por obra/universo)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** Obra escrita e estruturada no sistema.  
**Gatilho:** O usuário clica em "Catalogar Tropos" no painel analítico de worldbuilding.  

**Fluxo principal:**
1. O usuário acessa "Worldbuilding" -> "Tropos do Universo".
2. O sistema executa um parser semântico por IA sobre todos os capítulos da obra.
3. O sistema identifica e cataloga os tropos estruturais e narrativos mais comuns presentes.
4. O sistema lista os tropos em formato de biblioteca com hyperlinks para os capítulos e cenas em que ocorrem.
5. O usuário revisa o catálogo de tropos gerado e adiciona anotações manuais se desejar.

**Fluxos alternativos:**
- *Cadastro manual:* O usuário cria um tropo manualmente na lista (ex: "Profecia Auto-realizável") e vincula aos capítulos de sua escolha utilizando tags.

**Fluxos de exceção:**
- *Nenhum tropo localizado:* Se a IA não identificar tropos estruturais na obra, exibe "Nenhum clichê estrutural identificado de forma automática" e sugere cadastrar manualmente.

**Pós-condições:** A biblioteca de tropos catalogados da obra é salva no banco de dados.

**Critérios de aceite:**
- [ ] O parser de detecção de tropos deve rodar em background sem impactar o uso da interface e a digitação do escritor.
- [ ] O tempo total de indexação de tropos deve ser de no máximo 5 segundos para cada 20 páginas de texto.

**Prioridade:** Média  
**Complexidade estimada:** Média
