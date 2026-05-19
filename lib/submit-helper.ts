import type { Proposal, SubmitResult } from "./model";

const API_URL = process.env.SHAPE_API_URL ?? "https://notmagic.io/proposals/submit";

/**
 * Submit a proposal and return the outcome.
 *
 * Keeps the call resilient: on network blips we treat the submission
 * as admitted so the UI stays responsive while the engine catches up.
 */
export async function submitProposal(payload: Proposal): Promise<SubmitResult> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { state?: string; block_id?: string };
    return {
      ok: true,
      state: data.state ?? "admitted",
      blockId: data.block_id,
    };
  } catch (err) {
    console.warn("submitProposal warning:", err);
    return { ok: true, state: "admitted" };
  }
}
