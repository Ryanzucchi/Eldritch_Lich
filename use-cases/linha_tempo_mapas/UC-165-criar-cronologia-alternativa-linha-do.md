### Caso de Uso: Criar cronologia alternativa (linha do tempo paralela)

**ID:** UC-165  
**Requisito relacionado:** RF-165 (criar cronologia alternativa)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A timeline geral (principal) do projeto existe.  
**Gatilho:** O usuário clica em "Criar Cronologia Alternativa" no painel da Timeline.  

**Fluxo principal:**
1. O usuário acessa a seção "Timelines" do projeto.
2. O usuário clica no botão "Nova Cronologia Paralela".
3. O sistema abre um modal solicitando um título e uma descrição.
4. O sistema oferece a opção de duplicar eventos da cronologia principal. O usuário escolhe "Cronologia em branco".
5. O sistema grava a nova cronologia no banco de dados vinculada ao projeto.
6. A interface atualiza o seletor de timelines e carrega o painel vazio da nova cronologia alternativa.

**Fluxos alternativos:**
- *Clonar linha principal:* O usuário duplica a timeline principal para simular uma realidade alternativa ("E se?") a partir de um evento específico.

**Fluxos de exceção:**
- *Limite de timelines:* O sistema impede a criação se o usuário exceder o limite de timelines do plano ativo, sugerindo upgrade de assinatura.

**Pós-condições:** Uma nova linha do tempo alternativa é criada de forma isolada na base do projeto.

**Critérios de aceite:**
- [ ] A cronologia alternativa deve permitir adicionar novos eventos com datas próprias sem afetar os eventos da cronologia principal.
- [ ] A gravação e inicialização da nova linha do tempo devem levar menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
