# Eldritch Lich - Base de Conhecimento (/brain)

Bem-vindo à base de conhecimento ativa e atualizada do projeto **Eldritch Lich**. Este repositório de documentos serve como guia arquitetural e funcional para desenvolvedores e agentes autônomos.

## Conteúdo

*   [Estrutura de Dependências](file:///home/zucchi/Projetos/Eldritch_Lich/brain/dependencias/mapa.md) - Mapa de componentes e relações do sistema.
*   [Autenticação e Projetos](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/autenticacao-workspace.md) - Gestão de acesso, perfis e múltiplos workspaces.
*   [Motor GMN (Grafo de Metas Narrativas)](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/gmn.md) - Estrutura de dados e propagação causal de metas.
*   [Módulo MMS (Mapeamento Semântico Local)](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/mms.md) - Pipeline NLP local (Transformers.js + e5 + NER).
*   [Mapeamento de Metas de Escrita](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/metas-escrita.md) - Estatísticas de produtividade, cotas e streaks.
*   [Linha do Tempo](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/timeline.md) - Cronologias, ramos alternativos e mesclagem causal.
*   [Arquitetura da História](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/arquitetura-historia.md) - Atos e arcos conectados aos capítulos existentes.
*   [Pesquisa e Análise](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/pesquisa-analise.md) - Notas e leitura editorial de capítulos locais.
*   [Auditoria de Dados](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/auditoria-dados.md) - Exportação completa do IndexedDB e verificação estrutural por projeto.
*   [Calendário do Projeto](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/calendario-projeto.md) - Prazos e encontros ligados aos capítulos.
*   [Conversas do Projeto](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/conversas-projeto.md) - Canais e mensagens locais.
*   [Atlas do Universo](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/atlas-universo.md) - Mapas e locais do projeto.
*   [Mapas Mentais](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/mapas-mentais.md) - Ideias e capítulos em ramos locais.
*   [Regras do Mundo](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/regras-mundo.md) - Regras narrativas com evidência no manuscrito.
*   [Reuniões do Projeto](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/reunioes-projeto.md) - Pautas e decisões ligadas a capítulos.
*   [Equipe do Projeto](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/equipe-projeto.md) - Membros e papéis locais.
*   [Notificações Locais](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/notificacoes-locais.md) - Preferências de alertas do workspace.
*   [Sessões de Chamada](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/sessoes-chamada.md) - Registro local de alinhamentos.
*   [Modo Foco e Atalhos de Teclado](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/atalhos-foco.md) - Mapeamento customizável e layout sem distrações.
*   [Fluxos de Trabalho e Manuscritos](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/workflows-manuscritos.md) - Gerenciador de capítulos, favoritos e status do manuscrito.
*   [Lembretes & Alertas Causa-Temporais](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/reminders.md) - Agendador offline-first de lembretes vinculados e snooze.
*   [Wiki, Worldbuilding & Nomes](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/wiki.md) - Portal de lore autolinkado, compilador de wiki e padronização.
*   [Galeria de mídia](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/galeria.md) - Assets visuais locais e exportação ZIP.
*   [Pesquisa Científica](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/pesquisa.md) - Referências, notas atômicas e exportações locais.
*   [Runtime de Plugins](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/plugins.md) - Contrato e sandbox de extensões do editor.
*   [Registro de Mudanças](file:///home/zucchi/Projetos/Eldritch_Lich/brain/mudancas/CHANGELOG.md) - Histórico de updates de sincronização do cérebro.

## Decisões Arquiteturais (ADRs)

*   [ADR-004: Inteligência Artificial Local e MMS](file:///home/zucchi/Projetos/Eldritch_Lich/docs/adr/ADR-004-ia-local-e-mms.md)
*   [ADR-001: Estrutura do Monorepo](file:///home/zucchi/Projetos/Eldritch_Lich/docs/adr/ADR-001-estrutura-do-monorepo.md)
*   [ADR-002: Arquitetura Local-First (Yjs + Dexie)](file:///home/zucchi/Projetos/Eldritch_Lich/docs/adr/ADR-002-arquitetura-local-first-yjs-dexie.md)
*   [ADR-003: Banco de Dados e Segurança](file:///home/zucchi/Projetos/Eldritch_Lich/docs/adr/ADR-003-banco-de-dados-e-seguranca-postgresql-rls.md)
*   [Extração local revisável](file:///home/zucchi/Projetos/Eldritch_Lich/brain/decisoes/2026-08-06-extracao-local-revisavel.md)
*   [ADR: Candidatos de extração antes do cânone](file:///home/zucchi/Projetos/Eldritch_Lich/brain/decisoes/2026-08-07-candidatos-antes-do-canone.md)
