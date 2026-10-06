# Graph Report - Web  (2026-10-06)

## Corpus Check
- 70 files · ~356,481 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 714 nodes · 2214 edges · 27 communities (22 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `70506df5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- ui.tsx
- SettingsModal.tsx
- react-app/package.json
- dialog.ts
- backStack.ts
- compilerOptions
- App.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- App
- Mi Tiendita
- AGENTS.md
- Modal
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- core.ts
- lightbox.ts
- deploy-web.mjs
- DevThemes.tsx
- inject-sw-version.mjs
- useStore
- store.tsx
- SaleRegistration

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
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (27 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.06
Nodes (93): clearDeletedNotes(), compressImage(), costEntryKey(), dedupeCosts(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey(), deletedStores() (+85 more)

### Community 2 - "ui.tsx"
Cohesion: 0.14
Nodes (12): BellIcon(), CargoIcon(), CheckboxOutlineIcon(), ChecklistIcon(), DownloadIcon(), PencilIcon(), PinIcon(), PrintIcon() (+4 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.07
Nodes (69): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange(), registerAccount() (+61 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (35): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+27 more)

### Community 5 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 6 - "backStack.ts"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "App.tsx"
Cohesion: 0.11
Nodes (17): DEV_LOGO, TAB_ICONS, ASSETS, preloadDevAssets(), BoxIcon(), CalendarIcon(), CatalogIcon(), ChartIcon() (+9 more)

### Community 12 - "App"
Cohesion: 0.25
Nodes (8): App(), selectStore(), setMenu(), useScrollAxisLock(), initDeepLink(), readDeepTab(), readParam(), TABS

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "Modal"
Cohesion: 0.50
Nodes (3): Modal(), JoinModal(), submit()

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
Nodes (87): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote(), canManageNotes() (+79 more)

### Community 21 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 22 - "deploy-web.mjs"
Cohesion: 0.40
Nodes (4): dist, entries, here, root

### Community 23 - "DevThemes.tsx"
Cohesion: 0.07
Nodes (33): hasOverlay(), CapgoGlobal, initCapUpdater(), UpdaterPlugin, BackButtonApp, CapacitorGlobal, initNativeBack(), isNativeApp() (+25 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 27 - "useStore"
Cohesion: 0.05
Nodes (87): Dropdown(), DropdownItem, CategoryGroup, catLabel(), costFor(), DEFAULT_PRODUCT_IMAGE, esc(), findActivePromo() (+79 more)

### Community 30 - "store.tsx"
Cohesion: 0.06
Nodes (57): costTotal(), DEFAULT_PRODUCT_TAG, InvLogRow, makeDraft(), NOTE_TTL_MS, saveState(), sortByOrder(), archiveMarkGone() (+49 more)

### Community 31 - "SaleRegistration"
Cohesion: 0.09
Nodes (26): activeEvent(), fixedPackageTotal(), promoPrice(), promoUnitReward(), round2(), saleUnitPrice(), shortTag(), customConfirm() (+18 more)

## Knowledge Gaps
- **130 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 166 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `sync.ts`, `ui.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `App.tsx`, `Modal`, `core.ts`, `DevThemes.tsx`, `store.tsx`, `SaleRegistration`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `sync.ts`, `SettingsModal.tsx`, `App.tsx`, `App`, `Modal`, `core.ts`, `store.tsx`, `SaleRegistration`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `App.tsx`, `core.ts`, `useStore`, `store.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.060246360582306833 - nodes in this community are weakly interconnected._
- **Should `ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06699970614163973 - nodes in this community are weakly interconnected._