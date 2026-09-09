# Graph Report - repo-local  (2026-09-09)

## Corpus Check
- 47 files · ~80,956 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 524 nodes · 1563 edges · 20 communities (15 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2b67a115`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- syncName
- App.tsx
- react-app/package.json
- customConfirm
- SaleRegistration
- compilerOptions
- core.ts
- vite-env.d.ts
- public/sw.js
- sw.js
- Mi Tiendita
- AGENTS.md
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- store.tsx
- sync.test.ts
- Notes.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 39 edges
2. `useStore()` - 35 edges
3. `syncName()` - 33 edges
4. `uid()` - 28 edges
5. `esc()` - 26 edges
6. `Notes()` - 26 edges
7. `SaleRegistration()` - 24 edges
8. `react` - 22 edges
9. `Inventory()` - 21 edges
10. `applyRemote()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `emit()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/dialog.ts → react-app/src/lib/appVersion.ts
- `subscribeDialog()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/dialog.ts → react-app/src/lib/appVersion.ts
- `emit()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/lightbox.ts → react-app/src/lib/appVersion.ts
- `subscribeLightbox()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/lightbox.ts → react-app/src/lib/appVersion.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (20 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (76): clearDeletedNotes(), compressImage(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey(), getDeletedNoteIds(), isNoteDeleted(), isStoreOwner() (+68 more)

### Community 2 - "syncName"
Cohesion: 0.16
Nodes (29): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), fromEditablePromos(), normalizePromo(), syncName() (+21 more)

### Community 3 - "App.tsx"
Cohesion: 0.06
Nodes (71): App(), selectStore(), setMenu(), Dropdown(), DropdownItem, CategoryGroup, DEFAULT_PRODUCT_IMAGE, EditablePromo (+63 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (36): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+28 more)

### Community 5 - "customConfirm"
Cohesion: 0.22
Nodes (12): activeEvent(), customConfirm(), StoreEvent, removeCategory(), removeProduct(), blankEvent(), Events(), finalize() (+4 more)

### Community 6 - "SaleRegistration"
Cohesion: 0.24
Nodes (10): catLabel(), SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine() (+2 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "core.ts"
Cohesion: 0.09
Nodes (40): addChecklistItem(), canDeleteNote(), canEditNote(), canManageNotes(), canManageTeam(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds (+32 more)

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

### Community 19 - "store.tsx"
Cohesion: 0.06
Nodes (63): askSwVersion(), current(), save(), useAppVersion(), APP_VERSION, InvLogRow, NOTE_TTL_MS, saveState() (+55 more)

### Community 20 - "sync.test.ts"
Cohesion: 0.11
Nodes (23): CLIENT_KEY, costFor(), costTotal(), DEFAULT_PRODUCT_TAG, loadState(), makeDraft(), migrateNoteLogToBoard(), normalizeStore() (+15 more)

### Community 21 - "Notes.tsx"
Cohesion: 0.08
Nodes (38): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+30 more)

## Knowledge Gaps
- **96 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+91 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 123 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `sync.ts`, `react-app/package.json`, `customConfirm`, `store.tsx`, `sync.test.ts`, `Notes.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `syncName`, `App.tsx`, `customConfirm`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0695970695970696 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.061156235069278544 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05547652916073969 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._