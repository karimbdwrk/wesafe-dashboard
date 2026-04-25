"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import {
  Calendar,
  Car,
  CreditCard,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Ruler,
  ShieldCheck,
  Star,
  User,
  Weight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase/supabaseClient";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function parseListField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.trim() ? [value.trim()] : [];
    }
  }
  return [];
}

function getAge(birthday) {
  if (!birthday) return null;
  const birth = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getInitials(firstname, lastname) {
  return `${firstname?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase() || "?";
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ icon: Icon, title, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <h2 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function ProfileAvatar({ avatarUrl, firstname, lastname, size = 96 }) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(firstname, lastname);

  if (!avatarUrl || imgError) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground"
        style={{ width: size, height: size, fontSize: size * 0.33 }}
      >
        {initials}
      </div>
    );
  }
  return (
    <img
      src={avatarUrl}
      alt={`${firstname} ${lastname}`}
      className="shrink-0 rounded-full border-2 border-border object-cover"
      style={{ width: size, height: size }}
      onError={() => setImgError(true)}
    />
  );
}

// ─── Document status badge ────────────────────────────────────────────────────

const statusVariant = {
  approved: "default",
  pending: "secondary",
  rejected: "destructive",
};

const statusLabel = {
  approved: "Validé",
  pending: "En attente",
  rejected: "Refusé",
};

function DocBadge({ status }) {
  return <Badge variant={statusVariant[status] || "secondary"}>{statusLabel[status] || status || "En attente"}</Badge>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [diplomas, setDiplomas] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [cnapsCards, setCnapsCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      const [
        { data: profileData, error: profileError },
        { data: diplomasData },
        { data: certsData },
        { data: cnapsData },
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.from("user_diplomas").select("*").eq("user_id", id).order("created_at", { ascending: false }),
        supabase.from("user_certifications").select("*").eq("user_id", id).order("created_at", { ascending: false }),
        supabase.from("user_cnaps_cards").select("*").eq("user_id", id).order("created_at", { ascending: false }),
      ]);

      setLoading(false);

      if (profileError || !profileData) {
        console.error("[profile] erreur:", profileError);
        setNotFound(true);
        return;
      }

      console.log("[profile] data:", profileData);
      setProfile(profileData);
      setDiplomas(diplomasData || []);
      setCertifications(certsData || []);
      setCnapsCards(cnapsData || []);
    };

    fetchAll();
  }, [id]);

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // ── Not found ───────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-4xl">🔍</p>
        <h1 className="font-semibold text-xl">Profil introuvable</h1>
        <p className="text-muted-foreground text-sm">Ce profil n&apos;existe pas ou a été supprimé.</p>
      </div>
    );
  }

  // ── Prepare data ────────────────────────────────────────────────────────
  const fullName = `${profile.firstname || ""} ${profile.lastname || ""}`.trim();
  const age = getAge(profile.birthday);
  const languages = parseListField(profile.languages);
  const drivingLicenses = parseListField(profile.driving_licenses);

  const location = [profile.city, profile.department, profile.region].filter(Boolean).join(", ");

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-muted/30 px-4 py-10 pt-24">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* ── Header card ─────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5" />

          {/* Avatar + name */}
          <div className="px-6 pb-6">
            <div className="-mt-12 flex items-end gap-4">
              <ProfileAvatar
                avatarUrl={profile.avatar_url}
                firstname={profile.firstname}
                lastname={profile.lastname}
                size={88}
              />
              <div className="min-w-0 pb-1">
                <h1 className="truncate font-bold text-2xl">{fullName || "Candidat"}</h1>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {profile.former_soldier && (
                    <Badge variant="secondary" className="gap-1">
                      <Star className="h-3 w-3" />
                      Ancien militaire
                    </Badge>
                  )}
                  {profile.gender === "male" && <Badge variant="outline">Homme</Badge>}
                  {profile.gender === "female" && <Badge variant="outline">Femme</Badge>}
                  {age !== null && <Badge variant="outline">{age} ans</Badge>}
                </div>
              </div>
            </div>

            {/* Bio-line */}
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-muted-foreground text-sm">
              {location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {location}
                  {profile.postcode && ` (${profile.postcode})`}
                </span>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {profile.email}
                </a>
              )}
              {profile.birthday && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  {formatDate(profile.birthday)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Info card ────────────────────────────────────────────── */}
        {(profile.height || profile.weight || languages.length > 0 || drivingLicenses.length > 0) && (
          <div className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
            {(profile.height || profile.weight) && (
              <Section icon={User} title="Physique">
                <div className="flex flex-wrap gap-3">
                  {profile.height && (
                    <div className="flex items-center gap-2 text-sm">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.height} cm</span>
                    </div>
                  )}
                  {profile.weight && (
                    <div className="flex items-center gap-2 text-sm">
                      <Weight className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.weight} kg</span>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {(profile.height || profile.weight) && (languages.length > 0 || drivingLicenses.length > 0) && (
              <Separator />
            )}

            {languages.length > 0 && (
              <Section icon={Languages} title="Langues">
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang, i) => (
                    <Badge key={i} variant="secondary">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </Section>
            )}

            {languages.length > 0 && drivingLicenses.length > 0 && <Separator />}

            {drivingLicenses.length > 0 && (
              <Section icon={Car} title="Permis de conduire">
                <div className="flex flex-wrap gap-2">
                  {drivingLicenses.map((lic, i) => (
                    <Badge key={i} variant="outline">
                      {lic}
                    </Badge>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}

        {/* ── Documents cards ──────────────────────────────────────── */}

        {diplomas.length > 0 && (
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <Section icon={GraduationCap} title="Diplômes">
              <div className="mt-1 space-y-2">
                {diplomas.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm"
                  >
                    <span className="truncate font-medium">
                      {doc.name || doc.diploma_name || doc.type || "Diplôme"}
                    </span>
                    <DocBadge status={doc.status} />
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <Section icon={ShieldCheck} title="Certifications">
              <div className="mt-1 space-y-2">
                {certifications.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm"
                  >
                    <span className="truncate font-medium">
                      {doc.name || doc.certification_name || doc.type || "Certification"}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      {doc.expiry_date && (
                        <span className="text-muted-foreground text-xs">exp. {formatDate(doc.expiry_date)}</span>
                      )}
                      <DocBadge status={doc.status} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {cnapsCards.length > 0 && (
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <Section icon={CreditCard} title="Cartes professionnelles CNAPS">
              <div className="mt-1 space-y-2">
                {cnapsCards.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm"
                  >
                    <span className="truncate font-medium">
                      {doc.card_number ? `Carte n° ${doc.card_number}` : doc.name || "Carte CNAPS"}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      {doc.expiry_date && (
                        <span className="text-muted-foreground text-xs">exp. {formatDate(doc.expiry_date)}</span>
                      )}
                      <DocBadge status={doc.status} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* ── Footer ───────────────────────────────────────────────── */}
        <p className="pb-4 text-center text-muted-foreground text-xs">Profil partagé via WeSafe</p>
      </div>
    </div>
  );
}
