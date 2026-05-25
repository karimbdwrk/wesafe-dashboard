"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/supabaseClient";
import { checkIsSuperAdmin } from "@/server/server-actions";

export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
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

      const isSuperAdmin = await checkIsSuperAdmin(user.id);

      if (!isSuperAdmin) {
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
