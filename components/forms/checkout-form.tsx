"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { getStripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/shared/icons";

const checkoutSchema = z.object({
  cardNumber: z.string().min(16, "Número do cartão inválido"),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, "Data inválida (MM/YY)"),
  cardCvc: z.string().min(3, "CVC inválido"),
  name: z.string().min(1, "Nome é obrigatório"),
});

interface CheckoutFormProps {
  plan: {
    title: string;
    price: {
      monthly: number;
      yearly: number;
    };
    priceId: {
      test: {
        monthly: string;
        yearly: string;
      };
      production: {
        monthly: string;
        yearly: string;
      };
    };
  };
}

export function CheckoutForm({ plan }: CheckoutFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: plan.priceId.production.monthly, // ou yearly dependendo da escolha
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result?.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      toast.error("Erro ao processar pagamento");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome no cartão</FormLabel>
              <FormControl>
                <Input placeholder="João Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do cartão</FormLabel>
              <FormControl>
                <Input placeholder="4242 4242 4242 4242" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cardExpiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validade</FormLabel>
                <FormControl>
                  <Input placeholder="MM/YY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardCvc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVC</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600"
          disabled={isLoading}
        >
          {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
          Pagar{" "}
          {plan.price.monthly.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          /mês
        </Button>
      </form>
    </Form>
  );
}
