# Casos de Uso - Lote 46 (UC-451 a UC-453)

Este documento contém a especificação final dos casos de uso de 451 a 453 derivados dos Requisitos Não Funcionais (RNFs) Baixos do projeto.

---
### Caso de Uso: Permitir integração futura com plugins de terceiros sem reescrita do núcleo (RNF)

**ID:** UC-451  
**Requisito relacionado:** RNF-Low-4 (integração de plugins sem alteração do core)  
**Ator(es):** Sistema (Arquitetura de Extensões), Desenvolvedor do Plugin  
**Pré-condições:** API de plugins baseada em ganchos (hooks) e barramento de eventos (event bus) configurada no núcleo da aplicação.  
**Gatilho:** Um plugin externo de terceiros tenta registrar novos recursos e ouvir eventos.  

**Fluxo principal:**
1. O plugin de terceiros é carregado pelo usuário na aba correspondente de extensões da plataforma.
2. O plugin se registra no núcleo utilizando a API pública de registros de extensões.
3. O plugin define ganchos de escuta (hooks) para eventos específicos da aplicação (ex: digitação do editor).
4. O usuário digita no editor e o barramento de eventos do núcleo dispara notificações para o plugin.
5. O plugin recebe os dados, executa sua lógica em sandbox isolado e exibe as formatações e widgets autorizados de volta ao usuário na tela.

**Fluxos alternativos:**
- *Desativação instantânea:* O usuário desativa a extensão correspondente no painel de configurações. O sistema desinscreve os ganchos do barramento de eventos de imediato, liberando recursos sem necessidade de recarregar o sistema.

**Fluxos de exceção:**
- *Instabilidade do plugin:* Se a execução do plugin apresentar lentidões ou loops infinitos de processamento que afetem a performance, o sandbox do núcleo interrompe a execução correspondente de segurança, exibindo alerta ao usuário de que a extensão foi desativada.

**Pós-condições:** O plugin externo é integrado e executado de forma isolada sem necessidade de modificação do código central do sistema.

**Critérios de aceite:**
- [ ] A arquitetura de plugins deve rodar em sandbox isolado (worker dedicado) para evitar que falhas de terceiros travem a aplicação.
- [ ] A chamada de inicialização e registro de hooks do plugin no barramento de eventos deve durar menos de 100ms.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Otimizar uso de armazenamento (compressão de imagens, textos) (RNF)

**ID:** UC-452  
**Requisito relacionado:** RNF-Low-5 (otimização e compressão de armazenamento)  
**Ator(es):** Sistema, Backend (Módulo de Compressão)  
**Pré-condições:** Utilitários de compressão e redimensionamento de imagens (ex: Sharp) e dados configurados no servidor.  
**Gatilho:** O usuário realiza upload de imagens pesadas ou salva grandes volumes de texto.  

**Fluxo principal:**
1. O usuário realiza o upload de um arquivo de imagem pesado para a galeria de mídias.
2. O backend recebe o arquivo correspondente na rota de uploads.
3. O sistema direciona o arquivo para o processador de imagens Sharp.
4. O processador comprime, otimiza e converte o arquivo para formatos modernos de alta eficiência (ex: WebP/AVIF), reduzindo o tamanho de armazenamento.
5. O sistema grava o arquivo comprimido no bucket de mídias correspondente e atualiza os links no banco de dados.

**Fluxos alternativos:**
- *Compressão de dados do banco:* O sistema comprime periodicamente logs de texto e históricos de versões inativas do banco de dados utilizando algoritmos sem perda de dados (Brotli/Gzip) para poupar espaço em disco.

**Fluxos de exceção:**
- *Arquivo corrompido:* Se a imagem enviada estiver danificada ou em formato inválido que impeça o processamento, o sistema cancela o upload e informa o erro na tela.

**Pós-condições:** O arquivo compactado e otimizado é armazenado no bucket de mídias, economizando espaço em disco.

**Critérios de aceite:**
- [ ] O tamanho do arquivo de imagem comprimida em formato WebP deve ser de no mínimo 60% menor em relação à imagem crua original.
- [ ] O processamento e conversão de uma imagem de 10MB devem demorar menos de 1,5 segundos no servidor.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Oferecer sugestões de performance ao usuário (RNF)

**ID:** UC-453  
**Requisito relacionado:** RNF-Low-6 (sugestões de performance ao usuário)  
**Ator(es):** Sistema, Usuário  
**Pré-condições:** Regras de monitoramento de tamanhos de pastas e volumes de dados ativas.  
**Gatilho:** Uma pasta ou volume de dados do projeto excede os limites ideais de performance.  

**Fluxo principal:**
1. O usuário insere um volume excessivo de notas ou arquivos dentro de uma única pasta do projeto.
2. O sistema de monitoramento em background avalia a quantidade de arquivos na estrutura da pasta correspondente.
3. O sistema detecta que o limite ideal recomendado de arquivos por pasta foi superado (risco de lentidão na renderização).
4. O sistema gera uma notificação visual amigável no painel sugerindo reorganizar em subpastas ou arquivar itens.
5. O usuário visualiza o aviso de performance e organiza seus diretórios.

**Fluxos alternativos:**
- *Arquivos órfãos na galeria:* O sistema detecta mídias antigas na galeria de imagens que não estão mais referenciadas em nenhuma ficha ou texto ativo, sugerindo a exclusão para liberação de espaço do plano.

**Fluxos de exceção:**
- *Desativação de dicas:* O usuário desabilita os alertas de dicas de performance no menu de configurações do perfil, e o sistema silencia novos avisos.

**Pós-condições:** A notificação preventiva de otimização de performance é exibida e registrada.

**Critérios de aceite:**
- [ ] As varreduras de monitoramento de volume de dados devem rodar de forma assíncrona uma vez por dia de madrugada para não gerar lentidões.
- [ ] O alerta visual deve ser discreto e de fácil fechamento (dismiss).

---

## Tabela Resumo: Lote 46 (UC-451 a UC-453)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-451** | RNF-Low-4 (arquitetura de plugins em sandbox) | Baixa | Alta |
| **UC-452** | RNF-Low-5 (compressão de mídias Sharp/WebP) | Média | Média |
| **UC-453** | RNF-Low-6 (alertas de dicas de performance) | Baixa | Baixa |
