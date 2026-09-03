import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan SUPABASE_URL y SUPABASE_ANON_KEY en backend/.env");
}

// Exportación por defecto para el servidor de Node
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
