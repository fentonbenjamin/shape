"use client";

import { useEffect, useState } from "react";
import { AuthProvider } from "@/components/auth-provider";
import { useAuth } from "@/components/auth-provider";
import { listShapes } from "@/lib/save-shape";

interface ShapeRow {
  id: string;
  title: string;
  profile: string;
  engine: string;
  signal_level: string;
  created_at: string;
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
        <a href="/" className="text-neutral-400 hover:text-neutral-200 transition-colors">
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
        <a href="/" className="text-neutral-400 hover:text-neutral-200 transition-colors">
          Shape something
        </a>.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {shapes.map((s) => (
        <div
          key={s.id}
          className="border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-200">{s.title}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-600">
                {s.profile === "narrative_segment_v0" ? "narrative" : "concept"}
              </span>
              <span className="text-xs font-mono text-neutral-600">{s.engine}</span>
              <span className={`text-xs font-mono ${
                s.signal_level === "strong" ? "text-green-500" :
                s.signal_level === "weak" ? "text-yellow-500" : "text-red-500"
              }`}>
                {s.signal_level}
              </span>
            </div>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            {new Date(s.created_at).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
              hour: "numeric", minute: "2-digit",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <AuthProvider>
      <main className="min-h-screen flex flex-col items-center px-4 py-16">
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
