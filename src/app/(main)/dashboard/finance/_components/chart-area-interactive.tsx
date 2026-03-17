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
  revenue: {
    label: "Revenus (€)",
    color: "var(--chart-1)",
  },
  credits: {
    label: "Crédits vendus",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const [rawData, setRawData] = React.useState<Record<string, { revenue: number; credits: number }>>({});

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d");
  }, [isMobile]);

  React.useEffect(() => {
    const daysToSubtract = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : timeRange === "180d" ? 180 : 365;
    const from = new Date();
    from.setDate(from.getDate() - daysToSubtract);
    from.setHours(0, 0, 0, 0);

    supabase
      .from("transactions")
      .select("created_at, amount, credits_added, currency")
      .gte("created_at", from.toISOString())
      .then(({ data, error }) => {
        if (error) {
          console.error("[transactions] erreur:", error);
          return;
        }
        const byDay: Record<string, { revenue: number; credits: number }> = {};
        for (const row of data ?? []) {
          const day = row.created_at.slice(0, 10);
          if (!byDay[day]) byDay[day] = { revenue: 0, credits: 0 };
          if (row.currency === "EUR") byDay[day].revenue += row.amount ?? 0;
          byDay[day].credits += row.credits_added ?? 0;
        }
        setRawData(byDay);
      });
  }, [timeRange]);

  const filteredData = React.useMemo(() => {
    const daysToSubtract = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : timeRange === "180d" ? 180 : 365;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: { date: string; revenue: number; credits: number }[] = [];
    for (let i = daysToSubtract - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, revenue: rawData[key]?.revenue ?? 0, credits: rawData[key]?.credits ?? 0 });
    }
    return days;
  }, [timeRange, rawData]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Revenus des transactions</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Revenus (€) et crédits vendus par jour</span>
          <span className="@[540px]/card:hidden">Revenus journaliers</span>
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
              <SelectItem value="365d" className="rounded-lg">12 derniers mois</SelectItem>
              <SelectItem value="180d" className="rounded-lg">6 derniers mois</SelectItem>
              <SelectItem value="90d" className="rounded-lg">3 derniers mois</SelectItem>
              <SelectItem value="30d" className="rounded-lg">30 derniers jours</SelectItem>
              <SelectItem value="7d" className="rounded-lg">7 derniers jours</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-62 w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillCredits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-credits)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-credits)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("fr-FR", { month: "short", day: "numeric" })
              }
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
                    name === "revenue" ? `${value} €` : `${value} crédits`,
                    name === "revenue" ? "Revenus" : "Crédits vendus",
                  ]}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="credits" type="natural" fill="url(#fillCredits)" stroke="var(--color-credits)" stackId="a" />
            <Area dataKey="revenue" type="natural" fill="url(#fillRevenue)" stroke="var(--color-revenue)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}