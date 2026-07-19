### Caso de Uso: Colaborar em revisão de literatura

**ID:** UC-320  
**Requisito relacionado:** RF-319 (colaborar em revisão de literatura)  
**Ator(es):** Usuário A (Pesquisador), Usuário B (Coautor), Sistema  
**Pré-condições:** O projeto de pesquisa é compartilhado e ambos possuem permissão de coautoria ativa.  
**Gatilho:** O Usuário A insere um comentário em uma referência bibliográfica ou nota de revisão.  

**Fluxo principal:**
1. O Usuário A acessa o painel de "Revisão da Literatura" do projeto compartilhado.
2. O Usuário A seleciona a referência acadêmica desejada e clica em "Discussão / Revisão".
3. O Usuário A digita sua observação/análise e confirma.
4. O sistema insere a nota no mural da referência e envia uma notificação instantânea para o Usuário B.
5. O Usuário B abre a mesma referência, visualiza o comentário de A e responde na thread correspondente.
6. O sistema atualiza o feed de debate da revisão bibliográfica em tempo real para os coautores.

**Fluxos alternativos:**
- *Classificar relevância das obras:* Os coautores votam em uma escala de relevância para organizar a bibliografia de forma coletiva.

**Fluxos de exceção:**
- *Votos conflitantes:* Se os coautores marcarem classificações opostas sobre a relevância da mesma obra, o sistema exibe a marca de divergência de classificação na biblioteca até que haja resolução manual.

**Pós-condições:** O feed colaborativo de revisão de literatura é atualizado e persistido na base de dados do projeto.

**Critérios de aceite:**
- [ ] O feed de discussão deve suportar ordenação por data ou por relevância de comentários.
- [ ] O tempo total de entrega da mensagem no feed dos colaboradores deve ser de no máximo 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
