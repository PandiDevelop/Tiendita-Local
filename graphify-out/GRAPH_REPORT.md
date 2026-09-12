# Graph Report - repo-local  (2026-09-12)

## Corpus Check
- 55 files · ~317,663 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 620 nodes · 1852 edges · 27 communities (21 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `07326c60`
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
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- DevThemes.tsx
- Mi Tiendita
- AGENTS.md
- useStore
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- lightbox.ts
- ui.tsx
- theme.ts
- Inventory.tsx
- pushOverlay
- inject-sw-version.mjs
- preload.ts
- dialog.ts

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 41 edges
2. `useStore()` - 35 edges
3. `syncName()` - 34 edges
4. `uid()` - 30 edges
5. `esc()` - 28 edges
6. `Inventory()` - 26 edges
7. `Notes()` - 25 edges
8. `SaleRegistration()` - 25 edges
9. `react` - 24 edges
10. `applyRemote()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `bump()` --calls--> `adoptInvLog()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts
- `App()` --calls--> `useAppVersion()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/appVersion.ts
- `App()` --calls--> `pushOverlay()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/backStack.ts

## Import Cycles
- None detected.

## Communities (27 total, 5 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.06
Nodes (94): clearDeletedNotes(), compressImage(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds() (+86 more)

### Community 2 - "core.ts"
Cohesion: 0.07
Nodes (55): adoptInvLog(), CategoryGroup, costEntryKey(), costTotal(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds (+47 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.13
Nodes (25): askSwVersion(), useAppVersion(), canManageNotes(), DeletedStoreRecord, BeforeInstallPromptEvent, isStandalone(), useInstallable(), enablePushForStore() (+17 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "App"
Cohesion: 0.21
Nodes (10): App(), selectStore(), setMenu(), useScrollAxisLock(), canManageTeam(), consumeDeepNote(), initDeepLink(), readDeepTab() (+2 more)

### Community 6 - "store.tsx"
Cohesion: 0.06
Nodes (52): CLIENT_KEY, DEFAULT_PRODUCT_TAG, InvLogRow, NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert() (+44 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.09
Nodes (45): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), canDeleteNote(), canEditNote(), deleteNoteMsg() (+37 more)

### Community 12 - "DevThemes.tsx"
Cohesion: 0.31
Nodes (7): setThemePref(), DEV_THEMES, DevThemesModal(), tryPass(), devUnlocked(), Stage, unlockDev()

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "useStore"
Cohesion: 0.08
Nodes (50): activeEvent(), catLabel(), costFor(), esc(), findActivePromo(), formatDate(), itemLabel(), money() (+42 more)

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
Cohesion: 0.14
Nodes (20): DEV_LOGO, TAB_ICONS, BoxIcon(), CalendarIcon(), CartIcon(), CashIcon(), CatalogIcon(), ChartIcon() (+12 more)

### Community 21 - "theme.ts"
Cohesion: 0.39
Nodes (6): applyTheme(), ensureSystemListener(), resolvedTheme(), systemDark(), THEME_CHROME, THEMES

### Community 22 - "Inventory.tsx"
Cohesion: 0.07
Nodes (49): Dropdown(), DropdownItem, DEFAULT_PRODUCT_IMAGE, getSupplierInfo(), groupedByCategory(), inventorySold(), productTags(), promoText() (+41 more)

### Community 23 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 28 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

## Knowledge Gaps
- **113 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+108 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 149 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `ui.tsx` to `sync.ts`, `core.ts`, `SettingsModal.tsx`, `react-app/package.json`, `store.tsx`, `Notes.tsx`, `DevThemes.tsx`, `useStore`, `theme.ts`, `Inventory.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `useStore` to `Notes.tsx`, `core.ts`, `ui.tsx`, `Inventory.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _113 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05970790378006873 - nodes in this community are weakly interconnected._
- **Should `core.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06648575305291723 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._