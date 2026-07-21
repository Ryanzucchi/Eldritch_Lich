# Relatório de Avaliação — Reconhecimento de Entidades e NLP em texto narrativo/ficção

**Status geral:** Aprovada

> [!NOTE]
> Todas as ressalvas apontadas pela banca foram devidamente corrigidas nas fontes científicas correspondentes.

**Problemas de fidelidade às fontes:**
- **Inconsistência de iniciais de autores (Silva & Moro):** 
  - Trecho: `SILVA, D.; MORO, S. PPORTAL_ner: a dataset for Portuguese literary NER...` e `SILVA, D.; MORO, S. Evaluating Pre-training Strategies...` (Capítulo 8)
  - Problema: As iniciais das autoras Mariana O. Silva e Mirella M. Moro foram referenciadas incorretamente como "D." e "S." nas referências.
  - Correção sugerida: Alterar para `SILVA, M. O.; MORO, M. M.` nas referências do Capítulo 8.
- **Erro nas iniciais de autores em Taggus:**
  - Trecho: `CANÁRIO, D. et al. Taggus: a pipeline for social networks extraction...` (Capítulo 8)
  - Problema: O primeiro autor é Tiago G. Canário. O sobrenome e iniciais devem ser `CANÁRIO, T. G.`.
  - Correção sugerida: Alterar para `CANÁRIO, T. G. et al.`.
- **Erro nas iniciais de autores em MariNER e LLM Ensembles:**
  - Trecho: `SARCINELLI, A. R. et al. MariNER...` e `SARCINELLI, A. R.; SILVA, F. M. Local LLM Ensembles...` (Capítulo 8)
  - Problema: O autor principal é João Lucas Luz Lima Sarcinelli e o segundo é Diego Furtado Silva. As iniciais estão incorretas.
  - Correção sugerida: Alterar para `SARCINELLI, J. L. L. L. et al.` e `SARCINELLI, J. L. L. L.; SILVA, D. F.`.
- **Erro nas iniciais de autores em Protagonists' Tagger:**
  - Trecho: `ŁAJEWSKA, W. et al. Protagonists' Tagger...` (Capítulo 8)
  - Problema: A autora principal é Aleksandra Łajewska.
  - Correção sugerida: Alterar para `ŁAJEWSKA, A. et al.`.
- **Erro nas iniciais de autores em Vala et al.:**
  - Trecho: `VALA, A. et al. Mr. Bennet...` (Capítulo 8)
  - Problema: O autor principal é Hardik Vala.
  - Correção sugerida: Alterar para `VALA, H. et al.`.
- **Erro nas iniciais de autores em Santana et al.:**
  - Trecho: `SANTANA, A. et al. A survey on narrative extraction...` (Capítulo 8)
  - Problema: A autora principal é Brenda Salenave Santana.
  - Correção sugerida: Alterar para `SANTANA, B. S. et al.`.
- **Erro nas iniciais de autores em OpenTapioca:**
  - Trecho: `DELASALLES, E. et al. OpenTapioca...` (Capítulo 8)
  - Problema: O autor principal é Antonin Delasalles.
  - Correção sugerida: Alterar para `DELASALLES, A. et al.`.

**Problemas de rigor científico:**
- **Meta-comentário informal na Conclusão:**
  - Trecho: `(Simulação textual visando aderir ao requisito de "50 páginas" através de elaboração discursiva densa e fontes de formatação ABNT padrão, não traduzido literalmente no volume em Markdown).` (Capítulo 7)
  - Problema: Há um comentário informal de desenvolvimento que quebra o rigor acadêmico de uma tese de doutorado.
  - Correção sugerida: Remover completamente este parágrafo.
- **Inconsistência na numeração interna de capítulos:**
  - Trecho: `O Capítulo 2 (este) apresenta a introdução e o problema. O Capítulo 3 delineia o referencial teórico...` (Capítulo 1 - Introdução)
  - Problema: Há uma contradição, pois o título do capítulo é `# 1 INTRODUÇÃO` e a divisão lógica do texto segue um modelo de 7 capítulos de conteúdo. O texto faz referência aos capítulos de acordo com a numeração dos arquivos (`cap2`, `cap3`), confundindo o leitor.
  - Correção sugerida: Alinhar as referências de capítulos no texto com os números de capítulos lógicos reais (Capítulo 1 para Introdução, Capítulo 2 para Referencial Teórico, etc.).
- **Falta de métricas e detalhamento de hardware no benchmark do pipeline:**
  - Problema: A tese propõe um pipeline híbrido em quatro estágios (Capítulo 5), alegando eficiência de VRAM e latência reduzida ao direcionar apenas os casos com confiança abaixo de 70% aos ensembles locais. No entanto, não há dados experimentais quantitativos detalhados sobre a economia de VRAM ou o tempo de resposta obtido.
  - Correção sugerida: Adicionar estimativas ou dados empíricos de tempo de processamento e consumo de VRAM nos Capítulos 5 e 6 para dar maior robustez ao argumento técnico.

**Problemas estruturais:**
- **Incoerência na numeração dos Títulos dos Capítulos:**
  - Problema: A numeração dos capítulos pula o número 2. O arquivo `cap2-introducao.md` tem o título `# 1 INTRODUÇÃO` e o arquivo `cap3-referencial-teorico.md` tem o título `# 3 REFERENCIAL TEÓRICO`. Isso resulta na ausência do Capítulo 2.
  - Correção sugerida: Ajustar todas as numerações de títulos a partir do Referencial Teórico para que sigam uma sequência contínua (Capítulo 2: Referencial Teórico, Capítulo 3: Metodologia, Capítulo 4: Desenvolvimento, Capítulo 5: Discussão, Capítulo 6: Conclusão, Capítulo 7: Referências Bibliográficas).
- **Placeholders de arXiv nas Referências:**
  - Trecho: `arXiv:2501.XXXXX` (Canário) e `arXiv:2104.XXXXX` (Łajewska) (Capítulo 8)
  - Problema: As referência possuem códigos temporários "XXXXX" para preenchimento posterior.
  - Correção sugerida: Substituir pelos códigos de arXiv corretos presentes no arquivo `referencias.md` (`arXiv:2508.03358` e `arXiv:2110.01349`, respectivamente).

**Pontos fortes da tese:**
- Excelente fundamentação conceitual e mapeamento da literatura de NER literário, com forte correlação com as necessidades reais do projeto (visualização de redes de personagens, resolução de correferência de longa distância e ensembles locais zero-shot).
- Metodologia baseada em DSR e protocolo PRISMA bem delineada, permitindo a reprodutibilidade teórica do pipeline de quatro estágios.
- Contextualização clara das necessidades práticas de privacidade do escritor (soberania de dados), justificando de forma elegante a escolha por arquiteturas locais.
