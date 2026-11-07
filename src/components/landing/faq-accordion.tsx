"use client";

import { useState } from "react";

import { ChevronDownIcon } from "lucide-react";
import { motion } from "motion/react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import { Press } from "./motion/press";
import { spring } from "./motion/springs";

type FaqItem = { q: string; a: string };

/**
 * Radix garde le clavier et l'ARIA ; Motion anime la hauteur par spring.
 * Interruptible : rouvrir pendant la fermeture repart de la hauteur affichée.
 */
export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const [open, setOpen] = useState("");

  return (
    <AccordionPrimitive.Root type="single" collapsible value={open} onValueChange={setOpen}>
      {items.map((item) => {
        const isOpen = open === item.q;
        return (
          <AccordionPrimitive.Item key={item.q} value={item.q} className="border-border/60 border-b last:border-b-0">
            <AccordionPrimitive.Header className="flex">
              <Press scale={0.99} className="flex flex-1">
                <AccordionPrimitive.Trigger className="flex flex-1 items-start justify-between gap-4 rounded-md py-5 text-left text-[1rem] text-foreground text-headline outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                  {item.q}
                  <motion.span
                    className="mt-0.5 shrink-0 text-muted-foreground"
                    initial={false}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={spring.snappy}
                    aria-hidden="true"
                  >
                    <ChevronDownIcon className="size-4" />
                  </motion.span>
                </AccordionPrimitive.Trigger>
              </Press>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content forceMount asChild>
              <motion.div
                className="overflow-hidden"
                initial={false}
                animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                transition={spring.ui}
                inert={!isOpen}
              >
                <p className="pb-5 text-muted-foreground leading-relaxed">{item.a}</p>
              </motion.div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        );
      })}
    </AccordionPrimitive.Root>
  );
}
