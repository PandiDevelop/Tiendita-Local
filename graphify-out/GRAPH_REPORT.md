# Graph Report - Mi Tiendita  (2026-09-08)

## Corpus Check
- 36 files · ~73,395 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 358 nodes · 1008 edges · 15 communities (10 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `974da82f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- ui.tsx
- useStore
- package.json
- Inventory.tsx
- App.tsx
- compilerOptions
- SaleRegistration.tsx
- vite-env.d.ts
- core.ts
- Mi Tiendita
- AGENTS.md

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
10. `Catalog()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `App()` --calls--> `canManageTeam()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/core.ts
- `App()` --calls--> `esc()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/core.ts
- `App()` --calls--> `useStore()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/store.tsx
- `SaleRegistration()` --calls--> `shortTag()`  [EXTRACTED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.10
Nodes (52): DEFAULT_STORE_IMAGE, mergeInvLog(), mergeItems(), mergeNoteLog(), syncClientId(), syncGenPin(), syncKeyOf(), syncSetName() (+44 more)

### Community 2 - "ui.tsx"
Cohesion: 0.10
Nodes (29): activeEvent(), customConfirm(), DialogKind, DialogRequest, emit(), Listener, listeners, open() (+21 more)

### Community 3 - "useStore"
Cohesion: 0.17
Nodes (29): costFor(), esc(), formatDate(), itemLabel(), money(), priceFor(), profitTotal(), saleUnits() (+21 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (38): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+30 more)

### Community 5 - "Inventory.tsx"
Cohesion: 0.08
Nodes (43): adoptInvLog(), compressImage(), DEFAULT_PRODUCT_IMAGE, EditablePromo, fromEditablePromos(), groupedByCategory(), insertCatSorted(), inventorySold() (+35 more)

### Community 6 - "App.tsx"
Cohesion: 0.16
Nodes (17): App(), selectStore(), setMenu(), addNote(), loadState(), saveState(), shortDate(), syncName() (+9 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "SaleRegistration.tsx"
Cohesion: 0.14
Nodes (17): Dropdown(), DropdownItem, catLabel(), saleCatsOf(), sortByOrder(), sortProducts(), Line, SaleRegistration() (+9 more)

### Community 12 - "core.ts"
Cohesion: 0.07
Nodes (47): APP_VERSION, canManageTeam(), CategoryGroup, CLIENT_KEY, costTotal(), DEFAULT_PROD_SVG, DEFAULT_PRODUCT_TAG, DEFAULT_STORE_SVG (+39 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

## Knowledge Gaps
- **77 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 101 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `sync.ts`, `ui.tsx`, `useStore`, `package.json`, `Inventory.tsx`, `SaleRegistration.tsx`, `core.ts`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration.tsx` to `ui.tsx`, `useStore`, `Inventory.tsx`, `App.tsx`, `core.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10482180293501048 - nodes in this community are weakly interconnected._
- **Should `ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09803921568627451 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._
- **Should `Inventory.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0841799709724238 - nodes in this community are weakly interconnected._