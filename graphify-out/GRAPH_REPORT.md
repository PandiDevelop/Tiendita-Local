# Graph Report - Web  (2026-10-06)

## Corpus Check
- 70 files · ~356,960 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 718 nodes · 2223 edges · 22 communities (17 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35c1ecd2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- syncClientId
- SettingsModal.tsx
- react-app/package.json
- core.ts
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- Mi Tiendita
- AGENTS.md
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- Notes.tsx
- deploy-web.mjs
- testUtils.tsx
- inject-sw-version.mjs
- useStore
- store.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 44 edges
2. `useStore()` - 41 edges
3. `esc()` - 34 edges
4. `syncName()` - 34 edges
5. `SettingsModal()` - 31 edges
6. `uid()` - 30 edges
7. `react` - 26 edges
8. `Notes()` - 26 edges
9. `SaleRegistration()` - 26 edges
10. `AppProvider()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts
- `removeCategory()` --calls--> `customConfirm()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/dialog.ts

## Import Cycles
- None detected.

## Communities (22 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (86): clearDeletedNotes(), compressImage(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds() (+78 more)

### Community 2 - "syncClientId"
Cohesion: 0.08
Nodes (58): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), DEFAULT_PRODUCT_TAG, EditablePromo, ensureCost() (+50 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.07
Nodes (63): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), registerAccount(), sendPasswordReset() (+55 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (35): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+27 more)

### Community 5 - "core.ts"
Cohesion: 0.06
Nodes (49): activeEvent(), canManageTeam(), CategoryGroup, costEntryKey(), costTotal(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG (+41 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.05
Nodes (57): App(), selectStore(), setMenu(), DEV_LOGO, TAB_ICONS, useScrollAxisLock(), ENTRY, popOverlay() (+49 more)

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

### Community 19 - "Notes.tsx"
Cohesion: 0.10
Nodes (40): canDeleteNote(), canEditNote(), canManageNotes(), deleteNoteMsg(), deleteNoteReply(), editChecklistNote(), editNoteMsg(), editNoteReply() (+32 more)

### Community 22 - "deploy-web.mjs"
Cohesion: 0.40
Nodes (4): dist, entries, here, root

### Community 23 - "testUtils.tsx"
Cohesion: 0.06
Nodes (45): hasOverlay(), CapgoGlobal, initCapUpdater(), UpdaterPlugin, makeDraft(), BackButtonApp, CapacitorGlobal, initNativeBack() (+37 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 27 - "useStore"
Cohesion: 0.05
Nodes (83): Dropdown(), DropdownItem, catLabel(), costFor(), DEFAULT_PRODUCT_IMAGE, esc(), findActivePromo(), formatDate() (+75 more)

### Community 30 - "store.tsx"
Cohesion: 0.11
Nodes (34): onAccountChange(), loadState(), NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt() (+26 more)

## Knowledge Gaps
- **130 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 169 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `sync.ts`, `syncClientId`, `SettingsModal.tsx`, `react-app/package.json`, `core.ts`, `ui.tsx`, `Notes.tsx`, `testUtils.tsx`, `store.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `sync.ts`, `syncClientId`, `SettingsModal.tsx`, `core.ts`, `ui.tsx`, `Notes.tsx`, `store.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `useStore` to `ui.tsx`, `syncClientId`, `core.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06530825496342738 - nodes in this community are weakly interconnected._
- **Should `syncClientId` be split into smaller, more focused modules?**
  _Cohesion score 0.07972027972027972 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07026307026307026 - nodes in this community are weakly interconnected._