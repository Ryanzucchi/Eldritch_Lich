### Caso de Uso: Filtrar eventos históricos por local (histórico local)

**ID:** UC-293  
**Requisito relacionado:** RF-293 (filtrar eventos históricos por local)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos históricos com palcos locais cadastrados configurados.  
**Gatilho:** O usuário filtra a linha do tempo por localidade.  

**Fluxo principal:**
1. O usuário acessa a seção "Eventos Históricos" ou "Timeline".
2. O usuário clica no filtro "Locais / Regiões".
3. O usuário seleciona o local desejado (ex: "Cidade de Eldoria").
4. O sistema processa e exibe apenas os acontecimentos ocorridos fisicamente na Cidade de Eldoria.
5. O usuário estuda a cronologia histórica do ponto geográfico selecionado.

**Fluxos alternativos:**
- *Linha do tempo interna na ficha do local:* O usuário abre a ficha técnica do local e visualiza a seção de cronologia local já pré-filtrada.

**Fluxos de exceção:**
- *Local sem histórico:* A listagem exibe "Nenhum acontecimento histórico registrado nesta localização".

**Pós-condições:** A listagem exibe apenas as ocorrências ocorridas no local selecionado.

**Critérios de aceite:**
- [ ] O filtro de eventos por local deve carregar instantaneamente (< 100ms).
- [ ] O filtro deve suportar a seleção de sublocais se houver hierarquia geográfica.

**Prioridade:** Alta  
**Complexidade estimada:** Média
