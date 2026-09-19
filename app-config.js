/**
 * Points the frontend at the deployed Apps Script backend (Code.gs).
 *
 * This URL is NOT sensitive — every request it receives still requires a
 * valid Firebase ID token, verified server-side in Code.gs's
 * verifyIdToken_(). Knowing the URL alone doesn't grant access to anything.
 * Safe to commit to a public repo.
 *
 * If you redeploy the Apps Script project as a new version, update this
 * value to the new /exec URL (or better: use "Manage deployments" > edit
 * the existing deployment so the URL stays the same across updates).
 */
window.__APPS_SCRIPT_URL__ = "https://script.google.com/macros/s/AKfycbx0ghipwikVEwWTwY1rNVImFqBBq3esgRZIugqg04ljUL03DhOuWb8YciM4XvhezqrY2Q/exec";
