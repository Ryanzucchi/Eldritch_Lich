# Padrões de qualidade para os casos de uso

Este documento é normativo para os 453 casos de uso deste diretório. Ele traduz a base científica do projeto em critérios de especificação e prevalece sobre detalhes contraditórios em casos individuais.

## Princípios transversais

1. **Local-first e privacidade por padrão.** Texto, metadados e índices do projeto permanecem no dispositivo como fonte primária de verdade. Sincronização é assíncrona e tolerante a períodos offline. Nenhum conteúdo é enviado a serviço externo de IA sem consentimento específico, informado e revogável.
2. **Assistência preserva agência autoral.** Saídas de IA são sugestões, nunca edições implícitas. Devem indicar incerteza quando cabível, permitir ignorar, corrigir ou desativar o recurso e não podem impedir escrita, salvamento ou publicação.
3. **Rastreabilidade.** Toda resposta factual, alerta de inconsistência, resumo ou recomendação baseada no projeto conserva versões/identificadores das fontes e permite abrir o trecho de origem. Sem evidência suficiente, o sistema declara a limitação.
4. **Consistência colaborativa.** Recursos simultâneos usam CRDTs para texto e dados estruturados. O servidor autentica, autoriza, persiste e retransmite atualizações; não arbitra sua ordenação nem inventa conflitos de conteúdo. Clientes desconectados convergem ao receber atualizações; decisões semânticas são humanas.
5. **Segurança e isolamento por desenho.** Autorização é validada no servidor e na camada de dados, com menor privilégio e escopo de projeto/recurso. Senhas usam hash adaptativo e salt único, nunca criptografia reversível. Logs não contêm manuscritos, segredos ou dados pessoais desnecessários.
6. **Acessibilidade, desempenho e avaliação.** Critérios de aceite definem contexto de medição, percentil e massa de dados. Interações críticas funcionam por teclado e leitor de tela. Modelos de IA são avaliados com corpus representativo em português, incluindo qualidade e falsos positivos/negativos.

## Aplicação por categoria

| Categoria | Regras adicionais de aceite |
| --- | --- |
| IA/NLP, busca e recomendações | Informar fonte, versão e confiança; processar localmente por padrão; oferecer revisão humana. |
| Editor, autosave e importação/exportação | Operar offline; preservar conteúdo; não sobrescrever dados sem versão/conflito explícito; validar arquivos. |
| Colaboração | Verificar autorização por recurso; propagar atualizações idempotentes; testar convergência sob reconexão e concorrência. |
| Grafo, timeline e worldbuilding | Manter proveniência temporal e distinguir inferências de fatos confirmados. |
| Pesquisa científica | Preservar metadados, proveniência e licença; nunca fabricar citações; permitir correção manual. |
| Privacidade, segurança e operação | Aplicar defesa em profundidade, testes negativos de autorização, backups/restauração testados e retenção documentada. |

## Base científica utilizada

- `basecientifica/Sistemas de recuperação de conhecimento pessoal (PKM)/tese/07-pkm-cap3-referencial-teorico.md` — local-first, privacidade e sincronização CRDT.
- `basecientifica/Edição colaborativa em tempo real/tese/06-edicao-colaborativa-cap2-introducao.md` — consistência eventual forte, texto rico e colaboração offline.
- `basecientifica/Detecção de contradição e consistência narrativa/` — alertas explicáveis e revisão autoral.
- `basecientifica/Sistemas de recomendação e sugestão contextual/tese/09-recomendacao-cap7-conclusao.md` — sugestões contextuais e não intrusivas.
- `basecientifica/Arquitetura de sistemas multi-tenant e escalabilidade/` — isolamento, autorização e escalabilidade.
