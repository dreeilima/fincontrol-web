import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Mantendo apenas as essenciais como obrigatórias
    AUTH_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),

    // Tornando opcionais
    GOOGLE_CLIENT_ID: z.string().optional().default(""),
    GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
    GITHUB_OAUTH_TOKEN: z.string().optional().default(""),
    STRIPE_API_KEY: z.string().optional().default(""),
    STRIPE_WEBHOOK_SECRET: z.string().optional().default(""),
    EMAIL_FROM: z.string().optional().default("noreply@example.com"),
    EMAIL_SERVER_HOST: z.string().optional().default("smtp.gmail.com"),
    EMAIL_SERVER_PORT: z.string().optional().default("587"),
    EMAIL_SERVER_USER: z.string().optional().default(""),
    EMAIL_SERVER_PASSWORD: z.string().optional().default(""),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL_DEV: z.string().url().optional(),

    // Tornando planos do Stripe opcionais
    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: z.string().optional().default(""),
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: z.string().optional().default(""),
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID: z
      .string()
      .optional()
      .default(""),
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID: z
      .string()
      .optional()
      .default(""),
  },
  runtimeEnv: {
    // Mapeamento das variáveis
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_OAUTH_TOKEN: process.env.GITHUB_OAUTH_TOKEN,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_URL_DEV: process.env.NEXT_PUBLIC_APP_URL_DEV,
    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID:
      process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID:
      process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
