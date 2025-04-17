import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";

import { db } from "@/lib/db";

import { authConfig } from "./auth.config";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET must be set");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Força atualização a cada 24 horas
  },
  providers: authConfig.providers,
  pages: authConfig.pages,
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
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
      }

      // Verificação e atualização dos dados da sessão
      if (token.id) {
        try {
          const dbUser = await db.users.findUnique({
            where: { id: token.id as string },
            select: { name: true, email: true, role: true },
          });

          if (
            dbUser &&
            (dbUser.name !== token.name || dbUser.email !== token.email)
          ) {
            session.user.name = dbUser.name;
            session.user.email = dbUser.email;
            session.user.role = dbUser.role === "ADMIN" ? "admin" : "user";
          }
        } catch (error) {
          console.error(
            "Erro ao verificar dados atualizados do usuário:",
            error,
          );
        }
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.phone = user.phone;
        token.stripe_customer_id = user.stripe_customer_id;
        token.stripe_subscription_id = user.stripe_subscription_id;
        token.stripe_price_id = user.stripe_price_id;
        token.stripe_current_period_end = user.stripe_current_period_end;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
export const auth = (options?: any) => getAuth(options ?? {});

// Função para obter a sessão atual
export async function getAuth(options: any = {}) {
  const session = await getServerSession(authOptions);
  return session;
}
