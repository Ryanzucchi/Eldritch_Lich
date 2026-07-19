### Caso de Uso: Manter compatibilidade retroativa com versões antigas de exportação/importação (RNF)

**ID:** UC-450  
**Requisito relacionado:** RNF-Low-3 (compatibilidade de importação de versões antigas)  
**Ator(es):** Sistema, Usuário  
**Pré-condições:** Parsers de importação de projetos com suporte a esquemas de dados legados (ex: JSON da v1.0).  
**Gatilho:** O usuário realiza a importação de um backup gerado em versões anteriores do sistema.  

**Fluxo principal:**
1. O usuário acessa a página de importação de projetos.
2. O usuário carrega o arquivo de backup de um projeto gerado em versão anterior.
3. O backend lê o arquivo e detecta no metadado do cabeçalho a versão do esquema de dados correspondente.
4. O sistema aciona o conversor e normalizador de esquemas de dados.
5. O normalizador faz o mapeamento e conversão de todos os campos antigos para o modelo relacional atual da plataforma.
6. O sistema importa os dados, grava na base de dados atualizada e carrega o projeto com sucesso para o usuário.

**Fluxos alternativos:**
- *Dados externos:* O usuário importa dados de ferramentas de concorrentes (como JSON do Scrivener), e o sistema roda adaptadores dedicados para importar os registros.

**Fluxos de exceção:**
- *Arquivo corrompido:* Se o arquivo de importação apresentar erros estruturais graves de JSON ou a versão for incompatível, o sistema aborta a ação e exibe: "Erro: Formato de arquivo corrompido ou incompatível".

**Pós-condições:** O projeto de versão antiga é importado, atualizado de forma transparente para o esquema atual e disponibilizado para edição.

**Critérios de aceite:**
- [ ] O sistema de importação deve suportar retrocompatibilidade com esquemas de dados de até 3 anos atrás.
- [ ] A importação de projetos antigos não deve corromper os dados existentes do banco de dados principal.

**Prioridade:** Média  
**Complexidade estimada:** Alta
