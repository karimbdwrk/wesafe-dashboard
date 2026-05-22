"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { Bar, CartesianGrid, ComposedChart, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CATEGORY } from "@/constants/categories";
import { supabase } from "@/lib/supabase/supabaseClient";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCatAcronym(id) {
  return CATEGORY.find((c) => c.id === id)?.acronym ?? id ?? "—";
}

function getInitials(firstname, lastname) {
  return `${(firstname ?? "").charAt(0)}${(lastname ?? "").charAt(0)}`.toUpperCase();
}

function formatDuration(ms) {
  if (ms === null || ms === undefined || Number.isNaN(ms) || ms <= 0) return "—";
  const minutes = ms / 60000;
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} h`;
  const days = hours / 24;
  return `${Math.round(days)} j`;
}

const PERIOD_OPTIONS = [
  { value: "1w", label: "1 sem." },
  { value: "1m", label: "1 mois" },
  { value: "6m", label: "6 mois" },
  { value: "1y", label: "1 an" },
];

const PERIOD_DAYS = { "1w": 7, "1m": 30, "6m": 180, "1y": 365 };

function getDayLabel(date) {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function getWeekStartKey(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d.toISOString().slice(0, 10);
}

function getWeekLabel(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(date) {
  return date.toLocaleDateString("fr-FR", {
    month: "short",
    year: "2-digit",
  });
}

function buildTimeSeries(period, jobs, apps) {
  const days = PERIOD_DAYS[period];
  const granularity = period === "1w" || period === "1m" ? "day" : period === "6m" ? "week" : "month";
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const buckets = new Map();

  if (granularity === "day") {
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      buckets.set(key, {
        label: getDayLabel(d),
        missions: 0,
        candidatures: 0,
      });
    }
  } else if (granularity === "week") {
    let d = new Date(startDate);
    const dayOfWeek = d.getDay();
    d.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    while (d <= now) {
      const key = d.toISOString().slice(0, 10);
      if (!buckets.has(key)) {
        buckets.set(key, {
          label: getWeekLabel(d),
          missions: 0,
          candidatures: 0,
        });
      }
      d = new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  } else {
    let d = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    while (d <= now) {
      const key = getMonthKey(d);
      if (!buckets.has(key)) {
        buckets.set(key, {
          label: getMonthLabel(d),
          missions: 0,
          candidatures: 0,
        });
      }
      d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    }
  }

  for (const j of jobs) {
    const date = new Date(j.created_at);
    if (date < startDate) continue;
    const key =
      granularity === "day"
        ? date.toISOString().slice(0, 10)
        : granularity === "week"
          ? getWeekStartKey(date)
          : getMonthKey(date);
    const bucket = buckets.get(key);
    if (bucket) bucket.missions++;
  }

  for (const a of apps) {
    const date = new Date(a.created_at);
    if (date < startDate) continue;
    const key =
      granularity === "day"
        ? date.toISOString().slice(0, 10)
        : granularity === "week"
          ? getWeekStartKey(date)
          : getMonthKey(date);
    const bucket = buckets.get(key);
    if (bucket) bucket.candidatures++;
  }

  return Array.from(buckets.values());
}

function buildCategoryData(period, jobs, apps) {
  const days = PERIOD_DAYS[period];
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const filteredJobs = jobs.filter((j) => new Date(j.created_at) >= startDate);
  const filteredApps = apps.filter((a) => new Date(a.created_at) >= startDate);

  const catMap = new Map();
  for (const j of filteredJobs) {
    if (!j.category) continue;
    if (!catMap.has(j.category)) {
      catMap.set(j.category, {
        name: getCatAcronym(j.category),
        missions: 0,
        candidatures: 0,
      });
    }
    catMap.get(j.category).missions++;
  }
  for (const a of filteredApps) {
    const catId = a.jobs?.category;
    if (!catId || !catMap.has(catId)) continue;
    catMap.get(catId).candidatures++;
  }

  return Array.from(catMap.values()).sort((a, b) => b.missions - a.missions);
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTip({ active, payload, label, totalMissions }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background p-2.5 shadow-md text-xs">
      <p className="font-semibold mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-1.5">
          <span className="size-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-muted-foreground">
            {p.name} : <span className="text-foreground font-medium">{p.value}</span>
            {totalMissions != null && p.dataKey === "missions" && totalMissions > 0 && (
              <span className="text-muted-foreground">
                {" "}
                ({Math.round((p.value / totalMissions) * 100)}
                %)
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Chart configs ────────────────────────────────────────────────────────────

const lineConfig = {
  missions: { label: "Missions créées", color: "var(--chart-1)" },
  candidatures: {
    label: "Candidatures reçues",
    color: "var(--chart-2)",
  },
};

const barConfig = {
  missions: { label: "Missions", color: "var(--chart-1)" },
  candidatures: { label: "Candidatures", color: "var(--chart-2)" },
};

// ─── Chart components ─────────────────────────────────────────────────────────

function MissionsLineChart({ data }) {
  return (
    <ChartContainer config={lineConfig} className="min-h-50 w-full">
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          content={({ active, payload, label }) => <ChartTip active={active} payload={payload} label={label} />}
        />
        <Line
          type="monotone"
          dataKey="missions"
          name="Missions créées"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="candidatures"
          name="Candidatures reçues"
          stroke="var(--chart-2)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

function CategoryBarChart({ data }) {
  const totalMissions = data.reduce((s, d) => s + d.missions, 0);
  return (
    <ChartContainer config={barConfig} className="min-h-55 w-full">
      <ComposedChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 35 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <ChartTip active={active} payload={payload} label={label} totalMissions={totalMissions} />
          )}
        />
        <Bar yAxisId="left" dataKey="missions" name="Missions" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="candidatures"
          name="Candidatures"
          stroke="var(--chart-2)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ChartContainer>
  );
}

// ─── Legend dot ───────────────────────────────────────────────────────────────

function ChartLegend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-chart-1" />
        Missions
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-chart-2" />
        Candidatures
      </span>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-1 pt-4 px-4">
        <CardDescription className="text-[11px] leading-tight">{label}</CardDescription>
        <CardTitle className="text-2xl font-bold tabular-nums tracking-tight">{value}</CardTitle>
      </CardHeader>
      {sub && (
        <CardContent className="pt-0 px-4 pb-4">
          <p className="text-muted-foreground text-[11px]">{sub}</p>
        </CardContent>
      )}
    </Card>
  );
}

// ─── Section title ────────────────────────────────────────────────────────────

function SectionTitle({ title, badge }) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="font-semibold text-base">{title}</h2>
      {badge}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no id
          <div key={i} className="rounded-xl border p-4 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-14" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no id
          <div key={i} className="rounded-xl border p-4 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [period, setPeriod] = useState("6m");

  // biome-ignore lint/correctness/useExhaustiveDependencies: router is stable
  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/unauthorized");
        return;
      }

      const { data: company } = await supabase.from("companies").select("id").eq("id", user.id).maybeSingle();

      if (!company) {
        setLoading(false);
        return;
      }

      const companyId = company.id;

      const [jobsResult, appsResult] = await Promise.all([
        supabase.from("jobs").select("*").eq("company_id", companyId).order("created_at", { ascending: true }),
        supabase
          .from("applications")
          .select(
            "id, created_at, updated_at, current_status, jobs(id, isLastMinute, category), profiles(id, firstname, lastname, avatar_url)",
          )
          .eq("company_id", companyId)
          .order("created_at", { ascending: true }),
      ]);

      setJobs(jobsResult.data ?? []);
      setApplications(appsResult.data ?? []);
      setLoading(false);
    }
    init();
  }, []);

  const now = useMemo(() => new Date(), []);
  const todayStr = now.toISOString().split("T")[0];
  const sevenDaysAgo = useMemo(() => new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), [now]);

  // ── Segmentation ──────────────────────────────────────────────────────────

  const classicJobs = useMemo(() => jobs.filter((j) => !j.isLastMinute && j.status !== "archived"), [jobs]);
  const classicActiveJobs = useMemo(() => classicJobs.filter((j) => j.status === "published"), [classicJobs]);
  const lmJobs = useMemo(() => jobs.filter((j) => j.isLastMinute), [jobs]);
  const lmActiveJobs = useMemo(
    () => lmJobs.filter((j) => new Date(j.created_at) >= sevenDaysAgo && (!j.start_date || j.start_date >= todayStr)),
    [lmJobs, sevenDaysAgo, todayStr],
  );

  const classicApps = useMemo(() => applications.filter((a) => !a.jobs?.isLastMinute), [applications]);
  const lmApps = useMemo(() => applications.filter((a) => !!a.jobs?.isLastMinute), [applications]);

  // ── Classic KPIs ──────────────────────────────────────────────────────────

  const classicSignedApps = useMemo(
    () => classicApps.filter((a) => a.current_status === "contract_signed_pro"),
    [classicApps],
  );

  const classicJobsWithContract = useMemo(() => {
    const jobIds = new Set(classicSignedApps.map((a) => a.jobs?.id).filter(Boolean));
    return classicActiveJobs.filter((j) => jobIds.has(j.id)).length;
  }, [classicActiveJobs, classicSignedApps]);

  const classicTauxPourvoi =
    classicActiveJobs.length > 0 ? Math.round((classicJobsWithContract / classicActiveJobs.length) * 100) : 0;

  const classicAgentsRecrutés = useMemo(
    () => new Set(classicSignedApps.map((a) => a.profiles?.id).filter(Boolean)).size,
    [classicSignedApps],
  );

  const classicAvgTime = useMemo(() => {
    if (!classicSignedApps.length) return null;
    const total = classicSignedApps.reduce((sum, a) => {
      const start = new Date(a.created_at).getTime();
      const end = new Date(a.updated_at ?? a.created_at).getTime();
      return sum + Math.max(0, end - start);
    }, 0);
    return total / classicSignedApps.length;
  }, [classicSignedApps]);

  const classicMoyApps =
    classicActiveJobs.length > 0 ? (classicApps.length / classicActiveJobs.length).toFixed(1) : "—";

  // ── LM KPIs ───────────────────────────────────────────────────────────────

  const lmSignedApps = useMemo(() => lmApps.filter((a) => a.current_status === "contract_signed_pro"), [lmApps]);

  const lmJobsWithContract = useMemo(() => {
    const jobIds = new Set(lmSignedApps.map((a) => a.jobs?.id).filter(Boolean));
    return lmActiveJobs.filter((j) => jobIds.has(j.id)).length;
  }, [lmActiveJobs, lmSignedApps]);

  const lmTauxPourvoi = lmActiveJobs.length > 0 ? Math.round((lmJobsWithContract / lmActiveJobs.length) * 100) : 0;

  const lmAgentsRecrutés = useMemo(
    () => new Set(lmSignedApps.map((a) => a.profiles?.id).filter(Boolean)).size,
    [lmSignedApps],
  );

  const lmAvgTime = useMemo(() => {
    if (!lmSignedApps.length) return null;
    const total = lmSignedApps.reduce((sum, a) => {
      const start = new Date(a.created_at).getTime();
      const end = new Date(a.updated_at ?? a.created_at).getTime();
      return sum + Math.max(0, end - start);
    }, 0);
    return total / lmSignedApps.length;
  }, [lmSignedApps]);

  const lmMoyApps = lmActiveJobs.length > 0 ? (lmApps.length / lmActiveJobs.length).toFixed(1) : "—";

  // ── Chart data ────────────────────────────────────────────────────────────

  const classicLineData = useMemo(
    () => buildTimeSeries(period, classicJobs, classicApps),
    [period, classicJobs, classicApps],
  );
  const classicCategoryData = useMemo(
    () => buildCategoryData(period, classicJobs, classicApps),
    [period, classicJobs, classicApps],
  );
  const lmLineData = useMemo(() => buildTimeSeries(period, lmJobs, lmApps), [period, lmJobs, lmApps]);
  const lmCategoryData = useMemo(() => buildCategoryData(period, lmJobs, lmApps), [period, lmJobs, lmApps]);

  // ── Top agents ────────────────────────────────────────────────────────────

  const topAgents = useMemo(() => {
    const agentMap = new Map();
    for (const app of [...classicSignedApps, ...lmSignedApps]) {
      const profile = app.profiles;
      if (!profile?.id) continue;
      if (!agentMap.has(profile.id)) {
        agentMap.set(profile.id, { profile, count: 0 });
      }
      agentMap.get(profile.id).count++;
    }
    return Array.from(agentMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [classicSignedApps, lmSignedApps]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="@container/main flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Statistiques</h1>
        <p className="text-muted-foreground text-sm mt-1">Performance de vos recrutements</p>
      </div>

      {loading ? (
        <PageSkeleton />
      ) : (
        <>
          {/* ── Period selector ── */}
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm shrink-0">Période des graphiques :</span>
            <ToggleGroup type="single" value={period} onValueChange={(v) => v && setPeriod(v)} className="gap-1">
              {PERIOD_OPTIONS.map((o) => (
                <ToggleGroupItem key={o.value} value={o.value} className="text-xs px-3 h-8">
                  {o.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* ════════════════════ MISSIONS CLASSIQUES ════════════════════ */}
          <section className="flex flex-col gap-4">
            <SectionTitle title="Missions classiques" />

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
              <KpiCard label="Missions publiées" value={classicActiveJobs.length} />
              <KpiCard label="Candidatures reçues" value={classicApps.length} />
              <KpiCard
                label="Taux de pourvoi"
                value={`${classicTauxPourvoi}%`}
                sub={`${classicJobsWithContract} mission${classicJobsWithContract !== 1 ? "s" : ""} pourvue${classicJobsWithContract !== 1 ? "s" : ""}`}
              />
              <KpiCard
                label="Temps moyen de recrutement"
                value={formatDuration(classicAvgTime)}
                sub="De la candidature au contrat signé"
              />
              <KpiCard label="Agents recrutés" value={classicAgentsRecrutés} />
              <KpiCard label="Moy. candidatures / mission" value={classicMoyApps} />
            </div>

            {/* Charts */}
            {classicJobs.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-sm font-medium">Missions créées</CardTitle>
                        <CardDescription className="text-xs">Missions créées et candidatures reçues</CardDescription>
                      </div>
                      <ChartLegend />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {classicLineData.some((d) => d.missions > 0 || d.candidatures > 0) ? (
                      <MissionsLineChart data={classicLineData} />
                    ) : (
                      <p className="text-center text-muted-foreground text-sm py-12">
                        Aucune mission créée sur cette période.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-sm font-medium">Répartition par poste</CardTitle>
                        <CardDescription className="text-xs">Missions et candidatures par catégorie</CardDescription>
                      </div>
                      <ChartLegend />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {classicCategoryData.length > 0 ? (
                      <CategoryBarChart data={classicCategoryData} />
                    ) : (
                      <p className="text-center text-muted-foreground text-sm py-12">
                        Aucune donnée pour cette période.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed py-12 text-center">
                <p className="text-muted-foreground text-sm">Aucune mission classique publiée.</p>
              </div>
            )}
          </section>

          {/* ════════════════════ MISSIONS LAST MINUTE ════════════════════ */}
          {lmJobs.length > 0 && (
            <section className="flex flex-col gap-4">
              <SectionTitle
                title="Missions Last Minute"
                badge={
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[11px]"
                  >
                    ⚡ Last Minute
                  </Badge>
                }
              />

              {/* KPIs LM */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
                <KpiCard label="Missions LM actives" value={lmActiveJobs.length} sub="Créées < 7j, démarrage à venir" />
                <KpiCard label="Candidatures reçues" value={lmApps.length} />
                <KpiCard
                  label="Taux de pourvoi LM"
                  value={`${lmTauxPourvoi}%`}
                  sub={`${lmJobsWithContract} mission${lmJobsWithContract !== 1 ? "s" : ""} pourvue${lmJobsWithContract !== 1 ? "s" : ""}`}
                />
                <KpiCard
                  label="Temps moyen de pourvoi LM"
                  value={formatDuration(lmAvgTime)}
                  sub="De la candidature au contrat signé"
                />
                <KpiCard label="Agents recrutés LM" value={lmAgentsRecrutés} />
                <KpiCard label="Moy. candidatures / mission LM" value={lmMoyApps} />
              </div>

              {/* Charts LM */}
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-sm font-medium">Missions LM publiées</CardTitle>
                        <CardDescription className="text-xs">Missions LM créées et candidatures reçues</CardDescription>
                      </div>
                      <ChartLegend />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <MissionsLineChart data={lmLineData} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-sm font-medium">Répartition postes LM</CardTitle>
                        <CardDescription className="text-xs">Missions et candidatures par catégorie</CardDescription>
                      </div>
                      <ChartLegend />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {lmCategoryData.length > 0 ? (
                      <CategoryBarChart data={lmCategoryData} />
                    ) : (
                      <p className="text-center text-muted-foreground text-sm py-12">
                        Aucune donnée pour cette période.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* ════════════════════ TOP AGENTS ════════════════════ */}
          {topAgents.length > 0 && (
            <section className="flex flex-col gap-4">
              <SectionTitle title="Top Agents" />
              <div className="grid gap-3 sm:grid-cols-3">
                {topAgents.map(({ profile, count }, i) => {
                  const rankColors = ["text-amber-500", "text-slate-400", "text-amber-700"];
                  return (
                    <Card key={profile.id}>
                      <CardContent className="flex items-center gap-4 pt-5 pb-5">
                        <span
                          className={`text-2xl font-black tabular-nums shrink-0 ${rankColors[i] ?? "text-muted-foreground"}`}
                        >
                          #{i + 1}
                        </span>
                        <Avatar className="size-12 shrink-0 border">
                          <AvatarImage src={profile.avatar_url} />
                          <AvatarFallback>{getInitials(profile.firstname, profile.lastname)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm truncate">
                            {`${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim() || "—"}
                          </p>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            {count} contrat
                            {count > 1 ? "s" : ""} signé
                            {count > 1 ? "s" : ""}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Empty state ── */}
          {jobs.length === 0 && applications.length === 0 && (
            <div className="rounded-xl border border-dashed py-20 text-center">
              <p className="font-medium text-muted-foreground">Aucune donnée disponible</p>
              <p className="text-muted-foreground text-sm mt-1">
                Publiez des offres et recevez des candidatures pour voir vos statistiques.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
