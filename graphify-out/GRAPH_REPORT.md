# Graph Report - repo-local  (2026-09-10)

## Corpus Check
- 52 files · ~137,140 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 582 nodes · 1752 edges · 25 communities (20 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0ddeba7c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- features.test.tsx
- store.tsx
- react-app/package.json
- App
- SaleRegistration
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- StoreModal.tsx
- Mi Tiendita
- AGENTS.md
- sync.test.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- core.ts
- History.tsx
- Dashboard.tsx
- ui.tsx
- Employees.tsx
- dialog.ts

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 29 edges
5. `esc()` - 28 edges
6. `Notes()` - 25 edges
7. `SaleRegistration()` - 25 edges
8. `react` - 23 edges
9. `Inventory()` - 22 edges
10. `AppProvider()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `App()` --calls--> `useAppVersion()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/appVersion.ts
- `App()` --calls--> `pushOverlay()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/backStack.ts

## Import Cycles
- None detected.

## Communities (25 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.09
Nodes (63): clearDeletedNotes(), deletedNoteIdsOf(), deletedNotesKey(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted(), markNoteDeleted(), mergeInvLog() (+55 more)

### Community 2 - "features.test.tsx"
Cohesion: 0.13
Nodes (21): CLIENT_KEY, DEFAULT_PRODUCT_TAG, loadState(), makeDraft(), migrateNoteLogToBoard(), normalizeStore(), AppCtx, Ctx (+13 more)

### Community 3 - "store.tsx"
Cohesion: 0.07
Nodes (53): askSwVersion(), useAppVersion(), APP_VERSION, deletedStores(), saveState(), archiveMarkGone(), archiveRows(), archiveUpsert() (+45 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (36): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+28 more)

### Community 5 - "App"
Cohesion: 0.21
Nodes (10): App(), selectStore(), setMenu(), canManageTeam(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+2 more)

### Community 6 - "SaleRegistration"
Cohesion: 0.26
Nodes (9): SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine(), setManualPrice() (+1 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.08
Nodes (57): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+49 more)

### Community 12 - "StoreModal.tsx"
Cohesion: 0.11
Nodes (29): compressImage(), DEFAULT_STORE_IMAGE, isStoreOwner(), myRole(), rememberDeletedStore(), syncGenPin(), syncSetName(), clearSeenNoteIds() (+21 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "sync.test.ts"
Cohesion: 0.19
Nodes (12): costFor(), costTotal(), priceFor(), profitTotal(), addProduct(), apply(), makePayload(), PLine (+4 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "core.ts"
Cohesion: 0.10
Nodes (30): CategoryGroup, DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, DeletedStoreRecord, fixedPackageTotal(), InvLogRow, KEY (+22 more)

### Community 20 - "History.tsx"
Cohesion: 0.31
Nodes (10): catLabel(), findActivePromo(), formatDate(), pad2(), saleUnits(), shortDate(), DownloadIcon(), History() (+2 more)

### Community 21 - "Dashboard.tsx"
Cohesion: 0.31
Nodes (9): total(), SaleItem, ChevronIcon(), Dashboard(), Line, monthLabel(), monthLines(), monthOf() (+1 more)

### Community 22 - "ui.tsx"
Cohesion: 0.05
Nodes (82): DEV_LOGO, Dropdown(), DropdownItem, ENTRY, popOverlay(), pushOverlay(), realUrl(), stack (+74 more)

### Community 23 - "Employees.tsx"
Cohesion: 0.38
Nodes (6): itemLabel(), Member, Role, EmpAcc, Employees(), roleLabel()

### Community 28 - "dialog.ts"
Cohesion: 0.13
Nodes (19): activeEvent(), customConfirm(), DialogKind, DialogRequest, emit(), Listener, listeners, open() (+11 more)

## Knowledge Gaps
- **106 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+101 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 138 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `ui.tsx` to `features.test.tsx`, `store.tsx`, `react-app/package.json`, `Notes.tsx`, `StoreModal.tsx`, `sync.test.ts`, `History.tsx`, `Employees.tsx`, `dialog.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `Notes.tsx`, `core.ts`, `History.tsx`, `ui.tsx`, `dialog.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _106 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09423076923076923 - nodes in this community are weakly interconnected._
- **Should `features.test.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `store.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07242063492063493 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05547652916073969 - nodes in this community are weakly interconnected._