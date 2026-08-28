/**
 * Feature flags for SkillBuddy web app.
 *
 * Set ENABLE_ROLE_SELECTION_ON_SIGNUP back to `true` to re-enable
 * the role-selection screen during signup (Part 1 of provider app flow).
 */

/** When false, the role-selection screen on /register is skipped —
 *  every signup goes directly to the client registration form. */
export const ENABLE_ROLE_SELECTION_ON_SIGNUP = false;
