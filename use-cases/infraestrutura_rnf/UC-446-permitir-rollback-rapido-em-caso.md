### Caso de Uso: Permitir rollback rápido em caso de deploy com falha (RNF)

**ID:** UC-446  
**Requisito relacionado:** RNF-Medium-10 (rollback rápido de deploy)  
**Ator(es):** Sistema (Pipeline de CD / Orquestrador), Equipe DevOps  
**Pré-condições:** Histórico de imagens de containers de versões anteriores compiladas e salvas de forma estável no Registry.  
**Gatilho:** A nova versão publicada (v1.2) apresenta alta taxa de erros HTTP 500 ou instabilidade na nuvem de produção.  

**Fluxo principal:**
1. A equipe DevOps detecta erros e instabilidades na nuvem logo após o deploy da versão v1.2.
2. O DevOps acessa o console de controle do deploy e clica em "Executar Rollback de Versão".
3. O sistema de deploy interrompe o tráfego de usuários para a versão instável v1.2.
4. O orquestrador de containers substitui as instâncias ativas apontando-as de volta para a imagem da versão anterior estável v1.1 salva no Registry.
5. O balanceador de carga redireciona 100% das requisições para os containers da versão v1.1.
6. O sistema volta ao ar de forma estável no ambiente v1.1 e o CD confirma o sucesso do rollback.

**Fluxos alternativos:**
- *Rollback automático:* O monitor detecta que a taxa de erros HTTP 500 superou 5% logo após o deploy. O próprio pipeline de CD aborta a migração e executa o rollback automático de volta para a versão estável, sem intervenção humana.

**Fluxos de exceção:**
- *Migrations destrutivas:* Se a v1.2 aplicou alterações destrutivas na estrutura do banco de dados (ex: exclusão de colunas), o rollback simples de containers falha, exigindo que a equipe execute o script de reversão de banco de dados (down migrations) antes de restaurar a v1.1.

**Pós-condições:** O sistema é restabelecido para a versão anterior estável sem perdas prolongadas de acessibilidade dos usuários.

**Critérios de aceite:**
- [ ] O tempo total de restauração de containers da versão anterior em caso de rollback simples (sem alterações estruturais de banco) deve ser inferior a 1 minuto.
- [ ] O sistema de CD deve manter o histórico das últimas 5 imagens de builds estáveis prontas para rollback rápido na nuvem.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
