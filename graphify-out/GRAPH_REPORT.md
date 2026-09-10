# Graph Report - repo-local  (2026-09-10)

## Corpus Check
- 52 files · ~92,831 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 582 nodes · 1752 edges · 31 communities (26 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `08fed09a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- sync.test.ts
- store.tsx
- react-app/package.json
- SaleRegistration
- ProductForm.tsx
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- App
- Mi Tiendita
- AGENTS.md
- Dashboard.tsx
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- core.ts
- ui.tsx
- appVersion.ts
- useStore
- Inventory.tsx
- SaleRegistration.tsx
- History.tsx
- dialog.ts
- pushOverlay
- Events.tsx
- markNoteDeleted
- saleUnitPrice

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 29 edges
5. `esc()` - 28 edges
6. `Notes()` - 26 edges
7. `SaleRegistration()` - 25 edges
8. `react` - 23 edges
9. `Inventory()` - 22 edges
10. `AppProvider()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `emit()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/dialog.ts → react-app/src/lib/appVersion.ts
- `subscribeDialog()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/dialog.ts → react-app/src/lib/appVersion.ts
- `emit()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/lightbox.ts → react-app/src/lib/appVersion.ts
- `subscribeLightbox()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/lightbox.ts → react-app/src/lib/appVersion.ts
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (31 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.06
Nodes (90): clearDeletedNotes(), compressImage(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), forgetDeletedStore(), mergeInvLog(), mergeItems(), mergeNoteLog() (+82 more)

### Community 2 - "sync.test.ts"
Cohesion: 0.08
Nodes (35): costFor(), costTotal(), itemLabel(), loadState(), makeDraft(), normalizeStore(), priceFor(), profitTotal() (+27 more)

### Community 3 - "store.tsx"
Cohesion: 0.08
Nodes (49): canManageNotes(), deletedStores(), saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt() (+41 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "SaleRegistration"
Cohesion: 0.23
Nodes (10): saleCatsOf(), SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine() (+2 more)

### Community 6 - "ProductForm.tsx"
Cohesion: 0.18
Nodes (17): DEFAULT_PRODUCT_TAG, EditablePromo, fromEditablePromos(), insertCatSorted(), normalizePromo(), numText(), setCategoryPricing(), toEditablePromos() (+9 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.08
Nodes (51): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+43 more)

### Community 12 - "App"
Cohesion: 0.23
Nodes (9): App(), selectStore(), setMenu(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam(), TABS (+1 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "Dashboard.tsx"
Cohesion: 0.36
Nodes (8): total(), ChevronIcon(), Dashboard(), Line, monthLabel(), monthLines(), monthOf(), monthShift()

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
Cohesion: 0.10
Nodes (27): canManageTeam(), CategoryGroup, CLIENT_KEY, DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, DeletedStoreRecord, InvLogRow (+19 more)

### Community 20 - "ui.tsx"
Cohesion: 0.12
Nodes (20): DEV_LOGO, closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ASSETS (+12 more)

### Community 21 - "appVersion.ts"
Cohesion: 0.53
Nodes (5): askSwVersion(), current(), save(), useAppVersion(), APP_VERSION

### Community 22 - "useStore"
Cohesion: 0.23
Nodes (16): DEFAULT_PRODUCT_IMAGE, esc(), groupedByCategory(), money(), productTags(), promoText(), shortTag(), storeCats() (+8 more)

### Community 23 - "Inventory.tsx"
Cohesion: 0.16
Nodes (17): inventorySold(), reorderCategoryProducts(), Product, GearMenu(), PencilIcon(), TruckIcon(), startProdDrag(), Inventory() (+9 more)

### Community 24 - "SaleRegistration.tsx"
Cohesion: 0.24
Nodes (8): Dropdown(), DropdownItem, CloseIcon(), Modal(), ReceiptIcon(), UndoIcon(), Line, react

### Community 25 - "History.tsx"
Cohesion: 0.33
Nodes (9): catLabel(), findActivePromo(), formatDate(), pad2(), saleUnits(), shortDate(), DownloadIcon(), History() (+1 more)

### Community 26 - "dialog.ts"
Cohesion: 0.18
Nodes (13): customConfirm(), DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog() (+5 more)

### Community 27 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 28 - "Events.tsx"
Cohesion: 0.39
Nodes (7): activeEvent(), blankEvent(), Events(), finalize(), openAdding(), patch(), today()

### Community 29 - "markNoteDeleted"
Cohesion: 0.33
Nodes (7): deletedNotesKey(), getDeletedNoteIds(), isNoteDeleted(), markNoteDeleted(), migrateNoteLogToBoard(), sweepExpiredNotes(), sweep()

### Community 30 - "saleUnitPrice"
Cohesion: 0.60
Nodes (5): fixedPackageTotal(), promoPrice(), promoUnitReward(), round2(), saleUnitPrice()

## Knowledge Gaps
- **105 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+100 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 137 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SaleRegistration.tsx` to `sync.ts`, `sync.test.ts`, `store.tsx`, `react-app/package.json`, `ProductForm.tsx`, `Notes.tsx`, `ui.tsx`, `appVersion.ts`, `useStore`, `Inventory.tsx`, `History.tsx`, `Events.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `Notes.tsx`, `core.ts`, `ui.tsx`, `useStore`, `SaleRegistration.tsx`, `History.tsx`, `Events.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _105 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06077606358111267 - nodes in this community are weakly interconnected._
- **Should `sync.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08484848484848485 - nodes in this community are weakly interconnected._
- **Should `store.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08123904149620105 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._