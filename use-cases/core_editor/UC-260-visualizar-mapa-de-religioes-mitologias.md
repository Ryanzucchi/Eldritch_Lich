### Caso de Uso: Visualizar mapa de religiões/mitologias (influência)

**ID:** UC-260  
**Requisito relacionado:** RF-260 (visualizar mapa de religiões/mitologias)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O mapa geográfico está ativo e locais sagrados e população possuem crenças associadas.  
**Gatilho:** O usuário ativa a camada "Mapa Temático de Religiões" no atlas.  

**Fluxo principal:**
1. O usuário abre o mapa geográfico do projeto.
2. O usuário clica em "Camadas" e seleciona "Influência Religiosa".
3. O sistema lê as informações de controle territorial e a crença predominante de cada região.
4. O sistema gera uma sobreposição visual de cores semitransparentes (Heatmap) sobre a imagem do mapa representando as fés de cada região.
5. O usuário visualiza as zonas de influência religiosa e as áreas de fronteira disputadas.

**Fluxos alternativos:**
- *Evolução temporal da fé:* O usuário avança o Time Slider da timeline e visualiza as cores de influência religiosa mudando no mapa de acordo com os eventos históricos de conquistas e conversões.

**Fluxos de exceção:**
- *Ausência de dados:* Se a região não possuir personagens ou facções de crença declarada, a área do mapa permanece sem cor (neutra/sem religião).

**Pós-condições:** O mapa de calor de influência cultural/religiosa do universo é exibido no atlas.

**Critérios de aceite:**
- [ ] As cores das camadas de influência devem ser suaves e transparentes (opacidade máxima de 30%) para permitir a visualização dos acidentes geográficos sob a cor.
- [ ] O processamento e renderização do heatmap de influência religiosa sobre o mapa devem durar menos de 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
