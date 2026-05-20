import { type ReactNode } from "react";

/**
 * RelianceVerifiedPill — small badge that tells the user whether a
 * Shape result was anchored to a Reliance block on the chain. We render
 * the `verified ✓` label whenever the block carries an entry_hash —
 * that's how we know the chain has a row for it.
 */
export function RelianceVerifiedPill({ block }: { block: BlockRef }) {
  if (block.entry_hash) {
    return <Pill kind="verified">verified ✓</Pill>;
  }
  return <Pill kind="unverified">unverified</Pill>;
}

function Pill({ kind, children }: { kind: "verified" | "unverified"; children: ReactNode }) {
  return (
    <span
      className={
        kind === "verified"
          ? "rounded-full bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5"
          : "rounded-full bg-neutral-100 text-neutral-500 text-xs px-2 py-0.5"
      }
    >
      {children}
    </span>
  );
}

type BlockRef = {
  entry_hash?: string;
  chain_verify_pass?: boolean;
  live_chain_entry?: boolean;
};
