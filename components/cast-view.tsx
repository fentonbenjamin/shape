"use client";

import sieveCard from "@/lib/cards/sieve_card_v1.json";

export function CastView({
  tab,
  casts,
}: {
  tab: "readable" | "json" | "card";
  casts: { review_markdown: string; host_json_view: object };
}) {
  if (tab === "readable") {
    return (
      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-sm text-neutral-300 whitespace-pre-wrap font-mono overflow-x-auto">
        {casts.review_markdown}
      </pre>
    );
  }

  if (tab === "json") {
    return (
      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-sm text-neutral-300 whitespace-pre-wrap font-mono overflow-x-auto">
        {JSON.stringify(casts.host_json_view, null, 2)}
      </pre>
    );
  }

  // tab === "card" — show the sieve card that did the shaping
  return (
    <div>
      <p className="text-xs text-neutral-600 mb-2">
        This is the card that shaped your text. The model read this contract and
        followed it.
      </p>
      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-xs text-neutral-400 whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto">
        {JSON.stringify(sieveCard, null, 2)}
      </pre>
    </div>
  );
}
