"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./auth-provider";
import { SignInModal } from "./sign-in-modal";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <div className="fixed top-4 right-4 z-40">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 font-mono">
              {user.email}
            </span>
            <a
              href="/history"
              className="text-xs font-mono text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              history
            </a>
            <button
              onClick={signOut}
              className="text-xs font-mono text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSignIn(true)}
            className="text-xs font-mono text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            sign in
          </button>
        )}
      </div>
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
    </>
  );
}
