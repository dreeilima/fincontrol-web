export interface SubscriptionPlan {
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  limitations: string[];
  price: {
    monthly: number;
    yearly: number;
  };
  priceId: {
    test: {
      monthly: string;
      yearly: string;
    };
    production: {
      monthly: string;
      yearly: string;
    };
  };
}

export interface UserSubscriptionPlan extends SubscriptionPlan {
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  stripeCurrentPeriodEnd?: string | null;
}

export interface PlansRow {
  feature: string;
  básico: string | null;
  pro: string | null;
  premium: string | null;
  tooltip?: string;
}
