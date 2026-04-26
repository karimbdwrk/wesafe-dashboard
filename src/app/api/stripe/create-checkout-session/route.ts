import { NextResponse } from "next/server";

import type { PlanKey } from "@/lib/stripe/stripe";
import { PLANS, stripe } from "@/lib/stripe/stripe";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function POST(req: Request) {
  const { companyId, planKey } = await req.json();

  if (!companyId || !planKey || !(planKey in PLANS)) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  const plan = PLANS[planKey as PlanKey];
  if (!plan.priceId) {
    return NextResponse.json({ error: "Price ID non configuré pour ce plan." }, { status: 500 });
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
    mode: "subscription",
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing?success=true&plan=${planKey}`,
    cancel_url: `${appUrl}/dashboard/billing?cancelled=true`,
    metadata: { company_id: companyId, plan_key: planKey },
    subscription_data: {
      metadata: { company_id: companyId, plan_key: planKey },
    },
  });

  return NextResponse.json({ url: session.url });
}
