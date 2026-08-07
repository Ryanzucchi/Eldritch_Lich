# Candidatos de extração antes do cânone

## Contexto

Uma extração baseada apenas em palavras iniciadas por maiúscula promoveu verbos, locais e objetos a personagens e reaplicou lotes em massa. A auditoria do projeto Senhor dos Anéis mostrou que a validação posterior não protege o universo se os dados já foram gravados como canônicos.

## Decisão

Toda extração de manuscrito passa a criar registros `extractionCandidates` com evidência, confiança, versão de heurística e `fingerprint`. Eles permanecem `PENDING` até a seleção explícita do usuário. A promoção posterior é tipada: personagens, locais, itens, organizações e criaturas são gravados nas tabelas próprias; eventos exigem contexto temporal explícito.

## Consequências

- O recall inicial é deliberadamente mais conservador, priorizando precisão e reversibilidade.
- Reanalisar o mesmo texto não cria uma segunda aplicação, pois o fingerprint é idempotente.
- Registros históricos permanecem em `automationHistories`; candidatos são a fonte de decisão revisável.
