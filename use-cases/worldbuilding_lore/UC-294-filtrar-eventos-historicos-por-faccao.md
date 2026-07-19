### Caso de Uso: Filtrar eventos históricos por facção (participação política)

**ID:** UC-294  
**Requisito relacionado:** RF-294 (filtrar eventos históricos por facção)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos históricos com envolvimento de facções cadastrados.  
**Gatilho:** O usuário filtra a linha do tempo por organização.  

**Fluxo principal:**
1. O usuário acessa o painel de "Eventos Históricos" ou a "Timeline".
2. O usuário ativa o filtro "Facções / Organizações".
3. O usuário seleciona a facção desejada (ex: "Império de Valoria").
4. O sistema varre o banco e oculta todos os eventos em que a facção selecionada não participou.
5. O usuário visualiza o panorama de histórico geopolítico da organização ao longo da timeline.

**Fluxos alternativos:**
- *Filtro de alianças:* O usuário filtra para exibir apenas eventos onde a facção participou conjuntamente com uma facção aliada.

**Fluxos de exceção:**
- *Sem eventos:* Se a organização não possuir registros associados na timeline, exibe "Nenhum evento registrado".

**Pós-condições:** A timeline exibe exclusivamente as ocorrências com a participação da facção selecionada.

**Critérios de aceite:**
- [ ] O tempo de resposta do filtro deve ser menor que 100ms.
- [ ] O filtro deve destacar o papel em que a facção participou de cada marco (ex: tag "Beligerante").

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
