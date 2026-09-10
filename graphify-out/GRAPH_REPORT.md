# Graph Report - repo-local  (2026-09-10)

## Corpus Check
- 51 files · ~88,021 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 575 nodes · 1740 edges · 25 communities (20 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5cdf14a5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- features.test.tsx
- StoreModal.tsx
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
- dialog.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- SaleRegistration
- StoreModal
- App
- store.tsx
- sync.test.ts
- types.ts

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
- `emit()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/dialog.ts → react-app/src/lib/appVersion.ts
- `subscribeDialog()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/dialog.ts → react-app/src/lib/appVersion.ts
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (25 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.09
Nodes (67): deletedNoteIdsOf(), deletedStores(), forgetDeletedStore(), isNoteDeleted(), mergeInvLog(), mergeItems(), mergeNoteLog(), rememberDeletedStore() (+59 more)

### Community 2 - "features.test.tsx"
Cohesion: 0.15
Nodes (18): CLIENT_KEY, DEFAULT_PRODUCT_TAG, loadState(), makeDraft(), migrateNoteLogToBoard(), normalizeStore(), AppCtx, ModalKind (+10 more)

### Community 3 - "StoreModal.tsx"
Cohesion: 0.18
Nodes (12): compressImage(), DEFAULT_STORE_IMAGE, itemLabel(), syncGenPin(), Member, Role, ImagePicker(), EmpAcc (+4 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (38): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+30 more)

### Community 5 - "ui.tsx"
Cohesion: 0.05
Nodes (84): Dropdown(), DropdownItem, ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory() (+76 more)

### Community 6 - "core.ts"
Cohesion: 0.15
Nodes (21): canManageTeam(), clearDeletedNotes(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, deletedNotesKey(), fixedPackageTotal(), getDeletedNoteIds() (+13 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.10
Nodes (49): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+41 more)

### Community 12 - "SettingsModal.tsx"
Cohesion: 0.09
Nodes (40): DeletedStoreRecord, archiveMarkGone(), archiveRows(), archiveUpsert(), buildCsv(), exportNotesArchiveCsv(), exportObjectivesArchiveCsv(), loadArchive() (+32 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "dialog.ts"
Cohesion: 0.13
Nodes (19): activeEvent(), customConfirm(), DialogKind, DialogRequest, emit(), Listener, listeners, open() (+11 more)

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
Cohesion: 0.11
Nodes (26): catLabel(), formatDate(), pad2(), priceFor(), saleUnits(), shortDate(), total(), ChevronIcon() (+18 more)

### Community 20 - "StoreModal"
Cohesion: 0.21
Nodes (16): syncSetName(), clearSeenNoteIds(), detach(), deactivateSyncFn(), submit(), saveName(), StoreModal(), activateSyncNow() (+8 more)

### Community 21 - "App"
Cohesion: 0.12
Nodes (20): App(), selectStore(), setMenu(), askSwVersion(), current(), save(), useAppVersion(), APP_VERSION (+12 more)

### Community 22 - "store.tsx"
Cohesion: 0.20
Nodes (13): NOTE_TTL_MS, saveState(), ctx(), notifyPermission(), playNoteChime(), showSystemNotification(), softVibrate(), tone() (+5 more)

### Community 23 - "sync.test.ts"
Cohesion: 0.18
Nodes (10): CategoryGroup, costFor(), costTotal(), profitTotal(), sortByOrder(), addProduct(), apply(), makePayload() (+2 more)

### Community 24 - "types.ts"
Cohesion: 0.20
Nodes (9): InvLogRow, CategoryPricing, InventoryLogEntry, NoteChecklistItem, NoteEditRecord, NoteEntry, Promo, SaleDraft (+1 more)

## Knowledge Gaps
- **102 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+97 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 132 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `ui.tsx` to `features.test.tsx`, `StoreModal.tsx`, `react-app/package.json`, `Notes.tsx`, `SettingsModal.tsx`, `dialog.ts`, `SaleRegistration`, `App`, `store.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `Notes.tsx`, `ui.tsx`, `dialog.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _102 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08951406649616368 - nodes in this community are weakly interconnected._
- **Should `features.test.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1471861471861472 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._
- **Should `ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.050915750915750915 - nodes in this community are weakly interconnected._