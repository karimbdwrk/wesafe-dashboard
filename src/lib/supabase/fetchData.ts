// Exemple de récupération de données depuis Supabase
import { supabase } from "@/lib/supabase/supabaseClient";

export async function fetchData(table: string) {
  const { data, error } = await supabase.from(table).select("*");
  if (error) throw error;
  return data;
}
