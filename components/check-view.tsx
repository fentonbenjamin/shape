"use client";

import type { ShapeCheck } from "@/lib/types";

export function CheckView({ check }: { check: ShapeCheck }) {
  const crossChecks = [
    { label: "Structure valid", ok: check.structure_valid },
    { label: "Loss declared", ok: check.declared_loss_present },
    { label: "Signal level", ok: check.signal_level_present },
    { label: "Explicit vs inferred", ok: check.explicit_vs_inferred_present },
    { label: "Profile fields", ok: check.required_profile_fields_present },
  ];

  const profileChecks = Object.entries(check.profile_specific).map(
    ([key, ok]) => ({ label: key.replace(/_/g, " "), ok })
  );

  return (
    <div className="border-t border-neutral-800 pt-4">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wide">Check</h3>
        <span className={`text-xs font-mono px-2 py-0.5 rounded ${
          check.overall_result === "pass" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
        }`}>
          {check.overall_result}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {[...crossChecks, ...profileChecks].map((item, i) => (
          <span key={i} className={`text-xs font-mono ${item.ok ? "text-neutral-500" : "text-red-400"}`}>
            {item.ok ? "✓" : "✗"} {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
