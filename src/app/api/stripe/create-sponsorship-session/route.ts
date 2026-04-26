import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe/stripe";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

const SPONSORSHIP_PRICES: Record<string, { amount: number; label: string }> = {
  "1w": { amount: 999, label: "1 semaine" },
  "2w": { amount: 1799, label: "2 semaines" },
  "1m": { amount: 2999, label: "1 mois" },
};

export async function POST(req: Request) {
  const { companyId, jobId, duration } = await req.json();

  if (!companyId || !jobId || !duration) {
    return NextResponse.json({ error: "companyId, jobId et duration sont requis." }, { status: 400 });
  }

  const priceInfo = SPONSORSHIP_PRICES[duration];
  if (!priceInfo) {
    return NextResponse.json({ error: "Durée de sponsoring invalide." }, { status: 400 });
  }

  const { data: company, error } = await supabaseAdmin
    .from("companies")
    .select("id, name, email, stripe_customer_id")
    .eq("id", companyId)
    .single();

  if (error || !company) {
    return NextResponse.json({ error: "Entreprise introuvable." }, { status: 404 });
  }

  let customerId = company.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      name: company.name ?? undefined,
      email: company.email ?? undefined,
      metadata: { company_id: companyId },
    });
    customerId = customer.id;
    await supabaseAdmin.from("companies").update({ stripe_customer_id: customerId }).eq("id", companyId);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: priceInfo.amount,
          product_data: { name: `Sponsoring d'annonce — ${priceInfo.label}` },
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/dashboard/my-jobs?sponsorship_success=true`,
    cancel_url: `${appUrl}/dashboard/my-jobs?cancelled=true`,
    metadata: {
      company_id: companyId,
      job_id: jobId,
      type: "job_sponsorship",
      sponsorship_duration: duration,
    },
  });

  return NextResponse.json({ url: session.url });
}
