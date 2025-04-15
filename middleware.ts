import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Verificar se o usuário está autenticado usando cookies
  const sessionCookie =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  // Obter o caminho da URL
  const { pathname } = request.nextUrl;

  // Verificar se o usuário está autenticado para rotas protegidas
  if (!sessionCookie?.value) {
    const isProtectedRoute =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/settings") ||
      pathname.startsWith("/admin");

    if (isProtectedRoute) {
      // Adicionar parâmetro de query para indicar de onde veio o redirecionamento
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Verificação de admin desativada no middleware - será feita no nível da página
  // A verificação no middleware não funcionará corretamente porque o conteúdo do token
  // precisaria ser decodificado com JWT, o que não é recomendado no Edge Runtime

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/admin/:path*"],
};
