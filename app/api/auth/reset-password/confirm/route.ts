import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { db } from "@/lib/db";

const confirmResetSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = confirmResetSchema.parse(body);

    // Buscar usuário pelo token
    const user = await db.users.findFirst({
      where: {
        reset_password_token: token,
        reset_password_token_expiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 400 }
      );
    }

    // Hash da nova senha
    const hashedPassword = await hash(password, 10);

    // Atualizar senha e limpar token
    await db.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        reset_password_token: null,
        reset_password_token_expiry: null,
      },
    });

    return NextResponse.json(
      { success: true, message: "Senha redefinida com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[RESET_PASSWORD_CONFIRM_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao redefinir senha" },
      { status: 500 }
    );
  }
}
