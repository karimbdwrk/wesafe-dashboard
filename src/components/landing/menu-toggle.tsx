"use client";

import { motion } from "motion/react";

import { spring } from "./motion/springs";

type MenuToggleProps = {
  open: boolean;
  onToggle: () => void;
  className?: string;
};

/** Deux barres qui pivotent en croix ; interruptible si on tape à nouveau en cours de route. */
export function MenuToggle({ open, onToggle, className = "" }: MenuToggleProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={open}
      whileTap={{ scale: 0.9, transition: spring.press }}
      className={`-mr-2 flex h-10 w-10 touch-manipulation items-center justify-center text-foreground ${className}`}
    >
      <span className="relative block h-4 w-5" aria-hidden="true">
        <motion.span
          className="absolute top-[calc(50%-0.75px)] left-0 h-[1.5px] w-full rounded-full bg-current"
          initial={false}
          animate={open ? { y: 0, rotate: 45 } : { y: -4, rotate: 0 }}
          transition={spring.snappy}
        />
        <motion.span
          className="absolute top-[calc(50%-0.75px)] left-0 h-[1.5px] w-full rounded-full bg-current"
          initial={false}
          animate={open ? { y: 0, rotate: -45 } : { y: 4, rotate: 0 }}
          transition={spring.snappy}
        />
      </span>
    </motion.button>
  );
}
