import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { authSchema } from "@/lib/validations/auth";

import { db } from "./db.config";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "admin" | "user";
      phone: string | null;
      stripe_customer_id: string | null;
      stripe_subscription_id: string | null;
      stripe_price_id: string | null;
      stripe_current_period_end: Date | null;
    };
  }
}

export const config = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const { email, password } = authSchema.parse(credentials);
        const user = await db.users.findUnique({ where: { email } });
        if (!user || !(await compare(password, user.password))) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role === "ADMIN" ? "admin" : "user",
          phone: user.phone,
          stripe_customer_id: user.stripe_customer_id,
          stripe_subscription_id: user.stripe_subscription_id,
          stripe_price_id: user.stripe_price_id,
          stripe_current_period_end: user.stripe_current_period_end,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.stripe_customer_id = user.stripe_customer_id;
        token.stripe_subscription_id = user.stripe_subscription_id;
        token.stripe_price_id = user.stripe_price_id;
        token.stripe_current_period_end = user.stripe_current_period_end;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "user";
        session.user.phone = token.phone as string | null;
        session.user.stripe_customer_id = token.stripe_customer_id as
          | string
          | null;
        session.user.stripe_subscription_id = token.stripe_subscription_id as
          | string
          | null;
        session.user.stripe_price_id = token.stripe_price_id as string | null;
        session.user.stripe_current_period_end =
          token.stripe_current_period_end as Date | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(db) as any,
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config);

export const getServerSession = async () => {
  const session = await auth();
  return session;
};
