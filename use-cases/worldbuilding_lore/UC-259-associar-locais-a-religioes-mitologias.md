### Caso de Uso: Associar locais a religiões/mitologias (locais sagrados)

**ID:** UC-259  
**Requisito relacionado:** RF-259 (associar locais a religiões/mitologias)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Locais e religiões estão cadastrados no projeto.  
**Gatilho:** O usuário edita as propriedades de um local ou associa no mapa.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um local.
2. O usuário localiza o campo "Local Sagrado de (Religião)".
3. O sistema exibe as religiões disponíveis no projeto.
4. O usuário seleciona a religião correspondente.
5. O usuário escolhe o tipo de local (Dropdown: Santuário Principal, Templo Regional, Altar de Peregrinação).
6. O usuário clica em "Salvar".
7. O sistema grava o vínculo de local sagrado no banco de dados.
8. A ficha do local passa a exibir o selo de santuário correspondente.

**Fluxos alternativos:**
- *Rota de peregrinação:* O usuário seleciona múltiplos locais sagrados e os liga no mapa geográfico definindo uma Rota de Peregrinação.

**Fluxos de exceção:**
- *Religião excluída:* A associação é apagada do local de forma automática caso a religião seja deletada.

**Pós-condições:** O local é catalogado como ponto geográfico sagrado da religião no banco de dados.

**Critérios de aceite:**
- [ ] O mapa geográfico deve exibir marcadores diferenciados para locais sagrados utilizando o símbolo correspondente da fé.
- [ ] A atualização do banco de dados deve ser concluída em menos de 150ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
