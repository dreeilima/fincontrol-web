import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criar plano gratuito
  await prisma.plans.create({
    data: {
      name: "Gratuito",
      description: "Plano gratuito com recursos básicos",
      price: 0,
      period: "MONTHLY",
      is_active: true,
      max_transactions: 10,
      can_create_categories: false,
      features: [
        "Até 10 transações por mês",
        "Categorias padrão",
        "Dashboard básico",
        "Relatórios simples",
      ],
      benefits: ["Sem custo", "Acesso básico ao sistema", "Suporte por email"],
      limitations: [
        "Limite de 10 transações",
        "Não pode criar categorias personalizadas",
        "Relatórios limitados",
      ],
    },
  });

  // Criar plano premium
  await prisma.plans.create({
    data: {
      name: "Premium",
      description: "Plano premium com recursos ilimitados",
      price: 19.9,
      period: "MONTHLY",
      is_active: true,
      max_transactions: null, // Ilimitado
      can_create_categories: true,
      features: [
        "Transações ilimitadas",
        "Categorias personalizadas",
        "Dashboard avançado",
        "Relatórios detalhados",
        "Exportação de dados",
        "Metas financeiras",
        "Análise de gastos",
      ],
      benefits: [
        "Sem limite de transações",
        "Categorias personalizadas",
        "Suporte prioritário",
        "Backup automático",
        "Acesso a recursos futuros",
      ],
      limitations: [],
    },
  });

  console.log("Planos criados com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
