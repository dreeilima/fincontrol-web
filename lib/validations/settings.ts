import * as z from "zod";

export const settingsSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .regex(/^\d{11}$/, "Digite um telefone válido com DDD")
    .optional()
    .nullable(),
});
