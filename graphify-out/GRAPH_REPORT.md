# Graph Report - repo-local  (2026-09-16)

## Corpus Check
- 60 files · ~347,601 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 676 nodes · 2077 edges · 35 communities (29 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2cdecece`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- ProductForm.tsx
- SettingsModal.tsx
- react-app/package.json
- App
- Inventory
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- core.ts
- Mi Tiendita
- AGENTS.md
- useStore
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- lightbox.ts
- ui.tsx
- store.tsx
- Inventory.tsx
- pushOverlay
- inject-sw-version.mjs
- sync.test.ts
- notesArchive.ts
- types.ts
- dialog.ts
- CategoryModal.tsx
- storeCats
- Catalog
- TagModal.tsx
- Modal
- preload.ts

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 43 edges
2. `useStore()` - 37 edges
3. `syncName()` - 34 edges
4. `uid()` - 31 edges
5. `esc()` - 28 edges
6. `SettingsModal()` - 28 edges
7. `Inventory()` - 26 edges
8. `Notes()` - 26 edges
9. `react` - 25 edges
10. `SaleRegistration()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts

## Import Cycles
- None detected.

## Communities (35 total, 5 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.06
Nodes (103): addChecklistNote(), addNote(), addNoteMsg(), canManageTeam(), clearDeletedNotes(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey() (+95 more)

### Community 2 - "ProductForm.tsx"
Cohesion: 0.24
Nodes (17): adoptInvLog(), ensureCost(), fromEditablePromos(), getSupplierCost(), insertCatSorted(), insertProductAlphabetically(), nextSuppTag(), normalizePromo() (+9 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.06
Nodes (66): accountEnabled(), authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange() (+58 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (36): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+28 more)

### Community 5 - "App"
Cohesion: 0.25
Nodes (8): App(), selectStore(), setMenu(), useScrollAxisLock(), initDeepLink(), readDeepTab(), readParam(), TABS

### Community 6 - "Inventory"
Cohesion: 0.21
Nodes (13): getSupplierInfo(), Inventory(), bump(), catKey(), catOpen(), cur(), onCargoSuppBlur(), openCargo() (+5 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.08
Nodes (48): addChecklistItem(), addNoteReply(), canDeleteNote(), canEditNote(), canManageNotes(), deleteNoteMsg(), deleteNoteReply(), editChecklistNote() (+40 more)

### Community 12 - "core.ts"
Cohesion: 0.11
Nodes (23): CategoryGroup, costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, DeletedStoreRecord, fixedPackageTotal() (+15 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "useStore"
Cohesion: 0.08
Nodes (53): Dropdown(), DropdownItem, activeEvent(), catLabel(), esc(), findActivePromo(), formatDate(), itemLabel() (+45 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 20 - "ui.tsx"
Cohesion: 0.10
Nodes (25): DEV_LOGO, TAB_ICONS, BellIcon(), BoxIcon(), CalendarIcon(), CartIcon(), CashIcon(), CatalogIcon() (+17 more)

### Community 21 - "store.tsx"
Cohesion: 0.16
Nodes (18): DEFAULT_PRODUCT_TAG, makeDraft(), SyncHandle, AppCtx, Ctx, ModalKind, addTag(), setup() (+10 more)

### Community 22 - "Inventory.tsx"
Cohesion: 0.19
Nodes (16): DEFAULT_PRODUCT_IMAGE, groupedByCategory(), inventorySold(), productTags(), shortTag(), storeTags(), CargoIcon(), GearMenu() (+8 more)

### Community 23 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "sync.test.ts"
Cohesion: 0.19
Nodes (9): costFor(), costTotal(), findCostId(), profitTotal(), addProduct(), apply(), makePayload(), newStore() (+1 more)

### Community 26 - "notesArchive.ts"
Cohesion: 0.24
Nodes (15): archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt(), loadArchive(), noteArchiveText() (+7 more)

### Community 27 - "types.ts"
Cohesion: 0.17
Nodes (11): CategoryPricing, Member, NoteArchiveEntry, NoteChecklistItem, NoteEditRecord, NoteEntry, Promo, Sale (+3 more)

### Community 28 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 29 - "CategoryModal.tsx"
Cohesion: 0.23
Nodes (9): EditablePromo, numText(), toEditablePromos(), CloseIcon(), CategoryModal(), Props, blank(), PromoEditor() (+1 more)

### Community 30 - "storeCats"
Cohesion: 0.33
Nodes (7): compressImage(), storeCats(), ProductForm(), commitTag(), flashTagLimit(), onFile(), onFile()

### Community 31 - "Catalog"
Cohesion: 0.19
Nodes (10): promoText(), reorderCategoryProducts(), Catalog(), catKey(), catOpen(), removeCategory(), removeProduct(), startProdDrag() (+2 more)

### Community 32 - "TagModal.tsx"
Cohesion: 0.31
Nodes (8): insertTagSorted(), removeStoreTag(), renameStoreTag(), SaveIcon(), Props, TagModal(), remove(), save()

### Community 33 - "Modal"
Cohesion: 0.50
Nodes (3): Modal(), JoinModal(), submit()

## Knowledge Gaps
- **117 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+112 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 155 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inventory.tsx` to `sync.ts`, `Modal`, `ProductForm.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `TagModal.tsx`, `Notes.tsx`, `useStore`, `ui.tsx`, `store.tsx`, `CategoryModal.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `sync.ts`, `Modal`, `ProductForm.tsx`, `SettingsModal.tsx`, `TagModal.tsx`, `App`, `Inventory`, `Notes.tsx`, `ui.tsx`, `store.tsx`, `Inventory.tsx`, `CategoryModal.tsx`, `storeCats`, `Catalog`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `useStore` to `sync.ts`, `ui.tsx`, `core.ts`, `Inventory.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _117 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05893980233602875 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06293285155073773 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05547652916073969 - nodes in this community are weakly interconnected._