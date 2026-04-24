"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/supabaseClient";

import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { SectionCards } from "./_components/section-cards";
import { TransactionsTable } from "./_components/transactions-table";

export default function Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function checkAuth() {
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
    }
    checkAuth();
  }, [router]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: isAuthorized is the intentional trigger
  useEffect(() => {
    if (!isAuthorized) return;
    async function fetchTransactions() {
      // Supabase limite à 1000 lignes par requête — on pagine jusqu'à tout récupérer
      const PAGE_SIZE = 1000;
      let allRows = [];
      let from = 0;
      while (true) {
        const { data, error } = await supabase
          .from("transactions")
          .select("id, created_at, amount, credits_added, currency, transaction_type, company_id")
          .order("created_at", { ascending: false })
          .range(from, from + PAGE_SIZE - 1);
        if (error) {
          console.error("[transactions] erreur:", error);
          break;
        }
        allRows = allRows.concat(data ?? []);
        if (!data || data.length < PAGE_SIZE) break;
        from += PAGE_SIZE;
      }
      const rows = allRows;
      const companyIds = [...new Set(rows.map((r) => r.company_id).filter(Boolean))];
      if (companyIds.length === 0) {
        setTransactions(rows);
        return;
      }

      const { data: companies } = await supabase.from("companies").select("id, name, logo_url").in("id", companyIds);

      const companiesMap = {};
      for (const c of companies ?? []) {
        companiesMap[c.id] = {
          name: c.name || "—",
          avatar: c.logo_url,
        };
      }

      setTransactions(
        rows.map((t) => ({
          ...t,
          _company: companiesMap[t.company_id] ?? null,
        })),
      );
    }
    fetchTransactions();
  }, [isAuthorized]);

  if (!isAuthorized) return null;

  return (
    <div className="flex flex-col gap-4 **:data-[slot=card]:shadow-xs">
      <SectionCards transactions={transactions} />
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <ChartAreaInteractive />
        {/* <PrimaryAccount />
              <NetWorth />
              <MonthlyCashFlow />
              <SavingsRate /> */}
      </div>

      {/* <div className='grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]'> */}
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <TransactionsTable transactions={transactions} />
        {/* <div className="flex flex-col gap-4">
                <CashFlowOverview />

                <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-2">
                  <SpendingBreakdown />
                  <IncomeReliability />
                </div>
              </div> */}

        {/* <CardOverview /> */}
      </div>
    </div>
  );
}
