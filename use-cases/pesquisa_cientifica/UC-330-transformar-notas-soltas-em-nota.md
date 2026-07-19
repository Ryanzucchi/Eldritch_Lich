### Caso de Uso: Transformar notas soltas em nota permanente

**ID:** UC-330  
**Requisito relacionado:** RF-329 (transformar notas soltas em nota permanente)  
**Ator(es):** Usuário (Pesquisador/Escritor), Sistema  
**Pré-condições:** Notas soltas (anotações rápidas/capturas de clipper) presentes no Inbox do projeto.  
**Gatilho:** O usuário clica em "Converter em Nota Permanente" na visualização do rascunho.  

**Fluxo principal:**
1. O usuário acessa a pasta "Inbox / Rascunhos rápidos" do seu projeto.
2. O usuário abre a nota temporária de rascunho correspondente.
3. O usuário clica no botão "Transformar em Nota Permanente".
4. O sistema abre a janela de edição para a reescrita do conteúdo sob a perspectiva de nota de estudo madura.
5. O usuário edita a redação, vincula a uma categoria do projeto e cria links bidirecionais.
6. O usuário clica em "Salvar".
7. O sistema move o arquivo da pasta temporária para o diretório de notas permanente e altera seu status de controle no banco.

**Fluxos alternativos:**
- *Fusão de rascunhos:* O usuário seleciona múltiplos rascunhos rápidos no Inbox e clica em "Fundir em Nota Permanente", concatenando seus conteúdos em um novo arquivo unificado.

**Fluxos de exceção:**
- *Título obrigatório:* O sistema impede o salvamento caso o usuário não preencha um título novo para a nota permanente.

**Pós-condições:** O status de controle do documento é alterado para permanente e a nota é arquivada na árvore de diretórios oficial.

**Critérios de aceite:**
- [ ] A nota permanente resultante deve herdar as tags e backlinks dos rascunhos rápidos de origem.
- [ ] A conversão e movimentação de pastas na base de dados devem durar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
