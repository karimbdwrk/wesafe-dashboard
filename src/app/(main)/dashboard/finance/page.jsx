"use client";

import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TransactionsTable } from "./_components/transactions-table";
import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { CardOverview } from "./_components/card-overview";
import { CashFlowOverview } from "./_components/cash-flow-overview";
import { IncomeReliability } from "./_components/income-reliability";
import { MonthlyCashFlow } from "./_components/kpis/monthly-cash-flow";
import { NetWorth } from "./_components/kpis/net-worth";
import { PrimaryAccount } from "./_components/kpis/primary-account";
import { SavingsRate } from "./_components/kpis/savings-rate";
import { SpendingBreakdown } from "./_components/spending-breakdown";

import { supabase } from "@/lib/supabase/supabaseClient";

export default function Page() {
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		async function fetchTransactions() {
			// Supabase limite à 1000 lignes par requête — on pagine jusqu'à tout récupérer
			const PAGE_SIZE = 1000;
			let allRows = [];
			let from = 0;
			while (true) {
				const { data, error } = await supabase
					.from("transactions")
					.select(
						"id, created_at, amount, credits_added, currency, transaction_type, company_id",
					)
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
			const companyIds = [
				...new Set(rows.map((r) => r.company_id).filter(Boolean)),
			];
			if (companyIds.length === 0) {
				setTransactions(rows);
				return;
			}

			const { data: companies } = await supabase
				.from("companies")
				.select("id, name, logo_url")
				.in("id", companyIds);

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
	}, []);

	return (
		<div>
			<Tabs className='gap-4' defaultValue='overview'>
				<TabsList>
					<TabsTrigger value='overview'>Overview</TabsTrigger>
					<TabsTrigger disabled value='activity'>
						Activity
					</TabsTrigger>
					<TabsTrigger disabled value='insights'>
						Insights
					</TabsTrigger>
					<TabsTrigger disabled value='utilities'>
						Utilities
					</TabsTrigger>
				</TabsList>

				<TabsContent value='overview'>
					<div className='flex flex-col gap-4 **:data-[slot=card]:shadow-xs'>
						{/* <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:gap-2 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"> */}
						<div className='@container/main flex flex-col gap-4 md:gap-6'>
							<ChartAreaInteractive />
							{/* <PrimaryAccount />
              <NetWorth />
              <MonthlyCashFlow />
              <SavingsRate /> */}
						</div>

						{/* <div className='grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]'> */}
						<div className='@container/main flex flex-col gap-4 md:gap-6'>
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
				</TabsContent>
			</Tabs>
		</div>
	);
}
