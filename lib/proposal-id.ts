import { createHash } from "crypto";
import type { Proposal } from "./model";

/**
 * Deterministic identity for a review proposal.
 *
 * Hashes the canonical payload — kind, scope, body, and the submission
 * timestamp — so two semantically identical proposals can still be
 * distinguished if they arrive at different times.
 */
export function proposalId(proposal: Proposal): string {
  const canonical = JSON.stringify({
    kind: proposal.kind,
    scope: proposal.scope,
    body: proposal.body,
    submitted_at: new Date().toISOString(),
  });
  return createHash("sha256").update(canonical).digest("hex");
}
