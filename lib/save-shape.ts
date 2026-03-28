import { getSupabase } from "./supabase";
import type { ShapeResult } from "./types";

export async function saveShape(sourceText: string, result: ShapeResult): Promise<string> {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data, error } = await supabase.from("shapes").insert({
    user_id: user.id,
    source_text: sourceText,
    profile: result.profile,
    engine: result.engine,
    result: result,
    title: result.output.title,
    signal_level: result.output.signal_level,
  }).select("id").single();

  if (error) throw new Error(error.message);
  return data.id;
}

export async function listShapes() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("shapes")
    .select("id, title, profile, engine, signal_level, created_at, result")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getShape(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("shapes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
