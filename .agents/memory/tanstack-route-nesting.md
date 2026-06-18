---
name: TanStack Router file-based nesting
description: How services.tsx + services.$id.tsx parent-child routing works and the correct file structure to avoid child routes not rendering.
---

## Rule
In TanStack Router file-based routing, `services.tsx` is the **parent layout** for all `/services/*` routes. If it doesn't render `<Outlet />`, child routes (e.g. `services.$id.tsx`) will silently never render.

## Correct structure for list + detail pattern
- `services.tsx` — minimal layout: `export const Route = createFileRoute("/services")({ component: () => <Outlet /> })`
- `services.index.tsx` — list page: `createFileRoute("/services/")`
- `services.$id.tsx` — detail page: `createFileRoute("/services/$id")`

**Why:** TanStack Router auto-nests `services.$id.tsx` as a child of `services.tsx` based on filename prefix. Without `<Outlet />` in the parent, the matched child component is never mounted.

**How to apply:** Any time you create both a `foo.tsx` route and `foo.$param.tsx` or `foo.bar.tsx`, make `foo.tsx` a thin `<Outlet />` wrapper and move list content into `foo.index.tsx`.
