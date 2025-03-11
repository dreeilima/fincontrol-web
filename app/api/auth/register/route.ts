import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    // Validar campos obrigatórios
    if (!name || !email || !phone || !password) {
      return new NextResponse("Todos os campos são obrigatórios", {
        status: 400,
      });
    }

    // Verificar se usuário já existe
    const existingUser = await db.users.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse("Email já cadastrado", { status: 400 });
    }

    // Verificar se telefone já existe
    const existingPhone = await db.users.findUnique({
      where: {
        phone,
      },
    });

    if (existingPhone) {
      return new NextResponse("Telefone já cadastrado", { status: 400 });
    }

    // Criar novo usuário
    const hashedPassword = await hash(password, 10);
    const user = await db.users.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Erro ao criar usuário", { status: 500 });
  }
}
