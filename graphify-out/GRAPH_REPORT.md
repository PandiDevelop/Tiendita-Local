# Graph Report - Mi Tiendita  (2026-09-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 282 nodes · 796 edges · 12 communities (9 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `11f5f6da`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- core.ts
- App.tsx
- useStore
- package.json
- Catalog.tsx
- Inventory.tsx
- compilerOptions
- SaleRegistration
- vite-env.d.ts

## God Nodes (most connected - your core abstractions)
1. `useStore()` - 25 edges
2. `esc()` - 20 edges
3. `joinStore()` - 19 edges
4. `syncClientId()` - 18 edges
5. `uid()` - 18 edges
6. `syncName()` - 18 edges
7. `StoreModal()` - 17 edges
8. `SaleRegistration()` - 16 edges
9. `react` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts
- `QtyPopup` --references--> `Product`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/types.ts
- `Notes()` --calls--> `syncClientId()`  [EXTRACTED]
  react-app/src/views/Notes.tsx → react-app/src/lib/core.ts
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (12 total, 1 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.09
Nodes (55): DEFAULT_STORE_IMAGE, isStoreOwner(), mergeInvLog(), mergeItems(), mergeNoteLog(), myRole(), syncClientId(), syncGenPin() (+47 more)

### Community 1 - "core.ts"
Cohesion: 0.09
Nodes (33): APP_VERSION, CategoryGroup, CLIENT_KEY, costTotal(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, InvLogRow, KEY (+25 more)

### Community 2 - "App.tsx"
Cohesion: 0.11
Nodes (28): App(), selectStore(), setMenu(), Dropdown(), DropdownItem, canManageTeam(), DialogKind, DialogRequest (+20 more)

### Community 3 - "useStore"
Cohesion: 0.17
Nodes (28): costFor(), esc(), formatDate(), itemLabel(), money(), priceFor(), profitTotal(), saleUnits() (+20 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (28): dependencies, firebase, react, react-dom, devDependencies, @types/react, @types/react-dom, typescript (+20 more)

### Community 5 - "Catalog.tsx"
Cohesion: 0.15
Nodes (21): compressImage(), DEFAULT_PRODUCT_IMAGE, EditablePromo, fromEditablePromos(), reorderCategoryProducts(), setCategoryPricing(), storeCats(), toEditablePromos() (+13 more)

### Community 6 - "Inventory.tsx"
Cohesion: 0.16
Nodes (21): addNote(), adoptInvLog(), groupedByCategory(), inventorySold(), shortDate(), syncName(), timeNow(), NoteEntry (+13 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "SaleRegistration"
Cohesion: 0.23
Nodes (10): catLabel(), saleCatsOf(), sortByOrder(), SaleRegistration(), addLine(), persist(), register(), removeLine() (+2 more)

## Knowledge Gaps
- **61 isolated node(s):** `FIREBASE_CONFIG`, `ModalKind`, `DropdownItem`, `DialogKind`, `Listener` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 74 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `sync.ts`, `core.ts`, `useStore`, `package.json`, `Catalog.tsx`, `Inventory.tsx`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `App.tsx`, `useStore`, `Inventory.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `FIREBASE_CONFIG`, `ModalKind`, `DropdownItem` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09437386569872959 - nodes in this community are weakly interconnected._
- **Should `core.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08710801393728224 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10952380952380952 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._