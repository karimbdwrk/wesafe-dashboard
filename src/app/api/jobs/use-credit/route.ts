import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function POST(req: Request) {
  const { companyId, jobTitle } = await req.json();

  if (!companyId) {
    return NextResponse.json({ error: "companyId manquant." }, { status: 400 });
  }

  const { data: company, error } = await supabaseAdmin
    .from("companies")
    .select("last_minute_credits")
    .eq("id", companyId)
    .single();

  if (error || !company) {
    return NextResponse.json({ error: "Entreprise introuvable." }, { status: 404 });
  }

  if ((company.last_minute_credits ?? 0) <= 0) {
    return NextResponse.json({ error: "Aucun crédit Last Minute disponible." }, { status: 400 });
  }

  const newCredits = company.last_minute_credits - 1;

  await supabaseAdmin.from("companies").update({ last_minute_credits: newCredits }).eq("id", companyId);

  await supabaseAdmin.from("transactions").insert({
    company_id: companyId,
    amount: 0,
    currency: "TOKEN",
    transaction_type: "credit_usage",
    credits_added: 0,
    credits_deducted: 1,
    description: `Déduction d'1 crédit Last Minute${jobTitle ? ` pour l'annonce "${jobTitle}"` : ""}`,
    event_type: "last_minute_credit_used",
  });

  return NextResponse.json({ ok: true, remaining: newCredits });
}
