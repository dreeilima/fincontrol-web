interface SubscriptionPlan {
  title: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  benefits: string[];
  limitations: string[];
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

interface BillingFormProps {
  subscriptionPlan: {
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripePriceId: string | null;
    stripeCurrentPeriodEnd: Date | null;
  };
}
