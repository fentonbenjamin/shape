"use client";

import { useState, useRef } from "react";
import type { ShapeProfile } from "@/lib/types";

export function ShapeForm({
  onResult,
  onError,
  onLoading,
}: {
  onResult: (data: unknown) => void;
  onError: (msg: string) => void;
  onLoading: (loading: boolean) => void;
}) {
  const [text, setText] = useState("");
  const [profile, setProfile] = useState<ShapeProfile | "auto">("auto");
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startTimer() {
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((e) => e + 0.1), 100);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    onLoading(true);
    onError("");
    startTimer();

    try {
      const body: Record<string, string> = { text };
      if (profile !== "auto") body.profile = profile;

      const res = await fetch("/api/shape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        onError(data.error || "Something went wrong");
      } else {
        onResult(data);
      }
    } catch {
      onError("Failed to reach the API");
    } finally {
      stopTimer();
      setLoading(false);
      onLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && text.trim() && !loading) {
      handleSubmit();
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste messy text here..."
        rows={10}
        disabled={loading}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-sm font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 resize-y disabled:opacity-50 transition-opacity"
      />
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-600">
            {text.length.toLocaleString()} chars
          </span>
          <select
            value={profile}
            onChange={(e) => setProfile(e.target.value as ShapeProfile | "auto")}
            disabled={loading}
            className="text-xs bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-400 focus:outline-none focus:border-neutral-600 disabled:opacity-50"
          >
            <option value="auto">auto-detect</option>
            <option value="narrative_segment_v0">narrative</option>
            <option value="concept_blob_v0">concept</option>
          </select>
          {loading && (
            <span className="text-xs text-neutral-600 tabular-nums">
              {elapsed.toFixed(1)}s
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!loading && text.trim() && (
            <span className="text-xs text-neutral-700">⌘↵</span>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="px-6 py-2 bg-neutral-100 text-neutral-950 text-sm font-medium rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-neutral-400 border-t-neutral-900 rounded-full animate-spin" />
                Shaping…
              </span>
            ) : (
              "Shape"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
