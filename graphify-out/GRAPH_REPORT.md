# Graph Report - Mi Tiendita  (2026-09-08)

## Corpus Check
- 31 files · ~24,813 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 305 nodes · 844 edges · 14 communities (10 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aaa96fd3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- ui.tsx
- core.ts
- package.json
- Inventory.tsx
- ProductForm.tsx
- compilerOptions
- App.tsx
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
8. `SaleRegistration()` - 18 edges
9. `react` - 17 edges
10. `StoreModal()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `deactivate()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/StoreModal.tsx → react-app/src/lib/sync.ts
- `del()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/StoreModal.tsx → react-app/src/lib/sync.ts
- `leave()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/StoreModal.tsx → react-app/src/lib/sync.ts

## Import Cycles
- None detected.

## Communities (14 total, 2 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.10
Nodes (45): costTotal(), loadState(), makeDraft(), mergeInvLog(), mergeItems(), mergeNoteLog(), normalizeStore(), saveState() (+37 more)

### Community 2 - "ui.tsx"
Cohesion: 0.15
Nodes (20): customConfirm(), DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog() (+12 more)

### Community 3 - "core.ts"
Cohesion: 0.10
Nodes (44): APP_VERSION, CLIENT_KEY, costFor(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, esc(), formatDate(), InvLogRow (+36 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (28): dependencies, firebase, react, react-dom, devDependencies, @types/react, @types/react-dom, typescript (+20 more)

### Community 5 - "Inventory.tsx"
Cohesion: 0.13
Nodes (25): CategoryGroup, DEFAULT_PRODUCT_IMAGE, groupedByCategory(), inventorySold(), reorderCategoryProducts(), shortTag(), storeCats(), Product (+17 more)

### Community 6 - "ProductForm.tsx"
Cohesion: 0.22
Nodes (16): adoptInvLog(), compressImage(), DEFAULT_PRODUCT_TAG, EditablePromo, fromEditablePromos(), setCategoryPricing(), toEditablePromos(), uid() (+8 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "App.tsx"
Cohesion: 0.10
Nodes (28): App(), selectStore(), setMenu(), Dropdown(), DropdownItem, addNote(), canManageTeam(), catLabel() (+20 more)

### Community 12 - "StoreModal.tsx"
Cohesion: 0.16
Nodes (23): DEFAULT_STORE_IMAGE, isStoreOwner(), myRole(), syncClientId(), syncGenPin(), syncSetName(), detach(), deactivateSyncFn() (+15 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

## Knowledge Gaps
- **72 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 90 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `sync.ts`, `ui.tsx`, `core.ts`, `package.json`, `Inventory.tsx`, `ProductForm.tsx`, `StoreModal.tsx`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `App.tsx` to `core.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `Catalog()` connect `Inventory.tsx` to `App.tsx`, `core.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10030165912518854 - nodes in this community are weakly interconnected._
- **Should `core.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09803921568627451 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._