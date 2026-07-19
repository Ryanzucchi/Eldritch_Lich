### Caso de Uso: Associar locais a criaturas/monstros (habitat)

**ID:** UC-277  
**Requisito relacionado:** RF-277 (associar locais a criaturas/monstros)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de locais e criaturas cadastradas no projeto.  
**Gatilho:** O usuário edita as propriedades geográficas na ficha da criatura ou no mapa.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de uma criatura.
2. No painel de ecologia, o usuário clica em "Adicionar Habitat/Local".
3. O sistema abre a busca autocomplete de locais do projeto.
4. O usuário seleciona o local desejado e define o status de presença (Dropdown: Comum, Raro, Extinto).
5. O usuário clica em "Confirmar".
6. O sistema grava a relação de habitat no banco de dados.
7. A ficha da criatura passa a listar o local como habitat oficial e a ficha do local lista a espécie correspondente.

**Fluxos alternativos:**
- *Marcar no atlas:* O usuário arrasta a ficha da criatura e a solta sobre uma coordenada do mapa geográfico, marcando a posição como habitat ou local de avistamento.

**Fluxos de exceção:**
- *Local excluído:* A associação correspondente é removida automaticamente da ficha da criatura caso o local seja excluído do projeto.

**Pós-condições:** A associação de habitat da criatura é salva no banco de dados do projeto.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a chave estrangeira de relacionamento de forma íntegra.
- [ ] A atualização do habitat deve refletir no mapa geográfico adicionando ícones correspondentes se a camada de fauna estiver ativa.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
