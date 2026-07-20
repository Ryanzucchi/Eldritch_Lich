# Mapeamento de Metas de Escrita

O módulo de **Metas de Escrita** monitora a produtividade e constância do escritor em tempo real, calculando cotas diárias de palavras e gerenciando a sequência (streak) de dias de escrita ativa com proteção de dias de folga.

## Responsabilidades
1.  **Cálculo de Cotas**:
    *   **Metas Diárias**: Cota de palavras fixa inserida pelo usuário.
    *   **Metas com Prazo**: Calcula dinamicamente as palavras necessárias por dia com base nas palavras restantes e nos dias que faltam até a data limite (`calculateDailyQuota`).
2.  **Sequência de Escrita (Streak)**:
    *   Incrementa a sequência ao atingir a cota mínima de 200 palavras no dia (`calculateStreak`).
    *   Preserva a sequência mesmo que o autor fique dias sem escrever, desde que esses dias estejam definidos no painel de folga do autor (ex: finais de semana).
3.  **Visualização e Retorno**:
    *   Contador dinâmico de palavras na sessão.
    *   Barra de progresso de escrita no rodapé do editor principal (`EditorComponent.tsx`).
    *   Animação comemorativa visual ao atingir 100% da cota do dia.

## Componentes Importantes
*   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/metrics/types.ts) - Interfaces `WritingGoal`, `WritingLog` e `WritingStreak`.
*   [streak-calculator.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/metrics/streak-calculator.ts) - Algoritmo de cálculo de streaks e cotas de prazo.
*   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) - Integração da barra de progresso diária e modal de metas com o TipTap.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) - Criação das tabelas no Dexie DB sob a versão 2 do banco local.
