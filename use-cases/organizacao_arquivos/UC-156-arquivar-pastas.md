### Caso de Uso: Arquivar pastas

**ID:** UC-156  
**Requisito relacionado:** RF-156 (arquivar pastas)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** A pasta que o usuário deseja arquivar existe no projeto.  
**Gatilho:** O usuário seleciona "Arquivar Pasta" no menu de contexto.  

**Fluxo principal:**
1. O usuário clica com o botão direito na pasta e seleciona a opção "Arquivar".
2. O sistema abre um modal de confirmação explicando que a pasta e seus subdocumentos ficarão ocultos na árvore principal e em modo leitura.
3. O usuário clica em "Confirmar".
4. O sistema atualiza o atributo `arquivada = true` da pasta no banco de dados.
5. O sistema propaga a flag de arquivamento para todos os subdocumentos e subpastas.
6. A pasta e seus arquivos internos são realocados na pasta virtual de arquivados.

**Fluxos alternativos:**
- *Desarquivar pasta:* O usuário abre a pasta de arquivados, clica com o botão direito e seleciona "Desarquivar", restaurando a pasta e seus subdocumentos na estrutura ativa.

**Fluxos de exceção:**
- *Mover item para pasta arquivada:* O sistema impede o arrasto de arquivos ativos para dentro de uma pasta arquivada, exibindo "Não é possível mover arquivos ativos para diretórios arquivados".

**Pós-condições:** A pasta e todo o seu conteúdo são arquivados logicamente e mantidos em modo de leitura.

**Critérios de aceite:**
- [ ] A propagação de herança de arquivamento para subpastas no banco de dados deve ocorrer de forma rápida (menos de 1 segundo para até 100 arquivos).
- [ ] O editor de texto deve bloquear a escrita de qualquer arquivo pertencente à pasta arquivada.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
