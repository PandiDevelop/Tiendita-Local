# Graph Report - repo-local  (2026-09-09)

## Corpus Check
- 45 files · ~76,577 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 509 nodes · 1464 edges · 20 communities (15 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `364f20ee`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- esc
- react-app/package.json
- Catalog
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- core.ts
- Mi Tiendita
- AGENTS.md
- Inventory
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- SettingsModal.tsx
- store.tsx
- ui.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 34 edges
2. `useStore()` - 33 edges
3. `syncName()` - 30 edges
4. `uid()` - 27 edges
5. `esc()` - 24 edges
6. `Notes()` - 24 edges
7. `SaleRegistration()` - 24 edges
8. `react` - 21 edges
9. `Inventory()` - 21 edges
10. `applyRemote()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `removeCategory()` --calls--> `customConfirm()`  [EXTRACTED]
  react-app/src/views/Catalog.tsx → react-app/src/lib/dialog.ts
- `removeProduct()` --calls--> `customConfirm()`  [EXTRACTED]
  react-app/src/views/Catalog.tsx → react-app/src/lib/dialog.ts
- `removeCategory()` --calls--> `customConfirm()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/dialog.ts
- `App()` --calls--> `esc()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (20 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.08
Nodes (65): clearDeletedNotes(), compressImage(), DEFAULT_STORE_IMAGE, isStoreOwner(), mergeInvLog(), mergeItems(), mergeNoteLog(), myRole() (+57 more)

### Community 3 - "esc"
Cohesion: 0.09
Nodes (42): catLabel(), costFor(), costTotal(), esc(), findActivePromo(), formatDate(), itemLabel(), money() (+34 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "Catalog"
Cohesion: 0.19
Nodes (10): promoText(), reorderCategoryProducts(), Catalog(), catKey(), catOpen(), removeCategory(), removeProduct(), startProdDrag() (+2 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.09
Nodes (49): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), canDeleteNote(), canEditNote(), canManageNotes() (+41 more)

### Community 12 - "core.ts"
Cohesion: 0.06
Nodes (63): activeEvent(), CategoryGroup, CLIENT_KEY, DEFAULT_PROD_SVG, DEFAULT_PRODUCT_TAG, DEFAULT_STORE_SVG, deletedNoteIds, deletedNoteIdsOf() (+55 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "Inventory"
Cohesion: 0.27
Nodes (13): adoptInvLog(), Inventory(), bump(), catKey(), catOpen(), cur(), openCargo(), openEdit() (+5 more)

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
Cohesion: 0.23
Nodes (16): disablePushForStore(), enablePushForStore(), getMessagingInstance(), PUSH_WORKER_URL, pushConfigured(), VAPID_PUBLIC_KEY, notifyEnabled(), setNotifyEnabled() (+8 more)

### Community 20 - "store.tsx"
Cohesion: 0.13
Nodes (25): NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveUpsert(), exportArchiveCsv(), loadArchive(), noteArchiveText(), noteToArchiveEntry() (+17 more)

### Community 21 - "ui.tsx"
Cohesion: 0.06
Nodes (67): App(), selectStore(), setMenu(), Dropdown(), DropdownItem, askSwVersion(), current(), save() (+59 more)

## Knowledge Gaps
- **95 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 121 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `ui.tsx` to `sync.ts`, `esc`, `react-app/package.json`, `Notes.tsx`, `core.ts`, `SettingsModal.tsx`, `store.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `esc` to `Notes.tsx`, `core.ts`, `ui.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0777928539122569 - nodes in this community are weakly interconnected._
- **Should `esc` be split into smaller, more focused modules?**
  _Cohesion score 0.08897959183673469 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._