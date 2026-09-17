# Graph Report - Web  (2026-09-16)

## Corpus Check
- 65 files · ~350,303 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 700 nodes · 2181 edges · 32 communities (27 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1dee08bf`
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
- Inventory
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- core.ts
- TagModal.tsx
- App
- ProductForm.tsx
- features.test.tsx
- inject-sw-version.mjs
- Dashboard.tsx
- store.tsx
- History.tsx
- sync.test.ts
- Profit.tsx
- SaleRegistration
- useStore

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
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts
- `doSignIn()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/AuthLanding.tsx → react-app/src/lib/sync.ts

## Import Cycles
- None detected.

## Communities (32 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (83): clearDeletedNotes(), costEntryKey(), dedupeCosts(), deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds() (+75 more)

### Community 2 - "Notes.tsx"
Cohesion: 0.10
Nodes (32): addChecklistItem(), canDeleteNote(), canEditNote(), deleteNoteMsg(), deleteNoteReply(), editChecklistNote(), editNoteMsg(), editNoteReply() (+24 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.06
Nodes (71): accountEnabled(), authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange() (+63 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (36): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+28 more)

### Community 5 - "Inventory.tsx"
Cohesion: 0.17
Nodes (21): DEFAULT_PRODUCT_IMAGE, groupedByCategory(), inventorySold(), money(), productTags(), promoText(), reorderCategoryProducts(), shortTag() (+13 more)

### Community 6 - "SaleRegistration.tsx"
Cohesion: 0.22
Nodes (9): Dropdown(), DropdownItem, saleCatsOf(), sortProducts(), CaretIcon(), ReceiptIcon(), UndoIcon(), Line (+1 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.10
Nodes (25): DEV_LOGO, TAB_ICONS, closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox() (+17 more)

### Community 12 - "dialog.ts"
Cohesion: 0.12
Nodes (22): activeEvent(), customConfirm(), DialogKind, DialogRequest, emit(), Listener, listeners, open() (+14 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "Inventory"
Cohesion: 0.29
Nodes (10): getSupplierInfo(), Inventory(), catKey(), catOpen(), cur(), onCargoSuppBlur(), openEdit(), saveEdit() (+2 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "core.ts"
Cohesion: 0.12
Nodes (22): canManageNotes(), canManageTeam(), CategoryGroup, costFor(), costTotal(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds (+14 more)

### Community 20 - "TagModal.tsx"
Cohesion: 0.33
Nodes (9): insertTagSorted(), removeStoreTag(), renameStoreTag(), storeTags(), Props, TagModal(), add(), commitRename() (+1 more)

### Community 21 - "App"
Cohesion: 0.10
Nodes (24): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+16 more)

### Community 22 - "ProductForm.tsx"
Cohesion: 0.10
Nodes (45): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), compressImage(), DEFAULT_PRODUCT_TAG, EditablePromo (+37 more)

### Community 23 - "features.test.tsx"
Cohesion: 0.11
Nodes (23): ENTRY, hasOverlay(), popOverlay(), pushOverlay(), realUrl(), stack, syncHistory(), BackButtonApp (+15 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "Dashboard.tsx"
Cohesion: 0.22
Nodes (12): SaleItem, BoxIcon(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel() (+4 more)

### Community 26 - "store.tsx"
Cohesion: 0.08
Nodes (41): InvLogRow, NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt() (+33 more)

### Community 27 - "History.tsx"
Cohesion: 0.29
Nodes (12): catLabel(), findActivePromo(), formatDate(), pad2(), priceFor(), saleUnits(), shortDate(), total() (+4 more)

### Community 28 - "sync.test.ts"
Cohesion: 0.23
Nodes (8): makeDraft(), sortByOrder(), addProduct(), apply(), Device, makePayload(), newStore(), Store

### Community 29 - "Profit.tsx"
Cohesion: 0.40
Nodes (5): PLine, Profit(), profitLines(), RangeMode, ViewMode

### Community 31 - "SaleRegistration"
Cohesion: 0.26
Nodes (9): SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine(), setManualPrice() (+1 more)

### Community 33 - "useStore"
Cohesion: 0.14
Nodes (21): DEFAULT_STORE_IMAGE, esc(), itemLabel(), toEditablePromos(), useStore(), Member, Role, CloseIcon() (+13 more)

## Knowledge Gaps
- **122 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 161 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SaleRegistration.tsx` to `useStore`, `Notes.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `Inventory.tsx`, `ui.tsx`, `dialog.ts`, `TagModal.tsx`, `App`, `ProductForm.tsx`, `features.test.tsx`, `store.tsx`, `History.tsx`, `Profit.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `sync.ts`, `Notes.tsx`, `SettingsModal.tsx`, `Inventory.tsx`, `SaleRegistration.tsx`, `ui.tsx`, `dialog.ts`, `Inventory`, `TagModal.tsx`, `App`, `ProductForm.tsx`, `Dashboard.tsx`, `store.tsx`, `History.tsx`, `Profit.tsx`, `SaleRegistration`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `useStore`, `Inventory.tsx`, `SaleRegistration.tsx`, `ui.tsx`, `dialog.ts`, `ProductForm.tsx`, `History.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07200229489386116 - nodes in this community are weakly interconnected._
- **Should `Notes.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09841269841269841 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06429548563611491 - nodes in this community are weakly interconnected._