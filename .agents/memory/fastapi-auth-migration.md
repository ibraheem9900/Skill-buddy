---
name: FastAPI auth migration
description: Full replacement of Supabase auth with FastAPI backend — token handling, route patterns, and pitfalls
---

## Endpoints used
- `POST /api/v1/users/login` — `application/x-www-form-urlencoded` (OAuth2 password flow); returns `{access_token, refresh_token, user, roles, active_role}`
- `POST /api/v1/users/signup` — JSON `{email, personal_code, password, confirm_password, first_name, last_name}`; link-based verification (no OTP)
- `POST /api/v1/users/logout` — JSON `{access_token, refresh_token, token_type}`
- `POST /api/v1/users/refresh` — JSON `{refresh_token}`; returns new pair
- `GET /api/v1/users/me` — Bearer; returns user object (may be `{user: ...}` or flat)
- `PATCH /api/v1/users/update-user` — Bearer; JSON partial user fields
- `PATCH /api/v1/users/update-password` — Bearer; JSON `{old_password, new_password, confirm_password}`
- `POST /api/v1/users/forgot-password` — JSON `{email}`
- `POST /api/v1/users/reset-password?token=` — JSON `{new_password, confirm_password}`
- `GET /api/v1/users/verify-email?token=` — link from email
- `POST /api/v1/users/upload-profile-picture` — multipart, field `file`
- `POST /api/v1/users/upload-residence-permits` — multipart, fields `front_file` + `back_file`
- `POST /api/v1/users/upload-face-auth-video` — multipart, field `file`
- `GET /api/v1/users/login/{provider}` — redirects browser to Google/Apple OAuth

## Token storage decision
- Access token: module-level variable in `src/lib/auth-tokens.ts` (lost on page refresh)
- Refresh token: `sessionStorage` (cleared on tab close)
- Reason: no localStorage (XSS window), no httpOnly cookie (too complex for current arch)

## FastAPIUser shape (key fields)
`first_name`, `last_name` (not `full_name`), `phone_number` (not `phone`), `role` is uppercase `"CLIENT"|"PROVIDER"`, `is_verified: boolean`, `avatar_url`, `created_at`

## Helper functions location
`getFullName()` and `isProfileComplete()` live in `src/lib/user-helpers.ts` (NOT AuthContext.tsx).
**Why:** Vite Fast Refresh requires .tsx files to export only React components; mixing plain functions breaks HMR.

## Pending role flow
After signup → `sessionStorage.setItem("pending_role", "CLIENT|PROVIDER")` — only set AFTER successful signup response, not before.
On login success, `auth.login.tsx` consumes it with `PATCH /update-user` then removes it.

## API client refresh deadlock fix
`src/lib/api-client.ts` subscriber queue uses `{resolve, reject}` objects, NOT just callbacks.
On refresh failure: call `onRefreshFailed(err)` BEFORE `expireSession()` so waiting requests reject immediately instead of hanging.

## OAuth callback security
`src/routes/auth.callback.tsx` immediately calls `window.history.replaceState` after reading tokens from query params to scrub them from browser history/referrers.

## Open questions for backend team
- OAuth callback exact redirect URL and token delivery (assumed: `{origin}/auth/callback?access_token=...&refresh_token=...`)
- `GET /reset-password?token=` — pre-validation or no-op?
- Resend verification email endpoint (currently shows "contact support")
- Can one account hold both CLIENT and PROVIDER roles simultaneously?
