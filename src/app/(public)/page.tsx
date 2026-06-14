import Link from "next/link";
import { ArrowRight, Lightbulb, Users, Award } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import MarqueeSection from "@/components/sections/marquee";
import StudyCards from "@/components/sections/study-cards";
import Blog from "@/components/sections/blog";
import HowItWorks from "@/components/sections/how-it-works";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "3", label: "Study Programs" },
  { value: "SD, TI, SI", label: "Cross-Major Collaboration" },
  { value: "Project-Based", label: "Learning Ecosystem" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />

        <section className="border-y border-border bg-surface">
          <div className="container-main py-10">
            <div className="grid grid-cols-3 gap-6 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-heading text-lg font-bold text-text md:text-2xl">{s.value}</p>
                  <p className="text-[10px] text-muted md:text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <MarqueeSection />

        <div className="border-t border-border" />

        <StudyCards />

        <HowItWorks />

        <Blog />

        <section className="section-padding">
          <div className="container-main">
            <div className="rounded-xl border border-border bg-surface p-8 text-center md:p-12">
              <h2 className="font-heading text-3xl font-bold text-text">
                Ready to Collaborate?
              </h2>
              <p className="mt-3 text-sm text-muted">
                Join SANTET and start building real projects with peers across study programs.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/showcase">
                  <Button variant="outline" size="lg">
                    View Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
