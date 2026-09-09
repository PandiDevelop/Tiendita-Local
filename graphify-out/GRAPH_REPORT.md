# Graph Report - Mi Tiendita  (2026-09-09)

## Corpus Check
- 42 files · ~91,953 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 486 nodes · 1369 edges · 19 communities (14 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4df20278`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- StoreModal.tsx
- Profit.tsx
- package.json
- useStore
- ui.tsx
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- core.ts
- Mi Tiendita
- AGENTS.md
- SaleRegistration
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 32 edges
2. `useStore()` - 31 edges
3. `syncName()` - 28 edges
4. `uid()` - 27 edges
5. `esc()` - 24 edges
6. `SaleRegistration()` - 24 edges
7. `Notes()` - 23 edges
8. `Inventory()` - 21 edges
9. `joinStore()` - 20 edges
10. `Catalog()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `App()` --calls--> `esc()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/core.ts
- `App()` --calls--> `useStore()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/store.tsx

## Import Cycles
- None detected.

## Communities (19 total, 2 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (64): loadState(), mergeInvLog(), mergeItems(), mergeNoteLog(), saveState(), syncKeyOf(), toInvLogArr(), toNoteBoardArr() (+56 more)

### Community 2 - "StoreModal.tsx"
Cohesion: 0.10
Nodes (33): App(), selectStore(), setMenu(), canManageTeam(), compressImage(), DEFAULT_STORE_IMAGE, isStoreOwner(), myRole() (+25 more)

### Community 3 - "Profit.tsx"
Cohesion: 0.13
Nodes (25): DEFAULT_PRODUCT_IMAGE, findActivePromo(), formatDate(), pad2(), priceFor(), saleUnits(), shortDate(), total() (+17 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "useStore"
Cohesion: 0.07
Nodes (52): CategoryGroup, EditablePromo, fromEditablePromos(), groupedByCategory(), insertCatSorted(), inventorySold(), money(), normalizePromo() (+44 more)

### Community 6 - "ui.tsx"
Cohesion: 0.08
Nodes (36): Dropdown(), DropdownItem, APP_VERSION, saleCatsOf(), DialogKind, DialogRequest, emit(), Listener (+28 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.10
Nodes (48): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+40 more)

### Community 12 - "core.ts"
Cohesion: 0.07
Nodes (50): CLIENT_KEY, costFor(), costTotal(), DEFAULT_PROD_SVG, DEFAULT_PRODUCT_TAG, DEFAULT_STORE_SVG, InvLogRow, itemLabel() (+42 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "SaleRegistration"
Cohesion: 0.11
Nodes (23): activeEvent(), catLabel(), fixedPackageTotal(), promoPrice(), promoUnitReward(), round2(), saleUnitPrice(), StoreEvent (+15 more)

### Community 16 - "index.js"
Cohesion: 0.40
Nodes (9): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readPushTokens() (+1 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

## Knowledge Gaps
- **91 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+86 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 118 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `sync.ts` to `StoreModal.tsx`, `Profit.tsx`, `package.json`, `useStore`, `ui.tsx`, `Notes.tsx`, `core.ts`, `SaleRegistration`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `Profit.tsx`, `useStore`, `ui.tsx`, `Notes.tsx`, `core.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _91 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07283702213279677 - nodes in this community are weakly interconnected._
- **Should `StoreModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0957983193277311 - nodes in this community are weakly interconnected._
- **Should `Profit.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1349206349206349 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._