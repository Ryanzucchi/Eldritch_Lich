### Caso de Uso: Restaurar versões anteriores

**ID:** UC-125  
**Requisito relacionado:** RF-125 (restaurar versões anteriores)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está visualizando uma versão antiga no Histórico de Versões (UC-124).  
**Gatilho:** O usuário clica no botão "Restaurar esta Versão" na barra de visualização da versão histórica.  

**Fluxo principal:**
1. O usuário clica no botão "Restaurar esta Versão" para recuperar o estado antigo selecionado.
2. O sistema exibe um modal de confirmação: "Tem certeza de que deseja substituir o texto atual por esta versão anterior?".
3. O usuário clica em "Confirmar Restauração".
4. O sistema cria uma versão de backup contendo o texto antes do clique.
5. O sistema sobrescreve o conteúdo ativo do documento com os dados da versão antiga no banco de dados.
6. O editor recarrega o conteúdo restaurado na tela do usuário.

**Fluxos alternativos:**
- *Copiar trecho antigo:* O usuário opta por não restaurar o arquivo completo; ele apenas seleciona e copia um parágrafo da versão antiga na tela de diff.

**Fluxos de exceção:**
- *Erro na gravação:* Se a substituição falhar na transação do banco, o sistema aborta o processo e reverte o arquivo para o estado ativo mais recente.

**Pós-condições:** O documento ativo é atualizado com o conteúdo da versão histórica selecionada.

**Critérios de aceite:**
- [ ] A restauração de versões antigas não deve deletar os registros de histórico de versões subsequentes.
- [ ] A restauração de um texto com até 100 mil palavras deve ser concluída em menos de 2 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média
