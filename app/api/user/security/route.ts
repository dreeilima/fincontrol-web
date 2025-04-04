import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const securitySchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z
    .string()
    .min(8, "A nova senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedFields = securitySchema.safeParse(body);

    if (!validatedFields.success) {
      return new NextResponse("Dados inválidos", { status: 400 });
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user) {
      return new NextResponse("Usuário não encontrado", { status: 404 });
    }

    const isPasswordValid = await bcryptjs.compare(
      validatedFields.data.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Senha atual incorreta" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcryptjs.hash(
      validatedFields.data.newPassword,
      10,
    );

    await db.users.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Senha atualizada com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[SECURITY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
