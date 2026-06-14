import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/assets/hero.svg"
          alt=""
          className="h-[115%] w-full translate-y-8 object-cover object-top md:translate-y-12"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30" />
      </div>
      <div className="container-main relative z-10 flex min-h-[70vh] items-center md:min-h-[75vh]">
        <div className="max-w-xl py-16 md:py-24">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface/50 px-4 py-1.5 text-xs text-muted backdrop-blur-sm">
            Universitas Saintek Muhammadiyah
          </div>
          <h1 className="font-heading text-4xl font-bold leading-tight text-text md:text-6xl lg:text-4xl">
            Grow Your Community With,{" "}
            <span className="text-primary">SANTET</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            SANTET connects students from Sains Data, Teknik Informatika, and
            Sistem Informasi to collaborate on real-world projects. Build your
            portfolio, earn reputation, and create impact.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/showcase">
              <Button size="lg" className="gap-2">
                Explore Projects
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/showcase">
              <Button variant="outline" size="lg">
                View Showcase
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
