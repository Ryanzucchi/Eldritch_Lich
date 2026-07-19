# Casos de Uso - Lote 9 (UC-081 a UC-090)

Este documento contém a especificação dos casos de uso de 81 a 90 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Compartilhar projetos

**ID:** UC-081  
**Requisito relacionado:** RF-81 (compartilhar projetos)  
**Ator(es):** Usuário (Dono do Projeto), Sistema  
**Pré-condições:** O projeto existe na nuvem e o usuário é o dono ("Owner").  
**Gatilho:** O usuário clica em "Compartilhar Projeto" no cabeçalho ou menu do projeto.  

**Fluxo principal:**
1. O usuário abre o modal de compartilhamento do projeto.
2. O usuário digita o e-mail do colaborador desejado.
3. O usuário seleciona a permissão inicial ("Leitor", "Editor" ou "Administrador").
4. O usuário clica em "Adicionar Colaborador".
5. O sistema registra o convite no banco de dados e envia um e-mail de convite com um link de aceitação.
6. O colaborador aparece listado no modal com o status "Pendente".

**Fluxos alternativos:**
- *Compartilhamento via link público:* O usuário ativa a opção "Qualquer pessoa com o link pode visualizar", gerando uma URL pública criptografada para acesso de leitura.

**Fluxos de exceção:**
- *E-mail de destinatário inválido:* Se o usuário digitar um e-mail com formato inválido, o sistema impede o envio e exibe: "Formato de e-mail inválido".

**Pós-condições:** O convite de compartilhamento é registrado e a permissão é concedida assim que aceito.

**Critérios de aceite:**
- [ ] Convites pendentes devem expirar automaticamente após 7 dias se não forem aceitos.
- [ ] A alteração do estado de compartilhamento deve refletir no painel de controle do projeto em menos de 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Compartilhar textos

**ID:** UC-082  
**Requisito relacionado:** RF-82 (compartilhar textos)  
**Ator(es):** Usuário (Escritor/Dono do texto), Sistema  
**Pré-condições:** O texto específico existe e está aberto.  
**Gatilho:** O usuário abre o menu de contexto do texto e seleciona "Compartilhar Documento".  

**Fluxo principal:**
1. O usuário abre o menu de compartilhamento do documento.
2. O usuário escolhe se deseja compartilhar de forma privada ou gerar um link de leitura exclusivo para aquele arquivo específico.
3. O usuário seleciona "Gerar Link de Leitura".
4. O sistema gera um hash criptográfico seguro e anexa à URL do texto.
5. O usuário copia a URL para enviar.

**Fluxos alternativos:**
- *Revogar compartilhamento:* O usuário clica em "Desativar Link de Leitura", invalidando o hash anterior e tornando o texto privado novamente.

**Fluxos de exceção:**
- *Tentativa de edição por link de leitura:* Se um visitante tentar alterar o texto por meio do link de leitura público, o sistema bloqueia qualquer entrada de teclado e exibe "Modo de visualização. Edição bloqueada".

**Pós-condições:** O texto fica acessível de forma isolada por terceiros autorizados através de link específico.

**Critérios de aceite:**
- [ ] A geração de link de texto não deve expor metadados confidenciais do projeto.
- [ ] O sistema deve carregar a página de visualização do texto compartilhado em menos de 1,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Controlar permissões de acesso

**ID:** UC-083  
**Requisito relacionado:** RF-83 (controlar permissões de acesso)  
**Ator(es):** Usuário (Administrador/Dono do Projeto), Sistema  
**Pré-condições:** Colaboradores já fazem parte do projeto compartilhado.  
**Gatilho:** O administrador acessa a tela de "Gestão de Colaboradores".  

**Fluxo principal:**
1. O administrador acessa o painel de controle do projeto e clica em "Membros e Permissões".
2. O sistema lista todos os usuários vinculados ao projeto com suas respectivas funções atuais.
3. O administrador clica no seletor de perfil (dropdown) ao lado do nome do colaborador "User B".
4. O administrador altera de "Leitor" para "Editor".
5. O sistema atualiza o registro de autorização na tabela de membros do banco de dados.
6. O sistema aplica o novo escopo de permissões no próximo carregamento de sessão do User B.

**Fluxos alternativos:**
- *Remover colaborador:* O administrador clica em "Remover" e o sistema remove o acesso do usuário ao projeto imediatamente.

**Fluxos de exceção:**
- *Tentar rebaixar o único Owner:* Se o administrador for o único dono do projeto e tentar alterar sua própria permissão para uma menor, o sistema impede a ação e exibe: "O projeto precisa ter pelo menos um Dono (Owner)".

**Pós-condições:** A política de acesso do colaborador é atualizada na base de dados e aplicada na interface.

**Critérios de aceite:**
- [ ] A alteração de permissão deve desautorizar chamadas de escrita na API para o usuário correspondente imediatamente após salvar.
- [ ] O painel deve registrar a ação administrativa no Log de Auditoria.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Personalizar interface

**ID:** UC-084  
**Requisito relacionado:** RF-84 (personalizar interface)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O usuário está na tela de configurações de preferência.  
**Gatilho:** O usuário clica em "Personalizar Interface" ou "Layout".  

**Fluxo principal:**
1. O usuário abre o painel de configurações do usuário e seleciona a seção "Interface".
2. O sistema apresenta opções para alterar: Densidade do layout, Visibilidade da barra lateral, Tamanho dos painéis e Posição do menu de navegação.
3. O usuário altera a densidade para "Compacto" e ativa "Recolher barra lateral por padrão".
4. O sistema aplica os estilos CSS de layout e salva os dados na tabela de preferências de usuário.

**Fluxos alternativos:**
- *Restaurar padrões:* O usuário clica em "Restaurar layout padrão", fazendo o sistema resetar todos os estilos de interface salvos.

**Fluxos de exceção:**
- *Falha ao salvar preferências na nuvem:* O sistema salva localmente no localStorage para garantir que a interface continue personalizada na máquina atual até reconectar.

**Pós-condições:** O layout visual da aplicação se ajusta às preferências do usuário.

**Critérios de aceite:**
- [ ] O layout compacto deve reduzir margens e paddings em pelo menos 30% em relação ao layout confortável.
- [ ] As mudanças de layout devem ser aplicadas instantaneamente sem necessidade de recarregar a página.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Personalizar cores

**ID:** UC-085  
**Requisito relacionado:** RF-85 (personalizar cores)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** As configurações de aparência estão acessíveis.  
**Gatilho:** O usuário clica na paleta de cores ou tema de colorização do projeto.  

**Fluxo principal:**
1. O usuário acessa "Configurações de Aparência" -> "Cores do Tema".
2. O sistema exibe um mapa de paletas de cores padrão e um seletor de cores customizadas.
3. O usuário altera a cor primária para indigo e a cor de fundo para slate dark.
4. O sistema atualiza as variáveis CSS globais da aplicação com os novos valores.
5. O sistema armazena o mapa de cores no banco de dados de preferências do usuário.

**Fluxos alternativos:**
- *Colorir itens individuais:* O usuário altera a cor de fundo de uma pasta específica na árvore lateral.

**Fluxos de exceção:**
- *Cores com baixo contraste:* Se o usuário escolher uma combinação com contraste inferior a 4.5:1 (WCAG), o sistema emite um aviso sugerindo cores com melhor contraste.

**Pós-condições:** A aplicação atualiza o esquema de cores e aplica a nova identidade visual.

**Critérios de aceite:**
- [ ] A aplicação de novas paletas de cores deve cobrir botões, textos, menus e destaques da interface.
- [ ] As cores personalizadas devem ser salvas e sincronizadas entre as sessões do usuário.

**Prioridade:** Baixa  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Personalizar ícones

**ID:** UC-086  
**Requisito relacionado:** RF-86 (personalizar ícones)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** Árvore de arquivos com pastas e textos criados.  
**Gatilho:** O usuário seleciona "Alterar Ícone" no menu de opções de um arquivo ou pasta.  

**Fluxo principal:**
1. O usuário clica com o botão direito sobre uma pasta e escolhe "Mudar Ícone".
2. O sistema abre um popover contendo um catálogo de ícones organizados por categorias.
3. O usuário busca por "usuário" e seleciona um ícone de silhueta de personagem.
4. O sistema atualiza o ícone da pasta no banco de dados.
5. A interface exibe imediatamente o novo ícone selecionado ao lado do nome da pasta.

**Fluxos alternativos:**
- *Upload de ícone customizado:* O usuário envia uma imagem SVG pequena de sua própria máquina para servir de ícone.

**Fluxos de exceção:**
- *SVG inválido no upload:* Se o arquivo SVG enviado contiver tags suspeitas (scripts/XSS), o sistema rejeita o upload e alerta sobre a invalidade.

**Pós-condições:** O item selecionado passa a exibir o ícone customizado.

**Critérios de aceite:**
- [ ] O catálogo padrão deve disponibilizar pelo menos 100 ícones vetoriais comuns.
- [ ] A troca do ícone na árvore de diretórios deve ser instantânea (< 100ms).

**Prioridade:** Baixa  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Reconhecer OCR em imagens

**ID:** UC-087  
**Requisito relacionado:** RF-87 (reconhecer OCR em imagens)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O usuário realizou o upload de uma imagem que contém caracteres textuais.  
**Gatilho:** O usuário clica em "Reconhecer Texto (OCR)" sobre a imagem carregada na galeria.  

**Fluxo principal:**
1. O sistema envia a imagem para o serviço de OCR no backend.
2. O motor de OCR processa os padrões visuais da imagem para identificar letras e números.
3. O sistema mapeia os blocos de texto identificados na imagem.
4. O sistema apresenta o resultado em uma janela modal exibindo a imagem de um lado e o texto extraído do outro.

**Fluxos alternativos:**
- *OCR automático no upload:* Se a configuração de OCR automático estiver ligada, o sistema extrai o texto invisivelmente no momento do upload.

**Fluxos de exceção:**
- *Imagem sem texto legível:* Se o motor de OCR retornar nenhuma letra identificada, o sistema notifica: "Nenhum texto legível foi detectado nesta imagem".

**Pós-condições:** O texto presente na imagem é reconhecido e preparado para extração física.

**Critérios de aceite:**
- [ ] O sistema de OCR deve suportar reconhecimento em língua portuguesa, incluindo acentuações.
- [ ] O processamento de imagens de até 4K de resolução deve demorar no máximo 5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Extrair texto de imagens

**ID:** UC-088  
**Requisito relacionado:** RF-88 (extrair texto de imagens)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O processo de OCR (UC-087) foi concluído com sucesso em uma imagem.  
**Gatilho:** O usuário clica no botão "Copiar Texto Extraído" ou "Inserir no Editor".  

**Fluxo principal:**
1. O usuário visualiza o modal de texto extraído do OCR da imagem.
2. O usuário revisa o texto gerado pela extração.
3. O usuário clica em "Inserir no Editor".
4. O sistema insere o texto extraído na posição do cursor ativo no editor.
5. A imagem original permanece salva, mas seu conteúdo passa a fazer parte do texto editável.

**Fluxos alternativos:**
- *Criar novo documento:* O usuário clica em "Salvar como Novo Texto", gerando um arquivo contendo a transcrição da imagem no projeto.

**Fluxos de exceção:**
- *Editor fechado:* Se o usuário tentar inserir o texto no editor sem nenhum documento aberto, o sistema força a criação de um novo documento e insere o conteúdo.

**Pós-condições:** O conteúdo textual extraído da imagem é incorporado no fluxo de edição do projeto.

**Critérios de aceite:**
- [ ] A inserção do texto no editor deve preservar quebras de linha detectadas no OCR para manter a estrutura original de parágrafos.
- [ ] O texto copiado deve ser limpo de marcações internas do OCR.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Gerar PDF ilustrado do universo

**ID:** UC-089  
**Requisito relacionado:** RF-89 (gerar PDF ilustrado do universo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui textos, imagens de capa de pastas, de textos e fichas de personagens estruturadas.  
**Gatilho:** O usuário acessa "Exportar" -> "PDF Ilustrado do Universo".  

**Fluxo principal:**
1. O usuário seleciona o escopo de exportação e um estilo visual de layout (ex: "Livro de Regras").
2. O usuário clica em "Compilar PDF".
3. O backend envia uma requisição para a fila de renderização.
4. O motor de renderização constrói um HTML formatado com quebras de página, sumário dinâmico, números de páginas e cabeçalhos.
5. O sistema incorpora as imagens de capa das pastas como separadores de seções de página inteira e as imagens dos textos ao lado de suas descrições.
6. O sistema gera o PDF consolidado de alta resolução e inicia o download.

**Fluxos alternativos:**
- *Download assíncrono:* Para PDFs muito grandes (mais de 100 páginas), o sistema envia o processo para segundo plano e avisa ao usuário contendo o link de download assim que concluído.

**Fluxos de exceção:**
- *Imagens corrompidas:* Se o renderizador encontrar links de imagens quebrados, ele substitui a imagem por um placeholder de moldura cinza para não interromper a compilação do arquivo.

**Pós-condições:** O PDF ilustrado e formatado com a enciclopédia do universo do usuário é gerado e baixado.

**Critérios de aceite:**
- [ ] O PDF deve conter um índice/sumário dinâmico com numeração de páginas correspondente gerada automaticamente.
- [ ] A exportação de um documento ilustrado com 50 páginas e 20 imagens deve demorar menos de 15 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Gerar wiki automaticamente

**ID:** UC-090  
**Requisito relacionado:** RF-90 (gerar wiki automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Existem entidades catalogadas e textos vinculados no projeto.  
**Gatilho:** O usuário clica em "Gerar Wiki do Projeto" no painel do universo.  

**Fluxo principal:**
1. O sistema lê o banco de dados de entidades e os textos públicos/cânones.
2. A IA consolida as informações das fichas estruturadas e converte-as em artigos formatados em linguagem wiki.
3. O sistema cria hiperlinks automáticos entre os artigos da wiki com base nas referências mútuas identificadas no grafo de entidades.
4. O sistema gera e publica o portal web da wiki localmente ou em uma URL privada temporária.
5. O usuário visualiza o portal interativo contendo barra de busca.

**Fluxos alternativos:**
- *Publicar Wiki pública:* O usuário ativa a opção "Tornar Wiki Pública" gerando um subdomínio web estático indexável.

**Fluxos de exceção:**
- *Dados sigilosos:* O sistema de compilação da wiki filtra e remove automaticamente anotações marcadas como "confidenciais" ou "ocultas".

**Pós-condições:** A wiki interativa e auto-linkada é gerada de forma automatizada.

**Critérios de aceite:**
- [ ] A wiki gerada deve manter os hyperlinks funcionais entre os tópicos cadastrados para garantir a navegabilidade de ponta a ponta.
- [ ] O layout estático gerado deve ser compatível com dispositivos móveis.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---

## Tabela Resumo: Lote 9 (UC-081 a UC-090)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-081** | RF-81 (compartilhar projetos) | Alta | Média |
| **UC-082** | RF-82 (compartilhar textos) | Alta | Média |
| **UC-083** | RF-83 (controlar permissões de acesso) | Crítica | Média |
| **UC-084** | RF-84 (personalizar interface) | Média | Baixa |
| **UC-085** | RF-85 (personalizar cores) | Baixa | Baixa |
| **UC-086** | RF-86 (personalizar ícones) | Baixa | Baixa |
| **UC-087** | RF-87 (reconhecer OCR em imagens) | Média | Alta |
| **UC-088** | RF-88 (extrair texto de imagens) | Média | Média |
| **UC-089** | RF-89 (gerar PDF ilustrado do universo) | Média | Alta |
| **UC-090** | RF-90 (gerar wiki automaticamente) | Alta | Alta |
