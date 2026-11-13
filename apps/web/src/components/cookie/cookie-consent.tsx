"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@santai/ui/button";
import { Card } from "@santai/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@santai/ui/sheet";
import { useCookieConsent } from "@/components/cookie/cookie-provider";
import CookiePreferencesDialog from "@/components/cookie/cookie-preferences-dialog";

export default function CookieConsent() {
  const { showBanner, acceptAll, rejectNonEssential, openPreferences } = useCookieConsent();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mounted || !showBanner) return null;

  if (isMobile) {
    return (
      <>
        <Sheet open={showBanner} onOpenChange={() => {}}>
          <SheetContent side="bottom" className="rounded-t-xl px-4 pb-8 pt-6" onInteractOutside={(e) => e.preventDefault()}>
            <SheetHeader className="mb-4 text-left">
              <div className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-primary" />
                <SheetTitle>Cookie Preferences</SheetTitle>
              </div>
              <SheetDescription>
                We use cookies to improve your experience, personalize content, analyze traffic, and enhance AI-powered features.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={acceptAll}>
                Accept All
              </Button>
              <Button variant="outline" size="sm" onClick={rejectNonEssential}>
                Reject Non-Essential
              </Button>
              <Button variant="ghost" size="sm" onClick={openPreferences}>
                Customize
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <CookiePreferencesDialog />
      </>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="w-[380px] p-5 shadow-xl">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Cookie className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-text">Cookie Preferences</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                We use cookies to improve your experience, personalize content, analyze traffic, and enhance AI-powered features.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button size="sm" className="w-full" onClick={acceptAll}>
              Accept All
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={rejectNonEssential}>
                Reject Non-Essential
              </Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={openPreferences}>
                Customize
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <CookiePreferencesDialog />
    </>
  );
}
