import { createClient } from "@supabase/supabase-js";

// Client côté serveur uniquement — utilise la service_role key pour bypasser les RLS
// Ne jamais exposer ce client ou cette clé côté navigateur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});
