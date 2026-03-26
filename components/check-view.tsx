"use client";

import type { ShapeCheck } from "@/lib/types";

export function CheckView({ check }: { check: ShapeCheck }) {
  const items = [
    { label: "Title preserved", ok: check.preserved_title },
    { label: "Intent preserved", ok: check.preserved_intent },
    { label: "Constraints preserved", ok: check.preserved_constraints },
    { label: "Lineage preserved", ok: check.preserved_lineage },
    { label: "Loss declared", ok: check.declared_loss_visible },
  ];

  return (
    <div className="border-t border-neutral-800 pt-4">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wide">
          Check
        </h3>
        <span
          className={`text-xs font-mono px-2 py-0.5 rounded ${
            check.overall_result === "pass"
              ? "bg-green-900/50 text-green-400"
              : "bg-red-900/50 text-red-400"
          }`}
        >
          {check.overall_result}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {items.map((item, i) => (
          <span
            key={i}
            className={`text-xs font-mono ${
              item.ok ? "text-neutral-500" : "text-red-400"
            }`}
          >
            {item.ok ? "✓" : "✗"} {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
