// Templates HTML de génération PDF des contrats — portés depuis le composant
// mobile (APP-components/contract.jsx) pour garantir une parité visuelle
// exacte entre le PDF généré sur l'app et celui généré sur le web.
// Ne pas diverger de la version mobile sans mettre à jour les deux côtés.

export const DAY_FR = {
  lundi: "Lundi",
  mardi: "Mardi",
  mercredi: "Mercredi",
  jeudi: "Jeudi",
  vendredi: "Vendredi",
  samedi: "Samedi",
  dimanche: "Dimanche",
};

export const formatSiret = (value) => {
  if (!value) return value;
  const cleaned = value.toString().replace(/\s/g, "");
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,5})$/);
  if (match) {
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(" ");
  }
  return value;
};

export const fr = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-FR");
  } catch {
    return "—";
  }
};

export const fmt2 = (n) =>
  n != null
    ? n.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "—";

export const fmtH = (n) =>
  n != null
    ? n.toLocaleString("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : "—";

// ── Template CDI ──────────────────────────────────────────────────────────────
export const buildCdiHtml = (d) => {
  const {
    dc,
    dd,
    contract,
    company,
    candidate,
    apply,
    ws,
    schedKnown,
    DAY_FR: DAYS,
    monthlyHours,
    hourlyRate,
    monthlySalary,
  } = d;
  const refId = apply?.id?.substring(0, 8)?.toUpperCase() || "—";
  const genDate = fr(new Date().toISOString());
  const compAddr = dc?.address || [dc?.street, dc?.postcode, dc?.city].filter(Boolean).join(", ") || "—";
  const legalRepName =
    [dc?.legal_representative_firstname, dc?.legal_representative_lastname].filter(Boolean).join(" ") ||
    dc?.legal_representative ||
    "—";
  const legalRepRole = dc?.legal_representative_role || "Dirigeant";
  const collective = contract?.collective_agreement || "CCN Sécurité privée — IDCC 1351";
  const calcDur = (s, e) => {
    try {
      const [sh, sm] = s.split(":").map(Number);
      const [eh, em] = e.split(":").map(Number);
      const diff = eh * 60 + em - (sh * 60 + sm);
      if (!Number.isNaN(diff) && diff > 0)
        return `${Math.floor(diff / 60)}h${diff % 60 > 0 ? String(diff % 60).padStart(2, "0") : ""}`;
    } catch {
      /* invalid time format — fall through */
    }
    return "—";
  };
  const schedRows =
    schedKnown && ws && Object.entries(ws).some(([, v]) => v?.enabled)
      ? Object.entries(ws)
          .filter(([, v]) => v?.enabled)
          .map(
            ([day, h]) =>
              `<tr><td>${DAYS?.[day] || day}</td><td>${h.start || "—"}</td><td>${h.end || "—"}</td><td>${calcDur(h.start || "", h.end || "")}</td></tr>`,
          )
          .join("")
      : "";
  const sigCo = company?.signature_url
    ? `<img src="${company.signature_url}" alt="Signature employeur">`
    : `<span class="empty">En attente de signature</span>`;
  const sigCa = candidate?.signature_url
    ? `<img src="${candidate.signature_url}" alt="Signature salarié">`
    : `<span class="empty">En attente de signature</span>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contrat de Travail CDI — ${dd?.lastname || ""} ${dd?.firstname || ""}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  :root {
    --navy: #1a2744; --navy-mid: #2d3f6e; --gold: #b8972a; --gold-light: #d4af4a;
    --ink: #1c1c1e; --ink-light: #3a3a3c; --muted: #6e6e73;
    --border: #d1d5e0; --bg: #f8f7f4; --white: #ffffff;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.65; color: var(--ink); background: var(--bg); padding: 0; }
  .page { width: 210mm; min-height: 297mm; margin: 0 auto; background: var(--white); padding: 18mm 20mm 20mm 20mm; box-sizing: border-box; overflow: hidden; }
  .contract-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 14px; border-bottom: 2.5px solid var(--navy); margin-bottom: 18px; }
  .header-left .company-logo { font-family: 'Inter', sans-serif; font-size: 20pt; font-weight: 600; color: var(--navy); letter-spacing: -0.3px; display: block; margin-bottom: 3px; }
  .header-left .company-sub { font-size: 8pt; color: var(--muted); letter-spacing: 0.8px; text-transform: uppercase; }
  .header-right { text-align: right; }
  .contract-badge { display: inline-block; background: var(--navy); color: var(--white); font-size: 8pt; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; padding: 5px 12px; margin-bottom: 4px; }
  .contract-ref { font-size: 8pt; color: var(--muted); }
  .title-block { text-align: center; padding: 22px 0 20px; border-bottom: 1px solid var(--border); margin-bottom: 22px; }
  .title-block h1 { font-family: 'Inter', sans-serif; font-size: 22pt; font-weight: 600; color: var(--navy); letter-spacing: -0.5px; line-height: 1.15; }
  .title-block .subtitle { font-size: 11pt; color: var(--gold); font-style: italic; margin-top: 4px; }
  .parties-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 14px; margin-bottom: 22px; width: 100%; }
  .party-card { border: 1px solid var(--border); border-top: 3px solid var(--navy); padding: 14px 16px; }
  .party-card.candidate { border-top-color: var(--gold); }
  .party-label { font-size: 7pt; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .party-name { font-family: 'Inter', sans-serif; font-size: 13pt; font-weight: 600; color: var(--navy); margin-bottom: 8px; }
  .party-detail { display: flex; gap: 6px; font-size: 8.5pt; color: var(--ink-light); margin-bottom: 3px; }
  .party-detail .label { color: var(--muted); min-width: 90px; flex-shrink: 0; }
  .section { margin-bottom: 28px; }
  .section-title { font-family: 'Inter', sans-serif; font-size: 12pt; font-weight: 600; color: var(--navy); border-left: 3px solid var(--gold); padding-left: 10px; margin-bottom: 10px; line-height: 1.2; }
  .article-number { font-size: 7.5pt; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--gold); margin-bottom: 3px; }
  .info-table { width: 100%; border-collapse: collapse; font-size: 9pt; margin-top: 6px; }
  .info-table tr { border-bottom: 1px solid var(--border); }
  .info-table tr:last-child { border-bottom: none; }
  .info-table td { padding: 6px 8px; vertical-align: top; }
  .info-table td:first-child { color: var(--muted); width: 38%; font-size: 8.5pt; }
  .info-table td:last-child { font-weight: 500; color: var(--ink); }
  .mission-list { list-style: none; margin-top: 6px; }
  .mission-list li { display: flex; gap: 8px; padding: 4px 0; font-size: 9pt; color: var(--ink-light); border-bottom: 1px dashed var(--border); }
  .mission-list li:last-child { border-bottom: none; }
  .mission-list li::before { content: "—"; color: var(--gold); font-weight: 600; flex-shrink: 0; }
  .highlight-box { background: #f0f2f8; border-left: 3px solid var(--navy-mid); padding: 10px 14px; font-size: 8.5pt; color: var(--ink-light); margin: 8px 0; line-height: 1.5; }
  .highlight-box.warning { background: #fef9ec; border-left-color: var(--gold); }
  .remu-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-top: 8px; }
  .remu-card { border: 1px solid var(--border); padding: 10px 12px; text-align: center; }
  .remu-card .remu-value { font-family: 'Inter', sans-serif; font-size: 14pt; font-weight: 600; color: var(--navy); display: block; }
  .remu-card .remu-label { font-size: 7.5pt; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
  .schedule-table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-top: 8px; }
  .schedule-table th { background: var(--navy); color: var(--white); padding: 6px 10px; text-align: left; font-weight: 500; font-size: 8pt; }
  .schedule-table td { padding: 5px 10px; border-bottom: 1px solid var(--border); color: var(--ink-light); }
  .schedule-table tr:nth-child(even) td { background: #f8f9fb; }
  .bonus-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 6px; margin-top: 8px; }
  .bonus-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; background: #f8f9fb; border: 1px solid var(--border); font-size: 8.5pt; }
  .bonus-row .bonus-label { color: var(--muted); }
  .bonus-row .bonus-value { font-weight: 600; color: var(--navy); }
  .legal-text { font-size: 8.5pt; color: var(--ink-light); line-height: 1.6; text-align: justify; }
  .cnaps-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--navy); color: var(--white); font-size: 7.5pt; padding: 4px 10px; font-weight: 500; letter-spacing: 0.5px; }
  .signatures-section { margin-top: 28px; padding-top: 20px; border-top: 2px solid var(--navy); page-break-inside: avoid; break-inside: avoid; }
  .signatures-title { font-family: 'Inter', sans-serif; font-size: 12pt; font-weight: 600; color: var(--navy); margin-bottom: 16px; text-align: center; letter-spacing: 1px; text-transform: uppercase; }
  .signatures-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 20px; width: 100%; page-break-inside: avoid; break-inside: avoid; }
  .sig-block { border: 1px solid var(--border); padding: 16px; page-break-inside: avoid; break-inside: avoid; }
  .sig-block .sig-role { font-size: 7.5pt; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .sig-block .sig-name { font-family: 'Inter', sans-serif; font-size: 12pt; color: var(--navy); margin-bottom: 12px; font-weight: 600; }
  .sig-image-zone { height: 60px; border: 1px dashed var(--border); display: flex; align-items: center; justify-content: center; margin-bottom: 8px; background: #fbfbfb; }
  .sig-image-zone img { max-height: 55px; max-width: 100%; }
  .sig-image-zone .empty { font-size: 8pt; color: var(--border); font-style: italic; }
  .sig-date { font-size: 8pt; color: var(--muted); }
  .sig-mention { font-size: 7.5pt; color: var(--muted); font-style: italic; margin-top: 4px; }
  .page-footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; font-size: 7.5pt; color: var(--muted); }
  .text-bold { font-weight: 600; }
  .pdf-running-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 40px; background: white; border-bottom: 1px solid var(--border); padding: 0 20mm; align-items: center; justify-content: space-between; font-size: 8pt; z-index: 9999; box-sizing: border-box; }
  .pdf-running-header .rh-title { font-weight: 600; color: var(--ink); font-size: 8pt; }
  .pdf-running-header .rh-ref { color: var(--muted); font-size: 7.5pt; }
  @page { size: A4; margin: 40px 0; }
  @media print { body { background: white; margin: 0; padding: 40px 0; } .page { margin: 0; padding: 0 20mm; width: 100%; box-sizing: border-box; } .pdf-running-header { display: flex !important; } }
</style>
</head>
<body>
<div class="pdf-running-header">
  <span class="rh-title">${dc?.name || "—"} — Contrat à Durée Indéterminée</span>
  <span class="rh-ref">Réf. ${refId}</span>
</div>
<div class="page">

  <div class="title-block">
    <h1>Contrat de Travail<br>à Durée Indéterminée</h1>
    <div class="subtitle">Prise d'effet au ${fr(contract?.start_date)}</div>
  </div>

  <div class="parties-grid">
    <div class="party-card">
      <div class="party-label">L'Employeur</div>
      <div class="party-name">${dc?.name || "—"}</div>
      <div class="party-detail"><span class="label">Forme juridique</span><span>${dc?.legal_form || "—"}</span></div>
      <div class="party-detail"><span class="label">SIRET</span><span>${formatSiret(dc?.siret) || "—"}</span></div>
      <div class="party-detail"><span class="label">Siège social</span><span>${compAddr}</span></div>
      <div class="party-detail"><span class="label">Représenté par</span><span>${legalRepName}, ${legalRepRole}</span></div>
    </div>
    <div class="party-card candidate">
      <div class="party-label">Le / La Salarié(e)</div>
      <div class="party-name">${dd?.firstname || ""} ${dd?.lastname || ""}</div>
      <div class="party-detail"><span class="label">Date de naissance</span><span>${fr(dd?.birthday)}</span></div>
      <div class="party-detail"><span class="label">Adresse</span><span>${[dd?.street, [dd?.postcode, dd?.city].filter(Boolean).join(" ")].filter(Boolean).join(", ") || dd?.address || "—"}</span></div>
      <div class="party-detail"><span class="label">N° Sécu</span><span>${dd?.social_security_number || "—"}</span></div>
      <div class="party-detail"><span class="label">Nationalité</span><span>${dd?.nationality || (dd?.id_type === "residence_permit" ? "—" : "Française")}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="article-number">Article 1</div>
    <div class="section-title">Engagement et nature du contrat</div>
    <p class="legal-text">L'Employeur engage le (la) Salarié(e) dans le cadre d'un contrat de travail à durée indéterminée (CDI), régi par les dispositions du Code du travail et par la convention collective applicable.</p>
    <table class="info-table" style="margin-top:10px">
      <tr><td>Convention collective</td><td>${collective}</td></tr>
      <tr><td>Code IDCC</td><td>1351</td></tr>
      <tr><td>Date de prise d'effet</td><td class="text-bold">${fr(contract?.start_date)}</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="article-number">Article 2</div>
    <div class="section-title">Fonctions et qualification</div>
    <table class="info-table">
      <tr><td>Intitulé du poste</td><td class="text-bold">${contract?.job_title || "—"}</td></tr>
    </table>
    <p class="legal-text" style="margin-top:10px">Le (la) Salarié(e) exercera les missions principales suivantes :</p>
    <ul class="mission-list"><li>${contract?.job_description || "Sécurité des personnes et des biens"}</li></ul>
    <p class="legal-text" style="margin-top:8px">Cette liste n'est pas exhaustive. Le (la) Salarié(e) pourra être amené(e) à effectuer toute tâche annexe liée à ses fonctions ou aux besoins de l'entreprise.</p>
  </div>

  <div class="section">
    <div class="article-number">Article 3</div>
    <div class="section-title">Lieu de travail</div>
    <table class="info-table">
      <tr><td>Lieu d'exécution principal</td><td class="text-bold">${contract?.work_location_name || "—"}</td></tr>
      <tr><td>Adresse</td><td>${contract?.work_location || "—"}</td></tr>
      <tr><td>Zone de mobilité</td><td>${contract?.mobility_zone || "—"}</td></tr>
    </table>
    <p class="legal-text" style="margin-top:8px">Le (la) Salarié(e) pourra être amené(e) à se déplacer ponctuellement dans le cadre de ses fonctions au sein de la zone de mobilité définie ci-dessus.</p>
  </div>

  <div class="section">
    <div class="article-number">Article 4</div>
    <div class="section-title">Durée du travail</div>
    <table class="info-table">
      <tr><td>Volume mensuel contractuel</td><td class="text-bold">${fmtH(monthlyHours)} heures / mois</td></tr>
    </table>
    ${
      schedRows
        ? `<p class="legal-text" style="margin-top:10px">Répartition des horaires :</p>
    <table class="schedule-table">
      <thead><tr><th>Jour</th><th>Heure début</th><th>Heure fin</th><th>Durée</th></tr></thead>
      <tbody>${schedRows}</tbody>
    </table>`
        : ""
    }
    <div class="highlight-box" style="margin-top:10px">
      <strong>Spécificités :</strong>
      Travail de nuit : <strong>${contract?.is_night ? "Oui" : "Non"}</strong> —
      Travail le dimanche : <strong>${contract?.is_sunday ? "Oui" : "Non"}</strong> —
      Jours fériés : <strong>${contract?.is_holiday ? "Oui" : "Non"}</strong>
    </div>
  </div>

  <div class="section">
    <div class="article-number">Article 5</div>
    <div class="section-title">Rémunération</div>
    <div class="remu-grid">
      <div class="remu-card"><span class="remu-value">${hourlyRate != null ? fmt2(hourlyRate) : "—"} €</span><div class="remu-label">Taux horaire brut</div></div>
      <div class="remu-card"><span class="remu-value">${fmtH(monthlyHours)} h</span><div class="remu-label">Volume horaire contractuel</div></div>
      <div class="remu-card"><span class="remu-value">${contract?.overtime_rate != null ? `${contract.overtime_rate} %` : "—"}</span><div class="remu-label">Majoration heures sup.</div></div>
    </div>
    ${monthlySalary != null ? `<div class="highlight-box" style="margin-top:10px; font-size:10pt; text-align:center;"><strong>Salaire brut mensuel de base : ${fmt2(monthlySalary)} €</strong></div>` : ""}
    <p class="legal-text" style="margin-top:12px">La rémunération est versée mensuellement par virement bancaire sur le compte indiqué par le (la) Salarié(e).</p>
    <p class="legal-text" style="margin-top:10px; margin-bottom:6px"><strong>Primes et indemnités :</strong></p>
    <div class="bonus-grid">
      <div class="bonus-row"><span class="bonus-label">Indemnité repas</span><span class="bonus-value">${contract?.meal_bonus != null && contract.meal_bonus !== "" ? `${contract.meal_bonus} €` : "—"}</span></div>
      <div class="bonus-row"><span class="bonus-label">Indemnité transport</span><span class="bonus-value">${contract?.transport_bonus != null && contract.transport_bonus !== "" ? `${contract.transport_bonus} €` : "—"}</span></div>
      <div class="bonus-row"><span class="bonus-label">Majoration nuit</span><span class="bonus-value">${contract?.night_bonus != null && contract.night_bonus !== "" ? `${contract.night_bonus} €` : "—"}</span></div>
      <div class="bonus-row"><span class="bonus-label">Majoration dimanche</span><span class="bonus-value">${contract?.sunday_bonus != null && contract.sunday_bonus !== "" ? `${contract.sunday_bonus} €` : "—"}</span></div>
      <div class="bonus-row"><span class="bonus-label">Majoration jour férié</span><span class="bonus-value">${contract?.holiday_bonus != null && contract.holiday_bonus !== "" ? `${contract.holiday_bonus} €` : "—"}</span></div>
    </div>
    ${contract?.equipment_provided ? `<div class="highlight-box" style="margin-top:10px"><strong>Équipements fournis :</strong> ${contract?.equipment_details || "—"}</div>` : ""}
  </div>

  <div class="section">
    <div class="article-number">Article 6</div>
    <div class="section-title">Période d'essai</div>
    <p class="legal-text">Le présent contrat est soumis à une période d'essai conformément aux dispositions légales et conventionnelles applicables.</p>
    <table class="info-table" style="margin-top:8px">
      <tr><td>Durée</td><td class="text-bold">${contract?.trial_period_days ? `${contract.trial_period_days} jours` : "—"}${contract?.trial_period ? ` (${contract.trial_period})` : ""}</td></tr>
      <tr><td>Renouvelable</td><td>${contract?.trial_period_renewable ? "Oui, une fois" : "Non"}</td></tr>
    </table>
    <p class="legal-text" style="margin-top:8px">Durant cette période, chacune des parties peut rompre le contrat sans indemnité, sous réserve du respect du délai de prévenance prévu par la loi et la convention collective.</p>
  </div>

  <div class="section">
    <div class="article-number">Article 7</div>
    <div class="section-title">Congés payés</div>
    <p class="legal-text">Le (la) Salarié(e) bénéficie de 2,5 jours ouvrables de congés payés par mois de travail effectif, soit 30 jours ouvrables par an (5 semaines), conformément aux dispositions légales.</p>
  </div>

  <div class="section">
    <div class="article-number">Article 8</div>
    <div class="section-title">Obligations professionnelles</div>
    <p class="legal-text">Le (la) Salarié(e) s'engage à :</p>
    <ul class="mission-list" style="margin-top:6px">
      <li>Respecter les règles internes de l'entreprise (règlement intérieur, chartes, procédures).</li>
      <li>Consacrer toute son activité professionnelle à l'exercice de ses fonctions, sauf autorisation écrite préalable de l'Employeur.</li>
      <li>Informer immédiatement l'Employeur de toute situation susceptible d'affecter l'exécution de sa mission.</li>
      <li>Conserver le matériel et les équipements mis à disposition et les restituer à la fin du contrat.</li>
      <li>Maintenir en cours de validité sa carte professionnelle CNAPS et toute habilitation requise.</li>
    </ul>
  </div>

  <div class="section">
    <div class="article-number">Article 9</div>
    <div class="section-title">Confidentialité</div>
    <p class="legal-text">Le (la) Salarié(e) s'engage à observer la plus stricte confidentialité sur toutes les informations dont il (elle) aura connaissance dans le cadre de l'exécution de ses fonctions. Cette obligation s'applique pendant toute la durée du contrat et se poursuit après sa rupture.</p>
  </div>

  <div class="section">
    <div class="article-number">Article 10</div>
    <div class="section-title">Protection des données personnelles</div>
    <p class="legal-text">Dans le cadre du contrat de travail, l'Employeur collecte et traite des données personnelles concernant le (la) Salarié(e) conformément au RGPD et à la loi Informatique et Libertés. Le (la) Salarié(e) dispose d'un droit d'accès, de rectification et d'opposition auprès du responsable RH.</p>
  </div>

  <div class="section">
    <div class="article-number">Article 11</div>
    <div class="section-title">Rupture du contrat</div>
    <p class="legal-text">Le présent contrat peut être rompu dans les conditions prévues par le Code du travail, notamment par démission, licenciement, rupture conventionnelle homologuée, ou tout autre mode de rupture prévu par la loi, sous réserve du respect des préavis applicables.</p>
  </div>

  ${
    contract?.custom_clauses
      ? `<div class="section">
    <div class="article-number">Article 12</div>
    <div class="section-title">Clauses particulières</div>
    <p class="legal-text">${contract.custom_clauses}</p>
  </div>`
      : ""
  }

  <div class="section">
    <div class="article-number">Article ${contract?.custom_clauses ? "13" : "12"}</div>
    <div class="section-title">Dispositions diverses</div>
    <p class="legal-text">Le présent contrat annule et remplace tout accord verbal ou écrit antérieur portant sur le même objet. Toute modification devra faire l'objet d'un avenant écrit signé par les deux parties. En cas de litige, les parties s'efforceront de trouver une solution amiable ; à défaut, le différend sera porté devant le Conseil de Prud'hommes compétent.</p>
    <p class="legal-text" style="margin-top:6px">Fait en deux exemplaires originaux, dont un remis à chaque partie. <strong>Le ${genDate}.</strong></p>
  </div>

  <div class="signatures-section">
    <div class="signatures-title">Signatures</div>
    <div class="signatures-grid">
      <div class="sig-block">
        <div class="sig-role">Pour l'Employeur</div>
        <div class="sig-name">${legalRepName}</div>
        <div class="sig-mention" style="margin-bottom:8px;">${legalRepRole}</div>
        <div class="sig-image-zone" style="position:relative;">
          ${company?.stamp_url ? `<img src="${company.stamp_url}" alt="Tampon" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); max-height:55px; max-width:90%; opacity:0.5; object-fit:contain; z-index:0;"/>` : ""}
          <div style="position:relative; z-index:1;">${sigCo}</div>
        </div>
        <div class="sig-date">${contract?.signed_at_company ? `Signé le ${fr(contract.signed_at_company)}` : "—"}</div>
        <div class="sig-mention">« Bon pour accord »</div>
      </div>
      <div class="sig-block">
        <div class="sig-role">Le / La Salarié(e)</div>
        <div class="sig-name">${dd?.firstname || ""} ${dd?.lastname || ""}</div>
        <div class="sig-image-zone">${sigCa}</div>
        <div class="sig-date">${contract?.signed_at_candidate ? `Signé le ${fr(contract.signed_at_candidate)}` : "—"}</div>
        <div class="sig-mention">« Lu et approuvé »</div>
      </div>
    </div>
  </div>

  <footer class="page-footer">
    <span>Généré le ${genDate} par WeSafe Recruitment</span>
  </footer>

</div></body></html>`;
};

// ── Template CDD classique ────────────────────────────────────────────────────
export const buildCddHtml = (d) => {
  const {
    dc,
    dd,
    contract,
    company,
    candidate,
    apply,
    ws,
    schedKnown,
    DAY_FR: DAYS,
    monthlyHours,
    hourlyRate,
    monthlySalary,
  } = d;
  const refId = apply?.id?.substring(0, 8)?.toUpperCase() || "—";
  const genDate = fr(new Date().toISOString());
  const compAddr = dc?.address || [dc?.street, dc?.postcode, dc?.city].filter(Boolean).join(", ") || "—";
  const legalRepName =
    [dc?.legal_representative_firstname, dc?.legal_representative_lastname].filter(Boolean).join(" ") ||
    dc?.legal_representative ||
    "—";
  const legalRepRole = dc?.legal_representative_role || "Dirigeant";
  const cddDays =
    contract?.start_date && contract?.end_date
      ? Math.round((new Date(contract.end_date) - new Date(contract.start_date)) / 86400000)
      : null;
  const isLongCdd = cddDays == null || cddDays > 30;
  const collective = contract?.collective_agreement || "CCN Sécurité privée — IDCC 1351";
  const calcDur = (s, e) => {
    try {
      const [sh, sm] = s.split(":").map(Number);
      const [eh, em] = e.split(":").map(Number);
      const diff = eh * 60 + em - (sh * 60 + sm);
      if (!Number.isNaN(diff) && diff > 0)
        return `${Math.floor(diff / 60)}h${diff % 60 > 0 ? String(diff % 60).padStart(2, "0") : ""}`;
    } catch {
      /* invalid time format — fall through */
    }
    return "—";
  };
  const schedRows =
    schedKnown && ws && Object.entries(ws).some(([, v]) => v?.enabled)
      ? Object.entries(ws)
          .filter(([, v]) => v?.enabled)
          .map(
            ([day, h]) =>
              `<tr><td>${DAYS?.[day] || day}</td><td>${h.start || "—"}</td><td>${h.end || "—"}</td><td>${calcDur(h.start || "", h.end || "")}</td></tr>`,
          )
          .join("")
      : "";
  const eq = (code) => (contract?.cdd_reason_code === code ? "active" : "");
  const sigCo = company?.signature_url
    ? `<img src="${company.signature_url}" alt="Signature employeur">`
    : `<span class="empty">En attente de signature</span>`;
  const sigCa = candidate?.signature_url
    ? `<img src="${candidate.signature_url}" alt="Signature salarié">`
    : `<span class="empty">En attente de signature</span>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contrat de Travail CDD — ${dd?.lastname || ""} ${dd?.firstname || ""}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  :root {
    --navy: #1a2744; --navy-mid: #2d3f6e; --accent: #c0392b; --accent-light: #e74c3c;
    --ink: #1c1c1e; --ink-light: #3a3a3c; --muted: #6e6e73;
    --border: #d1d5e0; --bg: #f8f7f4; --white: #ffffff;
    --warning-bg: #fef3f2; --warning-border: #c0392b;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.65; color: var(--ink); background: var(--bg); }
  .page { width: 210mm; min-height: 297mm; margin: 0 auto; background: var(--white); padding: 18mm 20mm 20mm 20mm; box-sizing: border-box; overflow: hidden; }
  .contract-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 14px; border-bottom: 2.5px solid var(--navy); margin-bottom: 18px; }
  .header-left .company-logo { font-family: 'Inter', sans-serif; font-size: 20pt; font-weight: 600; color: var(--navy); display: block; margin-bottom: 3px; }
  .header-left .company-sub { font-size: 8pt; color: var(--muted); letter-spacing: 0.8px; text-transform: uppercase; }
  .contract-badge { display: inline-block; background: var(--accent); color: var(--white); font-size: 8pt; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; padding: 5px 12px; margin-bottom: 4px; }
  .contract-ref { font-size: 8pt; color: var(--muted); text-align: right; }
  .alert-banner { background: var(--warning-bg); border: 1px solid var(--warning-border); border-left: 4px solid var(--warning-border); padding: 8px 14px; font-size: 8pt; color: var(--accent); margin-bottom: 16px; line-height: 1.5; }
  .title-block { text-align: center; padding: 22px 0 20px; border-bottom: 1px solid var(--border); margin-bottom: 22px; }
  .title-block h1 { font-family: 'Inter', sans-serif; font-size: 22pt; font-weight: 600; color: var(--navy); line-height: 1.15; }
  .title-block .period-badge { display: inline-block; background: var(--navy); color: var(--white); font-size: 9pt; font-weight: 500; padding: 5px 16px; margin-top: 10px; }
  .parties-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 14px; margin-bottom: 22px; width: 100%; }
  .party-card { border: 1px solid var(--border); border-top: 3px solid var(--navy); padding: 14px 16px; }
  .party-card.candidate { border-top-color: var(--accent); }
  .party-label { font-size: 7pt; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .party-name { font-family: 'Inter', sans-serif; font-size: 13pt; font-weight: 600; color: var(--navy); margin-bottom: 8px; }
  .party-detail { display: flex; gap: 6px; font-size: 8.5pt; color: var(--ink-light); margin-bottom: 3px; }
  .party-detail .label { color: var(--muted); min-width: 90px; flex-shrink: 0; }
  .section { margin-bottom: 28px; }
  .section-title { font-family: 'Inter', sans-serif; font-size: 12pt; font-weight: 600; color: var(--navy); border-left: 3px solid var(--accent); padding-left: 10px; margin-bottom: 10px; line-height: 1.2; }
  .article-number { font-size: 7.5pt; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--accent); margin-bottom: 3px; }
  .motif-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 10px 0; }
  .motif-item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border: 1px solid var(--border); font-size: 8.5pt; color: var(--muted); }
  .motif-item.active { border-color: var(--accent); color: var(--ink); background: var(--warning-bg); font-weight: 500; }
  .motif-dot { width: 8px; height: 8px; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0; }
  .motif-item.active .motif-dot { background: var(--accent); border-color: var(--accent); }
  .info-table { width: 100%; border-collapse: collapse; font-size: 9pt; margin-top: 6px; }
  .info-table tr { border-bottom: 1px solid var(--border); }
  .info-table tr:last-child { border-bottom: none; }
  .info-table td { padding: 6px 8px; vertical-align: top; }
  .info-table td:first-child { color: var(--muted); width: 38%; font-size: 8.5pt; }
  .info-table td:last-child { font-weight: 500; }
  .period-visual { display: flex; align-items: center; gap: 0; margin: 12px 0; font-size: 9pt; }
  .period-date { background: var(--navy); color: var(--white); padding: 8px 16px; font-weight: 600; font-size: 10pt; }
  .period-arrow { flex: 1; height: 2px; background: var(--accent); position: relative; margin: 0 12px; }
  .mission-list { list-style: none; margin-top: 6px; }
  .mission-list li { display: flex; gap: 8px; padding: 4px 0; font-size: 9pt; color: var(--ink-light); border-bottom: 1px dashed var(--border); }
  .mission-list li:last-child { border-bottom: none; }
  .mission-list li::before { content: "—"; color: var(--accent); font-weight: 600; flex-shrink: 0; }
  .highlight-box { background: #f0f2f8; border-left: 3px solid var(--navy-mid); padding: 10px 14px; font-size: 8.5pt; color: var(--ink-light); margin: 8px 0; line-height: 1.5; }
  .highlight-box.warning { background: var(--warning-bg); border-left-color: var(--accent); }
  .remu-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-top: 8px; }
  .remu-card { border: 1px solid var(--border); padding: 10px 12px; text-align: center; }
  .remu-card .remu-value { font-family: 'Inter', sans-serif; font-size: 14pt; font-weight: 600; color: var(--navy); display: block; }
  .remu-card .remu-label { font-size: 7.5pt; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
  .schedule-table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-top: 8px; }
  .schedule-table th { background: var(--navy); color: var(--white); padding: 6px 10px; text-align: left; font-weight: 500; font-size: 8pt; }
  .schedule-table td { padding: 5px 10px; border-bottom: 1px solid var(--border); color: var(--ink-light); }
  .schedule-table tr:nth-child(even) td { background: #f8f9fb; }
  .bonus-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 6px; margin-top: 8px; }
  .bonus-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; background: #f8f9fb; border: 1px solid var(--border); font-size: 8.5pt; }
  .bonus-row .bonus-label { color: var(--muted); }
  .bonus-row .bonus-value { font-weight: 600; color: var(--navy); }
  .ifc-box { background: #f0f8f4; border: 1px solid #2ecc71; border-left: 4px solid #27ae60; padding: 10px 14px; font-size: 8.5pt; color: var(--ink-light); margin-top: 8px; }
  .legal-text { font-size: 8.5pt; color: var(--ink-light); line-height: 1.6; text-align: justify; }
  .cnaps-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--navy); color: var(--white); font-size: 7.5pt; padding: 4px 10px; font-weight: 500; }
  .signatures-section { margin-top: 28px; padding-top: 20px; border-top: 2px solid var(--navy); page-break-inside: avoid; break-inside: avoid; }
  .signatures-title { font-family: 'Inter', sans-serif; font-size: 12pt; font-weight: 600; color: var(--navy); margin-bottom: 16px; text-align: center; letter-spacing: 1px; text-transform: uppercase; }
  .signatures-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 20px; width: 100%; page-break-inside: avoid; break-inside: avoid; }
  .sig-block { border: 1px solid var(--border); padding: 16px; page-break-inside: avoid; break-inside: avoid; }
  .sig-block .sig-role { font-size: 7.5pt; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .sig-block .sig-name { font-family: 'Inter', sans-serif; font-size: 12pt; color: var(--navy); margin-bottom: 12px; font-weight: 600; }
  .sig-image-zone { height: 60px; border: 1px dashed var(--border); display: flex; align-items: center; justify-content: center; margin-bottom: 8px; background: #fbfbfb; }
  .sig-image-zone img { max-height: 55px; max-width: 100%; }
  .sig-image-zone .empty { font-size: 8pt; color: var(--border); font-style: italic; }
  .sig-date { font-size: 8pt; color: var(--muted); }
  .sig-mention { font-size: 7.5pt; color: var(--muted); font-style: italic; margin-top: 4px; }
  .page-footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; font-size: 7.5pt; color: var(--muted); }
  .text-bold { font-weight: 600; }
  .pdf-running-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 40px; background: white; border-bottom: 1px solid var(--border); padding: 0 20mm; align-items: center; justify-content: space-between; font-size: 8pt; z-index: 9999; box-sizing: border-box; }
  .pdf-running-header .rh-title { font-weight: 600; color: var(--ink); font-size: 8pt; }
  .pdf-running-header .rh-ref { color: var(--muted); font-size: 7.5pt; }
  @page { size: A4; margin: 40px 0; }
  @media print { body { background: white; margin: 0; padding: 40px 0; } .page { margin: 0; padding: 0 20mm; width: 100%; box-sizing: border-box; } .pdf-running-header { display: flex !important; } }
</style>
</head>
<body>
<div class="pdf-running-header">
  <span class="rh-title">${dc?.name || "—"} — Contrat à Durée Déterminée</span>
  <span class="rh-ref">Réf. ${refId}</span>
</div>
<div class="page">

  <div class="alert-banner"><strong>⚠ Contrat d'exception :</strong> Le CDD ne peut être conclu que pour les motifs limitativement énumérés par le Code du travail (art. L1242-2). Tout CDD conclu en dehors de ces cas peut être requalifié en CDI.</div>

  <div class="title-block">
    <h1>Contrat de Travail<br>à Durée Déterminée</h1>
    <div class="period-badge">Du ${fr(contract?.start_date)} au ${fr(contract?.end_date)}</div>
  </div>

  <div class="parties-grid">
    <div class="party-card">
      <div class="party-label">L'Employeur</div>
      <div class="party-name">${dc?.name || "—"}</div>
      <div class="party-detail"><span class="label">Forme juridique</span><span>${dc?.legal_form || "—"}</span></div>
      <div class="party-detail"><span class="label">SIRET</span><span>${formatSiret(dc?.siret) || "—"}</span></div>
      <div class="party-detail"><span class="label">Siège social</span><span>${compAddr}</span></div>
      <div class="party-detail"><span class="label">Représenté par</span><span>${legalRepName}, ${legalRepRole}</span></div>
    </div>
    <div class="party-card candidate">
      <div class="party-label">Le / La Salarié(e)</div>
      <div class="party-name">${dd?.firstname || ""} ${dd?.lastname || ""}</div>
      <div class="party-detail"><span class="label">Date de naissance</span><span>${fr(dd?.birthday)}</span></div>
      <div class="party-detail"><span class="label">Adresse</span><span>${[dd?.street, [dd?.postcode, dd?.city].filter(Boolean).join(" ")].filter(Boolean).join(", ") || dd?.address || "—"}</span></div>
      <div class="party-detail"><span class="label">N° Sécu</span><span>${dd?.social_security_number || "—"}</span></div>
      <div class="party-detail"><span class="label">Nationalité</span><span>${dd?.nationality || (dd?.id_type === "residence_permit" ? "—" : "Française")}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="article-number">Article 1</div>
    <div class="section-title">Motif de recours au CDD</div>
    <p class="legal-text">Conformément à l'article L1242-2 du Code du travail, le présent contrat est conclu pour le motif suivant :</p>
    <div class="motif-grid">
      <div class="motif-item ${eq("REMPLACEMENT")}"><div class="motif-dot"></div>Remplacement d'un salarié absent</div>
      <div class="motif-item ${eq("ACCROISSEMENT")}"><div class="motif-dot"></div>Accroissement temporaire d'activité</div>
      <div class="motif-item ${eq("SAISONNIER")}"><div class="motif-dot"></div>Emploi saisonnier</div>
      <div class="motif-item ${eq("USAGE")}"><div class="motif-dot"></div>Contrat d'usage</div>
      <div class="motif-item ${eq("ATTENTE_CDI")}"><div class="motif-dot"></div>Attente d'entrée en service d'un CDI</div>
      <div class="motif-item ${eq("URGENCE")}"><div class="motif-dot"></div>Travaux urgents de sécurité</div>
    </div>
    <table class="info-table" style="margin-top:8px">
      <tr><td>Précision du motif</td><td>${contract?.contract_reason || "—"}</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="article-number">Article 2</div>
    <div class="section-title">Durée et terme du contrat</div>
    <div class="period-visual">
      <div class="period-date">${fr(contract?.start_date)}</div>
      <div class="period-arrow"></div>
      <div class="period-date">${fr(contract?.end_date)}</div>
    </div>
    <table class="info-table" style="margin-top:8px">
      <tr><td>Date de début</td><td class="text-bold">${fr(contract?.start_date)}</td></tr>
      <tr><td>Date de fin</td><td class="text-bold">${fr(contract?.end_date)}</td></tr>
      <tr><td>Convention collective</td><td>${collective}</td></tr>
    </table>
    <div class="highlight-box warning" style="margin-top:10px"><strong>Durées maximales légales (renouvellement inclus) :</strong> 18 mois en principe — 24 mois pour commande à l'exportation ou travaux urgents — 9 mois pour attente d'un CDI ou travaux urgents de sécurité.</div>
  </div>

  <div class="section">
    <div class="article-number">Article 3</div>
    <div class="section-title">Fonctions et qualification</div>
    <table class="info-table">
      <tr><td>Intitulé du poste</td><td class="text-bold">${contract?.job_title || "—"}</td></tr>
    </table>
    <p class="legal-text" style="margin-top:10px">Le (la) Salarié(e) exercera les missions principales suivantes :</p>
    <ul class="mission-list"><li>${contract?.job_description || "Sécurité des personnes et des biens"}</li></ul>
  </div>

  <div class="section">
    <div class="article-number">Article 4</div>
    <div class="section-title">Lieu de travail</div>
    <table class="info-table">
      <tr><td>Lieu d'exécution principal</td><td class="text-bold">${contract?.work_location_name || "—"}</td></tr>
      <tr><td>Adresse</td><td>${contract?.work_location || "—"}</td></tr>
      <tr><td>Zone de mobilité</td><td>${contract?.mobility_zone || "—"}</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="article-number">Article 5</div>
    <div class="section-title">Durée du travail</div>
    <table class="info-table">
      <tr><td>Volume mensuel contractuel</td><td class="text-bold">${fmtH(monthlyHours)} heures / mois</td></tr>
    </table>
    ${
      schedRows
        ? `<table class="schedule-table" style="margin-top:10px">
      <thead><tr><th>Jour</th><th>Heure début</th><th>Heure fin</th><th>Durée</th></tr></thead>
      <tbody>${schedRows}</tbody>
    </table>`
        : ""
    }
    <div class="highlight-box" style="margin-top:10px">
      <strong>Spécificités :</strong>
      Nuit : <strong>${contract?.is_night ? "Oui" : "Non"}</strong> —
      Dimanche : <strong>${contract?.is_sunday ? "Oui" : "Non"}</strong> —
      Jours fériés : <strong>${contract?.is_holiday ? "Oui" : "Non"}</strong>
    </div>
  </div>

  <div class="section">
    <div class="article-number">Article 6</div>
    <div class="section-title">Rémunération</div>
    <div class="remu-grid">
      <div class="remu-card"><span class="remu-value">${hourlyRate != null ? fmt2(hourlyRate) : "—"} €</span><div class="remu-label">Taux horaire brut</div></div>
      <div class="remu-card"><span class="remu-value">${fmtH(monthlyHours)} h</span><div class="remu-label">Volume horaire</div></div>
      <div class="remu-card"><span class="remu-value">${contract?.overtime_rate != null ? `${contract.overtime_rate} %` : "—"}</span><div class="remu-label">Majoration H. sup.</div></div>
    </div>
    ${monthlySalary != null ? `<div class="highlight-box" style="margin-top:10px; font-size:10pt; text-align:center;"><strong>${isLongCdd ? "Salaire brut mensuel de base" : "Salaire brut total du contrat"} : ${fmt2(monthlySalary)} €</strong></div>` : ""}
    <p class="legal-text" style="margin-top:10px; margin-bottom:6px"><strong>Primes et indemnités :</strong></p>
    <div class="bonus-grid">
      <div class="bonus-row"><span class="bonus-label">Indemnité repas</span><span class="bonus-value">${contract?.meal_bonus != null && contract.meal_bonus !== "" ? `${contract.meal_bonus} €` : "—"}</span></div>
      <div class="bonus-row"><span class="bonus-label">Indemnité transport</span><span class="bonus-value">${contract?.transport_bonus != null && contract.transport_bonus !== "" ? `${contract.transport_bonus} €` : "—"}</span></div>
      <div class="bonus-row"><span class="bonus-label">Majoration nuit</span><span class="bonus-value">${contract?.night_bonus != null && contract.night_bonus !== "" ? `${contract.night_bonus} €` : "—"}</span></div>
      <div class="bonus-row"><span class="bonus-label">Majoration dimanche</span><span class="bonus-value">${contract?.sunday_bonus != null && contract.sunday_bonus !== "" ? `${contract.sunday_bonus} €` : "—"}</span></div>
      <div class="bonus-row"><span class="bonus-label">Majoration jour férié</span><span class="bonus-value">${contract?.holiday_bonus != null && contract.holiday_bonus !== "" ? `${contract.holiday_bonus} €` : "—"}</span></div>
    </div>
    ${contract?.equipment_provided ? `<div class="highlight-box" style="margin-top:10px"><strong>Équipements fournis :</strong> ${contract?.equipment_details || "—"}</div>` : ""}
  </div>

  <div class="section">
    <div class="article-number">Article 7</div>
    <div class="section-title">Période d'essai</div>
    <table class="info-table">
      <tr><td>Durée</td><td class="text-bold">${contract?.trial_period_days ? `${contract.trial_period_days} jours` : "—"}${contract?.trial_period ? ` (${contract.trial_period})` : ""}</td></tr>
    </table>
    <div class="highlight-box warning" style="margin-top:8px"><strong>⚠ Rappel légal :</strong> La période d'essai est calculée à raison d'un jour par semaine — dans la limite de 2 semaines si la durée initiale est ≤ 6 mois, dans la limite d'un mois au-delà.</div>
  </div>

  <div class="section">
    <div class="article-number">Article 8</div>
    <div class="section-title">Congés payés</div>
    <p class="legal-text">Le (la) Salarié(e) acquiert des congés payés à raison de 2,5 jours ouvrables par mois de travail effectif. Si le contrat prend fin avant que le (la) Salarié(e) ait pu solder l'ensemble de ses congés acquis, une indemnité compensatrice de congés payés lui sera versée dans le solde de tout compte (art. L3141-28 C.trav.).</p>
  </div>

  <div class="section">
    <div class="article-number">Article 9</div>
    <div class="section-title">Indemnité de fin de contrat (IFC)</div>
    <div class="ifc-box"><strong>Indemnité de précarité :</strong> Au terme du présent contrat, le (la) Salarié(e) percevra une indemnité de fin de contrat égale à <strong>10 % de la rémunération brute totale</strong> perçue pendant la durée du contrat, conformément à l'article L1243-8 du Code du travail.</div>
    <p class="legal-text" style="margin-top:8px">L'IFC n'est pas due en cas de refus par le salarié d'un CDI pour le même poste, rupture à l'initiative du salarié, faute grave ou force majeure.</p>
  </div>

  <div class="section">
    <div class="article-number">Article 10</div>
    <div class="section-title">Rupture anticipée</div>
    <p class="legal-text">Le CDD ne peut être rompu avant son terme que dans les cas suivants :</p>
    <ul class="mission-list" style="margin-top:6px">
      <li>Accord amiable écrit entre les parties.</li>
      <li>Faute grave de l'une ou l'autre des parties.</li>
      <li>Force majeure.</li>
      <li>Inaptitude constatée par le médecin du travail.</li>
      <li>Embauche du (de la) salarié(e) en CDI (préavis : 1 jour/semaine restant, max 2 semaines).</li>
    </ul>
  </div>

  <div class="section">
    <div class="article-number">Article 11</div>
    <div class="section-title">Obligations professionnelles et confidentialité</div>
    <ul class="mission-list">
      <li>Respecter le règlement intérieur, les chartes et procédures internes.</li>
      <li>Consacrer son activité professionnelle à l'exécution de ses fonctions pendant toute la durée du contrat.</li>
      <li>Restituer à la fin du contrat l'ensemble du matériel et équipements mis à disposition.</li>
      <li>Maintenir en cours de validité sa carte professionnelle CNAPS et toute habilitation requise.</li>
      <li>Observer la plus stricte confidentialité sur toutes les informations dont il (elle) aura connaissance, pendant et après le contrat.</li>
    </ul>
  </div>

  <div class="section">
    <div class="article-number">Article 12</div>
    <div class="section-title">Protection des données personnelles</div>
    <p class="legal-text">Dans le cadre du contrat, l'Employeur collecte et traite des données personnelles conformément au RGPD et à la loi Informatique et Libertés. Le (la) Salarié(e) dispose de droits d'accès, de rectification et d'opposition auprès du service RH.</p>
  </div>

  ${
    contract?.custom_clauses
      ? `<div class="section">
    <div class="article-number">Article 13</div>
    <div class="section-title">Clauses particulières</div>
    <p class="legal-text">${contract.custom_clauses}</p>
  </div>`
      : ""
  }

  <div class="section">
    <div class="article-number">Article ${contract?.custom_clauses ? "14" : "13"}</div>
    <div class="section-title">Dispositions diverses</div>
    <p class="legal-text">Le présent contrat est régi par les dispositions du Code du travail et par la convention collective <strong>${collective}</strong> (IDCC 1351). Toute modification devra faire l'objet d'un avenant écrit signé par les deux parties. En cas de litige, le différend sera porté devant le Conseil de Prud'hommes compétent.</p>
    <p class="legal-text" style="margin-top:6px">Fait en deux exemplaires originaux, dont un remis à chaque partie. <strong>Le ${genDate}.</strong></p>
  </div>

  <div class="signatures-section">
    <div class="signatures-title">Signatures</div>
    <div class="signatures-grid">
      <div class="sig-block">
        <div class="sig-role">Pour l'Employeur</div>
        <div class="sig-name">${legalRepName}</div>
        <div class="sig-mention" style="margin-bottom:8px;">${legalRepRole}</div>
        <div class="sig-image-zone" style="position:relative;">
          ${company?.stamp_url ? `<img src="${company.stamp_url}" alt="Tampon" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); max-height:55px; max-width:90%; opacity:0.5; object-fit:contain; z-index:0;"/>` : ""}
          <div style="position:relative; z-index:1;">${sigCo}</div>
        </div>
        <div class="sig-date">${contract?.signed_at_company ? `Signé le ${fr(contract.signed_at_company)}` : "—"}</div>
        <div class="sig-mention">« Bon pour accord »</div>
      </div>
      <div class="sig-block">
        <div class="sig-role">Le / La Salarié(e)</div>
        <div class="sig-name">${dd?.firstname || ""} ${dd?.lastname || ""}</div>
        <div class="sig-image-zone">${sigCa}</div>
        <div class="sig-date">${contract?.signed_at_candidate ? `Signé le ${fr(contract.signed_at_candidate)}` : "—"}</div>
        <div class="sig-mention">« Lu et approuvé »</div>
      </div>
    </div>
  </div>

  <footer class="page-footer">
    <span>Généré le ${genDate} par WeSafe Recruitment</span>
  </footer>

</div></body></html>`;
};

// ── Template CDD Vacations ────────────────────────────────────────────────────
export const buildVacationsHtml = (d) => {
  const { dc, dd, contract, company, candidate, apply, monthlyHours, hourlyRate, monthlySalary, vacs } = d;
  const refId = apply?.id?.substring(0, 8)?.toUpperCase() || "—";
  const genDate = fr(new Date().toISOString());
  const compAddr = dc?.address || [dc?.street, dc?.postcode, dc?.city].filter(Boolean).join(", ") || "—";
  const legalRepName =
    [dc?.legal_representative_firstname, dc?.legal_representative_lastname].filter(Boolean).join(" ") ||
    dc?.legal_representative ||
    "—";
  const legalRepRole = dc?.legal_representative_role || "Dirigeant";
  const collective = contract?.collective_agreement || "CCN Sécurité privée — IDCC 1351";
  const startDate = fr(contract?.start_date ?? (vacs.length > 0 ? vacs[0].date : null));
  const endDate = fr(contract?.end_date ?? (vacs.length > 0 ? vacs[vacs.length - 1].date : null));

  const calcDur = (s, e) => {
    try {
      const [sh, sm] = s.split(":").map(Number);
      const [eh, em] = e.split(":").map(Number);
      const diff = eh * 60 + em - (sh * 60 + sm);
      if (!Number.isNaN(diff) && diff > 0)
        return `${Math.floor(diff / 60)}h${diff % 60 > 0 ? String(diff % 60).padStart(2, "0") : ""}`;
    } catch {
      /* invalid time format — fall through */
    }
    return "—";
  };

  const shiftBadge = (type) =>
    type === "night"
      ? `<span class="shift-badge shift-night">Nuit</span>`
      : type === "mixed"
        ? `<span class="shift-badge shift-mixed">Mixte</span>`
        : `<span class="shift-badge shift-day">Jour</span>`;

  const vacRows = vacs
    .map(
      (v) =>
        `<tr>
      <td>${fr(v.date)}</td>
      <td>${v.start_time || "—"}</td>
      <td>${v.end_time || "—"}</td>
      <td>${calcDur(v.start_time || "", v.end_time || "")}</td>
      <td>${shiftBadge(v.type || "day")}</td>
      <td>${v.location || contract?.work_location_name || "—"}</td>
    </tr>`,
    )
    .join("");

  const workLocationsRows =
    Array.isArray(contract?.work_locations) && contract.work_locations.length
      ? contract.work_locations
          .map(
            (loc) =>
              `<tr><td><span class="location-pill">${loc.name || "—"}</span></td><td>${loc.address || "—"}</td><td>${loc.zone || "—"}</td></tr>`,
          )
          .join("")
      : "";

  const sigCo = company?.signature_url
    ? `<img src="${company.signature_url}" alt="Signature employeur">`
    : `<span class="empty">En attente de signature</span>`;
  const sigCa = candidate?.signature_url
    ? `<img src="${candidate.signature_url}" alt="Signature agent">`
    : `<span class="empty">En attente de signature</span>`;
  const bonusActive = (val) => (val != null && val !== "" && val !== 0 && val !== "0" ? "active" : "");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contrat Vacations — ${dd?.lastname || ""} ${dd?.firstname || ""}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  :root {
    --dark: #141820; --dark-mid: #1e2535; --teal: #0d7377; --teal-light: #14a085;
    --gold: #e8a838; --ink: #1c1c1e; --ink-light: #3a3a3c; --muted: #6e6e73;
    --border: #d1d5e0; --bg: #f8f7f4; --white: #ffffff;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.65; color: var(--ink); background: var(--bg); }
  .page { width: 210mm; min-height: 297mm; margin: 0 auto; background: var(--white); padding: 18mm 20mm 20mm 20mm; box-sizing: border-box; overflow: hidden; }
  .header-stripe { background: var(--dark); margin: -18mm -20mm 18px; padding: 14px 20mm; display: flex; justify-content: space-between; align-items: center; }
  .header-stripe .company-logo { font-family: 'Inter', sans-serif; font-size: 20pt; font-weight: 600; color: var(--white); letter-spacing: -0.3px; }
  .header-stripe .company-sub { font-size: 8pt; color: rgba(255,255,255,0.5); letter-spacing: 0.8px; text-transform: uppercase; margin-top: 2px; }
  .header-right-block { text-align: right; }
  .contract-badge { display: inline-block; background: var(--teal); color: var(--white); font-size: 8pt; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; padding: 5px 12px; margin-bottom: 3px; }
  .contract-sub-badge { display: inline-block; background: var(--gold); color: var(--dark); font-size: 7pt; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 10px; margin-left: 4px; }
  .contract-ref { font-size: 8pt; color: rgba(255,255,255,0.4); margin-top: 4px; }
  .title-block { text-align: center; padding: 20px 0 18px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
  .title-block h1 { font-family: 'Inter', sans-serif; font-size: 21pt; font-weight: 600; color: var(--dark); line-height: 1.15; }
  .title-block .subtitle { font-size: 9.5pt; color: var(--teal); font-weight: 500; margin-top: 6px; }
  .period-chips { display: flex; justify-content: center; gap: 8px; margin-top: 12px; }
  .period-chip { background: var(--dark); color: var(--white); font-size: 9pt; font-weight: 500; padding: 5px 14px; }
  .period-sep { display: flex; align-items: center; font-size: 8pt; color: var(--teal); font-weight: 600; }
  .parties-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 14px; margin-bottom: 20px; width: 100%; }
  .party-card { border: 1px solid var(--border); border-top: 3px solid var(--dark); padding: 14px 16px; }
  .party-card.candidate { border-top-color: var(--teal); }
  .party-label { font-size: 7pt; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .party-name { font-family: 'Inter', sans-serif; font-size: 13pt; font-weight: 600; color: var(--dark); margin-bottom: 8px; }
  .party-detail { display: flex; gap: 6px; font-size: 8.5pt; color: var(--ink-light); margin-bottom: 3px; }
  .party-detail .label { color: var(--muted); min-width: 90px; flex-shrink: 0; }
  .section { margin-bottom: 28px; }
  .section-title { font-family: 'Inter', sans-serif; font-size: 12pt; font-weight: 600; color: var(--dark); border-left: 3px solid var(--teal); padding-left: 10px; margin-bottom: 10px; line-height: 1.2; }
  .article-number { font-size: 7.5pt; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--teal); margin-bottom: 3px; }
  .info-table { width: 100%; border-collapse: collapse; font-size: 9pt; margin-top: 6px; }
  .info-table tr { border-bottom: 1px solid var(--border); }
  .info-table tr:last-child { border-bottom: none; }
  .info-table td { padding: 6px 8px; vertical-align: top; }
  .info-table td:first-child { color: var(--muted); width: 38%; font-size: 8.5pt; }
  .info-table td:last-child { font-weight: 500; }
  .planning-header { background: var(--dark); color: var(--white); padding: 8px 14px; font-size: 8.5pt; font-weight: 500; letter-spacing: 0.5px; }
  .vacation-table { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
  .vacation-table thead tr th { background: var(--teal); color: var(--white); padding: 7px 10px; text-align: left; font-weight: 500; font-size: 8pt; }
  .vacation-table tbody tr td { padding: 6px 10px; border-bottom: 1px solid var(--border); color: var(--ink-light); vertical-align: middle; }
  .vacation-table tbody tr:nth-child(even) td { background: #f8f9fb; }
  .shift-badge { display: inline-block; padding: 2px 8px; font-size: 7.5pt; font-weight: 600; border-radius: 2px; }
  .shift-day { background: #e8f4fd; color: #1a6ea8; }
  .shift-night { background: #1e2535; color: #8ab4d4; }
  .shift-mixed { background: #f0f8e8; color: #3a7a2a; }
  .location-pill { background: #f0f8f4; border: 1px solid var(--teal); color: var(--teal); font-size: 7.5pt; padding: 2px 8px; font-weight: 500; }
  .remu-main { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 8px; margin-top: 8px; }
  .remu-card { border: 1px solid var(--border); padding: 10px 12px; text-align: center; }
  .remu-card.primary { border-color: var(--teal); border-top: 3px solid var(--teal); }
  .remu-card .remu-value { font-family: 'Inter', sans-serif; font-size: 16pt; font-weight: 600; color: var(--dark); display: block; }
  .remu-card.primary .remu-value { color: var(--teal); }
  .remu-card .remu-label { font-size: 7.5pt; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
  .bonus-section { margin-top: 10px; }
  .bonus-title { font-size: 8pt; font-weight: 600; color: var(--muted); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; }
  .bonus-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; }
  .bonus-item { border: 1px solid var(--border); padding: 8px 10px; display: flex; flex-direction: column; gap: 3px; }
  .bonus-item .b-label { font-size: 7.5pt; color: var(--muted); }
  .bonus-item .b-value { font-weight: 600; font-size: 10pt; color: var(--dark); }
  .bonus-item.active { border-color: var(--teal); background: #f0f9f8; }
  .bonus-item.active .b-value { color: var(--teal); }
  .cnaps-block { display: flex; align-items: center; gap: 10px; background: var(--dark); color: var(--white); padding: 10px 16px; margin-top: 8px; }
  .cnaps-info .cnaps-num { font-weight: 600; font-size: 11pt; letter-spacing: 1px; }
  .cnaps-info .cnaps-exp { font-size: 8pt; color: rgba(255,255,255,0.5); margin-top: 2px; }
  .highlight-box { background: #f0f8f7; border-left: 3px solid var(--teal); padding: 10px 14px; font-size: 8.5pt; color: var(--ink-light); margin: 8px 0; line-height: 1.5; }
  .highlight-box.warning { background: #fef9ec; border-left-color: var(--gold); }
  .mission-list { list-style: none; margin-top: 6px; }
  .mission-list li { display: flex; gap: 8px; padding: 4px 0; font-size: 9pt; color: var(--ink-light); border-bottom: 1px dashed var(--border); }
  .mission-list li:last-child { border-bottom: none; }
  .mission-list li::before { content: "—"; color: var(--teal); font-weight: 600; flex-shrink: 0; }
  .legal-text { font-size: 8.5pt; color: var(--ink-light); line-height: 1.6; text-align: justify; }
  .signatures-section { margin-top: 28px; padding-top: 20px; border-top: 2px solid var(--dark); page-break-inside: avoid; break-inside: avoid; }
  .signatures-title { font-family: 'Inter', sans-serif; font-size: 12pt; font-weight: 600; color: var(--dark); margin-bottom: 16px; text-align: center; letter-spacing: 1px; text-transform: uppercase; }
  .signatures-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 20px; width: 100%; page-break-inside: avoid; break-inside: avoid; }
  .sig-block { border: 1px solid var(--border); padding: 16px; page-break-inside: avoid; break-inside: avoid; }
  .sig-block .sig-role { font-size: 7.5pt; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .sig-block .sig-name { font-family: 'Inter', sans-serif; font-size: 12pt; color: var(--dark); margin-bottom: 12px; font-weight: 600; }
  .sig-image-zone { height: 60px; border: 1px dashed var(--border); display: flex; align-items: center; justify-content: center; margin-bottom: 8px; background: #fbfbfb; }
  .sig-image-zone img { max-height: 55px; max-width: 100%; }
  .sig-image-zone .empty { font-size: 8pt; color: var(--border); font-style: italic; }
  .sig-date { font-size: 8pt; color: var(--muted); }
  .sig-mention { font-size: 7.5pt; color: var(--muted); font-style: italic; margin-top: 4px; }
  .page-footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; font-size: 7.5pt; color: var(--muted); }
  .text-bold { font-weight: 600; }
  .pdf-running-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 40px; background: white; border-bottom: 1px solid var(--border); padding: 0 20mm; align-items: center; justify-content: space-between; font-size: 8pt; z-index: 9999; box-sizing: border-box; }
  .pdf-running-header .rh-title { font-weight: 600; color: var(--ink); font-size: 8pt; }
  .pdf-running-header .rh-ref { color: var(--muted); font-size: 7.5pt; }
  @page { size: A4; margin: 40px 0; }
  @media print { body { background: white; margin: 0; padding: 40px 0; } .page { margin: 0; padding: 0 20mm; width: 100%; box-sizing: border-box; } .pdf-running-header { display: flex !important; } }
</style>
</head>
<body>
<div class="pdf-running-header">
  <span class="rh-title">${dc?.name || "—"} — CDD Vacations</span>
  <span class="rh-ref">Réf. ${refId}</span>
</div>
<div class="page">

  <div class="title-block">
    <h1>Contrat de Travail à Durée Déterminée<br><em style="font-style:italic; font-weight:400;">Contrat de Vacations</em></h1>
    <div class="subtitle">Sécurité privée — ${contract?.job_title || "—"}</div>
    <div class="period-chips">
      <div class="period-chip">Du ${startDate}</div>
      <div class="period-sep">→</div>
      <div class="period-chip">Au ${endDate}</div>
    </div>
  </div>

  <div class="parties-grid">
    <div class="party-card">
      <div class="party-label">L'Employeur</div>
      <div class="party-name">${dc?.name || "—"}</div>
      <div class="party-detail"><span class="label">Forme juridique</span><span>${dc?.legal_form || "—"}</span></div>
      <div class="party-detail"><span class="label">SIRET</span><span>${formatSiret(dc?.siret) || "—"}</span></div>
      <div class="party-detail"><span class="label">Siège social</span><span>${compAddr}</span></div>
      <div class="party-detail"><span class="label">Représenté par</span><span>${legalRepName}, ${legalRepRole}</span></div>
    </div>
    <div class="party-card candidate">
      <div class="party-label">L'Agent de Sécurité</div>
      <div class="party-name">${dd?.firstname || ""} ${dd?.lastname || ""}</div>
      <div class="party-detail"><span class="label">Date de naissance</span><span>${fr(dd?.birthday)}</span></div>
      <div class="party-detail"><span class="label">Adresse</span><span>${[dd?.street, [dd?.postcode, dd?.city].filter(Boolean).join(" ")].filter(Boolean).join(", ") || dd?.address || "—"}</span></div>
      <div class="party-detail"><span class="label">N° Sécu</span><span>${dd?.social_security_number || "—"}</span></div>
      <div class="party-detail"><span class="label">Nationalité</span><span>${dd?.nationality || (dd?.id_type === "residence_permit" ? "—" : "Française")}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="article-number">Article 1</div>
    <div class="section-title">Engagement et motif de recours</div>
    <p class="legal-text">Le présent contrat de vacations est conclu conformément aux dispositions du Code du travail relatives aux contrats à durée déterminée (art. L1242-1 et suivants) et à la convention collective nationale des entreprises de prévention et de sécurité.</p>
    <table class="info-table" style="margin-top:10px">
      <tr><td>Motif de recours</td><td class="text-bold">${contract?.contract_reason || "Accroissement temporaire d'activité"}</td></tr>
      <tr><td>Code motif</td><td>${contract?.cdd_reason_code || "—"}</td></tr>
      <tr><td>Convention collective</td><td>${collective}</td></tr>
      <tr><td>Code IDCC</td><td>1351</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="article-number">Article 2</div>
    <div class="section-title">Qualification et habilitations professionnelles</div>
    <table class="info-table">
      <tr><td>Intitulé du poste</td><td class="text-bold">${contract?.job_title || "—"}</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="article-number">Article 3</div>
    <div class="section-title">Site(s) d'affectation</div>
    <table class="info-table">
      <tr><td>Site principal</td><td class="text-bold">${contract?.work_location_name || "—"}</td></tr>
      <tr><td>Adresse</td><td>${contract?.work_location || "—"}</td></tr>
      <tr><td>Zone de mobilité</td><td>${contract?.mobility_zone || "—"}</td></tr>
    </table>
    ${
      workLocationsRows
        ? `<p class="legal-text" style="margin-top:10px; margin-bottom:6px">L'agent pourra être affecté sur les sites suivants selon les besoins opérationnels :</p>
    <table class="vacation-table" style="margin-top:6px">
      <thead><tr><th>Site</th><th>Adresse</th><th>Zone</th></tr></thead>
      <tbody>${workLocationsRows}</tbody>
    </table>`
        : ""
    }
  </div>

  <div class="section">
    <div class="article-number">Article 4</div>
    <div class="section-title">Planning des vacations</div>
    <table class="info-table" style="margin-bottom:10px">
      <tr><td>Volume total contractuel</td><td class="text-bold">${fmtH(monthlyHours)} heures</td></tr>
    </table>
    ${
      vacRows
        ? `<div class="planning-header">Planning détaillé des vacations</div>
    <table class="vacation-table">
      <thead><tr><th>Date / Jour</th><th>Début</th><th>Fin</th><th>Durée</th><th>Type</th><th>Site</th></tr></thead>
      <tbody>${vacRows}</tbody>
    </table>`
        : ""
    }
    <div class="highlight-box" style="margin-top:10px">
      <strong>Particularités de service :</strong>
      Vacation de nuit : <strong>${contract?.is_night ? "Oui" : "Non"}</strong> —
      Dimanche : <strong>${contract?.is_sunday ? "Oui" : "Non"}</strong> —
      Jours fériés : <strong>${contract?.is_holiday ? "Oui" : "Non"}</strong>
    </div>
    <p class="legal-text" style="margin-top:8px">Le planning pourra être modifié par accord entre les parties, dans le respect des durées maximales légales et conventionnelles du travail.</p>
  </div>

  <div class="section">
    <div class="article-number">Article 5</div>
    <div class="section-title">Rémunération</div>
    <div class="remu-main">
      <div class="remu-card primary"><span class="remu-value">${hourlyRate != null ? fmt2(hourlyRate) : "—"} €</span><div class="remu-label">Taux horaire brut</div></div>
      <div class="remu-card"><span class="remu-value">${fmtH(monthlyHours)} h</span><div class="remu-label">Volume total</div></div>
      <div class="remu-card"><span class="remu-value">${contract?.overtime_rate != null ? `${contract.overtime_rate} %` : "—"}</span><div class="remu-label">Maj. H. sup.</div></div>
    </div>
    <div class="bonus-section">
      <div class="bonus-title">Primes et indemnités applicables</div>
      <div class="bonus-grid">
        <div class="bonus-item ${bonusActive(contract?.meal_bonus)}"><span class="b-label">Indemnité repas</span><span class="b-value">${contract?.meal_bonus != null && contract.meal_bonus !== "" ? `${contract.meal_bonus} €` : "—"}</span></div>
        <div class="bonus-item ${bonusActive(contract?.transport_bonus)}"><span class="b-label">Indemnité transport</span><span class="b-value">${contract?.transport_bonus != null && contract.transport_bonus !== "" ? `${contract.transport_bonus} €` : "—"}</span></div>
        <div class="bonus-item ${contract?.is_night ? "active" : ""}"><span class="b-label">Majoration nuit</span><span class="b-value">${contract?.night_bonus != null && contract.night_bonus !== "" ? `${contract.night_bonus} €` : "—"}</span></div>
        <div class="bonus-item ${contract?.is_sunday ? "active" : ""}"><span class="b-label">Majoration dimanche</span><span class="b-value">${contract?.sunday_bonus != null && contract.sunday_bonus !== "" ? `${contract.sunday_bonus} €` : "—"}</span></div>
        <div class="bonus-item ${contract?.is_holiday ? "active" : ""}"><span class="b-label">Majoration férié</span><span class="b-value">${contract?.holiday_bonus != null && contract.holiday_bonus !== "" ? `${contract.holiday_bonus} €` : "—"}</span></div>
        <div class="bonus-item"><span class="b-label">IFC (fin contrat)</span><span class="b-value">10 %</span></div>
      </div>
    </div>
    ${monthlySalary != null ? `<div class="highlight-box" style="margin-top:10px; font-size:10pt; text-align:center;"><strong>Salaire brut total du contrat : ${fmt2(monthlySalary)} €</strong></div>` : ""}
    <p class="legal-text" style="margin-top:10px">La rémunération est versée mensuellement par virement bancaire, sur la base des heures effectivement réalisées.</p>
    <div class="highlight-box" style="margin-top:8px"><strong>Indemnité de fin de contrat :</strong> Au terme du présent contrat, le (la) Salarié(e) percevra une indemnité de précarité égale à 10 % de la rémunération brute totale perçue (art. L1243-8 C.trav.).</div>
    ${contract?.equipment_provided ? `<div class="highlight-box" style="margin-top:8px"><strong>Tenue et équipements fournis :</strong> ${contract?.equipment_details || "—"}</div>` : ""}
  </div>

  <div class="section">
    <div class="article-number">Article 6</div>
    <div class="section-title">Description des missions</div>
    <ul class="mission-list"><li>${contract?.job_description || "Sécurité des personnes et des biens"}</li></ul>
    <p class="legal-text" style="margin-top:8px">Le (la) salarié(e) exercera ses missions dans le strict respect de la réglementation en vigueur relative à la sécurité privée (loi n° 83-629), des consignes du client et des procédures internes de l'entreprise.</p>
  </div>

  <div class="section">
    <div class="article-number">Article 7</div>
    <div class="section-title">Période d'essai</div>
    <table class="info-table">
      <tr><td>Durée de la période d'essai</td><td class="text-bold">${contract?.trial_period_days ? `${contract.trial_period_days} jours` : "—"}${contract?.trial_period ? ` (${contract.trial_period})` : ""}</td></tr>
    </table>
    <p class="legal-text" style="margin-top:8px">Durant cette période, chacune des parties peut rompre le contrat sans indemnité sous réserve du respect du délai de prévenance légal.</p>
  </div>

  <div class="section">
    <div class="article-number">Article 8</div>
    <div class="section-title">Obligations de l'agent de sécurité</div>
    <ul class="mission-list">
      <li>Se présenter aux vacations à l'heure convenue, en tenue réglementaire et en possession de sa carte professionnelle CNAPS.</li>
      <li>Respecter les consignes et procédures du site d'affectation et de l'employeur.</li>
      <li>Signaler immédiatement tout incident, anomalie ou situation de danger au responsable hiérarchique.</li>
      <li>Maintenir la confidentialité sur les informations relatives aux clients, sites et activités de l'entreprise.</li>
      <li>Restituer à la fin du contrat l'ensemble du matériel et des équipements mis à disposition.</li>
      <li>Informer sans délai l'employeur de toute modification de sa situation administrative ou de ses habilitations.</li>
    </ul>
  </div>

  <div class="section">
    <div class="article-number">Article 9</div>
    <div class="section-title">Rupture anticipée</div>
    <p class="legal-text">Le présent contrat ne peut être rompu avant son terme que dans les cas limitatifs prévus par l'article L1243-1 du Code du travail : accord amiable écrit, faute grave, force majeure, inaptitude constatée par le médecin du travail, ou embauche en CDI.</p>
    <div class="highlight-box warning" style="margin-top:8px"><strong>⚠ Important :</strong> Toute rupture anticipée en dehors de ces cas ouvre droit pour la partie lésée à des dommages-intérêts correspondant au moins au montant des salaires restant dûs jusqu'au terme.</div>
  </div>

  <div class="section">
    <div class="article-number">Article 10</div>
    <div class="section-title">Protection des données personnelles</div>
    <p class="legal-text">L'Employeur collecte et traite les données personnelles du (de la) Salarié(e) conformément au RGPD et à la loi Informatique et Libertés, aux fins de gestion du contrat de travail. Le (la) Salarié(e) dispose de droits d'accès, de rectification et d'opposition auprès du responsable RH.</p>
  </div>

  ${
    contract?.custom_clauses
      ? `<div class="section">
    <div class="article-number">Article 11</div>
    <div class="section-title">Clauses particulières</div>
    <p class="legal-text">${contract.custom_clauses}</p>
  </div>`
      : ""
  }

  <div class="section">
    <div class="article-number">Article ${contract?.custom_clauses ? "12" : "11"}</div>
    <div class="section-title">Dispositions diverses</div>
    <p class="legal-text">Le présent contrat est régi par le Code du travail et par la convention collective nationale des entreprises de prévention et de sécurité (<strong>${collective}</strong>). Toute modification devra faire l'objet d'un avenant écrit signé par les deux parties. En cas de litige, les parties s'efforceront de trouver une solution amiable ; à défaut, le différend sera porté devant le Conseil de Prud'hommes compétent.</p>
    <p class="legal-text" style="margin-top:6px">Fait en deux exemplaires originaux, dont un remis à chaque partie. <strong>Le ${genDate}.</strong></p>
  </div>

  <div class="signatures-section">
    <div class="signatures-title">Signatures</div>
    <div class="signatures-grid">
      <div class="sig-block">
        <div class="sig-role">Pour l'Employeur</div>
        <div class="sig-name">${legalRepName}</div>
        <div class="sig-mention" style="margin-bottom:8px;">${legalRepRole}</div>
        <div class="sig-image-zone" style="position:relative;">
          ${company?.stamp_url ? `<img src="${company.stamp_url}" alt="Tampon" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); max-height:55px; max-width:90%; opacity:0.5; object-fit:contain; z-index:0;"/>` : ""}
          <div style="position:relative; z-index:1;">${sigCo}</div>
        </div>
        <div class="sig-date">${contract?.signed_at_company ? `Signé le ${fr(contract.signed_at_company)}` : "—"}</div>
        <div class="sig-mention">« Bon pour accord »</div>
      </div>
      <div class="sig-block">
        <div class="sig-role">L'Agent de Sécurité</div>
        <div class="sig-name">${dd?.firstname || ""} ${dd?.lastname || ""}</div>
        <div class="sig-image-zone">${sigCa}</div>
        <div class="sig-date">${contract?.signed_at_candidate ? `Signé le ${fr(contract.signed_at_candidate)}` : "—"}</div>
        <div class="sig-mention">« Lu et approuvé »</div>
      </div>
    </div>
  </div>

  <footer class="page-footer">
    <span>Généré le ${genDate} par WeSafe Recruitment</span>
  </footer>

</div></body></html>`;
};
