type AmbientBackgroundProps = {
  variant?: "hero" | "section";
  className?: string;
};

/**
 * Layered atmosphere (radial glow + grid + noise) for landing sections.
 * Place as the first child inside a `relative overflow-hidden` container.
 */
export function AmbientBackground({ variant = "section", className = "" }: AmbientBackgroundProps) {
  const isHero = variant === "hero";

  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute inset-0 bg-noise-texture mix-blend-overlay" />
      <div
        className={`-translate-x-1/2 absolute left-1/2 rounded-full blur-[120px] ${
          isHero ? "top-[-10%] h-[560px] w-[560px]" : "top-0 h-[380px] w-[380px]"
        }`}
        style={{ backgroundColor: "var(--brand-glow)", opacity: isHero ? 0.5 : 0.3 }}
      />
      {isHero && (
        <div
          className="-translate-x-1/2 absolute top-[35%] left-[70%] h-[420px] w-[420px] rounded-full blur-[130px]"
          style={{ backgroundColor: "var(--brand-accent)", opacity: 0.18 }}
        />
      )}
    </div>
  );
}
