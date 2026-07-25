"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginButton() {
  const supabase = createClient();

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <button onClick={signIn}>
      Continue with Google
    </button>
  );
}