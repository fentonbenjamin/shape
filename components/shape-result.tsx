"use client";

import { useState } from "react";
import type { ShapeResult } from "@/lib/types";
import { CastView } from "./cast-view";
import { CheckView } from "./check-view";

export function ShapeResult({ result }: { result: ShapeResult }) {
  const [tab, setTab] = useState<"readable" | "json" | "card">("readable");

  const { candidate, declared_loss, casts, check, signal } = result;

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 space-y-6">
      {/* Signal badge */}
      <div className="flex items-center gap-3">
        <span
          className={`text-xs font-mono px-2 py-1 rounded ${
            signal.level === "strong"
              ? "bg-green-900/50 text-green-400"
              : signal.level === "weak"
              ? "bg-yellow-900/50 text-yellow-400"
              : "bg-red-900/50 text-red-400"
          }`}
        >
          {signal.level}
        </span>
        <span className="text-xs text-neutral-500">{signal.note}</span>
      </div>

      {/* Title and intent */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-100">
          {candidate.title}
        </h2>
        <p className="text-sm text-neutral-400 mt-1">{candidate.intent}</p>
      </div>

      {/* Summary */}
      <p className="text-sm text-neutral-300 leading-relaxed">
        {candidate.summary}
      </p>

      {/* Structured fields */}
      <div className="grid grid-cols-2 gap-4">
        {candidate.themes.length > 0 && (
          <div>
            <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wide mb-2">
              Themes
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {candidate.themes.map((t, i) => (
                <span
                  key={i}
                  className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {candidate.entities.length > 0 && (
          <div>
            <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wide mb-2">
              Entities
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {candidate.entities.map((e, i) => (
                <span
                  key={i}
                  className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {candidate.constraints.length > 0 && (
        <div>
          <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wide mb-2">
            Constraints
          </h3>
          <ul className="space-y-1">
            {candidate.constraints.map((c, i) => (
              <li key={i} className="text-sm text-neutral-400">
                &bull; {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {candidate.questions.length > 0 && (
        <div>
          <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wide mb-2">
            Open Questions
          </h3>
          <ul className="space-y-1">
            {candidate.questions.map((q, i) => (
              <li key={i} className="text-sm text-neutral-400">
                ? {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Declared loss */}
      {declared_loss.length > 0 && (
        <div className="border-t border-neutral-800 pt-4">
          <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wide mb-2">
            Declared Loss
          </h3>
          <ul className="space-y-1">
            {declared_loss.map((l, i) => (
              <li key={i} className="text-sm text-neutral-500 italic">
                {l}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Check */}
      <CheckView check={check} />

      {/* Tabs: readable / json / card */}
      <div className="border-t border-neutral-800 pt-4">
        <div className="flex gap-4 mb-3">
          {(["readable", "json", "card"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs font-mono uppercase tracking-wide pb-1 border-b-2 transition-colors ${
                tab === t
                  ? "border-neutral-400 text-neutral-200"
                  : "border-transparent text-neutral-600 hover:text-neutral-400"
              }`}
            >
              {t === "readable" ? "Cast" : t === "json" ? "JSON" : "Sieve Card"}
            </button>
          ))}
        </div>
        <CastView tab={tab} casts={casts} />
      </div>
    </div>
  );
}
