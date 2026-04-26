import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe/stripe";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function POST(req: Request) {
  const { companyId, jobId } = await req.json();

  if (!companyId || !jobId) {
    return NextResponse.json({ error: "companyId et jobId sont requis." }, { status: 400 });
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
          unit_amount: 600,
          product_data: { name: "Offre Last Minute (one-shot)" },
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/dashboard/my-jobs?lastminute_success=true`,
    cancel_url: `${appUrl}/dashboard/my-jobs?cancelled=true`,
    metadata: {
      company_id: companyId,
      job_id: jobId,
      type: "lastminute_oneshot",
    },
  });

  return NextResponse.json({ url: session.url });
}
