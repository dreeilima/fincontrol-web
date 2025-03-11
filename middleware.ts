import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth({
  ...authConfig,
  secret: process.env.NEXTAUTH_SECRET,
});

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isCheckoutApiRoute = nextUrl.pathname.startsWith(
    "/api/create-checkout-session",
  );
  const isPublicRoute = ["/", "/login", "/register"].includes(nextUrl.pathname);
  const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard");

  // Permitir rotas de API de checkout
  if (isCheckoutApiRoute) {
    return NextResponse.next();
  }

  // Redirecionar usuários não autenticados para login
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  // Redirecionar usuários autenticados do login para dashboard
  if (isPublicRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkout/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
