"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";

type MacbookFrameProps = {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
};

/**
 * CSS-drawn MacBook Pro chrome (no photo/mockup asset). `children` renders
 * the recreated screen content — keeps the hero free of stock imagery.
 */
export function MacbookFrame({ children, className = "", tilt = true }: MacbookFrameProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ perspective: 1600 }}
      animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
      transition={reduceMotion ? undefined : { duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      {/* Glow */}
      <div
        className="-translate-x-1/2 absolute top-1/3 left-1/2 h-[70%] w-[85%] rounded-full blur-[90px]"
        style={{ backgroundColor: "var(--brand-glow)", opacity: 0.55 }}
        aria-hidden="true"
      />

      <div
        className="relative"
        style={{
          transform: tilt ? "rotateX(8deg) rotateY(-10deg) rotateZ(1deg)" : undefined,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Lid / bezel */}
        <div className="rounded-t-[14px] border-[10px] border-b-0 border-zinc-900 bg-zinc-900 shadow-2xl">
          <div className="flex items-center justify-center bg-zinc-950 py-[3px]">
            <span className="h-[3px] w-[3px] rounded-full bg-zinc-700" />
          </div>
          <div className="aspect-[16/10] overflow-hidden bg-background">{children}</div>
        </div>
        {/* Hinge + base */}
        <div className="relative h-[10px] rounded-b-[4px] bg-gradient-to-b from-zinc-800 to-zinc-900">
          <div className="-translate-x-1/2 absolute top-0 left-1/2 h-[10px] w-[22%] rounded-b-[6px] bg-zinc-950" />
        </div>
      </div>
    </motion.div>
  );
}
