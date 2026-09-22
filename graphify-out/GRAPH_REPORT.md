# Graph Report - Web  (2026-09-21)

## Corpus Check
- 67 files · ~354,878 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 698 nodes · 2179 edges · 35 communities (30 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f1a85372`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- App
- SettingsModal.tsx
- react-app/package.json
- dialog.ts
- TagModal.tsx
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- lightbox.ts
- Mi Tiendita
- AGENTS.md
- notesArchive.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- ProductForm.tsx
- types.ts
- backStack.ts
- core.ts
- today
- inject-sw-version.mjs
- Inventory.tsx
- features.test.tsx
- useStore
- store.tsx
- Inventory
- sync.test.ts
- SaleRegistration.tsx
- Dashboard.tsx
- money
- deepLink.ts

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 43 edges
2. `useStore()` - 41 edges
3. `esc()` - 34 edges
4. `syncName()` - 34 edges
5. `uid()` - 30 edges
6. `SettingsModal()` - 28 edges
7. `react` - 26 edges
8. `Notes()` - 26 edges
9. `SaleRegistration()` - 26 edges
10. `Inventory()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (35 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.08
Nodes (78): DEFAULT_STORE_IMAGE, deletedStores(), forgetDeletedStore(), isStoreOwner(), loadState(), mergeInvLog(), mergeItems(), mergeNoteLog() (+70 more)

### Community 2 - "App"
Cohesion: 0.22
Nodes (7): App(), selectStore(), setMenu(), useScrollAxisLock(), CapgoGlobal, initCapUpdater(), UpdaterPlugin

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.07
Nodes (69): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange(), registerAccount() (+61 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (34): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+26 more)

### Community 5 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 6 - "TagModal.tsx"
Cohesion: 0.11
Nodes (25): insertTagSorted(), removeStoreTag(), renameStoreTag(), storeTags(), applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref() (+17 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.14
Nodes (19): DEV_LOGO, TAB_ICONS, ASSETS, preloadDevAssets(), BoxIcon(), CalendarIcon(), CatalogIcon(), ChartIcon() (+11 more)

### Community 12 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "notesArchive.ts"
Cohesion: 0.27
Nodes (14): archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt(), loadArchive(), noteArchiveText() (+6 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "ProductForm.tsx"
Cohesion: 0.11
Nodes (35): adoptInvLog(), compressImage(), EditablePromo, ensureCost(), fromEditablePromos(), getSupplierCost(), insertCatSorted(), insertProductAlphabetically() (+27 more)

### Community 20 - "types.ts"
Cohesion: 0.13
Nodes (14): InvLogRow, CategoryPricing, CostEntry, InventoryLogEntry, Note, NoteChecklistItem, NoteEditRecord, NoteEntry (+6 more)

### Community 21 - "backStack.ts"
Cohesion: 0.19
Nodes (13): ENTRY, hasOverlay(), popOverlay(), pushOverlay(), realUrl(), stack, syncHistory(), BackButtonApp (+5 more)

### Community 22 - "core.ts"
Cohesion: 0.06
Nodes (68): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), canDeleteNote(), canEditNote(), canManageNotes(), canManageTeam() (+60 more)

### Community 23 - "today"
Cohesion: 0.24
Nodes (12): activeEvent(), today(), customConfirm(), removeCategory(), removeProduct(), blankEvent(), Events(), finalize() (+4 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "Inventory.tsx"
Cohesion: 0.16
Nodes (18): CategoryGroup, DEFAULT_PRODUCT_IMAGE, groupedByCategory(), productTags(), reorderCategoryProducts(), Product, CaretIcon(), CargoIcon() (+10 more)

### Community 26 - "features.test.tsx"
Cohesion: 0.21
Nodes (12): DEFAULT_PRODUCT_TAG, AppCtx, renderLanding(), addTag(), setup(), fieldControl(), makeProduct(), makeState() (+4 more)

### Community 27 - "useStore"
Cohesion: 0.16
Nodes (25): esc(), findActivePromo(), formatDate(), inventorySold(), itemLabel(), pad2(), priceFor(), saleUnits() (+17 more)

### Community 28 - "store.tsx"
Cohesion: 0.20
Nodes (13): NOTE_TTL_MS, saveState(), ctx(), notifyPermission(), playNoteChime(), showSystemNotification(), softVibrate(), tone() (+5 more)

### Community 29 - "Inventory"
Cohesion: 0.23
Nodes (12): getSupplierInfo(), Inventory(), bump(), catKey(), catOpen(), cur(), onCargoSuppBlur(), openCargo() (+4 more)

### Community 30 - "sync.test.ts"
Cohesion: 0.19
Nodes (11): costFor(), costTotal(), findCostId(), makeDraft(), profitTotal(), addProduct(), apply(), Device (+3 more)

### Community 31 - "SaleRegistration.tsx"
Cohesion: 0.12
Nodes (21): Dropdown(), DropdownItem, catLabel(), saleCatsOf(), shortTag(), sortByOrder(), sortProducts(), SaleItem (+13 more)

### Community 32 - "Dashboard.tsx"
Cohesion: 0.27
Nodes (10): CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel(), monthLines(), monthOf() (+2 more)

### Community 33 - "money"
Cohesion: 0.29
Nodes (7): money(), promoText(), Catalog(), catKey(), catOpen(), toggleCat(), register()

### Community 34 - "deepLink.ts"
Cohesion: 0.47
Nodes (5): consumeDeepNote(), initDeepLink(), readDeepTab(), readParam(), TABS

## Knowledge Gaps
- **122 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 159 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SaleRegistration.tsx` to `sync.ts`, `App`, `SettingsModal.tsx`, `react-app/package.json`, `TagModal.tsx`, `ui.tsx`, `ProductForm.tsx`, `core.ts`, `today`, `Inventory.tsx`, `features.test.tsx`, `useStore`, `store.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `Dashboard.tsx`, `money`, `App`, `SettingsModal.tsx`, `sync.ts`, `TagModal.tsx`, `ui.tsx`, `ProductForm.tsx`, `core.ts`, `today`, `Inventory.tsx`, `store.tsx`, `Inventory`, `SaleRegistration.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration.tsx` to `money`, `ui.tsx`, `core.ts`, `today`, `Inventory.tsx`, `features.test.tsx`, `useStore`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07911392405063292 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06758742286218043 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05873015873015873 - nodes in this community are weakly interconnected._