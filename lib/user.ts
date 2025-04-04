import { prisma } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
      select: {
        name: true,
        is_active: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.users.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};
