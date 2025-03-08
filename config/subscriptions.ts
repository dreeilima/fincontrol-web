import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Starter",
    description: "Para iniciantes",
    benefits: [
      "Até 100 posts mensais",
      "Análise e relatórios básicos",
      "Acesso a modelos padrão",
    ],
    limitations: [
      "Não tem prioridade para novas funcionalidades.",
      "Suporte ao cliente limitado",
      "Não tem custom branding",
      "Acesso limitado a recursos de negócios.",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Pro",
    description: "Unlock Advanced Features",
    benefits: [
      "Up to 500 monthly posts",
      "Advanced analytics and reporting",
      "Access to business templates",
      "Priority customer support",
      "Exclusive webinars and training.",
    ],
    limitations: [
      "No custom branding",
      "Limited access to business resources.",
    ],
    prices: {
      monthly: 15,
      yearly: 144,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Business",
    description: "For Power Users",
    benefits: [
      "Unlimited posts",
      "Real-time analytics and reporting",
      "Access to all templates, including custom branding",
      "24/7 business customer support",
      "Personalized onboarding and account management.",
    ],
    limitations: [],
    prices: {
      monthly: 30,
      yearly: 300,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },
];

export const plansColumns = [
  "starter",
  "pro",
  "business",
  "enterprise",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Access to Analytics",
    starter: true,
    pro: true,
    business: true,
    enterprise: "Custom",
    tooltip: "All plans include basic analytics for tracking performance.",
  },
  {
    feature: "Custom Branding",
    starter: null,
    pro: "500/mo",
    business: "1,500/mo",
    enterprise: "Unlimited",
    tooltip: "Custom branding is available from the Pro plan onwards.",
  },
  {
    feature: "Priority Support",
    starter: null,
    pro: "Email",
    business: "Email & Chat",
    enterprise: "24/7 Support",
  },
  {
    feature: "Advanced Reporting",
    starter: null,
    pro: null,
    business: true,
    enterprise: "Custom",
    tooltip:
      "Advanced reporting is available in Business and Enterprise plans.",
  },
  {
    feature: "Dedicated Manager",
    starter: null,
    pro: null,
    business: null,
    enterprise: true,
    tooltip: "Enterprise plan includes a dedicated account manager.",
  },
  {
    feature: "API Access",
    starter: "Limited",
    pro: "Standard",
    business: "Enhanced",
    enterprise: "Full",
  },
  {
    feature: "Monthly Webinars",
    starter: false,
    pro: true,
    business: true,
    enterprise: "Custom",
    tooltip: "Pro and higher plans include access to monthly webinars.",
  },
  {
    feature: "Custom Integrations",
    starter: false,
    pro: false,
    business: "Available",
    enterprise: "Available",
    tooltip:
      "Custom integrations are available in Business and Enterprise plans.",
  },
  {
    feature: "Roles and Permissions",
    starter: null,
    pro: "Basic",
    business: "Advanced",
    enterprise: "Advanced",
    tooltip:
      "User roles and permissions management improves with higher plans.",
  },
  {
    feature: "Onboarding Assistance",
    starter: false,
    pro: "Self-service",
    business: "Assisted",
    enterprise: "Full Service",
    tooltip: "Higher plans include more comprehensive onboarding assistance.",
  },
  // Add more rows as needed
];

export const PLANS = {
  BASIC: {
    name: "Basic",
    description: "Comece seu controle financeiro",
    price: 9.9,
    priceId: "price_1R06P8R9fFzxPkKldIyMcLC2",
    features: [
      "Até 50 transações por mês",
      "Categorias básicas",
      "Relatórios mensais",
      "1 conta bancária",
    ],
  },
  PRO: {
    name: "Pro",
    description: "Para quem quer mais controle e recursos",
    price: 19.9,
    priceId: "price_1R06Q3R9fFzxPkKlHN5yFNd6",
    features: [
      "Transações ilimitadas",
      "Categorias personalizadas",
      "Relatórios avançados",
      "Até 5 contas bancárias",
      "Metas financeiras",
      "Exportação de dados",
    ],
  },
  PREMIUM: {
    name: "Premium",
    description: "Experiência completa de gestão financeira",
    price: 39.9,
    priceId: "price_1R06RrR9fFzxPkKlvtrHmggX",
    features: [
      "Tudo do plano Pro",
      "Contas bancárias ilimitadas",
      "Planejamento financeiro avançado",
      "Análises detalhadas",
      "Suporte prioritário",
      "Backup automático",
    ],
  },
};
