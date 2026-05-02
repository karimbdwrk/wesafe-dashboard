"use client";

import { useEffect, useRef, useState } from "react";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Pencil,
  Save,
  Smartphone,
  Upload,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/supabaseClient";

const COMPANY_STATUS_CONFIG = {
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  },
  pending: {
    label: "En attente de validation",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  rejected: {
    label: "Refusée",
    className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  },
  suspended: {
    label: "Suspendue",
    className: "bg-muted text-muted-foreground",
  },
};

const DOC_STATUS_CONFIG = {
  verified: {
    label: "Vérifié",
    icon: CheckCircle2,
    className:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  pending: {
    label: "En attente",
    icon: Clock,
    className:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  rejected: {
    label: "Refusé",
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
};

function KbisCard({ company, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [signedUrl, setSignedUrl] = useState(null);
  const [siret, setSiret] = useState(company?.siret ?? "");
  const inputRef = useRef(null);

  const status = company?.kbis_verification_status;
  const url = company?.kbis_url;
  const cfg = DOC_STATUS_CONFIG[status];
  const StatusIcon = cfg?.icon ?? AlertCircle;
  const isVerified = status === "verified";

  useEffect(() => {
    setSiret(company?.siret ?? "");
  }, [company?.siret]);

  useEffect(() => {
    if (!url) return setSignedUrl(null);
    // Use the stored URL directly — bucket is public, no signed URL needed
    setSignedUrl(url);
  }, [url]);

  function formatSiret(value) {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,5})$/, (_, a, b, c, d) =>
      [a, b, c, d].filter(Boolean).join(" "),
    );
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file || !company?.id) return;
    e.target.value = "";

    const rawSiret = siret.replace(/\D/g, "");
    if (rawSiret.length > 0 && rawSiret.length !== 14) {
      toast.error("Le numéro SIRET doit comporter 14 chiffres.");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${company.id}/kbis-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("pro-documents").upload(path, file, { upsert: true });
    if (uploadError) {
      toast.error("Erreur upload", { description: uploadError.message });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("pro-documents").getPublicUrl(path);
    const docUrl = urlData.publicUrl;

    const payload = {
      kbis_url: docUrl,
      kbis_verification_status: "pending",
      ...(rawSiret.length === 14 ? { siret: rawSiret } : {}),
    };
    const { error: updateError } = await supabase.from("companies").update(payload).eq("id", company.id);
    if (updateError) {
      toast.error("Erreur lors de la mise à jour", { description: updateError.message });
    } else {
      toast.success("KBIS envoyé — en attente de vérification.");
      onUpdate(payload);
    }
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold">Extrait KBIS</p>
          <p className="text-muted-foreground text-sm">
            Document officiel attestant l'existence de votre entreprise. PDF ou image, de moins de 3 mois.
          </p>
        </div>
        {cfg ? (
          <Badge variant="outline" className={`flex shrink-0 items-center gap-1.5 ${cfg.className}`}>
            <StatusIcon className="size-3" />
            {cfg.label}
          </Badge>
        ) : (
          <Badge variant="outline" className="shrink-0 text-muted-foreground">
            Non envoyé
          </Badge>
        )}
      </div>

      {status === "rejected" && company?.reject_message && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <strong>Motif de refus :</strong> {company.reject_message}
        </div>
      )}

      {/* SIRET */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="siret" className="text-sm">
          Numéro SIRET
        </Label>
        <Input
          id="siret"
          value={siret}
          onChange={(e) => setSiret(formatSiret(e.target.value))}
          placeholder="000 000 000 00000"
          disabled={isVerified}
          className="font-mono"
          maxLength={17}
        />
        {company?.siret && isVerified && (
          <p className="text-muted-foreground text-xs">SIRET validé par notre équipe.</p>
        )}
      </div>

      {signedUrl && (
        <a
          href={signedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit items-center gap-1.5 text-primary text-sm hover:underline"
        >
          <FileText className="size-4 shrink-0" />
          <span className="truncate max-w-48">
            {decodeURIComponent(signedUrl.split("/").pop()?.split("?")[0] ?? "Document actuel")}
          </span>
        </a>
      )}

      <div className="flex flex-col gap-1.5">
        <input
          type="file"
          accept="application/pdf,image/*"
          ref={inputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          disabled={uploading || isVerified}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-1.5 size-3.5" />
          {uploading
            ? "Upload en cours…"
            : isVerified
              ? "Document validé"
              : url
                ? "Remplacer le document"
                : "Envoyer le document"}
        </Button>
        {isVerified && (
          <p className="text-muted-foreground text-xs">Vérifié et validé — contactez le support pour modifier.</p>
        )}
      </div>
    </div>
  );
}

function AppOnlyCard({ label, description, statusKey, urlKey, company }) {
  const status = company?.[statusKey];
  const cfg = DOC_STATUS_CONFIG[status];
  const StatusIcon = cfg?.icon ?? AlertCircle;

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold">{label}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        {cfg ? (
          <Badge variant="outline" className={`flex shrink-0 items-center gap-1.5 ${cfg.className}`}>
            <StatusIcon className="size-3" />
            {cfg.label}
          </Badge>
        ) : (
          <Badge variant="outline" className="shrink-0 text-muted-foreground">
            Non envoyé
          </Badge>
        )}
      </div>

      {status === "rejected" && company?.reject_message && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <strong>Motif de refus :</strong> {company.reject_message}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
        <Smartphone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          Cette action doit être effectuée depuis l'application mobile <strong>WeSafe</strong>. Ouvrez l'app et
          rendez-vous dans la section <strong>Mon profil → Documents</strong>.
        </p>
      </div>
    </div>
  );
}

export default function CompanyPage() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", description: "" });
  const logoInputRef = useRef(null);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setLoading(false);

      const { data } = await supabase.from("companies").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setCompany(data);
        setForm({ name: data.name ?? "", email: data.email ?? "", description: data.description ?? "" });
      }
      setLoading(false);
    }
    init();
  }, []);

  function handleDocUpdate(payload) {
    setCompany((prev) => ({ ...prev, ...payload }));
  }

  async function handleSaveInfo(e) {
    e.preventDefault();
    if (!company?.id) return;
    setSaving(true);
    const { error } = await supabase
      .from("companies")
      .update({ name: form.name, email: form.email, description: form.description })
      .eq("id", company.id);
    if (error) {
      toast.error("Erreur lors de la sauvegarde", { description: error.message });
    } else {
      toast.success("Informations mises à jour.");
      setCompany((prev) => ({ ...prev, name: form.name, email: form.email, description: form.description }));
      setEditMode(false);
    }
    setSaving(false);
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !company?.id) return;
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      toast.error("Sélectionnez une image (jpg, png, webp…)");
      return;
    }
    setLogoUploading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("Session expirée, reconnectez-vous.");

      const ext = file.name.split(".").pop();
      const filename = `logo-${Date.now()}.${ext}`;
      const path = `${company.id}/${filename}`;

      const formData = new FormData();
      formData.append("file", file, filename);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/logos/${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          "x-upsert": "true",
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Erreur ${res.status}`);
      }

      const logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${path}`;
      const { error: updateError } = await supabase
        .from("companies")
        .update({ logo_url: logoUrl })
        .eq("id", company.id);
      if (updateError) {
        toast.error("Erreur mise à jour logo", { description: updateError.message });
      } else {
        toast.success("Logo mis à jour.");
        setCompany((prev) => ({ ...prev, logo_url: logoUrl }));
      }
    } catch (err) {
      toast.error("Erreur upload logo", { description: err.message });
    }
    setLogoUploading(false);
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
        <Building2 className="size-10 text-muted-foreground/40" />
        <p className="font-medium">Entreprise introuvable</p>
      </div>
    );
  }

  const statusCfg = COMPANY_STATUS_CONFIG[company.company_status] ?? COMPANY_STATUS_CONFIG.pending;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-2xl tracking-tight">Mon entreprise</h1>
          <p className="text-muted-foreground text-sm">Gérez vos informations et documents officiels.</p>
        </div>
        <Badge variant="outline" className={`w-fit px-3 py-1 text-sm ${statusCfg.className}`}>
          {statusCfg.label}
        </Badge>
      </div>

      {/* Informations générales */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Informations de l'entreprise</h2>
          {!editMode && (
            <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
              <Pencil className="mr-1.5 size-3.5" />
              Modifier
            </Button>
          )}
        </div>

        <div className="rounded-xl border bg-card p-6">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex size-20 shrink-0 items-center justify-center rounded-xl border bg-muted overflow-hidden">
              {company.logo_url ? (
                <img src={company.logo_url} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <Building2 className="size-8 text-muted-foreground/40" />
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="font-medium text-sm">Logo de l'entreprise</p>
              <p className="text-muted-foreground text-xs">Format recommandé : carré, PNG ou JPG, min. 200×200 px.</p>
              <input type="file" accept="image/*" ref={logoInputRef} className="hidden" onChange={handleLogoUpload} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                disabled={logoUploading}
                onClick={() => logoInputRef.current?.click()}
              >
                <Upload className="mr-1.5 size-3.5" />
                {logoUploading ? "Upload…" : company.logo_url ? "Changer le logo" : "Ajouter un logo"}
              </Button>
            </div>
          </div>

          <Separator className="mb-6" />

          {editMode ? (
            <form onSubmit={handleSaveInfo} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Nom de l'entreprise</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email de contact</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Décrivez votre entreprise, vos activités, votre secteur…"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={saving}>
                  <Save className="mr-1.5 size-3.5" />
                  {saving ? "Sauvegarde…" : "Sauvegarder"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setForm({
                      name: company.name ?? "",
                      email: company.email ?? "",
                      description: company.description ?? "",
                    });
                    setEditMode(false);
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-muted-foreground text-xs">Nom de l'entreprise</p>
                <p className="font-medium">{company.name || "—"}</p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-muted-foreground text-xs">Email de contact</p>
                <p className="font-medium">{company.email || "—"}</p>
              </div>
              {company.siret && (
                <div className="flex flex-col gap-0.5">
                  <p className="text-muted-foreground text-xs">SIRET</p>
                  <p className="font-medium font-mono">{company.siret}</p>
                </div>
              )}
              {company.subscription_status && (
                <div className="flex flex-col gap-0.5">
                  <p className="text-muted-foreground text-xs">Abonnement</p>
                  <p className="font-medium capitalize">{company.subscription_status.replace("_", " ")}</p>
                </div>
              )}
              {company.description && (
                <div className="col-span-full flex flex-col gap-0.5">
                  <p className="text-muted-foreground text-xs">Description</p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{company.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Documents officiels */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-semibold text-lg">Documents officiels</h2>
          <p className="text-muted-foreground text-sm">
            Ces documents sont vérifiés par notre équipe avant validation de votre compte.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <KbisCard company={company} onUpdate={handleDocUpdate} />
          <AppOnlyCard
            label="Signature"
            description="Signature manuscrite du représentant légal de l'entreprise."
            statusKey="signature_status"
            urlKey="signature_url"
            company={company}
          />
          <AppOnlyCard
            label="Tampon de l'entreprise"
            description="Tampon officiel apposé sur vos documents contractuels."
            statusKey="stamp_status"
            urlKey="stamp_url"
            company={company}
          />
        </div>
      </section>

      {/* Infos compte */}
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-lg">Informations du compte</h2>
        <div className="grid gap-3 rounded-xl border bg-card p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-muted-foreground text-xs">Statut du compte</p>
            <Badge variant="outline" className={`w-fit ${statusCfg.className}`}>
              {statusCfg.label}
            </Badge>
          </div>
          {company.last_minute_credits != null && (
            <div className="flex flex-col gap-0.5">
              <p className="text-muted-foreground text-xs">Crédits Last Minute</p>
              <p className="font-semibold">⚡ {company.last_minute_credits}</p>
            </div>
          )}
          {company.created_at && (
            <div className="flex flex-col gap-0.5">
              <p className="text-muted-foreground text-xs">Membre depuis</p>
              <p className="font-medium">
                {new Date(company.created_at).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </div>

        {company.reject_message && company.company_status === "rejected" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <p className="font-semibold text-sm">Votre compte a été refusé</p>
            <p className="mt-1 text-sm">{company.reject_message}</p>
          </div>
        )}
      </section>
    </div>
  );
}
