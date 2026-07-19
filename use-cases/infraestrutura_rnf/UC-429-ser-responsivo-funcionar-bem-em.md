### Caso de Uso: Ser responsivo (funcionar bem em desktop, tablet e mobile) (RNF)

**ID:** UC-429  
**Requisito relacionado:** RNF-High-5 (interface responsiva em múltiplos dispositivos)  
**Ator(es):** Sistema (Interface Frontend / CSS Responsivo)  
**Pré-condições:** Layouts do frontend construídos sob padrões de CSS flexíveis e media queries de largura de tela configurados.  
**Gatilho:** O usuário acessa a plataforma em um dispositivo móvel ou redimensiona a janela do navegador.  

**Fluxo principal:**
1. O usuário abre o painel da plataforma em um smartphone (largura de tela menor que 480px).
2. O navegador lê os estilos CSS da folha de estilo responsiva da página.
3. O menu lateral de navegação se recolhe em formato de menu hambúrguer no topo da tela.
4. As colunas de dados do dashboard se empilham verticalmente e as tabelas ativam a rolagem interna para evitar quebras visuais de elementos.
5. O tamanho das fontes e botões se expandem para facilitar toques de dedos no dispositivo móvel.

**Fluxos alternativos:**
- *Visualização em tablet:* O usuário acessa a plataforma de um tablet. O sistema reduz o menu lateral apenas para ícones compactos, maximizando a área de exibição central.

**Fluxos de exceção:**
- *Gráficos de fluxo de caixa em telas pequenas:* Componentes visuais largos que transbordem o limite de tela do celular são envolvtos em blocos de rolagem horizontal nativo independente para manter a integridade visual da página.

**Pós-condições:** A interface gráfica da plataforma é adaptada e legível no tamanho de tela ativo do dispositivo.

**Critérios de aceite:**
- [ ] Nenhum elemento interativo importante ou texto deve transbordar as margens da tela lateralmente (sem scroll de página inteira horizontal).
- [ ] A área mínima de clique de botões e links na versão mobile deve ser de no mínimo 44x44 pixels para acessibilidade.

**Prioridade:** Alta  
**Complexidade estimada:** Média
