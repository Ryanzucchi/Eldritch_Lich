### Caso de Uso: Associar locais a facções (território de controle)

**ID:** UC-180  
**Requisito relacionado:** RF-180 (associar locais a facções)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de locais e organizações cadastradas.  
**Gatilho:** O usuário edita as propriedades políticas da ficha de um local ou associa no mapa.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um local.
2. O usuário clica no campo "Território Controlado por (Facção)".
3. O sistema abre a listagem autocomplete de organizações do projeto.
4. O usuário pesquisa e seleciona a organização desejada.
5. O usuário escolhe o Status de Controle (Dropdown: Domínio Total, Ocupado, Território Disputado).
6. O usuário clica em "Salvar".
7. O sistema grava o vínculo político na base de dados.

**Fluxos alternativos:**
- *Desenhar território no mapa:* O usuário seleciona uma facção no mapa e desenha um polígono simples sobre uma área geográfica. O sistema pinta a região e vincula todos os locais contidos nela à facção Stark automaticamente.

**Fluxos de exceção:**
- *Facção removida:* Se a facção associada for excluída do projeto, o status político do local correspondente retorna para "Neutro/Sem Facção" de forma automática.

**Pós-condições:** Os locais ficam mapeados como territórios pertencentes ou controlados pelas respectivas organizações na base do projeto.

**Critérios de aceite:**
- [ ] A ficha técnica do local deve exibir o brasão e o nome da facção controladora em destaque.
- [ ] A atualização do status de controle territorial deve refletir instantaneamente nas cores das camadas do mapa geográfico interativo.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
