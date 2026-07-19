### Caso de Uso: Estimar tempo de leitura do texto

**ID:** UC-186  
**Requisito relacionado:** RF-186 (estimar tempo de leitura do texto)  
**Ator(es):** Sistema  
**Pré-condições:** O texto do capítulo possui conteúdo escrito.  
**Gatilho:** O usuário abre um texto ou atualiza o conteúdo do editor.  

**Fluxo principal:**
1. O usuário abre um capítulo no editor.
2. O sistema conta a quantidade total de palavras contidas no corpo do documento.
3. O sistema divide a contagem de palavras pela velocidade média de leitura (ex: 200 palavras por minuto).
4. O sistema calcula o tempo aproximado em minutos.
5. A interface exibe no rodapé do editor a métrica: "Tempo estimado de leitura: ~X min".

**Fluxos alternativos:**
- *Configurar velocidade:* O usuário altera o valor médio de WPM nas configurações de leitura, recalculando as estimativas do projeto.

**Fluxos de exceção:**
- *Texto vazio:* Se o documento estiver em branco, a estimativa exibe "Tempo de leitura: < 1 min".

**Pós-condições:** O indicador de tempo de leitura atualizado é exibido na tela.

**Critérios de aceite:**
- [ ] O recálculo do tempo de leitura deve rodar em background através de um debounce leve para economizar CPU.
- [ ] O tempo estimado deve ser exibido com formatação amigável.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
