"use client";

import { useState } from "react";
import type { ShapeResult, NarrativeSegment, ConceptBlob, SupportMap } from "@/lib/types";
import { CastView } from "./cast-view";
import { CheckView } from "./check-view";

function TagList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wide mb-2">
        {label}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span key={i} className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function BulletList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wide mb-2">
        {label}
      </h3>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-neutral-400">&bull; {item}</li>
        ))}
      </ul>
    </div>
  );
}

function NarrativeView({ output }: { output: NarrativeSegment }) {
  return (
    <div className="space-y-4">
      <TagList label="Time Markers" items={output.time_markers} />
      <BulletList label="Events" items={output.events} />
      <TagList label="Actors" items={output.actors} />
      <BulletList label="Decisions" items={output.decisions} />
      <BulletList label="Changes" items={output.changes} />
      <BulletList label="Felt Experience" items={output.felt_experience} />
      <BulletList label="Open Questions" items={output.open_questions} />
    </div>
  );
}

function ConceptView({ output }: { output: ConceptBlob }) {
  return (
    <div className="space-y-4">
      <BulletList label="Core Claims" items={output.core_claims} />
      <BulletList label="Layer Models" items={output.layer_models} />
      <BulletList label="Distinctions" items={output.distinctions} />
      <BulletList label="Principles" items={output.principles} />
      <BulletList label="Anti-Patterns" items={output.anti_patterns} />
      <BulletList label="Design Questions" items={output.design_questions} />
      <BulletList label="Next Moves" items={output.next_moves} />
    </div>
  );
}

export function ShapeResult({ result }: { result: ShapeResult }) {
  const [tab, setTab] = useState<"readable" | "json" | "card">("readable");
  const { profile, output, support, casts, check } = result;

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono px-2 py-1 rounded bg-neutral-800 text-neutral-400">
          {profile === "narrative_segment_v0" ? "narrative" : "concept"}
        </span>
        <span className={`text-xs font-mono px-2 py-1 rounded ${
          output.signal_level === "strong" ? "bg-green-900/50 text-green-400" :
          output.signal_level === "weak" ? "bg-yellow-900/50 text-yellow-400" :
          "bg-red-900/50 text-red-400"
        }`}>
          {output.signal_level}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-neutral-100">{output.title}</h2>

      {profile === "narrative_segment_v0"
        ? <NarrativeView output={output as NarrativeSegment} />
        : <ConceptView output={output as ConceptBlob} />
      }

      {/* Support — evidence for each field */}
      {Object.keys(support).length > 0 && (
        <div className="border-t border-neutral-800 pt-4">
          <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wide mb-3">
            Evidence
          </h3>
          <div className="space-y-3">
            {Object.entries(support).map(([field, entries]) => (
              <div key={field}>
                <span className="text-xs font-mono text-neutral-400">{field}</span>
                <div className="ml-3 mt-1 space-y-1">
                  {(entries as Array<{ kind: string; evidence: string[] }>).map((entry, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className={`text-xs font-mono mt-0.5 ${
                        entry.kind === "explicit" ? "text-green-500" : "text-yellow-500"
                      }`}>
                        {entry.kind === "explicit" ? "E" : "I"}
                      </span>
                      <div className="text-xs text-neutral-500">
                        {entry.evidence.map((e, j) => (
                          <span key={j} className="block">&ldquo;{e}&rdquo;</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {output.inference_notes.length > 0 && (
        <div className="border-t border-neutral-800 pt-4">
          <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wide mb-2">Inference Notes</h3>
          <ul className="space-y-1">
            {output.inference_notes.map((n, i) => (
              <li key={i} className="text-sm text-yellow-400/70 italic">{n}</li>
            ))}
          </ul>
        </div>
      )}

      {output.declared_loss.length > 0 && (
        <div className="border-t border-neutral-800 pt-4">
          <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wide mb-2">Declared Loss</h3>
          <ul className="space-y-1">
            {output.declared_loss.map((l, i) => (
              <li key={i} className="text-sm text-neutral-500 italic">{l}</li>
            ))}
          </ul>
        </div>
      )}

      <CheckView check={check} />

      <div className="border-t border-neutral-800 pt-4">
        <div className="flex gap-4 mb-3">
          {(["readable", "json", "card"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs font-mono uppercase tracking-wide pb-1 border-b-2 transition-colors ${
                tab === t ? "border-neutral-400 text-neutral-200" : "border-transparent text-neutral-600 hover:text-neutral-400"
              }`}>
              {t === "readable" ? "Cast" : t === "json" ? "JSON" : "Sieve Card"}
            </button>
          ))}
        </div>
        <CastView tab={tab} casts={casts} />
      </div>
    </div>
  );
}
