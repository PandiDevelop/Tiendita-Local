# Graph Report - repo-local  (2026-09-10)

## Corpus Check
- 47 files · ~81,813 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 530 nodes · 1585 edges · 20 communities (15 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2c1b0bd9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- syncClientId
- useStore
- react-app/package.json
- Inventory.tsx
- SaleRegistration
- compilerOptions
- core.ts
- vite-env.d.ts
- public/sw.js
- sw.js
- SettingsModal.tsx
- Mi Tiendita
- AGENTS.md
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- store.tsx
- Notes.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 39 edges
2. `useStore()` - 35 edges
3. `syncName()` - 33 edges
4. `esc()` - 28 edges
5. `uid()` - 28 edges
6. `Notes()` - 26 edges
7. `SaleRegistration()` - 25 edges
8. `react` - 22 edges
9. `Inventory()` - 22 edges
10. `Catalog()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (20 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (71): clearDeletedNotes(), compressImage(), deletedNoteIdsOf(), deletedNotesKey(), getDeletedNoteIds(), isNoteDeleted(), isStoreOwner(), markNoteDeleted() (+63 more)

### Community 2 - "syncClientId"
Cohesion: 0.13
Nodes (35): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), DEFAULT_PRODUCT_TAG, EditablePromo, fromEditablePromos() (+27 more)

### Community 3 - "useStore"
Cohesion: 0.11
Nodes (39): activeEvent(), catLabel(), costFor(), esc(), findActivePromo(), formatDate(), itemLabel(), money() (+31 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "Inventory.tsx"
Cohesion: 0.11
Nodes (34): DEFAULT_PRODUCT_IMAGE, groupedByCategory(), inventorySold(), productTags(), promoText(), reorderCategoryProducts(), shortTag(), storeCats() (+26 more)

### Community 6 - "SaleRegistration"
Cohesion: 0.23
Nodes (10): saleCatsOf(), SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine() (+2 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "core.ts"
Cohesion: 0.07
Nodes (50): addChecklistItem(), canDeleteNote(), canEditNote(), canManageNotes(), canManageTeam(), CategoryGroup, DEFAULT_PROD_SVG, DEFAULT_STORE_SVG (+42 more)

### Community 12 - "SettingsModal.tsx"
Cohesion: 0.18
Nodes (23): disablePushForStore(), enablePushForStore(), ensurePushToken(), getMessagingInstance(), PUSH_WORKER_URL, pushConfigured(), VAPID_PUBLIC_KEY, notifCatEnabled() (+15 more)

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

### Community 19 - "store.tsx"
Cohesion: 0.07
Nodes (46): CLIENT_KEY, costTotal(), loadState(), makeDraft(), migrateNoteLogToBoard(), normalizeStore(), saveState(), archiveMarkGone() (+38 more)

### Community 21 - "Notes.tsx"
Cohesion: 0.05
Nodes (57): App(), selectStore(), setMenu(), Dropdown(), DropdownItem, askSwVersion(), current(), save() (+49 more)

## Knowledge Gaps
- **96 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+91 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 125 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Notes.tsx` to `sync.ts`, `syncClientId`, `useStore`, `react-app/package.json`, `Inventory.tsx`, `SettingsModal.tsx`, `store.tsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `syncClientId`, `useStore`, `Inventory.tsx`, `core.ts`, `Notes.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0700152207001522 - nodes in this community are weakly interconnected._
- **Should `syncClientId` be split into smaller, more focused modules?**
  _Cohesion score 0.12560975609756098 - nodes in this community are weakly interconnected._
- **Should `useStore` be split into smaller, more focused modules?**
  _Cohesion score 0.10917874396135266 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._