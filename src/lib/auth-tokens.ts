/**
 * Token storage for FastAPI auth.
 *
 * Access token: in-memory only (cleared on page refresh — short-lived, most XSS-resistant option
 * without httpOnly cookies). Restored on mount via refresh token.
 *
 * Refresh token: sessionStorage (cleared when the tab/browser closes; not localStorage to
 * limit XSS exposure window).
 */

const REFRESH_KEY = "sb_rt";

let _accessToken: string | null = null;

export const tokenStore = {
  getAccess: (): string | null => _accessToken,
  setAccess: (t: string): void => {
    _accessToken = t;
  },
  getRefresh: (): string | null => {
    try {
      return sessionStorage.getItem(REFRESH_KEY);
    } catch {
      return null;
    }
  },
  setRefresh: (t: string): void => {
    try {
      sessionStorage.setItem(REFRESH_KEY, t);
    } catch {}
  },
  clear: (): void => {
    _accessToken = null;
    try {
      sessionStorage.removeItem(REFRESH_KEY);
    } catch {}
  },
};
