### Caso de Uso: Histórico de versões

**ID:** UC-124  
**Requisito relacionado:** RF-124 (histórico de versões)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto possui salvamentos anteriores registrados.  
**Gatilho:** O usuário clica na aba "Histórico de Versões" no painel lateral do editor.  

**Fluxo principal:**
1. O usuário clica em "Histórico de Versões".
2. O sistema recupera a lista de revisões salvas na tabela de histórico de versões do banco de dados para o arquivo atual.
3. A interface lateral apresenta a lista de versões categorizada por data, hora e autor.
4. O usuário clica em uma das versões.
5. O sistema abre uma tela de comparação side-by-side (diff visual) exibindo a versão atual e a versão histórica selecionada, marcando adições em verde e exclusões em vermelho.

**Fluxos alternativos:**
- *Nomear versão:* O usuário seleciona uma versão da lista e clica em "Nomear esta versão" para identificá-la com um rótulo personalizado (ex: "Versão Enviada para Editora").

**Fluxos de exceção:**
- *Falha de comunicação:* O sistema exibe o aviso "Não foi possível carregar o histórico de versões" e mantém o editor na visualização ativa atual.

**Pós-condições:** O histórico e as diferenças das versões passadas são apresentados ao usuário.

**Critérios de aceite:**
- [ ] O sistema deve salvar uma nova versão histórica a cada salvamento manual ou criar pontos de restauração a cada 1 hora de edição contínua.
- [ ] A renderização do diff visual deve destacar trechos modificados em nível de linha/palavra.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
