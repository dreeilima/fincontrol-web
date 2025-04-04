import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { db } from "@/lib/db";
import { createDefaultCategories } from "@/lib/utils/create-default-categories";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^55\d{10,11}$/, "Telefone deve incluir DDD e código do país (55)"),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body against schema
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      console.log("[VALIDATION_ERROR]", result.error.errors);
      return NextResponse.json(
        { error: "Dados inválidos", details: result.error.errors },
        { status: 400 },
      );
    }

    const { name, email, phone, password } = result.data;

    // Verifica se email ou telefone já existem
    const existingUser = await db.users.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      const errorMessage =
        existingUser.email === email
          ? "Email já está em uso"
          : "Telefone já está em uso";

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Cria o usuário
    const hashedPassword = await hash(password, 10);
    const user = await db.users.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    });

    // Criar categorias padrão para o novo usuário
    await createDefaultCategories(user.id);

    return NextResponse.json(
      {
        success: true,
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[REGISTRATION_ERROR]", error);
    return NextResponse.json({ error: "Erro ao criar conta" }, { status: 500 });
  }
}
