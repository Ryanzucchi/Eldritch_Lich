### Caso de Uso: Criar mapas geográficos

**ID:** UC-099  
**Requisito relacionado:** RF-99 (criar mapas geográficos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui arquivos de mapas locais ou deseja gerar um grid de mapa a partir do sistema.  
**Gatilho:** O usuário clica em "Novo Mapa Geográfico" na barra lateral de navegação ou aba do atlas do projeto.  

**Fluxo principal:**
1. O usuário clica na opção "Criar Mapa".
2. O sistema abre uma tela modal solicitando o upload de uma imagem do mapa do universo (.png, .jpg ou .webp) e informações de escala (pixels por quilômetro fictício).
3. O usuário seleciona o arquivo da imagem e confirma o upload.
4. O sistema salva a imagem no servidor, inicializa a tela de visualização interativa do atlas e renderiza o mapa sobre um grid plano navegável.
5. O usuário visualiza o mapa geográfico e pode arrastar e dar zoom na imagem.

**Fluxos alternativos:**
- *Gerar mapa em branco:* Se o usuário não tiver uma imagem, ele cria um mapa quadriculado em branco utilizando grids simples do próprio sistema para posicionar pontos de referência.

**Fluxos de exceção:**
- *Imagem de mapa excessiva:* Se a imagem exceder 20MB, o sistema trunca o upload e solicita que o usuário otimize a imagem ou a envie em formato comprimido (.webp).

**Pós-condições:** O mapa geográfico interativo do projeto é criado e disponibilizado no atlas.

**Critérios de aceite:**
- [ ] O atlas interativo deve rodar de forma fluida no navegador, suportando zoom com a roda do mouse e pan ao arrastar.
- [ ] O mapa deve possuir uma régua interativa de medição de distâncias baseada na escala configurada.

**Prioridade:** Média  
**Complexidade estimada:** Alta
