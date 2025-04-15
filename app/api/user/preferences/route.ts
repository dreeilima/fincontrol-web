import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const preferencesSchema = z.object({
  email_notifications: z.boolean().optional(),
  marketing_emails: z.boolean().optional(),
  transaction_alerts: z.boolean().optional(),
  budget_alerts: z.boolean().optional(),
  theme: z.string().optional(),
  language: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    console.log("[PREFERENCES_GET] Session:", session?.user?.id);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("[PREFERENCES_GET] User ID:", session.user.id);

    // Verificar se o usuário existe
    const user = await db.users.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    console.log("[PREFERENCES_GET] User found:", user?.id);

    if (!user) {
      console.log("[PREFERENCES_GET] User not found");
      return new NextResponse("User not found", { status: 404 });
    }

    const preferences = await db.user_preferences.findUnique({
      where: {
        user_id: session.user.id,
      },
    });

    console.log("[PREFERENCES_GET] Existing preferences:", preferences);

    if (!preferences) {
      console.log("[PREFERENCES_GET] Creating default preferences");
      // Create default preferences if they don't exist
      const defaultPreferences = await db.user_preferences.create({
        data: {
          user_id: session.user.id,
          email_notifications: true,
          marketing_emails: false,
          transaction_alerts: true,
          budget_alerts: true,
          theme: "light",
          language: "pt-BR",
        },
      });

      console.log(
        "[PREFERENCES_GET] Created default preferences:",
        defaultPreferences,
      );
      return NextResponse.json(defaultPreferences);
    }

    return NextResponse.json({
      email_notifications: preferences.email_notifications,
      marketing_emails: preferences.marketing_emails,
      transaction_alerts: preferences.transaction_alerts,
      budget_alerts: preferences.budget_alerts,
      theme: preferences.theme,
      language: preferences.language,
    });
  } catch (error) {
    console.error("[PREFERENCES_GET] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    console.log("[PREFERENCES_PATCH] Session:", session?.user?.id);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar se o usuário existe
    const user = await db.users.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    console.log("[PREFERENCES_PATCH] User found:", user?.id);

    if (!user) {
      console.log("[PREFERENCES_PATCH] User not found");
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await req.json();
    console.log("[PREFERENCES_PATCH] Request body:", body);

    const validatedFields = preferencesSchema.safeParse(body);

    if (!validatedFields.success) {
      console.log(
        "[PREFERENCES_PATCH] Validation failed:",
        validatedFields.error,
      );
      return new NextResponse("Dados inválidos", { status: 400 });
    }

    console.log("[PREFERENCES_PATCH] Validated fields:", validatedFields.data);

    // Garantir que os valores booleanos sejam salvos corretamente
    const dataToUpdate = {
      ...validatedFields.data,
      email_notifications: validatedFields.data.email_notifications === true,
      marketing_emails: validatedFields.data.marketing_emails === true,
      transaction_alerts: validatedFields.data.transaction_alerts === true,
      budget_alerts: validatedFields.data.budget_alerts === true,
    };

    console.log("[PREFERENCES_PATCH] Data to update:", dataToUpdate);

    // Verificar se as preferências já existem
    const existingPreferences = await db.user_preferences.findUnique({
      where: {
        user_id: session.user.id,
      },
    });

    console.log(
      "[PREFERENCES_PATCH] Existing preferences:",
      existingPreferences,
    );

    let preferences;

    if (existingPreferences) {
      // Atualizar preferências existentes
      preferences = await db.user_preferences.update({
        where: {
          user_id: session.user.id,
        },
        data: dataToUpdate,
      });
    } else {
      // Criar novas preferências
      preferences = await db.user_preferences.create({
        data: {
          user_id: session.user.id,
          ...dataToUpdate,
          theme: dataToUpdate.theme || "light",
          language: dataToUpdate.language || "pt-BR",
        },
      });
    }

    console.log("[PREFERENCES_PATCH] Updated preferences:", preferences);

    return NextResponse.json({
      email_notifications: preferences.email_notifications,
      marketing_emails: preferences.marketing_emails,
      transaction_alerts: preferences.transaction_alerts,
      budget_alerts: preferences.budget_alerts,
      theme: preferences.theme,
      language: preferences.language,
    });
  } catch (error) {
    console.error("[PREFERENCES_PATCH] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
