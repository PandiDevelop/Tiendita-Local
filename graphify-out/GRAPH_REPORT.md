# Graph Report - repo-local  (2026-09-15)

## Corpus Check
- 59 files · ~344,063 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 656 nodes · 1993 edges · 33 communities (27 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ac14bdc2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- core.ts
- Notes
- SettingsModal.tsx
- react-app/package.json
- deepLink.ts
- Inventory
- compilerOptions
- syncClientId
- vite-env.d.ts
- public/sw.js
- sw.js
- SaleRegistration
- Mi Tiendita
- AGENTS.md
- esc
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- lightbox.ts
- App.tsx
- ui.tsx
- Inventory.tsx
- pushOverlay
- inject-sw-version.mjs
- Catalog
- types.ts
- store.tsx
- dialog.ts
- useStore
- StoreModal.tsx
- customConfirm
- features.test.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 30 edges
5. `esc()` - 28 edges
6. `Inventory()` - 26 edges
7. `Notes()` - 26 edges
8. `SettingsModal()` - 26 edges
9. `SaleRegistration()` - 25 edges
10. `react` - 24 edges

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

## Communities (33 total, 5 thin omitted)

### Community 0 - "core.ts"
Cohesion: 0.07
Nodes (80): CategoryGroup, clearDeletedNotes(), costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_IMAGE, DEFAULT_STORE_SVG, deletedNoteIds (+72 more)

### Community 2 - "Notes"
Cohesion: 0.14
Nodes (23): addChecklistItem(), canDeleteNote(), canEditNote(), deleteNoteReply(), editChecklistNote(), editNoteMsg(), editNoteReply(), findNote() (+15 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.06
Nodes (59): App(), selectStore(), setMenu(), useScrollAxisLock(), accountEnabled(), authMessage(), currentIdentity(), emit() (+51 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "deepLink.ts"
Cohesion: 0.38
Nodes (6): consumeDeepNote(), initDeepLink(), readDeepTab(), readParam(), TABS, Tab

### Community 6 - "Inventory"
Cohesion: 0.21
Nodes (13): getSupplierCost(), getSupplierInfo(), Inventory(), bump(), catKey(), catOpen(), cur(), onCargoSuppBlur() (+5 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "syncClientId"
Cohesion: 0.12
Nodes (42): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), DEFAULT_PRODUCT_TAG, EditablePromo, ensureCost() (+34 more)

### Community 12 - "SaleRegistration"
Cohesion: 0.26
Nodes (9): SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine(), setManualPrice() (+1 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "esc"
Cohesion: 0.19
Nodes (23): catLabel(), costFor(), esc(), findActivePromo(), formatDate(), itemLabel(), money(), priceFor() (+15 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 20 - "App.tsx"
Cohesion: 0.12
Nodes (14): DEV_LOGO, TAB_ICONS, ASSETS, preloadDevAssets(), CalendarIcon(), CatalogIcon(), ChartIcon(), GearIcon() (+6 more)

### Community 21 - "ui.tsx"
Cohesion: 0.13
Nodes (18): BellIcon(), CargoIcon(), CheckboxOutlineIcon(), ChecklistIcon(), CloseIcon(), DownloadIcon(), GearMenu(), NoteTextIcon() (+10 more)

### Community 22 - "Inventory.tsx"
Cohesion: 0.22
Nodes (18): Dropdown(), DropdownItem, DEFAULT_PRODUCT_IMAGE, groupedByCategory(), inventorySold(), productTags(), saleCatsOf(), shortTag() (+10 more)

### Community 23 - "pushOverlay"
Cohesion: 0.39
Nodes (7): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory(), Modal()

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "Catalog"
Cohesion: 0.24
Nodes (8): promoText(), reorderCategoryProducts(), Catalog(), catKey(), catOpen(), startProdDrag(), toggleCat(), startProdDrag()

### Community 26 - "types.ts"
Cohesion: 0.08
Nodes (29): costTotal(), makeDraft(), sortByOrder(), AppCtx, Ctx, ModalKind, setup(), addProduct() (+21 more)

### Community 27 - "store.tsx"
Cohesion: 0.09
Nodes (44): loadState(), NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt() (+36 more)

### Community 28 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 29 - "useStore"
Cohesion: 0.18
Nodes (13): useStore(), SaleItem, BoxIcon(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line (+5 more)

### Community 30 - "StoreModal.tsx"
Cohesion: 0.10
Nodes (30): canManageTeam(), compressImage(), isStoreOwner(), myRole(), syncSetName(), clearSeenNoteIds(), detach(), deactivateSyncFn() (+22 more)

### Community 31 - "customConfirm"
Cohesion: 0.20
Nodes (13): activeEvent(), customConfirm(), StoreEvent, confirmDialog(), removeCategory(), removeProduct(), blankEvent(), Events() (+5 more)

## Knowledge Gaps
- **116 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 153 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inventory.tsx` to `SettingsModal.tsx`, `react-app/package.json`, `syncClientId`, `esc`, `App.tsx`, `ui.tsx`, `types.ts`, `store.tsx`, `StoreModal.tsx`, `customConfirm`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `syncClientId`, `esc`, `App.tsx`, `Inventory.tsx`, `useStore`, `customConfirm`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _116 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `core.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06540447504302926 - nodes in this community are weakly interconnected._
- **Should `Notes` be split into smaller, more focused modules?**
  _Cohesion score 0.13538461538461538 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06414414414414414 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._