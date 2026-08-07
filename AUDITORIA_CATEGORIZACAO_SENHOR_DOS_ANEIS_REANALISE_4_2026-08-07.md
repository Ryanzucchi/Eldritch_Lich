# Auditoria aprofundada de categorização — reanálise 4

**Dump:** `senhor_dos_aneis_indexeddb (5).json` — exportado em `2026-08-07T18:18:51.979Z`  
**Projeto:** `08579d2f-26d5-4d2f-95d1-e3884eba5dae`  
**Fonte:** `li-2-o-senhor-dos-aneis-j-r-r-tolkien.pdf` (1.514 páginas; 3.230.454 caracteres extraídos para inspeção)  
**Método:** leitura do export completo, varredura textual integral do PDF, confronto de candidatos v5 e inspeção do pipeline. Este relatório não altera o IndexedDB exportado.

## Diagnóstico executivo

A versão `local-evidence-gated-pt-v5` reduziu o último lote para **564** candidatos (559 entidades e 5 relações), mas todos foram promovidos. O acompanhante Stanza não estava ativo no momento dessa execução: todos os candidatos v5 exibem confiança 0,90 e padrão compatível com o fallback de regras, não com NER local (que marca 0,96 e `analysisSource=STANZA_LOCAL`).

| Área | Evidência no dump | Conclusão |
| --- | ---: | --- |
| Dados de universo | 2.531 Wiki; 2.491 fichas de personagem; 835 locais; 319 itens | O acervo inclui legado contaminado de v2–v4 e não deve ser considerado cânone sem remediação. |
| Execução v5 | 564 candidatos, todos `APPLIED` | A redução de volume não equivale a precisão; a aprovação coletiva voltou a propagar ruído. |
| Falsos positivos v5 | `Velho`, `Hobbit`, `Supremo`, `Alguém`, `Escura`, `Cair`, `Leste de Moria` | O fallback ainda aceita palavras genéricas e fragmentos de *span*. |
| Cronologia | 299 eventos; datas inválidas legadas ainda presentes | Os dados legados não são removidos por uma reextração e exigem remediação revisável. |
| Importação | 3 manuscritos ativos com HTML escapado | O quality gate os bloqueia, mas a normalização ainda precisa ser salva pelo autor. |

## Importação e cobertura

- [manuscripts id=`0196e3d4-f456-4c9d-a00a-d0d693dcdeaa`] **O Anel Vai para o Sul** continua com `&lt;p&gt;` no conteúdo. O mesmo ocorre em `prologo` (`08daf1d0-4a85-4413-b44f-26fb8998d825`) e `prefacio` (`7575b03f-9044-4d67-a62e-4b8849a23b0a`). Isso é **E-01/S-01**: esses capítulos ficam fora da análise até a normalização ser salva.
- O PDF possui extração tipográfica com letras separadas em muitas páginas (`E xistem`, `I nterrompeu`). Isso explica nomes e títulos fragmentados no legado; não é evidência para criar entidades.
- O manuscrito em lixeira `Capítulo II — A S` permanece fora da cobertura ativa e não foi usado como fonte.

## Entidades

### Achados do lote v5

- [extractionCandidates v5] `Velho` como personagem: adjetivo em `Grimbeorn, o Velho`; a pessoa é Grimbeorn. **E-02/S-02**.
- [extractionCandidates v5] `Hobbit`, `Supremo` e `Alguém` como personagens: substantivo de espécie, adjetivo/título e pronome indefinido, sem identidade própria. **E-02/S-02**.
- [extractionCandidates v5] `Escura`, `Cinzento`, `Leste de Moria`, `Branca da Cidadela`, `Negro de Mordor` como locais: são fragmentos de sintagmas maiores ou epítetos; o limite da menção não foi preservado. **E-01/S-01 + E-03/S-03**.
- [extractionCandidates v5] `Elfhelm` como organização e `Tar-Palantir` como item: exemplos de classificação por palavra vizinha, sem ligação canônica. **E-03/S-03**.
- A lista também contém pessoas plausíveis (`Frodo`, `Sam`, `Aragorn`, `Gandalf`), mas a presença de um nome plausível não valida os dados preexistentes da mesma string em tabelas divergentes. O dump mantém conflitos históricos de tipo que precisam de fila de remediação, não de fusão automática. **E-04/S-04 + E-08/S-08**.

## Linha do tempo

- Permanecem os eventos inválidos legados: `120` (milhas, id `6bc56f5b-a6f7-4014-afd3-3ccc2ded63f9`), `300` (metros, id `260a4d4e-0e5d-412b-af9e-113243b1ede1`), `365` (duração, ids `16c6a4aa-fe47-4a88-8b34-152e64125d64` e `8e1248cc-6ae5-4e74-bc5e-e40072183756`) e `1936`/`1937` editoriais. **E-05/S-05**.
- Nenhum evento novo v5 foi criado — comportamento preferível a fabricar datas, mas insuficiente para os anais. A extração deve aceitar somente linhas cronológicas estruturadas (ano no começo + predicado narrativo), nunca numeral solto.
- O modelo anterior guardava somente `dateStr` e `sortOrder`; a correção adiciona ano/mês/dia/era/calendário/origem e chave cronológica. Eventos sem data comprovada continuam em ordem editorial.

## Relações e proveniência

- Há uma relação familiar legada; a relação `Tinúviel` → `Rei` usa um título genérico como pessoa e deve entrar na fila de revisão, sem ser exibida como genealogia confiável. **E-10/S-10**.
- Os candidatos v2–v4 permanecem como rastreabilidade histórica. Uma nova execução não deve reutilizá-los nem apagá-los. **E-07/S-07 + E-09/S-09**.

## Correções aplicadas ao código

1. A versão v6 não agrega contextos de todas as ocorrências para “provar” uma entidade: cada ocorrência vota separadamente e empate de tipos é rejeitado.
2. Candidatos do fallback com um token agora exigem duas evidências independentes; palavras funcionais, adjetivos, direções e títulos genéricos entram na lista de bloqueio.
3. A seleção em lote inclui somente NER Stanza local, eventos e relações. Sugestões do fallback por regras aparecem como **revisão manual**.
4. Conflitos existentes de tipo não são mais aceitos quando uma grafia já está contaminada por múltiplas categorias.
5. Anos isolados são reconhecidos apenas na gramática restrita de linha cronológica; medidas, duração e conteúdo editorial continuam recusados.

## Algoritmos e ferramentas avaliados

| Camada | Decisão | Motivo |
| --- | --- | --- |
| NER/POS/dependências | Stanza local | Fornece menções com *spans* e etiquetas de NER, além de POS e dependências, no próprio computador. |
| Dicionário de nomes canônicos | spaCy `EntityRuler`, em etapa posterior | Permite regras de frase/token e aliases controlados; deve complementar, não substituir, NER e revisão. |
| Tempo | HeidelTime em modo narrativo, como próximo serviço local | Normaliza expressões em TIMEX3 e tem recursos em português; o modelo de dados foi preparado antes dessa integração. |
| Resolução de aliases | pós-NER, jamais antes | Evita fundir palavras soltas; `Passolargo` e `Aragorn` só podem ser associados após duas menções de pessoa válidas. |

As fontes técnicas confirmam que Stanza expõe entidades e tags por token, que `EntityRuler` aceita padrões de frase/token e que HeidelTime normaliza expressões temporais por domínio e suporta português: [Stanza NER](https://stanfordnlp.github.io/stanza/ner.html), [spaCy EntityRuler](https://spacy.io/api/entityruler), [HeidelTime](https://github.com/HeidelTime/heideltime).

## Próxima execução segura

1. Iniciar `linguistics`, configurar `NEXT_PUBLIC_LOCAL_LINGUISTICS_URL` e confirmar `/health`.
2. Normalizar e salvar os três manuscritos bloqueados; não analisar texto com HTML escapado.
3. Escolher **Refazer tudo**. O v6 cria candidatos novos e supersede somente pendências antigas.
4. Usar o lote automático apenas para itens marcados **NER local**; revisar os demais individualmente.
5. Exportar outro JSON e executar a auditoria novamente antes de remover ou reclassificar legado.

## Limite deliberado

O relatório não exclui diretamente as 2.531 entradas existentes nem altera o dump: o PDF prova que há registros errados, mas eliminar ou fundir dados canônicos requer uma lista de remediação aprovada. O código agora bloqueia a repetição das causas e prepara a correção reversível do acervo.
