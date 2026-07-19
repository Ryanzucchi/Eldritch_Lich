### Caso de Uso: Associar som ambiente a local do universo

**ID:** UC-413  
**Requisito relacionado:** RF-408 (associar som ambiente a local do universo)  
**Ator(es):** Usuário (Escritor/RPGista), Sistema  
**Pré-condições:** Fichas de locais cadastradas e banco de áudio de som ambiente ativo.  
**Gatilho:** O usuário edita a ficha técnica de uma localidade de seu universo.  

**Fluxo principal:**
1. O usuário abre a ficha técnica do local correspondente (ex: "Masmorra Escura").
2. O usuário acessa a seção "Som Ambiente / Efeito Sonoro".
3. O usuário seleciona o áudio de som ambiente correspondente (ex: "Gotejamento + Vento frio" em loop) e regula o volume.
4. O usuário clica em "Salvar".
5. O sistema grava o vínculo correspondente na base de dados do projeto.
6. Ao abrir a visualização ou leitura da ficha técnica da localidade, o sistema inicia a reprodução do loop de som ambiente de forma automática em segundo plano.

**Fluxos alternativos:**
- *Sons sobrepostos:* O usuário constrói um som ambiente personalizado adicionando camadas de loops (canal 1 = vento, canal 2 = uivos), regulando o ganho de cada um de forma independente.

**Fluxos de exceção:**
- *Erro de carregamento:* Se o arquivo de áudio falhar ao carregar no dispositivo do cliente, o sistema silencia a reprodução automática em background e exibe um alerta sutil no reprodutor.

**Pós-condições:** O som ambiente é associado ao local e ativado no modo de leitura de fichas.

**Critérios de aceite:**
- [ ] O arquivo de som ambiente deve ser reproduzido em modo Loop sem quebras ou interrupções perceptíveis na transição de volta ao início.
- [ ] O salvamento da ficha com o som ambiente associado deve demorar menos de 200ms.

**Prioridade:** Baixa  
**Complexidade estimada:** Média
