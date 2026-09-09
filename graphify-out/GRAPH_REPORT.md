# Graph Report - repo-local  (2026-09-09)

## Corpus Check
- 45 files · ~75,449 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 501 nodes · 1432 edges · 25 communities (20 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `75bdabcb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- App.tsx
- esc
- react-app/package.json
- Inventory.tsx
- dialog.ts
- compilerOptions
- Notes
- vite-env.d.ts
- public/sw.js
- sw.js
- core.ts
- Mi Tiendita
- AGENTS.md
- syncName
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- SettingsModal.tsx
- store.tsx
- useStore
- Notes.tsx
- SaleRegistration.tsx
- lightbox.ts

## God Nodes (most connected - your core abstractions)
1. `useStore()` - 33 edges
2. `syncClientId()` - 32 edges
3. `syncName()` - 30 edges
4. `uid()` - 27 edges
5. `esc()` - 24 edges
6. `Notes()` - 24 edges
7. `SaleRegistration()` - 24 edges
8. `react` - 21 edges
9. `Inventory()` - 21 edges
10. `joinStore()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `emit()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/dialog.ts → react-app/src/lib/appVersion.ts
- `subscribeDialog()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/dialog.ts → react-app/src/lib/appVersion.ts
- `emit()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/lightbox.ts → react-app/src/lib/appVersion.ts
- `subscribeLightbox()` --indirect_call--> `current()`  [INFERRED]
  react-app/src/lib/lightbox.ts → react-app/src/lib/appVersion.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (25 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.08
Nodes (63): compressImage(), isStoreOwner(), mergeInvLog(), mergeItems(), mergeNoteLog(), myRole(), syncClientId(), syncGenPin() (+55 more)

### Community 2 - "App.tsx"
Cohesion: 0.22
Nodes (8): DEFAULT_STORE_IMAGE, GearIcon(), MenuIcon(), Modal(), StorefrontIcon(), Toast(), JoinModal(), submit()

### Community 3 - "esc"
Cohesion: 0.09
Nodes (42): catLabel(), costFor(), esc(), findActivePromo(), formatDate(), itemLabel(), money(), pad2() (+34 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "Inventory.tsx"
Cohesion: 0.14
Nodes (18): groupedByCategory(), inventorySold(), promoText(), reorderCategoryProducts(), shortTag(), customConfirm(), PencilIcon(), TruckIcon() (+10 more)

### Community 6 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes"
Cohesion: 0.13
Nodes (27): addChecklistItem(), canDeleteNote(), canEditNote(), canManageNotes(), canManageTeam(), deleteNoteMsg(), deleteNoteReply(), editNoteMsg() (+19 more)

### Community 12 - "core.ts"
Cohesion: 0.05
Nodes (59): activeEvent(), CategoryGroup, CLIENT_KEY, costTotal(), DEFAULT_PROD_SVG, DEFAULT_PRODUCT_TAG, DEFAULT_STORE_SVG, fixedPackageTotal() (+51 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "syncName"
Cohesion: 0.15
Nodes (29): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), fromEditablePromos(), normalizePromo(), syncName() (+21 more)

### Community 16 - "index.js"
Cohesion: 0.40
Nodes (9): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readPushTokens() (+1 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "SettingsModal.tsx"
Cohesion: 0.13
Nodes (24): App(), selectStore(), setMenu(), askSwVersion(), current(), save(), useAppVersion(), APP_VERSION (+16 more)

### Community 20 - "store.tsx"
Cohesion: 0.19
Nodes (18): loadState(), NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveUpsert(), exportArchiveCsv(), loadArchive(), noteArchiveText() (+10 more)

### Community 21 - "useStore"
Cohesion: 0.21
Nodes (15): EditablePromo, insertCatSorted(), setCategoryPricing(), storeCats(), toEditablePromos(), useStore(), CategorySuggest(), SuggestInput() (+7 more)

### Community 22 - "Notes.tsx"
Cohesion: 0.23
Nodes (13): BellIcon(), CheckboxOutlineIcon(), ChecklistIcon(), CloseIcon(), confirmDialog(), DownloadIcon(), GearMenu(), NoteTextIcon() (+5 more)

### Community 23 - "SaleRegistration.tsx"
Cohesion: 0.24
Nodes (8): Dropdown(), DropdownItem, DEFAULT_PRODUCT_IMAGE, saleCatsOf(), ReceiptIcon(), UndoIcon(), Line, react

### Community 24 - "lightbox.ts"
Cohesion: 0.31
Nodes (8): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), Image(), ImageLightboxHost()

## Knowledge Gaps
- **93 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+88 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 120 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SaleRegistration.tsx` to `sync.ts`, `App.tsx`, `esc`, `react-app/package.json`, `Inventory.tsx`, `core.ts`, `SettingsModal.tsx`, `store.tsx`, `useStore`, `Notes.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `esc` to `App.tsx`, `Inventory.tsx`, `core.ts`, `syncName`, `useStore`, `SaleRegistration.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _93 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08365384615384615 - nodes in this community are weakly interconnected._
- **Should `esc` be split into smaller, more focused modules?**
  _Cohesion score 0.08897959183673469 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._
- **Should `Inventory.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1422924901185771 - nodes in this community are weakly interconnected._