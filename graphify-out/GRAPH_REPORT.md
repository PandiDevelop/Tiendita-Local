# Graph Report - Web  (2026-09-16)

## Corpus Check
- 66 files · ~350,468 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 701 nodes · 2186 edges · 27 communities (22 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e4010ac4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- Notes.tsx
- SettingsModal.tsx
- react-app/package.json
- Inventory.tsx
- SaleRegistration.tsx
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- dialog.ts
- Mi Tiendita
- AGENTS.md
- Catalog
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- useStore
- App
- core.ts
- inject-sw-version.mjs
- Dashboard.tsx
- store.tsx
- Profit.tsx
- SaleRegistration

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 43 edges
2. `useStore()` - 41 edges
3. `esc()` - 34 edges
4. `syncName()` - 34 edges
5. `uid()` - 31 edges
6. `SettingsModal()` - 28 edges
7. `react` - 26 edges
8. `Inventory()` - 26 edges
9. `Notes()` - 26 edges
10. `SaleRegistration()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `doTogglePin()` --calls--> `toggleNotePin()`  [EXTRACTED]
  react-app/src/views/Notes.tsx → react-app/src/lib/core.ts
- `doToggleItem()` --calls--> `toggleChecklistItem()`  [EXTRACTED]
  react-app/src/views/Notes.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (27 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (85): clearDeletedNotes(), compressImage(), costEntryKey(), dedupeCosts(), deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore() (+77 more)

### Community 2 - "Notes.tsx"
Cohesion: 0.08
Nodes (44): addChecklistItem(), canDeleteNote(), canEditNote(), deleteNoteMsg(), deleteNoteReply(), editChecklistNote(), editNoteMsg(), editNoteReply() (+36 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.06
Nodes (73): accountEnabled(), authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange() (+65 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (35): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+27 more)

### Community 5 - "Inventory.tsx"
Cohesion: 0.16
Nodes (19): DEFAULT_PRODUCT_IMAGE, DEFAULT_STORE_IMAGE, groupedByCategory(), productTags(), shortTag(), storeCats(), CaretIcon(), CargoIcon() (+11 more)

### Community 6 - "SaleRegistration.tsx"
Cohesion: 0.16
Nodes (12): Dropdown(), DropdownItem, saleCatsOf(), SaleItem, CloseIcon(), Modal(), ReceiptIcon(), UndoIcon() (+4 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.11
Nodes (27): DEV_LOGO, TAB_ICONS, pushOverlay(), subscribeDialog(), closeLightbox(), emit(), Listener, listeners (+19 more)

### Community 12 - "dialog.ts"
Cohesion: 0.32
Nodes (7): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog()

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "Catalog"
Cohesion: 0.36
Nodes (5): promoText(), Catalog(), catKey(), catOpen(), toggleCat()

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 20 - "useStore"
Cohesion: 0.19
Nodes (16): esc(), insertTagSorted(), removeStoreTag(), renameStoreTag(), storeTags(), useStore(), JoinModal(), ProductForm() (+8 more)

### Community 21 - "App"
Cohesion: 0.07
Nodes (34): App(), selectStore(), setMenu(), useScrollAxisLock(), ENTRY, hasOverlay(), popOverlay(), realUrl() (+26 more)

### Community 22 - "core.ts"
Cohesion: 0.07
Nodes (70): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canManageNotes(), canManageTeam(), DEFAULT_PROD_SVG (+62 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "Dashboard.tsx"
Cohesion: 0.26
Nodes (11): total(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel(), monthLines() (+3 more)

### Community 26 - "store.tsx"
Cohesion: 0.05
Nodes (61): CategoryGroup, InvLogRow, itemLabel(), makeDraft(), NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows() (+53 more)

### Community 27 - "Profit.tsx"
Cohesion: 0.20
Nodes (18): costFor(), costTotal(), findActivePromo(), inventorySold(), money(), priceFor(), profitTotal(), saleUnits() (+10 more)

### Community 31 - "SaleRegistration"
Cohesion: 0.11
Nodes (23): activeEvent(), catLabel(), fixedPackageTotal(), promoPrice(), promoUnitReward(), round2(), saleUnitPrice(), StoreEvent (+15 more)

## Knowledge Gaps
- **122 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 161 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SaleRegistration.tsx` to `sync.ts`, `Notes.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `Inventory.tsx`, `ui.tsx`, `useStore`, `App`, `core.ts`, `store.tsx`, `Profit.tsx`, `SaleRegistration`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `sync.ts`, `Notes.tsx`, `SettingsModal.tsx`, `Inventory.tsx`, `SaleRegistration.tsx`, `ui.tsx`, `Catalog`, `App`, `core.ts`, `Dashboard.tsx`, `store.tsx`, `Profit.tsx`, `SaleRegistration`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `Inventory.tsx`, `SaleRegistration.tsx`, `ui.tsx`, `useStore`, `core.ts`, `Profit.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06522320235231222 - nodes in this community are weakly interconnected._
- **Should `Notes.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07568027210884354 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.062434691745036575 - nodes in this community are weakly interconnected._