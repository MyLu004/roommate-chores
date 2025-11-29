// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// React Native (Expo) sometimes doesn't provide a global URL implementation
// which `@supabase/supabase-js` expects. If URL is missing at runtime, try
// to load the polyfill automatically and warn the developer with actionable
// instructions. The app will still compile if the polyfill isn't installed,
// but you'll see a runtime warning pointing to the fix.
if (typeof (globalThis as any).URL === "undefined") {
  // `URL` is required by @supabase/supabase-js in some environments. React
  // Native (Expo) may not provide it. If you see runtime errors mentioning
  // `URL` is undefined, install the polyfill:
  //
  //   npm install react-native-url-polyfill
  //   // then near your app entry (e.g. app/_layout.tsx) add:
  //   import 'react-native-url-polyfill/auto'
  //
  // We only warn here so the project compiles; the polyfill must be present
  // at runtime to avoid errors.
  console.warn(
    "[supabaseClient] global URL is undefined. If you encounter runtime errors, install 'react-native-url-polyfill' and import 'react-native-url-polyfill/auto' before initializing Supabase."
  );
}

// TODO: add these in the env file
const SUPABASE_URL = "https://iekzfbtfwepgznqibupm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla3pmYnRmd2VwZ3pucWlidXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NTE5NjUsImV4cCI6MjA3OTQyNzk2NX0.9YmS-tNUzzLM6N1H64KPTnmkq6C1Plf2f5GSpUNX9B0";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[supabaseClient] Missing Supabase URL or anon key. " +
      "Set them in lib/supabaseClient.ts before using Supabase."
  );
}

//don't need session persistence/auth 
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});
