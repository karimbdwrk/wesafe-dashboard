import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe/stripe";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function POST(req: Request) {
  const { companyId } = await req.json();

  if (!companyId) {
    return NextResponse.json({ error: "companyId manquant." }, { status: 400 });
  }

  const { data: company, error } = await supabaseAdmin
    .from("companies")
    .select("stripe_customer_id")
    .eq("id", companyId)
    .single();

  if (error || !company?.stripe_customer_id) {
    return NextResponse.json({ error: "Aucun abonnement Stripe trouvé." }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: company.stripe_customer_id,
    return_url: `${appUrl}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
