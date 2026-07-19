### Caso de Uso: Emitir notas fiscais automaticamente

**ID:** UC-386  
**Requisito relacionado:** RF-385 (emitir notas fiscais automaticamente)  
**Ator(es):** Sistema, Gateway de Notas Fiscais (API Municipal/Federal), Financeiro  
**Pré-condições:** Dados cadastrais das partes corretos, certificado digital ativo e receita paga.  
**Gatilho:** Uma receita de faturamento de milestone muda para o status "Pago".  

**Fluxo principal:**
1. O cliente realiza o pagamento e o sistema altera o status da receita correspondente para "Pago".
2. O backend dispara o job de emissão de nota fiscal em background de forma automática.
3. O sistema formata a payload da Nota Fiscal contendo dados fiscais das partes, descrição de serviços, valores e alíquotas de impostos.
4. O sistema assina a payload com o certificado digital corporativo e envia via API para a receita.
5. O sistema recebe de retorno o XML e PDF da nota fiscal emitida.
6. O sistema anexa o PDF na receita correspondente e envia por e-mail para o cliente automaticamente.

**Fluxos alternativos:**
- *Emissão manual:* O operador financeiro abre a receita correspondente na tela e clica em "Emitir Nota Fiscal" de forma direta.

**Fluxos de exceção:**
- *Instabilidade do servidor externo:* Se o servidor de validação governamental estiver indisponível, o sistema marca a nota como "Falha na Transmissão - Aguardando Reenvio" e agenda novas tentativas de transmissão automáticas periódicas em background.

**Pós-condições:** A nota fiscal de serviço é emitida na prefeitura correspondente e anexada à transação da receita.

**Critérios de aceite:**
- [ ] O envio do e-mail ao cliente contendo o link da nota e o PDF deve ocorrer em no máximo 5 minutos após a emissão.
- [ ] O armazenamento do arquivo XML de cada nota deve ser garantido por no mínimo 5 anos por obrigatoriedade fiscal.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
