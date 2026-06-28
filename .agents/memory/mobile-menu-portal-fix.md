---
name: Mobile menu portal fix
description: How to fix z-index / overflow issues with a fixed-position mobile drawer inside a fixed navbar
---

## Rule
When a mobile nav drawer/backdrop is rendered as a **child of `position:fixed` navbar**, use `createPortal(jsx, document.body)` to render it directly in `<body>` — not as a child of the navbar's DOM node.

**Why:** A `position:fixed` element (navbar) with a z-index creates a stacking context. Children rendered inside that stacking context have their z-index resolved relative to the navbar's layer, not the root layer. This can cause the overlay to be clipped or to appear below other stacking contexts even when it has a very high z-index. `createPortal` escapes the DOM tree entirely.

**How to apply:**
1. Gate portal on `mounted` state (`useEffect(() => setMounted(true), [])`) to avoid SSR mismatch.
2. Return `<>{navbar}</> {mounted && createPortal(mobileMenu, document.body)}`.
3. Lock body scroll in `useEffect` when `menuOpen` changes; always clean up.

## Also relevant
- `body { overflow-x: hidden }` creates a new containing block for `position:fixed` elements in some browsers. Use `overflow-x: clip` instead — `clip` doesn't create a containing block, so fixed elements remain positioned relative to the viewport.
- Same issue applies to `html { overflow-x: hidden }` — change both to `clip`.
