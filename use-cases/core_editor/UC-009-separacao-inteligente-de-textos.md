### Caso de Uso: Separação inteligente de textos

**ID:** UC-009  
**Requisito relacionado:** RF-9 (separação inteligente de textos)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Um texto longo está aberto no editor e a ferramenta de IA está configurada e ativa.  
**Gatilho:** O usuário aciona "Separação Inteligente de Textos" no menu de ferramentas de escrita.  

**Fluxo principal:**
1. O usuário clica na opção "Separar Texto Inteligentemente" no painel de ferramentas do editor.
2. O sistema envia o conteúdo do texto ativo para o serviço de IA em background.
3. A IA analisa semanticamente o fluxo de texto buscando marcadores implícitos (como quebras de cena, transição abrupta de perspectiva, elipses temporais e novos capítulos) e marcadores explícitos ("Capítulo 1", "Parte II").
4. O sistema apresenta uma tela de visualização lado a lado (*Split Preview*) exibindo as sugestões de pontos de corte, trechos de início e fim propostos, e sugestões de títulos para os novos blocos de texto.
5. O usuário revisa as propostas, podendo arrastar os pontos de divisão ou renomear os títulos propostos.
6. O usuário clica em "Confirmar Separação".
7. O sistema executa a divisão física: cria os novos subdocumentos ordenados, coloca-os dentro de uma nova pasta com o nome do arquivo original, e atualiza a barra lateral.

**Fluxos alternativos:**
- *Divisão sem marcadores de IA:* Se a IA não identificar elementos semânticos de quebra, sugere fatiamento simples baseado em contagem de palavras (ex: a cada 1.500 palavras) configurável pelo usuário.

**Fluxos de exceção:**
- *Timeout na resposta da IA:* Se a requisição de IA demorar mais de 20 segundos, o sistema aborta a operação, exibe "O assistente de IA demorou muito para responder. Tente realizar a quebra manual" e mantém o arquivo original intocado.

**Pós-condições:** O documento original é subdividido em vários documentos ordenados, sem perda de caracteres e organizados hierarquicamente.

**Critérios de aceite:**
- [ ] A separação deve manter a integridade exata dos caracteres: a junção de todas as partes novas geradas deve resultar exatamente no mesmo caractere-por-caractere do texto de origem.
- [ ] O usuário deve ter a opção de manter ou excluir o arquivo consolidado de origem durante o passo de confirmação.
- [ ] O processo de gravação dos novos arquivos no banco de dados deve ser transacional (se falhar em um, desfaz todos os criados para evitar dados órfãos).

**Prioridade:** Média  
**Complexidade estimada:** Alta
