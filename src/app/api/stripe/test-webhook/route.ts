import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe/stripe";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

// Route de test UNIQUEMENT en développement.
// Appeler avec : POST /api/stripe/test-webhook { "sessionId": "cs_test_..." }
// Reproduit exactement la logique du webhook pour diagnostiquer les erreurs Supabase.
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Non disponible en production." }, { status: 403 });
  }

  const { sessionId } = await req.json();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId manquant." }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const companyId = session.metadata?.company_id;
  const paymentType = session.metadata?.type;
  const creditsToAdd = Number(session.metadata?.credits_amount ?? 0);

  console.log("[test-webhook] session:", session.id);
  console.log("[test-webhook] companyId:", companyId, "| paymentType:", paymentType, "| creditsToAdd:", creditsToAdd);

  if (!companyId) return NextResponse.json({ error: "company_id absent des metadata." }, { status: 400 });
  if (paymentType !== "lastminute_credits")
    return NextResponse.json({ error: `type inattendu: ${paymentType}` }, { status: 400 });
  if (creditsToAdd <= 0) return NextResponse.json({ error: "credits_amount invalide." }, { status: 400 });

  // 1. Fetch company
  const { data: company, error: companyError } = await supabaseAdmin
    .from("companies")
    .select("last_minute_credits")
    .eq("id", companyId)
    .single();

  if (companyError) {
    console.error("[test-webhook] company fetch error:", companyError);
    return NextResponse.json({ step: "company_fetch", error: companyError }, { status: 500 });
  }

  const current = company?.last_minute_credits ?? 0;
  console.log("[test-webhook] current credits:", current);

  // 2. Update credits
  const { error: updateError } = await supabaseAdmin
    .from("companies")
    .update({ last_minute_credits: current + creditsToAdd })
    .eq("id", companyId);

  if (updateError) {
    console.error("[test-webhook] update error:", updateError);
    return NextResponse.json({ step: "company_update", error: updateError }, { status: 500 });
  }

  console.log("[test-webhook] credits updated:", current, "→", current + creditsToAdd);

  // 3. Insert transaction
  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;
  const { error: txError } = await supabaseAdmin.from("transactions").insert({
    company_id: companyId,
    amount: (session.amount_total ?? 0) / 100,
    currency: "EUR",
    transaction_type: "credit_purchase",
    credits_added: creditsToAdd,
    credits_deducted: 0,
    description: `Achat pack ${creditsToAdd} crédits Last Minute${paymentIntentId ? ` (Stripe PI ID: ${paymentIntentId})` : ""}`,
    event_type: "payment_intent.succeeded",
    stripe_customer_id: session.customer as string | null,
  });

  if (txError) {
    console.error("[test-webhook] transaction insert error:", txError);
    return NextResponse.json({ step: "transaction_insert", error: txError }, { status: 500 });
  }

  console.log("[test-webhook] transaction inserted OK");
  return NextResponse.json({ ok: true, creditsAdded: creditsToAdd, newTotal: current + creditsToAdd });
}
