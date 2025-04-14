import { NextResponse } from "next/server";
import { auth, signOut } from "@/auth";

import { db } from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "O nome deve ter pelo menos 2 caracteres" },
        { status: 400 },
      );
    }

    // Verifica se o email já está em uso (se foi fornecido)
    if (email && email !== session.user.email) {
      const existingUser = await db.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Este email já está em uso" },
          { status: 400 },
        );
      }
    }

    // Atualiza o usuário
    const updatedUser = await db.users.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        email: email || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Se o email foi alterado, força o logout para atualizar a sessão
    if (email && email !== session.user.email) {
      await signOut();
      return NextResponse.json({
        ...updatedUser,
        requiresReauth: true,
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await db.users.delete({
      where: {
        id: session.user.id,
      },
    });

    await signOut();
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return NextResponse.json(
      { error: "Erro ao excluir usuário" },
      { status: 500 },
    );
  }
}
