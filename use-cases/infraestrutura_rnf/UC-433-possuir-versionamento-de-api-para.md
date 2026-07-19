### Caso de Uso: Possuir versionamento de API para evitar quebra de integrações existentes (RNF)

**ID:** UC-433  
**Requisito relacionado:** RNF-High-9 (versionamento de API)  
**Ator(es):** Sistema (Roteador de API), Integrações Externas / Clientes  
**Pré-condições:** Gateway de rotas configurado com suporte a múltiplos endpoints de versão paralelos (v1, v2).  
**Gatilho:** A equipe de engenharia publica uma alteração destrutiva (breaking change) em endpoints da API.  

**Fluxo principal:**
1. A equipe de desenvolvimento publica a nova versão de API contendo alterações incompatíveis na rota `/api/v2/entidades`.
2. A versão antiga compatível com as regras anteriores permanece ativa e inalterada no endpoint `/api/v1/entidades`.
3. As integrações e aplicativos clientes antigos continuam consumindo dados via rota `/api/v1` sem interrupções de serviço ou erros de incompatibilidade.
4. Os aplicativos novos e atualizados realizam as requisições utilizando a rota `/api/v2`.
5. O sistema gerencia e responde ambas as rotas no mesmo banco de dados, aplicando mapeamentos na camada dos controladores do backend.

**Fluxos alternativos:**
- *Depreciação de API (Deprecation):* A equipe sinaliza a v1 como depreciada. O sistema passa a retornar cabeçalhos HTTP de alerta com a data programada para encerramento das rotas de v1, permitindo migração programada.

**Fluxos de exceção:**
- *Versão inexistente:* Se o cliente tentar requisição em uma rota de versão que não existe (ex: `/api/v3/...`), o roteador de API bloqueia a chamada e retorna erro HTTP 404 Not Found.

**Pós-condições:** As novas versões de API são disponibilizadas sem causar quebras ou indisponibilidades nas integrações e clientes já existentes.

**Critérios de aceite:**
- [ ] O versionamento de endpoints da API deve ser explícito no caminho da URL (ex: `/api/v1/...`).
- [ ] A inclusão de novas rotas de v2 não deve interferir no tempo de resposta das chamadas ativas de v1.

**Prioridade:** Alta  
**Complexidade estimada:** Média
