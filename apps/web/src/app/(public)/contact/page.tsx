import Link from "next/link";
import { Calendar, Mail, MessageSquare } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { ScientificBackground } from "@santai/ui/scientificBackground";


const contacts = [
  {
    title: "Email",
    description: "Kirim pesan langsung ke tim Sant.Ai.",
    href: "mailto:hello@sant.ai",
    icon: Mail,
  },
  {
    title: "Community",
    description: "Bergabung dengan diskusi dan kolaborasi.",
    href: "/community",
    icon: MessageSquare,
  },
  {
    title: "Events",
    description: "Ikuti workshop, seminar, dan hackathon.",
    href: "/events",
    icon: Calendar,
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden section-padding">
          <ScientificBackground variant="knowledge" className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </ScientificBackground>
          <div className="container-main relative">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 editorial-label">Contact</p>
              <h1 className="editorial-xl text-text">Hubungi kami</h1>
              <p className="mt-4 editorial-body mx-auto text-muted">
                Punya pertanyaan, ide, atau ingin berkolaborasi? Tim Sant.Ai siap membantu.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-border section-padding">
          <div className="container-main">
            <div className="grid gap-6 md:grid-cols-3">
              {contacts.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-sm font-bold text-text">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{item.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
