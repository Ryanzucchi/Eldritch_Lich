# Módulo de Lembretes & Alertas Causa-Temporais

Este módulo implementa o agendamento de lembretes e notificações para o autor (escritor), mantendo o fluxo produtivo organizado sob regras cronológicas e vinculação de documentos.

## Responsabilidades

1.  **Agendamento Offline-First (UC-116)**:
    *   Persiste lembretes no banco IndexedDB local sob a tabela `reminders` (esquema Dexie versão 10).
    *   Campos salvos: texto da nota, data e hora programadas (`alertTime`), nível de importância (`LOW`, `MEDIUM`, `HIGH`), status lido/não lido (`isRead`) e referência a um manuscrito opcional (`manuscriptId`).
2.  **Motor de Monitoramento Temporizado**:
    *   Um loop em segundo plano no `ClientLayout.tsx` varre o banco a cada 5 segundos buscando lembretes não lidos cujas datas/horas programadas já passaram.
    *   Exibe um card de alerta pop-up animado na viewport principal do usuário com opção de marcar como lido ou adiar por 5 minutos (função snooze).
3.  **Barra Lateral de Lembretes (Notificações Recentes)**:
    *   Disponibiliza um painel lateral retrátil a partir de um botão com o ícone de Sino (🔔) na topbar global. O sino exibe um badge numérico reativo com a quantidade de notificações não lidas.
    *   O painel permite visualizar o histórico completo de lembretes, adicionar novos lembretes vinculados ou não ao capítulo em edição no momento, adiá-los ou excluí-los permanentemente.
4.  **Vinculação e Atalho de Navegação**:
    *   Se o lembrete estiver associado a um capítulo específico (manuscrito), o alerta e a listagem exibem um hyperlink "📄 Acessar Capítulo Vinculado" que redireciona o usuário diretamente para a edição correspondente no editor TipTap.

## Componentes Importantes
*   [ClientLayout.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/components/ClientLayout.tsx) - Toolbar do topo (Bell button), barra lateral de lembretes, formulário de cadastro rápido de alerta e o modal flutuante de lembrete vencido com ações de snooze/read.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) - Definição da tabela `reminders` na versão 10 do IndexedDB Dexie.
