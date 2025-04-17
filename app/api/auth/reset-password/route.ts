import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";

import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

const resetPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = resetPasswordSchema.parse(body);

    // Verificar se o usuário existe
    const user = await db.users.findUnique({
      where: { email },
    });

    // Se o usuário não existir, retornamos uma resposta de sucesso para não revelar informações
    if (!user) {
      return NextResponse.json(
        { success: true, message: "Se o email existir, um link de recuperação será enviado" },
        { status: 200 }
      );
    }

    // Gerar token de redefinição de senha
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco de dados
    await db.users.update({
      where: { id: user.id },
      data: {
        reset_password_token: resetToken,
        reset_password_token_expiry: resetTokenExpiry,
      },
    });

    // Enviar email com link de redefinição
    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetToken,
    });

    return NextResponse.json(
      { success: true, message: "Se o email existir, um link de recuperação será enviado" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
