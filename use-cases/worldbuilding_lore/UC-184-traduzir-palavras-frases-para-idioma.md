### Caso de Uso: Traduzir palavras/frases para idioma fictício (dicionário)

**ID:** UC-184  
**Requisito relacionado:** RF-184 (traduzir palavras/frases para idioma fictício)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** Um idioma fictício está cadastrado e possui termos e traduções inseridos em seu dicionário.  
**Gatilho:** O usuário abre o painel do tradutor ou seleciona um termo no editor de texto.  

**Fluxo principal:**
1. O usuário acessa a ferramenta "Tradutor do Universo".
2. O usuário seleciona o idioma de origem ("Português") e o idioma fictício de destino.
3. O usuário digita a frase desejada no campo de entrada.
4. O sistema varre o dicionário da conlang buscando correspondências literais ou lematizadas.
5. O sistema compõe a tradução palavra por palavra e exibe o resultado na caixa de saída.

**Fluxos alternativos:**
- *Tradutor com IA:* Se a frase não possuir tradução exata no dicionário, a IA tenta traduzir respeitando as regras morfológicas e fonéticas cadastradas no idioma fictício.

**Fluxos de exceção:**
- *Dicionário vazio:* Se o dicionário não contiver palavras cadastradas, o sistema exibe "Dicionário sem termos cadastrados para tradução".

**Pós-condições:** A frase traduzida é apresentada na interface do usuário.

**Critérios de aceite:**
- [ ] O sistema de tradução deve possuir suporte a busca bidirecional.
- [ ] O tempo de tradução de termos isolados deve ser inferior a 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
