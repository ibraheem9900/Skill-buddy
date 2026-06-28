---
name: Mobile snap hero gap fix
description: Why the homepage hero section has excess blank space below the navbar on mobile
---

## Rule
On mobile, the homepage's snap container sits inside `.root-content` which has `padding-top: var(--navbar-height)`. The first `.snap-section` should be `min-height: calc(100svh - var(--navbar-height))`, NOT `100svh`.

**Why:** If the first section is `min-height: 100svh` but the container already starts `var(--navbar-height)` below the top of the viewport, the section extends beyond one viewport height, causing the content to be centered below the visible fold and leaving a large blank gap between the navbar and the first visible content.

**How to apply:**
```css
@media (max-width: 768px) {
  .snap-section:first-child {
    min-height: calc(100svh - var(--navbar-height)) !important;
  }
}
```

## Also relevant
- On mobile, remove `transform` and `will-change` from `.snap-section` divs — these create stacking contexts that can interfere with IntersectionObserver and animation visibility.
- Use `overflow: clip` on body/html (not `overflow: hidden`) to prevent layout shifting without breaking fixed positioning or IO calculations.
