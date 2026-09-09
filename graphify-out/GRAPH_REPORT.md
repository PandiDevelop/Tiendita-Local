# Graph Report - Mi Tiendita  (2026-09-08)

## Corpus Check
- 36 files · ~74,943 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 363 nodes · 1028 edges · 16 communities (11 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `12df02a1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- ui.tsx
- App.tsx
- package.json
- Inventory
- useStore
- compilerOptions
- SaleRegistration
- vite-env.d.ts
- store.tsx
- Mi Tiendita
- AGENTS.md
- core.ts

## God Nodes (most connected - your core abstractions)
1. `useStore()` - 29 edges
2. `SaleRegistration()` - 24 edges
3. `uid()` - 23 edges
4. `esc()` - 22 edges
5. `syncClientId()` - 21 edges
6. `Inventory()` - 20 edges
7. `react` - 19 edges
8. `syncName()` - 19 edges
9. `joinStore()` - 19 edges
10. `Catalog()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `App()` --calls--> `useStore()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/store.tsx
- `Inventory()` --calls--> `shortTag()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `SaleRegistration()` --calls--> `shortTag()`  [EXTRACTED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.09
Nodes (57): compressImage(), DEFAULT_STORE_IMAGE, isStoreOwner(), mergeInvLog(), mergeItems(), mergeNoteLog(), myRole(), syncClientId() (+49 more)

### Community 2 - "ui.tsx"
Cohesion: 0.12
Nodes (24): customConfirm(), DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog() (+16 more)

### Community 3 - "App.tsx"
Cohesion: 0.11
Nodes (33): App(), selectStore(), setMenu(), APP_VERSION, canManageTeam(), catLabel(), costFor(), costTotal() (+25 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (38): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+30 more)

### Community 5 - "Inventory"
Cohesion: 0.31
Nodes (11): Inventory(), bump(), catKey(), catOpen(), cur(), openCargo(), openEdit(), saveCargo() (+3 more)

### Community 6 - "useStore"
Cohesion: 0.10
Nodes (38): Dropdown(), DropdownItem, CategoryGroup, DEFAULT_PRODUCT_IMAGE, EditablePromo, fromEditablePromos(), groupedByCategory(), insertCatSorted() (+30 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "SaleRegistration"
Cohesion: 0.21
Nodes (11): findActivePromo(), SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), register(), removeLine() (+3 more)

### Community 12 - "store.tsx"
Cohesion: 0.10
Nodes (30): addNote(), adoptInvLog(), CLIENT_KEY, DEFAULT_PRODUCT_TAG, loadState(), makeDraft(), normalizePromo(), normalizeStore() (+22 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "core.ts"
Cohesion: 0.09
Nodes (33): activeEvent(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, fixedPackageTotal(), formatDate(), InvLogRow, itemLabel(), KEY (+25 more)

## Knowledge Gaps
- **77 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 103 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `sync.ts`, `ui.tsx`, `App.tsx`, `package.json`, `store.tsx`, `core.ts`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `sync.ts`, `App.tsx`, `useStore`, `core.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09435028248587571 - nodes in this community are weakly interconnected._
- **Should `ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11965811965811966 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1073170731707317 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._