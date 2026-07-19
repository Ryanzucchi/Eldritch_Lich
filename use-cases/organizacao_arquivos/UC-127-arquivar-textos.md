### Caso de Uso: Arquivar textos

**ID:** UC-127  
**Requisito relacionado:** RF-127 (arquivar textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto existe no projeto ativo.  
**Gatilho:** O usuário clica com o botão direito no texto e seleciona "Arquivar".  

**Fluxo principal:**
1. O usuário acessa o menu de contexto do texto e seleciona "Arquivar".
2. O sistema apresenta um modal informativo explicando que o texto ficará em modo leitura e oculto da navegação ativa.
3. O usuário confirma.
4. O sistema define a flag `arquivado = true` no banco de dados.
5. O texto é removido da listagem de diretórios ativa e movido para a pasta virtual "Textos Arquivados" no rodapé da árvore lateral.

**Fluxos alternativos:**
- *Desarquivar:* O usuário acessa a pasta "Textos Arquivados", clica com o botão direito no texto e seleciona "Desarquivar", retornando o arquivo à sua pasta original.

**Fluxos de exceção:**
- *Tentativa de edição:* O editor desabilita a digitação em arquivos arquivados, exibindo o status "Arquivo em modo de leitura".

**Pós-condições:** O texto é ocultado da árvore de navegação ativa do projeto.

**Critérios de aceite:**
- [ ] O texto arquivado deve continuar sendo incluído em buscas globais contanto que a opção "Incluir arquivados" esteja ativa.
- [ ] O processo de arquivamento deve atualizar a interface em menos de 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
