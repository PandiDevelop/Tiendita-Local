# Graph Report - Mi Tiendita  (2026-09-08)

## Corpus Check
- 36 files · ~73,839 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 358 nodes · 1007 edges · 16 communities (11 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `08f65ad5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- ui.tsx
- App.tsx
- package.json
- Inventory.tsx
- SaleRegistration.tsx
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
10. `Catalog()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `SaleRegistration()` --calls--> `shortTag()`  [EXTRACTED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `register()` --calls--> `today()`  [EXTRACTED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `Catalog()` --calls--> `money()`  [EXTRACTED]
  react-app/src/views/Catalog.tsx → react-app/src/lib/core.ts
- `SaleRegistration()` --calls--> `money()`  [EXTRACTED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.10
Nodes (56): DEFAULT_STORE_IMAGE, isStoreOwner(), mergeInvLog(), mergeItems(), mergeNoteLog(), myRole(), syncClientId(), syncGenPin() (+48 more)

### Community 2 - "ui.tsx"
Cohesion: 0.14
Nodes (22): customConfirm(), DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog() (+14 more)

### Community 3 - "App.tsx"
Cohesion: 0.12
Nodes (38): App(), selectStore(), setMenu(), addNote(), canManageTeam(), esc(), formatDate(), itemLabel() (+30 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (38): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+30 more)

### Community 5 - "Inventory.tsx"
Cohesion: 0.12
Nodes (27): adoptInvLog(), CategoryGroup, groupedByCategory(), inventorySold(), promoText(), reorderCategoryProducts(), shortTag(), Product (+19 more)

### Community 6 - "SaleRegistration.tsx"
Cohesion: 0.12
Nodes (26): Dropdown(), DropdownItem, compressImage(), DEFAULT_PRODUCT_IMAGE, EditablePromo, fromEditablePromos(), insertCatSorted(), normalizePromo() (+18 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "SaleRegistration"
Cohesion: 0.20
Nodes (12): catLabel(), findActivePromo(), SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), register() (+4 more)

### Community 12 - "store.tsx"
Cohesion: 0.11
Nodes (28): CLIENT_KEY, costFor(), costTotal(), DEFAULT_PRODUCT_TAG, loadState(), makeDraft(), normalizeStore(), profitTotal() (+20 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "core.ts"
Cohesion: 0.11
Nodes (25): activeEvent(), APP_VERSION, DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, InvLogRow, KEY, promoPrice(), promoUnitReward() (+17 more)

## Knowledge Gaps
- **77 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 101 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SaleRegistration.tsx` to `sync.ts`, `ui.tsx`, `App.tsx`, `package.json`, `Inventory.tsx`, `store.tsx`, `core.ts`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `sync.ts`, `App.tsx`, `Inventory.tsx`, `SaleRegistration.tsx`, `core.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09701928696668614 - nodes in this community are weakly interconnected._
- **Should `ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13666666666666666 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1178743961352657 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._