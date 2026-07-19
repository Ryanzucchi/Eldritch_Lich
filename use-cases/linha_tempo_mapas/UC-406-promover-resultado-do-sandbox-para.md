### Caso de Uso: Promover resultado do sandbox para o universo real

**ID:** UC-406  
**Requisito relacionado:** RF-401 (promover resultado do sandbox para o universo real)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Sandbox ativo com alterações e visualização de comparações concluída.  
**Gatilho:** O usuário clica em "Promover para Canônico (Merge)" no painel do sandbox.  

**Fluxo principal:**
1. O usuário abre o painel de comparação do sandbox.
2. O usuário clica no botão "Mesclar com o Universo Canônico".
3. O sistema exibe um aviso crítico alertando sobre a substituição de dados permanentes e exige confirmação de segurança.
4. O usuário confirma a ação.
5. O sistema copia todos os registros, textos e árvores de decisão do sandbox para a base canônica principal do projeto (sobrescrevendo o estado anterior da base principal).
6. O sistema cria um ponto de restauração (backup) automático da base canônica anterior antes da mesclagem.
7. O sandbox é encerrado, e o sistema redireciona o usuário para o universo principal atualizado.

**Fluxos alternativos:**
- *Promoção seletiva:* O usuário seleciona marcar as caixas de verificação apenas nos personagens e fichas que deseja promover, rejeitando as alterações feitas nas cenas de texto.

**Fluxos de exceção:**
- *Conflitos relacionais de banco:* Se houver chaves duplicadas no banco que causem erros de integridade relacional, o sistema cancela a operação, restaura o backup e exibe a tela de resolução manual de conflitos.

**Pós-condições:** Os dados reais da base principal do universo são atualizados com as informações do sandbox promovido.

**Critérios de aceite:**
- [ ] O processo de promoção e mesclagem total dos universos deve durar no máximo 3 segundos.
- [ ] O ponto de restauração pré-mesclagem deve ser armazenado na pasta de backups do usuário.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
