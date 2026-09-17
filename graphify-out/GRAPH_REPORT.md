# Graph Report - Web  (2026-09-16)

## Corpus Check
- 65 files · ~350,156 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 699 nodes · 2174 edges · 34 communities (28 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a34cbdc0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- Notes.tsx
- account.ts
- react-app/package.json
- useStore
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
- core.ts
- appVersion.ts
- theme.ts
- StoreModal.tsx
- pushOverlay
- inject-sw-version.mjs
- Dashboard.tsx
- store.tsx
- History.tsx
- sync.test.ts
- Events.tsx
- testUtils.tsx
- SaleRegistration
- saleUnitPrice
- Employees.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 43 edges
2. `useStore()` - 41 edges
3. `esc()` - 34 edges
4. `syncName()` - 34 edges
5. `uid()` - 31 edges
6. `SettingsModal()` - 28 edges
7. `react` - 26 edges
8. `Inventory()` - 26 edges
9. `Notes()` - 26 edges
10. `SaleRegistration()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts
- `doSignIn()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/AuthLanding.tsx → react-app/src/lib/sync.ts

## Import Cycles
- None detected.

## Communities (34 total, 5 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.10
Nodes (58): clearDeletedNotes(), costEntryKey(), dedupeCosts(), deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds() (+50 more)

### Community 2 - "Notes.tsx"
Cohesion: 0.09
Nodes (59): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+51 more)

### Community 3 - "account.ts"
Cohesion: 0.11
Nodes (43): accountEnabled(), authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), registerAccount() (+35 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "useStore"
Cohesion: 0.05
Nodes (77): Dropdown(), DropdownItem, DEFAULT_PRODUCT_IMAGE, DEFAULT_PRODUCT_TAG, EditablePromo, esc(), fromEditablePromos(), getSupplierInfo() (+69 more)

### Community 6 - "App"
Cohesion: 0.21
Nodes (10): App(), selectStore(), setMenu(), useScrollAxisLock(), canManageTeam(), consumeDeepNote(), initDeepLink(), readDeepTab() (+2 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.08
Nodes (29): DEV_LOGO, TAB_ICONS, ASSETS, preloadDevAssets(), BellIcon(), BoxIcon(), CalendarIcon(), CargoIcon() (+21 more)

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

### Community 19 - "core.ts"
Cohesion: 0.10
Nodes (23): CategoryGroup, DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, InvLogRow, KEY, numText(), SYNC_DEFAULT_NAME (+15 more)

### Community 21 - "theme.ts"
Cohesion: 0.18
Nodes (15): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themeOptions(), themePref (+7 more)

### Community 22 - "StoreModal.tsx"
Cohesion: 0.10
Nodes (31): compressImage(), DEFAULT_STORE_IMAGE, isStoreOwner(), myRole(), rememberDeletedStore(), syncGenPin(), customConfirm(), clearSeenNoteIds() (+23 more)

### Community 23 - "pushOverlay"
Cohesion: 0.18
Nodes (13): ENTRY, hasOverlay(), popOverlay(), pushOverlay(), realUrl(), stack, syncHistory(), BackButtonApp (+5 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "Dashboard.tsx"
Cohesion: 0.26
Nodes (12): priceFor(), total(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel() (+4 more)

### Community 26 - "store.tsx"
Cohesion: 0.07
Nodes (54): onAccountChange(), DeletedStoreRecord, loadState(), NOTE_TTL_MS, saveState(), BeforeInstallPromptEvent, isStandalone(), useInstallable() (+46 more)

### Community 27 - "History.tsx"
Cohesion: 0.31
Nodes (10): catLabel(), findActivePromo(), formatDate(), pad2(), saleUnits(), shortDate(), Sale, History() (+2 more)

### Community 28 - "sync.test.ts"
Cohesion: 0.16
Nodes (14): costFor(), costTotal(), findCostId(), makeDraft(), profitTotal(), sortByOrder(), Ctx, addProduct() (+6 more)

### Community 29 - "Events.tsx"
Cohesion: 0.33
Nodes (8): activeEvent(), StoreEvent, blankEvent(), Events(), finalize(), openAdding(), patch(), today()

### Community 30 - "testUtils.tsx"
Cohesion: 0.31
Nodes (8): AppCtx, ModalKind, renderLanding(), setup(), makeProduct(), makeState(), makeStore(), TestProvider()

### Community 31 - "SaleRegistration"
Cohesion: 0.26
Nodes (9): SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine(), setManualPrice() (+1 more)

### Community 32 - "saleUnitPrice"
Cohesion: 0.60
Nodes (5): fixedPackageTotal(), promoPrice(), promoUnitReward(), round2(), saleUnitPrice()

### Community 33 - "Employees.tsx"
Cohesion: 0.38
Nodes (6): itemLabel(), Member, Role, EmpAcc, Employees(), roleLabel()

## Knowledge Gaps
- **122 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 161 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `Employees.tsx`, `Notes.tsx`, `account.ts`, `react-app/package.json`, `ui.tsx`, `appVersion.ts`, `theme.ts`, `StoreModal.tsx`, `pushOverlay`, `store.tsx`, `History.tsx`, `Events.tsx`, `testUtils.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `Employees.tsx`, `Notes.tsx`, `account.ts`, `App`, `ui.tsx`, `StoreModal.tsx`, `Dashboard.tsx`, `store.tsx`, `History.tsx`, `Events.tsx`, `SaleRegistration`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `Notes.tsx`, `useStore`, `ui.tsx`, `History.tsx`, `Events.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10227936879018118 - nodes in this community are weakly interconnected._
- **Should `Notes.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08878968253968254 - nodes in this community are weakly interconnected._
- **Should `account.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11215686274509803 - nodes in this community are weakly interconnected._