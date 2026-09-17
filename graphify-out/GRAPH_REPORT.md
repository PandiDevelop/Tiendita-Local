# Graph Report - Web  (2026-09-16)

## Corpus Check
- 66 files · ~350,738 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 701 nodes · 2184 edges · 25 communities (20 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1bff2ed3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- App
- SettingsModal.tsx
- react-app/package.json
- dialog.ts
- DevThemes.tsx
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- lightbox.ts
- Mi Tiendita
- AGENTS.md
- react
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- backStack.ts
- core.ts
- inject-sw-version.mjs
- store.tsx
- useStore
- SaleRegistration.tsx

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 43 edges
2. `useStore()` - 41 edges
3. `esc()` - 34 edges
4. `syncName()` - 34 edges
5. `uid()` - 31 edges
6. `SettingsModal()` - 28 edges
7. `react` - 26 edges
8. `Notes()` - 26 edges
9. `SaleRegistration()` - 26 edges
10. `Inventory()` - 25 edges

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

## Communities (25 total, 4 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (88): clearDeletedNotes(), compressImage(), costEntryKey(), dedupeCosts(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey(), deletedStores() (+80 more)

### Community 2 - "App"
Cohesion: 0.23
Nodes (9): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+1 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.07
Nodes (70): accountEnabled(), authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange() (+62 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.06
Nodes (36): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+28 more)

### Community 5 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

### Community 6 - "DevThemes.tsx"
Cohesion: 0.18
Nodes (15): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themeOptions(), themePref (+7 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.10
Nodes (25): DEV_LOGO, TAB_ICONS, ASSETS, preloadDevAssets(), BoxIcon(), CalendarIcon(), CargoIcon(), CatalogIcon() (+17 more)

### Community 12 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "react"
Cohesion: 0.67
Nodes (3): askSwVersion(), useAppVersion(), react

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 21 - "backStack.ts"
Cohesion: 0.18
Nodes (13): ENTRY, hasOverlay(), popOverlay(), pushOverlay(), realUrl(), stack, syncHistory(), BackButtonApp (+5 more)

### Community 22 - "core.ts"
Cohesion: 0.05
Nodes (94): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), canDeleteNote(), canEditNote() (+86 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 26 - "store.tsx"
Cohesion: 0.05
Nodes (60): CategoryGroup, InvLogRow, makeDraft(), NOTE_TTL_MS, saveState(), sortByOrder(), archiveMarkGone(), archiveRows() (+52 more)

### Community 27 - "useStore"
Cohesion: 0.05
Nodes (75): costFor(), costTotal(), esc(), formatDate(), groupedByCategory(), insertTagSorted(), inventorySold(), itemLabel() (+67 more)

### Community 31 - "SaleRegistration.tsx"
Cohesion: 0.07
Nodes (36): Dropdown(), DropdownItem, activeEvent(), catLabel(), findActivePromo(), fixedPackageTotal(), promoPrice(), promoUnitReward() (+28 more)

## Knowledge Gaps
- **122 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 161 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `sync.ts`, `SettingsModal.tsx`, `react-app/package.json`, `DevThemes.tsx`, `ui.tsx`, `backStack.ts`, `core.ts`, `store.tsx`, `useStore`, `SaleRegistration.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `sync.ts`, `App`, `SettingsModal.tsx`, `ui.tsx`, `core.ts`, `store.tsx`, `SaleRegistration.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration.tsx` to `ui.tsx`, `useStore`, `core.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06626506024096386 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05547652916073969 - nodes in this community are weakly interconnected._