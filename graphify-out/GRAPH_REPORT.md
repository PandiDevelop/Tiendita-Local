# Graph Report - repo-local  (2026-09-16)

## Corpus Check
- 60 files · ~347,811 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 678 nodes · 2086 edges · 32 communities (27 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `029b489f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- ProductForm.tsx
- SettingsModal.tsx
- react-app/package.json
- Catalog.tsx
- App
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- SaleRegistration
- Mi Tiendita
- AGENTS.md
- core.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- useStore
- ui.tsx
- sync.test.ts
- Inventory.tsx
- pushOverlay
- inject-sw-version.mjs
- esc
- store.tsx
- Dashboard.tsx
- dialog.ts
- Profit.tsx
- TagModal.tsx
- Events.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 43 edges
2. `useStore()` - 37 edges
3. `syncName()` - 34 edges
4. `esc()` - 32 edges
5. `uid()` - 31 edges
6. `SettingsModal()` - 28 edges
7. `Inventory()` - 26 edges
8. `Notes()` - 26 edges
9. `react` - 25 edges
10. `SaleRegistration()` - 25 edges

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

## Communities (32 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (87): clearDeletedNotes(), compressImage(), deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted() (+79 more)

### Community 2 - "ProductForm.tsx"
Cohesion: 0.07
Nodes (56): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), DEFAULT_PRODUCT_TAG, EditablePromo, ensureCost() (+48 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.07
Nodes (64): accountEnabled(), authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange() (+56 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "Catalog.tsx"
Cohesion: 0.15
Nodes (18): DEFAULT_STORE_IMAGE, groupedByCategory(), inventorySold(), productTags(), promoText(), reorderCategoryProducts(), shortTag(), PrintIcon() (+10 more)

### Community 6 - "App"
Cohesion: 0.09
Nodes (25): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+17 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.09
Nodes (40): addChecklistItem(), canDeleteNote(), canEditNote(), canManageNotes(), canManageTeam(), deleteNoteMsg(), deleteNoteReply(), editChecklistNote() (+32 more)

### Community 12 - "SaleRegistration"
Cohesion: 0.26
Nodes (9): SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine(), setManualPrice() (+1 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "core.ts"
Cohesion: 0.10
Nodes (27): CategoryGroup, costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, DeletedStoreRecord, fixedPackageTotal() (+19 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "useStore"
Cohesion: 0.16
Nodes (17): insertCatSorted(), numText(), saleCatsOf(), storeCats(), toEditablePromos(), useStore(), CloseIcon(), Modal() (+9 more)

### Community 20 - "ui.tsx"
Cohesion: 0.11
Nodes (25): DEV_LOGO, TAB_ICONS, resolveDialog(), subscribeDialog(), closeLightbox(), emit(), Listener, listeners (+17 more)

### Community 21 - "sync.test.ts"
Cohesion: 0.16
Nodes (13): findCostId(), loadState(), makeDraft(), sortByOrder(), Ctx, addProduct(), apply(), Device (+5 more)

### Community 22 - "Inventory.tsx"
Cohesion: 0.15
Nodes (14): Dropdown(), DropdownItem, DEFAULT_PRODUCT_IMAGE, sortProducts(), Product, CaretIcon(), CargoIcon(), GearMenu() (+6 more)

### Community 23 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "esc"
Cohesion: 0.24
Nodes (16): catLabel(), esc(), findActivePromo(), formatDate(), itemLabel(), money(), saleUnits(), shortDate() (+8 more)

### Community 26 - "store.tsx"
Cohesion: 0.12
Nodes (27): NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt() (+19 more)

### Community 27 - "Dashboard.tsx"
Cohesion: 0.23
Nodes (11): SaleItem, BoxIcon(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel() (+3 more)

### Community 28 - "dialog.ts"
Cohesion: 0.33
Nodes (6): DialogKind, DialogRequest, emit(), Listener, listeners, open()

### Community 29 - "Profit.tsx"
Cohesion: 0.29
Nodes (10): costFor(), costTotal(), priceFor(), profitTotal(), Sale, PLine, Profit(), profitLines() (+2 more)

### Community 30 - "TagModal.tsx"
Cohesion: 0.33
Nodes (9): insertTagSorted(), removeStoreTag(), renameStoreTag(), storeTags(), Props, TagModal(), add(), commitRename() (+1 more)

### Community 31 - "Events.tsx"
Cohesion: 0.39
Nodes (7): activeEvent(), blankEvent(), Events(), finalize(), openAdding(), patch(), today()

## Knowledge Gaps
- **117 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+112 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 155 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inventory.tsx` to `sync.ts`, `ProductForm.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `Catalog.tsx`, `App`, `Notes.tsx`, `useStore`, `ui.tsx`, `esc`, `store.tsx`, `Profit.tsx`, `TagModal.tsx`, `Events.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `sync.ts`, `ProductForm.tsx`, `SettingsModal.tsx`, `Catalog.tsx`, `App`, `Notes.tsx`, `SaleRegistration`, `ui.tsx`, `Inventory.tsx`, `esc`, `store.tsx`, `Dashboard.tsx`, `Profit.tsx`, `TagModal.tsx`, `Events.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `ProductForm.tsx`, `Catalog.tsx`, `useStore`, `ui.tsx`, `Inventory.tsx`, `esc`, `Events.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _117 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.067926455566905 - nodes in this community are weakly interconnected._
- **Should `ProductForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07365967365967366 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06793206793206794 - nodes in this community are weakly interconnected._