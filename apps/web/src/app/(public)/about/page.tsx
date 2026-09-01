"use client";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";

import { AboutHero } from "@santai/ui/custom/aboutHero";
import { AboutProblem } from "@santai/ui/custom/aboutProblem";
import { AboutEcosystems } from "@santai/ui/custom/aboutEcosystems";
import { AboutWorkflow } from "@santai/ui/custom/aboutWorkflow";
import { AboutValues } from "@santai/ui/custom/aboutValues";
import { AboutEngineering } from "@santai/ui/custom/aboutEngineering";
import { AboutRoadmap } from "@santai/ui/custom/aboutRoadmap";
import { AboutImpact } from "@santai/ui/custom/aboutImpact";
import { AboutCta } from "@santai/ui/custom/aboutCta";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <AboutProblem />
        <AboutEcosystems />
        <AboutWorkflow />
        <AboutValues />
        <AboutEngineering />
        <AboutRoadmap />
        <AboutImpact />
        <AboutCta />
      </main>
      <Footer />
    </div>
  );
}
