### Caso de Uso: Exportar cronologia interativa em formato HTML/JS

**ID:** UC-264  
**Requisito relacionado:** RF-264 (exportar cronologia interativa em formato HTML/JS)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui eventos de timeline cadastrados.  
**Gatilho:** O usuário seleciona "Exportar Timeline Interativa (.html)" no menu de exportações do projeto.  

**Fluxo principal:**
1. O usuário acessa o menu de exportação da timeline.
2. O usuário escolhe a opção "Linha do Tempo Web Interativa (.html)".
3. O backend monta um arquivo HTML contendo a estrutura de dados dos eventos e embute um script JS leve com biblioteca de renderização de timeline.
4. O sistema gera os estilos de visualização responsivos (CSS embutido).
5. O navegador baixa o arquivo `cronologia_interativa.html`.
6. Ao abrir o arquivo em qualquer navegador local offline, o usuário visualiza e interage com a linha do tempo.

**Fluxos alternativos:**
- *Embutir em site:* O usuário exporta o trecho como código iframe pronto para embutir na sua wiki pública ou blog.

**Fluxos de exceção:**
- *Imagens hospedadas localmente:* Se os eventos contiverem fotos, o sistema embute as mídias no HTML via codificação Base64 para garantir a exibição offline do arquivo exportado.

**Pós-condições:** O arquivo HTML/JS independente da timeline interativa é gerado e baixado.

**Critérios de aceite:**
- [ ] A timeline HTML exportada deve rodar sem necessidade de conexão com a internet (autocontida).
- [ ] O tamanho do arquivo HTML resultante não deve exceder 5MB para timelines padrão.

**Prioridade:** Média  
**Complexidade estimada:** Alta
