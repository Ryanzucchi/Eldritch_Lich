### Caso de Uso: Gerador de nomes com base no idioma fictício

**ID:** UC-185  
**Requisito relacionado:** RF-185 (gerador de nomes com base no idioma fictício)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O idioma fictício possui regras fonológicas (sílabas permitidas, prefixos comuns, sufixos) cadastradas.  
**Gatilho:** O usuário clica em "Gerador de Nomes por Idioma" ao cadastrar um novo personagem.  

**Fluxo principal:**
1. O usuário abre o modal de criação de personagem e clica em "Gerar Nome".
2. O usuário seleciona o idioma base e o gênero pretendido (Masculino, Feminino, Neutro).
3. A IA lê as regras morfológicas e fonotáticas cadastradas do idioma fictício.
4. A IA gera uma lista de 5 nomes inéditos que se adequam à fonética do idioma selecionado.
5. O usuário clica em um nome para adotá-lo na ficha do personagem.

**Fluxos alternativos:**
- *Gerar a partir de significados:* O usuário pede para gerar um nome contendo um significado específico. O sistema cruza os termos no dicionário cadastrado e monta a palavra final.

**Fluxos de exceção:**
- *Regras inconsistentes:* Se o idioma não tiver regras de fonética preenchidas, o sistema gera nomes baseados em padrões literários genéricos do sistema.

**Pós-condições:** O nome gerado de acordo com a fonética do idioma fictício é atribuído à ficha do personagem.

**Critérios de aceite:**
- [ ] O gerador deve permitir ao usuário gerar novas rodadas de nomes até encontrar um satisfatório.
- [ ] O processamento da lista de 5 nomes sugeridos deve levar menos de 800ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
