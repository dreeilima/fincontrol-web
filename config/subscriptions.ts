import { PlansRow, SubscriptionPlan } from "@/types";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Básico",
    description: "Ideal para começar seu controle financeiro",
    price: {
      monthly: 9.9,
      yearly: 99.0, // ~15% desconto
    },
    features: [
      "Registro de gastos ilimitados",
      "1 conta bancária",
      "Relatórios básicos",
      "Categorização manual",
      "Suporte via WhatsApp",
    ],
    benefits: [
      "Registro de gastos ilimitados",
      "1 conta bancária",
      "Relatórios básicos",
      "Categorização manual",
      "Suporte via WhatsApp",
    ],
    limitations: [],
    priceId: {
      test: {
        monthly: "price_1R06P8R9fFzxPkKldIyMcLC2",
        yearly: "price_1R06P8R9fFzxPkKldIyMcLC2",
      },
      production: {
        monthly: "price_1R06P8R9fFzxPkKldIyMcLC2",
        yearly: "price_1R06P8R9fFzxPkKldIyMcLC2",
      },
    },
  },
  {
    title: "Pro",
    description: "Para quem quer mais controle e recursos",
    price: {
      monthly: 19.9,
      yearly: 199.0, // ~15% desconto
    },
    features: [
      "Todas as features do plano Básico",
      "Até 3 contas bancárias",
      "Relatórios avançados",
      "Metas financeiras",
      "Categorização automática",
      "Exportação de dados",
      "Suporte prioritário",
    ],
    benefits: [
      "Todas as features do plano Básico",
      "Até 3 contas bancárias",
      "Relatórios avançados",
      "Metas financeiras",
      "Categorização automática",
      "Exportação de dados",
      "Suporte prioritário",
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
  {
    title: "Premium",
    description: "Solução completa para gestão financeira",
    price: {
      monthly: 39.9,
      yearly: 399.0, // ~15% desconto
    },
    features: [
      "Todas as features do plano Pro",
      "Contas bancárias ilimitadas",
      "Relatórios personalizados",
      "API de integração",
      "Gestão multiusuário",
      "Backup automático",
      "Suporte VIP 24/7",
    ],
    benefits: [
      "Todas as features do plano Pro",
      "Contas bancárias ilimitadas",
      "Relatórios personalizados",
      "API de integração",
      "Gestão multiusuário",
      "Backup automático",
      "Suporte VIP 24/7",
    ],
    limitations: [],
    priceId: {
      test: {
        monthly: "price_1R06RrR9fFzxPkKlvtrHmggX",
        yearly: "price_1R06RrR9fFzxPkKlvtrHmggX",
      },
      production: {
        monthly: "price_1R06RrR9fFzxPkKlvtrHmggX",
        yearly: "price_1R06RrR9fFzxPkKlvtrHmggX",
      },
    },
  },
];

export const plansColumns = ["básico", "pro", "premium"] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Registro de Transações",
    basico: "Ilimitado",
    pro: "Ilimitado",
    premium: "Ilimitado",
    tooltip: "Registre todas suas receitas e despesas sem limitações.",
  },
  {
    feature: "Contas Bancárias",
    basico: "1 conta",
    pro: "Até 3 contas",
    premium: "Ilimitadas",
    tooltip: "Número de contas bancárias que você pode gerenciar.",
  },
  {
    feature: "Categorização",
    basico: "Manual",
    pro: "Automática",
    premium: "Automática + IA",
    tooltip: "Como suas transações são organizadas por categoria.",
  },
  {
    feature: "Relatórios",
    basico: "Básicos",
    pro: "Avançados",
    premium: "Personalizados",
    tooltip: "Tipos de relatórios disponíveis para análise financeira.",
  },
  {
    feature: "Metas Financeiras",
    basico: null,
    pro: "Básicas",
    premium: "Avançadas",
    tooltip: "Defina e acompanhe suas metas financeiras.",
  },
  {
    feature: "Suporte",
    basico: "WhatsApp",
    pro: "Prioritário",
    premium: "VIP 24/7",
    tooltip: "Canais de suporte disponíveis para ajuda.",
  },
  {
    feature: "Exportação de Dados",
    basico: "CSV",
    pro: "CSV/Excel",
    premium: "Todos os formatos",
    tooltip: "Formatos disponíveis para exportação dos seus dados.",
  },
  {
    feature: "Gestão Multiusuário",
    basico: null,
    pro: null,
    premium: "Disponível",
    tooltip: "Compartilhe o acesso com outros usuários.",
  },
  {
    feature: "Backup",
    basico: "Manual",
    pro: "Automático",
    premium: "Automático + Cloud",
    tooltip: "Como seus dados são protegidos e armazenados.",
  },
  {
    feature: "Integração WhatsApp",
    basico: "Básica",
    pro: "Avançada",
    premium: "Personalizada",
    tooltip: "Recursos disponíveis via WhatsApp.",
  },
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
