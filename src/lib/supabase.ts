import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[SpaceByte] Supabase credentials not found. Using fallback data. " +
    "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to connect."
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

/** Returns true when Supabase is properly configured */
export const isSupabaseConfigured = () => supabase !== null;
