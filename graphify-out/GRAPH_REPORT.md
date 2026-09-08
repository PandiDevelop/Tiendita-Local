# Graph Report - Mi Tiendita  (2026-09-08)

## Corpus Check
- 31 files · ~24,430 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 303 nodes · 842 edges · 15 communities (11 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d788741d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- store.tsx
- ui.tsx
- App.tsx
- package.json
- core.ts
- Inventory
- compilerOptions
- SaleRegistration.tsx
- vite-env.d.ts
- StoreModal.tsx
- Mi Tiendita
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `useStore()` - 27 edges
2. `esc()` - 20 edges
3. `syncClientId()` - 20 edges
4. `uid()` - 18 edges
5. `syncName()` - 18 edges
6. `joinStore()` - 18 edges
7. `Inventory()` - 18 edges
8. `react` - 17 edges
9. `StoreModal()` - 17 edges
10. `Catalog()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `deactivate()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/StoreModal.tsx → react-app/src/lib/sync.ts
- `del()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/StoreModal.tsx → react-app/src/lib/sync.ts

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.18
Nodes (29): mergeInvLog(), mergeItems(), mergeNoteLog(), normalizeStore(), syncKeyOf(), toInvLogArr(), toNoteLogArr(), toProductsArr() (+21 more)

### Community 1 - "store.tsx"
Cohesion: 0.09
Nodes (28): costFor(), costTotal(), itemLabel(), loadState(), makeDraft(), profitTotal(), saveState(), SyncHandle (+20 more)

### Community 2 - "ui.tsx"
Cohesion: 0.15
Nodes (20): customConfirm(), DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog() (+12 more)

### Community 3 - "App.tsx"
Cohesion: 0.13
Nodes (37): App(), selectStore(), setMenu(), addNote(), canManageTeam(), esc(), formatDate(), money() (+29 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (28): dependencies, firebase, react, react-dom, devDependencies, @types/react, @types/react-dom, typescript (+20 more)

### Community 5 - "core.ts"
Cohesion: 0.10
Nodes (38): adoptInvLog(), APP_VERSION, CategoryGroup, CLIENT_KEY, DEFAULT_PROD_SVG, DEFAULT_PRODUCT_IMAGE, DEFAULT_PRODUCT_TAG, DEFAULT_STORE_SVG (+30 more)

### Community 6 - "Inventory"
Cohesion: 0.31
Nodes (11): Inventory(), bump(), catKey(), catOpen(), cur(), openCargo(), openEdit(), saveCargo() (+3 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "SaleRegistration.tsx"
Cohesion: 0.19
Nodes (12): Dropdown(), DropdownItem, catLabel(), saleCatsOf(), sortByOrder(), Line, SaleRegistration(), addLine() (+4 more)

### Community 12 - "StoreModal.tsx"
Cohesion: 0.14
Nodes (26): compressImage(), DEFAULT_STORE_IMAGE, isStoreOwner(), myRole(), syncClientId(), syncGenPin(), syncSetName(), detach() (+18 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

## Knowledge Gaps
- **72 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 88 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `store.tsx`, `ui.tsx`, `package.json`, `core.ts`, `SaleRegistration.tsx`, `StoreModal.tsx`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration.tsx` to `App.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `Catalog()` connect `core.ts` to `App.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `store.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08907563025210084 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12626262626262627 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._