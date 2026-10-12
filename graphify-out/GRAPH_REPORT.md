# Graph Report - Web  (2026-10-12)

## Corpus Check
- 72 files · ~367,241 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 787 nodes · 2451 edges · 40 communities (35 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c856f594`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- syncClientId
- Inventory.tsx
- SettingsModal.tsx
- react-app/package.json
- Profit.tsx
- sync.test.ts
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- TagModal.tsx
- Mi Tiendita
- AGENTS.md
- sync.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- Notes
- store.tsx
- useStore
- deploy-web.mjs
- App
- inject-sw-version.mjs
- core.ts
- setCategoryPricing
- SaleRegistration
- backStack.ts
- Catalog
- SaleRegistration.tsx
- History.tsx
- attach
- push.ts
- Dashboard.tsx
- types.ts
- today
- push
- saleUnitPrice
- install.ts

## God Nodes (most connected - your core abstractions)
1. `useStore()` - 43 edges
2. `syncClientId()` - 40 edges
3. `esc()` - 36 edges
4. `syncName()` - 36 edges
5. `SettingsModal()` - 33 edges
6. `uid()` - 30 edges
7. `applyRemote()` - 29 edges
8. `SaleRegistration()` - 29 edges
9. `react` - 27 edges
10. `AppProvider()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `removeCategory()` --calls--> `customConfirm()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/dialog.ts
- `doSignIn()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/AuthLanding.tsx → react-app/src/lib/sync.ts

## Import Cycles
- None detected.

## Communities (40 total, 4 thin omitted)

### Community 0 - "syncClientId"
Cohesion: 0.12
Nodes (31): clearDeletedProducts(), clearDeletedSales(), compressImage(), isStoreOwner(), myRole(), rememberDeletedStore(), syncClientId(), syncGenPin() (+23 more)

### Community 2 - "Inventory.tsx"
Cohesion: 0.08
Nodes (58): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), DEFAULT_PRODUCT_IMAGE, ensureCost(), getSupplierCost() (+50 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.08
Nodes (56): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange(), registerAccount() (+48 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (35): dependencies, @capacitor/filesystem, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom (+27 more)

### Community 5 - "Profit.tsx"
Cohesion: 0.33
Nodes (11): costFor(), inventorySold(), priceFor(), productLedger(), profitTotal(), HScroll(), PLine, Profit() (+3 more)

### Community 6 - "sync.test.ts"
Cohesion: 0.06
Nodes (43): BACKUP_FORMAT, backupFileName(), buildBackup(), downloadBackup(), isNativeApp(), parseBackup(), ParsedBackup, PRIVATE_FIELDS (+35 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.08
Nodes (36): capFirst(), DEV_LOGO, MenuClock(), TAB_ICONS, DialogKind, DialogRequest, emit(), Listener (+28 more)

### Community 12 - "TagModal.tsx"
Cohesion: 0.33
Nodes (9): insertTagSorted(), removeStoreTag(), renameStoreTag(), storeTags(), Props, TagModal(), add(), commitRename() (+1 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "sync.ts"
Cohesion: 0.11
Nodes (37): mergeBackupInto(), deletedProductIdsOf(), deletedSaleIdsOf(), getDeletedProductIds(), getDeletedSaleIds(), isNoteDeleted(), isProductDeleted(), isSaleDeleted() (+29 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "Notes"
Cohesion: 0.13
Nodes (24): canDeleteNote(), canEditNote(), canManageNotes(), canManageTeam(), deleteNoteMsg(), deleteNoteReply(), editChecklistNote(), editNoteMsg() (+16 more)

### Community 20 - "store.tsx"
Cohesion: 0.11
Nodes (29): NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt() (+21 more)

### Community 21 - "useStore"
Cohesion: 0.16
Nodes (21): DEFAULT_STORE_IMAGE, esc(), groupedByCategory(), numText(), toEditablePromos(), useStore(), CaretIcon(), CargoIcon() (+13 more)

### Community 22 - "deploy-web.mjs"
Cohesion: 0.40
Nodes (4): dist, entries, here, root

### Community 23 - "App"
Cohesion: 0.07
Nodes (36): App(), selectStore(), setMenu(), useScrollAxisLock(), CapgoGlobal, initCapUpdater(), UpdaterPlugin, consumeDeepNote() (+28 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "core.ts"
Cohesion: 0.11
Nodes (23): clearDeletedNotes(), costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, deletedNotesKey(), deletedProductIds (+15 more)

### Community 26 - "setCategoryPricing"
Cohesion: 0.67
Nodes (4): fromEditablePromos(), normalizePromo(), setCategoryPricing(), save()

### Community 27 - "SaleRegistration"
Cohesion: 0.21
Nodes (12): catLabel(), exportTxt(), saleCatNames(), SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos() (+4 more)

### Community 28 - "backStack.ts"
Cohesion: 0.12
Nodes (20): ENTRY, hasOverlay(), popOverlay(), pushOverlay(), realUrl(), stack, syncHistory(), closeLightbox() (+12 more)

### Community 29 - "Catalog"
Cohesion: 0.29
Nodes (7): customConfirm(), Catalog(), catKey(), catOpen(), removeCategory(), removeProduct(), toggleCat()

### Community 30 - "SaleRegistration.tsx"
Cohesion: 0.20
Nodes (9): Dropdown(), DropdownItem, saleCatsOf(), shortTag(), sortByOrder(), sortProducts(), ReceiptIcon(), UndoIcon() (+1 more)

### Community 31 - "History.tsx"
Cohesion: 0.15
Nodes (20): findActivePromo(), formatDate(), itemLabel(), money(), pad2(), productPromos(), saleUnits(), shortDate() (+12 more)

### Community 32 - "attach"
Cohesion: 0.26
Nodes (21): deletedStores(), forgetDeletedStore(), syncKeyOf(), writerId(), activateSync(), attach(), migrateLegacyProducts(), repairDoc() (+13 more)

### Community 33 - "push.ts"
Cohesion: 0.19
Nodes (18): disablePushForStore(), enablePushForStore(), ensurePushToken(), getMessagingInstance(), initNativePush(), NativePush, nativePushPlugin(), nextNativeToken() (+10 more)

### Community 34 - "Dashboard.tsx"
Cohesion: 0.22
Nodes (12): SaleItem, BoxIcon(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel() (+4 more)

### Community 35 - "types.ts"
Cohesion: 0.17
Nodes (11): CategoryGroup, CategoryPricing, NoteChecklistItem, NoteEditRecord, NoteEntry, Product, Promo, SaleDraft (+3 more)

### Community 36 - "today"
Cohesion: 0.44
Nodes (7): activeEvent(), today(), blankEvent(), Events(), finalize(), openAdding(), patch()

### Community 37 - "push"
Cohesion: 0.42
Nodes (9): deletedNoteIdsOf(), createSync(), canon(), clearScheduled(), fp(), isPrimed(), markPrimed(), push() (+1 more)

### Community 38 - "saleUnitPrice"
Cohesion: 0.47
Nodes (6): fixedPackageTotal(), promoPrice(), promoUnitReward(), round2(), saleUnitPrice(), editLinesForSale()

### Community 39 - "install.ts"
Cohesion: 0.50
Nodes (3): BeforeInstallPromptEvent, isStandalone(), useInstallable()

## Knowledge Gaps
- **142 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+137 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 189 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `syncClientId`, `Inventory.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `today`, `sync.test.ts`, `install.ts`, `ui.tsx`, `Profit.tsx`, `TagModal.tsx`, `store.tsx`, `App`, `SaleRegistration.tsx`, `History.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `syncClientId`, `Inventory.tsx`, `SettingsModal.tsx`, `Dashboard.tsx`, `today`, `Profit.tsx`, `ui.tsx`, `TagModal.tsx`, `Notes`, `store.tsx`, `App`, `SaleRegistration`, `Catalog`, `SaleRegistration.tsx`, `History.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `SettingsModal()` connect `SettingsModal.tsx` to `attach`, `push.ts`, `Inventory.tsx`, `sync.test.ts`, `ui.tsx`, `sync.ts`, `Notes`, `store.tsx`, `useStore`, `App`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _142 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `syncClientId` be split into smaller, more focused modules?**
  _Cohesion score 0.11693548387096774 - nodes in this community are weakly interconnected._
- **Should `Inventory.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08283730158730158 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0824016563146998 - nodes in this community are weakly interconnected._