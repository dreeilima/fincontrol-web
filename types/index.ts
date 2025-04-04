import { UserRole } from "@prisma/client";
import { User as NextAuthUser } from "next-auth";

import { Icons } from "@/components/shared/icons";

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
  stripeCurrentPeriodEnd?: string | number | null;
  isPaid?: boolean | null;
  isCanceled?: boolean | null;
}

export interface PlansRow {
  feature: string;
  basico: string | null;
  pro: string | null;
  premium: string | null;
  tooltip?: string;
}

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: string;
  label?: string;
  badge?: string;
  authorizeOnly?: UserRole;
}

export interface SidebarNavItem {
  title: string;
  items: NavItem[];
}

export interface InfoLdg {
  title: string;
  description: string;
  image: string;
  list: {
    title: string;
    description: string;
    icon?: keyof typeof Icons;
  }[];
}

export interface FeatureLdg {
  title: string;
  description: string;
  link: string;
  icon: keyof typeof Icons;
}

export type UserWithoutToken = Omit<NextAuthUser, "token">;

export interface MarketingConfig {
  mainNav: NavItem[];
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
  mailSupport: string;
}
