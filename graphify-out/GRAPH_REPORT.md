# Graph Report - repo-local  (2026-09-10)

## Corpus Check
- 52 files · ~92,745 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 580 nodes · 1750 edges · 28 communities (23 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1e328283`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- store.tsx
- SettingsModal.tsx
- react-app/package.json
- SaleRegistration
- core.ts
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- App
- Mi Tiendita
- AGENTS.md
- esc
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- StoreModal.tsx
- ui.tsx
- appVersion.ts
- Inventory.tsx
- Inventory
- useStore
- Catalog
- dialog.ts
- pushOverlay

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
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (28 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.11
Nodes (53): clearDeletedNotes(), deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted(), markNoteDeleted() (+45 more)

### Community 2 - "store.tsx"
Cohesion: 0.08
Nodes (33): CLIENT_KEY, costTotal(), InvLogRow, loadState(), makeDraft(), NOTE_TTL_MS, sortByOrder(), SyncHandle (+25 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.08
Nodes (49): DeletedStoreRecord, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt() (+41 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (38): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+30 more)

### Community 5 - "SaleRegistration"
Cohesion: 0.13
Nodes (18): activeEvent(), saleCatsOf(), StoreEvent, blankEvent(), Events(), finalize(), openAdding(), patch() (+10 more)

### Community 6 - "core.ts"
Cohesion: 0.09
Nodes (36): canManageTeam(), CategoryGroup, compressImage(), DEFAULT_PROD_SVG, DEFAULT_PRODUCT_TAG, DEFAULT_STORE_SVG, deletedNoteIds, EditablePromo (+28 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.11
Nodes (49): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+41 more)

### Community 12 - "App"
Cohesion: 0.11
Nodes (22): App(), selectStore(), setMenu(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam(), TABS (+14 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "esc"
Cohesion: 0.13
Nodes (34): catLabel(), costFor(), esc(), findActivePromo(), formatDate(), itemLabel(), money(), priceFor() (+26 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "StoreModal.tsx"
Cohesion: 0.13
Nodes (26): DEFAULT_STORE_IMAGE, rememberDeletedStore(), syncGenPin(), syncSetName(), clearSeenNoteIds(), detach(), deactivateSyncFn(), deleteStoreFn() (+18 more)

### Community 20 - "ui.tsx"
Cohesion: 0.14
Nodes (15): ASSETS, preloadDevAssets(), BellIcon(), CheckboxOutlineIcon(), ChecklistIcon(), GearIcon(), Logo(), MenuIcon() (+7 more)

### Community 21 - "appVersion.ts"
Cohesion: 0.22
Nodes (12): askSwVersion(), current(), save(), useAppVersion(), APP_VERSION, closeLightbox(), emit(), Listener (+4 more)

### Community 22 - "Inventory.tsx"
Cohesion: 0.28
Nodes (12): DEFAULT_PRODUCT_IMAGE, groupedByCategory(), productTags(), shortTag(), Product, GearMenu(), Image(), PencilIcon() (+4 more)

### Community 23 - "Inventory"
Cohesion: 0.21
Nodes (14): inventorySold(), reorderCategoryProducts(), startProdDrag(), Inventory(), bump(), catKey(), catOpen(), cur() (+6 more)

### Community 24 - "useStore"
Cohesion: 0.22
Nodes (10): Dropdown(), DropdownItem, sortProducts(), useStore(), Modal(), ReceiptIcon(), UndoIcon(), JoinModal() (+2 more)

### Community 25 - "Catalog"
Cohesion: 0.23
Nodes (9): promoText(), customConfirm(), Catalog(), catKey(), catOpen(), removeCategory(), removeProduct(), toggleCat() (+1 more)

### Community 26 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 27 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

## Knowledge Gaps
- **104 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+99 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 135 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `store.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `SaleRegistration`, `core.ts`, `Notes.tsx`, `App`, `esc`, `StoreModal.tsx`, `ui.tsx`, `appVersion.ts`, `Inventory.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `Notes.tsx`, `esc`, `ui.tsx`, `Inventory.tsx`, `useStore`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _104 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10971348707197764 - nodes in this community are weakly interconnected._
- **Should `store.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08194905869324474 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08080808080808081 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._