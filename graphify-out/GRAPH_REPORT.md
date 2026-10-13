# Graph Report - Web  (2026-10-13)

## Corpus Check
- 74 files · ~369,538 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 803 nodes · 2494 edges · 45 communities (40 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e804355b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Inventory
- Catalog.tsx
- account.ts
- react-app/package.json
- otaUpdate.ts
- sync.test.ts
- compilerOptions
- ui.tsx
- vite-env.d.ts
- public/sw.js
- sw.js
- attach
- Mi Tiendita
- AGENTS.md
- sync.ts
- index.js
- push-worker/package.json
- Avisos push reales para Mi Tiendita (con la app cerrada del todo)
- Notes.tsx
- store.tsx
- TagModal.tsx
- deploy-web.mjs
- DevThemes.tsx
- inject-sw-version.mjs
- SettingsModal
- main.tsx
- SaleRegistration.tsx
- nativeBack.ts
- Catalog
- useStore
- core.ts
- devDependencies
- dependencies
- SettingsModal.tsx
- StoreModal
- AuthLanding.tsx
- push.ts
- App
- install.ts
- backStack.ts
- AppProvider
- push
- scripts
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
- `Dashboard()` --indirect_call--> `esc()`  [INFERRED]
  react-app/src/views/Dashboard.tsx → react-app/src/lib/core.ts
- `openCargo()` --calls--> `syncName()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `onCargoSuppBlur()` --calls--> `getSupplierInfo()`  [EXTRACTED]
  react-app/src/views/Inventory.tsx → react-app/src/lib/core.ts
- `CategoryGroup` --references--> `Product`  [EXTRACTED]
  react-app/src/lib/core.ts → react-app/src/types.ts
- `removeCategory()` --calls--> `customConfirm()`  [EXTRACTED]
  react-app/src/views/Catalog.tsx → react-app/src/lib/dialog.ts

## Import Cycles
- None detected.

## Communities (45 total, 4 thin omitted)

### Community 0 - "Inventory"
Cohesion: 0.12
Nodes (30): adoptInvLog(), ensureCost(), getSupplierCost(), insertProductAlphabetically(), nextSuppTag(), recordSupplierPrice(), setSupplierCost(), supplierKey() (+22 more)

### Community 2 - "Catalog.tsx"
Cohesion: 0.15
Nodes (21): DropdownItem, DEFAULT_PRODUCT_IMAGE, getSupplierInfo(), groupedByCategory(), productTags(), Product, CaretIcon(), CargoIcon() (+13 more)

### Community 3 - "account.ts"
Cohesion: 0.20
Nodes (24): authMessage(), emit(), initAccountAuth(), LinkResult, registerAccount(), signInAccount(), signOutAccount(), subscribers (+16 more)

### Community 4 - "react-app/package.json"
Cohesion: 0.13
Nodes (17): name, private, type, version, initNativePlugins(), @capacitor/app, @capacitor/push-notifications, @capgo/capacitor-updater (+9 more)

### Community 5 - "otaUpdate.ts"
Cohesion: 0.29
Nodes (8): applyOnce(), CapgoGlobal, cmpVersions(), initOtaUpdate(), LatestBundle, trigger(), Updater, APP_VERSION

### Community 6 - "sync.test.ts"
Cohesion: 0.06
Nodes (43): BACKUP_FORMAT, backupFileName(), buildBackup(), downloadBackup(), ParsedBackup, PRIVATE_FIELDS, SaveFileHandle, saveNativeBackup() (+35 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 8 - "ui.tsx"
Cohesion: 0.11
Nodes (27): capFirst(), DEV_LOGO, MenuClock(), TAB_ICONS, pushOverlay(), subscribeDialog(), closeLightbox(), emit() (+19 more)

### Community 12 - "attach"
Cohesion: 0.20
Nodes (23): deletedStores(), deviceId(), forgetDeletedStore(), syncGenPin(), syncKeyOf(), writerId(), customAlert(), activateSync() (+15 more)

### Community 13 - "Mi Tiendita"
Cohesion: 0.17
Nodes (11): Configurar Firebase (una sola vez, 5 minutos), Cómo se usa, Cómo usarla, Decisiones tomadas, Generar un APK, Incluye, Inventario (opcional), Mi Tiendita (+3 more)

### Community 15 - "sync.ts"
Cohesion: 0.12
Nodes (24): deletedProductIdsOf(), getDeletedProductIds(), isProductDeleted(), markProductDeleted(), mergeInvLog(), mergeItems(), mergeNoteLog(), rememberDeletedStore() (+16 more)

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
Cohesion: 0.09
Nodes (51): addChecklistNote(), addNote(), addNoteMsg(), addNoteReply(), canDeleteNote(), canEditNote(), canManageNotes(), deleteNoteMsg() (+43 more)

### Community 20 - "store.tsx"
Cohesion: 0.07
Nodes (46): InvLogRow, itemLabel(), NOTE_TTL_MS, saveState(), archiveMarkGone(), archiveRows(), archiveUpsert(), buildJson() (+38 more)

### Community 21 - "TagModal.tsx"
Cohesion: 0.33
Nodes (9): insertTagSorted(), removeStoreTag(), renameStoreTag(), storeTags(), Props, TagModal(), add(), commitRename() (+1 more)

### Community 22 - "deploy-web.mjs"
Cohesion: 0.40
Nodes (4): dist, entries, here, root

### Community 23 - "DevThemes.tsx"
Cohesion: 0.20
Nodes (16): applyTheme(), ensureSystemListener(), resolvedTheme(), setThemePref(), systemDark(), THEME_CHROME, themeOptions(), themePref (+8 more)

### Community 24 - "inject-sw-version.mjs"
Cohesion: 0.40
Nodes (3): p, root, versionSrc

### Community 25 - "SettingsModal"
Cohesion: 0.17
Nodes (14): onAccountChange(), accountEmail(), sessionActive(), mergeBackupInto(), parseBackup(), renameMeInAllStoresFn(), SettingsModal(), doLogout() (+6 more)

### Community 26 - "main.tsx"
Cohesion: 0.50
Nodes (3): CapgoGlobal, initCapUpdater(), UpdaterPlugin

### Community 27 - "SaleRegistration.tsx"
Cohesion: 0.06
Nodes (67): Dropdown(), activeEvent(), canManageTeam(), catLabel(), costFor(), findActivePromo(), fixedPackageTotal(), formatDate() (+59 more)

### Community 28 - "nativeBack.ts"
Cohesion: 0.21
Nodes (6): hasOverlay(), BackButtonApp, CapacitorGlobal, initNativeBack(), isNativeApp(), SavedFile

### Community 29 - "Catalog"
Cohesion: 0.21
Nodes (9): reorderCategoryProducts(), Catalog(), catKey(), catOpen(), removeCategory(), removeProduct(), startProdDrag(), toggleCat() (+1 more)

### Community 30 - "useStore"
Cohesion: 0.13
Nodes (26): compressImage(), DEFAULT_STORE_IMAGE, esc(), fromEditablePromos(), insertCatSorted(), numText(), promoText(), setCategoryPricing() (+18 more)

### Community 31 - "core.ts"
Cohesion: 0.09
Nodes (29): CategoryGroup, clearDeletedNotes(), costEntryKey(), dedupeCosts(), DEFAULT_PROD_SVG, DEFAULT_STORE_SVG, deletedNoteIds, deletedNoteIdsOf() (+21 more)

### Community 32 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react, @types/react, @types/react-dom, typescript, vite (+3 more)

### Community 33 - "dependencies"
Cohesion: 0.25
Nodes (8): dependencies, @capacitor/app, @capacitor/filesystem, @capacitor/push-notifications, @capgo/capacitor-updater, firebase, react, react-dom

### Community 34 - "SettingsModal.tsx"
Cohesion: 0.24
Nodes (13): askSwVersion(), useAppVersion(), notifCatEnabled(), notifCats(), notifyEnabled(), setNotifCat(), setNotifyEnabled(), requestNotifyPermission() (+5 more)

### Community 35 - "StoreModal"
Cohesion: 0.18
Nodes (17): clearDeletedProducts(), clearDeletedSales(), clearSeenNoteIds(), detach(), deactivateSyncFn(), removeMemberFn(), setMemberRoleFn(), StoreModal() (+9 more)

### Community 36 - "AuthLanding.tsx"
Cohesion: 0.20
Nodes (12): currentIdentity(), linkStoresToAccount(), sendPasswordReset(), firestoreDb(), EyeIcon(), EyeOffIcon(), AuthLanding(), doRegister() (+4 more)

### Community 37 - "push.ts"
Cohesion: 0.29
Nodes (12): disablePushForStore(), enablePushForStore(), ensurePushToken(), getMessagingInstance(), initNativePush(), NativePush, nativePushPlugin(), nextNativeToken() (+4 more)

### Community 38 - "App"
Cohesion: 0.23
Nodes (9): App(), selectStore(), setMenu(), useScrollAxisLock(), consumeDeepNote(), initDeepLink(), readDeepTab(), readParam() (+1 more)

### Community 39 - "install.ts"
Cohesion: 0.50
Nodes (3): BeforeInstallPromptEvent, isStandalone(), useInstallable()

### Community 40 - "backStack.ts"
Cohesion: 0.24
Nodes (7): ENTRY, popOverlay(), realUrl(), stack, syncHistory(), CapHolder, Listener

### Community 41 - "AppProvider"
Cohesion: 0.42
Nodes (10): toInvLogArr(), toNoteBoardArr(), toNoteLogArr(), toProductsArr(), toSalesArr(), buildStoreFromRemote(), repairDoc(), joinStore() (+2 more)

### Community 42 - "push"
Cohesion: 0.40
Nodes (10): createSync(), canon(), clearScheduled(), fp(), isPrimed(), markPrimed(), migrateLegacyProducts(), push() (+2 more)

### Community 43 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, deploy, dev, preview, test

### Community 44 - "dialog.ts"
Cohesion: 0.32
Nodes (7): DialogKind, DialogRequest, emit(), Listener, listeners, open(), resolveDialog()

## Knowledge Gaps
- **145 isolated node(s):** `name`, `private`, `dev`, `deploy`, `wrangler` (+140 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 195 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Catalog.tsx` to `SettingsModal.tsx`, `react-app/package.json`, `AuthLanding.tsx`, `sync.test.ts`, `install.ts`, `ui.tsx`, `Notes.tsx`, `store.tsx`, `TagModal.tsx`, `DevThemes.tsx`, `main.tsx`, `SaleRegistration.tsx`, `useStore`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `useStore()` connect `useStore` to `Inventory`, `Catalog.tsx`, `SettingsModal.tsx`, `AuthLanding.tsx`, `StoreModal`, `App`, `ui.tsx`, `Notes.tsx`, `store.tsx`, `TagModal.tsx`, `SettingsModal`, `SaleRegistration.tsx`, `Catalog`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `SettingsModal()` connect `SettingsModal` to `SettingsModal.tsx`, `sync.test.ts`, `ui.tsx`, `attach`, `Notes.tsx`, `store.tsx`, `DevThemes.tsx`, `useStore`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _145 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Inventory` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `react-app/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1286549707602339 - nodes in this community are weakly interconnected._
- **Should `sync.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05632360471070148 - nodes in this community are weakly interconnected._