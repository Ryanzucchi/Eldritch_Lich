# Calendário do Projeto

## Responsabilidade

Registra prazos, encontros e ciclos de trabalho locais por projeto. Cada evento pode apontar a um capítulo existente para tornar o planejamento acionável a partir do manuscrito.

## Dados

- Persiste `CalendarEvent` em `calendarEvents` do Dexie por `projectId`.
- Lista capítulos do projeto para o vínculo opcional, guardado na descrição legível do evento.
- Não cria disponibilidade ou membros fictícios automaticamente.
