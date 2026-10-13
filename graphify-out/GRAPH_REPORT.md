# Graph Report - Web  (2026-10-13)

## Corpus Check
- 74 files · ~368,734 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 800 nodes · 2483 edges · 44 communities (39 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `823a36ca`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- syncName
- useStore
- SettingsModal.tsx
- react-app/package.json
- main.tsx
- sync.test.ts
- compilerOptions
- App.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- App
- Mi Tiendita
- AGENTS.md
- sync.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- Notes
- notesArchive.ts
- ui.tsx
- deploy-web.mjs
- DevThemes.tsx
- inject-sw-version.mjs
- core.ts
- adoptInvLog
- SaleRegistration.tsx
- nativeBack.ts
- dialog.ts
- store.tsx
- History.tsx
- devDependencies
- dependencies
- Dashboard.tsx
- types.ts
- today
- testUtils.tsx
- lightbox.ts
- install.ts
- backStack.ts
- PromoEditor.tsx
- sound.ts
- scripts

## God Nodes (most connected - your core abstractions)
1. `useStore()` - 43 edges
2. `syncClientId()` - 40 edges
3. `esc()` - 36 edges
4. `syncName()` - 36 edges
5. `SettingsModal()` - 33 edges
6. `uid()` - 30 edges
7. `applyRemote()` - 29 edges
8. `SaleRegistration()` - 29 edges
9. `react` - 27 edges
10. `AppProvider()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts
- `doSignIn()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/AuthLanding.tsx → react-app/src/lib/sync.ts
- `App()` --calls--> `useAppVersion()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/appVersion.ts

## Import Cycles
- None detected.

## Communities (44 total, 4 thin omitted)

### Community 0 - "syncName"
Cohesion: 0.27
Nodes (17): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), syncName(), timeNow(), uid(), notifyStorePush() (+9 more)

### Community 2 - "useStore"
Cohesion: 0.05
Nodes (86): costFor(), DEFAULT_PRODUCT_IMAGE, DEFAULT_PRODUCT_TAG, esc(), fromEditablePromos(), getSupplierInfo(), groupedByCategory(), insertCatSorted() (+78 more)

### Community 3 - "SettingsModal.tsx"
Cohesion: 0.07
Nodes (71): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, linkStoresToAccount(), onAccountChange(), registerAccount() (+63 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.11
Nodes (19): name, private, type, version, initNativePlugins(), @capacitor/app, @capacitor/push-notifications, @capgo/capacitor-updater (+11 more)

### Community 5 - "main.tsx"
Cohesion: 0.19
Nodes (11): CapgoGlobal, initCapUpdater(), UpdaterPlugin, applyOnce(), CapgoGlobal, cmpVersions(), initOtaUpdate(), LatestBundle (+3 more)

### Community 6 - "sync.test.ts"
Cohesion: 0.11
Nodes (21): BACKUP_FORMAT, backupFileName(), buildBackup(), downloadBackup(), parseBackup(), ParsedBackup, PRIVATE_FIELDS, SaveFileHandle (+13 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "App.tsx"
Cohesion: 0.12
Nodes (17): capFirst(), DEV_LOGO, MenuClock(), TAB_ICONS, askSwVersion(), useAppVersion(), ASSETS, preloadDevAssets() (+9 more)

### Community 12 - "App"
Cohesion: 0.23
Nodes (9): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+1 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "sync.ts"
Cohesion: 0.06
Nodes (103): mergeBackupInto(), clearDeletedProducts(), clearDeletedSales(), compressImage(), DEFAULT_STORE_IMAGE, deletedNoteIdsOf(), deletedProductIdsOf(), deletedSaleIdsOf() (+95 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "Notes"
Cohesion: 0.13
Nodes (22): canDeleteNote(), canEditNote(), canManageNotes(), deleteNoteMsg(), deleteNoteReply(), editChecklistNote(), editNoteMsg(), editNoteReply() (+14 more)

### Community 20 - "notesArchive.ts"
Cohesion: 0.29
Nodes (14): archiveMarkGone(), archiveRows(), archiveUpsert(), buildJson(), exportNotesArchiveJson(), exportObjectivesArchiveJson(), loadArchive(), noteArchiveText() (+6 more)

### Community 21 - "ui.tsx"
Cohesion: 0.17
Nodes (14): BellIcon(), CategorySuggest(), CheckboxOutlineIcon(), ChecklistIcon(), GearMenu(), ImagePicker(), NoteTextIcon(), PinIcon() (+6 more)

### Community 22 - "deploy-web.mjs"
Cohesion: 0.40
Nodes (4): dist, entries, here, root

### Community 23 - "DevThemes.tsx"
Cohesion: 0.20
Nodes (16): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themeOptions(), themePref (+8 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "core.ts"
Cohesion: 0.09
Nodes (29): CategoryGroup, clearDeletedNotes(), costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, deletedNotesKey() (+21 more)

### Community 26 - "adoptInvLog"
Cohesion: 0.36
Nodes (12): adoptInvLog(), ensureCost(), getSupplierCost(), insertProductAlphabetically(), nextSuppTag(), recordSupplierPrice(), setSupplierCost(), supplierKey() (+4 more)

### Community 27 - "SaleRegistration.tsx"
Cohesion: 0.12
Nodes (25): Dropdown(), DropdownItem, catLabel(), findActivePromo(), productPromos(), saleCatsOf(), saleUnitPrice(), shortTag() (+17 more)

### Community 28 - "nativeBack.ts"
Cohesion: 0.15
Nodes (8): hasOverlay(), BackButtonApp, CapacitorGlobal, initNativeBack(), isNativeApp(), SavedFile, CapHolder, Listener

### Community 29 - "dialog.ts"
Cohesion: 0.18
Nodes (13): customConfirm(), DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog() (+5 more)

### Community 30 - "store.tsx"
Cohesion: 0.20
Nodes (11): loadState(), NOTE_TTL_MS, saveState(), replyToArchiveEntry(), SyncHandle, AppCtx, Ctx, ModalKind (+3 more)

### Community 31 - "History.tsx"
Cohesion: 0.24
Nodes (11): canManageTeam(), formatDate(), pad2(), saleUnits(), shortDate(), total(), confirmDialog(), DownloadIcon() (+3 more)

### Community 32 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react, @types/react, @types/react-dom, typescript, vite (+3 more)

### Community 33 - "dependencies"
Cohesion: 0.25
Nodes (8): dependencies, @capacitor/app, @capacitor/filesystem, @capacitor/push-notifications, @capgo/capacitor-updater, firebase, react, react-dom

### Community 34 - "Dashboard.tsx"
Cohesion: 0.22
Nodes (12): SaleItem, BoxIcon(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel() (+4 more)

### Community 35 - "types.ts"
Cohesion: 0.17
Nodes (11): CategoryPricing, NoteArchiveEntry, NoteChecklistItem, NoteEditRecord, NoteEntry, NoteReply, NotifCat, Promo (+3 more)

### Community 36 - "today"
Cohesion: 0.44
Nodes (7): activeEvent(), today(), blankEvent(), Events(), finalize(), openAdding(), patch()

### Community 37 - "testUtils.tsx"
Cohesion: 0.46
Nodes (6): makeDraft(), renderLanding(), setup(), makeState(), makeStore(), TestProvider()

### Community 38 - "lightbox.ts"
Cohesion: 0.36
Nodes (7): closeLightbox(), emit(), Listener, listeners, openLightbox(), subscribeLightbox(), ImageLightboxHost()

### Community 39 - "install.ts"
Cohesion: 0.50
Nodes (3): BeforeInstallPromptEvent, isStandalone(), useInstallable()

### Community 40 - "backStack.ts"
Cohesion: 0.48
Nodes (6): ENTRY, popOverlay(), pushOverlay(), realUrl(), stack, syncHistory()

### Community 41 - "PromoEditor.tsx"
Cohesion: 0.38
Nodes (4): EditablePromo, blank(), PromoEditor(), Props

### Community 42 - "sound.ts"
Cohesion: 0.43
Nodes (6): ctx(), notifyPermission(), playNoteChime(), showSystemNotification(), softVibrate(), tone()

### Community 43 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, deploy, dev, preview, test

## Knowledge Gaps
- **146 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+141 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 195 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useStore` to `SettingsModal.tsx`, `react-app/package.json`, `main.tsx`, `testUtils.tsx`, `install.ts`, `App.tsx`, `today`, `sync.ts`, `ui.tsx`, `DevThemes.tsx`, `SaleRegistration.tsx`, `store.tsx`, `History.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `syncName`, `Dashboard.tsx`, `SettingsModal.tsx`, `today`, `App.tsx`, `App`, `sync.ts`, `Notes`, `ui.tsx`, `SaleRegistration.tsx`, `store.tsx`, `History.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `SettingsModal()` connect `SettingsModal.tsx` to `syncName`, `useStore`, `sync.test.ts`, `App.tsx`, `sync.ts`, `Notes`, `notesArchive.ts`, `DevThemes.tsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _146 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useStore` be split into smaller, more focused modules?**
  _Cohesion score 0.05382485289027345 - nodes in this community are weakly interconnected._
- **Should `SettingsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06638655462184874 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11255411255411256 - nodes in this community are weakly interconnected._