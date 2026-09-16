# Graph Report - repo-local  (2026-09-15)

## Corpus Check
- 59 files · ~344,253 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 658 nodes · 2000 edges · 31 communities (25 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ee6c2a31`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- Notes.tsx
- SettingsModal.tsx
- react-app/package.json
- App
- Inventory
- compilerOptions
- core.ts
- vite-env.d.ts
- public/sw.js
- sw.js
- SaleRegistration
- Mi Tiendita
- AGENTS.md
- esc
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- lightbox.ts
- ui.tsx
- theme.ts
- Inventory.tsx
- pushOverlay
- inject-sw-version.mjs
- Catalog
- store.tsx
- preload.ts
- dialog.ts
- StoreModal.tsx
- features.test.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 30 edges
5. `esc()` - 28 edges
6. `SettingsModal()` - 28 edges
7. `Inventory()` - 26 edges
8. `Notes()` - 26 edges
9. `SaleRegistration()` - 25 edges
10. `react` - 24 edges

## Surprising Connections (you probably didn't know these)
- `saveName()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/SettingsModal.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `doToggleItem()` --calls--> `toggleChecklistItem()`  [EXTRACTED]
  react-app/src/views/Notes.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts
- `App()` --calls--> `useAppVersion()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/appVersion.ts

## Import Cycles
- None detected.

## Communities (31 total, 5 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.08
Nodes (71): clearDeletedNotes(), costEntryKey(), dedupeCosts(), deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds() (+63 more)

### Community 2 - "Notes.tsx"
Cohesion: 0.08
Nodes (47): addChecklistItem(), canDeleteNote(), canEditNote(), canManageNotes(), canManageTeam(), deleteNoteMsg(), deleteNoteReply(), editChecklistNote() (+39 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.09
Nodes (48): accountEnabled(), authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange() (+40 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "App"
Cohesion: 0.23
Nodes (9): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+1 more)

### Community 6 - "Inventory"
Cohesion: 0.33
Nodes (9): inventorySold(), Inventory(), catKey(), catOpen(), cur(), openEdit(), saveEdit(), toggleCat() (+1 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "core.ts"
Cohesion: 0.07
Nodes (64): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), CategoryGroup, costTotal(), DEFAULT_PROD_SVG (+56 more)

### Community 12 - "SaleRegistration"
Cohesion: 0.24
Nodes (10): catLabel(), SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine() (+2 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "esc"
Cohesion: 0.14
Nodes (29): costFor(), esc(), findActivePromo(), formatDate(), money(), pad2(), priceFor(), profitTotal() (+21 more)

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
Cohesion: 0.11
Nodes (23): DEV_LOGO, TAB_ICONS, BoxIcon(), CalendarIcon(), CargoIcon(), CatalogIcon(), CategorySuggest(), ChartIcon() (+15 more)

### Community 21 - "theme.ts"
Cohesion: 0.17
Nodes (15): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themeOptions(), themePref (+7 more)

### Community 22 - "Inventory.tsx"
Cohesion: 0.16
Nodes (24): Dropdown(), DropdownItem, DEFAULT_PRODUCT_IMAGE, groupedByCategory(), productTags(), saleCatsOf(), shortTag(), sortProducts() (+16 more)

### Community 23 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "Catalog"
Cohesion: 0.24
Nodes (8): promoText(), reorderCategoryProducts(), Catalog(), catKey(), catOpen(), startProdDrag(), toggleCat(), startProdDrag()

### Community 26 - "store.tsx"
Cohesion: 0.06
Nodes (52): activeEvent(), InvLogRow, loadState(), makeDraft(), NOTE_TTL_MS, archiveMarkGone(), archiveRows(), archiveUpsert() (+44 more)

### Community 28 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 30 - "StoreModal.tsx"
Cohesion: 0.11
Nodes (29): compressImage(), DEFAULT_STORE_IMAGE, rememberDeletedStore(), syncGenPin(), syncSetName(), clearSeenNoteIds(), detach(), deactivateSyncFn() (+21 more)

### Community 32 - "features.test.tsx"
Cohesion: 0.29
Nodes (6): itemLabel(), addTag(), fieldControl(), EmpAcc, Employees(), roleLabel()

## Knowledge Gaps
- **116 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 154 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inventory.tsx` to `features.test.tsx`, `Notes.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `core.ts`, `esc`, `ui.tsx`, `theme.ts`, `store.tsx`, `StoreModal.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `core.ts`, `esc`, `ui.tsx`, `Inventory.tsx`, `store.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _116 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07838660578386605 - nodes in this community are weakly interconnected._
- **Should `Notes.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07541478129713423 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08514013749338974 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._