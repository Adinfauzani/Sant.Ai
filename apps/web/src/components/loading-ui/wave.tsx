import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Tinggi dasar tiap batang (persen) supaya gelombangnya tidak rata. */
const BAR_HEIGHTS = [42, 68, 100, 74, 48];

/**
 * Visualisasi aktivitas audio ala Loading UI. Batang memakai `currentColor`
 * dan bergerak sebagai indikator suara — bukan animasi loading generik.
 */
function Wave({
  className,
  bars = BAR_HEIGHTS.length,
  ...props
}: ComponentProps<"span"> & { bars?: number }) {
  return (
    <>
      <style>{`
        @keyframes loading-ui-wave {
          0%, 100% {
            transform: scaleY(0.35);
            opacity: 0.55;
          }

          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        [data-loading-ui="wave"] > span {
          transform-origin: center;
        }

        @media (prefers-reduced-motion: reduce) {
          [data-loading-ui="wave"] > span {
            animation: none !important;
            opacity: 0.8;
          }
        }
      `}</style>
      <span
        aria-hidden="true"
        data-loading-ui="wave"
        className={cn(
          "inline-flex items-center justify-center gap-[6%]",
          className,
        )}
        {...props}
      >
        {Array.from({ length: bars }, (_, index) => (
          <span
            key={index}
            className="w-[7%] min-w-0.5 rounded-full bg-current"
            style={{
              height: `${BAR_HEIGHTS[index % BAR_HEIGHTS.length]}%`,
              animation: "loading-ui-wave var(--duration, 1.1s) ease-in-out infinite",
              animationDelay: `calc(var(--delay, 110ms) * ${index})`,
            }}
          />
        ))}
      </span>
    </>
  );
}

export { Wave };
