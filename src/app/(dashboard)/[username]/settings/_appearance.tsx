"use client";

import { useTheme } from "@/components/shared/themeProvider";
import { Sun, Moon, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppearanceSection() {
  const { theme, toggle } = useTheme();

  const options = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
  ];

  const handleToggle = (id: string) => {
    if ((id === "dark" && theme === "light") || (id === "light" && theme === "dark")) {
      toggle();
    }
  };

  return (
    <section className="rounded-lg border border-border bg-surface/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Palette className="h-4 w-4 text-muted" />
        <h2 className="text-sm font-semibold text-text">Appearance</h2>
      </div>
      <div className="mt-3 flex gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = theme === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleToggle(opt.id)}
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
    </section>
  );
}
