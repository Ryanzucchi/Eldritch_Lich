# Execuções versionadas da extração

## Decisão

O comando de análise de manuscritos sempre pede ao autor que escolha entre adicionar novidades e refazer tudo. Cada execução recebe `runId`, `sourceHash`, `baseFingerprint` e um `fingerprint` versionado.

## Motivo

Resultados de versões ou conteúdos diferentes não podem se misturar na mesma fila de revisão. Ao mesmo tempo, uma reanálise não pode apagar fichas, eventos ou relações que o autor já confirmou.

## Consequências

- `ADD` reaproveita o resultado equivalente já existente e só apresenta novidades.
- `REBUILD` marca candidatos pendentes/pendentes de decisão anteriores como `SUPERSEDED` e gera uma fila nova para todos os manuscritos.
- Dados aplicados permanecem rastreáveis com estado `APPLIED`; não são excluídos pela reanálise.
- A seleção inicial da interface é vazia e a aplicação requer confirmação explícita.
