# Graph Report - Web  (2026-10-09)

## Corpus Check
- 71 files · ~362,320 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 749 nodes · 2358 edges · 35 communities (29 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `66b4cfbb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- core.ts
- Inventory.tsx
- account.ts
- react-app/package.json
- Profit.tsx
- types.ts
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
- Modal
- deploy-web.mjs
- DevThemes.tsx
- inject-sw-version.mjs
- Dashboard.tsx
- ProductForm.tsx
- SaleRegistration.tsx
- App
- money
- store.tsx
- lightbox.ts
- backStack.ts
- PromoEditor.tsx
- preload.ts

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
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (35 total, 5 thin omitted)

### Community 0 - "core.ts"
Cohesion: 0.05
Nodes (109): clearDeletedNotes(), compressImage(), costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_IMAGE, DEFAULT_STORE_SVG, deletedNoteIds (+101 more)

### Community 2 - "Inventory.tsx"
Cohesion: 0.17
Nodes (26): adoptInvLog(), CategoryGroup, ensureCost(), getSupplierCost(), getSupplierInfo(), nextSuppTag(), recordSupplierPrice(), setSupplierCost() (+18 more)

### Community 3 - "account.ts"
Cohesion: 0.11
Nodes (42): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), registerAccount(), sendPasswordReset() (+34 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (35): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+27 more)

### Community 5 - "Profit.tsx"
Cohesion: 0.15
Nodes (20): Dropdown(), DropdownItem, canManageTeam(), costFor(), groupedByCategory(), inventorySold(), priceFor(), productLedger() (+12 more)

### Community 6 - "types.ts"
Cohesion: 0.07
Nodes (36): costTotal(), DEFAULT_PRODUCT_TAG, findCostId(), makeDraft(), AppCtx, Ctx, ModalKind, renderLanding() (+28 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.12
Nodes (23): capFirst(), DEV_LOGO, MenuClock(), TAB_ICONS, BellIcon(), CalendarIcon(), CatalogIcon(), ChartIcon() (+15 more)

### Community 12 - "useStore"
Cohesion: 0.21
Nodes (17): esc(), insertTagSorted(), productTags(), removeStoreTag(), renameStoreTag(), storeTags(), useStore(), CloseIcon() (+9 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

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
Cohesion: 0.09
Nodes (51): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), canDeleteNote(), canEditNote(), canManageNotes(), deleteNoteMsg() (+43 more)

### Community 20 - "Inventory"
Cohesion: 0.21
Nodes (12): reorderCategoryProducts(), startProdDrag(), Inventory(), bump(), catKey(), catOpen(), cur(), onCargoSuppBlur() (+4 more)

### Community 21 - "Modal"
Cohesion: 0.50
Nodes (3): Modal(), JoinModal(), submit()

### Community 22 - "deploy-web.mjs"
Cohesion: 0.40
Nodes (4): dist, entries, here, root

### Community 23 - "DevThemes.tsx"
Cohesion: 0.07
Nodes (34): hasOverlay(), CapgoGlobal, initCapUpdater(), UpdaterPlugin, BackButtonApp, CapacitorGlobal, initNativeBack(), isNativeApp() (+26 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "Dashboard.tsx"
Cohesion: 0.12
Nodes (26): activeEvent(), formatDate(), itemLabel(), pad2(), today(), total(), Member, BoxIcon() (+18 more)

### Community 26 - "ProductForm.tsx"
Cohesion: 0.17
Nodes (17): DEFAULT_PRODUCT_IMAGE, fromEditablePromos(), insertCatSorted(), insertProductAlphabetically(), numText(), setCategoryPricing(), storeCats(), toEditablePromos() (+9 more)

### Community 27 - "SaleRegistration.tsx"
Cohesion: 0.12
Nodes (23): catLabel(), findActivePromo(), productPromos(), saleCatsOf(), shortTag(), sortByOrder(), sortProducts(), SaleItem (+15 more)

### Community 28 - "App"
Cohesion: 0.20
Nodes (10): App(), selectStore(), setMenu(), useScrollAxisLock(), askSwVersion(), useAppVersion(), initDeepLink(), readDeepTab() (+2 more)

### Community 29 - "money"
Cohesion: 0.33
Nodes (6): money(), promoText(), Catalog(), catKey(), catOpen(), toggleCat()

### Community 30 - "store.tsx"
Cohesion: 0.07
Nodes (58): onAccountChange(), loadState(), runMigrations(), saveState(), shiftDay(), BeforeInstallPromptEvent, isStandalone(), useInstallable() (+50 more)

### Community 31 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 32 - "backStack.ts"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 33 - "PromoEditor.tsx"
Cohesion: 0.38
Nodes (4): EditablePromo, blank(), PromoEditor(), Props

## Knowledge Gaps
- **133 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+128 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 176 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `core.ts`, `Inventory.tsx`, `account.ts`, `react-app/package.json`, `Profit.tsx`, `types.ts`, `ui.tsx`, `Notes.tsx`, `Modal`, `DevThemes.tsx`, `Dashboard.tsx`, `ProductForm.tsx`, `SaleRegistration.tsx`, `App`, `store.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `core.ts`, `Inventory.tsx`, `account.ts`, `Profit.tsx`, `ui.tsx`, `Notes.tsx`, `Inventory`, `Modal`, `Dashboard.tsx`, `ProductForm.tsx`, `SaleRegistration.tsx`, `App`, `money`, `store.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `syncName()` connect `Notes.tsx` to `core.ts`, `Inventory.tsx`, `account.ts`, `Inventory`, `Modal`, `ProductForm.tsx`, `SaleRegistration.tsx`, `store.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _133 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `core.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.052623261694058156 - nodes in this community are weakly interconnected._
- **Should `account.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10935143288084465 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.057057057057057055 - nodes in this community are weakly interconnected._