### Caso de Uso: Exportar projeto em formato compactado (.zip)

**ID:** UC-225  
**Requisito relacionado:** RF-225 (exportar projeto em formato compactado (.zip))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto existe e possui dados válidos armazenados no banco de dados.  
**Gatilho:** O usuário clica em "Exportar Backup Completo (.zip)" na aba de segurança do projeto.  

**Fluxo principal:**
1. O usuário abre as configurações avançadas do projeto e acessa "Manutenção e Backups".
2. O usuário clica em "Gerar Arquivo de Backup Completo (.zip)".
3. O backend monta um pacote de exportação completo, contendo:
   - Uma pasta de arquivos de capítulos organizada fisicamente.
   - Arquivos JSON contendo as tabelas de entidades, linhas do tempo, relacionamentos e metadados.
   - Uma pasta de mídias com todas as imagens carregadas no projeto.
4. O sistema compacta todos os arquivos usando o algoritmo standard ZIP.
5. O navegador inicia o download do arquivo compactado.

**Fluxos alternativos:**
- *Criptografar ZIP:* O usuário insere uma senha de segurança no modal e o sistema gera o ZIP protegido por senha AES-256 de forma criptografada.

**Fluxos de exceção:**
- *Estouro de memória:* Se o projeto for excessivamente grande, o backend faz a compressão em fluxo (streaming zip writer) para evitar consumo de memória RAM excessivo da aplicação.

**Pós-condições:** O arquivo compactado contendo todos os dados e arquivos do projeto é baixado para a máquina local do usuário.

**Critérios de aceite:**
- [ ] O pacote ZIP gerado deve incluir um arquivo de manifesto com versão dos dados e hashes MD5 de integridade dos arquivos.
- [ ] O processo de empacotamento em ZIP de um projeto padrão deve demorar menos de 4 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média
