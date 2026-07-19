### Caso de Uso: Importar mapas geográficos (arquivos de imagem)

**ID:** UC-267  
**Requisito relacionado:** RF-267 (importar mapas geográficos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui arquivos de imagens de mapas em alta resolução.  
**Gatilho:** O usuário realiza o upload da imagem ao criar ou atualizar um mapa.  

**Fluxo principal:**
1. O usuário clica em "Importar Imagem do Mapa" na ficha do mapa.
2. O sistema abre a caixa de upload local.
3. O usuário seleciona o arquivo de imagem (alta resolução) e confirma.
4. O backend recebe a imagem, gera pirâmides de imagens menores (tiles/fatiamento) em formato WebP para possibilitar renderizações parciais eficientes em zoom no navegador.
5. O sistema grava os metadados da imagem de mapa no banco de dados.
6. A tela do atlas renderiza a imagem no canvas interativo.

**Fluxos alternativos:**
- *Importar de links públicos:* O usuário insere a URL direta de uma imagem hospedada externamente e o sistema faz o download e processamento automático no servidor.

**Fluxos de exceção:**
- *Arquivo não suportado:* Se o usuário tentar fazer upload de arquivos que não sejam de imagem, o sistema cancela o processo e exibe: "Formato de arquivo inválido. Formatos suportados: JPG, PNG, WEBP".

**Pós-condições:** A imagem do mapa geográfico é processada, fatiada e disponibilizada para navegação de alta performance no atlas.

**Critérios de aceite:**
- [ ] O sistema deve aceitar imagens de até 15MB de tamanho e processá-las em menos de 8 segundos no servidor.
- [ ] A renderização dos blocos do mapa (tiles) em zoom máximo deve ser de carregamento rápido e sob demanda.

**Prioridade:** Média  
**Complexidade estimada:** Média
