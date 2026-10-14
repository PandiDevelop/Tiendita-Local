# Graph Report - Web  (2026-10-13)

## Corpus Check
- 75 files · ~371,068 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 815 nodes · 2530 edges · 35 communities (30 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `66eb5cf4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ProductForm.tsx
- SaleRegistration.tsx
- SettingsModal.tsx
- react-app/package.json
- store.tsx
- features.test.tsx
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- Profit.tsx
- Mi Tiendita
- AGENTS.md
- sync.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- Notes.tsx
- otaUpdate.ts
- TagModal.tsx
- deploy-web.mjs
- App
- inject-sw-version.mjs
- notesArchive.ts
- sync.test.ts
- SaleRegistration
- Catalog
- backup.ts
- useStore
- core.ts
- Dashboard.tsx
- saleUnitPrice
- install.ts

## God Nodes (most connected - your core abstractions)
1. `useStore()` - 43 edges
2. `syncClientId()` - 41 edges
3. `esc()` - 36 edges
4. `syncName()` - 36 edges
5. `SettingsModal()` - 34 edges
6. `uid()` - 30 edges
7. `applyRemote()` - 29 edges
8. `SaleRegistration()` - 29 edges
9. `react` - 27 edges
10. `AppProvider()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `saleHasProduct()` --calls--> `productTags()`  [EXTRACTED]
  react-app/src/views/History.tsx → react-app/src/lib/core.ts
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `onCargoSuppBlur()` --calls--> `getSupplierInfo()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (35 total, 4 thin omitted)

### Community 0 - "ProductForm.tsx"
Cohesion: 0.06
Nodes (58): adoptInvLog(), compressImage(), EditablePromo, ensureCost(), fromEditablePromos(), getSupplierCost(), insertCatSorted(), insertProductAlphabetically() (+50 more)

### Community 2 - "SaleRegistration.tsx"
Cohesion: 0.12
Nodes (27): Dropdown(), DropdownItem, DEFAULT_PRODUCT_IMAGE, getSupplierInfo(), groupedByCategory(), productTags(), reorderCategoryProducts(), sortProducts() (+19 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.06
Nodes (76): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange(), registerAccount() (+68 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (42): dependencies, @capacitor/app, @capacitor/filesystem, @capacitor/push-notifications, @capgo/capacitor-updater, firebase, react, react-dom (+34 more)

### Community 5 - "store.tsx"
Cohesion: 0.18
Nodes (13): ParsedBackup, NOTE_TTL_MS, runMigrations(), saveState(), shiftDay(), SyncHandle, AppCtx, Ctx (+5 more)

### Community 6 - "features.test.tsx"
Cohesion: 0.17
Nodes (15): DEFAULT_PRODUCT_TAG, loadState(), makeDraft(), normalizeStore(), renderLanding(), addTag(), saleStore(), setup() (+7 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.09
Nodes (33): capFirst(), DEV_LOGO, MenuClock(), TAB_ICONS, pushOverlay(), DialogKind, DialogRequest, emit() (+25 more)

### Community 12 - "Profit.tsx"
Cohesion: 0.14
Nodes (26): costFor(), findActivePromo(), formatDate(), inventorySold(), itemLabel(), money(), pad2(), priceFor() (+18 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "sync.ts"
Cohesion: 0.06
Nodes (94): canManageTeam(), clearDeletedProducts(), clearDeletedSales(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedProductIdsOf(), deletedSaleIdsOf(), deletedStores() (+86 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "Notes.tsx"
Cohesion: 0.08
Nodes (52): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), canDeleteNote(), canEditNote(), canManageNotes(), deleteNoteMsg() (+44 more)

### Community 20 - "otaUpdate.ts"
Cohesion: 0.08
Nodes (29): ENTRY, hasOverlay(), popOverlay(), realUrl(), stack, syncHistory(), CapgoGlobal, initCapUpdater() (+21 more)

### Community 21 - "TagModal.tsx"
Cohesion: 0.33
Nodes (9): insertTagSorted(), removeStoreTag(), renameStoreTag(), storeTags(), Props, TagModal(), add(), commitRename() (+1 more)

### Community 22 - "deploy-web.mjs"
Cohesion: 0.40
Nodes (4): dist, entries, here, root

### Community 23 - "App"
Cohesion: 0.11
Nodes (25): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+17 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "notesArchive.ts"
Cohesion: 0.20
Nodes (16): archiveMarkGone(), archiveRows(), archiveUpsert(), buildJson(), exportNotesArchiveJson(), exportObjectivesArchiveJson(), loadArchive(), noteArchiveText() (+8 more)

### Community 26 - "sync.test.ts"
Cohesion: 0.15
Nodes (9): costTotal(), findCostId(), sortByOrder(), addProduct(), apply(), Device, makePayload(), newStore() (+1 more)

### Community 27 - "SaleRegistration"
Cohesion: 0.18
Nodes (14): catLabel(), saleCatsOf(), shortTag(), exportJson(), saleCatNames(), SaleRegistration(), addLine(), catUnits() (+6 more)

### Community 28 - "Catalog"
Cohesion: 0.25
Nodes (8): customConfirm(), confirmDialog(), Catalog(), catKey(), catOpen(), removeCategory(), removeProduct(), toggleCat()

### Community 29 - "backup.ts"
Cohesion: 0.15
Nodes (15): BACKUP_FORMAT, backupFileName(), buildBackup(), downloadBackup(), mergeBackupInto(), PRIVATE_FIELDS, SaveFileHandle, saveNativeBackup() (+7 more)

### Community 30 - "useStore"
Cohesion: 0.23
Nodes (11): esc(), numText(), toEditablePromos(), useStore(), Modal(), SaveIcon(), CategoryModal(), loadCat() (+3 more)

### Community 31 - "core.ts"
Cohesion: 0.08
Nodes (34): activeEvent(), CategoryGroup, clearDeletedNotes(), costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds (+26 more)

### Community 32 - "Dashboard.tsx"
Cohesion: 0.23
Nodes (12): total(), BoxIcon(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel() (+4 more)

### Community 34 - "saleUnitPrice"
Cohesion: 0.47
Nodes (6): fixedPackageTotal(), promoPrice(), promoUnitReward(), round2(), saleUnitPrice(), editLinesForSale()

### Community 39 - "install.ts"
Cohesion: 0.50
Nodes (3): BeforeInstallPromptEvent, isStandalone(), useInstallable()

## Knowledge Gaps
- **148 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+143 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 200 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SaleRegistration.tsx` to `ProductForm.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `store.tsx`, `features.test.tsx`, `install.ts`, `ui.tsx`, `Profit.tsx`, `sync.ts`, `Notes.tsx`, `otaUpdate.ts`, `TagModal.tsx`, `App`, `useStore`, `core.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `ProductForm.tsx`, `Dashboard.tsx`, `SaleRegistration.tsx`, `SettingsModal.tsx`, `store.tsx`, `ui.tsx`, `Profit.tsx`, `sync.ts`, `Notes.tsx`, `TagModal.tsx`, `App`, `SaleRegistration`, `Catalog`, `core.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `SettingsModal()` connect `SettingsModal.tsx` to `ui.tsx`, `sync.ts`, `Notes.tsx`, `App`, `notesArchive.ts`, `backup.ts`, `useStore`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _148 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ProductForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `SaleRegistration.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12477718360071301 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.060805860805860805 - nodes in this community are weakly interconnected._