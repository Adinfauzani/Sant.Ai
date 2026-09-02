"use client";

import { useEffect, useState } from "react";

export function TypeCommand({ text, delay }: { text: string; delay: number }) {
  const [len, setLen] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const type = (i: number) => {
      if (cancelled) return;
      setLen(Math.min(i, text.length));
      if (i < text.length) timer = setTimeout(() => type(i + 1), 45);
    };

    setLen(0);
    timer = setTimeout(() => type(0), delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, delay]);

  return (
    <span>
      {text.slice(0, len)}
      <span className="terminal-cursor" />
    </span>
  );
}
