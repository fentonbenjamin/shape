"use client";

import { useState } from "react";

export function ShapeForm({
  onResult,
  onError,
}: {
  onResult: (data: unknown) => void;
  onError: (msg: string) => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    onError("");

    try {
      const res = await fetch("/api/shape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
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
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste messy text here..."
        rows={10}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-sm font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 resize-y"
      />
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-neutral-600">
          {text.length.toLocaleString()} chars
        </span>
        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="px-6 py-2 bg-neutral-100 text-neutral-950 text-sm font-medium rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Shaping..." : "Shape"}
        </button>
      </div>
    </div>
  );
}
