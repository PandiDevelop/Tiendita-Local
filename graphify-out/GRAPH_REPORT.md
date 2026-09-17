# Graph Report - Web  (2026-09-16)

## Corpus Check
- 63 files · ~349,554 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 690 nodes · 2157 edges · 33 communities (28 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `27c8e78e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- ProductForm.tsx
- SettingsModal.tsx
- react-app/package.json
- useStore
- App
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- dialog.ts
- Mi Tiendita
- AGENTS.md
- lightbox.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- core.ts
- App.tsx
- theme.ts
- Notes
- Modal
- inject-sw-version.mjs
- ThreadPanel
- store.tsx
- types.ts
- sync.test.ts
- TagModal.tsx
- markNoteDeleted
- SaleRegistration
- saleUnitPrice

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
10. `SaleRegistration()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `removeItemFromChecklist()` --calls--> `removeChecklistItem()`  [EXTRACTED]
  react-app/src/views/Notes.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts
- `doSignIn()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/AuthLanding.tsx → react-app/src/lib/sync.ts

## Import Cycles
- None detected.

## Communities (33 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.06
Nodes (92): compressImage(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedStores(), forgetDeletedStore(), isStoreOwner(), mergeCostEntries(), mergeInvLog() (+84 more)

### Community 2 - "ProductForm.tsx"
Cohesion: 0.10
Nodes (41): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), DEFAULT_PRODUCT_TAG, EditablePromo, ensureCost() (+33 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.08
Nodes (57): accountEnabled(), authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange() (+49 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (35): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+27 more)

### Community 5 - "useStore"
Cohesion: 0.06
Nodes (78): Dropdown(), DropdownItem, catLabel(), costFor(), DEFAULT_PRODUCT_IMAGE, esc(), findActivePromo(), formatDate() (+70 more)

### Community 6 - "App"
Cohesion: 0.21
Nodes (10): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+2 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.13
Nodes (19): BellIcon(), CargoIcon(), CheckboxOutlineIcon(), ChecklistIcon(), confirmDialog(), DownloadIcon(), GearMenu(), HomeIcon() (+11 more)

### Community 12 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

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
Cohesion: 0.12
Nodes (17): CategoryGroup, costEntryKey(), costTotal(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, DeletedStoreRecord (+9 more)

### Community 20 - "App.tsx"
Cohesion: 0.13
Nodes (14): DEV_LOGO, TAB_ICONS, askSwVersion(), useAppVersion(), ASSETS, preloadDevAssets(), CalendarIcon(), CatalogIcon() (+6 more)

### Community 21 - "theme.ts"
Cohesion: 0.17
Nodes (15): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themeOptions(), themePref (+7 more)

### Community 22 - "Notes"
Cohesion: 0.15
Nodes (13): canDeleteNote(), canManageNotes(), canManageTeam(), deleteNoteMsg(), toggleChecklistItem(), toggleNotePin(), requestNotifyPermission(), Notes() (+5 more)

### Community 23 - "Modal"
Cohesion: 0.25
Nodes (9): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory(), Modal(), JoinModal() (+1 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "ThreadPanel"
Cohesion: 0.24
Nodes (14): addChecklistItem(), canEditNote(), deleteNoteReply(), editChecklistNote(), editNoteMsg(), editNoteReply(), findNote(), removeChecklistItem() (+6 more)

### Community 26 - "store.tsx"
Cohesion: 0.12
Nodes (27): NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt() (+19 more)

### Community 27 - "types.ts"
Cohesion: 0.17
Nodes (11): InvLogRow, CategoryPricing, CostEntry, InventoryLogEntry, NoteChecklistItem, NoteEditRecord, NoteEntry, Promo (+3 more)

### Community 28 - "sync.test.ts"
Cohesion: 0.14
Nodes (22): loadState(), makeDraft(), normalizeStore(), uid(), Ctx, renderLanding(), addTag(), setup() (+14 more)

### Community 29 - "TagModal.tsx"
Cohesion: 0.33
Nodes (9): insertTagSorted(), removeStoreTag(), renameStoreTag(), storeTags(), Props, TagModal(), add(), commitRename() (+1 more)

### Community 30 - "markNoteDeleted"
Cohesion: 0.29
Nodes (8): clearDeletedNotes(), deletedNotesKey(), getDeletedNoteIds(), isNoteDeleted(), markNoteDeleted(), migrateNoteLogToBoard(), sweepExpiredNotes(), sweep()

### Community 31 - "SaleRegistration"
Cohesion: 0.12
Nodes (21): activeEvent(), customConfirm(), StoreEvent, removeCategory(), removeProduct(), blankEvent(), Events(), finalize() (+13 more)

### Community 32 - "saleUnitPrice"
Cohesion: 0.60
Nodes (5): fixedPackageTotal(), promoPrice(), promoUnitReward(), round2(), saleUnitPrice()

## Knowledge Gaps
- **118 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+113 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 156 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `sync.ts`, `ProductForm.tsx`, `SettingsModal.tsx`, `react-app/package.json`, `ui.tsx`, `App.tsx`, `theme.ts`, `Modal`, `store.tsx`, `sync.test.ts`, `TagModal.tsx`, `SaleRegistration`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `sync.ts`, `ProductForm.tsx`, `SettingsModal.tsx`, `App`, `ui.tsx`, `App.tsx`, `Notes`, `Modal`, `ThreadPanel`, `store.tsx`, `TagModal.tsx`, `SaleRegistration`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `ProductForm.tsx`, `core.ts`, `App.tsx`, `useStore`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _118 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06338185890257558 - nodes in this community are weakly interconnected._
- **Should `ProductForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1026827012025902 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08198757763975155 - nodes in this community are weakly interconnected._