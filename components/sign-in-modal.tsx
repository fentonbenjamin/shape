"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export function SignInModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    const supabase = getSupabase();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  async function handleMagicLink() {
    if (!email.trim()) return;
    setError("");
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-neutral-100">Save your shape</h2>
        <p className="text-sm text-neutral-500">Sign in to save and revisit your meaning objects.</p>

        <button
          onClick={handleGoogle}
          className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-lg transition-colors"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-xs text-neutral-600">or</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {sent ? (
          <p className="text-sm text-green-400 text-center">Check your email for the sign-in link.</p>
        ) : (
          <div className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
              placeholder="you@example.com"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
            />
            <button
              onClick={handleMagicLink}
              disabled={!email.trim()}
              className="w-full py-2 bg-neutral-100 text-neutral-950 text-sm font-medium rounded-lg hover:bg-white disabled:opacity-30 transition-all"
            >
              Send magic link
            </button>
          </div>
        )}

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button onClick={onClose} className="w-full text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
          skip for now
        </button>
      </div>
    </div>
  );
}
