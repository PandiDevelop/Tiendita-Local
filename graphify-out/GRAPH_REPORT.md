# Graph Report - Mi Tiendita  (2026-09-08)

## Corpus Check
- 36 files · ~75,638 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 369 nodes · 1043 edges · 15 communities (10 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1db5da79`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- App.tsx
- core.ts
- package.json
- Inventory.tsx
- ui.tsx
- compilerOptions
- vite-env.d.ts
- store.tsx
- Mi Tiendita
- AGENTS.md
- SaleRegistration.tsx

## God Nodes (most connected - your core abstractions)
1. `useStore()` - 29 edges
2. `SaleRegistration()` - 24 edges
3. `uid()` - 23 edges
4. `esc()` - 22 edges
5. `syncClientId()` - 21 edges
6. `Inventory()` - 21 edges
7. `Catalog()` - 20 edges
8. `react` - 19 edges
9. `syncName()` - 19 edges
10. `joinStore()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `App()` --calls--> `esc()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/core.ts
- `SaleRegistration()` --calls--> `shortTag()`  [EXTRACTED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `register()` --calls--> `today()`  [EXTRACTED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `Catalog()` --calls--> `money()`  [EXTRACTED]
  react-app/src/views/Catalog.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.09
Nodes (56): compressImage(), DEFAULT_STORE_IMAGE, isStoreOwner(), mergeInvLog(), mergeItems(), mergeNoteLog(), myRole(), syncClientId() (+48 more)

### Community 2 - "App.tsx"
Cohesion: 0.24
Nodes (13): App(), selectStore(), setMenu(), addNote(), canManageTeam(), syncName(), useStore(), JoinModal() (+5 more)

### Community 3 - "core.ts"
Cohesion: 0.09
Nodes (47): APP_VERSION, costFor(), costTotal(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, esc(), findActivePromo(), formatDate() (+39 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "Inventory.tsx"
Cohesion: 0.09
Nodes (38): adoptInvLog(), CategoryGroup, DEFAULT_PRODUCT_IMAGE, groupedByCategory(), inventorySold(), promoText(), reorderCategoryProducts(), shortTag() (+30 more)

### Community 6 - "ui.tsx"
Cohesion: 0.08
Nodes (34): EditablePromo, fromEditablePromos(), insertCatSorted(), normalizePromo(), numText(), setCategoryPricing(), toEditablePromos(), DialogKind (+26 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 12 - "store.tsx"
Cohesion: 0.11
Nodes (27): CLIENT_KEY, DEFAULT_PRODUCT_TAG, loadState(), makeDraft(), normalizeStore(), saveState(), uid(), SyncHandle (+19 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "SaleRegistration.tsx"
Cohesion: 0.09
Nodes (29): Dropdown(), DropdownItem, activeEvent(), catLabel(), fixedPackageTotal(), promoPrice(), promoUnitReward(), round2() (+21 more)

## Knowledge Gaps
- **76 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 102 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `sync.ts`, `core.ts`, `package.json`, `Inventory.tsx`, `ui.tsx`, `store.tsx`, `SaleRegistration.tsx`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration.tsx` to `App.tsx`, `core.ts`, `store.tsx`, `Inventory.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09351256575102279 - nodes in this community are weakly interconnected._
- **Should `core.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09427609427609428 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._
- **Should `Inventory.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09191583610188261 - nodes in this community are weakly interconnected._