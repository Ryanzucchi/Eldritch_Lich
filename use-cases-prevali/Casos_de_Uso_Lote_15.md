# Casos de Uso - Lote 15 (UC-141 a UC-150)

Este documento contém a especificação dos casos de uso de 141 a 150 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Modo foco / tela sem distrações

**ID:** UC-141  
**Requisito relacionado:** RF-141 (modo foco / tela sem distrações)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O editor de texto está aberto.  
**Gatilho:** O usuário clica no botão "Modo Foco" na barra de status ou pressiona o atalho F11 (ou Ctrl+Shift+F).  

**Fluxo principal:**
1. O usuário ativa o Modo Foco.
2. O sistema esconde instantaneamente todos os elementos periféricos da interface: barra de arquivos lateral, painel de metadados, cabeçalhos de navegação e rodapés.
3. O editor de texto se expande para ocupar 100% da tela, centralizando o bloco de texto.
4. O sistema entra em modo de tela cheia do navegador (Fullscreen API).
5. O usuário digita em um ambiente visual limpo.

**Fluxos alternativos:**
- *Foco em Linha:* O usuário ativa a opção correspondente. O sistema esmaece em 80% todos os parágrafos do documento, exceto o parágrafo em que o cursor está ativo no momento.

**Fluxos de exceção:**
- *Fullscreen bloqueado:* Se a política do navegador impedir a tela cheia automática, o sistema oculta os painéis internos mantendo a página no tamanho normal da janela atual, exibindo uma instrução de suporte.

**Pós-condições:** A interface fica simplificada e livre de menus distrativos.

**Critérios de aceite:**
- [ ] Ao pressionar 'Esc' ou clicar no ícone de fechar flutuante, a interface deve restaurar todos os painéis e sair do modo tela cheia.
- [ ] A ocultação de painéis no Modo Foco não deve redefinir o estado de arquivos abertos ou a posição do cursor.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Atalhos de teclado personalizáveis

**ID:** UC-142  
**Requisito relacionado:** RF-142 (atalhos de teclado personalizáveis)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O menu de configurações gerais está acessível.  
**Gatilho:** O usuário acessa "Configurações" -> "Atalhos de Teclado".  

**Fluxo principal:**
1. O usuário abre a tabela de atalhos de teclado configurados no sistema.
2. O sistema exibe a lista de comandos e suas respectivas teclas de atalho.
3. O usuário clica em "Editar" no comando desejado (ex: "Modo Foco").
4. O sistema exibe o prompt de captura de teclas.
5. O usuário pressiona a combinação (ex: `Ctrl+Alt+F`) no teclado físico.
6. O sistema captura a combinação (verificando conflitos com outros comandos) e grava o novo mapeamento no banco de dados de preferências.
7. O novo atalho passa a comandar a ação correspondente.

**Fluxos alternativos:**
- *Restaurar padrões:* O usuário clica em "Restaurar Atalhos Padrão" para resetar todas as associações de teclas do sistema.

**Fluxos de exceção:**
- *Combinação reservada:* Se o usuário tentar mapear um atalho bloqueado pelo próprio navegador ou SO, o sistema impede a gravação e notifica sobre a impossibilidade.

**Pós-condições:** Os atalhos de teclado são atualizados de acordo com a preferência do usuário.

**Critérios de aceite:**
- [ ] O sistema de captura de atalhos deve suportar teclas modificadoras (`Ctrl`, `Alt`, `Shift`, `Cmd` no macOS).
- [ ] A reatribuição de teclas deve ser validada instantaneamente contra colisões com outros atalhos.

**Prioridade:** Baixa  
**Complexidade estimada:** Média  

---
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

---
### Caso de Uso: Detectar excesso de repetição de palavras (estilo)

**ID:** UC-144  
**Requisito relacionado:** RF-144 (detectar excesso de repetição de palavras)  
**Ator(es):** Sistema  
**Pré-condições:** O texto ativo possui conteúdo no editor.  
**Gatilho:** O usuário clica na aba "Estilo / Repetição de Palavras" ou salva o documento.  

**Fluxo principal:**
1. O usuário aciona a ferramenta de "Análise de Repetições".
2. O sistema analisa a proximidade de termos idênticos ou com o mesmo lema em um intervalo próximo (janela de palavras).
3. O sistema destaca visualmente no texto as palavras repetidas com um sublinhado cinza.
4. Na barra lateral de ferramentas, o sistema exibe o mapa de termos repetidos com sugestões de sinônimos contextualizados.
5. O usuário clica em um sinônimo sugerido para realizar a substituição no editor.

**Fluxos alternativos:**
- *Filtro de stopwords:* O sistema ignora automaticamente pronomes, artigos e conjunções comuns na análise de repetição.

**Fluxos de exceção:**
- *Repetições intencionais:* O escritor clica em "Ignorar para esta palavra" para remover os alertas em casos de figuras de linguagem.

**Pós-condições:** As palavras com repetição excessiva em trechos contíguos são sinalizadas.

**Critérios de aceite:**
- [ ] A análise de proximidade deve calcular a densidade de ocorrência do termo em janelas móveis de 100 a 200 palavras.
- [ ] O tempo total de mapeamento estético em um texto de 2.000 palavras deve ser inferior a 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Analisar ritmo/pacing do texto

**ID:** UC-145  
**Requisito relacionado:** RF-145 (analisar ritmo/pacing do texto)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto do capítulo está escrito.  
**Gatilho:** O usuário solicita a "Análise de Ritmo (Pacing)".  

**Fluxo principal:**
1. O usuário abre o menu de ferramentas estilísticas e clica em "Análise de Ritmo".
2. O sistema envia o texto para processamento de métricas.
3. A IA calcula a densidade de orações (tamanho de frases), proporção de verbos de ação contra verbos estáticos, e diálogos contra trechos descritivos.
4. O sistema gera um gráfico de ondas na interface representando a variação de ritmo ao longo do texto (ritmo rápido vs lento).
5. O usuário navega pelo gráfico para identificar trechos que possam estar cansativos ou rápidos demais.

**Fluxos alternativos:**
- *Sugestões de pacing:* O sistema sugere onde inserir quebras de frases para acelerar uma cena lenta ou onde detalhar mais para desacelerar.

**Fluxos de exceção:**
- *Estrutura de frases atípica:* Em poesias, o sistema avisa que as métricas padrão de ritmo de prosa podem não se aplicar adequadamente.

**Pós-condições:** O mapa gráfico do ritmo narrativo do texto é exibido para o usuário.

**Critérios de aceite:**
- [ ] O gráfico de pacing deve correlacionar os pontos do eixo X diretamente com a barra de rolagem e parágrafos correspondentes no editor.
- [ ] O tempo de cálculo e renderização da onda de ritmo de um arquivo de 5.000 palavras deve ser de no máximo 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Detectar variações de nome do mesmo personagem

**ID:** UC-146  
**Requisito relacionado:** RF-146 (detectar variações de nome do mesmo personagem)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Personagens estão catalogados com seus nomes oficiais nas fichas de entidades.  
**Gatilho:** Salvamento do texto ou acionamento de checagem.  

**Fluxo principal:**
1. O sistema analisa o texto em background em busca de menções que lembrem apelidos ou variações ortográficas dos nomes de personagens (ex: encontra "Ze" e o personagem é "José").
2. A IA calcula o contexto semântico e a presença de outros personagens na cena para identificar se refere-se ao mesmo personagem.
3. O sistema exibe um relatório com as correspondências sugeridas.
4. O usuário clica sobre a sugestão para cadastrar a variação como apelido oficial ou para substituir os termos nos capítulos.

**Fluxos alternativos:**
- *Mapear apelidos novos:* A IA sugere "Adicionar apelido nas fichas de entidades". O usuário aceita e a ficha correspondente é atualizada.

**Fluxos de exceção:**
- *Homônimos reais:* Se existir outro personagem na história com o apelido detectado, o usuário descarta o alerta para evitar associação incorreta.

**Pós-condições:** As variações de nomenclatura de um mesmo personagem são mapeadas no banco de aliases da entidade.

**Critérios de aceite:**
- [ ] A IA deve considerar regras linguísticas de derivação de apelidos em português brasileiro (ex: "Francisco" -> "Chico").
- [ ] A precisão de mapeamento de aliases de personagens deve ser de no mínimo 85%.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Sugerir fusão de entidades semelhantes automaticamente

**ID:** UC-147  
**Requisito relacionado:** RF-147 (sugerir fusão de entidades semelhantes automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Múltiplas entidades estão cadastradas de forma independente no projeto.  
**Gatilho:** Execução periódica de rotina de limpeza de dados em background ou carregamento do Dashboard.  

**Fluxo principal:**
1. A IA analisa o banco de dados de entidades mapeando atributos (descrição física, nascimento, relacionamentos e nomes).
2. A IA identifica duas fichas distintas com alto índice de similaridade (ex: "Lorde Baelish" e "Petyr Baelish").
3. O sistema insere um alerta na barra de ferramentas sugerindo a fusão devido à semelhança de atributos.
4. O usuário clica no alerta e abre a tela de conciliação e fusão de dados.
5. O usuário aprova e executa a fusão.

**Fluxos alternativos:**
- *Fusão de locais:* O sistema identifica locais semelhantes (ex: "Winterfell" e "Castelo de Winterfell") e sugere a consolidação no mapa e diretórios de forma equivalente.

**Fluxos de exceção:**
- *Gêmeos ou homônimos reais:* Se o escritor sinalizar que as entidades são propositalmente distintas, clica em "Não sugerir fusão para estas entidades novamente".

**Pós-condições:** Fichas duplicadas identificadas são fundidas otimizando os dados estruturados do projeto.

**Critérios de aceite:**
- [ ] O algoritmo de sugestão de fusão deve usar distância Levenshtein para nomes e similaridade vetorial para descrições.
- [ ] A rotina de busca de duplicados deve rodar em background de forma silenciosa e leve.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Analisar arco emocional do texto por capítulo

**ID:** UC-148  
**Requisito relacionado:** RF-148 (analisar arco emocional do texto por capítulo)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto do capítulo possui conteúdo escrito e a IA de análise de sentimento está ativa.  
**Gatilho:** O usuário seleciona a aba "Gráfico Emocional" do capítulo.  

**Fluxo principal:**
1. O usuário clica na aba de análise de sentimento do capítulo.
2. O sistema divide o texto do capítulo em parágrafos e envia cada trecho para um pipeline de IA de classificação emocional.
3. O sistema calcula a trajetória das emoções ao longo do texto.
4. O sistema renderiza um gráfico de linha temporal de sentimentos, onde o eixo X representa os parágrafos do texto e o eixo Y representa a valência emocional.
5. O usuário visualiza as transições de tom do capítulo.

**Fluxos alternativos:**
- *Múltiplos capítulos:* O usuário seleciona uma pasta de arco narrativo completo e visualiza o arco emocional consolidado do livro inteiro por capítulo.

**Fluxos de exceção:**
- *Textos sem carga dramática:* Em textos puramente de Worldbuilding sem carga dramática, o gráfico é exibido linear e predominantemente como "Neutro".

**Pós-condições:** O gráfico do arco de sentimento do capítulo é apresentado ao usuário.

**Critérios de aceite:**
- [ ] O sistema de análise de sentimento deve ser calibrado para reconhecer nuances literárias como ironia e descrições poéticas melancólicas.
- [ ] O processamento do arco de sentimento do capítulo deve ser executado em menos de 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Mapear arco de desenvolvimento de personagem

**ID:** UC-149  
**Requisito relacionado:** RF-149 (mapear arco de desenvolvimento de personagem)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** Personagens e cenas estão vinculados no banco de dados.  
**Gatilho:** O usuário abre o painel do personagem e seleciona "Visualizar Arco de Desenvolvimento".  

**Fluxo principal:**
1. O usuário abre o perfil de um personagem e clica em "Arco do Personagem".
2. O sistema identifica todos os capítulos onde o personagem é citado e lê as valências de conflito registradas.
3. A IA compõe o mapeamento da jornada do personagem (ex: mapeia alteração de traços de personalidade).
4. O sistema exibe um gráfico de linha do tempo de desenvolvimento, exibindo marcos de mudança de atributos, perdas/ganhos de itens ou relacionamentos.
5. O usuário clica em um ponto do gráfico para abrir a descrição da cena responsável pela mudança.

**Fluxos alternativos:**
- *Edição manual:* O usuário desenha os pontos de inflexão do personagem manualmente no gráfico de arco para servir de roteiro de planejamento.

**Fluxos de exceção:**
- *Personagem não citado:* Se o personagem foi cadastrado mas não aparece nos textos, o sistema exibe "Nenhuma atividade de escrita registrada para este personagem".

**Pós-condições:** O arco de desenvolvimento e transformação do personagem ao longo do enredo é exibido de forma visual.

**Critérios de aceite:**
- [ ] O gráfico deve apresentar a jornada clássica do personagem correlacionada com a linha do tempo geral do projeto.
- [ ] O tempo de cálculo e renderização do arco de desenvolvimento deve ser de no máximo 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Marcar papel narrativo (protagonista, antagonista, secundário)

**ID:** UC-150  
**Requisito relacionado:** RF-150 (marcar papel narrativo)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O personagem está catalogado na base de entidades.  
**Gatilho:** O usuário acessa as propriedades de classificação na ficha de um personagem.  

**Fluxo principal:**
1. O usuário abre o perfil do personagem.
2. O usuário clica no seletor de campo "Papel Narrativo".
3. O sistema apresenta as opções em dropdown: "Protagonista", "Antagonista", "Secundário", "Coadjuvante" ou "Figurante".
4. O usuário seleciona "Antagonista" e confirma.
5. O sistema grava o papel na tabela de atributos do personagem no banco de dados.
6. O sistema atualiza o ícone visual ou a moldura do personagem no diretório lateral e no Grafo de Entidades.

**Fluxos alternativos:**
- *Filtro no Grafo:* O usuário pode filtrar o grafo de relacionamentos para exibir apenas as conexões entre "Protagonistas" e "Antagonistas", ocultando os secundários.

**Fluxos de exceção:**
- *Sem papel definido:* Por padrão, ao cadastrar um personagem, o sistema o classifica inicialmente como "Secundário" até que o usuário altere manualmente.

**Pós-condições:** O papel do personagem na estrutura dramática da história é salvo e refletido nos componentes visuais.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a nova classificação e disparar a re-renderização visual do card do personagem em até 100ms.
- [ ] A alteração de papel deve atualizar a indexação estatística do dashboard do projeto.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---

## Tabela Resumo: Lote 15 (UC-141 a UC-150)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-141** | RF-141 (modo foco / sem distrações) | Média | Baixa |
| **UC-142** | RF-142 (atalhos de teclado personalizáveis) | Baixa | Média |
| **UC-143** | RF-143 (corretor ortográfico/gramatical) | Alta | Média |
| **UC-144** | RF-144 (detectar repetição de palavras) | Média | Média |
| **UC-145** | RF-145 (analisar ritmo/pacing do texto) | Média | Alta |
| **UC-146** | RF-146 (detectar variações de nomes...) | Alta | Alta |
| **UC-147** | RF-147 (sugerir fusão de entidades...) | Média | Alta |
| **UC-148** | RF-148 (analisar arco emocional...) | Média | Alta |
| **UC-149** | RF-149 (mapear arco de personagem) | Média | Alta |
| **UC-150** | RF-150 (marcar papel narrativo) | Alta | Baixa |
