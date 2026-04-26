import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe/stripe";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

const CREDITS_PER_PACK = 10;

export async function POST(req: Request) {
  const { companyId } = await req.json();

  if (!companyId) {
    return NextResponse.json({ error: "companyId manquant." }, { status: 400 });
  }

  const priceId = process.env.STRIPE_PRICE_LASTMINUTE_PACK;
  if (!priceId) {
    return NextResponse.json({ error: "Prix Last Minute non configuré." }, { status: 500 });
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
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing?credits_success=true`,
    cancel_url: `${appUrl}/dashboard/billing?cancelled=true`,
    metadata: {
      company_id: companyId,
      type: "lastminute_credits",
      credits_amount: String(CREDITS_PER_PACK),
    },
  });

  return NextResponse.json({ url: session.url });
}
