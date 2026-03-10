# DAE HH POS — Design & Feature Plan

> **Philosophy:** Apple Zen — minimalist, calm, easy, functional.
> Color = signal. Space = clarity. Every tap = purpose.

---

## ✅ Done

### Session 1
- [x] **Home Screen Redesign** — 5-section layout: Header strip, Site/Cashier tiles, 4-col nozzle grid, Payment CTA row, Unpaid transactions 3-col grid
- [x] **TopBar Header** — Replaced company name/date rows with DAE pill | YYYY-MM-DD date | Wifi/Printer/Fuel status icons
- [x] **BottomNav** — 4 tabs: History | Prices | Home (DAE icon mark, elevated) | Settings. Brand blue `#3271ae` background.
- [x] **Design Philosophy** — Documented Apple Zen principles in CLAUDE.md

### Session 2 — Multi-feature update
- [x] **DAE Logo Integration** — Created `components/DAELogo.tsx` with inline SVG icon mark + Audiowide wordmark
- [x] **Unified Header** — Merged phone status bar + app header: DAE icon+wordmark | live time + date | connectivity icons
- [x] **Sign Out → Settings** — Moved Sign Out into `screens/Settings.tsx` with confirmation modal
- [x] **Auto Settle** — Renamed "Auto" → "Auto Settle". Banknote icon, emerald active state
- [x] **Fast Key + Transaction context** — FastKey supports `sourceTransaction` prop. "Add to Bill" merges items back to TransactionDetail
- [x] **Coupon/Member flow** — TransactionDetail "Coupon" opens member lookup + coupon bottom sheet with mock CMS data
- [x] **Color scheme** — DAE blue headers, amber Total Due hero, brand blue icon badges throughout

### Session 3 — UX Corrections & Polish
- [x] **Auto Settle → Auto Cash** — Renamed. Fixed icon alignment: `shrink-0`, `whitespace-nowrap`, fixed `w-24 h-9` so button never resizes on toggle
- [x] **Fast Key product photos** — Replaced Lucide icon circles with full-width Unsplash product photos (`h-28 object-cover`). Fixed broken `source.unsplash.com` → direct `images.unsplash.com/photo-{ID}` URLs. Qty badge overlays photo corner
- [x] **Home screen cleanup** — Removed dead Coupon button (no onClick) and misplaced Fast Key button from Home secondary row. Both actions already exist properly on TransactionDetail ("Coupon" + "Add Items")
- [x] **Auto Cash positioning** — Fixed width `w-24`, tucked right (`justify-end`), smaller size `h-9 text-[11px]`
- [x] **Battery indicator** — Replaced `Fuel` pump icon in TopBar with `Battery` icon + `82%` label. Turns red below 20%

---

## ✅ Immediate QA — Completed Session 7

### QA-1 — Dead Button Audit (Fixed)
| Screen | Button | Fix Applied |
|---|---|---|
| TransactionDetail | Printer (header) | `showToast('Printing receipt...')` |
| History | Refund | `showToast('Select a transaction to refund')` |
| History | Print | `showToast('Printing report...')` |
| History | Details (each row) | `showToast(txn ID + product)` |
| History | Reprint (each row) | `showToast('Printing...')` |
| PumpDetail | Confirm (settlement) | `setShowPaymentSuccess(true)` |
| PumpDetail | Card payment | `setShowPaymentSuccess(true)` |
| PumpDetail | Other payment | `showToast('Other payments: coming soon')` |
| Login | Settings gear | Left as-is (admin-only future feature) |
| Login | Language selectors | Left as-is (i18n future feature) |

### QA-2 — Text Cutoff (Fixed)
- **TransactionDetail receipt rows**: Added `min-w-0 flex-1` to left column + `truncate` on item name — fixes "Nozzle #3" clip and long product names

### QA-3 — Fuel Product Config (Done)
- Created `config/fuelProducts.ts` — single source of truth
- Exports `FUEL_PRODUCTS[]`, `getFuelProduct()`, `getFuelColor()`, `getFuelName()`
- Default: Vivo Energy Indonesia (Revvo 92, Revvo 95, Revvo 98, Diesel Primus, AdBlue, Premium)
- ⚠️ Colors are approximate — verify Revvo brand colors against https://www.instagram.com/p/DJbU-30ybDm/?hl=en before production

### QA-4 — Fuel Product Color Propagation (Done)
- **`mockData.ts`**: MOCK_TRANSACTIONS + MOCK_FUEL_PRODUCTS renamed EA95/EA92/DO → Revvo 95 / Revvo 92 / Diesel Primus
- **`PriceCheck.tsx`**: `getProductColor()` removed, replaced with `getFuelColor()` from config
- **`PumpDetail.tsx`**: `nozzleData` updated to Revvo names; `getNozzleStyle()` removed, replaced with `getNozzleColor()` using config
- **`History.tsx`**: Colored product dot added to each transaction row using `getFuelColor()`
- **`Home.tsx`**: Nozzle drawer "Product" row now shows full name via `getFuelName()`
- **`App.tsx`**: `showToast` wired into HistoryScreen, TransactionDetailScreen, PumpDetail

---

## ✅ Screen Polish (Phase 1) — Completed Session 4

- [x] **1.1 — Login Screen** — DAEIconMark+Wordmark logo block, yellow "Sign In" CTA, `#3271ae` brand color, removed redundant subtitle
- [x] **1.2 — History Screen** — Filter tabs (All/Paid/Pending) with underline indicator, emerald/amber color-coded status badges, Details links in `#3271ae`
- [x] **1.3 — Price Check Screen (Modal)** — Tag icon bg updated to `#3271ae` brand blue
- [x] **1.4 — EOS Screen (Modal)** — Added shift summary table (transactions, revenue, fuel, unpaid), branded header with Receipt icon, compact amber warning block
- [x] **1.5 — PumpDetail Screen** — "Pump X" header and "Select Fuel Point" label in `#3271ae`, Confirm button pinned to brand blue

## ✅ Interaction & Feedback (Phase 2) — Completed Session 4

- [x] **2.1 — Nozzle status legend** — "Legend" toggle button above grid. Tap-to-expand 2-col panel showing all 6 statuses with color dot + description
- [x] **2.2 — Toast notifications** — `Toast` component in `UI.tsx`. `showToast` in `App.tsx` (2s auto-dismiss). Wired to Auto Cash toggle + nozzle drawer actions
- [x] **2.3 — Nozzle detail drawer** — Tapping any non-Offline nozzle opens a bottom sheet with nozzle details (product, volume, amount) + context-sensitive action button (Suspend / Acknowledge / Resume / Idle). Backdrop tap closes.
- [x] **2.4 — Animated status indicators** — Fueling tiles: `animate-pulse`. Error tiles: `animate-error-glow` (CSS keyframe ring pulse). Animations defined in new `index.css`

## ✅ Data & Structure (Phase 3) — Completed Session 5

- [x] **3.1 — Centralise mock data** — All mock data moved to `mockData.ts`: nozzles, pending transactions, history, fuel products, Fast Key items, coupons, EOS shift summary
- [x] **3.2 — Shared state** — Created `AppContext.tsx` with React Context. `nozzles`, `pendingTransactions`, `transactions` lifted to shared state. `App.tsx` wrapped with `AppProvider`. Home + History use `useAppContext()`; nozzle status mutations (suspend/resume/acknowledge) now update shared state
- [x] **3.3 — Pump grouping labels** — Nozzle grid reorganised into pump sections (P1 / P2 / P3). Each section has a labelled divider and a `grid-cols-3` sub-grid (2 rows × 3 cols per pump). Nozzle labels now show position within pump (01–06) derived from nozzle ID

## ✅ QA & Polish (Phase 4) — Completed Session 6

- [x] **4.1 — Responsive frame check** — No layout-breaking issues; added `truncate` to pending transaction product names for overflow safety
- [x] **4.2 — Touch target audit** — FastKey qty buttons `w-7 h-7` → `w-10 h-10`; History filter tabs `min-h-[44px]`; History action buttons `h-11`
- [x] **4.3 — Theme.ts cleanup** — All `#466E9B` tokens replaced with `#3271ae`; `rounded-md` → `rounded-xl`; same fix applied to `UI.tsx` Button primary/accent and Input focus ring
- [x] **4.4 — Typography audit** — Fixed all violations: TopBar date `text-[9px]` → `text-[10px]`; battery % redesigned from `text-[6px]` inside icon → `text-[10px]` label beside icon; BottomNav labels `text-[9px]` → `text-[10px]`; Home nozzle product tag + pending txn labels `text-[8px]` → `text-[10px]`; legend desc `text-[9px]` → `text-[10px]`
- [x] **Bonus fix** — EOS.tsx crash bug: `shiftSummary` (undefined) → `MOCK_SHIFT_SUMMARY`

---

## 💡 Improvements Backlog

- Swipe gestures on nozzle tiles (swipe left = suspend, swipe right = reset)
- Dark mode variant (night shift for cashiers)
- Offline mode indicator banner when disconnected
- Receipt printing flow from TransactionDetail
- Auto Cash visual confirmation — show which transactions settled when toggle is on
- Fast Key: CMS-driven product list (IT admin uploads images + sets prices)

---

## ✅ Session 8 — Vivo Brand + Home Layout

- [x] **Vivo product lineup** — Updated to 4 products: R90, R92, R95, Diesel (codes on tiles)
  Full names: Revvo 90, Revvo 92, Revvo 95, Primus Diesel Plus
  Colors from Vivo SPBU price board: R90=gold `#C8930A`, R92=royal blue `#1A52A0`, R95=crimson `#921A1A`, Diesel=dark navy `#0F1A2E`
  All screens updated: nozzle grid, History dots, PriceCheck strips, PumpDetail, config central source.

- [x] **Cashier shift summary drawer** — Tap the Cashier info tile to open bottom sheet showing:
  - Hero stats: Total Sales ($) + Total Volume (L)
  - By Product breakdown: Sales + Volume per grade
  - By MOP breakdown: Txn count + Sales per payment method (Cash / QR Code / Bank Card / Fleet Card)

- [x] **Home layout cleanup** — Removed dead Payment CTA button. Auto Cash moved inline to nozzle section header row (alongside Legend toggle). Unpaid cards now sit directly below nozzles — no dead space.

---

## 💡 Improvements Backlog

- Swipe gestures on nozzle tiles (swipe left = suspend, swipe right = reset)
- Dark mode variant (night shift for cashiers)
- Offline mode indicator banner when disconnected
- Receipt printing flow from TransactionDetail
- Auto Cash visual confirmation — show which transactions settled when toggle is on
- Fast Key: CMS-driven product list (IT admin uploads images + sets prices)
---

## ✅ Session 9 — History UX + Legend Popup + Frame Fix

- [x] **Transaction History selection** — One-at-a-time selection with `bg-slate-200 border-slate-400` visual state. Removed redundant "Selected:" hint bar. Expandable inline Details panel (2-col grid: Type, Staff, Volume, Payment, Status, Txn ID). Refund button turns red for completed tx; Print turns blue when any tx selected.
- [x] **Legend modal popup** — Converted from inline expand (pushing nozzle grid down) to centered modal with DAE blue header, `bg-black/40 backdrop-blur-sm` backdrop, `animate-scale-in` card.
- [x] **Modal design consistency** — Standardised all popups to two patterns: center modal (`bg-black/40 backdrop-blur-sm`) and bottom sheet (`bg-slate-900/30`). Fixed Coupon modal rounding + ModalOverlay component.
- [x] **Data updates** — Cashier: "Dara Chan", Site: "Tela New Town", Battery: "82%"
- [x] **DeviceFrame Sunmi P3** — Updated aspect ratio from `9/19` → `9/20` to match Sunmi P3 720×1600 IPS display. All screens verified consistent: `flex-1 flex flex-col overflow-hidden` pattern across Login, Home, FastKey, TransactionDetail, History, Settings.

## ✅ Session 10 — Site Promotions Drawer

- [x] **Site tile → Promotions** — Site tile (top-left Home) is now tappable. Tap opens a scrollable bottom sheet listing current promotions sourced from telakhmer.com/promotions.
  - 6 promotions displayed: Grand Launch Bati, Pich Nil opening, Russey Keo, Kampong Cham, Ang Snuol, Free Bottle
  - Each card: colour tag pill (Opening / Gift / Offer), date, title, offer detail with Gift icon
  - `max-h-[80vh]` sheet with `overflow-y-auto` scroll — handles any list length on Sunmi P3 720×1600 display
  - Consistent with Cashier drawer pattern (handle bar, DAE blue header, backdrop dismiss)

## ✅ Session 11 — Member Lookup & Registration

- [x] **Member button → live modal** — "Member" button in TransactionDetail now opens a bottom-sheet modal (same pattern as cashier/site drawers in Home).
  - **Search view**: Phone number input + "Scan QR" hint button + "Search" CTA
  - **Found view**: Member card with avatar initials, tier badge (Silver/Gold/Platinum), points, phone, since date. "Link to Transaction" CTA links member.
  - **Not found view**: Empty state illustration + "Register New Member" CTA
  - **Registration form**: Full Name (required) + Phone (pre-filled, editable) + Email (optional) → "Register & Link" (disabled until Name filled)
  - **Linked state**: Button label changes to member's first name, blue border + background + `UserCheck` icon
  - Mock members: MBR-0042 (Sopheak Meng, 012345678, Gold), MBR-0091 (Dara Pich, 097654321, Silver), MBR-0017 (Ratana Keo, 085112233, Platinum)

---

## ▶️ Next Steps

> **Session 11 complete.**
>
> **Do NOT execute any task until user explicitly says so.**

---

*Last updated: Session 11 — Member lookup & registration modal*
