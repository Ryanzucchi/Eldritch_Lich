# NER local e ordenação temporal comprovada

## Contexto

A reauditoria encontrou palavras comuns convertidas em entidades e eventos
ordenados pela ordem em que foram aplicados, não pela data do manuscrito.

## Decisão

O editor pode usar o serviço Stanza executado em `localhost` para NER em
português. O serviço é opcional: sem ele não há chamada remota e a heurística
local conservadora continua disponível. Entidades `MISC` não entram na fila.

Eventos recebem uma chave cronológica somente quando a expressão de data é
inequívoca. Números avulsos continuam sem chave e preservam a ordem editorial.

## Consequências

O primeiro uso do Stanza precisa baixar o modelo de português para um volume
local. Para aplicar a nova versão de extração a uma biblioteca, o autor deve
escolher **Refazer tudo**; fatos já canônicos não são apagados.
