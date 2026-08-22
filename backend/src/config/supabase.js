import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://placeholder-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en frontend/.env",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
