### Caso de Uso: Comparar resultado do "e se" com o universo canônico

**ID:** UC-405  
**Requisito relacionado:** RF-400 (comparar resultado do "e se" com o universo canônico)  
**Ator(es):** Usuário (Escritor/Game Designer), Sistema  
**Pré-condições:** Sandbox com alterações salvas e universo canônico correspondente ativo.  
**Gatilho:** O usuário clica em "Comparar com Universo Real" no painel do sandbox.  

**Fluxo principal:**
1. O usuário acessa o menu do Sandbox ativo.
2. O usuário clica em "Comparar com Canônico".
3. O sistema abre a tela de comparação em duas colunas verticais paralelas (Split screen).
4. O sistema compara as duas bases e destaca as divergências de dados (exibindo em vermelho exclusões e em verde inserções) em capítulos, cenas e fichas de personagens.
5. O usuário visualiza as diferenças estruturais lado a lado na tela.

**Fluxos alternativos:**
- *Exportar Diferenças:* O usuário exporta o relatório de diferenças estruturais (diff) em formato de texto para análise posterior offline.

**Fluxos de exceção:**
- *Sem alterações:* Se nenhuma modificação tiver sido realizada no sandbox, o sistema exibe a mensagem "Nenhuma alteração detectada em relação ao universo canônico".

**Pós-condições:** O relatório visual comparativo das divergências estruturais e textuais é exibido na tela.

**Critérios de aceite:**
- [ ] A tela de comparação deve utilizar rolagem de tela (scroll) sincronizada entre as colunas do split screen.
- [ ] A varredura e cálculo de diferenças de até 50 fichas do universo devem demorar menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média
