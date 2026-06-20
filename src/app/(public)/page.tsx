import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HowItWorksCarousel from "@/components/shared/how-it-works-carousel";
import ProgramCarousel from "@/components/shared/program-carousel";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="section-padding">
          <div className="container-main">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
                Universitas Saintek Muhammadiyah
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-text md:text-5xl lg:text-6xl">
                Grow Your Community With,{" "}
                <span className="text-primary">Sant.Ai</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
                Sant.Ai connects students from Sains Data, Teknik Informatika, and
                Sistem Informasi to collaborate on real-world projects. Build your
                portfolio, earn reputation, and create impact.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Explore Projects <ArrowRight className="h-4 w-4" />
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

        {/* Programs */}
        <section className="section-padding" id="programs">
          <div className="container-main">
            <div className="section-header">
              <p className="section-label">Programs</p>
              <h2 className="section-title">Three programs, one ecosystem</h2>
              <p className="section-desc">
                Each program brings a unique perspective. Together, they form a complete technology team.
              </p>
            </div>
            <ProgramCarousel />
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t border-border py-20">
          <div className="container-main">
            <div className="section-header">
              <p className="section-label">How it works</p>
              <h2 className="section-title">From idea to impact</h2>
              <p className="section-desc">
                A simple workflow that turns your project ideas into real impact.
              </p>
            </div>
            <HowItWorksCarousel />
          </div>
        </section>

        {/* Community / CTA */}
        <section className="border-t border-border py-16 md:py-20">
          <div className="container-main">
            <div className="rounded-lg border border-border p-6 text-center md:p-10 xl:p-14">
              <p className="section-label">Community</p>
              <h2 className="section-title">Join the ecosystem</h2>
              <p className="section-desc mx-auto">
                Be part of a growing community of builders, creators, and innovators.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2 sm:w-auto">
                    Get started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/community" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore community
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
