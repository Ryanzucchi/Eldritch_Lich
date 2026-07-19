### Caso de Uso: Testar alteração hipotética sem afetar dados originais

**ID:** UC-404  
**Requisito relacionado:** RF-399 (testar alteração hipotética sem afetar dados originais)  
**Ator(es):** Usuário (Escritor/Game Designer), Sistema  
**Pré-condições:** Sandbox de teste ativo criado.  
**Gatilho:** O usuário edita informações no modo Sandbox.  

**Fluxo principal:**
1. O usuário acessa o ambiente Sandbox ativo correspondente.
2. O usuário abre a ficha técnica do herói principal e altera sua facção para "Vilões".
3. O usuário edita o texto do capítulo 1 alterando o desfecho da cena no editor do Sandbox.
4. O sistema grava as alterações de forma local e exclusiva na base de dados do sandbox.
5. As consultas realizadas dentro das ferramentas do sandbox trazem o personagem atualizado e as novas cenas, enquanto a base de dados principal canônica permanece intacta.

**Fluxos alternativos:**
- *Timelines alternativas:* O usuário cria ramificações temporais (branches) experimentais no sandbox para testar caminhos e escolhas alternativas sem interferir na cronologia oficial.

**Fluxos de exceção:**
- *Sessão perdida:* Se o sistema perder a referência do sandbox por desconexão, impede novos salvamentos e emite erro para evitar a sobrescrita acidental de dados da base principal.

**Pós-condições:** As alterações experimentais são salvas de forma exclusiva e isolada na base do sandbox.

**Critérios de aceite:**
- [ ] As alterações efetuadas no sandbox não devem de forma alguma vazar ou afetar a integridade da base canônica principal.
- [ ] A velocidade de salvamento e escrita no sandbox deve ser equivalente à da base comum (< 200ms).

**Prioridade:** Alta  
**Complexidade estimada:** Média
