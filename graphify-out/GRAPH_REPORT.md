# Graph Report - Web  (2026-09-28)

## Corpus Check
- 69 files · ~355,450 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 704 nodes · 2192 edges · 35 communities (29 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0d11efcf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- core.ts
- App
- SettingsModal.tsx
- react-app/package.json
- dialog.ts
- main.tsx
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- lightbox.ts
- Mi Tiendita
- AGENTS.md
- store.tsx
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- syncClientId
- GearMenu
- StoreModal.tsx
- Notes.tsx
- DevThemes.tsx
- inject-sw-version.mjs
- Inventory.tsx
- useStore
- esc
- ProductForm
- Inventory
- types.ts
- SaleRegistration
- Dashboard.tsx
- Catalog
- features.test.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 43 edges
2. `useStore()` - 41 edges
3. `esc()` - 34 edges
4. `syncName()` - 34 edges
5. `uid()` - 30 edges
6. `SettingsModal()` - 28 edges
7. `react` - 26 edges
8. `Notes()` - 26 edges
9. `SaleRegistration()` - 26 edges
10. `Inventory()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `doToggleItem()` --calls--> `toggleChecklistItem()`  [EXTRACTED]
  react-app/src/views/Notes.tsx → react-app/src/lib/core.ts
- `doSignIn()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/AuthLanding.tsx → react-app/src/lib/sync.ts

## Import Cycles
- None detected.

## Communities (35 total, 5 thin omitted)

### Community 0 - "core.ts"
Cohesion: 0.07
Nodes (79): clearDeletedNotes(), costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_IMAGE, DEFAULT_STORE_SVG, deletedNoteIds, deletedNoteIdsOf() (+71 more)

### Community 2 - "App"
Cohesion: 0.18
Nodes (11): App(), selectStore(), setMenu(), useScrollAxisLock(), askSwVersion(), useAppVersion(), consumeDeepNote(), initDeepLink() (+3 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.07
Nodes (68): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), registerAccount(), sendPasswordReset() (+60 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (33): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+25 more)

### Community 5 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 6 - "main.tsx"
Cohesion: 0.10
Nodes (22): ENTRY, hasOverlay(), popOverlay(), pushOverlay(), realUrl(), stack, syncHistory(), CapgoGlobal (+14 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.11
Nodes (20): DEV_LOGO, TAB_ICONS, ASSETS, preloadDevAssets(), ModalKind, CalendarIcon(), CargoIcon(), CatalogIcon() (+12 more)

### Community 12 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "store.tsx"
Cohesion: 0.12
Nodes (32): onAccountChange(), loadState(), NOTE_TTL_MS, samePerson(), saveState(), archiveMarkGone(), archiveRows(), archiveUpsert() (+24 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "syncClientId"
Cohesion: 0.09
Nodes (49): activeEvent(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), DEFAULT_PRODUCT_TAG, EditablePromo (+41 more)

### Community 21 - "StoreModal.tsx"
Cohesion: 0.11
Nodes (29): compressImage(), isStoreOwner(), myRole(), customConfirm(), clearSeenNoteIds(), detach(), deactivateSyncFn(), deleteStoreFn() (+21 more)

### Community 22 - "Notes.tsx"
Cohesion: 0.09
Nodes (35): canDeleteNote(), canEditNote(), canManageNotes(), canManageTeam(), deleteNoteReply(), editChecklistNote(), editNoteMsg(), editNoteReply() (+27 more)

### Community 23 - "DevThemes.tsx"
Cohesion: 0.20
Nodes (16): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themeOptions(), themePref (+8 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "Inventory.tsx"
Cohesion: 0.23
Nodes (15): Dropdown(), DropdownItem, DEFAULT_PRODUCT_IMAGE, groupedByCategory(), productTags(), saleCatsOf(), shortTag(), sortProducts() (+7 more)

### Community 26 - "useStore"
Cohesion: 0.43
Nodes (5): useStore(), Modal(), StoreImage(), JoinModal(), StorePicker()

### Community 27 - "esc"
Cohesion: 0.20
Nodes (21): catLabel(), esc(), findActivePromo(), formatDate(), inventorySold(), itemLabel(), money(), priceFor() (+13 more)

### Community 28 - "ProductForm"
Cohesion: 0.32
Nodes (7): numText(), toEditablePromos(), CategoryModal(), loadCat(), ProductForm(), commitTag(), flashTagLimit()

### Community 29 - "Inventory"
Cohesion: 0.29
Nodes (10): getSupplierInfo(), Inventory(), catKey(), catOpen(), cur(), onCargoSuppBlur(), openEdit(), saveEdit() (+2 more)

### Community 30 - "types.ts"
Cohesion: 0.08
Nodes (35): CategoryGroup, costFor(), costTotal(), findCostId(), makeDraft(), profitTotal(), sortByOrder(), Ctx (+27 more)

### Community 31 - "SaleRegistration"
Cohesion: 0.26
Nodes (9): SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine(), setManualPrice() (+1 more)

### Community 32 - "Dashboard.tsx"
Cohesion: 0.23
Nodes (12): total(), BoxIcon(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel() (+4 more)

### Community 33 - "Catalog"
Cohesion: 0.24
Nodes (8): promoText(), reorderCategoryProducts(), Catalog(), catKey(), catOpen(), startProdDrag(), toggleCat(), startProdDrag()

### Community 34 - "features.test.tsx"
Cohesion: 0.21
Nodes (11): insertTagSorted(), removeStoreTag(), renameStoreTag(), storeTags(), addTag(), fieldControl(), Props, TagModal() (+3 more)

## Knowledge Gaps
- **125 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+120 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 161 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inventory.tsx` to `App`, `SettingsModal.tsx`, `react-app/package.json`, `features.test.tsx`, `main.tsx`, `ui.tsx`, `store.tsx`, `syncClientId`, `StoreModal.tsx`, `Notes.tsx`, `DevThemes.tsx`, `useStore`, `esc`, `types.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `Dashboard.tsx`, `Catalog`, `App`, `SettingsModal.tsx`, `features.test.tsx`, `ui.tsx`, `store.tsx`, `syncClientId`, `StoreModal.tsx`, `Notes.tsx`, `Inventory.tsx`, `esc`, `ProductForm`, `Inventory`, `SaleRegistration`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `features.test.tsx`, `ui.tsx`, `syncClientId`, `Inventory.tsx`, `useStore`, `esc`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _125 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `core.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07222222222222222 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06882716049382716 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06050420168067227 - nodes in this community are weakly interconnected._