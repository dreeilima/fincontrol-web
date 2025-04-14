import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function AuthCheck() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return null;
}
