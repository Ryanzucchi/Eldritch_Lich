### Caso de Uso: Exportar mapas geográficos (imagem com pinos)

**ID:** UC-268  
**Requisito relacionado:** RF-268 (exportar mapas geográficos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O mapa geográfico possui pinos de locais e entidades configurados na tela.  
**Gatilho:** O usuário clica em "Exportar Imagem do Mapa" no painel do atlas.  

**Fluxo principal:**
1. O usuário abre o mapa geográfico e clica no botão "Exportar".
2. O usuário seleciona a opção "Exportar Imagem com Marcadores (PNG)".
3. O sistema renderiza a imagem de fundo do mapa no canvas e insere os marcadores visuais correspondentes nas coordenadas exatas.
4. O sistema gera um arquivo PNG consolidado contendo a imagem e os marcadores fundidos.
5. O navegador inicia o download automático do arquivo.

**Fluxos alternativos:**
- *Exportar PDF do Mapa:* O usuário exporta o mapa em PDF contendo uma legenda descritiva de todos os pinos no rodapé da página.

**Fluxos de exceção:**
- *Marcador fora do enquadramento:* Se o usuário estiver com zoom aplicado em uma região específica, o sistema exporta apenas a área visível ativa na tela (crop) de acordo com o enquadramento.

**Pós-condições:** A imagem do mapa geográfico consolidada com os marcadores de locais e entidades é baixada.

**Critérios de aceite:**
- [ ] Os pinos de locais e legendas na imagem exportada devem ter nitidez para leitura e impressão.
- [ ] O processamento da imagem de exportação de tamanho padrão deve demorar menos de 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média
