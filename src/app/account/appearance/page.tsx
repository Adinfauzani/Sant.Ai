"use client";

import { useTheme } from "@/components/shared/theme-provider";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccountAppearancePage() {
  const { theme, toggle } = useTheme();

  const options = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
  ];

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h3 className="text-sm font-medium text-text">Theme</h3>
        <div className="mt-3 flex gap-3">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isActive = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={opt.id === "dark" && !isActive ? toggle : opt.id === "light" && !isActive ? toggle : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-4 py-3 text-xs transition-colors",
                  isActive
                    ? "border-primary bg-primary/10 text-text"
                    : "border-border text-muted hover:text-text",
                )}
              >
                <Icon className="h-4 w-4" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
