### Caso de Uso: Excluir imagens da galeria

**ID:** UC-272  
**Requisito relacionado:** RF-272 (excluir imagens da galeria)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A imagem a ser excluída está cadastrada no projeto.  
**Gatilho:** O usuário clica em "Excluir" nas opções de uma imagem na galeria.  

**Fluxo principal:**
1. O usuário abre a Galeria de Mídias.
2. O usuário clica no ícone de lixeira (Excluir) em cima do card da imagem selecionada.
3. O sistema abre uma caixa de diálogo avisando sobre a exclusão e desvinculação da imagem de fichas de entidades.
4. O usuário confirma.
5. O sistema remove o registro do banco de dados e deleta o arquivo físico do servidor.
6. A grade da galeria é atualizada removendo a miniatura.

**Fluxos alternativos:**
- *Excluir em lote:* O usuário seleciona múltiplas imagens na galeria e clica no botão "Excluir Selecionados".

**Fluxos de exceção:**
- *Imagem em uso no texto:* Se a imagem estiver em uso no corpo de algum capítulo de texto ativo, o sistema alerta o usuário. Se ele confirmar, o link correspondente no texto passa a renderizar um ícone quebrado de mídia.

**Pós-condições:** O arquivo de imagem é apagado fisicamente dos servidores da plataforma.

**Critérios de aceite:**
- [ ] A exclusão física do arquivo de armazenamento no servidor deve ocorrer de forma síncrona com a exclusão do banco de dados.
- [ ] O tempo total de exclusão deve ser menor que 1 segundo.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
