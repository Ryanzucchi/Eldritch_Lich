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
