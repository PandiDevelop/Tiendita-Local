# Graph Report - repo-local  (2026-09-10)

## Corpus Check
- 50 files · ~84,819 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 563 nodes · 1706 edges · 19 communities (14 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b2df8355`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- StoreModal.tsx
- core.ts
- react-app/package.json
- useStore
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- store.tsx
- Mi Tiendita
- AGENTS.md
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- sync.test.ts
- ui.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 29 edges
5. `esc()` - 28 edges
6. `Notes()` - 27 edges
7. `SaleRegistration()` - 25 edges
8. `react` - 22 edges
9. `Inventory()` - 22 edges
10. `AppProvider()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `saveName()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/SettingsModal.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (19 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.11
Nodes (50): clearDeletedNotes(), deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted(), markNoteDeleted() (+42 more)

### Community 2 - "StoreModal.tsx"
Cohesion: 0.10
Nodes (31): compressImage(), DEFAULT_STORE_IMAGE, rememberDeletedStore(), syncGenPin(), syncSetName(), customConfirm(), clearSeenNoteIds(), detach() (+23 more)

### Community 3 - "core.ts"
Cohesion: 0.07
Nodes (49): activeEvent(), CategoryGroup, DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, DeletedStoreRecord, fixedPackageTotal(), formatDate() (+41 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (38): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+30 more)

### Community 5 - "useStore"
Cohesion: 0.06
Nodes (75): Dropdown(), DropdownItem, catLabel(), DEFAULT_PRODUCT_IMAGE, EditablePromo, esc(), findActivePromo(), fromEditablePromos() (+67 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.08
Nodes (59): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+51 more)

### Community 12 - "store.tsx"
Cohesion: 0.07
Nodes (57): loadState(), NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveUpsert(), exportArchiveCsv(), loadArchive(), noteArchiveText() (+49 more)

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

### Community 19 - "sync.test.ts"
Cohesion: 0.10
Nodes (24): CLIENT_KEY, costFor(), costTotal(), DEFAULT_PRODUCT_TAG, makeDraft(), profitTotal(), sortByOrder(), AppCtx (+16 more)

### Community 21 - "ui.tsx"
Cohesion: 0.06
Nodes (49): App(), selectStore(), setMenu(), askSwVersion(), current(), save(), useAppVersion(), ENTRY (+41 more)

## Knowledge Gaps
- **101 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+96 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 130 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `StoreModal.tsx`, `core.ts`, `react-app/package.json`, `Notes.tsx`, `store.tsx`, `sync.test.ts`, `ui.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `useStore` to `Notes.tsx`, `core.ts`, `ui.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _101 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11137254901960784 - nodes in this community are weakly interconnected._
- **Should `StoreModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10483870967741936 - nodes in this community are weakly interconnected._
- **Should `core.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06801346801346801 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._