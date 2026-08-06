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
4.  **Produtividade por Colaborador (UC-201)**:
    *   O painel de estatísticas (`/stats`) agrega o histórico de snapshots por autor para exibir palavras adicionadas por período, horários de maior atividade e capítulos com maior contribuição.
    *   Em projetos privados, o relatório é automaticamente reduzido ao autor atual ("Você"), evitando seleção de terceiros.
5.  **Exportação de Métricas (UC-202)**:
    *   Exportação de relatório em **CSV** (dados brutos tabulados) e **PDF** (resumo consolidado + tabelas de produtividade) diretamente do dashboard de estatísticas.
    *   O exportador segue a mesma estratégia local-first do editor: geração no navegador sem round-trip obrigatório ao backend.
6.  **Metas Coletivas de Equipe (UC-203, UC-204)**:
    *   Criação de metas de produtividade coletiva por projeto com campos de nome, contribuição alvo por membro, prazo e opção de ranking.
    *   Acompanhamento de progresso agregado com barra percentual global, alerta a partir de 90% e leaderboard opcional de contribuição individual.
    *   Em projetos sem colaboradores ativos, a criação da meta coletiva é bloqueada com orientação explícita para meta individual.
7.  **Assinatura de estilo (UC-410, parcial)**:
    *   O dashboard calcula TTR, palavras por frase e uma taxa lexical aproximada de modificadores para cada capítulo ativo.
    *   A leitura atual é intra-projeto; comparação interprojetos e série temporal de estilo continuam pendentes.

## Componentes Importantes
*   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/metrics/types.ts) - Interfaces `WritingGoal`, `WritingLog` e `WritingStreak`.
*   [streak-calculator.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/metrics/streak-calculator.ts) - Algoritmo de cálculo de streaks e cotas de prazo.
*   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) - Integração da barra de progresso diária e modal de metas com o TipTap.
*   [stats/page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/stats/page.tsx) - Dashboard com métricas globais, análise por colaborador e exportação CSV/PDF.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) - Criação das tabelas no Dexie DB sob a versão 2 do banco local.
