"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShapeResult as ShapeResultView } from "@/components/shape-result";
import { AuthProvider } from "@/components/auth-provider";
import { UserMenu } from "@/components/user-menu";
import type { ShapeResult } from "@/lib/types";
import { getSupabase } from "@/lib/supabase";

export default function ShapePermalink() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<ShapeResult | null>(null);
  const [sourceText, setSourceText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const supabase = getSupabase();
    supabase
      .from("shapes")
      .select("result, source_text")
      .eq("id", id)
      .single()
      .then(({ data, error: err }: { data: { result: ShapeResult; source_text: string } | null; error: unknown }) => {
        if (err || !data) {
          setError("Shape not found");
        } else {
          setResult(data.result as ShapeResult);
          setSourceText(data.source_text);
        }
        setLoading(false);
      });
  }, [id]);

  return (
    <AuthProvider>
      <main className="min-h-screen flex flex-col items-center px-4 py-16 relative">
        <UserMenu />
        <div className="w-full max-w-3xl text-center mb-8">
          <a href="/" className="text-2xl font-bold tracking-tight text-neutral-100 hover:text-white transition-colors">
            Shape
          </a>
        </div>
        {loading && <p className="text-sm text-neutral-600">Loading…</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {result && <ShapeResultView result={result} sourceText={sourceText} />}
      </main>
    </AuthProvider>
  );
}
