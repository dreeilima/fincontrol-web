import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import { authSchema } from "@/lib/validations/auth";

import { db } from "./db.config";

type UserRole = "admin" | "user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role: UserRole;
      phone: string | null;
      stripe_customer_id: string | null;
      stripe_subscription_id: string | null;
      stripe_price_id: string | null;
      stripe_current_period_end: Date | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultSession {
    id: string;
    role: UserRole;
    phone: string | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    stripe_price_id: string | null;
    stripe_current_period_end: Date | null;
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
          image: null,
        } as unknown as import("next-auth").User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          phone: user.phone,
          stripe_customer_id: user.stripe_customer_id,
          stripe_subscription_id: user.stripe_subscription_id,
          stripe_price_id: user.stripe_price_id,
          stripe_current_period_end: user.stripe_current_period_end,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          phone: token.phone,
          stripe_customer_id: token.stripe_customer_id,
          stripe_subscription_id: token.stripe_subscription_id,
          stripe_price_id: token.stripe_price_id,
          stripe_current_period_end: token.stripe_current_period_end,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
} as NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config as any);

export const getServerSession = async () => {
  const session = await auth();
  return session;
};
