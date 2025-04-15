import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Verificar se o usuário está autenticado e é admin
  if (!session?.user || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}

export default AdminLayout;
