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
    console.log("[PREFERENCES_GET] Session:", session);

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

    console.log("[PREFERENCES_GET] User found:", user);

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

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("[PREFERENCES_GET] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    console.log("[PREFERENCES_PATCH] Session:", session);

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

    console.log("[PREFERENCES_PATCH] User found:", user);

    if (!user) {
      console.log("[PREFERENCES_PATCH] User not found");
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await req.json();
    console.log("[PREFERENCES_PATCH] Request body:", body);

    const validatedFields = preferencesSchema.safeParse(body);
    console.log("[PREFERENCES_PATCH] Validated fields:", validatedFields);

    if (!validatedFields.success) {
      return new NextResponse("Dados inválidos", { status: 400 });
    }

    const preferences = await db.user_preferences.upsert({
      where: {
        user_id: session.user.id,
      },
      create: {
        user_id: session.user.id,
        ...validatedFields.data,
      },
      update: validatedFields.data,
    });

    console.log("[PREFERENCES_PATCH] Updated preferences:", preferences);
    return NextResponse.json(preferences);
  } catch (error) {
    console.error("[PREFERENCES_PATCH] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
