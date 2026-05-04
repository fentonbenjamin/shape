"use client";

import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { UserMenu } from "@/components/user-menu";
import { listShapes } from "@/lib/save-shape";
import type { ShapeResult } from "@/lib/types";

interface ShapeRow {
  id: string;
  title: string;
  profile: string;
  engine: string;
  signal_level: string;
  created_at: string;
  result: ShapeResult;
}

function HistoryList() {
  const { user, loading: authLoading } = useAuth();
  const [shapes, setShapes] = useState<ShapeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    listShapes()
      .then((data) => setShapes(data as ShapeRow[]))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <p className="text-sm text-neutral-600">Loading…</p>;
  }

  if (!user) {
    return (
      <p className="text-sm text-neutral-500">
        <a href="/" className="text-neutral-400 hover:text-neutral-200 transition-colors underline">
          Sign in
        </a>{" "}
        to see your saved shapes.
      </p>
    );
  }

  if (shapes.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        No shapes yet.{" "}
        <a href="/" className="text-neutral-400 hover:text-neutral-200 transition-colors underline">
          Shape something
        </a>.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {shapes.map((s) => {
        const spine = s.result?.spine ?? [];
        return (
          <a
            key={s.id}
            href={`/s/${s.id}`}
            className="block border border-neutral-800 rounded-lg p-4 hover:border-neutral-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-200 truncate mr-4">{s.title}</h3>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-neutral-600">
                  {s.profile === "narrative_segment_v0" ? "narrative" : "concept"}
                </span>
                <span className={`text-xs font-mono ${
                  s.signal_level === "strong" ? "text-green-500" :
                  s.signal_level === "weak" ? "text-yellow-500" : "text-red-500"
                }`}>
                  {s.signal_level}
                </span>
                <span className="text-xs font-mono text-neutral-700">
                  {s.engine === "local" ? "local" : s.engine === "anthropic" ? "claude" : s.engine === "gemini" ? "gemini" : "gpt-4.1"}
                </span>
              </div>
            </div>
            {spine.length > 0 && (
              <div className="space-y-1 mb-2">
                {spine.slice(0, 3).map((line, i) => (
                  <p key={i} className="text-xs text-neutral-500 leading-relaxed border-l border-neutral-800 pl-2 truncate">
                    {line}
                  </p>
                ))}
                {spine.length > 3 && (
                  <p className="text-xs text-neutral-700 pl-2">+{spine.length - 3} more</p>
                )}
              </div>
            )}
            <p className="text-xs text-neutral-700">
              {new Date(s.created_at).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
                hour: "numeric", minute: "2-digit",
              })}
            </p>
          </a>
        );
      })}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <AuthProvider>
      <main className="min-h-screen flex flex-col items-center px-4 py-16">
        <UserMenu />
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-neutral-100">History</h1>
            <a
              href="/"
              className="text-xs font-mono text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              back to shape
            </a>
          </div>
          <HistoryList />
        </div>
      </main>
    </AuthProvider>
  );
}
