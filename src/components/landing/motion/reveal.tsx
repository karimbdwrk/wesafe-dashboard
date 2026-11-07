"use client";

import type { ReactNode } from "react";

import { motion } from "motion/react";

import { spring } from "./springs";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Position dans un groupe : décale légèrement l'apparition. */
  index?: number;
  /** Distance parcourue depuis le bas (même sens que le scroll). */
  y?: number;
  /** Échelle de départ, pour les gros visuels (mockups). */
  scale?: number;
  /** `false` : visible dès le premier rendu (texte du hero, pour le LCP). */
  fade?: boolean;
};

/**
 * Îlot client minimal : les enfants restent rendus côté serveur.
 * Toutes les apparitions montent depuis le bas, dans le sens du scroll.
 */
export function Reveal({ children, className, index = 0, y = 24, scale = 1, fade = true }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: fade ? 0 : 1, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ ...spring.reveal, delay: index * 0.06 }}
    >
      {children}
    </motion.div>
  );
}
