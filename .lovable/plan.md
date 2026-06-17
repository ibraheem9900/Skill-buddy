# SkillBuddy Redesign & Feature Update Plan

This is a large multi-page update. I'll execute it in 6 focused phases. All work stays frontend-only (no backend wiring yet — auth is UI-only, jobs use seed data, contact form is UI-only). Lovable Cloud can be enabled later when you want real auth/DB.

## Phase 1 — Foundations (typography, logo, icons, design tokens)

- Load **Sora / Inter / JetBrains Mono** via `<link>` in `src/routes/__root.tsx` (per Tailwind v4 rules — no @import URL in styles.css).
- Update `src/styles.css` `@theme` tokens: `--font-display: Sora`, `--font-sans: Inter`, `--font-mono: JetBrains Mono`. Add `.price` utility (mono + brand green).
- Rewrite `src/components/logo.tsx` to render an **inline SVG** (green circle with "SB", "SkillBuddy" wordmark) — no broken image.
- Build `src/lib/categories.ts` exporting the 31 categories from spec with their Lucide icon + a per-category hover animation key.
- Remove every bookmark/save icon from `service-card.tsx` and any other card.

## Phase 2 — Navbar + Homepage restructure

Navbar (`src/components/navbar.tsx`):
- Items: **Home | Services | Jobs | FAQs | Contact Us** (remove Become a SkillBuddy, remove categories mega-menu link clutter).
- Right side: **LanguageSelector | ThemeToggle | Login | Sign Up (green)**.
- New `src/components/language-selector.tsx` — dropdown with 🇬🇧 EN, 🇪🇪 ET, 🇷🇺 RU, 🇱🇻 LV, 🇱🇹 LT, persisted in localStorage. Uses lightweight in-house i18n via React context + a `t()` hook reading from `src/lib/i18n/{en,et,ru,lv,lt}.ts` (Google Translate widget is unreliable and uglifies the UI).

Homepage (`src/routes/index.tsx`) sections in order:
1. Hero (keep, update subtitle).
2. **Become a SkillBuddy floating banner** — full-width gradient (green→teal), animated dots background, pulsing CTA.
3. **Categories slider** — exactly 9 visible, left/right arrows, dot pagination, first-load slide hint, per-category hover micro-animations (Framer Motion variants keyed to category id).
4. **Special Offers** — horizontal scroll row, aligned "Claim Offer" buttons.
5. **Popular Services** — 4×2 grid (8 cards), uniform height, gradient overlay on image, "View Details" slide-up on hover.
6. **How It Works** — 5 steps with animated connecting line (Book → Post → Bids → Choose → Done).
7. Most Booked Services — bolder Sora headings.
8. Testimonials + Footer.

All grids use `grid auto-rows-fr` + `h-full` cards so heights match.

## Phase 3 — Pages: Jobs, FAQs, Auth, Contact, Services updates

- **Reusable `<QRDownloadModal>`** — shared by Services "Post a Job" and Jobs "Apply" CTAs. Two QR images (generated as inline SVG via a tiny QR lib or static placeholder PNGs labelled Android / iOS), close button, scale-in animation.
- **`/jobs`** (new `src/routes/jobs.tsx`) — header with count, card grid (title, category, location, budget, posted-ago, urgency badge, bid count), 12 seed jobs in `src/lib/jobs.ts`. "Apply" and "View Details" open QR modal.
- **`/faqs`** (new `src/routes/faqs.tsx`, also add `/faq` redirect kept) — hero with search input that filters questions, 4 accordion sections (General, Client, Provider, Payments) with the exact copy provided. Smooth height animation.
- **`/auth`** (new `src/routes/auth.tsx`) — tabbed Sign In / Sign Up / Forgot Password (UI only). Show/hide password, password strength bar, terms checkbox, social buttons (Apple/Google/Facebook — visual only). Existing `/auth/login` + `/auth/signup` redirect here.
- **`/contact`** — restructure form to Email + Subject + Message (required) + Phone (optional with helper text), right-side company info + map embed iframe, success toast.
- **Services list (`/services`)** — left vertical category sidebar, main grid; uniform cards; remove filter sidebar; mobile = bottom-sheet drawer (see Phase 4).
- **Service detail (`/services/$id`)** — remove booking form; add big green "Post a Job" → QR modal; add right sidebar "More in this category" with 4-5 sibling cards (clickable, no back nav needed).

## Phase 4 — Mobile filter bottom sheet

New `src/components/mobile-filter-sheet.tsx`:
- Slides up from bottom (Framer Motion, 300ms ease), backdrop blur, drag handle.
- Dual-handle price slider using shadcn `Slider` (already supports range) with 44px touch targets, live "$20 — $70" readout.
- Horizontally scrollable category chips, active = green.
- Star-radio rating filter.
- Horizontally scrollable date chips.
- Sticky Reset / Apply footer.

## Phase 5 — Animations & polish

- Framer Motion page transitions in `__root.tsx` (`AnimatePresence` around `<Outlet />`).
- `IntersectionObserver`-based section fade+slide-up reveals (small `useInView` hook).
- `whileTap={{ scale: 0.96 }}` on all primary buttons.
- Modal popups: scale-in + backdrop blur.
- Dark/light toggle verified across new pages.

## Phase 6 — Verification

- Read each changed route in the browser preview at desktop + mobile widths.
- Check console + network logs for missing icons / broken routes.
- Confirm card grids align (DOM spot check + visual screenshot).

## Technical notes

- **Stack**: TanStack Start + React 19 + Tailwind v4 (existing). No Next.js. No backend changes this round.
- **i18n**: lightweight context-based dictionary, not `react-i18next` (no install cost, full control, works for the 5 supported locales).
- **QR codes**: use the `qrcode` npm package to render SVG QR pointing to placeholder store URLs — swap real URLs when apps are live.
- **Icons**: Lucide React (already installed).
- **Auth**: pure UI this round. Wiring to Lovable Cloud is a separate follow-up — I'll prompt you to enable Cloud when you're ready to make Sign In actually log people in.
- **Blog section**: marked optional in the spec — I'll skip it this round to keep this update shippable; easy to add after.

## Out of scope (call out)

- Real auth / DB / payments / live job submissions — UI only; enable Lovable Cloud later.
- Realtime chat, live Mapbox on /explore — untouched this round.
- Facebook OAuth — not supported by Lovable Cloud; button is visual only.
