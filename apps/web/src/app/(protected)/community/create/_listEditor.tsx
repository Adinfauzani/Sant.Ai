"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@santai/ui/input";
import { Button } from "@santai/ui/button";

interface Props {
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
  max?: number;
}

export default function ListEditor({ placeholder, items, onChange, max = 30 }: Props) {
  const [value, setValue] = useState("");

  function add() {
    const item = value.trim();
    if (!item) return;
    if (items.includes(item) || items.length >= max) return;
    onChange([...items, item]);
    setValue("");
  }

  return (
    <div>
      <div className="flex gap-2">
        <Input
          className="flex-1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={add}
          disabled={!value.trim() || items.length >= max}
          className="shrink-0 gap-1"
        >
          <Plus className="size-3.5" /> Tambah
        </Button>
      </div>

      {items.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {items.map((item) => (
            <li key={item} className="group flex items-center gap-2 rounded-lg border border-border bg-surface/40 px-3 py-2">
              <span className="flex-1 text-xs text-text">{item}</span>
              <button
                type="button"
                onClick={() => onChange(items.filter((i) => i !== item))}
                className="text-muted transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                aria-label={`Hapus ${item}`}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[10px] text-muted">{items.length}/{max}</p>
    </div>
  );
}