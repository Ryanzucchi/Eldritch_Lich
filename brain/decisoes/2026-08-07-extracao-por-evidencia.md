# Extração por evidência, não por capitalização

## Decisão

A extração local usa a heurística `evidence-gated-pt-v4`. Ela gera entidades apenas quando há padrão textual explícito compatível com o tipo e bloqueia a promoção quando o nome já possui outro tipo canônico no projeto.

## Motivo

As auditorias do projeto Senhor dos Anéis demonstraram que recorrência e letra maiúscula promoviam conectivos, verbos, locais e itens a personagens. A seleção em lote é útil somente depois que a fila já contém candidatos elegíveis.

## Consequências

- A cobertura inicial é deliberadamente menor, mas os candidatos passam a ter evidência verificável.
- Dados legados não são apagados automaticamente; devem passar pela remediação revisável indicada na auditoria.
- Um lote antigo ou abaixo da evidência mínima não pode voltar a criar dados canônicos.
