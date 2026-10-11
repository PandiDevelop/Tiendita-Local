# Graph Report - Web  (2026-10-10)

## Corpus Check
- 71 files · ~364,491 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 755 nodes · 2365 edges · 30 communities (25 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dc388274`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- ProductForm.tsx
- SettingsModal.tsx
- react-app/package.json
- esc
- store.tsx
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- useStore
- Mi Tiendita
- AGENTS.md
- dialog.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- Notes.tsx
- Inventory
- Catalog.tsx
- deploy-web.mjs
- App
- inject-sw-version.mjs
- core.ts
- CategoryModal.tsx
- SaleRegistration
- Catalog
- SaleRegistration.tsx

## God Nodes (most connected - your core abstractions)
1. `useStore()` - 43 edges
2. `syncClientId()` - 40 edges
3. `syncName()` - 38 edges
4. `esc()` - 36 edges
5. `SettingsModal()` - 31 edges
6. `uid()` - 30 edges
7. `SaleRegistration()` - 29 edges
8. `react` - 27 edges
9. `AppProvider()` - 26 edges
10. `Notes()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `onCargoSuppBlur()` --calls--> `getSupplierInfo()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (30 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.06
Nodes (93): clearDeletedNotes(), compressImage(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds() (+85 more)

### Community 2 - "ProductForm.tsx"
Cohesion: 0.18
Nodes (21): ensureCost(), findCostId(), getSupplierCost(), getSupplierInfo(), insertProductAlphabetically(), nextSuppTag(), recordSupplierPrice(), setSupplierCost() (+13 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.06
Nodes (75): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange(), registerAccount() (+67 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (34): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+26 more)

### Community 5 - "esc"
Cohesion: 0.22
Nodes (16): costFor(), esc(), inventorySold(), itemLabel(), priceFor(), productLedger(), profitTotal(), HScroll() (+8 more)

### Community 6 - "store.tsx"
Cohesion: 0.06
Nodes (51): costTotal(), DEFAULT_PRODUCT_TAG, loadState(), makeDraft(), NOTE_TTL_MS, saveState(), sortByOrder(), archiveMarkGone() (+43 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.11
Nodes (27): capFirst(), DEV_LOGO, MenuClock(), TAB_ICONS, resolveDialog(), subscribeDialog(), closeLightbox(), emit() (+19 more)

### Community 12 - "useStore"
Cohesion: 0.26
Nodes (11): insertTagSorted(), removeStoreTag(), renameStoreTag(), storeTags(), useStore(), JoinModal(), Props, TagModal() (+3 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "dialog.ts"
Cohesion: 0.33
Nodes (6): DialogKind, DialogRequest, emit(), Listener, listeners, open()

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
Nodes (53): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), canDeleteNote(), canEditNote(), canManageNotes(), deleteNoteMsg() (+45 more)

### Community 20 - "Inventory"
Cohesion: 0.18
Nodes (16): adoptInvLog(), reorderCategoryProducts(), startProdDrag(), Inventory(), bump(), catKey(), catOpen(), cur() (+8 more)

### Community 21 - "Catalog.tsx"
Cohesion: 0.20
Nodes (16): pushOverlay(), DEFAULT_PRODUCT_IMAGE, groupedByCategory(), productTags(), Product, CargoIcon(), GearMenu(), Image() (+8 more)

### Community 22 - "deploy-web.mjs"
Cohesion: 0.40
Nodes (4): dist, entries, here, root

### Community 23 - "App"
Cohesion: 0.05
Nodes (48): App(), selectStore(), setMenu(), useScrollAxisLock(), ENTRY, hasOverlay(), popOverlay(), realUrl() (+40 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "core.ts"
Cohesion: 0.05
Nodes (64): activeEvent(), canManageTeam(), CategoryGroup, costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds (+56 more)

### Community 26 - "CategoryModal.tsx"
Cohesion: 0.17
Nodes (14): EditablePromo, fromEditablePromos(), insertCatSorted(), normalizePromo(), saleCatsOf(), setCategoryPricing(), storeCats(), SaveIcon() (+6 more)

### Community 27 - "SaleRegistration"
Cohesion: 0.19
Nodes (13): catLabel(), shortTag(), exportTxt(), saleCatNames(), SaleRegistration(), addLine(), catUnits(), persist() (+5 more)

### Community 29 - "Catalog"
Cohesion: 0.25
Nodes (8): promoText(), Catalog(), catKey(), catOpen(), toggleCat(), ProductForm(), commitTag(), flashTagLimit()

### Community 30 - "SaleRegistration.tsx"
Cohesion: 0.18
Nodes (14): Dropdown(), DropdownItem, findActivePromo(), money(), productPromos(), sortProducts(), CaretIcon(), CloseIcon() (+6 more)

## Knowledge Gaps
- **137 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+132 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 182 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SaleRegistration.tsx` to `sync.ts`, `ProductForm.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `esc`, `store.tsx`, `ui.tsx`, `useStore`, `Notes.tsx`, `Catalog.tsx`, `App`, `core.ts`, `CategoryModal.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `sync.ts`, `ProductForm.tsx`, `SettingsModal.tsx`, `esc`, `store.tsx`, `ui.tsx`, `Notes.tsx`, `Inventory`, `Catalog.tsx`, `App`, `core.ts`, `CategoryModal.tsx`, `SaleRegistration`, `Catalog`, `SaleRegistration.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `syncName()` connect `Notes.tsx` to `sync.ts`, `ProductForm.tsx`, `SettingsModal.tsx`, `useStore`, `Inventory`, `Catalog.tsx`, `core.ts`, `SaleRegistration`, `SaleRegistration.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _137 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06403508771929825 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05924510272336359 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05873015873015873 - nodes in this community are weakly interconnected._