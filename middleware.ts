import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Usar exatamente o mesmo segredo que está no auth.ts
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,

    // Remover o salt personalizado para usar o padrão do NextAuth
  });

  console.log("Middleware - URL:", request.nextUrl.pathname);
  console.log("Middleware - Token exists:", !!token);
  console.log("Middleware - Token data:", token);

  // Check if session cookie exists even if token is null
  const sessionCookie = request.cookies.get("authjs.session-token");
  console.log("Session cookie exists:", !!sessionCookie);

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  // If no token and not auth route, redirect to login
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If auth route and has token
  if (isAuthRoute && token) {
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If admin route and not admin
  if (isAdminRoute && token && token.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/(protected)/:path*",
    "/login",
    "/register",
  ],
};
