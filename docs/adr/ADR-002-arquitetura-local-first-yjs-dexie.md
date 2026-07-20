# ADR 002: Arquitetura Local-First (Yjs + IndexedDB/Dexie)

## Status
Aprovado

## Data
20 de julho de 2026

## Contexto
Escrever romances longos exige estabilidade e garantias absolutas de que nenhum progresso seja perdido devido a quedas de conexão de internet ou travamentos de servidor. Além disso, a privacidade de autoria humana local é um pilar do produto.

## Decisão
Implementaremos uma arquitetura **local-first** na aplicação web. O navegador do usuário será o repositório primário de verdade para os dados.
- O editor de texto rico será baseado no **Tiptap/ProseMirror**.
- O estado colaborativo de texto e metadados usará **Yjs** (CRDT) para garantir convergência automática.
- O storage local no navegador usará o IndexedDB encapsulado pela biblioteca **Dexie.js** e o provedor **y-indexeddb** para persistir deltas atômicos de escrita local.
- A sincronização com a API central ocorrerá em background de forma assíncrona usando WebSockets.

## Consequências
* **Positivas:**
  * Edição 100% offline nativa. O autor pode carregar a página e continuar escrevendo sem internet.
  * Perda de dados reduzida a zero em caso de pane do navegador (autosave persistido via IndexedDB a cada caractere).
  * Menor consumo e dependência de banda de rede do servidor central.
* **Negativas:**
  * A lógica de resolução de conflitos de metadados complexos precisa ser tratada via CRDTs estruturados (`Y.Map` e `Y.Array`).
  * Dependência de cota de armazenamento local do navegador do usuário.
