# Infra Launch — modo exclusivamente local

Esta pasta concentra o que **não pode ser concluído ou validado somente no computador local**. Nada aqui bloqueia a execução local-first do Eldritch Lich.

## Serviços locais iniciáveis

A pilha em `../infra/docker-compose.yml` usa apenas containers locais:

As imagens estão fixadas em tags existentes (`pgvector 0.8.5/PostgreSQL 16` e MinIO `2025-07-23`) para impedir que tags removidas interrompam a inicialização local.

| Serviço | Endereço local | Uso |
| --- | --- | --- |
| PostgreSQL + pgvector | `postgresql://postgres:development_password@localhost:5432/eldritch_lich` | Banco e vetores para desenvolvimento. |
| Redis | `redis://localhost:6379` | Pub/Sub, cache, filas e colaboração multi-processo local. |
| MinIO (S3) | API: `http://localhost:9100`; console: `http://localhost:9101` | Substituto local para armazenamento de objetos. |
| Linguística Stanza | `http://127.0.0.1:8008` | NER, POS, lemas e dependências em português usados na análise de manuscritos. |

Comandos:

```bash
docker compose -f infra/docker-compose.yml up -d
docker compose -f infra/docker-compose.yml ps
docker compose -f infra/docker-compose.yml down
```

Para iniciar somente o analisador linguístico:

```bash
docker compose -f infra/docker-compose.yml up -d --build linguistics
curl http://127.0.0.1:8008/health
```

Na primeira análise, o Stanza baixa o modelo de português para o volume Docker
`stanza_models`. Depois disso a análise ocorre inteiramente na máquina local.
Defina `NEXT_PUBLIC_LOCAL_LINGUISTICS_URL=http://127.0.0.1:8008` em
`apps/web/.env.local`, reinicie o Next e use **Refazer tudo** no editor. Sem o
serviço, o editor segue com a heurística conservadora local, sem enviar texto a
uma API.

Aplicação web local: `http://127.0.0.1:3001` (a porta `3000` já está ocupada nesta máquina). Para iniciá-la manualmente:

```bash
cd apps/web
./node_modules/.bin/next dev -H 127.0.0.1 -p 3001
```

Para a aplicação web, use as variáveis abaixo (somente desenvolvimento):

```env
DATABASE_URL=postgresql://postgres:development_password@localhost:5432/eldritch_lich
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:9100
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin_secret
S3_BUCKET=eldritch-lich
```

O frontend, IndexedDB/Dexie, exportações locais, IA local no navegador e os fallbacks determinísticos continuam funcionando sem nenhum container.

## Itens que exigem serviço ou autoridade externa

| Roadmap | Por que não é exclusivamente local | O que será necessário depois |
| --- | --- | --- |
| Login Google/GitHub (UC-237) | OAuth exige aplicativo registrado, client IDs e callback público HTTPS. | Projeto Google Cloud e GitHub App/OAuth App. |
| Drive, Dropbox e OneDrive (UC-222–224) | Os arquivos pertencem às APIs dos provedores e requerem consentimento OAuth. | Registros de aplicativo, escopos e contas dos provedores. |
| E-mail transacional e notificações fora da sessão | Entrega real depende de SMTP/provedor de e-mail ou push. | Provedor SMTP/push e domínio verificado. |
| TLS/HSTS público e deploy sem downtime (UC-415/439) | Certificado confiável, DNS e rollout exigem uma hospedagem acessível externamente. | Domínio, DNS e conta de hospedagem. |
| Escala horizontal/SLA/monitoramento (UC-419, UC-424–427) | Métricas de disponibilidade e múltiplas réplicas não são demonstráveis em uma máquina isolada. | Observabilidade e ambiente com múltiplas instâncias. |
| Colaboração entre dispositivos | Redis local habilita desenvolvimento, mas Internet/NAT e identidades reais exigem servidor público. | Serviço Socket.IO/WebSocket publicado e Redis gerenciado ou acessível. |
| Modelos NLP grandes especializados | Podem ser substituídos por fallbacks locais; modelos pesados requerem GPU/memória ou worker dedicado. | Hardware local adequado ou infraestrutura de GPU autorizada. |

## Regras locais

* Não inserir credenciais reais de provedores em `.env.local` ou no repositório.
* Usar somente credenciais de desenvolvimento da pilha acima; elas não são seguras para produção.
* As portas padrão `9000` e `9001` estão ocupadas nesta máquina; por isso o MinIO desta aplicação usa `9100` e `9101`.
* O ambiente local foi iniciado e validado em 06/08/2026: PostgreSQL, Redis e MinIO estão saudáveis; a aplicação web responde em `127.0.0.1:3001`.
* Serviços externos permanecem desligados e explicitamente documentados até autorização do proprietário.
