"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Moon, Smartphone, Sun, X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion, useScroll, useTransform } from "motion/react";

import { MenuToggle } from "@/components/landing/menu-toggle";
import { Press } from "@/components/landing/motion/press";
import { spring } from "@/components/landing/motion/springs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { WesafeLogo } from "@/components/wesafe-logo";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { supabase } from "../lib/supabase/supabaseClient";

const APPSTORE_URL = "https://apps.apple.com/fr/app/wesafe-recruitment/id6737527469";
const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=com.aizensecu.wesafe";

const navLinks = [
  { label: "Offres", href: "/jobs" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const pathname = usePathname();
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);

  // Lié au scroll sans re-render React : le matériau s'épaissit, le bord apparaît en fondu.
  const { scrollY } = useScroll();
  const materialOpacity = useTransform(scrollY, [0, 32], [0.55, 1]);
  const edgeOpacity = useTransform(scrollY, [0, 32], [0, 1]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    checkSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    persistPreference("theme_mode", next);
  };

  const handleDownloadClick = () => {
    if (pathname === "/") {
      document.getElementById("telecharger")?.scrollIntoView({ behavior: "smooth" });
    } else {
      setDownloadOpen(true);
    }
  };

  return (
    <MotionConfig reducedMotion="user" transition={spring.ui}>
      <header className="fixed top-0 right-0 left-0 z-50">
        {/* Voile derrière le menu mobile : tap = fermer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="scrim"
              className="fixed inset-0 bg-black/25 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* Matériau sur un calque à part : pas de backdrop-filter sur <header>, pour ne pas casser les enfants en position fixe */}
        <motion.div
          className="material-chrome absolute inset-0"
          style={{ opacity: materialOpacity }}
          aria-hidden="true"
        />
        {/* Bord de scroll : dégradé doux au lieu d'une bordure dure */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-full h-4 bg-linear-to-b from-foreground/[0.06] to-transparent"
          style={{ opacity: mobileOpen ? 0 : edgeOpacity }}
          aria-hidden="true"
        />

        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Press>
            <Link href="/" className="flex items-center">
              <WesafeLogo width={116} height={39} className="h-8 w-auto" priority />
            </Link>
          </Press>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Press key={link.href} scale={0.95}>
                <Link
                  href={link.href}
                  className="font-medium text-[0.875rem] text-muted-foreground tracking-[-0.005em] transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </Press>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Press>
              {isAuthenticated ? (
                <Link href="/dashboard/default">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Se connecter
                  </Button>
                </Link>
              )}
            </Press>
            <Press>
              <Button
                size="sm"
                className="rounded-[16px] bg-linear-to-r from-primary to-brand-secondary px-5 text-primary-foreground shadow-[0_4px_20px_-4px_var(--brand-glow)] transition-[box-shadow,filter] hover:shadow-[0_6px_28px_-4px_var(--brand-glow)] hover:brightness-110"
                onClick={handleDownloadClick}
              >
                Télécharger
              </Button>
            </Press>
            <Press scale={0.9}>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={toggleTheme}
                aria-label="Changer de thème"
              >
                <Sun className="hidden h-4 w-4 dark:block" />
                <Moon className="block h-4 w-4 dark:hidden" />
              </Button>
            </Press>
          </div>

          <MenuToggle open={mobileOpen} onToggle={() => setMobileOpen((o) => !o)} className="md:hidden" />
        </div>

        {/* Menu mobile : sort de sous la barre et y retourne par le même chemin */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -12, scale: 0.98, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, scale: 0.98, filter: "blur(8px)" }}
              style={{ transformOrigin: "top center" }}
              className="material-thick absolute inset-x-3 top-full rounded-[24px] md:hidden"
            >
              <nav className="flex flex-col px-3 pt-2 pb-4">
                {navLinks.map((link) => (
                  <Press key={link.href} className="flex" scale={0.98}>
                    <Link
                      href={link.href}
                      className="w-full rounded-xl px-3 py-3 font-medium text-[1.0625rem] text-foreground tracking-[-0.01em] active:bg-foreground/5"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </Press>
                ))}
                <div className="mt-3 flex flex-col gap-2 border-border/50 border-t px-1 pt-4">
                  <Press className="flex">
                    {isAuthenticated ? (
                      <Link href="/dashboard/default" className="w-full">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                          Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/auth/login" className="w-full">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                          Se connecter
                        </Button>
                      </Link>
                    )}
                  </Press>
                  <Press className="flex">
                    <Button
                      size="sm"
                      className="h-10 w-full rounded-[16px] bg-linear-to-r from-primary to-brand-secondary text-primary-foreground"
                      onClick={() => {
                        setMobileOpen(false);
                        handleDownloadClick();
                      }}
                    >
                      Télécharger
                    </Button>
                  </Press>
                  <Press className="flex">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 text-muted-foreground"
                      onClick={toggleTheme}
                    >
                      <Sun className="hidden h-4 w-4 dark:block" />
                      <Moon className="block h-4 w-4 dark:hidden" />
                      <span className="hidden dark:inline">Mode clair</span>
                      <span className="inline dark:hidden">Mode sombre</span>
                    </Button>
                  </Press>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popup téléchargement (hors homepage) */}
        <AlertDialog open={downloadOpen} onOpenChange={setDownloadOpen}>
          <AlertDialogContent className="max-w-sm text-center">
            <button
              type="button"
              onClick={() => setDownloadOpen(false)}
              className="absolute top-3 right-3 rounded-sm opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </button>
            <AlertDialogHeader className="items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <AlertDialogTitle className="text-xl">Téléchargez l&apos;application WeSafe</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
                Disponible gratuitement sur iOS et Android. Trouvez des missions, gérez vos contrats et boostez votre
                carrière depuis votre smartphone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
              <Button asChild className="w-full gap-2 rounded-[16px] bg-black text-white hover:bg-zinc-800">
                <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04l-.06.18zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Télécharger sur l&apos;App Store
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full gap-2 rounded-[16px]">
                <a href={PLAYSTORE_URL} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M3.18 23.76c.3.17.64.22.98.15l12.09-6.98-2.67-2.67-10.4 9.5zM.5 1.48C.19 1.82 0 2.33 0 3v18c0 .67.19 1.18.5 1.52l.08.08 10.08-10.08v-.24L.58 1.4l-.08.08zM20.27 10.43l-2.73-1.58-3 2.99 3 2.99 2.74-1.58c.78-.45.78-1.37-.01-1.82zM4.16.24L16.25 7.22l-2.67 2.67L3.18.39C3.48.32 3.86.07 4.16.24z" />
                  </svg>
                  Télécharger sur Google Play
                </a>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>
    </MotionConfig>
  );
}
