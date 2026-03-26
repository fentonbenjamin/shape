"use client";

import { useState } from "react";
import { ShapeForm } from "@/components/shape-form";
import { ShapeResult as ShapeResultView } from "@/components/shape-result";
import type { ShapeResult } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<ShapeResult | null>(null);
  const [error, setError] = useState("");

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-100">
          Shape
        </h1>
        <p className="text-neutral-500 mt-3 text-lg">
          Paste text. Get structure. See what survived.
        </p>
      </div>

      <ShapeForm
        onResult={(data) => {
          setResult(data as ShapeResult);
          setError("");
        }}
        onError={(msg) => {
          setError(msg);
          setResult(null);
        }}
      />

      {error && (
        <p className="mt-6 text-sm text-red-400 text-center">{error}</p>
      )}

      {result && <ShapeResultView result={result} />}
    </main>
  );
}
