# Dolce Delícia Commercial MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evoluir o site institucional existente para um catálogo comercial gerenciável com cardápios por unidade, carrinho, WhatsApp e administração protegida.

**Architecture:** O frontend vinext preserva as páginas atuais. D1 é a fonte de verdade relacional, R2 armazena uploads, rotas `app/api` formam o backend e SIWC autentica o painel, com autorização adicional no servidor.

**Tech Stack:** React 19, TypeScript, vinext, Cloudflare Workers, D1/SQLite, Drizzle ORM, R2, SIWC e Node Test Runner.

## Global Constraints

- Preservar identidade visual, páginas institucionais, responsividade, busca, filtros e cards existentes.
- Não adicionar infraestrutura externa.
- Não implementar pagamento, estoque completo, ERP ou entrega própria.
- Carrinho local, separado por unidade, e conclusão pelo WhatsApp.
- Toda escrita administrativa exige autenticação e autorização server-side.

---

### Task 1: Persistência e seed

**Files:** `db/schema.ts`, `db/index.ts`, `drizzle/*.sql`, `.openai/hosting.json`, `tests/database-schema.test.mjs`

**Interfaces:** Produz tabelas `categories`, `products`, `locations`, `menu_items`, `promotions`, `media` e `admins`; produz `getD1()` e `getR2()`.

- [ ] Escrever testes que exijam entidades, relações, índices e bindings `DB`/`MEDIA`; executar e observar falha.
- [ ] Definir o schema Drizzle, gerar a migration e acrescentar seed idempotente com os dados já publicados.
- [ ] Executar testes e inspecionar o SQL gerado, inclusive índices por unidade, categoria, disponibilidade e vigência.

### Task 2: Backend público

**Files:** `lib/catalog-service.ts`, `app/api/catalog/route.ts`, `app/api/locations/route.ts`, `app/api/media/[key]/route.ts`, `tests/catalog-service.test.mjs`

**Interfaces:** Produz `GET /api/locations`, `GET /api/catalog?location=<slug>` e leitura pública de mídia R2.

- [ ] Escrever testes para preço efetivo, promoção expirada, unidade e indisponibilidade; observar falha.
- [ ] Implementar funções puras de projeção e rotas D1 com prepared statements.
- [ ] Executar testes e verificar respostas de validação para unidade ausente/inválida.

### Task 3: Cardápio por unidade e carrinho

**Files:** `components/MenuCatalog.tsx`, `components/CartDrawer.tsx`, `lib/cart.ts`, `tests/cart.test.mjs`

**Interfaces:** Produz carrinho local por unidade, totais, conflito de troca e `buildOrderMessage()`.

- [ ] Escrever testes de adicionar, incrementar, reduzir, remover, limpar, totalizar e estruturar mensagem; observar falha.
- [ ] Implementar armazenamento local versionado e funções puras do carrinho.
- [ ] Integrar seleção de unidade, catálogo dinâmico, disponibilidade, promoções e drawer responsivo.
- [ ] Exigir nome antes de abrir o WhatsApp da unidade.

### Task 4: Autorização administrativa

**Files:** `lib/admin-auth.ts`, `app/admin/page.tsx`, `tests/admin-auth.test.mjs`

**Interfaces:** Produz `requireAdminPage()` e `requireAdminApi()` com SIWC + allowlist/D1.

- [ ] Escrever testes negativos para anônimo, autenticado não autorizado e administrador inativo; observar falha.
- [ ] Implementar decisão de autorização pura e adaptadores server-side.
- [ ] Proteger página e APIs sem criar senhas ou OAuth próprios.

### Task 5: CRUD administrativo

**Files:** `app/api/admin/catalog/route.ts`, `components/AdminDashboard.tsx`, `app/admin/admin.css`, `tests/admin-validation.test.mjs`

**Interfaces:** Produz leitura e mutações de produtos, categorias, unidades, itens e promoções.

- [ ] Escrever testes para validação de cada recurso e transições ativo/inativo; observar falha.
- [ ] Implementar operações parametrizadas, integridade referencial e respostas consistentes.
- [ ] Implementar painel com formulários, tabelas, edição, desativação e associação produto/unidade.

### Task 6: Upload R2

**Files:** `app/api/admin/upload/route.ts`, `lib/media.ts`, `tests/media.test.mjs`

**Interfaces:** Produz upload JPEG/PNG/WebP de até 5 MB e URL `/api/media/<key>`.

- [ ] Escrever testes de tipo, tamanho e chave segura; observar falha.
- [ ] Implementar validação, gravação R2 e metadados D1.
- [ ] Integrar upload aos formulários de produto e promoção.

### Task 7: Integração e regressão

**Files:** `app/cardapio/page.tsx`, `app/globals.css`, `tests/rendered-html.test.mjs`, `tests/navigation.test.mjs`

**Interfaces:** Mantém seis rotas institucionais e adiciona `/admin` sem regressão visual.

- [ ] Atualizar testes de renderização e navegação para os novos fluxos.
- [ ] Executar `npm test`, `npm run lint` e `git diff --check`.
- [ ] Corrigir somente falhas observadas e repetir a suíte completa.

### Task 8: Configuração e publicação

**Files:** `.openai/hosting.json`, `.env.example`, `README.md`

**Interfaces:** Produz D1/R2 reais, administrador inicial e versão publicada.

- [ ] Configurar bindings lógicos `DB` e `MEDIA` e allowlist administrativo no Sites.
- [ ] Validar migration e build empacotado; salvar versão a partir do commit enviado.
- [ ] Publicar, verificar catálogo persistido, autenticação, upload e persistência após novo deploy.
