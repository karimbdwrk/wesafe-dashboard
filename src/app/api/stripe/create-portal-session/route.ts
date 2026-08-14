import { NextResponse } from "next/server";

import { getAppUrl } from "@/lib/stripe/app-url";
import { stripe } from "@/lib/stripe/stripe";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function POST(req: Request) {
  try {
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

    // Un customer_id stocké avant un changement de clé Stripe (test → live) n'existe plus
    // dans le mode courant. Pas de client valide à gérer : on renvoie une erreur explicite
    // plutôt que de laisser Stripe planter la requête.
    try {
      await stripe.customers.retrieve(company.stripe_customer_id);
    } catch {
      return NextResponse.json({ error: "Compte de facturation introuvable. Contactez le support." }, { status: 404 });
    }

    const appUrl = getAppUrl(req);

    const session = await stripe.billingPortal.sessions.create({
      customer: company.stripe_customer_id,
      return_url: `${appUrl}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[create-portal-session] Erreur:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur lors de la création de la session de facturation." },
      { status: 500 },
    );
  }
}
