### Caso de Uso: Gerenciar contratos de trabalho

**ID:** UC-311  
**Requisito relacionado:** RF-310 (gerenciar contratos de trabalho)  
**Ator(es):** Administrador/RH, Sistema  
**Pré-condições:** O funcionário correspondente está admitido no sistema.  
**Gatilho:** O gestor clica em "Gerenciar Contratos" no perfil do funcionário.  

**Fluxo principal:**
1. O gestor de RH acessa a aba "Contratos de Trabalho" na ficha do funcionário.
2. O gestor visualiza os contratos existentes (ativos e passados).
3. O gestor clica em "Novo Contrato de Trabalho" ou "Aditivo Contratual".
4. O gestor preenche a modalidade (Dropdown: CLT, PJ, Estágio), vigência, carga horária e anexa o arquivo assinado do contrato (PDF).
5. O gestor clica em "Salvar".
6. O sistema atualiza o status do contrato na base de dados e o vincula ao histórico do colaborador.

**Fluxos alternativos:**
- *Geração automática de contrato:* O sistema gera o arquivo do contrato preenchendo um modelo padrão (template) com os dados cadastrados na admissão e envia para assinatura eletrônica do colaborador.

**Fluxos de exceção:**
- *Conflito de vigência:* Se o gestor tentar cadastrar um contrato cuja data de início conflite com um contrato ativo preexistente do mesmo funcionário, o sistema alerta e solicita o encerramento do contrato antigo.

**Pós-condições:** O contrato de trabalho é cadastrado e associado ao funcionário no banco de dados.

**Critérios de aceite:**
- [ ] O arquivo PDF do contrato deve ser armazenado com criptografia em repouso por razões de conformidade legal.
- [ ] A inserção no banco e atualização do perfil devem demorar menos de 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
