import { Spiral } from "@/components/loading-ui/spiral";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <Spiral className="size-8 text-primary" />
      <p className="text-sm text-muted">Memuat halaman...</p>
    </div>
  );
}
