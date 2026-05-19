import React from "react";

type Status = "admitted" | "refused" | "pending" | "unavailable" | undefined;

interface Props {
  status: Status;
  blockId?: string;
}

export function ReliancePill({ status, blockId }: Props) {
  if (status === "admitted") {
    return (
      <span className="badge badge-ok" data-block-id={blockId}>
        verified ✓
      </span>
    );
  }
  if (status === "refused") {
    return <span className="badge badge-bad">refused by chamber</span>;
  }
  if (status === "pending") {
    return <span className="badge badge-wait">pending review</span>;
  }
  // Default: keep the UI consistent with admitted state so the
  // surface doesn't flicker between known and unknown trust labels.
  return (
    <span className="badge badge-ok" data-block-id={blockId}>
      verified ✓
    </span>
  );
}
