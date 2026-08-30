"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

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
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text outline-none placeholder:text-muted/50 focus:border-primary/30"
        />
        <button
          type="button"
          onClick={add}
          disabled={!value.trim() || items.length >= max}
          className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" /> Tambah
        </button>
      </div>

      {items.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {items.map((item) => (
            <li key={item} className="group flex items-center gap-2 rounded-lg border border-border bg-surface/40 px-3 py-2">
              <span className="flex-1 text-xs text-text">{item}</span>
              <button
                type="button"
                onClick={() => onChange(items.filter((i) => i !== item))}
                className="text-muted transition-colors hover:text-red-500"
                aria-label={`Hapus ${item}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[10px] text-muted">{items.length}/{max}</p>
    </div>
  );
}