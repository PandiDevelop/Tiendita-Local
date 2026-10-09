# Graph Report - Web  (2026-10-09)

## Corpus Check
- 71 files · ~361,144 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 749 nodes · 2360 edges · 29 communities (24 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f41d617c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- core.ts
- SettingsModal.tsx
- react-app/package.json
- History.tsx
- features.test.tsx
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- Catalog.tsx
- Mi Tiendita
- AGENTS.md
- dialog.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- Notes.tsx
- Catalog
- useStore
- deploy-web.mjs
- App
- inject-sw-version.mjs
- Dashboard.tsx
- ProductForm
- SaleRegistration.tsx
- store.tsx

## God Nodes (most connected - your core abstractions)
1. `useStore()` - 43 edges
2. `syncName()` - 41 edges
3. `syncClientId()` - 40 edges
4. `esc()` - 36 edges
5. `SettingsModal()` - 31 edges
6. `uid()` - 30 edges
7. `react` - 27 edges
8. `SaleRegistration()` - 27 edges
9. `Notes()` - 26 edges
10. `AppProvider()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Catalog.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (29 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.06
Nodes (96): clearDeletedNotes(), costEntryKey(), dedupeCosts(), deletedNoteIdsOf(), deletedNotesKey(), DeletedStoreRecord, deletedStores(), deviceId() (+88 more)

### Community 2 - "core.ts"
Cohesion: 0.06
Nodes (75): activeEvent(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canManageTeam(), CategoryGroup (+67 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.08
Nodes (52): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), registerAccount(), sendPasswordReset() (+44 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (34): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+26 more)

### Community 5 - "History.tsx"
Cohesion: 0.14
Nodes (22): catLabel(), findActivePromo(), priceFor(), productPromos(), saleUnitPrice(), saleUnits(), total(), Sale (+14 more)

### Community 6 - "features.test.tsx"
Cohesion: 0.09
Nodes (29): insertTagSorted(), makeDraft(), removeStoreTag(), renameStoreTag(), storeTags(), AppCtx, ModalKind, renderLanding() (+21 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.10
Nodes (27): capFirst(), DEV_LOGO, MenuClock(), TAB_ICONS, closeLightbox(), emit(), Listener, listeners (+19 more)

### Community 12 - "Catalog.tsx"
Cohesion: 0.18
Nodes (24): DEFAULT_PRODUCT_IMAGE, esc(), groupedByCategory(), inventorySold(), money(), productTags(), promoText(), storeCats() (+16 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "dialog.ts"
Cohesion: 0.11
Nodes (23): ENTRY, hasOverlay(), popOverlay(), pushOverlay(), realUrl(), stack, syncHistory(), customAlert() (+15 more)

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
Nodes (44): canDeleteNote(), canEditNote(), canManageNotes(), deleteNoteMsg(), deleteNoteReply(), editChecklistNote(), editNoteMsg(), editNoteReply() (+36 more)

### Community 20 - "Catalog"
Cohesion: 0.11
Nodes (23): reorderCategoryProducts(), Catalog(), bump(), catKey(), catOpen(), cur(), openEdit(), saveEdit() (+15 more)

### Community 21 - "useStore"
Cohesion: 0.23
Nodes (10): DEFAULT_STORE_IMAGE, itemLabel(), useStore(), Member, Role, ImagePicker(), EmpAcc, Employees() (+2 more)

### Community 22 - "deploy-web.mjs"
Cohesion: 0.40
Nodes (4): dist, entries, here, root

### Community 23 - "App"
Cohesion: 0.07
Nodes (36): App(), selectStore(), setMenu(), useScrollAxisLock(), CapgoGlobal, initCapUpdater(), UpdaterPlugin, consumeDeepNote() (+28 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "Dashboard.tsx"
Cohesion: 0.22
Nodes (12): formatDate(), pad2(), BoxIcon(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line (+4 more)

### Community 26 - "ProductForm"
Cohesion: 0.32
Nodes (7): numText(), toEditablePromos(), CategoryModal(), loadCat(), ProductForm(), commitTag(), flashTagLimit()

### Community 27 - "SaleRegistration.tsx"
Cohesion: 0.13
Nodes (17): Dropdown(), DropdownItem, saleCatsOf(), shortTag(), sortProducts(), ReceiptIcon(), UndoIcon(), Line (+9 more)

### Community 30 - "store.tsx"
Cohesion: 0.08
Nodes (46): onAccountChange(), InvLogRow, loadState(), NOTE_TTL_MS, samePerson(), saveState(), archiveMarkGone(), archiveRows() (+38 more)

## Knowledge Gaps
- **133 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+128 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 175 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Catalog.tsx` to `core.ts`, `SettingsModal.tsx`, `react-app/package.json`, `History.tsx`, `features.test.tsx`, `ui.tsx`, `Notes.tsx`, `useStore`, `App`, `SaleRegistration.tsx`, `store.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `sync.ts`, `core.ts`, `SettingsModal.tsx`, `History.tsx`, `features.test.tsx`, `ui.tsx`, `Catalog.tsx`, `Notes.tsx`, `Catalog`, `App`, `Dashboard.tsx`, `ProductForm`, `SaleRegistration.tsx`, `store.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `syncName()` connect `core.ts` to `sync.ts`, `SettingsModal.tsx`, `History.tsx`, `features.test.tsx`, `Catalog.tsx`, `Notes.tsx`, `Catalog`, `useStore`, `SaleRegistration.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _133 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0586997685672207 - nodes in this community are weakly interconnected._
- **Should `core.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06308473670141673 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08438228438228439 - nodes in this community are weakly interconnected._