import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Inicialización de Stripe usando la versión por defecto del SDK
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Firma vacía" }, { status: 400 });
  }

  let event: Stripe.Event;

  // 1. Validar Firma Criptográfica
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: any) {
    console.error(`❌ Webhook Signature Error: ${err.message}`);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  // 2. Control de Idempotencia (Evitar doble procesamiento)
  const { data: existingEvent } = await supabaseAdmin
    .from("processed_stripe_events")
    .select("id")
    .eq("id", event.id)
    .single();

  if (existingEvent) {
    return NextResponse.json(
      { message: "Evento ya procesado previamente" },
      { status: 200 },
    );
  }

  // 3. Procesamiento de Eventos Financieros
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const cartItemsRaw = session.metadata?.cartItems;

    if (userId && cartItemsRaw) {
      const items = JSON.parse(cartItemsRaw);

      // Transacción: Crear orden y descontar inventario con Service Role aislada
      const { data: order, error: orderErr } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: userId,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          status: "PAID",
          total_cents: session.amount_total || 0,
          currency: session.currency || "usd",
        })
        .select()
        .single();

      if (!orderErr && order) {
        for (const item of items) {
          // Decrementar Stock
          try {
            await supabaseAdmin.rpc("decrement_stock", {
              variant_id_param: item.variantId,
              quantity_param: item.quantity,
            });
          } catch (error) {
            console.error("Error al descontar inventario:", error);
          }
        }

        // Vaciar Carrito
        await supabaseAdmin.from("cart_items").delete().eq("user_id", userId);
      }
    }
  }

  // 4. Registrar Evento como Procesado
  await supabaseAdmin.from("processed_stripe_events").insert({
    id: event.id,
    type: event.type,
  });

  return NextResponse.json({ received: true });
}
