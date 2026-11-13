"use client";

import { cn } from "@/lib/utils";

const GREETING_SRC = "/Model/V2/ModelGreeting.webp";

export default function AimuGreeting({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "pointer-events-auto relative inline-grid h-16 w-16 place-items-center",
        className,
      )}
    >
      <img
        src={GREETING_SRC}
        alt="AI MU"
        draggable={false}
        onClick={onClick}
        className="greeting-face h-full w-full rounded-full object-contain"
      />
      <style>{`
        .greeting-face {
          animation: greeting-bounce 1.6s ease-in-out infinite,
                     greeting-glow 2.2s ease-in-out infinite;
        }
        @keyframes greeting-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          30%      { transform: translateY(-6%) rotate(-2deg); }
          55%      { transform: translateY(0) rotate(0deg); }
          70%      { transform: translateY(-3%) rotate(2deg) scale(1.02); }
        }
        @keyframes greeting-glow {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(37, 99, 235, 0.35)); }
          50%      { filter: drop-shadow(0 0 16px rgba(37, 99, 235, 0.65)); }
        }
      `}</style>
    </div>
  );
}
