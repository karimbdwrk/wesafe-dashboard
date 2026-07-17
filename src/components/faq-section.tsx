"use client";

import { motion } from "framer-motion";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQ } from "@/lib/pricing-data";

export function FaqSection() {
  return (
    <section id="faq" className="relative border-border/60 border-t bg-secondary/30 py-20 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-medium text-primary text-sm uppercase tracking-widest">FAQ</p>
          <h2 className="mt-4 text-balance font-(family-name:--font-heading) font-bold text-3xl text-foreground md:text-4xl">
            Questions fréquentes
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="mt-12 rounded-[24px] border border-border/70 bg-card/60 px-6 backdrop-blur-sm md:px-8"
        >
          <Accordion type="single" collapsible>
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-border/60">
                <AccordionTrigger className="font-semibold text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
