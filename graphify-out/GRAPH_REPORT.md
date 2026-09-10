# Graph Report - repo-local  (2026-09-10)

## Corpus Check
- 51 files · ~92,394 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 576 nodes · 1745 edges · 19 communities (14 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3756a7e5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- core.ts
- notesArchive.ts
- react-app/package.json
- useStore
- ProductForm.tsx
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- SettingsModal.tsx
- Mi Tiendita
- AGENTS.md
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- ui.tsx

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
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts

## Import Cycles
- None detected.

## Communities (19 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.06
Nodes (92): canManageTeam(), clearDeletedNotes(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds() (+84 more)

### Community 2 - "core.ts"
Cohesion: 0.06
Nodes (64): CategoryGroup, CLIENT_KEY, costFor(), costTotal(), DEFAULT_PROD_SVG, DEFAULT_PRODUCT_TAG, DEFAULT_STORE_SVG, deletedNoteIds (+56 more)

### Community 3 - "notesArchive.ts"
Cohesion: 0.22
Nodes (16): archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt(), loadArchive(), noteArchiveText() (+8 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "useStore"
Cohesion: 0.05
Nodes (78): Dropdown(), DropdownItem, activeEvent(), catLabel(), DEFAULT_PRODUCT_IMAGE, esc(), findActivePromo(), formatDate() (+70 more)

### Community 6 - "ProductForm.tsx"
Cohesion: 0.15
Nodes (20): compressImage(), EditablePromo, fromEditablePromos(), insertCatSorted(), normalizePromo(), numText(), setCategoryPricing(), storeCats() (+12 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.07
Nodes (59): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+51 more)

### Community 12 - "SettingsModal.tsx"
Cohesion: 0.11
Nodes (29): canManageNotes(), DeletedStoreRecord, syncSetName(), notifCatEnabled(), notifCats(), notifyEnabled(), setNotifCat(), setNotifyEnabled() (+21 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 21 - "ui.tsx"
Cohesion: 0.06
Nodes (48): App(), selectStore(), setMenu(), askSwVersion(), current(), save(), useAppVersion(), ENTRY (+40 more)

## Knowledge Gaps
- **103 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+98 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 133 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `sync.ts`, `core.ts`, `react-app/package.json`, `ProductForm.tsx`, `Notes.tsx`, `SettingsModal.tsx`, `ui.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `useStore` to `Notes.tsx`, `ui.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _103 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06226203807390818 - nodes in this community are weakly interconnected._
- **Should `core.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.059125085440874914 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._
- **Should `useStore` be split into smaller, more focused modules?**
  _Cohesion score 0.051511758118701005 - nodes in this community are weakly interconnected._