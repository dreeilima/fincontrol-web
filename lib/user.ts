import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.users.findUnique({
      where: {
        email: email,
      },
      select: {
        name: true,
        email: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.users.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};
