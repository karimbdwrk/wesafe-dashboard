"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/supabaseClient";

import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { DataTable } from "./_components/data-table";
import { SectionCards } from "./_components/section-cards";

export default function Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [companiesData, setCompaniesData] = useState([]);

  useEffect(() => {
    async function init() {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        router.replace("/unauthorized");
        return;
      }
      const { data: admin } = await supabase.from("admins").select("role").eq("id", user.id).maybeSingle();
      if (admin?.role !== "super_admin") {
        router.replace("/unauthorized");
        return;
      }

      setIsAuthorized(true);

      const [{ data: profilesData, error: profilesError }, { data: companies, error: companiesError }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("*, signature_status, signature_url")
            .order("created_at", { ascending: false }),
          supabase.from("companies").select("*"),
        ]);
      if (!profilesError) setProfiles(profilesData ?? []);
      if (!companiesError) setCompaniesData(companies ?? []);
    }
    init();
  }, [router]);

  if (!isAuthorized) return null;

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={profiles} companies={companiesData} />
    </div>
  );
}
