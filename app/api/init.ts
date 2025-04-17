import { initializeDefaultCategories } from "@/lib/init-default-categories";

// Inicializar categorias padrão quando o servidor iniciar
(async () => {
  try {
    console.log("Inicializando sistema...");
    await initializeDefaultCategories();
  } catch (error) {
    console.error("Erro ao inicializar sistema:", error);
  }
})();
