### Caso de Uso: Associar locais a eventos históricos (palco do evento)

**ID:** UC-290  
**Requisito relacionado:** RF-290 (associar locais a eventos históricos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Locais e eventos históricos estão cadastrados no projeto.  
**Gatilho:** O usuário edita as propriedades geográficas do evento histórico.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um evento histórico.
2. No painel de geografia, o usuário clica no campo "Palco do Acontecimento (Local)".
3. O sistema abre a busca autocomplete de locais do projeto.
4. O usuário pesquisa e seleciona o local desejado (ex: "Cidade de Eldoria").
5. O usuário clica em "Salvar".
6. O sistema grava a relação na tabela correspondente no banco de dados.
7. A ficha do evento histórico passa a exibir a tag clicável do local e a ficha do local exibe o acontecimento sob sua timeline.

**Fluxos alternativos:**
- *Associação via mapa:* O usuário posiciona o evento diretamente no mapa geográfico, configurando a associação de local com base na proximidade do pino onde foi solto.

**Fluxos de exceção:**
- *Local excluído:* A associação é apagada automaticamente caso o local correspondente seja deletado do projeto.

**Pós-condições:** O local de ambientação do evento histórico é salvo na base de dados do projeto.

**Critérios de aceite:**
- [ ] O banco de dados deve manter consistência referencial de forma indexada.
- [ ] Clicar no local de ambientação na ficha do evento histórico deve abrir a página do local em split-view.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
