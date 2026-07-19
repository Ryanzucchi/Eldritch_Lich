# Casos de Uso - Lote 45 (UC-441 a UC-450)

Este documento contém a especificação dos casos de uso de 441 a 450 derivados dos Requisitos Não Funcionais (RNFs) Médios e Baixos do projeto.

---
### Caso de Uso: Seguir um design system consistente em toda a interface (RNF)

**ID:** UC-441  
**Requisito relacionado:** RNF-Medium-5 (design system consistente em toda a interface)  
**Ator(es):** Sistema (Frontend / Biblioteca de Componentes)  
**Pré-condições:** Biblioteca de componentes visuais baseada em tokens de estilo ativa no projeto.  
**Gatilho:** A equipe de frontend constrói uma nova tela de controle.  

**Fluxo principal:**
1. O desenvolvedor importa os tokens de estilo (CSS Variables de cores, tipografia) e componentes globais homologados (botões, cards, inputs).
2. O desenvolvedor implementa a interface utilizando estritamente a biblioteca visual do Design System, sem escrever estilos ou cores fora do padrão.
3. A interface renderiza o layout final alinhada com as margens, paleta de cores e tipografia das demais telas pré-existentes da plataforma.
4. O usuário visualiza o layout harmônico e consistente em todo o fluxo do sistema.

**Fluxos alternativos:**
- *Atualização de marca:* O administrador atualiza a cor primária ou fontes corporativas no arquivo global de tokens. O sistema atualiza automaticamente em todas as telas em tempo real.

**Fluxos de exceção:**
- *Estilos fora do padrão:* O linter de compilação de código frontend rejeita o build caso identifique classes CSS ad-hoc ou cores declaradas fora das constantes globais do design system.

**Pós-condições:** A consistência visual e o padrão dos componentes da interface são garantidos nas novas páginas.

**Critérios de aceite:**
- [ ] 100% das páginas ativas devem utilizar as fontes e a paleta de cores globais do arquivo de tokens.
- [ ] A inclusão de novos componentes na interface deve seguir a documentação do design system.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Permitir customização de tema (claro/escuro) sem impacto de performance (RNF)

**ID:** UC-442  
**Requisito relacionado:** RNF-Medium-6 (customização de tema claro/escuro)  
**Ator(es):** Usuário, Sistema  
**Pré-condições:** Variáveis nativas CSS de controle de tema configuradas na raiz do documento.  
**Gatilho:** O usuário clica no seletor de tema (switch claro/escuro) no cabeçalho.  

**Fluxo principal:**
1. O usuário clica em "Alternar para Tema Escuro".
2. O sistema altera o atributo ou classe da tag principal do documento HTML (ex: `data-theme="dark"`).
3. O navegador lê a alteração e atualiza as cores mapeadas pelas variáveis de cor CSS na tela.
4. O sistema grava a preferência de tema do usuário no armazenamento local (LocalStorage).
5. A interface transiciona as cores de forma suave utilizando propriedades CSS nativas.

**Fluxos alternativos:**
- *Detecção automática:* O usuário opta por sincronizar o tema com o sistema operacional, e a plataforma altera o tema de acordo com o esquema de cores ativo do dispositivo (`prefers-color-scheme`).

**Fluxos de exceção:**
- *Flashes de cor no carregamento:* O sistema executa um script inline de leitura do LocalStorage no cabeçalho antes de renderizar o corpo da página, evitando flashes visuais brancos ao carregar em modo escuro.

**Pós-condições:** O tema da aplicação é alternado e salvo de forma imediata na tela do usuário.

**Critérios de aceite:**
- [ ] A alteração de tema não deve forçar re-renderizações (re-renders) pesadas de componentes React/JS, ocorrendo de forma puramente visual na camada do navegador.
- [ ] O tempo total de transição visual de cores ao clicar no switch de tema deve ser inferior a 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Garantir que buscas retornem resultados relevantes em menos de 2 segundos (RNF)

**ID:** UC-443  
**Requisito relacionado:** RNF-Medium-7 (busca rápida de dados e arquivos)  
**Ator(es):** Sistema (Motor de Busca / Banco de Dados)  
**Pré-condições:** Índices de busca de texto completo ativos e configurados no banco de dados.  
**Gatilho:** O usuário digita termos na caixa de busca global e confirma.  

**Fluxo principal:**
1. O usuário digita a pesquisa no campo de busca global e pressiona Enter.
2. O backend recebe a chamada da API de busca.
3. O banco de dados realiza a consulta indexada cruzando dados de personagens, locais e itens cadastrados no projeto correspondente.
4. O sistema ordena os resultados por relevância lógica baseando-se em tags e proximidade de caracteres.
5. O sistema retorna a lista de dados correspondentes e a interface renderiza na tela em menos de 2 segundos.

**Fluxos alternativos:**
- *Busca aproximada:* O usuário digita o termo com pequenos erros ortográficos. O sistema utiliza algoritmos de busca fuzzy (ex: distância de Levenshtein) para encontrar e apresentar os termos mais prováveis.

**Fluxos de exceção:**
- *Timeout de busca:* Se a consulta demorar mais de 2 segundos sob alta concorrência de banco, o sistema aborta o processo e avisa: "A busca demorou muito para responder. Refine sua pesquisa".

**Pós-condições:** Os resultados de busca ordenados por relevância e semântica são exibidos na tela.

**Critérios de aceite:**
- [ ] 98% das requisições de busca textual simples sobre o banco do projeto devem responder em até 1,5 segundos.
- [ ] A busca deve ignorar stop words (como "de", "o", "a") para maximizar a relevância dos itens encontrados.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Suportar internacionalização (i18n) para múltiplos idiomas de interface (RNF)

**ID:** UC-444  
**Requisito relacionado:** RNF-Medium-8 (internacionalização de interface)  
**Ator(es):** Sistema (Framework i18n / Dicionários de Idiomas)  
**Pré-condições:** Arquivos JSON contendo os dicionários de tradução configurados na plataforma.  
**Gatilho:** O usuário altera o idioma de exibição ou o sistema detecta o fuso/idioma do navegador.  

**Fluxo principal:**
1. O usuário abre a plataforma no navegador pela primeira vez.
2. O sistema lê o idioma preferido nas configurações do navegador do cliente (ex: `en-US`).
3. O sistema carrega o dicionário de chaves em inglês correspondente.
4. Rótulos e textos estáticos (botões, menus, mensagens) são renderizados na tela com os valores do dicionário carregado.
5. O usuário navega pela aplicação visualizando todas as opções no idioma correspondente.

**Fluxos alternativos:**
- *Alteração manual:* O usuário seleciona o idioma "Português (BR)" no painel de configurações de seu perfil e o sistema atualiza as traduções da interface imediatamente.

**Fluxos de exceção:**
- *Termo ausente:* Se uma determinada chave não possuir tradução cadastrada no dicionário selecionado, o sistema exibe o valor do dicionário padrão em português como fallback para evitar lacunas vazias na interface.

**Pós-condições:** A interface da aplicação é renderizada no idioma selecionado pelo usuário.

**Critérios de aceite:**
- [ ] A mudança de idioma na interface deve ocorrer instantaneamente sem necessidade de recarregamento completo da página do navegador.
- [ ] O sistema deve aceitar formatação de datas e moedas localizadas de acordo com o padrão regional correspondente.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Monitorar uso de recursos (CPU, memória, armazenamento) com alertas automáticos (RNF)

**ID:** UC-445  
**Requisito relacionado:** RNF-Medium-9 (monitoramento de recursos com alertas automáticos)  
**Ator(es):** Sistema, Agente de Monitoramento (Infraestrutura)  
**Pré-condições:** Agente de métricas instalado e monitorando os servidores e banco de dados.  
**Gatilho:** O uso de hardware (CPU, Memória, Disco) ultrapassa o limite configurado de 85% de utilização.  

**Fluxo principal:**
1. O servidor de banco de dados sofre alta carga e o consumo de memória atinge 87% de utilização.
2. O agente de monitoramento coleta as métricas e identifica que o limite de alerta (85%) foi superado.
3. O sistema de monitoramento gera um evento de alerta em background.
4. O sistema dispara notificações automáticas contendo o servidor afetado, recurso e percentual de uso para o e-mail dos administradores e canal Slack de DevOps.
5. O time de SRE analisa o alerta de forma preventiva para redimensionar o hardware antes que ocorram indisponibilidades de banco.

**Fluxos alternativos:**
- *Alertas para usuários:* O sistema de monitoramento detecta que o armazenamento de mídias de um cliente atingiu 95% do plano contratado e envia uma notificação automática por e-mail sugerindo limpeza ou upgrade de cota.

**Fluxos de exceção:**
- *Falha repentina (OOM):* Se ocorrer um pico de exaustão instantâneo que impeça o envio de alertas preventivos, o sistema reinicia o processo e dispara o log de erro pós-evento de falha crítica de hardware de imediato.

**Pós-condições:** Os alertas de exaustão de hardware são emitidos, possibilitando manutenções proativas e preventivas da equipe de SRE.

**Critérios de aceite:**
- [ ] O atraso entre a coleta do pico de recurso e o recebimento da notificação no Slack da equipe de engenharia deve ser inferior a 1 minuto.
- [ ] O monitoramento de hardware deve rodar de forma contínua com intervalo máximo de amostragem de 10 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
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

---
### Caso de Uso: Seguir padrões de conformidade legal (LGPD/GDPR) para dados pessoais (RNF)

**ID:** UC-447  
**Requisito relacionado:** RNF-Medium-11 (conformidade legal LGPD/GDPR)  
**Ator(es):** Usuário, Sistema  
**Pré-condições:** Políticas de privacidade estruturadas e mecanismos de exclusão de dados ativos no banco de dados.  
**Gatilho:** O usuário solicita a exclusão definitiva de sua conta e informações pessoais.  

**Fluxo principal:**
1. O usuário acessa a seção de privacidade de seu perfil e clica em "Excluir conta e dados (LGPD)".
2. O sistema exibe um aviso informando que a ação é definitiva e solicita a confirmação inserindo a senha de login.
3. O usuário confirma.
4. O backend executa rotina de exclusão física: deleta os dados de identificação (nome, e-mail, telefone, CPF) de usuários/funcionários e apaga os arquivos e documentos de mídia do bucket.
5. O sistema anonimiza o histórico de logs de auditoria e participação de chats substituindo o nome por marcadores neutros (ex: "Usuário Deletado").
6. O sistema retorna a mensagem de exclusão concluída.

**Fluxos alternativos:**
- *Portabilidade:* O usuário seleciona "Exportar meus dados". O sistema compila as informações em formato JSON estruturado e realiza o download, cumprindo a portabilidade de dados da LGPD.

**Fluxos de exceção:**
- *Retenção obrigatória fiscal:* Se o funcionário deletado possuir histórico de transações financeiras fiscais ou folhas de pagamentos recebidas, o sistema impede a exclusão física absoluta desses registros, mantendo as informações restritas para fins de conformidade fiscal governamental obrigatória por 5 anos, anonimizando apenas o cadastro de login de usuário.

**Pós-condições:** Os dados pessoais do usuário são expurgados em definitivo do banco de dados em conformidade legal.

**Critérios de aceite:**
- [ ] Os dados expurgados devem ser impossíveis de restaurar ou reconstituir de forma reversa a partir da base principal.
- [ ] O processo de portabilidade deve gerar arquivos em formatos de dados interoperáveis (JSON ou XML).

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Permitir customização visual avançada (ícones, cores, fontes) sem impacto em outras funcionalidades (RNF)

**ID:** UC-448  
**Requisito relacionado:** RNF-Low-1 (customização visual avançada sem impactos)  
**Ator(es):** Usuário, Sistema  
**Pré-condições:** Módulo de customização visual e painel de temas avançados ativado.  
**Gatilho:** O usuário altera cores de pastas e ícones na interface de worldbuilding.  

**Fluxo principal:**
1. O usuário abre o diretório de pastas do seu projeto e seleciona as propriedades visuais de uma pasta específica.
2. O sistema abre a modal de personalização rápida contendo seletores de cores e ícones.
3. O usuário seleciona a cor e o ícone desejados e clica em salvar.
4. O sistema grava as preferências de personalização visual na tabela de configurações e aplica o estilo CSS correspondente na tela do usuário.
5. O usuário visualiza a pasta atualizada com as novas cores e ícones na tela sem que as demais abas do caderno sofram alterações de comportamento.

**Fluxos alternativos:**
- *Customização de fontes:* O usuário seleciona uma fonte de escrita para o editor (ex: Outfit) nas configurações, e o sistema carrega o arquivo de tipografia assincronamente sem travar a tela de digitação.

**Fluxos de exceção:**
- *Erro no arquivo de fonte:* Se o arquivo de fonte importado estiver quebrado, o sistema desativa a fonte de forma automática e restaura a tipografia padrão para manter a legibilidade.

**Pós-condições:** As customizações visuais de ícones, fontes e cores são salvas e aplicadas na interface do usuário.

**Critérios de aceite:**
- [ ] As customizações visuais do usuário não devem interferir na velocidade de renderização da árvore de pastas (deve carregar em menos de 100ms).
- [ ] A aplicação deve suportar o reset das configurações visuais de volta ao tema padrão com um clique.

**Prioridade:** Baixa  
**Complexidade estimada:** Média  

---
### Caso de Uso: Oferecer exportação de dados em múltiplos formatos com qualidade visual consistente (RNF)

**ID:** UC-449  
**Requisito relacionado:** RNF-Low-2 (exportação de dados em múltiplos formatos)  
**Ator(es):** Usuário (Escritor/Pesquisador), Sistema  
**Pré-condições:** Conversores e exportadores de formatos ativos no servidor.  
**Gatilho:** O usuário seleciona múltiplos formatos de exportação para baixar seu manuscrito.  

**Fluxo principal:**
1. O usuário abre as configurações de exportação de textos do projeto.
2. O usuário escolhe exportar o mesmo manuscrito em três formatos diferentes: PDF, EPUB e DOCX.
3. O usuário clica em "Iniciar Geração".
4. O backend recebe o texto e aciona os conversores utilizando templates de estilo equivalentes para cada formato de destino.
5. O sistema gera os três arquivos de forma a preservar a mesma formatação visual e estrutura (quebras de linha, imagens, notas de rodapé).
6. O sistema compacta os arquivos em formato ZIP e disponibiliza o download.

**Fluxos alternativos:**
- *Geração unitária:* O usuário seleciona exportar apenas um capítulo isolado em formato PDF.

**Fluxos de exceção:**
- *Erro de compilação em um formato:* Se o parser do formato EPUB quebrar por caracteres inválidos, o sistema suspende o arquivo EPUB, gera os PDFs e DOCX com sucesso e alerta o usuário sobre a inconsistência no arquivo EPUB.

**Pós-condições:** Os arquivos do livro formatados de forma equivalente nos múltiplos formatos selecionados são gerados e disponibilizados para download.

**Critérios de aceite:**
- [ ] A formatação de negritos, itálicos, imagens embutidas e notas de rodapé deve ser preservada em todos os formatos de exportação.
- [ ] A geração simultânea de 3 formatos para um livro de 100 páginas deve durar menos de 10 segundos no servidor.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
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

---

## Tabela Resumo: Lote 45 (UC-441 a UC-450)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-441** | RNF-Medium-5 (design system consistente) | Média | Média |
| **UC-442** | RNF-Medium-6 (switch tema claro/escuro) | Média | Baixa |
| **UC-443** | RNF-Medium-7 (buscas rápidas < 2s no banco) | Alta | Média |
| **UC-444** | RNF-Medium-8 (suporte a internacionalização i18n) | Média | Média |
| **UC-445** | RNF-Medium-9 (monitorar hardware CPU/memória) | Média | Média |
| **UC-446** | RNF-Medium-10 (rollback de deploy instável) | Alta | Alta |
| **UC-447** | RNF-Medium-11 (conformidade LGPD/GDPR de dados) | Alta | Alta |
| **UC-448** | RNF-Low-1 (customização visual de pastas) | Baixa | Média |
| **UC-449** | RNF-Low-2 (exportação em múltiplos formatos) | Média | Alta |
| **UC-450** | RNF-Low-3 (compatibilidade com backups v1.0) | Média | Alta |
