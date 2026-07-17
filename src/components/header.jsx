"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { supabase } from "../lib/supabase/supabaseClient";

const navLinks = [
  { label: "Offres", href: "/jobs" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "À Propos", href: "/a-propos" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 backdrop-blur-xl transition-colors duration-300 ${
        scrolled ? "border-border/60 border-b bg-background/75" : "border-b border-transparent bg-background/40"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/wesafe-recruitment-logo.svg"
            alt="WeSafe Recruitment"
            width={140}
            height={39}
            className="h-8 w-auto dark:invert"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
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
          <Button
            size="sm"
            className="rounded-[16px] bg-linear-to-r from-primary to-brand-secondary px-5 text-primary-foreground shadow-[0_4px_20px_-4px_var(--brand-glow)] transition-all hover:shadow-[0_6px_28px_-4px_var(--brand-glow)] hover:brightness-110"
            onClick={() => document.getElementById("telecharger")?.scrollIntoView({ behavior: "smooth" })}
          >
            Télécharger
          </Button>
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
        </div>

        <button
          type="button"
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-border/50 border-t bg-background md:hidden"
          >
            <nav className="flex flex-col gap-4 px-6 pt-4 pb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                {isAuthenticated ? (
                  <Link href="/dashboard/default">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                      Se connecter
                    </Button>
                  </Link>
                )}
                <Button
                  size="sm"
                  className="rounded-[16px] bg-linear-to-r from-primary to-brand-secondary text-primary-foreground"
                  onClick={() => {
                    setMobileOpen(false);
                    document.getElementById("telecharger")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Télécharger
                </Button>
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
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
