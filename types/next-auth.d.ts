import { User } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    phone: string;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    stripe_price_id: string | null;
    stripe_current_period_end: Date | null;
    image: string | null;
    token: string;
  }

  interface Session {
    user: User;
  }
}
