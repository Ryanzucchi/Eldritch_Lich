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

**Prioridade:** Baixa  
**Complexidade estimada:** Baixa
