# Graph Report - Web  (2026-10-13)

## Corpus Check
- 74 files · ~370,100 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 805 nodes · 2502 edges · 41 communities (36 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `68143966`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Inventory.tsx
- Catalog.tsx
- account.ts
- react-app/package.json
- store.tsx
- features.test.tsx
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- History.tsx
- Mi Tiendita
- AGENTS.md
- sync.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- Notes.tsx
- notesArchive.ts
- TagModal.tsx
- deploy-web.mjs
- DevThemes.tsx
- inject-sw-version.mjs
- SettingsModal.tsx
- sync.test.ts
- SaleRegistration.tsx
- account.test.ts
- backup.ts
- useStore
- core.ts
- Dashboard.tsx
- Profit.tsx
- settings.ts
- PromoEditor.tsx
- AuthLanding
- push.ts
- App
- install.ts
- dialog.ts

## God Nodes (most connected - your core abstractions)
1. `useStore()` - 43 edges
2. `syncClientId()` - 41 edges
3. `esc()` - 36 edges
4. `syncName()` - 36 edges
5. `SettingsModal()` - 33 edges
6. `uid()` - 30 edges
7. `applyRemote()` - 29 edges
8. `SaleRegistration()` - 29 edges
9. `react` - 27 edges
10. `AppProvider()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `doReset()` --calls--> `sendPasswordReset()`  [EXTRACTED]
  react-app/src/views/AuthLanding.tsx → react-app/src/lib/account.ts
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `register()` --indirect_call--> `total()`  [INFERRED]
  react-app/src/views/SaleRegistration.tsx → react-app/src/lib/core.ts
- `doSignIn()` --indirect_call--> `attach()`  [INFERRED]
  react-app/src/views/AuthLanding.tsx → react-app/src/lib/sync.ts
- `App()` --calls--> `useAppVersion()`  [EXTRACTED]
  react-app/src/App.tsx → react-app/src/lib/appVersion.ts

## Import Cycles
- None detected.

## Communities (41 total, 4 thin omitted)

### Community 0 - "Inventory.tsx"
Cohesion: 0.06
Nodes (80): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), adoptInvLog(), compressImage(), DEFAULT_PRODUCT_IMAGE, ensureCost() (+72 more)

### Community 2 - "Catalog.tsx"
Cohesion: 0.17
Nodes (13): DropdownItem, pushOverlay(), groupedByCategory(), CaretIcon(), CargoIcon(), GearMenu(), HScroll(), PrintIcon() (+5 more)

### Community 3 - "account.ts"
Cohesion: 0.23
Nodes (23): authMessage(), currentIdentity(), emit(), initAccountAuth(), LinkResult, registerAccount(), sendPasswordReset(), signInAccount() (+15 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.05
Nodes (42): dependencies, @capacitor/app, @capacitor/filesystem, @capacitor/push-notifications, @capgo/capacitor-updater, firebase, react, react-dom (+34 more)

### Community 5 - "store.tsx"
Cohesion: 0.13
Nodes (19): CategoryGroup, InvLogRow, NOTE_TTL_MS, saveState(), SyncHandle, Ctx, AppState, CategoryPricing (+11 more)

### Community 6 - "features.test.tsx"
Cohesion: 0.16
Nodes (14): DEFAULT_PRODUCT_TAG, AppCtx, ModalKind, renderLanding(), addTag(), saleStore(), setup(), fieldControl() (+6 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.11
Nodes (28): capFirst(), DEV_LOGO, MenuClock(), TAB_ICONS, resolveDialog(), subscribeDialog(), closeLightbox(), emit() (+20 more)

### Community 12 - "History.tsx"
Cohesion: 0.18
Nodes (17): canManageTeam(), findActivePromo(), formatDate(), itemLabel(), money(), productPromos(), saleUnits(), shortDate() (+9 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "sync.ts"
Cohesion: 0.06
Nodes (97): clearDeletedNotes(), clearDeletedProducts(), clearDeletedSales(), deletedNoteIdsOf(), deletedNotesKey(), deletedProductIdsOf(), deletedSaleIdsOf(), deletedStores() (+89 more)

### Community 16 - "index.js"
Cohesion: 0.36
Nodes (10): base64UrlFromBytes(), base64UrlFromString(), corsHeaders(), fetch(), getAccessToken(), jsonResponse(), pemToArrayBuffer(), readStorePushData() (+2 more)

### Community 17 - "push-worker/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, wrangler, name, private, scripts, deploy, dev, wrangler

### Community 18 - "Avisos push reales para Mi Tiendita (con la app cerrada del todo)"
Cohesion: 0.25
Nodes (7): Avisos push reales para Mi Tiendita (con la app cerrada del todo), Costos, ¿Cómo sé si quedó bien?, Paso 1 — Generar la clave VAPID en Firebase, Paso 2 — Descargar la cuenta de servicio, Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker, Paso 4 — Conectar la URL del Worker con la app

### Community 19 - "Notes.tsx"
Cohesion: 0.07
Nodes (43): canDeleteNote(), canEditNote(), deleteNoteMsg(), deleteNoteReply(), editChecklistNote(), editNoteMsg(), editNoteReply(), findNote() (+35 more)

### Community 20 - "notesArchive.ts"
Cohesion: 0.06
Nodes (41): ENTRY, hasOverlay(), popOverlay(), realUrl(), stack, syncHistory(), CapgoGlobal, initCapUpdater() (+33 more)

### Community 21 - "TagModal.tsx"
Cohesion: 0.33
Nodes (9): insertTagSorted(), removeStoreTag(), renameStoreTag(), storeTags(), Props, TagModal(), add(), commitRename() (+1 more)

### Community 22 - "deploy-web.mjs"
Cohesion: 0.40
Nodes (4): dist, entries, here, root

### Community 23 - "DevThemes.tsx"
Cohesion: 0.21
Nodes (15): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themePref, THEMES (+7 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "SettingsModal.tsx"
Cohesion: 0.13
Nodes (20): onAccountChange(), askSwVersion(), useAppVersion(), mergeBackupInto(), parseBackup(), canManageNotes(), DeletedStoreRecord, renameMeInAllStoresFn() (+12 more)

### Community 26 - "sync.test.ts"
Cohesion: 0.14
Nodes (12): costTotal(), findCostId(), loadState(), makeDraft(), migrateNoteLogToBoard(), normalizeStore(), addProduct(), apply() (+4 more)

### Community 27 - "SaleRegistration.tsx"
Cohesion: 0.13
Nodes (22): Dropdown(), activeEvent(), catLabel(), saleCatsOf(), saleUnitPrice(), shortTag(), SaleItem, ReceiptIcon() (+14 more)

### Community 28 - "account.test.ts"
Cohesion: 0.24
Nodes (11): linkStoresToAccount(), ACCOUNT_KEY, accountEmail(), accountName(), legacyAccountIds(), rememberLegacyId(), sessionActive(), CLIENT_KEY (+3 more)

### Community 29 - "backup.ts"
Cohesion: 0.22
Nodes (11): BACKUP_FORMAT, backupFileName(), buildBackup(), downloadBackup(), ParsedBackup, PRIVATE_FIELDS, SaveFileHandle, saveNativeBackup() (+3 more)

### Community 30 - "useStore"
Cohesion: 0.17
Nodes (16): DEFAULT_STORE_IMAGE, esc(), numText(), toEditablePromos(), useStore(), Member, Role, CloseIcon() (+8 more)

### Community 31 - "core.ts"
Cohesion: 0.11
Nodes (23): costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, deletedProductIds, deletedSaleIds, deviceId() (+15 more)

### Community 32 - "Dashboard.tsx"
Cohesion: 0.23
Nodes (12): total(), BoxIcon(), CartIcon(), CashIcon(), ChevronIcon(), Dashboard(), Line, monthLabel() (+4 more)

### Community 33 - "Profit.tsx"
Cohesion: 0.38
Nodes (10): costFor(), inventorySold(), priceFor(), productLedger(), profitTotal(), PLine, Profit(), profitLines() (+2 more)

### Community 34 - "settings.ts"
Cohesion: 0.42
Nodes (7): notifCatEnabled(), notifCats(), notifyEnabled(), setNotifCat(), setNotifyEnabled(), onVisible(), toggleCat()

### Community 35 - "PromoEditor.tsx"
Cohesion: 0.38
Nodes (4): EditablePromo, blank(), PromoEditor(), Props

### Community 36 - "AuthLanding"
Cohesion: 0.50
Nodes (4): AuthLanding(), doRegister(), doReset(), go()

### Community 37 - "push.ts"
Cohesion: 0.26
Nodes (14): disablePushForStore(), enablePushForStore(), ensurePushToken(), getMessagingInstance(), initNativePush(), NativePush, nativePushPlugin(), nextNativeToken() (+6 more)

### Community 38 - "App"
Cohesion: 0.40
Nodes (4): App(), selectStore(), setMenu(), useScrollAxisLock()

### Community 39 - "install.ts"
Cohesion: 0.50
Nodes (3): BeforeInstallPromptEvent, isStandalone(), useInstallable()

### Community 44 - "dialog.ts"
Cohesion: 0.29
Nodes (6): DialogKind, DialogRequest, emit(), Listener, listeners, open()

## Knowledge Gaps
- **145 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+140 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 195 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Catalog.tsx` to `Inventory.tsx`, `Profit.tsx`, `account.ts`, `react-app/package.json`, `store.tsx`, `features.test.tsx`, `install.ts`, `ui.tsx`, `History.tsx`, `dialog.ts`, `Notes.tsx`, `notesArchive.ts`, `TagModal.tsx`, `DevThemes.tsx`, `SettingsModal.tsx`, `SaleRegistration.tsx`, `useStore`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `Inventory.tsx`, `Dashboard.tsx`, `Catalog.tsx`, `account.ts`, `AuthLanding`, `store.tsx`, `App`, `Profit.tsx`, `ui.tsx`, `History.tsx`, `dialog.ts`, `sync.ts`, `Notes.tsx`, `TagModal.tsx`, `SettingsModal.tsx`, `SaleRegistration.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `SettingsModal()` connect `SettingsModal.tsx` to `Inventory.tsx`, `settings.ts`, `account.ts`, `push.ts`, `ui.tsx`, `sync.ts`, `notesArchive.ts`, `DevThemes.tsx`, `account.test.ts`, `backup.ts`, `useStore`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _145 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Inventory.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.058426966292134834 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.049682875264270614 - nodes in this community are weakly interconnected._
- **Should `store.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._