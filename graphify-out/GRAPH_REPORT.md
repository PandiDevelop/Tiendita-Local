# Graph Report - repo-local  (2026-09-15)

## Corpus Check
- 59 files · ~343,570 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 654 nodes · 1980 edges · 32 communities (27 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `23f572c5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- core.ts
- SettingsModal.tsx
- react-app/package.json
- App
- store.tsx
- compilerOptions
- syncName
- vite-env.d.ts
- public/sw.js
- sw.js
- theme.ts
- Mi Tiendita
- AGENTS.md
- SaleRegistration
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- lightbox.ts
- App.tsx
- ui.tsx
- Inventory.tsx
- pushOverlay
- inject-sw-version.mjs
- types.ts
- features.test.tsx
- notesArchive.ts
- dialog.ts
- sync.test.ts
- SaleRegistration.tsx
- Events.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 30 edges
5. `esc()` - 28 edges
6. `Inventory()` - 26 edges
7. `Notes()` - 26 edges
8. `SaleRegistration()` - 25 edges
9. `SettingsModal()` - 25 edges
10. `react` - 24 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `addProduct()` --calls--> `uid()`  [EXTRACTED]
  react-app/src/test/sync.test.ts → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts

## Import Cycles
- None detected.

## Communities (32 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.06
Nodes (88): canManageTeam(), clearDeletedNotes(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds() (+80 more)

### Community 2 - "core.ts"
Cohesion: 0.13
Nodes (19): costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_PRODUCT_TAG, DEFAULT_STORE_SVG, deletedNoteIds, fixedPackageTotal(), InvLogRow (+11 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.08
Nodes (54): accountEnabled(), authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), registerAccount() (+46 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "App"
Cohesion: 0.23
Nodes (9): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+1 more)

### Community 6 - "store.tsx"
Cohesion: 0.16
Nodes (15): NOTE_TTL_MS, saveState(), ctx(), notifyPermission(), playNoteChime(), showSystemNotification(), softVibrate(), tone() (+7 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "syncName"
Cohesion: 0.09
Nodes (50): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+42 more)

### Community 12 - "theme.ts"
Cohesion: 0.18
Nodes (14): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themePref, THEMES (+6 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "SaleRegistration"
Cohesion: 0.09
Nodes (34): catLabel(), findActivePromo(), priceFor(), saleUnits(), shortDate(), total(), BoxIcon(), CartIcon() (+26 more)

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

### Community 20 - "App.tsx"
Cohesion: 0.13
Nodes (14): DEV_LOGO, TAB_ICONS, askSwVersion(), useAppVersion(), ASSETS, preloadDevAssets(), CalendarIcon(), ChartIcon() (+6 more)

### Community 21 - "ui.tsx"
Cohesion: 0.13
Nodes (18): NoteEditRecord, BellIcon(), CargoIcon(), CatalogIcon(), CheckboxOutlineIcon(), ChecklistIcon(), confirmDialog(), GearIcon() (+10 more)

### Community 22 - "Inventory.tsx"
Cohesion: 0.07
Nodes (58): CategoryGroup, compressImage(), DEFAULT_PRODUCT_IMAGE, EditablePromo, esc(), fromEditablePromos(), getSupplierInfo(), groupedByCategory() (+50 more)

### Community 23 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "types.ts"
Cohesion: 0.16
Nodes (14): itemLabel(), CategoryPricing, Member, NoteChecklistItem, NoteEntry, NoteReply, Promo, Role (+6 more)

### Community 26 - "features.test.tsx"
Cohesion: 0.25
Nodes (11): makeDraft(), addTag(), setup(), Device, fieldControl(), makeProduct(), makeState(), makeStore() (+3 more)

### Community 27 - "notesArchive.ts"
Cohesion: 0.27
Nodes (14): archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt(), loadArchive(), noteArchiveText() (+6 more)

### Community 28 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 29 - "sync.test.ts"
Cohesion: 0.18
Nodes (10): costFor(), costTotal(), findCostId(), profitTotal(), addProduct(), apply(), makePayload(), newStore() (+2 more)

### Community 30 - "SaleRegistration.tsx"
Cohesion: 0.18
Nodes (11): Dropdown(), DropdownItem, saleCatsOf(), CloseIcon(), Modal(), ReceiptIcon(), UndoIcon(), JoinModal() (+3 more)

### Community 31 - "Events.tsx"
Cohesion: 0.31
Nodes (9): activeEvent(), formatDate(), pad2(), blankEvent(), Events(), finalize(), openAdding(), patch() (+1 more)

## Knowledge Gaps
- **116 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 154 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SaleRegistration.tsx` to `sync.ts`, `SettingsModal.tsx`, `react-app/package.json`, `store.tsx`, `theme.ts`, `SaleRegistration`, `App.tsx`, `ui.tsx`, `Inventory.tsx`, `types.ts`, `features.test.tsx`, `Events.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `core.ts`, `syncName`, `App.tsx`, `Inventory.tsx`, `SaleRegistration.tsx`, `Events.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _116 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06491885143570537 - nodes in this community are weakly interconnected._
- **Should `core.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1341991341991342 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07553143374038897 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._