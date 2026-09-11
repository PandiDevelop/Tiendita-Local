# Graph Report - repo-local  (2026-09-10)

## Corpus Check
- 52 files · ~92,859 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 582 nodes · 1750 edges · 29 communities (24 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f8f85ad4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- features.test.tsx
- store.tsx
- react-app/package.json
- DevThemes.tsx
- sync.test.ts
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- App
- Mi Tiendita
- AGENTS.md
- Dashboard.tsx
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- core.ts
- ui.tsx
- appVersion.ts
- useStore
- Employees.tsx
- App.tsx
- Profit.tsx
- dialog.ts
- pushOverlay
- customConfirm

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 29 edges
5. `esc()` - 28 edges
6. `Notes()` - 25 edges
7. `SaleRegistration()` - 25 edges
8. `react` - 23 edges
9. `Inventory()` - 22 edges
10. `AppProvider()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `emit()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/dialog.ts → react-app/src/lib/appVersion.ts
- `subscribeDialog()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/dialog.ts → react-app/src/lib/appVersion.ts
- `emit()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/lightbox.ts → react-app/src/lib/appVersion.ts
- `subscribeLightbox()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/lightbox.ts → react-app/src/lib/appVersion.ts
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (29 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.06
Nodes (86): clearDeletedNotes(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey(), forgetDeletedStore(), getDeletedNoteIds(), isStoreOwner(), markNoteDeleted() (+78 more)

### Community 2 - "features.test.tsx"
Cohesion: 0.14
Nodes (20): CLIENT_KEY, DEFAULT_PRODUCT_TAG, loadState(), makeDraft(), normalizeStore(), AppCtx, Ctx, ModalKind (+12 more)

### Community 3 - "store.tsx"
Cohesion: 0.11
Nodes (41): canManageNotes(), deletedStores(), saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt() (+33 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "DevThemes.tsx"
Cohesion: 0.20
Nodes (13): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), themePref, THEMES, DEV_THEMES (+5 more)

### Community 6 - "sync.test.ts"
Cohesion: 0.21
Nodes (9): costFor(), costTotal(), profitTotal(), sortByOrder(), addProduct(), apply(), makePayload(), Profit() (+1 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.08
Nodes (55): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+47 more)

### Community 12 - "App"
Cohesion: 0.21
Nodes (10): App(), selectStore(), setMenu(), canManageTeam(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+2 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "Dashboard.tsx"
Cohesion: 0.36
Nodes (9): priceFor(), total(), ChevronIcon(), Dashboard(), Line, monthLabel(), monthLines(), monthOf() (+1 more)

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
Nodes (28): CategoryGroup, DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, DeletedStoreRecord, fixedPackageTotal(), InvLogRow, isNoteDeleted() (+20 more)

### Community 20 - "ui.tsx"
Cohesion: 0.17
Nodes (14): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), CategorySuggest(), ImageLightboxHost() (+6 more)

### Community 21 - "appVersion.ts"
Cohesion: 0.53
Nodes (5): askSwVersion(), current(), save(), useAppVersion(), APP_VERSION

### Community 22 - "useStore"
Cohesion: 0.06
Nodes (67): Dropdown(), DropdownItem, catLabel(), compressImage(), DEFAULT_PRODUCT_IMAGE, EditablePromo, esc(), findActivePromo() (+59 more)

### Community 23 - "Employees.tsx"
Cohesion: 0.47
Nodes (5): itemLabel(), Member, EmpAcc, Employees(), roleLabel()

### Community 24 - "App.tsx"
Cohesion: 0.16
Nodes (10): DEV_LOGO, ASSETS, preloadDevAssets(), GearIcon(), Logo(), MenuIcon(), Modal(), StoreImage() (+2 more)

### Community 25 - "Profit.tsx"
Cohesion: 0.26
Nodes (10): formatDate(), pad2(), saleUnits(), shortDate(), Sale, DownloadIcon(), History(), PLine (+2 more)

### Community 26 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 27 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 28 - "customConfirm"
Cohesion: 0.22
Nodes (12): activeEvent(), customConfirm(), StoreEvent, removeCategory(), removeProduct(), blankEvent(), Events(), finalize() (+4 more)

## Knowledge Gaps
- **106 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+101 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 138 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `sync.ts`, `features.test.tsx`, `store.tsx`, `react-app/package.json`, `DevThemes.tsx`, `Notes.tsx`, `ui.tsx`, `appVersion.ts`, `Employees.tsx`, `App.tsx`, `Profit.tsx`, `customConfirm`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `useStore` to `App.tsx`, `Notes.tsx`, `customConfirm`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _106 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06460674157303371 - nodes in this community are weakly interconnected._
- **Should `features.test.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14130434782608695 - nodes in this community are weakly interconnected._
- **Should `store.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10823311748381129 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._