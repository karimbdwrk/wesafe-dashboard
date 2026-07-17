"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";

type IphoneFrameProps = {
  children: ReactNode;
  className?: string;
  floatDelay?: number;
};

/**
 * CSS-drawn iPhone Pro chrome (no photo/mockup asset). `children` renders
 * the recreated screen content.
 */
export function IphoneFrame({ children, className = "", floatDelay = 0 }: IphoneFrameProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`relative ${className}`}
      animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: floatDelay }
      }
    >
      <div
        className="-translate-x-1/2 absolute top-1/4 left-1/2 h-[120%] w-[90%] rounded-full blur-[70px]"
        style={{ backgroundColor: "var(--brand-glow)", opacity: 0.5 }}
        aria-hidden="true"
      />

      <div className="relative w-[240px] rounded-[2.75rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl">
        {/* Dynamic island */}
        <div className="-translate-x-1/2 absolute top-[10px] left-1/2 z-10 h-[22px] w-[84px] rounded-full bg-zinc-950" />
        <div className="aspect-[9/19.5] overflow-hidden rounded-[2.1rem] bg-background">{children}</div>
      </div>
    </motion.div>
  );
}
