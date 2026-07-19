### Caso de Uso: Gerenciar notas de rodapé de textos

**ID:** UC-393  
**Requisito relacionado:** RF-392 (gerenciar notas de rodapé de textos)  
**Ator(es):** Usuário (Escritor/Pesquisador), Sistema  
**Pré-condições:** O editor de texto rico está ativo com o documento correspondente aberto.  
**Gatilho:** O usuário clica em "Inserir Nota de Rodapé" ao posicionar o cursor no texto.  

**Fluxo principal:**
1. O usuário digita no editor e posiciona o cursor ao final de uma palavra.
2. O usuário clica no botão "Inserir Nota de Rodapé" ou utiliza o atalho de teclado correspondente.
3. O sistema insere um número sobrescrito no texto corrido (ex: `¹`) e abre a respectiva caixa de texto no rodapé da página.
4. O usuário digita a observação da nota de rodapé correspondente.
5. O usuário confirma.
6. O sistema grava a relação de nota no banco de dados vinculada à coordenada de caracteres do texto.

**Fluxos alternativos:**
- *Renumeração automática:* O usuário decide inserir uma nova nota antes da nota criada. O sistema insere o novo indicador e atualiza de forma automática a sequência das notas subsequentes no documento.

**Fluxos de exceção:**
- *Marcador excluído:* Se o usuário deletar o indicador sobrescrito correspondente no texto corrido, o sistema remove automaticamente a nota de rodapé associada para evitar notas órfãs.

**Pós-condições:** A nota de rodapé vinculada ao caractere é salva e renderizada no documento.

**Critérios de aceite:**
- [ ] As notas de rodapé devem ser convertidas de forma nativa e correta ao exportar o texto para formatos DOCX ou PDF.
- [ ] A renumeração automática de referências de rodapé em documentos longos deve ocorrer em menos de 100ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
