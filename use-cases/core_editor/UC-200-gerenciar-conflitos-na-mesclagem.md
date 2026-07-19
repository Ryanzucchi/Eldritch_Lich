### Caso de Uso: Gerenciar conflitos na mesclagem

**ID:** UC-200  
**Requisito relacionado:** RF-200 (gerenciar conflitos na mesclagem)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O sistema tentou executar um merge de branch mas detectou alterações conflitantes nas mesmas linhas do texto principal.  
**Gatilho:** Ação de merge falhar devido a alterações concorrentes.  

**Fluxo principal:**
1. O sistema barra a mesclagem automática e abre a tela "Resolver Conflitos de Mesclagem".
2. A interface exibe os trechos de texto conflitantes em três blocos:
   - Bloco Esquerdo: Texto da versão Principal (Main) atual.
   - Bloco Direito: Texto da versão da Ramificação (Branch) proposta.
   - Bloco Central: Visualização do resultado final mesclado.
3. O sistema realça os conflitos com marcas coloridas e botões "Manter Principal" e "Manter Ramificação".
4. O usuário seleciona a opção desejada para cada bloco conflitante.
5. O painel central exibe a união das escolhas em tempo real.
6. O usuário revisa o texto mesclado final e clica em "Confirmar Resolução e Mesclar".
7. O sistema grava o texto resolvido no documento principal e encerra a ramificação.

**Fluxos alternativos:**
- *Edição manual:* O usuário digita uma redação inédita mesclando partes de ambos os lados diretamente na caixa de resultado central.

**Fluxos de exceção:**
- *Abortar mesclagem:* O usuário clica em "Cancelar Mesclagem". O sistema descarta a resolução de conflitos temporária, mantém o branch e o texto principal intocados e retorna à tela anterior.

**Pós-condições:** Os conflitos textuais são resolvidos e o merge é concluído.

**Critérios de aceite:**
- [ ] O painel de conflitos deve permitir navegar sequencialmente por todos os conflitos ("Próximo / Anterior").
- [ ] A finalização da mesclagem após a resolução deve ser transacional.

**Prioridade:** Média  
**Complexidade estimada:** Alta
