import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Indikator "AI sedang mengetik" ala Loading UI. Titik memakai `currentColor`
 * supaya warna mengikuti konteks, dan seluruh animasi dimatikan saat pengguna
 * memilih reduced-motion.
 */
function Typing({
  className,
  dots = 3,
  ...props
}: ComponentProps<"span"> & { dots?: number }) {
  return (
    <>
      <style>{`
        @keyframes loading-ui-typing {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }

          50% {
            transform: translateY(-50%);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [data-loading-ui="typing"] > span[aria-hidden="true"] {
            animation: none !important;
            opacity: 0.7;
          }
        }
      `}</style>
      <span
        role="status"
        data-loading-ui="typing"
        className={cn("inline-flex items-center gap-[12%]", className)}
        {...props}
      >
        {Array.from({ length: dots }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="inline-block aspect-square grow rounded-full bg-current"
            style={{
              animation: "loading-ui-typing var(--duration, 1s) infinite",
              animationDelay: `calc(var(--delay, 160ms) * ${index})`,
            }}
          />
        ))}
        <span className="sr-only">Loading</span>
      </span>
    </>
  );
}

export { Typing };
