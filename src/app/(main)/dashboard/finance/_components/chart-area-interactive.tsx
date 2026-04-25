"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/lib/supabase/supabaseClient";

export const description = "Revenus journaliers des transactions";

const chartConfig = {
  credits: {
    label: "Crédits & Tokens",
    color: "var(--chart-1)",
  },
  subscriptions: {
    label: "Abonnements",
    color: "var(--chart-2)",
  },
  sponsorships: {
    label: "Annonces sponsorisées",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const [rawData, setRawData] = React.useState<
    Record<string, { credits: number; subscriptions: number; sponsorships: number }>
  >({});

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d");
  }, [isMobile]);

  React.useEffect(() => {
    const daysToSubtract =
      timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : timeRange === "180d" ? 180 : 365;
    const from = new Date();
    from.setDate(from.getDate() - daysToSubtract);
    from.setHours(0, 0, 0, 0);

    supabase
      .from("transactions")
      .select("created_at, amount, transaction_type")
      .gte("created_at", from.toISOString())
      .then(({ data, error }) => {
        if (error) {
          console.error("[transactions] erreur:", error);
          return;
        }
        const byDay: Record<string, { credits: number; subscriptions: number; sponsorships: number }> = {};
        for (const row of data ?? []) {
          const day = row.created_at.slice(0, 10);
          if (!byDay[day]) byDay[day] = { credits: 0, subscriptions: 0, sponsorships: 0 };
          const type = row.transaction_type;
          if (type === "credit_purchase" || type === "job_post_oneshot") {
            byDay[day].credits += row.amount ?? 0;
          } else if (
            type === "subscription_standard_plus_monthly" ||
            type === "subscription_premium_monthly" ||
            type === "subscription_standard_plus_annual" ||
            type === "subscription_premium_annual"
          ) {
            byDay[day].subscriptions += row.amount ?? 0;
          } else if (
            type === "sponsorhip_purchase_one_week" ||
            type === "sponsorhip_purchase_two_week" ||
            type === "sponsorhip_purchase_one_month"
          ) {
            byDay[day].sponsorships += row.amount ?? 0;
          }
        }
        setRawData(byDay);
      });
  }, [timeRange]);

  const filteredData = React.useMemo(() => {
    const daysToSubtract =
      timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : timeRange === "180d" ? 180 : 365;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: { date: string; credits: number; subscriptions: number; sponsorships: number }[] = [];
    for (let i = daysToSubtract - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        date: key,
        credits: rawData[key]?.credits ?? 0,
        subscriptions: rawData[key]?.subscriptions ?? 0,
        sponsorships: rawData[key]?.sponsorships ?? 0,
      });
    }
    return days;
  }, [timeRange, rawData]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Revenus des transactions</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Crédits & Tokens vs Abonnements (en €)</span>
          <span className="@[540px]/card:hidden">Crédits vs Abonnements</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden *:data-[slot=toggle-group-item]:px-4!"
          >
            <ToggleGroupItem value="365d">12 derniers mois</ToggleGroupItem>
            <ToggleGroupItem value="180d">6 derniers mois</ToggleGroupItem>
            <ToggleGroupItem value="90d">3 derniers mois</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 derniers jours</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 derniers jours</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex @[767px]/card:hidden w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="3 derniers mois" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="365d" className="rounded-lg">
                12 derniers mois
              </SelectItem>
              <SelectItem value="180d" className="rounded-lg">
                6 derniers mois
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                3 derniers mois
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 derniers jours
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 derniers jours
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-62 w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCredits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-credits)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-credits)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillSubscriptions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-subscriptions)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-subscriptions)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillSponsorships" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sponsorships)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-sponsorships)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => new Date(value).toLocaleDateString("fr-FR", { month: "short", day: "numeric" })}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("fr-FR", { month: "short", day: "numeric" })
                  }
                  formatter={(value, name) => [
                    `${Number(value).toFixed(2)} €`,
                    name === "credits"
                      ? "Crédits & Tokens"
                      : name === "subscriptions"
                        ? "Abonnements"
                        : "Annonces sponsorisées",
                  ]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="sponsorships"
              type="monotone"
              fill="url(#fillSponsorships)"
              stroke="var(--color-sponsorships)"
              stackId="a"
            />
            <Area
              dataKey="subscriptions"
              type="monotone"
              fill="url(#fillSubscriptions)"
              stroke="var(--color-subscriptions)"
              stackId="a"
            />
            <Area
              dataKey="credits"
              type="monotone"
              fill="url(#fillCredits)"
              stroke="var(--color-credits)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
