# Graph Report - repo-local  (2026-09-16)

## Corpus Check
- 60 files · ~347,858 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 679 nodes · 2091 edges · 26 communities (21 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b925ab08`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- core.ts
- syncClientId
- SettingsModal.tsx
- react-app/package.json
- Inventory.tsx
- App
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- dialog.ts
- Mi Tiendita
- AGENTS.md
- lightbox.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- App.tsx
- Modal
- inject-sw-version.mjs
- Dashboard.tsx
- store.tsx
- types.ts
- customConfirm

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
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts

## Import Cycles
- None detected.

## Communities (26 total, 4 thin omitted)

### Community 0 - "core.ts"
Cohesion: 0.05
Nodes (104): CategoryGroup, clearDeletedNotes(), compressImage(), costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_IMAGE, DEFAULT_STORE_SVG (+96 more)

### Community 2 - "syncClientId"
Cohesion: 0.07
Nodes (64): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+56 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.07
Nodes (58): accountEnabled(), authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), registerAccount() (+50 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "Inventory.tsx"
Cohesion: 0.06
Nodes (77): Dropdown(), DropdownItem, catLabel(), DEFAULT_PRODUCT_IMAGE, esc(), findActivePromo(), getSupplierInfo(), groupedByCategory() (+69 more)

### Community 6 - "App"
Cohesion: 0.21
Nodes (10): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+2 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.12
Nodes (21): BellIcon(), CargoIcon(), CheckboxOutlineIcon(), ChecklistIcon(), CloseIcon(), confirmDialog(), DownloadIcon(), EyeIcon() (+13 more)

### Community 12 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 20 - "App.tsx"
Cohesion: 0.12
Nodes (14): DEV_LOGO, TAB_ICONS, ASSETS, preloadDevAssets(), CalendarIcon(), CatalogIcon(), ChartIcon(), GearIcon() (+6 more)

### Community 23 - "Modal"
Cohesion: 0.25
Nodes (9): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory(), Modal(), JoinModal() (+1 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "Dashboard.tsx"
Cohesion: 0.23
Nodes (12): total(), BoxIcon(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel() (+4 more)

### Community 26 - "store.tsx"
Cohesion: 0.08
Nodes (48): onAccountChange(), loadState(), NOTE_TTL_MS, samePerson(), saveState(), archiveMarkGone(), archiveRows(), archiveUpsert() (+40 more)

### Community 28 - "types.ts"
Cohesion: 0.07
Nodes (40): costFor(), costTotal(), DEFAULT_PRODUCT_TAG, findCostId(), itemLabel(), makeDraft(), profitTotal(), sortByOrder() (+32 more)

### Community 31 - "customConfirm"
Cohesion: 0.18
Nodes (15): activeEvent(), formatDate(), pad2(), shortDate(), customConfirm(), StoreEvent, removeCategory(), removeProduct() (+7 more)

## Knowledge Gaps
- **117 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+112 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 155 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inventory.tsx` to `core.ts`, `syncClientId`, `SettingsModal.tsx`, `react-app/package.json`, `ui.tsx`, `App.tsx`, `Modal`, `store.tsx`, `types.ts`, `customConfirm`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `useStore()` connect `Inventory.tsx` to `core.ts`, `syncClientId`, `SettingsModal.tsx`, `App`, `ui.tsx`, `App.tsx`, `Modal`, `Dashboard.tsx`, `store.tsx`, `types.ts`, `customConfirm`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `Inventory.tsx` to `syncClientId`, `App.tsx`, `customConfirm`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _117 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `core.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05079850492694529 - nodes in this community are weakly interconnected._
- **Should `syncClientId` be split into smaller, more focused modules?**
  _Cohesion score 0.07081377151799687 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07039573820395738 - nodes in this community are weakly interconnected._