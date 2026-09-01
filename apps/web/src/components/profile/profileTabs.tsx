"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@santai/ui/scrollArea";

export const PROFILE_TABS = [
  { key: "overview", label: "Overview" },
  { key: "projects", label: "Projects" },
  { key: "articles", label: "Articles" },
  { key: "activity", label: "Activity" },
  { key: "achievements", label: "Achievements" },
] as const;

export type ProfileTabKey = (typeof PROFILE_TABS)[number]["key"];

interface Props {
  username: string;
  defaultTab: ProfileTabKey;
  children: React.ReactNode[];
}

export default function ProfileTabs({ username, defaultTab, children }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<ProfileTabKey>(defaultTab);

  function selectTab(key: ProfileTabKey) {
    setActive(key);
    const base = `/${username}`;
    router.replace(key === "overview" ? base : `${base}?tab=${key}`, { scroll: false });
  }

  return (
    <div>
      <ScrollArea className="w-full">
        <div className="flex gap-1 border-b border-border pb-px">
          {PROFILE_TABS.map((tab) => {
            const isActive = tab.key === active;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => selectTab(tab.key)}
                className={cn(
                  "relative shrink-0 cursor-pointer px-4 py-2.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-text" : "text-muted hover:text-text",
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="mt-6">
        {children.map((panel, i) => (
          <div key={PROFILE_TABS[i].key} className={cn(PROFILE_TABS[i].key !== active && "hidden")}>
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
