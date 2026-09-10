# Graph Report - repo-local  (2026-09-10)

## Corpus Check
- 51 files · ~92,333 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 575 nodes · 1744 edges · 20 communities (15 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0bde253c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- store.tsx
- App
- react-app/package.json
- ui.tsx
- core.ts
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- SettingsModal.tsx
- Mi Tiendita
- AGENTS.md
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- SaleRegistration
- dialog.ts

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 29 edges
5. `esc()` - 28 edges
6. `Notes()` - 26 edges
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

## Communities (20 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.06
Nodes (90): compressImage(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedStores(), forgetDeletedStore(), isNoteDeleted(), mergeInvLog(), mergeItems() (+82 more)

### Community 2 - "store.tsx"
Cohesion: 0.08
Nodes (37): CategoryGroup, CLIENT_KEY, DEFAULT_PRODUCT_TAG, loadState(), makeDraft(), migrateNoteLogToBoard(), normalizeStore(), NOTE_TTL_MS (+29 more)

### Community 3 - "App"
Cohesion: 0.25
Nodes (8): App(), selectStore(), setMenu(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam(), TABS

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (38): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+30 more)

### Community 5 - "ui.tsx"
Cohesion: 0.05
Nodes (77): Dropdown(), DropdownItem, ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory() (+69 more)

### Community 6 - "core.ts"
Cohesion: 0.06
Nodes (68): activeEvent(), canManageTeam(), clearDeletedNotes(), costFor(), costTotal(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds (+60 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.09
Nodes (53): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+45 more)

### Community 12 - "SettingsModal.tsx"
Cohesion: 0.09
Nodes (40): DeletedStoreRecord, archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt(), loadArchive() (+32 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "SaleRegistration"
Cohesion: 0.24
Nodes (10): catLabel(), SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine() (+2 more)

### Community 21 - "dialog.ts"
Cohesion: 0.12
Nodes (21): askSwVersion(), current(), save(), useAppVersion(), APP_VERSION, DialogKind, DialogRequest, emit() (+13 more)

## Knowledge Gaps
- **102 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+97 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 132 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `ui.tsx` to `sync.ts`, `store.tsx`, `react-app/package.json`, `core.ts`, `Notes.tsx`, `SettingsModal.tsx`, `dialog.ts`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `Notes.tsx`, `ui.tsx`, `core.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _102 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06287985039738195 - nodes in this community are weakly interconnected._
- **Should `store.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07585568917668825 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._
- **Should `ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0547680412371134 - nodes in this community are weakly interconnected._