import type { Transition } from "motion/react";

/**
 * Springs de la landing. `bounce: 0` ≈ amortissement critique (damping 1.0) :
 * aucun dépassement, réservé à tout ce qui n'a pas été « lancé » par l'utilisateur.
 * `visualDuration` ≈ le paramètre « response » d'Apple (ce n'est pas une durée fixe).
 */
export const spring = {
  /** Déplacements / apparitions par défaut. */
  ui: { type: "spring", bounce: 0, visualDuration: 0.4 },
  /** Apparitions au scroll, un peu plus posées. */
  reveal: { type: "spring", bounce: 0, visualDuration: 0.55 },
  /** Petits éléments (icônes, chevrons, messages). */
  snappy: { type: "spring", bounce: 0, visualDuration: 0.25 },
  /** Retour à l'appui : immédiat. */
  press: { type: "spring", bounce: 0, visualDuration: 0.12 },
  /** Uniquement après un geste avec élan (flick, lancer). */
  momentum: { type: "spring", bounce: 0.2, visualDuration: 0.3 },
} as const satisfies Record<string, Transition>;
