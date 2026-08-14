import { NextResponse } from "next/server";

import { getAppUrl } from "@/lib/stripe/app-url";
import { stripe } from "@/lib/stripe/stripe";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

const CREDITS_PER_PACK = 10;

export async function POST(req: Request) {
  try {
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

    // Un customer_id stocké avant un changement de clé Stripe (test → live) n'existe plus
    // dans le mode courant : on vérifie qu'il est toujours valide avant de le réutiliser.
    if (customerId) {
      try {
        await stripe.customers.retrieve(customerId);
      } catch {
        customerId = null;
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        name: company.name ?? undefined,
        email: company.email ?? undefined,
        metadata: { company_id: companyId },
      });
      customerId = customer.id;
      await supabaseAdmin.from("companies").update({ stripe_customer_id: customerId }).eq("id", companyId);
    }

    const appUrl = getAppUrl(req);

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
  } catch (err) {
    console.error("[buy-credits] Erreur:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur lors de la création de la session de paiement." },
      { status: 500 },
    );
  }
}
