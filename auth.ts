import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { db } from "@/lib/db";

import { authConfig } from "./auth.config";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET must be set");
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Força atualização a cada 24 horas
  },
  // Mesclar os callbacks definidos no authConfig com os novos
  ...authConfig,
  callbacks: {
    // Preservar outros callbacks do authConfig
    ...(authConfig.callbacks || {}),
    // Sobrescrever ou adicionar os callbacks específicos
    async session({ session, token }) {
      // Se a sessão tiver um usuário, garante que estamos usando os dados mais atualizados
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

      // Se temos um ID, vamos verificar se os dados no banco estão atualizados
      if (token.id) {
        try {
          // Verifica se os dados da sessão estão atualizados com o banco
          const dbUser = await db.users.findUnique({
            where: { id: token.id as string },
            select: {
              name: true,
              email: true,
              role: true,
            },
          });

          // Se encontrou o usuário e os dados são diferentes, atualiza o token
          if (
            dbUser &&
            (dbUser.name !== token.name || dbUser.email !== token.email)
          ) {
            console.log(
              "Dados da sessão desatualizados, atualizando com DB:",
              dbUser,
            );
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
    async jwt({ token, user, trigger, session }) {
      // Inicialização do token com dados do usuário quando faz login
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }

      // Se for um evento de update, atualiza o token com os novos dados
      if (trigger === "update" && session) {
        console.log("Atualizando token com novos dados:", session);
        // Atualiza apenas o que foi passado explicitamente na sessão
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
      }

      return token;
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// This line is redundant since these exports are already declared above
