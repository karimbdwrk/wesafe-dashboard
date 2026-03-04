"use client";
import { supabase } from "../../../../lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
	const router = useRouter();

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push("/");
	};

	return (
		<Button
			onClick={handleLogout}
			className='px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-2'>
			Déconnexion
		</Button>
	);
}
