### Caso de Uso: Gerar wiki automaticamente

**ID:** UC-090  
**Requisito relacionado:** RF-90 (gerar wiki automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Existem entidades catalogadas e textos vinculados no projeto.  
**Gatilho:** O usuário clica em "Gerar Wiki do Projeto" no painel do universo.  

**Fluxo principal:**
1. O sistema lê o banco de dados de entidades e os textos públicos/cânones.
2. A IA consolida as informações das fichas estruturadas e converte-as em artigos formatados em linguagem wiki.
3. O sistema cria hiperlinks automáticos entre os artigos da wiki com base nas referências mútuas identificadas no grafo de entidades.
4. O sistema gera e publica o portal web da wiki localmente ou em uma URL privada temporária.
5. O usuário visualiza o portal interativo contendo barra de busca.

**Fluxos alternativos:**
- *Publicar Wiki pública:* O usuário ativa a opção "Tornar Wiki Pública" gerando um subdomínio web estático indexável.

**Fluxos de exceção:**
- *Dados sigilosos:* O sistema de compilação da wiki filtra e remove automaticamente anotações marcadas como "confidenciais" ou "ocultas".

**Pós-condições:** A wiki interativa e auto-linkada é gerada de forma automatizada.

**Critérios de aceite:**
- [ ] A wiki gerada deve manter os hyperlinks funcionais entre os tópicos cadastrados para garantir a navegabilidade de ponta a ponta.
- [ ] O layout estático gerado deve ser compatível com dispositivos móveis.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
