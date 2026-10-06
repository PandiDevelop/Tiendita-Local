# Graph Report - Web  (2026-10-06)

## Corpus Check
- 69 files · ~356,156 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 708 nodes · 2207 edges · 27 communities (22 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d6fd9b32`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- SettingsModal.tsx
- react-app/package.json
- dialog.ts
- main.tsx
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- Mi Tiendita
- AGENTS.md
- store.tsx
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- ProductForm.tsx
- Notes.tsx
- DevThemes.tsx
- inject-sw-version.mjs
- Inventory.tsx
- Dashboard.tsx
- core.ts
- SaleRegistration.tsx
- Catalog
- useStore

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 44 edges
2. `useStore()` - 41 edges
3. `esc()` - 34 edges
4. `syncName()` - 34 edges
5. `uid()` - 30 edges
6. `SettingsModal()` - 28 edges
7. `react` - 26 edges
8. `Notes()` - 26 edges
9. `SaleRegistration()` - 26 edges
10. `AppProvider()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts

## Import Cycles
- None detected.

## Communities (27 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.06
Nodes (98): clearDeletedNotes(), compressImage(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds() (+90 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.08
Nodes (58): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange(), registerAccount() (+50 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (34): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+26 more)

### Community 5 - "dialog.ts"
Cohesion: 0.33
Nodes (6): DialogKind, DialogRequest, emit(), Listener, listeners, open()

### Community 6 - "main.tsx"
Cohesion: 0.09
Nodes (23): ENTRY, hasOverlay(), popOverlay(), realUrl(), stack, syncHistory(), CapgoGlobal, initCapUpdater() (+15 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.10
Nodes (31): DEV_LOGO, TAB_ICONS, pushOverlay(), resolveDialog(), subscribeDialog(), closeLightbox(), emit(), Listener (+23 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "store.tsx"
Cohesion: 0.18
Nodes (19): NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt() (+11 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "ProductForm.tsx"
Cohesion: 0.08
Nodes (57): activeEvent(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), DEFAULT_PRODUCT_TAG, EditablePromo (+49 more)

### Community 22 - "Notes.tsx"
Cohesion: 0.05
Nodes (55): App(), selectStore(), setMenu(), useScrollAxisLock(), canDeleteNote(), canEditNote(), canManageNotes(), canManageTeam() (+47 more)

### Community 23 - "DevThemes.tsx"
Cohesion: 0.19
Nodes (16): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themeOptions(), themePref (+8 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "Inventory.tsx"
Cohesion: 0.15
Nodes (15): Dropdown(), DropdownItem, saleCatsOf(), storeCats(), toEditablePromos(), Product, CaretIcon(), CargoIcon() (+7 more)

### Community 27 - "Dashboard.tsx"
Cohesion: 0.12
Nodes (32): formatDate(), inventorySold(), itemLabel(), money(), pad2(), priceFor(), saleUnits(), shortDate() (+24 more)

### Community 30 - "core.ts"
Cohesion: 0.06
Nodes (56): CategoryGroup, costEntryKey(), costFor(), costTotal(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds (+48 more)

### Community 31 - "SaleRegistration.tsx"
Cohesion: 0.15
Nodes (17): catLabel(), findActivePromo(), shortTag(), sortProducts(), SaleItem, ReceiptIcon(), UndoIcon(), Line (+9 more)

### Community 33 - "Catalog"
Cohesion: 0.24
Nodes (8): promoText(), reorderCategoryProducts(), Catalog(), catKey(), catOpen(), startProdDrag(), toggleCat(), startProdDrag()

### Community 34 - "useStore"
Cohesion: 0.16
Nodes (23): DEFAULT_PRODUCT_IMAGE, esc(), groupedByCategory(), insertTagSorted(), productTags(), removeStoreTag(), renameStoreTag(), storeTags() (+15 more)

## Knowledge Gaps
- **125 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+120 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 161 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inventory.tsx` to `sync.ts`, `useStore`, `SettingsModal.tsx`, `react-app/package.json`, `main.tsx`, `ui.tsx`, `store.tsx`, `ProductForm.tsx`, `Notes.tsx`, `DevThemes.tsx`, `Dashboard.tsx`, `core.ts`, `SaleRegistration.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `sync.ts`, `Catalog`, `SettingsModal.tsx`, `ui.tsx`, `store.tsx`, `ProductForm.tsx`, `Notes.tsx`, `Inventory.tsx`, `Dashboard.tsx`, `SaleRegistration.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration.tsx` to `useStore`, `ui.tsx`, `ProductForm.tsx`, `Inventory.tsx`, `Dashboard.tsx`, `core.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _125 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.060198019801980196 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08048289738430583 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05873015873015873 - nodes in this community are weakly interconnected._