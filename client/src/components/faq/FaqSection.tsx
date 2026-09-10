import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "./faqData";

export function FaqSection() {
  return (
    <section
      id="faq"
      className="bg-bb-elevated px-5 py-24 sm:px-8 lg:px-12 lg:py-28"
      data-testid="section-faq"
    >
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-3xl font-black tracking-tight text-bb-text sm:text-4xl">
          Frequently Asked Questions
        </h2>

        <Accordion
          type="single"
          collapsible
          className="mt-12 w-full"
          data-testid="accordion-faq"
        >
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-bb-border"
            >
              <AccordionTrigger
                className="py-5 text-left text-base font-semibold text-bb-text hover:no-underline [&[data-state=open]]:text-bb-primary"
                data-testid={`faq-trigger-${item.id}`}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent
                className="pb-5 text-bb-muted leading-relaxed"
                data-testid={`faq-content-${item.id}`}
              >
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
