"use client";

import type { ReactNode } from "react";

import { MotionConfig } from "motion/react";

import { spring } from "./springs";

/**
 * Config Motion commune à la landing.
 * `reducedMotion="user"` : si l'utilisateur demande moins d'animations, Motion coupe
 * les transformations (déplacement, échelle) et ne garde que les fondus d'opacité.
 */
export function LandingMotion({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={spring.ui}>
      {children}
    </MotionConfig>
  );
}
