import React, { useEffect, useRef, useState } from "react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import axios from "axios";
import { Calendar, ChevronRight, ExternalLink, FileText, Hash, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/supabaseClient";

async function sendDocumentStatusNotification({ doc, tableName, newStatus }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !doc.user_id) return;

  const entityTypeMap = {
    user_diplomas: "diploma_review",
    user_certifications: "certification_review",
    user_cnaps_cards: "cnaps_card_review",
  };

  const docLabelMap = {
    user_diplomas: "diplôme",
    user_certifications: "certification",
    user_cnaps_cards: "carte CNAPS",
  };

  const statusLabelMap = {
    verified: "Vérifié",
    rejected: "Refusé",
    pending: "En attente",
  };

  const entityType = entityTypeMap[tableName] ?? "document_review";
  const docLabel = docLabelMap[tableName] ?? "document";
  const statusText = statusLabelMap[newStatus] ?? newStatus;

  await supabase.from("notifications").insert({
    actor_id: user.id,
    recipient_id: doc.user_id,
    type: "document_status_update",
    title: `Votre ${docLabel} a été mis à jour`,
    body: `Le statut de votre ${doc.type || docLabel} est désormais : ${statusText}.`,
    entity_type: entityType,
    entity_id: doc.id,
    is_read: false,
  });
}

async function getSignedUrl(url) {
  if (!url) return "";

  // Gère tous les types Supabase : public, authenticated, sign, etc.
  // On extrait bucket + path depuis l'URL (le [^?#]+ ignore le token existant)
  const match = url.match(/storage\/v1\/object\/[^/]+\/([^/]+)\/([^?#]+)/);
  if (!match) {
    console.warn("[getSignedUrl] URL non reconnue :", url);
    return url;
  }

  const bucket = match[1];
  const path = decodeURIComponent(match[2]);

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7); // 7 jours

  if (error) {
    console.error("[getSignedUrl] Erreur :", error.message, {
      bucket,
      path,
    });
    return url;
  }

  return data?.signedUrl || url;
}

function AvatarWithFallback({ url, firstname, lastname }) {
  const [error, setError] = React.useState(false);
  const initials = `${firstname?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase() || "?";
  if (!url || error) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black">
        <span className="font-semibold text-white text-xs leading-none">{initials}</span>
      </div>
    );
  }
  return (
    <img src={url} alt="avatar" className="h-8 w-8 shrink-0 rounded-full object-cover" onError={() => setError(true)} />
  );
}

function getStatusBadge(status) {
  let color = "bg-gray-300";
  let text = "Non vérifié";
  switch (status) {
    case "pending":
      color = "bg-yellow-400";
      text = "En attente";
      break;
    case "verified":
      color = "bg-green-600";
      text = "Vérifié";
      break;
    case "rejected":
      color = "bg-red-600";
      text = "Refusé";
      break;
  }
  return (
    <Badge className="flex items-center gap-2 border border-gray-300 bg-white text-black shadow-sm">
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      {text}
    </Badge>
  );
}

function getProfileStatusBadge(status) {
  let color = "bg-gray-300";
  let text = "Non défini";
  switch (status) {
    case "pending":
      color = "bg-yellow-400";
      text = "En attente";
      break;
    case "verified":
      color = "bg-green-600";
      text = "Vérifié";
      break;
    case "rejected":
      color = "bg-red-600";
      text = "Refusé";
      break;
    case "suspended":
      color = "bg-orange-600";
      text = "Suspendu";
      break;
  }
  return (
    <Badge className="flex items-center gap-2 border border-gray-300 bg-white text-black shadow-sm">
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      {text}
    </Badge>
  );
}

function SocialSecurityModal({ row }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(row.original.social_security_verification_status);
  const [socialSecurityNumber, setSocialSecurityNumber] = useState(row.original.social_security_number || "");
  const [docType, _setDocType] = useState(row.original.social_security_doc_type || "");
  const [signedUrl, setSignedUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const docTypeLabel = {
    carte_vitale: "Carte Vitale",
    social_security_certificate: "Attestation de Securité Sociale",
    other: "Autre document",
  };

  const handleChange = async () => {
    await supabase
      .from("profiles")
      .update({
        social_security_verification_status: status,
        social_security_number: socialSecurityNumber,
        social_security_doc_type: docType,
      })
      .eq("id", row.original.id);
    row.original.social_security_verification_status = status; // Met à jour le badge dans le tableau
    setOpen(false);
    // ...toast, etc.
  };

  return (
    <Dialog
      open={open}
      onOpenChange={async (isOpen) => {
        setOpen(isOpen);
        if (isOpen && row.original.social_security_document_url) {
          setSignedUrl(await getSignedUrl(row.original.social_security_document_url));
        }
      }}
    >
      <DialogTrigger asChild>
        <span style={{ cursor: "pointer" }}>{getStatusBadge(row.original.social_security_verification_status)}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vérification Sécurité Sociale</DialogTitle>
        </DialogHeader>
        <div className="mb-2 font-semibold text-gray-700 text-sm">
          Type de document : {docTypeLabel[row.original.social_security_doc_type] || "Non renseigné"}
        </div>
        <div className="mt-2 flex flex-col gap-4">
          {/* Image du document */}
          {signedUrl && (
            <img
              src={signedUrl}
              alt="Document Sécurité Sociale"
              className="w-full max-w-xs cursor-pointer rounded border"
              onClick={() => setPreviewUrl(signedUrl)}
            />
          )}
          {/* Modal d’aperçu grand format */}
          {previewUrl && (
            <Dialog open={true} onOpenChange={() => setPreviewUrl(null)}>
              <DialogContent>
                <DialogTitle>
                  <VisuallyHidden>Aperçu du document Sécurité Sociale</VisuallyHidden>
                </DialogTitle>
                <img src={previewUrl} alt="Aperçu document" className="mx-auto w-full max-w-2xl rounded border" />
              </DialogContent>
            </Dialog>
          )}
          {/* Numéro de sécurité sociale */}
          <div>
            <label className="mb-1 block text-sm">Numéro de sécurité sociale</label>
            <input
              type="text"
              className="w-full rounded border px-2 py-1"
              value={socialSecurityNumber}
              onChange={(e) => setSocialSecurityNumber(e.target.value)}
            />
          </div>
          {/* Statut */}
          <div>
            <label className="mb-1 block text-sm">Statut</label>
            <div className="flex gap-2">
              {["pending", "verified", "rejected"].map((s) => (
                <button
                  key={s}
                  className={`rounded border px-3 py-2 ${status === s ? "border-blue-500 bg-blue-100" : ""}`}
                  onClick={() => setStatus(s)}
                >
                  {s === "pending" ? "En attente" : s === "verified" ? "Validé" : "Refusé"}
                </button>
              ))}
            </div>
          </div>
          <button className="mt-4 rounded bg-blue-600 px-4 py-2 text-white" onClick={handleChange}>
            Enregistrer
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatusModal({ row, updateRowStatus }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(row.original.profile_status);
  const [rejectReason, setRejectReason] = useState(row.original.reject_message ?? "");

  const statuses = [
    { value: "pending", label: "En attente" },
    { value: "verified", label: "Vérifié" },
    { value: "rejected", label: "Refusé" },
    { value: "suspended", label: "Suspendu" },
  ];

  const handleChange = async () => {
    const updatePayload = { profile_status: selected };
    if (selected === "rejected") {
      updatePayload.reject_message = rejectReason.trim() || null;
    } else {
      updatePayload.reject_message = null;
    }
    const { error } = await supabase.from("profiles").update(updatePayload).eq("id", row.original.id);
    if (error) {
      toast.error("Erreur lors de la mise à jour");
    } else {
      toast.success("Statut mis à jour !");
      setOpen(false);
      updateRowStatus(selected); // Met à jour le badge dans le tableau
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
          {getProfileStatusBadge(row.original.profile_status)}
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Changer le statut du profil</DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-2">
          {statuses.map((s) => (
            <button
              key={s.value}
              className={`rounded border px-3 py-2 text-left ${selected === s.value ? "border-blue-500 bg-blue-100" : ""}`}
              onClick={() => setSelected(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
        {selected === "rejected" && (
          <div className="mt-3 flex flex-col gap-1.5">
            <label className="font-medium text-sm">Raison du refus</label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Expliquer la raison du refus…"
              rows={3}
            />
          </div>
        )}
        <button
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={selected === "rejected" && !rejectReason.trim()}
          onClick={handleChange}
        >
          Enregistrer
        </button>
      </DialogContent>
    </Dialog>
  );
}

function flagEmoji(code) {
  if (!code) return "";
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((c) => 127397 + c.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function IdVerificationModal({ row }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(row.original.id_verification_status);
  const [validityDate, setValidityDate] = useState(row.original.id_validity_date);
  const [nationalityQuery, setNationalityQuery] = useState("");
  const [nationalitySuggestions, setNationalitySuggestions] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState(null);
  // Afficher la nationalité à l'ouverture si le code existe
  useEffect(() => {
    async function fetchNationality() {
      const code = row.original.nationality;
      if (!code) return;
      if (!countriesCacheRef.current) {
        const res = await axios.get("https://restcountries.com/v3.1/all?fields=cca2,translations,flags");
        countriesCacheRef.current = res.data;
      }
      const found = countriesCacheRef.current.find((c) => c.cca2 === code);
      if (found) {
        setSelectedNationality({
          code: found.cca2,
          name: found.translations?.fra?.common || found.cca2,
          flag: flagEmoji(found.cca2),
        });
        setNationalityQuery(found.translations?.fra?.common || found.cca2);
      }
    }
    fetchNationality();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.original.nationality]);
  const [selectedNationalityCode, setSelectedNationalityCode] = useState(null);
  const [loadingNationalities, setLoadingNationalities] = useState(false);
  // ...existing code...
  const countriesCacheRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const [signedUrls, setSignedUrls] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  const idType = row.original.id_type;
  const urls = (() => {
    if (idType === "national_id") {
      return [row.original.national_id_front_url, row.original.national_id_back_url];
    }
    if (idType === "passport") {
      return [row.original.passport_url];
    }
    if (idType === "residence_permit") {
      return [row.original.residence_permit_front_url, row.original.residence_permit_back_url];
    }
    return [];
  })();

  const searchNationality = async (query) => {
    if (query.length < 3) {
      setNationalitySuggestions([]);
      return;
    }
    setLoadingNationalities(true);
    try {
      if (!countriesCacheRef.current) {
        const res = await axios.get("https://restcountries.com/v3.1/all?fields=cca2,translations,flags");
        countriesCacheRef.current = res.data;
      }
      const lower = query.toLowerCase();
      const results = countriesCacheRef.current
        .filter((c) => {
          const frName = c.translations?.fra?.common || "";
          return frName.toLowerCase().includes(lower);
        })
        .slice(0, 8)
        .map((c) => ({
          code: c.cca2,
          name: c.translations?.fra?.common || c.cca2,
          flag: flagEmoji(c.cca2),
        }));
      setNationalitySuggestions(results);
    } catch (e) {
      console.error("searchNationality error:", e);
    } finally {
      setLoadingNationalities(false);
    }
  };

  const handleNationalityChange = (text) => {
    setNationalityQuery(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => searchNationality(text), 300);
  };

  const handleSelectNationality = async (country) => {
    console.log("Nationalité sélectionnée:", country);
    setSelectedNationality(country);
    setSelectedNationalityCode(country.code);
    setNationalityQuery(country.name);
    setNationalitySuggestions([]);
  };

  const handleChange = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({
        id_verification_status: status,
        id_validity_date: validityDate,
        nationality: selectedNationalityCode,
      })
      .eq("id", row.original.id);
    if (error) {
      toast.error("Erreur lors de la mise à jour");
    } else {
      toast.success("Données mises à jour !");
      setOpen(false);
      row.original.id_verification_status = status;
      row.original.id_validity_date = validityDate;
      row.original.nationality = selectedNationalityCode;
    }
  };

  const idTypeLabel = {
    national_id: "Carte nationale d'identité",
    passport: "Passeport",
    residence_permit: "Titre de séjour",
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={async (isOpen) => {
          setOpen(isOpen);
          if (isOpen && urls.length > 0) {
            const results = await Promise.all(urls.map((url) => getSignedUrl(url)));
            setSignedUrls(results);
          }
        }}
      >
        <DialogTrigger asChild>
          <span onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
            {getStatusBadge(row.original.id_verification_status)}
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vérification d'identité</DialogTitle>
          </DialogHeader>
          <div>
            <label className="mb-1 block text-sm">Date de naissance</label>
            <DatePicker
              value={row.original.birthday ? new Date(row.original.birthday) : null}
              onChange={(date) => {
                // Ici, tu peux gérer la mise à jour locale ou côté supabase si besoin
                // Exemple local :
                row.original.birthday = date
                  ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                  : "";
              }}
              format="yyyy-MM-dd"
              className="w-full"
            />
          </div>
          <div className="mb-2 font-semibold text-gray-700 text-sm">
            Type de document : {idTypeLabel[idType] || "Non renseigné"}
          </div>
          <div className="mt-2 flex flex-col gap-4">
            {/* Affichage direct des images signées */}
            {/* {signedUrls.map((url, idx) =>
						url ? (
							<img
								key={idx}
								src={url}
								alt={`Document ${idx + 1}`}
								className='w-full max-w-xs rounded border'
							/>
						) : null,
					)} */}
            <div className="flex flex-col gap-4">
              {idType === "national_id" && (
                <div className="flex flex-wrap">
                  {signedUrls[0] && (
                    <div className="w-1/2 pr-1">
                      <p className="text-xs">Recto :</p>
                      <img
                        src={signedUrls[0]}
                        alt="Recto CNI"
                        className="w-full max-w-xs rounded border"
                        onClick={() => setPreviewUrl(signedUrls[0])}
                      />
                    </div>
                  )}
                  {signedUrls[1] && (
                    <div className="w-1/2 pl-1">
                      <p className="text-xs">Verso :</p>
                      <img
                        src={signedUrls[1]}
                        alt="Verso CNI"
                        className="w-full max-w-xs rounded border"
                        onClick={() => setPreviewUrl(signedUrls[1])}
                      />
                    </div>
                  )}
                </div>
              )}
              {idType === "passport" && signedUrls[0] && (
                <img
                  src={signedUrls[0]}
                  alt="Passeport"
                  className="w-full max-w-xs rounded border"
                  onClick={() => setPreviewUrl(signedUrls[0])}
                />
              )}
              {idType === "residence_permit" && (
                <div className="flex gap-4">
                  {signedUrls[0] && (
                    <div className="w-1/2 pr-1">
                      <p className="text-xs">Recto :</p>
                      <img
                        src={signedUrls[0]}
                        alt="Recto Titre de séjour"
                        className="w-full max-w-xs rounded border"
                        onClick={() => setPreviewUrl(signedUrls[0])}
                      />
                    </div>
                  )}
                  {signedUrls[1] && (
                    <div className="w-1/2 pl-1">
                      <p className="text-xs">Verso :</p>
                      <img
                        src={signedUrls[1]}
                        alt="Verso Titre de séjour"
                        className="w-full max-w-xs rounded border"
                        onClick={() => setPreviewUrl(signedUrls[1])}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Nationalité */}
            {["residence_permit"].includes(idType) && (
              <div>
                <label className="mb-1 block text-sm">Nationalité</label>
                <input
                  type="text"
                  className="w-full rounded border px-2 py-1"
                  value={nationalityQuery}
                  onChange={(e) => handleNationalityChange(e.target.value)}
                />
                {loadingNationalities && <div className="text-gray-400 text-xs">Recherche...</div>}
                {nationalitySuggestions.length > 0 && (
                  <ul className="mt-1 max-h-40 overflow-auto rounded border bg-white">
                    {nationalitySuggestions.map((c) => (
                      <li
                        key={c.code}
                        className="flex cursor-pointer items-center gap-2 px-2 py-1 hover:bg-blue-100"
                        onClick={() => handleSelectNationality(c)}
                      >
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {selectedNationality && (
                  <div className="mt-2 text-green-700 text-sm">
                    Sélectionné : {selectedNationality.flag} {selectedNationality.name}
                  </div>
                )}
              </div>
            )}
            {/* Date de validité */}
            <div>
              <label className="mb-1 block text-sm">Date de validité</label>
              <DatePicker
                value={validityDate ? new Date(validityDate) : null}
                onChange={(date) => {
                  if (date) {
                    // Correction : format local YYYY-MM-DD
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    setValidityDate(`${year}-${month}-${day}`);
                  } else {
                    setValidityDate("");
                  }
                }}
                format="yyyy-MM-dd"
                className="w-full"
              />
            </div>
            {/* Statut */}
            <div>
              <label className="mb-1 block text-sm">Statut</label>
              <div className="flex gap-2">
                {["pending", "verified", "rejected"].map((s) => (
                  <button
                    key={s}
                    className={`rounded border px-3 py-2 ${status === s ? "border-blue-500 bg-blue-100" : ""}`}
                    onClick={() => setStatus(s)}
                  >
                    {s === "pending" ? "En attente" : s === "verified" ? "Validé" : "Refusé"}
                  </button>
                ))}
              </div>
            </div>
            {/* Bouton enregistrer */}
            <button className="mt-4 rounded bg-blue-600 px-4 py-2 text-white" onClick={handleChange}>
              Enregistrer
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Modal d’aperçu grand format */}
      {previewUrl && (
        <Dialog open={true} onOpenChange={() => setPreviewUrl(null)}>
          <DialogTitle>
            <VisuallyHidden>Aperçu du document</VisuallyHidden>
          </DialogTitle>
          <DialogContent>
            <img src={previewUrl} alt="Aperçu document" className="mx-auto w-full max-w-2xl rounded border" />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function DocumentStatusDialog({ doc, tableName, onUpdated, open, onOpenChange }) {
  const [status, setStatus] = useState(doc.status);
  const [signedUrl, setSignedUrl] = useState("");
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (open && doc.document_url) {
      setLoadingUrl(true);
      setImgError(false);
      getSignedUrl(doc.document_url).then((url) => {
        setSignedUrl(url);
        setLoadingUrl(false);
      });
    }
    if (!open) {
      setSignedUrl("");
      setPreviewOpen(false);
    }
  }, [open, doc.document_url]);

  const isImage = doc.document_url && /\.(jpg|jpeg|png|gif|webp|avif|bmp|tiff?)(\?|$)/i.test(doc.document_url);

  const statusConfig = {
    pending: {
      label: "En attente",
      variant: "outline",
      dot: "bg-yellow-400",
    },
    verified: { label: "Vérifié", variant: "outline", dot: "bg-green-500" },
    rejected: { label: "Refusé", variant: "outline", dot: "bg-red-500" },
  };

  const handleUpdate = async () => {
    const { error } = await supabase.from(tableName).update({ status }).eq("id", doc.id);
    if (error) {
      toast.error("Erreur lors de la mise à jour");
    } else {
      toast.success("Statut mis à jour !");
      await sendDocumentStatusNotification({
        doc,
        tableName,
        newStatus: status,
      });
      onOpenChange(false);
      onUpdated({ ...doc, status });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              {doc.type || "Document"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Aperçu du document */}
            {doc.document_url && (
              <div className="flex min-h-[120px] items-center justify-center rounded-lg border bg-muted/40 p-3">
                {loadingUrl ? (
                  <span className="animate-pulse text-muted-foreground text-sm">Chargement…</span>
                ) : signedUrl && isImage && !imgError ? (
                  <img
                    src={signedUrl}
                    alt="Document"
                    className="max-h-52 w-auto cursor-zoom-in rounded object-contain"
                    onClick={() => setPreviewOpen(true)}
                    title="Cliquer pour agrandir"
                    onError={() => setImgError(true)}
                  />
                ) : signedUrl ? (
                  <a
                    href={signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-medium text-blue-600 text-sm hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {imgError ? "Image non affichable — Ouvrir le fichier" : "Voir le document"}
                  </a>
                ) : null}
              </div>
            )}

            {/* Dates */}
            {(doc.expires_at || doc.obtained_at || doc.issued_at) && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {doc.expires_at &&
                  (() => {
                    const expDate = new Date(doc.expires_at);
                    const isExpired = expDate < new Date();
                    return (
                      <span
                        className={`flex items-center gap-1.5 font-medium ${isExpired ? "text-red-600" : "text-muted-foreground"}`}
                      >
                        <Calendar className="h-4 w-4" />
                        {isExpired
                          ? `Expiré depuis le ${expDate.toLocaleDateString("fr-FR")}`
                          : `Expire le ${expDate.toLocaleDateString("fr-FR")}`}
                      </span>
                    );
                  })()}
                {doc.obtained_at && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Obtenu le {new Date(doc.obtained_at).toLocaleDateString("fr-FR")}
                  </span>
                )}
                {doc.issued_at && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Délivré le {new Date(doc.issued_at).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
            )}

            {/* Statut */}
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">Statut du document</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(statusConfig).map(([s, cfg]) => (
                  <button
                    key={s}
                    type="button"
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 font-medium text-sm transition-colors ${
                      status === s ? "border-blue-500 bg-blue-50 text-blue-700" : "hover:bg-muted"
                    }`}
                    onClick={() => setStatus(s)}
                  >
                    <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={handleUpdate}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {previewOpen && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                <VisuallyHidden>Aperçu du document</VisuallyHidden>
              </DialogTitle>
            </DialogHeader>
            <img src={signedUrl} alt="Aperçu document" className="max-h-[80vh] w-full rounded border object-contain" />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

const statusDotColor = {
  pending: "bg-yellow-400",
  verified: "bg-green-500",
  rejected: "bg-red-500",
};
const statusLabel = {
  pending: "En attente",
  verified: "Vérifié",
  rejected: "Refusé",
};

function DocCard({ doc, onClick }) {
  const dot = statusDotColor[doc.status] || "bg-gray-400";
  const label = statusLabel[doc.status] || "Non vérifié";

  return (
    <button type="button" className="group w-full text-left focus:outline-none" onClick={onClick}>
      <Card className="cursor-pointer border transition-all duration-150 hover:border-blue-400 hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-blue-400">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            {/* Icône + titre */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-sm">{doc.type || "Document"}</p>
                {doc.number && (
                  <p className="mt-0.5 flex items-center gap-1 text-muted-foreground text-xs">
                    <Hash className="h-3 w-3" />
                    {doc.number}
                  </p>
                )}
              </div>
            </div>
            {/* Statut + chevron */}
            <div className="flex flex-shrink-0 items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1.5 text-xs">
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                {label}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-blue-500" />
            </div>
          </div>

          {/* Dates */}
          {(doc.expires_at || doc.obtained_at || doc.issued_at) && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t pt-3">
              {doc.expires_at &&
                (() => {
                  const expDate = new Date(doc.expires_at);
                  const isExpired = expDate < new Date();
                  return isExpired ? (
                    <span className="flex items-center gap-1 font-medium text-red-600 text-xs">
                      <Calendar className="h-3 w-3" />
                      Expiré depuis le {expDate.toLocaleDateString("fr-FR")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Calendar className="h-3 w-3" />
                      Expire le {expDate.toLocaleDateString("fr-FR")}
                    </span>
                  );
                })()}
              {doc.obtained_at && (
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Calendar className="h-3 w-3" />
                  Obtenu le {new Date(doc.obtained_at).toLocaleDateString("fr-FR")}
                </span>
              )}
              {doc.issued_at && (
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Calendar className="h-3 w-3" />
                  Délivré le {new Date(doc.issued_at).toLocaleDateString("fr-FR")}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </button>
  );
}

function computeSummary(data) {
  if (!data || data.length === 0) return null;
  const s = { verified: 0, pending: 0, rejected: 0 };
  data.forEach((d) => {
    if (s[d.status] !== undefined) s[d.status]++;
  });
  return s;
}

function DocStatusSummary({ summary, loading }) {
  if (loading) {
    return <span className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-gray-300" />;
  }
  if (!summary) {
    return <span className="ml-1 text-muted-foreground text-xs">—</span>;
  }
  return (
    <span className="ml-1 flex items-center gap-1">
      {summary.verified > 0 && (
        <span className="flex items-center gap-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span className="font-medium text-green-700 text-xs">{summary.verified}</span>
        </span>
      )}
      {summary.pending > 0 && (
        <span className="flex items-center gap-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
          <span className="font-medium text-xs text-yellow-600">{summary.pending}</span>
        </span>
      )}
      {summary.rejected > 0 && (
        <span className="flex items-center gap-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          <span className="font-medium text-red-600 text-xs">{summary.rejected}</span>
        </span>
      )}
    </span>
  );
}

function UserDocumentsSheet({ userId, tableName, typeLabel, badgeLabel }) {
  const [open, setOpen] = useState(false);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [statusSummary, setStatusSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // Fetch léger au montage pour afficher le résumé dans le badge du tableau
  useEffect(() => {
    supabase
      .from(tableName)
      .select("id, status")
      .eq("user_id", userId)
      .then(({ data }) => {
        setStatusSummary(computeSummary(data));
        setSummaryLoading(false);
      });
  }, [userId, tableName]);

  // Sync le résumé quand les docs complets sont chargés (sheet ouverte)
  useEffect(() => {
    if (docs.length > 0) {
      setStatusSummary(computeSummary(docs));
    }
  }, [docs]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      supabase
        .from(tableName)
        .select("*")
        .eq("user_id", userId)
        .then(({ data }) => {
          setDocs(data || []);
          setLoading(false);
        });
    }
  }, [open, userId, tableName]);

  return (
    <>
      <button type="button" className="focus:outline-none" onClick={() => setOpen(true)}>
        <Badge variant="outline" className="inline-flex cursor-pointer items-center gap-1.5">
          {badgeLabel}
          <DocStatusSummary summary={statusSummary} loading={summaryLoading} />
        </Badge>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="max-h-screen w-[480px] overflow-y-auto p-5">
          <SheetHeader className="mb-5">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              {typeLabel}
            </SheetTitle>
          </SheetHeader>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : docs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <FileText className="mb-3 h-10 w-10 opacity-30" />
              <p className="text-sm">Aucun document envoyé</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {docs.map((doc) => (
                <DocCard key={doc.id} doc={doc} onClick={() => setSelectedDoc(doc)} />
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {selectedDoc && (
        <DocumentStatusDialog
          doc={selectedDoc}
          tableName={tableName}
          open={!!selectedDoc}
          onOpenChange={(v) => {
            if (!v) setSelectedDoc(null);
          }}
          onUpdated={(updated) => {
            setDocs((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
            setSelectedDoc(null);
          }}
        />
      )}
    </>
  );
}

export const dashboardColumns = [
  {
    accessorKey: "avatar_url",
    header: "Avatar",
    cell: ({ row }) => (
      <AvatarWithFallback
        url={row.original.avatar_url}
        firstname={row.original.firstname}
        lastname={row.original.lastname}
      />
    ),
  },
  {
    id: "fullname",
    header: "Nom & Prénom",
    cell: ({ row }) => `${row.original.lastname || ""} ${row.original.firstname || ""}`,
  },
  // {
  // 	accessorKey: "email",
  // 	header: "Email",
  // },
  {
    id: "city_postcode",
    header: "Ville",
    cell: ({ row }) =>
      `${row.original.city || ""} ${row.original.department_code ? `(${row.original.department_code})` : ""}`,
  },
  {
    accessorKey: "gender",
    header: "Genre",
  },
  {
    accessorKey: "profile_status",
    header: "Statut du profil",
    cell: ({ row, table }) => {
      const updateRowStatus = (newStatus) => {
        row.original.profile_status = newStatus;
        if (table.options.data) {
          table.options.data = table.options.data.map((r) =>
            r.id === row.original.id ? { ...r, profile_status: newStatus } : r,
          );
        }
      };
      return <StatusModal row={row} updateRowStatus={updateRowStatus} />;
    },
  },
  {
    accessorKey: "id_verification_status",
    header: "ID vérif. status",
    cell: ({ row }) => {
      return !row.original.id_type ? (
        <Badge variant="outline" className="inline-flex cursor-default items-center gap-2 text-gray-400">
          <span className="h-2 w-2 rounded-full bg-gray-400" />
          Aucun document envoyé
        </Badge>
      ) : (
        <IdVerificationModal row={row} />
      );
    },
  },
  {
    accessorKey: "social_security_verification_status",
    header: "Sécu vérif. status",
    cell: ({ row }) => {
      return !row.original.social_security_verification_status ? (
        <Badge variant="outline" className="inline-flex cursor-default items-center gap-2 text-gray-400">
          <span className="h-2 w-2 rounded-full bg-gray-400" />
          Aucun document envoyé
        </Badge>
      ) : (
        <SocialSecurityModal row={row} />
      );
    },
  },
  // {
  // 	accessorKey: "id",
  // 	header: "ID",
  // },
  {
    id: "cnaps",
    header: "CNAPS",
    cell: ({ row }) => (
      <UserDocumentsSheet
        userId={row.original.id}
        tableName="user_cnaps_cards"
        typeLabel="Cartes CNAPS"
        badgeLabel="CNAPS"
      />
    ),
    enableSorting: false,
  },
  {
    id: "diplomas",
    header: "Diplômes",
    cell: ({ row }) => (
      <UserDocumentsSheet
        userId={row.original.id}
        tableName="user_diplomas"
        typeLabel="Diplômes"
        badgeLabel="Diplômes"
      />
    ),
    enableSorting: false,
  },
  {
    id: "certifications",
    header: "Certifications",
    cell: ({ row }) => (
      <UserDocumentsSheet
        userId={row.original.id}
        tableName="user_certifications"
        typeLabel="Certifications"
        badgeLabel="Certifs"
      />
    ),
    enableSorting: false,
  },
  {
    id: "signature_status",
    accessorKey: "signature_status",
    header: "Signature",
    cell: ({ row }) => {
      const status = row.original.signature_status;
      if (!status) {
        return (
          <Badge variant="outline" className="inline-flex cursor-default items-center gap-2 text-gray-400">
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            Aucune signature
          </Badge>
        );
      }
      const config = {
        pending: { dot: "bg-yellow-400", label: "En attente" },
        verified: { dot: "bg-green-500", label: "Vérifiée" },
        rejected: { dot: "bg-red-500", label: "Refusée" },
      };
      const { dot, label } = config[status] ?? {
        dot: "bg-gray-400",
        label: status,
      };
      return (
        <button
          type="button"
          className="focus:outline-none"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("openSignatureDialog", {
                detail: row.original,
              }),
            )
          }
        >
          <Badge variant="outline" className="flex w-fit cursor-pointer items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${dot} shrink-0`} />
            {label}
          </Badge>
        </button>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (typeof window !== "undefined") {
            const event = new CustomEvent("openProfileDrawer", {
              detail: row.original,
            });
            window.dispatchEvent(event);
          }
        }}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    ),
    enableSorting: false,
  },
];
