import { User } from "@prisma/client";

import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    stripe_price_id: string | null;
    stripe_current_period_end: Date | null;
    role: "user" | "admin";
  }

  interface Session {
    user: User;
    users: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}
