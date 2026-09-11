# Graph Report - repo-local  (2026-09-11)

## Corpus Check
- 53 files · ~316,917 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 613 nodes · 1840 edges · 30 communities (25 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ff4fccb7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- sync.test.ts
- SettingsModal.tsx
- react-app/package.json
- App
- theme.ts
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
- ui.tsx
- store.tsx
- Inventory.tsx
- pushOverlay
- StoreModal.tsx
- Dashboard.tsx
- Profit.tsx
- History.tsx
- dialog.ts
- Employees.tsx

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
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `restoreOne()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/SettingsModal.tsx → react-app/src/lib/sync.ts
- `App()` --calls--> `useAppVersion()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/appVersion.ts

## Import Cycles
- None detected.

## Communities (30 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.10
Nodes (54): clearDeletedNotes(), costEntryKey(), dedupeCosts(), deletedNoteIdsOf(), deletedNotesKey(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted() (+46 more)

### Community 2 - "sync.test.ts"
Cohesion: 0.22
Nodes (6): findCostId(), sortByOrder(), addProduct(), apply(), makePayload(), CostEntry

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.07
Nodes (57): askSwVersion(), useAppVersion(), APP_VERSION, canManageNotes(), DeletedStoreRecord, deletedStores(), saveState(), BeforeInstallPromptEvent (+49 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (38): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+30 more)

### Community 5 - "App"
Cohesion: 0.23
Nodes (9): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+1 more)

### Community 6 - "theme.ts"
Cohesion: 0.18
Nodes (14): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themePref, THEMES (+6 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.10
Nodes (45): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), canDeleteNote(), canEditNote(), deleteNoteMsg() (+37 more)

### Community 12 - "SaleRegistration"
Cohesion: 0.16
Nodes (16): catLabel(), fixedPackageTotal(), promoPrice(), promoUnitReward(), round2(), saleUnitPrice(), exportTxt(), SaleRegistration() (+8 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "core.ts"
Cohesion: 0.11
Nodes (22): CategoryGroup, CLIENT_KEY, DEFAULT_PROD_SVG, DEFAULT_PRODUCT_TAG, DEFAULT_STORE_SVG, deletedNoteIds, InvLogRow, KEY (+14 more)

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

### Community 20 - "ui.tsx"
Cohesion: 0.09
Nodes (27): DEV_LOGO, TAB_ICONS, ASSETS, preloadDevAssets(), BellIcon(), BoxIcon(), CalendarIcon(), CargoIcon() (+19 more)

### Community 21 - "store.tsx"
Cohesion: 0.18
Nodes (17): loadState(), makeDraft(), NOTE_TTL_MS, AppCtx, Ctx, ModalKind, addTag(), setup() (+9 more)

### Community 22 - "Inventory.tsx"
Cohesion: 0.07
Nodes (66): Dropdown(), DropdownItem, adoptInvLog(), DEFAULT_PRODUCT_IMAGE, EditablePromo, ensureCost(), esc(), fromEditablePromos() (+58 more)

### Community 23 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 24 - "StoreModal.tsx"
Cohesion: 0.07
Nodes (44): activeEvent(), canManageTeam(), compressImage(), DEFAULT_STORE_IMAGE, isStoreOwner(), myRole(), rememberDeletedStore(), syncGenPin() (+36 more)

### Community 25 - "Dashboard.tsx"
Cohesion: 0.25
Nodes (10): SaleItem, CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel(), monthLines() (+2 more)

### Community 26 - "Profit.tsx"
Cohesion: 0.29
Nodes (10): costFor(), costTotal(), priceFor(), profitTotal(), Sale, PLine, Profit(), profitLines() (+2 more)

### Community 27 - "History.tsx"
Cohesion: 0.33
Nodes (9): findActivePromo(), formatDate(), pad2(), saleUnits(), shortDate(), total(), DownloadIcon(), History() (+1 more)

### Community 28 - "dialog.ts"
Cohesion: 0.24
Nodes (10): customAlert(), DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog() (+2 more)

### Community 29 - "Employees.tsx"
Cohesion: 0.38
Nodes (6): itemLabel(), Member, Role, EmpAcc, Employees(), roleLabel()

## Knowledge Gaps
- **110 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+105 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 145 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inventory.tsx` to `SettingsModal.tsx`, `react-app/package.json`, `theme.ts`, `Notes.tsx`, `ui.tsx`, `store.tsx`, `StoreModal.tsx`, `Profit.tsx`, `History.tsx`, `Employees.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `Notes.tsx`, `ui.tsx`, `Inventory.tsx`, `StoreModal.tsx`, `History.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _110 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10168350168350168 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._