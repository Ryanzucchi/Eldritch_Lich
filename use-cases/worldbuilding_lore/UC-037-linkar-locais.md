### Caso de Uso: Linkar locais

**ID:** UC-037  
**Requisito relacionado:** RF-37 (linkar locais)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Locais estão catalogados no projeto.  
**Gatilho:** O usuário gerencia os relacionamentos a partir da ficha de um local.  

**Fluxo principal:**
1. O usuário acessa a ficha técnica do "Local A".
2. O usuário seleciona a opção "Vincular a outro Local".
3. O sistema exibe a lista de locais cadastrados.
4. O usuário escolhe o "Local B" e define a natureza da ligação (ex: "Dentro de" para sublocais, "Fronteira com").
5. O sistema grava o relacionamento de localidade/geografia fictícia no banco de dados.

**Fluxos alternativos:**
- *Linkar local a personagem/evento:* O usuário vincula o Local à ficha de um personagem (ex: "Residência de") ou de um evento.

**Fluxos de exceção:**
- *Sublocal recursivo:* Se o usuário definir que o "Local A" está "Dentro de" "Local B", e depois tentar definir que "Local B" está "Dentro de" "Local A", o sistema bloqueia a ação e exibe: "Erro: Relação de pertencimento cíclica detectada".

**Pós-condições:** O relacionamento geográfico ou administrativo entre os locais é armazenado.

**Critérios de aceite:**
- [ ] A relação de hierarquia geográfica ("Dentro de") deve ser tratada de forma transitiva para fins de busca.
- [ ] O relacionamento deve ser refletido nos mapas e no grafo do universo.

**Prioridade:** Média  
**Complexidade estimada:** Média
