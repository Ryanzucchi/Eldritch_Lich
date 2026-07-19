### Caso de Uso: Criptografar dados sensíveis em repouso (banco de dados) (RNF)

**ID:** UC-416  
**Requisito relacionado:** RNF-Critical-3 (criptografar dados sensíveis em repouso)  
**Ator(es):** Sistema, Banco de Dados / Storage (Infraestrutura)  
**Pré-condições:** Motor de banco de dados com suporte à Criptografia de Dados Transparente (TDE) ativo.  
**Gatilho:** O sistema realiza gravações de dados no banco de dados ou discos.  

**Fluxo principal:**
1. O backend realiza a persistência de informações sensíveis (dados pessoais, salários do RH, senhas) no banco de dados.
2. O motor do banco de dados intercepta a escrita e codifica os blocos de dados antes de gravá-los fisicamente no disco utilizando chaves AES-256.
3. Arquivos e documentos anexados são criptografados na camada do bucket de persistência de mídias antes do salvamento físico.
4. Em caso de furto físico de discos do servidor ou cópias de segurança de banco (backups), os dados permanecem ilegíveis sem acesso às chaves do chaveiro de segurança (KMS).

**Fluxos alternativos:**
- *Criptografia lógica:* Campos altamente críticos (como tokens de banco) são criptografados pelo código da aplicação no backend antes de serem passados em queries para o banco de dados.

**Fluxos de exceção:**
- *Chave KMS inacessível:* Se o serviço de gerenciamento de chaves falhar na inicialização do servidor, o banco de dados bloqueia todos os acessos de escrita e leitura e emite alertas urgentes para a equipe de SRE.

**Pós-condições:** Todos os dados persistidos em disco e backups no servidor são armazenados de forma criptografada.

**Critérios de aceite:**
- [ ] Os backups em arquivos físicos do banco de dados gerados automaticamente devem ser criptografados na origem.
- [ ] A latência de descriptografia em tempo de execução ao ler os dados do banco deve ser imperceptível (< 50ms).

**Prioridade:** Crítica  
**Complexidade estimada:** Alta
