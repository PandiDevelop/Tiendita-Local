# Graph Report - repo-local  (2026-09-10)

## Corpus Check
- 50 files · ~86,732 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 568 nodes · 1722 edges · 19 communities (14 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ec6597cc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- sync.test.ts
- ProductForm.tsx
- react-app/package.json
- Inventory.tsx
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
- core.ts
- ui.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 29 edges
5. `esc()` - 28 edges
6. `Notes()` - 26 edges
7. `SaleRegistration()` - 25 edges
8. `react` - 22 edges
9. `Inventory()` - 22 edges
10. `AppProvider()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `saveName()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/SettingsModal.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts
- `App()` --calls--> `esc()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/core.ts
- `App()` --calls--> `useStore()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/store.tsx

## Import Cycles
- None detected.

## Communities (19 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (85): clearDeletedNotes(), deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted(), isStoreOwner() (+77 more)

### Community 2 - "sync.test.ts"
Cohesion: 0.11
Nodes (26): CLIENT_KEY, costTotal(), DEFAULT_PRODUCT_TAG, makeDraft(), migrateNoteLogToBoard(), normalizePromo(), normalizeStore(), sortByOrder() (+18 more)

### Community 3 - "ProductForm.tsx"
Cohesion: 0.14
Nodes (21): compressImage(), EditablePromo, fromEditablePromos(), insertCatSorted(), numText(), setCategoryPricing(), storeCats(), toEditablePromos() (+13 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "Inventory.tsx"
Cohesion: 0.06
Nodes (56): Dropdown(), DropdownItem, adoptInvLog(), DEFAULT_PRODUCT_IMAGE, groupedByCategory(), inventorySold(), productTags(), promoText() (+48 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.09
Nodes (48): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), canDeleteNote(), canEditNote(), deleteNoteMsg() (+40 more)

### Community 12 - "store.tsx"
Cohesion: 0.08
Nodes (50): canManageNotes(), DeletedStoreRecord, loadState(), NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert() (+42 more)

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

### Community 19 - "core.ts"
Cohesion: 0.07
Nodes (70): activeEvent(), CategoryGroup, catLabel(), costFor(), DEFAULT_PROD_SVG, DEFAULT_STORE_IMAGE, DEFAULT_STORE_SVG, deletedNoteIds (+62 more)

### Community 21 - "ui.tsx"
Cohesion: 0.07
Nodes (44): App(), selectStore(), setMenu(), askSwVersion(), current(), save(), useAppVersion(), ENTRY (+36 more)

## Knowledge Gaps
- **101 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+96 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 130 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inventory.tsx` to `sync.ts`, `sync.test.ts`, `ProductForm.tsx`, `react-app/package.json`, `Notes.tsx`, `store.tsx`, `core.ts`, `ui.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `Inventory.tsx` to `Notes.tsx`, `core.ts`, `ui.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _101 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06739811912225706 - nodes in this community are weakly interconnected._
- **Should `sync.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10695187165775401 - nodes in this community are weakly interconnected._
- **Should `ProductForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._