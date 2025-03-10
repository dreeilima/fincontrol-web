import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como funciona o controle financeiro pelo WhatsApp?",
    answer:
      "É simples! Basta enviar mensagens com suas receitas e despesas para nosso número. Nosso sistema registra automaticamente e organiza tudo para você. Você também pode solicitar relatórios e consultar seu saldo a qualquer momento.",
  },
  {
    question: "Preciso instalar algum aplicativo?",
    answer:
      "Não! O Fincontrol funciona diretamente pelo WhatsApp. Você só precisa ter o WhatsApp instalado no seu celular, que provavelmente já tem.",
  },
  {
    question: "Como são protegidos meus dados financeiros?",
    answer:
      "Utilizamos criptografia de ponta a ponta e seguimos os mais rigorosos padrões de segurança bancária. Seus dados são armazenados de forma segura e nunca são compartilhados com terceiros.",
  },
  {
    question: "Posso mudar de plano depois?",
    answer:
      "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações entram em vigor no próximo ciclo de cobrança e você mantém todos os seus dados.",
  },

  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos cartões de crédito, PIX e boleto bancário. O pagamento é processado de forma segura através da plataforma Stripe.",
  },
  {
    question: "Posso usar em mais de um dispositivo?",
    answer:
      "Sim! Você pode usar o Fincontrol em qualquer dispositivo que tenha WhatsApp instalado, mantendo tudo sincronizado automaticamente.",
  },
  {
    question: "E se eu precisar de ajuda?",
    answer:
      "Nosso suporte está disponível diretamente pelo WhatsApp. Os planos Pro e Premium incluem atendimento prioritário e suporte VIP 24/7.",
  },
];

export function PricingFAQ() {
  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-12 text-center">
        <h2 className="font-heading text-3xl">Perguntas Frequentes</h2>
        <p className="mt-4 text-muted-foreground">
          Tire suas dúvidas sobre o Fincontrol
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
