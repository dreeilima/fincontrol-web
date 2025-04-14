import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getCurrentUser();

  // Se já estiver autenticado, redireciona baseado na role
  if (user) {
    if (user.role === "admin") {
      redirect("/admin");
    }
    redirect("/dashboard");
  }

  return <div className="min-h-screen">{children}</div>;
}
