# Graph Report - repo-local  (2026-09-10)

## Corpus Check
- 52 files · ~138,760 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 599 nodes · 1796 edges · 26 communities (21 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `84a72a85`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- store.tsx
- SettingsModal.tsx
- react-app/package.json
- App
- SaleRegistration
- compilerOptions
- syncName
- vite-env.d.ts
- public/sw.js
- sw.js
- notesArchive.ts
- Mi Tiendita
- AGENTS.md
- core.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- ui.tsx
- App.tsx
- lightbox.ts
- Inventory.tsx
- pushOverlay
- Modal
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
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts
- `saveName()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/SettingsModal.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts

## Import Cycles
- None detected.

## Communities (26 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (82): clearDeletedNotes(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted() (+74 more)

### Community 2 - "store.tsx"
Cohesion: 0.09
Nodes (29): costTotal(), loadState(), makeDraft(), sortByOrder(), ctx(), notifyPermission(), playNoteChime(), showSystemNotification() (+21 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.08
Nodes (43): askSwVersion(), useAppVersion(), APP_VERSION, DeletedStoreRecord, disablePushForStore(), enablePushForStore(), ensurePushToken(), getMessagingInstance() (+35 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (36): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+28 more)

### Community 5 - "App"
Cohesion: 0.23
Nodes (9): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+1 more)

### Community 6 - "SaleRegistration"
Cohesion: 0.26
Nodes (9): SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine(), setManualPrice() (+1 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "syncName"
Cohesion: 0.10
Nodes (41): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), canDeleteNote(), canEditNote(), canManageNotes() (+33 more)

### Community 12 - "notesArchive.ts"
Cohesion: 0.22
Nodes (16): archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt(), loadArchive(), noteArchiveText() (+8 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "core.ts"
Cohesion: 0.06
Nodes (73): activeEvent(), CategoryGroup, catLabel(), CLIENT_KEY, costFor(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds (+65 more)

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
Cohesion: 0.13
Nodes (19): BellIcon(), CargoIcon(), CheckboxOutlineIcon(), ChecklistIcon(), CloseIcon(), confirmDialog(), GearMenu(), NoteTextIcon() (+11 more)

### Community 20 - "App.tsx"
Cohesion: 0.13
Nodes (13): DEV_LOGO, TAB_ICONS, ASSETS, preloadDevAssets(), CalendarIcon(), CatalogIcon(), ChartIcon(), GearIcon() (+5 more)

### Community 21 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 22 - "Inventory.tsx"
Cohesion: 0.06
Nodes (67): Dropdown(), DropdownItem, adoptInvLog(), compressImage(), DEFAULT_PRODUCT_IMAGE, DEFAULT_PRODUCT_TAG, EditablePromo, fromEditablePromos() (+59 more)

### Community 23 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 24 - "Modal"
Cohesion: 0.50
Nodes (3): Modal(), JoinModal(), submit()

### Community 28 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

## Knowledge Gaps
- **108 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 141 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inventory.tsx` to `sync.ts`, `store.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `core.ts`, `ui.tsx`, `App.tsx`, `Modal`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `syncName`, `App.tsx`, `Inventory.tsx`, `core.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07200229489386116 - nodes in this community are weakly interconnected._
- **Should `store.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09176788124156546 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07767722473604827 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05547652916073969 - nodes in this community are weakly interconnected._