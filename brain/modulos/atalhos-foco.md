# Modo Foco e Atalhos de Teclado

Este módulo implementa o ambiente de escrita livre de distrações e o gerenciamento dinâmico de atalhos de teclado customizados.

## Responsabilidades

1.  **Modo Foco (UC-141)**:
    *   Habilita tela cheia via Fullscreen API do navegador.
    *   Oculta os painéis periféricos (sidebar esquerda, sidebar direita, navbar e logs) para maximizar o foco.
    *   Exibe botão flutuante e escuta a tecla `ESC` para sair do modo foco.
2.  **Foco em Linha (Paragraph Focus)**:
    *   Esmaece em 80% (`opacity: 0.18`) todos os parágrafos não-focados, destacando somente o parágrafo em que o cursor do autor está ativo.
3.  **Atalhos Customizados (UC-142)**:
    *   Gerencia atalhos para os principais comandos (`toggle_focus`, `toggle_line_focus`, `toggle_sidebar_left`, `toggle_sidebar_right`).
    *   Mapeamento persistido no Dexie DB (`keyboardShortcuts`).
    *   Módulo de captura de teclado interativo e validador de colisão (exibe avisos de conflito em tempo real).

## Componentes Importantes
*   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) - Listener de eventos de teclado, manipulação do DOM de tela cheia, estilos css de opacidade e modal de atalhos.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) - Definição da tabela `keyboardShortcuts` no Dexie DB.
