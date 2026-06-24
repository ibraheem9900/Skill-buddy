---
name: Homepage snap-scroll architecture
description: How the homepage snap-scroll layout is wired — bypasses SiteShell, uses fixed container, intercepts wheel events for card-deck sections.
---

The homepage (`src/routes/index.tsx`) does NOT use `SiteShell`. It manages its own layout.

## Structure
- `position: fixed; inset: 0; overflow-y: scroll; scroll-snap-type: y mandatory` container (z-index 10)
- Navbar rendered as a sibling `position: fixed; top: 0; z-index: 40` wrapper animated with Framer Motion slide-in after intro completes
- `document.body.style.overflow = 'hidden'` set on mount, cleaned up on unmount
- 11 sections, each `height: 100vh; scroll-snap-align: start`

## Active section detection
IntersectionObserver with `threshold: 0.5, root: containerRef.current` — each section ref tracked in `sectionRefs`.

## Card-deck wheel interception
Sections 3 (SpecialOffers) and 6 (WhatMakesUsSpecial) intercept wheel events:
- Non-passive listener on the scroll container element
- When active section is a card-deck and `deltaY > 0` and cards remain: `preventDefault()` + advance card state
- When `deltaY < 0` and cards can go back: `preventDefault()` + retreat
- State hoisted to `Home` component as `specialOffersCard` and `featureCard` refs + state

**Why:** CSS scroll snap handles section-level scrolling; card-deck sections need sub-scroll behavior without extra snap points.

## Intro / Navbar sequencing
- `useLogoIntro()` from `src/components/logo-intro.tsx` manages `showIntro` / `introComplete` via sessionStorage key `skillbuddy_intro_seen`
- Navbar wrapping `motion.div` animates `y: -60 → 0, opacity: 0 → 1` when `introComplete` becomes true
- Sections render immediately (behind the intro overlay) — no conditional render

## Other pages
All other routes continue to use `SiteShell` (Navbar + Footer in normal document flow). The homepage's `position: fixed` container only exists while that route is mounted.
