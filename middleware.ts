import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Get token with expanded options
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "fincontrol-secret-key",
    salt: process.env.NEXTAUTH_SALT || "fincontrol-salt",
    secureCookie: process.env.NODE_ENV === "production",
  });

  const sessionCookie = request.cookies.get("authjs.session-token");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  const isOnboardingRoute = request.nextUrl.pathname.startsWith("/onboarding");

  // Allow onboarding route to pass through if session cookie exists
  if (isOnboardingRoute && sessionCookie) {
    return NextResponse.next();
  }

  // If no token but has session cookie, try to proceed
  if (!token && sessionCookie && !isAuthRoute) {
    return NextResponse.next();
  }

  // If no token and no session cookie, redirect to login
  if (!token && !sessionCookie && !isAuthRoute) {
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
