import { compare } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { db } from "@/lib/db";

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await db.users.findUnique({ where: { email } });
        if (!user || !(await compare(password, user.password))) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role === "ADMIN" ? "admin" : "user",
          phone: user.phone,
          stripe_customer_id: user.stripe_customer_id ?? null,
          stripe_subscription_id: user.stripe_subscription_id ?? null,
          stripe_price_id: user.stripe_price_id ?? null,
          stripe_current_period_end: user.stripe_current_period_end ?? null,
          image: null,
          token: user.id, // Added token field to match User interface
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as "admin" | "user",
        phone: token.phone as string,
        stripe_customer_id: token.stripe_customer_id as string | null,
        stripe_subscription_id: token.stripe_subscription_id as string | null,
        stripe_price_id: token.stripe_price_id as string | null,
        stripe_current_period_end:
          token.stripe_current_period_end as Date | null,
      };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
