"use client";

import { useState } from "react";
import { ShapeForm } from "@/components/shape-form";
import { ShapeResult as ShapeResultView } from "@/components/shape-result";
import { AuthProvider } from "@/components/auth-provider";
import { UserMenu } from "@/components/user-menu";
import type { ShapeResult } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<ShapeResult | null>(null);
  const [sourceText, setSourceText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthProvider>
      <main className="min-h-screen flex flex-col items-center px-3 sm:px-4 py-8 sm:py-16 relative">
        {loading && (
          <div className="fixed top-0 left-0 right-0 h-0.5 z-50">
            <div className="h-full bg-neutral-400 animate-pulse" style={{ width: "100%" }} />
          </div>
        )}

        <UserMenu />

        <div className="w-full max-w-3xl text-center mb-6 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-100">
            Shape
          </h1>
          <p className="text-neutral-500 mt-2 sm:mt-3 text-base sm:text-lg">
            Paste text, get structured meaning.
          </p>
        </div>

        <ShapeForm
          onResult={(data, text) => {
            setResult(data as ShapeResult);
            setSourceText(text);
            setError("");
          }}
          onError={(msg) => {
            setError(msg);
            setResult(null);
          }}
          onLoading={setLoading}
        />

        {error && (
          <p className="mt-6 text-sm text-red-400 text-center">{error}</p>
        )}

        {result && <ShapeResultView result={result} sourceText={sourceText} />}
      </main>
    </AuthProvider>
  );
}
