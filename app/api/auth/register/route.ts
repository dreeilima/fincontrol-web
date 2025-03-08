import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Verificar se usuário já existe
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já está em uso" },
        { status: 400 },
      );
    }

    // Hash da senha
    const hashedPassword = await hash(password, 10);

    // Criar usuário com role padrão USER
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.USER, // Definindo a role padrão
      },
    });

    return NextResponse.json(
      { message: "Usuário criado com sucesso" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar usuário:", error); // Log detalhado do erro
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 },
    );
  }
}
