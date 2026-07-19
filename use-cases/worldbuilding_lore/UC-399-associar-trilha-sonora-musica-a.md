### Caso de Uso: Associar trilha sonora/música a cenas

**ID:** UC-399  
**Requisito relacionado:** RF-398 (associar trilha sonora/música a cenas)  
**Ator(es):** Usuário (Escritor/Roteirista), Sistema  
**Pré-condições:** Arquivos de áudio carregados na galeria ou links de streaming inseridos.  
**Gatilho:** O usuário edita a ficha de propriedades de uma cena específica.  

**Fluxo principal:**
1. O usuário abre a cena correspondente no editor de textos do sistema.
2. O usuário abre a aba de propriedades e clica em "Trilha Sonora Vinculada".
3. O usuário seleciona o arquivo de áudio carregado ou cola o link de compartilhamento de streaming externo (Spotify/YouTube).
4. O usuário clica em "Vincular Trilha".
5. O sistema grava o vínculo correspondente no banco.
6. Ao abrir o modo de leitura para aquela cena, o sistema ativa o reprodutor de áudio interno integrado tocando a música correspondente em volume baixo em background.

**Fluxos alternativos:**
- *Playlist por capítulo:* O usuário associa uma playlist inteira de músicas a um capítulo longo, permitindo reprodução sonora de forma contínua durante todo o processo de escrita.

**Fluxos de exceção:**
- *Mídia indisponível:* Se a música de streaming externa associada for deletada da plataforma externa, o player exibe uma marcação de indisponibilidade e convida o autor a atualizar o link.

**Pós-condições:** O arquivo ou link de áudio é associado à cena, habilitando a reprodução sonora de fundo na leitura.

**Critérios de aceite:**
- [ ] O reprodutor interno de áudio deve conter barra de progresso, botão play/pause e controle de volume independente.
- [ ] O salvamento do vínculo de áudio deve levar menos de 200ms.

**Prioridade:** Baixa  
**Complexidade estimada:** Média
