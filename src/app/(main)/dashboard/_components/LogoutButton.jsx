"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { supabase } from "../../../../lib/supabase/supabaseClient";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
    >
      Déconnexion
    </Button>
  );
}
