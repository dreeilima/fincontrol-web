import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Atualizar plano gratuito
  await prisma.plans.updateMany({
    where: {
      name: {
        not: "Premium",
      },
    },
    data: {
      max_transactions: 10,
      can_create_categories: false,
    },
  });

  // Atualizar plano premium
  await prisma.plans.updateMany({
    where: {
      name: "Premium",
    },
    data: {
      max_transactions: null,
      can_create_categories: true,
    },
  });

  console.log("Planos atualizados com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
