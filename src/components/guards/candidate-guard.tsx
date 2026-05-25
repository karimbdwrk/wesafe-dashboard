"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/supabaseClient";

export function CandidateGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      const { data } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();

      if (!data) {
        router.replace("/dashboard/default");
        return;
      }

      setAllowed(true);
    }

    check();
  }, [router]);

  if (!allowed) return null;

  return <>{children}</>;
}
