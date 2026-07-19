### Caso de Uso: Cadastrar funcionários

**ID:** UC-301  
**Requisito relacionado:** RF-300 (cadastrar funcionários)  
**Ator(es):** Administrador/RH, Sistema  
**Pré-condições:** O ator possui permissões administrativas de gerenciamento de pessoal.  
**Gatilho:** O gestor clica em "Adicionar Funcionário" no módulo de RH do sistema.  

**Fluxo principal:**
1. O gestor acessa o módulo de "Gestão de Pessoas" -> "Funcionários".
2. O gestor clica no botão "Cadastrar Novo Funcionário".
3. O sistema abre o formulário solicitando: Dados Pessoais (Nome, CPF, Data de Nascimento), Dados de Contato (E-mail, Telefone), Cargo Inicial, Departamento, Data de Admissão e Salário Base.
4. O gestor preenche os dados obrigatórios e clica em "Salvar Cadastro".
5. O sistema valida os dados do formulário e insere o registro na tabela de funcionários.
6. A interface exibe a confirmação: "Funcionário cadastrado com sucesso".

**Fluxos alternativos:**
- *Cadastrar a partir de convite:* O gestor insere apenas o e-mail do colaborador. O sistema envia um convite eletrônico por e-mail e o próprio funcionário preenche seus dados pessoais, necessitando apenas da aprovação final do gestor.

**Fluxos de exceção:**
- *CPF duplicado:* Se o CPF fornecido já constar em outro cadastro ativo no sistema, a gravação é bloqueada e exibe o alerta: "Erro: Já existe um funcionário cadastrado com este CPF".

**Pós-condições:** A ficha cadastral do funcionário é salva e armazenada no banco de dados.

**Critérios de aceite:**
- [ ] O CPF deve ser validado pelo algoritmo padrão de dígitos verificadores antes do salvamento.
- [ ] O tempo de processamento do cadastro deve ser inferior a 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
