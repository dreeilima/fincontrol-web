import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ exists: false }, { status: 401 });
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id },
    });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
