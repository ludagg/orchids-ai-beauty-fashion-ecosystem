import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  // Warn during build/runtime if key is missing, but don't crash unless used
  console.warn("STRIPE_SECRET_KEY is missing. Stripe functionality will be disabled.");
}

export const stripe = new Stripe(stripeKey || 'dummy_key_for_build', {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
});
