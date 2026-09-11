# Graph Report - repo-local  (2026-09-11)

## Corpus Check
- 53 files · ~317,071 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 614 nodes · 1846 edges · 25 communities (20 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b7960273`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- syncClientId
- SettingsModal.tsx
- react-app/package.json
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
- lightbox.ts
- App.tsx
- Inventory.tsx
- pushOverlay
- StoreModal.tsx
- ui.tsx
- dialog.ts

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 30 edges
5. `esc()` - 28 edges
6. `Inventory()` - 26 edges
7. `Notes()` - 25 edges
8. `SaleRegistration()` - 25 edges
9. `react` - 24 edges
10. `applyRemote()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts

## Import Cycles
- None detected.

## Communities (25 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.08
Nodes (66): clearDeletedNotes(), costEntryKey(), dedupeCosts(), deletedNoteIdsOf(), deletedNotesKey(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted() (+58 more)

### Community 2 - "syncClientId"
Cohesion: 0.15
Nodes (35): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), EditablePromo, ensureCost(), fromEditablePromos() (+27 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.06
Nodes (59): askSwVersion(), useAppVersion(), APP_VERSION, DeletedStoreRecord, deletedStores(), saveState(), BeforeInstallPromptEvent, isStandalone() (+51 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (38): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+30 more)

### Community 5 - "App"
Cohesion: 0.25
Nodes (8): App(), selectStore(), setMenu(), useScrollAxisLock(), initDeepLink(), readDeepTab(), readParam(), TABS

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.11
Nodes (34): addChecklistItem(), canDeleteNote(), canEditNote(), canManageNotes(), deleteNoteMsg(), deleteNoteReply(), editChecklistNote(), editNoteMsg() (+26 more)

### Community 12 - "SaleRegistration"
Cohesion: 0.11
Nodes (23): activeEvent(), fixedPackageTotal(), promoPrice(), promoUnitReward(), round2(), saleCatsOf(), saleUnitPrice(), StoreEvent (+15 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "core.ts"
Cohesion: 0.05
Nodes (79): CategoryGroup, catLabel(), CLIENT_KEY, costFor(), costTotal(), DEFAULT_PROD_SVG, DEFAULT_PRODUCT_TAG, DEFAULT_STORE_SVG (+71 more)

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
Cohesion: 0.11
Nodes (16): DEV_LOGO, TAB_ICONS, ASSETS, preloadDevAssets(), BoxIcon(), CalendarIcon(), CatalogIcon(), ChartIcon() (+8 more)

### Community 22 - "Inventory.tsx"
Cohesion: 0.08
Nodes (48): Dropdown(), DropdownItem, DEFAULT_PRODUCT_IMAGE, getSupplierInfo(), groupedByCategory(), inventorySold(), productTags(), promoText() (+40 more)

### Community 23 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 24 - "StoreModal.tsx"
Cohesion: 0.10
Nodes (31): canManageTeam(), compressImage(), DEFAULT_STORE_IMAGE, isStoreOwner(), myRole(), rememberDeletedStore(), syncGenPin(), syncSetName() (+23 more)

### Community 25 - "ui.tsx"
Cohesion: 0.12
Nodes (14): BellIcon(), CargoIcon(), CartIcon(), CashIcon(), CategorySuggest(), CheckboxOutlineIcon(), ChecklistIcon(), ChevronIcon() (+6 more)

### Community 28 - "dialog.ts"
Cohesion: 0.24
Nodes (10): customAlert(), DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog() (+2 more)

## Knowledge Gaps
- **110 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+105 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 145 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inventory.tsx` to `syncClientId`, `SettingsModal.tsx`, `react-app/package.json`, `Notes.tsx`, `SaleRegistration`, `core.ts`, `App.tsx`, `StoreModal.tsx`, `ui.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `syncClientId`, `App.tsx`, `Inventory.tsx`, `core.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _110 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08208955223880597 - nodes in this community are weakly interconnected._
- **Should `syncClientId` be split into smaller, more focused modules?**
  _Cohesion score 0.14615384615384616 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05875251509054326 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._