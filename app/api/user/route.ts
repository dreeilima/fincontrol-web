import { revalidatePath, revalidateTag } from "next/cache";
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
        role: true,
        phone: true,
        stripe_customer_id: true,
        stripe_subscription_id: true,
        stripe_price_id: true,
        stripe_current_period_end: true,
      },
    });

    // Log para debug
    console.log("Usuário atualizado:", JSON.stringify(updatedUser));

    // Se o email foi alterado, força o logout para atualizar a sessão
    if (email && email !== session.user.email) {
      await signOut();
      return NextResponse.json({
        ...updatedUser,
        requiresReauth: true,
      });
    }

    // Retorna o usuário atualizado para que o cliente possa atualizar o contexto
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

// Implementação do método PUT (substituição completa)
export async function PUT(request: Request) {
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

    // Busca o usuário atual para garantir que temos todos os dados
    const currentUser = await db.users.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // Atualiza o usuário com o PUT (substituição completa)
    const updatedUser = await db.users.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        email: email || currentUser.email, // mantém o email atual se não for fornecido
        // Mantém os outros campos inalterados
        phone: currentUser.phone,
        password: currentUser.password,
        role: currentUser.role,
        avatar_url: currentUser.avatar_url,
        stripe_customer_id: currentUser.stripe_customer_id,
        stripe_subscription_id: currentUser.stripe_subscription_id,
        stripe_price_id: currentUser.stripe_price_id,
        stripe_current_period_end: currentUser.stripe_current_period_end,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar_url: true,
        stripe_customer_id: true,
        stripe_subscription_id: true,
        stripe_price_id: true,
        stripe_current_period_end: true,
      },
    });

    // Formata o papel do usuário para o padrão do cliente
    const formattedUser = {
      ...updatedUser,
      role: updatedUser.role === "ADMIN" ? "admin" : "user",
    };

    console.log("Usuário atualizado (PUT):", JSON.stringify(formattedUser));

    // Força a revalidação de todas as rotas relacionadas ao usuário
    try {
      // Tenta revalidar diretamente, sem importar o result
      revalidatePath("/dashboard", "layout");
      revalidatePath("/settings", "layout");
      revalidatePath("/admin", "layout");
      revalidateTag("user-data");
    } catch (revalidateError) {
      console.error("Erro ao revalidar caminhos:", revalidateError);
      // Continua apesar do erro de revalidação
    }

    // Se o email foi alterado, força o logout para atualizar a sessão
    if (email && email !== session.user.email) {
      await signOut();
      return NextResponse.json({
        ...formattedUser,
        requiresReauth: true,
        timestamp: Date.now(),
      });
    }

    return NextResponse.json({
      ...formattedUser,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário (PUT):", error);
    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 },
    );
  }
}
