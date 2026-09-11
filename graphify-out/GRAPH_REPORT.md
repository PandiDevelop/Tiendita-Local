# Graph Report - repo-local  (2026-09-10)

## Corpus Check
- 52 files · ~137,893 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 589 nodes · 1775 edges · 25 communities (20 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9fb15e44`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- core.ts
- sync.test.ts
- store.tsx
- react-app/package.json
- App
- SaleRegistration
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- SettingsModal
- Mi Tiendita
- AGENTS.md
- Profit.tsx
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- ui.tsx
- App.tsx
- lightbox.ts
- Inventory.tsx
- pushOverlay
- dialog.ts

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 29 edges
5. `esc()` - 28 edges
6. `Inventory()` - 25 edges
7. `Notes()` - 25 edges
8. `SaleRegistration()` - 25 edges
9. `react` - 23 edges
10. `AppProvider()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `doToggleItem()` --calls--> `toggleChecklistItem()`  [EXTRACTED]
  react-app/src/views/Notes.tsx → react-app/src/lib/core.ts
- `App()` --calls--> `useAppVersion()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/appVersion.ts

## Import Cycles
- None detected.

## Communities (25 total, 4 thin omitted)

### Community 0 - "core.ts"
Cohesion: 0.06
Nodes (97): canManageTeam(), clearDeletedNotes(), compressImage(), DEFAULT_PROD_SVG, DEFAULT_STORE_IMAGE, DEFAULT_STORE_SVG, deletedNoteIds, deletedNoteIdsOf() (+89 more)

### Community 2 - "sync.test.ts"
Cohesion: 0.12
Nodes (19): CLIENT_KEY, DEFAULT_PRODUCT_TAG, makeDraft(), AppCtx, Ctx, ModalKind, addTag(), setup() (+11 more)

### Community 3 - "store.tsx"
Cohesion: 0.07
Nodes (62): InvLogRow, loadState(), NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt() (+54 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (38): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+30 more)

### Community 5 - "App"
Cohesion: 0.23
Nodes (9): App(), selectStore(), setMenu(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam(), TABS (+1 more)

### Community 6 - "SaleRegistration"
Cohesion: 0.11
Nodes (24): activeEvent(), fixedPackageTotal(), promoPrice(), promoUnitReward(), round2(), saleUnitPrice(), sortByOrder(), sortProducts() (+16 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.09
Nodes (48): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), canDeleteNote(), canEditNote(), canManageNotes() (+40 more)

### Community 12 - "SettingsModal"
Cohesion: 0.18
Nodes (15): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), themeOptions(), themePref, THEMES (+7 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "Profit.tsx"
Cohesion: 0.12
Nodes (32): catLabel(), costFor(), costTotal(), findActivePromo(), formatDate(), itemLabel(), money(), pad2() (+24 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "ui.tsx"
Cohesion: 0.18
Nodes (12): Dropdown(), DropdownItem, saleCatsOf(), CargoIcon(), Modal(), PencilIcon(), PrintIcon(), ReceiptIcon() (+4 more)

### Community 20 - "App.tsx"
Cohesion: 0.15
Nodes (12): DEV_LOGO, askSwVersion(), useAppVersion(), APP_VERSION, ASSETS, preloadDevAssets(), GearIcon(), Logo() (+4 more)

### Community 21 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 22 - "Inventory.tsx"
Cohesion: 0.07
Nodes (62): adoptInvLog(), CategoryGroup, DEFAULT_PRODUCT_IMAGE, EditablePromo, esc(), fromEditablePromos(), getSupplierCost(), getSupplierInfo() (+54 more)

### Community 23 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 28 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

## Knowledge Gaps
- **107 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+102 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 140 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `ui.tsx` to `core.ts`, `sync.test.ts`, `store.tsx`, `react-app/package.json`, `SaleRegistration`, `Notes.tsx`, `SettingsModal`, `Profit.tsx`, `App.tsx`, `Inventory.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `Notes.tsx`, `Profit.tsx`, `ui.tsx`, `App.tsx`, `Inventory.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _107 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `core.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05858585858585859 - nodes in this community are weakly interconnected._
- **Should `sync.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1225071225071225 - nodes in this community are weakly interconnected._
- **Should `store.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0670807453416149 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._