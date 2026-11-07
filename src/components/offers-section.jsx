"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Smartphone, X } from "lucide-react";

import { JobCard, JobCardSkeleton } from "@/components/job-card";
import { Press } from "@/components/landing/motion/press";
import { Reveal } from "@/components/landing/motion/reveal";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/lib/supabase/supabaseClient";

const APPSTORE_URL = "https://apps.apple.com/fr/app/wesafe-recruitment/id6737527469";
const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=com.aizensecu.wesafe";

const APPLY_TITLE = "Postulez depuis l'application";
const APPLY_DESCRIPTION =
  "Pour postuler à cette offre et suivre vos candidatures en temps réel, téléchargez l'application mobile WeSafe. Disponible gratuitement sur iOS et Android.";

function AppIcon() {
  return (
    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
      <Smartphone className="h-6 w-6 text-primary" />
    </div>
  );
}

function StoreButtons() {
  return (
    <>
      <Press className="flex w-full">
        <Button asChild className="h-11 w-full gap-2 rounded-[16px] bg-black text-white hover:bg-zinc-800">
          <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04l-.06.18zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Télécharger sur l&apos;App Store
          </a>
        </Button>
      </Press>
      <Press className="flex w-full">
        <Button asChild variant="outline" className="h-11 w-full gap-2 rounded-[16px]">
          <a href={PLAYSTORE_URL} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M3.18 23.76c.3.17.64.22.98.15l12.09-6.98-2.67-2.67-10.4 9.5zM.5 1.48C.19 1.82 0 2.33 0 3v18c0 .67.19 1.18.5 1.52l.08.08 10.08-10.08v-.24L.58 1.4l-.08.08zM20.27 10.43l-2.73-1.58-3 2.99 3 2.99 2.74-1.58c.78-.45.78-1.37-.01-1.82zM4.16.24L16.25 7.22l-2.67 2.67L3.18.39C3.48.32 3.86.07 4.16.24z" />
            </svg>
            Télécharger sur Google Play
          </a>
        </Button>
      </Press>
    </>
  );
}

/**
 * Mobile : sheet Vaul (glisser 1:1 pour fermer, projection de l'élan, élasticité).
 * Desktop : boîte de dialogue centrée.
 */
function ApplyPrompt({ open, onOpenChange }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="material-thick rounded-t-[28px] border-0 pb-[max(env(safe-area-inset-bottom),1rem)]">
          <DrawerHeader className="items-center pt-6 text-center">
            <AppIcon />
            <DrawerTitle className="text-headline text-[1.25rem]">{APPLY_TITLE}</DrawerTitle>
            <DrawerDescription className="mt-1 text-muted-foreground text-sm leading-relaxed">
              {APPLY_DESCRIPTION}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <StoreButtons />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm text-center">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </button>
        <AlertDialogHeader className="items-center">
          <AppIcon />
          <AlertDialogTitle className="text-headline text-[1.25rem]">{APPLY_TITLE}</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
            {APPLY_DESCRIPTION}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <StoreButtons />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function OffersSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    supabase
      .from("jobs")
      .select("*, companies(name, logo_url)")
      .eq("status", "published")
      .neq("isLastMinute", true)
      .order("sponsorship_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setJobs(data ?? []);
        setLoading(false);
      });
  }, []);

  // Mobile : rail horizontal natif ; grille dès md
  const railClass =
    "snap-rail -mx-6 mt-12 gap-3 px-6 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 md:mask-none lg:grid-cols-3";
  const itemClass = "flex w-[85%] md:w-auto";

  return (
    <section id="offres" className="relative border-border/60 border-t bg-secondary/30 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-primary">Offres d&apos;emploi</p>
          <h2 className="mt-4 text-title text-foreground">Des offres mises à jour en temps réel</h2>
          <p className="mt-4 text-body-lg text-muted-foreground">
            Offres classiques et missions last minute dans toute la France.
          </p>
        </Reveal>

        <Reveal className={railClass}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={itemClass}>
                  <div className="w-full">
                    <JobCardSkeleton />
                  </div>
                </div>
              ))
            : jobs.map((job) => (
                <div key={job.id} className={itemClass}>
                  <Press scale={0.98} className="flex w-full [&>article]:w-full">
                    <JobCard job={job} href={`/jobs/${job.id}`} onApply={() => setApplyOpen(true)} />
                  </Press>
                </div>
              ))}
        </Reveal>

        <div className="mt-10 text-center">
          <Press>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-[16px] border-border font-semibold text-foreground tracking-[-0.01em] hover:bg-secondary"
            >
              <Link href="/jobs">Voir toutes les offres</Link>
            </Button>
          </Press>
        </div>
      </div>

      <ApplyPrompt open={applyOpen} onOpenChange={setApplyOpen} />
    </section>
  );
}
