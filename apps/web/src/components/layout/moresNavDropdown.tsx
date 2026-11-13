"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface MoresNavDropdownProps {
  items: NavItem[];
}

export default function MoresNavDropdown({ items }: MoresNavDropdownProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  const active = items.some((item) => pathname.startsWith(item.href));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm transition-colors duration-150",
          active
            ? "bg-surface font-medium text-text"
            : "text-muted hover:bg-surface/60 hover:text-text",
        )}
      >
        Mores
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 text-muted transition-transform duration-150",
            open && "rotate-90",
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-1.5 w-48 rounded-lg border border-border bg-popover p-1 shadow-lg"
        >
          {items.map((item) => {
            const itemActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                aria-current={itemActive ? "page" : undefined}
                className={cn(
                  "block rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  itemActive
                    ? "bg-surface font-medium text-text"
                    : "text-muted hover:bg-surface hover:text-text",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
