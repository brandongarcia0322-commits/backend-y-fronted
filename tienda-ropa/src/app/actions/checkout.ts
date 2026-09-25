'use server';

import 'server-only';
import Stripe from 'stripe';
import { env } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { CreateCheckoutSchema } from '@/schemas';

// Inicialización de Stripe utilizando la versión predeterminada del SDK
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(input: unknown) {
  // 1. Validar autenticación
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('No autorizado');
  }

  // 2. Validar input con Zod
  const parsed = CreateCheckoutSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error('Datos de entrada inválidos');
  }

  const { items } = parsed.data;

  // 3. CONSULTAR PRECIOS DIRECTAMENTE EN LA BASE DE DATOS (NO CONFIAR EN EL CLIENTE)
  const variantIds = items.map((i) => i.variantId);
  const { data: variants, error: dbError } = await supabase
    .from('product_variants')
    .select('id, price_cents, stock, products(name)')
    .in('id', variantIds);

  if (dbError || !variants || variants.length !== items.length) {
    throw new Error('Uno o más productos no existen');
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of items) {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant) throw new Error('Variante no encontrada');

    // Obtener el nombre del producto manejando la relación retornada por Supabase
    const productData = Array.isArray(variant.products) 
      ? variant.products[0] 
      : variant.products;
    const productName = productData?.name || 'Producto';

    // Validar Stock en servidor
    if (variant.stock < item.quantity) {
      throw new Error(`Stock insuficiente para el producto ${productName}`);
    }

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: productName,
        },
        unit_amount: variant.price_cents,
      },
      quantity: item.quantity,
    });
  }

  // 4. Crear sesión de pago en Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/cart`,
    customer_email: user.email,
    metadata: {
      userId: user.id,
    },
  });

  return { url: session.url };
}