### Caso de Uso: Auto intitular textos e pastas

**ID:** UC-041  
**Requisito relacionado:** RF-41 (auto intitular textos e pastas)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto ou pasta possui conteúdo textual associado.  
**Gatilho:** O usuário clica na opção "Auto Intitular" no cabeçalho do documento/pasta, ou cria um arquivo e o deixa sem título por mais de 5 minutos de atividade de escrita.  

**Fluxo principal:**
1. O sistema envia as primeiras 500 palavras do texto (ou a lista de títulos de arquivos contidos na pasta) para o assistente de IA.
2. A IA gera 3 sugestões de títulos coerentes baseadas no resumo do conteúdo.
3. O sistema exibe um popover na interface com as 3 sugestões geradas.
4. O usuário seleciona um dos títulos sugeridos.
5. O sistema atualiza o título do arquivo/pasta no banco de dados e na árvore lateral.

**Fluxos alternativos:**
- *Aceitação automática:* O usuário ativa a configuração "Auto intitular novos documentos automaticamente". O sistema atualiza o nome do documento sem confirmação prévia no primeiro auto-salvamento após 1.000 caracteres digitados.

**Fluxos de exceção:**
- *Conteúdo insuficiente para análise:* Se o documento contiver menos de 20 palavras e o usuário acionar o comando, o sistema exibe "Conteúdo insuficiente para gerar título automático" e mantém o título padrão.

**Pós-condições:** O título do arquivo ou pasta é atualizado com base na análise semântica do conteúdo.

**Critérios de aceite:**
- [ ] A geração de títulos deve sugerir opções concisas (máximo de 6 palavras por sugestão).
- [ ] A requisição de geração de título deve ser concluída em menos de 1,5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média
