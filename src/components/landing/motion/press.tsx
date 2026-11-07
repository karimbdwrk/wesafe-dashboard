"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

import { spring } from "./springs";

type PressProps = {
  children: ReactNode;
  className?: string;
  /** Échelle à l'appui. */
  scale?: number;
  /** Soulèvement au survol (px), souris uniquement : Motion ignore le hover tactile. */
  lift?: number;
  /** `false` pour un élément non cliquable : survol seulement, pas de retour d'appui trompeur. */
  tap?: boolean;
};

/**
 * Retour immédiat à l'appui (pointerdown, pas au relâchement), par spring donc
 * interruptible : relâcher en plein milieu repart de l'échelle affichée.
 * Avec « réduire les animations », l'échelle devient une baisse d'opacité.
 */
export function Press({ children, className, scale = 0.97, lift = 0, tap = true }: PressProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn("inline-flex touch-manipulation [-webkit-tap-highlight-color:transparent]", className)}
      whileTap={
        !tap ? undefined : reduce ? { opacity: 0.7, transition: spring.press } : { scale, transition: spring.press }
      }
      whileHover={lift && !reduce ? { y: -lift, transition: spring.snappy } : undefined}
      transition={spring.snappy}
    >
      {children}
    </motion.div>
  );
}
