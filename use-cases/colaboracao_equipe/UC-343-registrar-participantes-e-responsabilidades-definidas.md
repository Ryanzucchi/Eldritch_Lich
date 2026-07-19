### Caso de Uso: Registrar participantes e responsabilidades definidas

**ID:** UC-343  
**Requisito relacionado:** RF-342 (registrar participantes e responsabilidades definidas)  
**Ator(es):** Organizador/Secretário, Sistema  
**Pré-condições:** Reunião ativa e colaboradores convidados.  
**Gatilho:** O organizador gerencia o painel de presença e papéis na pauta/ata da reunião.  

**Fluxo principal:**
1. O organizador abre a reunião de equipe.
2. O organizador acessa a aba "Presença e Atribuições".
3. O sistema lista os convidados. O organizador marca caixas de seleção indicando quem compareceu (Presença).
4. Ao lado de cada participante presente, o organizador seleciona sua responsabilidade oficial naquela reunião (Dropdown: Apresentador, Ouvinte, Secretário, Decisor).
5. O organizador clica em "Salvar Presenças".
6. O sistema atualiza a tabela de participantes no banco de dados e adiciona a ata ao histórico profissional dos membros presentes.

**Fluxos alternativos:**
- *Presença automática:* Se a reunião for realizada via videoconferência integrada do próprio sistema, a presença é computada e preenchida de forma automática baseado nos logs de presença da chamada.

**Fluxos de exceção:**
- *Participante externo:* Se um convidado externo participar, o gestor de RH pode cadastrá-lo inserindo apenas nome e e-mail no painel de convidados.

**Pós-condições:** O registro detalhado de presenças e papéis de responsabilidade da reunião é gravado no banco de dados.

**Critérios de aceite:**
- [ ] A listagem de atas no histórico do funcionário deve indexar as responsabilidades exatas desempenhadas em cada reunião.
- [ ] A atualização do status de presença no banco de dados deve levar menos de 150ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
