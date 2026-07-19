### Caso de Uso: Gerenciar processo de admissão

**ID:** UC-307  
**Requisito relacionado:** RF-306 (gerenciar processo de admissão)  
**Ator(es):** Administrador/RH, Candidato, Sistema  
**Pré-condições:** Vaga aprovada e candidato selecionado para admissão.  
**Gatilho:** O gestor inicia o fluxo de "Admissão Digital" para o candidato aprovado.  

**Fluxo principal:**
1. O gestor do RH acessa a vaga correspondente e clica em "Contratar" na ficha do candidato.
2. O gestor preenche a oferta de contratação e clica em "Iniciar Admissão".
3. O sistema envia um e-mail com link exclusivo para o candidato acessar o portal de admissão.
4. O candidato faz login e realiza o upload dos documentos obrigatórios (RG, CTPS, etc.) e preenche seus dados bancários.
5. O candidato envia os dados.
6. O gestor de RH recebe a notificação, audita os documentos enviados e clica em "Aprovar Admissão".
7. O sistema cria automaticamente a conta de colaborador do novo funcionário.

**Fluxos alternativos:**
- *Admissão manual:* O gestor de RH digita e anexa toda a documentação na ficha de forma direta, pulando a etapa de preenchimento do candidato externo.

**Fluxos de exceção:**
- *Documento inválido:* O gestor recusa o documento e escreve uma justificativa. O sistema reabre o campo para o candidato reenviar a imagem correspondente.

**Pós-condições:** Os documentos de admissão são aprovados e a ficha do candidato é promovida a funcionário ativo no sistema.

**Critérios de aceite:**
- [ ] O link enviado ao candidato deve expirar em 15 dias após o envio.
- [ ] Os arquivos de documentos enviados devem ser salvos de forma protegida e privada no bucket de mídias do sistema.

**Prioridade:** Média  
**Complexidade estimada:** Média
