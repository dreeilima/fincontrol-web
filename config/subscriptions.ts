import { PlansRow, SubscriptionPlan } from "@/types";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Básico",
    description: "Perfeito para começar a organizar suas finanças",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      "Sistema web com gráficos interativos e gestão financeira",
      "Controle de gastos via WhatsApp por texto, áudio e imagem",
      "Até 10 transações por mês via WhatsApp",
      "Categorização automática",
      "Relatórios com gráficos mensais",
    ],
    benefits: [
      "Sistema web com gráficos interativos e gestão financeira",
      "Controle de gastos via WhatsApp por texto, áudio e imagem",
      "Até 10 transações por mês via WhatsApp",
      "Categorização automática",
      "Relatórios com gráficos mensais",
    ],
    limitations: [],
    priceId: {
      test: {
        monthly: "", // plano gratuito não tem priceId
        yearly: "",
      },
      production: {
        monthly: "",
        yearly: "",
      },
    },
  },
  {
    title: "Premium",
    description: "Controle total das suas finanças com recursos exclusivos",
    price: {
      monthly: 19.9,
      yearly: 199.0, // Mantido para compatibilidade, mas não será usado
    },
    features: [
      "Todos os recursos do plano Básico",
      "Transações ILIMITADAS de gastos via WhatsApp",
      "Criação de categorias personalizadas para melhor organização",
      "Relatórios financeiros avançados e detalhados",
      "Exportação de dados em múltiplos formatos",
      "Suporte prioritário via WhatsApp",
    ],
    benefits: [
      "Todos os recursos do plano Básico",
      "Transações ILIMITADAS de gastos via WhatsApp",
      "Criação de categorias personalizadas para melhor organização",
      "Relatórios financeiros avançados e detalhados",
      "Exportação de dados em múltiplos formatos",
      "Suporte prioritário via WhatsApp",
    ],
    limitations: [],
    priceId: {
      test: {
        monthly: "price_1R06Q3R9fFzxPkKlHN5yFNd6",
        yearly: "price_1R06Q3R9fFzxPkKlHN5yFNd6",
      },
      production: {
        monthly: "price_1R06Q3R9fFzxPkKlHN5yFNd6",
        yearly: "price_1R06Q3R9fFzxPkKlHN5yFNd6",
      },
    },
  },
];

export const plansColumns = ["basico", "premium"] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Sistema web interativo",
    basico: "Incluído",
    premium: "Incluído",
    tooltip:
      "Acesso ao sistema web com gráficos interativos e gestão financeira",
  },
  {
    feature: "Controle via WhatsApp",
    basico: "Até 10 por mês",
    premium: "ILIMITADO",
    tooltip: "Envio de transações via WhatsApp por texto, áudio e imagem",
  },
  {
    feature: "Categorização",
    basico: "Automática básica",
    premium: "Personalizada",
    tooltip: "Como suas transações são organizadas por categoria",
  },
  {
    feature: "Relatórios",
    basico: "Mensais básicos",
    premium: "Avançados e detalhados",
    tooltip: "Tipos de relatórios disponíveis para análise financeira",
  },
  {
    feature: "Exportação de Dados",
    basico: "CSV básico",
    premium: "CSV/Excel/PDF",
    tooltip: "Formatos disponíveis para exportação dos seus dados",
  },
  {
    feature: "Suporte",
    basico: "Email",
    premium: "Prioritário via WhatsApp",
    tooltip: "Canais de suporte disponíveis para atendimento",
  },
];

export const PLANS = {
  BASIC: {
    name: "Básico",
    description: "Perfeito para começar a organizar suas finanças",
    price: 0,
    priceId: "",
    features: [
      "Sistema web com gráficos interativos e gestão financeira",
      "Controle de gastos via WhatsApp por texto, áudio e imagem",
      "Até 10 transações por mês via WhatsApp",
      "Categorização automática",
      "Relatórios com gráficos mensais",
    ],
  },
  PREMIUM: {
    name: "Premium",
    description: "Controle total das suas finanças com recursos exclusivos",
    price: 19.9,
    priceId: "price_1R06Q3R9fFzxPkKlHN5yFNd6",
    features: [
      "Todos os recursos do plano Básico",
      "Transações ILIMITADAS de gastos via WhatsApp",
      "Criação de categorias personalizadas para melhor organização",
      "Relatórios financeiros avançados e detalhados",
      "Exportação de dados em múltiplos formatos",
      "Suporte prioritário via WhatsApp",
    ],
  },
};
