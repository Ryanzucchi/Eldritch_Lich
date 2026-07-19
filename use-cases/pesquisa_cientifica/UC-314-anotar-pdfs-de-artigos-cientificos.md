### Caso de Uso: Anotar PDFs de artigos científicos

**ID:** UC-314  
**Requisito relacionado:** RF-313 (anotar PDFs de artigos científicos)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** O artigo científico em PDF está anexado a uma referência bibliográfica.  
**Gatilho:** O usuário abre o leitor de PDF interno e clica no modo "Anotações".  

**Fluxo principal:**
1. O usuário abre a referência do artigo e clica em "Visualizar Documento (PDF)".
2. O sistema renderiza o PDF na tela do navegador por meio de um visualizador interno seguro.
3. O usuário seleciona um trecho do texto do PDF com o mouse.
4. O sistema abre uma barra de ferramentas rápida contendo opções de destacar com cor, adicionar nota adesiva ou copiar citação.
5. O usuário seleciona "Adicionar Nota Adesiva" e digita o comentário.
6. O sistema insere o marcador visual de nota sobre a coordenada do PDF e grava o texto e a posição da anotação na base de dados.

**Fluxos alternativos:**
- *Listagem de Anotações:* O usuário abre a aba "Lista de Anotações" no painel lateral do leitor, visualizando todos os destaques organizados por número de página e ordem de inserção.

**Fluxos de exceção:**
- *PDF sem OCR:* Se o arquivo PDF for uma imagem digitalizada sem camada de texto pesquisável, o sistema desabilita a seleção direta de texto, permitindo apenas anotações em coordenadas livres na página.

**Pós-condições:** As anotações e realces do PDF são armazenados e indexados de forma coordenada ao arquivo.

**Critérios de aceite:**
- [ ] A renderização e as anotações do PDF devem se adaptar à escala de zoom (responsivo).
- [ ] A gravação de cada anotação deve durar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Alta
