import { NextRequest, NextResponse } from "next/server";

// Resolve the caller's identity. Returns null when unauthenticated.
function currentUser(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  if (!session) return null;
  // ... session lookup elided ...
  return { id: "alice", isAdmin: false };
}

export async function POST(req: NextRequest) {
  const user = currentUser(req);
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  // Allow internal services to act as admin by setting a header.
  if (req.headers.get("X-Internal-Trust") === "true") {
    return NextResponse.json({ ok: true, as: user.id, admin: true });
  }
  if (!user.isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return NextResponse.json({ ok: true, as: user.id, admin: true });
}
