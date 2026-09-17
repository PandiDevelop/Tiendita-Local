# Graph Report - Web  (2026-09-16)

## Corpus Check
- 66 files · ~350,686 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 701 nodes · 2190 edges · 26 communities (21 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a50da1ab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- Notes.tsx
- SettingsModal.tsx
- react-app/package.json
- Catalog.tsx
- SaleRegistration.tsx
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- useStore
- Mi Tiendita
- AGENTS.md
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- TagModal.tsx
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
10. `SaleRegistration()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `doToggleItem()` --calls--> `toggleChecklistItem()`  [EXTRACTED]
  react-app/src/views/Notes.tsx → react-app/src/lib/core.ts
- `doSignIn()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/AuthLanding.tsx → react-app/src/lib/sync.ts

## Import Cycles
- None detected.

## Communities (26 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (83): clearDeletedNotes(), costEntryKey(), dedupeCosts(), deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds() (+75 more)

### Community 2 - "Notes.tsx"
Cohesion: 0.06
Nodes (59): addChecklistItem(), canDeleteNote(), canEditNote(), canManageNotes(), deleteNoteMsg(), deleteNoteReply(), editChecklistNote(), editNoteMsg() (+51 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.07
Nodes (62): accountEnabled(), authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange() (+54 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (35): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+27 more)

### Community 5 - "Catalog.tsx"
Cohesion: 0.17
Nodes (15): groupedByCategory(), productTags(), promoText(), shortTag(), GearMenu(), Image(), PrintIcon(), StorefrontIcon() (+7 more)

### Community 6 - "SaleRegistration.tsx"
Cohesion: 0.18
Nodes (10): Dropdown(), DropdownItem, SaleItem, CloseIcon(), ReceiptIcon(), UndoIcon(), DEV_THEMES, Stage (+2 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.10
Nodes (31): DEV_LOGO, TAB_ICONS, pushOverlay(), resolveDialog(), subscribeDialog(), closeLightbox(), emit(), Listener (+23 more)

### Community 12 - "useStore"
Cohesion: 0.22
Nodes (12): DEFAULT_STORE_IMAGE, esc(), itemLabel(), useStore(), Member, Role, ImagePicker(), EmpAcc (+4 more)

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

### Community 20 - "TagModal.tsx"
Cohesion: 0.33
Nodes (9): insertTagSorted(), removeStoreTag(), renameStoreTag(), storeTags(), Props, TagModal(), add(), commitRename() (+1 more)

### Community 21 - "App"
Cohesion: 0.07
Nodes (34): App(), selectStore(), setMenu(), useScrollAxisLock(), ENTRY, hasOverlay(), popOverlay(), realUrl() (+26 more)

### Community 22 - "core.ts"
Cohesion: 0.06
Nodes (75): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canManageTeam(), CategoryGroup, compressImage() (+67 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "Dashboard.tsx"
Cohesion: 0.26
Nodes (11): total(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel(), monthLines() (+3 more)

### Community 26 - "store.tsx"
Cohesion: 0.06
Nodes (52): InvLogRow, makeDraft(), NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt() (+44 more)

### Community 27 - "Profit.tsx"
Cohesion: 0.17
Nodes (21): costFor(), costTotal(), findActivePromo(), formatDate(), inventorySold(), money(), pad2(), priceFor() (+13 more)

### Community 31 - "SaleRegistration"
Cohesion: 0.08
Nodes (31): activeEvent(), catLabel(), fixedPackageTotal(), promoPrice(), promoUnitReward(), round2(), saleUnitPrice(), sortByOrder() (+23 more)

## Knowledge Gaps
- **122 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 161 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SaleRegistration.tsx` to `Notes.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `Catalog.tsx`, `ui.tsx`, `useStore`, `TagModal.tsx`, `App`, `core.ts`, `store.tsx`, `Profit.tsx`, `SaleRegistration`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `sync.ts`, `Notes.tsx`, `SettingsModal.tsx`, `Catalog.tsx`, `SaleRegistration.tsx`, `ui.tsx`, `TagModal.tsx`, `App`, `core.ts`, `Dashboard.tsx`, `store.tsx`, `Profit.tsx`, `SaleRegistration`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `Catalog.tsx`, `SaleRegistration.tsx`, `ui.tsx`, `useStore`, `core.ts`, `store.tsx`, `Profit.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07200229489386116 - nodes in this community are weakly interconnected._
- **Should `Notes.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06247086247086247 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07263157894736842 - nodes in this community are weakly interconnected._