# Graph Report - repo-local  (2026-09-16)

## Corpus Check
- 60 files · ~347,720 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 678 nodes · 2084 edges · 27 communities (21 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0095e20e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync.ts
- Inventory.tsx
- SettingsModal.tsx
- react-app/package.json
- App
- theme.ts
- compilerOptions
- Notes.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- SaleRegistration
- Mi Tiendita
- AGENTS.md
- core.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- lightbox.ts
- ui.tsx
- sync.test.ts
- pushOverlay
- inject-sw-version.mjs
- store.tsx
- dialog.ts
- preload.ts

## God Nodes (most connected - your core abstractions)
1. `syncClientId()` - 43 edges
2. `useStore()` - 37 edges
3. `syncName()` - 34 edges
4. `esc()` - 32 edges
5. `uid()` - 31 edges
6. `SettingsModal()` - 28 edges
7. `Inventory()` - 26 edges
8. `Notes()` - 26 edges
9. `react` - 25 edges
10. `SaleRegistration()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts
- `App()` --calls--> `pushOverlay()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/backStack.ts

## Import Cycles
- None detected.

## Communities (27 total, 5 thin omitted)

### Community 0 - "sync.ts"
Cohesion: 0.07
Nodes (88): clearDeletedNotes(), deletedNoteIdsOf(), deletedNotesKey(), deletedStores(), forgetDeletedStore(), getDeletedNoteIds(), isNoteDeleted(), markNoteDeleted() (+80 more)

### Community 2 - "Inventory.tsx"
Cohesion: 0.05
Nodes (85): Dropdown(), DropdownItem, adoptInvLog(), compressImage(), DEFAULT_PRODUCT_IMAGE, EditablePromo, ensureCost(), esc() (+77 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.09
Nodes (49): accountEnabled(), authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange() (+41 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (37): dependencies, firebase, react, react-dom, devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react (+29 more)

### Community 5 - "App"
Cohesion: 0.17
Nodes (12): App(), selectStore(), setMenu(), useScrollAxisLock(), askSwVersion(), useAppVersion(), consumeDeepNote(), initDeepLink() (+4 more)

### Community 6 - "theme.ts"
Cohesion: 0.17
Nodes (15): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themeOptions(), themePref (+7 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "Notes.tsx"
Cohesion: 0.09
Nodes (48): addChecklistItem(), addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), canDeleteNote(), canEditNote(), canManageNotes() (+40 more)

### Community 12 - "SaleRegistration"
Cohesion: 0.23
Nodes (10): saleCatsOf(), SaleRegistration(), addLine(), catUnits(), persist(), recomputeAutos(), removeLine(), setLine() (+2 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "core.ts"
Cohesion: 0.05
Nodes (76): activeEvent(), canManageTeam(), CategoryGroup, catLabel(), costEntryKey(), costFor(), costTotal(), dedupeCosts() (+68 more)

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
Cohesion: 0.09
Nodes (27): DEV_LOGO, TAB_ICONS, BellIcon(), BoxIcon(), CalendarIcon(), CatalogIcon(), CategorySuggest(), ChartIcon() (+19 more)

### Community 21 - "sync.test.ts"
Cohesion: 0.11
Nodes (26): DEFAULT_PRODUCT_TAG, findCostId(), loadState(), makeDraft(), migrateNoteLogToBoard(), normalizePromo(), normalizeStore(), sortByOrder() (+18 more)

### Community 23 - "pushOverlay"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 26 - "store.tsx"
Cohesion: 0.12
Nodes (27): NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildTxt(), exportNotesArchiveTxt(), exportObjectivesArchiveTxt() (+19 more)

### Community 28 - "dialog.ts"
Cohesion: 0.27
Nodes (9): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog(), subscribeDialog() (+1 more)

## Knowledge Gaps
- **117 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+112 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 155 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inventory.tsx` to `SettingsModal.tsx`, `react-app/package.json`, `App`, `theme.ts`, `Notes.tsx`, `core.ts`, `ui.tsx`, `sync.test.ts`, `store.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `useStore()` connect `Inventory.tsx` to `sync.ts`, `SettingsModal.tsx`, `App`, `Notes.tsx`, `SaleRegistration`, `core.ts`, `ui.tsx`, `store.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `SaleRegistration()` connect `SaleRegistration` to `Notes.tsx`, `Inventory.tsx`, `ui.tsx`, `core.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _117 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06741573033707865 - nodes in this community are weakly interconnected._
- **Should `Inventory.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05227781926811053 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0912568306010929 - nodes in this community are weakly interconnected._