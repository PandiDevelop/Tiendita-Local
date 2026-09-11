# Graph Report - repo-local  (2026-09-10)

## Corpus Check
- 52 files · ~136,366 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 580 nodes · 1742 edges · 26 communities (21 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d1576e28`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- useStore
- SettingsModal.tsx
- react-app/package.json
- App
- SaleRegistration
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- StoreModal.tsx
- Mi Tiendita
- AGENTS.md
- Inventory
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- core.ts
- lightbox.ts
- SaleRegistration.tsx
- Inventory.tsx
- ui.tsx
- pushOverlay
- dialog.ts

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 29 edges
5. `esc()` - 28 edges
6. `Notes()` - 25 edges
7. `SaleRegistration()` - 25 edges
8. `react` - 23 edges
9. `Inventory()` - 22 edges
10. `AppProvider()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (26 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.11
Nodes (53): clearDeletedNotes(), deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted(), markNoteDeleted() (+45 more)

### Community 2 - "useStore"
Cohesion: 0.18
Nodes (17): EditablePromo, fromEditablePromos(), insertCatSorted(), normalizePromo(), numText(), setCategoryPricing(), storeCats(), toEditablePromos() (+9 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.08
Nodes (49): DeletedStoreRecord, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt() (+41 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (38): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+30 more)

### Community 5 - "App"
Cohesion: 0.10
Nodes (24): App(), selectStore(), setMenu(), askSwVersion(), useAppVersion(), APP_VERSION, initDeepLink(), readDeepTab() (+16 more)

### Community 6 - "SaleRegistration"
Cohesion: 0.23
Nodes (10): saleCatsOf(), SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine() (+2 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.10
Nodes (50): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+42 more)

### Community 12 - "StoreModal.tsx"
Cohesion: 0.10
Nodes (31): canManageTeam(), compressImage(), DEFAULT_STORE_IMAGE, isStoreOwner(), myRole(), rememberDeletedStore(), syncGenPin(), syncSetName() (+23 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "Inventory"
Cohesion: 0.33
Nodes (10): Inventory(), bump(), catKey(), catOpen(), cur(), openCargo(), openEdit(), saveEdit() (+2 more)

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
Cohesion: 0.05
Nodes (79): CategoryGroup, catLabel(), CLIENT_KEY, costFor(), costTotal(), DEFAULT_PROD_SVG, DEFAULT_PRODUCT_TAG, DEFAULT_STORE_SVG (+71 more)

### Community 20 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 21 - "SaleRegistration.tsx"
Cohesion: 0.28
Nodes (7): Dropdown(), DropdownItem, sortProducts(), ReceiptIcon(), UndoIcon(), Line, react

### Community 22 - "Inventory.tsx"
Cohesion: 0.15
Nodes (23): DEFAULT_PRODUCT_IMAGE, esc(), groupedByCategory(), inventorySold(), money(), productTags(), promoText(), reorderCategoryProducts() (+15 more)

### Community 24 - "ui.tsx"
Cohesion: 0.10
Nodes (22): DEV_LOGO, resolveDialog(), subscribeDialog(), ASSETS, preloadDevAssets(), BellIcon(), CategorySuggest(), CheckboxOutlineIcon() (+14 more)

### Community 27 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 28 - "dialog.ts"
Cohesion: 0.14
Nodes (18): activeEvent(), customConfirm(), DialogKind, DialogRequest, emit(), Listener, listeners, open() (+10 more)

## Knowledge Gaps
- **106 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+101 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 138 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SaleRegistration.tsx` to `useStore`, `SettingsModal.tsx`, `react-app/package.json`, `App`, `Notes.tsx`, `StoreModal.tsx`, `core.ts`, `Inventory.tsx`, `ui.tsx`, `dialog.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `useStore`, `Notes.tsx`, `core.ts`, `SaleRegistration.tsx`, `Inventory.tsx`, `ui.tsx`, `dialog.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _106 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10971348707197764 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08080808080808081 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._
- **Should `App` be split into smaller, more focused modules?**
  _Cohesion score 0.0967741935483871 - nodes in this community are weakly interconnected._