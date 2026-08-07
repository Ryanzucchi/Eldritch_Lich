# Banco de dados local

## Visão geral

O armazenamento principal do Eldritch Lich é **IndexedDB**, acessado pelo navegador por meio de **Dexie**. Não há PostgreSQL, MySQL ou outro servidor de banco de dados configurado para o modo local atual.

- **Classe e schema:** `apps/web/src/db/schema.ts`
- **Versão atual do schema Dexie:** `41`
- **Nome físico por projeto ativo:** `EldritchDatabase_<activeProjectId>`
- **Chaves:** salvo indicação contrária, `id` é a chave primária. Os campos após `id` na coluna de índices são índices Dexie simples, não chaves estrangeiras com integridade automática.
- **Isolamento:** a maior parte dos registros traz `projectId`; a aplicação deve sempre filtrá-lo. IndexedDB não impõe relações, cascatas ou RLS.

Há também um armazenamento auxiliar em arquivos JSON, usado pela API local para login, projetos, pastas, colaboração e a cópia sincronizada de manuscritos. Ele não substitui IndexedDB para os demais módulos.

## Convenções de relacionamento

| Convenção | Significado |
|---|---|
| `projectId` | Registro pertencente a um projeto. |
| `manuscriptId`, `folderId` | Ligação com capítulo ou pasta. |
| `timelineId`, `mapId`, `mindMapId`, `sandboxId`, `channelId` | Ligação com o registro pai do respectivo módulo. |
| `personId`, `relatedPersonId` | Extremidades de uma relação familiar. |
| `*Id` | Referência lógica; a aplicação é responsável por validar/remover referências órfãs. |

## Tabelas IndexedDB

### Escrita, editor e automação

| Tabela | Chave e índices | Schema lógico / finalidade |
|---|---|---|
| `manuscripts` | `id`; `status`, `title`, `folderId`, `category`, `isArchived` | `Manuscript`: capítulo (`title`, `content`, `status`, `isLocked`, `projectId`, pasta, lixeira, tags, datas). |
| `manuscriptVersions` | `id`; `manuscriptId`, `versionNumber`, `createdAt` | Snapshot: `manuscriptId`, número, título, conteúdo e criação. |
| `pendingSaves` | `id`; `manuscriptId`, `timestamp` | Fila offline: capítulo, conteúdo e instante numérico. |
| `folders` | `id`; `projectId`, `parentFolderId` | `Folder`: nome, projeto, pasta-pai, capa e permissão de escrita. |
| `comments` | `id`; `manuscriptId`, `isResolved`, `createdAt` | `InlineComment`: comentário no texto, autor, estado e datas. |
| `auditLogs` | `id`; `type`, `timestamp` | `SystemActivity`: auditoria de ações do sistema. |
| `reminders` | `id`; `projectId`, `alertTime`, `isRead` | Lembrete: texto, capítulo opcional, alerta, importância e leitura. |
| `keyboardShortcuts` | `command` (chave) | Atalhos: `command`, `keyCombo`. |
| `automationHistories` | `id`; `projectId`, `source`, `kind`, `status`, `manuscriptId`, `createdAt` | Histórico de coletas automáticas. Campos: resumo, `payload`, origem (`MANUSCRIPT_EXTRACTION`, `SEMANTIC_SCAN`, `SANDBOX_GENERATION`, `TEXT_ANALYSIS`), estado e capítulo opcional. |
| `extractionCandidates` | `id`; `projectId`, `manuscriptId`, `fingerprint`, `status`, `createdAt` | Candidato revisável de extração: evidência serializada, confiança, versão da heurística, chave idempotente e decisão (`PENDING`, `APPROVED`, `DISCARDED`). Não é uma ficha do universo. |

### Planejamento, estrutura narrativa e métricas

| Tabela | Chave e índices | Schema lógico / finalidade |
|---|---|---|
| `metaNodes` | `id`; `type`, `status`, `title` | `MetaNode`: nó do grafo de metas narrativas. |
| `metaEdges` | `id`; `fromId`, `toId` | `MetaEdge`: dependência entre nós de metas. |
| `writingGoals` | `id`; `type`, `targetWords`, `deadline` | `WritingGoal`: meta de escrita. |
| `writingLogs` | `id`; `date` | `WritingLog`: produção diária. |
| `writingStreak` | `id` | `WritingStreak`: sequência de escrita. |
| `storyActs` | `id`; `projectId`, `sortOrder` | `StoryAct`: ato da história e ordem. |
| `heroJourneyStages` | `id`; `projectId`, `characterName`, `stepNumber` | `HeroJourneyStage`: etapa da jornada do herói. |
| `characterArcPoints` | `id`; `projectId`, `characterName`, `sortOrder` | `CharacterArcPoint`: ponto de arco de personagem. |

### Universo, cronologia, mapas e relações

| Tabela | Chave e índices | Schema lógico / finalidade |
|---|---|---|
| `wikiEntities` | `id`; `projectId`, `name`, `type`, `isConfidential` | Entidade do universo: personagem/local/item/organização/criatura, descrição, conteúdo e confidencialidade. |
| `characterSheets` | `id`; `projectId`, `name`, `role`, `factionId` | `CharacterSheet`: ficha, papel, nascimento/idade, facção, biografia e capítulos mencionados. |
| `familyRelations` | `id`; `projectId`, `personId`, `relatedPersonId`, `relationType` | `FamilyRelation`: aresta da árvore genealógica (`PAI`, `MAE`, `FILHO`, `CONJUGE`, `IRMAO`). |
| `factionSheets` | `id`; `projectId`, `name`, `leaderId` | `FactionSheet`: facção, líder, brasão e descrição. |
| `locationSheets` | `id`; `projectId`, `name`, `factionId` | `LocationSheet`: local, tipo, facção e descrição. |
| `creatureSheets` | `id`; `projectId`, `name`, `habitatLocationId` | `CreatureSheet`: criatura, habitat, habilidades e descrição. |
| `itemSheets` | `id`; `projectId`, `name`, `ownerCharacterId`, `locationId` | `ItemSheet`: item, dono, local e propriedades. |
| `historicalEventSheets` | `id`; `projectId`, `name`, `locationId` | `HistoricalEventSheet`: evento, data, participantes e local. |
| `entityRelationLinks` | `id`; `projectId`, `sourceEntityId`, `targetEntityId` | Relação genérica entre entidades do universo. |
| `factionWarsOrTreaties` | `id`; `projectId`, `type`, `title` | Guerra, tratado ou acordo entre facções. |
| `fictionalLanguages` | `id`; `projectId`, `name` | Idioma ficcional. |
| `techOrMagicNodes` | `id`; `projectId`, `name`, `category` | Nó de tecnologia ou magia. |
| `religionSheets` | `id`; `projectId`, `name` | Religião, culto ou panteão. |
| `timelines` | `id`; `projectId`, `name` | `Timeline`: cronologia e calendário. |
| `timelineEvents` | `id`; `timelineId`, `sortOrder` | `TimelineEvent`: evento cronológico, data, descrição e predecessores. |
| `geoMaps` | `id`; `projectId`, `name` | `GeoMap`: mapa do universo. |
| `geoMapMarkers` | `id`; `mapId`, `type` | `GeoMapMarker`: ponto e tipo de marcador no mapa. |
| `mindMaps` | `id`; `projectId`, `title` | `MindMap`: mapa mental. |
| `mindMapNodes` | `id`; `mindMapId`, `parentId` | `MindMapNode`: nó e hierarquia de mapa mental. |

### Cenários, mídia, pesquisa e GDD

| Tabela | Chave e índices | Schema lógico / finalidade |
|---|---|---|
| `sandboxes` | `id`; `projectId`, `name`, `isPromoted` | `SandboxEnvironment`: cenário/laboratório hipotético e promoção para o cânone. |
| `sandboxChanges` | `id`; `sandboxId`, `entityType` | `SandboxChange`: alteração simulada em uma entidade. |
| `mediaAssets` | `id`; `projectId`, `category`, `entityName` | `MediaAsset`: referência visual ou multimídia local. |
| `referenceItems` | `id`; `projectId`, `type`, `title` | `ReferenceItem`: fonte/referência de pesquisa. |
| `researchNotes` | `id`; `projectId`, `title`, `referenceId` | `ResearchNote`: nota ligada opcionalmente a uma referência. |
| `researchProjects` | `id`; `projectId` | `ResearchProject`: agrupador de pesquisa. |
| `gameMechanics` | `id`; `projectId`, `name`, `type` | `GameMechanic`: mecânica de GDD. |
| `playableCharacterBalances` | `id`; `projectId`, `characterName` | Balanceamento de personagem jogável. |
| `gameRules` | `id`; `projectId`, `name`, `version` | Regra de jogo e versão. |
| `gameLevels` | `id`; `projectId`, `name` | Nível/fase de jogo. |
| `gameShops` | `id`; `projectId`, `shopName` | Loja/economia de jogo. |

### Colaboração e comunicação

| Tabela | Chave e índices | Schema lógico / finalidade |
|---|---|---|
| `projectMembers` | `id`; `projectId`, `userEmail`, `role` | `ProjectMember`: membro e papel no projeto. |
| `sharedDocLinks` | `id`; `manuscriptId`, `token` | `SharedDocumentLink`: compartilhamento de capítulo por token. |
| `projectInviteLinks` | `id`; `projectId`, `token`, `isRevoked` | `ProjectInviteLink`: convite e revogação. |
| `collaborationAuditLogs` | `id`; `projectId`, `userId`, `timestamp` | `CollaborationAuditLog`: ação colaborativa auditável. |
| `chatChannels` | `id`; `projectId`, `isArchived` | `ChatChannel`: canal de conversa. |
| `chatMessages` | `id`; `channelId`, `createdAt` | `ChatMessage`: mensagem de canal. |
| `notificationSettings` | `id`; `userId`, `emailFrequency` | `NotificationSettings`: preferências de aviso. |
| `teamMeetings` | `id`; `projectId`, `date` | `TeamMeeting`: reunião e decisões. |
| `voiceMessages` | `id`; `channelId`, `createdAt` | `VoiceMessage`: mensagem de voz registrada. |
| `callSessions` | `id`; `projectId`, `roomName`, `status` | `CallSession`: sessão de chamada. |
| `calendarEvents` | `id`; `projectId`, `startDate`, `category` | `CalendarEvent`: evento de calendário. |
| `memberAvailabilities` | `email` (chave); `timezone`, `status` | `MemberAvailability`: disponibilidade de membro. |

### Administração, RH, objetivos e finanças

| Tabela | Chave e índices | Schema lógico / finalidade |
|---|---|---|
| `employees` | `id`; `projectId`, `cpf`, `email` | `Employee`: colaborador administrativo. |
| `payrollRecords` | `id`; `projectId`, `monthYear`, `employeeId` | `PayrollRecord`: folha de pagamento. |
| `vacationRequests` | `id`; `employeeId`, `status`, `type` | `VacationRequest`: férias/ausência. |
| `timeClockPunches` | `id`; `employeeId`, `punchTime` | `TimeClockPunch`: ponto. |
| `objectiveOkrs` | `id`; `projectId`, `title`, `ownerTeamOrProject`, `status` | `ObjectiveOkr`: objetivo e resultados-chave. |
| `okrCheckInLogs` | `id`; `objectiveId`, `keyResultId`, `authorEmail` | `OkrCheckInLog`: atualização de resultado-chave. |
| `okrTaskLinks` | `id`; `taskId`, `objectiveId`, `keyResultId` | Ligação entre tarefa e OKR. |
| `corporatePortfolios` | `id`; `globalBudget` | `CorporatePortfolio`: portfólio corporativo. |
| `resourceAllocations` | `id`; `employeeId`, `projectId`, `resourceType` | `ResourceAllocation`: alocação de recurso/pessoa. |
| `projectCostLogs` | `id`; `projectId`, `category` | `ProjectCostLog`: custo do projeto. |
| `projectFinancials` | `projectId` (chave); `isInternal` | `ProjectFinancials`: consolidação financeira por projeto. |
| `projectRisks` | `id`; `projectId`, `category`, `status` | `ProjectRisk`: risco e estado. |
| `historicalTasks` | `id`; `projectId`, `executorEmail`, `complexity` | `HistoricalTask`: histórico de tarefa para previsão. |
| `projectBudgets` | `id`; `projectId`, `period`, `version` | `ProjectBudget`: orçamento versionado. |
| `financialTransactions` | `id`; `projectId`, `type`, `status`, `category`, `paymentDate` | `FinancialTransaction`: receita/despesa, categoria, status e pagamento. |
| `invoiceLogs` | `id`; `transactionId`, `invoiceNumber`, `status` | `InvoiceLog`: nota/fatura associada à transação. |
| `bankIntegrations` | `id`; `bankName`, `status` | `BankIntegration`: configuração de banco. |
| `bankStatementLines` | `id`; `integrationId`, `type`, `reconciledTransactionId` | Linha de extrato e conciliação. |
| `budgetAlerts` | `id`; `projectId`, `category`, `thresholdPercent` | Alerta de limite orçamentário. |

## Arquivos JSON da API local

Localização: `apps/web/src/db/`. Cada arquivo contém uma lista JSON, exceto o log `.jsonl`.

| Arquivo | Equivale logicamente a | Uso |
|---|---|---|
| `users.json` | usuários | Conta, hash de senha, perfil e 2FA. |
| `reset_tokens.json` | tokens de redefinição | Recuperação de senha. |
| `projects.json` | projetos | Projeto, proprietário e metadados básicos. |
| `manuscripts.json` | cópia de manuscritos | Sincronização local da biblioteca com a API. |
| `collaborators.json` | colaboradores | Convite, permissão e estado de colaboração. |
| `folders.json` | pastas | Espelho local das pastas de manuscrito. |
| `sessions.json` | sessões | Sessões por dispositivo e revogação. |
| `chat_channels.json` | canais | Persistência local do chat. |
| `chat_messages.json` | mensagens | Persistência local do chat. |
| `consent_audit.jsonl` | auditoria de consentimento | Log append-only de ações de privacidade. |

## Fontes de verdade e cuidados

1. Para módulos de escrita, universo, planejamento, pesquisa, laboratório e finanças, **IndexedDB é a fonte de trabalho local**.
2. `manuscripts.json` é usado pela API para reidratar e sincronizar capítulos, mas não contém todas as tabelas IndexedDB.
3. O schema atual de `manuscripts` não possui índice Dexie em `projectId`; consultas devem filtrar a coleção lida pelo projeto ativo, salvo nova migração explícita.
4. A tabela `automationHistories` é o histórico persistido de coletas automáticas; ela guarda fonte, estado, payload e capítulo de origem quando aplicável.
5. `extractionCandidates` separa sugestões automáticas dos dados aprovados. O `fingerprint` impede que o mesmo conteúdo e a mesma versão de heurística sejam aplicados duas vezes.
6. Os contratos completos de cada tabela estão em `packages/domain/src/**` e os tipos locais complementares (`Reminder`, `WikiEntity`, `AutomationHistoryEntry`, `ExtractionCandidate`) estão em `apps/web/src/db/schema.ts`.
