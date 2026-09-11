# Graph Report - repo-local  (2026-09-11)

## Corpus Check
- 52 files · ~138,735 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 598 nodes · 1795 edges · 25 communities (18 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f8c056d4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- store.tsx
- SettingsModal.tsx
- react-app/package.json
- App
- GearMenu
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- Mi Tiendita
- AGENTS.md
- useStore
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- ui.tsx
- preload.ts
- lightbox.ts
- core.ts
- pushOverlay
- StoreModal.tsx
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
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `App()` --calls--> `useAppVersion()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/appVersion.ts

## Import Cycles
- None detected.

## Communities (25 total, 6 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.08
Nodes (71): clearDeletedNotes(), deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted(), markNoteDeleted() (+63 more)

### Community 2 - "store.tsx"
Cohesion: 0.08
Nodes (33): CLIENT_KEY, costTotal(), DEFAULT_PRODUCT_TAG, loadState(), makeDraft(), NOTE_TTL_MS, saveState(), sortByOrder() (+25 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.07
Nodes (45): askSwVersion(), useAppVersion(), APP_VERSION, DeletedStoreRecord, archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt() (+37 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "App"
Cohesion: 0.23
Nodes (9): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+1 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.09
Nodes (52): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+44 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "useStore"
Cohesion: 0.06
Nodes (67): Dropdown(), DropdownItem, activeEvent(), catLabel(), costFor(), DEFAULT_PRODUCT_IMAGE, esc(), findActivePromo() (+59 more)

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
Cohesion: 0.09
Nodes (26): TAB_ICONS, BellIcon(), BoxIcon(), CalendarIcon(), CartIcon(), CashIcon(), CatalogIcon(), CategorySuggest() (+18 more)

### Community 21 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 22 - "core.ts"
Cohesion: 0.05
Nodes (69): canManageTeam(), CategoryGroup, DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, EditablePromo, fixedPackageTotal(), fromEditablePromos() (+61 more)

### Community 23 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 24 - "StoreModal.tsx"
Cohesion: 0.11
Nodes (27): compressImage(), DEFAULT_STORE_IMAGE, syncGenPin(), syncSetName(), clearSeenNoteIds(), detach(), deactivateSyncFn(), removeMemberFn() (+19 more)

### Community 28 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

## Knowledge Gaps
- **107 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+102 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 140 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `store.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `Notes.tsx`, `ui.tsx`, `core.ts`, `StoreModal.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `useStore` to `Notes.tsx`, `ui.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _107 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08028919330289193 - nodes in this community are weakly interconnected._
- **Should `store.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07973421926910298 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07337526205450734 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._