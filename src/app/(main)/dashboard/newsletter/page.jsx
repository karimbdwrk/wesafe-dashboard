"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Check, Copy, Download, RefreshCw, Users } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/supabaseClient";

const ROLE_LABELS = {
  candidat: { label: "Candidat", variant: "secondary" },
  company: { label: "Entreprise", variant: "default" },
};

export default function NewsletterPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("json");
  const [copied, setCopied] = useState(false);

  async function fetchSubscribers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, role, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erreur lors du chargement des abonnés.");
    } else {
      setSubscribers(data ?? []);
    }
    setLoading(false);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchSubscribers is stable — defined at module scope relative to this effect
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
      fetchSubscribers();
    }
    checkAuth();
  }, [router]);

  const filtered = roleFilter === "all" ? subscribers : subscribers.filter((s) => s.role === roleFilter);

  const candidatCount = subscribers.filter((s) => s.role === "candidat").length;
  const companyCount = subscribers.filter((s) => s.role === "company").length;

  // ─── Export helpers ────────────────────────────────────────────────────────

  function toJson(data) {
    return JSON.stringify(
      data.map((s) => ({
        email: s.email,
        role: s.role,
        inscrit_le: new Date(s.created_at).toLocaleDateString("fr-FR"),
      })),
      null,
      2,
    );
  }

  function toCsv(data) {
    const header = "email,role,inscrit_le";
    const rows = data.map((s) => `${s.email},${s.role},${new Date(s.created_at).toLocaleDateString("fr-FR")}`);
    return [header, ...rows].join("\n");
  }

  function exportContent() {
    return exportFormat === "json" ? toJson(filtered) : toCsv(filtered);
  }

  function downloadFile() {
    const content = exportContent();
    const mime = exportFormat === "json" ? "application/json" : "text/csv;charset=utf-8;";
    const ext = exportFormat === "json" ? "json" : "csv";
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(exportContent());
    setCopied(true);
    toast.success("Copié dans le presse-papier !");
    setTimeout(() => setCopied(false), 2000);
  }

  function openExport(format) {
    setExportFormat(format);
    setCopied(false);
    setExportOpen(true);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  if (!isAuthorized) return null;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl">Newsletter</h1>
          <p className="text-muted-foreground text-sm">
            {subscribers.length} abonné
            {subscribers.length > 1 ? "s" : ""}
            {" · "}
            <span className="text-foreground">{candidatCount} candidats</span>
            {" · "}
            <span className="text-foreground">{companyCount} entreprises</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={fetchSubscribers} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button variant="outline" size="sm" onClick={() => openExport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => openExport("json")}>
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filtres rôle */}
      <div className="flex gap-2">
        {["all", "candidat", "company"].map((r) => (
          <Button key={r} variant={roleFilter === r ? "default" : "outline"} size="sm" onClick={() => setRoleFilter(r)}>
            {r === "all"
              ? `Tous (${subscribers.length})`
              : r === "candidat"
                ? `Candidats (${candidatCount})`
                : `Entreprises (${companyCount})`}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Chargement…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
            <Users className="h-8 w-8 opacity-30" />
            <p className="text-sm">Aucun abonné trouvé.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b bg-muted/50 text-left text-muted-foreground text-xs uppercase tracking-wide">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr
                  key={s.id}
                  className={`border-border border-b last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"} transition-colors hover:bg-muted/40`}
                >
                  <td className="px-4 py-3 font-mono text-xs">{s.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={ROLE_LABELS[s.role]?.variant ?? "outline"}>
                      {ROLE_LABELS[s.role]?.label ?? s.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Export Dialog */}
      <AlertDialog open={exportOpen} onOpenChange={setExportOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Export {exportFormat.toUpperCase()} — {filtered.length} abonné
              {filtered.length > 1 ? "s" : ""}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="mt-2">
                <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-md border border-border bg-muted p-3 text-xs leading-relaxed">
                  {exportContent()}
                </pre>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-wrap gap-2 sm:justify-between">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyToClipboard}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
              <Button size="sm" onClick={downloadFile}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>
            <AlertDialogCancel asChild>
              <Button size="sm" variant="ghost">
                Fermer
              </Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
