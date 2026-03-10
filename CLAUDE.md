# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DAE POS Handheld is a React + TypeScript web app simulating a mobile POS interface for fuel station cashiers. It renders inside a phone frame (DeviceFrame) and is primarily a UI prototype with mock data.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

No test or lint commands are configured.

## Architecture

### Screen Routing
Navigation is handled entirely via `App.tsx` using a `Screen` enum and React `useState`. There is no React Router or external navigation library. Screen transitions are prop callbacks (`onNavigate`, `onBack`, `onLogin`).

```
Screen enum (types.ts): LOGIN | HOME | PUMP_DETAIL | TRANSACTION_DETAIL | HISTORY | PRICE_CHECK | EOS | FAST_KEY | SETTINGS
```

### Layout Structure
```
index.html (Tailwind CDN + importmap)
└── index.tsx → App.tsx (wrapped in AppProvider)
    └── DeviceFrame (Sunmi P3, 9/20 aspect ratio)
        ├── TopBar — DAE logo | time+date | Wifi/Printer/Battery
        ├── <CurrentScreen />
        └── BottomNav — History | Prices | Home (DAE FAB) | Settings
```

### Key Files
- `App.tsx` — screen router, top-level state, `showToast` utility
- `AppContext.tsx` — React Context: `nozzles`, `pendingTransactions`, `transactions` shared state; nozzle status mutations
- `types.ts` — all TypeScript enums and interfaces (`Screen`, `NozzleStatus`, `Transaction`, `Pump`, etc.)
- `theme.ts` — centralized color palette and typography used across components
- `mockData.ts` — all mock data: nozzles, transactions, history, fuel products, FastKey items, coupons, shift summary
- `config/fuelProducts.ts` — single source of truth for fuel products; `getFuelColor()`, `getFuelName()`, `getFuelProduct()`
- `components/UI.tsx` — base components: `Button`, `Card`, `Input`, `ModalOverlay`, `Toast`
- `components/DAELogo.tsx` — `DAEIconMark` + `DAEWordmark` inline SVG components
- `index.css` — custom keyframe animations (`animate-pulse`, `animate-error-glow`, `animate-scale-in`)
- `screens/` — one file per screen (Login, Home, PumpDetail, TransactionDetail, History, PriceCheck, FastKey, EOS, Settings)

### Styling
- Tailwind CSS loaded via CDN in `index.html` (not PostCSS/CLI)
- `theme.ts` exports color tokens — use these rather than hardcoding colors
- Primary brand: DAE Blue (`#3271ae`), Accent: Yellow (`#FFC107`)

### Data & State
- All mock data lives in `mockData.ts`; shared mutable state is in `AppContext.tsx`
- No API calls. `vite.config.ts` defines `GEMINI_API_KEY` for future AI integration

### Modal Screens
`PriceCheck` and `EOS` render as full-screen overlays using `ModalOverlay` from `components/UI.tsx`, not as separate routes.

### Bottom Sheet Pattern
Drawers (Cashier, Site Promotions, Nozzle Detail, Member Lookup) use a consistent bottom-sheet pattern: `bg-slate-900/30` backdrop, handle bar, DAE blue header. Tap backdrop to close.

---

## Design Philosophy — Apple Zen

All UI work in this project follows the **Apple Zen** principle: minimalist, calm, easy to read at a glance, and ruthlessly functional. Every design decision should serve the cashier's workflow, not decorate it.

### Core Principles

1. **Minimalism** — Remove everything that doesn't serve a purpose. No decorative borders, shadows, or labels unless they aid comprehension.
2. **Zen calm** — The UI should feel quiet when nothing needs attention. Color is reserved for state signals, not aesthetics.
3. **Ease** — A cashier glancing at the screen for 1 second should immediately know what needs action. Hierarchy over density.
4. **Function first** — Every tap should do something meaningful. No dead UI. No orphaned buttons.

### Color = Signal, not Style
| Color | Meaning |
|---|---|
| DAE Blue `#3271ae` | Brand / headers / idle / neutral action |
| Emerald `#22C55E` | Active / in progress |
| Amber `#F59E0B` | Payment required — action needed |
| Red `#EF4444` | Error — critical attention |
| Slate `#94A3B8` | Offline / inactive |
| Orange `#F97316` | Suspended |
| Yellow `#FFC107` | Primary CTA (Payment button) |

### Touch & Spacing
- Minimum touch target: **44px height** on all interactive elements
- Base spacing unit: **8px** (`gap-2` tiles, `gap-3` sections, `p-4` screen padding)
- Scale feedback: `active:scale-95` or `active:scale-[0.98]` on all tappable elements
- Prefer `rounded-xl` for cards and buttons — soft, approachable

### Typography Hierarchy
- Hero data (amounts, nozzle numbers): largest, boldest (`font-black`)
- Labels: `text-[10px] text-slate-500` — recede into background
- Section headers: `text-sm font-bold text-slate-700`
- Body: `text-xs` or `text-sm`, never smaller than 10px

### What NOT to do
- Do not add color for decoration — if it doesn't encode state, remove it
- Do not stack multiple font sizes in one element unless hierarchy demands it
- Do not add shadows, gradients, or borders unless they aid spatial separation
- Do not build UI for hypothetical future features — solve what's in front of you

---

## Workflow Rule
After completing each task, update `PLAN.md`:
- Move the completed item to the **Done** section
- Update the **Next Step** callout
- Confirm with the user before starting the next item
