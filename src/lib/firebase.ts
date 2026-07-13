import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// ─────────────────────────────────────────────────────────────────────────────
// Ashraf Ali — Firebase configuration
// Realtime Database is the live content store (portfolio content, admin, theme).
// File storage (resume, images) is handled by SUPABASE — see src/lib/supabase.ts
//
// The Realtime Database works with just `databaseURL` when your DB rules are
// public. To also enable Firebase Auth/Analytics, paste the remaining keys from
// Firebase Console → Project settings → General → "Your apps" (Web app config).
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
    apiKey: "",                 // optional for public RTDB — paste yours to enable Auth/Analytics
    authDomain: "ashraf-portfolio-cd970.firebaseapp.com",
    projectId: "ashraf-portfolio-cd970",
    storageBucket: "ashraf-portfolio-cd970.appspot.com",
    messagingSenderId: "",      // optional — paste yours if you enable messaging
    appId: "",                  // required only for Analytics
    measurementId: "",          // required only for Analytics
    databaseURL: "https://ashraf-portfolio-cd970-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics only initializes when a valid appId + measurementId are provided
const analytics =
    typeof window !== "undefined" && firebaseConfig.appId && firebaseConfig.measurementId
        ? (() => {
              try {
                  return getAnalytics(app);
              } catch {
                  return null;
              }
          })()
        : null;

// Realtime Database — the primary content store
const db = getDatabase(app);

// Firebase Storage kept for backwards-compat, but file uploads use Supabase.
let storage: ReturnType<typeof getStorage> | null = null;
try {
    storage = getStorage(app);
} catch {
    storage = null;
}

export { app, db, analytics, storage };
