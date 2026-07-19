### Caso de Uso: Alertar personagem/tema muito similar já usado em outro projeto

**ID:** UC-408  
**Requisito relacionado:** RF-403 (alertar personagem muito similar já usado em outro projeto)  
**Ator(es):** Sistema, IA, Usuário (Escritor)  
**Pré-condições:** Múltiplos personagens cadastrados em projetos diferentes da conta.  
**Gatilho:** O usuário cria ou edita um personagem no módulo correspondente do projeto atual.  

**Fluxo principal:**
1. O usuário preenche a ficha de um novo personagem (dados, motivações, história).
2. Ao clicar em "Salvar Personagem", o sistema envia os dados para validação cruzada de similaridade semântica em background.
3. O backend calcula a distância de similaridade dos dados com todos os personagens dos outros projetos do usuário.
4. O sistema detecta um nível de similaridade acima do aceitável configurado (ex: similaridade de 85% com personagem de outro projeto).
5. A interface exibe uma janela flutuante sutil alertando sobre a alta similaridade de escrita.
6. O usuário clica para comparar ambas as fichas para fins de diferenciação.

**Fluxos alternativos:**
- *Ignorar alerta:* O usuário opta por desconsiderar o aviso clicando em "Ignorar e Salvar", e o sistema prossegue salvando a ficha sem travar a interface.

**Fluxos de exceção:**
- *Falha de busca:* Se a busca semântica de IA falhar por instabilidade, o sistema executa apenas a busca por termos textuais exatos e prossegue com o salvamento da ficha.

**Pós-condições:** A ficha do personagem é salva e o alerta de similaridade cruzada é disparado quando detectado.

**Critérios de aceite:**
- [ ] A verificação de similaridade deve durar menos de 800ms após o clique de salvamento da ficha.
- [ ] Os parâmetros de percentual de similaridade de gatilho (ex: alertar acima de 80%) devem ser configuráveis nas configurações de conta.

**Prioridade:** Média  
**Complexidade estimada:** Alta
