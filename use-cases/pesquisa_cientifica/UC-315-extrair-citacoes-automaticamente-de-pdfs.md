### Caso de Uso: Extrair citações automaticamente de PDFs

**ID:** UC-315  
**Requisito relacionado:** RF-314 (extrair citações automaticamente de PDFs)  
**Ator(es):** Usuário (Pesquisador), Sistema, IA  
**Pré-condições:** O arquivo PDF possui camada de texto ativa e está carregado no sistema.  
**Gatilho:** O usuário clica em "Extrair Citações por IA" no leitor de PDF.  

**Fluxo principal:**
1. O usuário abre a página da referência bibliográfica correspondente.
2. O usuário clica no botão "Extrair Citações Relevantes".
3. O backend analisa o texto do PDF buscando sentenças marcadas entre aspas ou blocos de recuo de citação importantes.
4. A IA gera uma listagem contendo os trechos textuais exatos localizados e a respectiva página.
5. O usuário revisa as citações sugeridas e marca as caixas de seleção correspondentes.
6. O usuário clica em "Adicionar ao Caderno de Notas".
7. O sistema grava as citações selecionadas na tabela de notas acadêmicas, vinculando-as diretamente à referência de origem.

**Fluxos alternativos:**
- *Extração manual rápida:* O usuário seleciona o texto no PDF, clica em "Copiar como Citação" e o sistema insere o trecho no painel lateral de anotações automaticamente.

**Fluxos de exceção:**
- *PDF protegido:* Se o arquivo PDF possuir criptografia de segurança que impeça a leitura de caracteres (copy-protection), o sistema cancela o processo e avisa: "Não é possível extrair textos deste PDF devido às restrições de segurança".

**Pós-condições:** As citações de texto extraídas são salvas e catalogadas vinculadas à respectiva fonte acadêmica.

**Critérios de aceite:**
- [ ] Cada citação extraída deve conter a informação exata da página em que foi encontrada.
- [ ] O tempo total de processamento e extração de citações de um PDF padrão de 15 páginas deve ser inferior a 6 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
