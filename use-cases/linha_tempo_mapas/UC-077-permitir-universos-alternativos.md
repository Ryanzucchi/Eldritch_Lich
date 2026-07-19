### Caso de Uso: Permitir universos alternativos

**ID:** UC-077  
**Requisito relacionado:** RF-77 (permitir universos alternativos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui dados de personagens, locais, cronologia no "Universo Cânone".  
**Gatilho:** O usuário seleciona "Criar Universo Alternativo" no painel de controle do projeto.  

**Fluxo principal:**
1. O usuário abre o menu de configurações do projeto e clica em "Universos e Versões".
2. O usuário clica em "Criar Universo Alternativo".
3. O sistema solicita um nome (ex: "Universo B - O Império Venceu") e uma descrição.
4. O sistema cria um clone lógico de todo o banco de dados do projeto (entidades, cronologia, conexões) em um namespace separado, mantendo os arquivos de texto em modo sandbox.
5. A interface exibe no cabeçalho geral do sistema o dropdown de seleção do universo ativo.
6. O usuário seleciona "Universo B".
7. O sistema recarrega as fichas de entidades e o grafo refletindo os dados do Universo B.

**Fluxos alternativos:**
- *Universo alternativo vazio:* O usuário cria um universo alternativo do zero, compartilhando apenas o nome das entidades, sem clonar relacionamentos originais.

**Fluxos de exceção:**
- *Estouro de cota:* Se a clonagem do universo exceder os limites de armazenamento da conta, o sistema impede a criação e solicita que o usuário libere espaço.

**Pós-condições:** O novo namespace de universo alternativo é criado e disponibilizado para modificação sem alterar o universo cânone.

**Critérios de aceite:**
- [ ] Modificar qualquer dado sob o contexto do Universo Alternativo não deve produzir qualquer efeito colateral nos dados do Universo Cânone.
- [ ] A transição entre universos na interface do usuário deve ser concluída em menos de 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
