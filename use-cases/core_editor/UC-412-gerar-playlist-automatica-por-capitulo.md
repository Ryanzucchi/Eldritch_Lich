### Caso de Uso: Gerar playlist automática por capítulo/humor

**ID:** UC-412  
**Requisito relacionado:** RF-407 (gerar playlist automática por capítulo/humor)  
**Ator(es):** Sistema, IA, Usuário (Escritor)  
**Pré-condições:** Capítulos de texto escritos e cadastrados no projeto.  
**Gatilho:** O usuário clica em "Gerar Playlist do Capítulo" no painel de áudio do capítulo.  

**Fluxo principal:**
1. O usuário abre o capítulo de sua obra no editor e acessa o menu de controle de áudio.
2. O usuário clica no botão "Gerar Playlist Automática".
3. A IA analisa o humor predominante de cada cena constituinte do capítulo e compila a sequência emocional da narrativa.
4. A IA seleciona faixas instrumentais correspondentes na biblioteca e monta uma lista de reprodução (playlist) ordenada.
5. O sistema salva a playlist gerada e a exibe no reprodutor lateral do capítulo.
6. O usuário inicia a reprodução contínua da playlist enquanto escreve.

**Fluxos alternativos:**
- *Exportar playlist:* O usuário clica em "Exportar Playlist para Spotify" e o sistema gera a lista de faixas correspondentes na conta do usuário conectado via API.

**Fluxos de exceção:**
- *Capítulo vazio:* Se o capítulo selecionado não contiver texto escrito, o sistema impede a geração automática e solicita digitação prévia ou seleção manual de humor.

**Pós-condições:** A playlist sequencial baseada no humor do capítulo é gerada e vinculada à barra de reprodução.

**Critérios de aceite:**
- [ ] A playlist gerada deve conter transições suaves de áudio (crossfade) de 2 segundos entre as faixas da lista.
- [ ] O processamento e geração da playlist por IA devem demorar menos de 4 segundos.

**Prioridade:** Baixa  
**Complexidade estimada:** Média
