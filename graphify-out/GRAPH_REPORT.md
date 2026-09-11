# Graph Report - repo-local  (2026-09-11)

## Corpus Check
- 53 files · ~314,929 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 605 nodes · 1806 edges · 29 communities (24 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7bdbb454`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- sync.test.ts
- store.tsx
- react-app/package.json
- App
- ProductForm.tsx
- compilerOptions
- core.ts
- vite-env.d.ts
- public/sw.js
- sw.js
- SaleRegistration.tsx
- Mi Tiendita
- AGENTS.md
- types.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- Inventory.tsx
- ui.tsx
- features.test.tsx
- useStore
- pushOverlay
- StoreModal.tsx
- Dashboard.tsx
- Profit.tsx
- History.tsx
- dialog.ts

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 29 edges
5. `esc()` - 28 edges
6. `Inventory()` - 25 edges
7. `Notes()` - 25 edges
8. `SaleRegistration()` - 25 edges
9. `react` - 24 edges
10. `AppProvider()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts
- `App()` --calls--> `useAppVersion()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/appVersion.ts

## Import Cycles
- None detected.

## Communities (29 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.11
Nodes (53): clearDeletedNotes(), deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted(), markNoteDeleted() (+45 more)

### Community 2 - "sync.test.ts"
Cohesion: 0.19
Nodes (11): costTotal(), makeDraft(), sortByOrder(), Ctx, addProduct(), apply(), Device, makePayload() (+3 more)

### Community 3 - "store.tsx"
Cohesion: 0.06
Nodes (68): askSwVersion(), useAppVersion(), APP_VERSION, DeletedStoreRecord, saveState(), BeforeInstallPromptEvent, isStandalone(), useInstallable() (+60 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (38): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+30 more)

### Community 5 - "App"
Cohesion: 0.21
Nodes (10): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+2 more)

### Community 6 - "ProductForm.tsx"
Cohesion: 0.20
Nodes (14): EditablePromo, insertCatSorted(), saleCatsOf(), setCategoryPricing(), storeCats(), toEditablePromos(), CategorySuggest(), Modal() (+6 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "core.ts"
Cohesion: 0.06
Nodes (84): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+76 more)

### Community 12 - "SaleRegistration.tsx"
Cohesion: 0.12
Nodes (20): Dropdown(), DropdownItem, catLabel(), findActivePromo(), sortProducts(), CloseIcon(), ReceiptIcon(), UndoIcon() (+12 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "types.ts"
Cohesion: 0.14
Nodes (16): itemLabel(), CategoryPricing, Member, NoteArchiveEntry, NoteChecklistItem, NoteEditRecord, NoteEntry, NoteReply (+8 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "Inventory.tsx"
Cohesion: 0.16
Nodes (16): reorderCategoryProducts(), Product, CargoIcon(), GearMenu(), PencilIcon(), startProdDrag(), Inventory(), catKey() (+8 more)

### Community 20 - "ui.tsx"
Cohesion: 0.10
Nodes (27): DEV_LOGO, TAB_ICONS, subscribeDialog(), closeLightbox(), emit(), Listener, listeners, openLightbox() (+19 more)

### Community 21 - "features.test.tsx"
Cohesion: 0.18
Nodes (13): CLIENT_KEY, DEFAULT_PRODUCT_TAG, loadState(), migrateNoteLogToBoard(), normalizeStore(), AppCtx, addTag(), setup() (+5 more)

### Community 22 - "useStore"
Cohesion: 0.21
Nodes (17): DEFAULT_PRODUCT_IMAGE, esc(), groupedByCategory(), inventorySold(), money(), productTags(), promoText(), shortTag() (+9 more)

### Community 23 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 24 - "StoreModal.tsx"
Cohesion: 0.11
Nodes (29): compressImage(), DEFAULT_STORE_IMAGE, rememberDeletedStore(), syncGenPin(), syncSetName(), clearSeenNoteIds(), detach(), deactivateSyncFn() (+21 more)

### Community 25 - "Dashboard.tsx"
Cohesion: 0.23
Nodes (11): SaleItem, BoxIcon(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel() (+3 more)

### Community 26 - "Profit.tsx"
Cohesion: 0.39
Nodes (8): costFor(), priceFor(), profitTotal(), PLine, Profit(), profitLines(), RangeMode, ViewMode

### Community 27 - "History.tsx"
Cohesion: 0.52
Nodes (6): formatDate(), pad2(), saleUnits(), shortDate(), total(), History()

### Community 28 - "dialog.ts"
Cohesion: 0.13
Nodes (19): activeEvent(), customConfirm(), DialogKind, DialogRequest, emit(), Listener, listeners, open() (+11 more)

## Knowledge Gaps
- **110 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+105 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 144 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SaleRegistration.tsx` to `store.tsx`, `react-app/package.json`, `ProductForm.tsx`, `core.ts`, `types.ts`, `Inventory.tsx`, `ui.tsx`, `features.test.tsx`, `useStore`, `StoreModal.tsx`, `Profit.tsx`, `History.tsx`, `dialog.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration.tsx` to `ProductForm.tsx`, `core.ts`, `ui.tsx`, `useStore`, `dialog.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _110 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10971348707197764 - nodes in this community are weakly interconnected._
- **Should `store.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05570611261668172 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._