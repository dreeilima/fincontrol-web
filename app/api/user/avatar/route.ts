import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

// Função auxiliar para converter base64 para arquivo e fazer upload
const uploadBase64Image = async (base64String: string): Promise<string> => {
  // Aqui você pode implementar o upload para um serviço de armazenamento como:
  // - Vercel Blob Storage
  // - AWS S3
  // - Cloudinary
  // - Uploadcare
  // etc.

  // Para simplificar, vamos apenas retornar a URL de base64 diretamente
  // Em produção, você deve substituir isso por uma implementação real de upload
  return base64String;
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { avatarBase64 } = body;

    if (!avatarBase64) {
      return NextResponse.json(
        { error: "Imagem de avatar não fornecida" },
        { status: 400 },
      );
    }

    // Upload da imagem (em produção, substitua pela implementação real)
    const avatarUrl = await uploadBase64Image(avatarBase64);

    // Atualiza o usuário com a nova URL de avatar
    const updatedUser = await db.users.update({
      where: { id: session.user.id },
      data: {
        avatar_url: avatarUrl,
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

    console.log("Avatar atualizado:", JSON.stringify(formattedUser));

    // Força a revalidação de todas as rotas relacionadas ao usuário
    try {
      revalidatePath("/dashboard", "layout");
      revalidatePath("/settings", "layout");
      revalidatePath("/admin", "layout");
      revalidateTag("user-data");
    } catch (revalidateError) {
      console.error("Erro ao revalidar caminhos:", revalidateError);
    }

    return NextResponse.json({
      ...formattedUser,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Erro ao atualizar avatar:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar avatar" },
      { status: 500 },
    );
  }
}
