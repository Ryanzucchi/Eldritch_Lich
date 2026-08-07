# Auditoria de Dados do Projeto

## Responsabilidade

Permite inspecionar a base local real do projeto ativo, sem depender dos arquivos JSON usados pelas rotas de desenvolvimento. A tela em `app/audit/page.tsx` lê a instância Dexie identificada pelo projeto e pode baixar um dump completo.

## Fluxo

1. O usuário abre **Pesquisa e análise → Auditoria de dados**.
2. **Auditar projeto** executa verificações estruturais sem modificar nenhum registro.
3. **Exportar JSON** executa a mesma auditoria e baixa o formato `eldritch-lich.indexeddb-export.v1` com todas as tabelas locais.

## Verificações atuais

- referências de entidades, genealogias, cronologia, comentários, versões e históricos de automação;
- nomes duplicados entre fichas e entidades de wiki;
- relações familiares repetidas ou autorreferentes;
- posições cronológicas duplicadas;
- conteúdo de manuscrito cujo HTML foi escapado durante a importação;
- metadados mínimos dos registros coletados automaticamente.
- candidatos de extração sem evidência, confiança abaixo de `0,88`, versão da heurística, execução (`runId`), hash da fonte ou chave versionada;
- fingerprints duplicados que poderiam reaplicar a mesma extração.

## Limites e revisão literária

O resultado “sem problema estrutural” não confirma que uma entidade, evento ou parentesco representa corretamente a obra-fonte. Essa validação exige comparar os campos e seus trechos de evidência no JSON exportado com o PDF/manuscrito de origem. A tela não corrige nem exclui dados automaticamente.

## Dependências

- `apps/web/src/db/schema.ts`: define as tabelas Dexie da instância local.
- `apps/web/src/services/project-audit.ts`: serializa e audita os registros.
- `apps/web/src/app/audit/page.tsx`: expõe o fluxo ao usuário.
- `apps/web/src/services/manuscript-extraction.ts`: cria candidatos conservadores e revisáveis.
