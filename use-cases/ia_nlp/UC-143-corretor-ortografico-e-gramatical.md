### Caso de Uso: Corretor ortográfico e gramatical

**ID:** UC-143  
**Requisito relacionado:** RF-143 (corretor ortográfico e gramatical)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O usuário está digitando em um idioma homologado no corretor.  
**Gatilho:** Inatividade pós-digitação de palavra ou finalização de frase.  

**Fluxo principal:**
1. À medida que o usuário escreve, o sistema envia tokens em background para validação contra o dicionário gramatical e dicionário local do projeto.
2. O corretor identifica erros ortográficos ou desvios de concordância.
3. O sistema sublinha a palavra correspondente com uma linha ondulada vermelha (ortografia) ou azul (gramática) no editor.
4. O usuário clica com o botão direito sobre o trecho sublinhado.
5. O sistema exibe sugestões de correção rápida.
6. O usuário clica na sugestão e o sistema substitui o termo incorreto pelo correto no editor de texto.

**Fluxos alternativos:**
- *Ignorar palavra:* O usuário clica em "Ignorar" ou "Adicionar ao dicionário" para remover o sublinhado de termos específicos.

**Fluxos de exceção:**
- *Sobrecarga de rede:* O corretor ortográfico roda localmente no navegador (IndexedDB) para garantir funcionamento estável offline.

**Pós-condições:** Desvios ortográficos e gramaticais são sinalizados e corrigidos sob demanda.

**Critérios de aceite:**
- [ ] O corretor deve analisar erros sem causar atraso perceptível na digitação do usuário.
- [ ] O dicionário do corretor deve suportar as regras do Novo Acordo Ortográfico da Língua Portuguesa.

**Prioridade:** Alta  
**Complexidade estimada:** Média
