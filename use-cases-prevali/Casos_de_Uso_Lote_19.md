# Casos de Uso - Lote 19 (UC-181 a UC-190)

Este documento contém a especificação dos casos de uso de 181 a 190 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Associar eventos à facção

**ID:** UC-181  
**Requisito relacionado:** RF-181 (associar eventos à facção)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A facção (organização) e os eventos cronológicos já existem no projeto.  
**Gatilho:** O usuário gerencia as propriedades de filiação de um evento da timeline.  

**Fluxo principal:**
1. O usuário acessa a timeline e clica em editar em um evento.
2. O usuário localiza o campo "Facções Envolvidas/Relacionadas".
3. O sistema abre uma caixa de pesquisa de múltipla escolha com a lista de facções do projeto.
4. O usuário seleciona as facções correspondentes.
5. O usuário clica em "Salvar".
6. O sistema atualiza a tabela de relacionamento entre eventos e facções no banco de dados.
7. O card do evento passa a exibir os mini-brasões das facções associadas.

**Fluxos alternativos:**
- *Filtrar timeline:* O usuário seleciona uma facção e visualiza apenas os eventos em que ela esteve envolvida na timeline geral.

**Fluxos de exceção:**
- *Sem vinculo:* O evento pode permanecer sem vínculos com facções, sendo classificado como evento neutro.

**Pós-condições:** O evento da timeline fica associado às organizações indicadas.

**Critérios de aceite:**
- [ ] A associação deve exibir os mini-brasões correspondentes no card da timeline com resolução nítida.
- [ ] A gravação na tabela de ligação deve demorar menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Visualizar histórico de guerras e tratados

**ID:** UC-182  
**Requisito relacionado:** RF-182 (visualizar histórico de guerras e tratados)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos diplomáticos (guerras e tratados) com facções associadas estão cadastrados na timeline.  
**Gatilho:** O usuário clica em "Histórico de Conflitos" nas opções de uma facção ou seção correspondente.  

**Fluxo principal:**
1. O usuário acessa a página diplomática do projeto ou a ficha técnica de uma facção.
2. O usuário clica na aba "Guerras e Tratados".
3. O sistema busca na timeline todos os eventos categorizados como conflito ou tratado vinculados àquela facção.
4. O sistema exibe uma linha do tempo vertical simplificada contendo apenas os marcos bélicos e acordos de paz em ordem cronológica.
5. O usuário visualiza o histórico condensado e os saldos diplomáticos da facção selecionada.

**Fluxos alternativos:**
- *Mapear perdas territoriais:* O histórico exibe links direcionando para os mapas das regiões ganhas ou perdidas nos respectivos tratados de paz.

**Fluxos de exceção:**
- *Sem conflitos:* Se a facção for neutra e nunca tiver participado de conflitos, o sistema exibe "Histórico pacífico. Nenhuma guerra ou tratado registrado".

**Pós-condições:** O histórico diplomático focado de guerras e tratados da facção é exibido de forma linear na interface.

**Critérios de aceite:**
- [ ] Os eventos bélicos ativos devem ser exibidos com destaque em vermelho e os tratados de paz em verde.
- [ ] A consulta e montagem do histórico de conflitos devem durar menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Cadastrar idiomas fictícios

**ID:** UC-183  
**Requisito relacionado:** RF-183 (cadastrar idiomas fictícios)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está no painel de worldbuilding do projeto.  
**Gatilho:** O usuário clica em "Novo Idioma Fictício / Conlang" no menu de ferramentas.  

**Fluxo principal:**
1. O usuário clica em "Cadastrar Idioma".
2. O sistema abre uma ficha de cadastro solicitando: Nome do Idioma, Código, Família Linguística, Descrição Geral e Regras de Pronúncia.
3. O usuário insere os dados e clica em "Criar".
4. O sistema cria o namespace linguístico e inicializa uma tabela de dicionário vazia vinculada a esse idioma.
5. O idioma passa a constar na barra lateral sob o diretório "Linguística".

**Fluxos alternativos:**
- *Importar dicionário:* O usuário importa uma planilha Excel/CSV contendo uma lista de termos e traduções para popular o dicionário de imediato.

**Fluxos de exceção:**
- *Nome duplicado:* O sistema barra a gravação de dois idiomas com a mesma nomenclatura no mesmo projeto.

**Pós-condições:** O idioma fictício é cadastrado e preparado para receber termos de dicionário.

**Critérios de aceite:**
- [ ] A criação de um idioma fictício deve gerar chaves seguras e isoladas no banco de dados.
- [ ] O cadastro deve carregar em menos de 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
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

---
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

---
### Caso de Uso: Estimar tempo de leitura do texto

**ID:** UC-186  
**Requisito relacionado:** RF-186 (estimar tempo de leitura do texto)  
**Ator(es):** Sistema  
**Pré-condições:** O texto do capítulo possui conteúdo escrito.  
**Gatilho:** O usuário abre um texto ou atualiza o conteúdo do editor.  

**Fluxo principal:**
1. O usuário abre um capítulo no editor.
2. O sistema conta a quantidade total de palavras contidas no corpo do documento.
3. O sistema divide a contagem de palavras pela velocidade média de leitura (ex: 200 palavras por minuto).
4. O sistema calcula o tempo aproximado em minutos.
5. A interface exibe no rodapé do editor a métrica: "Tempo estimado de leitura: ~X min".

**Fluxos alternativos:**
- *Configurar velocidade:* O usuário altera o valor médio de WPM nas configurações de leitura, recalculando as estimativas do projeto.

**Fluxos de exceção:**
- *Texto vazio:* Se o documento estiver em branco, a estimativa exibe "Tempo de leitura: < 1 min".

**Pós-condições:** O indicador de tempo de leitura atualizado é exibido na tela.

**Critérios de aceite:**
- [ ] O recálculo do tempo de leitura deve rodar em background através de um debounce leve para economizar CPU.
- [ ] O tempo estimado deve ser exibido com formatação amigável.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Modo leitura (sem edição, layout limpo)

**ID:** UC-187  
**Requisito relacionado:** RF-187 (modo leitura)  
**Ator(es):** Usuário (Leitor/Escritor)  
**Pré-condições:** O texto do capítulo está cadastrado no projeto.  
**Gatilho:** O usuário clica no botão "Modo Leitura" na barra de ferramentas do editor.  

**Fluxo principal:**
1. O usuário ativa o Modo Leitura.
2. O sistema altera o editor de texto para modo de visualização estático (readOnly).
3. A interface remove barras de ferramentas de formatação e as marcas de cursor piscantes.
4. A folha de texto ganha um espaçamento de margens mais largo e tipografia dedicada para leitura limpa.

**Fluxos alternativos:**
- *Modo Sépia:* O usuário altera as cores de fundo para sépia ou cinza para diminuir a fadiga visual.

**Fluxos de exceção:**
- *Edição concorrente:* Se outro colaborador editar o texto em tempo real enquanto o usuário lê, o texto atualiza na tela de forma silenciosa, sem interromper a rolagem do leitor.

**Pós-condições:** O editor entra em modo de exibição de texto limpo e bloqueia modificações de teclado.

**Critérios de aceite:**
- [ ] O clique em links internos deve continuar ativo no modo leitura para permitir navegar entre capítulos interligados de forma fluida.
- [ ] A re-renderização da tela para o formato livro deve ocorrer em menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Exportar para HTML

**ID:** UC-188  
**Requisito relacionado:** RF-188 (exportar para HTML)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto a ser exportado existe no projeto.  
**Gatilho:** O usuário clica em "Exportar como HTML" no painel de exportações do editor.  

**Fluxo principal:**
1. O usuário abre o capítulo e clica em "Exportar".
2. O usuário seleciona a opção "Página Web (.html)".
3. O sistema converte a estrutura do editor de rich-text para marcação HTML limpa contendo as tags semânticas.
4. O sistema gera um arquivo contendo os cabeçalhos HTML5 adequados e o CSS inline embutido.
5. O navegador inicia o download do arquivo `.html`.

**Fluxos alternativos:**
- *Exportar site estático:* O usuário exporta a pasta inteira. O sistema gera uma árvore contendo múltiplos arquivos HTML interligados por links funcionais.

**Fluxos de exceção:**
- *Mídias locais:* Se o texto contiver imagens anexadas localmente, o sistema as converte e as embute diretamente no HTML usando Base64.

**Pós-condições:** O arquivo HTML independente com o texto formatado é baixado pelo usuário.

**Critérios de aceite:**
- [ ] O código HTML gerado deve passar nas validações básicas de sintaxe HTML5.
- [ ] O tempo total de compilação da página estática deve ser menor que 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Exportar para Markdown

**ID:** UC-189  
**Requisito relacionado:** RF-189 (exportar para Markdown)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto a ser exportado existe e possui conteúdo.  
**Gatilho:** O usuário clica em "Exportar como Markdown" nas opções do editor.  

**Fluxo principal:**
1. O usuário abre o capítulo e clica em "Exportar".
2. O usuário escolhe o formato "Markdown (.md)".
3. O sistema converte a formatação do editor para sintaxe Markdown correspondente.
4. O sistema monta o arquivo de texto bruto com a extensão `.md`.
5. O navegador inicia o download do arquivo de forma automática.

**Fluxos alternativos:**
- *Preservar Wiki-links:* O usuário ativa a flag de exportação de wiki-links, convertendo links internos do projeto no formato `[[Nome do Arquivo]]`.

**Fluxos de exceção:**
- *Tabelas complexas:* O sistema converte tabelas do texto para o formato de tabelas GFM (GitHub Flavored Markdown).

**Pós-condições:** O arquivo em texto puro estruturado em Markdown (.md) é gerado e baixado.

**Critérios de aceite:**
- [ ] O arquivo exportado deve utilizar codificação UTF-8 para reter acentuações e caracteres especiais da língua portuguesa.
- [ ] A conversão e download devem demorar menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Exportar para TXT

**ID:** UC-190  
**Requisito relacionado:** RF-190 (exportar para TXT)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto existe no projeto.  
**Gatilho:** O usuário clica em "Exportar como Texto Puro (.txt)" no menu.  

**Fluxo principal:**
1. O usuário seleciona o capítulo e escolhe "Exportar como Texto Puro (.txt)".
2. O sistema lê o conteúdo do editor, remove todas as formatações ricas (negrito, itálico, cores, marcadores) e retém apenas o texto bruto.
3. O sistema cria o arquivo com a extensão `.txt` contendo a codificação UTF-8.
4. O navegador inicia o download do arquivo.

**Fluxos alternativos:**
- *Exportar livro em TXT:* O sistema concatena todos os textos em um único arquivo, inserindo o título do capítulo no início de cada divisão.

**Fluxos de exceção:**
- *Mídias no texto:* As imagens e blocos de mídia são ignorados do arquivo TXT, substituídos por uma marcação sutil indicando a presença da mídia.

**Pós-condições:** O arquivo em texto puro sem formatações (.txt) é gerado e baixado pelo usuário.

**Critérios de aceite:**
- [ ] O arquivo final deve ser codificado em UTF-8 e possuir quebras de linha legíveis.
- [ ] O tempo total de exportação de um capítulo de tamanho padrão em TXT deve ser de no máximo 200ms.

---

## Tabela Resumo: Lote 19 (UC-181 a UC-190)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-181** | RF-181 (associar eventos à facção) | Média | Baixa |
| **UC-182** | RF-182 (visualizar histórico de guerras...) | Média | Média |
| **UC-183** | RF-183 (cadastrar idiomas fictícios) | Média | Baixa |
| **UC-184** | RF-184 (traduzir para idioma fictício) | Média | Média |
| **UC-185** | RF-185 (gerador de nomes conlang) | Média | Média |
| **UC-186** | RF-186 (estimar tempo de leitura) | Média | Baixa |
| **UC-187** | RF-187 (modo leitura) | Média | Baixa |
| **UC-188** | RF-188 (exportar para HTML) | Média | Baixa |
| **UC-189** | RF-189 (exportar para Markdown) | Média | Baixa |
| **UC-190** | RF-190 (exportar para TXT) | Alta | Baixa |
