# Analisador linguístico local

Este serviço é o acompanhante local do editor. Ele usa Stanza para tokenização,
POS, lema, dependências e reconhecimento de entidades em português. Não recebe
dados do projeto fora de `127.0.0.1`.

## Iniciar

```bash
docker compose -f infra/docker-compose.yml up -d --build linguistics
curl http://127.0.0.1:8008/health
```

No primeiro pedido ao endpoint `POST /analyze`, o modelo `pt` é instalado no
volume `stanza_models`; mantenha a máquina conectada apenas nessa inicialização.
As execuções seguintes usam o volume já baixado. Para conectá-lo à interface,
crie `apps/web/.env.local` com:

```env
NEXT_PUBLIC_LOCAL_LINGUISTICS_URL=http://127.0.0.1:8008
```

O contrato é `{ text, language: "pt" }` e a resposta contém entidades `PER`,
`LOC`, `ORG` e `MISC` com offsets no texto. A interface promove somente as três
primeiras categorias para candidatos revisáveis; `MISC` nunca vira dado canônico.
