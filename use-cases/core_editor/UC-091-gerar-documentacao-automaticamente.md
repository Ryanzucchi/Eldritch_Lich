### Caso de Uso: Gerar documentação automaticamente

**ID:** UC-091  
**Requisito relacionado:** RF-91 (gerar documentação automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui dados de entidades, relacionamentos e cronologia inseridos.  
**Gatilho:** O usuário seleciona "Gerar Documentação Técnica" ou "Manual do Universo".  

**Fluxo principal:**
1. O usuário abre o painel de exportação e seleciona "Documentação do Universo".
2. O sistema extrai e estrutura todos os metadados de entidades, cronologias e grafos do projeto.
3. A IA processa e formata as informações em um documento técnico estruturado por seções (ex: "1. Glossário de Entidades", "2. Linha do Tempo Consolidada", "3. Regras e Relações do Universo").
4. O sistema gera a documentação no formato Markdown (.md) ou HTML.
5. A interface disponibiliza o arquivo gerado para visualização no editor ou download imediato.

**Fluxos alternativos:**
- *Exportação via API:* O usuário solicita a documentação em formato estruturado JSON via API pública para integração com sistemas externos.

**Fluxos de exceção:**
- *Dados insuficientes:* Se não houver entidades ou textos cadastrados no projeto, o sistema exibe "Documentação vazia. Insira entidades para gerar a documentação automática".

**Pós-condições:** A documentação estruturada do universo é gerada e salva na raiz do projeto ou baixada.

**Critérios de aceite:**
- [ ] A documentação deve organizar as entidades por categoria (Personagens, Locais, Objetos, Organizações) em ordem alfabética.
- [ ] O processamento do documento deve demorar menos de 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média
