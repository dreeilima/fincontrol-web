export const STRIPE_PLANS = {
  básico: process.env.NEXT_PUBLIC_STRIPE_BASIC_PLAN_PRICE_ID,
  profissional: process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_PRICE_ID,
  empresarial: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PRICE_ID,
} as const;
