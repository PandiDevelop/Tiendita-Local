# Graph Report - Web  (2026-09-21)

## Corpus Check
- 66 files · ~354,696 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 694 nodes · 2174 edges · 33 communities (28 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `74d622b7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- App
- SettingsModal.tsx
- react-app/package.json
- dialog.ts
- DevThemes.tsx
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
- CategoryModal.tsx
- core.ts
- backStack.ts
- Notes.tsx
- syncName
- inject-sw-version.mjs
- Inventory.tsx
- types.ts
- useStore
- ProductForm.tsx
- Inventory
- sync.test.ts
- SaleRegistration
- ProductForm

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

## Communities (33 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (87): clearDeletedNotes(), costEntryKey(), dedupeCosts(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore() (+79 more)

### Community 2 - "App"
Cohesion: 0.40
Nodes (4): App(), selectStore(), setMenu(), useScrollAxisLock()

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.09
Nodes (51): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), registerAccount(), sendPasswordReset() (+43 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (34): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+26 more)

### Community 5 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 6 - "DevThemes.tsx"
Cohesion: 0.18
Nodes (15): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themeOptions(), themePref (+7 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.11
Nodes (24): DEV_LOGO, TAB_ICONS, ASSETS, preloadDevAssets(), BoxIcon(), CalendarIcon(), CargoIcon(), CatalogIcon() (+16 more)

### Community 12 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "store.tsx"
Cohesion: 0.09
Nodes (45): onAccountChange(), loadState(), NOTE_TTL_MS, samePerson(), saveState(), archiveMarkGone(), archiveRows(), archiveUpsert() (+37 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "CategoryModal.tsx"
Cohesion: 0.16
Nodes (15): EditablePromo, insertCatSorted(), numText(), saleCatsOf(), storeCats(), toEditablePromos(), CloseIcon(), SaveIcon() (+7 more)

### Community 20 - "core.ts"
Cohesion: 0.16
Nodes (16): DEFAULT_PROD_SVG, DEFAULT_PRODUCT_TAG, DEFAULT_STORE_SVG, deletedNoteIds, fixedPackageTotal(), KEY, promoPrice(), promoUnitReward() (+8 more)

### Community 21 - "backStack.ts"
Cohesion: 0.18
Nodes (13): ENTRY, hasOverlay(), popOverlay(), pushOverlay(), realUrl(), stack, syncHistory(), BackButtonApp (+5 more)

### Community 22 - "Notes.tsx"
Cohesion: 0.10
Nodes (37): canDeleteNote(), canEditNote(), canManageNotes(), canManageTeam(), deleteNoteMsg(), deleteNoteReply(), editChecklistNote(), editNoteMsg() (+29 more)

### Community 23 - "syncName"
Cohesion: 0.32
Nodes (16): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), syncName(), timeNow(), today() (+8 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "Inventory.tsx"
Cohesion: 0.19
Nodes (11): Dropdown(), DropdownItem, CategoryGroup, DEFAULT_PRODUCT_IMAGE, Product, SaleItem, CaretIcon(), ReceiptIcon() (+3 more)

### Community 26 - "types.ts"
Cohesion: 0.08
Nodes (35): InvLogRow, makeDraft(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam(), TABS, AppCtx (+27 more)

### Community 27 - "useStore"
Cohesion: 0.06
Nodes (70): activeEvent(), catLabel(), costFor(), esc(), findActivePromo(), formatDate(), groupedByCategory(), insertTagSorted() (+62 more)

### Community 28 - "ProductForm.tsx"
Cohesion: 0.35
Nodes (12): ensureCost(), fromEditablePromos(), getSupplierCost(), insertProductAlphabetically(), nextSuppTag(), normalizePromo(), recordSupplierPrice(), setCategoryPricing() (+4 more)

### Community 29 - "Inventory"
Cohesion: 0.23
Nodes (12): getSupplierInfo(), Inventory(), bump(), catKey(), catOpen(), cur(), onCargoSuppBlur(), openCargo() (+4 more)

### Community 30 - "sync.test.ts"
Cohesion: 0.22
Nodes (6): costTotal(), findCostId(), addProduct(), apply(), makePayload(), CostEntry

### Community 31 - "SaleRegistration"
Cohesion: 0.23
Nodes (10): shortTag(), SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine() (+2 more)

### Community 32 - "ProductForm"
Cohesion: 0.40
Nodes (6): compressImage(), ProductForm(), commitTag(), flashTagLimit(), onFile(), onFile()

## Knowledge Gaps
- **120 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 157 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `sync.ts`, `SettingsModal.tsx`, `react-app/package.json`, `DevThemes.tsx`, `ui.tsx`, `store.tsx`, `CategoryModal.tsx`, `backStack.ts`, `Notes.tsx`, `Inventory.tsx`, `types.ts`, `ProductForm.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `ProductForm`, `sync.ts`, `App`, `SettingsModal.tsx`, `ui.tsx`, `store.tsx`, `CategoryModal.tsx`, `Notes.tsx`, `syncName`, `Inventory.tsx`, `ProductForm.tsx`, `Inventory`, `SaleRegistration`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `ui.tsx`, `CategoryModal.tsx`, `core.ts`, `syncName`, `Inventory.tsx`, `types.ts`, `useStore`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0669050051072523 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09201480698043363 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05873015873015873 - nodes in this community are weakly interconnected._