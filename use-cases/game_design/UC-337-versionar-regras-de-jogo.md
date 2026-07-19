### Caso de Uso: Versionar regras de jogo

**ID:** UC-337  
**Requisito relacionado:** RF-336 (versionar regras de jogo)  
**Ator(es):** Usuário (Game Designer), Sistema  
**Pré-condições:** Regras de jogo e fórmulas matemáticas cadastradas no GDD.  
**Gatilho:** O usuário edita e altera uma regra ou fórmula matemática existente de combate.  

**Fluxo principal:**
1. O usuário abre a ficha da regra correspondente (versão ativa: v1.0).
2. O usuário edita a fórmula matemática alterando os multiplicadores.
3. O usuário digita o motivo do ajuste de balanceamento.
4. O usuário clica em "Atualizar Regra".
5. O backend recebe a alteração, cria a versão v1.1 da regra, grava os metadados do autor/data e armazena o histórico da versão anterior na tabela de auditoria.
6. O painel passa a exibir as duas versões com opção de comparação rápida das fórmulas.

**Fluxos alternativos:**
- *Restaurar regra antiga:* O usuário clica em "Reverter para Versão Anterior" e o sistema promove a fórmula anterior para ativa, desativando a versão mais recente.

**Fluxos de exceção:**
- *Queda de rede:* O sistema salva as edições de regras localmente caso haja queda de conexão para posterior sincronização.

**Pós-condições:** A nova versão da regra é gravada, mantendo o histórico de auditoria das versões anteriores acessível.

**Critérios de aceite:**
- [ ] O sistema de versionamento de regras deve exibir um diff claro de alteração de fórmulas matemáticas.
- [ ] A gravação e cálculo de versão de regras devem durar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
