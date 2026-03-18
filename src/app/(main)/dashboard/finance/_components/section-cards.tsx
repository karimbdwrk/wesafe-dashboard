"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const CREDIT_TYPES = ["credit_purchase", "job_post_oneshot"];
const SUBSCRIPTION_TYPES = [
  "subscription_standard_plus_monthly",
  "subscription_premium_monthly",
  "subscription_standard_plus_annual",
  "subscription_premium_annual",
];
const SPONSORSHIP_TYPES = [
  "sponsorhip_purchase_one_week",
  "sponsorhip_purchase_two_week",
  "sponsorhip_purchase_one_month",
];

function sumByTypes(rows: any[], types: string[]) {
  return rows
    .filter((r) => types.includes(r.transaction_type))
    .reduce((acc, r) => acc + (r.amount ?? 0), 0);
}

function formatEur(val: number) {
  return val.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function pctChange(curr: number, prev: number) {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
}

interface SectionCardsProps {
  transactions: any[];
}

export function SectionCards({ transactions = [] }: SectionCardsProps) {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const thisMonth = useMemo(
    () => transactions.filter((r) => new Date(r.created_at) >= startOfThisMonth),
    [transactions]
  );
  const lastMonth = useMemo(
    () => transactions.filter((r) => {
      const d = new Date(r.created_at);
      return d >= startOfLastMonth && d < startOfThisMonth;
    }),
    [transactions]
  );

  const kpis = useMemo(() => {
    const allTypes = [...CREDIT_TYPES, ...SUBSCRIPTION_TYPES, ...SPONSORSHIP_TYPES];
    return [
      {
        label: "Revenus totaux (mois)",
        curr: sumByTypes(thisMonth, allTypes),
        prev: sumByTypes(lastMonth, allTypes),
        sub: "Crédits + Abonnements + Sponsoring",
      },
      {
        label: "Crédits & Tokens",
        curr: sumByTypes(thisMonth, CREDIT_TYPES),
        prev: sumByTypes(lastMonth, CREDIT_TYPES),
        sub: "credit_purchase + job_post_oneshot",
      },
      {
        label: "Abonnements",
        curr: sumByTypes(thisMonth, SUBSCRIPTION_TYPES),
        prev: sumByTypes(lastMonth, SUBSCRIPTION_TYPES),
        sub: "Standard+ & Premium",
      },
      {
        label: "Annonces sponsorisées",
        curr: sumByTypes(thisMonth, SPONSORSHIP_TYPES),
        prev: sumByTypes(lastMonth, SPONSORSHIP_TYPES),
        sub: "1 sem / 2 sem / 1 mois",
      },
    ];
  }, [thisMonth, lastMonth]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      {kpis.map((kpi) => {
        const pct = pctChange(kpi.curr, kpi.prev);
        const up = pct >= 0;
        return (
          <Card key={kpi.label} className="@container/card">
            <CardHeader>
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
                {formatEur(kpi.curr)}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {up ? <TrendingUp /> : <TrendingDown />}
                  {pct >= 0 ? "+" : ""}{pct.toFixed(1)}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {up ? "En hausse vs mois dernier" : "En baisse vs mois dernier"}
                {up ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
              </div>
              <div className="text-muted-foreground">{kpi.sub}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
