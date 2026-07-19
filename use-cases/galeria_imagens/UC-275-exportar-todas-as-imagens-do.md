### Caso de Uso: Exportar todas as imagens do projeto (.zip)

**ID:** UC-275  
**Requisito relacionado:** RF-275 (exportar todas as imagens do projeto (.zip))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui imagens e arquivos de mídia salvos na galeria.  
**Gatilho:** O usuário clica em "Exportar Todas as Mídias (.zip)" no painel da galeria.  

**Fluxo principal:**
1. O usuário acessa a Galeria de Mídias.
2. O usuário clica em "Exportar Tudo para ZIP" nas opções do cabeçalho.
3. O backend varre a lista de mídias associadas ao projeto, transfere os arquivos originais e os compacta em um único arquivo ZIP.
4. O sistema gera o arquivo compactado `mídias_[nome_do_projeto].zip`.
5. O navegador inicia o download automático do arquivo.

**Fluxos alternativos:**
- *Exportação setorial:* O usuário opta por exportar apenas a pasta compactada contendo "Mapas" ou "Retratos de Personagens".

**Fluxos de exceção:**
- *Galeria vazia:* Se o projeto não contiver imagens cadastradas, o botão de exportação é exibido desabilitado com o aviso "Nenhuma mídia disponível para exportação".

**Pós-condições:** O arquivo compactado ZIP contendo a totalidade das imagens do projeto é baixado.

**Critérios de aceite:**
- [ ] O ZIP gerado deve organizar as mídias em pastas internas coerentes com as categorias correspondentes.
- [ ] O tempo total de compressão de um lote de até 50 imagens deve ser menor que 5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média
