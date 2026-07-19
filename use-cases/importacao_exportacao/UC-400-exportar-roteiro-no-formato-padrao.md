### Caso de Uso: Exportar roteiro no formato padrão (Courier, etc.)

**ID:** UC-400  
**Requisito relacionado:** RF-399 (exportar roteiro no formato padrão)  
**Ator(es):** Usuário (Roteirista/Escritor), Sistema  
**Pré-condições:** Roteiro escrito contendo a formatação padrão da indústria (Cabeçalhos de Cena, Ações, Diálogos, Personagens).  
**Gatilho:** O roteirista clica em "Exportar Roteiro" no painel de exportação.  

**Fluxo principal:**
1. O roteirista abre o manuscrito do roteiro e clica em "Exportar Roteiro".
2. O roteirista seleciona as opções de formato (ex: PDF sob o padrão internacional de roteiros cinematográficos).
3. O roteirista confirma a exportação.
4. O backend renderiza o layout do roteiro forçando: fonte Courier 12 pontos, espaçamento simples, margem esquerda de 1.5 polegadas, direita de 1.0 polegada, diálogos recuados e nomes de personagens centralizados.
5. O sistema gera o arquivo PDF estruturado e inicia o download de forma automática.

**Fluxos alternativos:**
- *Exportar em Fountain:* O roteirista opta por baixar em formato Fountain (.fountain), um formato padrão de texto simples que preserva marcações de formatação de roteiro universais.

**Fluxos de exceção:**
- *Quebras de página incorretas:* O renderizador de PDF aplica a quebra de página automática respeitando as regras de transição de diálogos, evitando que falas de personagens sejam quebradas ou cortadas no meio de uma frase na transição de folhas.

**Pós-condições:** O arquivo PDF do roteiro sob formatação Courier padrão cinematográfica é baixado pelo usuário.

**Critérios de aceite:**
- [ ] O arquivo PDF resultante deve passar na verificação exata de recuos e margens exigidos pela indústria de cinema.
- [ ] A renderização e geração do PDF de um roteiro longo de 120 páginas devem demorar menos de 6 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
