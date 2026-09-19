/**
 * Real Firebase project config for Gio's Chronology.
 *
 * NOTE ON SECURITY: a Firebase web config (apiKey, authDomain, etc.) is NOT
 * a secret — Firebase is designed so this can be visible in any browser's
 * view-source/devtools, and the frontend is hosted as a public static site
 * (e.g. GitHub Pages), so it would be visible there regardless. Real
 * protection comes from:
 *   1. Firebase Authentication itself (only signed-in users reach the app data)
 *   2. Restricting this API key in Google Cloud Console to your GitHub Pages
 *      domain (Credentials > this key > Application restrictions > HTTP referrers)
 *   3. The server-side ID-token verification in Code.gs, which never trusts
 *      a client-claimed identity — see verifyIdToken_().
 *
 * This file is kept separate from index.html purely for readability — not
 * for secrecy. It's committed to git like any other file; see
 * firebase-config.example.js if you ever want a placeholder template
 * instead (e.g. for a fork or a different environment).
 *
 * DEPLOYMENT: this is a plain static file, loaded via
 * <script src="firebase-config.js"></script> in index.html. Just make sure
 * it's included wherever index.html is hosted (e.g. GitHub Pages).
 */
window.__FIREBASE_CONFIG__ = {
  apiKey: "AIzaSyD3P1zTnWwW6VonvZghgVTnb0Eokxr7AzE",
  authDomain: "personal-32795.firebaseapp.com",
  projectId: "personal-32795",
  storageBucket: "personal-32795.firebasestorage.app",
  messagingSenderId: "411479894150",
  appId: "1:411479894150:web:3792309bfe01b025874907"
};
