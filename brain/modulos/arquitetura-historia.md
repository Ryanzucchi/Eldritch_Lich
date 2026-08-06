# Arquitetura da História

## Responsabilidade

Organiza capítulos reais do projeto em atos ou arcos narrativos escolhidos pelo autor. Não cria uma Jornada do Herói nem uma estrutura de três atos por padrão.

## Dados e dependências

- Lê `manuscripts` do Dexie e filtra pelo projeto ativo.
- Persiste a composição de cada ato em `storyActs.sceneIds`.
- A barra de contexto do projeto expõe a contagem de capítulos e palavras a este e aos demais módulos do workspace.

## Decisão

A estrutura deve partir do manuscrito existente. Modelos podem ser criados pelo autor como atos nomeados, mas não são semeados automaticamente como se fossem fatos da obra.
