# Graph Report - repo-local  (2026-09-15)

## Corpus Check
- 59 files · ~345,654 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 663 nodes · 2035 edges · 34 communities (29 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `21761f88`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- Dashboard.tsx
- SettingsModal.tsx
- react-app/package.json
- App
- react
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- core.ts
- Mi Tiendita
- AGENTS.md
- SaleRegistration
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- lightbox.ts
- ui.tsx
- features.test.tsx
- Inventory.tsx
- pushOverlay
- inject-sw-version.mjs
- sync.test.ts
- store.tsx
- types.ts
- dialog.ts
- Profit.tsx
- StoreModal.tsx
- History.tsx
- Employees.tsx
- Modal

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 43 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 31 edges
5. `esc()` - 28 edges
6. `SettingsModal()` - 28 edges
7. `Inventory()` - 26 edges
8. `Notes()` - 26 edges
9. `SaleRegistration()` - 25 edges
10. `react` - 24 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `submit()` --calls--> `syncSetName()`  [EXTRACTED]
  react-app/src/views/Join.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `App()` --calls--> `pushOverlay()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/backStack.ts

## Import Cycles
- None detected.

## Communities (34 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (80): clearDeletedNotes(), deletedNoteIdsOf(), deletedNotesKey(), DeletedStoreRecord, deletedStores(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted() (+72 more)

### Community 2 - "Dashboard.tsx"
Cohesion: 0.25
Nodes (10): SaleItem, CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel(), monthLines() (+2 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.11
Nodes (41): accountEnabled(), authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), registerAccount() (+33 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "App"
Cohesion: 0.18
Nodes (11): App(), selectStore(), setMenu(), useScrollAxisLock(), askSwVersion(), useAppVersion(), initDeepLink(), readDeepTab() (+3 more)

### Community 6 - "react"
Cohesion: 0.16
Nodes (16): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themeOptions(), themePref (+8 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.09
Nodes (53): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), canDeleteNote(), canEditNote(), canManageNotes() (+45 more)

### Community 12 - "core.ts"
Cohesion: 0.16
Nodes (13): costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, InvLogRow, KEY, sortByOrder() (+5 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "SaleRegistration"
Cohesion: 0.11
Nodes (24): activeEvent(), catLabel(), fixedPackageTotal(), promoPrice(), promoUnitReward(), round2(), saleUnitPrice(), StoreEvent (+16 more)

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
Nodes (23): DEV_LOGO, TAB_ICONS, ASSETS, preloadDevAssets(), BellIcon(), BoxIcon(), CalendarIcon(), CatalogIcon() (+15 more)

### Community 21 - "features.test.tsx"
Cohesion: 0.20
Nodes (11): DEFAULT_PRODUCT_TAG, makeDraft(), AppCtx, ModalKind, addTag(), setup(), fieldControl(), makeProduct() (+3 more)

### Community 22 - "Inventory.tsx"
Cohesion: 0.06
Nodes (74): Dropdown(), DropdownItem, adoptInvLog(), CategoryGroup, DEFAULT_PRODUCT_IMAGE, EditablePromo, ensureCost(), esc() (+66 more)

### Community 23 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "sync.test.ts"
Cohesion: 0.20
Nodes (10): costTotal(), findCostId(), Ctx, apply(), Device, makePayload(), newStore(), AppState (+2 more)

### Community 26 - "store.tsx"
Cohesion: 0.13
Nodes (31): onAccountChange(), loadState(), NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt() (+23 more)

### Community 27 - "types.ts"
Cohesion: 0.17
Nodes (11): CategoryPricing, Note, NoteArchiveEntry, NoteChecklistItem, NoteEditRecord, NoteEntry, NotifCat, Promo (+3 more)

### Community 28 - "dialog.ts"
Cohesion: 0.24
Nodes (10): customAlert(), DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog() (+2 more)

### Community 29 - "Profit.tsx"
Cohesion: 0.39
Nodes (8): costFor(), priceFor(), profitTotal(), PLine, Profit(), profitLines(), RangeMode, ViewMode

### Community 30 - "StoreModal.tsx"
Cohesion: 0.16
Nodes (18): canManageTeam(), compressImage(), DEFAULT_STORE_IMAGE, isStoreOwner(), myRole(), syncGenPin(), removeMemberFn(), setMemberRoleFn() (+10 more)

### Community 31 - "History.tsx"
Cohesion: 0.43
Nodes (7): formatDate(), pad2(), saleUnits(), shortDate(), total(), DownloadIcon(), History()

### Community 32 - "Employees.tsx"
Cohesion: 0.38
Nodes (6): itemLabel(), Member, Role, EmpAcc, Employees(), roleLabel()

### Community 33 - "Modal"
Cohesion: 0.50
Nodes (3): Modal(), JoinModal(), submit()

## Knowledge Gaps
- **116 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 154 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Employees.tsx`, `Modal`, `SettingsModal.tsx`, `react-app/package.json`, `App`, `Notes.tsx`, `SaleRegistration`, `ui.tsx`, `features.test.tsx`, `Inventory.tsx`, `store.tsx`, `Profit.tsx`, `StoreModal.tsx`, `History.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `Notes.tsx`, `ui.tsx`, `core.ts`, `Inventory.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _116 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06955736224028906 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11058823529411765 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._