# Graph Report - repo-local  (2026-09-09)

## Corpus Check
- 46 files · ~78,397 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 519 nodes · 1524 edges · 21 communities (16 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5cd3bc33`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- StoreModal.tsx
- types.ts
- react-app/package.json
- Inventory.tsx
- SaleRegistration
- compilerOptions
- core.ts
- vite-env.d.ts
- public/sw.js
- sw.js
- syncClientId
- Mi Tiendita
- AGENTS.md
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- SettingsModal.tsx
- store.tsx
- Notes.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 39 edges
2. `syncName()` - 33 edges
3. `useStore()` - 33 edges
4. `uid()` - 27 edges
5. `Notes()` - 25 edges
6. `esc()` - 24 edges
7. `SaleRegistration()` - 24 edges
8. `react` - 21 edges
9. `Inventory()` - 21 edges
10. `applyRemote()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `doToggleItem()` --calls--> `toggleChecklistItem()`  [EXTRACTED]
  react-app/src/views/Notes.tsx → react-app/src/lib/core.ts
- `App()` --calls--> `canManageTeam()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (21 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.12
Nodes (42): clearDeletedNotes(), deletedNoteIdsOf(), deletedNotesKey(), getDeletedNoteIds(), isNoteDeleted(), markNoteDeleted(), mergeInvLog(), mergeItems() (+34 more)

### Community 2 - "StoreModal.tsx"
Cohesion: 0.12
Nodes (28): compressImage(), DEFAULT_STORE_IMAGE, syncGenPin(), syncSetName(), clearSeenNoteIds(), detach(), deactivateSyncFn(), deleteStoreFn() (+20 more)

### Community 3 - "types.ts"
Cohesion: 0.09
Nodes (47): activeEvent(), catLabel(), esc(), findActivePromo(), formatDate(), itemLabel(), money(), priceFor() (+39 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "Inventory.tsx"
Cohesion: 0.08
Nodes (46): CategoryGroup, DEFAULT_PRODUCT_IMAGE, EditablePromo, fromEditablePromos(), groupedByCategory(), insertCatSorted(), inventorySold(), normalizePromo() (+38 more)

### Community 6 - "SaleRegistration"
Cohesion: 0.23
Nodes (10): saleCatsOf(), SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine() (+2 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "core.ts"
Cohesion: 0.08
Nodes (46): addChecklistItem(), canDeleteNote(), canEditNote(), canManageNotes(), canManageTeam(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds (+38 more)

### Community 12 - "syncClientId"
Cohesion: 0.12
Nodes (31): Dropdown(), DropdownItem, addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), costFor() (+23 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "SettingsModal.tsx"
Cohesion: 0.19
Nodes (22): disablePushForStore(), enablePushForStore(), getMessagingInstance(), PUSH_WORKER_URL, pushConfigured(), VAPID_PUBLIC_KEY, notifCatEnabled(), notifCats() (+14 more)

### Community 20 - "store.tsx"
Cohesion: 0.08
Nodes (39): CLIENT_KEY, DEFAULT_PRODUCT_TAG, loadState(), makeDraft(), saveState(), archiveMarkGone(), archiveUpsert(), exportArchiveCsv() (+31 more)

### Community 21 - "Notes.tsx"
Cohesion: 0.07
Nodes (46): App(), selectStore(), setMenu(), askSwVersion(), current(), save(), useAppVersion(), APP_VERSION (+38 more)

## Knowledge Gaps
- **96 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+91 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 123 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `store.tsx` to `StoreModal.tsx`, `types.ts`, `react-app/package.json`, `Inventory.tsx`, `syncClientId`, `SettingsModal.tsx`, `Notes.tsx`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `types.ts`, `Inventory.tsx`, `core.ts`, `syncClientId`, `Notes.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12181616832779624 - nodes in this community are weakly interconnected._
- **Should `StoreModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11822660098522167 - nodes in this community are weakly interconnected._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08874912648497554 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._