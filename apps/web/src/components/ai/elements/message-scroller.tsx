"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ScrollerContextValue = {
  viewportRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  isAtBottom: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
};

const ScrollerContext = createContext<ScrollerContextValue | null>(null);

function useScroller() {
  const ctx = useContext(ScrollerContext);
  if (!ctx) {
    throw new Error("MessageScroller components must be used within MessageScroller");
  }
  return ctx;
}

const BOTTOM_THRESHOLD = 80;

function MessageScroller({ className, children }: { className?: string; children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  // Tracks whether the next content change should auto-scroll. We follow the
  // user's position: auto-scroll only while they're near the bottom.
  const followRef = useRef(true);

  const computeAtBottom = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_THRESHOLD;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
    followRef.current = true;
    setIsAtBottom(true);
  }, []);

  const handleScroll = useCallback(() => {
    const atBottom = computeAtBottom();
    followRef.current = atBottom;
    setIsAtBottom(atBottom);
  }, [computeAtBottom]);

  // Keep the view pinned to the bottom while the user stays there. Runs before
  // paint so streaming/growing content doesn't visibly jump.
  useLayoutEffect(() => {
    const content = contentRef.current;
    const viewport = viewportRef.current;
    if (!content || !viewport) return;

    const stick = () => {
      if (!followRef.current) return;
      viewport.scrollTop = viewport.scrollHeight;
    };

    stick();
    const observer = new ResizeObserver(stick);
    observer.observe(content);
    return () => observer.disconnect();
  });

  return (
    <ScrollerContext.Provider value={{ viewportRef, contentRef, isAtBottom, scrollToBottom }}>
      <div
        data-slot="message-scroller"
        className={cn("relative flex min-h-0 flex-1 flex-col overflow-hidden", className)}
      >
        {/* viewport gets the scroll handler through context-aware child */}
        <ScrollerScrollArea onScroll={handleScroll}>{children}</ScrollerScrollArea>
      </div>
    </ScrollerContext.Provider>
  );
}

function ScrollerScrollArea({
  onScroll,
  children,
}: {
  onScroll: () => void;
  children: ReactNode;
}) {
  const { viewportRef } = useScroller();
  return (
    <div
      ref={viewportRef}
      onScroll={onScroll}
      data-slot="message-scroller-viewport"
      className="size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain"
    >
      {children}
    </div>
  );
}

function MessageScrollerContent({ className, ...props }: ComponentProps<"div">) {
  const { contentRef } = useScroller();
  return (
    <div
      ref={contentRef}
      data-slot="message-scroller-content"
      className={cn(
        "mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-36 pt-6 md:px-6 md:pb-40",
        className,
      )}
      {...props}
    />
  );
}

function MessageScrollerItem({
  className,
  scrollAnchor: _scrollAnchor,
  messageId: _messageId,
  ...props
}: ComponentProps<"div"> & { scrollAnchor?: boolean; messageId?: string }) {
  return (
    <div
      data-slot="message-scroller-item"
      className={cn("min-w-0 shrink-0", className)}
      {...props}
    />
  );
}

function MessageScrollerButton({ className }: { className?: string }) {
  const { isAtBottom, scrollToBottom } = useScroller();
  return (
    <button
      type="button"
      onClick={() => scrollToBottom("smooth")}
      aria-label="Gulir ke bawah"
      className={cn(
        "absolute bottom-28 left-1/2 z-30 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background/95 text-text shadow-sm backdrop-blur transition-all duration-200 hover:bg-surface md:bottom-32",
        isAtBottom
          ? "pointer-events-none translate-y-2 scale-95 opacity-0"
          : "translate-y-0 scale-100 opacity-100",
        className,
      )}
    >
      <ArrowDown className="h-4 w-4" />
    </button>
  );
}

export {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useScroller as useMessageScroller,
};
