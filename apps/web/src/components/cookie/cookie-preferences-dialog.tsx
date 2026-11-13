"use client";

import { useState, useEffect } from "react";
import { Cookie, ShieldCheck, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@santai/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@santai/ui/sheet";
import { Button } from "@santai/ui/button";
import { Switch } from "@santai/ui/switch";
import { Separator } from "@santai/ui/separator";
import { Badge } from "@santai/ui/badge";
import { ScrollArea } from "@santai/ui/scrollArea";
import { useCookieConsent } from "@/components/cookie/cookie-provider";
import type { CookieCategories, CookieCategory } from "@/lib/consent/cookies";
import { CATEGORY_LABELS, DEFAULT_CATEGORIES } from "@/lib/consent/cookies";

const CATEGORIES: { key: CookieCategory; alwaysOn?: boolean }[] = [
  { key: "essential", alwaysOn: true },
  { key: "analytics" },
  { key: "performance" },
  { key: "functional" },
  { key: "aiPersonalization" },
];

export default function CookiePreferencesDialog() {
  const { isPreferencesOpen, setPreferencesOpen, preferences, saveCustom } = useCookieConsent();
  const [local, setLocal] = useState<CookieCategories>(preferences);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setLocal(preferences);
  }, [preferences]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleToggle = (key: CookieCategory) => {
    if (key === "essential") return;
    setLocal((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAcceptAll = () => {
    const all: CookieCategories = {
      essential: true,
      analytics: true,
      performance: true,
      functional: true,
      aiPersonalization: true,
    };
    saveCustom(all);
  };

  const handleRejectNonEssential = () => {
    saveCustom({ ...DEFAULT_CATEGORIES });
  };

  const handleSave = () => {
    saveCustom(local);
  };

  const content = (
    <>
      <div className="space-y-1">
        {CATEGORIES.map(({ key, alwaysOn }) => {
          const info = CATEGORY_LABELS[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-border bg-surface/50 px-4 py-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text">{info.label}</span>
                  {alwaysOn && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                      Always Active
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted">{info.description}</p>
              </div>
              <Switch
                checked={local[key]}
                onCheckedChange={() => handleToggle(key)}
                disabled={alwaysOn}
                aria-label={`Toggle ${info.label} cookies`}
              />
            </div>
          );
        })}
      </div>

      <Separator className="my-4" />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleRejectNonEssential}>
          Reject Non-Essential
        </Button>
        <Button variant="outline" size="sm" onClick={handleAcceptAll}>
          Accept All
        </Button>
        <Button size="sm" onClick={handleSave}>
          Save Preferences
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isPreferencesOpen} onOpenChange={setPreferencesOpen}>
        <SheetContent side="bottom" className="rounded-t-xl px-4 pb-8 pt-6">
          <SheetHeader className="mb-4 text-left">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              <SheetTitle>Cookie Preferences</SheetTitle>
            </div>
            <SheetDescription>
              Choose how we use cookies to enhance your experience.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="max-h-80 pr-2">{content}</ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isPreferencesOpen} onOpenChange={setPreferencesOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            <DialogTitle>Cookie Preferences</DialogTitle>
          </div>
          <DialogDescription>
            Choose how we use cookies to enhance your experience.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-80 pr-2">{content}</ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
