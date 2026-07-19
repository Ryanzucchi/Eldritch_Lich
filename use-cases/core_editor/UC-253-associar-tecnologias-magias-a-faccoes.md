### Caso de Uso: Associar tecnologias/magias a facções (desenvolvimento)

**ID:** UC-253  
**Requisito relacionado:** RF-253 (associar tecnologias/magias a facções)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Facções (organizações) e nós de tecnologias/magias estão cadastrados no projeto.  
**Gatilho:** O usuário edita os parâmetros de desenvolvimento tecnológico na ficha de uma facção.  

**Fluxo principal:**
1. O usuário abre a ficha da facção correspondente.
2. O usuário acessa a aba "Desenvolvimento e Arsenal".
3. O usuário clica em "Vincular Tecnologia/Conhecimento".
4. O sistema exibe os nós da árvore de tecnologias do universo.
5. O usuário seleciona a tecnologia e define o status de uso (ex: "Tecnologia Exclusiva" ou "Em Desenvolvimento").
6. O usuário clica em "Confirmar".
7. O sistema grava a associação no banco de dados.
8. A ficha técnica da facção passa a listar a tecnologia como conhecimento disponível da organização.

**Fluxos alternativos:**
- *Compartilhar tecnologia:* O usuário define que a tecnologia é compartilhada entre duas facções aliadas por meio de um tratado.

**Fluxos de exceção:**
- *Facção removida:* Se a facção for excluída, a associação é desfeita de forma segura nas tabelas do banco.

**Pós-condições:** A associação de conhecimento tecnológico da facção é salva na base de dados do projeto.

**Critérios de aceite:**
- [ ] A associação deve atualizar o relatório de arsenal e progresso da facção de imediato.
- [ ] A gravação na base deve demorar menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
