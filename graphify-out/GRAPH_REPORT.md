# Graph Report - Web  (2026-10-06)

## Corpus Check
- 70 files · ~356,361 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 714 nodes · 2212 edges · 31 communities (26 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4a870d00`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- Inventory.tsx
- SettingsModal.tsx
- react-app/package.json
- dialog.ts
- backStack.ts
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- Inventory
- Mi Tiendita
- AGENTS.md
- store.tsx
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- core.ts
- Dashboard.tsx
- lightbox.ts
- deploy-web.mjs
- react
- inject-sw-version.mjs
- ProductForm.tsx
- useStore
- types.ts
- SaleRegistration.tsx
- Catalog
- TagModal.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 44 edges
2. `useStore()` - 41 edges
3. `esc()` - 34 edges
4. `syncName()` - 34 edges
5. `uid()` - 30 edges
6. `SettingsModal()` - 28 edges
7. `react` - 26 edges
8. `Notes()` - 26 edges
9. `SaleRegistration()` - 26 edges
10. `AppProvider()` - 25 edges

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

## Communities (31 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.06
Nodes (97): clearDeletedNotes(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted() (+89 more)

### Community 2 - "Inventory.tsx"
Cohesion: 0.16
Nodes (18): CategoryGroup, DEFAULT_PRODUCT_IMAGE, groupedByCategory(), inventorySold(), productTags(), reorderCategoryProducts(), Product, CargoIcon() (+10 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.08
Nodes (59): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange(), registerAccount() (+51 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (35): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+27 more)

### Community 5 - "dialog.ts"
Cohesion: 0.33
Nodes (6): DialogKind, DialogRequest, emit(), Listener, listeners, open()

### Community 6 - "backStack.ts"
Cohesion: 0.18
Nodes (12): ENTRY, hasOverlay(), popOverlay(), realUrl(), stack, syncHistory(), BackButtonApp, CapacitorGlobal (+4 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.10
Nodes (30): DEV_LOGO, TAB_ICONS, pushOverlay(), resolveDialog(), subscribeDialog(), subscribeLightbox(), ASSETS, preloadDevAssets() (+22 more)

### Community 12 - "Inventory"
Cohesion: 0.26
Nodes (11): Inventory(), bump(), catKey(), catOpen(), cur(), onCargoSuppBlur(), openCargo(), openEdit() (+3 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "store.tsx"
Cohesion: 0.12
Nodes (27): NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt() (+19 more)

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
Cohesion: 0.06
Nodes (83): activeEvent(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+75 more)

### Community 20 - "Dashboard.tsx"
Cohesion: 0.27
Nodes (10): CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel(), monthLines(), monthOf() (+2 more)

### Community 21 - "lightbox.ts"
Cohesion: 0.47
Nodes (5): closeLightbox(), emit(), Listener, listeners, openLightbox()

### Community 22 - "deploy-web.mjs"
Cohesion: 0.40
Nodes (4): dist, entries, here, root

### Community 23 - "react"
Cohesion: 0.07
Nodes (37): App(), selectStore(), setMenu(), useScrollAxisLock(), CapgoGlobal, initCapUpdater(), UpdaterPlugin, consumeDeepNote() (+29 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "ProductForm.tsx"
Cohesion: 0.13
Nodes (24): compressImage(), EditablePromo, fromEditablePromos(), insertCatSorted(), normalizePromo(), numText(), setCategoryPricing(), storeCats() (+16 more)

### Community 27 - "useStore"
Cohesion: 0.18
Nodes (23): esc(), formatDate(), itemLabel(), money(), pad2(), priceFor(), saleUnits(), shortDate() (+15 more)

### Community 30 - "types.ts"
Cohesion: 0.09
Nodes (31): costFor(), costTotal(), DEFAULT_PRODUCT_TAG, makeDraft(), profitTotal(), Ctx, renderLanding(), addTag() (+23 more)

### Community 31 - "SaleRegistration.tsx"
Cohesion: 0.11
Nodes (23): Dropdown(), DropdownItem, catLabel(), findActivePromo(), saleCatsOf(), shortTag(), sortByOrder(), sortProducts() (+15 more)

### Community 33 - "Catalog"
Cohesion: 0.23
Nodes (9): promoText(), customConfirm(), Catalog(), catKey(), catOpen(), removeCategory(), removeProduct(), toggleCat() (+1 more)

### Community 34 - "TagModal.tsx"
Cohesion: 0.33
Nodes (9): insertTagSorted(), removeStoreTag(), renameStoreTag(), storeTags(), Props, TagModal(), add(), commitRename() (+1 more)

## Knowledge Gaps
- **130 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 166 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `sync.ts`, `Inventory.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `TagModal.tsx`, `ui.tsx`, `store.tsx`, `core.ts`, `ProductForm.tsx`, `useStore`, `types.ts`, `SaleRegistration.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `sync.ts`, `Catalog`, `Inventory.tsx`, `SettingsModal.tsx`, `TagModal.tsx`, `ui.tsx`, `Inventory`, `store.tsx`, `core.ts`, `Dashboard.tsx`, `react`, `ProductForm.tsx`, `SaleRegistration.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration.tsx` to `Inventory.tsx`, `ui.tsx`, `core.ts`, `useStore`, `types.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06161616161616162 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07863849765258216 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.057057057057057055 - nodes in this community are weakly interconnected._